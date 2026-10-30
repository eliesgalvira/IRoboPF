# Paquete local ampliado v3

Corte histórico v3 del 29 de octubre de 2026, base `65cff4fd8eb8c6269c2ce97b88e770aa711bff7f`. Exportación y restauración local: **945 objetos, 1.068.593.978 bytes de objetos por copia**, con verify y confirm correctos. El resultado es candidato y no acredita aceptación fiscal ni custodia externa.

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

SHA512 y tamaños completos en cierre.json. El v1 histórico `2df6c208…` tiene identidad separada; no confundir estos manifiestos de preservación con los snapshots de publicación v1/v2 fijados por el encargo.

## Copias, durabilidad y pruebas

Destinos inexistentes comprobados antes de exportar:

- `/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/paquete-v3`
- `/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/restauracion-v3`

`copias.json` recalcula **independientemente de fingerprint del producto** SHA256/SHA512/tamaño de los 2.775 archivos de cada copia: **1.211.560.189 bytes por copia** antes del suplemento de entrega. Ambos listados son idénticos. `export-recibo.json`, `verify-recibo.json`, `restore-recibo.json` y `confirm-recibo.json` contienen además los recibos operativos objeto por objeto. La entrega documental y scripts se conservan después en `entrega-t3-7f0c6fb6-final/` dentro de ambas raíces, por el MANIFIESTO de entrega, sin modificar los objetos anteriores.

Cinco adversos propios pasan: ida/vuelta sin hardlinks y destino exclusivo; ausencia; corrupción y recuperación en destino nuevo; fallo fsync después de publicación visible y confirm posterior; marcador sustituido y fuente enlazada. Todos operan en `.cache/preservacion-v3/adverso-*`; se conservan los residuos. Pasan las 19 pruebas existentes de preservación, sin editar sus oracles. Ruff y mypy (`--check-untyped-defs --follow-imports=skip --ignore-missing-imports`) pasan para los scripts propios; no es tipado estricto de todo el parser dinámico. Los logs distinguen pases solapados: no sumar como cobertura independiente. El cotejo distingue registros documentales completos de registros sin sha256.

## Límites y entrega

Integridad comprobada para las copias de este corte. Autenticidad histórica no certificada; no se repiten firmas, CSV ni sellos. Interpretación jurídica sin nueva validación. Exactitud fiscal no evaluada: no se modificó ningún cálculo ni oracle. Aceptación ninguna; binding de Madrid pendiente, regla completa false. Los conteos del inventario o de snapshots de publicación son identidades distintas de las de este paquete.

Crossa conserva v1 histórico, misma casa y propietario, sin verificación independiente en destino. Está desfasada respecto de las ampliaciones v3, v4 y v5 del corte R26 y no acredita custodia independiente. Las copias locales de esta edición tampoco prueban preservación externa.
