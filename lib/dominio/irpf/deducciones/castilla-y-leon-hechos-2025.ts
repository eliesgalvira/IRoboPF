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

const TERRITORIO = "castilla-y-leon"

/** DL 1/2013 arts. 6 y 10: rama de porcentaje certificado, sin presunción por simple apoyo. */
export function discapacidadPropia(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Discapacidad, datos)
    if (texto(f.persona) !== texto(c.contribuyente))
      fallo("Discapacidad de otra persona")
    const anos = edad(f.nacimiento),
      grado = entero(f.grado, 100)
    const residencia = opcion(f.residencia, "fuera publica concertada")
    const cuantia =
      anos >= 65
        ? grado >= 65
          ? 656
          : grado >= 33
            ? 300
            : 0
        : grado >= 65
          ? 300
          : 0
    return parcial(
      new D(
        residencia === "fuera" && renta(c, 18900, 31500, true) ? cuantia : 0
      ),
      [
        "Certificación del grado y residencia material no acreditadas por este cálculo",
        "Composición anual y cuota autonómica disponible; no resuelve presunciones judiciales",
      ]
    )
  })
}
/** Arts. 4.5/4.6 y 10: solo nuevos hechos de 2025, sin saldos de 2022. */
export function adopcion(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Adopciones, datos)
    opcion(f.exhaustividad, "todas_las_adopciones")
    const ids: string[] = []
    let total = new D(0)
    for (const valor of f.adopciones) {
      const a = valor
      ids.push(texto(a.hijo))
      if (a.hijo === c.contribuyente || a.titularesMinimo.includes(a.hijo))
        fallo("Adoptado es su propio progenitor")
      const resolucion = fecha(a.fechaResolucion),
        inscripcion = fecha(a.fechaInscripcion)
      if (inscripcion < resolucion) fallo("Inscripción anterior a resolución")
      const clase = opcion(a.clase, "nacional internacional")
      const ayuda = opcion(
        a.ayudaAnalogica,
        "no_solicitada denegada pendiente concedida"
      )
      if (ayuda === "pendiente") fallo("Concesión de ayuda todavía desconocida")
      const parte = proporcion(c, a.titularesMinimo)
      if (
        inscripcion >= "2025-01-01" &&
        inscripcion <= "2025-12-31" &&
        ayuda !== "concedida"
      )
        total = total.plus(parte.times(clase === "internacional" ? 3625 : 784))
    }
    unicos(ids)
    return parcial(total, [
      "Mínimo de descendientes, legalidad internacional y naturaleza de ayudas: no acreditados aquí",
      "Cuota autonómica disponible; saldos de 2022 y solicitud de abono fuera de esta rama",
    ])
  })
}
/** Arts. 5.2 y 10. Pagos identificados, reparto de base, máximo por declaración. */
export function cuotasHogar(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Cuotas, datos)
    opcion(f.exhaustividad, "todos_los_pagos")
    const anos = edad(f.hijoNacimiento)
    const titulares = identidades(f.titularesMinimo)
    if (f.hijo === c.contribuyente || titulares.includes(texto(f.hijo)))
      fallo("Hijo titular de su propio mínimo")
    const ayuda = opcion(
      f.ayudaAnalogica,
      "no_solicitada denegada pendiente concedida bono_concilia"
    )
    if (ayuda === "pendiente") fallo("Ayuda análoga pendiente de conocer")
    const ids: string[] = []
    let base = new D(0)
    for (const valor of f.pagos) {
      const p = valor
      ids.push(texto(p.id))
      texto(p.nifEmpleado)
      if (p.nifEmpleado === f.hijo)
        fallo("Menor de cuatro años no es empleado del hogar")
      const dia = fecha(p.fecha),
        importe = decimal(p.importe),
        empleador = texto(p.empleador)
      const regimen = opcion(p.regimen, "privativo gananciales")
      const conyuge = p.conyuge === null ? null : texto(p.conyuge)
      if (
        (regimen === "gananciales" &&
          (conyuge === null || conyuge === empleador)) ||
        (regimen === "privativo" && conyuge !== null)
      )
        fallo("Titularidad matrimonial contradictoria")
      const pagadores = conyuge === null ? [empleador] : [empleador, conyuge]
      // Un matrimonio en gananciales sin conexión con los titulares requiere resolver atribución.
      if (
        pagadores.length !== titulares.length ||
        pagadores.some((id) => !titulares.includes(id))
      )
        fallo("Atribución de cuotas fuera de titulares del mínimo")
      if (dia >= "2025-01-01" && dia <= "2025-12-31")
        base = base.plus(importe.times(proporcion(c, pagadores)))
    }
    unicos(ids)
    return parcial(
      anos < 4 && ayuda !== "concedida" && renta(c, 18900, 31500, true)
        ? D.min(300, base.times("0.15"))
        : new D(0),
      [
        "Alta en sistema especial, cuotas efectivas y mínimo por hijo no se acreditan con NIF",
        "Rama de atribución empleador/gananciales; otras concurrencias de titulares requieren resolver art. 10.3",
        "Cuota autonómica disponible y saldos de 2022 fuera de esta rama",
      ]
    )
  })
}
/** Arts. 3 y 10: cantidad según descendientes con mínimo, nunca según categoría sola. */
export function familiaNumerosa(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(Familia, datos)
    opcion(f.residenciaConyuge, "castilla-y-leon sin_conyuge")
    const inicio = fecha(f.tituloInicio),
      fin = fecha(f.tituloFin)
    if (fin < inicio) fallo("Título con intervalo inverso")
    const hijos = identidades(f.descendientes, true),
      discapacitados = identidades(f.discapacidad65, true)
    // La lista incluye solo cónyuge/descendientes: su vínculo/minimo se revisa fuera.
    const titulares = identidades(f.titulares)
    if (
      hijos.includes(c.contribuyente) ||
      hijos.some((id) => titulares.includes(id))
    )
      fallo("Titular es su propio descendiente")
    const conyuge = f.conyuge === null ? null : texto(f.conyuge)
    if ((f.residenciaConyuge === "sin_conyuge") !== (conyuge === null))
      fallo("Identidad/estado conyugal contradictorios")
    if (
      conyuge === c.contribuyente ||
      (conyuge !== null && hijos.includes(conyuge))
    )
      fallo("Cónyuge propio o descendiente")
    const vinculados =
      conyuge === null ? hijos : [...hijos, texto(c.contribuyente), conyuge]
    if (discapacitados.some((id) => !vinculados.includes(id)))
      fallo("Discapacidad fuera de cónyuges/descendientes")
    const parte = proporcion(c, titulares)
    const numero = hijos.length
    const cuantia =
      numero <= 3 ? 600 : numero === 4 ? 1500 : 2500 + (numero - 5) * 1000
    return parcial(
      inicio <= "2025-12-31" && fin >= "2025-12-31"
        ? new D(cuantia).plus(discapacitados.length > 0 ? 600 : 0).times(parte)
        : new D(0),
      [
        "Rama de cónyuge no residente no soportada; no se importa sin hechos",
        "Título, convivencia y derecho al mínimo de cada descendiente pendientes de evaluación",
        "Discapacidad y vínculo del cónyuge/descendientes; cuota disponible y saldos de 2022",
      ]
    )
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

const Discapacidad = Schema.Struct({
  persona: Schema.String,
  nacimiento: Schema.String,
  grado: Schema.Number,
  residencia: Schema.String,
})
const Adopciones = Schema.Struct({
  exhaustividad: Schema.String,
  adopciones: Schema.Array(
    Schema.Struct({
      hijo: Schema.String,
      fechaResolucion: Schema.String,
      fechaInscripcion: Schema.String,
      clase: Schema.String,
      ayudaAnalogica: Schema.String,
      titularesMinimo: Schema.Array(Schema.String),
    })
  ),
})
const Cuotas = Schema.Struct({
  exhaustividad: Schema.String,
  hijo: Schema.String,
  hijoNacimiento: Schema.String,
  titularesMinimo: Schema.Array(Schema.String),
  ayudaAnalogica: Schema.String,
  pagos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      fecha: Schema.String,
      importe: Schema.String,
      nifEmpleado: Schema.String,
      empleador: Schema.String,
      regimen: Schema.String,
      conyuge: Schema.NullOr(Schema.String),
    })
  ),
})
const Familia = Schema.Struct({
  tituloInicio: Schema.String,
  tituloFin: Schema.String,
  descendientes: Schema.Array(Schema.String),
  discapacidad65: Schema.Array(Schema.String),
  titulares: Schema.Array(Schema.String),
  residenciaConyuge: Schema.String,
  conyuge: Schema.NullOr(Schema.String),
})
