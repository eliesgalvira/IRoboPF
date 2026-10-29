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
