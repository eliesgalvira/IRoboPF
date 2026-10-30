# Revisión 2012–2014: entrega parcial, cierre NO alcanzado

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Base examinada: `65cff4fd8eb8c6269c2ce97b88e770aa711bff7f`. Este informe no constituye cierre fiscal de 2012–2014 ni habilita sus versiones.

Se comprobaron las 9.391 entradas de la base con lstat y lectura del destino de los enlaces simbólicos cuando corresponde: cero ausencias; diff inicial vacío. Los cuatro PDF de enero/febrero de 2012, 2013 y 2014 coinciden con SHA-256, SHA-512 y tamaños del manifiesto previo. Son 187 páginas, no 187 páginas jurídicamente revisadas. Se extrajeron todas a scratch; se inspeccionaron personalmente doce imágenes AEAT: páginas físicas 22, 28 y 29 de cada versión. Además se adquirió el original BOE de RD439/2007 y se leyó e inspeccionó su página física 39, impresa 14135. El mapa registra expresamente las páginas no inspeccionadas. No se declara lectura jurídica ni visual exhaustiva.

La entrega incluye 80 estados individuales de celda y 44 estados de causa/versión. Todos permanecen abiertos; las proposiciones anteriores se conservan únicamente como índice de trabajo, no como nuevas conclusiones. Las once causas no agotan sus combinaciones. Esta entrega incumple todavía el requisito de cierre exhaustivo: no hay bloqueo externo demostrado que lo excuse. Los originales están disponibles; falta trabajo de revisión.

## RRC-01 — RRO-09 tiene un escenario aplicable discriminante, pero sigue sin resolución jurídica

Las páginas 22 de los cuatro algoritmos definen PENSION=600 para pensionista y HIJOS=600 cuando NUMDES>2. Las páginas 28 los suman en REDU. No se observan tachados en esas instrucciones. PENSION significa aquí reducción por pensión de Seguridad Social/Clases Pasivas; no es CONYUGE, la pensión compensatoria judicial. Confundir esas variables produciría un escenario distinto.

Se adquirió desde BOE el [RD439/2007 original](https://www.boe.es/boe/dias/2007/03/31/pdfs/A14097-14149.pdf). La página 39 conserva tanto la disyunción del artículo 83.3.d como la frase «Estas reducciones son compatibles entre sí». La estructura visual sitúa esta frase después del párrafo de desempleo. No permite omitirla al argumentar que la conjunción pensionista/descendientes está prohibida. Tampoco basta por sí sola para demostrar dos minoraciones de 600 dentro del primer párrafo. La página también contiene una escala de 2007 que NO se usa para cálculos de 2012–2014.

Caso candidato: perceptor viudo de 40 años, pensión de viudedad sujeta de Seguridad Social de 31.000 euros anuales, único pagador ordinario, tres hijos de 5, 8 y 12 años que conviven exclusivamente con él, sin rentas ni discapacidad; derecho exclusivo al mínimo comunicado; sin cotizaciones, irregularidad, vivienda, pensión compensatoria, anualidades o territorialidad especial. No se usa una suma imposible de pensionista y desempleado en SITUPER. Es un supuesto hipotético de hechos, no comprobación administrativa de una persona real ni validación del importe de la pensión.

Mínimo candidato 12.699; reducción general 2.652. Con suma de ambas minoraciones, base 27.148; con una sola, 27.748. Enero: cuotas 3.845,394 y 4.013,394; tipos previos enteros 12 y 13. Escala incrementada: cuotas 4.071,7675 y 4.251,7675; tipos 13 y 14. Las diferencias sobreviven al redondeo. Los límites de 22.000, deducción de base hasta 12.000 y vivienda no intervienen en este supuesto. Son contrastes de hipótesis aritméticas, NO dos expectativas fiscales aceptadas ni resultados del motor.

Objeción experta: repetir el pseudocódigo y calcularlo no resuelve la disyunción reglamentaria. Respuesta: mantener las dos hipótesis, el contexto de compatibilidad y un escenario discriminante plausible; no afirmar mismatch fiscal confirmado. Coste: sigue pendiente criterio primario histórico que resuelva expresamente la concurrencia, además de completar la cadena normativa y elegibilidad del caso.

Búsquedas efectivas: `site.boe.es "83" "pensionistas" "más de dos descendientes" "2013"`, `site.boe.es "600 euros" "pensionistas" "83" "2007"`, `site.hacienda.gob.es "pensionistas" "descendientes" "600" retenciones acumulación`. Devolvieron textos normativos y ayudas posteriores, no una respuesta histórica expresa a la concurrencia. La petición web a `act.php?id=BOE-A-2007-6820&p=20130101&tn=1` falló; no se interpreta como inexistencia. Las lecturas históricas previas de 20111220 y 20131206 sirven de índice, no sustituyen esta adquisición del original ni demuestran una búsqueda exhaustiva de consultas DGT. El resultado de ayuda AEAT 2024 no se extrapola a 2012.

## RRC-02 — Reserva de gastos trasladada fuera de período

Las celdas `2012-enero:gastos`, `2012-febrero:gastos`, `2013-anual:gastos` y `2014-anual:gastos` de matriz-140 mencionan como objeción RD1003/2014 y el tope de otros gastos posterior. El original RD439/2007 p.39 distingue las cotizaciones de las letras a/b/c del art.19.2 y la reducción de trabajo. La reextracción del algoritmo 2014 p.21 resta GASTOS antes de RED20; no incorpora un gasto general de 2.000.

Objeción experta: esa reserva moderna puede inducir a implementar retrospectivamente otros gastos y su límite. Respuesta: no copiarla como requisito operativo de 2012–2014; permanece en la matriz nueva como objeción histórica identificada, sin aceptación. Coste: revisar por separado gastos históricos, reducción y reformas. No se modifica la matriz ajena ni se cierra toda la celda de gastos.

## RRC-03 — Color, cuotas publicadas y umbrales literales

Se inspeccionaron las cuatro tablas de p.29: enero tiene seis tramos; febrero, 2013 y 2014 siete. Febrero usa rojo en tabla, ejemplo y nota sin tachado visible; 2014 destaca en rojo la prórroga. Se preservan 120000.20, 175000.20 y 300000.20. Las cuotas fijas deben conservarse como publicadas; integrar desde cero puede alterar fracciones de céntimo. Hay nueve aserciones de fronteras ±0.01/igual para esos tres cortes incrementados, sin normalización a euros enteros.

Objeción experta: color no equivale a supresión y la coincidencia de tablas no acredita vigencia. Respuesta: registrar observación visual por versión, separada de interpretación temporal. Coste: todavía faltan las demás fronteras, condiciones y marcas de páginas operativas. No se acepta toda la escala por estos nueve casos.

## Vigencia y contrato: cuestiones que siguen abiertas

La lectura nueva de RDL20/2011 p.54 conserva la excepción de enero y los topes 52/26, con requisitos territoriales. [Texto BOE](https://www.boe.es/eli/es/rdl/2011/12/30/20). El contrato posterior debe distinguir fecha de pago y período de correspondencia; no asignar versión solo por fecha bancaria. También requiere revisión de la excepción de vivienda, no solamente del gravamen complementario. La búsqueda localizó la [resolución de modelo 145, BOE-A-2012-1385](https://www.boe.es/boe/dias/2012/01/30/pdfs/BOE-A-2012-1385.pdf), pendiente de adquisición e inspección en esta entrega. La prórroga 2014 citada por AEAT no sustituye la lectura completa del art.64 de Ley22/2013 y sus efectos.

No se emite contrato operativo general candidato. Faltan lectura integral de validaciones y circunstancias, irregularidad, familia, reparto, anualidades, pensión compensatoria, vivienda y sus variantes de enero, elegibilidad, límites y comunicación. Falta además contrastar todas las reformas y erratas pertinentes. El examen textual de 2014 pp.21–46 fue parcial y no acredita las otras versiones. Las once causas y concurrencias, mezcla Ceuta/Melilla, MINOPAGO y orden de topes del art.87.5 no están probadas.

El rechazo de divisor pendiente <=0 en casos.py es una política candidata de dominio para un subpaso aislado; no se atribuye al BOE como tratamiento fiscal. El exceso retenido da cero en ese subpaso; no demuestra devolución ni resultado final tras mínimos y límites. No se fabrica rojo por los períodos intencionadamente rechazados por la API.

## Controles y entrega

`casos.py` ejecuta **34 aserciones**, con esperados literales Decimal independientes del motor: seis fronteras de reducción, tres intermedios familiares/base, ocho contrastes de cuotas/tipos RRO-09, nueve fronteras altas, tres redondeos enteros, un empate al céntimo, dos cocientes de regularización y dos rechazos de dominio. No son 34 ramas fiscales completas ni una suite de todos los escenarios solicitados. No se ejecuta motor, Excel ni oracle legacy.

El primer lint vía wheel de uv falló al arrancar Ruff en NixOS; el diagnóstico se conserva. Se repitió mediante paquetes Nix nativos; resultado en lint-tipos-nix.log. No se escribió TypeScript ni Effect; no procede atribuir a esta entrega un typecheck del producto o una ejecución de oxlint. No se cambió configuración de lint, ignores, package, locks o CI.

Las cinco dimensiones permanecen separadas: integridad de los cuatro PDF comprobada; autenticidad histórica de las capturas secundarias indeterminada; interpretación parcial pendiente; exactitud limitada a las aserciones descritas; aceptación fiscal false. HTTPS BOE y hashes del nuevo original no equivalen a validación PAdES/CSV o confianza histórica.

Solo entrega en la carpeta autorizada y scratch propio .cache/retenciones-cierre. Lecturas y pruebas pesadas con flock y un trabajador. Sin VCS mutante, borrados, fixes, habilitación de versiones, PR, despliegue, transferencia externa ni gasto. No se examinó trabajo ajeno en curso. Crossa sigue siendo v1 histórico comunicado, misma casa/dueño, sin comprobación propia ni custodia independiente. No se altera ningún snapshot, preservado, inventario o binding.
