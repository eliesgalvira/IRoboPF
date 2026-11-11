import Decimal from "decimal.js"
import { DateTime, Option, Result, Schema } from "effect"

const Texto = Schema.String.check(Schema.isPattern(/^\S(?:.*\S)?$/))
const Euros = Schema.String.check(Schema.isPattern(/^(0|[1-9]\d{0,11})(\.\d{1,2})?$/))
const Documento = Schema.Struct({ referencia: Texto, emisor: Texto, fecha: Texto })
const Operacion = Schema.Struct({
  id: Texto, objeto: Texto, titular: Texto, fecha: Texto,
  orden: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
  clase: Schema.Literals(["adquisicion", "rehabilitacion", "deposito", "retirada"]),
  importe: Euros, documento: Documento,
})
/** Registro de hechos por origen. Nunca recibe base, cuota, saldo fiscal o elegibilidad. */
export const HistoriaBasesD51 = Schema.Struct({
  version: Schema.Literal("historia-bases-d51-v1"),
  titular: Texto, objeto: Texto,
  censo: Schema.Literal("completo-desde-primera-operacion"),
  financiacion: Schema.Literals(["sin-financiacion", "precio-aplazado-vendedor-sin-intereses"]),
  objetos: Schema.Array(Schema.Struct({
    id: Texto, clase: Schema.Literals(["vivienda", "cuenta"]),
    primeraOperacion: Texto, documento: Documento,
  })),
  operaciones: Schema.Array(Operacion),
  aplicaciones: Schema.Array(Schema.Struct({
    ejercicio: Schema.Literals([2021, 2022, 2023, 2024]),
    titular: Texto, objeto: Texto,
    estado: Schema.Literals(["no-solicitada", "aplicacion-no-reconstruida"]),
    documento: Documento,
  })),
  transmisiones: Schema.Array(Schema.Struct({ objeto: Texto, fecha: Texto, documento: Documento })),
})
export type HistoriaBasesD51 = typeof HistoriaBasesD51.Type
export type CodigoHistoriaD51 =
  | "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales"
  | "clm_ahorro_inversion_primera_vivienda"
  | "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler"
  | "extremadura_vivienda_zonas_rurales"
type PagoHistoria = { readonly id: string; readonly fecha: string; readonly pagador: string; readonly importe: string }
type ContextoHistoria = {
  readonly codigo: CodigoHistoriaD51
  readonly titular: string
  readonly objeto: string
  readonly fechaOperacion: string
  readonly pagos: readonly PagoHistoria[]
  readonly costePropio: string
}
export type LibroHistoriaD51 = {
  readonly origenNormativo: 2021 | 2022 | 2025
  readonly semantica: "base-aplicada-vivienda" | "cuota-deducida-cuenta"
  readonly magnitud: { readonly ejercicio: 2025; readonly declarantes: readonly string[]; readonly concepto: string; readonly valor: string }
  readonly saldoInicioCuenta: string
  readonly saldoFinCuenta: string
  readonly fundamentos: readonly string[]
}
const D = Decimal.clone({ precision: 80 })
function exigir(ok: boolean, motivo: string): asserts ok {
  if (!ok) throw new RangeError("HistoriaD51: " + motivo)
}
function fecha(dia: string): string {
  exigir(/^\d{4}-\d{2}-\d{2}$/.test(dia), "fecha civil inválida")
  const d = DateTime.make(dia + "T00:00:00Z")
  exigir(Option.isSome(d) && DateTime.formatIsoDateUtc(d.value) === dia, "fecha civil inexistente")
  return dia
}
function documento(d: typeof Documento.Type): void {
  fecha(d.fecha)
  exigir(d.fecha <= "2026-12-31", "documento fuera del perfil temporal; no autenticar por referencia")
}
/** Sin aplicaciones previas: cero demostrado por vigencia o por censo documental exhaustivo.
 * Una aplicación histórica positiva necesita su liquidación de origen. Ni generación ni
 * inversión ni un importe autoliquidado por el cliente sustituyen a la base aplicada.
 */
export function producirHistoriaBasesD51(entrada: HistoriaBasesD51 | undefined, c: ContextoHistoria): LibroHistoriaD51 {
  return producirHistoria(entrada, c, false)
}
/** Entrada reservada al productor positivo CLM que reconstruye el pasivo vendedor.
 * Las demás rutas conservan el rechazo de financiación. No sanea ni cambia etiquetas.
 */
export function producirHistoriaBasesD51PrecioAplazado(entrada: HistoriaBasesD51 | undefined, c: ContextoHistoria): LibroHistoriaD51 {
  return producirHistoria(entrada, c, true)
}
function producirHistoria(entrada: HistoriaBasesD51 | undefined, c: ContextoHistoria, vendedor: boolean): LibroHistoriaD51 {
  exigir(entrada !== undefined, "falta censo histórico para baseConsumidaAnterior/baseHistorica/deducidoAnterior; no se presume cero")
  const decoded = Schema.decodeUnknownResult(HistoriaBasesD51)(entrada, { onExcessProperty: "error" })
  exigir(Result.isSuccess(decoded), "contrato cerrado inválido o magnitud fiscal externa")
  const h = decoded.success
  exigir(vendedor ? c.codigo === "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales" &&
    h.financiacion === "precio-aplazado-vendedor-sin-intereses" : h.financiacion === "sin-financiacion",
    "financiación exige productor factual de deuda vendedor")
  exigir(h.titular === c.titular && h.objeto === c.objeto, "titular/objeto de otra solicitud")
  fecha(c.fechaOperacion)
  const cuenta = c.codigo === "clm_ahorro_inversion_primera_vivienda"
  const nueva2025 = cuenta || c.codigo === "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler"
  const origen = nueva2025 ? 2025 : c.codigo.startsWith("clm_") ? 2021 : 2022
  const objetos = new Map(h.objetos.map(o => [o.id, o]))
  exigir(objetos.size === h.objetos.length && objetos.has(c.objeto), "objetos duplicados o falta el actual")
  exigir(!cuenta || h.objetos.length === 1, "cuenta única; sustitución/traspaso de cuenta no representado")
  const propio = objetos.get(c.objeto)
  exigir(propio !== undefined && propio.clase === (cuenta ? "cuenta" : "vivienda"), "clase de objeto contradictoria")
  for (const o of h.objetos) {
    exigir(o.clase === (cuenta ? "cuenta" : "vivienda"), "censo de otra clase")
    fecha(o.primeraOperacion); documento(o.documento)
    exigir(o.primeraOperacion <= "2025-12-31", "primera operación futura")
    exigir(o.documento.fecha >= o.primeraOperacion, "soporte anterior a primera operación")
  }
  // En vivienda la inversión puede comenzar antes de adquisición/fin de obras.
  exigir(propio.primeraOperacion <= c.fechaOperacion && c.fechaOperacion <= "2025-12-31", "primera operación posterior al hecho actual")
  if (cuenta) {
    exigir(propio.primeraOperacion === c.fechaOperacion, "apertura no conciliada")
    exigir(c.fechaOperacion > "2019-12-31", "destino en seis años: plazo vencido o aniversario exacto no representado")
  }
  const ids = new Set<string>(), soportes = new Set<string>(), ordenes = new Set<string>()
  let saldo = new D(0), saldoInicio = new D(0)
  const operaciones = [...h.operaciones].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.orden - b.orden)
  for (const p of operaciones) {
    const o = objetos.get(p.objeto)
    exigir(o !== undefined && p.titular === c.titular, "operación de objeto/titular no censado")
    fecha(p.fecha); documento(p.documento)
    exigir(p.fecha >= o.primeraOperacion && p.fecha <= "2025-12-31", "operación fuera de historia representada")
    exigir(p.documento.fecha >= p.fecha, "soporte de operación anterior al hecho")
    const clave = p.objeto + ":" + p.fecha + ":" + p.orden
    const soporte = p.documento.emisor + ":" + p.documento.referencia
    exigir(!ids.has(p.id) && !soportes.has(soporte) && !ordenes.has(clave), "operación/soporte/orden duplicado")
    ids.add(p.id); soportes.add(soporte); ordenes.add(clave)
    exigir(new D(p.importe).gt(0), "operación sin importe positivo")
    exigir(cuenta ? ["deposito", "retirada"].includes(p.clase) : ["adquisicion", "rehabilitacion"].includes(p.clase), "naturaleza de operación no representada")
    if (cuenta) {
      saldo = p.clase === "retirada" ? saldo.minus(p.importe) : saldo.plus(p.importe)
      exigir(saldo.gte(0), "retirada superior al saldo económico")
      if (p.fecha < "2025-01-01") saldoInicio = new D(saldo)
    }
  }
  for (const o of h.objetos) {
    const primeras = operaciones.filter(p => p.objeto === o.id)
    // Apertura con saldo cero no es una aportación. Vivienda sí requiere pago inicial.
    if (!cuenta) exigir(primeras[0]?.fecha === o.primeraOperacion, "falta primera operación económica del objeto")
  }
  if (!cuenta) {
    const actuales = operaciones.filter(p => p.objeto === c.objeto && p.fecha >= "2025-01-01")
    exigir(actuales.length === c.pagos.length && actuales.every(p => c.pagos.some(q => q.id === p.id && q.fecha === p.fecha && q.pagador === p.titular && new D(q.importe).eq(p.importe))), "pagos2025 no concilian exactamente con historia")
    const invertido = operaciones.filter(p => p.objeto === c.objeto).reduce((a, p) => a.plus(p.importe), new D(0))
    exigir(invertido.lte(c.costePropio), "pagos directos exceden coste propio; financiación/gastos no conciliados")
  }
  const aplicaciones = new Set<string>()
  for (const a of h.aplicaciones) {
    const o = objetos.get(a.objeto)
    exigir(o !== undefined && a.titular === c.titular, "aplicación de otro titular/objeto")
    documento(a.documento)
    const clave = a.objeto + ":" + a.ejercicio
    exigir(!aplicaciones.has(clave), "aplicación de origen duplicada")
    aplicaciones.add(clave)
    exigir(a.ejercicio >= origen && String(a.ejercicio) >= o.primeraOperacion.slice(0, 4), "aplicación anterior al origen normativo/objeto")
    exigir(a.documento.fecha >= String(a.ejercicio + 1) + "-01-01", "soporte anterior al cierre del origen")
    exigir(a.estado === "no-solicitada", "aplicación histórica no reconstruida: " + clave + "; faltan liquidación, cuota y base efectivamente aplicada; inversión no equivale a base aplicada ni a cuota deducida")
  }
  const origenesConPagos = new Set(operaciones.map(p => p.objeto + ":" + p.fecha.slice(0, 4)))
  for (const o of h.objetos) {
    for (let ejercicio = Math.max(origen, Number(o.primeraOperacion.slice(0, 4))); ejercicio < 2025; ejercicio++) {
      const clave = o.id + ":" + ejercicio
      // Sin pagos del origen, el censo económico exhaustivo demuestra generación cero.
      // No hay arrastre de exceso de base que convierta ese año en una inversión pagada.
      if (origenesConPagos.has(clave))
        exigir(aplicaciones.has(clave), "falta aplicación/documento del origen " + clave)
    }
  }
  for (const t of h.transmisiones) {
    exigir(objetos.has(t.objeto), "transmisión de objeto ajeno")
    fecha(t.fecha); documento(t.documento)
    exigir(t.fecha <= "2025-12-31", "transmisión futura")
  }
  exigir(h.transmisiones.length === 0, "transmisión/reinversión o sustitución de cuenta requiere productor propio; no recibir ganancia exenta externa")
  const concepto = cuenta ? "deducciones_cuenta_anteriores:" + c.objeto : "base_historica_vivienda:" + c.objeto
  return {
    origenNormativo: origen,
    semantica: cuenta ? "cuota-deducida-cuenta" : "base-aplicada-vivienda",
    magnitud: { ejercicio: 2025, declarantes: [c.titular], concepto, valor: "0" },
    saldoInicioCuenta: saldoInicio.toFixed(), saldoFinCuenta: saldo.toFixed(),
    fundamentos: [
      nueva2025 ? "Regla con efectos desde2025: no existen aplicaciones anteriores de esta deducción" : "Censo completo desde primera operación: orígenes anteriores sin pagos o expresamente no solicitados",
      "No se equiparan importe invertido, base generada, base aplicada y cuota deducida; aplicaciones positivas no reconstruidas se rechazan",
      "Historia condicionada a veracidad y soporte documental; no autentica autoliquidaciones",
    ],
  }
}
