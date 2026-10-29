# Revisión independiente del adaptador de evidencia

Base examinada: `c61a306107f280c399eb57e57a7c45452bd68864`. Revisor nuevo, trabajo personal, sin delegación, cambios de producto, VCS mutante ni atestación. La carpeta de entrega es `docs/procedencia/revisiones/evidencia-contenido-v1/` en la raíz del padre. Las copias de ejecución fueron fixtures en scratch, sin metadatos VCS. No se tocaron originales ni informes ajenos.

## Decisión

El adaptador resulta utilizable **como generador técnico de candidatos del caso Madrid examinado**. No he demostrado un bloqueo nuevo de ese recorrido. No está autorizado por esta revisión para publicar estados de aceptación, extender ámbitos jurídicos ni conectar automáticamente nuevos bindings. El wiring pendiente es alcance declarado, no un defecto nuevo.

Objeción experta: una cadena de hashes y un número coincidente pueden acompañar una proposición jurídica falsa. La reproducción EC-01 lo confirma. Decisión: conservar el resultado técnico limitado y exigir las puertas descritas abajo al integrar. Coste: validación adicional de ámbito, preservación de dependencias y una revisión nueva después de integrar los cambios del motor. No se migra aceptación desde este snapshot ni desde los objetos históricos del autor. Ningún resultado se autoacepta fiscalmente.

Lecturas: BRIEF y AGENTS íntegros; CONTRATO-AUDITORIA, COORDINACION, ESTADO, DECISIONES y correcciones/coherencia-ronda9/INFORME; entrega evidencia-contenido, extensión, logs y manifiesto; adaptador, test actual, modelo, verificador, coordinador Node y auxiliar Python; comprobación del verificador de contenido para situar su frontera. La ruta abreviada de correcciones se resolvió bajo docs/procedencia. El primer intento de rg encontró la herramienta ausente; se usaron find y lecturas directas. No se escribió Effect.

## Resultado reproducido

Las 13 pruebas existentes pasan (15,76 s). Se ejecutó además el adaptador real para un positivo y cuatro variantes con referencias internas y pines recalculados. No se sustituyó verifyLinks ni se inyectó un ejecutor. Todas las reconstrucciones y el render se serializaron mediante `flock /tmp/irobopf-validacion-pesada.lock`, un worker. Nix y uv frozen; node_modules compartido solo para lectura. No hubo build, instalación global, descarga ni transferencia externa.

- Snapshot: `7dd9c9c6147b6b1931b51944c885abd528550c27b5a3c31392b37e01be9f712d`.
- Payload Madrid: `c63794f9cea15c1ed8d736ed4719253e058d4616e83ed22d3ac02506e1035dd2`.
- Ocurrencia: `inv-c24095c17f76bb198b34cf8b8d5a45ed`, archivo irpf-autonomico-2020.ts, tabla Madrid, tramos/3/0.
- Informe técnico de esta ejecución: `05b4d70c84b006559e1df145b7e1bbd28981c58b4245e989dda7000e0d93a8d0`. Es salida mecánica, **no atestación**.
- Nueve objetos: cinco entidades, original PDF, PNG, receta e informe. Todos conservados en objetos-positivo por hash.

Integridad: reconstrucción actual, reextracción, regeneración del recorte y cotejo de bytes. Exactitud: igualdad Decimal entre 53407.2 del motor y 53407.20 del binding, solo ese límite. Autenticidad: `trust-indeterminate` procede del manifiesto fijado; este recorrido no vuelve a ejecutar pdfsig ni resuelve confianza histórica. Interpretación: candidata con decisión jurídica limitada referenciada. Aceptación: binding `pending`, aceptación fiscal completa `false`.

Inspección visual del PNG original y de la página 4 del PDF, renderizada a 96 DPI: página impresa 13 del BOCM de 28/12/2018; artículo 1, escala autonómica. La última fila muestra 53.407,20 / 7.395,81 / en adelante / 21,00 %. El crop conserva encabezados y filas; su bbox es [162.8,690.8,441,746.8], página 595×842, origen cero y rotación cero. La cifra es inicio de la última fila y límite superior del tramo anterior: no confundir fila documental con posición del array. La cuota 7.395,81 y la vigencia completa de 2020 no quedan aceptadas por esta lectura visual.

## Hallazgos y riesgos para el wiring

### EC-01 — Ámbito autodeclarado junto a exactitud numérica verificada (P2 antes de uso jurídico)

Reproducción `claim-y-ambito-repinados`: se cambia scope.year a 2021, territory a andalucia y claim a «Este límite acredita toda la escala de Andalucía en 2021.». Se recalculan cita, payload, registro y entrada, conservando fuentes del motor y norma madrileñas. El coordinador real termina con integridad y exactitud `verified`, decisión AUT1721-MADRID-2020-LIMITE y el ámbito falso. Interpretación sigue candidata, binding pendiente y aceptación falsa.

Causa: tools/procedencia/enlaces.py comprueba que la decisión aceptada refiere al archivo, pero no coteja year/territory con las dimensiones efectivas ni prueba la proposición. El adaptador traslada scope a informe.estados y a Rule. Esta limitación semántica estaba declarada por el autor; el experimento la concreta también en campos estructurados, no solo en prosa. No hubo bypass de aceptación fiscal.

Decisión: al conectar, rechazar contradicciones estructurales de año/territorio y fijar explícitamente el alcance revisado; mantener la exactitud como comparación numérica de una ocurrencia, nunca badge de validez del claim. Objeción: igualar arrays de años indiscriminadamente rompería herencias y aliases; hay que especificar la relación admitida. Coste: contrato de alcance y pruebas de correspondencia/alias, más revisión jurídica independiente.

### EC-02 — Grafo cerrado no equivale a preservación ni comprobación física (riesgo de integración)

`verificarGrafo` recibe un Set de nombres de auxiliares, no sus bytes. `cierre-solo-declarado` devuelve integridad comprobada con esa declaración. `receta-crop-divergente-rehasheada` cambia la receta del Facsimile, recalcula revisiones/aristas y declara el hash nuevo: el grafo pasa aunque la receta de Citation sea otra. Esto no ocurre en el positivo del adaptador: guardar calcula los hashes de buffers reales y usa la misma receta. El verificador de contenido completo sí relee auxiliares; debe mantenerse ese paso.

Además, objetos-positivo no incluye bytes de todos los pines de entrada: manifiesto de adquisición, payload, cita original, decisión jurídica, inventario y fuentes siguen dependiendo del repositorio. El Document simplificado tampoco contiene por sí solo fecha de descarga, cabeceras, informe de firma e identificador oficial. Los hashes del informe permiten localizar/verificar esas dependencias, no recuperarlas si desaparecen.

Decisión: materializar CAS atómicamente, comprobar bytes/tamaños, conservar el cierre histórico de dependencias, validar coherencia receta-Citation-Facsimile y enlazar el informe por hash en el snapshot. Objeción archivística: publicar nueve objetos no preserva por sí solo la prueba completa de adquisición/revisión. Coste: resolver dependencias entre archivos y mantenerlas. No llamar a esta salida paquete autónomo de preservación.

### EC-03 — Unicidad de ID al combinar revisiones (riesgo de integración)

`ids-iguales-revisiones-distintas` agrega otra revisión de Document con el mismo ID y título distinto: verificarGrafo permite ambas porque su clave es id/revision. El adaptador sí rechaza IDs repetidos dentro de su lote. El índice de ocurrencias de contenido usa un Map por ID, por lo que anexar revisiones sin sustituir la antigua sería ambiguo. La entrega ya advierte este punto; no es un descubrimiento de falta de wiring.

Decisión: imponer unicidad por ID en el snapshot combinado y sustituir expresamente la ocurrencia; conservar intacto el snapshot anterior. Componer varios bindings de una misma ocurrencia antes de generar. Coste: estrategia de composición y detección de colisiones. No deduplicar normas por igualdad numérica.

### EC-04 — Estados y metadatos no deben perderse al publicar (riesgo de integración)

Las entidades v1 mantienen integridad por-comprobar y otros estados pendientes; el éxito técnico vive solo en informe.estados. proposed-extension reconoce bien esa incompatibilidad. La extensión debe tener schema cerrado y resolución comprobada de informe, payload y snapshot; añadir campos o un hash declarativo no valida el resultado. Autenticidad debe identificar su evaluación de origen, fecha y límites, no presentarse como operación repetida en esta ejecución. El ámbito estructurado desconocido evita inventar un predicado fiscal, pero impide selección jurídica automática.

Decisión: versionar modelo, schema JSON, serialización, verificador y consumidor conjuntamente. Mostrar las cinco dimensiones por separado y limitar el resultado al sujeto exacto. Coste: migración explícita; sin retagging de rastros ni traslado de accepted-limited al payload nuevo.

## Controles adversariales que sí rechazan

Con todos los pines recalculados: unidad percent → «Unidad o conversión no acreditadas»; texto y TextQuoteSelector 53.407,29 → «Cita alterada: quote»; rotación 90 declarada sobre PDF sin rotar → «Cita alterada: geometry». No se limitan a la barrera externa de hashes. El recibo extra evidence → «Campos extra o ausentes». Las pruebas existentes añaden bytes corruptos, campos privados/extra, snapshot ajeno, duplicados exactos y auxiliares omitidos.

Orden observado: entrada cerrada y pines; reconstrucción en proceso nuevo; comprobación documental/reextracción/render/binding/revisión; recotejo de pines; construcción de entidades; grafo; último recotejo. No hay argumento público para inyectar un recibo. PrepararEntrada es inspección, no aprobación editorial. No se prueba aislamiento ante escritor hostil ABA ni legitimidad de node_modules frente a bun.lock.

Geometrías distintas reales (CropBox desplazado, MediaBox distinto o rotación no cero) son rechazadas explícitamente por el adaptador tras verificar el PDF. La reproducción solo ensayó metadato falso de rotación, no un PDF nuevo realmente rotado. La extensión debe conservar sistema nativo, receta y transformaciones, con fixtures propios antes de admitirlas.

## Validación, reproducción y límites

Ver COMANDOS.md, pruebas-existentes.log, adversos.json/log, original.log, lint-reproduccion.log y anti-slop-reproduccion.log. ESLint y oxlint de la reproducción JS terminan con código 0; ESLint avisa de que el scratch no contiene pages/app. No se desactivaron reglas. No se cambió código TypeScript/Effect ni producto: no se atribuye una nueva ejecución de typecheck global. Los logs históricos del autor quedan históricos.

Los adversos son observaciones con resultado/rechazo registrado; no se cuentan como nueve tests Vitest verdes ni como aceptación. No se hicieron correcciones numéricas, no hubo oracle modificado y no se emite patch de producto. Quedan sin ensayo rutas HTTP, integración del grafo global, atomicidad de publicación, restauración desde otro equipo y las extensiones aún propuestas. Los próximos cambios de motor del padre invalidarán el snapshot actual: regenerar y revisar entonces.

MANIFIESTO.json enumera entrega y binarios con SHA-256, tamaño y baseSha256 null (rutas nuevas). fuentes.json fija los 260 archivos usados en scratch. La comprobación final compara las fuentes relevantes del worktree contra base y presencia de todos los archivos de base; no se usa el índice para reparar ni integrar nada.

Cierre: 5.281 archivos de base presentes, cero ausencias; adaptador, test, modelo y verificador iguales a la base según preflight.json. Ruff de preparar.py y render-original.py pasa. Se retiró únicamente scratch propio, preservando scripts de reproducción, fuentes.json y objetos de la ejecución. No se borraron contexto, originales del proyecto ni archivos ajenos.
