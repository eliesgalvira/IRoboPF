"""Casos de ámbito del candidato real, sin atestaciones ni cambios de expectativas."""
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
from corpus import validate_schema  # noqa: E402
from enlaces import DocumentaryReadSet, evaluate_scope, verify_executable_scope  # noqa: E402

OUT = Path(__file__).resolve().parent
scope = json.loads((OUT / 'ambito.json').read_bytes())
payload = json.loads((OUT / 'payload-v2.json').read_bytes())
item = json.loads((OUT / 'correspondencias.json').read_bytes())['item']
validate_schema(scope, 'executable-cell-scope')
validate_schema(payload, 'binding-payload')
context = {'year': 2020, 'territory': 'madrid', 'component': 'autonomico', 'taxBase': 'general',
           'periodStart': '2020-01-01', 'accrual': '2020-12-31', 'death': None,
           'externalConditions': ['residence-unverified', 'eligibility-unverified']}
variants: list[tuple[str, dict]] = [('antes-ejercicio', {'year': 2019}), ('en-ejercicio-nominal-sin-seleccion', {}),
            ('despues-ejercicio', {'year': 2021}),
            ('antes-cierre', {'accrual': '2020-12-30'}),
            ('despues-cierre', {'accrual': '2021-01-01'}),
            ('territorio-equivocado', {'territory': 'murcia'}),
            ('componente-equivocado', {'component': 'estatal'}),
            ('base-equivocada', {'taxBase': 'ahorro'}),
            ('fallecimiento', {'accrual': '2020-06-15', 'death': '2020-06-15'}),
            ('residencia-autodeclarada', {'externalConditions': []})]
rows = []
for name, changes in variants:
    try:
        evaluate_scope(scope, dict(context, **changes))
    except ValueError as error:
        rows.append({'id': name, 'context': dict(context, **changes), 'expected': 'rejected',
                     'actual': 'rejected', 'diagnostic': str(error), 'applicability': 'not-established',
                     'completeRuleAcceptance': False})
    else:
        raise AssertionError('Se admitió un contexto que debe permanecer bloqueado: ' + name)
reader = DocumentaryReadSet(ROOT)
try:
    verify_executable_scope(reader, payload, item)
except ValueError as error:
    assert str(error) == 'Condiciones editoriales omitidas o alteradas', str(error)
    gate = {'actual': 'blocked', 'diagnostic': str(error), 'review': 'pending'}
else:
    raise AssertionError('La puerta actual no debe admitir esta traducción nueva sin decisión exacta')
(OUT / 'casos-maquina.json').write_text(json.dumps({'schemas': 'valid', 'gate': gate, 'cases': rows,
    'documentaryDependencies': reader.finish()}, ensure_ascii=False, indent=2) + '\n')
print('Schemas válidos; puerta bloqueada; contextos negativos rechazados sin selección temporal.')
