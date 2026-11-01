# Procedencia de las deducciones autonómicas de 2025

Revisión de las 351 fichas del [censo](censo.json). Ceuta y Melilla tienen cero entradas; no se inventan deducciones para completar territorios. Se revisa el ejercicio 2025, incluidas disposiciones posteriores con efectos expresos en ese ejercicio. No se extiende automáticamente el resultado a otros años.

## Evidencia requerida

Para cada código: original del boletín autonómico; ley o texto refundido y reformas aplicables; artículo, apartado, cita literal y localizador reproducible; contraste con la página del manual AEAT ya declarada y con la ficha y su evaluador real. Los consolidados ayudan a localizar, pero no sustituyen sin explicación los originales y sus fechas de efecto. Una reproducción del BOE complementa la publicación autonómica; su ausencia debe constar.

La comparación debe desglosar cuantías, porcentajes, límites, bases y condiciones de renta, requisitos, fechas, titulares, prorrateos e incompatibilidades. Se comprueban los apartados comunes y remisiones que condicionan cada deducción. No basta con que coincida el importe principal ni con que el catálogo diga «implementada».

Los originales PDF/HTML, capturas y recortes van exclusivamente al CAS externo por SHA-256. En Git se conservan código, pruebas, dictámenes, citas y manifiestos; no se añaden originales, transportes, volcados de páginas completas ni logs de sesión. Los manifiestos públicos excluyen rutas locales, nombres de equipos, cuentas personales, identificadores de hilos, cookies y credenciales. El firmante personal de un boletín no es necesario en una cita fiscal.

## Dictamen y compatibilidad

- `coincide`: la evidencia acredita los aspectos revisados; se declaran expresamente su alcance y condiciones.
- `diferencia`: hay contradicción u omisión demostrada, con contraejemplo o discriminante verificable. No se confunde un error de metadatos con una cuota incorrecta.
- `no_verificable`: falta evidencia o el contrato no permite comprobar el aspecto; se concreta lo que falta y las búsquedas o pruebas realizadas.

Un fallo de descarga aislado o trabajo todavía no realizado es `pendiente`, no un dictamen definitivo. Se distingue el dictamen de la ficha del de su cálculo; una consignación externa no acredita cálculo automático. El dictamen global prioriza una diferencia demostrada y mantiene los límites de lo no verificado. Los recuentos iniciales y posteriores a fixes se separan.

Se mantienen todos los campos existentes de las fichas y sus identificadores. La procedencia se añade sin renombrarlos ni retirarlos. Los errores de cálculo requieren prueba roja, fix y revisión independiente. Las ampliaciones inevitables de contrato se documentan para el rediseño; no se modifica la interfaz visual.

## Formato común de entrega

Cada lote mantiene `lotes/<letra>/dictamenes.json` con `{version:1, ejercicio:2025, lote, baseCommit, deducciones:[...]}`, `fuentes.json` con `{version:1, documentos:[...]}` y un informe breve. Un registro por código, sin omisiones ni duplicados.

Cada documento: `id`, `sha256`, `sha512`, `bytes`, `mimeType`, `urlOficial`, `fechaRecuperacion`, `boletin`, `identificador`, `fechaPublicacion`, `tipo` (original, reforma, correccion, consolidado o manual). Las rutas de almacenamiento se resuelven por hash desde una configuración externa.

Cada deducción: `codigo`, `comunidad`, `dictamenAntes`, `dictamenDespues`, `dictamenFicha`, `dictamenCalculo`, `alcance`, `motivo`, `estadoRevision` (candidato hasta revisión independiente), `vigencia`, `citas`, `manual`, `comparaciones`, `contraejemplos`, `cambios`, `pendientes`.

- `vigencia`: fechas de efecto, normas y reformas con IDs de cita, régimen transitorio y reservas, incluso si la regla no se puede cerrar.
- `citas`: `id`, `documentoId`, `articulo`, `apartado`, `textoLiteral` y `localizador`. PDF: tipo `pdf`, `paginaFisica` desde 1 y `bbox` en puntos; HTML: tipo `html`, selector y rango de caracteres sobre el original fijado, con receta de extracción. Las citas deben reextraerse y cotejarse, no copiarse de un resultado de búsqueda.
- `manual`: documento por hash, `paginasFicha`, `paginasComprobadas`, IDs de cita, concordancias y discrepancias. No suponer que la edición actual conserva la paginación histórica.
- `comparaciones`: una entrada por aspecto (`campoCodigo`, `valorCodigo`, `reglaOficial`, `citas`, `resultado`, `motivo`). No agrupar todos los requisitos en un único «coincide» sin desglose. Son actuales salvo `momento: "antes"`, que requiere cambio acreditado y comparación actual del mismo aspecto. La referencia a documentos es local al lote; adquisiciones independientes del mismo contenido conservan sus metadatos.
- `contraejemplos`: entradas hipotéticas, esperado y su cálculo independiente, observado, API o campo examinado, prueba reproducible y alcance. Sin datos personales reales.
- `cambios`: archivo relativo, motivo, prueba roja anterior y resultado posterior. `pendientes`: causa concreta y siguiente evidencia necesaria, sin listas genéricas reutilizadas.

Los auxiliares y pruebas se conservan cuando sostienen un resultado; los recibos mecánicos de transporte, logs y originales se mantienen fuera de Git. Se ejecutan verificaciones apropiadas al cambio, sin builds o suites legacy pesadas ajenas al alcance.

## Distribución y cierre

Siete lotes cubren 49, 48, 51, 63, 49, 51 y 40 fichas. Una línea independiente prepara el contrato aditivo de procedencia y los controles de cobertura/compatibilidad. Después se revisa cada entrega; solo se repite una revisión favorable si hay un cambio material o defecto reproducido. La aceptación de los resultados y la integración corresponden al orquestador.

El trabajo se realiza con commits nuevos sobre `464e0fd8`, solo en `procedencia-documental`. No hay reescritura, cambios de `main`, PR, despliegue, LFS ni publicación de fuentes personales. Los previews permanecen desactivados. El estado y el informe final separarán trabajo pendiente de dictámenes emitidos y de errores corregidos.
