import type { SolicitudDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial-esquemas"
/** Selección de atribución de cuota, sin importar bases, saldos ni cuotas públicas.
 * Art67/77: suma con suelo cero; la selección no pretende imponer prioridad legal.
 * El donativo ya está en las cuentas DT18: no se vuelve a restar al patrimonio.
 */
export function validarConcurrenciaDT18Donativos2025(s: SolicitudDeduccionesTerritoriales2025, territorio: string): void {
  const h = s.viviendaDT182025, d = s.donativosEstatales2025
  const concurrentes = h !== undefined && d !== undefined
  const exigir = (b: boolean, motivo: string) => { if (!b) throw new RangeError("DT18/donativos: " + motivo) }
  exigir(s.prioridadCuotasDT18Donativos2025 === undefined || concurrentes, "selección sin ambos productores")
  if (!concurrentes) return
  exigir(territorio === "murcia" && s.prioridadCuotasDT18Donativos2025 === "dt18_antes_donativos", "falta selección explícita dt18_antes_donativos en Murcia")
  exigir(s.solicitudes.length === 1 && s.solicitudes.every(x => x.lote === "F-ampliado" && x.codigo === "murcia_regimen_transitorio_inversion_vivienda_habitual" && x.hechos.ramaTransitoria === "estatal_pre2013"), "sólo selección única estatal_pre2013, sin donativo regional ni otras ramas")
  exigir(d.operaciones68_5.length === 0 && d.operaciones68_3.every(o => o.incremento === "general_40" && o.historial === undefined && o.historialExhaustivo === undefined), "sólo donativo dinerario ordinario sin historia nueva")
  exigir(!h.movimientos.some(m => m.clase === "donacion" || m.clase === "herencia"), "ISD fuera de este corte; núcleo patrimonial pendiente de revisión")
  const pagosVivienda = h.proyectos.flatMap(p => p.vivienda.pagos)
  const anteriores = h.proyectos.flatMap(p => [...p.pagosOriginales, ...(p.prestamo?.amortizacionesAnteriores ?? [])])
  for (const o of d.operaciones68_3) {
    const p = o.pago
    exigir(!pagosVivienda.some(v => v.id === p.id || v.factura === p.documento) && !anteriores.some(v => v.id === p.id || v.documento.referencia === p.documento), "pago/documento reutilizado como inversión")
    const movimientos = h.movimientos.filter(m => m.id === p.id || m.documento.referencia === p.documento)
    const m = movimientos[0]
    exigir(movimientos.length === 1 && m !== undefined && m.id === p.id && m.documento.referencia === p.documento && m.clase === "consumo" && m.sentido === "salida" && m.fecha === p.fecha && m.importe === p.euros && p.pagador === h.persona, "donativo no conciliado una sola vez como consumo en cuentas DT18")
  }
}

export const donativosConcurrentes = (s: SolicitudDeduccionesTerritoriales2025 | undefined): boolean => s?.viviendaDT182025 !== undefined && s.donativosEstatales2025 !== undefined
