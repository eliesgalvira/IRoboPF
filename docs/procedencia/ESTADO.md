# Estado de la auditoría documental

## Prioridad: CI reproducible

La integración de deducciones y A–F queda aplazada hasta dejar verde el workflow «Comprobaciones». Las pruebas ordinarias deben funcionar con un checkout limpio, sin `.cache`, archivos privados, corpus externo local ni objetos Git históricos. Los ensayos que necesitan el corpus completo se separan como comprobaciones locales opcionales, con omisión explícita y documentada en CI. Cada push debe pasar previamente los mismos comandos del workflow; los cambios se agrupan.

Corregidos los imports privados, las consultas a objetos Git históricos, el registro temporal del ensayo de enlaces y las aserciones de importe de la revisión gallega/riojana. Los verificadores usan fixtures sintéticos en CI y fuentes actuales fijadas por SHA-256; el corpus completo conserva su suite local opcional. Los comandos se reproducen con [el script de CI](CI.md). Quedan pendientes la revisión independiente y la confirmación de una ejecución verde en GitHub; las pruebas locales no sustituyen esa confirmación.

## Alcance completo aprobado

Además de las deducciones de 2025, está encargado el [plan completo A–F](PLAN-COMPLETO.md): procedencia automática de todos los datos de 2012–2026; comunidades reales en 2026; miles de comparaciones con simuladores oficiales; redondeo observado de cotizaciones; mínimos familiares unificados; y actividad, composición, admisión y puertas. El cierre técnico anterior de 65 sitios conserva sus resultados y deja de ser el límite del encargo.

La [reforma de motor único](REFORMA-MOTOR.md) tiene prioridad. Queda anulada la compatibilidad de fichas, firmas y resultados antiguos: se retiran `FamiliarFiscal`, el modo legacy y las rutas duplicadas. Las páginas actuales pueden adaptarse lo mínimo o desconectarse para compilar. La API nueva se documenta en [API-MOTOR.md](API-MOTOR.md); todavía no se presenta como implementada.

Las ampliaciones regionales de deducciones y el censo automático de A continúan con esa instrucción. La entrega del auxiliar compartido es candidata: sus cálculos útiles deben incorporarse a la ruta única y revisarse allí, sin perpetuar su fachada heredada. Los cambios compartidos tienen un responsable para evitar nuevas APIs divergentes. B, C, D y F continúan según sus dependencias; E se adelanta como parte de la reforma. Cada bloque recibe revisión independiente y un balance de cobertura, diferencias, correcciones y decisiones.

| Bloque | Estado |
| --- | --- |
| A. Datos de 2012–2026 | Canalización candidata integrada: 277 celdas extraídas, 87 coincidencias; revisión técnica y extensión del conjunto pendientes |
| B. Comunidades en 2026 | Pendiente de inicio; reutilizará las fuentes de A |
| C. Simuladores oficiales | Pendiente de inicio |
| D. Redondeo de cotizaciones | Pendiente de inicio con criterio de comportamiento observado |
| E. Mínimos familiares | En curso con `gpt-6.1-sol`, esfuerzo `high`: retirada de `FamiliarFiscal`, mínimos duplicados y modo legacy; extensión normativa por año pendiente |
| F. Actividad y declaración completa | Encargado; pendiente de productores y contratos anteriores |

## En curso: deducciones autonómicas de 2025

Revisión de **351 fichas** contra los originales de los boletines autonómicos, sus reformas y el manual AEAT. Base: `464e0fd8`; solo commits nuevos. [Censo y reparto](deducciones-2025/censo.json), [criterios de dictamen](deducciones-2025/ENCARGO.md), [transición para el rediseño](deducciones-2025/CAMBIOS-PARA-REDISENO.md).

| Lote | Comunidades | Fichas | Estado |
| --- | --- | ---: | --- |
| A | Andalucía, Aragón, Catalunya | 49 | Rectificación documental y remisiones en curso |
| B | Asturias, Cantabria | 48 | Atribuciones rectificadas; completando condiciones comunes y remisiones |
| C | Canarias, Illes Balears | 51 | Rectificación documental y remisiones en curso |
| D | Castilla-La Mancha, Castilla y León, Extremadura | 63 | Siete fallos documentales corregidos; faltan remisiones y cierre de cadenas |
| E | Galicia, La Rioja | 49 | Remisiones ampliadas; pendiente revisión de la evidencia nueva y reserva temporal de incendios |
| F | Madrid, Murcia | 51 | Ampliación documental integrada; pendiente revisión independiente, con dos reservas concretas |
| G | Comunitat Valenciana | 40 | Fichas y citas rectificadas; remisiones identificadas todavía pendientes |

El contrato documental inicial muestra pendiente cuando no hay evidencia. Su carácter aditivo ya no limita el modelo definitivo. Los tres defectos del verificador están corregidos y contrastados independientemente: coherencia del dictamen global, adquisiciones compartidas y filtrado de URL. Pasan 37 regresiones y siete casos del revisor; las diez pruebas Vitest se ejecutaron en el repositorio principal. Revisión técnica cerrada, sin aceptar todavía normas. [Contrato y uso](deducciones-2025/contrato/README.md), [dictamen independiente](deducciones-2025/revisiones/contrato-corregido/INFORME.md).

**351 dictámenes candidatos y las siete revisiones independientes recibidos; cobertura completa del censo. Ningún lote aceptado íntegramente todavía.** Los autores propusieron 252 diferencias y 99 no verificables para el alcance completo. Son recuentos provisionales; las revisiones y rectificaciones se deben conciliar antes del balance final. Las diferencias incluyen omisiones de ficha: no equivalen a 252 errores de cálculo.

- [Asturias y Cantabria](deducciones-2025/lotes/b/INFORME.md): corregidas la frontera de 8.000 euros de estudios y las 18 atribuciones jurídicas, incluidos educación y vehículos. Incorporados ocho originales regionales y las remisiones territoriales. Pasan 49 pruebas y 798 citas reextraídas. Quedan las condiciones comunes y remisiones concretas, dos defectos del auxiliar compartido y la ambigüedad de los 30 años en gastos vitales asturianos. La nueva evidencia requiere revisión independiente. [Rectificaciones y límites](deducciones-2025/correcciones/b/INFORME.md).
- [Andalucía, Aragón y Catalunya](deducciones-2025/lotes/a/INFORME.md): ocho cambios previos corroborados; la revisión señala nueve diferencias documentales actuales y trabajo concreto de vigencia y remisiones. [Revisión](deducciones-2025/revisiones/a/INFORME.md).
- [Canarias e Illes Balears](deducciones-2025/lotes/c/informe.md): 51 referencias de página corregidas, 41 descripciones de consignación precisadas y restricción individual del incremento por enfermedad. La revisión confirma cinco discrepancias del auxiliar heredado y precisa efectos temporales y remisiones pendientes. [Revisión](deducciones-2025/revisiones/c/INFORME.md).
- [Castilla-La Mancha, Castilla y León y Extremadura](deducciones-2025/correcciones/d/INFORME.md): corregidos cinco artículos extremeños y dos mezclas de secciones; ampliadas las 63 fichas. Quedan remisiones y cadenas precisadas en el informe, sin bloqueo externo demostrado. La incompatibilidad de vivienda CLM conserva una reserva entre norma y criterio administrativo.
- [Galicia y La Rioja](deducciones-2025/correcciones/e-remisiones/INFORME.md): ampliadas 49 fichas y sus remisiones, con 57 fuentes y 1.618 citas. Queda una reserva sobre el efecto temporal de las exenciones por incendios tras las derogaciones de las normas estatales. La nueva evidencia requiere revisión independiente. Las correcciones anteriores de citas y certificado ya contrastadas no se reabren.
- [Madrid y Murcia](deducciones-2025/correcciones/f/INFORME.md): 51 códigos ampliados, 64 fuentes y 2.602 citas; pendiente revisión independiente. Se conservan el solapamiento legal en 35.000 euros de vehículos murcianos y las remisiones defectuosas de vivienda joven. Los dos fallos financieros del informe se refieren a su base anterior: deben contrastarse con el auxiliar de hechos explícitos actual antes de clasificarlos como defectos vigentes.
- [Comunitat Valenciana](deducciones-2025/correcciones/g/INFORME.md): 40 fichas rectificadas y 111 localizaciones candidatas resueltas, con 68 fuentes y 2.077 citas. Faltan las remisiones concretas enumeradas; no se consideran imposibilidades externas. Las 40 fichas pasan a `normalizada_pendiente_tests`: una descripción ampliada no acredita su cálculo. El catálogo sigue teniendo 351 entradas, de las que 311 conservan la etiqueta anterior de implementadas, sin que esa etiqueta certifique su corrección.

Se han reextraído las 13.911 citas actuales de los siete lotes y comprobado sus originales externos con ambos hashes y tamaño. El verificador central completo admite los 351 registros con CAS explícito; no hay códigos ausentes ni duplicados. Pasan 684 pruebas integradas, los tipos principal y vendor y el lint del alcance. Se conservan dos fallos históricos esperados; las llamadas antiguas sin hechos ya no son un contrato de cálculo válido.

La corrección candidata de los nueve casos del auxiliar compartido incorpora hechos explícitos por persona y evento y rechaza llamadas activas insuficientes. Pasan 612 pruebas integradas, con dos fallos históricos esperados, tipos principales y lint del alcance. Se han reextraído las 286 citas actuales de esos nueve códigos. La ruta anual de importes consignados permanece intacta. La entrega precisa un error del planteamiento inicial: 1.130 euros corresponde al tercer hijo canario más el primer suplemento por discapacidad; para el cuarto son 1.396 euros. La revisión independiente y la conciliación de los dictámenes regionales con la nueva API siguen pendientes. [Alcance](deducciones-2025/correcciones/auxiliar-hechos/INFORME.md), [compatibilidad](deducciones-2025/CAMBIOS-PARA-REDISENO.md#auxiliar-numérico-con-hechos-explícitos).

El contrato admite publicaciones primarias clasificadas como reforma o corrección, sin reclasificarlas como norma inicial. También distingue una URL oficial de una ruta local y el pie editorial del manual de su fecha de publicación no acreditada. El cambio de categorías normativas está corroborado por la revisión B. Los defectos adicionales de credenciales dentro de reservas y fecha nula normativa están corregidos y contrastados. La revisión de enlaces Markdown reprodujo cuatro variantes de recorte prematuro. Se han corregido comprobando la URL completa y los destinos resueltos por CommonMark, con una dependencia fijada. Pasan los 36 casos del revisor y 53 regresiones; este cambio queda pendiente de una revisión independiente nueva. [Arreglo y límites](deducciones-2025/correcciones/contrato-url-fecha/CONTRASTE.md).

Se han comprobado también las 425 citas complementarias de las siete revisiones. La reextracción no basta para atribuir una cita al artículo correcto; esa pertenencia y la vigencia se contrastan por separado.

Pendiente no significa «no verificable». Las auditorías históricas sirven de punto de partida, no de validación automática. Los originales nuevos se conservan en el almacén externo. Las fichas pueden cambiar para expresar correctamente el cálculo y su procedencia.

## Extracción automática de datos de 2012–2026

La [canalización candidata](datos-2012-2026/INFORME.md) inventaría 57 módulos y 116.170 rutas efectivas en su versión fijada. Las rutas incluyen alias, textos y metadatos; no son 116.170 magnitudes fiscales distintas.

Su primera ejecución extrae 277 celdas: 87 coinciden, ninguna difiere, 189 carecen todavía de comparación y una contiene una ausencia. La reconstrucción exacta desde el CAS y los seis controles del extractor pasan. Es una muestra operativa, no el cierre del bloque A. La revisión técnica independiente y la ampliación a todas las tablas siguen pendientes.

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
