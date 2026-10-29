# Reproducción y controles

Ejecutar desde la raíz de este checkout, con HEAD fijado en el informe. No ejecutar los generadores originales: escriben en su carpeta. `revisar.py` importa verificar.py de R23, lee sus artefactos originales y escribe únicamente resultados de revisión. Sus mutantes viven en memoria y no modifican los JSON conservados.

Entorno Python:

```bash
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/flujo-escalas-r26-sol/venv"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/flujo-escalas-r26-sol/revisar.py
```

Casos propios:

```bash
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs --command bun --no-install --tsconfig-override "$PWD/.cache/flujo-escalas-r26-sol/runtime.json" docs/procedencia/revisiones/flujo-escalas-r26-sol/casos.mjs
flock /tmp/irobopf-validacion-pesada.lock bash docs/procedencia/revisiones/flujo-escalas-r26-sol/calidad.sh
```

El runtime.json de caché fija paths effect y effect/* a `/home/elies/Repos/IRoboPF/node_modules/effect/dist/`, decimal.js al decimal.mjs de ese node_modules y @/* al checkout propio. Se lee únicamente el node_modules recibido del padre, nunca sus cambios de aplicación. Oxlint usa copia propia cotejada del plugin en caché y las 16 reglas originales a error, con --threads=1 --disable-nested-config. Tipos JS mediante checkJs/noEmit/NodeNext/ES2022, tipos node del padre y alias de declaración decimal.d.ts; no es tipado estricto del motor. Ruff y mypy cubren el instrumento Python, sin relajar reglas por entorno.

Reproducción recibida: copias de casos-heredados.mjs y casos-selectores.mjs en caché propia, cambiando solamente las rutas de salida y scratch y los nombres de resultados que colisionarían con los casos propios. La primera escribe replay-casos-resultados.json y replay-casos-264-celdas.json; la segunda escribe sus tres anexos con nombres originales en nuestra carpeta. No son pruebas independientes nuevas; contrastan las expectativas recibidas sin cambiarlas. Los dos logs replay-* y codigos.log conservan resultados, incluidos avisos del runtime. El mutante Murcia de la suite recibida se escribe en caché propia, jamás sobre TS original.

Cotejo físico inicial/final: adaptación del fisico.py recibido, cambiando solamente BASE a 6ab4a98… y count a15456, salida a esta carpeta. `git ls-tree -rz BASE`, un `git cat-file blob OID` cada vez, `lstat`, `readlink` para symlink, bytes para regulares y modo ejecutable. `git diff BASE --no-ext-diff --stat` además del control físico. Lock `/tmp/irobopf-recepcion-acotada.lock` exclusivamente para ese cotejo; todas las pruebas, tipos, verificación de fuentes grandes y empaquetado usan `/tmp/irobopf-validacion-pesada.lock`. No se escribe índice ni objetos VCS.

Los controles finales y de transporte son artefactos de esta revisión, no atestaciones. El patch textual gzip añade solo rutas de la carpeta exclusiva; binarios por ruta/SHA256/tamaño/baseSha256=null. Manifiesto excluye su propia identidad circular e incluye el patch y el mapa de binarios. Cachés, entornos y node_modules quedan excluidos. Los logs/datos superiores a1MB se comprimen; no hay PDFs nuevos ni copias de app.

El preparador reproducible se entrega como preparar.py. Antes de ejecutarlo, crear en la caché propia una copia de tools/oxlint y un symlink node_modules al padre, siempre de solo lectura. No copiar la aplicación ni instalar en el node_modules del padre. El cotejo se entrega como fisico.py; ejecutar con argumento control-inicial o control-final y el bloqueo de recepción. Empaquetado final:

```bash
PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/flujo-escalas-r26-sol/venv" flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/flujo-escalas-r26-sol/empacar.py
```

empacar.py comprime controles propios de más de1MB, construye el patch desde ausencia en base, conserva binarios por ruta y verifica todos los bytes del manifiesto al finalizar. Debe ejecutarse después de calidad y del control físico final. No redirigir su stdout a un archivo dentro de la carpeta durante el empaquetado: ese archivo cambiaría después de calcular su hash.
