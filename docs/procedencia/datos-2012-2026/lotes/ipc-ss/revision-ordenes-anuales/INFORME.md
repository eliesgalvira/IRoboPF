# Revisión independiente SS 2025–2026 — LIGERO1

Dictamen acotado: favorable para integrar la propuesta documental exacta, con una observación defensiva no bloqueante. No se han encontrado importes ni datos públicos incorrectos en los originales y candidatos revisados. Se reproducen 88 celdas, 32 comparaciones numéricas coincidentes y 6 pendientes. Esto no acepta una liquidación fiscal ni acredita una vigencia anual cerrada. Esta es la única revisión independiente realizada aquí para esta entrega; no se reabren revisiones históricas ni se exige una auditoría universal F.

Se leyó AGENTS.md. Trabajo en raíz sólo lectura, sin worktree, subdelegación, instalación, ejecución de TS/Effect, suites pesadas, descargas ni mutaciones de VCS. Las ejecuciones Python y de pruebas se hicieron secuencialmente, un proceso de pruebas y un worker, con `timeout -k 30s 25s`, entorno env-pruebas.sh, Python de la caché indicada y UV_CACHE_DIR=/home/elies/.cache/uv. Todo lo escrito está en esta carpeta externa.

## Identidad y procedencia

Se reconstruyeron en memoria los cuatro archivos nuevos de propuesta.patch, idénticos a sus artefactos y postimágenes del manifiesto. No se aplicó ningún parche. Se comprobó que esas cuatro rutas aún no existen en el checkout y que sus diez dependencias conservan los hashes declarados.

Original PJC/178/2025: SHA256 `918a1c126ddf1427506c151390f2326d7eaeaaeae174b1463ed1e87bf03c11d6`, 577076 bytes; PJC/297/2026: `88fdae5f080f54c1b39d1fd86c27a8f469881068963b763a732ce69361ee10dd`, 572397 bytes. Son los dos objetos exactos recibidos, sin sustituir por consolidaciones. El censo reutilizado es `ipc-censo-reanudado.json`, SHA256 `97b59e897da1a2ffb51ee8b9bc21eda933185b203432a89f1f613572c852d52e`.

Los hashes y tamaños antes/después de las fuentes acotadas están en fuentes-antes.json y fuentes-despues.json; integridad.log registra su comparación. Incluyen ambos originales, censo, artefactos de autores, AGENTS.md, entorno y dependencias concretas, sin recenso. El resultado recalculado coincide íntegramente con resultado-focal.json, incluido censusSha256.

## Contraste independiente de interpretación

No se tomó el sello como prueba semántica. Se extrajo texto directamente de ambos PDF, con palabras flags=0/sort=True; se reprodujeron título, art. 2/3/4/16/17/33 y DF tercera por página y bbox. evidencia-selectores.json conserva esos selectores y literales; seleccion-pdf-2025.txt y seleccion-pdf-2026.txt conservan las páginas pertinentes. El adaptador reprodujo las 88 selecciones físicas completas; los tests propios añaden geometría de fila, columna y cabecera y expectativas numéricas independientes.

- Art. 2/3: máximos mensuales 4909,50 y 5101,20; ×12 da 58914 y 61214,40, coincidentes con las hojas actuales. El factor sólo describe doce mensualidades uniformes. Mínimos 1381,20/1424,40 corresponden a grupos 4–7. Los grupos 1–3 tienen mínimos superiores distintos; 8–11 usan 46,04/47,48 diarios y máximos diarios 163,65/170,04. La continuación de grupos 10–11 en p5 de 2025 está correctamente seleccionada. No se convierten bases diarias por ×12.
- Art. 4: comunes 28,30%, empresa 23,60%, trabajador 4,70%. AT/EP remite a tarifa/actividad y al cargo exclusivo empresarial. No demuestra universalmente el 1,5% del perfil.
- Art. 16: MEI 2025 0,80%=0,67%+0,13%; 2026 0,90%=0,75%+0,15%. Parámetros censados coinciden con las ramas actuales de obtenerTiposMei, incluida la condición >=2026. No se intercambian empresa y trabajador.
- Art. 17: reparto por tramo 2025 empresa 0,77/0,83/0,98%, trabajador 0,15/0,17/0,19%; 2026 empresa 0,96/1,04/1,22%, trabajador 0,19/0,21/0,24%. Coinciden los doce parámetros AST. Se comprobaron ruta año/parte/índice, source.sha256 y los intervalos UTF-16 del literal en el archivo actual. Los límites y céntimos de los tramos constan en los párrafos conservados; el resultado sólo acredita los tipos, sin afirmar aceptación de su álgebra.
- Art. 33: desempleo indefinido 7,05%=5,50%+1,55%; FOGASA 0,20% empresarial; FP 0,70%=0,60%+0,10%. Se conserva el párrafo de contratación y sus excepciones. Los catorce enlaces ordinarios usan hojas con sourceSha256 del módulo actual.
- Títulos y DF tercera: ejercicio correcto, publicación 26-02-2025/31-03-2026, entrada en vigor al día siguiente y efectos desde enero. El campo abierto `through:null` representa los efectos sin inventar su término; no debe leerse como entrada en vigor en enero ni como prueba de ausencia de sustituciones. La proyección condicionada no acredita el año completo. A 04-11-2026 queda futuro 05-11/31-12. IPC 2026 conserva escenario 3%, no observación INE.

Las seis posiciones pendientes son exactamente AT/EP empresa, AT/EP trabajador y FOGASA trabajador por ambos ejercicios. No tienen status match. El cargo empresarial puede fundamentar una futura derivación de cero trabajador, pero el adaptador no la ha aceptado todavía. Tampoco consume las otras 42 bases ni los 14 tipos totales.

## Hallazgo reproducible y corrección mínima

Observación no bloqueante: `orden_anual.py` verifica el hash actual del módulo PROFILE pero no comprueba que `item.source.sha256/file` del AST seleccionado pertenezca a ese módulo. En un censo alternativo en memoria, cambiar sólo source.sha256 del literal 2025 empresa[0] a 64 ceros deja 32 match y publica ese binding contradictorio. Reproducción y salida en defecto-reproducible.json, test_09. El censo exacto recibido sí tiene identidades y literales correctos; no hay importe ni dato público erróneo demostrado en esta entrega. No se usa esta observación como bloqueo fiscal.

revision.patch propone tres líneas para rechazar un source.sha256/file contradictorio antes de emitir el enlace. Es un delta contra orden_anual.py de la propuesta, a aplicar por el padre después de ella; no es un parche contra un archivo ya presente en la raíz. Se ensayó en memoria: rechaza el caso adversario y conserva íntegro el resultado real de los originales y censo exactos. No altera lib ni el registro sellado. No pretende autenticar cualquier censo externo ni sustituir su revisión. Otro adversario, cambiar la base censada a cero conservando el hash del módulo, genera difference; no obtiene aceptación numérica falsa (limite-censo.json).

Las reservas contienen adecuadamente las limitaciones de elegibilidad, mínimos, AT/EP, ceros, anualización, solidaridad, redondeo y modificaciones posteriores. Evitan atribuir aceptación fiscal o vigencia anual completa a estos match. No evitan la contradicción de identidad AST del censo alternativo; para eso se propone el guard concreto. Con los bytes exactos revisados, esa contradicción no existe.

## Pruebas y límites operativos

21/21 tests focales de autores, sin omisiones, en 3,689 s (tests-autores.log). Nueve tests propios cubren parche/manifiesto, PDF/contextos, geometría/unidades, todas las cifras, reproducción íntegra/pendientes, bindings/dimensiones, duplicados/censo obsoleto, diferencia adversaria y defecto AST/corrección. Resultado final y duración en tests-propios.log. La primera ejecución propia falló por una expectativa textual demasiado estricta: `58914` frente a `58914.0`; se corrigió la prueba para comparar Decimal, sin cambiar datos del autor (tests-propios-inicial.log).

Incidencia operativa: una llamada inicial a `ls` enumeró involuntariamente el directorio de objetos y produjo salida truncada. No debía haberse hecho bajo la restricción de no inventarios; no se guardó ni utilizó ese listado y no se repitió. Todas las inspecciones posteriores usaron exclusivamente rutas ya identificadas por el manifiesto. No se ejecutó recenso ni descubrimiento de fuentes por celda. No se borró ningún archivo.

El dictamen se limita a esta propuesta documental y estos originales/censo; no certifica ausencia de reformas posteriores, elegibilidad individual, cuotas ingresables, A histórico ni F. El padre integra únicamente en procedencia-documental según sus instrucciones.
