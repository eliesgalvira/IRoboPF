#!/usr/bin/env bash
set -u
out=docs/procedencia/revisiones/contratos-r21-sol
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/contratos-r21-sol/venv" PYTHONDONTWRITEBYTECODE=1
run() {
 local name="$1"
 shift
 "$@" > "$out/$name.log" 2>&1
 printf '%s %s\n' "$name" "$?" | tee -a "$out/codigos.log"
}
run historia bun "$out/historia.mjs"
run contenido bun node_modules/vitest/vitest.mjs run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
run oxlint bun node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config scripts/procedencia/ambito-publicado.mjs scripts/procedencia/explicacion-version.mjs scripts/procedencia/contenido-verificar.mjs "$out"
run eslint bun node_modules/eslint/bin/eslint.js "$out"/*.mjs
run tipos bun run typecheck
run ruff nix shell nixpkgs#ruff -c ruff check "$out"
run mypy nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/contratos-r21-sol/mypy docs/procedencia/revisiones/contratos-r21-sol/*.py'
