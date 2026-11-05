import type { RastroCalculo } from "../../explicacion/rastro-calculo"
import type { LibroMaternidad81 } from "./producir"
import type { Racional } from "../deducciones/anual-territorial-racional"

function exacto(x: Racional): string { return x.numeradorEuros+"/"+x.divisor+" EUR" }
export function formulaAjuste81(libro: LibroMaternidad81 | undefined): string {
  return libro===undefined?"":" - ("+exacto(libro.maternidad)+") - ("+exacto(libro.incremento)+") + ("+exacto(libro.anticipos)+")"
}
export function pasosMaternidad81(libro: LibroMaternidad81 | undefined): RastroCalculo["pasos"] {
  if(libro===undefined)return []
  return [{
    _tag:"PasoExplicacion",titulo:"Maternidad y custodia en guardería (art.81)",
    descripcion:"Maternidad e incremento minoran el resultado de la declaración; los anticipos efectivamente cobrados se regularizan por separado. Cálculo condicionado a los hechos, sin acreditación automática de documentos.",
    lineasCalculo:[
      {etiqueta:"Maternidad devengada",formula:"100 EUR por mes del calendario de cada hijo",resultado:exacto(libro.maternidad)},
      {etiqueta:"Incremento por custodia",formula:"Por hijo: menor de 1000 × meses completos / 12 y gasto anual neto",resultado:exacto(libro.incremento)},
      {etiqueta:"Anticipos modelo140 cobrados",formula:"Cobros2025 identificados, sin anticipar guardería",resultado:exacto(libro.anticipos)},
    ],fuentes:[],
  }]
}
