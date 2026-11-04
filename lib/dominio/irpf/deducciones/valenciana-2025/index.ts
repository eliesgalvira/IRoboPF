import Decimal from "decimal.js"
import { Schema } from "effect"
import type { ResultadoDeduccion } from "../contratos-2025"
import {
  Solicitud,
  factor,
  fechaValida,
  idsValidos,
  parcial,
  rechazar,
  type HechosValencianos2025,
} from "./comun"
import { requisitosExternos } from "./alcance"
import { familia } from "./familia"
import { gastos } from "./gastos"
import { donacionesInversion } from "./donaciones-inversion"

export { Solicitud as SolicitudValenciana2025 } from "./comun"
export type { HechosValencianos2025, UnidadValenciana } from "./comun"

const formulas = { ...familia, ...gastos, ...donacionesInversion }
export const CODIGOS_VALENCIANOS_EVALUABLES_2025 = Object.keys(formulas).map(
  (c) => "valenciana_" + c
)

function validar(h: HechosValencianos2025): void {
  if (!fechaValida(h.devengo) || !h.devengo.startsWith("2025-"))
    rechazar("Devengo civil inválido")
  if (
    !idsValidos(h.declarantes) ||
    !h.declarantes.includes(h.contribuyente) ||
    (h.modalidad === "individual" && h.declarantes.length !== 1)
  )
    rechazar("Declarantes incompletos o duplicados")
  if (h.unidades.length === 0) rechazar("Faltan unidades de cálculo")
  if (!idsValidos(h.unidades.map((u) => u.id)))
    rechazar(
      "Unidad duplicada: agrupar previamente gastos del mismo sujeto/bien/evento"
    )
  for (const u of h.unidades) {
    if (
      !idsValidos(u.titulares) ||
      !u.titulares.some((id) => h.declarantes.includes(id))
    )
      rechazar("Titulares inválidos o ajenos a declaración")
    if (!fechaValida(u.fecha) || u.fecha > h.devengo)
      rechazar("Fecha de unidad inválida o posterior al devengo")
    if (
      Object.keys(u.numeros).some((k) =>
        ["importe", "esperado", "deduccion"].includes(k)
      ) ||
      "cumple" in u.textos
    )
      rechazar("No se admite consignación ni cumplimiento global en hechos")
  }
}

/**
 * Aritmética parcial por hechos identificados. No acredita mínimo, vivienda,
 * discapacidad, destino, incompatibilidades ni mantenimiento futuro.
 * No conectar a totalDeduccionesEvaluadas: este rechaza calculo_parcial.
 */
export function evaluarDeduccionValenciana2025(
  entrada: HechosValencianos2025
): ResultadoDeduccion {
  try {
    const h = Schema.decodeUnknownSync(Solicitud)(entrada)
    validar(h)
    const codigo = h.codigo.replace(/^valenciana_/, "")
    if (
      h.unidades.some((u) => !u.fecha.startsWith("2025-")) &&
      codigo !== "nacimiento_adopcion_guarda_acogimiento"
    )
      return {
        estado: "excluida",
        motivo: "Hecho/pago fuera de 2025; no es un arrastre identificado",
      }
    const formula = new Map(Object.entries(formulas)).get(codigo)
    if (formula === undefined || h.codigo !== "valenciana_" + codigo)
      return {
        estado: "no_soportado",
        motivo: "Código valenciano 2025 no soportado",
      }
    // Fórmulas con tope por declaración requieren una única unidad consolidada.
    const consolidadas = [
      "arrendador_renta_precio_referencia",
      "empleados_hogar_cuidado_personas",
      "conciliacion_trabajo_familia",
      "familia_numerosa_monoparental",
      "vivienda_ayudas_publicas",
      "dos_o_mas_descendientes",
      "incremento_costes_financiacion_vivienda",
      "abonos_culturales",
      "dana_aportaciones_fondos_propios_entidades",
      "donaciones_finalidad_ecologica",
      "donaciones_bienes_patrimonio_cultural",
      "donativos_conservacion_patrimonio_cultural",
      "conservacion_patrimonio_cultural_titulares",
      "donaciones_lengua_valenciana",
      "donaciones_cesiones_fines_culturales_cientificos_deportivos",
      "donaciones_covid_investigacion",
      "donaciones_covid_gastos_crisis_sanitaria",
    ]
    if (consolidadas.includes(codigo) && h.unidades.length !== 1)
      rechazar(
        "Requiere unidad consolidada para tramos y límite compartido; desglose múltiple no soportado"
      )
    if (
      ["municipio_riesgo_despoblamiento", "vehiculos_orden_5_2020"].includes(
        codigo
      ) &&
      h.unidades.length !== 1
    )
      rechazar(
        "Múltiples unidades/contribuyentes requieren resolver límite conjunto"
      )
    if (
      codigo === "gastos_salud" &&
      new Set(h.unidades.map((u) => u.textos.clase)).size !== h.unidades.length
    )
      rechazar(
        "Salud: consolidar todos los gastos de cada categoría antes de aplicar su límite"
      )
    if (
      h.devengo !== "2025-12-31" &&
      [
        "material_escolar",
        "custodia_guarderias_menores_3",
        "arrendamiento_cesion_uso_vivienda",
        "arrendamiento_actividad_distinto_municipio",
        "nacimiento_adopcion_guarda_acogimiento",
        "conciliacion_trabajo_familia",
        "ascendientes_mayores_discapacidad",
      ].includes(codigo)
    )
      rechazar(
        "Período inferior al año: prorrata específica todavía no soportada para esta rama"
      )
    let importe = new Decimal(0)
    for (const unidad of h.unidades) importe = importe.plus(formula(h, unidad))
    if (
      ["fomento_formacion_musical", "deporte_actividades_saludables"].includes(
        codigo
      )
    )
      importe = Decimal.min(
        importe,
        new Decimal(150).times(factor(h, 60000, 78000, 6000))
      )
    if (codigo === "inversion_entidades_nuevas_reciente_creacion") {
      let general = new Decimal(0)
      let adicional = new Decimal(0)
      for (const u of h.unidades) {
        if (u.textos.regimen === "general")
          general = general.plus(formula(h, u))
        else adicional = adicional.plus(formula(h, u))
      }
      importe = Decimal.min(general, 6600).plus(
        Decimal.min(adicional, h.devengo < "2025-12-30" ? 9900 : 15000)
      )
    }
    if (
      codigo === "tratamientos_fertilidad" &&
      h.unidades.every((u) => u.numeros.edad < 40 || u.numeros.edad > 45)
    )
      return {
        estado: "excluida",
        motivo: "Edad fuera del intervalo 40–45 inclusive",
      }
    if (codigo === "dana_aportaciones_fondos_propios_entidades")
      importe = Decimal.min(importe, 9900)
    return parcial(
      importe,
      "Cuantía generada; acreditaciones externas pendientes: " +
        (requisitosExternos.get(h.codigo) ??
          "Código sin requisitos documentados") +
        ". No es cuota aplicada ni liquidación; insuficiencia de cuota y arrastres requieren el módulo cuota."
    )
  } catch (error) {
    return {
      estado: "no_soportado",
      motivo:
        error instanceof RangeError
          ? error.message
          : "Hechos no conformes al esquema runtime valenciano 2025",
    }
  }
}

export { componerDeduccionesValencianas2025 } from "./composicion"
export type {
  ComposicionValenciana2025,
  ResultadoComposicion,
  PeticionComposicion,
  ReferenciasComposicion,
  FilaComposicion,
  CuotaSeparada,
} from "./composicion"
