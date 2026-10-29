# Reproducción

Raíz exacta `/home/elies/.t3/worktrees/IRoboPF/t3-56690dfb`. HEAD `7668bdad60a79a8b3ad8e1e1b911f3d6c223692a`; comparación `82045effc7c34a93682e265d3f4dff796f314a60`.

Todos los procesos de pruebas/tipos y recorridos masivos se ejecutan con `flock /tmp/irobopf-validacion-pesada.lock`, un trabajador. Entorno:

```sh
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/contratos-publicacion-r19-sol/venv"
export TMPDIR="$PWD/.cache/contratos-publicacion-r19-sol/tmp"
export PYTHONDONTWRITEBYTECODE=1
mkdir -p "$TMPDIR"
```

Dentro de `nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bash`, con el lock adquirido:

```sh
node --test --test-concurrency=1 tests/ambito-publicado.test.mjs
bash tools/procedencia/run.sh tests/procedencia-enlaces_test.py
bash tools/procedencia/run.sh tests/test_ambitos_juridicos.py
bun scripts/procedencia/verificar-enlaces.mjs
bun node_modules/vitest/vitest.mjs run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
bun node_modules/vitest/vitest.mjs run tests/contenido-integridad-procedencia.test.ts tests/rastro-anual-procedencia.test.ts tests/evidencia-contenido-procedencia.test.ts tests/publicacion-evidencia.test.ts --maxWorkers=1
bun run typecheck
bun node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config
bun run test:lint
```

La última orden encuentra un problema de localización del fixture: TMPDIR está dentro de `.cache`, ignorada por oxlint; se conserva `antislop.log`. La repetición propia copia el script a `.cache/contratos-publicacion-r19-sol/smoke.mjs`, cambia sus imports `../tools/` por `../../tools/` y añade `--threads=1 --disable-nested-config --no-ignore` a los argumentos de oxlint. No modifica el script original ni su configuración; conserva las comprobaciones de las 16 reglas y los rechazos reales de ambos plugins.

Para los ensayos propios, desde la misma raíz y entorno, bajo el lock:

```sh
node --test --test-concurrency=1 docs/procedencia/revisiones/contratos-publicacion-r19-sol/adversos-node.test.mjs
bun docs/procedencia/revisiones/contratos-publicacion-r19-sol/independiente.mjs
bun docs/procedencia/revisiones/contratos-publicacion-r19-sol/tardio.mjs
bash tools/procedencia/run.sh docs/procedencia/revisiones/contratos-publicacion-r19-sol/evidencia.py
bun docs/procedencia/revisiones/contratos-publicacion-r19-sol/rojo-software.mjs
bun node_modules/eslint/bin/eslint.js docs/procedencia/revisiones/contratos-publicacion-r19-sol/*.mjs
bun node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config docs/procedencia/revisiones/contratos-publicacion-r19-sol/*.mjs
nix shell nixpkgs#ruff -c ruff check docs/procedencia/revisiones/contratos-publicacion-r19-sol/evidencia.py
nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/contratos-publicacion-r19-sol/mypy tools/procedencia/enlaces.py docs/procedencia/revisiones/contratos-publicacion-r19-sol/evidencia.py'
```

`independiente.mjs`, `tardio.mjs` y `rojo-software.mjs` conservan su scratch. Una segunda ejecución debe usar una carpeta nueva para el enlace node_modules de `tardio.mjs`; no borrar ni sustituir originales. Las reproducciones rojas deben seguir fallando mientras el padre no corrija los hallazgos.

`actuales.log` repite las seis pruebas del autor contra R19 mediante copia en scratch: sustituye la raíz `Path(__file__).resolve().parents[1]` por esta raíz absoluta y `docs/procedencia/implementaciones/ambitos-juridicos` por `docs/procedencia/correcciones/integracion-r19/candidatos`; no cambia expectativas ni originales. `evidencia.py` realiza además su cotejo propio de los 264 ámbitos.

Control físico inicial: `git ls-tree -rz` de ambas bases; para cada ruta, `os.lstat`, `os.readlink` si es enlace y SHA256 de los bytes físicos, cotejados con `git cat-file blob <oid>`. Control final: nueva lectura física de todas las entradas HEAD contra sus hashes iniciales, HEAD exacto y `git diff --name-only --diff-filter=D HEAD` vacío. Solo consultas VCS; Jujutsu no está inicializado y no se inicializa. `rg` se habilita por Nix. No se copiaron entornos ni aplicación a docs.

El intento con `--no-ignore` tampoco anula ignorePatterns de la configuración; `antislop-final.log` registra literalmente «No files found to lint». El intento de stdin no era una opción admitida por esta versión (`humo-stdin.log`); no se cuenta como validación. Reproducción definitiva, sin cambiar configuración del proyecto:

```sh
bun docs/procedencia/revisiones/contratos-publicacion-r19-sol/humo.mjs
```

`humo.mjs` mantiene las mismas 16 reglas a error y plugins por ruta absoluta, y crea un config del fixture con solo `ignorePatterns: []` dentro de `.cache/contratos-publicacion-r19-sol/humo`. Analiza allí sample.ts con un trabajador y nested config deshabilitado. `humo-final.log` contiene los dos errores esperados y el éxito de sus aserciones; código del script 0. ESLint/oxlint de esta última versión del script: códigos 0 en `codigos-humo-final.log`. Ruff/evidencia/mypy repetidos tras la corrección del import: 0 en `codigos-final.log`.

La versión final de `evidencia.py` descomprime `inventario-datos.json.gz`, verifica su SHA256 fijado y selecciona los sujetos reales de las 264 propuestas para cotejar identidad/fuente/ruta/valor/unidad/dimensiones. Se repite mediante el wrapper, Ruff y mypy con las órdenes anteriores; códigos 0 en `codigos-identidades.log`.
