# Informe final para Elies

30 de octubre de 2026. Rama de entrega: `procedencia-documental`.

**He terminado el encargo con el alcance final que fijaste: los 65 sitios tienen una conclusión individual. Hay 64 corroborados técnicamente bajo condiciones y uno con bloqueo demostrado.** No queda otra implementación ni revisión dentro de ese alcance. La auditoría fiscal exhaustiva del BRIEF original sigue incompleta; tu orden posterior estableció este punto de parada.

Un «sitio» es un punto identificado del rastro de cálculo, no una regla fiscal completa ni una combinación de todos los años, territorios y situaciones familiares. El cierre acredita de dónde sale su valor y qué decisiones seleccionan ese cálculo dentro del perfil examinado. No convierte automáticamente sus fuentes, hechos o reglas en fiscalmente válidos.

## Qué queda demostrado

El recuento se ha conciliado con los **65 identificadores del catálogo actual**, sin duplicados, ausencias ni sobrantes. La [tabla individual](correcciones/cierre-r66/MATRIZ-65.md) enlaza cada dictamen; la [matriz verificable](correcciones/cierre-r66/matriz-65.json) conserva condiciones, hashes y reservas por sitio.

| Lote | Sitios | Resultado y condiciones principales |
| --- | ---: | --- |
| Cotizaciones sociales | 11 | Valor y selección corroborados para el perfil analítico, los modos y ejercicios admitidos. Se distinguen bases, tipos y componentes del trabajador y de la empresa. No acredita liquidación mensual TGSS universal. |
| Retenciones y pagos | 6 | Se conserva el subcaso de retención, su versión temporal, las conversiones y los pagos realmente consumidos. Solo servicios y ventanas admitidos; regularización y ventanas sin original acreditado conservan rechazo. |
| Rentas generales | 10 | Trabajo, capital inmobiliario y ganancias conservan sus productores, colecciones, condiciones y enlace concreto con SS. Hechos y entradas previamente admitidos. |
| Escalas, bases y mínimos | 28 | 22 sitios generales y seis explícitos de trabajo/pensión corroborados. Los generales respetan el selector territorial y temporal real. Los seis explícitos se limitan a Madrid 2025, declaración individual y perfil permitido; sus variantes de actividad siguen bloqueadas. |
| Últimos explícitos | 10 | Nueve de trabajo/pensión corroborados, con retorno completo. `anual.explicito.actividad.etapa` conserva bloqueo demostrado. |
| **Total** | **65** | **64 corroboraciones condicionadas y un bloqueo.** |

Las demostraciones usan el descriptor derivado del código exacto, el software y runtime fijados, Decimal sin reconfiguración, ejecución síncrona y datos ordinarios, finitos y colecciones densas. Los hechos y derechos familiares se presuponen admitidos externamente. Se conserva la evidencia completa de productores, invocaciones, propiedades, selección y transporte; un fragmento aislado de dependencias no sustituye esa evidencia.

Las pruebas independientes incluyen cálculos racionales, comparación con las API financieras reales y adulteraciones que mantienen el mismo importe pero cambian su procedencia. El replay comparte parte del evaluador: ayuda a comprobar integridad, pero no constituye un segundo motor universal independiente. Tampoco se ha demostrado equivalencia general con toda la semántica de JavaScript o Effect, objetos hostiles o transformaciones arbitrarias de schemas. Las condiciones completas están en los dictámenes de [SS](revisiones/causal-ss-r56-sol/INFORME.md), [retenciones](revisiones/causal-retenciones-r58-sol/INFORME.md), [rentas](revisiones/causal-rentas-r60-sol/INFORME.md) y [escalas](revisiones/causal-escalas-r62-sol/INFORME.md).

### El último defecto y el bloqueo de actividad

La revisión de los explícitos encontró un defecto real del intérprete documental: dos `push` devolvían longitudes `[1,1]` y el retorno perdía ambos pasos, aunque las nueve cifras capturadas coincidieran. Se conservó el rojo, se corrigió la identidad compartida de los arrays y se enlazaron sus mutaciones sin reescribir las instantáneas anteriores. La única revisión posterior corrobora `[1,2]`, dos pasos completos, dependencia de ambas mutaciones e independencia entre ejecuciones. El contraste final del padre reproduce el resultado exacto. [Arreglo y rojo](correcciones/push-explicitos-r65/INFORME.md), [revisión](revisiones/push-explicitos-r65-sol/INFORME.md) y [recepción final](correcciones/cierre-r66/INFORME.md).

El bloqueo de `anual.explicito.actividad.etapa` no es falta de tiempo ni una etiqueta administrativa: la ejecución necesita `adaptarActividadGeneral → calcularActividad2025 → etapas/aporte`, cuyos productores pertenecen a las **19 familias excluidas**. Se conserva su rechazo y la sensibilidad de las salidas dependientes. Trabajo y pensión no rellenan esa dependencia. Las variantes de actividad de otras salidas explícitas tampoco quedan cubiertas por contarlas entre los 64 sitios condicionados.

## Qué deja preparado la sesión más amplia

- **Inventario:** 52.461 ocurrencias técnicas —24.383 sintácticas, 16.351 efectivas y 11.727 seleccionadas—, más un catálogo de 351 deducciones. No son 52.461 reglas validadas: el inventario mantiene `audited: 0` y 29.595 unidades pendientes de interpretación. [Inventario y límites](INVENTARIO.md).
- **Documentación verificable:** corpus por hash, citas con coordenadas, facsímiles reproducibles, comprobaciones numéricas y rutas de fichas/objetos. Hay 264 enlaces incorporados localmente con aceptación limitada por celda y año, sobre 102 sujetos. Madrid 2020 permanece separado y pendiente; la aceptación de reglas completas sigue falsa. Se conservan 45 snapshots. [Incorporación y recuperación](correcciones/recepcion-r36/INFORME.md), [revisión operativa](revisiones/incorporacion-local-r36-sol/INFORME.md).
- **Contraste legacy:** las 15 hojas DAT se cotejaron en 32.700.327 celdas. La comparativa de inflación conserva el contraste de 16.770 celdas y la corrección de 69 diferencias, con 543 controles aparte. Es reproducción tabular acotada, no una validación legal por coincidir con Excel. No se ha repetido esa batería masiva para cerrar esta recepción. [DAT](revisiones/redondeos-legacy-v1/INFORME.md), [inflación](revisiones/comparativa-inflacion-v1/INFORME.md), [coherencia posterior de cuota y neto](revisiones/publicacion-cuota-v2/INFORME.md).
- **Investigación y correcciones fiscales acotadas:** quedan los informes, originales, rojos, implementaciones y revisiones por dominio. También se conservan las correcciones públicas de X verificadas y sus imágenes; no sustituyen documentos oficiales ni se afirma haber encontrado todo X. [Auditoría de X](auditorias/correcciones-x-2051956145145712916/INFORME.md), [revisión](revisiones/correcciones-x-v1/INFORME.md).

## Qué no queda demostrado

No se certifica una declaración completa ni toda la fiscalidad 2012–2026. Permanecen lagunas de vigencia histórica, condiciones de deducciones, interpretación y autenticidad documental. Los algoritmos recuperados de 2012–2016 no quedan habilitados por haber recuperado y leído sus PDF. Las reservas de retenciones y del redondeo mensual TGSS siguen separadas de la corroboración técnica del rastro.

Navarra y los territorios vascos no están modelados. En 2026 el selector territorial del inventario solo admite `simulada-estatal`: el ejercicio no queda fiscalmente cerrado. Las deducciones autonómicas con consignación manual o contrato parcial no se convierten en automatización integral. El agregado de deducciones examinado en el lote de escalas no certifica cada código.

El sistema tampoco tiene todavía una demostración causal completa de las 19 familias, la composición global entre programas ni la admisión pública de cualquier entrada. Los candidatos anteriores de esas áreas se conservan como antecedentes; no se han completado después de tu cambio de alcance.

Los cuatro indicadores globales siguen en `false`: `siteClosed`, `admissionClosed`, `wiringAllowed` y `completeRuleAcceptance`. **El cierre local condicionado de esta entrega no activa esos indicadores.** No se ha desplegado ni rediseñado la aplicación.

## Calidad y costes que siguen visibles

En los bytes finales de producto pasan los tipos principal/vendor y el lint global de R65, con las 16 reglas anti-slop a error. ESLint conserva 16 avisos. Los fallos previos y sus correcciones están preservados; no se atribuye a un pase anterior la validación de una edición posterior. [Comprobaciones finales](correcciones/push-explicitos-r65/validacion-final.json).

Esto no equivale a tipado estricto de todos los MJS. El host estricto del último lote registró **1.302 diagnósticos checkJs, 232 en archivos nuevos**. No se comparan con recuentos de hosts menos estrictos. El Ajv propio de la revisión de escalas se canceló antes de ejecutarse: sus 36 testigos no tienen ese pase nuevo, aunque los 50 testigos recibidos mantienen su validación estricta previa. Son límites declarados, no comprobaciones que se dan por hechas.

El coste principal de la arquitectura es mantener el motor y una semántica documental finita, con testigos vinculados al software. Cuando cambia ese software hay que revisar compatibilidad o generar testigos nuevos, conservando los históricos. La [decisión de cierre D137](DECISIONES.md#d137--cerrar-el-encargo-acotado-sin-promover-garantías-globales) conserva esta objeción y evita presentar pruebas finitas como garantía universal.

## Trabajo posterior y estimación

**No se ha iniciado este trabajo adicional.** Las horas siguientes son esfuerzo técnico acumulado orientativo, incluida revisión y recepción; no son tiempo de reloj de agentes en paralelo ni un compromiso de terminar en ese plazo. Una ronda significa implementación y una revisión independiente; otra corrección solo se justifica por un defecto reproducido. El alcance supuesto sigue siendo el perfil técnico acotado actual.

| Trabajo pendiente | Qué falta | Rondas orientativas | Horas de esfuerzo |
| --- | --- | ---: | ---: |
| 19 familias de actividad | Propiedades y productores por instancia, colecciones, selección, etapas y transporte; desbloquear sus variantes dependientes. | 2–4 lotes | **32–64 h** |
| Composición global | Unir los recorridos y familias en una evidencia común, con identidad, unidades, selección y obligaciones transitivas entre programas. Los puertos aislados no bastan. | 1–3 | **16–40 h** |
| Admisión | Completar y contrastar condiciones evaluables por propiedad e instancia, errores, selectores, hechos/derechos y propagación anual; utilizar el codec corregido sin confundirlo con admisión suficiente. | 2–4 | **24–64 h** |
| Activación técnica de las puertas | Derivar estados a partir de obligaciones completas, rechazo ante falta de evidencia, compatibilidad histórica y conexión pública controlada. Depende de las tres filas anteriores. | 1–2 | **8–24 h adicionales** |
| Aceptación fiscal de reglas completas | Resolver las reservas jurídicas y de autenticidad por regla, año, territorio y perfil, con revisión independiente. No es cambiar un booleano. | Sin número total defendible | **80–200 h para una primera fase de cierre acotada; sin cota total defendible para todo 2012–2026** |

La estimación de familias recoge el rango del autor y revisor final —20–40 h de implementación y 12–24 h de revisión—; no existe presupuesto individual auditado de las 19. Composición, admisión y activación son estimaciones del orquestador sobre los pendientes conservados, con incertidumbre alta. El rango fiscal es una provisión de planificación, no una promesa de aceptación: documentos ausentes, conflictos normativos o autenticidad no resuelta pueden impedirla incluso después de esas horas. No conviene sumar estas filas para prometer una fecha de publicación.

Aparte, endurecer el tipado del último lote MJS y sus fronteras tiene una orientación previa de **12–24 h**, sin cubrir por ello toda la deuda de 1.302 diagnósticos. No se absorbió silenciosamente en el cierre ni se desactivaron reglas para ocultarla.

## Respaldo y conservación

El código, informes y evidencias seleccionadas se respaldan únicamente en `origin/procedencia-documental`. Los hashes de la recepción y del commit de cierre se registran en [el expediente final](correcciones/cierre-r66/INFORME.md). Una clonación Git no contiene por sí sola todos los originales grandes: necesita restaurar el CAS local y configurar su ubicación.

Victus conserva el paquete **V5 r2, corte R26**, y su restauración fuera de T3, en `/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v5-r2-2b15925970d4/`. Su manifiesto es `2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88`: 1.447 objetos, 18.146 archivos físicos y 2.169.593.524 bytes por copia, incluyendo auxiliares. Se mantiene el corte, sus reservas de selección/privacidad y las recepciones posteriores por separado; **no es una copia actualizada a R66**. [Recibo de preservación](correcciones/recepcion-r26-r28/preservacion-v5.json).

**Crossa conserva V1 y está desfasado.** Es la copia comunicada por el coordinador en `/home/bigweld/Backups/IRoboPF/corpus-2026-10-29-manifest-2df6c208/`, manifiesto `2df6c208eed389614e678c9009ccf463b00f3bfed9cf098876ce7d9329f593fb`. Se informó de 709 archivos y 980.219.072 bytes, con los 708 objetos cotejados por SHA-256, sin ejecutar `preservacion.py verify`. No se atribuye al padre una nueva verificación en destino. Es otra máquina del mismo dueño y casa: copia local fuera de Victus, sin custodia independiente ni respaldo remoto acreditado del corpus. [Registro de Crossa](preservacion/copia-crossa.json).

No se ha usado LFS, autorizado gasto, transferido un paquete nuevo ni hecho limpieza. Los worktrees, paquetes, contexto y originales se conservan. No se modifica `main`, no se abre PR ni se despliega.

## Commits clave

| Commit | Hito |
| --- | --- |
| `5799bb03826719a4dd3500a962e2d6bb5124fdca` | Publicación documental verificable y reconciliación de inflación. |
| `b40b0fa35683cf7cfdc8144ff2b6ef4082f3e623` | Contraste de incorporación local de los 264 enlaces y recuperación. |
| `4f4de8cac1b0bc75c0da654e4b0ec051df6c074b` | Cierre condicionado de las once salidas SS. |
| `e8eff9ec7cea9e016d291f312f1e6ec2d414a03a` | Cierre condicionado de retenciones y pagos. |
| `adcaaa4bd93f90b0a3dc3f589cf8a5070a0f3652` | Cierre condicionado de las diez rentas generales. |
| `1b0676b83dd3be448484c8167ebd1e308dacae30` | Implementación causal de los 28 sitios de escalas. |
| `581a7a340894a0587cb3086aff26cfccc1777fef` | Contraste y cierre condicionado de esos 28 sitios. |
| `cd41524b432c5d4c2a7f665603debef6be5abc28` | Integración de los diez explícitos finales, pendiente entonces de revisión. |
| `a8c7ebec1985beaf2d0f7f0125b68dec7bf4a15b` | Reparación de `push`, retorno e historia causal tras el defecto reproducido. |

El historial detallado permanece en [ESTADO.md](ESTADO.md). Sus entradas anteriores describen el momento en que se escribieron; esta cabecera de cierre y los dictámenes finales prevalecen para conocer qué terminó y qué permanece fuera del alcance.
