import Decimal from "decimal.js"
import type {
  ContextoDeduccion,
  ResultadoDeduccion,
  HijoCanario,
  EventoMadrid,
  BasesMadrid,
  GastoGuarderia,
} from "./contratos-2025"
import {
  calcularNacimientoCanarioParcial,
  evaluarNacimientoMadrid,
  calcularGuarderiaMurciaParcial,
} from "./contratos-2025"

export const CODIGOS_AUXILIAR_CON_HECHOS = [
  "cantabria_arrendamiento_jovenes_mayores_discapacidad",
  "cantabria_nacimiento_adopcion_hijos",
  "canarias_nacimiento_adopcion_hijos",
  "canarias_familia_numerosa",
  "canarias_discapacidad_mayores_65",
  "canarias_contribuyentes_desempleados",
  "balears_gastos_mayores_65_discapacidad",
  "madrid_nacimiento_adopcion_hijos",
  "murcia_gastos_guarderia",
] as const
export type CodigoAuxiliarConHechos =
  (typeof CODIGOS_AUXILIAR_CON_HECHOS)[number]

/** Los derechos, convivencia, documentación e incompatibilidades siguen siendo
 * aportados externamente. No es una admisión fiscal ni una liquidación. */
type MarcoHechos = {
  readonly contexto: ContextoDeduccion
  readonly declarantes: readonly string[]
  readonly elegibilidadExterna: boolean
}
type NacimientoCantabro = {
  readonly hijo: string
  readonly ejercicio: number
  readonly progenitores: readonly string[]
}
type PersonaCanaria = {
  readonly id: string
  readonly discapacidad: number
  readonly edad: number
}
type DesempleadoCanario = {
  readonly id: string
  readonly mesesDesempleoLegal: number
  readonly percibePrestacion: boolean
  readonly rendimientosTrabajo: number
}
type CuidadoBalear = {
  readonly id: string
  readonly relacion: "contribuyente" | "ascendiente" | "descendiente"
  readonly titulares: readonly string[]
  readonly gastoElegible: number
  readonly ayudas: number
}
export type HechosDeduccionAuxiliar = MarcoHechos &
  (
    | {
        readonly codigo: "cantabria_arrendamiento_jovenes_mayores_discapacidad"
        readonly gastoElegible: number
      }
    | {
        readonly codigo: "cantabria_nacimiento_adopcion_hijos"
        readonly hijos: readonly NacimientoCantabro[]
      }
    | {
        readonly codigo: "canarias_nacimiento_adopcion_hijos"
        readonly hijos: readonly (HijoCanario & {
          readonly ejercicio: number
        })[]
        readonly titulares: readonly string[]
        readonly renta: number
      }
    | {
        readonly codigo: "canarias_familia_numerosa"
        readonly categoria: "general" | "especial"
        readonly discapacidad65: boolean
        readonly titulares: readonly string[]
      }
    | {
        readonly codigo: "canarias_discapacidad_mayores_65"
        readonly personas: readonly PersonaCanaria[]
        readonly renta: number
      }
    | {
        readonly codigo: "canarias_contribuyentes_desempleados"
        readonly personas: readonly DesempleadoCanario[]
        readonly otrasBases: number
      }
    | {
        readonly codigo: "balears_gastos_mayores_65_discapacidad"
        readonly personas: readonly CuidadoBalear[]
        readonly baseImponible: number
      }
    | {
        readonly codigo: "madrid_nacimiento_adopcion_hijos"
        readonly eventos: readonly EventoMadrid[]
        readonly historia: readonly BasesMadrid[]
      }
    | {
        readonly codigo: "murcia_gastos_guarderia"
        readonly gastos: readonly GastoGuarderia[]
        readonly baseImponible: number
      }
  )
export type HechosAuxiliar2025 = readonly HechosDeduccionAuxiliar[]

// Devuelve boolean para no ensanchar los elementos tipados a any[].
function esColeccion<T>(valores: readonly T[]): boolean {
  return Array.isArray(valores)
}
function idsValidos(ids: readonly string[]): boolean {
  return (
    ids.length > 0 &&
    ids.every((id) => id.trim() !== "") &&
    new Set(ids).size === ids.length
  )
}
function cantidadesValidas(valores: readonly number[]): boolean {
  return valores.every((v) => Number.isFinite(v) && v >= 0)
}
function parcial(valor: Decimal.Value): ResultadoDeduccion {
  return {
    estado: "calculo_parcial",
    importe: new Decimal(valor).toDecimalPlaces(2).toNumber(),
    aceptacionFiscal: "pendiente",
    motivo:
      "Cuantía condicionada a elegibilidad externa; sin aceptación fiscal ni límite conjunto por cuota",
  }
}
function insuficiente(): ResultadoDeduccion {
  return {
    estado: "no_soportado",
    motivo: "Hechos ausentes, inválidos o duplicados",
  }
}
function reparto(titulares: readonly string[], hechos: MarcoHechos): Decimal {
  return new Decimal(
    titulares.filter((id) => hechos.declarantes.includes(id)).length
  ).div(titulares.length)
}
function titularesValidos(
  titulares: readonly string[],
  hechos: MarcoHechos
): boolean {
  return (
    idsValidos(titulares) &&
    titulares.some((id) => hechos.declarantes.includes(id))
  )
}

/** API aditiva de aritmética parcial. Cada colección es exhaustiva para la
 * deducción y declaración indicadas; no se reconstruye a partir de contadores. */
export function evaluarHechosAuxiliar2025(
  h: HechosDeduccionAuxiliar
): ResultadoDeduccion {
  const c = h.contexto
  const territorio = h.codigo.startsWith("balears_")
    ? "illes-balears"
    : h.codigo.split("_")[0]
  if (
    c.ejercicio !== 2025 ||
    c.territorio !== territorio ||
    !["individual", "conjunta"].includes(c.modalidad) ||
    !esColeccion(h.declarantes) ||
    !idsValidos(h.declarantes) ||
    !h.declarantes.includes(c.contribuyente) ||
    (c.declarantes !== undefined &&
      (!idsValidos(c.declarantes) ||
        c.declarantes.length !== h.declarantes.length ||
        c.declarantes.some((id) => !h.declarantes.includes(id)))) ||
    (c.modalidad === "individual" && h.declarantes.length !== 1)
  )
    return insuficiente()
  if (h.elegibilidadExterna !== true && h.elegibilidadExterna !== false)
    return insuficiente()
  // La exclusión externa es explícita; nunca se asume a partir de un campo ausente.
  if (!h.elegibilidadExterna) return parcial(0)
  switch (h.codigo) {
    case "cantabria_arrendamiento_jovenes_mayores_discapacidad":
      if (!cantidadesValidas([h.gastoElegible])) return insuficiente()
      return parcial(
        Decimal.min(
          new Decimal(h.gastoElegible).times("0.1"),
          c.modalidad === "conjunta" ? 600 : 300
        )
      )
    case "cantabria_nacimiento_adopcion_hijos": {
      if (!esColeccion(h.hijos)) return insuficiente()
      if (h.hijos.length > 0 && !idsValidos(h.hijos.map((x) => x.hijo)))
        return insuficiente()
      let total = new Decimal(0)
      for (const hijo of h.hijos) {
        if (
          !Number.isInteger(hijo.ejercicio) ||
          !titularesValidos(hijo.progenitores, h) ||
          hijo.progenitores.length > 2 ||
          (c.modalidad === "conjunta" &&
            hijo.progenitores.some((id) => !h.declarantes.includes(id)))
        )
          return insuficiente()
        if (hijo.ejercicio < 2024 || hijo.ejercicio > 2025) continue
        // El tenor literal exige mitad en individual; progenitor único queda fuera
        // de este parcial hasta resolver su interpretación, sin inventar otro titular.
        if (c.modalidad === "individual" && hijo.progenitores.length !== 2)
          return insuficiente()
        total = total.plus(
          new Decimal(1400).times(reparto(hijo.progenitores, h))
        )
      }
      return parcial(total)
    }
    case "canarias_nacimiento_adopcion_hijos": {
      if (!esColeccion(h.hijos) || !esColeccion(h.titulares))
        return insuficiente()
      if (
        !cantidadesValidas([h.renta]) ||
        !titularesValidos(h.titulares, h) ||
        h.titulares.length > 2 ||
        (c.modalidad === "conjunta" &&
          h.titulares.some((id) => !h.declarantes.includes(id)))
      )
        return insuficiente()
      if (h.renta > (c.modalidad === "individual" ? 46455 : 61770))
        return parcial(0)
      if (h.hijos.some((x) => !Number.isInteger(x.ejercicio)))
        return insuficiente()
      const actuales = h.hijos.filter((x) => x.ejercicio === 2025)
      if (
        (h.hijos.length > 0 && !idsValidos(h.hijos.map((x) => x.id))) ||
        new Set(actuales.map((x) => x.orden)).size !== actuales.length ||
        new Set(
          actuales
            .filter((x) => x.ordenDiscapacidad > 0)
            .map((x) => x.ordenDiscapacidad)
        ).size !== actuales.filter((x) => x.ordenDiscapacidad > 0).length
      )
        return insuficiente()
      const resultado = calcularNacimientoCanarioParcial(
        actuales,
        h.titulares,
        h.titulares[0]
      )
      if (!("importe" in resultado)) return resultado
      return parcial(
        new Decimal(resultado.importe).times(
          h.titulares.filter((id) => h.declarantes.includes(id)).length
        )
      )
    }
    case "canarias_familia_numerosa": {
      if (!esColeccion(h.titulares)) return insuficiente()
      if (
        !titularesValidos(h.titulares, h) ||
        (h.discapacidad65 !== true && h.discapacidad65 !== false) ||
        !["general", "especial"].includes(h.categoria)
      )
        return insuficiente()
      const base =
        h.categoria === "general"
          ? h.discapacidad65
            ? 1326
            : 597
          : h.discapacidad65
            ? 1459
            : 796
      return parcial(new Decimal(base).times(reparto(h.titulares, h)))
    }
    case "canarias_discapacidad_mayores_65": {
      if (!esColeccion(h.personas)) return insuficiente()
      if (
        !cantidadesValidas([h.renta]) ||
        !idsValidos(h.personas.map((p) => p.id)) ||
        h.personas.length !== h.declarantes.length ||
        h.personas.some(
          (p) =>
            !h.declarantes.includes(p.id) ||
            !cantidadesValidas([p.edad, p.discapacidad]) ||
            p.discapacidad > 100
        )
      )
        return insuficiente()
      if (h.renta > (c.modalidad === "individual" ? 46455 : 61770))
        return parcial(0)
      return parcial(
        h.personas.reduce(
          (s, p) =>
            s + (p.discapacidad >= 33 ? 400 : 0) + (p.edad > 65 ? 160 : 0),
          0
        )
      )
    }
    case "canarias_contribuyentes_desempleados": {
      if (!esColeccion(h.personas)) return insuficiente()
      if (
        !cantidadesValidas([h.otrasBases]) ||
        !idsValidos(h.personas.map((p) => p.id)) ||
        h.personas.length !== h.declarantes.length ||
        h.personas.some(
          (p) =>
            !h.declarantes.includes(p.id) ||
            !cantidadesValidas([
              p.mesesDesempleoLegal,
              p.rendimientosTrabajo,
            ]) ||
            p.mesesDesempleoLegal > 12 ||
            (p.percibePrestacion !== true && p.percibePrestacion !== false)
        )
      )
        return insuficiente()
      const trabajo = h.personas.reduce(
        (s, p) => s.plus(p.rendimientosTrabajo),
        new Decimal(0)
      )
      if (trabajo.lte(15876) || trabajo.gt(22000) || h.otrasBases > 1600)
        return parcial(0)
      return parcial(
        h.personas.filter(
          (p) => p.mesesDesempleoLegal > 6 && p.percibePrestacion
        ).length * 120
      )
    }
    case "balears_gastos_mayores_65_discapacidad": {
      if (!esColeccion(h.personas)) return insuficiente()
      if (
        !cantidadesValidas([h.baseImponible]) ||
        (h.personas.length > 0 && !idsValidos(h.personas.map((p) => p.id)))
      )
        return insuficiente()
      if (h.baseImponible > (c.modalidad === "individual" ? 33000 : 52800))
        return parcial(0)
      let total = new Decimal(0)
      for (const p of h.personas) {
        if (
          !titularesValidos(p.titulares, h) ||
          !cantidadesValidas([p.gastoElegible, p.ayudas])
        )
          return insuficiente()
        if (
          !["contribuyente", "ascendiente", "descendiente"].includes(p.relacion)
        )
          return insuficiente()
        if (
          p.relacion === "contribuyente" &&
          (!h.declarantes.includes(p.id) ||
            p.titulares.length !== 1 ||
            p.titulares[0] !== p.id)
        )
          return insuficiente()
        const factor =
          p.relacion === "descendiente"
            ? reparto(p.titulares, h)
            : new Decimal(
                p.titulares.filter((id) => h.declarantes.includes(id)).length
              )
        total = total.plus(
          Decimal.min(
            660,
            Decimal.max(0, new Decimal(p.gastoElegible).minus(p.ayudas)).times(
              "0.4"
            )
          ).times(factor)
        )
      }
      return parcial(total)
    }
    case "madrid_nacimiento_adopcion_hijos": {
      if (!esColeccion(h.eventos) || !esColeccion(h.historia))
        return insuficiente()
      if (
        h.eventos.length > 0 &&
        !idsValidos(h.eventos.flatMap((e) => e.hijos))
      )
        return insuficiente()
      let total = new Decimal(0)
      for (const evento of h.eventos) {
        if (
          c.modalidad === "conjunta" &&
          evento.progenitoresConvivientes.some(
            (id) => !h.declarantes.includes(id)
          )
        )
          return insuficiente()
        const resultado = evaluarNacimientoMadrid(
          { ...c, declarantes: h.declarantes },
          evento,
          h.historia
        )
        if (resultado.estado === "no_soportado") return resultado
        if ("importe" in resultado) total = total.plus(resultado.importe)
      }
      return parcial(total)
    }
    case "murcia_gastos_guarderia":
      if (!esColeccion(h.gastos)) return insuficiente()
      if (
        c.modalidad === "conjunta" &&
        h.gastos.some((g) =>
          g.titulares.some((id) => !h.declarantes.includes(id))
        )
      )
        return insuficiente()
      return calcularGuarderiaMurciaParcial(
        { ...c, declarantes: h.declarantes },
        h.gastos,
        h.baseImponible
      )
  }
}
