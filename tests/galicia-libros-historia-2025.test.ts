import { describe, it, expect } from "vitest"
import { Effect, Schema } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { SolicitudE38Anual2025 } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/anual-esquemas"
import { producirRentaLibros2024 } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/libros-historia"
import type { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"
import { libros } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/ayudas-libros"
import { ctx } from "./galicia-rioja-ampliacion-2025.casos"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
const doc = { referencia: "soporte", emisor: "organismo", fecha: "2026-01-01" }
const titular = "s-1", hijo = "s-2"
function trabajo(integro = "30000", ejercicio = 2024) {
 return { ejercicio, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "empleo", clase: "empleo-laboral", integro, cotizaciones: { clase: "efectivas", seguridadSocial: ejercicio === 2025 ? "1944" : "0", derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] } as const
}
function solicitud(bruto = "62000", compra = "100", declaracion2024: "individual" | "no-presentada" = "individual") {
 return Schema.decodeUnknownSync(SolicitudE38Anual2025)({
 lote: "E38", nacimientoContribuyente: "1990-01-01", exhaustividad: "expediente_comun_completo_todos_pagadores", inversionesViviendaEjercicio: [],
 historiaLibros2024: { ejercicio: 2024, desde: "2024-01-01", hasta: "2025-12-31", composicion: "progenitor-viudo-sin-pareja", censo: "completo-sin-cambios-filiacion-convivencia-estado-civil-discapacidad", soporte: doc, personas: [
 { id: titular, nacimiento: "1990-01-01", relacion: "progenitor", residencia: "comun-todo-2024", declaracion2024, soporte: doc, economia: { perfil: "trabajo", trabajo: trabajo(bruto), censo: "completo-sin-otras-rentas-exentas-reducciones-base-ni-saldos", certificadoImputaciones: doc } },
 { id: hijo, nacimiento: "2015-01-01", relacion: "hijo-soltero-no-emancipado", residencia: "comun-todo-2024", declaracion2024: "no-presentada", soporte: doc, economia: { perfil: "sin-ingresos", certificadoImputaciones: doc, censo: "completo-sin-rentas-ni-exentas" } } ] },
 hechos: { codigo: "galicia_libros_texto_material_escolar", miembros2024: [{ persona: { id: titular, nacimiento: "1990-01-01", discapacidad: 0 }, pensionIncapacidad: "ninguna" }, { persona: { id: hijo, nacimiento: "2015-01-01", discapacidad: 0 }, pensionIncapacidad: "ninguna" }], descendientes: [{ persona: { id: hijo, nacimiento: "2015-01-01", discapacidad: 0 }, progenitores: [titular], titularesMinimo: [titular], titularesDeduccion: [titular], nivel: "primaria", centro: "fondos_publicos", curso: "2025-2026", ayudasCurso: [], compras: [{ categoria: "texto", facturaFecha: "2025-07-01", pago: { id: "compra", pagador: titular, receptor: "libreria", fecha: "2025-08-01", importe: compra, factura: "factura", concepto: "libros", medio: "efectivo", subvencion: "0", especieExenta: "0" } }] }] }
 }, { onExcessProperty: "error" })
}
const derechos: DerechosMinimosAnuales = { ejercicio: 2025, territorio: "galicia", regimen: "comun", modalidad: "individual", devengo: "2025-12-31", contribuyenteId: titular, edadContribuyenteDevengo: 35, discapacidadContribuyente: { _tag: "SinDiscapacidad" }, ascendientes: "ninguno", fallecimientosEnElEjercicio: "ninguno", descendientesCompletos: true, conciliacionRentasContribuyente: { perfil: "caso-anual-parcial", otrasRentasOGastosNoRepresentados: "ninguno" }, descendientes: [{ sujetoId: hijo, fechaNacimiento: "2015-01-01", edadDevengo: 10, vivoAlDevengo: true, rentasNoExentasCentimos: 0, declaracion: { modalidad: "no-presenta" }, discapacidad: { _tag: "SinDiscapacidad" }, titularesCompletos: true, titulares: [{ titularId: titular, grado: 1, vinculo: { clase: "consanguinidad" }, relacion: "convivencia", custodia: "exclusiva", alimentosJudiciales: false, aplicaEspecialidadAlimentos: false, residenteIrpf: true, rentasNoExentasCentimos: 2605600 }] }] }
function canonico(s: SolicitudE38Anual2025): CasoFiscalAnual { return { anio: 2025, comunidadAutonoma: "galicia", contribuyenteId: titular, derechosMinimos: derechos, situacionFamiliar: { tipo: "individual", edad: 35, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] }, rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0, deduccionesTerritoriales2025: { solicitudes: [s] } } }
function efectivo(s: SolicitudE38Anual2025) { return { ejercicio: 2025, comunidadAutonoma: "galicia", contribuyenteId: titular, edad: 35, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "segun-derechos", derechosMinimos: derechos, discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: { solicitudes: [s] }, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo", trabajo: trabajo("30000", 2025), conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificado"] }, retenciones: [] } as const }
for (const api of ["canonica", "efectiva"] as const) describe(api, () => {
 const ejecutar = (s: SolicitudE38Anual2025) => Effect.gen(function* () {
  if (api === "canonica") return yield* liquidarIrpfAnual(canonico(s), { modo: "canonico" })
  return yield* liquidarIrpfAnualExplicito(efectivo(s))
 })
 for (const [bruto, compra, esperado] of [["62000", "100", "15"], ["62000", "1000", "105"], ["62000.01", "100", "0"]]) it("frontera2024 " + bruto + "/" + compra, () => { const r = Effect.runSync(ejecutar(solicitud(bruto, compra))); expect(r.deduccionesTerritoriales2025?.total).toEqual(racional(esperado)); expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1) })
 it("no declarante con renta positiva conserva reserva explícita de imputaciones", () => { for (const bruto of ["62000", "60000"]) { const error = Effect.runSync(Effect.flip(ejecutar(solicitud(bruto, "100", "no-presentada")))); expect(error.motivo).toContain("Libros.imputaciones"); expect("cuotaLiquidaCentimos" in error).toBe(false) } })
 it("beca mismo hijo/curso produce cero", () => { const s = solicitud(); if (s.hechos.codigo !== "galicia_libros_texto_material_escolar") throw Error("fixture"); const x = { ...s, hechos: { ...s.hechos, descendientes: s.hechos.descendientes.map(h => ({ ...h, ayudasCurso: [doc] })) } }; expect(Effect.runSync(ejecutar(x)).deduccionesTerritoriales2025?.total).toEqual(racional("0")) })
 it("historia ausente rechaza con causa y sin importe", () => { const s = solicitud(); const { historiaLibros2024: omitida, ...sin } = s; expect(omitida).toBeDefined(); const e = Effect.runSync(Effect.flip(ejecutar(sin))); expect(e._tag).toBe("ResultadoNoSoportado"); expect(JSON.stringify(e)).toContain("Libros.historia") })
})
it("contrato público rechaza base/cuota/renta ajenas", () => { for (const campo of ["base", "cuota", "renta2024", "derecho"]) { const s = solicitud(); expect(() => Schema.decodeUnknownSync(SolicitudE38Anual2025)({ ...s, historiaLibros2024: { ...s.historiaLibros2024, [campo]: "0" } }, { onExcessProperty: "error" })).toThrow() } })
it("causas concretas miembros0/duplicado/ausente/año/modalidad/cotizaciones", () => {
 const s = solicitud(); if (s.hechos.codigo !== "galicia_libros_texto_material_escolar" || s.historiaLibros2024 === undefined) throw Error("fixture")
 const h = s.historiaLibros2024, hechos = s.hechos
 for (const personas of [[], [...h.personas, ...h.personas], h.personas.slice(1)]) expect(() => producirRentaLibros2024({ ...h, personas }, [...hechos.miembros2024], titular, s.nacimientoContribuyente)).toThrow(/Libros.miembros/)
 const padre = h.personas[0]; if (padre.economia.perfil !== "trabajo") throw Error("fixture")
 for (const p of [{ ...padre, declaracion2024: "conjunta" as const }, { ...padre, economia: { ...padre.economia, trabajo: { ...padre.economia.trabajo, ejercicio: 2025 } } }, { ...padre, economia: { ...padre.economia, trabajo: { ...padre.economia.trabajo, rendimientos: padre.economia.trabajo.rendimientos.map(r => ({ ...r, cotizaciones: { ...r.cotizaciones, clase: "estimadas" as const } })) } } }]) expect(() => producirRentaLibros2024({ ...h, personas: [p, ...h.personas.slice(1)] }, [...hechos.miembros2024], titular, s.nacimientoContribuyente)).toThrow(/Libros.(modalidad|ejercicio|cotizaciones)/)
})

it("dos progenitores: gasto propio100 da15 y sólo el máximo105 se divide", () => {
 const s = solicitud("62000", "100")
 if (s.hechos.codigo !== "galicia_libros_texto_material_escolar") throw Error("fixture")
 const hechos = s.hechos
 const miembros2024 = producirRentaLibros2024(s.historiaLibros2024, [...hechos.miembros2024], titular, s.nacimientoContribuyente)
 for (const [importe, esperado] of [["100", "15.00"], ["400", "52.50"]]) {
  const h = { ...hechos, miembros2024, descendientes: hechos.descendientes.map(x => ({ ...x, progenitores: [titular, "s-3"], titularesMinimo: [titular, "s-3"], titularesDeduccion: [titular, "s-3"], compras: x.compras.map(a => ({ ...a, pago: { ...a.pago, importe } })) })) }
  const c = { ...ctx(), magnitudes: [], titular, declarantes: [titular], personas: [{ id: titular, nacimiento: "1990-01-01", discapacidad: 0 }] }
  const r = libros(c, h)
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado === "calculo_parcial") expect(r.presentacionEuros).toBe(esperado)
  const ajenos = libros(c, { ...h, descendientes: h.descendientes.map(x => ({ ...x, compras: x.compras.map(a => ({ ...a, pago: { ...a.pago, pagador: "s-3" } })) })) })
  expect(ajenos.estado).toBe("calculo_parcial")
  if (ajenos.estado === "calculo_parcial") expect(ajenos.presentacionEuros).toBe("0.00")
 }
})
