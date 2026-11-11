import Decimal from "decimal.js"
import type { CasoFiscalAnualExplicitoBase } from "./conexion-contrato"
import { admiteOperandoOpen2018 } from "./politica-open-2018"

const D = Decimal.clone({ precision: 80 })

/** Dominio económico revisable: base positiva tras reducción máxima y sin
 * superar el tramo estatal hasta 60000. Con SS1000 y gasto f2000 resulta
 * 8565 < bruto <= 63000 en 2020/21; en 2022 <=58596.90 para excluir
 * el último tramo autonómico sin testigo. No es la cota técnica 1e6. */
export const admiteArgumentoOpen2020A2022 = (
  integro: Decimal,
  gastosAE: Decimal,
  anio: number
): boolean =>
  [2020, 2021, 2022].includes(anio) &&
  admiteOperandoOpen2018(integro) && gastosAE.eq(1000) &&
  integro.gt(8565) && integro.lte(anio === 2022 ? "58596.90" : "63000")

/** El contrato anual no lleva DOB: exige edad de devengo coherente con los
 * testigos DOB1985 (35/36/37), sin afirmar verificar la fecha de nacimiento.
 * Los hechos negativos son declaraciones explícitas, nunca inferencias del SES. */
export const esPerfilOpen2020A2022 = (c: CasoFiscalAnualExplicitoBase): boolean => {
  if (c.perfil !== "solo-trabajo" || c.ejercicio < 2020 || c.ejercicio > 2022 ||
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
    admiteArgumentoOpen2020A2022(new D(r.integro), new D(r.cotizaciones.seguridadSocial), c.ejercicio)
}
