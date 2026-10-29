# Revisión independiente de preservación

29 de octubre de 2026. Base solicitada: `ed6a43fd750de05609abc3710dabdc2f8261020c`. Dictamen: **requiere cambios en cuatro puntos P2** antes de presentar el protocolo como validación de paquetes publicables y preservación durable. El paquete concreto supera la comprobación independiente de integridad y la restauración local. No hay respaldo remoto acreditado ni aceptación fiscal nueva.

Trabajo personal, sin delegación, fixes, operaciones VCS, cambios de permisos de originales o escrituras remotas. Se leyeron BRIEF, AGENTS, contrato, coordinación, estado, decisiones, integración ronda 7, código, nueve pruebas y documentación de preservación. Los JSON completos se recorrieron programáticamente; sus claves duplicadas se buscaron en todo el conjunto, sin encontrarlas en los documentos entregados. Se cotejaron los hashes de los archivos de la entrega y su patch. La base es la indicada por el padre: esta revisión no sustituye su comparación del árbol base y borrados.

## Comprobaciones independientes

El paquete existe en `/home/elies/.t3/worktrees/IRoboPF/t3-16df10f6/.cache/procedencia/preservacion-en-preparacion/paquete`. Su manifiesto coincide byte a byte con el revisado: SHA-256 `2df6c208eed389614e678c9009ccf463b00f3bfed9cf098876ce7d9329f593fb`.

Un pase propio en flujo, sin llamar al fingerprint del producto, verificó **708 objetos, 974.801.535 bytes, SHA-256 y SHA-512**. Después se restauraron todos mediante el producto a `/home/elies/.t3/worktrees/IRoboPF/t3-674e3678/.scratch-preservacion/restauracion`, destino nuevo, con verificación de bytes copiados, manifiesto exacto e inodos distintos. La alteración y ausencia de un objeto de esa restauración fueron rechazadas; se repuso y comprobó el objeto. No se tocaron originales. La lectura completa y restauración se ejecutaron con el lock compartido, un proceso y memoria en flujo. Se conserva una sola restauración grande propia; no se regeneró inventario.

Pasan las nueve pruebas existentes, Ruff y mypy `--follow-imports=skip --check-untyped-defs` de las dos fuentes. Ese mypy no es un esquema runtime ni un typecheck estricto. No hay código Effect o TypeScript nuevo ni cambios de reglas anti-slop. La comprobación Python pequeña de tipos se ejecutó sin el lock compartido: desviación operativa del encargo, sin solapar otra prueba pesada propia; no se presenta como cumplimiento estricto de esa serialización. No se ejecutaron build ni suites legacy. Un intento de Nix con el nombre antiguo `poppler_utils` falló; el nombre vigente `poppler-utils` permitió la ejecución. Ambos logs se conservan.

Se cotejaron **2.905 adquisiciones** contra los archivos que las declaran: hashes de metadatos, URL inicial/final, fecha, estado, SHA-512 y tamaño, sin discrepancias. Todas las ubicaciones de los originales declaradas en raíz existen y tienen el tamaño esperado; no se volvió a hashear esa segunda copia de casi 1 GB. Los **708 punteros LFS** corresponden exactamente a oid y tamaño del manifiesto.

## Selección y exclusiones

Se confirman 1.420 dependencias, 27 objetos sin adquisición admisible, ocho rutas excluidas, 369 eventos excluidos por URL y un índice demasiado grande. Son categorías diferentes; no deben sumarse como documentos perdidos. Para 26 de esos 27 objetos se hallaron registros de adquisición en las dependencias, todos rechazados por la política de URL; para uno no se halló evento con canonicalUrl. «Sin adquisición admisible» no significa «jamás adquirido» ni «documento inexistente». Hay fuentes de dominios fiscales entre los excluidos, además de fuentes técnicas: hace falta clasificar cada caso antes de afirmar cierre del corpus. Se conservan fuentes y claves de query en `logs/exclusiones-hosts.json`, sin ampliar automáticamente la allowlist.

Las **9.295 cadenas no resueltas no son documentos ausentes**. La expresión regular extrae incluso mitades de SHA-512: 1.416 de estas cadenas coinciden con las dos mitades de los SHA-512 de los 708 objetos seleccionados. Es evidencia concreta del ruido del recuento, además de hashes de código, entregas y snapshots. Se mantiene la denominación conservadora del autor. Objeción experta: convertirlo en porcentaje de cobertura documental produciría un indicador falso. Motivo: las referencias carecen de tipo semántico. Coste: clasificar relaciones por esquema y conservar el repositorio/artefactos por separado del paquete.

## Hallazgos reproducidos

**PRE-01 — esquema y JSON ambiguo.** `validate` admite versión booleana, total float equivalente, campos desconocidos, afirmaciones arbitrarias de autenticidad y adquisiciones sin validar. `json.loads` acepta claves repetidas; `transfer` vuelve a publicar los bytes ambiguos originales. Un manifiesto sintético con `headers.Cookie` se exporta íntegro; otro con dos acceptance contradictorios también. El verificador sigue devolviendo aceptación superior «ninguna»: no se ha demostrado que conceda aceptación fiscal, sino que permite republicar metadatos indebidos. Exigir parser sin duplicados y esquema cerrado de campos, tipos y valores antes de escribir. Objeción: integridad de blobs no acredita privacidad ni significado único. Coste: rechazar manifiestos antes tolerados y versionar migraciones.

**PRE-02 — privacidad de URLs.** El filtro permite texto libre en `id`, `txt` y rutas de host oficial; el plan conserva el marcador sintético. No se ha observado ni copiado un caso personal real: es una reproducción de la insuficiencia del control. Un puerto malformado produce excepción sin exclusión. Exigir formatos por endpoint y registrar rechazo de URL inválida. Objeción: un nombre de parámetro autorizado no clasifica sus valores. Coste: más clasificación y posibles exclusiones de documentos públicos legítimos.

**PRE-03 — symlinks de entrada y destino.** `.cache/procedencia` enlazada hacia fuera se recorre y selecciona; hojas regulares pasan el filtro. En cambio, exportar luego esas fuentes falla por `safe_source`. Un destino nuevo bajo un ancestro symlink también se crea. El caso no requiere carreras hostiles. Exigir comprobaciones de ancestros y raíces antes del recorrido y escritura. Objeción: el comentario «sin seguir enlaces» es más fuerte que el comportamiento. Coste: rechazar configuraciones locales con enlaces o declararlas mediante una política explícita.

**PRE-04 — durabilidad.** Instrumentación de `os.fsync`: archivo CAS, temporal de manifiesto y directorio destino; falta sincronizar el directorio `sha256` y el padre del destino nuevo. El enlace exclusivo impide sobrescritura y publica el marcador al final durante ejecución normal, pero no garantiza persistencia ordenada de todas las entradas ante caída del sistema. No se simuló un corte eléctrico; el hallazgo es la falta comprobada de sincronización, no una pérdida observada. Completar el protocolo de durabilidad y sus límites por filesystem. Objeción: visibilidad atómica del marcador no implica durabilidad del paquete. Coste: IO y pruebas de fallo adicionales.

Los detalles, ubicaciones y decisiones están en `findings.json`; los casos y logs son reproducción conservada, no código de producto ni sustitución de su lint.

## Defensas que sí funcionan y límites ya declarados

SHA-256 duplicado, tamaño booleano, SHA-512 incorrecto, tamaño incorrecto, fuente cambiada, escape de ruta y ancestro symlink de fuente se rechazan. Destino existente y publicación sobre archivo existente se rechazan; los fallos de copia no publican manifiesto. Una ruta absoluta que sigue dentro de raíz pasa: no escapa por ello, pero debe quedar prohibida si el esquema exige portabilidad relativa. `sources[0]` se usa sin fallback: con esa fuente ausente falla aunque exista otra; es fail-closed, no una comprobación de todas las ubicaciones.

Sustituir el manifiesto por otro coherente vacío hace devolver cero objetos íntegros. Es el límite expresamente documentado del anclaje externo, no un quinto defecto nuevo: hay que comparar el hash confiado **antes** de restaurar y no confiar en el manifiesto recibido junto con los blobs. Cambiar manifiesto en disco durante una copia no cambia los bytes ya leídos por transfer. Las dependencias no se revalidan al restaurar: recupera un archivo histórico, no reevalúa vigencia del código actual.

No existe transacción frente a escritor hostil: las comprobaciones de rutas tienen ventanas TOCTOU, un objeto puede cambiar tras su comprobación y permisos 0444 no detienen al propietario. El autor declara ese límite. Objeción: no cabe afirmar seguridad adversarial concurrente. Motivo de aceptar este alcance local: raíces controladas por el operador. Coste: preservar custodia y exigir verificación al consumir; no presentar atomicidad de un fichero como atomicidad de todo el corpus.

## Firmas, CVE y cinco planos de evidencia

Se ejecutó `pdfsig -no-ocsp` sobre los once PDF seleccionados, todos dentro del manifiesto: **ocho firmas criptográficamente válidas y tres PDF sin firma**. Son once documentos examinados, no once firmas válidas. Los logs originales recogen 24 entradas de certificados embebidos, no necesariamente 24 certificados distintos ni raíces confiadas. La comprobación independiente coincide con el alcance criptográfico; no comprueba revocación en línea. El error NSS del registro original y la caducidad no acreditan cadena histórica. Fecha declarada, ByteRange, SHA1 y certificados embebidos no prueban por sí solos tiempo confiable ni PAdES histórico.

Se repitió mediante `descargar.py`, User-Agent y su pausa/lock, una sola recuperación del CVE `BOE-A-2018-9268`: HTTP 200, 32.368.243 bytes y SHA-256 `aac01cdb3005f9276f021359c7a165d810fbaa5419e6e89ceec9ebe891d3150d`, también SHA-512 idéntico al objeto preservado. Es recuperación presente por el endpoint oficial, no prueba retrospectiva de custodia desde 2018 ni validación de otros CVE/CSV.

- **Integridad:** comprobada para los 708 objetos y su restauración local en esta ejecución.
- **Autenticidad:** evidencia parcial de firmas y recuperación oficial; confianza histórica y revocación indeterminadas.
- **Interpretación:** no se reevalúan vigencia, ámbito ni aplicación jurídica.
- **Exactitud:** no hay nueva validación numérica fiscal; el hash no valida cálculos.
- **Aceptación:** ninguna regla nueva aceptada; no se migra Madrid a otro payload/snapshot.

## LFS, JJ y cierre pendiente

La documentación oficial de [compatibilidad de JJ](https://docs.jj-vcs.dev/latest/git-compatibility/) sigue declarando falta de soporte LFS. Empujar punteros con JJ no demuestra cargar objetos. Los 708 punteros revisados son preparación local, no recibos de custodia remota. Harían falta transferencia explícita autorizada, recuperación remota en destino vacío y verificación contra manifiesto fijado; no se implementó uploader.

La [documentación de facturación de GitHub](https://docs.github.com/en/billing/concepts/product-billing/git-lfs) distingue almacenamiento y descarga por cuenta; sus franquicias no prueban saldo disponible. El usuario ordenó dejar transferencia pendiente, sin capacidad ni gasto confirmados y sin repetir la consulta que gestiona el padre. Objeción experta: un backup que no se ha descargado desde otra custodia puede ser solo un catálogo. Motivo: preservar ahora las copias locales verificadas y separar transferencia. Coste: continúa el riesgo de pérdida común del equipo; dos carpetas locales no lo resuelven. No borrar originales ni paquetes.

La revisión local está terminada con esos cuatro cambios requeridos y la limitación remota explícita. El padre decide integración y siguiente revisión; esta entrega no modifica sus registros de confianza, ESTADO o DECISIONES.
