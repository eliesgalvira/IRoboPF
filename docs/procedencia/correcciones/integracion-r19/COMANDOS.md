# Comprobaciones ejecutadas en el árbol integrado

Todos los pases pesados se serializaron mediante `flock /tmp/irobopf-validacion-pesada.lock`. Node, Bun y Python se habilitaron con Nix. Para el corpus se fijó `UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv` y `PYTHONDONTWRITEBYTECODE=1`.

Secuencia de preparación, con salida independiente por fase:

```sh
bun run inventario:verificar
bash tools/procedencia/run.sh docs/procedencia/correcciones/integracion-r19/preparar.py
bun docs/procedencia/correcciones/integracion-r19/historicos.mjs
bun scripts/procedencia/contenido-generar.mjs
bun docs/procedencia/correcciones/integracion-r19/actualizar-enlace.mjs
bun docs/procedencia/correcciones/integracion-r19/publicar.mjs
bun run typecheck
bun run lint
bun run test:lint
```

Regresiones:

```sh
bunx vitest run tests/minimos-derechos-integracion.test.ts tests/minimos-derechos.test.ts tests/contenido-integridad-procedencia.test.ts tests/evidencia-contenido-procedencia.test.ts tests/publicacion-evidencia.test.ts tests/rastro-anual-procedencia.test.ts --maxWorkers=1
bunx vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
bash tools/procedencia/run.sh tests/procedencia-enlaces_test.py
bash tools/procedencia/run.sh tests/test_ambitos_juridicos.py
node --test --test-concurrency=1 tests/ambito-publicado.test.mjs
```

El pase de ámbitos actuales usa `.cache/procedencia/r19-tests/test_ambitos_actuales.py`, copia del último test Python que sustituye `Path(__file__).resolve().parents[1]` por la raíz absoluta del proyecto y la carpeta histórica por `docs/procedencia/correcciones/integracion-r19/candidatos`. Se mantienen todas sus expectativas y mutaciones. Se ejecuta mediante el wrapper del corpus; resultado en `ambitos-actuales.log`.

Calidad adicional: Ruff de Nix sobre `tools/procedencia/enlaces.py`, `tests/test_ambitos_juridicos.py` y `preparar.py` de esta carpeta; mypy mediante `uv run --project tools/procedencia --frozen --with mypy --with types-jsonschema`, dentro de `nix develop path:tools/procedencia`, con `--follow-imports=silent --check-untyped-defs` sobre esas tres fuentes. No equivale a tipado estricto de todo el corpus. Cierre oxlint: `bun node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config`.

Los logs y `verificacion-cierre.json` fijan resultados y hashes. Los scripts de preparación/publicación escriben únicamente nuevas versiones; para repetir sin tocar el almacén oficial, utilizar scratch con las mismas dependencias verificadas. No ejecutar los recolectores históricos para sustituir paquetes preservados.
