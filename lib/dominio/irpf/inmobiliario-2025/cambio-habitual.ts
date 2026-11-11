import type { InmuebleP4a } from "./contrato"
import { dia } from "./calendario"
import { mesesCiviles } from "./primer-alquiler"

/** Calendario económico: habitual propia seguida de primera cesión onerosa.
 * No determina derecho a deducciones de inversión ni exige antigüedad pre2013.
 * El consumidor limita territorio y concilia el nuevo contrato habitual. */
export function validarCambioHabitual2025(v: InmuebleP4a) {
  const h = v.cambioHabitual2025
  const exige = (ok: boolean, mensaje: string): void => { if (!ok) throw new RangeError("Cambio2025: " + mensaje) }
  if (h === undefined) throw new RangeError("Cambio2025: falta calendario")
  const a = v.adquisicion, c = v.contrato, r = h.residencia
  exige(v.cambioHabitualBalears2025 === undefined && v.primerAlquiler2025 === undefined && v.vaciaExt2025 === undefined, "calendarios concurrentes")
  exige([h.nacimiento, a.fecha, r.desde, r.hasta, c.firma, c.desde, c.hasta, h.nuevaHabitual.desde].every(x => Number.isFinite(dia(x))), "fecha civil inválida")
  exige(h.persona === v.titular && h.nacimiento < a.fecha && r.desde === a.fecha &&
    mesesCiviles(r.desde, 36) <= r.hasta && r.hasta >= "2025-01-01" && r.hasta < "2025-12-31" &&
    dia(r.hasta) + 1 === dia(c.desde) && c.desde === h.nuevaHabitual.desde &&
    c.firma <= c.desde && c.hasta >= "2025-12-31", "identidad o períodos sin continuidad")
  exige([r.documento, h.nuevaHabitual.documento, h.nuevaHabitual.contrato].every(x => x.trim() !== "") &&
    h.nuevaHabitual.contrato !== c.id, "soportes o contrato propio confundido con cedido")
  exige(v.usosDesdeAdquisicion.length === 2 && v.usosDesdeAdquisicion[0]?.desde === a.fecha &&
    v.usosDesdeAdquisicion[0]?.hasta === r.hasta && v.usosDesdeAdquisicion[0]?.uso === "personal" &&
    v.usosDesdeAdquisicion[1]?.desde === c.desde && v.usosDesdeAdquisicion[1]?.hasta === "2025-12-31" &&
    v.usosDesdeAdquisicion[1]?.uso === "alquiler-vivienda", "censo de usos incompleto")
  exige(v.exigibilidades.length > 0 && v.exigibilidades.every(x => x.fecha >= c.desde && x.fecha <= "2025-12-31"), "renta fuera del arriendo")
  // Principal: flujo patrimonial sin gasto deducible. Los otros gastos sólo
  // pertenecen al período alquilado; no se deducen intereses de uso personal.
  exige(v.gastos.every(g => g.clase === "principal-prestamo" ||
    (g.periodoDevengo !== undefined && g.periodoDevengo.desde >= c.desde &&
     g.periodoDevengo.hasta <= "2025-12-31" && g.periodoDevengo.desde <= g.periodoDevengo.hasta &&
     [g.fechaOperacion, g.fechaFactura, g.fechaPago].every(x => x >= c.desde) &&
     (g.clase !== "mejora" || (g.puestaEnServicio !== undefined && g.puestaEnServicio >= c.desde)))), "gasto de etapa personal o sin atribución temporal")
  return { diasAlquilados: dia("2026-01-01") - dia(c.desde), diasImputados: 0, tipoMilesimas: 0,
    seguimiento: ["Cambio2025: habitual propia y arriendo exhaustivos; sin imputación art85; sin clasificación de derecho de inversión"] }
}
