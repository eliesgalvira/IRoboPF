# CAS local externo R27: implementación candidata

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `1ed8acfdf77dfee5330da0f0131f42956b45206a`.

## Contrato

Snapshot v3 conserva el modelo documental de v2 y añade `externos`: descriptores de `hash` SHA-256, `sha512`, `bytes`, `mime` y `clase`. No admiten ruta, host ni campos adicionales. La clase es exclusivamente `original-pdf`, MIME `application/pdf`, tamaño entero mayor de 10.000.000 y hasta 100.000.000 bytes. El objeto debe ser original de una entidad Document del grafo, público y dependencia del snapshot. El límite de metadatos/objetos versionados continúa en diez millones. El techo externo es un límite de recursos de esta implementación, no una política general para permitir archivos grandes ni una autorización para añadirlos a Git.

`IROBOPF_CAS_LOCAL` designa exclusivamente una raíz absoluta local y canónica, sin symlinks. No tiene valor por defecto. El único nombre derivado es el SHA-256 completo; nunca procede de una ruta elegida por cliente. Sin configuración, sin objeto o con bytes incorrectos, la ruta devuelve 503 sin caché. Fuera del allowlist devuelve 404. No hay búsquedas globales, descargas ni fallback. El mismo hash puede respaldar varios ámbitos; cada payload conserva su identidad y su estado.

La lectura es específica de Linux: abre cada componente con O_DIRECTORY/O_NOFOLLOW mediante descriptores anclados en `/proc/self/fd`. Comprueba identidad de ancestros, archivo ordinario, tamaño antes de reservar, lectura acotada por bloques, SHA-256, SHA-512 y firma inicial PDF. Revisa identidad y tiempos del archivo y ancestros antes de devolver el buffer verificado. La firma inicial solo comprueba coherencia MIME básica, no valida la estructura completa de un PDF ni su autenticidad.

## Decisiones, objeciones y costes

1. **Versión nueva, historia intacta.** Objeción experta: cambiar retrospectivamente v2 alteraría la promesa de sus bytes. Respuesta: v1 y v2 mantienen su semántica; v3 es explícita y el software queda fijado mediante las fuentes del helper existente, que ya incluye lector, IO, modelo, rutas y verificadores. Migración: generar y publicar un snapshot nuevo en scratch; ningún alias o snapshot activo se cambia. Coste: los consumidores anteriores no pueden leer v3. Se amplía necesariamente la ruta de ficha, fuera de la lista principal del encargo, para conservar los estados v3; no hay cambio visual.
2. **Buffer verificado frente a streaming del archivo mutable.** Objeción experta: verificar el archivo y luego transmitirlo permite una mutación entre ambas operaciones. Respuesta: solo se sirven bytes del buffer ya verificado. Coste: memoria y latencia proporcionales al original; techo de 100 MB por objeto, más buffers de HTTP. No hay garantía de concurrencia ilimitada ni streaming de memoria constante. El servidor no queda autorizado ni configurado para producción; requiere presupuesto de concurrencia y medición del host.
3. **Sin caché persistente de integridad.** Objeción experta: una caché por hash ignoraría corrupción posterior. Respuesta: cada petición vuelve a leer; el verificador deduplica externos exclusivamente durante su ejecución y el recorrido de una ficha verifica cada hash una vez. El adaptador evita volver a cargar un original por cada binding. Coste: I/O y hashes en cada operación nueva; no se certifica disponibilidad permanente.
4. **Publicación por fases.** Objeción experta: un descriptor publicado antes del archivo dejaría una promesa incumplida. Respuesta: copia ordinaria temporal, fsync, enlace atómico sin sobreescribir objetos existentes, verificación final y registro de snapshots al final. Metadatos y registro usan fsync. Fallo anterior al registro no promueve snapshot; puede dejar objetos huérfanos. Fallo de fsync del directorio posterior al rename significa visibilidad posible y durabilidad indeterminada, no reversión. Coste: espacio temporal, operación de un único editor y recuperación explícita; no se introduce coordinador multiusuario.
5. **Preservación local explícita.** Objeción experta: los metadatos no reconstruyen un original ausente. Respuesta: conservar originales recibidos y copiar cada externo por ambos hashes y tamaño junto al cierre de metadatos en un paquete local; restaurar en una raíz nueva y ejecutar el verificador antes de habilitar su registro. El instrumento de restauración ensaya copias ordinarias sin hardlinks. Coste: otra copia de los originales; mismo disco/máquina no equivale a custodia independiente. V4 no se modifica y no incluye este candidato; V5 en curso no se inspecciona. Integración con futuras ediciones de preservación queda pendiente del integrador.
6. **Integridad separada de fiscalidad.** Objeción experta: un archivo íntegro puede ser apócrifo, inaplicable o mal interpretado. Respuesta: CAS no modifica autenticidad, exactitud jurídica, interpretación ni aceptación; `aceptacionFiscalCompleta` permanece false. El registro candidato solo vive en scratch. Coste: revisión independiente nueva del software y del lote antes de cualquier promoción.

## Reproducción local

Desde este checkout, herramientas por Nix y `node_modules` compartidos en solo lectura. No ejecutar los instrumentos contra el árbol activo. Scratch: `.cache/cas-local-r27-sol/`. El preparador lee exclusivamente las fuentes entregadas en `despues-url` del integrador y el recibo correspondiente; no descubre entregas activas. `IRPF_CAS_FUENTE` permite usar otra copia local de esa entrega, no una URL. El enlace node_modules es infraestructura de ejecución, no se transporta ni se preserva como código.

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun tests/cas-local-r27.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun docs/procedencia/implementaciones/cas-local-r27-sol/preparar.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c env PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/cas-local-r27-sol/venv" bun docs/procedencia/implementaciones/cas-local-r27-sol/recorrido.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun docs/procedencia/implementaciones/cas-local-r27-sol/historicos.mjs
```

El preparador requiere destino nuevo; una segunda ejecución conserva el anterior y falla al intentar recrear su enlace. Para repetir, usar otra copia del checkout o adaptar explícitamente el nombre de scratch, sin borrar originales. Python del coordinador se ejecuta con run.sh/uv y entorno absoluto propio; no se instala globalmente ni se escribe tools/procedencia/.venv.

## Controles e incidencias

El rojo del lote real recibido está en `correcciones/multiplicidad-r27/despues-url/recorrido.json`; no se altera. `rojo.log` conserva la ejecución anterior al arreglo del consumidor con un PDF sintético sin autoridad, que rechaza v3. No se presenta como original oficial. Los históricos de multiplicidad, BORM y límite permanecen intactos.

## Integración y límites operativos

Al integrar se debe revisar el patch y sus fuentes fijadas, copiar los metadatos del nuevo cierre y copiar los originales externos por los hashes declarados a una raíz local autorizada. Debe ejecutar el verificador y el ensayo de rutas antes de habilitar el registro que contenga ese snapshot. No basta copiar `snapshots.json` o el descriptor. No se transportan entornos, node_modules ni una copia de la app dentro de docs; los instrumentos construyen su árbol de ensayo exclusivamente en scratch.

Esta implementación exige Linux y `/proc/self/fd`; en otro entorno falla cerrada y requiere otro adaptador revisado. Las lecturas y hashes síncronos bloquean el hilo Node durante la operación. Objeción experta: solicitudes simultáneas de originales grandes pueden consumir memoria o tiempo de CPU aunque cada archivo esté acotado. Respuesta: este candidato garantiza límites por objeto y bytes servidos, pero no se despliega ni se atribuye capacidad de producción; la integración debe fijar permisos de lectura del usuario del servicio, raíz local estable, presupuesto de concurrencia y ensayo de carga. Coste: disponibilidad ligada al volumen local y trabajo operativo pendiente. No se configura hosting, nube ni proveedor.

El primer recorrido completo terminó correctamente antes de detectar la regresión de diagnóstico en las veinte pruebas de contenido. Quedan sus resultados en `recorrido-antes-diagnostico.json` y su log en `reintento.log`: quince regresiones focalizadas correctas, 19/20 de contenido correctas. El esperado histórico no se modifica: se restaura el mensaje «Objeto prometido ausente». Cambiar ese byte de software exige generar el candidato definitivo, no atribuirle retrospectivamente el hash anterior.

## Resultado definitivo

Snapshot candidato solo en scratch: `04ca779ef9fd37d84b94507c307b852f669cdd81a3a8b8ddbc52df7954747f67`. El recorrido real conserva 264 pares, 102 sujetos, veinte objetos públicos y 36 enlaces del original BOE exacto. Todos los GET de fichas y objetos se cotejan; el original no se transforma ni se excluye. El fallo de escritura inyectado conserva el registro anterior.

Pasan tipos principales, oxlint con un hilo y las dieciséis reglas a error, quince regresiones focalizadas en dos archivos y veinte pruebas de contenido. El contrato sintético reforzado pasa. Verifican los 38 snapshots históricos y la restauración del candidato desde copia local ordinaria, incluido el externo por ambos hashes y tamaño. Las sumas de pruebas no representan cobertura fiscal.

El recorrido conjunto tarda 190844.864335 ms; RSS máximo del proceso Bun 3300004 KiB. Incluye generación, dos llamadas al publicador (fallo inyectado y positivo), verificación y GETs. No incluye el RSS agregado de hijos ni representa latencia individual, carga de producción o memoria del lector aislado.

Los controles, resultados, entradas fijadas, originales referenciados y diagnósticos se conservan en JSON y logs. El patch textual comprimido y el manifiesto describen el transporte; el original externo se entrega por ruta local, ambos hashes y tamaño, fuera de Git. No se cambia confianza activa, cálculo, inventario, alias o snapshots versionados. Falta revisión independiente nueva y contraste de integración; esta entrega no acepta la regla fiscal completa ni cierra el encargo global.

## Cotejo y paquete

El descriptor exacto del candidato se conserva en snapshot-candidato.json. cierre-candidato.json apunta al censo comprimido de 3.328 objetos prometidos con rutas locales, hashes, tamaños y clases; no copia los originales a docs. El control se comprime por superar 1 MB y conserva el hash de sus bytes originales. El PDF externo y los demás originales recibidos permanecen en CAS propio.

El sobre de transporte distingue el patch textual gzip, el control binario gzip por ruta/hash y el original externo por ruta, SHA-256, SHA-512 y tamaño. El ensayo aplica el patch sobre copias de los blobs de base en scratch sin repositorio VCS, copia el control binario y coteja cada archivo del manifiesto. El transporte del CAS externo se contrasta con la restauración ordinaria verificada del candidato. El manifiesto y su sobre se excluyen de la autorreferencia.
