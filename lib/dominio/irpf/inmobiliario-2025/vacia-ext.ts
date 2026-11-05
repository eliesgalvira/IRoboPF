import type { InmuebleP4a } from "./contrato"
import { dia } from "./calendario"
import { comprobar, eurosC, enteroC } from "../deducciones/canarias-balears-hechos-2025/ampliacion-comun"

/** Corte deliberado: firma/inicio1enero2025, propiedad plena desde antes2024.
 * Art9bis exige generación art85; no se exige autoliquidación2024 completa. */
export function validarVaciaExt2025(v: InmuebleP4a) {
  const p = v.vaciaExt2025, c = v.contrato
  comprobar(p !== undefined, "EXT: faltan hechos primarios")
  comprobar(v.ubicacion === "extremadura" && v.primerAlquiler2025 === undefined, "EXT: localización o mezcla incompatible")
  comprobar(Number.isFinite(dia(p.construccionTerminada)) && p.construccionTerminada <= "2023-12-31" && v.adquisicion.fecha <= "2024-01-01", "EXT: construcción/tenencia parcial fuera del corte")
  comprobar(c.firma === "2025-01-01" && c.desde === "2025-01-01" && Number.isFinite(dia(c.hasta)) && c.hasta >= "2028-01-01", "EXT: firma/inicio1enero2025 y pacto hasta1enero2028 (fin31dic2027 pendiente en auxiliar); prórrogas fuera del corte")
  comprobar(p.censoDerechos.inmuebles.length === 1 && p.censoDerechos.inmuebles[0] === v.id, "EXT: otros derechos mundiales, incluso parciales/usufructos, fuera del corte de una vivienda (máximo legal3)")
  comprobar(v.usosDesdeAdquisicion.every(u => u.hasta < "2025-01-01" ? u.uso === "a-disposicion" : u.uso === "alquiler-vivienda"), "EXT: uso previo personal, habitual o alquiler incompatible; no imputar por etiqueta fiscal")
  let cursor = dia("2024-01-01")
  for (const h of p.observaciones2024) {
    comprobar(dia(h.desde) === cursor && Number.isFinite(dia(h.hasta)) && dia(h.hasta) >= cursor && h.hasta <= "2024-12-31", "EXT: observación2024 incompleta, duplicada o solapada")
    cursor = dia(h.hasta) + 1
  }
  comprobar(cursor === dia("2025-01-01"), "EXT: faltan días de vivienda vacía2024")
  const k = p.catastro2024
  comprobar([k.notificacion, k.entradaVigor].every(x => Number.isFinite(dia(x)) && x <= "2024-01-01"), "EXT: sin catastro notificado/vigente todo2024; alternativa50% no representada")
  const valor = eurosC(k.suelo).sumar(eurosC(k.construccion))
  comprobar(valor.n > 0n && eurosC(k.construccion).n > 0n, "EXT: suelo sin edificación o valor nulo fuera del corte")
  const dias = dia("2025-01-01") - dia("2024-01-01")
  // DA55 LIRPF2024: colectivo general con vigor desde2012; no ventana móvil10años.
  const tipo = k.procedimiento === "colectivo-general" && k.entradaVigor >= "2012-01-01" ? 11 : 20
  const imputacion = valor.por(enteroC(tipo)).por(enteroC(dias)).dividir(enteroC(366000))
  comprobar(p.observacion2025.arrendatario === c.arrendatario && p.observacion2025.ocupacionDesde === c.desde, "EXT: ocupación habitual observada no conciliada")
  comprobar(p.procedimientos.length === 0, "EXT: procedimientos/regularizaciones requieren productor específico; no presumir elegibilidad")
  comprobar(v.gastos.every(g => g.clase !== "mejora"), "EXT: mejoras excluidas en este corte; preserva P4a/P4b")
  return { dias, imputacion: { n: imputacion.n, d: imputacion.d } }
}
