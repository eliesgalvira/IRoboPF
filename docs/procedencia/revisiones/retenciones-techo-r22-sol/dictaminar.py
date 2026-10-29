"""Registra decisiones de lectura personal; no las deduce de palabras clave."""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
R22 = OUT.parents[1] / 'correcciones/retenciones-2015-2016-r22'
DECISIONS = {
    'minimos': ('continuidad histórica, sin reabrir C01',
                'Los tres reemplazos son idénticos a R21; no hay evidencia nueva del signo.',
                'La igualdad de texto no revisa derechos familiares.',
                'Se conserva exclusivamente la rectificación ≤64 ya recibida.',
                'No renovar aceptación de índices, discapacidad ni bucles.'),
    'regularizacion': ('precisión corroborada para subcontrato',
                      'La remisión expresa a CONTRATO R22 prevalece sobre la descripción PDF; dominio parcial.',
                      'Una superposición podría conservar otra excepción activa.',
                      'Se revisaron contrato compuesto y filas residuales: excepciones es candidato-documental, no filtro legal.',
                      'Reutilización aislada de filas históricas no queda validada; julio y doble600 siguen abiertos.'),
    '87.5-no-aumento': ('R21-01 corregido en documento; condicionado',
                       'min conserva candidato inferior, igual y limita superior; mínimo satisfecho <=anterior.',
                       'El techo podría chocar con un mínimo nuevo o superior.',
                       'Esas entradas y todo cambio de calificación del mínimo están expresamente fuera de alcance.',
                       'No nómina implementada ni solución para colisiones.'),
    '87.5-aumento': ('precisión de alcance corroborada; no composición completa',
                    'Exige aumento exclusivamente calificado y excluye evento alimentario concurrente.',
                    'El delta positivo no prueba exclusividad ni resuelve conflicto de mínimo con techo de importe.',
                    'Se conserva la calificación previa y la exclusión de conflictos; no se decide esa composición.',
                    'Techo aritmético no equivale a importe anual exigible.'),
}
rows = []
for correction in json.loads((R22 / 'ajustes.json').read_text())['corrections']:
    decision, reason, objection, response, cost = DECISIONS[correction['id'].split(':')[1]]
    rows.append(dict(id=correction['id'], source=correction['source'], decision=decision, reason=reason,
                     objection=objection, response=response, cost=cost,
                     acceptance=False, subsequentContrastRequired=True))
assert len(rows) == 12 and len({r['id'] for r in rows}) == 12
(OUT / 'dictamen-12.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
CASES = [
    ('nuevo evento único, mínimo compatible, candidato inferior', 'techo conserva inferior; premisas aún deben acreditarse'),
    ('nuevo evento único, candidato igual al anterior', 'identidad; no asignación que lo eleve'),
    ('nuevo evento único, candidato superior al anterior', 'techo anterior; no certifica nómina'),
    ('alimentos4 + situación familiar5 conciliados', 'fuera de alcance antes de calcular'),
    ('alimentos4 + residencia6 conciliados', 'fuera de alcance antes de calcular'),
    ('alimentos4 + trabajo fuera8 conciliados', 'fuera de alcance antes de calcular'),
    ('alimentos4 + vivienda9 conciliados', 'fuera de alcance; secuenciar vivienda/salario no readmite alimentos'),
    ('alimentos4 + pérdida vivienda10 conciliados', 'fuera de alcance antes de calcular'),
    ('alimentos4 + causa7 u otra variación material', 'fuera de alcance por exclusión general, aunque no aparezca en ejemplos de tabla'),
    ('alimentos4 + causa11', 'fuera de alcance y además incompatible en entrada PDF'),
    ('dos eventos judiciales nuevos simultáneos', 'no justificar por singular evento único; requiere calificación propia, no cubierto aquí'),
    ('custodio pagador sin mínimo por rentas de hijo', 'excluido MDV2-P01; exclusión no resuelve especialidad legal'),
    ('alimentos antiguos con simple cambio de cuantía', 'no activa automáticamente nueva obligación; otras reglas pendientes'),
    ('pensión compensatoria cónyuge', '87.2.7 sí puede exigir regularizar; no es la alternativa de hijos de87.5'),
    ('alimentos voluntarios', 'no acredita resolución judicial ni85.2'),
    ('anualidad0 o anualidad=base o >base', 'fuera de dominio0<A<base; no inventar desdoblamiento'),
    ('falta comunicación o faltan5días o opción trimestral no fijada', 'no fecha eficaz acreditada; no resultado utilizable'),
    ('minimum desconocido', 'fuera de alcance'),
    ('minimum cambiado pero mismo porcentaje numérico', 'fuera de alcance: exige calificación sin cambio, no igualdad numérica'),
    ('mínimo15 anterior12', 'fuera de alcance; órdenes dan12 o15, ninguno esperado fiscal aquí'),
    ('candidato1 mínimo2 anterior12', 'fuera de alcance: candidato incumple mínimo'),
    ('delta-1000 compuesto por+1000 y-2000', 'no inferir exclusividad de la suma; falta calificación'),
    ('delta0 sin nuevo evento judicial', 'no acredita disminución exclusiva ni segunda alternativa'),
    ('delta+1000 con nuevo evento judicial único ya acreditado', 'signo no desactiva techo; no se afirma realizabilidad de nómina'),
    ('tipo previo voluntario superior', 'excluido88.5; no confundirlo con techo legal'),
]
(OUT / 'casos-juridicos.json').write_text(json.dumps([
    dict(input=entry, decision=result, kind='lectura adversarial del contrato, no validador implementado',
         objection='Una etiqueta no acredita los hechos ni su eficacia.',
         response='Las decisiones describen el alcance escrito, no comprueban comunicaciones o resoluciones reales.',
         cost='No resultado fiscal ni aceptación de nómina.', subsequentContrastRequired=True)
    for entry, result in CASES], ensure_ascii=False, indent=2) + '\n')
