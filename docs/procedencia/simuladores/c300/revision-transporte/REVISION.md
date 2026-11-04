# Revisión independiente C300 — 2026-11-04

**C2025 no aprobado todavía para habilitar 2018–2024.** El comparador detecta cuatro discrepancias monetarias reales del candidato actual frente a Open. No se ha encontrado un error bloqueante propio del comparador en este corte. Restan 82 entradas sin recibo válido seleccionado en el corte; no se presentan 300 capturas como terminadas. Aceptación fiscal universal/F aplazada, fuera de esta revisión.

## Corte y procedencia

Corte cerrado a 2026-11-04 21:22:24 UTC (22:22:24 CET), journal de 507 líneas completas, 3.597.224 bytes, SHA256 `662ffe5694ef10b561ab4b99109a00ca31f592707f4e20056c0c4450fb07dcce`. Se leyó una longitud fijada al abrir y se cortó únicamente tras el último salto de línea. Results: 245 líneas, SHA256 `124f19b51bad20db15fe6decb27c60e4932bc579c536508a7222b4719dfc07f7`. Las dos lecturas no son una transacción común: la selección utiliza exclusivamente el journal cerrado, y results sirve de índice auxiliar. No se consultó ni detuvo la tarea del autor ni se hicieron sondeos de sus avances.

218 entradas únicas válidas seleccionadas: `c300-001` a `c300-216`, además de `c300-244` y `c300-253`. Las claves originales exactas y los IDs están en `corte.json`. Los 245 estados done corresponden a identidades, no a 245 entradas distintas; hay además 8 estados error y 1 started. No se contabilizan estos últimos ni resultados huérfanos. Todas las referencias CAS de código histórico fueron verificadas por hash; las capturas mantienen su código y clave originales. No se relabelan bajo el código vigente ni se exige repetir capturas válidas.

Matriz real: 300 IDs y 300 hashes de entrada distintos, SHA256 `f232f0fcb9a5bc239bb195c4d7268ed1b2f9ce37b70c30143e9ed7dd8dfc042a`. Coincide byte a byte con la generación determinista en memoria, sin ejecutar generate. 21 casos de dos pagadores en la matriz; el corte sólo tiene uno. Cobertura del corte: 165 cortes brutos, 21 cortes netos hipotéticos, 27 rentas/SS/retenciones, 2 gastos/límites y 3 pilotos. Los 20 casos adicionales de dos pagadores siguen pendientes en este corte. Las doce variantes territoriales/familiares no se cuentan.

Una invocación real de `engine.mjs` para las 218 entradas, sin fórmulas alternativas ni red. 214 coincidencias condicionadas, 4 discrepancias, 0 contratos no soportados. Código de salida del comparador: 1. Inventario del operador idéntico antes/después, 46.810 archivos; SHA256 `ff1c2c1d0e90fbc2c313dda30d7321b04fdd1ce3fdc3ee7b6f18816658e8031c`. Base declarada `f4ffa938e2bc994b0fab8c222f2b3157896612f1`; la identidad efectiva es base MÁS inventario conservado en `comparacion/engine.json`, no una atribución de todo el estado al commit publicado. Las 218 entradas decodificadas por la API coinciden con las enviadas. El operador hace internamente una consulta jj de identidad de sólo lectura; el revisor no ejecutó operaciones VCS ni push.

## P1 — importes del candidato frente a Open: redondeo de artículo 20

Casos completos mínimos en `comparacion/discrepancias.json`, con todas las casillas, entrada exacta y referencias SES/PDF. Madrid, 2025, edad 40, individual, empleo, sin familia ni otras rentas; gastos sindicato/colegio/defensa cero, con hechos `satisfecho=si` conservados. No se puede atribuir esta diferencia a gasto no elegible ni al candidato valenciano de cuota conjunta.

| Caso | Bruto | SS efectiva | Retenciones | Casilla 0023 esperada Open | Actual API |
|---|---:|---:|---:|---:|---:|
| c300-016 | 15876.02 | 0.00 | 1443.27 | 5509.96 | 5509.97 |
| c300-017 | 15876.02 | 1000.00 | 1443.27 | 7259.96 | 7259.97 |
| c300-047 | 18326.02 | 1000.00 | 1666.00 | 2972.46 | 2972.47 |
| c300-057 | 19747.49 | 2378.91 | 1795.22 | 2897.98 | 2897.99 |

En los cuatro casos la API reduce un céntimo de más y el neto/base queda un céntimo por debajo de Open. En c300-016, 0670 esperado `-1310.94`, actual `-1310.96`: dos céntimos de diferencia final por propagación. En c300-017 la diferencia de componentes se compensa en el resultado final: no debe descartarse por comparar sólo 0670.

Localización para investigar: `lib/dominio/irpf/trabajo-anual/conexion.ts:125–134` cuantiza la reducción final de artículo 20 antes de restarla. El patrón es compatible con un orden distinto de redondeo en operaciones intermedias en Open; esto es una hipótesis de causa, no una nueva regla fiscal acreditada. Corregir en padre con regresiones monetarias focales, manteniendo hechos y evidencias originales; no ajustar expectativas ni introducir tolerancia. No se realizó ningún cambio productivo.

## P2 — compare puede modificar el journal al seleccionar históricos

`c300.py:124` llama a `read_jsonl(..., repair_tail=True)` desde `historical_receipts`, compartido por compare y pending-only. `storage.read_jsonl` puede truncar el sufijo incompleto y añadir recovered-tail. Compare no toma el bloqueo de captura. Esperado para comparar mientras el autor captura: lectura de un corte cerrado, sin escribir el journal vivo. Actual: puede escribirlo si ve un sufijo incompleto. No se demuestra pérdida de un recibo terminado ni importe incorrecto; mejora P2, no bloqueo monetario adicional.

Repro exacto: `adversas.py`, test `test_compare_selection_repairs_tail_p2`. Crea sólo `repro-tail/journal.jsonl` sintético dentro de esta entrega, con bytes `{"incomplete":`; llama a la selección y comprueba su transformación en recovered-tail y la conservación del sufijo. Recomendación: separar lectura de comparación y reparación bajo bloqueo del operador. Esta revisión se protegió usando su propio corte completo; el journal del autor se mantuvo intacto.

## Validación y límites

- Focal existente: 5 pruebas OK (`focal.log`). Propias: 7 pruebas OK (`adversas.log`), con subcasos para todas las casillas PDF obligatorias, cada ocurrencia contradictoria y año incorrecto. Primer intento propio tuvo dos errores del arnés de revisión (elegía un started por posición y un done histórico sustituido sin código archivado); se conserva el log, se corrigió a selección explícita de done del corte. No eran fallos productivos.
- SES: año/ámbito, titular, claves monetarias duplicadas y tipos inválidos rechazados en mutaciones en memoria de un SES Open ficticio del corte; índice de importes adulterado rechazado. CAS original exclusivamente leído, no copiado ni reescrito.
- Igualdad exacta `1.0=1.00`, diferencia `1.00≠1.01`, ausencia oficial distinta de cero. PDF cero con SES ausente conserva `ses-ausente`; no se fabrican ceros ni se considera igualdad monetaria. Revalidados SES/PDF/bootstrap/summary y datos personales de todos los 218 recibos.
- Matriz: hechos de gastos completos (incluido satisfecho SI con importe cero), totales y división con resto de dos pagadores comprobados. Open recibe sumas; API conserva desglose. No son 300 territorios ni perfiles familiares. Los PENDING semánticos permanecen como reservas, sin usarlos como puerta universal.
- Inspección del flujo: contexto/navegador nuevos por caso, plantilla con hash, lecturas tras Tab, advertencias exclusivamente por dos textos exactos con límite cinco, error detiene lote, DA61 sólo bruto y SS. Límites de colegio 500/defensa 300 aplicados por la API a la suma; el input Open conserva cantidades base completas. No se ejecutó navegador ni se comprobaron nuevos cambios UI mediante red. `uiReadback` guarda el valor esperado después de las aserciones de lectura, no el texto literal observado: mejora de trazabilidad posible, sin discrepancia monetaria demostrada.
- Reanudación: prueba adversa done+error de la misma identidad excluye el done; selección histórica conserva clave/identidad y rechaza código no acreditado por CAS. No se repitieron ciclos históricos F1–F5/R1–R3 ni suites globales.
- Cuatro rutas focales con hashes iguales antes/después y coincidentes con `cuatro-congelados.json` del autor. Detalle en `hashes-antes.json` y `hashes-despues.json`. El inventario efectivo del motor está separado del de captura.

## Reproducción y entrega

Desde cualquier cwd, usando el entorno Nix ya existente:

```sh
source /home/elies/Backups/IRoboPF/producto-c300-20261104/env.sh
timeout -k 30s 1m python /home/elies/Backups/IRoboPF/producto-c300-revision-20261104/adversas.py
timeout -k 30s 10m python /home/elies/Backups/IRoboPF/producto-c300-revision-20261104/repro.py
```

El segundo reproduce el corte ya fijado en `repro-salida`, no captura ni genera datos. Su identidad será la del motor presente en ese momento, con inventario propio; no sustituye el recibo original. `revisar.py` documenta cómo se tomó el corte original; no usarlo para pretender reproducir temporalmente un estado vivo pasado.

Entrega de revisión sin parche productivo (no hubo cambios), con informe, pruebas adversas, repro, índices pequeños y manifiesto SHA256. CAS/plantillas originales permanecen fuera. PESADO1 liberado al terminar las pruebas; el autor puede seguir capturando. El padre debe validar el balance final y puede aportar su informe para actualizar ESTA revisión, sin otra revisión independiente ni repetir capturas. Este corte por sí solo no acredita 300 capturas completas y sus cuatro diferencias siguen pendientes.
