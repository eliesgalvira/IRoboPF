import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const CLM_NACIMIENTO_ADOPCION_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "clm_nacimiento_adopcion_hijos",
    "Por nacimiento o adopción de hijos",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 1 y 13 Ley 8/2013, de 21 de noviembre, de Medidas Tributarias de Castilla-La Mancha",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "100 euros por parto o adopción de un hijo; 500 euros por parto o adopción de dos hijos; 900 euros por parto o adopción de tres o más hijos",
  },
  requisitos: [
    "Que la suma de la base imponible general y la del ahorro, casillas [0435] y [0460] del contribuyente, no supere:",
    "- 27.000 euros en tributación individual.",
    "- 36.000 euros en tributación conjunta.",
    "Para la aplicación de esta deducción se tendrán en cuenta las normas para la aplicación del mínimo por descendientes, contenidas en la Ley del IRPF.",
    "No obstante, cuando dos o más contribuyentes tengan derecho a la aplicación de esta deducción respecto de los mismos descendientes y alguno de ellos no cumpla el requisito anterior, el importe de la deducción para los demás contribuyentes quedará reducido a la",
  ],
  limites: [
    "Por cada hijo nacido o adoptado en el período impositivo, que genere el derecho a la aplicación del mínimo por descendientes, las siguientes cantidades:",
    "100 euros en el caso de partos o adopciones de un hijo.",
    "500 euros en el caso de partos o adopciones de dos hijos.",
    "900 euros en el caso de partos o adopciones de tres o más hijos.",
    "Lo que genera el derecho a cada una de estas deducciones es el número de hijos en cada parto y no el número de nacimientos durante el ejercicio, de modo que, a título de ejemplo, si en el año se produce más de un parto corresponderá una deducción de 100 euros por cada uno si es de un solo hijo y si se produce un solo parto de dos hijos una deducción de 500 euros.",
  ],
  prorrateo: [
    "proporción que resulte de la aplicación de las normas para el prorrateo del mínimo por descendientes.",
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "partosOAdopcionesDelEjercicio",
    "numeroHijosPorPartoOAdopcion",
    "hijosGeneranMinimoDescendientes",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "numeroContribuyentesConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [239, 240],
  },
} as const satisfies FichaDeduccionAutonomica

export const CLM_FAMILIA_NUMEROSA_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "clm_familia_numerosa",
    "Por familia numerosa",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 2 y 13 Ley 8/2013, de 21 de noviembre, de Medidas Tributarias de Castilla-La Mancha",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "200 euros general y 400 euros especial; si cónyuge o descendiente con derecho al mínimo tiene discapacidad igual o superior al 65%, 300 euros general y 900 euros especial",
  },
  requisitos: [
    "El contribuyente debe tener reconocida la condición de familia numerosa, de conformidad con lo establecido en la Ley 40/2003, de 18 de noviembre, de Protección a las Familias Numerosas, en la fecha de devengo del impuesto (normalmente, el 31 de diciembre).",
    "De acuerdo con el artículo 5.1 de la Ley 40/2003, de 18 de noviembre, de Protección a las Familias Numerosas, la condición de familia numerosa se acreditará mediante el título oficial establecido al efecto.",
    "Que la suma de la base imponible general y la del ahorro, casillas [0435] y [0460] del contribuyente, no supere:",
    "- 27.000 euros en tributación individual.",
    "- 36.000 euros en tributación conjunta.",
    "Para la aplicación de esta deducción se tendrán en cuenta las normas para la aplicación del mínimo por descendientes y discapacidad contenidas en la Ley del IRPF.",
    "No obstante, cuando dos o más contribuyentes tengan derecho a la aplicación de esta deducción respecto de los mismos descendientes y alguno de ellos no cumpla el requisito anterior (esto es, cuando la suma de la base imponible general y la del ahorro, sea superior a 27.000 euros en tributación individual o a 36.000 euros en tributación conjunta),",
  ],
  limites: [
    "- 200 euros, cuando se trate de familia numerosa de categoría general.",
    "- 400 euros, cuando se trate de familia numerosa de categoría especial.",
    "Cuando alguno de los cónyuges o descendientes, a los que sea de aplicación el mínimo personal y familiar del IRPF, tenga un grado de discapacidad igual o superior al 65 por 100 y generen el derecho a la aplicación del mínimo por discapacidad, la deducción será:",
    "- 300 euros, cuando se trate de familia numerosa de categoría general.",
    "- 900 euros, cuando se trate de familia numerosa de categoría especial.",
  ],
  prorrateo: [
    "el importe de la deducción para los demás contribuyentes quedará reducido a la proporción que resulte de la aplicación de las normas para el prorrateo del mínimo por descendientes.",
  ],
  incompatibilidades: [
    "Esta deducción resulta incompatible con la aplicación de la deducción autonómica “Por arrendamiento de vivienda habitual por familias numerosas”.",
  ],
  entradaNecesaria: [
    "categoriaFamiliaNumerosa",
    "conyugeODependienteDiscapacidad65",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "numeroContribuyentesConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [240, 241],
  },
} as const satisfies FichaDeduccionAutonomica

export const CLM_DISCAPACIDAD_CONTRIBUYENTE_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "clm_discapacidad_contribuyente",
    "Por discapacidad del contribuyente",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 4 y 13 Ley 8/2013, de 21 de noviembre, de Medidas Tributarias de Castilla-La Mancha",
  cuantia: {
    tipo: "importe_fijo",
    euros: "300",
    por: "contribuyente con discapacidad acreditada igual o superior al 65%",
  },
  requisitos: [
    "Que la suma de la base imponible general y la del ahorro del contribuyente, casillas [0435] y [0460] de la declaración, no supere:",
    "- 27.000 euros en tributación individual.",
    "- 36.000 euros en tributación conjunta.",
    "Para la aplicación de esta deducción se tendrán en cuenta las normas para la aplicación del mínimo por contribuyente y discapacidad contenidas en la Ley del IRPF.",
  ],
  limites: [
    "300 euros por cada contribuyente que tenga un grado de discapacidad acreditado igual o superior al 65 por 100 y derecho a la aplicación del mínimo por discapacidad del contribuyente.",
  ],
  prorrateo: [],
  incompatibilidades: [
    "La presente deducción resulta incompatible con la aplicación de las siguientes deducciones autonómicas:",
    '"Por discapacidad de ascendientes o descendientes", respecto de una misma persona.',
    "En consecuencia, los descendientes con discapacidad que integren la unidad familiar generarán derecho en tributación conjunta a la aplicación de la deducción por discapacidad de descendientes y no a la deducción por discapacidad del contribuyente.",
    '"Para contribuyentes mayores de 75 años", respecto de la misma persona mayor de 75 años.',
    "En los supuestos en los que el contribuyente sea una persona mayor de 75 años con un grado de discapacidad acreditado igual o superior al 65 por 100, se aplicará esta deducción y no la establecida “Para contribuyentes mayores de 75 años”.",
    '"Por arrendamiento de vivienda habitual por personas con discapacidad".',
  ],
  entradaNecesaria: [
    "gradoDiscapacidadContribuyente",
    "derechoMinimoDiscapacidadContribuyente",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [247, 248],
  },
} as const satisfies FichaDeduccionAutonomica

export const CLM_DISCAPACIDAD_ASCENDIENTES_DESCENDIENTES_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "clm_discapacidad_ascendientes_descendientes",
    "Por discapacidad de ascendientes o descendientes",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 5 y 13 Ley 8/2013, de 21 de noviembre, de Medidas Tributarias de Castilla-La Mancha",
  cuantia: {
    tipo: "importe_fijo",
    euros: "300",
    por: "ascendiente o descendiente con discapacidad acreditada igual o superior al 65%",
  },
  requisitos: [
    "Que la suma de la base imponible general y la del ahorro del contribuyente, casillas [0435] y [0460] de la declaración, no supere:",
    "- 27.000 euros en tributación individual.",
    "- 36.000 euros en tributación conjunta.",
    "Para la aplicación de esta deducción se tendrán en cuenta las normas para la aplicación de los mínimos por ascendientes, descendientes y discapacidad contenidas en la Ley del IRPF.",
    "En los casos de tributación conjunta, la deducción aplicable por descendientes con discapacidad será siempre esta y no la deducción por discapacidad del contribuyente.",
  ],
  limites: [
    "300 euros por cada ascendiente o descendiente con un grado de discapacidad acreditado igual o superior al 65 por 100, que genere el derecho a la aplicación del mínimo por discapacidad de ascendientes o descendientes.",
  ],
  prorrateo: [
    "No obstante, cuando dos o más contribuyentes tengan derecho a la aplicación de esta deducción respecto de los mismos ascendientes o descendientes y alguno de ellos no cumpla el requisito anterior, el importe de la deducción para los demás contribuyentes quedará reducido a la proporción que resulte de la aplicación de las normas para el prorrateo del mínimo por ascendientes, descendientes y discapacidad.",
  ],
  incompatibilidades: [
    'Esta deducción resulta incompatible con la aplicación de la deducción autonómica "Por discapacidad del contribuyente" respecto de una misma persona.',
    "En consecuencia, los descendientes con discapacidad que integren la unidad familiar generarán derecho en tributación conjunta a la aplicación de la deducción por discapacidad de descendientes y no a la deducción por discapacidad del contribuyente.",
    'La deducción resulta asimismo incompatible con la aplicación de la deducción autonómica "Por el cuidado de ascendientes mayores de 75 años", respecto de la misma persona mayor de 75 aaños.',
    'En los supuestos en los que el ascendiente sea una persona mayor de 75 años con un grado de discapacidad acreditado igual o superior al 65 por ciento, se aplicará esta deducción y no la establecida “Por cuidado de ascendientes mayores de 75 años".',
  ],
  entradaNecesaria: [
    "numeroAscendientesDescendientesDiscapacidad65",
    "derechoMinimoDiscapacidadAscendientesDescendientes",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "numeroContribuyentesConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [248, 249],
  },
} as const satisfies FichaDeduccionAutonomica

export const CLM_MAYORES_75_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "clm_mayores_75",
    "Para contribuyentes mayores de 75 años",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "150",
      por: "contribuyente mayor de 75 años",
    },
    [
      "150 euros por contribuyente mayor de 75 años",
      "Base imponible general + ahorro máximo 27.000 euros individual y 36.000 conjunta",
    ],
    [249, 250]
  ),
  normativa:
    "Artículo 6. Deducciones para personas mayores de 75 años.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
  requisitos: [
    "No procederá la aplicación de estas deducciones cuando los mayores de 75 años que generen el derecho a las mismas, ya sea el contribuyente o el ascendiente, residan durante más de 30 días naturales del período impositivo en Centros Residenciales de Mayores de la Junta de Comunidades de Castilla-La Mancha o en plazas concertadas o",
    "subvencionadas por esta en otros centros, a excepción de las estancias temporales derivadas de convalecencias debidamente acreditadas por el Servicio de Salud de Castilla-La Mancha.",
    "Que la suma de la base imponible general y la del ahorro del contribuyente, casillas [0435] y [0460] de la declaración, no supere:",
    "- 27.000 euros en tributación individual.",
    "- 36.000 euros en tributación conjunta.",
    "Para la aplicación de estas deducciones se tendrán en cuenta las normas para la aplicación de los mínimos por contribuyente y por ascendientes contenidas en la Ley del IRPF.",
  ],
  limites: ["150 euros para los contribuyentes mayores de 75 años."],
  prorrateo: [],
  compatibilidades: [],
  incompatibilidades: [
    'Las deducciones "Para contribuyentes mayores de 75 años" y "Por el cuidado de ascendientes mayores de 75 años" resultan incompatibles, respectivamente, con la aplicación de las deducciones autonómicas "Por discapacidad del contribuyente" y "Por discapacidad de ascendientes", respecto de la misma persona mayor de 75 años.',
    'En los supuestos en los que la persona mayor de 75 años tenga un grado de discapacidad acreditado igual o superior al 65 por 100, se aplicarán las deducciones "Por discapacidad del contribuyente" o "Por discapacidad de ascendiente" que, en su calidad de contribuyente o de ascendiente del contribuyente, respectivamente, le corresponda.',
  ],
}

export const CLM_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_familia_monoparental",
      nombreCatalogadoDesdeCodigo("clm_familia_monoparental"),
      categoriaCatalogadaDesdeCodigo("clm_familia_monoparental"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [241, 242],
      ["clm_familia_monoparental:importe", "clm_familia_monoparental:cumple"],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 2 bis. Deducción por familia monoparental.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Concepto de familia monoparental a efectos de esta deducción.",
      "A los efectos de esta deducción, y sin perjuicio del concepto legal que pueda establecer la legislación básica estatal, o en su caso, la normativa regional, tendrá la consideración de familia monoparental la formada por la madre o el padre separados legalmente o sin vínculo matrimonial y las hijas e hijos que, de forma exclusiva, convivan y dependan económicamente de una u otro, y que reúnan alguno de los siguientes requisitos:",
      "Ser menores de edad, con excepción de las/los que, con el consentimiento de los padres, vivan independientes de estos. a.",
      "Ser mayores de edad que tengan establecidas alguna de las medidas de apoyo para el ejercicio de su capacidad jurídica de acuerdo con la legislación civil.",
      'Precisión: véase al respecto el Título XI del Libro Primero del Código Civil ("De las medidas de apoyo a las personas con discapacidad para el ejercicio de su capacidad jurídica") artículos 249 a 299 bis), ambos inclusive.',
      "Dicho Título XI ha sido a su vez modificado por la Ley 8/2021, de 2 de junio, por la que se reforma la legislación civil y procesal para el apoyo a las personas con discapacidad en el ejercicio de su capacidad jurídica, con efectos desde el 3 de septiembre de 2021.",
      'En cuanto a las medidas que incluye, de acuerdo con el artículo 250 del citado Título XI del Código Civil "las medidas de apoyo para el ejercicio de la capacidad jurídica de las personas que lo precisen son, además de las de naturaleza voluntaria, la guarda de hecho, la curatela y el defensor judicial".',
      "Se entenderá que hay dependencia económica de forma exclusiva, cuando la madre o el padre tenga derecho a la totalidad del mínimo por descendientes previsto en la Ley del IRPF, respecto de las hijas e hijos que integran la familia monoparental y no perciba anualidades por alimentos por las hijas e hijos.",
      "Se considera que existe familia monoparental, a efectos de esta deducción, cuando los requisitos de convivencia y dependencia económica se cumplan respecto de alguno de los hijos del contribuyente.",
      "En los supuestos de padre o madre separados legalmente o sin vínculo matrimonial, puede darse la situación de que parte de los hijos o hijas pueden convivir y depender económicamente de uno de los progenitores, y el resto pueden convivir y depender económicamente del otro. En ese caso, habría dos familias monoparentales a efectos de esta deducción, con derecho a aplicar la deducción siempre que cumplan los requisitos exigidos.",
      "Atención: en ningún caso se considerará familia monoparental la persona viuda o en situación equiparada que hubiere sido condenada, por sentencia firme, por la comisión de un delito doloso de homicidio en cualquiera de sus formas, cuando la víctima fuera su cónyuge o excónyuge o persona que hubiera estado ligada a ella por una análoga relación de afectividad.",
      "Que la suma de la base imponible general y la del ahorro, casillas [0435] y [0460] del contribuyente, no supere:",
      "- 27.000 euros en tributación individual.",
      "- 36.000 euros en tributación conjunta.",
      "Para la aplicación de esta deducción se tendrán en cuenta las normas para la aplicación del mínimo por descendientes contenidas en la Ley del IRPF.",
    ],
    limites: [
      "200 euros anuales que podrá aplicar el padre o la madre que a la fecha de devengo del impuesto formen parte de una familia monoparental.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Esta deducción resulta incompatible con la aplicación de la deducción autonómica “Por arrendamiento de vivienda habitual por familias monoparentales”.",
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_libros_idiomas_otros_gastos_educacion",
      nombreCatalogadoDesdeCodigo("clm_libros_idiomas_otros_gastos_educacion"),
      categoriaCatalogadaDesdeCodigo(
        "clm_libros_idiomas_otros_gastos_educacion"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [242, 243, 244, 245],
      [
        "clm_libros_idiomas_otros_gastos_educacion:importe",
        "clm_libros_idiomas_otros_gastos_educacion:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 3. Deducciones por gastos en la adquisición de libros de texto, por la enseñanza de idiomas y otros gastos relacionados con la educación.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Las deducciones resultantes de la aplicación de los apartados anteriores se minorarán en el importe de las becas y ayudas concedidas en el periodo impositivo de que se trate de la Administración de la Junta de Comunidades de Castilla-La Mancha, o de cualquier otra Administración Pública, que cubran la totalidad o parte de los gastos que dan derecho a deducción.",
      "Cuando los gastos correspondan a dos o más hijos se calculará de forma global el importe de las deducciones aplicables por todos los hijos y se minorará en el importe total de las becas y ayudas percibidas por todos ellos.",
      "A estos efectos téngase en cuenta que los límites establecidos para el cálculo de la deducción no se aplican individualmente a cada uno de los hijos, sino que a la deducción correspondiente a los gastos satisfechos por todos los hijos se le aplicará el límite resultante de multiplicar el límite individual establecido por el número de hijos que generan el derecho a la deducción.",
      "A los efectos de la aplicación de estas deducciones, solo tendrán derecho a practicar la deducción los padres o ascendientes respecto de aquellos hijos o descendientes escolarizados que den derecho a la reducción prevista, en concepto de mínimo por descendientes, en el artículo 58 de la Ley del IRPF.",
      "Los contribuyentes que deseen gozar de esta deducción deberán estar en posesión de los justificantes acreditativos del pago de los conceptos objeto de deducción.",
      "La justificación de los gastos que dan lugar a la deducción debe hacerse, con carácter prioritario, mediante factura. Ello sin perjuicio de la posibilidad de admitir otro tipo de justificantes (como podrían ser los tickets emitidos por el comercio minorista) que, conforme a Derecho, puedan tener tal carácter.",
      "Para la aplicación de esta deducción se tendrán en cuenta las normas para la aplicación del mínimo por descendientes contenidas en la Ley del IRPF.",
    ],
    limites: [
      "El 100 por 100 de las cantidades satisfechas, por los gastos destinados a la adquisición de libros de texto editados para las enseñanzas que ofrece el sistema educativo conforme al artículo 3.2 de la Ley Orgánica 2/2006, de 3 de mayo, de",
      "Educación, o norma que la sustituya.",
      "A estos efectos, dispone el citado artículo de la Ley Orgánica 2/2006, que “Las enseñanzas que ofrece el sistema educativo son las siguientes: a) Educación infantil, b) Educación primaria, c) Educación secundaria obligatoria, d) Bachillerato, e) Formación profesional, f) Enseñanzas de idiomas, g) Enseñanzas artísticas, h) Enseñanzas deportivas, i) Educación de personas adultas, y j) Enseñanza universitaria”.",
      "El 15 por 100 de las cantidades satisfechas durante el período impositivo, por cada una de las actividades que se relacionan a continuación, desarrolladas por sus hijos o descendientes durante las etapas correspondientes a las enseñanzas que ofrece el sistema educativo conforme al artículo 3.2 de la Ley Orgánica 2/2006, de 3 de mayo, o norma que la sustituya:",
      "1.º Por la enseñanza de idiomas recibida como actividad extraescolar.",
      "2.º Por aquellas actividades relacionadas con el aprendizaje fuera de los centros educativos como refuerzo o apoyo de las enseñanzas en las que estén matriculados.",
      "3.º Por los gastos de acceso a las nuevas tecnologías necesarios para las enseñanzas en las que estén matriculados los hijos o descendientes. A tal efecto, se considerarán únicamente las cuantías satisfechas como cuota de alta a internet y la cuota de línea del primer mes, siempre que no se trate de un cambio de compañía y la línea no esté vinculada a una actividad económica.",
      "4.º Por los gastos de estudio y residencia de hijos o descendientes fuera del municipio de residencia de la unidad familiar, siempre que el municipio donde se cursen los estudios se encuentre en Castilla-La Mancha y que en el lugar de residencia de la unidad familiar no exista dicha oferta educativa. Igualmente será aplicable esta deducción cuando el municipio donde se realicen los estudios se encuentre fuera de Castilla-La Mancha y no exista en la región oferta educativa para los estudios cursados.",
      "La cantidad a deducir por todos los gastos señalados anteriormente no excederá de las cuantías máximas que se indican a continuación:",
      "a. Declaraciones conjuntas:",
      "Los contribuyentes que NO tengan la condición legal de familia numerosa, para los que la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro menos el mínimo por descendientes (casillas [0435], [0460] y [0514] de la declaración, respectivamente) se encuentre comprendida en los tramos que se indican a continuación, podrán deducirse hasta las siguientes cuantías:",
      "(Base imponible general + Base imponible del ahorro) − (Mínimo por",
      "Hasta 12.000 euros 200 euros",
      "Entre 12.000,01 y 20.000,00 euros 100 euros",
      "(Base imponible general + Base imponible del ahorro) − (Mínimo por",
      "Entre 20.000,01 y 25.000,00 euros 75 euros",
      "Los contribuyentes que tengan la condición legal de familia numerosa, para los que la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro menos el mínimo por descendientes (casillas [0435], [0460] y [0514] de la declaración, respectivamente) se encuentre comprendida en el tramo que se indica a continuación, podrán deducirse hasta las siguientes cuantías:",
      "(Base imponible general + Base imponible del ahorro) − (Mínimo por",
      "Hasta 40.000 euros 300 euros",
      "b. Declaraciones individuales:",
      "Los contribuyentes que NO tengan la condición legal de familia numerosa, para los que la cantidad resultante de la suma de la base imponible general y la base imponible del ahorro menos el mínimo por descendientes (casillas [0435], [0460] y [0514] de la declaración, respectivamente) se encuentre comprendida en los tramos que se indican a continuación, podrán deducirse hasta las siguientes cuantías:",
      "(Base imponible general + Base imponible del ahorro) − (Mínimo por",
      "Hasta 6.500 euros 100 euros",
      "Entre 6.500,01 y 10.000,00 euros 75 euros",
      "Entre 10.000,01 y 12.500,00 euros 50 euros",
      "Los contribuyentes que tengan la condición legal de familia numerosa, para los que la cantidad resultante de la suma de la base imponible general y la base imponible del ahorro menos el mínimo por descendientes (casillas [0435], [0460] y [0514] de la declaración, respectivamente) se encuentre comprendida en el tramo que se indica a continuación, podrán deducirse la siguiente cuantía:",
      "(Base imponible general + Base imponible del ahorro) − (Mínimo por",
      "Hasta 30.000 euros 150 euros",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_gastos_guarderia",
      nombreCatalogadoDesdeCodigo("clm_gastos_guarderia"),
      categoriaCatalogadaDesdeCodigo("clm_gastos_guarderia"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [245, 246, 247],
      ["clm_gastos_guarderia:importe", "clm_gastos_guarderia:cumple"],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 3 bis. Deducción por gastos de guardería.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Las cantidades por gastos de custodia han de ser satisfechas a guarderías o centros de educación infantil.",
      "A los efectos de aplicación de esta deducción, se entenderá como guardería o centro de educación infantil todo centro autorizado por la Consejería competente en materia de educación que tenga por objeto la custodia o el primer ciclo de educación infantil de niñas y niños menores de 3 años.",
      "Para la aplicación de la presente deducción solo se tendrán en cuenta aquellas hijas o aquellos hijos que den derecho a la aplicación del mínimo por descendientes en el artículo 58 de la Ley del IRPF .",
      "Que la suma de la base imponible general y la del ahorro, casillas [0435] y [0460] del contribuyente, no supere:",
      "- 27.000 euros en tributación individual.",
      "- 36.000 euros en tributación conjunta",
      "Importante: los contribuyentes con derecho a la deducción deberán consignar en la casilla [0210] del Anexo B.4 del modelo de la declaración el NIF de la guardería o centro de educación infantil autorizado.",
    ],
    limites: [
      "El 30 por 100 de las cantidades satisfechas en el periodo impositivo por los gastos de custodia de hijas o hijos menores de 3 años en guarderías o centros de educación infantil.",
      "Límite de la deducción",
      "En general, la deducción tendrá un importe máximo de 500 euros por cada hija o hijo inscrito en dichas guarderías o centros.",
      "- En cuanto a la aplicación del límite máximo de deducción, el progenitor supérstite deberá minorar la parte proporcional de la deducción que se hubiera aplicado el cónyuge fallecido en ese período impositivo de tal forma que, en ningún caso, el límite de la deducción supere el límite legal.",
      "En particular, el límite de la deducción, en el período impositivo en el que la hija o el hijo cumpla los 3 años de edad, será de 250 euros.",
      "Las cantidades satisfechas que den derecho a la deducción serán las correspondientes al período impositivo en el que la hija o el hijo cumplen tres años con el límite de 250 euros.",
      "Ha de tratarse de cantidades satisfechas por los siguientes gastos de custodia:",
      "- la preinscripción y matrícula de menores de 3 años,",
      "- la asistencia, en horario general y ampliado, y",
      "- la alimentación.",
      "Las cantidades que se benefician de la deducción son exclusivamente las que corresponda a gastos que se hayan producido por meses completos.",
      "Las cantidades satisfechas se deben minorar en el importe de las becas o ayudas obtenidas de cualquier Administración Pública que cubran todos o parte de los gastos de custodia. Esta minoración se aplicará de forma individual para cada hija o hijo que se beneficie de las becas o ayudas.",
      "Tampoco se incluyen las cantidades que tengan para el contribuyente la consideración de rendimientos del trabajo en especie exentos por aplicación de lo dispuesto en el artículo 42.3. b) o d) de la Ley del IRPF, es decir, por:",
      "La contratación directa o indirectamente por empresas o empleadores del servicio de primer ciclo de educación infantil para los hijos de sus trabajadores en guarderías o centros de educación infantil autorizados [Art. 42.3.b) Ley del IRPF].",
      "La prestación del servicio de educación preescolar, infantil, primaria, secundaria obligatoria, bachillerato y formación profesional por centros educativos autorizados, a los hijos de sus empleados, con carácter gratuito o por precio inferior al normal de mercado [Art. 42.3.d) Ley del IRPF].",
    ],
    prorrateo: [
      "- En el caso de contribuyentes fallecidos con anterioridad al 31 de diciembre, se podrá aplicar la deducción por las cantidades satisfechas hasta la fecha de fallecimiento, prorrateándose entre los progenitores el límite máximo de la deducción si ambos conviven con el hijo en la fecha del fallecimiento y tienen derecho a aplicar el mínimo por descendientes por él.",
      "Cuando las hijas o los hijos que den derecho a la deducción convivan con más de un contribuyente, el importe de la deducción se prorrateará por partes iguales, siempre que aquellas o aquellos den derecho al mínimo por descendientes a más de un contribuyente.",
      "Cada progenitor solo podrá aplicar la deducción por los importes por él satisfechos, aunque tratándose de matrimonios en régimen de gananciales los importes satisfechos se entenderán atribuidos a los cónyuges por partes iguales.",
      "En aquellos casos en los que más de un contribuyente tenga derecho a aplicar la deducción, el prorrateo se refiere exclusivamente al límite de 500 euros, ya que cada contribuyente aplicará la deducción por las cantidades satisfechas por él.",
      "Si las cantidades se han abonado por ambos progenitores y cumplen los requisitos relativos a la convivencia y al derecho al mínimo por descendientes, se prorrateará la deducción, aunque alguno de los padres no pueda aplicarla por tener una base imponible total superior 27.000 euros o por residir en otra Comunidad Autónoma.",
      "En los casos de guarda y custodia compartida en los que ambos progenitores satisfagan cantidades y tengan derecho al mínimo por descendientes, la deducción se prorrateará entre ellos, aunque el hijo o la hija no conviva simultáneamente con los dos, siempre que el hijo o la hija dé derecho a la aplicación del mínimo por descendientes.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_cuidado_ascendientes_mayores_75",
      nombreCatalogadoDesdeCodigo("clm_cuidado_ascendientes_mayores_75"),
      categoriaCatalogadaDesdeCodigo("clm_cuidado_ascendientes_mayores_75"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [250, 251],
      [
        "clm_cuidado_ascendientes_mayores_75:importe",
        "clm_cuidado_ascendientes_mayores_75:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 6. Deducciones para personas mayores de 75 años.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "No procederá la aplicación de estas deducciones cuando los mayores de 75 años que generen el derecho a las mismas, ya sea el contribuyente o el ascendiente, residan durante más de 30 días naturales del período impositivo en Centros Residenciales de Mayores de la Junta de Comunidades de Castilla-La Mancha o en plazas concertadas o subvencionadas por ésta en otros centros, a excepción de las estancias temporales derivadas de convalecencias debidamente acreditadas por el Servicio de Salud de Castilla-La Mancha.",
      "Que la suma de la base imponible general y la del ahorro del contribuyente, casillas [0435] y [0460] de la declaración, no supere:",
      "- 27.000 euros en tributación individual.",
      "- 36.000 euros en tributación conjunta.",
      "Para la aplicación de estas deducciones se tendrán en cuenta las normas para la aplicación de los mínimos por contribuyente y por ascendientes contenidas en la Ley del IRPF.",
    ],
    limites: [
      "150 euros por el cuidado de cada ascendiente mayor de 75 años, siempre que cause derecho a la aplicación del mínimo por ascendientes.",
    ],
    prorrateo: [
      'No obstante, en el caso de la deducción "Por el cuidado de ascendientes mayores de 75 años", cuando dos o más contribuyentes tengan derecho a la aplicación de esta deducción respecto de los mismos ascendientes y alguno de ellos no cumpla el requisito anterior, el importe de la deducción para los demás contribuyentes quedará reducido a la proporción que resulte de la aplicación de las normas para el prorrateo del mínimo por ascendientes.',
    ],
    compatibilidades: [],
    incompatibilidades: [
      'Las deducciones "Por contribuyentes mayores de 75 años" y "Por el cuidado de ascendientes mayores de 75 años" resultan incompatibles, respectivamente, con la aplicación de las deducciones autonómicas "Por discapacidad del contribuyente" y "Por discapacidad de ascendiente", respecto de la misma persona mayor de 75 años.',
      'En los supuestos en los que la persona mayor de 75 años tenga un grado de discapacidad acreditado igual o superior al 65 por 100, se aplicarán las deducciones "Por discapacidad del contribuyente" o "Por discapacidad de ascendiente" que, en su calidad de contribuyente o de ascendiente del contribuyente, respectivamente, le corresponda.',
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_acogimiento_familiar_no_remunerado_menores",
      nombreCatalogadoDesdeCodigo(
        "clm_acogimiento_familiar_no_remunerado_menores"
      ),
      categoriaCatalogadaDesdeCodigo(
        "clm_acogimiento_familiar_no_remunerado_menores"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [251, 252],
      [
        "clm_acogimiento_familiar_no_remunerado_menores:importe",
        "clm_acogimiento_familiar_no_remunerado_menores:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 7. Deducción por acogimiento familiar no remunerado de menores.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "El acogimiento familiar que da derecho a la deducción podrá ser temporal, permanente o por delegación de guarda para la convivencia preadoptiva, por acuerdo administrativo o judicial.",
      "A efectos de determinación del número de orden del menor acogido solamente se computarán aquellos menores que hayan permanecido en dicho régimen durante más de 183 días del período impositivo.",
      "En ningún caso, se computarán los menores que hayan sido adoptados durante dicho período impositivo por el contribuyente.",
      'No dará lugar a esta deducción el supuesto de acogimiento familiar temporal o por delegación de guarda para la convivencia preadoptiva cuando se produjera la adopción del menor durante el período impositivo, sin perjuicio de la aplicación de la deducción "Por nacimiento o adopción de hijos".',
      "Para la aplicación de la deducción será necesario que se cumplan los siguientes requisitos:",
      "Que la suma de la base imponible general y la del ahorro del contribuyente, casillas [0435] y [0460] de la declaración, no supere:",
      "- 12.500 euros en tributación individual.",
      "- 25.000 euros en tributación conjunta.",
      "Que se acredite, por la consejería competente en la materia, la formalización del acogimiento, así como que el contribuyente no ha recibido ayudas de la Administración de la Junta de Comunidades de Castilla-La Mancha vinculadas con el acogimiento.",
    ],
    limites: [
      "500 euros si se trata del primer menor en régimen de acogimiento familiar no remunerado o por delegación de guarda para la convivencia preadoptiva, siempre que conviva con el contribuyente durante más de 183 días del periodo impositivo.",
      "600 euros si se trata del segundo menor o sucesivo en régimen de acogimiento familiar no remunerado o por delegación de guarda para la convivencia preadoptiva, siempre que conviva con el contribuyente durante más de 183 días del periodo impositivo.",
    ],
    prorrateo: [
      "En el supuesto de acogimiento de menores por matrimonios o uniones de hecho, el importe de la deducción se prorrateará por partes iguales en la declaración de cada uno de ellos si optaran por tributación individual.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_acogimiento_no_remunerado_mayores_65_discapacidad",
      nombreCatalogadoDesdeCodigo(
        "clm_acogimiento_no_remunerado_mayores_65_discapacidad"
      ),
      categoriaCatalogadaDesdeCodigo(
        "clm_acogimiento_no_remunerado_mayores_65_discapacidad"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [252, 253],
      [
        "clm_acogimiento_no_remunerado_mayores_65_discapacidad:importe",
        "clm_acogimiento_no_remunerado_mayores_65_discapacidad:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 8. Deducción por acogimiento no remunerado de mayores de 65 años o discapacitados.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Que el acogimiento no dé lugar a la obtención de ayudas o subvenciones de la Comunidad Autónoma de Castilla-La Mancha.",
      "No se podrá practicar la presente deducción, en el supuesto de acogimiento de mayores de 65 años, cuando el acogido esté ligado al contribuyente por un vínculo de parentesco de consanguinidad o de afinidad hasta el cuarto grado incluido.",
      "Para la aplicación de la deducción será necesario que se cumplan los siguientes requisitos:",
      "Que la suma de la base imponible general y la del ahorro del contribuyente, casillas [0435] y [0460] de la declaración, no supere:",
      "- 12.500 euros en tributación individual.",
      "- 25.000 euros en tributación conjunta.",
      "Que se acredite, por la consejería competente en la materia, que ni el contribuyente ni la persona acogida han recibido ayudas de la Administración de la Junta de Comunidades de Castilla-La Mancha vinculadas con el acogimiento.",
    ],
    limites: [
      "600 euros por cada persona mayor de 65 años o con un grado de discapacidad acreditado igual o superior al 33 por 100, que conviva con el contribuyente durante más de 183 días al año en régimen de acogimiento sin contraprestación, cuando por ello no hayan obtenido ayudas o subvenciones de la Comunidad Autónoma de Castilla-La Mancha.",
    ],
    prorrateo: [
      "Cuando la persona acogida genere el derecho a la deducción para más de un contribuyente simultáneamente, el importe de la misma se prorrateará por partes iguales en la declaración de cada uno de ellos si optaran por tributación individual.",
      "En el caso de matrimonios o uniones de hecho se prorratea el importe de la deducción por partes iguales en la declaración individual de cada uno de ellos, aunque solo uno de los cónyuges o miembros de la pareja de hecho tenga una base imponible que no supere la cuantía de 12.500 euros, o uno de ellos no presente declaración.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_arrendamiento_menores_36",
      nombreCatalogadoDesdeCodigo("clm_arrendamiento_menores_36"),
      categoriaCatalogadaDesdeCodigo("clm_arrendamiento_menores_36"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [253, 254, 255],
      [
        "clm_arrendamiento_menores_36:importe",
        "clm_arrendamiento_menores_36:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9. Deducción por arrendamiento de vivienda habitual por menores de 36 años.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Que, a la fecha de devengo del impuesto, el contribuyente tenga su residencia habitual en Castilla-La Mancha y sea menor de treinta y seis años.",
      "Que la suma de la base imponible general y la del ahorro del contribuyente menos el mínimo por descendientes (casillas [0435], [0460] y [0514] de la declaración, respectivamente) no supere la cuantía de:",
      "- 12.500 euros en tributación individual.",
      "- 25.000 euros en tributación conjunta.",
      "Que en la autoliquidación del IRPF se consigne el número de identificación fiscal del arrendador de la vivienda.",
      "El concepto de vivienda habitual será el fijado por la normativa reguladora del IRPF vigente a la fecha de devengo del impuesto.",
      "Téngase en cuenta que para tener la consideración de vivienda habitual se exige la residencia en ella durante un plazo continuado de tres años, salvo que concurran circunstancias que necesariamente exijan el cambio de vivienda.",
    ],
    limites: [
      "El 15 por 100 de las cantidades satisfechas por el arrendamiento de la vivienda que constituya o vaya a constituir su residencia habitual en Castilla-La Mancha durante el período impositivo, con un máximo de 500 euros.",
      "El 20 por 100 de las cantidades satisfechas por el arrendamiento de la vivienda que constituya o vaya a constituir su residencia habitual durante el período impositivo, con un máximo de 612 euros en los siguientes supuestos:",
      "Cuando el contribuyente tenga su domicilio habitual en un municipio de Castilla-La Mancha con población de hasta 2.500 habitantes. a.",
      "Cuando el contribuyente tenga su domicilio habitual en un municipio de Castilla-La Mancha con población superior a 2.500 habitantes y hasta 10.000 habitantes, que se encuentre a una distancia mayor de 30 kilómetros de un municipio con población superior a 50.000 habitantes.",
      "A estos efectos, para determinar el número de habitantes de cada municipio se tomará el establecido en el padrón municipal de habitantes en vigor a 1 de enero del año de devengo del impuesto.",
      "Puede consultar la relación de municipios que generan el derecho a la aplicación de la deducción en el enlace indicado al término de la presente sección.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      'Esta deducción resulta incompatible con la aplicación de las deducciones autonómicas “Por arrendamiento de vivienda habitual vinculado a determinadas operaciones de dación en pago”, "Por arrendamiento de vivienda habitual por familias numerosas”, “Por arrendamiento',
      "de vivienda habitual por familias monoparentales” y “Por arrendamiento de vivienda habitual por personas con discapacidad”.",
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por arrendamiento de Andalucía, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla-La Mancha, Castilla y León, Cataluña, Extremadura, Galicia, Madrid, Región de Murcia, La Rioja y Comunitat Valenciana" del Anexo B.11 de la declaración.',
      "Municipios distancia (489 KB - pdf )",
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_arrendamiento_dacion_pago",
      nombreCatalogadoDesdeCodigo("clm_arrendamiento_dacion_pago"),
      categoriaCatalogadaDesdeCodigo("clm_arrendamiento_dacion_pago"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [255, 256],
      [
        "clm_arrendamiento_dacion_pago:importe",
        "clm_arrendamiento_dacion_pago:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9 bis. Deducción por arrendamiento de vivienda habitual vinculado a determinadas operaciones de dación en pago.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Que, a la fecha de devengo del impuesto, el contribuyente tenga su residencia habitual en Castilla-La Mancha.",
      "Que el contrato de arrendamiento esté vinculado a una operación de adjudicación de la vivienda habitual en pago de la totalidad de la deuda pendiente del préstamo o crédito garantizados mediante hipoteca de la citada vivienda.",
      "Que la suma de la base imponible general y la del ahorro del contribuyente menos el mínimo por descendientes (casillas [0435], [0460] y [0514] de la declaración, respectivamente) no supere la cuantía de:",
      "- 12.500 euros en tributación individual.",
      "- 25.000 euros en tributación conjunta.",
      "Que en la autoliquidación del IRPF se consigne el número de identificación fiscal del arrendador de la vivienda.",
      "El concepto de vivienda habitual será el fijado por la normativa reguladora del IRPF vigente a la fecha de devengo del impuesto.",
      "Téngase en cuenta que para tener la consideración de vivienda habitual se exige la residencia en ella durante un plazo continuado de tres años, salvo que concurran circunstancias que necesariamente exijan el cambio de vivienda.",
    ],
    limites: [
      "El 15 por 100 de las cantidades satisfechas durante el ejercicio por el arrendamiento de la vivienda habitual del contribuyente, situada en Castilla-La Mancha y que constituya la residencia habitual.",
      "Importe máximo de la deducción: 500 euros",
      "Téngase en cuenta que el contribuyente no podrá deducir más de 500 euros por la suma de las cantidades satisfechas por todos los contratos realizados en el período impositivo.",
    ],
    prorrateo: [
      "El límite de esta deducción se prorrateará por el número de días en los que permanezca vigente el arrendamiento dentro del periodo impositivo",
      "Además, cuando dos o más contribuyentes declarantes del IRPF tengan derecho a la aplicación de esta deducción por una misma vivienda, el límite se prorrateará entre ellos a partes iguales.",
      "No se efectuará el prorrateo si uno de los arrendatarios no puede aplicar la deducción por tener una base imponible superior a la cuantía permitida o por residir en otra Comunidad Autónoma.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      'Esta deducción resulta incompatible con la aplicacion de las deducciones autonómicas “Por arrendamiento de vivienda habitual por menores de 36 años”, "Por arrendamiento de vivienda habitual por familias numerosas”, “Por arrendamiento de vivienda habitual por familias monoparentales” y “Por arrendamiento de vivienda habitual por personas con discapacidad”.',
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por el arrendamiento de vivienda habitual vinculado a determinadas operaciones de dación en pago de Aragón, Canarias y Castilla-La Mancha" del Anexo B.12 de la declaración.',
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_arrendamiento_familias_numerosas",
      nombreCatalogadoDesdeCodigo("clm_arrendamiento_familias_numerosas"),
      categoriaCatalogadaDesdeCodigo("clm_arrendamiento_familias_numerosas"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [256, 257, 258],
      [
        "clm_arrendamiento_familias_numerosas:importe",
        "clm_arrendamiento_familias_numerosas:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9 ter. Deducción por arrendamiento de vivienda habitual por familias numerosas.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Que, a la fecha de devengo del impuesto, el contribuyente tenga su residencia habitual en Castilla-La Mancha.",
      "Que el contribuyente integre una familia numerosa que, en la fecha de devengo del impuesto, tengan reconocida esta condición de conformidad con lo establecido en la Ley 40/2003, de 18 de noviembre, de Protección a las Familias Numerosa y esté en posesión del correspondiente título de familia numerosa.",
      "Que la suma de la base imponible general y la del ahorro del contribuyente menos el mínimo por descendientes (casillas [0435], [0460] y [0514] de la declaración, respectivamente) no supere la cuantía de:",
      "- 12.500 euros en tributación individual.",
      "- 25.000 euros en tributación conjunta.",
      "Que en la autoliquidación del IRPF se consigne el número de identificación fiscal del arrendador de la vivienda.",
      "El concepto de vivienda habitual será el fijado por la normativa reguladora del IRPF vigente a la fecha de devengo del impuesto.",
      "Téngase en cuenta que para tener la consideración de vivienda habitual se exige la residencia en ella durante un plazo continuado de tres años, salvo que concurran circunstancias que necesariamente exijan el cambio de vivienda.",
    ],
    limites: [
      "El 15 por 100 de las cantidades satisfechas por el arrendamiento de la vivienda que constituya o vaya a constituir su residencia habitual en Castilla-La Mancha durante el período impositivo, cuando se cumplan los requisitos que indicamos en el apartado siguiente.",
      "Importe máximo de la deducción: 500 euros.",
      "Téngase en cuenta que el contribuyente no podrá deducir más de 500 euros por la suma de las cantidades satisfechas por todos los contratos realizados en el período impositivo.",
    ],
    prorrateo: [
      "El límite de esta deducción se prorrateará por el número de días en los que permanezca vigente el arrendamiento dentro del periodo impositivo.",
      "Además, cuando dos o más contribuyentes declarantes del IRPF tengan derecho a la aplicación de esta deducción por una misma vivienda, el límite se prorrateará entre ellos a partes iguales.",
      "No se efectuará el prorrateo si uno de los arrendatarios no puede aplicar la deducción por tener una base imponible superior a la cuantía permitida o por residir en otra Comunidad Autónoma.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Esta deducción resulta incompatible con la aplicación de las deducciones autonómicas “Por arrendamiento de vivienda habitual por menores de 36 años”, “Por arrendamiento de vivienda habitual vinculado a determinadas operaciones de dación en pago”, “Por arrendamiento de vivienda habitual por familias monoparentales” y “Por arrendamiento de vivienda habitual por personas con discapacidad”.",
      "Asimismo, esta deducción resulta incompatible con la aplicación de la deducción autonómica “Por familia numerosa”.",
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por arrendamiento de Andalucía, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla-La Mancha, Castilla y León, Cataluña, Extremadura, Galicia, Madrid, Región de Murcia, La Rioja y Comunitat Valenciana" del Anexo B.11 de la declaración.',
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_arrendamiento_familias_monoparentales",
      nombreCatalogadoDesdeCodigo("clm_arrendamiento_familias_monoparentales"),
      categoriaCatalogadaDesdeCodigo(
        "clm_arrendamiento_familias_monoparentales"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [258, 259, 260],
      [
        "clm_arrendamiento_familias_monoparentales:importe",
        "clm_arrendamiento_familias_monoparentales:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9 quáter. Deducción por arrendamiento de vivienda habitual por familias monoparentales.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Que, a la fecha de devengo del impuesto, el contribuyente tenga su residencia habitual en Castilla-La Mancha.",
      "Que el contribuyente sea el padre o la madre que integre una familia monoparental.",
      "De acuerdo con el artículo 2 bis de la Ley 8/2013 tendrá la consideración de familia monoparental la formada por la madre o el padre separados legalmente o sin vínculo matrimonial y las hijas e hijos que, de forma exclusiva, convivan y dependan económicamente de una u otro, y que reúnan alguno de los siguientes requisitos:",
      "Ser menores de edad, con excepción de quienes, con el consentimiento de los padres, vivan independientes de estos. a.",
      "Ser mayores de edad que tengan establecidas alguna de las medidas de apoyo para el ejercicio de su capacidad jurídica de acuerdo con la legislación civil. b.",
      "Se entenderá que hay dependencia económica de forma exclusiva, cuando la madre o el padre tenga derecho a la totalidad del mínimo por descendiente previsto en la Ley del IRPF, respecto de las hijas e hijos que integran la familia monoparental y no perciba anualidades por alimentos por las hijas e hijos.",
      "Sin perjuicio de lo anterior, en ningún caso se considerará familia monoparental la persona viuda o en situación equiparada que hubiere sido condenada, por sentencia firme, por la comisión de un delito doloso de homicidio en cualquiera de sus formas, cuando la víctima fuera su cónyuge o excónyuge o persona que hubiera estado ligada a ella por una análoga relación de afectividad",
      "Que la suma de la base imponible general y la del ahorro del contribuyente menos el mínimo por descendientes (casillas [0435], [0460] y [0514] de la declaración, respectivamente) no supere la cuantía de:",
      "- 12.500 euros en tributación individual.",
      "- 25.000 euros en tributación conjunta.",
      "Que en la autoliquidación del IRPF se consigne el número de identificación fiscal del arrendador de la vivienda.",
      "El concepto de vivienda habitual será el fijado por la normativa reguladora del IRPF vigente a la fecha de devengo del impuesto.",
      "Téngase en cuenta que para tener la consideración de vivienda habitual se exige la residencia en ella durante un plazo continuado de tres años, salvo que concurran circunstancias que necesariamente exijan el cambio de vivienda.",
    ],
    limites: [
      "El 15 por 100 de las cantidades satisfechas por el arrendamiento de la vivienda que constituya o vaya a constituir su residencia habitual en Castilla-La Mancha durante el período impositivo, cuando se cumplan los requisitos que indicamos en el apartado siguiente.",
      "Importe máximo de la deducción: 500 euros.",
      "Téngase en cuanta que el contribuyente no podrá deducir más de 500 euros por la suma de las cantidades satisfechas por todos los contratos realizados en el período impositivo.",
    ],
    prorrateo: [
      "El límite de esta deducción se prorrateará por el número de días en los que permanezca vigente el arrendamiento dentro del periodo impositivo",
      "Además, cuando dos o más contribuyentes declarantes del IRPF tengan derecho a la aplicación de esta deducción por una misma vivienda, el límite se prorrateará entre ellos a partes iguales",
      "No se efectuará el prorrateo si uno de los arrendatarios no puede aplicar la deducción por tener una base imponible superior a la cuantía permitida o por residir en otra Comunidad Autónoma.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Esta deducción resulta incompatible con la aplicación de las deducciones autonómicas “Por arrendamiento de vivienda habitual por menores de 36 años”, “Por arrendamiento de vivienda habitual vinculado a determinadas operaciones de dación en pago”, “Por arrendamiento de vivienda habitual por familias numerosas” y “Por arrendamiento de vivienda habitual por personas con discapacidad”.",
      "Asimismo, esta deducción resulta incompatible con la aplicación de la deducción autonómica “Por familia monoparental”.",
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por arrendamiento de Andalucía, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla-La Mancha, Castilla y León, Cataluña, Extremadura, Galicia, Madrid, Región de Murcia, La Rioja y Comunitat Valenciana " del Anexo B.11 de la declaración.',
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_arrendamiento_personas_discapacidad",
      nombreCatalogadoDesdeCodigo("clm_arrendamiento_personas_discapacidad"),
      categoriaCatalogadaDesdeCodigo("clm_arrendamiento_personas_discapacidad"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [260, 261],
      [
        "clm_arrendamiento_personas_discapacidad:importe",
        "clm_arrendamiento_personas_discapacidad:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9 quinquies. Deducción por arrendamiento de vivienda habitual por personas con discapacidad.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Que, a la fecha de devengo del impuesto, el contribuyente tenga su residencia habitual en Castilla-La Mancha.",
      "Que el contribuyente tenga un grado de discapacidad acreditado igual o superior al 65 por 100 y tenga derecho a la aplicación del mínimo por discapacidad del contribuyente previsto en la Ley del IRPF.",
      "Que la suma de la base imponible general y la del ahorro del contribuyente menos el mínimo por descendientes (casillas [0435], [0460] y [0514] de la declaración, respectivamente) no supere la cuantía de:",
      "- 12.500 euros en tributación individual.",
      "- 25.000 euros en tributación conjunta.",
      "Que en la autoliquidación del IRPF se consigne el número de identificación fiscal del arrendador de la vivienda.",
      "El concepto de vivienda habitual será el fijado por la normativa reguladora del IRPF vigente a la fecha de devengo del impuesto.",
      "Téngase en cuenta que para tener la consideración de vivienda habitual se exige la residencia en ella durante un plazo continuado de tres años, salvo que concurran circunstancias que necesariamente exijan el cambio de vivienda.",
    ],
    limites: [
      "El 15 por 100 de las cantidades satisfechas por el arrendamiento de la vivienda que constituya o vaya a constituir su residencia habitual en Castilla-La Mancha durante el período impositivo, cuando se cumplan los requisitos que indicamos en el apartado siguiente.",
      "Importe máximo de la deducción: 500 euros.",
      "Téngase en cuanta que el contribuyente no podrá deducir más de 500 euros por la suma de las cantidades satisfechas por todos los contratos realizados en el período impositivo.",
    ],
    prorrateo: [
      "El límite de esta deducción se prorrateará por el número de días en los que permanezca vigente el arrendamiento dentro del periodo impositivo",
      "Además, cuando dos o más contribuyentes declarantes del IRPF tengan derecho a la aplicación de esta deducción por una misma vivienda, el límite se prorrateará entre ellos a partes iguales",
      "No se efectuará el prorrateo si uno de los arrendatarios no puede aplicar la deducción por tener una base imponible superior a la cuantía permitida o por residir en otra Comunidad Autónoma.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Esta deducción resulta incompatible con la aplicación de las deducciones autonómicas “Por arrendamiento de vivienda habitual por menores de 36 años”, “Por arrendamiento de vivienda habitual vinculado a determinadas operaciones de dación en pago”, “Por arrendamiento de vivienda habitual por familias numerosas” y “Por arrendamiento de vivienda habitual por familias monoparentales”.",
      "Asimismo, esta deducción resulta incompatible con la aplicación de la deducción autonómica “Por discapacidad del contribuyente”.",
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por arrendamiento de Andalucía, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla-La Mancha, Castilla y León, Cataluña, Extremadura, Galicia, Madrid, Región de Murcia, La Rioja y Comunitat Valenciana" del Anexo B.11 de la declaración.',
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_donaciones_cooperacion_lucha_pobreza_discapacidad",
      nombreCatalogadoDesdeCodigo(
        "clm_donaciones_cooperacion_lucha_pobreza_discapacidad"
      ),
      categoriaCatalogadaDesdeCodigo(
        "clm_donaciones_cooperacion_lucha_pobreza_discapacidad"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [261, 262],
      [
        "clm_donaciones_cooperacion_lucha_pobreza_discapacidad:importe",
        "clm_donaciones_cooperacion_lucha_pobreza_discapacidad:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 10. Deducción por cantidades donadas para la cooperación internacional al desarrollo y a las entidades para la lucha contra la pobreza, la exclusión social y la ayuda a personas con discapacidad.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Las organizaciones no gubernamentales, fundaciones, asociaciones de ayuda a personas con discapacidad y otras entidades que tengan la consideración de entidades sin fines lucrativos han de estar inscritas en los registros correspondientes de la Comunidad Autónoma de Castilla-La Mancha.",
      "En el caso de las fundaciones, será preciso que, además de su inscripción en el Registro de Fundaciones de Castilla-La Mancha, rindan cuentas al órgano de Protectorado correspondiente y que este haya ordenado su depósito en el Registro de Fundaciones.",
      "La efectividad de la aportación efectuada deberá acreditarse mediante certificación del órgano competente de la entidad donataria.",
    ],
    limites: [
      "El 15 por 100 de las donaciones dinerarias efectuadas durante el período impositivo destinadas a Organizaciones no gubernamentales, fundaciones, asociaciones de ayuda a personas con discapacidad y otras entidades, siempre que estas tengan la consideración de entidades sin fines lucrativos de conformidad con lo establecido en los",
      "artículos 2 y 3 de la Ley 49/2002, de 23 de diciembre, de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo, que dentro de sus fines principales estén la cooperación internacional, la lucha contra la pobreza y la ayuda a personas con discapacidad y la exclusión social.",
      "La base de la deducción no podrá exceder del 10 por 100 de la base liquidable del contribuyente.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_donaciones_idi_innovacion_empresarial",
      nombreCatalogadoDesdeCodigo("clm_donaciones_idi_innovacion_empresarial"),
      categoriaCatalogadaDesdeCodigo(
        "clm_donaciones_idi_innovacion_empresarial"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [262, 263],
      [
        "clm_donaciones_idi_innovacion_empresarial:importe",
        "clm_donaciones_idi_innovacion_empresarial:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 11. Deducción por donaciones con finalidad en investigación y desarrollo científico e innovación empresarial.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "El 15 por 100 de las donaciones dinerarias efectuadas durante el período impositivo a favor de cualquiera de las siguientes entidades:",
    ],
    limites: [
      "El 15 por 100 de las donaciones dinerarias efectuadas durante el período impositivo a favor de cualquiera de las siguientes entidades:",
      "La Administración de la Junta de Comunidades de Castilla-La Mancha y los organismos y entidades públicas dependientes de la misma cuya finalidad sea la investigación y el desarrollo científico y la innovación empresarial.",
      "Las entidades sin fines lucrativos a que se refieren los artículos 2 y 3 de la Ley 49/2002, de 23 de diciembre, de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo, siempre que:",
      "entre sus fines principales se encuentren la investigación y el desarrollo científico y la innovación empresarial y",
      "se hallen inscritas en los registros correspondientes de la Comunidad Autónoma de Castilla-La Mancha.",
      "La efectividad de la aportación efectuada deberá acreditarse mediante certificación de la entidad donataria.",
      "El importe de la deducción no podrá exceder el 10 por 100 de la cuota íntegra autonómica, casilla [0546] de la declaración.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_donaciones_bienes_culturales_mecenazgo",
      nombreCatalogadoDesdeCodigo("clm_donaciones_bienes_culturales_mecenazgo"),
      categoriaCatalogadaDesdeCodigo(
        "clm_donaciones_bienes_culturales_mecenazgo"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [263, 264, 265],
      [
        "clm_donaciones_bienes_culturales_mecenazgo:importe",
        "clm_donaciones_bienes_culturales_mecenazgo:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 11 bis. Deducciones por donaciones de bienes culturales y contribuciones a favor de la conservación, reparación y restauración de bienes pertenecientes al patrimonio cultural de Castilla-La Mancha, y para fines culturales, incluidos en el plan de mecenazgo cultural de Castilla-La Mancha.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "El 15 por 100 de las donaciones puras y simples efectuadas durante el período impositivo de bienes que, formando parte del patrimonio cultural de Castilla-La Mancha, se encuentren inscritos en el Inventario del Patrimonio Cultural de Castilla-La Mancha, de acuerdo con la Ley 4/2013, de 16 de mayo, de Patrimonio Cultural de Castilla-La Mancha, siempre que se realicen a favor de cualquiera de las siguientes entidades:",
    ],
    limites: [
      "El 15 por 100 de las donaciones puras y simples efectuadas durante el período impositivo de bienes que, formando parte del patrimonio cultural de Castilla-La Mancha, se encuentren inscritos en el Inventario del Patrimonio Cultural de Castilla-La Mancha, de acuerdo con la Ley 4/2013, de 16 de mayo, de Patrimonio Cultural de Castilla-La Mancha, siempre que se realicen a favor de cualquiera de las siguientes entidades:",
      "La Junta de Comunidades de Castilla-La Mancha y las Corporaciones Locales de la Región, así como las Entidades Públicas de carácter cultural dependientes de cualquiera de ellas.",
      "Las universidades que desarrollen su actividad docente e investigadora en el territorio de la Región, los Centros de Investigación y los Centros Superiores de Enseñanzas Artísticas de la Región.",
      "Las entidades sin fines lucrativos (fundaciones y asociaciones declaradas de utilidad pública) reguladas en los apartados a) y b) del artículo 2 de la Ley 49/2002, de 23 de diciembre, de Régimen Fiscal de las Entidades sin Fines Lucrativos y de los Incentivos Fiscales al Mecenazgo, siempre que:",
      "- Persigan fines de naturaleza exclusivamente cultural y",
      "- Se hallen inscritas en los correspondientes registros de Castilla-La Mancha.",
      "El 15 por ciento de las cantidades destinadas a la conservación, reparación y restauración de bienes pertenecientes al patrimonio cultural de Castilla-La Mancha, inscritos en el Inventario del Patrimonio Cultural de Castilla-La Mancha.",
      "El 15 por ciento de las cantidades donadas para fines culturales establecidos en la Ley 9/2019, de 13 de diciembre, de Mecenazgo Cultural de Castilla-La Mancha, realizadas a las entidades que se establecen en el artículo 3.1 de dicha ley, incluidos en el plan de mecenazgo cultural de Castilla-La Mancha.",
      "Las entidades que se establecen en el artículo 3.1 de la Ley 9/2019, de 13 de diciembre, de Mecenazgo Cultural de Castilla-La Mancha son las siguientes:",
      "a) La Junta de Comunidades de Castilla-La Mancha y las Corporaciones Locales de la región, así como las Entidades y Organismos que integran el Sector Público Regional, definidos en el artículo 4 del texto refundido de la Ley de Hacienda de Castilla-La Mancha, aprobado por Decreto Legislativo 1/2002, de 19 de noviembre, y el Sector Público Local de Castilla-La Mancha.",
      "b) Las entidades sin ánimo de lucro domiciliadas fiscalmente en Castilla-La Mancha. Se entiende por entidades sin ánimo de lucro las que así se caracterizan por la normativa reguladora de las mismas en atención a su correspondiente personificación jurídica.",
      "c) Las universidades que desarrollen su actividad docente e investigadora en el territorio de la Región, los Centros de Investigación y los Centros Superiores de Enseñanzas Artísticas de la Región.",
      "d) Las personas físicas o jurídicas con domicilio fiscal en Castilla-La Mancha que de forma habitual desarrollan alguna de las actividades enumeradas en el artículo 2 de la Ley de Mecenazgo Cultural de Castilla-La Mancha.",
      "La suma de las bases de las deducciones establecidas en los apartados anteriores no podrá exceder del 10 por 100 de la base liquidable general y de la base liquidable del ahorro del contribuyente. Dicho importe es el resultado de sumar las casillas [0500] y [0510] de la declaración.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Estas deducciones resultarán incompatibles con el crédito fiscal a que se refiere la Ley 9/2019, de 13 de diciembre, de Mecenazgo Cultural de Castilla-La Mancha, en tanto este permanezca vigente.",
      'El crédito fiscal se regula en el Capítulo 2 del Título IV ("Medidas Tributarias"), artículo 21 a 24, ambos inclusive, de la mencionada Ley 9/2019, de 13 de diciembre, de Mecenazgo Cultural de Castilla-La Mancha.',
      'El artículo 21 de la Ley 9/2019, en su redacción vigente desde el 1 de febrero de 2023, define el crédito fiscal como "aquellas cantidades reconocidas por la Administración regional a favor de los contribuyentes que puedan ser utilizadas por los mismos para satisfacer el pago de los impuestos propios, precios públicos y tasas de la Comunidad Autónoma de Castilla-La',
      'Mancha, así como del canon establecido en la Ley 9/2001, de 21 de marzo por la que se crea el canon Eólico y el fondo para el Desarrollo Tecnológico de las Energías Renovables y el uso racional de la Energía en Castilla-La Mancha".',
      "Corresponde a la Consejería competente en materia de hacienda de la Junta de Comunidades de Castilla-La Mancha, reconocer un crédito fiscal a favor de las personas donantes por el 25 por 100 de los convenios de colaboración empresarial o de los importes dinerarios donados a las personas destinatarias y para las siguientes finalidades:",
      "Las donaciones efectuadas a la Junta de Comunidades de Castilla-La Mancha y a las Entidades y Organismos que integran el Sector Público Regional, siempre que se destinen a la financiación de programas de gasto o actuaciones que tengan por objeto la promoción de cualquier actividad cultural.",
      "Las donaciones efectuadas a las Universidades con implantación en Castilla-La Mancha, a los Centros de Investigación y a los Centros Superiores de Enseñanzas Artísticas de Castilla-La Mancha, cuando se destinen a la financiación de programas de gasto o actuaciones que tengan por objeto actividades de investigación en materia de servicios y productos de contenido cultural.",
      "Las donaciones efectuadas a las universidades públicas de Castilla-La Mancha y a los centros públicos de enseñanzas artísticas superiores de la región con destino a la financiación de programas de gasto o actuaciones para el establecimiento de becas para el acceso a la educación superior en estudios relacionados con los servicios y productos de contenido cultural.",
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_intereses_primera_vivienda_menores_40",
      nombreCatalogadoDesdeCodigo("clm_intereses_primera_vivienda_menores_40"),
      categoriaCatalogadaDesdeCodigo(
        "clm_intereses_primera_vivienda_menores_40"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [265, 266],
      [
        "clm_intereses_primera_vivienda_menores_40:importe",
        "clm_intereses_primera_vivienda_menores_40:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 12. Deducción por los gastos en intereses por la financiación ajena de la adquisición de primera vivienda habitual por menores de 40 años.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Solo podrán beneficiarse de la aplicación de esta deducción los contribuyentes que, a fecha de devengo, sean menores de 40 años.",
      "La deducción corresponderá al contribuyente que haya satisfecho las cantidades en concepto de intereses por la financiación ajena concertada para la adquisición de la primera vivienda habitual, siempre que el préstamo o crédito sea a interés variable.",
      "Que la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro, casillas [0435] y [0460] de la declaración, no supere las siguientes cuantías:",
      "- 27.000 euros en tributación individual.",
      "- 36.000 euros en tributación conjunta.",
    ],
    limites: [
      "El 100 por 100 de las cantidades satisfechas durante el período impositivo en concepto de intereses por la financiación ajena concertada para la adquisición de la primera vivienda habitual.",
      "Respecto al concepto de vivienda habitual téngase en cuenta el fijado por la normativa estatal del IRPF vigente a 31 de diciembre de 2012.",
      "El importe de la deducción no puede exceder de los límites que a continuación se señalan, en función de la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro casillas [0435] y [0460] de la declaración:",
      "a) En las declaraciones individuales",
      "Base imponible general + Base imponible del ahorro Límite por contribuyente",
      "Hasta 12.500 euros 150,00 euros",
      "Entre 12.500,01 y 27.000,00 euros 100,00 euros",
      "b) En las declaraciones conjuntas",
      "Base imponible general + Base imponible del ahorro Límite por contribuyente",
      "Hasta 25.000 euros 150,00 euros",
      "Entre 25.000,01 y 36.000,00 euros 100,00 euros",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Reserva para 2025: el artículo 18.8 de Ley 1/2026 añade la incompatibilidad entre intereses de primera vivienda (art.12) y adquisición o rehabilitación rural (art.12 ter); DF6 da efectos 2025 al artículo 18. El aviso oficial de campaña excluye esta incompatibilidad de 2025 y el manual mantiene ambas compatibles. Debe resolverse esta discrepancia jurídica antes de combinar ambas deducciones.",
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_residencia_zonas_rurales",
      nombreCatalogadoDesdeCodigo("clm_residencia_zonas_rurales"),
      categoriaCatalogadaDesdeCodigo("clm_residencia_zonas_rurales"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [266, 267, 268, 269],
      [
        "clm_residencia_zonas_rurales:importe",
        "clm_residencia_zonas_rurales:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 12 bis. Deducción por residencia habitual en zonas rurales.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "El 20 por 100 de la cuota íntegra autonómica, si el municipio tiene una población inferior a 2.000 habitantes.",
      "El 15 por 100 de la cuota íntegra autonómica, si el municipio tiene una población igual o superior a 2.000 e inferior a 5.000 habitantes.",
      "El 25 por 100 de la cuota íntegra autonómica, si el municipio tiene una población inferior a 2.000 habitantes.",
      "El 20 por 100 de la cuota íntegra autonómica, si el municipio tiene una población igual o superior a 2.000 e inferior a 5.000 habitantes.",
      "El 15 por 100 de la cuota íntegra autonómica, si el municipio tiene una población inferior a 2.000 habitantes.",
      "El 10 por 100 de la cuota íntegra autonómica, si el municipio tiene una población igual o superior a 2.000 e inferior a 5.000 habitantes.",
      "El 15 por 100 de la cuota íntegra autonómica, si se trata de un municipio de una zona rural intermedia con predominio de la actividad agrícola, con población inferior a 2.000 habitantes, que hayan perdido población durante los cinco años anteriores a 1 de enero de 2021.",
      "La aplicación de la deducción requerirá que el contribuyente cumpla los requisitos de residencia habitual y de estancia efectiva que seguidamente se exponen:",
      "Los contribuyentes han de tener su residencia habitual en alguno de los municipios incluidos en las siguientes zonas:",
      "a) Las zonas escasamente pobladas a que se refiere el artículo 12 de la Ley 2/2021, de 7 de mayo, de Medidas Económicas, Sociales y Tributarias frente a la Despoblación y para el Desarrollo del Medio Rural en Castilla-La Mancha",
      'Conforme al artículo 12 de la Ley 2/2021 se clasificarán como zonas escasamente pobladas "aquellas agrupaciones de municipios o núcleos de población integradas mayoritariamente por municipios de pequeño tamaño, con una densidad conjunta de población de menos de 12,5 habitantes por km2, altas',
      "tasas de envejecimiento y pérdidas intensas de población, con un importante aislamiento geográfico con respecto a municipios de más de 30.000 habitantes, un alto porcentaje de suelo de uso forestal, y una elevada significación de la actividad agraria.",
      "En consideración al grado de despoblación, se establecen las siguientes categorías de zonas escasamente pobladas:",
      "Zonas de intensa despoblación: Aquellas agrupaciones de municipios con densidad superior a 8 habitantes por km2. a.",
      'Zonas de extrema despoblación: Aquellas agrupaciones de municipios con densidad de población menor de 8 habitantes por km2". b.',
      "Atención: para la aplicación de esta deducción se tomará como población de los municipios la que, conforme a su respectivo padrón municipal, tuvieran a 1 de enero de cada año.",
      "A los efectos indicados en el párrafo anterior no se tomarán en consideración las variaciones de población respecto al padrón municipal de 2021 que supongan una minoración o inaplicación de las deducciones que conforme al mismo resultasen procedentes. En tales casos, dichas deducciones podrán seguir aplicándose en las condiciones y cuantías que resultasen procedentes conforme a la población del expresado padrón municipal.",
      "No obstante, en los casos excepcionales en los que uno de los cónyuges resida en una zona que origine derecho a la deducción y el otro no o en los que los cónyuges residan en municipios incluidos en zonas rurales diferentes, el importe de la deducción en tributación conjunta será la suma de las deducciones que correspondan a cada uno de los contribuyentes integrados en esa declaración.",
      "b) Las zonas en riesgo de despoblación a que se refiere el artículo 13 de la Ley 2/2021, de 7 de mayo, de Medidas Económicas, Sociales y Tributarias frente a la Despoblación y para el Desarrollo del Medio Rural en Castilla-La Mancha",
      'Conforme al artículo 13 de la Ley 2/2021 "se clasificarán como zonas en riesgo de despoblación aquellas agrupaciones de municipios o núcleos de población con densidad de población menor de 20 habitantes por km2, pero mayor de 12,5 habitantes por km2, altas tasas de envejecimiento y una evolución negativa de su población, con una accesibilidad media o baja con respecto a municipios de más de 30.000 habitantes, con elevada significación del empleo agrario, con más del 75 % de su población residiendo en municipios menores de 2.000 habitantes, con usos del suelo tanto agrícolas como forestales".',
      "c) Las zonas rurales intermedias con predominio de la actividad agrícola, con población inferior a 2.000 habitantes, que hayan perdido población durante los cinco años anteriores a 1 de enero de 2021.",
      'El artículo 14 de la Ley 2/2021, de 7 de mayo, de Medidas Económicas, Sociales y Tributarias frente a la Despoblación y para el Desarrollo del Medio Rural en Castilla-La Mancha define como zonas rurales intermedias "aquellas agrupaciones de municipios o núcleos de población, con una densidad de población superior a 20 habitantes por km2 e inferior a 50 habitantes por km2, fuera del ámbito directo de influencia de las áreas urbanas y una accesibilidad media a los mismos, con una densidad de población en torno a la media regional, población estable o en ascenso y con más del 75 % de su población residiendo en municipios de más de 2.000 habitantes.',
      "En consideración a la actividad económica, se establecen las siguientes categorías de zonas intermedias:",
      "Con predominio de la actividad agrícola. a.",
      'Con actividad económica diversificada". b.',
      "De estas zonas rurales intermedias solo podrán beneficiarse de la deducción, de acuerdo con lo establecido en la disposición adicional sexta de la Ley 2/2021, los municipios con predominio de la actividad agrícola, con población inferior a 2.000 habitantes, que hayan perdido población durante los cinco años anteriores a 1 de enero de 2021, de acuerdo con lo establecido en la disposición adicional sexta en la Ley 2/2021, de 7 de mayo, de Medidas Económicas, Sociales y Tributarias frente a la Despoblación y para el Desarrollo del Medio Rural en Castilla-La Mancha.",
      "Que el contribuyente cumpla el requisito de “estancia efectiva” a que se refiere el artículo 5 de la Ley 2/2021, de 7 de mayo, de Medidas Económicas, Sociales y Tributarias frente a la Despoblación y para el Desarrollo del Medio Rural en Castilla-La Mancha.",
      "De acuerdo con el artículo 5 de la Ley 2/2021 se considerará como “estancia efectiva en un municipio de Castilla-La Mancha, aquella que pueda acreditarse con la certificación de los respectivos padrones municipales y que coincida con los siguientes indicadores de permanencia en el municipio:",
      "1º Certificación de tarjeta sanitaria, adscrita a alguno de los centros de salud del municipio al que pertenezca el centro de salud asignado en la zona básica de salud de pertenencia del municipio donde se encuentra empadronada.",
      "En defecto de lo anterior, en el caso de mutualistas y demás beneficiarios adscritos a entidades de seguro de asistencia sanitaria concertada, certificación emitida por el Servicio de Salud de Castilla-La Mancha acreditativa de que la prestación sanitaria se realiza por parte del mismo en alguno de los centros de la zona básica de salud de pertenencia del municipio donde se encuentra empadronada, en los términos, con el contenido y alcance recogidos en las cláusulas del convenio vigente suscrito entre la Mutualidad General de Funcionarios Civiles del Estado, el Instituto Social de las Fuerzas Armadas y la Mutualidad General Judicial (Muface, Isfas y Mugeju) y el Servicio de Salud de Castilla-La Mancha, para la prestación en zonas rurales de determinados servicios sanitarios.",
      "2º Certificación, en su caso, de que las personas menores de edad, en edad de escolarización obligatoria, cuentan con una matrícula en alguno de los centros educativos de la localidad de referencia, para el municipio donde se encuentren empadronadas.",
      "Relación de Zonas rurales previstas en los apartados a), b) y c) a las que es aplicable la presente deducción",
      "Puede consultar si su municipio está incluido en una de las zonas indicadas en el enlace indicado al término de la presente sección.",
      "El incumplimiento de cualquiera de los requisitos indicados conlleva la pérdida del beneficio fiscal, y el contribuyente deberá integrar las cantidades deducidas en la cuota íntegra autonómica del ejercicio en que se produzca el incumplimiento, más los intereses de demora devengados.",
      "Municipios despoblación (405 KB - pdf )",
    ],
    limites: [
      "Véase también la disposición adicional sexta de la Ley 2/2021, de 7 de mayo, de Medidas Económicas, Sociales y Tributarias frente a la Despoblación y para el Desarrollo del Medio Rural en Castilla-La Mancha",
      "Debe diferenciarse entre:",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales",
      nombreCatalogadoDesdeCodigo(
        "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales"
      ),
      categoriaCatalogadaDesdeCodigo(
        "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [270, 271, 272, 273],
      [
        "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales:importe",
        "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 12 ter. Deducción por adquisición o rehabilitación de la vivienda habitual en zonas rurales.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Para tener derecho a la deducción se han de cumplir, simultáneamente, los siguientes requisitos:",
      "Que la vivienda esté situada en alguno de los municipios incluidos en las zonas escasamente pobladas a que se refiere el artículo 12 de la Ley 2/2021, de 7 de mayo, de Medidas Económicas, Sociales y Tributarias frente a la Despoblación y para el Desarrollo del Medio Rural en Castilla-La Mancha, y que la población del mismo sea inferior a 5.000 habitantes.",
      'Conforme al artículo 12 de la Ley 2/2021 se clasificarán como zonas escasamente pobladas "aquellas agrupaciones de municipios o núcleos de población integradas mayoritariamente por municipios de pequeño tamaño, con una densidad conjunta de población de menos de 12,5 habitantes por km2, altas tasas de envejecimiento y pérdidas intensas de población, con un importante aislamiento geográfico con respecto a municipios de más de 30.000 habitantes, un alto porcentaje de suelo de uso forestal, y una elevada significación de la actividad agraria.',
      "En consideración al grado de despoblación, se establecen las siguientes categorías de zonas escasamente pobladas:",
      "a) Zonas de intensa despoblación: Aquellas agrupaciones de municipios con densidad superior a 8 habitantes por km2.",
      'b) Zonas de extrema despoblación: Aquellas agrupaciones de municipios con densidad de población menor de 8 habitantes por km2".',
      "Puede consultar las zonas que posibilitan la aplicación de la deducción en el enlace indicado al término de la presente sección.",
      "Atención: para la aplicación de esta deducción se tomará como población de los municipios la que, conforme a su respectivo padrón municipal, tuvieran a 1 de enero de cada año.",
      "A los efectos indicados en el párrafo anterior no se tomarán en consideración las variaciones de población respecto al padrón municipal de 2021 que supongan una minoración o inaplicación de las deducciones que conforme al mismo resultasen procedentes. En tales casos, dichas deducciones podrán seguir aplicándose en las condiciones y cuantías que resultasen procedentes conforme a la población del expresado padrón municipal.",
      "Que la adquisición o rehabilitación de la vivienda se haya producido a partir del 1 de enero de 2021.",
      "La aplicación de esta deducción requerirá que el importe comprobado del patrimonio del contribuyente al finalizar el período de la imposición exceda del valor que arrojase su comprobación al comienzo del mismo al menos en la cuantía de las inversiones realizadas, sin computar los intereses y demás gastos de financiación.",
      "A estos efectos, no se computarán los incrementos o disminuciones de valor experimentados durante el período impositivo por los elementos patrimoniales que al final del mismo sigan formando parte del patrimonio del contribuyente.",
      "Para la aplicación de la deducción prevista en este artículo se tendrán en cuenta los siguientes conceptos:",
      "Con carácter general se considera vivienda habitual del contribuyente la edificación que constituya su residencia durante un plazo continuado de, al menos, tres años. No obstante, se entenderá que la vivienda tuvo el carácter de habitual cuando, a pesar de no haber transcurrido dicho plazo, se produzca el fallecimiento del contribuyente o concurran otras circunstancias que necesariamente exijan el cambio de domicilio, tales como celebración de matrimonio, separación matrimonial, traslado laboral, obtención del primer empleo, o cambio de empleo, u otras análogas justificadas. Para que la vivienda",
      "constituya la residencia habitual del contribuyente deberá ser habitada de manera efectiva y con carácter permanente por este, en un plazo de doce meses, contados a partir de la fecha de adquisición o terminación de las obras. No obstante, se entenderá que la vivienda no pierde el carácter de habitual cuando se produzca el fallecimiento del contribuyente o concurran otras circunstancias que necesariamente impidan la ocupación de la vivienda, en los términos previstos en el párrafo anterior. Cuando sean de aplicación las excepciones previstas en los dos párrafos anteriores, la deducción por adquisición de vivienda se practicará hasta el momento en que se den las circunstancias que necesariamente exijan el cambio de vivienda o impidan la ocupación de la misma.",
      "Se entenderá por adquisición de vivienda habitual, la adquisición en sentido jurídico del derecho de propiedad o pleno dominio de la misma, aunque este sea compartido, siendo indiferente el negocio jurídico que la origine.",
      "Se asimilan a la adquisición de vivienda la construcción o ampliación de la misma, en los siguientes términos:",
      "Ampliación de vivienda: Cuando se produzca el aumento de su superficie habitable, mediante cerramiento de parte descubierta o por cualquier otro medio, de forma permanente y durante todas las épocas del año.",
      "Construcción: Cuando el contribuyente satisfaga directamente los gastos derivados de la ejecución de las obras, o entregue cantidades a cuenta al promotor de aquellas, siempre que el certificado final de obra se emita en un plazo no superior a cuatro años desde el inicio de la inversión.",
      "Se considerarán obras de rehabilitación de la vivienda habitual aquellas que tengan por objeto principal la reconstrucción de la vivienda mediante la consolidación y el tratamiento de las estructuras, fachadas o cubiertas y otras análogas siempre que el coste global de las operaciones de rehabilitación exceda del 25 por ciento del precio de adquisición si se hubiese efectuado esta durante los dos años inmediatamente anteriores al inicio de las obras de rehabilitación o, en otro caso, del valor de mercado que tuviera la vivienda en el momento de dicho inicio. A estos efectos, se descontará del precio de adquisición o del valor de mercado de la vivienda la parte proporcional correspondiente al suelo.",
      "Municipios despoblación extrema e intensa 1 (405 KB - pdf )",
    ],
    limites: [
      "El 15 por 100 de las cantidades que durante el período impositivo se satisfagan por el contribuyente por la adquisición o rehabilitación de la vivienda que constituya o vaya a constituir su residencia habitual",
      "Estará constituida por las cantidades satisfechas para la adquisición o rehabilitación de la vivienda, incluidos los gastos originados que hayan corrido a cargo del adquirente.",
      "Cuando la adquisición o rehabilitación se realicen con financiación ajena formarán parte de la base de la deducción la amortización, los intereses, el coste de los instrumentos de cobertura del riesgo de tipo de interés variable de los préstamos hipotecarios regulados en el artículo decimonoveno de la Ley 36/2003, de 11 de noviembre, de Medidas de Reforma Económica, y demás gastos derivados de la misma. En caso de aplicación de los citados instrumentos de cobertura, los intereses satisfechos por el contribuyente se minorarán en las cantidades obtenidas por la aplicación del citado instrumento.",
      "a) Por todos los ejercicios en que se aplique la deducción:",
      "Será la menor de:",
      "180.000 euros, o",
      "Atención: en el caso de viviendas adquiridas por varios contribuyentes la cuantía de 180.000 euros, está referida a la vivienda, por lo que dicho importe deberá ser distribuido entre los adquirentes en proporción al porcentaje de titularidad que tengan en la vivienda.",
      "El importe de adquisición o rehabilitación de la vivienda que da origen a la deducción, minorado por los importes recibidos de la Junta de Comunidades de Castilla-La Mancha en concepto de subvenciones por la adquisición o rehabilitación de la vivienda.",
      "b) En cada ejercicio:",
      "La base máxima a aplicar en cada ejercicio será de 12.000 euros.",
      "Esta base máxima anual de la deducción será de 12.000 euros tanto en tributación individual como en conjunta. Esto es, en tributación conjunta la base máxima anual (12.000 euros) se aplica con independencia del número de miembros de la unidad familiar que satisfagan los importes que dan derecho a aplicar la deducción.",
      "c) Otras condiciones",
      "Cuando se adquiera una vivienda habitual habiendo disfrutado ya de esta misma deducción, la base máxima total de la deducción se minorará en las cantidades invertidas en la adquisición de las viviendas anteriores, en tanto dichas cantidades hubieran sido objeto de deducción.",
      "Cuando con ocasión de la enajenación de una vivienda habitual por la que se hubiera practicado esta deducción se genere una ganancia patrimonial exenta por reinversión, la base de deducción por la adquisición o rehabilitación de la nueva vivienda se minorará en el importe de la ganancia patrimonial a la que se aplique la exención por reinversión. En este caso, no se podrá practicar deducción por la adquisición de la nueva mientras las cantidades invertidas en la misma no superen tanto el precio de la anterior, en la medida en que haya sido objeto de deducción, como la ganancia patrimonial exenta por reinversión.",
      "En los supuestos de nulidad matrimonial, divorcio o separación judicial, el contribuyente podrá seguir practicando esta deducción, en los términos previstos en la normativa estatal del Impuesto sobre la Renta de las Personas Físicas, por las cantidades satisfechas en el período impositivo para la adquisición de la que fue durante la vigencia del matrimonio su vivienda habitual, siempre que continúe teniendo esta condición para los hijos comunes y el progenitor en cuya compañía queden.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Reserva para 2025: el artículo 18.8 de Ley 1/2026 añade la incompatibilidad entre intereses de primera vivienda (art.12) y adquisición o rehabilitación rural (art.12 ter); DF6 da efectos 2025 al artículo 18. El aviso oficial de campaña excluye esta incompatibilidad de 2025 y el manual mantiene ambas compatibles. Debe resolverse esta discrepancia jurídica antes de combinar ambas deducciones.",
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_traslado_vivienda_habitual",
      nombreCatalogadoDesdeCodigo("clm_traslado_vivienda_habitual"),
      categoriaCatalogadaDesdeCodigo("clm_traslado_vivienda_habitual"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [273, 274, 275],
      [
        "clm_traslado_vivienda_habitual:importe",
        "clm_traslado_vivienda_habitual:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 12 quater. Deducción por traslado de vivienda habitual.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "El traslado de la residencia habitual debe producirse por motivos laborales.",
      "Siempre que el traslado se produzca por motivos laborales, la deducción será aplicable tanto a los trabajadores por cuenta ajena como a los empresarios o profesionales autónomos",
      "El traslado de la residencia habitual debe realizarse a un municipio de Castilla-La Mancha de los incluidos en las zonas escasamente pobladas a que se refiere el artículo 12 de la Ley 2/2021, de 7 de mayo, de Medidas Económicas, Sociales y Tributarias frente a la Despoblación y para el Desarrollo del Medio Rural en Castilla-La Mancha.",
      'Conforme al artículo 12 de la Ley 2/2021 "se clasificarán como zonas escasamente pobladas, aquellas agrupaciones de municipios o núcleos de población integradas mayoritariamente por municipios de pequeño tamaño, con una densidad conjunta de población de menos de 12,5 habitantes por km2, altas tasas de envejecimiento y pérdidas intensas de población, con un importante aislamiento geográfico con respecto a municipios de más de 30.000 habitantes, un alto porcentaje de suelo de uso forestal, y una elevada significación de la actividad agraria.',
      "En consideración al grado de despoblación, se establecen las siguientes categorías de zonas escasamente pobladas:",
      "Zonas de intensa despoblación: Aquellas agrupaciones de municipios con densidad superior a 8 habitantes por km2. a.",
      'Zonas de extrema despoblación: Aquellas agrupaciones de municipios con densidad de población menor de 8 habitantes por km2". b.',
      "Puede consultar las zonas que posibilitan la aplicación de la deducción en el enlace indicado al término de la presente sección.",
      "Atención: para la aplicación de esta deducción se tomará como población de los municipios la que, conforme a su respectivo padrón municipal, tuvieran a 1 de enero de cada año.",
      "A los efectos indicados en el párrafo anterior no se tomarán en consideración las variaciones de población respecto al padrón municipal de 2021 que supongan una minoración o inaplicación de las deducciones que conforme al mismo resultasen procedentes. En tales casos, dichas deducciones podrán seguir aplicándose en las condiciones y cuantías que resultasen procedentes conforme a la población del expresado padrón municipal.",
      "La base liquidable del periodo impositivo en el que se hubieran comenzado a aplicar las deducciones aludidas en el punto anterior, deberá ser inferior a:",
      "- 22.946 euros en tributación individual o",
      "- 31.485 euros en tributación conjunta.",
      "Para consolidar el derecho a la deducción, es preciso que el contribuyente permanezca en la nueva residencia habitual durante el año en que se produce el traslado y los tres siguientes.",
      "El incumplimiento de cualquiera de los requisitos anteriores dará lugar a la devolución de las cantidades deducidas de la cuota íntegra autonómica del ejercicio en que se produzca el incumplimiento, con los correspondientes intereses de demora.",
      "Se excepciona de la pérdida del derecho a la deducción practicada los supuestos en los que el incumplimiento sea debido al fallecimiento del contribuyente.",
      "Municipios despoblación extrema e intensa 2 (401 KB - pdf )",
    ],
    limites: [
      "500 euros por los gastos ocasionados al trasladar la residencia habitual",
      "Este importe se aplicará en el periodo impositivo en el que se produzca el cambio de residencia y en el siguiente.",
      "Importante: los contribuyentes que trasladaron su residencia en 2024 a zonas escasamente pobladas de Castilla-La Mancha por motivos laborales pueden aplicar esta deducción en 2025 por ser el período impositivo siguiente a aquel en que se produjo el cambio de residencia, siempre y cuando se cumplan los restantes requisitos y condiciones exigidos para su aplicación, incluidos los límites de base liquidables (22.946 euros en tributación individual o 31.485 euros en tributación conjunta ) señalados en el apartado “Requisitos para la aplicación de la deducción”.",
      "Límite: el importe de la deducción no podrá exceder de la parte autonómica de la cuota íntegra procedente de los rendimientos del trabajo y de las actividades económicas del ejercicio en que resulte aplicable la deducción.",
      "En el caso de que ambos cónyuges generen derecho a la deducción, en tributación conjunta, el límite máximo de la deducción es único para la declaración en su conjunto por lo que su determinación se hará tomando en consideración el conjunto de los rendimientos del trabajo y de actividades económicas obtenidos por ambos cónyuges y se aplicará al importe total de la deducción que de acuerdo con lo que exponemos en el punto siguiente será 500 euros por cada contribuyente (por tanto, 1.000 euros en tributación conjunta)",
      "En el supuesto de tributación conjunta, la deducción de 500 euros se aplicará, en cada uno de los periodos impositivos en que sea aplicable la deducción, por cada uno de los contribuyentes que traslade su residencia en los términos anteriormente comentados, con el límite de la parte autonómica de la cuota íntegra procedente de rendimientos del trabajo y de actividades económicas que corresponda a los contribuyentes que generen derecho a la aplicación de la deducción.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_inversion_acciones_participaciones_mercantiles",
      nombreCatalogadoDesdeCodigo(
        "clm_inversion_acciones_participaciones_mercantiles"
      ),
      categoriaCatalogadaDesdeCodigo(
        "clm_inversion_acciones_participaciones_mercantiles"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [276, 277],
      [
        "clm_inversion_acciones_participaciones_mercantiles:importe",
        "clm_inversion_acciones_participaciones_mercantiles:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 12 sexies. Deducción por inversión en la adquisición de acciones y participaciones sociales como consecuencia de acuerdos de constitución de sociedades o ampliación de capital en las sociedades mercantiles.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Para la aplicación de la deducción deberán cumplirse los siguientes requisitos:",
      "La participación adquirida por el contribuyente como consecuencia de la inversión, computada junto con la que posean de la misma entidad su cónyuge o personas unidas al contribuyente por razón de parentesco hasta el tercer grado incluido, en línea recta o colateral, por consanguinidad o afinidad, no puede ser superior durante ningún día del año natural al 40 por 100 del total del capital social de la entidad o de sus derechos de voto.",
      "Que dicha participación se mantenga en el patrimonio del contribuyente un mínimo de tres años siguientes a la constitución o ampliación.",
      "El contribuyente durante dicho plazo mínimo de tres años no debe ejercer funciones ejecutivas ni de dirección en la entidad.",
      "Que la entidad de la que se adquieran las acciones o participaciones cumpla los siguientes requisitos:",
      "Que tenga su domicilio social y fiscal en la Comunidad de Castilla-La Mancha. 1.",
      "Que desarrolle una actividad económica.",
      "A estos efectos, no se considerará que desarrolla una actividad económica cuando tenga por actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo establecido en el artículo 4.Ocho.Dos.a) de la Ley 19/1991, de 6 de",
      "junio, del Impuesto sobre el Patrimonio.",
      "En el caso en que la inversión efectuada corresponda a la constitución de la entidad, que dicha entidad cuente, al menos, con una persona contratada con contrato laboral a jornada completa o con dos personas con contrato laboral a tiempo parcial, siempre que el cómputo total de horas en el supuesto de contrato laboral a tiempo parcial sea igual o superior al establecido para una persona con contrato laboral a jornada completa. En cualquier caso, los trabajadores deberán estar dados de alta en el Régimen correspondiente de la Seguridad Social y las condiciones del contrato deberán mantenerse durante al menos 24 meses.",
      "En caso de que la inversión se haya realizado mediante una ampliación de capital de la entidad, que dicha entidad hubiera sido constituida dentro de los tres años anteriores a la ampliación de capital y que la plantilla media de la entidad durante los dos ejercicios fiscales posteriores al de la ampliación se incremente respecto de la plantilla media que tuviera en los doce meses anteriores al menos en una persona con los requisitos anteriores, y que dicho incremento se mantenga durante al menos otros veinticuatro meses.",
      "Para el cálculo de la plantilla media total de la entidad y de su incremento se tomarán las personas empleadas, en los términos que disponga la legislación laboral teniendo en cuenta la jornada contratada en relación con la jornada completa.",
      "Las operaciones que generen el derecho a la deducción deberán formalizarse en escritura pública, en la que se deberá especificar la identidad de los inversores y el importe de la inversión respectiva.",
      "El incumplimiento de los requisitos anteriores conlleva la integración de las cantidades deducidas en la cuota íntegra autonómica del ejercicio en que se produzca el incumplimiento, con los correspondientes intereses de demora.",
    ],
    limites: [
      "El 20 por 100 de las cantidades invertidas durante el ejercicio en la adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital en las sociedades mercantiles que revistan la forma de Sociedad Anónima o Sociedad de Responsabilidad Limitada, Sociedad Anónima Laboral, Sociedad de Responsabilidad Limitada laboral y Sociedad Cooperativa.",
      "El límite de deducción aplicable es de 4.000 euros anuales por contribuyente.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "La presente deducción resulta incompatible, para las mismas inversiones, con la aplicación de la deducción autonómica “Por inversión en entidades de la economía social”.",
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por inversión en la adquisición de acciones y participaciones sociales en entidades nuevas o de reciente creación de Andalucía, Aragón, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla y León, Castilla-La Mancha, Cataluña, Extremadura, Galicia, Madrid, Murcia y Comunitat Valenciana" del Anexo B.11 de la declaración.',
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_inversion_economia_social",
      nombreCatalogadoDesdeCodigo("clm_inversion_economia_social"),
      categoriaCatalogadaDesdeCodigo("clm_inversion_economia_social"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [277, 278, 279],
      [
        "clm_inversion_economia_social:importe",
        "clm_inversion_economia_social:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 12 septies. Deducción por inversión en entidades de la economía social.; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "La participación alcanzada por el contribuyente como consecuencia de la aportación realizada, computada junto con la que posean de la misma entidad su cónyuge o personas unidas al contribuyente por razón de parentesco hasta el tercer grado incluido, en línea recta o colateral, por consanguinidad o afinidad, no puede ser superior al 40 por 100 del total del capital social de la entidad objeto de la inversión o de sus derechos de voto.",
      "Que la entidad en la que debe materializarse la inversión cumpla los siguientes requisitos:",
      "Que forme parte de la economía social, en los términos previstos en la Ley 5/2011, de 29 de marzo, de Economía Social. 1.",
      "Que tenga su domicilio social y fiscal en la Comunidad de Castilla-La Mancha. 2.",
      "Que cuente, como mínimo, con una persona ocupada con contrato laboral y a jornada completa, y dada de alta en el régimen general de la Seguridad Social. 3.",
      "Las operaciones que generen el derecho a la deducción deberán formalizarse en escritura pública, en la que se hará constar la identidad de los inversores y el importe de la inversión respectiva.",
      "Que dichas aportaciones se mantengan en el patrimonio del contribuyente durante un mínimo de cinco años a contar desde la aportación.",
      "Los requisitos que ha de cumplir la entidad en la que debe materializarse la inversión deberán cumplirse durante un periodo mínimo de cinco años a contar desde la aportación.",
      "El incumplimiento de los requisitos y condiciones anteriores a excepción del relativo a la formalización de las operaciones en escritura pública, comporta la pérdida del beneficio fiscal y, en tal caso, el contribuyente deberá incluir en la declaración del IRPF correspondiente al ejercicio en que se haya producido el incumplimiento la parte del impuesto que se hubiera dejado de pagar como consecuencia de la deducción practicada, junto con los intereses de demora devengados.",
    ],
    limites: [
      "El 20 por 100 de las cantidades invertidas durante el ejercicio en las aportaciones realizadas con la finalidad de ser socio en entidades que formen parte de la economía social.",
      "El límite de deducción aplicable es de 4.000 euros anuales por contribuyente.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      'La presente deducción resultará incompatible, para las mismas inversiones, con la aplicación de la deducción autonómica "Por inversión en la adquisición de acciones y participaciones sociales como consecuencia de acuerdos de constitución de sociedades o ampliación de capital en las sociedades mercantiles".',
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por inversiones o donaciones a entidades de la Economía Social establecidas en Aragón, Cantabria, Castilla-La Mancha y la Región de Murcia" del Anexo B.11 de la declaración.',
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_ahorro_inversion_primera_vivienda",
      nombreCatalogadoDesdeCodigo("clm_ahorro_inversion_primera_vivienda"),
      categoriaCatalogadaDesdeCodigo("clm_ahorro_inversion_primera_vivienda"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [279, 280, 281],
      [
        "clm_ahorro_inversion_primera_vivienda:importe",
        "clm_ahorro_inversion_primera_vivienda:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa: "Artículo 12 octies; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Las cuentas deberán identificarse separadamente en la autoliquidación del impuesto, incluyendo la fecha de apertura y el incremento de saldo correspondiente al ejercicio (artículo 12 octies.3.g).",
      "Deberán estar separadas de cualquier otro tipo de imposición, pudiendo únicamente cada contribuyente mantener una cuenta de este tipo. a.",
      "El saldo de la cuenta a fecha de devengo del impuesto deberá ser superior a la fecha de devengo del periodo impositivo anterior, al menos por el mismo importe que ha dado derecho a practicarse la deducción.",
      "Se entenderá que no se incumple el requisito de disposición cuando las cantidades depositadas que hayan generado el derecho a la deducción se repongan o se aporten íntegramente, con anterioridad al devengo del Impuesto, a una cuenta de la misma o de otra entidad de crédito que cumpla la misma finalidad y condiciones.",
      "No se entenderá incumplido el requisito del destino del importe de la cuenta a la adquisición de la vivienda habitual en el supuesto de fallecimiento del contribuyente antes de la finalización del plazo máximo de 6 años.",
      "Las cantidades depositadas en las cuentas que hayan generado el derecho a la deducción no podrán volver a ser objeto de deducción cuando se destinen a la adquisición de la vivienda habitual.",
      "Que la edad del contribuyente sea inferior a 36 años.",
      "No obsante lo anterior, podrán incluirse en la deducción las aportaciones que el obligado realice en la cuenta dentro del ejercicio en el que cumpla los 36 años.",
      "Que la suma de la base imponible general y la del ahorro del contribuyente, casillas [0435] y [0460] de la declaración, no supere:",
      "- 27.000 euros en tributación individual.",
      "- 36.000 euros en tributación conjunta.",
      "En el caso de que se produzca un incumplimiento que origine la pérdida del derecho a las deducciones ya practicadas, deberá procederse a la regularización de acuerdo con lo establecido en la normativa estatal del impuesto.",
      'Importante: una vez introducido el importe por los contribuyentes con derecho a la deducción, éste aparecerá recogido en la casilla [0969] del Anexo B.4 de la declaración, "Otras deducciones".',
    ],
    limites: [
      "El 15 por 100 de las cantidades que se depositen durante el período impositivo en cuentas de entidades de crédito siempre que el importe depositado que haya generado el derecho a la deducción se destine, antes del transcurso de 6 años a partir de la fecha de apertura de la cuenta, a la adquisición o construcción de la primera vivienda habitual en el territorio de la Comunidad Autónoma de Castilla-La Mancha.",
      "Se entenderá por adquisición de vivienda la adquisición en sentido jurídico del derecho de propiedad o pleno dominio de la misma, sin que tal consideración quede desvirtuada porque esta propiedad se comparta con otros cotitulares.",
      "Se considerará vivienda habitual del contribuyente la edificación que constituya su residencia durante un plazo continuado de, al menos, tres años. No obstante, se entenderá que la vivienda tuvo el carácter de habitual cuando, a pesar de no haber transcurrido dicho plazo, se produzca el fallecimiento del contribuyente o concurran otras circunstancias que necesariamente exijan el cambio de domicilio, tales como celebración de matrimonio, separación matrimonial, traslado laboral, obtención del primer empleo, o cambio de empleo, u otras análogas justificadas. Para que la vivienda constituya la residencia habitual del contribuyente deberá ser habitada de manera efectiva y con carácter permanente por este, en un plazo de doce meses, contados a partir de la fecha de adquisición o terminación de las obras. No obstante, se entenderá que la vivienda no pierde el carácter de habitual cuando se produzca el fallecimiento del contribuyente o concurran otras circunstancias que necesariamente impidan la ocupación de la vivienda, en los términos previstos en el párrafo anterior. Cuando sean de aplicación las excepciones previstas en los dos párrafos anteriores, la deducción por adquisición de vivienda se practicará hasta el momento en que se den las circunstancias que necesariamente exijan el cambio de vivienda o impidan la ocupación de la misma.",
      "La deducción máxima total será de 3.000 euros y la deducción máxima anual de 750 euros.",
    ],
    prorrateo: [
      "En caso de tributación conjunta el importe de la deducción se prorrateará entre los contribuyentes en función de la aportación realizada por cada uno de ellos.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "clm_controles_veterinarios_perros_asistencia",
      nombreCatalogadoDesdeCodigo(
        "clm_controles_veterinarios_perros_asistencia"
      ),
      categoriaCatalogadaDesdeCodigo(
        "clm_controles_veterinarios_perros_asistencia"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [281, 282],
      [
        "clm_controles_veterinarios_perros_asistencia:importe",
        "clm_controles_veterinarios_perros_asistencia:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa: "Artículo 12 nonies; Ley 8/2013, de 21 de noviembre; IRPF 2025.",
    requisitos: [
      "Que se haya reconocido la unidad de vinculación entre el contribuyente y el perro de asistencia por la consejería competente en bienestar social conforme a la Ley 5/2018, de 21 de diciembre, o por otra comunidad autónoma.",
      "Los gastos deben estar efectivamente satisfechos por el contribuyente y justificados mediante factura expedida por profesional o centro veterinario legalmente autorizado; no pueden haber sido subvencionados por entidades públicas o privadas.",
      "La suma de la base imponible general y del ahorro no debe superar 27.000 euros en tributación individual ni 36.000 euros en tributación conjunta.",
      "El 30 por 100 de las cantidades satisfechas en el periodo impositivo en concepto de gastos veterinarios y vacunación derivados de la tenencia de perros de asistencia.",
    ],
    limites: [
      "El importe máximo es de 100 euros anuales por contribuyente, durante todo el período de tenencia del animal.",
      "El 30 por 100 de las cantidades satisfechas en el periodo impositivo en concepto de gastos veterinarios y vacunación derivados de la tenencia de perros de asistencia.",
      "Tendrán la consideración de gastos deducibles los relativos a vacunaciones, desparasitación, esterilización y demás tratamientos que resulten obligatorios conforme a la normativa específica aplicable a los perros de asistencia.",
      "Se entenderá por perro de asistencia, el que tras superar un proceso de selección genética y sanitaria ha finalizado su adiestramiento en una entidad especializada y oficialmente reconocida u homologada en la comunidad autónoma, con la adquisición de las aptitudes necesarias para dar servicio y asistencia a personas con discapacidad o que padecen alguna de las enfermedades indicadas en el apartado siguiente.",
      "Los perros de asistencia se clasifican en los siguientes tipos:",
      "Perro guía: el perro adiestrado para guiar a una persona con discapacidad visual, ya sea total o parcial, o con una discapacidad auditiva añadida. a.",
      "Perro de señalización de sonidos: el perro adiestrado para avisar a las personas con discapacidad auditiva de la emisión de sonidos y de su procedencia. b.",
      "Perro de servicio: el perro adiestrado para prestar ayuda y asistencia a las personas con discapacidad física en las actividades de la vida diaria, tanto en el entorno privado como en el externo. c.",
      "Perro de aviso: el perro adiestrado para dar una alerta médica a personas que padecen crisis recurrentes con desconexión sensorial derivadas de una enfermedad específica como la diabetes, la epilepsia u otra enfermedad orgánica reglamentariamente reconocida.",
      "Perro para personas con trastorno del espectro autista: el perro adiestrado para cuidar de la integridad física de una persona con trastorno del espectro autista, guiarla y controlar las situaciones de emergencia que pueda sufrir.",
      "No tendrán tal consideración:",
      "Los perros utilizados en actividades de terapia asistida con animales, aun cuando las personas destinatarias sean personas con discapacidad. a.",
      "También se excluyen los perros utilizados en proyectos de atención o tratamiento a víctimas de violencia de género u otros delitos, personas en riesgo o exclusión social o mayores; los perros de apoyo emocional a personas con trastornos de la personalidad o enfermedades mentales; y los animales de especies distintas de la canina.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const CLM_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...CLM_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  CLM_NACIMIENTO_ADOPCION_2025,
  CLM_FAMILIA_NUMEROSA_2025,
  CLM_DISCAPACIDAD_CONTRIBUYENTE_2025,
  CLM_DISCAPACIDAD_ASCENDIENTES_DESCENDIENTES_2025,
  CLM_MAYORES_75_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
