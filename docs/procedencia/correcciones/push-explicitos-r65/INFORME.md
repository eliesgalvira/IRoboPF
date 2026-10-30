# Corrección del retorno perdido por push

La revisión independiente corrobora localmente los nueve valores y selecciones del lote explícito y demuestra el bloqueo de actividad. R64-PUSH-01 identifica un defecto distinto: el retorno pierde los pasos acumulados. La corrección descrita se limita a ese defecto y sus regresiones pertinentes.

El contraste de integración reproduce el rojo original antes del fix: pushLengths `[1,1]`, cero pasos retornados y nueve salidas capturadas. `rojo-vitest.json` contiene el fallo de su aserción original; `push-rojo.json` conserva los datos. La copia ejecutable solo cambia imports y destino de salida. Tras el arreglo, la misma prueba pasa con `[1,2]` y ambos pasos completos, incluidos sus datos anteriores al wiring editorial. No se convierte el rojo histórico en una prueba `fails` ni se borra.

## Cambio y coste

Los aliases de arrays R62 comparten ahora propiedades e identidad del array. `push` modifica esa identidad, registra una instantánea `array-push` y su longitud. Un WeakMap local a cada ejecución fija el último evento de mutación; lecturas por alias, propiedad, longitud y selección enlazan ese estado. Cada evento sigue serializando su valor al emitirse: el segundo push no cambia el valor histórico del primero. Los otros modos conservan sus aliases anteriores; el registro de mutaciones permanece vacío en ellos.

Objeción experta: compartir referencias sin fijar versiones volvería ambiguo el origen causal o reescribiría el pasado. Respuesta: separación entre referencia viva interna e instantáneas/eventos anteriores, con aristas explícitas y comprobación del retorno completo. Coste: mantener la semántica mutable acotada y sus testigos dependientes del software. No se afirma una máquina JavaScript universal, ni soporte de grafos cíclicos, objetos exóticos o mutaciones arbitrarias fuera de las fuentes y condiciones vigentes. El servicio financiero TS y sus cifras permanecen intactos.

Tres casos nuevos —empleo laboral, estatutario y pensión— usan dos rendimientos y dos retenciones. Contrastan todos los datos de los pasos con la API real, excluyendo únicamente el campo editorial procedencia. Comprueban longitudes, conservación de instantáneas, dependencia del retorno respecto de ambas mutaciones, aristas dirigidas hacia eventos anteriores y equivalencia del consumidor para pensión. Pasan además tres regresiones seleccionadas del núcleo; quince casos quedan omitidos por filtro y no se cuentan como pases. No se repiten los 17 casos favorables del revisor ni toda la batería histórica.

## Calidad y correcciones del arnés

La primera ejecución de tipos identifica tres diagnósticos propios del test nuevo (Struct con tag y una lista de retenciones inferida como never[]) y el import fs introducido en la integración en R64. El último pase de tipos R64 precedía ese cambio de preparación; no acreditaba esos bytes finales. Se deja esta rectificación explícita. Se usa TaggedStruct, se construye la entrada con sus retenciones sin coerciones, y la creación de carpeta se sitúa en el auxiliar que ya posee las escrituras síncronas. El test R62 vuelve a su envoltorio sin fs. No se desactiva ningún diagnóstico.

Oxlint también rechazó la función auxiliar de prueba con unknown. Su frontera ahora decodifica Schema.Json y el recorrido recibe/devuelve ese tipo. Los rojos de tipos/lint y la primera versión del test permanecen. La comprobación de aristas usa un mapa de posiciones para evitar búsquedas cuadráticas; se ajustó durante la preparación de la primera pasada y la versión final completa se ejecuta de nuevo.

Pasan tipos principal/vendor, Oxlint global y ESLint global (16 avisos previos), y las tres pruebas finales del arreglo. La pasada anterior había pasado esas tres y tres regresiones compartidas; los recuentos se solapan. El rojo original también pasa después del fix, conservando su salida anterior por separado. El tipado integral checkJs sigue fuera del hito y no se declara resuelto. Guías effect-solutions testing/data-modeling y fuente local Schema consultadas; las primeras búsquedas no encontraron la ruta/coincidencia y se corrigieron sin cambiar dependencias.

## Alcance pendiente

Los nueve valores locales y el bloqueo de actividad tienen corroboración acotada. R64-PUSH-01 afecta al retorno completo y requiere comprobar sus consecuencias. La colisión `$id` del schema de ejecución conserva su límite de registro conjunto, sin cambiar la conclusión acotada del consumidor.

Comprobación documental terminal: contrato y testigo actual pasan Ajv estricto; replay actual correcto. Rechazados el testigo de software anterior y la sustracción de aristas de la mutación. Se conserva testigo-actual.json.gz con ambos hashes y tamaño en documental.json. Los cuatro flags siguen false. Los originales anteriores permanecen intactos.
