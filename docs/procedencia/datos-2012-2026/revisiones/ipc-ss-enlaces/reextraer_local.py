"""Suite local explícita. Recibe replay JSON y raíces originales por argumentos.

No es CI: reabre cada objeto por hash y coteja posiciones independientemente.
"""
from collections import Counter
from decimal import Decimal
import csv
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(ROOT / 'tools/procedencia/datos/lotes/ipc-ss'))
import enlaces


def main():
    result = json.loads(Path(sys.argv[1]).read_bytes())
    store = enlaces.flujo.Store([Path(p) for p in sys.argv[2:]])
    checked = set()
    def read(ref):
        raw = store.read(ref)
        checked.add(ref['sha256'])
        return raw
    def walk(obj):
        if isinstance(obj, dict):
            if 'sha256' in obj and 'size' in obj:
                read(obj)
            for value in obj.values():
                walk(value)
        elif isinstance(obj, list):
            for value in obj:
                walk(value)
    walk(result)
    for cell in result['bases'] + result['rates'] + result['ambiguous']:
        with enlaces.flujo.pymupdf.open(stream=read(cell['document']), filetype='pdf') as doc:
            page = doc[cell['page'] - 1]
            rect = enlaces.flujo.pymupdf.Rect(cell['bbox'])
            words = [w for w in page.get_text('words', flags=0, sort=True)
                     if rect.contains(enlaces.flujo.pymupdf.Rect(w[:4]))]
            literal = ' '.join(w[4] for w in words)
            assert literal == cell['literal']
            if cell.get('status') == 'ambiguous-original-separator':
                assert literal == '25.10'
                try:
                    enlaces.flujo.number(literal, 'EUR')
                except ValueError:
                    pass
                else:
                    raise AssertionError('Ambigüedad aceptada')
            else:
                assert enlaces.flujo.number(literal, cell['unit']) == cell['normalized']
                assert cell['geometry']['rotation'] == page.rotation
                assert cell['words'] == [list(w[:5]) for w in words]
    for cell in result['ipc']:
        raw = read(cell['document'])
        rows = list(csv.DictReader(raw.decode('utf-8-sig').splitlines(), delimiter=';'))
        row = rows[cell['line'] - 2]
        assert row == {'Grupos ECOICOP': 'Índice general', 'Tipo de dato': 'Variación anual',
                       'Periodo': cell['period'], 'Total': cell['literal']}
        assert Decimal(cell['normalized']) / 100 == Decimal(cell['engine']['value'])
        assert cell['binding']['path'] == [cell['period'][:4]]
    for item in result['occurrences']:
        src = item['source']
        raw = (ROOT / src['file']).read_bytes()
        assert enlaces.flujo.digest(raw) == src['sha256']
        excerpt = raw.decode().encode('utf-16-le')[src['start']*2:src['end']*2].decode('utf-16-le')
        assert excerpt == item['expression']
    resolved = [x for x in result['bases'] if x['year'] == 2013]
    assert len(resolved) == 19
    assert len(result['ambiguous']) == 3
    assert not any(x['year'] == 2020 and x['column'] == 'minimum' for x in result['bases'])
    assert all(x['period']['from'] == '2021-09' for x in result['bases'] if x['year'] == 2021)
    assert all(x['period']['through'] == '2018-07' for x in result['bases'] if x['year'] == 2018)
    print(json.dumps({'objectsReopened': len(checked), 'basesLiteralGeometry': len(result['bases']),
                      'ratesLiteralGeometry': len(result['rates']), 'ipcLiteralLineValue': len(result['ipc']),
                      'ambiguous': 3, 'resolved2013': 19, 'astHashAndSpan': len(result['occurrences']),
                      'astClasses': Counter(x['classification'] for x in result['occurrences']),
                      'links': Counter(x['status'] for x in result['links']),
                      'cases': Counter(x['status'] for x in result['numericCases'])}, indent=2))


if __name__ == '__main__':
    main()
