# Dictamen limitado de R64-PUSH-01 y reparación R65

Alcance: versión y condiciones examinadas en este dictamen. El [informe final](../../INFORME-FINAL.md) reúne el resultado de los 65 sitios y sus límites.

La reparación elimina el defecto reproducido bajo las condiciones del lote. El contraste independiente obtiene longitudes `[1,2]`, dos pasos íntegros y el retorno completo idéntico a la API financiera TS real antes del campo editorial `procedencia`. La segunda mutación depende de la primera; el retorno depende de ambas. No se reproduce un defecto nuevo que justifique otra ronda. Procede que el padre cierre el lote bajo sus condiciones y termine INFORME-FINAL.md, sin pedir otra revisión favorable.

Base examinada: `a8c7ebec1985beaf2d0f7f0125b68dec7bf4a15b`.

## Contraste del defecto

Se examinaron D131–D136, INFORME y DICTAMEN10 R64, y el informe, cambios, validaciones, documentación, receta y rojos R65. El rojo anterior conserva `[1,1]`, cero pasos y nueve salidas capturadas; la misma aserción recibida pasa tras el arreglo. No se reejecutó aquí aquel rojo: sus reproducciones anteriores permanecen preservadas.

Lectura personal del núcleo y diff contra `nucleo-previo.ts.txt`: el alias compartido de arrays está condicionado a `causal-explicitos-r62`. `raw` se muta en su identidad y el mapa `props` se comparte. La ruta común de alias cubre local, bind, propiedad, parámetro, capture, return y function-return. Los objetos ordinarios todavía copian sus mapas de propiedades; los arrays hijos conservan la identidad compartida. El WeakMap de versiones nace dentro de cada evaluación. Solo push R62 lo rellena, por lo que las adiciones de mutationEdges no introducen aristas nuevas en los modos anteriores.

Antes de cada push, array-selection fija cardinalidad y receptor. array-push enlaza esa selección como previous-state y los argumentos; el segundo alcanza la primera versión por mutation-state del receptor/selección. push-length enlaza la mutación y vale 1/2. Las lecturas de alias/propiedad/longitud/selección consultan la última versión. emit usa shown al emitir: los valores históricos serializados no son la referencia viva. No basta observar out.lines ni aceptar replay compartido como oracle independiente.

El control propio `independiente.test.mjs` ejecuta una entrada real admitida de 16.576, conserva entrada y evidencia, contrasta TODO el retorno con la API real, cada snapshot con el prefijo del rastro real y selecciones previas `[0,1]`. Prueba la ancestría de ambas mutaciones y de la primera hacia la segunda. Ejecuta de nuevo con otro execution: igualdad íntegra tras normalizar solo ese identificador, todas las aristas dentro de su ejecución, entrada y evidencia previa intactas. El recorrido real contiene aliases de arrays en local (183), propiedad (71), parámetro:0 (50), return (18) y function-return (64). Es cobertura de las rutas existentes, no un programa sintético adulterado aceptado como contrato legítimo.

Las tres pruebas R65 recibidas se ejecutan personalmente: empleo laboral, estatutario y pensión con dos rendimientos y dos retenciones. Contrastan datos completos de ambos pasos, snapshots, aristas anteriores, ancestría y consumidor de pensión. Se solapan con los tres casos ya pasados por el padre; no son seis casos distintos. El control propio comparte la entrada del rojo y añade expectativas sobre retorno total, estado previo y aislamiento. No repite la matriz de nueve valores ni los 55 cierres anteriores.

## Decisiones individuales y alcance

DICTAMEN10.json conserva las diez decisiones con evidencia, objeción experta, respuesta, coste y alcance. En los nueve IDs laborales se levanta exclusivamente la suspensión de propagación debida a R64-PUSH-01; siguen vigentes las corroboraciones de valores/selecciones de R64. La reparación no cambia fórmulas fiscales ni convierte esa corroboración en aceptación jurídica.

La decisión de actividad conserva el bloqueo ya demostrado: el adaptador requiere calcularActividad2025 y sus etapas/aporte de las familias excluidas. Compartir arrays no crea ese productor ni elimina blockedFamily. No se repite la revisión favorable del bloqueo. Las variantes de actividad de otros sitios tampoco se convierten en cubiertas. La colisión documentada de $id R60/R62 sigue siendo límite de registro conjunto; no se reabre como defecto del arreglo.

Objeción experta principal: compartir raw sin props perdería lecturas, y compartir referencias sin snapshots reescribiría la historia. Respuesta: contraste de retorno y snapshots contra oracle TS independiente del intérprete, aristas previas y dos ejecuciones aisladas; ambas partes de identidad se comparten solo en el modo admitido. Coste: mantenimiento de semántica mutable acotada y testigos ligados a software; no se compra universalidad con esta prueba finita.

## Validación, límites y cierre

RESULTADOS.json y los comandos originales separan pruebas propias, recibidas, regresiones, fallos de preparación y omisiones. La pasada inicial tiene siete pruebas correctas, una documental detenida por dependencia Ajv y quince omitidas por filtro. Los siete pases son tres R65, uno independiente y tres regresiones: SS 2025 compatible-legacy (cuatro vectores, comparación con núcleo previo excluyendo solo software), retenciones directo y racional de base. No se suman con los pases previos del padre. Solo se repiten las comprobaciones detenidas por preparación. Ningún rojo funcional histórico se elimina.

Tipos principal/vendor y lint global de recepción se mantienen como evidencia del padre, no ejecuciones nuevas propias. Se leen y conservan sus rojos de tipos/lint y rectificación del fs/mkdir R64. No se han añadido tipos ficticios ni desactivado reglas. CheckJs estricto sigue pendiente: 1.302 diagnósticos, 232 nuevos del lote. El control MJS de esta revisión es ejecución y lint focalizado, no aprobación global de tipos MJS. No se hacen builds ni suites legacy masivas.

Las afirmaciones se limitan a descriptor exacto reconstruido desde fuentes y hashes, runtime/Decimal fijados, ejecución síncrona, datos ordinarios finitos y arrays densos, hechos y derechos preadmitidos, Madrid 2025 individual 18–64 trabajo/pensión en los perfiles admitidos. No cubren ciclos, objetos hostiles, transformaciones arbitrarias del decoder ni programas mutables ajenos al descriptor. No se abren composición, admisión ni cuatro puertas; flags siguen false. No hay autenticación documental ni autoaceptación fiscal.

Pendiente dentro de este lote tras recepción del dictamen: cotejo del padre y redacción de cierre, aproximadamente 0,5–1,5 h; cero rondas nuevas previstas si no aparece defecto reproducido. El trabajo excluido no se absorbe: actividad/familias19 conserva orientación histórica 20–40 h de implementación y 12–24 h de revisión, incertidumbre alta, sin estimación auditada por familia. No se inicia. El padre puede mantener los 55 anteriores, cerrar los nueve bajo condiciones y registrar el décimo como bloqueo demostrado; INFORME-FINAL.md y parada.

## Integridad y transporte

El cotejo inicial bajo lock físico comparó 24.058 entradas con blobs individuales (lstat/readlink/bytes/ejecutable), sin diferencias; extra administrativo .git. Se conserva su resultado y el script del cotejo terminal, que vuelve a examinar todas las entradas y censa todos los extras. Diff vacío no se usa como sustituto. Las incidencias iniciales de herramientas ausentes se conservan, resueltas con Nix. effect-solutions list/show testing y data-modeling se consultaron con Bun después de fallar su resolución bajo Node; se consultó fuente local Effect/Schema.

El manifiesto R64 recibido coincide con `2d264ba3e2a089ee42bcc8b7237ca82bb91b514d616e17ba786ae384c56a8532`; patch `fd0bc3b1804eefcd90da0c60d790fe8b915a74b83dfc9042eb76cafd444e381c`. Se distinguen las bases del revisor cd41524 y de recepción ae3d743; no se aplica un patch a otra base ni se migran pins. Originales técnicos examinados se conservan por hash propio y sus rutas en originales.json, sin tocar CAS ajeno ni fuentes históricas.

El sobre MANIFIESTO.json y RECIBO-TERMINAL.json quedan fuera del payload. Patch gzip contra la base exacta, objetos binarios/vacíos por hash, hashes SHA256/SHA512, tamaño y modo por ruta. La reconstrucción se hace en scratch sin checkout desde preimágenes, patch y objetos, con conjunto exacto, bytes y modos comprobados, incluido un vacío explícito. No se borra nada al cerrar. Las rutas de transporte y reconstrucción están expresamente excluidas del payload para evitar autorreferencia; no hay logs abiertos incluidos mientras se cierra.

Validación documental propia final: exit0, contrato y testigo Ajv estricto, replay nuevo, rechazo del testigo anterior y de mutación sin aristas. El testigo regenerado coincide byte a byte con el actual d2a8f87b…; no se actualizó ningún pin. Lint focalizado final exit0 con las 16 reglas a error y plugins reales: 23 fuentes cotejadas idénticas antes de usarlas desde la ubicación de dependencias del padre. El fallo inicial de resolución permanece. Total propio ejecutado: ocho pruebas distintas, quince omitidas; no se suma con las del padre.
