// Revisión independiente lote02. Entradas sintéticas y oráculos anteriores conservados.
import { describe, expect, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import entradas from "./fixtures/trabajo-alquiler-ordinario-2025.json"
import { CasoTrabajoAlquilerOrdinario2025 } from "../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
const original = () => Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)(structuredClone(entradas[0]!.entrada))
const canonica = (c: CasoTrabajoAlquilerOrdinario2025) => liquidarIrpfAnual(c,{modo:"canonico"})
for (const [nombre,api] of [["canonica",canonica],["explicita",liquidarIrpfAnualExplicito]] as const) describe(nombre, () => {
  it.effect("Asturias: acumulada1751.36, diferencial sin redondeo intermedio", () => Effect.gen(function* () {
    const x=yield* api(original())
    // 1751.36 + (base -17707.20)*.14 -6105*.09, más cuota estatal -4200.
    expect(x.cuotaDiferencial.toFixed(3)).toBe(nombre==="canonica"?"1881.642":"1879.902")
    expect(x.cuotaDiferencialPresentada).toBe(nombre==="canonica"?"1881.64":"1879.90")
  }))
  it.effect("control: propiedad, censo, arrendador y retención pertenecen al sujeto", () => Effect.gen(function* () {
    const c=original(), v=c.inmuebles[0]!
    const adversas=[
      {...c,contribuyenteId:"otro"},
      {...c,inmuebles:[{...v,contrato:{...v.contrato,arrendador:"otro"}}]},
      {...c,censoInmobiliario:{...c.censoInmobiliario,inmuebles:["otro"]}},
      {...c,retenciones:c.retenciones.map(r=>({...r,contribuyenteId:"otro"}))},
      {...c,inmuebles:[{...v,usosDesdeAdquisicion:[{...v.usosDesdeAdquisicion[0]!,hasta:"2024-11-29"},v.usosDesdeAdquisicion[1]!]}]},
    ]
    for(const a of adversas) {
      const e=yield* Effect.flip(api(a)); expect(e._tag).toBe("RechazoP4a")
    }
  }))
  it.effect("art20: neto8600 previo a reducción, trabajo con bruto17000", () => Effect.gen(function* () {
    const c=original(), a={...c,trabajo:{...c.trabajo,rendimientos:c.trabajo.rendimientos.map(r=>({...r,integro:"17000.00"}))}}
    const x=yield* api(a)
    expect(x.baseImponibleGeneral.toFixed(2)).toBe(nombre==="canonica"?"18198.40":"17350.00")
    expect(x.composicion.deduccionTrabajo.isZero()).toBe(true)
  }))
})
