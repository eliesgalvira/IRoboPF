import { Effect } from "effect"
import Decimal from "decimal.js"
import { describe, expect, it } from "vitest"
import { derechos, magnitudes, solicitud } from "./f-auxiliares-revision-fixtures"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { consumirCuotaAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"

// Revisión nueva: ningún esperado del autor se importa ni modifica.
// PREPARADO, NO EJECUTADO. El caso subvención total conserva el desacuerdo.
function preparar(api: "uniforme" | "explicita", propio = "5000", ajeno = "1000", bruto = "32000") {
  const original = solicitud("murcia", true, propio)
  const aux = original.auxiliares!
  const pago = original.hechos.pagos![0]!
  const trabajo = casoExplicitoC36([]).trabajo
  const personas = ["s-1", "s-3"].map(id => ({
    id, soporte: "revision-certificado-" + id, vivoTodo2025: true as const,
    residenteComunTodo2025: true as const, modalidad: "individual" as const,
    // SAFETY: «murcia» pertenece a la unión; se amplía para la variante adversa de residencia.
    residencia: { comunidad: "murcia" as "murcia" | "otra-comunidad-comun", desde: "2025-01-01" as const,
      hasta: "2025-12-31" as const, soporte: "residencia-anual" },
    economia: id === "s-1" ? { perfil: "declarante-en-composicion" as const } : {
      perfil: "solo-trabajo" as const, censoRentasCompleto: true as const, otrasRentas: "ninguna" as const,
      reduccionesBase: "ninguna" as const, saldosAnteriores: "ninguno" as const,
      trabajo: { ...trabajo, rendimientos: trabajo.rendimientos.map(r => ({ ...r, integro: bruto })) },
    },
  }))
  const s = { ...original, auxiliares: { ...aux,
    servicios: [...aux.servicios, { ...aux.servicios[0]!, pagoId: "rev-p2" }],
    pagadoresMurcia: { referencia: "revision-independiente", ejercicio: 2025 as const, contribuyente: "s-1",
      censo: "completo" as const, convivencia: "estable_desde_inicio2025_o_nacimiento" as const,
      hijos: [{ id: "s-2", nacimiento: "2025-02-01", progenitores: ["s-1", "s-3"], conviveCon: ["s-1", "s-3"],
        independienteConConsentimiento: false, apoyoJudicial: "ninguno" as const, soporte: "filiacion-padron" }], personas },
  }, hechos: { pagos: [{ ...pago }, { ...pago, id: "rev-p2", factura: "rev-f2", pagador: "s-3", importeEUR: ajeno }] } }
  // Renta nominal conciliada con economía ordinaria, nunca base externa en solicitud.
  const d = derechos("murcia", true, api === "uniforme" ? 2605600 : 2800000)
  const centimosBrutos = BigInt(bruto.replace(".", "").padEnd(bruto.includes(".") ? bruto.length - 1 : bruto.length + 2, "0"))
  const grafo = { ...d, descendientes: d.descendientes.map(h => ({ ...h, titulares: h.titulares.map(t =>
    t.titularId === "s-3" ? { ...t, rentasNoExentasCentimos: Number(centimosBrutos - 200000n) } : t) })) }
  const m = magnitudes("murcia", true)
  return { s, d: grafo, m: { ...m, caso: { ...m.caso, derechosMinimos: grafo } } }
}
type Perfil = ReturnType<typeof preparar>
function ejecutar(api: "uniforme" | "explicita", x: Perfil, sinDeduccion = false) {
  const deduccionesTerritoriales2025 = sinDeduccion ? undefined : { solicitudes: [x.s] }
  const baseUniforme = { ...casoUniformeC36(), comunidadAutonoma: "murcia" as const, derechosMinimos: x.d }
  const uniforme = deduccionesTerritoriales2025 === undefined
    ? baseUniforme : { ...baseUniforme, deduccionesTerritoriales2025 }
  const efecto = api === "uniforme"
    ? liquidarIrpfAnual(uniforme, { modo: "canonico" })
    : liquidarIrpfAnualExplicito({ ...casoExplicitoC36([]), comunidadAutonoma: "murcia", familiaresConDerechoMinimo: "segun-derechos",
      derechosMinimos: x.d, deduccionesTerritoriales2025: deduccionesTerritoriales2025 ?? { solicitudes: [] } })
  const combinado: Effect.Effect<Effect.Success<typeof efecto>, Effect.Error<typeof efecto>> = efecto
  return combinado
}
describe("revisión Murcia: derecho, base y aplicación diferenciados", () => {
  for (const api of ["uniforme", "explicita"] as const) {
    for (const [nombre, propio, ajeno, bruto, ayudaP, ayudaA, esperado] of [
      ["dos pagan", "5000", "1000", "32000", "0", "0", "500"],
      ["gastos desiguales", "1300", "5000", "32000", "0", "0", "260"],
      ["único pagador", "5000", "0", "32000", "0", "0", "1000"],
      ["solo ajeno", "0", "5000", "32000", "0", "0", "0"],
      ["ayuda propia", "100.01", "1000", "32000", "0.01", "0", "20"],
      ["sin redondeo intermedio", "100.01", "1000", "32000", "0", "0", "20.002"],
      ["base ajena un céntimo superior", "5000", "1000", "32000.01", "0", "0", "1000"],
      ["ROJO: pago ajeno íntegramente subvencionado conserva derecho", "5000", "1000", "32000", "0", "1000", "500"],
      ["subvención parcial no altera divisor", "5000", "1000", "32000", "0", "999.99", "500"],
    ]) it(`${api}: ${nombre}`, () => {
      const x = preparar(api, propio, ajeno, bruto)
      x.s.hechos.pagos[0]!.ayudasEUR = ayudaP!
      x.s.hechos.pagos[1]!.ayudasEUR = ayudaA!
      const r = Effect.runSync(ejecutar(api, x)), libro = r.deduccionesTerritoriales2025!
      expect(libro.aplicaciones).toHaveLength(1)
      expect(libro.aplicaciones[0]!.generado).toEqual(racional(esperado!))
      expect(libro.total).toEqual(racional(esperado!))
      if (esperado === "500" || esperado === "1000") {
        const base = Effect.runSync(ejecutar(api, x, true))
        if ("cuotaLiquidaCentimos" in base && "cuotaLiquidaCentimos" in r)
          expect(base.cuotaLiquidaCentimos - r.cuotaLiquidaCentimos).toBe(Number(esperado) * 100)
        else if ("cuotaLiquidaLegal" in base && "cuotaLiquidaLegal" in r)
          expect(new Decimal(base.cuotaLiquidaLegal).minus(r.cuotaLiquidaLegal).eq(esperado)).toBe(true)
        else throw new Error("Resultados de API distintos")
      }
    })
    it(`${api}: residencia ajena distinta elimina su derecho, no transfiere gasto`, () => {
      const x = preparar(api)
      x.s.auxiliares.pagadoresMurcia.personas[1]!.residencia.comunidad = "otra-comunidad-comun"
      expect(Effect.runSync(ejecutar(api, x)).deduccionesTerritoriales2025!.total).toEqual(racional("1000"))
    })
    for (const causa of ["ayuda-excesiva", "factura-contradictoria", "sin-centro", "renta-incoherente", "gananciales", "sin-censo", "identidad-ajena", "base-externa"] as const)
      it(`${api}: rechaza ${causa} en canal público`, () => {
        const x = preparar(api)
        switch (causa) {
          case "ayuda-excesiva": x.s.hechos.pagos[1]!.ayudasEUR = "1000.01"; break
          case "factura-contradictoria":
            x.s.hechos.pagos[1]!.factura = x.s.hechos.pagos[0]!.factura!
            x.s.hechos.pagos[1]!.concepto = "alimentacion"
            break
          case "sin-centro": x.s.auxiliares.centros = []; break
          case "renta-incoherente": Object.assign(x.d.descendientes[0]!.titulares[1]!, { rentasNoExentasCentimos: 1 }); break
          case "gananciales": Object.assign(x.s.auxiliares, { regimenPagos: "gananciales" }); break
          case "sin-censo": Reflect.deleteProperty(x.s.auxiliares, "pagadoresMurcia"); break
          case "base-externa": Object.assign(x.s.auxiliares.pagadoresMurcia.personas[1]!, { baseGeneral: "30000", derecho: true }); break
          case "identidad-ajena": x.s.auxiliares.pagadoresMurcia.contribuyente = "s-3"; break
        }
        expect(Effect.runSync(Effect.flip(ejecutar(api, x)))._tag).toBe("ResultadoNoSoportado")
      })
  }
  it("frontera propia exacta incluye30000 y excluye30000.01", () => {
    const x = preparar("uniforme")
    const enLimite = { ...x.m, baseGeneral: x.m.baseGeneral.plus("10000") }
    expect(evaluarAnualF2025(x.s, enLimite).importeExactoRacional).toEqual(racional("500"))
    expect(evaluarAnualF2025(x.s, { ...enLimite, baseGeneral: enLimite.baseGeneral.plus("0.01") }).estado).toBe("excluida")
  })
  it("mínimo nominal ajeno ausente pese a figurar en el grafo", () => {
    const x = preparar("uniforme")
    expect(evaluarAnualF2025(x.s, { ...x.m, atribucionesMinimo: [{ sujetoId: "s-2", titulares: ["s-1"] }] }).importeExactoRacional).toEqual(racional("1000"))
  })
  it("cuota propia escasa: generado500, aplicado17.03, pendiente482.97, un único consumo", () => {
    const x = preparar("uniforme"), r = evaluarAnualF2025(x.s, x.m)
    const libro = consumirCuotaAnualF2025(racional("17.03"), [x.s.codigo], [r])
    expect(libro.aplicaciones).toHaveLength(1)
    expect(libro.total).toEqual(racional("17.03"))
    expect(libro.disponible).toEqual(racional("0"))
    expect(libro.aplicaciones[0]!.generado).toEqual(racional("500"))
    expect(libro.aplicaciones[0]!.pendiente).toEqual(racional("482.97"))
  })
})
