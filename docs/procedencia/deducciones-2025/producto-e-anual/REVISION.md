# Dictamen independiente de conexión anual E38

Favorable dentro del alcance individual ordinario 2025 representado. Sin hallazgos bloqueantes que cambien importes o publiquen datos incorrectos. No se modifica ni integra el candidato. Los once productores ausentes permanecen rechazados; no son once deducciones calculadas a cero. La acreditación externa y el CI global quedan fuera de esta revisión.

Candidato: producto-deducciones-e-anual-rebase-20261105, entrega.patch SHA256 8055b600bcd714cd2be99df832dc9c27b9ba9aeae93dd429d97f99caf1842897. Base productiva: f848de69227445de23681a787659e7053d39251ea361c3db828906e56ae8ca99. La recepción usa lib/, tests/ y preimagenes/; no tiene carpetas literales post/pre. Se comprobó el contenido productivo, sin exigir igualdad del commit durante la publicación autorizada del padre.

## Hallazgos y límites

No hay repro de error monetario del candidato. Tampoco se entrega corrección productiva. El parche añade únicamente las adversas independientes para que el padre pueda incorporarlas selectivamente.

Se mantienen los límites concretos descritos en ramas.json y MATRIZ-38.json: seis ramas de vivienda riojana sin comparación patrimonial/reserva de bases; cuatro ayudas gallegas sin imputación identificada/tipos medios; libros gallegos sin renta de 2024 por miembro. Las once fueron ejercitadas en ambas API, con rechazo y código identificable. Modalidades adicionales de valoración de mecenazgo y arrastres históricos sin productor siguen cerradas, según los guards conservados.

Observación de cobertura, sin bloqueo: no se construyó un nuevo expediente anual positivo independiente para cada una de las 27 ramas. Se comprobó su dispatcher, la continuidad SHA de todos los evaluadores/oráculos corregidos y las regresiones E38; las adversas propias se concentraron en las fronteras de integración. No se reauditaron las 38 fórmulas ni se abrió un contraste jurídico adicional.

## Evidencia

- 43 adversas propias: ambas API; EUR/céntimos y fracción de céntimo; cuota cero, negativa, no finita y a ambos lados del límite; inyección profunda; edad/fecha; once productores ausentes; frontera de 80 cifras; denominadores inválidos y 1/3 céntimo; ámbito de declarante; coexistencia E/E38, pagos repetidos y ejercicios ajenos.
- 529 verdes de regresión del candidato, incluidos 28 de conexión anual y 213 E38; dos TODO B previos. Los reruns son recibos de los mismos casos, no sumandos nuevos. Total único revisado: 572 verdes y dos TODO.
- Tipos strict TypeScript 5.9.3 y EffectLS 0.85.1 del candidato; antislop 16 reglas sobre 13 archivos con un hilo; ESLint sobre esos archivos. Sin diagnósticos del candidato.
- Reconstrucción exacta en memoria de los 19 archivos del parche completo y los seis deltas centrales; siete preimágenes productivas coincidentes. Las 74 rutas productivas de la base siguen coincidiendo al cierre. Continuidad SHA de 19 piezas E, incluidos los tres archivos de pruebas corregidos.

El esquema público cierra propiedades excesivas antes del cálculo. El canal interno valida fracciones, ámbito y signos; no se expone en la solicitud. Los productores de ambas API transportan bases imponibles con signo antes del límite de liquidables. La composición conserva el mínimo real y cuota previa del motor. La conversión a céntimos racionales se invierte una sola vez en el dispatcher; el libro único consume cuota después de calcular generaciones, y los saldos usan índices públicos tras prioridades B.

No se alteraron las suspensiones 2025, atribución económica de pagos, ocupación del alquiler, restricciones históricas ni E01/E02/E03. Las regresiones reproducen expresamente M1 suspendido, pagos de terceros, intervalo de alquiler, familia y censo, incompatibilidades y saldos nuevos. Preparación B, políticas C2025 y ramas A permanecen preservadas en el delta revisado.

## Rojos conservados

vitest-01: fallo de parseo del arnés privado (llave faltante), con las 529 regresiones verdes. vitest-adversas-02: resolución de un import de arnés. vitest-adversas-03: fixtures de vehículo inconsistentes con el precio y expectativa errónea del revisor de 5% en vez del 15% del oráculo existente. Se conserva la entrada exacta en adversas-rojo-03.ts. Ninguno exige cambiar fórmulas o expectativas productivas.

Los rojos de tipos privados conservan fallos de resolución, condiciones booleanas, entradas deliberadamente fuera del dominio tipado y unión de los resultados heterogéneos de ambas API. Se arregla el arnés mediante resolución hacia dependencias existentes y proyección común del resultado, sin casts ni relajación de strict. Véanse los logs y fuentes rojo-tipos.

Todas las ejecuciones de scripts y pruebas tuvieron timeout -k 30s. Suites y herramientas pesadas secuenciales, maxWorkers=1, PESADO2. Sin instalaciones, VCS mutante, worktree, subdelegación, inventario ni CI global; raíz y recepción sin escrituras propias. No se copiaron repositorios, dependencias ni cuerpos CAS. PESADO2 queda liberado al finalizar y no quedan procesos propios pendientes.

Cierre verificable: vitest-cierre.json devuelve success=true con 572 verdes y dos TODO; tipos-adversas-final.log confirma cero diagnósticos también para el arnés propio. Los recibos rojos previos permanecen en la entrega. El parche portable sólo añade tests/e38-revision-anual-independiente.test.ts; presupone la integración del candidato revisado y reutiliza sus fixtures corregidas.
