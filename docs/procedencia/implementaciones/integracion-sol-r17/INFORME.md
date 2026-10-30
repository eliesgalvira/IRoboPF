# Integración candidata Sol R17

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `1ec684b4e4408068282febf1319c12c6ac8a15c1`.

Se integran 670 archivos recibidos: ámbitos jurídicos (585, con manifiesto histórico de 583), preservación v3 (28), TGSS etapas (33) y cierre/cobertura (24). Todos se cotejan contra recepción, su base original `65cff4fd8eb8c6269c2ce97b88e770aa711bff7f` y bytes del checkout actual. Cero conflictos y cero borrados. `base.json.gz` enumera 10.583 entradas comprobadas mediante lstat/readlink; `recepcion-verificada.json` detalla hashes y decisiones por archivo. Los originales de recepción y los checkouts anteriores permanecen intactos.

## Resultado candidato

Se integra exclusivamente el código enumerado por la entrega de ámbitos: modelo y schemas, lector/verificador Python, publicación/verificación/contenido y pruebas. El registro v2 es un contrato de formato: no se modifica `enlaces/revisores.json`, el registro real, decisiones jurídicas, confianza ni atestaciones. Se conserva `BLG > 60000` para Murcia y la falta de respaldo temporal del nominal estatal. La declaración de un contexto no acredita residencia, elegibilidad, hechos externos ni completitud fiscal.

`preparar.py` de esta carpeta genera 264 payloads y 264 ámbitos nuevos contra inventario `21516a24e30d5106d229b1fead87aa0889700df3950fabfe0f4bb69b23631266`, artefacto `5095690502f91a0157ea0323410531f120849cf8e776c3d813fa490fb322df48`. Comprueba identidad exacta de código, ruta de celda y dimensiones antes de comparar valor/unidad. Todos pendientes. Los 264 payloads históricos recibidos con inventario `4f00…` permanecen literales, sin retaguear sus hashes. No se cambia motor fiscal ni oracle; no hay fix numérico que requiera rojo fiscal.

Las matrices TGSS y CC se conservan como candidatas sobre su base explícita. El discriminante XML histórico no impone algoritmo universal de redondeo 2025. Se preserva CC-01: todas las entidades de su corte mantienen derivación pendiente; integrar estas matrices no termina ese requisito. Las dos revisiones de retenciones ya integradas no se duplican ni modifican.

La documentación/scripts de preservación v3 quedan disponibles sin regenerar su manifiesto ni sus paquetes. El patch histórico gigante se conserva en recepción; la copia local `preservacion-v3/entrega.patch.gz` se descomprime a esos mismos bytes. `corte-preservacion.json` documenta el cotejo de los originales familiares posteriores y los cinco TGSS recibidos contra el corte v3. No se afirma que 945 objetos cubran todo el corpus actual.

Las decisiones individuales, objeción experta, respuesta y coste están en `DECISIONES-INTEGRACION.md`. Las referencias originales con hash/tamaño se conservan por archivo en `recepcion-verificada.json` y en los manifiestos recibidos. Las citas legales siguen fijadas por sus decisiones y originales; esta integración técnica no afirma haber releído jurídicamente todos sus pasajes.

## Validación y reproducción

Las validaciones usan Nix/uv y las configuraciones conservadas en comandos/. Oxlint usa `--threads=1`; Vitest/Python usan un trabajador.

Los scripts `comandos/` y logs entregados registran las ejecuciones reales y sus códigos; los intentos fallidos se conservan junto a las repeticiones. El ensayo de aceptación limitada es expresamente sintético en scratch; el coordinador de producción verifica el registro real pendiente. No sumar pruebas solapadas ni iteraciones de mutación como reglas aceptadas.

## Límites

Integridad: hashes y bases cotejados, controles técnicos en logs. Autenticidad: sin nueva validación de confianza histórica PAdES/CSV. Interpretación: candidata; requiere revisión independiente nueva Sol del contrato y payloads exactos. Exactitud: identidad y binding numérico en el alcance ejecutado, sin modificación fiscal ni garantía de hechos externos. Aceptación: cero promociones; aceptación fiscal completa false.

`MANIFIESTO.json` describe todos los cambios contra la base propia con path/sha256/size/baseSha256. Se excluyen únicamente los artefactos de cierre autorreferenciales (manifiesto, su hash y patch), fijados por `ENTREGA.sha256`. Patch textual gzip y binarios por ruta/hash; sin cachés, entornos, CAS pesados ni árboles de ejecución. Integración pendiente de revisión independiente nueva, sin heredar aceptaciones anteriores.

## Resultados finales del alcance

- Inventario reconstruido y sin diferencias: **52.455 ocurrencias**, manifiesto y artefacto conservan los hashes de partida. No se reconstruye para cambiar artificialmente sus identidades.
- Corpus: **25 pruebas**; puente: **24**; preservación existente: **19**; ámbitos Python: **6** sobre históricos y otro pase de **6** sobre los 264 candidatos actuales, con 2.112 mutaciones por pase; puerta Node: **4**. Rechazos de aprobación insuficiente, hechos/contextos excluidos y frontera murciana incluidos. No sumar pases como cobertura fiscal distinta.
- Rastro/cierre/publicación: **28 pruebas** correctas; contenido: **20**. El cierre de grafo exige receta además de original/imagen. El pase inicial sin Python en PATH y el rojo del fixture se conservan; el pase correcto incluye nixpkgs#python3 y el fixture completo.
- Ruff correcto; mypy con cuerpos no anotados comprobados y stubs de jsonschema: **6 fuentes**, sin diagnósticos. No se declara tipado estricto de todo el corpus dinámico. Tipos principal y vendor correctos. ESLint y oxlint correctos; smoke con las mismas 16 reglas a error y dos diagnósticos reales. El cierre de oxlint/smoke fija un trabajador.
- TGSS: 19 discriminantes y seis empates regenerados solo en scratch y cotejados byte a byte mediante cmp con `discriminantes.json`, sin modificar el oracle recibido. Matriz CC: 41 comprobaciones ejecutadas sobre código actual; son comprobaciones de software, no lectura jurídica universal.
- Paquete y restauración v3 verificados de nuevo en lectura: **945 objetos / 1.068.593.978 bytes** en cada copia, con dependencias comprobadas. **21 faltantes concretos** frente al corte: cuatro originales familiares, cinco originales TGSS y doce facsímiles TGSS; **10.666.870 bytes**, de los cuales 8.543.442 son los nueve originales. Rutas, hashes, tamaños y fuentes en `corte-preservacion.json`. Es un cotejo de esos lotes, no un censo definitivo de todos los documentos actuales.
- Coordinador real correcto, inventario reconstruido, siete dependencias documentales y Madrid pending, autenticidad trust-indeterminate y completeRuleAcceptance false. Ensayo separado sintético correcto: coordinador real, 724 objetos, render y recibo ausente rechazado; ninguna atestación sintética sale de scratch.

Se verifican los **28 snapshots registrados**: 26 de base y las dos versiones nuevas. V1 reproducido con identidad exacta `2d9893012478bdc15d36206995ada1196a82fd4a299533a84ef31ca732700f30`. V2 real reproducido en proceso nuevo y comparado con el objeto de la primera ejecución: `2eec75d3c2985a09e283f1c07a02a1a934ea12987ba989e494ad6ee08040f5c1`, **717 objetos**. Recibo real `d70832af3edd2dc8ce964c7be23035bf77dceee0dac961848119df737545f166`. El payload Madrid permanece `5128cec8db668a8716ae4ac60d220b28b053cef17a1d6c3ef3bf08b28337d5b1`: inventario y fuente no cambiaron, no hay motivo para retaguearlo ni se modifica el registro. `publicacion.json`, `entrada-publicacion.json` y `repeticion-v2.json` fijan el resultado.

Los dos intentos de repetir publicación dentro del mismo proceso se interrumpieron personalmente con SIGTERM (143) para liberar memoria retenida; no fueron fallos numéricos ni cortes del producto. La primera publicación ya estaba guardada y se conservó. La repetición aislada termina correctamente, compara su hash con esa primera publicación y actualiza el alias real a v2. Los scripts finales separan históricos, generación y publicación en procesos nuevos; `regenerar.mjs --continuar` reutiliza los recibos de fases ya verificadas. No se elide el coordinador real.

El `test:lint` original no pasa con TMPDIR dentro de `.cache`: su salida no es JSON. Se conserva ese fallo. El smoke propio comprueba la configuración real y conserva exactamente reglas/plugins, retirando exclusiones únicamente en su configuración temporal para incluir el fixture; no se modifica ningún ignore del proyecto. Mypy se repite con `uv run --with mypy --with types-jsonschema`, sin instalar globalmente ni relajar diagnósticos. Los logs entregados permiten distinguir cada incidencia y su repetición.
