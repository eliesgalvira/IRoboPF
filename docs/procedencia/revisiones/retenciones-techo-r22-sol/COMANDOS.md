# Reproducción

Desde el checkout propio `/home/elies/.t3/worktrees/IRoboPF/t3-8fff9f49`. Ningún comando VCS de escritura. Antes de los comandosPython:

```sh
export UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-8fff9f49/.cache/revision-r22-venv
export PYTHONDONTWRITEBYTECODE=1
```

Todos los comandosPython de revisión se ejecutan bajo lock pesado:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-techo-r22-sol/control.py inicial
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-techo-r22-sol/revisar.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-techo-r22-sol/dictaminar.py
```

`revisar.py` conserva por separado stdout/stderr y código de cada invocación original: `repro_rojo.py`(1), `rojos.py`R21(1), `contraste.py --edition ...r21` con los dos métodos numéricos(1), `contraste.py`R22 completo(0). Los argumentos exactos están en `ejecuciones.json`. No ejecutar `precisar.py`: generaría sobre el objeto de revisión.

Calidad: el primer `run.sh -m mypy` falla porque el entorno no contiene mypy; log `mypy-inicial.log`. Se incorpora la herramienta por Nix, sin instalar globalmente ni alterar el proyectoPython:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff -c ruff check docs/procedencia/revisiones/retenciones-techo-r22-sol --output-format concise
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy -c bash tools/procedencia/run.sh -c 'import subprocess; raise SystemExit(subprocess.call(["mypy", "--follow-imports=silent", "--check-untyped-defs", "--cache-dir", "/home/elies/.t3/worktrees/IRoboPF/t3-8fff9f49/.cache/revision-r22-mypy", "docs/procedencia/revisiones/retenciones-techo-r22-sol"]))'
```

El primer diagnóstico real de mypy se conserva en `mypy.log`; reutilización del nombre de variable Decimal/string en script propio, corregida sin tocar objeto revisado. Pases finales en `ruff-final.log` y `mypy-final.log`. No hay TS/Effect nuevo ni se invoca oxlint sobre Python; `anti-slop.json` conserva las16 reglas aerror. No se analiza otra copia del proyecto.

Cierre físico y transporte:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-techo-r22-sol/control.py final
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-techo-r22-sol/empaquetar.py
```

Se usan solo lecturasVCS (`rev-parse`, `ls-tree`, `cat-file`, `diff`, `ls-files`). Los controles cotejan lstat/readlink y bytes de las14.596 entradas, un blob a la vez. Los cuatro metadatos de transporte excluyen su propia autorreferencia. `entrega.json` identifica los otros tres; su hash debe fijarlo la recepción externa. Binarios por ruta/hash, no PDF originales. Todos los archivos de contenido son adiciones y `baseSha256` es null.

La herramienta `rg` faltaba al inicio; las lecturas posteriores usaron rutas ya conocidas, sed y Python mediante Nix, sin instalar ni sustituirla por comandos prohibidos. Ninguna espera del lock constituye prueba ejecutada.

Se conserva además `mypy-empaquetado.log`: faltaba la anotación de lista de líneas de patch en el script propio. Tras añadirla, mypy pasa en los cuatro scripts; Ruff también pasa. Son ajustes de los instrumentos de esta revisión, sin modificar R22 ni sus expectativas.
