import Decimal from "decimal.js"

import type { Composicion } from "./especificacion"
import { ComposicionNoResuelta } from "./excepciones"
import type {
  ExtraccionTabla,
  ValorDelManual,
  ValorExtraido,
} from "./resultado"
import {
  mismoValor,
  type ClaveEscala,
  type ColumnaEscala,
  type Valor,
} from "./vocabulario"

const COLUMNAS: ReadonlyArray<ColumnaEscala> = [
  "base-liquidable",
  "cuota-integra",
  "resto-base-liquidable",
  "tipo-aplicable",
]
const SE_SUMAN: ReadonlySet<ColumnaEscala> = new Set([
  "cuota-integra",
  "tipo-aplicable",
])

const texto = (valor: Valor) =>
  valor._tag === "Numero" ? valor.decimal : valor.centinela

export interface Compuesto {
  readonly clave: ClaveEscala
  readonly valor: ValorDelManual
}

// Las celdas de una escala por tramo y columna, desde su primera clave: en una
// escala todas las claves de un valor comparten tramo y columna.
const celdasDe = (extraccion: ExtraccionTabla) =>
  new Map(
    extraccion.valores.flatMap(
      (valor): ReadonlyArray<[string, ValorExtraido]> => {
        const [clave] = valor.claves
        return clave !== undefined && typeof clave.fila === "number"
          ? [[`${clave.fila}|${clave.columna}`, valor]]
          : []
      }
    )
  )

const tramosDe = (celdas: ReadonlyMap<string, ValorExtraido>) =>
  new Set(Array.from(celdas.keys(), (clave) => Number(clave.split("|")[0])))

// Compone la escala `resultado` como la suma, tramo a tramo, de las dos
// escalas `sumandos`. Antes de sumar comprueba que las dos se extrajeron sin
// excepciones y tienen los mismos tramos, todas sus celdas y las mismas bases
// y restos; si algo falla, no da ningún valor y devuelve
// ComposicionNoResuelta con todas las claves que habría dado.
export const componer = (
  composicion: Composicion,
  extracciones: ReadonlyArray<ExtraccionTabla>
): {
  readonly valores: ReadonlyArray<Compuesto>
  readonly excepcion: ComposicionNoResuelta | null
} => {
  const { territorio, magnitud } = composicion.resultado
  const [tablaA, tablaB] = composicion.sumandos
  const a = extracciones.find((e) => e.tabla === tablaA)
  const b = extracciones.find((e) => e.tabla === tablaB)
  const celdasA =
    a === undefined ? new Map<string, ValorExtraido>() : celdasDe(a)
  const celdasB =
    b === undefined ? new Map<string, ValorExtraido>() : celdasDe(b)
  const tramos = Array.from(
    new Set([...tramosDe(celdasA), ...tramosDe(celdasB)])
  ).sort((x, y) => x - y)
  const claveDe = (fila: number, columna: ColumnaEscala): ClaveEscala => ({
    territorio,
    magnitud,
    fila,
    columna,
  })
  const fallo = (tramo: number | null, motivo: string) => ({
    valores: [],
    excepcion: new ComposicionNoResuelta({
      resultado: `${territorio}|${magnitud}`,
      tramo,
      motivo,
      claves: tramos.flatMap((fila) => COLUMNAS.map((c) => claveDe(fila, c))),
    }),
  })
  if (a === undefined || b === undefined) {
    return fallo(
      null,
      `no hay extracción de la tabla «${a === undefined ? tablaA : tablaB}»`
    )
  }
  const conExcepciones = [a, b].find((e) => e.excepciones.length > 0)
  if (conExcepciones !== undefined) {
    return fallo(
      null,
      `la tabla «${conExcepciones.tabla}» tiene excepciones de extracción: ${conExcepciones.excepciones.map((e) => e._tag).join(", ")}`
    )
  }
  const valores: Array<Compuesto> = []
  for (const fila of tramos) {
    for (const columna of COLUMNAS) {
      const deA = celdasA.get(`${fila}|${columna}`)
      const deB = celdasB.get(`${fila}|${columna}`)
      if (deA === undefined || deB === undefined) {
        return fallo(
          fila,
          `falta la celda ${columna} de «${deA === undefined ? tablaA : tablaB}»`
        )
      }
      if (deA.unidad !== deB.unidad) {
        return fallo(fila, `${columna} tiene unidades distintas`)
      }
      let valor: Valor
      if (!SE_SUMAN.has(columna)) {
        if (!mismoValor(deA.valor, deB.valor)) {
          return fallo(
            fila,
            `${columna} distinta: ${texto(deA.valor)} en «${tablaA}» y ${texto(deB.valor)} en «${tablaB}»`
          )
        }
        valor = deA.valor
      } else if (deA.valor._tag === "Numero" && deB.valor._tag === "Numero") {
        valor = {
          _tag: "Numero",
          decimal: new Decimal(deA.valor.decimal)
            .plus(deB.valor.decimal)
            .toFixed(),
        }
      } else {
        return fallo(fila, `${columna} no es un número en las dos tablas`)
      }
      valores.push({
        clave: claveDe(fila, columna),
        valor: {
          _tag: "DerivadoDelManual",
          unidad: deA.unidad,
          valor,
          regla: SE_SUMAN.has(columna)
            ? "suma de los dos sumandos"
            : "igual en los dos sumandos",
          fuentes: [
            {
              tabla: tablaA,
              ubicacion: deA.ubicacion,
              valor: deA.valor,
              testigo: deA.testigo._tag,
            },
            {
              tabla: tablaB,
              ubicacion: deB.ubicacion,
              valor: deB.valor,
              testigo: deB.testigo._tag,
            },
          ],
        },
      })
    }
  }
  return { valores, excepcion: null }
}
