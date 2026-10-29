#!/usr/bin/env bash
set -u
out="$PWD/docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol"
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/rectificaciones-r21/venv" PYTHONDONTWRITEBYTECODE=1
bash tools/procedencia/run.sh "$out/rojos.py" > "$out/rojos.log" 2>&1
code=$?
printf '\nexitCode=%s\n' "$code" >> "$out/rojos.log"
[ "$code" = 1 ] || exit 2
nix shell nixpkgs#ruff nixpkgs#mypy --command bash -c 'ruff check "$1"/*.py; r=$?; mypy --check-untyped-defs --follow-untyped-imports --cache-dir "$2" "$1"/*.py; t=$?; exit $((r || t))' audit "$out" "$PWD/.cache/rectificaciones-r21/mypy" > "$out/calidad.log" 2>&1
code=$?
printf '\nexitCode=%s\n' "$code" >> "$out/calidad.log"
exit "$code"
