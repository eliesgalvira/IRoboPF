import Decimal from "decimal.js"
import type { CasoFiscalAnualExplicitoBase } from "./conexion-contrato"
import { admiteOperandoOpen2018 } from "./politica-open-2018"

const D = Decimal.clone({ precision: 80 })

/** Envolvente experimental de dos conjuntos separados; no acredita cada punto
 * del intervalo ni equivalencia general Open1.23/1.24 o algoritmo interno AEAT. */
export const admiteArgumentoOpen2023A2024 = (
  integro: Decimal,
  gastosAE: Decimal,
  anio: number
): boolean =>
  [2023, 2024].includes(anio) &&
  admiteOperandoOpen2018(integro) && gastosAE.eq(1000) &&
  gastosAE.isFinite() && integro.gte("12546.57") && integro.lte("58172.55")

/** El contrato anual no lleva DOB: exige edad de devengo coherente con los
 * testigos DOB1985 (38/39), sin afirmar verificar la fecha de nacimiento.
 * Los hechos negativos son declaraciones explícitas, nunca inferencias del SES. */
export const esPerfilOpen2023A2024 = (c: CasoFiscalAnualExplicitoBase): boolean => {
  if (c.perfil !== "solo-trabajo" || c.ejercicio < 2023 || c.ejercicio > 2024 ||
    c.comunidadAutonoma !== "madrid" || c.edad !== c.ejercicio - 1985 ||
    c.modalidad !== "individual" || !c.residenciaTodoElAnio ||
    c.devengo !== `${c.ejercicio}-12-31` || c.otrasRentas !== "ninguna" ||
    c.familiaresConDerechoMinimo !== "ninguno" || c.derechosMinimos !== undefined ||
    c.discapacidad !== "ninguna" || c.reduccionesBase !== "ninguna" ||
    c.saldosAnteriores !== "ninguno" || c.deducciones !== "ninguna" ||
    c.rentasExtranjeras !== "ninguna" || c.especialidades !== "ninguna" ||
    c.basesFamiliares2025 !== undefined || c.maternidad2025 !== undefined ||
    c.deduccionesTerritoriales2025 !== undefined || c.deduccionesValencianas2025 !== undefined ||
    c.trabajo.ejercicio !== c.ejercicio || c.trabajo.territorio !== "comun" ||
    c.trabajo.reduccionesArt18 !== "ninguna" || c.trabajo.movilidad !== "ninguna" ||
    c.trabajo.discapacidadActiva !== "ninguna" || c.trabajo.rendimientos.length !== 1 ||
    c.conciliacion.ejercicio !== c.ejercicio || c.retenciones.length !== 1) return false
  const r = c.trabajo.rendimientos[0]
  const pago = c.retenciones[0]
  if (r === undefined || pago === undefined) return false
  return r.clase === "empleo-laboral" && r.cotizaciones.clase === "efectivas" &&
    new D(r.cotizaciones.seguridadSocial).eq(1000) &&
    new D(r.cotizaciones.derechosPasivos).isZero() &&
    new D(r.cotizaciones.colegiosHuerfanos).isZero() &&
    [r.sindicato.importe, r.colegio.importe, r.defensa.importe].every(v => new D(v).isZero()) &&
    r.sindicato.satisfecho !== "desconocido" && r.colegio.satisfecho !== "desconocido" &&
    r.colegio.obligatorio !== "desconocido" && r.colegio.finesEsenciales !== "desconocido" &&
    r.defensa.satisfecho !== "desconocido" && r.defensa.litigioDirectoPagador !== "desconocido" &&
    pago.efectiva && pago.ejercicio === c.ejercicio && new D(pago.importe).eq(100) &&
    admiteArgumentoOpen2023A2024(new D(r.integro), new D(r.cotizaciones.seguridadSocial), c.ejercicio)
}

/** Alternativas discriminadas: no se activan por semejanza ni en la API canónica. */
export type AlternativaOpen2023A2024 =
  | { readonly anio: 2023; readonly representacion: "racional-half-up"; readonly integro: Decimal; readonly gastosAE: Decimal }
  | { readonly anio: 2024; readonly representacion: "binary64-corto-half-up"; readonly integro: Decimal; readonly gastosAE: Decimal }

export const alternativaOpen2023A2024 = (anio: number, integro: Decimal, gastosAE: Decimal): AlternativaOpen2023A2024 | undefined =>
  !admiteArgumentoOpen2023A2024(integro, gastosAE, anio) ? undefined
    : anio === 2023 ? { anio, representacion: "racional-half-up", integro, gastosAE }
    : { anio: 2024, representacion: "binary64-corto-half-up", integro, gastosAE }
