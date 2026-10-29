# Reproducción

Desde raíz del checkout. Un solo ejecutor; ningún comando VCS mutante.

```sh
nix shell nixpkgs#bun nixpkgs#nodejs -c bun docs/procedencia/revisiones/retenciones-2020-2026/casos.ts > docs/procedencia/revisiones/retenciones-2020-2026/ejecucion-ts.json
nix shell nixpkgs#bun nixpkgs#nodejs -c bun x oxlint docs/procedencia/revisiones/retenciones-2020-2026/casos.ts
nix shell nixpkgs#bun nixpkgs#nodejs -c bun x eslint docs/procedencia/revisiones/retenciones-2020-2026/casos.ts
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun x tsc --noEmit -p docs/procedencia/revisiones/retenciones-2020-2026/tsconfig.json
```

Los tres controles del ejecutor terminaron con código0. No se desactivó regla alguna. Primer intento de typecheck detectó import node:fs; se sustituyó por salida estándar capturada desde shell. El primer lint detectó spread condicional vacío y el serializador genérico; se corrigieron y los NaN se conservan mediante campos nonFinite explícitos.

Scripts de investigación preservados como `.py` en esta carpeta: verificar (hashes/extracción/referencias), contrastar (tablas TS y expected Decimal), visual y visual-extra. Ejecutarlos desde raíz mediante Python Nix y `uv run --with pymupdf` para los que importan PyMuPDF. La extracción final es get_text(clip) retirando solo el salto final añadido por la API. Los intentos con extractTextbox se interrumpieron por coste y no se declaran correctos. El código Python es herramienta documental, no modifica motor. Los scripts visuales deben ejecutarse bajo el mismo flock.

```sh
nix shell nixpkgs#python3 nixpkgs#stdenv.cc.cc.lib -c bash -c 'export LD_LIBRARY_PATH="$(nix eval --raw nixpkgs#stdenv.cc.cc.lib.outPath)/lib"; uv run --python "$(command -v python3)" --with pymupdf python docs/procedencia/revisiones/retenciones-2020-2026/verificar.py'
```

Descarga adicional mediante descargar.py, root exclusivo de scratch, allow-host exacto www3.agenciatributaria.gob.es. Conserva lock, UA y pausa del helper. No instala nada global ni escribe en corpus raíz.

Python: Ruff de Nix formateó y comprobó los nueve scripts, sin reglas desactivadas. El primer intento con binario Ruff de uv no arrancó por el enlazador de NixOS; se usó `nix shell nixpkgs#ruff`, sin instalación global. `validacion-python.log` conserva el resultado final.
