import type { FichaDeduccionAutonomica } from "../tipos"
import { fichaImplementada, fichaImplementadaFormula } from "../helpers"

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

export const VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...VALENCIANA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  VALENCIANA_NACIMIENTO_ADOPCION_GUARDA_ACOGIMIENTO_2025,
  VALENCIANA_ASCENDIENTES_MAYORES_DISCAPACIDAD_2025,
  VALENCIANA_ARRENDAMIENTO_CESION_USO_VIVIENDA_2025,
  VALENCIANA_DEPORTE_ACTIVIDADES_SALUDABLES_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
