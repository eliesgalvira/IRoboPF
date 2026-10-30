# Revisión personal Sol de retenciones 2012–2014

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Base examinada: `1ec684b4e4408068282febf1319c12c6ac8a15c1`. Este dictamen no acepta ningún ejercicio completo ni habilita versiones.

Se inspeccionan personalmente las 187 páginas de los cuatro testimonios, mediante 48 láminas de hasta cuatro páginas, con lectura de las fórmulas, condiciones, tablas, notas y marcas visibles, complementada por texto extraído. Esto amplía efectivamente las doce imágenes del informe previo. `mapa-paginas.json` registra cada página y `citas-paginas.json` conserva texto literal, página física, caja completa, hash del original y facsímil individual. Las tablas finales están giradas en el original: se conserva su orientación. Portadas e índices no contienen operaciones; bibliografías solo identifican normas; la última página de enero solo contiene cabecera/número. También se inspeccionaron, sin contarlas como cálculo.

La lectura sustantiva de los testimonios queda terminada en este alcance. Su revisión no equivale a autenticarlos históricamente, demostrar todos sus pseudocódigos como correctos ni validar una implementación. `matriz-80.json` contiene una decisión individual por celda/versión; `ramas-44.json`, una por causa/versión; `concurrencias.json` separa combinaciones aplicables, incompatibilidades y casos que necesitan fases sucesivas. No son 124 reglas aceptadas ni 44 pruebas integrales de regularización.

## SOL-01. Las marcas de 2013 cambian CAUSA11

En febrero de 2012, página física 4, se añaden datos previos de CAUSA11; en p.34 se incluye esa causa en las mezclas territoriales; en p.35 aparece un bloque azul ampliado para vivienda. Azul no significa eliminación. La nota de p.2 distingue cambios rojos respecto de enero y azules respecto de una versión de 19/01/2012. Este testimonio tiene portada de 27/01: no poseemos por ello los bytes de aquella versión intermedia.

En 2013 p.4 están tachados RETRIBA, MINORADO, MINOPAGOA y RENCEMEA de CAUSA11; p.6 tacha la incidencia37; p.7 elimina CAUSA11=N de la condición55; p.8 incorpora incompatibilidades con historia y elimina esa condición de81. En p.34 se tachan las inclusiones de CAUSA11 en ambas mezclas y RESICEME=S/RENCEME=N de la segunda. En p.35 se tacha el bloque ampliado de vivienda y queda la rama simple 2% de remuneración pendiente. En 2014 se presenta el texto resultante sin esos bloques. Todas estas páginas se vuelven a extraer y conservan sus facsímiles; el texto extraído sigue incluyendo lo tachado.

Objeción experta: una extracción literal devolvería dos reglas contradictorias. Respuesta: la decisión operativa distingue explícitamente texto conservado y texto eliminado por versión. Coste: no reutilizar sin adaptación un único regularizador de febrero para todos los años. Caso discriminante de suboperación: con total30000, previo28000, percibido15000 y minoración previa400, el bloque de febrero da440, frente a300 de la rama simple2013–2014; solo febrero admite esa historia en CAUSA11. No es una nómina idéntica válida bajo ambas versiones.

## SOL-02. El divisor cero ya está excluido por los PDF

Enero p.6 incidencia37, y las otras versiones p.6 incidencia35, rechazan RETRIB<=PERCIBIDO. El informe previo trataba el rechazo como política candidata sin respaldo documental; ahora existe localización concreta. El cociente sigue siendo remuneración pendiente, nunca total anual. Un exceso retenido da suelo cero en ese subpaso, sin devolución automática y sin suprimir mínimos contractuales.

Objeción experta: el rechazo de una aplicación no define toda consecuencia jurídica de un pago final sin saldo pendiente. Respuesta: se cierra la guarda del dominio del algoritmo documentado; no se inventa una cuota para el caso rechazado. Coste: ese caso queda fuera del contrato numérico, con causa explícita.

## SOL-03. Defectos de pseudocódigo familiar y tablas auxiliares

Enero p.10 usa EDADES>25 para el descendiente con discapacidad en NUMDES325, omitiendo exactamente25. Febrero y años siguientes usan >=25. Las cuatro versiones p.16 usan EDADAS<64 en la alternativa de ascendiente con discapacidad, dejando exactamente64 fuera del contador. La norma no contiene esa exclusión por edad de la persona con discapacidad. En p.19 el contador de movilidad avanza j pero termina i; p.20 usa CONVIVENCIA(i), avanza j y termina i. Se conservan los originales: no se arregla silenciosamente su texto.

Los bucles por discapacidad/asistencia de pp.26–27 recorren un prefijo de longitud igual al número de familiares de la categoría; no consta que los familiares estén ordenados por esa categoría. Para descendientes se exige orden por nacimiento en p.9. Un primer hijo de12 sin discapacidad y un segundo de8 con65% no pueden ser reordenados por discapacidad para hacer funcionar esa suma: el mínimo por discapacidad del segundo podría omitirse en una ejecución literal del prefijo de longitud1. Esto es una reserva de la transcripción del algoritmo, no un defecto reproducido del servicio oficial o del motor actual.

Las tablas de salida contienen etiquetas de edad y topes inconsistentes con entradas, por ejemplo311611 frente316611 para MINPERFAA y años editoriales desfasados en enero. No se adoptan esos máximos auxiliares como límites materiales del derecho.

En la página 23, los epígrafes «EDAD>65» y «EDAD>75» se implementan como ejercicio menos año de nacimiento >64 y >74. El candidato documental conserva esas condiciones expresas, comprobadas en fronteras por año de nacimiento; no las sustituye por una comparación estricta de edad entera >65/>75. Las fechas civiles de adopción, acogimiento y comunicación se califican por su norma propia.

Objeción experta: ignorar esos detalles convertiría lectura completa en aparente aprobación del código. Respuesta: candidato jurídico por identidad y hechos, recorrido completo de familiares, separado de la ejecución literal cuestionada. Coste: implementación futura deberá conservar contraejemplos antes de elegir cómo conciliar norma y pseudocódigo; no hay fix de producto en esta entrega.

## SOL-04. RRO-09: dos600, reserva específica

Las cuatro versiones p.22 definen PENSION600 e HIJOS600; p.28 los suma sin tachados. El original RD439/2007 p.39 contiene la disyunción y la compatibilidad posterior. El texto histórico seleccionado en BOE mantiene ambas. Ninguna de las búsquedas DGT realizadas ha aportado una respuesta histórica expresa a la concurrencia interna del primer párrafo. La consulta posterior V1748-23 localizada no acredita ese extremo y su URL primaria no fue accesible mediante la herramienta; no se usa una transcripción comercial como resolución.

Caso aplicable: viudo de 40 años, pensión de viudedad contributiva SS sujeta y reconocida de 20.000 euros anuales, tres hijos de 5, 8 y 12 años convivientes exclusivamente, sin rentas ni discapacidad, derecho exclusivo comunicado, sin cotización, irregularidad, vivienda, compensatoria ni anualidades. La prestación reconocida es un hecho de entrada; no se calcula aquí el derecho de Seguridad Social. No combina pensionista y desempleado en SITUPER. Mínimo 12699 y reducción general 2652. Con dos minoraciones de 600 la base es 16148; con una, 16748. Enero: cuotas 827.76/971.76 y tipos enteros 4/5; escala incrementada: 853.6275/1002.1275 y tipos 4/5. El límite del 43% es 1626.69 y no vincula; la deducción 80bis es cero. Los esperados representan hipótesis aritméticas discriminantes, no dos resultados fiscales aceptados.

Objeción experta: la compatibilidad puede referirse a600 con1200, sin duplicar el primer600. Respuesta: mantener ambas hipótesis y exigir aclaración primaria histórica expresa sobre pensionista con más de dos descendientes. Coste: solo esa concurrencia queda sin expectativa fiscal única; no bloquea por asociación las otras celdas ni los supuestos individuales.

## SOL-05. Vigencia, vivienda y cadena histórica

El RDL20/2011 contiene dos excepciones temporales distintas que deben propagarse juntas: DA35 para complemento y DA23 para vivienda. Enero pagado en enero y correspondiente a enero conserva régimen31/12/2011; los pagos desde febrero que no correspondan a enero aplican la nueva cuantía. No clasificar automáticamente pagos de febrero correspondientes a enero, anticipos de otros meses o atrasos de otros ejercicios por fecha bancaria. La combinación residual queda excluida del selector candidato, sin fingir que la norma citada la resuelve expresamente.

Resolución23/01/2012, BOE-A-2012-1385, adapta modelo145 y elimina el doble régimen de22000/33007.20 a partir de las comunicaciones de febrero, con la misma excepción de correspondencia. El derecho exige financiación, deducción aplicable y rendimientos íntegros de todos los pagadores por debajo del umbral estricto. No basta el total del pagador actual. Desde2013 se exige derecho transitorio DT18 tras Ley16/2012. RD960/2013 actualiza las remisiones de retenciones con efectos expresos desde2013 y elimina el deber de aportar testimonio literal judicial desde2014 en sus apartados pertinentes: no elimina la exigencia de resolución judicial.

El nuevo modelo145 de Resolución17/12/2013, BOE-A-2014-59, publicado03/01/2014 y con efectos en comunicaciones desde01/01/2014, incorpora referencia transitoria de vivienda y retira la exigencia de adjuntar testimonio literal. No imponer automáticamente el documento adjunto antiguo a todo2014. Conservar fecha de comunicación y recibo.

Ley22/2013 art64, con efectos01/01/2014, reproduce DA35 para2012/2013/2014: escala de incremento, mínimo, anualidades+1600 y topes52/26 con totalidad de rendimientos cualificados Ceuta/Melilla; no prorroga solo una tabla. La errata BOE-A-2014-2109 no modifica art64: corrige aeropuerto,otras referencias y anexos presupuestarios. No altera estas cifras.

GASTOS histórico se limita a art19.2 a/b/c por art83.3.b original. Los otros gastos de2000 y la reserva de tope del RD1003/2014 no pertenecen a2012–2014. Art83.3.c usa RNT tras las minoraciones a/b para RED20. Ley39/2010 arts60–61 fija desde2011 con vigencia indefinida la reducción y los mínimos; Ley51/2007 exclusiva2008 no basta para esta cadena. La regla de otras rentas de la liquidación anual no se traslada sin la especialidad del retenedor.

Objeción experta: corroborar BOE no autentica la captura secundaria AEAT. Respuesta: fuentes y estados separados. Coste: candidatos jurídicos delimitados, autenticidad histórica de los algoritmos todavía indeterminada.

## Contrato candidato y límites

Las veinte etapas quedan especificadas individualmente en matriz-80, con objeción,respuesta,coste y páginas. Requieren entradas calificadas y comunicación, régimen común, pagador identificado, hechos familiares elegibles y selección temporal suficiente. No se habilitan versiones. Art89.A, indemnizaciones/stock options sin calificación previa, selección residual de enero y concurrencia RRO-09 no reciben un resultado inventado.

Regularización: validar causa e historia admitida por versión; calcular circunstancias nuevas, mezcla territorial si corresponde,importe previo,retenciones,deducción y vivienda; dividir pendiente,suelo0,truncar; topes y mínimos; importe anual;87.5 en causas aplicables;reaplicar mínimos. Causas5/6/8/9/10/11 salen antes de87.5. Las otras causas no autorizan una subida por disminución exclusiva de base-mínimo; aumento exclusivo de esa diferencia limita incremento de retenciones. Cambios9/10 y retribución exigen dos fases y orden distinto según aumento/disminución. Las once etiquetas del PDF no son la numeración de los doce supuestos legales de87.2.

La fecha de efectos depende de87.4/88: variaciones de los primeros supuestos legales desde el hecho; las personales comunicadas con cinco días para nómina; opción del pagador de regularizar desde abril,julio,octubre por cambios del trimestre previo. No confundir con una opción general para elegir escala. La matriz no atribuye exactitud integral a los validadores AND/OR ambiguos del PDF ni resuelve por intuición la mezcla territorial de pérdida de residencia con otros cambios.

Integridad: hashes/tamaños de los cuatro algoritmos cotejados. Autenticidad: histórica indeterminada para capturas secundarias; no nueva validación PAdES/CSV de BOE. Interpretación: decisiones candidatas por regla y reservas concretas. Exactitud: aserciones independientes por suboperación y fronteras, con alcance explícito en casos.py; no pruebas del motor ni oracle AEAT ejecutado. Aceptación: false para todas las filas y ejercicios. No se hereda ninguna aceptación del inventario o snapshots.

El fallo inicial de casos.py corresponde a un esperado nuevo de esta revisión, no a un rojo del motor: 5151×0.2475=1274.8725; 4382.53+(25848−17707.20)×0.30−1274.8725=5549.8975. Dividido por300 da18.499658…; truncado18.49 y entero18. El esperado anterior5550.8975 añadía1 euro y producía incorrectamente19. Se conserva casos.log, se corrige la derivación nueva y se repite en casos-final.log. No se altera ningún oracle histórico.

La errata del RDL20/2011, BOE-A-2012-352, también se examinó: modifica textos y otras materias; en la disposición final segunda corrige estructura/títulos/comillas, sin alterar la tabla de incremento, los topes o las dos condiciones de enero aquí utilizadas. Su referencia y original preservado se añaden a la cadena, sin atribuir a esa errata una reforma fiscal numérica inexistente.

La cadena del art80bis se completa con Ley26/2009 art70, de efectos indefinidos desde2010, y RD2004/2009 artprimero.Tres, que sustituye base imponible por base de retención al calcular la deducción. Se conserva el original HTML del BOE por hash y localizador de artículo; no tiene página física ni facsímil PDF en esta entrega. La errata BOE-A-2009-21164 corrige el título del decreto y la omisión de «del» en la remisión a80bis, sin cambiar las cuantías. RD2004/2009 p3 es además la primaria de la tabla de exclusión efectiva, que no debe tomarse de la tabla anterior de RD861/2008.

Los casos adicionales de regularización conservan un segundo rojo de un esperado propio: al combinar compensatoria3000 y anualidad6000, la parte BASE−ANUALIDADES es16848 y queda en el primer tramo. Las cuotas son(22848−5151−1600)×0.24=3863.28 y×0.2475=3984.0075. regularizacion-inicial.log preserva el error; no era un fallo del motor ni de un oracle anterior.

La lectura de Ley16/2012 DF10.tres/cuatro también precisa el límite de la irregularidad: DT25 excluye de la nueva limitación700000/1000000 las extinciones anteriores a01/01/2013, aunque el cobro sea posterior. El candidato recibe reducciones previamente calificadas y exige fecha de extinción; no las deduce automáticamente del año de pago.

La DT18 antigua, relativa a vivienda anterior a2011 y suprimida por RDL20/2011, y la nueva DT18 introducida por Ley16/2012 para el régimen desde2013 comparten número, pero tienen contenido y ámbito temporal distintos. Las remisiones del contrato se leen dentro de la versión expresamente indicada.

Fuentes oficiales consultadas en web: [RIRPF histórico06/12/2013](https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820&p=20131206&tn=1), [Ley39/2010 original](https://www.boe.es/buscar/doc.php?id=BOE-A-2010-19703), [Ley22/2013 original](https://www.boe.es/buscar/doc.php?id=BOE-A-2013-13616), [modelo145 febrero2012](https://www.boe.es/boe/dias/2012/01/30/pdfs/BOE-A-2012-1385.pdf), [modelo145 enero2014](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2014-59), [errata2014](https://www.boe.es/buscar/doc.php?id=BOE-A-2014-2109), [errata2012](https://www.boe.es/buscar/doc.php?id=BOE-A-2012-352). Los hashes, páginas y facsímiles de los originales materializados se conservan aparte de estos enlaces.

## Cierre de verificaciones de esta entrega

Verificación final ejecutada el 2026-10-29T17:48:07.592941+00:00. 294 aserciones registradas de suboperaciones y 202 de regularización/concurrencias: 496 comparaciones asertivas correctas. Los dos programas son independientes del motor y conservan sus esperados literales/racionales. Las44instancias documentales comparten dos escalas; no se presentan como44oracles oficiales ni como cobertura exhaustiva de cada rama. Otras guardas de dominio no se inflan en ese recuento.

|Versión|Páginas leídas y vistas|Operativas|No operativas, también vistas|
|---|---:|---:|---:|
|2012-enero|48|44|4|
|2012-febrero|47|44|3|
|2013-anual|46|43|3|
|2014-anual|46|43|3|

Ruff y Pyright pasan sobre ambos programas; salida y versiones en lint-verificacion-final.log. Los16errores anti-slop permanecen en la configuración original. No hay cambios TypeScript/Effect/Rust que someter a sus compiladores. casos-verificacion-final.log y regularizacion-verificacion-final.log son las ejecuciones finales; los rojos anteriores quedan preservados con explicación. pruebas-indice.json localiza la cobertura y sus límites por cada una de las20familias.

Las fuentes del catálogo histórico19 mantienen SHA256/SHA512/tamaño; control-contexto.json deja constancia del cotejo y de la igualdad exacta del subset80. Se repite lstat para todas las10583entradas de la base y readlink para los3symlinks, sin ausencias. HEAD permanece en la base y el diff del checkout está vacío. El manifiesto de esta carpeta contiene solo altas, baseSha256=null y deleted vacío; entrega.patch.gz contiene el texto, y PDF/PNG se identifican por hash. No se incluyen originales grandes ya presentes en CAS del padre.

Quedan reservas delimitadas, no una aceptación completa: autenticidad histórica de las capturas AEAT, concurrencia interna RRO09, selector residual enero2012, ejecución literal defectuosa de auxiliares familiares, mezcla jurídica de pérdida de residencia con otros hechos y calificadores externos expresamente excluidos. Cada regla ordinaria conserva su decisión propia.
