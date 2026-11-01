# Condiciones de Asturias y Cantabria en 2025

Entrega candidata de 48 deducciones. Requiere revisión independiente; no constituye aceptación de sus propios cambios.

Las fichas incorporan las condiciones que faltaban: categorías de beneficiarios, convivencia, renta, pagos, documentación, permanencia, reparto y exclusiones. Cantabria deja de remitir a una «ficha normalizada» para conocer los requisitos. No se incorpora un calculador regional ni otra ruta de cálculo.

El [cotejo por código](condiciones.json) identifica los apartados comunes que se aplican y los que no, su texto literal, efecto y citas. La disposición adicional primera cántabra remite a las definiciones estatales de vivienda habitual, unidad familiar y discapacidad; la segunda equipara parejas inscritas a cónyuges para los beneficios autonómicos. No convierte a una pareja en una unidad familiar conjunta estatal. La redacción completa de ambas procede de Ley 3/2023, artículo 3.Veinte y Veintiuno, publicada el 29 de diciembre de 2023 y vigente desde el 1 de enero de 2024. Sustituye las reglas anteriores, incluida la redacción de discapacidad de 2018. El artículo 24 asturiano circunscribe sus equiparaciones a Sucesiones y Donaciones: no se extrapola al IRPF.

Las [remisiones estatales](remisiones.json) se contrastan con versiones fechadas y publicaciones originales: mínimos de los artículos 58–61 LIRPF; unidad familiar y residencia de los artículos 82 y 72; acreditación de discapacidad; vivienda habitual; actividad patrimonial; familias numerosas; entidades destinatarias de donaciones y economía social. Se describen los umbrales de renta y declaración del descendiente, prioridad de grado, supuestos asimilados y permanencias. No se desarrolla aquí el cálculo de una familia ni se modifica el helper.

En inversión se distinguen los límites familiares hasta tercer grado y hasta segundo grado, la prohibición de dirección o empleo, los requisitos de plantilla, escritura y mantenimiento. La condición de PYME requiere agregar empresas asociadas y vinculadas; no basta mirar el balance aislado. En donativos se conserva la base conjunta con los artículos 68.3 y 68.5, además de las condiciones del destinatario. La declaración de una entidad como fundación o asociación no sustituye la inscripción y el régimen exigido por la ley.

Los [índices de las cadenas usadas](cadenas.json) complementan los eslabones y efectos de la matriz individual. No se reconstruyen redacciones íntegramente sustituidas. Las correcciones regionales ya cotejadas de 2/2017, 11/2018 y 3/2020 no se repiten como elaboración nueva. Las consultas restantes no localizaron una corrección que sustituyese los apartados fiscales utilizados. Los originales HTML del BOE proporcionan una alternativa oficial a enlaces PDF antiguos que devuelven 404; no se trata esa incidencia como ausencia del contenido normativo.

La [comprobación territorial](municipios.json) distingue los 78 concejos del anexo II del Decreto 83/2025 y los 41 municipios del anexo de PRE/1/2025: 26 en riesgo, 13 en riesgo grave y dos de tratamiento especial. Asturias: publicación el 27 de junio, vigencia el 28 y remisiones fiscales de Ley 5/2025 vigentes el 31 de diciembre de 2025. Cantabria: publicación y vigencia el 3 de enero, con aplicación de la relación a hechos imponibles desde el 1 de enero de 2025. Se conservan códigos y localizadores de las tablas. El municipio del contribuyente es un hecho que debe acreditarse, no una fuente ausente. Igual distinción rige para actividad, vehículo, diagnóstico, títulos y pagos.

## Reserva de los 30 años

El original de Ley 8/2024, página 22, imprime los tramos 26–30 y 30–35. El manual usa 31–35. Las búsquedas de corrección o criterio oficial en BOE, BOPA y AEAT no localizaron una disposición o criterio vinculante que eliminase el solapamiento. Las comunicaciones presupuestarias y el manual no se presentan como correcciones del texto legal. Se conserva esta ambigüedad y sus casos, sin imponer una interpretación ni extender la reserva a las otras 47 deducciones.

## Dictámenes y cálculo

La concordancia de ficha se refiere a su descripción normativa, no a la elegibilidad de una persona concreta. La ausencia de un evaluador completo no hace desconocidas las cantidades o condiciones legibles. Los registros separan descripción, aritmética de la API y consignación; conservan el estado candidato.

Los casos de alquiler conjunto y reparto de nacimiento reproducen defectos de la base histórica examinada. No describen automáticamente el estado del motor integrado después en `c5c6988d`. Sus expectativas se conservan como evidencia histórica; corresponde al propietario del motor contrastar la ruta única actual. No se mantiene ni se propone un puente de compatibilidad.

## Contrato común que requiere la ruta única

El [registro individual](condiciones.json) contiene los hechos y parámetros exigidos por cada deducción. El propietario del contrato común debe representarlos y enlazar la procedencia de los valores utilizados, sin introducir otra API regional. Necesita distinguir importe pagado, base elegible, ayuda que minora base o deducción, límite compartido, cuota disponible y arrastre por ejercicio. También debe identificar beneficiario y titular, modalidad, derecho al mínimo, relación de parentesco, fechas, participación societaria, residencia, entidad y acreditaciones pertinentes.

Una marca de cumplimiento no acredita esos hechos. La ruta única debe producir una evaluación explícita de los requisitos y un importe con las reglas y evidencias que lo sustentan; debe rechazar entradas ambiguas. Los hechos no aportados permanecen pendientes de acreditación, sin transformar en «no verificable» la norma ya documentada. La coordinación de ese contrato y la absorción de evaluadores útiles quedan fuera de los archivos regionales asignados.

## Comprobación

Doce discriminantes descriptivos fallaron antes de completar las condiciones; dos casos complementarios comprueban la negación de las exclusiones y la remisión íntegra de monoparentalidad. Las siete suites focalizadas pasan 63 pruebas con un único worker, incluidos los casos históricos. Se verifican tipos de los archivos propios y las 16 reglas de lint sin desactivarlas. El verificador central cubre los 351 códigos y mantiene el estado candidato. La reextracción del lote comprueba tamaño, SHA-256, SHA-512 y literalidad desde los originales externos; los recibos y resultados exactos se conservan en el transporte privado.

Se conservan rb-9 dispositivo y la frontera de estudios estrictamente inferior a 8.000 euros. No se editan helpers, UI, otras regiones, contrato central, revisiones recibidas ni el informe histórico de correcciones/b. No se borran archivos ni se realiza ninguna mutación de VCS.
