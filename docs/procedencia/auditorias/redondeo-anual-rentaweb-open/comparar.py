"""Hipótesis aritméticas del revisor frente a ejecuciones oficiales conservadas."""

import json
from decimal import Decimal
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
SOURCE = ROOT / 'docs/procedencia/revisiones/anual-salarial-completo/contraste.py'


def main():
    # Only definitions; do not run the reviewer's acquisition/output section.
    definitions = SOURCE.read_text().split('cs=json.loads', 1)[0]
    original: dict[str, object] = {'__file__': str(SOURCE)}
    exec(compile(definitions, str(SOURCE), 'exec'), original)
    staged: dict[str, object] = {'__file__': str(SOURCE)}
    definitions = definitions.replace("if policy=='gravamen':", "if policy in ('gravamen','todas'):")
    exec(compile(definitions, 'hipotesis-casillas', 'exec'), staged)
    original_calc = original['calc']
    staged_calc = staged['calc']
    assert callable(original_calc) and callable(staged_calc)
    observed = {r['id']: r for r in json.loads((HERE / 'observados.json').read_text())}
    records = []
    for case in json.loads((HERE / 'casos.json').read_text()):
        box = observed[case['id']]['casillas']
        row = {'id': case['id'], 'resultadoOpen': box['0670']['ses'], 'alternativas': {}}
        for policy in ['exacta', 'art20', 'componentes', 'gravamen', 'da61', 'posterior', 'todas']:
            row['alternativas'][policy] = original_calc(case['entrada'], policy)
        hypothesis = staged_calc(case['entrada'], 'todas')
        row['hipotesisRedondearArt20GravamenesDA61'] = hypothesis
        for key, number in [('reduccionArt20', '0023'), ('baseLiquidableGeneral', '0500'),
                            ('estatal', '0532'), ('madrid', '0533'), ('deduccionTrabajo', '0414'),
                            ('cuotaPosterior', '0595'), ('cuotaDiferencial', '0610')]:
            assert Decimal(hypothesis[key]) == Decimal(box[number]['ses'] or '0'), (case['id'], key)
        records.append(row)
    (HERE / 'politicas.json').write_text(json.dumps(records, indent=2) + '\n')
    print('7/7: política por etapas reproduce las casillas comparadas; no es código oficial.')


if __name__ == '__main__':
    main()
