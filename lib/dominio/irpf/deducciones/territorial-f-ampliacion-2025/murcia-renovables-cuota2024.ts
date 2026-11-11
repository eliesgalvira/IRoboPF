import Decimal from "decimal.js"
import type { HistoriaRenovablesMurcia2024 } from "./murcia-renovables-historia-esquema"
import { adaptarTrabajoAnual } from "../../trabajo-anual/adaptador"
import { calcularReduccionTrabajoConOtrasRentas } from "../../reducciones/reduccion-rendimientos-trabajo"
import { obtenerParametrosComunidadAutonoma } from "../../comunidades/comunidad-autonoma"
import { obtenerMinimoContribuyente } from "../../minimos/minimo-contribuyente"
import { MINIMOS_ESTATALES_2024 } from "../../../normativa/datos/minimos-autonomicos-2024"
import { calcularCuotaPorEscala } from "../../cuotas/escalas-gravamen"
import { obtenerEscalaAutonomicaPublicada } from "../../cuotas/escalas-publicadas"
import { falta } from "./comun"

const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
export const POLITICA_RENOVABLES_2024 = "decimal80-casillas2024-centimos-half-up" as const
/** Composición privada del perfil sin familia/ahorro/minoraciones.
 * Usa los mismos núcleos que composición-anual; no crea tarifas ni fórmulas art19/20.
 * Operandos a céntimos <=1M: las operaciones finitas de este perfil caben en80 cifras.
 * Casillas2024 a céntimos: art20, gravámenes y cuotas. Cinco capturas Murcia
 * PDF/SES acreditan estos casos; no se extrapola la política histórica de Madrid.
 */
export function producirCuotaTrabajoMurcia2024(h: HistoriaRenovablesMurcia2024, edad: number) {
  const t = h.trabajo, r = t.rendimientos[0]
  if (t.ejercicio !== 2024 || t.territorio !== "comun" || t.discapacidadActiva !== "ninguna" ||
      t.movilidad !== "ninguna" || t.reduccionesArt18 !== "ninguna" || t.rendimientos.length !== 1 ||
      r === undefined || r.clase !== "empleo-laboral" || r.id !== h.empleo.rendimientoId || r.cotizaciones.clase !== "efectivas")
    falta("renovables2024.trabajo", "Un empleo laboral ordinario certificado del ejercicio2024")
  const bruto = new D(r.integro)
  if (bruto.lte(0) || bruto.gt(1000000) || new D(h.empleo.retencionesEUR).gt(bruto) || new D(r.cotizaciones.seguridadSocial).gt(bruto) ||
      !new D(r.cotizaciones.derechosPasivos).isZero() || !new D(r.cotizaciones.colegiosHuerfanos).isZero() ||
      !new D(r.sindicato.importe).isZero() || r.sindicato.satisfecho !== "no" ||
      !new D(r.colegio.importe).isZero() || r.colegio.satisfecho !== "no" || r.colegio.obligatorio !== "no" || r.colegio.finesEsenciales !== "no" ||
      !new D(r.defensa.importe).isZero() || r.defensa.satisfecho !== "no" || r.defensa.litigioDirectoPagador !== "no")
    falta("renovables2024.gastos", "Primer perfil: sólo cotizaciones SS efectivas y gasto general común; bruto positivo <=1M")
  const aporte = adaptarTrabajoAnual(t)
  if (aporte.estado === "no-soportado") falta("renovables2024.art19", aporte.motivo)
  const neto = new D(aporte.rendimientoAntesArt20)
  const reduccionExacta = D.min(D.max(0, neto), calcularReduccionTrabajoConOtrasRentas({
    anio: 2024, rendimientoPrevioNeto: new D(aporte.argumentoArt20), otrasRentasNoExentas: new D(0),
  }))
  const reduccion = reduccionExacta.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
  const base = D.max(0, neto.minus(reduccion))
  if (base.gte(35000)) falta("renovables2024.franja", "Primer origen sólo base imponible derivada inferior a35000; sin extrapolar umbrales2025")
  const p = obtenerParametrosComunidadAutonoma({ anio: 2024, comunidadAutonoma: "murcia", baseLiquidableGeneral: base })
  if (p._tag !== "ParametrosComunidadAutonoma") falta("renovables2024.parametros", p.motivo)
  const minimoEstatal = new D(obtenerMinimoContribuyente({ anio: 2024, edad, minimos: MINIMOS_ESTATALES_2024 }))
  const minimoAutonomico = new D(obtenerMinimoContribuyente({ anio: 2024, edad, minimos: p.minimosAutonomicos }))
  const escalaPublicada = obtenerEscalaAutonomicaPublicada({ anio: 2024, comunidadAutonoma: "murcia" })
  const auton = (b: Decimal) => calcularCuotaPorEscala({ base: b, tramos: p.escalaAutonomica.tramos,
    escalasPublicadas: escalaPublicada === undefined ? undefined : [escalaPublicada], aritmetica: D, representacion: "decimal" })
  const estatal = (b: Decimal) => calcularCuotaPorEscala({ base: b, tramos: p.escalaEstatalGeneral, aritmetica: D, representacion: "decimal" })
  const centimos = (n: Decimal) => n.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
  const cuotaAutonomica = D.max(0, centimos(auton(base)).minus(centimos(auton(D.min(base, minimoAutonomico)))))
  const cuotaEstatal = D.max(0, centimos(estatal(base)).minus(centimos(estatal(D.min(base, minimoEstatal)))))
  return { bruto, gastosArt19: new D(aporte.gastos.gastosAE).plus(aporte.gastos.generalesAplicados),
    netoArt19: neto, reduccionArt20: reduccion, base, minimoEstatal, minimoAutonomico,
    cuotaEstatal, cuotaAutonomica, retenciones: new D(h.empleo.retencionesEUR), politica: POLITICA_RENOVABLES_2024 }
}
