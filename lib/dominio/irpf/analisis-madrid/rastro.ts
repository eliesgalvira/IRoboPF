import type { ipcMadrid } from "./ipc"
import type { TramoCuotaCalculado } from "../cuotas/escalas-gravamen"
import type { ParametrosMadrid2018 } from "./parametros"
interface Rama {
  politica: string; anioNormativo: number; bruto: string; ssTrabajador: string; gastoGeneral: string; argumentoArt20: string
  reduccionArt20: string; base: string; cuotaPreviaDA61: string; deduccionTrabajo: string; Q: string; neto: string; netoEUR2018: string
  minimoEstatal: string; minimoAutonomico: string; desgloseEstatal: ReadonlyArray<TramoCuotaCalculado>; desgloseAutonomico: ReadonlyArray<TramoCuotaCalculado>
}
type ValorRastro = string | number | boolean | null | undefined | readonly ValorRastro[] | { readonly [clave: string]: ValorRastro }
/** Rastro explicativo, separado del binding ejecutable y de sus snapshots. */
export function rastroMadrid(e: { X: Rama; I: Rama; Hdecimal: Rama; factor: string; ejercicio: number; ss: string; paqueteX: ParametrosMadrid2018; paqueteI: ParametrosMadrid2018; ipc: ReturnType<typeof ipcMadrid>["procedencia"] }) {
  return (["X", "I", "Hdecimal"] as const).flatMap(nombre => {
    const r = e[nombre], p = nombre === "X" ? e.paqueteX : nombre === "I" ? e.paqueteI : null
    const linea = (operacion: string, operandos: ValorRastro, resultado: ValorRastro, dependencias: string[], fuentes: string[], unidad = "EUR") => ({
      siteId: "analisis-madrid." + operacion, instanceId: nombre + ":" + e.ejercicio + ":" + operacion,
      operacion, operandos, resultado, ipc: e.ipc, fuentesMetodo: "docs/analisis-madrid/fuentes-metodo-ipc-coste.json", fuentesIPC_SS: "docs/analisis-madrid/fuentes-ipc-ss-2018-2025.json", adendaLegal: "docs/analisis-madrid/adenda-legal.json#/porEjercicio/" + r.anioNormativo, dependencias: dependencias.map(x => nombre + ":" + e.ejercicio + ":" + x), unidad,
      anioNormativo: r.anioNormativo, anioPrecios: e.ejercicio, politica: r.politica, naturalezaSS: e.ss,
      fuentes: fuentes.map(id => "docs/analisis-madrid/catalogo.json#/" + id),
      estadoFuente: "consultar-reserva-individual-catalogo", verificacionAlgoritmo: "pendiente", snapshotPromovido: false,
    })
    const formulasArt20 = { anterior: "max(0,3700-1.15625*max(0,N-11250)); cero desde14450", nueva: "max(0,5565-1.5*max(0,N-13115)); cero desde16825" }
    const art20Anual = r.anioNormativo === 2018 ? { ...formulasArt20, mezcla: "A+max(0,B-A)/2" }
      : r.anioNormativo <= 2022 ? { formula: formulasArt20.nueva }
      : r.anioNormativo === 2023 ? { formula: "max(0,6498-1.14*max(0,N-14047.50)); cero desde19747.50" }
      : { formula: "N<=14852:7302; N<=17673.52:7302-1.75*(N-14852); N<19747.50:2364.34-1.14*(N-17673.52); resto0" }
    const normativa = "porEjercicio/" + r.anioNormativo
    return [
      linea("parametros", { factor: p?.factor ?? "1", origen: p === null ? "selector-productivo-anual" : "fabrica2018", hipotesis: nombre === "I" }, p ?? { gastoGeneral: "2000", art20: art20Anual, minimoEstatal: r.minimoEstatal, minimoAutonomico: r.minimoAutonomico }, [], [normativa,"ipc"]),
      linea("art19", { bruto: r.bruto, SS: r.ssTrabajador, limite: p?.gastoGeneral ?? "2000", formula: "min(limite,max(0,bruto-SS))" }, r.gastoGeneral, ["parametros"], [normativa + "/art19","ss"]),
      linea("art20", { N: r.argumentoArt20, otrasRentas: "0", parametros: p?.parametrosArt20 ?? art20Anual, formula: "operacion-original;2018:A+max(0,B-A)/2;limite-neto-art19" }, r.reduccionArt20, ["art19","parametros"], [normativa + "/art20"]),
      linea("base", { bruto: r.bruto, SS: r.ssTrabajador, gasto: r.gastoGeneral, reduccion: r.reduccionArt20, formula: "max(0,bruto-SS-gasto-reduccion)" }, r.base, ["art19","art20"], []),
      linea("minimos", { edad: "18–64", estado: "sin-familia-discapacidad", factor: p?.factor ?? "1" }, { estatal: r.minimoEstatal, autonomico: r.minimoAutonomico }, ["parametros"], [normativa + "/minimos"]),
      linea("gravamen", { base: r.base, minimoEstatal: r.minimoEstatal, minimoAutonomico: r.minimoAutonomico, estatal: r.desgloseEstatal.map(t => ({ limiteInferior: t.limiteInferior.toFixed(), limiteSuperior: t.limiteSuperior.toFixed(), baseAplicada: t.baseAplicada.toFixed(), tipo: t.tipo.toFixed(), cuota: t.cuota.toFixed(), cuotaFija: t.cuotaFija?.toFixed() })), autonomico: r.desgloseAutonomico.map(t => ({ limiteInferior: t.limiteInferior.toFixed(), limiteSuperior: t.limiteSuperior.toFixed(), baseAplicada: t.baseAplicada.toFixed(), tipo: t.tipo.toFixed(), cuota: t.cuota.toFixed(), cuotaFija: t.cuotaFija?.toFixed() })), formula: "cuotas-escalas-compartidas-menos-gravamen-minimos" }, r.cuotaPreviaDA61, ["base","minimos"], [normativa + "/estatal",normativa + "/madrid"]),
      linea("DA61", { cuotaPrevia: r.cuotaPreviaDA61, bruto: r.bruto, deduccion: r.deduccionTrabajo, parametros: r.anioNormativo === 2025 ? { maximo: "340", umbral: "16576", limiteExclusivo: "18276", coeficiente: "0.2", otrasRentas: "0", otrasRentasMax: "6500" } : null, formula: "cuotaPrevia-deduccion" }, r.Q, ["gravamen"], r.anioNormativo === 2025 ? ["DA61-2025"] : []),
      linea("neto", { bruto: r.bruto, SS: r.ssTrabajador, Q: r.Q, formula: "bruto-SS-Q" }, r.neto, ["DA61"], ["ss"]),
      linea("deflacion", { neto: r.neto, factor: e.factor, formula: "neto/factor" }, r.netoEUR2018, ["neto"], ["ipc"], "EUR-diciembre-2018"),
    ]
  })
}
