import { dia } from "./calendario"
import { mesesCiviles } from "./primer-alquiler"
import { resultadoC, enteroC, ceroC } from "../deducciones/canarias-balears-hechos-2025/ampliacion-comun"
import type { ViviendaC36 as SolicitudVivienda } from "../deducciones/canarias-balears-hechos-2025/anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../deducciones/anual-territorial"
import type { ViviendaC36 } from "../deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { comprobar, eurosC } from "../deducciones/canarias-balears-hechos-2025/ampliacion-comun"

/** Conciliación documental; no concede por sí misma las condiciones autonómicas. */
export function conciliarInmuebleP4a(
  m: MagnitudesTerritorialesAnuales,
  v: typeof ViviendaC36.Type["hechos"]["viviendas"][number],
) {
  const r = m.inmueblesP4a?.find(x => x.inmueble.id === v.id && x.inmueble.catastro === v.catastro)
  comprobar(r !== undefined, "P4a: falta productor de inmueble por identidad y catastro")
  const i = r.inmueble, c = i.contrato, a = v.alquiler
  comprobar(i.titular === m.caso.contribuyenteId && v.derecho === i.derecho && v.propietarios?.length === 1 && v.propietarios[0]?.persona === i.titular && v.propietarios[0]?.porcentaje === "100" && v.propietarios[0]?.titulo === i.titulo, "P4a: propiedad o título regional contradictorio")
  comprobar(a !== undefined && a.arrendador === c.arrendador && a.arrendatario === c.arrendatario && a.desde === c.desde && a.hasta === c.hasta && a.fianza === c.fianzaDepositada && a.repercusionObras !== undefined && eurosC(a.repercusionObras).comparar(eurosC(c.repercusionObras)) === 0n && a.parientesGrado === 0 && a.programa === "ordinario", "P4a: contrato regional, depósito o repercusión sin conciliar")
  comprobar(v.uso === "arrendada" && v.historiaContratos.length === 1 && v.historiaContratos[0]?.id === c.id && v.historiaContratos[0]?.desde === c.desde && v.historiaContratos[0]?.hasta === c.hasta, "P4a: historia regional incompatible con contrato único")
  for (const p of v.gastos) {
    const g = i.gastos.find(x => x.id === p.id && x.factura === p.factura)
    comprobar(g !== undefined && g.fechaPago === p.fecha && eurosC(g.importe).comparar(eurosC(p.importe)) === 0n && p.ayudasExentas === "0" && p.reembolsos === "0" && p.perceptor === g.prestadorNif && p.pagador === i.titular && p.naturaleza === "propio" && p.distribucion.length === 1 && p.distribucion[0]?.persona === i.titular && p.distribucion[0]?.porcentaje === "100", "P4a: pago regional no conciliado con gasto primario")
    comprobar((p.concepto === "reparacion" && g.clase === "reparacion") || (p.concepto === "comunidad" && g.clase === "comunidad") || (p.concepto === "tributo" && g.clase === "tributo") || (["contrato", "certificado"].includes(p.concepto) && g.clase === "servicios") || (["seguro_danos", "seguro_impago"].includes(p.concepto) && g.clase === "seguro") || (["energia", "agua"].includes(p.concepto) && g.clase === "mejora"), "P4a: concepto regional distinto de la naturaleza del gasto")
  }
  return r
}

/** Sólo calcula la deducción teórica: la cuota se consume una vez en el libro anual. */
export function evaluarPrimerAlquiler2025(s: typeof SolicitudVivienda.Type, m: MagnitudesTerritorialesAnuales) {
  comprobar(m.inmueblesP4a !== undefined, "P4b: falta productor de historia anterior a compra y primera elegibilidad")
  comprobar(s.hechos.viviendas.length === 1 && m.inmueblesP4a?.length === 1, "P4b: una sola vivienda; agregado1500 se aplica después de sumar su base")
  let base = ceroC()
  for (const v of s.hechos.viviendas) {
    const r = conciliarInmuebleP4a(m, v), i = r.inmueble, c = i.contrato, p = i.primerAlquiler2025
    comprobar(p !== undefined, "P4b: falta productor de historia anterior a compra y primera elegibilidad")
    comprobar(v.adquisicion === i.adquisicion.fecha, "P4b: fecha regional de adquisición contradictoria")
    const esCanarias = s.codigo === "canarias_puesta_viviendas_mercado_arrendamiento"
    comprobar(i.ubicacion === (esCanarias ? "canarias" : "illes-balears"), "P4b: localización del inmueble independiente de residencia")
    if (esCanarias) {
      comprobar(c.desde <= mesesCiviles(i.adquisicion.fecha, 6), "P4b: supera seis meses civiles desde compra")
      comprobar(dia(c.hasta) + 1 >= dia(mesesCiviles(c.desde, 36)), "P4b: contrato LAU vivienda requiere pacto mínimo tres años; efectividad futura pendiente")
      comprobar(!p.vinculo.conyuge && !p.vinculo.parejaEquiparada && [p.vinculo.consanguinidad, p.vinculo.afinidad].every(g => Number.isInteger(g) && (g === 0 || g > 3)), "P4b: cónyuge/pareja o parentesco hasta tercer grado excluido")
      comprobar(v.gastos.length === 0, "P4b art16: no hay base de gastos en esta deducción")
      base = base.sumar(enteroC(1000))
    } else {
      comprobar(dia(c.hasta) + 1 >= dia(mesesCiviles(c.desde, 12)), "P4b: plazo inicial con mismo arrendatario inferior a un año")
      comprobar(p.fianza.ente === "IBAVI", "P4b: fianza no depositada en IBAVI")
      comprobar(m.baseGeneral.plus(m.baseAhorro).lte(52800), "P4b: base imponible interna supera52800")
      const renta = p.rentaMensual.reduce((q, x) => q.sumar(eurosC(x.importe)), ceroC())
      comprobar(eurosC(p.superficieUtil).n > 0n && renta.comparar(eurosC(p.superficieUtil).por(enteroC(15))) <= 0n, "P4b: todos los conceptos superan15 euros mensuales por m2 útil")
      const a = v.alquiler
      comprobar(a !== undefined && a.rentaMensual !== undefined && a.superficieUtil !== undefined && eurosC(a.rentaMensual).comparar(renta) === 0n && eurosC(a.superficieUtil).comparar(eurosC(p.superficieUtil)) === 0n, "P4b: renta total y superficie regional sin conciliar")
      comprobar(v.gastos.length === i.gastos.length && i.gastos.every(g => v.gastos.some(pago => pago.id === g.id)), "P4b: rama ordinaria exige censo completo de gastos conciliados; otras categorías fuera del corte")
      for (const pago of v.gastos) {
        comprobar(["seguro_danos", "reparacion", "comunidad", "tributo", "contrato", "certificado"].includes(pago.concepto), "P4b: gasto no incluido en art4quater.2 ordinario")
        base = base.sumar(eurosC(pago.importe))
      }
    }
  }
  const q = s.codigo === "canarias_puesta_viviendas_mercado_arrendamiento" ? base : base.dividir(enteroC(2)).minimo(enteroC(1500))
  return resultadoC(q, ["Primer alquiler absoluto2025 e historia de inmueble/persona conciliada; sin elegibilidad previa", "Imputación y RNR integrados una vez en composición anual", "Deducción teórica; aplicación efectiva limitada por cuota única"], ["Permanencia futura bajo seguimiento, sin afirmar cumplimiento ya observado; incidencias y reintegros requieren productor específico", "CAIB1800, tenencia antigua y Extremadura fuera del corte"])
}
