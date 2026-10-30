# IPC observado y escenario de diciembre de 2026

Se implementan los puntos contrastados en `auditorias/ipc-redondeos` y `revisiones/ipc-redondeos`. `rojo.log` conserva tres pruebas previas fallidas: 2026 aparecía como observado; una comparación de 2025 hacia 2024 devolvía factor 1; faltaba la clasificación del escenario. Este informe no acredita una revisión independiente de la implementación.

La serie observada termina en diciembre de 2025. El 3 % de 2026 se conserva como hipótesis heredada identificada, con método, horizonte y fecha de clasificación. El Python original, línea 20, contiene 0.030; no se atribuye autor ni fecha de emisión que no estén acreditados. La API general exige seleccionar el escenario cuando lo necesita; el adaptador legacy lo selecciona por su contrato. Un dato ausente no se sustituye por cero. Años inválidos se rechazan y el mismo año tiene factor uno sin consumir una observación.

Las tres implementaciones del factor comparten la misma función. Una comparación inversa usa el recíproco. Los resultados incluyen la procedencia, los textos existentes distinguen el escenario y ambas exportaciones Excel lo declaran en sus propiedades documentales. No cambian las celdas ni nombres de hojas del oracle.

Decisión: conservar el producto de tasas de diciembre publicadas, cuyo factor 2012–2025 es 1.270974585050486217 a 18 decimales. No se lo presenta como cociente exacto de índices INE. Objeción experta: los índices y el producto de tasas redondeadas difieren y deben identificarse. Coste: la modalidad por índices y la conciliación de redondeos del Excel siguen pendientes; no se reescriben expectativas del oracle para obtener verde.

Pasan 23 pruebas seleccionadas de IPC, normativa, caracterización legacy, auditoría y Excel. La comprobación global posterior está registrada en correcciones/coherencia-ronda9: los recuentos se solapan. Hay una prueba adicional de ausencia/identidad/ámbito; no se cuenta como discrepancia fiscal previa.
