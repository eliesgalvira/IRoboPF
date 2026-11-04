export type { Marco, Pago, Descendiente, Resultado } from "./comun"
export { presentar } from "./comun"
export type { Traslado, Enfermedad, Estudios, Guarderia } from "./canarias"
export {
  evaluarTraslado,
  evaluarEnfermedad,
  evaluarEstudiosNoSuperiores,
  evaluarGuarderia,
} from "./canarias"
export type { Seguros } from "./seguros"
export { evaluarSegurosImpago } from "./seguros"
export type {
  Idiomas,
  TercerSector,
  Discapacidad,
  Conciliacion,
} from "./balears"
export {
  evaluarIdiomas,
  evaluarTercerSector,
  evaluarDiscapacidad,
  evaluarConciliacion,
} from "./balears"

export { EVALUADORES_REUTILIZADOS } from "./reutilizados"
