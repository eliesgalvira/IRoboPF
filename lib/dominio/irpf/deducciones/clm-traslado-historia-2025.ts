import Decimal from "decimal.js"
import { Schema } from "effect"
import { GastosTrabajo, Euros } from "../trabajo-anual/contrato"
import { adaptarTrabajoAnual } from "../trabajo-anual/adaptador"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"
import type { MagnitudesTerritorialesAnuales } from "./anual-territorial"
import { fecha } from "./territorial-f-ampliacion-2025/comun"
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const D = Decimal.clone({ precision: 200 })
/** Hechos de origen; nunca una base, cuota o deducción aplicada externa. */
export const HistoriaTrasladoCLM = Schema.Struct({
  contribuyente: Texto, referencia: Texto, ejercicio: Schema.Literal(2024),
  modalidad: Schema.Literal("individual"), primerEjercicioAplicacion: Schema.Literal(2024),
  residenteComunTodoEjercicio: Schema.Literal(true), vivoTodoEjercicio: Schema.Literal(true),
  otrasRentas: Schema.Literal("ninguna"), reduccionesBase: Schema.Literal("ninguna"),
  saldosAnteriores: Schema.Literal("ninguno"), censoRentasCompleto: Schema.Literal(true),
  trabajo: GastosTrabajo,
  certificados: Schema.Array(Schema.Struct({
    rendimiento: Texto, titular: Texto, pagador: Texto, referencia: Texto,
    ejercicio: Schema.Literal(2024), integro: Euros,
    seguridadSocial: Euros, derechosPasivos: Euros, colegiosHuerfanos: Euros,
  })),
  traslado: Schema.Struct({
    persona: Texto, fecha: Texto, viviendaAnterior: Texto, viviendaNueva: Texto,
    municipio: Texto, categoria: Schema.Literals(["intensa", "extrema", "riesgo", "intermedia"]),
    soporteClasificacion2024: Texto, soporteClasificacion2025: Texto,
    causa: Schema.Literal("trabajo"), soporteLaboral: Texto,
    residenciaDesde: Texto, residenciaHasta: Schema.Literal("2025-12-31"), soporteResidencia: Texto,
    sinInterrupciones: Schema.Literal(true),
    // No se certifican hechos futuros como ya cumplidos.
    seguimiento: Schema.Literal("pendiente-hasta-2027-12-31"),
    gastos: Schema.Array(Schema.Struct({ id: Texto, pagador: Texto, fecha: Texto, importe: Euros, soporte: Texto })),
    otrosIncentivosMismoGasto: Schema.Literal("ninguno"),
  }),
})
export type HistoriaTrasladoCLM = typeof HistoriaTrasladoCLM.Type
function exigir(b: boolean, mensaje: string): asserts b { if (!b) throw new RangeError("D51 CLM historia: " + mensaje) }
/** Patrón económico Madrid: art19 por ejercicio + art20, una vez; sin sus umbrales. */
export function producirBaseInicialTrasladoCLM(h: HistoriaTrasladoCLM, actual: {
  readonly fechaTraslado: string; readonly categoria: string; readonly causa: string
}, m: MagnitudesTerritorialesAnuales): string {
  const t = h.trabajo, v = h.traslado, propio = m.caso.contribuyenteId
  exigir(h.contribuyente === propio && v.persona === propio, "identidad no conciliada")
  exigir(m.caso.anio === 2025 && m.caso.comunidadAutonoma === "castilla-la-mancha" &&
    m.caso.situacionFamiliar.tipo === "individual" && m.caso.fechaFallecimiento === undefined,
    "sólo individual ordinaria2025")
  const dia = fecha(v.fecha, "traslado.fecha")
  exigir(dia >= "2024-01-01" && dia <= "2024-12-31", "traslado fuera del origen2024/plazo2025")
  exigir(actual.fechaTraslado === dia && actual.categoria === v.categoria && actual.causa === v.causa,
    "solicitud2025 contradice traslado2024")
  exigir(v.viviendaAnterior !== v.viviendaNueva, "vivienda de origen igual a destino")
  exigir(/^\d{5}$/.test(v.municipio), "municipio sin código INE")
  exigir(fecha(v.residenciaDesde, "residenciaDesde") === dia, "residencia no comienza con traslado")
  exigir(t.ejercicio === 2024 && t.territorio === "comun" && t.reduccionesArt18 === "ninguna" &&
    t.movilidad === "ninguna" && t.discapacidadActiva === "ninguna" && t.rendimientos.length > 0 &&
    t.rendimientos.every(r => r.clase === "empleo-laboral" || r.clase === "empleo-estatutario"),
    "perfil salarial ordinario2024 requerido; movilidad/actividad/pensión fuera de cobertura")
  exigir(new Set(t.rendimientos.map(r => r.id)).size === t.rendimientos.length &&
    new Set(h.certificados.map(c => c.rendimiento)).size === h.certificados.length &&
    h.certificados.length === t.rendimientos.length, "certificados incompletos/duplicados")
  for (const r of t.rendimientos) {
    const c = h.certificados.find(c => c.rendimiento === r.id)
    exigir(c !== undefined && c.titular === propio && new D(c.integro).eq(r.integro) &&
      r.cotizaciones.clase === "efectivas" &&
      new D(c.seguridadSocial).eq(r.cotizaciones.seguridadSocial) &&
      new D(c.derechosPasivos).eq(r.cotizaciones.derechosPasivos) &&
      new D(c.colegiosHuerfanos).eq(r.cotizaciones.colegiosHuerfanos), "certificado nominal/gastos efectivos contradictorios")
  }
  exigir(v.gastos.length > 0 && new Set(v.gastos.map(p => p.id)).size === v.gastos.length,
    "gastos de traslado ausentes/duplicados")
  for (const p of v.gastos) exigir(p.pagador === propio && new D(p.importe).gt(0) &&
    fecha(p.fecha, "gasto.fecha") >= "2024-01-01" && p.fecha <= "2024-12-31", "gasto ajeno o fuera de origen2024")
  exigir(m.rentasTrabajoAnuales !== undefined && m.rentasTrabajoAnuales.integroTrabajo.gt(0) &&
    m.rentasTrabajoAnuales.restoRentas.eq(0) && m.baseAhorro.eq(0), "cuota trabajo2025 no atribuible con rentas mixtas")
  const a = adaptarTrabajoAnual(t)
  if (a.estado === "no-soportado") throw new RangeError("D51 CLM historia: " + a.motivo)
  const neto = new D(a.rendimientoAntesArt20)
  exigir(neto.gte(0), "pérdida histórica requiere productor de integración y saldos; no sustituir por base cero")
  const reduccion = D.min(D.max(0, neto), calcularReduccionTrabajoConOtrasRentas({
    anio: 2024, rendimientoPrevioNeto: new D(a.argumentoArt20), otrasRentasNoExentas: new D(0),
  }))
  // Perfil sin pérdidas, otras rentas, reducciones ni saldos: BLG=RN-art20; BLA=0.
  return neto.minus(reduccion).toFixed()
}
