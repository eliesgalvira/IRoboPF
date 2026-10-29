# Integración R19: contratos documentales, revisión histórica y contenido candidato

Se reciben dos entregas Sol High: la integración técnica contra `1ec684b4` y la revisión 2015–2016 contra la misma base. `recepcion.json` comprueba sus 1.296 y 194 archivos, hashes, bases y presencia de las 10.583 entradas originales en cada checkout. Ninguna entrega borra archivos. Son candidatas; su recepción no promueve interpretación, bindings ni aceptación fiscal.

## Resolución de la integración

Los únicos conflictos frente al padre son `snapshots.json` y `rastro-generado.json`. Se conservan todos los snapshots mediante unión del registro; no se sustituye el alias del padre por el del checkout antiguo. Después se regenera el contenido y el rastro desde el código actual. `integracion.json` fija los hashes de los tres archivos fiscales/de pruebas familiares preservados sin cambios. No se revierte la exclusión MDV2-P01.

Se incorporan el modelo de ámbito ejecutable, schemas, comprobaciones Python/Node, publicación y cierre documental, con las pruebas candidatas. Un contexto declarado no acredita residencia o elegibilidad; la aprobación editorial exacta y su revisión siguen siendo requisitos diferentes. Ningún registro real de revisores, atestación ni decisión jurídica se modifica. Los ensayos de aceptación limitada del autor son sintéticos y no autorizan promociones reales.

Objeción experta: un manifiesto válido de una base antigua puede sobrescribir cambios posteriores o asignarles una identidad falsa. Respuesta: solo se copian bytes cuando coinciden con la base o la entrega, y los dos conflictos se resuelven expresamente; los artefactos derivados se reconstruyen. Coste: conservar otra versión y revisar los nuevos payloads exactos, aunque sus números no cambien.

`preparar.py` deriva 264 candidatos nuevos en esta carpeta, contra inventario `30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7` y artefacto `59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7`. Mantiene la comprobación de archivo/hash/símbolo/ruta/dimensiones/valor/unidad. Se actualizan únicamente el destino, identidad de autor, IDs y hashes esperados; el preparador original R17 y sus candidatos permanecen literales. Ninguno se registra ni se atesta. El nominal estatal sigue sin probar selección temporal y Murcia conserva la desigualdad estricta.

## Retenciones 2015–2016

La revisión recibida declara lectura personal de las 140 páginas de los tres algoritmos, 60 dictámenes y 43 ramas; conserva 207 aserciones correctas y tres rojos de literalidad documental. El padre comprueba su integridad, no se atribuye esa lectura personal ni convierte los resultados en validación del servicio AEAT. Los hallazgos nuevos sobre bucles, edades y redacción temporal requieren contrarrevisión independiente antes de aceptarse. No se habilita ningún ejercicio ni se corrige código fiscal por extrapolación.

La rama territorial/editorial de julio y la concurrencia de dos minoraciones de 600 mantienen bloqueos identificados. Que una rama esté bloqueada no invalida por asociación las otras; tampoco autoriza anunciar una versión completa. Los dictámenes y sus fuentes permanecen íntegros en `revisiones/retenciones-2015-2016-sol/`.

## Preservación y cortes

`cas-retenciones.json` fija 11 objetos entregados en `fuentes/`, 20.925.153 bytes, con SHA-256/SHA-512/tamaño. Se copian a `.cache/procedencia/recepcion-r19/retenciones/sha256`, fuera de T3, y se conservan también en su ruta local original. No se presume que los once sean nuevos respecto de todos los paquetes anteriores. Se excluyen del seguimiento ordinario los blobs de ese directorio; manifiestos, adquisiciones, citas y facsímiles siguen versionados. El manifiesto recibido conserva sus rutas originales y puede verificarse localmente; en otro checkout se debe resolver el CAS explícito o reconstruir desde las adquisiciones, sin fingir que los bytes viajan en Git.

Objeción experta: subir referencias sin conservar sus bytes hace irrecuperable una evidencia histórica. Respuesta: copia local verificada fuera de T3 y mapa de resolución; no eliminación ni limpieza. Coste: la copia remota de código no basta para restaurar esos originales y la ampliación del paquete local sigue pendiente. Se respeta la decisión de no LFS, gasto o transferencia externa.

V3 sigue inmutable: 945 objetos en el corte de su autor. La integración Sol verificó paquete y restauración, y enumeró 21 objetos posteriores del lote familiar/TGSS. Ese cotejo no incluye automáticamente las incorporaciones posteriores de estas revisiones. No se suman los recuentos como cobertura global. Crossa conserva v1 histórico desfasado, misma casa y propietario; no es custodia independiente.

## Validación

Los comandos se ejecutan bajo el lock pesado común y Nix/uv; originales y paquetes preservados se leen, no se reemplazan. Vitest, Node y Python usan un trabajador; el cierre de oxlint repite explícitamente con `--threads=1`. Los logs registran verificación de inventario, preparación de candidatos, históricos, publicación, tipos, lint, anti-slop y regresiones. No se ejecuta Next build ni se cambia el diseño.

Resultado integrado: 85 pruebas de regresión (incluidas 57 familiares), 20 de contenido, 24 del puente, seis de ámbitos históricos y seis del lote R19, y cuatro de la puerta Node. Los pases de ámbitos no equivalen a reglas fiscales diferentes; recorren 264 candidatos y mutaciones. El lote R19 se ensaya con copia scratch del test que cambia solo la raíz y la carpeta de candidatos; el test histórico no se reescribe. Tipos principal/vendor, ESLint, oxlint, 16 reglas anti-slop, Ruff y mypy de tres fuentes pasan. Los procesos de validación terminan con código 0; `verificacion-cierre.json` fija los hashes de sus logs.

Se verifican 30 snapshots anteriores y se conservan 32 tras generar V1 `f74f859aa5ec40532299678b9c067f2537f0e62a6a39a523711d79161a742cbb` y V2 `e6eaeed1b3058155774984016651712a54213b0d4702dc59113e7ba9e99aaa9d`. La publicación real conserva 717 objetos y binding Madrid pendiente; no cambia su payload `e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258`, porque el inventario fiscal no cambia en esta integración. Sí cambia el recibo de software/publicación. Las atestaciones previas no se trasladan.

Durante este bloque llegó la revisión independiente de alimentos: 41 archivos cotejados, base `1196269d` y 11.181 entradas presentes. Confirma el límite temporal en sus 61 casos propios y 70 existentes; MDV2-P01 sigue abierto jurídicamente. Se aclara expresamente el token `a0c449575`: era la preposición pegada a `0c449575e3fcd7cfda6208042aebab7023f69d00`, que es la comparación correcta y la efectivamente revisada. No se atribuye revisión a un commit distinto. Recibo en `recepcion-alimentos.json`; informe ajeno intacto.

Se requieren revisiones nuevas del contrato técnico, de los 264 payloads exactos y del paquete v3, además de contrastar los nuevos hallazgos de retenciones. Toda nueva delegación usa explícitamente gpt-6.1-sol high con prioridad. Sin promoción fiscal, PR, despliegue, transferencia ni limpieza final.

## Recepción de la autoría editorial

Se incorporan íntegros los dos lotes Sol de ronda 18 como datos candidatos, sin conectarlos aún al publicador. El padre vuelve a cotejar los 11.181 blobs de la base de cada checkout, incluidos los enlaces; ninguna diferencia ni borrado. Se verifican y copian 117 archivos del lote de escalas/mínimos y 45 de rentas/retenciones/cotizaciones, incluidos manifiestos y transportes, 18.588.719 bytes en total. Los recibos por archivo están en `recepcion-editoriales.json`.

La comprobación integrada de schemas, identidades sujeto/revisión y hashes de código confirma 28 + 37 sitios distintos, sin solapamientos ni pérdidas respecto de los 65 puntos actuales. Se conservan cuatro conceptos, las 264 celdas y las 195 hojas técnicas del segundo lote con sus estados candidatos. El contenido sigue fijado a su base y snapshot históricos; no se reescribe su identidad para simular una aprobación del snapshot actual. `editoriales-comprobacion.json` distingue esta comprobación estructural de la revisión semántica pendiente.

El verificador del segundo autor exige su HEAD original: se conserva literalmente y no se anuncia un pase de ese programa en el padre. Sus pruebas declaradas corresponden al checkout original. Los revisores nuevos deberán comprobar la semántica, las cadenas primarias y la compatibilidad real antes de adaptar estas superposiciones al modelo publicado.

Objeción experta: el recuento de fichas puede ocultar plantillas genéricas o dependencias jurídicas no resueltas. Respuesta: conservar los denominadores por sitio, hoja y celda separados, revisar afirmaciones y ejemplos individualmente, y no usar estos números como cierre de las 52.461 ocurrencias. Coste: dos contrarrevisiones y posterior adaptación; las páginas actuales no adquieren automáticamente esta autoría.
