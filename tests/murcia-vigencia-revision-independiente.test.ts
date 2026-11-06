import Decimal from "decimal.js"
import { describe, expect, it } from "vitest"
import { aplicarDeduccionesTerritoriales2025 as aplicar, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import type { SolicitudAnualF2025 as Solicitud } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { agua, recarga } from "./revision-f-fixtures"

// Prueba independiente preparada en GRANT0. No ejecutada ni tipada.
const m = (cuota = "100"): MagnitudesTerritorialesAnuales => ({
  caso: { anio: 2025, comunidadAutonoma: "murcia", contribuyenteId: "s-1",
    situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } },
  baseGeneral: new Decimal("20000"), baseAhorro: new Decimal("0"),
  minimoPersonalFamiliar: new Decimal("5550"), sujetosConMinimo: [],
  basesLiquidables: { general: new Decimal("20000"), ahorro: new Decimal("0") },
  cuotaAutonomica: new Decimal(cuota),
})
function carga(): Solicitud {
  const { historialRecarga: _historia, ...s } = recarga()
  expect(_historia).toBeDefined()
  if (s.hechos.pagos === undefined) throw new Error("Fixture sin pagos")
  return { ...s, hechos: { ...s.hechos, pagos: s.hechos.pagos.map(p => ({ ...p, importeEUR: "1000.01" })) } }
}
const vehiculo = (): Solicitud => ({ lote: "F-ampliado", codigo: "murcia_vehiculos_electricos",
  hechos: { residenciaFiscalAdquisicion: "murcia", vehiculos: [{
    id: "veh", adquisicion: "2025-06-01", matriculacion: "2025-06-01", uso: "particular",
    categoria: "M1", tecnologia: "BEV", modalidad: "compraventa", procedencia: "nuevo",
    contrato: "contrato-veh", titular: "s-1", propiedadHastaDevengo: "sin_transmision",
    titularesReparto: ["s-1"], plazas: 5, importeEUR: "1000.01", gastosEUR: "0", tributosEUR: "0", ayudasEUR: "0",
  }] } })
const historiaVehiculo = { codigo: "murcia_vehiculos_electricos" as const, periodos: [2022, 2023, 2024] as const,
  contribuyente: "s-1", referencia: "compatibilidad", operaciones: [] }

function libro(ss: readonly Solicitud[], cuota = "100") { return aplicar({ solicitudes: ss }, m(cuota)) }
function incompleto(s: Solicitud, causa: string) {
  const r = evaluarAnualF2025(s, m())
  expect(r).toMatchObject({ estado: "no_soportado", siguienteHecho: causa })
  expect(r.importe).toBeUndefined()
  expect(r.importeExactoRacional).toBeUndefined()
  const l = libro([agua(), s])
  expect(l).toMatchObject({ completoEnRamasSolicitadas: false })
  expect(l.total).toEqual(racional("60"))
}

describe("Primera revisión independiente: vigencia Murcia, oráculos exactos", () => {
  it("cuota100: agua60, vehículo40 con pendiente260003/1000, recarga pendiente100001/100", () => {
    const ss = [carga(), vehiculo(), agua()]
    for (const orden of [ss, [...ss].reverse(), [ss[1]!, ss[0]!, ss[2]!]]) {
      const l = libro(orden)
      expect(l).toMatchObject({ completoEnRamasSolicitadas: true,
        ordenAplicado: [agua().codigo, vehiculo().codigo, carga().codigo] })
      expect(l.total).toEqual(racional("100"))
      expect(l.disponible).toEqual(racional("0"))
      expect(l.aplicaciones).toMatchObject([
        { codigo: agua().codigo, generado: racional("60"), aplicado: racional("60") },
        { codigo: vehiculo().codigo, generado: racional("300003", "1000"), aplicado: racional("40"), pendiente: racional("260003", "1000"),
          origen: { ejercicio: 2025, contribuyente: "s-1" }, arrastre: { primerEjercicio: 2026, ultimoEjercicio: 2028, saldo: racional("260003", "1000") } },
        { codigo: carga().codigo, generado: racional("100001", "100"), aplicado: racional("0"), pendiente: racional("100001", "100"),
          arrastre: { primerEjercicio: 2026, ultimoEjercicio: 2028, saldo: racional("100001", "100") } },
      ])
    }
  })
  it.each(["0", "100", "2000"])("compatibilidad de ambos censos vacíos con cuota%s", cuota => {
    const vacio = recarga().historialRecarga!
    const sin = libro([carga(), vehiculo()], cuota)
    const con = libro([{ ...carga(), historialRecarga: vacio }, { ...vehiculo(), historialSaldosIncentivoMurcia: historiaVehiculo }], cuota)
    expect(con).toEqual(sin)
    expect(sin).toMatchObject({ completoEnRamasSolicitadas: true })
  })
  it.each([2022, 2023, 2024] as const)("antecedentes%s de ambos incentivos no generan importe ni cero fiscal", ejercicioOrigen => {
    incompleto({ ...carga(), historialRecarga: { ...recarga().historialRecarga!, infraestructuras: [{ objetoId: "previa", ejercicioOrigen, referencia: "documento" }] } }, "historialRecarga.sin_vigencia_anterior_2025")
    incompleto({ ...vehiculo(), historialSaldosIncentivoMurcia: { ...historiaVehiculo, operaciones: [{ objetoId: "previo", ejercicioOrigen, referencia: "documento" }] } }, "historialSaldosIncentivoMurcia.sin_vigencia_anterior_2025")
  })
  it("censo vacío de otro titular sigue siendo contradicción", () => {
    incompleto({ ...carga(), historialRecarga: { ...recarga().historialRecarga!, contribuyente: "otro" } }, "historialRecarga.contribuyente")
    incompleto({ ...vehiculo(), historialSaldosIncentivoMurcia: { ...historiaVehiculo, contribuyente: "otro" } }, "historialSaldosIncentivoMurcia:murcia_vehiculos_electricos")
  })
  it("referencia vacía no equivale a ausencia del formato anterior", () => {
    incompleto({ ...carga(), historialRecarga: { ...recarga().historialRecarga!, referencia: "" } }, "historialRecarga.referencia")
    incompleto({ ...vehiculo(), historialSaldosIncentivoMurcia: { ...historiaVehiculo, referencia: "" } }, "historialSaldosIncentivoMurcia.referencia")
  })
  it("censo vacío con incentivo cruzado o periodos incompletos no habilita vehículo", () => {
    incompleto({ ...vehiculo(), historialSaldosIncentivoMurcia: { ...historiaVehiculo, codigo: "murcia_instalaciones_recursos_energeticos_renovables" } }, "historialSaldosIncentivoMurcia:murcia_vehiculos_electricos")
    for (const periodos of [[2022, 2023], [2022, 2022, 2024]] as const)
      incompleto({ ...vehiculo(), historialSaldosIncentivoMurcia: { ...historiaVehiculo, periodos } }, "historialSaldosIncentivoMurcia.periodos")
  })
  it("renovables mantiene su causa concreta de historia, sin confundirla con hechos vacíos", () => {
    incompleto({ lote: "F-ampliado", codigo: "murcia_instalaciones_recursos_energeticos_renovables", hechos: {} }, "historialSaldosIncentivoMurcia:murcia_instalaciones_recursos_energeticos_renovables")
  })
  it("la reserva F-N01 de35000 permanece al retirar la guardia de historia", () => {
    const magnitudes = m()
    const r = evaluarAnualF2025(vehiculo(), { ...magnitudes, baseGeneral: new Decimal("35000") })
    expect(r.estado).not.toBe("calculo_parcial")
    expect(r.importe).toBeUndefined()
  })
})
