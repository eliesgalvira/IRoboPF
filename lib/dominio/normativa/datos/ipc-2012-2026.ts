import { crearImporteMonetario } from "../../dinero/importe-monetario"

export const IPC_ANUAL_DICIEMBRE: Readonly<Record<number, ReturnType<typeof crearImporteMonetario>>> = {
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
  2026: crearImporteMonetario("0.030"),
}
