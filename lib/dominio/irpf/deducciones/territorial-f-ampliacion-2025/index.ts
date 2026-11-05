import { Function, Result, Schema } from "effect"
import {
  evaluarTerritorialF2025,
  CODIGOS_TERRITORIAL_F_HECHOS_2025,
} from "../territorial-f-2025"
import { decodificarF, type SolicitudF } from "./esquemas"
import {
  CausaF,
  falta,
  ids,
  unicos,
  requerido,
  texto,
  type ResultadoF,
} from "./comun"
import { CITAS_F } from "./citas"
import { conMagnitudesInternasF, type MagnitudesInternasF } from "./magnitudes-internas"
import { familiaF, CODIGOS_FAMILIA_F } from "./familia"
import { viviendaF, CODIGOS_VIVIENDA_F } from "./vivienda"
import { inversionesF, CODIGOS_INVERSION_F } from "./inversiones"

export { SolicitudAmpliacionF } from "./esquemas"
export type { SolicitudF } from "./esquemas"
export type { ResultadoF, DependenciaF, AplicacionAnualRecargaF } from "./comun"
export const CODIGOS_AMPLIACION_F = [
  ...CODIGOS_FAMILIA_F,
  ...CODIGOS_VIVIENDA_F,
  ...CODIGOS_INVERSION_F,
] as const

function evaluarValidada(s: SolicitudF): ResultadoF {
  const rastro = [
    `2025 ${s.contexto.territorio}; referencia ${s.contexto.contribuyente}; hechos declarados ${s.codigo}`,
  ]
  try {
    const norma = CITAS_F.find((x) => x.codigo === s.codigo)
    if (norma === undefined) falta("codigo", "Código ajeno al lote documentalF")
    if (
      s.contexto.ejercicio !== 2025 ||
      s.contexto.territorio !==
        (s.codigo.startsWith("madrid_") ? "madrid" : "murcia")
    )
      falta("contexto", "Ejercicio/territorio distinto del código")
    texto(s.contexto.contribuyente, "contexto.contribuyente")
    const declarantes =
      s.contexto.declarantes ??
      (s.contexto.modalidad === "individual" ? [s.contexto.contribuyente] : [])
    ids(declarantes, "contexto.declarantes")
    if (
      !declarantes.includes(s.contexto.contribuyente) ||
      (s.contexto.modalidad === "individual" && declarantes.length !== 1)
    )
      falta("contexto.declarantes", "Identidad de declaración contradictoria")
    if (CODIGOS_TERRITORIAL_F_HECHOS_2025.some((c) => c === s.codigo)) {
      const anterior = evaluarTerritorialF2025({
        tipo: "territorial_f_hechos_2025",
        codigo: s.codigo,
        contexto: s.contexto,
        hechos: requerido(s.hechos.hechosPrevios, "hechosPrevios"),
      })
      const resultado: ResultadoF = {
        ...anterior,
        estado: "importe" in anterior ? "calculo_parcial" : anterior.estado,
        citas: norma.citas,
      }
      if (anterior.importeExactoEuros === undefined) return resultado
      return { ...resultado, importeAntesPresentacionEUR: anterior.importeExactoEuros }
    }
    if (s.contexto.modalidad !== "individual")
      falta(
        "composicionDerechosConjunta",
        "Para estas ramas nuevas falta reparto exhaustivo entre declarantes; las fórmulas individuales no se usan como liquidación conjunta"
      )
    // Evita que el hijo sea su propio progenitor en CUALQUIER subrama nueva.
    const ps = s.hechos.personas ?? []
    unicos(
      ps.map((p) => texto(p.id, "persona.id")),
      "personas.id"
    )
    if (
      ps.some(
        (p) => p.id !== undefined && (p.progenitores ?? []).includes(p.id)
      )
    )
      falta("evento.hijo", "Hijo incluido entre sus propios progenitores")
    for (const p of ps) {
      const id = texto(p.id, "persona.id")
      if (p.relacion !== "contribuyente" && id === s.contexto.contribuyente)
        falta("persona.id", "Familiar con identidad del contribuyente")
      if (
        p.relacion !== "contribuyente" &&
        [p.titularesMinimo ?? [], p.titularesDeduccion ?? []].some((xs) =>
          xs.includes(id)
        )
      )
        falta(
          "persona.id",
          "Una persona no es titular de su propio mínimo/deducción familiar"
        )
      const prioridades = p.gradoMasCercanoConPrioridad ?? []
      if (
        prioridades.includes(id) ||
        prioridades.some(
          (id) =>
            (p.titularesMinimo ?? []).includes(id) ||
            (p.titularesDeduccion ?? []).includes(id)
        )
      )
        falta(
          "persona.prioridad",
          "Identidad en listas incompatibles de titulares y grados prioritarios"
        )
    }
    let resultado: ResultadoF
    if (CODIGOS_FAMILIA_F.some((c) => c === s.codigo)) resultado = familiaF(s)
    else if (CODIGOS_VIVIENDA_F.some((c) => c === s.codigo))
      resultado = viviendaF(s)
    else if (CODIGOS_INVERSION_F.some((c) => c === s.codigo))
      resultado = inversionesF(s)
    else falta("codigo", "Código sin rama territorial registrada")
    return { ...resultado, rastro: [...rastro, ...resultado.rastro] }
  } catch (cause) {
    if (!Schema.is(CausaF)(cause)) throw cause
    return {
      codigo: s.codigo,
      estado: cause.estado,
      motivo: cause.message,
      siguienteHecho: cause.campo,
      rastro,
      reservas: [],
      citas: CITAS_F.find((x) => x.codigo === s.codigo)?.citas ?? [],
    }
  }
}
function evaluarDecodificada(r: ReturnType<typeof decodificarF>): ResultadoF {
  if (Result.isFailure(r))
    return {
      codigo: "desconocido",
      estado: "no_soportado",
      motivo: String(r.failure),
      siguienteHecho: String(r.failure),
      rastro: [],
      reservas: [],
      citas: [],
    }
  return evaluarValidada(r.success)
}
/** Frontera nueva aditiva: no modifica el dispatcher común ni importa entregas privadas. */
export const evaluarAmpliacionF2025 = Function.flow(
  decodificarF,
  evaluarDecodificada
)

/** Libro territorial sin total ni cuota. El padre conectará cuota y saldos una vez.
 * IDs de operaciones son exhaustivos y estables, no alias por deducción. */
export function evaluarSolicitudesAmpliacionF2025(
  solicitudes: readonly SolicitudF[]
): readonly ResultadoF[] {
  const codigos = new Set<string>()
  const operaciones = new Set<string>()
  return solicitudes.map((entrada) => {
    const decoded = decodificarF(entrada)
    if (Result.isFailure(decoded)) return evaluarDecodificada(decoded)
    const s = decoded.success
    const idsOperaciones = [
      ...(s.hechos.pagos ?? []).flatMap((p) =>
        p.id === undefined ? [] : [p.id]
      ),
      ...(s.hechos.inversiones ?? []).flatMap((i) =>
        i.id === undefined ? [] : [i.id]
      ),
    ]
    const repetida =
      codigos.has(s.codigo) || idsOperaciones.some((id) => operaciones.has(id))
    codigos.add(s.codigo)
    idsOperaciones.forEach((id) => operaciones.add(id))
    if (repetida)
      return {
        codigo: s.codigo,
        estado: "no_soportado",
        motivo:
          "Código u operación repetidos; resolver elección/libro, no consumir cuota dos veces",
        siguienteHecho: "eleccionYLibroOperaciones",
        rastro: [],
        reservas: [],
        citas: [],
      }
    return evaluarAmpliacionF2025(s)
  })
}

/** Uso exclusivo del adaptador anual tras decodificar su Schema cerrado. */
export function evaluarAmpliacionFDerivada2025(
  s: SolicitudF,
  m: MagnitudesInternasF
): ResultadoF {
  return conMagnitudesInternasF(s, m, () => evaluarValidada(s))
}
