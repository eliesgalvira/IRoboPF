import { Schema } from "effect"
import { HechoInvalido } from "../asturias-cantabria-hechos-2025/comun"
import { marco, type MarcoB, type ResultadoAmpliacion } from "./comun"
import { evaluarFamilia, type HechosFamilia } from "./familia"
import { evaluarVivienda, type HechosVivienda } from "./vivienda"
import { evaluarTrabajo, type HechosTrabajo } from "./trabajo"
import { evaluarInversion, type HechosInversion } from "./inversion"
export type {
  ResultadoAmpliacion,
  MarcoB,
  Persona,
  Reparto,
  ResolucionB,
  PagoB,
  Intervalo,
  Vivienda,
  DependenciaAnual,
  RegimenPosterior,
  Uso,
} from "./comun"
export type {
  Descendiente,
  TituloNumerosa,
  MonoparentalAst,
  HechosFamilia,
} from "./familia"
export type { Colectivo, HechosVivienda } from "./vivienda"
export type {
  HechosTrabajo,
  Trabajo,
  Traslado,
  Residencia,
  Cualificacion,
} from "./trabajo"
export type {
  Empresa,
  Participacion,
  OperacionNueva,
  HechosInversion,
  EntidadDonataria,
} from "./inversion"
export type HechosAmpliacionB =
  | HechosFamilia
  | HechosVivienda
  | HechosTrabajo
  | HechosInversion
export { resolverDependenciaAnualB } from "./magnitudes-anuales"
export type { MagnitudAnualB } from "./magnitudes-anuales"

/** Entrada tipada pura. La frontera I/O debe decodificar su unión; no es un parser de JSON. */
export function evaluarAmpliacionB2025(
  m: MarcoB,
  h: HechosAmpliacionB
): ResultadoAmpliacion {
  try {
    marco(m, h.codigo.startsWith("asturias_") ? "asturias" : "cantabria")
    switch (h.codigo) {
      case "asturias_adopcion_internacional":
      case "asturias_partos_multiples_adopciones_misma_fecha":
      case "asturias_familias_numerosas":
      case "asturias_familias_monoparentales":
      case "asturias_centros_cero_tres":
      case "asturias_libros_texto_material_escolar":
      case "asturias_cuidado_descendientes_hasta_25":
      case "asturias_descendiente_fallecimiento_progenitor_accidente_laboral":
      case "asturias_enfermedad_celiaca":
      case "cantabria_cuidado_familiares":
      case "cantabria_acogimiento_familiar_menores":
      case "cantabria_gastos_guarderia":
      case "cantabria_guarderia_municipios_riesgo_despoblamiento":
        return evaluarFamilia(m, h)
      case "asturias_vivienda_discapacidad":
      case "asturias_arrendamiento_vivienda_habitual":
      case "asturias_vivienda_determinados_colectivos":
      case "asturias_gastos_arrendamiento_viviendas":
      case "cantabria_arrendamiento_municipios_riesgo_despoblamiento":
      case "cantabria_obras_mejora":
      case "cantabria_arrendamiento_viviendas_vacias":
        return evaluarVivienda(m, h)
      case "asturias_segundo_sucesivos_hijos_concejos_despoblamiento":
      case "asturias_autonomos_concejos_despoblamiento":
      case "asturias_transporte_publico_despoblamiento":
      case "asturias_formacion_trabajos_cualificados_idi":
      case "asturias_traslado_domicilio_fiscal_motivos_laborales":
      case "asturias_vehiculos_electricos":
      case "asturias_emancipacion_jovenes_hasta_35":
      case "asturias_ayudas_ela":
      case "cantabria_traslado_residencia_motivos_laborales_despoblamiento":
      case "cantabria_residencia_municipio_riesgo_despoblamiento":
      case "cantabria_ayuda_domestica":
      case "cantabria_desplazamiento_permanencia_nuevos_residentes":
        return evaluarTrabajo(m, h)
      case "asturias_inversion_entidades_nuevas_reciente_creacion":
      case "cantabria_inversion_entidades_nuevas_reciente_creacion":
      case "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad":
      case "cantabria_inversiones_donaciones_economia_social":
      case "cantabria_inversiones_nuevos_contribuyentes_extranjero":
        return evaluarInversion(m, h)
    }
  } catch (e) {
    if (Schema.is(HechoInvalido)(e))
      return { estado: "no_soportado", motivo: e.message, rastro: [e.message] }
    throw e
  }
}
