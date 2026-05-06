import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  fichaImplementadaFormula,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

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

export const CYL_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...CYL_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  CYL_FAMILIA_NUMEROSA_2025,
  CYL_NACIMIENTO_ADOPCION_HIJOS_2025,
  CYL_ARRENDAMIENTO_VIVIENDA_JOVENES_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
