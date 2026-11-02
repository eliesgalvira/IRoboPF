import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const EXTREMADURA_TRABAJO_DEPENDIENTE_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "extremadura_trabajo_dependiente",
    "Por trabajo dependiente",
    "otros_conceptos",
    {
      tipo: "importe_fijo",
      euros: "75",
      por: "contribuyente con trabajo dependiente",
    },
    ["75 euros por contribuyente"],
    [331, 331]
  ),
  normativa:
    "Artículo 2. Deducción autonómica por trabajo dependiente.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
  requisitos: [
    "- que perciba rendimientos del trabajo cuyo importe íntegro no supere la cantidad de 12.000 euros anuales, y",
  ],
  limites: [
    "75 euros por cada contribuyente que cumpla los siguientes requisitos:",
    "- que perciba rendimientos del trabajo cuyo importe íntegro no supere la cantidad de 12.000 euros anuales, y",
    "- que la suma del resto de los rendimientos netos, ganancias y pérdidas patrimoniales e imputaciones de renta no exceda de 300 euros.",
    "En declaración conjunta la deducción será aplicable por cada contribuyente que perciba rendimientos del trabajo dependiente y cumpla individualmente los requisitos exigidos.",
  ],
  prorrateo: [],
  compatibilidades: [],
  incompatibilidades: [
    'Esta deducción resulta incompatible para el contribuyente en estado de viudedad con la aplicación de la deducción autonómica "Para contribuyentes viudos".',
    "- Si tuviera derecho a ambas deducciones, el contribuyente podrá optar por la de mayor cuantía.",
    "- Esta incompatibilidad se refiere a una misma persona, pudiendo simultanearse, en tributación conjunta, la deducción de viudedad del declarante con la deducción por rendimientos de trabajo de alguno de los hijos pertenecientes a la unidad familiar.",
  ],
}

export const EXTREMADURA_CUIDADO_FAMILIARES_DISCAPACIDAD_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "extremadura_cuidado_familiares_discapacidad",
    "Por cuidado de familiares con discapacidad",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "150 euros por ascendiente o descendiente con discapacidad ≥65%; 220 euros si tiene derecho reconocido a ayuda a la dependencia y no la percibe",
    },
    [
      "150 euros con carácter general",
      "220 euros si tiene derecho reconocido a ayuda a la dependencia pero no la percibe",
      "Base imponible general + ahorro máximo 19.000 euros individual y 24.000 conjunta, con reglas especiales para municipios de menos de 3.000 habitantes",
    ],
    [334, 336]
  ),
  normativa:
    "Artículo 5. Deducción autonómica por cuidado de familiares con discapacidad.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
  requisitos: [
    "La obligación de declarar por Patrimonio se determina conforme al artículo 37 de la Ley 19/1991: cuota a ingresar o valor de bienes y derechos superior a 2.000.000 de euros. La presentación voluntaria no equivale a obligación legal.",
    "El certificado o resolución de discapacidad corresponde al IMSERSO u órgano autonómico competente conforme al artículo 72 del Reglamento del IRPF. La presunción de discapacidad del 33 por 100 de determinados pensionistas no acredita por sí sola el umbral del 65 por 100.",
    "Que el ascendiente o descendiente con discapacidad conviva de forma ininterrumpida con el contribuyente al menos la mitad del período impositivo.",
    "Que se acredite la convivencia efectiva por los Servicios Sociales de base o por cualquier otro organismo público competente.",
    "Que la renta general y del ahorro del ascendiente o descendiente con discapacidad no sean superiores al doble del indicador público de renta de efectos múltiples (IPREM), incluidas las exentas ni tenga obligación legal de presentar declaración por el Impuesto sobre el Patrimonio. Para el ejercicio 2025, dicha cuantía asciende a 16.800 euros (8.400 x 2).",
    "Que la suma de las bases imponibles general y del ahorro, casillas [0435] y [0460] de la declaración, no supere las siguientes cantidades:",
    "- 19.000 euros en tributación individual.",
    "- 24.000 euros en tributación conjunta.",
    "En el supuesto de que el contribuyente resida habitualmente en municipios y entidades locales menores con una población inferior a 3.000 habitantes:",
    "- 28.000 euros en tributación individual.",
    "- 45.000 euros en tributación conjunta.",
    "En caso de matrimonio, este límite de 45.000 euros se aplicará siempre que al menos uno de los cónyuges hubiera tenido su residencia habitual durante el período impositivo en alguno de los municipios o entidades locales menores con una población inferior a 3.000 habitantes.",
    "La residencia habitual se determinará en base a los criterios definidos en el artículo 9 de la Ley del IRPF, pero circunscrito al ámbito del municipio o entidad local menor.",
    "Puede consultar los municipios y las entidades locales menores con una población inferior a 3.000 habitantes en los enlaces indicados al término de la presente deducción.",
    "Atención: en este supuesto b. no existirá ningún límite de bases para contribuyentes que:",
    "- formen parte de una familia que tenga la consideración legal de numerosa, o",
    "Las condiciones necesarias para la consideración de familia numerosa y su clasificación por categorías se determinarán con arreglo a lo establecido en la Ley 40/2003, de 18 de noviembre, de Protección a las Familias Numerosas (BOE de 19 de noviembre).",
    "- sean ascendientes separados legalmente, o sin vínculo matrimonial, con dos hijos sin derecho a percibir anualidades por alimentos y por los que tenga derecho a la totalidad del mínimo por descendientes previsto en la normativa del IRPF.",
    "Cuando los contribuyentes tengan distinto grado de parentesco respecto de la persona con discapacidad, la deducción corresponderá al de grado más cercano.",
    "Importante: existiendo más de un contribuyente que conviva con la persona con discapacidad y para el caso de que solo uno de ellos reúna el requisito del límite de renta, este podrá aplicarse la deducción completa.",
  ],
  limites: [
    "Por cada ascendiente o descendiente con un grado de discapacidad al igual o superior al 65 por 100 o o que esté judicialmente incapacitado o se haya establecido la curatela representativa del contribuyente:",
    "Atención: téngase en cuenta que, a partir de la entrada en vigor de la Ley 8/2021, de reforma de la legislación civil y procesal para el apoyo a las personas con discapacidad en el ejercicio de su capacidad jurídica, desaparece la incapacitación judicial y la tutela queda reducida a los menores de edad no emancipados en situación de desamparo o no sujetos a patria potestad, suprimiéndose para menores de edad emancipados y para mayores de edad, para los que establece la curatela representativa y otras medidas de apoyo en el ejercicio de su capacidad jurídica.",
    "A los tutores de las personas con discapacidad nombrados bajo el régimen de la legislación anterior se les aplicarán las normas establecidas para los curadores representativos.",
    "La ley citada contempla asimismo la revisión, en un plazo máximo de 3 años, de las medidas establecidas con anterioridad a su entrada en vigor.",
    "150 euros, con carácter general.",
    "El grado de discapacidad o la incapacitación serán reconocidas o declaradas por el órgano administrativo o judicial competente, de acuerdo con la normativa aplicable.",
    "Respecto a la forma de acreditar la discapacidad véase el artículo 72 del Reglamento del IRPF.",
    "En cuanto a la incapacitación, a partir de la entrada en vigor de la Ley 8/2021 desaparece la incapacitación judicial siendo sustituida por una resolución judicial que determine los actos para los que la persona con discapacidad requiera el apoyo para el ejercicio de su capacidad jurídica.",
    "220 euros si el ascendiente o descendiente con discapacidad ha sido evaluado por los servicios sociales y se le ha reconocido el derecho a una ayuda a la dependencia,",
    "pero que a 31 de diciembre aún no la percibe efectivamente.",
  ],
  prorrateo: [
    "Cuando dos o más contribuyentes con el mismo grado de parentesco tengan derecho a la aplicación de esta deducción respecto de una misma persona, su importe se prorrateará entre ellos por partes iguales.",
  ],
  compatibilidades: [],
  incompatibilidades: [],
}

export const EXTREMADURA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "extremadura_arrendamiento_vivienda_habitual",
    "Por arrendamiento de vivienda habitual",
    "vivienda_habitual",
    {
      tipo: "mixta",
      descripcion:
        "30% del alquiler; límite 1.000 euros, o 1.500 euros si vivienda habitual en medio rural",
    },
    [
      "30% de cantidades satisfechas",
      "Límite general: 1.000 euros",
      "Límite medio rural: 1.500 euros",
      "Base imponible general + ahorro máximo 28.000 euros individual y 45.000 conjunta, con excepciones por municipio",
    ],
    [343, 346]
  ),
  normativa:
    "Artículo 9. Deducción autonómica por arrendamiento de vivienda habitual.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
  requisitos: [
    "Que concurra en el contribuyente alguna de las siguientes circunstancias:",
    "Que tenga en la fecha del devengo del impuesto menos de 36 años cumplidos. En caso de tributación conjunta, el requisito de la edad deberá cumplirlo, al menos, uno de los cónyuges, o, en su caso, el padre o la madre.",
    "Que forme parte de una familia que tenga la consideración legal de numerosa o sea ascendiente separado legalmente, o sin vínculo matrimonial, con dos hijos sin derecho a percibir anualidades por alimentos y por los que tenga derecho a la totalidad del mínimo por descendientes.",
    "Que padezca una discapacidad con un grado reconocido igual o superior al 65 por 100.",
    "El grado de discapacidad se determinará mediante la aplicación del baremo a que se refiere el artículo 354 del texto refundido de la Ley General de la Seguridad Social, aprobado por el Real Decreto Legislativo 8/2015, de 30 de octubre (BOE de 31 de octubre).",
    "Que, cualquiera que sea el grado de discapacidad, esté judicialmente incapacitado o se haya establecido la curatela representativa del contribuyente. d.",
    "Atención: téngase en cuenta que, a partir de la entrada en vigor de la Ley 8/2021, de reforma de la legislación civil y procesal para el apoyo a las personas con discapacidad en el ejercicio de su capacidad jurídica, desaparece la incapacitación judicial y la tutela queda reducida a los menores de edad no emancipados en situación de desamparo o no sujetos a patria potestad, suprimiéndose para menores de edad emancipados y para mayores de edad, para los que establece la curatela representativa y otras medidas de apoyo en el ejercicio de su capacidad jurídica.",
    "A los tutores de las personas con discapacidad nombrados bajo el régimen de la legislación anterior se les aplicarán las normas establecidas para los curadores representativos.",
    "La ley citada contempla asimismo la revisión, en un plazo máximo de 3 años, de las medidas establecidas con anterioridad a su entrada en vigor.",
    "Que se trate del arrendamiento de la vivienda habitual del contribuyente, ocupada efectivamente por el mismo y localizada dentro del territorio de la Comunidad Autónoma de Extremadura.",
    "Que se haya satisfecho por el arrendamiento y, en su caso, por sus prórrogas el Impuesto sobre Transmisiones Patrimoniales y Actos Jurídicos Documentados o, en su caso, se justifique la exención de dicho impuesto.",
    'Precisión: debe tenerse en cuenta el supuesto de exención que se añade en el artículo 45.1.B) del texto refundido de la Ley del Impuesto sobre Transmisiones Patrimoniales y Actos Jurídicos Documentados "para los arrendamientos de vivienda para uso estable y permanente a los que se refiere el artículo 2 de la Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos", por el artículo 5 del Real Decreto-ley 7/2019, de 1 de marzo, de medidas urgentes en materia de vivienda y alquiler (BOE de 5 de marzo).',
    "La exención exime al sujeto pasivo del cumplimiento de la obligación tributaria principal de pago, pero no de la obligación tributaria formal de presentar la correspondiente autoliquidación sin deuda a ingresar",
    "Que el contribuyente no tenga derecho durante el mismo período impositivo a deducción alguna por inversión en vivienda habitual.",
    "Que ni el contribuyente ni ninguno de los miembros de su unidad familiar sean titulares del pleno dominio o de un derecho real de uso o disfrute de otra vivienda situada a menos de 75 kilómetros de la vivienda arrendada.",
    "- El concepto de unidad familiar que hay que utilizar es el definido en el artículo 82 de la Ley del IRPF.",
    "- En el caso de que el contribuyente y/o cualquiera de los miembros de su unidad familiar sean titulares de un porcentaje en pleno dominio o en usufructo de otra vivienda situada a menos de 75 kilómetros de la vivienda arrendada no se podrá aplicar la deducción.",
    "Que la suma de las bases imponibles general y del ahorro (casillas [0435] y [0460] de la declaración) no sea superior a las siguientes cantidades:",
    "- 28.000 euros en tributación individual.",
    "- 45.000 euros en tributación conjunta.",
    "Atención: no se observará este requisito de bases cuando el contribuyente resida habitualmente en un municipio o entidad local menor de Extremadura con población inferior a 3.000 habitantes y",
    "- forme parte de una familia que tenga la consideración legal de numerosa, o",
    "Las condiciones necesarias para la consideración de familia numerosa y su clasificación por categorías se determinarán con arreglo a lo establecido en la Ley 40/2003, de 18 de noviembre, de Protección a las Familias Numerosas (BOE de 19 de noviembre).",
    "- sea ascendiente separado legalmente, o sin vínculo matrimonial, con dos hijos sin derecho a percibir anualidades por alimentos y por los que tenga derecho a la totalidad del mínimo por descendientes previsto en la normativa del IRPF.",
    "Puede consultar los municipios y las entidades locales menores con una población inferior a 3.000 habitantes en los enlaces indicados al término de la presente deducción.",
    "- En caso de matrimonio, cualquiera que sea el régimen económico matrimonial, solamente tiene derecho a la deducción el cónyuge o cónyuges que figuren como arrendatarios en el contrato. Véase al respecto la Sentencia del Tribunal Supremo núm. 220/2009, de 3 de abril (Sala de lo Civil), recaída en el recurso de casación número 1200/2004 (ROJ: STS 2464/2009).",
    "En el caso de que solo una parte de las cantidades satisfechas en el ejercicio por el alquiler de vivienda habitual lo sea por arrendamiento en el medio rural la deducción aplicable por cada uno de los tipos de arrendamiento no podrá exceder de 1.500 euros conjuntamente, dado que se trata de una única deducción con límites incrementados para el supuesto de arrendamiento en el medio rural.",
    'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por arrendamiento de Andalucía, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla-La Mancha, Castilla y León, Cataluña, Extremadura, Galicia, Madrid, Región de Murcia, La Rioja y Comunitat Valenciana" del Anexo B.11 de la declaración.',
  ],
  limites: [
    "El 30 por 100 de las cantidades satisfechas por el contribuyente en el período impositivo en concepto de alquiler de su vivienda habitual, con el límite de 1.000 euros anuales.",
    "El 30 por 100 de las cantidades satisfechas por el contribuyente en el período impositivo en caso de alquiler de vivienda habitual en el medio rural, con el límite de 1.500 euros anuales.",
    "Tendrá la consideración de vivienda en el medio rural aquella que se encuentre en municipios y entidades locales menores de Extremadura con una población inferior a 3.000 habitantes.",
  ],
  prorrateo: [
    "Cuando dos o más contribuyentes tengan derecho a la aplicación de esta deducción respecto de los mismos bienes para un mismo período impositivo, su importe se prorrateará entre ellos por partes iguales.",
    "- El prorrateo de la deducción está referido únicamente a su límite máximo.",
  ],
  compatibilidades: [],
  incompatibilidades: [],
}

export const EXTREMADURA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_partos_multiples",
      nombreCatalogadoDesdeCodigo("extremadura_partos_multiples"),
      categoriaCatalogadaDesdeCodigo("extremadura_partos_multiples"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [331, 333],
      [
        "extremadura_partos_multiples:importe",
        "extremadura_partos_multiples:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 3. Deducción autonómica por partos múltiples.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "La aplicación de la deducción está condicionada a que la suma de las bases imponibles general y del ahorro, casillas [0435] y [0460] de la declaración, no supere las siguientes cantidades:",
      "- 19.000 euros en tributación individual.",
      "- 24.000 euros en tributación conjunta.",
      "En el supuesto de que el contribuyente resida habitualmente en municipios y entidades locales menores con una población inferior a 3.000 habitantes:",
      "- 28.000 euros en tributación individual.",
      "- 45.000 euros en tributación conjunta.",
      "En caso de matrimonio, este límite de 45.000 euros se aplicará siempre que al menos uno de los cónyuges hubiera tenido su residencia habitual durante el período impositivo en alguno de los municipios o entidades locales menores con una población inferior a 3.000 habitantes.",
      "La residencia habitual se determinará en base a los criterios definidos en el artículo 9 de la Ley del IRPF, pero circunscrito al ámbito del municipio o entidad local menor.",
      "Puede consultar los municipios y las entidades locales menores con una población inferior a 3.000 habitantes en los enlaces indicados al término de la presente deducción.",
      "Atención: en este supuesto b. no existirá ningún límite de bases para contribuyentes que:",
      "- formen parte de una familia que tenga la consideración legal de numerosa, o",
      "Las condiciones necesarias para la consideración de familia numerosa y su clasificación por categorías se determinarán con arreglo a lo establecido en la Ley 40/2003, de 18 de noviembre, de Protección a las Familias Numerosas (BOE de 19 de noviembre).",
      "- sean ascendientes separados legalmente, o sin vínculo matrimonial, con dos hijos sin derecho a percibir anualidades por alimentos y por los que tenga derecho a la totalidad del mínimo por descendientes previsto en la normativa del IRPF.",
    ],
    limites: [
      "300 euros por cada hijo nacido en el período impositivo, siempre que el menor conviva con el progenitor en la fecha de devengo del impuesto (normalmente, el 31 de diciembre) y se trate de partos múltiples.",
    ],
    prorrateo: [
      "Cuando los hijos nacidos convivan con ambos progenitores el importe de la deducción se prorrateará por partes iguales en la declaración de cada uno de ellos si optaran por tributación individual.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_acogimiento_menores",
      nombreCatalogadoDesdeCodigo("extremadura_acogimiento_menores"),
      categoriaCatalogadaDesdeCodigo("extremadura_acogimiento_menores"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [333, 334],
      [
        "extremadura_acogimiento_menores:importe",
        "extremadura_acogimiento_menores:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 4. Deducción autonómica por acogimiento de menores.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "Importante: en los supuestos de acogimiento simple, permanente y preadoptivo a los que aludía el artículo 6 del Texto Refundido de las disposiciones legales de la Comunidad Autónoma de Extremadura en materia de tributos cedidos por el Estado, aprobado por Decreto Legislativo 1/2013, de 21 de mayo, que subsistan a 24 de mayo de 2018, se tendrá derecho a la deducción correspondiente, en los términos que establecía el citado artículo.",
      "A estos efectos recordar que el citado artículo 6 del Decreto Legislativo 1/2013 permitía deducir la cantidad de 250 euros por cada menor en régimen de acogimiento familiar simple, permanente o preadoptivo, administrativo o judicial, siempre que convivan con el menor 183 días o más durante el período impositivo y 125 euros si el tiempo de",
      "convivencia durante el período impositivo fuera inferior a 183 días y superior a 90 días.",
      "Véase al respecto la disposición adicional única del Decreto Legislativo 1/2018, de 10 de abril, por el que se aprueba el texto refundido de las disposiciones legales de la Comunidad Autónoma de Extremadura en materia de tributos cedidos por el Estado.",
    ],
    limites: [
      "250 euros por cada menor en régimen de acogimiento familiar temporal, permanente o de urgencia, siempre que el contribuyente conviva con el menor por tiempo igual o superior a 183 días durante el período impositivo.",
      "125 euros por cada menor en régimen de acogimiento, en los términos anteriormente comentados, si el tiempo de convivencia durante el período impositivo fuera inferior a 183 días y superior a 90 días.",
    ],
    prorrateo: [
      "En el caso de acogimiento de menores por matrimonios, el importe de la deducción se prorrateará por partes iguales en la declaración de cada uno de los cónyuges si tributan individualmente.",
      "Si el acogimiento se realiza por parejas de hecho, de acuerdo con el artículo 8 de la Ley 5/2003, de 20 de marzo, de Parejas de Hecho de la Comunidad Autónoma de Extremadura, la deducción se prorrateará por partes iguales en la declaración de cada uno de sus miembros.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_cuidado_hijos_hasta_14",
      nombreCatalogadoDesdeCodigo("extremadura_cuidado_hijos_hasta_14"),
      categoriaCatalogadaDesdeCodigo("extremadura_cuidado_hijos_hasta_14"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [336, 339],
      [
        "extremadura_cuidado_hijos_hasta_14:importe",
        "extremadura_cuidado_hijos_hasta_14:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 6. Deducción autonómica por cuidado de hijos menores de hasta 14 años inclusive.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "Que en la fecha de devengo del impuesto los hijos tengan 14 o menos años de edad.",
      "Que ambos padres realicen una actividad por cuenta propia o ajena por la que estén dados de alta en el régimen correspondiente de la Seguridad Social o mutualidad.",
      "- Es necesario que la actividad ejercida sea remunerada.",
      "- La deducción podrá practicarse por las cantidades satisfechas cuando ambos padres realicen actividades por cuenta propia o ajena simultáneamente, ya sea durante todo o parte del año.",
      "- En el caso de actividades por cuenta propia se admite que el ejercicio de la actividad económica se realice a través de una entidad en régimen de atribución de rentas.",
      "Que, en el caso de que la deducción sea aplicable por gastos de una persona empleada del hogar, esta esté dada de alta en el régimen correspondiente de la Seguridad Social.",
      "Que en el caso de que la deducción sea aplicable por gastos en guarderías, centros de ocio, campamentos urbanos, centros deportivos, ludotecas o similares, se disponga de la correspondiente factura.",
      "Que se tenga derecho a aplicar el mínimo por descendientes regulado en el artículo 58 de la Ley del IRPF por cada uno de los hijos por los que se vaya a aplicar la deducción autonómica.",
      "Que la suma de las bases imponibles general y del ahorro (casillas [0435] y [0460] de la declaración) no sea superior a las siguientes cantidades:",
      "- 28.000 euros en tributación individual.",
      "- 45.000 euros en tributación conjunta.",
      "Atención: no se observará este requisito cuando el contribuyente resida habitualmente en un municipio o entidad local menor de Extremadura con población inferior a 3.000 habitantes y",
      "- forme parte de una familia que tenga la consideración legal de numerosa, o",
      "Las condiciones necesarias para la consideración de familia numerosa y su clasificación por categorías se determinarán con arreglo a lo establecido en la Ley 40/2003, de 18 de noviembre, de Protección a las Familias Numerosas (BOE de 19 de noviembre).",
      "- sea ascendiente separado legalmente, o sin vínculo matrimonial, con dos hijos sin derecho a percibir anualidades por alimentos y por los que tenga derecho a la totalidad del mínimo por descendientes previsto en la normativa del IRPF.",
      "Puede consultar los municipios y las entidades locales menores con una población inferior a 3.000 habitantes en los enlaces indicados al término de la presente deducción.",
      "Matrimonio formado por don A.R.T y doña B.S.S con un hijo solo de Don A.R.T, por el que tiene derecho al 100 por 100 del mínimo por descendientes, y otro común.",
      "El cónyuge Don A.R.T ha satisfecho 1.600 euros de gastos por su hijo. Por el hijo común se han satisfecho 3.600 euros entre ambos cónyuges.",
      "Se desea saber cuál sería el importe de la deducción aplicable por cada uno de los cónyuges.",
      "Nota previa: Se trata de una única unidad familiar, en la que don A.R.T tiene derecho al 100 por 100 del mínimo por descendientes por su hijo, y respecto del común, don A.R.T y doña B.S.S tienen derecho a la mitad.",
      "Don A.R.T (160 + 180) = 340 euros",
      "Por el hijo propio: 10% s/1.600 = 160",
      "Por el hijo común: 10% s/(3.600 ÷ 2) = 180",
      "Doña B.S.S: Por el hijo común: 10% s/(3.600 ÷ 2) = 180",
      "Total (160 + 180 + 180) = 520",
      "Límite máximo: 400",
      "Deducción de don A.R.T: (400 x 340) ÷ 520 = 261,54",
      "Deducción de doña B.S.S: (400 x 180) ÷ 520 = 138,46",
      "Total deducción aplicada (261,54 + 138,46) = 400",
    ],
    limites: [
      "El 10 por 100 de las cantidades satisfechas en el periodo impositivo por cuidado de hijos menores de hasta 14 años cuando se den las siguientes circunstancias:",
      "1ª. Que el contribuyente tenga que dejar a sus hijos menores de hasta 14 años inclusive al cuidado de otras personas o entidades por motivos de trabajo, sea por cuenta propia o ajena.",
      "2ª. Que el cuidado de los menores de hasta 14 años se realice:",
      "Por una persona empleada del hogar o a.",
      "En guarderías, centros de ocio, campamentos urbanos, centros deportivos, ludotecas o similares, autorizados por la administración autonómica o local competente. b.",
      "El límite máximo de esta deducción es de 400 euros anuales por unidad familiar.",
    ],
    prorrateo: [
      "A efectos de la aplicación de la deducción la unidad familiar no es la definida en el artículo 82 de la Ley del IRPF sino la unidad de convivencia (matrimonios, parejas de hecho, inscritas o no) teniéndose que tener en cuenta los criterios de prorrateo que se indican en el apartado de requisitos siguiente.",
      "El importe total de las cantidades satisfechas se atribuirá en su totalidad al progenitor que figure como titular de la factura, salvo en el caso de matrimonio en régimen de gananciales en el que el importe satisfecho se distribuirá entre los cónyuges por partes iguales, con independencia de cuál de ellos figure como titular de la factura.",
      "Cuando más de un contribuyente tenga derecho a la aplicación de esa deducción con respecto a los mismos descendientes, su importe será prorrateado entre ellos.",
      "- El prorrateo de la deducción respecto a un mismo descendiente solo procederá cuando ambos padres satisfagan los gastos y tengan derecho a ella por cumplir todos los requisitos exigidos.",
      "- A efectos de la aplicación de la deducción, se entiende por unidad familiar la unidad de convivencia. Por ello en caso de matrimonios, parejas de hecho, inscritas o no, el límite de 400 euros se aplica a la suma de la deducción aplicable por todos los miembros de la familia, prorrateándose su importe en función de las cantidades satisfechas por cada uno de los progenitores.",
      "- Cuando fallezca uno de los padres a lo largo del año (al haber convivido con la familia hasta la fecha del fallecimiento) se procederá tambien al prorrateo. Asimismo, en el caso de padres separados o divorciados que tengan la guarda y custodia compartida de los hijos, si ambos padres satisfacen el gasto, el límite máximo es igualmente prorrateable.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_contribuyentes_viudos",
      nombreCatalogadoDesdeCodigo("extremadura_contribuyentes_viudos"),
      categoriaCatalogadaDesdeCodigo("extremadura_contribuyentes_viudos"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [339, 340],
      [
        "extremadura_contribuyentes_viudos:importe",
        "extremadura_contribuyentes_viudos:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 7. Deducción autonómica para los contribuyentes viudos.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "Que la suma de las bases imponibles general y del ahorro, casillas [0435] y [0460] de la declaración, no supere las siguientes cantidades:",
      "- 19.000 euros en tributación individual.",
      "- 24.000 euros en tributación conjunta.",
      "En el supuesto de que el contribuyente resida habitualmente en municipios y entidades locales menores con una población inferior a 3.000 habitantes:",
      "- 28.000 euros en tributación individual.",
      "- 45.000 euros en tributación conjunta.",
      "- La residencia habitual se determinará en base a los criterios definidos en el artículo 9 de la Ley del IRPF, pero circunscrito al ámbito del municipio o entidad local menor.",
      "Puede consultar los municipios y las entidades locales menores con una población inferior a 3.000 habitantes en los enlaces indicados al término de la presente deducción.",
      "Atención: en este supuesto b. no existirá ningún límite de bases para contribuyentes que:",
      "- formen parte de una familia que tenga la consideración legal de numerosa, o",
      "Las condiciones necesarias para la consideración de familia numerosa y su clasificación por categorías se determinarán con arreglo a lo establecido en la Ley 40/2003, de 18 de noviembre, de Protección a las Familias Numerosas (BOE de 19 de noviembre).",
      "- sean ascendientes separados legalmente, o sin vínculo matrimonial, con dos hijos sin derecho a percibir anualidades por alimentos y por los que tenga derecho a la totalidad del mínimo por descendientes previsto en la normativa del IRPF.",
      "No tendrán derecho a la aplicación de esta deducción los contribuyentes que hubieren sido condenados, en virtud de sentencia firme, por delitos de violencia de género contra el cónyuge fallecido.",
    ],
    limites: [
      "100 euros, con carácter general, para contribuyentes viudos.",
      "200 euros, si el contribuyente viudo tiene a su cargo uno o más descendientes que, de conformidad con el artículo 58 de la Ley IRPF, computan a efectos de aplicar el mínimo por descendientes.",
      "La deducción de 200 euros podrá aplicarse siempre que alguno de los descendientes dé derecho a aplicar el mínimo por descendientes y no perciba ningún tipo de renta.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      'Esta deducción resulta incompatible para el contribuyente en estado de viudedad con la aplicación de la deducción autonómica "Por trabajo dependiente".',
      "- Si tuviera derecho a ambas deducciones, el contribuyente podrá optar por la de mayor cuantía.",
      "- Esta incompatibilidad se refiere a una misma persona, pudiendo simultanearse, en tributación conjunta, esta deducción de viudedad del declarante con la deducción por rendimientos de trabajo de alguno de los hijos pertenecientes a la unidad familiar.",
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_vivienda_jovenes_victimas_terrorismo",
      nombreCatalogadoDesdeCodigo(
        "extremadura_vivienda_jovenes_victimas_terrorismo"
      ),
      categoriaCatalogadaDesdeCodigo(
        "extremadura_vivienda_jovenes_victimas_terrorismo"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [340, 343],
      [
        "extremadura_vivienda_jovenes_victimas_terrorismo:importe",
        "extremadura_vivienda_jovenes_victimas_terrorismo:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 8. Deducción autonómica por adquisición de vivienda para jóvenes y para víctimas del terrorismo con residencia en la Comunidad Autónoma de Extremadura.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "A efectos del artículo 13.1.f, primera vivienda exige no disponer ni haber dispuesto de un derecho de plena propiedad igual o superior al 50 por 100 sobre otra vivienda.",
      "La comprobación patrimonial se rige por el artículo 70.1 de la Ley del IRPF aplicable a 31 de diciembre de 2012: incremento patrimonial al menos igual a la inversión, excluidos intereses y demás gastos de financiación y variaciones de valor de bienes que permanezcan en el patrimonio.",
      "La aplicación de la deducción está condicionada al cumplimiento de los mismos requisitos y condiciones exigidos en relación con la deducción general por adquisición, rehabilitación de la vivienda habitual, base de deducción y límite máximo fijados por la normativa estatal en su redacción en vigor a 31 de diciembre de 2012, incluido el relativo a la comprobación de la situación patrimonial del contribuyente y, además, los siguientes:",
      "Debe tratarse de una vivienda nueva.",
      "Se considera vivienda nueva aquella cuya adquisición represente la primera transmisión de la misma con posterioridad a la declaración de obra nueva, siempre que no hayan transcurrido 3 años desde esta.",
      "La vivienda nueva debe estar acogida a las modalidades de protección pública contempladas en el artículo 23 de la Ley 3/2001, de 26 de abril, de la Calidad, Promoción y Acceso a la Vivienda en Extremadura, referidas a viviendas de protección oficial promovidas de forma pública o privada y viviendas de Promoción Pública. No será exigible este requisito cuando el porcentaje de deducción aplicable sea el 5 por 100.",
      "La Ley 3/2001, de 26 de abril, de la Calidad, Promoción y Acceso a la Vivienda en Extremadura, referidas a viviendas de protección oficial promovidas de forma pública o privada y viviendas de Promoción Pública se derogó, con efectos de 7 de mayo de 2019, por la disposición derogatoria única de la Ley 11/2019, de 11 de abril, de promoción y acceso a la vivienda de Extremadura (DOE 17-04-2019 - BOE 15-05- 2019).",
      "Según el artículo 27.2 de la citada Ley 11/2019, de 11 de abril, son viviendas protegidas de promoción pública:",
      "Las viviendas que, sin ánimo de lucro, promoviera la Administración Pública o cualquiera de sus organismos o empresas públicas dependientes, para satisfacer las necesidades de vivienda de los sectores de población que reglamentariamente se determinen.",
      "Aquellas viviendas cuya propiedad o usufructo adquieran, sin ánimo de lucro y para el mismo fin, la Administración Pública o sus organismos, entidades, empresas y sociedades dependientes.",
      "En el caso de que se extinga el usufructo, la vivienda protegida de promoción pública perderá su condición de tal.",
      "Los adquirentes deben ser jóvenes con residencia habitual en Extremadura, cuya edad, a la fecha de devengo del impuesto (normalmente, el 31 de diciembre) sea inferior a 36 años.",
      "El requisito de edad no resultará aplicable para quienes tengan la condición de víctimas del terrorismo o, en su defecto y por este orden, su cónyuge o pareja de hecho o los hijos que vinieran conviviendo con los mismos.",
      "Debe tratarse de su primera vivienda.",
      "La suma de la base imponible general y del ahorro, casillas [0435] y [0460] de la declaración, no debe ser superior a las siguientes cantidades:",
      "- 19.000 euros en tributación individual.",
      "- 24.000 euros en tributación conjunta.",
      "En el supuesto de que el contribuyente resida habitualmente en municipios y entidades locales menores con una población inferior a 3.000 habitantes:",
      "- 28.000 euros en tributación individual.",
      "- 45.000 euros en tributación conjunta.",
      "En caso de matrimonio, este límite de 45.000 euros se aplicará siempre que al menos uno de los cónyuges hubiera tenido su residencia habitual durante el período impositivo en alguno de los municipios o entidades locales menores con una población inferior a 3.000 habitantes.",
      "Puede consultar los municipios y las entidades locales menores con una población inferior a 3.000 habitantes en los enlaces indicados al término de la presente deducción.",
      "Atención: en este supuesto b. no existirá ningún límite de bases para contribuyentes que:",
      "- formen parte de una familia que tenga la consideración legal de numerosa, o",
      "Las condiciones necesarias para la consideración de familia numerosa y su clasificación por categorías se determinarán con arreglo a lo establecido en la Ley 40/2003, de 18 de noviembre, de Protección a las Familias Numerosas (BOE de 19 de noviembre).",
      "- sean ascendientes separados legalmente, o sin vínculo matrimonial, con dos hijos sin derecho a percibir anualidades por alimentos y por los que tenga derecho a la totalidad del mínimo por descendientes previsto en la normativa del IRPF.",
    ],
    limites: [
      "El 3 por 100 de las cantidades satisfechas durante el período impositivo, excluidos los intereses, para la adquisición o rehabilitación por jóvenes de una vivienda nueva situada en el territorio de la Comunidad Autónoma de Extremadura que constituya o vaya a constituir su primera residencia habitual.",
      "El 5 por 100 en caso de adquisición o rehabilitación por jóvenes de su vivienda habitual en cualquiera de los municipios o entidades locales menores de Extremadura con población inferior a 3.000 habitantes, siempre que la adquisición o rehabilitación se haya efectuado a partir de 1 de enero de 2015.",
      "Para víctimas del terrorismo:",
      "También podrán aplicar esta deducción, cualquiera que sea su edad, quienes tengan la condición de víctimas del terrorismo o, en su defecto, y por este orden, el cónyuge o pareja de hecho o los hijos que vinieran conviviendo con las mismas.",
      "Importante: la presente deducción no podrá duplicarse en aquellos supuestos en que las personas que tengan la consideración de víctimas del terrorismo también tengan la consideración de jóvenes (una edad inferior a 36 años).",
      "La base máxima de la deducción será de 9.040 euros, importe anual establecido como límite para la deducción de vivienda habitual contemplada por la normativa estatal del IRPF en la redacción en vigor a 31 de diciembre de 2012.",
      "Precisión: formarán parte de la base de deducción los conceptos fijados en la normativa estatal del IRPF, a excepción de los intereses satisfechos.",
    ],
    prorrateo: [],
    compatibilidades: [
      'La presente deducción resulta compatible con la aplicación de la deducción autonómica "Por intereses de financiación ajena para la inversión en vivienda habitual para jóvenes" sin que, como consecuencia de ello, la cuota líquida se haga negativa.',
      'La deducción resulta asimismo incompatible, para un mismo contribuyente, con la aplicación de la deducción autonómica "Por adquisición o rehabilitación de la vivienda habitual en zonas rurales".',
    ],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_arrendadores_viviendas_vacias",
      nombreCatalogadoDesdeCodigo("extremadura_arrendadores_viviendas_vacias"),
      categoriaCatalogadaDesdeCodigo(
        "extremadura_arrendadores_viviendas_vacias"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [346, 349],
      [
        "extremadura_arrendadores_viviendas_vacias:importe",
        "extremadura_arrendadores_viviendas_vacias:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9 bis. Deducción autonómica para arrendadores de viviendas vacías.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "Que la vivienda arrendada esté situada en Extremadura.",
      "Que haya estado vacía y en desuso durante al menos un año antes de la formalización del contrato y se destine a ser la vivienda habitual del arrendatario.",
      "- El plazo mínimo de un año en el que el inmueble debe estar vacío se computará de fecha a fecha, sin perjuicio de que durante una parte del periodo impositivo anterior el inmueble no haya tenido la consideración de vivienda vacía.",
      "A estos efectos, se entenderá que la vivienda ha estado vacía y en desuso cuando haya generado imputaciones de renta inmobiliaria en los términos establecidos en el artículo 85 de la Ley del IRPF.",
      "El concepto de vivienda habitual se ajustará a lo previsto en la disposición adicional vigesimotercera de la citada Ley del IRPF.",
      "- En el caso de que la duración final del arrendamiento fuera inferior a 3 años, salvo las excepciones tasadas entre las que no se incluye el desistimiento por el arrendatario ni los supuestos de finalización del contrato por el arrendador previstos en la LAU (incumplimiento en el pago de la renta, impago de la fianza, etc.), no tendría la consideración de vivienda habitual, por lo que se perdería el derecho a la deducción teniendo que reintegrar, en su caso, las cuantías ya deducidas, en los términos indicados en párrafos inferiores.",
      "Que la duración del contrato de arrendamiento sea igual o superior a tres años.",
      "- Se entiende cumplido este requisito cuando la duración inicial establecida en el contrato de arrendamiento hubiera sido por un plazo inferior al plazo mínimo de duración de tres años (o no se hubiera estipulado plazo de duración, o este fuese indeterminado) y con el sistema de prórrogas anuales obligatorias se alcance el mínimo de tres años de duración.",
      "- No se entiende cumplido el requisito si el contrato de alquiler no cumple la duración mínima prevista en la norma, pero la misma vivienda pasa a estar en situación de expectativa de alquiler y vuelve a ser objeto de un nuevo contrato de arrendamiento de vivienda con posterioridad a la finalización del anterior contrato, de forma que la suma de los periodos de duración de ambos contratos de arrendamiento sea de al menos tres años.",
      "No obstante, si el contrato de arrendamiento se formalizó por una duración de tres o más años y posteriormente se produce el fallecimiento del arrendatario antes de que transcurra dicho plazo o concurre alguno de los supuestos previstos en la normativa del",
      "IRPF que no determinen la pérdida de la condición de vivienda habitual, no se entenderá incumplido el requisito anterior.",
      "Que no se tenga la propiedad o el usufructo sobre más de tres viviendas, excluidas plazas de garaje y trasteros, cualquiera que sea el porcentaje de titularidad.",
      "- A efectos del límite del número máximo de viviendas es indiferente dónde se ubiquen.",
      "- En tributación conjunta el cómputo del número máximo de viviendas debe realizarse por contribuyente.",
      "Que los arrendadores declaren en el IRPF el rendimiento derivado del arrendamiento como rendimientos del capital inmobiliario.",
      "El importe de la deducción se calculará sobre los rendimientos netos reducidos obtenidos por el arrendamiento y declarados por el contribuyente en su autoliquidación, no siendo aplicable si se iniciara un procedimiento de verificación de datos, de comprobación limitada o de inspección que tuviera por objeto la comprobación de los rendimientos de capital inmobiliario o de la deducción que terminara con su regularización.",
      "En caso de arrendamiento de vivienda, plaza de garaje y trastero, adquiridos conjuntamente, procede aplicar la deducción sobre todo el rendimiento neto reducido obtenido, sin que deba excluirse de la base de la deducción la parte proporcional del rendimiento neto reducido que corresponda a la plaza de garaje y al trastero.",
      "Importante: los requisitos señalados deberán cumplirse en el momento de celebrar el contrato de arrendamiento, siendo la deducción aplicable mientras éstos se sigan cumpliendo.",
      "En caso de incumplimiento de los requisitos establecidos, el contribuyente deberá proceder a la regularización de las deducciones previamente practicadas en los términos establecidos en la normativa vigente del IRPF.",
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo será automáticamente trasladada al apartado “Información adicional a la deducción autonómica de Canarias por la puesta de viviendas en el mercado de arrendamiento de viviendas habituales, de Cantabria por el arrendamiento de viviendas vacías, de Extremadura para arrendadores de viviendas vacías, de Galicia por el arrendamiento de viviendas vacías y de Madrid por el arrendamiento de viviendas vacías" del Anexo B.13 de la declaración.',
    ],
    limites: [
      "El 100 por 100 del rendimiento neto reducido obtenido por el arrendamiento de viviendas que hayan estado en desuso.",
      "Límite máximo de la deducción: 1.200 euros por contribuyente.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler",
      nombreCatalogadoDesdeCodigo(
        "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler"
      ),
      categoriaCatalogadaDesdeCodigo(
        "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [349, 351],
      [
        "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler:importe",
        "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9 ter. Deducción autonómica por inversiones en la rehabilitación de viviendas en zonas rurales para ser destinadas a su alquiler.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "El censo de núcleos diferenciados del artículo 9 quater y anexo, incorporados por la Ley 1/2025 con efectos desde el 1 de enero de 2025, se aplica exclusivamente al beneficio del artículo 9 ter. No amplía las deducciones de los artículos 8, 9, 11 bis, 11 ter ni las excepciones del artículo 12 bis. Su actualización corresponde por resolución a la Consejería competente en reto demográfico.",
      "La rehabilitación del artículo 20.Uno.22.B de la Ley del IVA exige que más del 50 por 100 del coste del proyecto corresponda a consolidación o tratamiento de estructuras, fachadas o cubiertas u obras análogas o conexas, y que el coste total exceda del 25 por 100 del precio de adquisición en los dos años anteriores o del valor de mercado, descontando el suelo.",
      "Que no se dediquen a la promoción inmobiliaria ni al arrendamiento de viviendas en los términos del artículo 27 de la Ley del IRPF, siendo la rehabilitación o el alquiler objeto de su actividad.",
      "Que la vivienda esté situada en alguno de los municipios y entidades locales menores en los que la población de derecho a 31 de diciembre del ejercicio del devengo sea inferior a 3.000 habitantes, así como en núcleos de población diferenciados que formen parte del Censo que se apruebe por la Comunidad Autónoma de Extremadura a efectos de beneficios fiscales.",
      "Puede consultar los municipios y las entidades locales menores con una población inferior a 3.000 habitantes y los núcleos de población diferenciados que no son ninguno de los anteriores y que pertenecen a un municipio de más de 3.000 habitantes y sus diseminados en los enlaces indicados al término de la presente sección.",
      "Que el inmueble sea destinado a ser la vivienda habitual del arrendatario.",
      "El concepto de vivienda habitual se ajustará a lo previsto en la disposición adicional vigesimotercera de la Ley del IRPF.",
      "Que durante los cinco años siguientes a la realización de las actuaciones de rehabilitación la vivienda se encuentre arrendada a personas distintas del cónyuge, ascendientes, descendientes o familiares hasta el tercer grado de parentesco del propietario de la vivienda, sin perjuicio de lo previsto el punto siguiente.",
      "El límite debe entenderse establecido tanto a relaciones de parentesco por consanguinidad como por afinidad.",
      "Si durante los cinco años previstos en el punto anterior se produjeran periodos en los que la vivienda no estuviera efectivamente arrendada por causas no imputables al arrendador, pero se encuentre ofertada para el alquiler, la deducción prevista en este artículo se calculará de forma proporcional al número de días del periodo impositivo en el que se cumplan los requisitos señalados anteriormente.",
      "Es necesario, por lo tanto, que el contribuyente declare en el IRPF rendimientos del capital inmobiliario por el arrendamiento de la vivienda.",
      "Se entenderá que la vivienda ha estado ofertada para el alquiler siempre que, durante dicho periodo, haya estado desocupada y disponible para su arrendamiento, se haya anunciado para su alquiler como vivienda habitual en uno o varios portales inmobiliarios de internet o en una o varias agencias inmobiliarias, pudiendo acreditar tanto el anuncio como las condiciones en que se ofertó, a requerimiento de la Administración tributaria, y sin que el precio o la renta anual ofertada pueda exceder del 30 por 100 de la renta media de los hogares del municipio en el que radique según los últimos datos publicados por el INE a la fecha del devengo.",
      "En caso de incumplimiento de los requisitos establecidos, el contribuyente deberá proceder a la regularización de las deducciones previamente practicadas en los términos establecidos en la normativa vigente del IRPF.",
      "Censo de núcleos de población (194 KB - pdf )",
    ],
    limites: [
      "El 15 por 100 de las cantidades invertidas durante el período impositivo en actuaciones de rehabilitación de viviendas en zonas rurales para ser destinadas a su alquiler.",
      "Tendrán la consideración de obras de rehabilitación las que se ajusten a lo establecido en el artículo 20.Uno.22º de la Ley del IVA.",
      "La base de esta deducción estará constituida por las cantidades satisfechas para la rehabilitación de la vivienda y, en el caso de financiación ajena, la amortización, los intereses, el coste de los instrumentos de cobertura del riesgo de tipo de interés variable de los préstamos hipotecarios regulados en el artículo decimonoveno de la Ley 36/2003, de 11 de noviembre, de Medidas de Reforma Económica, y demás gastos derivados de la misma. En caso de aplicación de los citados instrumentos de cobertura, los intereses satisfechos por el contribuyente se minorarán en las cantidades obtenidas por la aplicación del citado instrumento.",
      "La base máxima total de la deducción, por contribuyente y vivienda rehabilitada, será de 180.000 euros o el importe de la rehabilitación de la vivienda que da origen a la deducción, si este fuera menor.",
      "La base máxima aplicable en cada ejercicio será de 9.040 euros por declaración.",
      "Importante: en el caso de que se hubiera reconocido el derecho a percibir alguna subvención o ayuda pública relacionada con la rehabilitación, su importe no formará parte de la base de deducción.",
      "Procederá restar:",
      "- el total de la subvención o ayuda, de la inversión total, para calcular la base máxima total de la deducción y al resultado, en su caso, aplicar el límite de 180.000 euros;",
      "- el importe de la subvención o ayuda percibido en el ejercicio, de la inversión efectuada en el año, para determinar la base máxima aplicable en el ejercicio y al resultado, en su caso, aplicar el límite de 9.040 euros.",
    ],
    prorrateo: [
      "En caso de que el cobro de la subvención se produzca en un solo pago su importe se prorrateará durante los ejercicios en los que se realice la rehabilitación.",
      "Cuando dos o más contribuyentes tengan derecho a la aplicación de esta deducción respecto a una misma vivienda y para un mismo período impositivo, el coste de la rehabilitación se prorrateará entre ellos según el porcentaje de titularidad, salvo acreditación de un reparto distinto de dicho coste.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_material_escolar",
      nombreCatalogadoDesdeCodigo("extremadura_material_escolar"),
      categoriaCatalogadaDesdeCodigo("extremadura_material_escolar"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [351, 352],
      [
        "extremadura_material_escolar:importe",
        "extremadura_material_escolar:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 10. Deducción autonómica por la compra de material escolar.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "La compra de material escolar debe ir destinada a hijos o descendientes en edad escolar obligatoria por los que se tenga derecho al mínimo por descendientes regulado en la Ley del IRPF.",
      "Se entenderá cumplido este requisito cuando el hijo o descendiente tenga una edad comprendida entre los 6 y 15 años en la fecha de devengo del impuesto.",
      "Solo tendrán derecho a practicar la deducción los padres o ascendientes que convivan con sus hijos o descendientes escolarizados.",
      "Que las suma de las bases imponibles general y del ahorro, casillas [0435] y [0460] de la declaración de la declaración, no supere las siguientes cantidades:",
      "- 19.000 euros en tributación individual.",
      "- 24.000 euros en tributación conjunta.",
      "En el supuesto de que el contribuyente resida habitualmente en municipios y entidades locales menores con una población inferior a 3.000 habitantes:",
      "- 28.000 euros en tributación individual.",
      "- 45.000 euros en tributación conjunta.",
      "- En caso de matrimonio, este límite de 45.000 euros se aplicará siempre que al menos uno de los cónyuges hubiera tenido su residencia habitual durante el período impositivo en alguno de los municipios o entidades locales menores con una población inferior a 3.000 habitantes.",
      "- La residencia habitual se determinará en base a los criterios definidos en el artículo 9 de la Ley del IRPF, pero circunscrito al ámbito del municipio o entidad local menor.",
      "Puede consultar los municipios y las entidades locales menores con una población inferior a 3.000 habitantes en los enlaces indicados al término de la presente deducción.",
      "Atención: en este supuesto b. no existirá ningún límite de bases para contribuyentes que:",
      "- formen parte de una familia que tenga la consideración legal de numerosa, o",
      "Las condiciones necesarias para la consideración de familia numerosa y su clasificación por categorías se determinarán con arreglo a lo establecido en la Ley 40/2003, de 18 de noviembre, de Protección a las Familias Numerosas (BOE de 19 de noviembre).",
      "- sean ascendientes separados legalmente, o sin vínculo matrimonial, con dos hijos sin derecho a percibir anualidades por alimentos y por los que tenga derecho a la totalidad del mínimo por descendientes previsto en la normativa del IRPF.",
    ],
    limites: [
      "15 euros por compra de material escolar para cada hijo o descendiente a cargo del contribuyente.",
    ],
    prorrateo: [
      "Cuando un hijo o descendiente conviva con ambos padres o ascendientes el importe de la deducción se prorrateará por partes iguales en la declaración de cada uno de ellos, en el caso de que optaran por tributación individual.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_inversion_acciones_participaciones_mercantiles",
      nombreCatalogadoDesdeCodigo(
        "extremadura_inversion_acciones_participaciones_mercantiles"
      ),
      categoriaCatalogadaDesdeCodigo(
        "extremadura_inversion_acciones_participaciones_mercantiles"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [352, 354],
      [
        "extremadura_inversion_acciones_participaciones_mercantiles:importe",
        "extremadura_inversion_acciones_participaciones_mercantiles:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 11. Deducción autonómica por inversión en la adquisición de acciones y participaciones sociales como consecuencia de acuerdos de constitución de sociedades o ampliación de capital en las sociedades mercantiles.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "El artículo 4.Ocho.Dos.a de la Ley del Impuesto sobre el Patrimonio considera gestión patrimonial, con sus excepciones expresas, que durante más de 90 días del ejercicio social más de la mitad del activo esté constituido por valores o no esté afecto a actividades económicas.",
      "Las cantidades que sirven de base a esta deducción autonómica no forman parte de la base de la deducción estatal por inversión en empresas de nueva o reciente creación, conforme al artículo 68.1 de la Ley del IRPF.",
      "Que, como consecuencia de la participación adquirida por el contribuyente, computada junto con la que posean de la misma entidad su cónyuge o personas unidas al contribuyente por razón de parentesco, en línea directa o colateral, por consanguinidad o afinidad hasta el tercer grado incluido, no se llegue a poseer durante ningún día del año natural más del 40 por 100 del total del capital social de la entidad o de sus derechos de voto.",
      "Que las participaciones adquiridas han de mantenerse en el patrimonio del contribuyente durante un período mínimo de tres años, siguientes a la constitución o ampliación y este no debe ejercer funciones ejecutivas ni de dirección en la entidad.",
      "Que la entidad de la que se adquieran las acciones o participaciones cumpla los siguientes requisitos:",
      "Que tenga su domicilio social y fiscal en la Comunidad Autónoma de Extremadura. 1.",
      "Que desarrolle una actividad económica.",
      "A estos efectos no se considerará que desarrolla una actividad económica cuando tenga por actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo establecido en el artículo 4.Ocho.Dos.a) de la Ley 19/1991, de 6 de junio, del Impuesto sobre el Patrimonio.",
      "Que, para el caso en que la inversión efectuada corresponda a la constitución de la entidad, desde el primer ejercicio fiscal esta cuente al menos con una persona con contrato laboral a jornada completa, o con dos personas con contrato laboral a tiempo parcial, siempre que el cómputo total de horas en el supuesto de contrato laboral a tiempo parcial sea igual o superior al establecido para una persona con contrato laboral a jornada completa. En cualquier caso, los trabajadores deberán estar dados de alta en el Régimen correspondiente de la Seguridad Social, y que se mantengan las condiciones del contrato durante al menos veinticuatro meses.",
      "Que, para el caso en que la inversión efectuada corresponda a una ampliación de capital de la entidad, dicha entidad hubiera sido constituida dentro de los tres años anteriores a la ampliación de capital y la plantilla media de la entidad durante los dos ejercicios fiscales posteriores al de la ampliación se incremente respecto de la plantilla media que tuviera en los doce meses anteriores al menos en una persona con los requisitos del párrafo 3.º anterior, y dicho incremento se mantenga durante al menos otros veinticuatro meses.",
      "Para el cálculo de la plantilla media total de la entidad y de su incremento se computará el número de personas empleadas, en los términos que disponga la legislación laboral, teniendo en cuenta la jornada contratada en relación con la jornada completa.",
      "Las operaciones en las que sea aplicable la deducción deben formalizarse en escritura pública, en la que se debe especificar la identidad de los inversores y el importe de la inversión respectiva.",
      "El incumplimiento de los requisitos y de las condiciones establecidas conlleva la pérdida del beneficio fiscal, y el contribuyente debe incluir en la declaración del IRPF correspondiente al ejercicio en el que se produjo el incumplimiento la parte del impuesto que se dejó de pagar como consecuencia de la deducción practicada junto con los intereses de demora devengados.",
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por inversión en la adquisición de acciones y participaciones sociales en entidades nuevas o de reciente creación de Andalucía, Aragón, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla y León, Castilla-La Mancha, Cataluña, Extremadura, Galicia, Madrid, Murcia y Comunitat Valenciana" del Anexo B.11 de la declaración.',
    ],
    limites: [
      "El 20 por 100 de las cantidades invertidas durante el ejercicio en la adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital en entidades que tengan naturaleza de Sociedad Anónima, Sociedad de Responsabilidad Limitada, Sociedad Anónima Laboral, Sociedad de Responsabilidad Limitada Laboral o Sociedad Cooperativas.",
      "El límite de deducción aplicable será de 4.000 euros anuales.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_vivienda_zonas_rurales",
      nombreCatalogadoDesdeCodigo("extremadura_vivienda_zonas_rurales"),
      categoriaCatalogadaDesdeCodigo("extremadura_vivienda_zonas_rurales"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [354, 358],
      [
        "extremadura_vivienda_zonas_rurales:importe",
        "extremadura_vivienda_zonas_rurales:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 11 bis. Deducción por adquisición o rehabilitación de la vivienda habitual en zonas rurales.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "Reserva temporal: el artículo 11 bis.1.b remite a adquisiciones o rehabilitaciones desde la entrada en vigor de la Ley 3/2022 (22 de marzo de 2022), mientras el Manual Renta 2025 indica 1 de enero de 2022 atendiendo a sus efectos fiscales. Las adquisiciones del 1 de enero al 21 de marzo de 2022 requieren resolver esta divergencia antes de aceptar la deducción.",
      "El censo de núcleos diferenciados del artículo 9 quater no amplía el ámbito territorial de esta deducción.",
      "Que la vivienda esté situada en alguno de los municipios y entidades locales menores de Extremadura en los que la población de derecho a 31 de diciembre sea inferior a 3.000 habitantes.",
      "Puede consultar los municipios y las entidades locales menores con una población inferior a 3.000 habitantes en los enlaces indicados al término de la presente deducción.",
      "Que la adquisición o rehabilitación de la vivienda se haya producido a partir del día 1 de enero de 2022.",
      "Cuando se adquiera una vivienda habitual habiendo disfrutado ya de esta misma deducción, la base máxima total de la deducción se minorará en las cantidades invertidas en la adquisición de las viviendas anteriores, en tanto hubieran sido objeto de deducción.",
      "Cuando con ocasión de la enajenación de una vivienda habitual por la que se hubiera practicado esta deducción se genere una ganancia patrimonial exenta por reinversión, la base de deducción por la adquisición o rehabilitación de la nueva vivienda se minorará en el importe de la ganancia patrimonial a la que se aplique la exención por reinversión. En este caso, no se podrá practicar deducción por la adquisición de la nueva mientras las cantidades invertidas en la misma no superen tanto el precio de la anterior, en la medida en que haya sido objeto de deducción, como la ganancia patrimonial exenta por reinversión.",
      "En los supuestos de nulidad matrimonial, divorcio o separación judicial, el contribuyente podrá seguir practicando esta deducción, en los términos previstos en la normativa estatal del IRPF, por las cantidades satisfechas en el período impositivo para la adquisición de la que fue durante la vigencia del matrimonio su vivienda habitual, siempre que continúe teniendo esta condición para los hijos comunes y el progenitor en cuya compañía queden.",
      "Vivienda habitual",
      "Con carácter general se considera vivienda habitual del contribuyente la edificación que constituya su residencia durante un plazo continuado de, al menos, tres años. No obstante, se entenderá que la vivienda tuvo el carácter de habitual cuando, a pesar de no haber transcurrido dicho plazo, se produzca el fallecimiento del contribuyente o concurran otras circunstancias que necesariamente exijan el cambio de domicilio, tales como celebración de matrimonio, separación matrimonial, traslado laboral, obtención del primer empleo, o cambio de empleo, u otras análogas justificadas. Para que la vivienda constituya la residencia habitual del contribuyente deberá ser habitada de manera efectiva y con carácter permanente por este, en un plazo de doce meses, contados a partir de la fecha de adquisición o terminación de las obras. No obstante, se entenderá que la vivienda no pierde el carácter de habitual cuando se produzca el fallecimiento del contribuyente o concurran otras circunstancias que necesariamente impidan la ocupación de la vivienda, en los términos previstos en el párrafo anterior. Cuando sean de aplicación las excepciones previstas en los dos párrafos anteriores, la deducción por adquisición de vivienda se practicará hasta el momento en que se den las circunstancias que necesariamente exijan el cambio de vivienda o impidan la ocupación de la misma.",
      "Adquisición de vivienda habitual",
      "Se entenderá por adquisición de vivienda habitual, la adquisición en sentido jurídico del derecho de propiedad o pleno dominio de la misma, aunque este sea compartido, siendo indiferente el negocio jurídico que la origine.",
      "Construcción y ampliación",
      "Se asimilan a la adquisición de vivienda la construcción o ampliación de la misma, en los siguientes términos:",
      "Ampliación de vivienda: Cuando se produzca el aumento de su superficie habitable, mediante cerramiento de parte descubierta o por cualquier otro medio, de forma permanente y durante todas las épocas del año.",
      "A efectos de determinar si el contribuyente tiene derecho a aplicar la deducción por ampliación de la vivienda habitual, se entenderá producida la adquisición en el momento en que se obtenga el certificado de fin de obra.",
      "Construcción: Cuando el contribuyente satisfaga directamente los gastos derivados de la ejecución de las obras, o entregue cantidades a cuenta al promotor de aquellas, siempre que finalicen en un plazo no superior a cuatro años desde el inicio de la inversión.",
      "A efectos de determinar si el contribuyente tiene derecho a aplicar la deducción, en los casos de construcción, se entenderá producida la adquisición de la vivienda habitual con el otorgamiento de la escritura pública de obra nueva terminada.",
      "Obras de rehabilitación de la vivienda habitual",
      "Se considerarán obras de rehabilitación de la vivienda habitual aquellas que tengan por objeto principal la reconstrucción de la vivienda mediante la consolidación y el tratamiento de las estructuras, fachadas o cubiertas y otras análogas siempre que el coste global de las operaciones de rehabilitación exceda del 25 por ciento del precio de adquisición si se hubiese efectuado esta durante los dos años inmediatamente anteriores al inicio de las obras de rehabilitación o, en otro caso, del valor de mercado que tuviera la vivienda en el momento de dicho inicio. A estos efectos, se descontará del precio de adquisición o del valor de mercado de la vivienda la parte proporcional correspondiente al suelo.",
    ],
    limites: [
      "El 10 por 100 de las cantidades satisfechas durante el período impositivo por la adquisición o rehabilitación de la vivienda que constituya o vaya a constituir la residencia habitual del contribuyente minoradas en el importe de las subvenciones recibidas de la Junta de Extremadura en concepto de subvenciones por la adquisición o rehabilitación de la",
      "La base de la deducción estará constituida por las cantidades satisfechas para la adquisición o rehabilitación de la vivienda, incluidos los gastos originados que hayan corrido a cargo del adquirente, y minorada en el importe de las subvenciones recibidas de la Junta de Extremadura en concepto de subvenciones por la adquisición o rehabilitación de la vivienda.",
      "Cuando la adquisición o rehabilitación de la vivienda se realicen con financiación ajena formarán parte de la base de deducción la amortización, los intereses, el coste de los instrumentos de cobertura del riesgo de tipo de interés variable de los préstamos hipotecarios regulados en el artículo decimonoveno de la Ley 36/2003, de 11 de noviembre, de Medidas de Reforma Económica, y demás gastos derivados de la misma. En caso de aplicación de los citados instrumentos de cobertura, los intereses satisfechos por el contribuyente se minorarán en las cantidades obtenidas por la aplicación del citado instrumento.",
      "Base máxima total por todos los ejercicios en que se aplique la deducción:",
      "Será la menor de las siguientes cantidades:",
      "180.000 euros, o",
      "El importe de adquisición o rehabilitación de la vivienda que da origen a la deducción, minorado por los importes recibidos de la Junta de Extremadura en concepto de subvenciones por la adquisición o rehabilitación de la vivienda.",
      "Base máxima en cada ejercicio: B.",
      "La base máxima a aplicar en cada ejercicio será de 9.040 euros, tanto en tributación individual como en tributación conjunta.",
      "La aplicación de esta deducción requerirá que el importe comprobado del patrimonio del contribuyente al finalizar el período de la imposición exceda del valor que arrojase su comprobación al comienzo del mismo al menos en la cuantía de las inversiones realizadas, sin computar los intereses y demás gastos de financiación.",
      "A estos efectos, no se computarán los incrementos o disminuciones de valor experimentados durante el período impositivo por los elementos patrimoniales que al final del mismo sigan formando parte del patrimonio del contribuyente.",
      "Véase en el capítulo 16 de la Parte 1 de este Manual la comprobación de la situación patrimonial.",
    ],
    prorrateo: [
      "Precisión: el importe de base máxima total se aplica por vivienda, no por contribuyente, por lo que en caso de viviendas adquiridas por varios contribuyentes la cuantía de 180.000 euros, establecida para determinar la base máxima de la deducción, se prorrateará en proporción al porcentaje de titularidad que tengan en la referida vivienda.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      'Esta deducción no podrá simultanearse, para un mismo contribuyente, con la aplicación de las deducciones autonómicas "Por adquisición o rehabilitación de vivienda habitual para jóvenes y para víctimas del terrorismo" y "Por intereses de financiación ajena para la inversión en vivienda habitual para jóvenes".',
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_residencia_municipios_menos_3000",
      nombreCatalogadoDesdeCodigo(
        "extremadura_residencia_municipios_menos_3000"
      ),
      categoriaCatalogadaDesdeCodigo(
        "extremadura_residencia_municipios_menos_3000"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [358, 359],
      [
        "extremadura_residencia_municipios_menos_3000:importe",
        "extremadura_residencia_municipios_menos_3000:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 11 ter. Deducción en la cuota íntegra autonómica para los contribuyentes con residencia habitual en municipios y entidades locales menores de Extremadura con población inferior a 3.000 habitantes.; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "En 2025, la excepción familiar del artículo 12 bis no comprende el artículo 11 ter: se mantienen los límites de 28.000 y 45.000 euros. El censo de núcleos del artículo 9 quater no amplía esta deducción.",
      "Que el contribuyente resida habitualmente en alguno de los municipios y entidades locales menores de Extremadura en los que la población sea inferior a 3.000 habitantes.",
      "Puede consultar los municipios y las entidades locales menores con una población inferior a 3.000 habitantes en los enlaces indicados al término de la presente deducción.",
      "Que la suma de la base imponible general y del ahorro, casillas [0435] y [0460] de la declaración, no debe ser superior a:",
      "- 28.000 euros en tributación individual.",
      "- 45.000 euros en tributación conjunta.",
      "En caso de matrimonio, este límite de 45.000 euros se aplicará siempre que al menos uno de los cónyuges hubiera tenido su residencia habitual durante el período impositivo en alguno de los municipios o entidades locales menores con una población inferior a 3.000 habitantes.",
      "En caso de tributación conjunta, el importe de la deducción será la que corresponda al contribuyente con derecho a la misma, resultante de aplicar el 15 por 100 sobre la parte de cuota íntegra autonómica que le corresponda, calculada conforme al siguiente procedimiento:",
      "Cuota íntegra autonómica en tributación conjunta x (base liquidable total del contribuyente en tributación individual ÷ ∑ bases liquidables totales en tributación individual de todos los contribuyentes integrados en la unidad familiar)",
    ],
    limites: ["El 15 por 100 de la cuota íntegra autonómica"],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_intereses_vivienda_jovenes",
      nombreCatalogadoDesdeCodigo("extremadura_intereses_vivienda_jovenes"),
      categoriaCatalogadaDesdeCodigo("extremadura_intereses_vivienda_jovenes"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [359, 360],
      [
        "extremadura_intereses_vivienda_jovenes:importe",
        "extremadura_intereses_vivienda_jovenes:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 11 quater; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "La base máxima de 1.000 euros limita los intereses deducibles; al 25 por 100, la deducción máxima es de 250 euros.",
      "Primera vivienda: no disponer ni haber dispuesto de plena propiedad igual o superior al 50 por 100 sobre otra vivienda, conforme al artículo 13.1.f.",
      "La comprobación patrimonial del artículo 70.1 de la Ley del IRPF en su redacción aplicable a 31 de diciembre de 2012 excluye intereses, gastos de financiación y meras variaciones de valor. En 2025 el artículo 12 bis no elimina el límite de renta de esta deducción.",
      "Que el contribuyente tenga su residencia habitual en la Comunidad Autónoma de Extremadura.",
      "Que a la fecha de devengo del impuesto el contribuyente tenga menos de 36 años.",
      "Que se trate de su primera vivienda.",
      "Que la suma de las bases imponibles general y del ahorro, casillas [0435] y [0460] de la declaración, no supere las siguientes cuantías:",
      "- 28.000 euros en tributación individual, y",
      "- 45.000 euros en tributación conjunta.",
      "Se exige el requisito de la comprobación de la situación patrimonial del contribuyente conforme a la normativa estatal vigente a 31 de diciembre de 2012.",
      "Véase en el capítulo 16 de la Parte 1 de este Manual la comprobación de la situación patrimonial.",
    ],
    limites: [
      "El 25 por 100 de los intereses satisfechos durante el período impositivo por préstamos hipotecarios obtenidos para financiar la adquisición de su vivienda habitual, con una base de deducción máxima de 1.000 euros anuales.",
      "A estos efectos, téngase en cuenta que el concepto de adquisición será el fijado por la normativa estatal vigente a 31 de diciembre de 2012 para la deducción por inversión en vivienda habitual.",
    ],
    prorrateo: [],
    compatibilidades: [
      'La presente deducción resulta compatible con la aplicación de la deducción autonómica "Por adquisición o rehabilitación de vivienda para jóvenes y para víctimas del terrorismo" sin que, como consecuencia de ello, la cuota líquida se haga negativa.',
      'La deducción resulta asimismo incompatible, para un mismo contribuyente, con la aplicación de la deducción autonómica "Por adquisición o rehabilitación de la vivienda habitual en zonas rurales".',
    ],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_donaciones_entidades_culturales_deportistas",
      nombreCatalogadoDesdeCodigo(
        "extremadura_donaciones_entidades_culturales_deportistas"
      ),
      categoriaCatalogadaDesdeCodigo(
        "extremadura_donaciones_entidades_culturales_deportistas"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [360, 361],
      [
        "extremadura_donaciones_entidades_culturales_deportistas:importe",
        "extremadura_donaciones_entidades_culturales_deportistas:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 11 quinquies; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "El deportista del artículo 21.2 de la Ley 39/2022 debe ejercer profesionalmente por cuenta propia, percibir retribuciones de terceros distintos de sus entidades deportivas que no sean mera compensación de gastos o premios, y estar o deber estar de alta en el régimen correspondiente de la Seguridad Social. La práctica aficionada por sí sola no cumple esta remisión.",
      "Las donaciones deberán ser puras, simples e irrevocables, formalizarse por escrito y dejar constancia expresa de tal carácter en el documento que recoja la donación.",
      "No darán derecho a la deducción las donaciones realizadas por quien tenga la condición de socio, asociado o partícipe de la entidad beneficiaria, o por el cónyuge, pareja de hecho, ascendiente o descendiente de cualquiera de ellos, siempre que tengan una cuota de participación en el capital igual o superior al 50 por 100, ya sea computada de manera individual o conjunta con su cónyuge, ascendiente o descendiente.",
      "Tampoco darán derecho a la deducción las donaciones realizadas a los deportistas contemplados en el artículo 21.2 de la Ley 39/2022, de 30 de diciembre, del Deporte, cuando se efectúen por quien tenga la condición de cónyuge, pareja de hecho, ascendiente o descendiente del beneficiario.",
    ],
    limites: [
      "El 20 por 100 de las cantidades donadas durante el ejercicio por los contribuyentes con residencia habitual en Extremadura a:",
      "Entidades con domicilio fiscal en Extremadura que desarrollen en el territorio de la Comunidad Autónoma alguna de las siguientes actividades:",
      "La cinematografía, las artes audiovisuales y las artes multimedia. a.",
      "Las artes escénicas, la música, la danza, el teatro y el circo. b.",
      "Las artes plásticas o bellas artes, la fotografía y el diseño. c.",
      "Ediciones literarias, fonográficas y cinematográficas, en cualquier soporte o formato. d.",
      "Las relacionadas con la investigación, documentación, conservación, restauración, recuperación, difusión y promoción del patrimonio cultural material e inmaterial de Extremadura.",
      "El folclore y las tradiciones populares, especialmente la música popular y las danzas tradicionales. f.",
      "Las artes aplicadas como la orfebrería y cerámica artesanal. g.",
      "Atención: Las entidades donatarias que no estén obligadas a presentar ante la AEAT la declaración informativa prevista en el artículo 24.2 de la Ley 49/2002, de 23 de diciembre, de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo deberán comunicar a la Consejería competente en materia de Hacienda las donaciones percibidas en cada año natural, facilitando el código CNAE de la",
      "actividad desarrollada que da derecho a la deducción, así como el nombre, apellidos, número de identificación fiscal de los donantes y el importe donado por cada uno de ellos.",
      "Esta comunicación se efectuará en el mes de enero de cada año a través de la Sede Electrónica de la Junta de Extremadura y se referirá a las donaciones percibidas en el año inmediato anterior.",
      "Deportistas con domicilio fiscal en Extremadura que se dediquen voluntariamente y de manera habitual a la práctica deportiva de acuerdo con lo establecido en el apartado segundo del artículo 21 de la Ley 39/2022, de 30 de diciembre, del Deporte, o norma que la sustituya.",
      "Se establece un límite máximo de 500 euros anuales por contribuyente.",
      "Se trata de un límite máximo conjunto para las 2 deducciones anteriores.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_traslado_residencia_habitual",
      nombreCatalogadoDesdeCodigo("extremadura_traslado_residencia_habitual"),
      categoriaCatalogadaDesdeCodigo(
        "extremadura_traslado_residencia_habitual"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [361, 363],
      [
        "extremadura_traslado_residencia_habitual:importe",
        "extremadura_traslado_residencia_habitual:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 11 sexies; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "Que los contribuyentes trasladen su residencia habitual a Extremadura a partir del 1 de enero de 2025.",
      "A estos efectos, se entenderá que se produce el traslado de la residencia habitual cuando el contribuyente pase a tener su residencia habitual en Extremadura en los términos previstos en el artículo 72 de la Ley del IRPF.",
      "En caso de tributación conjunta, cuando los contribuyentes integrados en una unidad familiar tuvieran su residencia habitual en Comunidades Autónomas distintas, podrán aplicarse esta deducción siempre que se traslade a Extremadura el miembro de dicha unidad familiar con mayor base liquidable de acuerdo con las reglas de individualización de impuesto.",
      "En el supuesto anterior procederá aplicar el porcentaje de deducción que corresponda sobre la totalidad de la cuota íntegra autonómica de la declaración conjunta.",
      "Que mantengan la residencia habitual en Extremadura de manera continuada durante al menos tres años desde que se produzca el cambio.",
      "Si se produce el fallecimiento del contribuyente antes de que transcurra dicho plazo o concurre alguno de los supuestos previstos en la normativa del IRPF que no determinen la pérdida de la condición de vivienda habitual, no se entenderá incumplido el requisito anterior.",
      "La deducción resultará aplicable en el periodo impositivo en el que se produzca el traslado y en los dos ejercicios siguientes.",
      "Puesto que la norma exige que el contribuyente tenga menos de 36 años a fecha de devengo, para poder aplicar el porcentaje incrementado de deducción del 75 por 100 el requisito de edad ha de cumplirse en cada uno de los ejercicios en que se practique la deducción.",
      "En caso de incumplimiento de los requisitos establecidos, el contribuyente deberá proceder a la regularización de las deducciones previamente practicadas en los términos establecidos en la normativa vigente del IRPF.",
    ],
    limites: [
      "En general: el 50 por 100 de la cuota íntegra autonómica.",
      "En el caso de contribuyentes que tengan menos de 36 años a la fecha de devengo del IRPF: el 75 por 100 de la cuota íntegra autonómica.",
      "En caso de tributación conjunta, el requisito de edad deberá cumplirlo el contribuyente que traslade la residencia a Extremadura.",
      "En el supuesto anterior procederá aplicar el porcentaje de deducción del 75 por 100 sobre la totalidad de la cuota íntegra autonómica de la declaración conjunta.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_ayudas_subvenciones_ela",
      nombreCatalogadoDesdeCodigo("extremadura_ayudas_subvenciones_ela"),
      categoriaCatalogadaDesdeCodigo("extremadura_ayudas_subvenciones_ela"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [363, 363],
      [
        "extremadura_ayudas_subvenciones_ela:importe",
        "extremadura_ayudas_subvenciones_ela:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 11 septies; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "El importe de esta deducción será el resultado de aplicar los tipos medios de gravamen a la cuantía de la subvención o ayuda que se integre en la base liquidable.",
    ],
    limites: [
      "El importe de esta deducción será el resultado de aplicar los tipos medios de gravamen a la cuantía de la subvención o ayuda que se integre en la base liquidable.",
      "La deducción se podrá aplicar por los contribuyentes que hubiesen integrado en la base imponible general el importe correspondiente a una subvención o cualquier otra ayuda pública otorgada por la Comunidad Autónoma de Extremadura a enfermos de Esclerosis Lateral Amiotrófica.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "extremadura_enfermos_ela_familiares",
      nombreCatalogadoDesdeCodigo("extremadura_enfermos_ela_familiares"),
      categoriaCatalogadaDesdeCodigo("extremadura_enfermos_ela_familiares"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [363, 365],
      [
        "extremadura_enfermos_ela_familiares:importe",
        "extremadura_enfermos_ela_familiares:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 11 octies; Decreto Legislativo 1/2018, de 10 de abril; IRPF 2025.",
    requisitos: [
      "Podrán aplicar esta deducción:",
      "Los contribuyentes que hayan sido diagnosticados con Esclerosis Lateral Amiotrófica. 1.",
      "Los contribuyentes:",
      "cuyo cónyuge o pareja de hecho, siempre que convivan con él o estén a su cargo, haya sido diagnosticado con esta enfermedad; a.",
      "cuyo descendiente o ascendiente, que dé derecho a la aplicación del mínimo por descendiente o ascendiente, haya sido diagnosticado con esta enfermedad. b.",
      "Los supuestos contemplados en los apartados 1 y 2 anteriores son compatibles entre sí, pudiendo un mismo contribuyente tener derecho a la deducción por ambos conceptos: como diagnosticado de la enfermedad y como familiar de una persona afectada por dicha enfermedad.",
      "Adicionalmente, podrán aplicarse una deducción del mismo importe (2.000 euros) los contribuyentes indicados en el punto 2 anterior.",
    ],
    limites: ["2.000 euros anuales por contribuyente."],
    prorrateo: [
      "Cuando sean varios los contribuyentes con derecho a la deducción respecto de una misma persona, su importe se prorrateará entre ellos por partes iguales.",
      "Se reconoce el derecho a la deducción de 2.000 euros para el contribuyente diagnosticado con Esclerosis Lateral Amiotrófica (ELA) en todo caso, sin prorrateo.",
      "Si el contribuyente con ELA genera a su vez el derecho a la deducción a su cónyuge y a un ascendiente, al proceder dicho derecho de una misma persona, le corresponderán 1.000 euros a cada uno de ellos, por el prorrateo entre contribuyentes reconocidos en las letras a. y b. del punto 2 anterior.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const EXTREMADURA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...EXTREMADURA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  EXTREMADURA_TRABAJO_DEPENDIENTE_2025,
  EXTREMADURA_CUIDADO_FAMILIARES_DISCAPACIDAD_2025,
  EXTREMADURA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
