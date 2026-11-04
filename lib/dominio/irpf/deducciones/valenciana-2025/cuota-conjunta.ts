import Decimal from "decimal.js"
import { Schema } from "effect"
import {
  componerDeduccionesValencianas2025,
  componerDeduccionesValencianasConCuotaAnual2025,
  type ComposicionValenciana2025,
  type CuotaSeparada,
  type ResultadoComposicion,
} from "./composicion"

export type AplicacionCuotaConjuntaValenciana2025<Importe = number> = {
  readonly hechos: ComposicionValenciana2025<Importe> & {
    readonly cuota: CuotaSeparada<Importe>
  }
  /** Todos los ids históricos y los ids JSON.stringify([codigo,2025,titular]). */
  readonly ordenConsumo: readonly string[]
  readonly criterioOrden: "eleccion_experta"
}
export type MovimientoCuotaConjunta<Importe = number> = {
  readonly id: string
  readonly codigo: string
  readonly contribuyente: string
  readonly origen: number
  readonly soporte: string
  readonly clase: "historico" | "generado_2025"
  readonly deduccionDisponible: Importe
  readonly aplicado: Importe
  /** Sólo saldo utilizable después de 2025; nunca base/gasto excesivo. */
  readonly pendiente: Importe
  readonly perdidoPorCuota: Importe
  readonly caducadoAlCierre: Importe
  readonly ultimoEjercicio?: number
}
export type ResultadoCuotaConjuntaValenciana2025<Importe = number> = {
  readonly estado: "calculo_parcial" | "no_soportado"
  readonly aceptacionFiscal: "pendiente"
  readonly composicion: ResultadoComposicion<Importe>
  readonly incidencias: readonly string[]
  readonly movimientos: readonly MovimientoCuotaConjunta<Importe>[]
  readonly referenciaCuota?: string
  readonly totalAplicado?: Importe
  readonly cuotaRestante?: Importe
  readonly reserva: string
}

const reserva =
  "Aplicación parcial a una cuota externa declarada, sin liquidación ni aceptación fiscal. " +
  "Orden elegido expresamente por el experto, sin prioridad legal inferida ni optimización automática. " +
  "Derechos históricos, identidad real, exhaustividad de saldos y acreditaciones pendientes. " +
  "Simulación sin persistencia: registrar los movimientos una sola vez en el expediente."
const c = (s: string) => "valenciana_" + s
function plazo(codigo: string): number {
  if (
    [
      c("autoconsumo_renovables"),
      c("dana_danos_materiales_vivienda_habitual"),
    ].includes(codigo)
  )
    return 4
  if (
    [
      c("inversion_entidades_nuevas_reciente_creacion"),
      c("dana_aportaciones_fondos_propios_entidades"),
    ].includes(codigo)
  )
    return 3
  return 0
}
function exigir(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError(motivo)
}
function centimos(n: number): Decimal {
  exigir(
    Schema.is(Schema.Number)(n) && Number.isFinite(n) && n >= 0,
    "Importe inválido"
  )
  const v = new Decimal(n).times(100)
  exigir(
    v.isInteger() && v.lte(Number.MAX_SAFE_INTEGER),
    "Importe fuera de céntimos exactos seguros"
  )
  return v
}
function euros(n: Decimal): number {
  const v = n.div(100).toNumber()
  exigir(
    new Decimal(v).times(100).eq(n),
    "Salida no representable exactamente en céntimos"
  )
  return v
}

/** Reevalúa los hechos: nunca acepta como prueba un ResultadoComposicion externo.
 * No invoca el aplicador aislado ni reutiliza la cuota original entre códigos.
 */
export function aplicarCuotaConjuntaValenciana2025(
  a: AplicacionCuotaConjuntaValenciana2025
): ResultadoCuotaConjuntaValenciana2025 {
  return aplicar(a, componerDeduccionesValencianas2025, euros, reserva)
}

/** Comparte validación, orden y consumo con el contrato aislado. Los movimientos
 * de la cuota anual se serializan sin cuantizar ni convertirlos a Number.
 */
export function aplicarCuotaAnualValenciana2025(
  a: AplicacionCuotaConjuntaValenciana2025<string>
): ResultadoCuotaConjuntaValenciana2025<string> {
  return aplicar(
    a,
    componerDeduccionesValencianasConCuotaAnual2025,
    (v) => v.div(100).toString(),
    reserva.replace(
      "a una cuota externa declarada, sin liquidación ni aceptación fiscal",
      "a la cuota decimal calculada por el núcleo anual, sin aceptación fiscal"
    )
  )
}

function aplicar<Importe extends number | string>(
  a: AplicacionCuotaConjuntaValenciana2025<Importe>,
  componer: (
    hechos: ComposicionValenciana2025<Importe>
  ) => ResultadoComposicion<Importe>,
  presentar: (v: Decimal) => Importe,
  reserva: string
): ResultadoCuotaConjuntaValenciana2025<Importe> {
  let composicion: ResultadoComposicion<Importe> = {
    estado: "no_soportado",
    aceptacionFiscal: "pendiente",
    resultados: [],
    incidencias: [],
  }
  try {
    composicion = componer(a.hechos)
    if (composicion.estado !== "calculo_parcial")
      return {
        estado: "no_soportado",
        aceptacionFiscal: "pendiente",
        composicion,
        incidencias: composicion.incidencias,
        movimientos: [],
        reserva,
      }
    exigir(
      Object.keys(a).every((k) =>
        ["hechos", "ordenConsumo", "criterioOrden"].includes(k)
      ),
      "Campos ajenos a aplicación conjunta"
    )
    exigir(
      a.criterioOrden === "eleccion_experta",
      "Falta elección experta explícita del orden"
    )
    const cuota = composicion.cuotaSinAplicar
    exigir(cuota !== undefined, "Falta cuota externa identificada")
    const exacta = new Decimal(cuota.disponible)
    const D = Decimal.clone({
      precision: Math.max(80, exacta.precision() + Math.max(0, -exacta.e) + 20),
    })
    let disponible = Schema.is(Schema.Number)(cuota.disponible)
      ? new D(centimos(cuota.disponible))
      : new D(cuota.disponible).times(100)
    const inicial = disponible
    type Saldo = {
      id: string
      codigo: string
      contribuyente: string
      origen: number
      pendiente: number
      soporte: string
      clase: "historico" | "generado_2025"
    }
    const saldos: Saldo[] = cuota.arrastres.map((v) => ({
      ...v,
      clase: "historico",
    }))
    for (const v of saldos) {
      exigir(
        !a.hechos.consignaciones.some((x) => x.codigo === v.codigo),
        "Arrastre con consignación externa: posible doble uso"
      )
      // Ambos regímenes DANA admiten generación en 2024 y 2025.
      exigir(
        v.codigo !== c("dana_aportaciones_fondos_propios_entidades") ||
          v.origen === 2024,
        "Origen anterior al régimen DANA aportaciones"
      )
      exigir(
        v.codigo !== c("dana_danos_materiales_vivienda_habitual") ||
          v.origen === 2024,
        "Origen anterior al régimen DANA vivienda"
      )
    }
    for (const fila of composicion.resultados) {
      if (fila.eleccion !== "aplicar") continue
      exigir(
        fila.resultado.estado === "calculo_parcial",
        "Fila aplicada rechazada"
      )
      saldos.push({
        id: JSON.stringify([fila.codigo, 2025, a.hechos.contribuyente]),
        codigo: fila.codigo,
        contribuyente: a.hechos.contribuyente,
        origen: 2025,
        pendiente: fila.resultado.importe,
        soporte: fila.resultado.motivo,
        clase: "generado_2025",
      })
    }
    const porId = new Map(saldos.map((v) => [v.id, v]))
    exigir(porId.size === saldos.length, "Colisión de ids históricos/generados")
    exigir(
      Array.isArray(a.ordenConsumo) &&
        a.ordenConsumo.length === saldos.length &&
        new Set(a.ordenConsumo).size === saldos.length &&
        a.ordenConsumo.every((id) => porId.has(id)),
      "Orden incompleto, duplicado o ajeno"
    )
    // Manual AEAT 2025: en autoconsumo y en inversión en entidades,
    // los históricos del mismo código preceden a la generación corriente.
    // No impone aquí FIFO entre históricos ni prioridad entre códigos.
    for (const codigo of [
      c("autoconsumo_renovables"),
      c("inversion_entidades_nuevas_reciente_creacion"),
    ]) {
      const corriente = saldos.find(
        (v) => v.codigo === codigo && v.origen === 2025
      )
      if (corriente !== undefined)
        exigir(
          saldos
            .filter((v) => v.codigo === codigo && v.origen < 2025)
            .every(
              (v) =>
                a.ordenConsumo.indexOf(v.id) <
                a.ordenConsumo.indexOf(corriente.id)
            ),
          `${codigo}: los saldos históricos preceden a la generación corriente (manual AEAT 2025)`
        )
    }
    const movimientos: MovimientoCuotaConjunta<Importe>[] = []
    for (const id of a.ordenConsumo) {
      const v = porId.get(id)!
      const saldo = new D(centimos(v.pendiente))
      const aplicado = D.min(disponible, saldo)
      disponible = disponible.minus(aplicado)
      const resto = saldo.minus(aplicado)
      const anos = plazo(v.codigo)
      const ultimo = v.origen + anos
      const movimiento: MovimientoCuotaConjunta<Importe> = {
        id: v.id,
        codigo: v.codigo,
        contribuyente: v.contribuyente,
        origen: v.origen,
        soporte: v.soporte,
        clase: v.clase,
        deduccionDisponible: presentar(saldo),
        aplicado: presentar(aplicado),
        pendiente: presentar(anos > 0 && ultimo > 2025 ? resto : new D(0)),
        perdidoPorCuota: presentar(anos === 0 ? resto : new D(0)),
        caducadoAlCierre: presentar(
          anos > 0 && ultimo === 2025 ? resto : new D(0)
        ),
      }
      movimientos.push(
        anos > 0 ? { ...movimiento, ultimoEjercicio: ultimo } : movimiento
      )
    }
    return {
      estado: "calculo_parcial",
      aceptacionFiscal: "pendiente",
      composicion,
      incidencias: [],
      movimientos,
      referenciaCuota: cuota.referencia,
      totalAplicado: presentar(inicial.minus(disponible)),
      cuotaRestante: presentar(disponible),
      reserva,
    }
  } catch (error) {
    return {
      estado: "no_soportado",
      aceptacionFiscal: "pendiente",
      composicion,
      incidencias: [
        error instanceof RangeError
          ? error.message
          : "Aplicación conjunta no conforme al contrato runtime",
      ],
      movimientos: [],
      reserva,
    }
  }
}
