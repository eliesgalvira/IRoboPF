import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  fichaImplementadaFormula,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const ARAGON_NACIMIENTO_ADOPCION_TERCER_HIJO_SUCESIVOS_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "aragon_nacimiento_adopcion_tercer_hijo_sucesivos",
    "Por nacimiento o adopción del tercer hijo o sucesivos",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 110-2, 160-1 y 160-2.1 Texto Refundido de las disposiciones dictadas por Aragón en materia de tributos cedidos",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "Régimen general: 500 euros por tercer hijo o sucesivo, o 600 euros si cumple límite reducido de bases. Fiscalidad diferenciada: 600 euros, o 720 euros si cumple límite reducido de bases",
  },
  requisitos: [
    "Nacimiento o adopción durante el período impositivo",
    "Debe tratarse del tercer hijo o sucesivos del contribuyente",
    "La deducción solo se aplica en el período en que se produzca el nacimiento o adopción",
    "Corresponde al contribuyente con quien conviva el hijo a fecha de devengo",
  ],
  limites: [
    "Régimen general: 500 euros por hijo",
    "Régimen general con base reducida: 600 euros por hijo",
    "Fiscalidad diferenciada: 600 euros por hijo",
    "Fiscalidad diferenciada con base reducida: 720 euros por hijo",
    "Para aplicar cuantía incrementada: base imponible general + base imponible del ahorro - mínimo del contribuyente - mínimo por descendientes no superior a 21.000 euros en declaración individual",
    "Para aplicar cuantía incrementada: base imponible general + base imponible del ahorro - mínimo del contribuyente - mínimo por descendientes no superior a 35.000 euros en declaración conjunta",
  ],
  prorrateo: [
    "Si los hijos conviven con más de un contribuyente, se prorratea por partes iguales",
  ],
  incompatibilidades: [
    "Las cuantías alternativas dentro de cada régimen son incompatibles entre sí",
    "El régimen de fiscalidad diferenciada es incompatible con el régimen general",
  ],
  entradaNecesaria: [
    "numeroHijosTerceroOSucesivosNacidosOAdoptados",
    "convivenciaHijoConContribuyente",
    "aplicaFiscalidadDiferenciada",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "minimoContribuyente",
    "minimoDescendientes",
    "numeroContribuyentesConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [61, 62],
  },
} as const satisfies FichaDeduccionAutonomica

export const ARAGON_CUIDADO_PERSONAS_DEPENDIENTES_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "aragon_cuidado_personas_dependientes",
    "Por el cuidado de personas dependientes",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 110-5, 160-1 y 160-2.4 Texto Refundido de las disposiciones dictadas por Aragón en materia de tributos cedidos",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "150 euros por persona dependiente en régimen general; 300 euros si resulta aplicable el régimen de fiscalidad diferenciada",
  },
  requisitos: [
    "La persona dependiente debe convivir con el contribuyente al menos durante la mitad del período impositivo",
    "Persona dependiente: ascendiente mayor de 75 años o ascendiente/descendiente con discapacidad igual o superior al 65%",
    "La persona dependiente no debe obtener rentas anuales superiores a 8.000 euros, excluidas las exentas",
    "Debe cumplirse el límite de bases minoradas",
  ],
  limites: [
    "Régimen general: 150 euros por persona dependiente",
    "Fiscalidad diferenciada: 300 euros por persona dependiente",
    "Base imponible general + base imponible del ahorro - mínimo del contribuyente - mínimo por descendientes: máximo 21.000 euros en declaración individual",
    "Base imponible general + base imponible del ahorro - mínimo del contribuyente - mínimo por descendientes: máximo 35.000 euros en declaración conjunta",
  ],
  prorrateo: [
    "Si dos o más contribuyentes tienen derecho, se prorratea por partes iguales",
    "Si hay contribuyentes con distinto grado de parentesco, corresponde al grado más cercano, salvo que no cumpla rentas",
  ],
  incompatibilidades: [
    "El régimen de fiscalidad diferenciada es incompatible con el régimen general",
  ],
  entradaNecesaria: [
    "numeroPersonasDependientes",
    "tipoPersonaDependiente",
    "mesesConvivencia",
    "rentasPersonaDependiente",
    "aplicaFiscalidadDiferenciada",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "minimoContribuyente",
    "minimoDescendientes",
    "numeroContribuyentesConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [66],
  },
} as const satisfies FichaDeduccionAutonomica

export const ARAGON_MAYORES_70_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "aragon_mayores_70",
    "Para mayores de 70 años",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 110-14 Texto Refundido de las disposiciones dictadas por Aragón en materia de tributos cedidos",
  cuantia: {
    tipo: "importe_fijo",
    euros: "75",
    por: "contribuyente de 70 o más años",
  },
  requisitos: [
    "Contribuyente con 70 o más años de edad",
    "Debe obtener rendimientos integrables en la base imponible general",
    "Los rendimientos no pueden proceder exclusivamente del capital",
    "Debe obtener algún rendimiento del trabajo o de actividades económicas",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "75 euros por contribuyente",
    "Base imponible general + base imponible del ahorro: máximo 23.000 euros en declaración individual",
    "Base imponible general + base imponible del ahorro: máximo 35.000 euros en declaración conjunta",
  ],
  prorrateo: [],
  incompatibilidades: [],
  entradaNecesaria: [
    "edadContribuyente",
    "rendimientosTrabajo",
    "rendimientosActividadesEconomicas",
    "rendimientosCapital",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [78, 79],
  },
} as const satisfies FichaDeduccionAutonomica

export const ARAGON_GUARDERIA_MENORES_3_2025 = fichaImplementada(
  { estado: "implementada" },
  "aragon_guarderia_menores_3",
  "Por gastos de guardería de hijos menores de 3 años",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "15% de gastos de custodia; límite 250/125 euros general o 300/150 euros con fiscalidad diferenciada",
  },
  [
    "15% de las cantidades satisfechas",
    "Régimen general: 250 euros por hijo, 125 euros si cumple 3 años",
    "Fiscalidad diferenciada: 300 euros por hijo, 150 euros si cumple 3 años",
    "Base liquidable general + ahorro inferior a 35.000 euros individual y 50.000 conjunta",
    "Base imponible del ahorro máximo 4.000 euros",
  ],
  [80, 81, 82]
)

export const ARAGON_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "aragon_nacimiento_adopcion_hijo_discapacidad_33",
    "Por nacimiento o adopción de un hijo con un grado de discapacidad igual o superior al 33 por 100",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "200 euros por hijo en régimen general; 240 euros por hijo si resulta aplicable el régimen de fiscalidad diferenciada.",
    },
    [
      "Fórmula general: 200 euros por hijo nacido o adoptado con discapacidad igual o superior al 33%.",
      "Fórmula con fiscalidad diferenciada: 240 euros por hijo.",
      "Si el hijo convive con más de un contribuyente, se prorratea por partes iguales.",
      "Compatible con tercer hijo o sucesivos y adopción internacional.",
      "Incompatible, para el mismo hijo, con primer y/o segundo hijo en poblaciones de menos de 10.000 habitantes.",
    ],
    [63, 64],
    [
      "aragon_nacimiento_adopcion_hijo_discapacidad_33:importe",
      "aragon_nacimiento_adopcion_hijo_discapacidad_33:cumple",
    ],
    [
      "Grado de discapacidad igual o superior al 33% reconocido a la fecha de devengo.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_adopcion_internacional",
    "Por adopción internacional de niños",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "600 euros por hijo adoptado internacionalmente; 720 euros si resulta aplicable el régimen de fiscalidad diferenciada.",
    },
    [
      "Fórmula general: 600 euros por hijo adoptado internacionalmente.",
      "Fórmula con fiscalidad diferenciada: 720 euros por hijo.",
      "Si el niño adoptado convive con ambos padres adoptivos, se prorratea por partes iguales.",
      "Compatible con tercer hijo o sucesivos, hijo con discapacidad y primer/segundo hijo en poblaciones de menos de 10.000 habitantes.",
    ],
    [64, 65],
    [
      "aragon_adopcion_internacional:importe",
      "aragon_adopcion_internacional:cumple",
    ],
    [
      "Adopción internacional formalizada conforme a la legislación vigente y tratados aplicables.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_donaciones_ecologicas_idi",
    "Por donaciones con finalidad ecológica y en investigación y desarrollo científico y técnico",
    "donativos_donaciones",
    {
      tipo: "mixta",
      descripcion:
        "20% de donaciones dinerarias puras y simples, con límite del 10% de la cuota íntegra autonómica.",
    },
    [
      "Fórmula: min(20% de donaciones dinerarias, 10% de la cuota íntegra autonómica).",
      "Donaciones a la Comunidad Autónoma de Aragón y organismos públicos dependientes con finalidad ambiental o de I+D científico y técnico.",
      "Donaciones a entidades sin fines lucrativos cuyo fin exclusivo o principal sea defensa del medio ambiente o I+D científico y técnico inscritas en registros aragoneses.",
    ],
    [67, 68],
    [
      "aragon_donaciones_ecologicas_idi:importe",
      "aragon_donaciones_ecologicas_idi:cumple",
    ],
    ["Donación dineraria pura y simple efectuada en el período impositivo."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_vivienda_victimas_terrorismo",
    "Por adquisición de vivienda habitual por víctimas del terrorismo",
    "vivienda_habitual",
    {
      tipo: "porcentaje",
      porcentaje: "3",
      base: "cantidades satisfechas por adquisición de vivienda nueva protegida en Aragón",
      limiteMaximoEuros: "271.20",
    },
    [
      "Fórmula operativa: min(3% de cantidades satisfechas, 271,20 euros), tomando como referencia la base máxima estatal de 9.040 euros vigente a 31-12-2012.",
      "La vivienda nueva debe estar acogida a protección pública y constituir o ir a constituir la primera residencia habitual.",
      "Contribuyente víctima del terrorismo; en su defecto, por este orden, cónyuge o pareja de hecho, o hijos convivientes.",
      "Aplican los conceptos de adquisición, vivienda habitual, base máxima y comprobación patrimonial de la normativa estatal vigente a 31-12-2012.",
    ],
    [68],
    [
      "aragon_vivienda_victimas_terrorismo:base",
      "aragon_vivienda_victimas_terrorismo:cumple",
    ],
    ["Adquisición de vivienda nueva situada en Aragón."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_inversion_acciones_mab",
    "Por inversión en acciones de entidades que cotizan en el segmento de empresas en expansión del Mercado Alternativo Bursátil",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "20",
      base: "cantidades invertidas en la suscripción de acciones por ampliación de capital en el segmento de empresas en expansión del MAB",
      limiteMaximoEuros: "10000",
    },
    [
      "Fórmula: min(20% de inversión, 10.000 euros).",
      "La participación del contribuyente no puede superar el 10% del capital social.",
      "Las acciones deben mantenerse al menos dos años.",
      "La sociedad debe tener domicilio social y fiscal en Aragón y no dedicarse principalmente a la gestión de patrimonio mobiliario o inmobiliario.",
      "Incompatible, para las mismas inversiones, con entidades nuevas o de reciente creación y con entidades de economía social.",
    ],
    [68, 69],
    [
      "aragon_inversion_acciones_mab:base",
      "aragon_inversion_acciones_mab:cumple",
    ],
    ["Suscripción de acciones por acuerdos de ampliación de capital."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_inversion_entidades_nuevas_reciente_creacion",
    "Por inversión en la adquisición de acciones o participaciones sociales en entidades nuevas o de reciente creación",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "20",
      base: "inversión autonómica computable en acciones o participaciones de entidades nuevas o de reciente creación",
      limiteMaximoEuros: "4000",
    },
    [
      "Fórmula: min(20% de la inversión autonómica computable, 4.000 euros).",
      "Solo se aplica sobre la cuantía invertida que supere la base máxima de la deducción general estatal del art. 68.1 LIRPF.",
      "Si hay reinversión con exención del art. 38.2 LIRPF, solo computa la parte que exceda del importe obtenido en la transmisión anterior.",
      "La entidad debe tener domicilio social y fiscal en Aragón.",
      "El contribuyente puede formar parte del consejo, pero no ejercer funciones ejecutivas ni de dirección ni mantener relación laboral con la entidad.",
      "Incompatible, para las mismas inversiones, con MAB y economía social.",
    ],
    [69, 70, 71],
    [
      "aragon_inversion_entidades_nuevas_reciente_creacion:base",
      "aragon_inversion_entidades_nuevas_reciente_creacion:cumple",
    ],
    [
      "Cumplir los requisitos estatales de la deducción general por inversión en entidades nuevas o de reciente creación.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_vivienda_nucleos_rurales",
    "Por adquisición o rehabilitación de vivienda habitual en núcleos rurales o análogos",
    "vivienda_habitual",
    {
      tipo: "mixta",
      descripcion:
        "5% de cantidades satisfechas en régimen general; 7,5% con fiscalidad diferenciada; conceptos y base máxima según normativa estatal de vivienda habitual vigente a 31-12-2012.",
    },
    [
      "Fórmula general: 5% de cantidades satisfechas por adquisición o rehabilitación de primera vivienda habitual en núcleo rural o análogo.",
      "Fórmula con fiscalidad diferenciada: 7,5% de cantidades satisfechas.",
      "Base imponible general + ahorro - mínimo del contribuyente - mínimo por descendientes: máximo 21.000 euros individual y 35.000 conjunta.",
      "Contribuyente con residencia habitual en Aragón y menos de 36 años a devengo.",
      "La vivienda debe ser primera vivienda y estar situada en municipio aragonés de menos de 3.000 habitantes, entidad local menor, entidad singular diferenciada o asentamiento rural cualificado.",
      "Solo adquisiciones o rehabilitaciones en núcleos rurales efectuadas desde 1 de enero de 2012.",
    ],
    [71, 72, 73],
    [
      "aragon_vivienda_nucleos_rurales:importe",
      "aragon_vivienda_nucleos_rurales:cumple",
    ],
    [
      "Adquisición o rehabilitación de vivienda que constituya o vaya a constituir vivienda habitual.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_libros_texto_material_escolar",
    "Por adquisición de libros de texto y material escolar",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "100% de libros de texto y material escolar de Primaria/ESO, minorado por becas y ayudas, con límites por descendiente según base, tributación, familia numerosa y fiscalidad diferenciada.",
    },
    [
      "Fórmula: min(100% de gastos - becas/ayudas, límite por descendiente aplicable).",
      "Régimen general, conjunta no numerosa: 100 euros hasta 12.000; 50 euros hasta 20.000; 37,50 euros hasta 25.000.",
      "Régimen general, individual no numerosa: 50 euros hasta 6.500; 37,50 euros hasta 10.000; 25 euros hasta 12.500.",
      "Régimen general, familia numerosa: 150 euros por descendiente en conjunta y 75 euros en individual, con límites de base 40.000/30.000.",
      "Fiscalidad diferenciada, conjunta no numerosa: 120 euros hasta 12.000; 60 euros hasta 20.000; 45 euros hasta 25.000.",
      "Fiscalidad diferenciada, individual no numerosa: 60 euros hasta 6.500; 45 euros hasta 10.000; 30 euros hasta 12.500.",
      "Fiscalidad diferenciada, familia numerosa: 180 euros por descendiente en conjunta y 90 euros en individual.",
      "Gasto pagado con tarjeta, transferencia, cheque nominativo o ingreso en cuenta.",
      "Si hay consorcio conyugal aragonés o análogo, las cantidades se atribuyen por mitades.",
    ],
    [73, 74, 75, 76, 77],
    [
      "aragon_libros_texto_material_escolar:importe",
      "aragon_libros_texto_material_escolar:cumple",
    ],
    ["Descendientes con derecho al mínimo por descendientes en Primaria o ESO."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_arrendamiento_dacion_pago",
    "Por arrendamiento de vivienda habitual vinculado a determinadas operaciones de dación en pago",
    "vivienda_habitual",
    {
      tipo: "porcentaje",
      porcentaje: "10",
      base: "cantidades satisfechas por arrendamiento vinculado a dación en pago",
      limiteMaximoEuros: "480",
    },
    [
      "Fórmula: min(10% de alquiler satisfecho, 480 euros), por base máxima de 4.800 euros anuales.",
      "Base imponible general + ahorro: máximo 15.000 euros individual y 25.000 conjunta.",
      "Debe existir adjudicación de vivienda habitual en pago de la totalidad de la deuda hipotecaria y contrato de arrendamiento con opción de compra de la misma vivienda.",
      "Fianza depositada ante el órgano competente dentro de plazo.",
    ],
    [77],
    [
      "aragon_arrendamiento_dacion_pago:base",
      "aragon_arrendamiento_dacion_pago:cumple",
    ],
    ["Vivienda habitual según normativa estatal vigente a 31-12-2012."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_arrendamiento_vivienda_social_arrendador",
    "Por arrendamiento de vivienda social (deducción del arrendador)",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "30",
      base: "parte de cuota íntegra autonómica correspondiente a rendimientos netos de capital inmobiliario de viviendas sociales",
    },
    [
      "Fórmula: 30% de la cuota íntegra autonómica imputable a los rendimientos netos reducidos de capital inmobiliario de las viviendas cedidas al Plan de Vivienda Social de Aragón.",
      "El contribuyente debe haber puesto una o más viviendas a disposición del Gobierno de Aragón o entidad gestora del Plan de Vivienda Social.",
      "La base técnica es la cuota autonómica correspondiente a la base liquidable general derivada de esos rendimientos netos reducidos.",
    ],
    [78],
    [
      "aragon_arrendamiento_vivienda_social_arrendador:base",
      "aragon_arrendamiento_vivienda_social_arrendador:cumple",
    ],
    [
      "Arrendador con rendimientos de capital inmobiliario de viviendas sociales.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_primer_segundo_hijo_poblaciones_menos_10000",
    "Por nacimiento o adopción del primer y/o segundo hijo en poblaciones de menos de 10.000 habitantes",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "100 euros por primer hijo y 150 euros por segundo; 200 y 300 euros respectivamente si la base general + ahorro no supera 23.000 individual o 35.000 conjunta.",
    },
    [
      "Fórmula general: 100 euros por primer hijo y 150 euros por segundo hijo.",
      "Fórmula incrementada: 200 euros por primer hijo y 300 euros por segundo hijo si base imponible general + ahorro no supera 23.000 euros individual o 35.000 conjunta.",
      "Solo en el período del nacimiento o adopción.",
      "Municipio aragonés de población de derecho inferior a 10.000 habitantes en el año del nacimiento/adopción y en el anterior.",
      "Si el hijo convive con más de un contribuyente, se prorratea por partes iguales.",
      "Incompatible, para el mismo hijo, con la deducción por hijo con discapacidad igual o superior al 33%.",
    ],
    [79, 80],
    [
      "aragon_primer_segundo_hijo_poblaciones_menos_10000:importe",
      "aragon_primer_segundo_hijo_poblaciones_menos_10000:cumple",
    ],
    ["Nacimiento o adopción del primer o segundo hijo durante el ejercicio."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_inversion_economia_social",
    "Por inversión en entidades de la economía social",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "20",
      base: "aportaciones realizadas para ser socio en entidades de economía social",
      limiteMaximoEuros: "4000",
    },
    [
      "Fórmula: min(20% de aportaciones, 4.000 euros).",
      "Límite 4.000 euros tanto en tributación individual como conjunta.",
      "Participación del contribuyente y familiares hasta tercer grado no superior al 40% del capital o derechos de voto.",
      "Entidad de economía social con domicilio social y fiscal en Aragón y al menos una persona empleada a jornada completa en Régimen General.",
      "Requisitos de entidad durante cinco años; aportaciones mantenidas cinco años; operación en escritura pública.",
      "Incompatible, para las mismas inversiones, con MAB y entidades nuevas o de reciente creación.",
    ],
    [82, 83, 84],
    [
      "aragon_inversion_economia_social:base",
      "aragon_inversion_economia_social:cumple",
    ],
    [
      "Aportaciones realizadas con la finalidad de ser socio de entidades de economía social.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_clases_apoyo_refuerzo",
    "Por gastos en clases de apoyo o refuerzo",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "25% de clases de apoyo o refuerzo extraescolar, minorado por ayudas, con límites por descendiente según base, tributación y familia numerosa.",
    },
    [
      "Fórmula: min(25% de gastos - ayudas, límite por descendiente aplicable).",
      "Conjunta no numerosa: 200 euros hasta 12.000; 100 euros hasta 20.000; 80 euros hasta 25.000.",
      "Individual no numerosa: 100 euros hasta 6.500; 80 euros hasta 10.000; 50 euros hasta 12.500.",
      "Familia numerosa: límite 300 euros por descendiente, con base máxima 30.000 individual y 40.000 conjunta.",
      "General no numerosa: base general + ahorro máxima 12.500 individual y 25.000 conjunta.",
      "Pago mediante tarjeta, transferencia, cheque nominativo o ingreso en cuenta.",
      "Si hay consorcio conyugal aragonés o análogo, las cantidades satisfechas se atribuyen por mitades.",
    ],
    [84, 85, 86],
    [
      "aragon_clases_apoyo_refuerzo:importe",
      "aragon_clases_apoyo_refuerzo:cumple",
    ],
    [
      "Descendientes con derecho al mínimo por descendientes; clases extraescolares de materias de Infantil, Educación Básica Obligatoria o FP Básica.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_formacion_autonomia_menores_discapacidad",
    "Por gastos en formación para la autonomía y la vida independiente de menores con discapacidad",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "25% de formación para autonomía y vida independiente de descendientes menores con discapacidad igual o superior al 65%, minorado por ayudas, con límites por descendiente según base, tributación y familia numerosa.",
    },
    [
      "Fórmula: min(25% de gastos - ayudas, límite por descendiente aplicable).",
      "Conjunta no numerosa: 200 euros hasta 12.000; 100 euros hasta 20.000; 80 euros hasta 25.000.",
      "Individual no numerosa: 100 euros hasta 6.500; 80 euros hasta 10.000; 50 euros hasta 12.500.",
      "Familia numerosa: límite 300 euros por descendiente, con base máxima 30.000 individual y 40.000 conjunta.",
      "General no numerosa: base general + ahorro máxima 12.500 individual y 25.000 conjunta.",
      "Pago mediante tarjeta, transferencia, cheque nominativo o ingreso en cuenta.",
      "Si hay consorcio conyugal aragonés o análogo, las cantidades satisfechas se atribuyen por mitades.",
    ],
    [86, 87, 88],
    [
      "aragon_formacion_autonomia_menores_discapacidad:importe",
      "aragon_formacion_autonomia_menores_discapacidad:cumple",
    ],
    [
      "Descendiente menor de edad con discapacidad igual o superior al 65% y con derecho al mínimo por descendientes.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "aragon_residencia_determinados_municipios",
    "Por residencia en determinados municipios",
    "vivienda_habitual",
    {
      tipo: "importe_fijo",
      euros: "600",
      por: "contribuyente que cumpla los requisitos de residencia",
    },
    [
      "Fórmula: 600 euros por contribuyente que cumpla los requisitos; en conjunta, 600 euros por cada contribuyente con derecho.",
      "Bases liquidables general + ahorro: inferior a 35.000 euros individual y 50.000 conjunta.",
      "Base imponible del ahorro: máximo 4.000 euros en cualquier modalidad.",
      "Residencia habitual durante el año natural de devengo y los cuatro siguientes en asentamiento rural de riesgo extremo de despoblación de Rango X.",
    ],
    [88, 89],
    [
      "aragon_residencia_determinados_municipios:unidades",
      "aragon_residencia_determinados_municipios:cumple",
    ],
    ["Residencia en asentamiento rural de riesgo extremo de despoblación."]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const ARAGON_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...ARAGON_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  ARAGON_NACIMIENTO_ADOPCION_TERCER_HIJO_SUCESIVOS_2025,
  ARAGON_CUIDADO_PERSONAS_DEPENDIENTES_2025,
  ARAGON_MAYORES_70_2025,
  ARAGON_GUARDERIA_MENORES_3_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
