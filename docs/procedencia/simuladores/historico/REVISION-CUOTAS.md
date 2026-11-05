# Primera revisión independiente de cuotas históricas

Dictamen: favorable dentro del alcance declarado. No he encontrado un defecto reproducible que cambie un importe válido o publique un dato incorrecto y que bloquee este candidato. No se ha integrado ni publicado. PESADO1 liberado al cierre de esta entrega.

Revisado el candidato congelado `producto-c-historico-rebase-integracion-20261105`, parche SHA256 `ceb62e4dd634797101afcd93ff63d41667ce642941f5db61584088eedcc42a90`, base declarada `b9122c2bf61310922e856117ed4490136a628d03`. Raíz y candidato sólo leídos; sin worktree, VCS mutante, subdelegación, instalación, inventario, CI global ni acceso de navegador. No se han copiado originales ni cuerpos CAS. Las dependencias y cachés permanecen fuera de esta entrega.

## Integridad y continuidad

255 comprobaciones pasan, repetidas al cierre. Los cinco hashes post, dos hashes pre, tamaño y hash del parche, recibos del manifiesto y reservas de raíz coinciden. Reconstrucción independiente en memoria de cada hunk contra sus preimágenes: resultado byte a byte igual a las cinco postimágenes. Las dos preimágenes productivas son idénticas a raíz. Se comprueban las dos reservas no publicadas de raíz sin considerarlas integración.

Se verifican SHA y tamaños de los 28 originales SES/PDF/resumen/bootstrap, los siete recibos de captura, URL/versión visible, matriz y hechos de entrada: ejercicio, edad, territorio, bruto, cotización y retención. Cada esperado y reservado mantiene el valor SES de su recibo original. Las 83 casillas comparables siguen presentes; los 14 mapeos reservados y la ausencia adicional de 0533 en 2024 siguen reservados. No se ha rellenado ningún hueco. Esta verificación de integridad no constituye una nueva auditoría del parser PDF ni certificación jurídica del mapeo.

## Causa y aislamiento del cambio

En el piloto de 2018, base 11414.25: gravamen estatal exacto 1084.35375 y autonómico exacto 1027.2825. Con mínimos 527.25 y 499.50 y retención 100, restar con precisión completa produce 984.88625, presentado como 984.89. Cuantizar primero los gravámenes produce 1084.35 y 1027.28 y resultado 984.88, igual al original. Este orden explica la discrepancia observada sin modificar artículo 20.

La política nueva sólo se selecciona en la conexión de empleo histórico Madrid 2018–2024 sin derechos familiares. La guarda interna comprueba ejercicio, territorio, edad 18–64, ausencia de fallecimiento/discapacidad/derechos, cotización efectiva, trabajo positivo, otras rentas cero, ahorro cero y ausencia de deducciones/servicios DA61. La guarda común rechaza modalidad y listas familiares. El contrato de entrada explícita restringe adicionalmente los perfiles históricos: no habilita pensión, actividad, familia u otras rentas. En la API canónica permanece `decimal-hasta-salida` y cotización estimada; siete pares pre/post dan exactamente los mismos importes.

La composición reutiliza el helper existente para cuatro gravámenes y conserva las restas y límites de cuota posteriores. El artículo 20 y la base no pasan por la política histórica: adversa con bruto 15876.01 da reducción 1461.7425 y base 11414.2675. DA61 permanece cero, sin cuantización salarial de 2025. Decimal80 conserva una base con muchas cifras al calcular la cuota sin cuantizar. No hay cambios en fuentes productivas de A40/B37/C2025. Sus regresiones focales pasan. Los textos de rastro describen gravámenes cuantizados y DA61 histórica no aplicable, sin atribuir compatibilidad salarial de 2025.

## Pruebas y reproducción

- Candidato: 342 tests en 14 archivos, todos verdes, un worker. Incluye 34 tests nuevos del candidato y 29 adversas propias. Lista exacta en `config.mjs`; resultados en `post.log`.
- Preimagen: seis tests monetarios rojos / 42 diferencias, más siete rojos de rastro; el test monetario de 2024 pasa. Salida 1 esperada. `pre.json`, `pre-resumen.json` y `loaded-pre.json` conservan resultados y fuentes efectivas.
- Adversas propias: oráculo entero independiente en nueve bases hasta la frontera del primer tramo de 2018, mínimos y redondeo antes de restar; edad 18/64; fracciones subcéntimo; siete ejercicios por ambas exportaciones explícitas, repetición, entrada inmutable y retenciones consumidas una vez; rechazo de ocho variantes de edad/perfil/territorio/familia/ejercicio; artículo 20 con fracción; API canónica con pagos efectivos sobre sus cálculos estimados. No son snapshots de salida del código nuevo.
- Comparación canónica pre/post de siete ejercicios idéntica: `canonica-igualdad.json` y sus dos tablas. Se retiró del test final únicamente la escritura de estos recibos para cumplir los diagnósticos Effect; permanecen las aserciones aritméticas.
- Tipos estrictos y diagnósticos Effect: cero para candidato y pruebas propias. Variante portable comprobada por separado. Los arneses sólo redirigen lecturas de fuente y salidas de recibos; no escriben en candidato ni raíz.
- Antislop: código candidato y adversas pasan; canario rechazado por `no-unknown-parameters`. ESLint focal candidato pasa. `controles.json` contiene comandos y salidas.

`COMANDOS.sh` reproduce los comandos principales con límites de tiempo y el Node Nix existente. Cada suite/script se ejecutó bajo `timeout -k 30s`; secuencialmente, con maxWorkers=1. Las herramientas ausentes del PATH se localizaron instaladas; se consultaron `effect-solutions list`, `show testing basics` y el código local de Effect antes de escribir pruebas.

Se conservaron incidencias propias del arnés: resolver inicialmente un directorio como módulo, consultar un campo no retornado por composición, un diccionario de prueba rechazado por antislop y la escritura de recibos rechazada por diagnósticos Effect. Corregidas sólo en archivos externos; no fueron defectos del candidato ni alteraron esperados monetarios.

## Entrega y límites

`revision.patch` añade sólo `tests/revision-historico-cuotas.test.ts`, con imports relativos, sobre el candidato ya aplicado. No altera producción ni expectativas oficiales. `portables/` contiene esa postimagen; `adversas.test.ts` es la variante externa ejecutada en esta revisión, con las mismas aserciones e imports absolutos. Para la revisión sin integrar se usa `config.mjs`: carga post o pre según REVIEW_MODE y no reescribe tests existentes. `MANIFIESTO.json` registra hashes, pre/post y dependencias de reproducción.

La campaña ampliada no se comparó. Una captura por ejercicio no demuestra cobertura de todo el dominio, todas las escalas ni desempate HALF_UP universal. El oráculo entero comprueba el comportamiento aritmético de la política, no acredita ese redondeo fiscal fuera de las observaciones conservadas. No se certifican derechos familiares, deducciones, otros territorios, edades fuera de alcance, pensión, actividad, ni aceptación fiscal automática. No se ejecutó CI global ni inventario, conforme al turno asignado. No se ha revisado toda la normativa A ni verificado remotamente la base pública: se verificaron las preimágenes congeladas contra raíz y la reconstrucción del candidato.
