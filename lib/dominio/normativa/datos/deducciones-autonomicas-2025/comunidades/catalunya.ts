import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const CATALUNYA_ALQUILER_VICTIMAS_VIOLENCIA_MACHISTA_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "cataluna_alquiler_victimas_violencia_machista",
    "Por alquiler de la vivienda habitual de víctimas de violencia machista",
    "vivienda_habitual"
  ),
  cuantia: {
    tipo: "mixta",
    descripcion:
      "20% de las cantidades pagadas con máximo de 1.000 euros; 25% con máximo de 1.200 euros si hay discapacidad igual o superior al 65% o hijo menor a cargo",
  },
  requisitos: [
    "Alquiler de vivienda habitual",
    "Condición de víctima de violencia machista según la ficha autonómica",
    "Para el tramo incrementado, discapacidad igual o superior al 65% o hijo menor a cargo",
    "La contribuyente debe figurar como titular del contrato de alquiler",
  ],
  limites: [
    "20% de las cantidades satisfechas por alquiler de vivienda habitual, con máximo de 1.000 euros anuales",
    "25% de las cantidades satisfechas, con máximo de 1.200 euros anuales, si la contribuyente tiene discapacidad igual o superior al 65% o hijo menor a cargo",
    "Base imponible general + base imponible del ahorro - mínimo personal y familiar: máximo 30.000 euros anuales",
    "Una misma vivienda no puede dar lugar a una deducción superior a 1.000 euros, o 1.200 euros en el tramo incrementado",
    "Aplicable como máximo durante tres ejercicios consecutivos",
  ],
  prorrateo: [
    "Normalizar reglas de prorrateo si varias personas tienen derecho",
  ],
  entradaNecesaria: [
    "importeAlquilerPagado",
    "esVictimaViolenciaMachista",
    "discapacidad65OMas",
    "hijosMenoresACargo",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [325, 326],
  },
} as const satisfies FichaDeduccionAutonomica

export const CATALUNYA_INVERSION_COOPERATIVAS_AGRARIAS_VIVIENDA_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "cataluna_inversion_cooperativas_agrarias_vivienda",
    "Por inversión en sociedades cooperativas agrarias y de vivienda",
    "otros_conceptos"
  ),
  cuantia: {
    tipo: "porcentaje",
    porcentaje: "20",
    base: "aportaciones de capital",
    limiteMaximoEuros: "3000",
  },
  requisitos: [
    "Aportaciones de capital a sociedades cooperativas agrarias o de vivienda",
    "Ser socio de cualquier tipo previsto en la Ley 12/2015 de cooperativas, excepto socio temporal",
    "El total de voto de la persona socia no puede superar el 25% de los votos sociales",
    "La cooperativa debe estar inscrita como cooperativa agraria o cooperativa de vivienda",
    "No aplica a cooperativas de vivienda para uso turistico o de corta duracion",
    "Debe disponerse de certificacion de la cooperativa que acredite el cumplimiento de los requisitos",
    "Las aportaciones deben mantenerse durante un mínimo de 5 años",
  ],
  limites: [
    "20% de las aportaciones de capital obligatorias o voluntarias efectivamente desembolsadas",
    "Límite máximo de 3.000 euros anuales por contribuyente",
    "Si no hay cuota íntegra autonómica suficiente, el importe no deducido puede compensarse en ejercicios futuros",
  ],
  prorrateo: [],
  entradaNecesaria: [
    "importeAportacionesCapital",
    "tipoCooperativa",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [326, 327, 328],
  },
} as const satisfies FichaDeduccionAutonomica

export const CATALUNYA_VIUDEDAD_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "cataluna_viudedad_2023_2024_2025",
    "Para contribuyentes que hayan quedado viudos en los ejercicios 2023, 2024 y 2025",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 612-2 Decreto Legislativo 1/2024, de 12 de marzo, Código tributario de Catalunya",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "150 euros con carácter general; 300 euros si la persona viuda tiene a cargo uno o más descendientes con derecho al mínimo por descendientes",
  },
  requisitos: [
    "El contribuyente debe haber quedado viudo en 2023, 2024 o 2025",
    "Para aplicar 300 euros debe tener a cargo uno o más descendientes que otorguen derecho al mínimo por descendientes",
    "Debe consignarse el año de viudedad en el Anexo correspondiente",
  ],
  limites: [
    "150 euros con carácter general",
    "300 euros si hay descendientes con derecho al mínimo por descendientes",
    "Aplicable en el ejercicio de viudedad y en los dos ejercicios siguientes",
    "La cuantía de 300 euros en los dos ejercicios siguientes exige que los descendientes sigan cumpliendo los requisitos del mínimo por descendientes",
  ],
  prorrateo: [],
  incompatibilidades: [],
  entradaNecesaria: ["anioViudedad", "numeroDescendientesConDerechoMinimo"],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [316],
  },
} as const satisfies FichaDeduccionAutonomica

export const CATALUNYA_REHABILITACION_VIVIENDA_HABITUAL_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "cataluna_rehabilitacion_vivienda_habitual",
    "Por rehabilitación de la vivienda habitual",
    "vivienda_habitual"
  ),
  normativa:
    "Art. 612-4 Decreto Legislativo 1/2024, de 12 de marzo, Código tributario de Catalunya",
  cuantia: {
    tipo: "porcentaje",
    porcentaje: "1.5",
    base: "cantidades satisfechas por rehabilitación de la vivienda habitual",
    limiteMaximoEuros: "135.60",
  },
  requisitos: [
    "Cantidades satisfechas en el período impositivo por rehabilitación de la vivienda habitual",
    "La vivienda debe constituir o ir a constituir la vivienda habitual del contribuyente",
    "El concepto de rehabilitación debe ajustarse al indicado en el Manual de Renta",
  ],
  limites: [
    "1,5% de las cantidades satisfechas",
    "Base máxima anual de deducción: 9.040 euros",
    "Deducción máxima derivada de la base máxima: 135,60 euros",
  ],
  prorrateo: [],
  incompatibilidades: [],
  entradaNecesaria: [
    "importeRehabilitacionViviendaHabitual",
    "viviendaEsHabitual",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [318, 319],
  },
} as const satisfies FichaDeduccionAutonomica

export const CATALUNYA_INTERESES_PRESTAMOS_MASTER_DOCTORADO_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "cataluna_intereses_prestamos_master_doctorado",
    "Por el pago de intereses de préstamos para los estudios de máster y doctorado",
    "otros_conceptos"
  ),
  normativa:
    "Art. 612-5 Decreto Legislativo 1/2024, de 12 de marzo, Código tributario de Catalunya",
  cuantia: {
    tipo: "porcentaje",
    porcentaje: "100",
    base: "intereses pagados en préstamos concedidos a través de la Agencia de Gestión de Ayudas Universitarias y de Investigación",
  },
  requisitos: [
    "Los intereses deben corresponder a préstamos concedidos a través de la Agencia de Gestión de Ayudas Universitarias y de Investigación",
    "Los préstamos deben financiar estudios de máster o doctorado",
    "Los intereses deben haberse pagado en el período impositivo",
  ],
  limites: [
    "Deducción por el importe de los intereses pagados que cumplan los requisitos",
  ],
  prorrateo: [],
  incompatibilidades: [],
  entradaNecesaria: [
    "interesesPagadosPrestamoMasterDoctorado",
    "prestamoConcedidoPorAgenciaGestionAyudasUniversitarias",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [319],
  },
} as const satisfies FichaDeduccionAutonomica

export const CATALUNYA_NACIMIENTO_ADOPCION_ACOGIMIENTO_2025 = fichaImplementada(
  { estado: "implementada" },
  "cataluna_nacimiento_adopcion_acogimiento",
  "Por nacimiento o adopción de un hijo o de una hija o por acogimiento familiar",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "150 euros en individual; 300 euros en conjunta o familia monoparental",
  },
  [
    "150 euros en declaración individual de cada progenitor",
    "300 euros en declaración conjunta de ambos progenitores",
    "300 euros en declaración del progenitor o progenitora de familia monoparental",
  ],
  [314, 315]
)

export const CATALUNYA_ALQUILER_VIVIENDA_HABITUAL_2025 = fichaImplementada(
  { estado: "implementada" },
  "cataluna_alquiler_vivienda_habitual",
  "Por alquiler de la vivienda habitual",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "10% del alquiler; límite 500 euros general y 1.000 euros en conjunta, familia numerosa o monoparental",
  },
  [
    "10% de cantidades satisfechas",
    "Límite general: 500 euros",
    "Límite en conjunta o familia numerosa/monoparental: 1.000 euros",
    "Base imponible general + ahorro - mínimo personal y familiar máximo 30.000 euros individual y 45.000 conjunta",
  ],
  [316, 317]
)

export const CATALUNYA_OBLIGACION_DECLARAR_MAS_DE_UN_PAGADOR_2025 =
  fichaImplementada(
    { estado: "implementada" },
    "cataluna_obligacion_declarar_mas_de_un_pagador",
    "Por obligación de presentar la declaración del IRPF por razón de tener más de un pagador",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "Deducción = max(cuota íntegra autonómica - cuota íntegra estatal, 0)",
    },
    ["Deducción = max(cuota íntegra autonómica - cuota íntegra estatal, 0)"],
    [323, 324, 325]
  )

export const CATALUNYA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "cataluna_donativos_lengua_catalana_occitana",
    nombreCatalogadoDesdeCodigo("cataluna_donativos_lengua_catalana_occitana"),
    categoriaCatalogadaDesdeCodigo(
      "cataluna_donativos_lengua_catalana_occitana"
    ),
    {
      tipo: "mixta",
      descripcion:
        "15% de donativos; límite del 10% de la cuota íntegra autonómica.",
    },
    [
      "15% de donativos, con límite del 10% de la cuota íntegra autonómica.",
      "Destinatarios: entidades e instituciones del artículo 612-6; inclusión en el censo cuando proceda.",
      "Justificación documental suficiente y comunicación de donativos por la entidad a la ATC.",
    ],
    [314, 328],
    [
      "cataluna_donativos_lengua_catalana_occitana:importe",
      "cataluna_donativos_lengua_catalana_occitana:cumple",
    ],
    [
      "Donativo a destinatario legalmente admitido que fomente la lengua catalana u occitana.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cataluna_donativos_idi",
    nombreCatalogadoDesdeCodigo("cataluna_donativos_idi"),
    categoriaCatalogadaDesdeCodigo("cataluna_donativos_idi"),
    {
      tipo: "mixta",
      descripcion:
        "30% de donativos a entidades de investigación; límite del 10% de la cuota íntegra autonómica.",
    },
    [
      "30% de donativos, con límite del 10% de la cuota íntegra autonómica.",
      "La suma con la deducción estatal por donativos no puede superar el 100% del donativo.",
      "Universidades catalanas y centros de investigación admitidos por el artículo 612-7; justificación documental e información a la ATC.",
    ],
    [314, 328],
    ["cataluna_donativos_idi:importe", "cataluna_donativos_idi:cumple"],
    [
      "Donativo a universidad o centro de investigación comprendido en el artículo 612-7.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cataluna_donaciones_medio_ambiente_patrimonio_natural",
    nombreCatalogadoDesdeCodigo(
      "cataluna_donaciones_medio_ambiente_patrimonio_natural"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cataluna_donaciones_medio_ambiente_patrimonio_natural"
    ),
    {
      tipo: "mixta",
      descripcion:
        "15% de donativos; límite del 5% de la cuota íntegra autonómica.",
    },
    [
      "15% de cantidades donadas, con límite del 5% de la cuota íntegra autonómica.",
      "Fundación o asociación incluida en el censo de entidades ambientales competente.",
      "Justificación documental suficiente e información de donativos a la ATC.",
    ],
    [314, 328],
    [
      "cataluna_donaciones_medio_ambiente_patrimonio_natural:importe",
      "cataluna_donaciones_medio_ambiente_patrimonio_natural:cumple",
    ],
    [
      "Donativo a entidad censada en beneficio del medio ambiente, patrimonio natural o custodia del territorio.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cataluna_angel_inversor",
    nombreCatalogadoDesdeCodigo("cataluna_angel_inversor"),
    categoriaCatalogadaDesdeCodigo("cataluna_angel_inversor"),
    {
      tipo: "mixta",
      descripcion:
        "40% de la inversión, hasta 12.000 euros; 50% hasta 12.000 euros para sociedades creadas o participadas por universidades o centros de investigación.",
    },
    [
      "40% de cantidades invertidas, máximo 12.000 euros; régimen universidades o centros de investigación: 50%, máximo 12.000 euros.",
      "En conjunta, los límites se aplican a cada contribuyente.",
      "Participación con cónyuge y familiares hasta tercer grado: máximo 35%; mantenimiento mínimo tres años.",
      "Sociedad SA, SL, SAL o SLL con domicilio social y fiscal en Catalunya, actividad económica y al menos una persona empleada a jornada completa en Régimen General.",
      "En ampliación, constitución en los tres años anteriores y sin cotización en mercado nacional ni alternativo; facturación anual máxima de un millón de euros.",
      "Sin funciones ejecutivas o de dirección ni relación laboral; escritura pública; mantenimiento y regularización según artículo 612-9.",
    ],
    [314, 328],
    ["cataluna_angel_inversor:importe", "cataluna_angel_inversor:cumple"],
    [
      "Inversión en constitución o ampliación de capital que cumpla los requisitos del artículo 612-9.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cataluna_tramo_autonomico_inversion_vivienda_habitual",
    nombreCatalogadoDesdeCodigo(
      "cataluna_tramo_autonomico_inversion_vivienda_habitual"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cataluna_tramo_autonomico_inversion_vivienda_habitual"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Régimen transitorio: 7,5% general; 15% por adecuación para discapacidad; 9% en los supuestos anteriores al 30/07/2011 previstos en el artículo 613-1.",
    },
    [
      "Aplicable solo bajo el régimen transitorio de la disposición transitoria decimoctava LIRPF.",
      "7,5% general y 15% para obras de adecuación de vivienda habitual de personas con discapacidad.",
      "9% para adquisiciones o cantidades de construcción anteriores al 30/07/2011 si se cumple alguno de los supuestos legales.",
      "Para el 9%: edad hasta 32 años, paro al menos 183 días, discapacidad al menos 65% o unidad familiar con al menos un hijo a devengo.",
      "Para el 9%: base imponible general más ahorro menos mínimo personal y familiar no superior a 30.000 euros; en conjunta se computa individualmente por contribuyente con derecho.",
    ],
    [314, 328],
    [
      "cataluna_tramo_autonomico_inversion_vivienda_habitual:importe",
      "cataluna_tramo_autonomico_inversion_vivienda_habitual:cumple",
    ],
    [
      "Derecho al régimen transitorio estatal y cumplimiento de las condiciones del artículo 613-1.",
    ]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const CATALUNYA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...CATALUNYA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  CATALUNYA_NACIMIENTO_ADOPCION_ACOGIMIENTO_2025,
  CATALUNYA_ALQUILER_VIVIENDA_HABITUAL_2025,
  CATALUNYA_OBLIGACION_DECLARAR_MAS_DE_UN_PAGADOR_2025,
  CATALUNYA_VIUDEDAD_2025,
  CATALUNYA_REHABILITACION_VIVIENDA_HABITUAL_2025,
  CATALUNYA_INTERESES_PRESTAMOS_MASTER_DOCTORADO_2025,
  CATALUNYA_ALQUILER_VICTIMAS_VIOLENCIA_MACHISTA_2025,
  CATALUNYA_INVERSION_COOPERATIVAS_AGRARIAS_VIVIENDA_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
