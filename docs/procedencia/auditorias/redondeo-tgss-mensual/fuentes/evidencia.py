"""Reextrae citas y facsímiles de originales CAS sin cambiar esos originales."""
import hashlib
import json
import re
import subprocess
from pathlib import Path
import pymupdf

OUT = Path(__file__).resolve().parents[1]
SELECTION = {
    'euro-2001': {1: ['No obstante, los importes']},
    'orden-2025': {3: ['computarán', 'dividirá'], 4: ['4.909,50'], 16: ['0,67', '0,92', '0,77'], 17: ['0,98', '0,19']},
    'orden-2026': {16: ['1,15', '0,96', '1,22']},
    'bnr-07-2024': {3: ['La TGSS calculará', 'Estos Conceptos Económicos', 'Sobre estos Conceptos']},
    'bnr-09-2024': {2: ['modalidad de cotización mensual']},
    'bnr-01-2025': {7: ['No se recuperarán', 'Liquidaciones Complementarias']},
    'consulta-calculos': {19: ['Tanto en liquidaciones'], 24: ['En esta pantalla se visualizan']},
    'sld-especificaciones': {88: ['497', '498', '499'], 90: ['497', '498', '499'], 91: ['Cuotas acumuladas']},
    'rcb-2011': {10: ['Los importes se expresarán']},
    'bases-v2024': {}, 'calculos-v2021': {}, 'sld-calculos-detalle': {},
}


def main():
    records = json.loads((OUT / 'fuentes/documentos.json').read_text())
    citations: list[dict[str, object]] = []
    search = []
    signatures = []
    for r in records:
        if 'sha256' not in r:
            continue
        path = Path(r['localPath'])
        raw = path.read_bytes()
        assert hashlib.sha256(raw).hexdigest() == r['sha256']
        assert hashlib.sha512(raw).hexdigest() == r['sha512']
        if not raw.startswith(b'%PDF'):
            continue
        doc = pymupdf.open(path)
        sig = subprocess.run(['pdfsig', str(path)], capture_output=True, text=True, check=False)
        signatures.append({'id': r['id'], 'exitCode': sig.returncode, 'output': sig.stdout + sig.stderr,
                           'historicalTrust': 'no validada', 'csv': 'no comprobado'})
        for n, page in enumerate(doc, 1):
            text = page.get_text()
            matches = [m.group() for m in re.finditer(r'redonde\w*|trunc\w*|decimales|céntimos', text, re.I)]
            if matches:
                search.append({'document': r['id'], 'page': n, 'terms': matches})
            terms = SELECTION.get(r['id'], {}).get(n, [])
            if r['id'] in ('bases-v2024', 'calculos-v2021', 'sld-calculos-detalle'):
                terms = ['céntimos', 'decimales']
            for block in page.get_text('blocks'):
                if not any(term in block[4] for term in terms):
                    continue
                box = pymupdf.Rect(block[:4]) + (-1, -1, 1, 1)
                quote = page.get_textbox(box)
                ident = f'C{len(citations)+1:03d}'
                png = OUT / 'fuentes' / (ident + '.png')
                page.get_pixmap(dpi=120, clip=box, alpha=False).save(png)
                citations.append({'id': ident, 'document': r['id'], 'sha256': r['sha256'],
                                  'page': n, 'pageConvention': '1-based física',
                                  'bbox': list(box), 'coordinates': 'puntos PDF, origen superior izquierdo',
                                  'quote': quote, 'method': 'PyMuPDF get_textbox; capa de texto, no OCR',
                                  'crop': str(png.relative_to(OUT)), 'cropSha256': hashlib.sha256(png.read_bytes()).hexdigest(),
                                  'renderer': pymupdf.VersionBind, 'dpi': 120, 'alpha': False,
                                  'review': 'pendiente nueva revisión', 'fiscalAcceptance': False})
    # Páginas de contexto: el artículo 17 de 2025 continúa en la página 17.
    for document, pages in [('orden-2025', [3, 16, 17]), ('orden-2026', [16]), ('calculos-v2021', [22, 23, 43])]:
        record = next(r for r in records if r.get('id') == document)
        doc = pymupdf.open(record['localPath'])
        for n in pages:
            page = doc[n - 1]
            box = page.rect
            ident = f'C{len(citations)+1:03d}'
            png = OUT / 'fuentes' / (ident + '.png')
            page.get_pixmap(dpi=120, clip=box, alpha=False).save(png)
            citations.append({'id': ident, 'document': document, 'sha256': record['sha256'],
                              'page': n, 'pageConvention': '1-based física', 'bbox': list(box),
                              'coordinates': 'puntos PDF, origen superior izquierdo',
                              'quote': page.get_textbox(box), 'method': 'PyMuPDF get_textbox; capa de texto',
                              'crop': str(png.relative_to(OUT)), 'cropSha256': hashlib.sha256(png.read_bytes()).hexdigest(),
                              'renderer': pymupdf.VersionBind, 'dpi': 120, 'alpha': False,
                              'review': 'pendiente nueva revisión', 'fiscalAcceptance': False})
    for name, value in [('citas-candidatas.json', citations), ('fuentes/busqueda-pdf.json', search), ('fuentes/firmas.json', signatures)]:
        (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(citations)} citas y crops; hashes de originales verificados')


if __name__ == '__main__':
    main()
