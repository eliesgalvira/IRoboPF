# Estado de la auditoría documental

## CI reproducible

El workflow «Comprobaciones» está verde en [la ejecución 41360119864](https://github.com/eliesgalvira/IRoboPF/actions/runs/41360119864), commit `937ea5d504755a337274e420e5123d2b492ef1c6`: `checks` y `corpus` correctos. Se reanuda la integración de deducciones y A–F. Las pruebas ordinarias funcionan con un checkout limpio, sin cachés previas, archivos privados, corpus externo local ni objetos Git históricos. Los ensayos que necesitan el corpus completo se mantienen como comprobaciones locales opcionales, con omisión explícita en CI. Cada push debe pasar previamente los mismos comandos del workflow; los cambios se agrupan.

Corregidos los imports privados, las consultas a objetos Git históricos, el registro temporal del ensayo de enlaces y las aserciones de importe de la revisión gallega/riojana. Los verificadores usan fixtures sintéticos en CI y fuentes actuales fijadas por SHA-256. Los comandos se reproducen con [el script de CI](CI.md). La [revisión independiente](ci-reproducible/revision/INFORME.md) es favorable: 21 comandos y cuatro comprobaciones adicionales pasan en una exportación limpia. La pasada local previa al push y la ejecución remota confirman el resultado; esto no aprueba el corpus externo completo.

## Alcance completo aprobado

Además de las deducciones de 2025, está encargado el [plan completo A–F](PLAN-COMPLETO.md): procedencia automática de todos los datos de 2012–2026; comunidades reales en 2026; miles de comparaciones con simuladores oficiales; redondeo observado de cotizaciones; mínimos familiares unificados; y actividad, composición, admisión y puertas. El cierre técnico anterior de 65 sitios conserva sus resultados y deja de ser el límite del encargo.

La [reforma de motor único](REFORMA-MOTOR.md) tiene prioridad. Queda anulada la compatibilidad de fichas, firmas y resultados antiguos: se retiran `FamiliarFiscal`, el modo legacy y las rutas duplicadas. Las páginas actuales pueden adaptarse lo mínimo o desconectarse para compilar. La API nueva se documenta en [API-MOTOR.md](API-MOTOR.md); todavía no se presenta como implementada.

Las ampliaciones regionales de deducciones y el censo automático de A continúan con esa instrucción. La entrega del auxiliar compartido es candidata: sus cálculos útiles deben incorporarse a la ruta única y revisarse allí, sin perpetuar su fachada heredada. Los cambios compartidos tienen un responsable para evitar nuevas APIs divergentes. B, C, D y F continúan según sus dependencias; E se adelanta como parte de la reforma. Cada bloque recibe revisión independiente y un balance de cobertura, diferencias, correcciones y decisiones.

| Bloque | Estado |
| --- | --- |
| A. Datos de 2012–2026 | Corrección candidata: 277 celdas, 50 coincidencias, 226 sin verificación y una ausencia explícita; revisión independiente pendiente |
| B. Comunidades en 2026 | Pendiente de inicio; reutilizará las fuentes de A |
| C. Simuladores oficiales | Pendiente de inicio |
| D. Redondeo de cotizaciones | Pendiente de inicio con criterio de comportamiento observado |
| E. Mínimos familiares | Retirada candidata recibida; adaptación al CI actual y revisión independiente pendientes. Extensión normativa por año pendiente |
| F. Actividad y declaración completa | Encargado; pendiente de productores y contratos anteriores |

## En curso: deducciones autonómicas de 2025

Revisión de **351 fichas** contra los originales de los boletines autonómicos, sus reformas y el manual AEAT. Base: `464e0fd8`; solo commits nuevos. [Censo y reparto](deducciones-2025/censo.json), [criterios de dictamen](deducciones-2025/ENCARGO.md), [transición para el rediseño](deducciones-2025/CAMBIOS-PARA-REDISENO.md).

| Lote | Comunidades | Fichas | Estado |
| --- | --- | ---: | --- |
| A | Andalucía, Aragón, Catalunya | 49 | Revisión: 48 concordancias acotadas y una atribución incorrecta de citas, corregida y contrastada independientemente. Original de Orden VEH/192/2018 recuperado |
| B | Asturias, Cantabria | 48 | Revisión: 45 concordancias acotadas, dos diferencias documentales corregidas y contrastadas; persiste la ambigüedad sobre los 30 años |
| C | Canarias, Illes Balears | 51 | Revisión: 49 concordancias acotadas y dos diferencias temporales, corregidas y contrastadas; persisten tres limitaciones de PDF con HTML oficiales disponibles |
| D | Castilla-La Mancha, Castilla y León, Extremadura | 63 | Siete fallos documentales corregidos; faltan remisiones y cierre de cadenas |
| E | Galicia, La Rioja | 49 | Remisiones ampliadas; pendiente revisión de la evidencia nueva y reserva temporal de incendios |
| F | Madrid, Murcia | 51 | Ampliación documental integrada; pendiente revisión independiente, con dos reservas concretas |
| G | Comunitat Valenciana | 40 | Nueva ampliación parcial recibida y conservada fuera de la rama; remisiones culturales, de vivienda e inversión/DANA todavía pendientes |

El contrato documental inicial muestra pendiente cuando no hay evidencia. Su carácter aditivo ya no limita el modelo definitivo. Los tres defectos del verificador están corregidos y contrastados independientemente: coherencia del dictamen global, adquisiciones compartidas y filtrado de URL. Pasan 37 regresiones y siete casos del revisor; las diez pruebas Vitest se ejecutaron en el repositorio principal. Revisión técnica cerrada, sin aceptar todavía normas. [Contrato y uso](deducciones-2025/contrato/README.md), [dictamen independiente](deducciones-2025/revisiones/contrato-corregido/INFORME.md).

**351 dictámenes candidatos y las siete revisiones independientes recibidos; cobertura completa del censo. Ningún lote aceptado íntegramente todavía.** Los autores propusieron 252 diferencias y 99 no verificables para el alcance completo. Son recuentos provisionales; las revisiones y rectificaciones se deben conciliar antes del balance final. Las diferencias incluyen omisiones de ficha: no equivalen a 252 errores de cálculo.

- [Asturias y Cantabria](deducciones-2025/revisiones/b-condiciones/INFORME.md): revisados los 48 expedientes; 45 concordancias documentales acotadas, dos diferencias y una ambigüedad legal. La [corrección candidata](deducciones-2025/correcciones/b-rectificaciones/INFORME.md) recoge la curatela representativa en la ficha de familia monoparental y declara la diferencia entre el límite estricto de 8.000 euros de la norma y el inclusivo del manual en estudios. El límite del código ya es estricto y no debe cambiarse por esa discrepancia del manual. La frontera asturiana de los 30 años sigue ambigua. Los dos casos documentales fallidos quedan conservados y pasan con la corrección; contraste independiente favorable en su alcance.
- [Andalucía, Aragón y Catalunya](deducciones-2025/revisiones/a-ampliado/INFORME.md): revisados los 49 expedientes; 48 concordancias acotadas y una mezcla de ocho citas de celiaquía en donativos ecológicos. La [corrección](deducciones-2025/correcciones/a-atribucion/INFORME.md) retira esas referencias solo del expediente erróneo y conserva sus usos válidos. El original oficial de la Orden VEH/192/2018 y sus citas están recuperados en la revisión; queda incorporarlos al manifiesto común. La corrección de atribución queda corroborada por revisión independiente.
- [Canarias e Illes Balears](deducciones-2025/revisiones/c-ampliado/INFORME.md): revisados los 51 expedientes; 49 concordancias documentales acotadas y dos diferencias temporales. La [corrección](deducciones-2025/correcciones/c-temporal/INFORME.md) distingue los límites canarios del año de origen del traslado y explica que el porcentaje balear reforzado ya existía antes de julio de 2025. El PDF oficial canario se incorpora al almacén externo y sus citas exactas al manifiesto. Tres PDF del BOIB siguen sin recuperarse; sus HTML oficiales están disponibles. Las dos correcciones temporales quedan corroboradas por revisión independiente.
- [Castilla-La Mancha, Castilla y León y Extremadura](deducciones-2025/correcciones/d/INFORME.md): corregidos cinco artículos extremeños y dos mezclas de secciones; ampliadas las 63 fichas. Quedan remisiones y cadenas precisadas en el informe, sin bloqueo externo demostrado. La incompatibilidad de vivienda CLM conserva una reserva entre norma y criterio administrativo.
- [Galicia y La Rioja](deducciones-2025/correcciones/e-remisiones/INFORME.md): ampliadas 49 fichas y sus remisiones, con 57 fuentes y 1.618 citas. Queda una reserva sobre el efecto temporal de las exenciones por incendios tras las derogaciones de las normas estatales. La nueva evidencia requiere revisión independiente. Las correcciones anteriores de citas y certificado ya contrastadas no se reabren.
- [Madrid y Murcia](deducciones-2025/correcciones/f/INFORME.md): 51 códigos ampliados, 64 fuentes y 2.602 citas; pendiente revisión independiente. Se conservan el solapamiento legal en 35.000 euros de vehículos murcianos y las remisiones defectuosas de vivienda joven. Los dos fallos financieros del informe se refieren a su base anterior: deben contrastarse con el auxiliar de hechos explícitos actual antes de clasificarlos como defectos vigentes.
- [Comunitat Valenciana](deducciones-2025/correcciones/g/INFORME.md): 40 fichas rectificadas y 111 localizaciones candidatas resueltas, con 68 fuentes y 2.077 citas. Faltan las remisiones concretas enumeradas; no se consideran imposibilidades externas. Las 40 fichas pasan a `normalizada_pendiente_tests`: una descripción ampliada no acredita su cálculo. El catálogo sigue teniendo 351 entradas, de las que 311 conservan la etiqueta anterior de implementadas, sin que esa etiqueta certifique su corrección.

Las revisiones de las ampliaciones A, B y C cubren 148 fichas: 142 concordancias documentales acotadas, cinco diferencias y una ambigüedad. Las cinco diferencias están corregidas y corroboradas en su alcance por la [revisión independiente](deducciones-2025/revisiones/cinco-rectificaciones/INFORME.md). Este recuento no valida una liquidación ni sustituye el balance final de las 351 fichas. Pasan las 256 pruebas focalizadas de A y C y los casos independientes de sus tres correcciones; pasan además los nueve controles de Cantabria; los cinco grupos de casos propios de la revisión también pasan. No procede repetir las revisiones favorables. La reextracción auxiliar de una cita histórica de la DT segunda requiere otro selector; el original y su literal están comprobados mediante el localizador independiente de la nueva revisión. No afecta al dictamen favorable de los cinco arreglos.

La integración anterior reextrajo 13.911 citas de los siete lotes. Tras ampliar A, B y C, el verificador central admite los 351 registros y comprueba sus originales externos con ambos hashes y tamaño; no hay códigos ausentes ni duplicados. Comprobar la integridad de los archivos no sustituye el cotejo jurídico. Las llamadas antiguas sin hechos ya no son un contrato de cálculo válido.

La corrección candidata de los nueve casos del auxiliar compartido incorpora hechos explícitos por persona y evento y rechaza llamadas activas insuficientes. Pasan 612 pruebas integradas, con dos fallos históricos esperados, tipos principales y lint del alcance. Se han reextraído las 286 citas actuales de esos nueve códigos. La ruta anual de importes consignados permanece intacta. La entrega precisa un error del planteamiento inicial: 1.130 euros corresponde al tercer hijo canario más el primer suplemento por discapacidad; para el cuarto son 1.396 euros. La revisión independiente y la conciliación de los dictámenes regionales con la nueva API siguen pendientes. [Alcance](deducciones-2025/correcciones/auxiliar-hechos/INFORME.md), [compatibilidad](deducciones-2025/CAMBIOS-PARA-REDISENO.md#auxiliar-numérico-con-hechos-explícitos).

El contrato admite publicaciones primarias clasificadas como reforma o corrección, sin reclasificarlas como norma inicial. También distingue una URL oficial de una ruta local y el pie editorial del manual de su fecha de publicación no acreditada. El cambio de categorías normativas está corroborado por la revisión B. Los defectos adicionales de credenciales dentro de reservas y fecha nula normativa están corregidos y contrastados. El reconocimiento completo de destinos Markdown tiene [revisión favorable](deducciones-2025/revisiones/markdown-completo/INFORME.md): 53 regresiones, 36 casos anteriores y 84 adversos nuevos pasan. La comprobación usa CommonMark con dependencia fijada; no requiere otra ronda del mismo alcance. [Arreglo y límites](deducciones-2025/correcciones/contrato-url-fecha/CONTRASTE.md).

Se han comprobado también las 425 citas complementarias de las siete revisiones. La reextracción no basta para atribuir una cita al artículo correcto; esa pertenencia y la vigencia se contrastan por separado.

Pendiente no significa «no verificable». Las auditorías históricas sirven de punto de partida, no de validación automática. La ampliación parcial posterior de G aporta 50 citas y once precisiones descriptivas, con transporte comprobado; se mantiene sin integrar hasta completar sus lagunas generales y revisar el conjunto. Los originales nuevos se conservan en el almacén externo. Las fichas pueden cambiar para expresar correctamente el cálculo y su procedencia.

## Extracción automática de datos de 2012–2026

La [canalización candidata](datos-2012-2026/INFORME.md) inventaría 57 módulos y 116.170 rutas efectivas en su versión fijada. Las rutas incluyen alias, textos y metadatos; no son 116.170 magnitudes fiscales distintas.

La primera ejecución extrajo 277 celdas: 87 coincidencias numéricas, 189 sin comparación y una ausencia. La [revisión técnica](datos-2012-2026/revision-canalizacion/INFORME.md) detectó defectos de unidades, signos y obligaciones de cobertura, además de límites en selectores y huellas de ejecución. La [corrección candidata](datos-2012-2026/CORRECCIONES-RP.md) conserva 50 coincidencias con unidad acreditada, 226 celdas sin verificación y una ausencia explícita. Las otras 37 igualdades anteriores dejan de considerarse verificadas porque falta acreditar su unidad; no son nuevas diferencias numéricas. La reconstrucción del piloto y las 18 pruebas sintéticas pasan, junto con dos regresiones estrictas. Requiere revisión independiente antes de ampliar las tablas; el bloque A sigue abierto. El control adicional checkJs conserva cinco diagnósticos compartidos, distintos de las comprobaciones ordinarias de CI.

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
