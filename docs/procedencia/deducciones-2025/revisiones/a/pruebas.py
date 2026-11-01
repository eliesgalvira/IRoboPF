"""Pruebas DOCUMENTALES independientes. No calcula una declaración.
Desde raíz: python3 docs/procedencia/deducciones-2025/revisiones/a/pruebas.py
Requiere bun disponible con dependencias del proyecto; solo lectura VCS.
Conserva rojos de omisiones actuales; salida 1 deliberada si se reproducen.
"""
import json
import subprocess
from pathlib import Path

REGION = Path('lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades')
BASE = '016ec72d9539ccd887202735960ce306bd2354e5'

def texto(region, base=False):
    p = REGION / (region + '.ts')
    return subprocess.check_output(['git', 'show', BASE + ':' + str(p)], text=True) if base else p.read_text()

def tramo(t, codigo):
    pos = t.index('"' + codigo + '"')
    siguiente = t.find('  fichaImplementada(', pos)
    return t[pos:siguiente if siguiente >= 0 else len(t)]

# Los números esperados se calculan independientemente del orden textual del autor.
for codigo, gasto, tasa, tope, ayuda, esperado_antes, esperado in [
    ('aragon_libros_texto_material_escolar', 200, 1, 50, 20, 50, 30),
    ('aragon_clases_apoyo_refuerzo', 800, .25, 100, 20, 100, 80),
    ('aragon_formacion_autonomia_menores_discapacidad', 800, .25, 100, 20, 100, 80),
]:
    for antes in [True, False]:
        s = tramo(texto('aragon', antes), codigo)
        formula = next(l for l in s.splitlines() if 'Fórmula:' in l)
        despues_tope = 'max(0, min(' in formula
        observado = max(0, min(gasto*tasa, tope)-ayuda) if despues_tope else min(gasto*tasa-ayuda, tope)
        objetivo = esperado_antes if antes else esperado
        assert observado == objetivo, (codigo, antes, observado, objetivo)
    assert max(0, min(gasto*tasa, tope)-(tope+1)) == 0
    print('VERDE orden textual y frontera ayudas:', codigo)

for codigo, tasas in [
    ('cataluna_donativos_lengua_catalana_occitana', ['15%', '10%']),
    ('cataluna_donativos_idi', ['30%', '10%', '100%']),
    ('cataluna_donaciones_medio_ambiente_patrimonio_natural', ['15%', '5%']),
    ('cataluna_angel_inversor', ['40%', '50%', '12.000']),
    ('cataluna_tramo_autonomico_inversion_vivienda_habitual', ['7,5%', '15%', '9%', '30.000']),
]:
    previo = tramo(texto('catalunya', True), codigo)
    actual = tramo(texto('catalunya'), codigo)
    assert all(t in actual for t in tasas)
    assert not all(t in previo for t in tasas)
    print('VERDE discriminante ampliación documental:', codigo)

# Serializar fichas evita confundir otra deducción del mismo archivo con la revisada.
imports = ';'.join('import {' + r.upper() + '_DEDUCCIONES_AUTONOMICAS_2025 as ' + a + '} from "./' + str(REGION/r) + '.ts"' for r, a in [('andalucia','a'),('aragon','b'),('catalunya','c')])
fichas = {f['codigo']:f for f in json.loads(subprocess.check_output(['bun','-e',imports+';console.log(JSON.stringify([...a,...b,...c]))'],text=True))}
checks = [
 ('andalucia_inversion_vivienda_habitual_protegida_jovenes', 'menor', 'Desarrollar alternativa edad/VPO, no solo magnitudes'),
 ('andalucia_alquiler_vivienda_habitual', '65', 'Desarrollar sujetos habilitados y conjunta'),
 ('andalucia_nacimiento_adopcion_acogimiento_menores', '90', 'Precisar convivencia mínima acogimiento'),
 ('aragon_primer_segundo_hijo_poblaciones_menos_10000', 'residido', 'Exigir residencia contribuyente año evento y anterior'),
 ('aragon_guarderia_menores_3', 'autorizad', 'Centro autorizado y reparto entre titulares'),
 ('cataluna_nacimiento_adopcion_acogimiento', 'incompatible', 'No duplicar adopción/acogimiento'),
 ('cataluna_alquiler_vivienda_habitual', '35 años', 'Precisar vía de edad y alternativas'),
 ('cataluna_obligacion_declarar_mas_de_un_pagador', '89', 'Excluir quien pueda acogerse a89.A RIRPF'),
]
rojos = 0
for codigo, discriminante, motivo in checks:
    observado = discriminante.casefold() in json.dumps(fichas[codigo], ensure_ascii=False).casefold()
    print('VERDE' if observado else 'ROJO', codigo, motivo, 'esperado=condición descrita; observado=',observado)
    rojos += not observado
angel = fichas['cataluna_angel_inversor']
ambiguo = any('En ampliación' in s and 'facturación' in s for s in angel['limites'])
print('ROJO' if ambiguo else 'VERDE', 'cataluna_angel_inversor: separar facturación autónoma del ámbito ampliación')
rojos += ambiguo
raise SystemExit(bool(rojos))
