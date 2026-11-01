Revisión independiente G · Comunitat Valenciana · IRPF 2025

Revisado el HEAD `a6abaf0c35b018fe54d75fe7e4f16197f1600f42`. La base documental original es `016ec72d9539ccd887202735960ce306bd2354e5`. No se han modificado producto, entrega del autor ni documentos compartidos. Esta revisión contiene objeciones y no acepta el encargo global ni valida una liquidación completa.

Las cuarenta decisiones están en [decisiones.json](decisiones.json). Las cuarenta diferencias de descripción se sostienen mediante discriminantes fiscales concretos ausentes de los campos descriptivos. Las cuarenta paginaciones corregidas coinciden con el manual fijado, incluidas páginas compartidas. El cambio regional contra la base afecta únicamente a referencias de páginas y su formato. La fecha editorial del manual es 2026-10-21; su fecha de publicación sigue desconocida.

El cálculo completo sigue sin verificarse: 39 rutas reciben `:cumple` e `:importe` calculados externamente; ascendientes calcula `197 × unidades` bajo un booleano externo. No recibe renta, derechos ni reparto. La aceptación de un importe externo no demuestra un error numérico ni sustituye una fórmula fiscal. Los casos jurídicos independientes del JSON son expectativas de derecho bajo los hechos indicados, no resultados supuestamente calculados por estas rutas.

Objeciones principales a la entrega del autor:

- **Inversión en entidades, art.4.Uno.z:** desde el 30 de diciembre, límite reforzado **15.000 euros**, no 9.900; el anterior queda para devengos anteriores. El artículo 4.Dos **no incluye z** en el límite del 30% de la base liquidable: enumera q.2/q.3/r/s. El art.5 DANA sí tiene su propio límite del 30%. Para una inversión cualificada de 40.000 euros, cuota suficiente y devengo final de 2025, corresponde un máximo generado de 15.000, incluso con base liquidable de 1.000. No atribuir esa diferencia a la ruta manual del producto.
- **Nacimiento/adopción, a:** además del fallecimiento anterior al 1 de junio, el manual534 conserva el régimen anterior de 300 euros para nacidos/adoptados antes de2025 con derecho previo. Los importes incrementados de acogimiento exigen **más de183 días**, no183. El resumen del autor no expresa esa frontera con precisión suficiente.
- **Fertilidad, ab:** los100 euros también se reducen conforme a4.Cinco; con base liquidable individual28.500 corresponde50. Las remisiones comunes no permiten tratar100 como importe incondicional hasta30.000.
- **Renovables, o:** arrastre de cuatro ejercicios por insuficiencia de cuota, no de cualquier inversión que exceda la base máxima. Las citas del autor a un régimen transitorio terminado en2022 no cierran por sí mismas inversiones2025. Vehículos, y: el manual604 ya permite concretar reparto de base para el mismo vehículo y límite de conjunta; no conservar esa cuestión como reserva genérica.
- **Citas:** las711 se reextraen literalmente, pero eso no acredita pertinencia. En múltiples, las citas `m1/m2` de534 pertenecen a nacimiento/adopción simple. Hay otros pasajes de secciones vecinas: [objeciones-citas.json](objeciones-citas.json) identifica111 candidatos por fronteras de títulos, para exclusión o justificación individual. Esta cifra es un resultado de delimitación, no111 errores fiscales confirmados. Las80 citas refinadas del manual seleccionan pasajes dentro de cada sección. Las citas normativas se amplían al comienzo del elemento; el encabezado anterior real se registra como contexto, sin fingir que siempre identifica el artículo destino.

La reserva sobre ausencia del DOGV3153 queda levantada: se recuperó el PDF regional completo, SHA256 `73ce8454a76681f23f9bb562f4df064c459b80ead311cf3f5a36fd412d598166`, desde [el archivo oficial](https://dogv.gva.es/datos/1997/12/31/pdf/dogv_3153.pdf). Es escaneado: se inspeccionaron portada, inicio de Ley13/1997, artículo4 y entrada en vigor. El artículo4 está en página física6/impresa20244; disposición final tercera en física11/impresa20249, efectos1enero1998. No se cuenta esa lectura visual como texto reextraído. Se distingue del original reproducido en BOE de7abril1998 y del consolidado.

Se recuperaron además las correcciones regionales de12junio2025 y21enero2026, y textos originales oficiales de Ley7/2021, Ley21/2017, Ley20/2018, Ley9/2014, DL1/2020 y Ley3/2023. La corrección de12junio cambia la excepción de entrada en vigor de artículos24/25/26 a36/37/38: no aplazar óptica por leer la DF3 sin corregir. La segunda corrección de enero no altera la compatibilidad n/ñ corregida el19enero. Los anexos oficiales de municipios2024/2025 están recuperados; Ademuz figura en ambos. Son escaneados: falta el cotejo completo de municipios y el documento matriz2025 por su CSV, no su primera descarga.

La [matriz por artículo](matriz-vigencia.json) identifica modificadores operativos, efectos, correcciones y remisiones. DL1/2026 y DL2/2026 cierran expresamente renta60.000/78.000, reducción54.000/72.000 y música para devengos desde1enero2025; no son reservas históricas abiertas. Ley5/2025 exige separar devengos anteriores1junio; DL14/2025 los anteriores30diciembre. No aplicar automáticamente a2025 modificaciones de julio2026.

Queda trabajo documental, **no imposibilidad demostrada**: facsímiles regionales de modificadores disponibles como reproducción BOE; remisiones a mínimos estatales, vivienda habitual, categorías familiares, inventario/mecenazgo, Orden5/2020 y requisitos técnicos de obras/energía; anexo territorial DANA y actos de ayuda/aceptación COVID. La matriz limita qué conclusión depende de cada remisión. No certifica toda la genealogía histórica por haber recuperado el texto inicial. No debe promoverse una ficha a conformidad hasta cerrar su reserva concreta.

Validación reproducida:

- Autor:28 documentos íntegros y711 citas exactas;81/81 pruebas en HEAD. Sustituyendo solo el módulo regional por sus bytes de la base en un cargador privado:40 fallos de referencias y41 casos correctos. No se alteró el checkout para hacerlo.
- Revisión:40 pruebas documentales rojas, una por código. Se examinan cuantía/requisitos/límites/reparto/compatibilidades, excluyendo código, título y páginas para evitar coincidencias accidentales. No son40 errores de cuota.
- Inspección visual independiente: fórmula alquiler569, tabla donaciones576, tabla vehículos604 y límite de inversión609; escaneados regional y anexos municipales.

Desde raíz, con los CAS y cachés externos configurados:

```sh
uv run --no-project --python python3 --no-managed-python --with pymupdf==1.26.7 --with beautifulsoup4==4.14.3 --with jsonschema==4.26.0 python docs/procedencia/deducciones-2025/lotes/g/verificar.py --cas "$CAS_LEGACY" --cas "$CAS_ADQUISICIONES" --schema scripts/procedencia/deducciones-2025/contrato.schema.json
uv run --no-project --python python3 --no-managed-python --with pymupdf==1.26.7 --with beautifulsoup4==4.14.3 python docs/procedencia/deducciones-2025/revisiones/g/verificar.py --cas "$CAS_LEGACY" --cas "$CAS_ADQUISICIONES"
bun run test tests/deducciones-procedencia-2025-g.test.ts --maxWorkers=1
bun run test --config docs/procedencia/deducciones-2025/revisiones/g/vitest.config.mjs --maxWorkers=1
```

El último comando debe fallar40 casos mientras persistan las omisiones. Arreglo mínimo propuesto: completar las fichas y corregir el dictamen/citas del autor, conservando contrato, códigos y consignación manual. Las expectativas jurídicas y fronteras de las cuarenta reglas están en decisiones.json; antes de automatizarlas hacen falta entradas para los hechos que hoy solo decide quien consigna. No se ha aplicado ningún arreglo de producto. Los logs, comparación de base, patch y manifiesto de entrega quedan privados.
