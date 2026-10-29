# Paquete local ampliado v3

Entrega candidata del 29 de octubre de 2026 sobre `65cff4fd8eb8c6269c2ce97b88e770aa711bff7f`. Trabajo personal, sin subdelegación ni operaciones VCS mutantes. **Exportación real y restauración vacía completas: 945 objetos, 1.068.593.978 bytes de objetos en cada copia.** Verify y confirm terminan correctamente. Nueva revisión independiente necesaria; no se emite atestación fiscal.

`preflight.json` comprueba HEAD exacto, diff vacío y presencia mediante lstat de las 9.391 entradas de base, incluidos tres enlaces enumerados con readlink. Solo se añaden archivos en esta carpeta y scratch propio. La ruta abreviada del encargo `correcciones/integracion-ronda13/INFORME.md` se resolvió a `docs/procedencia/correcciones/integracion-ronda13/INFORME.md`. Se consultaron BRIEF, AGENTS, contrato, coordinación, estado, decisiones y los informes de preservación, revisión v2, integración técnica r11 y correcciones. No se inspeccionaron entregas en curso ajenas.

## Contenido y cobertura

Los **708 objetos v2 / 974.801.535 bytes** permanecen íntegros. El anexo añade **237 hashes / 93.792.443 bytes**: 41 documentos primarios candidatos, ocho capturas secundarias de URLs oficiales AEAT y 188 facsímiles identificados por referencia explícita. Los 41 no equivalen a normas nuevas ni los ocho a ocho algoritmos: pueden contener documentos de apoyo. Se conservaron distintos bytes de una misma URL, sin seleccionar retrospectivamente una única versión.

`cobertura.json` coteja SHA256, SHA512 y tamaño de cada registro de los cinco manifiestos/recibos obligatorios. Los 19 originales de retenciones 2012–2016, los 19 TGSS mensuales, los tres de su ampliación r13 y los 21 objetos del recibo estatal están incluidos; cero ausencias en esos lotes. Los registros anidados y lotes solapados no se suman como originales distintos. Los 21 estatales incluyen facsímiles: el recibo no acredita que todos sean documentos adquiridos.

El recolector examina los documentos versionados de la base, no solo esos lotes. `matriz.json` registra 1.282 hashes encontrados: 708 previos, 237 añadidos, 336 fuera de selección por falta de adquisición admisible o clasificación de facsímil, y una referencia sin localizador dentro del ámbito recorrido. El sobre conserva además referencias hexadecimales no resueltas, que incluyen código, snapshots y otros artefactos; **no son un recuento de documentos perdidos**. Las exclusiones por evento URL y los índices mayores de 16 MiB permanecen explícitos. La clasificación y cobertura no garantizan descubrir una adquisición sin manifiesto ni bytes fuera de las raíces autorizadas.

La referencia `2d0dd390…` marcada `ausente` en la matriz se resolvió después: existe bajo `docs/procedencia/corpus/fixtures/sha256/`, directorio excluido deliberadamente del recorrido. `cierre.json` conserva su ubicación y ambas huellas: no es una pérdida demostrada. Se mantiene la matriz original y esta explicación en vez de ocultar el resultado. Los once binarios públicos del CAS no oficial de X se enumeran por manifiesto en `exclusiones-publicas.json`, separados de originales oficiales. No se copiaron cuerpos de posts, datos privados ni CAS de X al paquete. El recorrido inicial llegó a hashear archivos públicos ya versionados de esas carpetas antes de acotar su exclusión; no se incorporaron a la exportación. Los primeros planes de diagnóstico quedaron sustituidos antes de crear destinos externos.

## Formato, metadatos y dependencias

El nuevo `manifest.json` es un sobre de ampliación `formatVersion: 1`, `edition: 3`. **No se renombra schema 2 a schema 3.** `transporte-v2.json` sigue el schema 2 existente, conserva los 708 objetos y sus metadatos históricos, y solo cambia sus localizadores de exportación para leer paquete-v2. Preservacion.py, preservacion_urls.py, schema y manifiestos históricos no cambian.

El anexo admite clases separadas. Conserva únicamente huellas, tamaño, URL canónica/final, fecha, estado HTTP y dependencia de adquisición; no publica cabeceras de sesión. Preservar bytes y metadatos declarados no prueba quién sirvió el documento. Se añaden **1.910 referencias de dependencia, 1.827 objetos de dependencia únicos / 127.867.665 bytes**, copiadas por hash a `dependencies/` y verificadas también en restore/verify. Son documentos versionados de la base. Las dependencias históricas de v2 siguen fijadas por sus hashes; no se fabrican versiones antiguas cuando el archivo actual haya cambiado. No es una restauración completa del repositorio, del motor o del estado histórico de cada revisión.

El sobre tiene controles propios de campos, clases, huellas, adquisiciones y fechas, pero no un JSON Schema independiente completo. La raíz de confianza es el manifiesto fijado fuera del paquete, no uno recuperado que se autoafirme válido. Las primitivas de transporte, rechazo de symlinks, publicación exclusiva y sincronización son las actuales. La CLI antigua verify se ejecuta además sobre el subconjunto v2; para los 945 objetos y dependencias hay que usar el recolector. Véanse decisiones PV3-D01–06, con objeción, respuesta y coste individual.

Pins SHA256:

- Sobre: `147e90bf15aa6a82e71b304bd6bd8983983007c2b07ed6e306f1ca244f3ae8be`.
- Transporte schema 2: `b4e91adcdd69dbe62f221d97bc8910ad1243719b8bdcb63df095ce5679c8db9e`.
- Manifiesto v2 histórico conservado: `1382c7186c84cdf7c1892b9b16a8ca7e222aeac54380d3ed41952deea47a67db`.

SHA512 y tamaños completos en cierre.json. El v1 histórico `2df6c208…` permanece intacto fuera de T3; no confundir estos manifiestos de preservación con los snapshots de publicación v1/v2 fijados por el encargo.

## Copias, durabilidad y pruebas

Destinos inexistentes comprobados antes de exportar:

- `/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/paquete-v3`
- `/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/restauracion-v3`

Se midieron 392.118.075.392 bytes libres antes de copiar. Cada raíz tiene `STAGING-t3-7f0c6fb6.json`, CAS y dependencias nuevos; manifest.json se publica al final. No se sobrescriben destinos ni objetos. La restauración copia desde paquete-v3 a una raíz nueva. Confirm verifica marcadores exactos contra los externos, todos los objetos/dependencias y sincroniza archivos y directorios. No se prueba corte eléctrico ni escritor hostil.

`copias.json` recalcula **independientemente de fingerprint del producto** SHA256/SHA512/tamaño de los 2.775 archivos de cada copia: **1.211.560.189 bytes por copia** antes del suplemento de entrega. Ambos listados son idénticos. `export-recibo.json`, `verify-recibo.json`, `restore-recibo.json` y `confirm-recibo.json` contienen además los recibos operativos objeto por objeto. La entrega documental y scripts se conservan después en `entrega-t3-7f0c6fb6-final/` dentro de ambas raíces, por el MANIFIESTO de entrega, sin modificar los objetos anteriores.

Cinco adversos propios pasan: ida/vuelta sin hardlinks y destino exclusivo; ausencia; corrupción y recuperación en destino nuevo; fallo fsync después de publicación visible y confirm posterior; marcador sustituido y fuente enlazada. Todos operan en `.cache/preservacion-v3/adverso-*`; se conservan los residuos. Pasan las 19 pruebas existentes de preservación, sin editar sus oracles. Ruff y mypy (`--check-untyped-defs --follow-imports=skip --ignore-missing-imports`) pasan para los scripts propios; no es tipado estricto de todo el parser dinámico. Los logs distinguen pases solapados: no sumar como cobertura independiente. Un primer script exploratorio de cobertura falló al encontrar un registro sin sha256; el cotejo entregado distingue registros documentales completos, sin alterar fuentes.

Pruebas, generación, recorridos masivos, tipos y copias se ejecutaron con flock común y un trabajador. Las lecturas iniciales agrupadas de Markdown no se bloquearon con flock; no se afirma serialización de esas lecturas. Sin Next build, suites legacy completas, servidor ni preview. No hay código TypeScript/Effect nuevo: no se cambian las 16 reglas anti-slop ni la configuración. Nix/uv proporciona el entorno, con UV_PROJECT_ENVIRONMENT absoluto dentro de scratch propio. Comandos en COMANDOS.md y resultados reales en logs.

## Límites y entrega

Integridad comprobada para las copias actuales. Autenticidad histórica no certificada; no se repiten firmas, CSV ni sellos. Interpretación jurídica sin nueva validación. Exactitud fiscal no evaluada: no se modificó ningún cálculo ni oracle. Aceptación ninguna; binding de Madrid pendiente, regla completa false. El inventario de 52.377 ocurrencias y los snapshots indicados por el coordinador no se regeneran ni retaguean.

Crossa conserva v1 histórico comunicado por el coordinador; misma casa y propietario, sin verificación propia en destino ni custodia independiente. Queda desfasada respecto de v2 y v3. No se toca Crossa, v1, v2 ni sus restauraciones. Sin red documental, LFS, gasto, transferencias externas, PR, deploy, limpieza ni operaciones VCS mutantes. Sigue vigente la elección de dejar preparada la transferencia.

MANIFIESTO.json contiene path/SHA256/SHA512/size/baseSha256; altas con baseSha256 null y cero borrados. Se excluye a sí mismo por circularidad. entrega.patch contiene archivos textuales, excluyendo a su vez patch y MANIFIESTO; los binarios están en los CAS y se entregan por hash. `.cache/` no debe integrarse. No hay logs de más de 1 MB. Hace falta revisión independiente nueva del recolector, las exclusiones, el sobre y la restauración antes de considerar aprobable esta ampliación.

La primera copia del suplemento de entrega quedó conservada en `entrega-t3-7f0c6fb6/`. Su informe decía cinco binarios públicos excluidos de X: el manifiesto enumera once (las cinco imágenes conocidas no agotan ese CAS). Se corrigió únicamente ese recuento y se publicó el suplemento final en otra carpeta `entrega-t3-7f0c6fb6-final/`, sin borrar ni sobrescribir la copia anterior. Los manifiestos del paquete, objetos, clasificación y recibos no cambiaron.
