import Decimal from "decimal.js"
import { MADRID_2018_2021, type EscalaPublicada } from "../cuotas/escalas-publicadas"
import { TRAMOS_IRPF_ESTATAL_GENERAL_2018 } from "../../normativa/datos/irpf-autonomico-2018"
import { MINIMOS_ESTATALES_2025, type MinimosPersonalesFamiliaresIrpf } from "../../normativa/datos/minimos-autonomicos-2025"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"

const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
const paquetes = new WeakSet<object>()
// Capturas seriales privadas de datos productivos; jamás se exponen sus Decimal.
const madrid = MADRID_2018_2021.map(r => ({ baseInferior: r.baseInferior.toFixed(), cuota: r.cuota.toFixed(), tipo: r.tipo.toFixed() }))
// La tabla estatal productiva expresa límites superiores y tipos, sin cuotas fijas.
// Su integral decimal exacta coincide con matriz2018; no transcribe otra tabla.
const estatal = (() => {
  let inferior = new D(0), cuota = new D(0)
  return TRAMOS_IRPF_ESTATAL_GENERAL_2018.map(([limite, tipo]) => {
    const fila = { baseInferior: inferior.toFixed(), cuota: cuota.toFixed(), tipo: tipo.toFixed() }
    cuota = cuota.plus(new D(limite).minus(inferior).mul(tipo)); inferior = new D(limite)
    return fila
  })
})()
function convertirMinimos<T>(hoja: (s: Decimal) => T, m = MINIMOS_ESTATALES_2025) {
  const discapacidad = (g: typeof m.discapacidad.contribuyente) => Object.freeze({ grado33Hasta65: hoja(g.grado33Hasta65), grado65OMas: hoja(g.grado65OMas), gastosAsistencia: hoja(g.gastosAsistencia) })
  return Object.freeze({
    contribuyente: Object.freeze({ general: hoja(m.contribuyente.general), adicionalMayor65: hoja(m.contribuyente.adicionalMayor65), adicionalMayor75: hoja(m.contribuyente.adicionalMayor75) }),
    descendientes: Object.freeze({ primero: hoja(m.descendientes.primero), segundo: hoja(m.descendientes.segundo), tercero: hoja(m.descendientes.tercero), cuartoYSiguientes: hoja(m.descendientes.cuartoYSiguientes), adicionalMenorTres: hoja(m.descendientes.adicionalMenorTres) }),
    ascendientes: Object.freeze({ mayor65OConDiscapacidad: hoja(m.ascendientes.mayor65OConDiscapacidad), adicionalMayor75: hoja(m.ascendientes.adicionalMayor75) }),
    discapacidad: Object.freeze({ contribuyente: discapacidad(m.discapacidad.contribuyente), descendiente: discapacidad(m.discapacidad.descendiente), ascendiente: discapacidad(m.discapacidad.ascendiente) }),
  })
}
const minimosBase = convertirMinimos(s => s.toFixed())
function materializarMinimos(m: typeof minimosBase): MinimosPersonalesFamiliaresIrpf {
  const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
  // SAFETY: la estructura serial privada proviene de convertirMinimos, todas las hojas son decimales.
  return JSON.parse(JSON.stringify(m), (_k, v) => Number.isNaN(Number(v)) ? v : new D(v)) as MinimosPersonalesFamiliaresIrpf
}
/** Paquete completo, serial y sellado; tipos y coeficientes no se indexan. */
export function parametrosMadrid2018(factor: Decimal) {
  const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
  if (!factor.isFinite() || !factor.gt(0)) throw new RangeError("Factor monetario inválido")
  const f = new D(factor)
  const escalar = (filas: ReadonlyArray<(typeof madrid)[number]>) => Object.freeze(filas.map(r => Object.freeze({ baseInferior: new D(r.baseInferior).mul(f).toFixed(), cuota: new D(r.cuota).mul(f).toFixed(), tipo: r.tipo })))
  const p = Object.freeze({ base: 2018 as const, factor: f.toFixed(), gastoGeneral: new D(2000).mul(f).toFixed(),
    minimos: convertirMinimos(s => new D(s).mul(f).toFixed(), materializarMinimos(minimosBase)),
    estatal: escalar(estatal), autonomica: escalar(madrid),
    parametrosArt20: Object.freeze(["3700", "11250", "14450", "5565", "13115", "16825", "6500"].map(base => Object.freeze({ base, derivado: new D(base).mul(f).toFixed(), unidad: "EUR" }))),
  })
  paquetes.add(p); return p
}
export type ParametrosMadrid2018 = ReturnType<typeof parametrosMadrid2018>
export function validarPaqueteMadrid(p: ParametrosMadrid2018): boolean { return paquetes.has(p) }
/** Cada consumo reconstruye Decimal locales: ninguna instancia mutable compartida. */
export function materializarPaqueteMadrid(p: ParametrosMadrid2018) {
  const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
  if (!validarPaqueteMadrid(p)) throw new RangeError("Paquete analítico ajeno a la fábrica")
  const escala = (filas: ReadonlyArray<(typeof madrid)[number]>): EscalaPublicada => filas.map(r => ({ baseInferior: new D(r.baseInferior), cuota: new D(r.cuota), tipo: new D(r.tipo) }))
  return { minimos: materializarMinimos(p.minimos), estatal: escala(p.estatal), autonomica: escala(p.autonomica) }
}
/** Homogeneidad art20: misma operación original en EUR2018; otras rentas cero. */
export function reduccionIndexada2018(previo: Decimal, p: ParametrosMadrid2018) {
  const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
  if (!validarPaqueteMadrid(p)) throw new RangeError("Paquete analítico ajeno a la fábrica")
  const f = new D(p.factor)
  return new D(calcularReduccionTrabajoConOtrasRentas({ anio: 2018, rendimientoPrevioNeto: new D(previo).div(f), otrasRentasNoExentas: new D(0) })).mul(f)
}
