import { Array as EffectArray, Option } from "effect"

import { fuenteAeatDeduccionesAutonomicas2025 } from "../../fuente-normativa"
import { parametroNormativo } from "../../repositorio-parametros"

import type {
  CatalogoDeduccionesAutonomicasPorComunidad,
  DeduccionAutonomicaCatalogada,
  FichaDeduccionAutonomica,
} from "./tipos"
import { DEDUCCIONES_AUTONOMICAS_2025_FALTANTES_SEGUN_GUIA } from "./helpers"
import { ANDALUCIA_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/andalucia"
import { ARAGON_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/aragon"
import { ASTURIAS_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/asturias"
import { BALEARS_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/illes-balears"
import { CANARIAS_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/canarias"
import { CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/cantabria"
import { CLM_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/castilla-la-mancha"
import { CYL_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/castilla-y-leon"
import { CATALUNYA_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/catalunya"
import { EXTREMADURA_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/extremadura"
import { GALICIA_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/galicia"
import { MADRID_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/madrid"
import { MURCIA_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/murcia"
import { RIOJA_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/la-rioja"
import { VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/comunitat-valenciana"
import { CEUTA_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/ceuta"
import { MELILLA_DEDUCCIONES_AUTONOMICAS_2025 } from "./comunidades/melilla"

export * from "./tipos"
export { DEDUCCIONES_AUTONOMICAS_2025_FALTANTES_SEGUN_GUIA } from "./helpers"
export * from "./comunidades/andalucia"
export * from "./comunidades/aragon"
export * from "./comunidades/asturias"
export * from "./comunidades/illes-balears"
export * from "./comunidades/canarias"
export * from "./comunidades/cantabria"
export * from "./comunidades/castilla-la-mancha"
export * from "./comunidades/castilla-y-leon"
export * from "./comunidades/catalunya"
export * from "./comunidades/extremadura"
export * from "./comunidades/galicia"
export * from "./comunidades/madrid"
export * from "./comunidades/murcia"
export * from "./comunidades/la-rioja"
export * from "./comunidades/comunitat-valenciana"
export * from "./comunidades/ceuta"
export * from "./comunidades/melilla"

type ComunidadCatalogoDeduccionesAutonomicas2025 =
  | keyof typeof DEDUCCIONES_AUTONOMICAS_2025_FALTANTES_SEGUN_GUIA
  | "ceuta"
  | "melilla"

export const DEDUCCIONES_AUTONOMICAS_2025_POR_COMUNIDAD = {
  andalucia: ANDALUCIA_DEDUCCIONES_AUTONOMICAS_2025,
  aragon: ARAGON_DEDUCCIONES_AUTONOMICAS_2025,
  asturias: ASTURIAS_DEDUCCIONES_AUTONOMICAS_2025,
  "illes-balears": BALEARS_DEDUCCIONES_AUTONOMICAS_2025,
  canarias: CANARIAS_DEDUCCIONES_AUTONOMICAS_2025,
  cantabria: CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025,
  "castilla-la-mancha": CLM_DEDUCCIONES_AUTONOMICAS_2025,
  "castilla-y-leon": CYL_DEDUCCIONES_AUTONOMICAS_2025,
  catalunya: CATALUNYA_DEDUCCIONES_AUTONOMICAS_2025,
  extremadura: EXTREMADURA_DEDUCCIONES_AUTONOMICAS_2025,
  galicia: GALICIA_DEDUCCIONES_AUTONOMICAS_2025,
  madrid: MADRID_DEDUCCIONES_AUTONOMICAS_2025,
  murcia: MURCIA_DEDUCCIONES_AUTONOMICAS_2025,
  "la-rioja": RIOJA_DEDUCCIONES_AUTONOMICAS_2025,
  "comunitat-valenciana": VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025,
  ceuta: CEUTA_DEDUCCIONES_AUTONOMICAS_2025,
  melilla: MELILLA_DEDUCCIONES_AUTONOMICAS_2025,
} as const satisfies Record<
  ComunidadCatalogoDeduccionesAutonomicas2025,
  ReadonlyArray<FichaDeduccionAutonomica>
>

const METADATOS_CATALOGO_DEDUCCIONES_AUTONOMICAS_2025 = {
  andalucia: {
    comunidad: "Andalucía",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 2 y 15",
  },
  aragon: {
    comunidad: "Aragón",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 2, 3 y 16",
  },
  asturias: {
    comunidad: "Principado de Asturias",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 3 y 17",
  },
  "illes-balears": {
    comunidad: "Illes Balears",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 130 a 166",
  },
  canarias: {
    comunidad: "Canarias",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 167 a 206",
  },
  cantabria: {
    comunidad: "Cantabria",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 207 a 237",
  },
  "castilla-la-mancha": {
    comunidad: "Castilla-La Mancha",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 6, 7 y 22",
  },
  "castilla-y-leon": {
    comunidad: "Castilla y León",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 7 y 23",
  },
  catalunya: {
    comunidad: "Catalunya",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 7, 8 y 24",
  },
  extremadura: {
    comunidad: "Extremadura",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 8 y 25",
  },
  galicia: {
    comunidad: "Galicia",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 8, 9, 26 y 27",
  },
  madrid: {
    comunidad: "Comunidad de Madrid",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 9, 10 y 28",
  },
  murcia: {
    comunidad: "Región de Murcia",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 10, 11, 29 y 30",
  },
  "la-rioja": {
    comunidad: "La Rioja",
    fuente: "Manual práctico de Renta 2025 Parte 2, páginas 11, 12, 31 y 32",
  },
  "comunitat-valenciana": {
    comunidad: "Comunitat Valenciana",
    fuente:
      "Manual práctico de Renta 2025 Parte 2, páginas 12, 13, 33, 34, 621 y 624",
  },
  ceuta: {
    comunidad: "Ceuta",
    fuente: "Manual práctico de Renta 2025 Parte 2",
  },
  melilla: {
    comunidad: "Melilla",
    fuente: "Manual práctico de Renta 2025 Parte 2",
  },
} as const satisfies Record<
  ComunidadCatalogoDeduccionesAutonomicas2025,
  { readonly comunidad: string; readonly fuente: string }
>

const construirCatalogoDeduccionesAutonomicas2025 = <
  const Comunidad extends ComunidadCatalogoDeduccionesAutonomicas2025,
>(
  comunidad: Comunidad
): CatalogoDeduccionesAutonomicasPorComunidad => ({
  ...METADATOS_CATALOGO_DEDUCCIONES_AUTONOMICAS_2025[comunidad],
  deducciones: DEDUCCIONES_AUTONOMICAS_2025_POR_COMUNIDAD[comunidad],
})

export const CATALOGOS_DEDUCCIONES_AUTONOMICAS_2025_POR_COMUNIDAD =
  Object.fromEntries(
    (
      Object.keys(
        METADATOS_CATALOGO_DEDUCCIONES_AUTONOMICAS_2025
      ) as ReadonlyArray<ComunidadCatalogoDeduccionesAutonomicas2025>
    ).map((comunidad) => [
      comunidad,
      construirCatalogoDeduccionesAutonomicas2025(comunidad),
    ])
  ) as Record<
    ComunidadCatalogoDeduccionesAutonomicas2025,
    CatalogoDeduccionesAutonomicasPorComunidad
  >

/**
 * Catálogo reconocido de deducciones autonómicas del IRPF 2025.
 */
export const CATALOGO_DEDUCCIONES_AUTONOMICAS_2025 = parametroNormativo({
  nombre: "Catálogo reconocido de deducciones autonómicas",
  fuente: fuenteAeatDeduccionesAutonomicas2025,
  valor: CATALOGOS_DEDUCCIONES_AUTONOMICAS_2025_POR_COMUNIDAD,
})

export const DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS = parametroNormativo({
  nombre: "Deducciones autonómicas implementadas",
  valor: Object.values(CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor).flatMap(
    (catalogo) =>
      catalogo.deducciones.filter(
        (deduccion) => deduccion.estado === "implementada"
      )
  ),
  fuente: fuenteAeatDeduccionesAutonomicas2025,
})

export const obtenerDeduccionAutonomicaCatalogada = (
  codigo: string
): Option.Option<DeduccionAutonomicaCatalogada> =>
  EffectArray.findFirst(
    Object.values(CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor).flatMap(
      (comunidad) => comunidad.deducciones
    ),
    (candidata) => candidata.codigo === codigo
  )
