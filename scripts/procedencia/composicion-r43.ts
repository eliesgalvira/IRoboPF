import { createPortComposition } from "./puertos-composicion-r47"
import { hashFile } from "./composicion-r43-archivos.mjs"
import { composeSS, validateSS } from "./flujo-ss-r36.mjs"
import { composeRetencionesR34, verifyRetencionesR34 } from "./flujo-retenciones-r34.mjs"
import { composeRentasR36, verifyRentasR36 } from "./flujo-rentas-r36.mjs"
import { composeEscalasR36, verifyEscalasR36 } from "./flujo-escalas-r36.mjs"

export const base = "05cf0e159cc0a0eb3b87d554447a2d14939115c2"
const money = "lib/dominio/dinero/importe-monetario.ts"
const labor = "lib/dominio/laboral/"
const income = "lib/dominio/irpf/"
const scaleTargets = [
  [income + "rendimientos/rendimientos-trabajo.ts", "sumarRendimientosTrabajo"],
  [income + "rendimientos/rendimientos-trabajo.ts", "calcularRendimientoNetoTrabajo"],
  [income + "rendimientos/rendimientos-capital-inmobiliario.ts", "sumarRendimientosCapitalInmobiliario"],
  [income + "rendimientos/rendimientos-capital-inmobiliario.ts", "calcularRendimientoNetoCapitalInmobiliarioSimplificado"],
  [income + "rendimientos/ganancias-perdidas-patrimoniales.ts", "calcularGananciasPatrimonialesPorTransmision"],
  [income + "reducciones/reduccion-rendimientos-trabajo.ts", "calcularReduccionTrabajoConOtrasRentas"],
  [income + "trabajo-anual/adaptador.ts", "adaptarTrabajoAnual"],
  [income + "actividades-economicas/adaptador.ts", "adaptarActividadGeneral"],
  [income + "trabajo-anual/calcular.ts", "calcularDeduccionTrabajo"],
] as const
const ssTargets = [
  [labor + "cotizaciones-perfil-uniforme.ts", "calcularDesgloseCotizacionesPerfilUniforme"],
  [labor + "cotizaciones-sociales.ts", "calcularDesgloseCotizacionesSocialesLegacy"],
] as const
const rentTargets = [
  [income + "comunidades/comunidad-autonoma.ts", "obtenerParametrosComunidadAutonoma"],
  [income + "cuotas/escalas-publicadas.ts", "obtenerEscalaAutonomicaPublicada"],
  [income + "cuotas/escalas-gravamen.ts", "calcularCuotaPorEscala"],
] as const
export function produceComposition() {
  const fragments = { ss: composeSS(), retenciones: composeRetencionesR34(), rentas: composeRentasR36(), escalas: composeEscalasR36() }
  const links = [
    ...scaleTargets.map(([file, symbol]) => ({ consumer: file + "#" + symbol, group: "rentas", producer: file + ":" + symbol, conversion: "identity; preserve properties and call arguments" })),
    ...ssTargets.map(([file, symbol]) => ({ consumer: file + "#" + symbol, group: "ss", producer: symbol, conversion: "identity; Decimal EUR fields; MEI parameters remain ratios" })),
    ...rentTargets.map(([file, symbol]) => ({ consumer: "boundary:" + symbol, group: "escalas", producer: file + "#" + symbol, conversion: "identity; preserve structures" })),
  ]
  const dependencies = [
    ...["ss-r36", "retenciones-r34", "rentas-r36", "escalas-r36"].flatMap(n => ["scripts/procedencia/flujo-" + n + ".mjs", "scripts/procedencia/flujo-" + n + "-consumidor.mjs"]),
    "scripts/procedencia/composicion-r43.ts",
    "scripts/procedencia/composicion-r43-archivos.mjs",
    "schemas/procedencia/flujo/composicion-r43.schema.json",
  ].map(path => ({ path, sha256: hashFile(path) }))
  return { version: "composicion-r43.1", base, fragments, links, dependencies,
    propertyPorts: fragments.escalas.boundaryContracts.flatMap((contract: { id: string; outputs: string[]; parameters: { index: number; binding: string; type: string | null; source: { file: string; start: number; end: number; sha256: string } }[]; calls: string[]; resultVariants: object[] }) => contract.outputs.map(output => ({
      id: contract.id + "::" + output,
      consumer: contract.id,
      property: output.split(":")[0],
      representation: output.split(":").slice(1).join(":"),
      producer: links.find(link => link.consumer === contract.id) ?? null,
      parameters: contract.parameters,
      calls: fragments.escalas.callBindings.filter((call: { target: string }) => contract.calls.includes(call.target)),
      condition: contract.resultVariants,
      instance: "per call path, block environment and callback index",
      conversion: "identity; all monetary conversions remain operations inside producer or consumer",
    }))),
    domain: "ordinary synchronous finite programs; pre-admitted financial domain; no arbitrary injected services, fibers, interruption or instrumentation exceptions",
    admission: { route: "annual-public-admission", reviewedPackage: null, admissionClosed: false, siteClosed: false, wiringAllowed: false, completeRuleAcceptance: false },
  }
}
export type Composition = ReturnType<typeof produceComposition>
export function verifyComposition(candidate: Composition) {
  validateSS(candidate.fragments.ss)
  verifyRetencionesR34(candidate.fragments.retenciones)
  verifyRentasR36(candidate.fragments.rentas)
  verifyEscalasR36(candidate.fragments.escalas)
  const expected = produceComposition()
  if (JSON.stringify(candidate) !== JSON.stringify(expected)) throw Error("Correspondencia de composición alterada")
  const groups = [candidate.fragments.ss.outputBindings, candidate.fragments.retenciones.outputBindings, candidate.fragments.escalas.outputBindings, candidate.fragments.rentas.outputs]
  const ids: string[] = groups.flatMap(group => group.map((o: { siteId: string }) => o.siteId))
  if (new Set(ids).size !== 65 || ids.length !== 65) throw Error("Universo incompatible")
  return structuredClone(candidate)
}
/** No existe recibo revisado de admisión para este candidato. No se acepta un objeto aportado por el consumidor. */
export function consumePublic(candidate: Composition, route: string) {
  verifyComposition(candidate)
  throw Error("Admisión revisada ausente para " + route + "; consumidor público cerrado")
}

/** Laboratorio de valor; las entradas conservan su contrato público, pero este método no concede admisión. */
export function createComposition(candidate: Composition) {
  return createPortComposition(candidate)
}
