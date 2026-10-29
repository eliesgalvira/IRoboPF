"""Reabre fuentes históricas por hash; no descarga ni modifica originales."""
import hashlib
import sys

from revisar import ROOT, SCRATCH, load, resolve, save, sha

sys.dont_write_bytecode = True
import pymupdf  # noqa: E402


def main():
    review = ROOT / 'docs/procedencia/revisiones/evidencias-estatales-v2'
    sources = load(review / 'cadena-normativa.json')['acquisitions']
    sources += [load(p) for p in (ROOT / 'docs/procedencia/evidencias/estatales/documentos').glob('*.json')]
    unique = {s['sha256']: s for s in sources}
    records = []
    pages = []
    for h, source in unique.items():
        path = resolve(h)
        raw = path.read_bytes()
        assert len(raw) == source['size'] and hashlib.sha512(raw).hexdigest() == source['sha512']
        url = source.get('canonicalUrl', source.get('url'))
        records.append({'path': str(path), 'sha256': h, 'sha512': source['sha512'], 'size': len(raw), 'url': url})
        if raw.startswith(b'%PDF'):
            # Reextraer todas las citas históricas y de ampliación asociadas.
            selected: dict[int, list] = {}
            candidates = [load(p) for p in (ROOT / 'docs/procedencia/evidencias/estatales/citas').glob('*.json')]
            candidates += load(review / 'citas-propias-ampliacion.json')
            candidates += [load(ROOT / r['path']) for r in load(ROOT / 'docs/procedencia/evidencias/estatales/contextos.json')]
            for c in candidates:
                if c['documentSha256'] == h:
                    selected.setdefault(c['page'], []).append(c)
            with pymupdf.open(path) as pdf:
                if url and 'BOE-A-2014-12327.pdf' in url:
                    for n in range(len(pdf)):
                        text = pdf[n].get_text('text', flags=0, sort=False)
                        if ('Treinta y nueve.' in text and '63' in text) or 'Disposición final sexta.' in text:
                            selected.setdefault(n + 1, [])
                for number, cites in selected.items():
                    page = pdf[number - 1]
                    for c in cites:
                        text = page.get_text('text', clip=pymupdf.Rect(c['bbox']), flags=0, sort=False)
                        assert text == c['quote']
                    png = page.get_pixmap(dpi=144, colorspace=pymupdf.csRGB, alpha=False, annots=False).tobytes('png')
                    if cites:
                        expected = cites[0].get('facsimileSha256', cites[0].get('facsimile', {}).get('sha256'))
                        assert sha(png) == expected
                    image_path = SCRATCH / (sha(png) + '.png')
                    image_path.write_bytes(png)
                    pages.append({'documentSha256': h, 'page': number, 'url': url, 'quote': page.get_text('text', flags=0, sort=False), 'facsimileSha256': sha(png), 'scratch': str(image_path), 'citationsReextracted': len(cites), 'geometry': list(page.rect), 'recipe': {'dpi': 144, 'pymupdf': pymupdf.VersionBind, 'flags': 0, 'sort': False, 'alpha': False, 'annots': False}})
        else:
            # Conservar original de índice informativo y búsquedas locales reproducibles.
            text = raw.decode('utf-8')
            snippets = []
            for token in ['id="a63"', 'BOE-A-2014-12327', 'BOE-A-2011-11641', 'BOE-A-2011-20638', 'BOE-A-2012-352', 'BOE-A-2014-2109']:
                start = 0
                for _ in range(12):
                    pos = text.find(token, start)
                    if pos < 0:
                        break
                    snippets.append({'token': token, 'offset': pos, 'text': text[max(0, pos-250):pos+450]})
                    start = pos + len(token)
            save('indice-' + h + '.json', {'source': str(path), 'sha256': h, 'snippets': snippets})
    save('fuentes-primarias.json', records)
    save('pasajes-primarios.json', pages)
    print({'fuentes': len(records), 'paginas': len(pages), 'citasReextraidas': sum(p['citationsReextracted'] for p in pages)})


if __name__ == '__main__':
    main()
