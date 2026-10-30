# Recetas y límites

```bash
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/flujo-escalas-r21-sol/uv"
export PYTHONDONTWRITEBYTECODE=1
export NODE_PATH=/home/elies/Repos/IRoboPF/node_modules
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/editorial/flujo-escalas-r21-sol/extraer.mjs
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r21-sol/generar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun docs/procedencia/editorial/flujo-escalas-r21-sol/casos.mjs
flock /tmp/irobopf-validacion-pesada.lock bash docs/procedencia/editorial/flujo-escalas-r21-sol/validar.sh
```

La copia mutante se escribe exclusivamente en .cache/flujo-escalas-r21-sol, con imports dirigidos a los módulos originales del checkout. Solo cambia gt por gte en el predicado estricto de fila. node_modules del repositorio se lee; no se instala ni se modifica. El mutante no forma parte del motor ni de la entrega de código propuesto.
