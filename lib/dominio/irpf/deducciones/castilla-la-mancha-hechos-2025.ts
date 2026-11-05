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

// Parser de hechos de la ampliación; conserva su contrato recibido.
function decimal(v: string, firmado = false): Decimal {
  if (!/^-?(0|[1-9]\d{0,13})(\.\d{1,8})?$/.test(v))
    return fallo(
      "Magnitud decimal: cadena finita, hasta 14 enteros y 8 decimales"
    )
  const d = new D(v)
  if (!firmado && d.isNegative()) return fallo("Magnitud negativa")
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
  propios = true
): Decimal {
  unicos(registros.map((p) => texto(p.id)))
  let suma = new D(0)
  for (const p of registros) {
    const dia = fecha(p.fecha),
      quien = texto(p.pagador),
      importe = decimal(p.importe)
    if (
      dia >= "2025-01-01" &&
      dia <= "2025-12-31" &&
      (!propios || c.declarantes.includes(quien))
    )
      suma = suma.plus(importe)
  }
  return suma
}
function aParte(c: Contexto, titulares: readonly string[]): Decimal {
  const ids = identidades(titulares)
  if (c.modalidad === "conjunta")
    return new D(ids.some((id) => c.declarantes.includes(id)) ? 1 : 0)
  return proporcion(c, ids)
}
function aPersona(c: Contexto, id: string, titulares: readonly string[]): void {
  texto(id)
  identidades(titulares)
  if (id === c.contribuyente || titulares.includes(id))
    fallo("Persona es su propio descendiente/ascendiente/acogido")
}
function aDias(inicio: string, fin: string): number {
  fecha(inicio)
  fecha(fin)
  if (inicio > fin) fallo("Intervalo civil inverso")
  // El período soportado sigue siendo el devengo ordinario de 2025.
  const desde = inicio < "2025-01-01" ? "2025-01-01" : inicio
  const hasta = fin > "2025-12-31" ? "2025-12-31" : fin
  if (desde > hasta) return 0
  const a = DateTime.make(desde + "T00:00:00Z"),
    b = DateTime.make(hasta + "T00:00:00Z")
  if (Option.isNone(a) || Option.isNone(b))
    return fallo("Intervalo no representable")
  return (
    (DateTime.toEpochMillis(b.value) - DateTime.toEpochMillis(a.value)) /
      86400000 +
    1
  )
}
function aPorcentaje(v: string): Decimal {
  const n = decimal(v)
  if (n.gt(100)) fallo("Porcentaje fuera de 0–100")
  return n.div(100)
}
function aNeto(importe: Decimal, ayudas: string, reembolsos = "0"): Decimal {
  return D.max(0, importe.minus(decimal(ayudas)).minus(decimal(reembolsos)))
}

const AMunicipiosIntermedios: readonly string[] = [
  "02015",
  "02032",
  "02048",
  "02050",
  "02078",
  "13018",
  "13050",
  "13070",
  "13904",
  "45012",
  "45034",
  "45042",
  "45055",
  "45057",
  "45070",
  "45090",
  "45094",
  "45096",
  "45116",
  "45140",
  "45141",
  "45167",
  "45174",
  "45190",
  "45193",
]

const AFamiliaMonoparental = Schema.Struct({
  estadoCivil: Schema.Literals(["separado", "sin_vinculo", "casado", "viudo"]),
  hijos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      nacimiento: Schema.String,
      apoyoCivil: Schema.Literals([
        "ninguno",
        "guarda",
        "curatela",
        "defensor",
        "voluntario",
      ]),
      convivencia: Schema.Literals(["exclusiva", "compartida", "ninguna"]),
      titularesMinimo: Schema.Array(Schema.String),
      alimentos: Schema.String,
    })
  ),
  eleccion: Schema.Literals(["familia", "alquiler_monoparental"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_familia_monoparental: subcálculo por hechos; véase matriz63. */
export function familiaMonoparental(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AFamiliaMonoparental, datos)

    unicos(f.hijos.map((h) => h.id))
    let acceso = false
    for (const h of f.hijos) {
      aPersona(c, h.id, h.titularesMinimo)
      const anos = edad(h.nacimiento)
      const alimentos = decimal(h.alimentos)
      if (
        (anos < 18 || h.apoyoCivil !== "ninguno") &&
        h.convivencia === "exclusiva" &&
        h.titularesMinimo.length === 1 &&
        h.titularesMinimo[0] === c.contribuyente &&
        alimentos.eq(0)
      )
        acceso = true
    }
    if (f.estadoCivil === "viudo")
      fallo(
        "Rama de viudedad requiere exclusión penal particular del art. 2 bis"
      )
    return parcial(
      new D(
        acceso &&
          f.estadoCivil !== "casado" &&
          f.eleccion === "familia" &&
          renta(c, 27000, 36000)
          ? 200
          : 0
      ),
      [
        "Emancipación, dependencia exclusiva y mínimo material; rama de viudedad con exclusión penal y composición anual.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AFamiliaNumerosaAmpliada = Schema.Struct({
  categoria: Schema.Literals(["general", "especial"]),
  inicioTitulo: Schema.String,
  finTitulo: Schema.String,
  discapacitados65: Schema.Array(Schema.String),
  titulares: Schema.Array(Schema.String),
  eleccion: Schema.Literals(["familia", "alquiler_numerosa"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_familia_numerosa: subcálculo por hechos; véase matriz63. */
export function familiaNumerosaAmpliada(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AFamiliaNumerosaAmpliada, datos)

    const dias = aDias(f.inicioTitulo, f.finTitulo)
    identidades(f.discapacitados65, true)
    const parte = proporcion(c, f.titulares),
      incremento = f.discapacitados65.length > 0
    const importe =
      f.categoria === "general"
        ? incremento
          ? 300
          : 200
        : incremento
          ? 900
          : 400
    return parcial(
      f.finTitulo >= "2025-12-31" &&
        dias > 0 &&
        f.eleccion === "familia" &&
        renta(c, 27000, 36000)
        ? parte.times(importe)
        : new D(0),
      [
        "Vínculo cónyuge/descendiente y mínimo de discapacidad; título material y composición del art. 13.4.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ADiscapacidadFamiliares = Schema.Struct({
  personas: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      vinculo: Schema.Literals(["ascendiente", "descendiente"]),
      grado: Schema.Number,
      titularesMinimo: Schema.Array(Schema.String),
      eleccion: Schema.Literals([
        "discapacidad_familiar",
        "discapacidad_propia",
        "cuidado75",
      ]),
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_discapacidad_ascendientes_descendientes: subcálculo por hechos; véase matriz63. */
export function discapacidadFamiliares(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ADiscapacidadFamiliares, datos)

    unicos(f.personas.map((p) => p.id))
    let total = new D(0)
    for (const p of f.personas) {
      aPersona(c, p.id, p.titularesMinimo)
      const grado = entero(p.grado, 100)
      if (grado >= 65 && p.eleccion === "discapacidad_familiar")
        total = total.plus(proporcion(c, p.titularesMinimo).times(300))
    }
    return parcial(renta(c, 27000, 36000) ? total : new D(0), [
      "Mínimo por persona: parentesco, convivencia, rentas y declaración; acreditar grado y opción por persona.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const AGastosEducacion = Schema.Struct({
  familia: Schema.Literals(["ordinaria", "numerosa"]),
  hijos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      titularesMinimo: Schema.Array(Schema.String),
    })
  ),
  libros: Schema.Array(APago),
  actividades: Schema.Array(APago),
  becas: Schema.String,
  baseMenosMinimo: AMagnitud,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_libros_idiomas_otros_gastos_educacion: subcálculo por hechos; véase matriz63. */
export function gastosEducacion(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AGastosEducacion, datos)

    unicos(f.hijos.map((h) => h.id))
    for (const h of f.hijos) aPersona(c, h.id, h.titularesMinimo)
    const base = aAnual(
      c,
      f.baseMenosMinimo,
      "base_imponible_menos_minimo_personal_familiar",
      true
    )
    const conjunta = c.modalidad === "conjunta"
    let tope = 0
    if (f.familia === "numerosa")
      tope = base.lte(conjunta ? 40000 : 30000) ? (conjunta ? 300 : 150) : 0
    else {
      const tramos = conjunta
        ? [
            [12000, 200],
            [20000, 100],
            [25000, 75],
          ]
        : [
            [6500, 100],
            [10000, 75],
            [12500, 50],
          ]
      for (const [umbral, limite] of tramos)
        if (base.lte(umbral)) {
          tope = limite
          break
        }
    }
    unicos([...f.libros, ...f.actividades].map((p) => p.id))
    const gasto = aPagos(c, f.libros).plus(
      aPagos(c, f.actividades).times("0.15")
    )
    const hijos = f.hijos.filter((h) =>
      h.titularesMinimo.some((id) => c.declarantes.includes(id))
    ).length
    return parcial(
      D.max(0, D.min(gasto, new D(tope).times(hijos)).minus(decimal(f.becas))),
      [
        "Etapas de libros y cuatro clases de actividad (internet solo alta/primer mes sin cambio ni actividad); mínimo de hijos; becas tras límite global.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AGuarderia = Schema.Struct({
  hijos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      nacimiento: Schema.String,
      titularesMinimo: Schema.Array(Schema.String),
      mesesCompletos: Schema.Number,
      pagos: Schema.Array(APago),
      becas: Schema.String,
      gastoExentoEspecie: Schema.String,
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_gastos_guarderia: subcálculo por hechos; véase matriz63. */
export function guarderia(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AGuarderia, datos)

    unicos(f.hijos.map((h) => h.id))
    unicos(f.hijos.flatMap((h) => h.pagos.map((p) => p.id)))
    let total = new D(0)
    for (const h of f.hijos) {
      aPersona(c, h.id, h.titularesMinimo)
      const anos = edad(h.nacimiento)
      entero(h.mesesCompletos, 12)
      const gasto = aNeto(aPagos(c, h.pagos), h.becas, h.gastoExentoEspecie)
      if (anos <= 3 && h.mesesCompletos > 0)
        total = total.plus(
          D.min(
            gasto.times("0.30"),
            proporcion(c, h.titularesMinimo).times(anos === 3 ? 250 : 500)
          )
        )
    }
    return parcial(renta(c, 27000, 36000) ? total : new D(0), [
      "Centro autorizado, imputación de cada pago a meses completos y mínimo; ramas de fallecimiento y uso del límite por cónyuge fallecido.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const AAcogimientoMenores = Schema.Struct({
  personas: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      nacimiento: Schema.String,
      inicio: Schema.String,
      fin: Schema.String,
      orden: Schema.Number,
      contraprestacion: Schema.String,
      ayudaJccm: Schema.String,
      adopcion: Schema.Literals(["no", "si"]),
      titulares: Schema.Array(Schema.String),
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_acogimiento_familiar_no_remunerado_menores: subcálculo por hechos; véase matriz63. */
export function acogimientoMenores(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AAcogimientoMenores, datos)

    unicos(f.personas.map((p) => p.id))
    unicos(f.personas.map((p) => String(p.orden)))
    let total = new D(0)
    for (const p of f.personas) {
      aPersona(c, p.id, p.titulares)
      if (fecha(p.inicio) < fecha(p.nacimiento))
        fallo("Convivencia anterior al nacimiento")
      const anos = edad(p.nacimiento),
        dias = aDias(p.inicio, p.fin),
        orden = entero(p.orden, 100)
      if (orden < 1) fallo("Orden de acogimiento comienza en uno")
      const dinero = decimal(p.contraprestacion).plus(decimal(p.ayudaJccm))
      if (anos < 18 && dias > 183 && dinero.eq(0) && p.adopcion === "no")
        total = total.plus(
          aParte(c, p.titulares).times(orden === 1 ? 500 : 600)
        )
    }
    return parcial(renta(c, 12500, 25000) ? total : new D(0), [
      "Cronología completa del ordinal; acuerdo de acogimiento/guarda preadoptiva y certificado de ausencia de ayuda; matrimonio/unión de hecho para reparto.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const AAcogimientoMayores = Schema.Struct({
  personas: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      nacimiento: Schema.String,
      grado: Schema.Number,
      inicio: Schema.String,
      fin: Schema.String,
      parentesco: Schema.Number,
      contraprestacion: Schema.String,
      ayudas: Schema.String,
      titulares: Schema.Array(Schema.String),
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_acogimiento_no_remunerado_mayores_65_discapacidad: subcálculo por hechos; véase matriz63. */
export function acogimientoMayores(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AAcogimientoMayores, datos)

    unicos(f.personas.map((p) => p.id))
    let total = new D(0)
    for (const p of f.personas) {
      aPersona(c, p.id, p.titulares)
      if (fecha(p.inicio) < fecha(p.nacimiento))
        fallo("Convivencia anterior al nacimiento")
      const anos = edad(p.nacimiento),
        grado = entero(p.grado, 100),
        dias = aDias(p.inicio, p.fin),
        parentesco = entero(p.parentesco, 20)
      const dinero = decimal(p.contraprestacion).plus(decimal(p.ayudas))
      if (
        (anos > 65 || grado >= 33) &&
        !(anos > 65 && parentesco > 0 && parentesco <= 4) &&
        dias > 183 &&
        dinero.eq(0)
      )
        total = total.plus(aParte(c, p.titulares).times(600))
    }
    return parcial(renta(c, 12500, 25000) ? total : new D(0), [
      "Parentesco y certificados de ausencia de ayuda de acogedor/acogido; alcance concreto de reparto entre titulares.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const AAlquilerJoven = Schema.Struct({
  inicio: Schema.String,
  fin: Schema.String,
  titularesConDerecho: Schema.Array(Schema.String),
  pagos: Schema.Array(APago),
  minimoDescendientes: AMagnitud,
  eleccion: Schema.Literals(["esta", "otra_incompatible"]),
  nacimiento: Schema.String,
  poblacionPadronVigente: Schema.Number,
  distanciaMunicipio50000: Schema.String,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_arrendamiento_menores_36: subcálculo por hechos; véase matriz63. */
export function alquilerJoven(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AAlquilerJoven, datos)

    aDias(f.inicio, f.fin)
    const parte = proporcion(c, f.titularesConDerecho)
    const base = decimal(c.baseGeneral, true)
      .plus(decimal(c.baseAhorro, true))
      .minus(aAnual(c, f.minimoDescendientes, "minimo_descendientes"))
    const acceso =
      base.lte(c.modalidad === "individual" ? 12500 : 25000) &&
      f.eleccion === "esta"
    const anos = edad(f.nacimiento),
      poblacion = entero(f.poblacionPadronVigente, 10000000),
      distancia = decimal(f.distanciaMunicipio50000)
    const rural = poblacion <= 2500 || (poblacion <= 10000 && distancia.gt(30))
    const rama = anos < 36
    return parcial(
      acceso && rama
        ? D.min(
            aPagos(c, f.pagos).times(rural ? "0.20" : "0.15"),
            new D(rural ? 612 : 500).times(parte)
          )
        : new D(0),
      [
        "Vivienda habitual CLM y NIF arrendador; titularidad con renta/territorio elegible (no excluir titulares por analogía con art.13.4); concurrencia de varios contratos/techos anuales y requisitos propios de la variante. La deducción joven no importa prorrateo diario de9bis/9ter/9quater/9quinquies.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AAlquilerDacion = Schema.Struct({
  inicio: Schema.String,
  fin: Schema.String,
  titularesConDerecho: Schema.Array(Schema.String),
  pagos: Schema.Array(APago),
  minimoDescendientes: AMagnitud,
  eleccion: Schema.Literals(["esta", "otra_incompatible"]),
  deudaAntes: Schema.String,
  deudaCancelada: Schema.String,
  deudaDespues: Schema.String,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_arrendamiento_dacion_pago: subcálculo por hechos; véase matriz63. */
export function alquilerDacion(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AAlquilerDacion, datos)

    const dias = aDias(f.inicio, f.fin),
      parte = proporcion(c, f.titularesConDerecho)
    const base = decimal(c.baseGeneral, true)
      .plus(decimal(c.baseAhorro, true))
      .minus(aAnual(c, f.minimoDescendientes, "minimo_descendientes"))
    const acceso =
      base.lte(c.modalidad === "individual" ? 12500 : 25000) &&
      f.eleccion === "esta"
    const antes = decimal(f.deudaAntes),
      cancelada = decimal(f.deudaCancelada),
      despues = decimal(f.deudaDespues)
    if (!antes.eq(cancelada.plus(despues))) fallo("Deuda de dación incoherente")
    const rama = antes.gt(0) && despues.eq(0)
    return parcial(
      acceso && rama
        ? D.min(
            aPagos(c, f.pagos).times("0.15"),
            new D(500).times(dias).div(365).times(parte)
          )
        : new D(0),
      [
        "Vivienda habitual CLM y NIF arrendador; titularidad con renta/territorio elegible (no excluir titulares por analogía con art.13.4); concurrencia de varios contratos/techos anuales y requisitos propios de la variante.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AAlquilerNumerosa = Schema.Struct({
  inicio: Schema.String,
  fin: Schema.String,
  titularesConDerecho: Schema.Array(Schema.String),
  pagos: Schema.Array(APago),
  minimoDescendientes: AMagnitud,
  eleccion: Schema.Literals(["esta", "otra_incompatible"]),
  tituloInicio: Schema.String,
  tituloFin: Schema.String,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_arrendamiento_familias_numerosas: subcálculo por hechos; véase matriz63. */
export function alquilerNumerosa(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AAlquilerNumerosa, datos)

    const dias = aDias(f.inicio, f.fin),
      parte = proporcion(c, f.titularesConDerecho)
    const base = decimal(c.baseGeneral, true)
      .plus(decimal(c.baseAhorro, true))
      .minus(aAnual(c, f.minimoDescendientes, "minimo_descendientes"))
    const acceso =
      base.lte(c.modalidad === "individual" ? 12500 : 25000) &&
      f.eleccion === "esta"
    aDias(f.tituloInicio, f.tituloFin)
    const rama = f.tituloInicio <= "2025-12-31" && f.tituloFin >= "2025-12-31"
    return parcial(
      acceso && rama
        ? D.min(
            aPagos(c, f.pagos).times("0.15"),
            new D(500).times(dias).div(365).times(parte)
          )
        : new D(0),
      [
        "Vivienda habitual CLM y NIF arrendador; titularidad con renta/territorio elegible (no excluir titulares por analogía con art.13.4); concurrencia de varios contratos/techos anuales y requisitos propios de la variante.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AAlquilerMonoparental = Schema.Struct({
  inicio: Schema.String,
  fin: Schema.String,
  titularesConDerecho: Schema.Array(Schema.String),
  pagos: Schema.Array(APago),
  minimoDescendientes: AMagnitud,
  eleccion: Schema.Literals(["esta", "otra_incompatible"]),
  estadoCivil: Schema.Literals(["separado", "sin_vinculo"]),
  hijosMinimoExclusivo: Schema.Array(Schema.String),
  alimentos: Schema.String,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_arrendamiento_familias_monoparentales: subcálculo por hechos; véase matriz63. */
export function alquilerMonoparental(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AAlquilerMonoparental, datos)

    const dias = aDias(f.inicio, f.fin),
      parte = proporcion(c, f.titularesConDerecho)
    const base = decimal(c.baseGeneral, true)
      .plus(decimal(c.baseAhorro, true))
      .minus(aAnual(c, f.minimoDescendientes, "minimo_descendientes"))
    const acceso =
      base.lte(c.modalidad === "individual" ? 12500 : 25000) &&
      f.eleccion === "esta"
    const hijos = identidades(f.hijosMinimoExclusivo)
    for (const id of hijos) aPersona(c, id, [c.contribuyente])
    const rama = decimal(f.alimentos).eq(0)
    return parcial(
      acceso && rama
        ? D.min(
            aPagos(c, f.pagos).times("0.15"),
            new D(500).times(dias).div(365).times(parte)
          )
        : new D(0),
      [
        "Vivienda habitual CLM y NIF arrendador; titularidad con renta/territorio elegible (no excluir titulares por analogía con art.13.4); concurrencia de varios contratos/techos anuales y requisitos propios de la variante.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AAlquilerDiscapacidad = Schema.Struct({
  inicio: Schema.String,
  fin: Schema.String,
  titularesConDerecho: Schema.Array(Schema.String),
  pagos: Schema.Array(APago),
  minimoDescendientes: AMagnitud,
  eleccion: Schema.Literals(["esta", "otra_incompatible"]),
  grado: Schema.Number,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_arrendamiento_personas_discapacidad: subcálculo por hechos; véase matriz63. */
export function alquilerDiscapacidad(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AAlquilerDiscapacidad, datos)

    const dias = aDias(f.inicio, f.fin),
      parte = proporcion(c, f.titularesConDerecho)
    const base = decimal(c.baseGeneral, true)
      .plus(decimal(c.baseAhorro, true))
      .minus(aAnual(c, f.minimoDescendientes, "minimo_descendientes"))
    const acceso =
      base.lte(c.modalidad === "individual" ? 12500 : 25000) &&
      f.eleccion === "esta"
    const rama = entero(f.grado, 100) >= 65
    return parcial(
      acceso && rama
        ? D.min(
            aPagos(c, f.pagos).times("0.15"),
            new D(500).times(dias).div(365).times(parte)
          )
        : new D(0),
      [
        "Vivienda habitual CLM y NIF arrendador; titularidad con renta/territorio elegible (no excluir titulares por analogía con art.13.4); concurrencia de varios contratos/techos anuales y requisitos propios de la variante.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ADonacionesCooperacion = Schema.Struct({
  pagos: Schema.Array(APago),
  baseLiquidable: AMagnitud,
  tipoEntidad: Schema.Literals(["entidad49_2002", "fundacion"]),
  fin: Schema.Literals(["cooperacion", "pobreza", "exclusion", "discapacidad"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_donaciones_cooperacion_lucha_pobreza_discapacidad: subcálculo por hechos; véase matriz63. */
export function donacionesCooperacion(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ADonacionesCooperacion, datos)

    const base = D.min(
      aPagos(c, f.pagos),
      aAnual(c, f.baseLiquidable, "base_liquidable_total").times("0.10")
    )
    return parcial(base.times("0.15"), [
      "Entidad arts.2–3 Ley49/2002 con fin específico/registro CLM; fundación con cuentas depositadas por orden del Protectorado. Certificación no se infiere de referencia.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const ADonacionesIdi = Schema.Struct({
  pagos: Schema.Array(APago),
  cuotaAutonomica: AMagnitud,
  destinatario: Schema.Literals([
    "jccm",
    "organismo_investigacion",
    "privada49_2002",
  ]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_donaciones_idi_innovacion_empresarial: subcálculo por hechos; véase matriz63. */
export function donacionesIdi(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ADonacionesIdi, datos)

    return parcial(
      D.min(
        aPagos(c, f.pagos).times("0.15"),
        aAnual(c, f.cuotaAutonomica, "cuota_integra_autonomica").times("0.10")
      ),
      [
        "Finalidad I+D+i del organismo o entidad privada; registro CLM y régimen49/2002 solo de privada; certificado particular.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AMecenazgoCultural = Schema.Struct({
  operaciones: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      fecha: Schema.String,
      modalidad: Schema.Literals(["bien", "conservacion", "fines_culturales"]),
      valor: Schema.String,
      creditoFiscal: Schema.Literals(["no", "si"]),
    })
  ),
  baseLiquidable: AMagnitud,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_donaciones_bienes_culturales_mecenazgo: subcálculo por hechos; véase matriz63. */
export function mecenazgoCultural(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AMecenazgoCultural, datos)

    unicos(f.operaciones.map((o) => texto(o.id)))
    let base = new D(0)
    for (const o of f.operaciones) {
      const dia = fecha(o.fecha),
        valor = decimal(o.valor)
      if (
        dia >= "2025-01-01" &&
        dia <= "2025-12-31" &&
        o.creditoFiscal === "no"
      )
        base = base.plus(valor)
    }
    return parcial(
      D.min(
        base,
        aAnual(c, f.baseLiquidable, "base_liquidable_total").times("0.10")
      ).times("0.15"),
      [
        "Valoración legal del bien (no cuota fiscal), inventario para bienes/obras; destinatario y Plan de Mecenazgo para fines culturales; aplicar versión anterior/posterior al 16-4 por operación, sin reconocimiento por referencia.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AInteresesPrimeraVivienda = Schema.Struct({
  nacimiento: Schema.String,
  tipoPrestamo: Schema.Literals(["variable", "fijo"]),
  pagosIntereses: Schema.Array(APago),
  maximaPropiedadAnterior: Schema.String,
  concurrencia12ter: Schema.Literals(["no", "si"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_intereses_primera_vivienda_menores_40: subcálculo por hechos; véase matriz63. */
export function interesesPrimeraVivienda(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AInteresesPrimeraVivienda, datos)

    const anos = edad(f.nacimiento),
      propiedad = aPorcentaje(f.maximaPropiedadAnterior),
      pagado = aPagos(c, f.pagosIntereses)
    if (f.concurrencia12ter === "si")
      fallo("Reserva delimitada: concurrencia arts.12/12ter")
    const tope = renta(c, 12500, 25000) ? 150 : renta(c, 27000, 36000) ? 100 : 0
    return parcial(
      anos < 40 && f.tipoPrestamo === "variable" && propiedad.lt("0.5")
        ? D.min(tope, pagado)
        : new D(0),
      [
        "Primera vivienda habitual y préstamo con destino de adquisición conforme a conceptos estatales2012; historia de titularidad y concurrencia reservada solo12/12ter.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AResidenciaRural = Schema.Struct({
  categoria: Schema.Literals([
    "intensa",
    "extrema",
    "riesgo",
    "intermedia_agricola",
  ]),
  poblacionAnual: Schema.Number,
  poblacion2021: Schema.Number,
  municipioIntermedio: Schema.String,
  perdida2016_2021: Schema.String,
  cuotaAutonomica: AMagnitud,
  exhaustividad: Schema.Literals(["completa"]),
  zonaSanitariaPadron: Schema.String,
  zonaSanitariaAtencion: Schema.String,
  escolares: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      localidadReferencia: Schema.String,
      localidadCentro: Schema.String,
    })
  ),
})

/** clm_residencia_zonas_rurales: subcálculo por hechos; véase matriz63. */
export function residenciaRural(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AResidenciaRural, datos)

    const actual = entero(f.poblacionAnual, 10000000),
      anterior = entero(f.poblacion2021, 10000000)
    const poblacion = Math.min(actual, anterior)
    let tasa = "0"
    if (f.categoria === "intermedia_agricola") {
      if (!AMunicipiosIntermedios.includes(f.municipioIntermedio))
        fallo("No pertenece a los25 municipios del acuerdo")
      if (poblacion < 2000 && decimal(f.perdida2016_2021).gt(0)) tasa = "0.15"
    } else if (poblacion < 5000)
      tasa =
        f.categoria === "extrema"
          ? poblacion < 2000
            ? "0.25"
            : "0.20"
          : f.categoria === "intensa"
            ? poblacion < 2000
              ? "0.20"
              : "0.15"
            : poblacion < 2000
              ? "0.15"
              : "0.10"
    unicos(f.escolares.map((e) => texto(e.id)))
    texto(f.zonaSanitariaPadron)
    texto(f.zonaSanitariaAtencion)
    const estancia =
      f.zonaSanitariaPadron === f.zonaSanitariaAtencion &&
      f.escolares.every(
        (e) => texto(e.localidadReferencia) === texto(e.localidadCentro)
      )
    return parcial(
      aAnual(c, f.cuotaAutonomica, "cuota_integra_autonomica")
        .times(tasa)
        .times(estancia ? 1 : 0),
      [
        "Clasificación Decreto108/2021, estancia efectiva y salvaguarda del padrón2021; intermedias solo25 municipios/DA6, sin extender a adquisición o traslado.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AViviendaRural = Schema.Struct({
  fechaOperacion: Schema.String,
  categoria: Schema.Literals(["intensa", "extrema", "riesgo", "intermedia"]),
  poblacionFiscal: Schema.Number,
  pagos: Schema.Array(APago),
  coste: Schema.String,
  ayudaJccm: Schema.String,
  baseConsumidaAnterior: AMagnitud,
  porcentajePropiedad: Schema.String,
  concurrencia12: Schema.Literals(["no", "si"]),
  exhaustividad: Schema.Literals(["completa"]),
  vivienda: Schema.String,
})

/** clm_adquisicion_rehabilitacion_vivienda_zonas_rurales: subcálculo por hechos; véase matriz63. */
export function viviendaRural(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AViviendaRural, datos)

    const dia = fecha(f.fechaOperacion),
      poblacion = entero(f.poblacionFiscal, 10000000),
      parte = aPorcentaje(f.porcentajePropiedad)
    if (f.concurrencia12 === "si")
      fallo("Reserva delimitada de concurrencia12/12ter")
    const limite = D.max(
      0,
      D.min(180000, decimal(f.coste).minus(decimal(f.ayudaJccm)))
        .times(parte)
        .minus(
          aAnual(
            c,
            f.baseConsumidaAnterior,
            "base_historica_vivienda:" + texto(f.vivienda)
          )
        )
    )
    const base = D.min(12000, limite, aPagos(c, f.pagos))
    return parcial(
      dia >= "2021-01-01" &&
        dia <= "2025-12-31" &&
        ["intensa", "extrema"].includes(f.categoria) &&
        poblacion < 5000
        ? base.times("0.15")
        : new D(0),
      [
        "Salvaguarda municipal2021, pleno dominio/habitualidad, rehabilitación estructural, patrimonio, inversiones previas y ganancia exenta reinvertida; historial total por vivienda.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ATrasladoLaboral = Schema.Struct({
  fechaTraslado: Schema.String,
  categoria: Schema.Literals(["intensa", "extrema", "riesgo", "intermedia"]),
  causa: Schema.Literals(["trabajo", "actividad", "otra"]),
  baseLiquidableInicial: AMagnitud,
  cuotaTrabajoActividad: AMagnitud,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_traslado_vivienda_habitual: subcálculo por hechos; véase matriz63. */
export function trasladoLaboral(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ATrasladoLaboral, datos)

    const dia = fecha(f.fechaTraslado),
      base = aAnual(
        c,
        f.baseLiquidableInicial,
        "base_liquidable_inicio_periodo",
        true
      ),
      cuota = aAnual(
        c,
        f.cuotaTrabajoActividad,
        "cuota_autonomica_trabajo_actividad"
      )
    return parcial(
      dia >= "2024-01-01" &&
        dia <= "2025-12-31" &&
        ["intensa", "extrema"].includes(f.categoria) &&
        f.causa !== "otra" &&
        base.lt(c.modalidad === "individual" ? 22946 : 31485)
        ? D.min(500, cuota)
        : new D(0),
      [
        "Residencia y motivo laboral efectivos; permanencia año inicial y tres siguientes, excepciones/regularización, importe por contribuyente de conjunta.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AInversionMercantil = Schema.Struct({
  pagos: Schema.Array(APago),
  participacionFamiliarMaxima: Schema.String,
  domicilioSocial: Schema.Literals(["clm", "fuera"]),
  domicilioFiscal: Schema.Literals(["clm", "fuera"]),
  direccionEjecutiva: Schema.Literals(["no", "si"]),
  otraDeduccionMismaInversion: Schema.Literals(["no", "si"]),
  fechaEscritura: Schema.String,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_inversion_acciones_participaciones_mercantiles: subcálculo por hechos; véase matriz63. */
export function inversionMercantil(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AInversionMercantil, datos)

    const participacion = aPorcentaje(f.participacionFamiliarMaxima)
    fecha(f.fechaEscritura)
    if (f.otraDeduccionMismaInversion === "si")
      fallo("Inversión incompatible con la otra vía12sexies/12septies")
    return parcial(
      participacion.lte("0.4") &&
        f.domicilioSocial === "clm" &&
        f.domicilioFiscal === "clm" &&
        f.direccionEjecutiva === "no"
        ? D.min(4000, aPagos(c, f.pagos).times("0.20"))
        : new D(0),
      [
        "Formas societarias legales, actividad no patrimonial; constitución/ampliación, empleo24meses e incremento de plantilla; tres años inversión y sin funciones ejecutivas.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AInversionEconomiaSocial = Schema.Struct({
  pagos: Schema.Array(APago),
  participacionFamiliarMaxima: Schema.String,
  domicilioSocial: Schema.Literals(["clm", "fuera"]),
  domicilioFiscal: Schema.Literals(["clm", "fuera"]),
  otraDeduccionMismaInversion: Schema.Literals(["no", "si"]),
  fechaEscritura: Schema.String,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_inversion_economia_social: subcálculo por hechos; véase matriz63. */
export function inversionEconomiaSocial(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AInversionEconomiaSocial, datos)

    const participacion = aPorcentaje(f.participacionFamiliarMaxima)
    fecha(f.fechaEscritura)
    if (f.otraDeduccionMismaInversion === "si")
      fallo("Inversión incompatible con la otra vía12sexies/12septies")
    return parcial(
      participacion.lte("0.4") &&
        f.domicilioSocial === "clm" &&
        f.domicilioFiscal === "clm"
        ? D.min(4000, aPagos(c, f.pagos).times("0.20"))
        : new D(0),
      [
        "Entidad art.5 Ley5/2011 versión2025; empleo completo RGSS, aportación y requisitos cinco años; parentesco hasta tercero.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ACuentaVivienda = Schema.Struct({
  nacimiento: Schema.String,
  cuenta: Schema.String,
  fechaApertura: Schema.String,
  saldoInicio: Schema.String,
  saldoFin: Schema.String,
  deducidoAnterior: AMagnitud,
  cuentasAbiertas: Schema.Number,
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_ahorro_inversion_primera_vivienda: subcálculo por hechos; véase matriz63. */
export function cuentaVivienda(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ACuentaVivienda, datos)

    const anos = edad(f.nacimiento)
    texto(f.cuenta)
    const apertura = fecha(f.fechaApertura)
    const numero = entero(f.cuentasAbiertas, 100)
    const incremento = D.max(
      0,
      decimal(f.saldoFin).minus(decimal(f.saldoInicio))
    )
    const restante = D.max(
      0,
      new D(3000).minus(
        aAnual(
          c,
          f.deducidoAnterior,
          "deducciones_cuenta_anteriores:" + f.cuenta
        )
      )
    )
    return parcial(
      anos <= 36 &&
        numero === 1 &&
        apertura <= "2025-12-31" &&
        renta(c, 27000, 36000)
        ? D.min(750, restante, incremento.times("0.15"))
        : new D(0),
      [
        "Cuenta separada única e incremento nuevo (reposición de retiradas no vuelve a deducir), destino primera vivienda CLM en6años, historia de propiedad, muerte y regularización.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const APerrosAsistencia = Schema.Struct({
  pagos: Schema.Array(APago),
  inicioTenencia: Schema.String,
  finTenencia: Schema.String,
  subvenciones: Schema.String,
  clase: Schema.Literals(["guia", "servicio", "senal", "aviso", "tea"]),
  vinculacion: Schema.Literals(["clm", "otra_comunidad"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** clm_controles_veterinarios_perros_asistencia: subcálculo por hechos; véase matriz63. */
export function perrosAsistencia(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(APerrosAsistencia, datos)

    aDias(f.inicioTenencia, f.finTenencia)
    const ayudas = decimal(f.subvenciones)
    for (const p of f.pagos) {
      const dia = fecha(p.fecha)
      if (dia < f.inicioTenencia || dia > f.finTenencia)
        fallo("Pago fuera de tenencia")
    }
    return parcial(
      ayudas.eq(0) && renta(c, 27000, 36000)
        ? D.min(100, aPagos(c, f.pagos).times("0.30"))
        : new D(0),
      [
        "Tratamientos obligatorios, veterinario autorizado, factura y reconocimiento material del vínculo/clase legal; exclusiones de Ley5/2018.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}
