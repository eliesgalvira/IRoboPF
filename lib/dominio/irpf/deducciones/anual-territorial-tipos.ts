import type { SolicitudCuidadoCyl81 } from "../maternidad-2025/contrato"
import type { SolicitudE38Anual2025 } from "./galicia-rioja-ampliacion-2025/anual-esquemas"
import type { SolicitudD51 } from "./d51-anual-esquemas"
import type { SolicitudAnualF2025 } from "./territorial-f-ampliacion-2025/anual-esquemas"
import type { SolicitudAnualC36 } from "./canarias-balears-hechos-2025/anual-esquemas"
import type { SolicitudAragonDosAnual2025 } from "./aragon-dos-anual-esquemas"
import type { SolicitudBAmpliadoAnual } from "./b-ampliado-anual-2025"
import type { SolicitudAmpliacionAnualA2025 } from "./ampliacion-a-anual-esquemas"
import type { SolicitudCatalunyaHechos2025 } from "./catalunya-hechos-2025"
import type { HechosB } from "./asturias-cantabria-hechos-2025"
import type * as C from "./canarias-balears-hechos-2025"
import type * as CLM from "./castilla-la-mancha-hechos-2025"
import type * as CYL from "./castilla-y-leon-hechos-2025"
import type * as EXT from "./extremadura-hechos-2025"
import type { HechosE2025 } from "./galicia-rioja-hechos-2025"
import type { HechosTerritorialesF } from "./territorial-f-esquemas-2025"
type Quitar<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never
export type HechosAnualesTerritoriales =
  | SolicitudCuidadoCyl81
  | SolicitudE38Anual2025
  | SolicitudD51
  | SolicitudAnualF2025
  | SolicitudAnualC36
  | SolicitudAragonDosAnual2025
  | SolicitudBAmpliadoAnual
  | SolicitudAmpliacionAnualA2025
  | {
      lote: "A"
      hechos: Quitar<
        SolicitudCatalunyaHechos2025,
        | "ejercicio"
        | "territorio"
        | "modalidad"
        | "contribuyente"
        | "devengo"
        | "cuotaIntegraAutonomicaCentimos"
        | "cuotaIntegraAutonomicaEuros"
      >
    }
  | { lote: "B"; hechos: Quitar<HechosB, "baseLiquidableMenosMinimo"> }
  | {
      lote: "E"
      hechos: Quitar<
        HechosE2025,
        | "contexto"
        | "baseImponible"
        | "minimoPersonalFamiliar"
        | "cuotaIntegraAutonomica"
      >
    }
  | {
      lote: "F"
      codigo:
        | "madrid_adopcion_internacional"
        | "murcia_nacimiento_adopcion"
        | "murcia_contribuyentes_discapacidad"
        | "murcia_cristales_lentes_soluciones_limpieza"
        | "murcia_deporte_actividades_saludables"
        | "murcia_enfermedades_raras"
        | "murcia_ensenanza_idiomas"
        | "murcia_gastos_veterinarios"
      hechos: Omit<
        typeof HechosTerritorialesF.Type,
        | "ejercicio"
        | "territorio"
        | "contribuyente"
        | "modalidad"
        | "declarantes"
        | "baseGeneralEUR"
        | "baseAhorroEUR"
      >
    }
  | {
      lote: "C"
      codigo: "canarias_traslado_residencia_otra_isla_trabajo"
      hechos: Omit<C.Traslado, keyof C.Marco>
    }
  | {
      lote: "C"
      codigo: "canarias_gasto_enfermedad"
      hechos: Omit<C.Enfermedad, keyof C.Marco>
    }
  | {
      lote: "C"
      codigo: "canarias_estudios_no_superiores"
      hechos: Omit<C.Estudios, keyof C.Marco>
    }
  | {
      lote: "C"
      codigo: "canarias_custodia_guarderias"
      hechos: Omit<C.Guarderia, keyof C.Marco>
    }
  | {
      lote: "C"
      codigo: "canarias_primas_seguro_impago_arrendamientos"
      hechos: Omit<C.Seguros, keyof C.Marco>
    }
  | {
      lote: "C"
      codigo: "balears_arrendador_vivienda_permanente_primas_seguro"
      hechos: Omit<C.Seguros, keyof C.Marco>
    }
  | {
      lote: "C"
      codigo: "balears_idiomas_extraescolares"
      hechos: Omit<C.Idiomas, keyof C.Marco>
    }
  | {
      lote: "C"
      codigo: "balears_entidades_tercer_sector"
      hechos: Omit<C.TercerSector, keyof C.Marco>
    }
  | {
      lote: "C"
      codigo: "balears_declarantes_discapacidad_o_descendientes_discapacidad"
      hechos: Omit<C.Discapacidad, keyof C.Marco>
    }
  | {
      lote: "C"
      codigo: "balears_conciliacion_menores_6"
      hechos: Omit<C.Conciliacion, keyof C.Marco>
    }
  | {
      lote: "CLM"
      codigo: "clm_discapacidad_contribuyente"
      hechos: typeof CLM.Discapacidad.Type
    }
  | { lote: "CLM"; codigo: "clm_mayores_75"; hechos: typeof CLM.Mayor.Type }
  | {
      lote: "CLM"
      codigo: "clm_nacimiento_adopcion_hijos"
      hechos: typeof CLM.Nacimientos.Type
    }
  | {
      lote: "CLM"
      codigo: "clm_cuidado_ascendientes_mayores_75"
      hechos: typeof CLM.Cuidado.Type
    }
  | {
      lote: "CYL"
      codigo: "cyl_contribuyentes_discapacidad"
      hechos: typeof CYL.Discapacidad.Type
    }
  | {
      lote: "CYL"
      codigo: "cyl_gastos_adopcion"
      hechos: typeof CYL.Adopciones.Type
    }
  | {
      lote: "CYL"
      codigo: "cyl_cuotas_seguridad_social_empleados_hogar"
      hechos: typeof CYL.Cuotas.Type
    }
  | {
      lote: "CYL"
      codigo: "cyl_familia_numerosa"
      hechos: typeof CYL.Familia.Type
    }
  | {
      lote: "EXT"
      codigo: "extremadura_trabajo_dependiente"
      hechos: typeof EXT.Trabajo.Type
    }
  | {
      lote: "EXT"
      codigo: "extremadura_partos_multiples"
      hechos: typeof EXT.Partos.Type
    }
  | {
      lote: "EXT"
      codigo: "extremadura_material_escolar"
      hechos: typeof EXT.Escolar.Type
    }
  | {
      lote: "EXT"
      codigo: "extremadura_enfermos_ela_familiares"
      hechos: typeof EXT.Ela.Type
    }
