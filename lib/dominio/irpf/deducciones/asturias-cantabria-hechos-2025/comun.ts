import Decimal from "decimal.js"
import { DateTime, Option, Schema } from "effect"

// Configuración independiente del Decimal global usado por otros módulos.
export const D = Decimal.clone({
  precision: 100,
  rounding: Decimal.ROUND_HALF_UP,
})
export type Exacto = {
  readonly numeradorEuros: string
  readonly divisor: string
}
export type ResultadoB =
  | {
      readonly estado: "no_soportado" | "excluida"
      readonly motivo: string
      readonly rastro: readonly string[]
    }
  | {
      readonly estado: "calculo_parcial"
      readonly importeExacto: Exacto
      readonly motivo: string
      readonly rastro: readonly string[]
      readonly reservas: readonly string[]
      readonly aceptacionFiscal: "pendiente"
      readonly aplicacionCuota: "pendiente_padre"
    }
export type MarcoB = {
  readonly ejercicio: 2025
  readonly territorio: "asturias" | "cantabria"
  readonly modalidad: "individual" | "conjunta"
  readonly contribuyente: string
  readonly declarantes: readonly string[]
  readonly baseGeneral: string
  readonly baseAhorro: string
  readonly exhaustividad: "completa" | "incompleta"
}
export class HechoInvalido extends Schema.TaggedErrorClass<HechoInvalido>()(
  "HechoInvalido",
  { message: Schema.String }
) {}
export function exigir(condicion: boolean, mensaje: string): asserts condicion {
  if (!condicion) throw new HechoInvalido({ message: mensaje })
}
export function identidad(s: string): boolean {
  return s.trim().length > 0
}
export function ids(xs: readonly string[]): boolean {
  return xs.length > 0 && xs.every(identidad) && new Set(xs).size === xs.length
}
export function dinero(s: string): Decimal {
  exigir(
    /^\d{1,18}(\.\d{1,2})?$/.test(s),
    "Magnitud monetaria inválida; se exige cadena decimal no negativa en euros"
  )
  return new D(s)
}
export function entero(n: number, min: number, max: number): boolean {
  return Number.isSafeInteger(n) && n >= min && n <= max
}
export function fecha(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = DateTime.make(`${s}T00:00:00Z`)
  return Option.isSome(d) && DateTime.formatIsoDateUtc(d.value) === s
}
export function edad(nacimiento: string): number {
  exigir(fecha(nacimiento) && nacimiento <= "2025-12-31", "Nacimiento inválido")
  return 2025 - Number(nacimiento.slice(0, 4))
}
export function base(m: MarcoB): Decimal {
  return magnitudAnual(m.baseGeneral).plus(magnitudAnual(m.baseAhorro))
}
export function marco(m: MarcoB, territorio: MarcoB["territorio"]): void {
  exigir(
    m.ejercicio === 2025 && m.territorio === territorio,
    "Ámbito distinto de 2025/territorio"
  )
  exigir(m.exhaustividad === "completa", "Colección de hechos incompleta")
  exigir(
    ids(m.declarantes) && m.declarantes.includes(m.contribuyente),
    "Declarantes sin identidad o duplicados"
  )
  exigir(
    m.modalidad === "individual"
      ? m.declarantes.length === 1
      : m.modalidad === "conjunta",
    "Modalidad incoherente"
  )
  base(m)
}
export function factor(m: MarcoB, titulares: readonly string[]): Decimal {
  exigir(
    ids(titulares) && titulares.some((x) => m.declarantes.includes(x)),
    "Titulares incompletos o ajenos"
  )
  return new D(titulares.filter((x) => m.declarantes.includes(x)).length)
}
/** Suma racional: no aproxima tercios ni convierte importes a Number. */
export class Suma {
  private n = new D(0)
  private d = new D(1)
  add(n: Decimal.Value, d: Decimal.Value = "1"): void {
    this.n = this.n.times(d).plus(new D(n).times(this.d))
    this.d = this.d.times(d)
    // Un racional finito admite reducción exacta mediante euclides decimal entero.
    const scale = new D(10).pow(this.n.decimalPlaces())
    const numerador = this.n.times(scale),
      denominador = this.d.times(scale)
    let a = numerador,
      b = denominador
    while (!b.isZero()) {
      const r = a.mod(b)
      a = b
      b = r
    }
    if (!a.isZero()) {
      this.n = numerador.div(a)
      this.d = denominador.div(a)
    }
  }
  exacto(): Exacto {
    return { numeradorEuros: this.n.toFixed(), divisor: this.d.toFixed() }
  }
}
export function parcial(
  s: Suma,
  rastro: readonly string[],
  reservas: readonly string[] = []
): ResultadoB {
  return {
    estado: "calculo_parcial",
    importeExacto: s.exacto(),
    motivo:
      "Cuantía previa a cuota; documentos y derechos externos no certificados",
    rastro,
    reservas,
    aceptacionFiscal: "pendiente",
    aplicacionCuota: "pendiente_padre",
  }
}
export function rechazo(
  estado: "no_soportado" | "excluida",
  motivo: string
): ResultadoB {
  return { estado, motivo, rastro: [motivo] }
}
export function protegido(f: () => ResultadoB): ResultadoB {
  try {
    return f()
  } catch (e) {
    if (Schema.is(HechoInvalido)(e)) return rechazo("no_soportado", e.message)
    throw e
  }
}
// Sólo presentación, nunca entrada de otra fórmula. Redondeo explícito a céntimos.
export function presentarB(e: Exacto): string {
  return new D(e.numeradorEuros).div(e.divisor).toFixed(2, D.ROUND_HALF_UP)
}
export type PagoB = {
  readonly id: string
  readonly pagador: string
  readonly receptor: string
  readonly fecha: string
  readonly euros: string
  readonly documento: string
  readonly medio:
    | "tarjeta"
    | "transferencia"
    | "cheque_nominativo"
    | "ingreso"
    | "efectivo"
}
export function pagos(
  ps: readonly PagoB[],
  m: MarcoB,
  bancario: boolean
): Decimal {
  exigir(
    ps.length <= 1000 && (ps.length === 0 || ids(ps.map((p) => p.id))),
    "Pago duplicado o sin identidad"
  )
  let total = new D(0)
  for (const p of ps) {
    exigir(
      identidad(p.documento) &&
        identidad(p.receptor) &&
        m.declarantes.includes(p.pagador),
      "Pago sin justificante, receptor o pagador declarado"
    )
    exigir(fecha(p.fecha), "Fecha de pago inválida")
    exigir(
      [
        "tarjeta",
        "transferencia",
        "cheque_nominativo",
        "ingreso",
        "efectivo",
      ].includes(p.medio),
      "Medio de pago desconocido"
    )
    const valor = dinero(p.euros)
    if (!p.fecha.startsWith("2025-") || (bancario && p.medio === "efectivo"))
      continue
    total = total.plus(valor)
  }
  return total
}
export type ResolucionB = {
  readonly referencia: string
  readonly organismo: string
  readonly fecha: string
}
export function documento(r: ResolucionB): void {
  exigir(
    identidad(r.referencia) &&
      identidad(r.organismo) &&
      fecha(r.fecha) &&
      r.fecha <= "2025-12-31",
    "Resolución sin identidad, organismo o fecha válida en 2025"
  )
}

/** Días civiles de convivencia posibles en 2025; las fechas no prueban convivencia. */
export function diasPosibles(
  inicio: string,
  fin: string,
  nacimiento: string
): number {
  exigir(
    fecha(inicio) && fecha(fin) && inicio <= fin && inicio >= nacimiento,
    "Intervalo anterior al nacimiento o inválido"
  )
  const desde = inicio < "2025-01-01" ? "2025-01-01" : inicio
  const hasta = fin > "2025-12-31" ? "2025-12-31" : fin
  if (desde > hasta) return 0
  const a = DateTime.makeUnsafe(`${desde}T00:00:00Z`),
    b = DateTime.makeUnsafe(`${hasta}T00:00:00Z`)
  return (DateTime.toEpochMillis(b) - DateTime.toEpochMillis(a)) / 86400000 + 1
}

export function magnitudAnual(s: string): Decimal {
  exigir(/^-?\d{1,18}(\.\d{1,80})?$/.test(s), "Magnitud anual inválida")
  return new D(s)
}
