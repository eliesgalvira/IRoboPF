import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import fixture from "./fixtures/open-2018-etapas.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { calcularReduccionTrabajoConOtrasRentas } from "../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"
import { admiteOperandoOpen2018, admiteArgumentoOpen2018 } from "../lib/dominio/irpf/trabajo-anual/politica-open-2018"
import { calcularCuotaPorEscala } from "../lib/dominio/irpf/cuotas/escalas-gravamen"
import { TRAMOS_IRPF_ESTATAL_GENERAL_2018 } from "../lib/dominio/normativa/datos/irpf-autonomico-2018"

for (const value of ["0", "0.01", "999999.99", "1000000"]) it(`transporte admitido ${value}`, () => {
  expect(admiteOperandoOpen2018(new Decimal(value))).toBe(true)
})
for (const value of ["-0.01", "1000000.01", "0.001", "NaN", "Infinity"]) it(`transporte sin evidencia ${value}`, () => {
  expect(admiteOperandoOpen2018(new Decimal(value))).toBe(false)
})
it("la API explícita no devuelve importe fuera de cota", () => {
  // Mutación local de contrato; nunca se registra como caso ni original oficial.
  const raw = structuredClone(fixture.cases[0]!.input)
  raw.trabajo.rendimientos[0]!.integro = "1000000.01"
  const input = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(raw)
  expect(Result.isFailure(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(input))))).toBe(true)
})
it("la llamada canónica a art20 conserva precisión y fórmula exacta", () => {
  const result = calcularReduccionTrabajoConOtrasRentas({ anio: 2018,
    rendimientoPrevioNeto: new Decimal("16271.81"), otrasRentasNoExentas: new Decimal(0) })
  expect(result.toFixed()).toBe("414.8925")
})
it("las ramas 2019–2024 conservan sus importes sin activar 2018", () => {
  for (const [anio, esperado] of [[2019,"829.785"],[2020,"829.785"],[2021,"829.785"],[2022,"829.785"],[2023,"3962.2866"],[2024,"4817.3325"]] as const) {
    const r = calcularReduccionTrabajoConOtrasRentas({ anio,
      rendimientoPrevioNeto: new Decimal("16271.81"), otrasRentasNoExentas: new Decimal(0) })
    expect(r.toFixed()).toBe(esperado)
  }
})
it("el selector decimal conserva fracciones de precisión80 fuera de la política", () => {
  const D = Decimal.clone({ precision: 80 })
  const base = new D("10000.123456789012345678901234567890123456789")
  expect(calcularCuotaPorEscala({ base, tramos: TRAMOS_IRPF_ESTATAL_GENERAL_2018, aritmetica: D }).eq(base.mul("0.095"))).toBe(true)
})

it("no infiere transporte de gastos fraccionarios no observados", () => {
  expect(admiteArgumentoOpen2018(new Decimal("13696.88"), new Decimal("1000.01"))).toBe(false)
  expect(admiteArgumentoOpen2018(new Decimal("17000.42"), new Decimal("1000"))).toBe(true)
})
