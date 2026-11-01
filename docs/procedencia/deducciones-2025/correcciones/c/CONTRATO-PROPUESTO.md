# Hechos y resultados para una ruta de cálculo

Propuesta para el propietario del contrato común, sin API ni evaluador regional nuevos. Los nombres siguientes describen la forma necesaria; su definición e integración corresponden al contrato compartido. [El inventario de 51 reglas](hechos-y-ruta-unica.json) identifica los hechos y parámetros de cada cálculo.

La entrada debe contener contexto fiscal —ejercicio, comunidad, devengo, modalidad y titulares— y hechos identificados: personas con sus circunstancias, familias y títulos, bienes y porcentajes de titularidad, operaciones con fechas, pagos por destinatario y concepto, ayudas, certificados y documentos. Las relaciones entre estos hechos deben conservarse. Un agregado monetario o un booleano `cumple` no reemplaza los datos de admisión ni permite inventar un reparto.

Cada resultado debe distinguir `calculada`, `excluida` y `hechos_insuficientes`. Debe identificar la regla y su versión, el importe cuando proceda, condiciones contrastadas, hechos ausentes y pasos del cálculo. Cada valor intermedio necesita unidad, hechos de origen, operación y citas del parámetro o condición normativa que lo determina. El límite debe expresar su unidad legal: persona, contribuyente, hijo, inmueble, base o cuota. La evidencia pertenece al par lote/documento y a una cita delimitada; el hash del documento no prueba por sí solo vigencia.

La única ruta debe resolver admisión, base neta de ayudas o reintegros, porcentaje o cuantía, límites específicos, reparto y aplicación en cuota. El orden y la devolución excepcional de nacimiento/adopción baleares requieren tratamiento expreso. Una entrada insuficiente no debe pasar por otro evaluador ni transformarse silenciosamente en cero o en importe aceptado.

Los cinco escenarios históricos delimitan requisitos de representación:

- Nacimiento canario: órdenes ordinario y de hijos con discapacidad separados; convivencia y supervivencia de los anteriores con discapacidad.
- Familia numerosa: titulares reales, convivencia y modalidad para determinar el reparto.
- Discapacidad: una circunstancia por contribuyente y suma por titulares de conjunta.
- Desempleo: prestaciones y meses legales por persona; el intervalo de trabajo se contrasta sobre la suma correspondiente a la modalidad, sin exigirlo por cónyuge dentro de la conjunta.
- Cuidados balear: gasto y máximo por persona atendida; distinguir ascendiente y descendiente común antes de repartir. No dividir una base agregada entre personas supuestas.

El candidato posterior `c5c6988d`, señalado en el encargo, debe ser examinado por el propietario para absorber los evaluadores útiles en esta ruta y retirar el puente y el auxiliar duplicado. No se impone su interfaz heredada ni se mantienen operaciones erróneas para satisfacer pruebas antiguas. Los contraejemplos ejecutados en este lote corresponden a `b95e56d6`; no son una revisión del candidato posterior.

La implementación compartida afecta al motor, a la admisión de hechos y a su consumidor. Está fuera del ámbito regional asignado. Los módulos regionales de esta entrega contienen descripción normativa; conservar campos que siguen siendo adecuados no crea una obligación de compatibilidad ni justifica dejar condiciones sin representar. No hay cambio visual ni desconexión de páginas en este lote.
