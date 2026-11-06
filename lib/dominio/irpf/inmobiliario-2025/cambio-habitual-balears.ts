import type { InmuebleP4a } from "./contrato"
import { dia } from "./calendario"
import { mesesCiviles } from "./primer-alquiler"
import { comprobar, eurosC, ceroC } from "../deducciones/canarias-balears-hechos-2025/ampliacion-comun"

/** Primera cesión onerosa tras residencia propia de tres años ya cumplida.
 * Sin días vacantes, afectación, transmisión ni amortización en alquiler anterior.
 * No toca el calendario de P4b (compra2025) ni habilita rentas de trabajo mixtas. */
export function validarCambioHabitualBalears2025(v: InmuebleP4a) {
  const h = v.cambioHabitualBalears2025
  comprobar(h !== undefined, "T06_P4A_HISTORIA: falta transición")
  const c = v.contrato, a = v.adquisicion, r = h.residencia
  comprobar(v.ubicacion === "illes-balears" && v.primerAlquiler2025 === undefined && v.vaciaExt2025 === undefined,
    "T06_P4A_AMBITO: inmueble balear y calendario exclusivo")
  comprobar([h.nacimiento, a.fecha, c.firma, c.desde, c.hasta, r.desde, r.hasta, h.nuevaHabitual.desde].every(x => Number.isFinite(dia(x))),
    "T06_P4A_FECHA: fecha civil inválida")
  comprobar(a.fecha < "2013-01-01" && r.desde === a.fecha && mesesCiviles(r.desde, 36) <= r.hasta &&
    r.hasta >= "2025-01-01" && r.hasta < "2025-12-31" &&
    dia(r.hasta) + 1 === dia(c.desde) && c.desde === h.nuevaHabitual.desde &&
    c.firma <= c.desde && c.hasta >= mesesCiviles(c.desde, 12),
    "T06_P4A_PERIODOS: residencia y primer alquiler deben ser consecutivos sin hueco ni solape")
  comprobar(h.persona === v.titular && h.nuevaHabitual.catastro !== v.catastro && h.nuevaHabitual.catastro.trim() !== "" &&
    [r.documento, h.nuevaHabitual.documento, h.localizacion.documento].every(x => x.trim() !== "") &&
    ["Mallorca", "Menorca", "Ibiza", "Formentera", "Cabrera"].includes(h.localizacion.isla),
    "T06_P4A_IDENTIDAD: título/residencia/localización no conciliados")
  comprobar(v.usosDesdeAdquisicion.length === 2 &&
    v.usosDesdeAdquisicion[0]?.desde === a.fecha && v.usosDesdeAdquisicion[0]?.hasta === r.hasta &&
    v.usosDesdeAdquisicion[0]?.uso === "personal" && v.usosDesdeAdquisicion[1]?.desde === c.desde &&
    v.usosDesdeAdquisicion[1]?.hasta === "2025-12-31" && v.usosDesdeAdquisicion[1]?.uso === "alquiler-vivienda",
    "T06_P4A_USOS: censo desde adquisición no representa exactamente residencia y primer alquiler")
  comprobar(v.exigibilidades.length > 0 && v.exigibilidades.every(x => x.fecha >= c.desde && x.fecha <= "2025-12-31") &&
    v.exigibilidades.reduce((q, x) => q.sumar(eurosC(x.importe)), ceroC()).n > 0n,
    "T06_P4A_RENTA: exigibilidad fuera de alquiler o sin renta positiva")
  // Gastos imputables al alquiler exclusivamente; evita deducir intereses DT18
  // o amortización de principal como gasto de capital inmobiliario.
  comprobar(v.gastos.every(g => g.clase !== "principal-prestamo" && g.periodoDevengo !== undefined &&
    g.periodoDevengo.desde >= c.desde && g.periodoDevengo.hasta <= "2025-12-31" &&
    g.periodoDevengo.desde <= g.periodoDevengo.hasta && g.fechaOperacion >= c.desde &&
    g.fechaOperacion <= "2025-12-31" && g.fechaPago >= c.desde &&
    g.fechaFactura >= c.desde && (g.clase !== "mejora" || (g.puestaEnServicio !== undefined && g.puestaEnServicio >= c.desde))),
    "T06_P4A_GASTO: gasto de etapa personal o principal no deducible en este perfil")
  return { diasAlquilados: dia("2026-01-01") - dia(c.desde), diasImputados: 0, tipoMilesimas: 0,
    seguimiento: ["T06_P4A_CALENDARIO: todos los días2025 son habitual propia o arrendamiento; no hay imputación art85"] }
}
