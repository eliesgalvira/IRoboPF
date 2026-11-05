import Decimal from "decimal.js"
import { type SolicitudAnualF2025 as Solicitud } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import type { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { casoUniformeC36 } from "./c36-conexion-anual.fixtures"

export function derechos(territorio: "madrid" | "murcia", reparto = false, rentaPropia = 2605600): DerechosMinimosAnuales {
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
export function solicitud(territorio: "madrid" | "murcia", reparto = false, importe = "100.01"): Solicitud {
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
export function magnitudes(territorio: "madrid" | "murcia", reparto = false, base = "20000"): MagnitudesTerritorialesAnuales {
  return { caso: { ...casoUniformeC36(), comunidadAutonoma: territorio, derechosMinimos: derechos(territorio, reparto) },
    baseGeneral: new Decimal(base), baseAhorro: new Decimal(0), minimoPersonalFamiliar: new Decimal(5550), cuotaAutonomica: new Decimal(3000),
    sujetosConMinimo: ["s-2"], atribucionesMinimo: [{ sujetoId: "s-2", titulares: reparto ? ["s-1", "s-3"] : ["s-1"] }] }
}

