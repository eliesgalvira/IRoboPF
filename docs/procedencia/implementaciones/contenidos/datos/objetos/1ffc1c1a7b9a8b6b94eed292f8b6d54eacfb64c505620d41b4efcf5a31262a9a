import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

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

export const EXTREMADURA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...EXTREMADURA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  EXTREMADURA_TRABAJO_DEPENDIENTE_2025,
  EXTREMADURA_CUIDADO_FAMILIARES_DISCAPACIDAD_2025,
  EXTREMADURA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
