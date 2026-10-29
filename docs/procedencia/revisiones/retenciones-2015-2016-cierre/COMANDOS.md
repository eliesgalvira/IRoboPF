# Comandos y resultados

Ejecutar desde el checkout base. Ninguna mutación VCS. Git solo lectura: `git rev-parse HEAD`, `git diff --stat 65cff4fd8eb8c6269c2ce97b88e770aa711bff7f`, `git status --short`, `git ls-tree -rz --name-only BASE`. Comprobación lstat/readlink por cada ruta: control-base.json. rg y python3 no estaban inicialmente en PATH; se usó nix shell nixpkgs#ripgrep y nixpkgs#python3. El primer flock python3 falló sin ejecutar lectura. No se instaló globalmente.

Pruebas:

```sh
flock /tmp/irobopf-validacion-pesada.lock env UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-0d5d5c94/.cache/retenciones-cierre/venv bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-2015-2016-cierre/casos.py
```

Resultado:54 escenarios,57 aserciones. El primer pase y el posterior al arreglo de anotaciones están en casos.log y casos-final.log; no sumarlos. Son pruebas documentales sin motor.

Lint: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy -c bash -c 'ruff check RUTA/casos.py && mypy --strict --cache-dir /home/elies/.t3/worktrees/IRoboPF/t3-0d5d5c94/.cache/retenciones-cierre/mypy RUTA/casos.py'`, con RUTA absoluta de esta entrega. Diagnóstico inicial en lint-tipos.log; nombres distintos para variables Decimal/string/tuple resuelven cuatro errores. Pase final en lint-tipos-final.log. No se ejecutó oxlint porque no hay JS/TS propio; las16 severidades se cotejaron en control-base.json.

Extracción y renders mediante el mismo wrapper, entorno absoluto y flock. PyMuPDF1.26.7, get_text de página completa y get_pixmap(dpi=100). Cada cita contiene hash del original, página física1-based, rectángulo en puntos y hash del PNG. La geometría es contextual, no crop fino por celda. Los originales se abren desde las rutas absolutas de originales-verificados.json. No hay OCR ni saneamiento de números. Se omiten metadatos internos y cabeceras de sesión.

Algunas lecturas largas por herramienta quedaron truncadas; se hicieron lecturas adicionales por rangos, pero no se declara lectura completa de todas las fuentes. No se confunde extracción a scratch con lectura personal. mapa-paginas.json fija el límite visual real.
