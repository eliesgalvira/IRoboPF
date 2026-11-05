import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { aplicarDeduccionesTerritoriales2025 as aplicar, SolicitudDeduccionesTerritoriales2025 as Solicitud } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { FamiliaC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { nacimientoConexionC36, magnitudesConFamiliaC36, derechosConexionC36, casoExplicitoC36, casoUniformeC36 } from "./c36-conexion-anual.fixtures"

function gemelos(dosProgenitores = false) {
  const s = nacimientoConexionC36()
  const m = magnitudesConFamiliaC36()
  const d = derechosConexionC36()
  const hijo = d.descendientes[0]
  const titulares = dosProgenitores
    ? [...hijo.titulares, { ...hijo.titulares[0], titularId: "s-9" }].map(t => ({ ...t, custodia: "compartida" as const }))
    : hijo.titulares
  const ids = ["s-2", "s-3"]
  return {
    s: { ...s, hechos: { ...s.hechos,
      personas: ids.map(id => ({ ...s.hechos.personas[0], id })),
      censoDescendientes: ids,
      registroPartoMultiple: { documento: "certificado-literal-parto", nacidos: ids.map((persona, i) => ({ persona, fechaNacimiento: hijo.fechaNacimiento, secuenciaParto: i + 1 })) },
    } },
    m: { ...m, cuotaAutonomica: new Decimal(5000),
      caso: { ...m.caso, derechosMinimos: { ...d, descendientes: ids.map(sujetoId => ({ ...hijo, sujetoId, titulares })) } },
      sujetosConMinimo: ids,
      atribucionesMinimo: ids.map(sujetoId => ({ sujetoId, titulares: titulares.map(t => t.titularId) })),
    },
  }
}
function adopcion() {
  const s = nacimientoConexionC36()
  const m = magnitudesConFamiliaC36()
  const d = derechosConexionC36()
  const { registroCobrosNacimiento, ...hechos } = s.hechos
  if (registroCobrosNacimiento === undefined) throw new Error("Fixture de nacimiento sin registro")
  const solicitud: typeof FamiliaC36.Type = { ...s, codigo: "balears_adopcion", hechos: {
    ...hechos,
    personas: hechos.personas.map(p => ({ ...p, expediente: "resolucion-adopcion", inscripcionCivil: "2025-03-10" })),
    filiacionAdopcion: { hijo: "s-2", fechaConstitucion: "2025-03-01", documento: "certificacion-filiacion-y-estado-civil", censo: "completo_al_constituirse", progenitoresPrevios: ["s-8"], conyugesOParejas: ["s-9"] },
  } }
  return { s: solicitud, m: { ...m, caso: { ...m.caso, derechosMinimos: {
    ...d, descendientes: d.descendientes.map(h => ({ ...h, titulares: h.titulares.map(t => ({ ...t, vinculo: {
      clase: "adopcion" as const, fechaInicioIncremento: "2025-03-01", fechaConstitucionVinculo: "2025-03-01", fundamento: "inscripcion-registro-civil" as const, historialCompleto: true as const,
    } })) })),
  } } } }
}

type HechosFamilia = (typeof FamiliaC36.Type)["hechos"]
function sinRegistroParto(hechos: HechosFamilia) {
  const { registroPartoMultiple, ...resto } = hechos
  expect(registroPartoMultiple).toBeDefined()
  return resto
}
function sinFiliacion(hechos: HechosFamilia) {
  const { filiacionAdopcion, ...resto } = hechos
  expect(filiacionAdopcion).toBeDefined()
  return resto
}

// Art6ter: primer hijo800, segundo1000; dos progenitores => mitad.
it.each([[false, "1800"], [true, "900"]] as const)("parto documentado dosProgenitores=%s genera%s", (dos, esperado) => {
  const { s, m } = gemelos(dos)
  expect(aplicar({ solicitudes: [s] }, m).total).toEqual(racional(esperado))
  const invertida = { ...s, hechos: { ...s.hechos, personas: [...s.hechos.personas].reverse(), registroPartoMultiple: { ...s.hechos.registroPartoMultiple, nacidos: [...s.hechos.registroPartoMultiple.nacidos].reverse() } } }
  expect(aplicar({ solicitudes: [invertida] }, m).total).toEqual(racional(esperado))
})
it("renta superior52800 reduce1800 a900; no inventa otra base", () => {
  const { s, m } = gemelos()
  expect(aplicar({ solicitudes: [s] }, { ...m, baseGeneral: new Decimal("52800.01") }).total).toEqual(racional("900"))
})
it("cuota insuficiente limita1800 a700 sin crear abono", () => {
  const { s, m } = gemelos()
  expect(aplicar({ solicitudes: [s] }, { ...m, cuotaAutonomica: new Decimal(700) }).total).toEqual(racional("700"))
})
it.each([0, 1, 3, 1.5])("secuencia adversa%s no concede1800", secuenciaParto => {
  const { s, m } = gemelos()
  const r = s.hechos.registroPartoMultiple
  expect(() => aplicar({ solicitudes: [{ ...s, hechos: { ...s.hechos, registroPartoMultiple: { ...r, nacidos: [r.nacidos[0], { ...r.nacidos[1], secuenciaParto }] } } }] }, m)).toThrow(/secuencia/)
})
it("sin registro de parto no concede1800", () => {
  const { s, m } = gemelos()
  const hechos = sinRegistroParto(s.hechos)
  expect(() => aplicar({ solicitudes: [{ ...s, hechos }] }, m)).toThrow(/orden registral/)
})
it.each(["omision", "ajeno", "fecha"])("registro adverso%s no concede1800", variante => {
  const { s, m } = gemelos()
  const r = s.hechos.registroPartoMultiple
  const nacidos = variante === "omision" ? r.nacidos.slice(0, 1) : r.nacidos.map((n, i) => i === 0 ? { ...n, ...(variante === "ajeno" ? { persona: "s-99" } : { fechaNacimiento: "2025-02-02" }) } : n)
  expect(() => aplicar({ solicitudes: [{ ...s, hechos: { ...s.hechos, registroPartoMultiple: { ...r, nacidos } } }] }, m)).toThrow(/registro|secuencia/)
})
it("adopción primer hijo único genera800; residencia2024 no es requisito de adopción", () => {
  const { s, m } = adopcion()
  const hechos = { ...s.hechos, contribuyente: { ...s.hechos.contribuyente, residenciaFiscal2024: "otra" as const, documentoResidencia2024: "" } }
  expect(aplicar({ solicitudes: [{ ...s, hechos }] }, m).total).toEqual(racional("800"))
})
it("adopción con cuota300 aplica300, no abona500 automáticamente", () => {
  const { s, m } = adopcion()
  expect(aplicar({ solicitudes: [s] }, { ...m, cuotaAutonomica: new Decimal(300) }).total).toEqual(racional("300"))
})
it("adopción límite33000 admite800;33000.01 no recibe800", () => {
  const { s, m } = adopcion()
  expect(aplicar({ solicitudes: [s] }, { ...m, baseGeneral: new Decimal(33000) }).total).toEqual(racional("800"))
  expect(() => aplicar({ solicitudes: [s] }, { ...m, baseGeneral: new Decimal("33000.01") })).toThrow()
})
it("adopción de hijo de pareja no concede800", () => {
  const { s, m } = adopcion()
  const f = s.hechos.filiacionAdopcion!
  expect(() => aplicar({ solicitudes: [{ ...s, hechos: { ...s.hechos, filiacionAdopcion: { ...f, conyugesOParejas: ["s-8"] } } }] }, m)).toThrow(/hijo del cónyuge/)
})
it.each(["omitida", "hijo", "fecha", "progenitor"])("filiación adversa%s no concede800", variante => {
  const { s, m } = adopcion()
  const f = s.hechos.filiacionAdopcion!
  const hechos: (typeof FamiliaC36.Type)["hechos"] = { ...s.hechos,
    filiacionAdopcion: { ...f, hijo: variante === "hijo" ? "s-99" : f.hijo, fechaConstitucion: variante === "fecha" ? "2025-03-02" : f.fechaConstitucion },
    personas: variante === "progenitor" ? s.hechos.personas.map(p => ({ ...p, progenitorPrevio: "s-99" })) : s.hechos.personas,
  }
  const adversos = variante === "omitida" ? sinFiliacion(hechos) : hechos
  expect(() => aplicar({ solicitudes: [{ ...s, hechos: adversos }] }, m)).toThrow(/filiación|exclusión|progenitor/)
})
it("adopción no importa anticipos de nacimiento", () => {
  const { s, m } = adopcion()
  expect(() => aplicar({ solicitudes: [{ ...s, hechos: { ...s.hechos, registroCobrosNacimiento: nacimientoConexionC36().hechos.registroCobrosNacimiento } }] }, m)).toThrow(/anticipos/)
})
it("schema cerrado no acepta orden fiscal ni base externa dentro del registro", () => {
  const { s } = gemelos()
  for (const campo of ["ordenFiscal", "baseGeneral", "deduccion"]) {
    expect(Result.isFailure(Schema.decodeUnknownResult(Solicitud)({ solicitudes: [{ ...s, hechos: { ...s.hechos, registroPartoMultiple: { ...s.hechos.registroPartoMultiple, [campo]: 1800 } } }] }, { onExcessProperty: "error" }))).toBe(true)
  }
})
it("API efectiva ejercicio2025 conecta adopción800 desde hechos y derechos", () => {
  const { s, m } = adopcion()
  const caso = casoExplicitoC36([s])
  const derechos = m.caso.derechosMinimos!
  const r = Effect.runSync(liquidarIrpfAnualExplicito({ ...caso, comunidadAutonoma: "illes-balears", familiaresConDerechoMinimo: "segun-derechos", derechosMinimos: {
    ...derechos, descendientes: derechos.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => ({ ...t, rentasNoExentasCentimos: 2800000 })) })),
  } }))
  // Trabajo efectivo30000-2000=28000, cuota suficiente; único hijo800.
  expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("800"))
})

it("nacimiento publicado sin empate conserva800", () => {
  expect(aplicar({ solicitudes: [nacimientoConexionC36()] }, magnitudesConFamiliaC36()).total).toEqual(racional("800"))
})
it("adopción sin pareja documentada admite800", () => {
  const { s, m } = adopcion()
  expect(aplicar({ solicitudes: [{ ...s, hechos: { ...s.hechos, filiacionAdopcion: { ...s.hechos.filiacionAdopcion!, conyugesOParejas: [] } } }] }, m).total).toEqual(racional("800"))
})
it("adopción con segundo adoptante rechaza antes de conceder800 indebidamente", () => {
  const { s, m } = adopcion()
  const d = m.caso.derechosMinimos!
  const derechosMinimos = { ...d, descendientes: d.descendientes.map(h => ({ ...h, titulares: [...h.titulares, { ...h.titulares[0], titularId: "s-9" }] })) }
  expect(() => aplicar({ solicitudes: [s] }, { ...m, caso: { ...m.caso, derechosMinimos } })).toThrow(/segundo adoptante/)
})
it("inscripción2026 no concede800 en2025", () => {
  const { s, m } = adopcion()
  expect(() => aplicar({ solicitudes: [{ ...s, hechos: { ...s.hechos, personas: s.hechos.personas.map(p => ({ ...p, inscripcionCivil: "2026-01-01" })) } }] }, m)).toThrow(/fechas de adopción/)
})

for (const api of ["uniforme", "efectiva"] as const) {
  for (const rama of ["gemelos", "adopcion"] as const) {
    it(`ambas API ${api}: ${rama} conserva esperado normativo`, () => {
      const { s, m } = rama === "gemelos" ? gemelos() : adopcion()
      const derechos = m.caso.derechosMinimos!
      const casoE = casoExplicitoC36([s])
      const integro = rama === "gemelos" ? "50000" : "30000"
      // Gemelos usan salario50000 para disponer de cuota suficiente; adopción30000
      // conserva renta inferior33000. Netos uniformes44760/26056 y efectivos48000/28000.
      const derechosMinimos = { ...derechos, descendientes: derechos.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => ({ ...t, rentasNoExentasCentimos: api === "uniforme" ? (rama === "gemelos" ? 4476000 : 2605600) : (rama === "gemelos" ? 4800000 : 2800000) })) })) }
      const r = api === "uniforme"
        ? Effect.runSync(liquidarIrpfAnual({ ...casoUniformeC36(), rendimientos: { trabajo: [{ importeIntegroCentimos: rama === "gemelos" ? 5000000 : 3000000 }] }, comunidadAutonoma: "illes-balears", derechosMinimos, deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" }))
        : Effect.runSync(liquidarIrpfAnualExplicito({ ...casoE, trabajo: { ...casoE.trabajo, rendimientos: casoE.trabajo.rendimientos.map(t => ({ ...t, integro })) }, comunidadAutonoma: "illes-balears", familiaresConDerechoMinimo: "segun-derechos", derechosMinimos }))
      expect(r.deduccionesTerritoriales2025?.total).toEqual(racional(rama === "gemelos" ? "1800" : "800"))
    })
    it(`ambas API ${api}: ${rama} adverso no concede la cuantía positiva`, () => {
      const { s, m } = rama === "gemelos" ? gemelos() : adopcion()
      const derechos = m.caso.derechosMinimos!
      const casoE = casoExplicitoC36([s])
      const integro = rama === "gemelos" ? "50000" : "30000"
      const hechos = rama === "gemelos" ? sinRegistroParto(s.hechos) : sinFiliacion(s.hechos)
      const solicitud = { ...s, hechos }
      const derechosMinimos = { ...derechos, descendientes: derechos.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => ({ ...t, rentasNoExentasCentimos: api === "uniforme" ? (rama === "gemelos" ? 4476000 : 2605600) : (rama === "gemelos" ? 4800000 : 2800000) })) })) }
      const resultado = api === "uniforme"
        ? Effect.runSync(Effect.result(liquidarIrpfAnual({ ...casoUniformeC36(), rendimientos: { trabajo: [{ importeIntegroCentimos: rama === "gemelos" ? 5000000 : 3000000 }] }, comunidadAutonoma: "illes-balears", derechosMinimos, deduccionesTerritoriales2025: { solicitudes: [solicitud] } }, { modo: "canonico" })))
        : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...casoExplicitoC36([solicitud]), trabajo: { ...casoE.trabajo, rendimientos: casoE.trabajo.rendimientos.map(t => ({ ...t, integro })) }, comunidadAutonoma: "illes-balears", familiaresConDerechoMinimo: "segun-derechos", derechosMinimos })))
      expect(resultado._tag).toBe("Failure")
      if (resultado._tag === "Failure") expect(resultado.failure).toMatchObject({
        _tag: "ResultadoNoSoportado", motivo: expect.stringMatching(rama === "gemelos" ? /orden registral/ : /exclusión documentada/),
      })
    })
  }
}
