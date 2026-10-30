# Recetas de reproducción

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Desde la raíz del checkout asignado:

```sh
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/madrid-v2-r25-sol/venv"
export NODE_PATH=/home/elies/Repos/IRoboPF/node_modules
D=docs/procedencia/implementaciones/madrid-v2-r25-sol
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$D/extraer.py"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$D/manual.py"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$D/fijar-evidencia.py"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$D/preparar.py" --scratch
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$D/ajustar-scratch.py"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$D/casos.py"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun "$D/coordinador.mjs"
flock /tmp/irobopf-validacion-pesada.lock bash "$D/control-v1.sh"
flock /tmp/irobopf-validacion-pesada.lock bash "$D/calidad.sh"
```

`arbol.py` exige HEAD y todas las entradas físicas idénticas a base; las adiciones propias se enumeran en el manifiesto. El caso v2 del coordinador se espera bloqueado, con código no cero, por condiciones editoriales históricas ausentes. No convertir ese rechazo en pase de integración. `control-v1.sh` prueba v1 pending sin atestación en el mismo scratch y restaura después el registro scratch a v2/null. No cambia ningún registro versionado. Los logs originales se conservan separados de repeticiones.

El scratch contiene inventario y dependencias mínimas de evidencia, fuentes del checkout propio enlazadas para lectura y herramientas Python mínimas ordinarias para que Nix resuelva su flake. No ejecutar write del inventario ni instalar dependencias JS. `node_modules` del integrador es de solo lectura. El coordinador reconstruye realmente el inventario; no recibe una lista de items fabricada ni se modifican consumidores.

`calidad.sh` conserva cada código y log, ejecuta Ruff vía Nix, mypy mediante uv --with y wrapper de desarrollo del proyecto, oxlint con --threads=1 --disable-nested-config y ESLint solo sobre el instrumento JS. No hay Effect ni TypeScript nuevos: no corresponde afirmar typecheck del motor por esta entrega. Los controles de schema y de identidad cubren los datos JSON; no sustituyen una revisión jurídica.

`empaquetar.py` genera manifiesto y patch textual gzip contra base, índice de binarios por ruta/hash. Excluye los tres artefactos de transporte de su propia lista para evitar circularidad; no excluye controles ni evidencias. Los binarios son PNG y controles gzip; no se incluyen PDF, entorno, CAS original ni node_modules. Mantenerlos en las rutas de binarios.json, verificar hashes y aplicar solo tras recepción del integrador. El script no hace commits ni cambia índice, bookmarks o referencias.

Repetición de calidad que resuelve las dependencias sin relajar comprobaciones:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash "$D/calidad-final.sh"
```

El stub local `stubs/pymupdf.pyi` documenta solo el subconjunto usado; `firmas-runtime.py` registra la frontera instalada, incluido el wrapper get_text sin firma explícita. La comprobación real de texto y render sigue siendo necesaria. Los logs iniciales rojos no se sobrescriben. `codigos.log` fija los códigos finales y el aviso de ESLint permanece en eslint-final.log.
