import type { FichaDeduccionAutonomica } from "../tipos"
import { fichaImplementada, fichaImplementadaFormula } from "../helpers"

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
  [482, 483]
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
  [502, 503, 504]
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
  [520]
)

export const RIOJA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementadaFormula(
    "rioja_vivienda_habitual_pequenos_municipios",
    [483, 484, 485]
  ),
  fichaImplementadaFormula(
    "rioja_escuelas_infantiles_pequenos_municipios",
    [485, 486, 487]
  ),
  fichaImplementadaFormula(
    "rioja_menor_acogimiento_guarda_adopcion",
    [487, 488, 489]
  ),
  fichaImplementadaFormula("rioja_hijo_0_3_pequenos_municipios", [489, 490]),
  fichaImplementadaFormula("rioja_hijo_0_3_escolarizado", [490, 491, 492]),
  fichaImplementadaFormula(
    "rioja_vehiculos_electricos_nuevos",
    [492, 493, 494]
  ),
  fichaImplementadaFormula(
    "rioja_fijacion_poblacion_ocupada_medio_rural",
    [494, 495]
  ),
  fichaImplementadaFormula(
    "rioja_internet_jovenes_emancipados",
    [495, 496, 497]
  ),
  fichaImplementadaFormula(
    "rioja_luz_gas_jovenes_emancipados",
    [497, 498, 499]
  ),
  fichaImplementadaFormula(
    "rioja_inversion_vivienda_jovenes_menores_36",
    [499, 500, 501, 502]
  ),
  fichaImplementadaFormula(
    "rioja_bicicletas_pedaleo_no_asistido",
    [504]
  ),
  fichaImplementadaFormula(
    "rioja_obras_rehabilitacion_vivienda_habitual",
    [504, 505, 506]
  ),
  fichaImplementadaFormula(
    "rioja_adquisicion_construccion_vivienda_jovenes",
    [506, 507, 508]
  ),
  fichaImplementadaFormula(
    "rioja_segunda_vivienda_medio_rural",
    [508, 509, 510]
  ),
  fichaImplementadaFormula(
    "rioja_adecuacion_vivienda_discapacidad",
    [510, 511]
  ),
  fichaImplementadaFormula(
    "rioja_donaciones_fomento_mecenazgo",
    [511, 512, 513, 514, 515, 516, 517]
  ),
  fichaImplementadaFormula("rioja_cantidades_patrimonio_historico", [517, 518]),
  fichaImplementadaFormula("rioja_ejercicio_fisico_deporte", [518, 519]),
  fichaImplementadaFormula("rioja_enfermos_ela", [519, 520]),
  fichaImplementadaFormula(
    "rioja_cuotas_organizaciones_profesionales_agrarias",
    [520, 521]
  ),
  fichaImplementadaFormula(
    "rioja_paliar_subida_intereses_hipotecarios",
    [521, 522, 523]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const RIOJA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...RIOJA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  RIOJA_NACIMIENTO_ADOPCION_HIJOS_2025,
  RIOJA_ARRENDAMIENTO_MENORES_36_2025,
  RIOJA_ENFERMEDAD_CELIACA_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
