# Reproducción desde la raíz del checkout

Todos los comandos pesados se serializan con `flock /tmp/irobopf-validacion-pesada.lock`. Un proceso trabajador. No hay build ni suite legacy.

```sh
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/redondeo-tgss-mensual/venv"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/auditorias/redondeo-tgss-mensual/fuentes/adquirir.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/auditorias/redondeo-tgss-mensual/fuentes/evidencia.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/auditorias/redondeo-tgss-mensual/casos/decimal_independiente.py
NODE_PATH=/home/elies/Repos/IRoboPF/node_modules flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun docs/procedencia/auditorias/redondeo-tgss-mensual/pruebas/api.mjs
```

Adquisición inicial ejecutada con la misma lógica en `.cache/redondeo-tgss-mensual/adquirir.py`, ampliada en tres pases. Las URLs acertadas reutilizan CAS validado; el endpoint vacío queda registrado como error. El script entregado añade fecha al error para futuras repeticiones. La creación inicial involuntaria de `.venv` fuera de caché se declara en INFORME; las restantes invocaciones usan la variable anterior.

Comprobaciones ejecutadas con Nix Bun/Node/Ruff/mypy, secuenciales bajo el mismo lock:

```sh
node /home/elies/Repos/IRoboPF/node_modules/oxlint/bin/oxlint --disable-nested-config -c .cache/redondeo-tgss-mensual/validacion/.oxlintrc.json docs/procedencia/auditorias/redondeo-tgss-mensual/pruebas/api.mjs
node /home/elies/Repos/IRoboPF/node_modules/eslint/bin/eslint.js --config .cache/redondeo-tgss-mensual/validacion/eslint.config.mjs docs/procedencia/auditorias/redondeo-tgss-mensual/pruebas/api.mjs
node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p .cache/redondeo-tgss-mensual/validacion/tsconfig.json
ruff check docs/procedencia/auditorias/redondeo-tgss-mensual
mypy --follow-imports=silent --ignore-missing-imports --check-untyped-defs --cache-dir .cache/redondeo-tgss-mensual/mypy docs/procedencia/auditorias/redondeo-tgss-mensual/casos/decimal_independiente.py docs/procedencia/auditorias/redondeo-tgss-mensual/fuentes/evidencia.py docs/procedencia/auditorias/redondeo-tgss-mensual/fuentes/adquirir.py
```

La copia de validación está exclusivamente en `.cache`: lib y tools/oxlint copiados desde esta base, configs oxlint/ESLint idénticas, node_modules enlazado al padre. TypeScript usa `allowJs`, `checkJs`, `strict`, `noEmit`, `allowImportingTsExtensions`, `module: preserve`, `moduleResolution: bundler`, `target: ES2022`, alias @/* a ./*; incluye api.mjs con sus dos imports relativos ajustados a ./lib. Esto verifica el arnés y sus dependencias alcanzadas, no sustituye el typecheck global del producto. No se afirma haber ejecutado ese chequeo global ni el ensayo global test:lint.

`validacion.log`: primer pase mypy fallido, dos errores del arnés. `validacion-final.log`: pase intermedio correcto. `validacion-entrega.log`: repetición con ESLint y los tres Python, después de añadir contexto PDF. Exit 0 del comando secuencial con `set -e` exige que todos hayan pasado. Las 16 severidades del config copiado permanecen a error.

`verificacion.json`: reextracción de cada caja y regeneración PNG en memoria comparada por hash, SHA256/512 y tamaño de cada original, presencia de todos los archivos base. El checker usado permanece en `.cache/redondeo-tgss-mensual/verificar.py`. El generador público permite repetir la receta; no se afirma una segunda implementación independiente del extractor.

Integrar solo rutas de manifiesto, comprobando baseSha256 antes de copiar. Copiar originales del CAS indicados en binarios.json por hash; no copiar entornos, node_modules ni el árbol entero de caché. Las referencias históricas y los informes ajenos son solo lecturas.

El primer checker de presencia usó `git ls-tree --name-only` sin `-z` y trató los nombres entrecomillados de Git como rutas literales: falló ese control. Se corrigió el lector a delimitador NUL; no se reparó índice ni se restauró ningún archivo. ESLint avisó de autodetección de React al resolver desde el checkout sin node_modules; no produjo errores ni cambió reglas.
