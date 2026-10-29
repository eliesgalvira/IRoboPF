# Edición local v4 de preservación — candidata

**Referencia única del cierre definitivo: PIN-CIERRE.json y manifest-cierre.json.gz; SHA256 del JSON 938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2. Los otros pins y paquetes se conservan como ensayos intermedios, no designan la entrega actual.**

Trabajo personal en el checkout T3 t3-06f31ede, runtime gpt-6.1-sol con esfuerzo high, sin subdelegación ni mutaciones VCS. Base exigida: 960773f909d4ecff290edfa3d7a7b2699a8445d3. No se emite atestación, aprobación propia ni aceptación fiscal. Esta edición necesita revisión independiente nueva antes de respaldarla como paquete actualizado.

## Corte y separación de identidades

Se parte del paquete padre .cache/orquestador-preservacion/paquete-v3, solo lectura: 945 objetos y 1.068.593.978 bytes. Se cotejan ambos hashes y tamaño; los marcadores, transporte schema2 y 1.910 referencias de dependencia históricos se conservan sin alterarlos. No se ejecuta collect de v3 ni se modifican v1/v2/v3.

El nuevo formato es irobopf-preservacion-local-v4, edition4, con schema propio cerrado. No se renombra un contrato histórico. El consumidor necesita el SHA256 externo exacto del manifiesto JSON. El índice conserva originales primarios candidatos, capturas secundarias de URLs oficiales y facsímiles; código, contratos, índices de adquisición y recetas son auxiliares en dependencies/. No se tratan como normas ni como evidencia jurídica aceptada.

Las fuentes actuales se leen del árbol versionado de la base exacta, no de la fecha del checkout. Cada dependencia registra SHA256, SHA512 y tamaño de origen y del objeto realmente transportado. Los JSON nuevos se sanean antes del hash: sin cabeceras, redirecciones, localPath ni claves sensibles conocidas; localizadores absolutos sustituidos. Los JSON históricos v3 permanecen exactos con historical:true. Se conservan selectores, textos, páginas, cajas, versiones de motor, DPI/matrices, referencias y recetas. finalUrl:null significa que la fuente no conservaba la URL final; no se inventa a partir de la URL disponible.

## Hallazgos y casos concretos

V4-H01: el censo de 85 posteriores no agotaba el corte. Se usa como control mínimo y se amplía con R20, R19 y R21 mediante sus adquisiciones y citas reales. Los lotes se solapan: no sumar sus tamaños o recuentos como originales distintos.

V4-H02: cropSha256 identifica doce recortes TGSS que un colector limitado a facsimileSha256 perdería. Los recortes se resuelven y conservan con sus citas/recetas. Se preservan también los cinco originales TGSS de las rutas CAS expresamente entregadas en posteriores.json; no se exploran otros checkouts.

V4-H03: b804f042… y e3ae5b8d… son índices CDX de adquisición, no dos PDFs fiscales. Se guardan como dependencias auxiliares con ambas huellas. El control por lotes distingue auxiliar-preservado de objeto-preservado.

V4-H04: el apéndice AEAT 95d7f10a… estaba en una carpeta histórica de revisión de X. Se conserva exclusivamente ese PDF oficial por su hash completo y la adquisición publicable recuperada en editorial-r21. Se excluyen posts, imágenes de X y notas privadas; no se copia ese corpus no oficial.

V4-H05: el primer recorrido se detuvo ante un JSON con claves repetidas. El original no se repara ni se transforma mediante un parser permisivo. El corte registra los metadatos JSON inválidos como exclusiones por ruta/hash. Los errores, recepciones parciales y colecciones intermedias se conservan; solo el pin externo final designa el paquete entregado.

V4-H06: hashes no tipados incluyen código, snapshots, versiones y artefactos excluidos. Las referencias no resueltas no son un recuento de PDFs desaparecidos. cierre-referencias.json comprueba por separado los lotes requeridos y las referencias documentales/facsímiles reconocidas. El corte intermedio excluía un índice mayor de16MiB; D08 corrige esa omisión en el corte definitivo. Se mantienen las exclusiones de bytes sin adquisición admisible o clasificación explícita. Las reglas de selección y URLs exactas también quedan fijadas como dependencias.

## Controles y límites

Ocho adversos iniciales correctos; el pase de cierre añade la clasificación secundaria por URL canónica y fechas imposibles. Se conservan 29 controles heredados: diez R21 y diecinueve del transporte previo, con expectativas intactas. Las escrituras temporales se redirigen a caché propia y se conservan residuos. Se comprueban pin y marcador sustituidos, índice duplicado, privacidad recursiva, rutas no portables, ausencia, corrupción, symlinks, destino exclusivo, ausencia de hardlinks y recuperación tras fsync fallido con marcador visible. No se simula un corte eléctrico ni un escritor hostil.

Ruff y mypy se ejecutan sobre Python propio; logs iniciales y finales separados. mypy usa --check-untyped-defs --follow-imports=skip --ignore-missing-imports; las fronteras JSON dinámicas emplean Any, no es tipado estático estricto integral. Oxlint se ejecuta con --threads=1 --disable-nested-config y se comprueban las16 reglas a error. No hay TS/Effect nuevo: el diagnóstico de ausencia de archivos TS no se presenta como comprobación de Python.

El primer intento oxlint no resolvía @oxlint/plugins porque este checkout no tiene node_modules. La configuración temporal conserva las reglas y apunta a los mismos plugins del padre, solo lectura. Nix y uv proporcionan herramientas; UV_PROJECT_ENVIRONMENT es absoluto dentro de caché propia. Sin entorno en tools/procedencia/.venv. Un trabajador y bloqueo pesado común para recorridos, copias, suites y tipos. La comprobación física inicial releyó14537 entradas de base mediante lstat/readlink y git cat-file, un blob por vez, con bytes exactos y sin borrados.

Integridad, autenticidad, interpretación, número y revisión siguen siendo ejes distintos. No se revalidan PAdES, CSV, confianza histórica ni sellos. No se aceptan signos, vigencias o hechos familiares por preservar sus documentos. Familia/TGSS mantienen reservas; julio y doble600 no quedan resueltos. Los17 recortes editoriales nuevos no cierran el wiring ni toda la cobertura del motor.

Inventario intacto 30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7 y artefacto59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7;52.461 ocurrencias,65 sitios. Snapshots de publicación V1 a257e37f24d5a8c2f9306d64b1b706c658de067e501128652db550a7e485280f y V2 082bfc98eb13469b45e456a3d6cc65ebe811a748c1535d606efc3b06e78370ad:719 objetos y34 snapshots, no cifras del paquete de preservación. Madrid e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258 permanece pendiente;264 payloads candidatos sin promoción. Aceptación completa false.

Crossa conserva v1 2df6c208… desfasado, misma casa y propietario, sin custodia independiente o remota; no se toca. No hay red documental, LFS, gasto, transferencia externa, PR, deploy, servidor, preview, rediseño ni limpieza. Las copias locales deben conservarse hasta recepción del padre fuera de T3. Decisiones con objeción experta, respuesta y coste en DECISIONES.md; comandos en COMANDOS.md.

Incidencia de herramientas: el primer Ruff creó .ruff_cache en la raíz del checkout, fuera de las carpetas asignadas. Se conservó íntegra trasladándola mediante rutas absolutas a .cache/preservacion-v4-sol/ruff-cache-conservada; las repeticiones fijan RUFF_CACHE_DIR en caché propia. No se borraron archivos ni se movió material de otros autores. Esta incidencia no se presenta como cumplimiento inicial de la restricción de escritura.

Oxlint sobre la carpeta nueva termina con código1 porque no contiene archivos de un lenguaje soportado; se conserva ese resultado, no se anuncia lint TS verde del alcance. La configuración sí confirma16 reglas a error. Se ejecuta además un humo de carga sobre lib/formato.ts intacto para comprobar que los plugins resuelven; Ruff/mypy siguen siendo los controles del código Python de esta edición.

## Corte intermedio conservado (sustituido por el cierre con metadatos completos)

Manifiesto JSON externo: SHA256 3769655129e2d4539ba9d5790bc6b6b4604e7010c8c807be4425b125899a7084, SHA512 a59ef476453d857fb6c5e52ca54370091852dcccfef7cf4621e710f37e685fa3cdcfe51349424e783a0c8be56aee2a27b9175977d0279d6593e75ed3d7d97035,18.386.697 bytes. La copia editorial comprimida manifest-externo.json.gz tiene SHA256 d3ae18ad28c34d2457a6adc511f0dda57ab5be5cfc166e94035754bd8d3d40be y3.069.659 bytes; no confundir el hash comprimido con el pin exigido por el consumidor.

1.443 objetos /1.133.316.201 bytes: los945 heredados más498 nuevos /64.722.223 bytes. Las altas son23 documentos primarios candidatos y475 facsímiles; no23 normas validadas. La clasificación total mantiene los708 originales candidatos del transporte histórico,64 primarios candidatos del anexo acumulado,8 capturas secundarias y663 facsímiles. Dos CDX adicionales son auxiliares.6.815 referencias de dependencia,6.546 objetos auxiliares únicos.

Cierre final: cero ausencias en los lotes exigidos y424 referencias tipadas comprobadas. Los85 posteriores y las recepciones R19/R20 se cotejan por ambos hashes/tamaño cuando constan; los auxiliares no se recuentan como documentos. Los17 recortes R21 conservan cita, original y receta, sin nueva interpretación ni rerender masivo.

20.746 referencias hexadecimales no resueltas y6.410 exclusiones no equivalen a documentos oficiales perdidos.6.408 corresponden a bytes sin adquisición admisible/referencia de facsímil; una a índice mayor de16MiB y otra al fixture adverso histórico revisiones/preservacion/casos/duplicate.json. Se conserva este último intacto con su hash c95605c73d981bf6e6bc44939fe53b7f4cf982bc505603accf693ec1bb4bafc0; no se convierte en JSON válido ni se cambia su esperado.

Ruff y mypy del pase de cierre terminan con código0, siete fuentes propias. Nueve adversos de edición correctos en el cierre; los29 heredados son un pase distinto y no se suman como cobertura fiscal. La comprobación adicional de una sola copia del manifiesto para clasificar exclusiones usó el bloqueo de recepción acotada; no se usó ese bloqueo para pruebas, copias o renders.

## Cierre definitivo con metadatos completos

Pin SHA256 del JSON: 938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2; SHA512 63914bcf720a2cb641efcb4c332ab6115312e8b886d401aa1f4ab351597d813c33ecba0014f9cc010b705309e77dd46dd1cd95cfbbca0917be9509fb8b575293; 18386430 bytes. Compresión editorial: SHA256 1284671738df84e1e28fd01f07f2e2432f6e4bb0d4cc357b9a2d6959f76e564f, 3069846 bytes.

Se incluye citas-candidatas.json de retenciones2020–2026 (24.110.694 bytes de fuente), con huellas separadas del derivado saneado. No quedan exclusiones por tamaño. El único JSON inválido excluido sigue siendo el fixture adverso duplicate.json. Los otros6.408 hashes excluidos no tienen adquisición admisible ni referencia de facsímil; se conservan como referencias/exclusiones, no como documentos oficiales.

Permanecen1.443 objetos /1.133.316.201 bytes y498 altas, sin confundir auxiliares con originales. Ahora hay6.816 referencias de dependencia y20.745 referencias hexadecimales no resueltas. Cierre:447 referencias tipadas y los lotes exigidos sin ausencias. El pase definitivo Ruff/mypy termina0/0.

La comprobación de fuentes sobre el corte intermedio se detuvo correctamente al detectar cobertura.py cambiado mientras se ampliaba el cierre; materializacion.log conserva ese rojo. La validación definitiva exige las fuentes exactas del nuevo pin, incluido el índice grande, antes de cualquier exportación. No se cambia el esperado ni se da por buena la versión anterior.

Destinos definitivos: .cache/preservacion-v4-sol/paquete-v4-final y .cache/preservacion-v4-sol/restauracion-v4-final, dentro de este checkout. Las recepciones y copias intermedias también permanecen. Conservar todo hasta recepción del padre fuera de T3; no se ha transferido externamente.

Exportación y restauración definitivas confirmadas por fsync. Cotejo independiente con hashlib: 7991 archivos y 1525761945 bytes por copia, iguales en SHA256/SHA512/tamaño; conjuntos idénticos y sin hardlinks. Los índices de ambos destinos son exactamente el manifiesto externo fijado.

Materializadas las6.816 rutas auxiliares en .cache/preservacion-v4-sol/metadatos-restaurados, verificadas contra sus huellas. Se comprueban además las nueve fuentes/contratos propios exactos del índice y finalUrl desconocida del apéndice. El primer intento del instrumento temporal usaba por error manifest-externo.json intermedio; el rechazo del pin está conservado en materializacion-final.log. Tras corregir exclusivamente la ruta temporal, materializacion-corregida.log y fuentes-edicion-comprobadas.json confirman el pase. No se alteraron paquetes, fuentes ni expectativas para satisfacerlo.

Humo anti-slop sobre lib/formato.ts intacto termina0; el intento sobre la carpeta Python sigue registrado con código1 por no tener TS soportado. Este humo no sustituye Ruff/mypy. El cotejo físico final y la entrega se generan después de cerrar todos los logs y este informe: arbol-cierre.json.gz, MANIFIESTO.json, binarios.json y entrega.patch.gz. MANIFIESTO excluye su propia huella por circularidad; el patch excluye manifiesto, binarios.json y el propio patch. Los binarios comprimidos se entregan por ruta/hash y los originales PDF/PNG permanecen en caché, fuera de Git.
