# Contrarrevisión de evidencias autonómicas v1

Revisión personal sobre `c61a306107f280c399eb57e57a7c45452bd68864`. Candidatos examinados en su contexto histórico `ed6a43fd750de05609abc3710dabdc2f8261020c`, snapshot `babfc930e2c4096600e68895d13bbfae23c996bacd3ba7fbd376ae32f8713c68`. No se sustituyeron por el inventario actual. Sin subdelegación, fixes, registros, atestaciones ni operaciones VCS mutantes.

**Dictamen: evidencia documental reproducible y conservable como candidata; no habilitar aceptación ni integración automática de bindings.** Se reextrajeron las 94 selecciones (celda y cabecera) y las 93 citas, se regeneraron los nueve PNG y se cotejaron los 136 payloads con las ocurrencias históricas. Todas esas comparaciones resultan iguales. Las 186 celdas anuales tienen decisión individual; las 317 decisiones previas conservan estado y alcance. Hay una deficiencia de precisión en 28 localizadores sintácticos y una limitación de la receta de reproducción frente a cambios de inventario.

## Hallazgos y decisiones

**EAV1-01, P2 documental: 28 localizadores sintácticos ambiguos.** `reproduccion/completar.py.txt` selecciona todas las ocurrencias sintácticas de igual valor dentro del símbolo, sin restringir fila y campo. En la primera fila de cada helper, base cero y cuota cero quedan ambas en `syntacticLocations` de cada campo. Ejemplo: `andalucia-2012-f1-baseInferior` contiene `inv-6798783c3de1532f7552312515c12a63` (cuota) y `inv-d1827c4e312bcaad346f3969208f22ab` (base). Afecta a dos campos por cada uno de los 14 pares anuales, no a 28 errores de cuantía. Las ubicaciones existen, pero la colección no identifica inequívocamente el campo anunciado.

Decisión: conservar las cifras y exigir selección estructural por fila/campo antes de reutilizar esos localizadores como identidad. `localizadores-refinados.json` entrega la selección precisa de cada una de las 186 entradas, sin editar al autor. Objeción experta: escoger el primer cero numéricamente igual fabricaría una identidad. Coste: comprobación estructural adicional; ni siquiera el localizador refinado crea una hoja efectiva del helper.

**EAV1-02, P2 de reproducibilidad: la receta descrita lee el inventario presente.** `reproduccion/leer.mjs.txt` llama `readArtifact()` sin seleccionar el artefacto histórico; `completar.py.txt` vuelve a fijar fuentes e inventario presentes. El informe invita a ejecutarlos desde la raíz sin exigir restaurar ed6. Sobre la base de esta revisión ya hay un inventario distinto: esa secuencia puede producir propuestas nuevas en vez de reproducir las entregadas. No ejecuté sus generadores, que además escriben la entrega y eliminan recortes no utilizados.

Decisión: reproducir leyendo con `git show ed6:…` los bytes del manifiesto y del gzip, comprobar sus hashes fijados y consultar las fuentes en esa misma revisión. Nuestro `revisar.py` lo hace sin checkout ni mutación. Objeción experta: migrar al inventario reciente porque «contiene el mismo número» rompe la identidad histórica. Coste: dependencia de los objetos históricos o de una copia preservada exacta; no se exige regenerar el inventario ni migrar aceptaciones.

**EAV1-03, bloqueo de integración confirmado, sin nuevo defecto fiscal: `decision` y `status` son contratos distintos.** Los payloads refieren decisiones con `decision: accepted`; el coordinador en `tools/procedencia/enlaces.py:159` exige `status: accepted`. El cotejo individual conserva ambos campos en `payloads.json`. La cadena C añade localizadores heterogéneos frente a la lectura de `engineLocations[].path`. No se cambia una clave ni se inventa una aceptación para conseguir verde.

Decisión: mantener los 136 payloads candidatos. Objeción experta: adaptar el nombre de una clave no resuelve alcance, ocurrencia, año ni autoría de una decisión. Coste: adaptación explícita por el propietario del contrato y revisión del binding exacto, además de resolver CAS/registro. No se ejecutó el coordinador completo sobre una instalación ficticia ni se afirma un resultado suyo.

**EAV1-04, limitación del lexer confirmada: `Euros` se conserva.** Veintiuna selecciones de cuota tienen la cabecera literal `Euros`; el lexer admite `euros` y `EUROS`, no esa capitalización. Sus citas carecen de binding. En total hay 22 citas con `engineBinding: null`: esas 21 y la cláusula murciana independiente. Las cabeceras y celdas reextraídas coinciden literalmente. La minúscula empleada para comprobar semánticamente la unidad en nuestra revisión no modifica el texto almacenado ni el lexer.

Decisión: conservar las citas y señalar el bloqueo técnico, sin tomar la unidad de la columna contigua. Objeción experta: editar citas para que pase un parser destruiría literalidad; la falta de soporte del parser tampoco convierte la unidad jurídica en desconocida. Coste: futura ampliación probada del lexer por su propietario, sin aceptación fiscal por ese cambio.

## Cobertura y separación de identidades

- `selecciones.json`: decisión por las 94 selecciones, texto reextraído, celda, cabecera, página, hash, fila, columna y valor.
- `citas.json`: decisión por las 93 citas; texto, geometría, selectores, receta y binding literal cuando existe.
- `recortes.json`: decisión por los nueve PNG, hash almacenado y regenerado. Los nueve se inspeccionaron visualmente; no hay cifras cortadas en las regiones entregadas. La tabla catalana de 2022 continúa entre páginas 46 y 47: las dos primeras filas se distinguen de las siete restantes. El recorte murciano incluye tabla y párrafo; también existe el párrafo por separado.
- `celdas-anuales.json`: 186 decisiones con año, territorio, celda y helper. `localizadores-refinados.json` añade la identidad sintáctica por campo. Todas mantienen el bloqueo canónico.
- `payloads.json` y `anios-payloads.json`: 136 decisiones, fuentes históricas, símbolo, ruta, fila, valor efectivo, ejercicio, territorio y decisión jurídica. Los límites de tramo se cotejan con la base inferior de la fila siguiente: índice técnico `fila−2`, columna `0`. No se confunden con cuota, ancho o base inicial cero.
- `decisiones-previas.json`: 317 decisiones cotejadas individualmente por ID, hash, estado y alcance, sin promoción. Las seis colecciones tienen 13, 95, 75, 33, 9 y 92 registros. No se extiende esta revisión documental a sus territorios restantes.
- `originales.json`, `contexto-historico.json` y `preflight.json`: originales por hash, contexto histórico, controles de entrega y presencia de archivos de la base.

Los 136 payloads corresponden a 78 celdas anuales con ocurrencias exportadas; no son 136 conceptos fiscales distintos. Las 108 celdas sin payload siguen sin él. Los seis helpers privados no ofrecen hojas efectivas en el inventario fijado. Las cuotas se conservan como cuotas publicadas, no se recalculan integrando tipos para cambiar sus céntimos. Tipos (93 entradas pendientes) y extremos infinitos (14) conservan sus límites originales; no se amplía a conversiones porcentuales ni se trata Infinity como EUR documental.

## Murcia: desigualdad estricta y cuota fija

Reextraído del original BORM SHA-256 `962a88eff2128d036bf8745c31faadb050c45abc0e93e712c3b3d50c72906bf4`, página física 4, caja `[95,165,535,208]`:

> Cuando la base liquidable sea superior a 60.000,00 euros la cuota íntegra será de 8.716,67 euros más la cantidad resultante de aplicar el tipo del 22,70% a la parte de base liquidable que exceda de 60.000 euros.

La cita literal con saltos y cierre tipográfico queda en `citas.json`; esta presentación solo facilita su lectura. El párrafo no es una quinta fila gráfica de tabla. `murcia-frontera.json` calcula con Decimal las bases 59.999,99; 60.000; 60.000,01; 100.000. Con la cláusula estricta dan respectivamente 8.625,831378; 8.625,8332; 8.716,67227 y 17.796,670. El mutante `>=60000` produce 8.716,67 en el punto exacto, diferencia 90,8368 antes de redondear. Se conserva `inferiorExclusivo: true` y la exclusión del supuesto de fallecimiento pendiente.

Esta es una contraprueba aritmética de la interpretación del párrafo; no una ejecución nueva de la liquidación ni un defecto nuevo del motor, que ya contiene el helper con desigualdad estricta. No se altera el oracle. No hay corrección numérica en esta entrega ni se atribuyen como propios los tests rojos históricos.

## Cinco planos y costes

**Integridad:** originales comprobados por SHA-256/SHA-512 y tamaño; texto, geometría, selectores y PNG reproducidos. Esto no demuestra quién emitió un documento. **Autenticidad:** firmas, confianza histórica, revocación, CSV y sellos no revalidados. Se conservan URLs oficiales y la limitación del autor. **Interpretación:** se mantienen las decisiones previas con su alcance, sin convertir defectos de cuota bruta en reglas completas. **Exactitud:** igualdad Decimal de celdas y ocurrencias históricas, con filas, campos y años diferenciados; no una certificación de ejecución actual. **Aceptación:** cero nuevas aceptaciones fiscales, cero atestaciones y ninguna escritura de registro.

La decisión de conservar los candidatos evita perder evidencia útil. La objeción experta es que conservar un paquete técnicamente consistente puede confundirse con autorizar su uso fiscal; por ello cada salida mantiene su estado limitado. El coste es dejar pendientes los bindings canónicos, las puertas editoriales y la aceptación individual del enlace exacto. No se reabren todas las cadenas históricas, ni se proclama una búsqueda exhaustiva nueva de reformas. No hubo nuevas descargas ni transferencia externa.

## Reproducción y límites operativos

Desde el worktree de revisión, comando ejecutado con un trabajador:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v1/revisar.py
```

`ejecucion.log` conserva la primera ejecución y `ejecucion-final.log` la repetición ampliada con refinamiento de localizadores y comprobación de entradas históricas. `calidad.log` conserva Ruff y mypy del instrumento Python. No se escribió Effect ni código de producto; no corresponden lint/typecheck TypeScript, Next build o suites legacy. La comprobación aritmética no reemplaza tests mantenidos.

Incidencia operativa: el lanzador fijado creó automáticamente `tools/procedencia/.venv` dentro del worktree al preparar Nix/uv. No se editaron fuentes fuera de la carpeta de revisión ni lockfiles; se declara esa escritura auxiliar del entorno y no se borra para ocultarla. `rg` no estaba en PATH inicialmente; se usaron lecturas disponibles y Nix, sin instalación global. Algunas primeras lecturas agrupadas se truncaron y se repitieron por secciones; la ruta correcta del informe ronda 9 incluye `docs/procedencia/`.

Preflight: los 5.281 archivos de la base de revisión están presentes, cero ausencias. El padre debe comprobar nuevamente base, hashes y ausencia de borrados al integrar. No hay patch de producto ni binarios nuevos que integrar: los PNG revisados siguen en la entrega original. `manifiesto.json` enumera los archivos de esta revisión con tamaño, SHA-256 y baseSha256; excluye su propia autorreferencia y las cachés de herramientas. Se preservan contexto, Reactivity, originales e informes ajenos.

Validación adicional: los 186 localizadores refinados tienen exactamente una ocurrencia sintáctica y valor coincidente con el helper histórico. Las 122 entradas de generación y los 257 archivos del manifiesto del autor coinciden por hash (y tamaño en la entrega). Ruff pasó inicialmente; mypy encontró cuatro errores de anotación del instrumento, conservados en `calidad.log`. Se añadieron tipos a los diccionarios de JSON, rutas y resumen, sin cambiar comprobaciones ni resultados; la repetición está en `calidad-final.log`. Las dependencias importadas no se vuelven a comprobar con mypy (`--follow-imports=skip`); no se atribuye cobertura de tipos del corpus a este ensayo.

Resultado final de calidad: Ruff `All checks passed!`; mypy `Success: no issues found in 1 source file`. `alcance-previo-control.json` comprueba además las 317 razones y objeciones y la igualdad de conjuntos de IDs de cada revisión. Las escrituras de esta revisión no alteran esas decisiones originales.
