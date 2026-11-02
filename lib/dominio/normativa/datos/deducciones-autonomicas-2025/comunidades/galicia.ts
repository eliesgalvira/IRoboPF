import type { FichaDeduccionAutonomica } from "../tipos";

// Reglas descriptivas de 2025. La evaluación exige hechos y evidencia externos.
export const GALICIA_NACIMIENTO_ADOPCION_HIJOS_2025 = {
  codigo: "galicia_nacimiento_adopcion_hijos",
  comunidad: "galicia",
  nombre: "Por nacimiento o adopción de hijos",
  normativa:
    "DL 1/2011 art. 5.Dos; ejercicio 2025. Consignación con acreditación externa de requisitos.",
  categoria: "circunstancias_personales_familiares",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "360/1.200/2.400 euros hasta 22.000 de base imponible general más ahorro menos mínimos; por encima, 300 o 360 en parto múltiple en el nacimiento. Dos periodos siguientes: 300 entre 22.000,01 y 31.000, y 360/1.200/2.400 hasta 22.000. Incrementos y reparto según requisitos.",
  },
  requisitos: [
    "1. El contribuyente podrá deducir de la cuota íntegra autonómica por cada hijo nacido o adoptado en el período impositivo, que conviva con el contribuyente en la fecha de devengo del impuesto, la siguiente cuantía:",
    "a) 300 euros, siempre que la base imponible total menos los mínimos personal y familiar para los efectos del IRPF sea mayor o igual de 22.000,01 euros. En caso de parto múltiple, esta deducción ascenderá a 360 euros por cada hijo.",
    "b) 360 euros, siempre que la base imponible total menos los mínimos personal y familiar para los efectos del IRPF sea menor o igual a 22.000 euros. Esta cuantía será de 1.200 euros si se trata del segundo hijo y de 2.400 si se trata del tercer hijo o siguientes.",
    "La cuantía se incrementará en un 20 % para los contribuyentes residentes en municipios de menos de 5.000 habitantes y en los resultantes de procedimientos de la fusión o incorporación.",
    "a) 300 euros, siempre que la base imponible total menos los mínimos personal y familiar para los efectos del IRPF esté comprendida entre 22.000,01 y 31.000 euros.",
    "4. Las cuantías fijadas por esta deducción se duplicarán en el caso de que el nacido o adoptado tenga reconocido un grado de discapacidad igual o superior al 33 %.",
    "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
  ],
  limites: [
    "Base imponible total menos los mínimos personal y familiar: suma de general y ahorro menos mínimos. Umbrales inclusivos de 22.000 y, solo en los dos ejercicios siguientes, 31.000 euros.",
    "2. La deducción se extenderá a los dos períodos impositivos siguientes al nacimiento o adopción, siempre que el hijo nacido o adoptado conviva con el contribuyente en la fecha de devengo del impuesto que corresponda a cada uno de ellos, según las siguientes cuantías y límites de renta:",
  ],
  prorrateo: [
    "3. Cuando, en el período impositivo de nacimiento o adopción, o en los dos siguientes, los hijos convivan con ambos progenitores la deducción se practicará por partes iguales en la declaración de cada uno de ellos.",
  ],
  compatibilidades: [],
  incompatibilidades: [],
  entradaNecesaria: ["importeBase", "cumpleRequisitosYLimites"],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [365, 366, 367],
  },
  estado: "implementada",
} satisfies FichaDeduccionAutonomica;

export const GALICIA_FAMILIA_NUMEROSA_2025 = {
  codigo: "galicia_familia_numerosa",
  comunidad: "galicia",
  nombre: "Por familia numerosa",
  normativa:
    "DL 1/2011 art. 5.Tres; ejercicio 2025. Consignación con acreditación externa de requisitos.",
  categoria: "circunstancias_personales_familiares",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "250 euros hasta dos hijos, 400 con categoría especial; en los restantes casos incremento de 250 euros por cada hijo. Duplicación por discapacidad del 65%.",
  },
  requisitos: [
    "2. El contribuyente que, en la fecha de devengo del impuesto, posea el título de familia numerosa podrá deducir de la cuota íntegra autonómica:",
    "a) en caso de que se trate de familias de hasta dos hijos/as, 250 euros, salvo que disfruten del título de categoría especial, en cuyo caso será de 400 euros.",
    "b) en el resto de los casos, la deducción se incrementará en 250 euros adicionales por cada hijo/a.",
    "En caso de que el contribuyente o alguno de los descendientes que den derecho a aplicar esta deducción tenga un grado de discapacidad igual o superior al 65 %, las deducciones anteriores se duplicarán.",
    "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
  ],
  limites: [],
  prorrateo: [
    "3. Cuando más de un contribuyente tenga derecho a la aplicación de las deducciones previstas en este apartado respecto de los mismos descendientes, su importe será prorrateado entre ellos por partes iguales.",
  ],
  compatibilidades: [],
  incompatibilidades: [
    "Incompatible con la deducción por dos hijos del artículo 5.Tres.1.",
  ],
  entradaNecesaria: ["importeBase", "cumpleRequisitosYLimites"],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [368, 369, 370],
  },
  estado: "implementada",
} satisfies FichaDeduccionAutonomica;

export const GALICIA_ALQUILER_VIVIENDA_HABITUAL_2025 = {
  codigo: "galicia_alquiler_vivienda_habitual",
  comunidad: "galicia",
  nombre: "Por alquiler de la vivienda habitual",
  normativa:
    "DL 1/2011 art. 5.Siete; ejercicio 2025. Consignación con acreditación externa de requisitos.",
  categoria: "vivienda_habitual",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "10%, máximo 300 euros por contrato y año; 20%, máximo 600 con dos o más hijos menores; duplicación por discapacidad del 33%.",
  },
  requisitos: [
    "a) Que su edad, en la fecha de devengo del impuesto, sea igual o inferior a 35 años.",
    "b) Que la fecha del contrato de arrendamiento sea posterior al 1 de enero de 2003.",
    "c) Que hubiese constituido el depósito de la fianza a que se refiere el artículo 36.1 de la Ley 29/1994 , de arrendamientos urbanos, en el Instituto Gallego de la Vivienda y Suelo, o bien se posea copia compulsada de la denuncia presentada ante dicho organismo por no entregarle dicho justificante la persona arrendadora.",
    "d) Que la base imponible del período, antes de la aplicación de las reducciones por mínimo personal o familiar, no sea superior a 22.000 euros.",
    "Las cuantías fijadas por esta deducción se duplicarán en el caso de que el arrendatario tenga reconocido un grado de discapacidad igual o superior al 33 %.",
    "En caso de tributación conjunta, el requisito de la edad deberá de cumplirlo, por lo menos, uno de los cónyuges o, en su caso, el padre o la madre.",
    "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
  ],
  limites: [
    "El contribuyente podrá deducir de la cuota íntegra autonómica el 10 %, con un límite de 300 euros por contrato de arrendamiento, que será del 20 % con un límite de 600 euros si tiene dos o más hijos menores de edad, de las cantidades que hubiese satisfecho durante el período impositivo en concepto de alquiler de su vivienda habitual, con la condición de que concurran los siguientes requisitos:",
  ],
  prorrateo: [
    "Cuando, cumpliendo estos requisitos, dos contribuyentes tengan derecho a la aplicación de esta deducción, el importe total de esta, sin exceder el límite establecido por contrato de arrendamiento, se prorrateará por partes iguales en la declaración de cada uno de ellos.",
  ],
  compatibilidades: [],
  incompatibilidades: [],
  entradaNecesaria: ["importeBase", "cumpleRequisitosYLimites"],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [373, 374],
  },
  estado: "implementada",
} satisfies FichaDeduccionAutonomica;

export const GALICIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  {
    codigo: "galicia_familias_dos_hijos",
    comunidad: "galicia",
    nombre: "Por familias dos hijos",
    normativa:
      "DL 1/2011 art. 5.Tres; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "circunstancias_personales_familiares",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "250 euros; 500 si contribuyente o descendiente tiene discapacidad de al menos el 65%.",
    },
    requisitos: [
      "1. El contribuyente que, en la fecha de devengo del impuesto, tenga dos descendientes que generen a su favor el derecho a la aplicación del correspondiente mínimo por descendientes establecido por la normativa reguladora del impuesto, podrá deducir de la cuota íntegra autonómica la cantidad de 250 euros.",
      "En caso de que el contribuyente o alguno de los descendientes que den derecho a aplicar esta deducción tenga un grado de discapacidad igual o superior al 65 %, la deducción anterior se duplicará.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [],
    prorrateo: [
      "3. Cuando más de un contribuyente tenga derecho a la aplicación de las deducciones previstas en este apartado respecto de los mismos descendientes, su importe será prorrateado entre ellos por partes iguales.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "Incompatible con familia numerosa del artículo 5.Tres.2.",
    ],
    entradaNecesaria: [
      "galicia_familias_dos_hijos:cumple",
      "galicia_familias_dos_hijos:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [367, 368],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_acogimiento_menores",
    comunidad: "galicia",
    nombre: "Por acogimiento menores",
    normativa:
      "DL 1/2011 art. 5.Cuatro; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "circunstancias_personales_familiares",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "300 euros por menor acogido; se excluye acogimiento preadoptivo si se adopta durante el ejercicio.",
    },
    requisitos: [
      "Los contribuyentes podrán deducir de la cuota íntegra autonómica la cantidad de 300 euros por cada menor en régimen de acogimiento familiar simple, permanente, provisional o preadoptivo, administrativo o judicial, formalizado por el órgano competente en materia de menores de la Xunta de Galicia.",
      "No dará lugar a esta deducción el supuesto de acogimiento familiar preadoptivo cuando se produzca la adopción de la menor o del menor durante el período impositivo, sin perjuicio de la aplicación, en su caso, de la deducción por adopción.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [],
    prorrateo: [
      "En el caso de acogimiento de menores por matrimonios o por las parejas de hecho a que se refiere la disposición adicional tercera de la Ley 2/2006, de 14 de junio , de derecho civil de Galicia, el importe de la deducción se prorrateará por partes iguales en la declaración de cada uno de ellos, si optan por la declaración individual.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_acogimiento_menores:cumple",
      "galicia_acogimiento_menores:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [370, 371],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_cuidado_hijos_menores",
    comunidad: "galicia",
    nombre: "Por cuidado hijos menores",
    normativa:
      "DL 1/2011 art. 5.Cinco; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "circunstancias_personales_familiares",
    cuantia: {
      tipo: "mixta",
      descripcion: "30% de gastos; máximo 400 euros o 600 con dos o más hijos.",
    },
    requisitos: [
      "a) Que en la fecha de devengo del impuesto los hijos tengan tres o menos años de edad.",
      "b) Que ambos padres realicen una actividad por cuenta propia o ajena por la que estén dados de alta en el régimen correspondiente de la Seguridad Social o mutualidad.",
      "c) Que, en el caso de que la deducción sea aplicable por gastos de una persona empleada del hogar, esta esté dada de alta en el régimen correspondiente de la Seguridad Social.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "Los contribuyentes que por motivos de trabajo, por cuenta propia o ajena, tengan que dejar a sus hijos menores al cuidado de una persona empleada del hogar o en escuelas infantiles de 0-3 años podrán deducir de la cuota íntegra autonómica el 30 % de las cantidades satisfechas en el período, con el límite máximo de 400 euros, y 600 euros si tienen dos o más hijos, siempre que concurran los siguientes requisitos:",
      "d) Que la base imponible total menos los mínimos personal y familiar para efectos del IRPF no exceda 22.000 euros en tributación individual o 31.000 euros en tributación conjunta.",
    ],
    prorrateo: [
      "Cuando más de un contribuyente tenga derecho a la aplicación de esa deducción con respecto a los mismos descendientes, su importe será prorrateado entre ellos.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_cuidado_hijos_menores:cumple",
      "galicia_cuidado_hijos_menores:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [371, 372, 373],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_discapacidad_mayor_65_ayuda_terceras_personas",
    comunidad: "galicia",
    nombre: "Por discapacidad mayor 65 ayuda terceras personas",
    normativa:
      "DL 1/2011 art. 5.Seis; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "circunstancias_personales_familiares",
    cuantia: {
      tipo: "mixta",
      descripcion: "10% de gastos de ayuda; máximo 600 euros.",
    },
    requisitos: [
      "b) Se acredite la necesidad de la ayuda de terceras personas.",
      "c) El contribuyente no sea usuario de residencias públicas o concertadas de la Comunidad Autónoma de Galicia.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "Los contribuyentes de edad igual o superior a sesenta y cinco años afectados por un grado de discapacidad igual o superior al 65 % y que precisen ayuda de terceras personas podrán deducir de la cuota íntegra autonómica el 10 % de las cantidades satisfechas a los terceros, con un límite máximo de 600 euros, siempre que:",
      "a) La base imponible total menos los mínimos personal y familiar a efectos del IRPF no exceda de 22.000 euros en tributación individual o de 31.000 euros en tributación conjunta.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_discapacidad_mayor_65_ayuda_terceras_personas:cumple",
      "galicia_discapacidad_mayor_65_ayuda_terceras_personas:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [371, 372, 373],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_nuevas_tecnologias_hogares",
    comunidad: "galicia",
    nombre: "Por nuevas tecnologías hogares",
    normativa:
      "DL 1/2011 art. 5.Ocho; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30% del alta y cuotas; máximo 100 euros entre todos los contratos.",
    },
    requisitos: [
      "a) Solo podrá aplicarse en el ejercicio en que se suscribe el contrato de conexión a líneas de alta velocidad.",
      "b) La línea de alta velocidad contratada estará destinada al uso exclusivo del hogar y no estará vinculada al ejercicio de cualquier actividad empresarial o profesional.",
      "c) No resultará de aplicación si el contrato de conexión supone simplemente un cambio de compañía prestadora del servicio y el contrato con la compañía anterior se realizó en otro ejercicio. Tampoco resultará de aplicación cuando se contrate la conexión a una línea de alta velocidad y el contribuyente mantenga, al mismo tiempo, otras líneas contratadas en ejercicios anteriores.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "Los contribuyentes que durante el ejercicio accedan a internet mediante la contratación de líneas de alta velocidad podrán deducir de la cuota íntegra autonómica el 30% de las cantidades satisfechas en concepto de cuota de alta y cuotas mensuales, con un límite máximo de 100 euros y según los requisitos siguientes:",
      "d) El límite máximo de la deducción se aplica respecto a todas las cantidades satisfechas durante el ejercicio, ya correspondan a un solo contrato de conexión, ya a varios que se mantengan simultáneamente.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_nuevas_tecnologias_hogares:cumple",
      "galicia_nuevas_tecnologias_hogares:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [374, 375],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_inversion_entidades_nuevas_reciente_creacion",
    comunidad: "galicia",
    nombre: "Por inversión entidades nuevas reciente creación",
    normativa:
      "DL 1/2011 art. 5.Nueve; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30%, máximo 6.000 euros; incremento del 15% adicional con límite 9.000 euros en los supuestos cualificados.",
    },
    requisitos: [
      "b) La entidad en la que hay que materializar la inversión ha de cumplir los siguientes requisitos:",
      "1. Debe tener el domicilio social y fiscal en Galicia y mantenerlo durante los tres años siguientes a la constitución o ampliación.",
      "2. Debe desempeñar una actividad económica durante los tres años siguientes a la constitución o ampliación. A tal efecto, no ha de tener por actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo dispuesto en el artículo 4.8.º Dos.a) de la Ley 19/1991, de 6 de junio , del impuesto sobre el patrimonio.",
      "3. Debe contar, como mínimo, con una persona ocupada con contrato laboral y a jornada completa, dada de alta en el régimen general de la Seguridad Social y con residencia habitual en Galicia, durante los tres años siguientes a la constitución o ampliación.",
      "4. En caso de que la inversión se hubiera realizado mediante una ampliación de capital, la sociedad mercantil debió de haber sido constituida en los tres años anteriores a la fecha de esta ampliación, siempre que, además, durante los veinticuatro meses siguientes a la fecha del inicio del periodo impositivo del impuesto sobre sociedades en que se hubiera realizado la ampliación su plantilla media con residencia habitual en Galicia se hubiera incrementado, al menos, en una persona con respecto a la plantilla media con residencia habitual en Galicia en los doce meses anteriores y que dicho incremento se mantuviera durante un periodo adicional de otros veinticuatro meses.",
      "Para el cálculo de la plantilla media total de la empresa y de su incremento, se tomarán las personas empleadas, en los términos en que disponga la legislación laboral, teniendo en cuenta la jornada contratada en relación con la jornada completa.",
      "c) Las operaciones en que sea de aplicación la deducción deben formalizarse en escritura pública, en la cual ha de especificarse la identidad de los inversores y el importe de la inversión respectiva.",
      "d) Las participaciones adquiridas deben mantenerse en el patrimonio del contribuyente durante un periodo mínimo de tres años, siguientes a la constitución o ampliación.",
      "a) La adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital, cuando se trate de sociedades anónimas, limitadas, sociedades laborales y cooperativas que acrediten ser pequeñas y medianas empresas innovadoras, de acuerdo con lo dispuesto en la Orden ECC/1087/2015, de 5 de junio , por la que se regula la obtención del sello de pequeña y mediana empresa innovadora y se crea y regula el funcionamiento del Registro de la Pequeña y Mediana Empresa Innovadora.",
      "b) La adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital, cuando se realice en sociedades anónimas, limitadas, sociedades laborales y cooperativas que acrediten ser sociedades promotoras de un proyecto empresarial que haya accedido a la obtención de calificación como iniciativa de empleo de base tecnológica, de conformidad con lo dispuesto en el Decreto 56/2007, de 15 de marzo, por el que se establece un programa de apoyo a las iniciativas de empleo de base tecnológica (IEBT), mediante la inscripción de la iniciativa en el Registro administrativo de Iniciativas Empresariales de Base Tecnológica.",
      "c) La adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital, cuando se realice en sociedades anónimas, limitadas, sociedades laborales y cooperativas participadas por universidades u organismos de investigación.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
      "Ley 19/1991, artículo 4.Ocho.Dos.a: entidad patrimonial si durante más de 90 días del ejercicio más de la mitad del activo son valores o activos no afectos. Valores contables fieles y afectación según IRPF; excluir valores por obligaciones legales, créditos de actividad, sociedades de valores y participaciones de al menos 5% para dirigir y gestionar con medios y participada no patrimonial; excluir activos cubiertos por beneficios no distribuidos de actividad del año y diez anteriores, incluidos dividendos cualificados con ingresos de actividad de al menos 90%. No se trasladan los requisitos de participación o remuneración de las letras b/c de la exención patrimonial.",
      "Incremento cualificado: comprobar sello y vigencia en Registro de PYME innovadora (Orden ECC/1087/2015: financiación pública no revocada o informe motivado positivo en tres años, patente en explotación de hasta cinco años o certificación JEI/EA0047/UNE166002). Alternativa IEBT: resolución de calificación e inscripción de oficio en registro según Decreto 56/2007; viabilidad técnica/económica/financiera/comercial, innovación o base científica, nueva empresa con centro en Galicia y previsión de empleo estable y cualificado (un universitario por cada cuatro puestos); inicio en un año salvo plazo distinto en resolución. La corrección DOG 78/2007 ajusta tramitación de informes; no basta describir un proyecto como tecnológico.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir en la cuota íntegra autonómica, y con límite de 6.000 euros, el 30 % de las cantidades invertidas durante el ejercicio en la adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital en sociedades anónimas, limitadas, sociedades laborales y cooperativas, siempre que se cumplan los siguientes requisitos:",
      "a) La participación del contribuyente, computada junto con las del cónyuge o personas unidas por razón de parentesco, en línea directa o colateral, por consanguinidad o afinidad hasta el tercer grado incluido, no puede ser superior al 40 % ni inferior al 1 % del capital social de la sociedad objeto de la inversión o de sus derechos de voto en ningún momento y durante los tres años siguientes a la constitución o ampliación. El límite máximo de participación en el capital social no se aplicará en el caso de sociedades laborales o cooperativas compuestas únicamente por dos personas socias, mientras se mantenga esta circunstancia.",
      "2. La deducción regulada en el número 1 podrá incrementarse en un 15 % adicional, con límite de 9.000 euros, cuando, además de cumplir los requisitos de dicho número, se diese una de las siguientes circunstancias:",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_inversion_entidades_nuevas_reciente_creacion:cumple",
      "galicia_inversion_entidades_nuevas_reciente_creacion:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [375, 376, 377, 378],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_inversion_entidades_nuevas_financiacion",
    comunidad: "galicia",
    nombre: "Por inversión entidades nuevas financiación",
    normativa:
      "DL 1/2011 art. 5.Diez; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30% de capital, préstamos y garantías; límite conjunto 20.000 euros. Incremento del 15% adicional con límite 35.000 euros en los supuestos cualificados.",
    },
    requisitos: [
      "a) El 30 % de las cantidades invertidas durante el ejercicio en la adquisición de capital social como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital en sociedades anónimas, limitadas, sociedades laborales y cooperativas.",
      "b) Con respecto a las mismas entidades, podrá deducirse el 30 % de las cantidades prestadas durante el ejercicio, así como de las cantidades garantizadas personalmente por el contribuyente, siempre que el préstamo se otorgase o la garantía se constituyese en el ejercicio en el que se proceda a la constitución de la sociedad o a la ampliación de capital de la misma.",
      "Para tener derecho a estas deducciones habrán de cumplirse los siguientes requisitos:",
      "b) La entidad en la que hay que materializar la inversión, préstamo o garantía ha de cumplir los siguientes requisitos:",
      "1.º Debe tener el domicilio social y fiscal en Galicia y mantenerlo durante los tres años siguientes a la constitución o ampliación.",
      "2.º Debe desempeñar una actividad económica durante los tres años siguientes a la constitución o ampliación. A ese efecto, no ha de tener por actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo dispuesto en el artículo 4.8.ºDos.a) de la Ley 19/1991, de 6 de junio , del impuesto sobre el patrimonio.",
      "3.º Debe contar, como mínimo, con una persona ocupada con contrato laboral y a jornada completa, dada de alta en el régimen general de la Seguridad Social y con residencia habitual en Galicia. El contrato tendrá una duración mínima de un año, debiendo formalizarse dentro de los dos años siguientes a la constitución o ampliación, salvo en el caso de sociedades laborales o sociedades cooperativas.",
      "4.º En caso de que la inversión hubiera sido realizada mediante una ampliación de capital o el préstamo o garantía se hubiera realizado en el ejercicio de una ampliación, la sociedad mercantil debió de haber sido constituida en los tres años anteriores a la fecha de esta ampliación, y además, durante los veinticuatro meses siguientes a la fecha del inicio del periodo impositivo del impuesto sobre sociedades en que se hubiera realizado la ampliación, su plantilla media con residencia habitual en Galicia debió de haberse incrementado, al menos, en una persona respecto a la plantilla media con residencia habitual en Galicia en los doce meses anteriores, manteniéndose dicho incremento durante un periodo adicional de otros doce meses, salvo en el caso de sociedades laborales o sociedades cooperativas.",
      "Para el cálculo de la plantilla media total de la empresa y de su incremento se tomarán las personas empleadas, en los términos en que disponga la legislación laboral, teniendo en cuenta la jornada contratada en relación con la jornada completa.",
      "c) El contribuyente puede formar parte del consejo de administración de la sociedad en que materializó la inversión, pero en ningún caso puede llevar a cabo funciones ejecutivas ni de dirección durante un plazo de diez años, ni puede mantener una relación laboral con la entidad objeto de la inversión durante ese mismo plazo, salvo en el caso de sociedades laborales o sociedades cooperativas.",
      "d) Las operaciones en que sea de aplicación la deducción deben formalizarse en escritura pública, en la cual ha de especificarse la identidad de los contribuyentes que pretendan aplicar esta deducción y el importe de la operación respectiva.",
      "e) Las participaciones adquiridas han de mantenerse en el patrimonio del contribuyente durante un periodo mínimo de tres años, siguientes a la constitución o ampliación. En caso de préstamos, estos deben referirse a las operaciones de financiación con plazo superior a cinco años, no pudiendo amortizar una cantidad superior al 20 % anual del importe del principal prestado. En caso de garantías, estas se extenderán a todo el tiempo de vigencia de la operación garantizada, no pudiendo ser inferior a cinco años.",
      "a) La adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución o de ampliación de capital, cuando se trate de sociedades anónimas, limitadas, sociedades laborales y cooperativas que acrediten ser pequeñas y medianas empresas innovadoras, de acuerdo con lo dispuesto en la Orden ECC/1087/2015, de 5 de junio , por la que se regula la obtención del sello de pequeña y mediana empresa innovadora y se crea y regula el funcionamiento del Registro de la Pequeña y Mediana Empresa Innovadora.",
      "b) La adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital, cuando se realice en sociedades anónimas, limitadas, sociedades laborales y cooperativas que acrediten ser sociedades promotoras de un proyecto empresarial que haya accedido a la obtención de calificación como iniciativa de empleo de base tecnológica, de conformidad con lo dispuesto en el Decreto 56/2007, de 15 de marzo, por el que se establece un programa de apoyo a las iniciativas de empleo de base tecnológica (IEBT), mediante la inscripción de la iniciativa en el Registro administrativo de Iniciativas Empresariales de Base Tecnológica.",
      "c) La adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital, cuando se realice en sociedades anónimas, limitadas, sociedades laborales y cooperativas participadas por universidades u organismos de investigación.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
      "Ley 19/1991, artículo 4.Ocho.Dos.a: entidad patrimonial si durante más de 90 días del ejercicio más de la mitad del activo son valores o activos no afectos. Valores contables fieles y afectación según IRPF; excluir valores por obligaciones legales, créditos de actividad, sociedades de valores y participaciones de al menos 5% para dirigir y gestionar con medios y participada no patrimonial; excluir activos cubiertos por beneficios no distribuidos de actividad del año y diez anteriores, incluidos dividendos cualificados con ingresos de actividad de al menos 90%. No se trasladan los requisitos de participación o remuneración de las letras b/c de la exención patrimonial.",
      "Incremento cualificado: comprobar sello y vigencia en Registro de PYME innovadora (Orden ECC/1087/2015: financiación pública no revocada o informe motivado positivo en tres años, patente en explotación de hasta cinco años o certificación JEI/EA0047/UNE166002). Alternativa IEBT: resolución de calificación e inscripción de oficio en registro según Decreto 56/2007; viabilidad técnica/económica/financiera/comercial, innovación o base científica, nueva empresa con centro en Galicia y previsión de empleo estable y cualificado (un universitario por cada cuatro puestos); inicio en un año salvo plazo distinto en resolución. La corrección DOG 78/2007 ajusta tramitación de informes; no basta describir un proyecto como tecnológico.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir en la cuota íntegra autonómica, y con límite conjunto de 20.000 euros, las siguientes cantidades:",
      "a) La participación del contribuyente, computada junto con las del cónyuge o de las personas unidas por razón de parentesco, en línea directa o colateral, por consanguinidad o afinidad hasta el tercer grado incluido, no puede ser superior al 40 % ni inferior al 1 % del capital social de la sociedad objeto de la inversión, o de sus derechos de voto, en ningún momento y durante los tres años siguientes a la constitución o ampliación. En caso de préstamo o garantía, no será necesaria una participación del contribuyente en el capital, pero, si esta existe, no puede ser superior al 40 %, con los mismos límites temporales anteriores. El importe prestado o garantizado por el contribuyente tiene que ser superior al 1 % del patrimonio neto de la sociedad. El límite máximo de participación en el capital social no se aplicará en el caso de sociedades laborales o cooperativas compuestas únicamente por dos personas socias, mientras se mantenga esta circunstancia.",
      "2. Las deducciones reguladas en el número anterior podrán incrementarse en un 15 % adicional, con límite de 35.000 euros, cuando, además de cumplirse los requisitos de dicho número, se diese una de las siguientes circunstancias:",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "La deducción contenida en este número resultará incompatible, para las mismas inversiones, con las deducciones previstas en los números 9 y 11 de este artículo.",
    ],
    entradaNecesaria: [
      "galicia_inversion_entidades_nuevas_financiacion:cumple",
      "galicia_inversion_entidades_nuevas_financiacion:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [378, 379, 380, 381],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_inversion_mab",
    comunidad: "galicia",
    nombre: "Por inversión MAB",
    normativa:
      "DL 1/2011 art. 5.Once; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15%, máximo 4.000 euros; reparto por cuartas partes en inversión y tres ejercicios siguientes.",
    },
    requisitos: [
      "2. Para poder aplicar la deducción a que se refiere el apartado 1 han de cumplirse los requisitos siguientes:",
      "a) La participación conseguida por el contribuyente en la sociedad objeto de la inversión no puede ser superior al 10 % de su capital social.",
      "b) Las acciones adquiridas deben mantenerse en el patrimonio del contribuyente durante un periodo de tres años, como mínimo.",
      "c) La sociedad objeto de la inversión debe tener el domicilio social y fiscal en Galicia, y no debe tener como actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo dispuesto por el artículo 4.8.º Dous.a) de la Ley 19/1991, de 6 de junio , del impuesto sobre el patrimonio.",
      "Los requisitos indicados en las letras a) y c) anteriores deberán cumplirse durante todo el plazo de mantenimiento indicado en la letra b), contado desde la fecha de adquisición de la participación.",
      "d) Las operaciones en que sea de aplicación la deducción deben formalizarse en escritura pública, en la cual ha de especificarse la identidad de los inversores y el importe de la inversión respectiva.",
      "3. El incumplimiento de los requisitos anteriores comporta la pérdida del beneficio fiscal.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
      "Ley 19/1991, artículo 4.Ocho.Dos.a: entidad patrimonial si durante más de 90 días del ejercicio más de la mitad del activo son valores o activos no afectos. Valores contables fieles y afectación según IRPF; excluir valores por obligaciones legales, créditos de actividad, sociedades de valores y participaciones de al menos 5% para dirigir y gestionar con medios y participada no patrimonial; excluir activos cubiertos por beneficios no distribuidos de actividad del año y diez anteriores, incluidos dividendos cualificados con ingresos de actividad de al menos 90%. No se trasladan los requisitos de participación o remuneración de las letras b/c de la exención patrimonial.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir en la cuota íntegra autonómica, y con un límite de 4.000 euros, el 15 % de las cantidades invertidas durante el ejercicio en la adquisición de acciones como consecuencia de acuerdos de ampliación de capital suscritos por medio del segmento de empresas en expansión del mercado alternativo bolsista, aprobado por acuerdo del Consejo de Ministros de 30 de diciembre de 2005.",
    ],
    prorrateo: [
      "La deducción total calculada conforme al párrafo anterior se prorrateará por partes iguales en el ejercicio en que se realice la inversión y en los tres ejercicios siguientes.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "4. La deducción contenida en este apartado resultará incompatible, para las mismas inversiones, con las deducciones previstas en los apartados 9 y 10 anteriores.",
    ],
    entradaNecesaria: [
      "galicia_inversion_mab:cumple",
      "galicia_inversion_mab:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [381, 382],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_donaciones_idi",
    comunidad: "galicia",
    nombre: "Por donaciones I+D+i",
    normativa:
      "DL 1/2011 art. 5.Doce; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "donativos_donaciones",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "25% de donativos monetarios; límite 10% de la cuota íntegra autonómica.",
    },
    requisitos: [
      "Organismo de investigación y difusión de conocimientos (Reglamento 651/2014, artículo 2.83): objetivo principal de investigación independiente o difusión amplia de resultados por enseñanza, publicación o transferencia; si desarrolla actividad económica, financiación, costes e ingresos separados. Las empresas con influencia decisiva no pueden disfrutar acceso preferente a los resultados. La condición de entidad sin ánimo de lucro, por sí sola, no satisface esta remisión.",
      "2. La deducción queda condicionada a la justificación documental adecuada y suficiente de los presupuestos de hecho y de los requisitos que determinan su aplicabilidad. En particular, las entidades beneficiarias de estos donativos deben enviar a la Agencia Tributaria de Galicia, dentro de los primeros veinte días de cada año, una relación de las personas físicas que efectuaron donativos durante el año anterior, con indicación de las cantidades donadas por cada una de estas personas.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir de la cuota íntegra autonómica del impuesto el 25 %, hasta el límite del 10 % de dicha cuota, de los donativos monetarios que hagan a favor de centros de investigación adscritos a universidades gallegas y de los promovidos o participados por la Comunidad Autónoma de Galicia que tengan por objeto el fomento de la investigación científica y el desarrollo y la innovación tecnológicos, así como de los realizados a favor de entidades sin ánimo de lucro acogidas a la Ley 49/2002, de 23 de diciembre , de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo, a condición de que estas últimas tengan la consideración de organismo de investigación y difusión de conocimientos con arreglo a lo previsto en el artículo 2.83 del Reglamento (UE) n.º 651/2014 de la Comisión, de 17 de junio de 2014 , por el que se declaran determinadas categorías de ayudas compatibles con el mercado interior en aplicación de los artículos 107 y 108 del Tratado.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_donaciones_idi:cumple",
      "galicia_donaciones_idi:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [382, 383],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_climatizacion_agua_caliente_renovables",
    comunidad: "galicia",
    nombre: "Por climatización agua caliente renovables",
    normativa:
      "DL 1/2011 art. 5.Trece; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion: "5% de instalaciones; máximo 280 euros por sujeto pasivo.",
    },
    requisitos: [
      "La definición remitida de renovables del artículo 2.a de Directiva 2009/28/CE comprende fuentes no fósiles: eólica, solar, aerotérmica, geotérmica, hidrotérmica y oceánica, hidráulica, biomasa, gases de vertedero, gases de depuración y biogás; no basta llamar renovable al equipo. Se conserva el requisito regional de instalación registrada y autoconsumo.",
      "Se entiende por energías renovables aquellas a las que se refiere el artículo 2 de la Directiva 2009/28/CE del Parlamento Europeo y del Consejo, de 23 de abril de 2009 , relativa al fomento del uso de energía procedente de fuentes renovables y por la que se modifican y se derogan las directivas 2001/77/CE y 2003/30/CE .",
      "En caso de edificios de viviendas en régimen de propiedad horizontal que sean de nueva construcción o en los que se proceda a la sustitución de los equipos de generación térmica por otros que empleen energías renovables, esta deducción podrá aplicarla cada uno de los propietarios individualmente en el porcentaje que le corresponda en la comunidad de propietarios.",
      "2. La base de esta deducción estará constituida por las cantidades efectivamente satisfechas en la totalidad de la instalación, esto es, sistema de generación, sistema de emisión térmica y sistema de captación, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito, a los instaladores habilitados que realicen la instalación. En ningún caso darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero de curso legal.",
      "3. Solo se podrá practicar la deducción si se cumplen los siguientes requisitos:",
      "a) La instalación debe estar debidamente registrada por el instalador, que debe estar habilitado para el efecto, en la Oficina Virtual de Industria (OVI), según lo establecido en el Reglamento de instalaciones térmicas en edificios aprobado por Real decreto 1027/2007, de 20 de julio . Se le remitirá al titular o empresa que registró la instalación un código de verificación de esta.",
      "b) Posteriormente, y siempre antes de que expire el plazo para presentar la autoliquidación correspondiente al período impositivo en el que se sufragó la instalación, será necesario aportar a través de la OVI la siguiente documentación:",
      "– El presupuesto analizado de la instalación.",
      "– La factura o facturas emitida/s por el instalador habilitado.",
      "– Lo/s justificante/s de pago por la totalidad del coste de la instalación.",
      "– En el caso de efectuarse la inversión por una comunidad de propietarios, deberá aportarse un certificado, emitido por su representante legal, de las aportaciones económicas correspondientes a cada comunero.",
      "En caso de que la instalación se realice en una vivienda unifamiliar, esta documentación será aportada por el sujeto pasivo. Si se tratase de edificios en régimen de propiedad horizontal, será aportada por el representante legal de la comunidad de propietarios o por persona autorizada para el efecto.",
      "4. Para poder practicarse esta deducción debe constar en la declaración tributaria del sujeto pasivo la referencia al código de la instalación proporcionado por la OVI en el certificado de registro de la instalación.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir en la cuota íntegra autonómica el 5 % de las cantidades satisfechas en el ejercicio por la instalación en la vivienda habitual de sistemas de climatización y/o agua caliente sanitaria en las edificaciones que empleen fuentes de energía renovables, y con un límite de 280 euros por sujeto pasivo.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_climatizacion_agua_caliente_renovables:cumple",
      "galicia_climatizacion_agua_caliente_renovables:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [383, 384],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_rehabilitacion_centros_historicos",
    comunidad: "galicia",
    nombre: "Por rehabilitación centros históricos",
    normativa:
      "DL 1/2011 art. 5.Catorce; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion: "15% de inversión; límite de deducción 9.000 euros.",
    },
    requisitos: [
      "A estos efectos, se considerarán rehabilitación las obras que cumplan los siguientes requisitos:",
      "a) Que dispongan de los permisos y autorizaciones administrativas correspondientes.",
      "En la orden que delimite los centros históricos se establecerá la justificación documental necesaria que acredite la pertenencia del bien a dicho centro.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
      "Orden de 1 de marzo de 2018, artículo único: pertenencia al perímetro del instrumento del anexo, acreditada mediante certificado emitido por el ayuntamiento. El municipio por sí solo no acredita inclusión. Comprobar el plan especial, plan general, delimitación de suelo urbano o área de rehabilitación integral y su aprobación recogidos para el centro. No se ha aportado inmueble concreto para comprobar su localización.",
    ],
    limites: [
      "Los contribuyentes podrán deducir de la cuota íntegra autonómica el 15 % de las cantidades invertidas en el ejercicio en la rehabilitación de inmuebles situados en los centros históricos que mediante orden se determinen, con un límite de 9.000 euros.",
      "b) Que tengan por objeto principal la reconstrucción del inmueble mediante la consolidación y el tratamiento de las estructuras, fachadas o cubiertas y otras obras análogas, siempre que el coste global de las operaciones de rehabilitación exceda del 25 % ciento del precio de adquisición, si se efectuó esta durante los dos años inmediatamente anteriores al comienzo de las obras de rehabilitación, o, en otro caso, del valor de mercado que tenga el inmueble en el momento de dicho inicio. A estos efectos, se descontará del precio de adquisición o del valor de mercado del inmueble la parte proporcional correspondiente al suelo. Cuando no se conozca el valor del suelo, este se calculará prorrateando el coste de adquisición satisfecho o el valor de mercado entre los valores catastrales del suelo y de la construcción de cada año.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_rehabilitacion_centros_historicos:cumple",
      "galicia_rehabilitacion_centros_historicos:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [384, 385],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_inversion_empresas_agrarias",
    comunidad: "galicia",
    nombre: "Por inversión empresas agrarias",
    normativa:
      "DL 1/2011 art. 5.Quince; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion: "20% de inversiones; límite conjunto 20.000 euros.",
    },
    requisitos: [
      "SOFOR: agrupación de gestión conjunta con forma de sociedad mercantil de capital o sociedad civil, conforme al artículo 122 quinquies de Ley 7/2012 en redacción de Ley 11/2021. Puede incluir titulares de parcelas no forestales. Los socios sin derechos de uso de parcelas no pueden superar conjuntamente el 49% de acciones o participaciones. Comprobar la modalidad y registro de la entidad; una sociedad que invierte en montes no adquiere automáticamente la calificación. Las restantes entidades deben tener objeto exclusivo agrario o de movilización/recuperación mediante los instrumentos legales, según su modalidad.",
      "a) Adquisición de capital social a consecuencia de acuerdos de constitución de sociedades o de ampliación de capital, así como cualquier aportación a reservas en:",
      "1.º Sociedades de fomento forestal reguladas en la Ley 7/2012, de 28 de junio , de montes de Galicia, y otro tipo de sociedades de gestión conjunta.",
      "2.º Entidades agrarias, cooperativas agrarias o de explotación comunitaria de la tierra que tengan por objeto exclusivo actividades agrarias.",
      "3.º Entidades que tengan por objeto la movilización o recuperación de las tierras agrarias de Galicia al amparo de los instrumentos previstos en la Ley 11/2021, de 14 de mayo , de recuperación de la tierra agraria de Galicia.",
      "b) Préstamos realizados a favor de las mismas entidades citadas en la letra a) anterior, así como garantías que el contribuyente constituya personalmente a favor de estas entidades.",
      "c) Aportaciones que los socios capitalistas realicen a cuentas en participación constituidas para el desarrollo de actividades agrarias y en las que el partícipe gestor sea alguna de las entidades citadas en la letra a) anterior.",
      "2. Para tener derecho a estas deducciones deberán cumplirse los siguientes requisitos:",
      "a) Las operaciones a las que sea de aplicación la deducción deben formalizarse en escritura pública, en la cual debe especificarse la identidad de los contribuyentes que pretendan aplicar esta deducción y el importe de la operación respectiva.",
      "b) Las inversiones realizadas deben mantenerse en el patrimonio del contribuyente durante un período mínimo de cinco años, computado a partir del día siguiente a la fecha en que se formalice la operación en escritura pública. En caso de operaciones de financiación, el plazo de vencimiento deberá ser superior o igual a cinco años, sin que se pueda amortizar una cantidad superior al 20 % anual del importe de la principal. Durante ese mismo plazo de cinco años deben mantenerse las garantías constituidas.",
      "c) El contribuyente puede formar parte del consejo de administración de la sociedad en que materializó la inversión, pero en ningún caso puede llevar a cabo funciones ejecutivas ni de dirección durante un plazo de diez años, ni puede mantener una relación laboral con la entidad objeto de la inversión durante ese mismo plazo, excepto en el caso de sociedades laborales o sociedades cooperativas.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir en la cuota íntegra autonómica, y con un límite conjunto de 20.000 euros, el 20 % de las cantidades o, en caso de aportaciones no dinerarias, del valor de los bienes que destinen en el ejercicio a las siguientes inversiones:",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Esta deducción es incompatible con las recogidas en los números nueve, diez y once de este artículo.",
    ],
    entradaNecesaria: [
      "galicia_inversion_empresas_agrarias:cumple",
      "galicia_inversion_empresas_agrarias:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [385, 386, 387],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_ayudas_incendios_peifoga_2025",
    comunidad: "galicia",
    nombre: "Por ayudas incendios PEIFOGA 2025",
    normativa:
      "DL 1/2011 art. 5.Dieciséis; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Tipos medios de gravamen sobre la ayuda integrada en base liquidable; no sobre importes exentos.",
    },
    requisitos: [
      "RDL 16/2025 y RDL 2/2026 fueron derogados; sus textos se conservan como antecedentes. El artículo 2 del RDL 10/2026, convalidado el 20 de mayo de 2026, establece desde el 26 de agosto de 2025 la exención de ayudas por daños personales del Acuerdo del Consejo de Ministros de esa fecha para siniestros entre el 23 de junio y el 25 de agosto de 2025. Entró en vigor el 30 de abril de 2026. La ampliación autonómica al otoño no amplía el intervalo estatal. No se infiere que toda ayuda del Decreto 76/2025 quede exenta: acreditar el ámbito concreto y separar la no integración patrimonial de DA quinta de IRPF. Solo la parte integrada entra en la fórmula.",
      "Cuando el contribuyente integre en la base imponible general el importe correspondiente a una subvención o cualquier otra ayuda pública obtenida de la Administración general de la Comunidad Autónoma de Galicia de las incluidas en el Decreto 76/2025, de 29 de agosto, de medidas urgentes de ayuda para la reparación de los daños causados por los incendios forestales producidos en Galicia durante el verano y el otoño de 2025, podrá aplicarse una deducción en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas.",
      "El importe de dicha deducción será el resultado de aplicar los tipos medios de gravamen al importe de la subvención en la base liquidable.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
      "Decreto 76/2025: daños personales; vivienda habitual u ocasional y menaje; establecimientos; terrenos cinegéticos; infraestructuras de espacios protegidos; explotaciones forestales, agrícolas y ganaderas; entidades locales. No toda categoría produce renta de una persona física. Identificar resolución, beneficiario, concepto y cobertura pública/privada; la ayuda es subsidiaria/complementaria hasta el daño. Aplicar primero exención o no integración estatal: daños personales del acuerdo de 26 de agosto de 2025, y reglas de ayudas por destrucción/reparación patrimonial de la DA quinta de Ley 35/2006. Solo el importe efectivamente integrado en base general y después en base liquidable entra en la fórmula; una ayuda íntegramente no integrada no genera deducción.",
    ],
    limites: [
      "Importe = suma de tipos medios estatal y autonómico aplicables por importe de ayuda incluido en base liquidable, expresando los tipos en tanto por uno. No se aplica un 15% fijo ni se multiplica por la totalidad concedida cuando parte no se integra.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_ayudas_incendios_peifoga_2025:cumple",
      "galicia_ayudas_incendios_peifoga_2025:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [387, 388],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_obras_eficiencia_energetica",
    comunidad: "galicia",
    nombre: "Por obras eficiencia energética",
    normativa:
      "DL 1/2011 art. 5.Dieciocho; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15% de inversión sobre base máxima 9.000 euros; certificado y tasas hasta 150 euros según titularidad.",
    },
    requisitos: [
      "1. Los contribuyentes podrán deducir de la cuota íntegra autonómica en el ejercicio en que se finalice la obra de mejora de eficiencia energética de los inmuebles de uso residencial vivienda:",
      "A estos efectos, se considerarán obras de mejora de eficiencia energética las que cumplan los siguientes requisitos:",
      "a) Que dispongan de los permisos, autorizaciones o títulos habilitantes correspondientes.",
      "b) Que mejoren el comportamiento energético de las edificaciones reduciendo la demanda energética, mejorando el rendimiento de las instalaciones térmicas y/o incorporando equipos que utilicen fuentes de energía renovable y que tengan por objeto principal subir una letra en la escala de calificación energética de emisiones de CO2 y en la escala de consumo de energía primaria no renovable.",
      "2. En relación con la letra a) del número 1, la base de esta deducción estará constituida por las cantidades efectivamente satisfechas en las obras de mejora de eficiencia energética en edificios de viviendas o en viviendas unifamiliares, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito. En ningún caso darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero de curso legal.",
      "3. Para tener derecho a esta deducción deberá presentarse, antes de que expire el plazo para presentar la autoliquidación correspondiente al período impositivo en que se finalice la obra de mejora energética objeto de deducción, a través de la plataforma electrónica del Registro de Eficiencia Energética de Edificios de la Comunidad Autónoma de Galicia:",
      "a) Certificado de eficiencia energética del edificio, una vez ejecutadas las obras que dan lugar a esta deducción, que debe estar inscrito en el Registro de Certificados de Eficiencia Energética de Edificios de la Comunidad Autónoma de Galicia mediante el procedimiento establecido a tal fin.",
      "b) Informe firmado por un técnico competente que justifique el salto de letra conseguido con las mejoras, según el modelo que conste en el Registro de Certificados de Eficiencia Energética de Edificios de la Comunidad Autónoma de Galicia.",
      "c) La totalidad de las facturas correspondientes a las obras de mejora de eficiencia energética objeto de deducción, así como las relativas a la obtención del certificado de eficiencia energética.",
      "d) Los justificantes de pago de estas facturas.",
      "En caso de que la inversión se realice en una vivienda unifamiliar, esta documentación será aportada por el sujeto pasivo. En el caso de edificios en régimen de propiedad horizontal, será aportada por el representante legal de la comunidad de propietarios, que, además, deberá adjuntar un certificado de las aportaciones económicas correspondientes a cada comunero.",
      "4. Para poder practicarse esta deducción deberá constar en la declaración tributaria del sujeto pasivo el número de inscripción del certificado de eficiencia energética tras la reforma en el Registro de Certificados de Eficiencia Energética de Edificios de la Comunidad Autónoma de Galicia, proporcionado por el propio Registro en la etiqueta de eficiencia energética del inmueble.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "a) El 15 % de las cantidades totales invertidas. La base de la deducción tendrá como límite 9.000 € por sujeto pasivo.",
    ],
    prorrateo: [
      "b) El coste de los honorarios para la obtención del certificado que justifique el salto de letra en la calificación energética del inmueble, así como las tasas relacionadas con su inscripción en el Registro de Certificados de Eficiencia Energética de Edificios de la Comunidad Autónoma de Galicia, con un límite único de 150 € que será prorrateado en función del porcentaje de titularidad de la vivienda.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "5. La deducción prevista en este número es incompatible con la prevista por inversión en instalaciones de climatización y/o agua caliente sanitaria que empleen energías renovables en la vivienda habitual y destinada exclusivamente al autoconsumo.",
    ],
    entradaNecesaria: [
      "galicia_obras_eficiencia_energetica:cumple",
      "galicia_obras_eficiencia_energetica:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [388, 389, 390],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_ayudas_deportistas_alto_nivel",
    comunidad: "galicia",
    nombre: "Por ayudas deportistas alto nivel",
    normativa:
      "DL 1/2011 art. 5.Diecinueve; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Tipos medios de gravamen sobre la ayuda integrada en base liquidable.",
    },
    requisitos: [
      "1. Cuando el contribuyente integre en la base imponible general el importe correspondiente a una subvención o cualquier otra ayuda pública obtenida de la Administración general de la Comunidad Autónoma de Galicia o de las restantes entidades del sector público autonómico para el desarrollo de la actividad deportiva, podrá aplicar una deducción en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas, siempre y cuando la actividad deportiva no genere rendimientos de actividades económicas.",
      "El importe de la deducción será el resultado de aplicar los tipos medios de gravamen al importe de la subvención o ayuda pública en la base liquidable.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "2. Para la aplicación de esta deducción es requisito imprescindible que el contribuyente tenga reconocida la condición de deportista de alto nivel según resolución del órgano superior de la Administración general de la Comunidad Autónoma con competencias en materia de deporte.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_ayudas_deportistas_alto_nivel:cumple",
      "galicia_ayudas_deportistas_alto_nivel:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [390, 391],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_aldeas_modelo",
    comunidad: "galicia",
    nombre: "Por aldeas modelo",
    normativa:
      "DL 1/2011 art. 5.Veinte; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15%; base máxima 9.000 euros para vivienda habitual y 4.500 en otro caso.",
    },
    requisitos: [
      "Comprobar declaración de aldea modelo y de utilidad pública e interés social publicadas en DOG, su perímetro y proyecto de ordenación productiva. Ley 11/2021 exige solicitud municipal y acuerdo de derechos de aprovechamiento sobre al menos el 70% del perímetro para la declaración; esa condición del expediente no es una participación societaria exigida al contribuyente. La pertenencia de una vivienda se contrasta con el perímetro del proyecto declarado, no con el nombre del municipio.",
      "1. Los contribuyentes podrán deducir en la cuota íntegra autonómica el 15 % de las cantidades satisfechas en el ejercicio para la adquisición o rehabilitación de viviendas, siempre que:",
      "a) Las viviendas se sitúen en terrenos que se integren en proyectos de aldeas modelo, de conformidad con lo previsto en la Ley 11/2021, de 14 de mayo , de recuperación de la tierra agraria de Galicia.",
      "b) Las viviendas estén destinadas a residencia de los contribuyentes que las adquieran o rehabiliten, ya sea con carácter habitual o esporádico.",
      "La base de esta deducción no podrá exceder de 9.000 euros anuales para el caso de construcciones destinadas a constituir la vivienda habitual de los contribuyentes. En otro caso, la base de la deducción no podrá exceder de 4.500 euros anuales.",
      "La base de la deducción estará constituida por las cantidades satisfechas para la adquisición o rehabilitación de la vivienda, incluidos los gastos originados que hayan corrido a cargo del adquirente, y, en el caso de financiación ajena, la amortización, los intereses, el coste de los instrumentos de cobertura del riesgo de tipo de interés variable de los préstamos hipotecarios regulados en el artículo décimo noveno de la Ley 36/2003, de 11 de noviembre , de medidas de reforma económica, y demás gastos de ella derivados. En caso de aplicación de los citados instrumentos de cobertura, los intereses satisfechos por el contribuyente se aminorarán en las cantidades obtenidas por la aplicación del citado instrumento.",
      "2. A los efectos de la presente deducción, tendrán la consideración de obras de rehabilitación aquellas que cumplan los siguientes requisitos:",
      "a) Que dispongan de los permisos y autorizaciones administrativas correspondientes.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "b) Que tengan por objeto principal la reconstrucción de la vivienda mediante la consolidación y el tratamiento de las estructuras, fachadas o cubiertas y otras obras análogas, siempre que el coste global de las operaciones de rehabilitación exceda del 25 % del precio de adquisición, si se efectuó esta durante los dos años inmediatamente anteriores al inicio de las obras de rehabilitación, o, en otro caso, del valor de mercado que tenga el inmueble en el momento de dicho inicio. A estos efectos, se descontará del precio de adquisición o del valor de mercado del inmueble la parte proporcional correspondiente al suelo. Cuando no se conozca el valor del suelo, este se calculará prorrateando el coste de adquisición satisfecho o el valor de mercado entre los valores catastrales del suelo y de la construcción de cada año.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Esta deducción resultará incompatible, para las mismas inversiones, con las previstas en los números trece y dieciocho.",
    ],
    entradaNecesaria: [
      "galicia_aldeas_modelo:cumple",
      "galicia_aldeas_modelo:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [391, 392, 393],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_inversion_proyectos_especial_interes",
    comunidad: "galicia",
    nombre: "Por inversión proyectos especial interés",
    normativa:
      "DL 1/2011 art. 5.Veintiuno; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% sobre base máxima de 10.000 euros por entidad entre todos los periodos de inversión (máximo 2.000 euros por entidad).",
    },
    requisitos: [
      "Declaración expresa del órgano competente según Ley 2/2024, artículos 17 y 20: verificar resolución, entidad y proyecto exactos; la denominación del proyecto o una declaración de otro régimen no sustituyen ese acto. El artículo 5.Veintiuno no impone por sí solo escritura pública o permanencia de tres/cinco años de otras inversiones.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "Los contribuyentes podrán deducir en la cuota íntegra autonómica el 20 % de las cantidades invertidas durante el ejercicio en la adquisición de acciones o participaciones sociales, a consecuencia de acuerdos de constitución de sociedades o de ampliación de capital, de aquellas entidades que tengan por objeto social exclusivo la realización de proyectos que sean declarados de especial interés público, social o económico, a los que se refieren los artículos 17 y 20 de la Ley 2/2024, de 7 de noviembre , de promoción de los beneficios sociales y económicos de los proyectos que utilizan los recursos naturales de Galicia. El porcentaje de deducción prevista en este epígrafe se aplicará sobre una base máxima de 10.000 euros para cada entidad, con independencia de que la inversión se realice en uno o en varios periodos impositivos.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "Esta deducción es incompatible con cualquier otra prevista en este artículo y que resulte de aplicación por la misma inversión en capital.",
    ],
    entradaNecesaria: [
      "galicia_inversion_proyectos_especial_interes:cumple",
      "galicia_inversion_proyectos_especial_interes:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [393, 394],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_adecuacion_inmueble_vacio_arrendamiento",
    comunidad: "galicia",
    nombre: "Por adecuación inmueble vacío arrendamiento",
    normativa:
      "DL 1/2011 art. 5.Veintidós; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "vivienda_habitual",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15% sobre base máxima 9.000 euros por vivienda; base anual 3.000 euros (cuota hasta 450), con exceso de base en dos ejercicios siguientes. Concurrencia de dos o tres viviendas: base anual total 6.000 y exceso en cuatro ejercicios. Remanente por insuficiencia de cuota en cuatro ejercicios.",
    },
    requisitos: [
      "1. Los contribuyentes podrán deducir de la cuota autonómica el 15 % de las cantidades satisfechas por las obras de reparación y conservación, así como cualquier otro gasto necesario para que un inmueble radicado en Galicia se encuentre en condiciones de ser arrendado como vivienda, incluidas la obtención del certificado de eficiencia energética y la formalización del contrato de arrendamiento, en el periodo impositivo en que se constituya el arrendamiento. La aplicación de la deducción no podrá dar como resultado una cuota autonómica negativa.",
      "4. La deducción solo resultará aplicable para los inmuebles en que se constituya el arrendamiento de vivienda previsto en el artículo 2 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos, y quedará sujeta al cumplimiento de los siguientes requisitos:",
      "a) El bien inmueble deberá llevar vacío durante, por lo menos, un año anterior al inicio de las obras. A estos efectos, se entenderá que un inmueble se encuentra vacío cuando no esté habitado, arrendado, en uso, ni afecto a actividades económicas.",
      "b) Las obras deberán concluir en el plazo máximo de dos años. La fecha de finalización se acreditará mediante la fecha de la factura expedida por las obras.",
      "c) El bien inmueble deberá estar arrendado en un plazo máximo de seis meses desde la fecha de finalización de las obras.",
      "d) El valor del bien inmueble no podrá superar los 250.000 euros. A estos efectos, se tomará como valor del bien inmueble el valor de referencia previsto en la normativa reguladora del catastro inmobiliario, en la fecha de devengo del impuesto en el periodo impositivo en que finalicen las obras. En caso de que no exista el valor de referencia o cuando este no pueda ser certificado por la Dirección General del Catastro, se tomará como valor el valor de mercado.",
      "e) La persona arrendataria de la vivienda no podrá ser el cónyuge ni un pariente, por consanguinidad o por afinidad, hasta el tercer grado inclusive, del contribuyente.",
      "f) El contribuyente deberá declarar el número de identificación fiscal de la persona o personas prestadoras de los servicios y el importe total satisfecho a cada una de ellas.",
      "g) Que el contribuyente sea propietario de un máximo de tres viviendas, con independencia de donde estén estas radicadas, que puedan ser destinadas al arrendamiento, excluidos garajes y trasteros y sin tener en cuenta su vivienda habitual.",
      "6. No se perderá el derecho a la deducción en caso de que la duración del arrendamiento sea inferior a tres años, siempre que la vivienda pase a estar en situación de expectativa de alquiler y vuelva a ser objeto de un nuevo contrato de arrendamiento de vivienda dentro del plazo máximo de seis meses desde la finalización del anterior contrato, y que la suma de los períodos de duración de ambos contratos de arrendamiento sea igual o superior a tres años.",
      "7. La aplicación de la deducción no podrá dar como resultado una cuota autonómica negativa. Si, a consecuencia de ello, el contribuyente no pudiera aplicar la deducción en su totalidad, podrá deducirse la cantidad no deducida en los cuatro ejercicios siguientes hasta su agotamiento, siempre que la vivienda continúe arrendada durante ese período con los mismos requisitos del apartado 4, a excepción del recogido en el párrafo a).",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "2. La base máxima de esta deducción ascenderá a 9.000 euros por vivienda y estará constituida por las cantidades justificadas con factura, que deberá cumplir todas las condiciones establecidas en el Reglamento por el que se regulan las obligaciones de facturación aprobado por el Real decreto 1619/2012, de 30 de noviembre . La factura recibida por el contribuyente deberá conservarse durante el plazo de prescripción.",
      "3. La base máxima anual de esta deducción será de 3.000 euros por vivienda, tanto en tributación individual como en tributación conjunta. Las cantidades satisfechas no deducidas por exceder la base este máximo podrán deducirse con el mismo límite en los dos ejercicios siguientes.",
      "5. En caso de que convivan en el tiempo la deducción regulada en este artículo para dos o para las tres viviendas, a los efectos del límite señalado en el apartado 3, se elevará hasta 6.000 euros la base máxima total anual, y las cantidades satisfechas no deducidas por exceder este importe se podrán deducir con el mismo límite en los cuatro ejercicios siguientes.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_adecuacion_inmueble_vacio_arrendamiento:cumple",
      "galicia_adecuacion_inmueble_vacio_arrendamiento:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [394, 395, 396, 397],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_arrendamiento_viviendas_vacias",
    comunidad: "galicia",
    nombre: "Por arrendamiento viviendas vacías",
    normativa:
      "DL 1/2011 art. 5.Veintitrés; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "vivienda_habitual",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "500 euros por vivienda en el primer ejercicio de arrendamiento, según titularidad.",
    },
    requisitos: [
      "1. Los contribuyentes propietarios o usufructuarios de viviendas vacías podrán deducir 500 euros por vivienda de la cuota íntegra autonómica del primer período impositivo en que pongan en arrendamiento la vivienda. La cuantía señalada se aplicará por cada uno de los bienes inmuebles radicados en Galicia que se destinen al arrendamiento de vivienda previsto en el artículo 2 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos.",
      "3. La deducción solo resultará de aplicación para los inmuebles en los que se constituya el arrendamiento de vivienda previsto en el artículo 2 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos, y quedará sujeta al cumplimiento de los siguientes requisitos:",
      "a) El bien inmueble deberá llevar vacío durante, por lo menos, un año anterior a la formalización del contrato de arrendamiento de vivienda. A estos efectos, se entenderá que un inmueble se encuentra vacío cuando no esté habitado, arrendado, en uso, ni afecto a actividades económicas.",
      "c) El arrendatario de la vivienda no podrá ser el cónyuge ni un pariente, por consanguinidad o por afinidad, hasta el tercer grado inclusive, del contribuyente.",
      "d) Que el contribuyente sea propietario o usufructuario de un máximo de tres viviendas, con independencia de donde estén estas radicadas, que puedan ser destinadas al arrendamiento, excluidos garajes y trasteros y sin tener en cuenta su vivienda habitual.",
      "4. No se perderá el derecho a la deducción en caso de que el contrato de arrendamiento tenga una duración inferior a tres años, siempre que dicho inmueble pase a estar en situación de expectativa de alquiler y vuelva a ser objeto de un nuevo contrato de arrendamiento de vivienda dentro del plazo de seis meses desde la finalización del anterior contrato, y que la suma de los períodos de duración de ambos contratos de arrendamiento sea igual o superior a tres años.",
      "5. La aplicación de la deducción no podrá dar como resultado una cuota autonómica negativa. Si, como consecuencia de ello, el contribuyente no pudiera aplicar la deducción en su totalidad, podrá deducirse la cantidad no deducida en los cuatro ejercicios siguientes hasta su agotamiento, siempre que la vivienda continúe arrendada durante ese período con los mismos requisitos del apartado 3, a excepción de lo recogido en el párrafo a).",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [
      "b) Que el precio mensual del alquiler de la vivienda, incluidos sus anexos, no supere los 700 euros.",
    ],
    prorrateo: [
      "2. El importe de la deducción se prorrateará en función del porcentaje de participación en la propiedad del inmueble.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_arrendamiento_viviendas_vacias:cumple",
      "galicia_arrendamiento_viviendas_vacias:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [397, 398, 399],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_ayudas_ela_fenotipos",
    comunidad: "galicia",
    nombre: "Por ayudas ELA fenotipos",
    normativa:
      "DL 1/2011 art. 5.Veinticuatro; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Tipos medios de gravamen sobre la subvención o ayuda pública integrada en base liquidable por ELA y fenotipos.",
    },
    requisitos: [
      "Cuando el contribuyente integre en la base imponible general el importe correspondiente a una subvención o cualquier otra ayuda pública destinadas a personas con diagnóstico de esclerosis lateral amiotrófica o con sus fenotipos, podrá aplicar una deducción en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas, que consistirá en el importe resultante de aplicar los tipos medios de gravamen al importe de la subvención o ayuda pública en la base liquidable.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_ayudas_ela_fenotipos:cumple",
      "galicia_ayudas_ela_fenotipos:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [399, 400],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_libros_texto_material_escolar",
    comunidad: "galicia",
    nombre: "Por libros texto material escolar",
    normativa:
      "DL 1/2011 art. 5.Veinticinco; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15%; máximo 105 euros por descendiente. Límites de gasto de material escolar: 300 euros, de los cuales deportivo hasta 150 euros.",
    },
    requisitos: [
      "2. Para la aplicación de esta deducción solo se tendrán en cuenta aquellos descendientes que den derecho a la aplicación del mínimo por descendientes establecido por la normativa reguladora del impuesto, salvo que el pago de las facturas justificativas lo realice la persona progenitora que no tenga derecho a aplicar ese mínimo.",
      "4. Para la aplicación de esta deducción se exigirá que la renta per cápita de la unidad familiar sea igual o inferior a 30.000 euros. Se entenderá por renta per cápita de la unidad familiar el resultado de dividir la renta de la unidad familiar del ejercicio fiscal inmediatamente anterior entre el número de miembros computables, teniendo en cuenta que computarán por dos los miembros que acrediten una discapacidad igual o superior al 33 % o la percepción de una pensión de la Seguridad Social por incapacidad permanente en los grados de total, absoluta o gran invalidez, o la equivalente de clases pasivas.",
      "En particular, las personas beneficiarias de la participación en el fondo solidario de libros de texto y de la percepción de ayudas para la adquisición de libros de texto y material escolar de la consejería competente en materia de educación no podrán aplicar esta deducción con respecto a los gastos correspondientes al mismo curso escolar.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
      "Ejercicio 2025: facturas detalladas de 1 de julio a 31 de diciembre, ambos incluidos; pago en efectivo admitido excepcionalmente por Ley 2/2026, artículo único y disposición final única.",
      "Orden de 26 de marzo de 2026: incluye mochilas, diccionarios, lectura prescrita y calculadoras básicas; excluye electrónica general, uniformes ordinarios, servicios complementarios y material recreativo ajeno al currículo.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir de la cuota íntegra autonómica el 15 % de las cantidades satisfechas en el periodo impositivo para la adquisición de libros de texto editados para educación primaria y educación secundaria obligatoria y educación especial, así como del material escolar para dichos niveles educativos, para sus descendientes matriculados en centros docentes sostenidos con fondos públicos. La deducción tendrá como límite 105 euros por descendiente matriculado.",
      "Se entenderá por material escolar el conjunto de medios y recursos fungibles que facilitan la enseñanza y el aprendizaje escolar, tales como cuadernos, lápices o bolígrafos, así como la ropa y el calzado deportivo para la materia de educación física, destinados a ser utilizados por el alumnado para el desarrollo y la aplicación de los contenidos determinados por el currículo de las enseñanzas de régimen general establecidas por la normativa académica vigente. Mediante orden de la persona titular de la consejería competente en materia de hacienda se concretarán las categorías o los elementos de material escolar y los límites aplicables que podrán incluirse en la deducción.",
      "Material escolar hasta 300 euros por descendiente, incluido material deportivo hasta 150 euros; son límites del gasto, distintos de los 105 euros máximos de deducción.",
    ],
    prorrateo: [
      "3. En caso de que más de un contribuyente tenga derecho a la aplicación de la deducción, se aplicarán las reglas de prorrateo, convivencia y demás límites previstos en la normativa estatal del impuesto sobre la renta de las personas físicas.",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "5. Esta deducción será incompatible con cualquier beca o ayuda pública percibida en el periodo impositivo del que se trate que cubra la adquisición de libros de texto y material escolar señalados en el número 1 y que se refieran al mismo curso escolar.",
    ],
    entradaNecesaria: [
      "galicia_libros_texto_material_escolar:cumple",
      "galicia_libros_texto_material_escolar:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [400, 401, 402, 403],
    },
    estado: "implementada",
  },
  {
    codigo: "galicia_ayudas_talidomida",
    comunidad: "galicia",
    nombre: "Por ayudas talidomida",
    normativa:
      "DL 1/2011 art. 5.Veintiséis; ejercicio 2025. Consignación con acreditación externa de requisitos.",
    categoria: "otros_conceptos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Tipos medios de gravamen sobre ayudas públicas por talidomida integrada en base liquidable.",
    },
    requisitos: [
      "Cuando el contribuyente integre en la base imponible general el importe correspondiente a la ayuda pública destinada a las personas afectadas por la talidomida en España durante el periodo 1950-1985, podrá aplicar una deducción en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas, que consistirá en el importe resultante de aplicar los tipos medios de gravamen al importe de la ayuda pública en la base liquidable.",
      "La práctica de las deducciones en la cuota íntegra autonómica del impuesto sobre la renta de las personas físicas quedará en todo caso condicionada a la justificación documental adecuada y suficiente del supuesto de hecho y a los requisitos que determinen su aplicabilidad.",
    ],
    limites: [],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "galicia_ayudas_talidomida:cumple",
      "galicia_ayudas_talidomida:importe",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [403],
    },
    estado: "implementada",
  },
] satisfies ReadonlyArray<FichaDeduccionAutonomica>;

export const GALICIA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...GALICIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  GALICIA_NACIMIENTO_ADOPCION_HIJOS_2025,
  GALICIA_FAMILIA_NUMEROSA_2025,
  GALICIA_ALQUILER_VIVIENDA_HABITUAL_2025,
] satisfies ReadonlyArray<FichaDeduccionAutonomica>;
