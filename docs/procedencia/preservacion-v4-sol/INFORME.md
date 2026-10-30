# Edición local v4 de preservación — candidata

**Referencia única del cierre definitivo: PIN-CIERRE.json y manifest-cierre.json.gz; SHA256 del JSON 938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2. Los otros pins y paquetes se conservan como ensayos intermedios, no designan el corte definitivo v4.**

Corte histórico v4 sobre la base `960773f909d4ecff290edfa3d7a7b2699a8445d3`. El pin anterior identifica exclusivamente esta edición; v5 R26 tiene su propio manifiesto. La preservación técnica no emite atestación ni aceptación fiscal y requiere revisión independiente del paquete exacto.

## Corte y separación de identidades

Se parte del paquete padre .cache/orquestador-preservacion/paquete-v3, solo lectura: 945 objetos y 1.068.593.978 bytes. Se cotejan ambos hashes y tamaño; los marcadores, transporte schema2 y 1.910 referencias de dependencia históricos se conservan sin alterarlos. No se ejecuta collect de v3 ni se modifican v1/v2/v3.

El nuevo formato es irobopf-preservacion-local-v4, edition4, con schema propio cerrado. No se renombra un contrato histórico. El consumidor necesita el SHA256 externo exacto del manifiesto JSON. El índice conserva originales primarios candidatos, capturas secundarias de URLs oficiales y facsímiles; código, contratos, índices de adquisición y recetas son auxiliares en dependencies/. No se tratan como normas ni como evidencia jurídica aceptada.

Las fuentes actuales se leen del árbol versionado de la base exacta, no de la fecha del checkout. Cada dependencia registra SHA256, SHA512 y tamaño de origen y del objeto realmente transportado. Los JSON nuevos se sanean antes del hash: sin cabeceras, redirecciones, localPath ni claves sensibles conocidas; localizadores absolutos sustituidos. Los JSON históricos v3 permanecen exactos con historical:true. Se conservan selectores, textos, páginas, cajas, versiones de motor, DPI/matrices, referencias y recetas. finalUrl:null significa que la fuente no conservaba la URL final; no se inventa a partir de la URL disponible.

## Hallazgos y casos concretos

V4-H01: el censo de 85 posteriores no agotaba el corte. Se usa como control mínimo y se amplía con R20, R19 y R21 mediante sus adquisiciones y citas reales. Los lotes se solapan: no sumar sus tamaños o recuentos como originales distintos.

V4-H02: cropSha256 identifica doce recortes TGSS que un colector limitado a facsimileSha256 perdería. Los recortes se resuelven y conservan con sus citas/recetas. Se preservan también los cinco originales TGSS de las rutas CAS expresamente entregadas en posteriores.json; no se exploran otros checkouts.

V4-H03: b804f042… y e3ae5b8d… son índices CDX de adquisición, no dos PDFs fiscales. Se guardan como dependencias auxiliares con ambas huellas. El control por lotes distingue auxiliar-preservado de objeto-preservado.

V4-H04: el apéndice AEAT 95d7f10a… estaba en una carpeta histórica de revisión de X. Se conserva exclusivamente ese PDF oficial por su hash completo y la adquisición publicable recuperada en editorial-r21. Se excluyen posts, imágenes de X y notas privadas; no se copia ese corpus no oficial.

V4-H05: el primer recorrido se detuvo ante un JSON con claves repetidas. El original no se repara ni se transforma mediante un parser permisivo. El corte registra los metadatos JSON inválidos como exclusiones por ruta/hash. Solo el pin externo final de v4 designa este corte; las colecciones intermedias tienen identidades distintas.

V4-H06: hashes no tipados incluyen código, snapshots, versiones y artefactos excluidos. Las referencias no resueltas no son un recuento de PDFs desaparecidos. cierre-referencias.json comprueba por separado los lotes requeridos y las referencias documentales/facsímiles reconocidas. El corte intermedio excluía un índice mayor de 16 MiB; D08 corrige esa omisión en el corte definitivo. Se mantienen las exclusiones de bytes sin adquisición admisible o clasificación explícita. Las reglas de selección y URLs exactas también quedan fijadas como dependencias.

## Controles y límites

Ocho adversos iniciales correctos; el pase de cierre añade la clasificación secundaria por URL canónica y fechas imposibles. Se conservan 29 controles heredados: diez R21 y diecinueve del transporte previo, con expectativas intactas. Las escrituras temporales se redirigen a caché propia y se conservan residuos. Se comprueban pin y marcador sustituidos, índice duplicado, privacidad recursiva, rutas no portables, ausencia, corrupción, symlinks, destino exclusivo, ausencia de hardlinks y recuperación tras fsync fallido con marcador visible. No se simula un corte eléctrico ni un escritor hostil.

Ruff y mypy comprueban Python propio. mypy usa --check-untyped-defs --follow-imports=skip --ignore-missing-imports; las fronteras JSON dinámicas emplean Any, no es tipado estático estricto integral. Oxlint se ejecuta con --threads=1 --disable-nested-config y se comprueban las 16 reglas a error. No hay TS/Effect nuevo: el diagnóstico de ausencia de archivos TS no se presenta como comprobación de Python.

Integridad, autenticidad, interpretación, número y revisión siguen siendo ejes distintos. No se revalidan PAdES, CSV, confianza histórica ni sellos. No se aceptan signos, vigencias o hechos familiares por preservar sus documentos. Preservar los 17 recortes editoriales no demuestra que cada punto de cálculo los utilice ni acredita la cobertura completa del motor.

Crossa conserva v1 `2df6c208…`, desfasado respecto de v5 R26, en la misma casa y con el mismo propietario; no acredita custodia independiente. Los ensayos v4 son copias locales. Decisiones y costes en `DECISIONES.md`; reproducción en `COMANDOS.md`.

## Corte intermedio conservado (sustituido por el cierre con metadatos completos)

Manifiesto JSON externo: SHA256 3769655129e2d4539ba9d5790bc6b6b4604e7010c8c807be4425b125899a7084, SHA512 a59ef476453d857fb6c5e52ca54370091852dcccfef7cf4621e710f37e685fa3cdcfe51349424e783a0c8be56aee2a27b9175977d0279d6593e75ed3d7d97035,18.386.697 bytes. La copia editorial comprimida manifest-externo.json.gz tiene SHA256 d3ae18ad28c34d2457a6adc511f0dda57ab5be5cfc166e94035754bd8d3d40be y 3.069.659 bytes; no confundir el hash comprimido con el pin exigido por el consumidor.

1.443 objetos /1.133.316.201 bytes: los 945 heredados más 498 nuevos /64.722.223 bytes. Las altas son 23 documentos primarios candidatos y 475 facsímiles; no 23 normas validadas. La clasificación total mantiene los 708 originales candidatos del transporte histórico, 64 primarios candidatos del anexo acumulado, 8 capturas secundarias y 663 facsímiles. Dos CDX adicionales son auxiliares. 6.815 referencias de dependencia,6.546 objetos auxiliares únicos.

Cierre final: cero ausencias en los lotes exigidos y 424 referencias tipadas comprobadas. Los 85 posteriores y las recepciones R19/R20 se cotejan por ambos hashes/tamaño cuando constan; los auxiliares no se recuentan como documentos. Los 17 recortes R21 conservan cita, original y receta, sin nueva interpretación ni rerender masivo.

20.746 referencias hexadecimales no resueltas y 6.410 exclusiones no equivalen a documentos oficiales perdidos. 6.408 corresponden a bytes sin adquisición admisible/referencia de facsímil; una a índice mayor de 16 MiB y otra al fixture adverso histórico revisiones/preservacion/casos/duplicate.json. Se conserva este último intacto con su hash c95605c73d981bf6e6bc44939fe53b7f4cf982bc505603accf693ec1bb4bafc0; no se convierte en JSON válido ni se cambia su esperado.

Ruff y mypy del pase de cierre terminan con código 0, siete fuentes propias. Nueve adversos de edición correctos en el cierre; los 29 heredados son un pase distinto y no se suman como cobertura fiscal. La comprobación adicional de una sola copia del manifiesto para clasificar exclusiones usó el bloqueo de recepción acotada; no se usó ese bloqueo para pruebas, copias o renders.

## Cierre definitivo con metadatos completos

Pin SHA256 del JSON: 938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2; SHA512 63914bcf720a2cb641efcb4c332ab6115312e8b886d401aa1f4ab351597d813c33ecba0014f9cc010b705309e77dd46dd1cd95cfbbca0917be9509fb8b575293; 18386430 bytes. Compresión editorial: SHA256 1284671738df84e1e28fd01f07f2e2432f6e4bb0d4cc357b9a2d6959f76e564f, 3069846 bytes.

Se incluye citas-candidatas.json de retenciones2020–2026 (24.110.694 bytes de fuente), con huellas separadas del derivado saneado. No quedan exclusiones por tamaño. El único JSON inválido excluido sigue siendo el fixture adverso duplicate.json. Los otros 6.408 hashes excluidos no tienen adquisición admisible ni referencia de facsímil; se conservan como referencias/exclusiones, no como documentos oficiales.

Permanecen 1.443 objetos /1.133.316.201 bytes y 498 altas, sin confundir auxiliares con originales. Ahora hay 6.816 referencias de dependencia y 20.745 referencias hexadecimales no resueltas. Cierre: 447 referencias tipadas y los lotes exigidos sin ausencias. El pase definitivo Ruff/mypy termina 0/0.

Destinos definitivos: .cache/preservacion-v4-sol/paquete-v4-final y .cache/preservacion-v4-sol/restauracion-v4-final, dentro de este checkout. Las recepciones y copias intermedias también permanecen. La existencia de ambas copias en ese checkout no acredita transferencia externa ni custodia independiente.

Exportación y restauración definitivas confirmadas por fsync. Cotejo independiente con hashlib: 7991 archivos y 1525761945 bytes por copia, iguales en SHA256/SHA512/tamaño; conjuntos idénticos y sin hardlinks. Los índices de ambos destinos son exactamente el manifiesto externo fijado.

Materializadas las 6.816 rutas auxiliares en .cache/preservacion-v4-sol/metadatos-restaurados, verificadas contra sus huellas. Se comprueban además las nueve fuentes/contratos propios exactos del índice y finalUrl desconocida del apéndice. `fuentes-edicion-comprobadas.json` registra la comprobación de las fuentes contra el pin definitivo.
