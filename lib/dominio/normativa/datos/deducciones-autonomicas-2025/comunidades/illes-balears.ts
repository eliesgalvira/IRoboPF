import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const BALEARS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = fichaImplementada(
  { estado: "implementada" },
  "balears_arrendamiento_vivienda_habitual",
  "Por arrendamiento de la vivienda habitual en el territorio de las Illes Balears",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "15% límite 530 euros; 20% límite 650 euros para colectivos cualificados",
  },
  [
    "15%, límite 530 euros: menores de 36 o mayores de 65 sin actividad",
    "20%, límite 650 euros: menores de 30, discapacidad, familia numerosa/monoparental o autónomos",
    "Límite base general: 33.000 euros individual y 52.800 conjunta",
  ],
  [133, 134, 135, 136]
)

export const BALEARS_LIBROS_TEXTO_2025 = fichaImplementada(
  { estado: "implementada" },
  "balears_libros_texto",
  "Por gastos de adquisición de libros de texto",
  "otros_conceptos",
  {
    tipo: "mixta",
    descripcion:
      "100% de importes destinados a libros de texto, límite 220 euros por hijo o 350 euros con límite incrementado",
  },
  [
    "100% del gasto en libros de texto",
    "Límite general: 220 euros por hijo",
    "Límite incrementado: 350 euros por hijo",
  ],
  [136, 137, 138]
)

export const BALEARS_NACIMIENTO_2025 = fichaImplementada(
  { estado: "implementada" },
  "balears_nacimiento",
  "Por nacimiento",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "800 euros primer hijo, 1.000 segundo, 1.200 tercero y 1.400 cuarto y siguientes; 50% si supera límites",
  },
  [
    "800 euros primer hijo",
    "1.000 euros segundo hijo",
    "1.200 euros tercer hijo",
    "1.400 euros cuarto y siguientes",
    "Si se superan límites de renta, puede aplicarse el 50%",
  ],
  [155, 156, 157, 158]
)

export const BALEARS_GASTOS_MAYORES_65_DISCAPACIDAD_2025 = fichaImplementada(
  { estado: "implementada" },
  "balears_gastos_mayores_65_discapacidad",
  "Por determinados gastos relativos a personas mayores de 65 años o a personas con discapacidad",
  "circunstancias_personales_familiares",
  {
    tipo: "porcentaje",
    porcentaje: "40",
    base: "gastos por servicios de residencia, centros de día, comedor, custodia o contratación de cuidador",
    limiteMaximoEuros: "660",
  },
  [
    "40% de los gastos satisfechos",
    "Máximo 660 euros anuales por persona que genere derecho",
    "Base imponible general + ahorro máximo 33.000 euros individual y 52.800 conjunta",
  ],
  [160, 161]
)

export const BALEARS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "balears_mejora_sostenibilidad_vivienda",
    nombreCatalogadoDesdeCodigo("balears_mejora_sostenibilidad_vivienda"),
    categoriaCatalogadaDesdeCodigo("balears_mejora_sostenibilidad_vivienda"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 131 a 133.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [131, 132, 133],
    [
      "balears_mejora_sostenibilidad_vivienda:importe",
      "balears_mejora_sostenibilidad_vivienda:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_subvenciones_zona_emergencia_proteccion_civil",
    nombreCatalogadoDesdeCodigo(
      "balears_subvenciones_zona_emergencia_proteccion_civil"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_subvenciones_zona_emergencia_proteccion_civil"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 136.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [136],
    [
      "balears_subvenciones_zona_emergencia_proteccion_civil:importe",
      "balears_subvenciones_zona_emergencia_proteccion_civil:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_idiomas_extraescolares",
    nombreCatalogadoDesdeCodigo("balears_idiomas_extraescolares"),
    categoriaCatalogadaDesdeCodigo("balears_idiomas_extraescolares"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 138 a 139.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [138, 139],
    [
      "balears_idiomas_extraescolares:importe",
      "balears_idiomas_extraescolares:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_estudios_superiores_fuera_isla",
    nombreCatalogadoDesdeCodigo("balears_estudios_superiores_fuera_isla"),
    categoriaCatalogadaDesdeCodigo("balears_estudios_superiores_fuera_isla"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 140 a 141.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [140, 141],
    [
      "balears_estudios_superiores_fuera_isla:importe",
      "balears_estudios_superiores_fuera_isla:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_arrendador_vivienda_permanente_primas_seguro",
    nombreCatalogadoDesdeCodigo(
      "balears_arrendador_vivienda_permanente_primas_seguro"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_arrendador_vivienda_permanente_primas_seguro"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 141 a 142.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [141, 142],
    [
      "balears_arrendador_vivienda_permanente_primas_seguro:importe",
      "balears_arrendador_vivienda_permanente_primas_seguro:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_arrendador_vivienda_permanente_otros_gastos",
    nombreCatalogadoDesdeCodigo(
      "balears_arrendador_vivienda_permanente_otros_gastos"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_arrendador_vivienda_permanente_otros_gastos"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 142 a 144.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [142, 143, 144],
    [
      "balears_arrendador_vivienda_permanente_otros_gastos:importe",
      "balears_arrendador_vivienda_permanente_otros_gastos:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_arrendamiento_traslado_laboral",
    nombreCatalogadoDesdeCodigo("balears_arrendamiento_traslado_laboral"),
    categoriaCatalogadaDesdeCodigo("balears_arrendamiento_traslado_laboral"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 144 a 145.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [144, 145],
    [
      "balears_arrendamiento_traslado_laboral:importe",
      "balears_arrendamiento_traslado_laboral:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento",
    nombreCatalogadoDesdeCodigo(
      "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 145 a 146.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [145, 146],
    [
      "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento:importe",
      "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_donaciones_investigacion_desarrollo_innovacion",
    nombreCatalogadoDesdeCodigo(
      "balears_donaciones_investigacion_desarrollo_innovacion"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_donaciones_investigacion_desarrollo_innovacion"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 146 a 147.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [146, 147],
    [
      "balears_donaciones_investigacion_desarrollo_innovacion:importe",
      "balears_donaciones_investigacion_desarrollo_innovacion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_mecenazgo_cultural_cientifico_tecnologico",
    nombreCatalogadoDesdeCodigo(
      "balears_mecenazgo_cultural_cientifico_tecnologico"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_mecenazgo_cultural_cientifico_tecnologico"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 148 a 150.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [148, 149, 150],
    [
      "balears_mecenazgo_cultural_cientifico_tecnologico:importe",
      "balears_mecenazgo_cultural_cientifico_tecnologico:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_mecenazgo_deportivo",
    nombreCatalogadoDesdeCodigo("balears_mecenazgo_deportivo"),
    categoriaCatalogadaDesdeCodigo("balears_mecenazgo_deportivo"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 150.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [150],
    [
      "balears_mecenazgo_deportivo:importe",
      "balears_mecenazgo_deportivo:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_fomento_lengua_catalana",
    nombreCatalogadoDesdeCodigo("balears_fomento_lengua_catalana"),
    categoriaCatalogadaDesdeCodigo("balears_fomento_lengua_catalana"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 151 a 152.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [151, 152],
    [
      "balears_fomento_lengua_catalana:importe",
      "balears_fomento_lengua_catalana:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_entidades_tercer_sector",
    nombreCatalogadoDesdeCodigo("balears_entidades_tercer_sector"),
    categoriaCatalogadaDesdeCodigo("balears_entidades_tercer_sector"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 152.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [152],
    [
      "balears_entidades_tercer_sector:importe",
      "balears_entidades_tercer_sector:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_declarantes_discapacidad_o_descendientes_discapacidad",
    nombreCatalogadoDesdeCodigo(
      "balears_declarantes_discapacidad_o_descendientes_discapacidad"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_declarantes_discapacidad_o_descendientes_discapacidad"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 152 a 153.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [152, 153],
    [
      "balears_declarantes_discapacidad_o_descendientes_discapacidad:importe",
      "balears_declarantes_discapacidad_o_descendientes_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_conciliacion_menores_6",
    nombreCatalogadoDesdeCodigo("balears_conciliacion_menores_6"),
    categoriaCatalogadaDesdeCodigo("balears_conciliacion_menores_6"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 153 a 155.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [153, 154, 155],
    [
      "balears_conciliacion_menores_6:importe",
      "balears_conciliacion_menores_6:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_adopcion",
    nombreCatalogadoDesdeCodigo("balears_adopcion"),
    categoriaCatalogadaDesdeCodigo("balears_adopcion"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 158 a 160.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [158, 159, 160],
    ["balears_adopcion:importe", "balears_adopcion:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_gastos_ela",
    nombreCatalogadoDesdeCodigo("balears_gastos_ela"),
    categoriaCatalogadaDesdeCodigo("balears_gastos_ela"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 161 a 162.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [161, 162],
    ["balears_gastos_ela:importe", "balears_gastos_ela:cumple"],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_inversion_entidades_nuevas_reciente_creacion",
    nombreCatalogadoDesdeCodigo(
      "balears_inversion_entidades_nuevas_reciente_creacion"
    ),
    categoriaCatalogadaDesdeCodigo(
      "balears_inversion_entidades_nuevas_reciente_creacion"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 162 a 165.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [162, 163, 164, 165],
    [
      "balears_inversion_entidades_nuevas_reciente_creacion:importe",
      "balears_inversion_entidades_nuevas_reciente_creacion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_fomento_autoocupacion",
    nombreCatalogadoDesdeCodigo("balears_fomento_autoocupacion"),
    categoriaCatalogadaDesdeCodigo("balears_fomento_autoocupacion"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 165 a 166.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [165, 166],
    [
      "balears_fomento_autoocupacion:importe",
      "balears_fomento_autoocupacion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "balears_plazas_dificil_cobertura",
    nombreCatalogadoDesdeCodigo("balears_plazas_dificil_cobertura"),
    categoriaCatalogadaDesdeCodigo("balears_plazas_dificil_cobertura"),
    {
      tipo: "mixta",
      descripcion:
        "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 166 a 167.",
      "La consignación del importe no verifica por sí sola los requisitos de la norma.",
    ],
    [166, 167],
    [
      "balears_plazas_dificil_cobertura:importe",
      "balears_plazas_dificil_cobertura:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const BALEARS_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...BALEARS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  BALEARS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
  BALEARS_LIBROS_TEXTO_2025,
  BALEARS_NACIMIENTO_2025,
  BALEARS_GASTOS_MAYORES_65_DISCAPACIDAD_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
