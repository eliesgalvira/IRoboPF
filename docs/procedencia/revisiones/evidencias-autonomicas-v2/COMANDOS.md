# Reproducción

Desde `/home/elies/.t3/worktrees/IRoboPF/t3-74b09993`, base 5799bb03826719a4dd3500a962e2d6bb5124fdca. Definir `UV_PROJECT_ENVIRONMENT="$PWD/.cache/eav2/venv"` (absoluta) y `PYTHONDONTWRITEBYTECODE=1` antes del wrapper. Todos los trabajos de extracción, tipos y lectura masiva usaron `flock /tmp/irobopf-validacion-pesada.lock`, un trabajador.

Los cuatro instrumentos entregados son `.py`, sin extensiones para eludir lint. Ejecutar secuencialmente dentro del lock:

```sh
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/eav2/venv"
export PYTHONDONTWRITEBYTECODE=1
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v2/revisar.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v2/temporal.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#python3 -c python3 /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v2/persistencia.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v2/decidir.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy -c bash -c 'ruff check --no-cache /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v2/*.py && mypy --cache-dir="$PWD/.cache/eav2/mypy" --follow-imports=skip --ignore-missing-imports --check-untyped-defs /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v2/*.py'
```

`revisar.log`: extracción e identidad actuales, salida 0. `historico.log`: repetición histórica, salida 0. `temporal-final.log` y `persistencia-final.log`: fuentes temporales e historial. `validacion-final.log`: Ruff, mypy y decisiones finales, salida 0. `calidad-inicial.log`, `persistencia.log` y `decidir.log` conservan fallos propios de preparación; no son rojos fiscales. Ningún log supera 1 MB.

La reproducción histórica reutilizó `docs/procedencia/evidencias/autonomicas-v2/reproducir_historico.py` copiándolo exclusivamente a `.cache/eav2/historico.py`. Cambios de ejecución: `ROOT` pasa a la ruta absoluta de este checkout y `OUT` a su `.cache/eav2/historico`; se crea ese directorio antes. El resto de bytes conserva el instrumento de origen, que fija ed6a43fd750de05609abc3710dabdc2f8261020c mediante git show. Comando: `flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$PWD/.cache/eav2/historico.py"`, con las variables anteriores. El resumen y contexto históricos se conservan en esta entrega; no se copia el árbol del proyecto bajo docs.

La primera exploración de disposiciones (`.cache/eav2/extract.py`) buscó páginas en los siete originales y dejó texto únicamente en scratch; los pasajes seleccionados se reproducen con temporal.py. La lectura exploratoria de metadatos encontró un diccionario donde esperaba lista y se corrigió para aceptar ambas formas documentales; no se alteró ninguna fuente. La primera extracción de persistencia rechazó metadatos sin mimeType; ahora solo selecciona HTML explícito y no adivina formatos.

Herramientas del corpus y dependencias están fijadas por flake.lock/uv.lock existentes. Las herramientas de calidad son las de Nix utilizadas en esta máquina; no se presentan como un nuevo lock de Ruff/mypy. No se cambió ningún package/lockfile/CI ni se instaló globalmente. Para mostrar el significado de los recortes se usó inspección visual del modelo sobre los nueve PNG; esa parte es revisión humana asistida, no un test automatizado reproducible.

`cierre-final.log` repite Ruff/mypy y la revisión técnica tras añadir el control explícito de fila/columna de cita frente a ruta de código, con excepción declarada para el párrafo murciano. Termina con ambos PASS y salida 0. No se cambiaron cifras ni condiciones jurídicas.
