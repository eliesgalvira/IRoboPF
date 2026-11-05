import {
  nacimiento,
  numerosa,
  cuidados,
  mensual,
  acogida,
  actividad,
} from "./familia"
import type {
  Nacimiento,
  FamiliaNumerosa,
  Cuidados,
  Mensual,
  AcogidaRioja,
  ActividadRural,
} from "./familia"
import { alquiler, suministros } from "./alquiler-suministros"
import type { Alquiler, Suministros } from "./alquiler-suministros"
import { inversion, mab } from "./inversion"
import type { Inversion, Mab } from "./inversion"
import {
  renovables,
  historicos,
  eficiencia,
  aldeas,
  vacias,
  adecuacion,
} from "./vivienda-galicia"
import type {
  Instalacion,
  Historico,
  Eficiencia,
  Aldea,
  ViviendasVacias,
  Adecuacion,
} from "./vivienda-galicia"
import { viviendaRioja, intereses } from "./vivienda-rioja"
import type { ViviendaH, Intereses } from "./vivienda-rioja"
import { ayudas, libros } from "./ayudas-libros"
import type { Ayudas, Libros } from "./ayudas-libros"
import { electrico, mecenazgo, patrimonio } from "./rioja-otros"
import type { Electrico, Mecenazgo, Patrimonio } from "./rioja-otros"
import { proteger } from "./comun"
import type { Contexto, Resultado } from "./comun"
export type HechosAmpliacionE2025 =
  | Nacimiento
  | FamiliaNumerosa
  | Cuidados
  | Mensual
  | AcogidaRioja
  | ActividadRural
  | Alquiler
  | Suministros
  | Inversion
  | Mab
  | Instalacion
  | Historico
  | Eficiencia
  | Aldea
  | ViviendasVacias
  | Adecuacion
  | ViviendaH
  | Intereses
  | Ayudas
  | Libros
  | Electrico
  | Mecenazgo
  | Patrimonio
/** Despacho interno de las38 ramas añadidas. No modifica el dispatcher del producto.
 * Atribución por titular, también con magnitudes de declaración conjunta: no es
 * total de conjunta ni cuota aplicada. Pagos incluyen expediente común exhaustivo. */
export function evaluarAmpliacionE2025(
  c: Contexto,
  h: HechosAmpliacionE2025
): Resultado {
  return proteger(() => {
    switch (h.codigo) {
      case "galicia_nacimiento_adopcion_hijos":
      case "rioja_nacimiento_adopcion_hijos":
        return nacimiento(c, h)
      case "galicia_familia_numerosa":
        return numerosa(c, h)
      case "galicia_cuidado_hijos_menores":
      case "rioja_escuelas_infantiles_pequenos_municipios":
      case "rioja_hijo_0_3_escolarizado":
        return cuidados(c, h)
      case "rioja_hijo_0_3_pequenos_municipios":
        return mensual(c, h)
      case "rioja_menor_acogimiento_guarda_adopcion":
        return acogida(c, h)
      case "rioja_fijacion_poblacion_ocupada_medio_rural":
        return actividad(c, h)
      case "galicia_alquiler_vivienda_habitual":
      case "rioja_arrendamiento_menores_36":
        return alquiler(c, h)
      case "rioja_internet_jovenes_emancipados":
      case "rioja_luz_gas_jovenes_emancipados":
        return suministros(c, h)
      case "galicia_inversion_entidades_nuevas_reciente_creacion":
      case "galicia_inversion_entidades_nuevas_financiacion":
      case "galicia_inversion_empresas_agrarias":
        return inversion(c, h)
      case "galicia_inversion_mab":
        return mab(c, h)
      case "galicia_climatizacion_agua_caliente_renovables":
        return renovables(c, h)
      case "galicia_rehabilitacion_centros_historicos":
        return historicos(c, h)
      case "galicia_obras_eficiencia_energetica":
        return eficiencia(c, h)
      case "galicia_aldeas_modelo":
        return aldeas(c, h)
      case "galicia_arrendamiento_viviendas_vacias":
        return vacias(c, h)
      case "galicia_adecuacion_inmueble_vacio_arrendamiento":
        return adecuacion(c, h)
      case "rioja_vivienda_habitual_pequenos_municipios":
      case "rioja_inversion_vivienda_jovenes_menores_36":
      case "rioja_obras_rehabilitacion_vivienda_habitual":
      case "rioja_adquisicion_construccion_vivienda_jovenes":
      case "rioja_segunda_vivienda_medio_rural":
      case "rioja_adecuacion_vivienda_discapacidad":
        return viviendaRioja(c, h)
      case "rioja_paliar_subida_intereses_hipotecarios":
        return intereses(c, h)
      case "galicia_ayudas_incendios_peifoga_2025":
      case "galicia_ayudas_deportistas_alto_nivel":
      case "galicia_ayudas_ela_fenotipos":
      case "galicia_ayudas_talidomida":
        return ayudas(c, h)
      case "galicia_libros_texto_material_escolar":
        return libros(c, h)
      case "rioja_vehiculos_electricos_nuevos":
        return electrico(c, h)
      case "rioja_donaciones_fomento_mecenazgo":
        return mecenazgo(c, h)
      case "rioja_cantidades_patrimonio_historico":
        return patrimonio(c, h)
      default:
        return {
          estado: "no_soportado",
          motivos: [
            "Código desconocido o perteneciente a la primera entrega revisada;resolver desde raíz,sin fórmula duplicada",
          ],
        }
    }
  })
}
export type {
  Contexto,
  Resultado,
  Exacto,
  MagnitudAnual,
  ClaveAnual,
  Documento,
  Pago,
  Persona,
} from "./comun"
