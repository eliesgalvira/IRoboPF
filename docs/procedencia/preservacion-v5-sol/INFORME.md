# Preservación v5: edición candidata del corte R26

Referencia vigente: **r2/PIN-final.json**, SHA256 del manifiesto JSON `2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88`. Los pins anteriores son ensayos conservados.

Implementación personal en T3 Code, checkout `t3-fdfbf688`, runtime gpt-6.1-sol con esfuerzo high. Se ha solicitado prioridad; no se inventa prueba del scheduler ni identidad canónica de un agente. Sin subdelegación, atestación, aceptación propia ni mutación VCS. El encargo global continúa. El padre debe encargar una revisión nueva del paquete exacto.

Base literal: `6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9`, 15.456 entradas. No se suplanta BASE R21. La edición nueva tiene schema/formato v5, software y política fijados. `PIN-final.json` identifica el JSON descomprimido externo; el hash de `manifest-final.json.gz` es otra identidad. El pin está escrito antes de verificar/exportar y se copia fuera del paquete, sin aceptarlo por estar dentro de él.

## Selección y censo

Se censan todos los archivos JSON y JSON.gz versionados del árbol exacto, no solo los siete prefijos de v4. Cada archivo se procesa por separado; gzip se abre como flujo. No se concatena el corpus completo ni se cargan paquetes de originales en memoria. Se reconocen campos hash/SHA256 escalares y arrays tipados; cada observación conserva ruta relativa, puntero JSON, contexto saneado, clase y motivo. La clase se determina por estructura/campo, URL y ámbito; la resolución por identidad permite continuar la cadena hacia objeto, auxiliar o ausencia. `censo-resumen.json` distingue observaciones e identidades. Los recuentos de hashes nunca se presentan como cantidad de PDF.

Clases separadas: original oficial candidato por URL admitida, captura secundaria de URL oficial, facsímil/receta, metadatos de adquisición, atestación/caso técnico, fuente software, contenido público X, fixture sintético y desconocido, con una subclase documental desconocida. La clasificación por ruta/contexto es candidata: por ejemplo, un control bajo revisiones no se convierte en fuente jurídica ni una URL basta para autenticar un emisor. Los casos ambiguos conservan su motivo. La observación `resolvedInV4` del censo es deliberadamente histórica; el estado final corresponde a `resoluciones.jsonl.gz` y al manifiesto v5, no a ese booleano.

Compromisos explícitos: no se demuestra exhaustividad semántica para referencias expresadas solo por ID/URL, claves de objeto que sean hashes, prosa, SHA512 sin SHA256 o gramáticas no reconocidas. Se transportan raíces de evidencia y snapshots con sus fuentes/recetas, pero eso no equivale a probar todos los puentes por ejecución. El JSON adverso inválido no se repara: exclusión por ruta, tipo de fallo y huella. Los desconocidos y las ausencias se conservan; no se declaran pérdidas fiscales por contar referencias técnicas. La política de clasificación necesita contraste independiente.

## Transporte y procedencia

Se reutilizan los objetos documentales y el cierre de dependencias del paquete v4 externo fijado por `938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2`, solo lectura. No se reexporta ni sobrescribe ningún paquete v1–v4, ni se eliminan sus copias. El índice histórico saneado conserva la relación de procedencia; sus auxiliares se identifican bajo `herencia-v4/`. Las fuentes actuales del corte amplían ese cierre, incluidos índices comprimidos, recetas, registros, snapshots y herramientas. Los bytes localizados sin clasificación documental suficiente se conservan como auxiliares por identidad, sin inventar oficialidad.

Las cuatro ausencias PV24-01 se toman exclusivamente de los localizadores entregados en `correcciones/preservacion-v4-r26/faltantes-localizados.json`. Se cotejan SHA256, SHA512 y tamaño antes de copiar. Se recuperan adquisiciones desde los registros versionados originales, con sus URLs, fechas y HTTP reales; se deduplican proyecciones idénticas. No hay descargas ni fecha HTTP inferida del checkout. Los registros de adquisición se transportan saneados, con huellas distintas de origen y derivado. Las dos respuestas INE siguen siendo JSON, los documentos CARM y Cantabria PDF; ninguna cifra total se interpreta como cuatro nuevas normas validadas.

La política nueva usa `clean` R26 policy2 en metadatos derivados. Conserva selectores, citas, recetas, hashes de origen/transporte y versiones; omite claves y valores privados conocidos. Los originales documentales permanecen byte a byte intactos. Si no hay transformación necesaria se conservan los bytes originales del metadato. No se promete anonimización universal de prosa/código o hashes. Se revisa el sobre mediante verify y se excluye el payload de X del transporte nuevo; no se copia contexto, vault, credenciales, entornos ni node_modules. Fuentes de software y locks no son un cierre binario de Nix/Python para reinstalar sin almacén local.

El consumidor se deriva de la corrección v4 R26 recibida, sin editarla. Se fija la nueva base/schema y el software; conserva validación de unicidad, conjunto exacto, tipos/ancestros sin symlinks, hashes dobles/tamaño, identidades coherentes y diagnóstico saneado. La excepción histórica de adquisiciones repetidas no se hereda por declarar edición 5. El consumidor está pendiente de revisión independiente; pasar los controles no lo autoaprueba.

## Pruebas y recuperación

`antes.log` conserva el fallo del array tipado de documentos: cero referencias observadas frente a una esperada. Se corrigió el recorrido, sin cambiar el esperado. `regresiones.log` ejecuta cuatro controles del censo, nueve adversos v4, diez controles R26 y las cinco expectativas protectoras R24. Para estas últimas se cargan únicamente sus clases mediante AST en memoria, inyectando el consumidor y fixture v5; no se ejecutan sus inicializadores que escriben en cachés ajenas, ni se cambian métodos o aserciones. Se mantienen intactos los originales versionados y sus rojos históricos.

La exportación y restauración usan directorios nuevos, escritura por bloques de 1 MiB, publicación exclusiva y fsync según el contrato reutilizado. Los recibos distinguen durabilidad confirmada y marcador visible con durabilidad indeterminada. No se simulan corte eléctrico, disco defectuoso, rollback ni escritor hostil. Se comparan físicamente ambos destinos por hashes/tamaño e inodos, sin hardlinks entre copias. La capacidad y existencia se consultan al filesystem, no al índice Git.

`recuperacion.json` registra la prueba exclusiva desde restauración: los cuatro originales, selectores JSON INE existentes, pasajes de CARM/Cantabria y tres citas/PNG concretos (`mei2025`, `madrid-tabla-ley13-2023`, `colegio-art10-p16`) de cotización, escala autonómica y gastos del trabajo. Son tres dominios fiscales; sus hosts no se cuentan como tres dominios distintos. No se inventa PNG para el JSON INE. Se reproduce también la lectura del índice grande de retenciones y una dependencia histórica con su pin/fuente. Se ejecuta el instrumento y sus herramientas desde una raíz nueva materializada exclusivamente del paquete, con el entorno Python fijado; sin cachefallback de originales. Las operaciones y resultados efectivos deben leerse en el recibo, incluidos los intentos que fallen.

Ruff y mypy comprueban fuentes propias. Mypy usa `--check-untyped-defs --follow-imports=skip --ignore-missing-imports`: tipado parcial de fronteras JSON dinámicas, no demostración estricta integral. Oxlint usa un hilo y `--disable-nested-config`; las 16 reglas anti-slop permanecen a error. Su humo sobre `lib/formato.ts` intacto comprueba carga de plugins, no lint de Python. No hay Effect/TS nuevo, Next build ni suites legacy masivas. Todas las pruebas, tipos, recorridos grandes y transportes usan el lock pesado compartido; recepción física inicial usa el lock acotado autorizado.

## Límites y estado conservado

Integridad, autenticidad, número, interpretación y revisión son ejes distintos. No se validan firmas PAdES/CSV ni vigencias por transportar bytes. Permanecen las ausencias no resueltas y las limitaciones de gramática anteriores; una referencia disponible como metadato no asegura que su original documental pueda restaurarse. No se descargan datos para rellenar vacíos.

R25 recién terminado no está recibido en este corte: no se inspecciona ni se incluye. El corte excluye también esta entrega y lo posterior como evidencia fiscal; sus herramientas/contrato se incluyen para reproducibilidad. Composición/publicación y promociones siguen bloqueadas por los defectos de rentas, multiplicidad del registro conjunto y admisión de Madrid v2. No se reinterpretan como autorización para un arreglo propio.

Se conservan inventario `30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7`, artefacto `59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7`, sus 52.461 ocurrencias y 65 sitios, los 36 snapshots R23, V1 `a0c7d768c664677bffb583a84f3afb11deda0cf92924480e8b0afd97cde8b34f` y V2 `57377f076ca1050c368c7b57934d1f8edce13104a27258409ebf7f1a8f58d146`, cierre de 719 objetos, Madrid `e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258` pendiente y los 264 payloads sin promoción. No se modifica confianza activa, código fiscal, informes ajenos, ESTADO o DECISIONES generales.

Crossa mantiene v1 `2df6c208…` desfasado, misma casa y dueño, copia local fuera de Victus sin independencia/remotidad. No se escribe allí. No hay transferencia externa del corpus, LFS, gasto autorizado, push, PR, deploy, servidor, preview, UI/rediseño, limpieza ni borrado de originales.

Incidencia: una consulta general de procesos mostró incidentalmente líneas de comando de compañeros activos. No se consultaron sus archivos ni se usó esa información; no se repitió la consulta. Los logs de herramientas con ese material no se copian al paquete ni a esta entrega.

El cotejo inicial físico comprueba las 15.456 entradas mediante lstat/readlink y un blob por vez. El final repite el control con protocolo cat-file batch, leyendo y comparando solo un blob en cada momento; además registra diff de base. MANIFIESTO fija rutas relativas, tamaños, SHA256 y baseSha256 nulo para archivos nuevos; excluye su propia huella por circularidad. El patch textual gzip excluye manifiesto, catálogo binario y el propio patch; binarios por ruta/hash. Los paquetes, restauración y censo grande quedan fuera de Git y deben preservarse fuera de T3 por el padre antes de cualquier limpieza.

## Identidad y tamaño del corte candidato

Pin externo final del JSON: `7883e53fd88d11b8fef626669ce63d0676ea217799551e72195a510710378a41`; SHA512 `ce2081bf68874824f12bee534ed3e4cb276f10c2a04a075ebe9e9b04ae712dc3ce2f5833c3bb2afac395aede4d75488a0fe06a155b96dc5879bf0147b13b321e`; 26.179.629 bytes. El primer pin `abf914b4…` es un ensayo de colección anterior conservado, nunca designa la exportación final.

El censo abre 4.907 archivos JSON/JSON.gz versionados. Registra 32.465 identidades observadas y mantiene 14.197 no resueltas en el cierre: no son 14.197 PDF perdidos. El manifiesto contiene 1.447 objetos documentales/facsímiles heredados o entregados y 19.471 referencias auxiliares, con deduplicación por identidad de contenido. Estas cifras no miden normas, PDFs, reglas aceptadas ni adquisiciones independientes. El mapa de 165 fragmentos externos, 53.114.255 bytes comprimidos, está en `CENSO-EXTERNO.json`; el mayor fragmento ocupa 3.015.958 bytes. Las observaciones por clase están en `censo-resumen.json`, no se suman como documentos distintos.

No pueden recuperarse los bytes de un original ausente de todas las fuentes expresamente entregadas, ni revertirse por hash los campos omitidos en metadatos saneados. El manifiesto registra las identidades de esos orígenes, no inventa sus bytes. Se conserva la receta mecánica y el derivado disponible; los originales oficiales incorporados permanecen intactos. Las referencias desconocidas, variantes históricas de software o controles sintéticos no resueltos deben examinarse por su contexto antes de calificarlas como pérdida de evidencia. Las formas de referencia no reconocidas limitan toda promesa de cierre.

Rutas absolutas que el padre debe preservar sin borrarlas:

- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/paquete-v5`
- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/restauracion-v5`
- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/manifest-final.json`
- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/PIN-final.json`
- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/censo-preservado`
- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/software-restaurado`

Los ensayos `recepcion-v5`, `recepcion-v5-final`, `referencias-ensayo.jsonl.gz` y `referencias-final.jsonl.gz` también quedan conservados en caché propia; no se eliminan ni se confunden con exportaciones anteriores. El movimiento de los fragmentos propios al catálogo externo se realizó como operación acotada por fragmento, pero sin adquirir el bloqueo compartido. Se declara esta incidencia; las comprobaciones posteriores del catálogo y todos los transportes/restauraciones utilizan el bloqueo pesado.

Límite adicional del recolector, que impide llamarlo exportador determinista general: el censo usa cabeceras gzip con fecha de ejecución y el cierre de herramientas enumera los JSON presentes en su carpeta, incluidos ensayos previos. El pin fija los bytes efectivos de esta ejecución, pero repetir sobre otra carpeta con resultados adicionales puede cambiar el sobre. No se acredita identidad byte a byte de una nueva colección por pasar verify/restauración. Una revisión debe exigir entrada propia explícita y gzip determinista antes de aceptar esa garantía; no se oculta como una diferencia fiscal ni se autoacepta esta limitación. La restauración del paquete exacto es una garantía distinta.

## Revisión local r2: nueva referencia de entrega

**La entrega final designa exclusivamente `r2/PIN-final.json` y `r2/manifest-final.json.gz`. El primer paquete v5 y su pin `7883e53f…` quedan como ensayo conservado con cierre de software incompleto.** No se sobrescriben sus marcadores, exportación, restauración ni log rojo.

El primer intento de materialización se detuvo antes de ejecutar las pruebas: el selector INE figuraba entre las fuentes fijadas, pero había llegado después de la enumeración de dependencias. `cierre-software-antes.log` reproduce la falta con una aserción independiente. Ningún hash del manifiesto se altera para ocultarla.

`recolector2.py` corrige el cierre mediante una entrada anterior exacta fijada por pin y una lista explícita de cinco herramientas. Conserva objetos, censo, clasificaciones, ausencias y derivaciones anteriores sin cambios. Completa la dependencia faltante y añade el lector de recuperación revisado, materializador y control de cierre. No recensa R25 ni añade fuentes documentales. El nuevo contrato auxiliar `contrato-v5-r2.json` fija la operación, la fuente y los nombres exactos. Ordena dependencias por ruta, no enumera resultados propios y escribe gzip con mtime cero y nombre vacío: la revisión mecánica es reproducible desde ese input fijado y esas fuentes exactas. No se afirma haber vuelto determinista la primera colección completa; aquella limitación sigue siendo un hallazgo conservado.

Por inspección del contrato de citas históricas, Cantabria usa `box` y CARM `bbox`. `recuperar2.py` adapta ambos nombres sin cambiar originales ni citas esperadas, y elige el pasaje más largo disponible del documento, evitando usar el primer pie `i30` como demostración sustantiva. Las tres citas/PNG y los selectores existentes INE mantienen sus esperados. El código original del primer pin permanece intacto.

Las herramientas de r2 se materializan exclusivamente desde su restauración y se cotejan con todas las identidades `software` antes de ejecutarlas. Las comprobaciones usan el Python/uv/Nix fijado y leen originales únicamente de la nueva restauración. Los resultados efectivos están en `recuperacion-r2.log`, `r2/recuperacion.json` y `r2/selectores-ine.json`; si falta alguno, no debe inferirse un pase. Las conclusiones siguen siendo candidatas y necesitan revisión nueva.

Rutas definitivas r2 para preservar fuera de T3:

- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/r2/paquete-v5`
- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/r2/restauracion-v5`
- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/r2/manifest-final.json`
- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/r2/PIN-final.json`
- `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol/r2/software-restaurado`

El catálogo externo del censo sigue siendo el mismo: r2 transporta exactamente esas dependencias, con las mismas identidades. `entrega2.py` incluye recursivamente las rutas r2 en el manifiesto de entrega y patch. No se sustituye el primer paquete por una copia retocada.

Identidad r2: JSON 26.184.815 bytes, SHA256 `2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88`, SHA512 `8a8a26877dad98ed16518907258a9a1a79eda74478f58ae21db9e053826e29858365f5fc8dc279492baf28aba771b2e18aa5ea8f2362cbd878b404fda012bf9c`. La lista `recipe.tools` contiene cinco nombres y es la selección efectiva; la prosa `recipe.operation` conserva una errata «cuatro». No se cambia el pin por esa errata ni se usa su cifra como aceptación de cobertura.

## Resultado efectivo r2

Exportación y restauración r2: `fsync-confirmed`, mismo pin externo; 1.447 objetos y 19.477 referencias auxiliares, 27 proyecciones distintas de adquisición. El control independiente de cierre comprueba las 21 fuentes fijadas, sin ausencia ni transformación de bytes de software. La comparación de CAS de ambas copias comprueba 18.145 archivos únicos y 2.143.408.709 bytes por copia, excluyendo el marcador; ambos hashes/tamaño iguales, inodos distintos y nlink 1. Con el marcador: 18.146 archivos y 2.169.593.524 bytes por copia.

PyMuPDF 1.26.7 recupera exactamente los pasajes CARM (4.939 caracteres) y Cantabria (118 caracteres), comparados con citas existentes, sin convertir la longitud en prueba fiscal. Recupera los cuatro originales por ambos hashes y tamaño. Los selectores INE `IPC251852-Data-11` y el selector existente de IPC290751 coinciden con su valor original; el primero identifica `/Data/11`, diciembre de 2012, valor 94.394. No hay PNG inventado para esos JSON.

Los tres textos y PNG son idénticos a sus recetas históricas: MEI2025 `1c5559d7…`, Madrid `75401a40…` y colegio `39c62e2d…`. Las huellas completas y textos están en `r2/recuperacion.json`. No hay cachefallback. El helper y runner ejecutados proceden de la raíz de software restaurada; locks y versión Python se fijan por las fuentes transportadas. El entorno ya disponible se reutiliza: no se afirma reinstalación desde una máquina vacía.

`suplemento.py` es una receta adicional de comprobación entregada por fuente y fijada en MANIFIESTO, no un nuevo dato fiscal o dependencia documental externa. Importa el consumidor exclusivamente de software-restaurado y solo lee datos del paquete r2. `suplemento.log` y `r2/suplemento.json` confirman regeneración canónica byte a byte del índice grande derivado de retenciones (22.164.883 bytes; origen y transporte separados) y reproducción del HTML histórico `82a57fd7…`, selector `id="a84"`, con fuente, ambos hashes y receta histórica correctos. Se distingue normalización HTML de una cita PDF literal. No se restaura por magia el metadato bruto saneado: las omisiones de privacidad continúan declaradas.

Las 28 regresiones pasan con esperados intactos. Los controles de cierre pasan en r2 después del rojo conservado del primer pin. Oxlint termina con código 0 y salida vacía en el humo de carga de las 16 reglas; Ruff y mypy finales se registran aparte para todas las fuentes propias, sin confundir sus alcances. La comprobación física completa posterior a r2 está en `fisico-cierre.json.gz` y `fisico-cierre.log`, con diff de base y las 15.456 entradas. No se promueve ningún estado por estos resultados.

Límite de reproducción de la revisión r2: para reconstruir el sobre r2 mediante su recolector hay que conservar también el manifiesto anterior exacto `7883e53f…` y su entrada fijada, ya preservados en las rutas v5 anteriores. El paquete r2 permite recuperar las muestras y metadatos descritos por sí mismo, pero no se anuncia un regenerador de toda la primera colección desde cero sin esos insumos, ni un cierre binario Nix. El corte R26, las referencias no resueltas, la selección candidata y la revisión independiente pendiente permanecen explícitos.

Cierre de calidad efectivo: `calidad-ultima.log` termina con Ruff sin errores y mypy sin diagnósticos en 15 fuentes propias, con el alcance parcial ya declarado. `fisico-cierre.log` confirma 15.456 entradas y cero diferencias físicas; el diff de base permanece vacío. Git status muestra únicamente las carpetas nuevas de documentación y caché propia. La caché está sin versionar y queda expresamente fuera del manifiesto/patch de código: conservar sus datos mediante las rutas absolutas indicadas, sin integrar uv, entornos o paquetes binarios en Git.

Los casos máquina están en `hallazgos.json`, cada uno con evidencia y límite. MANIFIESTO/patch se generan después de estos resultados; su alcance es exclusivamente `docs/procedencia/preservacion-v5-sol/`, incluidas sus rutas r2. No hay cierre global, aceptación jurídica/fiscal, revisión independiente favorable ni custodia remota acreditada.
