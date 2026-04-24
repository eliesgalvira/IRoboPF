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

**Calculo del IRPF**:
Cadena de bases, cuotas, minimos, deducciones y limites que determina el IRPF final.
_Avoid_: IRPF final, retencion sin desglose

**IRPF final**:
Importe de IRPF aplicado al salario bruto tras minimos, deducciones y limites.
_Avoid_: Calculo del IRPF, cuota integra

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

**Desglose de salario neto e IRPF**:
Resultado explicable del calculo que muestra como se pasa del salario bruto al salario neto y que parte corresponde a cotizaciones, IRPF y ajustes normativos.
_Avoid_: Desglose fiscal-laboral, nomina

**Rastro de calculo**:
Secuencia estructurada de pasos, importes e impactos que explica como el motor produjo un desglose.
_Avoid_: Log tecnico, exposicion de funciones internas

**Version de explicacion**:
Version del esquema usado para representar rastros de calculo, impactos normativos y evidencias educativas.
_Avoid_: Version del algoritmo, version normativa

**Version de datos de referencia**:
Identificador del conjunto de parametros normativos y datos economicos usados por un calculo o auditoria.
_Avoid_: Version del algoritmo, version de explicacion

**Version del algoritmo**:
Identificador de las reglas de calculo ejecutadas por el motor exacto.
_Avoid_: Version normativa, version de explicacion

**Motor exacto**:
Nucleo determinista que calcula resultados con precision interna explicita y redondea solo en fronteras de salida.
_Avoid_: Calculadora, UI

**Exportacion compatible**:
Salida que replica el Excel del proyecto original, incluyendo nombres de hojas, columnas, orden y redondeos.
_Avoid_: Vista educativa, exportacion Excel generica

**Exportacion educativa**:
Salida descargable orientada a explicar resultados, hallazgos e impactos normativos sin obligacion de coincidir con el Excel legacy.
_Avoid_: Exportacion compatible, fixture legacy

**Formato de exportacion**:
Representacion concreta de una exportacion, como Excel, CSV, JSON Lines o documento imprimible.
_Avoid_: Exportacion, contrato de compatibilidad

**Ejecucion local**:
Calculo y exportacion realizados en el dispositivo del usuario sin enviar datos salariales a un servidor.
_Avoid_: Backend de calculo, subida de salario

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

**Comparacion ajustada por IPC**:
Comparacion entre el ano de referencia y un ano comparado usando salarios equivalentes por IPC e importes reexpresados en euros del ano de referencia.
_Avoid_: Comparacion nominal, aplicar leyes pasadas a salario actual sin ajuste

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

**Carga fiscal efectiva**:
Proporcion de una base elegida absorbida por IRPF y cotizaciones bajo un caso fiscal.
_Avoid_: Tipo marginal, IRPF final

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

**Fuente normativa**:
Referencia externa o interna que respalda un parametro normativo o regla de calculo.
_Avoid_: Comentario informal, supuesto no trazado

**Fuente pendiente**:
Estado explicito de un parametro normativo o regla de calculo cuya procedencia aun no ha sido verificada.
_Avoid_: Fuente normativa, valor sin marcar

**Parametro normativo**:
Valor legal o economico aplicable a uno o varios anos fiscales y usado por una regla de calculo.
_Avoid_: Regla, formula

**Dato economico**:
Valor macroeconomico usado para ajustar o interpretar resultados fiscales sin ser una regla normativa.
_Avoid_: Parametro normativo, regla de calculo

**Factor IPC acumulado**:
Multiplicador entre un ano base y el ano de referencia usado para expresar importes en euros comparables.
_Avoid_: Inflacion suelta, tasa anual aislada

**Regla de calculo**:
Comportamiento fiscal o laboral versionado que transforma importes de entrada en importes derivados.
_Avoid_: Parametro, dato normativo

**Caso de referencia canonico**:
Entrada y salida esperada versionadas que permiten validar implementaciones alternativas del motor sin depender del Excel.
_Avoid_: Excel, captura visual, test snapshot opaco

**Suite de referencia minima**:
Conjunto pequeno de casos de referencia canonicos elegido para cubrir umbrales, cambios normativos y ejemplos pedagogicos.
_Avoid_: Suite exhaustiva, fixture legacy Excel

**Suite de referencia exhaustiva**:
Conjunto masivo de casos de referencia canonicos usado para validar equivalencia completa del motor.
_Avoid_: Suite minima, smoke test

**Caso fiscal simplificado**:
Supuesto fiscal usado para calcular salario neto e IRPF bajo restricciones conocidas: soltero sin hijos y tramo autonomico igual al estatal.
_Avoid_: Salario bruto, perfil, contribuyente

**Hipotesis fiscal**:
Restriccion o simplificacion declarada que limita el alcance de un caso fiscal o auditoria.
_Avoid_: Regla normativa, valor por defecto oculto

**Hipotesis de tramo autonomico estatalizado**:
Supuesto simplificado donde el tramo autonomico se iguala al estatal para calcular una escala total de IRPF.
_Avoid_: Tramo autonomico real, comunidad autonoma

**Limitacion de alcance**:
Condicion reconocida por el modelo pero no calculable todavia con garantias.
_Avoid_: Error tecnico, opcion visible no soportada

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

- Un **Caso fiscal simplificado** es la entrada de un **Calculo de salario neto e IRPF**.
- Un **Caso fiscal simplificado** declara sus **Hipotesis fiscales**.
- Un **Caso fiscal simplificado** incluye una **Situacion familiar fiscal**.
- Un **Caso fiscal simplificado** incluye un **Salario bruto anual**.
- La **Hipotesis de tramo autonomico estatalizado** es una **Hipotesis fiscal** actual del proyecto.
- Una **Limitacion de alcance** se devuelve cuando una entrada solicita condiciones fuera de las hipotesis fiscales soportadas.
- La **Situacion familiar individual sin descendientes** es la **Situacion familiar fiscal** actual del proyecto.
- Un **Calculo de salario neto e IRPF** incluye un **Calculo del IRPF**.
- Un **Calculo del IRPF** produce un **IRPF final**.
- Un **Calculo de salario neto e IRPF** produce una **Cotizacion del trabajador**, una **Cotizacion empresarial** y un **Coste laboral**.
- Un **Calculo de salario neto e IRPF** produce un **Salario neto anual**.
- Un **Salario neto mensual equivalente** se deriva de un **Salario neto anual** mediante una **Distribucion de pagas**.
- Un **Calculo unitario** aplica un **Calculo de salario neto e IRPF** a un unico ano fiscal.
- Un **Calculo de salario neto e IRPF** produce un **Desglose de salario neto e IRPF**.
- Un **Desglose de salario neto e IRPF** puede incluir un **Rastro de calculo**.
- Un **Rastro de calculo** declara una **Version de explicacion**.
- Un **Calculo unitario** declara una **Version de datos de referencia** y una **Version del algoritmo**.
- Una **Auditoria de progresividad en frio** declara una **Version de datos de referencia**, una **Version del algoritmo** y una **Version de explicacion** cuando incluye rastros educativos.
- Un **Motor exacto** produce **Desgloses de salario neto e IRPF**.
- Una **Vista educativa del calculo** explica un **Desglose de salario neto e IRPF**.
- Una **Vista educativa del calculo** usa **Detalle progresivo**.
- Un **Rastro de calculo** se organiza en **Pasos de explicacion** segun su **Version de explicacion**.
- **Explicacion v1** es la **Version de explicacion** inicial.
- Una **Consulta individual** presenta una **Vista educativa del calculo** para un salario concreto.
- La pantalla principal presenta una **Comparacion ajustada por IPC** para una **Consulta individual**.
- La pantalla principal usa un **Control preciso de salario** como fuente exacta y un **Control rapido de salario** para cambios al millar.
- El **Control rapido de salario** usa un **Rango pedagogico del salario**, no el primer salario con IRPF positivo en el ano de referencia.
- Un **Aviso de sobrescritura de salario** protege valores introducidos mediante el **Control preciso de salario**.
- Una **Exploracion por rango salarial** presenta patrones de una **Auditoria de progresividad en frio** para muchos salarios.
- Un **Barrido salarial** produce los calculos unitarios necesarios para una **Exploracion por rango salarial** o una **Exportacion compatible** sobre un **Rango nominal** o un **Rango equivalente de referencia**.
- Una **Exploracion por rango salarial** produce **Hallazgos de auditoria**.
- Un **Impacto normativo** se apoya en **Evidencias de calculo** y, cuando sea posible, en **Fuentes normativas**.
- Una **Fuente pendiente** marca una **Regla de calculo** o un **Parametro normativo** que aun necesita verificacion.
- Un **Dato economico** puede tener fuente propia sin ser una **Fuente normativa**.
- Un **Factor IPC acumulado** es un **Dato economico** usado por una **Auditoria de progresividad en frio**.
- Una **Auditoria de progresividad en frio** puede analizar **Poder adquisitivo neto** y **Carga fiscal efectiva**.
- Un **Calculo unitario** recibe **Entradas monetarias**, opera con **Importes monetarios** y produce **Importes liquidados** en fronteras explicitas.
- Una **Exportacion compatible** usa **Modo compatible legacy**.
- Una **Vista educativa del calculo** usa **Modo canonico** salvo que muestre una comparacion legacy explicita.
- La **Carga fiscal efectiva** puede presentarse como **Vista de carga sobre salario bruto** o **Vista de cuna fiscal laboral**.
- La pantalla principal muestra **Vista de carga sobre salario bruto** por defecto y permite alternar a **Vista de cuna fiscal laboral**.
- En la primera version, el input editable de la pantalla principal es siempre **Salario bruto anual**; la **Vista de cuna fiscal laboral** muestra **Coste laboral** derivado.
- Un **Impacto normativo** explica una parte concreta de un **Desglose de salario neto e IRPF**.
- Una **Regla de calculo** usa **Parametros normativos** para producir importes de un **Desglose de salario neto e IRPF**.
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

## Example dialogue

> **Dev:** "Cuando el usuario cambia el salario bruto, estamos recalculando toda la auditoria?"
> **Domain expert:** "No, esta usando la calculadora para un calculo de salario neto e IRPF concreto; la auditoria historica compara ese resultado contra anos equivalentes por IPC."

## Flagged ambiguities

- "calculadora" se uso para referirse tanto al producto completo como a un flujo de interfaz; resuelto: el dominio raiz es **Auditoria de progresividad en frio** y la calculadora web es una interfaz sobre ese dominio.
- "nomina" aparece en el repositorio original, pero promete mas precision laboral de la que ofrece el modelo actual; resuelto: usar **Calculo de salario neto e IRPF** y **Desglose de salario neto e IRPF**.
- "100% igual al Excel" puede significar igualdad binaria, visual o de datos; resuelto: la garantia legacy sera **Equivalencia tabular**.
- "repo original" puede referirse a una version fija o a futuras versiones del autor; resuelto: distinguir **Oracle legacy congelado** y **Oracle upstream**.
- "calculadora web" puede sonar a una consulta de salario concreto; resuelto: la web ofrece **Consulta individual** y **Exploracion por rango salarial**.
- "dinero" puede significar entrada, valor intermedio o salida comparable; resuelto: distinguir **Entrada monetaria**, **Importe monetario** e **Importe liquidado**.
- "resultado correcto" puede significar compatible con el Excel original o correcto bajo reglas decimales explicitas; resuelto: distinguir **Modo compatible legacy** y **Modo canonico**.
- "minimo del slider" no debe confundirse con el primer salario con **IRPF final** positivo en el ano de referencia; resuelto: usar **Rango pedagogico del salario** para cubrir cotizaciones, IRPF historico y progresividad en frio.
