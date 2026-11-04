# Estado de la auditoría documental

## Motor y API para el rediseño: cierre técnico del 4 de noviembre

Las entradas anual técnica y efectiva consumen una composición común de
mínimos, escalas, ahorro, deducciones y cuota. Los adaptadores mantienen los
hechos y políticas monetarias que les corresponden. La [API vigente](API-MOTOR.md)
explica unidades, discriminantes, errores y ejemplos ejecutables; el rediseño
puede consumir sus resultados sin reconstruir la cuota.

La revisión independiente confirmó la composición única y encontró E-REV-01:
la precisión declarada de 80 cifras se truncaba a 20 en los gravámenes. Se
reprodujo, corrigió y obtuvo [contraste favorable](reforma-motor/bloque-e/CONTRASTE-PRECISION.md).
El CI completo local pasa con 582 pruebas Vitest y 167 Python; las cuatro
pruebas independientes posteriores también pasan y se incorporan al CI local
y remoto. Tipos y lint pasan, con 18 avisos existentes. El cierre no amplía
la cobertura familiar fuera de Madrid 2025 ni acredita documentalmente el
núcleo nuevo. [Alcance del cierre](reforma-motor/bloque-e/CIERRE.md) y
[balance A–F con estimaciones](BALANCE-A-F.md).

Publicado en `ab29bae79b238f1d96b568cd1ba3d4b9688985fb`; `checks` y `corpus`
correctos en la [ejecución remota 41863400023](https://github.com/eliesgalvira/IRoboPF/actions/runs/41863400023).

## Continuación de A y demostración de C

Se reanuda el candidato incompleto de escalas y mínimos de A sobre los
extractores corregidos. La entrega anterior conserva 11.204 ocurrencias
deduplicadas; sus cifras no se aceptan como cobertura verificada.

De C se recibe una demostración de transporte oficial remoto, secuencial y
reanudable, con 16 ejecuciones PDF/SES: siete recargas de casos conservados,
un discriminante de retención, siete ejercicios 2018–2024 y un piloto DA61.
Se han preparado 2.020 entradas, todavía sin ejecutar como lote masivo.
La revisión independiente exige cinco correcciones antes de ampliar: ámbito
SES, cobertura mínima de comparación, integridad e identidad al reutilizar,
recuperación de escrituras parciales y cotejo PDF anterior a la aceptación.
El candidato corregido del orquestador pasa 21 métodos de regresión y conserva
las 16 capturas anteriores. Un piloto nuevo obtiene −721,23 con cotejo previo
a su aceptación; su repetición verifica la evidencia antes de reutilizarla.
Se conserva un intento previo fallido por timeout del diálogo, sin resultado
aceptado. El [contraste independiente](simuladores/TRANSPORTE-REVISADO.md) es
favorable para F1–F5: 65 expectativas propias correctas, sin bloqueos nuevos
reproducidos en ese alcance. Se prepara la integración reproducible y la
proyección estructurada de los seis componentes de cuota ya calculados por el
núcleo común. Falta conectar la
API del commit actual. El cotejo con un snapshot antiguo del motor no demuestra
esa conexión. Siguen pendientes el
adaptador de 2017 y la recuperación ejecutable de PADRE; los intentos fallidos
no prueban la indisponibilidad de todas sus versiones. Los originales y los
registros con identificadores efímeros permanecen privados, fuera del producto.

## Corrección técnica del 4 de noviembre

Los cinco defectos pendientes de unidades/enlaces e IPC/SS están corregidos y
revisados por el orquestador. Pasan 75 tests del bloque, las comprobaciones
generales de CI, 196 pares IPC y cinco bases de 2018; el replay real se reproduce
byte a byte. Los candidatos se integran con sus antecedentes y límites explícitos. Se mantiene el alcance fiscal pendiente:
las declaraciones SS sin pruebas de columna y vigencia ya no producen
coincidencias verificadas. [Cambios, pruebas y límites](datos-2012-2026/correcciones-cinco/INFORME.md).

## Recursos y reanudación del 3 de noviembre

Las [reglas de recursos y entregas](RECURSOS.md) limitan las ejecuciones a dos
suites pesadas en toda la máquina, con `timeout` para cada orden. Las entregas
se conservan como commits o parches y manifiestos, con cachés compartidas y sin
copias completas de dependencias. El límite conjunto de copias y worktrees es
de 150 GB. La retirada de una copia pendiente no acepta su candidato.

La limpieza retira 88 worktrees inactivos, conserva sus ramas y elimina 14
entregas publicadas, 28 exportaciones o archivos redundantes y cuatro archivos
de base ya publicados. Se han vuelto a comprobar los hashes de los 57.241
objetos únicos conservados. Repositorio, respaldos, worktrees restantes y
corpus suman 103,7 GB; quedan 312,7 GB libres en disco (unidades decimales).
Permanecen tres directorios de trabajo: el de escalas, el usado para reproducir
las revisiones pendientes y uno antiguo con metadatos Git/Jujutsu mezclados.
Este último se conserva para no eliminar metadatos sin cotejo.

Se han recuperado los informes de unidades/enlaces e IPC/SS y repetido las
pruebas interrumpidas. Sobre los candidatos conservados pasan los 37 tests
comunes, el wrapper sin Git, el censo IPC/SS y la comprobación aritmética de
196 pares de años y cinco bases de cotización de 2018. Estas comprobaciones no
acreditan por sí solas la vigencia jurídica.

En la reanudación del 3 de noviembre, los siete adversos de unidades/enlaces
terminaron con dos fallos: la cabecera
ajena puede acreditar una unidad al ampliar su caja, y el resolver AST admite
una función `async` como identidad síncrona. Los seis discriminantes IPC/SS
terminan con tres fallos al comprobar sujeto, año y columna/período. Se
conservaron sus aserciones y logs; en ese corte no se integraron los candidatos
ni se declararon cerradas las revisiones. Las ejecuciones anteriores terminadas por SIGTERM
siguen sin contarse como aprobadas.

## CI reproducible

El workflow «Comprobaciones» está verde en [la ejecución 41539191212](https://github.com/eliesgalvira/IRoboPF/actions/runs/41539191212), commit `9f8e6a8f75aaa12fd6ffd18ea8a09eeefe004275`: `checks` y `corpus` correctos. Se reanuda la integración de deducciones y A–F. Las pruebas ordinarias funcionan con un checkout limpio, sin cachés previas, archivos privados, corpus externo local ni objetos Git históricos. Los ensayos que necesitan el corpus completo se mantienen como comprobaciones locales opcionales, con omisión explícita en CI. Cada push debe pasar previamente los mismos comandos del workflow; los cambios se agrupan.

Corregidos los imports privados, las consultas a objetos Git históricos, el registro temporal del ensayo de enlaces y las aserciones de importe de la revisión gallega/riojana. Los verificadores usan fixtures sintéticos en CI y fuentes actuales fijadas por SHA-256. Los comandos se reproducen con [el script de CI](CI.md). La [revisión independiente](ci-reproducible/revision/INFORME.md) es favorable: 21 comandos y cuatro comprobaciones adicionales pasan en una exportación limpia. La pasada local previa al push y la ejecución remota confirman el resultado; esto no aprueba el corpus externo completo.

## Alcance completo aprobado

Además de las deducciones de 2025, está encargado el [plan completo A–F](PLAN-COMPLETO.md): procedencia automática de todos los datos de 2012–2026; comunidades reales en 2026; miles de comparaciones con simuladores oficiales; redondeo observado de cotizaciones; mínimos familiares unificados; y actividad, composición, admisión y puertas. El cierre técnico anterior de 65 sitios conserva sus resultados y deja de ser el límite del encargo.

La [reforma de motor único](REFORMA-MOTOR.md) tiene prioridad. Queda anulada la compatibilidad de fichas, firmas y resultados antiguos: se retiran `FamiliarFiscal`, el modo legacy y las rutas duplicadas. Las páginas actuales pueden adaptarse lo mínimo o desconectarse para compilar. La [API actual](API-MOTOR.md) documenta la retirada integrada y sus límites. La [revisión independiente](reforma-motor/revision-finalizacion/INFORME.md) corroboró los arreglos de conjunta de deducciones y localizó un helper y una tabla truncados, además de un rechazo anual ausente. Las tres observaciones tienen [corrección y regresiones](reforma-motor/correcciones-finalizacion/INFORME.md) y [contraste independiente favorable](reforma-motor/revision-correcciones/INFORME.md). Los tres rojos anteriores se reprodujeron; se conservan la frontera 2014, las escalas canarias y las siete referencias salariales Open. El cambio marginal de 47 a 49 céntimos desde 2021 queda limitado a la simulación que duplica la parte estatal. No procede otra revisión del mismo alcance. La composición común de las entradas efectiva y técnica se cierra en el hito del 4 de noviembre descrito arriba. La extensión familiar y la acreditación normativa siguen pendientes; no se declara completo el bloque E general.

Las ampliaciones regionales de deducciones y el censo automático de A continúan con esa instrucción. La entrega del auxiliar compartido es candidata: sus cálculos útiles deben incorporarse a la ruta única y revisarse allí, sin perpetuar su fachada heredada. Los cambios compartidos tienen un responsable para evitar nuevas APIs divergentes. B, C, D y F continúan según sus dependencias; E se adelanta como parte de la reforma. Cada bloque recibe revisión independiente y un balance de cobertura, diferencias, correcciones y decisiones.

| Bloque | Estado |
| --- | --- |
| A. Datos de 2012–2026 | Extractor corregido y contrastado en el piloto, incluido RP07. Recibidas extracciones parciales de escalas y mínimos de 2012–2018 y 2019–2026; falta completar sus enlaces. IPC/SS: extracción parcial integrada con cinco correcciones técnicas; 13 coincidencias IPC y alcances SS aún sin verificar cuando falta contexto documental. Piloto: 277 celdas, 50 coincidencias, 226 sin verificación y una ausencia explícita |
| B. Comunidades en 2026 | Pendiente de inicio; reutilizará las fuentes de A |
| C. Simuladores oficiales | Transporte remoto demostrado; cinco correcciones contrastadas favorablemente. Integración, conexión API y comparación masiva pendientes |
| D. Redondeo de cotizaciones | Pendiente de inicio con criterio de comportamiento observado |
| E. Mínimos familiares | Motor anual común y API revisados, incluida corrección de precisión. Cobertura familiar Madrid 2025 individual; extensión normativa por año/territorio y acreditación del núcleo pendientes |
| F. Actividad y declaración completa | Encargado; pendiente de productores y contratos anteriores |

## En curso: deducciones autonómicas de 2025

Revisión de **351 fichas** contra los originales de los boletines autonómicos, sus reformas y el manual AEAT. Base: `464e0fd8`; solo commits nuevos. [Censo y reparto](deducciones-2025/censo.json), [criterios de dictamen](deducciones-2025/ENCARGO.md), [transición para el rediseño](deducciones-2025/CAMBIOS-PARA-REDISENO.md).

| Lote | Comunidades | Fichas | Estado |
| --- | --- | ---: | --- |
| A | Andalucía, Aragón, Catalunya | 49 | Revisión: 48 concordancias acotadas y una atribución incorrecta de citas, corregida y contrastada independientemente. Original de Orden VEH/192/2018 recuperado |
| B | Asturias, Cantabria | 48 | Revisión: 45 concordancias acotadas, dos diferencias documentales corregidas y contrastadas; persiste la ambigüedad sobre los 30 años |
| C | Canarias, Illes Balears | 51 | Revisión: 49 concordancias acotadas y dos diferencias temporales, corregidas y contrastadas; persisten tres limitaciones de PDF con HTML oficiales disponibles |
| D | Castilla-La Mancha, Castilla y León, Extremadura | 63 | Revisados los 63 códigos: 57 concordancias documentales condicionadas y seis códigos con reservas. Catálogos ampliados; recuento de municipios CLM corregido y contrastado. Integración del registro XML pendiente |
| E | Galicia, La Rioja | 49 | Cadena temporal de incendios ampliada y contrastada favorablemente, con alcance delimitado |
| F | Madrid, Murcia | 51 | 48 concordancias condicionadas y tres reservas; dos defectos de identidad en conjunta corregidos y contrastados, sin habilitar conjunta anual |
| G | Comunitat Valenciana | 40 | Vivienda e inversión/DANA: localizador corregido y contrastado. Seis propuestas culturales revisadas, con dos defectos documentales corregidos y contrastados; reservas sobre precio histórico y censo de entidades |

El contrato documental inicial muestra pendiente cuando no hay evidencia. Su carácter aditivo ya no limita el modelo definitivo. Los tres defectos del verificador están corregidos y contrastados independientemente: coherencia del dictamen global, adquisiciones compartidas y filtrado de URL. Pasan 37 regresiones y siete casos del revisor; las diez pruebas Vitest se ejecutaron en el repositorio principal. Revisión técnica cerrada, sin aceptar todavía normas. [Contrato y uso](deducciones-2025/contrato/README.md), [dictamen independiente](deducciones-2025/revisiones/contrato-corregido/INFORME.md).

**351 dictámenes candidatos y las siete revisiones independientes recibidos; cobertura completa del censo. Ningún lote aceptado íntegramente todavía.** Los autores propusieron 252 diferencias y 99 no verificables para el alcance completo. Son recuentos provisionales; las revisiones y rectificaciones se deben conciliar antes del balance final. Las diferencias incluyen omisiones de ficha: no equivalen a 252 errores de cálculo.

- [Asturias y Cantabria](deducciones-2025/revisiones/b-condiciones/INFORME.md): revisados los 48 expedientes; 45 concordancias documentales acotadas, dos diferencias y una ambigüedad legal. La [corrección candidata](deducciones-2025/correcciones/b-rectificaciones/INFORME.md) recoge la curatela representativa en la ficha de familia monoparental y declara la diferencia entre el límite estricto de 8.000 euros de la norma y el inclusivo del manual en estudios. El límite del código ya es estricto y no debe cambiarse por esa discrepancia del manual. La frontera asturiana de los 30 años sigue ambigua. Los dos casos documentales fallidos quedan conservados y pasan con la corrección; contraste independiente favorable en su alcance.
- [Andalucía, Aragón y Catalunya](deducciones-2025/revisiones/a-ampliado/INFORME.md): revisados los 49 expedientes; 48 concordancias acotadas y una mezcla de ocho citas de celiaquía en donativos ecológicos. La [corrección](deducciones-2025/correcciones/a-atribucion/INFORME.md) retira esas referencias solo del expediente erróneo y conserva sus usos válidos. El original oficial de la Orden VEH/192/2018 y sus citas están recuperados en la revisión; queda incorporarlos al manifiesto común. La corrección de atribución queda corroborada por revisión independiente.
- [Canarias e Illes Balears](deducciones-2025/revisiones/c-ampliado/INFORME.md): revisados los 51 expedientes; 49 concordancias documentales acotadas y dos diferencias temporales. La [corrección](deducciones-2025/correcciones/c-temporal/INFORME.md) distingue los límites canarios del año de origen del traslado y explica que el porcentaje balear reforzado ya existía antes de julio de 2025. El PDF oficial canario se incorpora al almacén externo y sus citas exactas al manifiesto. Tres PDF del BOIB siguen sin recuperarse; sus HTML oficiales están disponibles. Las dos correcciones temporales quedan corroboradas por revisión independiente.
- [Castilla-La Mancha, Castilla y León y Extremadura](deducciones-2025/correcciones/d/INFORME.md): corregidos cinco artículos extremeños y dos mezclas de secciones; ampliadas las 63 fichas. Las revisiones regionales posteriores cubren los 63 códigos: 57 concordancias documentales condicionadas y seis códigos con reservas concretas. Esto no valida cuotas automáticas ni acredita los hechos particulares de un contribuyente.

La [ampliación de Castilla-La Mancha](deducciones-2025/correcciones/d-clm-remisiones/INFORME.md) y su [revisión independiente](deducciones-2025/revisiones/d-clm-remisiones/INFORME.md) cubren 27 códigos. Se incorporan tres precisiones del catálogo; las propuestas documentales por código se conservan en el expediente regional. Su proyección al registro común requiere normalizar localizadores XML y fuentes complementarias; la proyección incompatible se ha retirado sin perder esa evidencia. Los dos códigos de vivienda conservan la reserva de concurrencia entre norma y manual. Los 2.495 pasajes se han reextraído. La revisión confirma que el anexo enumera 25 municipios; la [corrección del recuento](deducciones-2025/correcciones/remisiones-documentales/INFORME.md) cuenta con [contraste independiente favorable](deducciones-2025/revisiones/remisiones-documentales/INFORME.md).

La [ampliación de Extremadura](deducciones-2025/correcciones/d-extremadura-remisiones/INFORME.md) y su [revisión independiente](deducciones-2025/revisiones/d-extremadura-remisiones/INFORME.md) cubren 19 códigos: 18 concordancias bajo condiciones y una reserva parcial del artículo 11 bis para adquisiciones entre el 1 de enero y el 21 de marzo de 2022. Se incorporan las precisiones descriptivas del catálogo. Los 60 documentos/versiones y 884 citas están comprobados; la matriz y la revisión conservan la reserva temporal. La conciliación de estos dictámenes con el registro común sigue pendiente.

La [ampliación de Castilla y León](deducciones-2025/correcciones/d-cyl-remisiones/INFORME.md) y su [revisión independiente](deducciones-2025/revisiones/d-cyl-remisiones/INFORME.md) cubren los 17 códigos: 14 concordancias documentales bajo condiciones y tres reservas entre norma y manual (alternativa de autorización o informe en patrimonio natural, domicilio en inversión directa y planes autonómicos de rehabilitación). Se incorporan las descripciones y las 34 propuestas por código, incluidas siete comparaciones desfasadas; sus dictámenes se representan con el vocabulario del contrato común, conservando las condiciones y las etiquetas originales; no cambian expectativas de tests ni se implanta cálculo automático de cuotas. Los 45 originales y 1.613 citas están reextraídos. Las reservas y la necesidad de acreditar los hechos de cada contribuyente permanecen explícitas.

- [Galicia y La Rioja](deducciones-2025/correcciones/e-remisiones/INFORME.md): la [revisión independiente](deducciones-2025/revisiones/e-remisiones/INFORME.md) cubre 49 fichas; respalda 48 descripciones y localiza la norma posterior que faltaba para incendios. Se incorporan RDL 10/2026 y su convalidación, con tres citas exactas: 59 fuentes y 1.621 citas reextraídas. La exención personal queda delimitada por el acuerdo y las fechas que exige la norma; no se extiende a toda ayuda autonómica. La rectificación tiene prueba roja previa y cinco controles verdes; falta su contraste acotado. La clasificación y cuota de una ayuda particular siguen sin acreditarse.
- [Madrid y Murcia](deducciones-2025/correcciones/f/INFORME.md): la [revisión independiente](deducciones-2025/revisiones/f-ampliado/INFORME.md) cubre 51 códigos, con 48 concordancias condicionadas y tres reservas: vehículos exactamente a 35.000 euros, comparación patrimonial de vivienda joven y remisión defectuosa en dispositivos de ahorro de agua. Se corrige su atribución documental. Los dos importes históricos pasan en la API actual. Los dos defectos posteriores de identidad en conjunta están corregidos y contrastados en la [revisión del motor](reforma-motor/revision-finalizacion/INFORME.md): nacimiento Madrid y guardería Murcia. Esto no habilita la conjunta anual, que se rechaza explícitamente.
- [Comunitat Valenciana](deducciones-2025/correcciones/g/INFORME.md): 40 fichas rectificadas y 111 localizaciones candidatas resueltas, con 68 fuentes y 2.077 citas. Faltan las remisiones concretas enumeradas; no se consideran imposibilidades externas. Las 40 fichas pasan a `normalizada_pendiente_tests`: una descripción ampliada no acredita su cálculo. El catálogo sigue teniendo 351 entradas, de las que 311 conservan la etiqueta anterior de implementadas, sin que esa etiqueta certifique su corrección.

Las propuestas nuevas de [vivienda valenciana](deducciones-2025/correcciones/g-vivienda/INFORME.md) y de [inversión y territorio DANA](deducciones-2025/correcciones/g-inversion-dana/INFORME.md) cubren seis códigos distintos. Están incorporadas como candidatos documentales, sin aplicar todavía sus cambios al catálogo. Se han reconstruido sus 18 archivos y reextraído las 85 citas; las preimágenes coinciden con los archivos actuales. La [revisión independiente](deducciones-2025/revisiones/g-vivienda-inversion/INFORME.md) respalda cinco dictámenes de alcance y detectó RV01: la cita `gv-31` apuntaba al índice. La [corrección del localizador](deducciones-2025/correcciones/g-localizador/INFORME.md) remite al artículo 60 completo y tiene [contraste independiente favorable](deducciones-2025/revisiones/g-localizador/INFORME.md). La metodología oficial identifica la superficie construida catastral de vivienda; permanece la reserva sobre la celda histórica del precio de referencia. La interpretación EECV queda corroborada en el alcance revisado. Los 35 discriminantes son condiciones documentales, no pruebas ejecutadas de una cuota; no procede repetir los dictámenes favorables. Las [seis propuestas de patrimonio, lengua y mecenazgo](deducciones-2025/correcciones/g-cultura-lengua/INFORME.md) cuentan con [revisión independiente](deducciones-2025/revisiones/g-cultura-lengua/INFORME.md). Sus reglas quedan respaldadas con alcance explícito; se detectaron un fundamento ajeno a abonos y citas del índice o insuficientes. La [corrección documental](deducciones-2025/correcciones/remisiones-documentales/INFORME.md) conserva las fuentes, amplía los pasajes pertinentes y separa sus usos por deducción. El [contraste de las tres rectificaciones](deducciones-2025/revisiones/remisiones-documentales/INFORME.md) es favorable: 18 fallos previos reproducidos, seis métodos actuales y siete discriminantes propios correctos. No se repiten los dictámenes favorables. La operatividad del censo valenciano en 2025 conserva una reserva concreta, que no demuestra su inexistencia ni impide aplicar otras categorías de beneficiarios. Ninguno de estos resultados cierra las 40 fichas.

Las revisiones de las ampliaciones A, B y C cubren 148 fichas: 142 concordancias documentales acotadas, cinco diferencias y una ambigüedad. Las cinco diferencias están corregidas y corroboradas en su alcance por la [revisión independiente](deducciones-2025/revisiones/cinco-rectificaciones/INFORME.md). Este recuento no valida una liquidación ni sustituye el balance final de las 351 fichas. Pasan las 256 pruebas focalizadas de A y C y los casos independientes de sus tres correcciones; pasan además los nueve controles de Cantabria; los cinco grupos de casos propios de la revisión también pasan. No procede repetir las revisiones favorables. La reextracción auxiliar de una cita histórica de la DT segunda requiere otro selector; el original y su literal están comprobados mediante el localizador independiente de la nueva revisión. No afecta al dictamen favorable de los cinco arreglos.

La [reparación del registro común](deducciones-2025/correcciones/registro-clm/INFORME.md) corrige dos incompatibilidades de integración en las Castillas. El CI añade su validación completa sin CAS: esquema, referencias declaradas y coherencia de los 351 registros. No sustituye la reextracción ni resuelve la incorporación pendiente del XML de Castilla-La Mancha. La [revisión independiente](revisiones/ef-obligaciones-20261102/INFORME.md) confirma la conservación literal de las evidencias y reservas. Límite: el CI común no exige conservar todos los metadatos complementarios de vigencia; su presencia actual se comprobó directamente.

La integración anterior reextrajo 13.911 citas de los siete lotes. Tras ampliar A, B y C, el verificador central admite los 351 registros y comprueba sus originales externos con ambos hashes y tamaño; no hay códigos ausentes ni duplicados. Comprobar la integridad de los archivos no sustituye el cotejo jurídico. Las llamadas antiguas sin hechos ya no son un contrato de cálculo válido.

La corrección candidata de los nueve casos del auxiliar compartido incorpora hechos explícitos por persona y evento y rechaza llamadas activas insuficientes. Pasan 612 pruebas integradas, con dos fallos históricos esperados, tipos principales y lint del alcance. Se han reextraído las 286 citas actuales de esos nueve códigos. La ruta anual de importes consignados permanece intacta. La entrega precisa un error del planteamiento inicial: 1.130 euros corresponde al tercer hijo canario más el primer suplemento por discapacidad; para el cuarto son 1.396 euros. La revisión independiente y la conciliación de los dictámenes regionales con la nueva API siguen pendientes. [Alcance](deducciones-2025/correcciones/auxiliar-hechos/INFORME.md), [compatibilidad](deducciones-2025/CAMBIOS-PARA-REDISENO.md#auxiliar-numérico-con-hechos-explícitos).

El contrato admite publicaciones primarias clasificadas como reforma o corrección, sin reclasificarlas como norma inicial. También distingue una URL oficial de una ruta local y el pie editorial del manual de su fecha de publicación no acreditada. El cambio de categorías normativas está corroborado por la revisión B. Los defectos adicionales de credenciales dentro de reservas y fecha nula normativa están corregidos y contrastados. El reconocimiento completo de destinos Markdown tiene [revisión favorable](deducciones-2025/revisiones/markdown-completo/INFORME.md): 53 regresiones, 36 casos anteriores y 84 adversos nuevos pasan. La comprobación usa CommonMark con dependencia fijada; no requiere otra ronda del mismo alcance. [Arreglo y límites](deducciones-2025/correcciones/contrato-url-fecha/CONTRASTE.md).

Se han comprobado también las 425 citas complementarias de las siete revisiones. La reextracción no basta para atribuir una cita al artículo correcto; esa pertenencia y la vigencia se contrastan por separado.

Pendiente no significa «no verificable». Las auditorías históricas sirven de punto de partida, no de validación automática. La ampliación parcial posterior de G aporta 50 citas y once precisiones descriptivas, con transporte comprobado; ese paquete permanece sin integrar y sirve de antecedente para las propuestas específicas posteriores. Los originales nuevos se conservan en el almacén externo. Las fichas pueden cambiar para expresar correctamente el cálculo y su procedencia.

## Extracción automática de datos de 2012–2026

La [canalización candidata](datos-2012-2026/INFORME.md) inventaría 57 módulos y 116.170 rutas efectivas en su versión fijada. Las rutas incluyen alias, textos y metadatos; no son 116.170 magnitudes fiscales distintas.

La primera ejecución extrajo 277 celdas: 87 coincidencias numéricas, 189 sin comparación y una ausencia. La [revisión técnica](datos-2012-2026/revision-canalizacion/INFORME.md) detectó defectos de unidades, signos y obligaciones de cobertura, además de límites en selectores y huellas de ejecución. La [corrección](datos-2012-2026/CORRECCIONES-RP.md) conserva 50 coincidencias con unidad acreditada, 226 celdas sin verificación y una ausencia explícita. Las otras 37 igualdades anteriores dejan de considerarse verificadas porque falta acreditar su unidad; no son nuevas diferencias numéricas. La [revisión posterior](datos-2012-2026/revision-correcciones/INFORME.md) reprodujo el manifiesto y sostuvo las correcciones en el piloto salvo RP07. Sus ocho signos ignorados quedaron corregidos y la [revisión de geometría](datos-2012-2026/revision-geometria/INFORME.md) es favorable en ese alcance: 299 comprobaciones propias y 190 salidas admitidas sin cambios. El padre reproduce los cuatro métodos y reextrae las 277 celdas reales sin diferencias. No se demuestra una cifra financiera errónea en el piloto. Procede ampliar tablas con obligaciones y unidades propias, sin repetir este dictamen favorable. La selección de obligaciones por lote ya tiene implementación candidata: archivo y SHA-256 esperado externos a su contenido, validación separada y manifiesto v3 reconstruible. Las nuevas acreditaciones semánticas siguen rechazadas hasta disponer de evidencia específica. El piloto conserva 50 coincidencias, 226 celdas sin verificación y una ausencia. Pasan 36 pruebas del autor; la recepción comprueba las siete rutas y su reconstrucción exacta. La [revisión independiente conjunta](revisiones/ef-obligaciones-20261102/INFORME.md) corrobora el contrato por lote en su alcance; no procede otra ronda favorable. [Contrato por lote](datos-2012-2026/contrato-obligaciones-lotes/INFORME.md). El control adicional checkJs conserva cinco diagnósticos compartidos, distintos de las comprobaciones ordinarias de CI.

La ampliación IPC/SS recibida, todavía sin integrar ni revisar, registra trece igualdades numéricas de IPC y extrae 395 celdas de bases y 129 de tipos de cotización. Conserva 22 celdas ambiguas como texto. Quedan por completar el estado de publicación del IPC, la asignación de sujetos y vigencias, las remisiones y los enlaces a parámetros consumidos; estas cifras no son valores verificados ni cierre del lote.

Las entregas de escalas y mínimos, todavía sin integrar ni revisar, son parciales. Para 2012–2018 se enumeran 3.479 posiciones: 910 igualdades candidatas, diez diferencias, 2.414 sin verificar, una ausencia y 144 posiciones en seis tablas rechazadas; además quedan 4.021 ocurrencias sin enlace al motor. Para 2019–2026, la estrategia principal registra 83 igualdades candidatas, 3.499 celdas sin verificar y 215 cuadros rechazados. Sus resultados geométricos alternativos no se suman a los principales. Quedan asignaciones, unidades y vigencias por completar, y una discrepancia de huella de ejecución en la segunda entrega. Una igualdad numérica sin esas condiciones no demuestra concordancia normativa.

El catálogo local encuentra los bytes de 79 fuentes y no los de otras 440 en las raíces consultadas. Esa ausencia local no demuestra que una fuente oficial sea inaccesible: hay que buscar en los respaldos y completar las adquisiciones. Los manifiestos, citas y posiciones permanecen en Git; los originales y los artefactos voluminosos se conservan fuera.

## Resultados anteriores

**El cálculo anual salarial de Madrid 2025 está terminado y revisado dentro de su perfil admitido.** Incluye el redondeo contrastado con siete ejecuciones de Renta WEB Open. La interfaz queda para Opus. [Alcance, resultados y límites actuales](DECLARACION-SALARIAL-2025.md).

**El alcance técnico acotado de 65 sitios está cerrado: 64 corroboraciones bajo condiciones y un bloqueo demostrado.** Un sitio es un punto identificado del rastro de cálculo; no equivale a una regla fiscal completa. La auditoría fiscal exhaustiva de 2012–2026 permanece incompleta.

Ese cierre conserva la evidencia de sus versiones de código. El cambio posterior del redondeo salarial tiene su propia revisión; no hereda automáticamente los dictámenes causales históricos.

| Para conocer… | Documento |
| --- | --- |
| Qué permite calcular el backend salarial actual y qué falta para la interfaz | [Declaración salarial 2025](DECLARACION-SALARIAL-2025.md) |
| Qué se demuestra, bajo qué condiciones y qué falta | [Informe final](INFORME-FINAL.md) |
| El resultado de cada uno de los 65 sitios | [Matriz individual](correcciones/cierre-r66/MATRIZ-65.md) y [datos con condiciones y hashes](correcciones/cierre-r66/matriz-65.json) |
| Las decisiones vigentes, objeciones y costes | [Decisiones](DECISIONES.md) |
| La cobertura del inventario y sus lagunas | [Inventario](INVENTARIO.md) |
| La diferencia entre integridad documental y aceptación fiscal | [Corpus](CORPUS.md) y [enlaces verificables](ENLACES-VERIFICABLES.md) |
| Las correcciones públicas contrastadas y sus reservas | [Auditoría de correcciones de X](auditorias/correcciones-x-2051956145145712916/INFORME.md) |

El bloqueo de `anual.explicito.actividad.etapa` depende de productores de las **19 familias de actividad excluidas**. Las variantes de actividad de otras salidas explícitas tampoco quedan cubiertas por el cierre de trabajo/pensión. La composición global y la admisión pública siguen pendientes.

Los indicadores `siteClosed`, `admissionClosed`, `wiringAllowed` y `completeRuleAcceptance` permanecen en **`false`**. Los dictámenes locales no validan hechos o derechos familiares, no certifican toda la semántica de JavaScript/Effect y no eliminan las reservas jurídicas o de autenticidad.

El informe conserva las limitaciones de retenciones, cotizaciones, deducciones y territorios; también distingue los tipos principal/vendor comprobados de la deuda estricta `checkJs`. Las estimaciones de trabajo posterior son orientativas y no comprometen una fecha ni una aceptación fiscal.

El respaldo de código y evidencias seleccionadas utiliza `origin/procedencia-documental`. Los originales grandes requieren el CAS local: una clonación Git no basta. V5 r2 conserva el corte R26; host-b conserva V1 desfasado y no acredita custodia independiente ni respaldo remoto completo. [Conservación y límites](INFORME-FINAL.md#respaldo-y-conservación).
