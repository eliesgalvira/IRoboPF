# Recuperación de originales de retenciones, 2012–2016

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Base examinada: `eaed990c620b5fc4d3ff2e74dc68e0c8481c43db`. Investigación documental candidata que requiere revisión independiente; no constituye aceptación fiscal.

## Resultado y distinciones

Se recuperan los bitstreams PDF de siete algoritmos atribuidos a la AEAT desde capturas de sus URLs históricas: enero y febrero de 2012, 2013, 2014, revisión de enero y revisión de julio de 2015, y 2016. Son **capturas secundarias conservadas por Internet Archive**, no descargas actuales del emisor. La ayuda de retenciones 2016 y el cuadro de tipos 2015–2016 sí se obtienen de servidores actuales AEAT. La ayuda y el cuadro son apoyo, no sustituyen al documento técnico.

`fuentes.json` conserva cada PDF, todas sus adquisiciones, SHA-256, SHA-512, tamaño, MIME, fechas HTTP y de recuperación, portada, clasificación, resultado limitado de firmas y correspondencia con el digest CDX. `adquisicion.jsonl` conserva las consultas, errores y redirecciones saneadas. Las fechas de captura, publicación, revisión técnica y efectos fiscales son dimensiones diferentes. La cabecera HTTP Last-Modified tampoco demuestra vigencia.

Los hashes comprueban integridad de estos bytes. La correspondencia SHA-1 base32 con CDX comprueba que la recuperación corresponde al contenido que el índice atribuye a la captura; no certifica por sí sola al emisor, el momento original de publicación ni la integridad histórica del archivo. Se calculan SHA-256 y SHA-512 para la entrega; SHA-1 solo coteja el índice externo. No se interpreta el tamaño CDX como tamaño PDF: corresponde al registro archivado comprimido.

La copia editorial de enero 2015 y la captura de la URL AEAT tienen el mismo SHA-256 `218d9a988b286cba1b0fee0f40b32eb03eac44bf65b92620098b0edca51a0634`. Esta igualdad corrobora identidad de bytes entre ambas adquisiciones; no crea una segunda autoridad fiscal ni una firma. La editorial se usa como pista y contraste de identidad, nunca como fundamento normativo autónomo.

## Ruta de descubrimiento reproducible

Las rutas migradas y los nombres ensayados anteriormente daban 404. Buscar solo el nombre con comodín en medio de la URL CDX devolvió una lista vacía; consultar la URL histórica **exacta** sí devolvió capturas. La consulta de prefijo 2015 respondió 503 después de los reintentos acotados. Ninguno de esos resultados demuestra inexistencia absoluta.

Los índices archivados de ejercicios 2012 y 2015 se recuperaron por CDX y replay `id_`. El índice 2012 enlaza expresamente `ALGORITMO2012.pdf`, válido hasta enero, y `ALGORITMO2012FEBRERO.pdf`, a partir de febrero. El índice 2015 separa hasta 11 de julio, o en su caso 31 de julio, y desde 12 de julio, o en su caso 1 de agosto. La segunda rama conduce a Información técnica y al nombre `2015/RD_julio/ALGORITMO_2015_12_JULIO.pdf`, que no se deduce correctamente probando solo `ALGORITMO2015.pdf`.

La página técnica archivada anuncia una revisión de 14/07/2015 y corrección de cálculos de regularización. El documento de enero anuncia revisión de 14/01/2015 en gastos de trabajadores activos con discapacidad. **No se equiparan esas revisiones técnicas a nuevas fechas de entrada en vigor.** Quedan pendientes los bytes de las versiones previas a esas correcciones y cualquier revisión adicional no devuelta por los índices acotados.

Se conserva también la nota informativa 2015 enlazada por el índice. Las consultas actuales al BOE sirven para localizar originales y relaciones de análisis. Se descarta como apoyo pertinente la ficha `BOE-A-2014-12731`, solicitada inicialmente por error: el RD 1003/2014 es `BOE-A-2014-12730`. El intento de descargar Ley 22/2013 excedió el límite de 12 MB o duración del descargador; ese fallo no significa que falte el documento en BOE. Su original ya estaba identificado en la auditoría previa y su ficha actual se conserva como índice, sin presentarla como un nuevo PDF descargado.

## Motor actual y referencia 2020

La lectura del código de esta base corrige una premisa histórica: el motor canónico **rechaza 2012–2016**, porque su catálogo comienza en 2017. No sigue ejecutando silenciosamente para esos años el procedimiento moderno descrito en la primera auditoría. El modo compatible-legacy permanece separado. Se fijan los hashes del catálogo y del servicio en el manifiesto de fuentes de código.

La referencia 2020 es una comparación documental y de código, no un oracle ejecutado por este análisis. Su reducción selecciona 5.565/13.115/1,5 y la escala permanente alcanza 45 %. No se trasladan esos valores a los originales anteriores. La matriz mantiene veinte pasos por versión, candidatos de localización y carencias; no cuenta sus filas como reglas comprobadas. Incluso cuando una tabla coincide, el contrato de comunicación, previsión anual, elegibilidad y regularización permanece por contrastar.

No se cambia ningún cálculo ni oracle. Por ello no hay un fix numérico ni una prueba roja previa a un fix que entregar. La comparación numérica exhaustiva, las fronteras y la ejecución contra motor/Excel no se han realizado y no se anuncian verdes. Incorporar nuevos documentos al catálogo requiere otra tarea autorizada, revisión y pruebas independientes.

## Apoyo BOE y alcance jurídico

Se conservan los originales del RD 1788/2010, RDL 20/2011, RD 1003/2014, RDL 9/2015, RD 633/2015 y la corrección BOE-A-2009-21164, además de los originales complementarios listados en fuentes. El apoyo se diferencia de los algoritmos AEAT. Las fichas actuales no sustituyen las redacciones históricas ni acreditan una cadena completa de vigencia.

RD 1788/2010 y RDL 20/2011 permiten examinar escala previa, gravamen complementario y excepción de enero de 2012. La prórroga de 2014 requiere la Ley 22/2013: no basta copiar 2013. RD 1003/2014 suprime el artículo 85 bis, modifica la escala y añade disposiciones transitorias; deben conservarse por separado el régimen permanente y el de 2015, incluida movilidad geográfica. RDL 9/2015 cambia la escala desde 12 de julio con opción transitoria de regularización desde agosto. No se confunde esa opción con una libertad general de escoger algoritmo. RD 633/2015 aporta modificaciones reglamentarias; las remisiones y fechas necesitan revisión por paso.

La corrección de 2009 rectifica título y referencia gramatical al artículo 80 bis; no se usa como supresión del procedimiento histórico. En el análisis actual del RDL 9/2015 aparece una derogación relativa al artículo 7 y período 2013–2018: no se extrapola a la escala de retenciones del artículo 1. No se afirma haber agotado todas las derogaciones, correcciones y criterios vinculantes.

## Decisiones, objeciones y coste

- Recuperar capturas secundarias sin promoverlas a originales autenticados. Objeción experta: una URL del emisor embebida en Wayback no es autenticación del documento. Respuesta: conservar CDX, replay, redirecciones y bytes; mantener autenticidad no certificada. Coste: la carencia de descarga actual del emisor sigue visible.
- Conservar revisiones técnicas por separado de efectos legales. Objeción: la fecha de portada puede ser una corrección retrospectiva. Respuesta: no generar intervalos de vigencia solo desde la portada. Coste: matriz de variantes y tarea posterior de interpretación.
- Extraer páginas completas con geometría y render a 72 dpi. Objeción: texto extraído puede perder glifos, tachados y estructura de tabla. Respuesta: conservar cita literal y facsímil contextual, sin normalizar números ni validar bindings. Coste: citas amplias y revisión visual pendiente para parte de ellas.
- Mantener rechazados los ejercicios en el motor. Objeción: recuperar un PDF no acredita haber implementado todas sus ramas. Respuesta: ninguna promoción de registros ni atestaciones. Coste: no se amplía todavía la funcionalidad.
- Acotar descargas y respetar el lock pesado. Objeción: una búsqueda limitada no prueba inexistencia. Respuesta: registrar consulta y respuesta concreta, y listar próximos bloqueos. Coste: esperas y revisiones anteriores aún sin recuperar.

## Reproducción, controles y límites operativos

Adquisición con `bash tools/procedencia/run.sh .cache/procedencia/retenciones-originales-2012-2016/adquirir.py URL...`, descargador del proyecto, UA IRoboPF, TLS activo, límite de 12 MB, máximo tres intentos y pausas. Sin cookies ni credenciales en metadatos. Las invocaciones Nix crearon TMPDIR distintos, por lo que sus locks internos de descarga no son un lock común entre shells; cada lote fue secuencial, pero hubo solapamiento entre algunos lotes. No se afirma serialización global de toda la adquisición. Para repetir globalmente serializado, envolver el lote completo en un único flock de adquisición.

Extracción y verificación: `flock /tmp/irobopf-validacion-pesada.lock env UV_PROJECT_ENVIRONMENT="$PWD/.cache/procedencia/retenciones-originales-2012-2016/venv" bash tools/procedencia/run.sh docs/procedencia/auditorias/retenciones-originales-2012-2016/evidencia.py`, seguido del mismo comando con `verificar.py`. Un trabajador. Nix/uv fijados por el proyecto. No se ejecutan Next build ni suites legacy.

Incidencia de ámbito: la primera invocación del lanzador creó automáticamente `tools/procedencia/.venv` (entorno ignorado) fuera de las dos carpetas asignadas. Las siguientes fijan `UV_PROJECT_ENVIRONMENT` en la caché propia. No se modificaron fuentes, package, lockfiles ni CI y no se borró ese entorno para ocultar la incidencia. No se enlazó node_modules. No hay código TypeScript ni Effect nuevo; las 16 reglas anti-slop no se modifican. Los controles pertinentes de los scripts Python y sus resultados reales figuran en los logs.

## Bloqueos siguientes

1. Contrarrevisión nueva de identidad archivada, portadas, glifos y todas las citas empleadas para cada paso. No trasladar aceptación de otras auditorías.
2. Recuperar revisiones anteriores a 14/01/2015 y 14/07/2015, y ampliar el inventario de capturas para descartar omisiones de versiones sin afirmar exhaustividad absoluta.
3. Resolver autenticidad con copia del emisor o evidencia archivística adicional; la ausencia de firma PDF no vuelve falso el documento, pero impide afirmar validación PAdES.
4. Completar cadena normativa por regla y condiciones transitorias. La ayuda de 2016 y los BOE son apoyo explícito, no sustitución de algoritmo ausente.
5. Diseñar implementación histórica, regularización y hechos necesarios, con pruebas rojas y oracle independiente antes de cualquier cambio numérico. El rechazo actual permanece.

## Discordancias de fecha que no deben ocultarse

La portada recuperada de julio de 2015 dice **13/07/2015**, aunque el índice técnico archivado anuncia **14/07/2015**. Se conservan ambos testimonios; no se rebautiza el PDF como versión del día 14 ni se declara que contenga necesariamente todas las correcciones anunciadas. La portada 2016 dice **24/11/2015**; una noticia editorial enlazaba ese nombre anunciando 22/12/2015. Esa noticia es una pista de revisión pendiente, no prueba primaria de otra versión ni fundamento para cambiar la fecha de portada. Recuperar los bitstreams no ha cerrado estas discrepancias.

## Comparación preliminar localizada, sin ejecutar el motor

La tabla 2 de enero 2012 está en página física 29: tipos 24/28/37/43/44/45. La de febrero 2012, también página 29, publica 24,75/30/40/47/49/51/52 y explica que agrega escala ordinaria y complemento. Se conservan literalmente sus cortes superiores 120.000,20/175.000,20/300.000,20; no se corrigen a euros enteros por intuición ni para coincidir con legacy. Las cuotas fijas publicadas requieren comparación propia, distinta de integrar marginales.

Julio 2015 página física 30 contiene tanto la tabla anterior 20/25/31/39/47 como la nueva 19,5/24,5/30,5/38/46. Ambas usan corte 34.000, frente a 35.200 en la escala 2016 y en ref 2020. Que la capa textual contenga ambas no permite ejecutar ambas: deben leerse contexto y marcas del facsímil, junto con RDL 9/2015, página 11. El documento de 2016, página 30, publica 19/24/30/37/45 y cuotas 2.365,50/4.225,50/8.725,50/17.901,50, nominalmente coincidentes con la escala de ref 2020. No implica igualdad de reducción ni de todo el procedimiento.

Los candidatos `citas.json` mantienen la página física y la caja completa. La numeración física puede diferir de la impresa; se conserva la caja de página completa para comprobar ambas. Nunca localizar por el índice impreso sin comprobar el desplazamiento. La capa textual de varios PDF sustituye la letra N por U+0010; se conserva y se exige inspección visual, sin normalización para pasar controles numéricos.

La reducción general de enero de 2012, página física 21, publica 4.080 hasta RNT 9.180, pendiente 0,35 hasta 13.260 y 2.652 por encima. Ref 2020 no tiene ese suelo histórico. El algoritmo de 2016, página física 22, publica 3.700 hasta 11.250, pendiente 1,15625 hasta 14.450 y cero después. Esto permite proponer casos discriminantes, pero no son ejecuciones numéricas realizadas.

La inspección visual de 2016, página física 22, resuelve una trampa de extracción: la rama `MOVIL = S y CAMBIORESI = 2014` y el término MOVILGEO están **tachados en rojo**. La capa textual los conserva. No es evidencia de un derecho vigente en 2016 ni un error numérico confirmado del PDF. Se conserva el texto literal y el facsímil; el candidato RO1216-07 pasa a advertir esta pérdida de semántica visual. Un experto rechazaría ejecutar sin más todo el texto extraído. El coste es revisar las marcas de cada página antes de construir un oracle.

La inspección visual también confirma que en julio de 2015, página física 30, la tabla antigua está cruzada y tachada, mientras la tabla nueva aparece debajo sin tachar. Enero de 2012, página física 29, muestra la tabla de seis tramos y los cortes superiores terminados en ,20. Se inspeccionaron personalmente esas tres imágenes; las restantes se verificaron por regeneración, sin afirmar revisión visual de todas.

## Resultado final de controles

`validacion-ampliada.log`: 19 PDF, 191 citas y 191 facsímiles actuales cotejados por reextracción y regeneración, cero fallos. Matriz de 140 celdas, veinte pasos por cada una de siete versiones recuperadas; cero aceptaciones. Ruff y Pyright de los tres scripts mantenidos: sin errores ni advertencias. No se suma el pase previo. `pdfsig -nocert` no encuentra firmas en los siete algoritmos archivados; los resultados criptográficos de los BOE se conservan con su límite de confianza, sin verificar identidad histórica ni revocación.

`manifiesto.json` enumera los archivos entregables con ruta, tamaño, SHA-256 y baseSha256 (null para altas), excluyéndose a sí mismo y al parche para evitar autorreferencia. El parche contiene las altas textuales; los PNG y originales se integran por archivo/hash, nunca aplicando texto a binarios. Se conservan facsímiles iniciales adicionales sin referencia desde las citas actuales, para cumplir cero borrados. Las rutas de entorno uv y los textos exploratorios no forman parte del paquete de integración. Los originales CAS y los índices sí deben preservarse en la raíz del repositorio; no depender del worktree para su custodia.

La comprobación de entrega conserva los 6.005 archivos de la base sin ausencias y confirma las 16 reglas anti-slop a error. Los dos scripts de adquisición entregados recibieron además Ruff/Pyright: se corrigieron imports y una instrucción en la misma línea, conservando el diagnóstico inicial. `validacion-integrable.log` registra el pase integrable y el diagnóstico adicional de tipos explicado al final. No se cambiaron cifras ni expectativas.

La reproducción requiere conservar las rutas relativas del manifiesto desde la raíz del repositorio. `fuentes.json.localPath` usa la caché relativa; las adquisiciones embebidas conservan la ruta histórica real del momento de captura. Los verificadores no dependen de que sobreviva la ruta absoluta de este worktree. Objeción experta: copiar originales con hashes correctos pero dejar un lector ligado a un checkout efímero no garantiza reproducibilidad. Coste: separar ruta operativa de la memoria de adquisición y repetir el cotejo final.

El pase integrable revalidó los 19 PDF y 191 citas/facsímiles usando rutas relativas, pero detectó dos anotaciones insuficientes en el registro heterogéneo de adquisición. Se sustituyó la inferencia de diccionario de cadenas por un `TypedDict` con campos explícitos, sin casts ni supresiones. El resultado final de tipos y lint de los cinco scripts está en `tipos-adquisicion-corregidos.log`; los diagnósticos previos permanecen visibles. La corrección solo describe la estructura JSON que ya emitía el script.
