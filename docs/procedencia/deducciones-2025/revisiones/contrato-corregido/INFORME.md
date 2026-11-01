# Contraste independiente de las correcciones del contrato

**Dictamen: R01, R02 y R03 corregidos en el alcance comprobado; no se ha reproducido un defecto nuevo. Contraste concluido, sin recomendar otra ronda favorable.** Base exigida y comprobada: `900fd0991e58c852179f93b8effa1c76b5a4b6e2`. Se examinó el diff desde `37eb33d0`, los controles del consumidor, el schema, la documentación y las regresiones pertinentes. Esta revisión técnica no valida normas ni emite aceptación fiscal.

## Decisiones

| ID | Decisión y evidencia |
| --- | --- |
| R01 | Corregido. El consumidor interpreta la fase por comparación: ausente equivale a `despues`; `antes` requiere cambio y comparación actual del mismo campo. Las diferencias actuales exigen global y al menos un subdictamen discrepantes; las reservas actuales exigen pendientes y prohíben global coincidente. Se rechazan el contraste de otro campo como sustituto y la ocultación tras un fix ajeno. La mezcla de diferencia y reserva actuales pasa únicamente conservando la discrepancia y los pendientes. |
| R02 | Corregido. Los IDs se resuelven dentro de cada lote. Adquisiciones del mismo contenido con IDs, URLs y fechas propios pasan sin mutación de los paquetes. Una cita a un documento existente solo en otro lote se rechaza. Para SHA-256 compartido se rechazan discrepancias de SHA-512, bytes o MIME, incluso sin CAS. Se mantiene la unicidad de ID dentro del lote y se admiten varias adquisiciones locales con IDs distintos. No se exige igualdad de metadatos independientes. |
| R03 | Corregido. `parse_qsl(..., keep_blank_values=True)` y `casefold()` detectan los cinco nombres filtrados en cualquier posición, codificados o con mayúsculas, sin valor o con valor vacío. Los marcadores son sintéticos. Los parámetros documentales ordinarios, incluidos vacíos y repetidos, pasan. No se amplía la conclusión a cualquier posible secreto o codificación. |

## Resultados y migración

- Fuente anterior extraída a archivos privados, sin checkout ni mutación VCS: los cinco casos originales reproducen **tres fallos de aserción y dos errores**; el positivo histórico original pasa (seis casos ejecutados en total). Solo se ajustó en el cargador privado la raíz de referencia del módulo trasladado para conservar el límite CAS del repositorio real.
- Regresiones actuales del padre: **37/37 pasan**, incluidos los cinco defectos anteriores y los controles de fase, reserva, contenido compartido y URL.
- [Casos propios](casos.py): **7/7 pasan**, con subcasos acotados. Reutilizan los fixtures sintéticos anteriores, sin copiar originales ni paquetes a Git.
- Ruff sobre consumidor, regresiones y ambos archivos de casos: **sin incidencias**.
- Vitest: intento no ejecutable por ausencia de `node_modules`/`vitest` en este checkout. No se cuenta como reproducción de las diez pruebas comunicadas por el padre ni se instalaron dependencias. No se repitió el typecheck global ni se investigaron los cuatro diagnósticos históricos ajenos; tampoco builds o suites legacy.

La migración histórica es intencional y conserva las expectativas sustantivas. El caso anterior solo expresa la fase en texto libre; ese texto carecía de semántica ejecutable en el schema. Ahora se rechaza como diferencia actual mientras no se declare `momento: "antes"`. El caso propio conserva literalmente todos los datos y motivos del paquete ambiguo, añade únicamente ese campo, comprueba su aceptación y coteja que no hubo ningún otro cambio. El override del padre también explicita el valor anterior 90, coherente con el cambio 90→100 ya narrado. Mantiene comparación actual, contraejemplo, prueba roja y corrección; no elimina evidencia ni rebaja expectativas. El rechazo del formato ambiguo no es una regresión fiscal. Los tres archivos de la revisión previa permanecen intactos.

## Alcance y límites

La comprobación es estructural y de coherencia del contrato; los positivos CAS usan bytes sintéticos. No demuestra oficialidad de dominios, literalidad de citas, suficiencia jurídica, vigencia de las 351 normas ni ejecución de pruebas narradas en los paquetes. Se conserva el estado candidato y la necesidad de revisión independiente de las evidencias fiscales. No se consultó la red para fuentes fiscales ni se descargaron originales.

Se añadieron únicamente este informe, las [decisiones](decisiones.json) y los casos de esta carpeta. El cotejo físico final de todos los archivos de partida inventariados confirma cero modificaciones y cero borrados; HEAD permanece en la base exigida. Logs, fuente anterior, diff y manifiesto SHA-256 se conservan exclusivamente en la entrega privada. No se modificó producto, UI, fuentes fiscales, ESTADO ni informes previos; no hubo operaciones VCS mutantes.
