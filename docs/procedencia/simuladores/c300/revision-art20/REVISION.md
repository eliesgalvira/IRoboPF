# Revisión independiente privada de política monetaria C300 / art. 20

2026-11-04. Raíz de IRoboPF sólo lectura. Sin subdelegación, VCS, worktree, instalaciones, navegador, campaña, CI ni suites pesadas. No se modificaron expectativas ni evidencias. Cada script se ejecutó secuencialmente con `timeout -k 30s 25s`, entorno de pruebas indicado y cachés externas. El cotejo principal usa `Decimal.eq` sobre ambos textos originales: sin convertirlos a Number ni formatearlos previamente. Las conversiones numéricas del cálculo y los candidatos alternativos se examinan por separado.

**Dictamen: compatibilidad observada confirmada; un bloqueo monetario en extremos admitidos impide aprobar sin acotar la política.** No invalida la solución de las cuatro discrepancias. El padre puede corregir el hallazgo sin otra revisión general.

## Hallazgo monetario P2: cancelación de operandos acumulados

Ubicación: `calcularReduccionTrabajoConOtrasRentas`, reconstrucción `integro.toNumber() - gastosAE.toNumber()` del parche; contrato `Euros` y hasta 100 rendimientos permiten los operandos del repro. Son datos admitidos por la API real; ésta devuelve una liquidación calculada, sin advertencia ni rechazo.

Repro compacto: partir de la primera entrada de los siete originales, sin retenciones; 100 rendimientos de íntegro `900000000000`, cotizaciones SS `900000000000` en 99 y `899999980252.51` en el primero; restantes gastos cero. Los identificadores son distintos. El script `repro-extremo.mjs` construye esto, carga únicamente los dos módulos propuestos en memoria y llama `liquidarIrpfAnualExplicito`.

- Íntegro agregado exacto `90000000000000`; gastos a–e `89999999980252.51`; argumento art20 exacto `19747.49`.
- La reconstrucción binaria pierde `0.005625` EUR: usa `19747.484375`.
- Fórmula decimal del tramo: `2364.34 − 1.14 × (19747.49 − 17673.52) = 0.0142`. No es un empate de medio céntimo: corresponde reducción `0.01`.
- La propuesta evalúa `0.020612500000879663`, publica reducción `0.02` y neto/base `17747.47` en vez de `17747.48`. La cuota final en este ejemplo sigue `2389.89`: el defecto afecta importes publicados aunque el último saldo coincida.
- Segundo repro incluido: neto exacto `17673.52` con la misma construcción produce reducción `2364.35` frente a `2364.34` y base `13309.17` frente a `13309.18`.

Esto es una nueva pérdida monetaria por magnitudes acumuladas aceptadas, superior al fenómeno de desempate observado. No se afirma discrepancia contra una captura de Open de esos extremos: no existe aquí. Debe acotarse la ruta binaria para evitar publicar esa pérdida (ruta decimal fuera de ámbito numéricamente respaldado o rechazo explícito antes de liquidar), conservando los anclajes. No hace falta atribuir el servidor ni acreditar universalidad fiscal para corregir esta incoherencia de precisión. La compatibilidad de cuatro empates no acredita cancelar operandos de 14 enteros.

## Evidencia favorable y conservación

El corte leído contiene **218 resultados**, no se valida aquí el corte final C300. Base: cuatro casos discrepantes 016, 017, 047 y 057; propuesta: ninguna diferencia en las **2603 casillas presentes**. Las **449 ausencias** se mantienen como ausencias. Las 214 coincidencias se conservan. Son 14 casillas cotejadas por caso cuando hay dato, no sólo 0023 ni sólo saldo final. El caso 016 pasa de −1310.96 a −1310.94; 017 conserva saldo final aunque corrige componentes.

Los **siete originales** de `docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json` pasan todas sus casillas presentes en ambas versiones, con archivo idéntico pre/post. Incluido `da61`: bruto `17000.42`, SS `1000`, reducción exacta decimal `5292.265`, resultado API `5292.27`.

Se ejecutaron además **34 pruebas sintéticas por versión** sobre API real: céntimos vecinos de 14852, 17673.52, 19747.50; saldo cero, gasto f limitado alrededor de 2000, pérdida, retenciones, extremos, empleo estatutario, siete ejercicios históricos, pensión, Andalucía/Cataluña y actividad vacía. Once muestras fuera del selector conservan el resultado y el rastro completos. Actividad se limita a una muestra vacía y lectura del diff; no es una regresión completa de actividad. El saldo es exactamente cuota posterior menos retenciones y pagos, y la línea de rastro art20 coincide exactamente con el resultado en todas las muestras.

Por inspección: selector existente empleo laboral/estatutario + Madrid + 2025, opción ignorada fuera de 2025, sin fórmula duplicada en adaptador ni tablas por caso. Hay una fórmula por tramo con operadores de política. Gastos a–e y bruto son los subtotales calculados por el mismo adaptador, sin incluir f; composición, límites por saldo y pagos siguen las rutas existentes. La política decimal predeterminada conserva las expresiones algebraicas históricas. Las conversiones Decimal↔number de cada operación recuperan el mismo binary64 al reconvertir; los anclajes confirman el recorrido, pero no eliminan la cancelación de operandos grandes.

`discriminantes.json` confirma contra anclajes congelados: redondear producto falla en 004 (5510.03 frente a 5510.04); half-even falla en 025/026/203; convertir primero el neto decimal falla en 045 (5385.57 frente a 5385.58). Son auxiliares explicativos, no sustitutos de los tests API.

## Detalles menores que puede corregir el padre

El informe del autor dice que `toFixed(2)` de la expresión binaria de 026 da 5292.26. Con los operandos reales reconstruidos da `5292.265000000003` y `toFixed(2)` da **5292.27**; su propio `monetario.json` conserva ese binario. El valor 5292.26 puede aparecer convirtiendo primero el resultado decimal exacto u otro recorrido. Corregir esa afirmación; no cambiar el anclaje ni las expectativas.

La descripción general del rastro en `conexion.ts` todavía declara «artículo 20, cada gravamen y DA61 a céntimos half-up […] según siete casos». La línea específica art20 sí cambia. Actualizar la descripción para reflejar la política empírica binaria y el ámbito de evidencia. Esto no crea otro importe incorrecto.

## Identidad y límites

Se verificó el manifiesto del autor completo; el diff reconstruido exactamente desde las transformaciones coincide byte a byte con `propuesta.patch`. Los dos módulos originales y los siete anclajes están idénticos pre/post, así como parche, transformaciones, comparación y corte referenciados. Se verificaron en lectura los hashes de ocho SES/PDF de las cuatro discrepancias; no se accedió al journal ni se modificó CAS. `identidad.json` fija las referencias; `manifiesto.json` fija esta entrega.

No se examinó de nuevo el comparador general, acreditación F ni los 44 recursos oficiales. La ausencia de algoritmo servidor se toma como límite declarado, no como prueba universal. Los vecinos sintéticos, empleo estatutario y extremos son predicciones de API, no capturas oficiales nuevas. No hay tolerancias, atribución de código servidor ni aceptación fiscal universal. El padre conserva la responsabilidad del corte final, integración y pasos de publicación.

Reproducción (cada línea tras cargar el entorno indicado):

```sh
source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh
timeout -k 30s 25s bun /home/elies/Backups/IRoboPF/producto-c300-art20-revision-20261104/pruebas.mjs
timeout -k 30s 25s bun /home/elies/Backups/IRoboPF/producto-c300-art20-revision-20261104/pruebas.mjs --propuesta
timeout -k 30s 25s bun /home/elies/Backups/IRoboPF/producto-c300-art20-revision-20261104/repro-extremo.mjs
timeout -k 30s 25s bun /home/elies/Backups/IRoboPF/producto-c300-art20-revision-20261104/discriminantes.mjs
```
