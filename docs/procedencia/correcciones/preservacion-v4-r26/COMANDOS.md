# Comandos R26

Desde `/home/elies/Repos/IRoboPF`. Todas las pruebas, calidad y lecturas integrales de paquetes se serializan con `flock /tmp/irobopf-validacion-pesada.lock`. Se usan `PYTHONDONTWRITEBYTECODE=1` y `UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv`.

1. `bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v4-r24-sol/rojos.py` antes del cambio: exit 1, cinco fallos esperados, `rojos-antes.log`.
2. `bash tools/procedencia/run.sh docs/procedencia/correcciones/preservacion-v4-r26/controles.py` antes: exit 1, diez métodos y doce aserciones/subcasos fallidos, `adicionales-antes.log`.
3. Ambos comandos después: exit 0, cinco y diez métodos respectivamente, `rojos-despues.log` y `adicionales-despues.log`.
4. `bash tools/procedencia/run.sh docs/procedencia/correcciones/preservacion-v4-r26/reales.py`: exit 0, dos copias reales completas, `reales.log` y `copias-reales.json`.
5. `bash tools/procedencia/run.sh docs/procedencia/preservacion-v4-sol/adversos.py`: exit 0, nueve métodos, `regresiones.log`.
6. `nix shell nixpkgs#ruff -c ruff check docs/procedencia/preservacion-v4-sol/edicion.py docs/procedencia/correcciones/preservacion-v4-r26`: exit 0, `ruff.log`.
7. Con `MYPYPATH=/home/elies/Repos/IRoboPF/tools/procedencia:/home/elies/Repos/IRoboPF/docs/procedencia/preservacion-v4-sol`, `nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/orquestador-recepcion/r26/mypy docs/procedencia/preservacion-v4-sol/edicion.py docs/procedencia/correcciones/preservacion-v4-r26/*.py'`: exit 0, tres fuentes, `mypy.log`.

No se ejecutó collect, no se regeneró un manifiesto y no se escribió en los paquetes reales. Los residuos sintéticos quedan en cachés propias; no se borran originales. Las lecturas de cuatro fuentes ausentes de v4 usan los localizadores declarados en documentos ya recibidos, ambos hashes y tamaño, sin nuevas peticiones HTTP ni fechas de adquisición inventadas.
