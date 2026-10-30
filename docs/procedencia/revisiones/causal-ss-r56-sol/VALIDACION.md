# Validación reproducible y límites

Checkout: `/home/elies/.t3/worktrees/IRoboPF/t3-8705d0bc`. Scratch exclusivo `.cache/causal-ss-r56-sol`. Herramientas mediante Nix: Node 24.19.0, Python, uv, util-linux y patch. Dependencias de `/home/elies/Repos/IRoboPF/node_modules` en lectura; sin instalación, cambio de lockfile o escritura en la venv padre. Ningún servidor, navegador, transferencia externa o mutación VCS.

Cada ejecución pesada se serializa con `flock /tmp/irobopf-validacion-pesada.lock`. En el primer comando histórico/independent ambas operaciones secuenciales compartieron un único lock de comando; los siguientes controles tienen su adquisición individual. El cotejo físico usa `/tmp/irobopf-recepcion-acotada.lock` y petición/respuesta de blobs individuales. No hay lock mantenido durante lectura/redacción o espera externa.

## Comandos y evidencia

Desde la raíz, con Node24 de Nix y lock por comando:

- `node --import ./.cache/causal-ss-r56-sol/historico-host.mjs .cache/causal-ss-r56-sol/probe-historico.mjs`: exit 0, bypass histórico reproducido y diez celdas en cinco salidas. `historico-identico.json` prueba igualdad byte a byte del fragmento/testigo adulterados completos frente al transporte original R55.
- `node --import .../historico-host.mjs .../red-pending.mjs`: exit 1 esperado por Missing expected exception. `node .../red-contamination.mjs`: exit 1 esperado, actual=5 frente a expected=0. Ambos rojos históricos se conservan sin fixes; no son defectos nuevos de R56.
- `node .../independent.mjs`: exit 0, 42 entradas/462 comparaciones, 29 adversos y ocho testigos propios. El arnés se adapta del recibido R55: cambia prefijo, cuantías, selección acotada de casos y añade cinco controles de celdas; elimina el bloque antiguo de comparación incompatible con software actual. No se atribuyen sus 29 adversos a una invención nueva. expectations.json conserva entradas, expectativas y resultados completos.
- `node .../relaciones.mjs`: exit 0, 18 adversos adicionales con salidas monetarias intactas y mensajes de rechazo, controles N01 y comparación de los 18 testigos recibidos/198 salidas. `pendingChecks=9` cuenta una admisión descriptiva validateSS y ocho rechazos (dos directos + seis de falsificación), no nueve entradas distintas; el código conserva el detalle efectivo. No se suman estos controles a los recuentos recibidos de 101 pruebas.
- `node .../estructura.mjs`: exit 0, tres ejecuciones, cinco selecciones por ejecución. Comprobaciones explícitas de array/cardinalidad/orden/valores, marcos e identidad miembro→argumento de invocación; incluye vacío y repetidos iguales.
- `node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --configLoader native --config .cache/causal-ss-r56-sol/vitest.mjs`: 15 pruebas R56 correctas. maxWorkers:1, cache:false, cacheDir absoluto propio. No se repite suite 101 ni puertos/legacy por rutina; se leen y delimitan sus resultados recibidos.
- `node .../emision.mjs`: exit 0, TypeScript 5.9.3 emite JavaScript idéntico antes/después de never; hashes conservados en emision.json.
- `uv run --no-project --python /home/elies/Repos/IRoboPF/tools/procedencia/.venv/bin/python .../schema.py`: exit 0, 26 testigos válidos según Draft202012Validator (18 recibidos y ocho propios). UV_CACHE_DIR y UV_PROJECT_ENVIRONMENT son rutas absolutas dentro del scratch propio, PYTHONDONTWRITEBYTECODE=1. No se reescriben los recibidos.

## Adaptaciones del entorno y fallos conservados

Los cuatro módulos históricos son blobs exactos de ac91fb9; no se editan. historico-host.mjs adapta únicamente readFileSync del proceso histórico para que el pin del causal lea esos bytes. Las fuentes financieras siguen siendo las del checkout actual, idénticas a la base fijada por composeSS. El probe y rojo histórico cambian rutas de import y de salida a este scratch; no preparan ni escriben en el padre. Su igualdad byte a byte acredita que la adaptación no cambia la evidencia adulterada recibida.

Los instrumentos son JavaScript/Python de auditoría, sin nuevo código Effect de producto ni TypeScript propio. No se presentan como checkJs verde. Los tipos del alcance pasan (exit 0, log vacío) y usan la configuración real strict con plugins Effect, sin rebajar diagnósticos; se incluyen causal, protocolo y tests R54/R56. Las copias históricas se excluyen del proyecto por su exclusión original de .cache.

`types.mjs` lee tsconfig.json/tools/oxlint/tsconfig.json reales y conserva plugins y severidades. Desactiva únicamente incremental y adapta CompilerHost/resolución externa a dependencias padre. El primer global conserva cinco diagnósticos del checkout recibido. El segundo adapta por lectura las rutas de fixtures privados a copias padre y los imports absolutos históricos de t3-a8a12c75 a equivalentes padre. Resuelve los cuatro diagnósticos ligados a fixtures, pero permanece TS2345 en propios.test.ts:53 de fronteras-escalas-r42 (ParameterWitness.type string frente a string|null). No se modifican ni excluyen tests para ocultarlo. No se afirma pase global principal. Vendor pasa. checkJs conserva 85 diagnósticos (73 Effect y 12 ordinarios): deuda abierta, sin homologarla a una sonda anterior de alcance distinto.

El primer instrumento de tipos y todos los logs se conservan. La adaptación de host final no demuestra equivalencia global del entorno histórico. La coincidencia de emisiones never es un control independiente del resultado global de tipos.

Oxlint global pasa con las dieciséis reglas a error y los ignores originales trasladados a flags relativos a cwd. Runtime de plugin copiado idéntico al scratch, con enlace node_modules en lectura; config solo cambia rutas jsPlugins. ESLint focalizado en causal/protocolo/test R56 pasa sin errores; conserva aviso de detección de React al no haber node_modules en raíz. No se atribuye ese pase focalizado a lint global completo ni se esconde el aviso.

## Transporte y cotejo terminal

`package.py` produce sobre/manifiesto.json con ruta/hash/tamaño/modo/baseSha256, patch gzip y objetos binarios/vacíos por hash. Todos los archivos son nuevos y baseSha256=null. Preserva ausencia de newline y modo ejecutable; cada archivo es menor de 10MiB. Reconstruye en scratch/reconstruccion aplicando patch y materializando objetos por hash, sin copiar payload. Comprueba rutas, bytes, modos y extras.

El payload incluye instrumentos, fuentes/hashes, logs y documentos. El sobre y reconstrucción se excluyen de sí mismos; el recibo terminal fija sus hashes sin autorreferencia. Se excluyen del payload dependencias del entorno reproducibles (enlace node_modules, copia idéntica anti-slop y caché uv); siguen censadas por el cotejo físico. No se excluyen fallos instrumentales.

`physical.py` contrasta de nuevo todas las 22.251 entradas físicas contra blobs uno a uno y censa extras. El recibo final registra cero modificación/borrado base y ausencia de extras fuera de las dos rutas autorizadas. .git es metadato T3 identificado y excluido del árbol de contenido. Un diff vacío no sustituye esta comprobación.
