# Contrato de inventario y hallazgos

Este contrato fija la información exigida al inventario y a los hallazgos documentales. La reproducción del inventario se describe en `INVENTARIO.md`; sus elementos técnicos requieren interpretación fiscal y revisión independiente.

## Elemento inventariado

Identificador estable, dominio, clase (`parameter`, `formula`, `step`, `rounding`, `condition`), nombre y explicación en español, ejercicios, territorio y régimen, archivo y símbolo de implementación, valor actual o expresión, unidad, entradas, derivaciones y ámbito de aplicación. Distinguir expresamente herencia anual y vigencia dentro del año.

Cada elemento tendrá relaciones con normas, documentos, citas y hallazgos. Se registrará por separado la cobertura del motor, la evidencia disponible y la revisión independiente. Un elemento catalogado no equivale a una regla ejecutada.

## Hallazgo candidato

Campos mínimos: `id`, `itemIds`, `domain`, `years`, `territories`, `status` (`match`, `mismatch`, `missing`, `ambiguous`), `engineLocations`, `engineValue`, `officialValue`, `units`, `reason`, `sources`, `legacyComparison`, `edgeCases`, `proposedTest`, `review`.

`review` comienza pendiente y contiene después el identificador del segundo auditor, conclusión, objeciones y evidencias examinadas. No dar por aceptado un hallazgo propio. Las cifras requieren unidad y condiciones: un tipo conjunto no equivale al componente estatal, ni un tope mensual al anual.

## Documento y cita

Documento: URL canónica y URL final, fecha UTC de descarga, estado HTTP, cabeceras, hashes SHA-256 y opcional SHA-512, tamaño, MIME, identificador oficial, publicación y versión/consolidación, resultado y alcance de validación de autenticidad. Guardar el original sin transformar, por hash.

Cita: hash del documento, página y convención de numeración, sistema de coordenadas PDF, cajas, texto exacto, selectores W3C cuando proceda, fila/celda para tablas, extracción por capa de texto u OCR expresamente marcado. Facsímil: hash, motor y versión, DPI y parámetros de recorte reproducibles. No inventar coordenadas ni confundir texto normalizado con cita literal.

## Salida de cada auditor

Informe español y JSON de hallazgos en `docs/procedencia/auditorias/<dominio>/`. Adjuntar originales descargados o su ubicación temporal verificable, metadatos y candidatos de citas. Exponer lo que falta y los límites de la búsqueda. No modificar el motor antes de la contrarrevisión y de demostrar el fallo mediante una prueba.

Todo código TypeScript debe pasar anti-slop antes de la entrega. Para Effect, consultar primero `effect-solutions list`, guías pertinentes y fuentes locales de Effect v4. Las correcciones de estilo no pueden modificar silenciosamente reglas fiscales.
