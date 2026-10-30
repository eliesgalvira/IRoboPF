# Comandos y resultados

Desde el checkout asignado, sin mutaciones VCS. `validacion.json` conserva argumentos y códigos de la validación final. Los instrumentos entregados son contraste.mjs, replica.mjs y propios.test.ts; sus salidas son siempre scratch propio. Las configuraciones tienen rutas absolutas de esta recepción y deben adaptarse explícitamente al reproducir en otro checkout.

- Recepción: flock /tmp/irobopf-recepcion-acotada.lock; git rev-parse HEAD; git ls-tree -rz HEAD; lstat/readlink/bytes/modo y git cat-file blob individual. 21013 coincidencias.
- Vitest: flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --configLoader native --config .cache/revision-fronteras-escalas-r42-sol/actual.config.mjs. 30 pases.
- Rojo: mismo comando con rojo.config.mjs y -t 'la frontera declarada|firma real de|EDS declara|motivo de rechazo|no promueve'. Exit 1: diez fallos, un pase, dos posteriores omitidos. Copia del productor anterior en scratch, originales intactos.
- Propios: propios.config.mjs. Primer intento 40 pases/1 fallo de hipótesis propia; segundo 41 pases (13 recibidos +28 nuevos). No sumar al lote de30.
- Entrega: entrega.config.mjs --reporter=json --outputFile=RUTA_SCRATCH/casos-final.json. 58 pruebas distintas, unión de30 con28 nuevos; repetir no amplía cobertura.
- Replica: node .cache/revision-fronteras-escalas-r42-sol/replica.mjs bajo lock pesado y Nix. Exit0; 302 registros, un rojo deliberado, cero fallos inesperados; 264 celdas idénticas. Diff de adaptación conservado.
- Schema: flock pesado env PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT=RUTA_ABSOLUTA_SCRATCH/venv bash tools/procedencia/run.sh RUTA_ABSOLUTA_SCRATCH/schema.py. Exit0. Dos artefactos válidos; cuatro mutantes rechazados; omisión/vaciado admitidos por schema histórico.
- Tipos: tsc -p scratch/tsconfig.json con rutas de dependencias de solo lectura, Bundler, checkJs acotado, noImplicitAny:false. Primer intento falla por narrowing y modo NodeNext; posterior exit0.
- Oxlint: las16 reglas a error, --disable-nested-config --threads=1; exit0. lint-files.log enumera los tres archivos reales. Las primeras ejecuciones silenciosas en scratch no se usan como prueba de selección; la proyección entregada se comprueba explícitamente. El intento con --stdin-filename fue una opción no soportada y no cuenta como pase.
- ESLint: configuración del padre solo lectura; exit0, un aviso de delta sin uso recibido y advertencia de detección React ausente. No se desactiva regla.
- Effect: bun CLI local effect-solutions list/show basics error-handling y rg de declaración fn en fuente local. Consulta de gramática; sin cambios Effect de producto.
- Transporte: preparar.py/fisico.py/empaquetar.py conservados como texto; patch -p1 sobre destino vacío en scratch, copia de binarios y cotejo SHA/tamaño/modo. Cero original sobrescrito.

Todas las pruebas, tipos, lint, schema y restauración adquieren/liberan el lock pesado por validación, sin anidarlo. No Next build, suites legacy masivas, red, VCS mutante, PR, servidor, preview o transferencias.
