import type { SolicitudAnualF2025 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { racional, sumar, restar } from "../anual-territorial-racional"
import { falta, texto, unicos } from "./comun"

/** Sólo hechos concordantes; ni produce art81 ni descuenta su incremento de Murcia. */
export function conciliarMurcia81(s: SolicitudAnualF2025, m: MagnitudesTerritorialesAnuales): void {
  function exigir(b: boolean, motivo: string): asserts b {
    if (!b) falta("conciliacion_art81_custodia_pagos", motivo)
  }
  const libro = m.libroMaternidad81, a = s.auxiliares
  exigir(libro !== undefined && a !== undefined, "Falta libro81 producido por esta composición o censo regional")
  exigir(s.codigo === "murcia_gastos_guarderia" && m.caso.comunidadAutonoma === "murcia" && libro.beneficiaria === m.caso.contribuyenteId, "Libro ajeno a persona/territorio")
  exigir(a.regimenPagos === "separados", "Gananciales requiere otro contrato de atribución")
  const pagos = s.hechos.pagos ?? []
  const ids81 = new Set(libro.hijos.flatMap(h => [h.hijo, ...h.hechos.facturas.flatMap(f => [f.id, ...f.pagos.map(p => p.id), ...f.pagosEmpresa.map(p => p.id)]), ...h.hechos.ayudas.map(x => x.id), ...h.hechos.anticipos140.map(x => x.id)]))
  unicos(pagos.map(p => texto(p.id, "pago.id")), "pagos.id")
  const mismos = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every(id => b.includes(id))
  for (const h of libro.hijos) {
    const d = m.caso.derechosMinimos?.descendientes.find(x => x.sujetoId === h.hijo)
    exigir(d !== undefined && d.titularesCompletos, "Censo de mínimo incompleto")
    const padres = h.hechos.progenitores.map(p => p.id)
    exigir(h.hechos.convivencia === "estable_2025" && mismos(padres, d.titulares.map(t => t.titularId)) && d.titulares.every(t => t.relacion === "convivencia" && t.custodia === "no-procede"), "Filiación/convivencia estable no conciliada; custodia especial requiere otro perfil")
    if (a.pagadoresMurcia === undefined) {
      exigir(padres.length === 1 && padres[0] === libro.beneficiaria, "Varios progenitores requieren pagadoresMurcia y su economía nominal")
    } else {
      const nominal = a.pagadoresMurcia.hijos.find(n => n.id === h.hijo)
      exigir(nominal !== undefined && nominal.nacimiento === h.hechos.nacimiento && mismos(nominal.progenitores, padres) && mismos(nominal.conviveCon, padres), "Censos81 y regional de progenitores contradictorios")
    }
    exigir(m.atribucionesMinimo?.some(x => x.sujetoId === h.hijo && x.titulares.includes(libro.beneficiaria)) === true, "Mínimo efectivo de beneficiaria81 no conciliado")
    for (const f of h.hechos.facturas) {
      // Art81 atribuye ayuda a factura/beneficiario; Murcia a cada pago.
      // La suma por pagador evita inventar un prorrateo entre pagos.
      for (const origen of f.pagos) {
        const p = pagos.find(p => p.id === origen.id)
        exigir(p !== undefined, "Censo regional incompleto: falta pago del libro81")
        const c = h.hechos.centros.find(c => c.id === f.centro)
        const regional = a.centros.find(c => c.id === f.centro)
        exigir(c !== undefined && regional !== undefined && c.clase === "centro_educacion_infantil" && c.autorizacion.clase === "educativa" && regional.autorizacion === c.autorizacion.referencia, "Centro/autorización educativa contradictorio; apertura municipal sola no prueba primer ciclo regional")
        const contrato = h.hechos.calendario.find(x => x.mes === f.mes)?.contratos.find(x => x.centro === f.centro)
        const servicio = a.servicios.find(x => x.pagoId === p.id)
        exigir(contrato !== undefined && servicio !== undefined && servicio.periodo.desde === contrato.desde && servicio.periodo.hasta === contrato.hasta, "Período/centro no conciliado")
        const concepto = f.concepto === "asistencia" ? "custodia" : f.concepto
        exigir(p.factura === f.id && p.beneficiarioId === h.hijo && p.objetoId === f.centro && p.concepto === concepto && p.pagador === origen.pagador && padres.includes(origen.pagador) && p.fecha === origen.fecha && p.atribucion === "propia_separada", "Identidad de hijo, factura, pago, concepto o pagadora contradictoria")
        exigir(restar(racional(texto(p.importeEUR, "pago.importeEUR")), racional(origen.importe)).numeradorEuros === "0", "Importe propio distinto; no trasladar retribución empresarial exenta a Murcia")
      }
      for (const pagador of padres) {
        const ayudas = h.hechos.ayudas.filter(x => x.beneficiario === pagador).reduce((s, ayuda) => {
          exigir(ayuda.atribucion === "nominal", "Ayuda sin beneficiario nominal")
          return sumar(s, ayuda.facturas.filter(x => x.id === f.id).reduce((s, x) => sumar(s, racional(x.importe)), racional("0")))
        }, racional("0"))
        const regionales = pagos.filter(p => p.factura === f.id && p.pagador === pagador)
          .reduce((s, p) => sumar(s, racional(texto(p.ayudasEUR, "pago.ayudasEUR"))), racional("0"))
        exigir(restar(regionales, ayudas).numeradorEuros === "0", "Ayudas públicas por factura/pagador no conciliadas; Murcia resta todas, sin excepciones CyL")
      }
    }
  }
  for (const p of pagos) {
    const compartido = libro.hijos.some(h => h.hechos.facturas.some(f => f.pagos.some(x => x.id === p.id)))
    if (compartido) continue
    exigir(p.concepto === "vestuario_exclusivo_escolar" && !ids81.has(texto(p.id, "pago.id")) && !ids81.has(texto(p.factura, "pago.factura")) && libro.hijos.some(h => h.hijo === p.beneficiarioId), "Pago regional adicional sin clasificación conciliada")
    // Las ayudas adicionales siguen atribuidas a este pago por el contrato regional.
    // El vestuario no entra en el libro81 ni en su límite anual de gasto efectivo.
  }
}
