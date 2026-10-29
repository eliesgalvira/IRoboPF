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
