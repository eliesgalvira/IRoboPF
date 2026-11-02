import { expect, it } from "vitest"
import { Effect } from "effect"
import {
  producirContratoMotor,
  verificarContratoMotor,
} from "../scripts/procedencia/contrato-motor-unico"
import { liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { calcularSalario } from "../lib/dominio/analisis-salarial/calculo-salario"
import { sinDiscapacidad } from "../lib/dominio/irpf/caso-fiscal-anual"

it("el contrato actual rechaza omisiones y mutaciones de cada fuente, llamada y argumento", () => {
  const contract = producirContratoMotor()
  expect(verificarContratoMotor(contract)).toBe(contract)
  for (const [i, source] of contract.sources.entries()) {
    expect(source.calls.length).toBeGreaterThan(0)
    const missing = structuredClone(contract)
    missing.sources.splice(i, 1)
    expect(() => verificarContratoMotor(missing)).toThrow("Contrato")
    for (const field of ["path", "sha256"] as const) {
      const altered = structuredClone(contract)
      altered.sources[i][field] += "alterado"
      expect(() => verificarContratoMotor(altered)).toThrow("Contrato")
    }
    for (const [j, call] of source.calls.entries()) {
      const altered = structuredClone(contract)
      altered.sources[i].calls[j].callee += "alterado"
      expect(() => verificarContratoMotor(altered)).toThrow("Contrato")
      for (const k of call.arguments.keys()) {
        const alteredArgument = structuredClone(contract)
        alteredArgument.sources[i].calls[j].arguments[k] += "alterado"
        expect(() => verificarContratoMotor(alteredArgument)).toThrow(
          "Contrato"
        )
      }
    }
  }
}, 120_000)

it("las llamadas de producto apuntan a la liquidación, derechos y cotización únicas", () => {
  const { sources, gates } = producirContratoMotor()
  const calls = (suffix: string) =>
    sources.find((s) => s.path.endsWith(suffix))!.calls.map((c) => c.callee)
  expect(calls("analisis-salarial/calculo-salario.ts")).toContain(
    "liquidacionIrpf.liquidar"
  )
  expect(calls("liquidacion/liquidar-irpf-anual.ts")).toContain(
    "calcularDerechosMinimos"
  )
  expect(calls("retenciones/retencion-trabajo-aeat.ts")).toContain(
    "calcularDerechosMinimos"
  )
  expect(calls("laboral/cotizaciones-sociales.ts")).toContain(
    "calcularDesgloseCotizacionesPerfilUniforme"
  )
  expect(Object.values(gates)).toEqual([false, false, false, false])
  for (const source of sources)
    expect(
      source.calls.some((c) =>
        /calcular.*Legacy|obtenerMinimoDescendientes|obtenerMinimoAscendientes/.test(
          c.callee
        )
      )
    ).toBe(false)
})

it("el análisis salarial conserva la cuota y neto de la ruta anual en fronteras salariales", () => {
  for (const brutoAnualCentimos of [
    0, 1587600, 1657600, 2200000, 3000000, 5000000, 9000000,
  ]) {
    const annual = Effect.runSync(
      liquidarIrpfAnual(
        {
          anio: 2025,
          comunidadAutonoma: "madrid",
          situacionFamiliar: {
            tipo: "individual",
            edad: 40,
            discapacidad: sinDiscapacidad,
            descendientes: [],
            ascendientes: [],
          },
          rendimientos: {
            trabajo: [{ importeIntegroCentimos: brutoAnualCentimos }],
          },
          reducciones: [],
          deducciones: [],
          retencionesSoportadasCentimos: 0,
          pagosACuentaCentimos: 0,
        },
        { modo: "canonico" }
      )
    )
    const salary = Effect.runSync(
      calcularSalario({
        anio: 2025,
        salarioBrutoAnualCentimos: brutoAnualCentimos,
        comunidadAutonoma: "madrid",
      })
    )
    expect(salary.irpfFinalCentimos).toBe(annual.cuotaLiquidaCentimos)
    expect(salary.salarioNetoAnualCentimos).toBe(
      brutoAnualCentimos -
        annual.cotizacionTrabajadorCentimos -
        annual.cuotaLiquidaCentimos
    )
  }
})
