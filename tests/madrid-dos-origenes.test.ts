import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import { producirBasesHistoriaNacimientoMadrid } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/madrid-historia"
import { dosOrigenes, conBruto } from "./madrid-dos-origenes.fixtures"
import oraculos from "./madrid-dos-origenes-oraculos.json"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { aplicarDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
const D = Decimal.clone({ precision: 80 })

for (const dos of [false, true]) for (const a23 of [false, true]) for (const a24 of [false, true])
  for (const inverso of [false, true]) for (const api of ["canonico", "explicito"] as const)
    for (const escasa of [false, true]) it(`B02 ambas API ${dos}/${a23}/${a24}/${inverso}/${api}/${escasa}`, () => {
      const { s: original, m } = dosOrigenes(dos, a23, a24)
      const h = original.historiaNacimientoMadrid!, a = original.auxiliares!
      const s = inverso ? { ...original, auxiliares: { ...a, eventos: [...a.eventos].reverse(), progenitores: [...a.progenitores].reverse(), miembrosUnidad: [...a.miembrosUnidad].reverse() },
        historiaNacimientoMadrid: { ...h, periodos: [...h.periodos].reverse().map(p => ({ ...p, personas: [...p.personas].reverse(), hijos: [...p.hijos].reverse() })) } } : original
      const bruto = escasa ? "22000" : "32000"
      // Perfil canónico uniforme: SS 6,48% del bruto de cada caso y gasto general 2000; no son cotizaciones ingresadas acreditadas.
      const renta = api === "canonico" ? (escasa ? 2044480 : 2979680) : (escasa ? 2000000 : 3000000)
      const derechosMinimos = { ...m.caso.derechosMinimos!, descendientes: m.caso.derechosMinimos!.descendientes.map(d => ({ ...d,
        titulares: d.titulares.map(t => ({ ...t, rentasNoExentasCentimos: t.titularId === "s-1" ? renta : t.rentasNoExentasCentimos })),
      })) }
      const comunes = { comunidadAutonoma: "madrid" as const, derechosMinimos, deduccionesTerritoriales2025: { solicitudes: [s] } }
      const e = casoExplicitoC36([])
      const r = api === "canonico"
        ? Effect.runSync(liquidarIrpfAnual({ ...casoUniformeC36(), ...comunes,
          rendimientos: { trabajo: [{ importeIntegroCentimos: escasa ? 2400000 : 3400000 }] } }, { modo: "canonico" }))
        : Effect.runSync(liquidarIrpfAnualExplicito({ ...e, ...comunes, familiaresConDerechoMinimo: "segun-derechos",
          trabajo: { ...e.trabajo, rendimientos: e.trabajo.rendimientos.map(t => ({ ...t, integro: bruto })) } }))
      const nominal = dos ? "721.70" : "1443.40"
      expect(r.deduccionesTerritoriales2025).toBeDefined()
      const libro = r.deduccionesTerritoriales2025
      if (libro === undefined || !("saldoEjercicio" in libro) || libro.saldoEjercicio === undefined)
        throw new Error("Falta libro territorial F")
      // Ambas API publican el libro; componentesCuota sólo existe en la explícita.
      const inicial = libro.saldoEjercicio.cuotaInicial
      const cuota = new D(inicial.numeradorEuros).div(inicial.divisor)
      if (!escasa) expect(cuota.gte(nominal)).toBe(true)
      if (escasa && !dos) expect(cuota.lt(nominal)).toBe(true)
      expect(r.deduccionesTerritoriales2025?.total).toEqual(racional(D.min(cuota, new D(nominal)).toFixed()))
    })

for (const o of oraculos.cuotas) it(`B02 Fraction cuota única ${o.dos}/${o.cuota}`, () => {
  const { s, m } = dosOrigenes(o.dos)
  const r = aplicarDeduccionesTerritoriales2025({ solicitudes: [s] }, { ...m, cuotaAutonomica: new D(o.cuota) })
  expect(r.total).toEqual(racional(o.numerador, o.divisor))
})
for (const ejercicio of [2023, 2024] as const) for (const bruto of ["32929.99", "32930", "32930.01"])
  it(`B02 umbral individual ${ejercicio}/${bruto}`, () => {
    const { s, m } = dosOrigenes()
    const r = evaluarAnualF2025(conBruto(s, ejercicio, bruto), m)
    if (bruto !== "32930.01") expect(r.importeExactoRacional).toEqual(racional("1443.40"))
    else if (ejercicio === 2023) expect(r.importeExactoRacional).toEqual(racional("721.70"))
    else { expect(r.estado).toBe("no_soportado"); expect(r.siguienteHecho).toBe("historia:2024:criterio_anualidad_intermedia") }
  })
it("B02 origen inválido no contamina el siguiente; todos inválidos excluye", () => {
  const { s, m } = dosOrigenes()
  expect(evaluarAnualF2025(conBruto(conBruto(s, 2023, "32930.01"), 2024, "32930.01"), m).estado).toBe("excluida")
})

it("B02 censos anuales, filiación, duplicados y ausencia de historia", () => {
  const { s, m } = dosOrigenes(), a = s.auxiliares!, h = s.historiaNacimientoMadrid!
  const p23 = h.periodos[0]!, p24 = h.periodos[1]!
  const historias = [
    { ...h, periodos: [p24] }, { ...h, periodos: [p23, p23] },
    { ...h, periodos: [{ ...p23, hijos: p24.hijos, personas: p24.personas }, p24] },
    { ...h, periodos: [p23, { ...p24, hijos: p23.hijos, personas: p23.personas }] },
    { ...h, periodos: [p23, { ...p24, personas: [...p24.personas, p24.personas[0]!] }] },
    { ...h, periodos: [p23, { ...p24, hijos: p24.hijos.map(x => ({ ...x, convivientesDevengo: [] })) }] },
    { ...h, periodos: [p23, { ...p24, hijos: p24.hijos.map(x => ({ ...x, nacimiento: "2026-01-01" })) }] },
    { ...h, periodos: [p23, { ...p24, estadoCivil: "casado" as const, conyuge: "s-9" }] },
  ]
  for (const historiaNacimientoMadrid of historias)
    expect(evaluarAnualF2025({ ...s, historiaNacimientoMadrid }, m).estado).toBe("no_soportado")
  const { historiaNacimientoMadrid: _historia, ...sin } = s
  expect(evaluarAnualF2025(sin, m).estado).toBe("no_soportado")
  for (const eventos of [[...a.eventos, a.eventos[0]!], [a.eventos[0]!, { ...a.eventos[1]!, hijos: ["s-2"] }],
    [a.eventos[0]!, { ...a.eventos[1]!, hijos: ["s-99"] }], [a.eventos[0]!, { ...a.eventos[1]!, fecha: "2024-03-01" }]])
    expect(evaluarAnualF2025({ ...s, auxiliares: { ...a, eventos } }, m).estado).toBe("no_soportado")
  for (const campo of ["baseGeneralEUR", "cuota", "saldo", "elegibilidad"])
    expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudAnualF2025)({ ...s,
      historiaNacimientoMadrid: { ...h, [campo]: "0" } }, { onExcessProperty: "error" }))).toBe(true)
})

for (const ejercicio of [2023, 2024] as const) for (const bruto of ["43859.99", "43860", "43860.01"])
  it(`B02 umbral conyugal ${ejercicio}/${bruto}`, () => {
    const { s: original, m } = dosOrigenes(true)
    const a = original.auxiliares!, h = original.historiaNacimientoMadrid!
    let s: typeof original = { ...original, auxiliares: { ...a, estadoCivil: "casado", miembrosUnidad: ["s-1", "s-3", "s-2", "s-4"] },
      historiaNacimientoMadrid: { ...h, periodos: h.periodos.map(p => ({ ...p, estadoCivil: "casado" as const, conyuge: "s-3" })) } }
    for (const y of [2023, 2024] as const) { s = conBruto(s, y, "22000"); s = conBruto(s, y, y === ejercicio ? bruto : "22000", "s-3") }
    const bases = new Map([...["s-1", "s-3"].map(id => [id, { general: new D(20000), ahorro: new D(0) }] as const),
      ...["s-2", "s-4"].map(id => [id, { general: new D(0), ahorro: new D(0) }] as const)])
    const libro = { referencia: "libro-interno", ejercicio: 2025 as const, contribuyente: "s-1", estadoCivil: "casado-no-separado" as const,
      conyuge: "s-3", miembrosUnidad: s.auxiliares!.miembrosUnidad, bases }
    const r = evaluarAnualF2025(s, { ...m, libroBasesFamiliares2025: libro })
    if (bruto !== "43860.01") expect(r.importeExactoRacional).toEqual(racional("721.70"))
    else if (ejercicio === 2023) expect(r.importeExactoRacional).toEqual(racional("360.85"))
    else { expect(r.estado).toBe("no_soportado"); expect(r.siguienteHecho).toBe("historia:2024:criterio_anualidad_intermedia") }
  })

for (const o of oraculos.limites) it(`B02 Fraction base ${o.ejercicio}/${o.bruto}`, () => {
  const { s } = dosOrigenes(true)
  if (o.ejercicio !== 2023 && o.ejercicio !== 2024) throw new Error("Oráculo de ejercicio inesperado")
  const y = o.ejercicio
  let hechos = conBruto(s, y, o.familiar === true ? "22000" : o.bruto)
  if (o.familiar === true) hechos = conBruto(hechos, y, o.bruto, "s-3")
  const p = hechos.historiaNacimientoMadrid!.periodos.find(p => p.ejercicio === y)!
  const bases = producirBasesHistoriaNacimientoMadrid(p, "s-1")
  const base = o.familiar === true ? bases.get("s-1")!.plus(bases.get("s-3")!) : bases.get("s-1")!
  expect(base.times(o.divisor).toFixed()).toBe(o.numerador)
  expect(base.lte(o.familiar === true ? "61860" : "30930")).toBe(o.cumple)
})
it("B02 rechaza conjunta y fallecimientos históricos en el contrato", () => {
  const { s } = dosOrigenes(), h = s.historiaNacimientoMadrid!
  const periodos = h.periodos
  for (const p of [ { ...periodos[0]!, modalidad: "conjunta" },
    { ...periodos[0]!, personas: periodos[0]!.personas.map(x => ({ ...x, vivoTodoEjercicio: false })) } ])
    expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudAnualF2025)({ ...s,
      historiaNacimientoMadrid: { ...h, periodos: [p, periodos[1]!] } }, { onExcessProperty: "error" }))).toBe(true)
})

for (const base of ["30929.99", "30930", "30930.01"]) it(`B02 límite actual2025 ${base}`, () => {
  const { s, m } = dosOrigenes()
  const r = evaluarAnualF2025(s, { ...m, baseGeneral: new D(base), baseAhorro: new D(0) })
  expect(r.estado).toBe(base === "30930.01" ? "excluida" : "calculo_parcial")
})
it("B02 no admite otro hogar, un tercer origen ni múltiples entre años", () => {
  const { s, m } = dosOrigenes(true), a = s.auxiliares!
  const derechos = m.caso.derechosMinimos!
  const distinto = { ...m, caso: { ...m.caso, derechosMinimos: { ...derechos,
    descendientes: derechos.descendientes.map(d => d.sujetoId !== "s-4" ? d : { ...d,
      titulares: d.titulares.map(t => t.titularId !== "s-3" ? t : { ...t, titularId: "s-9" }),
    }),
  } } }
  const otro = { ...s, auxiliares: { ...a, progenitores: a.progenitores.map(p => p.hijo !== "s-4" ? p : { ...p, convivientesDevengo: ["s-1", "s-9"] }) } }
  expect(evaluarAnualF2025(otro, distinto).siguienteHecho).toBe("historia.hogar")
  for (const eventos of [[...a.eventos, { ...a.eventos[1]!, id: "tercero", fecha: "2025-02-01", hijos: ["s-5"] }],
    [a.eventos[0]!, { ...a.eventos[1]!, hijos: ["s-4", "s-5"] }]])
    expect(evaluarAnualF2025({ ...s, auxiliares: { ...a, eventos } }, m).siguienteHecho).toBe("historia.origenes_distintos")
})
