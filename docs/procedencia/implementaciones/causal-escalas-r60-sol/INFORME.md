# Evidencia causal local de escalas, bases y mínimos R60

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `59bb5565456caa5a44078f3b9a5ac4301934fb86`.

Los 28 sitios tienen programa y transporte causal local. Los 22 generales se ejecutan con sus dependencias concretas de rentas/SS y, cuando se solicita, el estimador de retenciones. R59 conserva el estatus de candidato de esta base; el integrador recibe su revisión por separado. Las seis salidas explícitas se ejecutan para trabajo/pensión; su rama de actividad queda bloqueada de forma demostrada porque consume un aporte de las 19 familias excluidas. No se presenta ese contrato condicionado como cierre end-to-end de producción.

`admissionClosed`, `siteClosed`, `wiringAllowed` y `completeRuleAcceptance` permanecen false. No hay composición global de 65 sitios, implementación de familias ni admisión nueva. Los contadores son controles técnicos del lote.

## Programa y condiciones

El productor reconstruye R36 y enlaza definiciones existentes por archivo/símbolo. Prefijos `escalas:`, `rentas:`, `ss:` y `retenciones:` separan programas; los frames y las llamadas identifican ocurrencias. Se extiende el núcleo común R57, sin fórmulas financieras copiadas y sin ejecutar/transpilar TS financiero como productor. Las importaciones financieras de los ensayos son oracle independiente.

La ruta anual exige céntimos enteros en trabajo/pagos/soportadas, códigos de deducción vacíos y coherencia de año anual/subcaso. El selector conserva sus límites territoriales y 2026 real puede rechazar. La ruta explícita usa el schema y cuerpos reales de gastos, reducción y DA61. El portador de schemas reutiliza IR estructural R59; no concede una salida financiera de actividad. Derechos usa la identidad preadmitida ya delimitada en R47, con marcador `rightsPreadmitted=true`: ese marcador es declarativo y no acredita hechos. Se contrasta un caso válido con orden y divisor distintos contra la API pública real.

La gramática conserva defaults y resto de objetos, destructuración, cierres y asignaciones de acumuladores, bucles, pertenencia/orden de colecciones, callbacks e índices, findFirst/findLast, Option, redondeo y clones Decimal con precisión propia. Las líneas se crean con el programa real de `crearLineaCalculo`; se captura `origen.decimal`, separado de la presentación. Dos componentes de igual cuantía conservan productores distintos. El replay vuelve a exigir el contrato derivado y compara toda la ejecución; comparte semántica y no sustituye el oracle externo.

El dominio es ordinario, acíclico, síncrono y finito, con primitivas concretas sin reconfiguración hostil. Las fechas de fallecimiento se conservan como Date; al leer el `caso` de un testigo JSON se debe restaurar esa propiedad desde su ISO UTC. La evidencia contiene su representación explícita. Las etiquetas internas contextuales no constituyen una prueba dimensional universal.

## Tabla de los 28 sitios

TABLA28.json incluye fuentes UTF16/hash, nodo del importe, casos/expectativas, objeción, respuesta, coste y alcance por decisión.

| Sitio | Estado técnico | Condiciones/selección | Evidencia ejecutada | Pendiente o bloqueo |
| --- | --- | --- | --- | --- |
| anual.base.ahorro | Candidato condicionado | Rentas: clasificación temporal y exenciones ya realizadas; EUR con signo antes del suelo. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.base.general-imponible | Candidato condicionado | No saturar la suma completa; art20 recibe rendimientoPrevioNeto y otras rentas algebraicas. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.base.general-liquidable | Candidato condicionado | Admisión sin reducciones de base ni arrastres; no generalizar a compensación completa. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.ahorro-componente-postminimo | Candidato condicionado | Dos instancias aunque cifras iguales; remanentes separados; 2015 asimétrico. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.ahorro-total | Candidato condicionado | No confundir esta línea bruta con cuotaAhorroDespuesMinimo usada en líquida; tampoco sustituir por suma de publicadas. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.ahorro-tramo | Candidato condicionado | No alcanza rama publicada; semilla base*0 y spread de tramos acumulados. | 38 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.diferencial | Candidato condicionado | Estimación AEAT opcional en céntimos; caso y contexto concretos; errores no son cero. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.general-autonomica-tramo | Candidato condicionado | Flag false hasta 2015 incluso simulada; desde 2016 simulada devuelve []. | 32 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.general-estatal-tramo | Candidato condicionado | Con flag true usa conjunta legacy; no decidir por nombre de territorio. | 35 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.general-total | Candidato condicionado | Tarifas distintas por propiedad; ausencia no equivale a publicada vacía. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.liquida | Candidato condicionado | Deducción agregada con techo autonómico; sin aceptación por lista de códigos. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.minimo-ahorro-total | Candidato condicionado | Hasta 2014 reducir BA antes de tarifa, después restar tarifa(remanente); no mitad conjunta. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.minimo-autonomico-tramo | Candidato condicionado | Mismo selector que cuota general autonómica; map índice independiente del estatal. | 32 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.minimo-estatal-tramo | Candidato condicionado | Mismo flag de componentes; con false de uso real toma conjunta legacy, no autonómica. | 35 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.cuota.minimo-general-total | Candidato condicionado | Separar EUR-base y EUR-impuesto; no mostrar mínimo como cuota. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.deducciones.autonomicas | Candidato condicionado | Capacidad general neta más ahorro autonómico postmínimo; simulada desde 2016 no aplica ese techo. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.explicito.big | Trabajo condicionado; actividad bloqueada | Madrid 2025, pensión/empleo; schema/gastos/DA61 reales | 10 casos: exp-0-pension, exp-0-empleo-laboral | Familias excluidas: aporte.importeEurosExactos |
| anual.explicito.blg | Trabajo condicionado; actividad bloqueada | Madrid 2025, pensión/empleo; schema/gastos/DA61 reales | 10 casos: exp-0-pension, exp-0-empleo-laboral | Familias excluidas: aporte.importeEurosExactos |
| anual.explicito.cuota.autonomica | Trabajo condicionado; actividad bloqueada | Madrid 2025, pensión/empleo; schema/gastos/DA61 reales | 10 casos: exp-0-pension, exp-0-empleo-laboral | Familias excluidas: aporte.importeEurosExactos |
| anual.explicito.cuota.estatal | Trabajo condicionado; actividad bloqueada | Madrid 2025, pensión/empleo; schema/gastos/DA61 reales | 10 casos: exp-0-pension, exp-0-empleo-laboral | Familias excluidas: aporte.importeEurosExactos |
| anual.explicito.cuota.liquida-legal | Trabajo condicionado; actividad bloqueada | Madrid 2025, pensión/empleo; schema/gastos/DA61 reales | 10 casos: exp-0-pension, exp-0-empleo-laboral | Familias excluidas: aporte.importeEurosExactos |
| anual.explicito.cuota.posterior | Trabajo condicionado; actividad bloqueada | Madrid 2025, pensión/empleo; schema/gastos/DA61 reales | 10 casos: exp-0-pension, exp-0-empleo-laboral | Familias excluidas: aporte.importeEurosExactos |
| anual.minimo.ascendientes | Candidato condicionado | En derechos de alcance actual cero; helper ordinario no acredita residencia/convivencia/renta. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.minimo.autonomico | Candidato condicionado | No alias por igualdad numérica; mínimos catalanes según selector real, no suposición jurídica. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.minimo.contribuyente | Candidato condicionado | 65/75; 2012–14 tabla propia y resto servicio normativo concreto sustituido por constante. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.minimo.descendientes | Candidato condicionado | Filtros rentas 800000/180000, cercanía de titulares, vínculo/incremento; validadores externos obligatorios. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.minimo.discapacidad | Candidato condicionado | No heredar automáticamente filtros del mínimo familiar ordinario; reparto de discapacidad en derechos por sujeto. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |
| anual.minimo.estatal | Candidato condicionado | No sumar estatal y autonómico; dos juegos de mínimos y mismas instancias de derechos separadas. | 40 casos: 2012-canonico, 2012-compatible-legacy | Revisión independiente; admisión fuera |

## Evidencia y límites

El rojo del consumidor anterior alcanzó salidas y falló por falta de evidencia causal (`rojo-original.log`). Se ejecutó después de añadir el kind R60 inicial al núcleo y antes de conectar el modo público del consumidor. Es una desviación del orden literal solicitado; no se afirma un rojo previo a toda introducción del modo. Los originales y esperados permanecen conservados.

R60-N01 y N02 tienen rojos reales: catálogo exportado reducido que producía testigo sin mínimo estatal, y alias de metadatos que cambiaba el patrón reconstruido. Se corrigen con lista privada, copias independientes y rechazo en todas las API productoras/aceptantes. Se mantiene la comprobación del contrato en el núcleo exportado. La API histórica conserva su cuerpo literal; las sobrecargas derivadas de ese helper resuelven los dos errores de retorno TS nuevos, sin tipos ficticios.

El bloqueo de actividad se prueba con un caso admitido por la API real y con sensibilidad del consumidor anterior: variar únicamente `aporte.importeEurosExactos` cambia las seis salidas explícitas. La lectura exacta está en `conexion.ts`; `adaptador.ts` obtiene el aporte mediante `calcularActividad2025`. El nuevo modo rechaza al alcanzar ese productor. Los callbacks de esa contraprueba son testigos de sensibilidad del consumidor anterior, nunca productores del modo causal.

R40-03 permanece fuera: `mapError` conserva el operando y no modela toda transformación/canal/entorno/interrupción de Effect. Los rechazos alcanzados preservan payload etiquetado en `domainFailure`; hay pruebas de territorio/año y schema explícito. Las obligaciones editoriales recibidas siguen pendientes, sin reetiquetarlas a satisfied. Una traza no autentica el runtime ni acepta fiscalidad.

COMANDOS.json conserva los comandos y códigos de salida de las validaciones. Solo se usan como evidencia las pasadas sobre las fuentes fijadas.

Tipos TS del alcance y de las dos baterías históricas se distinguen del global. CheckJs conserva 43 diagnósticos previos, sin nuevos en los archivos R60; un host de tipos con tres preimágenes por blob reproduce 43 diagnósticos en las mismas posiciones/códigos de la deuda previa. El texto de algunas uniones varía por orden de carga; la comparación textual fallida se conserva. No se declara checkJs global verde. La comprobación global conserva sus rojos de resolución/fixtures/reportes del checkout; las dos incompatibilidades nuevas del retorno histórico se corrigieron y se ensayan en el alcance. Oxlint usa plugins reales cotejados por hash y las 16 reglas a error. ESLint conserva los avisos registrados. No se ejecutaron builds ni suites legacy masivas.

Resultados de entrega: 41 pruebas del pase conjunto (incluidas 30 regresiones históricas R36/R42), un ensayo adicional con siete casos, y 95 regresiones SS/retenciones/rentas. Son grupos separados y repeticiones conservadas, sin multiplicar recuentos. Ajv 2020 real valida contrato y 50 testigos/1.144 salidas; cuatro mutantes estructurales se rechazan. El intento Python incompleto se conserva como cancelado. Se eligió el validador 2020 ya disponible en caché por coste de ejecución, con strict=true, sin coerción, valores por defecto ni eliminación de campos. Se corrigen los schemas propios para representar las anotaciones de unidades ricas/simples y las dos gramáticas de bindings; no se eliminan metadatos para pasarlos.

## Conservación y entrega

El alcance de código comprende el núcleo R57, el protocolo de ejecución R54 y el consumidor R36; no amplía el productor R36 ni el motor.

Los manifiestos del paquete histórico conservan sus hashes; la integridad no acredita aceptación fiscal.

## Trabajo pendiente del lote

La implementación se entrega como candidata. El núcleo, los contratos y las 28 decisiones requieren revisión independiente. Las seis ramas de actividad requieren el trabajo expresamente excluido y quedan documentadas como bloqueo, sin presupuestar ni iniciar las 19 familias. La deuda previa checkJs y el host global rojo permanecen visibles para la integración. Las dependencias enlazadas se evalúan; el aporte excluido se rechaza. La revisión de R59, si sigue pendiente en el integrador, conserva su trámite propio. No hay cierre fiscal automático.

Resultados del índice: 50 casos, 1144 salidas emitidas, 28 clases de sitio; recuentos solapados con los ensayos, sin sumar como reglas fiscales.
