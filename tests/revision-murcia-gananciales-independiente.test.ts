import { Effect } from "effect"
import Decimal from "decimal.js"
import { describe, expect, it } from "vitest"
import oracle from "./fixtures/revision-murcia-gananciales-fracciones.json"
import { derechos, magnitudes, solicitud } from "./f-auxiliares-revision-fixtures"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { hechos81 } from "./maternidad-guarderia-fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { consumirCuotaAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota"

// PREPARADA GRANT0. Sin runtime, tipos ni lint. No importa pruebas/esperados del autor.
// Los datos adversos se envían crudos al canal público, sin decode/encode saneador.
type Api = "uniforme" | "explicita"
type Q = { readonly numeradorEuros: string; readonly divisor: string }
const cero = { numeradorEuros: "0", divisor: "1" }
const quinientos = { numeradorEuros: "500", divisor: "1" }
function preparar(api: Api, gasto = "5000", propio = "s-1", ordenante = "s-1", nivel: "normal" | "escasa" | "cero" = "normal") {
  const ajeno = propio === "s-1" ? "s-3" : "s-1"
  const origen = solicitud("murcia", true, gasto), a = origen.auxiliares!, p = origen.hechos.pagos![0]!
  const trabajo = casoExplicitoC36([]).trabajo
  const rentaPropia = nivel === "cero" ? 0 : nivel === "escasa" ? (api === "uniforme" ? 1483360 : 1500000) : (api === "uniforme" ? 2605600 : 2800000)
  const d0 = derechos("murcia", true, rentaPropia)
  const d = { ...d0, contribuyenteId: propio, descendientes: d0.descendientes.map(h => ({ ...h, titulares: h.titulares.map(t => ({ ...t,
    custodia: "no-procede" as const, rentasNoExentasCentimos: t.titularId === propio ? rentaPropia : 3000000,
  })) })) }
  const s = { ...origen, auxiliares: { ...a, estadoCivil: "casado" as const, regimenPagos: "gananciales" as const,
    miembrosUnidad: [propio, ajeno, "s-2"],
    ganancialesMurcia: { referencia: "revision-expediente", conyuges: [propio, ajeno],
      matrimonio: { fecha: "2020-01-01", soporte: "revision-registro-civil" },
      estadoCivil: "casados_no_separados_legalmente" as const, censoCivil: "sin_cambios_2025" as const,
      regimen: { desde: "2020-01-01", hasta: "2025-12-31", soporte: "revision-regimen" }, fondo: "comun_ganancial" as const,
      pagosComunes: [{ pagoId: p.id!, movimientoId: "revision-M1", soportePago: p.soportePago! }] },
    pagadoresMurcia: { referencia: "revision-nominal", ejercicio: 2025 as const, contribuyente: propio,
      censo: "completo" as const, convivencia: "estable_desde_inicio2025_o_nacimiento" as const,
      hijos: [{ id: "s-2", nacimiento: "2025-02-01", progenitores: [propio, ajeno], conviveCon: [propio, ajeno],
        independienteConConsentimiento: false, apoyoJudicial: "ninguno" as const, soporte: "revision-filiacion-padron" }],
      personas: [propio, ajeno].map(id => ({ id, soporte: "revision-cert-" + id, vivoTodo2025: true as const,
        residenteComunTodo2025: true as const, modalidad: "individual" as const,
        residencia: { comunidad: "murcia" as const, desde: "2025-01-01" as const,
          hasta: "2025-12-31" as const, soporte: "revision-residencia-" + id },
        economia: id === propio ? { perfil: "declarante-en-composicion" as const } : {
          perfil: "solo-trabajo" as const, censoRentasCompleto: true as const, otrasRentas: "ninguna" as const,
          reduccionesBase: "ninguna" as const, saldosAnteriores: "ninguno" as const,
          trabajo: { ...trabajo, rendimientos: trabajo.rendimientos.map(r => ({ ...r, integro: "32000" })) },
        } })),
    } }, hechos: { pagos: [{ ...p, pagador: ordenante, atribucion: "comun_ganancial" }] } }
  const m0 = magnitudes("murcia", true)
  return { s, d, nivel, m: { ...m0, caso: { ...m0.caso, contribuyenteId: propio, derechosMinimos: d } } }
}
type Perfil = ReturnType<typeof preparar>
function ejecutar(api: Api, x: Perfil, solicitudes: readonly Perfil["s"][] = [x.s], territorio: "murcia" | "madrid" = "murcia", art81 = false) {
  const u = casoUniformeC36(), e = casoExplicitoC36([])
  const eu = x.nivel === "cero" ? 0 : x.nivel === "escasa" ? 1800000 : 3000000
  const ee = x.nivel === "cero" ? "0" : x.nivel === "escasa" ? "17000" : "30000"
  const uniforme = { ...u, contribuyenteId: x.d.contribuyenteId, comunidadAutonoma: territorio, derechosMinimos: x.d,
    rendimientos: { trabajo: [{ importeIntegroCentimos: eu }] }, deduccionesTerritoriales2025: { solicitudes } }
  const explicita = { ...e, contribuyenteId: x.d.contribuyenteId, comunidadAutonoma: territorio,
    familiaresConDerechoMinimo: "segun-derechos" as const, derechosMinimos: x.d,
    trabajo: { ...e.trabajo, rendimientos: e.trabajo.rendimientos.map(r => ({ ...r, integro: ee })) },
    deduccionesTerritoriales2025: { solicitudes } }
  if (art81) {
    Object.assign(uniforme, { maternidad2025: hechos81() })
    Object.assign(explicita, { maternidad2025: hechos81() })
  }
  const efecto = api === "uniforme"
    ? liquidarIrpfAnual(uniforme, { modo: "canonico" })
    : liquidarIrpfAnualExplicito(explicita)
  const combinado: Effect.Effect<Effect.Success<typeof efecto>, Effect.Error<typeof efecto>> = efecto
  return combinado
}
function comprobarConservacion(q: Q, aplicado: Q, pendiente: Q) {
  const an = BigInt(aplicado.numeradorEuros), ad = BigInt(aplicado.divisor)
  const pn = BigInt(pendiente.numeradorEuros), pd = BigInt(pendiente.divisor)
  expect(an * pd + pn * ad).toBe(500n * ad * pd)
  expect(an * BigInt(q.divisor)).toBe(BigInt(q.numeradorEuros) * ad)
}
function duplicar(x: Perfil, mismoMovimiento: boolean) {
  const p = x.s.hechos.pagos[0]!, a = x.s.auxiliares
  x.s.hechos.pagos.push({ ...p, id: "revision-P2", soportePago: "revision-transferencia2", importeEUR: "0.03", pagador: "s-3" })
  a.servicios = [...a.servicios, { ...a.servicios[0]!, pagoId: "revision-P2" }]
  a.ganancialesMurcia.pagosComunes.push({ pagoId: "revision-P2", movimientoId: mismoMovimiento ? "revision-M1" : "revision-M2", soportePago: "revision-transferencia2" })
}

describe("B09 revisión independiente: un fondo común, dos derechos nominales", () => {
  for (const api of ["uniforme", "explicita"] as const) {
    for (const o of oracle.filter(x => x.cuota === "3000")) for (const propio of ["s-1", "s-3"]) for (const ordenante of ["s-1", "s-3"])
      it(`${api}: gasto ${o.gasto}, declarante ${propio}, ordenante ${ordenante}`, () => {
        const x = preparar(api, o.gasto, propio, ordenante)
        const libro = Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!
        expect(libro.aplicaciones).toHaveLength(1)
        expect(libro.aplicaciones[0]!.generado).toEqual(o.generado)
        expect(libro.aplicaciones[0]!.aplicado).toEqual(o.aplicado)
        expect(libro.aplicaciones[0]!.pendiente).toEqual(o.pendiente)
        expect(libro.total).toEqual(o.aplicado)
        expect(x.s.hechos.pagos).toHaveLength(1)
        expect(x.s.hechos.pagos[0]!.importeEUR).toBe(o.gasto)
      })
    it(`${api}: un solo descuento de500 en el resultado monetario final`, () => {
      const x = preparar(api), r = Effect.runSync(ejecutar(api, x)), sin = Effect.runSync(ejecutar(api, x, []))
      if ("cuotaLiquidaCentimos" in r && "cuotaLiquidaCentimos" in sin)
        expect(sin.cuotaLiquidaCentimos - r.cuotaLiquidaCentimos).toBe(50000)
      else if ("cuotaLiquidaLegal" in r && "cuotaLiquidaLegal" in sin)
        expect(new Decimal(sin.cuotaLiquidaLegal).minus(r.cuotaLiquidaLegal).eq(500)).toBe(true)
      else throw new Error("La API cambió de tipo de resultado")
    })
    it(`${api}: el máximo500 es por hijo y declarante, una sola entrada de1000`, () => {
      const x = preparar(api), a = x.s.auxiliares, p = x.s.hechos.pagos[0]!
      x.d.descendientes.push({ ...x.d.descendientes[0]!, sujetoId: "s-4" })
      a.progenitores = [...a.progenitores, { ...a.progenitores[0]!, hijo: "s-4" }]
      a.pagadoresMurcia.hijos.push({ ...a.pagadoresMurcia.hijos[0]!, id: "s-4" })
      x.s.hechos.pagos.push({ ...p, id: "revision-P4", beneficiarioId: "s-4", factura: "revision-F4", soportePago: "revision-transferencia4" })
      a.servicios = [...a.servicios, { ...a.servicios[0]!, pagoId: "revision-P4" }]
      a.ganancialesMurcia.pagosComunes.push({ pagoId: "revision-P4", movimientoId: "revision-M4", soportePago: "revision-transferencia4" })
      const libro = Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!
      expect(libro.aplicaciones).toHaveLength(1)
      expect(libro.aplicaciones[0]!.generado).toEqual({ numeradorEuros: "1000", divisor: "1" })
      expect(libro.total).toEqual({ numeradorEuros: "1000", divisor: "1" })
    })
    for (const nivel of ["escasa", "cero"] as const) for (const propio of ["s-1", "s-3"]) it(`${api}: cuota pública ${nivel}, declarante ${propio}`, () => {
      const x = preparar(api, "5000", propio, "s-3", nivel)
      const libro = Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!
      if (!("saldoEjercicio" in libro)) throw new Error("Falta saldo del libro único")
      const q = libro.saldoEjercicio.cuotaInicial, a = libro.aplicaciones[0]!
      expect(libro.aplicaciones).toHaveLength(1)
      expect(a.generado).toEqual(quinientos)
      expect(libro.total).toEqual(q)
      expect(a.aplicado).toEqual(q)
      expect(libro.disponible).toEqual(cero)
      if (a.aplicado === undefined || a.pendiente === undefined) throw new Error("Falta conservación de cuota")
      comprobarConservacion(q, a.aplicado, a.pendiente)
      if (nivel === "cero") expect(q).toEqual(cero)
      else {
        expect(BigInt(q.numeradorEuros)).toBeGreaterThan(0n)
        expect(BigInt(q.numeradorEuros)).toBeLessThan(500n * BigInt(q.divisor))
      }
    })
    it(`${api}: dos movimientos reales de una factura, invariantes al orden`, () => {
      const x = preparar(api, "100.01"); duplicar(x, false)
      const antes = JSON.stringify(x)
      for (let i = 0; i < 2; i++) {
        const l = Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!
        expect(l.aplicaciones).toHaveLength(1)
        expect(l.total).toEqual({ numeradorEuros: "2501", divisor: "250" }) // (100.01 + .03)/10
        x.s.hechos.pagos.reverse(); x.s.auxiliares.servicios = [...x.s.auxiliares.servicios].reverse(); x.s.auxiliares.ganancialesMurcia.pagosComunes.reverse()
        x.s.auxiliares.ganancialesMurcia.conyuges.reverse(); x.s.auxiliares.pagadoresMurcia.personas.reverse()
      }
      expect(JSON.stringify(x)).toBe(antes)
    })
    const adversas = ["sin-contrato", "sin-nominal", "solo-matrimonio", "separados", "sin-matrimonio", "cambio-civil", "fondo-privativo", "fecha-imposible", "regimen-invertido", "matrimonio-tardio", "regimen-tardio", "regimen-corto", "soporte-civil-vacio", "conyuge-duplicado", "conyuge-ajeno", "identidad-ajena", "base-ajena-excedida", "renta-grafo-falsa", "residencia-ajena", "base-externa", "cuota-externa", "derecho-externo", "atribucion-externa", "pago-separado", "ordenante-ajeno", "soporte-pago", "sin-movimiento", "movimiento-duplicado", "pago-duplicado", "servicio-duplicado", "pago-fuera", "sin-centro", "concepto", "ayuda", "custodia", "sin-minimo"] as const
    for (const causa of adversas) it(`${api}: dato crudo ${causa}`, () => {
      const x = preparar(api), a = x.s.auxiliares, g = a.ganancialesMurcia, c = a.pagadoresMurcia, p = x.s.hechos.pagos[0]!
      switch (causa) {
        case "sin-contrato": Reflect.deleteProperty(a, "ganancialesMurcia"); break
        case "sin-nominal": Reflect.deleteProperty(a, "pagadoresMurcia"); break
        case "solo-matrimonio": Reflect.deleteProperty(c.personas[1]!, "economia"); break
        case "separados": Object.assign(a, { regimenPagos: "separados" }); break
        case "sin-matrimonio": Object.assign(a, { estadoCivil: "no_casado" }); break
        case "cambio-civil": Object.assign(g, { censoCivil: "cambios_2025" }); break
        case "fondo-privativo": Object.assign(g, { fondo: "privativo" }); break
        case "fecha-imposible": g.matrimonio.fecha = "2020-02-30"; break
        case "regimen-invertido": g.regimen.desde = "2019-12-31"; break
        case "matrimonio-tardio": g.matrimonio.fecha = "2025-03-01"; g.regimen.desde = "2025-03-01"; break
        case "regimen-tardio": g.regimen.desde = "2025-03-01"; break
        case "regimen-corto": g.regimen.hasta = "2025-12-30"; break
        case "soporte-civil-vacio": g.matrimonio.soporte = ""; break
        case "conyuge-duplicado": g.conyuges[1] = g.conyuges[0]!; break
        case "conyuge-ajeno": g.conyuges[1] = "s-7"; break
        case "identidad-ajena": c.contribuyente = "s-3"; break
        case "base-ajena-excedida": {
          const e = c.personas[1]!.economia
          if (e.perfil !== "solo-trabajo") throw new Error("Economía de fixture incorrecta")
          e.trabajo.rendimientos[0]!.integro = "32000.01"
          x.d.descendientes[0]!.titulares[1]!.rentasNoExentasCentimos = 3000001
          break
        }
        case "renta-grafo-falsa": x.d.descendientes[0]!.titulares[1]!.rentasNoExentasCentimos = 1; break
        case "residencia-ajena": Object.assign(c.personas[1]!.residencia, { comunidad: "otra-comunidad-comun" }); break
        case "base-externa": Object.assign(c.personas[1]!, { baseGeneral: "30000" }); break
        case "cuota-externa": Object.assign(g, { cuotaAjena: "500" }); break
        case "derecho-externo": Object.assign(g, { ambosElegibles: true }); break
        case "atribucion-externa": Object.assign(g, { importeAtribuido: "2500" }); break
        case "pago-separado": p.atribucion = "propia_separada"; break
        case "ordenante-ajeno": p.pagador = "s-7"; break
        case "soporte-pago": g.pagosComunes[0]!.soportePago = "otro"; break
        case "sin-movimiento": g.pagosComunes = []; break
        case "movimiento-duplicado": duplicar(x, true); break
        case "pago-duplicado": x.s.hechos.pagos.push({ ...p }); break
        case "servicio-duplicado": a.servicios = [...a.servicios, { ...a.servicios[0]! }]; break
        case "pago-fuera": p.fecha = "2024-12-31"; break
        case "sin-centro": a.centros = []; break
        case "concepto": p.concepto = "transporte"; break
        case "ayuda": p.ayudasEUR = "0.01"; break
        case "custodia": Object.assign(x.d.descendientes[0]!.titulares[0]!, { custodia: "compartida" }); break
        case "sin-minimo": x.d.descendientes[0]!.rentasNoExentasCentimos = 800001; break
      }
      expect(Effect.runSync(Effect.flip(ejecutar(api, x)))._tag).toBe("ResultadoNoSoportado")
    })
    it(`${api}: solicitudes repetidas no duplican cuota ni tope`, () => {
      const x = preparar(api)
      expect(Effect.runSync(Effect.flip(ejecutar(api, x, [x.s, structuredClone(x.s)])))._tag).toBe("ResultadoNoSoportado")
    })
    it(`${api}: contrato ganancial no salta el territorio del contexto anual`, () => {
      const x = preparar(api)
      expect(Effect.runSync(Effect.flip(ejecutar(api, x, [x.s], "madrid")))._tag).toBe("ResultadoNoSoportado")
    })
    it(`${api}: gananciales no habilita concurrencia81 ni segundo consumidor`, () => {
      const x = preparar(api)
      expect(Effect.runSync(Effect.flip(ejecutar(api, x, [x.s], "murcia", true)))._tag).toBe("ResultadoNoSoportado")
    })
    it(`${api}: perfil separado previo mantiene base propia y no traslada pago inelegible`, () => {
      const x = preparar(api), a = x.s.auxiliares
      Reflect.deleteProperty(a, "ganancialesMurcia"); Object.assign(a, { estadoCivil: "no_casado", regimenPagos: "separados" })
      x.s.hechos.pagos[0]!.atribucion = "propia_separada"
      const e = a.pagadoresMurcia.personas[1]!.economia
      if (e.perfil !== "solo-trabajo") throw new Error("Economía de fixture incorrecta")
      e.trabajo.rendimientos[0]!.integro = "32000.01"
      x.d.descendientes[0]!.titulares[1]!.rentasNoExentasCentimos = 3000001
      const conPropio = Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!
      expect(conPropio.total).toEqual({ numeradorEuros: "1000", divisor: "1" })
      x.s.hechos.pagos[0]!.pagador = "s-3"
      expect(Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!.total).toEqual(cero)
    })
  }
  for (const o of oracle) it(`Fraction: gasto ${o.gasto}, cuota ${o.cuota}`, () => {
    const x = preparar("uniforme", o.gasto), r = evaluarAnualF2025(x.s, x.m)
    expect(r.importeExactoRacional).toEqual(o.generado)
    const l = consumirCuotaAnualF2025({ numeradorEuros: o.cuota.replace(".", ""), divisor: o.cuota.includes(".") ? "100" : "1" }, [x.s.codigo], [r])
    expect(l.aplicaciones).toHaveLength(1); expect(l.total).toEqual(o.aplicado)
    expect(l.aplicaciones[0]!.pendiente).toEqual(o.pendiente)
    expect(l.disponible).toEqual(o.disponible)
  })
  it("el grafo nominal no sustituye a la atribución calculada ajena", () => {
    const x = preparar("uniforme")
    expect(evaluarAnualF2025(x.s, { ...x.m, atribucionesMinimo: [{ sujetoId: "s-2", titulares: ["s-1"] }] }).siguienteHecho).toBe("ganancialesMurcia.no_derecho")
  })
  it("la base propia no se sustituye por la civil ni por la ajena", () => {
    const x = preparar("uniforme")
    expect(evaluarAnualF2025(x.s, { ...x.m, baseGeneral: new Decimal("30000") }).importeExactoRacional).toEqual(quinientos)
    expect(evaluarAnualF2025(x.s, { ...x.m, baseGeneral: new Decimal("30000.01") }).estado).toBe("excluida")
  })
})
