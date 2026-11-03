# Revisión independiente de unidades y enlaces

> Antecedente conservado. Los cinco defectos técnicos y el alcance vigente se
> documentan en la [corrección del 4 de noviembre](../correcciones-cinco/INFORME.md).
> Las cifras y dictámenes de este documento corresponden al candidato anterior.

Conclusión: el contrato no queda técnicamente cerrado. Se conservan dos adversos rojos en `casos.py`; no se modifica el producto ni se acepta ninguna regla fiscal.

El primer defecto afecta a la asociación geométrica. Una cabecera `Tasa (%)` situada a la derecha de la columna puede acreditar su unidad si la caja declarada se amplía hacia la izquierda. La CLI acepta esa caja porque comprueba su solapamiento, aunque las palabras extraídas no se solapan con la celda. La fixture sitúa la cabecera en x=220, la celda en x=20 y declara una caja [15,15,300,35]. El remedio es exigir la relación también sobre la geometría efectiva de las palabras, con controles positivos para cabeceras legítimas. No se afirma vigencia jurídica a partir de una cabecera.

El segundo defecto afecta al resolver AST: acepta `const id = async (x) => x` como identidad y devuelve una posición para una propiedad del argumento. Esa función devuelve una promesa; el export no contiene esa propiedad literal. Debe rechazarse el modificador async y comprobarse que el adaptador pertenece al subconjunto síncrono admitido. El alcance demostrado es la acreditación incorrecta del resolver; no se ha demostrado una coincidencia financiera falsa por esa vía, pues el censo efectivo aporta otra barrera.

Las pruebas adicionales comprueban que dos propiedades con el mismo valor tienen posiciones distintas, que los desplazamientos son UTF16, que una posición ajena no acredita el binding, que una función divergente se rechaza, que una escala sin conversión no produce match y que un pin externo fijo sobrevive a falsificar conjuntamente mapping, registro y targets. Cambiar el pin suministrado externamente selecciona otro candidato: no constituye revisión independiente.

Las dimensiones desconocidas del censo siguen siendo declaraciones candidatas. Año, territorio y unidad conocidos se contrastan técnicamente; sujeto y condiciones se cotejan entre entradas, sin demostrar su corrección jurídica. La igualdad numérica no basta para trasladar evidencia entre propiedades. Proporción, porcentaje, índice y EUR siguen siendo magnitudes distintas; las operaciones admitidas exigen sus unidades y conversión explícita. Una cabecera solo aporta evidencia técnica de unidad.

Reproducción sintética, con el candidato integrado y dependencias de runtime instaladas por el ejecutor:

```sh
timeout -k 30s 20m uv run --no-project --with pymupdf==1.26.7 --with jsonschema==4.25.1 \
  python docs/procedencia/datos-2012-2026/revision-unidades-enlaces/casos.py -v
```

La suite crea sus documentos pequeños y objetos temporales. No requiere originales, CAS privado, metadatos Git ni otro checkout. Los logs y transportes permanecen fuera de esta documentación. Los siete casos documentales históricos que describen fallos ya corregidos conservan sus expectativas y no se cuentan como defectos nuevos. La reextracción histórica debe contrastarse con el censo preservado; no equivale a regenerar el runtime antiguo.
