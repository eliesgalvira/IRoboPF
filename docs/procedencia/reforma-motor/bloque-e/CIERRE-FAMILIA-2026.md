# Familia 2012–2026 y parámetros territoriales 2026

El contrato anual común admite derechos de descendientes y su discapacidad en 255 combinaciones de año y territorio: 2012–2026 y los 17 territorios comunes. Reparte el mínimo entre titulares elegibles, separa mínimos estatales/autonómicos y consume las cuotas fijas publicadas de 2026. La entrada efectiva conserva 2025. [API](../../API-MOTOR.md), [familia](FAMILIA-ANUAL.md) y [B2026](B2026.md).

La revisión independiente conjunta es favorable acotada: 764 discriminantes propios, 594 regresiones y 21 fuentes conservadas. Reextrae 115 filas de 17 escalas oficiales y contrasta las 24 cuotas que difieren de integrar los tipos. No certifica una declaración completa. Se conservan los rechazos de ascendientes, fallecimientos, conjunta, alimentos propios no soportados y hechos incompletos. No se añaden deducciones autonómicas de 2026. [Dictamen y evidencias](revision-familia-2026/INFORME.md).

La integración incorpora además la guardia que rechaza una deducción pendiente activa en el auxiliar, doce rectificaciones documentales valencianas y el [alcance acotado de D](../../D-REDONDEO-PRODUCTO.md). La [revisión de deducciones](../../deducciones-2025/revisiones/producto-20261104/INFORME.txt) es favorable en su alcance, con 333 aserciones propias. Las cuarenta fórmulas valencianas permanecen pendientes de automatización; el punto 4 sigue abierto.

## Validación de integración

Se completan los comandos requeridos del CI local, incluido datos y transporte portable: 1.202 ejecuciones Vitest por bloques (con pruebas compartidas repetidas) y 227 métodos Python. Tipos y lint correctos, con 18 avisos anteriores. Pasan controles de contenido, rastro, CAS local, lotes de deducciones y enlaces. El corpus CAS histórico completo queda expresamente fuera de este CI. El árbol seguido contiene cero rutas `.cache`; las cachés locales ignoradas no forman parte de la publicación.

Las primeras ejecuciones detectaron un test nuevo que usaba una condición booleana no admitida, identidades AST desactualizadas y expectativas de alcance antiguas. Se corrigieron y repitieron los pasos afectados, continuando los restantes sin repetir suites ya correctas. En el test salarial cambian sólo el literal de alcance y la frontera de edad admitida; en inventario cambia la lista de territorios disponibles en 2026. Todos los esperados monetarios Open anteriores permanecen intactos.

Los hashes actuales fijan doce fuentes cambiadas y tres módulos nuevos para ejecutar los contratos técnicos. No trasladan aceptación fiscal de snapshots históricos. Los logs de intentos rojos y verdes, el manifiesto de rutas y el resumen de validación se conservan en la entrega compacta `producto-eb-publicacion-20261104`.

Publicado en `461e16323ca11e428c3e391568755c3e6b2766ab`, rama `procedencia-documental`. `checks` y `corpus` pasan en la [ejecución remota 41902081685](https://github.com/eliesgalvira/IRoboPF/actions/runs/41902081685).
