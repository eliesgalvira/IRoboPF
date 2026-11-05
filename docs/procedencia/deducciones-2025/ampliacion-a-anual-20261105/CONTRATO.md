# Ampliación A40 en la API anual: conexión parcial autorvalidada

Estado posterior de integración, 5/11: la revisión independiente A40 está terminada; sus dos hallazgos de censos H1/H2 se corrigieron con rojos conservados y 356 pruebas. La conexión B37 se revisó después sobre esas postimágenes y conserva A40H12. Las notas de preparación de abajo son históricas; el alcance vigente está en la [API](../../API-MOTOR.md).

Estado: privado, con autorvalidación local; pendiente revisión independiente propia de A40. No se cierra ninguna capacidad pública. Base: recepción v4 de vínculos y titulares efectivos, parche295c7922684b925c2ae9b15be5c23f913d4837c6b5acb0b49823a486d3fe5559, con contraste v4 favorable comunicado por el padre; ese contraste no aprueba A40.

## Contrato

La unión existente de deduccionesTerritoriales2025 añade lote A40 con código cerrado de las40 reglas publicadas, nacimiento propio y hechos específicos. Ambas entradas anuales consumen esa misma unión y composición. Se mantienen los55 adaptadores anteriores y la ruta Valencia40; no se añaden las dos reglas aragonesas posteriores.

No se aceptan ejercicio, territorio, contribuyente, elecciones, bases, cuotas ni componentes de mínimos externos. Se inyectan desde el caso anual y la composición: bases imponibles; bases liquidables calculadas; mínimos estatales del contribuyente y descendientes, más mínimo personal/familiar total; cuota autonómica disponible. Estos campos de transporte internos no crean una fuente anual adicional. Se inyectan por parámetro sin otra fórmula de cuota ni mínimos.

Los campos históricos del evaluador aislado con sufijo Centimos conservan el número entero en céntimos; en las magnitudes derivadas seleccionadas admiten además {euros: texto decimal}. La unión anual pública no expone esos campos. Pago y demás magnitudes de hecho conservan sus céntimos originales. El transporte anual de eur usa un constructor local de200 cifras; el constructor histórico D conserva80 cifras para entradas numéricas aisladas. El dominio se acota a un máximo de18 enteros y80decimales en el transporte; las comparaciones no borran una diferencia admitida junto a un umbral. No se convierte una base a Number ni se redondea para hacerla encajar.

Cada Minimo se concilia con el sujeto anual, nacimiento exacto, categoría de discapacidad, asistencia y atribucionesMinimo derivadas de derechosEstatales.atribuciones. El conjunto de titulares debe coincidir completamente con la atribución efectiva del mismo sujeto. Una lista parcial o un titular censado sin derecho se rechazan; el adaptador no reimplementa elegibilidad familiar. Se concilian por separado nacimiento/grado propios en raíces de hechos. Cónyuge/pareja y ascendientes no representados no se habilitan con referencias externas.

Las elecciones se derivan de los códigos realmente solicitados y de sus objetos persona/empleado/entidad. Los evaluadores territoriales existentes resuelven las incompatibilidades por esas elecciones. El libro previo detecta códigos y gastos/documentos repetidos y consume una sola cuota en el orden de solicitudes. A40 usa importeExactoEuros anterior a presentación; no usa importePresentadoCentimos. El resultado conserva condicionado y reservas, sin autenticar derecho externo ni imponer una acreditación documental universal.

## Ramas delimitadas

Hay contrato y caso de conexión para cada uno de los40 códigos, no cobertura fiscal integral. Las siguientes ramas tienen rechazo concreto:

- Repartos con denominador que no tenga expansión decimal finita (titulares, convivientes, declarantesConDerecho y proporción escolar). No se etiqueta un tercio aproximado como importe exacto. Se conservan los racionales de B/E y el libro existente, pero A aún no ofrece fracciones para estas ramas. Una lista de tres se rechaza aun cuando un caso concreto pudiera simplificarse o quedar limitado por un máximo.
- Adopción internacional andaluza y familia numerosa con bases de otros titulares: la anual sólo compone las bases del contribuyente. La vía de titular único inyecta su base total exacta. No se aceptan importes de terceros.
- Ayuda doméstica con pareja, discapacidad de cónyuge/pareja y otros sujetos anuales no representados. La vía propia sin pareja deriva sus ingresos de la composición.
- Mayores70 aragonés: se conecta el perfil de trabajo sin otras rentas. Los perfiles que requieren categorías de actividad u otras ganancias quedan rechazados hasta disponer de su productor anual.
- Cuidado aragonés: sólo descendiente con derecho anual y cuidador propio; las rentas conocidas se inyectan. Ascendientes o cuidadores ajenos necesitan representación anual adicional. No se infieren rentas nulas de hechos ausentes.
- Catalunya más de un pagador: el caso anual actual ofrece totales, sin censo de identidades/importes por pagador que permita atribuir la obligación exclusivamente a esa pluralidad. La conexión rechaza esta regla; no admite cuotas, ingresos ni pagadores monetarios externos. Su evaluador aislado sigue disponible.
- Alquiler catalán consolidado de varios declarantes: no se suman los gastos de otras declaraciones. Se conecta un único declarante con derecho representado.

Las demás reservas y rechazos territoriales existentes permanecen vigentes. No hay arrastre territorial nuevo ni regularización futura automática. No_soportado no se trata como cero.

## Cambios y controles pendientes

Los módulos territoriales sólo cambian por exportaciones Schema, transporte decimal seleccionado y adaptación de comparaciones de cero al mismo valor monetario; no se duplican fórmulas fiscales. El constructor histórico se conserva; las entradas nuevas con euros exactos usan el constructor de mayor precisión. Quedan pendientes las regresiones de compatibilidad aislada. No se alteran matrices, referencias ni revisiones previas.

Se prepararon16 casos positivos por reglas y territorios a partir de fixtures raíz S01, además de pruebas de ambas API, cuota20.079 única, bases fraccionarias y umbral35000+10^-70, ingresos/bases externos, censo sin derecho, mínimo de otro hijo, duplicación e incompatibilidad y tercio no soportado. Ejecutados tras asignación PESADO2:500 pruebas únicas en13 archivos, incluidos32 tests nuevos A40, las16 muestras preparadas, A233 aislado,41 discriminantes permanentes v4 y34 del contraste de vínculos. Tipos estrictos/Effect, antislop y ESLint pasan sin diagnósticos. No se solicita CI global/inventario ni publicación en esta fase.

## Base v4 recibida

El incremental se ha rebasado conservando íntegros los controles v4 de vínculos y fechas, hijoNacimiento, discapacidad, reparto CLM por hijos, titulares efectivos y exclusión de adopción mixta. La recepción v4 permanece intacta y su contraste P1 favorable no se atribuye a esta ampliación. Los controles locales A40 pasan; su revisión independiente sigue pendiente.

## Alcance validado y correcciones reproducidas

De los40 códigos,38 ofrecen alguna rama anual parcial; no equivale a todas sus ramas. Los dos rechazos completos son andalucia_conyuge_pareja_discapacidad y cataluna_obligacion_declarar_mas_de_un_pagador. Las demás restricciones anteriores se mantienen por rama.

Se cerró la aceptación de propiedades en hechos vacíos de mayores70 con Record(String,Never). Se añadieron llamadas A40 al conciliador v4 existente para nacimiento/adopción, junto al rechazo acotado de adopción mixta. Andalucía recibe la constitución del vínculo desde los derechos y contrasta la inscripción declarada, sin equiparar ambas fechas. No se cambia el cuerpo del conciliador ni fórmulas fiscales. Se conservaron los rojos anteriores y no se alteraron oráculos monetarios normativos.

La unión vacía no es un escape genérico: no admite claves ni magnitudes externas. El libro sigue consumiendo una única cuota desde los importes anteriores a presentación. Los censos de mínimo son completos y efectivos para cada sujeto; no se certifican documentos externos.
