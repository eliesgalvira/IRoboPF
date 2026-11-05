import Decimal from "decimal.js"
import { Schema } from "effect"

export const D = Decimal.clone({
  precision: 80,
  rounding: Decimal.ROUND_HALF_UP,
})
const DA = Decimal.clone({ precision: 200, rounding: Decimal.ROUND_HALF_UP })
export const Texto = Schema.String.check(Schema.isMinLength(1))
export const Entero = Schema.Number.check(
  Schema.isInt(),
  Schema.isGreaterThanOrEqualTo(0),
  Schema.isLessThanOrEqualTo(Number.MAX_SAFE_INTEGER)
)
export const Centimos = Entero
export const BaseCentimos = Schema.Number.check(
  Schema.isInt(),
  Schema.isGreaterThanOrEqualTo(-Number.MAX_SAFE_INTEGER),
  Schema.isLessThanOrEqualTo(Number.MAX_SAFE_INTEGER)
)
export const Grado = Schema.Number.check(
  Schema.isInt(),
  Schema.isGreaterThanOrEqualTo(0),
  Schema.isLessThanOrEqualTo(100)
)
export const EurosAnuales = Schema.Struct({
  euros: Schema.String.check(Schema.isPattern(/^-?\d{1,18}(\.\d{1,80})?$/)),
})
export const MagnitudBaseAnual = Schema.Union([BaseCentimos, EurosAnuales])
export const MagnitudAnual = Schema.Union([
  Centimos,
  Schema.Struct({
    euros: Schema.String.check(Schema.isPattern(/^\d{1,18}(\.\d{1,80})?$/)),
  }),
])
export const Contexto = {
  ejercicio: Schema.Literal(2025),
  modalidad: Schema.Literal("individual"),
  devengo: Schema.Literal("2025-12-31"),
  contribuyente: Texto,
  nacimiento: Texto,
  imponibleGeneralCentimos: MagnitudBaseAnual,
  imponibleAhorroCentimos: MagnitudBaseAnual,
  liquidableGeneralCentimos: MagnitudAnual,
  liquidableAhorroCentimos: MagnitudAnual,
  minimoContribuyenteCentimos: MagnitudAnual,
  minimoDescendientesCentimos: MagnitudAnual,
  minimoPersonalFamiliarCentimos: MagnitudAnual,
  elecciones: Schema.Array(Schema.Struct({ codigo: Texto, objeto: Texto })),
}
export const Ambito = Schema.Struct(Contexto)
export type Ambito = typeof Ambito.Type
export const Pago = Schema.Struct({
  id: Texto,
  fecha: Texto,
  pagador: Texto,
  importeCentimos: Centimos,
  medio: Schema.Literals([
    "tarjeta",
    "transferencia",
    "cheque-nominativo",
    "ingreso-cuenta",
    "efectivo",
  ]),
  justificante: Texto,
  regimen: Schema.Literals(["personal", "ganancial-consorcio"]),
  conyuges: Schema.Array(Texto),
})
export type Pago = typeof Pago.Type
/** Derecho individualizado recibido del productor de mínimos o expediente, nunca un cumple de deducción. */
export const Minimo = Schema.Struct({
  persona: Texto,
  nacimiento: Texto,
  clase: Schema.Literals(["descendiente", "ascendiente"]),
  titulares: Schema.Array(Texto),
  referenciaDerechos: Texto,
  diasConvivencia: Entero,
  discapacidad: Grado,
  asistencia: Schema.Literals([
    "sin-incremento",
    "ayuda-terceros",
    "movilidad-reducida",
    "grado65",
  ]),
})
export type Minimo = typeof Minimo.Type
export const FamiliaNumerosa = Schema.Struct({
  categoria: Schema.Literals(["ninguna", "general", "especial"]),
  desde: Texto,
  hasta: Texto,
  referencia: Schema.String,
  titulares: Schema.Array(Texto),
})
export type FamiliaNumerosa = typeof FamiliaNumerosa.Type
export type ResultadoAmpliacion =
  | { estado: "no_soportado"; motivo: string }
  | {
      estado: "calculo_parcial"
      importeExactoEuros: string
      importePresentadoCentimos: number
      aceptacionFiscal: "pendiente"
      codigo: string
      contribuyente: string
      citas: readonly string[]
      reservas: readonly string[]
    }
export function exigir(condicion: boolean, motivo: string): asserts condicion {
  if (!condicion) throw new RangeError(motivo)
}
export function ref(s: string): string {
  exigir(s.trim().length > 0, "Falta referencia específica")
  return s
}
export function fecha(s: string): string {
  exigir(/^\d{4}-\d{2}-\d{2}$/.test(s), "Fecha civil inválida")
  const [y, m, d] = s.split("-").map(Number)
  const meses = [
    31,
    y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ]
  exigir(
    y >= 1 && m >= 1 && m <= 12 && d >= 1 && d <= meses[m - 1],
    "Fecha civil inválida"
  )
  return s
}
export function edad(n: string, en = "2025-12-31"): number {
  const f = fecha(n)
  fecha(en)
  exigir(f <= en, "Nacimiento posterior al hecho")
  return (
    Number(en.slice(0, 4)) -
    Number(f.slice(0, 4)) -
    (en.slice(5) < f.slice(5) ? 1 : 0)
  )
}
export function unicos(ids: readonly string[]): void {
  ids.forEach(ref)
  exigir(new Set(ids).size === ids.length, "Identidad duplicada")
}
export function titulares(ids: readonly string[], titular: string): Decimal {
  unicos(ids)
  exigir(
    ids.includes(titular),
    "Contribuyente fuera del censo exhaustivo de titulares con derecho"
  )
  return new D(1).div(ids.length)
}
export function eur(c: number | typeof EurosAnuales.Type): Decimal {
  return Schema.is(Schema.Number)(c) ? new D(c).div(100) : new DA(c.euros)
}
export function renta(h: Ambito): Decimal {
  return eur(h.imponibleGeneralCentimos).plus(eur(h.imponibleAhorroCentimos))
}
export function rentaMinorada(h: Ambito): Decimal {
  return renta(h)
    .minus(eur(h.minimoContribuyenteCentimos))
    .minus(eur(h.minimoDescendientesCentimos))
}
export function rentaPersonal(h: Ambito): Decimal {
  return renta(h).minus(eur(h.minimoPersonalFamiliarCentimos))
}
export function limiteRenta(h: Ambito, max: number): void {
  exigir(renta(h).lte(max), "Base imponible supera límite individual " + max)
}
export function minimo(
  m: Minimo,
  h: Ambito,
  clase?: "ascendiente" | "descendiente"
): Decimal {
  ref(m.referenciaDerechos)
  exigir(
    fecha(m.nacimiento) <= h.devengo,
    "Nacimiento del beneficiario posterior al devengo"
  )
  exigir(
    m.persona !== h.contribuyente,
    "Persona beneficiaria coincide con titular"
  )
  exigir(clase === undefined || m.clase === clase, "Clase de mínimo incorrecta")
  exigir(m.diasConvivencia <= 365, "Días de convivencia fuera de período")
  return titulares(m.titulares, h.contribuyente)
}
export function numerosa(f: FamiliaNumerosa, h: Ambito): boolean {
  fecha(f.desde)
  fecha(f.hasta)
  exigir(f.desde <= f.hasta, "Título familiar con fechas invertidas")
  if (f.categoria === "ninguna") return false
  ref(f.referencia)
  exigir(
    f.desde <= h.devengo && f.hasta >= h.devengo,
    "Título familia numerosa no vigente a devengo"
  )
  titulares(f.titulares, h.contribuyente)
  return true
}
/** Reparto sólo para gastos con regla expresa de gananciales/consorcio. */
export function pagado(
  p: Pago,
  h: Ambito,
  bancario = false,
  consorcio = false
): Decimal {
  ref(p.id)
  ref(p.justificante)
  exigir(fecha(p.fecha).startsWith("2025-"), "Pago fuera de2025")
  exigir(
    !bancario || p.medio !== "efectivo",
    "DA segunda Aragón: efectivo no habilita deducción de gastos"
  )
  if (p.regimen === "ganancial-consorcio") {
    exigir(
      consorcio,
      "Este gasto requiere atribución individual efectiva, sin prorrata patrimonial genérica"
    )
    exigir(
      p.conyuges.length === 2 && p.conyuges.includes(p.pagador),
      "Censo consorcial incompleto"
    )
    titulares(p.conyuges, h.contribuyente)
    return eur(p.importeCentimos).div(2)
  }
  exigir(
    p.conyuges.length === 0 && p.pagador === h.contribuyente,
    "Pago personal ajeno o censo contradictorio"
  )
  return eur(p.importeCentimos)
}
export function pagos(
  ps: readonly Pago[],
  h: Ambito,
  bancario = false,
  consorcio = false
): Decimal {
  unicos(ps.map((p) => p.id))
  return ps.reduce(
    (a, p) => a.plus(pagado(p, h, bancario, consorcio)),
    new D(0)
  )
}
export function incompatible(
  h: Ambito,
  objeto: string,
  codigos: readonly string[]
): void {
  exigir(
    !h.elecciones.some(
      (e) => e.objeto === objeto && codigos.includes(e.codigo)
    ),
    "Resolver elección incompatible para " + objeto
  )
}
export function salida(
  h: Ambito,
  codigo: string,
  n: Decimal,
  citas: readonly string[],
  reservas: readonly string[] = []
): ResultadoAmpliacion {
  exigir(n.gte(0) && n.isFinite(), "Importe generado inválido")
  const cent = n.times(100).toDecimalPlaces(0, D.ROUND_HALF_UP)
  exigir(
    cent.lte(Number.MAX_SAFE_INTEGER),
    "Céntimos de presentación fuera del rango seguro"
  )
  return {
    estado: "calculo_parcial",
    codigo,
    contribuyente: h.contribuyente,
    importeExactoEuros: n.toFixed(),
    importePresentadoCentimos: cent.toNumber(),
    aceptacionFiscal: "pendiente",
    citas,
    reservas: [
      "Individual ordinario2025. Cuantía generada antes de composición/cuota; céntimos sólo presentación HALF_UP.",
      "Referencias y derechos específicos aportados externamente; el motor no autentica documentos ni reevalúa los mínimos estatales.",
      ...reservas,
    ],
  }
}

export const Fiscalidad = Schema.Struct({
  rango: Schema.Literals(["ordinario", "VIII", "IX", "X"]),
  isdtMilesimas: Entero,
  referenciaClasificacion: Schema.String,
  residenciaDesde: Texto,
  padron2025: Texto,
  mantenimiento: Schema.Literals(["pendiente-cuatro-anios", "incumplido"]),
  referenciaSeguimiento: Texto,
})
export type Fiscalidad = typeof Fiscalidad.Type
export function diferenciada(f: Fiscalidad): boolean {
  fecha(f.residenciaDesde)
  ref(f.padron2025)
  ref(f.referenciaSeguimiento)
  if (f.rango === "ordinario") return false
  ref(f.referenciaClasificacion)
  if (f.isdtMilesimas >= 100000 || f.residenciaDesde > "2025-01-01")
    return false
  exigir(
    f.mantenimiento !== "incumplido",
    "Fiscalidad diferenciada con mantenimiento incumplido; regularización concreta pendiente"
  )
  return true
}
