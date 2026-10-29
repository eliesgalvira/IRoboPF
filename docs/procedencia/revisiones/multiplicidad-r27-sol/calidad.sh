set -uo pipefail
out="$PWD/docs/procedencia/revisiones/multiplicidad-r27-sol"
tree="$PWD/.cache/multiplicidad-r27-sol/calidad"
mkdir -p "$tree/review" "$tree/tools/oxlint"
cp "$PWD/.oxlintrc.json" "$tree/.oxlintrc.json"
cp "$PWD/eslint.config.mjs" "$tree/eslint.config.mjs"
cp -r "$PWD/tools/oxlint/anti-slop" "$tree/tools/oxlint/anti-slop"
cp "$out"/*.mjs "$tree/review/"
ln -s /home/elies/Repos/IRoboPF/node_modules "$tree/node_modules"
cd "$tree"
bun /home/elies/Repos/IRoboPF/node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config -c .oxlintrc.json review > "$out/oxlint.log" 2>&1; echo "oxlint=$?"
bun /home/elies/Repos/IRoboPF/node_modules/eslint/bin/eslint.js review > "$out/eslint.log" 2>&1; echo "eslint=$?"
cd /home/elies/.t3/worktrees/IRoboPF/t3-639ae305
ruff check "$out"/*.py > "$out/ruff.log" 2>&1; echo "ruff=$?"
export PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-639ae305/.cache/multiplicidad-r27-sol/venv
uv run --project tools/procedencia --frozen --python "$(command -v python3)" python -m mypy --cache-dir "$tree/mypy" --check-untyped-defs --follow-imports=silent "$out"/*.py > "$out/mypy.log" 2>&1; echo "mypy=$?"
