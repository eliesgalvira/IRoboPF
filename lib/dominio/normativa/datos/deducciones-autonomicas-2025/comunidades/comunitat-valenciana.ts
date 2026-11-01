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
    [529, 530, 531, 532, 533, 534]
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
    [553, 554, 555]
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
    [566, 567, 568, 569, 570]
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
  [616, 617, 618]
)

export const VALENCIANA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementadaFormula(
    "valenciana_nacimiento_adopcion_multiples",
    [534, 535]
  ),
  fichaImplementadaFormula(
    "valenciana_nacimiento_adopcion_acogimiento_discapacidad",
    [535, 536, 537, 538, 539]
  ),
  fichaImplementadaFormula(
    "valenciana_familia_numerosa_monoparental",
    [539, 540, 541, 542]
  ),
  fichaImplementadaFormula(
    "valenciana_custodia_guarderias_menores_3",
    [542, 543, 544, 545, 546]
  ),
  fichaImplementadaFormula(
    "valenciana_conciliacion_trabajo_familia",
    [546, 547, 548, 549, 550, 551]
  ),
  fichaImplementadaFormula("valenciana_discapacidad_65", [551, 552, 553]),
  fichaImplementadaFormula(
    "valenciana_empleados_hogar_cuidado_personas",
    [555, 556, 557, 558, 559]
  ),
  fichaImplementadaFormula(
    "valenciana_arrendador_renta_precio_referencia",
    [559, 560]
  ),
  fichaImplementadaFormula(
    "valenciana_primera_vivienda_menores_35",
    [560, 561, 562]
  ),
  fichaImplementadaFormula(
    "valenciana_vivienda_discapacidad",
    [562, 563, 564, 565]
  ),
  fichaImplementadaFormula("valenciana_vivienda_ayudas_publicas", [565, 566]),
  fichaImplementadaFormula(
    "valenciana_arrendamiento_actividad_distinto_municipio",
    [570, 571, 572]
  ),
  fichaImplementadaFormula(
    "valenciana_autoconsumo_renovables",
    [572, 573, 574, 575, 576]
  ),
  fichaImplementadaFormula(
    "valenciana_donaciones_finalidad_ecologica",
    [576, 577]
  ),
  fichaImplementadaFormula(
    "valenciana_donaciones_bienes_patrimonio_cultural",
    [577, 578]
  ),
  fichaImplementadaFormula(
    "valenciana_donativos_conservacion_patrimonio_cultural",
    [578, 579, 580]
  ),
  fichaImplementadaFormula(
    "valenciana_conservacion_patrimonio_cultural_titulares",
    [580, 581]
  ),
  fichaImplementadaFormula(
    "valenciana_donaciones_lengua_valenciana",
    [581, 582]
  ),
  fichaImplementadaFormula(
    "valenciana_donaciones_cesiones_fines_culturales_cientificos_deportivos",
    [582, 583, 584, 585]
  ),
  fichaImplementadaFormula("valenciana_dos_o_mas_descendientes", [587, 588]),
  fichaImplementadaFormula(
    "valenciana_incremento_costes_financiacion_vivienda",
    [588, 589, 590]
  ),
  fichaImplementadaFormula(
    "valenciana_material_escolar",
    [590, 591, 592, 593, 594]
  ),
  fichaImplementadaFormula(
    "valenciana_obras_conservacion_mejora_periodo",
    [594, 595, 596, 597, 598, 599]
  ),
  fichaImplementadaFormula(
    "valenciana_obras_conservacion_mejora_2014_2015",
    [599, 600, 601]
  ),
  fichaImplementadaFormula("valenciana_abonos_culturales", [601, 602]),
  fichaImplementadaFormula(
    "valenciana_vehiculos_orden_5_2020",
    [602, 603, 604, 605, 606]
  ),
  fichaImplementadaFormula(
    "valenciana_inversion_entidades_nuevas_reciente_creacion",
    [606, 607, 608, 609, 610, 611]
  ),
  fichaImplementadaFormula(
    "valenciana_municipio_riesgo_despoblamiento",
    [611, 612, 613]
  ),
  fichaImplementadaFormula("valenciana_tratamientos_fertilidad", [613, 614]),
  fichaImplementadaFormula("valenciana_gastos_salud", [614, 615, 616]),
  fichaImplementadaFormula(
    "valenciana_fomento_formacion_musical",
    [618, 619, 620]
  ),
  fichaImplementadaFormula("valenciana_ayudas_publicas_erte_covid", [620, 621]),
  fichaImplementadaFormula(
    "valenciana_donaciones_covid_investigacion",
    [621, 622]
  ),
  fichaImplementadaFormula(
    "valenciana_donaciones_covid_gastos_crisis_sanitaria",
    [622, 623]
  ),
  fichaImplementadaFormula(
    "valenciana_dana_danos_materiales_vivienda_habitual",
    [623, 624, 625, 626]
  ),
  fichaImplementadaFormula(
    "valenciana_dana_aportaciones_fondos_propios_entidades",
    [626, 627, 628]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...VALENCIANA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  VALENCIANA_NACIMIENTO_ADOPCION_GUARDA_ACOGIMIENTO_2025,
  VALENCIANA_ASCENDIENTES_MAYORES_DISCAPACIDAD_2025,
  VALENCIANA_ARRENDAMIENTO_CESION_USO_VIVIENDA_2025,
  VALENCIANA_DEPORTE_ACTIVIDADES_SALUDABLES_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
