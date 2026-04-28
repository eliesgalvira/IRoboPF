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

const implementada = (
  codigo: string,
  nombre: string,
  categoria: CategoriaDeduccionAutonomica,
  cuantia: CuantiaDeduccionAutonomica,
  limites: ReadonlyArray<string>,
  paginas: ReadonlyArray<number>,
  entradaNecesaria: ReadonlyArray<string> = [
    "importeBase",
    "cumpleRequisitosYLimites",
  ],
  requisitos: ReadonlyArray<string> = [
    "Cumplir los requisitos indicados en la ficha normativa normalizada",
  ]
): FichaDeduccionAutonomica => ({
  ...pendiente(codigo, nombre, categoria),
  normativa: "Ficha normalizada desde Manual Renta 2025 Parte 2",
  cuantia,
  requisitos,
  limites,
  entradaNecesaria,
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas,
  },
  estado: "implementada",
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
    "Si son dos los contribuyentes con derecho, el importe se distribuye por partes iguales",
    "En acogimiento, no puede haber recibido ayudas de la Administracion de Andalucia vinculadas con el acogimiento",
  ],
  limites: [
    "200 euros por hijo nacido/adoptado o menor acogido",
    "400 euros por hijo nacido/adoptado o menor acogido si reside en municipio andaluz con problemas de despoblacion",
    "Incremento de 200 euros por cada hijo o menor en partos, adopciones o acogimientos multiples",
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
  limites: [
    "100 euros por padre o madre de familia monoparental",
    "Incremento de 100 euros por cada ascendiente mayor de 75 anios que conviva y genere derecho al minimo por ascendientes",
    "Base imponible general + base imponible del ahorro: maximo 80.000 euros en tributacion individual",
    "Base imponible general + base imponible del ahorro: maximo 100.000 euros en tributacion conjunta",
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
    "Solo tienen derecho los padres que convivan con los hijos nacidos o adoptados",
  ],
  limites: [
    "721,70 euros por cada hijo nacido o adoptado desde el 1 de enero de 2023",
    "600 euros por cada hijo nacido o adoptado antes del 1 de enero de 2023",
    "En partos o adopciones multiples, incremento de 721,70 euros por cada hijo en el primer periodo impositivo",
    "Si conviven ambos padres y tributan individualmente, prorrateo por partes iguales",
    "Base imponible general + base imponible del ahorro del contribuyente: maximo 30.930 euros en tributacion individual",
    "Base imponible general + base imponible del ahorro del contribuyente: maximo 37.322,20 euros en tributacion conjunta",
    "Base imponible general + base imponible del ahorro de la unidad familiar: maximo 61.860 euros",
    "Los limites de bases deben cumplirse en el anio de nacimiento/adopcion y en cada uno de los dos ejercicios siguientes",
  ],
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
    "La contribuyente debe figurar como titular del contrato de alquiler",
  ],
  limites: [
    "20% de las cantidades satisfechas por alquiler de vivienda habitual, con maximo de 1.000 euros anuales",
    "25% de las cantidades satisfechas, con maximo de 1.200 euros anuales, si la contribuyente tiene discapacidad igual o superior al 65% o hijo menor a cargo",
    "Base imponible general + base imponible del ahorro - minimo personal y familiar: maximo 30.000 euros anuales",
    "Una misma vivienda no puede dar lugar a una deduccion superior a 1.000 euros, o 1.200 euros en el tramo incrementado",
    "Aplicable como maximo durante tres ejercicios consecutivos",
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
    "Ser socio de cualquier tipo previsto en la Ley 12/2015 de cooperativas, excepto socio temporal",
    "El total de voto de la persona socia no puede superar el 25% de los votos sociales",
    "La cooperativa debe estar inscrita como cooperativa agraria o cooperativa de vivienda",
    "No aplica a cooperativas de vivienda para uso turistico o de corta duracion",
    "Debe disponerse de certificacion de la cooperativa que acredite el cumplimiento de los requisitos",
    "Las aportaciones deben mantenerse durante un minimo de 5 anios",
  ],
  limites: [
    "20% de las aportaciones de capital obligatorias o voluntarias efectivamente desembolsadas",
    "Limite maximo de 3.000 euros anuales por contribuyente",
    "Si no hay cuota integra autonomica suficiente, el importe no deducido puede compensarse en ejercicios futuros",
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
    paginas: [],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_ADOPCION_INTERNACIONAL_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_FAMILIA_NUMEROSA_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_CONTRIBUYENTE_DISCAPACIDAD_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_CONYUGE_PAREJA_DISCAPACIDAD_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_ASISTENCIA_PERSONAS_DISCAPACIDAD_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_AYUDA_DOMESTICA_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_INVERSION_ACCIONES_PARTICIPACIONES_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ARAGON_NACIMIENTO_ADOPCION_TERCER_HIJO_SUCESIVOS_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ARAGON_CUIDADO_PERSONAS_DEPENDIENTES_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ARAGON_MAYORES_70_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_NACIMIENTO_ADOPCION_2025 = {
  ...pendiente(
    "canarias_nacimiento_adopcion_hijos",
    "Por nacimiento o adopción de hijos",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 10 Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "265 euros por primer o segundo hijo; 530 euros por tercero; 796 euros por cuarto; 928 euros por quinto o sucesivos. Incremento adicional por discapacidad igual o superior al 65%",
  },
  requisitos: [
    "Hijo nacido o adoptado durante el período impositivo",
    "El hijo debe convivir con el contribuyente",
    "Para el incremento por discapacidad, discapacidad física, psíquica o sensorial igual o superior al 65% y convivencia ininterrumpida desde nacimiento/adopción hasta final del período",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "265 euros si se trata del primero o segundo hijo",
    "530 euros si se trata del tercero",
    "796 euros si se trata del cuarto",
    "928 euros si se trata del quinto o sucesivos",
    "Incremento adicional por discapacidad: 600 euros si es primer o segundo hijo con discapacidad",
    "Incremento adicional por discapacidad: 1.100 euros si es tercer o posterior hijo con discapacidad y sobreviven los anteriores hijos con discapacidad",
    "Base imponible general + base imponible del ahorro: máximo 46.455 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 61.770 euros en tributación conjunta",
  ],
  prorrateo: [
    "Si ambos progenitores o adoptantes tienen derecho y no optan por conjunta, se prorratea por partes iguales",
  ],
  compatibilidades: [
    "Compatible con la deducción autonómica canaria por familia numerosa",
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "ordenHijoNacidoOAdoptado",
    "numeroHijosNacidosOAdoptados",
    "discapacidadHijo65",
    "convivenciaIninterrumpidaHijo",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "numeroProgenitoresConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [181, 182],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_DISCAPACIDAD_MAYORES_65_2025 = {
  ...pendiente(
    "canarias_discapacidad_mayores_65",
    "Por contribuyentes con discapacidad y mayores de 65 años",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 11 Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "400 euros por contribuyente con discapacidad igual o superior al 33%; 160 euros por contribuyente mayor de 65 años. Ambas cuantías son compatibles entre sí",
  },
  requisitos: [
    "Discapacidad igual o superior al 33% para la cuantía por discapacidad",
    "Edad superior a 65 años para la cuantía por edad",
    "Circunstancias personales a fecha de devengo del impuesto",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "400 euros por discapacidad igual o superior al 33%",
    "160 euros por contribuyente mayor de 65 años",
    "Base imponible general + base imponible del ahorro: máximo 46.455 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 61.770 euros en tributación conjunta",
  ],
  prorrateo: [],
  compatibilidades: [
    "La cuantía por discapacidad y la cuantía por edad son compatibles entre sí",
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "edadContribuyente",
    "gradoDiscapacidadContribuyente",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [183],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_FAMILIA_NUMEROSA_2025 = {
  ...pendiente(
    "canarias_familia_numerosa",
    "Por familia numerosa",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 13 Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "597 euros para familia numerosa general; 796 euros para especial. Si cónyuge o descendiente con mínimo tiene discapacidad igual o superior al 65%, 1.326 euros general y 1.459 euros especial",
  },
  requisitos: [
    "Título de familia numerosa a fecha de devengo del impuesto",
    "Clasificación según la Ley 40/2003 de protección a las familias numerosas",
    "Título expedido por órgano competente",
  ],
  limites: [
    "597 euros para familia numerosa de categoría general",
    "796 euros para familia numerosa de categoría especial",
    "1.326 euros para categoría general si cónyuge o descendiente con derecho al mínimo tiene discapacidad igual o superior al 65%",
    "1.459 euros para categoría especial si cónyuge o descendiente con derecho al mínimo tiene discapacidad igual o superior al 65%",
  ],
  prorrateo: [
    "Se aplica por el contribuyente con quien conviva el resto de miembros de la familia numerosa",
    "Si conviven con más de un contribuyente, se prorratea por partes iguales",
  ],
  compatibilidades: [
    "Compatible con la deducción canaria por nacimiento o adopción de hijos",
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "categoriaFamiliaNumerosa",
    "conyugeODependienteDiscapacidad65",
    "numeroContribuyentesConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [186, 187],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_CONTRIBUYENTES_DESEMPLEADOS_2025 = {
  ...pendiente(
    "canarias_contribuyentes_desempleados",
    "Por contribuyentes desempleados",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 16 bis Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "importe_fijo",
    euros: "120",
    por: "contribuyente desempleado",
  },
  requisitos: [
    "Percibir prestaciones de desempleo",
    "Estar en situación de desempleo durante más de seis meses del período impositivo",
    "Rendimientos íntegros del trabajo superiores a 15.876 euros e iguales o inferiores a 22.000 euros",
    "Base imponible general + ahorro excluida la parte correspondiente a rendimientos del trabajo no superior a 1.600 euros",
  ],
  limites: [
    "120 euros por contribuyente que cumpla los requisitos",
    "En tributación conjunta pueden beneficiarse todos los miembros de la unidad familiar que cumplan la situación de desempleo",
  ],
  prorrateo: [],
  incompatibilidades: [],
  entradaNecesaria: [
    "percibePrestacionDesempleo",
    "mesesDesempleo",
    "rendimientosIntegroTrabajo",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "rendimientoTrabajoCasilla0025",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [200, 201],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CLM_NACIMIENTO_ADOPCION_2025 = {
  ...pendiente(
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
    "Hijo nacido o adoptado durante el período impositivo",
    "Debe generar derecho al mínimo por descendientes",
    "La cuantía depende del número de hijos en cada parto o adopción, no del número total de nacimientos del ejercicio",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "100 euros en caso de partos o adopciones de un hijo",
    "500 euros en caso de partos o adopciones de dos hijos",
    "900 euros en caso de partos o adopciones de tres o más hijos",
    "Base imponible general + base imponible del ahorro: máximo 27.000 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 36.000 euros en tributación conjunta",
  ],
  prorrateo: [
    "Aplicar normas del mínimo por descendientes",
    "Si dos o más contribuyentes tienen derecho y alguno no cumple límites, reducir según prorrateo del mínimo por descendientes",
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
    paginas: [238],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CLM_FAMILIA_NUMEROSA_2025 = {
  ...pendiente(
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
    "Condición de familia numerosa reconocida a fecha de devengo",
    "Título oficial de familia numerosa",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "200 euros para familia numerosa de categoría general",
    "400 euros para familia numerosa de categoría especial",
    "300 euros para categoría general si cónyuge o descendiente con derecho al mínimo tiene discapacidad igual o superior al 65%",
    "900 euros para categoría especial si cónyuge o descendiente con derecho al mínimo tiene discapacidad igual o superior al 65%",
    "Base imponible general + base imponible del ahorro: máximo 27.000 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 36.000 euros en tributación conjunta",
  ],
  prorrateo: [
    "Aplicar normas del mínimo por descendientes y discapacidad",
    "Si dos o más contribuyentes tienen derecho y alguno no cumple límites, reducir según prorrateo del mínimo por descendientes",
  ],
  incompatibilidades: [
    "Incompatible con la deducción castellano-manchega por arrendamiento de vivienda habitual por familias numerosas",
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
    paginas: [239, 240],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CLM_DISCAPACIDAD_CONTRIBUYENTE_2025 = {
  ...pendiente(
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
    "Contribuyente con discapacidad acreditada igual o superior al 65%",
    "Derecho a la aplicación del mínimo por discapacidad del contribuyente",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "300 euros por contribuyente que cumpla los requisitos",
    "Base imponible general + base imponible del ahorro: máximo 27.000 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 36.000 euros en tributación conjunta",
  ],
  prorrateo: [],
  incompatibilidades: [
    "Incompatible con la deducción por discapacidad de ascendientes o descendientes respecto de la misma persona",
    "Incompatible con la deducción para contribuyentes mayores de 75 años respecto de la misma persona",
    "Incompatible con la deducción por arrendamiento de vivienda habitual por personas con discapacidad",
  ],
  entradaNecesaria: [
    "gradoDiscapacidadContribuyente",
    "derechoMinimoDiscapacidadContribuyente",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [246, 247],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CLM_DISCAPACIDAD_ASCENDIENTES_DESCENDIENTES_2025 = {
  ...pendiente(
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
    "Ascendiente o descendiente con discapacidad acreditada igual o superior al 65%",
    "Debe generar derecho al mínimo por discapacidad de ascendientes o descendientes",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "300 euros por cada ascendiente o descendiente que cumpla los requisitos",
    "Base imponible general + base imponible del ahorro: máximo 27.000 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 36.000 euros en tributación conjunta",
  ],
  prorrateo: [
    "Aplicar normas del mínimo por ascendientes, descendientes y discapacidad",
    "Si dos o más contribuyentes tienen derecho y alguno no cumple límites, reducir según prorrateo del mínimo correspondiente",
  ],
  incompatibilidades: [
    "Incompatible con la deducción por discapacidad del contribuyente respecto de una misma persona",
    "Incompatible con la deducción por cuidado de ascendientes mayores de 75 años respecto de la misma persona mayor de 75 años",
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
    paginas: [247, 248],
  },
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CATALUNYA_VIUDEDAD_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CATALUNYA_REHABILITACION_VIVIENDA_HABITUAL_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const CATALUNYA_INTERESES_PRESTAMOS_MASTER_DOCTORADO_2025 = {
  ...pendiente(
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
  estado: "implementada",
} as const satisfies FichaDeduccionAutonomica

export const ANDALUCIA_INVERSION_VIVIENDA_HABITUAL_PROTEGIDA_JOVENES_2025 =
  implementada(
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

export const ANDALUCIA_ALQUILER_VIVIENDA_HABITUAL_2025 = implementada(
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

export const ARAGON_GUARDERIA_MENORES_3_2025 = implementada(
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

export const ASTURIAS_ACOGIMIENTO_MAYORES_65_2025 = implementada(
  "asturias_acogimiento_no_remunerado_mayores_65",
  "Por acogimiento no remunerado de mayores de 65 años",
  "circunstancias_personales_familiares",
  { tipo: "importe_fijo", euros: "500", por: "persona mayor de 65 años acogida" },
  [
    "500 euros por persona acogida",
    "Base imponible general + ahorro: máximo 26.000 euros individual y 37.000 conjunta",
  ],
  [89, 90]
)

export const ASTURIAS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = implementada(
  "asturias_arrendamiento_vivienda_habitual",
  "Por arrendamiento de vivienda habitual",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "10% con límite 500 euros; 30% con límite 1.500 euros para colectivos protegidos o concejos en riesgo",
  },
  [
    "General: 10%, máximo 500 euros",
    "Jóvenes hasta 35, familias numerosas, monoparentales, víctimas de violencia de género o despoblamiento: 30%, máximo 1.500 euros",
    "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta",
  ],
  [93, 94]
)

export const ASTURIAS_FAMILIAS_NUMEROSAS_2025 = implementada(
  "asturias_familias_numerosas",
  "Para familias numerosas",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion: "1.000 euros categoría general; 2.000 euros categoría especial",
  },
  [
    "1.000 euros para categoría general",
    "2.000 euros para categoría especial",
  ],
  [96, 97]
)

export const ASTURIAS_CENTROS_CERO_TRES_2025 = implementada(
  "asturias_centros_cero_tres",
  "Por gastos de descendientes en centros de cero a tres años",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "15% con límite 500 euros por descendiente; 30% con límite 1.000 euros en concejos en riesgo",
  },
  [
    "General: 15%, máximo 500 euros por descendiente",
    "Despoblamiento: 30%, máximo 1.000 euros por descendiente",
    "General: base imponible general + ahorro máximo 26.000 euros individual y 37.000 conjunta",
    "Despoblamiento: máximo 35.000 euros individual y 45.000 conjunta",
  ],
  [100, 101, 102]
)

export const BALEARS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = implementada(
  "balears_arrendamiento_vivienda_habitual",
  "Por arrendamiento de la vivienda habitual en el territorio de las Illes Balears",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "15% límite 530 euros; 20% límite 650 euros para colectivos cualificados",
  },
  [
    "15%, límite 530 euros: menores de 36 o mayores de 65 sin actividad",
    "20%, límite 650 euros: menores de 30, discapacidad, familia numerosa/monoparental o autónomos",
    "Límite base general: 33.000 euros individual y 52.800 conjunta",
  ],
  [132, 133, 134]
)

export const BALEARS_LIBROS_TEXTO_2025 = implementada(
  "balears_libros_texto",
  "Por gastos de adquisición de libros de texto",
  "otros_conceptos",
  {
    tipo: "mixta",
    descripcion:
      "100% de importes destinados a libros de texto, límite 220 euros por hijo o 350 euros con límite incrementado",
  },
  [
    "100% del gasto en libros de texto",
    "Límite general: 220 euros por hijo",
    "Límite incrementado: 350 euros por hijo",
  ],
  [135, 136, 137]
)

export const BALEARS_NACIMIENTO_2025 = implementada(
  "balears_nacimiento",
  "Por nacimiento",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "800 euros primer hijo, 1.000 segundo, 1.200 tercero y 1.400 cuarto y siguientes; 50% si supera límites",
  },
  [
    "800 euros primer hijo",
    "1.000 euros segundo hijo",
    "1.200 euros tercer hijo",
    "1.400 euros cuarto y siguientes",
    "Si se superan límites de renta, puede aplicarse el 50%",
  ],
  [154, 155]
)

export const BALEARS_GASTOS_MAYORES_65_DISCAPACIDAD_2025 = implementada(
  "balears_gastos_mayores_65_discapacidad",
  "Por determinados gastos relativos a personas mayores de 65 años o a personas con discapacidad",
  "circunstancias_personales_familiares",
  {
    tipo: "porcentaje",
    porcentaje: "40",
    base: "gastos por servicios de residencia, centros de día, comedor, custodia o contratación de cuidador",
    limiteMaximoEuros: "660",
  },
  [
    "40% de los gastos satisfechos",
    "Máximo 660 euros anuales por persona que genere derecho",
    "Base imponible general + ahorro máximo 33.000 euros individual y 52.800 conjunta",
  ],
  [159, 160]
)

export const CANARIAS_ALQUILER_VIVIENDA_HABITUAL_2025 = implementada(
  "canarias_alquiler_vivienda_habitual",
  "Por alquiler de vivienda habitual",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "24% del alquiler; límite 740 euros, o 760 euros si menor de 40 o mayor de 75",
  },
  [
    "24% de cantidades satisfechas",
    "Límite general: 740 euros",
    "Límite incrementado: 760 euros",
    "Base imponible general + ahorro máximo 46.455 euros individual y 61.770 conjunta",
  ],
  [193, 194]
)

export const CANARIAS_GASTO_ENFERMEDAD_2025 = implementada(
  "canarias_gasto_enfermedad",
  "Por gasto de enfermedad",
  "otros_conceptos",
  {
    tipo: "mixta",
    descripcion:
      "12% de gastos médicos/sanitarios y aparatos; límite 500/700 euros, incremento 100 euros, o límite 150 euros si supera umbral",
  },
  [
    "12% de gastos deducibles",
    "Límite 500 euros individual y 700 euros conjunta si cumple umbral de bases",
    "Incremento 100 euros por mayor de 65 o discapacidad igual/superior al 65%",
    "Si se superan umbrales de base: límite 150 euros por contribuyente",
  ],
  [201, 202]
)

export const CANTABRIA_ARRENDAMIENTO_JOVENES_MAYORES_DISCAPACIDAD_2025 =
  implementada(
    "cantabria_arrendamiento_jovenes_mayores_discapacidad",
    "Por arrendamiento de vivienda habitual por jóvenes, mayores y personas con discapacidad",
    "vivienda_habitual",
    {
      tipo: "porcentaje",
      porcentaje: "10",
      base: "cantidades satisfechas por arrendamiento de vivienda habitual",
      limiteMaximoEuros: "300",
    },
    [
      "10% de cantidades satisfechas",
      "Límite 300 euros en tributación individual",
      "Límite 600 euros en tributación conjunta",
    ],
    [207, 208]
  )

export const CANTABRIA_CUIDADO_FAMILIARES_2025 = implementada(
  "cantabria_cuidado_familiares",
  "Por cuidado de familiares",
  "circunstancias_personales_familiares",
  { tipo: "importe_fijo", euros: "100", por: "familiar que cumpla requisitos" },
  [
    "100 euros por familiar",
    "Un menor de 3 años con discapacidad igual o superior al 65% puede generar doble derecho según la ficha",
    "Base liquidable general + ahorro minorada por mínimo personal y familiar inferior a 31.485 euros",
  ],
  [208, 209]
)

export const CANTABRIA_NACIMIENTO_ADOPCION_HIJOS_2025 = implementada(
  "cantabria_nacimiento_adopcion_hijos",
  "Por nacimiento o adopción de hijos",
  "circunstancias_personales_familiares",
  { tipo: "importe_fijo", euros: "1400", por: "hijo nacido o adoptado" },
  [
    "1.400 euros por nacimiento o adopción",
    "Aplicable en el ejercicio del nacimiento o adopción y en los dos ejercicios siguientes",
  ],
  [219, 220]
)

export const CLM_MAYORES_75_2025 = implementada(
  "clm_mayores_75",
  "Para contribuyentes mayores de 75 años",
  "circunstancias_personales_familiares",
  { tipo: "importe_fijo", euros: "150", por: "contribuyente mayor de 75 años" },
  [
    "150 euros por contribuyente mayor de 75 años",
    "Base imponible general + ahorro máximo 27.000 euros individual y 36.000 conjunta",
  ],
  [248, 249]
)

export const CYL_FAMILIA_NUMEROSA_2025 = implementada(
  "cyl_familia_numerosa",
  "Por familia numerosa",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "600 euros general; 1.500 con cuatro descendientes; 2.500 con cinco; +1.000 por sexto y sucesivos; +600 por discapacidad",
  },
  [
    "600 euros con carácter general",
    "1.500 euros con cuatro descendientes con mínimo",
    "2.500 euros con cinco descendientes con mínimo",
    "Incremento de 1.000 euros por cada descendiente a partir del sexto",
    "Incremento de 600 euros por discapacidad igual o superior al 65%",
  ],
  [282, 283]
)

export const CYL_NACIMIENTO_ADOPCION_HIJOS_2025 = implementada(
  "cyl_nacimiento_adopcion_hijos",
  "Por nacimiento o adopción de hijos",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "General: 1.010/1.475/2.351 euros según orden. Medio rural: 1.420/2.070/3.300 euros. Se duplica por discapacidad ≥33%",
  },
  [
    "General: 1.010 euros primer hijo, 1.475 segundo, 2.351 tercero y sucesivos",
    "Medio rural: 1.420 euros primer hijo, 2.070 segundo, 3.300 tercero y sucesivos",
    "Duplicación si discapacidad del nacido/adoptado igual o superior al 33%",
  ],
  [283, 284]
)

export const CYL_ARRENDAMIENTO_VIVIENDA_JOVENES_2025 = implementada(
  "cyl_arrendamiento_vivienda_jovenes",
  "Por arrendamiento de vivienda habitual por jóvenes",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "20% del alquiler, límite 459 euros; 25%, límite 612 euros, en municipio o entidad local menor con población reducida",
  },
  [
    "20%, límite 459 euros",
    "25%, límite 612 euros en municipios o entidades locales menores de población reducida",
    "Base imponible general + ahorro - mínimo personal y familiar máximo 18.900 euros individual y 31.500 conjunta",
  ],
  [302, 303]
)

export const CATALUNYA_NACIMIENTO_ADOPCION_ACOGIMIENTO_2025 = implementada(
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

export const CATALUNYA_ALQUILER_VIVIENDA_HABITUAL_2025 = implementada(
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
  implementada(
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

export const EXTREMADURA_TRABAJO_DEPENDIENTE_2025 = implementada(
  "extremadura_trabajo_dependiente",
  "Por trabajo dependiente",
  "otros_conceptos",
  {
    tipo: "importe_fijo",
    euros: "75",
    por: "contribuyente con trabajo dependiente",
  },
  ["75 euros por contribuyente"],
  [330]
)

export const EXTREMADURA_CUIDADO_FAMILIARES_DISCAPACIDAD_2025 = implementada(
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
  [333, 334, 335]
)

export const EXTREMADURA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = implementada(
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
  [342, 343, 344]
)

export const GALICIA_NACIMIENTO_ADOPCION_HIJOS_2025 = implementada(
  "galicia_nacimiento_adopcion_hijos",
  "Por nacimiento o adopción de hijos",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "Cuantías por orden y base: 360/1.200/2.400 euros o 300/360 euros; incremento 20% en municipios pequeños; duplicación por discapacidad ≥33%",
  },
  [
    "Hasta 22.000 euros de base: 360 euros primer hijo, 1.200 segundo, 2.400 tercero y sucesivos",
    "Desde 22.000,01 euros en año de nacimiento: 300 euros por hijo o 360 en parto múltiple",
    "Incremento del 20% en municipios de menos de 5.000 habitantes o fusionados/incorporados",
    "Duplicación si discapacidad del nacido/adoptado igual o superior al 33%",
  ],
  [364, 365]
)

export const GALICIA_FAMILIA_NUMEROSA_2025 = implementada(
  "galicia_familia_numerosa",
  "Por familia numerosa",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "250 euros hasta dos hijos; 400 euros categoría especial hasta dos hijos; +250 euros por hijo a partir de más de dos; cuantías duplicadas por discapacidad ≥65%",
  },
  [
    "250 euros hasta dos hijos",
    "400 euros hasta dos hijos con categoría especial",
    "Incremento 250 euros por cada hijo en familias numerosas de más de dos hijos",
    "Cuantías duplicadas si contribuyente o descendiente tiene discapacidad igual o superior al 65%",
  ],
  [367, 368]
)

export const GALICIA_ALQUILER_VIVIENDA_HABITUAL_2025 = implementada(
  "galicia_alquiler_vivienda_habitual",
  "Por alquiler de la vivienda habitual",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "10% límite 300 euros; 20% límite 600 euros si dos o más hijos menores. Cuantías duplicadas por discapacidad ≥33%",
  },
  [
    "10%, límite 300 euros por contrato y año",
    "20%, límite 600 euros si dos o más hijos menores de edad",
    "Duplicación de cuantías si arrendatario con discapacidad igual o superior al 33%",
    "Base imponible general + ahorro máximo 22.000 euros",
  ],
  [371, 372]
)

export const MADRID_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = implementada(
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
  [408, 409]
)

export const MADRID_GASTOS_EDUCATIVOS_2025 = implementada(
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
  [419, 420, 421]
)

export const MURCIA_GASTOS_GUARDERIA_2025 = implementada(
  "murcia_gastos_guarderia",
  "Por gastos de guardería",
  "circunstancias_personales_familiares",
  {
    tipo: "porcentaje",
    porcentaje: "20",
    base: "gastos educativos de primer ciclo de Educación Infantil",
    limiteMaximoEuros: "1000",
  },
  [
    "20% de cantidades satisfechas",
    "Máximo 1.000 euros por hijo o descendiente",
    "Base imponible general + ahorro máximo 30.000 euros individual y 50.000 conjunta",
  ],
  [446, 447]
)

export const MURCIA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = implementada(
  "murcia_arrendamiento_vivienda_habitual",
  "Por arrendamiento de vivienda habitual",
  "vivienda_habitual",
  {
    tipo: "porcentaje",
    porcentaje: "10",
    base: "cantidades no subvencionadas satisfechas por alquiler de vivienda habitual",
    limiteMaximoEuros: "300",
  },
  [
    "10% de cantidades no subvencionadas",
    "Máximo 300 euros anuales por contrato",
    "Base imponible general menos mínimo personal y familiar inferior a 40.000 euros",
    "Base imponible del ahorro no superior a 1.800 euros",
  ],
  [461, 462]
)

export const MURCIA_GASTOS_VETERINARIOS_2025 = implementada(
  "murcia_gastos_veterinarios",
  "Por gastos veterinarios",
  "otros_conceptos",
  {
    tipo: "porcentaje",
    porcentaje: "30",
    base: "gastos por servicios veterinarios prestados a animales domésticos",
    limiteMaximoEuros: "100",
  },
  [
    "30% de cantidades satisfechas",
    "Límite máximo 100 euros anuales por declaración",
    "Base imponible general + ahorro máximo 25.000 euros individual y 40.000 conjunta",
  ],
  [478]
)

export const RIOJA_NACIMIENTO_ADOPCION_HIJOS_2025 = implementada(
  "rioja_nacimiento_adopcion_hijos",
  "Por nacimiento y adopción de hijos",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "600 euros primer hijo, 750 segundo, 900 tercero y sucesivos; 60 euros adicionales por hijo en múltiples",
  },
  [
    "600 euros primer hijo",
    "750 euros segundo hijo",
    "900 euros tercero y sucesivos",
    "60 euros adicionales por cada hijo en nacimientos o adopciones múltiples",
  ],
  [481]
)

export const RIOJA_ARRENDAMIENTO_MENORES_36_2025 = implementada(
  "rioja_arrendamiento_menores_36",
  "Por arrendamiento de vivienda habitual para contribuyentes menores de 36 años",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "10% límite 300 euros; 20% límite 400 euros si vivienda en pequeño municipio",
  },
  [
    "General: 10%, máximo 300 euros por contrato",
    "Pequeños municipios: 20%, máximo 400 euros por contrato",
    "Deducción total máxima 400 euros",
    "Base liquidable general sometida a tributación máximo 18.030 euros individual y 30.050 conjunta",
    "Base liquidable del ahorro sometida a tributación máximo 1.800 euros",
  ],
  [500, 501, 502]
)

export const RIOJA_ENFERMEDAD_CELIACA_2025 = implementada(
  "rioja_enfermedad_celiaca",
  "Por enfermedad celíaca diagnosticada",
  "circunstancias_personales_familiares",
  {
    tipo: "importe_fijo",
    euros: "250",
    por: "persona integrante del núcleo familiar con enfermedad celíaca diagnosticada",
  },
  ["250 euros por persona integrante del núcleo familiar con enfermedad celíaca diagnosticada"],
  [519]
)

export const VALENCIANA_NACIMIENTO_ADOPCION_GUARDA_ACOGIMIENTO_2025 =
  implementada(
    "valenciana_nacimiento_adopcion_guarda_acogimiento",
    "Por nacimiento, adopción, delegación de guarda con fines de adopción o acogimiento familiar",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "600 euros primero, 750 segundo, 900 tercero y sucesivos; 300 euros para fallecidos antes de 1/6/2025; reducción por base liquidable",
    },
    [
      "600 euros primero, 750 segundo, 900 tercero y sucesivos",
      "300 euros para fallecidos antes del 1 de junio de 2025",
      "Base liquidable general + ahorro máximo 30.000 euros individual y 47.000 conjunta",
      "Entre umbrales, aplicar fórmula reductora",
    ],
    [527, 528, 529, 530, 531]
  )

export const VALENCIANA_ASCENDIENTES_MAYORES_DISCAPACIDAD_2025 = implementada(
  "valenciana_ascendientes_mayores_discapacidad",
  "Por ascendientes mayores de 75 años o mayores de 65 años con discapacidad",
  "circunstancias_personales_familiares",
  { tipo: "importe_fijo", euros: "197", por: "ascendiente que cumpla requisitos" },
  [
    "197 euros por ascendiente",
    "Base liquidable general + ahorro máximo 30.000 euros individual y 47.000 conjunta",
    "Entre umbrales, aplicar fórmula reductora",
  ],
  [551, 552]
)

export const VALENCIANA_ARRENDAMIENTO_CESION_USO_VIVIENDA_2025 = implementada(
  "valenciana_arrendamiento_cesion_uso_vivienda",
  "Por arrendamiento o pago por la cesión en uso de la vivienda habitual",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "20% límite 800 euros; 25% límite 950 euros si cumple una condición; 30% límite 1.100 euros si cumple dos o más",
  },
  [
    "20%, límite 800 euros",
    "25%, límite 950 euros si edad <=35, discapacidad cualificada o víctima de violencia de género",
    "30%, límite 1.100 euros si cumple dos o más condiciones",
    "Base liquidable general + ahorro máximo 30.000 euros individual y 47.000 conjunta",
  ],
  [564, 565, 566]
)

export const VALENCIANA_DEPORTE_ACTIVIDADES_SALUDABLES_2025 = implementada(
  "valenciana_deporte_actividades_saludables",
  "Por cantidades satisfechas en gastos asociados a la práctica del deporte y actividades saludables",
  "otros_conceptos",
  {
    tipo: "mixta",
    descripcion:
      "30%, 50% o 100% según edad/discapacidad, con límite máximo 150 euros anuales por contribuyente y reducción por base liquidable",
  },
  [
    "30% general",
    "50% si mayor de 65 o discapacidad igual/superior al 33%",
    "100% si mayor de 75 o discapacidad igual/superior al 65%",
    "Límite máximo 150 euros anuales por contribuyente",
    "Base liquidable general + ahorro máximo 60.000 euros individual y 78.000 conjunta",
  ],
  [614, 615, 616]
)

/**
 * Catálogo reconocido de deducciones autonómicas del IRPF 2025.
 *
 * Importante:
 * - Este catálogo NO significa que todas las deducciones estén implementadas.
 * - La recopilación inicial procede de un agente auxiliar y puede contener
 *   omisiones o errores de normalización; se usa como índice operativo revisable,
 *   no como fuente normativa definitiva.
 * - Las fórmulas, límites, incompatibilidades, prorrateos y requisitos se deben
 *   implementar una a una con tests antes de marcar la ficha con
 *   estado "implementada".
 */
export const CATALOGO_DEDUCCIONES_AUTONOMICAS_2025 = parametroNormativo({
  nombre: "Catálogo reconocido de deducciones autonómicas",
  fuente: fuenteAeatDeduccionesAutonomicas2025,
  valor: {
    andalucia: {
      comunidad: "Andalucía",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 2 y 15",
      deducciones: [
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
      ],
    },
    aragon: {
      comunidad: "Aragón",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 2, 3 y 16",
      deducciones: [
        ARAGON_NACIMIENTO_ADOPCION_TERCER_HIJO_SUCESIVOS_2025,
        ARAGON_CUIDADO_PERSONAS_DEPENDIENTES_2025,
        ARAGON_MAYORES_70_2025,
        ARAGON_GUARDERIA_MENORES_3_2025,
      ],
    },
    asturias: {
      comunidad: "Principado de Asturias",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 3 y 17",
      deducciones: [
        ASTURIAS_ACOGIMIENTO_MAYORES_65_2025,
        ASTURIAS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
        ASTURIAS_FAMILIAS_NUMEROSAS_2025,
        ASTURIAS_CENTROS_CERO_TRES_2025,
      ],
    },
    "illes-balears": {
      comunidad: "Illes Balears",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 3, 4, 18 y 19",
      deducciones: [
        BALEARS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
        BALEARS_LIBROS_TEXTO_2025,
        BALEARS_NACIMIENTO_2025,
        BALEARS_GASTOS_MAYORES_65_DISCAPACIDAD_2025,
      ],
    },
    canarias: {
      comunidad: "Canarias",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 4, 5 y 20",
      deducciones: [
        CANARIAS_NACIMIENTO_ADOPCION_2025,
        CANARIAS_DISCAPACIDAD_MAYORES_65_2025,
        CANARIAS_FAMILIA_NUMEROSA_2025,
        CANARIAS_ALQUILER_VIVIENDA_HABITUAL_2025,
        CANARIAS_GASTO_ENFERMEDAD_2025,
        CANARIAS_CONTRIBUYENTES_DESEMPLEADOS_2025,
      ],
    },
    cantabria: {
      comunidad: "Cantabria",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 5, 6 y 21",
      deducciones: [
        CANTABRIA_ARRENDAMIENTO_JOVENES_MAYORES_DISCAPACIDAD_2025,
        CANTABRIA_CUIDADO_FAMILIARES_2025,
        CANTABRIA_NACIMIENTO_ADOPCION_HIJOS_2025,
      ],
    },
    "castilla-la-mancha": {
      comunidad: "Castilla-La Mancha",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 6, 7 y 22",
      deducciones: [
        CLM_NACIMIENTO_ADOPCION_2025,
        CLM_FAMILIA_NUMEROSA_2025,
        CLM_DISCAPACIDAD_CONTRIBUYENTE_2025,
        CLM_DISCAPACIDAD_ASCENDIENTES_DESCENDIENTES_2025,
        CLM_MAYORES_75_2025,
      ],
    },
    "castilla-y-leon": {
      comunidad: "Castilla y León",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 7 y 23",
      deducciones: [
        CYL_FAMILIA_NUMEROSA_2025,
        CYL_NACIMIENTO_ADOPCION_HIJOS_2025,
        CYL_ARRENDAMIENTO_VIVIENDA_JOVENES_2025,
      ],
    },
    catalunya: {
      comunidad: "Catalunya",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 7, 8 y 24",
      deducciones: [
        CATALUNYA_NACIMIENTO_ADOPCION_ACOGIMIENTO_2025,
        CATALUNYA_ALQUILER_VIVIENDA_HABITUAL_2025,
        CATALUNYA_OBLIGACION_DECLARAR_MAS_DE_UN_PAGADOR_2025,
        CATALUNYA_VIUDEDAD_2025,
        CATALUNYA_REHABILITACION_VIVIENDA_HABITUAL_2025,
        CATALUNYA_INTERESES_PRESTAMOS_MASTER_DOCTORADO_2025,
        CATALUNYA_ALQUILER_VICTIMAS_VIOLENCIA_MACHISTA_2025,
        CATALUNYA_INVERSION_COOPERATIVAS_AGRARIAS_VIVIENDA_2025,
      ],
    },
    extremadura: {
      comunidad: "Extremadura",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 8 y 25",
      deducciones: [
        EXTREMADURA_TRABAJO_DEPENDIENTE_2025,
        EXTREMADURA_CUIDADO_FAMILIARES_DISCAPACIDAD_2025,
        EXTREMADURA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
      ],
    },
    galicia: {
      comunidad: "Galicia",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 8, 9, 26 y 27",
      deducciones: [
        GALICIA_NACIMIENTO_ADOPCION_HIJOS_2025,
        GALICIA_FAMILIA_NUMEROSA_2025,
        GALICIA_ALQUILER_VIVIENDA_HABITUAL_2025,
      ],
    },
    madrid: {
      comunidad: "Comunidad de Madrid",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 9, 10 y 28",
      deducciones: [
        MADRID_NACIMIENTO_ADOPCION_2025,
        MADRID_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
        MADRID_GASTOS_EDUCATIVOS_2025,
      ],
    },
    murcia: {
      comunidad: "Región de Murcia",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 10, 11, 29 y 30",
      deducciones: [
        MURCIA_GASTOS_GUARDERIA_2025,
        MURCIA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
        MURCIA_GASTOS_VETERINARIOS_2025,
      ],
    },
    "la-rioja": {
      comunidad: "La Rioja",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 11, 12, 31 y 32",
      deducciones: [
        RIOJA_NACIMIENTO_ADOPCION_HIJOS_2025,
        RIOJA_ARRENDAMIENTO_MENORES_36_2025,
        RIOJA_ENFERMEDAD_CELIACA_2025,
      ],
    },
    "comunitat-valenciana": {
      comunidad: "Comunitat Valenciana",
      fuente:
        "Manual práctico de Renta 2025 Parte 2, páginas 12, 13, 33, 34, 621 y 624",
      deducciones: [
        VALENCIANA_NACIMIENTO_ADOPCION_GUARDA_ACOGIMIENTO_2025,
        VALENCIANA_ASCENDIENTES_MAYORES_DISCAPACIDAD_2025,
        VALENCIANA_ARRENDAMIENTO_CESION_USO_VIVIENDA_2025,
        VALENCIANA_DEPORTE_ACTIVIDADES_SALUDABLES_2025,
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
  valor: Object.values(CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor).flatMap(
    (catalogo) =>
      catalogo.deducciones.filter(
        (deduccion) => deduccion.estado === "implementada"
      )
  ),
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
