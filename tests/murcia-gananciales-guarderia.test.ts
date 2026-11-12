import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import oraculos from "./fixtures/murcia-gananciales-fracciones.json"
import { hechos81 } from "./maternidad-guarderia-fixtures"
import { derechos, magnitudes, solicitud } from "./f-auxiliares-revision-fixtures"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { consumirCuotaAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"

// PREPARADO GRANT0: sin ejecución ni comprobación TS. Esperados Fraction independientes.
type Api = "uniforme" | "explicita"
function perfil(api: Api, importe = "5000", ordenante = "s-1", bruto = "32000") {
  const previo = solicitud("murcia", true, importe), aux = previo.auxiliares!, pago = previo.hechos.pagos![0]!
  const trabajo = casoExplicitoC36([]).trabajo
  const d = derechos("murcia", true, api === "uniforme" ? 2605600 : 2800000)
  const centimos = BigInt(bruto.replace(".", "").padEnd(bruto.includes(".") ? bruto.length - 1 : bruto.length + 2, "0"))
  const grafo = { ...d, descendientes: d.descendientes.map(h => ({ ...h, titulares: h.titulares.map(t => ({ ...t,
    custodia: "no-procede" as const, rentasNoExentasCentimos: t.titularId === "s-3" ? Number(centimos - 200000n) : t.rentasNoExentasCentimos })) })) }
  const s = { ...previo, auxiliares: { ...aux, estadoCivil: "casado" as const, regimenPagos: "gananciales" as const,
    miembrosUnidad: ["s-1", "s-3", "s-2"],
    ganancialesMurcia: { referencia: "expediente-civil-comun", conyuges: ["s-1", "s-3"],
      matrimonio: { fecha: "2020-01-01", soporte: "registro-civil" },
      estadoCivil: "casados_no_separados_legalmente" as const, censoCivil: "sin_cambios_2025" as const,
      regimen: { desde: "2020-01-01", hasta: "2025-12-31", soporte: "certificado-regimen" },
      fondo: "comun_ganancial" as const,
      pagosComunes: [{ pagoId: pago.id!, movimientoId: "movimiento1", soportePago: pago.soportePago! }] },
    pagadoresMurcia: { referencia: "censo-completo", ejercicio: 2025 as const, contribuyente: "s-1", censo: "completo" as const,
      convivencia: "estable_desde_inicio2025_o_nacimiento" as const,
      hijos: [{ id: "s-2", nacimiento: "2025-02-01", progenitores: ["s-1", "s-3"], conviveCon: ["s-1", "s-3"],
        independienteConConsentimiento: false, apoyoJudicial: "ninguno" as const, soporte: "filiacion-padron" }],
      personas: ["s-1", "s-3"].map(id => ({ id, soporte: "cert-" + id, vivoTodo2025: true as const,
        residenteComunTodo2025: true as const, modalidad: "individual" as const,
        residencia: { comunidad: "murcia" as const, desde: "2025-01-01" as const, hasta: "2025-12-31" as const, soporte: "residencia-" + id },
        economia: id === "s-1" ? { perfil: "declarante-en-composicion" as const } : {
          perfil: "solo-trabajo" as const, censoRentasCompleto: true as const, otrasRentas: "ninguna" as const,
          reduccionesBase: "ninguna" as const, saldosAnteriores: "ninguno" as const,
          trabajo: { ...trabajo, rendimientos: trabajo.rendimientos.map(r => ({ ...r, integro: bruto })) } } })),
    } }, hechos: { pagos: [{ ...pago, pagador: ordenante, atribucion: "comun_ganancial" }] } }
  const m = magnitudes("murcia", true)
  return { s, d: grafo, m: { ...m, caso: { ...m.caso, derechosMinimos: grafo } } }
}
type Perfil = ReturnType<typeof perfil>
function ejecutar(api: Api, x: Perfil, cuotaCero = false) {
  const uniforme = casoUniformeC36(), explicita = casoExplicitoC36([])
  const efecto = api === "uniforme"
    ? liquidarIrpfAnual({ ...uniforme, contribuyenteId: x.d.contribuyenteId, comunidadAutonoma: "murcia", derechosMinimos: x.d,
        rendimientos: cuotaCero ? { trabajo: [{ importeIntegroCentimos: 0 }] } : uniforme.rendimientos,
        deduccionesTerritoriales2025: { solicitudes: [x.s] } }, { modo: "canonico" })
    : liquidarIrpfAnualExplicito({ ...explicita, contribuyenteId: x.d.contribuyenteId, comunidadAutonoma: "murcia", familiaresConDerechoMinimo: "segun-derechos",
        trabajo: cuotaCero ? { ...explicita.trabajo, rendimientos: explicita.trabajo.rendimientos.map(r => ({ ...r, integro: "0" })) } : explicita.trabajo,
        derechosMinimos: x.d, deduccionesTerritoriales2025: { solicitudes: [x.s] } })
  const combinado: Effect.Effect<Effect.Success<typeof efecto>, Effect.Error<typeof efecto>> = efecto
  return combinado
}
describe("Murcia gananciales: dos derechos, un movimiento físico y cuota propia", () => {
  for (const api of ["uniforme", "explicita"] as const) {
    for (const o of oraculos.filter(o => o.cuota === "3000")) for (const ordenante of ["s-1", "s-3"])
      it(`${api}: gasto íntegro${o.importe}, ordenante${ordenante}, sin cuantizar mitad`, () => {
        const x = perfil(api, o.importe, ordenante)
        const libro = Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!
        expect(libro.aplicaciones).toHaveLength(1)
        expect(libro.aplicaciones[0]!.generado).toEqual(o.generado)
        expect(libro.total).toEqual(o.generado)
        expect(x.s.hechos.pagos).toHaveLength(1)
        expect(x.s.hechos.pagos[0]!.importeEUR).toBe(o.importe)
      })
    it(`${api}: orden de personas y cónyuges no altera derecho ni importe`, () => {
      const x = perfil(api, "100.01")
      x.s.auxiliares.ganancialesMurcia.conyuges.reverse()
      x.s.auxiliares.pagadoresMurcia.personas.reverse()
      x.s.auxiliares.pagadoresMurcia.hijos[0]!.progenitores.reverse()
      x.s.auxiliares.progenitores = x.s.auxiliares.progenitores.map(p => ({ ...p, convivientesDevengo: [...p.convivientesDevengo].reverse() }))
      expect(Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!.total).toEqual(racional("10.001"))
    })
    it(`${api}: dos movimientos de la misma factura conservan suma y orden`, () => {
      const x = perfil(api, "100.01"), p = x.s.hechos.pagos[0]!, a = x.s.auxiliares
      x.s.hechos.pagos.push({ ...p, id: "p2", importeEUR: "0.01", pagador: "s-3", soportePago: "transferencia2" })
      a.servicios = [...a.servicios, { ...a.servicios[0]!, pagoId: "p2" }]
      a.ganancialesMurcia.pagosComunes.push({ pagoId: "p2", movimientoId: "movimiento2", soportePago: "transferencia2" })
      for (let orden = 0; orden < 2; orden++) {
        expect(Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!.total).toEqual(racional("10.002"))
        x.s.hechos.pagos.reverse(); a.servicios = [...a.servicios].reverse(); a.ganancialesMurcia.pagosComunes.reverse()
      }
    })
    it(`${api}: cónyuge alternativo se calcula por su identidad propia`, () => {
      const x = perfil(api, "100.01")
      function ids<T>(valor: T): T {
        return JSON.parse(JSON.stringify(valor).replaceAll('"s-1"', '"s-9"').replaceAll('"s-3"', '"s-1"').replaceAll('"s-9"', '"s-3"'))
      }
      x.s = ids(x.s); x.d = ids(x.d)
      expect(Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!.total).toEqual(racional("10.001"))
    })
    it(`${api}: cuota propia agotada genera500 y aplica0 en una sola entrada`, () => {
      const x = perfil(api)
      for (const t of x.d.descendientes[0]!.titulares) if (t.titularId === x.d.contribuyenteId) t.rentasNoExentasCentimos = 0
      const libro = Effect.runSync(ejecutar(api, x, true)).deduccionesTerritoriales2025!
      expect(libro.aplicaciones).toHaveLength(1)
      expect(libro.aplicaciones[0]!.generado).toEqual(racional("500"))
      expect(libro.total).toEqual(racional("0"))
      expect(libro.aplicaciones[0]!.pendiente).toEqual(racional("500"))
    })
    for (const causa of ["no_derecho", "no_separados", "sin_contrato", "separados", "no_casados", "periodo", "civil_cambiado", "ayudas", "duplicado", "movimiento", "identidad", "base_externa", "sin_centro", "concepto", "sin_minimo"] as const)
      it(`${api}: rechazo concreto${causa}`, () => {
        const x = perfil(api, "5000", "s-1", causa === "no_derecho" ? "32000.01" : "32000")
        switch (causa) {
          case "no_separados": for (const t of x.d.descendientes[0]!.titulares) Object.assign(t, { custodia: "compartida" }); break
          case "sin_contrato": Reflect.deleteProperty(x.s.auxiliares, "ganancialesMurcia"); break
          case "separados": Object.assign(x.s.auxiliares, { regimenPagos: "separados" }); break
          case "no_casados": Object.assign(x.s.auxiliares, { estadoCivil: "no_casado" }); break
          case "periodo": x.s.auxiliares.ganancialesMurcia.regimen.desde = "2025-03-01"; break
          case "civil_cambiado": Object.assign(x.s.auxiliares.ganancialesMurcia, { censoCivil: "cambios_2025" }); break
          case "ayudas": x.s.hechos.pagos[0]!.ayudasEUR = "0.01"; break
          case "duplicado": x.s.hechos.pagos.push({ ...x.s.hechos.pagos[0]! }); break
          case "movimiento": x.s.auxiliares.ganancialesMurcia.pagosComunes[0]!.soportePago = "otro-soporte"; break
          case "identidad": x.s.auxiliares.pagadoresMurcia.contribuyente = "s-3"; break
          case "base_externa": Object.assign(x.s.auxiliares.pagadoresMurcia.personas[1]!, { baseGeneral: "30000", derecho: true, cuota: "500" }); break
          case "sin_centro": x.s.auxiliares.centros = []; break
          case "concepto": x.s.hechos.pagos[0]!.concepto = "transporte"; break
          case "sin_minimo": x.d.descendientes[0]!.rentasNoExentasCentimos = 800001; break
        }
        expect(Effect.runSync(Effect.flip(ejecutar(api, x)))._tag).toBe("ResultadoNoSoportado")
      })
  }
  for (const o of oraculos) it(`libro único con cuota${o.cuota},gasto${o.importe}`, () => {
    const x = perfil("uniforme", o.importe), r = evaluarAnualF2025(x.s, x.m)
    expect(r.importeExactoRacional).toEqual(o.generado)
    const libro = consumirCuotaAnualF2025(racional(o.cuota), [x.s.codigo], [r])
    expect(libro.aplicaciones).toHaveLength(1)
    expect(libro.aplicaciones[0]!.generado).toEqual(o.generado)
    expect(libro.total).toEqual(o.aplicado)
    expect(libro.aplicaciones[0]!.pendiente).toEqual(o.pendiente)
  })
  it("un movimiento repetido bajo distinto pago no duplica el gasto", () => {
    const x = perfil("uniforme"), p = x.s.hechos.pagos[0]!, g = x.s.auxiliares.ganancialesMurcia
    x.s.hechos.pagos.push({ ...p, id: "p2" })
    x.s.auxiliares.servicios = [...x.s.auxiliares.servicios, { ...x.s.auxiliares.servicios[0]!, pagoId: "p2" }]
    g.pagosComunes.push({ ...g.pagosComunes[0]!, pagoId: "p2" })
    expect(evaluarAnualF2025(x.s, x.m).siguienteHecho).toBe("ganancialesMurcia.movimientos")
  })
  it("concurrencia81 no se abre por el contrato regional", () => {
    const x = perfil("uniforme")
    const caso = { ...x.m.caso, maternidad2025: hechos81() }
    // No se fabrica libro81 ni se aplica un segundo consumidor de cuota.
    expect(evaluarAnualF2025(x.s, { ...x.m, caso }).estado).toBe("no_soportado")
  })
  it("control separado previo: gasto propio100.01 conserva20.002", () => {
    const s = solicitud("murcia", false, "100.01"), m = magnitudes("murcia")
    expect(evaluarAnualF2025(s, m).importeExactoRacional).toEqual(racional("20.002"))
    expect(evaluarAnualF2025({ ...s, auxiliares: { ...s.auxiliares!, regimenPagos: "gananciales" } }, m).siguienteHecho).toBe("pagos.regimen_gananciales")
  })
})
