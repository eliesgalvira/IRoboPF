import type { InmuebleP4a } from "./contrato"
import { dia } from "./calendario"
import { comprobar, eurosC, enteroC, ceroC } from "../deducciones/canarias-balears-hechos-2025/ampliacion-comun"

/** Meses civiles con ajuste al último día real del mes de destino. */
export function mesesCiviles(fecha: string, meses: number): string {
  comprobar(Number.isFinite(dia(fecha)), "P4b: fecha civil inválida")
  const indice = Number(fecha.slice(0, 4)) * 12 + Number(fecha.slice(5, 7)) - 1 + meses
  const y = Math.floor(indice / 12), m = indice % 12 + 1
  const prefijo = `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}-`
  let d = Number(fecha.slice(8))
  while (!Number.isFinite(dia(prefijo + d.toString().padStart(2, "0")))) d--
  return prefijo + d.toString().padStart(2, "0")
}
export function validarPrimerAlquiler2025(v: InmuebleP4a) {
  const p = v.primerAlquiler2025
  comprobar(p !== undefined, "P4b: falta contrato primario de primer alquiler")
  const c = v.contrato, a = v.adquisicion
  comprobar([a.fecha, c.firma, c.desde, c.hasta, p.construccionTerminada, p.historiaPersonal.nacimiento, p.historiaPersonal.hasta,
    p.catastroImputacion.notificacion, p.catastroImputacion.entradaVigor, p.fianza.fecha].every(x => Number.isFinite(dia(x))), "P4b: fecha civil inválida")
  comprobar(a.fecha >= "2025-01-01" && a.fecha <= c.firma && c.firma <= c.desde && c.desde <= "2025-12-31" && c.hasta >= "2025-12-31", "P4b: compra onerosa, firma e inicio deben estar en2025; contrato vigente al devengo")
  comprobar(p.construccionTerminada <= "2023-12-31", "P4b: construcción posterior a2023 requiere otro perfil; antes de construcción consta inexistencia documental")
  let siguiente = dia(p.construccionTerminada)
  for (const h of p.historiaInmueble) {
    comprobar(dia(h.desde) === siguiente && Number.isFinite(dia(h.hasta)) && dia(h.hasta) >= siguiente, "P4b: historia inmueble incompleta, hueco o solapamiento anterior a compra")
    comprobar(h.uso === "sin-alquiler", "P4b: alquiler anterior del inmueble, incluso de vendedor, fuera del primer alquiler absoluto")
    comprobar(h.hasta < c.desde, "P4b: historia previa invade el primer contrato")
    comprobar(h.hasta < a.fecha ? h.propietario !== v.titular : h.desde >= a.fecha && h.propietario === v.titular, "P4b: historia debe separar propietarios en la fecha de adquisición")
    siguiente = dia(h.hasta) + 1
  }
  comprobar(siguiente === dia(c.desde), "P4b: falta historia exhaustiva desde construcción hasta alquiler, incluidos2023/24 y vendedor")
  const hp = p.historiaPersonal
  comprobar(hp.persona === v.titular && hp.nacimiento < a.fecha && hp.hasta === "2025-12-31" && hp.alquileresAnteriores.length === 0 && hp.aplicacionesAnteriores.length === 0, "P4b: historia personal mundial incompleta o alquiler/aplicación previa; primera elegibilidad no acreditada")
  comprobar(p.censoDerechos.inmuebles.length === 1 && p.censoDerechos.inmuebles[0] === v.id, "P4b: censo mundial debe contener exclusivamente esta vivienda; otros derechos fuera del corte")
  comprobar(!p.vinculo.conyuge && !p.vinculo.parejaEquiparada && [p.vinculo.consanguinidad, p.vinculo.afinidad].every(g => Number.isInteger(g) && (g === 0 || g > 3)), "P4b: cónyuge/pareja o parentesco hasta tercer grado incompatible con perfil ordinario sin renta mínima art24")
  comprobar(p.observacion.arrendatario === c.arrendatario, "P4b: cambio de arrendatario observado")
  comprobar(p.fianza.resguardo === c.fianzaDepositada && p.fianza.fecha >= c.firma && p.fianza.fecha <= "2025-12-31", "P4b: depósito de fianza no conciliado o posterior al devengo")
  comprobar(p.catastroImputacion.notificacion <= "2025-12-31" && p.catastroImputacion.entradaVigor <= "2025-12-31", "P4b: catastro no notificado o no vigente; alternativa sin catastro fuera del corte")
  comprobar(eurosC(v.catastro2025.suelo).sumar(eurosC(v.catastro2025.construccion)).n > 0n, "P4b: valor catastral total nulo")
  let cursor = dia(a.fecha), diasImputados = 0, diasAlquilados = 0
  for (const u of v.usosDesdeAdquisicion) {
    comprobar(dia(u.desde) === cursor && Number.isFinite(dia(u.hasta)) && dia(u.hasta) >= cursor && u.hasta <= "2025-12-31", "P4b: días de propiedad sin cobertura, duplicados o fuera2025")
    comprobar(u.uso === (u.hasta < c.desde ? "a-disposicion" : "alquiler-vivienda") && (u.hasta < c.desde || u.desde >= c.desde), "P4b: uso personal o tramo incompatible con alquiler; no elude conciliación")
    const dias = dia(u.hasta) - cursor + 1
    if (u.uso === "a-disposicion") diasImputados += dias
    else diasAlquilados += dias
    cursor = dia(u.hasta) + 1
  }
  comprobar(cursor === dia("2026-01-01") && diasAlquilados === dia("2026-01-01") - dia(c.desde), "P4b: usos incompletos hasta devengo")
  comprobar(p.rentaMensual.length > 0 && new Set(p.rentaMensual.map(x => x.concepto)).size === p.rentaMensual.length, "P4b: faltan todos los conceptos mensuales o están duplicados")
  const renta = p.rentaMensual.reduce((q, x) => q.sumar(eurosC(x.importe)), ceroC())
  comprobar(renta.n > 0n, "P4b: renta mensual nula")
  // Un recibo por mes civil, todos los conceptos incluidos, primer mes prorrateado.
  const meses = 13 - Number(c.desde.slice(5, 7))
  comprobar(v.exigibilidades.length === meses, "P4b: ingresos sin censo mensual exhaustivo; carencias y primera exigibilidad2026 fuera del corte")
  for (let i = 0; i < meses; i++) {
    const mes = (Number(c.desde.slice(5, 7)) + i).toString().padStart(2, "0")
    const inicio = i === 0 ? c.desde : `2025-${mes}-01`
    const proximo = mes === "12" ? "2026-01-01" : `2025-${(Number(mes) + 1).toString().padStart(2, "0")}-01`
    const diasMes = dia(proximo) - dia(`2025-${mes}-01`)
    const esperado = renta.por(enteroC(dia(proximo) - dia(inicio))).dividir(enteroC(diasMes))
    const r = v.exigibilidades[i]
    comprobar(r !== undefined && r.fecha === inicio && eurosC(r.importe).comparar(esperado) === 0n, "P4b: exigibilidad distinta de mensualidad total contractual; fracciones de céntimo requieren otro perfil")
  }
  for (const g of v.gastos) {
    const periodo = g.periodoDevengo
    comprobar(periodo !== undefined && Number.isFinite(dia(periodo.desde)) && Number.isFinite(dia(periodo.hasta)) && periodo.desde >= c.desde && periodo.hasta <= "2025-12-31" && periodo.desde <= periodo.hasta && g.fechaOperacion >= periodo.desde && g.fechaOperacion <= periodo.hasta, "P4b: gasto estatal sin periodo exclusivamente arrendado; preparación o gasto anual mixto requiere atribución específica")
    // En P4b la operación de mejora identifica su terminación o entrega efectiva.
    // Factura y pago siguen siendo hitos separados; no fijan la amortización.
    comprobar(g.clase !== "mejora" || (g.puestaEnServicio !== undefined && g.puestaEnServicio >= c.desde && g.puestaEnServicio >= g.fechaOperacion), "P4b: mejora en servicio anterior a su terminación o entrega declarada; cronología fuera del corte")
  }
  return {
    diasAlquilados, diasImputados,
    tipoMilesimas: p.catastroImputacion.procedimiento === "colectivo-general" && p.catastroImputacion.entradaVigor >= "2012-01-01" ? 11 : 20,
    seguimiento: ["Permanencia futura pendiente: no se declara ya cumplida; comprobar continuidad, arrendatario e incidencias después2025; eventual reintegro e intereses requiere productor de regularización"],
  }
}
