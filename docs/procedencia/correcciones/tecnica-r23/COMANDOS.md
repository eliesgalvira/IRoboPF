# Reproducción R23

Desde la raíz del repositorio. Un trabajador y `flock /tmp/irobopf-validacion-pesada.lock`. Bun, Node y Python mediante Nix. Python con `PYTHONDONTWRITEBYTECODE=1` y `UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv`.

- `bun test tests/software-recibo.test.mjs docs/procedencia/revisiones/contratos-r21-sol/ast.test.mjs`: 32 pruebas.
- `bash tools/procedencia/run.sh docs/procedencia/correcciones/tecnica-r23/preservacion-controles.py`: tres métodos del revisor y privacidad; fixture/salidas propios.
- `bash tools/procedencia/run.sh docs/procedencia/correcciones/tecnica-r23/preservacion-politica.py`: 13 métodos y carga v3 histórica.
- `bun x vitest run tests/rastro-anual-procedencia.test.ts tests/contenido-integridad-procedencia.test.ts tests/evidencia-contenido-procedencia.test.ts --maxWorkers=1`: 22 regresiones. La primera invocación incluyó también un nombre de archivo inexistente; Vitest seleccionó estos tres, como informa el log.
- `bun x vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1`: contenido.
- `bun run lint`; `bun run typecheck`; `ruff check` sobre los scripts propios y recolector.
- Mypy: `--follow-untyped-imports --follow-imports=silent --check-untyped-defs`, entorno gestionado con `uv run --project tools/procedencia --frozen --with mypy --with types-jsonschema python -m mypy`. `MYPYPATH` fija tools/procedencia y la carpeta de revisión preservacion-r21-sol. Lista exacta de seis archivos en el informe y logs.

Generación ya ejecutada una vez: `bun scripts/procedencia/contenido-generar.mjs`, después `bun docs/procedencia/correcciones/tecnica-r23/publicar.mjs`. No repetir para revisar el resultado: usar `verificar-actual.mjs`, que conserva los 34 históricos y verifica los dos nuevos. `historicos.mjs` escribe el recibo del pase previo y no debe sobrescribirlo al reproducir sobre las 36 versiones.

Los rojos `ast-rojo.log`, `ast-ampliado-rojo.log` y `preservacion-rojo.log` corresponden al código anterior. Las entregas del revisor quedan intactas; no se ejecutan sus instrumentos de empaquetado sobre la carpeta recibida.
