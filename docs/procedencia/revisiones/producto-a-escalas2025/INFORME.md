# Revisión independiente conjunta A2025 y corrección de cuotas

Dictamen: **aprobación acotada de la acreditación documental y de la representación de cuotas publicadas en las cuatro tablas para 2025 ordinario**. No he encontrado un dato público ni un importe falso que bloquee esta propuesta. La corrección sigue privada, sin aplicar; esta revisión no integra, publica ni certifica una declaración fiscal completa. Fecha: 2026-11-04. Base declarada E+B: 461e16323ca11e428c3e391568755c3e6b2766ab. C300/Madrid no se modifica ni se reabre 2026.

## Identidad y método

Raíz y ambas entregas de autor sólo leídas; sin worktree, subdelegación, VCS mutante, instalación, Vitest, tipos globales, inventario ni suite pesada. LIGERO2, un proceso de sondeo cada vez, órdenes con `timeout -k 30s 25s`, entorno compartido y cachés del usuario. Consultados AGENTS.md, Effect Solutions list/testing y ejemplo `Effect.runSync` de la fuente local antes del sondeo de derechos.

`fuentes-antes.json` y `fuentes-despues.json` fijan 122 fuentes, incluidas las 79 preimágenes de módulos/lock, los dos paquetes de autor, el manual y los cuatro primarios CAS; no cambian. `integridad.json` verifica también los manifiestos documentales y el parche monetario, aplicando sus tres diffs **en memoria** y comparándolos con los candidatos. El runtime privado sólo sustituye tres rutas de importación por rutas absolutas respecto al candidato revisado; no cambia fórmulas ni tablas.

El SHA del manual AEAT es 02c6e8300a7f56c8c24aa947d4c39c5657c9a9eda6f5d727d44b4112d7de15d4. El verificador del autor, inspeccionado antes de ejecutarlo porque es de sólo lectura, pasa manifiestos, preimágenes, páginas, cajas físicas, contextos, offsets de primarios y fórmulas. No se ejecutan extraer/preparar/selector del autor porque escriben en su recepción.

Mi `revisar.py` reextrae del PDF las cuatro columnas de 115 filas de 17 territorios, comprueba encabezados y ejercicio en las cajas físicas y vuelve a parsear los cuatro artículos HTML conservados. Las 27 filas de estos artículos coinciden numéricamente con el PDF y con el candidato. El primer intento del parser propio rechazó el guion de base cero de Asturias; se trató explícitamente sólo para su primera fila. No era un defecto de los datos públicos.

## Documentación y mínimos

Las 1.477 comparaciones del recibo son comparaciones técnicas del alcance descrito, no aceptación fiscal. Se comprueba la integridad del resultado y su recuento de 72 discrepancias. Mi fórmula Decimal reconstruida de las filas físicas reproduce las 72 diferencias exactas y los 12 cambios a céntimos; no copia los esperados monetarios del autor. Las restantes 60 diferencias exactas pueden desaparecer al redondear una salida.

Estatal general y ahorro estatal/autonómico conservan sus tablas y páginas de evidencia, revisadas mediante la extracción y el replay documental. No atribuyo a esta revisión una nueva ejecución independiente de todas las ramas estatales/ahorro ni de las 1.477 comparaciones del motor. El replay conserva el resultado del autor, que queda separado del sondeo propio.

Muestra propia de los **19 campos nominales completos de seis territorios** (114 comprobaciones): Aragón, Asturias, Baleares, Galicia, La Rioja y Madrid. Los valores se transcriben semánticamente tras leer la prosa y las páginas 1083–1093; no se construyen leyendo el objeto del motor. Incluye los tres sujetos de discapacidad y los dos importes nominales de ascendientes. No ejecuta atribución de ascendientes, fuera del contrato.

Baleares: general 5.550 para el perfil menor de 65, total desde 65 de 7.370 = 6.105 + 1.265, por lo que el adicional representado sobre 5.550 es 1.820; desde 75 el total es 8.910. Se prueban 64/65/74/75/76. La Rioja: sólo discapacidad de descendientes cambia a 3.300/9.900; asistencia sigue en 3.000. Con ayuda, el sondeo obtiene 6.300; con grado 65 o más obtiene 12.900. Los campos de discapacidad propia y de ascendientes conservan 3.000/9.000/3.000.

En los seis territorios se ejecutan controles propios de elegibilidad: hijo de 24 años y renta 8.000 admitido; 8.000,01 excluido; 25 años sin discapacidad excluido y con discapacidad admitido; declaración individual con renta 1.800 admitida y 1.800,01 excluida. Se declaran hechos completos, un titular residente, convivencia, consanguinidad, sin alimentos ni fallecimientos. Un primer intento del arnés propio empleaba IDs `p`/`h`, rechazados por el esquema; se corrigieron a `s-1`/`s-2`, sin cambiar expectativas ni producto. No se detectó falso positivo en esta muestra acotada.

## Fuente y vigencia de las cuatro tablas

Aragón: artículo 110-1 del texto refundido, corroboración CAS fa282a231a7a0d9ad67237af2086b67b59bd8e27cc05ff9eeda8519954ccd307; nota de Ley 17/2023, artículo 64.1, efectos desde 01/01/2023. Nueve filas coincidentes con el manual del ejercicio 2025.

Asturias: artículo 2 del Decreto Legislativo 2/2014 y ocho filas coincidentes. La nota de reforma remite a Ley 3/2025. Se consultó además el [texto original BOE-A-2025-25707](https://www.boe.es/buscar/doc.php?id=BOE-A-2025-25707), artículo único.1, disposición final y análisis. Se publicó en BOPA el 02/12/2025 y entró en vigor el 03/12/2025; el preámbulo explica su aplicación al ejercicio fiscal 2025. No es una tabla aplicable indiscriminadamente desde enero ni por semestre: respalda el devengo ordinario a 31/12 aquí seleccionado. Los devengos por fallecimiento siguen reservados, incluido el posterior a la reforma, por decisión conservadora del candidato. No se pretende acreditar esas ramas.

Galicia: artículo 4, CAS a0e7a4375c604e7f4e8bbf8b98b276036dfac4e6f634f41de6d3a24760efcaef; nota de Ley 7/2022, efectos 01/01/2022. Cinco filas coincidentes con AEAT2025.

Castilla y León: artículo 1, CAS cb5a0ab67029f42bbc95bed62947ed46ce5149b31517aaa1f55153cf9cbaf2aa; nota de Ley 2/2022, efectos 01/01/2022. Cinco filas coincidentes. Los consolidados son corroboración oficial versionada, sin convertirlos en originales del diario ni reabrir la auditoría universal de vigencia. Los contextos del manual fijan la aplicación ordinaria 2025.

## Corrección monetaria y composición

El candidato transcribe base inferior/cuota fija/tipo de las 27 filas, con fracciones porcentuales correctas. En `calcularDesgloseCuotaPorEscala` se selecciona la última base inferior inclusiva; no hay `inferiorExclusivo` en estas filas. Se aplica cuota fija + exceso × tipo, sin reconstruir cuotas por integración ni imponer continuidad artificial. Esto preserva las pequeñas discontinuidades de tablas publicadas, como Asturias al alcanzar 70.000. No se cambian precisión ni políticas monetarias existentes.

Sondeo independiente aprobado: **497 comprobaciones numéricas**, que incluyen 170 puntos monetarios propios (cada frontera ±0,001/±0,01, frontera exacta, interior +137,29, cero, negativos y base alta), las 72 discrepancias originales recalculadas desde la fuente física y 16 cálculos parciales base/mínimo con la misma escala. También pasan exclusiones de fallecimiento en enero, junio, 2/3 de diciembre y 31/12, año 2024 y conservación por identidad de la selección 2026. El replay separado del sondeo del autor confirma 72/12 antes y 72 exactos corregidos después.

Cadena leída: `composicion-anual.ts` selecciona una vez `obtenerEscalaAutonomicaPublicada(caso)`, transporta la misma colección a la cuota general autonómica y a la cuota del mínimo limitado por la base, así como a ambos desgloses. La sustracción posterior y la aritmética `A` continúan en la composición común. El sondeo parcial no sustituye una liquidación anual completa; esa integración y CI corresponden al padre cuando C congele identidad. No atribuyo cierre AST ni el levantamiento de reservas generales de helpers.

Las 76 pruebas Vitest propuestas se revisaron como código, no se ejecutaron. El cambio Madrid2026→2017 en la exclusión es coherente con E+B ya publicado; Asturias se reserva mediante fallecimiento explícito. No se cambian esperados monetarios históricos. No es necesario abrir una nueva ronda de revisión por cada ajuste de integración que conserve estas identidades, tablas y alcance.

## Defectos, remedios y entrega

No hay defecto bloqueante reproducible identificado. No se solicita una auditoría universal adicional F, ni nuevos casos completos para aprobar esta representación ordinaria. Persisten las reservas declaradas: hechos y residencia, otras ramas/devengos, ascendientes en ejecución y aceptación fiscal completa. La aprobación documental no se extiende al ejercicio entero.

Se entrega este informe, scripts propios, oráculo derivado de fuentes físicas, resultados y recibos de integridad. `revision.patch` sólo añade los artefactos de esta revisión bajo docs/procedencia/revisiones/producto-a-escalas2025; no vuelve a introducir el parche de implementación del padre. `manifiesto.json` fija los SHA-256 de los archivos y del parche. Ninguna fuente original se modifica ni se borra.

Reproducción, desde la raíz y un proceso cada vez:

```sh
timeout -k 30s 25s bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; /home/elies/.cache/irobopf-corpus/.venv/bin/python /home/elies/Backups/IRoboPF/producto-a-escalas-revision-20261104/revisar.py'
timeout -k 30s 25s bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; bun --no-install /home/elies/Backups/IRoboPF/producto-a-escalas-revision-20261104/sondeo-independiente.mjs'
timeout -k 30s 25s bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; /home/elies/.cache/irobopf-corpus/.venv/bin/python /home/elies/Backups/IRoboPF/producto-a-escalas-revision-20261104/empaquetar.py'
```
