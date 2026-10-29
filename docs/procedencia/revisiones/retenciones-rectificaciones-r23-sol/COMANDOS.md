# Comandos y límites de reproducción

Desde `/home/elies/.t3/worktrees/IRoboPF/t3-18de900f`:

```sh
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-18de900f/.cache/revision-r23-uv
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-rectificaciones-r23-sol/cotejo.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-rectificaciones-r23-sol/revisar.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-rectificaciones-r23-sol/dictaminar.py
```

La primera salida se conserva en recepcion.json; repetir al final con salida control-final.json. El cotejo de recepción solo realiza lstat/readlink/bytes y lecturasVCS, un blob por vez. Renders, pruebas y tipos usan siempre el bloqueo pesado. No hay simultaneidad de trabajadores propios dentro del bloqueo. `revisar.py` reproduce rojo.py (exit1) y contraste.py (exit0) del padre con el intérprete del entorno real y captura stdout/stderr propios; no cambia los scripts ni esperados. No se invoca rectificar.py, que escribiría la entrega ajena.

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff --command ruff check docs/procedencia/revisiones/retenciones-rectificaciones-r23-sol
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy --command bash tools/procedencia/run.sh -c 'import subprocess,sys; raise SystemExit(subprocess.call(["mypy", "--python-executable", sys.executable, "--follow-imports=silent", "--check-untyped-defs", "--cache-dir", "/home/elies/.t3/worktrees/IRoboPF/t3-18de900f/.cache/revision-r23-mypy", "docs/procedencia/revisiones/retenciones-rectificaciones-r23-sol"]))'
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-rectificaciones-r23-sol/empaquetar.py
```

Se conserva el primer pase de Ruff y se formatean solo instrumentos propios. Los logs finales indican el resultado real. No hay TS ni Effect nuevo; no se atribuye a Ruff o Mypy una validación TypeScript. `anti-slop.json` coteja las16 reglas aerror de la configuración recibida. No corresponde ejecutar oxlint sobre programasPython; tampoco se relajan reglas por entorno. No se ejecutan buildNext, suites legacy masivas ni compiladoresRust fuera de alcance.

El pase de cierre de Mypy añade `--follow-untyped-imports` a la invocación anterior: analiza la biblioteca PyMuPDF instalada aunque no declare py.typed, sin ignorar imports ausentes ni silenciar errores del instrumento propio. `mypy.log` conserva los dos diagnósticos iniciales; `mypy-final.log` conserva la falta de marcador; el resultado de esa invocación ampliada está en `mypy-cierre.log`. El cambio propio de variable `expected_exit` separa el código de salida entero del esperado Decimal expresado como string, sin cambiar valores.

`rg` no estaba en el entorno inicial. Las rutas conocidas se leen con cat y el resto con Python mediante el shellNix fijado; no se instala globalmente. Python siempre pasa por tools/procedencia/run.sh con el entorno UV absoluto propio. No se usa tools/procedencia/.venv ni se escribe node_modules. Las lecturas de originales del padre se limitan a paths/hash CAS ya entregados. Las esperas de locks no se cuentan como verificaciones ejecutadas.

Empaquetado: todos los archivos propios son altas; baseSha256=null. Se excluyen manifiesto.json, binarios.json, entrega.patch.gz y entrega.json de su propia enumeración. entrega.json fija los otros tres; su ancla corresponde al receptor. Los controles/logs mayores1MB se comprimen en la carpeta propia, sin tocar originales ajenos. El parche contiene solo texto y los binarios se enumeran por ruta/hash. No hay commit ni operaciónVCS mutante.

Control de transporte: el primer `git apply --check` hacia delante rechazó las altas porque los archivos ya existen en este checkout. Ese diagnóstico no es un fallo fiscal ni justifica borrar archivos o crear otro checkout. Se coteja cada ruta contra su hash y se usa `git apply --reverse --check` sobre el parche textual para verificarlo contra los bytes entregados, sin aplicar ni revertir nada y sin tocar índice. El manifiesto excluye los cuatro metadatos de transporte para evitar autorreferencia.
