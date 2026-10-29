# Decisiones de la auditoría documental

Cada decisión registra la razón, la objeción experta considerada y el coste aceptado. Las decisiones todavía no resueltas no se presentan como implementación completada.

## D001. Separar evidencia, verificación y aceptación fiscal

Un dato inventariado nace pendiente. El primer auditor propone `match`, `mismatch`, `missing` o `ambiguous`; la aceptación exige otro auditor independiente. Un verificador técnico de bytes y coordenadas no sustituye al juicio sobre vigencia, sujeto, territorio o régimen transitorio.

Objeción experta: dos agentes pueden repetir el mismo error si solo leen la conclusión del primero. La contrarrevisión debe releer originales y comprobar hipótesis, unidades, fechas y contraejemplos. Coste aceptado: duplicar investigación y conservar hallazgos sin aceptar mientras falte esa revisión.

## D002. Conservar la referencia legacy sin elevarla a norma

Python y Excel se utilizan como referencia de comportamiento. Ante diferencias se registrarán los dos resultados y la norma aplicable. Ningún cambio de fixture podrá ocultar una discrepancia legal. Coste aceptado: algunas diferencias canónico/legacy serán deliberadas y requerirán documentación y pruebas separadas.

## D003. Inventario exhaustivo antes de declarar cobertura

El inventario debe incluir tanto literales como valores derivados, tablas heredadas por año, fórmulas, condiciones y redondeos. La identidad fiscal no será un número de línea: se conservará además una localización de código para revisión. Coste aceptado: distinguir descubrimiento sintáctico de catalogación semántica, con lagunas explícitas hasta completar esta última.

## Pendientes

- Almacenamiento de blobs, firma PAdES, CSV, WARC y sellos de tiempo.
- Arquitectura de entrega estática frente a actores; contratos de rutas y rastros.
- Alcance acreditable de nuevas deducciones y actividades económicas.

## D006. No inicializar JJ en checkouts Git gestionados por T3

La instrucción inicial del orquestador de permitir `jj git init --colocate` en esos checkouts fue incorrecta para este entorno: apareció un índice vacío con todos los archivos marcados como borrados. Elies la revocó. Los hijos entregarán archivos y pruebas sin mutar VCS; el orquestador los comparará con la base y los incorporará con Jujutsu en el repositorio principal. Toda futura delegación incluirá la prohibición explícita.

Objeción experta: ni un índice ni un commit aislado bastan para acreditar una entrega si se ha mezclado el control del checkout. Se comprobarán árbol base, árbol entregado, índice y presencia real de archivos; no se aceptarán borrados no autorizados. Coste: integración selectiva y comprobación adicional por entrega, sin perder el trabajo en disco ni restaurarlo destructivamente.

## D007. Investigar actividades económicas antes de comprometer su implementación

La primera revisión de capacidades propone una vertical de estimación directa simplificada de 2025, distinta del salario. Se encarga investigación oficial de reglas, entradas, derivaciones y exclusiones de ese ámbito; la decisión de implementarlo dependerá de evidencia, revisión independiente y pruebas. No se presenta como cobertura actual ni se extienden sus parámetros a otros ejercicios.

Objeción experta: presentar facturación como salario, reducir RETA a una cotización empresarial o ignorar amortizaciones y regímenes produciría una falsa cobertura de autónomos. Se rechazan esos atajos. Coste aceptado: investigación adicional y alcance inicial estrecho, manteniendo visibles los regímenes y años no implementados. Los requisitos de producto detectados no se convierten automáticamente en reglas fiscales aceptadas.

## D008. Preservar defensas runtime durante la corrección de lint

Aunque los productores tipados actuales no generan las entradas malformadas del ensayo del revisor, sustituir tres comprobaciones de tipo por presencia retiraba un rechazo previo y permitía un defecto Decimal ante null. Se conservan los rechazos con los predicados equivalentes de Effect, después de reproducir el fallo en una prueba. Coste: una prueba adicional de frontera y una expectativa explícita de error TypeScript por entradas JavaScript deliberadamente inválidas; no se relaja anti-slop ni se cambian cuantías.

## D009. Publicar cabeceras de procedencia sin cookies de sesión

Las cabeceras ETag, Last-Modified, Content-Type, tamaño, estado y fecha permiten describir la adquisición. Cookies y cabeceras de autorización no aportan evidencia fiscal y no deben formar parte del manifiesto público. Se omiten esos campos al publicar, sin modificar los bytes originales del documento ni sus hashes. Coste: el manifiesto publicado no es una captura HTTP íntegra ni un WARC; esa limitación se declara expresamente.

## D010. Separar artefactos temporales de las fuentes comprobadas

La primera ejecución de lint en el padre encontró un script experimental de otro auditor dentro de `.cache/procedencia/`, directorio ignorado por VCS. Se excluye `.cache/` de ESLint, oxlint y del proyecto TypeScript, como almacenamiento temporal; las fuentes mantenidas en app, components, lib, scripts, tools y tests conservan sus comprobaciones. Coste: un script temporal no recibe garantía de lint global. Si se promueve al repositorio deberá salir de la caché, pasar los controles de su lenguaje y ser revisado antes de usarse en CI.

## D011. Cerrar la aceptación del corpus hasta enlazar inventario y revisiones

La revisión adversarial demuestra que una cita puede repetir un valor y declarar dos revisores inexistentes sin consultar el motor. Se rechaza esa puerta de aceptación. El verificador deberá cargar un snapshot de inventario seleccionado por el integrador, comprobar su correspondencia con el código actual y resolver registros independientes que se refieran a ese mismo elemento y evidencia. Integridad, binding numérico, interpretación y contrarrevisión tendrán resultados separados.

Objeción experta: una igualdad entre dos campos suministrados por la misma cita no verifica el valor ejecutable ni la independencia de la revisión. Motivo: impedir una certificación circular y conservar el trabajo útil de adquisición y facsímiles. Coste aceptado: mayor integración y pruebas adversariales; mientras falte ese puente, la salida solo acredita las comprobaciones técnicas que realmente ejecuta, sin aceptación fiscal global. Los ocho hallazgos y reproducciones se conservan en `revisiones/corpus/`.

## D012. Corregir el límite madrileño con la norma, conservando la discrepancia del manual

La segunda lectura independiente identifica 53.407,20 euros en la Ley 6/2018 y acredita su continuidad en 2020; el manual AEAT 2020 publica 53.407,29. Se corrige el límite y su referencia después de una prueba realmente fallida. Se conservan ambos originales y el razonamiento de vigencia. No se reescriben el manual ni el oracle para hacerlos coincidir.

Objeción experta: un cambio de límite no resuelve la diferencia entre integrar tipos y usar cuotas acumuladas publicadas. Motivo: la prueba elegida discrimina este error con la política monetaria actual sin exigir una decisión global aún pendiente. Coste aceptado: aceptación limitada al límite y al caso, con el resto de la política de cuotas abierto; ninguna certificación de una declaración completa. La explicación de ejercicio se corrige separadamente como defecto documental acreditado.

## D013. Inventario técnico versionado y reconstrucción obligatoria

Se corrigen los cuatro bloqueos técnicos de la revisión del inventario. Los IDs pasan a ser ocurrencias versionadas por fuente y valor efectivo, con rutas de segmentos no ambiguas. No sustituyen al futuro registro de conceptos fiscales estables: esa vinculación requiere snapshot y migración explícita. El verificador reconstruye todos los archivos desde el checkout actual y compara conjuntos y bytes; no acepta un artefacto porque concuerde con sus propios hashes.

Objeción experta: un extractor puede repetir su propia omisión al reconstruir. Se conserva esa limitación y se exige además revisión independiente y pruebas con expectativas externas. Coste aceptado: una comprobación más cara, cambios de IDs al editar fuentes y trabajo semántico pendiente. El recorrido rechaza tipos y ciclos no soportados con ruta, en lugar de omitirlos silenciosamente; esto puede detener la generación cuando se amplíe el modelo de datos.

El índice guarda solo ID y página, y el contenido completo se respalda como un artefacto gzip de unos 8,21 MB con manifiesto legible. Objeción archivística: un binario comprimido dificulta diffs y crece con cada revisión. Motivo: conservar todo el inventario ahora, reproducible sin infraestructura nueva y por debajo del límite de archivos de GitHub. Coste aceptado: lector/descompresión y crecimiento de historial; no se presenta como almacén definitivo del corpus. El archivo se verifica y la CI vuelve a generar su contenido; una diferencia de entorno se trata como fallo que investigar, no como tolerancia silenciosa.

## D004. Oxlint anti-slop junto a ESLint de Next

Se mantienen los presets core-web-vitals y typescript de eslint-config-next 16.1.7 y se añade oxlint 1.78.0 con @oxlint/plugins de la misma versión exacta. El runtime anti-slop v0.1.2 queda incorporado con licencia y hashes. Las 15 reglas generales y la regla Effect están a error. El script lint ejecuta ambos analizadores y falla si cualquiera falla.

Objeción experta: sustituir ESLint sin demostrar equivalencia perdería controles de Next, React Hooks y accesibilidad del preset existente. No se presupone que oxlint carezca de todas esas capacidades: sencillamente no se ha acreditado equivalencia. Se evita la sustitución; coste aceptado: dos recorridos de fuentes y dos configuraciones. Las reglas generales siguen en ESLint; oxlint solo añade anti-slop (`plugins: []`, categoría correctness desactivada para no duplicar la política general). Ninguna regla anti-slop está desactivada.

El runtime de terceros no se fuerza a cumplir su propia política de código de aplicación. Se conserva su semántica y se comprueba con un proyecto TypeScript estricto separado, sin el plugin de diagnósticos arquitectónicos Effect. Objeción: excluirlo del proyecto principal podría ocultar roturas; por eso typecheck ejecuta ambos proyectos, y test:lint carga ambos plugins, verifica todas las severidades y comprueba rechazos reales. Coste: mantener un segundo tsconfig y una pequeña adaptación trazada para noUncheckedIndexedAccess.

## D005. Bootstrap con deuda explícita y CI acotada

La primera ejecución detecta 96 infracciones anti-slop en 25 archivos propios existentes. No se altera el cálculo ni se añaden comentarios SAFETY genéricos para conseguir verde. Se entrega mapa por regla/archivo y diagnóstico con posición, repartible por propietarios. Objeción: una CI inicialmente roja no distingue por sí sola regresiones y deuda. Se acepta temporalmente ese coste, sin baseline permisiva: cada entrega debe comprobar sus archivos y actualizar el mapa; una fase específica debe resolver la deuda antes de exigir verde global.

No existía CI. Se añade un job secuencial con límite de 15 minutos, instalación congelada, humo del lint, lint, typecheck y dos suites pequeñas (fronteras arquitectónicas y dinero, un trabajador). Typecheck y tests se ejecutan aunque lint falle. No se ejecuta build ni suite legacy pesada. Objeción: estas cinco pruebas no acreditan regresión fiscal completa; se acepta solo para bootstrap sin cambios de cálculo. La auditoría y las pruebas amplias posteriores siguen pendientes.

## D014. Conservar pérdidas y fechar exenciones sin extender su aceptación

CG-01/02/03 se corrigen tras contrarrevisión y nueve pruebas realmente fallidas. Objeción experta: conservar signos no resuelve calificación, compensación cruzada, bolsas ni arrastres; ampliar una exención sin validar hechos tampoco acepta todo el contrato. Se mantienen esos límites explícitos y una prueba de vivienda habitual anterior a 2015. Coste: el motor continúa siendo parcial; estos arreglos no certifican declaraciones completas. Detalle en correcciones/ganancias-patrimoniales.md.

## D015. Corpus de integridad con aceptación fiscal deshabilitada

Se integra el corpus después de corregir COR-01–08: aceptación autocontenida rechazada, schemas cerrados, identidad URL comprobada, cadenas desconocidas pendientes, metadatos saneados, números con signos no soportados rechazados y PNG publicado atómicamente. Objeción experta: una puerta cerrada no satisface todavía el enlace al motor exigido por el encargo. Se acepta únicamente como fase técnica; el puente de inventario/revisión externa sigue siendo trabajo obligatorio. No se denomina validación fiscal a sus veinte pruebas.

Se fija nixpkgs por revisión y narHash, Python 3.13.15, Poppler 26.06.0, Linux x86_64 y dependencias en uv.lock. Coste: entorno de reproducción más pesado y acotado a plataforma, a cambio de receta reconstruible y CI equivalente. La lista de hosts fiscales es explícita; fuentes editoriales/técnicas requieren política específica, sin equipararlas a normas. Se conservan solo cabeceras de contenido/cache mediante allowlist; las demás no acreditan la cifra y no se publican. WARC, confianza histórica de certificados y CSV jurídico permanecen pendientes como se explica en CORPUS.md.

## D016. Reconstruir en proceso nuevo y rechazar prototipos no soportados

La segunda contrarrevisión del inventario mostró imports obsoletos, un filtro dependiente del nombre absoluto del directorio y omisión con prototipo personalizado. La API inicia un proceso limpio por generación; el filtro usa la ruta relativa y el recorrido admite solo objetos/arrays ordinarios de su contexto, null-prototype explícito y Decimal real, rechazando NaN. Objeción: copiar la misma omisión en generador/verificador sigue siendo posible. Se conserva la revisión independiente y se añade una regresión que precarga una dependencia, modifica la copia scratch y exige el valor nuevo. Coste: proceso adicional y memoria/tiempo; ejecutar un worker y no varias reconstrucciones simultáneas. Los scripts originales del revisor se conservan byte a byte como .mjs.txt para reproducción en scratch, con hashes; no se cambian para satisfacer lint ni se relajan reglas de aplicación.

## D017. Adoptar arquitectura con puertas explícitas

ADR 0005 adopta Next, cálculo local, CAS y snapshots; integra las objeciones de revisión sobre payload exacto, resultado desconocido, saneamiento previo al hash, selectores de texto/CSV y cierre semántico. Objeción: adoptar un ADR no demuestra su implementación ni preservación fuera del equipo. La decisión separa esas puertas; no se certifican schemas candidatos, privacidad, restauración ni host real. Coste: instrumentación y validadores nuevos, más conservación de versiones; sin actores, infraestructura contratada ni despliegue nuevo.

## D018. Cotizaciones analíticas explícitas y reducción en su extremo legal

Se añade un contrato separado para doce mensualidades uniformes: topes mensuales de 2018 y tipos de solidaridad por pagador publicados en 2025/2026. Objeción experta: una función anual sin grupos, jornadas ni cuotas mensuales redondeadas no puede presentarse como nómina TGSS. Motivo: corregir las discrepancias demostradas sin ocultar supuestos ni destruir el oracle legacy. Coste: coexistencia temporal y conexión anual pendiente; el rastro deberá declarar el perfil. TDE-18 se corrige en su función existente tras tres pruebas rojas; los informes históricos tienen una errata de signo, precisada en correcciones/trabajo-y-cotizaciones.md.

## D019. Binding numérico actual y atestación externa del payload exacto

El puente reconstruye el inventario desde fuentes actuales, verifica original/recorte y compara el valor efectivo con Decimal. La revisión del binding vive fuera de la cita y fija payload, snapshot y alcance exactos, con tarea e informe registrados por el orquestador. Objeción experta: dos nombres o hashes autodeclarados no acreditan independencia ni vigencia. Motivo: separar integridad, valor actual, decisión jurídica y revisión del enlace. Coste: el primer caso queda candidato hasta contrarrevisión nueva, cada cambio de payload invalida la atestación y la raíz de confianza sigue siendo el repositorio editorial, no una firma de identidad. Ninguna salida certifica una regla completa. Detalle y límites en ENLACES-VERIFICABLES.md.

La reproducción IT3-01 muestra signos menos super/subíndice fuera del binding. El orquestador añade tres fallos antes del fix (dos glifos y un signo separado por espacio), exige dígitos ASCII y rechaza vecinos matemáticos, guiones y marcas Unicode. Objeción: una lista finita de signos deja variantes fuera; se usan categorías Unicode y se conserva la cita literal. Coste: rechazo conservador de expresiones ambiguas; no se normalizan ni se convierten en valores aceptados. La comprobación separada de signos no cruza filas de tabla; la semántica y el contexto del facsímil siguen requiriendo revisión.
