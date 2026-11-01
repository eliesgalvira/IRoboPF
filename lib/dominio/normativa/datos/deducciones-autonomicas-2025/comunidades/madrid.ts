import type { FichaDeduccionAutonomica } from "../tipos"
import {
  fichaImplementada,
  fichaImplementadaBasica,
  fichaImplementadaFormula,
} from "../helpers"

export const MADRID_NACIMIENTO_ADOPCION_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "madrid_nacimiento_adopcion_hijos",
    "Por nacimiento o adopción de hijos",
    "circunstancias_personales_familiares"
  ),
  cuantia: {
    tipo: "importe_fijo",
    euros: "721.70",
    por: "hijo nacido o adoptado",
  },
  requisitos: [
    "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    "1. Los contribuyentes podrán deducir 721,70 euros por cada hijo nacido o adoptado tanto en el período impositivo en el que se produzca el nacimiento o la adopción como en cada uno de los dos períodos impositivos siguientes.",
  ],
  limites: [
    "1. Los contribuyentes podrán deducir 721,70 euros por cada hijo nacido o adoptado tanto en el período impositivo en el que se produzca el nacimiento o la adopción como en cada uno de los dos períodos impositivos siguientes.",
    "2. En el caso de partos o adopciones múltiples la cuantía correspondiente al primer período impositivo en que se aplique la deducción se incrementará en 721,70 euros por cada hijo.",
    "1. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 6, 7 y 8 aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, no sea superior a 26.414,22 euros en tributación individual o a 37.322,20 euros en tributación conjunta.",
  ],
  prorrateo: [
    "3. Solo tendrán derecho a practicar la deducción los padres que convivan con los hijos nacidos o adoptados. Cuando los hijos nacidos o adoptados convivan con ambos progenitores el importe de la deducción se prorrateará por partes iguales en la declaración de cada uno de ellos si optaran por tributación individual.",
  ],
  compatibilidades: [
    'Esta deducción resulta compatible con la aplicación de la deducción autonómica "Por \nadopción internacional de niños".',
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "numeroHijosNacidosOAdoptados",
    "ejercicioNacimientoOAdopcion",
    "convivenAmbosProgenitores",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [404, 405],
  },
} as const satisfies FichaDeduccionAutonomica

export const MADRID_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "madrid_arrendamiento_vivienda_habitual",
    "Por arrendamiento de la vivienda habitual",
    "vivienda_habitual",
    {
      tipo: "porcentaje",
      porcentaje: "30",
      base: "cantidades satisfechas por arrendamiento de vivienda habitual",
      limiteMaximoEuros: "1237.20",
    },
    [
      "30% de cantidades satisfechas",
      "Límite máximo 1.237,20 euros",
      "Base imponible general + ahorro del contribuyente máximo 26.414,22 euros individual y 37.322,20 conjunta",
      "Base imponible general + ahorro de la unidad familiar máximo 61.860 euros",
    ],
    [409, 410, 411]
  ),
  requisitos: [
    "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    "c) Los contribuyentes que pretendan aplicar las deducciones establecidas en los artículos 8, 8 bis y 8 ter deberán estar en posesión del resguardo o, en su caso, de una copia del resguardo del depósito de la fianza en la Agencia de Vivienda Social de la Comunidad de Madrid formalizado por el arrendador, de acuerdo con lo dispuesto en el artículo 36 de la Ley 29/1994, de 24 de noviembre , y en el Decreto 181/1996, de 5 de diciembre, por el que se regula el régimen de depósito de fianzas de arrendamientos en la Comunidad de Madrid, o bien, en el caso de la deducción del artículo 8 poseer copia de la denuncia presentada ante dicho organismo por no haberles sido entregado dicho justificante por el arrendador.",
    "Los contribuyentes menores de cuarenta años podrán deducir el 30 por ciento, con un máximo de deducción de 1.237,20 euros, de las cantidades que hayan satisfecho en el período impositivo por el arrendamiento de su vivienda habitual. Solo se tendrá derecho a la deducción cuando las cantidades abonadas por el arrendamiento de la vivienda habitual superen el 20 por ciento de la base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro del contribuyente.",
  ],
  limites: [
    "Los contribuyentes menores de cuarenta años podrán deducir el 30 por ciento, con un máximo de deducción de 1.237,20 euros, de las cantidades que hayan satisfecho en el período impositivo por el arrendamiento de su vivienda habitual. Solo se tendrá derecho a la deducción cuando las cantidades abonadas por el arrendamiento de la vivienda habitual superen el 20 por ciento de la base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro del contribuyente.",
    "1. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 6, 7 y 8 aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, no sea superior a 26.414,22 euros en tributación individual o a 37.322,20 euros en tributación conjunta.",
  ],
  prorrateo: [],
  compatibilidades: [],
  incompatibilidades: [],
}

export const MADRID_GASTOS_EDUCATIVOS_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "madrid_gastos_educativos",
    "Por gastos educativos",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "15% escolaridad, 15% idiomas y 5% vestuario escolar. Límites 412,40/927,90/1.031 euros por hijo según conceptos",
    },
    [
      "15% de gastos de escolaridad",
      "15% de gastos de enseñanza de idiomas",
      "5% de vestuario de uso exclusivo escolar",
      "Límite 412,40 euros si solo idiomas y/o vestuario",
      "Límite 927,90 euros si hay escolaridad",
      "Límite 1.031 euros para primer ciclo de Educación Infantil",
    ],
    [420, 421, 422, 423]
  ),
  requisitos: [
    "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",

    "1. Los contribuyentes podrán deducir los porcentajes que se indican en el apartado 3 de los gastos educativos a que se refiere el apartado siguiente, originados durante el período impositivo por los hijos o descendientes por los que tengan derecho al mínimo por descendientes regulado en el artículo 58 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas, y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de No Residentes y sobre el Patrimonio.",
    "2. La base de deducción estará constituida por las cantidades satisfechas por los conceptos de escolaridad y adquisición de vestuario de uso exclusivo escolar de los hijos o descendientes durante las etapas correspondientes a la Educación Infantil, la Educación Básica Obligatoria y la Formación Profesional Básica, a que se refieren los artículos 3.3, 3.10, 4 y 14.1 de la Ley Orgánica 2/2006, de 3 de mayo , de Educación, así como por la enseñanza de idiomas, tanto si esta se imparte como actividad extraescolar como si tiene el carácter de educación de régimen especial. En el caso de hijos o descendientes que estén escolarizados en el primer ciclo de Educación Infantil a que se refiere el artículo 14.1 de la Ley Orgánica 2/2006, de 3 de mayo , de Educación, la base de deducción estará constituida exclusivamente por las cantidades satisfechas por el concepto de escolaridad que no se abonen mediante precios públicos ni mediante precios privados autorizados por la Administración.",
    "La base de deducción se minorará en el importe de las becas y ayudas obtenidas de la Comunidad de Madrid o de cualquier otra Administración Pública que cubran todos o parte de los gastos citados.",
    "3. Los porcentajes de deducción aplicables serán los siguientes:",
    "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    "d) Los contribuyentes que deseen gozar de la deducción establecida en el artículo 11 deberán estar en posesión de los correspondientes justificantes acreditativos del pago de los conceptos objeto de deducción.",
    "a) El 15 por ciento de los gastos de escolaridad y de enseñanza de idiomas.",
    "4. La cantidad a deducir no excederá de 412,40 euros por cada uno de los hijos o descendientes que generen el derecho a la deducción. En el caso de que el contribuyente tuviese derecho a practicar deducción por gastos de escolaridad, el límite anterior se elevará a 927,90 euros por cada uno de los hijos o descendientes.",
    "En el caso de hijos o descendientes que cursen durante el ejercicio estudios del primer ciclo de Educación Infantil el límite al que se refiere el párrafo anterior será de 1.031 euros por cada uno de ellos.",
    "2. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 10, 10 bis, 10 ter, 11, 11 bis, 13, y 13 bis aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, junto con la correspondiente al resto de miembros de su unidad familiar, no supere la cantidad en euros resultante de multiplicar por 30.930 el número de miembros de dicha unidad familiar.",
  ],
  limites: [
    "a) El 15 por ciento de los gastos de escolaridad y de enseñanza de idiomas.",
    "b) El 5 por ciento de los gastos de adquisición de vestuario de uso exclusivo escolar.",
    "4. La cantidad a deducir no excederá de 412,40 euros por cada uno de los hijos o descendientes que generen el derecho a la deducción. En el caso de que el contribuyente tuviese derecho a practicar deducción por gastos de escolaridad, el límite anterior se elevará a 927,90 euros por cada uno de los hijos o descendientes.",
    "En el caso de hijos o descendientes que cursen durante el ejercicio estudios del primer ciclo de Educación Infantil el límite al que se refiere el párrafo anterior será de 1.031 euros por cada uno de ellos.",
    "2. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 10, 10 bis, 10 ter, 11, 11 bis, 13, y 13 bis aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, junto con la correspondiente al resto de miembros de su unidad familiar, no supere la cantidad en euros resultante de multiplicar por 30.930 el número de miembros de dicha unidad familiar.",
  ],
  prorrateo: [
    "5. Solo tendrán derecho a practicar la deducción los padres o ascendientes que convivan con sus hijos o descendientes escolarizados. Cuando un hijo o descendiente conviva con ambos padres o ascendientes, el importe de la deducción se prorrateará por partes iguales en la declaración de cada uno de ellos, en caso de que optaran por tributación individual.",
  ],
  compatibilidades: [],
  incompatibilidades: [],
}

export const MADRID_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  {
    ...fichaImplementadaFormula("madrid_adopcion_internacional", [406]),
    requisitos: [
      "Se entenderá que la adopción tiene carácter internacional cuando así resulte de las normas y convenios aplicables a esta materia.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. En el supuesto de adopción internacional, los contribuyentes podrán deducir 721,70 euros por cada hijo adoptado en el período impositivo.",
    ],
    prorrateo: [
      "3. Cuando el niño adoptado conviva con ambos padres adoptivos el importe de la deducción se incrementará en un 50 % sobre la cifra establecida en los apartados anteriores, y se prorrateará por partes iguales en la declaración de cada uno de ellos si optaran por tributación individual.",
    ],
    compatibilidades: [
      "2. Esta deducción es compatible con la deducción por nacimiento o adopción de hijos regulada en el artículo 4 de esta ley.",
    ],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "721,70 por adoptado internacional; incremento 50% con ambos padres, mitad en individual; compatible art.4; sin límite específico de renta art.18.1 para art.5; justificación documental.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_acogimiento_familiar_menores",
      [406, 407]
    ),
    requisitos: [
      "1. Los contribuyentes podrán deducir, por cada menor en régimen de acogimiento familiar simple, permanente o preadoptivo, administrativo o judicial, siempre que convivan con el menor durante más de ciento ochenta y tres días del período impositivo, las siguientes cantidades:",
      "2. A efectos de determinación del número de orden del menor acogido solamente se computarán aquellos menores que hayan permanecido en dicho régimen durante más de ciento ochenta y tres días del período impositivo. En ningún caso, se computarán los menores que hayan sido adoptados durante dicho período impositivo por el contribuyente.",
      "3. No dará lugar a esta deducción el supuesto de acogimiento familiar preadoptivo cuando se produjera la adopción del menor durante el período impositivo, sin perjuicio de la aplicación de la deducción establecida en el artículo 4 de esta ley.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
      "a) Los contribuyentes que deseen gozar de la deducción establecida en el artículo 6 deberán estar en posesión del correspondiente certificado acreditativo de la formalización del acogimiento, expedido por la Consejería competente en la materia.",
    ],
    limites: [
      "a) 618,60 euros si se trata del primer menor en régimen de acogimiento familiar.",
      "b) 773,25 euros si se trata del segundo menor en régimen de acogimiento familiar.",
      "c) 927,90 euros si se trata del tercer menor en régimen de acogimiento familiar o sucesivo.",
      "1. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 6, 7 y 8 aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, no sea superior a 26.414,22 euros en tributación individual o a 37.322,20 euros en tributación conjunta.",
    ],
    prorrateo: [
      "4. En el supuesto de acogimiento de menores por matrimonios o uniones de hecho, el importe de la deducción se prorrateará por partes iguales en la declaración de cada uno de ellos si optaran por tributación individual.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "618,60/773,25/927,90 según orden; convivencia >183 días; excluir adoptados en el año; mitad por matrimonio o unión de hecho individual. Renta 26.414,22/37.322,20 inclusiva y certificado art.18.4.a.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_acogimiento_mayores_65_discapacidad",
      [408, 409]
    ),
    requisitos: [
      "2. No se podrá practicar la presente deducción en el supuesto de acogimiento de mayores de sesenta y cinco años, cuando el acogido esté ligado al contribuyente por un vínculo de parentesco de consanguinidad o de afinidad de grado igual o inferior al cuarto.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
      "b) Los contribuyentes que deseen gozar de la deducción establecida en el artículo 7 deberán disponer de un certificado, expedido por la Consejería competente en la materia, por el que se acredite que ni el contribuyente ni la persona acogida han recibido ayudas de la Comunidad de Madrid vinculadas con el acogimiento.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir 1.546,50 euros por cada persona mayor de sesenta y cinco años o con discapacidad igual o superior al 33 por 100, que conviva con el contribuyente durante más de ciento ochenta y tres días al año en régimen de acogimiento sin contraprestación, cuando no diera lugar a la obtención de ayudas o subvenciones de la Comunidad de Madrid.",
      "1. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 6, 7 y 8 aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, no sea superior a 26.414,22 euros en tributación individual o a 37.322,20 euros en tributación conjunta.",
    ],
    prorrateo: [
      "3. Cuando la persona acogida genere el derecho a la deducción para más de un contribuyente simultáneamente, el importe de la misma se prorrateará por partes iguales en la declaración de cada uno de ellos si optaran por tributación individual.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "1.546,50; mayor de 65 o discapacidad >=33%; >183 días, sin contraprestación ni ayuda autonómica; excluir parentesco hasta cuarto grado para mayores; repartir entre titulares individuales. Renta 26.414,22/37.322,20 inclusiva; certificado art.18.4.b.",
    },
  },
  {
    ...fichaImplementadaFormula("madrid_cuidado_ascendientes", [409]),
    requisitos: [
      "Remisión a los artículos 59 y 61 LIRPF: ascendiente mayor de 65 años o con discapacidad cualquiera que sea su edad, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros; convivencia al menos la mitad del período, con regla especial si fallece y asimilación de internamiento de ascendiente con discapacidad dependiente. El grado de parentesco determina la prioridad del mínimo.",

      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. Los contribuyentes podrán aplicar una deducción de 515,50 euros por cada ascendiente mayor de 65 años o con discapacidad, por el que puedan aplicarse el mínimo por ascendientes a que se refiere el artículo 59 de la Ley 35/2006, de 28 noviembre .",
    ],
    prorrateo: [
      "2. Cuando dos o más contribuyentes tengan derecho a la aplicación de la deducción respecto de los mismos ascendientes, su importe se prorrateará entre ellos por partes iguales.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "515,50 por ascendiente >65 o con discapacidad que genere mínimo art.59 LIRPF; reparto igual entre titulares. No trasladar límite de renta art.18.1 de acogimiento al art.7 bis.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_gastos_arrendamiento_viviendas",
      [411, 412]
    ),
    requisitos: [
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
      "c) Los contribuyentes que pretendan aplicar las deducciones establecidas en los artículos 8, 8 bis y 8 ter deberán estar en posesión del resguardo o, en su caso, de una copia del resguardo del depósito de la fianza en la Agencia de Vivienda Social de la Comunidad de Madrid formalizado por el arrendador, de acuerdo con lo dispuesto en el artículo 36 de la Ley 29/1994, de 24 de noviembre , y en el Decreto 181/1996, de 5 de diciembre, por el que se regula el régimen de depósito de fianzas de arrendamientos en la Comunidad de Madrid.",
    ],
    limites: [
      "Los contribuyentes que tengan inmuebles arrendados como vivienda podrán deducirse el 10 por ciento de las cantidades satisfechas en el ejercicio por gastos de conservación y reparación, la formalización de contratos de arrendamiento, primas de seguros por daños e impagos y la obtención de certificados de eficiencia energética vinculados con tales arrendamientos, con un límite de deducción de 154,65 euros anuales.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "10% conservación, reparación, formalización, seguros y certificado energético; máximo154,65 anual; arrendador de vivienda, no inquilino. Justificación general y fianza art.18.4.c.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_arrendamiento_viviendas_vacias",
      [412, 413, 414]
    ),
    requisitos: [
      "2. A estos efectos, se entenderá que una vivienda se encuentra vacía cuando no esté habitada, arrendada, en uso ni afecta a actividades económicas.",
      "4. Para aplicar esta deducción deberán cumplirse los siguientes requisitos:",
      "a) El contrato de arrendamiento deberá tener una duración efectiva de al menos tres años. No obstante, no se perderá el derecho a la deducción en caso de que el contrato de arrendamiento tenga una duración inferior a tres años cuando dicho inmueble pase a estar en situación de expectativa de alquiler y vuelva a ser objeto de un nuevo contrato de arrendamiento de vivienda dentro del plazo de seis meses desde la finalización del anterior contrato, siempre que la suma de los períodos de duración de los contratos de arrendamiento sea de, al menos, tres años.",
      "b) El arrendatario de la vivienda no podrá ser el cónyuge ni un pariente, por consanguinidad o por afinidad, hasta el tercer grado inclusive, del contribuyente.",
      "5. El incumplimiento de cualquiera de los requisitos exigidos originará la pérdida del derecho a la deducción, procediéndose a la regularización de acuerdo con lo establecido en la normativa estatal del Impuesto sobre la Renta de las Personas Físicas.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
      "c) Los contribuyentes que pretendan aplicar las deducciones establecidas en los artículos 8, 8 bis y 8 ter deberán estar en posesión del resguardo o, en su caso, de una copia del resguardo del depósito de la fianza en la Agencia de Vivienda Social de la Comunidad de Madrid formalizado por el arrendador, de acuerdo con lo dispuesto en el artículo 36 de la Ley 29/1994, de 24 de noviembre , y en el Decreto 181/1996, de 5 de diciembre, por el que se regula el régimen de depósito de fianzas de arrendamientos en la Comunidad de Madrid.",
    ],
    limites: [
      "1. Los contribuyentes propietarios o usufructuarios de viviendas vacías, durante al menos un año anterior a la celebración de un contrato de arrendamiento de vivienda sujeto a la Ley 29/1994, de 24 de noviembre , de Arrendamientos Urbanos, podrán deducir en la cuota íntegra autonómica 1.000 euros por cada uno de los bienes inmuebles destinados al arrendamiento de una vivienda, en el ejercicio en que se formalice el correspondiente contrato de arrendamiento.",
      "c) Sólo podrán aplicar esta deducción los contribuyentes titulares de un máximo de cinco inmuebles destinados a vivienda (excluidos garajes y trasteros).",
    ],
    prorrateo: [
      "3. El importe de la deducción se prorrateará en función del porcentaje de participación en la propiedad del inmueble.",
    ],
    compatibilidades: [
      "6. Esta deducción es compatible con la regulada en el artículo 8 bis.",
    ],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "1.000 por inmueble arrendado en el año; vacío >=1 año; máximo5 viviendas; reparto según propiedad; contrato efectivo >=3 años o reemplazo <=6 meses sumando3; excluir parentesco hasta tercero; regularizar incumplimiento; compatible8 bis, fianza18.4.c.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_donativos_fundaciones_clubes_deportivos",
      [414]
    ),
    requisitos: [
      "1. Los contribuyentes podrán deducir el 15 por 100 de las cantidades donadas a fundaciones que cumplan con los requisitos de la Ley 1/1998, de 2 de marzo , de Fundaciones de la Comunidad de Madrid, y persigan fines culturales, asistenciales, educativos o sanitarios o cualesquiera otros de naturaleza análoga a estos.",
      "En todo caso, será preciso que estas fundaciones se encuentren inscritas en el Registro de Fundaciones de la Comunidad de Madrid, rindan cuentas al órgano de protectorado correspondiente y que este haya ordenado su depósito en el Registro de Fundaciones.",
      "2. Los contribuyentes podrán deducir el 15 por 100 de las cantidades donadas a clubes deportivos elementales y básicos, definidos en los artículos 29 y 30 de la Ley 15/1994, de 28 de diciembre , del Deporte de la Comunidad de Madrid.",
      "En todo caso, será preciso que estos clubes se encuentren inscritos en el Registro de Asociaciones Deportivas de la Comunidad de Madrid.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "3. A efectos de la aplicación de la deducción contenida en el artículo 9, la base de la misma no podrá exceder del 10 por cien de la base liquidable, entendiendo como tal la suma de la base liquidable general y la del ahorro del contribuyente.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15%; fundaciones elegibles inscritas y cuentas depositadas o clubes inscritos; base máxima10% de base liquidable general+ahorro, no deducción10%; documentación art.18.4.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_incremento_costes_financiacion_vivienda",
      [414, 415, 416]
    ),
    requisitos: [
      "Vivienda habitual por remisión a la DA 23 LIRPF y su desarrollo: residencia continuada durante tres años y ocupación efectiva y permanente en doce meses desde adquisición o terminación. Fallecimiento o circunstancias que necesariamente exijan cambiar de vivienda permiten las excepciones legales; el disfrute de vivienda por cargo o empleo tiene regla específica de ocupación.",

      "1. Los contribuyentes que satisfagan sumas en concepto de intereses derivados de un préstamo hipotecario constituido para la adquisición de la vivienda habitual podrán aplicar una deducción por el incremento de los costes financieros derivado de la variación de los tipos de interés.",
      "Serán requisitos necesarios para la aplicación de esta deducción que la adquisición de la vivienda habitual se realice mediante un préstamo hipotecario concertado con entidad financiera a tipo de interés variable y se haya efectuado antes del inicio del período impositivo y que, en el momento de aplicar la deducción, el inmueble siga teniendo la consideración de vivienda habitual del contribuyente.",
      "A tal efecto, se considerará vivienda habitual la que se ajusta a la definición y requisitos establecidos en la disposición adicional vigésima tercera de la Ley 35/2006, de 28 de noviembre , y en su normativa de desarrollo.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "2. La deducción a practicar será el resultado de aplicar el porcentaje de deducción del 25 por ciento sobre el exceso correspondiente a los intereses satisfechos en el período impositivo, según las condiciones particulares del préstamo hipotecario, sobre los intereses que se hubieran satisfecho en el período impositivo si se hubiera aplicado a las citadas condiciones, en ese ejercicio, el euríbor correspondiente al mes de diciembre de 2022, con el límite de 300 euros anuales.",
      "3. Sólo tendrán derecho a la aplicación de la deducción los contribuyentes que hayan adquirido una vivienda cuyo precio de adquisición, sin considerar los gastos y tributos inherentes a la adquisición, sea igual o inferior a 390.000,00 euros.",
      "2. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 10, 10 bis, 10 ter, 11, 11 bis, 13, y 13 bis aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, junto con la correspondiente al resto de miembros de su unidad familiar, no supere la cantidad en euros resultante de multiplicar por 30.930 el número de miembros de dicha unidad familiar.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "4. Esta deducción es incompatible con la deducción que regula el artículo 12.",
    ],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "25% exceso de intereses frente a euríbor diciembre2022, máximo300; hipoteca variable para adquisición previa al año, vivienda habitual precio sin gastos <=390.000; incompatible art.12; renta familiar <=30.930 por miembro.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_cambio_residencia_municipio_despoblacion",
      [416, 417, 418]
    ),
    requisitos: [
      "2. El incumplimiento de cualquiera de los requisitos exigidos originará la pérdida del derecho a la deducción, procediéndose a la regularización de acuerdo con lo establecido en la normativa estatal del Impuesto sobre la Renta de las Personas Físicas.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. Los contribuyentes menores de treinta y cinco años que trasladen su residencia habitual a un municipio de la Comunidad de Madrid que tenga una población inferior a 2.500 habitantes a fecha 1 de enero del ejercicio anterior al del devengo de la deducción, de acuerdo con los datos publicados por el INE, mediante la adquisición onerosa de su vivienda habitual o mediante un contrato de arrendamiento de vivienda sujeto a la Ley 29/1994, de 24 de noviembre , de Arrendamientos Urbanos, siempre que el arrendador no sea cónyuge o un pariente, por consanguinidad o por afinidad, hasta el tercer grado inclusive, del contribuyente, se podrán practicar una deducción en la cuota íntegra autonómica por importe de 1.000 euros, tanto en el período impositivo en el que se produzca el cambio de residencia como en el siguiente, siempre y cuando el contribuyente mantenga su residencia en dicho municipio durante el período impositivo en el que se produce el traslado de residencia y en los tres períodos impositivos siguientes.",
      "2. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 10, 10 bis, 10 ter, 11, 11 bis, 13, y 13 bis aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, junto con la correspondiente al resto de miembros de su unidad familiar, no supere la cantidad en euros resultante de multiplicar por 30.930 el número de miembros de dicha unidad familiar.",
    ],
    prorrateo: [],
    compatibilidades: [
      "3. Esta deducción es compatible con la deducción regulada en el artículo 10 ter.",
    ],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "1.000 en traslado y siguiente; <35 años; municipio<2.500 a1 enero año anterior; compra onerosa o arrendamiento sin parentesco hasta tercero; mantener residencia año+3; regularizar incumplimiento; compatible10 ter; renta familiar <=30.930 por miembro.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_vivienda_municipios_despoblacion",
      [418, 419, 420]
    ),
    requisitos: [
      "Vivienda habitual por remisión a la DA 23 LIRPF y su desarrollo: residencia continuada durante tres años y ocupación efectiva y permanente en doce meses desde adquisición o terminación. Fallecimiento o circunstancias que necesariamente exijan cambiar de vivienda permiten las excepciones legales; el disfrute de vivienda por cargo o empleo tiene regla específica de ocupación.",

      "A tal efecto, se considerará vivienda habitual la que se ajusta a la definición y requisitos establecidos en la disposición adicional vigésima tercera de la Ley 35/2006, de 28 de noviembre , y en el artículo 41 del Real Decreto 439/2007, de 30 de marzo , por el que se aprueba el Reglamento del Impuesto sobre la Renta de las Personas Físicas y se modifica el Reglamento de Planes y Fondos de Pensiones, aprobado por Real Decreto 304/2004, de 20 de febrero .",
      "2. A efectos de lo dispuesto en este artículo, se considerará como precio de adquisición de la vivienda el importe real por el que se efectúe tal adquisición más los gastos y tributos inherentes, excluidos los intereses, que hubieran sido satisfechos por el contribuyente.",
      "3. El incumplimiento de cualquiera de los requisitos exigidos originará la pérdida del derecho a la deducción, procediéndose a la regularización de acuerdo con lo establecido en la normativa estatal del Impuesto sobre la Renta de las Personas Físicas.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. Los contribuyentes menores de treinta y cinco años que adquieran un inmueble que vaya a constituir su vivienda habitual, siempre que dicho inmueble esté situado en un municipio de la Comunidad de Madrid que cuente con una población inferior a 2.500 habitantes a fecha 1 de enero del ejercicio anterior al del devengo de la deducción, de acuerdo con los datos publicados por el INE, podrán deducir en la cuota íntegra autonómica el 10 por ciento del precio de adquisición de la vivienda adquirida, siempre que el contribuyente mantenga la residencia habitual en dicho municipio y su vivienda durante el período impositivo en el que se produzca la adquisición y en los 3 períodos impositivos siguientes.",
      "2. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 10, 10 bis, 10 ter, 11, 11 bis, 13, y 13 bis aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, junto con la correspondiente al resto de miembros de su unidad familiar, no supere la cantidad en euros resultante de multiplicar por 30.930 el número de miembros de dicha unidad familiar.",
    ],
    prorrateo: [
      "El importe de la deducción se prorrateará por décimas partes y se aplicará en el período impositivo en el que se produzca la adquisición y los nueve períodos impositivos siguientes, sin que la deducción anual aplicable pueda superar los 1.546,50 euros.",
    ],
    compatibilidades: [
      "4. Esta deducción será compatible, para las mismas inversiones, con las deducciones reguladas en los artículos 10 bis y 12 de esta ley.",
    ],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "10% precio incluidos gastos y tributos sin intereses, décimas durante10 años, máximo1.546,50 anual; <35; municipio<2.500 a1 enero previo; mantener vivienda y municipio año+3; compatible10 bis y12; renta familiar <=30.930 por miembro; DA23 LIRPF/art.41 RIRPF.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_cuidado_hijos_mayores_dependientes_discapacidad",
      [423, 424, 425]
    ),
    requisitos: [
      "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",
      "Remisión a los artículos 59 y 61 LIRPF: ascendiente mayor de 65 años o con discapacidad cualquiera que sea su edad, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros; convivencia al menos la mitad del período, con regla especial si fallece y asimilación de internamiento de ascendiente con discapacidad dependiente. El grado de parentesco determina la prioridad del mínimo.",

      "2. La deducción resultará aplicable por las cotizaciones correspondientes a los meses del periodo impositivo en los que concurra alguna de las circunstancias siguientes:",
      "a) Que el contribuyente tenga, al menos, un hijo menor de 3 años por el que se aplique el mínimo por descendientes.",
      "b) Que el contribuyente conviva con un ascendiente, descendiente, colateral por consanguinidad de segundo grado, o cónyuge, en todos los casos mayores de 65 años, que tenga reconocido alguno de los grados de dependencia de los previstos en el artículo 26 de la Ley 39/2006, de 14 de diciembre , de Promoción de la Autonomía Personal y Atención a las personas en situación de dependencia.",
      "d) Que el contribuyente tenga reconocido alguno de los grados de dependencia o de discapacidad de los referidos en las letras b) y c) anteriores.",
      "4. Para la aplicación de la deducción regulada en este artículo deben cumplirse los siguientes requisitos:",
      "a) El contribuyente debe estar en situación de alta en la Seguridad Social como empleador titular de un hogar familiar, tener contratada y cotizar por una o varias personas por el Sistema Especial de Empleados de Hogar del Régimen General de la Seguridad Social durante el periodo en que se pretenda aplicar la deducción.",
      "Asimismo, será necesario que la persona o personas contratadas presten servicios para el titular del hogar familiar durante, al menos, 40 horas mensuales.",
      "b) En el caso de aplicarse la deducción por concurrir la circunstancia indicada en la letra a) del apartado 2 de este artículo, el contribuyente empleador y, en su caso, el otro progenitor del hijo menor de 3 años por el que se apliquen el mínimo por descendientes, deben realizar una actividad por cuenta propia o ajena por la que estén dados de alta en el régimen correspondiente de la Seguridad Social o mutualidad, al menos, durante 183 días dentro del periodo impositivo.",
      "En caso de que el contribuyente tenga hijos menores de 3 años con diferentes progenitores, podrá aplicarse la deducción cuando se cumpla el requisito indicado en el párrafo anterior respecto de cualquiera de ellos.",
      "c) En el caso de aplicarse la deducción por concurrir las circunstancias indicadas en las letras b) y c) del apartado 2 de este artículo, el contribuyente empleador debe encontrarse en alguna de las siguientes situaciones:",
      "1.º Realizar una actividad por cuenta propia o ajena por la que esté dado de alta en el régimen correspondiente de la Seguridad Social o mutualidad, al menos, durante 183 días dentro del periodo impositivo.",
      "2.º Percibir prestaciones contributivas y asistenciales del sistema de protección del desempleo, pensiones abonadas por el Régimen General y los Regímenes especiales de la Seguridad Social o por el Régimen de Clases Pasivas del Estado, o prestaciones análogas a las anteriores reconocidas a los profesionales no integrados en el régimen especial de la Seguridad Social de los trabajadores por cuenta propia o autónomos por las mutualidades de previsión social que actúen como alternativas al régimen especial de la Seguridad Social mencionado, siempre que se trate de prestaciones por situaciones idénticas a las previstas para la correspondiente pensión de la Seguridad Social.",
      "No será exigible lo contenido en esta letra en caso de aplicarse la deducción por la circunstancia indicada en la letra d) del apartado 2.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. Los contribuyentes que tengan contratada a una persona por la que se efectúen cotizaciones por el Sistema Especial de Empleados de Hogar del Régimen General de la Seguridad Social podrán deducir, en las condiciones establecidas en el presente artículo, el 25 por ciento de las cuotas ingresadas por tales cotizaciones, con el límite de deducción de 463,95 euros anuales.",
      "En el caso de contribuyentes que sean titulares de una familia numerosa la deducción será del 40 por ciento de las cuotas ingresadas, con el límite de deducción de 618,60 euros anuales.",
      "c) Que el contribuyente conviva con un ascendiente, descendiente, colateral por consanguinidad de segundo grado, o cónyuge que tenga reconocido un grado de discapacidad igual o superior al 33 por ciento.",
      "A los efectos de lo dispuesto en esta letra, se considerará acreditado un grado de discapacidad igual o superior al 33 por ciento en el caso de los pensionistas de la Seguridad Social que tengan reconocida una pensión de incapacidad permanente total, absoluta o gran invalidez y en el caso de los pensionistas de clases pasivas que tengan reconocida una pensión de jubilación o retiro por incapacidad permanente para el servicio o inutilidad. Igualmente, se considerará acreditado un grado de discapacidad igual o superior al 65 por ciento, cuando se trate de personas cuya incapacidad sea declarada judicialmente, aunque no alcance dicho grado.",
      "3. A efectos de lo dispuesto en las letras b) y c) del apartado 2, solo se tendrán en consideración los ascendientes y descendientes por los que el contribuyente tenga derecho a la aplicación del mínimo por ascendientes y descendientes, así como el cónyuge y los colaterales hasta el segundo grado de parentesco por consanguinidad que convivan con el contribuyente durante más de 183 días del periodo impositivo y no tengan rentas anuales, excluidas las exentas, superiores a 8.000 euros.",
      "2. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 10, 10 bis, 10 ter, 11, 11 bis, 13, y 13 bis aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, junto con la correspondiente al resto de miembros de su unidad familiar, no supere la cantidad en euros resultante de multiplicar por 30.930 el número de miembros de dicha unidad familiar.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "25% cuotas hogar máximo463,95 o40% máximo618,60 familia numerosa; meses con hijo<3, dependiente>65 o discapacidad>=33; mínimo familiar, cónyuge/colateral segundo >183 días y rentas<=8.000; empleador y servicio>=40h/mes; alta laboral183 días salvo excepciones expresas; renta familiar <=30.930 por miembro.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_intereses_vivienda_jovenes_menores_30",
      [426]
    ),
    requisitos: [
      "Vivienda habitual por remisión a la DA 23 LIRPF y su desarrollo: residencia continuada durante tres años y ocupación efectiva y permanente en doce meses desde adquisición o terminación. Fallecimiento o circunstancias que necesariamente exijan cambiar de vivienda permiten las excepciones legales; el disfrute de vivienda por cargo o empleo tiene regla específica de ocupación.",

      "A tal efecto, se considerará vivienda habitual la que se ajusta a la definición y requisitos establecidos en la disposición adicional vigésima tercera de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas, y en su normativa de desarrollo, en su redacción vigente desde el 1 de enero de 2013.",
      "2. La deducción resultará aplicable por los intereses satisfechos hasta el mes anterior a aquel en que el contribuyente cumpla los treinta años de edad.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. Los contribuyentes menores de treinta años podrán deducirse el 25 por ciento de los intereses satisfechos durante el período impositivo por préstamos hipotecarios obtenidos para la adquisición de su vivienda habitual, con el límite máximo de deducción de 1.031 euros anuales.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "25% intereses hipoteca habitual máximo1.031; solo hasta mes anterior a cumplir30; definición DA23 LIRPF; sin trasladar renta art.18.2 a art.12.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_intereses_estudios_grado_master_doctorado",
      [426, 427, 428]
    ),
    requisitos: [
      "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",

      "1. Los contribuyentes podrán deducir el importe de los intereses pagados en el período impositivo correspondientes a préstamos obtenidos para cursar estudios universitarios en cualquiera de los tres ciclos a que se refiere el artículo 37 de la Ley Orgánica 6/2001, de 21 de diciembre , de Universidades. Asimismo, serán deducibles los intereses satisfechos por préstamos obtenidos para la realización de estudios que permitan la obtención de un título propio de Máster de la entidad que lo organice, siempre que dicha entidad imparta también formación que permita la obtención de un título oficial de los que se regulan el artículo 35 de la Ley Orgánica 6/2001, de 21 de diciembre .",
      "2. La deducción será aplicable por quien resulte obligado a satisfacer tales intereses siempre que el préstamo se haya concedido para la realización de los estudios por el propio contribuyente, su cónyuge o cualquiera de los descendientes por los que tenga derecho a aplicar el mínimo por descendientes a que se refiere el artículo 58 de la Ley 35/2006, de 28 de noviembre , o a los que satisfaga anualidades por alimentos que gocen de la aplicación de las especialidades a que se refieren los artículos 64 y 75 de la misma Ley.",
      "3. Sólo serán deducibles los intereses satisfechos por préstamos concedidos por entidades de crédito a las que se refiere el artículo 1 de la Ley 10/2014, de 26 de junio , de ordenación, supervisión y solvencia de entidades de crédito, sin perjuicio de que la concesión del préstamo haya sido gestionada a través de programas u organismos públicos.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
      "e) Los contribuyentes que pretendan aplicar la deducción establecida en el artículo 12 bis deberán haber hecho constar en el contrato de préstamo o crédito suscrito el destino de los fondos y haber acreditado dicho destino mediante los justificantes oportunos.",
    ],
    limites: [],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Intereses pagados, sin porcentaje reductor ni tope expreso; préstamo entidad de crédito para estudios propios,cónyuge,descendiente con mínimo o alimentos; oficiales o máster propio de entidad que también imparta oficial; destino contractual y justificantes18.4.e; no aplicar renta de18.2.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_vivienda_nacimiento_adopcion_hijos",
      [428, 429, 430, 431]
    ),
    requisitos: [
      "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",
      "Vivienda habitual por remisión a la DA 23 LIRPF y su desarrollo: residencia continuada durante tres años y ocupación efectiva y permanente en doce meses desde adquisición o terminación. Fallecimiento o circunstancias que necesariamente exijan cambiar de vivienda permiten las excepciones legales; el disfrute de vivienda por cargo o empleo tiene regla específica de ocupación.",

      "2. A efectos de lo dispuesto en este artículo se considerará como precio de adquisición de la vivienda al importe real por el que se efectúe, más los gastos y tributos inherentes a dicha adquisición, y deberán cumplirse los siguientes requisitos:",
      "a) La vivienda deberá adquirirse en los tres años siguientes, contados de fecha a fecha, desde que se produzca el nacimiento o adopción de un hijo del contribuyente por el que tenga derecho a la aplicación del mínimo por descendientes y habitarse efectivamente en el plazo de doce meses desde su adquisición.",
      "b) La vivienda adquirida deberá constituir la vivienda habitual de la unidad familiar del contribuyente, de acuerdo con la definición y requisitos establecidos en la disposición adicional vigésima tercera de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas, y en su normativa de desarrollo, en su redacción vigente desde el 1 de enero de 2013.",
      "3. Si el contribuyente transmitiese la vivienda durante el período indicado en el párrafo segundo del apartado 1, perderá el derecho a la deducción restante en el período impositivo en que se produzca dicha transmisión y los siguientes.",
      "4. En el caso de que la vivienda por la que se aplique la presente deducción no llegue a habitarse efectivamente en el plazo de doce meses desde su adquisición o construcción o no se habite efectivamente durante un plazo mínimo continuado de tres años, salvo que concurran las circunstancias indicadas en la disposición adicional vigésima tercera de la Ley 35/2006, de 28 de noviembre y en su normativa de desarrollo, el adquirente perderá el derecho a la deducción, procediéndose a la regularización de acuerdo con lo establecido en la normativa estatal del Impuesto sobre la Renta de las Personas Físicas.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. Los contribuyentes que adquieran, como consecuencia del nacimiento o adopción de hijos, una vivienda que constituye la vivienda habitual de su unidad familiar podrán deducirse el 10 por ciento de su precio de adquisición de acuerdo con lo dispuesto en el apartado 2 de este artículo.",
      "2. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 10, 10 bis, 10 ter, 11, 11 bis, 13, y 13 bis aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, junto con la correspondiente al resto de miembros de su unidad familiar, no supere la cantidad en euros resultante de multiplicar por 30.930 el número de miembros de dicha unidad familiar.",
    ],
    prorrateo: [
      "El importe de la deducción se prorrateará por décimas partes y se aplicará en el período impositivo en que se produzca la adquisición los nueve siguientes, sin que la deducción anual aplicable pueda superar los 1.546,50 euros.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "10% precio con gastos/tributos, décimas10 años máximo1.546,50 anual; compra en3 años fecha a fecha del nacimiento/adopción con mínimo; ocupar<=12 meses y3 años salvo excepción; transmisión extingue resto; renta familiar <=30.930 por miembro; DA23.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_condicion_familia_numerosa",
      [431, 432]
    ),
    requisitos: [
      "A tal efecto, se considerará que se obtiene la condición de titular de una familia numerosa cuando tenga efectos el reconocimiento de dicha condición de acuerdo con la Ley 40/2003, de 18 de noviembre , de Protección a las Familias Numerosas.",
      "2. La deducción establecida en este artículo podrá aplicarse en el período impositivo en que surta efectos el reconocimiento de la condición de familia numerosa de categoría general o especial y en los dos siguientes.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. Los contribuyentes que obtengan la condición de titulares de una familia numerosa de categoría general podrán deducir el 50 por ciento de la cuota íntegra autonómica, con el límite de 6.186 euros en tributación individual y de 12.372 euros en tributación conjunta. La deducción será del 100 por ciento de la cuota íntegra, con el límite de 12.372 euros en tributación individual y de 24.744 euros en tributación conjunta, para los que obtengan la condición de titulares de una familia numerosa de categoría especial.",
      "2. Solo tendrán derecho a la aplicación de las deducciones establecidas en los artículos 10, 10 bis, 10 ter, 11, 11 bis, 13, y 13 bis aquellos contribuyentes cuya base imponible, entendiendo como tal la suma de la base imponible general y la del ahorro, junto con la correspondiente al resto de miembros de su unidad familiar, no supere la cantidad en euros resultante de multiplicar por 30.930 el número de miembros de dicha unidad familiar.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "50% cuota autonómica general topes6.186 individual/12.372 conjunta;100% especial topes12.372/24.744; reconocimiento efectivo año+2; renta familiar <=30.930 por miembro. Ley40/2003 para titularidad/categoría.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_familias_dos_descendientes_ingresos_reducidos",
      [432, 433]
    ),
    requisitos: [
      "Para calcular la suma de bases imponibles se adicionarán las siguientes:",
      "a) Las de los contribuyentes que tengan derecho, por los mismos descendientes, a la aplicación del mínimo correspondiente tanto si declaran individual como conjuntamente.",
      "b) Las de los propios descendientes que dan derecho al citado mínimo.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "Los contribuyentes que tengan dos o más descendientes que generen a su favor el derecho a la aplicación del correspondiente mínimo establecido por la normativa reguladora del impuesto y cuya suma de bases imponibles no sea superior a 24.744 euros podrán aplicar una deducción del 10 por 100 del importe resultante de minorar la cuota íntegra autonómica en el resto de deducciones autonómicas aplicables en la Comunidad de Madrid y la parte de deducciones estatales que se apliquen sobre dicha cuota íntegra autonómica.",
      "A estos efectos, para cada contribuyente, se considerará como base imponible a la suma de la base imponible general y del ahorro.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "10% cuota autonómica tras resto de deducciones autonómicas y estatales aplicables; >=2 descendientes con mínimo; suma bases de titulares y descendientes <=24.744, aun con individuales; documentación general.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_inversion_entidades_nuevas_reciente_creacion",
      [433, 434, 435]
    ),
    requisitos: [
      "3. Para la aplicación de la deducción deberán cumplirse los siguientes requisitos:",
      "b) Que dicha participación se mantenga un mínimo de tres años.",
      "c) Que la entidad de la que se adquieran las acciones o participaciones cumpla los siguientes requisitos:",
      "1.º Que tenga su domicilio social y fiscal en la Comunidad de Madrid.",
      "2.º Que desarrolle una actividad económica. A estos efectos no se considerará que desarrolla una actividad económica cuando tenga por actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo establecido en el artículo 4.ocho.dos.a) de la Ley 19/1991, de 6 de junio , del Impuesto sobre el Patrimonio.",
      "3.º Que, para el caso en que la inversión efectuada corresponda a la constitución de la entidad, desde el primer ejercicio fiscal esta cuente, al menos, con una persona contratada con contrato laboral y a jornada completa y dada de alta en el Régimen General de la Seguridad Social.",
      "4.º Que, para el caso en que la inversión efectuada corresponda a una ampliación de capital de la entidad, dicha entidad hubiera sido constituida dentro de los tres años anteriores a la ampliación de capital y que la plantilla media de la entidad durante los dos ejercicios fiscales posteriores al de la ampliación se incremente respecto de la plantilla media que tuviera en los doce meses anteriores al menos en una persona con los requisitos anteriores, y dicho incremento se mantenga durante al menos otros veinticuatro meses. Para el cálculo de la plantilla media total de la entidad y de su incremento se tomarán las personas empleadas en los términos que disponga la legislación laboral, teniendo en cuenta la jornada contratada en relación a la jornada completa.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. Los contribuyentes podrán aplicar una deducción del 40 por ciento de las cantidades invertidas durante el ejercicio en la adquisición de acciones y participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital en las sociedades mercantiles que revistan la forma de sociedad anónima y sociedad de responsabilidad limitada.",
      "2. El límite de deducción aplicable será de 9.279 euros anuales.",
      "a) Que, como consecuencia de la participación adquirida por el contribuyente, computada junto con la que posean de la misma entidad su cónyuge o personas unidas al contribuyente por razón de parentesco, en línea recta o colateral, por consanguinidad o afinidad hasta el tercer grado incluido, no se llegue a poseer durante ningún día del año natural más del 40 por 100 del total del capital social de la entidad o de sus derechos de voto.",
      "4. La deducción contenida en este artículo será del 50 por 100 de las cantidades invertidas, con un límite de 12.372,00 euros, en el caso de sociedades creadas o participadas por universidades o centros de investigación.",
      "5. La deducción contenida en este artículo también será aplicable, en el porcentaje y límite establecidos en el apartado 4 y cumpliendo los requisitos establecidos en el apartado 3, excepto el contenido en el párrafo 3.º de dicho apartado, por las cantidades invertidas en el ejercicio en la adquisición de acciones, participaciones y aportaciones sociales como consecuencia de acuerdos de constitución o de ampliación de capital de sociedades anónimas laborales, sociedades de responsabilidad limitada laborales y sociedades cooperativas.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "40% inversión máximo9.279;50% máximo12.372 universidades/investigación y laborales/cooperativas con excepción de plantilla inicial; participación familiar <=40% hasta tercer grado, mantener3 años; domicilio Madrid, actividad no patrimonial; constitución1 empleado o ampliación con plantilla adicional1 y plazos específicos.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_autoempleo_jovenes_menores_35",
      [435, 436]
    ),
    requisitos: [
      "La deducción se practicará en el periodo impositivo en que se produzca el alta en el citado censo y serán requisitos necesarios para la aplicación de la misma que la actividad se desarrolle principalmente en el territorio de la Comunidad de Madrid y que el contribuyente se mantenga en el citado censo durante al menos un año desde el alta.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "Los contribuyentes menores de treinta y cinco años que causen alta por primera vez en el Censo de Empresarios, Profesionales y Retenedores, previsto en el Real Decreto 1065/2007, de 27 de julio , por el que se aprueba el Reglamento General de las actuaciones y los procedimientos de gestión e inspección tributaria y de desarrollo de las normas comunes de los procedimientos de aplicación de los tributos, podrán aplicar una deducción en la cuota íntegra autonómica del Impuesto sobre la Renta de las Personas Físicas de 1.031 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "1.031; primer alta censo y <35; actividad principalmente Madrid, permanencia>=1 año; año del alta, no anual recurrente.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_inversiones_mercado_alternativo_bursatil",
      [436, 437]
    ),
    requisitos: [
      "2. Para poder aplicar la deducción será necesario que se cumplan los siguientes requisitos:",
      "a) Que las acciones o participaciones adquiridas se mantengan al menos durante dos años.",
      "c) La sociedad en que se produzca la inversión debe tener el domicilio social y fiscal en la Comunidad de Madrid, y no debe tener como actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con los requisitos establecidos en el artículo 4.ocho.dos.a) de la Ley 19/1991, de 6 de junio , del Impuesto sobre el Patrimonio.",
      "3. Los requisitos indicados en los apartados b) y c) anteriores deberán cumplirse durante todo el plazo de mantenimiento indicado en el apartado a).",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir de la cuota íntegra autonómica el 20 por 100 de las cantidades invertidas en la adquisición de acciones correspondientes a procesos de ampliación de capital o de oferta pública de valores, en ambos casos a través del segmento de empresas en expansión del Mercado Alternativo Bursátil aprobado por Acuerdo del Consejo de Ministros del 30 de diciembre de 2005, con un máximo de 10.310 euros de deducción.",
      "b) Que la participación en la entidad a la que correspondan las acciones o participaciones no sea superior al 10 por 100 del capital social.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "4. La deducción contenida en este artículo resultará incompatible, para las mismas inversiones, con la deducción establecida en el artículo 15 de esta ley.",
    ],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% máximo10.310; ampliación u oferta pública segmento expansión; mantener2 años, participación<=10%, domicilio Madrid y no patrimonial todo plazo; incompatible15 y17 bis misma inversión.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "madrid_inversiones_nuevos_contribuyentes_extranjero",
      [437, 438, 439, 440]
    ),
    requisitos: [
      "a) Valores representativos de la cesión a terceros de capitales propios, negociados o no, en mercados organizados.",
      "b) Valores representativos de la participación en fondos propios de cualquier tipo de entidad, negociados o no, en mercados organizados.",
      "2. Para la aplicación de la presente deducción será necesario que se cumplan los siguientes requisitos:",
      "b) La inversión debe ser realizada en el propio ejercicio de la adquisición de la residencia fiscal en la Comunidad de Madrid, conforme a la normativa del Impuesto sobre la Renta de las Personas Físicas, o en el ejercicio siguiente. En el caso de inversión en valores representativos de la cesión a terceros de capitales propios emitidos por entidades españolas y de valores representativos de la participación en fondos propios de entidades españolas, la inversión también podrá realizarse en el ejercicio anterior al de la adquisición de la citada residencia.",
      "El contribuyente deberá mantener la inversión adquirida durante un plazo de seis años, siendo válidas las transmisiones onerosas de los elementos patrimoniales adquiridos con reinversión total del importe obtenido con la trasmisión, en el plazo de un mes desde las mismas, en cualquiera de los elementos patrimoniales mencionados en el apartado 1 de este artículo.",
      "Cuando la inversión inicial haya concurrido en el ejercicio anterior al de la adquisición de la residencia fiscal, teniendo por objeto entidades de nacionalidad española, se deberá mantener la inversión realizada hasta que adquiera dicha residencia, pudiendo reinvertir, en los activos y con los requisitos señalados en este artículo, a partir del ejercicio de adquisición de la residencia.",
      "c) Que el contribuyente no haya sido residente en España durante los cinco años anteriores al cambio de residencia a territorio de la Comunidad de Madrid.",
      "3. La deducción podrá ser aplicada en el ejercicio en el que se produzca la inversión y en los cinco ejercicios siguientes inmediatos y sucesivos en caso de insuficiencia de cuota íntegra. En caso de concurrir con otras deducciones autonómicas, esta deducción se aplicará con posterioridad al resto de deducciones a las que tenga derecho el contribuyente.",
      "En el caso de que la inversión se haya realizado en el ejercicio anterior al de la adquisición de la condición de contribuyente del Impuesto sobre la Renta de las Personas Físicas en la Comunidad de Madrid, para los bienes respecto de los cuales se prevé esta posibilidad en el apartado 2.b), la deducción podrá ser aplicada en el ejercicio en el que se adquiera la citada residencia fiscal o en los cinco ejercicios siguientes inmediatos y sucesivos, en caso de insuficiencia de cuota íntegra.",
      "4. Esta deducción podrá ser de aplicación a todas aquellas personas que se conviertan en contribuyentes del Impuesto sobre la Renta de las Personas Físicas en la Comunidad de Madrid a partir del 1 de enero de 2024 aun cuando las inversiones se hayan realizado durante el ejercicio anterior, en los supuestos recogidos en el apartado 2.b).",
      "Además, el contribuyente deberá mantener la condición de tal en el Impuesto sobre la Renta de las Personas Físicas en la Comunidad de Madrid hasta el último ejercicio del periodo de mantenimiento de la inversión.",
      "La pérdida de la residencia en la Comunidad de Madrid en el período de obligación de mantenimiento de la inversión o el incumplimiento de la obligación de mantenimiento de la inversión realizada, incluyendo el supuesto de transmisión sin reinversión total, originarán la pérdida de la deducción aplicada.",
      "4. Las deducciones contempladas en esta sección requerirán justificación documental adecuada. Asimismo y sin perjuicio de lo anterior:",
    ],
    limites: [
      "1. Las personas físicas no residentes en España que se conviertan en contribuyentes del Impuesto sobre la Renta de las Personas Físicas en la Comunidad de Madrid, podrán aplicar una deducción del 20 por ciento del valor de adquisición, incluyendo los gastos y tributos inherentes a la adquisición, excluidos los intereses, que hubieran sido satisfechos por el adquirente, de los siguientes elementos patrimoniales:",
      "a) En el caso de inversión en valores representativos de la participación en fondos propios de cualquier tipo de entidad, no negociados en mercados organizados, la entidad no podrá estar constituida ni domiciliada en un paraíso fiscal y la participación directa o indirecta del contribuyente, junto con la que posean en la misma entidad su cónyuge o cualquier persona unida al contribuyente por parentesco, en línea recta o colateral, por consanguinidad o afinidad, hasta el segundo grado incluido, no puede ser, durante ningún día de los años naturales de mantenimiento de la participación, superior al 40 por ciento del capital social de la entidad o de sus derechos de voto, no pudiendo el contribuyente en ningún caso llevar a cabo funciones ejecutivas ni de dirección ni mantener una relación laboral en la entidad objeto de la inversión.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "5. La deducción contenida en este artículo resultará incompatible, para las mismas inversiones, con las deducciones establecidas en los artículos 15 y 17.",
    ],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% adquisición valores con gastos/tributos sin intereses; no inmuebles; no residencia España5 años; inversión año residencia o siguiente, anterior solo activos españoles; mantener6 años/reinvertir total<=1 mes; no funciones ejecutivas/laborales y participación familiar<=40% hasta segundo grado para no cotizadas; residencia Madrid todo plazo; arrastre5 años y después del resto; incompatible15/17.",
    },
  },
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const MADRID_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...MADRID_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  MADRID_NACIMIENTO_ADOPCION_2025,
  MADRID_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
  MADRID_GASTOS_EDUCATIVOS_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
