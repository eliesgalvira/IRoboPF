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

type EstadoImplementada = Extract<EstadoDeduccionAutonomica, "implementada">

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

const fichaCatalogada = (
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

const categoriaCatalogadaDesdeCodigo = (
  codigo: string
): CategoriaDeduccionAutonomica => {
  if (
    codigo.includes("vivienda") ||
    codigo.includes("arrendamiento") ||
    codigo.includes("arrendador") ||
    codigo.includes("hipotecarios")
  ) {
    return "vivienda_habitual"
  }

  if (
    codigo.includes("donacion") ||
    codigo.includes("donaciones") ||
    codigo.includes("donativo") ||
    codigo.includes("donativos") ||
    codigo.includes("mecenazgo")
  ) {
    return "donativos_donaciones"
  }

  if (
    codigo.includes("familia") ||
    codigo.includes("hijo") ||
    codigo.includes("hijos") ||
    codigo.includes("nacimiento") ||
    codigo.includes("adopcion") ||
    codigo.includes("acogimiento") ||
    codigo.includes("descend") ||
    codigo.includes("ascend") ||
    codigo.includes("discapacidad") ||
    codigo.includes("conciliacion") ||
    codigo.includes("guarderia") ||
    codigo.includes("custodia") ||
    codigo.includes("mayores") ||
    codigo.includes("viudos")
  ) {
    return "circunstancias_personales_familiares"
  }

  return "otros_conceptos"
}

const nombreCatalogadoDesdeCodigo = (codigo: string): string => {
  const prefijos = [
    "andalucia",
    "aragon",
    "asturias",
    "balears",
    "canarias",
    "cantabria",
    "clm",
    "cyl",
    "cataluna",
    "extremadura",
    "galicia",
    "madrid",
    "murcia",
    "rioja",
    "valenciana",
  ]
  const sinPrefijo =
    prefijos.find((prefijo) => codigo.startsWith(`${prefijo}_`)) ?? ""
  const cuerpo = sinPrefijo ? codigo.slice(sinPrefijo.length + 1) : codigo
  const terminos: Record<string, string> = {
    0: "0",
    3: "3",
    6: "6",
    14: "14",
    25: "25",
    30: "30",
    33: "33",
    35: "35",
    36: "36",
    40: "40",
    65: "65",
    75: "75",
    10000: "10.000",
    abonos: "abonos",
    acceso: "acceso",
    accidente: "accidente",
    acciones: "acciones",
    actividades: "actividades",
    acu: "ACU",
    adecuacion: "adecuación",
    adopcion: "adopción",
    agrarias: "agrarias",
    agua: "agua",
    ahorro: "ahorro",
    ayudas: "ayudas",
    alto: "alto",
    alternativo: "alternativo",
    ambiente: "ambiente",
    ampliacion: "ampliación",
    animo: "ánimo",
    angel: "ángel",
    animales: "animales",
    aportaciones: "aportaciones",
    apoyo: "apoyo",
    arrendador: "arrendador",
    arrendadores: "arrendadores",
    arrendamiento: "arrendamiento",
    asistencia: "asistencia",
    asistido: "asistido",
    autoempleo: "autoempleo",
    autoocupacion: "autoocupación",
    autonomia: "autonomía",
    autonomos: "autónomos",
    bursatil: "bursátil",
    caliente: "caliente",
    catalana: "catalana",
    celiaca: "celíaca",
    centros: "centros",
    certificacion: "certificación",
    cientificos: "científicos",
    cientifico: "científico",
    civil: "civil",
    clases: "clases",
    clubes: "clubes",
    cobertura: "cobertura",
    colectivos: "colectivos",
    compania: "compañía",
    conciliacion: "conciliación",
    condicion: "condición",
    conservacion: "conservación",
    construccion: "construcción",
    contribuyentes: "contribuyentes",
    controles: "controles",
    cooperacion: "cooperación",
    costes: "costes",
    covid: "COVID",
    cuidado: "cuidado",
    culturales: "culturales",
    cultural: "cultural",
    danos: "daños",
    dana: "DANA",
    dacion: "dación",
    declarantes: "declarantes",
    defensa: "defensa",
    dependientes: "dependientes",
    deportistas: "deportistas",
    deportivo: "deportivo",
    deportivos: "deportivos",
    deporte: "deporte",
    despoblamiento: "despoblamiento",
    despoblacion: "despoblación",
    determinados: "determinados",
    dificil: "difícil",
    discapacidad: "discapacidad",
    dispositivos: "dispositivos",
    domicilio: "domicilio",
    donaciones: "donaciones",
    donativos: "donativos",
    ecologica: "ecológica",
    economia: "economía",
    educacion: "educación",
    educativos: "educativos",
    eficiencia: "eficiencia",
    ejercicio: "ejercicio",
    ela: "ELA",
    electricos: "eléctricos",
    empleados: "empleados",
    emancipacion: "emancipación",
    emancipados: "emancipados",
    empresas: "empresas",
    empresarial: "empresarial",
    emprendimiento: "emprendimiento",
    energia: "energía",
    energetica: "energética",
    enfermedades: "enfermedades",
    enfermedad: "enfermedad",
    enfermos: "enfermos",
    ensenanza: "enseñanza",
    entidades: "entidades",
    erte: "ERTE",
    escolar: "escolar",
    escolarizado: "escolarizado",
    escuelas: "escuelas",
    especial: "especial",
    estudios: "estudios",
    extranjero: "extranjero",
    extraescolares: "extraescolares",
    familiares: "familiares",
    familiar: "familiar",
    familias: "familias",
    fenotipos: "fenotipos",
    fertilidad: "fertilidad",
    fisico: "físico",
    finalidad: "finalidad",
    financiacion: "financiación",
    forestal: "forestal",
    formacion: "formación",
    fomento: "fomento",
    fundaciones: "fundaciones",
    gas: "gas",
    gestion: "gestión",
    grado: "grado",
    guarda: "guarda",
    guarderia: "guardería",
    guarderias: "guarderías",
    habitual: "habitual",
    historico: "histórico",
    hijos: "hijos",
    hijo: "hijo",
    hogar: "hogar",
    idiomas: "idiomas",
    ilegalmente: "ilegalmente",
    impago: "impago",
    incremento: "incremento",
    infantilies: "infantiles",
    infantiles: "infantiles",
    inmueble: "inmueble",
    innovacion: "innovación",
    instalacion: "instalación",
    instalaciones: "instalaciones",
    interes: "interés",
    intereses: "intereses",
    internet: "internet",
    investigacion: "investigación",
    inversion: "inversión",
    inversiones: "inversiones",
    inversor: "inversor",
    isla: "isla",
    jovenes: "jóvenes",
    juridica: "jurídica",
    laboral: "laboral",
    laborales: "laborales",
    lanzamiento: "lanzamiento",
    lengua: "lengua",
    lentes: "lentes",
    libros: "libros",
    limpieza: "limpieza",
    lucro: "lucro",
    lucha: "lucha",
    luz: "luz",
    mab: "MAB",
    mancha: "Mancha",
    materiales: "materiales",
    material: "material",
    master: "máster",
    mayores: "mayores",
    medio: "medio",
    menores: "menores",
    menos: "menos",
    mercado: "mercado",
    mejora: "mejora",
    musicales: "musicales",
    musical: "musical",
    multiples: "múltiples",
    municipio: "municipio",
    municipios: "municipios",
    nacional: "nacional",
    nacimiento: "nacimiento",
    natural: "natural",
    nivel: "nivel",
    nuevos: "nuevos",
    nueva: "nueva",
    nuevas: "nuevas",
    nucleos: "núcleos",
    ocupada: "ocupada",
    organizaciones: "organizaciones",
    otros: "otros",
    pago: "pago",
    paliar: "paliar",
    patrimonio: "patrimonio",
    peifoga: "PEIFOGA",
    pequenos: "pequeños",
    perros: "perros",
    permanencia: "permanencia",
    permanente: "permanente",
    personas: "personas",
    plazas: "plazas",
    poblacion: "población",
    poblaciones: "poblaciones",
    pobreza: "pobreza",
    practicas: "prácticas",
    precio: "precio",
    primas: "primas",
    primer: "primer",
    primera: "primera",
    profesionales: "profesionales",
    progenitor: "progenitor",
    protegida: "protegida",
    proteccion: "protección",
    proyectos: "proyectos",
    publico: "público",
    reciente: "reciente",
    recarga: "recarga",
    recuperacion: "recuperación",
    reducidos: "reducidos",
    referencia: "referencia",
    refuerzo: "refuerzo",
    regimen: "régimen",
    rehabilitacion: "rehabilitación",
    renovables: "renovables",
    renta: "renta",
    residencia: "residencia",
    residentes: "residentes",
    riesgo: "riesgo",
    rural: "rural",
    rurales: "rurales",
    salud: "salud",
    saludables: "saludables",
    sanitario: "sanitario",
    sanitaria: "sanitaria",
    sector: "sector",
    segundo: "segundo",
    seguridad: "seguridad",
    seguro: "seguro",
    seguros: "seguros",
    social: "social",
    sociedades: "sociedades",
    soluciones: "soluciones",
    sostenibilidad: "sostenibilidad",
    sostenible: "sostenible",
    subida: "subida",
    subvencionada: "subvencionada",
    subvenciones: "subvenciones",
    sucesivos: "sucesivos",
    suspension: "suspensión",
    talidomida: "talidomida",
    tecnologico: "tecnológico",
    tecnologias: "tecnologías",
    tercer: "tercer",
    terrorismo: "terrorismo",
    texto: "texto",
    titulares: "titulares",
    trabajos: "trabajos",
    traslado: "traslado",
    transportes: "transportes",
    transporte: "transporte",
    tratamientos: "tratamientos",
    veterinarios: "veterinarios",
    victimas: "víctimas",
    vitales: "vitales",
    viudos: "viudos",
    vivienda: "vivienda",
    viviendas: "viviendas",
    vacias: "vacías",
    vacio: "vacío",
    2014: "2014",
    2015: "2015",
    2020: "2020",
    2025: "2025",
    3000: "3.000",
    5: "5",
    acogimiento: "acogimiento",
    actividad: "actividad",
    adopciones: "adopciones",
    adquisicion: "adquisición",
    aldeas: "aldeas",
    alquiler: "alquiler",
    arrendamientos: "arrendamientos",
    ascendientes: "ascendientes",
    autoconsumo: "autoconsumo",
    autonomico: "autonómico",
    ayuda: "ayuda",
    bicicletas: "bicicletas",
    bienes: "bienes",
    biosanitaria: "biosanitaria",
    cambio: "cambio",
    cantabria: "Cantabria",
    cantidades: "cantidades",
    cesiones: "cesiones",
    climatizacion: "climatización",
    concejos: "concejos",
    coopera: "coopera",
    creacion: "creación",
    crisis: "crisis",
    cristales: "cristales",
    cualificados: "cualificados",
    cuotas: "cuotas",
    custodia: "custodia",
    desarrollo: "desarrollo",
    descendiente: "descendiente",
    descendientes: "descendientes",
    desplazamiento: "desplazamiento",
    distinto: "distinto",
    docencia: "docencia",
    doctorado: "doctorado",
    domestica: "doméstica",
    dos: "dos",
    ecologicas: "ecológicas",
    emergencia: "emergencia",
    energeticos: "energéticos",
    fallecimiento: "fallecimiento",
    familia: "familia",
    fecha: "fecha",
    fijacion: "fijación",
    fines: "fines",
    fiscal: "fiscal",
    fondo: "fondo",
    fondos: "fondos",
    fuera: "fuera",
    gastos: "gastos",
    hasta: "hasta",
    hipotecarios: "hipotecarios",
    historicos: "históricos",
    hogares: "hogares",
    idi: "I+D+i",
    incendios: "incendios",
    ingresos: "ingresos",
    internacional: "internacional",
    mas: "más",
    mayor: "mayor",
    mecenazgo: "mecenazgo",
    menor: "menor",
    mercantiles: "mercantiles",
    misma: "misma",
    modelo: "modelo",
    monoparental: "monoparental",
    monoparentales: "monoparentales",
    motivos: "motivos",
    movilidad: "movilidad",
    mujeres: "mujeres",
    no: "no",
    numerosa: "numerosa",
    numerosas: "numerosas",
    o: "o",
    obras: "obras",
    occitana: "occitana",
    orden: "Orden",
    otra: "otra",
    participaciones: "participaciones",
    partos: "partos",
    pedaleo: "pedaleo",
    periodo: "período",
    propios: "propios",
    publicas: "públicas",
    puesta: "puesta",
    raras: "raras",
    recursos: "recursos",
    remunerado: "remunerado",
    restauracion: "restauración",
    segunda: "segunda",
    sin: "sin",
    superior: "superior",
    superiores: "superiores",
    terceras: "terceras",
    trabajadoras: "trabajadoras",
    trabajo: "trabajo",
    tramo: "tramo",
    transitorio: "transitorio",
    valenciana: "valenciana",
    vehiculos: "vehículos",
    zona: "zona",
    zonas: "zonas",
  }

  const nombre = cuerpo
    .split("_")
    .map((termino) => terminos[termino] ?? termino)
    .join(" ")

  return `Por ${nombre}`
}

const fichaCatalogadaDesdeCodigo = (codigo: string): FichaDeduccionAutonomica =>
  fichaCatalogada(
    codigo,
    nombreCatalogadoDesdeCodigo(codigo),
    categoriaCatalogadaDesdeCodigo(codigo)
  )

export const DEDUCCIONES_AUTONOMICAS_2025_FALTANTES_SEGUN_GUIA = {
  andalucia: [],
  aragon: [],
  asturias: [],
  "illes-balears": [],
  canarias: [],
  cantabria: [],
  "castilla-la-mancha": [],
  "castilla-y-leon": [],
  catalunya: [],
  extremadura: [],
  galicia: [],
  madrid: [],
  murcia: [],
  "la-rioja": [],
  "comunitat-valenciana": [],
} as const

const deduccionesCatalogadasFaltantes = (
  comunidad: keyof typeof DEDUCCIONES_AUTONOMICAS_2025_FALTANTES_SEGUN_GUIA
): ReadonlyArray<FichaDeduccionAutonomica> =>
  DEDUCCIONES_AUTONOMICAS_2025_FALTANTES_SEGUN_GUIA[comunidad].map(
    fichaCatalogadaDesdeCodigo
  )

const fichaImplementadaBasica = (
  estado: { readonly estado: EstadoImplementada },
  codigo: string,
  nombre: string,
  categoria: CategoriaDeduccionAutonomica
): FichaDeduccionAutonomica => ({
  codigo,
  comunidad: comunidadDesdeCodigo(codigo),
  nombre,
  normativa: "Ficha normalizada desde Manual Renta 2025 Parte 2",
  categoria,
  cuantia: {
    tipo: "mixta",
    descripcion: "Cuantía definida por la ficha normativa implementada.",
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
  estado: estado.estado,
})

const fichaImplementada = (
  estado: { readonly estado: EstadoImplementada },
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
  ...fichaImplementadaBasica(estado, codigo, nombre, categoria),
  cuantia,
  requisitos,
  limites,
  entradaNecesaria,
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas,
  },
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
    paginas: [44, 45],
  },
} as const satisfies FichaDeduccionAutonomica

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
    paginas: [403, 404],
  },
} as const satisfies FichaDeduccionAutonomica

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
    paginas: [326, 327, 328],
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

export const CANARIAS_NACIMIENTO_ADOPCION_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
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
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_DISCAPACIDAD_MAYORES_65_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
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
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_FAMILIA_NUMEROSA_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
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
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_CONTRIBUYENTES_DESEMPLEADOS_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
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
} as const satisfies FichaDeduccionAutonomica

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

export const ASTURIAS_ACOGIMIENTO_MAYORES_65_2025 = fichaImplementada(
  { estado: "implementada" },
  "asturias_acogimiento_no_remunerado_mayores_65",
  "Por acogimiento no remunerado de mayores de 65 años",
  "circunstancias_personales_familiares",
  {
    tipo: "importe_fijo",
    euros: "500",
    por: "persona mayor de 65 años acogida",
  },
  [
    "500 euros por persona acogida",
    "Base imponible general + ahorro: máximo 26.000 euros individual y 37.000 conjunta",
  ],
  [89, 90]
)

export const ASTURIAS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const ASTURIAS_FAMILIAS_NUMEROSAS_2025 = fichaImplementada(
  { estado: "implementada" },
  "asturias_familias_numerosas",
  "Para familias numerosas",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "1.000 euros categoría general; 2.000 euros categoría especial",
  },
  ["1.000 euros para categoría general", "2.000 euros para categoría especial"],
  [96, 97]
)

export const ASTURIAS_CENTROS_CERO_TRES_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const ASTURIAS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "asturias_vivienda_discapacidad",
    "Por adquisición o adecuación de la vivienda habitual para contribuyentes con discapacidad",
    "vivienda_habitual",
    {
      tipo: "porcentaje",
      porcentaje: "3",
      base: "cantidades satisfechas por adquisición o adecuación de vivienda habitual por discapacidad",
      limiteMaximoEuros: "450",
    },
    [
      "Fórmula: min(3% de cantidades satisfechas, 450 euros), por base máxima de 15.000 euros.",
      "Discapacidad igual o superior al 65% del contribuyente, cónyuge, ascendientes o descendientes.",
      "Cónyuge, ascendientes o descendientes deben convivir más de 183 días al año y no tener rentas anuales, incluidas exentas, superiores a 35.000 euros.",
      "La adecuación debe ser estrictamente necesaria para accesibilidad y comunicación sensorial, acreditada por resolución o certificado competente.",
      "Si varios contribuyentes tienen derecho por los mismos ascendientes o descendientes, se prorratea por partes iguales; si hay distinto parentesco, corresponde al grado más cercano.",
      "Si el contribuyente con discapacidad aplica la deducción, los familiares convivientes no pueden aplicarla.",
    ],
    [91, 92],
    [
      "asturias_vivienda_discapacidad:base",
      "asturias_vivienda_discapacidad:cumple",
    ],
    ["Vivienda habitual en el Principado de Asturias."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_vivienda_protegida",
    "Por inversión en vivienda habitual que tenga la consideración de protegida",
    "vivienda_habitual",
    {
      tipo: "mixta",
      descripcion:
        "100% del gasto efectivo por adquisición o rehabilitación de vivienda habitual protegida; límite 5.000 euros en el ejercicio de adquisición/rehabilitación y 1.000 euros en ejercicios sucesivos o cantidades pendientes.",
    },
    [
      "Fórmula ejercicio adquisición/rehabilitación: min(100% gasto efectivo, 5.000 euros).",
      "Fórmula ejercicios sucesivos: min(100% gasto efectivo o pendiente, 1.000 euros).",
      "Si no hay cuota íntegra autonómica suficiente, el importe no deducido puede aplicarse en los tres períodos impositivos siguientes, respetando el límite de 1.000 euros.",
      "La vivienda debe tener calificación de protegida conforme a normativa estatal o autonómica.",
      "Si varios contribuyentes tienen derecho sobre los mismos bienes, el importe máximo se prorratea por partes iguales.",
    ],
    [92, 93],
    [
      "asturias_vivienda_protegida:importe",
      "asturias_vivienda_protegida:cumple",
    ],
    ["Gastos acreditados mediante factura o medio admitido en Derecho."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_adopcion_internacional",
    "Por adopción internacional de menores",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "1500",
      por: "menor adoptado internacionalmente",
    },
    [
      "Fórmula: 1.500 euros por hijo adoptado internacionalmente.",
      "El menor debe convivir con el declarante.",
      "La adopción se entiende realizada en el ejercicio de inscripción en el Registro Civil español, o de resolución judicial/administrativa si la inscripción no es necesaria.",
      "Si existe más de un contribuyente con derecho y presentan individual, se prorratea por partes iguales.",
    ],
    [95, 96],
    [
      "asturias_adopcion_internacional:unidades",
      "asturias_adopcion_internacional:cumple",
    ],
    ["Adopción internacional de menor conforme a la Ley 54/2007."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_partos_multiples_adopciones_misma_fecha",
    "Por partos múltiples o por dos o más adopciones constituidas en la misma fecha",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "1000",
      por: "hijo nacido o adoptado en parto múltiple o adopciones múltiples de la misma fecha",
    },
    [
      "Fórmula: 1.000 euros por cada hijo nacido o adoptado.",
      "Aplicable en el período del nacimiento o adopción.",
      "El menor debe convivir con el progenitor o adoptante en la fecha de devengo.",
      "En matrimonios o uniones de hecho, si presentan individual, se prorratea por partes iguales.",
    ],
    [96],
    [
      "asturias_partos_multiples_adopciones_misma_fecha:unidades",
      "asturias_partos_multiples_adopciones_misma_fecha:cumple",
    ],
    ["Parto múltiple o dos o más adopciones constituidas en la misma fecha."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_familias_monoparentales",
    "Para familias monoparentales",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "500",
      por: "contribuyente de familia monoparental",
    },
    [
      "Fórmula: 500 euros por contribuyente.",
      "Base imponible general + ahorro + anualidades por alimentos exentas: máximo 45.000 euros.",
      "No aplicable a custodia compartida.",
      "Si hay alteración familiar durante el año, se entiende convivencia si se produce al menos 183 días al año.",
    ],
    [97, 98],
    [
      "asturias_familias_monoparentales:unidades",
      "asturias_familias_monoparentales:cumple",
    ],
    [
      "Contribuyente con descendientes a cargo y sin convivencia con persona ajena a esos descendientes, salvo ascendientes con derecho al mínimo.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_acogimiento_familiar_menores",
    "Por acogimiento familiar de menores",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "500 euros por menor acogido si convive 183 días o más; 250 euros si convive más de 90 días y menos de 183 días.",
    },
    [
      "Fórmula: 500 euros por menor con convivencia de al menos 183 días; 250 euros por menor con convivencia superior a 90 días e inferior a 183 días.",
      "Acogimiento familiar de urgencia, temporal o permanente; excluidos los acogimientos con finalidad preadoptiva.",
      "Si hay más de un contribuyente con derecho y presentan individual, se prorratea por partes iguales.",
    ],
    [98, 99],
    [
      "asturias_acogimiento_familiar_menores:importe",
      "asturias_acogimiento_familiar_menores:cumple",
    ],
    ["Menor en régimen de acogimiento familiar."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_certificacion_gestion_forestal_sostenible",
    "Por certificación de la gestión forestal sostenible",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "30",
      base: "cantidades invertidas para obtener certificación de gestión forestal sostenible",
      limiteMaximoEuros: "1000",
    },
    [
      "Fórmula: min(30% de cantidades invertidas, 1.000 euros por contribuyente).",
      "Se aplica en el ejercicio en que se obtiene la certificación.",
      "Base: costes asociados a la certificación, excluidas subvenciones recibidas para esa finalidad.",
      "Si hay varios contribuyentes con derecho sobre los mismos bienes y presentan individual, se prorratea por partes iguales.",
    ],
    [99, 100],
    [
      "asturias_certificacion_gestion_forestal_sostenible:base",
      "asturias_certificacion_gestion_forestal_sostenible:cumple",
    ],
    [
      "Propietario de montes situados en Asturias con certificación de gestión forestal sostenible.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_libros_texto_material_escolar",
    "Por adquisición de libros de texto y material escolar",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "100% de libros de texto y material escolar de Primaria/ESO, minorado por becas y ayudas, con límites por descendiente según base, tributación y familia numerosa.",
    },
    [
      "Fórmula: min(100% de gastos - becas/ayudas, límite por descendiente aplicable).",
      "Individual no numerosa: 50 euros hasta 6.500; 37,50 euros hasta 10.000; 25 euros hasta 26.000.",
      "Conjunta no numerosa: 100 euros hasta 12.000; 75 euros hasta 20.000; 50 euros hasta 37.000.",
      "Familia numerosa: 75 euros por descendiente en individual y 150 euros por descendiente en conjunta.",
      "Base imponible general + ahorro: máximo 26.000 euros individual y 37.000 conjunta.",
      "La deducción se prorratea por partes iguales cuando exista más de un contribuyente con derecho; el límite máximo no se prorratea.",
    ],
    [103, 104, 105],
    [
      "asturias_libros_texto_material_escolar:importe",
      "asturias_libros_texto_material_escolar:cumple",
    ],
    [
      "Gastos por descendientes en Educación Primaria o Secundaria Obligatoria; también tutela y acogimiento.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_segundo_sucesivos_hijos_concejos_despoblamiento",
    "Por nacimiento o adopción de segundo y sucesivos hijos en concejos en riesgo de despoblamiento o en crisis demográfica",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "300",
      por: "segundo o sucesivo hijo nacido o adoptado",
    },
    [
      "Fórmula: 300 euros por cada segundo o sucesivo hijo nacido o adoptado.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "El menor debe convivir con el declarante a la fecha de devengo; si fallece antes, basta convivencia a fecha de fallecimiento.",
      "Residencia habitual del declarante en concejo en riesgo de despoblamiento o en crisis demográfica.",
      "En nacimientos o adopciones de hijos comunes en individual, se prorratea en todo caso.",
    ],
    [105, 106],
    [
      "asturias_segundo_sucesivos_hijos_concejos_despoblamiento:unidades",
      "asturias_segundo_sucesivos_hijos_concejos_despoblamiento:cumple",
    ],
    ["Nacimiento o adopción del segundo hijo o sucesivos."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_autonomos_concejos_despoblamiento",
    "Para contribuyentes que se establezcan como autónomos en concejos en riesgo de despoblamiento o en crisis demográfica",
    "otros_conceptos",
    {
      tipo: "importe_fijo",
      euros: "1000",
      por: "contribuyente autónomo con derecho",
    },
    [
      "Fórmula: 1.000 euros por contribuyente con derecho; en conjunta, multiplicar por el número de miembros que cumplan requisitos.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "Residencia habitual en concejo en riesgo de despoblamiento o en crisis demográfica.",
      "Inicio de actividad en Asturias como autónomo o trabajador por cuenta propia durante el período.",
      "Alta durante mínimo un año, salvo fallecimiento.",
      "No aplicable a autónomos colaboradores ni socios de sociedades mercantiles de capital.",
      "No aplicable si cesó en la misma actividad en los seis meses anteriores al inicio.",
    ],
    [106, 107, 108],
    [
      "asturias_autonomos_concejos_despoblamiento:unidades",
      "asturias_autonomos_concejos_despoblamiento:cumple",
    ],
    ["Alta en RETA o mutualidad correspondiente."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_transporte_publico_despoblamiento",
    "Por gastos de transporte público para residentes en concejos en riesgo de despoblamiento o en crisis demográfica",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "100% de abonos de transporte público personales del contribuyente con límite 100 euros, más 10% de abonos de descendientes estudiantes fuera del concejo con límite 300 euros por descendiente.",
    },
    [
      "Fórmula general: min(100% de gastos de abonos unipersonales y nominales del contribuyente, 100 euros por contribuyente).",
      "En conjunta, el límite de 100 euros se multiplica por el número de miembros con derecho, con el límite de gastos efectivos.",
      "Incremento descendientes: min(10% de gastos de abonos por descendiente o adoptado, 300 euros por descendiente).",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "Residencia habitual en concejo en riesgo de despoblamiento o en crisis demográfica.",
      "Descendiente con derecho al mínimo que curse bachillerato, FP o enseñanzas universitarias fuera del concejo.",
      "Si el descendiente convive con más de un contribuyente de idéntico grado, se prorratea por partes iguales.",
    ],
    [108, 109, 110],
    [
      "asturias_transporte_publico_despoblamiento:importe",
      "asturias_transporte_publico_despoblamiento:cumple",
    ],
    ["Gastos acreditados por factura o medio admitido en Derecho."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_formacion_trabajos_cualificados_idi",
    "Por gastos de formación en trabajos especialmente cualificados relacionados con I+D, científicos o técnicos",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "100",
      base: "gastos de formación satisfechos para trabajos especialmente cualificados de I+D, científicos o técnicos",
      limiteMaximoEuros: "2000",
    },
    [
      "Fórmula: min(100% de gastos de formación, 2.000 euros).",
      "No más de tres años desde que el contribuyente finalizó su formación académica.",
      "Residencia habitual en Asturias mantenida al menos tres años.",
      "Por cuenta ajena: contrato de trabajo. Por cuenta propia: alta en Seguridad Social o mutualidad durante mínimo un año salvo fallecimiento.",
      "Se aplica una sola vez, en el período de incorporación al mercado laboral.",
      "Trabajos especialmente cualificados: grupo de cotización 1 y actividades de I+D, científicas o técnicas según la ficha.",
      "Incompatible por contribuyente con la deducción por traslado de domicilio fiscal por motivos laborales para trabajos especialmente cualificados.",
    ],
    [110, 111, 112, 113],
    [
      "asturias_formacion_trabajos_cualificados_idi:base",
      "asturias_formacion_trabajos_cualificados_idi:cumple",
    ],
    ["Gastos de formación satisfechos por el contribuyente."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_traslado_domicilio_fiscal_motivos_laborales",
    "Para contribuyentes que trasladen su domicilio fiscal al Principado de Asturias por motivos laborales",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "15% de gastos generados por traslado de domicilio fiscal por motivos laborales; límite 1.000 euros general o 2.000 euros si desarrolla trabajos especialmente cualificados.",
    },
    [
      "Fórmula general: min(15% de gastos de traslado, 1.000 euros por contribuyente con derecho).",
      "Fórmula trabajos cualificados: min(15% de gastos de traslado, 2.000 euros por contribuyente con derecho).",
      "En conjunta, el límite de 1.000 o 2.000 euros se aplica por cada contribuyente con derecho.",
      "Aplicable en el período del traslado y durante los tres ejercicios posteriores.",
      "No residencia habitual en Asturias durante los cuatro años anteriores al traslado.",
      "Residencia habitual fijada en Asturias y mantenida al menos tres años adicionales al traslado.",
      "Gastos deducibles: viaje y mudanza, escolarización de descendientes, adquisición o arrendamiento de vivienda habitual y servicios/suministros vinculados.",
      "Incompatible por contribuyente, en trabajos cualificados, con la deducción por gastos de formación en trabajos cualificados.",
    ],
    [113, 114, 115, 116],
    [
      "asturias_traslado_domicilio_fiscal_motivos_laborales:importe",
      "asturias_traslado_domicilio_fiscal_motivos_laborales:cumple",
    ],
    [
      "Traslado de domicilio fiscal al Principado de Asturias por motivos laborales.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_vivienda_determinados_colectivos",
    "Por adquisición o rehabilitación de vivienda habitual para determinados colectivos",
    "vivienda_habitual",
    {
      tipo: "mixta",
      descripcion:
        "5% de cantidades satisfechas; 10% en concejos en riesgo para jóvenes hasta 35, familias numerosas o monoparentales; base máxima 10.000 euros.",
    },
    [
      "Supuesto A, concejos en riesgo: 5% general; 10% si el contribuyente tiene edad igual o inferior a 35 años, es miembro de familia numerosa o familia monoparental.",
      "Supuesto B, resto de concejos: 5% para contribuyentes de edad igual o inferior a 35 años si el valor de la vivienda no excede de 250.000 euros.",
      "Base máxima: 10.000 euros en individual y conjunta; si varios contribuyentes tienen derecho por los mismos bienes, se prorratea la base máxima.",
      "Deducción máxima operativa: 500 euros al 5% o 1.000 euros al 10%.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "La vivienda debe constituir o ir a constituir vivienda habitual; en concejos en riesgo, el domicilio fiscal debe mantenerse al menos tres años salvo fallecimiento.",
    ],
    [116, 117, 118],
    [
      "asturias_vivienda_determinados_colectivos:importe",
      "asturias_vivienda_determinados_colectivos:cumple",
    ],
    ["Gastos acreditados mediante factura o medio admitido en Derecho."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_vehiculos_electricos",
    "Por adquisición de vehículos eléctricos",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "15",
      base: "cantidades satisfechas por adquisición de vehículo eléctrico nuevo o kilómetro cero, minoradas por ayudas públicas",
      limiteMaximoEuros: "7500",
    },
    [
      "Fórmula: min(15% de base, 7.500 euros), por base máxima de 50.000 euros por vehículo.",
      "Cada contribuyente tiene derecho por un solo vehículo.",
      "Vehículo eléctrico nuevo o kilómetro cero de categoría enchufable o pila de combustible según MOVES III.",
      "El vehículo no puede estar afecto a actividades económicas.",
      "La deducción corresponde al contribuyente que figure en el contrato de compraventa.",
      "Si hay varios adquirentes, la base máxima de 50.000 euros es conjunta y se prorratea entre adquirentes.",
      "Ámbito temporal prorrogado a 2025.",
    ],
    [119, 120],
    [
      "asturias_vehiculos_electricos:base",
      "asturias_vehiculos_electricos:cumple",
    ],
    ["Contrato de compraventa del vehículo."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_cuidado_descendientes_hasta_25",
    "Por el cuidado de descendientes o adoptados de hasta 25 años de edad",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "600 euros por descendiente de hasta 25 años con derecho al mínimo; también hasta cumplir 26 años si cumple el resto de requisitos, con prorrateo por meses en el año en que cumpla 26.",
    },
    [
      "Fórmula general: 600 euros por descendiente o adoptado.",
      "Año en que cumple 26 años: 600 euros x meses que cumplen requisitos / 12; se computa hasta el mes anterior al cumpleaños 26.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "Progenitores, adoptantes o tutores deben convivir con el descendiente a la fecha de devengo.",
      "Si hay más de un contribuyente con derecho, se prorratea por partes iguales.",
      "Incompatible, para los mismos descendientes y por contribuyente, con gastos de descendientes en centros de cero a tres años.",
    ],
    [120, 121],
    [
      "asturias_cuidado_descendientes_hasta_25:importe",
      "asturias_cuidado_descendientes_hasta_25:cumple",
    ],
    [
      "Descendiente o adoptado que genere derecho al mínimo por descendientes, o supuesto extendido hasta 26 años.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_emancipacion_jovenes_hasta_35",
    "Por emancipación de jóvenes de hasta 35 años de edad",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "100",
      base: "gastos directamente vinculados a la emancipación",
      limiteMaximoEuros: "1000",
    },
    [
      "Fórmula: min(100% de gastos de emancipación, 1.000 euros por contribuyente).",
      "Contribuyente menor de 36 años; también aplicable en el ejercicio en que cumpla 36 si emancipación y gastos son previos al cumpleaños.",
      "Emancipación: dejar de convivir con ascendientes y trasladar domicilio a nueva vivienda habitual en Asturias en propiedad o arrendamiento.",
      "Se pierde la deducción si retorna al hogar familiar antes de tres años.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "Gastos vinculados: mobiliario, transporte, arrendamiento o adquisición de vivienda, entre otros.",
    ],
    [121, 122],
    [
      "asturias_emancipacion_jovenes_hasta_35:base",
      "asturias_emancipacion_jovenes_hasta_35:cumple",
    ],
    ["Gastos acreditados mediante factura o medio admitido en Derecho."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_ayudas_ela",
    "Por la obtención de ayudas o subvenciones otorgadas por el Principado de Asturias a enfermos de Esclerosis Lateral Amiotrófica",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "Resultado de aplicar los tipos medios de gravamen a la cuantía de la ayuda o subvención ELA integrada en la base liquidable.",
    },
    [
      "Fórmula: ayuda integrada en base liquidable x tipos medios de gravamen aplicables.",
      "Solo por ayudas o subvenciones públicas otorgadas por el Principado de Asturias a enfermos de ELA integradas en la base imponible general.",
      "No tiene límite cuantitativo específico en la ficha; el importe depende de los tipos medios de gravamen.",
    ],
    [122, 123],
    ["asturias_ayudas_ela:importe", "asturias_ayudas_ela:cumple"],
    ["Ayuda o subvención ELA integrada en la base imponible general."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_gastos_arrendamiento_viviendas",
    "Por gastos derivados del arrendamiento de viviendas",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "100",
      base: "gastos deducibles vinculados al arrendamiento de viviendas a precios con sostenibilidad social",
      limiteMaximoEuros: "500",
    },
    [
      "Fórmula: min(100% de gastos deducibles, 500 euros anuales).",
      "Límite global independiente del número de inmuebles arrendados.",
      "En tributación conjunta, el límite de 500 euros se aplica por cada miembro que realice la inversión con sus propios ingresos.",
      "Gastos: reparación y conservación, formalización de contratos, primas de seguros por daños e impagos, certificados de eficiencia energética vinculados.",
      "El contribuyente debe obtener rendimientos de capital inmobiliario por arrendamiento de viviendas destinadas a vivienda habitual del arrendatario.",
      "Arrendamientos retribuidos a precios con sostenibilidad social: renta no superior al valor superior del rango del sistema estatal de referencia o normativa autonómica aplicable.",
    ],
    [123, 124, 125],
    [
      "asturias_gastos_arrendamiento_viviendas:base",
      "asturias_gastos_arrendamiento_viviendas:cumple",
    ],
    [
      "Gastos vinculados a arrendamientos que cumplan el requisito de renta durante los meses de vigencia del contrato.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_gastos_vitales_hasta_35",
    "Por los gastos vitales en que incurran los contribuyentes de hasta 35 años",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "100% de gastos vitales; límite 2.000 euros hasta 25 años, 1.500 euros de 26 a 30 años y 1.000 euros de 31 a 35 años.",
    },
    [
      "Fórmula hasta 25 años: min(100% de gastos, 2.000 euros).",
      "Fórmula 26 a 30 años: min(100% de gastos, 1.500 euros).",
      "Fórmula 31 a 35 años: min(100% de gastos, 1.000 euros).",
      "Si el contribuyente está en dos tramos de edad durante el ejercicio, se aplica el límite de mayor cuantía.",
      "En conjunta, el límite se aplica por cada miembro que cumpla requisitos.",
      "Base imponible general + ahorro: máximo 28.000 euros anuales.",
      "Gastos admisibles en sentido amplio: vivienda y suministros, educativos, transporte y movilidad, tecnología, deportivos y culturales.",
    ],
    [125, 126],
    [
      "asturias_gastos_vitales_hasta_35:importe",
      "asturias_gastos_vitales_hasta_35:cumple",
    ],
    ["Contribuyente de hasta 35 años; gastos acreditados documentalmente."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_descendiente_fallecimiento_progenitor_accidente_laboral",
    "Por descendientes en caso de fallecimiento de progenitor como consecuencia de accidentes laborales",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "1000",
      por: "descendiente con derecho al mínimo",
    },
    [
      "Fórmula: 1.000 euros anuales por descendiente con derecho al mínimo por descendientes.",
      "Aplicable hasta que el descendiente deje de generar derecho al mínimo por descendientes.",
      "Requisito: fallecimiento del otro progenitor como consecuencia de accidente laboral, producido desde 1 de enero del ejercicio o con anterioridad.",
      "Solo se computan descendientes comunes con el progenitor difunto; el nasciturus genera derecho desde el ejercicio de nacimiento.",
    ],
    [126, 127],
    [
      "asturias_descendiente_fallecimiento_progenitor_accidente_laboral:unidades",
      "asturias_descendiente_fallecimiento_progenitor_accidente_laboral:cumple",
    ],
    ["Descendiente que genere derecho al mínimo por descendientes."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_inversion_entidades_nuevas_reciente_creacion",
    "Por inversión en la adquisición de acciones y participaciones sociales de nuevas entidades o de reciente creación",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "30",
      base: "cantidades invertidas en acciones o participaciones sociales de nuevas entidades o de reciente creación",
      limiteMaximoEuros: "6000",
    },
    [
      "Fórmula: min(30% de inversión, 6.000 euros anuales).",
      "En conjunta, el límite de 6.000 euros se aplica a las inversiones realizadas por cada miembro que cumpla requisitos.",
      "Participación del contribuyente y familiares hasta tercer grado no superior al 40% del capital o derechos de voto durante ningún día del año.",
      "Participación mantenida al menos tres años.",
      "Entidad con domicilio social y fiscal en Asturias, microempresa o pyme, y actividad económica real.",
      "Constitución: al menos una persona contratada a jornada completa desde el primer ejercicio fiscal.",
      "Ampliación: entidad constituida en los tres años anteriores e incremento de plantilla media durante los dos ejercicios posteriores, mantenido 24 meses.",
    ],
    [127, 128],
    [
      "asturias_inversion_entidades_nuevas_reciente_creacion:base",
      "asturias_inversion_entidades_nuevas_reciente_creacion:cumple",
    ],
    [
      "Inversión por constitución o ampliación de capital en sociedad anónima, limitada, cooperativa o laboral.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_enfermedad_celiaca",
    "Por gastos derivados de la enfermedad celíaca diagnosticada",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "100",
      por: "persona integrante del núcleo familiar con enfermedad celíaca diagnosticada",
    },
    [
      "Fórmula: 100 euros por persona integrante del núcleo familiar diagnosticada con enfermedad celíaca.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "Importe máximo de 100 euros por persona que dé derecho a deducción, sin perjuicio de prorrateo.",
      "Si dos o más contribuyentes tienen derecho respecto de los mismos ascendientes o descendientes, el importe máximo se prorratea por partes iguales.",
    ],
    [128, 129],
    [
      "asturias_enfermedad_celiaca:unidades",
      "asturias_enfermedad_celiaca:cumple",
    ],
    [
      "El contribuyente debe satisfacer efectivamente los gastos y contar con informe médico oficial de diagnóstico.",
    ]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const BALEARS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const BALEARS_LIBROS_TEXTO_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const BALEARS_NACIMIENTO_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const BALEARS_GASTOS_MAYORES_65_DISCAPACIDAD_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const CANARIAS_ALQUILER_VIVIENDA_HABITUAL_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const CANARIAS_GASTO_ENFERMEDAD_2025 = fichaImplementada(
  { estado: "implementada" },
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
  fichaImplementada(
    { estado: "implementada" },
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

export const CANTABRIA_CUIDADO_FAMILIARES_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const CANTABRIA_NACIMIENTO_ADOPCION_HIJOS_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const CLM_MAYORES_75_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const CYL_FAMILIA_NUMEROSA_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const CYL_NACIMIENTO_ADOPCION_HIJOS_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const CYL_ARRENDAMIENTO_VIVIENDA_JOVENES_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const EXTREMADURA_TRABAJO_DEPENDIENTE_2025 = fichaImplementada(
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
  [330]
)

export const EXTREMADURA_CUIDADO_FAMILIARES_DISCAPACIDAD_2025 =
  fichaImplementada(
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
    [333, 334, 335]
  )

export const EXTREMADURA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 =
  fichaImplementada(
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
    [342, 343, 344]
  )

export const GALICIA_NACIMIENTO_ADOPCION_HIJOS_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const GALICIA_FAMILIA_NUMEROSA_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const GALICIA_ALQUILER_VIVIENDA_HABITUAL_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const MADRID_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = fichaImplementada(
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
  [408, 409]
)

export const MADRID_GASTOS_EDUCATIVOS_2025 = fichaImplementada(
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
  [419, 420, 421]
)

export const MURCIA_GASTOS_GUARDERIA_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const MURCIA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const MURCIA_GASTOS_VETERINARIOS_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const RIOJA_NACIMIENTO_ADOPCION_HIJOS_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const RIOJA_ARRENDAMIENTO_MENORES_36_2025 = fichaImplementada(
  { estado: "implementada" },
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

export const RIOJA_ENFERMEDAD_CELIACA_2025 = fichaImplementada(
  { estado: "implementada" },
  "rioja_enfermedad_celiaca",
  "Por enfermedad celíaca diagnosticada",
  "circunstancias_personales_familiares",
  {
    tipo: "importe_fijo",
    euros: "250",
    por: "persona integrante del núcleo familiar con enfermedad celíaca diagnosticada",
  },
  [
    "250 euros por persona integrante del núcleo familiar con enfermedad celíaca diagnosticada",
  ],
  [519]
)

export const VALENCIANA_NACIMIENTO_ADOPCION_GUARDA_ACOGIMIENTO_2025 =
  fichaImplementada(
    { estado: "implementada" },
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

export const VALENCIANA_ASCENDIENTES_MAYORES_DISCAPACIDAD_2025 =
  fichaImplementada(
    { estado: "implementada" },
    "valenciana_ascendientes_mayores_discapacidad",
    "Por ascendientes mayores de 75 años o mayores de 65 años con discapacidad",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "197",
      por: "ascendiente que cumpla requisitos",
    },
    [
      "197 euros por ascendiente",
      "Base liquidable general + ahorro máximo 30.000 euros individual y 47.000 conjunta",
      "Entre umbrales, aplicar fórmula reductora",
    ],
    [551, 552]
  )

export const VALENCIANA_ARRENDAMIENTO_CESION_USO_VIVIENDA_2025 =
  fichaImplementada(
    { estado: "implementada" },
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

export const VALENCIANA_DEPORTE_ACTIVIDADES_SALUDABLES_2025 = fichaImplementada(
  { estado: "implementada" },
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

const fichaImplementadaFormula = (
  codigo: string,
  paginas: ReadonlyArray<number>
): FichaDeduccionAutonomica =>
  fichaImplementada(
    { estado: "implementada" },
    codigo,
    nombreCatalogadoDesdeCodigo(codigo),
    categoriaCatalogadaDesdeCodigo(codigo),
    {
      tipo: "mixta",
      descripcion:
        "Cuantia calculada por la ficha normativa normalizada y por el modulo de deducciones autonomicas aplicadas.",
    },
    [
      "Cumplir requisitos, limites de renta, prorrateos e incompatibilidades descritos en la ficha normativa normalizada.",
      "El importe se calcula con las entradas especificas de la deduccion o se consigna como importe manual cuando la ficha requiere validacion externa.",
    ],
    paginas,
    [`${codigo}:cumple`, `${codigo}:importe`],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada"]
  )
export const GALICIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementadaFormula("galicia_familias_dos_hijos", [364, 402]),
  fichaImplementadaFormula("galicia_acogimiento_menores", [364, 402]),
  fichaImplementadaFormula("galicia_cuidado_hijos_menores", [364, 402]),
  fichaImplementadaFormula(
    "galicia_discapacidad_mayor_65_ayuda_terceras_personas",
    [364, 402]
  ),
  fichaImplementadaFormula("galicia_nuevas_tecnologias_hogares", [364, 402]),
  fichaImplementadaFormula(
    "galicia_inversion_entidades_nuevas_reciente_creacion",
    [364, 402]
  ),
  fichaImplementadaFormula(
    "galicia_inversion_entidades_nuevas_financiacion",
    [364, 402]
  ),
  fichaImplementadaFormula("galicia_inversion_mab", [364, 402]),
  fichaImplementadaFormula("galicia_donaciones_idi", [364, 402]),
  fichaImplementadaFormula(
    "galicia_climatizacion_agua_caliente_renovables",
    [364, 402]
  ),
  fichaImplementadaFormula(
    "galicia_rehabilitacion_centros_historicos",
    [364, 402]
  ),
  fichaImplementadaFormula("galicia_inversion_empresas_agrarias", [364, 402]),
  fichaImplementadaFormula("galicia_ayudas_incendios_peifoga_2025", [364, 402]),
  fichaImplementadaFormula("galicia_obras_eficiencia_energetica", [364, 402]),
  fichaImplementadaFormula("galicia_ayudas_deportistas_alto_nivel", [364, 402]),
  fichaImplementadaFormula("galicia_aldeas_modelo", [364, 402]),
  fichaImplementadaFormula(
    "galicia_inversion_proyectos_especial_interes",
    [364, 402]
  ),
  fichaImplementadaFormula(
    "galicia_adecuacion_inmueble_vacio_arrendamiento",
    [364, 402]
  ),
  fichaImplementadaFormula(
    "galicia_arrendamiento_viviendas_vacias",
    [364, 402]
  ),
  fichaImplementadaFormula("galicia_ayudas_ela_fenotipos", [364, 402]),
  fichaImplementadaFormula("galicia_libros_texto_material_escolar", [364, 402]),
  fichaImplementadaFormula("galicia_ayudas_talidomida", [364, 402]),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const MADRID_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementadaFormula("madrid_adopcion_internacional", [403, 438]),
  fichaImplementadaFormula("madrid_acogimiento_familiar_menores", [403, 438]),
  fichaImplementadaFormula(
    "madrid_acogimiento_mayores_65_discapacidad",
    [403, 438]
  ),
  fichaImplementadaFormula("madrid_cuidado_ascendientes", [403, 438]),
  fichaImplementadaFormula("madrid_gastos_arrendamiento_viviendas", [403, 438]),
  fichaImplementadaFormula("madrid_arrendamiento_viviendas_vacias", [403, 438]),
  fichaImplementadaFormula(
    "madrid_donativos_fundaciones_clubes_deportivos",
    [403, 438]
  ),
  fichaImplementadaFormula(
    "madrid_incremento_costes_financiacion_vivienda",
    [403, 438]
  ),
  fichaImplementadaFormula(
    "madrid_cambio_residencia_municipio_despoblacion",
    [403, 438]
  ),
  fichaImplementadaFormula(
    "madrid_vivienda_municipios_despoblacion",
    [403, 438]
  ),
  fichaImplementadaFormula(
    "madrid_cuidado_hijos_mayores_dependientes_discapacidad",
    [403, 438]
  ),
  fichaImplementadaFormula(
    "madrid_intereses_vivienda_jovenes_menores_30",
    [403, 438]
  ),
  fichaImplementadaFormula(
    "madrid_intereses_estudios_grado_master_doctorado",
    [403, 438]
  ),
  fichaImplementadaFormula(
    "madrid_vivienda_nacimiento_adopcion_hijos",
    [403, 438]
  ),
  fichaImplementadaFormula("madrid_condicion_familia_numerosa", [403, 438]),
  fichaImplementadaFormula(
    "madrid_familias_dos_descendientes_ingresos_reducidos",
    [403, 438]
  ),
  fichaImplementadaFormula(
    "madrid_inversion_entidades_nuevas_reciente_creacion",
    [403, 438]
  ),
  fichaImplementadaFormula("madrid_autoempleo_jovenes_menores_35", [403, 438]),
  fichaImplementadaFormula(
    "madrid_inversiones_mercado_alternativo_bursatil",
    [403, 438]
  ),
  fichaImplementadaFormula(
    "madrid_inversiones_nuevos_contribuyentes_extranjero",
    [403, 438]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const MURCIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementadaFormula("murcia_vivienda_jovenes_hasta_40", [439, 480]),
  fichaImplementadaFormula(
    "murcia_donativos_patrimonio_cultural_actividades",
    [439, 480]
  ),
  fichaImplementadaFormula(
    "murcia_donativos_investigacion_biosanitaria",
    [439, 480]
  ),
  fichaImplementadaFormula(
    "murcia_donaciones_bienes_patrimonio_cultural",
    [439, 480]
  ),
  fichaImplementadaFormula("murcia_dispositivos_ahorro_agua", [439, 480]),
  fichaImplementadaFormula(
    "murcia_instalaciones_recursos_energeticos_renovables",
    [439, 480]
  ),
  fichaImplementadaFormula(
    "murcia_inversion_entidades_nuevas_reciente_creacion",
    [439, 480]
  ),
  fichaImplementadaFormula("murcia_inversion_mab", [439, 480]),
  fichaImplementadaFormula("murcia_material_escolar_libros_texto", [439, 480]),
  fichaImplementadaFormula("murcia_nacimiento_adopcion", [439, 480]),
  fichaImplementadaFormula("murcia_contribuyentes_discapacidad", [439, 480]),
  fichaImplementadaFormula("murcia_conciliacion", [439, 480]),
  fichaImplementadaFormula(
    "murcia_acogimiento_mayores_65_discapacidad",
    [439, 480]
  ),
  fichaImplementadaFormula("murcia_mujeres_trabajadoras", [439, 480]),
  fichaImplementadaFormula(
    "murcia_nueva_vivienda_o_ampliacion_familias_numerosas",
    [439, 480]
  ),
  fichaImplementadaFormula("murcia_familia_monoparental", [439, 480]),
  fichaImplementadaFormula("murcia_ensenanza_idiomas", [439, 480]),
  fichaImplementadaFormula("murcia_acceso_internet", [439, 480]),
  fichaImplementadaFormula("murcia_vehiculos_electricos", [439, 480]),
  fichaImplementadaFormula("murcia_recarga_vehiculos_electricos", [439, 480]),
  fichaImplementadaFormula(
    "murcia_cristales_lentes_soluciones_limpieza",
    [439, 480]
  ),
  fichaImplementadaFormula("murcia_deporte_actividades_saludables", [439, 480]),
  fichaImplementadaFormula("murcia_enfermedades_raras", [439, 480]),
  fichaImplementadaFormula("murcia_inversion_economia_social", [439, 480]),
  fichaImplementadaFormula(
    "murcia_regimen_transitorio_inversion_vivienda_habitual",
    [439, 480]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const RIOJA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementadaFormula(
    "rioja_vivienda_habitual_pequenos_municipios",
    [481, 526]
  ),
  fichaImplementadaFormula(
    "rioja_escuelas_infantiles_pequenos_municipios",
    [481, 526]
  ),
  fichaImplementadaFormula(
    "rioja_menor_acogimiento_guarda_adopcion",
    [481, 526]
  ),
  fichaImplementadaFormula("rioja_hijo_0_3_pequenos_municipios", [481, 526]),
  fichaImplementadaFormula("rioja_hijo_0_3_escolarizado", [481, 526]),
  fichaImplementadaFormula("rioja_vehiculos_electricos_nuevos", [481, 526]),
  fichaImplementadaFormula(
    "rioja_fijacion_poblacion_ocupada_medio_rural",
    [481, 526]
  ),
  fichaImplementadaFormula("rioja_internet_jovenes_emancipados", [481, 526]),
  fichaImplementadaFormula("rioja_luz_gas_jovenes_emancipados", [481, 526]),
  fichaImplementadaFormula(
    "rioja_inversion_vivienda_jovenes_menores_36",
    [481, 526]
  ),
  fichaImplementadaFormula("rioja_bicicletas_pedaleo_no_asistido", [481, 526]),
  fichaImplementadaFormula(
    "rioja_obras_rehabilitacion_vivienda_habitual",
    [481, 526]
  ),
  fichaImplementadaFormula(
    "rioja_adquisicion_construccion_vivienda_jovenes",
    [481, 526]
  ),
  fichaImplementadaFormula("rioja_segunda_vivienda_medio_rural", [481, 526]),
  fichaImplementadaFormula(
    "rioja_adecuacion_vivienda_discapacidad",
    [481, 526]
  ),
  fichaImplementadaFormula("rioja_donaciones_fomento_mecenazgo", [481, 526]),
  fichaImplementadaFormula("rioja_cantidades_patrimonio_historico", [481, 526]),
  fichaImplementadaFormula("rioja_ejercicio_fisico_deporte", [481, 526]),
  fichaImplementadaFormula("rioja_enfermos_ela", [481, 526]),
  fichaImplementadaFormula(
    "rioja_cuotas_organizaciones_profesionales_agrarias",
    [481, 526]
  ),
  fichaImplementadaFormula(
    "rioja_paliar_subida_intereses_hipotecarios",
    [481, 526]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const VALENCIANA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementadaFormula(
    "valenciana_nacimiento_adopcion_multiples",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_nacimiento_adopcion_acogimiento_discapacidad",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_familia_numerosa_monoparental",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_custodia_guarderias_menores_3",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_conciliacion_trabajo_familia",
    [527, 624]
  ),
  fichaImplementadaFormula("valenciana_discapacidad_65", [527, 624]),
  fichaImplementadaFormula(
    "valenciana_empleados_hogar_cuidado_personas",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_arrendador_renta_precio_referencia",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_primera_vivienda_menores_35",
    [527, 624]
  ),
  fichaImplementadaFormula("valenciana_vivienda_discapacidad", [527, 624]),
  fichaImplementadaFormula("valenciana_vivienda_ayudas_publicas", [527, 624]),
  fichaImplementadaFormula(
    "valenciana_arrendamiento_actividad_distinto_municipio",
    [527, 624]
  ),
  fichaImplementadaFormula("valenciana_autoconsumo_renovables", [527, 624]),
  fichaImplementadaFormula(
    "valenciana_donaciones_finalidad_ecologica",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_donaciones_bienes_patrimonio_cultural",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_donativos_conservacion_patrimonio_cultural",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_conservacion_patrimonio_cultural_titulares",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_donaciones_lengua_valenciana",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_donaciones_cesiones_fines_culturales_cientificos_deportivos",
    [527, 624]
  ),
  fichaImplementadaFormula("valenciana_dos_o_mas_descendientes", [527, 624]),
  fichaImplementadaFormula(
    "valenciana_incremento_costes_financiacion_vivienda",
    [527, 624]
  ),
  fichaImplementadaFormula("valenciana_material_escolar", [527, 624]),
  fichaImplementadaFormula(
    "valenciana_obras_conservacion_mejora_periodo",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_obras_conservacion_mejora_2014_2015",
    [527, 624]
  ),
  fichaImplementadaFormula("valenciana_abonos_culturales", [527, 624]),
  fichaImplementadaFormula("valenciana_vehiculos_orden_5_2020", [527, 624]),
  fichaImplementadaFormula(
    "valenciana_inversion_entidades_nuevas_reciente_creacion",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_municipio_riesgo_despoblamiento",
    [527, 624]
  ),
  fichaImplementadaFormula("valenciana_tratamientos_fertilidad", [527, 624]),
  fichaImplementadaFormula("valenciana_gastos_salud", [527, 624]),
  fichaImplementadaFormula("valenciana_fomento_formacion_musical", [527, 624]),
  fichaImplementadaFormula("valenciana_ayudas_publicas_erte_covid", [527, 624]),
  fichaImplementadaFormula(
    "valenciana_donaciones_covid_investigacion",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_donaciones_covid_gastos_crisis_sanitaria",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_dana_danos_materiales_vivienda_habitual",
    [527, 624]
  ),
  fichaImplementadaFormula(
    "valenciana_dana_aportaciones_fondos_propios_entidades",
    [527, 624]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const BALEARS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "balears_mejora_sostenibilidad_vivienda",
    nombreCatalogadoDesdeCodigo("balears_mejora_sostenibilidad_vivienda"),
    categoriaCatalogadaDesdeCodigo("balears_mejora_sostenibilidad_vivienda"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_mejora_sostenibilidad_vivienda:importe",
      "balears_mejora_sostenibilidad_vivienda:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_subvenciones_zona_emergencia_proteccion_civil",
    nombreCatalogadoDesdeCodigo(
      "balears_subvenciones_zona_emergencia_proteccion_civil"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_subvenciones_zona_emergencia_proteccion_civil"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_subvenciones_zona_emergencia_proteccion_civil:importe",
      "balears_subvenciones_zona_emergencia_proteccion_civil:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_idiomas_extraescolares",
    nombreCatalogadoDesdeCodigo("balears_idiomas_extraescolares"),
    categoriaCatalogadaDesdeCodigo("balears_idiomas_extraescolares"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_idiomas_extraescolares:importe",
      "balears_idiomas_extraescolares:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_estudios_superiores_fuera_isla",
    nombreCatalogadoDesdeCodigo("balears_estudios_superiores_fuera_isla"),
    categoriaCatalogadaDesdeCodigo("balears_estudios_superiores_fuera_isla"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_estudios_superiores_fuera_isla:importe",
      "balears_estudios_superiores_fuera_isla:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_arrendador_vivienda_permanente_primas_seguro",
    nombreCatalogadoDesdeCodigo(
      "balears_arrendador_vivienda_permanente_primas_seguro"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_arrendador_vivienda_permanente_primas_seguro"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_arrendador_vivienda_permanente_primas_seguro:importe",
      "balears_arrendador_vivienda_permanente_primas_seguro:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_arrendador_vivienda_permanente_otros_gastos",
    nombreCatalogadoDesdeCodigo(
      "balears_arrendador_vivienda_permanente_otros_gastos"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_arrendador_vivienda_permanente_otros_gastos"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_arrendador_vivienda_permanente_otros_gastos:importe",
      "balears_arrendador_vivienda_permanente_otros_gastos:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_arrendamiento_traslado_laboral",
    nombreCatalogadoDesdeCodigo("balears_arrendamiento_traslado_laboral"),
    categoriaCatalogadaDesdeCodigo("balears_arrendamiento_traslado_laboral"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_arrendamiento_traslado_laboral:importe",
      "balears_arrendamiento_traslado_laboral:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento",
    nombreCatalogadoDesdeCodigo(
      "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento:importe",
      "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_donaciones_investigacion_desarrollo_innovacion",
    nombreCatalogadoDesdeCodigo(
      "balears_donaciones_investigacion_desarrollo_innovacion"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_donaciones_investigacion_desarrollo_innovacion"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_donaciones_investigacion_desarrollo_innovacion:importe",
      "balears_donaciones_investigacion_desarrollo_innovacion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_mecenazgo_cultural_cientifico_tecnologico",
    nombreCatalogadoDesdeCodigo(
      "balears_mecenazgo_cultural_cientifico_tecnologico"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_mecenazgo_cultural_cientifico_tecnologico"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_mecenazgo_cultural_cientifico_tecnologico:importe",
      "balears_mecenazgo_cultural_cientifico_tecnologico:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_mecenazgo_deportivo",
    nombreCatalogadoDesdeCodigo("balears_mecenazgo_deportivo"),
    categoriaCatalogadaDesdeCodigo("balears_mecenazgo_deportivo"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_mecenazgo_deportivo:importe",
      "balears_mecenazgo_deportivo:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_fomento_lengua_catalana",
    nombreCatalogadoDesdeCodigo("balears_fomento_lengua_catalana"),
    categoriaCatalogadaDesdeCodigo("balears_fomento_lengua_catalana"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_fomento_lengua_catalana:importe",
      "balears_fomento_lengua_catalana:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_entidades_tercer_sector",
    nombreCatalogadoDesdeCodigo("balears_entidades_tercer_sector"),
    categoriaCatalogadaDesdeCodigo("balears_entidades_tercer_sector"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_entidades_tercer_sector:importe",
      "balears_entidades_tercer_sector:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_declarantes_discapacidad_o_descendientes_discapacidad",
    nombreCatalogadoDesdeCodigo(
      "balears_declarantes_discapacidad_o_descendientes_discapacidad"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_declarantes_discapacidad_o_descendientes_discapacidad"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_declarantes_discapacidad_o_descendientes_discapacidad:importe",
      "balears_declarantes_discapacidad_o_descendientes_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_conciliacion_menores_6",
    nombreCatalogadoDesdeCodigo("balears_conciliacion_menores_6"),
    categoriaCatalogadaDesdeCodigo("balears_conciliacion_menores_6"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_conciliacion_menores_6:importe",
      "balears_conciliacion_menores_6:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_adopcion",
    nombreCatalogadoDesdeCodigo("balears_adopcion"),
    categoriaCatalogadaDesdeCodigo("balears_adopcion"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    ["balears_adopcion:importe", "balears_adopcion:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_gastos_ela",
    nombreCatalogadoDesdeCodigo("balears_gastos_ela"),
    categoriaCatalogadaDesdeCodigo("balears_gastos_ela"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    ["balears_gastos_ela:importe", "balears_gastos_ela:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_inversion_entidades_nuevas_reciente_creacion",
    nombreCatalogadoDesdeCodigo(
      "balears_inversion_entidades_nuevas_reciente_creacion"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_inversion_entidades_nuevas_reciente_creacion"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_inversion_entidades_nuevas_reciente_creacion:importe",
      "balears_inversion_entidades_nuevas_reciente_creacion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_fomento_autoocupacion",
    nombreCatalogadoDesdeCodigo("balears_fomento_autoocupacion"),
    categoriaCatalogadaDesdeCodigo("balears_fomento_autoocupacion"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_fomento_autoocupacion:importe",
      "balears_fomento_autoocupacion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_plazas_dificil_cobertura",
    nombreCatalogadoDesdeCodigo("balears_plazas_dificil_cobertura"),
    categoriaCatalogadaDesdeCodigo("balears_plazas_dificil_cobertura"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 130 a 166.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [130, 166],
    [
      "balears_plazas_dificil_cobertura:importe",
      "balears_plazas_dificil_cobertura:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const CANARIAS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "canarias_donaciones_finalidad_ecologica",
    nombreCatalogadoDesdeCodigo("canarias_donaciones_finalidad_ecologica"),
    categoriaCatalogadaDesdeCodigo("canarias_donaciones_finalidad_ecologica"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_donaciones_finalidad_ecologica:importe",
      "canarias_donaciones_finalidad_ecologica:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_donaciones_patrimonio_historico",
    nombreCatalogadoDesdeCodigo("canarias_donaciones_patrimonio_historico"),
    categoriaCatalogadaDesdeCodigo("canarias_donaciones_patrimonio_historico"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_donaciones_patrimonio_historico:importe",
      "canarias_donaciones_patrimonio_historico:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia",
    nombreCatalogadoDesdeCodigo(
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia:importe",
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_donaciones_entidades_sin_animo_lucro",
    nombreCatalogadoDesdeCodigo(
      "canarias_donaciones_entidades_sin_animo_lucro"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_donaciones_entidades_sin_animo_lucro"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_donaciones_entidades_sin_animo_lucro:importe",
      "canarias_donaciones_entidades_sin_animo_lucro:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_restauracion_bienes_interes_cultural",
    nombreCatalogadoDesdeCodigo(
      "canarias_restauracion_bienes_interes_cultural"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_restauracion_bienes_interes_cultural"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_restauracion_bienes_interes_cultural:importe",
      "canarias_restauracion_bienes_interes_cultural:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_estudios_educacion_superior",
    nombreCatalogadoDesdeCodigo("canarias_estudios_educacion_superior"),
    categoriaCatalogadaDesdeCodigo("canarias_estudios_educacion_superior"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_estudios_educacion_superior:importe",
      "canarias_estudios_educacion_superior:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_estudios_no_superiores",
    nombreCatalogadoDesdeCodigo("canarias_estudios_no_superiores"),
    categoriaCatalogadaDesdeCodigo("canarias_estudios_no_superiores"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_estudios_no_superiores:importe",
      "canarias_estudios_no_superiores:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_traslado_residencia_otra_isla_trabajo",
    nombreCatalogadoDesdeCodigo(
      "canarias_traslado_residencia_otra_isla_trabajo"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_traslado_residencia_otra_isla_trabajo"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_traslado_residencia_otra_isla_trabajo:importe",
      "canarias_traslado_residencia_otra_isla_trabajo:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_inversion_entidades_nuevas_reciente_creacion",
    nombreCatalogadoDesdeCodigo(
      "canarias_inversion_entidades_nuevas_reciente_creacion"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_inversion_entidades_nuevas_reciente_creacion"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_inversion_entidades_nuevas_reciente_creacion:importe",
      "canarias_inversion_entidades_nuevas_reciente_creacion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_acogimiento_menores",
    nombreCatalogadoDesdeCodigo("canarias_acogimiento_menores"),
    categoriaCatalogadaDesdeCodigo("canarias_acogimiento_menores"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_acogimiento_menores:importe",
      "canarias_acogimiento_menores:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_familias_monoparentales",
    nombreCatalogadoDesdeCodigo("canarias_familias_monoparentales"),
    categoriaCatalogadaDesdeCodigo("canarias_familias_monoparentales"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_familias_monoparentales:importe",
      "canarias_familias_monoparentales:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_custodia_guarderias",
    nombreCatalogadoDesdeCodigo("canarias_custodia_guarderias"),
    categoriaCatalogadaDesdeCodigo("canarias_custodia_guarderias"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_custodia_guarderias:importe",
      "canarias_custodia_guarderias:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_inversion_vivienda_habitual",
    nombreCatalogadoDesdeCodigo("canarias_inversion_vivienda_habitual"),
    categoriaCatalogadaDesdeCodigo("canarias_inversion_vivienda_habitual"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_inversion_vivienda_habitual:importe",
      "canarias_inversion_vivienda_habitual:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_rehabilitacion_energetica_vivienda",
    nombreCatalogadoDesdeCodigo("canarias_rehabilitacion_energetica_vivienda"),
    categoriaCatalogadaDesdeCodigo(
      "canarias_rehabilitacion_energetica_vivienda"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_rehabilitacion_energetica_vivienda:importe",
      "canarias_rehabilitacion_energetica_vivienda:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_adecuacion_vivienda_discapacidad",
    nombreCatalogadoDesdeCodigo("canarias_adecuacion_vivienda_discapacidad"),
    categoriaCatalogadaDesdeCodigo("canarias_adecuacion_vivienda_discapacidad"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_adecuacion_vivienda_discapacidad:importe",
      "canarias_adecuacion_vivienda_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_arrendamiento_dacion_pago",
    nombreCatalogadoDesdeCodigo("canarias_arrendamiento_dacion_pago"),
    categoriaCatalogadaDesdeCodigo("canarias_arrendamiento_dacion_pago"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_arrendamiento_dacion_pago:importe",
      "canarias_arrendamiento_dacion_pago:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_adecuacion_inmueble_arrendamiento",
    nombreCatalogadoDesdeCodigo("canarias_adecuacion_inmueble_arrendamiento"),
    categoriaCatalogadaDesdeCodigo(
      "canarias_adecuacion_inmueble_arrendamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_adecuacion_inmueble_arrendamiento:importe",
      "canarias_adecuacion_inmueble_arrendamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_primas_seguro_impago_arrendamientos",
    nombreCatalogadoDesdeCodigo("canarias_primas_seguro_impago_arrendamientos"),
    categoriaCatalogadaDesdeCodigo(
      "canarias_primas_seguro_impago_arrendamientos"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_primas_seguro_impago_arrendamientos:importe",
      "canarias_primas_seguro_impago_arrendamientos:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_puesta_viviendas_mercado_arrendamiento",
    nombreCatalogadoDesdeCodigo(
      "canarias_puesta_viviendas_mercado_arrendamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_puesta_viviendas_mercado_arrendamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_puesta_viviendas_mercado_arrendamiento:importe",
      "canarias_puesta_viviendas_mercado_arrendamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_familiares_dependientes_discapacidad",
    nombreCatalogadoDesdeCodigo(
      "canarias_familiares_dependientes_discapacidad"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_familiares_dependientes_discapacidad"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_familiares_dependientes_discapacidad:importe",
      "canarias_familiares_dependientes_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_cuotas_seguridad_social_empleados_hogar",
    nombreCatalogadoDesdeCodigo(
      "canarias_cuotas_seguridad_social_empleados_hogar"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_cuotas_seguridad_social_empleados_hogar"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_cuotas_seguridad_social_empleados_hogar:importe",
      "canarias_cuotas_seguridad_social_empleados_hogar:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const CANTABRIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_obras_mejora",
    nombreCatalogadoDesdeCodigo("cantabria_obras_mejora"),
    categoriaCatalogadaDesdeCodigo("cantabria_obras_mejora"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    ["cantabria_obras_mejora:importe", "cantabria_obras_mejora:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad",
    nombreCatalogadoDesdeCodigo(
      "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad:importe",
      "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_acogimiento_familiar_menores",
    nombreCatalogadoDesdeCodigo("cantabria_acogimiento_familiar_menores"),
    categoriaCatalogadaDesdeCodigo("cantabria_acogimiento_familiar_menores"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_acogimiento_familiar_menores:importe",
      "cantabria_acogimiento_familiar_menores:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_inversion_entidades_nuevas_reciente_creacion",
    nombreCatalogadoDesdeCodigo(
      "cantabria_inversion_entidades_nuevas_reciente_creacion"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_inversion_entidades_nuevas_reciente_creacion"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_inversion_entidades_nuevas_reciente_creacion:importe",
      "cantabria_inversion_entidades_nuevas_reciente_creacion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_gastos_enfermedad",
    nombreCatalogadoDesdeCodigo("cantabria_gastos_enfermedad"),
    categoriaCatalogadaDesdeCodigo("cantabria_gastos_enfermedad"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_gastos_enfermedad:importe",
      "cantabria_gastos_enfermedad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_gastos_guarderia",
    nombreCatalogadoDesdeCodigo("cantabria_gastos_guarderia"),
    categoriaCatalogadaDesdeCodigo("cantabria_gastos_guarderia"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    ["cantabria_gastos_guarderia:importe", "cantabria_gastos_guarderia:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_familias_monoparentales",
    nombreCatalogadoDesdeCodigo("cantabria_familias_monoparentales"),
    categoriaCatalogadaDesdeCodigo("cantabria_familias_monoparentales"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_familias_monoparentales:importe",
      "cantabria_familias_monoparentales:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_arrendamiento_municipios_riesgo_despoblamiento",
    nombreCatalogadoDesdeCodigo(
      "cantabria_arrendamiento_municipios_riesgo_despoblamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_arrendamiento_municipios_riesgo_despoblamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_arrendamiento_municipios_riesgo_despoblamiento:importe",
      "cantabria_arrendamiento_municipios_riesgo_despoblamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_guarderia_municipios_riesgo_despoblamiento",
    nombreCatalogadoDesdeCodigo(
      "cantabria_guarderia_municipios_riesgo_despoblamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_guarderia_municipios_riesgo_despoblamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_guarderia_municipios_riesgo_despoblamiento:importe",
      "cantabria_guarderia_municipios_riesgo_despoblamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_traslado_residencia_motivos_laborales_despoblamiento",
    nombreCatalogadoDesdeCodigo(
      "cantabria_traslado_residencia_motivos_laborales_despoblamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_traslado_residencia_motivos_laborales_despoblamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_traslado_residencia_motivos_laborales_despoblamiento:importe",
      "cantabria_traslado_residencia_motivos_laborales_despoblamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_traslado_estudios_despoblamiento",
    nombreCatalogadoDesdeCodigo("cantabria_traslado_estudios_despoblamiento"),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_traslado_estudios_despoblamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_traslado_estudios_despoblamiento:importe",
      "cantabria_traslado_estudios_despoblamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_residencia_municipio_riesgo_despoblamiento",
    nombreCatalogadoDesdeCodigo(
      "cantabria_residencia_municipio_riesgo_despoblamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_residencia_municipio_riesgo_despoblamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_residencia_municipio_riesgo_despoblamiento:importe",
      "cantabria_residencia_municipio_riesgo_despoblamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_inversiones_donaciones_economia_social",
    nombreCatalogadoDesdeCodigo(
      "cantabria_inversiones_donaciones_economia_social"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_inversiones_donaciones_economia_social"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_inversiones_donaciones_economia_social:importe",
      "cantabria_inversiones_donaciones_economia_social:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_gastos_educacion",
    nombreCatalogadoDesdeCodigo("cantabria_gastos_educacion"),
    categoriaCatalogadaDesdeCodigo("cantabria_gastos_educacion"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    ["cantabria_gastos_educacion:importe", "cantabria_gastos_educacion:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_ayuda_domestica",
    nombreCatalogadoDesdeCodigo("cantabria_ayuda_domestica"),
    categoriaCatalogadaDesdeCodigo("cantabria_ayuda_domestica"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    ["cantabria_ayuda_domestica:importe", "cantabria_ayuda_domestica:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_inversiones_nuevos_contribuyentes_extranjero",
    nombreCatalogadoDesdeCodigo(
      "cantabria_inversiones_nuevos_contribuyentes_extranjero"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_inversiones_nuevos_contribuyentes_extranjero"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_inversiones_nuevos_contribuyentes_extranjero:importe",
      "cantabria_inversiones_nuevos_contribuyentes_extranjero:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_desplazamiento_permanencia_nuevos_residentes",
    nombreCatalogadoDesdeCodigo(
      "cantabria_desplazamiento_permanencia_nuevos_residentes"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_desplazamiento_permanencia_nuevos_residentes"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_desplazamiento_permanencia_nuevos_residentes:importe",
      "cantabria_desplazamiento_permanencia_nuevos_residentes:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_arrendamiento_viviendas_vacias",
    nombreCatalogadoDesdeCodigo("cantabria_arrendamiento_viviendas_vacias"),
    categoriaCatalogadaDesdeCodigo("cantabria_arrendamiento_viviendas_vacias"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [207, 237],
    [
      "cantabria_arrendamiento_viviendas_vacias:importe",
      "cantabria_arrendamiento_viviendas_vacias:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const CLM_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "clm_familia_monoparental",
    nombreCatalogadoDesdeCodigo("clm_familia_monoparental"),
    categoriaCatalogadaDesdeCodigo("clm_familia_monoparental"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    ["clm_familia_monoparental:importe", "clm_familia_monoparental:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_libros_idiomas_otros_gastos_educacion",
    nombreCatalogadoDesdeCodigo("clm_libros_idiomas_otros_gastos_educacion"),
    categoriaCatalogadaDesdeCodigo("clm_libros_idiomas_otros_gastos_educacion"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_libros_idiomas_otros_gastos_educacion:importe",
      "clm_libros_idiomas_otros_gastos_educacion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_gastos_guarderia",
    nombreCatalogadoDesdeCodigo("clm_gastos_guarderia"),
    categoriaCatalogadaDesdeCodigo("clm_gastos_guarderia"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    ["clm_gastos_guarderia:importe", "clm_gastos_guarderia:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_cuidado_ascendientes_mayores_75",
    nombreCatalogadoDesdeCodigo("clm_cuidado_ascendientes_mayores_75"),
    categoriaCatalogadaDesdeCodigo("clm_cuidado_ascendientes_mayores_75"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_cuidado_ascendientes_mayores_75:importe",
      "clm_cuidado_ascendientes_mayores_75:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_acogimiento_familiar_no_remunerado_menores:importe",
      "clm_acogimiento_familiar_no_remunerado_menores:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_acogimiento_no_remunerado_mayores_65_discapacidad:importe",
      "clm_acogimiento_no_remunerado_mayores_65_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_arrendamiento_menores_36",
    nombreCatalogadoDesdeCodigo("clm_arrendamiento_menores_36"),
    categoriaCatalogadaDesdeCodigo("clm_arrendamiento_menores_36"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_arrendamiento_menores_36:importe",
      "clm_arrendamiento_menores_36:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_arrendamiento_dacion_pago",
    nombreCatalogadoDesdeCodigo("clm_arrendamiento_dacion_pago"),
    categoriaCatalogadaDesdeCodigo("clm_arrendamiento_dacion_pago"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_arrendamiento_dacion_pago:importe",
      "clm_arrendamiento_dacion_pago:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_arrendamiento_familias_numerosas",
    nombreCatalogadoDesdeCodigo("clm_arrendamiento_familias_numerosas"),
    categoriaCatalogadaDesdeCodigo("clm_arrendamiento_familias_numerosas"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_arrendamiento_familias_numerosas:importe",
      "clm_arrendamiento_familias_numerosas:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_arrendamiento_familias_monoparentales",
    nombreCatalogadoDesdeCodigo("clm_arrendamiento_familias_monoparentales"),
    categoriaCatalogadaDesdeCodigo("clm_arrendamiento_familias_monoparentales"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_arrendamiento_familias_monoparentales:importe",
      "clm_arrendamiento_familias_monoparentales:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_arrendamiento_personas_discapacidad",
    nombreCatalogadoDesdeCodigo("clm_arrendamiento_personas_discapacidad"),
    categoriaCatalogadaDesdeCodigo("clm_arrendamiento_personas_discapacidad"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_arrendamiento_personas_discapacidad:importe",
      "clm_arrendamiento_personas_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_donaciones_cooperacion_lucha_pobreza_discapacidad:importe",
      "clm_donaciones_cooperacion_lucha_pobreza_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_donaciones_idi_innovacion_empresarial",
    nombreCatalogadoDesdeCodigo("clm_donaciones_idi_innovacion_empresarial"),
    categoriaCatalogadaDesdeCodigo("clm_donaciones_idi_innovacion_empresarial"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_donaciones_idi_innovacion_empresarial:importe",
      "clm_donaciones_idi_innovacion_empresarial:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_donaciones_bienes_culturales_mecenazgo",
    nombreCatalogadoDesdeCodigo("clm_donaciones_bienes_culturales_mecenazgo"),
    categoriaCatalogadaDesdeCodigo(
      "clm_donaciones_bienes_culturales_mecenazgo"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_donaciones_bienes_culturales_mecenazgo:importe",
      "clm_donaciones_bienes_culturales_mecenazgo:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_intereses_primera_vivienda_menores_40",
    nombreCatalogadoDesdeCodigo("clm_intereses_primera_vivienda_menores_40"),
    categoriaCatalogadaDesdeCodigo("clm_intereses_primera_vivienda_menores_40"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_intereses_primera_vivienda_menores_40:importe",
      "clm_intereses_primera_vivienda_menores_40:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_residencia_zonas_rurales",
    nombreCatalogadoDesdeCodigo("clm_residencia_zonas_rurales"),
    categoriaCatalogadaDesdeCodigo("clm_residencia_zonas_rurales"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_residencia_zonas_rurales:importe",
      "clm_residencia_zonas_rurales:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales:importe",
      "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_traslado_vivienda_habitual",
    nombreCatalogadoDesdeCodigo("clm_traslado_vivienda_habitual"),
    categoriaCatalogadaDesdeCodigo("clm_traslado_vivienda_habitual"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_traslado_vivienda_habitual:importe",
      "clm_traslado_vivienda_habitual:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_inversion_acciones_participaciones_mercantiles:importe",
      "clm_inversion_acciones_participaciones_mercantiles:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_inversion_economia_social",
    nombreCatalogadoDesdeCodigo("clm_inversion_economia_social"),
    categoriaCatalogadaDesdeCodigo("clm_inversion_economia_social"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_inversion_economia_social:importe",
      "clm_inversion_economia_social:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_ahorro_inversion_primera_vivienda",
    nombreCatalogadoDesdeCodigo("clm_ahorro_inversion_primera_vivienda"),
    categoriaCatalogadaDesdeCodigo("clm_ahorro_inversion_primera_vivienda"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_ahorro_inversion_primera_vivienda:importe",
      "clm_ahorro_inversion_primera_vivienda:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "clm_controles_veterinarios_perros_asistencia",
    nombreCatalogadoDesdeCodigo("clm_controles_veterinarios_perros_asistencia"),
    categoriaCatalogadaDesdeCodigo(
      "clm_controles_veterinarios_perros_asistencia"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 238 a 281.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [238, 281],
    [
      "clm_controles_veterinarios_perros_asistencia:importe",
      "clm_controles_veterinarios_perros_asistencia:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const CYL_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "cyl_partos_adopciones_multiples",
    nombreCatalogadoDesdeCodigo("cyl_partos_adopciones_multiples"),
    categoriaCatalogadaDesdeCodigo("cyl_partos_adopciones_multiples"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    [
      "cyl_partos_adopciones_multiples:importe",
      "cyl_partos_adopciones_multiples:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_gastos_adopcion",
    nombreCatalogadoDesdeCodigo("cyl_gastos_adopcion"),
    categoriaCatalogadaDesdeCodigo("cyl_gastos_adopcion"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    ["cyl_gastos_adopcion:importe", "cyl_gastos_adopcion:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_cuidado_hijos_menores",
    nombreCatalogadoDesdeCodigo("cyl_cuidado_hijos_menores"),
    categoriaCatalogadaDesdeCodigo("cyl_cuidado_hijos_menores"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    ["cyl_cuidado_hijos_menores:importe", "cyl_cuidado_hijos_menores:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_cuotas_seguridad_social_empleados_hogar",
    nombreCatalogadoDesdeCodigo("cyl_cuotas_seguridad_social_empleados_hogar"),
    categoriaCatalogadaDesdeCodigo(
      "cyl_cuotas_seguridad_social_empleados_hogar"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    [
      "cyl_cuotas_seguridad_social_empleados_hogar:importe",
      "cyl_cuotas_seguridad_social_empleados_hogar:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_contribuyentes_discapacidad",
    nombreCatalogadoDesdeCodigo("cyl_contribuyentes_discapacidad"),
    categoriaCatalogadaDesdeCodigo("cyl_contribuyentes_discapacidad"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    [
      "cyl_contribuyentes_discapacidad:importe",
      "cyl_contribuyentes_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_vivienda_jovenes_medio_rural",
    nombreCatalogadoDesdeCodigo("cyl_vivienda_jovenes_medio_rural"),
    categoriaCatalogadaDesdeCodigo("cyl_vivienda_jovenes_medio_rural"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    [
      "cyl_vivienda_jovenes_medio_rural:importe",
      "cyl_vivienda_jovenes_medio_rural:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad",
    nombreCatalogadoDesdeCodigo(
      "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    [
      "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad:importe",
      "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_rehabilitacion_viviendas_medio_rural_alquiler",
    nombreCatalogadoDesdeCodigo(
      "cyl_rehabilitacion_viviendas_medio_rural_alquiler"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cyl_rehabilitacion_viviendas_medio_rural_alquiler"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    [
      "cyl_rehabilitacion_viviendas_medio_rural_alquiler:importe",
      "cyl_rehabilitacion_viviendas_medio_rural_alquiler:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_fomento_emprendimiento",
    nombreCatalogadoDesdeCodigo("cyl_fomento_emprendimiento"),
    categoriaCatalogadaDesdeCodigo("cyl_fomento_emprendimiento"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    ["cyl_fomento_emprendimiento:importe", "cyl_fomento_emprendimiento:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_recuperacion_patrimonio_historico_cultural_natural",
    nombreCatalogadoDesdeCodigo(
      "cyl_recuperacion_patrimonio_historico_cultural_natural"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cyl_recuperacion_patrimonio_historico_cultural_natural"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    [
      "cyl_recuperacion_patrimonio_historico_cultural_natural:importe",
      "cyl_recuperacion_patrimonio_historico_cultural_natural:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_donaciones_fundaciones_patrimonio",
    nombreCatalogadoDesdeCodigo("cyl_donaciones_fundaciones_patrimonio"),
    categoriaCatalogadaDesdeCodigo("cyl_donaciones_fundaciones_patrimonio"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    [
      "cyl_donaciones_fundaciones_patrimonio:importe",
      "cyl_donaciones_fundaciones_patrimonio:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_donaciones_idi",
    nombreCatalogadoDesdeCodigo("cyl_donaciones_idi"),
    categoriaCatalogadaDesdeCodigo("cyl_donaciones_idi"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    ["cyl_donaciones_idi:importe", "cyl_donaciones_idi:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_movilidad_sostenible",
    nombreCatalogadoDesdeCodigo("cyl_movilidad_sostenible"),
    categoriaCatalogadaDesdeCodigo("cyl_movilidad_sostenible"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    ["cyl_movilidad_sostenible:importe", "cyl_movilidad_sostenible:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cyl_vivienda_nueva_construccion",
    nombreCatalogadoDesdeCodigo("cyl_vivienda_nueva_construccion"),
    categoriaCatalogadaDesdeCodigo("cyl_vivienda_nueva_construccion"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [282, 313],
    [
      "cyl_vivienda_nueva_construccion:importe",
      "cyl_vivienda_nueva_construccion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 314 a 328.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [314, 328],
    [
      "cataluna_donativos_lengua_catalana_occitana:importe",
      "cataluna_donativos_lengua_catalana_occitana:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cataluna_donativos_idi",
    nombreCatalogadoDesdeCodigo("cataluna_donativos_idi"),
    categoriaCatalogadaDesdeCodigo("cataluna_donativos_idi"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 314 a 328.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [314, 328],
    ["cataluna_donativos_idi:importe", "cataluna_donativos_idi:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 314 a 328.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [314, 328],
    [
      "cataluna_donaciones_medio_ambiente_patrimonio_natural:importe",
      "cataluna_donaciones_medio_ambiente_patrimonio_natural:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cataluna_angel_inversor",
    nombreCatalogadoDesdeCodigo("cataluna_angel_inversor"),
    categoriaCatalogadaDesdeCodigo("cataluna_angel_inversor"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 314 a 328.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [314, 328],
    ["cataluna_angel_inversor:importe", "cataluna_angel_inversor:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 314 a 328.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [314, 328],
    [
      "cataluna_tramo_autonomico_inversion_vivienda_habitual:importe",
      "cataluna_tramo_autonomico_inversion_vivienda_habitual:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const EXTREMADURA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_partos_multiples",
    nombreCatalogadoDesdeCodigo("extremadura_partos_multiples"),
    categoriaCatalogadaDesdeCodigo("extremadura_partos_multiples"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_partos_multiples:importe",
      "extremadura_partos_multiples:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_acogimiento_menores",
    nombreCatalogadoDesdeCodigo("extremadura_acogimiento_menores"),
    categoriaCatalogadaDesdeCodigo("extremadura_acogimiento_menores"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_acogimiento_menores:importe",
      "extremadura_acogimiento_menores:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_cuidado_hijos_hasta_14",
    nombreCatalogadoDesdeCodigo("extremadura_cuidado_hijos_hasta_14"),
    categoriaCatalogadaDesdeCodigo("extremadura_cuidado_hijos_hasta_14"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_cuidado_hijos_hasta_14:importe",
      "extremadura_cuidado_hijos_hasta_14:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_contribuyentes_viudos",
    nombreCatalogadoDesdeCodigo("extremadura_contribuyentes_viudos"),
    categoriaCatalogadaDesdeCodigo("extremadura_contribuyentes_viudos"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_contribuyentes_viudos:importe",
      "extremadura_contribuyentes_viudos:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_vivienda_jovenes_victimas_terrorismo:importe",
      "extremadura_vivienda_jovenes_victimas_terrorismo:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_arrendadores_viviendas_vacias",
    nombreCatalogadoDesdeCodigo("extremadura_arrendadores_viviendas_vacias"),
    categoriaCatalogadaDesdeCodigo("extremadura_arrendadores_viviendas_vacias"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_arrendadores_viviendas_vacias:importe",
      "extremadura_arrendadores_viviendas_vacias:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler:importe",
      "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_material_escolar",
    nombreCatalogadoDesdeCodigo("extremadura_material_escolar"),
    categoriaCatalogadaDesdeCodigo("extremadura_material_escolar"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_material_escolar:importe",
      "extremadura_material_escolar:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_inversion_acciones_participaciones_mercantiles:importe",
      "extremadura_inversion_acciones_participaciones_mercantiles:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_vivienda_zonas_rurales",
    nombreCatalogadoDesdeCodigo("extremadura_vivienda_zonas_rurales"),
    categoriaCatalogadaDesdeCodigo("extremadura_vivienda_zonas_rurales"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_vivienda_zonas_rurales:importe",
      "extremadura_vivienda_zonas_rurales:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_residencia_municipios_menos_3000",
    nombreCatalogadoDesdeCodigo("extremadura_residencia_municipios_menos_3000"),
    categoriaCatalogadaDesdeCodigo(
      "extremadura_residencia_municipios_menos_3000"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_residencia_municipios_menos_3000:importe",
      "extremadura_residencia_municipios_menos_3000:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_intereses_vivienda_jovenes",
    nombreCatalogadoDesdeCodigo("extremadura_intereses_vivienda_jovenes"),
    categoriaCatalogadaDesdeCodigo("extremadura_intereses_vivienda_jovenes"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_intereses_vivienda_jovenes:importe",
      "extremadura_intereses_vivienda_jovenes:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
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
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_donaciones_entidades_culturales_deportistas:importe",
      "extremadura_donaciones_entidades_culturales_deportistas:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_traslado_residencia_habitual",
    nombreCatalogadoDesdeCodigo("extremadura_traslado_residencia_habitual"),
    categoriaCatalogadaDesdeCodigo("extremadura_traslado_residencia_habitual"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_traslado_residencia_habitual:importe",
      "extremadura_traslado_residencia_habitual:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_ayudas_subvenciones_ela",
    nombreCatalogadoDesdeCodigo("extremadura_ayudas_subvenciones_ela"),
    categoriaCatalogadaDesdeCodigo("extremadura_ayudas_subvenciones_ela"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_ayudas_subvenciones_ela:importe",
      "extremadura_ayudas_subvenciones_ela:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "extremadura_enfermos_ela_familiares",
    nombreCatalogadoDesdeCodigo("extremadura_enfermos_ela_familiares"),
    categoriaCatalogadaDesdeCodigo("extremadura_enfermos_ela_familiares"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 330 a 363.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [330, 363],
    [
      "extremadura_enfermos_ela_familiares:importe",
      "extremadura_enfermos_ela_familiares:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

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
      ],
    },
    aragon: {
      comunidad: "Aragón",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 2, 3 y 16",
      deducciones: [
        ...ARAGON_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
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
        ...ASTURIAS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
        ASTURIAS_ACOGIMIENTO_MAYORES_65_2025,
        ASTURIAS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
        ASTURIAS_FAMILIAS_NUMEROSAS_2025,
        ASTURIAS_CENTROS_CERO_TRES_2025,
      ],
    },
    "illes-balears": {
      comunidad: "Illes Balears",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 130 a 166",
      deducciones: [
        ...BALEARS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
        BALEARS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
        BALEARS_LIBROS_TEXTO_2025,
        BALEARS_NACIMIENTO_2025,
        BALEARS_GASTOS_MAYORES_65_DISCAPACIDAD_2025,
      ],
    },
    canarias: {
      comunidad: "Canarias",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 167 a 206",
      deducciones: [
        ...CANARIAS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
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
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 207 a 237",
      deducciones: [
        ...CANTABRIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
        CANTABRIA_ARRENDAMIENTO_JOVENES_MAYORES_DISCAPACIDAD_2025,
        CANTABRIA_CUIDADO_FAMILIARES_2025,
        CANTABRIA_NACIMIENTO_ADOPCION_HIJOS_2025,
      ],
    },
    "castilla-la-mancha": {
      comunidad: "Castilla-La Mancha",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 6, 7 y 22",
      deducciones: [
        ...CLM_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
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
        ...CYL_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
        CYL_FAMILIA_NUMEROSA_2025,
        CYL_NACIMIENTO_ADOPCION_HIJOS_2025,
        CYL_ARRENDAMIENTO_VIVIENDA_JOVENES_2025,
      ],
    },
    catalunya: {
      comunidad: "Catalunya",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 7, 8 y 24",
      deducciones: [
        ...CATALUNYA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
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
        ...EXTREMADURA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
        EXTREMADURA_TRABAJO_DEPENDIENTE_2025,
        EXTREMADURA_CUIDADO_FAMILIARES_DISCAPACIDAD_2025,
        EXTREMADURA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
      ],
    },
    galicia: {
      comunidad: "Galicia",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 8, 9, 26 y 27",
      deducciones: [
        ...GALICIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
        GALICIA_NACIMIENTO_ADOPCION_HIJOS_2025,
        GALICIA_FAMILIA_NUMEROSA_2025,
        GALICIA_ALQUILER_VIVIENDA_HABITUAL_2025,
      ],
    },
    madrid: {
      comunidad: "Comunidad de Madrid",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 9, 10 y 28",
      deducciones: [
        ...MADRID_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
        MADRID_NACIMIENTO_ADOPCION_2025,
        MADRID_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
        MADRID_GASTOS_EDUCATIVOS_2025,
      ],
    },
    murcia: {
      comunidad: "Región de Murcia",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 10, 11, 29 y 30",
      deducciones: [
        ...MURCIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
        MURCIA_GASTOS_GUARDERIA_2025,
        MURCIA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
        MURCIA_GASTOS_VETERINARIOS_2025,
      ],
    },
    "la-rioja": {
      comunidad: "La Rioja",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 11, 12, 31 y 32",
      deducciones: [
        ...RIOJA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
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
        ...VALENCIANA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
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
