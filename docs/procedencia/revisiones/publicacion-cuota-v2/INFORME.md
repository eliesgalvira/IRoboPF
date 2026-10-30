# Revisión independiente de publicación y cuota comparable v2

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Dictamen: PE-01, PE-02, PE-03 y CX-07-B son aprobables en el alcance técnico de la base `6e210920a9063b7a7efd0730ae4ab1ac73a2141e`. No se ha demostrado un nuevo bloqueo de producto. El cierre físico de los dos GET se reproduce con una salvedad de entorno: fue necesario completar las trazas de dependencias de Node porque node_modules está enlazado. No se certifica la cifra exacta de bytes del padre ni un alojamiento determinado.

Revisión del 29-10-2026. Se examinaron D001–D050, el informe publicacion-r13 y las revisiones previas de publicación y X. Estos antecedentes aportan contexto, sin sustituir los ensayos de este informe.

## Base y archivos

HEAD coincide con la base solicitada. 8.569 entradas de base presentes, incluidos enlaces simbólicos; diff de archivos versionados vacío. El estado final contiene únicamente scratch propio no versionado bajo .cache. `base.json.gz` queda identificado por hash en el índice de comprimidos; incluye tamaño, SHA256, baseSha256 y blob Git por entrada. `resultados.json` fija además los bytes obtenidos con git cat-file para ambas rutas con corchetes, las demás rutas, configuración y selector/consumidor.

El primer preflight trató dos enlaces simbólicos como archivos ordinarios y los anotó como ausentes. Es un error del arnés, no dos borrados: el control final usa lstat/readlink. Su primer intento ampliado excedió el maxBuffer de execFileSync; se elevó a 16 MiB. No se reparó ningún índice ni se borró nada. El manifiesto selecciona solo esta entrega; no incluye árboles CAS, node_modules ni copias de implementación.

## PE-01 y PE-02: árbol, render y HTTP

Las rutas `app/procedencia/[snapshot]/objetos/[hash]/route.ts` y `app/procedencia/[snapshot]/[id]/[revision]/route.ts` están en disco y sus SHA256 coinciden con los blobs del commit. El GET real usa el export público `react-dom/server.edge`, espera allReady y captura fallos como 503 antes de devolver HTML. El build webpack independiente termina con código 0 y enumera ambas rutas dinámicas.

Se ejecutan directamente los GET compilados desde la copia física del paquete, sin servidor. Madrid devuelve 200, doctype inicial, cierre `</html>`, estados y enlace PDF, sin script. La otra ficha devuelve 200 sin enlace PDF de Madrid. Revisión desconocida y auxiliar privado devuelven 404. PDF/PNG devuelven 200 con MIME, tamaño y SHA256 correctos; sus cabeceras incluyen immutable, nosniff, CSP restrictiva y no-referrer. HTML usa no-store, CSP restrictiva y no-referrer; no se atribuye nosniff al HTML. Objeto corrupto y almacén ausente devuelven 503/no-store; la ficha añade Retry-After 60.

El adverso de título `<script>alert(1)</script>` se inserta en un paquete de prueba rehasheado. La ruta compilada devuelve 200 con texto escapado, HTML completo y sin scripts. Es una prueba del render, no una publicación aprobada: se modifica deliberadamente la proyección del inventario. El primer intento dio 503 porque calculaba la revisión con orden JSON distinto del codec; se conserva como `compilado-escape-inicial.json`. El pase final usa bytesEntidad y demuestra escape, no solamente rechazo.

Decisión: cerrar los dos defectos de integración/consumidor en esta base. Objeción experta: un helper o build verde no acredita el GET ni sus datos. Coste: un build completo, copia física y ejecución del código compilado, con adversos de ausencia después de lectura. Alcance: rutas locales y respuestas medidas; no despliegue, disponibilidad externa o concurrencia.

## PE-03: cobertura, recibos y puerta actual

El verificador requiere exactamente un estado por ocurrencia con arista norma, igualdad del conjunto de sujetos con los estados de cada recibo y cobertura documental por entradas del recibo. No exige estados para cada ocurrencia técnica. Se verifican el v1 técnico `54194f5a7ec34412ac9aa4aa27d8bcea053b1e3ca2bbda2e70ce211e4ee2d613` (51.949 entidades) y el v2 `983a06755162fedd569a8bb6989714463e00903506a614659b94eed1d43dd1eb` (51.953), con aceptación pendiente. La suite añade un positivo histórico fijado; no se recorren los veinte snapshots.

Adversos independientes rechazados: omisión total, duplicado, revisión del sujeto cambiada, recibo rehasheado sin estados, recibo rehasheado sin Document/Citation/Facsimile, entrada del grafo del recibo alterada con revisión rehecha, y dos lecturas consecutivas con manifiesto ausente. Los casos de recibo actualizan su hash en evidencias, auxiliares y dependencias, con tamaño nuevo. El adverso de grafo falla por cobertura documental antes de comparar todo el grafo; no se presenta como una falsificación coherente de todo el sistema editorial. Las pruebas de contenido también rechazan revisiones duplicadas y receta de captura divergente con hashes rehechos.

Las seis pruebas de publicación ejecutan el coordinador real dos veces y comprueban determinismo, no un runner inyectado. UV_PROJECT_ENVIRONMENT se fija a una ruta absoluta propia antes del wrapper de corpus. La puerta de explicación pasa en la base; en copia propia falla al cambiar solamente next.config.mjs. Esto demuestra la inclusión de configuración en FUENTES_EXPLICACION. Los recibos y hashes siguen sin ser firmas ni prueba de independencia editorial.

Decisión: cerrar PE-03 como pérdida de metadatos. Objeción experta: equiparar cobertura técnica a prueba normativa o confiar en un recibo autodeclarado sería circular. Coste: reconstrucción real en publicación y rechazo de cobertura parcial; alcance limitado a las relaciones y estados pendientes del contrato actual. No se acepta fiscalmente una regla por coincidencia de cantidades.

## Empaquetado y su límite de reproducción

Las cinco trazas de procedencia contienen 4.722 entradas documentales cada una. next.config.mjs solo añade el almacén a /procedencia y descendientes. El paquete copia objetos por hash e índice de snapshots; no toma la caché de corpus, contexto privado ni originales ajenos al CAS publicado. Los PDF/PNG públicos están limitados por el snapshot; los auxiliares no tienen descarga pública. El inventario de rutas copiadas se conserva en compilado.json.

Incidencia de entorno PQV2-01: node_modules compartido mediante symlink hace que NFT registre el directorio y omita archivos externos al tracing root. La copia literal inicial falla EISDIR. No se oculta este fallo ni se añade un segundo build. Se ejecuta nodeFileTrace sobre los dos GET compilados con base `/`, se incorporan exclusivamente las dependencias resultantes bajo node_modules y se copian los archivos reales, sin enlaces al padre. La retraza conserva dos advertencias de resolución del paquete opcional @opentelemetry/api; el runtime compilado incluido funciona y los módulos cargados fuera del paquete son cero.

Resultado de esta copia complementada: **4.811 archivos, 267.676.833 bytes**. El padre midió 266.814.325 bytes: diferencia 862.508 bytes. No se atribuye una causa byte a byte sin cotejar ambos builds, ni se dice que la unión NFT original se haya reproducido sin adaptación. Sí se reproduce cierre documental y ejecución aislada de ficha/objetos: retirar el almacén propio produce 503 aunque el original siga intacto, después de haber servido respuestas correctas. La revisión no ejecuta los GET de las páginas de búsqueda/ámbito como contratos de Response.

Decisión: aceptar la evidencia de aislamiento local de ambos manejadores, con salvedad expresa sobre reproducción literal del paquete. Objeción experta: compartir node_modules durante la prueba final permitiría fallback y daría un falso cierre. Coste: retraza suplementaria y copia real de dependencias; alcance: este entorno enlazado y dos GET. Recomendación operativa: reproducir la unión NFT desde dependencias locales antes de convertirla en receta de despliegue. No es un bloqueo demostrado del producto en el entorno del padre. El volumen no acredita viabilidad en ningún hosting; no hubo servidor, preview, browser ni despliegue.

## CX-07-B: contrato comparable y consumidores

El selector conserva la cuota auxiliar cuando existe, incluso cero; resta esa cuota de bruto menos cotización del trabajador. Coste es bruto más cotización empresarial, todos ya expresados en céntimos después de IPC. Se mantienen los totales originales y ajustes explícitos. El caso 22.700,16 conserva cuota original 2.729,59 y neto 18.499,60; comparable usa cuota 2.873,30 y neto 18.355,89. No se convierte esta igualdad relacional en oracle fiscal.

El ensayo propio recorre dos sentidos IPC, pares 2025/2026, 2020/2021 y 2021/2020, salarios 0, 0,01, 21.999,99, 22.000,00, 22.000,01, 22.700,16 y 60.000,01; revisa ambas ramas, suma de componentes y ausencia de mutación (84 desgloses). Añade tres casos de auxiliar ausente, cero e igual. La suite del producto prueba además residuo de un céntimo del neto y coste. No se altera fixture alguno.

Lectura del cableado real: irpfConDeclaracionCentimos llama al selector; valorMagnitudCentimos lo usa para neto/coste y carga fiscal; diferencias restan esa misma magnitud; cuña suma cuota y ambas cotizaciones y divide por el coste conciliado. Las series llegan mediante desgloseLiquidadoParaAnio, con importes ajustados. Las claves de caché usan auditoría v5 y cuña v2, junto a perfil, años y rango. El marginal conserva cuota anual precisa y su contrato separado, expresamente explicado. La explicación de la comparación declara perfil histórico, límite de céntimos y ausencia de determinación universal de obligación legal. Simulador y exportación no se cambian en esta corrección; no se atribuye a esta revisión una ejecución del Excel exhaustivo.

Decisión: cerrar la incoherencia concreta de presentación CX-07-B. Objeción experta: corregir el motor legacy o imponer una cuota legal universal destruiría el oracle y excedería la prueba. Coste: coexistencia de contratos y posibles ajustes de un céntimo; alcance: magnitudes, diferencias y cuña del perfil comparable. La comprobación de consumidor es lectura de código y build, no interacción de navegador ni render gráfico automatizado.

## Validación, identidad documental y límites

Tipos principal/vendor, lint global, test:lint (16 reglas a error), 18 pruebas focalizadas, 20 de contenido y seis de publicación pasan; los recuentos se solapan y no son 44 pruebas independientes. Lint explícito final de los siete scripts propios pasa usando --disable-nested-config. El primer lint propio detectó un spread condicional vacío; se corrigió solo el arnés y se repitió. Effect-solutions list/show testing basics y fuente local se consultaron antes del arnés Effect. Logs y códigos de salida acompañan la entrega; el manifiesto fija los archivos finales.

El sujeto revisado es `inv-c24095c17f76bb198b34cf8b8d5a45ed`, revisión `062902db3822ea35dbea719966fc4fd95f6beda7df007f2729d2395fee3c30c5`. El payload actual declarado es `c0214519ced6467f1a450f3737b950068ef10b29e0f0692471708cfd922c93c4`, inventario `487a6a56dcd5397bf8cb36e7cf5097852b01cb27783bb1b854c1b53a9d49fbce` y artifact `2d6f0197a660fcc62cdd47af3e8a9935255f246807dea3cb29589da163e648e8`; no se migró ninguna atestación.

No se emite atestación candidata: no reabrí visualmente original y PNG en esta ejecución. Objeción experta: servir bytes iguales no equivale a releer el enlace. Coste: revisión visual futura para una atestación propia; alcance de este dictamen exclusivamente técnico. Autenticidad histórica indeterminada, interpretación candidata, regla completa false. El publicador sigue admitiendo pending; accepted-limited exige contrato nuevo y revisión, no cambiar un enum.

Crossa conserva v1 comunicado, mismo dueño/vivienda, desfasado respecto de v2 y sin custodia independiente. Sin nuevas transferencias, LFS, gasto, preservaciones modificadas, originales alterados, aceptación fiscal ni cierre del ejercicio. No se consultó contenido de entregas activas ajenas. No hay cambios de implementación que integrar: únicamente este informe y sus evidencias por hashes.
