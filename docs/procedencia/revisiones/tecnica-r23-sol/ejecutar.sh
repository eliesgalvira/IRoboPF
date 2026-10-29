#!/usr/bin/env bash
set -u
out=docs/procedencia/revisiones/tecnica-r23-sol
export PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/tecnica-r23-sol/venv"
run() { local name="$1"; shift; "$@" > "$out/$name.log" 2>&1; printf '%s %s\n' "$name" "$?" | tee -a "$out/codigos.log"; }
run anterior bun test "$out/scratch/anterior.test.mjs"
run actuales bun test tests/software-recibo.test.mjs "$out/ast.test.mjs" "$out/adversos.test.mjs"
run historia bun "$out/historia.mjs"
run rutas bun "$out/rutas.mjs"
run identidades bash tools/procedencia/run.sh "$out/identidades.py"
run derivacion bash tools/procedencia/run.sh "$out/derivar.py"
run contenido bun node_modules/vitest/vitest.mjs run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
run oxlint bun node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config scripts/procedencia/explicacion-version.mjs tests/software-recibo.test.mjs "$out"
run eslint bun node_modules/eslint/bin/eslint.js "$out"/*.mjs
run tipos bun run typecheck
