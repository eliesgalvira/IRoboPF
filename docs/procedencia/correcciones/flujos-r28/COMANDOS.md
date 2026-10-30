# Reproducción de las rectificaciones de flujos

Desde la raíz de IRoboPF, un trabajador y el bloqueo compartido. Los resultados históricos recibidos no se reescriben. Para una revisión, redirigir las salidas propias a su scratch y conservar el diff de esa adaptación.

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/correcciones/flujos-r28/rectificar.mjs antes
# Código 1 esperado si se reproducen los fallos contra los originales.
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/correcciones/flujos-r28/rectificar.mjs corregir

export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/correcciones/flujos-r28/validar.py

flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node node_modules/typescript/bin/tsc -p docs/procedencia/correcciones/flujos-r28/tsconfig.json
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c node_modules/.bin/oxlint --threads=1 --disable-nested-config --config docs/procedencia/correcciones/flujos-r28/oxlint.json docs/procedencia/correcciones/flujos-r28/rectificar.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff -c ruff check docs/procedencia/correcciones/flujos-r28/validar.py docs/procedencia/correcciones/recepcion-r26-r28/preservar-v5.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy -c mypy --check-untyped-defs --follow-imports=skip --ignore-missing-imports docs/procedencia/correcciones/flujos-r28/validar.py docs/procedencia/correcciones/recepcion-r26-r28/preservar-v5.py
```

Mypy comprueba un alcance parcial de las fronteras JSON dinámicas; no equivale a tipado estricto del consumidor recibido. No hay código Effect nuevo, build ni suites fiscales masivas. No se regenera el inventario o los snapshots por esta edición documental.

La conservación se ejecuta una sola vez en un destino nuevo, mediante `../recepcion-r26-r28/preservar-v5.py` bajo el mismo bloqueo y entorno. Rechaza sobrescribir su destino. La reproducción posterior usa verify o un destino nuevo explícito, nunca elimina las copias anteriores para obtener un pase.
