# Recetas ejecutadas

Raíz literal `/home/elies/.t3/worktrees/IRoboPF/t3-b12606f4`.

Lectura VCS únicamente: `git rev-parse HEAD`, `git ls-tree -rz HEAD`, `git diff --name-status 1196269d4e73742beeed35cc05011b70c21a0b69 HEAD`, `git diff HEAD --`. El control físico compara SHA1 de blob Git calculado con cabecera `blob size\0` y bytes reales contra cada OID, además de lstat, readlink y SHA256. No usa el índice para decidir existencia. Control completo comprimido en control-base.json.gz. Cierre mediante la misma lista, sin regenerar expectativas desde el árbol final.

```bash
UV_PROJECT_ENVIRONMENT="$PWD/.cache/revision-editorial/venv" flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/editorial-escalas-minimos-sol/revisar.py
UV_PROJECT_ENVIRONMENT="$PWD/.cache/revision-editorial/venv" flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/editorial-escalas-minimos-sol/adversos.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy -c ruff check docs/procedencia/revisiones/editorial-escalas-minimos-sol/
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy -c mypy --ignore-missing-imports --check-untyped-defs docs/procedencia/revisiones/editorial-escalas-minimos-sol/
```

`adversos.py` termina intencionadamente en1 por los dos diagnósticos de ausencia de pasaje; los casos aritméticos previos deben pasar. Logs y códigos se conservan, no se modifica la autoría para ponerlos verdes. La búsqueda de literal no constituye aceptación de evidencia: el juicio sobre suficiencia es el del informe.

PyMuPDF y jsonschema proceden del entorno fijado por tools/procedencia/run.sh; UV_PROJECT_ENVIRONMENT es absoluto y local a este checkout. No se ejecuta verificar.py del autor porque escribe casos-resultados.json en su carpeta: la reextracción y comprobaciones propias no necesitan mutarla. No se escribe TypeScript ni Effect y no se presenta Ruff como oxlint; se conserva y comprueba la configuración de16reglas a error. No hay dependencia nueva de aplicación ni entorno copiado a docs.

Los instrumentos de control/decisión/empaquetado de scratch quedan preservados en `.cache/revision-editorial`, fuera de la entrega; no se copia aplicación, tsconfig ni node_modules a documentación. Todas las comprobaciones pesadas se serializan con el lock común y un trabajador. No se ejecutan build, servidor, preview ni suitelegacy masiva.
