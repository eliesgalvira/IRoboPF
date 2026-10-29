# Comandos y resultados

Directorio de trabajo: `/home/elies/.t3/worktrees/IRoboPF/t3-9491a8b7`.
Salida exclusiva: `/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/preservacion-v2`.

Entorno usado para los comandos uv: `VIRTUAL_ENV=/home/elies/Repos/IRoboPF/tools/procedencia/.venv UV_OFFLINE=1 PYTHONDONTWRITEBYTECODE=1`. Python 3.13 del entorno Nix existente y jsonschema del proyecto; sin sincronizar ni instalar paquetes. `--no-sync` junto con `--no-project` produjo un aviso de opción sin efecto, conservado en los logs, no una descarga.

```sh
flock /tmp/irobopf-validacion-pesada.lock uv run --active --no-project --no-sync python -B /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/preservacion-v2/repro.py
flock /tmp/irobopf-validacion-pesada.lock uv run --active --no-project --no-sync python -B tests/procedencia-preservacion_test.py
flock /tmp/irobopf-validacion-pesada.lock uv run --active --no-project python -B /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/preservacion-v2/residuales_test.py
```

El segundo comando usó además TMPDIR igual a la carpeta de revisión. El primero requiere que `scratch/` aún no exista; ya se conserva su ejecución y no debe borrarse para repetirlo. Para una repetición independiente, asignar a S otro subdirectorio nuevo dentro de la carpeta autorizada. No crea copias grandes; lee las dos existentes. El tercero se puede repetir sin tocar los casos conservados y debe acabar con dos fallos mientras el producto siga igual.

Ruff 0.15.14 disponible en `/nix/store/9f6r041gl46jjdvjmask1pb9jw25d0as-ruff-0.15.14/bin/ruff`, ejecutado con `check --no-cache` sobre repro.py y residuales_test.py. Mypy 1.20.1 disponible en `/nix/store/d7c69cfpv39n7g91zbfygl4m65dbbdhw-python3.13-mypy-1.20.1/bin/mypy`, bajo flock con `--cache-dir=/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/preservacion-v2/mypy-cache --follow-imports=skip --check-untyped-defs` sobre ambos scripts. Esta comprobación limitada de tipos no certifica el esquema runtime ni es modo strict. Los primeros diagnósticos y los resultados finales se conservan por separado. Se anotó el cursor del JSON heterogéneo como Any; no se cambió la semántica del ensayo.

Lecturas adicionales: `git rev-parse HEAD`, `git show BASE:ruta` para las seis fuentes y `git ls-tree -r --name-only BASE` para presencia en disco. Ninguna mutación VCS. Un pase uv de lectura cotejó las 2.919 adquisiciones con sus JSON y recorrió todos los archivos de la revisión previa; resultados en evidencia-fuentes.json. Los archivos de contexto se leyeron con cat/sed; rg no estaba disponible y se usaron find/lecturas directas, sin instalación global.
