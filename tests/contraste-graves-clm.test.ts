import Decimal from "decimal.js"
import { aplicarDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { producirNodosFiscalesB2025 } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025/productores"
import { magnitudesConexionC36 } from "./c36-conexion-anual.fixtures"
import { expect, it } from "vitest"
import { Effect, Result, Schema } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { origen, solicitud, clasico, efectivo } from "./contraste-graves-clm.fixtures"
const exacto500 = (r: { numeradorEuros: string; divisor: string } | undefined) => {
  if (r === undefined) throw new Error("Sin racional")
  expect(BigInt(r.numeradorEuros)).toBe(500n * BigInt(r.divisor))
}
for (const api of ["uniforme", "explicita"] as const) {
  const ejecutar = (h = origen()) => api === "uniforme"
    ? Effect.runSync(liquidarIrpfAnual(clasico(solicitud(h)), { modo: "canonico" }))
    : Effect.runSync(liquidarIrpfAnualExplicito(efectivo(solicitud(h))))
  it(`${api} sólo trabajo correcto conserva 500 y hechos`, () => {
    const h = origen("22753", "713"), antes = JSON.stringify(h)
    const r = ejecutar(h)
    exacto500(r.deduccionesTerritoriales2025?.total)
    expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
    expect(JSON.stringify(h)).toBe(antes)
  })
  for (const [bruto, ss] of [["1750", "0"], ["2400", "1200"]]) it(`${api} RN cero legítimo ${bruto}/${ss} no se confunde con pérdida`, () => {
    exacto500(ejecutar(origen(bruto, ss)).deduccionesTerritoriales2025?.total)
  })
  for (const [bruto, ss] of [["1750", "1751"], ["2400", "2600"], ["300", "450"]]) {
    it(`${api} histórico RN negativo ${bruto}/${ss} no inventa base cero`, () => {
      const h = origen(bruto, ss)
      const r = api === "uniforme"
        ? Effect.runSync(Effect.result(liquidarIrpfAnual(clasico(solicitud(h)), { modo: "canonico" })))
        : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(efectivo(solicitud(h)))))
      expect(r._tag).toBe("Failure")
      if (r._tag === "Failure") {
        expect(r.failure._tag).toBe("ResultadoNoSoportado")
        expect("cuotaLiquidaCentimos" in r.failure).toBe(false)
      }
    })
  }
}
for (const centimos of [1, 37613, 173457]) it(`uniforme alquiler y pérdida cancelados ${centimos}`, () => {
  const c = clasico(solicitud())
  const r = Effect.runSync(Effect.result(liquidarIrpfAnual({ ...c, rendimientos: {
    ...c.rendimientos, capitalInmobiliario: [{ importeIntegroCentimos: centimos }],
    gananciasPatrimoniales: [{ importeGananciaCentimos: -centimos, tratamientoMayores65: { _tag: "SinExencionMayores65" } }],
  } }, { modo: "canonico" })))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure._tag).toBe("ResultadoNoSoportado")
})
it("explícita no permite colar rentas ni cuota externa como hechos salariales", () => {
  for (const extra of [{ cuotaTrabajoActividad: "500" }, { rendimientos: { capitalInmobiliario: [{ importeIntegroCentimos: 173457 }] } }]) {
    expect(Result.isFailure(Schema.decodeUnknownResult(CasoFiscalAnualExplicito)({ ...efectivo(solicitud()), ...extra }, { onExcessProperty: "error" }))).toBe(true)
  }
})

for (const nodo of ["ausente", "otro-titular", "solo-actividad", "solo-trabajo"] as const) it(`puerto CLM exige productor de cuota ${nodo}`, () => {
  const mm = magnitudesConexionC36("castilla-la-mancha")
  const m = { ...mm, caso: { ...mm.caso, contribuyenteId: "titular-A" },
    nodosFiscalesB2025: nodo === "ausente" ? undefined : producirNodosFiscalesB2025(
      nodo === "otro-titular" ? "otro" : "titular-A", new Decimal(28000), new Decimal(20), new Decimal(20),
      nodo === "solo-actividad" ? "solo-actividad" : "solo-trabajo"),
  }
  if (nodo !== "solo-trabajo") expect(() => aplicarDeduccionesTerritoriales2025(solicitud(), m)).toThrow(/composición/)
  else {
    const r = aplicarDeduccionesTerritoriales2025(solicitud(), m).total
    // Cuota externa del marco=1000; nodo=20. No sustituir el nodo por el total.
    expect(BigInt(r.numeradorEuros)).toBe(20n * BigInt(r.divisor))
  }
})
