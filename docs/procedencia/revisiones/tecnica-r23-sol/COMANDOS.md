# Reproducción

Raíz: /home/elies/.t3/worktrees/IRoboPF/t3-ff8929d1. Sin mutaciones VCS.

- Lecturas: git rev-parse HEAD; git ls-tree -r HEAD; git diff 341e88f3 HEAD -- scripts/procedencia/explicacion-version.mjs tests/software-recibo.test.mjs. Se conserva cambio-revisado.diff.
- Recepción inicial: flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#python3 -c python3 docs/procedencia/revisiones/tecnica-r23-sol/arbol.py inicial. Solo biblioteca estándar, un blob cada vez. El instrumento inicial se adapta del conservado R21 cambiando exclusivamente base y cardinalidad. El pase final usa run.sh, mismo algoritmo.
- Enlace auxiliar de lectura: ln -s /home/elies/Repos/IRoboPF/node_modules node_modules. Fuera del transporte.
- Preparación: PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/tecnica-r23-sol/venv" bash tools/procedencia/run.sh docs/procedencia/revisiones/tecnica-r23-sol/preparar.py.
- Pruebas, historia, rutas, identidades y calidad TS: flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bash docs/procedencia/revisiones/tecnica-r23-sol/ejecutar.sh. El script fija cada argumento y guarda códigos separados. Esperar antes a que existan adversos.test.mjs, historia.mjs y derivar.py, entregados aquí.
- Calidad Python: flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bash docs/procedencia/revisiones/tecnica-r23-sol/calidad-python.sh. Ruff/mypy del alcance, sin modificar reglas.
- Cierre físico: flock /tmp/irobopf-recepcion-acotada.lock env PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/tecnica-r23-sol/venv" bash tools/procedencia/run.sh docs/procedencia/revisiones/tecnica-r23-sol/arbol.py final. El log va a arbol-final.log.
- Transporte: PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/tecnica-r23-sol/venv" bash tools/procedencia/run.sh docs/procedencia/revisiones/tecnica-r23-sol/empaquetar.py. Ejecutar solo después de congelar los demás archivos. Excluye scratch, caché, enlace node_modules y el propio manifiesto.

Los instrumentos de revisión usan el entorno gestionado por run.sh. `preparar.py` reconstruye las fuentes históricas mínimas, excluidas del transporte. El rojo histórico y la hipótesis nueva roja son resultados esperados de la revisión; no acreditan un pase verde conjunto.

Cierre adicional después de las pruebas: mismo comando de arbol.py con argumento cierre, salida arbol-cierre.log. El instrumento modos.py contrasta los permisos ejecutables de ambos controles previos; cerrar.py hace además esa comprobación para cierre. Tras terminar calidad y congelar el informe, usar run.sh con cerrar.py: exige todos los códigos de calidad correctos y ambos códigos rojos conservados, genera cierre-control.json, llama al empaquetador y reabre cada ruta del manifiesto para verificar hashes/tamaños. No redirigir su stdout a un archivo dentro de esta carpeta mientras calcula el manifiesto.

`calidad-python-final.sh` ejecuta con el mismo Nix y bloqueo los controles cuyos resultados están en `ruff-final.log` y `mypy-final.log`. `cerrar.py` exige esos códigos finales. El primer `mypy=1` se conserva; la corrección de anotación de `derivar.py` no cambia los bytes del candidato.
