import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { expect, it } from "vitest"
import { SolicitudDonativosEstatales2025, type SolicitudDonativosEstatales2025 as Solicitud } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/esquemas"
import { producirDonativosEstatales2025 as producir, eurosDonativos, type MagnitudesDonativos } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/productor"
import { baseEstatalMismaOperacion } from "../lib/dominio/irpf/deducciones/donativos-estatales-2025/regionales"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { aplicarDeduccionesTerritoriales2025 as territoriales, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
// Identificadores documentales y NIF de transporte sintéticos, sin cuentas personales.
function operacion(importe = "300", id = "op-estatal", entidadId = "e-estatal", nif = "G12345674") {
  return { operacionId: id, eleccion: "aplicar" as const, incremento: "general_40" as const,
    entidad: { id: entidadId, nif, clase: "fundacion" as const, registro: "registro-" + entidadId, regimen: "titulo_II_Ley49_2002" as const, referenciaRegimen: "regimen-" + entidadId, referenciaOpcionRegimen: "opcion-" + entidadId, regimenDesde: "2020-01-01", regimenHasta: "2025-12-31" },
    pago: { id: "p-" + id, operacionId: id, fecha: "2025-06-01", pagador: "s-1", receptorNIF: nif, euros: importe, documento: "doc-" + id, medio: "transferencia" as const },
    certificado: { referencia: "cert-" + id, operacionId: id, donante: "s-1", nifDonante: "12345678Z", inclusionArt16: "entidad_titulo_II" as const, entidadNIF: nif, fechaDonativo: "2025-06-01", euros: importe, destino: "fines-generales", caracter: "irrevocable_puro_simple" as const, contraprestacionEUR: "0" },
  }
}
const censo = (operaciones: Solicitud["operaciones68_3"] = [operacion()]): Solicitud => ({ ejercicio: 2025, contribuyente: "s-1", nifContribuyente: "12345678Z", exhaustividad: "completo_68_3_y_68_5", referenciaCenso: "censo-documentado", operaciones68_3: operaciones, operaciones68_5: [] })
const magnitudes = (bl = "20000", estatal = "1000", autonomica = "1000"): MagnitudesDonativos => ({ contribuyente: "s-1", baseLiquidableGeneral: new Decimal(bl), baseLiquidableAhorro: new Decimal(0), cuotaEstatal: new Decimal(estatal), cuotaAutonomica: new Decimal(autonomica) })
// Oráculos nuevos derivados de AEAT2025, no salidas capturadas del motor.
it("300:250*80%+50*40%=220 y110 a cada parte, efectivamente aplicados", () => {
  const r = producir(censo(), magnitudes())
  expect(r.base68_3).toEqual(racional("300")); expect(r.generado).toEqual(racional("220")); expect(r.aplicado).toEqual(racional("220"))
  expect(r.estatal.aplicada).toEqual(racional("110")); expect(r.autonomica.aplicada).toEqual(racional("110"))
  expect(r.estatal.disponible).toEqual(racional("890")); expect(r.autonomica.disponible).toEqual(racional("890"))
})
it("45% sólo con censo histórico2023–25 completo:200+22.50=222.50", () => {
  const o = operacion()
  const historial = ([2023, 2024] as const).map(ejercicio => {
    const id = "hist-" + ejercicio
    return { ejercicio, pago: { ...o.pago, id: "p-" + id, operacionId: id, fecha: ejercicio + "-06-01" }, certificado: { ...o.certificado, referencia: "cert-" + id, operacionId: id, fechaDonativo: ejercicio + "-06-01" } }
  })
  expect(producir(censo([{ ...o, incremento: "reiteracion_45", historialExhaustivo: "todos_donativos_misma_entidad_2023_2024", historial }]), magnitudes()).generado).toEqual(racional("222.50"))
  expect(() => producir(censo([{ ...o, incremento: "reiteracion_45" }]), magnitudes())).toThrow(/2023/)
  const menor = historial.map(h => h.ejercicio === 2023 ? { ...h, pago: { ...h.pago, euros: "400" }, certificado: { ...h.certificado, euros: "400" } } : h)
  expect(() => producir(censo([{ ...o, incremento: "reiteracion_45", historialExhaustivo: "todos_donativos_misma_entidad_2023_2024", historial: menor }]), magnitudes())).toThrow(/no decrecientes/)
})
it("10% de BL limita la BASE, no la deducción; derivados con más de dos decimales", () => {
  const r = producir(censo(), magnitudes("1000"))
  expect(r.base68_3).toEqual(racional("100")); expect(r.generado).toEqual(racional("80"))
  expect(producir(censo([operacion("400")]), magnitudes("3000.001")).generado).toEqual(racional("220.00004"))
})
it("cuotas insuficientes:sin transferir entre partes ni restar deducción no aplicada", () => {
  const r = producir(censo(), magnitudes("20000", "3", "200"))
  expect(r.generado).toEqual(racional("220")); expect(r.aplicado).toEqual(racional("113"))
  expect(r.estatal.aplicada).toEqual(racional("3")); expect(r.autonomica.aplicada).toEqual(racional("110")); expect(r.autonomica.disponible).toEqual(racional("90"))
  expect(r.atribucionBaseRegionalCompleta).toBe(false)
  const p = operacion().pago
  expect(() => baseEstatalMismaOperacion(r, "op-estatal", "e-estatal", p)).toThrow(/parcialmente/)
  expect(producir(censo(), magnitudes("20000", "0", "0")).aplicado).toEqual(racional("0"))
})
it("elección no aplicar:base usada y deducción cero explícitas, no falta de productor", () => {
  const r = producir(censo([{ ...operacion(), eleccion: "no_aplicar" }]), magnitudes())
  expect(r.base68_3).toEqual(racional("0")); expect(r.aplicado).toEqual(racional("0")); expect(r.operaciones[0]?.eleccion).toBe("no_aplicar")
})
it("rechaza censo incompleto,68.5,múltiples seleccionadas y duplicidad", () => {
  expect(() => Schema.decodeUnknownSync(SolicitudDonativosEstatales2025)({ ...censo(), exhaustividad: "incompleto" }, { onExcessProperty: "error" })).toThrow()
  expect(() => producir({ ...censo(), operaciones68_5: [{ operacionId: "bien", documento: "art685" }] }, magnitudes())).toThrow(/68.5/)
  expect(() => producir(censo([operacion(), operacion("300", "otra", "otra", "G76543214")]), magnitudes())).toThrow(/Múltiples/)
  expect(() => producir(censo([operacion(), { ...operacion(), eleccion: "no_aplicar" }]), magnitudes())).toThrow(/repetidos/)
  expect(() => producir(censo([operacion(), { ...operacion("300", "otra"), eleccion: "no_aplicar" }]), magnitudes())).toThrow(/franquicia250/)
})
it.each([
  { certificado: undefined }, { entidad: { ...operacion().entidad, referenciaRegimen: "" } },
  { pago: { ...operacion().pago, euros: "300.001" } }, { cuotaEstatal: "1000" }, { base68_3: "1000" },
])("frontera cerrada:hechos ausentes o magnitud cliente:%j", cambio => {
  expect(() => Schema.decodeUnknownSync(SolicitudDonativosEstatales2025)({ ...censo(), operaciones68_3: [{ ...operacion(), ...cambio }] }, { onExcessProperty: "error" })).toThrow()
})
it.each([
  { pago: { ...operacion().pago, pagador: "s-2" } },
  { certificado: { ...operacion().certificado, entidadNIF: "G76543214" } },
  { certificado: { ...operacion().certificado, euros: "301" } },
  { pago: { ...operacion().pago, fecha: "2025-02-29" } },
  { entidad: { ...operacion().entidad, nif: "G12345670" } },
])("rechaza identidad/fecha/certificado contradictorio:%j", cambio => {
  expect(() => producir(censo([{ ...operacion(), ...cambio }]), magnitudes())).toThrow()
})

const caso = (territorio: "cantabria" | "murcia" | "madrid" = "murcia"): MagnitudesTerritorialesAnuales["caso"] => ({ anio: 2025, comunidadAutonoma: territorio, contribuyenteId: "s-1", situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } })
function marco(s: Solicitud, territorio: "cantabria" | "murcia" | "madrid" = "murcia"): MagnitudesTerritorialesAnuales {
  const m = magnitudes(), libro = producir(s, m)
  return { caso: caso(territorio), baseGeneral: m.baseLiquidableGeneral, baseAhorro: m.baseLiquidableAhorro, basesLiquidables: { general: m.baseLiquidableGeneral, ahorro: m.baseLiquidableAhorro }, minimoPersonalFamiliar: new Decimal(5550), cuotaAutonomica: m.cuotaAutonomica, cuotaAutonomicaResidual: eurosDonativos(libro.autonomica.disponible), donativosEstatales: libro, sujetosConMinimo: [] }
}
const resolucion = { referencia: "regional", organismo: "registro", fecha: "2025-01-01" }
it("Cantabria BL20000:base estatal1000 desde pago real;regional1500=>150", () => {
  const a = operacion("1000"), b = { ...operacion("1500", "op-regional", "e-regional", "G76543214"), eleccion: "no_aplicar" as const }
  const s = censo([a, b])
  const hechos = { codigo: "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad" as const, donaciones: [{ id: b.operacionId, entidad: { id: b.entidad.id, clase: "fundacion" as const, domicilio: "cantabria", registro: resolucion, cuentasProtectorado: resolucion, depositoCuentas: resolucion, fines: ["cultural" as const], utilidadPublica: null, ingresos: "0", aplicadoFinesInteresGeneral: "0", memoriaEconomica: null, certificacionDonacion: resolucion }, pagos: [{ id: b.pago.id, pagador: "s-1", receptor: b.entidad.id, fecha: b.pago.fecha, euros: b.pago.euros, documento: b.pago.documento, medio: "transferencia" as const }] }] }
  const r = territoriales({ donativosEstatales2025: s, solicitudes: [{ lote: "B-ampliado", hechos }] }, marco(s, "cantabria"))
  expect(r.total).toEqual(racional("150")); expect(marco(s).donativosEstatales?.base68_3).toEqual(racional("1000"))
})
it("Murcia sólo resta la base estatal de la misma operación;otra elección no aplica", () => {
  const a = operacion("300"), b = { ...operacion("300", "op-otra", "e-otra", "G76543214"), eleccion: "no_aplicar" as const }
  const s = censo([a,b]), libro = producir(s, magnitudes())
  expect(baseEstatalMismaOperacion(libro, a.operacionId, a.entidad.id, a.pago)).toEqual(racional("300"))
  expect(baseEstatalMismaOperacion(libro, b.operacionId, b.entidad.id, b.pago)).toEqual(racional("0"))
  const solicitud = { lote: "F-ampliado" as const, codigo: "murcia_donativos_patrimonio_cultural_actividades" as const, hechos: { entidades: [{ id: b.entidad.id, certificado: "cert-region", registro: "art3", proyectoMurcia: "si", situacionTributaria: "al_corriente", situacionSS: "al_corriente", cuentasPresentadas: "si", gradoVinculo: 4, interesComun: "no", creditoFiscalVigente: "no", destino: "cultural", forma: "entidad49_2002" }], pagos: [{ id: b.pago.id, operacionId: b.operacionId, pagador: "s-1", objetoId: b.entidad.id, fecha: b.pago.fecha, importeEUR: "300", concepto: "donativo_dinerario", medio: "transferencia", soportePago: b.pago.documento }] } }
  expect(territoriales({ donativosEstatales2025: s, solicitudes: [solicitud] }, marco(s)).total).toEqual(racional("150"))
})
it("topes sobre cuota íntegra permanecen;consumo utiliza residual", () => {
  const s = censo(), m = marco(s, "madrid")
  const r = territoriales({ donativosEstatales2025: s, solicitudes: [{ lote: "F-ampliado", codigo: "madrid_condicion_familia_numerosa", hechos: { miembrosUnidad: ["s-1"], titulo: { categoria: "general", efectos: "2025-01-01", referencia: "titulo", titulares: ["s-1"] } } }] }, m)
  expect(r.total).toEqual(racional("500")) //50% de1000 íntegra;no445 de890 residual.
})
it("Murcia:base estatal derivada2000.0001 no pasa por parser de hechos de céntimos", () => {
  const o = operacion("3000"), s = censo([o]), m = magnitudes("20000.001"), libro = producir(s, m)
  const contexto: MagnitudesTerritorialesAnuales = { ...marco(s), baseGeneral: m.baseLiquidableGeneral, basesLiquidables: { general: m.baseLiquidableGeneral, ahorro: m.baseLiquidableAhorro }, donativosEstatales: libro, cuotaAutonomicaResidual: eurosDonativos(libro.autonomica.disponible) }
  const solicitud = { lote: "F-ampliado" as const, codigo: "murcia_donativos_patrimonio_cultural_actividades" as const, hechos: { entidades: [{ id: o.entidad.id, certificado: "cert-region", registro: "art3", proyectoMurcia: "si", situacionTributaria: "al_corriente", situacionSS: "al_corriente", cuentasPresentadas: "si", gradoVinculo: 4, interesComun: "no", creditoFiscalVigente: "no", destino: "cultural", forma: "entidad49_2002" }], pagos: [{ id: o.pago.id, operacionId: o.operacionId, pagador: "s-1", objetoId: o.entidad.id, fecha: o.pago.fecha, importeEUR: "3000", concepto: "donativo_dinerario", medio: "transferencia", soportePago: o.pago.documento }] } }
  //3000-min(3000,20000.001*10%)=999.9999;50%=499.99995,antes de presentación.
  expect(territoriales({ donativosEstatales2025: s, solicitudes: [solicitud] }, contexto).total).toEqual(racional("499.99995"))
})
it("no acepta base estatal pública para Cantabria ni asignación fiscal en pago F", () => {
  expect(() => Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [], donativosEstatales2025: { ...censo(), base68_3: "1000" } }, { onExcessProperty: "error" })).toThrow()
})
it("Murcia biosanitaria reutiliza50% sobre operación no aplicada estatal", () => {
  const a = operacion(), b = { ...operacion("300", "op-bio", "e-bio", "G76543214"), eleccion: "no_aplicar" as const }, s = censo([a,b])
  const solicitud = { lote: "F-ampliado" as const, codigo: "murcia_donativos_investigacion_biosanitaria" as const, hechos: { entidades: [{ id: b.entidad.id, certificado: "cert-bio", registro: "art3", proyectoMurcia: "si", situacionTributaria: "al_corriente", situacionSS: "al_corriente", cuentasPresentadas: "si", gradoVinculo: 4, interesComun: "no", creditoFiscalVigente: "no", destino: "investigacion_biosanitaria", forma: "entidad49_2002_biosanitaria", biosanitaria: "registro-proyecto-bio" }], pagos: [{ id: b.pago.id, operacionId: b.operacionId, pagador: "s-1", objetoId: b.entidad.id, fecha: b.pago.fecha, importeEUR: "300", concepto: "donativo_dinerario", medio: "transferencia", soportePago: b.pago.documento }] } }
  expect(territoriales({ donativosEstatales2025: s, solicitudes: [solicitud] }, marco(s)).total).toEqual(racional("150"))
})

const anualCanonico = (): CasoFiscalAnual => ({ ...caso(), rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0 })
const anualEfectivo = () => ({ ejercicio: 2025, comunidadAutonoma: "murcia", contribuyenteId: "s-1", edad: 40, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: { solicitudes: [] }, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo", conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificado"] }, retenciones: [], trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "r", clase: "empleo-laboral", integro: "30000", cotizaciones: { clase: "efectivas", seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] } } as const)
it("ambas API descuentan220 reales una sola vez,sin liquidación alternativa en producción", () => {
  const a = anualCanonico(), base = Effect.runSync(liquidarIrpfAnual(a, { modo: "canonico" }))
  const con = Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025: { solicitudes: [], donativosEstatales2025: censo() } }, { modo: "canonico" }))
  expect(base.cuotaLiquidaCentimos - con.cuotaLiquidaCentimos).toBe(22000)
  const e = anualEfectivo(), sinE = Effect.runSync(liquidarIrpfAnualExplicito(e)), conE = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deduccionesTerritoriales2025: { solicitudes: [], donativosEstatales2025: censo() } }))
  expect(new Decimal(sinE.cuotaLiquidaLegal).minus(conE.cuotaLiquidaLegal).toFixed()).toBe("220")
})
it.each(["canonico", "efectivo"] as const)("%s:Cuotas realmente nulas no hacen aplicable la deducción generada", api => {
  if (api === "canonico") {
    const r = Effect.runSync(liquidarIrpfAnual({ ...anualCanonico(), rendimientos: { trabajo: [{ importeIntegroCentimos: 1000000 }] }, deduccionesTerritoriales2025: { solicitudes: [], donativosEstatales2025: censo() } }, { modo: "canonico" }))
    expect(r.cuotaLiquidaCentimos).toBe(0)
    const libro = r.deduccionesTerritoriales2025
    if (libro === undefined || !("donativosEstatales2025" in libro)) throw new Error("Falta libro estatal")
    expect(libro.donativosEstatales2025.aplicado).toEqual(racional("0"))
  } else {
    const e = anualEfectivo()
    const r = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, trabajo: { ...e.trabajo, rendimientos: [{ ...e.trabajo.rendimientos[0], integro: "10000" }] }, deduccionesTerritoriales2025: { solicitudes: [], donativosEstatales2025: censo() } }))
    expect(r.cuotaLiquidaLegal).toBe("0")
    const libro = r.deduccionesTerritoriales2025
    if (libro === undefined || !("donativosEstatales2025" in libro)) throw new Error("Falta libro estatal")
    expect(libro.donativosEstatales2025.aplicado).toEqual(racional("0"))
  }
})
it.each(["canonico", "efectivo"] as const)("%s:Murcia y estatal reducen cuota370 por operaciones distintas conciliadas", api => {
  const a = operacion(), b = { ...operacion("300", "op-otra", "e-otra", "G76543214"), eleccion: "no_aplicar" as const }
  const solicitud = { lote: "F-ampliado" as const, codigo: "murcia_donativos_patrimonio_cultural_actividades" as const, hechos: { entidades: [{ id: b.entidad.id, certificado: "cert-region", registro: "art3", proyectoMurcia: "si", situacionTributaria: "al_corriente", situacionSS: "al_corriente", cuentasPresentadas: "si", gradoVinculo: 4, interesComun: "no", creditoFiscalVigente: "no", destino: "cultural", forma: "entidad49_2002" }], pagos: [{ id: b.pago.id, operacionId: b.operacionId, pagador: "s-1", objetoId: b.entidad.id, fecha: b.pago.fecha, importeEUR: "300", concepto: "donativo_dinerario", medio: "transferencia", soportePago: b.pago.documento }] } }
  const libro = { solicitudes: [solicitud], donativosEstatales2025: censo([a,b]) }
  //220 estatal general +150 regional, no resta de otra operación ni segunda cuota.
  if (api === "canonico") {
    const sin = Effect.runSync(liquidarIrpfAnual(anualCanonico(), { modo: "canonico" }))
    const con = Effect.runSync(liquidarIrpfAnual({ ...anualCanonico(), deduccionesTerritoriales2025: libro }, { modo: "canonico" }))
    expect(sin.cuotaLiquidaCentimos - con.cuotaLiquidaCentimos).toBe(37000)
  } else {
    const e = anualEfectivo(), sin = Effect.runSync(liquidarIrpfAnualExplicito(e))
    const con = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deduccionesTerritoriales2025: libro }))
    expect(new Decimal(sin.cuotaLiquidaLegal).minus(con.cuotaLiquidaLegal).toFixed()).toBe("370")
  }
})
it.each(["canonico", "efectivo"] as const)("%s:Cantabria conecta bases reales estatales y límite compartido", api => {
  const a = operacion("1000"), b = { ...operacion("1500", "op-regional", "e-regional", "G76543214"), eleccion: "no_aplicar" as const }
  const hechos = { codigo: "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad" as const, donaciones: [{ id: b.operacionId, entidad: { id: b.entidad.id, clase: "fundacion" as const, domicilio: "cantabria", registro: resolucion, cuentasProtectorado: resolucion, depositoCuentas: resolucion, fines: ["cultural" as const], utilidadPublica: null, ingresos: "0", aplicadoFinesInteresGeneral: "0", memoriaEconomica: null, certificacionDonacion: resolucion }, pagos: [{ id: b.pago.id, pagador: "s-1", receptor: b.entidad.id, fecha: b.pago.fecha, euros: b.pago.euros, documento: b.pago.documento, medio: "transferencia" as const }] }] }
  const libro = { donativosEstatales2025: censo([a,b]), solicitudes: [{ lote: "B-ampliado" as const, hechos }] }
  if (api === "canonico") {
    const c = { ...anualCanonico(), comunidadAutonoma: "cantabria" as const }
    const sin = Effect.runSync(liquidarIrpfAnual(c, { modo: "canonico" }))
    const con = Effect.runSync(liquidarIrpfAnual({ ...c, deduccionesTerritoriales2025: libro }, { modo: "canonico" }))
    expect(con.deduccionesTerritoriales2025?.total).toEqual(racional("225"))
    expect(sin.cuotaLiquidaCentimos - con.cuotaLiquidaCentimos).toBe(72500) //500 estatal+225 regional, BL>25000.
  } else {
    const e = anualEfectivo(), c = { ...e, comunidadAutonoma: "cantabria" as const, trabajo: { ...e.trabajo, rendimientos: [{ ...e.trabajo.rendimientos[0], integro: "22000" }] } }
    const sin = Effect.runSync(liquidarIrpfAnualExplicito(c)), con = Effect.runSync(liquidarIrpfAnualExplicito({ ...c, deduccionesTerritoriales2025: libro }))
    expect(con.baseLiquidableGeneral).toBe("20000") //22000 brutos-2000 gasto general, sin art20 por superar umbral.
    expect(con.deduccionesTerritoriales2025?.total).toEqual(racional("150"))
    expect(new Decimal(sin.cuotaLiquidaLegal).minus(con.cuotaLiquidaLegal).toFixed()).toBe("650") //500 estatal+150 regional.
  }
})
