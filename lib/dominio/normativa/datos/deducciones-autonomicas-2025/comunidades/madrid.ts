import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  fichaImplementadaFormula,
  nombreCatalogadoDesdeCodigo,
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

export const MADRID_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...MADRID_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  MADRID_NACIMIENTO_ADOPCION_2025,
  MADRID_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
  MADRID_GASTOS_EDUCATIVOS_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
