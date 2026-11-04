import Decimal from "decimal.js"
import { Schema } from "effect"
import type { ResultadoDeduccion } from "../contratos-2025"
import { Solicitud, idsValidos, parcial, rechazar } from "./comun"
import { evaluarDeduccionValenciana2025 } from "./index"

const Dinero = Schema.Number.check(
  Schema.isFinite(),
  Schema.isGreaterThanOrEqualTo(0)
)
export const AplicacionCuotaValenciana2025 = Schema.Struct({
  hechos: Solicitud,
  cuotaDisponible: Dinero,
  referenciaCuota: Schema.String,
  arrastres: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      codigo: Schema.String,
      contribuyente: Schema.String,
      origen: Schema.Number.check(Schema.isInt()),
      pendiente: Dinero,
      soporte: Schema.String,
    })
  ),
})
export type AplicacionCuotaValenciana =
  typeof AplicacionCuotaValenciana2025.Type
export type MovimientoArrastre = {
  readonly id: string
  readonly origen: number
  readonly aplicado: number
  readonly pendiente: number
  readonly caduca: number
}
export type EvaluacionCuotaValenciana = {
  readonly resultado: ResultadoDeduccion
  readonly movimientos: readonly MovimientoArrastre[]
}
/** Aplica exclusivamente una deducción a una cuota externa identificada.
 * No calcula cuota general ni suma deducciones, no consume estado ni crea liquidación.
 */
export function evaluarCuotaValenciana2025(
  entrada: AplicacionCuotaValenciana
): EvaluacionCuotaValenciana {
  try {
    const a = Schema.decodeUnknownSync(AplicacionCuotaValenciana2025)(entrada)
    const generado = evaluarDeduccionValenciana2025(a.hechos)
    if (generado.estado !== "calculo_parcial")
      return { resultado: generado, movimientos: [] }
    const codigo = a.hechos.codigo
    const plazo = [
      "valenciana_autoconsumo_renovables",
      "valenciana_dana_danos_materiales_vivienda_habitual",
    ].includes(codigo)
      ? 4
      : [
            "valenciana_inversion_entidades_nuevas_reciente_creacion",
            "valenciana_dana_aportaciones_fondos_propios_entidades",
          ].includes(codigo)
        ? 3
        : 0
    if (plazo === 0)
      rechazar("No hay régimen de arrastre soportado para este código")
    if (a.referenciaCuota.trim() === "")
      rechazar("Falta referencia de cuota disponible")
    if (a.arrastres.length > 0 && !idsValidos(a.arrastres.map((v) => v.id)))
      rechazar("Arrastres duplicados")
    if (
      new Decimal(a.cuotaDisponible).decimalPlaces() > 2 ||
      a.arrastres.some((v) => new Decimal(v.pendiente).decimalPlaces() > 2)
    )
      rechazar("Cuota y saldos históricos deben expresarse en céntimos")
    const idGenerado = codigo + ":2025:" + a.hechos.contribuyente
    if (a.arrastres.some((v) => v.id === idGenerado))
      rechazar("ID histórico colisiona con generación 2025")
    let disponible = new Decimal(a.cuotaDisponible)
    const movimientos: MovimientoArrastre[] = []
    const pendientes = [...a.arrastres].sort(
      (x, y) => x.origen - y.origen || x.id.localeCompare(y.id)
    )
    for (const v of pendientes) {
      if (
        v.codigo !== codigo ||
        v.contribuyente !== a.hechos.contribuyente ||
        v.soporte.trim() === "" ||
        v.origen >= 2025 ||
        v.origen + plazo < 2025
      )
        rechazar("Arrastre ajeno, sin soporte o fuera de plazo")
      const aplicado = Decimal.min(disponible, v.pendiente)
      disponible = disponible.minus(aplicado)
      movimientos.push({
        id: v.id,
        origen: v.origen,
        aplicado: aplicado.toNumber(),
        pendiente: new Decimal(v.pendiente).minus(aplicado).toNumber(),
        caduca: v.origen + plazo,
      })
    }
    const aplicado = Decimal.min(disponible, generado.importe)
    movimientos.push({
      id: codigo + ":2025:" + a.hechos.contribuyente,
      origen: 2025,
      aplicado: aplicado.toNumber(),
      pendiente: new Decimal(generado.importe).minus(aplicado).toNumber(),
      caduca: 2025 + plazo,
    })
    return {
      resultado: parcial(
        new Decimal(a.cuotaDisponible).minus(disponible).plus(aplicado),
        generado.motivo +
          " Aplicación parcial a cuota externa " +
          a.referenciaCuota +
          "; arrastres por insuficiencia de cuota, nunca exceso de inversión. Derechos históricos y requisitos fiscales pendientes de revisión."
      ),
      movimientos,
    }
  } catch (error) {
    return {
      resultado: {
        estado: "no_soportado",
        motivo:
          error instanceof RangeError
            ? error.message
            : "Aplicación de cuota no conforme al esquema",
      },
      movimientos: [],
    }
  }
}
