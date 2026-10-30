# Recepción del último lote de diez sitios, R64

Candidato recibido de Sol 6.1 High, con priority solicitado. No se promueve ningún cierre antes de su única revisión independiente. Se mantienen los 55 sitios ya corroborados técnicamente bajo condiciones y quedan estos diez para la revisión final del alcance acordado.

## Qué se incorpora

Nueve salidas de trabajo/pensión de Madrid 2025 y un bloqueo candidato de `anual.explicito.actividad.etapa`. El bloqueo depende de las 19 familias expresamente excluidas; también afecta a las variantes de actividad de DA61, retenciones, pagos y diferencial. Trabajo/pensión no cubre esas variantes. La prueba usa la API real admitida y sensibilidad separada de ingresos, retenciones y pagos; no se acepta falta de tiempo como bloqueo.

El traductor obtiene el cuerpo explícito completo de la fuente y reutiliza el intérprete común. Incorpora `push`, el resultado real del decoder y la identidad/unidad de cada salida. La frontera editorial conserva el rastro como dato, sin ejecutar publicación. Se mantiene el contrato de datos ordinarios finitos, runtime/Decimal fijados, evaluación síncrona, hechos preadmitidos y perfil individual sin las extensiones excluidas. No se certifica equivalencia universal de Effect ni fiscalidad.

## Recepción verificable

Base del autor: `1b0676b83dd3be448484c8167ebd1e308dacae30`. Cotejo físico de 23.648 entradas contra blobs, bajo lock: tres modificaciones autorizadas y cero borrados. Censo completo de extras dentro de ámbito. Se verificaron SHA-256/SHA-512/tamaño/modo, preimágenes y conjunto exacto del transporte: 258 rutas, incluidos tres archivos vacíos. Patch aplicado con separación LF y modo binario; sin normalizar CRLF. Integradas 120 rutas, 77.603.752 bytes, y preservadas 88 referencias técnicas por hash. No son originales fiscales nuevos.

El original de la entrega y su sobre se conservan íntegros. CAS de recepción: `.cache/orquestador-preservacion/recepciones-r64/sha256`. Reconstrucción: `.cache/orquestador-recepcion/r64/transporte`. Véanse `recepcion.json`, `cas-preservado.json` y `recibir.py.txt`. Las tres preimágenes se conservan en `preimagenes/`.

## Comprobaciones y desviaciones

Los tipos principales y del plugin pasan en el checkout del padre. Oxlint global pasa; ESLint global termina sin errores, con los 16 avisos previos. La ejecución inicial pasa las cuatro regresiones seleccionadas y omite 21 por filtro. Las dos pruebas nuevas fallan por ENOENT: el auxiliar presupone su carpeta de caché, creada previamente en el checkout del autor. Se conserva `suite.json` con ambos fallos. El padre añade únicamente la creación recursiva de la carpeta al comienzo de cada prueba; original, diff y hashes en `test-recibido.ts.txt`, `fix-arnes.patch` y `fix-arnes.json`. No cambia producción, cifras ni expectativas. La repetición queda limitada a esas dos pruebas y a las comprobaciones documentales pendientes.

El checkJs estricto del autor registra 1.302 diagnósticos, 232 de archivos nuevos. No se presenta como deuda exclusivamente heredada ni como tipado integral verde. Sus cinco diagnósticos globales coinciden con preimágenes en su host; el comando global real del padre pasa. Son configuraciones distintas. Se conservan los fallos y desviaciones del autor sin reescribir su informe. Una consulta propia intentó rg sin Nix y terminó 127; se repitió desde Nix, sin efectos sobre archivos.

## Decisión y siguiente paso

D135 exige una sola revisión independiente nueva de los bytes integrados. Debe decidir los diez IDs, valorar el bloqueo de actividad y la causalidad bajo las condiciones declaradas, incluyendo defaults, transformaciones, mutación del rastro y campos de origen. La coincidencia de replay no sustituye expectativas independientes. Se señala al revisor que el schema de ejecución nuevo conserva `$id` de R60 para que determine su impacto concreto; no se declara por ello un defecto funcional probado.

No se vuelve a revisar favorablemente los 55 sitios anteriores; solo hay regresiones pertinentes al núcleo común. No se emprenden familias, composición global, admisión ni las cuatro puertas. Todas permanecen falsas. Si la revisión no reproduce un defecto, procede el informe final y detener el encargo. Crossa mantiene v1 desfasado, V5 conserva el corte R26 y no se inicia otra transferencia. Sin main, PR, despliegue, LFS, gasto ni limpieza.

## Resultado terminal de recepción

Las dos pruebas repetidas pasan: 25 casos/225 salidas, API real, racionales, adversos y bloqueo de actividad. La primera ejecución ya había pasado las cuatro regresiones compartidas; no se repiten ni se suman los 21 casos omitidos por filtro. El contrato y los 25 testigos originales recibidos validan con Ajv estricto; dos originales se reproducen exactamente. Tipos principal/vendor y lint global pasan, con 16 avisos ESLint previos. El test corregido pasa ambos linters focalizados. Las veinte anclas de diez IDs coinciden por hash, UTF16 y llamada literal (`anclas-cotejadas.json`). El contraste independiente sigue pendiente.
