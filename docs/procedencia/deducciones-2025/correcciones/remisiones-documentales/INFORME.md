# Correcciones de referencias documentales

Se corrigen tres defectos de la documentación. No cambian fórmulas ni importes del motor.

- **Castilla-La Mancha:** el anexo del Acuerdo de 7 de febrero de 2023 enumera 25 municipios: cinco de Albacete, cuatro de Ciudad Real y dieciséis de Toledo. Se corrige el recuento de 26 en el informe, la matriz y las propuestas. La [revisión](../../revisiones/d-clm-remisiones/INFORME.md) conserva la cita literal, la lista y sus códigos. El original se identifica por SHA-256 `51f847c6e5bd7a76c382c3245a1b1130c87d0460a13b356806211910c5ecabd3`, página 2.
- **Abonos culturales valencianos:** el fundamento es el artículo 4.Uno.x y la disposición adicional decimosexta de la Ley 13/1997. Se retira la atribución al artículo 30 de la Ley 9/2014, que trata de sucesiones. Su cita se conserva como contexto histórico identificado, sin presentarla como fundamento de esta deducción.
- **Patrimonio, lengua y mecenazgo valencianos:** se sustituyen las citas al índice y los fragmentos insuficientes por pasajes del cuerpo del Manual práctico de Renta 2025, páginas 577–587 y 601–602. Cada propuesta enlaza sus condiciones y acreditaciones específicas: el gasto propio no hereda el certificado exigido para donativos. Las posiciones se calculan sobre la extracción `pdftotext -layout` con espacios normalizados. El original conserva SHA-256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`.

La [revisión valenciana](../../revisiones/g-cultura-lengua/INFORME.md) y sus hashes conservan la evidencia de los defectos. Su verificador corresponde a los archivos anteriores; no debe interpretarse como una prueba de los archivos corregidos. La reserva sobre la operatividad del censo en 2025 sigue limitada a la categoría que lo exige.

Los seis discriminantes actuales se ejecutan sin red, almacén externo ni historial Git:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 tests/remisiones-clm-cultura-documentales.py -v
```

La reextracción de los nuevos pasajes requiere el original externo. La comprobación estructural de citas y propuestas se ejecuta con `correcciones/g-cultura-lengua/verificar.py`. El [contraste independiente](../../revisiones/remisiones-documentales/INFORME.md) es favorable para las tres correcciones: conserva los 18 fallos anteriores y añade siete discriminantes. Las reservas jurídicas permanecen; no hace falta otra revisión del mismo alcance.
