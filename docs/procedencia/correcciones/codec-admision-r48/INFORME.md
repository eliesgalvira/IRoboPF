# Identidad de recibos de admisión, R48

El padre reproduce las tres colisiones R47-N01 y corrige el codec como candidato. A02–A05 quedan corroborados en el alcance limitado de la revisión independiente y del contraste anterior R46. La nueva identidad de recibos requiere contrarrevisión antes de conectarse a composición. No se demuestra una cuantía distinta causada por los atributos de `Decimal.constructor`, ni se acepta fiscalidad.

## Recepción y contraste

Se reciben 51 archivos y 3.579.965 bytes, incluidos los sobres de transporte, desde la base `a6fc3e5e4ec2a7fc7e123356e641817b2f19d908`. El padre coteja físicamente las 21.514 entradas de esa base: lstat, enlaces, bytes y bit ejecutable, un blob cada vez. Cero diferencias y borrados. Se reconstruyen los 45 archivos del payload, incluidos los tres vacíos declarados, y se cotejan sus hashes. `recepcion.json` conserva inventario y pins; `recibir.py.txt` conserva el instrumento.

Se copian 84 fuentes técnicas al CAS propio fuera del worktree del hijo, comprobando SHA-256, SHA-512, tamaño y coincidencia con la fuente antes del arreglo. `cas-preservado.json` fija las rutas. No se incorporan documentos oficiales nuevos ni se modifica el paquete v5.

El informe independiente precisa una colisión concreta: el dominio acepta Decimal nativos cuyo campo propio constructor cambia únicamente enumerable, configurable o writable. El codec v2 excluye ese campo completo. El padre ejecuta `codec.rojo.ts` recibido sin modificar: tres fallos antes del arreglo, con las comprobaciones de dominio y atributos previas a cada desigualdad. `rojo-previo.json` y su log conservan salida 1; `runtime-anterior.mjs.txt` conserva la implementación anterior.

## Cambio y decisión

El codec v3 representa constructor en su posición original y conserva presencia y los tres atributos. Solo el valor de constructor reconocido se representa con el marcador tipado `native-constructor/Decimal`, fuera del espacio de datos ordinarios. Los constructores nativos CJS y ESM siguen siendo equivalentes bajo la precondición de bibliotecas y configuración fijadas. No se amplía el dominio ni se cambia la guardia, el cálculo, las fórmulas o las proyecciones de derechos.

Objeción experta: dos valores de siete euros no deberían requerir identidad de la función constructora de cada cargador. Respuesta: la equivalencia CJS/ESM es deliberada, pero no justifica perder los atributos que el contrato afirma preservar. El marcador común conserva esa equivalencia y permite distinguir los atributos. Coste: versión nueva y regeneración explícita de recibos; los v2 quedan pending, sin conversión silenciosa. Esto no autentica al emisor ni protege frente a JavaScript hostil que modifique prototipos o bibliotecas.

La nueva batería añade las ocho combinaciones de atributos, equivalencia CJS/ESM para cada una, ausencia y reinserción del constructor, un dato ordinario con el mismo texto del marcador y compatibilidad v2/v3 en una frontera del recorrido anual. Esa última prueba usa puertos sintéticos y acredita solo el protocolo del recibo. La regresión recibida conserva además el caso real de pagos distintos y sus importes anuales.

## Alcance de los dictámenes anteriores

- A01: quedan corroboradas las correcciones originales R46; el defecto residual R47-N01 queda corregido como candidato pendiente de revisión nueva.
- A02: corroborada la forma undefined/array derivada de la interfaz y su transporte. No acredita los valores fiscales, vigencia o proveedor.
- A03: corroborado el dominio Array nativo, con subclases pendientes. No equivale a rechazo fiscal de esas entradas.
- A04: corroborados origen y correspondencias examinados, anclas y reexportaciones. La existencia de un nodo AST no demuestra por sí sola toda equivalencia semántica.
- A05: corroborada la proyección del incremento y su contraste con las llamadas admitidas a la API real. Las cuantías y composición siguen siendo obligaciones separadas.

El padre coteja esos alcances con la revisión completa, su evidencia y el diff R46. No se repite una revisión favorable de los mismos bytes ni se reabren hipótesis fiscales sin prueba. Los históricos permanecen intactos. `dictamenes-padre.json` registra cada decisión.

## Comprobaciones y límites

Pasan 349 pruebas en una única ejecución final: las 338 recibidas, ocho pruebas R48 y los tres rojos R47 ahora correctos. Los tres nuevos casos de atributos repiten deliberadamente el discriminante del revisor; el recuento no implica 349 garantías independientes. Las 256 regresiones R46 están incluidas, no se suman de nuevo. La precisión del revisor sobre `revision-final.json` R46 es correcta: contiene 127 pruebas, 58 de contraste más 69 de derechos; el informe anterior mencionaba las primeras y la otra ejecución también incluía derechos.

Los instrumentos recibidos se ejecutan en scratch con sustitución exclusiva de rutas; `adaptacion-rutas.diff` conserva esa adaptación. No se cambian esperados ni informes ajenos. Los cinco rojos históricos quedan conservados, sin declararlos resueltos por este cambio. Tipos principal/vendor, ESLint y las 16 reglas anti-slop pasan sin cambios de configuración. `calidad-final.json` registra comandos y códigos; los logs conservan cada salida. MJS mantiene checkJs=false: el tsc principal no verifica sus cuerpos.

Se reconstruye y verifica el fragmento: SHA-256 `9d8f62076250c197e6fd840ac5b336306dc5cdcb3ff6a183ec8892604ac29b9a`, idéntico a R46 porque el cambio afecta al consumidor, no al IR. `artefacto.json` fija por separado los hashes actuales del runtime, productor, verificador, schema y pruebas. No se presenta un hash de IR idéntico como prueba de un consumidor idéntico. Hay 27.379 nodos del grafo, 716 de derechos y 17 sitios con puertas falsas. No se regeneran inventario o snapshots por un cambio de codec aislado.

La composición delegada R47 continúa en su base y no se lee su entrega parcial. Motor, inventario, 264 enlaces limitados, Madrid pendiente, confianza y 45 snapshots permanecen intactos. V5 r2 conserva el corte R26; Crossa v1 está desfasado, es copia local fuera de Victus y no custodia independiente. Sin main, PR, despliegue, LFS, gasto, transferencia o limpieza. El encargo global sigue abierto.
