# Reanudación candidata 2012-2018: A continúa incompleto

Actualización del orquestador: la recepción descrita abajo conserva su base
y sus límites. La revisión halló dos defectos en los resultados: pérdida
de reservas y razones obsoletas en la unión. La corrección candidata
repite ambos lotes sobre un censo nuevo del checkout combinado con C,
sin excepciones de preimagen y con replay byte a byte. Mantiene todos
los importes, rechazos y conteos; añade reservas y cola de aplicabilidad.
El manifiesto vigente enlaza la recepción anterior por hash.
[Cambios y validación](../CORRECCIONES-RESULTADOS-ESCALAS.md).

Base publicada `ab29bae79b238f1d96b568cd1ba3d4b9688985fb`. Se recuperaron únicamente las 21 altas del candidato anterior, comprobadas por SHA-256, SHA-512 y tamaño; también se verificaron sus 594 objetos únicos. No se repuso la base antigua, ni se modificaron `lib/`, los contratos familiares, API-MOTOR, estados globales o CI. El antecedente conserva su significado en `ANTECEDENTE-20261102.md` y `manifiesto-antecedente.json`.

## Cobertura actual comprobada

El censo vigente se generó una vez y se reutilizó por versión, con comprobación de páginas y preimágenes de módulos. La conciliación usa archivo, símbolo y propiedad, conservando ejercicio, territorio, unidad y período; nunca empareja por importe. No hay retiradas ni altas dentro del ámbito seleccionado frente al censo anterior; hay 108 cambios de dimensiones en 2012–2018 y 144 en 2019–2026. Los aliases son referencias candidatas separadas, no nuevas aceptaciones fiscales.

En este lote, el comparador admite 4102 posiciones: {"extraction-absent": 1, "match": 176, "not-verifiable": 3925}. Rechaza otras 1904 posiciones en 197 tablas completas, todas en la cola. No se admite una tabla recortada. Las ocurrencias del motor son {"match": 130, "not-applicable": 237, "not-verifiable": 5109}. Son denominadores distintos: no sumar celdas, aliases ni estrategias.

Razones por ocurrencia:

- `integration-unit-or-scope-review`: 1910.
- `selector-not-implemented`: 1668.
- `simulation-not-official-territory`: 237.
- `table-extraction-rejected`: 1531.

Los `match` son cotejos técnicos de número, unidad y correspondencia declarada. **No acreditan por sí solos la aplicabilidad temporal, territorial ni las condiciones jurídicas pendientes**, incluido el año del título que no se ha demostrado físicamente en todos estos registros. Las condiciones candidatas permanecen explícitas. No hay aceptación jurídica propia presentada como independiente ni promoción de puertas o atestaciones. La cobertura familiar permanece Madrid 2025.

El manifiesto canonical y su replay son idénticos byte a byte en procesos separados. Se reutiliza el censo sellado; no se afirma haber regenerado el runtime en cada replay. Ambos procesos vuelven a ejecutar el resolver AST vigente y a extraer los originales. El manifiesto fija código, runtime, registros, mapping, inventario y salidas por hash. `manifiesto.json` enlaza esos objetos externos y la cola exhaustiva. El balance global incluye dominio/año/territorio; sus proyecciones por año no se suman para obtener la unión.

## Rechazos y trabajo interno pendiente

- 190 tablas: `Prueba de unidad sin relación v2; propuesta conservada, tabla rechazada`.
- 3 tablas: `Número/signo/separadores ambiguos: en adelante`.
- 3 tablas: `Número/signo/separadores ambiguos: 66. 593,00`.
- 1 tablas: `Anualidad del código distinta del lote`.

Se conservan 4049 intentos de correspondencia rechazados en este lote. Faltan adaptadores para accesos indirectos y helpers que el resolver actual no admite, pruebas físicas de relación de unidades y selectores de columnas/variantes aún no declaradas. Los literales `en adelante`, porcentajes con sufijo y números mal segmentados permanecen explícitos: no se limpian universalmente para conseguir igualdades. Las diferencias del antecedente que han perdido una correspondencia admitida no se consideran resueltas: sus originales y `candidateExpression` se conservan.

El transporte AST por lotes ejecuta los mismos bytes del resolver, con máximo 32 bindings por proceso. La caché de módulos de Bun hizo fallar la primera variante por query; se reprodujo con dos propiedades y se corrigió usando rutas distintas. La caché física conserva cajas, cabeceras y columnas vecinas; los rechazos corregidos del extractor común no se relajan.

El selector suplementario del mínimo general reconoce sujeto, cuantía anual y palabras/cajas completas, incluida la coma de «anuales,». Pasan sus discriminantes, pero la acción real `manual` termina con salida 1 al rechazar el binding indirecto `MINIMOS_ESTATALES_2019`. **No tiene un manifiesto real aceptado ni añade cobertura**. Ese enlace sigue siendo trabajo interno, no falta externa de fuente.

Las copias secundarias de los manuales 2012/2013 mantienen su reserva. La búsqueda acotada y dos URL oficiales probadas terminaron sin adquisición (HTTP 404); eso no demuestra indisponibilidad general. Los módulos autonómicos reales de 2026 siguen ausentes: no se sustituye 2026 por 2025. No se ha demostrado una imposibilidad externa que justifique cerrar estos pendientes.

## Pruebas y entrega

Pasan 40 tests del lote (31 recuperados y nueve nuevos), diez controles comunes seleccionados, Ruff E9,F, ESLint de los mjs afectados y tipos generales. El test antiguo de signo separado mantiene ahora el rechazo textual y un positivo con prueba física; no cambia expectativas financieras del motor. La suite común completa que iniciaba inventarios se interrumpió y no se cuenta como pase. Los intentos fallidos, el timeout de la ejecución conjunta y la reanudación del segundo replay están conservados.

La unión deduplicada es de 11.204 ocurrencias, con nueve compartidas: 269 coincidencias técnicas, 470 escenarios simulados no aplicables y 10.465 sin verificar. El índice agrupa 7322 conceptos por referencias estructurales candidatas, sin seleccionar por igualdad numérica ni sumarlos a las comparaciones. El balance y ambas colas están en CAS; la entrega contiene parche, manifiesto e índice, sin originales grandes ni entornos.

La revisión independiente nueva corresponde al padre. Este informe es autocomprobación del autor y **no completa el encargo A**.

## Canarias: diferencia conservada, propuesta separada

Se volvió a adquirir el [PDF original BOE-A-2015-1113](https://www.boe.es/boe/dias/2015/02/06/pdfs/BOE-A-2015-1113.pdf). Coincide con el hash histórico `ad5e2b7a25ea6b15f7728fe5058ba24f158fe10d01133d7da589b7937a437e6f`; `canarias-fuente.json` conserva SHA-512, página 73 y cajas de las palabras.

Para base 17.707,21 en la escala de Canarias 2015, el motor vigente devuelve 1.813,6154; `toFixed(2)` devuelve 1.813,62, frente a la cuota fija impresa 1.813,61. La regresión nueva termina en rojo, salida 1. Es una diferencia reproducida en cuota de escala, no un contraste de declaración completa con un simulador oficial. No basta la diferencia de límites para concluir un error general de céntimos.

La preimagen del fichero de cuotas sigue idéntica al antecedente. Su propuesta mínima se conserva fuera del parche principal y sin aplicar. Pasan doce anclajes técnicos de frontera contra esa propuesta; no certifican excesos, todos los extremos ni la vigencia completa de 2016. No se modifica el motor financiero ni sus expectativas.
