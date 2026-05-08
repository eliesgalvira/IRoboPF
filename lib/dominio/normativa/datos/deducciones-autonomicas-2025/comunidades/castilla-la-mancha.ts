import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

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
    "Aplicar normás del mínimo por descendientes",
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
    "Aplicar normás del mínimo por descendientes y discapacidad",
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
    "Aplicar normás del mínimo por ascendientes, descendientes y discapacidad",
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

export const CLM_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...CLM_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  CLM_NACIMIENTO_ADOPCION_2025,
  CLM_FAMILIA_NUMEROSA_2025,
  CLM_DISCAPACIDAD_CONTRIBUYENTE_2025,
  CLM_DISCAPACIDAD_ASCENDIENTES_DESCENDIENTES_2025,
  CLM_MAYORES_75_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
