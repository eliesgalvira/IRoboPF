# R45: normalización parcial; objetivo asignado NO completado

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Esta entrega no completa el contrato común ejecutable ni sus obligaciones para 65 sitios y 19 instancias. No debe integrarse o recibirse como solución del encargo finito. No existe una dependencia externa demostrada que explique esa falta; la admisión pendiente no la justifica. No se atribuyen cierres de valor/selección a los pases. El encargo global continúa abierto y las conclusiones requieren contraste de integración.

Base del candidato documentado: `31a70bd671f92fdb47ca1bf0fe95613a9fa4fb59`.

## Cambio efectivamente implementado

`scripts/procedencia/composicion-r45-resultados.ts` añade una adaptación finita de la primitiva `Effect.fail(x)` del IR de retenciones. El intérprete histórico la convierte en Error con un motivo textual y pierde el resto de x. El adaptador identifica exclusivamente call/get(fail)/global(Effect), exige aridad uno y conserva **el mismo identificador de operando x**. Sustituye esa operación por throw de un objeto señal: marcador privado, identificador de la llamada original y payload x. Añade operaciones object/property/literal; no reescribe ninguna operación financiera, tabla, binding o literal original. La fuente y rango de la operación causante permanecen en el nodo sustituido. La copia derivada se utiliza solo después de verificar el original; no se presenta su identidad como el pin histórico.

`consumeRetentionResult` utiliza el subcaso de retención y su contexto, nunca el bruto del anual. Ausencia devuelve not-reached y no evalúa la raíz; éxito cero sigue siendo success. `captureFinite` solo reconoce el marcador privado del adaptador: un Error con texto fiscal o una señal textual falsificada queda defect, sin value. El rechazo conserva el payload completo y el identificador de operación. Se limita a estas operaciones síncronas; no equivale a Cause, fibras, interrupciones, mapError, servicios arbitrarios ni excepciones de instrumentación.

`consumeActivityResult` ejecuta la raíz aislada de actividad ya representada en rentas. Su unión `estado:no-soportado` se normaliza a fail conservando toda la lista de motivos; soportado conserva íntegros aporte, etapas y discriminantes. No aplica a la actividad aislada las exclusiones del anual explícito. Los errores desconocidos quedan defect. `createResultConsumer` verifica/clona mediante R43 y encapsula esas dos entradas, sin callbacks financieros del llamante. admissionClosed, siteClosed, wiringAllowed y completeRuleAcceptance permanecen false. No hay integración con la API anual o pública.

Los ejecutores de bajo nivel exportados conservan la precondición documental de fragmento verificado/datos ordinarios. Son instrumentos de laboratorio, no admisión ni garantías ante objetos JS maliciosos. La identidad privada evita tratar un texto de error como evidencia de fallo tipado; no convierte al intérprete en un límite de seguridad para código arbitrario.

## Pruebas y rojos

Rojo ejecutado ANTES de crear el adaptador: un rechazo exige `payload._tag=ResultadoNoSoportado`, pero el consumidor histórico solo entrega Error. Fuente completa del rojo y log en controles; el manifiesto conserva sus hashes. No se altera ese histórico para anunciar verde.

El pase terminal contiene 18 pruebas, sin sumar repeticiones: cuatro éxitos de retención (ambos modos, bruto cero/40.200 EUR); cuatro rechazos (entrada negativa y regularización en ambos modos), comparando el payload completo con `Effect.result` de la API real; ausencia; Error textual desconocido; conservación de originales/operandos de fail; dos éxitos de actividad y dos rechazos forales; señal textual falsificada; defecto real legacy de año 1900 fuera del tipo anual; consumidor verificado y puertas falsas. Las expectativas propias discriminantes de actividad son 22.000 EUR para cliente único y 22.800 EUR para gastos difíciles con ingresos 24.000 EUR y sin gastos. Son expectativas de software, no suficiencia fiscal.

Los casos distinguen el defecto legacy por tabla ausente en año 1900 del rechazo tipado por retribución negativa. Cliente único se ensaya con 24.000 EUR sujetos de un solo cliente y una expectativa independiente del aporte; cero ingresos no satisface esa admisión.

## Calidad y límites

Tipos estrictos del alcance nuevo pasan. Oxlint global pasa con un hilo, disable-nested-config y las 16 reglas anti-slop a error. ESLint global pasa con 12 avisos y cero errores. Vitest usa cargador native, cache:false, cacheDir absoluto propio y maxWorkers:1. Cada validación adquiere/libera el lock pesado; la recepción usa el lock acotado. No se ejecutan builds Next ni suites legacy masivas.

La comprobación global de esta configuración no pasa: conserva `@vercel/analytics/next` no resuelto y TS2345 en el test histórico de fronteras, con string frente a string|null. No acredita pase global. Los cinco diagnósticos checkJs históricos de SS permanecen abiertos; el lote no añade MJS al que atribuir tipado integral.

No hay contrato/schema/artefacto común completo, router por puertos normalizados, grafo transitivo resuelto ni cobertura individual de las 19 instancias. Este cambio de normalización NO satisface por sí solo el resultado exigido. No se generan tablas de cierres o fichas genéricas para aparentarlo. Tampoco se declara resuelto R40-03 para escalas ni la ruta explícita anual. Los 264 enlaces limitados, Madrid pendiente, confianza, 45 snapshots, V5 r2/R26 y Crossa v1 no se promueven ni se modifican.

## Decisiones con objeción, respuesta y coste

1. Conservar payload mediante adaptación del fail IR. Objeción experta: capturar texto de Error confundiría rechazo y defecto y perdería campos. Respuesta: conservar el operando original, identificar la llamada y usar señal privada, contrastando payload con la API real. Coste: un programa derivado de laboratorio y pruebas propias; no equivalencia de efectos general.
2. Mantener separados rechazo/defecto/no alcanzado. Objeción: una ausencia o error convertido en cero haría utilizable una ejecución fallida. Respuesta: unión discriminada sin value en esas variantes y expectativa explícita para cero exitoso. Coste: el consumidor debe discriminar antes de usar dinero; no integración anual implícita.
3. No promover esta normalización como contrato completo. Objeción: otra entrega parcial prolonga un encargo que pidió expresamente completitud. Respuesta: reconocer que NO se ha cumplido, conservar únicamente código verificable sin falsear cierres ni culpar a admisión. Coste: el objetivo finito continúa sin resolver; esta entrega no es una revisión independiente ni aceptación propia.

## Conservación y transporte

El [manifiesto](MANIFIESTO.json) identifica el contenido y los hashes del paquete histórico. Su integridad no acredita aceptación fiscal.
