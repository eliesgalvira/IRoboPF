import type { FichaDeduccionAutonomica } from "../tipos"
import { fichaImplementada, fichaImplementadaBasica } from "../helpers"

export const ANDALUCIA_NACIMIENTO_ADOPCION_ACOGIMIENTO_2025 = {
  codigo: "andalucia_nacimiento_adopcion_acogimiento_menores",
  comunidad: "andalucia",
  nombre: "Por nacimiento, adopción de hijos o acogimiento familiar de menores",
  normativa: "Art. 11 Ley 5/2021, de Tributos Cedidos de Andalucía",
  categoria: "circunstancias_personales_familiares",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "200 euros por hijo nacido/adoptado o menor acogido; 400 euros si el contribuyente reside en municipio con problemas de despoblación",
  },
  requisitos: [
    "Nacimiento, adopción o acogimiento en el período impositivo",
    "En acogimiento, convivencia con el contribuyente según los requisitos del manual",
    "Para aplicar 400 euros, residencia en municipio andaluz con problemas de despoblación",
    "Si son dos los contribuyentes con derecho, el importe se distribuye por partes iguales",
    "En acogimiento, no puede haber recibido ayudas de la Administración de Andalucía vinculadas con el acogimiento",
  ],
  limites: [
    "200 euros por hijo nacido/adoptado o menor acogido",
    "400 euros por hijo nacido/adoptado o menor acogido si reside en municipio andaluz con problemas de despoblacion",
    "Incremento de 200 euros por cada hijo o menor en partos, adopciones o acogimientos múltiples",
  ],
  prorrateo: ["Normalizar reglas cuando dos contribuyentes tengan derecho"],
  compatibilidades: [],
  incompatibilidades: [
    "Incompatible respecto de los mismos hijos con adopción internacional",
    "Incompatible con familia numerosa",
  ],
  entradaNecesaria: [
    "numeroHijosNacidosOAdoptados",
    "numeroMenoresAcogidos",
    "resideMunicipioDespoblacion",
    "datosConvivenciaAcogimiento",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [41, 42, 43],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_FAMILIA_MONOPARENTAL_ASCENDIENTES_MAYORES_75_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "andalucia_familia_monoparental_ascendientes_mayores_75",
    "Para el padre o madre de familia monoparental y, en su caso, con ascendientes mayores de 75 años",
    "circunstancias_personales_familiares"
  ),
  cuantia: {
    tipo: "mixta",
    descripcion:
      "100 euros para padres o madres de familia monoparental; incremento adicional de 100 euros por ascendiente mayor de 75 años que genere derecho al mínimo por ascendientes",
  },
  requisitos: [
    "Ser padre o madre de familia monoparental según la ficha autonómica",
    "El ascendiente mayor de 75 años debe generar derecho al mínimo por ascendientes para aplicar el incremento",
  ],
  limites: [
    "100 euros por padre o madre de familia monoparental",
    "Incremento de 100 euros por cada ascendiente mayor de 75 años que conviva y genere derecho al mínimo por ascendientes",
    "Base imponible general + base imponible del ahorro: máximo 80.000 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 100.000 euros en tributación conjunta",
  ],
  prorrateo: [
    "Normalizar reglas de aplicación cuando existan varios contribuyentes con derecho",
  ],
  entradaNecesaria: [
    "esFamiliaMonoparental",
    "numeroAscendientesMayores75ConDerechoMinimo",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [44, 45],
  },
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_ADOPCION_INTERNACIONAL_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "andalucia_adopcion_internacional",
    "Por adopción de hijos en el ámbito internacional",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 12 Ley 5/2021, de 20 de octubre, de Tributos Cedidos de Andalucía",
  cuantia: {
    tipo: "importe_fijo",
    euros: "600",
    por: "hijo adoptado internacionalmente",
  },
  requisitos: [
    "Adopción internacional inscrita en el Registro Civil durante el período impositivo",
    "La adopción debe tener carácter internacional según las normas y convenios aplicables",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "600 euros por cada hijo adoptado internacionalmente",
    "Base imponible general + base imponible del ahorro: máximo 80.000 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 100.000 euros en tributación conjunta",
  ],
  prorrateo: [
    "Si dos contribuyentes tienen derecho, se distribuye por partes iguales",
    "Si uno de los adoptantes no puede aplicar la deducción por superar los límites de base, el otro puede aplicar el importe total",
  ],
  incompatibilidades: [
    "Incompatible respecto de los mismos hijos con la deducción andaluza por nacimiento, adopción o acogimiento familiar de menores",
  ],
  entradaNecesaria: [
    "numeroHijosAdoptadosInternacionalmente",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "numeroContribuyentesConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [43],
  },
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_FAMILIA_NUMEROSA_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "andalucia_familia_numerosa",
    "Para familia numerosa",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 14 y 5 Ley 5/2021, de 20 de octubre, de Tributos Cedidos de Andalucía",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "200 euros para familia numerosa de categoría general; 400 euros para categoría especial",
  },
  requisitos: [
    "Ostentar el título de familia numerosa en la fecha de devengo del impuesto",
    "Cumplir la normativa estatal sobre familias numerosas",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "200 euros si la familia numerosa es de categoría general",
    "400 euros si la familia numerosa es de categoría especial",
    "Base imponible general + base imponible del ahorro: máximo 25.000 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 30.000 euros en tributación conjunta",
  ],
  prorrateo: [
    "Si existe más de una persona con derecho y presentan declaración individual, se distribuye por partes iguales",
    "Si uno de los cónyuges no puede aplicar la deducción por superar el límite individual o por residir en otra comunidad, el otro puede deducir íntegramente el importe que corresponda",
  ],
  incompatibilidades: [
    "Incompatible en todo caso con la deducción andaluza por nacimiento, adopción o acogimiento familiar de menores",
  ],
  entradaNecesaria: [
    "categoriaFamiliaNumerosa",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "numeroContribuyentesConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [45, 46],
  },
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_CONTRIBUYENTE_DISCAPACIDAD_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "andalucia_contribuyente_discapacidad",
    "Para contribuyentes con discapacidad",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 16 y 3 y disposición adicional segunda Ley 5/2021, de 20 de octubre, de Tributos Cedidos de Andalucía",
  cuantia: {
    tipo: "importe_fijo",
    euros: "150",
    por: "contribuyente con discapacidad",
  },
  requisitos: [
    "El contribuyente debe tener la consideración de persona con discapacidad",
    "Grado de discapacidad igual o superior al 33 por 100",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "150 euros por contribuyente con discapacidad",
    "Base imponible general + base imponible del ahorro: máximo 25.000 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 30.000 euros en tributación conjunta",
  ],
  prorrateo: [],
  incompatibilidades: [
    "En tributación conjunta, no aplicar simultáneamente con asistencia a personas con discapacidad respecto del mismo hijo integrante de la unidad familiar con discapacidad cuando proceda la deducción por asistencia",
  ],
  entradaNecesaria: [
    "gradoDiscapacidadContribuyente",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [48],
  },
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_CONYUGE_PAREJA_DISCAPACIDAD_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "andalucia_conyuge_pareja_discapacidad",
    "Para contribuyentes con cónyuges o parejas de hecho con discapacidad",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 17 y 3 y disposición adicional segunda Ley 5/2021, de 20 de octubre, de Tributos Cedidos de Andalucía",
  cuantia: {
    tipo: "importe_fijo",
    euros: "100",
    por: "cónyuge o pareja de hecho con discapacidad",
  },
  requisitos: [
    "Cónyuge o pareja de hecho con discapacidad igual o superior al 65 por 100",
    "El cónyuge o pareja no debe ser declarante por tributación individual del IRPF en el ejercicio",
    "En parejas de hecho, inscripción en el Registro de Parejas de Hecho de Andalucía o registros análogos",
    "Base imponible general + base imponible del ahorro del contribuyente dentro de límites",
  ],
  limites: [
    "100 euros por cónyuge o pareja de hecho que cumpla los requisitos",
    "Base imponible general + base imponible del ahorro: máximo 25.000 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 30.000 euros en tributación conjunta",
  ],
  prorrateo: [],
  incompatibilidades: [
    "No procede si el cónyuge o pareja con discapacidad ha aplicado la deducción andaluza para contribuyentes con discapacidad",
  ],
  entradaNecesaria: [
    "conyugeOParejaConDiscapacidad65",
    "conyugeOParejaDeclaraIndividual",
    "parejaHechoInscrita",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [49],
  },
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_ASISTENCIA_PERSONAS_DISCAPACIDAD_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "andalucia_asistencia_personas_discapacidad",
    "Por asistencia a personas con discapacidad",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 18 y 3 y disposición adicional segunda Ley 5/2021, de 20 de octubre, de Tributos Cedidos de Andalucía",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "100 euros por cada persona con discapacidad que dé derecho al mínimo por discapacidad de ascendientes o descendientes; adicionalmente, 20% de la cuota fija de Seguridad Social de empleados del hogar con límite de 500 euros si precisa ayuda de terceras personas",
  },
  requisitos: [
    "La persona con discapacidad debe dar derecho al mínimo por discapacidad de ascendientes o descendientes",
    "Para el incremento por tercera persona, debe acreditarse necesidad de ayuda de terceras personas y derecho al mínimo por gastos de asistencia",
    "Para el incremento, el contribuyente debe ser titular del hogar familiar en la Tesorería General de la Seguridad Social",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "100 euros por persona con discapacidad que genere derecho",
    "Incremento adicional: 20% del importe satisfecho a la Seguridad Social como cuota fija por cuenta del empleador",
    "Límite del incremento adicional: 500 euros anuales por contribuyente",
    "Base imponible general + base imponible del ahorro: máximo 80.000 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 100.000 euros en tributación conjunta",
  ],
  prorrateo: [
    "Cuando varios contribuyentes tengan derecho, aplicar reglas de prorrateo, convivencia y límites de la normativa estatal del IRPF",
  ],
  incompatibilidades: [
    "Incompatible con la deducción andaluza por ayuda doméstica cuando sea la misma persona empleada la que dé derecho a ambas deducciones",
  ],
  entradaNecesaria: [
    "numeroAscendientesDescendientesDiscapacidadConMinimo",
    "necesitaAyudaTercerasPersonas",
    "cuotasSeguridadSocialEmpleadoHogar",
    "titularHogarFamiliar",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [49, 50],
  },
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_AYUDA_DOMESTICA_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "andalucia_ayuda_domestica",
    "Por ayuda doméstica",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Arts. 19 y 4 Ley 5/2021, de 20 de octubre, de Tributos Cedidos de Andalucía",
  cuantia: {
    tipo: "porcentaje",
    porcentaje: "20",
    base: "cotización anual satisfecha por cuenta del empleador a la Seguridad Social por empleado del hogar familiar",
    limiteMaximoEuros: "500",
  },
  requisitos: [
    "La cotización debe corresponder a empleado o empleada del hogar familiar que constituya la vivienda habitual del empleador",
    "Debe constar Código Cuenta de Cotización del Sistema Especial de Empleados de Hogar",
    "Debe cumplir uno de los supuestos: progenitores con hijos que den derecho al mínimo por descendientes y ambos cónyuges o pareja perciben rendimientos del trabajo o de actividades económicas",
    "También procede si la persona titular del hogar familiar, su cónyuge o pareja inscrita tiene edad igual o superior a 75 años",
  ],
  limites: [
    "20% de las cantidades satisfechas a la Seguridad Social por cuenta del empleador",
    "Importe máximo: 500 euros",
  ],
  prorrateo: [
    "En cónyuges o parejas inscritas, puede aplicarla indistintamente el titular del hogar familiar o su cónyuge o pareja cuando se cumplan los requisitos",
  ],
  incompatibilidades: [
    "Incompatible con la deducción andaluza por asistencia a personas con discapacidad que precisen ayuda de terceras personas cuando la misma persona empleada dé derecho a ambas deducciones",
  ],
  entradaNecesaria: [
    "cuotasSeguridadSocialEmpleadoHogar",
    "codigoCuentaCotizacionEmpleadoHogar",
    "titularHogarFamiliar",
    "edadTitularConyugeOPareja",
    "tieneDescendientesConDerechoMinimo",
    "ambosPercibenRendimientosTrabajoOActividad",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [50, 51],
  },
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_INVERSION_ACCIONES_PARTICIPACIONES_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "andalucia_inversion_acciones_participaciones_mercantiles",
    "Por inversión en la adquisición de acciones y participaciones sociales como consecuencia de acuerdos de constitución de sociedades o ampliación de capital en sociedades mercantiles",
    "otros_conceptos"
  ),
  normativa:
    "Art. 20 Ley 5/2021, de 20 de octubre, de Tributos Cedidos de Andalucía",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "20% de la inversión con límite de 4.000 euros; 50% con límite de 12.000 euros para sociedades creadas o participadas por universidades o centros de investigación",
  },
  requisitos: [
    "Inversión en acciones o participaciones por constitución o ampliación de capital",
    "Entidad con forma de SA, SAL, SL, SLL o sociedad cooperativa",
    "La participación del contribuyente junto con cónyuge y parientes hasta tercer grado no puede superar el 40% del capital social o derechos de voto durante ningún día del año natural",
    "La participación debe mantenerse al menos tres años",
  ],
  limites: [
    "Régimen general: 20% de las cantidades invertidas, límite 4.000 euros anuales",
    "Régimen universidades/centros de investigación: 50% de las cantidades invertidas, límite 12.000 euros anuales",
    "El límite incrementado de 12.000 euros es independiente del límite general de 4.000 euros",
  ],
  prorrateo: [],
  incompatibilidades: [],
  entradaNecesaria: [
    "importeInvertido",
    "entidadCreadaOParticipadaPorUniversidadOCentroInvestigacion",
    "porcentajeParticipacionGrupoFamiliar",
    "mantenimientoTresAnios",
    "formaJuridicaEntidad",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [52],
  },
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_INVERSION_VIVIENDA_HABITUAL_PROTEGIDA_JOVENES_2025 =
  fichaImplementada(
    { estado: "implementada" },
    "andalucia_inversion_vivienda_habitual_protegida_jovenes",
    "Por inversión en vivienda habitual que tenga la consideración de protegida y por las personas jóvenes",
    "vivienda_habitual",
    {
      tipo: "porcentaje",
      porcentaje: "6",
      base: "cantidades satisfechas por adquisición o rehabilitación de vivienda habitual",
      limiteMaximoEuros: "542.40",
    },
    [
      "6% de las cantidades satisfechas",
      "Base máxima anual de deducción: 9.040 euros",
      "Deducción máxima derivada de la base máxima: 542,40 euros",
      "Base imponible general + ahorro: máximo 25.000 euros individual y 30.000 conjunta",
    ],
    [37, 38]
  )

export const ANDALUCIA_ALQUILER_VIVIENDA_HABITUAL_2025 = fichaImplementada(
  { estado: "implementada" },
  "andalucia_alquiler_vivienda_habitual",
  "Por cantidades invertidas en el alquiler de la vivienda habitual",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "15% del alquiler; límite 1.200 euros, o 1.500 euros si el contribuyente tiene discapacidad",
  },
  [
    "15% de las cantidades satisfechas",
    "Límite general: 1.200 euros anuales",
    "Límite para contribuyente con discapacidad: 1.500 euros anuales",
    "Base imponible general + ahorro: máximo 25.000 euros individual y 30.000 conjunta",
  ],
  [39, 40]
)

export const ANDALUCIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "andalucia_gastos_educativos",
    "Por gastos educativos",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "15% de gastos de enseñanza escolar o extraescolar de idiomas, informática o ambas; límite 150 euros anuales por descendiente.",
    },
    [
      "Fórmula: min(15% de gastos satisfechos, 150 euros por descendiente con derecho al mínimo).",
      "Base imponible general + ahorro: máximo 80.000 euros individual y 100.000 conjunta.",
      "Si hay varios contribuyentes con derecho, cada uno aplica la deducción sobre las cantidades que haya satisfecho, con límite de 150 euros por descendiente.",
      "Si el pago es ganancial, se atribuye por mitades a ambos cónyuges.",
    ],
    [46, 47],
    [
      "andalucia_gastos_educativos:importe",
      "andalucia_gastos_educativos:cumple",
    ],
    [
      "Descendiente con derecho al mínimo por descendientes.",
      "Gastos de enseñanza escolar o extraescolar de idiomas, informática o ambas, justificados documentalmente.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "andalucia_defensa_juridica_laboral",
    "Para gastos de defensa jurídica de la relación laboral",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "100",
      base: "gastos de defensa jurídica derivados de la relación laboral",
      limiteMaximoEuros: "200",
    },
    [
      "Fórmula: min(gastos satisfechos, 200 euros).",
      "Procedimientos judiciales de despido, extinción de contrato o reclamación de cantidades.",
      "Límite 200 euros tanto en tributación individual como conjunta.",
    ],
    [54],
    [
      "andalucia_defensa_juridica_laboral:base",
      "andalucia_defensa_juridica_laboral:cumple",
    ],
    ["Gasto efectivamente satisfecho y justificado por el contribuyente."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "andalucia_donativos_finalidad_ecologica",
    "Por donativos con finalidad ecológica",
    "donativos_donaciones",
    {
      tipo: "porcentaje",
      porcentaje: "10",
      base: "donativos con finalidad ecológica",
      limiteMaximoEuros: "150",
    },
    [
      "Fórmula: min(10% de donativos, 150 euros).",
      "Donativos a entidades públicas andaluzas o locales andaluzas dedicadas a defensa y conservación del medio ambiente.",
      "También donativos a entidades sin fines lucrativos o beneficiarias del mecenazgo cuyo fin exclusivo sea la defensa del medio ambiente y estén inscritas en registros andaluces.",
    ],
    [54, 55],
    [
      "andalucia_donativos_finalidad_ecologica:base",
      "andalucia_donativos_finalidad_ecologica:cumple",
    ],
    ["Donación acreditada mediante certificación de la entidad beneficiaria."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "andalucia_ejercicio_fisico_deporte",
    "Para fomentar el ejercicio físico y la práctica deportiva",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "15",
      base: "cuotas de pertenencia o adhesión a gimnasios, centros deportivos, clubes, federaciones o secciones deportivas",
      limiteMaximoEuros: "100",
    },
    [
      "Fórmula: min(15% de cuotas satisfechas, 100 euros por contribuyente).",
      "Gastos satisfechos para el contribuyente, cónyuge o pareja inscrita, o personas que den derecho al mínimo por descendientes o ascendientes.",
      "Si el gasto lo satisfacen varios contribuyentes, se aplica según las cantidades efectivamente abonadas por cada uno, respetando el límite de 100 euros por contribuyente.",
      "Si el pago es ganancial, se atribuye por mitades a ambos cónyuges.",
    ],
    [55, 56],
    [
      "andalucia_ejercicio_fisico_deporte:base",
      "andalucia_ejercicio_fisico_deporte:cumple",
    ],
    ["Cuotas efectivamente satisfechas y justificadas documentalmente."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "andalucia_gastos_veterinarios_animales_compania_perros_asistencia",
    "Por gastos veterinarios derivados de la adquisición de animales de compañía o de la tenencia de perros de asistencia",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "30",
      base: "gastos veterinarios deducibles por animales de compañía o perros de asistencia",
      limiteMaximoEuros: "100",
    },
    [
      "Fórmula: min(30% de gastos veterinarios deducibles, 100 euros por contribuyente).",
      "Base imponible general + ahorro: máximo 80.000 euros individual y 100.000 conjunta.",
      "Animales de compañía: gastos durante el año siguiente a la adquisición; si es adopción, durante los tres años siguientes; perros de asistencia, durante todo el período de tenencia.",
      "Solo adquisiciones de animales de compañía formalizadas desde 1 de enero de 2025; esta limitación no aplica a perros de asistencia.",
      "Gastos deducibles: tratamientos obligatorios, vacunación, desparasitación y esterilización preceptiva.",
      "Si el pago es de varios titulares o ganancial, se atribuye por partes iguales salvo prueba en contrario.",
    ],
    [57, 58, 59],
    [
      "andalucia_gastos_veterinarios_animales_compania_perros_asistencia:base",
      "andalucia_gastos_veterinarios_animales_compania_perros_asistencia:cumple",
    ],
    [
      "Gastos justificados mediante factura de profesional o centro veterinario legalmente autorizado.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "andalucia_enfermedad_celiaca",
    "Para familias con enfermedad celíaca diagnosticada",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "100",
      por: "persona integrante del núcleo familiar con enfermedad celíaca diagnosticada",
    },
    [
      "Fórmula: 100 euros por persona integrante del núcleo familiar con enfermedad celíaca diagnosticada.",
      "Si dos o más contribuyentes tienen derecho por la misma persona, el importe se distribuye por partes iguales.",
      "Núcleo familiar: contribuyente, cónyuge o pareja inscrita y personas con derecho a mínimos familiares por ascendientes o descendientes.",
    ],
    [59, 60],
    [
      "andalucia_enfermedad_celiaca:unidades",
      "andalucia_enfermedad_celiaca:cumple",
    ],
    [
      "Diagnóstico acreditado por informe médico oficial conforme a los criterios reconocidos por la comunidad científica.",
    ]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const ANDALUCIA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...ANDALUCIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  ANDALUCIA_INVERSION_VIVIENDA_HABITUAL_PROTEGIDA_JOVENES_2025,
  ANDALUCIA_ALQUILER_VIVIENDA_HABITUAL_2025,
  ANDALUCIA_NACIMIENTO_ADOPCION_ACOGIMIENTO_2025,
  ANDALUCIA_ADOPCION_INTERNACIONAL_2025,
  ANDALUCIA_FAMILIA_MONOPARENTAL_ASCENDIENTES_MAYORES_75_2025,
  ANDALUCIA_FAMILIA_NUMEROSA_2025,
  ANDALUCIA_CONTRIBUYENTE_DISCAPACIDAD_2025,
  ANDALUCIA_CONYUGE_PAREJA_DISCAPACIDAD_2025,
  ANDALUCIA_ASISTENCIA_PERSONAS_DISCAPACIDAD_2025,
  ANDALUCIA_AYUDA_DOMESTICA_2025,
  ANDALUCIA_INVERSION_ACCIONES_PARTICIPACIONES_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
