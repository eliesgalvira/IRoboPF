# Conexión anual, inventario y redondeos

## Cambios y límites

Conexión anual: API optativa 2025, Madrid, individuo 18–64 sin circunstancias excluidas, solo trabajo homogéneo o EDS admitida sin activos. Cálculo real de rendimiento, bases, cuotas y pagos; rechazos explícitos. La integración expresa `instancia: instancia` para respetar el contrato del extractor de rastro; no altera fórmulas. Se añaden 16 puntos a los 49 existentes. Precisión calculada se conserva antes de presentación; no equivale a una declaración oficial. Este informe de implementación no acredita por sí solo la revisión independiente de la conexión.

Inventario: quince tablas exportadas aportan 228 hojas canónicas sin cambiar cuantías. CAS explícito y schema de decisión distinguen status/decision. Se conserva 'Euros' literalmente. El contraste de integración detectó que el nombre 2020_DISTINTAS_DE_2025 se interpretaba como intervalo y lo corrigió después de un rojo. Los intervalos requieren sintaxis explícita; los años comparados no crean vigencia. Las dimensiones siguen siendo candidatos técnicos, no normas aceptadas.

EC-01: el puente rechaza año/territorio fuera de las dimensiones explícitas de la ocurrencia, incluidos vacíos. Esto impide la contradicción reproducida, pero no prueba un claim libre ni continuidad normativa. No se permite ampliar ámbito por coincidencia numérica. El coste es bloquear tablas sin dimensiones suficientes hasta aclararlas.

EC-02/03: grafo exige un ID único por snapshot, incluso con revisiones distintas, y misma receta en cita PDF y facsímil. Rojo y control positivo se conservan. El cierre físico de dependencias y estados al publicar sigue siendo trabajo de integración, no resuelto por un Set de nombres.

Redondeos: DAT_YYYY adopta el orden y tipos binarios de Python/NumPy; el dinero liquidado mantiene su contrato Decimal. No se corrige un céntimo con epsilon. La validación de integración ejecutó los cuerpos Python originales para TODOS los casos del fixture de caracterización en oracle_caracterizacion.py, con NumPy 2.5.4, sin modificar original ni fixture. Las salidas nuevas quedan en caracterizacion-python.json con ambos hashes. El test sigue cotejando cálculo unitario e IPC con el fixture anterior, y coteja el detalle corregido con esa ejecución independiente. El glosario distingue HALF_UP monetario/porcentajes, round NumPy/Python y empate mensual hacia más infinito.

El test de hashes canonical-tabular-hashes.json sigue rojo: esos hashes procedían de las tablas TypeScript, aunque el campo source nombra el Excel. No se regenera desde la implementación para obtener verde. Se encargará contraste completo por streaming del Excel y decisión sobre el contrato. Se reduce la concurrencia interna por defecto de ese test de ocho procesos a uno. COMPARATIVA_INFLACION sigue pendiente de reconciliación independiente.

## Validación y versiones

Diecisiete pruebas del inventario pasan. Veinticuatro del puente y veinticinco del corpus pasan tras la reconstrucción. Ciento una focalizadas de integración/redondeos pasan, lint y tipos principales/vendor correctos en ese pase. Diecinueve de preservación pasan. El paquete v2 completo se confirmó de nuevo con 708 objetos, hashes y fsync; tipos Python correctos. Ver preservacion-v3/INFORME.md.

El pase amplio de 553 pruebas registró 549 correctas y cuatro fallos: hash tabular pendiente, diagnóstico de duplicidad y dos recuentos de rastro antiguos. Los tres últimos se corrigen sin relajar controles: diagnóstico compatible y 65 puntos esperados. regresiones-con-entorno.log conserva la repetición focalizada posterior. Un primer intento sin python3 en el shell Nix falló al preparar la suite de evidencia; no cuenta como prueba de producto y se repite con el entorno correcto. No se ejecutan Next build ni las dos suites legacy pesadas en este pase.

La regeneración añade las fichas y puntos de rastro descritos, con aceptación fiscal completa falsa.

Las métricas de paquetes y fichas corresponden al snapshot generado; no acreditan que un paquete de producción aislado contenga todas sus dependencias.

Payload Madrid actual 3ad5dacc086a1fed88bdebc39620e360599be34bb64e37e6c94b68decacae544. Original, cita y cifra se conservan. El coordinador reconstruyó las fuentes actuales y verificó siete archivos documentales; revisión del binding pendiente, autenticidad trust-indeterminate, aceptación completa false. El payload intermedio 26894a86… correspondió a una generación abortada por shorthand de instancia: no tuvo snapshot publicado ni atestación. Se conserva como borrador histórico en el log; no se presenta como paquete restaurable.

Repetición final: 20 pruebas de rastro/evidencia y 17 de contenido correctas, lint global y tipos principal/vendor correctos. Ruff de integración correcto. Los tres fallos técnicos del pase amplio quedan reproducidos como corregidos; el hash tabular antiguo sigue pendiente, sin desactivar su prueba ni cambiar su fixture. Diff final del bloque: cero borrados.
