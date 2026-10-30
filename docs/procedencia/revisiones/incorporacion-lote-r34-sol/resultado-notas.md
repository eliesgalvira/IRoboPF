# Límites de medida e instrumentación

La restauración histórica pasó, pero no se midieron su tiempo/RSS por proceso. El recorrido nuevo sí mide ambos desde imports. historia.json mide su verificación/restauración propia y excluye espera de bloqueo. No se usa el tiempo del comando encolado como tiempo de CPU.

La API se ensaya en .cache/incorporacion-lote-r32/revision-r34 y las pruebas originales integradas usan además .cache/incorporacion-lote-r32/tests. Esas rutas no son registros activos. Los originales necesarios están en CAS ordinario del árbol de ensayo, con ambos hashes y referencias de origen en originales.json; no se duplican en la entrega Git.

Los fallos históricos por HEAD se leen de la recepción original y no se vuelven a ejecutar contra una copia manipulada del producto: la revisión compara el diff concreto y prueba el preparador integrado en el descendiente real y con fuentes/preestado alterados.
