# Contratos de ámbito y publicación R19: revisión independiente

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

**Dictamen: bloquear nuevas promociones a `accepted-limited` hasta contrastar y corregir CP19-02/03.** El recorrido actual pendiente de Madrid funciona; no he demostrado una aceptación real indebida ni pérdida de sus objetos. Los tres hallazgos nuevos son candidatos para contraste del padre. Se conservan sus reproducciones rojas, sin fixes de producto ni cambios en registros, atestaciones o informes ajenos.

Base examinada: `7668bdad60a79a8b3ad8e1e1b911f3d6c223692a`, comparada con `82045effc7c34a93682e265d3f4dff796f314a60`. Se contrastaron integración R19, recibos terminados y revisiones previas de ámbito, evidencia y publicación.

El cotejo inicial recorre físicamente 24.605 entradas entre ambas revisiones mediante lstat/readlink, bytes y hashes frente a blobs Git: cero ausencias y cero divergencias del HEAD. Las modificaciones frente a la base antigua se distinguen de ausencias. `control-arbol.json.gz` conserva cada ruta, modo, enlace, tamaño y hashes. El cierre vuelve a comprobar las entradas del HEAD; véase `cierre.json`. No hay Jujutsu inicializado en este checkout; no se inicializó ni se realizó operación VCS mutante.

## Alcance técnico separado

`diff-tecnico.patch.gz` conserva el diff de lib/schemas/scripts/tests/tools. Son 17 rutas: modelo y alias derivado rastro-generado.json, cuatro schemas, cinco scripts, cinco fuentes de pruebas y enlaces.py. El alias no es una fuente fiscal nueva. `diff-rutas.txt` enumera por separado las incorporaciones documentales, editoriales y de retenciones, sin adjudicarles revisión jurídica. No se modificó motor, inventario, generadores, registros reales, ESTADO ni DECISIONES.

Los recibos se examinaron como evidencia de recepción, no de aceptación. `recibos-comprobados.json` conserva las rutas entregadas y distingue sus hashes de los actuales: un archivo técnico integrado puede diferir de una entrega histórica legítimamente; no se reemplaza por ella. No se atribuyen al revisor las pruebas históricas del autor.

## Hallazgos nuevos

### CP19-01 — Node admite un informe compuesto solo por espacios (P3)

En `scripts/procedencia/ambito-publicado.mjs`, la comprobación del informe utiliza únicamente `leer(...).length === 0`; Python exige `report_raw.strip()`. Un informe de tres espacios, con referencia y aprobación sintéticas exactas, devuelve un ámbito aceptado en Node. La prueba exige rechazo y queda roja con `Missing expected exception`.

Reproducción: primer test de `adversos-node.test.mjs`, log definitivo `adversos-node-r19.log`. Parte de un payload R19 completo, ámbito y decisiones reales leídos sin modificarlos; las referencias remapeadas y las aprobaciones existen exclusivamente en memoria sintética. Se recalculan los hashes de informe, atestación, registro y aprobación del fixture. No se afirma un ataque que pueda sustituir el registro de confianza real sin permiso.

Decisión: exigir concordancia de las dos puertas sobre informe no vacío de contenido. Objeción del mejor experto: el coordinador real ya rechaza este caso y una aprobación exacta de un informe vacío es un error editorial previo. Respuesta: limita el impacto; no demuestra bypass del publicador real, pero la comprobación histórica prometida por Node no reproduce el contrato que afirma comprobar. Coste: corrección pequeña y regresión independiente, sin migrar aprobaciones.

### CP19-02 — La decisión contradictoria pasa la puerta Node (P2 de validación)

Node busca `id` inequívoco y `status === accepted`, pero no aplica la exclusión mutua `status`/`decision` del schema `legal-decision-scope`. Al añadir `decision: rejected` a la decisión elegida, conservando `status: accepted` y recalculando coherentemente la cadena sintética, devuelve aceptación. Python `select_decision` rechaza expresamente ese mismo conflicto. Es una divergencia concreta, no solo ausencia abstracta de validación JSON Schema.

Reproducción: segundo test de `adversos-node.test.mjs`; `adversos-node-r19.log` conserva el rojo. `evidencia-final.log` contrasta el rechazo Python. El fixture definitivo utiliza el candidato `ambito-r19-ESTV2-2012-ordinaria-3-cuota.json` y su decisión real; comprueba primero el positivo Node antes de mutarlo. El primer pase `adversos-node.log` usó el fixture mínimo del autor; sus resultados no sustituyen el pase definitivo R19.

Decisión: bloquear promoción hasta que Node rechace el contrato ambiguo y mantenga paridad con la puerta Python. Objeción experta: para construir el ejemplo se vuelve a aprobar sintéticamente el payload modificado; el registro editorial podría simplemente no aprobarlo. Respuesta: es cierto, no demuestra falsificación de la raíz de confianza ni generación mediante el coordinador. Demuestra que la segunda puerta acepta una representación jurídicamente contradictoria que la primera considera inválida. La comprobación de publicación/historia debe rechazarla incluso cuando las referencias y permisos editoriales sean exactos. Coste: compartir o contrastar validaciones y repetir los adversos; ninguna aceptación real se registra aquí.

### CP19-03 — El recibo puede declarar otro software sin invalidar el snapshot (P2 de coherencia)

`contenido-verificar.mjs` comprueba la presencia de los hashes del recibo en el cierre, pero no enlaza las rutas de software de `recibo.entrada.dependencias` con las fuentes que definen `snapshot.versiones.explicacion`. En una copia CAS propia se sustituye únicamente la referencia de `tools/procedencia/enlaces.py` dentro del recibo por el hash ya conservado de package.json. Se conserva la versión de explicación, el inventario, payload, estados, grafo, documentos y aprobaciones reales intactos. Se hashea el recibo nuevo y se añaden sus bytes/tamaño al cierre; `verificarContenido` devuelve éxito. La prueba que exige rechazo queda roja.

Reproducción independiente: `rojo-software.mjs` y `rojo-software.log` (código 1 por `Missing expected exception`). Fuente original `e0c1f038eb01d2029a49ce39242158530db307306d45acd5bcf3bd702e4c5b81`; declarada en el recibo alterado `4d3b1589ffcc560b202e31559d504b66ed8451621205dba9ead2863482c9086a`. Recibo original `473ddb8d15323182bbe990e856e70ea742f687cdf9aa8834dcbe82183753ee8b`; alterado `a3372ada41c9015145a235ee00b203e258beeef51ffdcdeb81e38646d52ec400`. Explicación conservada `a72ea94662ef9e239ed306e4ba5b693c163376de5588a1836a0187fba2c22b5e`.

Decisión: bloquear nuevas promociones hasta fijar esa relación de fuentes del recibo. Objeción experta: los snapshots son objetos por hash y el atacante no puede alterar el objeto original conservando su hash. Respuesta: correcto; se seleccionaría otro snapshot. Igual que EC-04, el defecto está en validar semánticamente una nueva publicación contradictoria, no en romper SHA256 ni falsificar una firma. No he demostrado que el publicador real genere ese recibo: la preparación actual sí fija fuentes y las relee. Coste: contraste histórico de la fuente exacta y su versión, preservando lectura de snapshots anteriores mediante un contrato explícito, sin fingir que pasaron una ejecución nueva.

## Decisiones sobre afirmaciones y objeciones descartadas

**CT-01 — Aprobación editorial exacta, sin herencia.** Python exige payload v2 y registro de revisores v2; la aprobación fija payload y referencia exacta de atestación. Los tests rechazan autor igual a revisor, inventario ajeno, informe alterado, aprobación distinta y delegaciones duplicadas/ambiguas. El test histórico de v1 ahora exige rechazo de promoción; la lectura histórica sigue funcionando. No aparece `trusted=true` como sustituto. Objeción: puede reemplazarse toda la raíz editorial por otra coherente. Respuesta: no es una firma digital; ese límite de confianza está declarado y no se presenta como vulnerabilidad criptográfica nueva. Coste: mantener revisión y permisos de la raíz separados de integridad técnica. Aprobable en ese alcance, con CP19-01/02 pendientes de paridad Node.

**CT-02 — Ámbito nominal, no liquidación.** Se cotejan los 264 ámbitos actuales y se repiten las seis pruebas Python contra R19, con las ampliaciones/mutaciones del autor sin alterar expectativas. Año, territorio, unidad, columna, condiciones, componente, Madrid 2022 y Murcia estricta se rechazan cuando contradicen el contrato. El nominal estatal no habilita selección temporal. `evaluate_scope` valida contextos declarados pero no lo invoca `verify_evidence`; las fechas/residencia/elegibilidad no se han ejecutado por publicar una celda. Objeción: llamarlo ámbito ejecutable podría insinuar condiciones ya satisfechas. Respuesta: se acepta únicamente el contrato técnico de celda; el evaluador devuelve aplicabilidad no establecida y la publicación conserva interpretación candidata y regla completa falsa. Coste: no autorizar usos como selector fiscal ni aprobación jurídica de las 264 condiciones sin sus revisiones específicas.

**CT-03 — EC-02, cierre físico y recetas.** Verifiqué un par histórico v1/v2 y el par actual, no los 30 previos. Se rechaza el paquete manipulado de cada uno; el caso actual conserva 186 dependencias de entrada por hash. Se rechaza receta divergente de Facsimile respecto de Citation aunque se recalculen revisiones y aristas. El coordinador reextrae el PDF y reproduce el PNG real. Objeción: un Set de nombres no prueba preservación. Respuesta: el ensayo completo relee bytes y tamaños; no se confunde con `verificarGrafo` aislado. Coste: IO y CAS local, con CP19-03 todavía abierto para coherencia del software del recibo. No se acredita custodia remota ni durabilidad frente a corte eléctrico.

**CT-04 — EC-04 y consumidor real.** Importé los dos GET reales sin servidor/build. Ficha de Madrid: 200, 4.501 bytes, estados pending/trust-indeterminate/false y enlaces documentales. Objetos: 200, PDF 213.826 bytes y PNG 12.673 bytes con hashes exactos; auxiliar privado y ficha desconocida: 404. Objeto prometido corrupto en scratch: 503. Omisión, duplicado y cruce de sujeto de evidencias se rechazan. Objeción: probar el helper no demuestra una ruta existente. Respuesta: los positivos usan los módulos GET exactos; solo el negativo de blob corrupto usa el helper con CAS scratch para no alterar el original. Coste: no se afirma aquí compatibilidad de bundler, paquete de hosting ni despliegue; están fuera del encargo.

**CT-05 — Cambio persistente tardío.** `tardio.mjs` copia únicamente las dependencias a scratch y envuelve allí run.sh. Ejecuta Python real y, después de que termine, añade un espacio a la cita. Node detecta `Documento cambió durante la verificación`; no llega a generar/publicar aceptación. Objeción: un mock de resultado no probaría el coordinador. Respuesta: no se sustituye ni resultado ni verificador; el wrapper solo introduce el cambio tardío en una copia propia después de su ejecución. Coste: un recorrido adicional y scratch conservado; no se promete protección frente a ABA/escritor hostil.

## Evidencia real y límites

`fuentes.json` conserva SHA256/SHA512/tamaño por ruta literal de los 11 objetos del mapa R19 y del original PDF y PNG de Madrid, además de manifiesto, cita, receta y dependencias documentales. No se sustituyeron versiones ni se adivinaron URLs. CAS del padre y paquetes preservados solo se leyeron; no se limpiaron ni alteraron.

Inspección visual personal del PNG: última fila `53.407,20 / 7.395,81 / en adelante / 21,00 %`. Página física 4 del PDF, bbox `[162.8,690.8,441,746.8]`, coordenadas nativas de la cita. SHA256 original `8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660`; PNG `95c51f213a841bdc1658a260620f891f77c22311d12aa7b9d2e06c5289ba1868`. El manifiesto conserva URL y límites históricos de autenticidad. No emito dictamen nuevo de firma, vigencia general ni cuota completa.

Inventario reconstruido contra código actual; pines `30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7` y `59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7`. Las 52.461 ocurrencias y 65 sitios no son reglas fiscales aceptadas. Madrid conserva payload `e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258`, pendiente; los 264 candidatos R19 continúan pendientes y fuera del registro real. Ninguna atestación anterior migra.

Crossa es una copia v1 histórica desfasada del mismo dueño y domicilio; no se comprobó custodia independiente ni remota. Esta revisión no examina jurídicamente las 264 celdas.

## Validación y entrega

`COMANDOS.md` contiene recetas exactas; `codigos*.log` fija los códigos por fase. Pasan cuatro tests Node del autor, 24 del puente, seis de ámbitos históricos, seis contra R19, 20 de contenido y 28 focalizados. Son pases solapados, no se suman como cobertura fiscal. Coordinador, recorridos independientes, mutación tardía y cotejo de fuentes pasan. Los tres adversos nuevos quedan rojos deliberadamente.

Tipos principal/vendor y oxlint global/entrega pasan. ESLint propio pasa. Ruff detectó E402 en el import del script propio; se sustituyó por importlib, sin silenciar reglas. Mypy usa `--check-untyped-defs --follow-imports=silent`, no tipado estricto de todas las dependencias. Se conservan intentos fallidos de humo anti-slop y sus diagnósticos; no se cuentan como pases. La configuración mantiene las 16 reglas a error. Los logs finales concretan la repetición tras ajustar el runner del humo y la calidad del script propio.

Entrega exclusivamente en esta carpeta, scratch en `.cache/contratos-publicacion-r19-sol` y scratch de las pruebas seleccionadas dentro de este checkout. `entrega.patch.gz` es el transporte textual; `binarios.json` identifica los comprimidos por SHA256/tamaño. `manifiesto.json` fija ruta literal/SHA256/size/baseSha256 y no se incluye a sí mismo. No se entregan entornos ni copias de aplicación bajo docs. Los originales, fuentes técnicas y registros del HEAD permanecen intactos al cierre.

Cierre de calidad: `ruff-final`, `evidencia-final` y `mypy-final` terminan con 0. El humo definitivo `humo.mjs` pasa (código 0) con las 16 reglas a error y los dos rechazos efectivos; solo vacía los ignorePatterns del fixture aislado. Su propia comprobación ESLint/oxlint pasa. Los intentos previos omitían el archivo por configuración de ignore; stdin no era una opción admitida por esta versión. Se conservan todos esos logs, sin anunciar un pase del comando original fallido ni relajar la configuración real.

El último contraste propio de los 264 candidatos utiliza los elementos efectivos del artefacto reconstruido, no los valores autodeclarados del ámbito como expected. Coteja ID, archivo/hash/símbolo/ruta exacta, unidad, años y territorios contra ese inventario; pasa junto con Ruff y mypy (`codigos-identidades.log`). Los transportes comprimidos se incluyen también en `binarios/<SHA256>`, enlazados desde `binarios.json`.
