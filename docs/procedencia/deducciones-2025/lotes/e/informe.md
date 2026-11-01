# Galicia y La Rioja: procedencia individual de 2025

Paquete sobre la base documental `016ec72d9539ccd887202735960ce306bd2354e5`. Incluye los 49 códigos del censo: 25 de Galicia y 24 de La Rioja. La revisión independiente está recibida; las correcciones posteriores requieren contraste y quedan remisiones normativas por completar.

Los 49 dictámenes de ficha mantienen **diferencia antes y después**: las referencias genéricas y los arrays vacíos no expresan condiciones que sí figuran en las normas. Las comparaciones separan cuantías, renta, requisitos, fechas, prorrateo e incompatibilidades, incluidas disposiciones comunes y remisiones. Se conserva la distinción entre omisión documental y error financiero.

Los 49 dictámenes de cálculo son **no_verificable para una liquidación fiscal completa**. El motor aplicado acepta importes externos y una declaración de cumplimiento. No convierte esa consignación en cálculo automático. Celiaquía de La Rioja tiene además un evaluador parcial: calcula 250/n por persona y comprueba aspectos del certificado; recibe externamente mínimo, vínculos y titulares. El importe corresponde al contribuyente indicado, nunca al total de una declaración conjunta. El agregado rechaza los parciales.

Las fichas conservan IDs y exportaciones. Se corrigen sus referencias al manual y la identificación de la base imponible neta de mínimos en nacimiento de Galicia. En el evaluador parcial de celiaquía se rechaza un certificado cuya fecha de emisión es anterior al diagnóstico definitivo. No se ha demostrado ni corregido una cuota anual errónea.

Las 38 fuentes incluyen publicaciones originales autonómicas, reformas, correcciones, dos consolidados auxiliares y el manual. Todos los códigos tienen al menos un pasaje original autonómico reextraído. La cadena localizada identifica normas y citas temporales por deducción; las reservas delimitan lo que cada pasaje acredita. No se equipara localizar una norma con aceptar todas sus remisiones.

En particular, se conservan las correcciones gallegas de 2014 y 2015 y la de enero de 2026; para libros y material escolar se incorpora la Ley 2/2026, que permite excepcionalmente efectivo en 2025, y la Orden de 26 de marzo de 2026, con categorías y límites de material escolar. La deducción se refiere a facturas de julio a diciembre de 2025. En La Rioja, la celiaquía tiene efectos expresos desde enero de 2025; esa excepción no extiende a 2025 todas las modificaciones de la Ley 9/2025. También se distinguen las correcciones de mecenazgo de mayo y junio de 2021.

El manual fijado tiene SHA256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`, 635 páginas, creación de 21/10/2026 y modificación de 22/10/2026. Galicia comienza en la página física/editorial 365 y La Rioja en la 482. No existe un desplazamiento uniforme respecto al censo. `manual.paginasFicha` conserva el censo y `paginasComprobadas` documenta los intervalos contrastados; las fichas regionales usan las referencias corregidas. Se inspeccionaron visualmente las tablas de nacimiento gallegas.

Los originales y las imágenes de inspección permanecen fuera de Git. `fuentes.json` solo contiene metadatos públicos y hashes. `verificar_citas.py` recibe mediante `--indice` un JSON privado SHA256 → ruta, comprueba ambos hashes y tamaño y reextrae cada literal desde sus bytes. Requiere BeautifulSoup4 y PyMuPDF en un entorno externo. Las recetas HTML indican el párrafo global y el rango semiabierto; los PDF fijan página física y bbox del bloque extraído.

Validación: pruebas focalizadas, ESLint y oxlint con las reglas del proyecto; contrato central en modo parcial y reextracción literal de las citas. Los resultados de estructura y bytes no aceptan por sí mismos la vigencia jurídica. Los recibos, la prueba roja y el transporte se conservan exclusivamente en el área privada.

## Correcciones de citas y soporte

Las tres citas AEAT de cuantía de ayudas gallegas han sido corregidas, al igual que las páginas de bicicletas y celiaquía riojanas. Pasan 159 pruebas focalizadas y de regresión, manteniendo las reservas normativas. [Evidencia y límites de las correcciones](../../correcciones/e/CONTRASTE.md).

