import type { FichaDeduccionAutonomica } from "../tipos"
import { fichaImplementada, fichaImplementadaFormula } from "../helpers"

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
    "Base imponible total menos los mínimos personal y familiar hasta 22.000 euros: 360 euros primer hijo, 1.200 segundo, 2.400 tercero y sucesivos",
    "Base imponible total menos los mínimos personal y familiar desde 22.000,01 euros en año de nacimiento: 300 euros por hijo o 360 en parto múltiple",
    "Incremento del 20% en municipios de menos de 5.000 habitantes o fusionados/incorporados",
    "Duplicación si discapacidad del nacido/adoptado igual o superior al 33%",
  ],
  [365, 366, 367]
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
  [368, 369, 370]
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
  [373, 374]
)

export const GALICIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementadaFormula("galicia_familias_dos_hijos", [367, 368]),
  fichaImplementadaFormula("galicia_acogimiento_menores", [370, 371]),
  fichaImplementadaFormula("galicia_cuidado_hijos_menores", [371, 372, 373]),
  fichaImplementadaFormula(
    "galicia_discapacidad_mayor_65_ayuda_terceras_personas",
    [371, 372, 373]
  ),
  fichaImplementadaFormula("galicia_nuevas_tecnologias_hogares", [374, 375]),
  fichaImplementadaFormula(
    "galicia_inversion_entidades_nuevas_reciente_creacion",
    [375, 376, 377, 378]
  ),
  fichaImplementadaFormula(
    "galicia_inversion_entidades_nuevas_financiacion",
    [378, 379, 380, 381]
  ),
  fichaImplementadaFormula("galicia_inversion_mab", [381, 382]),
  fichaImplementadaFormula("galicia_donaciones_idi", [382, 383]),
  fichaImplementadaFormula(
    "galicia_climatizacion_agua_caliente_renovables",
    [383, 384]
  ),
  fichaImplementadaFormula(
    "galicia_rehabilitacion_centros_historicos",
    [384, 385]
  ),
  fichaImplementadaFormula(
    "galicia_inversion_empresas_agrarias",
    [385, 386, 387]
  ),
  fichaImplementadaFormula("galicia_ayudas_incendios_peifoga_2025", [387, 388]),
  fichaImplementadaFormula(
    "galicia_obras_eficiencia_energetica",
    [388, 389, 390]
  ),
  fichaImplementadaFormula("galicia_ayudas_deportistas_alto_nivel", [390, 391]),
  fichaImplementadaFormula("galicia_aldeas_modelo", [391, 392, 393]),
  fichaImplementadaFormula(
    "galicia_inversion_proyectos_especial_interes",
    [393, 394]
  ),
  fichaImplementadaFormula(
    "galicia_adecuacion_inmueble_vacio_arrendamiento",
    [394, 395, 396, 397]
  ),
  fichaImplementadaFormula(
    "galicia_arrendamiento_viviendas_vacias",
    [397, 398, 399]
  ),
  fichaImplementadaFormula("galicia_ayudas_ela_fenotipos", [399, 400]),
  fichaImplementadaFormula(
    "galicia_libros_texto_material_escolar",
    [400, 401, 402, 403]
  ),
  fichaImplementadaFormula("galicia_ayudas_talidomida", [403]),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const GALICIA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...GALICIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  GALICIA_NACIMIENTO_ADOPCION_HIJOS_2025,
  GALICIA_FAMILIA_NUMEROSA_2025,
  GALICIA_ALQUILER_VIVIENDA_HABITUAL_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
