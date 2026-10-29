import { DEDUCCIONES_AUTONOMICAS_2025_POR_COMUNIDAD } from "../../normativa/datos/deducciones-autonomicas-2025"
import type { EntradasDeduccionesAutonomicas } from "../deducciones-autonomicas-aplicadas"

export type AmbitoDeducciones = {
  readonly ejercicio: number
  readonly territorio: string
}

export function territorioDeCodigo(codigo: string): string {
  for (const [territorio, fichas] of Object.entries(
    DEDUCCIONES_AUTONOMICAS_2025_POR_COMUNIDAD
  )) {
    if (fichas.some((ficha) => ficha.codigo === codigo)) return territorio
  }
  return "sin-catalogo"
}

function prefijoEspecifico(territorio: string): string {
  switch (territorio) {
    case "castilla-la-mancha":
      return "clm"
    case "castilla-y-leon":
      return "cyl"
    default:
      return territorio
  }
}

/** Adaptador de aritmética parcial heredada; no evalúa requisitos fiscales. */
export function filtrarEntradasPorAmbito(
  entradas: EntradasDeduccionesAutonomicas,
  ambito: AmbitoDeducciones
): EntradasDeduccionesAutonomicas {
  if (ambito.ejercicio !== 2025)
    throw new RangeError("Catálogo no soportado para este ejercicio")
  if (
    !Object.keys(DEDUCCIONES_AUTONOMICAS_2025_POR_COMUNIDAD).includes(
      ambito.territorio
    )
  )
    throw new RangeError("Territorio sin catálogo soportado")
  return Object.fromEntries(
    Object.entries(entradas).filter(([clave, valor]) => {
      const codigo = clave.split(":")[0]
      const pertenece = clave.includes(":")
        ? territorioDeCodigo(codigo) === ambito.territorio
        : clave.startsWith(prefijoEspecifico(ambito.territorio))
      if (!pertenece) return false
      if (Number.isNaN(valor) || valor === Infinity || valor === -Infinity)
        throw new RangeError("Importe no finito")
      if (
        clave.endsWith(":unidades") &&
        (!Number.isInteger(valor) || Number(valor) < 0)
      )
        throw new RangeError("Personas deben ser enteras y no negativas")
      return true
    })
  )
}
