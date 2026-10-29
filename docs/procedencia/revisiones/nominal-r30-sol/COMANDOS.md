# Comandos de esta revisión

Ejecutar desde la raíz del checkout. Todos los ensayos escriben exclusivamente en `.cache/revision-nominal-r30` y esta carpeta. Los instrumentos de preparación/recepción se conservan como `.py.txt`: copiarlos a ese scratch antes de repetir. Los diffs `*.adaptacion.diff` explican cada cambio respecto a los instrumentos recibidos; nunca repetirlos en sus carpetas históricas.

```sh
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/revision-nominal-r30/uv"
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r30/fisico.py inicial-nuevo
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r30/preparacion.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r30/preparar.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r30/extraer.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun nixpkgs#python3 -c node .cache/revision-nominal-r30/recorrido.mjs
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r30/pruebas-preparar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/nominal-r30-sol/casos.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun nixpkgs#python3 -c node docs/procedencia/revisiones/nominal-r30-sol/coordinador-adversos.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun docs/procedencia/revisiones/nominal-r30-sol/software-propio.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/nominal-r30-sol/schema-adversos.mjs
# El anterior termina con código 1: conservar los dos rojos de NR30-01.
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r30/contraste-schema.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun nixpkgs#python3 -c node docs/procedencia/revisiones/nominal-r30-sol/coordinador-schema.mjs
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r30/historicos-preparar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node --test --test-concurrency=1 .cache/revision-nominal-r30/ensayo/tests/nominal-contrato.test.mjs .cache/revision-nominal-r30/ensayo/tests/ambito-publicado.test.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun test ./.cache/revision-nominal-r30/ensayo/tests/nominal-software-explicacion.test.mjs
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r30/ensayo/tests/test_nominal_contrato.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r30/ensayo/tests/test_ambitos_juridicos.py
```

calidad-preparar.py copia configuración, plugin y fuentes a una vista de lint con node_modules del padre solo lectura. Allí se ejecutan oxlint `--threads=1 --disable-nested-config`, las 16 reglas a error, ESLint y tsc `--noEmit --allowJs --checkJs --skipLibCheck --target es2023 --module nodenext scripts/procedencia/nominal-contrato.mjs`. No se escribe Effect ni producto. El control de tipos del consumidor no se anuncia como tipado estricto de los instrumentos adversarios, que incluyen deliberadamente entradas malformadas.

empaquetar.py conserva rutas relativas, SHA256/tamaño/baseSha256, diff textual gzip y binarios explícitos. Ensayo con patch de Nix sobre scratch propio nuevo, sin checkout y sin git apply. `transporte.json` enumera los sobres excluidos del manifiesto para evitar circularidad. No contiene originales PDF: originales.json referencia el CAS propio y el paquete v5 r2 ya preservado. El cotejo final recorre nuevamente toda la base, sin usar índice como prueba.
