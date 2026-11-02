"""Controles documentales; no implementa ni valida una cuota tributaria."""
from pathlib import Path
import argparse
import hashlib
import html.parser
import json
import subprocess


class Texto(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.out = []

    def handle_data(self, value):
        self.out.append(value)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--cas', type=Path)
    args = parser.parse_args()
    root = Path(__file__).parent
    def read(name):
        return json.loads((root / name).read_text())
    sources = {s['id']: s for s in read('fuentes.json')}
    quotes = {q['id']: q for q in read('citas.json')}
    for q in quotes.values():
        loc = q['localizador']
        assert loc['fin'] - loc['inicio'] == len(q['textoLiteral'])
        assert 0 < len(q['textoLiteral']) < 25000, q['id']
        assert q['sha256'] == sources[q['fuente']]['sha256']
    proposals = read('propuestas.json')
    assert len(proposals) == 3
    for row in proposals:
        raw = json.dumps(row['preimagen'], ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()
        assert hashlib.sha256(raw).hexdigest() == row['sha256PreimagenCanonica']
        assert row['preimagen']['codigo'] == row['codigo']
        assert set(row['propuesta']['citas']) <= quotes.keys()
    cases = read('discriminantes.json')
    conditions = read('condiciones.json')
    assert len(conditions['calificacion']) == 3
    assert conditions['calificacion'][2]['fechaEfecto'] == '2025-12-30'
    assert conditions['territorioDANA']['subambitos']['València'] == 'pedanías sur'
    assert len(cases) == len({c['id'] for c in cases}) == 15
    for case in cases:
        assert set(case['citas']) <= quotes.keys()
        assert case['clase'] == 'frontera_documental_sin_calculo'
        assert case['expectativa']
    assert '2025-12-29' == cases[0]['hechos']['devengo']
    assert '2025-12-30' == cases[1]['hechos']['devengo']
    assert cases[2]['hechos']['personalCV'] == 29
    assert cases[3]['hechos']['personalCV'] == 30
    assert 'EECV' in quotes['eecv-def']['textoLiteral']
    assert '30 %' in quotes['eecv-def']['textoLiteral']
    assert 'sólo núcleo urbano junto A3' in quotes['dana-acuerdo']['textoLiteral']
    assert 'PEDANÍAS SUR' in quotes['dana-acuerdo']['textoLiteral']
    assert 'Decreto 164/2024' in quotes['excluir-diciembre']['textoLiteral']
    assert '12/2024' not in quotes['excluir-diciembre']['textoLiteral']
    assert 'artículo 21' not in quotes['errata19']['textoLiteral']
    assert 'artículo 21' not in quotes['errata21']['textoLiteral']
    if args.cas:
        texts = {}
        for s in sources.values():
            original = args.cas / s['sha256']
            b = original.read_bytes()
            assert len(b) == s['bytes']
            for alg in ('sha256', 'sha512'):
                assert hashlib.new(alg, b).hexdigest() == s[alg]
            if b.startswith(b'%PDF'):
                t = subprocess.check_output(['pdftotext', '-layout', str(original), '-']).decode()
            else:
                h = Texto()
                h.feed(b.decode('utf-8'))
                t = ' '.join(h.out)
            texts[s['id']] = ' '.join(t.split())
        for q in quotes.values():
            loc = q['localizador']
            assert texts[q['fuente']][loc['inicio']:loc['fin']] == q['textoLiteral'], q['id']
    print(f'OK: {len(proposals)} propuestas, {len(quotes)} citas, {len(cases)} discriminantes; CAS={bool(args.cas)}; sin evaluación financiera.')


if __name__ == '__main__':
    main()
