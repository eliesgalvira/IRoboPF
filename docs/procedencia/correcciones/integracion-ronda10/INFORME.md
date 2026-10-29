# Integración de la ronda 10

Las ocho entregas se han leído y conservado. Las tres implementaciones se copian por archivo, tamaño y SHA-256 contra c61a306107f280c399eb57e57a7c45452bd68864. En cada checkout hay 5.281 archivos de base y cero ausencias; ningún diff de rama contiene borrados. integracion.json registra 28, 23 y 21 archivos, más sobres. No se usan índices dañados ni commits de hijos.

## Cambios y límites

Conexión anual: API optativa 2025, Madrid, individuo 18–64 sin circunstancias excluidas, solo trabajo homogéneo o EDS admitida sin activos. Cálculo real de rendimiento, bases, cuotas y pagos; rechazos explícitos. El padre expresa `instancia: instancia` para respetar el contrato del extractor de rastro; no altera fórmulas. Se añaden 16 puntos a los 49 existentes. Precisión calculada se conserva antes de presentación; no equivale a una declaración oficial. La revisión independiente de esta conexión sigue pendiente.

Inventario: quince tablas exportadas aportan 228 hojas canónicas sin cambiar cuantías. CAS explícito y schema de decisión distinguen status/decision. Se conserva 'Euros' literalmente. El padre detectó que el nombre 2020_DISTINTAS_DE_2025 se interpretaba como intervalo y lo corrigió después de un rojo. Los intervalos requieren sintaxis explícita; los años comparados no crean vigencia. Las dimensiones siguen siendo candidatos técnicos, no normas aceptadas.

EC-01: el puente rechaza año/territorio fuera de las dimensiones explícitas de la ocurrencia, incluidos vacíos. Esto impide la contradicción reproducida, pero no prueba un claim libre ni continuidad normativa. No se permite ampliar ámbito por coincidencia numérica. El coste es bloquear tablas sin dimensiones suficientes hasta aclararlas.

EC-02/03: grafo exige un ID único por snapshot, incluso con revisiones distintas, y misma receta en cita PDF y facsímil. Rojo y control positivo se conservan. El cierre físico de dependencias y estados al publicar sigue siendo trabajo de integración, no resuelto por un Set de nombres.

Redondeos: DAT_YYYY adopta el orden y tipos binarios de Python/NumPy; el dinero liquidado mantiene su contrato Decimal. No se corrige un céntimo con epsilon. El padre ejecutó los cuerpos Python originales para TODOS los casos del fixture de caracterización en oracle_caracterizacion.py, con NumPy 2.5.4, sin modificar original ni fixture. Las salidas nuevas quedan en caracterizacion-python.json con ambos hashes. El test sigue cotejando cálculo unitario e IPC con el fixture anterior, y coteja el detalle corregido con esa ejecución independiente. El glosario distingue HALF_UP monetario/porcentajes, round NumPy/Python y empate mensual hacia más infinito.

El test de hashes canonical-tabular-hashes.json sigue rojo: esos hashes procedían de las tablas TypeScript, aunque el campo source nombra el Excel. No se regenera desde la implementación para obtener verde. Se encargará contraste completo por streaming del Excel y decisión sobre el contrato. Se reduce la concurrencia interna por defecto de ese test de ocho procesos a uno. COMPARATIVA_INFLACION sigue pendiente de reconciliación independiente.

## Validación y versiones

Diecisiete pruebas del inventario pasan. Veinticuatro del puente y veinticinco del corpus pasan tras la reconstrucción. Ciento una focalizadas de integración/redondeos pasan, lint y tipos principales/vendor correctos en ese pase. Diecinueve de preservación pasan. El paquete v2 completo se confirmó de nuevo con 708 objetos, hashes y fsync; tipos Python correctos. Ver preservacion-v3/INFORME.md.

El pase amplio de 553 pruebas registró 549 correctas y cuatro fallos: hash tabular pendiente, diagnóstico de duplicidad y dos recuentos de rastro antiguos. Los tres últimos se corrigen sin relajar controles: diagnóstico compatible y 65 puntos esperados. regresiones-con-entorno.log conserva la repetición focalizada posterior. Un primer intento sin python3 en el shell Nix falló al preparar la suite de evidencia; no cuenta como prueba de producto y se repite con el entorno correcto. No se ejecutan Next build ni las dos suites legacy pesadas en este pase.

Inventario final: 51.582 ocurrencias = 23.519 sintácticas + 16.336 efectivas + 11.727 seleccionadas; 28.731 unidades pendientes, 351 fichas de deducción, cero aceptación fiscal automática. Manifiesto d7bd61b71d11396636b1a2bd9264bb9b04950b79c06b7841466347291f99ff0e; gzip d6e71d1d5a2eeb8f81f607cc8b61415ee7eb8af180e4dd288aa61cd3a3a07a46.

Snapshot actual 5da224c83aa1f524f4871646791e5fc4f6fbbbe28b940e7b03997d6fe615aab8: 51.651 fichas, 65 puntos, 256 paquetes, 12.171.450 bytes comprimidos y mayor paquete 60.421 bytes; RSS de generación 1.458.941.952 bytes. No es un paquete de despliegue medido aún. Los doce snapshots existentes al primer pase histórico verifican; el actual posterior conserva los mismos paquetes y actualiza la versión de explicación.

Payload Madrid actual 3ad5dacc086a1fed88bdebc39620e360599be34bb64e37e6c94b68decacae544. Original, cita y cifra se conservan. El coordinador reconstruyó las fuentes actuales y verificó siete archivos documentales; revisión del binding pendiente, autenticidad trust-indeterminate, aceptación completa false. El payload intermedio 26894a86… correspondió a una generación abortada por shorthand de instancia: no tuvo snapshot publicado ni atestación. Se conserva como borrador histórico en el log; no se presenta como paquete restaurable.

## Próxima fase

Integrar evidencia y estados con rutas reales y búsqueda compacta; refinar unidades/contexto y nuevas identidades canónicas de los lotes; contrarrevisar implementación anual, técnica y redondeos; recuperar originales AEAT 2012–2016. No cerrar jurídicamente lo que las revisiones mantienen abierto. La copia Crossa v1 sigue distinta del paquete preparado v2, con los mismos originales; no hay LFS ni gasto, PR, main, deploy o limpieza final.

Repetición final: 20 pruebas de rastro/evidencia y 17 de contenido correctas, lint global y tipos principal/vendor correctos. Ruff del padre correcto. Los tres fallos técnicos del pase amplio quedan reproducidos como corregidos; el hash tabular antiguo sigue pendiente, sin desactivar su prueba ni cambiar su fixture. Diff final del bloque: cero borrados.
