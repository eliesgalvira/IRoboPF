# Recetas y límites

Ejecutar desde el checkout exigido. No inicializar JJ ni ejecutar otra mutación VCS. La primera consulta jj log informó ausencia de repositorio; git rev-parse confirmó HEAD. La lectura del árbol usa git ls-tree y cat-file, un blob cada vez; git diff es solo lectura.

```bash
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/flujo-escalas-r21-sol/uv"
export PYTHONDONTWRITEBYTECODE=1
export NODE_PATH=/home/elies/Repos/IRoboPF/node_modules
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r21-sol/fisico.py control-inicial
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/editorial/flujo-escalas-r21-sol/extraer.mjs
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r21-sol/generar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun docs/procedencia/editorial/flujo-escalas-r21-sol/casos.mjs
flock /tmp/irobopf-validacion-pesada.lock bash docs/procedencia/editorial/flujo-escalas-r21-sol/validar.sh
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r21-sol/fisico.py control-final
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r21-sol/empacar.py
```

El primer control físico y el primer extractor/generación se lanzaron con Python/Node explícitos de nix shell; las repeticiones Python usan el runner de proyecto y entorno absoluto propio. No se crea tools/procedencia/.venv. Se conservaron los diagnósticos iniciales en primeros-fallos.log; los logs finales y codigos.log deciden qué pasó realmente.

La copia mutante se escribe exclusivamente en .cache/flujo-escalas-r21-sol, con imports dirigidos a los módulos originales del checkout. Solo cambia gt por gte en el predicado estricto de fila. node_modules del padre se lee; no se instala ni se modifica. El mutante no forma parte del motor ni de la entrega de código propuesto.

Los JSON/logs mayores de1MB se comprimen al empacar. El sufijo.json.gz denota el mismo artefacto del texto. El patch incluye altas textuales; binarios.json enumera las altas binarias por ruta/hash/tamaño. manifiesto.json, entregado aparte para evitar autorreferencia, enumera también patch y binarios.json. baseSha256=null significa alta propia, no archivo de base ausente. No se hace git apply en este checkout ni otro creado por shell.
