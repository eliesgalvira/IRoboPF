# Reproducción del alcance R21

Desde la raíz, con `UV_PROJECT_ENVIRONMENT` absoluto dentro de la caché, `PYTHONDONTWRITEBYTECODE=1` y un proceso pesado bajo `flock /tmp/irobopf-validacion-pesada.lock`:

```sh
bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v3-sol/adversos_test.py
bash tools/procedencia/run.sh -c 'import runpy,sys; from pathlib import Path; root=Path.cwd(); sys.path.insert(0,str(root/"docs/procedencia/revisiones/preservacion-v3-sol")); runpy.run_path(str(root/"docs/procedencia/correcciones/preservacion-r21/adversos.py"),run_name="__main__")'
bash tools/procedencia/run.sh docs/procedencia/correcciones/editorial-r21/evidencias.py
```

El segundo instrumento hereda los ocho controles originales y añade dos métodos con subcasos. `defaultTest` selecciona solo la clase ampliada: diez métodos, sin duplicar la clase importada. La primera ejecución de herencia produjo 18 por duplicación de los controles, y se conserva como historia. El wrapper Nix no conserva el PYTHONPATH del shell exterior: la receta configura la ruta del módulo histórico dentro del proceso, sin excepciones de lint ni importación dinámica como clase para el tipador. Se conservan los intentos fallidos de configuración y anotación, separados de los rojos funcionales.

Ruff: `ruff check docs/procedencia/preservacion-v3/recolector.py docs/procedencia/correcciones/editorial-r21/evidencias.py docs/procedencia/correcciones/preservacion-r21/adversos.py`, disponible mediante Nix.

Mypy se ejecuta dentro de `nix develop path:tools/procedencia` mediante `uv run --project tools/procedencia --frozen --with mypy --with types-jsonschema mypy --follow-untyped-imports --follow-imports=silent --check-untyped-defs`. Se añade `MYPYPATH="$PWD/docs/procedencia/revisiones/preservacion-v3-sol"` para la reproducción importada, y se comprueban los tres archivos anteriores más `tools/procedencia/preservacion.py` y `tools/procedencia/preservacion_urls.py`. El pase completo final comprueba cinco fuentes. No se desactivan diagnósticos para ocultar los errores iniciales.

Para verificar el paquete real, importar el recolector y llamar `load()` y `verify(Path('/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/paquete-v3'))`. No ejecutar `collect`, ni las acciones CLI que sobrescriben sus recibos históricos. La comprobación del padre dejó `real-v3.log`; el schema final se comprobó de nuevo tras ajustar rutas.
