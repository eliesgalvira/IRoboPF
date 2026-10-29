# Comandos y reproducción

Ejecutar desde `/home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1`, HEAD `6e210920a9063b7a7efd0730ae4ab1ac73a2141e`. Los imports de los scripts entregados fijan este checkout. El directorio de salida temporal es `.cache/publicacion-cuota-v2`. No ejecutar desde la raíz mutable del padre. Los scripts solo escriben en scratch; `compilado.mjs` cambia cwd internamente a su paquete.

Se enlazó node_modules de `/home/elies/Repos/IRoboPF/node_modules` para lectura. No se instaló software global. Todas las ejecuciones siguientes llevan `flock /tmp/irobopf-validacion-pesada.lock`, un trabajador. No ejecutar dos grupos en paralelo.

```sh
git rev-parse HEAD
git status --short
git diff --stat 6e210920a9063b7a7efd0730ae4ab1ac73a2141e HEAD
git diff --name-status 5799bb03826719a4dd3500a962e2d6bb5124fdca HEAD -- app/procedencia components/auditoria.tsx lib/dominio next.config.mjs tests/importes-comparables.test.ts
```

El preflight usa git ls-tree con NUL y git cat-file para evitar interpretación de corchetes/acentos. `base.mjs` compara blobs de Git y hashes reales, también de enlaces simbólicos. El primer control erróneo y su explicación están conservados en resultados.json/INFORME.md; base.json comprimido es el resultado corregido.

Entorno de validación: `nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bash -c '…'` dentro del lock. Comandos realmente ejecutados, secuencialmente y guardando stdout/stderr y código de salida:

```sh
bun run typecheck
bun run lint
bun run test:lint
bun x vitest run tests/importes-comparables.test.ts tests/contenido-integridad-procedencia.test.ts tests/evidencia-contenido-procedencia.test.ts --maxWorkers=1
CIRCLE_NODE_TOTAL=2 NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=3072 timeout 900 bun run build --webpack
```

Único build ejecutado: código 0. No repetirlo por rutina. Después:

```sh
bun .cache/publicacion-cuota-v2/repro.mjs
bun .cache/publicacion-cuota-v2/comparable.mjs
node .cache/publicacion-cuota-v2/compilado.mjs
UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/.cache/publicacion-cuota-v2/uv bun x vitest run tests/publicacion-evidencia.test.ts --maxWorkers=1
node .cache/publicacion-cuota-v2/retrazar.mjs
bun .cache/publicacion-cuota-v2/base.mjs
bun .cache/publicacion-cuota-v2/puerta.mjs
bun x vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
bun .cache/publicacion-cuota-v2/escape.mjs
node .cache/publicacion-cuota-v2/compilado.mjs
```

Para reproducir desde la entrega, usar las rutas absolutas de esos scripts en lugar de sus copias .cache, conservando cwd. Orden final para compilado: retrazar → escape → compilado. El primer compilado falló EISDIR y el primer escape devolvió 503 por revisión no canónica; se conservan ambos resultados y el informe explica la adaptación. No se usaron como pruebas verdes. La prueba de publicación invoca el coordinador real y el wrapper `bash tools/procedencia/run.sh`; la variable UV se fija antes de esa invocación. La reconstrucción tiene python3 en Nix. No se ejecutan suites legacy pesadas.

Antes del arnés Effect se ejecutó, dentro de `nix shell nixpkgs#bun nixpkgs#nodejs`, `bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js list` y `show testing basics`; se consultó Effect.ts del repositorio local. effect.log conserva la salida.

Lint propio explícito desde `/home/elies/Repos/IRoboPF`, siempre bajo lock y Nix:

```sh
bun x oxlint --disable-nested-config --config /home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/.oxlintrc.json docs/procedencia/revisiones/publicacion-cuota-v2/*.mjs && bun x eslint --config /home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/eslint.config.mjs docs/procedencia/revisiones/publicacion-cuota-v2/*.mjs
```

Primer intento: anti-slop rechazó el spread condicional del arnés comparable. Se sustituyó por asignación explícita; no se cambió ninguna regla ni extensión. Pase final: código 0 sin diagnósticos. El typecheck principal/vendor también pasa; no se afirma que TypeScript haya analizado los scripts JavaScript externos como si fueran TypeScript.

Todos los resultados numéricos, HTTP, hashes y adversos están en los JSON; las observaciones del consumidor se basan en el código fijado por base.json. El último git status conserva solo .cache no versionada; no hubo mutaciones VCS. Logs/JSON grandes se comprimen con gzip y nombre SHA256 de los bytes originales, descritos en COMPRIMIDOS.json. MANIFIESTO.json no se incluye a sí mismo; su hash se entrega en MANIFIESTO.sha256.
