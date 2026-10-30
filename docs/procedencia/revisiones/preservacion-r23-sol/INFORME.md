# Revisión independiente de preservación R23

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Dictamen acotado: PR21-SOL-01, PR21-SOL-02 y PR21-SOL-03 quedan corregidos en el consumidor actual para los defectos reproducidos. La política de multiplicidad de exclusiones de D070 resulta compatible con el manifiesto histórico íntegro. Las conclusiones de esta revisión son nuevas y requieren contraste posterior; no constituyen aceptación de una regla fiscal completa, promoción de candidatos ni cierre del encargo global.

## Recepción y fuentes

Base y HEAD exigidos: `07c07e6376a72f229be735a904ecf36517a1b571`, 14.957 entradas. El cotejo inicial compara cada blob con lstat, readlink o bytes físicos y tipo/modo ejecutable. `arbol-inicio.json.gz` contiene el detalle por ruta; `arbol-inicio.log` registra cero diferencias. No se confía en el índice. El cierre repite el recorrido completo con el mismo programa y base; sus resultados se conservan en `arbol-cierre.*` y los diffs por separado.

Se examinaron D070, informes R21 Sol, técnica R23 y recepción R21–R23; recolector.py v3, preservacion.py, preservacion_urls.py, ambos schemas, lista TGSS, fixtures históricos y los dos instrumentos preservacion-*.py de R23. `fuentes.json` fija las entradas versionadas; el cotejo físico general incluye los informes históricos.

La versión anterior utilizada es el commit `960773f909d4ecff290edfa3d7a7b2699a8445d3`, base de la revisión R21. Se recuperan solamente sus blobs de recolector y schemas en scratch propio; preservacion.py y preservacion_urls.py no tienen cambios entre ambos cortes. Cada proceso compara una pareja de código/schema coherente. La versión antigua no se ejecuta con el schema nuevo para fingir una corrección.

## PR21-SOL-01: fin absoluto de rutas

La expectativa histórica de rechazar la transferencia desde un archivo real llamado `payload\n` falla contra el consumidor anterior y pasa contra el actual. Se conserva el test original sin cambiar esperados. El rechazo actual ocurre durante load, antes de crear destino. No se confunde ese nombre legal en Linux con una ruta portable.

Los 14 patrones del schema anterior permiten una coincidencia antes del salto final; sus 14 sustitutos actuales la rechazan. `fronteras.json` conserva ubicación del patrón y resultado para ambas versiones. La matriz adicional somete sources y references a LF, CRLF, CR, NUL, separador de línea y separador de párrafo Unicode. El consumidor actual rechaza todos estos sufijos; se mantienen controles positivos mediante rutas normales, los prefijos checkout:/parent: y la transferencia pequeña completa. El fin absoluto `(?![\s\S])` se comprueba efectivamente en el motor regex usado por jsonschema, sin traducirlo a otro dialecto.

Objeción del mejor experto: cerrar el último anclaje no acredita seguridad universal de las rutas ni portabilidad entre todos los sistemas de archivos. Respuesta: el dictamen cierra el bypass concreto y contrasta las rutas de escape, ancestros enlazados y transferencia del alcance; no promete ausencia de carreras hostiles del filesystem. Coste: la gramática sigue conservadora y rechaza nombres que Linux admitiría. Una ampliación necesitaría contrato y pruebas nuevos, sin reescribir los marcadores conservados.

## PR21-SOL-02: conjuntos y observaciones

El consumidor actual rechaza duplicados en sources, references y acquisitions del anexo. La serialización canónica usada por require_unique ordena las claves del objeto: invertir el orden de claves de una adquisición no oculta el duplicado. Un duplicado de source con una representación JSON escapada equivalente también se rechaza después del parseo. Dos adquisiciones con fechas distintas continúan siendo admisibles en ambos órdenes; no se exige un orden único de lista ni se borran eventos distintos.

unresolvedReferences exige hash único incluso si las sources aparecen invertidas o son diferentes. Además exige sources únicas dentro de cada registro. El control anterior admite esas mutaciones; el actual las rechaza. Las dependencias mantienen unicidad por path y la unión de objetos por sha256, sin contar repeticiones de metadatos como objetos CAS nuevos. No se supone equivalencia semántica entre timestamps diferentes, alias de URL o rutas distintas: esta revisión no define una identidad documental nueva.

Las exclusiones son la excepción expresa. La carga del manifiesto real conserva exactamente 4.147 observaciones, 1.089 registros distintos y 3.058 repeticiones. Su hash permanece `147e90bf15aa6a82e71b304bd6bd8983983007c2b07ed6e306f1ca244f3ae8be`. El control sintético acepta dos exclusiones idénticas y mantiene ambas, con una única exclusión distinta. Se contrasta contra el histórico íntegro, sin deduplicarlo o reconstruirlo para hacerlo pasar.

Objeción del mejor experto: exigir unicidad en toda lista parece más fácil de auditar y evita inflación de métricas. Respuesta: D070 distingue eventos observados de evidencia; invalidar la multiplicidad histórica no añade autenticidad, integridad ni fuentes. La identidad canónica de una exclusión permite obtener el número distinto sin borrar su historia. Coste: cualquier consumidor estadístico debe distinguir observaciones y registros distintos. Ni 4.147 ni 1.089 son fuentes nuevas, documentos auténticos o reglas revisadas. Se corrobora esta política en el corte examinado, sin aceptar métricas futuras que omitan esa distinción.

## PR21-SOL-03: URL malformada y diagnóstico sensible

El anterior propaga el texto del puerto sintético PRIVATE_SENTINEL y también permite que un hostname malformado produzca una excepción del parser. El actual devuelve rechazo antes de clasificar. Se prueban canonicalUrl y finalUrl por separado, puerto no numérico, puerto fuera de rango y corchete IPv6 sin cierre. Los diagnósticos actuales son constantes y no contienen el valor recibido. `complementos.json` reproduce además la expectativa histórica de privacidad sin cambiarla; no hay secretos o datos personales reales en los fixtures.

La prevalidación anterior al cálculo de secondary evita una segunda llamada insegura a urlsplit sobre el valor malformado. Se conservan los positivos de clasificación: una adquisición de archivo con canonical oficial continúa siendo secundaria; ambos extremos oficiales permiten primaria candidata. Los 35 endpoints TGSS exactos siguen admitidos y los sufijos no examinados se rechazan. Una URL permitida no autentica los bytes ni garantiza anonimato universal.

Objeción del mejor experto: ocultar un diagnóstico puede dificultar averiguar qué dato produjo el fallo, y estos tests no cubren todo Unicode ni todos los parsers. Respuesta: se mantiene la posición de schema o la categoría constante de rechazo y se conserva el fixture sintético para reproducir. Solo se afirma saneamiento de los caminos observados, sin convertir un parser de URL en verificador de autenticidad. Coste: diagnóstico menos detallado y mantenimiento explícito de la lista documental.

## Schema y consumidor: concordancia y límite

Los instrumentos R23 recibidos se ejecutan con sus mismas expectativas y fixtures/salidas redirigidos a esta revisión. Pasan los tres métodos históricos de rojos y privacidad, así como los 13 métodos de política/contrato heredado; estos últimos contienen los diez métodos repetidos en otro pase. Los recuentos se solapan y no deben sumarse como aceptaciones distintas.

El schema cierra propiedades y tipos estructurales, exige campos y usa patrones con fin absoluto. El consumidor agrega relaciones entre objetos, clase y URLs, dependencias, valores enteros Python estrictos y unicidad. La matriz registra por separado `schemaAccepts` y `rejected`. El schema por sí solo admite duplicados y strings URL malformados que load rechaza. No tiene uniqueItems ni format de URI en esas URLs. Por tanto, **validar únicamente el schema no equivale a ejecutar el contrato de load**. No hay incompatibilidad que bloquee el histórico real; sí una frontera de responsabilidad que debe conservar cualquier futuro consumidor. Se mantiene como límite explícito, sin inventar que el schema declara esas restricciones semánticas.

Objeción del mejor experto: dos validadores con poderes diferentes pueden divergir si alguien reutiliza el schema como contrato completo. Respuesta: el camino operativo examinado ejecuta schema y luego las restricciones semánticas antes de publicar; los casos máquina muestran la diferencia para reproducirla. Coste: el schema no basta como puerta independiente y otro lenguaje deberá portar también esas restricciones, o documentar un contrato distinto. No se modifica schema, implementación o esperados para ocultarlo.

No se formula otro defecto reproducible de producto a partir de esta matriz. Esto expresa el resultado del alcance examinado, no ausencia universal de defectos. Los fallos observados en la versión anterior permanecen en `anterior.log`; que el comando de reproducción termine 0 indica que registró sus resultados, no que los tests protectores antiguos pasaran.

## Recuperación, integridad y durabilidad

Se cargó el sobre v3 real y se comprobaron ambas copias locales entregadas: paquete-v3 y restauracion-v3 del padre, solo lectura. Cada una mantiene 945 objetos únicos y 1.068.593.978 bytes; se releen además las 1.910 referencias explícitas de dependencia. El cotejo independiente usa SHA256, SHA512, tamaño, archivo regular y ausencia de ancestros symlink, un objeto cada vez, seguido de verify real. Los archivos bytes-*.json conservan resultados por objeto y dependencia; las referencias repetidas no son objetos nuevos.

El transporte permanece `b4e91adcdd69dbe62f221d97bc8910ad1243719b8bdcb63df095ce5679c8db9e`. No se invocó collect, no se reexportó el histórico y no se regeneró ningún manifiesto. Los marcadores de ambas copias coinciden exactamente con los externos fijados.

Se repite la matriz pequeña de fallos de fsync en cada una de las 24 llamadas observadas, con un objeto y una dependencia. Los nueve fallos desde la visibilidad del marcador final conservan manifest.json, señalan PublicationDurabilityUnknown y se recuperan al retirar la inyección mediante confirm, sin pisar el destino. Los fallos previos no se presentan como paquete completo: que STAGING, una dependencia o transporte sean visibles no implica que exista manifest.json. También se repiten corrupción, ausencia, destino existente y ancestro symlink en los métodos heredados.

Objeción del mejor archivero: dos copias que verifican hoy no prueban restaurabilidad después de un apagado, y una prueba sintética no reemplaza una restauración integral. Respuesta: ya existe restauración independiente íntegra; el cambio R23 afecta a validación. Se repiten carga y bytes reales y los discriminantes de recuperación que podrían variar. Coste: no hay otra restauración completa nueva ni ensayo de pérdida eléctrica/hardware. fsync-confirmed describe el resultado de llamadas al filesystem, no inmunidad ante fallo físico, custodia independiente o durabilidad remota.

## Objetos anteriores y límites del encargo

El cotejo físico base compara todos los objetos versionados anteriores, no solo nombres del índice. El pase de históricos verifica los 36 snapshots actuales sin regenerarlos. Se conservan V1 `a0c7d768c664677bffb583a84f3afb11deda0cf92924480e8b0afd97cde8b34f` y V2 `57377f076ca1050c368c7b57934d1f8edce13104a27258409ebf7f1a8f58d146`, cierre declarado de 719 objetos. Ese cierre de contenido no se suma a los 945 objetos de preservación como fuentes independientes. El inventario permanece `30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7`, artefacto `59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7`, 52.461 ocurrencias y 65 sitios. Ninguna cifra acredita aceptación fiscal.

Madrid `e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258` y los 264 payloads R19 siguen pendientes y sin promoción. Integridad, autenticidad, número, interpretación y revisión son ejes separados. Este trabajo no valida firma, CSV, sellado de tiempo, vigencia o interpretación jurídica. No se adquieren fuentes nuevas ni se requiere CAS documental nuevo.

Crossa conserva v1 `2df6c208…`, desfasado según el contexto recibido, misma casa y propietario; es copia local fuera de Victus, sin custodia independiente o remota. No se accedió a Crossa. V3 es histórico y no incluye automáticamente incorporaciones posteriores. V4 queda fuera de lectura y dictamen.

## Entrega y controles

`COMANDOS.md`, scripts y logs describen las ejecuciones y sus límites. Se usa Nix, Python mediante tools/procedencia/run.sh, bytecode deshabilitado y entorno uv absoluto bajo .cache/preservacion-r23-sol. Un trabajador con flock pesado; el cotejo de recepción usa únicamente el lock acotado permitido. No se instala globalmente. Las dependencias del padre se usan solo en lectura. No hay Next build ni suites legacy masivas.

No hay fixes, mutación VCS, commit, bookmark, push, PR, cambios a main, transferencia externa, LFS, deploy, servidor, preview, rediseño, mensajes o publicación en X. No se editan ESTADO, DECISIONES, registros de confianza, entregas anteriores ni originales. Solo se escribe esta carpeta y el scratch propio del checkout. Nix/uv pueden resolver herramientas; no se transmite el corpus.

El manifiesto de entrega usa rutas relativas, SHA256, SHA512, tamaño y baseSha256 null para las altas. Excluye de sí mismo manifiesto, patch e índice binario para evitar autorreferencia; binarios.json fija los gzip por ruta y hash. El patch textual gzip se construye contra la base sin tocar el índice. Los controles de más de 1 MB se comprimen; no se incluyen PDFs, entornos, node_modules ni copias de la aplicación bajo docs.

Objeción del mejor integrador: las altas sin commit no aparecen en el diff ordinario. Respuesta: manifiesto por ruta, patch de altas y binarios separados, junto con dos cotejos físicos íntegros. Coste: integrar selectivamente y volver a comprobar hashes, sin deducir integridad de un índice o un diff vacío. La entrega no declara terminado el encargo global.

El primer Ruff registra 15 diagnósticos de los instrumentos propios: imports y sentencias compactas. Se conservan en ruff.log. Se corrigen únicamente estilo/imports de esta revisión; el pase final queda separado. No son defectos del producto ni se cambian las expectativas protectoras históricas.

Los primeros pases mypy conservan cuatro/cinco diagnósticos de instrumentos propios: asignación dinámica de módulos, listas sin anotación y un registro heterogéneo inferido como Sequence. Se añaden anotaciones y TypedDict, sin ignores ni relajación de flags. El primer pase de snapshots falla concretamente en `ts.ScriptTarget.Latest` indefinido al resolver TypeScript sin node_modules local; la mención inicial a Effect en la actualización del hilo fue demasiado específica. La repetición usa NODE_PATH al node_modules del padre, solo lectura y sin auto instalación de Bun. No se modifica el verificador histórico para hacerlo pasar.

NODE_PATH y el hook de resolución no bastan en Bun con este checkout. El pase de snapshots definitivo usa un tsconfig propio con rutas absolutas a Effect, TypeScript y Decimal instalados en el padre, sin escribir allí ni auto instalar. Se conservan los fallos de resolución anteriores. Objeción experta: cambiar la resolución podría ejecutar versiones distintas y alterar el resultado. Respuesta: el mapa es explícito, apunta al node_modules ya entregado y no reemplaza el verificador ni los bytes examinados; el fichero de configuración queda en el manifiesto. Coste: la receta depende de ese entorno local y debe adaptarse con pins equivalentes al trasladarla. No acredita ejecución hermética en otra máquina.

## Resultado efectivo del cierre

El último pase de Ruff del alcance termina 0; mypy termina 0, diez fuentes sin diagnósticos con las opciones declaradas; oxlint final termina 0 con las 16 reglas a error. Las 19 regresiones Python pasan. Fronteras vuelve a terminar 0 después de anotar y dar formato a los instrumentos. El verificador original completa los 36 snapshots conservados y escribe historicos.json; no se regenera contenido ni se cambian esperados. No se suman métodos heredados, matrices y snapshots como reglas aceptadas.

Bun emite en el pase exitoso un diagnóstico interno de `directory mismatch` relacionado con el fichero de tsconfig. El proceso termina 0 y el recibo solo se escribe después de verificar cada snapshot; el aviso se conserva íntegro en historicos-final.log. Esto limita la limpieza del log de entorno, sin convertirlo en fallo demostrado de la aplicación ni ocultarlo con filtros. La comprobación física completa se repite una última vez antes del empaquetado. Los diffs de base y borrados quedan vacíos; únicamente se añaden artefactos dentro de la carpeta asignada.
