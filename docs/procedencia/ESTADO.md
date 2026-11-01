# Estado de la auditoría documental

## En curso: deducciones autonómicas de 2025

Revisión de **351 fichas** contra los originales de los boletines autonómicos, sus reformas y el manual AEAT. Base: `464e0fd8`; solo commits nuevos. [Censo y reparto](deducciones-2025/censo.json), [criterios de dictamen](deducciones-2025/ENCARGO.md), [compatibilidad para el rediseño](deducciones-2025/CAMBIOS-PARA-REDISENO.md).

| Lote | Comunidades | Fichas | Estado |
| --- | --- | ---: | --- |
| A | Andalucía, Aragón, Catalunya | 49 | Rectificación documental y remisiones en curso |
| B | Asturias, Cantabria | 48 | Rectificación documental en curso; dos cambios del auxiliar pendientes |
| C | Canarias, Illes Balears | 51 | Rectificación documental y remisiones en curso |
| D | Castilla-La Mancha, Castilla y León, Extremadura | 63 | Rectificación documental y remisiones en curso |
| E | Galicia, La Rioja | 49 | Citas y certificado corregidos; contraste en curso, remisiones pendientes |
| F | Madrid, Murcia | 51 | Rectificación documental y remisiones en curso |
| G | Comunitat Valenciana | 40 | Rectificación documental y remisiones en curso |

El contrato aditivo conserva campos y valores de las fichas y muestra pendiente cuando no hay evidencia. Los tres defectos del verificador están corregidos y contrastados independientemente: coherencia del dictamen global, adquisiciones compartidas y filtrado de URL. Pasan 37 regresiones y siete casos del revisor; las diez pruebas Vitest se ejecutaron en el repositorio principal. Revisión técnica cerrada, sin aceptar todavía normas. [Contrato y uso](deducciones-2025/contrato/README.md), [dictamen independiente](deducciones-2025/revisiones/contrato-corregido/INFORME.md).

**351 dictámenes candidatos y las siete revisiones independientes recibidos; cobertura completa del censo. Ningún lote aceptado íntegramente todavía.** Los autores propusieron 252 diferencias y 99 no verificables para el alcance completo. Son recuentos provisionales; las revisiones y rectificaciones se deben conciliar antes del balance final. Las diferencias incluyen omisiones de ficha: no equivalen a 252 errores de cálculo.

- [Asturias y Cantabria](deducciones-2025/lotes/b/INFORME.md): dos diferencias del helper compartido y 46 no verificables con reservas. La revisión confirma esos dos defectos y detecta la inclusión incorrecta de renta igual a 8.000 euros en estudios, ya corregida con prueba. Quedan por rectificar 18 atribuciones jurídicas y las reservas concretas de la matriz. [Contraste del lote](deducciones-2025/revisiones/b/CONTRASTE.md).
- [Andalucía, Aragón y Catalunya](deducciones-2025/lotes/a/INFORME.md): ocho cambios previos corroborados; la revisión señala nueve diferencias documentales actuales y trabajo concreto de vigencia y remisiones. [Revisión](deducciones-2025/revisiones/a/INFORME.md).
- [Canarias e Illes Balears](deducciones-2025/lotes/c/informe.md): 51 referencias de página corregidas, 41 descripciones de consignación precisadas y restricción individual del incremento por enfermedad. La revisión confirma cinco discrepancias del auxiliar heredado y precisa efectos temporales y remisiones pendientes. [Revisión](deducciones-2025/revisiones/c/INFORME.md).
- [Castilla-La Mancha, Castilla y León y Extremadura](deducciones-2025/lotes/d/INFORME.md): 63 referencias de página corregidas; persisten 59 diferencias documentales y cuatro no verificables. La revisión detecta cinco artículos equivocados y mezclas de secciones, pendientes de rectificar. La incompatibilidad de vivienda CLM conserva una reserva entre norma y criterio administrativo. [Revisión](deducciones-2025/revisiones/d/INFORME.txt).
- [Galicia y La Rioja](deducciones-2025/lotes/e/informe.md): 49 referencias de página corregidas y precisión de la base neta de mínimos en nacimiento gallego. Corregidas tres citas AEAT de deducciones vecinas, dos intervalos de páginas y la aceptación de un certificado anterior al diagnóstico. Se ha precisado el parcial por titular, conservando su bloqueo en el agregado. Pasan 159 pruebas; el contraste independiente está en curso y quedan remisiones normativas pendientes. [Correcciones](deducciones-2025/correcciones/e/CONTRASTE.md).
- [Madrid y Murcia](deducciones-2025/lotes/f/informe.md): 51 referencias de página corregidas; la revisión confirma dos diferencias del auxiliar compartido. Persisten remisiones y un solapamiento legal en el umbral de 35.000 euros de vehículos murcianos. [Revisión](deducciones-2025/revisiones/f/INFORME.md).
- [Comunitat Valenciana](deducciones-2025/lotes/g/INFORME.md): 40 referencias de página corregidas; la revisión precisa el límite reforzado de inversión, la lista de deducciones sujeta al 30 % y reservas temporales. Hay que rectificar comparaciones y citas y completar las descripciones y remisiones. [Revisión](deducciones-2025/revisiones/g/INFORME.md).

Se han reextraído las 10.177 citas de los siete lotes y comprobado sus originales externos con ambos hashes y tamaño. El verificador central completo admite los 351 registros con CAS explícito; no hay códigos ausentes ni duplicados. Las revisiones confirman los nueve contraejemplos del auxiliar compartido. Está en curso su corrección mediante hechos explícitos y rechazos de entradas insuficientes: no se atribuyen automáticamente a la liquidación anual, que consume importes consignados.

El contrato admite publicaciones primarias clasificadas como reforma o corrección, sin reclasificarlas como norma inicial. También distingue una URL oficial de una ruta local y el pie editorial del manual de su fecha de publicación no acreditada. Pasan 44 regresiones del consumidor; el cambio de categorías normativas está corroborado por la revisión B. La revisión A corroboró los positivos de URL y fecha y encontró dos defectos adicionales: credenciales dentro de reservas y fecha nula normativa admitida por el schema aislado. Están corregidos, con 47 regresiones y contraste independiente en curso. [Arreglo acotado](deducciones-2025/correcciones/contrato-url-fecha/CONTRASTE.md).

Se han comprobado también las 425 citas complementarias de las siete revisiones. La reextracción no basta para atribuir una cita al artículo correcto; esa pertenencia y la vigencia se contrastan por separado.

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
