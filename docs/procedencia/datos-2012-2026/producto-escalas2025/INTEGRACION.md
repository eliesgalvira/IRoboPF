# Integración de cuotas publicadas de 2025

El cotejo original de esta recepción conserva 1.477 comparaciones: 1.405
coincidencias y 72 diferencias exactas, doce de ellas con distinto céntimo.
Describe el motor anterior; sus archivos y hashes no se reescriben después de
la corrección.

La [revisión independiente](../../revisiones/producto-a-escalas2025/INFORME.md)
verifica 27 filas oficiales de Aragón, Asturias, Galicia y Castilla y León,
con 497 comprobaciones propias y 122 archivos conservados. Contrasta las filas
con los PDF del manual y las normas autonómicas. Para Asturias se conserva la
reserva temporal: Ley 3/2025, efectiva desde el 3 de diciembre, aplicada al
cierre ordinario del ejercicio 2025; no se acredita aquí un fallecimiento previo.

`lib/dominio/irpf/cuotas/escalas-publicadas.ts` incorpora las cuotas fijas al
selector existente. El núcleo común las utiliza tanto sobre la base como sobre
el mínimo. No se reconstruyen a partir de los tipos ni se modifica el redondeo.
La selección nueva sólo admite 2025 ordinario y excluye fallecimientos; no cambia
Madrid, las escalas de 2026 ni ejercicios vecinos.

El sondeo previo reproduce las 72 discrepancias con el código anterior y las
resuelve con las tablas seleccionadas. `tests/escalas-publicadas-2025.test.ts`
conserva esos 72 importes y cuatro pruebas de alcance. La revisión añade 170
fronteras monetarias; el conjunto focal integrado pasa sus 374 pruebas.
Esto acredita el cotejo y la corrección acotados, no todas las magnitudes de A
ni todas las declaraciones de 2025.
