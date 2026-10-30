# Contrarrevisión personal de multiplicidad y BORM R27

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Dictamen de las comprobaciones terminadas: RX25-01 se reproduce con las fuentes anteriores y la solución actual conserva los 228 enlaces admitidos, sin deduplicar ejercicios. La revisión conserva además contrapruebas de reconstrucción y de estados distintos; sus resultados definitivos se registran al final de este informe. No se autoriza promoción de confianza ni aceptación de una regla fiscal completa. El encargo global continúa abierto.

Base examinada: `1ed8acfdf77dfee5330da0f0131f42956b45206a`, 15.730 entradas. Contraste histórico: `ae37484d2ea5e56ff6cda68283ec7e1ef7a443df`. `comparacion.diff` conserva los cambios de fuentes pertinentes.

## Fuentes, identidad y recepción

Se examinaron los informes R27 y recepción, registro-exacto-r25-sol y código anterior y posterior.

El cotejo inicial compara físicamente todas las entradas, un blob cada vez, con lstat/readlink/bytes y ejecutabilidad aplicable en ambos sentidos: cero discrepancias y diff vacío. El índice no es la prueba de presencia. Cada archivo de esta entrega es nuevo, con baseSha256 null; ningún original asignado cambia. El cotejo final y el manifiesto completan la comprobación de salida.

Los instrumentos de preparación y recorrido se derivan expresamente de los recibidos. No se presentan como un segundo diseño independiente. Se revisan sus aserciones, se cambian solo rutas/base del ensayo y se añaden casos propios de reconstrucción, ámbito y presentación. Los resultados proceden del coordinador, Python, publicador y GET importados reales; no se inyectan respuestas. No hay servidor, browser o build. Cada original necesario queda en CAS scratch propio con SHA256/SHA512/tamaño y referencia de adquisición recibida; no se añade un PDF original a docs ni a transporte.

## Colisión anterior y recorrido admitido

Con las fuentes de ae37484d y los 264 pares originales se reproduce `ID duplicado` en agregar/generarEvidencia: **58.638,134 ms**, maxRSS informado por Bun **3.037.564 KiB**. Este máximo corresponde a su proceso, no a un muestreo simultáneo de toda Victus y sus hijos. Se conserva el código 1 y stack en antes/recorrido.json; no se cambia su esperado.

Con la base actual, el subconjunto de **228 pares/90 sujetos** publica y verifica el snapshot `f3504d80a123fb0de6d9c5fe4b393a4916b88b0776ebeb14de73fc246915f9fe`. Coincide con el recibido después de ejecutar nuevamente las capas reales. El recorrido hasta todos sus GET tarda **162.378,679 ms**. Otro pase GET de las noventa fichas y dieciocho objetos tarda **31.537,323 ms**. Son tiempos de lotes, no latencias de producción. Se usa un trabajador y el lock pesado.

Los 36 payloads excluidos dependen del BOE-A-2010-19703, SHA256 `e7b629a20bde61bcb42c54b2caf3af06f2b44613fc6f89718ff5ff9763d4a4f4`, 42.900.459 bytes. Se cotejan sus relaciones en la preparación; el límite genérico de diez millones permanece. El fallo completo por CAS es conocido y conservado por el padre; esta revisión no lo corrige ni presenta ese lote como publicado. casos-228.json enumera sujetos, fuentes, ámbitos, atestaciones, revisión final, aristas Rule y estados, además de las 36 exclusiones. Su unión exacta contiene los 264 payloads candidatos distintos; no se transforma ese conjunto en reglas jurídicas aceptadas.

## Multiplicidad, revisión y autoridad

La agrupación es por itemId del inventario, no por valor numérico. Cada payload mantiene sus nodos Rule/Citation/Facsimile/Document. La ocurrencia compartida enlaza todas las proposiciones y recibe su revisión después de ordenar y completar las aristas. Todos sus estados apuntan a esa revisión final exacta. La revisión cambia si cambia su conjunto de aristas. El ámbito de cada Rule permanece desconocido para selección automática; su proposición y condiciones particulares se conservan por payload.

La clave de cobertura v2 es sujeto/revisión/payload. Los recibos v1 mantienen unicidad por sujeto, además de la cobertura exacta. Se comprueba cada correspondencia contra el registro y sus atestaciones originales. El verificador rechaza omitir un año, duplicar un par, cruzar años del mismo sujeto y alterar una revisión. Los bytes públicos se deduplican por hash, con tamaño y MIME compatibles; no se colapsan las entidades que describen esos bytes.

Decisión RS27-D1: corroborar solo esta representación técnica y el recorrido admitido. Objeción experta: reutilizar el primer año o primera aprobación aparentaría resolver la colisión. Respuesta: se conservan y cotejan todos los payloads y aristas, con identidades y revisiones finales. Coste: comprobaciones de lote más lentas, mayor longitud de fichas y mantenimiento de recibos v1/v2. No se extiende una aprobación a ejercicios, territorios o al sujeto completo.

Los adversos Python conservan nominal-only como incapaz de establecer selección temporal, Madrid 2022 con fallecimiento coherente y el umbral estricto Murcia >60.000. Los casos adicionales rechazan año y territorio ajenos para cada payload admitido. Ningún positivo acredita residencia, elegibilidad, aplicabilidad ni una liquidación completa. Madrid activo mantiene su identidad real 2020, pending y complete=false según regeneracion.json; no se sustituye por Madrid2022.

## BORM y privacidad

Se conserva la URL exacta `https://www.borm.es/services/anuncio/ano/2022/numero/4846/pdf?id=811060`. La excepción solo permite HTTPS, host literal, path de anuncio, año/número/id numéricos acotados y fin absoluto. La revisión prueba parámetros adicionales, clave repetida, credenciales, hosts engañosos, puerto/grafías alternativas, fragmentos, codificación de clave/valor, cero/signo/exponente/longitud, path alternativo y terminadores de línea/control. No se quita la query para aparentar otra identidad documental. El consumidor no comprueba por esta regex que cualquier id exista, ni autentica al emisor.

Decisión RS27-D2: admitir el identificador público dentro de esa gramática. Objeción experta: generalizar una excepción por dominio filtraría queries arbitrarias. Respuesta: la coincidencia se aplica al texto completo y los adversos cuestionan también normalizaciones del parser URL. Coste: otros endpoints legítimos necesitan contrato propio. Es una frontera de publicación de este formato, no una garantía universal de privacidad o autenticidad.

## Límites y entrega

Integridad, autenticidad, exactitud numérica, interpretación y aplicabilidad se consideran ejes distintos. Las 264 atestaciones anteriores no equivalen a una regla fiscal completa. El registro activo sigue vacío; ni recibir esta revisión ni publicar en scratch autoriza su alta. V4 conserva su pin/corte R21; Crossa sigue v1 desfasado, misma casa/dueño, copia local fuera de Victus sin independencia acreditada. No se inspeccionan ni modifican esas copias.

Decisión RS27-D3: entregar los rojos y el contraste de historia sin arreglar producto. Objeción experta: un rojo de instrumento o una hipótesis no demostrada podría confundirse con defecto. Respuesta: conservar esperado, resultado y capa concreta, contrastar el comportamiento histórico y requerir al padre la conclusión nueva. Coste: otro contraste antes de cualquier decisión operativa. No se atribuye aceptación propia ni se declara cerrado el encargo.

COMANDOS.md contiene secuencia, entorno, procedencia de instrumentos y límites. Manifiesto, patch gzip, binarios por hash y ensayo byte a byte transportan solo el ámbito. Se conservan logs iniciales de calidad y rectificaciones de instrumentos propios; no se cambian esperados históricos. No hay cambios en ESTADO, DECISIONES, confianza, cálculos, inventario o informes ajenos; sin PR, main, deploy, LFS, gasto, X, mensajes externos, transferencias del corpus ni limpieza.

## Resultados finales y frontera de la hipótesis roja

Verifican los **38 snapshots** con sus datos y recibos históricos, sin ejecutar software conservado. Se rechazan **29 URLs BORM adversas**, **19 alteraciones físicas tardías** de originales/facsímiles/registro y, por separado, el cambio persistente de la fuente real `lib/dominio/irpf/cuotas/escalas-publicadas.ts`, con hash anterior registrado. Los 228 ámbitos conservan sus fronteras: año/territorio ajenos rechazados y aplicabilidad no establecida. Diez adversos del auxiliar terminan rechazados en controles-final.json.

El recorrido mixto real publica **227 estados accepted-limited y uno pending**; solo ese enlace carece de referencia de atestación en el registro scratch. Los archivos originales de atestación no cambian. El sujeto `inv-f9cf076b400a200a1c79b6cf4f8e9d11` conserva tres enlaces: mixto-get-final.json coteja dentro de cada sección HTML el hash del payload y sus pares dt/dd de revisión, autenticidad, interpretación y aceptación completa falsa. Se comprueban todos los objetos públicos por MIME/tamaño/hash y una revisión ajena devuelve 404. Tiempo del recorrido mixto: **162.212,311 ms**; maxRSS de Bun **3.433.588 KiB**. La espera del lock queda fuera de estas métricas.

La reconstrucción coherente de una proposición ajena pasa la llamada directa a verificarContenido, tanto en el consumidor nuevo como en el anterior con recibo v1. También pasa directamente una cita cruzada si se recompone coherentemente todo su recibo y grafo. Se conservan esas expectativas rojas; no se cambia su esperado. No son una prueba de ejecución del coordinador ni una entrada aceptada por el publicador real. El contraste de frontera guarda los objetos reconstruidos en scratch: sus IDs nuevos no están registrados y leerSnapshot devuelve null; alterar bytes bajo el ID original fijado se rechaza por hash. El recibo v1 con multiplicidad y la arista Rule cruzada entre payloads sí se rechazan. No se demuestra una regresión R27 ni un bypass operativo de registro/pin; sí se delimita que la coherencia interna sola no autentica un recibo ni deriva semánticamente sus afirmaciones. Esta conclusión requiere contraste del padre.

Decisión RS27-D4: conservar esa distinción y no atribuir promoción indebida al helper directo. Objeción experta: el recibo reconstruido describe una proposición ajena y puede aparentar procedencia ejecutada. Respuesta: documentar ese límite real, contrastarlo históricamente y comprobar el registro/pin y el publicador sin resultados inyectados. Coste: no prometer reconstrucción semántica general o autenticación del emisor por este verificador; conservar el rojo directo, sin ocultarlo tras los pases de otras capas.

Las dos rectificaciones propias de selección de aprobación y comentarios React permanecen junto a sus rojos iniciales, sin modificar esperados históricos ni producto. Lint de catorce copias JS exactas: oxlint y ESLint sin errores; dieciséis reglas anti-slop a error, un hilo y disable-nested-config. ESLint conserva el diagnóstico de entorno Pages ausente en scratch. Ruff pasa sobre los cinco Python propios. Mypy final pasa esos cinco con follow-imports=silent y check-untyped-defs; se conservan el intento sin módulo y el segundo sin MYPYPATH, sin contarlos como pases. No es tipado estricto de toda la aplicación ni un build.

Los registros activos coinciden con los hashes fijados por regeneracion.json; Madrid v1 permanece pending y complete=false. No hay atestación fiscal nueva, alta operativa ni aceptación propia de regla completa. El dictamen es técnico y limitado al cambio/recorrido efectivamente comprobados. La ejecución completa de 264 continúa pendiente del CAS; recibir esta entrega no la cierra.

Cierre físico posterior a las pruebas: las **15.730 entradas** coinciden con HEAD/base, sin ausencias ni cambios de tipo/readlink/bytes/ejecutabilidad y diff vacío. arbol-cierre.log y cierre.json.gz conservan el resultado. Las únicas altas del checkout están en el ámbito de revisión y su .cache. El transporte excluye esa caché y preserva sus referencias CAS para una futura conservación; no representa custodia independiente.

El primer ensayo de transporte terminó rojo por la representación de archivos sin salto final en el patch producido por difflib. entrega-inicial.patch.gz y transporte-inicial.log lo conservan; el scratch parcial permanece. Se añade el marcador estándar de ausencia de newline, conservando los bytes esperados, y se repite en otro scratch tras Ruff/mypy. No es un fallo de producto ni se altera una expectativa histórica.
