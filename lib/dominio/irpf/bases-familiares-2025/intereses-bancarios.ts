import Decimal from "decimal.js"
import { DateTime, Option, Result, Schema } from "effect"

const D = Decimal.clone({ precision: 80 })
const Id = Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/))
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Euros = Schema.String.check(Schema.isPattern(/^(0|[1-9][0-9]{0,8})(\.[0-9]{1,2})?$/))
/** Intereses dinerarios de cuentas/depósitos ordinarios con titular único.
 * Los importes son hechos brutos del certificado; no bases fiscales externas. */
export const InteresesBancariosFamilia2025 = Schema.Struct({
  referencia: Texto, sujetoId: Id, ejercicio: Schema.Literal(2025),
  censoCuentasCompleto: Schema.Literal(true),
  cuentas: Schema.Array(Schema.Struct({
    id: Texto, titularId: Id, entidad: Texto, soporteTitularidad: Texto,
    titularidad: Schema.Literal("privativa-exclusiva"),
    producto: Schema.Literals(["cuenta", "deposito-ordinario"]),
    entidadResidenteEspana: Schema.Literal(true), establecimientoEnEspana: Schema.Literal(true),
    vinculacion: Schema.Literal("no-vinculada"),
    litigio: Schema.Literal("ninguno"), retribucion: Schema.Literal("dineraria"),
    liquidacionesCompletas: Schema.Literal(true),
    liquidaciones: Schema.Array(Schema.Struct({
      id: Texto, fechaExigibilidad: Texto, fechaAbono: Texto, soporte: Texto,
      integroEUR: Euros, retencionEUR: Euros,
    })).check(Schema.isLengthBetween(1, 100)),
  })).check(Schema.isLengthBetween(1, 100)),
})

function exigir(ok: boolean, causa: string): asserts ok {
  if (!ok) throw new RangeError("Intereses familiares: " + causa)
}
function fecha2025(fecha: string): boolean {
  const d = DateTime.make(fecha + "T00:00:00Z")
  return /^2025-\d{2}-\d{2}$/.test(fecha) && Option.isSome(d) && DateTime.formatIsoDateUtc(d.value) === fecha
}
export function producirInteresesBancarios2025(entrada: typeof InteresesBancariosFamilia2025.Type): Decimal {
  const decoded = Schema.decodeUnknownResult(InteresesBancariosFamilia2025)(entrada, { onExcessProperty: "error" })
  exigir(Result.isSuccess(decoded), "contrato incompleto o magnitudes ajenas al perfil")
  const c = decoded.success
  const cuentas = new Set<string>(), liquidaciones = new Set<string>()
  let total = new D(0)
  for (const cuenta of c.cuentas) {
    exigir(cuenta.titularId === c.sujetoId, "titularidad contradictoria")
    const clave = JSON.stringify([cuenta.entidad, cuenta.id])
    exigir(!cuentas.has(clave), "cuenta duplicada"); cuentas.add(clave)
    for (const l of cuenta.liquidaciones) {
      const claveLiquidacion = JSON.stringify([cuenta.entidad, l.id])
      exigir(!liquidaciones.has(claveLiquidacion), "liquidación duplicada"); liquidaciones.add(claveLiquidacion)
      exigir(fecha2025(l.fechaExigibilidad) && fecha2025(l.fechaAbono) && l.fechaAbono >= l.fechaExigibilidad,
        "exigibilidad/abono fuera del perfil ordinario 2025")
      const bruto = new D(l.integroEUR), retencion = new D(l.retencionEUR)
      exigir(bruto.gt(0) && retencion.lte(bruto), "importe o retención contradictorios")
      // Arts25.2/26: la retención no reduce el rendimiento; no gastos de valores.
      total = total.plus(bruto)
    }
  }
  return total
}
