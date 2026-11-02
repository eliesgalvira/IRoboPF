# Artículo 60: localizador de la cita valenciana

La cita `gv-31` apuntaba al índice del Decreto ley 14/2025, página 3. Se sustituye por el artículo 60 completo, en las páginas 87–88 del mismo original: empieza en el carácter 425731 de la extracción `pymupdf-1.26.7-paginas` y termina antes del artículo 61. El documento conserva su SHA-256 `f02475336a032c236b02d32ebeaf1a092ce726714f9395426afc3f09aa04abff`.

El pasaje contiene la modificación del anexo II, apartado 2.c, del Decreto 65/2019. La cadena documental mantiene sus efectos desde el 30 de diciembre de 2025 y la exclusión de obras históricas. No cambia una cuantía, una condición del catálogo ni un cálculo del motor.

Se conserva la [revisión que detectó RV01](../../revisiones/g-vivienda-inversion/INFORME.md), con los hashes de los archivos examinados. Su verificador reproduce el defecto en esa versión histórica; no es un verificador de la cita corregida. La regresión actual es autocontenida:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 tests/g-vivienda-localizador.py -v
```

Dos comprobaciones fallaban con el índice; las tres pasan con el artículo. Verifican contenido material, delimitación del artículo y conservación de documento y remisión. La reextracción del PDF original comprueba adicionalmente los bytes, ambos hashes y la posición literal; requiere el almacén externo y se ejecuta con `correcciones/g-vivienda/verificar.py --cas` y las dependencias fijadas en esa entrega.

La corrección requiere contraste independiente de su localizador. Las demás conclusiones favorables de la revisión se conservan; la reserva sobre el precio histórico del alquiler sigue abierta.
