import Decimal from "decimal.js"
import { Match } from "effect"

import { crearImporteMonetario } from "../dinero/importe-monetario"
import {
  calcularDesgloseCotizacionesSocialesLegacy,
  obtenerParametrosCotizacionLegacy,
  sumarTipoCotizacionLegacy,
  type EntradaCotizacionesSocialesLegacy,
  type DesgloseCotizacionesSociales,
} from "./cotizaciones-sociales"

// Órdenes PJC/178/2025 art. 17 y PJC/297/2026 art. 17.
// Proporciones por uno; no reconstruir el reparto a partir del tipo total.
const tiposSolidaridad = {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  },
} as const

const cuotaSolidaridad = (
  exceso: Decimal,
  baseMaxima: Decimal,
  tipos: readonly [string, string, string]
): Decimal => {
  const primerExceso = Decimal.min(exceso, baseMaxima.mul("0.1"))
  const segundoExceso = Decimal.min(
    Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))),
    baseMaxima.mul("0.4")
  )
  const excesoRestante = Decimal.max(0, exceso.minus(baseMaxima.mul("0.5")))
  return primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1]))
    .plus(excesoRestante.mul(tipos[2]))
}

export interface CotizacionesPerfilUniforme extends DesgloseCotizacionesSociales {
  readonly alcance: "analitico-doce-mensualidades-uniformes"
  readonly redondeoTgss: "pendiente"
}

/**
 * Perfil analítico: año completo, remuneración uniforme con prorrata incluida,
 * contrato indefinido, sin horas extra ni especialidades. Mantiene los tipos
 * ordinarios del perfil heredado (incluido AT/EP 1,5 %); no valida su elegibilidad
 * ni mínimos por grupo/jornada y no representa cuotas ingresables mensuales.
 */
export const calcularDesgloseCotizacionesPerfilUniforme = ({
  anio,
  salarioBrutoAnual,
}: EntradaCotizacionesSocialesLegacy): CotizacionesPerfilUniforme => {
  const parametros = obtenerParametrosCotizacionLegacy(anio)
  const legacy = calcularDesgloseCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual,
  })
  // ESS/55/2018 art. 2 y Ley 6/2018 art. 130 + DF 46: agosto, no julio.
  // Forma algebraica de 7 min(S/12,3751.20) + 5 min(S/12,3803.70),
  // con una sola división para evitar redondear S/12 antes de aplicar topes.
  const baseOrdinaria =
    anio === 2018
      ? Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ).mul(5)
          )
          .div(12)
      : legacy.baseOrdinaria
  const excesoBase = Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria))
  const solidaridad = Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const
    )
  )
  const solidaridadEmpresarial = cuotaSolidaridad(
    excesoBase,
    parametros.baseMaxima,
    solidaridad.empresa
  )
  const solidaridadTrabajador = cuotaSolidaridad(
    excesoBase,
    parametros.baseMaxima,
    solidaridad.trabajador
  )
  const cotizacionEmpresarialOrdinaria = baseOrdinaria.mul(
    sumarTipoCotizacionLegacy(parametros, "empresarial")
  )
  const cotizacionTrabajadorOrdinaria = baseOrdinaria.mul(
    sumarTipoCotizacionLegacy(parametros, "trabajador")
  )
  const meiEmpresarial = baseOrdinaria.mul(parametros.mei.empresarial)
  const meiTrabajador = baseOrdinaria.mul(parametros.mei.trabajador)

  return {
    alcance: "analitico-doce-mensualidades-uniformes",
    redondeoTgss: "pendiente",
    baseOrdinaria,
    excesoBase,
    cotizacionEmpresarialOrdinaria,
    cotizacionTrabajadorOrdinaria,
    meiEmpresarial,
    meiTrabajador,
    solidaridadEmpresarial,
    solidaridadTrabajador,
    cotizacionEmpresarial: cotizacionEmpresarialOrdinaria
      .plus(meiEmpresarial)
      .plus(solidaridadEmpresarial),
    cotizacionTrabajador: cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador)
      .plus(solidaridadTrabajador),
  }
}
