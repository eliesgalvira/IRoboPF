import { it, expect } from "vitest"
import fixture from "./fixtures/open-2020-2022-control.json"
import { Checks, contrastar } from "./open-2020-2022.casos"
import { Effect, Schema } from "effect"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito as publicApi } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

for (const c of fixture.cases) it(`${c.id}: conserva importes oficiales por etapa`, () => {
  const r = contrastar(Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(c.input), Schema.decodeUnknownSync(Checks)(c.official), c.id)
  expect(Effect.runSync(publicApi(Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(c.input)))).toEqual(r)
  const resumen = r.rastro.pasos.find(p => p.titulo === "Bases, cuotas y pagos anuales")
  expect(resumen?.descripcion).toContain("Open Madrid 2020–2022")
  expect(resumen?.descripcion).toContain("binary64/decimal corto/HALF_UP")
  expect(resumen?.descripcion).toContain("antes de obtener la base")
  expect(resumen?.descripcion).not.toContain("precisión histórica")
})
