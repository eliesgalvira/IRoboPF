La base de ejecución es /home/elies/.t3/worktrees/IRoboPF/t3-c190fe20, HEAD 1ec684b4e4408068282febf1319c12c6ac8a15c1. Los tests importan esta ruta literal. No se ejecutan desde el código cambiante del padre. Para relocalizar, registrar sustitución de imports y hashes nuevos. node_modules enlaza la raíz, solo lectura.

Todas las validaciones pesadas se serializan con flock /tmp/irobopf-validacion-pesada.lock y nix shell nixpkgs#bun nixpkgs#nodejs. Vitest usa maxWorkers:1. No build, servidor, preview ni suites legacy pesadas.

El scratch de esta revisión es .cache/minimos-v2-sol dentro del checkout. vitest.config.mjs contiene export default con test.include apuntando al glob absoluto de *.test.ts de la entrega, test.maxWorkers=1 y cacheDir absoluto propio. tsconfig.json extiende ../../tsconfig.json, compilerOptions.incremental=false, include con ese mismo glob absoluto y exclude:[].

Comandos:
    
    node_modules/.bin/vitest run --config .cache/minimos-v2-sol/vitest.config.mjs
    node_modules/.bin/tsc -p .cache/minimos-v2-sol/tsconfig.json --noEmit --incremental false
    node_modules/.bin/tsc --noEmit --incremental false
    node_modules/.bin/tsc --noEmit -p tools/oxlint/tsconfig.json --incremental false
    bun scripts/run-lint.mjs
    bun .cache/minimos-v2-sol/smoke.mjs

existing.log fija selección exacta de suites existentes. tipos*.log y lint*.log registran comando y código de salida. La comprobación propia de lint se ejecuta desde /home/elies/Repos/IRoboPF sobre los dos tests de esta entrega, con oxlint --disable-nested-config y ESLint. No se añaden ignores ni se desactivan reglas.

positivos-v1-adaptados.test.ts reproduce únicamente los controles anteriores a los tres rojos de v1. adaptacion-v1.diff registra todos los cambios: ruta de import, 26050→26056, declaración del perfil parcial, fecha de constitución igual al evento en aquellos ejemplos simples. No se cambian los esperados monetarios de esos controles. Los tres rojos históricos permanecen intactos en su origen y se reemplazan aquí por pruebas nuevas del contrato corregido en casos.test.ts.

Los scripts de preparación, lstat/readlink/hashes y extracción quedan en el scratch. base-inicial.json.gz contiene cada ruta de base y comparación con git cat-file blob. No depende del índice para determinar presencia. No se ejecutan operaciones VCS mutantes.

La descarga nueva usa bash tools/procedencia/run.sh tools/procedencia/descargar.py URL --root RUTA_ENTREGA/primarios, siempre con UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/.cache/minimos-v2-sol/uv. Fuentes previas se reabren desde originales inmutables; fuentes-verificadas.json fija rutas, hashes y tamaño. Los .txt son extracciones de lectura, nunca sustitutos del original ni facsímiles.

smoke.mjs es copia scratch del ensayo versionado, con imports ../../tools/ y --disable-nested-config añadido al spawn de oxlint; no forma parte de docs. El pase existing-final incluye nixpkgs#python3 y UV_PROJECT_ENVIRONMENT absoluto. La repetición own usa --reporter=verbose.
