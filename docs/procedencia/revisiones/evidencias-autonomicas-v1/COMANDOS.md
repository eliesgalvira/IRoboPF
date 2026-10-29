# Comandos ejecutados y resultados

Directorio de trabajo: `/home/elies/.t3/worktrees/IRoboPF/t3-12847312`.

- `git rev-parse HEAD`: c61a306107f280c399eb57e57a7c45452bd68864.
- `git show ed6a43fd750de05609abc3710dabdc2f8261020c:<ruta>`: lecturas del manifiesto, gzip, fuentes e inputs; invocadas por revisar.py. Sin mutaciones.
- `git ls-tree -r --name-only c61a306107f280c399eb57e57a7c45452bd68864`: 5.281 rutas, todas presentes por comprobación Python de existencia.
- `flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v1/revisar.py`: dos ejecuciones completas, salida 0; segunda añade controles de localizadores y manifiesto. Resultados en ejecucion.log y ejecucion-final.log. La última edición posterior solo añade anotaciones de tipos a tres diccionarios y su import.
- `nix shell nixpkgs#ruff nixpkgs#mypy -c bash -c 'ruff check --no-cache /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v1/revisar.py; flock /tmp/irobopf-validacion-pesada.lock mypy --cache-dir=/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v1/mypy-cache --follow-imports=skip --ignore-missing-imports --check-untyped-defs /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v1/revisar.py'`: primera vez Ruff correcto y cuatro errores de tipos; segunda ambos correctos. Logs separados, sin ocultar el fallo.

Se usaron pequeños bloques Python mediante `nix shell nixpkgs#python3 -c python3 -` para verificar los ejercicios de fuente/símbolo de los 136 payloads, comparar razones/objeciones de las 317 decisiones y elaborar el manifiesto. Estos controles no reconstruyen el inventario ni ejecutan el motor. Los nueve PNG se abrieron individualmente para inspección visual mediante view_image, además de su regeneración por script.

El lanzador run.sh prepara automáticamente un entorno uv: en la primera ejecución creó tools/procedencia/.venv. No hubo instalaciones globales, descargas documentales, cambios de package/lockfiles/CI, Next build ni suites legacy. Los generadores ajenos no se ejecutaron.
