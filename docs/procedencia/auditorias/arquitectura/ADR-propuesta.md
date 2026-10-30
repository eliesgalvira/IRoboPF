# Propuesta ADR: corpus inmutable y rastro local con procedencia versionada

Propuesta de 29 de octubre de 2026. No sustituye los ADR aceptados.

## Intención y límites

Una persona debe poder abrir la explicación de cualquier parámetro, operación o condición y ver qué se sabe, qué original la respalda y qué sigue discutido. Otra debe poder reproducir esa explicación meses después. El caso fiscal privado permanece en el navegador. El corpus es público y editorial: los lectores no lo modifican. La adquisición, extracción y contrarrevisión son trabajos de mantenimiento separados del tráfico web.

Las referencias técnicas primarias están en `fuentes.json`; los pasajes candidatos, en `citas-candidatas.json`.

Tres superficies con contratos distintos:

- Cálculo y exportación: datos privados locales; respuestas inmediatas; determinismo y versión explícita del motor.
- Lectura documental: mismo contenido público para todos; enlaces permanentes; HTML completo, imágenes bajo demanda y original descargable.
- Edición y publicación: pocos escritores, revisiones independientes y publicación por lotes; sin editor colaborativo en producción solicitado.

## Decisiones y objeciones

Cada objeción expresa el argumento que podría hacer un especialista; no atribuye opiniones personales a un experto real.

### D01. Mantener Next 16.1.7 y separar contenido público del cálculo

**Decisión.** Usar App Router existente para las fichas documentales. Server Components leen exclusivamente metadatos públicos. El cálculo sigue siendo local; el rastro conserva identificadores pequeños. No crear servidor de cálculo ni migrar framework.

**Objeción experta.** Un especialista en publicación estática preferiría HTML sin runtime React para cientos de miles de fichas.

**Motivo.** El proyecto ya combina calculadora interactiva y documentos. Separar una segunda aplicación aumenta contratos, despliegues y pruebas sin una medición que lo justifique. Las fichas no necesitan componentes cliente propios. Next puede prerenderizar o renderizar rutas conocidas bajo demanda; la documentación oficial describe ambas opciones [next-params].

**Coste aceptado.** Runtime y artefactos de Next, posibles payloads RSC y límites del build. No prometemos cero JS global: `app/layout.tsx` debe medirse durante implementación. No habilitar Cache Components ni adoptar APIs posteriores a la versión instalada por imitación de documentación actual.

### D02. Corpus inmutable con manifiestos revisables y objetos CAS

**Decisión.** Versionar JSON editorial y manifiestos pequeños en VCS. Originales y recortes se guardan una sola vez por SHA-256 en un almacén de objetos (CAS), separado de bundles de aplicación. La caché local es una etapa de adquisición, no archivo definitivo. SHA-512 se conserva también. El origen público del almacén será configuración del despliegue existente; puede ser directorio servido por el proxy actual o un almacén remoto ya autorizado.

**Objeción experta.** Un archivista rechaza un manifiesto si su única copia de originales vive en una caché borrable. Un operador objeta otro almacén y enlaces dependientes de disponibilidad.

**Motivo.** Incluir PDFs en cada deployment multiplica transferencia, disco y retención; ponerlos en una base de actores no mejora su preservación. Exigir copia duradera verificada y restauración antes de publicar resuelve la objeción archivística. Un adaptador HTTP de solo lectura permite cambiar proveedor sin cambiar identificadores.

**Coste aceptado.** Debe haber al menos dos copias verificadas de originales publicados, una independiente del servidor web. Sin destino durable disponible, la entrega es local/candidata y no se considera corpus publicado. Un objeto no se borra mientras un snapshot retenido lo referencie. No prometer que un repositorio de manifiestos reconstruye un PDF retirado por su editor. Ningún original grande entra en Git; el límite interno propuesto es 10 MiB por archivo editorial, muy por debajo de los 100 MB prohibidos por el encargo.

### D03. Separar identidad, revisión de contenido y snapshot

**Decisión.** ID semántico estable sin año ni nombre de función, por ejemplo `irpf.trabajo.gastos-generales`. Una revisión es el SHA-256 de los bytes JSON de la entidad, excluyendo cualquier identificador de revisión autorreferente (el modelo no tiene ese campo). Un snapshot tiene su propio hash sobre los bytes del manifiesto y fija paquetes, algoritmo, datos, explicación e inventario. Referencias `{id, revision}` resuelven dentro del snapshot; nunca consultan «latest».

**Objeción experta.** Un modelador advertiría que hashes de contenido con referencias mutuas crean un ciclo imposible de materializar y que una corrección editorial no debe cambiar el ID legal.

**Motivo.** El ID sobrevive; la revisión cambia. Las dependencias por hash forman un DAG obligatorio. Enlaces inversos como `Citation.supports` usan IDs y se resuelven por el índice del snapshot; no hashes del elemento que cita la cita. El índice de trazabilidad es derivado y no se incrusta en las entidades. Las fórmulas referencian parámetros de entrada, nunca un resultado que a su vez las derive. Alias y relaciones inversas son índices derivados.

**Coste aceptado.** Cambios de una dependencia propagan revisiones a sus consumidores. La misma revisión puede aparecer en varios paquetes/snapshots sin duplicar bytes. Se hashéan bytes UTF-8 exactos, sin normalizar números, Unicode o espacios durante verificación; el publicador fija serializador y orden para reproducibilidad. No se exige JCS ni se pretende equivalencia semántica entre JSON con distintos bytes. El bundle de schemas queda también fijado por hash.

### D04. Vigencia explícita y tres ejes de confianza

**Decisión.** Todo elemento conceptual tiene ejercicios, territorios, régimen, intervalo `[validFrom, validToExclusive)`, base temporal y condición. Año fiscal no sustituye fecha de publicación, entrada en vigor ni devengo. Herencia anual exige una referencia a la regla de continuidad. No hay fallback al año anterior por falta de dato.

Conocimiento (`sin-evidencia`, `evidencia-localizada`, `interpretacion-candidata`, `contradicha`, `no-aplica`), contrarrevisión y autenticidad son independientes. Conocimiento pertenece al elemento; autenticidad, a cada documento y comprobación. No hay sello único «validado» que se propague por el grafo. Cobertura de ejecución (`catalogado`, `implementado`, `no-soportado`) es otra dimensión.

**Objeción experta.** Un jurista objeta una fecha única para reglas retroactivas o ejercicios terminados por fallecimiento. Un epistemólogo objeta identificar firma válida con interpretación correcta.

**Motivo.** Se conservan publicación y entrada en vigor en Rule, más ámbito de aplicación en Scope. Una disposición puede producir varias variantes con intervalos y condiciones distintos; fecha de extracción no modifica vigencia. El selector exige exactamente una variante aplicable o error de ambigüedad; no «la última». Se puede tener original auténtico y hallazgo contradicho, o interpretación plausible con firma no evaluada.

**Coste aceptado.** JSON Schema no demuestra no solapamiento, retroactividad ni corrección de predicados. Las condiciones redactadas necesitan resolver y probarse en código del motor ya existente, sin ejecutar texto del corpus. Para condiciones complejas se enlazan elementos `Formula`/`Step`; no se incorpora un segundo intérprete fiscal. El registro territorial incluye forales sin afirmar que el motor las implemente; `simulada-estatal` es un supuesto separado de España.

### D05. Cada concepto tiene ficha; cada línea del rastro tiene binding

**Decisión.** Parameter, Formula, Step, Derivation y Rule tienen una página española con fórmula, derivación, norma, captura y bordes. Cada sección declara contenido disponible o motivo de pendiente/no aplicación. Document, Citation y Facsimile tienen página técnica de inspección. El esquema no obliga a inventar una norma para una suma, un dato INE o un supuesto legacy.

`siteId` identifica el punto semántico que emite una línea. `instanceId` distingue repeticiones en la ejecución; no es el índice del array. `BindingIndex` asocia cada punto/variante a concepto, reglas y citas fijadas. Los pasos agregados y cada una de sus líneas tienen binding propio. Las dependencias en `Step.dependsOn` no son orden de presentación.

**Objeción experta.** Un experto fiscal rechaza enlaces genéricos a un manual que no explican los operandos o que muestran una norma de 2025 para 2012. Un ingeniero rechaza parsear etiquetas españolas para reconstruir trazabilidad.

**Motivo.** El código leído tiene precisamente `FuenteExplicacion {titulo, referencia}`, `LineaCalculo {etiqueta, formula, resultado}` y un `RastroCalculo` sin versión. La propuesta añade identidad explícita en los puntos de emisión, conserva los intermedios del motor y deriva texto al final conforme a ADR-0004. No reejecuta la fórmula desde una cadena ni transforma Markdown en autoridad.

**Coste aceptado.** Habrá trabajo de instrumentación manual y pruebas de cobertura por rama. Un adaptador v1→v2 marca procedencia pendiente y no fabrica enlaces a partir de títulos. `roundingRef` explica tanto una frontera efectiva como la ausencia explícita de redondeo; no obliga a redondear cada línea. Los esquemas son contratos de transporte JSON; `null` en metadatos HTTP no obliga a introducir null en dominio Effect.

### D06. Evidencia reproducible sin confundir integridad con autenticidad

**Decisión.** Document guarda original, adquisición HTTP, identificador oficial, versión y comprobaciones. Citation fija hash del original y selector PDF o HTML. PDF: página física 1-based, coordenadas PyMuPDF en puntos, página sin rotar, origen superior izquierdo del CropBox, ancho/alto y rotación separados. Facsimile fija recorte, original, herramienta, versión, entorno, DPI, color, anotaciones y encoder. HTML usa selector y texto exacto con algoritmo de extracción versionado; no lleva página ni bbox ficticios. El modelo W3C sirve de interoperabilidad para selectores [annotation], no de sustituto de la convención geométrica local.

**Objeción experta.** Un perito objeta que un hash solo prueba igualdad de bytes; un PDF con firma visual no equivale a firma criptográfica verificada. Un ingeniero objeta prometer PNG idénticos con solo guardar DPI.

**Motivo.** Las comprobaciones de firma/CSV guardan alcance, fecha y reporte. PAdES requiere cadena, integridad de revisión firmada, cambios posteriores y evidencia de revocación/tiempo; errores de red no son firma inválida. CSV exige contrastar documento completo o declarar qué se contrastó. HTTPS acredita adquisición desde un origen, no vigencia legal. Guardar entorno/encoder permite ensayar igualdad de bytes; otra versión de renderizado produce otro artefacto, no reemplaza el anterior.

**Coste aceptado.** Un verificador independiente deberá releer originales. WARC y sello RFC 3161 se reservan para fuentes HTML volátiles o una política archivística que los requiera; no bloquean catalogar una laguna. RFC 3161 acredita existencia de bytes en un momento, no autoría ni exactitud legal. No se ha validado ninguna firma ni CSV en este ámbito. El hash SHA-512 es redundancia verificable, no segundo testigo.

### D07. Prerender acotado, resto bajo demanda y paquetes verificables

**Decisión.** La primera versión prerenderiza índices y un conjunto cerrado de fichas del snapshot fijado en build. El resto se resuelve bajo demanda en el Next actual, con pertenencia al manifiesto comprobada antes de renderizar. Cada ficha completa existe aunque no tenga HTML precalculado. Para despliegue exclusivamente estático, la alternativa es prerenderizar todas las rutas publicadas y medir su coste; no fingir soporte on-demand con `output: export`.

**Objeción experta.** Un SRE rechaza renderizado bajo demanda que descarga todo el corpus y abre la puerta a builds o cachés ilimitados por solicitudes arbitrarias.

**Motivo.** Separar paquetes por dominio/año/territorio y deduplicar documentos comunes limita descarga y memoria. El índice inicial solo incluye rutas y hashes. Un servidor jamás compone una URL de origen a partir del input: resuelve hashes admitidos en el manifiesto. `dynamicParams=true` permite el resto en Next [next-params]; validar contra el inventario evita crear páginas por cada URL inventada. La configuración exacta se probará en Next 16.1.7, sin actualizarlo.

**Coste aceptado.** Primera visita a ficha no precalculada tiene latencia y puede fallar si falta su paquete. Debe distinguir 503 transitorio de 404 real; no se usa stale con otra versión. Bundles no incluyen PDFs ni recortes. No se promete que Next deduplique paquetes automáticamente entre funciones; se comprobará el output trace durante la integración. Los presupuestos de abajo son objetivos, no mediciones.

### D08. Caché por versión y publicación atómica

**Decisión.** Objetos por hash y paquetes: `public, max-age=31536000, immutable`, solo tras verificar bytes. El alias vigente usa `no-cache` con ETag y cambia mediante una publicación atómica final. No redirigir una URL versionada a una versión nueva. La URL de ficha incluye snapshot, año, territorio, ID y revisión; el HTML puede actualizar su plantilla, así que inicialmente usa revalidación y ETag, no se promete inmutabilidad binaria del HTML solo porque el corpus lo sea [immutable].

**Objeción experta.** Un operador objeta que `no-cache` no invalida todas las cachés de Next o del CDN, ni basta para coordinar despliegues en varias instancias.

**Motivo.** Fijar snapshot en cada petición elimina mezclas de metadatos. La publicación sube objetos → verifica disponibilidad → sube paquetes/manifiesto → prueba cierre referencial → cambia alias. El build fija su snapshot; no mezcla el alias remoto con datos del motor compilados. Una corrección crea nuevo snapshot y un aviso de sustitución separado; conserva la lectura histórica.

**Coste aceptado.** Pruebas específicas de cabeceras en el host real y de caché compartida si hay varias instancias [next-self-host]. No eliminar ni sobrescribir `Vary` de Next/RSC. Brotli/gzip tienen validadores de representación coherentes; el hash del contenido se comprueba sobre bytes decodificados, no sobre la codificación de transporte. Un 404 desconocido tiene TTL corto o `no-store`; un hash que el manifiesto promete y falta es 503, no 404 ni éxito vacío. La retención de snapshots públicos es duradera y tiene coste de disco; cualquier retirada excepcional usa registro explícito, nunca fallback silencioso.

### D09. No usar actores para la lectura ni el cálculo; reevaluar coordinación futura

**Decisión.** No introducir Rivet ni Durable Objects en este flujo. Mantener trabajos editoriales idempotentes y serializados donde corresponda; pipeline fuera de peticiones de usuario. Un actor sería candidato si hubiera sesiones de revisión compartidas, colas durables con cancelación o progreso en vivo que no cubra el pipeline.

**Objeción experta.** Un especialista en actores observa correctamente que la entidad documento puede poseer estado de revisión, coordinar exclusión mutua, colas y reintentos, y dormir cuando está inactiva. Descartarlo como «servidor siempre encendido» sería falso.

**Motivo.** Rivet documenta estado persistente y efímero, escrituras agrupadas, persistencia explícita y ciclo de sueño [rivet-state, rivet-lifecycle]. Durable Objects combina ejecución y almacenamiento transaccional por objeto; su estado de memoria no sobrevive necesariamente a expulsión [do-storage]. La hibernación evita cobrar duración inactiva en el caso documentado de WebSockets [do-hibernation]. Son beneficios reales, pero el lector no muta un documento, no necesita sesiones ni conexión persistente. El cálculo puro tampoco necesita una entidad remota. El corpus compartido seguiría necesitando CAS y snapshots con cualquiera de los dos.

**Coste aceptado.** No se obtiene ahora un coordinador distribuido ni panel vivo de edición. Rivet permitiría control propio del runtime pero exigiría evaluar despliegue, backups y garantías de efectos externos; Durable Objects exige un servicio Cloudflare y su integración. No hay benchmark ni comparativa de precios válida para esta carga, por lo que no afirmamos cuál es más barato. Si se adopta uno después, no será autoridad de bytes publicados: emitirá nuevos manifiestos al CAS. Idempotencia y publicación atómica siguen siendo obligatorias; dormir no equivale a exactly-once.

### D10. Accesibilidad y observabilidad mínimas sin sacar casos privados

**Decisión.** Página española con HTML semántico, título único, unidad, fecha, estado textual, fórmula legible y transcripción de tabla con encabezados. Recorte con texto alternativo, enlace al original y pasaje, zoom accesible y tamaño reservado. No depender de color, canvas, visor PDF, hover o JavaScript para leer lo esencial. El recorte se carga al solicitar evidencia, sin precargar el manual entero.

**Objeción experta.** Un experto en accesibilidad rechaza que la imagen sea la única evidencia disponible para lector de pantalla. Un experto en privacidad rechaza telemetría de errores que copie el rastro fiscal.

**Motivo.** Imagen conserva contexto visual; transcripción paralela conserva acceso y búsqueda, marcada como transcripción sin sustituir original. Observabilidad del pipeline registra snapshot, herramienta, bytes, duración, resultado de verificación y errores tipados, nunca salarios, entradas ni resultados del caso. El rastro fiscal no es una traza OTel. Un reporte local puede exportarse por acción expresa del usuario.

**Coste aceptado.** Revisión manual de tablas y accesibilidad; ninguna afirmación de conformidad WCAG certificada. Logs de origen no cuentan lecturas satisfechas por caché. Mantener caché eficiente tiene prioridad sobre contar todos los lectores; no añadir analytics, replay, fingerprint ni backend nuevo. Las métricas del pipeline se pueden escribir como JSON local. Monitor externo de disponibilidad/restauración queda como requisito de operación antes de publicar, sin contratarlo aquí.

## Contratos de rutas y resolución

Prefijo propuesto `/procedencia`, sin modificar `/`, `/auditoria` ni `/liquidacion-irpf`.

- `/procedencia`: índice del snapshot fijado por despliegue; muestra versión y cobertura pendiente.
- `/procedencia/s/{snapshotSha256}/e/{year}/{territory}/{id}/{revision}`: ficha conceptual española. Año/territorio deben pertenecer al Scope de esa revisión. Las variantes intranuales tienen distinta revisión y muestran su condición; no se elige variante según el reloj del servidor.
- `/procedencia/s/{snapshotSha256}/d/{id}/{revision}`: inspección de documento, cita o facsímil, identificados por `kind` del índice.
- `/procedencia/s/{snapshotSha256}/e/{year}/{territory}/{id}`: índice de variantes, nunca selección arbitraria; una variante única puede enlazarse explícitamente.
- `/corpus/v1/snapshots/{hash}.json` y `/corpus/v1/sha256/{hash}`: manifiesto y objetos. El origen configurable puede ser externo; paths CAS siguen iguales. Un gateway público solo admite hashes del manifiesto, no URLs arbitrarias.

JSON de ficha: `PageEnvelope`, servido en ruta JSON separada (por ejemplo sufijo `/data.json`) para no introducir negociación ambigua de `Accept`. Los contratos no crean rutas reales en esta entrega. Enlaces desde rastro solo llevan identificadores públicos, año y territorio; ningún salario, fecha personal de fallecimiento o resultado. Configurar referrer policy para no filtrar URL privada al abrir un original. La navegación por evidencia puede revelar interés en una regla, aun sin revelar el caso: privacidad local no significa anonimato de las visitas HTTP.

Un objeto ausente fuera del índice es 404; ámbito no soportado pero reconocido tiene ficha 200 con estado explícito, no cifra cero. Variante solicitada incompatible con el ámbito da 404 sin redirigir. Versión mayor de schema desconocida da error `schema-no-soportado` y enlace al original; no interpretar laxamente. Alias de nombres conservan mapa de IDs antiguos y no cambian el significado.

## Tamaño, memoria y recuperación

Contar entidades/revisiones reales antes de aprobar un presupuesto. No multiplicar ciegamente cada parámetro por 15 años y 19 territorios si comparten revisión; la cobertura sí conserva todas esas combinaciones. Ejemplo de planificación, **no medida**: 20.000 fichas de 12 KiB de HTML son unos 234 MiB antes de RSC/assets; copiar 5 GiB de originales a 10 despliegues retenidos añade 50 GiB. Sirve para explicar por qué bytes documentales y artefactos de aplicación tienen ciclos de vida separados, no para estimar factura.

Objetivos iniciales revisables: índice de navegación comprimido ≤256 KiB; paquete JSON ≤2 MiB decodificado; ficha JSON ≤64 KiB salvo tablas declaradas; carga inicial de una ficha ≤1 paquete de índice y sus paquetes de dependencia, sin originales automáticos; descarga original en streaming, concurrencia acotada; máximo un renderer PDF en este equipo durante integración. No bloquear una tabla legítima con truncación: partirla y conservar encabezados y relaciones. Medir bytes, RSS máxima, tiempo de build, tiempo de ficha fría y caliente y número de requests antes de ampliar prerender.

Un manifiesto de paquete lista cada entidad, revisión, tipo, tamaño y hash. Sus dependencias son hashes de otros paquetes; deduplicación y detección de ciclos previas a publicación. Datos JSON remotos nunca se evalúan como JS. La descarga comprueba límite de tamaño, MIME, hash y schema antes de incorporarse al índice; timeout y error de red no reemplazan versión por otra. Un paquete remoto no cambia parámetros ejecutables del motor sin release compatible. Offline requiere paquete explícitamente descargado y verificado; no se promete offline completo por la caché HTTP.

Restauración: partir de un snapshot retenido, recuperar objetos desde copia independiente, revalidar hashes y cierre, regenerar fichas y comparar los datos, no confiar en el CDN como backup. Corrección urgente: publicar snapshot corregido y aviso de revisión en el índice actual; conservar el histórico con contexto. Un snapshot revisado no se publica si falta siquiera un original que afirma respaldar elementos aceptados.

## Integración y puertas de aceptación

1. Otro auditor revisa este ADR y los contratos. El autor no acepta su propia propuesta.
2. El editor de pipeline acuerda un adaptador entre metadatos actuales de `descargar.py` y Document: cabeceras ausentes explícitas, identificador/publicación desconocidos, hashes verificados. No duplicar su downloader/verificador.
3. El inventario asigna IDs estables; registrar archivo+símbolo+ancla+hash de archivo. Las líneas numéricas de código son ayuda, no identidad.
4. Migrar un tramo vertical público por capacidad (liquidación, retención, legacy) con citas auténticas contrarrevisadas y prueba fallida previa si hay corrección fiscal. Ningún dato se acepta por un snapshot de tests existente.
5. Comprobar plan de pruebas de `contratos-y-pruebas.md`; medir en host real. Solo entonces integrar ADR y rutas.

## Referencias técnicas recuperadas y advertencia de versión

Las ocho adquisiciones conservan original, cabeceras HTTP completas, ambas URLs, fecha, estado, tamaño y hashes SHA-256/SHA-512 en `fuentes.json`. Publicación o versión editorial desconocida se marca explícitamente; no se deduce de la fecha de descarga. Son fuentes técnicas de sus propios editores, no autoridad tributaria.

- [Rivet, estado](https://rivet.dev/actors/docs/state/) — `rivet-state`.
- [Rivet, ciclo de vida](https://rivet.dev/actors/docs/lifecycle/) — `rivet-lifecycle`.
- [Cloudflare, almacenamiento por objeto](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/) — `do-storage`.
- [Cloudflare, WebSockets e hibernación](https://developers.cloudflare.com/durable-objects/best-practices/websockets/) — `do-hibernation`.
- [Next, generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — `next-params`.
- [Next, alojamiento propio](https://nextjs.org/docs/app/guides/self-hosting) — `next-self-host`.
- [W3C, Web Annotation Data Model](https://www.w3.org/TR/annotation-model/) — `annotation`.
- [RFC 8246](https://www.rfc-editor.org/rfc/rfc8246.txt) — `immutable`.

La página actual de Next recuperada ya menciona `ensureStatic`, mientras el repositorio fija Next 16.1.7. No se propone esa API. Se comprobó localmente `node_modules/next/dist/build/segment-config/app/app-segment-config.js` (opciones `dynamicParams` y `force-static`) y `node_modules/next/dist/server/typescript/rules/config.js`; esto acredita presencia de configuración, no un build funcional. El contraste evita importar sin prueba detalles de versiones posteriores.

`app/layout.tsx` incluye actualmente `<Analytics />`. La propuesta no añade telemetría y tampoco afirma que la aplicación actual no la tenga. La implementación deberá comprobar que URLs, eventos y errores no llevan información privada antes de prometer privacidad del flujo de evidencia.
