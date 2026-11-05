import { validarCensosViviendaRioja } from "../vivienda-dt18-2025/productor"
import { HechosDT182025 } from "../vivienda-dt18-2025/contrato"
import type { LibroDT182025 } from "../vivienda-dt18-2025/productor"
import type { aplicarCuotasDT18 } from "../vivienda-dt18-2025/cuota"
import type { GeneracionEstatal681 } from "./inversion-681-2025"
import type { LibroVehiculoDA58 } from "../vehiculo-da58-2025/productor"
import type { LibroMaternidad81 } from "../maternidad-2025/producir"
import { evaluarCuidadoCyl81, operaciones81 } from "../maternidad-2025/cyl"
import type { ResultadoInmuebleP4a } from "../inmobiliario-2025/productor"
import { evaluarE38Anual, racionalE38, saldosE38Anuales } from "./galicia-rioja-ampliacion-2025/anual"
import type { Resultado as ResultadoE38 } from "./galicia-rioja-ampliacion-2025/comun"
import { validarConcurrenciaE38 } from "./galicia-rioja-ampliacion-2025/anual-incompatibilidades"
import { crearSesionD51, validarSeleccionesD51 } from "./d51-anual"
import { evaluarAnualF2025 } from "./territorial-f-ampliacion-2025/anual"
import { consumirCuotaAnualF2025 } from "./territorial-f-ampliacion-2025/anual-cuota"
import type { ResultadoF } from "./territorial-f-ampliacion-2025/comun"
import { evaluarAnualC36, registrarMonetariosC36, prioridadC36, validarEleccionesC36 } from "./canarias-balears-hechos-2025/anual-adaptador"
import { limitarCandidatosC36 } from "./canarias-balears-hechos-2025/anual-limites"
import type { ResultadoAmpliacionC, LimiteComposicionC } from "./canarias-balears-hechos-2025/ampliacion-comun"
import { evaluarAragonDosAnual2025 } from "./aragon-dos-anual"
import type { ResultadoInversionAragonesa2025 } from "./aragon-dos-codigos-2025"
import { prepararBAmpliadoAnual } from "./b-ampliado-anual-2025"
import { conciliarPagosEntreLotesB } from "./b-ampliado-anual-2025/conciliacion-lotes"
import type { LibroIngresosIdentificados2025 } from "../ingresos-identificados-2025/productor"
import type { NodosFiscalesB2025 } from "./b-ampliado-anual-2025/productores"
import type { ResultadoAmpliacion as ResultadoAmpliacionB } from "./asturias-cantabria-ampliacion-2025"
import { evaluarAmpliacionAnualA2025 } from "./ampliacion-a-anual"
import type { ResultadoAmpliacion } from "./lote-a-ampliacion-2025"
import Decimal from "decimal.js"
import { Schema, Result } from "effect"
import type { CasoFiscalAnual } from "../caso-fiscal-anual"
import { SolicitudDeduccionesTerritoriales2025 } from "./anual-territorial-esquemas"
import { evaluarCatalunyaHechos2025 } from "./catalunya-hechos-2025"
import { evaluarHechosB2025 } from "./asturias-cantabria-hechos-2025"
import * as C from "./canarias-balears-hechos-2025"
import * as CLM from "./castilla-la-mancha-hechos-2025"
import * as CYL from "./castilla-y-leon-hechos-2025"
import * as EXT from "./extremadura-hechos-2025"
import { evaluarHechosE2025 } from "./galicia-rioja-hechos-2025"
import { evaluarTerritorialF2025 } from "./territorial-f-2025"
import {
  racional,
  consumirCuota,
  type Racional,
} from "./anual-territorial-racional"
export { SolicitudDeduccionesTerritoriales2025 }
import type { LibroDonativosEstatales2025 } from "./donativos-estatales-2025/productor"
export interface MagnitudesTerritorialesAnuales {
  readonly libroDT18?: LibroDT182025 | undefined
  readonly cuotasDT18?: ReturnType<typeof aplicarCuotasDT18> | undefined
  readonly libroBasesFamiliares2025?: import("../bases-familiares-2025/productor").LibroBasesFamiliares2025 | undefined
  readonly pagadoresCatalunya2025?: import("./catalunya-pagadores-2025/productor").LibroPagadoresCatalunya2025 | undefined
  readonly cuotaEstatal681?: Decimal | undefined
  readonly vehiculoDA58?: LibroVehiculoDA58 | undefined
  readonly inmueblesP4a?: readonly ResultadoInmuebleP4a[] | undefined
  readonly libroIngresosIdentificados2025?: LibroIngresosIdentificados2025 | undefined
  readonly donativosEstatales?: LibroDonativosEstatales2025 | undefined
  readonly cuotaAutonomicaResidual?: Decimal | undefined
  readonly libroMaternidad81?: LibroMaternidad81 | undefined
  readonly rentaNoExentaAntesReduccionesB?: Decimal | undefined
  readonly rentaActividadAnualB?: Decimal | undefined
  readonly nodosFiscalesB2025?: NodosFiscalesB2025 | undefined
  readonly caso: Pick<
    CasoFiscalAnual,
    | "anio"
    | "comunidadAutonoma"
    | "contribuyenteId"
    | "situacionFamiliar"
    | "derechosMinimos"
    | "fechaFallecimiento"
  >
  readonly basesLiquidables?:
    | { readonly general: Decimal; readonly ahorro: Decimal }
    | undefined
  readonly componentesMinimoEstatal?:
    | { readonly contribuyente: Decimal; readonly descendientes: Decimal }
    | undefined
  /** Base imponible con signo producida antes del límite de base liquidable. */
  readonly basesImponiblesE38?: { readonly general: Decimal; readonly ahorro: Decimal } | undefined
  readonly baseGeneral: Decimal
  readonly baseAhorro: Decimal
  readonly minimoPersonalFamiliar: Decimal
  readonly cuotaAutonomica: Decimal
  readonly sujetosConMinimo: readonly string[]
  readonly atribucionesMinimo?:
    | readonly {
        readonly sujetoId: string
        readonly titulares: readonly string[]
      }[]
    | undefined
  readonly rentasTrabajoAnuales?:
    | {
        readonly integroTrabajo: Decimal
        readonly restoRentas: Decimal
      }
    | undefined
}
type ResultadoSaldosE38 = { saldosE38?: ReturnType<typeof saldosE38Anuales> }
const D = Decimal.clone({ precision: 200 })
const esTexto = Schema.is(Schema.String)
const esNumero = Schema.is(Schema.Number)
const esLista = Schema.is(Schema.Array(Schema.Json))
const esObjeto = Schema.is(Schema.Record(Schema.String, Schema.Json))
function exigir(b: boolean, m: string): asserts b {
  if (!b) throw new RangeError(m)
}
function normalizarExacto(
  r:
    | ResultadoAmpliacion
    | ResultadoE38
    | ResultadoAmpliacionB
    | ResultadoInversionAragonesa2025
    | ReturnType<typeof evaluarCatalunyaHechos2025>
    | ReturnType<typeof evaluarHechosB2025>
    | C.Resultado
    | ResultadoAmpliacionC
    | CLM.ResultadoHechos
    | EXT.ResultadoHechos
    | ReturnType<typeof evaluarHechosE2025>
    | ReturnType<typeof evaluarTerritorialF2025>
): Racional {
  if (r.estado === "excluida") return racional("0")
  exigir(
    r.estado === "calculo_parcial",
    "Deducción no soportada: " +
      ("motivo" in r ? r.motivo : "motivos" in r ? r.motivos.join("; ") : "")
  )
  if ("importeExactoEuros" in r && r.importeExactoEuros !== undefined)
    return racional(r.importeExactoEuros)
  if ("importeExacto" in r)
    return esTexto(r.importeExacto)
      ? racional(r.importeExacto)
      : "numerador" in r.importeExacto
        ? racional(r.importeExacto.numerador,r.importeExacto.denominador)
        : racional(r.importeExacto.numeradorEuros, r.importeExacto.divisor)
  if ("exacto" in r) {
    if ("numeradorCentimos" in r.exacto) return racionalE38(r.exacto)
    return racional(r.exacto.numeradorEuros, String(r.exacto.divisor))
  }
  throw new RangeError(
    "Evaluador sin salida exacta: no se consume presentación"
  )
}
/** Conciliación de datos personales identificados; nunca convierte una referencia en derecho. */
function conciliar(
  datos: Schema.Json,
  m: MagnitudesTerritorialesAnuales
): void {
  if (esLista(datos)) {
    datos.forEach((x) => conciliar(x, m))
    return
  }
  if (!esObjeto(datos)) return
  const x = datos
  const id = esTexto(x.persona)
    ? x.persona
    : esTexto(x.hijo)
      ? x.hijo
      : esTexto(x.id)
        ? x.id
        : undefined
  exigir(
    x.relacion !== "conyuge",
    "Cónyuge: persona y rentas no representadas en el caso anual individual"
  )
  const nacimiento = esTexto(x.nacimiento)
    ? x.nacimiento
    : esTexto(x.hijoNacimiento)
      ? x.hijoNacimiento
      : undefined
  const grado = esNumero(x.grado)
    ? x.grado
    : esNumero(x.discapacidad)
      ? x.discapacidad
      : undefined
  if (id !== undefined && (nacimiento !== undefined || grado !== undefined)) {
    const propia = id === m.caso.contribuyenteId
    const familiar = m.caso.derechosMinimos?.descendientes.find(
      (d) => d.sujetoId === id
    )
    exigir(
      propia || familiar !== undefined,
      "Persona sin identidad anual conciliada: " + id
    )
    if (nacimiento !== undefined) {
      exigir(
        2025 - Number(nacimiento.slice(0, 4)) ===
          (propia ? m.caso.situacionFamiliar.edad : familiar?.edadDevengo),
        "Edad contradictoria: " + id
      )
      if (familiar !== undefined)
        exigir(
          nacimiento === familiar.fechaNacimiento,
          "Nacimiento familiar contradictorio: " + id
        )
    }
    if (grado !== undefined) {
      const tag = (
        propia ? m.caso.situacionFamiliar.discapacidad : familiar?.discapacidad
      )?._tag
      exigir(
        tag ===
          (grado >= 65
            ? "Discapacidad65OMas"
            : grado >= 33
              ? "Discapacidad33a64"
              : "SinDiscapacidad"),
        "Discapacidad contradictoria: " + id
      )
    }
  }
  if (esObjeto(x.minimo) && id !== undefined && id !== m.caso.contribuyenteId)
    exigir(
      m.sujetosConMinimo.includes(id),
      "Referencia sin mínimo anual conciliado: " + id
    )
  for (const [k, v] of Object.entries(x)) {
    if (k === "titularesMinimo" && esLista(v))
      for (const id of v)
        exigir(
          id === m.caso.contribuyenteId ||
            m.caso.derechosMinimos?.descendientes.some((d) =>
              d.titulares.some((t) => t.titularId === id)
            ) === true,
          "Titular de mínimo no conciliado: " + id
        )
    if (k === "titularesMinimo" && esLista(v) && v.length > 0) {
      const sujeto = esTexto(x.hijo)
        ? x.hijo
        : esObjeto(x.beneficiario) && esTexto(x.beneficiario.id)
          ? x.beneficiario.id
          : id
      const sujetos = esLista(x.hijos)
        ? x.hijos.map((hijo) => {
            exigir(esTexto(hijo), "Hijo sin identidad en el reparto del mínimo")
            return hijo
          })
        : sujeto === undefined
          ? []
          : [sujeto]
      exigir(
        sujetos.length > 0,
        "Lista de titulares sin sujeto de mínimo identificado"
      )
      for (const sujetoMinimo of sujetos) {
        if (sujetoMinimo === m.caso.contribuyenteId) continue
        exigir(
          m.sujetosConMinimo.includes(sujetoMinimo),
          "Sujeto sin mínimo anual conciliado: " + sujetoMinimo
        )
        const atribucion = m.atribucionesMinimo?.find(
          (a) => a.sujetoId === sujetoMinimo
        )
        exigir(
          atribucion !== undefined &&
            v.length === atribucion.titulares.length &&
            new Set(v).size === v.length &&
            v.every((t) => esTexto(t) && atribucion.titulares.includes(t)),
          "Titular ajeno al mínimo del sujeto o reparto incompleto: " +
            sujetoMinimo
        )
      }
    }
    if (k === "pacientesMinimo" && esLista(v))
      for (const paciente of v) {
        exigir(
          esObjeto(paciente) && esTexto(paciente.persona),
          "Paciente sin identidad anual"
        )
        exigir(
          paciente.persona === m.caso.contribuyenteId ||
            m.sujetosConMinimo.includes(paciente.persona),
          "Paciente sin mínimo anual conciliado: " + paciente.persona
        )
      }
    if (k === "personasMinimo" && esLista(v))
      for (const id of v)
        exigir(
          esTexto(id) &&
            (id === m.caso.contribuyenteId || m.sujetosConMinimo.includes(id)),
          "Derecho al mínimo no conciliado: " + id
        )
    conciliar(v, m)
  }
}
/** Contrasta sólo hechos familiares que el caso anual ya representa. */
function conciliarEventoFamiliar(
  m: MagnitudesTerritorialesAnuales,
  sujeto: string,
  clase: string,
  fecha: string,
  inscripcion?: string
): void {
  const familiar = m.caso.derechosMinimos?.descendientes.find(
    (d) => d.sujetoId === sujeto
  )
  if (familiar === undefined) return
  exigir(
    familiar.fechaNacimiento <= fecha,
    "Hecho familiar anterior al nacimiento: " + sujeto
  )
  if (clase === "nacimiento" || clase === "parto")
    exigir(
      familiar.fechaNacimiento === fecha,
      "Nacimiento anual contradictorio con el parto: " + sujeto
    )
  if (clase === "adopcion" || clase === "adopcion_internacional") {
    const vinculo = familiar.titulares.find(
      (t) => t.titularId === m.caso.contribuyenteId
    )?.vinculo
    exigir(
      vinculo?.clase === "adopcion",
      "Vínculo anual incompatible con la adopción: " + sujeto
    )
    if (vinculo.fechaConstitucionVinculo !== undefined)
      exigir(
        vinculo.fechaConstitucionVinculo === fecha,
        "Fecha de constitución adoptiva contradictoria: " + sujeto
      )
    if (inscripcion !== undefined)
      exigir(
        vinculo.fechaInicioIncremento <= inscripcion,
        "Inicio del vínculo posterior a la inscripción adoptiva: " + sujeto
      )
  }
}
export function aplicarDeduccionesTerritoriales2025(
  entrada: SolicitudDeduccionesTerritoriales2025,
  m: MagnitudesTerritorialesAnuales
) {
  const decoded = Schema.decodeUnknownResult(
    SolicitudDeduccionesTerritoriales2025
  )(entrada, { onExcessProperty: "error" })
  exigir(
    Result.isSuccess(decoded),
    "Hechos territoriales inválidos o magnitudes anuales externas"
  )
  if (decoded.success.donativosEstatales2025 !== undefined) {
    const admitidos = new Set(["cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad", "murcia_donativos_patrimonio_cultural_actividades", "murcia_donativos_investigacion_biosanitaria", "madrid_condicion_familia_numerosa", "madrid_donativos_fundaciones_clubes_deportivos"])
    for (const solicitud of decoded.success.solicitudes) {
      const codigo = "codigo" in solicitud ? solicitud.codigo : solicitud.hechos.codigo
      exigir(codigo !== "madrid_familias_dos_descendientes_ingresos_reducidos", "Art14 Madrid:secuencia completa con deducciones generales y bases ajenas pendiente")
      exigir(admitidos.has(codigo), "Interacción regional con donativos estatales no acotada:" + codigo)
    }
  }
  if (decoded.success.vehiculoDA582025 !== undefined) {
    exigir(m.vehiculoDA58 !== undefined, "DA58: faltan productor y cuota estatal internos; no omitir ni suponer cero")
    exigir(m.vehiculoDA58.contribuyente === decoded.success.vehiculoDA582025.contribuyente && m.vehiculoDA58.vehiculoId === decoded.success.vehiculoDA582025.vehiculo.id, "DA58: libro de otra identidad/vehículo")
  }
  const c = m.caso
  exigir(
    c.anio === 2025 &&
      c.situacionFamiliar.tipo === "individual" &&
      c.fechaFallecimiento === undefined &&
      c.contribuyenteId !== undefined &&
      c.contribuyenteId.trim().length > 0,
    "Ámbito territorial anual: 2025 individual sin fallecimiento e identidad obligatoria"
  )
  const contribuyente = c.contribuyenteId!
  exigir(
    c.derechosMinimos === undefined ||
      c.derechosMinimos.contribuyenteId === contribuyente,
    "Selección de contribuyente contradictoria"
  )
  const contexto = {
    ejercicio: 2025 as const,
    territorio: c.comunidadAutonoma,
    contribuyente,
    modalidad: "individual" as const,
    declarantes: [contribuyente],
  }
  const bases = {
    baseGeneral: m.baseGeneral.toFixed(),
    baseAhorro: m.baseAhorro.toFixed(),
  }
  const marco = {
    ...contexto,
    ...bases,
    minimoPersonalFamiliar: m.minimoPersonalFamiliar.toFixed(),
  }
  const generacionesEstatales681: GeneracionEstatal681[] = []
  const evaluacionesF: ResultadoF[] = []
  const evaluaciones: {
    resultado: Parameters<typeof normalizarExacto>[0]
    exacto: Racional
  }[] = []
  const normalizar = (r: Parameters<typeof normalizarExacto>[0]) => {
    const exacto = normalizarExacto(r)
    evaluaciones.push({ resultado: r, exacto })
    return exacto
  }
  const evaluacionesE38 = new Map<number,ResultadoE38>()
  const restriccionesC36: (readonly LimiteComposicionC[])[] = []
  const solicitudes = [...decoded.success.solicitudes].sort((a,b)=>prioridadC36(a)-prioridadC36(b))
  const planC36 = solicitudes.filter(s=>s.lote === "C36")
  validarEleccionesC36(planC36)
  const bienesCanarios = new Map<string,string>()
  const vistos = new Set<string>()
  const hechos = new Set<string>()
  const codigos = solicitudes.map((s) =>
    "codigo" in s ? s.codigo : s.hechos.codigo
  )
  validarConcurrenciaE38(decoded.success.solicitudes.map(s=>({lote:s.lote,codigo:"codigo"in s?s.codigo:s.hechos.codigo,hechos:Schema.decodeUnknownSync(Schema.Json)(s.hechos)})))
  // Elecciones que afectan a la misma persona: conservador hasta disponer de un censo por persona.
  exigir(
    !(
      codigos.includes("clm_discapacidad_contribuyente") &&
      codigos.includes("clm_mayores_75")
    ),
    "Elecciones incompatibles CLM para el contribuyente"
  )
  if (solicitudes.some(s => s.lote === "C36" && s.codigo === "canarias_inversion_vivienda_habitual")) {
    exigir(solicitudes.length === 1, "C36 art14 historia compleja: concurrencia requiere conciliar todos los pagos e inversiones con el censo patrimonial único")
    exigir(m.libroDT18 === undefined && m.cuotasDT18 === undefined && decoded.success.viviendaDT182025 === undefined && m.libroIngresosIdentificados2025 === undefined && m.libroMaternidad81 === undefined && m.donativosEstatales === undefined && decoded.success.donativosEstatales2025 === undefined && m.vehiculoDA58 === undefined && decoded.success.vehiculoDA582025 === undefined && m.inmueblesP4a === undefined, "C36 art14 historia compleja: productores concurrentes sin censo conjunto representado")
  }
  validarCensosViviendaRioja(decoded.success)
  if(decoded.success.viviendaDT182025!==undefined){
    exigir(m.libroDT18!==undefined&&m.cuotasDT18!==undefined&&m.cuotaAutonomicaResidual!==undefined,"DT18: falta libro y consumo producidos una vez por composición anual")
    exigir(Schema.toEquivalence(HechosDT182025)(m.libroDT18.hechos,decoded.success.viviendaDT182025),"DT18: libro ajeno a los hechos de esta declaración")
  }else exigir(m.libroDT18===undefined&&m.cuotasDT18===undefined,"DT18: libro sin hechos históricos")
  // Reserva de base P5a por declaración: no admite particiones ni concurrencias nuevas.
  const codigosP5a = ["rioja_vivienda_habitual_pequenos_municipios", "rioja_inversion_vivienda_jovenes_menores_36", "rioja_segunda_vivienda_medio_rural"]
  if (codigos.some(c => codigosP5a.includes(c))) {
    exigir(solicitudes.length === 1, "P5a combinación no representada: reserva única por declaración; pendiente partición, también con productor inmobiliario P4a")
    exigir(m.libroIngresosIdentificados2025 === undefined && m.libroMaternidad81 === undefined && m.donativosEstatales === undefined && decoded.success.donativosEstatales2025 === undefined, "P5a combinación con productores ELA/donativos/art81 no representada; pendiente conciliación conjunta")
  }
  const inversionExt = solicitudes.some(s=>s.lote==="D51" && s.codigo==="extremadura_inversion_acciones_participaciones_mercantiles" && "perfil" in s.hechos)
  if(inversionExt){
    exigir(solicitudes.length===1,"EXT inversión: perfil exclusivo, combinación de deducciones no representada")
    exigir(m.vehiculoDA58===undefined && m.libroMaternidad81===undefined && m.libroIngresosIdentificados2025===undefined && m.inmueblesP4a===undefined && m.donativosEstatales===undefined && decoded.success.donativosEstatales2025===undefined && decoded.success.vehiculoDA582025===undefined,"EXT inversión: combinación con otros productores no representada")
  }
  validarSeleccionesD51(codigos)
  const sesionD51 = crearSesionD51(m)
  const subloteB = decoded.success.solicitudes.filter(s => s.lote === "B-ampliado")
  if (subloteB.length > 0) conciliarPagosEntreLotesB(decoded.success.solicitudes)
  // Preparación única conserva elecciones y pagos cruzados; el consumo sigue abajo en el libro común.
  const preparadoB = subloteB.length === 0 ? undefined : prepararBAmpliadoAnual(subloteB, m, decoded.success.solicitudes)
  exigir(preparadoB === undefined || preparadoB.estado === "generaciones_preparadas", preparadoB?.estado === "no_soportado" ? preparadoB.motivo : "Preparación B37 ausente")
  const importes = solicitudes.map((s,indice) => {
    const codigo = "codigo" in s ? s.codigo : s.hechos.codigo
    exigir(!vistos.has(codigo), "Código duplicado: " + codigo)
    vistos.add(codigo)
    const territorio = codigo.startsWith("cataluna_")
      ? "catalunya"
      : codigo.startsWith("balears_")
        ? "illes-balears"
        : codigo.startsWith("clm_")
          ? "castilla-la-mancha"
          : codigo.startsWith("cyl_")
            ? "castilla-y-leon"
            : codigo.startsWith("rioja_")
              ? "la-rioja"
              : codigo.split("_")[0]
    exigir(
      territorio === c.comunidadAutonoma,
      "Deducción de otro territorio: " + codigo
    )
    const hechosConciliables = Schema.decodeUnknownSync(Schema.Json)(s.hechos)
    if(c.comunidadAutonoma === "canarias"){
      function registrarBien(x:Schema.Json):void {
        if(esLista(x)){x.forEach(registrarBien);return}
        if(!esObjeto(x))return
        if(esTexto(x.catastro)){
          const anterior=bienesCanarios.get(x.catastro)
          exigir(anterior===undefined||anterior===codigo,"Concurrencia sobre el mismo bien canario: art18.2 requiere elección entre "+anterior+" y "+codigo)
          bienesCanarios.set(x.catastro,codigo)
        }
        Object.values(x).forEach(registrarBien)
      }
      registrarBien(hechosConciliables)
    }
    if(!(s.lote === "A40" && s.codigo === "andalucia_conyuge_pareja_discapacidad") && !inversionExt && s.lote !== "C36" && s.lote !== "B-ampliado" && s.lote !== "E38" && s.lote !== "F-ampliado" && s.lote !== "A-aragon-dos") conciliar(hechosConciliables, m)
    restriccionesC36.push([])
    if (s.lote === "CLM" || s.lote === "CYL" || s.lote === "EXT") {
      function repartoExacto(x: Schema.Json): void {
        if (esLista(x)) {
          x.forEach(repartoExacto)
          return
        }
        if (!esObjeto(x)) return
        for (const [k, v] of Object.entries(x)) {
          if (
            ["titularesMinimo", "pagadores", "titulares"].includes(k) &&
            esLista(v)
          ) {
            let d = v.length
            while (d > 0 && d % 2 === 0) d /= 2
            while (d > 0 && d % 5 === 0) d /= 5
            exigir(
              d <= 1,
              "Reparto territorial D con divisor no finito: transporte racional pendiente para esta rama"
            )
          }
          repartoExacto(v)
        }
      }
      repartoExacto(hechosConciliables)
    }
    const derecho = (id: string) =>
      exigir(
        m.sujetosConMinimo.includes(id),
        "Sujeto sin mínimo anual conciliado: " + id
      )
    if (
      s.lote === "A" &&
      s.hechos.codigo === "cataluna_viudedad_2023_2024_2025"
    )
      for (const d of s.hechos.viudedad.descendientes)
        if (d.ejerciciosConMinimo.includes(2025)) derecho(d.id)
    if (s.lote === "CLM" && s.codigo === "clm_nacimiento_adopcion_hijos")
      for (const e of s.hechos.eventos)
        for (const hijo of e.hijos) {
          derecho(hijo)
          conciliarEventoFamiliar(m, hijo, e.tipo, e.fecha)
        }
    if (s.lote === "EXT" && s.codigo === "extremadura_material_escolar")
      for (const h of s.hechos.descendientes) derecho(h.id)
    if (s.lote === "F")
      for (const b of s.hechos.beneficiarios ?? [])
        if (b.relacion === "hijo" || b.progenitoresConvivientes !== undefined) {
          exigir(b.id !== undefined, "Beneficiario sin identidad")
          derecho(b.id)
        }

    if (
      s.lote === "B" &&
      s.hechos.codigo === "asturias_gastos_vitales_hasta_35"
    )
      conciliar({ persona: contribuyente, nacimiento: s.hechos.nacimiento }, m)
    if (s.lote === "C" && "nacimiento" in s.hechos)
      conciliar({ persona: contribuyente, nacimiento: s.hechos.nacimiento }, m)
    if (s.lote === "C" && "discapacidad" in s.hechos)
      conciliar(
        { persona: contribuyente, discapacidad: s.hechos.discapacidad },
        m
      )
    if (s.lote === "CYL" && s.codigo === "cyl_gastos_adopcion")
      for (const adopcion of s.hechos.adopciones) {
        derecho(adopcion.hijo)
        conciliarEventoFamiliar(
          m,
          adopcion.hijo,
          "adopcion",
          adopcion.fechaResolucion,
          adopcion.fechaInscripcion
        )
        const familiar = m.caso.derechosMinimos?.descendientes.find(
          (d) => d.sujetoId === adopcion.hijo
        )
        exigir(
          adopcion.titularesMinimo.every(
            (id) =>
              familiar?.titulares.find((t) => t.titularId === id)?.vinculo
                .clase === "adopcion"
          ),
          "Reparto entre titulares mixtos de adopción pendiente de contrato específico: " +
            adopcion.hijo
        )
      }
    if (
      s.lote === "A" &&
      s.hechos.codigo === "cataluna_nacimiento_adopcion_acogimiento"
    )
      for (const e of s.hechos.eventos)
        conciliarEventoFamiliar(m, e.persona, e.clase, e.fecha)
    if (
      s.lote === "F" &&
      (s.codigo === "madrid_adopcion_internacional" ||
        s.codigo === "murcia_nacimiento_adopcion")
    )
      for (const e of s.hechos.eventos ?? []) {
        if (e.fecha !== undefined && e.tipo !== undefined)
          for (const hijo of e.hijo === undefined ? (e.hijos ?? []) : [e.hijo])
            conciliarEventoFamiliar(m, hijo, e.tipo, e.fecha)
      }
    if (s.lote === "CYL" && s.codigo === "cyl_familia_numerosa") {
      exigir(
        s.hechos.conyuge === null,
        "Cónyuge no representado en el caso anual individual"
      )
      s.hechos.descendientes.forEach(derecho)
      exigir(
        s.hechos.descendientes.length === m.sujetosConMinimo.length &&
          new Set(s.hechos.descendientes).size === m.sujetosConMinimo.length,
        "Censo de descendientes con mínimo anual incompleto"
      )
      for (const sujeto of s.hechos.discapacidad65)
        conciliar({ persona: sujeto, grado: 65 }, m)
    }
    if (
      s.lote === "CYL" &&
      s.codigo === "cyl_cuotas_seguridad_social_empleados_hogar"
    )
      derecho(s.hechos.hijo)
    // Inicio de conciliación de eventos A40 mediante el conciliador v4 recibido.
    if (s.lote === "A40") {
      if (
        s.codigo === "aragon_nacimiento_adopcion_hijo_discapacidad_33" ||
        s.codigo === "aragon_adopcion_internacional" ||
        s.codigo === "aragon_nacimiento_adopcion_tercer_hijo_sucesivos" ||
        s.codigo === "aragon_primer_segundo_hijo_poblaciones_menos_10000"
      ) {
        for (const e of s.hechos.eventos) {
          conciliarEventoFamiliar(m, e.persona, e.clase, e.fecha)
          if (e.clase === "adopcion") {
            const familiar = m.caso.derechosMinimos?.descendientes.find(
              (d) => d.sujetoId === e.persona
            )
            exigir(
              e.convivientes.every(
                (id) =>
                  familiar?.titulares.find((t) => t.titularId === id)?.vinculo
                    .clase === "adopcion"
              ),
              "Reparto mixto de adopción A40 pendiente de contrato específico: " +
                e.persona
            )
          }
        }
      }
      if (s.codigo === "andalucia_adopcion_internacional") {
        for (const a of s.hechos.adopciones) {
          const familiar = m.caso.derechosMinimos?.descendientes.find(
            (d) => d.sujetoId === a.persona
          )
          const vinculo = familiar?.titulares.find(
            (t) => t.titularId === contribuyente
          )?.vinculo
          exigir(
            vinculo?.clase === "adopcion",
            "Vínculo anual incompatible con la adopción A40: " + a.persona
          )
          exigir(
            vinculo.fechaConstitucionVinculo !== undefined,
            "A40: fecha de constitución adoptiva no representada en derechosMinimos"
          )
          conciliarEventoFamiliar(
            m,
            a.persona,
            "adopcion",
            vinculo.fechaConstitucionVinculo,
            a.inscripcionCivil
          )
          exigir(
            a.titulares.every(
              (id) =>
                familiar?.titulares.find((t) => t.titularId === id)?.vinculo
                  .clase === "adopcion"
            ),
            "Reparto mixto de adopción A40 pendiente de contrato específico: " +
              a.persona
          )
        }
      }
    }
    // Fin de conciliación de eventos A40.
    // Una misma factura/pago no puede financiar dos solicitudes. Los evaluadores controlan repetición interna.
    const locales = new Set<string>()
    function pagos(x: Schema.Json): void {
      if (esLista(x)) {
        x.forEach(pagos)
        return
      }
      if (!esObjeto(x)) return
      const v = x
      if (
        esTexto(v.id) &&
        ("importe" in v ||
          "importeEUR" in v ||
          "importeCentimos" in v ||
          "euros" in v ||
          (s.lote === "D51" && "valor" in v))
      ) {
        exigir(!hechos.has(v.id) && (s.lote !== "F-ampliado" || !locales.has(v.id)), "Hecho monetario duplicado: " + v.id)
        exigir(!operaciones81(m.libroMaternidad81).includes(v.id), "Pago art81 repetido en otro consumidor regional: "+v.id)
        locales.add(v.id)
        for (const campo of ["factura", "documento", "justificante"])
          if (esTexto(v[campo])) {
            exigir(!operaciones81(m.libroMaternidad81).some(id=>id===v[campo]), "Documento art81 reutilizado en otro consumidor regional")
            const referencia = campo + ":" + v[campo]
            exigir(
              !hechos.has(referencia),
              "Documento monetario duplicado: " + referencia
            )
            locales.add(referencia)
            if (planC36.length > 0) {
              const comun = "documento-monetario:" + v[campo]
              exigir(!hechos.has(comun), "Documento monetario reutilizado entre contratos: " + v[campo])
              locales.add(comun)
            }
          }
      }
      Object.values(v).forEach(pagos)
    }
    if(s.lote === "C36") registrarMonetariosC36(s,hechos,m)
    else pagos(hechosConciliables)
    locales.forEach((id) => hechos.add(id))
    switch (s.lote) {
      case "CYL81": return normalizar(evaluarCuidadoCyl81(s,m))
      case "E38": {
        const resultado = evaluarE38Anual(s,m)
        evaluacionesE38.set(indice,resultado)
        return normalizar(resultado)
      }
      case "D51": {
        const r=sesionD51.evaluar(s)
        if(r.estatal681!==undefined){
          exigir(generacionesEstatales681.length===0,"Productor68.1 duplicado")
          generacionesEstatales681.push(r.estatal681)
        }
        return normalizar(r)
      }
      case "F-ampliado": {
        const resultado = evaluarAnualF2025(s, m, decoded.success.solicitudes.filter((x) => x.lote === "F-ampliado"))
        evaluacionesF.push(resultado)
        return resultado
      }
      case "C36": {
        const resultado = evaluarAnualC36(s,m,planC36)
        if(resultado.estado === "calculo_parcial") restriccionesC36[restriccionesC36.length-1] = resultado.limitesComposicion
        return normalizar(resultado)
      }
      case "A-aragon-dos": {
        const r=evaluarAragonDosAnual2025(s,m,decoded.success.solicitudes)
        if(r.estatal681!==undefined){
          exigir(generacionesEstatales681.length===0,"Productor68.1 duplicado")
          generacionesEstatales681.push(r.estatal681)
        }
        return normalizar(r)
      }
      case "B-ampliado": {
        exigir(preparadoB?.estado === "generaciones_preparadas", "Preparación B37 ausente")
        const generacion = preparadoB.generaciones.find(g => g.codigo === codigo)
        exigir(generacion !== undefined, "Generación B37 sin correspondencia única")
        return generacion.estado === "generada" ? normalizar(generacion.evaluacion) : normalizar({ estado: "excluida", motivo: generacion.motivo, rastro: generacion.rastro })
      }
      case "A40":
        return normalizar(
          evaluarAmpliacionAnualA2025(s, m, decoded.success.solicitudes)
        )
      case "A": {
        const solicitud = {
          ejercicio: 2025 as const,
          modalidad: "individual" as const,
          contribuyente,
          territorio: "catalunya" as const,
          devengo: "2025-12-31" as const,
        }
        if ("donativos" in s.hechos)
          return normalizar(
            evaluarCatalunyaHechos2025({
              ...solicitud,
              ...s.hechos,
              cuotaIntegraAutonomicaEuros: m.cuotaAutonomica.toFixed(),
            })
          )
        return normalizar(
          evaluarCatalunyaHechos2025({ ...solicitud, ...s.hechos })
        )
      }
      case "B": {
        const territorioB = c.comunidadAutonoma
        exigir(
          territorioB === "asturias" || territorioB === "cantabria",
          "Territorio B no conciliado"
        )
        const marcoB = {
          ...contexto,
          ...bases,
          territorio: territorioB,
          exhaustividad: "completa" as const,
        }
        if (
          s.hechos.codigo === "cantabria_gastos_enfermedad" ||
          s.hechos.codigo === "cantabria_familias_monoparentales"
        )
          return normalizar(
            evaluarHechosB2025(marcoB, {
              ...s.hechos,
              baseLiquidableMenosMinimo: m.baseGeneral
                .plus(m.baseAhorro)
                .minus(m.minimoPersonalFamiliar)
                .toFixed(),
            })
          )
        return normalizar(evaluarHechosB2025(marcoB, s.hechos))
      }
      case "E":
        if (
          s.hechos.codigo ===
          "galicia_discapacidad_mayor_65_ayuda_terceras_personas"
        )
          return normalizar(
            evaluarHechosE2025({
              ...s.hechos,
              contexto,
              baseImponible: m.baseGeneral.plus(m.baseAhorro).toFixed(),
              minimoPersonalFamiliar: m.minimoPersonalFamiliar.toFixed(),
            })
          )
        if (s.hechos.codigo === "galicia_donaciones_idi")
          return normalizar(
            evaluarHechosE2025({
              ...s.hechos,
              contexto,
              cuotaIntegraAutonomica: m.cuotaAutonomica.toFixed(),
            })
          )
        return normalizar(evaluarHechosE2025({ ...s.hechos, contexto }))
      case "F":
        if (s.hechos.nacimientoContribuyente !== undefined)
          exigir(
            2025 - Number(s.hechos.nacimientoContribuyente.slice(0, 4)) ===
              c.situacionFamiliar.edad,
            "Nacimiento propio contradictorio"
          )
        if (s.hechos.gradoPorcentaje !== undefined) {
          const grado = new D(s.hechos.gradoPorcentaje)
          exigir(
            c.situacionFamiliar.discapacidad._tag ===
              (grado.gte(65)
                ? "Discapacidad65OMas"
                : grado.gte(33)
                  ? "Discapacidad33a64"
                  : "SinDiscapacidad"),
            "Grado propio contradictorio"
          )
        }
        return normalizar(
          evaluarTerritorialF2025({
            tipo: "territorial_f_hechos_2025",
            contexto,
            codigo,
            hechos: {
              ...s.hechos,
              baseGeneralEUR: bases.baseGeneral,
              baseAhorroEUR: bases.baseAhorro,
            },
          })
        )
      case "CLM":
        switch (s.codigo) {
          case "clm_discapacidad_contribuyente":
            return normalizar(CLM.discapacidadPropia(marco, s.hechos))
          case "clm_mayores_75":
            return normalizar(CLM.mayores75(marco, s.hechos))
          case "clm_nacimiento_adopcion_hijos":
            return normalizar(CLM.nacimientoAdopcion(marco, s.hechos))
          case "clm_cuidado_ascendientes_mayores_75":
            return normalizar(CLM.cuidadoAscendientes75(marco, s.hechos))
        }
      case "CYL":
        switch (s.codigo) {
          case "cyl_contribuyentes_discapacidad":
            return normalizar(CYL.discapacidadPropia(marco, s.hechos))
          case "cyl_gastos_adopcion":
            return normalizar(CYL.adopcion(marco, s.hechos))
          case "cyl_cuotas_seguridad_social_empleados_hogar":
            return normalizar(CYL.cuotasHogar(marco, s.hechos))
          case "cyl_familia_numerosa":
            return normalizar(CYL.familiaNumerosa(marco, s.hechos))
        }
      case "EXT":
        switch (s.codigo) {
          case "extremadura_trabajo_dependiente": {
            const rentas = m.rentasTrabajoAnuales
            exigir(
              rentas !== undefined,
              "Rentas anuales de trabajo/resto no derivables en este perfil"
            )
            const personas = s.hechos.personas.map((persona) => {
              exigir(
                persona.id === contribuyente,
                "Rentas de otra persona no representadas en la anual individual"
              )
              return {
                ...persona,
                integroTrabajo: rentas.integroTrabajo.toFixed(),
                restoRentas: rentas.restoRentas.toFixed(),
              }
            })
            return normalizar(
              EXT.trabajoDependiente(marco, { ...s.hechos, personas })
            )
          }
          case "extremadura_partos_multiples":
            return normalizar(EXT.partosMultiples(marco, s.hechos))
          case "extremadura_material_escolar":
            return normalizar(EXT.materialEscolar(marco, s.hechos))
          case "extremadura_enfermos_ela_familiares":
            return normalizar(EXT.ela(marco, s.hechos))
        }
      case "C": {
        const territorioC = c.comunidadAutonoma
        exigir(
          territorioC === "canarias" || territorioC === "illes-balears",
          "Territorio C no conciliado"
        )
        const h = {
          ...contexto,
          territorio: territorioC,
          ...bases,
          devengo: "2025-12-31",
          causaDevengo: "fin_ejercicio" as const,
          exhaustividad: "declaracion_completa" as const,
        }
        switch (s.codigo) {
          case "canarias_traslado_residencia_otra_isla_trabajo":
            return normalizar(C.evaluarTraslado({ ...h, ...s.hechos }))
          case "canarias_gasto_enfermedad":
            return normalizar(C.evaluarEnfermedad({ ...h, ...s.hechos }))
          case "canarias_estudios_no_superiores":
            return normalizar(
              C.evaluarEstudiosNoSuperiores({ ...h, ...s.hechos })
            )
          case "canarias_custodia_guarderias":
            return normalizar(C.evaluarGuarderia({ ...h, ...s.hechos }))
          case "canarias_primas_seguro_impago_arrendamientos":
            return normalizar(C.evaluarSegurosImpago({ ...h, ...s.hechos }))
          case "balears_arrendador_vivienda_permanente_primas_seguro":
            return normalizar(C.evaluarSegurosImpago({ ...h, ...s.hechos }))
          case "balears_idiomas_extraescolares":
            return normalizar(C.evaluarIdiomas({ ...h, ...s.hechos }))
          case "balears_entidades_tercer_sector":
            return normalizar(C.evaluarTercerSector({ ...h, ...s.hechos }))
          case "balears_declarantes_discapacidad_o_descendientes_discapacidad":
            return normalizar(C.evaluarDiscapacidad({ ...h, ...s.hechos }))
          case "balears_conciliacion_menores_6":
            return normalizar(C.evaluarConciliacion({ ...h, ...s.hechos }))
        }
      }
    }
    throw new RangeError("Código sin conexión anual")
  })
  function consumirExistente() {
    const importesExactos = importes.map((x) => {
      if ("estado" in x) throw new RangeError("Resultado F sin libro anual")
      return x
    })
    // Orden fiscal B de prioridad primera; la regla de consumo sigue siendo la única del libro.
    // Conservar la correspondencia pública por código, incluso si cambia el orden de consumo.
    const orden = importesExactos.map((_, indice) => indice).sort((a, b) => {
      const primera = (i: number) => preparadoB?.estado === "generaciones_preparadas" && preparadoB.generaciones.some(g => g.codigo === codigos[i] && g.estado === "generada" && g.regimenPosterior?.prioridadCuota === "primera")
      return (primera(a) ? 0 : 1) - (primera(b) ? 0 : 1)
    })
    const limitesC36 = limitarCandidatosC36(importesExactos, restriccionesC36, racional(m.cuotaAutonomica.toFixed()))
    const libro = consumirCuota(racional((m.cuotaAutonomicaResidual ?? m.cuotaAutonomica).toFixed()), orden.map(i => limitesC36.importes[i]))
    const consumo = { ...libro, aplicaciones: importesExactos.map((_, indice) => libro.aplicaciones[orden.indexOf(indice)]) }
    return { consumo, limitesC36 }
  }
  const { consumo, limitesC36 } = evaluacionesF.length === 0
    ? consumirExistente()
    : { consumo: consumirCuotaAnualF2025(racional((m.cuotaAutonomicaResidual ?? m.cuotaAutonomica).toFixed()), codigos, importes, racional(m.cuotaAutonomica.toFixed())), limitesC36: undefined }
  const ampliacion: ResultadoSaldosE38 = {}
  if(evaluacionesE38.size>0){
    const aplicacionesE38 = consumo.aplicaciones.map((aplicacion) => {
      if (aplicacion.pendiente === undefined) throw new RangeError("Saldo E38 sin aplicación de cuota completa")
      return { pendiente: aplicacion.pendiente }
    })
    ampliacion.saldosE38=saldosE38Anuales(codigos,evaluacionesE38,aplicacionesE38)
  }
  const generacionEstatal681=generacionesEstatales681[0]
  const estatal681 = generacionEstatal681 === undefined ? undefined : (() => {
    exigir(m.cuotaEstatal681!==undefined,"68.1: falta cuota estatal producida por la anual")
    exigir(m.donativosEstatales===undefined,"68.1: combinación con donativos no representada")
    return {generacion:generacionEstatal681,consumo:consumirCuota(racional(m.cuotaEstatal681.toFixed()),[racional(generacionEstatal681.importeExactoEuros)])}
  })()
  const salidaBase = {
    viviendaDT182025: m.libroDT18===undefined ? undefined : {...m.libroDT18.publico,cuotas:m.cuotasDT18},
    estatal681,
    ...consumo,
    ...ampliacion,
    codigos,
    evaluaciones,
    evaluacionesF,
    estado: "condicionado" as const,
    aceptacionFiscal: "pendiente" as const,
    limitaciones: [
      "Sólo declaración individual ordinaria 2025; documentos y derechos externos declarados, sin certificación automática",
      "No compone saldos históricos territoriales ni bases de otras personas no representadas por el caso anual; F ampliado conserva origen2025, saldo generado, plazo2026–2028 y seguimiento de recarga",
    ],
  }
  const salida: typeof salidaBase & { limitesC36?: typeof limitesC36; vehiculoDA582025?: LibroVehiculoDA58 } = salidaBase
  if (planC36.length > 0 && limitesC36 !== undefined) salida.limitesC36 = limitesC36
  if (m.vehiculoDA58 !== undefined) salida.vehiculoDA582025 = m.vehiculoDA58
  if (m.donativosEstatales === undefined) return salida
  return { ...salida, donativosEstatales2025: m.donativosEstatales }
}
