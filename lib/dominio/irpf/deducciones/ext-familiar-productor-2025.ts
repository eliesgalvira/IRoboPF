import { producirEconomiaAjena2025 } from "../bases-familiares-2025/productor"
import { DateTime, Option, Result, Schema } from "effect"
import Decimal from "decimal.js"
import { EconomiaExentaFamiliar2025, PatrimonioFamiliarExt2025 } from "./ext-familiar-contrato-2025"
const D = Decimal.clone({ precision: 80 })
export function exigirFamiliar(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError("EXT familiar: " + motivo)
}
export function fechaFamiliar(s: string): number {
  const f = DateTime.make(s + "T00:00:00Z")
  exigirFamiliar(Option.isSome(f) && DateTime.formatIsoDateUtc(f.value) === s, "fecha inválida: " + s)
  return DateTime.toEpochMillis(f.value)
}
function centimos(s: string): bigint { return BigInt(new D(s).times(100).toFixed(0)) }
export function unicosFamiliar(ids: readonly string[], nombre: string): void {
  exigirFamiliar(new Set(ids).size === ids.length, nombre + " duplicado")
}
export interface RentaExentaFamiliar2025 {
  readonly rentasIncluidasExentas: string; readonly noExentasCentimos: 0;
}
/** Art7.f: no art19/20 ni liquidación ajena; suma íntegra de cobros exentos2025. */
export function producirRentaExentaFamiliar2025(entrada: EconomiaExentaFamiliar2025): RentaExentaFamiliar2025 {
  const r = Schema.decodeUnknownResult(EconomiaExentaFamiliar2025)(entrada, { onExcessProperty: "error" })
  exigirFamiliar(Result.isSuccess(r), "rentas: sólo ausencia expresa o SS pública absoluta/gran invalidez; otras clases/mezclas no representadas")
  const e = r.success
  const ausenciaSujeta = producirEconomiaAjena2025({ perfil: "sin-rentas", censoRentasCompleto: true }, false)
  if (e.perfil === "sin-rentas") {
    fechaFamiliar(e.soporte.fecha)
    return { rentasIncluidasExentas: ausenciaSujeta.general.plus(ausenciaSujeta.ahorro).toFixed(), noExentasCentimos: 0 }
  }
  exigirFamiliar(e.otrasRentasSujetas === "ninguna" && e.otrasExentas === "ninguna", "rentas: otras rentas sujetas/exentas presentes o desconocidas; mezcla no representada")
  unicosFamiliar(e.prestaciones.map(p => p.id), "prestación")
  unicosFamiliar(e.prestaciones.flatMap(p => p.cobros.map(c => c.id)), "cobro")
  unicosFamiliar(e.prestaciones.flatMap(p => p.cobros.map(c => c.referenciaBancaria)), "referencia bancaria de cobro")
  let total = ausenciaSujeta.general.plus(ausenciaSujeta.ahorro)
  for (const p of e.prestaciones) {
    exigirFamiliar(["INSS", "ISM"].includes(p.organismo) && ["absoluta", "gran-invalidez", "gran-incapacidad"].includes(p.grado), "rentas: sólo SS pública española absoluta/gran invalidez; mutualidad/privada/extranjera/total/parcial fuera de cobertura")
    fechaFamiliar(p.resolucion.fecha); fechaFamiliar(p.efectosDesde); fechaFamiliar(p.efectosHasta)
    exigirFamiliar(p.efectosDesde <= p.efectosHasta && p.resolucion.fecha <= p.efectosDesde, "cronología de resolución/efectos de pensión")
    exigirFamiliar(p.grado !== "gran-incapacidad" || p.resolucion.fecha >= "2025-05-01", "gran incapacidad: denominación anterior a Ley2/2025")
    for (const c of p.cobros) {
      fechaFamiliar(c.fecha); fechaFamiliar(c.exigibleEl)
      exigirFamiliar(c.exigibleEl >= "2025-01-01" && c.exigibleEl <= "2025-12-31" && c.fecha >= "2025-01-01" && c.fecha <= "2025-12-31" && c.fecha >= p.efectosDesde && c.fecha <= p.efectosHasta && new D(c.importe).gt(0), "fecha/importe de cobro de pensión no conciliados")
      exigirFamiliar(c.exigibleEl >= p.efectosDesde && c.exigibleEl <= p.efectosHasta, "exigibilidad fuera del período de efectos de la pensión; hechos no conciliados")
      exigirFamiliar(new D(c.descuentosNomina).eq(0) && new D(c.retencion).eq(0) && new D(c.compensaciones).eq(0), "pensión: cobro neto con descuentos/retenciones/compensaciones requiere productor de íntegro; no usar neto bancario como renta")
      total = total.plus(c.importe)
    }
  }
  return { rentasIncluidasExentas: total.toFixed(), noExentasCentimos: 0 }
}
export interface ObligacionPatrimonioFamiliar2025 {
  readonly obligacionPatrimonio: "si" | "no"; readonly brutoCentimosNumerador: string; readonly brutoDivisor: string;
  readonly prueba: "art37-bruto-superior-2M" | "art37-bruto-no-superior-2M-y-art15bis";
}
/** No se publica base/cuota de IP. Art37 bruto exacto y art15bis EXT2025. */
export function producirObligacionPatrimonioFamiliar2025(entrada: PatrimonioFamiliarExt2025): ObligacionPatrimonioFamiliar2025 {
  const r = Schema.decodeUnknownResult(PatrimonioFamiliarExt2025)(entrada, { onExcessProperty: "error" })
  exigirFamiliar(Result.isSuccess(r), "patrimonio: falta censo mundial exhaustivo, residencia personal EXT o clases/ajustesQ4 fuera de cobertura")
  const p = r.success
  fechaFamiliar(p.soporte.fecha)
  unicosFamiliar([...p.cuentas.map(c => c.id), ...(p.vivienda === undefined ? [] : [p.vivienda.id]), ...p.deudas.map(d => d.id)], "bien/derecho/deuda")
  const movimientos = p.cuentas.flatMap(c => c.diarioQ4.flatMap(d => d.movimientos.map(m => ({ ...m, fecha: d.fecha, cuenta: c.id }))))
  unicosFamiliar(movimientos.map(m => m.id), "movimiento bancario")
  // Denominador común:92 días *10000 basis points. Nunca redondear la mediaQ4.
  const divisor = 920000n
  let bruto = 0n
  for (const c of p.cuentas) {
    exigirFamiliar(c.titular === p.titular && c.titularidadDesde <= "2025-01-01", "titularidad de cuenta no conciliada")
    fechaFamiliar(c.titularidadDesde); fechaFamiliar(c.soporte.fecha)
    let saldo = centimos(c.saldo30Septiembre), suma = 0n
    const inicio = fechaFamiliar("2025-10-01")
    for (const [i, d] of c.diarioQ4.entries()) {
      exigirFamiliar(fechaFamiliar(d.fecha) === inicio + i * 86400000, "diarioQ4: fecha ausente/duplicada/desordenada")
      for (const m of d.movimientos) {
        const importe = centimos(m.importe)
        exigirFamiliar(importe > 0n && (m.causa !== "pension" || m.sentido === "entrada") && (m.causa !== "consumo" || m.sentido === "salida"), "movimiento de importe/sentido inválido")
        saldo += m.sentido === "entrada" ? importe : -importe
        exigirFamiliar(saldo >= 0n, "saldo bancario negativo")
      }
      exigirFamiliar(saldo === centimos(d.saldoCierre), "diarioQ4: saldo no concilia con movimientos")
      suma += saldo
    }
    exigirFamiliar(saldo === centimos(c.saldo31Diciembre), "saldo31Diciembre no concilia")
    const final92 = saldo * 92n
    bruto += (suma > final92 ? suma : final92) * BigInt(c.porcentajeBasisPoints)
  }
  for (const m of movimientos.filter(m => m.causa === "transferencia-propia")) {
    const pares = movimientos.filter(n => n.referencia === m.referencia && n.causa === m.causa)
    exigirFamiliar(pares.length === 2 && pares.every(n => n.importe === m.importe && n.fecha === m.fecha) && pares.some(n => n.sentido !== m.sentido && n.cuenta !== m.cuenta), "transferencia propia no conciliada")
  }
  const v = p.vivienda
  if (v !== undefined) {
    exigirFamiliar(v.titular === p.titular && v.plenoDominioDesde === v.adquisicion.fecha && v.plenoDominioDesde <= "2025-01-01" && v.ocupacionHabitualDesde >= v.plenoDominioDesde && v.ocupacionHabitualDesde <= "2022-01-01" && v.ocupacionIninterrumpidaHasta >= "2025-12-31", "vivienda: titularidad/habitualidad fuera de cobertura")
    for (const f of [v.plenoDominioDesde, v.ocupacionHabitualDesde, v.ocupacionIninterrumpidaHasta, v.catastral.soporte.fecha, v.adquisicion.soporte.fecha]) fechaFamiliar(f)
    const valores = [centimos(v.catastral.importe), centimos(v.adquisicion.precio), ...v.valoresAdministrativos.map(x => {
      fechaFamiliar(x.soporte.fecha)
      exigirFamiliar(x.soporte.fecha <= "2025-12-31", "valor administrativo posterior al devengo")
      return centimos(x.importe)
    })]
    const mayor = valores.reduce((a, b) => a > b ? a : b, 0n)
    bruto += mayor * 92n * BigInt(v.porcentajeBasisPoints)
  }
  for (const d of p.deudas) {
    fechaFamiliar(d.origen); fechaFamiliar(d.soporte.fecha)
    exigirFamiliar(d.deudor === p.titular && d.origen <= "2025-12-31", "deuda: identidad/fecha")
    exigirFamiliar(d.destino !== "vivienda" || (v !== undefined && d.bienFinanciado === v.id), "deuda: vivienda financiada no identificada")
    // No reduce bruto art37, ni se calcula una segunda deducción de la deuda.
  }
  const obligado = bruto > 200000000n * divisor
  return { obligacionPatrimonio: obligado ? "si" : "no", brutoCentimosNumerador: String(bruto), brutoDivisor: String(divisor), prueba: obligado ? "art37-bruto-superior-2M" : "art37-bruto-no-superior-2M-y-art15bis" }
}
