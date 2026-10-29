# Reproducción

Raíz `/home/elies/.t3/worktrees/IRoboPF/t3-29bd23a4`, HEAD/base `960773f909d4ecff290edfa3d7a7b2699a8445d3`. Sin mutaciones VCS. El enlace node_modules apunta a `/home/elies/Repos/IRoboPF/node_modules` y solo se lee; no se transporta.

Cada validación, recorrido masivo o tipos se serializa con `flock /tmp/irobopf-validacion-pesada.lock`. Un trabajador; Nix proporciona Bun/Node/Python. Entorno para Python:

```sh
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/contratos-r21-sol/venv"
export PYTHONDONTWRITEBYTECODE=1
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/contratos-r21-sol/preparar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bash docs/procedencia/revisiones/contratos-r21-sol/pruebas.sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun test docs/procedencia/revisiones/contratos-r21-sol/ast.test.mjs
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/contratos-r21-sol/identidades.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bash docs/procedencia/revisiones/contratos-r21-sol/calidad.sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/contratos-r21-sol/arbol.py final
```

`preparar.py` extrae **dos módulos concretos** de `7668bdad` con git show y rebasa únicamente sus imports hacia las dependencias actuales. No crea checkout ni ejecuta el helper histórico para aceptar identidades. CP19-03 reproduce el verificador anterior exacto con esas dependencias actuales; no se atribuye un build completo de aquella aplicación. Las pruebas R19 conservan expectativas de rechazo: los códigos históricos 1 son rojos esperados por Missing expected exception; los actuales deben ser 0. `software.mjs` conserva el snapshot histórico exacto para comparar el mismo ataque con el lector actual. `rutas.mjs` adapta la receta R19 al V1/V2 actual, con scratch propio, y prueba los GET importados sin servidor.

`ast.test.mjs` añade adversos propios con fixtures en memoria y hashes coherentes. Conserva dos expectativas rojas; no cambia el producto. No ejecutar estos bytes históricos como módulo para decidir qué fuente aceptar. `historia.mjs` comprueba conservación de los 32 IDs previos y una muestra dirigida, no repite los 32 como cobertura nueva.

El control físico inicial se ejecutó con Python estándar explícito en Nix (sin dependencias) antes de preparar el entorno gestionado. El final usa run.sh y UV absoluto. No se creó tools/procedencia/.venv. La preparación inicial fue una receta inline equivalente a preparar.py; se conserva el script reproducible. No se borran scratch ni fuentes al repetir.

`calidad.sh` conserva códigos separados de lint TS/JS, tipos principal/vendor y Ruff/mypy Python. No equivale lint a tipado. Se revisa la configuración de las 16 reglas a error; oxlint usa --threads=1 --disable-nested-config. Logs fallidos permanecen y cualquier repetición usa nombre distinto.
