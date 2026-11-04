import type { Marco, Pago, Resultado } from "./comun"
import {
  D,
  evaluar,
  exigir,
  fecha,
  texto,
  unico,
  positivo,
  pagos,
  limiteRenta,
  parcial,
} from "./comun"
export type Seguros = Marco & {
  viviendas: readonly {
    catastro: string
    territorio: "canarias" | "illes-balears"
    arrendatario: string
    inicio: string
    finInicial: string
    destino: "vivienda"
    fianzaDeposito: string
    rendimiento: "capital_inmobiliario"
    rentaMensual: string
    certificadoObligacionesFiscales: string
    poliza: string
    cobertura: "impago_rentas"
    gastos: readonly Pago[]
  }[]
}
export function evaluarSegurosImpago(h: Seguros): Resultado {
  return evaluar(h, h.territorio, () => {
    exigir(
      h.territorio === "canarias" || h.territorio === "illes-balears",
      "Territorio desconocido"
    )
    if (h.territorio === "illes-balears") limiteRenta(h, 52800)
    unico(h.viviendas.map((v) => v.catastro))
    unico(h.viviendas.flatMap((v) => v.gastos.map((p) => p.id)))
    const base = h.viviendas.reduce((s, v) => {
      texto(v.arrendatario)
      texto(v.fianzaDeposito)
      texto(v.poliza)
      fecha(v.inicio)
      fecha(v.finInicial)
      exigir(
        v.cobertura === "impago_rentas",
        "Póliza sin cobertura de impago identificada"
      )
      exigir(
        v.inicio.slice(5) !== "02-29",
        "Contrato iniciado en 29 de febrero: aniversario pendiente de rama específica"
      )
      exigir(
        v.territorio === h.territorio &&
          v.destino === "vivienda" &&
          v.rendimiento === "capital_inmobiliario",
        "Inmueble, destino o rendimiento excluido"
      )
      exigir(
        v.inicio <= h.devengo &&
          v.finInicial >=
            `${Number(v.inicio.slice(0, 4)) + 1}${v.inicio.slice(4)}`,
        "Contrato inicial inferior a un año o posterior al devengo"
      )
      if (h.territorio === "canarias") {
        exigir(
          positivo(v.rentaMensual).lte(800),
          "Alquiler mensual superior a 800"
        )
        texto(v.certificadoObligacionesFiscales)
      }
      return s.plus(pagos(h, v.gastos))
    }, new D(0))
    return parcial(
      D.min(base.times("0.75"), h.territorio === "canarias" ? 150 : 440),
      [
        "Primas de impago: 75% agregado; límite por contribuyente",
        h.territorio === "canarias"
          ? "Art.15 quater; BOC 235/2018"
          : "Art.4 quater.1",
      ],
      [
        "Pólizas de impago y depósito de fianza sujetos a cotejo particular",
        "Excluir reutilización de los mismos pagos en adecuación del inmueble",
      ]
    )
  })
}
