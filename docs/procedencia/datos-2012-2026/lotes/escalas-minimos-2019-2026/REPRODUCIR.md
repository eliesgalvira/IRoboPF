# Reanudación sobre el motor unificado

La recepción declaró `ab29bae79b238f1d96b568cd1ba3d4b9688985fb`. La corrección declara `a818ccb2e3c4ca5695ef3ad20d52a65b94c44dec` más las preimágenes del checkout combinado con C; no lo presenta como commit limpio. El antecedente del 2 de noviembre conserva sus bytes e interpretación en `ANTECEDENTE-20261102.md` y `manifiesto-antecedente.json`. No se restaura su base.

Los originales, el censo y los resultados grandes se conservan fuera del checkout por hash. `manifiesto.json` identifica los objetos necesarios. La entrega privada contiene el índice de ubicaciones y los comandos exactos. Las dependencias del corpus se reutilizan; no se instalan en la entrega.

Se genera **un** censo con `tools/procedencia/datos/censo.mjs`, fijando `DATOS_RUNTIME_ROOT`, los aliases de `runtime-resolver.mjs`, `--no-install` y `BUN_OPTIONS` como en el wrapper común. Se reutiliza ese directorio en todas las acciones siguientes. No ejecutar `flujo.run` por celda ni volver a generar el inventario por tabla.

Programa de ambos lotes: `tools/procedencia/datos/lotes/escalas-minimos-2012-2018/reanudar.py`. Acciones secuenciales: `prepare`, `enrich`, `run`, `summarize`; `manual` ejecuta el selector suplementario del mínimo general. Todas reciben `--repo`, `--previous`, `--census`, `--cas`, `--work` (rutas absolutas, las tres últimas externas salvo el repo) y `--base`. `previous` señala el antecedente conservado. `enrich` propone posiciones y cabeceras, sin acreditar condiciones jurídicas nuevas.

`run` realiza canonical y replay en procesos distintos y exige igualdad byte a byte. Cada proceso valida las páginas del inventario y las preimágenes de los módulos, vuelve a ejecutar el resolver AST actual en lotes acotados de 32 y reextrae los originales. Las posiciones propuestas no son una caché de verdad. El loader común valida schema, pin, targets, unidad, año, territorio y posiciones. Las expresiones indirectas rechazadas se conservan como intentos en `candidateExpression` y `resolution-failures`, sin buscar importes iguales.

El adaptador por lotes ejecuta los mismos bytes del resolver desde rutas temporales distintas: Bun puede ignorar la query al cachear módulos. La regresión de dos propiedades, la identidad async rechazada y la preimagen cambiada cubren ese transporte. Los temporales de código quedan fuera de la entrega y no contienen originales documentales.

Las pruebas sintéticas no necesitan el CAS real:

```sh
timeout -k 30s 10m python tests/datos-escalas-minimos-reanudacion-test.py
timeout -k 30s 10m python tests/datos-escalas-minimos-2012-2018-test.py
timeout -k 30s 10m python tests/datos-escalas-minimos-2019-2026.py
timeout -k 30s 10m python tests/datos-escalas-minimos-enlaces-test.py
timeout -k 30s 10m python tests/datos-escalas-minimos-resultados-test.py
```

Usar el entorno PyMuPDF/jsonschema ya gestionado; si faltan, `uv run --with` con las versiones del contrato. Cada comando real o prueba debe llevar timeout heredado por sus hijos. Una única suite pesada de este lote y como máximo dos en la máquina. No cambiar el motor financiero ni sus expectativas para satisfacer el mapping.

Los `match` son cotejos técnicos de campos declarados, no aceptación normativa ni acreditación independiente de aplicabilidad. Las condiciones candidatas permanecen explícitas. Simulaciones, referencias estructurales y estrategias suplementarias no se suman al denominador oficial. Las tablas rechazadas conservan todas sus celdas en la cola. Los huecos de selector/ámbito siguen siendo trabajo interno; no se presentan como falta externa de fuente.

La acción `repair-units` sirve para reanudar un registro legacy rechazado por el schema v2: conserva la propuesta sin relación y mantiene el rechazo de toda la tabla. La acción opcional `manual` no produjo un resultado real admitido en esta corrida (binding indirecto de 2019); conservar su salida 1, no contarla como pase ni sumar su estrategia.

La corrección añade `subject`, `conditions` y `applicability` a las salidas
y evidencias. `queue` conserva los match pendientes de aplicabilidad;
`applicabilityQueue` permite revisarlos expresamente. `strategies`
conserva en la unión el estado y la causa de cada lote. La cola de
ocurrencias no se suma a las de celdas.
