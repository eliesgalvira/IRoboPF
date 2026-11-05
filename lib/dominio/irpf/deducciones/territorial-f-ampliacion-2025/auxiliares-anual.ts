import type { SolicitudAnualF2025 } from "./anual-esquemas"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { racional, sumar, restar, menor, type Racional } from "../anual-territorial-racional"
import { cuantiaNacimientoMadridExacta, cuantiaGuarderiaMurciaExacta } from "../auxiliares-cuantias-exactas-2025"
import { falta, excluir, requerido, texto, fecha, dinero, unicos, type ResultadoF } from "./comun"
import { CITAS_F } from "./citas"
import type { TitularDescendiente } from "../../minimos/derechos-contrato"

const esProgenitor = (titular: TitularDescendiente): boolean =>
  titular.grado === 1 &&
  (titular.vinculo.clase === "consanguinidad" || titular.vinculo.clase === "adopcion")

function superior(a: Racional, b: string): boolean {
  return menor(a, racional(b)) !== a
}
function mismos(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((id) => b.includes(id))
}

/** Perfil de conexión explícito. No recibe bases ajenas, saldos ni elegibilidad fiscal. */
export function evaluarAuxiliaresAnualesF(s: SolicitudAnualF2025, m: MagnitudesTerritorialesAnuales): ResultadoF {
  const h = requerido(s.auxiliares, "auxiliares.censo_documental")
  texto(h.referenciaCenso, "auxiliares.referenciaCenso")
  if (s.hechos.hechosPrevios !== undefined)
    falta("auxiliares.sin_hechosPrevios", "La conexión exacta no mezcla números ni historia del auxiliar aislado")
  const propio = texto(m.caso.contribuyenteId, "caso.contribuyenteId")
  const derechos = requerido(m.caso.derechosMinimos, "derechosMinimos")
  if (!derechos.descendientesCompletos) falta("descendientesCompletos", "Censo familiar incompleto")
  const ds = derechos.descendientes
  unicos(h.progenitores.map((x) => x.hijo), "auxiliares.progenitores.hijo")
  for (const p of h.progenitores) {
    texto(p.referencia, "progenitores.referencia")
    unicos(p.convivientesDevengo, "progenitores.convivientesDevengo")
    const d = ds.find((x) => x.sujetoId === p.hijo)
    if (d === undefined || !d.titularesCompletos || p.convivientesDevengo.includes(p.hijo))
      falta("progenitores.hijo", "Identidad o censo de titulares incompleto")
    // Art.4 Madrid: el reparto se hace entre padres; el mínimo también admite otros ascendientes.
    const convivientes = d.titulares.filter((t) => t.relacion === "convivencia" &&
      (s.codigo !== "madrid_nacimiento_adopcion_hijos" || esProgenitor(t))).map((t) => t.titularId)
    if (!mismos(p.convivientesDevengo, convivientes) || convivientes.length < 1 || convivientes.length > 2)
      falta("progenitores.convivientesDevengo", "Convivencia no conciliada con el grafo anual")
  }
  const base = sumar(racional(m.baseGeneral.toFixed()), racional(m.baseAhorro.toFixed()))
  let total = racional("0")
  if (s.codigo === "madrid_nacimiento_adopcion_hijos") {
    if (h.estadoCivil !== "no_casado")
      falta("productor_bases_unidad_conyugal", "Falta calcular la base del cónyuge; no se recibe una base externa")
    unicos(h.miembrosUnidad, "auxiliares.miembrosUnidad")
    // Art.82.1.2: primer corte sólo hijos menores convivientes sin rentas gravables.
    if (ds.some((d) => d.edadDevengo >= 18 || d.rentasNoExentasCentimos !== 0 || d.declaracion.modalidad !== "no-presenta"))
      falta("productor_bases_hijos_unidad", "Calcular bases de todos los hijos; no presumir renta cero ni omitirlos")
    if (ds.some((d) => !d.titulares.some((t) => t.titularId === propio &&
      t.relacion === "convivencia" && esProgenitor(t))))
      falta("auxiliares.filiacion_unidad", "El perfil de unidad familiar exige hijos propios convivientes; el grafo de mínimos no prueba esa filiación")
    if (!mismos(h.miembrosUnidad, [propio, ...ds.map((d) => d.sujetoId)]))
      falta("auxiliares.miembrosUnidad", "Censo de unidad monoparental distinto del censo anual completo")
    if (superior(base, "30930")) excluir("baseImponible", "Base propia superior a30930 EUR")
    // Bases gravables de los hijos cero por el perfil comprobado; familiar = propia.
    if (superior(base, "61860")) excluir("baseUnidadFamiliar", "Base familiar excedida")
    unicos(h.eventos.map((e) => e.id), "eventos.id")
    unicos(h.eventos.flatMap((e) => e.hijos), "eventos.hijos")
    if (h.centros.length > 0 || h.servicios.length > 0 || (s.hechos.pagos?.length ?? 0) > 0)
      falta("auxiliares.eventos", "Nacimiento/adopción no consume pagos ni centros")
    for (const e of h.eventos) {
      texto(e.id, "evento.id"); texto(e.referencia, "evento.referencia")
      const f = fecha(e.fecha, "evento.fecha")
      if (e.tipo === "acogimiento") falta("evento.acogimiento", "Art.4 no incluye acogimiento; conservar su código específico y reservas")
      if (f < "2025-01-01") falta("productor_historia_madrid:" + f.slice(0, 4), "Reconstruir bases y modalidad desde el evento; no se admiten bases históricas consignadas")
      if (f > "2025-12-31" || e.hijos.length === 0) falta("evento.fecha", "Evento vacío o posterior al devengo")
      for (const id of e.hijos) {
        const d = ds.find((x) => x.sujetoId === id)
        const p = h.progenitores.find((x) => x.hijo === id)
        if (d === undefined || p === undefined || !d.vivoAlDevengo || !p.convivientesDevengo.includes(propio))
          falta("evento.hijo", "Falta hijo vivo y convivencia conciliada al devengo")
        const v = d.titulares.find((t) => t.titularId === propio)?.vinculo
        if ((e.tipo === "nacimiento" && (d.fechaNacimiento !== f || v?.clase !== "consanguinidad")) ||
          (e.tipo === "adopcion" && (v?.clase !== "adopcion" || v.fechaConstitucionVinculo !== f || f < d.fechaNacimiento)))
          falta("evento.vinculo_fecha", "Fecha/vínculo contradice el anual")
        total = sumar(total, cuantiaNacimientoMadridExacta(1, e.hijos.length > 1, p.convivientesDevengo.length))
      }
    }
  } else {
    if (("libroMaternidad81" in m && m.libroMaternidad81 !== undefined) || "maternidad2025" in m.caso)
      falta("conciliacion_art81_custodia_pagos", "Contrastar identidad de pagos, custodia y progenitores con P3 antes de combinar; sin segundo productor81")
    if (h.regimenPagos !== "separados") falta("pagos.regimen_gananciales", "Falta atribución de pagos comunes conciliada entre ambos progenitores")
    if (h.eventos.length > 0) falta("auxiliares.eventos", "Guardería no consume eventos de Madrid")
    if (superior(base, "30000")) excluir("baseImponible", "Base propia superior a30000 EUR")
    const pagos = s.hechos.pagos ?? []
    unicos(pagos.map((p) => texto(p.id, "pago.id")), "pagos.id")
    unicos(pagos.map((p) => texto(p.factura, "pago.factura")), "pagos.factura")
    unicos(h.centros.map((c) => c.id), "centros.id")
    unicos(h.servicios.map((x) => x.pagoId), "servicios.pagoId")
    if (h.servicios.length !== pagos.length || h.servicios.some((x) => !pagos.some((p) => p.id === x.pagoId)))
      falta("servicios.pagos", "Censo de servicios y pagos no coincide")
    const bases = new Map<string, Racional>()
    for (const p of pagos) {
      const id = texto(p.beneficiarioId, "pago.beneficiarioId")
      const d = ds.find((x) => x.sujetoId === id)
      const titulares = h.progenitores.find((x) => x.hijo === id)
      if (d === undefined || titulares === undefined || !m.sujetosConMinimo.includes(id) || !d.vivoAlDevengo || !titulares.convivientesDevengo.includes(propio))
        falta("guarderia.minimo_convivencia", "Falta mínimo y convivencia al devengo; fallecimiento requiere perfil específico")
      if (p.pagador !== propio)
        falta("productor_derecho_progenitor_externo:" + texto(p.pagador, "pago.pagador"), "Doble pago: calcular bases, residencia, mínimo y derecho del otro pagador antes de repartir tope")
      const c = h.centros.find((x) => x.id === p.objetoId)
      if (c === undefined) falta("guarderia.centro", "Centro no identificado")
      texto(c.autorizacion, "centro.autorizacion"); texto(c.inscripcion, "centro.inscripcion")
      texto(p.soportePago, "pago.soportePago")
      if (p.atribucion !== "propia_separada") falta("pago.atribucion", "Acreditar gasto a cargo exclusivo del pagador; no inferirlo de la cuenta bancaria")
      const servicio = requerido(h.servicios.find((x) => x.pagoId === p.id), "servicio")
      const desde = fecha(servicio.periodo.desde, "servicio.desde"), hasta = fecha(servicio.periodo.hasta, "servicio.hasta")
      const pagoFecha = fecha(p.fecha, "pago.fecha")
      if (desde < "2025-01-01" || hasta > "2025-12-31" || desde > hasta || desde < d.fechaNacimiento || pagoFecha < "2025-01-01" || pagoFecha > "2025-12-31")
        falta("servicio.periodo", "Servicio o pago fuera del ejercicio o anterior al nacimiento")
      if (!c.primerCiclo.some((t) => fecha(t.desde, "centro.desde") <= desde && fecha(t.hasta, "centro.hasta") >= hasta))
        falta("centro.primerCiclo", "Servicio fuera del periodo certificado de primer ciclo; edad sola no acredita etapa")
      if (!["custodia", "matricula", "preinscripcion", "alimentacion", "vestuario_exclusivo_escolar"].includes(texto(p.concepto, "pago.concepto")))
        falta("pago.concepto", "Concepto ajeno a la base legal")
      const importe = racional(dinero(p.importeEUR, "pago.importeEUR").toFixed())
      const ayuda = racional(dinero(p.ayudasEUR, "pago.ayudasEUR").toFixed())
      // Ayudas atribuidas al gasto y menor concretos; no se redistribuyen entre hijos.
      const neto = restar(importe, ayuda)
      if (BigInt(neto.numeradorEuros) < 0n) falta("pago.ayudasEUR", "Ayuda superior al gasto: requiere conciliación por menor")
      bases.set(id, sumar(bases.get(id) ?? racional("0"), neto))
    }
    // Censo completo de pagos, régimen separado y sólo un pagador: tope1000 propio.
    for (const b of bases.values()) total = sumar(total, cuantiaGuarderiaMurciaExacta(b, 1))
  }
  return { codigo: s.codigo, estado: "calculo_parcial", importeExactoRacional: total,
    aceptacionFiscal: "pendiente", motivo: "Rama documental conciliada; pendiente primera revisión monetaria independiente",
    citas: CITAS_F.find((c) => c.codigo === s.codigo)?.citas ?? [], reservas: [],
    rastro: ["Bases exactas del anual; hechos completos del perfil; salida racional hacia el libro único de cuota"] }
}
