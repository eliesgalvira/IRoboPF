import json,hashlib
from pathlib import Path
src=Path('docs/procedencia/auditorias/trabajo-deducciones-estatales'); out=Path('docs/procedencia/revisiones/trabajo-deducciones-estatales')
# Alcances propios, no copia de la conclusión del autor.
rows=[
('Cotización efectiva ausente del contrato anual; la estimación legacy no es una entrada fiscal acreditada.','Un bruto no determina lo pagado; no se acepta una cuota alternativa sin certificado ni entrada.','Diseñar entrada efectiva y separar estimación; caso con 1200 efectivos pendiente de ejecución por falta de input.'),
('Ausencia de sindicato, colegio obligatorio y defensa; límites 500 y 300 acreditados en art10 RIRPF y art19 LIRPF.','El tope colegial no se aplica al sindicato; no basta introducir un gasto sin requisito causal.','Crear contrato de gastos y luego probar límites 499.99/500/500.01 y 299.99/300/300.01; no ejecutados.'),
('Cuantía general nominal 2000 desde 2015, exclusivamente art19.2.f.','La cuantía nominal no es el importe aplicado ni se multiplica por pagador.','Conservar parámetro; separar aplicación limitada al saldo.'),
('Bruto cero muestra 2000 como gasto deducible aunque neto/base sean cero; defecto de importe reportado.','No se ha demostrado impuesto erróneo en ese caso; el suelo evita saldo negativo.','Separar gasto teórico y aplicado. Caso rojo ejecutado.'),
('Falta incremento por movilidad, año del traslado y siguiente; art19.2.f.','El incremento exige desempleo inscrito y traslado causal; se limita al rendimiento asociado, no mero prorrateo anual.','Añadir hechos y fechas antes de evaluador. Caso completo no ejecutable con contrato actual.'),
('Falta gasto por discapacidad activa 3500/7750, independiente de mínimo personal.','Grado de discapacidad sin actividad simultánea no basta. Dos citas de tabla usan otra serialización; usar prosa legal.','Modelar actividad y rendimiento asociado; casos pensionista/activo no ejecutables actualmente.'),
('Falta DT6 movilidad 2015; original Ley26/2014 p57 y manual2015 pp144–145 releídos.','No equivale a duplicar gasto nuevo: sustituye incremento de movilidad, no gasto general. No se acepta automáticamente ejemplo completo.','Contrato específico puesto aceptado en2014/continuidad2015; caso R20000 no ejecutado.'),
('Ausencia de incrementos art20 histórico por actividad >65, movilidad y discapacidad activa.','Edad o mínimo por discapacidad no prueban actividad.','Añadir requisitos; no cambiar fórmula general para todo contribuyente.'),
('2012 y 2014: 9000 bruto más ganancia7000 conserva4080; debería2652 con saldo suficiente. Norma histórica cubre2012–2014.','No corregir a cero: esa solución sería errónea para estos ejercicios.','Introducir otras rentas algebraicas; preservar control6500. Año2013 sondeado en función, no caso anual.'),
('Desde2015 falta exclusión otras rentas>6500; casos anuales2015/2024/2025 y perfil técnico2026 reproducidos.','No usar base ahorro compensada ni alquiler ya reducido para otras rentas.','Contrato suma algebraica neta antes de reducciones; conservar igualdad6500.'),
('Argumento art20 antes del gasto f correcto para salario con solo SS.','Con gastos a–e nuevos deberá minorarse también por ellos.','Conservar orden actual en ese perfil y ampliar contrato, no aceptación general.'),
('Fórmula nominal2012–2014 4080/9180/13260/0.35/2652 contrastada con Ley39/2010.','No valida otras rentas ni aumentos ni saldo aplicado.','Conservar fórmula nominal; corregir condición en TDE09.'),
('Fórmula nominal2015–2017 3700/11250/14450/1.15625 conforme Ley26/2014.','Coincidencia de fórmula no subsana otras rentas.','Conservar coeficientes, añadir elegibilidad.'),
('Fórmula nominal2019–2022 5565/13115/16825/1.5 conforme Ley6/2018.','No extrapolar nueva fórmula a todo2018.','Mantener separación de transitorio y fórmula plena.'),
('Fórmula nominal2023 6498/14047.5/19747.5/1.14 conforme Ley31/2022.','Enero de retención no divide la reducción anual.','Conservar fórmula anual; no media1/12.'),
('Transitorio2018 con fecha civil UTC:3700 antes5julio y4632.50 desde5julio para R10000.','No acepta representación Date con offset ni equivalencia con retenciones.','Preservar cálculo bajo contrato UTC; resolver TDE35 por separado.'),
('Parámetros nominales2024–2026 coinciden con art20 RDL4/2024.','El extremo se excluye legalmente y la implementación da negativo.','Aceptar solo constantes; TDE18 permanece defecto.'),
('R19747.50 produce−0.0028 en2024/2025/2026; corresponde cero por exclusión del umbral.','No demuestra por sí solo un céntimo de cuota final; valores subcéntimo inmediatamente inferiores requieren política propia.','Corregir elegibilidad de extremo tras reproducir caso rojo; no autoriza redondear todas las etapas.'),
('Reducción informada positiva con trabajo cero pese a saldo aplicado cero.','Puede ser nominal deliberado; el nombre/rastro debe distinguirlo.','Separar teórica/aplicada; no alterar una base ya correctamente acotada.'),
('DA61 falta en cuota diferencial anual:2025 Madrid bruto16576 sin otras rentas devuelve287.12 frente a0 tras deducción limitada.','DA61 no debe restarse a cuota líquida legal como si fuese art68; conciliación legacy puede duplicarla.','Añadir etapa tras art80 y antes pagos; revisar conciliación por separado. No se implementa fix.'),
('Cuantías nominales2025 y2026 DA61 verificadas en leyes anuales, corrección y convalidación2026.','Algoritmo de retención no fundamenta deducción anual y2026 no está cerrado.','Sustituir referencia por norma anual; no certificar ejercicio2026.'),
('Contrato legacy basado solo en bruto no representa elegibilidad DA61 ni límite proporcional ni orden.','Pensión es trabajo art20 pero otra renta para DA61; aceptación es de carencia, no de toda fórmula futura.','Separar empleo/pensión, otras rentas y cuotas tras art80; casos mixtos/proporcionales pendientes por falta de input.'),
('Omisión80bis reproducida2012/2014 bruto12000: diferencia400 bajo supuestos sin renta exterior ni reducción base.','No restar400 universalmente: BI y límite por tipo medio son obligatorios.','Implementar etapa histórica y probar límites; control2015 sin80bis. No valida cuota/escalas de origen.'),
('Constante22000 correcta solo supuesto general restringido del art96.','No es exención ni determina obligación por sí sola.','Mantener literal; evaluador de obligación separado.'),
('Ausencia evaluador art96 y pagadores, con sucesión de umbrales documentada.','Dos pagadores no implican siempre declarar; prestaciones pasivas tienen procedimiento especial.','Contrato pagadores/retenciones/tipo de renta/devengo; modelo146 aún no cerrado ni ejecutado.'),
('Excepción2500 únicamente devengos1–22enero2025: original, derogación y AEAT26 coinciden.','No extender a salario cobrado en enero ni a todo2025; corrección de errores debe examinarse.','Conservar vigencia por devengo; nueva adquisición BOE2025-994 adjunta. Evaluador inexistente, sin ejecución.'),
('Ausencia general de deducciones estatales identificable, pero catálogo histórico completo no aceptado.','Cita HTML del alquiler33007.20 no acredita por sí sola régimen transitorio aplicable; faltan cadenas por familia.','needs-evidence: auditoría por familia/año y selección inequívoca de versión antes de fórmulas.'),
('Contrato no distingue irregularidad ni artistas; no se acepta cobertura histórica completa art18/DA60.','Consolidado actual no acredita cada ejercicio2012–2026, ni condiciones de cobros anteriores.','needs-evidence: normas originales, transitorios, clase de renta y pruebas propias.'),
('Gasto fijo general2000 no existe en art19 histórico anterior2015.','Cero en esa constante no significa ausencia de todos los gastos deducibles.','Conservar cero nominal; no eliminar a–e.'),
('Estructura de dos fórmulas y combinación2018 compatible con DA47.','Metadatos no prueban ejecución; se enlaza ejecución TDE16 bajo UTC.','No contar TDE30 y16 como dos reglas fiscales independientes.'),
('Falta alta RETA/RETM por cuenta propia: obligación desde2023 acreditada por RDL13/2022 pp63–64.','Alta asimilada o trabajador del mar por cuenta ajena no deben activar ciegamente la causa.','Contrato alta/clase/periodo; caso rendimiento cero no ejecutado porque no existe evaluador.'),
('Falta causa IMV para titular y unidad de convivencia, original2020 y Ley19/2021 releídos.','Unidad convivencia no es unidad familiar IRPF ni obliga automáticamente a conjunta.','Evaluador separado de liquidación; menores y opción conjunta pendientes de ejecución.'),
('Falta clasificación de fuentes art96; límites conjuntos1600/1000 y pérdidas<500 acreditados.','Cita TDE-A-ley16-2013-18-13 pertenece a IRNR: se rechaza como fundamento IRPF. Límites no son franquicias sumables.','Usar18-3/18-4 para IIC; rentas ordinarias de alquiler no entran en lista. No hay evaluador ejecutable.'),
('Faltan causas por ejercicio de beneficios y solicitud devolución; art61/65 RIRPF y DT18.3 releídos.','Derecho ejercitado y devolución voluntaria no equivalen a superar límites de renta.','Separar motivos y ejercicio de derechos; no aceptar obligación incondicional para toda aportación.'),
('Diferencia UTC/offset reproducida, pero no se acredita incumplimiento sin contrato de fecha civil.','Date puede estar deliberadamente convenido como día UTC; cambiar zona silenciosamente rompería llamadores.','needs-evidence: fijar contrato y recorrer productores antes de corregir calendario.')]
findings=json.loads((src/'hallazgos.json').read_text()); cites={c['id']:c for c in json.loads((out/'citas-refinadas.json').read_text())}; result=[]
for f,(scope,objection,action) in zip(findings,rows,strict=True):
 ids=[i for i in f['focusedCitationIds'] if i in cites and i!='TDE-A-ley16-2013-18-13']
 result.append({'id':f['id'],'previousStatus':f['status'],'status':'needs-evidence' if f['id'] in ['TDE-27','TDE-28','TDE-35'] else 'accepted','acceptanceScope':scope,'originalReread':[{'citationId':i,'sha256':cites[i]['documentSha256'],'page':cites[i].get('page'),'selector':cites[i].get('containerSelector')} for i in ids],'objection':objection,'reason':'Contraste independiente del contrato ejecutable y originales, limitado a la afirmación indicada.','cost':'Conservar la laguna y exigir contrato/pruebas adicionales; no atribuir aceptación a una regla completa, año o liquidación.','action':action,'inventoryBinding':'Pendiente. IDs históricos del candidato no se migran a ocurrencias del snapshot actual.','reviewer':'contrarrevision-trabajo-deducciones-estatales-2026-10-29'})
(out/'revisiones.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
files=set()
for f in findings:
 for loc in f['engineLocations']:
  name=loc.split('#')[0]
  if Path(name).is_file(): files.add(name)
(out/'motor-examinado.json').write_text(json.dumps([{'path':name,'sha256':hashlib.sha256(Path(name).read_bytes()).hexdigest()} for name in sorted(files)],indent=2)+'\n')
print(len(result), 'IDs; aceptados',sum(r['status']=='accepted' for r in result))
cs=json.loads((out/'citas-refinadas.json').read_text())
for x in result:
 extra=[]
 if x['id'] in ['TDE-20','TDE-21','TDE-22']:
  extra=['REV-rdl5-2026-45','REV-rdl5-2026-46','REV-convalidacion2026-1','REV-correccion2026-1','REV-aeat2025-1373','REV-aeat2025-1374']
 if x['id']=='TDE-26':
  extra=['REV-correccion2025-1','REV-correccion2025-2','REV-aeat2025-26']
  x['action']='Implementar vigencia por devengo. Corrección BOE2025-994 releída íntegra: no modifica art6/art96. Evaluador inexistente; casos no ejecutados.'
 x['additionalOriginalReread']=[{'citationId':c['id'],'sha256':c['documentSha256'],'page':c.get('page')} for c in cs if c['id'] in extra]
(out/'revisiones.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
