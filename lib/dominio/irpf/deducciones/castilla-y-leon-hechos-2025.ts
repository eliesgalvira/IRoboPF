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

export const Discapacidad = Schema.Struct({
  persona: Schema.String,
  nacimiento: Schema.String,
  grado: Schema.Number,
  residencia: Schema.String,
})
export const Adopciones = Schema.Struct({
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
export const Cuotas = Schema.Struct({
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
export const Familia = Schema.Struct({
  tituloInicio: Schema.String,
  tituloFin: Schema.String,
  descendientes: Schema.Array(Schema.String),
  discapacidad65: Schema.Array(Schema.String),
  titulares: Schema.Array(Schema.String),
  residenciaConyuge: Schema.String,
  conyuge: Schema.NullOr(Schema.String),
})

function magnitudAnual(s: string, firmado = false): Decimal {
  if (!/^-?(0|[1-9]\d{0,13})(\.\d{1,80})?$/.test(s))
    fallo("Magnitud anual decimal inválida")
  const d = new D(s)
  if (!firmado && d.isNegative()) fallo("Magnitud anual negativa")
  return d
}

// Ampliación: las doce funciones precedentes se conservan byte a byte.
const APago = Schema.Struct({
  id: Schema.String,
  fecha: Schema.String,
  pagador: Schema.String,
  importe: Schema.String,
})
type APago = typeof APago.Type
const AMagnitud = Schema.Struct({
  ejercicio: Schema.Literal(2025),
  declarantes: Schema.Array(Schema.String),
  concepto: Schema.String,
  valor: Schema.String,
})
type AMagnitud = typeof AMagnitud.Type
function aAnual(
  c: Contexto,
  m: AMagnitud,
  concepto: string,
  firmado = false
): Decimal {
  const ids = identidades(m.declarantes)
  if (
    m.ejercicio !== 2025 ||
    m.concepto !== concepto ||
    ids.length !== c.declarantes.length ||
    ids.some((id) => !c.declarantes.includes(id))
  )
    fallo("Magnitud anual ajena al concepto, ejercicio o declaración")
  return decimal(m.valor, firmado)
}
function aPagos(
  c: Contexto,
  registros: readonly APago[],
  propios = true,
  porCobroSubvencion = false
): Decimal {
  unicos(registros.map((p) => texto(p.id)))
  let suma = new D(0)
  for (const p of registros) {
    const dia = fecha(p.fecha),
      quien = texto(p.pagador),
      importe = decimal(p.importe)
    if (
      (porCobroSubvencion || dia >= "2025-01-01") &&
      dia <= "2025-12-31" &&
      (!propios || c.declarantes.includes(quien))
    )
      suma = suma.plus(importe)
  }
  return suma
}
function aPersona(c: Contexto, id: string, titulares: readonly string[]): void {
  texto(id)
  identidades(titulares)
  if (id === c.contribuyente || titulares.includes(id))
    fallo("Persona es su propio descendiente/ascendiente/acogido")
}
function aPorcentaje(v: string): Decimal {
  const n = decimal(v)
  if (n.gt(100)) fallo("Porcentaje fuera de 0–100")
  return n.div(100)
}
function aNeto(importe: Decimal, ayudas: string, reembolsos = "0"): Decimal {
  return D.max(0, importe.minus(decimal(ayudas)).minus(decimal(reembolsos)))
}

const ANacimientoCyl = Schema.Struct({
  hijos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      fecha: Schema.String,
      orden: Schema.Number,
      grado: Schema.Number,
      poblacion: Schema.Number,
      titularesMinimo: Schema.Array(Schema.String),
      ayudaAnalogica: Schema.Literals(["no", "concedida"]),
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_nacimiento_adopcion_hijos: subcálculo por hechos; véase matriz63. */
export function nacimientoCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ANacimientoCyl, datos)

    unicos(f.hijos.map((h) => texto(h.id)))
    let total = new D(0)
    for (const h of f.hijos) {
      aPersona(c, h.id, h.titularesMinimo)
      const dia = fecha(h.fecha),
        orden = entero(h.orden, 100),
        grado = entero(h.grado, 100),
        poblacion = entero(h.poblacion, 10000000)
      if (orden === 0) fallo("Orden de nacimiento comienza en uno")
      const fila = poblacion <= 5000 ? [1420, 2070, 3300] : [1010, 1475, 2351]
      if (
        dia >= "2025-01-01" &&
        dia <= "2025-12-31" &&
        h.ayudaAnalogica === "no"
      )
        total = total.plus(
          proporcion(c, h.titularesMinimo)
            .times(fila[Math.min(orden, 3) - 1])
            .times(grado >= 33 ? 2 : 1)
        )
    }
    return parcial(total, [
      "Mínimo, orden de hijos y población al momento legal; reconocimiento tardío discapacidad antes de5años y ayudas por hijo; saldos2022 no confundidos con nuevos arrastres.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const AMultiplesCyl = Schema.Struct({
  hijos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      fecha: Schema.String,
      orden: Schema.Number,
      grado: Schema.Number,
      poblacion: Schema.Number,
      titularesMinimo: Schema.Array(Schema.String),
      ayudaAnalogica: Schema.Literals(["no", "concedida"]),
    })
  ),
  fechaPrimero: Schema.String,
  fechaUltimo: Schema.String,
  titulares: Schema.Array(Schema.String),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_partos_adopciones_multiples: subcálculo por hechos; véase matriz63. */
export function multiplesCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AMultiplesCyl, datos)

    const primero = fecha(f.fechaPrimero),
      ultimo = fecha(f.fechaUltimo),
      parte = proporcion(c, f.titulares)
    if (primero !== ultimo)
      fallo(
        "Rama de nacimientos independientes en12meses: falta historial de convivencia/agrupaciones, no se asume simultaneidad"
      )
    if (f.hijos.length < 2) fallo("Hecho múltiple exige al menos dos hijos")
    for (const h of f.hijos)
      if (h.fecha !== ultimo)
        fallo("Fecha de hijo no corresponde a agrupación simultánea")
    if (
      ultimo < "2025-01-01" &&
      f.hijos.some((h) => h.ayudaAnalogica === "concedida")
    )
      fallo("Adicional901: resolver ayuda histórica por hecho causante")
    const nacimiento = nacimientoCyl(entrada, {
      hijos: f.hijos,
      exhaustividad: "completa",
    })
    if (nacimiento.estado === "no_soportado") return nacimiento
    const cuantia =
      ultimo >= "2025-01-01" && ultimo <= "2025-12-31"
        ? new D(nacimiento.importeExacto).times(
            f.hijos.length === 2 ? "0.5" : "1"
          )
        : ultimo >= "2023-01-01" && ultimo < "2025-01-01"
          ? parte.times(901)
          : new D(0)
    return parcial(cuantia, [
      "Historial de convivencia y Bono por hijo; nacimientos independientes dentro de12meses, reagrupación y años siguientes; no duplicar901 en agrupación nueva.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const ACuidadoMenoresCyl = Schema.Struct({
  opcion: Schema.Literals(["hogar", "centro"]),
  hijos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      nacimiento: Schema.String,
      titularesMinimo: Schema.Array(Schema.String),
    })
  ),
  mesesCompletos: Schema.Number,
  pagos: Schema.Array(APago),
  ayudas: Schema.String,
  incrementoEstatalMaternidad: AMagnitud,
  progenitoresActividad: Schema.Array(Schema.String),
  progenitoresAlta: Schema.Array(Schema.String),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_cuidado_hijos_menores: subcálculo por hechos; véase matriz63. */
export function cuidadoMenoresCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ACuidadoMenoresCyl, datos)

    unicos(f.hijos.map((h) => h.id))
    let titulares: readonly string[] = []
    for (const h of f.hijos) {
      aPersona(c, h.id, h.titularesMinimo)
      if (edad(h.nacimiento) >= 4) fallo("Hijo fuera de edad al devengo")
      if (
        titulares.length > 0 &&
        (titulares.length !== h.titularesMinimo.length ||
          h.titularesMinimo.some((id) => !titulares.includes(id)))
      )
        fallo("Concurrencia con titulares distintos: asignar pagos por hijo")
      titulares = h.titularesMinimo
    }
    const activos = identidades(f.progenitoresActividad),
      alta = identidades(f.progenitoresAlta)
    if (titulares.some((id) => !activos.includes(id) || !alta.includes(id)))
      fallo("Falta actividad/alta de progenitor")
    if (f.pagos.some((p) => !titulares.includes(texto(p.pagador))))
      fallo("Pagador ajeno a titulares del gasto común")
    const meses = entero(f.mesesCompletos, 12),
      parte = titulares.length > 0 ? proporcion(c, titulares) : new D(0),
      pagado = aPagos(c, f.pagos, false)
    const estatal = aAnual(
        c,
        f.incrementoEstatalMaternidad,
        "incremento_estatal_maternidad"
      ),
      ayudas = decimal(f.ayudas)
    if (
      titulares.some((id) => !c.declarantes.includes(id)) &&
      (estatal.gt(0) || ayudas.gt(0))
    )
      fallo(
        "Concurrencia con progenitor externo: faltan ayudas/estatal y deducciones nominales de ambos para el techo de gasto"
      )
    const techo =
      f.opcion === "hogar" ? new D(322) : D.max(0, new D(1320).minus(estatal))
    const base = pagado.times(parte).times(f.opcion === "hogar" ? "0.30" : "1")
    const gastoRestante = D.max(0, pagado.minus(ayudas).minus(estatal)).times(
      parte
    )
    return parcial(
      renta(c, 18900, 31500, true) && meses > 0
        ? D.min(techo, base, gastoRestante)
        : new D(0),
      [
        "Centro regional registrado o hogar de alta; meses completos y gastos tipificados, NIF. Concurrencia con mínimos distintos, incremento estatal y límite conjunto de gasto/ayudas debe componerse entre progenitores.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AViviendaJovenRuralCyl = Schema.Struct({
  nacimiento: Schema.String,
  fechaAdquisicion: Schema.String,
  valorFiscal: Schema.String,
  poblacion: Schema.Number,
  distanciaCapital: Schema.String,
  pagos: Schema.Array(APago),
  maximaPropiedadAnterior: Schema.String,
  tipo: Schema.Literals(["nueva", "rehabilitada", "usada"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_vivienda_jovenes_medio_rural: subcálculo por hechos; véase matriz63. */
export function viviendaJovenRuralCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AViviendaJovenRuralCyl, datos)

    const anos = edad(f.nacimiento),
      dia = fecha(f.fechaAdquisicion),
      valor = decimal(f.valorFiscal),
      poblacion = entero(f.poblacion, 10000000),
      distancia = decimal(f.distanciaCapital),
      propiedad = aPorcentaje(f.maximaPropiedadAnterior)
    if (dia < "2023-01-01")
      fallo(
        "Derecho anterior a2023 exige requisitos de origen; no sanear con reforma"
      )
    const territorio = poblacion <= (distancia.lt(30) ? 3000 : 10000)
    return parcial(
      anos < 36 &&
        valor.lt(150000) &&
        territorio &&
        propiedad.lt("0.5") &&
        f.tipo !== "usada" &&
        renta(c, 18900, 31500, true)
        ? D.min(10000, aPagos(c, f.pagos)).times("0.15")
        : new D(0),
      [
        "Primera/nueva/habitual, población en adquisición/primer pago y lista negativa anual; rehabilitación IVA y patrimonio; régimen de origen pre2023 pendiente.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ARehabilitacionSubvencionadaCyl = Schema.Struct({
  pagos: Schema.Array(APago),
  fechaCobroSubvencion: Schema.String,
  programa: Schema.Literals(["estatal", "autonomico"]),
  actuacion: Schema.Literals(["eficiencia", "sostenibilidad", "discapacidad"]),
  medioPago: Schema.Literals(["transferencia", "otro"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad: subcálculo por hechos; véase matriz63. */
export function rehabilitacionSubvencionadaCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ARehabilitacionSubvencionadaCyl, datos)

    const cobro = fecha(f.fechaCobroSubvencion)
    if (f.programa === "autonomico")
      fallo("Reserva delimitada: programa exclusivamente autonómico elegible")
    return parcial(
      cobro >= "2025-01-01" &&
        cobro <= "2025-12-31" &&
        f.medioPago === "transferencia"
        ? D.min(20000, aPagos(c, f.pagos, true, true)).times("0.15")
        : new D(0),
      [
        "Actuación enumerada/vivienda habitual, programa y subvención particular; año del cobro. No importar edad/primera vivienda ni umbral IVA7.6. Pagos de otros años requieren ligar la subvención a su gasto histórico.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ARehabilitacionAlquilerCyl = Schema.Struct({
  pagos: Schema.Array(APago),
  poblacion: Schema.Number,
  distanciaCapital: Schema.String,
  rentaMensual: Schema.String,
  parentescoArrendatario: Schema.Number,
  diasOfertada: Schema.Number,
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_rehabilitacion_viviendas_medio_rural_alquiler: subcálculo por hechos; véase matriz63. */
export function rehabilitacionAlquilerCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ARehabilitacionAlquilerCyl, datos)

    const poblacion = entero(f.poblacion, 10000000),
      distancia = decimal(f.distanciaCapital),
      rentaMes = decimal(f.rentaMensual),
      parentesco = entero(f.parentescoArrendatario, 20)
    entero(f.diasOfertada, 365)
    return parcial(
      poblacion <= (distancia.lt(30) ? 3000 : 10000) &&
        rentaMes.lte(300) &&
        (parentesco === 0 || parentesco > 3)
        ? D.min(20000, aPagos(c, f.pagos)).times("0.15")
        : new D(0),
      [
        "Solo remisión territorial7.1.c; rehabilitación IVA, depósito, cinco años y oferta en vacancia. Sin edad/primera vivienda ni valor150000; condiciones materiales de arrendamiento por vivienda.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AEmprendimientoCyl = Schema.Struct({
  pagos: Schema.Array(APago),
  via: Schema.Literals(["directa", "indirecta"]),
  participacion: Schema.String,
  sede: Schema.Literals(["cyl", "externa"]),
  proyecto: Schema.Literals(["cyl", "fuera"]),
  mesesReinversion: Schema.Number,
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_fomento_emprendimiento: subcálculo por hechos; véase matriz63. */
export function emprendimientoCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AEmprendimientoCyl, datos)

    const participacion = aPorcentaje(f.participacion),
      meses = entero(f.mesesReinversion, 120)
    if (f.via === "directa" && f.sede === "externa")
      fallo(
        "Reserva delimitada: inversión directa con sede externa; no importar requisito indirecto"
      )
    const acceso =
      participacion.gte("0.005") &&
      participacion.lte("0.45") &&
      f.proyecto === "cyl" &&
      (f.via === "directa" || (f.sede === "cyl" && meses <= 6))
    return parcial(
      acceso ? D.min(10000, aPagos(c, f.pagos).times("0.20")) : new D(0),
      [
        "Proyecto/empleo y tres años; indirecta con objeto exclusivo, inversión de receptora y plazos; porcentajes y patrimonio del grupo familiar, no certificado genérico.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const APatrimonioCyl = Schema.Struct({
  pagos: Schema.Array(APago),
  baseLiquidable: AMagnitud,
  otrasBases9af: AMagnitud,
  rama: Schema.Literals(["cultural", "natural"]),
  acto: Schema.Literals(["autorizacion", "informe", "ambos", "ninguno"]),
  categoria: Schema.Literals(["protegido", "censo_solo"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_recuperacion_patrimonio_historico_cultural_natural: subcálculo por hechos; véase matriz63. */
export function patrimonioCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(APatrimonioCyl, datos)

    const techo = D.max(
      0,
      aAnual(c, f.baseLiquidable, "base_liquidable_total")
        .times("0.10")
        .minus(aAnual(c, f.otrasBases9af, "otras_bases_conjunto_9a_f"))
    )
    if (f.rama === "natural" && ["autorizacion", "informe"].includes(f.acto))
      fallo(
        "Reserva delimitada: norma autorización O informe frente a resumen acumulativo"
      )
    const acceso =
      f.rama === "natural"
        ? f.acto === "ambos"
        : f.categoria === "protegido" &&
          ["autorizacion", "ambos"].includes(f.acto)
    return parcial(
      acceso && renta(c, 18900, 31500, true)
        ? D.min(techo, aPagos(c, f.pagos)).times("0.15")
        : new D(0),
      [
        "Categoría protegida cultural (el censo amplio no sustituye), obra y autorización; patrimonio natural autorizado/informado. Otras bases9a–f deben venir exhaustivas para no gastar dos veces el techo.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ADonacionesPatrimonioCyl = Schema.Struct({
  pagos: Schema.Array(APago),
  baseLiquidable: AMagnitud,
  otrasBases9af: AMagnitud,
  destino: Schema.Literals(["patrimonio", "catedral", "fundacion"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_donaciones_fundaciones_patrimonio: subcálculo por hechos; véase matriz63. */
export function donacionesPatrimonioCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ADonacionesPatrimonioCyl, datos)

    const techo = D.max(
      0,
      aAnual(c, f.baseLiquidable, "base_liquidable_total")
        .times("0.10")
        .minus(aAnual(c, f.otrasBases9af, "otras_bases_conjunto_9a_f"))
    )
    return parcial(
      renta(c, 18900, 31500, true)
        ? D.min(techo, aPagos(c, f.pagos)).times("0.15")
        : new D(0),
      [
        "Destinatarios/fines9c/d/e diferenciados; estatutos y registro de9e no se sustituyen por régimen49/2002 de9c; certificar realidad del destino y base conjunta.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ADonacionesIdiCyl = Schema.Struct({
  pagos: Schema.Array(APago),
  baseLiquidable: AMagnitud,
  otrasBases9af: AMagnitud,
  proyecto: Schema.Literals(["cyl", "fuera"]),
  destinatario: Schema.Literals([
    "universidad_publica",
    "fundacion_publica",
    "otro_legal",
  ]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_donaciones_idi: subcálculo por hechos; véase matriz63. */
export function donacionesIdiCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ADonacionesIdiCyl, datos)

    const techo = D.max(
      0,
      aAnual(c, f.baseLiquidable, "base_liquidable_total")
        .times("0.10")
        .minus(aAnual(c, f.otrasBases9af, "otras_bases_conjunto_9a_f"))
    )
    return parcial(
      f.proyecto === "cyl"
        ? D.min(techo, aPagos(c, f.pagos)).times("0.15")
        : new D(0),
      [
        "Beneficiarios legales/proyecto regional9f; exceptuada de renta pero incluida en límite de base común9a–f. Domicilio regional no salva un proyecto externo.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AMovilidadCyl = Schema.Struct({
  vehiculos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      tipo: Schema.Literals(["electrico", "autonomia_extendida", "hibrido"]),
      wltp: Schema.String,
      precio: Schema.String,
      fechaMatricula: Schema.String,
      afectacion: Schema.Literals(["no", "si"]),
      adquirentes: Schema.Array(Schema.String),
      pagos: Schema.Array(APago),
      deduccionEstatal: AMagnitud,
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_movilidad_sostenible: subcálculo por hechos; véase matriz63. */
export function movilidadCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AMovilidadCyl, datos)

    unicos(f.vehiculos.map((v) => texto(v.id)))
    unicos(f.vehiculos.flatMap((v) => v.pagos.map((p) => p.id)))
    let total = new D(0)
    for (const v of f.vehiculos) {
      const precio = decimal(v.precio),
        wltp = decimal(v.wltp),
        matricula = fecha(v.fechaMatricula),
        parte = proporcion(c, v.adquirentes)
      const estatal = aAnual(
          c,
          v.deduccionEstatal,
          "deduccion_estatal_mismo_vehiculo_para_declaracion:" + v.id
        ),
        techo = D.max(0, new D(4000).times(parte).minus(estatal))
      if (v.pagos.some((p) => !v.adquirentes.includes(texto(p.pagador))))
        fallo("Pago de vehículo por persona ajena a adquirentes")
      if (aPagos(c, v.pagos, false).gt(precio))
        fallo("Pagos de adquisición superiores al precio del vehículo")
      const base = aPagos(c, v.pagos)
      if (
        precio.lte(40000) &&
        v.afectacion === "no" &&
        (v.tipo !== "hibrido" || wltp.gt(40)) &&
        matricula >= "2025-01-01" &&
        matricula <= "2025-12-31"
      )
        total = total.plus(D.min(techo, base.times("0.15")))
    }
    return parcial(total, [
      "Vehículo turismo nuevo, facturas a nombre de adquirentes, WLTP y cuatro años; deducción estatal del mismo vehículo incluso otro ejercicio y su atribución, no de otro vehículo.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const AViviendaNuevaCyl = Schema.Struct({
  pagos: Schema.Array(APago),
  fechaVisado: Schema.String,
  fechaPrimerPago: Schema.String,
  tipo: Schema.Literals(["nueva", "rehabilitacion", "ampliacion"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_vivienda_nueva_construccion: subcálculo por hechos; véase matriz63. */
export function viviendaNuevaCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AViviendaNuevaCyl, datos)

    const visado = fecha(f.fechaVisado),
      primero = fecha(f.fechaPrimerPago),
      ano = Number(primero.slice(0, 4))
    return parcial(
      visado >= "2011-09-01" &&
        visado <= "2012-12-31" &&
        ano <= 2025 &&
        ano + 4 >= 2025 &&
        f.tipo === "nueva" &&
        renta(c, 18900, 31500, true)
        ? D.min(9040, aPagos(c, f.pagos)).times("0.075")
        : new D(0),
      [
        "DT5 TR2008: primera, nueva y habitual; visado en ventana legal y cinco ejercicios desde primer pago; patrimonio y remisión histórica2012, sin ampliar a rehabilitación.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AAlquilerJovenCyl = Schema.Struct({
  nacimiento: Schema.String,
  contratos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      poblacion: Schema.Number,
      distanciaCapital: Schema.String,
      pagos: Schema.Array(APago),
      ayudasMensualidades2025: Schema.String,
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** cyl_arrendamiento_vivienda_jovenes: subcálculo por hechos; véase matriz63. */
export function alquilerJovenCyl(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AAlquilerJovenCyl, datos)

    const anos = edad(f.nacimiento)
    unicos(f.contratos.map((p) => texto(p.id)))
    unicos(f.contratos.flatMap((p) => p.pagos.map((x) => x.id)))
    let total = new D(0)
    for (const p of f.contratos) {
      const poblacion = entero(p.poblacion, 10000000),
        distancia = decimal(p.distanciaCapital),
        rural = poblacion <= (distancia.lt(30) ? 3000 : 10000)
      total = total.plus(
        D.min(
          rural ? 612 : 459,
          aPagos(c, p.pagos).times(rural ? "0.25" : "0.20"),
          aNeto(aPagos(c, p.pagos), p.ayudasMensualidades2025)
        )
      )
    }
    return parcial(
      anos < 36 && renta(c, 18900, 31500, true) ? D.min(612, total) : new D(0),
      [
        "Titularidad contrato/habitualidad y territorio del año; ayudas atribuidas a mensualidades del año, no a la fecha de cobro; no trasladar límites de vivienda en propiedad.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}
