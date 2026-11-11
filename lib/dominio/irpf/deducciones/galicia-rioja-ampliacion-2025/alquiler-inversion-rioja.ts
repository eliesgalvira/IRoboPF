import { determinarDerechoDT18Rioja2025 } from "../../vivienda-dt18-2025/productor"
import type { HechosDerechoDT18Rioja2025 } from "../../vivienda-dt18-2025/contrato"
import type { SolicitudE38Anual2025 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { exige, ids, documento, fecha } from "./comun"

/** Art32.12.4: derecho material del período, no elección ni cuota aplicada.
 * Corte representado: única propiedad vital post2012 situada en Galicia.
 * No replica bases DT18/P4a: la primera queda excluida por acceso temporal;
 * las modalidades riojanas de inversión exigen vivienda situada en La Rioja.
 * Otros títulos/anticipos/proyectos no constituyen ausencia acreditada. */
function ausenciaPost2012(s: SolicitudE38Anual2025, m: MagnitudesTerritorialesAnuales): "sin_derecho" {
  const historia = s.historiaInversionAlquilerRioja, libro = m.inmueblesP4a, h = s.hechos
  exige(h.codigo === "rioja_arrendamiento_menores_36", "Rioja: consumidor ajeno")
  if (h.codigo !== "rioja_arrendamiento_menores_36") throw new RangeError("Rioja: consumidor ajeno")
  // Conserva el perfil publicado sin inversiones ni productor de propiedades.
  if (historia === undefined && libro === undefined && m.libroDT18 === undefined) {
    exige(s.inversionesViviendaEjercicio.length === 0, "Rioja: inversión sin historia material; sin importe")
    return "sin_derecho"
  }
  exige(historia !== undefined && libro?.length === 1 && m.libroDT18 === undefined,
    "Rioja: composición/historia material no representada; sin importe")
  if (historia === undefined || libro?.length !== 1) throw new RangeError("Rioja: historia ausente")
  const p = libro[0]
  exige(p !== undefined, "Rioja: falta inmueble producido")
  if (p === undefined) throw new RangeError("Rioja: falta inmueble")
  const v = p.inmueble, id = m.caso.contribuyenteId, a = v.adquisicion, c = h.contratos[0], t = historia.historia
  exige(m.caso.comunidadAutonoma === "la-rioja" && m.caso.fechaFallecimiento === undefined &&
    m.caso.situacionFamiliar.tipo === "individual" && v.titular === id && v.ubicacion === "galicia" &&
    fecha(s.nacimientoContribuyente) && a.fecha >= s.nacimientoContribuyente && a.fecha >= "2013-01-01" &&
    h.contratos.length === 1 && h.hijosMenores.length === 0 && c !== undefined,
    "Rioja: propiedad única post2012 fuera de Rioja; otra historia requiere productor específico")
  if (c === undefined) throw new RangeError("Rioja: falta contrato")
  exige(c.territorio === "la-rioja" && c.id !== v.contrato.id && c.arrendador !== id &&
    c.arrendador !== v.contrato.arrendatario && c.titularesContrato.length === 1 && c.titularesContrato[0] === id &&
    c.titularesDerecho.length === 1 && c.titularesDerecho[0] === id && c.regimen === "privativo" &&
    c.conyuges.length === 0 && c.pagos.every(x => x.pagador === id), "Rioja: títulos/pagadores contradictorios")
  const cambio = v.cambioHabitual2025
  if (cambio !== undefined) exige(cambio.persona === id && cambio.nacimiento === s.nacimientoContribuyente &&
    cambio.nuevaHabitual.contrato === c.id && cambio.nuevaHabitual.desde === c.ocupacion.desde &&
    c.ocupacion.hasta >= "2025-12-31", "Rioja: calendario de alquiler no conciliado")
  documento(t.documento)
  exige(t.desde === s.nacimientoContribuyente && t.hasta === "2025-12-31" && t.documento.fecha >= t.hasta &&
    t.derechos.length === 1 && t.anticipos.length === 0, "Rioja: censo vital incompleto/otros derechos")
  const titulo = t.derechos[0]
  exige(titulo !== undefined && titulo.inmueble === v.id && titulo.titular === id &&
    titulo.adquisicion === a.fecha && titulo.transmision === null && titulo.titulo.referencia === a.escritura &&
    titulo.titulo.fecha === a.fecha, "Rioja: título histórico contradictorio")
  if (titulo !== undefined) documento(titulo.titulo)
  const compra = Number(a.fecha.slice(0, 4))
  exige(t.ejercicios.length === 1, "Rioja: falta escritura de única inversión; no se requieren declaraciones vitales")
  for (const e of t.ejercicios) {
    documento(e.documento)
    exige(e.anio === compra && e.anio < 2025 && e.documento.fecha >= `${e.anio}-12-31` &&
      e.eventos.length === 1, "Rioja: historia fiscal omitida/no representada")
    for (const x of e.eventos) {
      documento(x.documento)
      exige(x.tipo === "inversion_vivienda" && x.inmueble === v.id && x.documento.referencia === a.escritura &&
        x.documento.fecha === a.fecha, "Rioja: reinversión/otra inversión histórica")
    }
  }
  // Pagos de préstamo sólo producen economía inmobiliaria. No imputarles una
  // deducción habitual riojana por el mero hecho de que el titular resida allí.
  const inversiones = v.gastos.filter(g => ["mejora", "principal-prestamo", "intereses"].includes(g.clase))
  exige(ids(s.inversionesViviendaEjercicio.map(x => x.documento)) && s.inversionesViviendaEjercicio.length === inversiones.length &&
    s.inversionesViviendaEjercicio.every(i => inversiones.some(g => i.id === g.id && i.fecha === g.fechaPago &&
      i.importe === g.importe && i.documento === g.factura && i.titular === v.titular)), "Rioja: inventario contradictorio")
  exige(ids([...v.exigibilidades.map(x => x.id), ...v.gastos.map(x => x.id), ...c.pagos.map(x => x.id)]) &&
    ids([...v.exigibilidades.map(x => x.documento), ...v.gastos.map(x => x.factura), ...c.pagos.map(x => x.factura)]),
    "Rioja: operación/documento reutilizado")
  return "sin_derecho"
}

type MaterialRioja = { readonly derecho: "sin_derecho" | "con_derecho"; readonly regla: string }
export function derechoInversionAlquilerRioja2025(
  s: SolicitudE38Anual2025, m: MagnitudesTerritorialesAnuales, h?: HechosDerechoDT18Rioja2025,
): MaterialRioja {
  if (h === undefined) return { derecho: ausenciaPost2012(s,m), regla: "RIOJA_POST2012: ausencia material; elección no produce derecho" }
  exige(s.historiaInversionAlquilerRioja === undefined && m.libroDT18 === undefined &&
    m.inmueblesP4a?.length === 1, "RIOJA_DT18: historias concurrentes o sin renta producida")
  const p = m.inmueblesP4a?.[0], solicitud = s.hechos
  if (p === undefined || solicitud.codigo !== "rioja_arrendamiento_menores_36") throw new RangeError("RIOJA_DT18: consumidor/inmueble ausente")
  const v = p.inmueble, proyecto = h.proyectos[0], c = solicitud.contratos[0], id = m.caso.contribuyenteId
  if (proyecto === undefined || c === undefined) throw new RangeError("RIOJA_DT18: proyecto/contrato ausente")
  const vieja = proyecto.vivienda, a = h.adquisicion, cambio = v.cambioHabitual2025
  exige(h.proyectos.length === 1 && solicitud.contratos.length === 1 && solicitud.hijosMenores.length === 0 &&
    m.caso.situacionFamiliar.descendientes.length === 0 && m.caso.situacionFamiliar.ascendientes.length === 0 &&
    m.caso.situacionFamiliar.discapacidad._tag === "SinDiscapacidad" && h.persona === id && v.titular === id &&
    h.nacimiento === s.nacimientoContribuyente && cambio !== undefined,
    "RIOJA_DT18: sujeto/calendario/familia no conciliados")
  if (cambio === undefined) throw new RangeError("RIOJA_DT18: calendario ausente")
  exige(v.ubicacion === "galicia" && vieja.inmueble.territorio === "galicia" && a.inmueble === v.id &&
    vieja.inmueble.id === v.id && a.fecha === v.adquisicion.fecha && a.precio === v.adquisicion.precio &&
    a.escritura.referencia === v.adquisicion.escritura && a.escritura.referencia === v.titulo &&
    h.historia.derechos[0]?.titulo.referencia === v.titulo &&
    h.historia.derechos[0]?.titulo.fecha === a.escritura.fecha && v.adquisicion.gastosTributos === "0" &&
    v.adquisicion.sueloGastosTributos === "0" && vieja.inmueble.valorSuelo === v.adquisicion.sueloPrecio &&
    vieja.inmueble.catastralSuelo === v.catastro2025.suelo && vieja.inmueble.catastralConstruccion === v.catastro2025.construccion,
    "RIOJA_DT18: propiedad/localización/valores contradictorios")
  exige(cambio.persona === id && cambio.nacimiento === h.nacimiento &&
    cambio.residencia.desde === vieja.inmueble.residencia.desde && cambio.residencia.hasta === vieja.inmueble.residencia.hasta &&
    cambio.nuevaHabitual.contrato === c.id && cambio.nuevaHabitual.desde === c.ocupacion.desde &&
    c.ocupacion.hasta === "2025-12-31" && c.fecha <= c.ocupacion.desde && c.uso === "habitual" &&
    c.territorio === "la-rioja" && c.id !== v.contrato.id && c.arrendador !== id && c.arrendador !== v.contrato.arrendatario &&
    c.titularesContrato.length === 1 && c.titularesContrato[0] === id && c.titularesDerecho.length === 1 &&
    c.titularesDerecho[0] === id && c.regimen === "privativo" && c.conyuges.length === 0 && c.pagos.every(x => x.pagador === id),
    "RIOJA_DT18: calendario/títulos del alquiler propio contradictorios")
  // El inventario incluye todos los pagos DT18, incluso intereses personales
  // que P4a no puede deducir como gasto del período cedido.
  const pagos = vieja.pagos, inversiones = s.inversionesViviendaEjercicio
  exige(ids(inversiones.map(x => x.documento)) && inversiones.length === pagos.length && inversiones.every(i =>
    pagos.some(x => i.id === x.id && i.titular === x.pagador && i.fecha === x.fecha && i.importe === x.importe && i.documento === x.factura)),
    "RIOJA_DT18: inventario de inversión contradictorio")
  exige(v.gastos.every(g => g.clase === "principal-prestamo" && pagos.some(x => x.concepto === "amortizacion" &&
    x.id === g.id && x.factura === g.factura && x.importe === g.importe && x.fecha === g.fechaPago)),
    "RIOJA_DT18: P4a no admite intereses de la etapa personal ni nuevas inversiones en este perfil")
  const conciliar = (idMovimiento: string, soporte: string, fechaMovimiento: string, importe: string, clase: string) => {
    exige(h.movimientos.some(x => x.id === idMovimiento && x.documento.referencia === soporte && x.fecha === fechaMovimiento &&
      x.importe === importe && x.clase === clase), "RIOJA_DT18: cobro/pago no conciliado con banco")
  }
  exige(h.movimientos.every(x => x.clase !== "donacion" && x.clase !== "herencia") &&
    h.movimientos.filter(x => x.clase === "ingreso").length === v.exigibilidades.length,
    "RIOJA_DT18: renta adicional/ISD no representados")
  for (const x of v.exigibilidades) conciliar(x.id,x.documento,x.fecha,x.importe,"ingreso")
  for (const x of c.pagos) conciliar(x.id,x.factura,x.fecha,x.importe,"consumo")
  exige(ids([...v.exigibilidades.map(x => x.id), ...pagos.map(x => x.id), ...c.pagos.map(x => x.id)]) &&
    ids([...v.exigibilidades.map(x => x.documento), ...pagos.map(x => x.factura), ...c.pagos.map(x => x.factura)]),
    "RIOJA_DT18: operación/documento reutilizado")
  // Único cálculo de base y condiciones: núcleo DT18 compartido. Nunca usar
  // la cuota aplicada ni la elección para determinar la incompatibilidad.
  const material = determinarDerechoDT18Rioja2025(h,m.caso)
  return { derecho: material.conDerecho ? "con_derecho" : "sin_derecho",
    regla: `RIOJA_DT18: derecho=${material.conDerecho}; eleccion=${material.eleccion}; baseCentimos=${material.baseDerecho.n}/${material.baseDerecho.d}; sin consumo de cuota` }
}
