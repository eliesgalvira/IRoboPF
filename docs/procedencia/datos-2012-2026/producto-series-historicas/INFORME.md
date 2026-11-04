# Series consumidas por empleo Madrid 2018–2024

Entrega ligera A, 4/11/2026. **Hay diferencia monetaria reproducible pendiente de revisión independiente**: falta seleccionar cuotas fijas Madrid en 2018–2021 y 2023–2024. El motor y el repositorio se mantienen sin modificaciones. No se ha ejecutado Open, C histórico ni C300, ni se ha leído su salida.

La matriz completa está en `matriz.json`: parámetros, filas [base inferior EUR, cuota EUR, tipo fracción], selección efectiva, localizador, estado y reservas. `fuentes.json` resuelve cada identificador a URL primaria, SHA-256/SHA-512 y ruta CAS. Las páginas son físicas PDF, base 1. `extractos.json` conserva únicamente páginas útiles, no originales completos.

## Resultado por ejercicio

| Año | Art19 | Art20 cierre | Escala estatal | Madrid: límites/tipos / cuotas fijas | Mínimo estatal / Madrid menor65 EUR | Céntimos distintos en 19 casos |
|---|---|---|---|---|---|---|
|2018|verificado acotado|transición A+(B−A positivo)/2|verificada numéricamente|límites/tipos coinciden; faltan cuotas seleccionadas|5550 / 5550|8|
|2019|verificado acotado|B|verificada numéricamente|límites/tipos coinciden; faltan cuotas seleccionadas|5550 / 5550|8|
|2020|verificado acotado|B|verificada numéricamente|discrepa límite53407,29; faltan cuotas seleccionadas|5550 / 5550|8|
|2021|verificado acotado|B|verificada numéricamente, tramo300000|límites/tipos coinciden; faltan cuotas seleccionadas|5550 / 5550|8|
|2022|verificado acotado|B|verificada numéricamente|verificada; consume MADRID_2022|5550 / 5777,55|0|
|2023|verificado acotado|6498 con corte14047,50/19747,50|verificada numéricamente|límites/tipos coinciden; faltan cuotas seleccionadas|5550 / 5956,65|4|
|2024|verificado acotado|7302 con cortes14852/17673,52/19747,50|verificada numéricamente|límites/tipos coinciden; faltan cuotas seleccionadas|5550 / 5956,65|4|

No son tasas de error poblacionales: son 133 entradas sintéticas escogidas alrededor de fronteras y dentro de tramos. Los 40 casos rojos son diferencias en la presentación final, no 40 reglas distintas. No se declara equivalencia ni desacuerdo con Open.

## Parámetros y unidades realmente consumidos

`conexion-contrato.ts` limita el histórico a empleo Madrid, 18–64 años, individual, sin familia/discapacidad, devengo31/12 y demás ausencias declaradas. La conexión pasa el año real al art20 y a la composición. Los importes efectivos entran como texto EUR con hasta dos decimales; Decimal interno, precisión de composición80. Tipos internos en fracción: 9%=0.09. No se convierten euros a céntimos al seleccionar tarifas. La presentación final usa half-up, sin cuantizar etapas históricas.

Art19, todos los años: gasto general2000 EUR anual, limitado al saldo positivo tras a–e; sindicato satisfecho sin tope específico; colegio obligatorio y fines esenciales limitado a500 EUR anual agregado; defensa por litigio directo con pagador limitada a300 EUR anual agregado. Cotizaciones efectivas se deducen una vez. La prueba de700 de colegio,600 de defensa y900 de sindicato, con íntegro10000/cotización efectiva1000, produce gastos a–e2700, general2000 y neto5300 en los siete años. Sustento: Ley26/2014 art1.Diez, PDF11–12; reglamento original art10, PDF16–17. No se han reabierto movilidad/discapacidad.

Art20: N es íntegro menos gastos a–e, **sin** restar f. Otras rentas no exentas deben ser <=6500 EUR; la entrada efectiva declara0. La reducción efectiva se limita además a max(0,netoArt19), para no crear saldo negativo.

- A:3700 hasta N11250; 3700−1.15625×(N−11250) hasta14450;0 después.
- B:5565 hasta N13115;5565−1.5×(N−13115) hasta16825;0 después.
- 2018 cierre:A+max(0,B−A)/2, máximo4632,50; **no B íntegra**. Ley6/2018 PDF77–78, DT47; entrada en vigor5/7/2018 acreditada por PDF306. No se han sondeado fallecimientos ni regularización de retenciones.
- 2019–2022:B. La continuidad se reutiliza del contraste anual AEAT conservado, con sondeos físicos focales; no se construye una nueva cadena normativa exhaustiva.
- 2023:6498 hasta14047,50;6498−1.14×(N−14047,50) hasta19747,50;0 después. Ley31/2022 art59, PDF84, efectos1/1/2023.
- 2024:7302 hasta14852;7302−1.75×(N−14852) hasta17673,52 inclusive;2364,34−1.14×(N−17673,52) antes de19747,50;0 después. RDL4/2024 art3, PDF23, efectos1/1/2024. Se conserva la literalidad de los decimales publicados.

Estatal2018–2020: bases inferiores0/12450/20200/35200/60000, cuotas0/1182,75/2112,75/4362,75/8950,75 y tipos9,5/12/15/18,5/22,5%. Desde2021 se añade300000 con cuota62950,75 y24,5%. El motor integra tipos; aquí las cuotas coinciden exactamente con esa integral. Se reextraen las tablas físicas de cada manual:2018p547,2019p567,2020p887,2021p909,2022p971,2023p1141,2024p1235. No se modifica la selección estatal.

Mínimo estatal5550: Ley26/2014 art1.Treinta y tres, PDF27; la conexión histórica referencia `MINIMOS_ESTATALES_2025`, cuyas cuantías ordinarias coinciden. Madrid5550 hasta2021,5777,55 en2022,5956,65 desde2023. Reutilización de revisión E limitada al contribuyente; no se reabren familiares. Ley8/2022 PDF3/5 y Ley13/2023 PDF3/14 acreditan valores/efectos2022 y2023. Las respectivas tablas AEAT2024 sostienen la continuidad examinada, sin inventar otro cambio anual.

## Diferencia y propuesta mínima externa

Primer rojo2018: íntegro19707,21; cotización efectiva0 declarada; otros gastos a–e0; gasto f2000; art20=0; BLG17707,21; sin retenciones. Cuota estatal tras mínimo1286,3652. Madrid tras mínimo por integral1209,80773; por tabla1209,81133. Cuota total actual2496,17293→2496,17; documental2496,17653→2496,18. La diferencia viene de la cuota fija1709,31 frente a1709,3064 acumulada, no de redondear cada tramo.

Fuente primaria: BOCM-20181228-1 PDF4, artúnico.Dos, y PDF12, DFúnica; SHA-256 `8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660`. Manual2018 PDF550 confirma la tabla. En2020, AEAT PDF894 dice53407,29 pero conserva ancho20400 desde33007,20: el original BOCM publica53407,20. Se da prioridad explícita a la norma; la continuidad normativa2019–2021 conserva la reserva histórica y debe revisarse antes de aceptar el cambio.

Para2023–2024, Ley13/2023 PDF3/14 publica las cuotas oficiales y efectos desde1/1/2023; SHA-256 `502aa027788673d8f653c2cd8ce87038630a7dab13b63d625c5905bd1a5ce8de`. Los manuales2023p1150 y2024p1243 coinciden. `MADRID_2025` ya contiene esas filas, pero no se selecciona para2023–2024.

`propuesta-monetaria-no-aplicada.patch` propone **un solo archivo**: añadir cinco filas2018–2021 y seleccionarlas; reutilizar las filas ya existentes para2023–2024. Ambas selecciones exigen ausencia de fallecimiento. No cambia la tabla genérica2020 ni extrapola el arreglo a sus consumidores fuera de ese cierre. La selección publicada proporciona también el límite correcto en2020. No se añade otra política monetaria. El parche no está aplicado ni probado en verde: corresponde al padre revisar fuentes, alcance y candidato antes de integrar.

## Evidencia ejecutada y reservas

Documento:15 originales locales, SHA-256/SHA-512 coincidentes; páginas focales reextraídas.105 celdas numéricas Madrid cotejadas con texto físico; las filas proceden de las transcripciones documentales conservadas, no de fixtures del motor. El control automático de presencia de celdas no sustituye la lectura de columnas: se releen las tablas normativas2018/2022/2023 y se conservan sus páginas completas. Las tablas estatales se cotejan también con cada manual anual. Hash no equivale a validación PAdES/CSV.

Cálculo: un proceso Bun de duración inferior a30s,252 sondeos art20 y133 liquidaciones efectivas. Oráculo Python Decimal independiente del motor para fórmulas y tarifas,266 comprobaciones art20/gastos/mínimos y siete selecciones estatales. El oráculo usa la base devuelta para aislar el gravamen; no certifica por ello todas las etapas de una declaración. `prueba-roja.py` termina con código1 esperado y muestra un caso por cada ejercicio afectado. `rojos.json` conserva40 casos; `runtime.json` conserva también2022 y todos los casos sin diferencia. No hay prueba verde del parche.

Integridad:41 rutas de código/fuentes fijadas antes de los sondeos y cotejadas después sin cambios (`hashes-antes.json`, `hashes-despues.json`). C300 no figura entre ellas. No suites pesadas, Vitest, lint ni tipos globales. Sin red, VCS mutante, commit/push, worktree, subdelegación o borrados. Sin IPC, cotización estimada, importaciones2019 ni PADRE2017.

Incidencias conservadas: primer localizador CAS vacío para ciertos originales, resuelto leyendo los respaldos ya existentes; intento de barrido de manuales agotó timeout25s (124), sustituido por localizadores conservados. Dos intentos iniciales terminaron por FileNotFoundError sin descargar nada. `effect-solutions` no está en el entorno fijado (127); se consultó el código local Effect y los patrones runSync existentes, sin escribir implementación Effect nueva. Ninguna incidencia se presenta como verificación satisfactoria.

Falta concreta para integrar: revisión independiente del cambio monetario y de la continuidad2019–2021; después, prueba verde del candidato. La comparación Open histórica permanece no ejecutada y su turno depende de la revisión C2025. Este informe no añade gates generales ni autoaprueba datos.

## Reproducción ligera

Desde cualquier directorio, ejecutar cada orden con el mismo envoltorio, cambiando únicamente el archivo final entre `documentos.py`, `sondeo.ts`, `oraculo.py`, `prueba-roja.py` y `preparar-propuesta.py`. Bun para `.ts`; Python indicado para `.py`. Para obtener las evidencias en orden: documentos → sondeo → oráculo → roja. La roja debe fallar hasta que el padre integre un candidato revisado y vuelva a generar runtime.

```sh
timeout -k 30s 25s bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; /home/elies/.cache/irobopf-corpus/.venv/bin/python /home/elies/Backups/IRoboPF/producto-a-series-historicas-20261104/documentos.py'
timeout -k 30s 25s bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; bun /home/elies/Backups/IRoboPF/producto-a-series-historicas-20261104/sondeo.ts'
```
