# Reproducción y códigos

Desde `/home/elies/.t3/worktrees/IRoboPF/t3-9664290b`:

```sh
export UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-9664290b/.cache/revision-editorial-sol/venv
export PYTHONDONTWRITEBYTECODE=1
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/auditar_integridad.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/revisar.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/revisar.py rojos
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/mapear_pasajes.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff -c ruff check docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/revisar.py docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/auditar_integridad.py docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/mapear_pasajes.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy -c mypy --follow-untyped-imports --python-executable "$UV_PROJECT_ENVIRONMENT/bin/python" --cache-dir /home/elies/.t3/worktrees/IRoboPF/t3-9664290b/.cache/revision-editorial-sol/mypy docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/revisar.py docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/auditar_integridad.py docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/mapear_pasajes.py
```

El tercer comando debe terminar1: cuatro rojos documentales previstos, sin fixes del lote. Los54 ejemplos y12 discriminantes son racionales, no ejecuciones del motor. No hay código Effect nuevo. Las16 reglas anti-slop se cotejan aerror en anti-slop.json; no se presenta oxlint de Python ignorado como análisisTypeScript.

Inspección inicial:0, 13422 entradas físicas de HEAD,15 originales,69 páginas y15PNG. Se ejecutó la versión scratch inspeccionar.py, cuyos bytes se conservan en inspeccion-instrumento-original.py.txt. La copia entregada auditar_integridad.py cambia formato e identificadores locales para pasar lint/tipos propios; algoritmo igual. inspeccion.log.gz y resumen.log.gz conservan los listados iniciales sin alterarlos.

Verificador autor:0. Desde `/home/elies/.t3/worktrees/IRoboPF/t3-98a20b70`, con entorno propio absoluto y lock, se ejecutó `bash tools/procedencia/run.sh /home/elies/.t3/worktrees/IRoboPF/t3-9664290b/.cache/revision-editorial-sol/verificador-autor.py`. Única adaptación: resultado se escribe en esta entrega; assert de HEADautor intacto. Se conserva copia textual y diff. No se anuncia pase integrado.

Primer lint/tipos: Ruff1 y mypy1; diagnósticos preservados. Repetición final en codigos-final.log. Primer pase de cuatro contratos:1, tres fallos y un falso positivo de búsqueda de500 corregido en el instrumento propio; log original intacto. Repetición final en rojos-final.log.

Inicialmente `jj log -r @ --no-graph` terminó1 por no existir repositorioJJ; no se inicializó. `rg` ausente delPATH se ejecuta con `nix shell nixpkgs#ripgrep -c rg`. LecturasGit solamente:rev-parse,ls-tree,diff. Ninguna mutaciónVCS. El diff contra baseautor y borrados se conserva en base.json; el cierre físico y recibo de45 archivos en cierre.json/cierre-final.json.

El patch es textual ygzip, sin binarios, sin sí mismo y sin el manifiesto generado después. binarios.json mapea rutas lógicas a objetos porSHA256. El manifiesto conserva path literal,SHA256,size,baseSha256 y no se enumera a sí mismo.
