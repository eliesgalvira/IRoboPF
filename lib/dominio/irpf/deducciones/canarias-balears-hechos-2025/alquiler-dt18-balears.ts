import type { ViviendaC36, SolicitudAnualC36 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { comprobar, eurosC } from "./ampliacion-comun"
import { necesarioC36, sujetoC36 } from "./anual-productores"
import { fecha, unico } from "./comun"
import { dia } from "../../inmobiliario-2025/calendario"
import { determinarDerechoDT18Balears2025 } from "../../vivienda-dt18-2025/productor"

/** Censo civil único conciliado con los hechos patrimoniales DT18 y la renta
 * P4a ya producida. El único cálculo del derecho lo hace el núcleo DT18. */
export function conciliarDerechoAlquilerBalears2025(
  s: typeof ViviendaC36.Type, m: MagnitudesTerritorialesAnuales, plan: readonly SolicitudAnualC36[],
) {
  const h = necesarioC36(s.hechos.derechoInversionAlquiler, "T06_HISTORIA: faltan hechos DT18")
  const c = necesarioC36(s.hechos.censoViviendaInversion, "T06_CENSO: falta censo civil")
  const id = sujetoC36(m), v = s.hechos.viviendas[0]
  comprobar(s.codigo === "balears_arrendamiento_vivienda_habitual" && plan.length === 1 &&
    m.libroDT18 === undefined && m.inmueblesP4a?.length === 1 && s.hechos.viviendas.length === 1 && v !== undefined,
    "T06_COMPOSICION: una vivienda propia productora P4a y un alquiler, sin otro ejercicio DT18")
  const producido = m.inmueblesP4a[0], p = h.proyectos[0]
  comprobar(producido !== undefined && p !== undefined && h.proyectos.length === 1,
    "T06_PROYECTO: adquisición única ausente o duplicada")
  const vieja = producido.inmueble, cambio = necesarioC36(vieja.cambioHabitualBalears2025, "T06_CALENDARIO: falta cambio habitual inmobiliario")
  comprobar(h.persona === id && c.persona === id && h.nacimiento === s.hechos.nacimientoContribuyente &&
    cambio.persona === id && cambio.nacimiento === h.nacimiento && vieja.titular === id,
    "T06_IDENTIDAD: persona o nacimiento no conciliados")
  comprobar(h.hogar.miembros.length === 1 && h.hogar.miembros[0] === id &&
    h.hogar.desde === "2025-01-01" && h.hogar.hasta === "2025-12-31" && h.hogar.documento.trim() !== "" &&
    m.caso.situacionFamiliar.descendientes.length === 0 && m.caso.situacionFamiliar.ascendientes.length === 0,
    "T06_HOGAR: unidad familiar contradice el censo individual ordinario")
  const alquiler = necesarioC36(v.alquiler, "T06_ALQUILER: contrato actual ausente")
  comprobar(v.catastro !== vieja.catastro && cambio.nuevaHabitual.catastro === v.catastro &&
    cambio.nuevaHabitual.desde === v.ocupacion && v.ocupacion === alquiler.desde &&
    dia(cambio.residencia.hasta) + 1 === dia(alquiler.desde) &&
    p.vivienda.inmueble.residencia.desde === cambio.residencia.desde &&
    p.vivienda.inmueble.residencia.hasta === cambio.residencia.hasta &&
    vieja.contrato.desde === alquiler.desde && producido.diasImputados === 0 &&
    producido.diasAlquilados === dia("2026-01-01") - dia(vieja.contrato.desde),
    "T06_HABITUALES: períodos solapados, hueco o uso anual contradictorio")
  comprobar(vieja.ubicacion === "illes-balears" && p.vivienda.inmueble.territorio === "illes-balears" &&
    vieja.id === h.adquisicion.inmueble && vieja.id === p.vivienda.inmueble.id &&
    vieja.adquisicion.fecha === h.adquisicion.fecha && vieja.adquisicion.escritura === h.adquisicion.escritura.referencia &&
    vieja.adquisicion.precio === h.adquisicion.precio && vieja.adquisicion.gastosTributos === "0" &&
    p.vivienda.inmueble.catastralSuelo === vieja.catastro2025.suelo &&
    p.vivienda.inmueble.catastralConstruccion === vieja.catastro2025.construccion &&
    p.vivienda.inmueble.valorSuelo === vieja.adquisicion.sueloPrecio && vieja.adquisicion.sueloGastosTributos === "0",
    "T06_INMUEBLE: propiedad, adquisición, territorio o valores contradictorios")
  comprobar(producido.integro.n > 0n && vieja.exigibilidades.length > 0 &&
    vieja.gastos.every(g => ["tributo", "comunidad", "seguro", "servicios", "defensa", "suministro"].includes(g.clase)),
    "T06_RENTA: excepción art3bis1b requiere renta de capital producida, sin otras inversiones")
  const contrato = c.titulos.find(t => t.derecho === "arrendatario" && t.catastro === v.catastro)
  const titulo = c.titulos.find(t => t.derecho === "propiedad" && t.catastro === vieja.catastro)
  comprobar(c.titulos.length === 2 && contrato !== undefined && titulo !== undefined &&
    contrato.desde === alquiler.desde && contrato.hasta === "2025-12-31" &&
    contrato.documento.trim() !== "" && titulo.documento === vieja.adquisicion.escritura &&
    titulo.desde === h.adquisicion.fecha && titulo.hasta === "2025-12-31" &&
    c.titulos.every(t => t.usoGratuitoExtinguido === undefined),
    "T06_TITULOS: propiedad/alquiler omitidos, adicionales o fechas inconciliables")
  for (const t of c.titulos) { fecha(t.desde); fecha(t.hasta) }
  comprobar(h.historia.derechos.length === 1 && h.historia.derechos[0]?.titulo.referencia === titulo.documento,
    "T06_TITULO_HISTORICO: título patrimonial y civil contradictorios")
  const l = necesarioC36(p.prestamo === null ? undefined : p.prestamo, "T06_PRESTAMO: falta trayectoria del préstamo original")
  const esperadas = [
    { id: "compra:" + vieja.id, documento: titulo.documento, fecha: titulo.desde, clase: "adquisicion" },
    { id: l.id, documento: l.contrato.referencia, fecha: l.fecha, clase: "financiacion" },
    ...l.amortizacionesAnteriores.map(x => ({ id: x.id, documento: x.documento.referencia, fecha: x.fecha, clase: "financiacion" })),
    ...p.vivienda.pagos.map(x => ({ id: x.id, documento: x.factura, fecha: x.fecha, clase: "financiacion" })),
  ]
  unico(esperadas.map(x => x.id)); unico(esperadas.map(x => x.documento))
  comprobar(c.operaciones.length === esperadas.length && c.operaciones.every(o =>
    o.catastro === vieja.catastro && esperadas.some(e => e.id === o.id && e.documento === o.documento && e.fecha === o.fecha && e.clase === o.clase)),
    "T06_OPERACIONES: censo vital omite, duplica o añade inversiones")
  // Reconcilia cobros y gastos con cuenta única, sin aceptar el rendimiento
  // neto ni el incremento patrimonial calculados por el llamante.
  comprobar(h.cuentas.length === 1 && h.movimientos.every(x => x.clase !== "donacion" && x.clase !== "herencia"),
    "T06_FLUJOS: cuenta única sin ISD ni otras fuentes de ingreso")
  const conciliar = (id: string, documento: string, fecha: string, importe: string, clase: string) => {
    const x = h.movimientos.find(x => x.id === id)
    comprobar(x !== undefined && x.documento.referencia === documento && x.fecha === fecha &&
      x.clase === clase && eurosC(x.importe).comparar(eurosC(importe)) === 0n,
      "T06_BANCO: cobro/pago no conciliado con historia patrimonial")
  }
  for (const x of vieja.exigibilidades) conciliar(x.id, x.documento, x.fecha, x.importe, "ingreso")
  comprobar(h.movimientos.filter(x => x.clase === "ingreso").length === vieja.exigibilidades.length,
    "T06_INGRESOS: otros cobros no integrados en la renta inmobiliaria")
  for (const x of vieja.gastos) conciliar(x.id, x.factura, x.fechaPago, x.importe, "consumo")
  for (const x of v.gastos) conciliar(x.id, x.factura, x.fecha, x.importe, "consumo")
  unico([...vieja.exigibilidades.map(x => x.id), ...vieja.gastos.map(x => x.id), ...v.gastos.map(x => x.id),
    ...p.vivienda.pagos.map(x => x.id)])
  unico([...vieja.exigibilidades.map(x => x.documento), ...vieja.gastos.map(x => x.factura), ...v.gastos.map(x => x.factura),
    ...p.vivienda.pagos.map(x => x.factura)])
  comprobar(p.vivienda.pagos.every(x => x.concepto === "amortizacion" || x.concepto === "intereses"),
    "T06_PAGOS_MODALIDAD: sólo amortización e intereses; gastos mixtos requieren atribución")
  return determinarDerechoDT18Balears2025(h, m.caso)
}
