# Nueve salidas explícitas y bloqueo de actividad

## Alcance del candidato

Nueve salidas de trabajo/pensión de Madrid 2025 y un bloqueo candidato de `anual.explicito.actividad.etapa`. El bloqueo depende de las 19 familias expresamente excluidas; también afecta a las variantes de actividad de DA61, retenciones, pagos y diferencial. Trabajo/pensión no cubre esas variantes. La prueba usa la API real admitida y sensibilidad separada de ingresos, retenciones y pagos; no se acepta falta de tiempo como bloqueo.

El traductor obtiene el cuerpo explícito completo de la fuente y reutiliza el intérprete común. Incorpora `push`, el resultado real del decoder y la identidad/unidad de cada salida. La frontera editorial conserva el rastro como dato, sin ejecutar publicación. Se mantiene el contrato de datos ordinarios finitos, runtime/Decimal fijados, evaluación síncrona, hechos preadmitidos y perfil individual sin las extensiones excluidas. No se certifica equivalencia universal de Effect ni fiscalidad.

## Comprobaciones y desviaciones

Los tipos principales y del plugin pasan en el checkout de integración. Oxlint global pasa; ESLint global termina sin errores, con los 16 avisos previos. La ejecución inicial pasa las cuatro regresiones seleccionadas y omite 21 por filtro. Las dos pruebas nuevas fallan por ENOENT: el auxiliar presupone su carpeta de caché, creada previamente en el checkout del autor. Se conserva `suite.json` con ambos fallos. La corrección de integración añade únicamente la creación recursiva de la carpeta al comienzo de cada prueba; original, diff y hashes en `test-recibido.ts.txt`, `fix-arnes.patch` y `fix-arnes.json`. No cambia producción, cifras ni expectativas. La repetición queda limitada a esas dos pruebas y a las comprobaciones documentales pendientes.

El checkJs estricto del autor registra 1.302 diagnósticos, 232 de archivos nuevos. No se presenta como deuda exclusivamente heredada ni como tipado integral correcto. Sus cinco diagnósticos globales coinciden con preimágenes en su host; el comando global real de integración pasa. Son configuraciones distintas. Se conservan los fallos y desviaciones del autor sin reescribir su informe.

## Decisión y alcance

El contraste de los diez IDs exige valorar bloqueo de actividad y causalidad bajo las condiciones declaradas, incluidos defaults, transformaciones, mutación del rastro y campos de origen. La coincidencia de replay no sustituye expectativas independientes. El schema de ejecución conserva el `$id` de R60; esa coincidencia no demuestra por sí sola un defecto funcional.

## Resultados de integración

Las dos pruebas repetidas pasan: 25 casos/225 salidas, API real, racionales, adversos y bloqueo de actividad. La primera ejecución ya había pasado las cuatro regresiones compartidas; no se repiten ni se suman los 21 casos omitidos por filtro. El contrato y los 25 testigos originales recibidos validan con Ajv estricto; dos originales se reproducen exactamente. Tipos principal/vendor y lint global pasan, con 16 avisos ESLint previos. El test corregido pasa ambos linters focalizados. Las veinte anclas de diez IDs coinciden por hash, UTF16 y llamada literal (`anclas-cotejadas.json`). El contraste independiente sigue pendiente.
