# Estado de la auditoría documental

Inicio: 29 de octubre de 2026. Trabajo en curso; no es una certificación fiscal.

## Encargo y límites

Auditar todos los parámetros y pasos de IRPF, cotizaciones, retenciones e IPC de 2012–2026 contra fuentes primarias oficiales. Inventariar también las lagunas de cobertura territorial y material. Construir corpus por contenido, citas con coordenadas y facsímiles reproducibles, verificador, contratos de páginas y enlaces desde los rastros. Sin rediseño, despliegue, PR ni modificaciones de producción.

Se trabaja con Jujutsu en `procedencia-documental`, nacida de `main` local (`955a7ece`). El hilo previo solo dejó un cambio vacío (`db6c3ba5`), sin implementación que recuperar. Se respalda exclusivamente este bookmark en origin.

## Secuencia de trabajo

1. Leer contexto, preparar anti-slop y fijar contrato del inventario.
2. Abrir auditorías independientes por dominio y período. Descargar originales y registrar discrepancias candidatas.
3. Diseñar e implementar corpus, verificación de autenticidad, citas y facsímiles; ADR de arquitectura.
4. Contrarrevisar cada hallazgo con un auditor independiente. Los errores confirmados se corrigen después de una prueba que falle.
5. Integrar evidencia, documentación española por elemento y enlaces desde el motor. Ampliar deducciones cuando haya evidencia y pruebas; evaluar actividades económicas como dominio propio.
6. Comparar con Python y Excel, ejecutar verificadores y comprobaciones del proyecto. Revisión adversarial final por agentes nuevos.
7. Resumen final con cobertura medida y pendientes explícitos, respaldo remoto y limpieza autorizada de copias temporales.

## Estado actual

- BRIEF leído íntegro; README, instrucciones, producto, ADR y glosario fiscal revisados.
- GLOSSARY, documentación extensa, notas arquitectónicas y motor: lectura por ámbitos pendiente de completar.
- Configuración del orquestador comprobada: gpt-6-astra, xhigh, priority. Hijos: gpt-6-astra, high, priority, mediante T3.
- Herramientas faltantes se habilitan con Nix; ninguna instalación global.
- Anti-slop instalado: 16 reglas a error. La deuda inicial de 96 errores fue corregida, contrarrevisada e integrada; lint global y tipos pasan. Véase [LINT-CORRECCION.md](LINT-CORRECCION.md).
- Primera ronda documental en recepción, con identificadores en delegaciones.json. Inventario y corpus requieren correcciones técnicas antes de su integración. Hay 14 requisitos de capacidad contrarrevisados; la primera corrección fiscal aceptada de alcance limitado es el límite de Madrid 2020, detallada abajo.

## Criterios de aceptación

- Coincidencia con una transcripción Markdown o con el oracle legacy no acredita legalidad.
- Toda afirmación aceptada requiere fuente primaria y segunda revisión independiente identificada.
- Distinguir dato observado, proyección, simplificación legacy, supuesto de escenario y regla legal vigente. No atribuir carácter oficial a un ejercicio todavía incompleto.
- Una cita sin original, hash, coordenadas, texto verificable y facsímil permanece incompleta.
- Registrar cobertura por año, territorio, dominio y estado; no esconder lo pendiente detrás de un porcentaje agregado.
- No añadir datos personales de terceros ni copiar las notas privadas al repositorio.

## Recursos y coordinación

Máquina con 11 GB de RAM y sin swap. Máximo tres trabajos pesados simultáneos; comprobar memoria antes de cada lote. Un solo build completo a la vez. Hijos editores simultáneos en checkouts aislados gestionados por T3; integración por el orquestador. Ningún hijo abre PR, despliega o empuja a main.

Las finalizaciones de T3 reactivan el hilo. Una espera entre lotes no significa que el encargo haya terminado. El registro de delegaciones se mantendrá en esta carpeta.

## Preguntas y decisiones pendientes

No hace falta respuesta para empezar. Se documentarán decisiones y alternativas descartadas en DECISIONES.md. No se amplía artificialmente la cobertura fiscal antes de acreditar las reglas existentes.

## Limpieza

Todavía no se ha eliminado ninguna copia temporal. La eliminación de `/home/elies/irobopf-contexto/` y `/home/elies/Repos/Reactivity/` solo procede después del resumen final y su respaldo remoto, según el encargo. Conservar el repositorio local de Effect.

## Incidencia de índice en un checkout delegado

Elies avisó de 239 borrados en el índice Git de `t3-3d3cd9a7`. La inspección del orquestador confirma 239 archivos y 174.516 líneas marcados como borrados en el índice; el diff de commits contra la base `d4d708f6` está vacío. No se ha integrado ninguna entrega de código de esta ronda. Se ha enviado la corrección a los 18 delegados, con entrega confirmada por T3: no inicializar JJ dentro de checkouts Git de T3, no hacer commits con el índice anómalo y continuar editando sin mutaciones VCS. La regla queda en COORDINACION.md y en las instrucciones de futuras delegaciones. Se inspeccionará cada diff y cada borrado antes de integrar. No se ha ejecutado ningún reset ni borrado para reparar esta incidencia.

Comprobación de disco: los tres checkouts conservan los 239 archivos de la base, sin ausencias. Los índices de `t3-5be43c93` y `t3-bddec546` contienen los 239 archivos y no tienen borrados preparados. Los tres árboles comprometidos siguen iguales a la base; sus ediciones aún en disco deberán compararse aparte al entregar. La corrección operativa y el registro de delegaciones quedaron respaldados en origin en `43b5ac34`.

## Entrega de corrección de lint: integrada tras contrarrevisión

El delegado entregó un parche de 29 archivos contra `d4d708f6`, sin commit. El orquestador cotejó los hashes de cada archivo original, entregado y actual del padre: 29 comprobaciones correctas, cero borrados y cero conflictos con cambios del padre. El parche y manifiesto se conservan en `entregas/` para no depender de `/tmp` ni del índice anómalo.

Según la ejecución del delegado: lint sin diagnósticos, typecheck y ensayo anti-slop correctos; suite ampliada 177 pruebas correctas y una omitida; suite CI cinco correctas. La revisión independiente de preservación de comportamiento, contratos de entrada, fixtures y adaptadores se recibió y la integración se describe a continuación. La revisión fiscal continúa separadamente.

Actualización: contrarrevisión independiente aprobable, sin P1/P2 demostrados, con 29 hashes y parche verificados, upstream contrastado, lint/typecheck y 19 pruebas focalizadas correctos. El orquestador integró selectivamente los 29 archivos, sin copiar metadatos VCS. Conservó además el rechazo runtime previo de cotizaciones/contrato/situación laboral malformados mediante `Match.number`/`Match.string`: una prueba nueva falló primero con defecto Decimal ante null, antes de restaurar los predicados. No es una corrección de cuantías fiscales. El payload gráfico queda restringido a las propiedades propias de sus productores actuales, según revisión documentada.

Validación posterior en el padre: lint y typecheck de aplicación/vendor correctos, 16 reglas a error confirmadas por el ensayo, 20 pruebas focalizadas correctas. Cero diagnósticos en fuentes mantenidas. La caché temporal de auditores queda fuera del proyecto comprobado, según D010.

## Inventario, corpus y escalas 2017–2021 recibidos

Inventario: 350 archivos, 94.635.059 bytes, máximo individual 3.675.420; hashes comprobados y cero archivos de base ausentes. Sus 47.713 elementos suman capas sintácticas, efectivas y seleccionadas con solapamientos: no son 47.713 parámetros fiscales distintos ni aceptados. Quedan 25.090 unidades por interpretar y otras lagunas explícitas. Se encarga revisión del extractor, IDs, cobertura, tamaño y relación con el código actual antes de integrar.

Corpus: 21 archivos, 1.407.417 bytes, máximo individual 1.175.521; hashes comprobados, cero archivos de base ausentes. Solo modifica el helper existente; restantes rutas nuevas. Falta contrarrevisión de adquisición, autenticidad, coordenadas, facsímiles y bindings, incluida la conexión real con valores del motor. Los ejemplos no constituyen validación fiscal. El helper del padre ya omite cabeceras de sesión; preservar esa mejora al integrar.

Escalas autonómicas 2017–2021: 95 candidatos (60 match, dos mismatch, 32 ambiguous, uno missing), 582 filas y 90 entradas año-territorio. Pendientes de contrarrevisión. Madrid 2020 y la etiqueta fija de ejercicio son candidatos concretos, aún sin fix. La cadena de normas originales/vigencias está incompleta y debe completarse antes de aceptación jurídica. Se han omitido tres campos de cabeceras de sesión en los JSON publicables de esta entrega, conservando hashes y originales documentales.

## Necesidades expertas: primera entrega documental

Recibidos 16 candidatos de capacidad: 11 carencias y cinco ambigüedades. El orquestador comprobó hashes SHA-256/SHA-512 y tamaños de los seis originales referenciados. Ningún candidato se acepta todavía; se encarga contrarrevisión de los 16 requisitos, la comprobación pública de posts/artículo, las citas y la lectura del motor.

La diferencia reproducida para el ejemplo de 18.000 € compara parametrizaciones ilustrativas, no acredita una deuda tributaria: no se utilizará para corregir el motor sin contraste normativo. Las carencias de actividad económica se investigarán como una vertical distinta del salario; primera investigación delimitada a estimación directa simplificada de 2025, sin prometer cobertura de RETA ni de otros regímenes antes de acreditarlos.

Contrarrevisión recibida: 14 hallazgos de capacidad aceptables dentro del alcance revisado; NE-01 y NE-13 requieren evidencia adicional. No son 14 reglas fiscales validadas. El revisor confirma ocho extracciones y pide ampliar cuatro pasajes antes de usarlos como fundamento sustantivo. De los diez posts contrastados, tres textos completos y siete prefijos: no se presentará esa comprobación como autenticación del texto completo de todos los posts. Véase `revisiones/necesidades-expertas/`.

## Recepción documental y contrarrevisión

Diez ámbitos adicionales entregan 736 registros candidatos, con solapamientos: arquitectura, escalas estatales/ahorro, autonómicas 2012–2016 y 2022–2026, retenciones 2012–2019, capital/ganancias, los dos grupos de deducciones, IPC/redondeos y actividades económicas 2025. No son 736 errores ni reglas aceptadas. Sus informes y matrices conservan expresamente las lagunas normativas y de ejecución. Hay diez revisiones independientes nuevas en marcha, una por ámbito, con respuesta individual por identificador; registro en `delegaciones-ronda3.json`.

Recepción del orquestador en `recepciones-ronda3.json`: JSON parseables, hashes y tamaños contrastados contra los archivos locales de cada referencia; seis campos de cabeceras de sesión omitidos en arquitectura y autonómicas 2022–2026. Ningún original documental referenciado falló la comprobación. Sí cambió `app/layout.tsx` respecto de la instantánea arquitectónica, por la integración de lint: se conserva la instantánea y se exige revisión del código actual, sin alterar el hash histórico para ocultar la diferencia. Este control no verifica firmas, semántica ni coordenadas.

Prioridades candidatas: parámetros de retención recientes aplicados retrospectivamente; pérdidas tratadas como exenciones negativas; mínimos estatal/autonómico del ahorro mezclados; cuotas fijas legales perdidas al integrar solo tipos; aplicación de deducciones manuales presentada como cálculo de requisitos. Murcia 2022 requiere descartar correcciones de errores antes de aceptar su diferencia de 90,83 euros. Los revisores deben distinguir cada alcance y ejecutar los casos discriminantes.

Actividades económicas: investigación limitada a servicios profesionales en estimación directa simplificada 2025, con 16 candidatos. No se ha prometido cobertura general de autónomos ni conectado una cuota RETA simulada. La incorporación depende de contrarrevisión y del contrato de integración de rendimientos/pérdidas.

Corpus: la revisión independiente requiere cambios por ocho hallazgos. Bloqueos principales: una atestación autocontenida permite declarar aceptación sin leer el inventario; la entrega perdería el saneamiento de cabeceras del padre. También debe corregirse origen de caché, signo Unicode, esquemas, escritura atómica de PNG, entorno reproducible y compatibilidad de hosts oficiales. No se integra esa aceptación ni se publica el parche privado. La adquisición y extracción aprovechables se incorporarán después de corregir estos puntos, sin convertir integridad en certificación fiscal.

Inventario: revisión independiente recibida con cuatro bloqueos técnicos. El validador acepta alteraciones y omisiones si se recalculan sus propios hashes; los IDs posicionales pueden cambiar de significado; flatten puede omitir valores por su identificación del tipo; la clasificación de operaciones confunde algunas fórmulas, condiciones y redondeos. La muestra independiente de 411 hojas coincide y pasan las ocho pruebas originales, pero eso no resuelve esos defectos. Se corregirá antes de regenerar desde el padre integrado. No se publican los 47.713 IDs como conceptos fiscales permanentes.

## Primeras correcciones tras contrarrevisión fiscal

La revisión de autonómicas 2017–2021 cubre los 95 IDs y 582 filas con extracción independiente. Cinco hallazgos aceptados con alcance limitado; las 90 escalas completas siguen pendientes de cadena y política de cuotas. Sus estados se enlazan en los candidatos originales, sin convertir la aceptación parcial en validación global.

`AUT1721-MADRID-2020-LIMITE`: límite corregido de 53.407,29 a 53.407,20 euros, conforme a Ley 6/2018, BOCM-20181228-1, PDF p. 4. El manual AEAT 2020 contiene la cifra contradictoria. La contrarrevisión examinó vigencia y corrección de errores; el orquestador releyó la tabla original. Prueba nueva fallida primero: cuota de 7.395,82 frente a 7.395,83 esperada para base 53.407,29. Tras cambiar el límite pasa. La referencia del dato apunta al original BOCM. No resuelve por sí solo las diferencias de cuotas fijas de todas las escalas.

`AUT1721-RASTRO-ANIO`: sustituida la explicación fija «2025» por el ejercicio seleccionado. Una prueba con 2020 falló antes del cambio. No se ha confundido el texto incorrecto con una selección global de tabla equivocada.

Después de ambos cambios: 80 pruebas de comunidades y liquidación correctas; lint global y typecheck correctos. Informe y registro reproducible en `correcciones/madrid-2020.md`. Sigue pendiente el enlace a snapshot, cita y facsímil definitivos del nuevo corpus. Corrección respaldada en origin en `fe876680`; recepción documental anterior en `4109c4fe`.

## Inventario corregido y nueva recepción

Se incorporan las fuentes del extractor después de cotejar sus hashes contra la entrega, sin copiar metadatos VCS ni las páginas antiguas. Se corrigen los cuatro bloqueos técnicos: reconstrucción contra fuentes actuales, IDs de ocurrencias versionadas, recorrido de valores explícito y clasificación estructural. Cuatro pruebas fallaron antes del cambio. La suite final tiene 14 pruebas correctas, incluido un artefacto adulterado con todos sus hashes recalculados que la reconstrucción rechaza. JSON Schema, reconstrucción completa, lint, typecheck y Ruff pasan. Falta una nueva contrarrevisión de la corrección; no es cierre de semántica fiscal.

Nuevo inventario: 47.794 ocurrencias técnicas con solapamientos, 351 fichas y 288 sondeos; todas pendientes de interpretación. El manifiesto `inventario.json` fija un artefacto gzip de 8,21 MB que conserva 341 archivos JSON. Índice mínimo ID/página, generación en temporal exclusivo y comparación de conjuntos completos. No se reutilizan los IDs de la entrega inicial como conceptos fiscales estables. Véase `INVENTARIO.md` y D013 para límites, comandos y costes.

Recibidas las diez contrarrevisiones de la ronda 3. Se conservan sus decisiones individuales, pero el orquestador aún debe leer e integrar sus conclusiones y contratos antes de aplicar más cambios fiscales. Las aceptaciones acotadas no se sumarán como reglas completas ni se propagarán a toda una escala o deducción.

Recibidas también Seguridad Social (108 candidatos), cadena autonómica A (33) y cadena B (9). Se preparan revisiones nuevas de esos tres ámbitos. Los candidatos incluyen la doble base máxima de 2018, reparto de solidaridad por pagador, vigencias territoriales y reforma extremeña de 2026; no se modifica cálculo por esta recepción. `recepciones-ronda4.json` documenta el control mecánico de archivos y fuentes, separado de aceptación fiscal.

Se incorpora después la cadena C: 92 candidatos, 90 pares año-territorio, reforma valenciana de 2026 y nuevos eslabones para Murcia 2022 y Valencia 2014. Recepción mecánica: 133 referencias locales con hashes y tamaños correctos, sin cabeceras de sesión; véase `recepcion-cadena-c.json`. Su revisión independiente se incluye en la siguiente ronda. La corrección técnica del inventario y las diez revisiones recibidas quedaron respaldadas en `4a41ce0c`.

Ronda 4 activada: cinco revisores nuevos para Seguridad Social, las tres cadenas territoriales y el inventario corregido. La revisión del inventario usa un checkout aislado preparado por T3, sin inicialización JJ y sin mutaciones VCS, para fijar el código examinado. Los otros informes ocupan carpetas compartidas exclusivas. Registro en `delegaciones-ronda4.json`. El siguiente trabajo del orquestador es integrar las diez revisiones recibidas y corregir el corpus, sin perder el alcance limitado de cada aceptación.

## Bootstrap anti-slop completado

Runtime v0.1.2 verificado, incorporado con licencia y hashes, 16 reglas a error y oxlint 1.78.0 junto a ESLint. CI nueva con límite de 15 minutos y ejecución secuencial, sin build ni suite legacy pesada. Typecheck, humo del plugin y 5 pruebas seleccionadas pasan; ESLint pasa. Lint global falla con 96 errores preexistentes en 25 archivos, registrados en [LINT.md](LINT.md) y `lint/`. No se modificó el motor ni se validó cifra fiscal alguna. Auditoría documental desbloqueada; corrección de deuda pendiente de reparto por archivo. Integración y respaldo corresponden al orquestador. No se borró contexto ni Reactivity.

El orquestador revisó la configuración y volvió a ejecutar `test:lint`: correcto. Bootstrap y coordinación respaldados en `origin/procedencia-documental` (885e16c7). Se probó la adquisición del PDF consolidado BOE-A-2006-20764: HTTP 200, 1.175.521 bytes, SHA-256 `67c8af922fe823337e0130d589cf5d51b364720936fd0319009a4783a728b544`. Firma y vigencia histórica todavía sin validar. El original permanece fuera de Git en la caché de corpus.

## Integración de ganancias, corpus y segunda corrección del inventario

Recibidas las tres auditorías pendientes de primera ronda: mínimos (33 candidatos), trabajo/deducciones estatales (35) y retenciones 2020–2026 (20). Se conserva su carácter candidato y se prepara contrarrevisión individual. También están recibidas las cinco revisiones de ronda 4. La recepción mecánica de ocho carpetas, 135 archivos y 137 referencias documentales se registra en recepciones-ronda5.json: sin fallos de hashes/tamaños ni cabeceras sensibles detectadas. No constituye aceptación normativa.

CG-01/02/03 corregidos tras revisión independiente y prueba fallida: pérdidas computables conservadas, exención de inmuebles por ventana de adquisición y vitalicia desde 2015. Nueve fallos antes del cambio; después 71 pruebas de ganancias/liquidación correctas. Se conserva vivienda habitual en 2014 y se dejan pendientes compensaciones cruzadas, acumulados de vitalicias y requisitos no modelados. Véase correcciones/ganancias-patrimoniales.md.

Corpus integrado con correcciones COR-01–08 y 20 pruebas correctas, Ruff correcto y entorno Nix/uv fijado. La aceptación fiscal está deshabilitada, incluidos nombres/revisiones inventados. Integridad, binding y revisión se distinguen. Tres originales/recortes reales quedan como fixtures duraderos en Git, todos menores de 100 MB. El grueso del corpus aún requiere respaldo duradero y conexión con el inventario; no se declara publicado ni finalizado. Job CI propio de 15 minutos.

El inventario recibe tres correcciones nuevas tras contrarrevisión: generación en proceso nuevo, selección por rutas relativas y rechazo de prototipos personalizados/NaN. Pasan 16 pruebas, incluida precarga de módulo y modificación posterior de una copia de fuentes. Lint y typecheck globales correctos. Inventario regenerado: 47.789 ocurrencias técnicas con solapamientos, no reglas fiscales aceptadas. Todos los estados de interpretación siguen pendientes. ADR 0005 incorporado como decisión de diseño con puertas de implementación y publicación.

Siguiente fase: tres contrarrevisiones fiscales nuevas y construcción de contratos ejecutables de escalas, deducciones, contenidos versionados y actividad profesional 2025 acotada. El orquestador conserva las correcciones pequeñas, el puente de citas/inventario y la integración. Quedan pendientes muchas cadenas históricas y documentos de 2012–2013; no se ha concluido el encargo ni se han borrado las copias de contexto.

Ronda 5 activa: tres contrarrevisiones documentales (mínimos, trabajo y retenciones 2020–2026), cuatro implementaciones aisladas (escalas/ahorro, deducciones, contenidos y actividad profesional 2025) y una revisión técnica nueva del corpus/inventario/ganancias integrados. Ocho hijos nuevos gpt-6-astra high priority, sin mutaciones VCS ni inicialización JJ en worktrees Git. Trabajo pesado serializado mediante lock común. Los commits d049af31, 2e7aecf9 y d9ff49c7 quedaron respaldados en origin/procedencia-documental.

## Avance del 29 de octubre, 12:55 CET: trabajo, cotizaciones y enlace real

- Recibida la contrarrevisión de trabajo: 35 decisiones (32 aceptaciones acotadas, 3 pendientes), 20 archivos y 38 originales verificados de nuevo. Metadatos sin cabeceras nuevas que sanear. No certifica el contrato anual completo.
- Corregido el extremo TDE-18 con pruebas antes/después. El residuo histórico es +0,0028; el signo negativo en la prosa del autor/revisor era una errata. Los datos de ejecución conservaban el positivo.
- Nuevo perfil explícito de cotizaciones uniformes: cambio de agosto de 2018 y solidaridad 2025/2026 por pagador. 17 pruebas correctas, lint y typecheck correctos. Integración anual y rastro pendientes hasta recibir el archivo propiedad del hijo de escalas; no se anuncia como cálculo anual ya corregido.
- Inventario reconstruido: 20.069 elementos sintácticos, 16.100 valores efectivos y 11.727 seleccionados: **47.896 ocurrencias**, ninguna equiparada a regla jurídica aceptada.
- Puente real original→cita→inventario actual: Madrid 2020, límite 53.407,20. Original y PNG conservados, recorte inspeccionado, reextracción y comparación con motor correctas. Binding pendiente de revisión técnica nueva; certificado con confianza indeterminada. CI incorpora reconstrucción y pruebas adversariales del puente.
- El corpus en caché contiene aproximadamente 1,025 GB repartidos en 739 hashes, ninguno mayor de 100 MB. Aún hay que resolver y ensayar su respaldo duradero completo: los fixtures ya versionados no cubren todos los originales. No se borra la caché ni el contexto.
- Siguen activas las implementaciones de escalas/ahorro, deducciones, contenidos y actividades económicas, las últimas contrarrevisiones y la revisión técnica de integración. El encargo sigue abierto.

## Avance del 29 de octubre, 13:10 CET: integración de la ronda de implementación

Cuatro entregas integradas por archivos después de comprobar base, presencia, hashes y ausencia de colisiones/borrados. La primera comprobación conjunta pasó 220 pruebas de motor y 14 de contenido, con una pesada omitida; lint/typecheck correctos. Escalas y ahorro entran en liquidación; deducciones filtran ámbito, pero varios contratos nuevos siguen parciales. Actividades EDS 2025 aún requiere conexión anual; contenido aún requiere instrumentar el rastro. Véase INTEGRACION-R5.md.

El orquestador corrigió siete casos rojos de mínimos, dos de integración de SS y cinco de entradas de retenciones. El perfil canónico anual usa ahora cotizaciones uniformes revisadas y explica sus límites; compatible-legacy conserva la cotización anterior. Tras estos cambios pasan 86 pruebas solapadas con la suite anterior, una omitida, lint/typecheck. No se suman ambos recuentos.

Recibidas y conservadas las revisiones de mínimos (33 decisiones), retenciones 2020–2026 (20), integración técnica v3 y enlaces v1. El inventario y CG-01/02/03 resultan aprobables en alcance técnico acotado. Tres extensiones P2 del puente fueron reproducidas y corregidas personalmente: 22 pruebas corpus y 18 bridge pasan; nueva revisión pendiente. La atestación de Madrid solo sirve para el payload/snapshot que examinó el revisor.

Inventario integrado: 49.883 ocurrencias; contenido: 49.887 fichas incluyendo cuatro conceptos. Se preservan los cuatro snapshots anteriores y su inventario comprimido; el nuevo snapshot es 4919c9ec5fa20e858d5a4e99f53e7628c2a6e0a9e7852a44de34513de0b0763c. Ninguna de estas cifras equivale a reglas jurídicas cerradas. Siguen pendientes trabajo/deducciones anuales, retenciones históricas, conexiones de contratos, cierre normativo, respaldo integral y contrarrevisiones. No se ha desplegado, abierto PR ni iniciado limpieza final.

Ronda 7 iniciada: cinco revisiones independientes nuevas (escalas/mínimos/integración, deducciones, actividades, contenido y puente documental), dos implementaciones aisladas (contratos anuales de trabajo y retenciones por versión) y preservación del corpus. Las tareas, bases e identidades están en delegaciones-ronda7.json. No hay delegación de los pequeños fixes ya resueltos personalmente. El padre mantiene la integración anual y la instrumentación del rastro como trabajo propio pendiente.

## Avance del 29 de octubre: otras rentas y rastro instrumentado

Recibida la revisión enlaces-v2: las reproducciones ENV1-01/02/03 se rechazan. Nuevo ENV2-01 reproducido y corregido personalmente: U+FFFD impide el binding numérico sin modificar el original. Dos pruebas con cinco comprobaciones fallaban antes; pasan las 24 pruebas del corpus y las 18 del puente. Los 25 archivos de revisión conservan sus hashes. Su atestación candidata queda ligada al payload anterior; no se migra aceptación al reconstruir inventario.

TDE-09/10 corregidos en la función canónica y en el anual: saldo algebraico de otras rentas no exentas antes de compensaciones, con régimen histórico 2012–2014 conservado. Veinticinco pruebas propias y 85 con las regresiones seleccionadas pasan, sin sumar recuentos solapados. Los límites del alquiler simplificado y categorías todavía ausentes permanecen explícitos.

Instrumentados 49 puntos propios del rastro anual con identidad de código, instancia, decimal y unidad. Cada uno tiene ficha técnica y enlace versionado; las líneas internas de otros servicios aún no instrumentadas quedan pendientes. Se añade únicamente el enlace al texto existente. Inventario reconstruido: **49.958 ocurrencias**; fichas: **50.011**, contando cuatro conceptos y los 49 puntos nuevos. No son reglas jurídicas aceptadas. Snapshot actual: `9a38821d9d5ea6130e3e4019f40a0b7a3d6d57d6675f8e67643773ade14dfdec`. Véase RASTRO-INSTRUMENTADO.md.

El usuario ha restablecido el límite de uso y ha indicado continuar. No hay nuevo bloqueo ni reducción de alcance. Próximos trabajos del padre: recibir las entregas pendientes, integrar contratos, separar IPC observado/escenario y resolver contratos de redondeo, ampliar enlaces documentales y preservar el corpus. La exhaustividad fiscal, la autenticidad histórica y las puertas finales siguen abiertas. No se ha iniciado la limpieza.

Bloque integrado en c2894133f9b5. La comprobación final pasa 88 pruebas seleccionadas de motor/rastro, 15 de contenido, seis de rastro tras fijar por hash la versión de explicación, verificación del snapshot completo, lint y typecheck. Los recuentos se solapan. El puente reconstruye el inventario actual y verifica el binding numérico de Madrid, sin aceptación fiscal completa. Nueva contrarrevisión independiente abierta en delegaciones-ronda8.json para rastro, TDE-09/10 y ENV2-01; las otras entregas de ronda 7 siguen su curso. Se comprobaron los 2.146 archivos de base y no hubo borrados.


## Avance del 29 de octubre, 14:10 CET: integración revisada y correcciones

Recibidas las siete entregas pendientes y la revisión del rastro. Integrados contratos de trabajo anual, retenciones históricas y preservación por archivos, con hashes y cero borrados; se conservan los 3.230 archivos de base. El padre corrigió EMI-01, la clasificación de conciliación EMI-02, los cinco puntos de deducciones, los tres hallazgos de actividades con límites documentados, CI-01/02/03 y RV3-01. Informe completo y rojos: correcciones/integracion-ronda7/INFORME.md. Ningún resultado se autoacepta fiscalmente.

Pasan **495 pruebas de 38 archivos**, 15 de contenido y nueve de preservación; no se suman recuentos seleccionados solapados. Las dos suites legacy pesadas siguen reservadas para la comprobación final. Lint y typecheck correctos. Los diez snapshots históricos verifican íntegros. El puente reconstruye el inventario actual y coteja Madrid con siete dependencias documentales, sin atestación nueva.

Inventario: **50.646 ocurrencias**, contenido: **50.699 fichas** con cuatro conceptos y 49 puntos. Snapshot actual `babfc930e2c4096600e68895d13bbfae23c996bacd3ba7fbd376ae32f8713c68`. Payload Madrid `3c7ac6d902081f1d7d2cb28cc556ffbef9bcac5ae8303f9c6cbbef291983c88e`; el anterior se conserva. Estas cifras no representan reglas jurídicas aceptadas.

Trabajo y actividad siguen necesitando integración anual tras revisión independiente. Retenciones ya está conectada y requiere selección temporal expresa cuando corresponde. Los controles antiguos de deducciones solo aplican consignaciones, con limitación visible. IPC observado/escenario y redondeos continúan como trabajo del padre. Se preparan nuevas revisiones y ampliación de enlaces documentales.

Preservación local: 708 originales candidatos, 0,908 GiB; ninguna copia externa nueva acreditada. Pregunta pendiente a Elies: confirmar al menos 2 GiB libres de LFS, autorizar hasta 1 €/mes o dejar preparada la transferencia. No se infiere respuesta, cuota o permiso nuevo. El resto del encargo continúa. Sin PR, deploy ni limpieza final.

Bloque respaldado en origin: `ed6a43fd750de05609abc3710dabdc2f8261020c`. Ronda 9 abierta con ocho tareas: cinco revisiones nuevas, dos lotes de evidencia por celda (estatal y autonómico) y un adaptador de evidencia para fichas. Registro completo en delegaciones-ronda9.json. Los hijos no cambian VCS ni aceptan sus propios resultados. El orquestador continuará con IPC/redondeos y conexión anual al reactivarse por las entregas. La sesión permanece abierta.

### Decisión de Elies sobre respaldo, 14:27 CET

Elies responde «Dejar preparada la transferencia». Se cierra la pregunta de cuota: no habrá subida de objetos LFS ni gasto en esta sesión. Se conserva y revisa el paquete local, con instrucciones y transferencia preparada. No se acredita custodia externa del corpus; los commits de código y documentación siguen respaldándose en origin conforme al encargo. Las ocho entregas de ronda 9 han llegado y están en integración y corrección, sin cierre fiscal global.

## Avance del 29 de octubre, 14:40 CET

Integradas por archivos las tres entregas de evidencias, con hashes y cero borrados. Corregidos RTI-01/02/03, CV2-01/02, el residuo explicativo CMV2-01 y la propagación del modo en la auditoría por rango. IPC distingue observado/escenario y corrige el factor inverso. Preservación v2 cierra los cuatro puntos reproducidos y una carencia adicional de validación de fechas. Informes: correcciones/coherencia-ronda9/INFORME.md e ipc-escenarios/INFORME.md.

Pasan 517 pruebas globales en 41 archivos, 15 de contenido y 16 de preservación; lint, typecheck y comprobaciones Python correctos. Los once snapshots verifican. Inventario 50.684; fichas 50.737. Snapshot actual `7dd9c9c6147b6b1931b51944c885abd528550c27b5a3c31392b37e01be9f712d`. Las cifras son cobertura técnica, no aceptación jurídica. Madrid tiene payload nuevo `c63794f9cea15c1ed8d736ed4719253e058d4616e83ed22d3ac02506e1035dd2`, sin migrar atestación.

Exportación/restauración completa en la raíz principal: 708 originales y 974.801.535 bytes, ambos hashes y tamaño verificados. Manifiesto v2 `1382c7186c84cdf7c1892b9b16a8ca7e222aeac54380d3ed41952deea47a67db`. Transferencia externa preparada y detenida por elección de Elies; no se repetirá la pregunta de cuota.

Pendientes inmediatos: revisiones nuevas del bloque, revisión de los 455 payloads candidatos y del adaptador, exposición efectiva de cuotas y conexión anual de trabajo/actividades. Redondeos legacy, cobertura jurídica y medición del backend siguen abiertos. No hay PR, deploy, cambios de main ni limpieza final.

Bloque respaldado en origin: `c61a306107f280c399eb57e57a7c45452bd68864`. Ronda 10 lanzada con ocho tareas nuevas: cinco revisiones independientes y tres implementaciones de conexión anual, exposición efectiva/CAS y redondeos del oracle. Modelo y opciones solicitados por Elies; registro y encargos completos en delegaciones-ronda10.json. Al llegar las entregas, el padre continuará con integración y wiring de evidencias, rendimiento de rutas y validación final. La sesión sigue abierta.
