# Comandos y reproducción

Ejecutados desde `/home/elies/.t3/worktrees/IRoboPF/t3-6e018ac6`, base 5799bb03826719a4dd3500a962e2d6bb5124fdca. La entrega está en `/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/comparativa-inflacion-v1`. `root` y `out` en los ejemplos representan esas rutas absolutas. Nix usa la revisión local documentada por implementaciones/comparativa-inflacion/nixpkgs.json; NumPy está fijado a 2.5.4. oracle.json registra versiones reales de Python/NumPy. No instalación global ni cambio de package/lockfiles.

Preparación: `git rev-parse HEAD`; `mkdir -p .cache/comparativa-review`; dependencias compartidas en lectura. La reproducción histórica extrae todo lib de la base examinada para conservar juntas sus dependencias:

```bash
git archive eaed990c620b5fc4d3ff2e74dc68e0c8481c43db lib | tar -x -C .cache/comparativa-review
```

Oracle (ningún cuerpo de generación Excel se ejecuta ni se escribe el libro):

```bash
nix shell nixpkgs#python3 nixpkgs#uv nixpkgs#gcc nixpkgs#zlib -c bash -c '
export LD_LIBRARY_PATH="$(nix eval --raw nixpkgs#gcc.cc.lib.outPath)/lib:$(nix eval --raw nixpkgs#zlib.outPath)/lib"
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/comparativa-review/venv"
flock /tmp/irobopf-validacion-pesada.lock uv run --no-project --python "$(command -v python3)" --with numpy==2.5.4 python /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/comparativa-inflacion-v1/oracle.py "$PWD" /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/comparativa-inflacion-v1'
```

Contraste: `nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun "$out/contrastar.mjs" "$root" "$out"`. `baseline-completa.log` registra el contraste con todas las dependencias históricas; `contraste.log` conserva el ensayo inicial híbrido y no sustituye ese resultado. Salida resultados.json; no expected generado desde TS. El proceso devuelve 0 si las comparaciones principales coinciden; los conteos, controles, cabeceras y factores también se inspeccionan en resultados.json.

Coherencia: misma invocación Bun con coherencia.mjs. Código 1 deliberado por CX-07-B, salida coherencia.json. Ese resultado no constituye un requisito general de aceptación fiscal.

Validación: `nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bash "$out/validar.sh"`. Script conservado con comandos exactos, rutas y logs; validacion.log registra códigos individuales. No todos los nombres solicitados a Vitest existen: el informe precisa los tres archivos ejecutados realmente.

Lint propio adicional, desde `/home/elies/Repos/IRoboPF`, bajo el mismo lock y Nix Bun/Node:

```bash
node_modules/.bin/oxlint --disable-nested-config -c /home/elies/.t3/worktrees/IRoboPF/t3-6e018ac6/.oxlintrc.json docs/procedencia/revisiones/comparativa-inflacion-v1/contrastar.mjs docs/procedencia/revisiones/comparativa-inflacion-v1/coherencia.mjs
node_modules/.bin/eslint -c /home/elies/.t3/worktrees/IRoboPF/t3-6e018ac6/eslint.config.mjs docs/procedencia/revisiones/comparativa-inflacion-v1/contrastar.mjs docs/procedencia/revisiones/comparativa-inflacion-v1/coherencia.mjs
```

Python propio: `nix shell nixpkgs#ruff -c ruff check "$out/oracle.py"` y pase final sobre los scripts Python entregados. Integridad: `UV_PROJECT_ENVIRONMENT="$root/.cache/comparativa-review/corpus-venv" flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/integridad.py" "$root" "$out"`. Wrapper fijado y uv --frozen; ninguna .venv en tools/procedencia.

Antes de añadir el ejecutor Effect de coherencia se ejecutó list/show basics/testing mediante el lanzador bun indicado y se consultaron ejemplos runPromise de packages/effect/src/Effect.ts de la fuente local. No se escribe nuevo motor Effect.

Empaquetado: empaquetar.py genera altas textuales y manifiesto sin mutar VCS. Se conservan resultados, no copias de ejecución. Ningún log supera 1 MB. Los logs vacíos corresponden a programas silenciosos; sus códigos se recogen en el informe y sesiones, no se interpretan como éxito por estar vacíos.
