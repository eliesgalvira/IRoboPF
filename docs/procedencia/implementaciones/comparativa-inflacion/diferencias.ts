import { Console, Effect } from "effect"
import python from "./python.json"
import { construirTablaComparativaInflacionCompatible } from "../../../../lib/dominio/compatibilidad-legacy/progresividad-frio"
const diferencias = Array.from(
  construirTablaComparativaInflacionCompatible().filas
).flatMap((fila, i) =>
  fila.flatMap((valor, j) =>
    valor === python.filas[i][j]
      ? []
      : [
          {
            fila: i + 2,
            columna: j + 1,
            anio: fila[0],
            salario: fila[1],
            actual: valor,
            python: python.filas[i][j],
          },
        ]
  )
)
Effect.runSync(
  Console.log(
    JSON.stringify({ total: diferencias.length, diferencias }, null, 2)
  )
)
