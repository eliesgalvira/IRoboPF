# Revisión de la conexión anual valenciana e integración de correcciones

La revisión independiente examinó la nueva conexión anual, sin repetir las
auditorías jurídicas de las cuarenta fórmulas. Encontró dos defectos monetarios
P2 y conservó sus casos completos y preimágenes en la entrega privada.

- R1: cuota autonómica disponible de 20,079 EUR truncada a 20,07. Con deducción
  suficiente quedaba 0,009, y el resultado público pasaba de 102,42 a 102,43.
  También se reprodujo una fracción residual con cuota de ahorro 62,475.
- R2: gasto deportivo del contribuyente de 30 años con edad declarada 76. La
  unidad «gasto-deporte» refería al mismo sujeto, pero el guard sólo comprobaba
  unidades cuyo id coincidía con el id del contribuyente. Admitía 100 en vez de 30.

El revisor reprodujo ambas regresiones rojas y 72 pruebas focales verdes, comprobó
las nueve rutas y seis preimágenes, y no modificó código productivo. Su dictamen
fue no favorable hasta corregir los dos defectos, sin otro bloqueo identificado
en ese alcance. No certificó C301 ni el conjunto de deducciones.

El integrador corrigió los defectos sin volver a encargar un contraste general.
Para R1, composición y consumo comparten un único algoritmo con dos contratos:
cuota externa a céntimos y cuota anual como decimal exacto serializado. Los
movimientos anuales también conservan el decimal: lo aplicado, pendiente, perdido
y caducado suma el saldo disponible. No se perdona un residuo fuera del libro ni
se calcula dos veces la cuota. El caso público conserva 102,42.

Para R2, la referencia de la unidad identifica al sujeto; una unidad puede ser
un gasto. Edad y discapacidad se concilian con contribuyente o descendiente
representado, y se rechazan referencias ambiguas o no conciliables. La misma
regresión se amplía a grado de discapacidad e identidad ambigua, y existe un
positivo con id de gasto distinto del sujeto.

Las pruebas permanentes están en `tests/deducciones-valencianas-anual.test.ts`;
las tres entradas sintéticas del revisor están en su carpeta de fixtures. La
regresión ampliada pasa 260 pruebas en ocho archivos, incluidas conservación de
subcéntimos, pérdidas, traslado, caducidad y 80 cifras. Oxlint y ESLint focales
pasan. La reproducción completa del workflow y su versión exacta se registran
por separado al publicar; no se confunde esta comprobación focal con ese CI.

El cierre local posterior reproduce los 31 comandos del workflow en entorno
limpio: todos pasan, incluidas las dos verificaciones de caché, Nix, inventario y
artefactos generados. Son 1.602 ejecuciones Vitest y 247 métodos Python descubiertos,
de los que siete se omiten explícitamente. Los 527 archivos fijados no cambian.
Duración acumulada: 448,163 segundos. [Resultados y límites](ci-local.json) y
[órdenes exactas](comandos-ci.json). El primer intento local detectó que el
intérprete de procedencia no resolvía `JSON`; la corrección admite ese global
explícitamente y añade una regresión de serialización del rastro anual. Este fallo
se corrigió antes de publicar. No se sustituyó el helper por una frontera externa.

Alcance: individual ordinario Comunitat Valenciana 2025, sin bases familiares
exhaustivas para dos o más descendientes, sin ascendientes, sin conjunta ni 2026.
La aceptación fiscal continúa pendiente. Se conserva el contrato aislado anterior
a céntimos y su reserva; las nuevas salidas exactas se documentan en
[VALENCIANA-ANUAL.md](../../VALENCIANA-ANUAL.md).
