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

## D043 — Cuotas publicadas y rastro de la entrada anual

Madrid 2025 usa las bases y cuotas fijas publicadas, después del rojo independiente y cuatro regresiones rojas del padre. No se infiere el régimen de fallecimiento ni otros años. El resultado explícito se enlaza al catálogo actual con contexto anual y territorial; la suma de salarios admite hasta cien entradas con su cota acumulada propia. Objeción: integrar marginales pierde los céntimos publicados, y una suma válida no debe rechazarse por reutilizar la cota de un pagador. Coste: tabla anual expresa, quince hojas nuevas y contrato agregado separado. La conexión sigue acotada a los hechos declarados y necesita contrarrevisión del cambio.

## D044 — Publicación documental con cierre físico

El snapshot v2 conserva por hash todas sus dependencias y publica únicamente PDF/PNG declarados. Un recibo nace del coordinador real contra el código actual; no se admite un informe autodeclarado como prueba. Búsqueda con índice verificado y una caché decodificada acotada; cada lectura relee y comprueba el hash. Objeción: un enlace a un objeto ausente o una caché que oculta mutaciones no es procedencia reproducible. Coste: almacenamiento, comprobaciones y límite de 10 MB por objeto local. La interpretación sigue candidata, el binding pendiente y la autenticidad históricamente indeterminada. Cambiar esos estados requerirá un contrato y revisión adicionales. No se promete transacción durable frente a corte eléctrico ni despliegue ya medido.

## D045 — Nuevas identidades sin heredar aceptación

Se remapean 264 propuestas por archivo, símbolo y ruta exactos; el valor y la unidad deben permanecer iguales. El territorio técnico se declara por pares explícitos, nunca por todo un archivo ni por igualdad numérica. Objeción: decisiones sobre representaciones legacy no cubren automáticamente hojas canónicas ni sus años. Coste: mantener originales y propuestas nuevas, y exigir otra revisión jurídica sin renombrar schemas históricos para forzar aceptación. Los siete algoritmos AEAT antiguos recuperados mediante archivos web conservan su procedencia secundaria, fechas discrepantes y tachados; no habilitan por sí solos el motor de 2012–2016.

## D046 — Comparativa tabular y cobertura real de X

La exportación de inflación mantiene el orden binario original hasta el redondeo final. Las 69 diferencias quedan corregidas sin tocar APIs monetarias ni el fixture anterior; las 18 hojas se contrastan con hashes extraídos independientemente del Excel. Objeción: una reproducción exacta no convierte una simplificación heredada en regla fiscal. Coste: dos contratos aritméticos expresos. La nueva revisión de X produce contraejemplos de reparto familiar y coherencia entre IRPF y neto; deben resolverse por contrato, sin dividir todos los mínimos por dos ni alterar el oracle silenciosamente. Siguen pendientes las reglas mensuales TGSS y la revisión de esas ampliaciones.

## D047 — Árbol comprometido y cobertura de evidencia

Las rutas con corchetes se seleccionan con filesets literales `root-file:` y se cotejan por hash dentro del commit mediante `git cat-file`. El padre omitió dos rutas al usar patrones de prefijo de JJ: los tests en disco pasaban, pero el checkout delegado carecía de ellas. Objeción: verificar un árbol de trabajo no demuestra que el respaldo incluya sus bytes. Coste: manifiesto explícito por archivo y comprobación posterior al commit, además de pruebas del GET real. La cobertura v2 exige un estado por sujeto documental y correspondencia exacta con los recibos, sin exigir evidencia a todas las ocurrencias técnicas. Los documentos, citas y facsímiles sin recibo se rechazan. Esto corrige pérdida de metadatos, no acepta reglas fiscales.

## D048 — Cuota y neto de la comparación gráfica

La vista comparable selecciona la cuota auxiliar cuando existe y resta esa misma cuota al obtener el neto. El coste laboral y neto se concilian con los componentes ya expresados en céntimos; se exponen los ajustes respecto de los totales originales. Objeción: mezclar cuota anual simplificada con neto procedente del límite de retención produce una comparación internamente falsa; cambiar el motor heredado destruiría el oracle. Coste: contrato de presentación separado y posibles diferencias de un céntimo por sumar componentes redondeados. Las APIs históricas, sus diferencias de poder adquisitivo, el simulador que usa su cuota final y la exportación Excel permanecen bajo sus contratos anteriores. La selección no determina por sí sola obligación de declarar, ingreso fiscal exigible ni liquidación anual completa. La explicación lo declara y la corrección necesita revisión independiente nueva.

## D049 — Verificar la ruta compilada y conservar respuestas HTTP

El primer build real rechaza `react-dom/server` en la ruta de ficha. Se sustituye el render estático por la API de Web Streams de React, usando su export público `react-dom/server.edge`, que el adaptador instalado de Next expone como `renderToReadableStream`. Se espera `allReady` antes de entregar la respuesta y se mantienen 404/503, CSP y ausencia de scripts de hidratación. Objeción: cambiar solo el import a otra API legacy puede compilar y fallar al servir; las pruebas sin bundler no detectan esa diferencia. Coste: probar de nuevo build y GET compilado, y nueva versión de explicación. React recomienda streams Node para un servidor Node genérico; aquí se conserva el contrato estándar Response/Web Streams del manejador de Next. Referencias: [API React](https://react.dev/reference/react-dom/server/renderToReadableStream) y adaptador instalado `next/dist/build/webpack/alias/react-dom-server.js`. No se importa una API privada de Next ni se inicia servidor o despliegue.


## D050 — Dependencias documentales en el paquete de Next

El build verde no incluía ningún archivo del almacén en las trazas de las rutas. Se añaden únicamente snapshots.json y objetos por hash a las rutas /procedencia. La configuración forma parte de la versión de explicación. Objeción: probar el GET dentro del repositorio permite leer archivos que un despliegue nunca copiaría. Coste: incluir también los snapshots históricos, medir el paquete y ejecutar el GET en una copia formada exclusivamente por las trazas. El volumen local crece con la historia; no se afirma compatibilidad con un límite concreto de hosting ni se despliega. Se preserva la decisión de no contratar almacenamiento. Referencia: [inclusiones de Output File Tracing](https://nextjs.org/docs/15/app/api-reference/config/next-config-js/output).

## D051 — Derechos familiares declarados y reparto explícito

Se añade una entrada canónica optativa de derechos por descendientes para Madrid 2025, con titulares, hechos de elegibilidad, prioridad de grado y reparto. Objeción: dividir por dos por defecto o inferir derechos de edad/discapacidad atribuye un beneficio sin hechos suficientes. Coste: contrato más exigente, rechazo de familias fuera del alcance y conservación del perfil antiguo como simplificación distinta. Los hechos declarados no se verifican administrativamente. La implementación candidata pasa 98 pruebas y requiere una revisión independiente nueva antes de aceptar su corrección fiscal acotada.

## D052 — Las condiciones editoriales deben ser comprobables

Las 78 decisiones estatales y 186 autonómicas aceptan solo celdas y ejercicios bajo condiciones expresas. No se registran como bindings aceptados mientras el selector solo proyecte estado y localización. Objeción: una condición escrita sobre fallecimientos, componente o vigencia puede perderse al reutilizar el número. Coste: contrato de ámbito ejecutable, payloads nuevos y revisión exacta; preservación de las versiones anteriores. No se sustituye una condición jurídica por una lista arbitraria de strings ni se acepta el resto de la regla por asociación.

## D053 — Preservar originales nuevos sin cargar el respaldo de código

El CAS de la nueva revisión estatal se conserva fuera de T3 por ambos hashes y queda fuera de Git ordinario; manifiestos, citas y recetas permanecen versionados. Objeción: dejarlo solo en el checkout perdería los bytes al limpiar, mientras subirlo automáticamente eludiría la decisión de almacenamiento. Coste: ampliar y restaurar un paquete local nuevo, con dependencias explícitas para los revisores. Crossa seguirá siendo v1 histórico y desfasado; no se presenta una copia local como custodia independiente. No se autoriza gasto ni transferencia.

## D054 — Conciliar renta propia antes de decidir prioridad de grado

La entrada anual exige declarar que sus rentas y gastos caben en el perfil parcial y compara la renta propia con el saldo neto que este representa, antes de reducciones y compensaciones. Objeción: bruto, base liquidable y repetición del mismo dato no prueban la renta del artículo 61; el perfil tampoco representa todas las categorías fiscales. Coste: rechazar contradicciones y hechos no conciliados, conservar las limitaciones del perfil y no afirmar exhaustividad fiscal. La representación en céntimos no puede cambiar de lado el límite de 8.000; si lo haría, se rechaza en lugar de adjudicar el derecho con una cifra redondeada.

## D055 — Fechas civiles del evento y fronteras pendientes

La edad al evento se compara con la fecha completa del cumpleaños, después de validar las fechas. Objeción: restar años rechaza a menores que cumplen 18 más tarde en el ejercicio; normalizar fechas inexistentes con Date también inventaría un criterio. Coste: pruebas antes/en/después del cumpleaños y rechazo expreso de la frontera bisiesta cuya interpretación específica no se ha cerrado. Se mantiene la exclusión de adopciones adultas y no se amplía la ley personal o capacidad civil soportada.

La constitución del vínculo actual tiene fecha propia, distinta de la inscripción o primer hecho habilitante del incremento. Objeción: usar esta última para determinar minoría de edad mezcla constitución civil y comienzo del plazo fiscal. Coste: exigir otro hecho explícito y rechazar su ausencia; no se supone que ambas fechas coincidan ni se reinicia el plazo por un acogimiento seguido de adopción. Rojo adicional y nueva revisión pendientes de aceptación.

## D056 — Los hechos de alimentos prevalecen sobre el flag de cálculo

La conexión anual rechaza al pagador judicial sin custodia hasta representar cuantía y especialidad. Objeción: permitir false como renuncia voluntaria omite un procedimiento que los hechos requieren. Coste: menos entradas liquidables, sin inventar una cuota alternativa. La situación de otro titular pagador no bloquea al custodio: se conserva la atribución del mínimo y se comprueban los hechos de cada rol. Los tres fixes requieren revisión independiente nueva.

## D057 — Sol 6.1 High para todos los hijos

La corrección expresa de Elies sustituye la elección anterior de Astra High: cada nueva delegación fija gpt-6.1-sol y esfuerzo high, también reintentos y contrarrevisiones. Astra solo orquesta. Objeción: heredar el modelo del padre vuelve a consumir la cuota que el usuario quiere reservar. Respuesta: argumentos explícitos y comprobación del modelo efectivo devuelto por el lanzador; ninguna excepción sin autorización previa. Coste: cancelar y retomar una revisión familiar recién iniciada, conservando sus avances. Las seis tareas de ronda 15 ya habían terminado cuando se comprobó su estado; sus entregas se preservan sin repetir trabajo por el solo cambio de modelo.

## D058 — Alimentos propios sin mínimo quedan fuera del contrato anual

MDV2-P01 conserva una cuestión jurídica abierta cuando el custodio pagador no tiene mínimo por otras condiciones. Se excluye ese cruce expresamente, reutilizando la selección de titulares por descendiente, sin inventar cuota ni dar por aplicable la especialidad. Objeción: restringir soporte puede rechazar un caso jurídicamente liquidable sin especialidad. Respuesta: el mensaje y el alcance declaran esa capacidad pendiente; los custodios elegibles y alimentos ajenos no quedan bloqueados por asociación. Coste: menos cobertura anual hasta cerrar criterio y hechos; la reserva jurídica no se declara resuelta por pasar pruebas de rechazo. Cinco rojos contractuales conservados y revisión nueva pendiente.

## D059 — Contenido semántico antes de declarar completas las fichas

Dos lotes editoriales preparan explicaciones sustantivas para los 65 sitios instrumentados y las celdas seleccionadas, con correspondencias exactas de fuente, símbolo, ruta y ámbito. Objeción: generar miles de plantillas o borrar estados pendientes no satisface la explicación experta de cada elemento. Respuesta: derivaciones, condiciones, casos independientes y citas por concepto y celda, reutilizando solo derivaciones comunes mediante referencias explícitas; el resto del inventario continúa pendiente. Coste: autoría y revisión independientes adicionales, sin prometer que 65 pasos o 264 celdas cierran las 52.461 ocurrencias. La autoría candidata no cambia estados jurídicos, motor, diseño o registros de confianza.

## D060 — Integrar contratos documentales sin heredar aprobación

La integración R19 conserva cambios fiscales del padre y une históricos; regenera los alias y prepara 264 payloads con identidades nuevas contra el inventario actual. Objeción: copiar un ámbito declarado o una aprobación sintética podría conferir aceptación aparente sin revisión del objeto real. Respuesta: registros, atestaciones y decisiones reales intactos; revisión técnica y jurídica independiente antes de cualquier promoción. Coste: nuevas identidades, pruebas y revisión aunque las cifras coincidan; el período nominal estatal y los hechos externos siguen sin acreditarse.

## D061 — Los nuevos originales se preservan fuera de T3

Los blobs de la revisión histórica de retenciones se conservan por ambos hashes en el CAS local y se excluyen del respaldo ordinario de código. Objeción: una ruta ignorada puede desaparecer al limpiar o faltar en otro checkout. Respuesta: mapa explícito de fuente y copia verificada fuera de T3; las adquisiciones, citas y manifiestos se versionan sin alterar su historia. Coste: Git no restaura por sí solo esos bytes y la ampliación local requiere cotejo posterior al corte v3. No se presenta Crossa v1 como paquete actualizado ni custodia independiente y no se autoriza gasto o transferencia.

## D062 — Recibir la autoría sin confundirla con publicación

Los dos lotes editoriales se incorporan como superposiciones candidatas, con identidad histórica intacta. Objeción: transportar texto que todavía no ve el usuario no completa las páginas del encargo. Respuesta: revisión independiente por afirmación antes de adaptar al publicador; la comprobación estructural solo confirma los 65 sitios y sus fuentes actuales. Coste: otra integración y revisión posterior, sin rebajar la calidad ni declarar completas las 52.461 ocurrencias por contar fichas. Los originales y facsímiles referenciados deben seguir preservados antes de limpiar.

## D063 — Separar recepción acotada y trabajos pesados

El cotejo de recepción lee un blob o archivo cada vez y conserva memoria acotada; puede usar un bloqueo propio sin esperar detrás de renders o suites. Objeción: ampliar concurrencia sin medir puede poner en riesgo Victus sin swap. Respuesta: no ejecutar compilación, render ni pruebas en esa excepción; mantener un solo lector de recepción y el bloqueo pesado para todos los trabajos de mayor consumo. Coste: dos clases de bloqueo y obligación de no reutilizar el de recepción para tareas pesadas. La tentativa de cancelar el primer cotejo ya terminado no actuó; se documentan los dos pases, sin inflar cobertura.

## D064 — El recibo conserva una versión semántica de software

El verificador reconstruye la explicación con el generador y las fuentes ordenadas del helper conservado, leído como AST sin ejecutar JavaScript histórico. Objeción: que un hash exista en el CAS no prueba que corresponda al path del recibo; compararlo con el checkout actual destruiría historia válida. Respuesta: cotejo por versión propia, rutas únicas y bytes. Coste: mantener el contrato de array literal o migrarlo explícitamente. Se rechazan también informes vacíos y decisiones con dos discriminantes. Las correcciones requieren revisión nueva antes de promover bindings.

## D065 — Sobre cerrado y durabilidad distinguida de presencia

El consumidor v3 valida todos los niveles del sobre, rutas portables y correspondencia de clase con adquisiciones. TGSS usa una lista examinada de endpoints, sin sufijos libres. Un fallo de fsync después del marcador comunica durabilidad indeterminada, conservando los bytes. Objeción: limpiar el marcador no revierte una publicación ya visible, y hashes válidos no eliminan metadatos privados. Coste: schema, lista documental y recuperación explícita; revisión adicional para nuevas URLs. Los paquetes históricos no cambian al mejorar su lector. Nuevos originales requieren una edición distinta y Crossa permanece v1 desfasado.

## D066 — Rectificar pérdidas de extracción sin reescribir el original

Los tres recortes de algoritmos2015/2016 muestran ≤64; se retira el supuesto cambio de operador inferido de la capa de texto. Se conservan rojo, cita y revisión anteriores con una rectificación candidata separada. El contrato añade la alternativa de alimentos87.5 independiente del signo de variación. Objeción: una imagen idéntica no sustituye su lectura y un subpaso no certifica la nómina. Respuesta: inspección personal del signo, reproducción por hash, cotejo del artículo y exclusiones expresas. Coste: revisar la rectificación y no habilitar automáticamente versiones ni resolver doble600/julio.

## D067 — Enmiendas por afirmación y dependencias aún candidatas

Las versiones editoriales corregidas conservan la autoría histórica y enlazan pasajes específicos por ejercicio. Se separa la renta del titular próximo de la del descendiente y se clasifican los controles materiales como tales. Objeción: enlazar todas las constantes de una función a todos sus resultados produce aristas falsas. Respuesta: retirar el vínculo500→íntegro y exigir análisis por valor, control y tránsito antes de publicar las demás relaciones. Coste: completar flujo de datos y revisión del wiring; las17 citas nuevas no cierran toda la vigencia ni las52.461 ocurrencias. No se confunde preservar candidatos con mostrar páginas completas.

## D068 — Un techo no debe elevar el candidato inferior

La edición documental R22 del artículo87.5 conserva el tipo inferior y sustituye expresamente el párrafo que mezclaba la calificación legal con los números de causa del PDF. Objeción: reintroducir la guarda sin resolver precedencia deja dos contratos incompatibles; elegir un orden de mínimos arbitrario inventaría una solución. Respuesta: techo min(candidato,anterior) con mínimo ya satisfecho y compatible, evento alimentario único y exclusión expresa de todas las concurrencias en este subcontrato. Coste: menos cobertura operable, sin afirmar que la ley excluya esos hechos; la composición completa sigue pendiente. La corrección exige revisión nueva y no habilita versiones.

El digest bruto del artículo conserva su identidad y recibe una receta exacta de bytes, separada del hash del texto. Objeción: el fragmento entre atributos no equivale al elementoHTML y su hash no prueba vigencia. Respuesta: offsets, marcadores y transformaciones explícitos, sin cambiar el original ni el rojo histórico. Coste: mantener una receta heredada poco intuitiva y usar identidad nueva para cualquier selección semántica futura.

## D069 — Gramática histórica limitada para la lista de fuentes

Se rechazan exportaciones conflictivas, redeclaraciones y usos ambiguos del binding; las rutas no admiten saltos finales. Objeción: un array literal por sí solo no garantiza qué binding exporta el módulo. Respuesta: exigir const y una gramática de usos comprobada sobre los históricos, sin ejecutar código conservado. Coste: formas futuras válidas de JavaScript pueden necesitar migración; no se presenta la comprobación sintáctica como prueba del comportamiento arbitrario de callbacks. Los 34 snapshots previos verifican y los dos nuevos conservan el inventario.

## D070 — Unicidad de evidencia y multiplicidad de observaciones

Fuentes, adquisiciones, referencias y referencias no resueltas rechazan duplicados. Las exclusiones v3 conservan sus 4.147 observaciones y se informa de las 1.089 distintas. Objeción: contar repeticiones infla cobertura, pero rechazar el manifiesto histórico destruye compatibilidad sin cambiar objetos. Respuesta: preservar el registro y separar el recuento único; ninguna exclusión repetida prueba algo nuevo. Coste: esa distinción debe acompañar toda métrica. URLs malformadas se rechazan con diagnóstico constante y los patrones de ruta exigen fin absoluto. Revisión nueva pendiente.

## D071 — Rectificación histórica sin trasladar reglas modernas

La edición 2012–2014 retira las inferencias visuales incorrectas de ≥25 y ≤64, y usa el original de 2010 para la alternativa de alimentos del artículo 87.5. Objeción: aplicar una regla de 2015 por semejanza o llamar nómina a un subpaso inventaría cobertura. Respuesta: fuente histórica, hechos y mínimo compatible explícitos; se conserva el rojo anterior y no se habilita el motor. Coste: concurrencias, RRO-09 y otros contratos completos siguen pendientes. Los reemplazos son candidatos que deben contrarrevisarse.

## D072 — Un contraste fijo no es un validador general

La observación nueva de R22 sobre metadatos y sobres recalculados delimita su script de reproducción. Objeción: un consumidor operativo no puede confiar en los hashes que el propio sobre declara. Respuesta: aquí el ancla es la fuente fijada y revisada externamente; el instrumento solo reproduce esa receta y no recibe confianza ni uso de producción. Coste: desarrollar y revisar otro contrato antes de reutilizarlo como consumidor general. No se abre una corrección ficticia para atribuirle garantías que no ofrece.

## D073 — Completar el flujo por propiedades y contratos de llamada

La continuación editorial se divide entre escalas/mínimos, retenciones/cotizaciones y rentas/actividad. Objeción: un cierre transitivo absoluto repetido por todos los sitios duplica trabajo, mientras tratar cada función como terminal es incompleto. Respuesta: cada lote debe resolver propiedades hasta entradas públicas, constantes o primitivas, y declarar contratos de frontera exactos para composición entre lotes. Una referencia al cuerpo de una función no basta. Coste: componer y revisar las aristas antes de publicar; los 65 sitios y sus recuentos no sustituyen esa prueba ni acreditan aceptación jurídica.

## D074 — Preservar el corte candidato sin presentarlo como actual

V4 se conserva fuera del worktree con pin externo y dos identidades para metadatos saneados: origen y derivado transportado. Objeción: modificar el manifiesto para incluir lo llegado después destruiría su corte, y hashes correctos no prueban que la selección sea exhaustiva. Respuesta: corte R21 fijo, revisión independiente nueva del censo, clases y reconstrucción; los hallazgos posteriores requerirán otra edición. Coste: espacio local adicional y gestión explícita de versiones; ninguna copia en el mismo disco equivale a custodia independiente. Crossa continúa v1 desfasado, sin actualizarlo ni transferir fuera por esta decisión.

## D075 — Aprobar pares exactos sin reescribir identidades

La derivación R23 permite preparar un registro candidato v2 con dos identidades y 264 pares concretos. Objeción: cambiar la grafía del revisor o aceptar por sufijo podría encubrir autorrevisión y extender confianza. Respuesta: conservar originales, cotejar el registro T3 y ambas representaciones, fijar payload y atestación por hash y mantener igualdad estricta en producción. Coste: artefacto derivado adicional y revisión del recorrido completo; el ensayo del auxiliar en scratch no activa confianza ni acepta reglas completas.

## D076 — Un rojo puede conservar una hipótesis refutada

La prueba nueva que esperaba rechazar optional chaining permanece roja. Objeción: tolerar un fallo podría ocultar una regresión. Respuesta: se contrasta la amenaza concreta; el acceso opcional al array const conserva el binding literal y el lector no promete ejecutar JavaScript histórico. No se altera el esperado ni se prohíbe una forma equivalente para anunciar verde. Coste: informar separadamente de esa hipótesis descartada y de los controles válidos del producto; el contrato de ejecución, si se desea, requerirá otro diseño.

## D077 — Conservar un corte y endurecer su consumidor son operaciones distintas

El consumidor v4 exige conjunto exacto, identidades coherentes y unicidad en sobres nuevos. Objeción: rechazar las diez adquisiciones repetidas del corte conocido destruiría restauración sin añadir evidencia. Respuesta: compatibilidad restringida al pin externo completo, con 33 observaciones y 23 registros distintos; ningún manifiesto modificado hereda esa excepción. Se conserva también la política de saneamiento histórica del pin, identificada en el recibo; los nuevos sobres usan la ampliada. Coste: versionar política y consumidor además del formato, sin certificar privacidad universal ni reescribir el paquete.

## D078 — Completar el censo por referencias, no por número de hashes

Las cuatro fuentes oficiales ausentes de v4 siguen en cachés recibidas y sus bytes se han cotejado. Objeción: añadirlas a mano puede ocultar más ausencias, mientras importar todo hash incluiría fixtures y documentación técnica como fiscal. Respuesta: nueva edición con censo tipado ampliado, clases y exclusiones justificadas, manteniendo el corte v4 intacto. Coste: otra exportación/restauración local y revisión; Crossa v1 continúa desfasado y no recibe transferencia implícita.

## D079 — Componer las páginas conservando la dirección y el estado de cada relación

Los tres lotes técnicos están recibidos, pero usan direcciones de arista y formas distintas. Objeción: unir sus JSON por nombre produciría dependencias falsas y haría parecer aceptado el texto todavía candidato. Respuesta: adaptación explícita por propiedad, argumento y condición, con correspondencias a objetos históricos, resolución de fronteras y rechazo de ambigüedades. El ensayo del publicador se prepara en scratch; las revisiones independientes siguen abiertas y no se cambia confianza activa. Coste: un adaptador y revisión posterior de composición/publicación, sin rellenar el resto del inventario con afirmaciones genéricas ni ampliar aceptación jurídica.

Actualización R26 tras recibir los avisos finales R25: la composición queda aplazada por los defectos de rentas/actividad; su implementación no se lanza todavía. El recorrido conjunto de enlaces falla por IDs duplicados entre 264 pares y 102 sujetos. Coste explícito: recibir y reproducir esas entregas, corregir el contrato de multiplicidad sin perder sus condiciones y volver a revisar antes de promover. El candidato Madrid2020 conserva su identidad aunque el consumidor actual no lo admita; no se sustituye por Madrid2022 para obtener un pase.

## D080 — Una ocurrencia y todos sus enlaces exactos

El adaptador agrupa por itemId y conserva cada proposición, ámbito, cita y revisión por payload. Objeción: deduplicar tomando el primer año trasladaría su aceptación a los demás o perdería evidencia. Respuesta: estados por sujeto/revisión/payload, correspondencia completa con aristas normativas y recibo nuevo versión 2; los recibos versión 1 mantienen su cardinalidad histórica. Coste: revisar todos los estados al publicar y mostrar varios en la misma ficha, sin una aceptación agregada. El registro activo no cambia por el ensayo y la corrección necesita una revisión independiente nueva.

Los bytes públicos compartidos se deduplican únicamente por hash, tamaño y MIME; las entidades documentales conservan identidad por binding. Objeción: el límite anterior de 32 nodos truncaría años legítimos. Respuesta: acotar el recorrido por el número de entidades del snapshot y el modelo de cuatro entidades documentales por enlace, más el sujeto. Coste: respuestas más largas pero acotadas, sin un grafo ilimitado ni selección jurídica implícita.

## D081 — Conservar el identificador documental BORM sin admitir queries libres

La segunda ejecución del lote supera la colisión y rechaza la URL BORM que incluye id numérico. Objeción: quitar la query altera la identidad, mientras permitir cualquier query arriesga publicar credenciales. Respuesta: excepción estructural al endpoint HTTPS exacto de anuncios BORM, campos numéricos acotados y fin absoluto; se conservan rechazos de credenciales, dominios distintos, duplicados, fragmentos y parámetros extra. Coste: cada endpoint adicional requiere revisar su contrato; no se modifica el original ni se certifica autenticidad por la URL. El recorrido fallido queda conservado antes del cambio.

## D082 — Mantener el original grande y separar su almacenamiento

El lote completo llega al publicador y falla por el BOE-A-2010-19703 de 42.900.459 bytes, utilizado por 36 enlaces. Objeción: elevar el límite genérico permitiría incorporar originales grandes al repositorio y no resolvería su custodia ni transporte. Respuesta: conservar los bytes y el fallo, mantener la puerta de diez millones para el almacén versionado y preparar un contrato explícito de CAS local externo con resolución por hash. Coste: nueva implementación y revisión de publicación/restauración; el lote de 264 continúa bloqueado. El ensayo de los otros 228 se identifica como subconjunto con exclusiones enumeradas, nunca como cierre global. No se autoriza LFS, gasto, alojamiento ni transferencia externa.

## D083 — Preservar v5 r2 con su entrada exacta y sin ampliar el corte

Se designa el pin final r2 y se conserva fuera de T3 junto al manifiesto anterior que usa su receta. Objeción: la recuperación de un paquete no prueba que su censo sea exhaustivo ni que la colección inicial sea determinista. Respuesta: separar restauración por hash, revisión mecánica r2 y selección candidata R26; mantener las referencias no resueltas y los límites de gramática. Coste: dos copias locales adicionales, entrada histórica y revisión nueva del consumidor/censo. No se presenta la errata «cuatro» como número de herramientas: la lista efectiva contiene cinco. Crossa v1 continúa desfasado y no se actualiza implícitamente.

## D084 — Corregir la identidad del consumo antes de componer

Los rangos de argumento se fijan por llamada AST, las cuatro propiedades constantes pierden una dependencia territorial falsa y las ramas se describen por su condición real. Objeción: un texto coincidente en otro lugar puede referir a otro productor o guardar una relación distinta. Respuesta: conservar separadamente declaración, argumento y propiedad, con hash y rango exactos; la referencia monetaria y la selección de modo se anclan al código que efectivamente las implementa. Coste: una edición candidata separada y revisión independiente de las sustituciones; no modificar la autoría histórica ni afirmar cierre por esos controles.

## D085 — Construir un contrato común de puertos para las páginas

La siguiente implementación compone los 65 sitios mediante propiedades, llamadas, unidades y condiciones, con direcciones explícitas entre lotes. Objeción: pedir un analizador general de causalidad sería una promesa no sustentada, pero unir aristas por nombre generaría relaciones falsas. Respuesta: un subconjunto AST declarado, fronteras y decisiones editoriales revisables, rechazo de referencias incoherentes y cierre por sitio únicamente cuando llega a terminales admitidos. Los desconocidos bloquean ese cierre; valor, selección y admisión se conservan separados. Coste: adaptadores y pruebas discriminantes adicionales antes del wiring, sin modificar el motor fiscal ni heredar aceptación jurídica de la estructura. Las rectificaciones R28 siguen candidatas mientras se revisan en paralelo.

## D086 — La decisión nominal no habilita un período fiscal

Madrid 2020 conserva su identidad y una decisión nominal nueva del padre, derivada de la revisión independiente R27 y de un contraste propio de los originales. Objeción: el manual imprime 53.407,29, mientras la ley imprime 53.407,20; aceptar por coincidencia o trasladar la celda a Madrid 2022 ocultaría el conflicto. Respuesta: conservar ambos documentos, la correspondencia de fila legal a límite del motor y la discrepancia visible. La aceptación se limita a esa proposición nominal, con condiciones, exclusiones, autoría y antecedentes exactos. No altera la decisión histórica ni acepta un binding todavía no revisado. Coste: contrato nominal versionado y revisión nueva del payload y del consumidor; vigencia completa, elegibilidad y autenticidad histórica siguen pendientes. No se convierte nominal-only en selección civil ni siquiera para un caso ordinario de 2020.

## D087 — Distinguir coherencia de un sobre y autorización para servirlo

La hipótesis RS27-H03 conserva un sobre reconstruido que pasa el auxiliar de consistencia en v1 y v2. Objeción: recalcular hashes no debe permitir atribuir una proposición ajena a un binding. Respuesta: el ancla operativa es el snapshot admitido y sus bytes fijados, con evidencia originada por el coordinador; el revisor demuestra rechazo por la ruta y bajo el pin original. El padre contrasta esa frontera en el lector y publicador. No se ha demostrado bypass operativo ni se declara seguridad general. Coste: documentar el límite del auxiliar y conservar el rojo de la hipótesis; no relajar controles, inventar un fix o abrir una revisión recursiva sin un defecto nuevo demostrado.

## D088 — Clasificar la huella antes de heredar la URL contigua

El padre reproduce CL01: selectionSha256 se clasificaba como original-oficial por una URL de documento en la misma fila. Objeción: cambiar la función actual no reclasifica el censo congelado ni convierte su taxonomía en verdad fiscal. Respuesta: priorizar los campos de selección, texto y software, restringir la inferencia documental y versionar la política; conservar v5 r2 y su software por hash. Coste: pruebas y revisión nuevas, con clasificación histórica pendiente y sin prometer exhaustividad, determinismo o privacidad universal.

## D089 — Incorporar CAS externo como mecanismo local candidato

Snapshot v3 conserva descriptores tipados del original grande y su ubicación se configura explícitamente fuera de Git. Objeción: la lectura completa por petición y el límite por objeto no acreditan capacidad de producción ni custodia. Respuesta: preservar los límites internos, verificar bytes e identidad física, declarar Linux y medir recursos en una revisión nueva del recorrido completo. Coste: configuración y restauración explícitas, memoria por lectura y tratamiento separado de publicación visible y durabilidad. No hay despliegue ni transferencia externa y los candidatos no se autoaceptan.

## D090 — Completar la composición por contratos concretos

R28 solo cierra un valor y no cierra admisión. Objeción: otra capa de hashes o una llamada declarada terminal ocultaría dependencias; construir un compilador general excedería el objetivo. Respuesta: continuar con diecisiete sitios de retenciones y cotizaciones, mediante puertos por propiedad, funciones concretas, condiciones, unidades y discriminantes con el motor real. Los otros cuarenta y ocho conservan sus pendientes. Coste: implementación y revisión por grupos; ningún cierre técnico transmite aceptación jurídica ni autoriza wiring público.

## D091 — Versionar las dependencias nominales incorporadas

Seis mutaciones persistentes de módulos/schemas nominales pasan indebidamente el contraste de un snapshot anterior. Objeción: añadir un import sin incluir su fuente en el contrato de software permite cambiar la explicación sin cambiar su versión. Respuesta: conservar las seis pruebas rojas y añadir las rutas exactas a la lista literal que se preserva por snapshot; los históricos siguen leyéndose por su propia lista. Coste: dos snapshots intermedios conservados y una regeneración adicional justificada. No se afirma cierre transitivo universal ni se promueve el binding nominal por esta comprobación técnica.

## D092 — No equiparar origen y software ni documento y recorte

La revisión R30 acredita que sourceSha256 puede identificar JSON editorial o documentos, y que un campo documental dentro de un facsímil no identifica el PNG. Objeción: sustituir una prioridad global por otra puede seguir atribuyendo una clase a bytes distintos o no recuperados. Respuesta: contrato estrecho para el origen explícito, desconocido ante falta de contexto o conflicto, y campo documental antes del ancestro de recorte; el hash genérico no hereda oficialidad por la URL vecina. Se conserva el contexto saneado usado para la inferencia. Coste: más observaciones pendientes y revisión nueva del cambio, sin una taxonomía universal, autenticación ni reclasificación del corte congelado. Los rojos anteriores y los dos límites de privacidad permanecen intactos.

## D093 — Cerrar la forma nominal con el contrato externo

Node rechazará campos adicionales en la referencia de ámbito y en la revisión jurídica aunque se recalculen coherentemente los sobres. Objeción experta: igualdad entre datos controlados por el mismo emisor no acredita su forma permitida. Respuesta: comparar con claves y decisión fijadas, manteniendo el schema cerrado y controles independientes del coordinador. Coste: comprobación explícita adicional, regresiones y nueva versión de explicación; ninguna ampliación de confianza ni selección civil. NR30-01 se conserva rojo antes del fix.

## D094 — Separar cierres de valor, selección y admisión sin declarar terminado el conjunto

R30 no cerró los diecisiete sitios. Se reparte la continuación en once de SS, seis de retenciones/pagos y admisión común anual. Objeción experta: fragmentos aislados pueden omitir condiciones o declarar terminal un servicio opaco. Respuesta: contratos finitos por cuerpo y argumento, fuentes exactas, mutaciones discriminantes e interfaz común; la composición exige todas las obligaciones y revisión independiente. Coste: tres entregas integrables y su composición posterior. No se acepta otro inventario de pendientes como cierre ni se exige un compilador general. Los otros 48 sitios y la explicación completa del inventario siguen en el alcance global.

## D095 — Conservar una evidencia comprimida mayor que el umbral local de recepción

El grafo histórico R30 ocupa 11.243.790 bytes comprimidos, hash b091d72b1c2cbd27358c2c8794897df8b33eef1ba655ab932898ba03068cc697. Se admite por ruta/hash con límite de snapshot de doce MiB exclusivamente para esta recepción. Objeción experta: descartar un artefacto que sustenta la entrega rompería la reproducción; aumentar indiscriminadamente los límites introduciría originales grandes en Git. Respuesta: excepción enumerada, sin cambiar el límite del CAS interno ni el de cien MB remoto. Coste: 10,72 MiB históricos; las nuevas composiciones deben normalizar referencias y evitar duplicar el grafo completo por sitio.

## D096 — Preparar el lote documental tras corroborar el CAS

La revisión independiente y el contraste del padre corroboran el recorrido local de 264 pares/102 sujetos. Se prepara su incorporación revisable con identidades reales, condiciones y aceptaciones limitadas por celda. Objeción experta: un pase técnico no autoriza a cambiar confianza ni aceptar una norma completa. Respuesta: artefactos candidatos exactos, trazabilidad hacia las revisiones ya recibidas y revisión de la incorporación antes de activar; Madrid2020 nominal permanece aparte. Coste: mantener registros candidatos y estados separados; Linux serial, recursos, autenticidad histórica y custodia conservan sus límites. Sin LFS, gasto ni transferencia externa.

## D097 — Revisar la suficiencia del fragmento antes de aceptar sus cierres

Se integra el candidato R32 de retenciones/pagos conservando su declaración de cierre de valor/selección y la admisión pendiente. Objeción experta: reconstruir exactamente una receta y rechazar fuentes distintas no demuestra que la receta incluya todas las dependencias. Respuesta: el padre no acepta todavía esos cierres; un revisor nuevo contrasta campos, instancias de escala, celdas, callbacks y conversiones con el software fijado. Coste: revisión semántica adicional y ausencia de wiring hasta resolverla, sin imponer un compilador universal ni convertir siete rojos de un esqueleto vacío en errores fiscales.

## D098 — Recibir los fragmentos sin aceptar todavía su cierre conjunto

SS y admisión se incorporan como candidatos exactos para revisión independiente; no se conectan al producto. Objeción: cuerpos AST, predicados y un intérprete propio pueden omitir condiciones o atribuir cierre por una igualdad autorreferente. Respuesta: contrastar por propiedad y llamada las once salidas SS y las diecisiete obligaciones de admisión con el motor real y casos nuevos. Coste: composición posterior a las tres revisiones, conservación del rojo tardío de SS y de A32-P01/P02 como asuntos abiertos. No se acepta fiscalidad ni se recorta el alcance de los restantes 48 sitios.

## D099 — Fijar los contenidos del plan sin congelar HEAD para siempre

El preparador R32 rechaza la propia integración porque HEAD avanzó. Objeción: eliminar la igualdad sin otra frontera podría admitir contenidos distintos. Respuesta: exigir ascendencia de la base y conservar los hashes, derivación, identidad, plan y estado físico previo; la escritura sigue restringida al scratch. Los dos fallos previos y los bytes candidatos idénticos quedan comprobados. Coste: dependencia de la historia Git legible y revisión independiente del cambio. La restauración del candidato no activa los registros ni acepta reglas completas.

## D100 — Completar las correspondencias omitidas sin repetir una revisión favorable parcial

R33 corrobora únicamente el campo directo de retenciones soportadas y deja cinco recorridos sin acreditar. Objeción: la representación contiene cuerpos y argumentos reales; afirmar que faltan todos ellos sería incorrecto. Respuesta: conservar lo corroborado y completar los campos/defaults, semillas literales, celdas y selecciones por instancia que aún exigen reinterpretar TS para producir la ficha. El padre reproduce los cuatro rojos contractuales y los cinco controles positivos. Coste: nueva implementación finita y revisión posterior; schema y consumidor deberán representar pendientes sin forzar true. No se altera la fiscalidad ni se confunde permiso estructural del schema con bypass del verificador real.

## D101 — Hacer evaluable la admisión y declarar su dominio

La revisión R34 y el contraste del padre acreditan las rutas y el orden principal, pero no los diecisiete cierres de admisión. Objeción: otro evaluador puede repetir la validación y desincronizarse, mientras los rojos por nombres de campos no imponen una interfaz universal. Respuesta: contrato finito por propiedad con operadores, operandos, instancias, dominio y resultados success/fail/defect; correspondencias explícitas y discriminantes contra las APIs reales. Se preservan los cuerpos y casos útiles, y se corrige en adenda la ambigüedad entre Option exterior y catálogo. Coste: nueva implementación y revisión antes de componer, sin ampliar silenciosamente el dominio JS ni convertir los pagos negativos o strings desconocidos en errores fiscales demostrados.

## D102 — Corregir origen sin atribuir suficiencia al cierre

Los tres localizadores de semilla/bandas SS pasan de coincidencia textual global a declaración y literal únicos, tras rojos concretos. Objeción: arreglar tres referencias puede ocultar que el cierre aún acepta unidades, ramas o transportes incorrectos. Respuesta: conservar ocho rojos semánticos reproducidos y el noveno del valor de semilla; los once cierres siguen sin aceptar para composición. Coste: continuación por propiedad y revisión nueva, manteniendo los 684 casos aritméticos útiles sin convertirlos en validación fiscal.

## D103 — Incorporar solo los 264 enlaces revisados y preparar recuperación local

Tras la revisión independiente R34, el padre coteja decisiones individuales y autoridad real y aprueba el plan exacto por celda/año. Objeción: las dos escrituras pueden quedar parcialmente aplicadas; el pase técnico tampoco acredita una regla completa. Respuesta: diario con extremos fijados, recuperación probada después de cada escritura, rechazo de estados desconocidos y aceptación completa falsa; Madrid 2020 conserva pending. Coste: operación serial local, sin atomicidad dual ni activación de servicio. Se corrige el preparador para admitir el par previo o posterior exactos usando los previos históricos fijados; los pares mixtos requieren recuperación separada.

## D104 — Separar el CAS operativo del paquete congelado y conservar la publicación anterior

Los originales del lote se copian por ambos hashes desde V5 a ubicaciones ordinarias propias, sin escribir en el paquete. Objeción: excluir originales de Git hace incompleta una clonación sin datos. Respuesta: manifiesto por objeto, corte V5 fijado, receta de restauración y CAS externo explícito para el PDF grande. Coste: restauración/configuración local obligatoria; Crossa v1 sigue desfasado y no acredita custodia independiente. El publicador necesita su origen técnico v1: reutilizar v2 produjo una colisión editorial que se conserva; se selecciona el v1 con idéntico inventario/software, sin debilitar el consumidor ni borrar históricos.

## D105 — Continuar componentes parciales sin promover sus booleanos

Retenciones R34 avanza a operadores evaluables y requiere contraste independiente; admisión R35 aporta schema/coherencia y fronteras pero no completa el encargo. Objeción: encadenar entregas parciales y pruebas puede sustituir el resultado pedido por un inventario creciente de pendientes. Respuesta: conservar lo útil, asignar obligaciones completas y verificables por propiedad, exigir ejecución final y mantener pendientes explícitos hasta cumplirlas; abrir también la implementación de los restantes 48 sitios. Coste: trabajo sustantivo adicional y revisión posterior, sin reducir el estándar ni confundir integridad de receta con suficiencia causal.

## D106 — Corroborar la operación local sin extender su aceptación

La revisión R36 no reproduce defectos nuevos en la incorporación y el padre repite sus 26 recuperaciones, nueve estados y tres localizadores. Objeción: un pase favorable podría confundirse con aceptación jurídica, atomicidad dual o cierre de las dependencias. Respuesta: aceptar únicamente el alcance operativo cotejado, conservar Madrid pendiente, aceptación completa falsa y las reservas de concurrencia, apagón y causalidad. No repetir otra revisión favorable del mismo cambio ni regenerar el contenido sin una causa nueva. Coste: seguir exigiendo procedimiento serial, restauración explícita y las cinco implementaciones/revisión pendientes; los GET completos y controles de calidad adicionales se atribuyen al revisor que los ejecutó.

## D107 — Corroborar el valor y selección de retenciones bajo condiciones explícitas

La revisión independiente y el contraste del padre acreditan los seis recorridos fijados mediante operaciones, bindings, fuentes y mutaciones discriminantes por instancia. Objeción: una representación equivalente puede producir valores para un caso que la validación anual rechaza, y un simulador síncrono no sustituye cualquier servicio Effect. Respuesta: corroborar solo valor/selección con paquete previamente verificado, datos ordinarios, primitivas y servicio concretos; probar aparte la incoherencia de ejercicios y mantener admisión, inyección, wiring y aceptación fiscal pendientes. Coste: composición posterior con obligaciones evaluables, actualización y revisión al cambiar las fuentes, sin exigir un compilador universal ni repetir otra revisión favorable de los mismos bytes. El defecto editorial RF33-04 sigue abierto y no se convierte en discrepancia fiscal.

## D108 — Revisar dimensiones y suficiencia del candidato SS por separado de sus cifras

La representación SS R36 reconstruye los once recorridos y reproduce los casos de software. Objeción: la igualdad numérica y el verificador del propio extractor pueden conservar unidades o dependencias incorrectas. Respuesta: integrar como candidato sin wiring y encargar contraste independiente por propiedad, incluyendo cinco anotaciones de `mei` como EUR y los límites de instrumentación. Coste: mantener un consumidor finito adicional y una cota común que bloquea once salidas ante cualquier obligación pendiente, con revisión de dimensiones y composición todavía necesarias. No se acepta fiscalidad ni se corrige una observación propia sin contraste independiente.

## D109 — Integrar programas condicionados con el arnés sometido a las reglas globales

Escalas y rentas aportan operadores ejecutables y fronteras explícitas, manteniendo sus cierres pendientes. Objeción: unos callbacks sintéticos y una configuración de tipos más permisiva pueden dar apariencia de integración completa. Respuesta: comprobar transporte y fuentes, conservar los fallos, adaptar solo el arnés de escalas a tipos/lint globales sin cambiar esperados y encargar dos revisiones nuevas de suficiencia por propiedad. Las fronteras y la admisión no se consideran resueltas por coincidencia de cifras. Coste: mantener consumidores finitos y contratos separados hasta componerlos, más una adaptación del test documentada por hash y diff. La revisión SS recién recibida conserva su lugar en la siguiente recepción; sus conclusiones no se promueven por el resumen.

## D110 — Corregir dimensiones y argumentos con expectativas externas

Las revisiones SS R39 y rentas R40 detectan estructuras mal rotuladas y cuatro colecciones con receptor/callback equivocados. Objeción: el programa numérico pasa aunque su documentación no represente las dependencias correctamente. Respuesta: reproducir 16 rojos externos, clasificar unidades por propietario y llamada, distinguir EffectArray estático de Array nativo y exigir programa numérico idéntico tras el cambio. Coste: contratos finitos y regresiones adicionales, más revisión independiente de estos bytes; no aceptar fiscalidad ni wiring por 438 casos racionales o 41 controles coincidentes. Se preservan cinco diagnósticos checkJs de SS reproducidos también en la versión anterior; tipos principal/vendor y lint permanecen correctos.

## D111 — Declarar las lecturas necesarias antes de componer escalas

El objeto anual intermedio consume más propiedades que las fronteras documentales publicadas. Objeción: los productores reales ya entregan esos campos y una proyección menor podría evitarlos. Respuesta: conservar el recorrido real y ampliar los contratos por propiedad/estado, tras diez rojos; no eliminar lecturas ni modificar el cálculo para simplificar su descripción. Las firmas Effect.fn se obtienen del cuerpo concreto, no de la fábrica. Coste: contratos finitos adicionales y revisión nueva; admisión y semántica completa de errores R40-03 siguen pendientes. La adaptación de una variable del instrumento recibido mantiene el original y sus hashes; no se desactiva el lint global.

## D112 — Corroborar R41 sin encadenar revisiones favorables de los mismos bytes

La revisión independiente corrobora los cinco arreglos documentales SS/rentas y reproduce los rojos anteriores. Objeción: aceptar ese dictamen podría extenderse indebidamente al cierre fiscal o a toda la causalidad. Respuesta: cotejar transporte, productores y conclusiones con las reproducciones propias R41, aceptar solo esas correcciones y mantener condiciones de verificación/admisión, dominio ordinario y checkJs SS incompleto. Coste: futuras composiciones necesitan su propia evidencia; no se repite una revisión favorable sin un cambio o problema nuevo.

## D113 — Corroborar fronteras bajo sus condiciones y conservar el arnés original

La revisión independiente y el contraste del padre acreditan propiedades consumidas y firmas R42, sin nuevo defecto de producto. Objeción: un schema permisivo o callback que ignore argumentos puede aparentar suficiencia. Respuesta: distinguir capas, observar argumentos, probar sustracción y mantener los límites de errores/admisión; adaptar solo el tipo faltante del arnés para tipos globales estrictos, conservando original, diff y equivalencia del AST emitido. Coste: doble identidad documental del test integrado y cierre técnico condicionado, sin repetir otra revisión favorable de los mismos cambios.

## D114 — Componer contratos revisados sin anticipar la admisión

Los cuatro grupos tienen recorridos finitos revisados, pero sus fronteras aún deben conectarse por propiedad, instancia, unidad y condición. Objeción: concatenar 65 fichas o usar callbacks financieros arbitrarios mantendría la dependencia sin resolver. Respuesta: compositor ejecutable con enlaces concretos a programas y primitivas verificadas, errores/admisión como contratos explícitos y puerta pública cerrada mientras falte su revisión. Coste: implementación y contrarrevisión comunes, conservando las 19 instancias y dominios anual/aislado separados, sin modificar fórmulas fiscales ni inventar un compilador universal.

## D115 — Recibir admisión ejecutable sin convertir recibos financieros en aceptación

La continuación R36 representa selectores, adaptador, servicios y propagación final con fronteras financieras por instancia. Objeción: un recibo autodeclarado o sintético puede ocultar dependencia circular y una reconstrucción exacta repetir errores del traductor. Respuesta: integrar como candidato, comprobar software y contratos, mantener cierres falsos y encargar revisión semántica independiente antes de conectar la composición R43. Coste: dos interfaces que deberán conciliarse explícitamente y un consumidor finito adicional; los valores de ensayo, hashes y recuentos no autentican fórmulas ni aceptan fiscalidad. No se altera la base del hijo activo para introducir una entrega aún no revisada.

## D116 — Conservar los puentes sin confundirlos con composición terminada

R43 aporta ejecución entre los cuatro programas, pero reconoce que sus 41 puertos no completan el contrato común. Objeción: recibir otra entrega parcial y contar pruebas puede perpetuar los pendientes en lugar de resolverlos. Respuesta: conservar los bytes y el avance verificado, no aceptar cierres, y encargar una continuación delimitada al contrato ejecutable por propiedad, sus obligaciones transitivas y resultados. La reconstrucción exacta se atribuye a integridad, no a suficiencia; la revisión independiente tendrá lugar sobre el resultado sustantivo completo. Coste: trabajo adicional antes de las explicaciones finales y conexión con admisión, sin modificar el motor ni suplir validación de derechos mediante identidades públicas.

## D117 — Corregir identidad, forma y selección antes de aceptar recibos

Los nueve rojos independientes confirman cinco defectos del candidato de admisión. Objeción: confiar en que la composición posterior entregue valores correctos dejaría insuficientes los contratos de evidencia actuales. Respuesta: codec v2 con propiedades y tipos diferenciados, dominio Array explícito, escala por interfaz, anclas contra AST real y selección del incremento extraída a IR, conservando las cuantías fuera del verificador. Coste: nueva edición documental, incompatibilidad deliberada de recibos antiguos y contrarrevisión antes de conexión; la autenticidad del emisor y la fiscalidad siguen sin acreditarse. Los informes y rojos históricos no se reescriben y los resultados técnicos no cierran admisión.

## D118 — Completar los puertos antes del grafo de cierre común

Dos encargos amplios de composición entregan avances útiles pero incompletos sin bloqueo externo demostrado. Objeción: repetir la misma amplitud mantendría los pendientes y el coste de recepción. Respuesta: conservar normalización y puentes como candidatos, delimitar primero todas sus conexiones ejecutables por propiedad y un router que las ejerza, y resolver después las obligaciones transitivas sobre ese contrato estable. Coste: hitos explícitos adicionales sin reducir el objetivo global de 65 sitios y 19 instancias; no activar admisión ni publicación por completar una etapa. La revisión independiente de los cinco fixes de admisión transcurre por separado.

## D119 — Conservar atributos de constructor y versionar el recibo

La contrarrevisión descubre tres colisiones dentro del dominio anunciado. Objeción: equivalencia monetaria CJS/ESM podría justificar normalizar el constructor entero. Respuesta: conservar presencia, orden y atributos, normalizando solo el valor de los dos constructores reconocidos mediante un marcador tipado; mantener la guardia y los límites frente a funciones externas. Coste: codec v3 incompatible con los recibos v2, que requieren regeneración explícita y nueva revisión del cambio. No convertir identidad en autenticación ni atribuir al defecto una diferencia de cuota no demostrada. A02–A05 permanecen corroborados con el alcance independiente, sin otra revisión repetida de esos mismos arreglos.

## D120 — Corroborar identidad sin confundirla con aceptación de valores

La revisión independiente y el contraste del padre corroboran R47-N01 y compatibilidad v3, sin nuevo defecto reproducido. Objeción: aceptar identidad del recibo podría trasladarse a sus importes o provocar una cadena interminable de revisiones idénticas. Respuesta: cerrar solo el hallazgo técnico, mantener obligaciones financieras y admisión separadas, y avanzar a la contrarrevisión pendiente del módulo de resultados R45. Coste: regeneración explícita de recibos v2 y revisión propia de la composición posterior; no promover confianza ni fiscalidad por hashes o pruebas.

## D121 — Corroborar resultados finitos con su precondición de composición

La revisión independiente y el contraste del padre corroboran los seis bloques de resultados R45 sin nuevo defecto. Objeción: conservar payload y variantes podría aparentar autenticación o cierre del contrato global. Respuesta: mantener originales verificados, datos ordinarios y evaluación síncrona como condiciones, distinguir señal interna de autenticación y avanzar a puertos/obligaciones sin otra revisión favorable idéntica. Coste: verificación de cuatro programas al crear consumidor y discriminación explícita antes de usar valores; las APIs de laboratorio no conceden admisión ni aceptación fiscal.

## D122 — Hacer ejecutables los puertos y revisar su suficiencia antes de componer cierres

El candidato sustituye mapas manuales por un contrato y router de 22 puertos con 24 asociaciones a llamadas. Objeción: reconstruir el mismo esperado y obtener testigos puede repetir defectos del productor o aparentar validación de derechos. Respuesta: conservar correspondencia técnica y precondiciones, contrastar la ejecución con regresiones y encargar una revisión independiente de todas las conexiones, argumentos, selección y variantes. Coste: observadores opcionales en dos intérpretes y dependencias de laboratorio explícitas; el grafo transitivo, la admisión y la aceptación fiscal no se deducen de este hito. Los históricos y el rojo retrospectivo mantienen su identidad y alcance.

## D123 — Conservar el dominio de registros y declarar cada propiedad consumida

La revisión reproduce errores de observación para registros sin prototipo y omisiones de propiedades en tres puertos. Objeción: rechazar esos registros o señalar que las cuotas coinciden reduciría el dominio o dejaría incompleto el contrato documental. Respuesta: serializar sus campos enumerables, validar cadenas sin coerción y completar catálogos, variantes y testigos con pruebas de sustracción y valores reales. Coste: mantener contratos por propiedad y una revisión nueva acotada antes del grafo transitivo; no convertir un arnés privado de rechazo en admisión pública. Las operaciones financieras y los históricos se conservan. Schemas 2020-12 se validan con herramienta compatible, sin rebajar restricciones para reutilizar Ajv v6.

## D124 — Corroborar puertos y avanzar a dependencias transitivas

La revisión independiente R52 y el contraste del padre corroboran N01/N02/N03 bajo condiciones explícitas, sin defecto nuevo reproducido. Objeción: repetir una revisión favorable idéntica retrasaría el grafo, mientras que aceptar los 22 puertos como prueba de cierre global omitiría sus relaciones transitivas. Respuesta: dar por corroborado solo el hito técnico acotado y construir el grafo por propiedad de los 65 sitios y las 19 familias, con obligaciones de valor y selección independientes de la admisión. Coste: mantener pruebas causales y contratos adicionales, además de una revisión propia de ese nuevo hito. La metadata, los testigos y las identidades preadmitidas no conceden aceptación fiscal ni validan derechos.

## D125 — Completar una vertical causal antes de extender el grafo

R53 vuelve a entregar relaciones estáticas sin consumidor causal y sin impedimento externo. Objeción experta: conservar pases estructurales y repetir el mismo encargo amplio no resuelve las carencias; dividir indefinidamente también retrasaría el objetivo. Respuesta: conservar el borrador como diagnóstico pendiente y exigir primero una vertical ejecutable completa de las once salidas SS, con protocolo por invocación/propiedad y evidencia desde entrada hasta origen.decimal. El contrato se revisará y extenderá después a los otros 54 sitios y 19 familias. Coste: integración por etapas y trabajo posterior de extensión, conservando íntegro el objetivo 65/19. Una traza para una entrada no prueba universalmente el programa, y las precondiciones técnicas no conceden admisión o aceptación fiscal.

## D126 — Revisar la semántica causal y comprobar la configuración global

R54 entrega el candidato ejecutado de once salidas SS mediante otro evaluador de primitivas sobre la IR existente. Objeción: el replay compartido puede repetir errores y un chequeo parcial sin plugins puede ocultar incompatibilidades. Respuesta: mantener la entrega original, corregir las condiciones y sobrecargas sin cambiar operaciones financieras, ejecutar tipos globales con Effect y conservar testigos nuevos cuya ejecución coincide salvo los hashes de software. Se habilitan imports TS explícitos bajo noEmit para Node 24; la lectura síncrona documental tiene una excepción local explicada, sin desactivar anti-slop. Coste: segunda semántica finita y resolución propia si se emite JavaScript; once diagnósticos checkJs heredados siguen abiertos. La suficiencia causal tendrá revisión independiente de las once salidas y de los bytes corregidos, con expectativas externas al replay. Ni los testigos ni los 86 pases conceden admisión, aceptación fiscal o cierre universal.

## D127 — Exigir obligaciones satisfechas y separar estructura de valores en los folds

La revisión R55 y el contraste del padre reproducen aceptación directa de una obligación pendiente y dependencias de cinco celdas del lado contrario en cinco salidas. Objeción: proteger solo el adaptador deja API exportadas incoherentes; borrar el receptor del slice podría perder selección necesaria. Respuesta: exigir cierre derivado de fuentes en productor y verificador, conservar receptor y miembros ordenados como identidad estructural, comprobar cardinalidad/orden/valores/semilla/callback y seguir los operandos financieros propios. Coste: verificación estructural adicional, testigos nuevos y contrarrevisión del cambio; la IR finita y el entorno fijo siguen siendo precondiciones. Los rojos y testigos históricos permanecen intactos, y no se modifica el dinero. El replay compartido no concede suficiencia universal, admisión ni aceptación fiscal.

## D128 — Corroborar la vertical SS y extender la evidencia a retenciones

La revisión R56 y su reproducción por el padre corroboran N01/N02 y las once salidas bajo las precondiciones SS. Objeción: otra revisión favorable de los mismos bytes retrasaría la extensión, pero extrapolar identidad estructural a cualquier colección o programa sería injustificado. Respuesta: conservar el alcance condicionado y completar ahora las seis salidas de retenciones/pagos, reutilizando protocolo y primitivas finitas sin duplicar fórmulas; revisar después las nuevas operaciones, invocaciones y selección temporal, con regresiones SS si se extrae un núcleo común. Coste: extensión y revisión propias, posible nueva identidad del software y regeneración explícita de testigos, manteniendo históricos. Un slice aislado y un replay compartido no conceden suficiencia universal, admisión ni fiscalidad. Los otros 48 sitios y 19 familias seguirán después de este hito; no se reduce el objetivo global 65/19.

## D129 — Compartir el evaluador finito y revisar la gramática añadida

R57 implementa seis salidas con un contexto anual común y extrae las primitivas de SS. Objeción: compartir código evita duplicación, pero amplía el impacto de un error y puede aparentar prueba semántica al comparar un replay consigo mismo. Respuesta: conservar fronteras derivadas por dominio, históricos fijados al software, regresiones SS y una contrarrevisión nueva de selección, unidades, colecciones y cada salida, con expectativas externas al replay. El padre versiona el fixture histórico usado por el test nuevo para que no dependa de una caché ajena, preservando sus bytes originales y cambiando solo imports. Coste: núcleo común más contratos específicos, testigos nuevos y revisión de compatibilidad, sin convertir integridad ni muestras en prueba universal. El catálogo R34 descriptivo y la evidencia ejecutada tienen exigencias distintas; admisión, confianza y fiscalidad permanecen separadas.

## D130 — Avanzar a rentas generales con una frontera SS concreta

La contrarrevisión R58 y el contraste del padre corroboran las seis salidas y conservación SS bajo condiciones, sin defecto nuevo. Objeción: repetir revisiones favorables retrasaría el objetivo, pero pasar a veinte salidas de rentas incluyendo cuotas explícitas podría esconder las dependencias de escalas aún sin evidencia causal. Respuesta: completar primero las diez salidas generales y su llamada real a SS usando programas verificados y enlaces por argumento/retorno, sin spies ni importes predeclarados. Las otras diez explícitas, 19 familias y 28 escalas siguen pendientes; se conserva el objetivo 65/19. Coste: nueva composición entre programas y revisión propia antes de ampliar. Las guardas de entrega no se confunden con operandos financieros ni se eliminan para reducir slices; integridad, suficiencia condicionada, admisión y aceptación fiscal siguen separadas.

## D131 — Final explícito en 65 sitios y revisión única por lote

Elies sustituye el objetivo abierto: cerrar técnicamente los 65 sitios o demostrar el bloqueo de los que no puedan cerrarse dentro del alcance. Objeción experta: llamar cierre a una muestra aritmética o saltarse dependencias para alcanzar el contador sería falso; repetir revisiones favorables tampoco aporta evidencia nueva. Respuesta: conservar condiciones por sitio, ejecutar relaciones de productores, revisar una vez cada lote y abrir otra ronda solo ante defecto reproducido. R59 se integra como candidato, no como aceptación fiscal. Se agrupan las 28 escalas por compartir programa y se reservan las diez salidas explícitas para su propio lote; si la salida genérica de actividad exige las 19 familias excluidas, se demostrará exactamente la dependencia sin iniciarlas. Coste: el informe final deberá distinguir sitios corroborados, bloqueos demostrados y trabajos posteriores, con estimación de horas y rondas; composición/admisión/puertas no se ejecutarán. Las ampliaciones históricas incompatibles quedan supersedidas por esta orden.

## D132 — Cerrar rentas generales bajo condiciones sin repetir revisión favorable

La revisión R60 no reproduce defectos funcionales nuevos y aporta 30 casos racionales con Fraction, 300 comparaciones y doce discriminantes. Objeción experta: replay compartido y tipos principales verdes no acreditan universalidad ni tipado integral MJS; omitir los 1.102 diagnósticos checkJs sería sobredeclarar garantías. Respuesta: conservar esa limitación, contrastar en el padre los casos nuevos y cerrar solamente valor/selección causal de diez sitios bajo preadmisión, datos ordinarios y software/runtime fijados. No abrir otra revisión favorable ni arreglar globalmente tipos fuera del hito. Coste: la deuda técnica y mantenimiento de dos semánticas deben aparecer en el informe final y estimaciones posteriores. Los flags públicos/fiscales permanecen falsos. Escalas28 sigue en curso; diez sitios explícitos quedan después, sin emprender familias19, composición global ni admisión.

El padre reproduce las 300 comparaciones y sus comprobaciones estructurales/retorno en 30 entradas. Los doce discriminantes nuevos se inspeccionan con sus resultados independientes; se cancela solo la repetición propia adicional aún esperando el lock, antes de ejecutar. Coste declarado: esos doce no tienen una segunda ejecución del padre; conservan la ejecución del revisor. No había defecto nuevo ni modificación de código que justificase prolongar comprobaciones repetidas.

## D133 — Agrupar escalas y conservar las variantes excluidas como bloqueo

R60 entrega 28 sitios sobre el mismo programa y amplía la gramática del núcleo común. Objeción experta: el replay comparte semántica y seis salidas solo cubren trabajo/pensión; contarlas como liquidaciones universales ocultaría la dependencia de actividad. Respuesta: recibir los bytes sin cambios fiscales, exigir una única revisión independiente por los 28 IDs y conservar la prueba de sensibilidad y el rechazo al productor excluido. Las precondiciones de datos ordinarios, runtime fijo, derechos preadmitidos y servicio normativo concreto permanecen explícitas. Coste: mantenimiento del intérprete finito y de sus contratos, testigos fijados al software y revisión del nuevo alcance; la deuda checkJs no queda resuelta por tipos principales verdes.

Tras la validación de recepción se preparan, en worktrees distintos y con Sol 6.1 high priority explícito, esa revisión y la última implementación de los diez sitios explícitos. La segunda reutiliza el núcleo candidato bajo reserva y no modifica los archivos propios del lote en revisión; cualquier extensión común tendrá regresiones y su única revisión posterior. No se repite la revisión favorable de SS, retenciones o rentas. El coste de trabajar en paralelo es reconciliar cambios mínimos del núcleo si la revisión reproduce un defecto. No se implementan las 19 familias, composición global, admisión ni puertas. Un bloqueo de actividad debe probar la dependencia real; falta de tiempo o una entrega interna parcial no cuenta como bloqueo.

Se conservan las desviaciones de procedimiento del autor y de recepción, con sus logs originales. Los 43 diagnósticos checkJs del host R60 con noImplicitAny desactivado no son comparables con los 1.102 del host estricto R61; no se publica una reducción ficticia de deuda. La recepción global distingue tipos TS principal/vendor de checkJs.

## D134 — Cerrar escalas bajo condiciones y conservar el bloqueo de actividad

La única revisión R62 no reproduce un defecto nuevo y corrobora por separado 22 sitios generales y seis explícitos de trabajo/pensión. Objeción experta: contar seis variantes de actividad como cubiertas o convertir replay en prueba universal ampliaría indebidamente el resultado. Respuesta: aceptar solo causalidad local bajo las condiciones del dictamen; conservar la dependencia de aporte.importeEurosExactos y su sensibilidad como bloqueo de las variantes excluidas. El padre contrasta integridad, anclas y 183 cálculos racionales; no repite la revisión favorable ni las 107 pruebas sobre los mismos bytes. Coste: mantener dos semánticas, software fijado, preadmisión factual externa y revisión de cambios futuros de schemas o servicios. El decoder actual preserva estructura; no se anuncia soporte genérico de transformaciones/defaults.

Ajv del revisor no llegó a ejecutarse; no se le atribuye pase para sus 36 testigos. Los límites checkJs y Effect siguen visibles. El padre cancela solo su comando Fraction aún en cola, verifica que no tenía hijos y lo ejecuta como comprobación ligera de datos pequeños: no ejecuta motor ni intérprete y no compite como trabajo pesado. Quedan diez sitios en la implementación Sol ya activa y su revisión posterior. Las 19 familias, composición global, admisión y cuatro puertas no se inician. Se alcanza 55/65 con corroboración técnica condicionada, sin elevarlo a aceptación fiscal.

## D135 — Recibir los últimos diez sitios y reservar una única revisión

El candidato R62 cubre nueve sitios en trabajo/pensión y demuestra una dependencia de actividad en las familias excluidas. Objeción experta: equiparar un rechazo causal con una ejecución completa o un resultado del decoder con entrada sin transformar podría ocultar operandos y selección. Respuesta: conservar el resultado real del schema en R62, identidad/unidad y llamadas originales del rastro, y exigir dictamen independiente sobre los nueve permitidos y el bloqueo. La frontera editorial se mantiene como identidad explícitamente excluida de wiring. Coste: duplicación de la receta sintáctica, mantenimiento de dos semánticas y deuda de tipos MJS (1.302 diagnósticos en el host estricto del autor, 232 en archivos nuevos). No se amplía el alcance para resolverla en esta sesión.

El padre corrige solo la preparación del arnés: dos ENOENT reproducidos en checkout limpio, creación de carpeta propia en cada prueba, conservación de los rojos y repetición focalizada. Las fórmulas y expectativas permanecen intactas. Una única revisión Sol 6.1 High, priority solicitado, examinará los bytes integrados. Solo un defecto reproducido justificará otra ronda; una revisión favorable llevará al informe final del alcance de 65 sitios o bloqueos. No iniciar familias19, composición, admisión ni puertas.
