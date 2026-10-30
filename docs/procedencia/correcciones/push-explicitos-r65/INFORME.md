# R65: corregir el retorno perdido por push

Se recibe la única revisión independiente del lote explícito. Corrobora localmente los nueve valores/selecciones y demuestra el bloqueo de actividad; reproduce R64-PUSH-01. No se repiten sus conclusiones favorables. Esta ronda corrige y revisará exclusivamente ese defecto y sus regresiones pertinentes.

## Recepción y reproducción

Base del revisor `cd41524b432c5d4c2a7f665603debef6be5abc28`. Cotejo físico completo bajo lock: 23.958 entradas intactas, cero borrados y extras dentro del ámbito. Reconstrucción exacta de 195 rutas, con bytes, modos, SHA-256/SHA-512 y un archivo vacío. Se incorporan 58 rutas, 47.999.426 bytes, y siete originales técnicos preservados. Sobre original conserva sus rutas de origen; el padre registra el traslado del transporte a `revisiones/causal-explicitos-r64-sol/transporte/` en `recepcion.json`. No se reescriben sus informes ni testigos.

El padre reproduce el rojo original antes del fix: pushLengths `[1,1]`, cero pasos retornados y nueve salidas capturadas. `rojo-vitest.json` contiene el fallo de su aserción original; `push-rojo.json` conserva los datos. La copia ejecutable solo cambia imports y destino de salida. Tras el arreglo, la misma prueba pasa con `[1,2]` y ambos pasos completos, incluidos sus datos anteriores al wiring editorial. No se convierte el rojo histórico en una prueba `fails` ni se borra.

## Cambio y coste

Los aliases de arrays R62 comparten ahora propiedades e identidad del array. `push` modifica esa identidad, registra una instantánea `array-push` y su longitud. Un WeakMap local a cada ejecución fija el último evento de mutación; lecturas por alias, propiedad, longitud y selección enlazan ese estado. Cada evento sigue serializando su valor al emitirse: el segundo push no cambia el valor histórico del primero. Los otros modos conservan sus aliases anteriores; el registro de mutaciones permanece vacío en ellos.

Objeción experta: compartir referencias sin fijar versiones volvería ambiguo el origen causal o reescribiría el pasado. Respuesta: separación entre referencia viva interna e instantáneas/eventos anteriores, con aristas explícitas y comprobación del retorno completo. Coste: mantener la semántica mutable acotada y sus testigos dependientes del software. No se afirma una máquina JavaScript universal, ni soporte de grafos cíclicos, objetos exóticos o mutaciones arbitrarias fuera de las fuentes y condiciones vigentes. El servicio financiero TS y sus cifras permanecen intactos.

Tres casos nuevos —empleo laboral, estatutario y pensión— usan dos rendimientos y dos retenciones. Contrastan todos los datos de los pasos con la API real, excluyendo únicamente el campo editorial procedencia. Comprueban longitudes, conservación de instantáneas, dependencia del retorno respecto de ambas mutaciones, aristas dirigidas hacia eventos anteriores y equivalencia del consumidor para pensión. Pasan además tres regresiones seleccionadas del núcleo; quince casos quedan omitidos por filtro y no se cuentan como pases. No se repiten los 17 casos favorables del revisor ni toda la batería histórica.

## Calidad y correcciones del arnés

La primera ejecución de tipos identifica tres diagnósticos propios del test nuevo (Struct con tag y una lista de retenciones inferida como never[]) y el import fs introducido por el padre en R64. El último pase de tipos R64 precedía ese cambio de preparación; no acreditaba esos bytes finales. Se deja esta rectificación explícita. Se usa TaggedStruct, se construye la entrada con sus retenciones sin coerciones, y la creación de carpeta se sitúa en el auxiliar que ya posee las escrituras síncronas. El test R62 vuelve a su envoltorio sin fs. No se desactiva ningún diagnóstico.

Oxlint también rechazó la función auxiliar de prueba con unknown. Su frontera ahora decodifica Schema.Json y el recorrido recibe/devuelve ese tipo. Los rojos de tipos/lint y la primera versión del test permanecen. La comprobación de aristas usa un mapa de posiciones para evitar búsquedas cuadráticas; se ajustó durante la preparación de la primera pasada y la versión final completa se ejecuta de nuevo.

Pasan tipos principal/vendor, Oxlint global y ESLint global (16 avisos previos), y las tres pruebas finales del arreglo. La pasada anterior había pasado esas tres y tres regresiones compartidas; los recuentos se solapan. El rojo original también pasa después del fix, conservando su salida anterior por separado. El tipado integral checkJs sigue fuera del hito y no se declara resuelto. Guías effect-solutions testing/data-modeling y fuente local Schema consultadas; las primeras búsquedas no encontraron la ruta/coincidencia y se corrigieron sin cambiar dependencias.

## Alcance pendiente

Los 55 sitios anteriores mantienen su corroboración. Los nueve valores locales y el bloqueo de actividad cuentan con su única revisión favorable; queda revisar solo R64-PUSH-01 corregido y sus consecuencias. La colisión `$id` del schema de ejecución se conserva como límite de registro conjunto, sin cambiar la conclusión acotada del consumidor actual ni abrir otra ronda por ella.

Tras una revisión favorable del arreglo y el contraste del padre, procede el informe final de los 65 sitios: no iniciar familias19, composición global, admisión ni cuatro puertas. Sus flags siguen falsos. Crossa conserva v1 desfasado y V5 el corte R26. Sin main, PR, despliegue, LFS, gasto, transferencia ni limpieza.

Comprobación documental terminal: contrato y testigo actual pasan Ajv estricto; replay actual correcto. Rechazados el testigo de software anterior y la sustracción de aristas de la mutación. Se conserva testigo-actual.json.gz con ambos hashes y tamaño en documental.json. Los cuatro flags siguen false. Los originales anteriores permanecen intactos.
