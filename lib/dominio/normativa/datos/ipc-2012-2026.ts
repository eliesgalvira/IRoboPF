import type { AnioFiscal } from "../anio-fiscal"
import { crearImporteMonetario } from "../../dinero/importe-monetario"

/** Tasas observadas diciembre/diciembre. 2026 aún no es una observación. */
export const IPC_ANUAL_DICIEMBRE: Readonly<
  Record<
    Exclude<AnioFiscal, 2012 | 2026>,
    ReturnType<typeof crearImporteMonetario>
  > &
    Partial<Record<number, ReturnType<typeof crearImporteMonetario>>>
> = {
  2013: crearImporteMonetario("0.003"),
  2014: crearImporteMonetario("-0.010"),
  2015: crearImporteMonetario("0.000"),
  2016: crearImporteMonetario("0.016"),
  2017: crearImporteMonetario("0.011"),
  2018: crearImporteMonetario("0.012"),
  2019: crearImporteMonetario("0.008"),
  2020: crearImporteMonetario("-0.005"),
  2021: crearImporteMonetario("0.065"),
  2022: crearImporteMonetario("0.057"),
  2023: crearImporteMonetario("0.031"),
  2024: crearImporteMonetario("0.028"),
  2025: crearImporteMonetario("0.029"),
}

export const ESCENARIO_IPC_2026_LEGACY = {
  id: "legacy-diciembre-2026-3pct",
  estado: "escenario",
  tasaDiciembre: "0.030",
  horizonte: "2026-12",
  fechaCorte: "2026-10-29",
  autor: "no-acreditado",
  responsableClasificacion: "IRoboPF",
  metodo: "hipotesis-fija-heredada",
  origen: "Calculo_Salario_IRPF.py",
  nota: "La fecha de corte corresponde a esta clasificación; no acredita fecha ni autor de emisión de la hipótesis. No es una observación INE.",
} as const
