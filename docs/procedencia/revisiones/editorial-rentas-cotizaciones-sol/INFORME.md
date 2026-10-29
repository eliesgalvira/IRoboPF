# Revisión independiente del lote de rentas, retenciones y cotizaciones

Dictamen candidato: **requiere cambios antes de adaptar o publicar**. La conservación técnica es reproducible; las referencias por afirmación y el cierre transitivo jurídico siguen abiertos. No se propone cambiar el motor ni promover confianza o aceptación. Cero reglas completas aceptadas. Esta revisión no cierra el BRIEF.

Trabajo personal, sin subdelegación, en gpt-6.1-sol con esfuerzo high según el runtime y el encargo. No se atribuye una comprobación del service tier que el runtime local no expone. HEAD exigido y observado: `7668bdad60a79a8b3ad8e1e1b911f3d6c223692a`. La base histórica del autor sigue siendo `1196269d4e73742beeed35cc05011b70c21a0b69`, snapshot `259584e4c4defcebb069df72a9da5e522c4a13fca51417eb349efaaa1902c608`.

## Alcance y denominadores

La matriz individual conserva las 40 fichas y sus 200 secciones, las 195 hojas con sus cinco secciones y un anexo separado de 130 controles. Son 37 sitios y tres conceptos; las 235 entidades editoriales no equivalen a 235 reglas jurídicas completas. Se conserva una decisión por fila e ID, sin convertir las plantillas de hojas en interpretación aceptada.

`decisiones-40-fichas.json` contiene cada texto examinado, decisión, objeción, respuesta, coste y referencias a bloques primarios. `decisiones-195-hojas.json.gz` identifica cada ruta, símbolo, fuente, unidad, selector anual declarado y vínculo candidato. La decisión jurídica por literal sigue pendiente donde no hay cadena individual cerrada. `anexo-130-controles.json` distingue validaciones informáticas de condiciones materiales. `revision-54-casos.json` recalcula todas las expresiones con racionales desde sus tokens decimales originales, sin importar el evaluador del autor ni pasar por float. `discriminantes-independientes.json` aporta doce recetas adicionales; no se anuncia como ejecución del motor.

La reapertura de los 15 originales coteja tamaño, SHA256 y SHA512. Se reextraen 69 páginas físicas y se reproducen los 15 PNG existentes. No se atribuye inspección visual personal de los 15 PNG ni lectura jurídica íntegra de todos los documentos: la extracción de las 69 páginas es exhaustiva; el juicio semántico se concentra en los pasajes de las afirmaciones asignadas. `pasajes-primarios.json.gz` conserva bloques, coordenadas y texto de cada página; `mapa-afirmaciones-primarias.json` selecciona pasajes específicos por afirmación. La selección automática por token de las hojas es solamente un índice candidato: nunca prueba identidad, vigencia o pertinencia por igualdad numérica.

## Hallazgos nuevos candidatos

### ERSC-01 — Dos referencias textuales no resuelven

En fichas.json, `editorial.anual.trabajo.reduccion.secciones.norma` y `editorial.anual.explicito.actividad.etapa.secciones.derivacion` remiten a `derivaciones.json`, que no existe en el lote. La referencia estructurada apunta correctamente a DERIVACIONES.md; no se debe publicar la contradicción entre las dos instrucciones al lector. Rojo: `test_referencia_derivacion_resoluble`.

Objeción experta: el enlace estructurado permite encontrar el contenido. Respuesta: eso conserva la derivación, pero no hace verdadera la referencia literal de las secciones; se solicita corregir solo el texto por el padre. Coste: revisión del contenido y nueva identidad editorial si se incorpora a un snapshot.

### ERSC-02 — Tope colegial de 500 sin el pasaje reglamentario enlazado

La ficha `editorial.anual.explicito.trabajo.gastos-a-e` declara correctamente que 500 procede del artículo 10 RIRPF, pero enlaza solamente Ley26/2014 pp11–12. Su artículo19.2.d remite al límite reglamentario y no fija 500. La hoja `inv-fbbe5a3501ff2cd423a62bf197bf2e1f` tampoco enlaza ese pasaje: añade páginas de reformas de artículo20. El original reglamentario está disponible entre los 15 reabiertos: `0f6003cfa63f-p17` contiene el límite, con hashes y caja en el mapa. La cadena material es recuperable sin descargar ni sustituir una versión.

También la ficha del íntegro atribuye artículo17 a páginas de reforma de artículos18–20: la mención contextual no transcribe la calificación íntegra que anuncia. Se mantiene pendiente local, sin afirmar que la suma aritmética esté equivocada.

Objeción experta: el autor declara sus enlaces contextuales y pendientes. Respuesta: se respeta esa honestidad; precisamente el lote no satisface aún el vínculo primario por afirmación exigido para publicar. Rojo documental `test_colegio_500_tiene_pasaje_en_citas_ficha`, no defecto del motor. Coste: enlazar las cajas correctas y cerrar su continuidad hasta el ámbito2025.

### ERSC-03 — Separación auxiliar que necesita una excepción material explícita

En controles aparecen `inv-052ac8b7a07f282dd9c3fb7ade0d8261` (grado33 para coherencia de ayuda/movilidad) y `inv-1df2eac53e8332f88fe46ef5a3aae75a` (2015 para admisión de discapacidad activa). El papel uniforme los presenta junto a índices, calendario y precisión. Son condiciones materiales o de vigencia, aunque no sean cuantías fiscales autónomas. La ocurrencia separada33 que sí figura entre las195 hojas no suple el enlace de esta rama de rechazo.

Objeción experta: una condición jurídica puede implementarse como control; excluirla del denominador de cuantías es correcto. Respuesta: se mantiene la separación de denominadores y se pide enlazar estas dos condiciones a su derivación, sin contarlas como dos nuevas reglas aceptadas. El rojo `test_control_33_no_es_solo_auxiliar` expresa este requisito editorial adicional del encargo; **no prueba una infracción del schema original ni un error de cálculo**. Coste: clasificación más precisa del anexo y cierre de ramas, con prioridad menor que una cuota incorrecta.

### ERSC-04 — Afirmaciones2026 y2018 enlazadas solo a una orden2025

Las cuatro fichas MEI/solidaridad explican cuantías2026 pero sus listas de citas solo contienen páginas de PJC178/2025. PJC297/2026 aparece en la prosa, sin original de esa norma entre los15 documentos del lote. La ficha `anual.ss.base` explica el cambio intranual2018, mientras sus seis citas también pertenecen a la orden2025. Las cuentas son coherentes y los tipos pueden ser correctos: el defecto es la cadena de evidencia que pretende sostener esos ámbitos. No basta que el nombre del archivo cubra2012–2026.

Objeción experta: la norma está identificada en la prosa y puede existir en el corpus general. Respuesta: se solicita resolver por ruta literal/hash del manifiesto preservado y citar el pasaje de cada año; no adivinar URL, sustituir versión ni atribuirlo a2025. Rojo representativo `test_2026_mei_tiene_fuente_del_ejercicio`; otras tres fichas y2018 quedan identificadas en la matriz. Coste: más enlaces primarios y comprobación de vigencia, sin ampliar el motor.

### ERSC-05 — Cierre transitivo todavía no entregado

correspondencias.json identifica el intervalo UTF16 de la llamada instrumentada y conserva listas de parámetros de dominio. Declara expresamente que esas listas no son cierre de dependencias por paso. Por ejemplo, el límite500 influye en gastos, neto y artículo20, pero no en la suma del íntegro; `usosCandidatos` lo ofrece también para el íntegro. El vínculo por pertenencia a función no acredita dependencia del resultado concreto.

Objeción experta: el autor no afirma lo contrario. Respuesta: no se acusa una certificación falsa; se registra trabajo requerido por el encargo que todavía impide adaptar con aceptación. Se conserva el índice como candidato y se propone separar dependencia directa, transitiva y mera cohabitación en función. Coste: analizar flujo de datos por sitio, incluyendo selectores y ramas, antes de producir aristas definitivas. No hay un contrato ejecutable existente que permita probar ese cierre con un rojo honesto; no se fabrica uno.

## Juicio semántico y adversos

Artículo19: a–e pueden dejar pérdidas; f tiene su propio tope. Con100 de íntegro y150 de gastos efectivos, f=0 y neto=-50. El perfil general satura y lo declara; el explícito conserva el signo. Colegio y defensa tienen límites distintos; sindicato no hereda500. P para artículo20 excluye f. La reducción no se aplica a una pérdida ni utiliza una base del ahorro saturada como O. Los pasajes de Ley26/2014 p12, Ley6/2018 p78 y las reformas2023/2024 distinguen rama anual de pago de retención. No se infiere vigencia2026 por la rama técnica desde2024.

DA61: servicio laboral/estatutario efectivo no equivale a toda renta calificada de trabajo. Se conservan pensión excluida, bruto de servicios, proporción de cuota y orden tras artículo80; cuota líquida legal, posterior y diferencial son magnitudes distintas. La cuenta255.20 limitada a200 no acredita hechos de elegibilidad. Las páginas46–47 de Ley5/2025 constituyen el primario; no se migra una aprobación anterior.

EDS: la factura base1000,IVA210,H150 aporta1000. RETA se deduce una vez en P y no vuelve en el anual. G es5% con tope2000, distinto del7% extraordinario2023; con cliente único elegido G=0. El30% incluye ordinarios,RETA y amortización:2500+600 sobre10000 ya incumple. El70% usa bases sujetas, no importe retenido. El adicional de artículo32 usa6498, no7302 salarial. Inicio20% limita base a100000, usa primer positivo y siguiente, no reinicia tras pérdidas ni excluye igualdad50% con antiguo empleador. La amortización del ejemplo1000-100-800 tiene saldo100 y cuota90, no gasto190: historia, coeficiente y activo se examinan en el submotor; todos los activos siguen rechazados por conexión anual. No se certifican devengo, justificantes, RETA real, DGT no recuperada ni casos fuera de contrato.

Capital: DA37 fecha adquisición, no venta; las pérdidas no producen exención negativa. Vitalicia comienza2015 y requiere acumulado240000 entre operaciones, plazo y condiciones del contrato: dos previas0 inconsistentes no se vuelven correctas por pasar una función por operación. La proporción reinvertida no implementa compensación ni arrastres; pérdidas precalculadas requieren calificación. Alquiler N=I es una identidad incompleta, no artículo23 completo; el contraste-500/exceso2000 se declara externo. No se concluyen reducciones de vivienda ni normas2026 para contratos sin identificar.

Retenciones: base, cuota, tipo e importe se mantienen separados.1720/18000 produce tipo truncado9.55 e importe1719; CB024=955/100 solo comprueba una constante, así que se añade el discriminante del cociente. El catálogo rechaza2012–2016 y fechas2026 fuera de su ventana, aunque haya originales históricos. No se adopta el trabajo activo2012–2014. Regularización, selección temporal y fechas de pago no se confunden con devengo anual. La estimación opcional y soportadas pueden duplicar el mismo hecho en el perfil general; se declara conciliación externa, no una nueva cuota errónea demostrada.

SS: doce meses uniformes no reconstruyen altas, grupos, mínimos ni TGSS.2018 requiere7/5 y diferencia262.50 respecto de máximo legacy uniforme. Solidaridad por aportación publicada difiere de5/6: con exceso1086 la diferencia empresarial analítica es0.0362. No se convierte en deuda ingresable ni se asigna residual. XML histórico6.87/6.88 y3.26/3.25 no decide redondeo2025; precisión de base, concepto y tramo sigue pendiente. Coste=S+empresa; obrero ya está en bruto. El neto comparado debe restar la misma cuota del mismo modo. No se ejecuta ninguna suite legacy masiva para pretender resolverlo.

Familiares actuales: se descarta acusar de obsoleto el límite «sin familiares» del **perfil explícito**, porque conexion-contrato.ts aún exige `familiaresConDerechoMinimo=ninguno`. El anual general sí tiene derechosMinimos y exclusión de alimentos propios sin mínimo: esa ampliación no se debe borrar ni describir como ausencia global de soporte familiar. El lote debe conservar esta distinción al adaptarse. Objeción: dos APIs similares invitan a extrapolar. Respuesta: fijar función y contrato, no solo año/territorio. Coste: explicitar ambos alcances.

## Propuesta de adaptación sin wiring

`propuesta-mapeo-entidad.json` conserva los40 destinos exactos por id/revision/snapshot y cinco secciones. Entidad requiere `ambito` conocido con desde/hasta,territorio,regimen,baseTemporal,predicadoVersion o desconocido con motivo; una lista de ejercicios vacía no se transforma en un intervalo. Fuente conserva archivo/hash/localizador. Cada derivación común necesitará entidad versionada y arista; cada evidencia necesita Document/Citation/Facsimile con originales y recetas materializados. Las cajas candidatas de esta revisión no tienen PNG recortado propio: no se presentan como nuevos facsímiles aceptados.

Objeción experta: copiar cinco textos podría hacer desaparecer bloqueos y dependencias. Respuesta: preservar interpretacion,contrarrevision,autenticidad pendientes e integridad por comprobar en el destino, y conservar histórico sin retagging. Coste: adaptación posterior y comprobación exacta contra modelo/publicador actuales; no hay wiring, UI ni publicación en esta entrega.

## Integridad, reproducción y límites

`base.json` conserva diff contra la base autor y ausencia de borrados de ese diff. `arbol-head.json.gz` registra lstat/readlink, modo, tamaño y hash de las13422 entradas físicas de HEAD, cotejadas con el OID del blob, sin confiar en índice. Los originales se leen en rutas literales del CAS del padre y los recibos R19 se mantienen intactos. La identidad del inventario actual y sus cifras no se toman como aceptación de este contenido histórico. Madrid sigue pendiente;264 payloads siguen candidatos. No se altera ESTADO,DECISIONES,informes del autor,motor,generadores,confianza o atestaciones.

El verificador del autor se reproduce desde su checkout solo lectura. La copia propia conserva el assert del HEADautor; **única adaptación: destino del archivo resultado-pruebas.json a esta entrega**. Se conserva diff de adaptación. No se anuncia pase integrado del verificador ni se elimina el assert. Los códigos y logs finales determinan el resultado efectivo.

No se ejecutó jj init ni otra mutación VCS. La consulta inicial `jj log -r @` informó ausencia de repositorio JJ y no se intentó inicializarlo. No hay instalaciones globales, servidor,preview,Next build,publicación,PR,gasto,LFS,transferencia o mensaje a terceros. El lock pesado compartido protege lectura masiva,reextracción,renders,pruebas,tipos y lint. Las primeras lecturas textuales pequeñas fueron consultas con cat/sed; no se presentan como procesos pesados serializados. Crossa continúa siendo v1 histórico desfasado del mismo dueño/casa, no custodia independiente. Ninguna limpieza final.

Los nuevos hallazgos son candidatos hasta contraste del padre. Las decisiones pendientes por literal no quedan resueltas por54 cuentas correctas,69 extracciones correctas ni coincidencia con el autor. El manifiesto y el cierre físico se generan al terminar, sin auto incluir el manifiesto en sus entradas.

Ampliación de ERSC-04 al cotejar los bloques: incluso en2025, las dos fichas MEI enlazan p15, pero el artículo16 y sus tipos0.80/0.67/0.13 están en **p16**. Las fichas de solidaridad enlazan p16, que contiene solo el primer tramo; los otros dos continúan en **p17**, ausente de las69 páginas del autor. La referencia a una página completa falla aquí por página equivocada y por continuación omitida, no solo por granularidad. El mapa propio señala MEI enp16 y mantiene los otros tramos pendientes de incorporar como evidencia de las fichas. No se cambian las citas del autor.

Corrección de la reproducción propia: el primer test del tope colegial buscaba `500 euros` y coincidía con el sufijo de `3.500 euros` (discapacidad). Se conserva el log inicial y se exige frontera numérica explícita en la repetición. Esto confirma por qué la coincidencia numérica no acredita un pasaje pertinente. El pasaje reglamentario500 está enp17, continuando la condición de colegiación de p16; el mapa final usa p17. Los primeros lint/tipos propios detectaron imports/variables sin uso y una reutilización de variable de distinta clase; se corrigen solo los instrumentos propios y se conservan esos diagnósticos.

Cierre de comprobaciones propias: Ruff0 y mypy0 en los tres instrumentos nuevos; se conservan los diagnósticos anteriores. Las16 reglas anti-slop siguen aerror. Los cuatro contratos documentales terminan1 con cuatro fallos deliberadamente preservados. Las54 expresiones racionales y los doce discriminantes coinciden con sus resultados exactos. El verificador histórico del autor termina0 con adaptación exclusiva del destino de salida. El recotejo del recibo integrado confirma los45 archivos del lote. Ninguno de esos pases cambia los estados de interpretación ni cierra los pendientes jurídicos de las195 hojas.
