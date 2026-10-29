# Publicación y recuperación de preservación

PREV2-01 y PREV2-02 se corrigen después de conservar los rojos independientes y los propios en esta carpeta. Diecinueve pruebas mantenidas pasan. Las zonas horarias exigen horas 00–23 y minutos 00–59 antes de parsear; +00:99 y −01:60 ya no se normalizan silenciosamente. +05:45 es un control válido.

Antes de crear el enlace final, un fallo no publica un marcador nuevo. Después del enlace, un fallo de limpieza o sincronización produce PublicationDurabilityUnknown: los bytes pueden estar visibles y su persistencia no está confirmada. Se conserva el marcador. Objeción experta: quitarlo tras fallar fsync tampoco demostraría un rollback durable. Coste: el operador debe tratar un tercer estado, además de éxito y fallo anterior a publicación.

Para recuperar un paquete visible se añade la operación local `confirm`. Exige igualdad byte a byte con un manifiesto fijado fuera del paquete, valida el esquema, comprueba SHA-256/SHA-512/tamaño de todos los objetos y vuelve a sincronizar archivos, marcador, CAS, raíz y padre. Solo entonces devuelve fsync-confirmed. Un manifiesto distinto, objeto corrupto o error de IO siguen siendo fallos. Esto presupone un filesystem que respeta fsync y un operador cooperativo; no prueba un corte eléctrico, autenticidad histórica ni resistencia a un propietario hostil.

Ejemplo sobre un destino conservado, después de diagnosticar el almacenamiento:

```
bash tools/procedencia/run.sh tools/procedencia/preservacion.py confirm --manifest docs/procedencia/preservacion/manifest-v2.json --root .cache/orquestador-preservacion/paquete-v2
```

No se regenera el manifiesto v2 ni se modifica un original. El paquete v1 copiado a Crossa sigue siendo histórico, con manifest SHA-256 2df6c208eed389614e678c9009ccf463b00f3bfed9cf098876ce7d9329f593fb. La preparación v2 usa 1382c7186c84cdf7c1892b9b16a8ca7e222aeac54380d3ed41952deea47a67db. Ambos contienen los mismos 708 objetos, 974.801.535 bytes; sus metadatos difieren. Crossa es otra máquina del mismo dueño y casa, no custodia independiente ni remoto acreditado. La comprobación comunicada allí no ejecutó verify ni SHA-512. El padre conserva y verifica SHA-256/SHA-512/tamaños de v1 fuera del worktree, en .cache/procedencia/preservados/manifest-2df6c208.

Ruff correcto. La revisión de estos cambios sigue pendiente. No hay LFS, transferencia externa, gasto ni aceptación fiscal nueva.
