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

export const Trabajo = Schema.Struct({
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
export const Partos = Schema.Struct({
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
export const Escolar = Schema.Struct({
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
export const Ela = Schema.Struct({
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

function entero(v: number, max: number): number {
  if (!Number.isInteger(v) || v < 0 || v > max) fallo("Entero fuera de rango")
  return v
}
function edad(nacimiento: string): number {
  const dia = fecha(nacimiento)
  if (dia > "2025-12-31") fallo("Nacimiento posterior al devengo")
  return 2025 - Number(dia.slice(0, 4))
}
const ARegimenExt = Schema.Struct({
  poblacion: Schema.Number,
  familia: Schema.Literals(["ordinaria", "numerosa", "dos_hijos"]),
  hijosExclusivos: Schema.Array(Schema.String),
  estadoCivil: Schema.Literals(["casado", "separado", "sin_vinculo"]),
  alimentos: Schema.String,
})
type ARegimenExt = typeof ARegimenExt.Type
function aRentaExt(
  c: Contexto,
  f: ARegimenExt,
  individual: number,
  conjunta: number
): boolean {
  const poblacion = entero(f.poblacion, 10000000),
    hijos = identidades(f.hijosExclusivos, true),
    alimentos = decimal(f.alimentos)
  for (const id of hijos) aPersona(c, id, [c.contribuyente])
  const familiar =
    f.familia === "numerosa" ||
    (f.familia === "dos_hijos" &&
      hijos.length === 2 &&
      f.estadoCivil !== "casado" &&
      alimentos.eq(0))
  if (f.familia === "dos_hijos" && !familiar)
    fallo("Excepción12bis con hechos familiares contradictorios")
  return (
    (poblacion < 3000 && familiar) ||
    renta(
      c,
      poblacion < 3000 ? 28000 : individual,
      poblacion < 3000 ? 45000 : conjunta
    )
  )
}

const AAcogimientoMenoresExt = Schema.Struct({
  personas: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      nacimiento: Schema.String,
      inicio: Schema.String,
      fin: Schema.String,
      regimen: Schema.Literals([
        "permanente",
        "preadoptivo_transitorio",
        "temporal_legal",
      ]),
      titulares: Schema.Array(Schema.String),
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_acogimiento_menores: subcálculo por hechos; véase matriz63. */
export function acogimientoMenoresExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AAcogimientoMenoresExt, datos)

    unicos(f.personas.map((p) => texto(p.id)))
    let total = new D(0)
    for (const p of f.personas) {
      aPersona(c, p.id, p.titulares)
      if (fecha(p.inicio) < fecha(p.nacimiento))
        fallo("Convivencia anterior al nacimiento")
      const dias = aDias(p.inicio, p.fin),
        anos = edad(p.nacimiento)
      if (anos < 18)
        total = total.plus(
          aParte(c, p.titulares).times(dias >= 183 ? 250 : dias >= 91 ? 125 : 0)
        )
    }
    return parcial(total, [
      "Régimen legal y transición del acogimiento; reparto individual solo matrimonio/pareja para la misma persona, no cualquier lista. Sin límite propio de renta.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const AViudedadExt = Schema.Struct({
  regimen: Schema.Struct({
    poblacion: Schema.Number,
    familia: Schema.Literals(["ordinaria", "numerosa", "dos_hijos"]),
    hijosExclusivos: Schema.Array(Schema.String),
    estadoCivil: Schema.Literals(["casado", "separado", "sin_vinculo"]),
    alimentos: Schema.String,
  }),
  estadoCivil: Schema.Literals(["viudo", "otro"]),
  condenaFirme: Schema.Literals(["no", "si"]),
  eleccion: Schema.Literals(["viudedad", "trabajo"]),
  descendientes: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      rentasTotales: Schema.String,
      titularesMinimo: Schema.Array(Schema.String),
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_contribuyentes_viudos: subcálculo por hechos; véase matriz63. */
export function viudedadExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AViudedadExt, datos)

    unicos(f.descendientes.map((h) => h.id))
    let incremento = false
    for (const h of f.descendientes) {
      aPersona(c, h.id, h.titularesMinimo)
      if (
        decimal(h.rentasTotales, true).eq(0) &&
        h.titularesMinimo.includes(c.contribuyente)
      )
        incremento = true
    }
    return parcial(
      f.estadoCivil === "viudo" &&
        f.condenaFirme === "no" &&
        f.eleccion === "viudedad" &&
        aRentaExt(c, f.regimen, 19000, 24000)
        ? new D(incremento ? 200 : 100)
        : new D(0),
      [
        "Viudedad efectiva, condena por violencia contra fallecido, mínimo/ausencia de toda renta y título familiar de12bis; elección por persona, compatible con trabajo de otro declarante.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ACuidadoDiscapacidadExt = Schema.Struct({
  regimen: Schema.Struct({
    poblacion: Schema.Number,
    familia: Schema.Literals(["ordinaria", "numerosa", "dos_hijos"]),
    hijosExclusivos: Schema.Array(Schema.String),
    estadoCivil: Schema.Literals(["casado", "separado", "sin_vinculo"]),
    alimentos: Schema.String,
  }),
  personas: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      grado: Schema.Number,
      resolucion: Schema.Literals([
        "ninguna",
        "curatela_representativa",
        "incapacidad_judicial",
      ]),
      inicioConvivencia: Schema.String,
      finConvivencia: Schema.String,
      rentasIncluidasExentas: Schema.String,
      obligacionPatrimonio: Schema.Literals(["no", "si"]),
      dependenciaReconocida: Schema.String,
      dependenciaCobrada: Schema.String,
      titularesMismoGradoElegibles: Schema.Array(Schema.String),
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_cuidado_familiares_discapacidad: subcálculo por hechos; véase matriz63. */
export function cuidadoDiscapacidadExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ACuidadoDiscapacidadExt, datos)

    unicos(f.personas.map((p) => texto(p.id)))
    let total = new D(0)
    for (const p of f.personas) {
      aPersona(c, p.id, p.titularesMismoGradoElegibles)
      const grado = entero(p.grado, 100),
        dias = aDias(p.inicioConvivencia, p.finConvivencia),
        rentaPersona = decimal(p.rentasIncluidasExentas, true)
      const reconocida = decimal(p.dependenciaReconocida),
        cobrada = decimal(p.dependenciaCobrada)
      if (
        (grado >= 65 || p.resolucion !== "ninguna") &&
        dias >= 183 &&
        rentaPersona.lte(16800) &&
        p.obligacionPatrimonio === "no"
      )
        total = total.plus(
          proporcion(c, p.titularesMismoGradoElegibles).times(
            reconocida.gt(0) && cobrada.eq(0) ? 220 : 150
          )
        )
    }
    return parcial(aRentaExt(c, f.regimen, 19000, 24000) ? total : new D(0), [
      "Parentesco de grado más cercano, convivencia continua y facultad del certificador; obligaciónIP por cuota/activos, no presentación voluntaria. Titulares elegibles excluyen de renta los ajenos y no simples convivientes.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const ACuidadoHasta14Ext = Schema.Struct({
  regimen: Schema.Struct({
    poblacion: Schema.Number,
    familia: Schema.Literals(["ordinaria", "numerosa", "dos_hijos"]),
    hijosExclusivos: Schema.Array(Schema.String),
    estadoCivil: Schema.Literals(["casado", "separado", "sin_vinculo"]),
    alimentos: Schema.String,
  }),
  hijos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      nacimiento: Schema.String,
      titularesMinimo: Schema.Array(Schema.String),
    })
  ),
  pagosUnidad: Schema.Array(APago),
  ayudas: Schema.String,
  modalidadServicio: Schema.Literals(["empleado_alta", "centro_autorizado"]),
  progenitoresActividad: Schema.Array(Schema.String),
  progenitoresAlta: Schema.Array(Schema.String),
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_cuidado_hijos_hasta_14: subcálculo por hechos; véase matriz63. */
export function cuidadoHasta14Ext(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ACuidadoHasta14Ext, datos)

    unicos(f.hijos.map((h) => h.id))
    let acceso = f.hijos.length > 0
    const activos = identidades(f.progenitoresActividad),
      altas = identidades(f.progenitoresAlta)
    for (const h of f.hijos) {
      aPersona(c, h.id, h.titularesMinimo)
      if (edad(h.nacimiento) > 14) acceso = false
      if (
        h.titularesMinimo.some(
          (id) => !activos.includes(id) || !altas.includes(id)
        )
      )
        fallo("Actividad y alta simultáneas incompletas")
    }
    if (f.pagosUnidad.some((p) => !activos.includes(texto(p.pagador))))
      fallo("Pagador ajeno a progenitores de la unidad de gasto")
    const todos = aPagos(c, f.pagosUnidad, false),
      propios = aPagos(c, f.pagosUnidad),
      neto = aNeto(todos, f.ayudas)
    const parte = todos.eq(0) ? new D(0) : propios.div(todos)
    return parcial(
      acceso && aRentaExt(c, f.regimen, 28000, 45000)
        ? D.min(400, neto.times("0.10")).times(parte)
        : new D(0),
      [
        "Unidad de convivencia completa, simultaneidad de actividad/alta durante pagos, mínimo, centro/factura/empleado; hijos de edades distintas requieren asignación por hijo y meses14.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AViviendaJovenExt = Schema.Struct({
  regimen: Schema.Struct({
    poblacion: Schema.Number,
    familia: Schema.Literals(["ordinaria", "numerosa", "dos_hijos"]),
    hijosExclusivos: Schema.Array(Schema.String),
    estadoCivil: Schema.Literals(["casado", "separado", "sin_vinculo"]),
    alimentos: Schema.String,
  }),
  nacimiento: Schema.String,
  via: Schema.Literals(["joven", "victima", "sucesor"]),
  poblacionVivienda: Schema.Number,
  pagosSinIntereses: Schema.Array(APago),
  maximaPropiedadAnterior: Schema.String,
  tipo: Schema.Literals(["nueva_protegida", "nueva_libre", "usada"]),
  eleccion: Schema.Literals(["esta", "rural11bis"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_vivienda_jovenes_victimas_terrorismo: subcálculo por hechos; véase matriz63. */
export function viviendaJovenExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AViviendaJovenExt, datos)

    const anos = edad(f.nacimiento),
      poblacion = entero(f.poblacionVivienda, 10000000),
      propiedad = aPorcentaje(f.maximaPropiedadAnterior)
    const rural = poblacion < 3000,
      base = D.min(9040, aPagos(c, f.pagosSinIntereses))
    return parcial(
      (anos < 36 || f.via !== "joven") &&
        propiedad.lt("0.5") &&
        (f.tipo === "nueva_protegida" || (rural && f.tipo === "nueva_libre")) &&
        f.eleccion === "esta" &&
        aRentaExt(c, f.regimen, 19000, 24000)
        ? base.times(rural ? "0.05" : "0.03")
        : new D(0),
      [
        "Primera/nueva/habitual y protección salvo rural, víctimas/sucesores legales; patrimonio y conceptos2012 sin antigüedad pre2013; base sin intereses, no ocultar reinversión/historia.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AAlquilerExt = Schema.Struct({
  regimen: Schema.Struct({
    poblacion: Schema.Number,
    familia: Schema.Literals(["ordinaria", "numerosa", "dos_hijos"]),
    hijosExclusivos: Schema.Array(Schema.String),
    estadoCivil: Schema.Literals(["casado", "separado", "sin_vinculo"]),
    alimentos: Schema.String,
  }),
  nacimiento: Schema.String,
  grado: Schema.Number,
  resolucion: Schema.Literals([
    "ninguna",
    "curatela_representativa",
    "incapacidad_judicial",
  ]),
  itp: Schema.Literals(["pagado", "exento_presentado", "pendiente"]),
  derechoInversionVivienda: Schema.Literals(["no", "si"]),
  distanciasOtrasViviendasUnidad: Schema.Array(Schema.String),
  contratos: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      poblacion: Schema.Number,
      titulares: Schema.Array(Schema.String),
      pagos: Schema.Array(APago),
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_arrendamiento_vivienda_habitual: subcálculo por hechos; véase matriz63. */
export function alquilerExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AAlquilerExt, datos)

    const anos = edad(f.nacimiento),
      grado = entero(f.grado, 100)
    unicos(f.contratos.map((p) => texto(p.id)))
    unicos(f.contratos.flatMap((p) => p.pagos.map((x) => x.id)))
    const otra = f.distanciasOtrasViviendasUnidad.some((d) => decimal(d).lt(75))
    let total = new D(0)
    for (const p of f.contratos) {
      const rural = entero(p.poblacion, 10000000) < 3000,
        parte = proporcion(c, p.titulares)
      total = total.plus(
        D.min(
          aPagos(c, p.pagos).times("0.30"),
          parte.times(rural ? 1500 : 1000)
        )
      )
    }
    const familia = f.regimen.familia !== "ordinaria"
    return parcial(
      (anos < 36 || grado >= 65 || f.resolucion !== "ninguna" || familia) &&
        !otra &&
        f.itp !== "pendiente" &&
        f.derechoInversionVivienda === "no" &&
        aRentaExt(c, f.regimen, 28000, 45000)
        ? D.min(1500, total)
        : new D(0),
      [
        "Unidad familiar82 y todas sus propiedades/usos, titularidad de contrato, ocupación/habitualidad y alternativa familiar legal; edad en conjunta de cónyuge/padre/madre; composición de varios contratos con techos prorrateados.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AArrendadoresVaciasExt = Schema.Struct({
  viviendas: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      diasVaciaAntes: Schema.Number,
      inicioContrato: Schema.String,
      finContrato: Schema.String,
      rendimientoNetoReducido: AMagnitud,
      destino: Schema.Literals(["habitual", "otro"]),
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_arrendadores_viviendas_vacias: subcálculo por hechos; véase matriz63. */
export function arrendadoresVaciasExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AArrendadoresVaciasExt, datos)

    unicos(f.viviendas.map((v) => texto(v.id)))
    if (f.viviendas.length > 3)
      fallo(
        "Más de tres viviendas: identificar selección elegible, no escoger automáticamente"
      )
    let total = new D(0)
    for (const v of f.viviendas) {
      const dias = entero(v.diasVaciaAntes, 10000)
      aDias(v.inicioContrato, v.finContrato)
      const rendimiento = aAnual(
        c,
        v.rendimientoNetoReducido,
        "rendimiento_neto_reducido_vivienda:" + v.id,
        true
      )
      const meses =
        (Number(v.finContrato.slice(0, 4)) -
          Number(v.inicioContrato.slice(0, 4))) *
          12 +
        Number(v.finContrato.slice(5, 7)) -
        Number(v.inicioContrato.slice(5, 7)) -
        (v.finContrato.slice(8, 10) < v.inicioContrato.slice(8, 10) ? 1 : 0)
      if (v.inicioContrato.endsWith("02-29"))
        fallo(
          "Aniversario contractual29feb requiere fecha civil pactada particular"
        )
      if (dias >= 365 && meses >= 36 && v.destino === "habitual")
        total = total.plus(D.max(0, rendimiento))
    }
    return parcial(D.min(1200, total), [
      "Un año desocupada con imputación de renta, capital inmobiliario (no actividad), contrato al menos3años y comprobación/regularización; garajes/trasteros no son otras viviendas.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const ARehabilitacionAlquilerExt = Schema.Struct({
  pagos: Schema.Array(APago),
  costeRehabilitacion: Schema.String,
  baseHistorica: AMagnitud,
  porcentajePropiedad: Schema.String,
  ayudaReconocida: Schema.String,
  diasRequisitos: Schema.Number,
  parentesco: Schema.Number,
  actividadEconomica: Schema.Literals(["no", "si"]),
  ubicacion: Schema.Literals([
    "municipio_menor3000",
    "nucleo_censo9quater",
    "fuera",
  ]),
  exhaustividad: Schema.Literals(["completa"]),
  vivienda: Schema.String,
})

/** extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler: subcálculo por hechos; véase matriz63. */
export function rehabilitacionAlquilerExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ARehabilitacionAlquilerExt, datos)

    if (decimal(f.ayudaReconocida).gt(0))
      fallo(
        "Ayuda de rehabilitación: falta separar importe atribuible al titular, ejercicio de imputación y base histórica; no equivale a deducción cero"
      )
    const parte = aPorcentaje(f.porcentajePropiedad),
      limite = D.max(
        0,
        D.min(180000, decimal(f.costeRehabilitacion).times(parte)).minus(
          aAnual(
            c,
            f.baseHistorica,
            "base_historica_vivienda:" + texto(f.vivienda)
          )
        )
      ),
      dias = entero(f.diasRequisitos, 365),
      parentesco = entero(f.parentesco, 20)
    const base = D.min(9040, limite, aPagos(c, f.pagos))
    return parcial(
      f.actividadEconomica === "no" &&
        f.ubicacion !== "fuera" &&
        (parentesco === 0 || parentesco > 3)
        ? base.times("0.15").times(dias).div(365)
        : new D(0),
      [
        "Rehabilitación IVA y territorio/censo solo9ter, cinco años, oferta/vacancia por causa ajena y precioINE; base histórica por vivienda/titular, reparto distinto de coste acreditable y efectos de subvención posterior.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AInversionMercantilExt = Schema.Struct({
  pagos: Schema.Array(APago),
  participacionFamiliarMaxima: Schema.String,
  domicilioSocial: Schema.Literals(["extremadura", "fuera"]),
  domicilioFiscal: Schema.Literals(["extremadura", "fuera"]),
  direccionEjecutiva: Schema.Literals(["no", "si"]),
  baseEstatalMismaInversion: AMagnitud,
  fechaEscritura: Schema.String,
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_inversion_acciones_participaciones_mercantiles: subcálculo por hechos; véase matriz63. */
export function inversionMercantilExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AInversionMercantilExt, datos)

    fecha(f.fechaEscritura)
    const participacion = aPorcentaje(f.participacionFamiliarMaxima),
      base = D.max(
        0,
        aPagos(c, f.pagos).minus(
          aAnual(c, f.baseEstatalMismaInversion, "base_estatal_misma_inversion")
        )
      )
    return parcial(
      participacion.lte("0.4") &&
        f.domicilioSocial === "extremadura" &&
        f.domicilioFiscal === "extremadura" &&
        f.direccionEjecutiva === "no"
        ? D.min(4000, base.times("0.20"))
        : new D(0),
      [
        "Formas societarias, actividad no patrimonial/excepcionesIP, empleo diferenciado en constitución/ampliación, escritura, grupo familiar y tres años. Base estatal identificada por inversión, sin duplicarla.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AViviendaRuralExt = Schema.Struct({
  fechaOperacion: Schema.String,
  poblacion: Schema.Number,
  porcentajePropiedad: Schema.String,
  coste: Schema.String,
  ayudasJunta: Schema.String,
  baseHistorica: AMagnitud,
  pagos: Schema.Array(APago),
  eleccion: Schema.Literals(["rural", "art8", "intereses11quater"]),
  exhaustividad: Schema.Literals(["completa"]),
  vivienda: Schema.String,
})

/** extremadura_vivienda_zonas_rurales: subcálculo por hechos; véase matriz63. */
export function viviendaRuralExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AViviendaRuralExt, datos)

    if (decimal(f.ayudasJunta).gt(0))
      fallo(
        "Ayuda de vivienda: falta separar importe total, atribución al titular e imputación anual antes de calcular la base neta"
      )
    const dia = fecha(f.fechaOperacion),
      poblacion = entero(f.poblacion, 10000000),
      parte = aPorcentaje(f.porcentajePropiedad)
    if (dia >= "2022-01-01" && dia <= "2022-03-21")
      fallo("Reserva delimitada11bis.1.b; no decidir por retroactividad")
    const techo = D.max(
      0,
      D.min(180000, D.max(0, decimal(f.coste).minus(decimal(f.ayudasJunta))))
        .times(parte)
        .minus(
          aAnual(
            c,
            f.baseHistorica,
            "base_historica_vivienda:" + texto(f.vivienda)
          )
        )
    )
    return parcial(
      dia >= "2022-03-22" &&
        dia <= "2025-12-31" &&
        poblacion < 3000 &&
        f.eleccion === "rural"
        ? D.min(9040, techo, aPagos(c, f.pagos)).times("0.10")
        : new D(0),
      [
        "Pleno dominio/habitualidad, rehabilitación estructural y patrimonio; inversiones previas y solo ganancia exenta reinvertida; máximo total por vivienda según propiedad, sin límite propio de renta.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AResidenciaRuralExt = Schema.Struct({
  residentes: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      poblacion: Schema.Number,
      baseLiquidableIndividual: AMagnitud,
    })
  ),
  cuotaAutonomica: AMagnitud,
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_residencia_municipios_menos_3000: subcálculo por hechos; véase matriz63. */
export function residenciaRuralExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AResidenciaRuralExt, datos)

    unicos(f.residentes.map((p) => texto(p.id)))
    const ids = identidades(c.declarantes)
    if (
      f.residentes.length !== ids.length ||
      f.residentes.some((p) => !ids.includes(p.id))
    )
      fallo("Bases individuales no exhaustivas de la conjunta")
    let todas = new D(0),
      elegibles = new D(0)
    for (const p of f.residentes) {
      const poblacion = entero(p.poblacion, 10000000),
        base = aAnual(
          c,
          p.baseLiquidableIndividual,
          "base_liquidable_individual:" + p.id
        )
      todas = todas.plus(base)
      if (poblacion < 3000) elegibles = elegibles.plus(base)
    }
    if (c.modalidad === "conjunta" && todas.eq(0))
      fallo("Denominador conjunto cero: no inferir reparto de cuota")
    const parte =
      c.modalidad === "individual"
        ? new D(entero(f.residentes[0].poblacion, 10000000) < 3000 ? 1 : 0)
        : elegibles.div(todas)
    return parcial(
      renta(c, 28000, 45000)
        ? aAnual(c, f.cuotaAutonomica, "cuota_integra_autonomica")
            .times("0.15")
            .times(parte)
        : new D(0),
      [
        "Residencia efectiva municipio/ELM, no censo9quater; sin excepción familiar12bis; bases liquidables individuales de todos los declarantes y su trazabilidad anual.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const AInteresesJovenExt = Schema.Struct({
  nacimiento: Schema.String,
  pagosIntereses: Schema.Array(APago),
  maximaPropiedadAnterior: Schema.String,
  eleccion: Schema.Literals(["intereses", "rural11bis"]),
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_intereses_vivienda_jovenes: subcálculo por hechos; véase matriz63. */
export function interesesJovenExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(AInteresesJovenExt, datos)

    const anos = edad(f.nacimiento),
      propiedad = aPorcentaje(f.maximaPropiedadAnterior)
    return parcial(
      anos < 36 &&
        propiedad.lt("0.5") &&
        f.eleccion === "intereses" &&
        renta(c, 28000, 45000)
        ? D.min(1000, aPagos(c, f.pagosIntereses)).times("0.25")
        : new D(0),
      [
        "Intereses hipotecarios efectivos para primera vivienda/habitualidad; patrimonio2012, compatible8 e incompatible11bis, sin excepción rural familiar12bis.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ADonativosExt = Schema.Struct({
  donaciones: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      fecha: Schema.String,
      importe: Schema.String,
      destino: Schema.Literals(["cultura", "deportista"]),
      domicilio: Schema.Literals(["extremadura", "fuera"]),
      parentesco: Schema.Literals([
        "ninguno",
        "conyuge",
        "pareja",
        "ascendiente",
        "descendiente",
      ]),
      participacionFamiliar: Schema.String,
      irrevocabilidad: Schema.Literals(["irrevocable", "revocable"]),
    })
  ),
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_donaciones_entidades_culturales_deportistas: subcálculo por hechos; véase matriz63. */
export function donativosExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    contexto(entrada)
    const f = decodificar(ADonativosExt, datos)

    unicos(f.donaciones.map((d) => texto(d.id)))
    let total = new D(0)
    for (const d of f.donaciones) {
      const dia = fecha(d.fecha),
        dinero = decimal(d.importe),
        participacion = aPorcentaje(d.participacionFamiliar)
      const vinculo =
        d.destino === "deportista"
          ? d.parentesco === "ninguno"
          : participacion.lt("0.5")
      if (
        dia >= "2025-01-01" &&
        dia <= "2025-12-31" &&
        d.domicilio === "extremadura" &&
        d.irrevocabilidad === "irrevocable" &&
        vinculo
      )
        total = total.plus(dinero)
    }
    return parcial(D.min(500, total.times("0.20")), [
      "Actividades culturales legales/desarrollo territorial y relación socio/grupo; deportista profesional por cuenta propia21.2; escrito, comunicación solo cultura con excepción24.2 y sin reconocimiento por referencia.",
      "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
    ])
  })
}

const ATrasladoExt = Schema.Struct({
  fechaTraslado: Schema.String,
  nacimiento: Schema.String,
  personaTrasladada: Schema.String,
  basesIndividuales: Schema.Array(
    Schema.Struct({ id: Schema.String, base: AMagnitud })
  ),
  cuotaAutonomica: AMagnitud,
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_traslado_residencia_habitual: subcálculo por hechos; véase matriz63. */
export function trasladoExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ATrasladoExt, datos)

    const dia = fecha(f.fechaTraslado),
      anos = edad(f.nacimiento)
    texto(f.personaTrasladada)
    if (dia < f.nacimiento) fallo("Traslado anterior al nacimiento")
    const ids = identidades(c.declarantes)
    unicos(f.basesIndividuales.map((p) => texto(p.id)))
    if (
      f.basesIndividuales.length !== ids.length ||
      f.basesIndividuales.some((p) => !ids.includes(p.id)) ||
      !ids.includes(f.personaTrasladada)
    )
      fallo("Historia de declarantes/bases incompleta")
    const propia = f.basesIndividuales.find((p) => p.id === f.personaTrasladada)
    if (propia === undefined) fallo("Falta base del trasladado")
    const basePropia = aAnual(
      c,
      propia.base,
      "base_liquidable_individual:" + propia.id,
      true
    )
    const mayor = f.basesIndividuales.every((p) =>
      aAnual(c, p.base, "base_liquidable_individual:" + p.id, true).lte(
        basePropia
      )
    )
    return parcial(
      dia >= "2025-01-01" &&
        dia <= "2025-12-31" &&
        (c.modalidad === "individual" || mayor)
        ? aAnual(c, f.cuotaAutonomica, "cuota_integra_autonomica").times(
            anos < 36 ? "0.75" : "0.50"
          )
        : new D(0),
      [
        "Traslado fiscalart72 de comunidades distintas, residente de mayor base en conjunta y permanencia3años; empates requieren individualización, regularización/excepciones; no calcula ejercicios2026/27.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}

const ASubvencionesElaExt = Schema.Struct({
  concedida: Schema.String,
  cobrada: Schema.String,
  integradaBaseGeneral: AMagnitud,
  integradaBaseLiquidable: AMagnitud,
  tipoMedioEstatal: AMagnitud,
  tipoMedioAutonomico: AMagnitud,
  cuotaAutonomica: AMagnitud,
  exhaustividad: Schema.Literals(["completa"]),
})

/** extremadura_ayudas_subvenciones_ela: subcálculo por hechos; véase matriz63. */
export function subvencionesElaExt(
  entrada: Schema.Json,
  datos: Schema.Json
): ResultadoHechos {
  return ejecutar(() => {
    const c = contexto(entrada)
    const f = decodificar(ASubvencionesElaExt, datos)

    const concedida = decimal(f.concedida),
      cobrada = decimal(f.cobrada),
      general = aAnual(
        c,
        f.integradaBaseGeneral,
        "ayuda_ela_integrada_base_general"
      ),
      liquidable = aAnual(
        c,
        f.integradaBaseLiquidable,
        "ayuda_ela_integrada_base_liquidable"
      ),
      estatal = aAnual(c, f.tipoMedioEstatal, "tipo_medio_estatal"),
      autonomico = aAnual(c, f.tipoMedioAutonomico, "tipo_medio_autonomico"),
      cuota = aAnual(c, f.cuotaAutonomica, "cuota_integra_autonomica")
    if (
      cobrada.gt(concedida) ||
      general.gt(cobrada) ||
      liquidable.gt(general) ||
      estatal.gt(100) ||
      autonomico.gt(100)
    )
      fallo("Cadena concesión/cobro/integración o tipos incoherente")
    return parcial(
      D.min(cuota, liquidable.times(estatal.plus(autonomico)).div(100)),
      [
        "Ayuda pública autonómica ELA e imputación del cobro, integración y reducciones anuales; suelo del art.12 tras concurrencias se aplica en anual, no sumar esta fórmula dos veces.",
        "Cuota autonómica disponible y composición anual pendientes; subcálculo sin aceptación fiscal.",
      ]
    )
  })
}
