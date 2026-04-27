import { fuenteAeatDeduccionesAutonomicas2025 } from "../fuente-normativa"
import { parametroNormativo } from "../repositorio-parametros"

export type CategoriaDeduccionAutonomica =
  | "circunstancias_personales_familiares"
  | "vivienda_habitual"
  | "donativos_donaciones"
  | "otros_conceptos"

export type EstadoImplementacionDeduccionAutonomica =
  | "catalogada_pendiente_normalizacion"
  | "implementada"

export type DeduccionAutonomicaCatalogada = {
  readonly codigo: string
  readonly nombre: string
  readonly categoria: CategoriaDeduccionAutonomica
  readonly estadoImplementacion: EstadoImplementacionDeduccionAutonomica
}

export type CatalogoDeduccionesAutonomicasPorComunidad = {
  readonly comunidad: string
  readonly fuente: string
  readonly deducciones: ReadonlyArray<DeduccionAutonomicaCatalogada>
}

const pendiente = (
  codigo: string,
  nombre: string,
  categoria: CategoriaDeduccionAutonomica
): DeduccionAutonomicaCatalogada => ({
  codigo,
  nombre,
  categoria,
  estadoImplementacion: "catalogada_pendiente_normalizacion",
})

/**
 * Catálogo reconocido de deducciones autonómicas del IRPF 2025.
 *
 * Importante:
 * - Este catálogo NO significa que todas las deducciones estén implementadas.
 * - La recopilación inicial procede de un agente auxiliar y puede contener
 *   omisiones o errores de normalización; se usa como índice operativo revisable,
 *   no como fuente normativa definitiva.
 * - Las fórmulas, límites, incompatibilidades, prorrateos y requisitos se deben
 *   implementar una a una con tests antes de pasar a
 *   DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.
 */
export const CATALOGO_DEDUCCIONES_AUTONOMICAS_2025 = parametroNormativo({
  nombre: "Catálogo reconocido de deducciones autonómicas",
  fuente: fuenteAeatDeduccionesAutonomicas2025,
  valor: {
    andalucia: {
      comunidad: "Andalucía",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 2 y 15",
      deducciones: [
        pendiente(
          "andalucia_inversion_vivienda_habitual_protegida_jovenes",
          "Por inversión en vivienda habitual que tenga la consideración de protegida y por las personas jóvenes",
          "vivienda_habitual"
        ),
        pendiente(
          "andalucia_alquiler_vivienda_habitual",
          "Por cantidades invertidas en el alquiler de la vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "andalucia_nacimiento_adopcion_acogimiento_menores",
          "Por nacimiento, adopción de hijos o acogimiento familiar de menores",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "andalucia_familia_numerosa",
          "Para familia numerosa",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "andalucia_contribuyente_discapacidad",
          "Para contribuyentes con discapacidad",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    aragon: {
      comunidad: "Aragón",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 2, 3 y 16",
      deducciones: [
        pendiente(
          "aragon_nacimiento_adopcion_tercer_hijo_sucesivos",
          "Por nacimiento o adopción del tercer hijo o sucesivos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "aragon_cuidado_personas_dependientes",
          "Por el cuidado de personas dependientes",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "aragon_mayores_70",
          "Para mayores de 70 años",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "aragon_guarderia_menores_3",
          "Por gastos de guardería de hijos menores de 3 años",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    asturias: {
      comunidad: "Principado de Asturias",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 3 y 17",
      deducciones: [
        pendiente(
          "asturias_acogimiento_no_remunerado_mayores_65",
          "Por acogimiento no remunerado de mayores de 65 años",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "asturias_arrendamiento_vivienda_habitual",
          "Por arrendamiento de vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "asturias_familias_numerosas",
          "Para familias numerosas",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "asturias_centros_cero_tres",
          "Por gastos de descendientes en centros de cero a tres años",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    "illes-balears": {
      comunidad: "Illes Balears",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 3, 4, 18 y 19",
      deducciones: [
        pendiente(
          "balears_arrendamiento_vivienda_habitual",
          "Por arrendamiento de la vivienda habitual en el territorio de las Illes Balears",
          "vivienda_habitual"
        ),
        pendiente(
          "balears_libros_texto",
          "Por gastos de adquisición de libros de texto",
          "otros_conceptos"
        ),
        pendiente(
          "balears_nacimiento",
          "Por nacimiento",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "balears_gastos_mayores_65_discapacidad",
          "Por determinados gastos relativos a personas mayores de 65 años o a personas con discapacidad",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    canarias: {
      comunidad: "Canarias",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 4, 5 y 20",
      deducciones: [
        pendiente(
          "canarias_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "canarias_discapacidad_mayores_65",
          "Por contribuyentes con discapacidad y mayores de 65 años",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "canarias_alquiler_vivienda_habitual",
          "Por alquiler de vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "canarias_gasto_enfermedad",
          "Por gasto de enfermedad",
          "otros_conceptos"
        ),
      ],
    },
    cantabria: {
      comunidad: "Cantabria",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 5, 6 y 21",
      deducciones: [
        pendiente(
          "cantabria_arrendamiento_jovenes_mayores_discapacidad",
          "Por arrendamiento de vivienda habitual por jóvenes, mayores y personas con discapacidad",
          "vivienda_habitual"
        ),
        pendiente(
          "cantabria_cuidado_familiares",
          "Por cuidado de familiares",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "cantabria_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    "castilla-la-mancha": {
      comunidad: "Castilla-La Mancha",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 6, 7 y 22",
      deducciones: [
        pendiente(
          "clm_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "clm_familia_numerosa",
          "Por familia numerosa",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "clm_mayores_75",
          "Para contribuyentes mayores de 75 años",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    "castilla-y-leon": {
      comunidad: "Castilla y León",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 7 y 23",
      deducciones: [
        pendiente(
          "cyl_familia_numerosa",
          "Por familia numerosa",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "cyl_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "cyl_arrendamiento_vivienda_jovenes",
          "Por arrendamiento de vivienda habitual por jóvenes",
          "vivienda_habitual"
        ),
      ],
    },
    catalunya: {
      comunidad: "Catalunya",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 7, 8 y 24",
      deducciones: [
        pendiente(
          "cataluna_nacimiento_adopcion_acogimiento",
          "Por nacimiento o adopción de un hijo o de una hija o por acogimiento familiar",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "cataluna_alquiler_vivienda_habitual",
          "Por alquiler de la vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "cataluna_obligacion_declarar_mas_de_un_pagador",
          "Por obligación de presentar la declaración del IRPF por razón de tener más de un pagador",
          "otros_conceptos"
        ),
      ],
    },
    extremadura: {
      comunidad: "Extremadura",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 8 y 25",
      deducciones: [
        pendiente(
          "extremadura_trabajo_dependiente",
          "Por trabajo dependiente",
          "otros_conceptos"
        ),
        pendiente(
          "extremadura_cuidado_familiares_discapacidad",
          "Por cuidado de familiares con discapacidad",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "extremadura_arrendamiento_vivienda_habitual",
          "Por arrendamiento de vivienda habitual",
          "vivienda_habitual"
        ),
      ],
    },
    galicia: {
      comunidad: "Galicia",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 8, 9, 26 y 27",
      deducciones: [
        pendiente(
          "galicia_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "galicia_familia_numerosa",
          "Por familia numerosa",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "galicia_alquiler_vivienda_habitual",
          "Por alquiler de la vivienda habitual",
          "vivienda_habitual"
        ),
      ],
    },
    madrid: {
      comunidad: "Comunidad de Madrid",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 9, 10 y 28",
      deducciones: [
        pendiente(
          "madrid_nacimiento_adopcion_hijos",
          "Por nacimiento o adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "madrid_arrendamiento_vivienda_habitual",
          "Por arrendamiento de la vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "madrid_gastos_educativos",
          "Por gastos educativos",
          "otros_conceptos"
        ),
      ],
    },
    murcia: {
      comunidad: "Región de Murcia",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 10, 11, 29 y 30",
      deducciones: [
        pendiente(
          "murcia_gastos_guarderia",
          "Por gastos de guardería",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "murcia_arrendamiento_vivienda_habitual",
          "Por arrendamiento de vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "murcia_gastos_veterinarios",
          "Por gastos veterinarios",
          "otros_conceptos"
        ),
      ],
    },
    "la-rioja": {
      comunidad: "La Rioja",
      fuente: "Manual práctico de Renta 2025 Parte 2, páginas 11, 12, 31 y 32",
      deducciones: [
        pendiente(
          "rioja_nacimiento_adopcion_hijos",
          "Por nacimiento y adopción de hijos",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "rioja_arrendamiento_menores_36",
          "Por arrendamiento de vivienda habitual para contribuyentes menores de 36 años",
          "vivienda_habitual"
        ),
        pendiente(
          "rioja_enfermedad_celiaca",
          "Por enfermedad celíaca diagnosticada",
          "circunstancias_personales_familiares"
        ),
      ],
    },
    "comunitat-valenciana": {
      comunidad: "Comunitat Valenciana",
      fuente:
        "Manual práctico de Renta 2025 Parte 2, páginas 12, 13, 33, 34, 621 y 624",
      deducciones: [
        pendiente(
          "valenciana_nacimiento_adopcion_guarda_acogimiento",
          "Por nacimiento, adopción, delegación de guarda con fines de adopción o acogimiento familiar",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "valenciana_ascendientes_mayores_discapacidad",
          "Por ascendientes mayores de 75 años o mayores de 65 años con discapacidad",
          "circunstancias_personales_familiares"
        ),
        pendiente(
          "valenciana_arrendamiento_cesion_uso_vivienda",
          "Por arrendamiento o pago por la cesión en uso de la vivienda habitual",
          "vivienda_habitual"
        ),
        pendiente(
          "valenciana_deporte_actividades_saludables",
          "Por cantidades satisfechas en gastos asociados a la práctica del deporte y actividades saludables",
          "otros_conceptos"
        ),
      ],
    },
  } satisfies Partial<
    Record<string, CatalogoDeduccionesAutonomicasPorComunidad>
  >,
})

export const DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS = parametroNormativo({
  nombre: "Deducciones autonómicas implementadas",
  valor: [],
  fuente: fuenteAeatDeduccionesAutonomicas2025,
})

export const obtenerDeduccionAutonomicaCatalogada = (
  codigo: string
): DeduccionAutonomicaCatalogada | null => {
  for (const comunidad of Object.values(
    CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor
  )) {
    const deduccion = comunidad.deducciones.find(
      (candidata) => candidata.codigo === codigo
    )
    if (deduccion) {
      return deduccion
    }
  }

  return null
}
