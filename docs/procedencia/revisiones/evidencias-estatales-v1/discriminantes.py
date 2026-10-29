"""Casos que separan igualdad numérica, identidad y contexto jurídico."""
import json
import subprocess
from decimal import Decimal
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = Path('/home/elies/.t3/worktrees/IRoboPF/t3-e739d2c4')
E = ROOT / 'docs/procedencia/evidencias/estatales'
HIST = 'ed6a43fd750de05609abc3710dabdc2f8261020c'


def read(p):
    return json.loads(p.read_bytes())


cases = []
index = read(E / 'citas-indice.json')
for a, b in [('escala-ordinaria-1-baseInferior', 'escala-complementaria-1-baseInferior'), ('min-2015-2025-discapacidad-contribuyente-grado65OMas', 'min-2015-2025-discapacidad-familiar-grado65OMas')]:
    x, y = index[a], index[b]
    assert Decimal(x['value']) == Decimal(y['value'])
    assert x['cellBBox'] != y['cellBBox'] or x['code'] != y['code']
    cases.append({'caso': [a,b], 'igualdad': x['value'], 'resultado': 'Mismo número; distinto sujeto o componente. No sustituibles.'})
refined = []
for r in read(OUT / 'celdas-26.json'):
    c = read(ROOT / r['citation']['citation']['path'])
    u = c['engineBinding']['unit']
    start = u['start']
    assert c['quote'][start:u['end']] == 'euros'
    refined.append({'id':r['id'],'unidadActual':u,'contextoUnidadActual':c['quote'][max(0,start-100):u['end']+100], 'propuesta': 'Vincular unidad a cabecera geométrica de esta tabla: Hasta euros para baseInferior; Euros para cuota. Conservar literal y caja de cabecera.', 'decision': 'Cuantía EUR visualmente corroborada; selector actual no prueba por sí solo unidad de la celda.'})
for year in range(2015,2025):
    f=f'lib/dominio/normativa/datos/minimos-autonomicos-{year}.ts'
    src=subprocess.check_output(['git','show',HIST+':'+f],cwd=ROOT).decode()
    line=f'export const MINIMOS_ESTATALES_{year} = MINIMOS_ESTATALES_2025'
    assert line in src
    cases.append({'caso':f'alias-{year}','file':f,'linea':line,'resultado':'Identidad técnica directa comprobada; continuidad jurídica anual pendiente.'})
ordinary_product=Decimal('17707.20')*Decimal('.12')
complementary_product=Decimal('17707.20')*Decimal('.0075')
assert ordinary_product == Decimal('2124.8640') and complementary_product == Decimal('132.804000')
cases.append({'caso':'cuota-publicada-vs-integral','base':'17707.20','ordinariaProducto':str(ordinary_product),'ordinariaPublicada':'2124.86','complementariaProducto':str(complementary_product),'complementariaPublicada':'132.80','resultado':'Tupla publicada no es valor sin redondear de integrar tipos; preservar columna cuota.'})
(OUT/'discriminantes.json').write_text(json.dumps(cases,ensure_ascii=False,indent=2)+'\n')
(OUT/'unidades-refinadas-26.json').write_text(json.dumps(refined,ensure_ascii=False,indent=2)+'\n')
print(f'{len(cases)} casos discriminantes correctos; {len(refined)} selectores de unidad requieren precisión contextual')
