import { hechos81, ambito81 } from "./maternidad-guarderia-fixtures"
import { producirMaternidad81 } from "../lib/dominio/irpf/maternidad-2025/producir"
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { describe, expect, it } from "vitest"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { cuantiaGuarderiaMurciaExacta, cuantiaNacimientoMadridExacta } from "../lib/dominio/irpf/deducciones/auxiliares-cuantias-exactas-2025"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { SolicitudAnualF2025, type SolicitudAnualF2025 as Solicitud } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import type { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"

function derechos(territorio: "madrid" | "murcia", reparto = false, rentaPropia = 2605600): DerechosMinimosAnuales {
  return { ejercicio: 2025, territorio, regimen: "comun", modalidad: "individual", devengo: "2025-12-31",
    contribuyenteId: "s-1", edadContribuyenteDevengo: 40, discapacidadContribuyente: { _tag: "SinDiscapacidad" },
    ascendientes: "ninguno", fallecimientosEnElEjercicio: "ninguno", descendientesCompletos: true,
    conciliacionRentasContribuyente: { perfil: "caso-anual-parcial", otrasRentasOGastosNoRepresentados: "ninguno" },
    descendientes: [{ sujetoId: "s-2", fechaNacimiento: "2025-02-01", edadDevengo: 0, vivoAlDevengo: true,
      rentasNoExentasCentimos: 0, declaracion: { modalidad: "no-presenta" }, discapacidad: { _tag: "SinDiscapacidad" }, titularesCompletos: true,
      titulares: (reparto ? ["s-1", "s-3"] : ["s-1"]).map(titularId => ({ titularId, grado: 1, vinculo: { clase: "consanguinidad" },
        relacion: "convivencia", custodia: reparto ? "compartida" : "exclusiva", alimentosJudiciales: false, aplicaEspecialidadAlimentos: false,
        residenteIrpf: true, rentasNoExentasCentimos: titularId === "s-1" ? rentaPropia : 2000000 })) }],
  }
}
function solicitud(territorio: "madrid" | "murcia", reparto = false, importe = "100.01"): Solicitud {
  return { lote: "F-ampliado", codigo: territorio === "madrid" ? "madrid_nacimiento_adopcion_hijos" : "murcia_gastos_guarderia",
    auxiliares: { referenciaCenso: "expediente-completo", censo: "completo_eventos_pagos_ayudas_todos_progenitores", conservacionFacturas: "plazo_prescripcion",
      estadoCivil: "no_casado", regimenPagos: "separados", miembrosUnidad: ["s-1", "s-2"],
      progenitores: [{ hijo: "s-2", convivientesDevengo: reparto ? ["s-1", "s-3"] : ["s-1"], referencia: "padron-custodia" }],
      eventos: territorio === "madrid" ? [{ id: "n1", tipo: "nacimiento", fecha: "2025-02-01", hijos: ["s-2"], referencia: "registro" }] : [],
      centros: territorio === "murcia" ? [{ id: "c1", autorizacion: "consejeria", inscripcion: "registro", primerCiclo: [{ desde: "2025-02-01", hasta: "2025-12-31" }] }] : [],
      servicios: territorio === "murcia" ? [{ pagoId: "p1", periodo: { desde: "2025-03-01", hasta: "2025-03-31" } }] : [],
    }, hechos: { pagos: territorio === "murcia" ? [{ id: "p1", importeEUR: importe, ayudasEUR: "0", concepto: "custodia", beneficiarioId: "s-2", objetoId: "c1",
      fecha: "2025-03-31", pagador: "s-1", factura: "f1", soportePago: "transferencia", atribucion: "propia_separada" }] : [] } }
}
function magnitudes(territorio: "madrid" | "murcia", reparto = false, base = "20000"): MagnitudesTerritorialesAnuales {
  return { caso: { ...casoUniformeC36(), comunidadAutonoma: territorio, derechosMinimos: derechos(territorio, reparto) },
    baseGeneral: new Decimal(base), baseAhorro: new Decimal(0), minimoPersonalFamiliar: new Decimal(5550), cuotaAutonomica: new Decimal(3000),
    sujetosConMinimo: ["s-2"], atribucionesMinimo: [{ sujetoId: "s-2", titulares: reparto ? ["s-1", "s-3"] : ["s-1"] }] }
}

describe("Oráculos racionales de autor, pendientes de primera revisión independiente", () => {
  it("conserva medios céntimos y subcéntimos", () => {
    expect(cuantiaNacimientoMadridExacta(1, false, 2)).toEqual(racional("360.85"))
    expect(cuantiaNacimientoMadridExacta(2, true, 1)).toEqual(racional("2886.80"))
    expect(cuantiaGuarderiaMurciaExacta(racional("100.01"), 1)).toEqual(racional("10001", "500"))
    // Dos pagadores NO dividen el gasto propio: 200 de1000 propios; tope500.
    expect(cuantiaGuarderiaMurciaExacta(racional("1000"), 2)).toEqual(racional("200"))
    expect(cuantiaGuarderiaMurciaExacta(racional("3000"), 2)).toEqual(racional("500"))
  })
  for (const territorio of ["madrid", "murcia"] as const) {
    const limite = territorio === "madrid" ? "30930" : "30000"
    it(`${territorio}: compara más de40 cifras sin truncarlas`, () => {
      expect(evaluarAnualF2025(solicitud(territorio), magnitudes(territorio, false, limite)).estado).toBe("calculo_parcial")
      const r = evaluarAnualF2025(solicitud(territorio), magnitudes(territorio, false, limite + ".0000000000000000000000000000000000000001"))
      expect(r.estado).toBe("excluida"); expect(r.importeExactoRacional).toBeUndefined()
    })
    for (const api of ["uniforme", "efectiva"] as const) {
      it(`${territorio}/${api}: rama positiva con reparto de sujetos y cuota común`, () => {
        const s = solicitud(territorio, true)
        const d = derechos(territorio, true, api === "uniforme" ? 2605600 : 2800000)
        const r = api === "uniforme"
          ? Effect.runSync(liquidarIrpfAnual({ ...casoUniformeC36(), comunidadAutonoma: territorio, derechosMinimos: d, deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" }))
          : Effect.runSync(liquidarIrpfAnualExplicito({ ...casoExplicitoC36([]), comunidadAutonoma: territorio, familiaresConDerechoMinimo: "segun-derechos", derechosMinimos: d, deduccionesTerritoriales2025: { solicitudes: [s] } }))
        expect(r.deduccionesTerritoriales2025?.total).toEqual(territorio === "madrid" ? racional("360.85") : racional("10001", "500"))
      })
    }
  }
  it("historia2024 y acogimiento no se hacen pasar por nacimiento2025", () => {
    const s = solicitud("madrid"), h = s.auxiliares!
    for (const e of [{ ...h.eventos[0]!, fecha: "2024-02-01" }, { ...h.eventos[0]!, tipo: "acogimiento" as const }]) {
      const r = evaluarAnualF2025({ ...s, auxiliares: { ...h, eventos: [e] } }, magnitudes("madrid"))
      expect(r.estado).toBe("no_soportado"); expect(r.importeExactoRacional).toBeUndefined()
    }
  })
  it("discrimina fecha, etapa y doble pago externo sin inventar su derecho", () => {
    const s = solicitud("murcia", true), h = s.auxiliares!, p = s.hechos.pagos![0]!
    for (const variante of [
      { ...s, hechos: { pagos: [{ ...p, fecha: "2024-03-31" }] } },
      { ...s, auxiliares: { ...h, centros: [{ ...h.centros[0]!, primerCiclo: [] }] } },
      { ...s, hechos: { pagos: [p, { ...p, id: "p2", factura: "f2", pagador: "s-3" }] }, auxiliares: { ...h, servicios: [...h.servicios, { ...h.servicios[0]!, pagoId: "p2" }] } },
    ]) expect(evaluarAnualF2025(variante, magnitudes("murcia", true)).estado).toBe("no_soportado")
  })
  it("cierra la entrada a bases y saldos calculados por cliente", () => {
    const s = solicitud("madrid")
    expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudAnualF2025)({ ...s, auxiliares: { ...s.auxiliares, baseUnidad: "0" } }, { onExcessProperty: "error" }))).toBe(true)
  })
  it("el canal81 de P3 exige contraste antes de combinar guardería", () => {
    const libro = producirMaternidad81(hechos81(), ambito81(), ["s-2"])
    const m = { ...magnitudes("murcia"), libroMaternidad81: libro }
    expect(evaluarAnualF2025(solicitud("murcia"), m).siguienteHecho).toBe("conciliacion_art81_custodia_pagos")
  })
  it("el canal de hechos81 presente también conserva la reserva antes de combinar", () => {
    const m = magnitudes("murcia")
    const conHechos81 = { ...m, caso: { ...m.caso, maternidad2025: hechos81() } }
    expect(evaluarAnualF2025(solicitud("murcia"), conHechos81).siguienteHecho).toBe("conciliacion_art81_custodia_pagos")
  })
  it("ayudas por menor y facturas duplicadas son discriminantes", () => {
    const s = solicitud("murcia"), p = s.hechos.pagos![0]!
    expect(evaluarAnualF2025({ ...s, hechos: { pagos: [{ ...p, ayudasEUR: "0.01" }] } }, magnitudes("murcia")).importeExactoRacional).toEqual(racional("20"))
    const h = s.auxiliares!
    const duplicado = { ...s, hechos: { pagos: [p, { ...p, id: "p2" }] }, auxiliares: { ...h, servicios: [...h.servicios, { ...h.servicios[0]!, pagoId: "p2" }] } }
    expect(evaluarAnualF2025(duplicado, magnitudes("murcia")).siguienteHecho).toBe("pagos.factura")
  })
  it("adopción2025 usa la constitución, no la fecha de nacimiento", () => {
    const s = solicitud("madrid"), h = s.auxiliares!, m = magnitudes("madrid")
    const d = derechos("madrid")
    const adoptado = { ...d, descendientes: d.descendientes.map(x => ({ ...x, fechaNacimiento: "2020-02-01", edadDevengo: 5,
      titulares: x.titulares.map(t => ({ ...t, vinculo: { clase: "adopcion" as const, fechaInicioIncremento: "2025-02-01", fechaConstitucionVinculo: "2025-02-01", fundamento: "inscripcion-registro-civil" as const, historialCompleto: true as const } })) })) }
    const solicitudAdopcion = { ...s, auxiliares: { ...h, eventos: [{ ...h.eventos[0]!, tipo: "adopcion" as const }] } }
    expect(evaluarAnualF2025(solicitudAdopcion, { ...m, caso: { ...m.caso, derechosMinimos: adoptado } }).importeExactoRacional).toEqual(racional("721.70"))
    expect(evaluarAnualF2025(solicitudAdopcion, m).siguienteHecho).toBe("evento.vinculo_fecha")
  })
})
