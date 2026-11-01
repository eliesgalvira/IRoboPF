import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
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
    "Rentas brutas del ascendiente o descendiente no superiores a 6.000 euros; en los supuestos de discapacidad, límite de 1,5 veces el IPREM. El artículo 2.2 no establece un límite de base liquidable del contribuyente.",
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
        "15% de las obras elegibles; máximo 1.000 euros individual y 1.500 conjunta, con incremento por discapacidad y arrastre de dos ejercicios.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.3 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 211 a 213.",
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
        "15% de donaciones a fundaciones y asociaciones de discapacidad elegibles; 12% al Fondo Cantabria Coopera; base limitada al 10% de base liquidable.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.4 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 213 a 214.",
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
        "240 euros por el número máximo de menores acogidos simultáneamente; máximo 1.200 euros; reparto por mitad en declaraciones individuales de la pareja.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.5 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 214 a 215.",
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
        "15% de inversión elegible en constitución o ampliación de capital; máximo 1.000 euros; participación familiar hasta tercer grado no superior al 40% y mantenimiento de tres años.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.6 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 215 a 217.",
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
        "10% de gastos sanitarios elegibles no cubiertos; máximo 500 euros individual y 700 conjunta, incrementados por discapacidad. Base liquidable menos mínimo inferior a 22.946/31.485 euros.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.7 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 217 a 218.",
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
        "15% de guardería; máximo 300 euros por hijo menor de tres años, con reparto del límite según gastos justificados; incompatible con guardería en despoblamiento.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.8 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 218 a 219.",
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
        "200 euros al titular de familia monoparental; base liquidable menos mínimo inferior a 31.485 euros.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.9 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 220 a 220.",
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
        "20% del alquiler; máximo 600 euros individual y 1.200 conjunta; vivienda en municipio delimitado por riesgo de despoblamiento; incompatible para la misma vivienda con alquiler general.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.11.1 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 221 a 223.",
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
        "30% de guardería; máximo 600 euros por hijo menor de tres años; residencia en municipio delimitado e incompatibilidad con guardería general.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.11.2 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 223 a 224.",
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
        "500 euros por traslado laboral a municipio en riesgo; exige mantenimiento de residencia y límite de cuota procedente de trabajo y actividades económicas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.11.3 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 224 a 225.",
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
        "200 euros por hijo estudiante desplazado; rentas anuales no superiores a 8.000 euros y reparto por mitad en individual.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.11.4 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 225 a 226.",
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
        "20% de cuota íntegra autonómica, máximo 500 euros; contribuyente menor de 40 años residente en municipio afectado por riesgo de despoblamiento.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.11.5 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 226 a 227.",
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
        "20% de aportaciones para ser socio, 50% de donaciones para actividad y 25% para fomento de economía social; límite conjunto 3.000 euros; incompatibilidades por inversión.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.12 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 227 a 229.",
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
        "100% de libros y 15% de idiomas extraescolares en enseñanza obligatoria; límite conjunto 200 euros por unidad familiar; mitad en individual; factura y pago no efectivo.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.13 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 229 a 230.",
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
        "20% de cotizaciones del empleado de hogar, máximo 300 euros; empleador y vivienda habitual en Cantabria, con hijos y rentas laborales o edad de al menos 75 años.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.14 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 230 a 232.",
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
        "20% de inversión elegible sin intereses; residencia adquirida desde 2025 tras cinco años fuera de España; mantenimiento seis años y arrastre por insuficiencia cinco años.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.15 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 232 a 235.",
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
        "10% de gastos de traslado, máximo 1.000 euros, o 25% y 1.500 por traslado laboral; ejercicio de adquisición de residencia y tres siguientes, con arrastre cuatro años.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.16 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 235 a 237.",
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
        "500 euros por vivienda vacía al menos un año puesta en alquiler; prorrata por titularidad, duración efectiva de tres años, renta mensual hasta 1.000 euros y máximo tres viviendas por contribuyente.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 207 a 237.",
      "Artículo 2.17 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 237 a 238.",
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
