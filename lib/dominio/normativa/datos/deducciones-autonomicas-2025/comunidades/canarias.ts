import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const CANARIAS_NACIMIENTO_ADOPCION_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "canarias_nacimiento_adopcion_hijos",
    "Por nacimiento o adopción de hijos",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 10 Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "265 euros por primer o segundo hijo; 530 euros por tercero; 796 euros por cuarto; 928 euros por quinto o sucesivos. Incremento adicional por discapacidad igual o superior al 65%",
  },
  requisitos: [
    "Hijo nacido o adoptado durante el período impositivo",
    "El hijo debe convivir con el contribuyente",
    "Para el incremento por discapacidad, discapacidad física, psíquica o sensorial igual o superior al 65% y convivencia ininterrumpida desde nacimiento/adopción hasta final del período",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "265 euros si se trata del primero o segundo hijo",
    "530 euros si se trata del tercero",
    "796 euros si se trata del cuarto",
    "928 euros si se trata del quinto o sucesivos",
    "Incremento adicional por discapacidad: 600 euros si es primer o segundo hijo con discapacidad",
    "Incremento adicional por discapacidad: 1.100 euros si es tercer o posterior hijo con discapacidad y sobreviven los anteriores hijos con discapacidad",
    "Base imponible general + base imponible del ahorro: máximo 46.455 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 61.770 euros en tributación conjunta",
  ],
  prorrateo: [
    "Si ambos progenitores o adoptantes tienen derecho y no optan por conjunta, se prorratea por partes iguales",
  ],
  compatibilidades: [
    "Compatible con la deducción autonómica canaria por familia numerosa",
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "ordenHijoNacidoOAdoptado",
    "numeroHijosNacidosOAdoptados",
    "discapacidadHijo65",
    "convivenciaIninterrumpidaHijo",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "numeroProgenitoresConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [181, 182],
  },
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_DISCAPACIDAD_MAYORES_65_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "canarias_discapacidad_mayores_65",
    "Por contribuyentes con discapacidad y mayores de 65 años",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 11 Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "400 euros por contribuyente con discapacidad igual o superior al 33%; 160 euros por contribuyente mayor de 65 años. Ambas cuantías son compatibles entre sí",
  },
  requisitos: [
    "Discapacidad igual o superior al 33% para la cuantía por discapacidad",
    "Edad superior a 65 años para la cuantía por edad",
    "Circunstancias personales a fecha de devengo del impuesto",
    "Base imponible general + base imponible del ahorro dentro de límites",
  ],
  limites: [
    "400 euros por discapacidad igual o superior al 33%",
    "160 euros por contribuyente mayor de 65 años",
    "Base imponible general + base imponible del ahorro: máximo 46.455 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 61.770 euros en tributación conjunta",
  ],
  prorrateo: [],
  compatibilidades: [
    "La cuantía por discapacidad y la cuantía por edad son compatibles entre sí",
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "edadContribuyente",
    "gradoDiscapacidadContribuyente",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [183],
  },
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_FAMILIA_NUMEROSA_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "canarias_familia_numerosa",
    "Por familia numerosa",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 13 Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "597 euros para familia numerosa general; 796 euros para especial. Si cónyuge o descendiente con mínimo tiene discapacidad igual o superior al 65%, 1.326 euros general y 1.459 euros especial",
  },
  requisitos: [
    "Título de familia numerosa a fecha de devengo del impuesto",
    "Clasificación según la Ley 40/2003 de protección a las familias numerosas",
    "Título expedido por órgano competente",
  ],
  limites: [
    "597 euros para familia numerosa de categoría general",
    "796 euros para familia numerosa de categoría especial",
    "1.326 euros para categoría general si cónyuge o descendiente con derecho al mínimo tiene discapacidad igual o superior al 65%",
    "1.459 euros para categoría especial si cónyuge o descendiente con derecho al mínimo tiene discapacidad igual o superior al 65%",
  ],
  prorrateo: [
    "Se aplica por el contribuyente con quien conviva el resto de miembros de la familia numerosa",
    "Si conviven con más de un contribuyente, se prorratea por partes iguales",
  ],
  compatibilidades: [
    "Compatible con la deducción canaria por nacimiento o adopción de hijos",
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "categoriaFamiliaNumerosa",
    "conyugeODependienteDiscapacidad65",
    "numeroContribuyentesConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [186, 187],
  },
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_CONTRIBUYENTES_DESEMPLEADOS_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "canarias_contribuyentes_desempleados",
    "Por contribuyentes desempleados",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 16 bis Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "importe_fijo",
    euros: "120",
    por: "contribuyente desempleado",
  },
  requisitos: [
    "Percibir prestaciones de desempleo",
    "Estar en situación de desempleo durante más de seis meses del período impositivo",
    "Rendimientos íntegros del trabajo superiores a 15.876 euros e iguales o inferiores a 22.000 euros",
    "Base imponible general + ahorro excluida la parte correspondiente a rendimientos del trabajo no superior a 1.600 euros",
  ],
  limites: [
    "120 euros por contribuyente que cumpla los requisitos",
    "En tributación conjunta pueden beneficiarse todos los miembros de la unidad familiar que cumplan la situación de desempleo",
  ],
  prorrateo: [],
  incompatibilidades: [],
  entradaNecesaria: [
    "percibePrestacionDesempleo",
    "mesesDesempleo",
    "rendimientosIntegroTrabajo",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "rendimientoTrabajoCasilla0025",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [200, 201],
  },
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_ALQUILER_VIVIENDA_HABITUAL_2025 = fichaImplementada(
  { estado: "implementada" },
  "canarias_alquiler_vivienda_habitual",
  "Por alquiler de vivienda habitual",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "24% del alquiler; límite 740 euros, o 760 euros si menor de 40 o mayor de 75",
  },
  [
    "24% de cantidades satisfechas",
    "Límite general: 740 euros",
    "Límite incrementado: 760 euros",
    "Base imponible general + ahorro máximo 46.455 euros individual y 61.770 conjunta",
  ],
  [193, 194]
)

export const CANARIAS_GASTO_ENFERMEDAD_2025 = fichaImplementada(
  { estado: "implementada" },
  "canarias_gasto_enfermedad",
  "Por gasto de enfermedad",
  "otros_conceptos",
  {
    tipo: "mixta",
    descripcion:
      "12% de gastos médicos/sanitarios y aparatos; límite 500/700 euros, incremento 100 euros, o límite 150 euros si supera umbral",
  },
  [
    "12% de gastos deducibles",
    "Límite 500 euros individual y 700 euros conjunta si cumple umbral de bases",
    "Incremento 100 euros por mayor de 65 o discapacidad igual/superior al 65%",
    "Si se superan umbrales de base: límite 150 euros por contribuyente",
  ],
  [201, 202]
)

export const CANARIAS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "canarias_donaciones_finalidad_ecologica",
    nombreCatalogadoDesdeCodigo("canarias_donaciones_finalidad_ecologica"),
    categoriaCatalogadaDesdeCodigo("canarias_donaciones_finalidad_ecologica"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_donaciones_finalidad_ecologica:importe",
      "canarias_donaciones_finalidad_ecologica:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_donaciones_patrimonio_historico",
    nombreCatalogadoDesdeCodigo("canarias_donaciones_patrimonio_historico"),
    categoriaCatalogadaDesdeCodigo("canarias_donaciones_patrimonio_historico"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_donaciones_patrimonio_historico:importe",
      "canarias_donaciones_patrimonio_historico:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia",
    nombreCatalogadoDesdeCodigo(
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia:importe",
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_donaciones_entidades_sin_animo_lucro",
    nombreCatalogadoDesdeCodigo(
      "canarias_donaciones_entidades_sin_animo_lucro"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_donaciones_entidades_sin_animo_lucro"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_donaciones_entidades_sin_animo_lucro:importe",
      "canarias_donaciones_entidades_sin_animo_lucro:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_restauracion_bienes_interes_cultural",
    nombreCatalogadoDesdeCodigo(
      "canarias_restauracion_bienes_interes_cultural"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_restauracion_bienes_interes_cultural"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_restauracion_bienes_interes_cultural:importe",
      "canarias_restauracion_bienes_interes_cultural:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_estudios_educacion_superior",
    nombreCatalogadoDesdeCodigo("canarias_estudios_educacion_superior"),
    categoriaCatalogadaDesdeCodigo("canarias_estudios_educacion_superior"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_estudios_educacion_superior:importe",
      "canarias_estudios_educacion_superior:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_estudios_no_superiores",
    nombreCatalogadoDesdeCodigo("canarias_estudios_no_superiores"),
    categoriaCatalogadaDesdeCodigo("canarias_estudios_no_superiores"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_estudios_no_superiores:importe",
      "canarias_estudios_no_superiores:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_traslado_residencia_otra_isla_trabajo",
    nombreCatalogadoDesdeCodigo(
      "canarias_traslado_residencia_otra_isla_trabajo"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_traslado_residencia_otra_isla_trabajo"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_traslado_residencia_otra_isla_trabajo:importe",
      "canarias_traslado_residencia_otra_isla_trabajo:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_inversion_entidades_nuevas_reciente_creacion",
    nombreCatalogadoDesdeCodigo(
      "canarias_inversion_entidades_nuevas_reciente_creacion"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_inversion_entidades_nuevas_reciente_creacion"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_inversion_entidades_nuevas_reciente_creacion:importe",
      "canarias_inversion_entidades_nuevas_reciente_creacion:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_acogimiento_menores",
    nombreCatalogadoDesdeCodigo("canarias_acogimiento_menores"),
    categoriaCatalogadaDesdeCodigo("canarias_acogimiento_menores"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_acogimiento_menores:importe",
      "canarias_acogimiento_menores:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_familias_monoparentales",
    nombreCatalogadoDesdeCodigo("canarias_familias_monoparentales"),
    categoriaCatalogadaDesdeCodigo("canarias_familias_monoparentales"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_familias_monoparentales:importe",
      "canarias_familias_monoparentales:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_custodia_guarderias",
    nombreCatalogadoDesdeCodigo("canarias_custodia_guarderias"),
    categoriaCatalogadaDesdeCodigo("canarias_custodia_guarderias"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_custodia_guarderias:importe",
      "canarias_custodia_guarderias:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_inversion_vivienda_habitual",
    nombreCatalogadoDesdeCodigo("canarias_inversion_vivienda_habitual"),
    categoriaCatalogadaDesdeCodigo("canarias_inversion_vivienda_habitual"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_inversion_vivienda_habitual:importe",
      "canarias_inversion_vivienda_habitual:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_rehabilitacion_energetica_vivienda",
    nombreCatalogadoDesdeCodigo("canarias_rehabilitacion_energetica_vivienda"),
    categoriaCatalogadaDesdeCodigo(
      "canarias_rehabilitacion_energetica_vivienda"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_rehabilitacion_energetica_vivienda:importe",
      "canarias_rehabilitacion_energetica_vivienda:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_adecuacion_vivienda_discapacidad",
    nombreCatalogadoDesdeCodigo("canarias_adecuacion_vivienda_discapacidad"),
    categoriaCatalogadaDesdeCodigo("canarias_adecuacion_vivienda_discapacidad"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_adecuacion_vivienda_discapacidad:importe",
      "canarias_adecuacion_vivienda_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_arrendamiento_dacion_pago",
    nombreCatalogadoDesdeCodigo("canarias_arrendamiento_dacion_pago"),
    categoriaCatalogadaDesdeCodigo("canarias_arrendamiento_dacion_pago"),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_arrendamiento_dacion_pago:importe",
      "canarias_arrendamiento_dacion_pago:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_adecuacion_inmueble_arrendamiento",
    nombreCatalogadoDesdeCodigo("canarias_adecuacion_inmueble_arrendamiento"),
    categoriaCatalogadaDesdeCodigo(
      "canarias_adecuacion_inmueble_arrendamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_adecuacion_inmueble_arrendamiento:importe",
      "canarias_adecuacion_inmueble_arrendamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_primas_seguro_impago_arrendamientos",
    nombreCatalogadoDesdeCodigo("canarias_primas_seguro_impago_arrendamientos"),
    categoriaCatalogadaDesdeCodigo(
      "canarias_primas_seguro_impago_arrendamientos"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_primas_seguro_impago_arrendamientos:importe",
      "canarias_primas_seguro_impago_arrendamientos:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_puesta_viviendas_mercado_arrendamiento",
    nombreCatalogadoDesdeCodigo(
      "canarias_puesta_viviendas_mercado_arrendamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_puesta_viviendas_mercado_arrendamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_puesta_viviendas_mercado_arrendamiento:importe",
      "canarias_puesta_viviendas_mercado_arrendamiento:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_familiares_dependientes_discapacidad",
    nombreCatalogadoDesdeCodigo(
      "canarias_familiares_dependientes_discapacidad"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_familiares_dependientes_discapacidad"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_familiares_dependientes_discapacidad:importe",
      "canarias_familiares_dependientes_discapacidad:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "canarias_cuotas_seguridad_social_empleados_hogar",
    nombreCatalogadoDesdeCodigo(
      "canarias_cuotas_seguridad_social_empleados_hogar"
    ),
    categoriaCatalogadaDesdeCodigo(
      "canarias_cuotas_seguridad_social_empleados_hogar"
    ),
    {
      tipo: "mixta",
      descripcion:
        "Ficha implementada con control de interfaz para aplicar fórmula, límites, prorrateos e incompatibilidades operativas.",
    },
    [
      "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 167 a 206.",
      "El cálculo se verifica mediante el control de deducción correspondiente.",
    ],
    [167, 206],
    [
      "canarias_cuotas_seguridad_social_empleados_hogar:importe",
      "canarias_cuotas_seguridad_social_empleados_hogar:cumple",
    ],
    ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const CANARIAS_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...CANARIAS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  CANARIAS_NACIMIENTO_ADOPCION_2025,
  CANARIAS_DISCAPACIDAD_MAYORES_65_2025,
  CANARIAS_FAMILIA_NUMEROSA_2025,
  CANARIAS_ALQUILER_VIVIENDA_HABITUAL_2025,
  CANARIAS_GASTO_ENFERMEDAD_2025,
  CANARIAS_CONTRIBUYENTES_DESEMPLEADOS_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
