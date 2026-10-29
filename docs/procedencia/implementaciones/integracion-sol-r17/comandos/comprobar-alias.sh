#!/usr/bin/env bash
set -euo pipefail
export TMPDIR="$PWD/.cache/integracion-r17/tmp"
nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test tests/rastro-anual-procedencia.test.ts --maxWorkers=1
nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
