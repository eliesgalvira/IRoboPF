import copy
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from unittest.mock import patch

sys.path.insert(0, str(Path.cwd() / 'tools/procedencia'))
import corpus as c
import descargar as d
import pymupdf as p

base = Path('docs/procedencia/corpus')
root = base / 'fixtures'
r = json.loads((base / 'bocm-firmado.manifest.json').read_text())
ct = json.loads((base / 'bocm-celda.citation.json').read_text())
w = Path('../attacks')
w.mkdir(exist_ok=True)
out = {}


def reject(fn):
    try:
        fn()
        return False
    except (ValueError, OSError, KeyError) as e:
        return type(e).__name__
    except Exception as e:
        if type(e).__name__ == 'ValidationError':
            return 'ValidationError'
        raise


def clean(x):
    if isinstance(x, dict):
        return all(k.lower() not in {'cookie', 'authorization', 'set-cookie', 'proxy-authorization', 'x-private'} and clean(v) for k, v in x.items())
    return all(clean(v) for v in x) if isinstance(x, list) else True


out['accepted_api'] = reject(lambda: c.verify(r, ct, root, accepted=True))
run = subprocess.run([sys.executable, 'tools/procedencia/corpus.py', '--root', str(root), 'verify', str(base / 'bocm-firmado.manifest.json'), str(base / 'bocm-celda.citation.json'), '--accepted'], capture_output=True, text=True)
out['accepted_cli'] = {'exit': run.returncode, 'disabled': 'Aceptación deshabilitada' in run.stderr}
fake = copy.deepcopy(ct)
fake['semanticValidation'] = {'status': 'verified'}
fake['independentReview'] = {'status': 'verified', 'author': 'inventado', 'reviewer': 'otro', 'evidence': 'inexistente'}
out['fabricated'] = reject(lambda: c.verify(r, fake, root, accepted=True))
legacy = w / 'legacy'
(legacy / 'sha256').mkdir(parents=True, exist_ok=True)
(legacy / 'sha256' / r['sha256']).write_bytes((root / 'sha256' / r['sha256']).read_bytes())
record = copy.deepcopy(r)
record.pop('redirects', None)
record['headers'] = {'Set-Cookie': 'synthetic', 'Authorization': 'synthetic', 'X-Private': 'synthetic', 'ETag': 'synthetic'}
key = hashlib.sha256(record['canonicalUrl'].encode()).hexdigest()
d.atomic_json(legacy / 'urls' / (key + '.json'), record)
raw = (legacy / 'urls' / (key + '.json')).read_bytes()
imported = c.ingest(legacy, w / 'imported')[0]
public = c.public_document(imported)
out['import'] = {'clean': clean(imported), 'public_clean': clean(public), 'no_localPath': 'localPath' not in public, 'pending': imported['sourcePolicy']['status'], 'source_unchanged': raw == (legacy / 'urls' / (key + '.json')).read_bytes()}
out['cache_clean'] = clean(d.download(record['canonicalUrl'], w / 'imported'))
out['history_clean'] = all(clean(json.loads(f.read_text())) for f in (w / 'imported/history').rglob('*.json'))
with patch('descargar.time.sleep'):
    handler = d.Redirects(d.DEFAULT_HOSTS)
    handler.redirect_request(d.urllib.request.Request('https://www.boe.es/a'), None, 302, '', record['headers'], 'https://www.bocm.es/b')
    out['redirect_clean'] = clean(handler.chain)
for name, redirects, final in [('unknown', None, 'https://www.bocm.es/b'), ('broken', [], 'https://www.bocm.es/b'), ('foreign', [{'from': r['canonicalUrl'], 'to': 'https://example.org/a', 'status': 302}], 'https://example.org/a')]:
    candidate = dict(r, redirects=redirects, finalUrl=final)
    try:
        out['origin_' + name] = d.verify_origin(candidate, r['canonicalUrl'], d.DEFAULT_HOSTS)
    except ValueError:
        out['origin_' + name] = 'rejected'
for field, value in [('unknown', 1), ('authenticity', {'status': 'trusted'})]:
    candidate = dict(r)
    candidate[field] = value
    out['schema_' + field] = reject(lambda: c.verify(candidate, ct, root))
for field, value in [('dpi', 145), ('annots', True), ('pymupdf', '0.0')]:
    candidate = copy.deepcopy(ct)
    candidate['facsimile']['parameters'][field] = value
    out['recipe_' + field] = reject(lambda: c.verify(r, candidate, root))
for sign in ['−', '﹣', '－', '＋', '±', '-', '+', '\u207b', '\u208b']:
    text = sign + '8,50%'
    binding = {'number': {'start': 1, 'end': 5, 'literal': '8,50'}, 'numberFormat': 'es-ES', 'value': '8.50', 'unit': {'start': 5, 'end': 6, 'literal': '%'}, 'unitCode': 'percent'}
    out['token_U+' + format(ord(sign), '04X')] = reject(lambda: c.verify_binding(text, binding))
for rotation in (0, 90, 180, 270):
    with p.open() as doc:
        page = doc.new_page(width=400, height=500)
        page.set_cropbox(p.Rect(20, 30, 350, 450))
        page.insert_text((40, 60), 'Capa selectiva')
        page.set_rotation(rotation)
        box = [20, 30, 200, 90]
        clip = c.rect_checked(page, box) * page.rotation_matrix
        whole = page.get_pixmap(dpi=144, colorspace=p.csRGB, alpha=False, annots=False)
        crop = p.Pixmap(c.crop_bytes(page, box))
        x, y = int(clip.x0 * 2), int(clip.y0 * 2)
        expected = b''.join(whole.samples[(y + j) * whole.stride + x * 3:(y + j) * whole.stride + (x + crop.width) * 3] for j in range(crop.height))
        out['geometry_' + str(rotation)] = crop.samples == expected
out['renderer'] = c.renderer()
Path('../corpus-attacks.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(out, ensure_ascii=False, indent=2))
