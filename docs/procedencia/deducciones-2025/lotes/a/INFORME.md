# Lote A: dictámenes candidatos de 2025

Se examinan los 49 códigos del censo: 17 de Andalucía, 19 de Aragón y 13 de Catalunya, sobre la base `016ec72d9539ccd887202735960ce306bd2354e5`. La entrega conserva un registro por código, separa ficha y cálculo y requiere revisión independiente. **No acredita íntegramente la procedencia normativa de las 49 deducciones**: siguen abiertas cadenas históricas, remisiones y contratos de evaluación, especificados individualmente en `pendientes` y `vigencia`.

El resultado global anterior tiene ocho diferencias documentales demostradas y 41 registros no verificables en su totalidad. Después de las correcciones, los 49 permanecen `no_verificable` para el alcance completo. Esto no significa que sus cantidades principales sean incorrectas ni que las 49 investigaciones estén aceptadas. Las comparaciones y citas permiten recuperar aspectos acreditados sin convertirlos en conformidad global.

## Cambios demostrados

- Libros/material escolar, clases de apoyo y formación para la autonomía en Aragón: las ayudas públicas minoran la deducción resultante **después** de aplicar porcentaje y límite por descendiente. Antes, las tres fórmulas textuales restaban las ayudas antes del límite. Por ejemplo, gasto de libros 200, límite 50 y ayuda 20: la fórmula anterior indicaba 50 y el orden legal produce 30. Para apoyo/formación, gasto 800 al 25%, límite 100 y ayuda 20: 100 frente a 80. Son correcciones de ficha; no se ha cambiado un cálculo financiero.
- Cinco fichas catalanas genéricas: se desarrollan las magnitudes y condiciones de donativos lingüísticos (15%, límite 10% de cuota), investigación (30%, límite 10% de cuota y límite combinado), medio ambiente (15%, límite 5% de cuota), ángel inversor (40%/12.000 y 50%/12.000) e inversión en vivienda bajo régimen transitorio (7,5%, 15% o 9%). Se mantienen IDs, campos, exports, tipo mixto y ruta de consignación.

Las ocho expectativas documentales se ejecutaron antes de sus respectivas correcciones y fallaron. Los originales de esas pruebas y sus resultados rojos se conservan en el transporte privado. Las ocho pasan después. Las regresiones focalizadas suman 103 pruebas verdes en cinco suites, incluyendo 49 casos de consignación por código. ESLint y las reglas anti-slop focalizadas pasan sin desactivaciones. Las dependencias y las adaptaciones de resolución de módulos se mantuvieron fuera del repositorio.

## Evidencia y límites

`fuentes.json` fija URL oficial, hashes, tamaño y metadatos; `dictamenes.json` conserva citas con localizadores reextraíbles y comparaciones por campo. `verificar.py` coteja ambos hashes y reextrae literalmente desde el CAS explícito, sin descargar ni modificar originales. La comprobación final valida 21 documentos y 1.261 citas literales. Esta comprobación no acepta interpretación jurídica ni vigencia.

Se recuperaron BOJA originales de Ley 5/2021, Ley 1/2022 y Ley 8/2025, DOGC del Decreto ley 5/2025 y reproducciones oficiales BOE/BOA/DOGC. Se identificaron reformas y renumeraciones aragonesas en las anotaciones del consolidado y se añadieron pasajes de originales disponibles. La ausencia de una corrección posterior no queda probada por ese índice. Los pasajes de originales titulados «localizados» o de disposiciones modificadoras conservan esa limitación; no certifican por sí solos el artículo completo.

El manual fijado tiene SHA-256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c` y pie editorial 21/10/2026. No se ha acreditado su fecha de publicación. Se conservan las páginas del censo y las físicas comprobadas por separado; en Catalunya hay desplazamientos y las cinco referencias genéricas 314/328 no delimitan sus secciones. Se inspeccionaron visualmente las tablas aragonesas de páginas físicas 74 y 85; las imágenes permanecen fuera de Git.

La ruta anual actual recibe importes consignados expresamente: los 49 sondeos comprueban esa capacidad, sin atribuirle fórmulas automáticas. Las fórmulas heredadas y los contratos parciales se distinguen de esa ruta. No se presenta una consignación libre como contraejemplo fiscal ni se propone limitar arbitrariamente su importe.

El consolidado andaluz incluye modificaciones para 2026: especialmente el artículo 10 requiere recuperar la redacción 2025 mediante Ley 7/2024, sin trasladar automáticamente la redacción posterior. El artículo 11 y las nuevas deducciones de Ley 8/2025 requieren sus efectos expresos desde 01/01/2025. En Catalunya, los artículos 612-1, 612-3, 612-11 y 612-12 deben seguir Decreto ley 5/2025 y las reformas posteriores correspondientes. Las remisiones estatales de vivienda necesitan la redacción histórica indicada por cada norma.

El JSON Schema y el verificador central admiten el paquete. El contrato distingue las URLs oficiales que contienen `/home/` de las rutas locales. Para el manual conserva `fechaPublicacion: null`, la reserva sobre esa fecha y `fechaEditorial: "2026-10-21"`; no presenta el pie como fecha de publicación. Estas precisiones tienen regresiones y requieren contraste independiente. Las comparaciones anteriores corregidas llevan `momento: "antes"` y su comparación actual del mismo campo.

No se han modificado evaluadores, tipos, adaptadores, UI ni documentos compartidos. La revisión independiente debe resolver las reservas individuales antes de aceptar reglas fiscales completas.
