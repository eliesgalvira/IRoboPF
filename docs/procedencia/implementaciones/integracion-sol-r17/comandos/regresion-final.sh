#!/usr/bin/env bash
set -uo pipefail
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/integracion-r17/uv"
export PYTHONDONTWRITEBYTECODE=1
export TMPDIR="$PWD/.cache/integracion-r17/tmp"
run() { local name="$1"; shift; "$@" > ".cache/integracion-r17/$name.log" 2>&1; local result=$?; echo "$name $result"; }
run rastro-publicacion-final nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun run test tests/contenido-integridad-procedencia.test.ts tests/evidencia-contenido-procedencia.test.ts tests/publicacion-evidencia.test.ts tests/rastro-anual-procedencia.test.ts --maxWorkers=1
run contenido-final nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
run tipos-final nix shell nixpkgs#bun nixpkgs#nodejs -c bun run typecheck
run lint-entrega nix shell nixpkgs#bun nixpkgs#nodejs -c bun run lint
