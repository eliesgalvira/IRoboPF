# Reproducción de la revisión R19 estatal

Raíz literal: `/home/elies/.t3/worktrees/IRoboPF/t3-dbfb14c8`. Todos los comandos siguientes parten de ella. Ninguno modifica fuentes de producto ni registros. Nix proporciona las herramientas; el wrapper fija Python 3.13 y PyMuPDF 1.26.7 con uv.lock.

```sh
export UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-dbfb14c8/.cache/bindings-estatales-r19-sol/venv
export UV_CACHE_DIR=/home/elies/.t3/worktrees/IRoboPF/t3-dbfb14c8/.cache/bindings-estatales-r19-sol/uv-cache
export PYTHONDONTWRITEBYTECODE=1
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/bindings-estatales-r19-sol/revisar.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/bindings-estatales-r19-sol/primarios.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/bindings-estatales-r19-sol/fronteras.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/bindings-estatales-r19-sol/cadena.py
```

Salidas en `revision.log`, `primarios.log`, `fronteras.log` y `cadena.log`. La revisión inicial y los primarios terminaron con código 0. Los códigos finales de fronteras/calidad están en `codigos-calidad.log`. El primer fronteras falló con código 1 por comparar las cadenas `17707.2` y `17707.20`: el instrumento se corrigió para usar Decimal sin cambiar ningún dato. Se conserva `fronteras-primer-intento.log`.

Cadena terminó finalmente con código 0. Su primer intento usaba el ancla `da-35`, inexistente en la captura. Se comprobó el localizador histórico real `datrigesimaquinta`, sin cambiar original, URL ni versión. Se conserva `cadena-primer-intento.log` con código 1.

Calidad ejecutada bajo el mismo flock, secuencialmente:

```sh
nix shell nixpkgs#ruff -c ruff check docs/procedencia/revisiones/bindings-estatales-r19-sol
export MYPYPATH=/home/elies/.t3/worktrees/IRoboPF/t3-dbfb14c8/tools/procedencia
nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema mypy --follow-imports=silent --check-untyped-defs --disable-error-code=import-untyped --cache-dir .cache/bindings-estatales-r19-sol/mypy docs/procedencia/revisiones/bindings-estatales-r19-sol/*.py'
nix shell nixpkgs#bun nixpkgs#nodejs -c node_modules/.bin/oxlint --threads=1 --disable-nested-config lib/dominio/irpf/cuotas/escalas-publicadas.ts scripts/procedencia/ambito-publicado.mjs
nix shell nixpkgs#bun nixpkgs#nodejs -c bun scripts/test-lint.mjs
```

Logs: `ruff.log`, `mypy.log`, `anti-slop.log`; resumen en `codigos-calidad.log`. El primer mypy terminó con código 1: faltaba MYPYPATH y dos anotaciones de colecciones del instrumento; PyMuPDF no trae stubs. Se conservan `mypy-primer-intento.log` y `codigos-calidad-primer-intento.log`. El pase final comprueba cuerpos de las funciones propias; los imports del corpus siguen silenciosamente y se declara explícitamente el límite de PyMuPDF no tipado. No se relaja ninguna regla anti-slop ni se presenta esto como typecheck de toda la aplicación. No hay código Effect nuevo.

Cierre, después de congelar INFORME.md:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/bindings-estatales-r19-sol/cerrar.py
```

`cierre.log` conserva salida y código del comando real; `informe-congelado.json` fija hash del informe, atestaciones y rechazos de la puerta real. Este log abierto se excluye expresamente del manifiesto. El cierre relee los archivos físicos y verifica todos los hashes del manifiesto ya generado. Repetirlo solo con los originales y el registro real preservados; no adaptar un taskId inventado si falta el registro. Los PNG nuevos están por hash en la entrega. Los demás se regeneran con `primarios.py`, sin necesidad de servidor o preview.
