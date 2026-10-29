# Reproducción y controles

Raíz: `/home/elies/.t3/worktrees/IRoboPF/t3-639ae305`. Runtime real: T3 Code, harness Codex, gpt-6.1-sol, high. Priority solicitada; sin medición independiente de tier. Sin subdelegación. No se ejecuta ninguna operación VCS mutante.

Nix proporciona herramientas. `rg` y `python3` no estaban en PATH inicialmente; se usa `nix shell nixpkgs#ripgrep nixpkgs#python3 nixpkgs#bun nixpkgs#nodejs -c ...`. La primera lectura conjunta se truncó; los informes pertinentes y las secciones actuales se reabrieron por separado. Fuentes: BRIEF, AGENTS, contrato, coordinación, situación actual de ESTADO/DECISIONES, informes R27 y RX25, fuentes históricas y fuentes actuales. No se leen entregas activas; una consulta general de procesos mostró incidentalmente argumentos ajenos, sin usarlos como evidencia ni abrir sus archivos. Las consultas posteriores se limitan a los procesos propios.

Se consultan `bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js list` y `show data-modeling testing`, y se localiza `decodeUnknownSync` en la fuente local de Schema. No se escribe Effect de producto. Los instrumentos derivados se distinguen de los casos nuevos: preparar/recorrido/comprobar-get/comprobar-publicacion/controles/arbol proceden de instrumentos recibidos, con rutas propias, base correcta y nuevos adversos de ámbito. Adversos, reconstruidos, alcances y mixto-get son controles adicionales de esta revisión.

## Recepción

`flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#python3 -c python3 docs/procedencia/revisiones/multiplicidad-r27-sol/arbol.py inicial`

El mismo comando con `final` cierra el cotejo. Se leen lstat, readlink y bytes contra cada blob de base, uno por vez; ejecutabilidad en ambas direcciones solo en archivos regulares. `git rev-parse`, `git ls-tree`, `git diff`, `git show`, `git cat-file` y `git status` son lecturas. No se usa el índice para justificar integridad.

## Ensayos

Todos estos comandos y recorridos grandes llevan `flock /tmp/irobopf-validacion-pesada.lock`, un trabajador y `PYTHONDONTWRITEBYTECODE=1`. Entorno Python absoluto propio: `UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-639ae305/.cache/multiplicidad-r27-sol/venv`.

1. Con `IRPF_MULTIPLICIDAD_ETAPA=antes`, ejecutar `python3 docs/procedencia/revisiones/multiplicidad-r27-sol/preparar.py`. En el árbol scratch propio, sustituir exclusivamente los .mjs/.ts/.tsx cambiados bajo scripts/procedencia y lib/procedencia por `git show ae37484d2ea5e56ff6cda68283ec7e1ef7a443df:ruta`. Ejecutar `bun docs/procedencia/revisiones/multiplicidad-r27-sol/recorrido.mjs`. Rojo deliberado ID duplicado, código 1. No se ejecuta software extraído de recibos/snapshots históricos.
2. Con `IRPF_MULTIPLICIDAD_ETAPA=despues-acotado`, ejecutar preparar.py sobre las fuentes actuales y recorrido.mjs. Los originales CAS se copian desde fuentes ya entregadas; cada objeto tiene SHA256/SHA512/tamaño en preparacion.json. No se descargan originales nuevos. Exclusiones exactas en alcance-publicacion.json.
3. `bun .../comprobar-get.mjs` y `bun .../comprobar-publicacion.mjs`: GET de 90 sujetos y 18 objetos; 228 correspondencias; cuatro negativos de cobertura.
4. `bun .../adversos.mjs`: 29 URLs BORM adversas, cambios físicos tardíos y 38 snapshots leídos con consumidor actual. El código histórico conservado se analiza como datos/AST por el consumidor, nunca se importa ni evalúa.
5. `bun .../reconstruidos.mjs`: recompone recibo, sujetos, paquetes, índices, búsqueda y cierre en scratch; conserva expectativa de rechazo y resultado real, incluso si termina rojo.
6. `IRPF_MULTIPLICIDAD_ETAPA=despues-acotado bun .../mixto.mjs`: retira una sola aprobación exacta de un sujeto repetido y pone en null su referencia de atestación únicamente en el registro scratch, ejecuta coordinador/publicador reales y GET. La primera selección diseñada retiraba una aprobación excluida; se detectó antes de ejecutar ese instrumento y se conserva mixto-seleccion-inicial.mjs como diseño no ejecutado. También se conserva el diseño no ejecutado mixto-sin-retirar-referencia.mjs: mantener la referencia sin aprobación produciría rechazo, no pending. No son rojos de producto. La selección efectiva exige payload admitido y sujeto repetido.
7. Restaurar solo registro.json y revisores.json scratch desde sus copias originales de ensayo. `bash tools/procedencia/run.sh .../controles.py`: 228 ámbitos y negativos de identidad/atestación; años y territorios ajenos rechazados. `bun .../alcances.mjs`: correspondencias individuales y unión exacta con 36 exclusiones. `bun .../mixto-get.mjs`: etiquetas dt/dd por sección/payload real y MIME/hash/tamaño de todos los objetos; revisión ajena 404.
8. reconstruidos-historico.mjs repite la proposición alterada con consumidor ae37484 y un snapshot histórico con recibo v1. Se copian únicamente sus objetos de cierre a scratch propio; no se ejecuta código guardado en ellos. No modifica los originales históricos ni sus esperados.

Los scripts .cache/*sh solo agrupan esos comandos, secuencialmente, dentro del lock pesado; no crean checkouts. Los códigos están separados por log y JSON. Ningún resultado de coordinador se inyecta. Las identidades, atestaciones y proposiciones fiscales son las originales. Las modificaciones de recibo/registro se identifican como adversos de ensayo, sin atestaciones fiscales nuevas.

## Calidad y transporte

`calidad.sh` copia cada instrumento JS byte a byte a scratch y aplica configuraciones originales: oxlint `--threads=1 --disable-nested-config`, las dieciséis reglas anti-slop a error y ESLint. Ruff y mypy (`--check-untyped-defs --follow-imports=silent`) cubren Python propio mediante uv/lock del proyecto y entorno propio. No se atribuye un typecheck TS de producto a instrumentos JS ni se ejecuta Next build o suite legacy.

`entregar.py` genera manifiesto por ruta/SHA256/tamaño/baseSha256, patch textual gzip y binarios por hash. Ensaya aplicación con la herramienta patch en un directorio scratch vacío (no un checkout), repone binarios y coteja cada byte. El sobre excluye sus archivos autorreferentes y declara esa exclusión. No usa git apply ni commits. Logs/controles mayores de 1 MB se comprimen antes del empaquetado; PDF originales, entornos y copias de app permanecen fuera de docs.

## Rectificaciones conservadas

controles.py termina rojo porque su mutación duplicaba la primera aprobación del registro completo, que pertenece a un payload excluido, en vez de la aprobación del primer enlace admitido. controles-final.py conserva el rechazo esperado y selecciona revisor y aprobación por las identidades exactas de ese enlace. El control rojo inicial no prueba un bypass de aprobación duplicada del enlace examinado.

mixto-get.mjs termina rojo porque React intercala comentarios HTML entre texto e interpolación. mixto-get-final.mjs retira únicamente comentarios antes de comparar h2 y pares dt/dd dentro de cada sección de payload; no cambia los estados esperados ni sustituye el contrato por prosa.

La calidad inicial conserva mypy ausente. calidad-final.sh utiliza `uv run --with mypy`; encuentra después el import local `enlaces` fuera del path estático. El pase adicional usa `MYPYPATH=/home/elies/.t3/worktrees/IRoboPF/t3-639ae305/tools/procedencia`, las mismas opciones y los cinco archivos Python propios; no ignora imports ni desactiva errores. Logs anteriores permanecen. ESLint emite el aviso de entorno Pages ausente en el árbol scratch; el alcance review sí se analiza, sin errores finales de reglas. La primera advertencia propia de import JS sin uso se corrige solo en ese instrumento.

El contraste adicional `frontera-reconstruidos.mjs` guarda snapshots reconstruidos como objetos reales scratch sin añadirlos al registro: leerSnapshot devuelve null. Sustituir bytes bajo el ID fijado del original se rechaza por hash y se restaura solo el archivo scratch. Comprueba tanto proposición ajena como cita cruzada por payload. La llamada directa a verificarContenido admite ambos objetos internamente coherentes; no se promete una reproducción semántica general ni autenticación del emisor del recibo. El publicador real genera su recibo internamente; no se inyecta ese resultado en él. reconstruidos-historico.mjs conserva el mismo rojo para la proposición con consumidor anterior/recibo v1.

Transporte inicial: código 1, patch malformado por un archivo sin salto final. Se conserva entrega-inicial.patch.gz. El empaquetador añade el marcador estándar de ausencia de newline y usa transporte-final como scratch nuevo; vuelve a pasar Ruff/mypy y el ensayo byte a byte. No se borra el scratch anterior.
