# Contrarrevisión de retenciones 2020–2026

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Decisión individual sobre los veinte candidatos en `revisiones.json`: doce aceptados **solo en el alcance indicado**, siete necesitan evidencia y uno rechazado. Aceptar un defecto de implementación no certifica su regla sustitutiva ni un ejercicio completo. No se modifica motor, informes históricos, ESTADO, DECISIONES, inventario ni VCS. Base indicada por el encargo: d9ff49c7; los hashes del motor efectivamente leído están en `motor-examinado.json` porque el checkout es compartido.

Las decisiones locales conservan objeción, motivo y coste dentro de cada registro. La principal reserva ante una aceptación amplia es que una tabla correcta, una extracción reproducible y una salida aritmética correcta acreditan cosas distintas de la vigencia, elegibilidad y cumplimiento del procedimiento.

## Defectos reproducidos en el servicio real

`casos.ts` importa la función pública TypeScript, que proporciona la capa real de RetencionTrabajoAeat. Ejecuta secuencialmente 25 entradas completas, sin sustituir funciones privadas, sin mocks y sin copiar el cálculo del autor. `ejecucion-ts.json` conserva entradas, Exit y rastro. En JSON los NaN se serializan como null; `nonFinite` conserva expresamente qué campos eran NaN. Los diez expected se recalcularon con Decimal en un script independiente, conservando base, reducción, mínimo, cuota limitada, tipo truncado e importe.

- RET20-001: para 18.000 y cotización suministrada 1.143, edad40, situación3, sin familiares, el servicio da 1.047,60 en 2020–2023. Expected: 1.719 en 2020–2022; 1.141,20 en la versión desde febrero2023. En 2024–2026 de cierre da 912,60, control coincidente. No se afirma que 1.143 sea la cotización legal de todos esos años.
- RET20-002: 400.000 con cotización0 sintética da 170.880 en2020; expected168.920. El mismo caso2021 coincide con170.880. Se aísla el tramo alto; falta prueba integrada con cotización legal.
- RET20-004: 22.000,01, situación2, dos hijos de10 y12 años elegibles por mitad, cónyuge elegible, cotización0. Base20.000,01; mínimo8.100; RED20=0. Cuota sin límite2.638,5024; tipo truncado11,99; importe2.637,80. El servicio mantiene indebidamente el límite43 y da1.876,60. Controles22.000 y21.999,99 conservan1.876,60. No hay fundamento para suavizar el salto.
- RET20-008: hijo25 sin discapacidad produce el mismo mínimo y retención que hijo24. Convivencia0 devuelve Success con NaN, mientras convivencia1 da resultado finito. Reducciones irregulares superiores a90.000 o al30% se aceptan. El algoritmo2020 p.5 incluye límites explícitos; estos son fallos de validación, no licencia para inventar requisitos del contribuyente.
- RET20-015: se ejecutó selector con fechas31enero/1febrero2023, fecha inválida y fecha de2022 con ejercicio2023. El fallback no constituye prueba de vigencia.

No se ejecutaron regularizaciones, fechas/opciones del pagador en el servicio, artistas fechados o La Palma como territorio propio: el contrato carece de esas entradas. Los controles de mínimos generales, inferior a un año y especial sí se ejecutaron; no prueban la clasificación jurídica de artistas. No se ejecutó Excel: las cifras históricas del autor se conservan, pero no se convierten en oracle independiente en esta revisión. La cuota limitada de1.720 en el ejemplo2020 es diferente del importe1.719 después de truncar9,55%; comparar columnas con nombres parecidos ocultaría esa diferencia.

## Originales, cronología y límites

Se verifican bytes SHA-256/SHA-512 y tamaños de los47 registros de adquisición, con46 hashes únicos. El texto se reextrae desde originales PDF, no desde Markdown. Los resultados están en `comprobaciones-hashes.json`, `comprobaciones-citas.json` y `citas-refinadas.json`. La extracción final usa coordenadas sin rotación y `get_text(clip=...)`, retirando únicamente su salto de línea terminal antes de comparar y conservando los demás caracteres. La primera comparación conservaba ese salto y detectó diferencias metodológicas en todas las citas; no se interpretaron como documentos falsos. Se intentó también `TextPage.extractTextbox`, pero se interrumpieron las ejecuciones por su coste antes de disponer de resultado completo. Las citas siguen siendo evidencia material, no certificación fiscal. No se validaron firmas PAdES, CSV ni confianza histórica.

RD31/2023, BOE-A-2023-2023, pp.2–4: publicación25enero, entrada al día siguiente. Se acepta26enero para la reforma del mínimo de artistas; no1enero por una nota general. Las excepciones de penados y relaciones especiales con discapacidad impiden tratar toda relación especial como15%. No se ha añadido una clasificación nueva al motor.

RDL4/2024, BOE-A-2024-12944, pp.24–25: distingue deducción anual2024 de retenciones a partir de su entrada en vigor. Notas AEAT de27junio ratifican28junio y opción del pagador de regularizar en julio; la nota de febrero también conserva opción de marzo. Referencias a La Palma en algoritmos anteriores no prueban habilitación desde enero. Se acepta esa delimitación; no se declara que todos los pasajes residuales sean una errata jurídica demostrada.

STS1219/2020: búsqueda por número, recurso1735/2019, ROJ3175/2020 y Cendoj28079130022020100472. El portal oficial Poder Judicial respondió403 a la apertura mediante web. El manual AEAT2025 atribuye el criterio a la sentencia, pero **no se recuperó la sentencia primaria**. No se acepta por ello el alcance temporal completo de la regularización proporcional, especialmente2020. Las reproducciones editoriales localizadas no sustituyen al original judicial.

PDF2026 anterior: el índice del buscador todavía titula la URL oficial como versión26.12.2025, pero ese título no prueba bytes. Se descargó con helperv2 el host oficial alternativo www3.agenciatributaria.gob.es, autorizado explícitamente tras comprobarlo en el índice oficial. Devuelve también a15b7fee871d… (1.048.046 bytes), no affd1cf389f6…. `adquisicion-2026-www3.json` conserva adquisición y hash. El original anterior permanece pendiente. No se aceptó vigencia por URL, título del buscador ni transcripción.

## Cobertura examinada y aceptación

Se recorren las533 relaciones paso/versión, las117 celdas, las77 filas de escala y las416 ramas de regularización, comprobando sus referencias a citas reextraídas. Ese recorrido **no es una aceptación semántica exhaustiva** de1.143 reglas. Las117 celdas se comparan además con el catálogo TS ejecutado por fecha (`contraste-117-celdas.json`); coinciden las117, pero el servicio inicial no pasa esa fecha. Los77 registros incluyen la escala2020 distinta y las posteriores; la prueba alta discrimina el efecto monetario de usar47% en2020. Las416 ramas no tienen ejecución equivalente en el contrato examinado. La lectura sustantiva completa de todas las combinaciones y cadenas históricas permanece abierta; no se oculta con un porcentaje de cobertura.

Las imágenes `visual-*.png` conservan facsímiles a90DPI y sus hashes/parámetros están en `visuales*.json`. La inspección visual distingue las celdas vacías, cuotas acumuladas, tipos y anotaciones en rojo; el texto extraído no acredita por sí solo tachados o texto reemplazado. No se renderizaron manuales enteros.

## Reproducción y costes

Consultar `comandos.md`. Effect-solutions list/show basics/testing y fuente localv4 de runPromiseExit consultados antes del ejecutor. Lint anti-slop y ESLint se aplican al ejecutor; typecheck usa configuración que hereda las reglas del proyecto y desactiva solo el archivo incremental para no escribir fuera del ámbito. Render y typecheck se serializan con flock. Sin Next build, suites legacy, instalación global ni regeneración de inventario.

Objeción: una entrega con pendientes no satisface una certificación completa. Motivo: no elevar inferencias o fallos de contrato a aceptación legal. Coste: quedan siete IDs en needs-evidence y límites explícitos dentro de los doce aceptados. Las siguientes acciones están individualizadas; el integrador debe conservar el alcance y la historia y crear pruebas rojas antes de cualquier fix.

## Rectificación por inspección visual: RET20-018

Se rechaza la inferencia documental de contradicción basada en el texto extraído: en enero2024 p32, «y La Palma» aparece expresamente tachado en azul. Ese pasaje no es una habilitación operativa residual. El hallazgo original se conserva intacto; la decisión nueva exige reformularlo y no generaliza la observación a todas las referencias sin verlas. Se mantiene el resultado normativo28junio/opciónjulio del BOE.

En2026 enero–9septiembre p41, «FIJADO JUDICIALMENTE» está tachado en rojo en ANUALIDADES; también JUDICIALMENTE en CAUSA4. La versión desde10septiembre p41 deja el texto referido al art7.k. Por tanto, el corpus debe conservar por separado texto literal y estado visual; igualdad de extracción no prueba texto operativo. RET20-010 sigue pendiente de contrato e incompatibilidades por hijo.

El cotejo de las77 filas (`contraste-77-filas.json`) localiza todas las celdas en su cita y encuentra76 filas iguales al código fijo; la última fila de2020 es distinta porque su45% continúa sin el tramo posterior47%. No se confunde esta comprobación con ejecutar cada límite de tramo. `revision-533-pasos.json` y `revision-416-ramas.json` individualizan alcance y pendientes; la repetición anual de una ausencia no se suma como reglas aceptadas distintas.

Al cierre, los tres archivos de retenciones leídos conservan sus hashes y `git diff d9ff49c7 -- <esas tres rutas>` no muestra diferencias. Esta observación se limita a esas rutas: otros agentes trabajan en el checkout y no se afirma que todo el árbol esté sin cambios. No se realizaron operaciones VCS mutantes ni se repararon índices.

## Resultado de verificación de citas, sin equivalencias implícitas

La reextracción alternativa de14.203 citas da7.124 igualdades exactas y7.079 diferencias. Un diagnóstico separado que elimina espacios coincide en10.679 casos; por tanto3.524 diferencias no se explican solo por espacios. No se atribuye corrupción al original, ni se acepta el texto por normalización: queda por resolver la diferencia entre selección de caracteres por caja de ambas APIs. Los hashes de los originales sí coinciden. **No se declara validación textual exacta completa de las14.203 citas.**

Se ejecutó además la API original `TextPage.extractTextbox` para las194 citas de tablas:117 celdas y77 filas. Las194 coinciden exactamente (`tablas-extraccion-exacta.json`), sin normalizar espacios ni cifras. Este control es distinto de comparar sus números con el motor. Los scripts conservan ambas recetas y sus resultados; el verificador general alternativo no es un sustituto silencioso del original.

Las117 celdas de exclusión incluyen104 cuantías y13 celdas sin umbral para situación1/sin descendientes; estas últimas son null, no cero. El contrato rechaza ese perfil. La coincidencia del catálogo no habilita seleccionar una tabla de cierre para un pago anterior a una reforma.

La comprobación exacta adicional de las2.682 citas enlazadas por los veinte hallazgos termina con2.682 coincidencias, sin normalización (`hallazgos-extraccion-exacta.json`). Esto sí verifica su reproducción con la API original; no elimina las diferencias registradas en el recorrido alternativo ni valida el estilo visual o la interpretación fiscal. Se completó después el subconjunto restante de matrices:776 citas adicionales, todas exactas (`matrices-extraccion-exacta.json`). `cobertura-citas-exactas.json` confirma que todas las referencias de las533 relaciones y416 ramas están cubiertas por la comprobación exacta. No equivale a aceptar su interpretación jurídica.
