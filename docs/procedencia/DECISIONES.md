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

## D020. Integrar por contenido comprobado y conservar versiones documentales

Las cuatro entregas se comparan contra d9ff49c7 y contra la raíz antes de copiar. Se verifican archivos nuevos y los 841 de base; no hay borrados. Objeción: un diff Git vacío no muestra archivos nuevos y un índice dañado puede fingir borrados. Motivo: usar árboles, presencia y hashes, no confiar solo en el índice. Coste: manifiestos y comprobaciones adicionales. Se conservan los informes de limitaciones de cada autor y se exige revisión nueva del código integrado.

El verificador de fichas pasa a leer el inventario correspondiente a cada snapshot y se conserva su artefacto comprimido por hash. Objeción: conservar solo el manifiesto no permite reconstruir datos retirados ni cotejar versiones antiguas tras editar el motor. Motivo: enlaces históricos verificables y sin sustitución por la versión actual. Coste: copias locales de artefactos y más objetos; Git deduplica bytes idénticos aunque figuren bajo dos rutas. No se afirma todavía réplica completa ni restauración externa del corpus oficial.

## D021. Edad cumplida y orden después de elegibilidad acotada

Se corrigen MIN-001/007 y la API que ignoraba 2012–2014, después de siete pruebas rojas. Objeción: edad y discapacidad no agotan el derecho al mínimo. Motivo: corregir solo las condiciones expresadas y contrastadas; no inventar renta, convivencia o reparto. Coste: contrato familiar parcial explícito y futuras entradas. Asturias y protección histórica catalana siguen pendientes. Las cotizaciones canónicas se conectan al anual con supuestos uniformes explícitos, manteniendo el modo compatible-legacy y una misma cotización en desglose y rendimiento.

## D022. Rechazar entradas que permiten NaN en retenciones

RET20-008 demuestra Success con divisor cero. Se rechazan divisores no enteros positivos e importes no seguros/no finitos después de cinco pruebas rojas. Objeción: validez numérica no valida requisitos legales ni deducciones irregulares. Motivo: impedir resultados no numéricos utilizables sin fingir elegibilidad. Coste: entradas antes toleradas pasan a ResultadoNoSoportado; los demás defectos históricos siguen abiertos.

## D023. Cierre de dependencias y saneamiento previo al hash

ENV1-01/02/03 se reproducen y corrigen personalmente: marcas combinantes, edición persistente de payloads y cabeceras privadas en bytes públicos. Objeción: comprobar fuentes al final sin comprobar documentos deja un verde obsoleto; sanear una copia en memoria no limpia el artefacto publicado. Motivo: registrar/releer todas las dependencias y exigir manifiesto ya saneado. Coste: IO adicional, rechazo conservador de texto ambiguo y revisión nueva; no se afirma atomicidad frente a ABA. El payload madrileño anterior conserva su aceptación candidata exacta, sin traslado automático al snapshot actual.

## D024. Información perdida no admite binding numérico

ENV2-01 añade U+FFFD al contraejemplo del signo omitido. Se rechaza cualquier binding numérico de una cita que lo contenga, conservando los bytes originales y la posibilidad de registrar la cita pendiente. Objeción experta: filtrar únicamente el vecino inmediato deja nuevas separaciones y pérdida de contexto. Motivo: no convertir información ausente en una afirmación positiva. Coste: algún pasaje ajeno al número obligará a delimitar mejor el recorte o revisar la extracción. Dos pruebas con cinco comprobaciones fallan antes del fix; 24 pasan después.

## D025. Saldo explícito de otras rentas y perfil heredado separado

La API canónica de reducción requiere otras rentas algebraicas no exentas antes de reducciones y compensaciones. El anual calcula ese saldo con sus categorías admitidas. Objeción: una base del ahorro limitada o un alquiler reducido pueden cambiar indebidamente la elegibilidad. Motivo: aplicar el contrato contrastado de TDE-09/10; antes de 2015 la reducción no desaparece, pasa a 2.652 euros. Coste: adaptar llamadas y conservar una API antigua exclusivamente para el perfil sin otras rentas y reproducciones históricas. No se amplía por inferencia a rentas todavía ausentes.

## D026. Identidad del rastro en el punto de código

Cada línea anual propia recibe siteId explícito, instanceId por ejecución y decimal anterior al formato. El generador inspecciona esos puntos y fija sus fichas, fuentes e inventario en un snapshot. Objeción: deducir identidades de etiquetas o sustituir el snapshot de un resultado histórico produciría enlaces plausibles pero falsos. Motivo: enlazar al crear el resultado y rechazar su retagging. Coste: catálogo generado, conservación de fuentes y verificación de cobertura; las líneas de motores aún no instrumentados quedan pendientes. La ficha describe la expresión técnica; el ámbito y los enlaces jurídicos siguen pendientes hasta su verificación individual. Solo se añade el enlace mínimo en el texto existente, sin rediseño.


## D027 — Aplicación anual de deducciones incompletas

La contrarrevisión mostró que el formulario seguía aplicando fórmulas parciales y que una exclusión individual riojana podía cancelar el estado parcial de toda una colección. El padre corrige la composición y separa consignaciones de estimaciones en la entrada anual. Objeción experta: una cifra calculable sin todos los hechos no acredita derecho a deducirla. Elección: únicamente importes expresamente consignados se trasladan desde los controles antiguos; los contratos automáticos nuevos necesitan hechos completos y conexión revisada. Coste: menor automatización provisional y mensaje visible, sin rediseño. No se rebautiza el catálogo como automatización fiscal completa. Detalles y rojos: correcciones/integracion-ronda7/INFORME.md.

## D028 — Modo del perfil y comparación legacy

El modo solicitado llega a la liquidación y al neto, con la misma variante de cotizaciones. La conciliación indica su cuota de origen y se declara ajuste salarial, no oracle independiente. Objeción: corregir el modo sin la segunda resta de cotizaciones produciría un híbrido inconsistente; llamar comparación independiente a un ajuste de la misma cuota encubriría discrepancias. Coste: conservar separados el procedimiento heredado y las expectativas del Excel, cuya reconciliación de redondeos sigue pendiente. No se modifica el oracle para obtener verde.

## D029 — Integridad de la explicación actual e identidad de ficha

La versión de explicación incluye sus fuentes y verificadores. La puerta actual las coteja contra los bytes presentes; la puerta histórica conserva sus propios bytes. La proyección técnica fija además nombre, tipo, clase, archivo y localizador. Objeción: el mismo número y hash de archivo no prueban una identidad de campo ni una ruta de explicación correcta. Coste: cambios de código de explicación generan nueva versión incluso si el texto visible no cambia; no se migran atestaciones. Un snapshot antiguo sigue siendo reproducible.

## D030 — Originales fuera del equipo

Se integra el manifiesto de 708 originales candidatos (974.801.535 bytes), exportación/restauración local y ensayo negativo. Se prefiere almacenamiento LFS por objeto en el remoto ya existente a introducir casi 1 GB de blobs en Git ordinario. Objeción: los punteros empujados por JJ no transfieren los objetos LFS, y una caché local no es respaldo externo. Faltan revisión, adaptador de transferencia, cuota disponible y recuperación desde destino vacío. La API no permitió comprobar cuota sin ampliar permisos; se pregunta a Elies por cuota o límite, continuando trabajo independiente. Sin respuesta no se infiere autorización de gasto. Dos copias en GitHub no constituyen dos custodias independientes. No se elimina el paquete local.

Elies ha elegido dejar preparada la transferencia. Se respeta esa decisión sin subir objetos ni contratar almacenamiento. Coste explícito: persiste la dependencia de este equipo para los originales; el paquete verificado y el plan permiten una transferencia posterior. La limpieza final debe preservar el paquete y al menos una copia completa dentro de la raíz del repositorio, fuera de los worktrees que se retiren.

## D031 — IPC observado, escenario y sentido de comparación

Diciembre de 2026 queda fuera de la serie observada. La API general exige elegir su escenario y el perfil heredado selecciona explícitamente la hipótesis fija del 3 %. Se conserva el producto de tasas publicadas, con ese método en el resultado y en metadatos Excel. Objeción: el cociente de índices no coincide necesariamente con tasas redondeadas y 2026 aún no ha terminado. Coste: preservar la reproducción legacy sin atribuirle precisión de índices; esa modalidad queda separada y pendiente. La comparación inversa usa el recíproco y la ausencia de dato no se transforma en cero.

## D032 — Coherencia temporal y errores recuperables

La liquidación rechaza retenciones de otro ejercicio y el adaptador recibe selección temporal explícita por año. Sus errores previstos se propagan por Effect en vez de convertirse en defectos. Objeción: escoger cierre por defecto ocultaría reformas intranuales; propagar solo la etiqueta del modo produce un cálculo híbrido. Coste: los consumidores deben tratar rechazos y proporcionar elecciones cuando faltan; la API de auditoría amplía su contrato. No se pretende calcular una retención anual oficial mediante una conciliación salarial.

## D033 — Identidad y fechas en consignaciones

Las claves usan código completo y campo canónico; las fechas riojanas se comprueban como fechas civiles reales. Objeción: prefijos equivalentes duplican importes y Date.parse normaliza días inexistentes. Coste: entradas antes toleradas ahora se rechazan. La validación de estructura no acredita requisitos fiscales ni conecta automáticamente contratos parciales a los controles antiguos.

## D034 — Paquetes de preservación inequívocos y durables

Schema v2 cerrado, parser sin duplicados, tipos enteros exactos, URLs documentales clasificadas y ancestros sin symlinks. Sincronización de objetos, directorios y marcador, con fallo explícito. Objeción: un digest no hace publicables los metadatos ni garantiza persistencia del árbol tras caída. Coste: rechazo de paquetes v1 por la API nueva, clasificación de endpoints e IO adicional. Se conserva v1 histórico, se prepara v2 con los mismos 708 objetos y se verifica restauración completa. La política no promete seguridad frente a escritor hostil ni confianza histórica de firmas.

## D035 — Candidatos documentales sin sustitución de identidad

Se conservan las 455 propuestas estatales/autonómicas sin insertarlas automáticamente en el registro. La igualdad de un límite legacy no acredita una cuota de un helper canónico; tampoco extiende una aceptación acotada a todos sus aliases anuales. Objeción: añadir citas por coincidencia de número generaría una falsa cadena de prueba. Coste: ampliar exposición efectiva, resolver CAS y contratos de decisión y revisar enlaces de nuevo. El adaptador genera cinco entidades con estados técnicos separados; su wiring y revisión permanecen pendientes. Sus tests dejan los informes del autor inmutables.

## D036 — Publicación visible con durabilidad indeterminada

PREV2-02 demuestra que el último fsync puede fallar después de enlazar el manifiesto. Se conserva el marcador y se devuelve un error distinto; confirm coteja un manifiesto externo exacto, todos los objetos y sincroniza de nuevo. Objeción: borrar tampoco probaría rollback durable. Coste: tercer estado operativo y recuperación explícita. PREV2-01 rechaza offsets imposibles antes de normalizarlos. La copia local Crossa mitiga la pérdida de Victus pero comparte propietario y vivienda; no se anuncia como custodia independiente. Se conserva v1 fuera de T3 antes de limpiar.

## D037 — Dos contratos aritméticos y un oracle independiente

El detalle legacy reproduce tipos y orden binary64 NumPy/Python; importes monetarios calculados y porcentajes mantienen sus contratos explícitos. Objeción: aplicar un redondeo decimal uniforme alteraba celdas del libro; regenerar hashes desde el mismo motor no demuestra equivalencia. Coste: helper técnico adicional y fixture de hashes temporalmente rojo hasta cotejar el Excel completo. Los fixtures anteriores permanecen intactos. La caracterización del detalle se contrasta con una nueva ejecución del Python original, fijada por hash.

## D038 — Conexión anual con hechos conciliados y alcance expreso

Se conecta trabajo o EDS al cálculo anual 2025 mediante una entrada optativa, individual de Madrid y sin circunstancias excluidas. Las mezclas y activos con historia insuficiente se rechazan; los pagos tienen una sola entrada. Objeción: sumar aportes sin atribución de gastos y mínimos fabricaría una liquidación plausible pero falsa. Coste: cobertura pequeña, conciliación de hechos externa y aceptación fiscal pendiente. No se imputa cotización ni se cambia un perfil existente por defecto.

## D039 — Identidad de ámbito y grafo

El puente exige pertenencia a las dimensiones de la ocurrencia y el inventario distingue comparación nominal de intervalo. El grafo exige un solo ID y receta coherente entre cita y captura. Objeción: números iguales o nombres de hashes no prueban identidad ni preservación. Coste: bloquear ámbitos sin dimensiones explícitas y materializar el cierre antes de publicar. Las dimensiones técnicas tampoco acreditan vigencia; no se autoacepta el texto de un claim.

## D040 — Hashes del original y conversiones binarias

El contrato tabular se comprueba contra una extracción XML independiente del Excel y conserva el fixture TypeScript anterior como historia. Objeción: un expected generado por la propia implementación puede perpetuar sus errores. Coste: mantener dos procedencias explícitas y conservar rojo el contraste de inflación hasta resolver sus 69 diferencias. El helper convierte la magnitud decimal completa al final para evitar una segunda pérdida de precisión; hay rojo independiente previo y regresiones de ambos signos. Coincidir con Excel no acepta fiscalmente sus reglas.

## D041 — Copias aisladas y configuración de lint

Las copias temporales de ejecución de los revisores permanecen en disco, fuera de la entrega seleccionada por manifiesto y de las comprobaciones del producto. Oxlint no descubre configuraciones anidadas de esas copias; carga la configuración única con las 16 reglas a error. Objeción: analizar otra copia del mismo proyecto provoca plugins duplicados e imports parciales, mientras excluir toda la documentación ocultaría scripts reales. Coste: una lista explícita de subdirectorios temporales que debe mantenerse; pruebas y scripts entregados continúan analizándose. No se elimina deuda con excepciones por regla.

## D042 — Correcciones públicas como afirmaciones contrastables

Se conservan posts verificados, imágenes originales y transcripciones por corrección, separados del corpus oficial. Objeción: una anotación correcta puede mezclar tipos normativos, redondeo mensual e hipótesis familiares no declaradas. Coste: distinguir la discrepancia histórica ya corregida de los nueve casos todavía indeterminados y volver a revisar ambos grupos con primarios. No se fabrican hechos ni pruebas rojas; tampoco se trata la falta de datos como cierre del encargo. Solo se guardan handles públicos, contenido y metadatos de adquisición necesarios, sin perfiles adicionales.
