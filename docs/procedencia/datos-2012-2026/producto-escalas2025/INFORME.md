# Producto A acotado: escalas y mínimos 2025

Implementación del autor; revisión independiente pendiente del padre. Raíz utilizada sólo en lectura. Sin subdelegación, worktree, mutación VCS, red ni suites pesadas. LIGERO2. No modifica lib, expectativas ni validadores comunes.

## Resultado y método

1477 comparaciones ejecutadas: 1405 coincidencias técnicas y 72 diferencias exactas de cuota, en cuatro territorios. Seis controles adversos rechazan año, territorio, unidad, columna, hash del original y preimagen del código alterados. No son porcentajes de aceptación fiscal.

Se ejecutan obtenerParametrosComunidadAutonoma(2025), obtenerEscalaAutonomicaPublicada(2025), obtenerEscalasAhorroPublicadas(2025), calcularCuotaPorEscala y calcularDerechosMinimos. preimagenes.json fija 79 módulos/lock de la clausura local de imports. Se comprueban antes y después de ejecutar. Es ejecución de selectores vigentes sobre fuentes fijas; **no es cierre causal estático AST**, no elimina el bloqueo general de helpers ni modifica importaciones2019/v3 ni F.

El esperado se extrae del original oficial AEAT Renta2025 (edición20/05/2026), no del código ni de fixtures. En escalas, cada cita de la auditoría previa localiza una fila física; se reextraen sus cuatro columnas por caja y se interpretan por posición: base inferior EUR, cuota EUR, ancho EUR, porcentaje dividido por100 para comparar fracciones. ambitos-escalas.json conserva el encabezado territorial y el ejercicio2025 en las cajas anteriores a la primera fila. No se buscan números del motor en el PDF. Ceuta y Melilla comparten original, con selección ejecutada separada.

En mínimos, minimos-prosa.json separa secciones por encabezado territorial y recoge las cuantías EUR en su orden jurídico. preparar.py asigna las primeras3 a contribuyente, siguientes5 a descendientes (orden1–4+ y menor3), siguientes2 a ascendientes y últimas3 a discapacidad por sujeto. En La Rioja sólo discapacidad descendiente cambia. Baleares: general <65=5550; desde65=6105+1265=7370, adicional sobre5550=1820; desde75 suma1540. Estado procede del cuadro1083–1084; territorios sin incremento usan remisión1117 y cuadro1094–1098, no una inferencia por igualdad numérica con lib. Esta remisión informativa no sustituye una cadena legislativa completa de ausencia de modificaciones.

## Cobertura por territorio

Mínimos: se cotejan los19 campos nominales y se ejecutan perfiles individuales, sin fallecimiento ni ascendientes, edad40/64/65/74/75/76; hijos elegibles por orden1–4, edades2/3; discapacidad propia y de descendiente33 con/sin asistencia y65+. Hechos sintéticos completos con un solo titular, convivencia, consanguinidad, rentas del hijo0, sin declaración ni alimentos. Los importes de ascendientes se seleccionan como datos pero **no se ejecuta atribución de ascendientes**: la API familiar la excluye. Ningún positivo se extiende a cualquier perfil.

|Territorio|Filas escala; campos mínimos|General/+65/+75 EUR|Cuota: diferencias exactas / distinto céntimo|Condiciones y pendientes|
|---|---:|---|---:|---|
|andalucia|5;19|5790 / 1200 / 1460|0 / 0|Ordinario31/12; reserva común descrita abajo|
|asturias|8;19|6105 / 1265 / 1540|23 / 10|Ordinario31/12; reserva temporal Ley3/2025; no fallecimientos|
|illes-balears|9;19|5550 / 1820 / 1540|0 / 0|Adicional65 derivado6105+1265−5550; no general6105 para todos|
|canarias|7;19|5606 / 1162 / 1414|0 / 0|Ordinario31/12; reserva común descrita abajo|
|galicia|5;19|5789 / 1199 / 1460|15 / 1|Ordinario31/12; reserva común descrita abajo|
|madrid|5;19|5956.65 / 1234.26 / 1502.58|0 / 0|Ordinario31/12; reserva común descrita abajo|
|la-rioja|8;19|5550 / 1150 / 1400|0 / 0|Incremento discapacidad sólo descendiente; asistencia3000|
|comunitat-valenciana|11;19|6105 / 1265 / 1540|0 / 0|Ordinario31/12; reserva común descrita abajo|
|aragon|9;19|5550 / 1150 / 1400|31 / 1|Ordinario31/12; reserva común descrita abajo|
|cantabria|6;19|5550 / 1150 / 1400|0 / 0|Ordinario31/12; reserva común descrita abajo|
|castilla-la-mancha|5;19|5550 / 1150 / 1400|0 / 0|Ordinario31/12; reserva común descrita abajo|
|castilla-y-leon|5;19|5550 / 1150 / 1400|3 / 0|Ordinario31/12; reserva común descrita abajo|
|catalunya|8;19|5550 / 1150 / 1400|0 / 0|Ordinario31/12; reserva común descrita abajo|
|extremadura|9;19|5550 / 1150 / 1400|0 / 0|Ordinario31/12; reserva común descrita abajo|
|murcia|5;19|5550 / 1150 / 1400|0 / 0|Ordinario31/12; reserva común descrita abajo|
|ceuta|5;19|5550 / 1150 / 1400|0 / 0|Remisión DA32/art65; sin deducción territorial ni declaración completa|
|melilla|5;19|5550 / 1150 / 1400|0 / 0|Remisión DA32/art65; sin deducción territorial ni declaración completa|

Estatal general:6 filas; ahorro estatal:5; ahorro autonómico:5. Sin diferencias en esos cotejos. Mínimos estatales:19 campos y los mismos perfiles. Las tablas se conservan con cuotas publicadas separadas del transporte de tipos. El selector de2025 utiliza cuota publicada en Madrid ordinario; el resto integra tipos. Se prueban base inferior−0,01, base inferior, +0,01 y +123,45 por fila. No se audita una declaración anual completa ni todas las políticas de redondeo.

## Diferencias monetarias reproducibles

casos-monetarios.json conserva72 comparaciones exactas, con base, resultado motor, fórmula oficial y redondeo half-up aislado. Son72 puntos, no72 defectos jurídicos independientes. Doce cambian céntimo; los restantes pueden ser absorbidos por el redondeo de una salida. No se corrigen cuotas para imponer continuidad. primarios-discrepancias.json recupera cuatro artículos del CAS publicado por B con título, hash, offsets y notas de reforma: Aragón art110-1, Asturias art2, Galicia art4 y Castilla y León art1. Son consolidados BOE oficiales versionados, no PDFs originales del diario; el vínculo de ejercicio se conserva en el manual2025 y las notas. No se les atribuye una nueva auditoría de cadena. Ejemplos:
- aragon, base52623.45 EUR: motor7481.09475, fórmula publicada7481.09725; a céntimos7481.09 frente7481.10.
- asturias, base17707.21 EUR: motor1751.3654, fórmula publicada1751.3614; a céntimos1751.37 frente1751.36.
- galicia, base60123.45 EUR: motor8806.934975, fórmula publicada8806.93625; a céntimos8806.93 frente8806.94.
- castilla-y-leon, base53407.2 EUR: motor7518.832, fórmula publicada7518.83; a céntimos7518.83 frente7518.83.

## Reservas y antecedentes reutilizados

No falta una descarga para completar el cotejo ejecutable aquí: se ha completado la selección y comparación de las17 tablas y mínimos nominales con el manual disponible. Las reservas reales son jurídicas o del contrato: Asturias y devengos especiales; derecho material, residencia y hechos declarados; atribución de ascendientes excluida; vigencia/correcciones no cerradas universalmente por los dictámenes previos; autenticidad de firma/CSV no validada. La discrepancia cuota tabulada/integración se documenta sin autorizar un arreglo del motor. No se afirma que toda cuota final o perfil esté acreditado.

Se reutilizan auditorías/autonomicas-2022-2026 y minimos, sus revisiones, editorial/escalas-minimos y su revisión posterior, así como INFORME/REPRODUCIR/manifiesto de escalas-minimos-2019-2026. Sus estados históricos no se tratan como estado actual. La revisión editorial señaló el enlace primario de Madrid y la condición familiar; esta propuesta conserva pasajes de Madrid2025 y perfiles acotados, sin autoaceptar aquellas fichas.

**2026 se remite exclusivamente a publicación461e16323ca11e428c3e391568755c3e6b2766ab**, B2026.md, FAMILIA-ANUAL.md y revision-familia-2026/INFORME.md. No se han ejecutado ni auditado sus17 tablas. Se reutilizan cuatro objetos legislativos como corroboración de las discrepancias2025; no las cifras del oráculo2026. A histórico completo aplazado. Aceptación universal fiscal=false. La revisión independiente final corresponde al padre.

## Reproducción y entrega

Cada orden usa el entorno compartido y límite de25s heredado por sus hijos. Sin instalaciones, paralelismo ni suites globales. Python usa el entorno existente; Bun --no-install y caché transpiler desactivada. Antes del replay comprobar el manifiesto externo. Orden de reconstrucción: extraer.py (páginas seleccionadas), preparar.py (esperados documentales y pins), selector.mjs (ejecución), primarios.py (corroboración/casos), empaquetar.py (parche/manifiestos), verificar.py (replay físico y fórmula independiente Python Decimal). Preparar importa extraer y repite esa extracción limitada, sin censo.

```sh
timeout -k 30s 25s bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; bun --no-install /home/elies/Backups/IRoboPF/producto-a-escalas2025-20261104/selector.mjs'
timeout -k 30s 25s bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; /home/elies/.cache/irobopf-corpus/.venv/bin/python /home/elies/Backups/IRoboPF/producto-a-escalas2025-20261104/verificar.py'
```

No se requiere suite pesada para el resultado de este verificador documental aislado. Si el padre lo conecta a los lotes comunes, ejecutar bajo turno pesado propio la regresión existente: `timeout -k 30s 10m /home/elies/.cache/irobopf-corpus/.venv/bin/python tests/datos-escalas-minimos-2019-2026.py`. No ejecutada aquí.

entrega.patch sólo añade esta propuesta en docs/procedencia/datos-2012-2026/producto-escalas2025; no se ha aplicado. manifiesto.json fija código, entradas y salidas; entrega-manifiesto.json fija parche y manifiesto. El original AEAT8,55MB se preserva fuera de la entrega en producto-a-escalas2025-cas/sha256; los otros cuatro objetos se reutilizan en producto-b2026-cas. Sin repo completo, entornos, dependencias ni cachés.

Incidencia del autor: la primera sonda fue rechazada al pasar un campo de asistencia ajeno al tag Discapacidad65OMas. Se corrigió la entrada sintética al contrato estricto y se ejecutó de nuevo; no se modificó código productivo ni esperados monetarios. Un primer localizador cortó Andalucía en el encabezado normativo repetido; se corrigió por siguiente encabezado territorial antes de generar esperados. Son incidencias del harness, no fallos del motor.
