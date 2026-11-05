import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { casoCanonicoELA, casoEfectivoELA, censoELA, solicitudELA } from "./ela-ingreso-2025-fixtures"

it("art20 no declara7302 de reducción con neto laboral cero y ayuda4000", () => {
  const c = censoELA("4000")
  const canonico = Effect.runSync(liquidarIrpfAnual(casoCanonicoELA(c), { modo: "canonico" }))
  const efectivo = Effect.runSync(liquidarIrpfAnualExplicito(casoEfectivoELA(c)))
  expect(canonico.reduccionRendimientosTrabajoCentimos).toBe(0)
  expect(efectivo.reduccionArt20).toBe("0")
  expect(canonico.baseImponibleGeneralCentimos).toBe(400000)
  expect(efectivo.baseImponibleGeneral).toBe("4000")
})
it("ingreso2025 no puede representarse sólo por importe concedido sin censo", () => {
  const original = casoCanonicoELA()
  const { ingresosIdentificados2025, ...sinIngreso } = original
  expect(ingresosIdentificados2025?.ayudas).toHaveLength(1)
  const error = Effect.runSync(Effect.flip(liquidarIrpfAnual(sinIngreso, { modo: "canonico" })))
  expect(error.motivo).toMatch(/ayudaELAIntegrada2025/)
})
it("mismo cobroId o justificante en dos ayudas distintas no duplica base", () => {
  const c = censoELA("4000"), a = c.ayudas[0]
  const dos = { ...c, ayudas: [a, { ...a, ayudaId: "ELA2", resolucion: { ...a.resolucion, referencia: "RES2" } }] }
  const error = Effect.runSync(Effect.flip(liquidarIrpfAnual(casoCanonicoELA(dos, solicitudELA(dos)), { modo: "canonico" })))
  expect(error.motivo).toMatch(/repetido/)
})
it("cantidad cobrada mayor que la resolución exige conciliación, no diferencia externa", () => {
  const c = censoELA("4000")
  Object.defineProperty(c.ayudas[0].resolucion, "importeConcedido", { value: "3999.99" })
  const error = Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(casoEfectivoELA(c))))
  expect(error.motivo).toMatch(/superiores a la resolución/)
})
it("resolución regional diferente no habilita una ayuda ya cobrada", () => {
  const c = censoELA(), distinta = censoELA()
  Object.defineProperty(distinta.ayudas[0].resolucion, "referencia", { value: "FICTICIA" })
  const error = Effect.runSync(Effect.flip(liquidarIrpfAnual(casoCanonicoELA(c, solicitudELA(distinta)), { modo: "canonico" })))
  expect(error.motivo).toMatch(/Resolución ELA/)
})
