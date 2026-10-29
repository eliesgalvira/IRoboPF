# Evidencia autonómica candidata sobre base ed6a43fd

Investigación personal, sin subdelegación. Base declarada: `ed6a43fd750de05609abc3710dabdc2f8261020c`. No se ha mutado VCS, motor, registro de confianza, aceptaciones ni Madrid 2020. El padre debe cotejar base, manifiesto y ausencias antes de integrar. El alcance prioritario comprende Andalucía 2012–2015, Comunitat Valenciana 2014–2016, Catalunya 2020–2024, Madrid 2022 y Murcia 2022.

## Resultado y alcance

Resultado medido: **186 celdas EUR anuales, 94 celdas documentales, 93 citas de corpus, nueve recortes y 136 payloads**. Hay 78 celdas anuales con coincidencia numérica efectiva (136 ocurrencias exportadas) y 108 sin payload; las 186 siguen sin binding del helper canónico. Se registran 93 tipos pendientes, 14 extremos infinitos y las 317 decisiones de las seis revisiones, sin convertirlas en nuevas aceptaciones. Se cotejaron las 122 entradas de generación del inventario; ninguna reconstrucción.


`cobertura.json` enumera cada base inferior y cuota de las tablas prioritarias por ejercicio, más los tipos pendientes y los extremos infinitos. `citas-celdas.json` fija texto literal, geometría individual, fila, columna y cabecera. Cada cita de corpus conserva además la tabla completa para revisar su contexto; la cláusula murciana tiene cita separada. `payloads/` contiene exclusivamente propuestas asociadas a ocurrencias **effective** del artefacto fijado. No se han convertido literales sintácticos en valores efectivos.

Los payloads enlazan límites de las tablas anuales, **no las cuotas del helper canónico**. Las funciones canónicas pueden usar las tablas publicadas de `escalas-publicadas.ts`; identificar un límite anual de igual número no acredita la identidad de esa otra ocurrencia. Cada registro conserva esta diferencia. Todas las cuotas y bases de los helpers se mantienen bloqueadas para binding canónico: son constantes privadas no exportadas y el inventario actual no ofrece sus valores efectivos. Sí se conservan símbolo, fila, posición y ocurrencias sintácticas para que el padre pueda investigar el extractor sin cambiar el cálculo.

La matriz no se limita a las discrepancias famosas: incluye filas iniciales de cero y todas las filas intermedias de los períodos prioritarios. Las bases iniciales cero tampoco se sustituyen por el límite superior de otra fila. Los extremos `Infinity` no son cantidades EUR citables. Los tipos porcentuales y fracciones quedan pendientes: solo se admite conversión identity. `matriz-revisiones.json` conserva además una entrada por cada decisión de las seis revisiones de escalas/cadenas; no extiende el trabajo de facsímiles prioritarios a todos los territorios por asociación.

## Bloqueos concretos del puente

1. Los seis helpers privados ANDALUCIA_2012_2015, VALENCIA_2014_2016, CATALUNYA_2020_2021, CATALUNYA_2022_2024, MADRID_2022 y MURCIA_2022 no tienen ocurrencias efectivas. Una transcripción acertada o una ejecución auxiliar no crea una identidad en el inventario fijado.
2. Las decisiones jurídicas utilizadas tienen `decision: accepted`; `tools/procedencia/enlaces.py` exige `status: accepted`. La cadena C usa además localizadores heterogéneos. No se alteran registros ajenos ni se fabrican decisiones compatibles para conseguir verde.
3. El coordinador fija registro y CAS en `enlaces/registro.json` y `corpus/fixtures`. Esta entrega está fuera de esos destinos por propiedad asignada. Los originales continúan en CAS autorizado de lectura; los PNG nuevos se entregan en `recortes`. Hace falta integración explícita y revisión nueva antes de ejecutar el coordinador sobre estos payloads.
4. Una aceptación previa de la discrepancia de cuota bruta no acepta automáticamente todos los límites asociados. Los payloads conservan el ID y alcance previos, pero requieren revisión del enlace de cada celda, año y ocurrencia. No son bindings aceptados.
5. El lexer actual acepta `euros` y `EUROS`, pero no `Euros`. Las citas que presentan esta última cabecera conservan su texto exacto y `engineBinding: null`. No se toma la unidad de otra columna ni se normaliza el original. Es evidencia documental válida con binding pendiente, no un fallo que autorice editar el verificador desde esta tarea.

## Murcia y vigencias

Original BORM 4846 de 29/09/2022, página física 4, SHA-256 `962a88eff2128d036bf8745c31faadb050c45abc0e93e712c3b3d50c72906bf4`: la quinta regla es un párrafo posterior, no una quinta fila de tabla. Para base **estrictamente superior a 60.000** se publica cuota 8.716,67 más 22,70 % del exceso. En 60.000 exactos sigue la cuarta fila. Se conserva `inferiorExclusivo: true` en la matriz del helper, sin convertir la escala en continua. La cita amplia incluye «superior», importe, exceso y unidad. No se certifica régimen de fallecidos ni vigencia por una tabla AEAT aislada.

La selección documental se apoya en las revisiones previas acotadas: Ley 3/2012 p.4; Ley 7/2014 p.58; Ley 5/2020 p.62; Ley 2/2021 pp.46–47; refundición catalana 2024 p.6; Ley 8/2022 madrileña p.3 y BORM murciano p.4. Se usan siete originales conservados, sin nuevas descargas. La primera y la última columna de una tabla no se confunden: el límite superior técnico se coteja con la base inferior de la siguiente fila, con índice explícito.

Las revisiones de cadenas A/B/C y de escalas se leyeron junto con contrato, coordinación, estado, decisiones, CORPUS, ENLACES-VERIFICABLES y el informe de integración ronda 7. La revisión de integración de escalas describe la representación canónica actual; las reproducciones antiguas de integrales no se presentan como fallos nuevos del motor corregido.

## Cinco planos separados

- **Integridad:** hashes de originales, citas y PNG; reextracción y render con el toolchain fijado del corpus. Manifiestos públicos saneados antes de calcular su hash.
- **Autenticidad:** no validada de nuevo. URL oficial y SHA-256 no autentican emisor, firma histórica, CSV ni vigencia.
- **Interpretación:** decisiones jurídicas previas y sus límites conservados; alcance de cada enlace sigue candidato. Ningún `needs-evidence` pasa a accepted.
- **Exactitud:** igualdad Decimal entre literal de celda y valor efectivo fijado donde existe; no certifica liquidación completa ni ejecución actual reconstruida.
- **Aceptación:** ninguna nueva, sin atestaciones ni migración. La nueva contrarrevisión deberá examinar los bytes exactos de la entrega.

## Decisiones y costes

**Conservar contexto y celda por separado.** Objeción experta: una cifra aislada pierde unidad y significado; una caja de tabla no es una caja de celda. Motivo: la cita de corpus conserva tabla y spans, y el índice añade geometría exacta de celda/cabecera. Coste: metadatos redundantes y revisión semántica todavía necesaria.

**No exportar helpers ni ajustar el motor.** Objeción experta: exportarlos desde esta investigación alteraría el universo inventariado y la base de los enlaces. Motivo: respetar identidad efectiva y propiedad del integrador. Coste: cuotas canónicas documentadas pero sin payload efectivo ejecutable.

**No promocionar aceptaciones previas.** Objeción experta: aceptar un defecto en un punto no certifica cada fila de una escala. Motivo: preservar el alcance de los revisores. Coste: los payloads numéricamente coincidentes necesitan revisión jurídica del binding y adaptación del contrato de decisiones por su propietario.

**Reutilizar CAS y renderizar solo tablas.** Objeción archivística: referencias locales no garantizan restauración fuera del equipo. Motivo: evitar duplicar PDFs grandes y respetar el corpus existente. Coste: el padre debe integrar la resolución CAS y mantener su preservación; manifiesto y recortes no reemplazan originales.

**Comprobar por lote el contexto fijado.** Objeción experta: leer un artefacto no reconstruye el motor. Motivo: el encargo prohíbe regenerar el inventario principal y pide comprobación por lotes. Se usa readArtifact y cotejo de entradas de generación, sin atribuirle reconstrucción. Coste: el coordinador fresco sigue pendiente tras la integración.

## Reproducción y entrega

`receta.json` fija hashes del flake/uv.lock; cada cita fija PyMuPDF/MuPDF, 144 DPI, RGB, sin alpha ni anotaciones, extracción flags=0 y sort=false. Un worker; renders serializados con `flock /tmp/irobopf-validacion-pesada.lock`. No se ejecutó Next build ni suite legacy.

Reproducción desde raíz: copiar `reproduccion/leer.mjs.txt`, `generar.py.txt`, `completar.py.txt` y `verificar.py.txt` a `.cache/autonomicas-investigacion/` quitando `.txt`. Ejecutar `leer.mjs` con Bun de Nix; después `generar.py`, `completar.py` y `verificar.py` con `tools/procedencia/run.sh`, usando el lock común para render. Los manifiestos públicos permiten localizar los originales por hash sin conservar índices privados de adquisición.

Los instrumentos conservados como `.txt` se copian a scratch para reproducción; no son código de producto ni una vía para desactivar lint. No se añade TypeScript/Effect mantenido, ni se cambian package, lockfiles o CI. No se atribuye lint/typecheck ajeno a esta entrega. La primera preparación falló porque el lexer no admite la unidad literal `Euros`; se conservó el literal dejando ese binding pendiente. Hubo también un intento de Python sin shell Nix, que no ejecutó la edición; se repitió mediante Nix.

`manifiesto.json` relaciona todos los archivos de entrega contra base (todos nuevos) y sus SHA-256. `entrega.patch` contiene las altas textuales; los PNG se integran por archivo y hash, no mediante el marcador textual de diff. El manifiesto excluye su propio hash y el patch para evitar autorreferencia; `entrega-hashes.json` fija esos dos artefactos. Ningún archivo base se propone borrar.
