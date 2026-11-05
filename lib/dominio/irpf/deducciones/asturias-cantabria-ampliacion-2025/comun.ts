import type Decimal from "decimal.js"
import {
  D,
  exigir,
  fecha,
  documento,
  edad,
  ids,
  identidad,
  marco,
  protegido,
  diasPosibles,
  type MarcoB,
  type PagoB,
  type ResolucionB,
  type Exacto,
} from "../asturias-cantabria-hechos-2025/comun"
import { MUNICIPIOS_CANTABRIA_2025 } from "../asturias-cantabria-hechos-2025/territorio"
export type { MarcoB, PagoB, ResolucionB, Exacto }
export {
  exigir,
  fecha,
  documento,
  edad,
  ids,
  identidad,
  marco,
  protegido,
  diasPosibles,
}
const DecimalLocal = D.clone({ precision: 600 })
/** Fracciones enteras normalizadas. Cada operación acota operandos antes de multiplicar,
 * para no aceptar un redondeo silencioso al exceder la precisión local. */
export class Racional {
  readonly n: Decimal
  readonly d: Decimal
  constructor(n: string, d = "1") {
    exigir(
      /^-?\d{1,500}$/.test(n) && /^\d{1,500}$/.test(d),
      "Operandos racionales fuera de presupuesto exacto"
    )
    const a = new DecimalLocal(n),
      b = new DecimalLocal(d)
    exigir(
      a.isFinite() && b.isFinite() && a.isInteger() && b.isInteger() && b.gt(0),
      "Racional inválido"
    )
    let x = a.abs(),
      y = b
    while (!y.isZero()) {
      const resto = x.mod(y)
      x = y
      y = resto
    }
    this.n = a.div(x)
    this.d = b.div(x)
    exigir(
      this.n.abs().toFixed().length <= 240 && this.d.toFixed().length <= 240,
      "Racional excede presupuesto de precisión; no redondear"
    )
  }
  plus(b: Racional): Racional {
    return new Racional(
      this.n.times(b.d).plus(b.n.times(this.d)).toFixed(),
      this.d.times(b.d).toFixed()
    )
  }
  minus(b: Racional): Racional {
    return this.plus(new Racional(b.n.negated().toFixed(), b.d.toFixed()))
  }
  times(b: Racional): Racional {
    return new Racional(
      this.n.times(b.n).toFixed(),
      this.d.times(b.d).toFixed()
    )
  }
  div(b: Racional): Racional {
    exigir(b.n.gt(0), "Divisor no positivo")
    return new Racional(
      this.n.times(b.d).toFixed(),
      this.d.times(b.n).toFixed()
    )
  }
  cmp(b: Racional): number {
    return this.n.times(b.d).comparedTo(b.n.times(this.d))
  }
  min(b: Racional): Racional {
    return this.cmp(b) <= 0 ? this : b
  }
  max(b: Racional): Racional {
    return this.cmp(b) >= 0 ? this : b
  }
  exacto(): Exacto {
    return { numeradorEuros: this.n.toFixed(), divisor: this.d.toFixed() }
  }
}
export function r(s: string): Racional {
  exigir(
    /^\d{1,18}(\.\d{1,2})?$/.test(s),
    "Se exige cadena decimal no negativa, máximo dos decimales y18 dígitos enteros"
  )
  const [i, f = ""] = s.split(".")
  return new Racional(i + f.padEnd(2, "0"), "100")
}
/** Magnitud interna del motor: hasta80 decimales, independiente del dinero pagado.
 * Los operandos normalizados admiten240 dígitos; productos480 y suma481 <600.
 * No hay redondeo para encajar el presupuesto. */
export function magnitudAnualR(s: string, admiteNegativo = false): Racional {
  exigir(/^-?\d{1,18}(\.\d{1,80})?$/.test(s), "Magnitud anual fuera del contrato18+80")
  const [i, f = ""] = s.split(".")
  const x = new Racional(i + f, "1" + "0".repeat(f.length))
  exigir(admiteNegativo || x.cmp(r("0")) >= 0, "Magnitud anual negativa")
  return x
}
export function cuenta(n: number): Racional {
  exigir(Number.isSafeInteger(n) && n >= 0 && n <= 10000, "Contador inválido")
  return r(String(n))
}
export function total(xs: readonly Racional[]): Racional {
  return xs.reduce((a, b) => a.plus(b), r("0"))
}
export function lista(xs: readonly { readonly id: string }[]): void {
  exigir(
    xs.length <= 1000 && (xs.length === 0 || ids(xs.map((x) => x.id))),
    "Colección duplicada, vacía de identidad o excesiva"
  )
}
export type Reparto = {
  readonly titulares: readonly string[]
  readonly exhaustividad: "completa" | "incompleta"
}
export function reparto(m: MarcoB, x: Reparto): Racional {
  exigir(
    x.exhaustividad === "completa" &&
      ids(x.titulares) &&
      x.titulares.length <= 10 &&
      x.titulares.some((id) => m.declarantes.includes(id)),
    "Titularidad no exhaustiva o ajena"
  )
  return cuenta(
    x.titulares.filter((id) => m.declarantes.includes(id)).length
  ).div(cuenta(x.titulares.length))
}
export type Uso = {
  readonly contribuyente: string
  readonly codigo: string
  readonly objeto: string
}
export function incompatibles(
  m: MarcoB,
  usos: readonly Uso[],
  codigos: readonly string[],
  objeto?: string
): void {
  exigir(
    !usos.some(
      (u) =>
        m.declarantes.includes(u.contribuyente) &&
        codigos.includes(u.codigo) &&
        (objeto === undefined || u.objeto === objeto)
    ),
    "Resolver elección incompatible: no se suman ni se optimizan opciones"
  )
}
export function base(m: MarcoB): Racional {
  return magnitudAnualR(m.baseGeneral, true).plus(magnitudAnualR(m.baseAhorro, true))
}
export function limiteBase(
  m: MarcoB,
  individual: string,
  conjunta: string
): boolean {
  return (
    base(m).cmp(r(m.modalidad === "individual" ? individual : conjunta)) <= 0
  )
}
export function pagos(
  xs: readonly PagoB[],
  pagadores: readonly string[],
  banco = false,
  ejercicio = 2025
): Racional {
  lista(xs)
  return total(
    xs.map((p) => {
      exigir(
        ids(pagadores) &&
          pagadores.includes(p.pagador) &&
          identidad(p.receptor) &&
          identidad(p.documento) &&
          fecha(p.fecha),
        "Pago no identificado, sin justificante o pagador ajeno"
      )
      exigir(
        [
          "tarjeta",
          "transferencia",
          "cheque_nominativo",
          "ingreso",
          "efectivo",
        ].includes(p.medio),
        "Medio de pago inválido"
      )
      const euros = r(p.euros)
      return p.fecha.slice(0, 4) !== String(ejercicio) ||
        (banco && p.medio === "efectivo")
        ? r("0")
        : euros
    })
  )
}
export type Intervalo = { readonly inicio: string; readonly fin: string }
export function intervalo(x: Intervalo): void {
  exigir(
    fecha(x.inicio) && fecha(x.fin) && x.inicio <= x.fin,
    "Intervalo inválido"
  )
}
export function contiene(x: Intervalo, f: string): boolean {
  intervalo(x)
  return x.inicio <= f && x.fin >= f
}
export function mesesDesde(f: string, n: number): string {
  exigir(fecha(f) && Number.isSafeInteger(n), "Fecha o meses inválidos")
  const y = Number(f.slice(0, 4)),
    m = Number(f.slice(5, 7)) - 1 + n
  const year = y + Math.floor(m / 12),
    month = (((m % 12) + 12) % 12) + 1
  const prefix = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-`
  let day = Number(f.slice(8, 10))
  while (!fecha(prefix + String(day).padStart(2, "0"))) day--
  return prefix + String(day).padStart(2, "0")
}
export function asturiasRural(ine: string): boolean {
  exigir(/^330(0[1-9]|[1-6][0-9]|7[0-8])$/.test(ine), "Concejo INE inválido")
  return CONCEJOS_RURALES_2025.has(ine)
}
export function cantabriaRural(ine: string): boolean {
  exigir(/^39\d{3}$/.test(ine), "Municipio INE cántabro inválido")
  return MUNICIPIOS_CANTABRIA_2025.has(ine)
}
import { CONCEJOS_RURALES_2025 } from "./territorio"
export type Vivienda = {
  readonly id: string
  readonly municipio: string
  readonly titulo: "propiedad" | "usufructo" | "alquiler"
  readonly fechaTitulo: string
  readonly ocupacion: Intervalo
  readonly destino: "habitual" | "temporal" | "actividad"
  readonly contrato: ResolucionB
}
export function vivienda(v: Vivienda): boolean {
  exigir(
    identidad(v.id) && fecha(v.fechaTitulo),
    "Vivienda sin identidad o título fechado"
  )
  documento(v.contrato)
  intervalo(v.ocupacion)
  exigir(v.ocupacion.inicio >= v.fechaTitulo, "Ocupación anterior al título")
  return v.destino === "habitual" && contiene(v.ocupacion, "2025-12-31")
}
export type DependenciaAnual =
  | {
      readonly clase: "ela_tipos_medios"
      readonly contribuyente: string
      readonly ayudaEnBaseLiquidable: Exacto
      readonly referencias: readonly [
        "tipo_medio_estatal_2025",
        "tipo_medio_autonomico_2025",
      ]
      readonly operacion: "importe_por_suma_tipos_dividida_100"
    }
  | {
      readonly clase: "residencia_rural_cuota"
      readonly personas: readonly string[]
      readonly porcentaje: "20"
      readonly maximoPorPersona: "500"
      readonly referencia: "cuota_integra_autonomica_2025_por_contribuyente"
    }
  | {
      readonly clase: "traslado_rural_trabajo"
      readonly personas: readonly string[]
      readonly maximoPorPersona: "500"
      readonly referencia: "cuota_integra_autonomica_2025_trabajo_actividad_por_contribuyente"
    }
export type RegimenPosterior = {
  readonly ejercicioOrigen: 2025
  readonly prioridadCuota: "ordinaria" | "primera"
  readonly arrastreInsuficiencia: 0 | 4 | 5
  readonly arrastreExcesoLimite: 0 | 2
  readonly excesoLimiteGenerado: Exacto
  readonly pagosOrigen: readonly string[]
}
export type ResultadoAmpliacion =
  | {
      readonly estado: "no_soportado" | "excluida"
      readonly motivo: string
      readonly rastro: readonly string[]
    }
  | {
      readonly estado: "calculo_parcial"
      readonly importeExacto: Exacto
      readonly coberturaHechos: "rama_completa" | "rama_acotada"
      readonly pendientes: readonly string[]
      readonly regimenPosterior?: RegimenPosterior
      readonly rastro: readonly string[]
      readonly aceptacionFiscal: "pendiente"
      readonly aplicacionCuota: "pendiente_padre"
    }
  | {
      readonly estado: "dependencia_anual"
      readonly formula: DependenciaAnual
      readonly pendientes: readonly string[]
      readonly rastro: readonly string[]
      readonly aceptacionFiscal: "pendiente"
    }
export function resultado(
  valor: Racional,
  articulo: string,
  pendientes: readonly string[] = []
): ResultadoAmpliacion {
  return {
    estado: "calculo_parcial",
    importeExacto: valor.exacto(),
    coberturaHechos: pendientes.length === 0 ? "rama_completa" : "rama_acotada",
    pendientes,
    rastro: [
      articulo,
      "Hechos identificados del expediente, sin certificar autenticidad ni aceptación fiscal",
    ],
    aceptacionFiscal: "pendiente",
    aplicacionCuota: "pendiente_padre",
  }
}
export function excluida(motivo: string): ResultadoAmpliacion {
  return { estado: "excluida", motivo, rastro: [motivo] }
}
export function dependencia(
  formula: DependenciaAnual,
  articulo: string,
  pendientes: readonly string[]
): ResultadoAmpliacion {
  return {
    estado: "dependencia_anual",
    formula,
    rastro: [articulo],
    pendientes,
    aceptacionFiscal: "pendiente",
  }
}
export type Persona = {
  readonly id: string
  readonly nacimiento: string
  readonly discapacidad: {
    readonly grado: number
    readonly resolucion: ResolucionB
  } | null
  readonly rentaNoExenta: string
  readonly rentaBrutaIncluidasExentas: string
  readonly declaracionRentas: string | null
  readonly convivencia: Intervalo
  readonly centroEspecializado: ResolucionB | null
  readonly dependenciaEconomica: readonly PagoB[]
}
export function persona(p: Persona, titulares: readonly string[]): void {
  exigir(
    identidad(p.id) && !titulares.includes(p.id),
    "Beneficiario con identidad de progenitor o titular"
  )
  edad(p.nacimiento)
  intervalo(p.convivencia)
  exigir(
    p.convivencia.inicio >= p.nacimiento,
    "Convivencia anterior al nacimiento"
  )
  exigir(
    r(p.rentaBrutaIncluidasExentas).cmp(r(p.rentaNoExenta)) >= 0,
    "Renta incluida exenta inferior a renta no exenta"
  )
  if (p.declaracionRentas !== null) r(p.declaracionRentas)
  if (p.discapacidad !== null) {
    exigir(
      Number.isInteger(p.discapacidad.grado) &&
        p.discapacidad.grado >= 0 &&
        p.discapacidad.grado <= 100,
      "Grado inválido"
    )
    documento(p.discapacidad.resolucion)
    exigir(
      p.discapacidad.resolucion.fecha >= p.nacimiento,
      "Resolución anterior al nacimiento"
    )
  }
}
export function grado(p: Persona): number {
  return p.discapacidad?.grado ?? 0
}
export function dias(p: Persona): number {
  return diasPosibles(p.convivencia.inicio, p.convivencia.fin, p.nacimiento)
}
export function minimoDesc(
  p: Persona,
  titulares: readonly string[],
  ampliarHasta26 = false
): boolean {
  persona(p, titulares)
  const e = edad(p.nacimiento)
  const conviviente = contiene(p.convivencia, "2025-12-31")
  const dependiente =
    p.centroEspecializado !== null &&
    pagos(p.dependenciaEconomica, titulares).cmp(r("0")) > 0
  if (p.centroEspecializado !== null) documento(p.centroEspecializado)
  return (
    (e < (ampliarHasta26 ? 26 : 25) || grado(p) >= 33) &&
    (conviviente || dependiente) &&
    r(p.rentaNoExenta).cmp(r("8000")) <= 0 &&
    (p.declaracionRentas === null || r(p.declaracionRentas).cmp(r("1800")) <= 0)
  )
}
export function minimoAsc(p: Persona, titulares: readonly string[]): boolean {
  persona(p, titulares)
  return (
    (edad(p.nacimiento) > 65 || grado(p) >= 33) &&
    dias(p) > 183 &&
    r(p.rentaNoExenta).cmp(r("8000")) <= 0 &&
    (p.declaracionRentas === null || r(p.declaracionRentas).cmp(r("1800")) <= 0)
  )
}

export function conRegimen(
  x: ResultadoAmpliacion,
  regimenPosterior: RegimenPosterior
): ResultadoAmpliacion {
  if (x.estado !== "calculo_parcial") return x
  return { ...x, regimenPosterior }
}
