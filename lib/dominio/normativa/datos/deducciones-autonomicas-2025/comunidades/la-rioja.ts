import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  fichaImplementadaFormula,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

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

export const RIOJA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...RIOJA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  RIOJA_NACIMIENTO_ADOPCION_HIJOS_2025,
  RIOJA_ARRENDAMIENTO_MENORES_36_2025,
  RIOJA_ENFERMEDAD_CELIACA_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
