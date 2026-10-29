"""Muestra estratificada desde restauración propia; sin CAS alternativos."""
import gzip
import hashlib
import html
import json
import re
from typing import Any

from revisar import CACHE, ROOT, facts, save


def main():
    package = CACHE / 'restauracion'
    material = CACHE / 'metadatos'
    manifest = json.loads((package / 'manifest.json').read_bytes())
    objects = {o['sha256']: o for o in manifest['objects']}
    rows = json.loads((material / 'docs/procedencia/revisiones/retenciones-2015-2016-contraste-sol/citas-propias.json').read_bytes())
    sample = next(r for r in rows if r['sourceSha256Prefix'] == '82a57fd7' and r['selector'] == 'id="a84"')
    matches = [sha for sha in objects if sha.startswith(sample['sourceSha256Prefix'])]
    assert len(matches) == 1
    raw = (package / 'sha256' / matches[0]).read_text()
    chunks = re.split(r'<div[^>]+class="bloque"', raw)
    selected = [chunk for chunk in chunks if sample['selector'] in chunk[:300]]
    assert len(selected) == 1
    text = ' '.join(html.unescape(re.sub('<[^>]+>', ' ', selected[0])).split())
    assert text == sample['textNormalized']
    report: dict[str, Any] = {'html': dict(sha256=matches[0], selector=sample['selector'], exactNormalizedText=True, text=text, textSha256=hashlib.sha256(text.encode()).hexdigest()), 'samples': []}
    # Verificar transformación y metadatos por categorías, sin interpretar su contenido fiscal.
    categories = {
        'comprimido': next(d for d in manifest['dependencies'] if not d['historical'] and d['path'].endswith('.json.gz')),
        'indice-grande': next(d for d in manifest['dependencies'] if d['sourceSize'] > 24000000),
        'metadata-historica': next(d for d in manifest['dependencies'] if d['historical'] and d['path'].endswith('.json')),
    }
    for category, dep in categories.items():
        transported = material / dep['path']
        original = ROOT / dep['path']
        result = dict(category=category, dependency=dep, transported=facts(transported))
        if not dep['historical']:
            import edicion as e
            payload = original.read_bytes()
            decoded = gzip.decompress(payload) if dep['path'].endswith('.gz') else payload
            derived = e.p.encoded(e.clean(e.p.strict_json(decoded)))
            if dep['path'].endswith('.gz'):
                derived = gzip.compress(derived, mtime=0)
            result['derivationExact'] = derived == transported.read_bytes()
            assert result['derivationExact']
        report['samples'].append(result)
    secondary = next(o for o in manifest['objects'] if o['kind'] == 'captura-secundaria-URL-oficial')
    primary = next(o for o in manifest['objects'] if o['kind'] == 'documento-primario-candidato' and o['acquisitions'])
    for category, obj in [('primario', primary), ('secundario', secondary)]:
        report[category] = dict(object=obj, actual=facts(package / 'sha256' / obj['sha256']))
        if not obj['acquisitions']:
            historical = json.loads((material / 'heredado/manifest.json').read_bytes())
            inherited_object = next(o for o in historical['annex'] if o['sha256'] == obj['sha256'])
            report[category]['historicalAcquisitions'] = inherited_object['acquisitions']
            assert inherited_object['class'] == obj['kind']
        for event in obj['acquisitions']:
            dep = next(d for d in manifest['dependencies'] if d['sha256'] == event['dependency'])
            data = (material / dep['path']).read_bytes()
            assert event['sha256'].encode() in data
    # Las repeticiones del corte se describen sin sumarlas como evidencias.
    report['duplicatesActual'] = dict(
        acquisitions=sum(len(o['acquisitions']) - len({json.dumps(v, sort_keys=True) for v in o['acquisitions']}) for o in manifest['objects']),
        references=sum(len(o['references']) - len(set(o['references'])) for o in manifest['objects']),
        unresolved=len(manifest['unresolvedReferences']) - len({r['sha256'] for r in manifest['unresolvedReferences']}))
    save('muestras.json', report)
    print('HTML reconstruido, compresión e índice grande regenerados, muestras primarias/secundarias e históricas cotejadas')

if __name__ == '__main__':
    main()
