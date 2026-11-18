import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { analizarMadrid, type EntradaAnalisisMadrid } from "../lib/dominio/irpf/analisis-madrid/analizar"
import originales from "../docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json"

const D = Decimal.clone({ precision: 80 })
const hechos = {
  metodoIpc: "ipc-diciembre-producto-tasas-1decimal-legacy-v1", ejercicio: 2025, edad: 40,
  alcance: "madrid-individual-empleo-anual-sin-otras-rentas-familia-discapacidad-especialidades",
  ssTrabajador: { naturaleza: "efectivas", importe: "1000", ejercicio: 2025, procedencia: "supuesto-sintetico", operacion: "ss-anual" },
  ssEmpresa: { naturaleza: "estimadas-perfil-uniforme" }, retenciones: "100",
} as const
function calcular(e: EntradaAnalisisMadrid) {
  const r = analizarMadrid(e)
  if (r.estado !== "calculado") throw new Error(r.motivo)
  return r
}
it("nominal observado conserva céntimos exactos comunes sin inversión IPC", () => {
  const r = calcular({ ...hechos, brutoNominalObservadoEUR: "20747.49" })
  expect(r.modoBruto).toBe("nominal-observado")
  expect([r.X.bruto,r.I.bruto,r.Hdecimal.bruto]).toEqual(["20747.49","20747.49","20747.49"])
  expect(r.residuoBruto).toBe("0")
  expect(r.Hcontractual.estado).toBe("disponible")
  if (r.Hcontractual.estado === "disponible") {
    expect(new D(r.Hcontractual.Q).eq(originales[0]!.casillas["0595"])).toBe(true)
  }
  const real = calcular({ ...hechos, brutoBaseEUR2018: "20747.49" })
  expect(real.modoBruto).toBe("base-real-constante")
  expect(real.Hdecimal.bruto).not.toBe(r.Hdecimal.bruto)
})
it("rechaza modos ausentes, simultáneos y nominal sin céntimos", () => {
  for (const input of [hechos, { ...hechos, brutoBaseEUR2018: "1", brutoNominalObservadoEUR: "1" }, { ...hechos, brutoNominalObservadoEUR: "20747.491" }]) {
    // SAFETY: entradas inválidas deliberadas para probar la validación de frontera.
    expect(analizarMadrid(input as EntradaAnalisisMadrid).estado).toBe("no-disponible")
  }
})
it("coste y cuñas declaran denominador y rama, con SS empresarial estimada", () => {
  const r = calcular({ ...hechos, brutoNominalObservadoEUR: "20747.49" })
  expect(r.cotizaciones.empresa.naturaleza).toBe("estimadas-perfil-uniforme")
  expect(r.coste).toBe(new D("20747.49").plus(r.cotizaciones.empresaEUR!).toFixed())
  expect(r.cuna).toBe(r.cunaHdecimal)
  for (const nombre of ["X","I","Hdecimal"] as const) {
    const numerador = new D(r.cotizaciones.empresaEUR!).plus("1000").plus(r[nombre].Q)
    expect(r.cunas[nombre]).toBe(numerador.div(r.coste!).toFixed())
  }
  const estimada = calcular({ ...hechos, brutoNominalObservadoEUR: "20747.49", ssTrabajador: { naturaleza: "estimadas-perfil-uniforme" } })
  expect(estimada.Hcontractual.estado).toBe("no-disponible")
  expect(estimada.cunas.Hcontractual).toBeNull()
})
it("Hdecimal expone parámetros usados y ruta legal concreta sin promover snapshot", () => {
  const r = calcular({ ...hechos, brutoNominalObservadoEUR: "20747.49" })
  const lineas = r.rastro.filter(x => x.instanceId.startsWith("Hdecimal:"))
  expect(JSON.stringify(lineas)).not.toContain('"selector-anual"')
  expect(lineas.every(l => l.adendaLegal.endsWith("/2025") && l.snapshotPromovido === false)).toBe(true)
  expect(lineas.find(l => l.operacion === "art20")?.operandos).toMatchObject({ parametros: { formula: expect.stringContaining("2364.34") } })
  expect(lineas.find(l => l.operacion === "DA61")?.operandos).toMatchObject({ parametros: { maximo: "340", umbral: "16576" } })
})
