# Clasificación contextual del censo, R30

El padre reproduce V5R28-CL01 y corrige el clasificador actual. Una huella de selección no se convierte en original por compartir una fila con su URL. El corte v5 r2, su manifiesto, censo y software conservado permanecen intactos. Este cambio no regenera ni recertifica aquel paquete.

La prueba nueva conserva diez casos con expectativas independientes: selección/documento en la misma fila, selección sin URL, normalización del nombre del campo, texto extraído, software, campo desconocido, adquisición ordinaria y archivada, fixture y recorte. Antes del cambio fallan siete de diez. Después pasan diez. Los hashes tipados de selección, texto y software prevalecen sobre la URL; la inferencia de original desde URL se restringe a campos documentales o al hash genérico de adquisición. `original-oficial` sigue siendo una clasificación contextual candidata, nunca autenticación jurídica.

Se mantiene el caso real del revisor en `editorial/flujo-rentas-r21-sol/entradas-editoriales.json`, puntero `/citations/0/selectionSha256`. No se reescribe su rojo ni el informe histórico. La nueva prueba usa además datos sintéticos para separar causas, sin convertirlos en fuentes.

Decisión: versionar la política de clasificación para una colección futura. Objeción experta: corregir la función podría aparentar que el censo congelado ya fue reclasificado. Respuesta: no se toca el paquete y se conserva su implementación histórica por hash; la corrección y su prueba tienen rutas y revisión nuevas. Coste: mantener ambas versiones y someter cualquier próximo corte a su propio contraste. El recolector no adquiere determinismo ni exhaustividad por este arreglo.

La revisión recibida acredita una restauración nueva y recuperaciones concretas del corte R26. Sus 31 controles propios incluyen dos rojos de privacidad conocidos: localizador dentro de prosa y `FILE://` en mayúsculas. Exceden la política mecánica declarada y no demuestran un secreto real; quedan pendientes, con `privacyCertification=false`. No se autoriza distribuir el paquete ni se afirma anonimización universal.

`antes.log` y `despues.log` conservan las dos ejecuciones de la prueba nueva. El primer intento de las 28 regresiones falló en 24 preparaciones porque faltaba el directorio scratch del padre; los cuatro controles del censo pasaron. Se conserva `regresiones.log`. Creado el directorio propio, `regresiones-repeticion.log` registra las 28 correctas. Ese fallo de entorno no cuenta como rojo del producto. Los controles de estilo y tipos se guardan por separado.

No hay transferencia, gasto, LFS ni modificación de originales. V5 r2 conserva el pin `2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88`; Crossa continúa en v1 desfasado, copia local fuera de Victus del mismo dueño y casa. El arreglo necesita revisión independiente nueva; el encargo global sigue abierto.
