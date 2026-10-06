# Auditoria de progresividad en frio

Este contexto modela una auditoria historica de salarios, cotizaciones, IRPF e inflacion para democratizar el conocimiento del salario neto, el IRPF y la progresividad en frio en Espana entre 2012 y 2026. La calculadora web es una interfaz educativa sobre esa auditoria, no el dominio completo.

## Language

**Auditoria de progresividad en frio**:
Analisis historico que compara salarios equivalentes ajustados por IPC para medir como cambia la carga fiscal y el salario neto real.
_Avoid_: Calculadora de IRPF, calculadora de salario neto, hachazo fiscal silencioso

**Desajuste por inflacion**:
Diferencia entre la evolucion de importes fiscales y la evolucion de salarios equivalentes ajustados por IPC.
_Avoid_: Hachazo fiscal silencioso

**Calculo de salario neto e IRPF**:
Aplicacion de reglas de cotizacion, reducciones, minimos, deducciones y tramos de IRPF a un caso fiscal simplificado para estimar salario neto, coste laboral y carga fiscal.
_Avoid_: Nomina, simulacion fiscal generica

**Estimacion IRPF legacy**:
Cadena simplificada heredada que obtiene el IRPF final del caso fiscal simplificado legacy.
_Avoid_: Liquidacion anual del IRPF, procedimiento de retencion, calculo del IRPF

**Liquidacion anual del IRPF**:
Resultado del calculo de la declaracion anual del IRPF a partir de bases, minimos, escalas, deducciones, retenciones y pagos a cuenta.
_Avoid_: Retencion, tipo de nomina, interfaz de liquidacion

**Liquidacion IRPF anual calculada**:
Liquidacion anual del IRPF completada por el motor para un caso fiscal soportado.
_Avoid_: Resultado liquidacion IRPF, resultado soportado, estado de frontera

**Etapa de liquidacion**:
Transformacion nombrada dentro de una liquidacion anual que produce importes fiscalmente significativos.
_Avoid_: Bloque auxiliar, paso tecnico, variable temporal

**Valor intermedio de liquidacion**:
Resultado tipado de una etapa de liquidacion con significado fiscal propio.
_Avoid_: Variable temporal, cache, campo auxiliar

**Redondeo de liquidacion**:
Frontera explicita donde importes monetarios exactos se convierten en importes liquidados.
_Avoid_: Redondeo implicito, redondeo por etapa, formato visual

**Politica monetaria**:
Servicio de dominio que define redondeos y conversiones monetarias de una ejecucion.
_Avoid_: If por modo, helper global implicito, formato visual

**Procedimiento de retencion**:
Calculo del tipo e importe de retencion a cuenta sobre rendimientos del trabajo.
_Avoid_: Liquidacion anual del IRPF, estimacion IRPF legacy, tipo de nomina

**Deduccion por obtencion de rendimientos del trabajo**:
Deduccion estatal introducida en la Ley 35/2006 para reducir o eliminar el IRPF de perceptores del SMI y rentas de trabajo proximas. En el codigo puede aparecer historicamente como deduccion SMI, pero ese nombre es un alias pedagogico o legacy, no el nombre juridico canonico.
_Avoid_: Deduccion SMI canonica, minimo exento de retencion, reduccion por rendimientos del trabajo

**IRPF final**:
Importe de IRPF aplicado al salario bruto tras minimos, deducciones y limites.
_Avoid_: Estimacion IRPF legacy, Liquidacion anual del IRPF, cuota integra

**Cotizacion del trabajador**:
Cotizacion social deducida del salario bruto para calcular el salario neto.
_Avoid_: Cotizacion empresarial, seguridad social total

**Cotizacion empresarial**:
Cotizacion social anadida al salario bruto para calcular el coste laboral.
_Avoid_: Cotizacion del trabajador, seguridad social total

**Salario bruto anual**:
Importe anual antes de cotizacion del trabajador e IRPF usado como entrada monetaria del caso fiscal simplificado.
_Avoid_: Salario bruto, sueldo, salario mensual

**Coste laboral**:
Suma del salario bruto y la cotizacion empresarial.
_Avoid_: Salario bruto, coste empresa ambiguo

**Salario neto anual**:
Importe anual restante tras cotizacion del trabajador e IRPF final.
_Avoid_: Salario neto mensual, sueldo neto ambiguo

**Salario neto mensual equivalente**:
Salario neto anual dividido por un numero declarado de pagas para facilitar lectura.
_Avoid_: Salario neto anual, nomina mensual real

**Distribucion de pagas**:
Numero de pagas usado para presentar importes anuales como importes mensuales equivalentes.
_Avoid_: Regla fiscal, cambio de calculo anual

**Calculo unitario**:
Calculo de salario neto e IRPF para un unico caso fiscal simplificado en un unico ano fiscal.
_Avoid_: Auditoria completa, exportacion Excel

**Caso fiscal ponderado**:
Caso fiscal anual acompanado de un peso de agregacion y un origen de muestra. Un caso individual tiene peso 1; un barrido salarial y una poblacion representativa se expresan como conjuntos de casos fiscales ponderados para reutilizar la misma logica de calculo e impacto.
_Avoid_: Fila de barrido sin caso fiscal, poblacion separada del motor, salario suelto como unidad agregable

**Perfil fiscal construible**:
Definicion reusable de circunstancias personales, familiares, territoriales, laborales y de rentas que puede materializarse como uno o varios casos fiscales anuales. Debe servir tanto a perfiles predefinidos de auditoria como a un futuro constructor custom de usuario.
_Avoid_: Plantilla cerrada, formulario de liquidacion, caso anual ya materializado

**Perfil longitudinal proyectable**:
Perfil fiscal construible que declara como proyectar circunstancias, salarios, edades, comunidad y rentas a traves de varios anos fiscales. Permite que `/liquidacion-irpf` materialice un caso anual y que `auditoria/` materialice una serie historica comparable.
_Avoid_: Caso anual duplicado por ano, regla de proyeccion escondida en auditoria, comparacion historica sin perfil

**Estrategia de proyeccion salarial**:
Regla declarada por un perfil longitudinal proyectable para materializar salarios en varios anos fiscales. Las estrategias soportadas inicialmente son salario bruto real constante, coste laboral real constante y trayectoria salarial propia basada en datos economicos o entrada del usuario.
_Avoid_: IPC implicito, salario historico hardcodeado, selector visual sin semantica

**Variante de auditoria**:
Resultado alternativo dentro de una misma auditoria normativa historica que cambia una dimension navegable, como la estrategia de proyeccion salarial, sin cambiar el perfil, periodo, medida normativa ni ano de referencia base del analisis.
_Avoid_: Auditoria independiente, estado visual sin URL, comparacion fuera de contexto

**Magnitud auditada**:
Resultado fiscal o laboral sobre el que se calcula y presenta impacto normativo, como IRPF final, cotizacion del trabajador, cotizacion empresarial, salario neto anual, coste laboral o carga fiscal efectiva. La magnitud por defecto de la auditoria normativa historica es IRPF final.
_Avoid_: Coste ambiguo, una unica metrica implicita, eje de grafico sin dominio

**Perspectiva ciudadano**:
Convencion de signo para impactos normativos donde un valor positivo mejora la posicion economica del ciudadano y un valor negativo empeora su posicion. Es la perspectiva por defecto de la auditoria normativa historica.
_Avoid_: Signo recaudatorio implicito, delta de cuota sin interpretacion, coste ambiguo

**Vista de bolsillo**:
Presentacion de impacto normativo sobre salario neto anual o mensual equivalente desde la perspectiva ciudadano. Complementa la magnitud auditada por defecto de IRPF final cuando el usuario necesita leer el efecto como dinero disponible.
_Avoid_: IRPF pagado, recaudacion, coste laboral

**Contrato URL de auditoria**:
Esquema versionado de parametros de URL que serializa una auditoria normativa historica y su variante seleccionada. La version inicial usa `v=1` para estabilizar enlaces compartidos y permitir migraciones futuras del contrato.
_Avoid_: Estado local no compartible, nombres internos de componentes, URL sin version

**Perfil fiscal predefinido**:
Perfil fiscal construible mantenido por el producto para auditoria y comparacion publica, como persona soltera sin hijos o pareja con hijos.
_Avoid_: Caso fiscal fijo, input libre de liquidacion, segmento estadistico sin definicion fiscal

**Desglose de salario neto e IRPF**:
Resultado explicable del calculo que muestra como se pasa del salario bruto al salario neto y que parte corresponde a cotizaciones, IRPF y ajustes normativos.
_Avoid_: Desglose fiscal-laboral, nomina

**Rastro de calculo**:
Secuencia estructurada de pasos, importes e impactos que explica como el motor produjo un desglose.
_Avoid_: Log tecnico, exposicion de funciones internas

**Explicacion de liquidacion IRPF**:
Construccion de un rastro de calculo a partir de una liquidacion IRPF anual calculada y sus valores intermedios.
_Avoid_: Etapa de liquidacion, regla fiscal, texto embebido en calculo

**Version de explicacion**:
Version del esquema usado para representar rastros de calculo, impactos normativos y evidencias educativas.
_Avoid_: Version del algoritmo, version normativa

**Version de datos de referencia**:
Identificador del conjunto de parametros normativos y datos economicos usados por un calculo o auditoria.
_Avoid_: Version del algoritmo, version de explicacion

**Procedencia normativa ejecutable**:
Identidad trazable que enlaza un parametro normativo ejecutable o regla de calculo con la medida normativa computable, paquete normativo y fuentes que justifican su valor. Es la base para auditar por que un numero existe antes de construir escenarios contrafactuales.
_Avoid_: Comentario de codigo, fuente suelta, nombre de archivo como procedencia

**Medida normativa computable**:
Unidad trazable de cambio normativo que altera una regla, parametro, escala, minimo, deduccion, cotizacion o limite ejecutado por el motor. Es la unidad principal para atribuir impacto; las normas juridicas publicadas son fuentes o evidencias asociadas, no necesariamente la unidad de impacto.
_Avoid_: Norma juridica completa, BOE como unidad de coste, cambio de codigo sin fuente

**Regla normativa computable**:
Formula, condicion de aplicabilidad o etapa de liquidacion trazada a una medida normativa computable. Complementa a los parametros normativos ejecutables cuando el cambio normativo no se reduce a un valor escalar.
_Avoid_: Formula anonima, parametro complejo sin etapa, logica fiscal sin fuente

**Escala autonomica anual computable**:
Medida normativa computable que agrupa la escala autonomica completa de una comunidad autonoma para un ano fiscal. En la primera version se trata como unidad indivisible de impacto salvo que una fuente normalizada justifique descomponer cambios de tramos o tipos.
_Avoid_: Tramo autonomico aislado sin fuente, escala estatalizada, deduccion autonomica

**Catalogo interactivo de deducciones autonomicas**:
Conjunto de fichas de deducciones autonomicas expuestas para consulta e interaccion en la liquidacion IRPF de un ano cubierto. No forma parte de la auditoria normativa historica salvo decision explicita, porque auditar todas las deducciones de todos los anos multiplicaria el alcance y los requisitos de entrada.
_Avoid_: Medida obligatoria de auditoria, cobertura historica de deducciones, coste ciudadano agregado por deducciones

**Paquete normativo**:
Agrupacion presentable de medidas normativas computables que comparten una intencion politica, una norma fuente o una explicacion publica. Sirve para comunicar impacto agregado al usuario, mientras que el calculo atribuible se mantiene en las medidas computables que lo componen.
_Avoid_: Medida computable indivisible, BOE completo, categoria visual sin medidas

**Version del algoritmo**:
Identificador de las reglas de calculo ejecutadas por el motor exacto.
_Avoid_: Version normativa, version de explicacion

**Motor exacto**:
Nucleo determinista que calcula resultados con precision interna explicita y redondea solo en fronteras de salida.
_Avoid_: Calculadora, UI

**Exportacion compatible**:
Salida que replica el Excel del proyecto original, incluyendo nombres de hojas, columnas, orden y redondeos.
_Avoid_: Vista educativa, exportacion Excel generica

**Exportacion compatible de comparativa**:
Salida acotada que replica solo la hoja `COMPARATIVA_INFLACION` del Excel original para un rango salarial declarado.
_Avoid_: Exportacion compatible completa, equivalencia tabular completa

**Exportacion compatible completa**:
Salida compatible implementada que replica todas las hojas del Excel original: control, comparativa de inflacion y hojas anuales `DAT_YYYY`.
_Avoid_: Exportacion compatible de comparativa, exportacion educativa

**Exportacion educativa**:
Salida descargable orientada a explicar resultados, hallazgos e impactos normativos sin obligacion de coincidir con el Excel legacy.
_Avoid_: Exportacion compatible, fixture legacy

**Formato de exportacion**:
Representacion concreta de una exportacion, como Excel, CSV, JSON Lines o documento imprimible.
_Avoid_: Exportacion, contrato de compatibilidad

**Ejecucion local**:
Calculo y exportacion realizados en el dispositivo del usuario sin enviar datos salariales a un servidor.
_Avoid_: Backend de calculo, subida de salario

**Generacion incremental de exportacion compatible**:
Ejecucion local de una exportacion compatible completa en lotes cooperativos con progreso visible por hoja y rango generado.
_Avoid_: Backend de exportacion, descarga bloqueante, exportacion parcial

**Equivalencia tabular**:
Garantia de que cada hoja, columna, fila y celda de datos de la exportacion compatible coincide con el Excel original bajo reglas explicitas de tipos, orden y redondeo.
_Avoid_: Igualdad binaria, igualdad visual

**Oracle legacy congelado**:
Version estable del proyecto original usada como referencia fija para validar la migracion inicial.
_Avoid_: Upstream, verdad normativa

**Oracle upstream**:
Version actualizada del proyecto original usada para detectar cambios futuros de normativa o algoritmo.
_Avoid_: Fixture, version congelada

**Fixture legacy Excel**:
Archivo Excel generado por el oracle legacy congelado y usado como referencia rapida de equivalencia tabular.
_Avoid_: Oracle, exportacion compatible

**Regeneracion legacy**:
Proceso pesado que vuelve a ejecutar el script Python legacy para comprobar o actualizar el fixture legacy Excel.
_Avoid_: Test rapido, test unitario

**Vista educativa del calculo**:
Representacion pedagogica de un desglose de salario neto e IRPF optimizada para comprension aunque no copie literalmente el Excel original.
_Avoid_: Exportacion compatible, Excel

**Detalle progresivo**:
Forma de presentar resultados que muestra primero las magnitudes principales y permite abrir rastros, evidencias y fuentes sin ocultarlas.
_Avoid_: Ocultar complejidad, tabla exhaustiva inicial

**Paso de explicacion**:
Seccion titulada de un rastro de calculo que agrupa evidencias, impactos y fuentes relacionadas.
_Avoid_: Log tecnico, texto suelto

**Explicacion v1**:
Primera version de explicacion con pasos de equivalencia por inflacion, cotizaciones sociales, reduccion y base del IRPF, tramos minimos y deducciones, limite de retencion e IRPF final, y salario neto con perdida o ganancia real.
_Avoid_: Orden ad hoc de acordeones

**Consulta individual**:
Exploracion educativa de un caso fiscal simplificado para un salario bruto anual concreto.
_Avoid_: Auditoria completa, barrido salarial

**Interfaz experta de liquidacion IRPF**:
Ruta de producto para tecnicos y expertos que captura las variables necesarias de una liquidacion anual del IRPF.
_Avoid_: Simulador completo, consulta individual, calculadora de nomina

**Auditoria normativa historica**:
Analisis historico en `auditoria/` que calcula impactos normativos entre anos con casos y escenarios trazables. Su objetivo es atribuir cambios de IRPF, cotizaciones, salario neto o coste laboral sin las simplificaciones legacy de persona soltera, sin hijos y autonomia estatalizada.
_Avoid_: Catalogo completo de deducciones autonomicas, liquidacion individual interactiva, perfil legacy simplificado

**Comparacion ajustada por IPC**:
Comparacion entre el ano de referencia y un ano comparado usando salarios equivalentes por IPC e importes reexpresados en euros del ano de referencia.
_Avoid_: Comparacion nominal, aplicar leyes pasadas a salario actual sin ajuste

**Escenario contrafactual normativo**:
Calculo alternativo que mantiene fijo el caso fiscal, el ano economico y el conjunto de datos de poblacion o barrido, cambiando solo una medida normativa declarada para aislar su impacto atribuible.
_Avoid_: Comparacion interanual, evolucion historica observada, simulacion sin versionar

**Escenario normativo versionado**:
Conjunto identificado de medidas normativas computables activas e inactivas que construye una variante reproducible de los parametros y reglas de un ano fiscal. Sirve para ejecutar escenarios reales y contrafactuales sin perder la procedencia normativa de cada valor.
_Avoid_: Flag suelto, modo de UI, parche temporal de parametros

**Impacto atribuible a una medida normativa**:
Diferencia entre el resultado con una medida normativa aplicada y su escenario contrafactual normativo equivalente. No debe inferirse por simple comparacion con el ano anterior porque ahi se mezclan IPC, salarios, otras reformas y cambios territoriales.
_Avoid_: Coste de legislacion ambiguo, variacion anual, perdida recaudatoria sin contrafactual

**Impacto marginal secuenciado**:
Impacto atribuible calculado aplicando medidas normativas computables en un orden explicito y versionado dentro de un paquete normativo. Es la metrica principal para presentar desgloses agregables por paquete, porque respeta interacciones entre reducciones, minimos, deducciones, escalas y limites.
_Avoid_: Impacto independiente, reparto proporcional implicito, suma de deltas sin orden

**Impacto aislado**:
Impacto atribuible calculado activando una sola medida normativa computable contra el escenario contrafactual base. Sirve para auditoria y vista experta, pero no garantiza que la suma de impactos aislados coincida con el impacto agregado cuando hay interacciones entre medidas.
_Avoid_: Coste agregado del paquete, impacto marginal secuenciado

**Impacto acumulado ajustado por IPC**:
Suma de impactos atribuibles de una medida normativa computable o paquete normativo desde su ano de introduccion hasta el ano de referencia, reexpresando cada impacto anual en euros del ano de referencia mediante IPC. Sirve para responder cuanto IRPF, cotizaciones o salario neto ha cambiado acumuladamente para un caso o barrido desde que existe la medida.
_Avoid_: Impacto anual, comparacion nominal acumulada, coste exacto sin ano de referencia

**Baseline anual sin medida**:
Escenario contrafactual normativo de un ano fiscal concreto que conserva la normativa real de ese mismo ano excepto la medida normativa computable evaluada. Es el baseline para calcular impacto anual atribuible y para acumular impactos por IPC a traves de varios anos.
_Avoid_: Normativa anterior prorrogada, mundo historico alternativo, comparacion interanual

**Control preciso de salario**:
Entrada numerica que conserva el salario bruto anual exacto introducido por el usuario.
_Avoid_: Slider, redondeo al millar

**Control rapido de salario**:
Slider que puede actualizar el salario bruto anual en incrementos pedagogicos de 1.000 euros dentro de un rango acotado.
_Avoid_: Fuente exacta, entrada monetaria precisa

**Rango pedagogico del salario**:
Rango acotado del control rapido de salario elegido para mostrar cambios relevantes en cotizaciones, IRPF y progresividad en frio.
_Avoid_: Umbral de IRPF de un unico ano, rango exhaustivo

**Aviso de sobrescritura de salario**:
Confirmacion mostrada antes de que el control rapido de salario reemplace un valor introducido mediante el control preciso de salario.
_Avoid_: Redondeo silencioso, perdida accidental de precision

**Exploracion por rango salarial**:
Exploracion educativa de una auditoria de progresividad en frio para un rango de salarios.
_Avoid_: Consulta individual, exportacion Excel

**Barrido salarial**:
Generacion masiva de calculos unitarios sobre un rango de salarios para auditoria o exportacion.
_Avoid_: Consulta individual, experiencia de usuario

**Rango nominal**:
Rango de salarios brutos anuales expresados en euros del ano calculado.
_Avoid_: Rango equivalente de referencia

**Rango equivalente de referencia**:
Rango de salarios brutos anuales expresados en euros del ano de referencia para comparaciones por IPC.
_Avoid_: Rango nominal

**Hallazgo de auditoria**:
Observacion derivada de una exploracion por rango salarial que identifica un umbral, salto, cambio normativo o patron relevante.
_Avoid_: Fila Excel, dato aislado

**Poder adquisitivo neto**:
Salario neto expresado en euros del ano de referencia mediante ajuste por IPC.
_Avoid_: Salario neto nominal, sueldo real ambiguo

**Entrada monetaria**:
Importe introducido por el usuario o por fixtures y validado a centimos.
_Avoid_: Float, number

**Importe monetario**:
Cantidad en euros representada internamente con decimal exacto y sin IEEE754.
_Avoid_: Float, number

**Importe liquidado**:
Importe monetario redondeado a centimos en una frontera explicita de salida o comparacion.
_Avoid_: Importe intermedio, redondeo implicito

**Modo compatible legacy**:
Modo de salida que replica el Excel original incluso cuando requiere conservar decisiones tecnicas heredadas observables.
_Avoid_: Modo canonico, verdad normativa

**Modo canonico**:
Modo de salida que aplica reglas del dominio con decimal exacto y redondeo explicito.
_Avoid_: Modo compatible legacy, output historico

**Perfil de calculo**:
Conjunto de hipotesis que decide que reglas de calculo se activan.
_Avoid_: Modo visual, configuracion UI

**Perfil de compatibilidad historica**:
Perfil de calculo que reproduce el caso simplificado observable del oracle historico: persona individual sin descendientes ni ascendientes, sin discapacidad, tramo autonomico estatalizado, deduccion por obtencion de rendimientos del trabajo cuando aplique y limite final de retencion del 43 por ciento. Puede implementarse sobre datos normativos trazados sin convertir esas hipotesis en la verdad fiscal general.
_Avoid_: Legacy como nombre de dominio, liquidacion completa, perfil fiscal real del usuario

**Carga fiscal efectiva**:
Proporcion de una base elegida absorbida por IRPF y cotizaciones bajo un caso fiscal.
_Avoid_: Tipo marginal, IRPF final

**Tipo efectivo del IRPF**:
Proporcion del salario bruto anual absorbida por el IRPF final, excluyendo cotizaciones sociales.
_Avoid_: Carga fiscal efectiva, tipo marginal, retencion

**Vista de carga sobre salario bruto**:
Lectura de la carga fiscal efectiva respecto al salario bruto anual.
_Avoid_: Cuna fiscal laboral

**Vista de cuna fiscal laboral**:
Lectura de la parte del coste laboral que no llega al salario neto por cotizaciones e IRPF.
_Avoid_: Carga sobre salario bruto

**Impacto normativo**:
Explicacion de como una regla fiscal o laboral modifica un desglose de salario neto e IRPF para un caso y ano concretos.
_Avoid_: Enciclopedia legal, documentacion normativa aislada

**Evidencia de calculo**:
Dato numerico concreto que justifica un impacto normativo dentro de un desglose.
_Avoid_: Texto explicativo sin dato, conclusion no trazable

**Fuente normativa normalizada**:
Transcripcion o resumen estructurado de una fuente oficial convertido a Markdown o texto para trabajo humano y trazabilidad.
_Avoid_: Parametro normativo ejecutable, regla de calculo, PDF operativo

**Fuente pendiente**:
Estado explicito de un parametro normativo ejecutable o regla de calculo cuya procedencia aun no ha sido verificada.
_Avoid_: Fuente normativa normalizada, valor sin marcar

**Parametro normativo ejecutable**:
Dato numerico o tabla derivada de una fuente normativa normalizada y usada por el motor exacto.
_Avoid_: Fuente normativa normalizada, comentario, regla de calculo

**Repositorio normativo**:
Servicio de dominio que entrega parametros normativos ejecutables para un area concreta.
_Avoid_: Archivo de datos, helper de constante, fuente normativa normalizada

**Fachada de parametros normativos**:
Servicio de dominio que compone repositorios normativos especializados para los consumidores de alto nivel.
_Avoid_: Servicio gigante de datos, import directo de constantes normativas

**Dato economico**:
Valor macroeconomico usado para ajustar o interpretar resultados fiscales sin ser una regla normativa.
_Avoid_: Parametro normativo ejecutable, regla de calculo

**Factor IPC acumulado**:
Multiplicador entre un ano base y el ano de referencia usado para expresar importes en euros comparables.
_Avoid_: Inflacion suelta, tasa anual aislada

**Regla de calculo**:
Transformacion determinista que usa entradas del caso fiscal y parametros normativos ejecutables para producir una parte del desglose.
_Avoid_: Funcion tecnica privada, formula suelta, parametro normativo ejecutable

**Servicio de dominio**:
Capacidad de dominio con frontera clara y composicion explicita mediante Effect.
_Avoid_: Funcion pura pequena, modulo tecnico, motor impuestos

**Ausencia legitima**:
Estado esperado donde un dato puede no existir sin invalidar ni des-soportar el caso.
_Avoid_: Null, undefined, resultado no soportado, error tecnico

**Ficha catalogada**:
Deduccion autonomica reconocida en una fuente normativa normalizada pero no habilitada para calculo automatico.
_Avoid_: Pendiente, ficha base, implementada parcial

**Ficha implementada**:
Deduccion autonomica con estado explicito `implementada`, datos normalizados suficientes y comportamiento habilitado por el motor o la interfaz.
_Avoid_: Pendiente, ficha catalogada, entrada provisional

**Resultado no soportado**:
Estado explicito que indica que el motor reconoce un caso fiscal pero todavia no implementa sus reglas.
_Avoid_: Cero silencioso, fallback aproximado, limitacion de alcance

**Fallo esperado de dominio**:
Resultado recuperable previsto por el dominio y transportado en el canal de error de Effect.
_Avoid_: Defect, excepcion inesperada, valor de exito ambiguo

**Estado de frontera**:
Union presentable producida por un adaptador externo al nucleo de dominio.
_Avoid_: Resultado interno, liquidacion calculada, fallo esperado

**Caso de referencia canonico**:
Entrada y salida esperada versionadas que permiten validar implementaciones alternativas del motor sin depender del Excel.
_Avoid_: Excel, captura visual, test snapshot opaco

**Suite de referencia minima**:
Conjunto pequeno de casos de referencia canonicos elegido para cubrir umbrales, cambios normativos y ejemplos pedagogicos.
_Avoid_: Suite exhaustiva, fixture legacy Excel

**Suite de referencia exhaustiva**:
Conjunto masivo de casos de referencia canonicos usado para validar equivalencia completa del motor.
_Avoid_: Suite minima, smoke test

**Caso fiscal anual**:
Representacion completa de las circunstancias fiscales de una persona o unidad familiar para un ano fiscal concreto.
_Avoid_: Salario bruto, nomina, consulta individual

**Caso fiscal simplificado legacy**:
Caso fiscal anual reducido usado por el modelo historico heredado de progresividad en frio.
_Avoid_: Caso general de Renta, verdad normativa completa, caso fiscal simplificado

**Perfil de progresividad en frio legacy**:
Perfil de calculo que reproduce las hipotesis y resultados observables del modelo historico de progresividad en frio.
_Avoid_: Motor general de Renta, modo canonico, verdad normativa completa

**Hipotesis fiscal**:
Restriccion o simplificacion declarada que limita el alcance de un caso fiscal o auditoria.
_Avoid_: Regla normativa, valor por defecto oculto

**Hipotesis de tramo autonomico estatalizado**:
Supuesto simplificado donde el tramo autonomico se iguala al estatal para calcular una escala total de IRPF.
_Avoid_: Tramo autonomico real, comunidad autonoma

**Limitacion de alcance**:
Condicion reconocida por el modelo pero no calculable todavia con garantias.
_Avoid_: Error tecnico, cero silencioso

**Situacion familiar fiscal**:
Conjunto de circunstancias personales y familiares que afectan minimos, deducciones y retenciones.
_Avoid_: Perfil, usuario

**Situacion familiar individual sin descendientes**:
Situacion familiar fiscal simplificada de una persona soltera sin hijos.
_Avoid_: Soltero sin hijos como texto libre

**Ano de referencia**:
Ano fiscal contra el que se comparan salarios equivalentes e importes ajustados por IPC en una auditoria de progresividad en frio.
_Avoid_: Ano destino hardcodeado, ano actual

**Periodo de auditoria**:
Intervalo de anos fiscales incluidos en una auditoria de progresividad en frio.
_Avoid_: Rango hardcodeado, anos disponibles

**Periodo legacy 2012-2026**:
Periodo de auditoria cubierto por el oracle legacy congelado.
_Avoid_: Periodo actual, todos los anos

**Exportacion Excel**:
Representacion tabular compatible con el output historico del proyecto original.
_Avoid_: Informe, reporte

## Relationships

- Un **Caso fiscal simplificado legacy** es un tipo de **Caso fiscal anual**.
- Un **Caso fiscal simplificado legacy** es la entrada legacy de un **Calculo de salario neto e IRPF**.
- Un **Caso fiscal simplificado legacy** declara sus **Hipotesis fiscales**.
- Un **Caso fiscal simplificado legacy** incluye una **Situacion familiar fiscal**.
- Un **Caso fiscal simplificado legacy** incluye un **Salario bruto anual** como unica renta relevante.
- Un **Caso fiscal simplificado legacy** asume persona individual, sin descendientes, sin ascendientes, sin discapacidad y tramo autonomico igualado al estatal.
- Un **Calculo unitario** usa un **Perfil de calculo**.
- El **Perfil de progresividad en frio legacy** aplica al **Caso fiscal simplificado legacy**.
- El **Perfil de compatibilidad historica** nombra la semantica fiscal del caso simplificado que hoy se implementa en rutas legacy.
- La **Hipotesis de tramo autonomico estatalizado** es una **Hipotesis fiscal** actual del proyecto.
- Una **Limitacion de alcance** describe una frontera de producto o documentacion; un **Resultado no soportado** es el estado devuelto por el motor.
- La **Situacion familiar individual sin descendientes** es la **Situacion familiar fiscal** actual del proyecto.
- Un **Calculo de salario neto e IRPF** incluye una **Estimacion IRPF legacy** cuando usa el **Perfil de progresividad en frio legacy**.
- Una **Estimacion IRPF legacy** produce un **IRPF final**.
- Una **Liquidacion anual del IRPF** no es un **Procedimiento de retencion**.
- Una **Liquidacion IRPF anual calculada** es el exito de una **Liquidacion anual del IRPF** para un caso soportado.
- Un **Procedimiento de retencion** puede usarse como evidencia o comparacion, pero no sustituye a una **Liquidacion anual del IRPF**.
- Un **Calculo de salario neto e IRPF** produce una **Cotizacion del trabajador**, una **Cotizacion empresarial** y un **Coste laboral**.
- Un **Calculo de salario neto e IRPF** produce un **Salario neto anual**.
- Un **Salario neto mensual equivalente** se deriva de un **Salario neto anual** mediante una **Distribucion de pagas**.
- Un **Calculo unitario** aplica un **Calculo de salario neto e IRPF** a un unico ano fiscal.
- Un **Caso fiscal ponderado** envuelve un **Caso fiscal anual** para agregacion.
- Un **Perfil fiscal construible** materializa uno o varios **Casos fiscales ponderados**.
- Un **Perfil longitudinal proyectable** es un **Perfil fiscal construible** para auditorias historicas.
- Un **Perfil longitudinal proyectable** declara una **Estrategia de proyeccion salarial**.
- La estrategia por defecto de una **Auditoria normativa historica** es salario bruto real constante salvo que el perfil predefinido declare una trayectoria salarial propia.
- Una **Auditoria normativa historica** puede contener varias **Variantes de auditoria** navegables y serializadas en parametros de URL.
- Una **Variante de auditoria** declara una **Magnitud auditada**.
- Una **Auditoria normativa historica** presenta impactos por defecto desde la **Perspectiva ciudadano**.
- Una **Auditoria normativa historica** puede presentar una **Vista de bolsillo** junto a la magnitud auditada cuando el impacto en dinero disponible difiera o sea pedagogicamente util.
- Una **Auditoria normativa historica** usa un **Contrato URL de auditoria** para reproducir perfil, periodo, ano de referencia, medida o paquete, comunidad, estrategia salarial y vista.
- Un **Perfil fiscal predefinido** es un **Perfil fiscal construible** mantenido por el producto.
- Un **Barrido salarial** produce **Casos fiscales ponderados** sinteticos.
- Un **Calculo de salario neto e IRPF** produce un **Desglose de salario neto e IRPF**.
- Un **Desglose de salario neto e IRPF** puede incluir un **Rastro de calculo**.
- Un **Rastro de calculo** declara una **Version de explicacion**.
- Un **Calculo unitario** declara una **Version de datos de referencia** y una **Version del algoritmo**.
- Una **Procedencia normativa ejecutable** enlaza un **Parametro normativo ejecutable** o una **Regla de calculo** con una **Medida normativa computable**.
- Una **Medida normativa computable** puede incluir **Parametros normativos ejecutables** y **Reglas normativas computables**.
- Una **Regla normativa computable** declara condiciones de aplicabilidad, etapa de liquidacion y metrica afectada cuando sea relevante para calcular impacto.
- Un **Escenario normativo versionado** declara que **Medidas normativas computables** estan activas para un calculo.
- Un **Escenario contrafactual normativo** es un **Escenario normativo versionado** construido para desactivar o sustituir una medida concreta.
- Una **Auditoria de progresividad en frio** declara una **Version de datos de referencia**, una **Version del algoritmo** y una **Version de explicacion** cuando incluye rastros educativos.
- Un **Motor exacto** produce **Desgloses de salario neto e IRPF**.
- Un **Servicio de dominio** encapsula una capacidad con frontera clara o dependencias intercambiables, no cada funcion aritmetica pura.
- Un **Servicio de dominio** usa primitivas de Effect cuando evitan `undefined`, mutacion, casts o estados invalidos.
- Una **Ausencia legitima** se modela con `Option`, no con `null` ni `undefined`.
- Un **Resultado no soportado** es un **Fallo esperado de dominio** cuando debe interrumpir una liquidacion o auditoria.
- Un **Resultado no soportado** viaja por el canal de error esperado dentro de los servicios de dominio.
- Un adaptador de frontera puede recuperar un **Resultado no soportado** y convertirlo en un **Estado de frontera**.
- Un **Fallo esperado de dominio** no sustituye a una **Ausencia legitima**.
- Una entrada invalida, un parametro normativo ausente o un **Resultado no soportado** se modelan como errores esperados tipados si el llamador puede recuperarlos.
- Una ruptura de invariantes que indique bug se modela como defecto, no como **Fallo esperado de dominio**.
- Una **Liquidacion anual del IRPF** se compone de **Etapas de liquidacion** ordenadas y nombradas.
- Una **Etapa de liquidacion** produce uno o mas **Valores intermedios de liquidacion**.
- Un **Valor intermedio de liquidacion** puede alimentar **Evidencias de calculo** y trazabilidad tecnica.
- Un **Valor intermedio de liquidacion** conserva precision monetaria exacta hasta el **Redondeo de liquidacion**.
- El **Redondeo de liquidacion** produce **Importes liquidados** para salida publica, exportacion o comparacion.
- El **Modo compatible legacy** y el **Modo canonico** seleccionan una **Politica monetaria** mediante capas Effect.
- Una **Etapa de liquidacion** consume una **Politica monetaria** cuando necesita una frontera monetaria; no inspecciona directamente el modo.
- Una **Explicacion de liquidacion IRPF** deriva el **Rastro de calculo** desde una **Liquidacion IRPF anual calculada** y sus **Valores intermedios de liquidacion**.
- Una **Etapa de liquidacion** no debe depender de textos educativos para calcular.
- Una **Vista educativa del calculo** explica un **Desglose de salario neto e IRPF**.
- Una **Vista educativa del calculo** usa **Detalle progresivo**.
- Un **Rastro de calculo** se organiza en **Pasos de explicacion** segun su **Version de explicacion**.
- **Explicacion v1** es la **Version de explicacion** inicial.
- Una **Consulta individual** presenta una **Vista educativa del calculo** para un salario concreto.
- Una **Interfaz experta de liquidacion IRPF** presenta una **Liquidacion anual del IRPF** para un **Caso fiscal anual**.
- Una **Consulta individual** no sustituye a una **Interfaz experta de liquidacion IRPF**.
- La ruta `/liquidacion-irpf` aloja la **Interfaz experta de liquidacion IRPF**.
- La **Interfaz experta de liquidacion IRPF** prioriza cobertura y precision de variables sobre brevedad de formulario.
- La **Interfaz experta de liquidacion IRPF** puede incluir un **Catalogo interactivo de deducciones autonomicas** para un ano cubierto.
- Una **Liquidacion anual del IRPF** es dominio fiscal; una **Interfaz experta de liquidacion IRPF** es producto.
- Una **Auditoria normativa historica** no incluye el **Catalogo interactivo de deducciones autonomicas** salvo decision explicita de alcance.
- Una **Auditoria normativa historica** debe evitar las simplificaciones legacy cuando el objetivo sea atribucion historica precisa.
- La pantalla principal presenta una **Comparacion ajustada por IPC** para una **Consulta individual**.
- La pantalla principal usa un **Control preciso de salario** como fuente exacta y un **Control rapido de salario** para cambios al millar.
- El **Control rapido de salario** usa un **Rango pedagogico del salario**, no el primer salario con IRPF positivo en el ano de referencia.
- Un **Aviso de sobrescritura de salario** protege valores introducidos mediante el **Control preciso de salario**.
- Una **Exploracion por rango salarial** presenta patrones de una **Auditoria de progresividad en frio** para muchos salarios.
- Un **Barrido salarial** produce los calculos unitarios necesarios para una **Exploracion por rango salarial** o una **Exportacion compatible** sobre un **Rango nominal** o un **Rango equivalente de referencia**.
- Una **Exploracion por rango salarial** produce **Hallazgos de auditoria**.
- Un **Impacto normativo** se apoya en **Evidencias de calculo** y, cuando sea posible, en **Fuentes normativas normalizadas**.
- Una **Fuente pendiente** marca una **Regla de calculo** o un **Parametro normativo ejecutable** que aun necesita verificacion.
- Un **Parametro normativo ejecutable** debe poder apuntar a una **Fuente normativa normalizada**.
- Una **Regla de calculo** usa **Parametros normativos ejecutables**.
- Un **Repositorio normativo** entrega **Parametros normativos ejecutables** de un area concreta.
- Una **Fachada de parametros normativos** compone varios **Repositorios normativos** para las capacidades raiz.
- Una **Etapa de liquidacion** consume una **Fachada de parametros normativos** o un **Repositorio normativo**; no importa archivos de datos directamente.
- Una **Ficha catalogada** puede pasar a **Ficha implementada** solo cambiando su estado y datos normalizados de forma explicita; no debe heredar nombres ni constructores de pendiente.
- Una **Ficha implementada** puede aparecer en una lista derivada de implementadas, pero la lista no es una segunda fuente de verdad.
- Un **Dato economico** puede tener fuente propia sin ser una **Fuente normativa normalizada**.
- Un **Factor IPC acumulado** es un **Dato economico** usado por una **Auditoria de progresividad en frio**.
- Una **Auditoria de progresividad en frio** puede analizar **Poder adquisitivo neto**, **Carga fiscal efectiva** y **Tipo efectivo del IRPF**.
- Un **Calculo unitario** recibe **Entradas monetarias**, opera con **Importes monetarios** y produce **Importes liquidados** en fronteras explicitas.
- Una **Exportacion compatible** usa **Modo compatible legacy**.
- Una **Vista educativa del calculo** usa **Modo canonico** salvo que muestre una comparacion legacy explicita.
- La **Carga fiscal efectiva** puede presentarse como **Vista de carga sobre salario bruto** o **Vista de cuna fiscal laboral**.
- El **Tipo efectivo del IRPF** se calcula como **IRPF final** dividido entre **Salario bruto anual**.
- La pantalla principal muestra **Vista de carga sobre salario bruto** por defecto y permite alternar a **Vista de cuna fiscal laboral**.
- En la primera version, el input editable de la pantalla principal es siempre **Salario bruto anual**; la **Vista de cuna fiscal laboral** muestra **Coste laboral** derivado.
- Un **Impacto normativo** explica una parte concreta de un **Desglose de salario neto e IRPF**.
- El **Modo compatible legacy** prioriza reproducir el **Oracle legacy congelado**.
- El **Modo canonico** prioriza decimal exacto, half-up y fronteras explicitas de redondeo.
- Un **Resultado no soportado** debe ser visible en tests y rastros; nunca debe convertirse en cero por defecto.
- Un **Caso de referencia canonico** valida una implementacion alternativa del **Motor exacto**.
- Una **Suite de referencia minima** contiene pocos **Casos de referencia canonicos** revisables a mano.
- Una **Suite de referencia exhaustiva** contiene muchos **Casos de referencia canonicos** para equivalencia completa.
- Una **Auditoria de progresividad en frio** compara muchos **Calculos de salario neto e IRPF** entre anos para analizar el **Desajuste por inflacion**.
- Una **Auditoria de progresividad en frio** tiene un **Ano de referencia**.
- Una **Auditoria de progresividad en frio** cubre un **Periodo de auditoria**.
- El **Periodo legacy 2012-2026** es el **Periodo de auditoria** del **Oracle legacy congelado**.
- Una **Exportacion compatible** representa los resultados de una **Auditoria de progresividad en frio**.
- Una **Exportacion Excel** es el formato actual de la **Exportacion compatible**.
- Una **Exportacion educativa** representa una **Vista educativa del calculo** o una **Exploracion por rango salarial**.
- Una exportacion puede tener uno o varios **Formatos de exportacion**.
- La **Ejecucion local** aplica a **Consultas individuales**, **Exploraciones por rango salarial** y exportaciones iniciales.
- La **Equivalencia tabular** compara una **Exportacion compatible** contra el Excel generado por el proyecto original.
- Un **Oracle legacy congelado** fija la referencia para la migracion inicial.
- Un **Oracle upstream** detecta cambios futuros respecto al proyecto original.
- Un **Fixture legacy Excel** materializa el resultado de un **Oracle legacy congelado**.
- Una **Regeneracion legacy** comprueba o actualiza un **Fixture legacy Excel** ejecutando el script Python original.

## Estado de implementacion

- La implementacion Effect actual entrega **Exportacion compatible completa** desde `lib/export/auditoria-excel.ts`: `CONTROL_GENERAL`, `CONTROL_TRAMOS_IRPF`, `COMPARATIVA_INFLACION` y `DAT_2012` ... `DAT_2026`.
- La validacion rapida compara `COMPARATIVA_INFLACION` contra el fixture versionado y comprueba estructura, controles y detalle anual con rangos acotados.
- La validacion pesada pendiente es regenerar o versionar un fixture completo para comparar todas las filas `DAT_YYYY` contra el oracle Python por equivalencia tabular exhaustiva.
- El historial de la brecha de alcance esta documentado en `docs/legacy-scope-gap.md`.
- Los terminos fiscales abreviados que aparecen en el codigo de dominio se explican en `docs/glosario-fiscal-motor.md`.

## Example dialogue

> **Dev:** "Cuando el usuario cambia el salario bruto en la consulta individual, estamos liquidando su declaracion de Renta?"
> **Domain expert:** "No. Esa consulta usa el perfil legacy de progresividad en frio; la declaracion completa vivira en la interfaz experta `/liquidacion-irpf` y devolvera una liquidacion anual del IRPF o un resultado no soportado."

## Flagged ambiguities

- "calculadora" se uso para referirse tanto al producto completo como a un flujo de interfaz; resuelto: el dominio raiz es **Auditoria de progresividad en frio** y la calculadora web es una interfaz sobre ese dominio.
- "nomina" aparece en el repositorio original, pero promete mas precision laboral de la que ofrece el modelo actual; resuelto: usar **Calculo de salario neto e IRPF** y **Desglose de salario neto e IRPF**.
- "100% igual al Excel" puede significar igualdad binaria, visual o de datos; resuelto: la garantia legacy sera **Equivalencia tabular**.
- "repo original" puede referirse a una version fija o a futuras versiones del autor; resuelto: distinguir **Oracle legacy congelado** y **Oracle upstream**.
- "calculadora web" puede sonar a una consulta de salario concreto; resuelto: la web ofrece **Consulta individual** y **Exploracion por rango salarial**.
- "dinero" puede significar entrada, valor intermedio o salida comparable; resuelto: distinguir **Entrada monetaria**, **Importe monetario** e **Importe liquidado**.
- "resultado correcto" puede significar compatible con el Excel original o correcto bajo reglas decimales explicitas; resuelto: distinguir **Modo compatible legacy** y **Modo canonico**.
- "minimo del slider" no debe confundirse con el primer salario con **IRPF final** positivo en el ano de referencia; resuelto: usar **Rango pedagogico del salario** para cubrir cotizaciones, IRPF historico y progresividad en frio.
- "exportacion compatible" puede confundirse con una hoja de comparativa acotada, pero el objetivo de producto es el libro legacy completo; resuelto: usar **Exportacion compatible completa** para la replica del Excel original y **Exportacion compatible de comparativa** solo si se necesita nombrar una salida deliberadamente acotada.
- "tipo efectivo" puede referirse a carga total o a IRPF puro; resuelto: usar **Tipo efectivo del IRPF** para `IRPF final / salario bruto anual` y **Carga fiscal efectiva** cuando incluya cotizaciones.
- "Calculo del IRPF" podia confundirse con la declaracion anual completa; resuelto: usar **Estimacion IRPF legacy** para el calculo heredado y **Liquidacion anual del IRPF** para el resultado de Renta.
- "retencion" podia mezclarse con la declaracion anual; resuelto: usar **Procedimiento de retencion** para el calculo a cuenta sobre rendimientos del trabajo.
- "fuente normativa" podia significar PDF, transcripcion o dato ejecutable; resuelto: distinguir **Fuente normativa normalizada** y **Parametro normativo ejecutable**.
- "simulador completo" podia sugerir una version mejorada de la consulta actual; resuelto: usar **Interfaz experta de liquidacion IRPF** para la ruta `/liquidacion-irpf`.
- "caso fiscal simplificado" era demasiado generico; resuelto: usar **Caso fiscal simplificado legacy** para el contrato historico y **Caso fiscal anual** como concepto padre.
- "motor impuestos" es demasiado amplio y reabre una mezcla ya separada por ADR; resuelto: distinguir **Auditoria de progresividad en frio**, **Liquidacion anual del IRPF** y **Procedimiento de retencion** como capacidades raiz del dominio.
