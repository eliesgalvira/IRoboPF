import { Effect } from "effect"
import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { fixture } from "./madrid-vivienda-historia.fixtures"
import { analitico, efectivo } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { aplicarDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
type Resultado = ReturnType<typeof ejecutar>
function esExito(r: Resultado): r is Extract<Resultado, { readonly _tag: "Success" }> { return r._tag === "Success" }
function esFallo(r: Resultado): r is Extract<Resultado, { readonly _tag: "Failure" }> { return r._tag === "Failure" }
function ejecutar(api: "canonico" | "explicito", f: ReturnType<typeof fixture>, solicitudes = [f.s]) {
  const comunes = { contribuyenteId: "s-1", derechosMinimos: f.d, basesFamiliares2025: f.c, deduccionesTerritoriales2025: { solicitudes } }
  return api === "canonico"
    ? Effect.runSync(Effect.result(liquidarIrpfAnual({ ...analitico, ...comunes }, { modo: "canonico" })))
    : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...efectivo, ...comunes, familiaresConDerechoMinimo: "segun-derechos", deducciones: "territoriales-por-hechos-y-da61" })))
}
for (const api of ["canonico", "explicito"] as const) {
  for (const y of [2023, 2024, 2025] as const) for (const adopcion of [false, true]) it(`${api} compra${y} adopcion${adopcion}`, () => {
    // Oráculo independiente: (100000+2000+8000)*10%/10=1100; cuota suficiente.
    const r = ejecutar(api, fixture(y, adopcion))
    expect(esExito(r)).toBe(true)
    if (esExito(r)) expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("1100"))
  })
  for (const y of [2023, 2024] as const) for (const bruto of ["70677.99", "70678", "70678.01"]) {
    for (const ejercicio of (y === 2023 ? [2023, 2024, 2025] : [2024, 2025])) it(`${api} frontera origen/cada año ${y}/${ejercicio}/${bruto}`, () => {
      const f = fixture(y)
      // Adulto1: 30000-1944-2000=26056. Adulto2: bruto-1944-2000.
      // Hijos sin rentas; umbral tres miembros=92790. Sin art20 a estas rentas.
      if (ejercicio === 2025) f.c = { ...f.c, personas: f.c.personas.map(p => p.id !== "s-2" || p.economia.perfil !== "solo-trabajo" ? p : { ...p,
        economia: { ...p.economia, trabajo: { ...p.economia.trabajo, rendimientos: p.economia.trabajo.rendimientos.map(t => ({ ...t, integro: bruto })) } },
      }) }
      if (ejercicio === 2025) f.d = { ...f.d, descendientes: f.d.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => t.titularId !== "s-2" ? t : { ...t, rentasNoExentasCentimos: Math.round((Number(bruto) - 3944) * 100) }) })) }
      else f.s = { ...f.s, historiaViviendaMadrid: { ...f.s.historiaViviendaMadrid!, periodos: f.s.historiaViviendaMadrid!.periodos.map(p => p.ejercicio !== ejercicio ? p : { ...p,
        personas: p.personas.map(x => x.id !== "s-2" || x.economia.perfil !== "solo-trabajo" ? x : { ...x,
          economia: { ...x.economia, trabajo: { ...x.economia.trabajo, rendimientos: x.economia.trabajo.rendimientos.map(t => ({ ...t, integro: bruto })) } },
        }),
      }) } }
      const r = ejecutar(api, f)
      expect(esExito(r)).toBe(true)
      if (esExito(r)) expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional(bruto === "70678.01" && (ejercicio === y || ejercicio === 2025) ? "0" : "1100"))
    })
  }
  it(api + " rechazos de historia sin convertir en cero y sin magnitudes externas", () => {
    const f = fixture(2023), h = f.s.historiaViviendaMadrid!, p = h.periodos[0]!
    const sinHistoria = { ...f.s }; Reflect.deleteProperty(sinHistoria, "historiaViviendaMadrid")
    for (const historia of [undefined, { ...h, periodos: [p, p] }, { ...h, periodos: [p] }, { ...h, contribuyente: "s-9" },
      { ...h, adquisicion: "2024-03-01" }, { ...h, viviendaId: "otra" },
      { ...h, periodos: h.periodos.map(p => ({ ...p, hijos: p.hijos.map(x => ({ ...x, nacimiento: "2024-01-01" })) })) },
    ]) expect(esFallo(ejecutar(api, { ...f, s: historia === undefined ? sinHistoria : { ...f.s, historiaViviendaMadrid: historia } }))).toBe(true)
    for (const campo of ["baseGeneralEUR", "cuota", "saldo", "elegibilidad"]) {
      // SAFETY: propiedad prohibida deliberada; sólo se comprueba rechazo del contrato.
      const s = { ...f.s, historiaViviendaMadrid: { ...h, [campo]: "0" } } as never
      expect(esFallo(ejecutar(api, { ...f, s }))).toBe(true)
    }
  })
  it(api + " mantiene incompatibilidad con despoblación por mismo objeto", () => {
    const f = fixture(2024)
    const s = { ...f.s, hechos: { ...f.s.hechos, elecciones: [{ codigo: "madrid_vivienda_municipios_despoblacion", objetoId: "v" }] } }
    expect(esFallo(ejecutar(api, { ...f, s }))).toBe(true)
    const sOtra = { ...s, hechos: { ...s.hechos, elecciones: [{ codigo: "madrid_vivienda_municipios_despoblacion", objetoId: "otra" }] } }
    expect(esExito(ejecutar(api, { ...f, s: sOtra }))).toBe(true)
  })
}
for (const y of [2023, 2024] as const) it(`cuota escasa sin arrastre ni doble consumo ${y}`, () => {
  const f = fixture(y)
  for (const cuota of ["0", "10.001"]) {
    const r = aplicarDeduccionesTerritoriales2025({ solicitudes: [f.s] }, { ...f.m, cuotaAutonomica: new Decimal(cuota) })
    expect(r.total).toEqual(racional(cuota))
    expect(r.disponible).toEqual(racional("0"))
  }
})
it("fuera de vigencia, transmisión y evento fuera de tres años", () => {
  const f = fixture(2024), v = f.s.hechos.viviendas![0]!
  for (const vivienda of [{ ...v, adquisicion: "2022-03-01" }, { ...v, transmision: "2025-01-01" }]) {
    expect(evaluarAnualF2025({ ...f.s, hechos: { ...f.s.hechos, viviendas: [vivienda] } }, f.m).estado).toBe("excluida")
  }
  const otro = { ...f.m, caso: { ...f.m.caso, anio: 2024 as const } }
  expect(evaluarAnualF2025(f.s, otro).estado).toBe("no_soportado")
})

for (const api of ["canonico", "explicito"] as const) it(api + " cuota nula desde trabajo ordinario, no cuota consignada", () => {
  const f = fixture(2024)
  // Bruto10000: tras gastos/art20 la base es inferior al mínimo personal incluso sin hijo.
  // Por tanto la cuota es0 y no existe arrastre del art13 por cuota insuficiente.
  const d = { ...f.d, descendientes: f.d.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => t.titularId !== "s-1" ? t : {
    ...t, rentasNoExentasCentimos: api === "canonico" ? 735200 : 605600,
  }) })) }
  const comunes = { contribuyenteId: "s-1", derechosMinimos: d, basesFamiliares2025: f.c, deduccionesTerritoriales2025: { solicitudes: [f.s] } }
  const r = api === "canonico"
    ? Effect.runSync(Effect.result(liquidarIrpfAnual({ ...analitico, ...comunes, rendimientos: { trabajo: [{ importeIntegroCentimos: 1000000 }] } }, { modo: "canonico" })))
    : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...efectivo, ...comunes, familiaresConDerechoMinimo: "segun-derechos", deducciones: "territoriales-por-hechos-y-da61",
      trabajo: { ...efectivo.trabajo, rendimientos: efectivo.trabajo.rendimientos.map(t => ({ ...t, integro: "10000" })) },
    })))
  expect(esExito(r)).toBe(true)
  if (esExito(r)) expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("0"))
})

for (const api of ["canonico", "explicito"] as const) {
  it(api + " tope anual independiente y transmisión extingue anualidad", () => {
    const f = fixture(2024), v = f.s.hechos.viviendas![0]!
    const s = { ...f.s, hechos: { ...f.s.hechos, viviendas: [{ ...v, precioEUR: "200000" }] } }
    const r = ejecutar(api, { ...f, s })
    expect(esExito(r)).toBe(true)
    if (esExito(r)) expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("1546.50"))
    const t = ejecutar(api, { ...f, s: { ...f.s, hechos: { ...f.s.hechos, viviendas: [{ ...v, transmision: "2025-01-01" }] } } })
    expect(esExito(t)).toBe(true)
    if (esExito(t)) expect(t.success.deduccionesTerritoriales2025?.total).toEqual(racional("0"))
  })
  it(api + " compra fuera de los tres años del evento, con identidades conciliadas", () => {
    const f = fixture(2024)
    f.d = { ...f.d, descendientes: f.d.descendientes.map(d => ({ ...d, fechaNacimiento: "2020-01-01", edadDevengo: 5 })) }
    f.c = { ...f.c, hijos: f.c.hijos.map(h => ({ ...h, nacimiento: "2020-01-01" })) }
    f.s = { ...f.s, historiaViviendaMadrid: { ...f.s.historiaViviendaMadrid!, periodos: f.s.historiaViviendaMadrid!.periodos.map(p => ({ ...p, hijos: p.hijos.map(h => ({ ...h, nacimiento: "2020-01-01" })) })) },
      hechos: { ...f.s.hechos, personas: f.s.hechos.personas!.map(p => ({ ...p, nacimiento: "2020-01-01" })) } }
    const r = ejecutar(api, f)
    expect(esExito(r)).toBe(true)
    if (esExito(r)) expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("0"))
  })
}
