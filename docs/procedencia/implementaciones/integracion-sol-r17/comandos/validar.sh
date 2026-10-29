#!/usr/bin/env bash
set -uo pipefail
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/integracion-r17/uv"
export PYTHONDONTWRITEBYTECODE=1
export TMPDIR="$PWD/.cache/integracion-r17/tmp"
mkdir -p "$TMPDIR"
run() { local name="$1"; shift; "$@" > ".cache/integracion-r17/$name.log" 2>&1; local result=$?; echo "$name $result"; }
run corpus bash tools/procedencia/run.sh tests/procedencia-corpus_test.py
run puente bash tools/procedencia/run.sh tests/procedencia-enlaces_test.py
run ambitos bash tools/procedencia/run.sh tests/test_ambitos_juridicos.py
run publicacion-node nix shell nixpkgs#nodejs -c node --test --test-concurrency=1 tests/ambito-publicado.test.mjs
run preservacion bash tools/procedencia/run.sh tests/procedencia-preservacion_test.py
run lint nix shell nixpkgs#bun nixpkgs#nodejs -c bun run lint
run tipos nix shell nixpkgs#bun nixpkgs#nodejs -c bun run typecheck
run anti-slop nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test:lint
