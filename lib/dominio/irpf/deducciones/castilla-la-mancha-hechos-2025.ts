import Decimal from "decimal.js"
import { DateTime, Option, Result, Schema } from "effect"
import type { ResultadoDeduccion } from "@/lib/dominio/irpf/deducciones/contratos-2025"

// Configuración local: nunca altera Decimal global ni redondea antes de presentar.
const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
export type ResultadoHechos =
  | { readonly estado: "no_soportado"; readonly motivo: string }
  | {
      readonly estado: "calculo_parcial"
      readonly importeExacto: string
      readonly pendientes: readonly string[]
      readonly magnitudesAnualesPendientes: readonly [
        "cuota_integra_autonomica_disponible_2025",
      ]
      readonly aceptacionFiscal: "pendiente"
    }

function fallo(motivo: string): never {
  throw new RangeError(motivo)
}
function texto(v: string): string {
  if (v.trim() === "" || v !== v.trim()) return fallo("Identidad/texto vacío")
  return v
}
function opcion(v: string, opciones: string): string {
  const s = texto(v)
  if (!opciones.split(" ").includes(s)) return fallo("Rama desconocida: " + s)
  return s
}
function entero(v: number, max: number): number {
  if (!Number.isInteger(v) || v < 0 || v > max)
    return fallo("Entero fuera de rango")
  return v
}
function fecha(v: string): string {
  const s = texto(v)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return fallo("Fecha civil inválida")
  const d = DateTime.make(s + "T00:00:00Z")
  if (Option.isNone(d) || DateTime.formatIsoDateUtc(d.value) !== s)
    return fallo("Fecha civil inexistente")
  return s
}
function identidades(v: readonly string[], vacia = false): readonly string[] {
  const ids = v.map(texto)
  if ((!vacia && ids.length === 0) || new Set(ids).size !== ids.length)
    return fallo("Identidades vacías o duplicadas")
  return ids
}
function unicos(ids: readonly string[]): void {
  if (new Set(ids).size !== ids.length) fallo("Hecho o persona duplicada")
}
function edad(nacimiento: string): number {
  const f = fecha(nacimiento)
  if (f > "2025-12-31") return fallo("Nacimiento posterior al devengo")
  return 2025 - Number(f.slice(0, 4))
}
function contexto(v: Schema.Json): Contexto {
  const c = decodificar(Contexto, v)
  if (c.ejercicio !== 2025 || c.territorio !== TERRITORIO)
    fallo("Ámbito ajeno a 2025/territorio")
  const ids = identidades(c.declarantes)
  if (!ids.includes(texto(c.contribuyente)))
    fallo("Contribuyente ajeno a declarantes")
  if (
    opcion(c.modalidad, "individual conjunta") === "individual" &&
    ids.length !== 1
  )
    fallo("Individual con varios declarantes")
  magnitudAnual(c.baseGeneral, true)
  magnitudAnual(c.baseAhorro, true)
  magnitudAnual(c.minimoPersonalFamiliar)
  return c
}
function renta(
  c: Contexto,
  individual: number,
  conjunta: number,
  minimo = false
): boolean {
  return magnitudAnual(c.baseGeneral, true)
    .plus(magnitudAnual(c.baseAhorro, true))
    .minus(minimo ? magnitudAnual(c.minimoPersonalFamiliar) : 0)
    .lte(c.modalidad === "individual" ? individual : conjunta)
}
function proporcion(c: Contexto, titulares: readonly string[]): Decimal {
  const ids = identidades(titulares)
  // No elimina al titular ajeno a esta declaración ni al que excede renta.
  return new D(
    ids.filter((id) => identidades(c.declarantes).includes(id)).length
  ).div(ids.length)
}
function parcial(
  importe: Decimal,
  pendientes: readonly string[]
): ResultadoHechos {
  return {
    estado: "calculo_parcial",
    importeExacto: importe.toFixed(),
    pendientes,
    magnitudesAnualesPendientes: ["cuota_integra_autonomica_disponible_2025"],
    aceptacionFiscal: "pendiente",
  }
}
function ejecutar(f: () => ResultadoHechos): ResultadoHechos {
  try {
    return f()
  } catch (error) {
    if (error instanceof RangeError)
      return { estado: "no_soportado", motivo: error.message }
    throw error
  }
}
/** Única conversión a céntimos; no aplica cuota ni acepta derechos externos. */
export function presentar(resultado: ResultadoHechos): ResultadoDeduccion {
  if (resultado.estado === "no_soportado") return resultado
  return {
    estado: "calculo_parcial",
    importe: new D(resultado.importeExacto)
      .toDecimalPlaces(2, D.ROUND_HALF_UP)
      .toNumber(),
    motivo: resultado.pendientes.join("; "),
    aceptacionFiscal: "pendiente",
  }
}

const TERRITORIO = "castilla-la-mancha"

/** Ley 8/2013 arts. 4 y 13. Rama propia; descendientes conjuntos por art. 5. */
export function discapacidadPropia(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Discapacidad, datos)
    if (texto(f.persona) !== texto(c.contribuyente))
      fallo("Discapacidad de otra persona")
    edad(f.nacimiento)
    const grado = entero(f.grado, 100)
    const elecciones = identidades(f.elecciones, true)
    elecciones.forEach((e) =>
      opcion(
        e,
        "clm_discapacidad_ascendientes_descendientes clm_mayores_75 clm_arrendamiento_personas_discapacidad"
      )
    )
    if (
      elecciones.some((e) =>
        [
          "clm_discapacidad_ascendientes_descendientes",
          "clm_mayores_75",
          "clm_arrendamiento_personas_discapacidad",
        ].includes(e)
      )
    )
      fallo("Elección incompatible: resolver por persona antes de aplicar")
    return parcial(new D(grado >= 65 && renta(c, 27000, 36000) ? 300 : 0), [
      "Mínimo propio por discapacidad y acreditación material aún no evaluados",
      "Composición anual, descendientes de conjunta y cuota autonómica disponible",
    ])
  })
}
/** Art. 6: >75, no >=75. No prorratea la deducción propia. */
export function mayores75(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Mayor, datos)
    if (texto(f.persona) !== texto(c.contribuyente))
      fallo("Mayor de otra persona")
    const anos = edad(f.nacimiento),
      grado = entero(f.grado, 100)
    const dias = entero(f.diasCentro, 365),
      excepcion = entero(f.diasConvalecenciaSescam, 365)
    if (excepcion > dias) fallo("Convalecencia excede estancia")
    return parcial(
      new D(
        anos > 75 &&
          grado < 65 &&
          dias - excepcion <= 30 &&
          renta(c, 27000, 36000)
          ? 150
          : 0
      ),
      [
        "Mínimo personal y acreditación Sescam/centro público, concertado o subvencionado",
        "Composición anual y cuota autonómica disponible",
      ]
    )
  })
}
/** Arts. 1 y 13.4: importe por evento, no 500 por cada gemelo. */
export function nacimientoAdopcion(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Nacimientos, datos)
    opcion(f.exhaustividad, "todos_los_eventos")
    const eventos = f.eventos,
      ids: string[] = [],
      hijos: string[] = []
    let total = new D(0)
    for (const valor of eventos) {
      const e = valor
      ids.push(texto(e.id))
      opcion(e.tipo, "parto adopcion")
      const dia = fecha(e.fecha),
        menores = identidades(e.hijos)
      hijos.push(...menores)
      if (
        menores.includes(c.contribuyente) ||
        menores.some((id) => e.titularesMinimo.includes(id))
      )
        fallo("Persona es su propio hijo o titular del mínimo")
      const parte = proporcion(c, e.titularesMinimo)
      if (dia >= "2025-01-01" && dia <= "2025-12-31")
        total = total.plus(
          new D(
            menores.length === 1 ? 100 : menores.length === 2 ? 500 : 900
          ).times(parte)
        )
    }
    unicos(ids)
    unicos(hijos)
    return parcial(renta(c, 27000, 36000) ? total : new D(0), [
      "Generación y proporción del mínimo por cada hijo: titulares declarados no acreditan derecho",
      "Compatibilidad de eventos y cuota autonómica disponible",
    ])
  })
}
/** Arts. 6 y 13.4: rama de cuidado distinta de la deducción propia. */
export function cuidadoAscendientes75(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Cuidado, datos)
    opcion(f.exhaustividad, "todos_los_ascendientes")
    const ids: string[] = []
    let total = new D(0)
    for (const valor of f.ascendientes) {
      const a = valor
      ids.push(texto(a.id))
      if (a.titularesMinimo.includes(a.id))
        fallo("Ascendiente titular de su propio mínimo")
      if (a.id === c.contribuyente) fallo("Ascendiente es contribuyente")
      const anos = edad(a.nacimiento),
        grado = entero(a.grado, 100)
      const dias = entero(a.diasCentro, 365),
        excepcion = entero(a.diasConvalecenciaSescam, 365)
      if (excepcion > dias) fallo("Convalecencia excede estancia")
      const parte = proporcion(c, a.titularesMinimo)
      if (anos > 75 && grado < 65 && dias - excepcion <= 30)
        total = total.plus(parte.times(150))
    }
    unicos(ids)
    return parcial(renta(c, 27000, 36000) ? total : new D(0), [
      "Parentesco, convivencia, rentas/declaración del ascendiente y mínimo pendientes de evaluación",
      "Acreditación Sescam, incompatibilidad por persona y cuota autonómica disponible",
    ])
  })
}

const Contexto = Schema.Struct({
  ejercicio: Schema.Literal(2025),
  territorio: Schema.Literal(TERRITORIO),
  contribuyente: Schema.String,
  declarantes: Schema.Array(Schema.String),
  modalidad: Schema.Literals(["individual", "conjunta"]),
  baseGeneral: Schema.String,
  baseAhorro: Schema.String,
  minimoPersonalFamiliar: Schema.String,
})
type Contexto = typeof Contexto.Type
function decodificar<A>(esquema: Schema.Codec<A>, datos: Schema.Json): A {
  const resultado = Schema.decodeUnknownResult(esquema)(datos, {
    onExcessProperty: "error",
  })
  if (Result.isFailure(resultado))
    return fallo("Hechos incompletos, campos desconocidos o tipos inválidos")
  return resultado.success
}

export const Discapacidad = Schema.Struct({
  persona: Schema.String,
  nacimiento: Schema.String,
  grado: Schema.Number,
  elecciones: Schema.Array(Schema.String),
})
export const Mayor = Schema.Struct({
  persona: Schema.String,
  nacimiento: Schema.String,
  grado: Schema.Number,
  diasCentro: Schema.Number,
  diasConvalecenciaSescam: Schema.Number,
})
export const Nacimientos = Schema.Struct({
  exhaustividad: Schema.String,
  eventos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      fecha: Schema.String,
      tipo: Schema.String,
      hijos: Schema.Array(Schema.String),
      titularesMinimo: Schema.Array(Schema.String),
    })
  ),
})
export const Cuidado = Schema.Struct({
  exhaustividad: Schema.String,
  ascendientes: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      nacimiento: Schema.String,
      grado: Schema.Number,
      diasCentro: Schema.Number,
      diasConvalecenciaSescam: Schema.Number,
      titularesMinimo: Schema.Array(Schema.String),
    })
  ),
})

function magnitudAnual(s: string, firmado = false): Decimal {
  if (!/^-?(0|[1-9]\d{0,13})(\.\d{1,80})?$/.test(s))
    fallo("Magnitud anual decimal inválida")
  const d = new D(s)
  if (!firmado && d.isNegative()) fallo("Magnitud anual negativa")
  return d
}
