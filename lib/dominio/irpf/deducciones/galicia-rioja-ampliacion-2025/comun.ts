import Decimal from "decimal.js"
const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
export type R = { readonly n: bigint; readonly d: bigint }
export type Exacto = {
  readonly numeradorCentimos: string
  readonly denominador: string
}
export function r(n: bigint, d = 1n): R {
  exige(d > 0n, "Denominador positivo requerido")
  let a = n < 0n ? -n : n
  let b = d
  while (b !== 0n) {
    const t = a % b
    a = b
    b = t
  }
  const g = a === 0n ? 1n : a
  return { n: n / g, d: d / g }
}
export const cero = r(0n)
export function mas(a: R, b: R): R {
  return r(a.n * b.d + b.n * a.d, a.d * b.d)
}
export function menos(a: R, b: R): R {
  return r(a.n * b.d - b.n * a.d, a.d * b.d)
}
export function por(a: R, n: number | bigint, d: number | bigint = 1): R {
  return r(a.n * BigInt(n), a.d * BigInt(d))
}
export function producto(a: R, b: R): R {
  return r(a.n * b.n, a.d * b.d)
}
export function compara(a: R, b: R): number {
  const n = a.n * b.d - b.n * a.d
  return n < 0n ? -1 : n > 0n ? 1 : 0
}
export function min(a: R, b: R): R {
  return compara(a, b) <= 0 ? a : b
}
export function max(a: R, b: R): R {
  return compara(a, b) >= 0 ? a : b
}
export function suma(v: readonly R[]): R {
  return v.reduce(mas, cero)
}
export function serial(a: R): Exacto {
  return { numeradorCentimos: a.n.toString(), denominador: a.d.toString() }
}
export function euros(v: string, firmado = false): R {
  exige(
    v.length <= 32 &&
      (firmado
        ? /^-?(0|[1-9]\d*)(\.\d{1,2})?$/
        : /^(0|[1-9]\d*)(\.\d{1,2})?$/
      ).test(v),
    "Importe monetario inválido"
  )
  return r(BigInt(new D(v).times(100).toFixed(0)))
}
export function presenta(v: R): string {
  // Redondear el racional en céntimos antes de dar formato: sin aproximación periódica.
  exige(v.n >= 0n, "Resultado negativo")
  const centimos = v.n / v.d + ((v.n % v.d) * 2n >= v.d ? 1n : 0n)
  return new D(centimos.toString()).div(100).toFixed(2)
}
export function exige(condicion: boolean, motivo: string): asserts condicion {
  if (!condicion) throw new Error(motivo)
}
export function texto(v: string): boolean {
  return v.trim().length > 0
}
export function id(v: string): boolean {
  return texto(v) && v === v.trim()
}
export function ids(v: readonly string[]): boolean {
  return v.every(id) && new Set(v).size === v.length
}
export function coleccion<T>(v: readonly T[]): boolean {
  return Array.isArray(v)
}
export function fecha(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false
  const y = Number(v.slice(0, 4)),
    m = Number(v.slice(5, 7)),
    d = Number(v.slice(8, 10))
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)
  return (
    y > 0 &&
    m >= 1 &&
    m <= 12 &&
    d >= 1 &&
    d <= (m === 2 ? (leap ? 29 : 28) : [4, 6, 9, 11].includes(m) ? 30 : 31)
  )
}
export function dia(v: string): number {
  exige(fecha(v), "Fecha civil inválida")
  let y = Number(v.slice(0, 4))
  const m = Number(v.slice(5, 7))
  const d = Number(v.slice(8, 10))
  y -= m <= 2 ? 1 : 0
  const era = Math.floor(y / 400),
    yoe = y - era * 400,
    mp = m + (m > 2 ? -3 : 9)
  return (
    era * 146097 +
    yoe * 365 +
    Math.floor(yoe / 4) -
    Math.floor(yoe / 100) +
    Math.floor((153 * mp + 2) / 5) +
    d -
    1
  )
}
export function moverMes(v: string, n: number): string {
  exige(fecha(v) && Number.isInteger(n), "Fecha/mes inválido")
  const total = Number(v.slice(0, 4)) * 12 + Number(v.slice(5, 7)) - 1 + n
  const y = Math.floor(total / 12),
    m = (total % 12) + 1
  let d = Number(v.slice(8, 10))
  let candidate = `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`
  while (!fecha(candidate) && d > 0) {
    d--
    candidate = `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`
  }
  exige(d > 0, "Desplazamiento de fecha fuera de rango")
  return candidate
}
export function edad(n: string, f = "2025-12-31"): number {
  exige(fecha(n) && fecha(f) && n <= f, "Nacimiento imposible")
  return (
    Number(f.slice(0, 4)) -
    Number(n.slice(0, 4)) -
    (f.slice(5) < n.slice(5) ? 1 : 0)
  )
}
export type Periodo = { readonly desde: string; readonly hasta: string }
export function periodo(p: Periodo): void {
  exige(
    fecha(p.desde) && fecha(p.hasta) && p.desde <= p.hasta,
    "Periodo inválido"
  )
}
export function cubre(p: Periodo, desde: string, hasta: string): boolean {
  periodo(p)
  exige(
    fecha(desde) && fecha(hasta) && desde <= hasta,
    "Periodo de referencia inválido"
  )
  return p.desde <= desde && p.hasta >= hasta
}
export function dias2025(v: readonly Periodo[]): number {
  const orden = [...v].sort((a, b) => a.desde.localeCompare(b.desde))
  let fin = ""
  let total = 0
  for (const p of orden) {
    periodo(p)
    exige(p.desde > fin, "Periodos solapados")
    fin = p.hasta
    const a = p.desde < "2025-01-01" ? "2025-01-01" : p.desde
    const b = p.hasta > "2025-12-31" ? "2025-12-31" : p.hasta
    if (a <= b) total += dia(b) - dia(a) + 1
  }
  return total
}
export type Documento = {
  readonly referencia: string
  readonly fecha: string
  readonly emisor: string
}
export function documento(d: Documento): void {
  exige(
    texto(d.referencia) && fecha(d.fecha) && id(d.emisor),
    "Documento sin identidad/fecha"
  )
}
export type Persona = {
  readonly id: string
  readonly nacimiento: string
  readonly discapacidad: number
}
export type ClaveAnual =
  | "baseImponibleTotal"
  | "minimoPersonalFamiliar"
  | "baseLiquidableGeneral"
  | "baseLiquidableAhorro"
  | "cuotaIntegraAutonomica"
  | "patrimonioInicialAjustado"
  | "patrimonioFinalAjustado"
  | "baseEstatalViviendaSinAdecuacion"
  | "baseConsumidaRehabilitacionAdecuacion"
  | "baseConsumidaAdquisicionSegunda"
  | "baseConsumidaViviendaMunicipios"
  | "cuotaElectricoConsumidaDeclaracion"
  | "mecenazgoConsumidoDeclaracion"
export type MagnitudAnual = {
  readonly clave: ClaveAnual
  readonly euros: string
  readonly ejercicio: 2025
  readonly declarantes: readonly string[]
  readonly nodoDerivacion: string
}
/** Contrato de resultados anuales derivables, no de deducciones consignadas. */
export type Contexto = {
  readonly ejercicio: 2025
  readonly territorio: "galicia" | "la-rioja"
  readonly titular: string
  readonly modalidad: "individual" | "conjunta"
  readonly declarantes: readonly string[]
  readonly personas: readonly Persona[]
  readonly magnitudes: readonly MagnitudAnual[]
  readonly expediente: "completo_todos_pagadores"
  readonly creditoMecenazgoRioja: "no_aplicado" | "aplicado"
}
export function contexto(
  c: Contexto,
  territorio: Contexto["territorio"]
): void {
  exige(
    c.ejercicio === 2025 &&
      c.territorio === territorio &&
      id(c.titular) &&
      ids(c.declarantes) &&
      c.declarantes.includes(c.titular) &&
      ["individual", "conjunta"].includes(c.modalidad) &&
      (c.modalidad !== "individual" || c.declarantes.length === 1) &&
      c.expediente === "completo_todos_pagadores",
    "Ámbito o exhaustividad inválidos"
  )
  exige(
    ids(c.personas.map((p) => p.id)) &&
      c.declarantes.every((t) => c.personas.some((p) => p.id === t)),
    "Identidades de declaración incompletas"
  )
  for (const p of c.personas)
    exige(
      id(p.id) &&
        edad(p.nacimiento) >= 0 &&
        Number.isFinite(p.discapacidad) &&
        p.discapacidad >= 0 &&
        p.discapacidad <= 100,
      "Persona inválida"
    )
  exige(ids(c.magnitudes.map((m) => m.clave)), "Magnitud anual duplicada")
  for (const m of c.magnitudes) magnitud(c, m.clave)
  exige(
    ["no_aplicado", "aplicado"].includes(c.creditoMecenazgoRioja),
    "Crédito fiscal desconocido"
  )
  if (territorio === "la-rioja")
    exige(
      c.creditoMecenazgoRioja === "no_aplicado",
      "Crédito de mecenazgo incompatible: resolver elección"
    )
}
export function magnitud(c: Contexto, k: ClaveAnual): R {
  const m = c.magnitudes.find((x) => x.clave === k)
  exige(m !== undefined, `Falta magnitud anual derivable: ${k}`)
  exige(
    m.ejercicio === 2025 &&
      texto(m.nodoDerivacion) &&
      ids(m.declarantes) &&
      m.declarantes.length === c.declarantes.length &&
      m.declarantes.every((t) => c.declarantes.includes(t)),
    `Magnitud ${k} de otro ámbito`
  )
  const valor = euros(m.euros, true)
  if (
    k.startsWith("cuota") ||
    k.includes("Consumid") ||
    k === "mecenazgoConsumidoDeclaracion" ||
    k === "minimoPersonalFamiliar" ||
    k === "baseEstatalViviendaSinAdecuacion"
  )
    exige(
      compara(valor, cero) >= 0,
      `Magnitud anual ${k} no puede ser negativa`
    )
  return valor
}
export function propia(c: Contexto): Persona {
  const p = c.personas.find((p) => p.id === c.titular)
  exige(p !== undefined, "Titular sin persona")
  return p
}
export function rentaRioja(c: Contexto): boolean {
  return (
    compara(
      magnitud(c, "baseLiquidableGeneral"),
      euros(c.modalidad === "individual" ? "18030" : "30050")
    ) <= 0 && compara(magnitud(c, "baseLiquidableAhorro"), euros("1800")) <= 0
  )
}
export function rentaGalicia(c: Contexto): R {
  return menos(
    magnitud(c, "baseImponibleTotal"),
    magnitud(c, "minimoPersonalFamiliar")
  )
}
export function reparto(t: readonly string[], c: Contexto): R {
  exige(
    ids(t) && t.length > 0 && t.includes(c.titular),
    "Titulares del derecho incompletos"
  )
  return r(1n, BigInt(t.length))
}
export type Pago = {
  readonly id: string
  readonly pagador: string
  readonly receptor: string
  readonly fecha: string
  readonly importe: string
  readonly factura: string
  readonly concepto: string
  readonly medio:
    | "transferencia"
    | "tarjeta"
    | "cheque"
    | "ingreso"
    | "instantaneo"
    | "efectivo"
  readonly subvencion: string
  readonly especieExenta: string
}
export function pagos(
  v: readonly Pago[],
  permitidos: readonly string[],
  efectivo = true,
  ventana: "ejercicio" | "hasta2025" = "ejercicio",
  tratamiento: "neto" | "satisfecho" = "neto"
): R {
  exige(coleccion(v) && ids(v.map((p) => p.id)), "Pagos ausentes/duplicados")
  const vistos = new Set<string>()
  let total = cero
  for (const p of v) {
    exige(
      id(p.pagador) &&
        id(p.receptor) &&
        p.pagador !== p.receptor &&
        fecha(p.fecha) &&
        texto(p.factura) &&
        texto(p.concepto),
      "Pago sin identidad/fecha/factura"
    )
    exige(
      [
        "transferencia",
        "tarjeta",
        "cheque",
        "ingreso",
        "instantaneo",
        "efectivo",
      ].includes(p.medio),
      "Medio de pago desconocido"
    )
    const key = JSON.stringify([p.receptor, p.factura, p.concepto])
    exige(
      !vistos.has(key),
      "Factura/concepto repetido; fraccionamiento requiere expediente específico"
    )
    vistos.add(key)
    const bruto = euros(p.importe),
      neto = menos(menos(bruto, euros(p.subvencion)), euros(p.especieExenta))
    exige(compara(neto, cero) >= 0, "Ayudas/especie superiores al gasto")
    if (
      (ventana === "hasta2025" || p.fecha >= "2025-01-01") &&
      p.fecha <= "2025-12-31" &&
      permitidos.includes(p.concepto) &&
      (efectivo || p.medio !== "efectivo")
    )
      total = mas(total, tratamiento === "neto" ? neto : bruto)
  }
  return total
}
export type Paso = {
  readonly hecho: string
  readonly regla: string
  readonly base: Exacto
  readonly resultado: Exacto
}
export type Saldo = {
  readonly inmueble: string
  readonly tipo: "base" | "cuota"
  readonly origen: number
  readonly caduca: number
  readonly importe: Exacto
  readonly condicion: string
}
export type Resultado =
  | { readonly estado: "no_soportado"; readonly motivos: readonly string[] }
  | {
      readonly estado: "calculo_parcial"
      readonly titular: string
      readonly ambito: "atribucion_titular_no_total_declaracion"
      readonly exacto: Exacto
      readonly presentacionEuros: string
      readonly rastro: readonly Paso[]
      readonly saldos: readonly Saldo[]
      readonly pendientes: readonly string[]
      readonly aceptacionFiscal: "pendiente"
    }
export function resultado(
  c: Contexto,
  v: R,
  rastro: readonly Paso[],
  pendientes: readonly string[] = [],
  saldos: readonly Saldo[] = []
): Resultado {
  return {
    estado: "calculo_parcial",
    titular: c.titular,
    ambito: "atribucion_titular_no_total_declaracion",
    exacto: serial(v),
    presentacionEuros: presenta(v),
    rastro,
    saldos,
    pendientes: [
      "Acreditación externa de documentos, vínculos y derechos particulares",
      ...pendientes,
    ],
    aceptacionFiscal: "pendiente",
  }
}
export function paso(hecho: string, regla: string, base: R, valor: R): Paso {
  return { hecho, regla, base: serial(base), resultado: serial(valor) }
}
export function proteger(run: () => Resultado): Resultado {
  try {
    return run()
  } catch (cause) {
    return {
      estado: "no_soportado",
      motivos: [cause instanceof Error ? cause.message : "Hechos inválidos"],
    }
  }
}

/** Cierra duplicados e identidades económicas antes de aplicar la regla particular.
 * Un tercero no identificado requiere atribución documental; no equivale a exclusión fiscal. */
export function conciliar(
  v: readonly Pago[],
  pagadores: readonly string[]
): void {
  exige(
    ids(v.map((p) => p.id)),
    "Pago duplicado entre elementos del expediente"
  )
  const facturas = new Set<string>()
  for (const p of v) {
    exige(
      pagadores.includes(p.pagador),
      "Pagador ajeno al expediente identificado: falta atribución económica particular"
    )
    const clave = JSON.stringify([p.receptor, p.factura, p.concepto])
    exige(!facturas.has(clave), "Factura/concepto duplicado entre elementos")
    facturas.add(clave)
  }
}
