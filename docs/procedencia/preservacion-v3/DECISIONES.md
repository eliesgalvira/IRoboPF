# Decisiones de esta ampliación

## PV3-D01 — Sobre de ampliación, no schema 3 ficticio

Objeción del experto: el schema 2 solo admite `original-oficial-candidato`; cambiarle el número o meter capturas secundarias con esa clase falsearía el contrato. Respuesta: `manifest.json` es un sobre `irobopf-ampliacion-local`, formatVersion 1, edition 3. `transporte-v2.json` sigue validando con el schema 2 intacto y transporta los 708 objetos anteriores. El anexo tiene clases separadas y usa las primitivas actuales de integridad/publicación. Coste: hace falta el recolector para verificar/restaurar el conjunto; la CLI anterior por sí sola solo verifica el subconjunto v2. El sobre nuevo no tiene todavía un JSON Schema independiente cerrado; consume el manifiesto fijado editorialmente y aplica controles de huellas, rutas, clases, adquisiciones y fechas. Requiere contrarrevisión nueva.

## PV3-D02 — Inventario por manifiestos y recibos, con deduplicación

Objeción: limitarse a los 21 objetos estatales perdería AEAT y TGSS; llamar originales a PNG confunde evidencia y derivación. Respuesta: recorrido de los documentos de la base Git fijada, recibos r11/r13 y raíces CAS autorizadas; unión por SHA256 con comprobación SHA512/tamaño. Se incluyen los facsímiles localizados y explícitamente referenciados como tales. Coste: quedan objetos sin adquisición y referencias hexadecimales sin tipo; se entregan en matriz, no se convierten en documentos aceptados. No se afirma cierre universal de todas las recetas ni inclusión de todos los PNG de cada investigación.

## PV3-D03 — Nuevas URLs documentales y saneamiento

Objeción: la allowlist previa omitía XML del BOE, endpoints TGSS y capturas de archivo web; admitir cualquier URL abriría datos de sesión. Respuesta: ampliación local del clasificador para esos espacios, sin cambiar preservacion_urls.py. El sobre conserva campos permitidos de adquisición y referencias al documento fuente, sin cookies ni cabeceras HTTP. Las capturas del archivo solo se clasifican secundarias para rutas estáticas AEAT. Coste: política adicional que revisar; metadatos fuente versionados se conservan como dependencias históricas, sin pretender anonimización semántica de todos los documentos. El dato temporal sigue siendo declarado por la adquisición, no sello de tiempo confiado.

## PV3-D04 — Copias nuevas y recuperación sin borrar

Objeción: multiplicar copias locales no acredita custodia independiente ni resistencia a corte eléctrico. Respuesta: exportación y restauración completas en destinos autorizados inexistentes, objetos por copia sin hardlinks, staging identificado y marcador final exclusivo; fsync y confirmación posterior. Ensayos de corrupción, ausencia y fallo tras publicar el marcador solo en scratch propio, conservando los residuos. Coste: unos 2,4 GB locales con dependencias, IO de verificación y ausencia de garantía frente a escritor hostil o hardware que incumpla fsync. No se reparan paquetes compartidos.

## PV3-D05 — Referencias históricas y no oficiales

Objeción: ignorar hashes no resueltos ocultaría pérdidas; preservar todo lo que parece hash copiaría fixtures, ejecución y material privado. Respuesta: exclusiones explícitas, sin recorrer node_modules/builds y sin copiar cuerpos de X. El manifiesto público de entrega de X se usa únicamente para enumerar hashes excluidos como evidencia pública no oficial. Se preservan los metadatos v2 dentro del transporte, pero no se reconstruyen bytes históricos de dependencias que hayan cambiado. Coste: el paquete de originales no restaura toda la aplicación ni el estado histórico completo del repositorio.

## PV3-D06 — Dimensiones y revisión

Objeción: coincidir hashes puede producir una apariencia de certificación jurídica. Respuesta: integridad comprobada; autenticidad no certificada; interpretación sin revisión nueva; exactitud fiscal no evaluada; aceptación ninguna. Coste: los candidatos no habilitan reglas ni trasladan atestaciones. Crossa conserva v1 histórico comunicado por el coordinador, misma casa/dueño, sin comprobación propia aquí ni custodia independiente. Queda desfasada respecto de v2 y v3; no se modifica. Se mantiene la elección de Elies de preparar sin transferir, sin red documental, LFS ni gasto.
