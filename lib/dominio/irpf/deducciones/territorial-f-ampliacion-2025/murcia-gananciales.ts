import type { SolicitudAnualF2025 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { falta, requerido, texto, fecha, unicos } from "./comun"

/** Primera rama común individual: dos cónyuges elegibles; no crea economía ni consume cuota. */
export function conciliarGanancialesMurcia2025(
  s: SolicitudAnualF2025,
  m: MagnitudesTerritorialesAnuales,
  nominales: ReadonlyMap<string, readonly string[]> | undefined,
): readonly string[] | undefined {
  const a = requerido(s.auxiliares, "auxiliares.censo_documental")
  const g = a.ganancialesMurcia
  if (g === undefined) return undefined
  function exigir(b: boolean, campo: string, motivo: string): asserts b {
    if (!b) falta("ganancialesMurcia." + campo, motivo)
  }
  exigir(a.regimenPagos === "gananciales" && a.estadoCivil === "casado", "regimen", "Hechos civiles contradictorios: matrimonio ganancial, sin pagos separados")
  exigir(s.codigo === "murcia_gastos_guarderia" && m.caso.situacionFamiliar.tipo === "individual" && m.caso.fechaFallecimiento === undefined,
    "perfil", "Sólo Murcia individual ordinaria; conjunta y fallecimientos requieren otro contrato")
  exigir(m.libroMaternidad81 === undefined && !("maternidad2025" in m.caso && m.caso.maternidad2025 !== undefined),
    "art81", "Concurrencia81 ganancial pendiente de un contrato de conciliación común")
  texto(g.referencia, "ganancialesMurcia.referencia")
  texto(g.matrimonio.soporte, "ganancialesMurcia.matrimonio.soporte")
  texto(g.regimen.soporte, "ganancialesMurcia.regimen.soporte")
  exigir(fecha(g.matrimonio.fecha, "ganancialesMurcia.matrimonio.fecha") <= "2025-01-01" &&
    fecha(g.regimen.desde, "ganancialesMurcia.regimen.desde") <= "2025-01-01" &&
    g.regimen.desde >= g.matrimonio.fecha && fecha(g.regimen.hasta, "ganancialesMurcia.regimen.hasta") === "2025-12-31",
    "periodos", "Matrimonio y régimen deben cubrir todo2025; cambios civiles requieren perfil propio")
  unicos(g.conyuges, "ganancialesMurcia.conyuges")
  const c = requerido(a.pagadoresMurcia, "ganancialesMurcia.censo_nominal")
  exigir(nominales !== undefined && g.conyuges.length === 2 && g.conyuges.includes(m.caso.contribuyenteId!) &&
    c.personas.length === 2 && c.personas.every(p => g.conyuges.includes(p.id)),
    "conyuges", "Dos cónyuges identificados en el mismo censo económico completo")
  const ds = m.caso.derechosMinimos?.descendientes ?? []
  for (const h of c.hijos) {
    const d = ds.find(d => d.sujetoId === h.id)
    exigir(h.progenitores.length === 2 && h.progenitores.every(id => g.conyuges.includes(id)) &&
      d !== undefined && d.titulares.every(t => t.custodia === "no-procede"),
      "no_separados", "Convivencia con ambos casados: custodia especial o separación requiere otro perfil")
    exigir(g.conyuges.every(id => nominales.get(id)?.includes(h.id)),
      "no_derecho", "Falta derecho regional producido de ambos para el mismo hijo; no extrapolar al único elegible")
  }
  // Cuando el anual tiene un censo civil compartido, no puede contradecir el nominal.
  const civil = m.libroBasesFamiliares2025
  if (civil !== undefined) exigir(civil.ejercicio === 2025 && civil.contribuyente === m.caso.contribuyenteId &&
    civil.estadoCivil === "casado-no-separado" && civil.conyuge !== undefined &&
    g.conyuges.includes(civil.conyuge) && civil.conyuge !== m.caso.contribuyenteId,
    "censo_civil", "Estado civil/cónyuge contradictorio con el libro familiar anual")
  const pagos = s.hechos.pagos ?? []
  unicos(g.pagosComunes.map(p => p.pagoId), "ganancialesMurcia.pagosComunes")
  unicos(g.pagosComunes.map(p => p.movimientoId), "ganancialesMurcia.movimientos")
  exigir(g.pagosComunes.length === pagos.length && g.pagosComunes.every(x => pagos.some(p => p.id === x.pagoId)),
    "pagos", "Censo completo de movimientos comunes debe coincidir con los pagos físicos")
  for (const x of g.pagosComunes) {
    const p = pagos.find(p => p.id === x.pagoId)!
    texto(x.soportePago, "ganancialesMurcia.soportePago")
    exigir(p.soportePago === x.soportePago && g.conyuges.includes(texto(p.pagador, "pago.pagador")),
      "movimiento", "Ordenante y soporte del movimiento no conciliados; no fabricar pagos por atribución")
  }
  return g.conyuges
}
