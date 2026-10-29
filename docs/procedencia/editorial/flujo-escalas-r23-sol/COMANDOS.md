# Reproducción

Desde el checkout fijado, sin mutaciones VCS:

```bash
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/flujo-escalas-r23-sol/venv"
export NODE_PATH=/home/elies/Repos/IRoboPF/node_modules
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r23-sol/fisico.py control-inicial
flock /tmp/irobopf-validacion-pesada.lock bash docs/procedencia/editorial/flujo-escalas-r23-sol/validar.sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r23-sol/verificar.py
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r23-sol/fisico.py control-final
bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r23-sol/empacar.py
```

Las herramientasJS, Python, Ruff y mypy se obtienen por Nix, sin instalación global. `run.sh` aplica el entornoPython fijado; la única venv pertenece al checkout en `.cache/flujo-escalas-r23-sol/venv`. Los plugins de lint se copian al scratch propio para resolver imports ESM con node_modules del padre enlazado solo para lectura; se cotejan los bytes antes del lint. Las16 reglas permanecen a error y oxlint usa `--threads=1 --disable-nested-config`.

La preparación inicial consultó `effect-solutions list`, `show basics testing` con el CLI fijado y leyó `Array.findLast` de la fuenteEffect local. No se escribe códigoEffect mantenido; el mutante temporal conserva el helper real salvo el operador deliberadamente cambiado.

El cotejo físico usa únicamente `git rev-parse`, `ls-tree`, `cat-file` y `diff` como lectores del repositorioGit creado porT3. No se inicializaJJ ni se ejecuta ninguna operaciónVCS mutante. Las entradas nuevas se transportan por manifiesto y `git diff --no-index /dev/null ruta`, que no modifica el repositorio. Ningún informe histórico se cambia. No se adquieren fuentes nuevas.

`casos-heredados.mjs` reproduce las expectativasR21 intactas y conserva las mutaciones por cada decisión nominal. `casos-selectores.mjs` añade contratos nuevos de renta/fechas, simulada, deducciones/agregado/pagos yDA61. El resultado de una prueba solo acredita ese discriminante. Los logs iniciales se conservan si falla un instrumento propio; no se cambia una expectativa recibida para lograr verde.

El primer pase de selectores encontró una dependenciaEffect del entorno anfitrión al resolver imports desde este worktree sin node_modules propio. Los instrumentosBun registran un resolutor que dirige `effect`, sus subrutas y `decimal.js` exclusivamente a los paquetes reales del padre, mediante `createRequire` anclado a su package.json. No se simula ningún módulo ni se sustituye su implementación; se evita que NODE_PATH o los ancestros del checkout elijan otra versión. El primer fallo queda en `casos-selectores-inicial.log`.

Corrección del instrumento de resolución: la versión final precalcula rutas absolutas a `effect/dist/index.js` y `decimal.js/decimal.mjs` antes de registrar el plugin. No llama a require.resolve desde onResolve, lo que provocaba recursión, ni vuelve a hacer require durante la resolución. Los errores de recursión y del prefijo file: permanecen en sus logs propios. Este ajuste no cambia expectativas ni datos del motor.

La alternativa final elimina ese plugin runtime por su fallo de rutasfile:. `preparar-lint.mjs` prepara también un tsconfig en scratch con aliases absolutos a las dependencias reales y registra sus hashes en `runtime-dependencias.json`. Las pruebas se ejecutan con `bun --no-install --tsconfig-override` sobre ese archivo. No se instala nada ni se modifica la resolución del proyecto mantenido. Los intentos anteriores son historia del instrumento, no cambios a los resultados recibidos.

Después del empaquetado se ejecuta `bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r23-sol/cotejar_entrega.py`, que verifica todos los hashes/tamaños y el conjunto de rutas del manifiesto. Su salida se comunica sin redirigirla a un archivo nuevo que invalidase el manifiesto ya cerrado. El scratch de `.cache/flujo-escalas-r23-sol/` y su entorno no forman parte de la entrega ni del patch.

El tipado del alcanceJS se ejecuta con TypeScript checkJs/noEmit y configuración propia, como en la entregaR21 recibida. No se confunde con typecheck estricto de toda la aplicación. Los instrumentosPython se comprueban con mypy yRuff; el lintJS conserva las16 reglas aerror. Los códigos individuales permiten distinguir calidad del instrumento, discriminantes y controles de evidencia.
