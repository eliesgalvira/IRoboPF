# Madrid y Murcia: ejercicio 2025

Entrega candidata de las 51 fichas del lote F sobre la base `016ec72d9539ccd887202735960ce306bd2354e5`. Los dictámenes individuales, sus comparaciones y reservas están en [dictamenes.json](dictamenes.json); las adquisiciones citadas, en [fuentes.json](fuentes.json). La revisión independiente sigue pendiente.

Las 51 fichas presentan diferencias documentales antes y después: se corrigen las referencias de página, pero persisten omisiones de requisitos o reglas en las fichas. Esto no significa que las 51 produzcan una cuota errónea. El cálculo se califica como diferencia en dos casos reproducidos y como no verificable en los otros 49: 45 rutas reciben un importe manual; las demás tienen contratos parciales que no liquidan todos los hechos. Los valores, límites, condiciones, renta y reparto se contrastan separadamente en cada registro.

El manual recuperado es la edición de 21/10/2026, con 635 páginas físicas y SHA-256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`. La numeración impresa coincide con la física en el tramo examinado. No se ha identificado el hash de la edición que originó el censo: por ello se conservan sus referencias en `manual.paginasFicha` y se consignan las comprobadas en `manual.paginasComprobadas`. Las fichas regionales pasan a estas últimas. No se altera ningún importe ni evaluador.

Los originales autonómicos y las reformas se conservan fuera del repositorio. Las citas HTML identifican expresamente cuándo proceden del consolidado o de una nota editorial; las citas de publicaciones originales llevan página física y bbox. Los pasajes concordantes de un original no acreditan automáticamente todas las reformas intermedias ni las remisiones estatales. Las reservas individuales mantienen esa limitación: no se declara cerrada la cadena completa por disponer de un consolidado fechado. Se inspeccionó visualmente la tabla de bases conjunta de renovables de Murcia: 50/37,50/25 %, sin derecho desde 95.000 euros.

La corrección murciana de 30/03/2024 y su reproducción íntegra de 06/04/2024 rectifican a 24.380 euros un límite de alquiler anterior. La reforma de 2025 establece el límite actual; no se importa el importe histórico corregido como límite del ejercicio revisado.

Las pruebas financieras conservan dos fallos esperados del agregador compartido, cuya corrección requiere coordinación:

- Madrid, parto múltiple de dos hijos de 2025, un progenitor: esperado 2.886,80; observado 1.443,40. Falta el suplemento del primer ejercicio.
- Murcia, dos descendientes con 5.000 de gasto neto elegible cada uno, un titular: esperado 2.000; observado 1.000. El agregador aplica un único tope.

Los contratos parciales separados modelan estos supuestos, pero no están conectados a la ruta aplicada examinada. No se propone eliminar sus reservas ni convertir sus resultados parciales en sumas fiscales aceptadas.

Validación: la prueba inicial de páginas dio 51 fallos y un pase; tras el cambio pasan las 52 comprobaciones de páginas/cobertura. La suite final tiene 97 pases y dos fallos esperados. Las ejecuciones ordinarias de los dos casos financieros permanecen rojas en el transporte privado. Oxlint y ESLint se ejecutaron sobre los tres archivos TypeScript, conservando la configuración y reglas existentes. El verificador [verificar_citas.py](verificar_citas.py) permite comprobar hashes, tamaños y reextraer todas las citas usando únicamente raíces CAS externas explícitas.

El JSON sigue el contrato candidato, incluidas comparaciones históricas con `momento: "antes"`. El control semántico central admite las publicaciones originales de normas, reformas y correcciones, conservando su clasificación. Un consolidado o manual no sustituye una publicación primaria. Validación estructural y aceptación normativa son comprobaciones distintas.
