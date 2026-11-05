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
    comprobar((p.concepto === "reparacion" && g.clase === "reparacion") || (["contrato", "certificado"].includes(p.concepto) && g.clase === "servicios") || (["seguro_danos", "seguro_impago"].includes(p.concepto) && g.clase === "seguro") || (["energia", "agua"].includes(p.concepto) && g.clase === "mejora"), "P4a: concepto regional distinto de la naturaleza del gasto")
  }
  return r
}
