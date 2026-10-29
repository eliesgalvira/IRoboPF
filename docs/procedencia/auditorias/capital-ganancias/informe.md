# Auditoría candidata de capital inmobiliario, ganancias e integración

Fecha de corte: 29 de octubre de 2026. Ámbito: ejercicios 2012–2026, régimen común. **Ningún hallazgo está aceptado.** Este informe es la primera lectura documental y requiere contrarrevisión independiente. No certifica una liquidación completa ni la vigencia al futuro cierre de 2026.

Se examinó el código de los dos módulos de rendimientos, ambas bases, contrato de entrada, selección histórica de ganancias y cadena de liquidación. Se leyó el encargo, contrato de auditoría, coordinación, lint, README, AGENTS, glosarios, producto, ADR y alcance legacy. No se escribió código de motor, no se ejecutaron builds ni suite legacy, no hubo commits, inicialización de VCS, movimientos de bookmarks ni operaciones Git. `instantanea-motor.json` identifica por hash los archivos examinados; las líneas pueden cambiar en el checkout compartido, por eso los hallazgos señalan símbolos.

La matriz `cobertura.json` contiene 349 combinaciones de hallazgo/ejercicio con los 17 territorios de régimen común expresados explícitamente. Son 32 hallazgos candidatos (5 mismatch, 20 missing, 5 ambiguous y 2 match acotados) y **cero aceptados**. Se enlazan 17 documentos originales y 95 citas candidatas, con 752 segmentos reextraídos literalmente. Las filas no equivalen a 349 verificaciones documentales anuales independientes. Navarra y País Vasco no pertenecen al tipo de entrada; `simulada-estatal` es un supuesto técnico, no un territorio fiscal. Autónomos quedan fuera: la futura integración de su rendimiento neto pertenece al componente del artículo 48.a.

## Diferencias ejecutadas

Se importaron las funciones reales con Bun desde un script propio en scratch. `resultados-motor.json` preserva los seis resultados. No son tests aceptados: son reproducciones para que el segundo auditor prepare una prueba roja antes del fix.

- **CG-01. Pérdidas eliminadas.** Con ganancias de 10.000 € y −4.000 €, el motor devuelve 10.000 € sujetos y −4.000 € exentos. El saldo ordinario compensado es 6.000 € y la exención cero. Una pérdida sola también termina como exención negativa. `Decimal.min(gananciaTotal, exenciones)` y el posterior `max(0, ...)` actúan por operación antes de integrar.
- **CG-02. Compra de 2012 y venta posterior.** Un inmueble urbano comprado onerosamente el 1-6-2012, sin vinculación, vendido en 2025 con 10.000 € de ganancia, no recibe exención. El original del RDL 18/2012, disposición final tercera, página PDF 8, limita la fecha de adquisición; no exige venta en 2012. La candidata es exención de 5.000 €.
- **CG-03. Renta vitalicia en 2014.** El motor exime 10.000 € si el contribuyente tiene 70 años y declara reinversión completa. La Ley 26/2014 introdujo el artículo 38.3 con entrada en vigor el 1-1-2015, páginas PDF 22 y 79. Esta exención concreta no corresponde a 2014.
- **CG-04. Acumulación de vitalicias.** Dos ventas de 200.000 € y ganancia de 100.000 € cada una, con reinversiones previas cero en ambas, eximen 200.000 €. La cantidad reinvertible total es 240.000 €; con esas proporciones la ganancia exenta máxima sería 120.000 €. Se clasifica ambiguo porque un llamador podría aportar acumulados actualizados por operación; el motor no exige ni comprueba ese contrato.
- **CG-06. Fechas ausentes en 2014.** Una transmisión sin fechas acaba en ahorro. Su base no puede determinarse sin antigüedad. La misma ausencia puede ocultar una transmisión de permanencia inferior al año.

La exención de vivienda habitual de mayores de 65 años y la de renta vitalicia no son intercambiables. El filtro de año que falta en la segunda no debe eliminar la primera de los ejercicios anteriores.

## Alquiler: fórmula y condiciones ausentes

El código reconoce expresamente una simplificación: neto igual a íntegro. El tipo `RendimientoCapitalInmobiliario` solo contiene `importeIntegroCentimos`. Esto impide expresar los hechos necesarios; no es una tabla de 2025 aplicada a todos los años, sino ausencia de cálculo de neto en todos ellos.

La secuencia candidata es: individualizar inmueble/titularidad y renta exigible; deducir gastos con sus límites; calcular amortización; obtener neto; aplicar reducción de vivienda que corresponda por ejercicio y contrato; aplicar irregularidad cuando proceda; comprobar mínimo por parentesco; integrar en general. Los días no alquilados pueden generar imputación separada.

**Gastos (CG-08 a CG-13).** Intereses, financiación y conservación/reparación comparten un límite por inmueble igual al ingreso íntegro. El exceso dura cuatro años; los pendientes tienen prioridad. No se agrega el límite entre inmuebles, pero sí se consideran los contratos sucesivos del mismo inmueble. IBI, tasas no sancionadoras, comunidad, administración, seguros, formalización, defensa jurídica y suministros soportados no quedan sometidos a ese mismo tope. Una mejora aumenta valor amortizable; no se deduce como reparación. Principal de préstamo no es gasto. IVA/IGIC deducible no debe incluirse en el gasto de renta. Lo repercutido al inquilino puede ser ingreso y gasto simultáneamente.

Ejemplo independiente: ingresos 5.000 €, intereses/reparación 7.000 €, otros gastos 500 €: neto −500 €, exceso de intereses/reparación 2.000 € pendiente. No procede recortar todo el rendimiento a cero ni trasladar esos 500 € como si fueran financiación.

**Amortización.** Inmueble: hasta 3 % del mayor entre coste y valor catastral, sin suelo. Mobiliario y enseres: tabla, con coeficiente de ejemplo del 10 %. Derecho temporal: coste/duración; vitalicio: 3 %, con límite de ingreso del derecho. Hace falta límite acumulado, mejoras, titularidad y prorrata temporal. El manual 2014, página PDF 131, excluía el valor heredado del coste satisfecho; el manual 2024, páginas 275–277, lo incluye conforme al criterio posterior. **No se acepta convertir la diferencia de manuales en un cambio legal desde un año determinado.** Falta el original judicial y resolver su alcance temporal.

**Dudoso cobro.** Se declara lo exigible y se deduce el saldo si cumple los requisitos, con ingreso posterior al recuperar lo previamente deducido. Los manuales 2020, página 233, y 2021, página 224, recogen más de tres meses; el régimen ordinario exige más de seis meses o concurso, sin renovación del crédito. La igualdad exacta al plazo no satisface «más de». Se incorpora el RDL 35/2020 como original de esta excepción.

**Reducción de vivienda (CG-14 a CG-17).**

- 2012–2014: 60 %, también sobre netos negativos; 100 % sobre positivos con arrendatario de 18–30 años y rentas de trabajo/actividad superiores al IPREM. Para contratos anteriores a 2011 con ese arrendatario, transición hasta cumplir 35 años. Reparto por inquilinos y días de cumplimiento. Original: Ley 39/2010, artículo 69, PDF 71; manual 2014, PDF 132–133.
- 2015–2023: 60 % sobre neto positivo. Negativo sin reducción. Se elimina la reducción del 100 % por joven. La condición de declaración/autoliquidación tiene reforma en 2021 y jurisprudencia previa: no aplicar el criterio posterior de comprobación a toda la serie sin análisis.
- 2024–2025: contratos anteriores al 26-5-2023 conservan 60 %. Nuevos: 50 % ordinario; 60 % rehabilitación finalizada dentro de los dos años previos; 70 % por los supuestos legales de primer alquiler a joven en zona tensionada o alquiler social; 90 % por nuevo contrato con rebaja **superior** al 5 % y demás condiciones. Una rebaja exactamente del 5 % no cumple ese umbral. Las reglas nuevas se aplican desde renta 2024, no a renta 2023 aunque el contrato se firme después del 26 de mayo. Ley 12/2023, PDF 49–50 y 61; manual 2024, PDF 281–285.
- 2026: se incorpora el original RDL 29/2026, no una proyección de 2025. PDF 48–50 contiene una nueva escala de reducciones condicionadas: 100/95/90/85/70 %, reglas de mantenimiento o subida de renta, primera puesta en alquiler, 70 % social, 60 % rehabilitación y 80 % para determinadas prórrogas. **La transición es indispensable:** PDF 62–63 conserva régimen anterior para contratos anteriores a Ley 12/2023 y para los celebrados entre su entrada en vigor y el 1-12-2026. La prórroga del 80 % tiene su propia condición temporal. El límite exacto de la expresión «entre ... y el 1 de diciembre» requiere revisión. Se debe seguir la convalidación y cualquier cambio posterior; el ejercicio no está cerrado.

No se reduce por vivienda un alquiler turístico o temporal. Para persona jurídica arrendataria, el manual 2024 distingue uso genérico por empleados de ocupantes físicos identificados; no basta un booleano «empresa». Zonas tensionadas requieren resolución territorial y vigencia, no solo comunidad autónoma. Las resoluciones locales concretas no están inventariadas en este lote: falta esa cobertura territorial para activar porcentajes incrementados.

**Irregularidad y renta antigua (CG-18).** 40 % hasta 2014; 30 % desde 2015, límite de base 300.000 € y condiciones de imputación única, con transición de fraccionamientos anteriores. Orden tras reducción de vivienda. Contratos anteriores al 9-5-1985 sin derecho a revisión: gasto adicional igual a amortización. No está modelado ninguno.

**Medida extraordinaria 2021 (CG-31).** Rebajas voluntarias de alquileres de determinados locales para enero–marzo de 2021 pueden constituir gasto adicional para arrendadores no grandes tenedores. Deben verificarse actividad del arrendatario, fecha del acuerdo, vinculación y ausencia de compensación posterior. Manual 2021, PDF 225–226. Es renta del arrendador y permanece dentro de este dominio.

## Imputación, parentesco e integración

CG-19: el motor no recibe inmueble, catastro, uso ni días. El mínimo por cónyuge o familiar hasta tercer grado del artículo 24 se aplica después de reducciones. Artículo 85: 2 % o 1,1 %, con regla histórica de revisión catastral, falta de valor notificado y prorrata. Antes de 2015, referencia de revisiones desde 1994; desde 2015 ventana legal del período y diez anteriores; existen excepciones posteriores. El original RDL 29/2026, PDF 47, extiende para 2026 la regla del 1,1 % con revisión desde 2012. Su nueva escala de imputación y modificación del mínimo por parentesco tienen efectos **desde 2027**, PDF 63–64: quedan fuera del cálculo 2012–2026. Falta completar la cadena original de extensiones 2023–2025.

CG-20: general separa rendimientos/imputaciones y ganancias no integrables en ahorro. El límite de pérdida patrimonial contra rendimientos positivos es 25 % en 2012, 10 % en 2013–2014 y 25 % desde 2015. Hay cuatro años de arrastre y obligación de compensar al máximo posible. Las pérdidas previas a 2013 conservan reglas transitorias; las pérdidas de transmisiones cortas de 2013–2014 pendientes pasan al componente de ganancias de ahorro desde 2015. La edad del saldo es un dato fiscal, no una suma sin procedencia.

CG-21: ahorro contiene capital mobiliario y transmisiones, con compensación interna previa. Compensación cruzada ordinaria: no permitida en 2012–2014; 10 % en 2015; 15 % en 2016; 20 % en 2017; 25 % desde 2018. Fuente exacta de escalonado: **disposición adicional duodécima**, Ley 26/2014 PDF 50. No es la DT38. Saldos anteriores a 2015 tienen restricciones de origen y no reciben automáticamente la nueva cruzada.

CG-22: preferentes y deuda subordinada tienen régimen especial. El manual 2014 PDF 413–415 impide afirmar sin matices que en 2014 nunca hay cruzada. Falta incorporar original de la DT39 y el seguimiento de agotamiento de cada bolsa.

`calcularBaseImponibleAhorro` únicamente toma ganancias y hace `max(0, ...)`; no existe capital mobiliario ni arrastres en la entrada. La base general suma netos y ganancias, sin las bolsas separadas. Las constantes 0,10/0,25 de normativa no implementan la compensación por estar declaradas.

## Transmisiones y liquidación

CG-23 a CG-25: la ganancia se recibe precalculada. No existen precio de compra/venta, costes, mejoras, amortizaciones mínimas ni actualización histórica de inmuebles; tampoco FIFO, recompras, pérdida por consumo o donación, abatimiento pre1994 y límite acumulado de 400.000 € desde 2015. La ausencia debe constar como cálculo externo pendiente de evidencia, no como cobertura del motor.

Se reconoce vivienda habitual por etiqueta de mayores de 65 años, pero no dependencia severa/gran dependencia como alternativa ni reinversión general de vivienda habitual. Plazos de habitualidad, abandono, venta de derechos y reinversión quedan sin comprobar. Para vitalicia hay límites adicionales de periodicidad, comienzo del cobro, reducción anual máxima de renta, comunicación a aseguradora y regularización; manual 2015 PDF 444–446. El plazo del importe retenido tiene excepción propia, por lo que no basta imponer seis meses a todas las cantidades.

CG-32 añade una laguna detectada en el original de octubre de 2026: DA65 para determinadas transmisiones onerosas de vivienda desocupada a entes públicos de vivienda social, con valor total inferior a 800.000 €, exención íntegra hasta 200.000 € y fórmula decreciente. PDF 59–62 contiene condiciones de desocupación, cotitularidad y reinversión adicional. La puesta en funcionamiento de la cuenta depende de desarrollo y fechas específicas; no se da por operativa.

CG-26: base liquidable general se iguala a imponible y `reducciones` es `ReadonlyArray<never>`. Es una hipótesis válida solo sin reducciones ni arrastres. CG-27: la reducción de trabajo se llama sin otras rentas; hay que contrastar el umbral de 6.500 € con el auditor de trabajo. CG-28: el rastro omite la ganancia general en la fórmula visible y afirma que transmisiones van a ahorro, incorrecto para 2013–2014. CG-29: el mínimo del ahorro usa el máximo de remanentes estatal/autonómico con tarifa conjunta; requiere coordinación con mínimos/escalas y fuente anual antes de decidir corrección. Las tarifas de ahorro pertenecen al auditor de escalas; aquí no se certifican.

Los dos `match` son estrechos: suma de importes e integración ordinaria inmobiliaria en general; clasificación temporal de transmisión positiva con fechas válidas. No validan netos, exenciones ni compensaciones.

## Evidencia, límites y decisiones

`documentos.json` recoge originales por hash, URL canónica/final, fecha de recuperación, HTTP, cabeceras disponibles, SHA256/SHA512, tamaño y MIME. ETag/Last-Modified solo existen si el servidor los devuelve. No se inventan. Los originales permanecen en `.cache/procedencia/sha256/`; los alias de metadatos propios, scripts y textos de trabajo en `.cache/procedencia/capital-ganancias/`.

`citas-candidatas.json` conserva páginas físicas 1-based, bloques con cajas en puntos de origen superior izquierdo y texto exacto obtenido de esas cajas por PyMuPDF. Las citas están agrupadas por página para revisión, con segmentos individuales y celdas localizadas del cuadro de reducciones. **El revisor debe descartar bloques contextuales y elegir el pasaje definitivo**, especialmente en páginas con más de un artículo. Las citas HTML tienen selector real y no simulan páginas ni facsímiles. `verificacion-citas.json` solo verifica hash y reextracción literal; no verifica interpretación ni autenticidad jurídica.

La petición BOE `p=20120101` devolvió texto actual. Su metadata se conserva en scratch como evidencia del incidente, pero no se utiliza como prueba histórica. Se repitió con la versión publicada `p=20111231`; artículo 23 muestra la redacción histórica esperada. La fecha de URL por sí sola nunca acredita la versión.

Decisiones y costes explícitos, también registrados por hallazgo:

1. **Separar missing de mismatch.** Objeción del experto: el usuario necesita conocer la cifra incorrecta, no una clasificación indulgente. Motivo: gastos y hechos que el contrato no permite introducir son prestaciones ausentes; eliminar pérdidas introducidas sí es contradicción ejecutada. Coste aceptado: proponer ampliación de contrato y rechazo explícito de supuestos antes de cualquier fix aritmético.
2. **No usar Excel como autoridad para este dominio.** Objeción: se pierde el contraste solicitado. Motivo: se leyó el generador y sus dos rutas solo admiten salario; no hay entradas equivalentes a estos casos. Coste: la comparación queda «fuera del oráculo», sin cargar el Excel ni fingir coincidencias. Se precisan fixtures fiscales nuevos.
3. **Reutilizar originales de caché compartida.** Objeción: otra descarga podría tener una versión distinta. Motivo: se preserva metadata y hash concreto, se abre ese blob y se cita su contenido. Coste: la fecha editorial y el ejercicio del manual deben revisarse por separado.
4. **No extrapolar aceptación anual.** Objeción: una norma con vigencia indefinida basta para muchos años. Motivo: falta cerrar todas las modificaciones y manuales por ejercicio; 2026 demuestra el riesgo. Coste: matriz más amplia que la evidencia y lagunas explícitas; no declarar auditoría normativa exhaustiva terminada.
5. **Citas candidatas sin validación de firma ni imágenes recortadas.** Objeción: no satisface aún la captura oficial definitiva. Motivo: esta ronda produce localización verificable para el pipeline y segundo auditor; hash no autentica emisor. Coste: falta PAdES/CSV y recorte visual reproducible, y ninguna cita recibe aceptación.
6. **Conservar ambigüedad donde el llamador puede prevalidar.** Objeción: podría ocultar defectos. Motivo: distinguir dato externo ya liquidado de fórmula propia evita acusaciones falsas. Coste: documentar invariantes, fechas y acumulados obligatorios; hasta entonces el resultado no acredita una liquidación completa.

Pendientes concretos: manuales de 2012, 2013, 2016–2019, 2022, 2023 y 2026; originales de todas las extensiones catastrales; resoluciones de zonas tensionadas; sentencia de amortización gratuita y de regularización de alquiler; original preferentes; reglamento histórico y reformas de reinversión; coeficientes de actualización 2012–2014 y todas las valoraciones especiales; reglas de operaciones a plazos, opción de compra y atribución de rentas; frontera 29 de febrero en la implementación de fecha; vigencia parlamentaria y desarrollo de 2026. Estas lagunas tienen búsqueda y corpus parcial, pero no pasaje original suficiente para aceptarlas. El manual 2026 no se presupone publicado antes de terminar el ejercicio.

## Reproducción y entrega

Desde la raíz del repositorio:

```bash
nix shell nixpkgs#python3 -c python tools/procedencia/descargar.py 'URL_OFICIAL'
nix shell nixpkgs#bun -c bun .cache/procedencia/capital-ganancias/comparar.mjs
nix shell nixpkgs#python3 -c python .cache/procedencia/capital-ganancias/fronteras.py
nix shell nixpkgs#python3 -c python .cache/procedencia/capital-ganancias/informe.py
nix shell nixpkgs#uv nixpkgs#python3 -c bash -c 'export LD_LIBRARY_PATH="$(nix eval --raw nixpkgs#stdenv.cc.cc.lib.outPath)/lib"; UV_PYTHON_DOWNLOADS=never uv run --python "$(command -v python3)" --with pymupdf python .cache/procedencia/capital-ganancias/citas.py'
```

La primera ejecución de uv eligió un Python genérico incompatible con NixOS; la siguiente necesitó `libstdc++.so.6`. Se resolvió usando Python de Nix y la biblioteca de su compilador mediante entorno local, sin instalación global. Descargas serializadas por la herramienta compartida, sin paralelismo propio. Extracción textual, sin rasterizar manuales completos.

La entrega incluye informe, hallazgos, citas, cobertura, manifiesto de documentos, instantánea del motor, resultados de seis casos reales, 37 expectativas independientes y comprobación literal de citas. Tras regenerar informe.py y citas.py, ejecutar también `nix shell nixpkgs#python3 -c python .cache/procedencia/capital-ganancias/finalizar.py` para enriquecer las versiones documentales. El siguiente auditor debe abrir originales, revisar las objeciones, completar la vigencia requerida por cada caso y solo entonces aceptar o rechazar. El orquestador integra los documentos; este auditor no acepta ni corrige sus propios hallazgos.
