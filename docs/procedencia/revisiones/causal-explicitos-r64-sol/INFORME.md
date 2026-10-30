# Revisión independiente de los diez sitios explícitos R64

Se reproduce un defecto funcional de propagación del rastro: **R64-PUSH-01**. No procede declarar cerrado el lote completo. Los valores y la selección local de sus nueve salidas laborales conservan corroboración condicionada; `anual.explicito.actividad.etapa` tiene bloqueo demostrado por las familias excluidas. La siguiente intervención debe limitarse al defecto reproducido, sin repetir revisiones favorables de los 55 sitios anteriores ni iniciar las 19 familias.

Trabajo personal de gpt-6.1-sol, esfuerzo high. Priority solicitado explícitamente; no dispongo de recibo independiente del tier servido. Sin subdelegación, cambios de producto ni operaciones VCS mutantes. Base revisada: `cd41524b432c5d4c2a7f665603debef6be5abc28`, 23.958 entradas. El test actual incluye el mkdir incorporado por el padre; no se revisó como vigente su versión anterior.

## Defecto reproducido y alcance

En una entrada real admitida de empleo, íntegro 16.576 euros, la API TS devuelve dos pasos: trabajo y bases/cuotas/pagos. Los dos `pasos.push` de `conexion.ts` deben devolver longitudes 1 y 2. El intérprete R62 devuelve 1 y 1 y su evento de retorno completo contiene `rastro.pasos: []`.

La causa está en `evidencia-causal-r57.ts`: `local` devuelve `alias`, que copia recursivamente el mapa de propiedades. `push` modifica exclusivamente ese receptor copiado y sustituye su `raw`; la variable `pasos` conserva la colección vacía. La captura inmediata al invocar `crearLineaCalculo` sí recoge las nueve líneas seleccionadas. Por ello comparar solo `out.lines` con nueve líneas filtradas del oracle permite pasar las pruebas recibidas y deja escapar la pérdida del retorno.

El rojo ejecutable es `.cache/causal-explicitos-r64-sol/push-rojo.test.ts`; guarda `push-defecto.json` antes de exigir `[1,2]`. La expectativa procede de la semántica de Array.push y de la API financiera real, no del replay. El test no es `fails`, no se desactiva y debe terminar con exit 1 en estos bytes. Los originales y resultados permanecen intactos.

Objeción experta: la identidad editorial está excluida y quizá no se exige publicar el rastro. Respuesta: precisamente la receta declara esa frontera como identidad de datos, `editorial-wiring-excluded`. Perder los datos antes del retorno contradice la propagación completa exigida aunque no se publique nada. No afirmo un importe fiscal erróneo ni un fallo del motor financiero TS. El defecto afecta a la fidelidad del programa causal completo y sus retornos, compartida por las nueve salidas. Coste estimado de reparación focalizada: 2–6 horas; contraste limitado del defecto: 1–3 horas, con incertidumbre por la representación de alias y estado mutable. No se implementa aquí la reparación.

## Diez decisiones

`DICTAMEN10.json` conserva una decisión individual con evidencia, objeción experta, respuesta, coste y alcance por ID. En los nueve primeros, «corroborado» se refiere a valor, origen y selección local; el cierre de propagación queda suspendido por R64-PUSH-01.

| ID | Evidencia y dictamen individual |
| --- | --- |
| anual.explicito.trabajo.integro | Suma de importes conciliados, dos rendimientos disjuntos y clases empleo/pensión. Valor corroborado; no autentica certificados. |
| anual.explicito.trabajo.gastos-a-e | Cotizaciones efectivas separadas y requisitos de sindicato/colegio/defensa. Dos rendimientos prueban que 500/300 son topes anuales, no por registro. Valor corroborado. |
| anual.explicito.trabajo.gasto-f | min(2000,max(previo,0)); controles de 100 y saldo −50. Valor corroborado, sin gasto negativo ni aplicación doble. |
| anual.explicito.trabajo.art19 | Íntegro menos a–e menos f. Dos rendimientos: 20.000−1.090,20−2.000=16.909,80. Distinto de argumentoArt20. |
| anual.explicito.trabajo.art20 | Fronteras 14.852, 17.673,52 y 19.747,50 con vecinos; reducción sobre previo sin f, limitada a art19 positivo. En dos rendimientos: 954,9808. |
| anual.explicito.da61 | Empleo frente a pensión, fronteras 16.576/18.276 y sus vecinos recibidos. Pensión selecciona cero; no se infiere cobertura causal de actividad. |
| anual.explicito.retenciones | 31,29+7,13=38,42 con operaciones distintas; identidad duplicada rechazada. Actividad consume otra propiedad del aporte. |
| anual.explicito.pagos | Cero literal por fuente laboral, separado de retenciones. El cero no acredita pagos de actividad. |
| anual.explicito.diferencial | posterior−retenciones−pagos, con −38,42 y +11.726,53643 calculados independientemente; no se sustituye por presentación redondeada. |
| anual.explicito.actividad.etapa | Bloqueo real por `adaptarActividadGeneral → calcularActividad2025 → etapas/aporte`; no es un pendiente por falta de tiempo. |

## Dependencia de actividad

Lectura directa de `conexion.ts`, `actividades-economicas/adaptador.ts`, `calcular.ts` y `fuentes.ts`. El adaptador llama al cálculo real y devuelve sus etapas y aporte. `conexion.ts` hace map de `etapas` y usa `importe`, `reglaId`, `id`, `formula` e índice como instancia; neto, retenciones y pagos proceden de tres propiedades distintas del aporte. El calculador produce etapas por ingreso, gasto, RETA, amortización, gastos difíciles, reducciones e integración; sus condiciones y colecciones dependen de las familias expresamente excluidas. No basta inventar un aporte o nombrar etapas.

El ensayo recibido se ejecuta en caché propia con la misma receta. La API real admite una factura de 30.000, retenciones 111,11 y pagos 222,22; variar ingresos a 31.000 modifica rendimiento, variar retención a 112,11 o pago a 224,22 afecta al diferencial separadamente y conserva cuota posterior. Las instancias de las etapas reales son distintas. El causal rechaza al alcanzar `blockedFamily`, antes de emitir un falso cierre. Esto demuestra la dependencia y respalda el bloqueo. DA61 de actividad seleccionaría cero en fuente, pero su ruta completa también se detiene antes en esa dependencia; las otras tres variantes consumen directamente el aporte. Ninguna queda cubierta por las pruebas laborales.

Objeción experta: una muestra no prueba cada una de las 19 familias. Respuesta: no las reviso ni declaro cerradas; pruebo que la ruta solicitada exige su productor excluido y es sensible a entradas reales. Coste futuro citado por el autor: 20–40 h de implementación y 12–24 h de revisión; lo considero una orientación de alta incertidumbre, no una estimación auditada familia por familia. No se inicia ese trabajo.

## Contrato, decoder y APIs

La receta R62 deriva el cuerpo explícito entero, diferencial y retorno a partir de AST con anclas UTF16 y hashes, y reutiliza el intérprete finito común. Las fuentes TS financieras no se ejecutan como productores; `loadTs` se usa solo en el oracle. La decodificación estructural usa schemas reales de Effect y R62 reconstruye desde `decoded.success`, conservando relación con propiedades codificadas. Los contratos laborales alcanzables actuales usan Struct/Union/check, sin defaults ni transformaciones de valor: el control `0.00` conserva exactamente la entrada decodificada. No se presenta esa comprobación como prueba genérica de defaults futuros o transformaciones arbitrarias.

La captura local conserva `origen.instanceId`, unidad y decimal sin reemplazarlo por presentación; los slices incluyen transporte y selección de entrada. Se contrastan propiedades `argumentoArt20`, `rendimientoAntesArt20`, `gastosAE`, `generalesAplicados` e íntegro. Se ejercitan alteraciones de identidad, unidad, decimal, presentación, slice, evento, arista, fuente, software y ejecución contra el verificador. Alteraciones de obligaciones, catálogo, programa y fuente se rechazan en productor y API directa; rutas/modos ajenos se rechazan. El consumidor reconstruye contratos y rechaza descriptor modificado y callbacks externos. No recibe testigos arbitrarios como argumento: no se le atribuye una API inexistente de validación de testigos.

El rechazo por comparación con reconstrucción fuente no equivale a demostrar suficiencia matemática de todos los eventos. R64-PUSH-01 muestra esa diferencia: replay puede reproducir fielmente un testigo defectuoso. Las pruebas propias incluyen expectativas racionales independientes y un contraste del retorno que el ensayo recibido no hacía.

## Schema de ejecución y convivencia

El contrato tiene `$id urn:irobopf:causal-explicitos-r62`; ejecución R62 conserva `$id urn:irobopf:ejecucion-r60`. Sus const de versión/kind y requisitos de salidas sí distinguen R62. Registrar ambos schemas de ejecución en un único Ajv colisiona; se comprueba expresamente y no se oculta como aprobación universal de convivencia.

El consumidor vigente no consulta ese registro: compone/reconstruye el contrato, ejecuta y verifica por igualdad exacta. La validación documental recibida compila únicamente R62 en su instancia. Por tanto el ID repetido es una limitación concreta para registro conjunto, sin defecto funcional demostrado del consumidor actual. Objeción experta: no se debe ignorar una colisión real; respuesta: se documenta y queda acotada, sin convertir una futura integración no existente en bloqueo de valores. Corregir el identificador y su prueba de registro conjunto sería pequeño trabajo posterior; no se modifica producto ni se añade una ronda por esta observación.

## Condiciones, límites y cierre

Individual Madrid 2025, edad 18–64, empleo/pensión de clases admitidas, hechos y gastos efectivos preadmitidos; sin otras rentas, familiares, discapacidad, reducciones, arrastres ni extranjero. Servicio normativo concreto y runtime/Decimal fijados, datos ordinarios finitos, arrays densos, ejecución síncrona sin reconfiguración hostil. No hay equivalencia universal de Effect, prueba dimensional universal, autenticación documental ni aceptación fiscal. `enlazarRastroAnualActual` sigue excluido de wiring; cuatro flags falsos.

Se leen los informes y resultados completos del autor y la recepción, D131–D135, contrato y coordinación. Tipos TS principal/vendor y lint global verdes son evidencia de recepción, no pases nuevos propios. CheckJs estricto permanece rojo: 1.302 diagnósticos, 232 nuevos; sus cinco globales del host del autor y el principal verde del padre son configuraciones distintas. No se desactiva strict, no se añaden tipos ficticios y no se afirma deuda exclusivamente heredada. No se repiten suites legacy, builds ni la revisión favorable de otros lotes.

No hay nueve cierres completos nuevos que sumar sin corregir R64-PUSH-01. Sí hay corroboración local de esos nueve y bloqueo de actividad demostrado. Tras el arreglo basta contrastar el defecto, sus aliases/retornos y las regresiones pertinentes; las conclusiones favorables no requieren otra revisión completa. El padre conserva el contraste mecánico y sustantivo y la decisión final del alcance. Los 55 cierres anteriores no se reabren.

El transporte propio incluye manifiesto exacto por ruta, hashes SHA256/SHA512/tamaño/modo/baseSha256, patch gzip LF binario y objetos de binarios/vacíos. Se reconstruye en scratch sin checkout y se cotejan conjunto, bytes y modos. Sobre y recibo terminal quedan fuera del payload, sin autorreferencia. No se elimina scratch ni se reescriben rojos históricos. El primer cotejo físico propio fue sin lock y se repitió íntegramente bajo lock antes de escribir, ambos sin diferencias; el terminal usa el lock y compara blobs individuales, no diff.

## Validación terminal propia

Pasan los dos ensayos recibidos (25 casos/225 salidas y bloqueo), 17 casos propios/153 salidas con 84 expectativas racionales, diez alteraciones de testigos y controles de contrato/contexto/consumidor. Las cifras se presentan separadas: hay solapamiento entre recibidos y propios y no se suman como pruebas únicas. Los dieciséis casos propios anteriores se conservaron tras pasar antes del error manual del caso positivo; el cierre recoteja sus expectativas desde los testigos y ejecuta el caso corregido y los adversos aún no alcanzados.

Pasan dos regresiones pertinentes del núcleo (once omitidas por filtro), el schema estricto de 25 originales con dos replays y el control esperado de colisión de registro R60/R62. Veinte anclas coinciden. Oxlint focalizado con los 16 errores activos y plugins reales termina0 tras corregir un nombre local de test; ESLint focalizado termina0 con aviso de React del host. Se conserva el rojo de lint y su preimagen, sin desactivar reglas. El fixture negativo prueba ambos plugins con exit1 esperado. No se repite tipado global ni checkJs ya documentado en recepción.

El test rojo R64-PUSH-01 termina1 y queda sin arreglar, con `pushLengths:[1,1]`, cero pasos retornados y nueve salidas capturadas. RESULTADOS.json y COMANDOS.json separan éxitos, fallos y omisiones. Los fallos iniciales de arnés, resolución de dependencias y ausencia de Node, junto con los originales por hash, permanecen conservados. La primera búsqueda de paquetes por hash en CAS no encontró el sobre; se cotejaron sus archivos exactos del autor ya terminado: payload JSON descomprimido f7576fb20095c859bcbdab67a5e4e9de4b5382b004f84eb5e2dce920a07a4fba, gzip cad11136703c75f924fcc001ada5c9b3e0dbb348fcd4d4b41f8a39e9b477cc0d. PAQUETES-RECIBIDOS.json preserva ambos niveles y el patch/sobre. No se leyó trabajo parcial de otros hijos activos.
