# Contrato candidato, sin habilitación del motor

Identidad de revisión: agente Codex de este hilo, checkout `t3-6e7aee17`, rol `/root` dentro del encargo de revisión. No es una persona ni una autoridad fiscal independiente. Base `5799bb03826719a4dd3500a962e2d6bb5124fdca`. Las siete identidades documentales constan en `versiones-7.json`; cada una tiene veinte decisiones en `matriz-140.json`. Todos los estados de aceptación fiscal son falsos.

## Selección y hechos

La selección exige ejercicio, fecha de pago, período al que corresponde la remuneración, régimen común y opción transitoria del pagador. La fecha de portada identifica un testimonio documental, no entrada en vigor. La fecha del replay solicitado tampoco sustituye la captura final tras redirección.

En 2012, RDL 20/2011, DA 35.3, PDF `89eaeb5898f7…`, p.54, distingue enero pagado y correspondiente a enero, y pagos desde febrero que no correspondan a enero. No clasificar un pago atrasado de enero únicamente por fecha bancaria. La rama temporal no contemplada expresamente por esos dos supuestos necesita calificación; no inventar una regla general de atrasos.

Para 2014, la nota de la tabla AEAT p.29 cita expresamente Ley 22/2013. Su artículo 64 prorroga DA35 a 2014. Para 2015, RD1003/2014 establece régimen transitorio y RDL9/2015, p.11 (`6e2dc7a4f586…`), nueva escala desde 12 de julio con opción de regularización desde 1 de agosto. RD633/2015 pp.23–24 (`6fe8785ba1a1…`) mantiene también los topes 47/24 hasta el 31 de julio si se usa esa opción; no basta cambiar la escala y dejar un tope de otra rama. Para 2016 termina la transitoriedad 2015: corroboración en ayuda AEAT pp.7–8 (`d1fc0fc2cb5b…`) y escala permanente RD1003 p.8 (`4b1117dfa72d…`).

Entradas: previsión anual dineraria y en especie normalizada por pagador; cotizaciones dadas; reducciones irregulares calificadas por separado; situación laboral y contrato; hechos familiares elegibles con año de nacimiento, discapacidad, convivencia y reparto; pensión compensatoria y anualidades judiciales con beneficiarios; derecho y comunicación de vivienda; residencia y procedencia de rendimientos. Los casos iniciales ordinarios entregados fijan familia vacía, edad 40, sin discapacidad, movilidad, vivienda, irregularidad ni territorialidad especial. Cotizaciones cero son un dato sintético, no una cotización legal calculada.

Objeción experta: normalizar una entrada oculta decisiones fiscales si no queda constancia de sus componentes. Coste: el adaptador debe justificar esas decisiones y rechazar situaciones no calificadas. Los procedimientos especiales de varios pagadores, atrasos y regímenes forales quedan fuera del candidato ejecutable.

## Secuencia aritmética acotada

1. Construir RNT según el año, con suelo cero. Antes de 2015 restar gastos históricos; desde 2015 calcular el RNT de la reducción antes de otros gastos.
2. Aplicar reducción general por versión y REDONDEAR1. Las fórmulas y extremos están en la matriz. No importar la reducción de liquidación anual.
3. Restar otros conceptos aplicables con su límite propio; resolver por separado gastos de movilidad/discapacidad, pensión, descendientes y desempleo. El límite de otros gastos del PDF no agota la remisión legal del art.83.3.c.
4. Determinar mínimo personal y familiar con requisitos acreditados. Para el escenario ordinario sin familia: 5151 hasta 2014 y 5550 desde 2015.
5. Comprobar exclusión, preservando mínimos contractuales. Aplicar cuota fija publicada más exceso marginal, no integrar toda la curva desde cero. `tablas-candidatas.json` conserva importes decimales como cadenas. Las fronteras de 2012 siguen siendo 120000.20, 175000.20 y, desde febrero, 300000.20.
6. Restar la cuota del mínimo con suelo cero. Anualidades judiciales requieren contrato aparte, con incremento 1600 antes de 2015 y 1980 después; no usar simultáneamente el mínimo por esos mismos hijos sin resolver el derecho.
7. Aplicar el límite 43% solo si RETRIB <=22000. Antes de 2015 interviene además la deducción 80bis. Desde 2015 no ejecutarla aunque siga apareciendo tachada en la extracción de enero.
8. Antes de 2015, tipo previo: truncar dos decimales y redondear al entero más próximo, con empate positivo hacia arriba. Aplicar después deducción y vivienda procedentes; el tipo final se trunca a dos decimales. Desde 2015 desaparece ese entero previo. No trasladar la mitad territorial entre etapas sin comprobar el algoritmo.
9. Aplicar mínimos contractuales con excepciones acreditadas y redondear el importe final al céntimo. REDONDEAR1 documenta 0.005 → 0.01 para magnitudes finales positivas. No autoriza redondear cualquier producto intermedio.

Objeción experta: estos pasos no implementan todas las ramas de los veinte grupos de la matriz. Coste: contrato parcial y escenarios deliberadamente restringidos; el registro actual no se amplía.

## Regularización y divisor cero

Estado obligatorio: RETRIB, PERCIBIDO, RETENIDO, RETRIBA, IMPORTEA, BASEA, MINPERFAA, TIPOA, situación territorial previa y actual, minoraciones previas de vivienda, causas concurrentes y fecha efectiva. No reemplazar ese estado por un booleano. Primero se obtiene el importe objetivo de la versión y la mezcla territorial pertinente; después se descuentan retenciones y minoraciones y se divide por la remuneración pendiente. Se aplican límites generales y específicos de art.87.5 en su orden.

Para RETRIB-PERCIBIDO<=0, el candidato propone un rechazo explícito de dominio pendiente de calificación; no devuelve NaN, devolución ni tipo cero inventado. Ese rechazo es una decisión de API, no una regla jurídica deducida del PDF. El exceso retenido con remuneración pendiente positiva produce cero en el subpaso antes de mínimos/límites; no equivale a una devolución.

Julio 2015 p.34 mantiene `RESICEME=S y RENCEME=N` en azul, sin tachado visible. Con pérdida de residencia, ambas causas 6 y 11 y rendimientos previos en Ceuta/Melilla, esa rama no se activa por `RESICEME=N`. No se adopta automáticamente la corrección anunciada por el índice del14/07. Caso discriminante en `hallazgos.json`: importe objetivo de 6000, total30000, percibido15000, retenido1500. La rama literal acaba en6000; una mezcla mitad/entero daría4500. Los tipos resultantes20/30 son hipótesis aritméticas contrapuestas; ninguno se acepta fiscalmente por esta comparación.

Objeción experta: eliminar una condición porque parece errónea sería reescribir el original. Coste: se conserva el desacuerdo de contenido y queda excluida esta rama hasta recuperar la revisión o criterio primario suficiente.

## Marcas visuales

En 2016 p.21 está tachado `y CAMBIORESI=2015`, quedando `MOVIL=S`. En p.22 está tachado el régimen MOVILGEO de 2014 y su resta. La ayuda AEAT2016 pp.11–12 corrobora el incremento de gasto para cambio de residencia y año siguiente y el fin de la transición anterior. En julio 2015 p.30 la tabla antigua está cruzada; la nueva es19.5/24.5/30.5/38/46. Color azul o rojo solo, sin tachado, no significa supresión: la revisión de p.34 exige esa distinción.

Objeción experta: un verificador de texto reproduce también lo eliminado. Coste: la extracción literal queda intacta y las decisiones visuales viven separadas; no se normalizan glifos de control para lograr un binding.
