# Reservas y unión de resultados de escalas y mínimos

Corrección candidata del 4 de noviembre de 2026. La revisión independiente de
la reanudación encontró dos defectos de salida; ambos se reprodujeron antes de
modificar el código. A continúa abierto y los importes del motor no cambian.

## Reservas de aplicabilidad

El comparador conservaba `match` pero perdía el sujeto y las condiciones que
figuraban en el mapping. La cola excluía las coincidencias. El defecto afectaba
a las 445 coincidencias de celdas: 176 en 2012–2018 y 269 en 2019–2026.

Cada resultado conserva ahora `subject`, `conditions` y `applicability`.
Este último declara `status: pending`, las dimensiones pendientes —temporal,
territorial, período y condiciones— y los valores de ámbito propuestos.
Un período ausente se conserva como `null`; no se deduce de un importe anual.
La comparación técnica y la aplicabilidad son estados distintos.

La evidencia de cada ocurrencia conserva esos campos y la correspondencia
directa utilizada para clasificarla. También se conservan en las celdas de
una tabla rechazada. `queue` incluye ahora las coincidencias que aún requieren
revisión de aplicabilidad; `applicabilityQueue` las identifica expresamente.
No se eliminan de la cola las tablas rechazadas ni se admiten sus filas
por separado.

## Unión de lotes

La unión anterior elegía el estado más favorable o una diferencia, pero dejaba
la razón de la primera estrategia. Tres ocurrencias de `AHORRO_2016_2020`
terminaban en `match` con la razón `integration-unit-or-scope-review`.

La unión actual vuelve a calcular estado, razón y disponibilidad desde la
evidencia combinada. Una diferencia directa prevalece sobre una coincidencia.
`strategies` conserva por lote estado, razón, disponibilidad, aplicabilidad y
evidencias anteriores; no se borra una reserva porque otra estrategia coincida.
Los lotes se ordenan para que la salida no dependa del orden de recepción.
Una misma identidad con dimensiones de censo distintas se rechaza.

Las ocurrencias oficiales continúan con aplicabilidad pendiente. Las simuladas
conservan `not-applicable`. La cola de aplicabilidad de la unión usa identidades
de ocurrencia; no se suma a las colas de celdas ni a los conceptos estructurales.

## Validación y límite

Se conservan dos fallos de aserción previos, sin errores del arnés. Pasan seis
regresiones nuevas y los 40 métodos anteriores. La validación real genera un
solo censo vigente y lo reutiliza para ambos pares canonical/replay en procesos
separados; no excluye la fuente cambiada por C ni modifica el censo anterior.
Los registros y originales anteriores permanecen fijados por hash.

Ambos pares canonical/replay coinciden byte a byte. Se comprueban sus objetos,
las preimágenes vigentes y la igualdad de extracción, valores, rechazos y
propuestas de unidad respecto a la recepción. Las colas de aplicabilidad
contienen 6.006 y 6.004 celdas, incluidos los 445 match técnicos.

La unión mantiene 11.204 ocurrencias: 269 coincidencias técnicas, 10.465 no
verificables y 470 simuladas no aplicables. Las 10.734 ocurrencias oficiales
siguen con aplicabilidad pendiente. Solo cambian las tres razones agregadas
identificadas por la revisión; cada reserva de origen permanece en `strategies`.
Ruff E9/F pasa en los dos módulos y la regresión modificados.

El contraste independiente es favorable para A1–A2, sin hallazgos nuevos.
Reproduce las dos aserciones rojas, pasa las 46 regresiones y seis métodos propios,
verifica ambos canonical/replay y todas las preimágenes del censo, y reextrae
100 celdas mediante 101 bindings AST. Conserva los 1.095 hashes fijados.
Su manifiesto es `5abcd3040837356f681ad2afadf1a461fb9e836bca030f8933bf60774231669a`.

Las 46 regresiones se incorporan a `scripts/ci-datos.sh`; la entrada completa
pasa con 121 métodos Python, más sus comprobaciones del motor. El CI general
que incorpora C ya pasó; esta integración añade el contrato de resultados A
sin modificar código fiscal. La propuesta canaria sigue separada: este cambio
no aplica cuotas nuevas ni amplía su ámbito.
La política fiscal permanece pendiente; completar adaptadores, selectores y
pruebas de aplicabilidad sigue siendo trabajo interno de A.
