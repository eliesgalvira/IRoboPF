# Reproducción fijada

Ejecutar desde la raíz de este checkout, en la base `eaed990c620b5fc4d3ff2e74dc68e0c8481c43db`. El script rechaza otra base. No reconstruye ni sobrescribe el inventario. Lee de `docs/procedencia/implementaciones/contenidos/datos/objetos/` el manifiesto y el artefacto históricos y actuales fijados literalmente en el script; además exige que `cobertura.json` v1 coincida con la pareja histórica. Verifica hashes, tamaño y manifiesto interior. Las fuentes históricas se leen mediante `git show ed6a43fd750de05609abc3710dabdc2f8261020c:ruta`; las actuales mediante su ruta y hash del inventario. No usa `readArtifact()` implícito.

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/evidencias/estatales-v2/reproducir.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/evidencias/estatales-v2/discriminantes.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 nixpkgs#ruff -c bash -c 'ruff check docs/procedencia/evidencias/estatales-v2/*.py && bun run lint && bun run typecheck'
```

El lanzador `run.sh` utiliza flake.lock y uv.lock del proyecto, con Python y PyMuPDF fijados. Solo un trabajador. La receta de render es la original: PyMuPDF 1.26.7, MuPDF 1.26.12, 144 dpi, RGB, sin alpha ni anotaciones, texto con flags 0 y orden original. Los PNG nuevos se contrastan byte a byte con v1 y quedan en `cas/sha256/`, con nombre igual a SHA-256. Los originales se leen de `/home/elies/Repos/IRoboPF/.cache/procedencia/sha256/`, sin copiarlos. No hay descarga silenciosa si falta un original: la reproducción falla.

El resolver recibe directorios padres explícitos que contienen `sha256`: corpus raíz y `estatales-v2/cas`. No se utilizan enlaces simbólicos para CAS ni se escriben fixtures del repositorio. Se puede mover la entrega solo adaptando expresamente la raíz de corpus en la receta y registrando esa adaptación; los hashes documentales exigidos permanecen iguales.

La propuesta de registro está separada en `registro-propuesto-NO-APLICAR.json`. No es autorización de integración. Cada entrada carece de atestación y tiene bloqueos individuales en la matriz. No se ejecuta el verificador mientras no se cumplan ámbito, decisión jurídica y revisión del payload; los controles de esta entrega son componentes documentales, no una reconstrucción fresca del motor.

Comprobación Python adicional, con imports externos omitidos y cuerpos no anotados comprobados; no equivale a tipado estricto completo:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy -c mypy --follow-imports=skip --ignore-missing-imports --check-untyped-defs --cache-dir .cache/estatales-v2/mypy docs/procedencia/evidencias/estatales-v2/reproducir.py docs/procedencia/evidencias/estatales-v2/discriminantes.py docs/procedencia/evidencias/estatales-v2/cerrar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#python3 -c python docs/procedencia/evidencias/estatales-v2/cerrar.py
```
