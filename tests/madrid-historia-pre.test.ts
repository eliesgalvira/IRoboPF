import { Schema } from "effect"
import { CausaF } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/comun"
import { expect, it } from "vitest"
import { fixture } from "./madrid-historia-fixtures"
import { evaluarAuxiliaresAnualesF } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/auxiliares-anual"
it("PRE causa histórica pública, POST ampliación", () => {
  const {s,m} = fixture(2023)
  let campo: string | undefined
  try { evaluarAuxiliaresAnualesF(s,m) } catch (e) { if (Schema.is(CausaF)(e)) campo = e.campo; else throw e }
  expect(campo).toBeUndefined()
})
