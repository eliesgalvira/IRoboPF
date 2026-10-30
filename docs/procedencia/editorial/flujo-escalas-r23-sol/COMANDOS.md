# Reproducción

Desde el checkout fijado, sin mutaciones VCS:

```bash
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/flujo-escalas-r23-sol/venv"
export NODE_PATH=/home/elies/Repos/IRoboPF/node_modules
flock /tmp/irobopf-validacion-pesada.lock bash docs/procedencia/editorial/flujo-escalas-r23-sol/validar.sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/flujo-escalas-r23-sol/verificar.py
```

Las herramientasJS, Python, Ruff y mypy se obtienen por Nix, sin instalación global. `run.sh` aplica el entornoPython fijado; la única venv pertenece al checkout en `.cache/flujo-escalas-r23-sol/venv`. Los plugins de lint se copian al scratch propio para resolver imports ESM con node_modules del repositorio enlazado solo para lectura; se cotejan los bytes antes del lint. Las16 reglas permanecen a error y oxlint usa `--threads=1 --disable-nested-config`.

`casos-heredados.mjs` reproduce las expectativasR21 intactas y conserva las mutaciones por cada decisión nominal. `casos-selectores.mjs` añade contratos nuevos de renta/fechas, simulada, deducciones/agregado/pagos yDA61. El resultado de una prueba solo acredita ese discriminante. Los logs iniciales se conservan si falla un instrumento propio; no se cambia una expectativa recibida para lograr verde.

La alternativa final elimina ese plugin runtime por su fallo de rutasfile:. `preparar-lint.mjs` prepara también un tsconfig en scratch con aliases absolutos a las dependencias reales y registra sus hashes en `runtime-dependencias.json`. Las pruebas se ejecutan con `bun --no-install --tsconfig-override` sobre ese archivo. No se instala nada ni se modifica la resolución del proyecto mantenido. Los intentos anteriores son historia del instrumento, no cambios a los resultados recibidos.

El tipado del alcanceJS se ejecuta con TypeScript checkJs/noEmit y configuración propia, como en la entregaR21 recibida. No se confunde con typecheck estricto de toda la aplicación. Los instrumentosPython se comprueban con mypy yRuff; el lintJS conserva las16 reglas aerror. Los códigos individuales permiten distinguir calidad del instrumento, discriminantes y controles de evidencia.
