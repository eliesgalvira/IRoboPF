# Contrarrevisión del consumidor v3 corregido, R21 Sol

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Base examinada: `960773f909d4ecff290edfa3d7a7b2699a8445d3`. Las conclusiones nuevas son candidatas para contraste; no implican aceptación fiscal ni cierre global.

## Alcance y evidencia fijada

Se examinaron la recepción R19, los cuatro informes de corrección R21, la revisión previa y sus recetas. `fuentes.json` fija SHA256, SHA512 y tamaño de 23 entradas versionadas. AGENTS es un enlace: su pin de árbol corresponde a los bytes de readlink y las instrucciones se leen desde el destino.

La revisión conserva separados el transporte v2, el sobre edition3/formatVersion1, las adquisiciones y la fase efectiva de publicación. Se examinan recolector, preservacion.py, clasificador de URLs, ambos schemas y los 35 endpoints TGSS. Esta lista es una política cerrada de URLs examinadas, no autenticación del documento ni garantía universal de anonimato. No se consulta v4 ni se leen sus resultados.

Los diez métodos del padre se ejecutan por herencia sin duplicar los ocho originales. Se configura la importación histórica dentro del proceso Python; el instrumento histórico recibe únicamente un SCRATCH propio. `inherited.log` termina OK, diez métodos, cero fallos o errores. No se modificaron expectativas históricas. El control de rutas del padre contiene cinco subcasos; el de cierre recursivo contiene seis niveles. Los ocho originales conservan además parser sin duplicados/NaN, fechas con zona, corrupción, ausencia, destino existente, ancestro symlink, publicación y recuperación.

## Dictamen sobre las cinco correcciones anteriores

**PV3-SOL-01:** corregido el defecto demostrado de campos privados anidados y baseline ausente. El consumidor aplica un schema con required/additionalProperties en los objetos y exige rutas relativas, huellas y tamaños. El discriminador entero redefine integer como `type(value) is int`, evitando bool y floats equivalentes. Esto no implica que todo string admitido represente metadatos publicables; los límites adicionales se detallan con las pruebas propias.

**PV3-SOL-02:** corregida la elevación de captura secundaria a primaria. Se contrasta la clase contra ambos hosts, canonicalUrl y finalUrl; cualquier adquisición conservada de archivo obliga a clasificación secundaria. Facsímil exige ausencia de adquisiciones; documento primario candidato exige adquisiciones admitidas sin archivo. Ninguna etiqueta afirma firma válida, autenticidad histórica o corrección fiscal.

**PV3-SOL-03:** el bloque de sincronización de confirm convierte OSError posterior al marcador en PublicationDurabilityUnknown. verify y los pins siguen precediendo a esa sincronización: una corrupción se rechaza por integridad, no se rebautiza como un éxito durable. La matriz fsync distingue el marcador final de STAGING, blobs y dependencias; la publicación parcial de un archivo auxiliar tampoco se confunde con paquete completo.

**PV3-SOL-04:** la ampliación TGSS usa igualdad exacta con los 35 endpoints versionados. No acepta un sufijo libre tras descarga/es. No se amplía esa lista ni se descarga documentación en esta revisión.

**PV3-SOL-05:** el sum dinámico del recolector se sustituyó por acumulación sobre facts tipado. El log histórico mypy-entrega declara cinco fuentes; las recetas finales añaden follow-untyped-imports para PyMuPDF. El diagnóstico anterior por imports skip no equivale a ese alcance. Esta revisión conserva su ejecución nueva y no sustituye mypy por lint TypeScript.

## Decisiones, objeciones y costes

**R21-P01 — no repetir la restauración completa.** Objeción del mejor archivero: probar solo fixtures podría ocultar un cambio de formato que invalida el paquete auténtico. Respuesta: cargar y verificar las dos copias reales fijadas, además de releer sus objetos y dependencias con hashlib independiente; ejercer transfer y confirm en destinos nuevos pequeños. La restauración independiente completa R19 ya está conservada. Coste: no se demuestra una segunda restauración completa nueva con este consumidor; sí se contrasta el nuevo schema contra carga real y la recuperación de los fallos modificados.

**R21-P02 — preservar los nuevos rojos.** Objeción del mejor revisor: un endurecimiento deseable no prueba un fallo del contrato existente. Respuesta: separar los defectos anteriores corregidos de las reservas nuevas sobre listas/rutas y demostrar su comportamiento sin cambiar código o expectativas. Coste: no dar un dictamen universal de puerta cerrada por el verde heredado; la prioridad y corrección de los nuevos candidatos requieren contraste del padre.

**R21-P03 — pins y árbol físico, sin VCS mutante.** Objeción del mejor integrador: el índice puede omitir archivos nuevos o simular borrados. Respuesta: comparar cada blob de la base con lstat/readlink/bytes y entregar manifiesto de altas, patch textual gzip y binarios por ruta/hash. Coste: dos recorridos serializados y más evidencia de control; no se entrega commit ni se modifica el índice.

## Límites permanentes

Integridad, autenticidad, interpretación, número y revisión siguen siendo ejes distintos. No se revalida confianza histórica PAdES/CSV/sellado ni reglas fiscales. El inventario `30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7`, su artefacto `59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7`, 52.461 ocurrencias y 65 sitios no acreditan aceptación. No se promocionan los 264 payloads R19. Madrid `e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258` sigue pendiente. V1 `a257e37f24d5a8c2f9306d64b1b706c658de067e501128652db550a7e485280f` y V2 `082bfc98eb13469b45e456a3d6cc65ebe811a748c1535d606efc3b06e78370ad` no se regeneran; sus 719 objetos y 34 snapshots no se vuelven a contar como cobertura fiscal.

V3 es un corte histórico, sin las incorporaciones posteriores R20/R21; comprobar sus 945 objetos no actualiza el corpus. Crossa conserva v1 `2df6c208…`, según el contexto recibido, misma casa y dueño, sin custodia independiente o remota; no se contactó ni se escribió allí. No hay originales nuevos adquiridos ni necesidad de CAS documental nuevo. Todos los fixtures quedan en scratch propio.

Sin fixes, paquetes modificados, collect/export/confirm históricos, originales alterados, ESTADO/DECISIONES editados, LFS, transferencias externas, interacciones con terceros, PR, deploy, servidor, preview, UI o VCS mutante. Solo se añade esta carpeta y el scratch propio de herramientas/fixtures. La preparación Nix/uv puede descargar herramientas; no se transfiere el corpus. Los límites de la máquina se respetan con flock pesado y un trabajador, incluso durante las esperas compartidas.

## Candidatos nuevos para contraste posterior

**PR21-SOL-01, P3 — el anclaje `$` admite un salto de línea final en rutas.** En `$defs.path` y en `annex.sources`, el pattern termina con `$`. El motor regex permite coincidir antes de un salto final, por lo que `checkout:payload\n`, `parent:a\n` y `doc.json\n` pasan load. `safe_source` comprueba escape/ancestros, pero no rechaza ese carácter. `test_ruta_con_salto_final_no_debe_publicarse` crea un archivo real llamado `payload\n` dentro del fixture, llama transfer sin restauración auxiliar y obtiene publicación/confirmación en vez del ValueError exigido. No hay escape físico, dato personal real ni alteración del paquete v3 fijado; sí incumplimiento observable de la ruta portable anunciada y posibilidad de metadatos multilínea. `rojos.log` conserva dos subfallos de carga y un fallo de transferencia por este candidato.

Objeción del mejor experto: un nombre con salto es legal en Linux y el pin externo fija sus bytes. Respuesta: legalidad de un nombre local no satisface el contrato portable ni el rechazo de controles; el lector acepta manifiestos nuevos y este caso atraviesa la puerta completa. Coste propuesto: cerrar la coincidencia al final real o añadir validación explícita de caracteres, con regresiones nuevas; no cambiar manifiestos históricos ni interpretar este fallo como autenticación eludida.

**PR21-SOL-02, P3 — unicidad parcial del sobre.** Se rechazan hashes de objetos repetidos y paths de dependencia duplicados. Sin embargo, load acepta duplicados exactos en acquisitions, sources, references, unresolvedReferences y exclusions. La matriz de 128 mutaciones lo demuestra y las expectativas protectoras de las tres listas del anexo dejan tres subfallos adicionales. El transporte v2 conserva sus controles de unicidad propios; no se le atribuye esta carencia del nuevo sobre. No se observa corrupción ni multiplicación de objetos CAS: el defecto es la redundancia admitida en los registros y su posible recuento como evidencia distinta.

Objeción del mejor experto: las listas pueden modelar referencias repetidas y el contrato no declara uniqueItems en ellas. Respuesta: es una reserva de consistencia y endurecimiento, de menor severidad; no invalida la restauración local ni reabre los cinco fallos anteriores por asociación. La política debe precisar si admite semánticamente la multiplicidad. Coste propuesto: política expresa por lista y rechazo lineal de duplicados si se exige conjunto; no imponer uniqueItems cuadrático ni alterar conteos históricos silenciosamente.

`mutaciones.json` contiene 128 casos: siete discrepancias de rechazo, correspondientes a los dos candidatos, y dos controles positivos de prefijo. No se suman estos subcasos con los métodos heredados como si fueran pruebas independientes de aceptación. `rojos_test.py` termina 1: tres métodos, seis fallos, cero errores; se conservan las expectativas y no se corrige implementación.

## Durabilidad y calidad reproducidas

`fsync.json` conserva las 24 posiciones de llamada observadas en una transferencia válida de un objeto y una dependencia, y una ejecución nueva fallando en cada posición. Quince fallos ocurren antes del marcador final: incluyen directorios, blob, temporal del marcador y publicaciones auxiliares. En tres de ellos publish devuelve PublicationDurabilityUnknown por STAGING, dependencia o transporte ya visible; **eso no acredita presencia de manifest.json**. Los nueve fallos desde la publicación del marcador final, incluido todo el tramo de confirm, dan PublicationDurabilityUnknown con manifest.json presente. Al retirar la inyección, confirm verifica pins/bytes y termina fsync-confirmed en esos nueve casos, sin borrar el destino ni repetir transfer encima. No se simula corte eléctrico ni hardware defectuoso.

`rutas-urls.json` y `rutas.log` conservan dos transferencias sin parámetro source, una con checkout: y otra con parent:, redirigiendo ambas raíces únicamente a archivos propios del fixture. Carga de los 35 endpoints exactos y rechazo de cinco sufijos no examinados correctos. Los controles mixtos conservan clasificación secundaria cuando canonical es BOE y final archivo; ambas URLs BOE permiten primaria candidata. Esto verifica contrato de clasificación, no emisor del documento.

Mypy nuevo sobre recolector, preservacion.py, preservacion_urls.py, adversos R21 y evidencias editoriales termina **0: cinco fuentes sin diagnósticos**, con follow-untyped-imports, follow-imports=silent y check-untyped-defs. Se conserva el log y no se infiere tipado estricto universal. El Ruff inicial detectó errores de formato/importación en los instrumentos nuevos de esta revisión; se corrigieron exclusivamente aquí y el pase propio siguiente termina 0. Los primeros logs permanecen; ningún diagnóstico de producto se oculta con excepciones.

Para cada dictamen anterior se explicita también el juicio experto:

- **PV3-SOL-01:** objeción: un schema recursivo no garantiza por sí solo unicidad ni coincidencia de toda la cadena. Respuesta: confirmar solo el cierre de campos demostrado y mantener los nuevos candidatos separados. Coste: otra corrección/revisión si se exige el contrato portable completo.
- **PV3-SOL-02:** objeción: un host oficial puede servir un documento equivocado o no autenticar bytes históricos. Respuesta: se valida clasificación de procedencia candidata, sin elevarla a autenticidad. Coste: siguen pendientes autenticación e interpretación independientes.
- **PV3-SOL-03:** objeción: fsync inyectado no reproduce todos los fallos de un apagado real. Respuesta: el ensayo cubre cada etapa de llamadas del protocolo y la recuperación real contra pins; no promete resistencia física. Coste: persiste riesgo común del equipo y falta ensayo eléctrico/hardware.
- **PV3-SOL-04:** objeción: 35 URLs cerradas rechazan documentos legítimos nuevos y no prueban anonimato. Respuesta: revisar toda ampliación y mantener los originales nuevos en otro corte. Coste: mantenimiento editorial explícito y falsos rechazos conservadores.
- **PV3-SOL-05:** objeción: mypy con imports silent y cuerpos no anotados no es tipado estricto del parser dinámico. Respuesta: declarar opciones y las cinco fuentes comprobadas sin generalizar a todo Python. Coste: quedan invariantes runtime y revisiones de código que el tipador no acredita.

## Carga real del corte, sin reescritura

`real.json` y `bytes-{paquete,restauracion}-v3.json` acreditan el pase completo de ambas copias entregadas en el padre, en solo lectura. Para cada copia: 945 objetos únicos, 1.068.593.978 bytes y las 1.910 referencias de dependencia explícitas del sobre. Cada objeto/referencia se relee con hashlib propio SHA256/SHA512 y tamaño; se comprueban ancestros sin enlaces y archivo regular. Después se ejecuta verify real, que vuelve a contrastar marcadores externos y transporte. No se suman referencias duplicadas como objetos adicionales ni se denomina cierre universal de la aplicación a este cierre material explícito.

Pins completos conservados: sobre `147e90bf15aa6a82e71b304bd6bd8983983007c2b07ed6e306f1ca244f3ae8be`; transporte `b4e91adcdd69dbe62f221d97bc8910ad1243719b8bdcb63df095ce5679c8db9e`. Ambos coinciden con las entradas versionadas y los marcadores de cada copia. No se escribe en paquete-v3, restauracion-v3 ni recibos históricos. No se ejecuta nueva restauración completa.

**PR21-SOL-03, P3 — diagnóstico URL con valor recibido.** `recolector.url` llama primero al clasificador v2, que captura ValueError de puertos malformados, pero la extensión vuelve a evaluar `parsed.port` sin esa captura. Un canonicalUrl `https://www.seg-social.es:PRIVATE_SENTINEL/descarga/es/123` provoca `ValueError: Port could not be cast to integer value as 'PRIVATE_SENTINEL'`. El documento se rechaza antes de publicar; el problema es el valor expuesto al registrar la excepción. `complementos.json` y su rojo conservan la prueba. No se ha usado dato personal ni secreto real.

Objeción del mejor experto: rechazar una URL inválida es correcto y el consumidor puede filtrar excepciones en otro nivel. Respuesta: se confirma ese rechazo; la garantía explícita de diagnóstico sin valores debe cubrir también el fallback que utiliza load, cuya API pública propaga esta excepción sin sanear. Coste propuesto: capturar errores de parsing y devolver rechazo/diagnóstico constante, con regresión; no silenciar fallos ni dar por saneados los bytes del documento. Requiere contraste posterior.

El complemento confirma además required en ambos registros restantes: ausencia de sha256/sources en unresolvedReferences y de path/reason en exclusions se rechaza. El cierre de campos y los nuevos problemas de duplicados se distinguen expresamente.

## Cierre de esta entrega acotada

Las 19 regresiones de preservación terminan 0. Tras corregir solo anotaciones/importación de los instrumentos propios, mypy vuelve a pasar: **siete fuentes propias sin diagnósticos**. Ruff de cierre termina 0. La reorganización de importación se contrasta repitiendo los diez métodos, todos correctos. El complemento vuelve a dejar rojo exactamente el diagnóstico de puerto con valor recibido; sus cuatro subcasos de campos obligatorios pasan. Las seis expectativas fallidas del primer instrumento rojo permanecen sin cambios.

Oxlint inicial termina 1 por falta de resolución de @oxlint/plugins en este checkout, sin node_modules local. El segundo control termina 0 en un scratch nuevo con configuración y runtime copiados y cotejados, node_modules del padre enlazado en solo lectura, un trabajador y configuración anidada deshabilitada. `anti-slop.json` mantiene las 16 reglas a error. Es carga de runtime con un fixture TS mínimo: **no acredita lint global ni typecheck de la aplicación**. No hay TypeScript/Effect de producto nuevo en esta entrega. Los errores iniciales de Ruff/mypy propios, los de entorno y los rojos funcionales tienen logs distintos y no se presentan como verde universal.

Inicio y cierre: HEAD exacto, **14.537 entradas presentes e idénticas**, cada una comprobada con lstat y readlink/bytes frente a su blob base; cero borrados y diff de archivos de base vacío. No se confía en el índice. Los dos controles completos se conservan comprimidos; el cierre incluye además comparación de tipo físico. Los pins de las fuentes examinadas no cambian.

`MANIFIESTO.json` enumera archivos relativos con SHA256, SHA512, tamaño y baseSha256 null para las altas; declara HEAD/base y cero borrados. Excluye explícitamente su propia ruta, el patch y el índice binario por autorreferencia. `entrega.patch.gz` contiene las altas textuales contra base. `binarios.json` enumera controles gzip por ruta/hash/tamaño; no hay originales PDF en la entrega. Scratch, entorno y runtime de lint no se incluyen. No se elimina material para empaquetar.

Dictamen: los cinco defectos previos están corregidos en los casos y alcance comprobados. Se mantienen **tres candidatos P3 nuevos** antes de considerar universalmente cerrado el consumidor. El corte v3 resulta íntegro y verificable en las dos copias locales examinadas. Ningún resultado acredita autenticidad histórica, custodia independiente, interpretación fiscal, promoción de bindings o finalización del encargo exhaustivo.
