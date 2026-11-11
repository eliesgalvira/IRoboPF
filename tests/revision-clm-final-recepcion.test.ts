// Recepción inicial conservada por valor fuera de post; adaptación sólo al contrato final.
import { expect, it } from "vitest"
import { Effect } from "effect"
import original from "./fixtures/clm-vivienda-agregada-original.json"
import { entrada, ejecutar, sobre, producir, igual, salario24 } from "./fixtures/revision-clm-final"

const adversos: readonly [string, (x: ReturnType<typeof entrada>) => void][] = [
  ["R3 original: certificado duplicado, sin reparar libro", x => {
    const h = x.aplicacionViviendaCLM2024
    h.trabajo.rendimientos[0]!.integro = "17000"
    h.certificados[0]!.integro = "17000"
    h.trabajo.rendimientos.push({ ...structuredClone(h.trabajo.rendimientos[0]!), id: "r-duplicado" })
    h.certificados.push({ ...structuredClone(h.certificados[0]!), rendimiento: "r-duplicado" })
  }],
  ["original: insuficiencia exacta, mutación sin reparar libro", x => {
    x.aplicacionViviendaCLM2024.trabajo.rendimientos[0]!.integro = "21487.50"
    x.aplicacionViviendaCLM2024.certificados[0]!.integro = "21487.50"
  }],
  ["original: falta aplicación original", x => { x.historiaBases.aplicaciones = [] }],
  ["original: titular original", x => { x.historiaBases.aplicaciones[0]!.titular = "otro" }],
  ["original: soporte económico duplicado", x => {
    x.historiaBases.operaciones[1]!.documento = structuredClone(x.historiaBases.operaciones[0]!.documento)
    x.historiaBases.operaciones[1]!.documento.fecha = "2025-01-02"
  }],
]
for (const api of ["canonica", "explicita"] as const) {
  it(api + ": positivo inicial conserva racional exacto", () => {
    const x = entrada(), r = Effect.runSync(ejecutar(api, x))
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, "1499997/2000")
    expect(x.historiaBases.aplicaciones[0]!.estado).toBe("aplicacion-no-reconstruida")
  })
  it(api + ": positivo inicial cuota suficiente un céntimo por encima", () => {
    const r = Effect.runSync(ejecutar(api, salario24("21487.59")))
    igual(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado, "1499997/2000")
  })
  for (const [nombre, mutar] of adversos) it(api + ": " + nombre, () => {
    const x = entrada(); mutar(x)
    const r = Effect.runSync(Effect.flip(ejecutar(api, x)))
    expect(r._tag).toBe("ResultadoNoSoportado"); expect("importe" in r).toBe(false)
  })
  it(api + ": insuficiencia exacta original, con libro bancario coherente", () => {
    const r = Effect.runSync(Effect.flip(ejecutar(api, salario24("21487.50"))))
    expect(r._tag).toBe("ResultadoNoSoportado")
    expect(r.motivo).toMatch(/cuota insuficiente/)
  })
  it(api + ": R2 original edad80 incompatible, sin sanear adverso", () => {
    const x = entrada()
    x.aplicacionViviendaCLM2024.trabajo.rendimientos[0]!.integro = "21487.59"
    x.aplicacionViviendaCLM2024.certificados[0]!.integro = "21487.59"
    const r = Effect.runSync(Effect.flip(ejecutar(api, x, 80)))
    expect(r._tag).toBe("ResultadoNoSoportado")
    expect(r.motivo).toMatch(/nacimiento y edades/)
  })
  it(api + ": R1 original raw aggregate sigue rechazado", () => {
    const x = structuredClone(original)
    x.aplicacionViviendaCLM2024.patrimonio2025.inicioSinRevalorizaciones = "0"
    x.aplicacionViviendaCLM2024.patrimonio2025.finSinRevalorizaciones = "4999.99"
    expect(() => ejecutar(api, x)).toThrow()
  })
}
it("R1 aislada: agregados con identidad y financiación final tampoco son contrato factual", () => {
  const x = entrada(), { patrimonioHistorico, ...h } = x.aplicacionViviendaCLM2024
  expect(patrimonioHistorico.version).toBe("clm-patrimonio-factual-2024-2025-v1")
  expect(() => sobre({ solicitudes: [{ ...x, aplicacionViviendaCLM2024: { ...h,
    patrimonio2024: original.aplicacionViviendaCLM2024.patrimonio2024,
    patrimonio2025: { ...original.aplicacionViviendaCLM2024.patrimonio2025,
      inicioSinRevalorizaciones: "0", finSinRevalorizaciones: "4999.99" } } }] })).toThrow()
})
it("original: no inferir base de cuota monetaria ni mutar estado", () => {
  const x = entrada(), r = producir(x)
  expect(r.baseAplicada2024).toBe("10000.01")
  expect(r.cuotaGenerada2024).toBe("1500.0015")
  expect(r.cuotaEfectiva2024).toBe("1500.00")
  expect(x.historiaBases.aplicaciones[0]!.estado).toBe("aplicacion-no-reconstruida")
})
