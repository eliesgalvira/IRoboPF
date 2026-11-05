# Primera revisión monetaria independiente F auxiliares exactos

Dictamen: BLOQUEADO por filiación Madrid (F-REV-01). No publicar el candidato congelado. Revisión acotada a las conexiones Madrid nacimiento/adopción 2025 y Murcia guardería y al núcleo racional compartido; no certificación fiscal global. Sin modificaciones productivas ni VCS mutante. No subdelegación.

Candidato: /home/elies/Backups/IRoboPF/producto-f-auxiliares-rebase-20261105. MANIFIESTO.json SHA256 0cd513dd10a5e19aa6113a9a4c08a386054ce3e1d019e72a8654adb563dbb5ad; entrega.patch SHA256 abdfcf5e435355b06153e2704d021d14100ae704173d5c08a1b60a9e47b3833b. Se leyeron ambos INFORME, siete archivos, pre/post, ORACULOS y matriz-delta. Los 97 archivos de recepción y 521 rutas de AGREGADO-ACTUAL siguen con sus hashes; PRESERVACION.json. Raíz publicada de referencia 47dec72e5d3be146d0994c5aee88e2f2188a6e73.

## F-REV-01 — bloqueante, dinero y admisión

En files/lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/auxiliares-anual.ts:30–33 se equipara todo titular conviviente del grafo de mínimos a progenitor. En :65–69 se acepta consanguinidad sin comprobar grado 1 y se divide por todos esos convivientes. La condición jurídica es padre del nacido/adoptado, no cualquier ascendiente titular potencial del mínimo. El nombre del censo auxiliar no prueba filiación frente a un grafo anual que dice grado 2.

Reproducciones por ambas API completas, sin llamar sólo al auxiliar:

- Un único titular conviviente, consanguinidad grado 2, nieto nacido 01/02/2025, unidad declarada como [abuelo, nieto], sin rentas del menor: se publica racional 7217/10 EUR (721,70) pese a que el contribuyente es abuelo. El censo debe rechazarse, sin deducción positiva.
- Padre grado 1 y abuelo grado 2 convivientes: el censo auxiliar los llama progenitores y se publica 7217/20 EUR (360,85). Debe rechazarse la contradicción; si un futuro productor reconstruye un censo válido de padres, al único padre le corresponderían 721,70, nunca la mitad por un abuelo.

Los cuatro tests BLOQUEANTE en tests/review.test.ts permanecen rojos, no fails ni skip. Todos atraviesan los productores anuales de mínimos y cuota, por lo que no dependen de fabricar una magnitud interna imposible. La validación de mínimos permite consanguinidad de grado 2; no es prueba de filiación de primer grado.

Corrección requerida al autor: conciliar grado y clase de vínculo de todos los sujetos incluidos como progenitores, incluido el propio; reservar perfiles sin productor suficiente. Revisar también la composición no conyugal: exige hijos del contribuyente, no todos los descendientes del grafo. Conservar ambas variantes adversas y no ampliar tutelas, acogimientos ni otros parentescos para art4. No se aporta parche productivo en esta revisión.

Fundamento: original BOCM Ley13/2023 (SHA eed67aed41bac78c1917c79723ec05049d23db4b432ba949c7f9671677972bdc), página física4, artículo único.6, art4.3; confirma la exigencia de padres convivientes y reparto sólo entre ambos progenitores. Manual AEAT2025 SHA765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c, páginas404–405. No se toma un Markdown ni un resumen del autor como evidencia normativa.

## Contraste legal y límites

FUENTES-LEGALES.json fija originales CAS, URLs, hashes y localizadores. Se verificaron los bytes y se extrajeron páginas de los PDF primarios con pdftotext, conservando las extracciones; el CAS es la evidencia y la extracción es sólo una ayuda de lectura.

Madrid: original Ley13/2023, art4 página4 y art18 página11, más consolidado BOE DL1/2010 corte30/12/2024 anclas a4/a18. Base de 721,70 por hijo; incremento de otros721,70 por hijo múltiple en primer periodo; reparto entre padres convivientes en individual. Eventos2025, constitución adoptiva y cronología comprobados. Umbral propio30930 y familiar61860, incluyendo ahorro. En el perfil no conyugal con hijos menores sin rentas y sin declaración, la base de los hijos es cero y el umbral propio hace inalcanzable el familiar: no hay aquí prueba positiva independiente en torno a61860 sin salir del perfil. No se autoriza sustituir bases conyugales, hijos con rentas ni historia2023/24 por datos de cliente. El defecto F-REV-01 rompe precisamente la acreditación de hijos/progenitores de ese perfil.

Murcia: original reforma Ley14/2018 CAS f69cbdaaf787f315bb48e468e393eea24294b1ae5ba0368beb9293b2a9acf7af, página47, nueva redacción art1.Tres; consolidado BOE-A-2011-10542 corte24/07/2025 SHA ff38ae2f60d18066bb92c0e331ab37a5006a54351d55c753fc1e4294f1748818, apartado Tres.1–6. Manual2025 páginas447–449. El criterio operativo AEAT distingue pagos propios separados del gasto ganancial y reparte sólo el tope cuando ambos pagadores tienen derecho. Un único pagador separado puede aplicar min(20% del gasto propio neto,1000) por menor aunque conviva con otro progenitor. Se verifican autorización/inscripción y periodo certificado de primer ciclo, mínimo, convivencia al devengo, conceptos custodia/matrícula/preinscripción/alimentación/vestuario exclusivo, pagos anuales, ayudas por menor y facturas únicas. La certificación es un hecho documental recibido: no una auditoría del registro educativo real. Ningún defecto monetario reproducido dentro de ese alcance. Doble pagador, gananciales, fallecimiento y custodia sin convivencia efectiva siguen reservados. No se habilita art81: tanto libro definido como presencia de maternidad2025 conservan conciliacion_art81_custodia_pagos.

## Núcleo, precisión y cuota

Las dos cantidades legales se extraen al núcleo racional y se consumen desde el antiguo auxiliar y desde la conexión. Madrid no mantiene una segunda fórmula monetaria. Murcia conserva el significado anterior de gastos comunes: min(.2 × baseComún,1000)/divisor; el anual usa gasto propio y min(.2 × basePropia,1000). El núcleo calcula min(.2 × base,1000/titularesTope); el antiguo llama con1 y divide fuera. No intercambiar base común y propia ni habilitar dobles pagadores por tener fórmula para ellos.

Aritmética BigInt racional sin redondeos intermedios, comparación de base general+ahorro exacta, incluido incremento al umbral con71 decimales. El productor F preexistente usa Decimal con precisión80; la nueva fórmula no degrada esa precisión. Casos propios con333,33 EUR producen33333/500 y su efecto final66,67; se verifica la diferencia de cuota una sola vez, en ambas API. También trillizos con dos padres:2165,10. No se aprecia una segunda resta de cuota en el alcance probado.

## Pruebas y evidencia real

Arnés adaptado del autor en esta entrega, sobre siete bytes congelados y dependencias compartidas de raíz. Las fixtures estructurales se adaptan del autor, pero importes adversos y aserciones legales son propios. No se modifican sus oráculos. Tests portables como adición de tests/review.test.ts y tests/review-fixtures.ts, imports relativos normales; revision.patch permite aplicarlos a una integración del candidato. El overlay evita escribir en raíz. Todas las ejecuciones usan timeout y guardia3GiB árbol/6GiB grupo; maxWorkers1, caches externas y sin instalaciones.

- Final:53 tests propios,49 verdes y4 rojos monetarios descritos. Regresiones22 archivos:612 verdes,2 fails esperados y2 omitidos. Total final669 casos:661 verdes,4 fallos reales,2 fails,2 skips. validacion/finaltests.log, exit1 sin guardia.
- Los fails heredados están en tests/deducciones-procedencia-2025-f.test.ts:31 y42: agregador compartido de Madrid múltiple (esperado2886,80) y Murcia dos menores con gasto5000 cada uno (esperado2000). Son defectos activos de otra ruta y no quedan corregidos ni certificados por esta conexión.
- Las dos omisiones están en tests/maternidad-revision-independiente.test.ts:68, una por API: H1 gasto posterior a segundo ciclo no debe financiar incremento enero-agosto (oráculo0,08). No se han ejecutado ni contado verdes.
- Strict + exactOptionalPropertyTypes + Effect de proyecto:30 raíces y685 fuentes con imports transitivos, cero diagnósticos, incluido el test independiente final. validacion/tiposfinal.log. No monolítico de tipos.
- El intento monolítico del autor falló por heap1792, exit-6, conservado en recepción. Sus11 lotes518 raíces y canarios son evidencia del autor, no una campaña repetida por el revisor. Los canarios no se desactivan. No se atribuye éxito al monolítico ni al CI global.

Desviación operativa: la comprobación inicial de tipos seguía activa al lanzar filiacion, y se solaparon durante unos2,6s. Incumplió la secuencia de una suite a la vez, aunque los picos del grupo permanecieron bajo6GiB y no saltó guardia. Se conserva el resultado real; las ejecuciones finaltests y tiposfinal fueron secuenciales. No se oculta ni se presenta toda la sesión como estrictamente secuencial.

Sin inventario global, CI global, Nix, capturas, campañas ni publicación. No copias del repo/worktrees/node_modules/venv, borrados ni cambios de recepción. Se entrega sólo revisión, pruebas y arnés. La integración y el workflow completo siguen correspondiendo al padre después de corregir el bloqueo. PESADO1 liberado: ningún proceso de pruebas queda activo al cierre.
