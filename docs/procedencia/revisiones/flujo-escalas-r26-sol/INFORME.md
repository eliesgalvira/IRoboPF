# Revisión adversaria del flujo de escalas R23

Dictamen: conservar la edición como evidencia técnica candidata; **no integrar su declaración de cierre local ni componer/publicar sus relaciones todavía**. Hay contradicciones entre descripciones del grafo y selectores reales, puertos insuficientemente precisos y una asociación por sitio que no equivale a un recorrido causal. No se propone ningún arreglo del motor ni de la entrega. Ninguna regla fiscal completa ni ninguno de los 264 enlaces se promueve.

Trabajo personal en T3 Code/Codex, gpt-6.1-sol, esfuerzo high. Prioridad solicitada, sin recibo técnico independiente del service tier. No se utilizó Astra ni se subdelegó. Base exigida y observada: `6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9`. El cotejo inicial comprobó las 15.456 entradas mediante lstat, readlink, bytes y modo ejecutable, contra un blob cada vez, bajo bloqueo de recepción. Diff vacío. El control final se entrega separado y debe leerse antes de recibir este lote.

Se leyeron BRIEF completo, AGENTS, contrato, coordinación, secciones de estado y decisiones, recepción R26 y corrección de preservación v4, con D077–D079. La orden actual prevalece sobre autorización histórica de commits, subdelegación, limpieza y transferencias. No se inspeccionaron archivos R25 pendientes de recepción ni entregas activas de compañeros. Los avisos R25 son bloqueos comunicados, no hallazgos reproducidos aquí.

## Hallazgos y decisiones

### R26-01. Dependencia falsa del flag constante hasta 2015

En las cuatro aristas `resolverParametrosComunidadAutonoma2012` a `2015`, propiedad `escalaAutonomicaIgualEstatal`, el input declarado es `comunidadAutonoma`, con rol selection. Las declaraciones efectivas devuelven literalmente false. Cambiar comunidad selecciona otros campos del objeto, pero no este flag. Es precisamente el caso de cohabitación que el contrato prohíbe convertir en causalidad. Desde 2016 sí hay comparación con `simulada-estatal`; no se extrapola el hallazgo a esos años.

Decisión: requieren precisión individual; no borrar ni arreglar las cuatro relaciones. Objeción del mejor experto: comunidad pertenece a la función y puede alterar el objeto, por lo que sería una dependencia conservadora válida. Respuesta: el grafo promete propiedades concretas; conservar sobreaproximación de objeto como control del literal false contradice esa promesa. Coste: separar procedencia de la llamada y dependencia de su propiedad antes de composición. No es un defecto fiscal del cálculo.

### R26-02. Ocho fórmulas confunden territorio con rama de ejecución

Las ocho relaciones de cuotas/desgloses generales y del mínimo, estatal y autonómico, dicen «Simulada usa conjunta legacy para estatal y cero/[] para autonómico». La condición real es `usaEscalaAutonomicaReal = !parametrosComunidad.escalaAutonomicaIgualEstatal`. Simulada 2012–2015 tiene false en el segundo flag: ejecuta los dos componentes. En 2016 cambia. El modo canónico/compatible-legacy selecciona cotizaciones, no sustituye este flag.

La ampliación y F02 explican correctamente la distinción. El defecto está en las ocho fórmulas serializadas y en su condición genérica, no en todo el razonamiento del autor. Decisión: no usar esa frase para generar páginas o ramas. Objeción: «Simulada» podría ser una abreviatura del caso con flag true. Respuesta: el artefacto abarca todos los ejercicios y carece de esa restricción; un consumidor no debe adivinarla a partir de otro párrafo. Coste: revisión de condiciones por año y flag; ninguna corrección de tarifa autorizada.

### R26-03. Propiedades de salida y puertos todavía genéricos

Las cuatro propiedades DA61/80bis usan los mismos inputs `caso.regla` y `caso campos de fórmula`. No permiten distinguir que bruto y otras rentas cambian la deducción legal, que neto/base/cuota cambian el límite atribuible y que cuotaTrasArt80 interviene en el mínimo y en la resta posterior. La declaración completa contiene las fórmulas correctas, pero no resuelve los argumentos del llamador explícito ni convierte ese texto genérico en puertos por propiedad.

Las cinco primitivas monetarias/diferencial dicen `parámetros públicos del helper`. Esto no es aún el vínculo de `centimos`, `euros`, `valor/decimales` o los tres importes del diferencial con una instancia concreta. Se puede conservar una primitiva como frontera; falta declarar su firma y sustitución concreta para llamarla cerrada.

Las cuatro admisiones de derechos comparten `caso.derechosMinimos` y `rentaNoExenta si conciliación`. `fechaValida` recibe una fecha string, no ambos objetos. `hayAlimentosPropiosSinMinimo` no recibe la renta conciliada. Sus guardas y expresiones se preservan como evidencia, pero los inputs no describen exactamente cada llamada. `importesLiquidacion.value` identifica un objeto entero mientras su dependencia declarada solo pretende cubrir cuotaLiquidaCentimos; la prosa lo reconoce y la propiedad de salida debería reflejar ese límite antes de composición. `literal/alias en fuente` tampoco es todavía identidad de puerto terminal.

Decisión: marcar cada caso en `relaciones-232.json.gz` sin aceptar cierres a partir de estos nombres. Objeción: convertir todos los formales en nodos exigiría un analizador general. Respuesta: no se exige análisis general; basta una relación candidata explícita por propiedad y sustitución del sitio real, o conservarla como omisión. Coste: menos cierre acreditado y otra revisión del adaptador. No se cambia ninguna expectativa recibida.

### R26-04. Las listas de aristas por sitio no prueban cierre ni alcanzabilidad

El generador construye `site.edges` buscando símbolos raíz en el mismo archivo y añadiendo familias de helpers por el sufijo `-tramo`. No resuelve recursivamente los inputs, que son strings de varias gramáticas y contextos. Para `anual.cuota.diferencial` lista cuotaLiquida y pagosACuentaAplicadosCentimos, pero no enlaza directamente la llamada a calcularCuotaDiferencialCentimos, retencionesSoportadasCentimos ni la conversión a céntimos. Esas operaciones existen en otras aristas y en la expresión del sitio: el fallo no es ausencia de código sino falta de enlace del cierre por sitio.

A `anual.cuota.ahorro-tramo` se adjuntan todas las propiedades publicadas e integradas de calcularDesgloseCuotaPorEscala. Su productor calcularDesgloseCuotaPorEscalaAhorro pasa tramos integrados sin escalasPublicadas; las ramas publicadas no son alcanzables desde ese llamador. Pueden conservarse como catálogo del helper, pero no como dependencias ejecutadas de ese sitio. En los otros cuatro sitios de tramo pueden aplicarse representaciones distintas según selector: deben conservar esa condición.

Decisión individual de los 28 sitios en `sitios-28.json`: conservar evidencia/identidades, rechazar cierre/composición. Cada registro enumera las aristas examinadas y los problemas específicos directos. No equivale a rechazar todo su contenido aritmético ni a demostrar un error en cada sitio. Objeción: el autor ya declara globalClosure=false y composición pendiente. Respuesta: eso es correcto y se conserva; el estado adicional `candidate-local-closure-with-declared-boundaries` sigue requiriendo contraste de sus rutas locales. Coste: no generar un cierre por mera existencia de listas no vacías.

### R26-05. Garantía acotada del validador

Se invoca el `main` real de verificar.py, sustituyendo únicamente su lector en memoria para devolver un grafo mutado. Los demás artefactos y payloads se leen originales. Ensayos: retirar una relación, cambiar su input por una entrada inexistente, cambiar output.file por una ruta inexistente, sustituir la fórmula por una multiplicación por 999 y asignar al sitio una arista inexistente. Los resultados efectivos y esperados protectores están en `mutantes-validador.json`; se conservan rojos, sin modificar esperados ni corregir el validador.

Su contrato publicado dice estructura/evidencia/transporte, no análisis causal general. Comprobar hashes, offsets, JSONSchema, IDs únicos y 28 sitios no prueba ni la relación entre output.file y evidence.source.file ni referencias cerradas de site.edges. Algunas garantías referenciales serían controles simples; la fórmula arbitraria es sobre todo una delimitación de semántica, no una obligación de sintetizar un analizador.

Decisión: un pase de este verificador no habilita composición. Objeción: llamar defectos a todos los mutantes exigiría garantías no prometidas. Respuesta: distinguir fallo de puerta referencial y límite semántico; los rojos son contra la hipótesis de usarlo como puerta de composición, no regresiones fiscales ni prueba de que el programa incumpla toda su descripción. Coste: revisión manual y una puerta distinta si se desea ese uso.

## Distinciones contrastadas y conservadas

La publicada usa Q+(B−L)t con última fila elegible en el orden del array; no integra tipos para reconstruir Q. Su límite superior es metadato: cambiar la siguiente frontera sin cruzarla no altera la cuota de la fila actual. En la integrada sí cambia el ancho del tramo y el comienzo del siguiente. `escalasPublicadas=[]` y undefined no son equivalentes: el array vacío devuelve cero filas y no cae a la integrada. Los discriminantes propios incluyen este valor por defecto, selección de fila y mutación Q frente a upper metadata. Las tablas reales ordenadas no autorizan sustituir findLast por una búsqueda distinta para arrays arbitrarios.

Murcia conserva B>60000 exclusivamente para la fila exclusiva. El booleano de `inferiorExclusivo` en UTF16 [3394,3398) conserva referencia de fuente y hash, sin inventar itemId. No se corrige a ≥. Madrid2020 continúa por tramos[3][0] integrado y no por Madrid2025 publicada; el candidato e16bd… no se sustituye ni se declara admitido por el consumidor.

Valencia2022 selecciona por día civil UTC anterior a 10-28; Balears2015 por día anterior a 12-31. Extremadura2023 compara instante con 09-15T00:00Z para la escala. Balears2023 compara instante con 11-26T00:00Z para mínimos: segundo descendiente cambia; mínimo propio 5550 permanece. La suite propia observa la propiedad afectada y la invariancia de la propia. La lectura de getUTC* frente a getTime distingue método, aunque los casos alrededor de medianoche por sí solos no distinguen dos implementaciones equivalentes en ese punto.

Catalunya2020 mantiene alias estatal y Catalunya2021 hereda el mapa 2025 por spread. Estos selectores de mínimos no reciben renta. La invariancia del objeto ante cambios de base contrasta la afirmación del código; no es aceptación de un hallazgo fiscal nuevo. Galicia2014/2015 selecciona otra escala con 17707,20/21 y no se mezcla con la cuestión catalana.

Ahorro hasta2014 tarifa base menos remanente; después resta tarifa del remanente, con suelo y componentes distintos en2015. La cuota global anual postmínimo usa max(0, cuota conjunta integrada − sumaMinoraciones); la capacidad autonómica de deducciones consume el despuesMinimo autonómico, no esa cuota conjunta ni la mitad. Igualdades numéricas en casos concretos no autorizan colapsar ambos contratos.

BIG/BLG explícitas conservan neto con signo; solo la base para tarifas se satura. El anual general conserva max0 en trabajo antes de añadir inmobiliario/ganancia general con signo; no son el mismo contrato. La lista deducciones por código no vacía rechaza; el agregado opcional sí es consumido. El techo suma general autonómica y ahorro autonómico postmínimo; la rama sin escala autonómica real conserva tratamiento distinto. No se atribuye ejecución al catálogo declarado.

En derechos, renta del descendiente ≤800000 y declaración ≤180000 son filtros propios; renta del titular próximo ≤800000 decide entre cercanos y siguientes si hay siguientes. El orden efectivo es fechaNacimiento y sujetoId sobre elegibles del contribuyente, no todos los declarados. La validación rechaza empates con divisor distinto y ciertas concurrencias; no se extiende resultado de un caso admitido a un rechazo. Constitución del vínculo e inicio del incremento tienen usos diferentes. La conciliación usa neto previo a reducciones/compensación y compara tanto céntimos half-up como el lado del umbral: no basta una coincidencia del entero redondeado.

## Fronteras R23 ya recibidas

Cotizaciones: concuerdan símbolo, hash, argumentos anio/íntegroTrabajo y propiedad cotizacionTrabajador con `ss.canonical`/`ss.legacy` del grafo de rentas y la frontera del lote retenciones/SS. g.I es íntegro, no neto, base ordinaria, coste laboral ni cuota empresarial. El perfil canónico2018 y los componentes por lado pertenecen al lote SS; este informe no los acepta por ese acuerdo.

Retenciones: fronteras.json de escalas declara salida importeRetencionAnualCentimos, que entra en pagosACuentaAplicadosCentimos y luego diferencial. La ruta de retencionesSoportadas declaradas es distinta. El cálculo estimado opcional no acredita retención soportada. La coherencia del año y los rechazos de fechaPago/perfil de cierre/modo deben conservarse; fechaFallecimiento de escalas no se traslada a fechaPago del algoritmo.

Trabajo anual: se suministra cotizacionTrabajador; el fallback de cotizaciones dentro del helper de neto no se ejecuta para ese llamador. rendimientoPrevioNeto es argumento art20; rendimientoNeto entra en BIG. En explícito, argumentoArt20 y rendimientoAntesArt20 son salidas distintas; reduccionArt20 se limita por max(neto,0) antes de restarla una vez. La frontera `reduccion-explicita-art20` conserva como evidencia de llamada solo `reduccionArt20 = D.min(`: ese fragmento no acredita sus argumentos. Se contrastan con la llamada actual completa; no se certifica su transporte únicamente por ese rango. Es una diferencia concreta de granularidad, no autorización de fix.

EDS: entrada solo-actividad-eds rechaza activos no vacíos y discapacidad distinta de cero antes del adaptador. El aporte exacto ya reducido alimenta neto, sin art20 añadido. Las etapas aisladas del submotor no se hacen alcanzables por compartir función. No se han usado como correctos los seis argument4 avisados por R25; permanecen sin recepción/reproducción aquí.

En sentido inverso, los nodos de frontera scale.parameters/scale.published/minimum.state/scale.integrate del grafo de rentas apuntan a Madrid2025, las tres propiedades concretas y la publicada solo autonómica. Esos contratos coinciden con las llamadas actuales, pero sus aristas van entrada → salida y este lote salida → entrada. Falta adaptación explícita, no inversión por nombre. La referencia `x.base o min(...)` del otro lote agrupa llamadas: antes de componer hay que distinguirlas individualmente, incluidas ausencia de fallecimiento y tramos/publicadas. No se integra ni se corrige ese lote.

## Cobertura individual y límites

`relaciones-232.json.gz` conserva una decisión por ID, output, inputs, fórmula, condición y evidencia, con objeción, respuesta y coste. Compatible con la expresión significa únicamente que se conserva como relación candidata; no aceptación semántica completa. Las que necesitan precisión se señalan individualmente. No se convierte este censo en 232 pruebas causales independientes.

`decisiones-264.json.gz` conserva cada decisión nominal, occurrenceId, ruta/hash de payload, columna/valor/unidad y consumidores, incluida capacidad de deducción cuando corresponde. La selección de tabla se contrasta contra TS real. Las 102 ocurrencias compartidas no se desdoblan en sujetos independientes ni reciben aceptación por número de ejercicios. Las condiciones históricas se conservan: no abarcan ahorro, derecho a mínimos, selector del caso ni regla completa. Una fila alta puede no ser usada por min(M,BG). Las omisiones históricas siguen en los originales; este dictamen no cambia sus estados a aceptado.

No hay nueva evidencia normativa, autenticación PAdES/CSV, adquisición, CAS, atestación ni ensayo de confianza. No se mutaron inventario, snapshots, registros, ESTADO, DECISIONES, motor ni entregas previas. Inventario30df… y artefacto59ba… siguen fijados; 52.461 ocurrencias y 65 sitios no prueban fiscalidad. Se conservan 36 snapshots y confianza activa, V1a0c7…/V25737…/719 objetos. Crossa sigue v1 desfasado, misma casa y dueño, copia local fuera de Victus, sin independencia ni respaldo remoto. Sin VCS mutante, commit, PR, main, deploy, servidor, preview, UI, LFS, gasto, transferencia ni mensajes externos.

Integridad, autenticidad, número, interpretación y revisión se informan por separado. Las conclusiones nuevas requieren contraste posterior. El encargo global continúa abierto.

## Resultado observado de controles

Los 16 grupos de casos propios pasan contra el TS actual, incluidos Q frente a metadato superior, findLast en orden de array, undefined frente a array vacío, Murcia, cortes temporales, Catalunya/Galicia, cambio de flag, identidades de tablas y ahorro. No son 16 reglas aceptadas. Las reproducciones recibidas mantienen sus esperados: 12 casos heredados, 264 mutaciones de celda, 26 grupos de selectores, selección de las 264 decisiones y prioridad familiar800000/800001. Son ensayos con solapamientos, no evidencias independientes acumulables.

La verificación original pasa para el artefacto recibido. También admite los cinco mutantes: permanecen cinco rojos protectores frente al uso como puerta de composición. No se alteran sus esperados para obtener verde. El contraste propio de rangos/hashes termina sin errores en los siete artefactos examinados, incluido fuentes.json.gz, que el main original no recorría. Los registros repetidos de una fuente no son otras evidencias independientes.

Oxlint y checkJs terminan con código0. Ruff y mypy terminan correctamente tras corregir exclusivamente instrumentos propios; los fallos iniciales quedan en sus logs. El primer cotejo propio comparó expresiones efectivas de inventario contra rangos de declaración: esa era una hipótesis errónea del instrumento, no un fallo de R23. La versión final distingue expresiones de selección efectiva y fragmentos literales/declaraciones rotulados; conserva los resultados iniciales sin modificar el inventario. Dos incidencias de calidad propias fueron formato del preparador y tipado del módulo dinámico importado; no se relajaron reglas.

Bun emite el aviso interno `directory mismatch` de tsconfig scratch y devuelve0 en los ensayos; se conserva stderr. No se interpreta ese aviso como invalidación automática de las aserciones ejecutadas ni como certificación del entorno. Las dependencias efectivas y sus hashes se entregan en dependencias.json. No hubo Next build ni suite legacy masiva.

Cotejo físico final ejecutado: HEAD6ab4a98… intacto, 15.456 entradas de base cotejadas por lstat/readlink/bytes/modo, un blob cada vez; cero ausencias/diferencias y diff vacío. Los archivos nuevos pertenecen a esta revisión y a su caché excluida del transporte. El manifiesto registra hashes/tamaños/baseSha256 de las adiciones y la identidad del control final. No hay archivos de base modificados ni borrados. Este control acredita conservación física; no autenticidad de documentos ni aceptación fiscal.

El control ampliado al empaquetador detectó además cuatro diagnósticos de tipos de ese instrumento propio (lista del patch, variable reutilizada bytes/texto y tipo del manifiesto). Se corrigen anotaciones y nombre de la variable, sin cambiar las reglas de transporte. El log tipos-python-empaque-inicial.log conserva esos diagnósticos; el pase final de calidad y el manifiesto recogen la versión entregada.
