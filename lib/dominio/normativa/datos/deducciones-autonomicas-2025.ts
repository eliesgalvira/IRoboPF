import { fuenteAeatDeduccionesAutonomicas2025 } from "../fuente-normativa"
import { parametroNormativo } from "../repositorio-parametros"

export type CategoriaDeduccionAutonomica =
  | "circunstancias_personales_familiares"
  | "vivienda_habitual"
  | "donativos_donaciones"
  | "otros_conceptos"

/**
 * Estados del ciclo de vida de una deduccion autonomica en el motor.
 *
 * - catalogada: existe en el manual y el motor puede reconocerla, pero todavia
 *   no hay una ficha revisada con datos suficientes para calcularla.
 * - normalizada_pendiente_tests: ya hay ficha estructurada, pero falta cubrirla
 *   con tests antes de usarla en una liquidacion.
 * - implementada: tiene ficha, evaluador de interfaz y tests o verificacion de
 *   comportamiento suficiente para poder aplicarla.
 * - no_soportada: se ha revisado y se sabe que este motor no puede calcularla
 *   con los datos disponibles; debe producir diagnostico visible, no cero.
 */
export type EstadoDeduccionAutonomica =
  | "catalogada"
  | "normalizada_pendiente_tests"
  | "implementada"
  | "no_soportada"

export type CuantiaDeduccionAutonomica =
  | {
      readonly tipo: "importe_fijo"
      readonly euros: string
      readonly por: string
    }
  | {
      readonly tipo: "porcentaje"
      readonly porcentaje: string
      readonly base: string
      readonly limiteMaximoEuros?: string
    }
  | {
      readonly tipo: "mixta"
      readonly descripcion: string
    }

export interface FuenteManualDeduccionAutonomica {
  readonly documento: "ManualRenta2025Parte2"
  readonly paginas: ReadonlyArray<number>
}

export type FichaDeduccionAutonomica = {
  readonly codigo: string
  readonly comunidad: string
  readonly nombre: string
  readonly normativa: string
  readonly categoria: CategoriaDeduccionAutonomica
  readonly cuantia: CuantiaDeduccionAutonomica
  readonly requisitos: ReadonlyArray<string>
  readonly limites: ReadonlyArray<string>
  readonly prorrateo: ReadonlyArray<string>
  readonly compatibilidades: ReadonlyArray<string>
  readonly incompatibilidades: ReadonlyArray<string>
  readonly entradaNecesaria: ReadonlyArray<string>
  readonly fuenteManual: FuenteManualDeduccionAutonomica
  readonly estado: EstadoDeduccionAutonomica
}

export type DeduccionAutonomicaCatalogada = FichaDeduccionAutonomica

export type CatalogoDeduccionesAutonomicasPorComunidad = {
  readonly comunidad: string
  readonly fuente: string
  readonly deducciones: ReadonlyArray<FichaDeduccionAutonomica>
}

const comunidadDesdeCodigo = (codigo: string): string => {
  if (codigo.startsWith("andalucia_")) return "andalucia"
  if (codigo.startsWith("aragon_")) return "aragon"
  if (codigo.startsWith("asturias_")) return "asturias"
  if (codigo.startsWith("balears_")) return "illes-balears"
  if (codigo.startsWith("canarias_")) return "canarias"
  if (codigo.startsWith("cantabria_")) return "cantabria"
  if (codigo.startsWith("clm_")) return "castilla-la-mancha"
  if (codigo.startsWith("cyl_")) return "castilla-y-leon"
  if (codigo.startsWith("cataluna_")) return "catalunya"
  if (codigo.startsWith("extremadura_")) return "extremadura"
  if (codigo.startsWith("galicia_")) return "galicia"
  if (codigo.startsWith("madrid_")) return "madrid"
  if (codigo.startsWith("murcia_")) return "murcia"
  if (codigo.startsWith("rioja_")) return "la-rioja"
  if (codigo.startsWith("valenciana_")) return "comunitat-valenciana"
  return "simulada-estatal"
}

const pendiente = (
  codigo: string,
  nombre: string,
  categoria: CategoriaDeduccionAutonomica
): FichaDeduccionAutonomica => ({
  codigo,
  comunidad: comunidadDesdeCodigo(codigo),
  nombre,
  normativa: "Pendiente de normalización desde el Manual Renta 2025 Parte 2",
  categoria,
  cuantia: {
    tipo: "mixta",
    descripcion:
      "Ficha catalogada en el manual; cuantía pendiente de normalización ejecutable revisada.",
  },
  requisitos: [],
  limites: [],
  prorrateo: [],
  compatibilidades: [],
  incompatibilidades: [],
  entradaNecesaria: [],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [],
  },
  estado: "catalogada",
})

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
  ],
  limites: [
    "Ver límites de base imponible y requisitos completos en ficha normativa",
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
  ...pendiente(
    "andalucia_familia_monoparental_ascendientes_mayores_75",
    "Para el padre o madre de familia monoparental y, en su caso, con ascendientes mayores de 75 años",
    "circunstancias_personales_familiares"
  ),
  normativa: "Pendiente de completar desde ficha normativa de Andalucía",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "100 euros para padres o madres de familia monoparental; incremento adicional de 100 euros por ascendiente mayor de 75 años que genere derecho al mínimo por ascendientes",
  },
  requisitos: [
    "Ser padre o madre de familia monoparental según la ficha autonómica",
    "El ascendiente mayor de 75 años debe generar derecho al mínimo por ascendientes para aplicar el incremento",
  ],
  limites: ["Normalizar límites de base imponible indicados en la ficha"],
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
    paginas: [],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const MADRID_NACIMIENTO_ADOPCION_2025 = {
  ...pendiente(
    "madrid_nacimiento_adopcion_hijos",
    "Por nacimiento o adopción de hijos",
    "circunstancias_personales_familiares"
  ),
  normativa: "Pendiente de completar desde ficha normativa de Madrid",
  cuantia: {
    tipo: "importe_fijo",
    euros: "721.70",
    por: "hijo nacido o adoptado",
  },
  requisitos: [
    "Nacimiento o adopción de hijo",
    "Aplicable en el año del nacimiento o adopción y en los dos ejercicios siguientes",
  ],
  limites: ["Sujeta a límites de base imponible de la ficha autonómica"],
  prorrateo: ["Prorrateo cuando convivan ambos padres y ambos tengan derecho"],
  entradaNecesaria: [
    "numeroHijosNacidosOAdoptados",
    "ejercicioNacimientoOAdopcion",
    "convivenAmbosProgenitores",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CATALUNYA_ALQUILER_VICTIMAS_VIOLENCIA_MACHISTA_2025 = {
  ...pendiente(
    "cataluna_alquiler_victimas_violencia_machista",
    "Por alquiler de la vivienda habitual de víctimas de violencia machista",
    "vivienda_habitual"
  ),
  normativa: "Pendiente de completar desde ficha normativa de Cataluña",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "20% de las cantidades pagadas con máximo de 1.000 euros; 25% con máximo de 1.200 euros si hay discapacidad igual o superior al 65% o hijo menor a cargo",
  },
  requisitos: [
    "Alquiler de vivienda habitual",
    "Condición de víctima de violencia machista según la ficha autonómica",
    "Para el tramo incrementado, discapacidad igual o superior al 65% o hijo menor a cargo",
  ],
  limites: ["Sujeta a requisitos y límites de la ficha autonómica"],
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
    paginas: [],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CATALUNYA_INVERSION_COOPERATIVAS_AGRARIAS_VIVIENDA_2025 = {
  ...pendiente(
    "cataluna_inversion_cooperativas_agrarias_vivienda",
    "Por inversión en sociedades cooperativas agrarias y de vivienda",
    "otros_conceptos"
  ),
  normativa: "Pendiente de completar desde ficha normativa de Cataluña",
  cuantia: {
    tipo: "porcentaje",
    porcentaje: "20",
    base: "aportaciones de capital",
    limiteMaximoEuros: "3000",
  },
  requisitos: [
    "Aportaciones de capital a sociedades cooperativas agrarias o de vivienda",
    "Cumplimiento de los requisitos específicos de la ficha autonómica",
  ],
  limites: ["Límite máximo de 3.000 euros anuales por contribuyente"],
  prorrateo: [],
  entradaNecesaria: [
    "importeAportacionesCapital",
    "tipoCooperativa",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

/**
 * Catálogo reconocido de deducciones autonómicas del IRPF 2025.
 *
 * Importante:
 * - Este catálogo NO significa que todas las deducciones estén implementadas.
 * - La recopilación inicial procede de un agente auxiliar y puede contener
 *   omisiones o errores de normalización; se usa como índice operativo revisable,
 *   no como fuente normativa definitiva.
 * - Las fórmulas, límites, incompatibilidades, prorrateos y requisitos se deben
 *   implementar una a una con tests antes de pasar a
 *   DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.
 */
export const CATALOGO_DEDUCCIONES_AUTONOMICAS_2025 = parametroNormativo({
  nombre: "Catálogo reconocido de deducciones autonómicas",
  fuente: fuenteAeatDeduccionesAutonomicas2025,
  valor: {
    andalucia: {
      comunidad: "Andalucía",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 2 y 15",
      deducciones: [
        pendiente(
          "andalucia_inversion_vivienda_habitual_protegida_jovenes",
          "Por inversión en vivienda habitual que tenga la consideración de protegida y por las personas jóvenes",
          "vivienda_habitual"
        ),
        pendiente(
          "andalucia_alquiler_vivienda_habitual",
          "Por cantidades invertidas en el alquiler de la vivienda habitual",
          "vivienda_habitual"
        ),
        ANDALUCIA_NACIMIENTO_ADOPCION_ACOGIMIENTO_2025,
        ANDALUCIA_FAMILIA_MONOPARENTAL_ASCENDIENTES_MAYORES_75_2025,
        pendiente(
          "andalucia_familia_numerosa",
          "Para familia numerosa",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "andalucia_contribuyente_discapacidad",
          "Para contribuyentes con discapacidad",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    aragon: {
      comunidad: "Aragón",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 2, 3 y 16",
      deducciones: [
        pendiente(
          "aragon_nacimiento_adopcion_tercer_hijo_sucesivos",
          "Por nacimiento o adopción del tercer hijo o sucesivos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "aragon_cuidado_personas_dependientes",
          "Por el cuidado de personas dependientes",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "aragon_mayores_70",
          "Para mayores de 70 años",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "aragon_guarderia_menores_3",
          "Por gastos de guardería de hijos menores de 3 años",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    asturias: {
      comunidad: "Principado de Asturias",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 3 y 17",
      deducciones: [
        pendiente(
          "asturias_acogimiento_no_remunerado_mayores_65",
          "Por acogimiento no remunerado de mayores de 65 años",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "asturias_arrendamiento_vivienda_habitual",
          "Por arrendamiento de vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "asturias_familias_numerosas",
          "Para familias numerosas",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "asturias_centros_cero_tres",
          "Por gastos de descendientes en centros de cero a tres años",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    "illes-balears": {
      comunidad: "Illes Balears",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 3, 4, 18 y 19",
      deducciones: [
        pendiente(
          "balears_arrendamiento_vivienda_habitual",
          "Por arrendamiento de la vivienda habitual en el territorio de las Illes Balears",
          "vivienda_habitual"
        ),
        pendiente(
          "balears_libros_texto",
          "Por gastos de adquisición de libros de texto",
          "otros_conceptos"
        ),
        pendiente(
          "balears_nacimiento",
          "Por nacimiento",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "balears_gastos_mayores_65_discapacidad",
          "Por determinados gastos relativos a personas mayores de 65 años o a personas con discapacidad",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    canarias: {
      comunidad: "Canarias",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 4, 5 y 20",
      deducciones: [
        pendiente(
          "canarias_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "canarias_discapacidad_mayores_65",
          "Por contribuyentes con discapacidad y mayores de 65 años",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "canarias_alquiler_vivienda_habitual",
          "Por alquiler de vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "canarias_gasto_enfermedad",
          "Por gasto de enfermedad",
          "otros_conceptos"
        ),
      ],
    },
    cantabria: {
      comunidad: "Cantabria",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 5, 6 y 21",
      deducciones: [
        pendiente(
          "cantabria_arrendamiento_jovenes_mayores_discapacidad",
          "Por arrendamiento de vivienda habitual por jóvenes, mayores y personas con discapacidad",
          "vivienda_habitual"
        ),
        pendiente(
          "cantabria_cuidado_familiares",
          "Por cuidado de familiares",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "cantabria_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    "castilla-la-mancha": {
      comunidad: "Castilla-La Mancha",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 6, 7 y 22",
      deducciones: [
        pendiente(
          "clm_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "clm_familia_numerosa",
          "Por familia numerosa",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "clm_mayores_75",
          "Para contribuyentes mayores de 75 años",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    "castilla-y-leon": {
      comunidad: "Castilla y León",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 7 y 23",
      deducciones: [
        pendiente(
          "cyl_familia_numerosa",
          "Por familia numerosa",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "cyl_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "cyl_arrendamiento_vivienda_jovenes",
          "Por arrendamiento de vivienda habitual por jóvenes",
          "vivienda_habitual"
        ),
      ],
    },
    catalunya: {
      comunidad: "Catalunya",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 7, 8 y 24",
      deducciones: [
        pendiente(
          "cataluna_nacimiento_adopcion_acogimiento",
          "Por nacimiento o adopción de un hijo o de una hija o por acogimiento familiar",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "cataluna_alquiler_vivienda_habitual",
          "Por alquiler de la vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "cataluna_obligacion_declarar_mas_de_un_pagador",
          "Por obligación de presentar la declaración del IRPF por razón de tener más de un pagador",
          "otros_conceptos"
        ),
        CATALUNYA_ALQUILER_VICTIMAS_VIOLENCIA_MACHISTA_2025,
        CATALUNYA_INVERSION_COOPERATIVAS_AGRARIAS_VIVIENDA_2025,
      ],
    },
    extremadura: {
      comunidad: "Extremadura",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 8 y 25",
      deducciones: [
        pendiente(
          "extremadura_trabajo_dependiente",
          "Por trabajo dependiente",
          "otros_conceptos"
        ),
        pendiente(
          "extremadura_cuidado_familiares_discapacidad",
          "Por cuidado de familiares con discapacidad",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "extremadura_arrendamiento_vivienda_habitual",
          "Por arrendamiento de vivienda habitual",
          "vivienda_habitual"
        ),
      ],
    },
    galicia: {
      comunidad: "Galicia",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 8, 9, 26 y 27",
      deducciones: [
        pendiente(
          "galicia_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "galicia_familia_numerosa",
          "Por familia numerosa",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "galicia_alquiler_vivienda_habitual",
          "Por alquiler de la vivienda habitual",
          "vivienda_habitual"
        ),
      ],
    },
    madrid: {
      comunidad: "Comunidad de Madrid",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 9, 10 y 28",
      deducciones: [
        MADRID_NACIMIENTO_ADOPCION_2025,
        pendiente(
          "madrid_arrendamiento_vivienda_habitual",
          "Por arrendamiento de la vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "madrid_gastos_educativos",
          "Por gastos educativos",
          "otros_conceptos"
        ),
      ],
    },
    murcia: {
      comunidad: "Región de Murcia",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 10, 11, 29 y 30",
      deducciones: [
        pendiente(
          "murcia_gastos_guarderia",
          "Por gastos de guardería",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "murcia_arrendamiento_vivienda_habitual",
          "Por arrendamiento de vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "murcia_gastos_veterinarios",
          "Por gastos veterinarios",
          "otros_conceptos"
        ),
      ],
    },
    "la-rioja": {
      comunidad: "La Rioja",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 11, 12, 31 y 32",
      deducciones: [
        pendiente(
          "rioja_nacimiento_adopcion_hijos",
          "Por nacimiento y adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "rioja_arrendamiento_menores_36",
          "Por arrendamiento de vivienda habitual para contribuyentes menores de 36 años",
          "vivienda_habitual"
        ),
        pendiente(
          "rioja_enfermedad_celiaca",
          "Por enfermedad celíaca diagnosticada",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    "comunitat-valenciana": {
      comunidad: "Comunitat Valenciana",
      fuente:
        "Manual práctico de Renta 2025 Parte 2, páginas 12, 13, 33, 34, 621 y 624",
      deducciones: [
        pendiente(
          "valenciana_nacimiento_adopcion_guarda_acogimiento",
          "Por nacimiento, adopción, delegación de guarda con fines de adopción o acogimiento familiar",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "valenciana_ascendientes_mayores_discapacidad",
          "Por ascendientes mayores de 75 años o mayores de 65 años con discapacidad",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "valenciana_arrendamiento_cesion_uso_vivienda",
          "Por arrendamiento o pago por la cesión en uso de la vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "valenciana_deporte_actividades_saludables",
          "Por cantidades satisfechas en gastos asociados a la práctica del deporte y actividades saludables",
          "otros_conceptos"
        ),
      ],
    },
    ceuta: {
      comunidad: "Ceuta",
      fuente: "Manual práctico de Renta 2025 Parte 2",
      deducciones: [],
    },
    melilla: {
      comunidad: "Melilla",
      fuente: "Manual práctico de Renta 2025 Parte 2",
      deducciones: [],
    },
  } satisfies Partial<
    Record<string, CatalogoDeduccionesAutonomicasPorComunidad>
  >,
})

export const DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS = parametroNormativo({
  nombre: "Deducciones autonómicas implementadas",
  valor: [
    ANDALUCIA_NACIMIENTO_ADOPCION_ACOGIMIENTO_2025,
    ANDALUCIA_FAMILIA_MONOPARENTAL_ASCENDIENTES_MAYORES_75_2025,
    MADRID_NACIMIENTO_ADOPCION_2025,
    CATALUNYA_ALQUILER_VICTIMAS_VIOLENCIA_MACHISTA_2025,
    CATALUNYA_INVERSION_COOPERATIVAS_AGRARIAS_VIVIENDA_2025,
  ],
  fuente: fuenteAeatDeduccionesAutonomicas2025,
})

export const obtenerDeduccionAutonomicaCatalogada = (
  codigo: string
): DeduccionAutonomicaCatalogada | null => {
  for (const comunidad of Object.values(
    CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor
  )) {
    const deduccion = comunidad.deducciones.find(
      (candidata) => candidata.codigo === codigo
    )
    if (deduccion) {
      return deduccion
    }
  }

  return null
}
