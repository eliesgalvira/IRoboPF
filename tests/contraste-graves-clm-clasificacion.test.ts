import { expect, it } from "vitest"
import { Effect, Result } from "effect"
import { liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { clasico, solicitud } from "./contraste-graves-clm.fixtures"
it("clasificación sólo trabajo no se deduce de ganancias y pérdidas netas cero", () => {
  const c = clasico(solicitud())
  const r = Effect.runSync(Effect.result(liquidarIrpfAnual({ ...c, rendimientos: { ...c.rendimientos,
    gananciasPatrimoniales: [173457, -173457].map(importeGananciaCentimos => ({ importeGananciaCentimos, tratamientoMayores65: { _tag: "SinExencionMayores65" as const } })),
  } }, { modo: "canonico" })))
  expect(Result.isFailure(r), "Contrato estricto de perfil; posible hueco POST, no regla fiscal general").toBe(true)
  if (Result.isFailure(r)) expect(r.failure._tag).toBe("ResultadoNoSoportado")
})
