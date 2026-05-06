import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  fichaImplementadaFormula,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

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

export const CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...CANTABRIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  CANTABRIA_ARRENDAMIENTO_JOVENES_MAYORES_DISCAPACIDAD_2025,
  CANTABRIA_CUIDADO_FAMILIARES_2025,
  CANTABRIA_NACIMIENTO_ADOPCION_HIJOS_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
