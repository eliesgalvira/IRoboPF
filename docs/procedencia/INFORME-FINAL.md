# Informe de resultados de la auditoría documental

**Resultado posterior disponible:** el cálculo anual interno del perfil salarial admitido de Madrid 2025 está terminado y revisado, con el redondeo contrastado contra siete ejecuciones de Renta WEB Open. La interfaz queda para Opus. El [resumen del perfil salarial](DECLARACION-SALARIAL-2025.md) explica sus condiciones y límites sin exigir leer esta auditoría completa.

El cierre de 65 sitios descrito a continuación conserva sus versiones de código y evidencias históricas. La corrección salarial posterior no recibe automáticamente esos dictámenes; tiene una [revisión independiente propia](revisiones/redondeo-salarial-open/INFORME.md).

**Los 65 sitios del catálogo tienen conclusión individual: 64 están corroborados técnicamente bajo condiciones y uno tiene un bloqueo demostrado.** Este es el cierre del alcance técnico acotado; la auditoría fiscal exhaustiva de 2012–2026 permanece incompleta. El [estado](ESTADO.md) sirve como índice y las [decisiones](DECISIONES.md) explican los criterios y costes.

Un «sitio» es un punto identificado del rastro de cálculo. Su dictamen acredita el origen del valor y la selección del cálculo dentro del perfil examinado; no equivale a una regla fiscal completa ni valida automáticamente fuentes, hechos o derechos.

## Qué queda demostrado

Los resultados se concilian con los **65 identificadores del catálogo**, sin duplicados, ausencias ni sobrantes. La [tabla individual](correcciones/cierre-r66/MATRIZ-65.md) enlaza cada dictamen; la [matriz verificable](correcciones/cierre-r66/matriz-65.json) conserva condiciones, hashes y reservas por sitio.

| Ámbito | Sitios | Resultado y condiciones principales |
| --- | ---: | --- |
| Cotizaciones sociales | 11 | Valor y selección corroborados para el perfil analítico, modos y ejercicios admitidos; bases, tipos y componentes del trabajador y empresa diferenciados. No acredita liquidación mensual TGSS universal. |
| Retenciones y pagos | 6 | Subcaso, versión temporal, conversiones y pagos consumidos conservados. Solo servicios y ventanas admitidos; regularización y ventanas sin original acreditado conservan rechazo. |
| Rentas generales | 10 | Productores, colecciones, condiciones y enlace concreto con SS en trabajo, capital inmobiliario y ganancias. Entradas y hechos previamente admitidos. |
| Escalas, bases y mínimos | 28 | 22 sitios generales con selección territorial/temporal real y seis explícitos de trabajo/pensión. Estos seis se limitan a Madrid 2025, declaración individual y perfil permitido; actividad permanece excluida. |
| Otras salidas explícitas | 10 | Nueve de trabajo/pensión corroboradas, con retorno completo; `anual.explicito.actividad.etapa` bloqueada. |
| **Total** | **65** | **64 corroboraciones condicionadas y un bloqueo.** |

Las demostraciones requieren código y runtime fijados, descriptor derivado del código exacto, Decimal sin reconfiguración, ejecución síncrona, datos ordinarios y finitos y colecciones densas. Los hechos y derechos familiares se presuponen admitidos externamente. La evidencia cubre productores, invocaciones, propiedades, selección y transporte dentro de ese dominio. Las condiciones completas constan en los dictámenes de [SS](revisiones/causal-ss-r56-sol/INFORME.md), [retenciones](revisiones/causal-retenciones-r58-sol/INFORME.md), [rentas](revisiones/causal-rentas-r60-sol/INFORME.md) y [escalas](revisiones/causal-escalas-r62-sol/INFORME.md).

Las pruebas independientes incluyen cálculos racionales, comparación con las API financieras reales y alteraciones que conservan el importe pero cambian su procedencia. El replay comparte parte del evaluador: sus coincidencias ayudan a comprobar integridad, pero no constituyen un segundo motor universal independiente ni prueban equivalencia con toda la semántica de JavaScript o Effect, objetos hostiles o transformaciones arbitrarias de schemas.

### Retorno completo y bloqueo de actividad

La evidencia de las salidas explícitas incluye identidad compartida de arrays, retorno completo e instantáneas inmutables de sus mutaciones. Se conserva el contraejemplo que obtenía cifras correctas mientras perdía pasos del retorno, junto con su reparación y contraste independiente. Esto delimita la semántica mutable soportada. [Defecto y corrección](correcciones/push-explicitos-r65/INFORME.md), [dictamen](revisiones/push-explicitos-r65-sol/INFORME.md).

`anual.explicito.actividad.etapa` necesita `adaptarActividadGeneral → calcularActividad2025 → etapas/aporte`, cuyos productores pertenecen a las **19 familias excluidas**. El bloqueo acredita esa dependencia mediante rechazo y sensibilidad de las salidas; trabajo y pensión no la reemplazan. Las variantes de actividad de otras salidas explícitas tampoco quedan cubiertas por contarlas entre los 64 sitios condicionados. [Detalle por sitio](correcciones/cierre-r66/MATRIZ-65.md).

## Otras evidencias disponibles

- **Inventario:** 52.461 ocurrencias técnicas —24.383 sintácticas, 16.351 efectivas y 11.727 seleccionadas— y catálogo de 351 deducciones. Conserva `audited: 0` y 29.595 unidades pendientes de interpretación. [Cobertura y límites](INVENTARIO.md).
- **Procedencia documental:** corpus por hash, citas con coordenadas, facsímiles y comprobaciones numéricas. Hay 264 enlaces incorporados localmente, sobre 102 sujetos, con aceptación limitada por celda y año; Madrid 2020 permanece separado y pendiente. Se conservan 45 snapshots. [Incorporación y recuperación](correcciones/recepcion-r36/INFORME.md), [revisión operativa](revisiones/incorporacion-local-r36-sol/INFORME.md).
- **Reproducción legacy:** contraste de 15 hojas DAT y 32.700.327 celdas; en inflación, 16.770 celdas y corrección de 69 diferencias, con 543 controles aparte. La coincidencia tabular no acredita validez legal. [DAT](revisiones/redondeos-legacy-v1/INFORME.md), [inflación](revisiones/comparativa-inflacion-v1/INFORME.md), [coherencia de cuota y neto](revisiones/publicacion-cuota-v2/INFORME.md).
- **Correcciones fiscales acotadas:** informes, originales, contraejemplos e implementaciones revisadas por dominio. Las conclusiones técnicas surgidas de referencias privadas se conservan con su contraste independiente; no sustituyen documentos oficiales ni prueban cobertura exhaustiva de X. [Auditoría y reservas por corrección](auditorias/correcciones-x-2051956145145712916/INFORME.md), [revisión](revisiones/correcciones-x-v1/INFORME.md).

## Qué no queda demostrado

No se certifica una declaración completa ni toda la fiscalidad 2012–2026. Permanecen lagunas de vigencia histórica, condiciones de deducciones, interpretación y autenticidad documental. Recuperar los PDF de algoritmos de 2012–2016 no habilita por sí solo esos ejercicios. Las reservas de retenciones y redondeo mensual TGSS se distinguen de la corroboración técnica del rastro y deben leerse en sus informes específicos.

Navarra y los territorios vascos no están modelados. Para 2026 el selector territorial del inventario solo admite `simulada-estatal`; el ejercicio no queda fiscalmente cerrado. Las deducciones autonómicas con consignación manual o contrato parcial no son automatización integral, y el agregado examinado en escalas no certifica cada código.

No existe todavía demostración causal completa de las 19 familias, composición global entre programas ni admisión pública de cualquier entrada. Sus candidatos se conservan con sus reservas y no se presentan como trabajos terminados. Los indicadores **`siteClosed`, `admissionClosed`, `wiringAllowed` y `completeRuleAcceptance` siguen en `false`**. [Criterio de cierre D137](DECISIONES.md#d137--cerrar-el-encargo-acotado-sin-promover-garantías-globales).

## Calidad y mantenimiento

Los bytes finales de producto conservan comprobaciones correctas de tipos principal/vendor y lint global, con las 16 reglas anti-slop a error y 16 avisos ESLint. El alcance de esos resultados consta en la [validación conservada](correcciones/push-explicitos-r65/validacion-final.json). No equivalen a tipado estricto integral MJS: el host estricto del último lote registró **1.302 diagnósticos `checkJs`, 232 en archivos nuevos**. Los recuentos de hosts distintos no acreditan una reducción de deuda.

Los 36 testigos nuevos de la revisión de escalas no tienen su pase Ajv propio, que no llegó a ejecutarse; los 50 anteriores mantienen su validación estricta previa. Esa ausencia no se cuenta como comprobación correcta.

Mantener el motor y una semántica documental finita exige revisar compatibilidad o generar testigos nuevos cuando cambia el software, conservando los históricos. Las muestras, el replay y los hashes no sustituyen expectativas externas ni acreditan garantía universal.

## Trabajo posterior y estimación

Estos trabajos quedan fuera del alcance cerrado. Las horas son esfuerzo técnico orientativo, incluida revisión, con incertidumbre alta; no representan tiempo de reloj en paralelo ni compromiso de aceptación. Una ronda comprende implementación y revisión independiente; una corrección adicional requiere un defecto reproducido.

| Trabajo pendiente | Qué falta | Rondas orientativas | Esfuerzo |
| --- | --- | ---: | ---: |
| 19 familias de actividad | Productores y propiedades por instancia, colecciones, selección, etapas y transporte; desbloquear variantes dependientes. | 2–4 lotes | 32–64 h |
| Composición global | Evidencia común de recorridos, identidad, unidades, selección y obligaciones transitivas entre programas. | 1–3 | 16–40 h |
| Admisión | Condiciones evaluables por propiedad/instancia, errores, selectores, hechos/derechos y propagación anual; el codec de identidad no basta. | 2–4 | 24–64 h |
| Activación técnica de puertas | Derivar estados de obligaciones completas, rechazar evidencia insuficiente, conservar compatibilidad y controlar la conexión pública. Depende de las tres filas anteriores. | 1–2 | 8–24 h adicionales |
| Aceptación fiscal completa | Resolver reservas jurídicas y de autenticidad por regla, año, territorio y perfil con revisión independiente. | Sin total defendible | 80–200 h para una primera fase acotada; sin cota total defendible para 2012–2026 |

Familias recoge 20–40 h de implementación y 12–24 h de revisión declaradas por autor/revisor; no hay presupuesto individual auditado para las 19. Composición, admisión y activación son estimaciones de planificación. Documentos ausentes, conflictos normativos o autenticidad no resuelta pueden impedir aceptación aun después de invertir esas horas. Sumar las filas no permite prometer una fecha de publicación.

El endurecimiento del tipado del último lote MJS y sus fronteras tiene una orientación adicional de **12–24 h**, que no cubre toda la deuda de 1.302 diagnósticos. [Decisión y límites de las estimaciones](DECISIONES.md#d137--cerrar-el-encargo-acotado-sin-promover-garantías-globales).

## Respaldo y conservación

El respaldo completo actual del código y de la semilla externa se describe en [Respaldos privados y restauración](almacen-externo/RESPALDO.md). Los cortes V5 y V1 que siguen son antecedentes conservados. Las rutas locales de los informes históricos están anonimizadas; no son instrucciones para localizar las copias actuales.

El respaldo de código, informes y evidencias seleccionadas utiliza `origin/procedencia-documental`. Una clonación Git necesita además restaurar el CAS local y configurar su ubicación para recuperar todos los originales grandes. [Expediente de cierre](correcciones/cierre-r66/INFORME.md).

host-a conserva **V5 r2, corte R26**, con paquete y restauración en `/home/local/Repos/IRoboPF/.cache/orquestador-preservacion/v5-r2-2b15925970d4/`. El pin de manifiesto es `2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88`: 1.447 objetos, 18.146 archivos físicos y 2.169.593.524 bytes por copia, incluidos auxiliares. Sus reservas de selección y privacidad y las adquisiciones posteriores se conservan por separado; no es una copia actualizada al cierre. [Identidad del paquete](correcciones/recepcion-r26-r28/preservacion-v5.json).

**host-b conserva V1 desfasado**, en `/home/usuario/Backups/IRoboPF/corpus-2026-10-29-manifest-2df6c208/`, manifiesto `2df6c208eed389614e678c9009ccf463b00f3bfed9cf098876ce7d9329f593fb`. La copia comunicada contiene 709 archivos y 980.219.072 bytes; se informó del cotejo SHA-256 de los 708 objetos, sin ejecutar `preservacion.py verify`. No se atribuye una nueva verificación en destino. Es otra máquina del mismo propietario y vivienda: copia local fuera de host-a, sin custodia independiente ni respaldo remoto completo acreditado. [Registro de la copia](preservacion/copia-host-b.json).

Los paquetes y originales conservan su identidad. Las mejoras del consumidor y de la documentación no actualizan por sí solas esos cortes ni autorizan transferencia, gasto, LFS o despliegue.

## Privacidad

Se ha revisado la historia completa de `procedencia-documental`, incluidos mensajes, Excel, PDF, imágenes, sesiones y transportes comprimidos. Se sustituyeron rutas y cuentas locales, nombres de equipos, referencias internas de hilos y metadatos de propietario de archivos. La historia conserva sus **214 commits, mensajes, autores, fechas y 19 firmas**. Los hashes antiguos siguen resolviéndose mediante el [mapa acumulado](almacen-externo/mapa-commits.tsv).

No se han confirmado credenciales ni nóminas, DNI, teléfonos, direcciones o datos bancarios reales atribuibles al propietario. El Excel es una matriz generada; las sesiones de Renta WEB son simulaciones documentadas. Se conservan las atribuciones públicas, los ejemplos y los datos institucionales. **Queda una duda:** una ruta de usuario en un metadato de un PDF institucional, sin atribución demostrada al propietario. Se mantiene el original; [archivo y commit, sin reproducir el dato](privacidad/dudas.json).

Los hallazgos confirmados no aparecen como blobs idénticos en las otras ocho ramas publicadas. Se comprobaron además las rutas conocidas en sus blobs adicionales; esto no equivale a una auditoría integral de esas ramas. `main` y las otras ramas no se han reescrito. Las copias locales y posibles cachés del proveedor conservan su propia historia. [Alcance y límites](privacidad/README.md).

El respaldo completo anterior se restauró y verificó fuera de Git, junto con la semilla documental. **Los originales privados no se han perdido.** La semilla contiene metadatos históricos que deben revisarse antes de distribuirla desde el backend. Las copias públicas anonimizadas tienen su propio [mapa de hashes](privacidad/objetos.json); no se confunden con los bytes que se revisaron originalmente.

Pasan los 49 snapshots con sus dependencias, las rutas, el tipado del producto y lint. Se mantienen expresamente los rechazos previos por inventario o fuentes históricas distintos; no se ha renovado aceptación fiscal. [Resultados y límites de las comprobaciones](privacidad/VALIDACION.md).

La historia empaquetada de una clonación limitada a esta rama pasa de aproximadamente **1,37 GB a 1,08 GB** tras retirar el almacén y anonimizarla. El disco de trabajo conserva también las ramas antiguas y respaldos; no se ha hecho limpieza. El almacén externo se configura mediante `IROBOPF_CAS_LOCAL`, con lecturas verificadas por hash. No se implementa backend ni se altera la interfaz.

Commits de preparación: `279bec2ee519abc7a8bb7dbb3e976933b42b4db4` —historia anonimizada—, `59d5380d` —mapas y verificador de copias— y `9203c112` —portabilidad y lectores históricos—. La [guía de migración](almacen-externo/MIGRACION.md) da las correspondencias para los worktrees y `rediseno/expertos`.
