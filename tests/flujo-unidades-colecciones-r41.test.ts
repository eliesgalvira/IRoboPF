import { expect, test } from "vitest"
import dimensions from "../docs/procedencia/revisiones/flujo-ss-r39-sol/dimensiones-rojo.json"
import collections from "../docs/procedencia/revisiones/flujo-rentas-r40-sol/colecciones.json"
import { composeSS } from "../scripts/procedencia/flujo-ss-r36.mjs"
import { composeRentasR36 } from "../scripts/procedencia/flujo-rentas-r36.mjs"

const ss = composeSS()
const rentas = composeRentasR36()

// Expectativas externas de las revisiones: unidades de valores, no del nombre
// de una propiedad. El contrato completo se contrasta aparte con la interfaz TS.
for (const row of dimensions.rows.filter(r => r.id !== "obtenerParametrosCotizacionLegacy")) {
  test("SS39 dimensión de " + row.id, () => {
    const actual = [...ss.fieldUnits, ...ss.literalUnits].find(r => r.id === row.id)
    expect(actual?.unit).toBe(row.expected)
  })
}

test("SS39 parámetros conservan categorías, lados y variantes de solidaridad", () => {
  const result = ss.unitContracts.find(c => c.id === "obtenerParametrosCotizacionLegacy")?.result
  expect(result).toBe("{baseMaxima:EUR,tiposSeguridadSocial:record<categoria,{empresarial:ratio,trabajador:ratio}>,mei:{empresarial:ratio,trabajador:ratio},solidaridad:{_tag:SinSolidaridad}|{_tag:ConSolidaridad,tipoPrimerExceso:ratio,tipoSegundoExceso:ratio,tipoExcesoRestante:ratio}}")
})

for (const row of collections.filter(r => r.staticEffect)) {
  test("RR40 colección, callback y semilla de " + row.id, () => {
    const actual = rentas.collections.find(r => r.id === row.id)
    expect(actual?.receiver).toBe(row.actualReceiver)
    expect(actual?.callback).toBe(row.actualCallback)
    expect(actual?.seed).toBe(row.actualSeed)
  })
}

test("las llamadas nativas conservan sus argumentos", () => {
  for (const row of collections.filter(r => !r.staticEffect)) {
    const actual = rentas.collections.find(r => r.id === row.id)
    expect(actual?.receiver).toBe(row.actualReceiver)
    expect(actual?.callback).toBe(row.actualCallback)
    expect(actual?.seed).toBe(row.actualSeed)
  }
})

test("las cuotas MEI y sus tipos escalares conservan dimensiones distintas", () => {
  const amounts = ss.fieldUnits.filter(r => r.key === "meiEmpresarial" || r.key === "meiTrabajador")
  expect(amounts.length).toBeGreaterThan(0)
  expect(amounts.every(r => r.unit === "EUR")).toBe(true)
  const ratios = ss.fieldUnits.filter(r => r.key === "trabajador" && !dimensions.rows.some(d => d.id === r.id))
  expect(ratios.length).toBeGreaterThan(0)
  expect(ratios.every(r => r.unit === "ratio")).toBe(true)
  expect(ss.literalUnits.filter(r => r.value === 0 && r.source.file.endsWith("rendimientos-trabajo.ts")).map(r => r.unit)).toEqual(["centimos"])
})

test("la corrección documental no habilita admisión ni publicación", () => {
  expect(ss.sites.every(s => !s.admissionClosed && !s.siteClosed)).toBe(true)
  expect(ss.wiringAllowed).toBe(false)
  expect(rentas.wiringAllowed).toBe(false)
  expect(ss.completeRuleAcceptance).toBe(false)
  expect(rentas.completeRuleAcceptance).toBe(false)
})
