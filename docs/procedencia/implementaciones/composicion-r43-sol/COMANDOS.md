# Comandos y atribución

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Todos desde el checkout indicado por HEAD. Los instrumentos exactos y las configuraciones se conservan en controles como texto; las rutas absolutas pertenecen a este entorno.

- Rojo previo y pases: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c /home/elies/Repos/IRoboPF/node_modules/.bin/vitest run --config .cache/composicion-r43-sol/vitest.config.mts --configLoader native`. Caché false, cacheDir absoluto, un trabajador.
- Generación sin CLI histórico: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun .cache/composicion-r43-sol/generar.ts`.
- Calidad focalizada: `flock /tmp/irobopf-validacion-pesada.lock bash .cache/composicion-r43-sol/calidad.sh`. Generación, tests, tipos estrictos, oxlint y schema.
- Oxlint: `--threads 1 --disable-nested-config`, configuración del integrador con las 16 reglas a error. El global enumera los archivos del proyecto excluyendo exactamente vendor y scratches históricos; el primer intento sin esa selección lintó indebidamente el propio vendor y quedó conservado.
- ESLint: configuración absoluta del integrador, mismo alcance global explícito. Advertencia React detect por dependencias enlazadas lógicamente, no error.
- Tipos globales y vendor: configuraciones equivalentes en scratch con resolución explícita de paquetes del integrador. Se conservan los errores iniciales de resolución, los diagnósticos nuevos corregidos y el diagnóstico histórico pendiente. No se modifica el test ajeno para obtener verde.
- Schema: run.sh con PYTHONDONTWRITEBYTECODE=1 y UV_PROJECT_ENVIRONMENT absoluto propio. Registro local `referencing`, sin resolución de URLs externas. RefResolver anterior produjo colisión de definiciones entre fragmentos, conservada.
- Transporte: instrumento empaquetar.py mediante Python Nix/uv y lock pesado; GNU patch en scratch propio, binarios por ruta/SHA256 y cotejo exacto posterior. No es un checkout ni contiene metadatos VCS.

El módulo pequeño de hashes usa checkJs estricto y una excepción documentada al diagnóstico Effect nodeBuiltinImport: el generador documental síncrono necesita leer bytes locales. No se desactiva ninguna de las 16 reglas anti-slop. Los MJS históricos conservan su estado de tipos; los cinco diagnósticos checkJs SS están identificados en correcciones/unidades-colecciones-r41/limite-checkjs.json y no se corrigen aquí.
