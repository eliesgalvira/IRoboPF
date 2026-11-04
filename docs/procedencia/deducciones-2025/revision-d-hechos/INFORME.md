# Revisión independiente monetaria y de datos públicos — lote D por hechos

Dictamen: dos errores monetarios bloqueantes en Extremadura; 31 oráculos conformes y dos rojos, ejecutados contra el candidato intacto. No aceptación fiscal global ni cierre de 63 códigos. Revisión de las doce reglas parciales, sin conectar API, cuota o anual.

## R1 — Partos múltiples: prorrateo individual aplicado a conjunta

En `extremadura-hechos-2025.ts:190` se calcula `proporcion` y en la línea 196 se aplica sin distinguir modalidad. Contraejemplo: progenitores a/b conviven con gemelos h1/h2; a presenta conjunta con h1/h2; b no integra esa declaración. Bases de la conjunta: 24.000 + 0. Evento 1/1/2025, titulares a/b. La deducción de la conjunta es 600 euros, pues el reparto se prevé para tributación individual. El candidato devuelve 300. La convivencia y las titularidades se suponen satisfechas para aislar la cuantía; el parcial puede seguir pendiente de acreditación externa.

Fuente congelada: `extremadura_partos_multiples-L1/L2` (art. 3) y `-M21`, PDF SHA-256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`. Reextracción real de M21 conforme. Consulta oficial ligera corrobora el mismo criterio: [AEAT, partos múltiples](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-extremadura/partos-multiples.html).

## R2 — Material escolar: mismo prorrateo ajeno a conjunta

En `extremadura-hechos-2025.ts:227` se aplica `proporcion` a titulares del mínimo sin rama de modalidad. Contraejemplo: descendiente h, de 10 años, primaria y convivencia con a/b; a presenta conjunta con h, b fuera de ella; ambos tienen mínimo. Bases 10.000 + 0, régimen ordinario. Cuantía: 15 euros; observado: 7,5 euros. La edad de 10 años es un hecho externo supuesto para aislar el reparto; este contrato no la solicita y no se certifica aquí su acreditación.

Fuente congelada: `extremadura_material_escolar-L1/L2/L3` (art. 10) y `-M8`, mismo PDF. Reextracción real de M8 conforme. Consulta oficial ligera: [AEAT, material escolar](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-extremadura/compra-material-escolar.html).

Corrección necesaria: resolver modalidad y convivencia dentro de estas dos ramas. No cambiar globalmente `proporcion`: CLM, adopción CyL, cuotas CyL y ELA conservan sus propias reglas de reparto. Si faltan hechos para resolver una conjunta, rechazar explícitamente ese supuesto en lugar de devolver la mitad como cuantía parcial. Esta entrega no reescribe producto ni tests del autor.

## Controles monetarios conformes

33 pruebas nuevas con expectativas literales tomadas de fuentes; no replican la fórmula del candidato como oráculo. Incluyen las doce funciones. CLM: grado 65, renta con signo sin restar mínimo, edad estrictamente mayor de 75, 30 días efectivos/Sescam, prevalencia de discapacidad, cuatro nacidos en un evento, fechas y divisor de tres titulares externos. CyL: 65 frente a 64 años, residencia, límite tras mínimo, inscripción y ayudas, adopción internacional sustitutiva de general, excepciones de renta de arts. 3/4, siete descendientes e incremento único de discapacidad. Cuotas: 5.000 compartidos generan 300 por contribuyente; 3.000 compartidos generan 225; conjunta mantiene máximo 300. Estos casos discriminan el error de aplicar máximo personal antes de repartir.

Extremadura: renta personal de trabajo en conjunta, elección de viudedad por persona, fronteras ordinarias, modalidades de partos/escolar y ELA. ELA propio más familiar de otro causante es compatible según M11: 3.000 en el caso preparado es correcto. No imponer un techo global de 2.000 a ambos conceptos; no se reabre la reserva de varios causantes para un mismo familiar, que el candidato rechaza. Propio íntegro y reparto familiar separado conformes. No se encontraron otros errores monetarios concretos dentro de las ramas implementadas. Las guardas de duplicados del candidato se leyeron; esta suite no sustituye los 41 tests del autor ni vuelve a certificarlos.

## Matriz, fuentes y alcance

Comprobadas las 63 identidades de código en revisión, expediente y overlay, las doce exportaciones del candidato y la igualdad exacta por código entre `reservasNormativas` y `reservasActuales`. Balance preservado: 12 parciales y 51 sin evaluador; sin conexión anual. R1/R2 contradicen el reparto individual que ya declara la propia matriz para esos códigos. No error público nuevo en importes o límites de las demás filas revisadas.

Se reutilizan revisiones y correcciones auditadas. CLM: concurrencia solo 12/12 ter; 25 municipios donde corresponde; XPath/XML son localizadores. CyL: se conservan sus tres reservas específicas sin exportarlas. Extremadura: vivienda de enero a 21 de marzo de 2022 permanece reservada, sin reapertura favorable. El cierre 63 y el reconocimiento de derechos externos siguen pendientes.

Se congelan 556 citas de los doce expedientes y metadatos de fuentes, sin transportar cuerpos CAS. Se reextraen del PDF original ocho pasajes focales, con SHA-256/SHA-512/bytes verificados: reparto de R1/R2, base y máximo de cuotas, compatibilidad y reparto ELA. Esto no equivale a repetir la auditoría jurídica completa. Los oráculos completos están en `validacion/casos-oraculo.json` y su implementación portable en `tests/producto-lote-d-revision-monetaria.test.ts`.

## Ejecución y entrega

PESADO1 autorizado por el padre: Vitest 4.1.5, un worker, **31 conformes / 2 rojos de cuantía**, conservados en `validacion/vitest-candidato-rojo.log`. Tipos estrictos con opciones de raíz, Oxlint (16 reglas, un hilo) y ESLint del test independiente conformes. ESLint emite avisos de entorno React/pages de la entrega parcial, sin avisos de archivo. Todos los comandos de prueba/script con `timeout -k 30s`; una suite pesada a la vez. No inventario ni CI global. PESADO1 liberado, sin procesos de prueba pendientes.

Los intentos de reextracción sin entorno Nix adecuado fallaron por intérprete genérico y `libstdc++`; se preservan sus logs. La ejecución final usó Python 3.13 Nix, uv con caché `/home/elies/.cache/uv`, PyMuPDF 2.0 y la biblioteca GCC de Nix. Su log acredita las ocho reextracciones. Ningún fallo de entorno se presenta como error monetario.

Solo altas nuevas de prueba/documentación en parche portable, manifiesto con SHA pre/post y evidencia privada. `validacion/` contiene los controles ligados a rutas privadas y no debe integrarse como verificador público. Raíz y candidato en solo lectura; sin worktrees, VCS mutante, commits, push, PR, despliegue ni cuerpos CAS. No dependencias ni cachés en entrega.

Restante concreto: corregir R1/R2 por el autor/padre, repetir los dos rojos y la suite focal contra el candidato corregido; después integrar en el alcance autorizado. La revisión no cambia el contrato anual ni certifica derechos externos.
