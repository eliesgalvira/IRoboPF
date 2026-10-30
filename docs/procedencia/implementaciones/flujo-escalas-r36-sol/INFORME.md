# Escalas, bases y mínimos R36: implementación candidata

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `50f9e949544e20d3e4e0bffc79b926d396267319`.

La entrega implementa un programa finito consumible para las 28 salidas asignadas. No es aprobación fiscal, revisión independiente, admisión del caso, wiring ni cierre del encargo global. Las conclusiones nuevas requieren contraste de integración. `valueClosed`, `selectionClosed`, `siteClosed`, `completeRuleAcceptance` y `wiringAllowed` permanecen false: las ejecuciones son condicionadas a los contratos externos y a la admisión pendiente, no una promoción automática de los booleanos R23.

## Representación y consumidor

`flujo-escalas-r36.mjs` baja el subconjunto concreto del software fijado a operadores con operandos y fuentes UTF16. Rechaza una fuente distinta o una construcción desconocida. Resuelve cada importación por archivo y símbolo y cada local por su entorno lexical. No une productores por el número ni por el parecido del nombre. Conserva parámetros, defaults, destructuración de objetos y parejas, resto de objeto, precedencia de spreads, callbacks, folds y semilla, selección condicional y cortocircuito, bucles y asignaciones.

Las funciones propias financieras, las conversiones, los selectores anuales/territoriales, el ahorro y el cálculo de derechos se descomponen. Decimal conserva su primitiva aritmética; Match, Option y Array de Effect son primitivas estructurales. No se convierte un helper financiero propio en terminal opaco. El consumidor ejecuta JSON y no importa el motor ni evalúa texto TypeScript. Los imports de TS pertenecen al productor y al contraste suplementario de pruebas.

Cada registro `outputBindings` conserva sitio, llamada, argumento importe, unidad EUR, operación del importe, operación de la línea e instancia singleton/índice. El programa representa el retorno de cada callback y la creación real de `origen.instanceId`, `origen.decimal` y `origen.unidad`. El decimal exacto procede de `importe.toFixed()`. El formato visual a dos decimales no sustituye ese dato. La traza conserva eventos y caminos de invocación; dos llamadas con la misma cifra siguen siendo instancias diferentes.

Se proyecta el cálculo anual hasta las líneas propias y la ruta explícita hasta sus seis líneas propias. No se ejecutan el rastro activo, el publicador ni la conciliación de presentación legacy; tampoco se duplican las líneas de los otros lotes. Se omiten cronometraje y acumulación visual de `pasos`, manteniendo sus puntos de fuente. El campo del catálogo `deduccionesAutonomicasSoportadas` no pertenece a la proyección numérica: no se ejecuta el catálogo para inventar un importe por código.

`propertyBindings` conserva receptor e índice/propiedad; `callBindings` conserva operandos posicionales. Las condiciones ejecutables están en los operadores if/conditional/binary y sus referencias, no en una frase de autoridad. `dataRoutes` conserva las rutas históricas R23 por año, territorio, celda, token, alias e importación. Son evidencia técnica, no aceptación nominal heredada. Los operadores actuales y sus fuentes fijadas permiten ejecutar las tablas y sus selectores. Los contratos dimensionales distinguen EUR de base, EUR de impuesto, céntimos, ratio, recuento, año y fecha; no se presenta la etiqueta genérica de una propiedad estructural como una inferencia dimensional universal.

## Recorridos implementados

Las tres bases anuales siguen las salidas concretas de trabajo, inmobiliario y ganancias: el suelo de trabajo se aplica antes de añadir los otros sumandos con signo; BLG conserva BIG; ahorro satura su ganancia sujeta. El explícito conserva BIG/BLG con signo y usa max(neto,0) únicamente para tarifas. Trabajo consume rendimientoAntesArt20 y argumentoArt20 por vías distintas y resta una vez la reducción limitada; EDS consume el aporte ya reducido.

La cuota general y sus cuatro familias de líneas de tramos se seleccionan por `!escalaAutonomicaIgualEstatal`, no por el nombre del territorio ni el modo laboral. El flag permanece false en 2012–2015 incluso para simulada; desde 2016 la simulada toma conjunta legacy y no emite tramo autonómico. En 2026 el selector real devuelve NoSoportada, mientras la simulada conserva la continuidad técnica. No se amplía esa frontera territorial.

En cuota publicada se elige la última fila elegible en orden de array y se calcula Q+(B−L)t. El límite superior mostrado no reconstruye Q. En integrada se acumulan anchos desde el límite anterior y solo se emite importe positivo. Undefined y array vacío son contratos distintos. Murcia conserva B>60000. Madrid2020 sigue la tabla integrada de su año; Madrid2025 ordinaria puede usar publicada, que se omite si existe fecha de fallecimiento. Galicia conserva su selección por BG y los cortes de Balears, Valencia y Extremadura conservan sus métodos civiles o por instante.

Las seis salidas de mínimos separan contribuyente, ascendientes, descendientes y discapacidad por rol; estatal y autonómico se calculan con juegos distintos. El helper familiar ordinario conserva sus propios filtros y orden; el cálculo de derechos conserva renta del descendiente, renta del titular, grado, selección de titulares, orden por nacimiento/sujeto, divisor por sujeto e incremento por edad o inicio. Su validación, constitución, coherencia y conciliación de rentas son obligaciones de admisión identificadas; no se declaran revisadas por ejecutar el cálculo condicionado.

Ahorro bruta y sus líneas de tramo usan conjunta integrada sin pasar publicadas. El postmínimo usa tarifas publicadas por componente y remanentes independientes. Hasta 2014 reduce la base antes de tarifa; desde 2015 resta la tarifa del remanente. El año 2015 no se divide por mitades. La minoración total suma las dos minoraciones; la cuota global anual postmínimo parte de la conjunta integrada menos esa suma. La capacidad de deducción autonómica usa su componente autonómico postmínimo, no una mitad de la conjunta.

La deducción agregada consume `(deduccionAutonomicaAgregadaCentimos ?? 0)/100`. Con escala autonómica real se limita a la capacidad autonómica general más ahorro autonómico postmínimo. La lista de códigos no aporta un importe: su rechazo corresponde a la puerta anual pendiente. Líquida satura después de minoraciones y deducción; diferencial usa líquida convertida a céntimos half-up menos soportadas y pagos, conservando signo. En explícito la líquida legal es anterior a DA61; solo empleo con brutoServicios>0 solicita la cuotaPosterior de ese contrato externo. Pensión y EDS conservan la legal.

## Fronteras y admisión

`fronteras.json` identifica las funciones ajenas de rentas, cotizaciones, art20, adaptadores y DA61 por archivo/símbolo, parámetros, salidas con unidad y usos. Las instancias y operandos reales siguen en el programa. Retención estimada tiene una llamada separada con entrada/contexto y salida importeRetencionAnualCentimos; no se confunde con soportadas. Los callbacks son contratos suministrados para ensayo, no revisión independiente ni certificación de hechos. La ausencia de un callback exigido falla, en vez de convertir la frontera en cero o inventar cierre.

`admissionObligations` enumera los if efectivos del acceso anual, el cálculo anual, el explícito y los validadores de derechos, más la puerta de códigos. Incluye fuentes, condiciones y status pending-review. La decodificación explícita requiere un resultado de frontera. Los testigos de pruebas son sintéticos y solo permiten observar el valor condicionado. El consumidor no otorga admisión pública; componer con R35 y los contratos de los otros lotes sigue siendo requisito de revisión de integración.

## Verificación y límites

Los rojos históricos se reprodujeron antes de escribir la implementación. La copia adaptada de R28 produjo 54 comprobaciones/28 fallos con salida1. R26 volvió a observar cinco mutantes admitidos por su verificador; se conserva su esperado protector y su estado rojo. Los originales y esperados permanecen intactos. Los diffs de adaptación muestran cambio de destino y resolución de TypeScript; las ejecuciones escriben exclusivamente en scratch.

Las pruebas nuevas separan bordes, ramas, celdas, propiedades y llamadas de igual cifra. Las pruebas suplementarias TS contrastan tarifas, selección temporal y ahorro con funciones reales. Ninguna prueba, igualdad de receta, hash o recuento acredita exhaustividad causal o aceptación fiscal. `verifyEscalasR36` verifica la receta exacta y sus referencias; puede conservar un error semántico del autor y necesita revisión posterior. El schema expresa forma y estados pendientes; no es un compilador universal.

Los resultados finales, incluidos fallos de instrumento y entorno, constan en RESULTADOS.json y los logs. No se atribuye a tipos JS dinámicos un tipado estricto completo del intérprete ni del motor. No se ejecutan Next build ni suites legacy masivas. Las dieciséis reglas anti-slop se mantienen a error; oxlint usa un hilo y disable-nested-config. Las pruebas, tipos y generación usan el bloqueo pesado; los cotejos físicos usan un bloqueo autorizado separado, sin anidación.

## Decisiones, objeciones y costes

1. Programa finito concreto, en lugar de declarar terminal el cuerpo de un helper. Objeción experta: un bajador puede reproducir una omisión propia. Respuesta: construcciones desconocidas fallan; pruebas nuevas distinguen ramas/celdas y TS aporta contraste suplementario. Coste: mantener productor y consumidor y exigir revisión nueva de su suficiencia.
2. Fronteras por propiedad e instancia. Objeción: un callback con cifra correcta puede ocultar unidades o una llamada equivocada. Respuesta: parámetros, salidas, archivos, llamadas y unidades quedan explícitos; un callback ausente falla y el cierre permanece condicionado. Coste: composición con cada lote y examen del integrador antes de publicar.
3. Proyección del valor separada de admisión. Objeción: las líneas pueden producirse para hechos que el acceso público rechazaría. Respuesta: resultado marcado condicionado, obligaciones enumeradas y ningún estado de admisión/promoción aceptado. Coste: no usarlo como liquidador público ni como prueba del contrato anual completo.
4. Conservar representaciones distintas aunque una cifra coincida. Objeción: podría parecer duplicación. Respuesta: instancia/propiedad, sumandos, remanentes y rutas por componente siguen separados. Coste: más trazas, sin deduplicación por valor.
5. Preservar evidencias recibidas y fallos propios. Objeción: repetir productores puede sobreescribir históricos. Respuesta: copias en scratch con diff y transporte separado; no se ejecuta un productor con salida histórica. Coste: logs y artefactos adicionales comprimidos cuando exceden1MB.
6. Transporte textual y binario con ensayo real. Objeción: un manifiesto autodeclarado no acredita reconstrucción. Respuesta: GNU patch y copia por ruta/hash hacia scratch nuevo, comparación de todos los bytes, además del cotejo físico completo. Coste: almacenamiento de ensayo; integridad sigue separada de suficiencia y fiscalidad.

## Conservación

Las referencias documentales y sus reservas constan en el fragmento y los informes históricos; no se incorpora una nueva validación de originales.

Resultado final de calidad: pasan17 grupos de pruebas, schema y siete mutaciones, tipos de las pruebas, checkJs del alcance y oxlint con16 reglas aerror. El tipado del intérprete es dinámico y no estricto; no se presenta como prueba semántica independiente.
