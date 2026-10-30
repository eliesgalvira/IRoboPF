# R49 — Revisión independiente acotada de resultados R45

Dictamen técnico limitado: no se ha reproducido un defecto nuevo del módulo de resultados integrado. La adaptación de retenciones y la clasificación de actividad son coherentes con las operaciones presentes y alcanzables examinadas, bajo fragmentos originales verificados, datos ordinarios y evaluación síncrona finita. El padre puede avanzar con este componente después de contrastar esta entrega; no se solicita otra revisión recursiva idéntica de los mismos bytes.

Esto no acepta fiscalidad, no concede admisión anual o pública y no cierra el encargo global. Los puertos en implementación por otro hijo no se han leído, consultado ni supuesto. Los 65 cierres y las 19 instancias son trabajos separados y no se vuelven a exigir como condición de esta revisión.

Trabajo directo en T3 Code/Codex, gpt-6.1-sol, high, sin subdelegación ni cambio de modelo. Priority es la configuración solicitada por el encargo; este proceso no expone un comprobante independiente del tier. Base y HEAD: 8136b0ffa00423eaffd1668e3bc14b45dae594b6, con 21.681 entradas. Ninguna operación VCS mutante ni fixes de producto. Solo se añaden archivos en las dos rutas autorizadas.

## Fuentes y fronteras de confianza

Leídos íntegramente BRIEF, AGENTS, CONTRATO-AUDITORIA, COORDINACION, módulo de resultados y test recibido, informe R45 y recepción R47, instrumento rojo y manifiesto. Se consultó la situación actual de ESTADO/DECISIONES sin escribirlos. La corrección del usuario prevalece sobre el modelo y las autorizaciones antiguas del BRIEF.

El módulo revisado es scripts/procedencia/composicion-r45-resultados.ts, SHA256 e7d6fad5017db2143b1f2b5ecfb6c55d5763e4bb678961e7c95141687479b916. R43 verifica los cuatro originales mediante sus verificadores, produce nuevamente la composición desde las fuentes fijadas, compara el contrato completo y devuelve structuredClone del candidato. El adaptador de resultados se ejecuta después de ese paso, sobre una copia derivada. El programa derivado no posee el pin del programa original: la prueba exige que verifyComposition lo rechace al sustituirlo en el candidato.

Se leyeron R43/archivos, las operaciones y capturas pertinentes de ambos intérpretes, la raíz de retenciones, su catálogo temporal, calcular/contrato/adaptador de actividad y la conexión/contrato anual explícitos. Se consultaron effect-solutions list y show testing/error-handling antes del arnés Effect, y la fuente local de Result, Effect.result e internal/effect. El manual orienta; la versión local concreta determina las APIs.

FUENTES.json fija 132 entradas técnicas por SHA256 y SHA512, tamaño y rutas de conservación en .cache/revision-resultados-composicion-r49-sol/fuentes/sha256/ y sha512/. Incluye el cierre de imports locales conservado, los cuatro productores/consumidores, contratos y runtime seleccionado de Effect/Decimal, además de versiones de herramientas. Los objetos son técnicos y permanecen fuera de informes; no se adquieren documentos fiscales ni se incorpora ningún original PDF a Git. Estos hashes fijan bytes, no autentican emisores ni aceptan fórmulas.

## R49-B1 — Reconocimiento y transformación del fail

El patrón exige op=call, primer operando que resuelve a get con key=fail y receptor global de nombre Effect. No reescribe otro propietario, miembro o clase de operación. Rechaza aridad distinta de dos identificadores (callee y único argumento) y colisiones de identificadores añadidos.

En el fragmento actual hay siete llamadas reconocidas. Cada una pasa a throw con el mismo id, los mismos data/source y una sola referencia a su objeto señal. Se conservan file, rango UTF16 y hash fuente; el rango se coteja también con el texto real Effect.fail. Todos los nodos originales restantes son iguales. El payload referencia exactamente el id del argumento anterior, sin evaluar de nuevo TS ni proyectar sus campos.

Cada llamada añade seis nodos: dos literales (marcador y operación), tres property y un object. El total añadido es 42. La copia original queda íntegra. No se modifica una expresión financiera, tabla o fuente.

Objeción experta: una igualdad JSON podría conservar una receta cuya evaluación pierde identidad. Respuesta: además del cotejo estructural, se sigue la semántica del intérprete: literal devuelve n.data.value sin clonarlo; object asigna ese valor y el payload evaluado; throw propaga el objeto; la captura de function solo intercepta su símbolo privado de return y relanza el resto. Los rechazos reales llegan a captureFinite con la identidad del marcador conservada. Coste: garantía ligada a estas operaciones del intérprete; cualquier cambio de su semántica exige contraste.

## R49-B2 — Clasificación y alcance del marcador

captureFinite conserva success con valor cero, clasifica como fail la señal referencial válida con payload objeto y conserva el identificador causante. Un Error con texto fiscal, un objeto con _tag fiscal, null, undefined o un string lanzado son defect, sin value. Una copia JSON de una señal capturada también es defect: el texto del protocolo no sustituye su identidad.

La señal real capturada se puede relanzar y vuelve a ser fail. Esto demuestra el límite: el marcador distingue una referencia interna de una mera forma textual; no autentica una ejecución, sus datos, un origen hostil o el pin del fragmento. preserveFailureOperands es exportado y permite inspeccionar el programa adaptado. No hay secreto criptográfico, sandbox ni autenticación de entrada. Manipular IR crudo o reutilizar una señal en APIs de laboratorio no demuestra un bypass de createResultConsumer.

Objeción experta: capturar throws podría atribuir a un defecto una aceptación fiscal. Respuesta: solo el marcador y payload reconocidos dan fail, y fail tampoco es un resultado utilizable. La verificación del original sigue en otra capa. Coste: el llamante debe discriminar variantes, y no puede tratar esta unión como Cause, fibras, interrupciones o mapError general. No se encontró una operación presente y alcanzable de estas dos raíces que contradiga ese alcance; no se usa una lista hipotética de APIs Effect ausentes como hallazgo.

## R49-B3 — Retenciones con subcaso y contexto propios

La matriz propia cruza ambos modos con doce casos: fechas 2018-07-04 y 2018-07-05, cierre 2018, falta de selección en 2018, fecha civil imposible, fecha junto a cierre, irregular excesivo, contrato manuales, descendiente adulto no elegible de situación 1, importe negativo, regularización y bruto cero. Cada resultado completo se contrasta contra calcularRetencionTrabajoAeat mediante Effect.result, sin extraer solo el importe o la etiqueta. En las dos fechas canónicas se exige además la versión independiente esperada del catálogo: aeat-2018-01-01 y aeat-2018-07-05.

Cada fail compara todo el payload de la API real, incluyendo motivo, fuenteReconocida y rastro. Se localiza su operation entre las llamadas fail originales y se contrasta el texto fuente de la llamada; los rechazos de regularización, negativo, irregular y manuales tienen discriminantes explícitos de su nodo. Legacy rechaza selección temporal; no se le atribuyen versiones canónicas.

Para ausencia se pasa una copia sin programa: retorna not-reached antes de poder resolver o ejecutar la raíz. No fabrica importe cero. El cero exitoso sigue siendo success. El caso adverso 1900 se construye expresamente fuera de AnioFiscal: la API real legacy presenta Cause con Die y el consumidor devuelve defect. No se convierte en una hipótesis fiscal admitida ni se confunde con el rechazo tipado por importe negativo o regularización.

Objeción experta: comparar dos programas puede repetir una fórmula equivocada. Respuesta: el dictamen es de preservación de resultados, no de legalidad del cálculo; las versiones, nodos y separación de variantes añaden discriminantes propios. Coste: no se certifican importes fiscales ni se reemplaza la validación anual exterior.

## R49-B4 — Actividad aislada, motivos y pagos

Los tres casos propios comparan el resultado completo con calcularActividad2025. Pérdida con gasto 123,45 y pago 9,87: el aporte permanece -123.45, gastos difíciles cero, pagos separados 9.87, retenciones cero, primerPositivo null y elegibleClienteUnico false. Ingreso 30.000 con retención 4.500: el aporte es 28.500 (30.000 menos 5%), la retención se mantiene aparte, elegibleClienteUnico true y primerPositivo 2025. Se cotejan todas las etapas y revisionFiscal pendiente.

El rechazo múltiple reúne ámbito foral, extranjero, trade, cobros-pagos y renuncia. Se exige lista completa y orden independiente de ids: ambito, extranjero, trade, criterio2025, regimen2025. La unión no-soportado completa se conserva como payload de fail, sin value ni cero sustitutorio.

La API aislada conserva su dominio. La conexión anual explícita sigue siendo otra función: su contrato restringe Madrid/individual/2025 y la raíz rechaza activos y discapacidad de actividad antes del adaptador. createResultConsumer.activity no ejecuta esa admisión ni la liquidación anual. No se presupone wiring posterior.

Objeción experta: aplicar aquí las restricciones del anual cambiaría resultados válidos de la API aislada. Respuesta: mantener la raíz realmente representada y documentar su frontera. Coste: el componente no permite inferir admisión anual ni legalidad EDS; no se amplía ni reaudita el dominio jurídico.

## R49-B5 — Verificación, copia capturada y puertas

Se prueban mutaciones de programa en cada uno de los cuatro originales, productor de un enlace, SHA de dependencia, conversión de un propertyPort y wiringAllowed. createResultConsumer las rechaza. Un positivo se crea antes de vaciar los programas y enlaces del candidato original: el nuevo createResultConsumer rechaza ese candidato, mientras el consumidor anterior conserva la retención completa de la API real y la actividad. La copia capturada no depende de mutaciones posteriores del objeto aportado.

La firma no acepta callbacks financieros ni servicios del llamante; las primitivas son las fijadas por los intérpretes. Las cuatro puertas se comprueban exactamente false: admissionClosed, siteClosed, wiringAllowed, completeRuleAcceptance. No son un recibo de admisión.

Objeción experta: verificar únicamente retenciones permitiría que el resto del contrato divergiese. Respuesta: el recorrido R43 verifica los cuatro antes de adaptar y las mutaciones por grupo lo discriminan. Coste: verificación/reconstrucción de los cuatro programas al crear el consumidor; las APIs de bajo nivel mantienen su precondición y no heredan esta copia capturada automáticamente.

## R49-B6 — Rojo histórico y calidad del instrumento

rojo.test.ts conserva el instrumento previo de R45 y su esperado payload._tag; solo adapta imports a la profundidad de esta revisión. El intérprete histórico sigue produciendo Error sin payload. La reproducción termina 1 por la misma aserción, no por resolución o infraestructura. No se presenta como defecto nuevo ni como pase del adaptador.

Se conservan los fallos propios y versiones intermedias del arnés. La primera carga no resolvió effect desde un worktree sin node_modules; se añadieron aliases en la configuración propia hacia dependencias del padre en lectura. La expectativa de siete nodos auxiliares era incorrecta: son seis, enumerados arriba. Lint exigió retirar una aserción innecesaria y conservar la excepción mediante un contrato nombrado. Tipos exigió documentar la lectura síncrona de fuente fuera del motor Effect y comprobar undefined de forma explícita. El añadido de cotejo del nodo tenía una búsqueda textual que no admitía saltos de línea entre paréntesis y caso: se conserva el fallo y se usa un patrón de espacios, sin cambiar el esperado semántico.

Un proceso ya cargado produjo su log mientras el archivo del arnés se había actualizado para esa búsqueda; su marco de código puede mostrar la línea posterior. El original efectivamente cargado está conservado en controles/arnes-3.test.ts.txt. La ejecución terminal se repite con el archivo estabilizado. No se atribuye ese fallo al producto.

Objeción experta: corregir fixtures puede ocultar un rojo real. Respuesta: retener fuentes intermedias y logs, explicar cada cambio y no modificar esperados históricos ni código del módulo. Coste: más artefactos y una repetición justificada del alcance propio, sin builds ni suites legacy masivas.

## Conservación, transporte y límites

El cotejo inicial terminó antes de escribir: 21.681 entradas, lstat/readlink/bytes/ejecutabilidad, un blob cada vez, cero diferencias. .git es el archivo de administración del worktree, no contenido añadido de aplicación. El cotejo terminal repite todas las entradas físicas y censa los extras, incluidos los de fuera de ámbito. No se sustituye por git diff o índice. No hay modificaciones autorizadas de base: sus hashes anteriores y nuevos coinciden en el recibo; todas las adiciones de la entrega tienen baseSha256 null. Cero borrados.

MANIFIESTO.json enumera el payload documental relativo por SHA256/tamaño/baseSha256. entrega.patch.gz contiene el patch textual; BINARIOS.json describe objetos exactos por ruta/hash, incluidos archivos vacíos. El ensayo en scratch nuevo aplica patch -p1 y restaura objetos antes de cotejar cada byte por tamaño/hash. Los sobres (manifiesto, patch, índice binario, recibo y objetos duplicados) quedan fuera del payload para evitar autorreferencia. Scripts y configuraciones exactas están conservados como texto en controles. El CAS técnico de FUENTES.json se conserva fuera de docs y no se mezcla con esos sobres.

No hay entornos, node_modules ni copias de app en docs. No se modifican confianza, inventario, motor, 45 snapshots, los 264 enlaces limitados ni Madrid pendiente. V5 r2 permanece corte R26, pin 2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88, en su ruta de preservación, sin lecturas de exportación ni escrituras. Crossa sigue v1 desfasado, mismo dueño/casa y sin custodia independiente. Sin adquisiciones fiscales, LFS, gasto, transferencias externas, X, main, PR, deploy, servidor, preview, limpieza, aceptación propia, atestación o promoción.

Las conclusiones nuevas requieren contraste del padre. El encargo global sigue abierto.

## Resultado terminal de validación

Vitest native sobre el archivo estabilizado: 58 pruebas correctas, 40 propias y 18 recibidas; no se suman las repeticiones como cobertura. Rojo histórico separado: una prueba falla por su aserción original, código 1 esperado. Tipos estrictos con diagnósticos Effect: código 0. Oxlint del alcance con un hilo, disable-nested-config y anti-slop16 a error: código 0. Los comandos, configuraciones, errores propios y salidas se conservan en COMANDOS.md y controles.

El primer cotejo terminal documental vuelve a comprobar las 21.681 entradas sin diferencias ni borrados y sin extras fuera de ámbito. El censo definitivo posterior al transporte se conserva en la ruta .cache declarada en COMANDOS.md. Ninguno de estos resultados transforma integridad o equivalencia de software en aceptación fiscal.
