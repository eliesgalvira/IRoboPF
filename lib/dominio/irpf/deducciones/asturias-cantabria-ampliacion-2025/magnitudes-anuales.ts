import { Schema } from "effect"
import { HechoInvalido } from "../asturias-cantabria-hechos-2025/comun"
import {
  r,
  Racional,
  total,
  exigir,
  marco,
  resultado,
  type DependenciaAnual,
  type ResultadoAmpliacion,
  type MarcoB,
} from "./comun"
export type MagnitudAnualB = {
  readonly ejercicio: 2025
  readonly contribuyente: string
  readonly liquidacion: string
  readonly concepto:
    | "tipo_medio_estatal_2025"
    | "tipo_medio_autonomico_2025"
    | "cuota_integra_autonomica_2025"
    | "cuota_integra_autonomica_2025_trabajo_actividad"
  readonly valor: string
}
function magnitud(
  m: MarcoB,
  xs: readonly MagnitudAnualB[],
  id: string,
  concepto: MagnitudAnualB["concepto"]
): MagnitudAnualB {
  const candidatas = xs.filter(
    (x) => x.contribuyente === id && x.concepto === concepto
  )
  exigir(
    m.declarantes.includes(id) && candidatas.length === 1,
    "Falta magnitud anual única identificada por persona/concepto"
  )
  const x = candidatas[0]
  exigir(
    x.ejercicio === 2025 && x.liquidacion.trim() !== "",
    "Magnitud de otro ejercicio o sin liquidación"
  )
  return x
}
function porcentaje(s: string): Racional {
  exigir(
    /^\d{1,3}(\.\d{1,8})?$/.test(s),
    "Tipo medio porcentual no decimal o de precisión excesiva"
  )
  const [i, f = ""] = s.split(".")
  const x = new Racional(i + f, "1" + "0".repeat(f.length))
  exigir(x.cmp(r("100")) <= 0, "Tipo medio superior100%")
  return x
}
/** Calcula sólo la regla específica ligada a magnitudes anuales. No consume ni
 * duplica la cuota común; ésta se aplica una sola vez en el padre. */
export function resolverDependenciaAnualB(
  m: MarcoB,
  f: DependenciaAnual,
  xs: readonly MagnitudAnualB[]
): ResultadoAmpliacion {
  try {
    marco(m, f.clase === "ela_tipos_medios" ? "asturias" : "cantabria")
    exigir(m.ejercicio === 2025, "Magnitudes sólo2025")
    if (f.clase === "ela_tipos_medios") {
      exigir(
        m.modalidad === "individual",
        "ELA conjunta requiere separación de tipos medios por persona"
      )
      const estatal = magnitud(
          m,
          xs,
          f.contribuyente,
          "tipo_medio_estatal_2025"
        ),
        autonomico = magnitud(
          m,
          xs,
          f.contribuyente,
          "tipo_medio_autonomico_2025"
        )
      exigir(
        estatal.liquidacion === autonomico.liquidacion,
        "Tipos medios de liquidaciones distintas"
      )
      const ayuda = new Racional(
        f.ayudaEnBaseLiquidable.numeradorEuros,
        f.ayudaEnBaseLiquidable.divisor
      )
      exigir(
        ayuda.cmp(r("0")) >= 0,
        "Ayuda integrada en base liquidable negativa"
      )
      return resultado(
        ayuda
          .times(porcentaje(estatal.valor).plus(porcentaje(autonomico.valor)))
          .div(r("100")),
        "Asturias art.14quaterdecies:magnitudes anuales identificadas"
      )
    }
    exigir(
      f.personas.length > 0 && new Set(f.personas).size === f.personas.length,
      "Contribuyentes duplicados en dependencia de cuota"
    )
    const cuotas = f.personas.map((id) =>
      magnitud(
        m,
        xs,
        id,
        f.clase === "residencia_rural_cuota"
          ? "cuota_integra_autonomica_2025"
          : "cuota_integra_autonomica_2025_trabajo_actividad"
      )
    )
    exigir(
      new Set(cuotas.map((c) => c.liquidacion)).size <= 1,
      "Cuotas de liquidaciones distintas"
    )
    const valores = cuotas.map((c) =>
      f.clase === "residencia_rural_cuota"
        ? r(c.valor).times(r("0.20")).min(r("500"))
        : r(c.valor).min(r("500"))
    )
    return resultado(
      total(valores),
      f.clase === "residencia_rural_cuota"
        ? "Cantabria art.2.11.5:20%cuota íntegra por persona hasta500"
        : "Cantabria art.2.11.3:500 por persona limitado por cuota autonómica de trabajo/actividad",
      [
        "Aplicación final contra cuota disponible,orden y compatibilidades quedan en composición común",
      ]
    )
  } catch (e) {
    if (Schema.is(HechoInvalido)(e))
      return { estado: "no_soportado", motivo: e.message, rastro: [e.message] }
    throw e
  }
}
