# Reproducción desde la raíz de este checkout

No copiar ni activar el registro real. Estas recetas usan solo `.cache/nominal-r29/ensayo` como fixture. Las fuentes del motor se copian para que Bun resuelva una sola clase Decimal; node_modules del padre se enlaza solo para lectura. Nix necesita python3 en el proceso exterior además del entorno del auxiliar.

```sh
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/nominal-r29/uv"
export RUFF_CACHE_DIR="$PWD/.cache/nominal-r29/ruff"
export NOMINAL_OUT="$PWD/docs/procedencia/implementaciones/contrato-nominal-r29-sol"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$NOMINAL_OUT/preparar.py"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun nixpkgs#python3 -c node "$NOMINAL_OUT/recorrido.mjs"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh tests/test_nominal_contrato.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node --test --test-concurrency=1 tests/nominal-contrato.test.mjs
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh tests/test_ambitos_juridicos.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh tests/procedencia-enlaces_test.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$NOMINAL_OUT/lote.py"
```

El transporte usa `patch`, instalado con Nix, nunca git apply. empaquetar.py exige un directorio scratch de transporte nuevo; conservar el anterior y elegir otro nombre en una copia del instrumento si se repite. El patch, manifiesto y binarios excluyen sus propios sobres para evitar circularidad. Ningún original PDF se transporta ahí: originales.json y el cierre tipado permiten preservarlo por separado desde CAS propio o el paquete conservado.

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#patch -c bash tools/procedencia/run.sh "$NOMINAL_OUT/empaquetar.py"
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh "$NOMINAL_OUT/fisico.py" final-repetido
```

fisico.py hace lecturas de blobs una por una y conserva el diff y todas las filas físicas. No usar el lock de recepción para pruebas, tipos o renders. Los controles históricos de esta entrega no deben sobrescribirse para simular un antes nuevo.

calidad.sh y calidad-preparar.py conservan la receta usada. Para repetirla, copiar calidad-preparar.py a `.cache/nominal-r29/calidad-preparar.py` y ejecutar calidad.sh desde la raíz bajo el lock pesado. No instalar globalmente ni crear tools/procedencia/.venv. Mypy usa uv run --with mypy --with types-jsonschema; oxlint un hilo y disable-nested-config, con las 16 reglas a error. ESLint no da errores; su aviso pages se conserva. tipos-js verifica checkJs del nuevo módulo, no el motor completo. Los resultados finales y las incidencias están separados en los logs.
