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
function decimal(v: string, firmado = false): Decimal {
  if (!/^-?(0|[1-9]\d{0,13})(\.\d{1,8})?$/.test(v))
    return fallo(
      "Magnitud decimal: cadena finita, hasta 14 enteros y 8 decimales"
    )
  const d = new D(v)
  if (!firmado && d.isNegative()) return fallo("Magnitud negativa")
  return d
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
  decimal(c.baseGeneral, true)
  decimal(c.baseAhorro, true)
  decimal(c.minimoPersonalFamiliar)
  return c
}
function renta(
  c: Contexto,
  individual: number,
  conjunta: number,
  minimo = false
): boolean {
  return decimal(c.baseGeneral, true)
    .plus(decimal(c.baseAhorro, true))
    .minus(minimo ? decimal(c.minimoPersonalFamiliar) : 0)
    .lte(c.modalidad === "individual" ? individual : conjunta)
}
function proporcion(c: Contexto, titulares: readonly string[]): Decimal {
  const ids = identidades(titulares)
  // No elimina al titular ajeno a esta declaración ni al que excede renta.
  return new D(
    ids.filter((id) => identidades(c.declarantes).includes(id)).length
  ).div(ids.length)
}
// Arts. 3 y 10: el reparto entre convivientes se limita a individuales.
// Una conjunta sin ningún titular tampoco adquiere derecho al importe.
function repartoSoloIndividual(
  c: Contexto,
  titulares: readonly string[]
): Decimal {
  const parte = proporcion(c, titulares)
  return c.modalidad === "conjunta" && parte.gt(0) ? new D(1) : parte
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

const TERRITORIO = "extremadura"

/** DL 1/2018 art. 2. Rentas individualizadas, incluidas pensiones sujetas. */
export function trabajoDependiente(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Trabajo, datos)
    opcion(f.exhaustividad, "todos_los_declarantes")
    const ids: string[] = []
    let total = new D(0)
    for (const valor of f.personas) {
      const p = valor
      ids.push(texto(p.id))
      const trabajo = decimal(p.integroTrabajo),
        resto = decimal(p.restoRentas, true)
      const eleccion = opcion(p.eleccion, "trabajo viudedad ninguna")
      if (
        eleccion === "trabajo" &&
        trabajo.gt(0) &&
        trabajo.lte(12000) &&
        resto.lte(300)
      )
        total = total.plus(75)
    }
    unicos(ids)
    const declarantes = identidades(c.declarantes)
    if (
      ids.length !== declarantes.length ||
      ids.some((id) => !declarantes.includes(id))
    )
      fallo("Rentas sin correspondencia exhaustiva con declarantes")
    return parcial(total, [
      "Clasificación/integración de todas las rentas y elección personal pendientes de contraste",
      "No calcula viudedad ni elige automáticamente; cuota autonómica disponible",
    ])
  })
}
/** Art. 3. Rama ordinaria: no traslada 12 bis a todos los municipios. */
export function partosMultiples(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Partos, datos)
    opcion(f.exhaustividad, "todos_los_partos")
    opcion(f.regimenRenta, "ordinario")
    const ids: string[] = [],
      hijos: string[] = []
    let total = new D(0)
    for (const valor of f.partos) {
      const p = valor
      ids.push(texto(p.id))
      const dia = fecha(p.fecha),
        menores = identidades(p.hijosConvivientes)
      hijos.push(...menores)
      if (
        menores.includes(c.contribuyente) ||
        menores.some((id) => p.titulares.includes(id))
      )
        fallo("Nacido es su propio progenitor")
      const parte = repartoSoloIndividual(c, p.titulares)
      if (menores.length < 2)
        fallo(
          "No es parto múltiple; no inferir supervivencia de lista incompleta"
        )
      if (dia >= "2025-01-01" && dia <= "2025-12-31")
        total = total.plus(parte.times(300).times(menores.length))
    }
    unicos(ids)
    unicos(hijos)
    return parcial(renta(c, 19000, 24000) ? total : new D(0), [
      "Convivencia efectiva al devengo y titularidad pendientes de evaluación; no incluye adopciones",
      "Rama rural 12 bis y nacidos no convivientes requieren hechos separados; cuota disponible",
    ])
  })
}
/** Art. 10. Cuantía por escolarizado con mínimo, no por factura. */
export function materialEscolar(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Escolar, datos)
    opcion(f.exhaustividad, "todos_los_descendientes")
    opcion(f.regimenRenta, "ordinario")
    const ids: string[] = []
    let total = new D(0)
    for (const valor of f.descendientes) {
      const h = valor
      ids.push(texto(h.id))
      if (h.id === c.contribuyente || h.titularesMinimo.includes(h.id))
        fallo("Descendiente titular de su propio mínimo")
      const etapa = opcion(
        h.etapa,
        "infantil primaria eso bachillerato universidad"
      )
      const parte = repartoSoloIndividual(c, h.titularesMinimo)
      if (etapa === "primaria" || etapa === "eso")
        total = total.plus(parte.times(15))
    }
    unicos(ids)
    return parcial(renta(c, 19000, 24000) ? total : new D(0), [
      "Escolarización obligatoria, convivencia y mínimo: hechos declarados sin reconocimiento externo",
      "Rama rural/familiar 12 bis y cuota disponible pendientes",
    ])
  })
}
/** Art. 11 octies y precisión manual 363–364: propio íntegro, familiares por causante. */
export function ela(entrada: Schema.Json, datos: Schema.Json): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Ela, datos)
    opcion(f.exhaustividad, "todos_los_diagnosticados")
    const ids: string[] = [],
      familiaresVistos: string[] = []
    let total = new D(0)
    for (const valor of f.personas) {
      const p = valor
      const id = texto(p.id)
      ids.push(id)
      const dia = fecha(p.fechaDiagnostico)
      const relacion = opcion(
        p.relacion,
        "propio conyuge pareja ascendiente descendiente"
      )
      const familiares = identidades(p.familiaresConDerecho, true)
      if (familiares.includes(id))
        fallo("Diagnosticado incluido en reparto de familiares")
      familiaresVistos.push(...familiares)
      const declarantes = identidades(c.declarantes)
      if ((relacion === "propio") !== declarantes.includes(id))
        fallo(
          "Identidad propia/familiar contradictoria; representar cada causante una sola vez"
        )
      if (dia <= "2025-12-31") {
        if (declarantes.includes(id)) total = total.plus(2000)
        if (familiares.length > 0)
          total = total.plus(proporcion(c, familiares).times(2000))
      }
    }
    unicos(ids)
    unicos(familiaresVistos)
    return parcial(total, [
      "Diagnóstico material, parentesco/pareja, convivencia o cargo y mínimos pendientes de evaluación",
      "Criterio administrativo de reparto separado, conservando literal amplio 11 octies.3",
      "Concurrencia familiar por varios diagnosticados no soportada; cuota/composición anual pendientes",
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

const Trabajo = Schema.Struct({
  exhaustividad: Schema.String,
  personas: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      integroTrabajo: Schema.String,
      restoRentas: Schema.String,
      eleccion: Schema.String,
    })
  ),
})
const Partos = Schema.Struct({
  exhaustividad: Schema.String,
  regimenRenta: Schema.String,
  partos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      fecha: Schema.String,
      hijosConvivientes: Schema.Array(Schema.String),
      titulares: Schema.Array(Schema.String),
    })
  ),
})
const Escolar = Schema.Struct({
  exhaustividad: Schema.String,
  regimenRenta: Schema.String,
  descendientes: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      etapa: Schema.String,
      titularesMinimo: Schema.Array(Schema.String),
    })
  ),
})
const Ela = Schema.Struct({
  exhaustividad: Schema.String,
  personas: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      fechaDiagnostico: Schema.String,
      relacion: Schema.String,
      familiaresConDerecho: Schema.Array(Schema.String),
    })
  ),
})
