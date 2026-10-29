#!/usr/bin/env bash
set -u
out="$PWD/docs/procedencia/revisiones/registro-exacto-r25-sol"
tree="$PWD/.cache/registro-exacto-r25-sol/ensayo"
export PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/registro-exacto-r25-sol/venv" MYPYPATH="$PWD/tools/procedencia"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff -c ruff check "$out" > "$out/ruff.log" 2>&1
printf 'ruff %s\n' "$?" >> "$out/codigos.log"
flock /tmp/irobopf-validacion-pesada.lock nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/registro-exacto-r25-sol/mypy docs/procedencia/revisiones/registro-exacto-r25-sol/*.py' > "$out/mypy.log" 2>&1
printf 'mypy %s\n' "$?" >> "$out/codigos.log"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bash -c 'cd "$1" && bun /home/elies/Repos/IRoboPF/node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config -c .oxlintrc.json "$2"/*.mjs' quality "$tree" "$out" > "$out/oxlint.log" 2>&1
printf 'oxlint %s\n' "$?" >> "$out/codigos.log"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bash -c 'cd "$1" && bun /home/elies/Repos/IRoboPF/node_modules/eslint/bin/eslint.js --no-ignore "$2"/*.mjs' quality "$tree" "$out" > "$out/eslint.log" 2>&1
printf 'eslint %s\n' "$?" >> "$out/codigos.log"
