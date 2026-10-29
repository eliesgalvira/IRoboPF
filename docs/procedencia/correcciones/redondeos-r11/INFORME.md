# Integración de redondeos y correcciones públicas

## Excel y redondeo

Se conservan los 37 archivos de la revisión independiente redondeos-legacy-v1, comprobados por tamaño y SHA-256 contra su manifiesto. La revisión extrae directamente el XML del Excel original por streaming. Las quince hojas DAT coinciden: 1.500.015 filas y 32.700.327 celdas. Sus controles no convierten las fórmulas legacy en reglas fiscales aceptadas.

RLV1-01: el test de hashes usa ahora hashes-excel-independientes.json, extraído del libro, y conserva separado el fixture anterior generado por TypeScript. El fixture antiguo permanece intacto. El contrato canónico normaliza números a dos decimales: no acredita precisión adicional de factores de IPC.

RLV1-03: el helper convertía un BigInt a Number antes de dividir, con pérdida de precisión en 56294995342131.5 a tres decimales. Ahora convierte la magnitud decimal completa mediante notación exponencial. La prueba roja anterior al cambio está en revisiones/redondeos-legacy-v1/rojo-fuera-rango.log. Se añaden regresiones para ambos signos. El pase propio inicialmente llamado rojo.log se ejecutó después del cambio por esperar el lock: se renombra regresion-posterior.log y no se presenta como rojo previo.

Pasan 18 pruebas focalizadas. La repetición completa de hashes después del cambio coincide en las quince DAT y las dos hojas de control; sigue fallando exclusivamente COMPARATIVA_INFLACION. RLV1-02 conserva 69 diferencias de un céntimo, pendientes de la implementación aislada de inflación y su revisión nueva. No se elimina ni tolera ese fallo. Los logs distinguen estos resultados.

## Entrega de X

Integrados 59 archivos y el manifiesto de correcciones-x-2051956145145712916 por hashes, contra b6339967dec543d78cd69f7f56a04870c3ac9b07. Los 6.006 archivos de base siguen presentes; cero borrados. integracion-x.json registra el cotejo. El padre inspeccionó las cinco imágenes del corrector y comprobó que los JSON entregados no contienen claves de perfil o cabeceras sensibles. Las capturas son afirmaciones y material público, no evidencia oficial.

Diez afirmaciones candidatas: CX-02 corresponde a un reparto histórico de solidaridad ya corregido y aceptado con alcance limitado en otra revisión; las nueve restantes conservan dependencias concretas de hechos y fuentes. Las dos regresiones añadidas no se presentan como fixes nuevos. Se requiere revisión independiente nueva de las transcripciones, cobertura de búsqueda, hipótesis y decisiones; las clasificaciones del autor no se aceptan por integración.

## Copias de ejecución y comprobaciones

Los revisores mantienen copias temporales dentro de sus carpetas para ejecutar código histórico. Se excluyen únicamente esos subdirectorios de ejecución (scratch, tmp, validacion, checkout-validacion, lint-input y mypy-cache) del seguimiento nuevo y de las comprobaciones del producto. Sus archivos permanecen en disco. Los manifiestos seleccionan la entrega real. No se borra ni modifica trabajo de un revisor.

Oxlint carga una sola configuración explícita del proyecto mediante --disable-nested-config: descubrir configuraciones copiadas registraba dos veces el mismo plugin. Las 16 reglas siguen a error, verificadas por test:lint. Las pruebas y scripts propios entregados fuera de las copias siguen bajo lint. El primer pase documenta ese fallo de infraestructura; el segundo encontró imports incompletos de lint-input. El pase final, con las exclusiones precisas, pasa lint, typecheck principal/vendor, test:lint y diez pruebas de dinero/solidaridad. Los recuentos seleccionados se solapan.

La corrección del helper cambia el inventario técnico, no la aceptación fiscal. Se reconstruyen inventario, payload de Madrid sin migrar atestación y contenido, preservando las versiones anteriores. El alcance de Crossa sigue siendo la copia local histórica v1; no se transfiere v2, no se usa LFS y no hay gasto. Sin PR, despliegue ni limpieza final.

Reconstrucción terminada: 51.580 ocurrencias (23.517 sintácticas, 16.336 efectivas y 11.727 seleccionadas), 51.649 fichas con cuatro conceptos y 65 puntos de rastro. Manifiesto a2082ee158129eae92653c7b5c63b5735d7286a7714dbbfb08645bbff203de95; snapshot 59befd07bfa3e6ad6beee032e3ecb921b652b45ca1c4c6205f2802378cc76545. Los catorce snapshots conservados verifican y pasan las 17 pruebas de contenido. El coordinador reconstruye el inventario actual y verifica las siete dependencias documentales de Madrid; payload dd8da7112c158e3b25188a54e40acc4030c53b1f85d63659cf9eb0aa1509e634, revisión del binding pendiente y aceptación completa false.
