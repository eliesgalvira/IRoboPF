import { rastroMadrid } from "./rastro"
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { MINIMOS_ESTATALES_2025 } from "../../normativa/datos/minimos-autonomicos-2025"
import { ipcMadrid, type MetodoIpcMadrid } from "./ipc"
import { estimarOficina, PERFIL_OFICINA } from "./coste"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../../laboral/cotizaciones-perfil-uniforme"
import { aplicarGastoGeneralTrabajo } from "../trabajo-anual/calcular"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"
import { componerLiquidacionAnual } from "../liquidacion/composicion-anual"
import { liquidarIrpfAnualExplicito } from "../trabajo-anual/conexion"
import type { CasoFiscalAnualExplicito } from "../trabajo-anual/conexion-contrato"
import { parametrosMadrid2018, reduccionIndexada2018, type ParametrosMadrid2018 } from "./parametros"

const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
type SS = { readonly naturaleza: "efectivas"; readonly importe: string; readonly ejercicio: number; readonly procedencia: string; readonly operacion: string }
  | { readonly naturaleza: "estimadas-perfil-uniforme" }
  | { readonly naturaleza: "estimadas-oficina-historica"; readonly perfil: typeof PERFIL_OFICINA }
interface HechosAnalisisMadrid {
  readonly ejercicio: number
  readonly metodoIpc?: MetodoIpcMadrid
  readonly edad: number
  readonly alcance: "madrid-individual-empleo-anual-sin-otras-rentas-familia-discapacidad-especialidades"
  readonly ssTrabajador: SS
  readonly ssEmpresa: SS | { readonly naturaleza: "no-disponible" }
  readonly retenciones: string
}
/** Modos exclusivos: trayectoria real constante o importe nominal observado, sin ajuste inverso del IPC. */
export type EntradaAnalisisMadrid = HechosAnalisisMadrid & (
  | { readonly brutoBaseEUR2018: string; readonly brutoNominalObservadoEUR?: never }
  | { readonly brutoNominalObservadoEUR: string; readonly brutoBaseEUR2018?: never }
)
const euros = (s: string) => {
  if (!Schema.is(Schema.String)(s) || !/^(0|[1-9][0-9]{0,11})(\.[0-9]{1,2})?$/.test(s)) throw new RangeError("EUR requiere texto no negativo a céntimos")
  return new D(s)
}
const centimos = (v: Decimal) => v.mul(100).toDecimalPlaces(0, D.ROUND_HALF_UP).toFixed(0)
const solo = (obj: EntradaAnalisisMadrid | SS | { readonly naturaleza: "no-disponible" }, keys: readonly string[]) => {
  if (Object.keys(obj).some(k => !keys.includes(k))) throw new RangeError("Campo ajeno u override no permitido")
}
function validarSS(s: SS | { readonly naturaleza: "no-disponible" }, ejercicio: number, empresa: boolean) {
  if (s.naturaleza === "efectivas") {
    solo(s, ["naturaleza", "importe", "ejercicio", "procedencia", "operacion"])
    euros(s.importe)
    if (s.ejercicio !== ejercicio || s.procedencia.length === 0 || s.operacion.length === 0) throw new RangeError("Cotización efectiva sin ejercicio/procedencia/operación")
  } else {
    solo(s, s.naturaleza === "estimadas-oficina-historica" ? ["naturaleza", "perfil"] : ["naturaleza"])
    if (s.naturaleza === "estimadas-oficina-historica" && s.perfil === PERFIL_OFICINA) return
    if (s.naturaleza !== "estimadas-perfil-uniforme" && !(empresa && s.naturaleza === "no-disponible")) throw new RangeError("Naturaleza SS no admitida")
  }
}

/** Entrada analítica; nunca produce una declaración ni acepta políticas numéricas del cliente. */
export function analizarMadrid(entrada: EntradaAnalisisMadrid) {
  try {
    // SAFETY: la copia se valida por alcance, claves y operandos antes de consumirla.
    entrada = JSON.parse(JSON.stringify(entrada)) as EntradaAnalisisMadrid
    Object.freeze(entrada.ssTrabajador); Object.freeze(entrada.ssEmpresa); Object.freeze(entrada)
    solo(entrada, ["metodoIpc", "ejercicio", "edad", "brutoBaseEUR2018", "brutoNominalObservadoEUR", "alcance", "ssTrabajador", "ssEmpresa", "retenciones"])
    if (!Number.isInteger(entrada.ejercicio) || entrada.ejercicio < 2018 || entrada.ejercicio > 2025 ||
        !Number.isInteger(entrada.edad) || entrada.edad < 18 || entrada.edad > 64 ||
        entrada.alcance !== "madrid-individual-empleo-anual-sin-otras-rentas-familia-discapacidad-especialidades")
      throw new RangeError("Fuera del alcance explícito Madrid 2018–2025, edad anual 18–64")
    // SAFETY: ejercicio entero comprobado en 2018–2025.
    const anio = entrada.ejercicio as AnioFiscal
    const basePresente = Object.hasOwn(entrada, "brutoBaseEUR2018")
    const nominalPresente = Object.hasOwn(entrada, "brutoNominalObservadoEUR")
    if (basePresente === nominalPresente) throw new RangeError("Se exige exactamente un modo de bruto: base real constante o nominal observado")
    const retenciones = euros(entrada.retenciones)
    validarSS(entrada.ssTrabajador, anio, false); validarSS(entrada.ssEmpresa, anio, true)
    const ipc = ipcMadrid(anio, entrada.metodoIpc)
    const f = new D(ipc.factor)
    const brutoPrevio = nominalPresente ? euros(entrada.brutoNominalObservadoEUR!) : euros(entrada.brutoBaseEUR2018!).mul(f)
    const bruto = nominalPresente ? brutoPrevio.toDecimalPlaces(2) : ipc.indexarBruto(euros(entrada.brutoBaseEUR2018!))
    const historica = entrada.ssTrabajador.naturaleza === "estimadas-oficina-historica" || entrada.ssEmpresa.naturaleza === "estimadas-oficina-historica"
    const usaLegacy = entrada.ssTrabajador.naturaleza === "estimadas-perfil-uniforme" || entrada.ssEmpresa.naturaleza === "estimadas-perfil-uniforme"
    if (historica && usaLegacy) throw new RangeError("No mezclar perfiles SS históricos y legacy")
    const estimacion = historica ? estimarOficina(anio, bruto, PERFIL_OFICINA)
      : usaLegacy ? { ...calcularDesgloseCotizacionesPerfilUniforme({ anio, salarioBrutoAnual: bruto }), metodo: "LEGACY-uniforme-AT1.5-no-historico-oficina-v1" } : null
    const ss = entrada.ssTrabajador.naturaleza === "efectivas" ? euros(entrada.ssTrabajador.importe) : new D(estimacion!.cotizacionTrabajador)
    const empresa = entrada.ssEmpresa.naturaleza === "no-disponible" ? null : entrada.ssEmpresa.naturaleza === "efectivas" ? euros(entrada.ssEmpresa.importe) : new D(estimacion!.cotizacionEmpresarial)
    const coste = empresa === null ? null : bruto.plus(empresa)
    function evaluar(normativa: AnioFiscal, p?: ParametrosMadrid2018) {
      const previo = bruto.minus(ss)
      const gasto = aplicarGastoGeneralTrabajo(previo, new D(p?.gastoGeneral ?? "2000"))
      const art19 = previo.minus(gasto)
      const reduccion = D.min(D.max(0, art19), p === undefined
        ? calcularReduccionTrabajoConOtrasRentas({ anio: normativa, rendimientoPrevioNeto: previo, otrasRentasNoExentas: new D(0) })
        : reduccionIndexada2018(previo, p))
      const base = D.max(0, art19.minus(reduccion))
      const c = Effect.runSync(componerLiquidacionAnual({
        ambito: { anio: normativa, comunidadAutonoma: "madrid", situacionFamiliar: {
          tipo: "individual", edad: entrada.edad, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [],
        } },
        cotizaciones: { naturaleza: entrada.ssTrabajador.naturaleza === "efectivas" ? "efectivas" : "estimadas-perfil-uniforme", trabajador: ss },
        precision: 80, politica: "decimal-hasta-salida", baseGeneral: base, baseAhorro: new D(0),
        rentasAntesReducciones: art19, minimosEstatales: MINIMOS_ESTATALES_2025, deduccionesAutonomicasCentimos: 0,
        parametrosAnaliticosMadrid: p,
        serviciosLaborales: normativa === 2025 ? { bruto } : undefined,
      }))
      const q = new D(c.cuotaPosterior), neto = bruto.minus(ss).minus(q)
      return { politica: "decimal-hasta-salida", anioNormativo: normativa, bruto: bruto.toFixed(), ssTrabajador: ss.toFixed(),
        gastoGeneral: gasto.toFixed(), argumentoArt20: previo.toFixed(), reduccionArt20: reduccion.toFixed(), base: base.toFixed(),
        cuotaPreviaDA61: c.cuotaLiquida.toFixed(), deduccionTrabajo: c.deduccionTrabajo.toFixed(), Q: q.toFixed(), neto: neto.toFixed(),
        netoEUR2018: neto.div(f).toFixed(), centimos: { Q: centimos(q), neto: centimos(neto) },
        diferencial: q.minus(retenciones).toFixed(),
        desgloseEstatal: c.desgloseCuotaIntegraGeneralEstatal, desgloseAutonomico: c.desgloseCuotaIntegraGeneralAutonomica,
        minimoEstatal: c.minimoPersonalYFamiliar.toFixed(), minimoAutonomico: c.minimoPersonalYFamiliarAutonomico.toFixed(),
      }
    }
    const paqueteX = parametrosMadrid2018(new D(1)), paqueteI = parametrosMadrid2018(f)
    const X = evaluar(2018, paqueteX), I = evaluar(2018, paqueteI), Hdecimal = evaluar(anio)
    const Hcontractual = contractual(entrada, bruto, ss)
    const eindexNominal = new D(I.neto).minus(X.neto), eleyNominal = new D(Hdecimal.neto).minus(I.neto)
    const representacion = Hcontractual.estado === "disponible" ? new D(Hcontractual.neto).minus(Hdecimal.neto) : null
    const objetivo = Hcontractual.estado === "disponible" ? new D(Hcontractual.neto) : new D(Hdecimal.neto)
    const residuoNominal = objetivo.minus(X.neto).minus(eindexNominal).minus(eleyNominal).minus(representacion ?? 0)
    return { estado: "calculado" as const, tipo: "contrafactual-analitico", aceptacionFiscal: "no-aplicable-analitico", entrada,
      unidadNominal: "EUR", unidadReal: "EUR-diciembre-2018", politicaPresentacion: "half-up-centimos", precision: 80,
      modoBruto: nominalPresente ? "nominal-observado" : "base-real-constante",
      factor: f.toFixed(), ipc: ipc.procedencia, brutoPrevio: brutoPrevio.toFixed(), residuoBruto: bruto.minus(brutoPrevio).toFixed(),
      cotizaciones: { trabajador: { ...entrada.ssTrabajador, importeResuelto: ss.toFixed() }, empresa: entrada.ssEmpresa,
        empresaEUR: empresa?.toFixed() ?? null, estimacion }, coste: coste?.toFixed() ?? null,
      // Alias conservado por compatibilidad; su rama queda declarada explícitamente.
      cuna: coste === null || coste.isZero() ? null : coste.minus(Hdecimal.neto).div(coste).toFixed(),
      cunaHdecimal: coste === null || coste.isZero() ? null : coste.minus(Hdecimal.neto).div(coste).toFixed(),
      cunas: { formula: "(coste-netoRama)/coste", denominador: "bruto+SS-empresa", unidad: "fraccion",
        X: coste === null || coste.isZero() ? null : coste.minus(X.neto).div(coste).toFixed(),
        I: coste === null || coste.isZero() ? null : coste.minus(I.neto).div(coste).toFixed(),
        Hdecimal: coste === null || coste.isZero() ? null : coste.minus(Hdecimal.neto).div(coste).toFixed(),
        Hcontractual: coste === null || coste.isZero() || Hcontractual.estado !== "disponible" ? null : coste.minus(Hcontractual.neto).div(coste).toFixed() },
      X, I, Hdecimal, Hcontractual,
      efectos: { Eindex: eindexNominal.div(f).toFixed(), Eley: eleyNominal.div(f).toFixed(),
        Erepresentacion: representacion?.div(f).toFixed() ?? null,
        identidad: { numeradorEUR: residuoNominal.toFixed(), denominador: f.toFixed(), exactaAntesDivision: residuoNominal.isZero() },
        signo: "positivo-mejora-ciudadana", redondeoPresentacion: "separado; no sumar años como pérdida personal" },
      parametros: { X: paqueteX, I: paqueteI },
      evidencia: { catalogo: "docs/analisis-madrid/catalogo.json", oraculo: "sin-identidad-exacta-acreditada-para-esta-entrada",
        fuenteNormativa: "por-parametro-en-catalogo-con-reservas", verificacionAlgoritmoSnapshot: "pendiente", snapshotPromovido: false },
      rastro: rastroMadrid({ X, I, Hdecimal, factor: f.toFixed(), ejercicio: anio, ss: entrada.ssTrabajador.naturaleza, paqueteX, paqueteI, ipc: ipc.procedencia }),
      convenciones: [
        { operacion: "neto", unidad: "EUR", operandos: ["bruto", "ssTrabajador", "Q-posterior-DA61"], formula: "bruto-SS-Q" },
        { operacion: "deflacion", unidad: "EUR-diciembre-2018", operandos: ["neto", "factor-IPC-INE"], formula: "neto/factor" },
        { operacion: "indexacion-parametros", operandos: ["parametros2018", "factor-IPC-INE"], estado: "hipotesis-analitica" },
      ],
    }
  } catch (error) {
    return { estado: "no-disponible" as const, motivo: error instanceof Error ? error.message : String(error) }
  }
}

function contractual(e: EntradaAnalisisMadrid, bruto: Decimal, ss: Decimal) {
  if (e.ssTrabajador.naturaleza !== "efectivas") return { estado: "no-disponible" as const, motivo: "La API legal exige SS efectivas; la estimación no se convierte a hecho efectivo" }
  const cero = { importe: "0", satisfecho: "no" as const }
  const entrada = {
    ejercicio: e.ejercicio, comunidadAutonoma: "madrid", edad: e.edad, modalidad: "individual", residenciaTodoElAnio: true,
    devengo: `${e.ejercicio}-12-31`, otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna",
    reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: e.ejercicio === 2025 ? "solo-da61-si-procede" : "ninguna",
    rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo",
    conciliacion: { ejercicio: e.ejercicio, estado: "totales-anuales-sin-duplicados", procedencia: [e.ssTrabajador.procedencia] },
    trabajo: { ejercicio: e.ejercicio, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna",
      rendimientos: [{ id: e.ssTrabajador.operacion, clase: "empleo-laboral", integro: bruto.toFixed(2),
        cotizaciones: { clase: "efectivas", seguridadSocial: ss.toFixed(2), derechosPasivos: "0", colegiosHuerfanos: "0" },
        sindicato: cero, colegio: { ...cero, obligatorio: "no", finesEsenciales: "no" }, defensa: { ...cero, litigioDirectoPagador: "no" } }] },
    retenciones: [{ operacionId: "retencion-anual", procedencia: "aportada-analisis", efectiva: true, ejercicio: e.ejercicio, importe: e.retenciones }],
  }
  // SAFETY: frontera legal valida exhaustivamente Schema y rechaza cualquier hecho fuera de contrato.
  const r = Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(entrada as CasoFiscalAnualExplicito)))
  if (Result.isFailure(r)) return { estado: "no-disponible" as const, motivo: r.failure.motivo }
  const q = new D(r.success.cuotaPosterior)
  return { estado: "disponible" as const, resultadoLegal: r.success, Q: q.toFixed(), neto: bruto.minus(ss).minus(q).toFixed(),
    fuentes: { parametrosAnuales: "docs/analisis-madrid/catalogo.json#/porEjercicio/" + e.ejercicio,
      adendaLegal: "docs/analisis-madrid/adenda-legal.json#/porEjercicio/" + e.ejercicio,
      DA61: e.ejercicio === 2025 ? "docs/analisis-madrid/adenda-legal.json#/fuentes/DA61-2025" : null,
      distincion: "rastro contractual propio; parámetros y política decimal analítica separados; sin promoción de snapshot" },
    oraculo: "politica-admitida-no-acredita-identidad-exacta" }
}
