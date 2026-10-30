# Publicación y recuperación de preservación

PREV2-01 y PREV2-02 se corrigen después de conservar los rojos independientes y los propios en esta carpeta. Diecinueve pruebas mantenidas pasan. Las zonas horarias exigen horas 00–23 y minutos 00–59 antes de parsear; +00:99 y −01:60 ya no se normalizan silenciosamente. +05:45 es un control válido.

Antes de crear el enlace final, un fallo no publica un marcador nuevo. Después del enlace, un fallo de limpieza o sincronización produce PublicationDurabilityUnknown: los bytes pueden estar visibles y su persistencia no está confirmada. Se conserva el marcador. Objeción experta: quitarlo tras fallar fsync tampoco demostraría un rollback durable. Coste: el operador debe tratar un tercer estado, además de éxito y fallo anterior a publicación.

Para recuperar un paquete visible se añade la operación local `confirm`. Exige igualdad byte a byte con un manifiesto fijado fuera del paquete, valida el esquema, comprueba SHA-256/SHA-512/tamaño de todos los objetos y vuelve a sincronizar archivos, marcador, CAS, raíz y padre. Solo entonces devuelve fsync-confirmed. Un manifiesto distinto, objeto corrupto o error de IO siguen siendo fallos. Esto presupone un filesystem que respeta fsync y un operador cooperativo; no prueba un corte eléctrico, autenticidad histórica ni resistencia a un propietario hostil.

Ejemplo sobre un destino conservado, después de diagnosticar el almacenamiento:

```
bash tools/procedencia/run.sh tools/procedencia/preservacion.py confirm --manifest docs/procedencia/preservacion/manifest-v2.json --root .cache/orquestador-preservacion/paquete-v2
```

No se regenera el manifiesto v2 ni se modifica un original. El paquete v1 copiado a host-b sigue siendo histórico, con manifest SHA-256 348d098877e75d9f3a902a695e140833ae3525a11525e01f568508e48030860d. La preparación v2 usa a8e227366b8dca08437bdf562c45b55d5c38a7ef761de960969909a8213d473a. Ambos contienen los mismos 708 objetos, 974.801.535 bytes; sus metadatos difieren. host-b es otra máquina del mismo dueño y casa, no custodia independiente ni remoto acreditado. La comprobación comunicada allí no ejecutó verify ni SHA-512. La verificación de integración conserva y coteja SHA-256/SHA-512/tamaños de v1 fuera del worktree, en .cache/procedencia/preservados/manifest-2df6c208.

Ruff correcto. La revisión de estos cambios sigue pendiente. No hay LFS, transferencia externa, gasto ni aceptación fiscal nueva.
