import Decimal from "decimal.js"
import {
  entero,
  evidencia,
  factor,
  n,
  neto,
  proporcion,
  rechazar,
  renta,
  t,
  type Formula,
  type HechosValencianos2025,
  type UnidadValenciana,
} from "./comun"

function tramos(base: Decimal, umbral: number): Decimal {
  return Decimal.min(base, umbral)
    .times("0.2")
    .plus(Decimal.max(0, base.minus(umbral)).times("0.25"))
}
function donacion(
  h: HechosValencianos2025,
  u: UnidadValenciana,
  limitada: boolean,
  covid = false
): Decimal {
  const base = limitada
    ? Decimal.min(n(u, "valorAportado"), renta(h).times("0.3"))
    : n(u, "valorAportado")
  return tramos(base, covid || h.devengo < "2025-06-01" ? 150 : 250)
}
function territorioDana(u: UnidadValenciana): void {
  evidencia(u, "anexoFiscalAcuerdo4nov2024")
  const municipio = t(u, "municipio", [
    "anexo_fiscal",
    "Loriguilla",
    "Valencia",
    "fuera",
  ])
  if (municipio === "fuera")
    rechazar("Fuera del ámbito fiscal DANA; ayuda 163/164 no amplía anexo")
  if (municipio === "Loriguilla") t(u, "subambito", ["nucleo_A3"])
  if (municipio === "Valencia") t(u, "subambito", ["pedanias_sur"])
}
export const donacionesInversion = {
  autoconsumo_renovables: (_h, u) => {
    const fraccion = n(u, "fraccionPagadaVivienda")
    if (fraccion.gt(1))
      return rechazar("Participación de inversión superior a uno")
    return Decimal.min(neto(u), new Decimal(8800).times(fraccion)).times(
      t(u, "vivienda", ["habitual", "segunda"]) === "habitual" ? "0.4" : "0.2"
    )
  },
  donaciones_finalidad_ecologica: (h, u) => donacion(h, u, false),
  donaciones_bienes_patrimonio_cultural: (h, u) => donacion(h, u, false),
  donativos_conservacion_patrimonio_cultural: (h, u) => donacion(h, u, true),
  conservacion_patrimonio_cultural_titulares: (h, u) => {
    evidencia(u, "titularidadInventarioIntervencion")
    return donacion(h, u, true)
  },
  donaciones_lengua_valenciana: (h, u) => {
    if (t(u, "grupoDestinatario", ["1", "2", "3", "4", "5"]) === "5")
      evidencia(u, "inscripcionEficazCenso2025")
    return donacion(h, u, true)
  },
  donaciones_cesiones_fines_culturales_cientificos_deportivos: (h, u) => {
    const clase = t(u, "clase", ["dinero", "comodato_inmueble"])
    const dias =
      clase === "comodato_inmueble" ? entero(u, "diasComodato", 365) : 0
    // El devengo civil ya está validado. No aceptar más días que los del período.
    const diasPeriodo =
      (Date.parse(`${h.devengo}T00:00:00Z`) - Date.UTC(2025, 0, 1)) /
        86_400_000 +
      1
    if (dias > diasPeriodo)
      rechazar("Días de comodato superiores al período impositivo")
    const base = Decimal.min(
      clase === "dinero"
        ? n(u, "valorAportado")
        : n(u, "valorCatastral").times("0.04").times(dias).div(365),
      renta(h).times("0.3")
    )
    return t(u, "deduccionEstatal683a", ["si", "no"]) === "si"
      ? tramos(base, h.devengo < "2025-06-01" ? 150 : 250)
      : base.times("0.25")
  },
  donaciones_covid_investigacion: (h, u) => donacion(h, u, false, true),
  donaciones_covid_gastos_crisis_sanitaria: (h, u) => {
    evidencia(u, "aceptacionYDestinoDL4")
    return donacion(h, u, false, true)
  },
  inversion_entidades_nuevas_reciente_creacion: (h, u) => {
    const regimen = t(u, "regimen", ["general", "cualificado"])
    if (regimen === "cualificado") {
      // Art.21 EECV es prueba por requisitos, no una resolución constitutiva.
      t(u, "viaAdicional", ["universidad", "innovacionRD475", "eecv_art21"])
      evidencia(u, "requisitosAdicionales")
    }
    return n(u, "inversionDesembolsada").times(
      regimen === "general" ? "0.3" : "0.45"
    )
  },
  dana_danos_materiales_vivienda_habitual: (h, u) => {
    territorioDana(u)
    return Decimal.min(
      neto(u),
      new Decimal(2000).times(factor(h, 45000, 60000, 5000))
    ).times(proporcion(h, u))
  },
  dana_aportaciones_fondos_propios_entidades: (h, u) => {
    territorioDana(u)
    if (u.fecha < "2024-11-13" || u.fecha > "2025-12-31") return new Decimal(0)
    if (t(u, "entidad", ["nueva", "preexistente"]) === "preexistente")
      evidencia(u, "solicitudERTEPorTemporal")
    evidencia(u, "domiciliosSocialFiscalYMantenimiento")
    return Decimal.min(
      n(u, "inversionDesembolsada"),
      renta(h).times("0.3")
    ).times("0.45")
  },
} satisfies Readonly<Record<string, Formula>>
