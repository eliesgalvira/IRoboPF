import Decimal from "decimal.js"
import type { CasoTrabajoAlquilerOrdinario2025 } from "./contrato"
import { costeConstruccion2025, historiaDesconocidaNoVinculante2025 } from "../inmobiliario-2025/coste-construccion"

const A = Decimal.clone({ precision: 80 })
const halfUp2 = (v: Decimal) => v.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
/** Política operativa, no sustituto del productor legal racional.
 * Precondiciones documentales e historia declarada siguen pendientes de acreditación.
 * La preparación común valida contrato, censo, límites y naturaleza efectiva antes de usarla.
 */
export function producirPoliticaAlquilerOpen2025(c: CasoTrabajoAlquilerOrdinario2025) {
 const v=c.inmuebles[0]!
 if(v.adquisicion.costeSuelo?.estado!=="desconocido") throw new RangeError("Open alquiler: requiere suelo desconocido")
 const totalAdquisicion=new A(v.adquisicion.precio).plus(v.adquisicion.gastosTributos)
 const construccionCatastral=new A(v.catastro2025.construccion)
 const totalCatastro=construccionCatastral.plus(v.catastro2025.suelo)
 if(!totalCatastro.gt(0) || !totalAdquisicion.gt(0) || !construccionCatastral.gt(0)) throw new RangeError("Open alquiler: operandos no positivos")
 // Porcentaje HALF_UP2, coste sin cuantizar, amortización anual HALF_UP2 (199/206).
 const porcentaje=halfUp2(construccionCatastral.div(totalCatastro).mul(100))
 const costeOperativo=totalAdquisicion.mul(porcentaje).div(100)
 const baseAmortizacion=A.max(construccionCatastral,costeOperativo)
 const amortizacion=halfUp2(baseAmortizacion.mul("0.03"))
 const costeLegal=costeConstruccion2025(v.adquisicion,v.catastro2025)
 // La cota207 sigue exigida para el productor legal; además la operativa no agota su coste.
 const coste=new A(costeLegal.n.toString()).div(costeLegal.d.toString())
 const cotaHistorica=A.max(totalAdquisicion,new A(c.historia2024.construccion)).mul(3).mul(31).div(36600)
 if(!historiaDesconocidaNoVinculante2025(v.adquisicion,c.historia2024.construccion,costeLegal) ||
   cotaHistorica.plus(amortizacion).gt(coste)) throw new RangeError("Open alquiler: límite acumulado no acreditado por la historia declarada")
 const ingresos=v.exigibilidades.reduce((s,r)=>s.plus(r.importe),new A(0))
 const gastos=v.gastos.reduce((s,r)=>s.plus(r.importe),new A(0))
 const neto=ingresos.minus(gastos).minus(amortizacion)
 const reduccion=neto.div(2), netoReducido=neto.minus(reduccion)
 if(!neto.gt(0) || gastos.gt(ingresos) || neto.decimalPlaces()>2 || netoReducido.decimalPlaces()>2)
  throw new RangeError("Open alquiler: frontera RNR/50% con fracciones de céntimo no identificada; sin redondeo anticipado")
 return {nombre:"open-alquiler-suelo-desconocido-cuatro-gravamenes-2025" as const,
  costeLegal,totalAdquisicion,construccionCatastral,totalCatastro,porcentaje,costeOperativo,baseAmortizacion,
  amortizacion,ingresos,gastos,neto,reduccion,netoReducido,
  historia:"declarada-no-acreditada-por-originales-open" as const}
}
