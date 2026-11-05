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

export type {
  DeclaracionC,
  MagnitudesAnualesC,
  PagoC,
  ResultadoAmpliacionC,
  MinimoC,
} from "./ampliacion-comun"
export type {
  CodigoDonacionC,
  BeneficiarioDonacionC,
  DonacionC,
  SolicitudDonacionesC,
} from "./donaciones-ampliacion"
export { evaluarDonacionesAmpliacionC } from "./donaciones-ampliacion"
export type {
  CodigoViviendaC,
  ViviendaC,
  HistoricoViviendasC,
  SolicitudViviendaC,
} from "./vivienda-ampliacion"
export { evaluarViviendaAmpliacionC } from "./vivienda-ampliacion"
export type {
  CodigoFamiliaEstudiosC,
  PersonaFamiliaC,
  ContribuyenteFamiliaC,
  CuotaHogarC,
  SolicitudFamiliaEstudiosC,
} from "./familia-estudios-ampliacion"
export { evaluarFamiliaEstudiosAmpliacionC } from "./familia-estudios-ampliacion"
export type {
  InversionEntidadC,
  HistoricoInversionC,
  SolicitudInversionC,
  AltaAutonomoC,
  SolicitudAutoocupacionC,
  DestinoPlazaC,
  SolicitudPlazasC,
  MagnitudesEmergenciaC,
  SolicitudEmergenciaC,
} from "./inversion-trabajo-ampliacion"
export {
  evaluarInversionAmpliacionC,
  evaluarAutoocupacionAmpliacionC,
  evaluarPlazasAmpliacionC,
  evaluarEmergenciaAmpliacionC,
} from "./inversion-trabajo-ampliacion"
