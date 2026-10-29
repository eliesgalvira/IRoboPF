# Reproducción

Base eaed990c620b5fc4d3ff2e74dc68e0c8481c43db. Se copió el checkout con tar excluyendo .git/.jj/node_modules a scratch dentro de esta entrega y se enlazó node_modules del padre. Las pruebas pueden escribir y limpiar sus propios temporales; no deben apuntarse a originales ni informes ajenos.

Directorio de ejecución: `scratch/` de esta entrega. Variables: `TMPDIR=../tmp` (ruta absoluta en la ejecución), `PYTHONDONTWRITEBYTECODE=1`, `UV_OFFLINE=1`. Cada grupo está protegido por `flock /tmp/irobopf-validacion-pesada.lock`. No ejecutar concurrentemente. Entorno general: `nix --offline shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bash`; para calidad Python se añadieron nixpkgs#ruff y nixpkgs#mypy. Corpus usa su flake y uv.lock fijados mediante run.sh. Nix resolvió componentes desde el entorno disponible; no se instaló globalmente.

Comandos reales, con stdout/stderr guardados en los logs homónimos:

```
bun run test:inventario
bash tools/procedencia/run.sh tests/procedencia-enlaces_test.py
bash tools/procedencia/run.sh tests/procedencia-corpus_test.py
bash tools/procedencia/run.sh tests/procedencia-preservacion_test.py
bun x vitest run tests/evidencia-contenido-procedencia.test.ts tests/contenido-integridad-procedencia.test.ts --maxWorkers=1
bun run lint
bun run typecheck
bun run test:lint
python3 ../independiente.py
bash tools/procedencia/run.sh ../adversos.py
bun scripts/procedencia/verificar-enlaces.mjs --cas-root "$PWD/docs/procedencia/corpus/fixtures"
bun x vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
python3 ../node-recotejo.py
ruff check ../independiente.py ../adversos.py ../node-recotejo.py tools/procedencia/{cas,enlaces,corpus,preservacion}.py
mypy --cache-dir ../mypy-cache --follow-imports=skip --ignore-missing-imports --check-untyped-defs ../independiente.py ../adversos.py ../node-recotejo.py tools/procedencia/{cas,enlaces,corpus,preservacion}.py
bun run lint
bun scripts/procedencia/contenido-verificar.mjs
```

`node-recotejo.py` deriva un coordinador de ensayo dentro de scratch e inserta una mutación persistente inmediatamente después del retorno real del auxiliar Python. Espera el rechazo Node, luego restaura solo los fixtures propios cambiados. No sustituye la respuesta Python ni falsea hashes; no cambia el coordinador de producto ni sus originales. El archivo derivado permanece en scratch y pasa lint global. Este ensayo verifica la barrera final Node; la suite Python ensaya por separado el recotejo documental y CAS.

La primera versión de `adversos.py` heredaba las 19 pruebas de preservación y añadía dos: corrupción/ausencia en confirm y fallos inyectados en cada uno de sus cinco fsync. El recuento inicial de 21 se solapa con la suite de 19, no se suma como pruebas nuevas independientes. Para resolver el diagnóstico de tipos del script propio, la versión final usa TestCase con el mismo fixture y ejecuta solamente las dos pruebas nuevas; adversos-final.log conserva su repetición.

`independiente.py` analiza los literales de las tablas sin importar el módulo ni llamar a flatten; expande solo los spreads explícitos de esas tablas y compara Decimal por identidad. No infiere normativa. Lee por bloques de 1 MiB los objetos de las dos copias v2, sin llamar a fingerprint del producto ni modificar objetos.
