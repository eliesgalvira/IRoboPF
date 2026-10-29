# Ejecución local

Directorio: `/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688`.
Todos los comandos Python se ejecutan con:

```sh
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-v5-sol/uv"
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/fisico.py inicio
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/recolector.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/pruebas.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/transportar.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/recuperar.py
```

El recolector y transportador crean destinos exclusivos. No repetirlos sobre las rutas ya existentes. verify/confirm del consumidor admiten comprobación repetida sin sobrescribir. Los controles conservan residuos en caché propia; un fallo no autoriza borrar ni cambiar esperados.

Nix proporciona intérpretes y herramientas. uv usa el lock del proyecto, entorno absoluto propio. No se instalan dependencias globales ni en tools/procedencia/.venv. No hay TypeScript/Effect nuevo. Ruff/mypy comprueban Python propio; el humo oxlint comprueba carga de las 16 reglas a error, con un hilo y sin configuración anidada, en un TS intacto. No sustituye lint o tipos Python.

No usar collect de v3/v4 ni ejecutar código histórico arbitrario. Los originales se leen del paquete v4 fijado y CAS del mapa entregado, sin red. Se preservan las versiones anteriores. Para revisar solo restauración, el lector debe resolver rutas mediante las dependencias del manifiesto y disponer del entorno Nix/Python fijado: el paquete no contiene un cierre binario de Nix ni permite reinstalarlo desde cero sin almacén local.

La ejecución final usa `PIN-final.json`, `manifest-final.json.gz` y caché `manifest-final.json`. La primera colección de `coleccion.log` se conserva como ensayo; `coleccion-final.log` fija la selección final. Se conservan `antes.log`, `despues.log` y `regresiones.log` sin modificar esperados.

Recuperación con herramientas materializadas del paquete, usando la misma caché absoluta pero sin leer CAS alternativos:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/materializar.py
flock /tmp/irobopf-validacion-pesada.lock bash .cache/preservacion-v5-sol/software-restaurado/tools/procedencia/run.sh .cache/preservacion-v5-sol/software-restaurado/docs/procedencia/preservacion-v5-sol/recuperar.py --cache "$PWD/.cache/preservacion-v5-sol" --output "$PWD/docs/procedencia/preservacion-v5-sol/recuperacion.json"
flock /tmp/irobopf-validacion-pesada.lock bash .cache/preservacion-v5-sol/software-restaurado/tools/procedencia/run.sh .cache/preservacion-v5-sol/software-restaurado/docs/procedencia/preservacion-v5-sol/selector_ine.py --cache "$PWD/.cache/preservacion-v5-sol" --output "$PWD/docs/procedencia/preservacion-v5-sol/selectores-ine.json"
```

El entorno `UV_PROJECT_ENVIRONMENT` sigue siendo absoluto en la caché propia. Las herramientas y locks se leen desde restauración; uv puede reutilizar el entorno ya instalado y fijado. No es demostración de reinstalación offline desde un sistema vacío.

Corrección r2, conservando todas las rutas y pins anteriores:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/recolector2.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/cierre_software.py --cache "$PWD/.cache/preservacion-v5-sol/r2"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/materializar2.py --cache "$PWD/.cache/preservacion-v5-sol/r2"
```

Para recuperación r2 se usa el runner, `recuperar2.py` y `selector_ine.py` bajo `.cache/preservacion-v5-sol/r2/software-restaurado/`, con `--cache "$PWD/.cache/preservacion-v5-sol/r2"` y salidas a `docs/procedencia/preservacion-v5-sol/r2/`. No repetir los colectores/materializadores sobre destinos existentes; conservar cualquier parcial.

Suplemento ya ejecutado bajo bloqueo pesado, con imports del consumidor restaurado y datos exclusivamente de r2:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/suplemento.py --cache "$PWD/.cache/preservacion-v5-sol/r2" --output "$PWD/docs/procedencia/preservacion-v5-sol/r2/suplemento.json"
```

Ruff: `RUFF_CACHE_DIR="$PWD/.cache/preservacion-v5-sol/ruff"`, `ruff check docs/procedencia/preservacion-v5-sol/*.py`. Tipos: `mypy --follow-imports=skip --ignore-missing-imports --check-untyped-defs --cache-dir "$PWD/.cache/preservacion-v5-sol/mypy" docs/procedencia/preservacion-v5-sol/*.py`, ambos mediante Nix y bloqueo pesado. No hay exclusiones de reglas ni esperados cambiados.
