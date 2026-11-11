import { beforeAll, expect, it } from "vitest"
import { Effect } from "effect"
import Decimal from "decimal.js"
import { createHash } from "node:crypto"
// Integridad de la fixture local, sin operación fiscal ni servicio de aplicación.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readFileSync } from "node:fs"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { galiciaInversion, solicitudGalicia } from "./galicia-alquiler-inversion.fixtures"

// Misma primera revisión, GRANT0: preparado, jamás ejecutado en esta entrega.
// 42 vectores originales de PRUEBAS.json; 84 tests. No se cambian sus esperados.
// Fixture fijada por contenido; una desviación exige delta explícito, no regenerar expected.
beforeAll(() => {
  const bytes = readFileSync(new URL("./galicia-alquiler-inversion.fixtures.ts", import.meta.url))
  expect(createHash("sha256").update(bytes).digest("hex")).toBe("7613d93ef8e2e7008d5fef382c4a78917ac6f0e5910417ab6903ffacc7ee1844")
})

type Racional = { readonly numeradorEuros: string; readonly divisor: string }
function esperarRacional(actual: Racional | undefined, esperado: Racional): void {
  if (actual === undefined) throw new Error("Falta el racional calculado")
  expect(BigInt(actual.divisor)).toBeGreaterThan(0n)
  expect(BigInt(esperado.divisor)).toBeGreaterThan(0n)
  expect(BigInt(actual.numeradorEuros) * BigInt(esperado.divisor))
    .toBe(BigInt(esperado.numeradorEuros) * BigInt(actual.divisor))
}

// BI se publica como Decimal de precisión80, no como racional.
// Se conserva el cociente original como expected y sólo se proyecta éste a80
// cifras significativas, HALF_UP. No se redondea actual ni se admite epsilon.
const OraculoDecimal = Decimal.clone({ precision: 200, rounding: Decimal.ROUND_HALF_UP })
function esperarDecimal80(actual: Decimal, esperado: Racional): void {
  const proyectado = new OraculoDecimal(esperado.numeradorEuros)
    .div(esperado.divisor).toSignificantDigits(80, Decimal.ROUND_HALF_UP)
  expect(actual.toString()).toBe(proyectado.toString())
}

// Sólo estrecha la unión de la fixture; no añade validación fiscal.
function hechosAlquiler(c: ReturnType<typeof galiciaInversion>) {
  const h = solicitudGalicia(c).hechos
  if (h.codigo !== "galicia_alquiler_vivienda_habitual") throw new Error("Fixture ajena a Galicia alquiler")
  return h
}

const ejecutar = (api: "uniforme" | "explicita", c: ReturnType<typeof galiciaInversion>) =>
  api === "uniforme" ? liquidarIrpfAnual(c, { modo: "canonico" }) : liquidarIrpfAnualExplicito(c)

for (const api of ["uniforme", "explicita"] as const) {
  it(`${api}: R01-principal-no-gasto`, () => {
    const c = galiciaInversion(true, "30000", false)
    const esperado = {"BI": {"numeradorEuros": "1050840", "divisor": "73"}, "amortizacion": {"numeradorEuros": "88320", "divisor": "73"}, "imputacion": {"numeradorEuros": "0", "divisor": "1"}, "generado": {"numeradorEuros": "300", "divisor": "1"}, "aplicado": {"numeradorEuros": "300", "divisor": "1"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    esperarRacional({ numeradorEuros: String(r.inmuebles[0]!.amortizacion.n), divisor: String(r.inmuebles[0]!.amortizacion.d) }, esperado.amortizacion)
    esperarRacional({ numeradorEuros: String(r.imputacion.n), divisor: String(r.imputacion.d) }, esperado.imputacion)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.generado, esperado.generado)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.total, esperado.aplicado)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.aplicado, esperado.aplicado)
  })

  it(`${api}: R02-principal-9000-misma-BI`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "importe": "9000" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "totalFactura": "9000" })
    Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { "importe": "9000" })
    const esperado = {"BI": {"numeradorEuros": "1050840", "divisor": "73"}, "amortizacion": {"numeradorEuros": "88320", "divisor": "73"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    esperarRacional({ numeradorEuros: String(r.inmuebles[0]!.amortizacion.n), divisor: String(r.inmuebles[0]!.amortizacion.d) }, esperado.amortizacion)
  })

  it(`${api}: R03-intereses-1000`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "clase": "intereses" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "importe": "1000" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "totalFactura": "1000" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "fechaOperacion": "2025-07-01" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "fechaFactura": "2025-07-01" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "fechaPago": "2025-07-01" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "periodoDevengo": {"desde": "2025-07-01", "hasta": "2025-12-31"} })
    Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { "importe": "1000" })
    Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { "fecha": "2025-07-01" })
    const esperado = {"BI": {"numeradorEuros": "1014340", "divisor": "73"}, "gastosLimitados": {"numeradorEuros": "1000", "divisor": "1"}, "amortizacion": {"numeradorEuros": "88320", "divisor": "73"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    esperarRacional({ numeradorEuros: String(r.inmuebles[0]!.gastosLimitados.n), divisor: String(r.inmuebles[0]!.gastosLimitados.d) }, esperado.gastosLimitados)
    esperarRacional({ numeradorEuros: String(r.inmuebles[0]!.amortizacion.n), divisor: String(r.inmuebles[0]!.amortizacion.d) }, esperado.amortizacion)
  })

  it(`${api}: R04-intereses-600`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "clase": "intereses" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "importe": "600" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "totalFactura": "600" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "fechaOperacion": "2025-07-01" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "fechaFactura": "2025-07-01" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "fechaPago": "2025-07-01" })
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "periodoDevengo": {"desde": "2025-07-01", "hasta": "2025-12-31"} })
    Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { "importe": "600" })
    Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { "fecha": "2025-07-01" })
    const esperado = {"BI": {"numeradorEuros": "1028940", "divisor": "73"}, "gastosLimitados": {"numeradorEuros": "600", "divisor": "1"}, "amortizacion": {"numeradorEuros": "88320", "divisor": "73"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    esperarRacional({ numeradorEuros: String(r.inmuebles[0]!.gastosLimitados.n), divisor: String(r.inmuebles[0]!.gastosLimitados.d) }, esperado.gastosLimitados)
    esperarRacional({ numeradorEuros: String(r.inmuebles[0]!.amortizacion.n), divisor: String(r.inmuebles[0]!.amortizacion.d) }, esperado.amortizacion)
  })

  it(`${api}: R05-mejora-julio`, () => {
    const c = galiciaInversion(true, "30000", true)
    const esperado = {"amortizacion": {"numeradorEuros": "89424", "divisor": "73"}, "BI": {"numeradorEuros": "1050288", "divisor": "73"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarRacional({ numeradorEuros: String(r.inmuebles[0]!.amortizacion.n), divisor: String(r.inmuebles[0]!.amortizacion.d) }, esperado.amortizacion)
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
  })

  it(`${api}: R06-mejora-octubre`, () => {
    const c = galiciaInversion(true, "30000", true)
    Object.assign(c.inmuebles[0]!.gastos[1]!, { "puestaEnServicio": "2025-10-01" })
    const esperado = {"amortizacion": {"numeradorEuros": "88872", "divisor": "73"}, "BI": {"numeradorEuros": "1050564", "divisor": "73"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarRacional({ numeradorEuros: String(r.inmuebles[0]!.amortizacion.n), divisor: String(r.inmuebles[0]!.amortizacion.d) }, esperado.amortizacion)
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
  })

  it(`${api}: R07-limite-inferior`, () => {
    const c = galiciaInversion(false, "46399.98", false)
    const esperado = {"BI": {"numeradorEuros": "2199999", "divisor": "100"}, "generado": {"numeradorEuros": "300", "divisor": "1"}, "aplicado": {"numeradorEuros": "300", "divisor": "1"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.generado, esperado.generado)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.total, esperado.aplicado)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.aplicado, esperado.aplicado)
  })

  it(`${api}: R08-limite-inclusivo`, () => {
    const c = galiciaInversion(false, "46400", false)
    const esperado = {"BI": {"numeradorEuros": "22000", "divisor": "1"}, "generado": {"numeradorEuros": "300", "divisor": "1"}, "aplicado": {"numeradorEuros": "300", "divisor": "1"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.generado, esperado.generado)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.total, esperado.aplicado)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.aplicado, esperado.aplicado)
  })

  it(`${api}: R09-limite-superado`, () => {
    const c = galiciaInversion(false, "46400.02", false)
    const esperado = {"BI": {"numeradorEuros": "2200001", "divisor": "100"}, "generado": {"numeradorEuros": "0", "divisor": "1"}, "aplicado": {"numeradorEuros": "0", "divisor": "1"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.generado, esperado.generado)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.total, esperado.aplicado)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.aplicado, esperado.aplicado)
  })

  it(`${api}: R10-cuota-cero`, () => {
    const c = galiciaInversion(true, "3000", false)
    const esperado = {"BI": {"numeradorEuros": "65340", "divisor": "73"}, "generado": {"numeradorEuros": "300", "divisor": "1"}, "aplicado": {"numeradorEuros": "0", "divisor": "1"}, "numeroAplicaciones": 1, "cuotaPosterior": {"numeradorEuros": "0", "divisor": "1"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.generado, esperado.generado)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.total, esperado.aplicado)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.aplicado, esperado.aplicado)
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(esperado.numeroAplicaciones)
    esperarDecimal80(r.composicion.cuotaPosterior, esperado.cuotaPosterior)
  })

  it(`${api}: R11-contrato-anterior-DT38`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.contrato, { "firma": "2023-05-25" })
    const esperado = {"BI": {"numeradorEuros": "840672", "divisor": "73"}, "regimen": "DT38-60"}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    expect(r.inmuebles[0]!.regimen).toBe(esperado.regimen)
  })

  it(`${api}: R12-contrato-nuevo`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.contrato, { "firma": "2023-05-26" })
    const esperado = {"BI": {"numeradorEuros": "1050840", "divisor": "73"}, "regimen": "art23-50"}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    expect(r.inmuebles[0]!.regimen).toBe(esperado.regimen)
  })

  it(`${api}: R13-adquisicion-pre2013-no-veto`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.adquisicion, { "fecha": "2010-01-01" })
    Object.assign(c.inmuebles[0]!.usosDesdeAdquisicion[0]!, { "desde": "2010-01-01" })
    Object.assign(c.inmuebles[0]!.cambioHabitual2025!.residencia, { "desde": "2010-01-01" })
    const esperado = {"BI": {"numeradorEuros": "1050840", "divisor": "73"}, "generado": {"numeradorEuros": "300", "divisor": "1"}, "sinDT18": true}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.generado, esperado.generado)
    expect(r.composicion.deduccionesTerritoriales2025!.viviendaDT182025 === undefined).toBe(esperado.sinDT18)
  })

  it(`${api}: R14-pago-alquiler-1000-no-rebaja-BI`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(hechosAlquiler(c).contratos[0]!.pagos[0]!, { "importe": "1000" })
    const esperado = {"BI": {"numeradorEuros": "1050840", "divisor": "73"}, "generado": {"numeradorEuros": "100", "divisor": "1"}, "aplicado": {"numeradorEuros": "100", "divisor": "1"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.generado, esperado.generado)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.total, esperado.aplicado)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.aplicado, esperado.aplicado)
  })

  it(`${api}: R15-edad36-no-derecho`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c, { "edad": 36 })
    Object.assign(solicitudGalicia(c), { "nacimientoContribuyente": "1989-01-01" })
    Object.assign(c.inmuebles[0]!.cambioHabitual2025!, { "nacimiento": "1989-01-01" })
    const esperado = {"BI": {"numeradorEuros": "1050840", "divisor": "73"}, "generado": {"numeradorEuros": "0", "divisor": "1"}, "aplicado": {"numeradorEuros": "0", "divisor": "1"}}
    const r = Effect.runSync(ejecutar(api, c))
    expect(r._tag).toBe("LiquidacionInmobiliariaP4a")
    esperarDecimal80(r.baseImponibleGeneral, esperado.BI)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.generado, esperado.generado)
    expect(r.composicion.deduccionesTerritoriales2025).toBeDefined()
    expect(r.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.total, esperado.aplicado)
    esperarRacional(r.composicion.deduccionesTerritoriales2025!.aplicaciones[0]!.aplicado, esperado.aplicado)
  })

  it(`${api}: R16-inventario-vacio`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(solicitudGalicia(c), { "inversionesViviendaEjercicio": [] })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R17-titular-inversion-ajeno`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { "titular": "otro" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R18-nacimiento-contradictorio`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.cambioHabitual2025!, { "nacimiento": "1989-01-01" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R19-nueva-habitual-otro-contrato`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.cambioHabitual2025!.nuevaHabitual, { "contrato": "otro" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R20-importe-distinto`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { "importe": "2999" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R21-fecha-distinta`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { "fecha": "2025-03-02" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R22-documento-distinto`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(solicitudGalicia(c).inversionesViviendaEjercicio[0]!, { "documento": "otro" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R23-duplicado-documento-renta-alquiler`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(hechosAlquiler(c).contratos[0]!.pagos[0]!, { "factura": "EXIGIBLE1" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R24-duplicado-operacion-renta-alquiler`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(hechosAlquiler(c).contratos[0]!.pagos[0]!, { "id": "R1" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R25-hueco-calendario`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.usosDesdeAdquisicion[0]!, { "hasta": "2025-06-29" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R26-solape-calendario`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.usosDesdeAdquisicion[0]!, { "hasta": "2025-07-01" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R27-fecha-imposible`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.contrato, { "desde": "2025-02-30" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R28-identidad-cedida-propia`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(hechosAlquiler(c).contratos[0]!, { "id": "C1" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R29-arrendador-propio`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(hechosAlquiler(c).contratos[0]!, { "arrendador": "s-1" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R30-pagador-ajeno`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(hechosAlquiler(c).contratos[0]!.pagos[0]!, { "pagador": "otro" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R31-intereses-personales`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.gastos[0]!, { "clase": "intereses" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R32-sin-renta-integrada`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c, { "otrasRentas": "trabajo" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R33-localizacion-ajena`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!, { "ubicacion": "illes-balears" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R34-edad-contradictoria`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c, { "edad": 34 })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R35-derecho-externo`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(hechosAlquiler(c), { "derechoInversionVivienda": "con_derecho" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R36-renuncia-externa`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(hechosAlquiler(c), { "eleccion": "no_aplicar" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R37-base-externa`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(hechosAlquiler(c), { "baseImponibleTotal": "22000" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R38-cuota-externa`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(hechosAlquiler(c), { "cuotaDisponible": "300" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R39-sin-calendario`, () => {
    const c = galiciaInversion(true, "30000", false)
    Reflect.deleteProperty(c.inmuebles[0]!, "cambioHabitual2025")
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R40-censo-inmueble-duplicado`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c, { "inmuebles": [...c.inmuebles, structuredClone(c.inmuebles[0]!)] })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R41-inversion-duplicada`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(solicitudGalicia(c), { "inversionesViviendaEjercicio": [...solicitudGalicia(c).inversionesViviendaEjercicio, structuredClone(solicitudGalicia(c).inversionesViviendaEjercicio[0]!)] })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

  it(`${api}: R42-renta-antes-cesion`, () => {
    const c = galiciaInversion(true, "30000", false)
    Object.assign(c.inmuebles[0]!.exigibilidades[0]!, { "fecha": "2025-06-30" })
    const esperado = {"resultado": "rechazo-controlado", "tags": ["RechazoP4a", "ResultadoNoSoportado"], "sinDefectos": ["TypeError", "ReferenceError", "Cannot read"]}
    const error = Effect.runSync(Effect.flip(ejecutar(api, c)))
    expect(esperado.resultado).toBe("rechazo-controlado")
    expect(esperado.tags).toContain(error._tag)
    expect(error).not.toHaveProperty("total")
    const detalle = String(error) + " " + JSON.stringify(error)
    for (const defecto of esperado.sinDefectos) expect(detalle).not.toContain(defecto)
  })

}
