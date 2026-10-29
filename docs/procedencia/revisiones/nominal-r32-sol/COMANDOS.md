# Reproducción R32

Raíz: checkout T3 de HEAD 846f25e183ba07414065d4e6bdf9e98311b98a17. Solo lectura VCS. Ningún commit, registro o atestación.

El cotejo inicial se ejecutó inline mediante `nix shell nixpkgs#python3 nixpkgs#ripgrep`, `flock /tmp/irobopf-recepcion-acotada.lock`, `git ls-tree -rz HEAD` y un `git cat-file blob` por entrada. Terminó con 16.855 entradas y diferencias/diff vacíos antes de mkdir o cualquier escritura. Se conserva el resultado en inicial.json. Python estándar se suministró por Nix para este arranque sin dependencias; los instrumentos posteriores usan el run.sh del proyecto.

Para repetir las recetas `*.py.txt` y `*.sh.txt`, copiar a `.cache/revision-nominal-r32/` con su nombre sin `.txt`. No ejecutar scripts históricos en sus carpetas de origen. Los `.mjs` de esta entrega también se ejecutan desde la raíz; no tienen efectos fuera del ámbito propio.

```sh
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/revision-nominal-r32/uv"
bash tools/procedencia/run.sh .cache/revision-nominal-r32/preparar.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r32/fixture.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node .cache/revision-nominal-r32/casos.mjs
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r32/schema.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun nixpkgs#python3 -c node .cache/revision-nominal-r32/coordinador.mjs
bash tools/procedencia/run.sh .cache/revision-nominal-r32/controles-preparar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun nixpkgs#python3 -c bash .cache/revision-nominal-r32/regresiones.sh
bash tools/procedencia/run.sh .cache/revision-nominal-r32/calidad-preparar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c bash .cache/revision-nominal-r32/calidad.sh
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh .cache/revision-nominal-r32/fisico.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#patch -c bash tools/procedencia/run.sh .cache/revision-nominal-r32/empaquetar.py
```

Los comandos se ejecutaron por separado: códigos y logs, no su mera invocación, determinan el resultado. Los controles no anidan bloqueos. El coordinador reconstruye el inventario real, usa schema Python completo y contrasta documentación/CAS; el positivo exacto distingue rechazo sustantivo de fallo ambiental. Node anterior viene del objeto de la base indicada en archivos-precommit.json; consumidores.json y fix.diff fijan sus bytes exactos. Los mutantes originales se cotejan por hash contra los archivos .json.txt conservados.

No se escribe Effect. Lint usa una vista propia con los plugins/configuración conservados y node_modules del padre solo lectura, oxlint un hilo y --disable-nested-config, las 16 reglas a error. Tipos: checkJs del consumidor revisado; los instrumentos de entradas deliberadamente malformadas no se anuncian como tipados estrictamente.

Durante la preparación se elimina una variable root sin uso del instrumento propio; no cambia los casos ni los esperados, ni el consumidor examinado. Ninguna corrección de producto se realiza en esta revisión.

schemas-base.diff contrasta los cuatro schemas nominales/completo con la base anterior: vacío, sin sustitución de schema al cargar el consumidor previo. El transporte declara también emptyFiles, que deben crearse vacíos al reconstruir archivos nuevos sin contenido; no tienen hunks textuales.

Tras el primer lint, se conserva oxlint-antes.log/calidad-exit-antes.log y se cambia únicamente la guarda de fabricación de fixtures (instrumento-lint.diff). Se repite casos.mjs y calidad.sh bajo el bloqueo; paridad-tras-lint.json exige igualdad completa de los JSON de casos previos y posteriores, incluidos hashes y resultados. No se relaja ninguna regla anti-slop ni se altera producto.

La comparación detectó que el instrumento R30 adaptado había reutilizado la ruta propia casos-node.json; sus 61 resultados se conservan en r30-casos-node.json. r30-rutas-salida.diff impide la colisión futura. La paridad final se obtiene reejecutando la guarda anterior reconstruida (`casos-antes-guard.mjs`, salida separada), no comparando aquella salida sobrescrita como si fuera la original de 39. Véase incidencias-instrumentales.json. La comparación diagnóstica posterior que intentaba acceder a rows en el JSON R30 falla con KeyError: ese instrumento tiene cases, no rows; confirma la colisión, no un defecto de producto.
