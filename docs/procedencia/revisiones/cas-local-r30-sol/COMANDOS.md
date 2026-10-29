# Ejecución

Desde el checkout de base 376fb100512ca6a2f975c3c9500a20ee375dd431. Sin operaciones VCS mutantes. git rev-parse, status, ls-tree, cat-file y diff se usan solo para lectura. Las fuentes de instrumentos se adjuntan; el scratch no es una app publicada.

- Cotejos: `flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#nodejs -c node .cache/revision-cas-r30/fisico.mjs <salida>`; lstat, readlink, ejecutabilidad y bytes contra cada blob, sin agrupar blobs en memoria.
- Preparación de adaptaciones: `nix shell nixpkgs#bun -c bun .cache/revision-cas-r30/adaptar.mjs`; diffs de cada receta adjuntos. pins.mjs contrasta fixture y original v5 r2 bajo lock pesado.
- IO adversarial: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node .cache/revision-cas-r30/adversos-io.mjs`.
- Recorrido: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun nixpkgs#python3 -c bash .cache/revision-cas-r30/ejecutar.sh`. Exporta PYTHONDONTWRITEBYTECODE=1 y UV_PROJECT_ENVIRONMENT absoluto a este scratch. Python del coordinador usa run.sh/uv. node_modules del padre se enlaza solo desde scratch y se consulta en lectura.
- HTTP/recibos: mismo lock con Bun y NODE_PATH del padre, `adversos-http.mjs`.
- Calidad: mismo lock, `calidad.sh`; oxlint un hilo, disable-nested-config y las 16 reglas del checkout a error; tipos del árbol de ensayo. Ningún build ni suite legacy masiva.
- Cierre: mismo lock, Bun `cierre.mjs`; coteja un objeto cada vez y comprime el censo. No abre registros activos ni el paquete preservado para escritura.

Dos primeros intentos de listado del instrumento excedieron el maxBuffer de spawnSync (ENOBUFS); no son pruebas de producto. Se acotó el listado del adaptador a sus tres prefijos y se amplió a diez millones el buffer de listado físico. Este buffer no cambia ningún límite CAS. La primera localización de COORDINACION en raíz falló y se resolvió en docs/procedencia. rg no estaba disponible; no se confunde con un resultado vacío de búsqueda.

La primera carga de oxlint falla por resolución ESM de @oxlint/plugins en la raíz sin node_modules. `lint-corregir.mjs` copia configuración y fuentes exactas del plugin al ensayo ya enlazado en lectura con node_modules del padre, copia los instrumentos propios y repite oxlint allí. No se modifica la configuración del producto ni se rebajan reglas. Se conserva `lint.log`, la repetición tiene su propio log/recibo. Los tipos se ejecutan con noEmit e incremental=false en el árbol de ensayo y pasan.

Para repetir desde los instrumentos `.mjs.txt`, copiarlos a sus nombres `.mjs` en un scratch nuevo, adaptar una única vez el prefijo de scratch y registrar ese diff; las recetas preparar/historicos requieren destinos nuevos. No reutilizar destinos ni sobrescribir informes previos. El primer adaptador genera las recetas; la edición final de preparar añade las dos dependencias Python R30 y es la que fija adaptaciones.json. El scratch contiene registros simulados que no deben incorporarse al árbol activo ni añadirse masivamente a Git.

Transporte final: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#patch -c bun .cache/revision-cas-r30/empaquetar.mjs`. Se realiza después de ambito.mjs. El primer ensayo también pasó, pero el bloqueo no garantiza orden FIFO entre procesos pendientes y terminó antes del recibo de ámbito: sus sobres y árbol restaurado se conservan en scratch propio. Se repite solo el empaquetado para incluir ese recibo y esta nota; no se repiten recorrido, históricos ni pruebas de producto. La segunda aplicación comprueba el conjunto definitivo.
