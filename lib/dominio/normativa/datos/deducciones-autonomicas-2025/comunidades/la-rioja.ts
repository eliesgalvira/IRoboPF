import type { FichaDeduccionAutonomica } from "../tipos";

// Reglas descriptivas de 2025. La evaluación exige hechos y evidencia externos.
export const RIOJA_NACIMIENTO_ADOPCION_HIJOS_2025 = {
  codigo: "rioja_nacimiento_adopcion_hijos",
  comunidad: "la-rioja",
  nombre: "Por nacimiento y adopción de hijos",
  normativa:
    "Ley 10/2017 art. 32.1; ejercicio 2025. Consignación con acreditación externa de requisitos.",
  categoria: "circunstancias_personales_familiares",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "600 euros primer hijo, 750 segundo, 900 tercero y sucesivos; incremento de 60 euros por hijo en múltiples.",
  },
  requisitos: [
    "a) 600 euros, cuando se trate del primero.",
    "b) 750 euros, cuando se trate del segundo.",
    "c) 900 euros, cuando se trate del tercero y sucesivos.",
    "En el caso de que el número de hijos de cada progenitor dé lugar a la aplicación de un importe diferente, ambos se aplicarán la deducción que corresponda en función del número de hijos preexistente. Si dándose esta circunstancia la declaración fuere conjunta, la deducción será la suma de lo que a cada uno correspondería si la declaración fuera individual, según lo dispuesto en el párrafo anterior.",
    "En caso de nacimientos o adopciones múltiples, la deducción que corresponde a cada hijo se incrementará en 60 euros.",
  ],
  limites: [],
  prorrateo: [
    "Cuando los hijos nacidos o adoptados en el periodo impositivo convivan con ambos progenitores o adoptantes, el importe de la deducción se practicará por mitad en la declaración de cada uno de los progenitores o adoptantes, salvo que estos tributen presentando una única declaración conjunta, en cuyo caso se aplicará en la misma la totalidad del importe que corresponda por esta deducción.",
  ],
  compatibilidades: [],
  incompatibilidades: [
    "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
  ],
  entradaNecesaria: ["importeBase", "cumpleRequisitosYLimites"],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [482, 483],
  },
  estado: "implementada",
} satisfies FichaDeduccionAutonomica;

export const RIOJA_ARRENDAMIENTO_MENORES_36_2025 = {
  codigo: "rioja_arrendamiento_menores_36",
  comunidad: "la-rioja",
  nombre:
    "Por arrendamiento de vivienda habitual para contribuyentes menores de 36 años",
  normativa:
    "Ley 10/2017 art. 32.12; ejercicio 2025. Consignación con acreditación externa de requisitos.",
  categoria: "vivienda_habitual",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "10% de alquiler no subvencionado, máximo 300 euros por contrato; 20%, máximo 400 en anexo I.",
  },
  requisitos: [
    "Los contribuyentes menores de 36 años que durante el periodo impositivo satisfagan cantidades en concepto de alquiler de su vivienda habitual situada en la Comunidad Autónoma La Rioja podrán aplicar sobre la cuota íntegra autonómica alguna de las siguientes deducciones:",
    "Para ello deberán cumplirse los siguientes requisitos:",
    "1) Que el contribuyente no haya cumplido los 36 años de edad a la fecha de devengo del impuesto. En caso de tributación conjunta el requisito de la edad habrá de cumplirlo al menos uno de los cónyuges.",
    "2) Que se trate del arrendamiento de la vivienda habitual del contribuyente, ocupada efectivamente por el mismo y localizada en el territorio de la Comunidad Autónoma de La Rioja.",
    "4) Que el contribuyente no tenga derecho durante el mismo periodo impositivo a deducción alguna por inversión en vivienda habitual.",
    "La práctica de esta deducción quedará condicionada a su justificación documental.",
    "Ámbito territorial de 2025: anexo I original de Ley 10/2017 para pequeños municipios; anexo II distinto para segunda vivienda rural. Las modificaciones de Ley 9/2025, artículo 1.Once/Doce, rigen desde 2026; no quedan cubiertas por la retroactividad de 32.20. Debe comprobarse el municipio en la lista correspondiente, sin usar población actual como sustituto.",
  ],
  limites: [
    "El 10 % de las cantidades no subvencionadas satisfechas en el ejercicio, con el límite anual de 300 € por contrato de arrendamiento, tanto en tributación individual como en conjunta, con carácter general o, en su caso,",
    "El 20 % de las cantidades no subvencionadas satisfechas en el ejercicio, con el límite anual de 400 € por contrato de arrendamiento, tanto en tributación individual como en conjunta, siempre y cuando la vivienda habitual se encuentre situada en uno de los pequeños municipios enumerados en el anexo I de esta ley.",
    "5) Que la base liquidable general sometida a tributación del contribuyente, definida en el artículo 50 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, no exceda de 18.030 euros en tributación individual o de 30.050 euros en tributación conjunta, siempre que la base liquidable del ahorro sometida a tributación, definida en dicho artículo 50, no supere los 1.800 euros.",
  ],
  prorrateo: [
    "3) Que el contribuyente sea titular de un contrato de arrendamiento por el cual se haya presentado el correspondiente modelo del impuesto sobre transmisiones patrimoniales y actos jurídicos documentados. En el supuesto de matrimonios en régimen de gananciales, la deducción corresponderá a los cónyuges por partes iguales, aunque el contrato de arrendamiento conste sólo a nombre de uno de ellos.",
    "Cuando dos contribuyentes tengan derecho a la aplicación de la deducción, el importe total, sin exceder del límite establecido por contrato de arrendamiento, se prorrateará por partes iguales en la declaración de cada uno de ellos.",
  ],
  compatibilidades: [],
  incompatibilidades: [
    "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
  ],
  entradaNecesaria: ["importeBase", "cumpleRequisitosYLimites"],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [502, 503, 504],
  },
  estado: "implementada",
} satisfies FichaDeduccionAutonomica;

export const RIOJA_ENFERMEDAD_CELIACA_2025 = {
  codigo: "rioja_enfermedad_celiaca",
  comunidad: "la-rioja",
  nombre: "Por enfermedad celíaca diagnosticada",
  normativa:
    "Ley 10/2017 art. 32.20; ejercicio 2025. Consignación con acreditación externa de requisitos.",
  categoria: "circunstancias_personales_familiares",
  cuantia: {
    tipo: "importe_fijo",
    euros: "250",
    por: "persona integrante del núcleo familiar con enfermedad celíaca diagnosticada",
  },
  requisitos: [
    "a) Los contribuyentes podrán aplicar en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas una deducción de 250 euros por cada persona integrante de su unidad familiar que tenga enfermedad celiaca diagnosticada.",
    "b) A los exclusivos efectos de esta deducción, se consideran personas integrantes de la unidad familiar del contribuyente al propio contribuyente, su cónyuge y aquellas personas que le den derecho a la aplicación del mínimo por ascendientes o descendientes regulado en la normativa estatal del impuesto sobre la renta de las personas físicas.",
    "d) La condición de enfermedad celiaca deberá acreditarse mediante certificado médico que recoja el diagnóstico definitivo conforme a los criterios reconocidos por la comunidad científica. Dicho certificado deberá ser emitido por médico en activo en el que conste su identificación completa, incluido número de colegiado y especialidad, la fecha de emisión y de diagnóstico.",
  ],
  limites: [],
  prorrateo: [
    "c) Cuando dos o más contribuyentes tengan derecho a la aplicación de la deducción por razón de una misma persona, su importe se distribuirá por partes iguales.",
  ],
  compatibilidades: [],
  incompatibilidades: [
    "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
  ],
  entradaNecesaria: ["importeBase", "cumpleRequisitosYLimites"],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [520],
  },
  estado: "implementada",
} satisfies FichaDeduccionAutonomica;

export const RIOJA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  {
    codigo: "rioja_vivienda_habitual_pequenos_municipios",
    comunidad: "la-rioja",
    nombre: "Por vivienda habitual pequeños municipios",
    normativa:
      "Ley 10/2017 art. 32.2; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "vivienda_habitual",
    cuantia: {
      tipo: "mixta",
      descripcion: "5%, máximo anual 452 euros.",
    },
    requisitos: [
      "Para que dicha vivienda tenga el carácter de habitual deberán cumplirse los requisitos establecidos en el artículo 68.1.3.º de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta, en su redacción vigente a 31 de diciembre de 2012; y en el artículo 54 del Real Decreto 439/2007, de 30 de marzo , por el que se aprueba el Reglamento del Impuesto sobre la Renta de las Personas Físicas y se modifica el Reglamento de Planes y Fondos de Pensiones, aprobado por Real Decreto 304/2004, de 20 de febrero , en su redacción vigente a 31 de diciembre de 2012, y en particular, en lo referente al concepto de vivienda habitual, plazo de ocupación y requisitos de permanencia en la misma, entre otros.",
      "Los conceptos de adquisición, construcción y rehabilitación de vivienda habitual serán los definidos en el artículo 55 del Real Decreto 439/2007, de 30 de marzo , por el que se aprueba el Reglamento del Impuesto sobre la Renta de las Personas Físicas , en su redacción vigente a 31 de diciembre de 2012.",
      "La aplicación de la deducción por inversión en vivienda, cualquiera que sea el contribuyente beneficiario de la medida, requerirá que el importe comprobado del patrimonio del contribuyente al finalizar el periodo de la imposición exceda del valor que arrojase su comprobación al comienzo del mismo al menos en la cuantía de las inversiones realizadas, sin computar los intereses y demás gastos de financiación.",
      "A estos efectos, no se computarán los incrementos o disminuciones de valor experimentados durante el periodo impositivo por los elementos patrimoniales que al final del mismo sigan formando parte del patrimonio del contribuyente ni tampoco el incremento patrimonial obtenido por hechos imponibles sujetos al impuesto de sucesiones y donaciones.",
      "Remisión histórica de vivienda: residencia continuada tres años y ocupación efectiva en doce meses desde adquisición o terminación; excepciones por fallecimiento o cambio/impedimento necesario justificado y vivienda por cargo o empleo. Construcción con pagos directos o al promotor y plazo de cuatro años, con ampliaciones excepcionales reglamentarias; conservación, reparación y mejoras no son adquisición. Hasta dos garajes adquiridos conjuntamente pueden asimilarse. Aplicar solo el concepto al que remite cada modalidad, sin convertir una segunda residencia en vivienda habitual.",
      "Ámbito territorial de 2025: anexo I original de Ley 10/2017 para pequeños municipios; anexo II distinto para segunda vivienda rural. Las modificaciones de Ley 9/2025, artículo 1.Once/Doce, rigen desde 2026; no quedan cubiertas por la retroactividad de 32.20. Debe comprobarse el municipio en la lista correspondiente, sin usar población actual como sustituto.",
    ],
    limites: [
      "Los contribuyentes con residencia habitual, a efectos fiscales, en la Comunidad Autónoma de La Rioja que hubieran adquirido, rehabilitado o iniciado la construcción de su vivienda habitual a partir del 1 de enero de 2017 en los pequeños municipios que se detallan en el anexo I de esta ley podrán deducir el 5 % de las cantidades satisfechas para ello en el presente ejercicio, con el límite máximo de 452 euros por declaración. La base máxima de esta deducción será de 9.040 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_vivienda_habitual_pequenos_municipios:cumple",
      "rioja_vivienda_habitual_pequenos_municipios:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [483, 484, 485],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_escuelas_infantiles_pequenos_municipios",
    comunidad: "la-rioja",
    nombre: "Por escuelas infantiles pequeños municipios",
    normativa:
      "Ley 10/2017 art. 32.3; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30% de gastos efectivos no subvencionados; máximo 600 euros por menor.",
    },
    requisitos: [
      "Para tener derecho a esta deducción, el o los progenitores deberán ejercer una actividad laboral, por cuenta propia o ajena, fuera del domicilio familiar, al menos durante el periodo en el que el menor se encuentre escolarizado o contratado el personal destinado a su cuidado. Además de ello, a fecha de devengo del impuesto deberán convivir con el menor y tener derecho al mínimo por descendientes regulado en el artículo 58 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas.",
      "El menor deberá estar matriculado en una escuela o centro infantil de La Rioja, al menos la mitad de la jornada establecida, o bien deberá acreditarse la existencia de una persona con contrato laboral y alta en Seguridad Social en el epígrafe correspondiente a 'Empleados del hogar-Cuidador de familias' o similar para el cuidado de los menores.",
      "A estos efectos se entenderán por gastos las cantidades satisfechas a escuelas o centros de educación infantil por la preinscripción y matrícula de dichos menores, la asistencia, en horario general y ampliado, y la alimentación, siempre que no tuvieran la consideración de rendimientos del trabajo en especie exentos por aplicación de lo dispuesto en las letras b) o d) del apartado 3 del artículo 42 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "Solo podrán aplicarse esta deducción los contribuyentes cuya base liquidable general sometida a tributación, definida en el artículo 50 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, no exceda de 18.030 euros en tributación individual o de 30.050 euros en tributación conjunta, siempre que la base liquidable del ahorro sometida a tributación, definida en el artículo 50 antes mencionado, no supere los 1.800 euros.",
      "La base de esta deducción tendrá como límite para cada hijo el importe total del gasto efectivo no subvencionado satisfecho en el ejercicio a la escuela o centro de educación infantil.",
    ],
    prorrateo: [
      "Los contribuyentes que dentro del periodo impositivo fijen su residencia habitual en uno de los pequeños municipios de La Rioja detallados en el anexo I a esta ley, y mantengan su residencia en el mismo a fecha de devengo del impuesto, podrán deducir un 30% de las cantidades abonadas en escuelas infantiles, centros de educación infantil o personal contratado para el cuidado de hijos de 0 a 3 años, con el límite máximo de 600 euros por menor. En caso de declaraciones individuales, el importe de las cantidades abonadas y el límite máximo a deducir se prorratearán por partes iguales entre los progenitores con derecho a su aplicación.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_escuelas_infantiles_pequenos_municipios:cumple",
      "rioja_escuelas_infantiles_pequenos_municipios:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [485, 486, 487],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_menor_acogimiento_guarda_adopcion",
    comunidad: "la-rioja",
    nombre: "Por menor acogimiento guarda adopción",
    normativa:
      "Ley 10/2017 art. 32.4; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "circunstancias_personales_familiares",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "300 euros por menor con convivencia de al menos 183 días; 150 si supera 90 y no alcanza 183.",
    },
    requisitos: [
      "Los contribuyentes con residencia en la Comunidad Autónoma de La Rioja que tengan en su domicilio un menor en régimen de acogimiento familiar de urgencia, temporal o permanente, o guarda con fines de adopción, formalizado por el órgano judicial o administrativo competente de la Comunidad Autónoma de La Rioja, podrán deducir la cantidad de 300 euros por cada uno de dichos menores. Si se optase por declaraciones individuales, cada uno de los contribuyentes con derecho a la deducción se aplicará el 50 % de la misma.",
      "Para tener derecho a esta deducción, los contribuyentes deberán convivir con el menor 183 o más días durante el periodo impositivo. Si el tiempo de convivencia durante el periodo impositivo fuese inferior a 183 días y superior a 90 días, la deducción será de 150 euros por cada menor acogido.",
      "Podrá aplicarse la deducción correspondiente el contribuyente que haya acogido durante el ejercicio a distintos menores, sin que la estancia de ninguno de ellos supere los 90 días, siempre que la suma de los periodos de los distintos acogimientos sí supere, al menos, dicho plazo.",
      "No procederá la deducción por acogimiento familiar cuando se hubiese producido la adopción del menor por la misma familia durante el periodo impositivo.",
    ],
    limites: [],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_menor_acogimiento_guarda_adopcion:cumple",
      "rioja_menor_acogimiento_guarda_adopcion:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [487, 488, 489],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_hijo_0_3_pequenos_municipios",
    comunidad: "la-rioja",
    nombre: "Por hijo 0 3 pequeños municipios",
    normativa:
      "Ley 10/2017 art. 32.5; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "circunstancias_personales_familiares",
    cuantia: {
      tipo: "mixta",
      descripcion: "100 euros mensuales por hijo de 0 a 3 años.",
    },
    requisitos: [
      "Los contribuyentes que dentro del periodo impositivo tengan su residencia habitual o la trasladen a uno de los pequeños municipios de La Rioja detallados en el anexo I a esta ley, y mantengan su residencia en el mismo durante al menos 3 años consecutivos, podrán deducir 100 euros mensuales por cada hijo de 0 a 3 años.",
      "Para tener derecho a esta deducción, el o los progenitores deberán residir o trasladar su residencia dentro del periodo impositivo a estos municipios y mantener la misma durante un plazo continuado de al menos 3 años, contados desde el mes en que se inicie el derecho a la deducción. No se perderá el derecho a la deducción cuando, a pesar de no haber transcurrido dicho plazo, se produzca el fallecimiento del contribuyente o concurran circunstancias que necesariamente exijan el cambio de residencia, tales como separación matrimonial, traslado laboral, obtención de primer empleo o de empleo más ventajoso u otras análogas.",
      "El incumplimiento de los requisitos mencionados y la no permanencia en el municipio de residencia durante el plazo establecido, excepto en los supuestos fijados en el segundo párrafo de este apartado 5, obligarán al contribuyente a devolver las deducciones indebidamente practicadas más los correspondientes intereses de demora, mediante regularización en la declaración del impuesto sobre la renta de las personas físicas del año en que se produzca el incumplimiento.",
      "Ámbito territorial de 2025: anexo I original de Ley 10/2017 para pequeños municipios; anexo II distinto para segunda vivienda rural. Las modificaciones de Ley 9/2025, artículo 1.Once/Doce, rigen desde 2026; no quedan cubiertas por la retroactividad de 32.20. Debe comprobarse el municipio en la lista correspondiente, sin usar población actual como sustituto.",
    ],
    limites: [],
    prorrateo: [
      "La deducción será de 100 euros al mes por cada hijo de 0 a 3 años, siempre que el contribuyente tuviera derecho al mínimo por descendientes regulado en la normativa del impuesto sobre la renta de las personas físicas. Para aplicar la presente deducción, el último día de cada mes deberán concurrir estas dos circunstancias: residir en uno de los municipios mencionados y tener un hijo de 0 a 3 años con derecho a mínimo por descendientes. En el caso de presentación de declaraciones individuales, el importe de 100 euros mensuales se prorrateará por partes iguales entre los progenitores que cumplan los requisitos para tener derecho a ello.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_hijo_0_3_pequenos_municipios:cumple",
      "rioja_hijo_0_3_pequenos_municipios:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [489, 490],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_hijo_0_3_escolarizado",
    comunidad: "la-rioja",
    nombre: "Por hijo 0 3 escolarizado",
    normativa:
      "Ley 10/2017 art. 32.6; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "circunstancias_personales_familiares",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% de escolarización no subvencionada; máximo 600 euros por hijo.",
    },
    requisitos: [
      "A estos efectos se entenderán por gastos de escolarización las cantidades satisfechas a escuelas o centros de educación infantil por la preinscripción y matrícula de dichos menores, la asistencia, en horario general y ampliado, y la alimentación, siempre que no estuvieran subvencionados y no tuvieran la consideración de rendimientos del trabajo en especie exentos por aplicación de lo dispuesto en las letras b) o d) del apartado 3 del artículo 42 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "Los contribuyentes con residencia habitual en La Rioja podrán deducir un 20% de los gastos de escolarización no subvencionados por cada hijo de 0 a 3 años matriculado en una escuela o centro de educación infantil de cualquier municipio de La Rioja, con el límite máximo de 600 euros por hijo. Para ello, a fecha de devengo del impuesto, deberán convivir con el menor y tener derecho al mínimo por descendientes regulado en el artículo 58 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas.",
      "La base de esta deducción tendrá como límite para cada hijo el importe total del gasto efectivo no subvencionado satisfecho en el ejercicio a la escuela o centro de educación infantil.",
      "Solo podrán aplicarse esta deducción los contribuyentes cuya base liquidable general sometida a tributación, definida en el artículo 50 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, no exceda de 18.030 euros en tributación individual o de 30.050 euros en tributación conjunta, siempre que la base liquidable del ahorro sometida a tributación, definida en el artículo 50 antes mencionado, no supere los 1.800 euros.",
    ],
    prorrateo: [
      "En el caso de progenitores con derecho a deducción por el mismo descendiente y que presenten declaraciones individuales, el importe se prorrateará por partes iguales entre ambos.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_hijo_0_3_escolarizado:cumple",
      "rioja_hijo_0_3_escolarizado:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [490, 491, 492],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_vehiculos_electricos_nuevos",
    comunidad: "la-rioja",
    nombre: "Por vehículos eléctricos nuevos",
    normativa:
      "Ley 10/2017 art. 32.7; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15%; máximo por declaración 300 euros en categorías a–h y 225 en i, con suspensión parcial desde 2024.",
    },
    requisitos: [
      "1. Las adquisiciones de vehículos eléctricos nuevos darán derecho a practicar una deducción del 15 % del importe de aquellas, siempre que pertenezcan a alguna de las siguientes categorías definidas en la Directiva 2007/46/CE del Parlamento y del Consejo, de 5 de septiembre de 2007, y en el Reglamento (UE) 168/2013 del Parlamento y del Consejo, de 15 de enero de 2013:",
      "a) Turismos M1: Vehículos de motor concebidos y fabricados principalmente para el transporte de personas y su equipaje, que tengan, además del asiento del conductor, ocho plazas como máximo.",
      "b) Furgonetas o camiones ligeros N1: Vehículos de motor concebidos y fabricados principalmente para el transporte de mercancías cuya masa máxima no sea superior a 3,5 toneladas.",
      "e) Cuadriciclos ligeros L6e: Cuadriciclos ligeros cuya masa en vacío sea inferior o igual a 350 kg, no incluida la masa de las baterías, cuya velocidad máxima por construcción sea inferior o igual a 45 km/h, y potencia máxima inferior o igual a 4 kW.",
      "f) Cuadriciclos pesados L7e: Cuadriciclos cuya masa en vacío sea inferior o igual a 400 kg (550 kg para vehículos destinados al transporte de mercancías), no incluida la masa de las baterías, y potencia máxima inferior o igual a 15 kW.",
      "g) Motocicletas L3e: Vehículos de dos ruedas sin sidecar con un motor de cilindrada superior a 50 cm³ y/o con una velocidad máxima por construcción superior a 45 km/h.",
      "h) Categoría L5e: Vehículos de tres ruedas simétricas con un motor de cilindrada superior a 50 cm³ y/o con una velocidad máxima por construcción superior a 45 km/h.",
      "i) Bicicletas de pedaleo asistido por motor eléctrico.",
      "2. Para aplicar la deducción, los vehículos relacionados en el apartado anterior deberán cumplir los siguientes requisitos:",
      "a) Vehículos no afectos a actividades profesionales o empresariales del adquiriente.",
      "b) Vehículos pertenecientes a las categorías M y N:",
      "1.º Vehículos propulsados por motores de combustión interna que puedan utilizar combustibles fósiles alternativos homologados como GLP/Autogas, Gas Natural Comprimido (GNC), Gas Natural Licuado (GNL) o bifuel gasolina-gas.",
      "2.º Eléctricos puros (BEV).",
      "3.º Eléctricos de autonomía extendida (REEV), propulsados totalmente mediante motores eléctricos.",
      "c) Vehículos pertenecientes a la categoría L y bicicletas eléctricas: estar propulsados exclusivamente por motores eléctricos, y estar homologados como vehículos eléctricos.",
      "a) Las motocicletas eléctricas (categorías L3e y L5e) deberán tener baterías de litio con una potencia igual o superior a 3 kW/h y una autonomía mínima en modo eléctrico de 70 km.",
      "b) Las bicicletas de pedaleo asistido por motor eléctrico deberán tener baterías de litio y cumplir con las prescripciones de las normas armonizadas que resulten de aplicación y en particular la Norma UNE-EN 15194:2009.",
      "El importe máximo deducible por declaración será de 300 euros para los vehículos detallados en el punto 1, apartados a) a h); y de 225 euros para los del apartado i). Asimismo, esta deducción solo podrá aplicarse a un vehículo por persona y en el periodo impositivo en el cual se matricule el vehículo cuya adquisición genera el derecho a aplicar la deducción.",
      "Con efectos desde el 1 de enero de 2024 la deducción prevista en el artículo 32.7 de esta ley, excepto para los vehículos comprendidos en los párrafos b), c), d), i) del apartado 1, no será de aplicación en tanto esté vigente la deducción por la adquisición de vehículos eléctricos “enchufables” y de pila de combustible y puntos de recarga, prevista en la disposición adicional quincuagésima octava de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio.",
    ],
    limites: [
      "c) Ciclomotores L1e: Vehículos de dos ruedas con una velocidad máxima por construcción no superior a 45 km/h y potencia continua nominal no superior a 4 kW.",
      "d) Triciclos L2e: Vehículos de tres ruedas con una velocidad máxima por construcción no superior a 45 km/h y potencia continua nominal no superior a 4 kW.",
      "d) Vehículos cuyo importe de adquisición no supere los 50.000 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_vehiculos_electricos_nuevos:cumple",
      "rioja_vehiculos_electricos_nuevos:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [492, 493, 494],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_fijacion_poblacion_ocupada_medio_rural",
    comunidad: "la-rioja",
    nombre: "Por fijación población ocupada medio rural",
    normativa:
      "Ley 10/2017 art. 32.8; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "1.000 euros en inicio de actividad y dos ejercicios siguientes; remanente por insuficiencia de cuota en tres siguientes.",
    },
    requisitos: [
      "Todos los contribuyentes con residencia habitual en algún municipio de La Rioja que inicien una actividad agraria como trabajadores por cuenta propia podrán aplicarse una deducción de 1.000 euros en la declaración correspondiente al ejercicio de inicio siempre y cuando se mantengan los requisitos de residencia y actividad durante los doce meses siguientes al alta.",
      "Esta deducción será extensible a las declaraciones del primer y del segundo ejercicio siguientes al año en el que se produzca el alta, siempre y cuando se mantengan los requisitos de actividad y residencia durante los 24 o 36 meses siguientes a la fecha de alta, respectivamente.",
      "En el supuesto de tributación conjunta, la cuantía de 1.000 euros de deducción podrá aplicarse por cada uno de los contribuyentes que cumplan los requisitos establecidos en este artículo para su disfrute.",
      "A efectos de la presente deducción, se entenderá por inicio de actividad la fecha de alta en el régimen especial de la Seguridad Social y no tendrán la consideración de trabajadores por cuenta propia los autónomos colaboradores ni los socios de sociedades mercantiles de capital. Tampoco podrán beneficiarse quienes, en los dos años inmediatamente anteriores a la fecha de inicio de la actividad que sirve de base a la deducción, hubieran cesado como trabajador por cuenta propia en una actividad agraria.",
      "En el supuesto de que el contribuyente carezca de cuota íntegra autonómica suficiente para aplicarse la totalidad de la deducción en el periodo en que se genere el derecho a su aplicación, el importe no deducido podrá aplicarse en los tres siguientes hasta agotar, en su caso, su importe total. A estos efectos, la presente deducción se aplicará en último lugar respecto al resto de deducciones sobre la cuota íntegra autonómica vigentes.",
    ],
    limites: [],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_fijacion_poblacion_ocupada_medio_rural:cumple",
      "rioja_fijacion_poblacion_ocupada_medio_rural:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [494, 495],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_internet_jovenes_emancipados",
    comunidad: "la-rioja",
    nombre: "Por internet jóvenes emancipados",
    normativa:
      "Ley 10/2017 art. 32.9; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30%, ampliado a 40% en familia monoparental o municipio del anexo I.",
    },
    requisitos: [
      "Los jóvenes que suscriban durante el ejercicio un contrato de acceso a Internet para su vivienda habitual podrán practicar una deducción del 30 % del importe de los gastos anuales facturados y pagados a las empresas suministradoras.",
      "La deducción se ampliará hasta el 40 % para aquellos contribuyentes jóvenes que constituyan unidades familiares monoparentales o tengan su residencia habitual en un municipio de los relacionados en el anexo I de la presente ley.",
      "Además, se deberán cumplir los siguientes requisitos:",
      "a) El contribuyente deberá disponer de la vivienda habitual en régimen de propiedad o arrendamiento.",
      "b) El contrato deberá suscribirse con una antelación mínima de 6 meses a la fecha de devengo del impuesto y deberá mantenerse, al menos, hasta dicha fecha.",
      "c) El contrato deberá constar a nombre del contribuyente con derecho a deducción.",
      "A los efectos de la aplicación de la presente deducción, tendrá la consideración de joven aquel contribuyente que no haya cumplido los 36 años de edad a la finalización del periodo impositivo.",
      "Asimismo, se considerará vivienda habitual la regulada en el artículo 68.1.3.º de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta, en su redacción vigente a 31 de diciembre de 2012; y en el artículo 54 del Real Decreto 439/2007, de 30 de marzo , por el que se aprueba el Reglamento del Impuesto sobre la Renta de las Personas Físicas y se modifica el Reglamento de Planes y Fondos de Pensiones, aprobado por Real Decreto 304/2004, de 20 de febrero , en su redacción vigente a 31 de diciembre de 2012, y en particular, en lo referente al concepto de vivienda habitual, plazo de ocupación y requisitos de permanencia en la misma, entre otros.",
      "Esta deducción podrá aplicarse una única vez por vivienda y por contribuyente, independientemente del régimen de ocupación de la misma.",
      "En ningún caso deberán estar vinculados a una actividad económica los titulares de los contratos y la vivienda mencionados en la presente deducción. Así, ninguno de los titulares del contrato de acceso a Internet podrá aplicar la deducción cuando uno de ellos realice en la vivienda una actividad económica, aunque también constituya su residencia habitual.",
      "Remisión histórica de vivienda: residencia continuada tres años y ocupación efectiva en doce meses desde adquisición o terminación; excepciones por fallecimiento o cambio/impedimento necesario justificado y vivienda por cargo o empleo. Construcción con pagos directos o al promotor y plazo de cuatro años, con ampliaciones excepcionales reglamentarias; conservación, reparación y mejoras no son adquisición. Hasta dos garajes adquiridos conjuntamente pueden asimilarse. Aplicar solo el concepto al que remite cada modalidad, sin convertir una segunda residencia en vivienda habitual.",
      "Ámbito territorial de 2025: anexo I original de Ley 10/2017 para pequeños municipios; anexo II distinto para segunda vivienda rural. Las modificaciones de Ley 9/2025, artículo 1.Once/Doce, rigen desde 2026; no quedan cubiertas por la retroactividad de 32.20. Debe comprobarse el municipio en la lista correspondiente, sin usar población actual como sustituto.",
    ],
    limites: [
      "Solo podrán aplicarse esta deducción los contribuyentes cuya base liquidable general sometida a tributación, definida en el artículo 50 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, no exceda de 18.030 euros en tributación individual o de 30.050 euros en tributación conjunta, siempre que la base liquidable del ahorro sometida a tributación, definida en el artículo 50 antes mencionado, no supere los 1.800 euros.",
    ],
    prorrateo: [
      "En el caso de que convivan en la misma vivienda habitual más de un contribuyente con derecho a la deducción, la misma será prorrateada entre todos ellos.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_internet_jovenes_emancipados:cumple",
      "rioja_internet_jovenes_emancipados:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [495, 496, 497],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_luz_gas_jovenes_emancipados",
    comunidad: "la-rioja",
    nombre: "Por luz gas jóvenes emancipados",
    normativa:
      "Ley 10/2017 art. 32.10; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15%, 20% en municipio del anexo I o 25% en familia monoparental.",
    },
    requisitos: [
      "Los jóvenes que suscriban durante el ejercicio un contrato de suministro eléctrico o de gas para su vivienda habitual, podrán practicar una deducción del 15% del importe de los gastos anuales facturados y pagados a las empresas suministradoras.",
      "La deducción se ampliará al 20% para aquellos contribuyentes jóvenes que tengan su residencia habitual en un municipio de los relacionados en el anexo I de la presente ley.",
      "La deducción se ampliará al 25% para contribuyentes jóvenes que constituyan unidades familiares monoparentales.",
      "Además, deberán cumplirse los siguientes requisitos:",
      "a) El contribuyente deberá disponer de la vivienda habitual en régimen de propiedad o arrendamiento.",
      "b) El o los contratos deberán suscribirse con una antelación mínima de 6 meses a la fecha de devengo del impuesto y deberán mantenerse, al menos, hasta dicha fecha.",
      "c) El o los contratos deberán constar a nombre del contribuyente con derecho a deducción.",
      "A los efectos de la aplicación de la presente deducción, tendrá la consideración de joven aquel contribuyente que no haya cumplido los 36 años de edad a la finalización del periodo impositivo.",
      "Asimismo, se considerará vivienda habitual la regulada en el artículo 68.1.3.º de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta, en su redacción vigente a 31 de diciembre de 2012; y en el artículo 54 del Real Decreto 439/2007, de 30 de marzo , por el que se aprueba el Reglamento del Impuesto sobre la Renta de las Personas Físicas y se modifica el Reglamento de Planes y Fondos de Pensiones, aprobado por Real Decreto 304/2004, de 20 de febrero , en su redacción vigente a 31 de diciembre de 2012, y en particular, en lo referente al concepto de vivienda habitual, plazo de ocupación y requisitos de permanencia en la misma, entre otros.",
      "Esta deducción podrá aplicarse una única vez por vivienda y por contribuyente, independientemente del régimen de ocupación de la citada vivienda.",
      "En ningún caso deberán estar vinculados a una actividad económica los titulares de los contratos y la vivienda mencionados en la presente deducción. Así, ninguno de los titulares de los contratos de suministro de luz y gas de uso doméstico podrá aplicar la deducción cuando uno de ellos realice en la vivienda una actividad económica, aunque también constituya su residencia habitual.",
      "Remisión histórica de vivienda: residencia continuada tres años y ocupación efectiva en doce meses desde adquisición o terminación; excepciones por fallecimiento o cambio/impedimento necesario justificado y vivienda por cargo o empleo. Construcción con pagos directos o al promotor y plazo de cuatro años, con ampliaciones excepcionales reglamentarias; conservación, reparación y mejoras no son adquisición. Hasta dos garajes adquiridos conjuntamente pueden asimilarse. Aplicar solo el concepto al que remite cada modalidad, sin convertir una segunda residencia en vivienda habitual.",
      "Ámbito territorial de 2025: anexo I original de Ley 10/2017 para pequeños municipios; anexo II distinto para segunda vivienda rural. Las modificaciones de Ley 9/2025, artículo 1.Once/Doce, rigen desde 2026; no quedan cubiertas por la retroactividad de 32.20. Debe comprobarse el municipio en la lista correspondiente, sin usar población actual como sustituto.",
    ],
    limites: [
      "Solo podrán aplicarse esta deducción los contribuyentes cuya base liquidable general sometida a tributación, definida en el artículo 50 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, no exceda de 18.030 euros en tributación individual o de 30.050 euros en tributación conjunta, siempre que la base liquidable del ahorro sometida a tributación, definida en el artículo 50 antes mencionado, no supere los 1.800 euros.",
    ],
    prorrateo: [
      "En el caso de que convivan en la misma vivienda habitual más de un contribuyente con derecho a la deducción, la misma será prorrateada entre todos ellos.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_luz_gas_jovenes_emancipados:cumple",
      "rioja_luz_gas_jovenes_emancipados:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [497, 498, 499],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_inversion_vivienda_jovenes_menores_36",
    comunidad: "la-rioja",
    nombre: "Por inversión vivienda jóvenes menores 36",
    normativa:
      "Ley 10/2017 art. 32.11; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "vivienda_habitual",
    cuantia: {
      tipo: "mixta",
      descripcion: "15% sobre base máxima anual 9.000 euros.",
    },
    requisitos: [
      "1. Los contribuyentes menores de 36 años a fecha de devengo del impuesto podrán deducir el 15 % de las cantidades satisfechas en el periodo de que se trate por la adquisición o rehabilitación de la vivienda situada en el territorio de la Comunidad Autónoma de La Rioja que constituya o vaya a constituir la residencia habitual del contribuyente. El concepto de adquisición será el definido en el artículo 58 bis de la presente ley.",
      "A estos efectos, la rehabilitación deberá cumplir las condiciones establecidas en la normativa del impuesto sobre la renta de las personas físicas, en su redacción vigente a 31 de diciembre de 2012.",
      "2. Se entenderá por vivienda habitual aquella en la que el contribuyente resida durante un plazo continuado de tres años. No obstante, se entenderá que la vivienda tuvo aquel carácter cuando, a pesar de no haber transcurrido dicho plazo, se produzca el fallecimiento del contribuyente o concurran circunstancias que necesariamente exijan el cambio de vivienda, tales como separación matrimonial, traslado laboral, obtención de primer empleo o de empleo más ventajoso u otras análogas.",
      "5. La aplicación de la deducción por inversión en vivienda, cualquiera que sea el contribuyente beneficiario de la medida, requerirá que el importe comprobado del patrimonio del contribuyente al finalizar el periodo de la imposición exceda del valor que arrojase su comprobación al comienzo del mismo al menos en la cuantía de las inversiones realizadas, sin computar los intereses y demás gastos de financiación.",
      "A estos efectos, no se computarán los incrementos o disminuciones de valor experimentados durante el periodo impositivo por los elementos patrimoniales que al final del mismo sigan formando parte del patrimonio del contribuyente ni tampoco el incremento patrimonial obtenido por hechos imponibles sujetos al impuesto de sucesiones y donaciones.",
      "Remisión histórica de vivienda: residencia continuada tres años y ocupación efectiva en doce meses desde adquisición o terminación; excepciones por fallecimiento o cambio/impedimento necesario justificado y vivienda por cargo o empleo. Construcción con pagos directos o al promotor y plazo de cuatro años, con ampliaciones excepcionales reglamentarias; conservación, reparación y mejoras no son adquisición. Hasta dos garajes adquiridos conjuntamente pueden asimilarse. Aplicar solo el concepto al que remite cada modalidad, sin convertir una segunda residencia en vivienda habitual.",
    ],
    limites: [
      "La base máxima de esta deducción será de 9.000 euros anuales y estará constituida por las cantidades satisfechas para la adquisición o rehabilitación de la vivienda, incluidos los gastos originados que hayan corrido a cargo del adquirente y, en el caso de financiación ajena, la amortización, los intereses, el coste de los instrumentos de cobertura del riesgo de tipo de interés variable de los préstamos hipotecarios regulados en el artículo decimonoveno de la Ley 36/2003, de 11 de noviembre , de medidas de reforma económica, y demás gastos derivados de la misma. En caso de aplicación de los citados instrumentos de cobertura, los intereses satisfechos por el contribuyente se minorarán en las cantidades obtenidas por la aplicación del citado instrumento.",
      "Cuando se adquiera una vivienda habitual habiendo disfrutado de la deducción por adquisición de otras viviendas habituales anteriores, no se podrá practicar deducción por la adquisición o rehabilitación de la nueva en tanto las cantidades invertidas en la misma no superen las invertidas en las anteriores, en la medida en que hubiesen sido objeto de deducción.",
      "Cuando la enajenación de una vivienda habitual hubiera generado una ganancia patrimonial exenta por reinversión, la base de deducción por la adquisición o rehabilitación de la nueva se minorará en el importe de la ganancia patrimonial a la que se aplique la exención por reinversión. En este caso, no se podrá practicar deducción por la adquisición de la nueva mientras las cantidades invertidas en la misma no superen tanto el precio de la anterior, en la medida en que haya sido objeto de deducción, como la ganancia patrimonial exenta por reinversión.",
      "4. Solo podrán aplicarse esta deducción los contribuyentes cuya base liquidable general sometida a tributación, definida en el artículo 50 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, no exceda de 18.030 euros en tributación individual o de 30.050 euros en tributación conjunta, siempre que la base liquidable del ahorro sometida a tributación, definida en el artículo 50 antes mencionado, no supere los 1.800 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "3. La presente deducción será incompatible con las establecidas en los apartados a) y b) de la disposición transitoria 1.ª de la Ley 10/2017, de 27 de octubre , por la que se consolidan las disposiciones legales de la Comunidad Autónoma de la Rioja en materia de impuestos propios y tributos cedidos, para aquellos jóvenes que hubieran adquirido o rehabilitado su vivienda antes del día 1 de enero de 2013, los cuales seguirán aplicándose las previstas en la disposición transitoria 1.ª a) y b) antes mencionadas.",
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_inversion_vivienda_jovenes_menores_36:cumple",
      "rioja_inversion_vivienda_jovenes_menores_36:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [499, 500, 501, 502],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_bicicletas_pedaleo_no_asistido",
    comunidad: "la-rioja",
    nombre: "Por bicicletas pedaleo no asistido",
    normativa:
      "Ley 10/2017 art. 32.13; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15%, máximo 50 euros por bicicleta y dos bicicletas por unidad familiar.",
    },
    requisitos: [
      "La práctica de esta deducción quedará condicionada a su justificación documental mediante la correspondiente factura.",
    ],
    limites: [],
    prorrateo: [
      "Las adquisiciones de bicicletas de pedaleo no asistido darán derecho a practicar una deducción del 15 % del importe de aquellas, con un límite máximo de 50 euros por vehículo y, a su vez, de 2 vehículos por unidad familiar. En el caso de matrimonios en régimen de gananciales que presenten declaraciones individuales, se prorrateará el importe de las deducciones por partes iguales.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_bicicletas_pedaleo_no_asistido:cumple",
      "rioja_bicicletas_pedaleo_no_asistido:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [504],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_obras_rehabilitacion_vivienda_habitual",
    comunidad: "la-rioja",
    nombre: "Por obras rehabilitación vivienda habitual",
    normativa:
      "Ley 10/2017 DT primera.a; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "vivienda_habitual",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "5% para jóvenes, 7% con límites de renta y 2% para restantes contribuyentes; base máxima conjunta 9.040 euros con adecuación por discapacidad.",
    },
    requisitos: [
      "Siempre que se cumplan los requisitos para tener derecho a la deducción estatal por obras de rehabilitación en vivienda habitual establecidos en la disposición transitoria decimoctava.1 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio:",
      "1.º Los jóvenes con residencia habitual, a efectos fiscales, en la Comunidad Autónoma de La Rioja podrán deducir el 5% de las cantidades satisfechas en el ejercicio en la rehabilitación de aquella vivienda que, radicando en la Comunidad Autónoma de La Rioja, constituya o vaya a constituir su residencia habitual.",
      "3.º El resto de contribuyentes con residencia habitual, a efectos fiscales, en la Comunidad Autónoma de La Rioja podrán deducirse el 2 % de las cantidades satisfechas en el ejercicio en la rehabilitación de aquella vivienda que, radicando en la Comunidad Autónoma de La Rioja, constituya o vaya a constituir su residencia habitual.",
      "1. Para tener derecho a las deducciones autonómicas regulada en las letras a), b) y c) de la disposición transitoria primera, se exigirá el cumplimiento de todos los requisitos que establecía la normativa estatal reguladora del impuesto sobre la renta de las personas físicas en su redacción vigente a 31 de diciembre de 2012, para los conceptos de vivienda habitual, adquisición y rehabilitación de la misma; y elementos que integran la base de la deducción aplicable, así como sobre comprobación de la situación patrimonial del contribuyente al finalizar el periodo de la imposición. En todo caso, los criterios establecidos en la disposición transitoria decimoctava de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, sobre deducción por inversión en vivienda habitual serán de obligado cumplimiento.",
      "4. A los efectos de la aplicación de las deducciones previstas en la disposición transitoria primera, tendrá la consideración de «joven» aquel contribuyente que no haya cumplido los 36 años de edad a la finalización del periodo impositivo. Asimismo, para tener la condición de «persona con discapacidad» deberán cumplirse los requisitos establecidos en el artículo 72.1 del Real Decreto 439/2007, de 30 de marzo , por el que se aprueba el Reglamento del Impuesto sobre la Renta de las Personas Físicas y se modifica el Reglamento de Planes y Fondos de Pensiones, aprobado por Real Decreto 304/2004, de 20 de febrero .",
      "Remisión histórica de vivienda: residencia continuada tres años y ocupación efectiva en doce meses desde adquisición o terminación; excepciones por fallecimiento o cambio/impedimento necesario justificado y vivienda por cargo o empleo. Construcción con pagos directos o al promotor y plazo de cuatro años, con ampliaciones excepcionales reglamentarias; conservación, reparación y mejoras no son adquisición. Hasta dos garajes adquiridos conjuntamente pueden asimilarse. Aplicar solo el concepto al que remite cada modalidad, sin convertir una segunda residencia en vivienda habitual.",
      "DT decimoctava estatal introducida por Ley 16/2012: pagos anteriores a 1 de enero de 2013; rehabilitación y adecuación concluidas antes de 1 de enero de 2017, y deducción previa salvo excepción por inversión anterior/reinversión. La conservación del régimen no habilita obras nuevas iniciadas en 2025.",
    ],
    limites: [
      "2.º Los jóvenes con residencia habitual, a efectos fiscales, en la Comunidad Autónoma de La Rioja, cuya base liquidable general, sometida a tributación según el artículo 50 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, no exceda de 18.030 euros en tributación individual o de 30.050 euros en tributación conjunta, siempre que la base liquidable del ahorro, sometida a tributación según el artículo 50, no supere los 1.800 euros, podrán aplicar un porcentaje de deducción del 7 % de las cantidades satisfechas en el ejercicio en la rehabilitación de aquella vivienda que, radicando en la Comunidad Autónoma de La Rioja, constituya o vaya a constituir su residencia habitual.",
      "4.º Solo tendrán derecho a la presente deducción los contribuyentes mencionados en los puntos anteriores que hubieran satisfecho cantidades con anterioridad al 1 de enero de 2013 por obras de rehabilitación de la vivienda habitual, siempre que las mismas estén terminadas antes del 1 de enero de 2017. En todo caso, resultará necesario que el contribuyente hubiera practicado la deducción por rehabilitación en vivienda habitual en un periodo impositivo devengado antes del 1 de enero de 2013, salvo que hubiera resultado de aplicación lo dispuesto en el artículo 68.1.2.º de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, en su redacción vigente a 31 de diciembre de 2012, relativo a los límites de la aplicación de la deducción por adquisición o rehabilitación de otras viviendas habituales anteriores y por la generación de una ganancia patrimonial exenta por reinversión, que impiden la práctica de la deducción por rehabilitación de la nueva en tanto no se superen determinados importes detallados en dicho artículo.",
      "2. La base máxima anual de las deducciones autonómicas para adquisición de vivienda y de segunda vivienda en el medio rural, reguladas en las letras b) y c) de la disposición transitoria primera, vendrá constituida por el importe resultante de minorar la cantidad de 9.040 euros en aquellas cantidades que constituyan para el contribuyente la base de la deducción por inversión en vivienda habitual contemplada en la disposición transitoria decimoctava de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio. A estos efectos, en la consideración de la base de la deducción no se tendrá en cuenta lo que corresponda, en su caso, por las obras e instalaciones de adecuación efectuadas por las personas con discapacidad a que se refiere la normativa estatal reguladora del impuesto sobre la renta de las personas físicas.",
      "3. La base máxima anual conjunta de las deducciones por rehabilitación de vivienda habitual y por obras de adecuación de vivienda habitual para personas con discapacidad, reguladas en las letras a) y d) de la disposición transitoria primera, se establece en 9.040 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "rioja_obras_rehabilitacion_vivienda_habitual:cumple",
      "rioja_obras_rehabilitacion_vivienda_habitual:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [504, 505, 506],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_adquisicion_construccion_vivienda_jovenes",
    comunidad: "la-rioja",
    nombre: "Por adquisición construcción vivienda jóvenes",
    normativa:
      "Ley 10/2017 DT primera.b; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "vivienda_habitual",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "3% para jóvenes o 5% con límites de renta; base anual 9.040 euros menos base de deducción estatal por inversión en vivienda.",
    },
    requisitos: [
      "Siempre que se cumplan los requisitos para tener derecho a la deducción estatal por inversión en adquisición o construcción de vivienda habitual establecidos en la disposición transitoria decimoctava.1 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio:",
      "1.º Los jóvenes con residencia habitual, a efectos fiscales, en la Comunidad Autónoma de La Rioja podrán deducir el 3 % de las cantidades satisfechas en el ejercicio en la adquisición de aquella vivienda que, radicando en la Comunidad Autónoma de La Rioja, constituya o vaya a constituir su residencia habitual.",
      "1. Para tener derecho a las deducciones autonómicas regulada en las letras a), b) y c) de la disposición transitoria primera, se exigirá el cumplimiento de todos los requisitos que establecía la normativa estatal reguladora del impuesto sobre la renta de las personas físicas en su redacción vigente a 31 de diciembre de 2012, para los conceptos de vivienda habitual, adquisición y rehabilitación de la misma; y elementos que integran la base de la deducción aplicable, así como sobre comprobación de la situación patrimonial del contribuyente al finalizar el periodo de la imposición. En todo caso, los criterios establecidos en la disposición transitoria decimoctava de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, sobre deducción por inversión en vivienda habitual serán de obligado cumplimiento.",
      "4. A los efectos de la aplicación de las deducciones previstas en la disposición transitoria primera, tendrá la consideración de «joven» aquel contribuyente que no haya cumplido los 36 años de edad a la finalización del periodo impositivo. Asimismo, para tener la condición de «persona con discapacidad» deberán cumplirse los requisitos establecidos en el artículo 72.1 del Real Decreto 439/2007, de 30 de marzo , por el que se aprueba el Reglamento del Impuesto sobre la Renta de las Personas Físicas y se modifica el Reglamento de Planes y Fondos de Pensiones, aprobado por Real Decreto 304/2004, de 20 de febrero .",
      "Remisión histórica de vivienda: residencia continuada tres años y ocupación efectiva en doce meses desde adquisición o terminación; excepciones por fallecimiento o cambio/impedimento necesario justificado y vivienda por cargo o empleo. Construcción con pagos directos o al promotor y plazo de cuatro años, con ampliaciones excepcionales reglamentarias; conservación, reparación y mejoras no son adquisición. Hasta dos garajes adquiridos conjuntamente pueden asimilarse. Aplicar solo el concepto al que remite cada modalidad, sin convertir una segunda residencia en vivienda habitual.",
      "DT decimoctava estatal introducida por Ley 16/2012: pagos anteriores a 1 de enero de 2013; rehabilitación y adecuación concluidas antes de 1 de enero de 2017, y deducción previa salvo excepción por inversión anterior/reinversión. La conservación del régimen no habilita obras nuevas iniciadas en 2025.",
    ],
    limites: [
      "2.º Los jóvenes con residencia habitual, a efectos fiscales, en la Comunidad Autónoma de La Rioja, cuya base liquidable general, sometida a tributación según el artículo 50 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, no exceda de 18.030 euros en tributación individual o de 30.050 euros en tributación conjunta, siempre que la base liquidable del ahorro, sometida a tributación según el artículo 50, no supere los 1.800 euros, podrán aplicar un porcentaje de deducción del 5 % de las cantidades satisfechas en el ejercicio en la adquisición de aquella vivienda que, radicando en la Comunidad Autónoma de La Rioja, constituya o vaya a constituir su residencia habitual.",
      "3.º Solo tendrán derecho a la presente deducción los contribuyentes mencionados en los puntos anteriores que hubieran adquirido su vivienda habitual antes del 1 de enero de 2013 o satisfecho cantidades con anterioridad a dicha fecha para la construcción de la misma. En este último supuesto, salvo las ampliaciones excepcionales contempladas en la normativa del impuesto en vigor a 31 de diciembre de 2012, las obras deberán finalizar antes del plazo de cuatro años desde el inicio de la inversión, conforme al régimen de deducción aplicable en caso de construcción de vivienda habitual. En todo caso, resultará necesario que el contribuyente hubiera practicado la deducción por inversión en vivienda habitual en un periodo impositivo devengado antes del 1 de enero de 2013, salvo que hubiera resultado de aplicación lo dispuesto en el artículo 68.1.2.º de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, en su redacción vigente a 31 de diciembre de 2012, relativo a los límites de la aplicación de la deducción por adquisición o rehabilitación de otras viviendas habituales anteriores y por la generación de una ganancia patrimonial exenta por reinversión, que impiden la práctica de la deducción por adquisición de la nueva en tanto no se superen los importes detallados en dicho artículo.",
      "2. La base máxima anual de las deducciones autonómicas para adquisición de vivienda y de segunda vivienda en el medio rural, reguladas en las letras b) y c) de la disposición transitoria primera, vendrá constituida por el importe resultante de minorar la cantidad de 9.040 euros en aquellas cantidades que constituyan para el contribuyente la base de la deducción por inversión en vivienda habitual contemplada en la disposición transitoria decimoctava de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio. A estos efectos, en la consideración de la base de la deducción no se tendrá en cuenta lo que corresponda, en su caso, por las obras e instalaciones de adecuación efectuadas por las personas con discapacidad a que se refiere la normativa estatal reguladora del impuesto sobre la renta de las personas físicas.",
      "3. La base máxima anual conjunta de las deducciones por rehabilitación de vivienda habitual y por obras de adecuación de vivienda habitual para personas con discapacidad, reguladas en las letras a) y d) de la disposición transitoria primera, se establece en 9.040 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "rioja_adquisicion_construccion_vivienda_jovenes:cumple",
      "rioja_adquisicion_construccion_vivienda_jovenes:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [506, 507, 508],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_segunda_vivienda_medio_rural",
    comunidad: "la-rioja",
    nombre: "Por segunda vivienda medio rural",
    normativa:
      "Ley 10/2017 DT primera.c; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "vivienda_habitual",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "8% de inversión; máximo anual 450,76 euros; una segunda residencia por contribuyente.",
    },
    requisitos: [
      "Solo tendrán derecho a la presente deducción los contribuyentes que hubieran adquirido segunda vivienda en el medio rural antes del 1 de enero de 2013 o satisfecho cantidades para las obras de rehabilitación de la misma con anterioridad a dicha fecha, siempre que las mismas estén terminadas antes del 1 de enero de 2017.",
      "1. Para tener derecho a las deducciones autonómicas regulada en las letras a), b) y c) de la disposición transitoria primera, se exigirá el cumplimiento de todos los requisitos que establecía la normativa estatal reguladora del impuesto sobre la renta de las personas físicas en su redacción vigente a 31 de diciembre de 2012, para los conceptos de vivienda habitual, adquisición y rehabilitación de la misma; y elementos que integran la base de la deducción aplicable, así como sobre comprobación de la situación patrimonial del contribuyente al finalizar el periodo de la imposición. En todo caso, los criterios establecidos en la disposición transitoria decimoctava de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, sobre deducción por inversión en vivienda habitual serán de obligado cumplimiento.",
      "4. A los efectos de la aplicación de las deducciones previstas en la disposición transitoria primera, tendrá la consideración de «joven» aquel contribuyente que no haya cumplido los 36 años de edad a la finalización del periodo impositivo. Asimismo, para tener la condición de «persona con discapacidad» deberán cumplirse los requisitos establecidos en el artículo 72.1 del Real Decreto 439/2007, de 30 de marzo , por el que se aprueba el Reglamento del Impuesto sobre la Renta de las Personas Físicas y se modifica el Reglamento de Planes y Fondos de Pensiones, aprobado por Real Decreto 304/2004, de 20 de febrero .",
      "Remisión histórica de vivienda: residencia continuada tres años y ocupación efectiva en doce meses desde adquisición o terminación; excepciones por fallecimiento o cambio/impedimento necesario justificado y vivienda por cargo o empleo. Construcción con pagos directos o al promotor y plazo de cuatro años, con ampliaciones excepcionales reglamentarias; conservación, reparación y mejoras no son adquisición. Hasta dos garajes adquiridos conjuntamente pueden asimilarse. Aplicar solo el concepto al que remite cada modalidad, sin convertir una segunda residencia en vivienda habitual.",
      "Ámbito territorial de 2025: anexo I original de Ley 10/2017 para pequeños municipios; anexo II distinto para segunda vivienda rural. Las modificaciones de Ley 9/2025, artículo 1.Once/Doce, rigen desde 2026; no quedan cubiertas por la retroactividad de 32.20. Debe comprobarse el municipio en la lista correspondiente, sin usar población actual como sustituto.",
    ],
    limites: [
      "Los contribuyentes con residencia habitual, a efectos fiscales, en la Comunidad Autónoma de La Rioja que adquieran o rehabiliten una vivienda que constituya su segunda residencia en cualquiera de los municipios que se relacionan en el anexo II de la presente ley, y siempre que dicho municipio sea diferente al de su vivienda habitual, podrán deducir el 8% de las cantidades invertidas durante el ejercicio para tal fin, con el límite anual de 450,76 euros. De esta deducción solo podrá beneficiarse una única vivienda distinta de la habitual por contribuyente.",
      "2. La base máxima anual de las deducciones autonómicas para adquisición de vivienda y de segunda vivienda en el medio rural, reguladas en las letras b) y c) de la disposición transitoria primera, vendrá constituida por el importe resultante de minorar la cantidad de 9.040 euros en aquellas cantidades que constituyan para el contribuyente la base de la deducción por inversión en vivienda habitual contemplada en la disposición transitoria decimoctava de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio. A estos efectos, en la consideración de la base de la deducción no se tendrá en cuenta lo que corresponda, en su caso, por las obras e instalaciones de adecuación efectuadas por las personas con discapacidad a que se refiere la normativa estatal reguladora del impuesto sobre la renta de las personas físicas.",
      "3. La base máxima anual conjunta de las deducciones por rehabilitación de vivienda habitual y por obras de adecuación de vivienda habitual para personas con discapacidad, reguladas en las letras a) y d) de la disposición transitoria primera, se establece en 9.040 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "rioja_segunda_vivienda_medio_rural:cumple",
      "rioja_segunda_vivienda_medio_rural:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [508, 509, 510],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_adecuacion_vivienda_discapacidad",
    comunidad: "la-rioja",
    nombre: "Por adecuación vivienda discapacidad",
    normativa:
      "Ley 10/2017 DT primera.d; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "vivienda_habitual",
    cuantia: {
      tipo: "mixta",
      descripcion: "15%; base máxima conjunta 9.040 euros con rehabilitación.",
    },
    requisitos: [
      "Siempre que se cumplan los requisitos para tener derecho a la deducción estatal de la disposición transitoria decimoctava, apartados 1.c) y 2, de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio:",
      "1.º Las personas con discapacidad con residencia habitual, a efectos fiscales, en la Comunidad Autónoma de La Rioja podrán deducir el 15% de las cantidades satisfechas en obras de adecuación de aquella vivienda que, radicando en la Comunidad Autónoma de La Rioja, constituya o vaya a constituir su residencia habitual. Se consideran obras de adecuación las definidas en el artículo 68.1.4.º de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, en su redacción vigente a 31 de diciembre de 2012.",
      "2.º Solo tendrán derecho a la presente deducción los contribuyentes mencionados en los puntos anteriores que hubieran adquirido su vivienda habitual antes del 1 de enero de 2013 o satisfecho cantidades con anterioridad a dicha fecha para la construcción de la misma. En este último supuesto, salvo las ampliaciones excepcionales contempladas en la normativa del impuesto en vigor a 31 de diciembre de 2012, las obras deberán finalizar antes del plazo de cuatro años desde el inicio de la inversión, conforme al régimen de deducción aplicable en caso de construcción de vivienda habitual.",
      "3.º Las obras e instalaciones de adecuación deberán ser certificadas mediante el correspondiente informe técnico emitido por órgano competente en la materia como necesarias para la accesibilidad y comunicación sensorial que faciliten el desenvolvimiento digno y adecuado de las personas con discapacidad.",
      "1. Para tener derecho a las deducciones autonómicas regulada en las letras a), b) y c) de la disposición transitoria primera, se exigirá el cumplimiento de todos los requisitos que establecía la normativa estatal reguladora del impuesto sobre la renta de las personas físicas en su redacción vigente a 31 de diciembre de 2012, para los conceptos de vivienda habitual, adquisición y rehabilitación de la misma; y elementos que integran la base de la deducción aplicable, así como sobre comprobación de la situación patrimonial del contribuyente al finalizar el periodo de la imposición. En todo caso, los criterios establecidos en la disposición transitoria decimoctava de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, sobre deducción por inversión en vivienda habitual serán de obligado cumplimiento.",
      "4. A los efectos de la aplicación de las deducciones previstas en la disposición transitoria primera, tendrá la consideración de «joven» aquel contribuyente que no haya cumplido los 36 años de edad a la finalización del periodo impositivo. Asimismo, para tener la condición de «persona con discapacidad» deberán cumplirse los requisitos establecidos en el artículo 72.1 del Real Decreto 439/2007, de 30 de marzo , por el que se aprueba el Reglamento del Impuesto sobre la Renta de las Personas Físicas y se modifica el Reglamento de Planes y Fondos de Pensiones, aprobado por Real Decreto 304/2004, de 20 de febrero .",
      "Remisión histórica de vivienda: residencia continuada tres años y ocupación efectiva en doce meses desde adquisición o terminación; excepciones por fallecimiento o cambio/impedimento necesario justificado y vivienda por cargo o empleo. Construcción con pagos directos o al promotor y plazo de cuatro años, con ampliaciones excepcionales reglamentarias; conservación, reparación y mejoras no son adquisición. Hasta dos garajes adquiridos conjuntamente pueden asimilarse. Aplicar solo el concepto al que remite cada modalidad, sin convertir una segunda residencia en vivienda habitual.",
      "DT decimoctava estatal introducida por Ley 16/2012: pagos anteriores a 1 de enero de 2013; rehabilitación y adecuación concluidas antes de 1 de enero de 2017, y deducción previa salvo excepción por inversión anterior/reinversión. La conservación del régimen no habilita obras nuevas iniciadas en 2025.",
      "Obras necesarias para accesibilidad o comunicación sensorial certificadas por la Administración competente; vivienda ocupada por contribuyente, cónyuge o pariente conviviente hasta tercer grado por discapacidad, como propietario, arrendatario, subarrendatario o usufructuario, y elementos comunes en los supuestos legales.",
    ],
    limites: [
      "En todo caso, resultará necesario que el contribuyente hubiera practicado la deducción por inversión en vivienda habitual en un periodo impositivo devengado antes del 1 de enero de 2013, salvo que hubiera resultado de aplicación lo dispuesto en el artículo 68.1.2.º de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, en su redacción vigente a 31 de diciembre de 2012, relativo a los límites de la aplicación de la deducción por adquisición o rehabilitación de otras viviendas habituales anteriores y por la generación de una ganancia patrimonial exenta por reinversión, que impiden la práctica de la deducción por adquisición de la nueva en tanto no se superen los importes detallados en dicho artículo.",
      "2. La base máxima anual de las deducciones autonómicas para adquisición de vivienda y de segunda vivienda en el medio rural, reguladas en las letras b) y c) de la disposición transitoria primera, vendrá constituida por el importe resultante de minorar la cantidad de 9.040 euros en aquellas cantidades que constituyan para el contribuyente la base de la deducción por inversión en vivienda habitual contemplada en la disposición transitoria decimoctava de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio. A estos efectos, en la consideración de la base de la deducción no se tendrá en cuenta lo que corresponda, en su caso, por las obras e instalaciones de adecuación efectuadas por las personas con discapacidad a que se refiere la normativa estatal reguladora del impuesto sobre la renta de las personas físicas.",
      "3. La base máxima anual conjunta de las deducciones por rehabilitación de vivienda habitual y por obras de adecuación de vivienda habitual para personas con discapacidad, reguladas en las letras a) y d) de la disposición transitoria primera, se establece en 9.040 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "rioja_adecuacion_vivienda_discapacidad:cumple",
      "rioja_adecuacion_vivienda_discapacidad:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [510, 511],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_donaciones_fomento_mecenazgo",
    comunidad: "la-rioja",
    nombre: "Por donaciones fomento mecenazgo",
    normativa:
      "Ley 10/2017 art. 32.14; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "donativos_donaciones",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15% modalidades a/b con máximo conjunto 500 euros; 20% modalidades d/e con máximo 500 euros cada una; límite total 30% de cuota íntegra autonómica.",
    },
    requisitos: [
      "a) Los contribuyentes podrán aplicar una deducción del 15 % de las cantidades donadas durante el ejercicio para la promoción y estímulo de las actividades previstas en el artículo 1 de la Ley 3/2021, de 28 de abril , de Mecenazgo de la Comunidad Autónoma de La Rioja, y recogidas en la Estrategia Regional de Mecenazgo.",
      "b) Los contribuyentes podrán aplicar una deducción del 15 % de las cantidades donadas durante el ejercicio para la investigación, conservación, restauración, rehabilitación, consolidación, difusión, exposición y adquisición de bienes ubicados en el territorio de la Comunidad Autónoma de La Rioja cuya titularidad sea de la Administración pública de la Comunidad Autónoma de La Rioja, y/o que hayan sido declarados expresa e individualizadamente bienes de interés cultural e inscritos como tales en el Inventario de Patrimonio Histórico de La Rioja.",
      "A los efectos de aplicar la deducción prevista en dichas letras a) y b), se equiparan a las donaciones dinerarias las donaciones o aportaciones de medios materiales. El valor de las donaciones o aportaciones de medios materiales se calculará de conformidad con los criterios de valoración contenidos en el artículo 18 de la Ley 49/2002, de 23 de diciembre , de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo.",
      "d) Los contribuyentes podrán aplicar una deducción del 20 % de las cantidades donadas durante el ejercicio a empresas culturales con fondos propios inferiores a 300.000 euros con domicilio fiscal en el territorio de la Comunidad Autónoma de La Rioja, para ser empleados en el desarrollo de las siguientes actividades:",
      "1.º La cinematografía, las artes audiovisuales y las artes multimedia.",
      "2.º Las artes escénicas, la música, la danza, el teatro y el circo.",
      "3.º Las artes plásticas o bellas artes, la fotografía y el diseño.",
      "4.º El libro, la lectura y las ediciones literarias, fonográficas y cinematográficas, en cualquier soporte o formato, incluyendo el libro y la lectura.",
      "5.º Las relacionadas con la investigación, documentación, conservación, restauración, recuperación, difusión y promoción del patrimonio cultural material e inmaterial de La Rioja.",
      "6.º El folclore y las tradiciones populares de La Rioja, especialmente la música popular y las danzas tradicionales.",
      "7.º Las artes aplicadas como la joyería y cerámica artesanal.",
      "e) Los autores y creadores de bienes culturales y sus herederos podrán deducirse el 20 % del importe a que ascienda la valoración de los bienes culturales de calidad garantizada que sean donados, o sobre los que se constituya un derecho real de usufructo o depósito temporal sin contraprestación en favor de las instituciones culturales de la Comunidad Autónoma de La Rioja.",
      "Corresponde a la consejería competente en materia de Cultura aceptar las citadas donaciones, usufructos y depósitos, según lo dispuesto en el artículo 50.2 de la Ley 11/2005, de 19 de octubre , de Patrimonio de la Comunidad Autónoma de La Rioja. Dicha valoración se llevará a cabo de conformidad con las reglas contenidas en el artículo 18 de la Ley 49/2002, de 23 de diciembre .",
      "h) Las personas y entidades beneficiarias de las distintas formas de mecenazgo a que se refiere el presente apartado deberán remitir a la consejería competente en materia de Hacienda información sobre las certificaciones emitidas de las donaciones y aportaciones deducibles percibidas durante cada año natural, en la que, además de sus datos de identificación, deberá constar la siguiente información referida a los donantes y aportantes:",
      "1.º Nombre y apellidos, razón o denominación social.",
      "2.º Número de identificación fiscal.",
      "3.º Importe de la donación o aportación. En caso de que sean en especie, valoración de lo donado o aportado.",
      "4.º Referencia a si la donación o aportación se percibe para los acontecimientos de excepcional interés regional a los que hace referencia el artículo 9 de la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja.",
      "5.º Indicación de la deducción a la que da derecho el donativo.",
      "Esta información se presentará durante el mes de enero de cada año, en relación con las donaciones percibidas en el año inmediato anterior, y deberá presentarse en soporte directamente legible por ordenador o medios telemáticos, de acuerdo con las especificaciones aprobadas reglamentariamente.",
      "Las obligaciones derivadas de esta letra no se aplicarán en el caso de que ya sean objeto de declaración ante la Administración tributaria del Estado en cumplimiento de otra normativa de alcance estatal.",
      "A estos efectos, el Gobierno de La Rioja solicitará a la Agencia Estatal de Administración Tributaria el suministro de dicha información. Mientras dicho suministro de información no esté regulado, las personas y entidades beneficiarias de mecenazgo que hayan aportado la información exigida en esta disposición a la Administración tributaria del Estado, deberán aportar una copia de dicha declaración ante la Administración autonómica en la forma y plazos previstos reglamentariamente.",
      "Ley 3/2021, artículo 3: entidades sin ánimo de lucro y delegaciones registradas o con actividades en La Rioja, sector público autonómico/local, universidades y colegios mayores, centros de investigación y enseñanzas artísticas, empresas culturales riojanas y personas físicas residentes y registradas con actividad habitual. Para estas últimas se excluyen aportaciones del cónyuge, pareja o parientes hasta tercer grado y de entidades de atribución compartidas. Cada modalidad conserva sus destinatarios específicos del artículo 32.14.",
    ],
    limites: [
      "c) Las deducciones previstas en las letras a) y b) de este apartado 14 tendrán un límite conjunto de 500 euros anuales.",
      "El límite de la deducción aplicable por contribuyente será de 500 euros anuales.",
      "g) La suma de las deducciones de este apartado 14 no podrá exceder, en ningún caso, el límite del 30 % de la cuota íntegra autonómica del sujeto pasivo.",
      "La cuota líquida autonómica no podrá arrojar un resultado negativo como consecuencia del resultado de las operaciones derivadas de la aplicación de las deducciones recogidas en los apartados 14 y 15 de este artículo.",
      "Valoración de medios materiales: valor contable y en su defecto reglas del impuesto sobre patrimonio; usufructo inmobiliario 2% anual del valor catastral proporcional a días, valores por rendimientos y otros bienes por interés legal; arte y patrimonio por valoración de la Junta competente; nunca superar el valor normal de mercado (Ley 49/2002, artículo 18).",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "f) Las deducciones establecidas en las letras a) y b) anteriores serán incompatibles con las deducciones reguladas en las letras d) y e).",
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
      "Crédito fiscal de Ley 3/2021: reconocimiento administrativo del 25% de donativos dinerarios o convenios destinados a programas públicos cualificados; se aplica a tributos propios, ITPAJD o ISD, no es deducción automática de IRPF. Incompatible mientras esté vigente; uso en términos del reconocimiento y sin devolución por ingresos indebidos. BOR 84/2021 corrige 14.a para COVID desde 2020; BOR 119/2021 corrige capítulo III en 41 bis, sin cambiar los tipos del 32.14. La remisión original de 2021 sostiene 2025, sin anticipar la reforma de 2026.",
    ],
    entradaNecesaria: [
      "rioja_donaciones_fomento_mecenazgo:cumple",
      "rioja_donaciones_fomento_mecenazgo:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [511, 512, 513, 514, 515, 516, 517],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_cantidades_patrimonio_historico",
    comunidad: "la-rioja",
    nombre: "Por cantidades patrimonio histórico",
    normativa:
      "Ley 10/2017 art. 32.15; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion: "15%, máximo 500 euros anuales.",
    },
    requisitos: [
      "Los contribuyentes podrán aplicar una deducción del 15 % de las cantidades destinadas a investigación, conservación, restauración, rehabilitación o consolidación de bienes que sean de su titularidad en propiedad o en usufructo, que formen parte del patrimonio histórico de La Rioja y que estén inscritos en el Registro General del Patrimonio Cultural, Histórico y Artístico de La Rioja. No podrá aplicarse esta deducción a las cantidades destinadas a inversiones empresariales.",
    ],
    limites: [
      "El límite de la deducción aplicable por contribuyente será de 500 euros anuales.",
      "La cuota líquida autonómica no podrá arrojar un resultado negativo como consecuencia del resultado de las operaciones derivadas de la aplicación de las deducciones recogidas en los apartados 14 y 15 de este artículo.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "16. Límite a las deducciones de los apartados 14 y 15 anteriores e incompatibilidad.",
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_cantidades_patrimonio_historico:cumple",
      "rioja_cantidades_patrimonio_historico:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [517, 518],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_ejercicio_fisico_deporte",
    comunidad: "la-rioja",
    nombre: "Por ejercicio físico deporte",
    normativa:
      "Ley 10/2017 art. 32.17; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30% o 100% para mayores de 65 años o discapacidad de al menos 33%; máximo 300 euros anuales.",
    },
    requisitos: [
      "Exclusivamente darán derecho a esta deducción las cantidades desembolsadas por los siguientes servicios relativos al ejercicio físico y la práctica deportiva:",
      "a) Los prestados en gimnasios e instalaciones deportivas.",
      "b) Los prestados por las entidades inscritas en el Registro del Deporte de La Rioja.",
      "c) Las clases para la práctica del deporte o la educación física.",
      "d) Las licencias federativas emitidas por una federación riojana.",
      "Asimismo, será necesario que los servicios estén originados en el periodo impositivo y sean realizados en el ámbito territorial de La Rioja.",
      "Esta deducción quedará condicionada a su justificación documental mediante la correspondiente factura completa u ordinaria, en los términos previstos por la legislación sobre las obligaciones de facturación, sin que en ningún caso tenga tal condición la factura simplificada.",
    ],
    limites: [
      "Con efectos desde el 1 de enero de 2023, los gastos del contribuyente, del cónyuge y de aquellas personas que den derecho a la aplicación del mínimo personal y familiar en servicios relativos al ejercicio físico y la práctica deportiva darán derecho a una deducción del 30 % o del 100 % en el caso de mayores de 65 años y de quienes acrediten un grado de discapacidad igual o superior al 33 %. El límite máximo de esta deducción será 300 euros anuales.",
    ],
    prorrateo: [
      "Cuando varios contribuyentes tengan derecho a la aplicación de esta deducción, las cantidades satisfechas y el límite de la misma se prorratearán por partes iguales.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_ejercicio_fisico_deporte:cumple",
      "rioja_ejercicio_fisico_deporte:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [518, 519],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_enfermos_ela",
    comunidad: "la-rioja",
    nombre: "Por enfermos ELA",
    normativa:
      "Ley 10/2017 art. 32.18; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "50% de gastos de diagnóstico y tratamiento; máximo 2.000 euros anuales.",
    },
    requisitos: [
      "Exclusivamente darán derecho a esta deducción las cantidades desembolsadas por los siguientes conceptos:",
      "a) Los servicios prestados por profesionales sanitarios.",
      "b) Los tratamientos sanitarios prescritos por profesionales sanitarios.",
      "c) Los destinados a paliar los síntomas de la enfermedad.",
      "Esta deducción quedará condicionada a su justificación documental mediante la correspondiente factura completa u ordinaria, en los términos previstos por la legislación sobre las obligaciones de facturación, sin que en ningún caso tenga tal condición la factura simplificada.",
    ],
    limites: [
      "Los gastos del contribuyente, del cónyuge, y de aquellas personas que den derecho a la aplicación del mínimo personal y familiar relacionados con el diagnóstico y tratamiento de la esclerosis lateral amiotrófica darán derecho a una deducción del 50 %. El límite máximo de esta deducción será 2.000 euros anuales.",
    ],
    prorrateo: [
      "Cuando varios contribuyentes tengan derecho a la aplicación de esta deducción, las cantidades satisfechas y el límite de la misma se prorratearán por partes iguales.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_enfermos_ela:cumple",
      "rioja_enfermos_ela:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [519, 520],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_cuotas_organizaciones_profesionales_agrarias",
    comunidad: "la-rioja",
    nombre: "Por cuotas organizaciones profesionales agrarias",
    normativa:
      "Ley 10/2017 art. 32.19; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Cuotas satisfechas hasta 100 euros anuales por contribuyente, también en conjunta.",
    },
    requisitos: [
      "En el supuesto de tributación conjunta, la cuantía de 100 euros de deducción podrá aplicarse por cada uno de los contribuyentes que cumplan los requisitos establecidos en este artículo para su disfrute.",
      "Esta deducción quedará condicionada a su justificación documental mediante certificación, emitida por la organización profesional agraria, de las cuotas satisfechas anualmente.",
    ],
    limites: [
      "Las cantidades abonadas a una organización profesional agraria, constituida al amparo de la Ley 19/1977, de 1 de abril , sobre regulación del derecho de asociación sindical, en concepto de cuotas, ya sean de inscripción, periódicas o extraordinarias, podrán ser deducidas de la cuota íntegra autonómica del impuesto con el límite de 100 euros anuales.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_cuotas_organizaciones_profesionales_agrarias:cumple",
      "rioja_cuotas_organizaciones_profesionales_agrarias:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [520, 521],
    },
    estado: "implementada",
  },
  {
    codigo: "rioja_paliar_subida_intereses_hipotecarios",
    comunidad: "la-rioja",
    nombre: "Por paliar subida intereses hipotecarios",
    normativa:
      "Ley 10/2017 DA segunda; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "vivienda_habitual",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15% de intereses, base máxima 5.000 euros por vivienda habitual en 2023–2025.",
    },
    requisitos: [
      "Se minorarán de la base de la deducción las cantidades obtenidas por la aplicación de instrumentos de cobertura del riesgo de tipo de interés variable de los préstamos hipotecarios.",
      "A estos efectos, se considera vivienda habitual la edificación en la que el contribuyente resida de manera efectiva durante el mayor número de días en el ejercicio. La rehabilitación y la adecuación por razón de discapacidad, definidas en la normativa del impuesto sobre la renta de las personas físicas, en su redacción vigente a 31 de diciembre de 2012, se equiparan a la adquisición.",
    ],
    limites: [
      "Durante los ejercicios 2023, 2024 y 2025 los contribuyentes que hubieran adquirido su vivienda habitual a partir del 1 de enero de 2013 en el territorio de la Comunidad Autónoma podrán deducir el 15 % de las cantidades dedicadas en el ejercicio al pago de los intereses de préstamos o créditos hipotecarios destinados a su financiación. La base máxima de esta deducción será de 5.000 euros anuales por vivienda habitual.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Esta deducción será incompatible con las relacionadas en los apartados 2 y 11 del artículo 32 de la Ley 10/2017, de 27 de octubre , por la que se consolidan las disposiciones legales de la Comunidad Autónoma de La Rioja en materia de impuestos propios y tributos cedidos, y en la disposición transitoria decimoctava, en materia de deducción por inversión en vivienda habitual, de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio.",
      "Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere la Ley de Mecenazgo de la Comunidad Autónoma de La Rioja, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    entradaNecesaria: [
      "rioja_paliar_subida_intereses_hipotecarios:cumple",
      "rioja_paliar_subida_intereses_hipotecarios:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [521, 522, 523],
    },
    estado: "implementada",
  },
] satisfies ReadonlyArray<FichaDeduccionAutonomica>;

export const RIOJA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...RIOJA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  RIOJA_NACIMIENTO_ADOPCION_HIJOS_2025,
  RIOJA_ARRENDAMIENTO_MENORES_36_2025,
  RIOJA_ENFERMEDAD_CELIACA_2025,
] satisfies ReadonlyArray<FichaDeduccionAutonomica>;
