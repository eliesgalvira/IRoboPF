import type { LibroOrigenRenovablesMurcia2024 } from "./murcia-renovables-historia"
import DecimalBase from "decimal.js"
import { DateTime, Option, Schema } from "effect"
import type { SolicitudF, PersonaF, ViviendaF, PagoF } from "./esquemas"
import { CITAS_F } from "./citas"
import { magnitudesInternasF, type MagnitudesInternasF } from "./magnitudes-internas"
import { racional, sumar, type Racional } from "../anual-territorial-racional"
export type Decimal = DecimalBase
export const D = DecimalBase.clone({
  precision: 80,
  rounding: DecimalBase.ROUND_HALF_UP,
})
export type DependenciaF = {
  readonly magnitud:
    | "cuota_integra_autonomica"
    | "cuota_tras_resto_deducciones"
    | "base_liquidable"
    | "intereses_contractuales_euribor_2022"
    | "criterio_normativo"
    | "historial_inversion_vivienda"
  readonly factor: string
  readonly topeEUR?: string
  readonly operacion: string
}
/** Datos de conexión, sin aplicar ni reservar una segunda cuota. */
export type AplicacionAnualRecargaF = {
  readonly ejercicioOrigen: 2025
  readonly objetoId: string
  readonly contribuyente: string
  readonly limiteBaseEUR: "4000"
  readonly limite: "por_infraestructura_y_contribuyente"
  readonly unaInfraestructuraPorPeriodo: true
  readonly orden: {
    readonly despuesDe: readonly ["deducciones_sin_arrastre", "murcia_vehiculos_electricos"]
    readonly antesDe: "murcia_instalaciones_recursos_energeticos_renovables"
  }
  readonly arrastre: { readonly periodosPosteriores: 3; readonly ultimoEjercicio: 2028 }
  readonly seguimiento: {
    readonly desde: string
    readonly hasta: string
    readonly fechaCorte: "2025-12-31"
    readonly estado: "obligacion_futura_pendiente"
    readonly referencia: string
    readonly excepcionLegal: "fallecimiento"
  }
}
export type ConstruccionF<T> = { -readonly [P in keyof T]: T[P] }
export type ResultadoF = {
  readonly origenRenovablesMurcia2024?: LibroOrigenRenovablesMurcia2024

  readonly consumoCompartidoDT18?: {
    readonly generado: Racional
    readonly aplicado: Racional
    readonly pendiente: Racional
  }
  readonly importeExactoRacional?: Racional
  readonly aplicacionAnualSaldoMurcia?: {
    readonly ejercicioOrigen: 2025
    readonly objetosIds: readonly string[]
    readonly contribuyente: string
    readonly primerEjercicio: 2026
    readonly ultimoEjercicio: 2027 | 2028
  }
  readonly aplicacionAnualSaldoMadrid?: {
    readonly ejercicioOrigen: 2025
    readonly objetosIds: readonly string[]
    readonly contribuyente: string
    readonly primerEjercicio: 2026
    readonly ultimoEjercicio: 2030
  }
  readonly aplicacionAnualRecarga?: AplicacionAnualRecargaF
  readonly codigo: string
  readonly estado: "calculo_parcial" | "no_soportado" | "excluida"
  readonly motivo: string
  readonly importe?: number
  readonly importeCentimos?: string
  readonly importeAntesPresentacionEUR?: string
  readonly aceptacionFiscal?: "pendiente"
  readonly siguienteHecho?: string
  readonly dependenciaAnual?: DependenciaF
  readonly baseCalculadaEUR?: string
  readonly rastro: readonly string[]
  readonly reservas: readonly string[]
  readonly citas: readonly string[]
}
export class CausaF extends Schema.TaggedErrorClass<CausaF>()("CausaF", {
  estado: Schema.Literals(["no_soportado", "excluida"]),
  campo: Schema.String,
  message: Schema.String,
}) {}
export function falta(campo: string, message: string): never {
  throw new CausaF({ estado: "no_soportado", campo, message })
}
export function excluir(campo: string, message: string): never {
  throw new CausaF({ estado: "excluida", campo, message })
}
export function requerido<T>(v: T | undefined, campo: string): T {
  if (v === undefined) falta(campo, "Falta el hecho concreto: " + campo)
  return v
}
export function texto(v: string | undefined, campo: string): string {
  const s = requerido(v, campo)
  if (s.trim() !== s || s.length === 0)
    falta(campo, "Referencia o identidad vacía")
  return s
}
export function opcion(
  v: string | undefined,
  opciones: readonly string[],
  campo: string
): string {
  const s = texto(v, campo)
  if (!opciones.includes(s))
    falta(campo, "Rama distinta de las admitidas: " + opciones.join(", "))
  return s
}
export function dinero(
  v: string | undefined,
  campo: string,
  firmado = false
): Decimal {
  const s = texto(v, campo)
  if (
    !(
      firmado ? /^-?(0|[1-9]\d*)(\.\d{1,2})?$/ : /^(0|[1-9]\d*)(\.\d{1,2})?$/
    ).test(s)
  )
    falta(campo, "Texto EUR exacto hasta dos decimales requerido")
  const d = new D(s)
  if (d.abs().gt("90071992547409.91"))
    falta(campo, "Magnitud fuera del transporte seguro en céntimos")
  return d
}
export function decimal(v: string | undefined, campo: string): Decimal {
  const s = texto(v, campo)
  if (!/^(0|[1-9]\d*)(\.\d{1,8})?$/.test(s))
    falta(campo, "Magnitud decimal no negativa requerida")
  return new D(s)
}
export function entero(
  v: number | undefined,
  campo: string,
  minimo = 0,
  maximo = 365
): number {
  const n = requerido(v, campo)
  if (!Number.isSafeInteger(n) || n < minimo || n > maximo)
    falta(campo, "Entero fuera de dominio")
  return n
}
export function fecha(v: string | undefined, campo: string): string {
  const s = texto(v, campo)
  const d = DateTime.make(s + "T00:00:00Z")
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(s) ||
    Option.isNone(d) ||
    DateTime.formatIsoDateUtc(d.value) !== s
  )
    falta(campo, "Fecha civil ISO inexistente")
  return s
}
export function aniversario(f: string, anos: number): string {
  // El día inexistente no se corrige por una regla civil inventada.
  return fecha(
    String(Number(f.slice(0, 4)) + anos).padStart(4, "0") + f.slice(4),
    "aniversario; rama 29 febrero requiere cómputo civil específico"
  )
}
export function edad(
  nacimiento: string | undefined,
  corte = "2025-12-31"
): number {
  const n = fecha(nacimiento, "nacimiento")
  if (n > corte || n < "1895-01-01")
    falta("nacimiento", "Edad fuera del dominio")
  return (
    Number(corte.slice(0, 4)) -
    Number(n.slice(0, 4)) -
    (corte.slice(5) < n.slice(5) ? 1 : 0)
  )
}
export function unicos(xs: readonly string[], campo: string): void {
  xs.forEach((x) => texto(x, campo))
  if (new Set(xs).size !== xs.length) falta(campo, "Identidades repetidas")
}
export function ids(
  xs: readonly string[] | undefined,
  campo: string
): readonly string[] {
  const r = requerido(xs, campo)
  unicos(r, campo)
  if (r.length === 0) falta(campo, "Colección exhaustiva vacía")
  return r
}
export function dias(desde: string, hasta: string): number {
  const a = DateTime.make(fecha(desde, "desde") + "T00:00:00Z")
  const b = DateTime.make(fecha(hasta, "hasta") + "T00:00:00Z")
  if (Option.isNone(a) || Option.isNone(b) || hasta < desde)
    falta("periodo", "Intervalo civil contradictorio")
  return (
    (DateTime.toEpochMillis(b.value) - DateTime.toEpochMillis(a.value)) /
      86400000 +
    1
  )
}
export function convivencia(p: PersonaF): number {
  const periodos = [...requerido(p.convivencia, "persona.convivencia")].sort(
    (a, b) => a.desde.localeCompare(b.desde)
  )
  let fin = ""
  let total = 0
  for (const x of periodos) {
    fecha(x.desde, "convivencia.desde")
    fecha(x.hasta, "convivencia.hasta")
    if (x.desde < "2025-01-01" || x.hasta > "2025-12-31" || x.desde <= fin)
      falta("persona.convivencia", "Periodos solapados o fuera de 2025")
    if (
      p.nacimiento !== undefined &&
      x.desde < fecha(p.nacimiento, "persona.nacimiento")
    )
      falta("persona.convivencia", "Convivencia anterior al nacimiento")
    total += dias(x.desde, x.hasta)
    fin = x.hasta
  }
  return total
}
export function reparto(
  s: SolicitudF,
  titulares: readonly string[] | undefined
): Decimal {
  const t = ids(titulares, "titularesDeduccion")
  if (!t.includes(s.contexto.contribuyente))
    excluir("titularesDeduccion", "Contribuyente sin titularidad")
  if (s.contexto.modalidad !== "individual")
    falta(
      "repartoConjunta",
      "Composición exhaustiva de derechos en conjunta pendiente para esta rama nueva"
    )
  return new D(1).div(t.length)
}
/** Las magnitudes derivadas no pasan por el parser de hechos de céntimos. */
export function magnitudF(
  s: SolicitudF,
  campo: Exclude<keyof MagnitudesInternasF, "contribuyente" | "basesEstatalesDonativos" | "basesPersonas">,
  consignada: string | undefined,
  id = s.contexto.contribuyente
): Decimal {
  const m = magnitudesInternasF(s)
  if (m === undefined) return dinero(consignada, campo, true)
  if (id !== m.contribuyente && (campo === "general" || campo === "ahorro")) {
    const base = m.basesPersonas?.get(id)
    if (base !== undefined) return new D(base[campo])
  }
  if (id !== m.contribuyente)
    falta("productor_base_imponible_anual:" + id,
      "No se deriva la base imponible de otra persona de sus rentas ni de la base del titular")
  const valor = m[campo]
  if (valor === undefined) falta("productor_anual:" + campo, "Magnitud anual no producida por esta entrada")
  return new D(valor)
}
export function exigirProductoresBasesF(s: SolicitudF, personas: readonly string[]): void {
  if (magnitudesInternasF(s) !== undefined)
    for (const id of personas) magnitudF(s, "general", undefined, id)
}
export function baseEstatalDonativoF(s: SolicitudF, p: PagoF): Decimal {
  const m = magnitudesInternasF(s)
  if (m === undefined) return dinero(p.computoBaseEstatalEUR, "computoBaseEstatalEUR")
  const valor = m.basesEstatalesDonativos?.get(texto(p.id, "pago.id"))
  if (valor === undefined) falta("productor_base_estatal_misma_operacion", "Base estatal de esta operación no producida;no se supone cero")
  return new D(valor)
}
export function base(s: SolicitudF): Decimal {
  const bs = requerido(s.hechos.bases, "bases")
  unicos(
    bs.map((b) => b.id),
    "bases.id"
  )
  const b = bs.find((x) => x.id === s.contexto.contribuyente)
  if (b === undefined)
    falta("bases.contribuyente", "Falta base general y ahorro del titular")
  return magnitudF(s, "general", b.generalEUR, b.id).plus(
    magnitudF(s, "ahorro", b.ahorroEUR, b.id)
  )
}
export function baseFamiliar(s: SolicitudF): Decimal {
  const miembros = ids(s.hechos.miembrosUnidad, "miembrosUnidad")
  if (!miembros.includes(s.contexto.contribuyente))
    falta("miembrosUnidad", "Falta titular en unidad familiar")
  if (magnitudesInternasF(s) !== undefined)
    for (const id of miembros) magnitudF(s, "general", undefined, id)
  const bs = requerido(s.hechos.bases, "bases")
  unicos(
    bs.map((b) => b.id),
    "bases.id"
  )
  if (bs.length !== miembros.length || bs.some((b) => !miembros.includes(b.id)))
    falta("bases", "Bases familiares exhaustivas sin duplicación")
  return bs.reduce(
    (sum, b) =>
      sum
        .plus(magnitudF(s, "general", b.generalEUR, b.id))
        .plus(magnitudF(s, "ahorro", b.ahorroEUR, b.id)),
    new D(0)
  )
}
export function renta(
  s: SolicitudF,
  limite: string | number,
  estricta = false
): void {
  const b = base(s)
  if (estricta ? b.gte(limite) : b.gt(limite))
    excluir("bases", "Límite personal de renta excedido")
}
export function rentaFamiliarMadrid(s: SolicitudF): void {
  if (
    baseFamiliar(s).gt(
      new D(30930).times(ids(s.hechos.miembrosUnidad, "miembrosUnidad").length)
    )
  )
    excluir("bases", "Art.18.2: renta familiar superior a 30.930 por miembro")
}
export function minimo(s: SolicitudF, p: PersonaF): void {
  const id = texto(p.id, "persona.id")
  if (id === s.contexto.contribuyente)
    falta("persona.id", "El titular no es su propio ascendiente o descendiente")
  const relacion = opcion(
    p.relacion,
    ["hijo", "descendiente", "ascendiente", "tutela", "acogimiento"],
    "persona.relacion"
  )
  if ((p.progenitores ?? []).includes(id))
    falta("persona.id", "Hijo incluido entre sus propios progenitores")
  texto(p.certificadoParentesco, "persona.certificadoParentesco")
  opcion(p.situacionDevengo, ["vivo"], "persona.situacionDevengo")
  opcion(p.alimentos64175, ["no"], "persona.alimentos64175")
  if (dinero(p.rentasNoExentasEUR, "persona.rentasNoExentas", true).gt(8000))
    excluir("persona.rentasNoExentas", "Rentas no exentas superiores a 8.000")
  const declaracion = opcion(
    p.declaracionTipo,
    ["no_presentada", "individual"],
    "persona.declaracionTipo"
  )
  if (
    declaracion === "individual" &&
    dinero(p.rentasDeclaracionEUR, "persona.rentasDeclaracion", true).gt(1800)
  )
    excluir("persona.declaracion", "Declaración con rentas superiores a 1.800")
  const grado = decimal(
    p.discapacidadPorcentaje,
    "persona.discapacidadPorcentaje"
  )
  if (grado.gt(100))
    falta("persona.discapacidadPorcentaje", "Grado superior a 100")
  if (grado.gt(0))
    texto(p.certificadoDiscapacidad, "persona.certificadoDiscapacidad")
  const e = edad(p.nacimiento)
  if (
    relacion === "ascendiente"
      ? e <= 65 && grado.lt(33)
      : e >= 25 && grado.lt(33)
  )
    excluir("persona.edad", "Edad/discapacidad no genera mínimo ordinario")
  const n = convivencia(p)
  if (relacion === "ascendiente" ? n < 183 : n === 0)
    excluir(
      "persona.convivencia",
      "Convivencia insuficiente para mínimo ordinario"
    )
  if (
    relacion !== "ascendiente" &&
    !requerido(p.convivencia, "persona.convivencia").some(
      (x) => x.hasta === "2025-12-31"
    )
  )
    falta(
      "persona.convivencia",
      "Rama de descendiente sin convivencia al devengo requiere dependencia asimilada"
    )
  const cercanos = requerido(
    p.gradoMasCercanoConPrioridad,
    "persona.gradoMasCercanoConPrioridad"
  )
  if (cercanos.length > 0)
    excluir("persona.prioridad", "Derecho de grado más cercano prioritario")
  if (
    !ids(p.titularesMinimo, "persona.titularesMinimo").includes(
      s.contexto.contribuyente
    )
  )
    excluir("persona.titularesMinimo", "Sin mínimo del titular")
}
export function pagos(
  s: SolicitudF,
  conceptos: readonly string[],
  objetoId?: string,
  pagadoresAdmitidos: readonly string[] = [s.contexto.contribuyente]
): readonly PagoF[] {
  const ps = requerido(s.hechos.pagos, "pagos")
  unicos(
    ps.map((p) => texto(p.id, "pago.id")),
    "pagos.id"
  )
  const seleccion = ps.filter(
    (p) => objetoId === undefined || p.objetoId === objetoId
  )
  for (const p of seleccion) {
    const f = fecha(p.fecha, "pago.fecha")
    if (f < "2025-01-01" || f > "2025-12-31")
      falta("pago.fecha", "Pago fuera de 2025")
    if (!pagadoresAdmitidos.includes(texto(p.pagador, "pago.pagador")))
      falta(
        "pago.pagador",
        "Pagador no pertenece a los titulares del gasto declarado"
      )
    opcion(p.concepto, conceptos, "pago.concepto")
    dinero(p.importeEUR, "pago.importeEUR")
    texto(p.soportePago, "pago.soportePago")
  }
  return seleccion
}
export function sumaPagos(ps: readonly PagoF[], neto = false): Decimal {
  return ps.reduce(
    (a, p) =>
      a.plus(
        D.max(
          0,
          dinero(p.importeEUR, "pago.importeEUR").minus(
            neto ? dinero(p.ayudasEUR, "pago.ayudasEUR") : 0
          )
        )
      ),
    new D(0)
  )
}
export function bancario(ps: readonly PagoF[]): void {
  for (const p of ps)
    opcion(
      p.medio,
      ["transferencia", "tarjeta", "cheque_nominativo", "ingreso_cuenta"],
      "pago.medio"
    )
}
export function habitual(v: ViviendaF): void {
  const adquisicion = fecha(v.adquisicion, "vivienda.adquisicion")
  const ocupacion = fecha(v.ocupacionDesde, "vivienda.ocupacionDesde")
  if (ocupacion > "2025-12-31")
    falta(
      "vivienda.ocupacionDesde",
      "Ocupación futura no es hecho consumado; identificar compromiso de ocupación en subrama específica"
    )
  if (ocupacion > aniversario(adquisicion, 1))
    excluir("vivienda.ocupacionDesde", "Ocupación después de doce meses")
  if (fecha(v.permanenciaHasta, "vivienda.permanenciaHasta") < "2025-12-31")
    falta(
      "vivienda.permanenciaHasta",
      "Falta permanencia al devengo o excepción concreta de cambio"
    )
}
export function incompatible(
  s: SolicitudF,
  codigos: readonly string[],
  objetoId?: string
): void {
  const elecciones = requerido(s.hechos.elecciones, "elecciones")
  if (
    elecciones.some(
      (e) =>
        codigos.includes(e.codigo) &&
        (objetoId === undefined || e.objetoId === objetoId)
    )
  )
    falta(
      "eleccionIncompatible",
      "Elegir explícitamente entre deducciones incompatibles"
    )
}
export function salida(
  s: SolicitudF,
  valor: Decimal,
  rastro: readonly string[] = [],
  reservas: readonly string[] = []
): ResultadoF {
  const d = valor.toDecimalPlaces(2, D.ROUND_HALF_UP)
  return {
    codigo: s.codigo,
    estado: "calculo_parcial",
    importe: d.toNumber(),
    importeCentimos: d.times(100).toFixed(0),
    importeAntesPresentacionEUR: valor.toFixed(),
    aceptacionFiscal: "pendiente",
    motivo: "Hechos declarados evaluados en la rama indicada; antes de cuota",
    rastro,
    reservas: [
      "Autenticidad y exhaustividad documental declaradas; no certificadas por este cálculo",
      ...reservas,
    ],
    citas: CITAS_F.find((x) => x.codigo === s.codigo)?.citas ?? [],
  }
}
/** Aritmética de reparto; conserva el divisor antes de cualquier presentación. */
export function sumarRepartoExactoF(
  s: SolicitudF,
  acumulado: Racional,
  valor: Decimal,
  titulares: readonly string[] | undefined
): Racional {
  reparto(s, titulares)
  return sumar(acumulado, racional(valor.toFixed(), String(ids(titulares, "titularesDeduccion").length)))
}
export function salidaExactaF(
  s: SolicitudF,
  exacto: Racional,
  rastro: readonly string[] = [],
  reservas: readonly string[] = []
): ResultadoF {
  return { ...salida(s, new D(exacto.numeradorEuros).div(exacto.divisor), rastro, reservas), importeExactoRacional: exacto }
}
export function dependencia(
  s: SolicitudF,
  d: DependenciaF,
  detalle: string,
  baseCalculada?: Decimal
): ResultadoF {
  return {
    codigo: s.codigo,
    estado: "no_soportado",
    motivo: detalle,
    siguienteHecho: d.magnitud,
    dependenciaAnual: d,
    ...(baseCalculada === undefined
      ? { rastro: [] }
      : {
          rastro: ["Base calculada, no cuota deducida"],
          baseCalculadaEUR: baseCalculada.toFixed(),
        }),
    reservas: [],
    citas: CITAS_F.find((x) => x.codigo === s.codigo)?.citas ?? [],
  }
}
