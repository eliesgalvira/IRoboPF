# Estado de la auditoría documental

## En curso: deducciones autonómicas de 2025

Revisión de **351 fichas** contra los originales de los boletines autonómicos, sus reformas y el manual AEAT. Base: `464e0fd8`; solo commits nuevos. [Censo y reparto](deducciones-2025/censo.json), [criterios de dictamen](deducciones-2025/ENCARGO.md), [compatibilidad para el rediseño](deducciones-2025/CAMBIOS-PARA-REDISENO.md).

| Lote | Comunidades | Fichas | Estado |
| --- | --- | ---: | --- |
| A | Andalucía, Aragón, Catalunya | 49 | Candidato recibido; revisión independiente pendiente |
| B | Asturias, Cantabria | 48 | Candidato integrado; revisión independiente en curso |
| C | Canarias, Illes Balears | 51 | Candidato recibido; revisión independiente pendiente |
| D | Castilla-La Mancha, Castilla y León, Extremadura | 63 | Candidato recibido; revisión independiente pendiente |
| E | Galicia, La Rioja | 49 | Contraste normativo en curso |
| F | Madrid, Murcia | 51 | Candidato recibido; revisión independiente pendiente |
| G | Comunitat Valenciana | 40 | Candidato recibido; revisión independiente pendiente |

El contrato aditivo conserva campos y valores de las fichas y muestra pendiente cuando no hay evidencia. Los tres defectos del verificador están corregidos y contrastados independientemente: coherencia del dictamen global, adquisiciones compartidas y filtrado de URL. Pasan 37 regresiones y siete casos del revisor; las diez pruebas Vitest se ejecutaron en el repositorio principal. Revisión técnica cerrada, sin aceptar todavía normas. [Contrato y uso](deducciones-2025/contrato/README.md), [dictamen independiente](deducciones-2025/revisiones/contrato-corregido/INFORME.md).

**302 dictámenes candidatos recibidos; 49 pendientes de entrega. Ninguno aceptado todavía.** Los resultados posteriores propuestos son 203 diferencias y 99 no verificables para el alcance completo. Las diferencias incluyen omisiones de ficha: no equivalen a 203 errores de cálculo.

- [Asturias y Cantabria](deducciones-2025/lotes/b/INFORME.md): dos diferencias del helper compartido y 46 no verificables con reservas. Se corrige el límite de cuidado de familiares y se amplían 18 descripciones; revisión independiente en curso.
- [Andalucía, Aragón y Catalunya](deducciones-2025/lotes/a/INFORME.md): ocho correcciones documentales; los 49 dictámenes completos conservan reservas concretas de vigencia, remisiones o cálculo.
- [Canarias e Illes Balears](deducciones-2025/lotes/c/informe.md): 51 referencias de página corregidas, 41 descripciones de consignación precisadas y restricción individual del incremento por enfermedad. Se conservan cinco discrepancias propuestas del auxiliar heredado.
- [Castilla-La Mancha, Castilla y León y Extremadura](deducciones-2025/lotes/d/INFORME.md): 63 referencias de página corregidas; persisten 59 diferencias documentales y cuatro no verificables. La reserva sobre una incompatibilidad de vivienda CLM distingue norma y criterio administrativo.
- [Madrid y Murcia](deducciones-2025/lotes/f/informe.md): 51 referencias de página corregidas; persisten omisiones documentales y dos diferencias propuestas del helper compartido.
- [Comunitat Valenciana](deducciones-2025/lotes/g/INFORME.md): 40 referencias de página corregidas; las 40 fichas conservan diferencias documentales y reservas normativas.

Se han reextraído las 9.128 citas de los seis lotes y comprobado sus originales externos con ambos hashes y tamaño. El verificador central admite los 302 registros con CAS explícito. Los nueve contraejemplos financieros propuestos se deben contrastar en la API concreta: no se atribuyen automáticamente a la liquidación anual, que consume importes consignados.

El contrato admite publicaciones primarias clasificadas como reforma o corrección, sin reclasificarlas como norma inicial. También distingue una URL oficial de una ruta local y el pie editorial del manual de su fecha de publicación no acreditada. Pasan 44 regresiones del consumidor; el contraste independiente de estas ampliaciones acompaña a las revisiones de los lotes B y A.

Pendiente no significa «no verificable». Las auditorías históricas sirven de punto de partida, no de validación automática. Los originales nuevos se conservan en el almacén externo y se mantiene compatible la forma de las fichas.

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
