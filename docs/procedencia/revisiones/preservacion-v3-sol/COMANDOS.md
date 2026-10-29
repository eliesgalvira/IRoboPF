# Reproducción

Desde `/home/elies/.t3/worktrees/IRoboPF/t3-3eb23c23`. No ejecutar el `main` del recolector sobre entregas ajenas: escribe recibos allí. Esta revisión importa su API y entrega sus propios recibos. Nunca ejecutar `collect` sobre el manifiesto v3 preservado.

```bash
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-v3-sol/uv"
export PYTHONDONTWRITEBYTECODE=1
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v3-sol/auditar.py inicio
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v3-sol/auditar.py copias
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v3-sol/adversos_test.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh tests/procedencia-preservacion_test.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v3-sol/auditar.py posteriores
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v3-sol/evidencia.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff -c ruff check tools/procedencia/preservacion.py tools/procedencia/preservacion_urls.py docs/procedencia/preservacion-v3/*.py docs/procedencia/revisiones/preservacion-v3-sol/*.py
export UV_CACHE_DIR="$PWD/.cache/preservacion-v3-sol/uv-cache"
export TMPDIR="$PWD/.cache/preservacion-v3-sol/tmp"
flock /tmp/irobopf-validacion-pesada.lock nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/preservacion-v3-sol/mypy tools/procedencia/preservacion.py tools/procedencia/preservacion_urls.py docs/procedencia/preservacion-v3/*.py docs/procedencia/revisiones/preservacion-v3-sol/*.py'
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v3-sol/auditar.py cierre
```

`copias` exige destino inexistente. Para repetirlo se debe elegir otro destino literal en una copia del script dentro del scratch; nunca borrar o sobrescribir la restauración conservada. Los adversos crean carpetas nuevas y conservan los residuos. No necesitan originales oficiales. Los rojos son intencionados y no deben convertirse en verde editando expectativas.

Lecturas iniciales puntuales de documentación y código se hicieron sin flock; recorridos del árbol, hashes completos, restauración, pruebas, lint y tipos usan el lock y un trabajador. No hay TypeScript/Effect propio: anti-slop se controla como configuración de 16 reglas a error y no se afirma un typecheck de aplicación nuevo. No hay Next build, servidor, preview ni suites legacy.

Los comandos de lectura VCS fueron `jj log -r @ --no-graph -T 'commit_id ++ "\n"'` (salida 1: no hay repositorio JJ), `git rev-parse HEAD`, `git ls-tree -rz <base>`, `git cat-file blob <oid>`, `git diff <base> --stat` y `git diff <base> --diff-filter=D --name-only`. No se inicializa JJ ni se muta VCS.

Oxlint se ejecutó con el enlace de lectura `/home/elies/.t3/worktrees/IRoboPF/t3-3eb23c23/node_modules -> /home/elies/Repos/IRoboPF/node_modules`:

```bash
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bash -c '/home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config'
```

Códigos observados: árbol inicial 0, copias/restauración 0, adversos 1 (cuatro FAIL y un ERROR esperados como reproducciones), 19 regresiones 0, Ruff inicial 0, mypy inicial 1, cotejo posterior 0, evidencia documental/configuración 0 y oxlint 0. La repetición final de calidad tiene logs separados y conserva el primer diagnóstico; la ausencia de salida de oxlint es un pase correcto. Nix/uv descargó herramientas de tipado al preparar su entorno local; no hubo transferencia del corpus ni descarga documental.

Cierre: cotejo físico final 0; Ruff final 0; mypy final 1, únicamente el diagnóstico del recolector ajeno (nueve fuentes comprobadas); mypy --version 0, versión 2.4.1. No se editaron las expectativas rojas ni se corrigió el producto.
