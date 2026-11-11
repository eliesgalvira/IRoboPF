import { Effect, Result, Schema } from "effect"
import { describe, expect, it } from "vitest"
import { derechos, magnitudes, solicitud } from "./f-auxiliares-revision-fixtures"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { consumirCuotaAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

// Esperados de autor: art1.Tres y precisión AEAT2025. Pendientes de ejecución y revisión independiente.
function perfil(propio = "5000", ajeno = "1000", bruto = "32000", rentaPropia = 2605600) {
  const s = solicitud("murcia", true, propio), a = s.auxiliares!, p = s.hechos.pagos![0]!
  const trabajo = casoExplicitoC36([]).trabajo
  const pagadoresMurcia = {
    referencia: "padron-registro-y-certificados", ejercicio: 2025 as const, contribuyente: "s-1", censo: "completo" as const,
    convivencia: "estable_desde_inicio2025_o_nacimiento" as const,
    hijos: [{ id: "s-2", nacimiento: "2025-02-01", progenitores: ["s-1", "s-3"], conviveCon: ["s-1", "s-3"],
      independienteConConsentimiento: false, apoyoJudicial: "ninguno" as const, soporte: "registro-padron-continuo" }],
    personas: [
      { id: "s-1", soporte: "certificado-propio", vivoTodo2025: true as const, residenteComunTodo2025: true as const,
        residencia: { comunidad: "murcia" as const, desde: "2025-01-01" as const, hasta: "2025-12-31" as const, soporte: "residencia1" },
        modalidad: "individual" as const, economia: { perfil: "declarante-en-composicion" as const } },
      { id: "s-3", soporte: "certificado-ajeno", vivoTodo2025: true as const, residenteComunTodo2025: true as const,
        residencia: { comunidad: "murcia" as const, desde: "2025-01-01" as const, hasta: "2025-12-31" as const, soporte: "residencia3" },
        modalidad: "individual" as const, economia: { perfil: "solo-trabajo" as const, censoRentasCompleto: true as const,
          otrasRentas: "ninguna" as const, reduccionesBase: "ninguna" as const, saldosAnteriores: "ninguno" as const,
          trabajo: { ...trabajo, rendimientos: trabajo.rendimientos.map(r => ({ ...r, integro: bruto })) } } },
    ],
  }
  const seleccion = { ...s, auxiliares: { ...a, pagadoresMurcia,
    servicios: [...a.servicios, { ...a.servicios[0]!, pagoId: "p2" }] },
    hechos: { pagos: [p, { ...p, id: "p2", factura: "f2", pagador: "s-3", importeEUR: ajeno }] } }
  const d = derechos("murcia", true, rentaPropia)
  const grafo = { ...d, descendientes: d.descendientes.map(h => ({ ...h, titulares: h.titulares.map(t =>
    t.titularId === "s-3" ? { ...t, rentasNoExentasCentimos: Math.round((Number(bruto) - 2000) * 100) } : t) })) }
  const m = magnitudes("murcia", true)
  return { s: seleccion, d: grafo, m: { ...m, caso: { ...m.caso, derechosMinimos: grafo } } }
}

function sinCenso(s: ReturnType<typeof perfil>["s"]) {
  const { pagadoresMurcia, ...auxiliares } = s.auxiliares
  void pagadoresMurcia
  return { ...s, auxiliares }
}

describe("Murcia: derecho nominal, pagos separados y una sola cuota", () => {
  for (const api of ["uniforme", "explicita"] as const) {
    for (const [propio, ajeno, bruto, esperado] of [
      ["5000", "1000", "32000", "500"], // Otro: base30000, derecho, tope500.
      ["5000", "1000", "32000.01", "1000"], // Base30000.01: no derecho; no se transfiere su gasto.
      ["1000", "5000", "32000", "200"], // Desigualdad: nunca divide el gasto ni suma el ajeno.
      ["5000", "0", "32000", "1000"], // Convivencia y mínimo sin gasto no reparten tope.
      ["0", "5000", "32000", "0"], // No atribuye gasto ajeno al declarante.
      ["100.01", "1000", "32000", "20.002"],
    ]) {
      it(`${api}: propios=${propio}, ajenos=${ajeno}, íntegroOtro=${bruto}`, () => {
        const x = perfil(propio, ajeno, bruto, api === "uniforme" ? 2605600 : 2800000)
        const r = api === "uniforme"
          ? Effect.runSync(liquidarIrpfAnual({ ...casoUniformeC36(), comunidadAutonoma: "murcia", derechosMinimos: x.d,
            deduccionesTerritoriales2025: { solicitudes: [x.s] } }, { modo: "canonico" }))
          : Effect.runSync(liquidarIrpfAnualExplicito({ ...casoExplicitoC36([]), comunidadAutonoma: "murcia", familiaresConDerechoMinimo: "segun-derechos",
            derechosMinimos: x.d, deduccionesTerritoriales2025: { solicitudes: [x.s] } }))
        expect(r.deduccionesTerritoriales2025?.total).toEqual(racional(esperado))
        expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
        expect(r.deduccionesTerritoriales2025?.aplicaciones[0]?.generado).toEqual(racional(esperado))
      })
    }
    it(`${api}: ayudas y residencia nominal ajena no transfieren su gasto`, () => {
      const x = perfil("100.01", "5000", "32000", api === "uniforme" ? 2605600 : 2800000)
      const a = x.s.auxiliares, c = a.pagadoresMurcia, pagos = x.s.hechos.pagos
      const s = { ...x.s, auxiliares: { ...a, pagadoresMurcia: { ...c, personas: c.personas.map(p => p.id === "s-3"
        ? { ...p, residencia: { ...p.residencia, comunidad: "otra-comunidad-comun" as const } } : p) } },
        hechos: { pagos: [{ ...pagos[0]!, ayudasEUR: "0.01" }, pagos[1]!] } }
      const r = api === "uniforme"
        ? Effect.runSync(liquidarIrpfAnual({ ...casoUniformeC36(), comunidadAutonoma: "murcia", derechosMinimos: x.d,
          deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" }))
        : Effect.runSync(liquidarIrpfAnualExplicito({ ...casoExplicitoC36([]), comunidadAutonoma: "murcia", familiaresConDerechoMinimo: "segun-derechos",
          derechosMinimos: x.d, deduccionesTerritoriales2025: { solicitudes: [s] } }))
      expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("20"))
    })
    it(`${api}: censo ausente y factura contradictoria conservan rechazo público`, () => {
      const x = perfil("1000")
      const pagos = x.s.hechos.pagos
      for (const s of [
        sinCenso(x.s),
        { ...x.s, hechos: { pagos: [pagos[0]!, { ...pagos[1]!, factura: pagos[0]!.factura!, concepto: "matricula" }] } },
      ]) {
        const d = perfil("1000", "1000", "32000", api === "uniforme" ? 2605600 : 2800000).d
        const e = api === "uniforme"
          ? Effect.runSync(Effect.flip(liquidarIrpfAnual({ ...casoUniformeC36(), comunidadAutonoma: "murcia", derechosMinimos: d,
            deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" })))
          : Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({ ...casoExplicitoC36([]), comunidadAutonoma: "murcia", familiaresConDerechoMinimo: "segun-derechos",
            derechosMinimos: d, deduccionesTerritoriales2025: { solicitudes: [s] } })))
        expect(e._tag).toBe("ResultadoNoSoportado")
      }
    })
  }
  it("deriva residencia y no presupone derecho por figurar en mínimos", () => {
    const x = perfil(), a = x.s.auxiliares, c = a.pagadoresMurcia
    const otraResidencia = { ...c, personas: c.personas.map(p => p.id === "s-3" ? { ...p,
      residencia: { ...p.residencia, comunidad: "otra-comunidad-comun" as const } } : p) }
    expect(evaluarAnualF2025({ ...x.s, auxiliares: { ...a, pagadoresMurcia: otraResidencia } }, x.m).importeExactoRacional).toEqual(racional("1000"))
    expect(evaluarAnualF2025(x.s, { ...x.m, atribucionesMinimo: [{ sujetoId: "s-2", titulares: ["s-1"] }] }).importeExactoRacional).toEqual(racional("1000"))
  })
  it("economía sin rentas se deriva sin base fiscal externa", () => {
    const x = perfil(), a = x.s.auxiliares, c = a.pagadoresMurcia
    const d = { ...x.d, descendientes: x.d.descendientes.map(h => ({ ...h, titulares: h.titulares.map(t => t.titularId === "s-3" ? { ...t, rentasNoExentasCentimos: 0 } : t) })) }
    const s = { ...x.s, auxiliares: { ...a, pagadoresMurcia: { ...c, personas: c.personas.map(p => p.id === "s-3" ? { ...p,
      economia: { perfil: "sin-rentas" as const, censoRentasCompleto: true as const } } : p) } } }
    expect(evaluarAnualF2025(s, { ...x.m, caso: { ...x.m.caso, derechosMinimos: d } }).importeExactoRacional).toEqual(racional("500"))
  })
  it("ayudas se descuentan sólo del gasto y menor al que se atribuyen", () => {
    const x = perfil("100.01"), pagos = x.s.hechos.pagos
    const r = evaluarAnualF2025({ ...x.s, hechos: { pagos: [{ ...pagos[0]!, ayudasEUR: "0.01" }, pagos[1]!] } }, x.m)
    expect(r.importeExactoRacional).toEqual(racional("20"))
    expect(evaluarAnualF2025({ ...x.s, hechos: { pagos: [{ ...pagos[0]!, ayudasEUR: "100.02" }, pagos[1]!] } }, x.m).siguienteHecho).toBe("pago.ayudasEUR")
  })
  it("ayuda ajena minora su base sin eliminar el reparto nominal del límite", () => {
    const x = perfil(), pagos = x.s.hechos.pagos
    const s = { ...x.s, hechos: { pagos: [pagos[0]!, { ...pagos[1]!, ayudasEUR: "1000" }] } }
    // Corrección P1: art.1.Tres separa derecho y pago de la minoración por ayudas.
    expect(evaluarAnualF2025(s, x.m).importeExactoRacional).toEqual(racional("500"))
  })
  it("todos los conceptos legales conservan base, los demás conservan causa", () => {
    const x = perfil("100.01"), pagos = x.s.hechos.pagos
    for (const concepto of ["custodia", "matricula", "preinscripcion", "alimentacion", "vestuario_exclusivo_escolar"]) {
      expect(evaluarAnualF2025({ ...x.s, hechos: { pagos: [{ ...pagos[0]!, concepto }, pagos[1]!] } }, x.m).importeExactoRacional).toEqual(racional("20.002"))
    }
    expect(evaluarAnualF2025({ ...x.s, hechos: { pagos: [{ ...pagos[0]!, concepto: "transporte" }, pagos[1]!] } }, x.m).siguienteHecho).toBe("pago.concepto")
  })
  it("rechazos concretos de identidad, economía y contrato", () => {
    const x = perfil(), a = x.s.auxiliares, c = a.pagadoresMurcia, ps = x.s.hechos.pagos
    for (const [s, causa] of [
      [sinCenso(x.s), "productor_derecho_progenitor_externo:s-3"],
      [{ ...x.s, auxiliares: { ...a, pagadoresMurcia: { ...c, personas: [...c.personas, c.personas[1]!] } } }, "pagadoresMurcia.personas"],
      [{ ...x.s, auxiliares: { ...a, pagadoresMurcia: { ...c, contribuyente: "s-3" } } }, "pagadoresMurcia.identidad"],
      [{ ...x.s, auxiliares: { ...a, pagadoresMurcia: { ...c, hijos: c.hijos.map(h => ({ ...h, nacimiento: "2024-02-01" })) } } }, "pagadoresMurcia.familia_estable"],
      [{ ...x.s, hechos: { pagos: [ps[0]!, { ...ps[1]!, pagador: "s-4" }] } }, "pagadoresMurcia.pagador"],
      [{ ...x.s, hechos: { pagos: [ps[0]!, { ...ps[1]!, id: "p1" }] } }, "pagos.id"],
      [{ ...x.s, auxiliares: { ...a, regimenPagos: "gananciales" as const } }, "pagos.regimen_gananciales"],
    ] as const) expect(evaluarAnualF2025(s, x.m).siguienteHecho).toBe(causa)
    const contradiccion = { ...x.m, caso: { ...x.m.caso, derechosMinimos: derechos("murcia", true) } }
    expect(evaluarAnualF2025(x.s, contradiccion).siguienteHecho).toBe("pagadoresMurcia.renta_grafo")
  })
  it("rechaza elegibilidad, cuota y bases precalculadas incluso anidadas", () => {
    const x = perfil(), a = x.s.auxiliares, c = a.pagadoresMurcia
    for (const delta of [{ baseGeneral: "30000" }, { derecho: true }, { cuota: "500" }]) {
      const s = { ...x.s, auxiliares: { ...a, pagadoresMurcia: { ...c, personas: c.personas.map(p => ({ ...p, ...delta })) } } }
      expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudAnualF2025)(s, { onExcessProperty: "error" }))).toBe(true)
    }
  })
  it("frontera propia inclusiva sin redondear para decidir", () => {
    const x = perfil()
    const enLimite = { ...x.m, baseGeneral: x.m.baseGeneral.plus(10000) }
    expect(evaluarAnualF2025(x.s, enLimite).importeExactoRacional).toEqual(racional("500"))
    expect(evaluarAnualF2025(x.s, { ...enLimite, baseGeneral: enLimite.baseGeneral.plus("0.01") }).estado).toBe("excluida")
  })
  it("consume sólo la cuota propia disponible una vez", () => {
    const x = perfil(), r = evaluarAnualF2025(x.s, x.m)
    const libro = consumirCuotaAnualF2025(racional("17.03"), [x.s.codigo], [r])
    expect(libro.total).toEqual(racional("17.03")); expect(libro.disponible).toEqual(racional("0"))
    expect(libro.aplicaciones[0]?.generado).toEqual(racional("500"))
    expect(libro.aplicaciones[0]?.pendiente).toEqual(racional("482.97"))
  })
})
