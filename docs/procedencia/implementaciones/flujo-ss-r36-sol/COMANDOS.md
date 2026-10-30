# Comandos y reproducción

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Desde este checkout. Herramientas Nix, sin VCS mutante. Cada validación pesada toma/libera flock /tmp/irobopf-validacion-pesada.lock; recepción física usa únicamente /tmp/irobopf-recepcion-acotada.lock. No se retiene durante redacción/API/esperas.

2. nix shell nixpkgs#bun -c bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js list; show basics data-modeling testing. Consulta fuente local Match.valueTags.
3. nix shell nixpkgs#bun -c flock /tmp/irobopf-validacion-pesada.lock bun .cache/flujo-ss-r36/previo.mjs; repetir con previo-semilla.mjs. Ambos exit1 semántico previo conservado. Adaptaciones de rutas/destino adjuntas; nunca ejecutar productores originales con salida en su informe.
4. nix shell nixpkgs#bun -c flock /tmp/irobopf-validacion-pesada.lock bun .cache/flujo-ss-r36/casos.mjs.684 casos, exit0.
5. calidad.mjs crea proyección propia con lib/node_modules en lectura, fuentes físicas copiadas y tsconfig estricto con include acotado/incremental=false. validar.sh ejecuta cada comando en su bloqueo separado: Vitest config propio maxWorkers1; tsc --noEmit; oxlint --threads=1 --disable-nested-config --no-ignore sobre los dos módulos nuevos y test; ESLint sobre esas rutas. Se conservan16 reglas anti-slop a error. Validación definitiva de58 pruebas/tipos/lints exit0.
6. artefactos.mjs genera fragmento y32 recorridos en la carpeta propia; schema.mjs genera esquema cerrado de forma desde la gramática finita. No confundir schema con verificación semántica.
7. PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-dc880819/.cache/flujo-ss-r36/python-env flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/flujo-ss-r36/schema-check.py. Draft202012Validator pasa intacto y pendiente. Sin pip, instalación global ni tools/procedencia/.venv.

No Next build, suites legacy masivas, servidor, preview, originales PDF nuevos ni entornos en docs. Dependencias instaladas compartidos en lectura, no una instalación autosuficiente.

Corrección final del arnés: Vitest --configLoader native y cacheDir=.cache-vite dentro de la proyección propia, para no usar temporales de configuración en node_modules compartido. La ejecución previa pudo escribir temporales allí; se documenta la desviación y no se borra trabajo externo.
