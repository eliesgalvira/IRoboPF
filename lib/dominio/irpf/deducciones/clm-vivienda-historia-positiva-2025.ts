import type { TrabajoActualCLM2025 } from "../patrimonio-historico-clm/actual"
import Decimal from "decimal.js"
import { PatrimonioHistoricoCLM } from "../patrimonio-historico-clm/contrato"
import { producirPatrimonioHistoricoCLM } from "../patrimonio-historico-clm/productor"
import { compara } from "./galicia-rioja-ampliacion-2025/comun"
import { fecha } from "./territorial-f-ampliacion-2025/comun"
import { Result, Schema } from "effect"
import { Euros, GastosTrabajo } from "../trabajo-anual/contrato"
import { adaptarTrabajoAnual } from "../trabajo-anual/adaptador"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"
import { calcularCuotaPorEscala } from "../cuotas/escalas-gravamen"
import { obtenerEscalaAutonomicaIrpf2024 } from "../../normativa/datos/irpf-autonomico-2024"
import { obtenerMinimosAutonomicosIrpf2024 } from "../../normativa/datos/minimos-autonomicos-2024"
import { redondearImporteLiquidado } from "../../dinero/importe-monetario"
import { HistoriaBasesD51, producirHistoriaBasesD51PrecioAplazado, type LibroHistoriaD51 } from "./historia-bases-d51"
const Texto = Schema.String.check(Schema.isPattern(/^\S(?:.*\S)?$/))
const Documento = Schema.Struct({ referencia: Texto, emisor: Texto, fecha: Texto })
/** Primer perfil positivo: compra jurídica2024, propietario único, pagos directos.
 * Censo negativo explícito: no importa ninguna magnitud fiscal del llamador.
 */
export const AplicacionViviendaCLM2024 = Schema.Struct({
  version: Schema.Literal("clm-vivienda-aplicacion-2024-v1"),
  titular: Texto, vivienda: Texto, ejercicio: Schema.Literal(2024),
  aplicacion: Schema.Literal("solicitada-en-autoliquidacion-original"), documento: Documento,
  modalidad: Schema.Literal("individual"), residencia: Schema.Literal("clm-todo-2024"),
  vivoTodoEjercicio: Schema.Literal(true), nacimiento: Texto,
  otrasRentas: Schema.Literal("ninguna-incluidas-exentas-extranjero-imputaciones"),
  familiaresMinimo: Schema.Literal("ninguno"), discapacidad: Schema.Literal("ninguna"),
  reduccionesBase: Schema.Literal("ninguna"), saldosAnteriores: Schema.Literal("ninguno"),
  otrasDeducciones: Schema.Literal("ninguna-estatal-autonomica-doble-imposicion"),
  otrasViviendasDeducidas: Schema.Literal("ninguna-desde-2021"),
  transmisionesReinversiones: Schema.Literal("ninguna"), ayudas: Schema.Literal("ninguna"),
  financiacion: Schema.Literal("precio-aplazado-vendedor-sin-intereses-ni-banco"),
  trabajo: GastosTrabajo,
  certificados: Schema.Array(Schema.Struct({ rendimiento: Texto, titular: Texto, documento: Documento,
    integro: Euros, seguridadSocial: Euros, derechosPasivos: Euros, colegiosHuerfanos: Euros })),
  compra: Schema.Struct({ fecha: Texto, escritura: Documento, plenoDominioDesde: Texto,
    porcentaje: Schema.Literal("100"), coste: Euros, municipio: Texto,
    categoria: Schema.Literals(["intensa", "extrema"]), poblacion2024: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0), Schema.isLessThan(5000)),
    poblacion2025: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0), Schema.isLessThan(5000)),
    soporteMunicipal2024: Documento, soporteMunicipal2025: Documento,
    ocupacionDesde: Texto, ocupacionHasta: Schema.Literal("2025-12-31"), soporteOcupacion: Documento,
    permanencia: Schema.Literal("sin-interrupciones-hasta-2025-obligacion-tres-anos-pendiente"),
  }),
  patrimonioHistorico: PatrimonioHistoricoCLM,
})
export type AplicacionViviendaCLM2024 = typeof AplicacionViviendaCLM2024.Type
const D = Decimal.clone({ precision: 80 })
function exigir(b: boolean, texto: string): asserts b { if (!b) throw new RangeError("Historia vivienda CLM: " + texto) }
type Contexto = Parameters<typeof producirHistoriaBasesD51PrecioAplazado>[1]
type Actual = { readonly categoria: string; readonly poblacionFiscal: number; readonly coste: string;
  readonly porcentajePropiedad: string; readonly ayudaJccm: string; readonly concurrencia12: string }
export type LibroAplicacionViviendaCLM = LibroHistoriaD51 & {
  readonly patrimonioFactual: {
    readonly cortes2024: ReturnType<typeof producirPatrimonioHistoricoCLM>["cortes2024"]["traza"];
    readonly cortes2025: ReturnType<typeof producirPatrimonioHistoricoCLM>["cortes2025"]["traza"]
  };
  readonly origenAplicacion: 2024; readonly baseAplicada2024: string;
  readonly cuotaGenerada2024: string; readonly cuotaEfectiva2024: string; readonly arrastre2025: "0"
}
/** Composición acíclica de art19/art20, escala y mínimo2024, con censo negativo.
 * Sólo cuota suficiente: nunca convierte una cuota parcial en base consumida.
 */
export function producirAplicacionViviendaCLM2024(entrada: AplicacionViviendaCLM2024,
  historia: HistoriaBasesD51 | undefined, c: Contexto, actual: Actual, edadActual: number, trabajoActual2025: TrabajoActualCLM2025): LibroAplicacionViviendaCLM {
  const dec = Schema.decodeUnknownResult(AplicacionViviendaCLM2024)(entrada, { onExcessProperty: "error" })
  exigir(Result.isSuccess(dec), "contrato cerrado o magnitud fiscal externa")
  const h = dec.success, v = h.compra
  const nacimiento = fecha(h.nacimiento, "historiaCLM.nacimiento")
  const edad2024 = 2024 - Number(nacimiento.slice(0, 4))
  exigir(edad2024 >= 18 && edad2024 < 65 && Number.isInteger(edadActual) && edadActual === edad2024 + 1,
    "nacimiento y edades de ambos devengos no conciliados o fuera del perfil18-64 de origen")
  const dh = Schema.decodeUnknownResult(HistoriaBasesD51)(historia, { onExcessProperty: "error" })
  exigir(Result.isSuccess(dh), "falta historia económica cerrada")
  const hs = dh.success
  exigir(c.codigo === "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales" &&
    h.titular === c.titular && h.vivienda === c.objeto, "identidad/ruta no conciliada")
  exigir(hs.objetos.length === 1 && hs.aplicaciones.length === 1, "una vivienda y una aplicación2024")
  const a = hs.aplicaciones[0]!
  exigir(a.ejercicio === 2024 && a.estado === "aplicacion-no-reconstruida" &&
    a.documento.referencia === h.documento.referencia && a.documento.emisor === h.documento.emisor &&
    a.documento.fecha === h.documento.fecha, "origen/documento de aplicación no conciliado")
  // Reutiliza todas las conciliaciones de censo, soportes, fechas, pagos y coste.
  // La copia no acredita no-solicitud: sólo valida estructura; su cero se descarta.
  const validada = producirHistoriaBasesD51PrecioAplazado({ ...hs, aplicaciones: [{ ...a, estado: "no-solicitada" }] }, c)
  exigir(v.fecha >= "2024-01-01" && v.fecha <= "2024-12-31" && v.fecha === c.fechaOperacion &&
    v.plenoDominioDesde === v.fecha && hs.objetos[0]!.primeraOperacion === v.fecha,
    "compra jurídica y primera inversión2024 requeridas")
  exigir(v.ocupacionDesde === v.fecha && /^\d{5}$/.test(v.municipio), "ocupación inmediata/municipio INE requerido")
  exigir(v.categoria === actual.categoria && v.poblacion2025 === actual.poblacionFiscal &&
    new D(v.coste).eq(actual.coste) && new D(actual.porcentajePropiedad).eq(100) &&
    new D(actual.ayudaJccm).eq(0) && actual.concurrencia12 === "no", "hechos2025 contradictorios")
  // Documentos adicionales pasan por el mismo validador civil, sin autenticar referencias.
  for (const doc of [h.documento, v.escritura, v.soporteMunicipal2024, v.soporteMunicipal2025,
    v.soporteOcupacion, ...h.certificados.map(x => x.documento)]) {
    exigir(fecha(doc.fecha, "documento.fecha") <= "2026-12-31", "documento fuera de perfil temporal")
  }
  exigir(v.escritura.fecha === v.fecha && v.soporteMunicipal2024.fecha >= "2024-01-01" &&
    v.soporteMunicipal2025.fecha >= "2025-01-01" && v.soporteOcupacion.fecha >= "2025-12-31",
    "soportes anteriores a hechos/cierre")
  exigir(hs.operaciones.every(p => p.clase === "adquisicion" && p.fecha >= v.fecha), "sólo adquisición directa2024/25")
  const pagos = (y: string) => hs.operaciones.filter(p => p.fecha.startsWith(y)).reduce((s,p) => s.plus(p.importe), new D(0))
  const pagado2024 = pagos("2024")
  const t = h.trabajo
  exigir(t.ejercicio === 2024 && t.territorio === "comun" && t.reduccionesArt18 === "ninguna" &&
    t.movilidad === "ninguna" && t.discapacidadActiva === "ninguna" && t.rendimientos.length > 0 &&
    t.rendimientos.every(r => r.clase === "empleo-laboral" || r.clase === "empleo-estatutario"), "sólo salario ordinario2024")
  exigir(new Set(t.rendimientos.map(r => r.id)).size === t.rendimientos.length &&
    new Set(h.certificados.map(x => x.rendimiento)).size === h.certificados.length &&
    new Set(h.certificados.map(x => JSON.stringify([x.documento.emisor, x.documento.referencia]))).size === h.certificados.length &&
    h.certificados.length === t.rendimientos.length, "certificados incompletos/duplicados")
  for (const r of t.rendimientos) {
    const cert = h.certificados.find(x => x.rendimiento === r.id)
    exigir(cert !== undefined && cert.titular === c.titular && cert.documento.fecha >= "2024-12-31" &&
      new D(cert.integro).eq(r.integro) && r.cotizaciones.clase === "efectivas" &&
      new D(cert.seguridadSocial).eq(r.cotizaciones.seguridadSocial) &&
      new D(cert.derechosPasivos).eq(r.cotizaciones.derechosPasivos) &&
      new D(cert.colegiosHuerfanos).eq(r.cotizaciones.colegiosHuerfanos), "certificado nominal contradictorio")
  }
  const patrimonio = producirPatrimonioHistoricoCLM(h.patrimonioHistorico, hs, {
    titular: c.titular, vivienda: c.objeto, fecha: v.fecha, coste: v.coste,
    escritura: v.escritura, certificados2024: h.certificados, trabajoActual2025,
  })
  for (const corte of [patrimonio.cortes2024, patrimonio.cortes2025])
    exigir(compara(corte.incremento, corte.inversion) >= 0, "incremento patrimonial factual insuficiente")
  const aporte = adaptarTrabajoAnual(t)
  exigir(aporte.estado !== "no-soportado", "gastos trabajo fuera del perfil")
  const neto = new D(aporte.rendimientoAntesArt20)
  exigir(neto.gte(0), "pérdida histórica fuera del perfil")
  const reduccion = D.min(neto, calcularReduccionTrabajoConOtrasRentas({ anio: 2024,
    rendimientoPrevioNeto: new D(aporte.argumentoArt20), otrasRentasNoExentas: new D(0) }))
  const baseGeneral = neto.minus(reduccion)
  const tramos = obtenerEscalaAutonomicaIrpf2024("castilla-la-mancha").tramos
  const minimo = obtenerMinimosAutonomicosIrpf2024("castilla-la-mancha").contribuyente.general
  const escala = (base: Decimal) => calcularCuotaPorEscala({ base, tramos, aritmetica: D })
  const cuota = redondearImporteLiquidado(D.max(0, escala(baseGeneral).minus(escala(D.min(baseGeneral, minimo)))))
  const baseAplicada = D.min(12000, 180000, v.coste, pagado2024)
  const generada = baseAplicada.times("0.15")
  exigir(generada.gt(0), "origen sin aplicación positiva")
  exigir(cuota.gte(generada), "subrama cuota insuficiente: no inferir base aplicada ni arrastre de cuota parcial")
  return { ...validada, patrimonioFactual: { cortes2024: patrimonio.cortes2024.traza, cortes2025: patrimonio.cortes2025.traza }, magnitud: { ...validada.magnitud, valor: baseAplicada.toFixed() },
    origenAplicacion: 2024, baseAplicada2024: baseAplicada.toFixed(), cuotaGenerada2024: generada.toFixed(),
    cuotaEfectiva2024: redondearImporteLiquidado(generada).toFixed(2), arrastre2025: "0",
    fundamentos: ["Art12ter: primera aplicación2024 reconstruida; base consumida=" + baseAplicada.toFixed() +
      "; cuota efectiva2024=" + redondearImporteLiquidado(generada).toFixed(2) + "; sin arrastre habilitado.",
      "Cuota2024 derivada de salarios art19/art20, escala y mínimo2024, individual18-64; sin otras rentas, reducciones, mínimos familiares o deducciones.",
      "Patrimonio2024/2025 derivado de cuentas conciliadas, coste, valoración excluida y deuda vendedor; continuidad de saldos y pagos nominales. No hay deducción de ISD sin cronología.",
      "Habitualidad acreditada hasta2025; permanencia de tres años pendiente. Referencias declaradas requieren comprobación documental; aceptación fiscal pendiente."] }
}
