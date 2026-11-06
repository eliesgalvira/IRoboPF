import { Result, Schema } from "effect"
import Decimal from "decimal.js"
import type { MagnitudesTerritorialesAnuales } from "./anual-territorial"
import { HechosFamiliarExentoExt2025 } from "./ext-familiar-contrato-2025"
import { exigirFamiliar, fechaFamiliar, producirObligacionPatrimonioFamiliar2025, producirRentaExentaFamiliar2025, unicosFamiliar } from "./ext-familiar-productor-2025"
import { cuidadoDiscapacidadExt, type ResultadoHechos } from "./extremadura-hechos-2025"
import { racional } from "./anual-territorial-racional"
const D = Decimal.clone({ precision: 200 })
/** Productores privados y evaluación D51 existente; cuota consumida por el libro común. */
export function evaluarFamiliarExentoExt2025(entrada: HechosFamiliarExentoExt2025, m: MagnitudesTerritorialesAnuales): ResultadoHechos {
  const decoded = Schema.decodeUnknownResult(HechosFamiliarExentoExt2025)(entrada, { onExcessProperty: "error" })
  exigirFamiliar(Result.isSuccess(decoded), "contrato incompleto o clase de renta/patrimonio/familia fuera de cobertura")
  const h = decoded.success, f = h.familiar, propio = m.caso.contribuyenteId
  exigirFamiliar(m.caso.anio === 2025 && m.caso.comunidadAutonoma === "extremadura" && m.caso.fechaFallecimiento === undefined && m.caso.situacionFamiliar.tipo === "individual", "sólo individual EXT2025 ordinaria")
  exigirFamiliar(propio !== undefined && propio !== f.id && f.patrimonio.titular === f.id, "identidad familiar/contribuyente/patrimonio contradictoria")
  fechaFamiliar(f.nacimiento); fechaFamiliar(h.soporteCensoLineal.fecha)
  exigirFamiliar(f.nacimiento <= "2025-12-31", "familiar nacido después del devengo")
  for (const fecha of [f.discapacidad.desde, f.discapacidad.hasta, f.discapacidad.certificado.fecha]) fechaFamiliar(fecha)
  exigirFamiliar(f.discapacidad.desde <= "2025-01-01" && f.discapacidad.hasta >= "2025-12-31", "discapacidad intranual fuera de cobertura")
  const censoComun = m.caso.basesFamiliares2025
  const idsEconomia = [f.id, ...h.parientes.filter(p => p.id !== propio).map(p => p.id)]
  for (const id of idsEconomia) {
    const personaComun = censoComun?.personas.find(p => p.id === id)
    exigirFamiliar(personaComun === undefined || personaComun.economia.perfil === "sin-rentas", "economía sujeta de otro libro contradice ausencia de sujetas EXT")
    const baseComun = m.libroBasesFamiliares2025?.bases.get(id)
    exigirFamiliar(baseComun === undefined || (baseComun.general.eq(0) && baseComun.ahorro.eq(0)), "bases de otro libro contradicen renta exenta/ausencia")
    // El contrato común actual sin-rentas incluye exentas: no permitir usarlo para una pensión cobrada.
    if (personaComun !== undefined && id === f.id) exigirFamiliar(f.economia.perfil === "sin-rentas", "ausencia total de otro censo contradice pensión exenta")
    const pariente = h.parientes.find(p => p.id === id)
    if (personaComun !== undefined && pariente !== undefined) exigirFamiliar(pariente.economia.perfil === "sin-rentas", "ausencia total de otro censo contradice economía de pariente")
  }
  for (const hijo of censoComun?.hijos ?? []) {
    if (hijo.id === f.id) exigirFamiliar(hijo.nacimiento === f.nacimiento && hijo.progenitores.every(id => h.parientes.some(p => p.id === id && p.parentescoRespectoFamiliar === "progenitor")), "filiación/fecha de otro censo contradice familiar")
    for (const p of h.parientes.filter(p => p.id === hijo.id)) exigirFamiliar(p.nacimiento === hijo.nacimiento, "fecha de pariente contradice otro censo")
  }
  exigirFamiliar(f.discapacidad.desde >= f.nacimiento, "discapacidad anterior al nacimiento")
  exigirFamiliar(f.patrimonio.cuentas.every(c => c.titularidadDesde >= f.nacimiento) && f.patrimonio.deudas.every(d => d.origen >= f.nacimiento), "titularidad/deuda anterior al nacimiento")
  if (f.patrimonio.vivienda !== undefined) exigirFamiliar(f.patrimonio.vivienda.plenoDominioDesde >= f.nacimiento, "vivienda anterior al nacimiento")
  if (f.economia.perfil === "pension-ss-incapacidad") exigirFamiliar(f.economia.prestaciones.every(p => p.efectosDesde >= f.nacimiento), "pensión anterior al nacimiento")
  const renta = producirRentaExentaFamiliar2025(f.economia)
  const ip = producirObligacionPatrimonioFamiliar2025(f.patrimonio)
  const cobros = f.economia.perfil === "sin-rentas" ? [] : f.economia.prestaciones.flatMap(p => p.cobros)
  const movimientos = f.patrimonio.cuentas.flatMap(c => c.diarioQ4.flatMap(d => d.movimientos.map(x => ({ ...x, fecha: d.fecha, cuenta: c.id }))))
  for (const cobro of cobros) {
    exigirFamiliar(f.patrimonio.cuentas.some(c => c.id === cobro.cuenta), "cobro en cuenta no censada")
    if (cobro.fecha >= "2025-10-01") exigirFamiliar(movimientos.some(x => x.id === cobro.id && x.causa === "pension" && x.sentido === "entrada" && x.importe === cobro.importe && x.fecha === cobro.fecha && x.cuenta === cobro.cuenta && x.referencia === cobro.referenciaBancaria), "pensión no concilia con diarioQ4")
  }
  for (const x of movimientos.filter(x => x.causa === "pension")) exigirFamiliar(cobros.some(c => c.id === x.id && c.importe === x.importe && c.fecha === x.fecha && c.cuenta === x.cuenta && c.referenciaBancaria === x.referencia), "diarioQ4: pensión no censada en rentas")
  const dependencia = f.dependencia
  if (dependencia.situacion === "reconocida-no-cobrada") {
    exigirFamiliar(new D(dependencia.importeMensualReconocido).gt(0), "dependencia: resolución sin ayuda económica positiva")
    for (const fecha of [dependencia.evaluacionSocial.fecha, dependencia.resolucion.fecha, dependencia.efectosDesde]) fechaFamiliar(fecha)
    exigirFamiliar(dependencia.evaluacionSocial.fecha <= dependencia.resolucion.fecha && dependencia.resolucion.fecha <= "2025-12-31" && dependencia.efectosDesde <= "2025-12-31", "ayuda dependencia: evaluación/resolución/efectos posteriores al devengo")
  } else fechaFamiliar(dependencia.soporte.fecha)
  unicosFamiliar(h.parientes.map(p => p.id), "pariente lineal")
  exigirFamiliar(h.parientes.some(p => p.id === propio), "contribuyente ausente del censo lineal")
  const elegibles: string[] = []
  for (const p of h.parientes) {
    fechaFamiliar(p.nacimiento); fechaFamiliar(p.filiacion.fecha)
    exigirFamiliar(p.id !== f.id && p.nacimiento <= "2025-12-31", "identidad/fecha de pariente contradictoria")
    exigirFamiliar(p.parentescoRespectoFamiliar === "hijo" ? p.nacimiento > f.nacimiento : p.nacimiento < f.nacimiento, "filiación cronológica imposible")
    exigirFamiliar(p.id === propio ? p.economia.perfil === "declarante-en-composicion" : p.economia.perfil !== "declarante-en-composicion", "economía de titular no conciliada")
    if (p.economia.perfil !== "declarante-en-composicion") producirRentaExentaFamiliar2025(p.economia)
    if (p.id === propio) exigirFamiliar(2025 - Number(p.nacimiento.slice(0, 4)) === m.caso.situacionFamiliar.edad && p.residencia2025 === "extremadura", "edad/residencia propias contradicen composición")
    let dias = 0
    if (p.convivencia.clase === "efectiva") {
      const c = p.convivencia
      fechaFamiliar(c.acreditacion.fecha)
      dias = (fechaFamiliar(c.fin) - fechaFamiliar(c.inicio)) / 86400000 + 1
      exigirFamiliar(c.inicio >= "2025-01-01" && c.fin <= "2025-12-31" && dias > 0, "intervalo convivencia fuera de2025/invertido")
    } else fechaFamiliar(p.convivencia.soporte.fecha)
    const base = p.id === propio ? m.baseGeneral.plus(m.baseAhorro) : new D(0)
    exigirFamiliar(base.isFinite(), "base propia no finita")
    if (p.residencia2025 === "extremadura" && dias >= 183 && base.lte(19000)) elegibles.push(p.id)
    // Si aparece en mínimos, su identidad/filiación/convivencia/renta no pueden divergir.
    for (const d of m.caso.derechosMinimos?.descendientes ?? []) {
      if (d.sujetoId === f.id) {
        exigirFamiliar(d.titulares.every(t => h.parientes.some(q => q.id === t.titularId && q.parentescoRespectoFamiliar === "progenitor")), "censo lineal omite titulares familiares identificados en mínimos")
        exigirFamiliar(d.fechaNacimiento === f.nacimiento && d.rentasNoExentasCentimos === 0 && d.discapacidad._tag === (f.discapacidad.grado >= 65 ? "Discapacidad65OMas" : f.discapacidad.grado >= 33 ? "Discapacidad33a64" : "SinDiscapacidad"), "familiar contradice libro de mínimos")
        const t = d.titulares.find(t => t.titularId === p.id)
        if (p.id !== propio) exigirFamiliar(t?.rentasNoExentasCentimos === 0, "renta de otro titular contradice mínimos")
        exigirFamiliar(p.parentescoRespectoFamiliar === "progenitor" && t !== undefined && t.grado === 1 && t.vinculo.clase === "consanguinidad" && (t.relacion === "convivencia") === (p.convivencia.clase === "efectiva"), "filiación/convivencia contradice mínimos")
      }
      if (d.sujetoId === p.id && p.id !== propio) exigirFamiliar(d.fechaNacimiento === p.nacimiento && d.rentasNoExentasCentimos === 0, "pariente contradice economía/fecha de mínimos")
    }
  }
  // El censo se limita expresamente a primer grado; no se acepta un reparto de derechos consignado.
  const persona = { id: f.id, grado: f.discapacidad.grado, resolucion: "ninguna", inicioConvivencia: "2025-01-01", finConvivencia: "2025-12-31",
    rentasIncluidasExentas: renta.rentasIncluidasExentas, obligacionPatrimonio: ip.obligacionPatrimonio,
    dependenciaReconocida: dependencia.situacion === "reconocida-no-cobrada" ? dependencia.importeMensualReconocido : "0", dependenciaCobrada: "0", titularesMismoGradoElegibles: [propio] }
  const marco = { ejercicio: 2025, territorio: "extremadura", contribuyente: propio, declarantes: [propio], modalidad: "individual", baseGeneral: m.baseGeneral.toFixed(), baseAhorro: m.baseAhorro.toFixed(), minimoPersonalFamiliar: m.minimoPersonalFamiliar.toFixed() }
  const r = cuidadoDiscapacidadExt(marco, { regimen: { poblacion: 3000, familia: "ordinaria", hijosExclusivos: [], estadoCivil: "sin_vinculo", alimentos: "0" }, personas: elegibles.includes(propio) ? [persona] : [], exhaustividad: "completa" })
  if (r.estado !== "calculo_parcial") return r
  exigirFamiliar(Schema.is(Schema.String)(r.importeExacto), "evaluador individual EXT no produjo decimal finito")
  return { ...r, importeExacto: racional(r.importeExacto, String(Math.max(1, elegibles.length))), pendientes: [...r.pendientes, "Productor art7.f y art37/15bis EXT2025; sin requisito adicional de mínimo. Censo primer grado; reparto exacto derivado."] }
}
