#!/usr/bin/env bash
set -uo pipefail
root="$PWD"
out="$root/docs/procedencia/revisiones/madrid-v2-r27-sol"
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$root/.cache/madrid-r27/venv"
nix shell nixpkgs#ruff -c ruff format "$out/revisar.py" "$out/fisico.py" "$out/empaquetar.py" > "$out/formato.log" 2>&1
nix shell nixpkgs#ruff -c ruff check "$out" > "$out/ruff.log" 2>&1
printf 'ruff %s\n' "$?" >> "$out/calidad-codigos.log"
MYPYPATH="$out/stubs:$root/tools/procedencia" nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/madrid-r27/mypy docs/procedencia/revisiones/madrid-v2-r27-sol/revisar.py docs/procedencia/revisiones/madrid-v2-r27-sol/fisico.py docs/procedencia/revisiones/madrid-v2-r27-sol/empaquetar.py' > "$out/mypy.log" 2>&1
printf 'mypy %s\n' "$?" >> "$out/calidad-codigos.log"
bash tools/procedencia/run.sh "$out/fisico.py" "$out/final.json.gz" > "$out/fisico-final.log" 2>&1
bash tools/procedencia/run.sh "$out/empaquetar.py"
