import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { SolicitudAnualF2025 as Solicitud } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { agua, efectivo, recarga } from "./revision-f-fixtures"

function recargaSinHistorial(): Solicitud {
  const { historialRecarga, ...solicitud } = recarga()
  expect(historialRecarga?.infraestructuras).toEqual([])
  return solicitud
}
const vehiculo = (): Solicitud => ({
  lote: "F-ampliado", codigo: "murcia_vehiculos_electricos",
  hechos: { residenciaFiscalAdquisicion: "murcia", vehiculos: [{
    id: "veh", adquisicion: "2025-06-01", matriculacion: "2025-06-01",
    uso: "particular", categoria: "M1", tecnologia: "BEV", modalidad: "compraventa",
    procedencia: "nuevo", contrato: "contrato-veh", titular: "s-1",
    propiedadHastaDevengo: "sin_transmision", titularesReparto: ["s-1"],
    plazas: 5, importeEUR: "1000", gastosEUR: "0", tributosEUR: "0", ayudasEUR: "0",
  }] },
})
function canonico(solicitudes: readonly Solicitud[], salarioCentimos = 3000000) {
  const caso: CasoFiscalAnual = {
    anio: 2025, comunidadAutonoma: "murcia", contribuyenteId: "s-1",
    situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
    rendimientos: { trabajo: [{ importeIntegroCentimos: salarioCentimos }] },
    reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0,
    deduccionesTerritoriales2025: { solicitudes },
  }
  return liquidarIrpfAnual(caso, { modo: "canonico" })
}
function explicito(solicitudes: readonly Solicitud[], salarioCentimos = 3000000) {
  const caso = efectivo()
  return liquidarIrpfAnualExplicito({
    ...caso, deduccionesTerritoriales2025: { solicitudes },
    trabajo: { ...caso.trabajo, rendimientos: [{ ...caso.trabajo.rendimientos[0], integro: String(salarioCentimos / 100) }] },
  })
}
const apis = [
  { nombre: "canónica", resolver: (ss: readonly Solicitud[], bruto?: number) => Effect.runSync(Effect.result(canonico(ss, bruto))) },
  { nombre: "explícita", resolver: (ss: readonly Solicitud[], bruto?: number) => Effect.runSync(Effect.result(explicito(ss, bruto))) },
] as const

describe("Murcia2025: vigencia de los nuevos incentivos, Ley3/2025 art55.Siete/Ocho", () => {
  for (const api of apis) {
    it(`${api.nombre}: recarga no exige historia2022–2024 y conserva1000 generados`, () => {
      const r = api.resolver([recargaSinHistorial()])
      expect(r._tag === "Success").toBe(true)
      if (r._tag === "Failure") throw new Error("Rechazo de instalación2025 sin historia fiscal inexistente")
      expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("1000"))
      expect(r.success.deduccionesTerritoriales2025).toMatchObject({ completoEnRamasSolicitadas: true })
    })
    it(`${api.nombre}: vehículo2025 sin historia previa genera300`, () => {
      const r = api.resolver([vehiculo()])
      expect(r._tag === "Success").toBe(true)
      if (r._tag === "Failure") throw new Error("Rechazo de vehículo2025 por historia inexistente")
      expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("300"))
    })
    it(`${api.nombre}: el formato vacío anterior conserva el mismo resultado`, () => {
      const sin = api.resolver([recargaSinHistorial()]), con = api.resolver([recarga()])
      expect(sin._tag === "Success" && con._tag === "Success").toBe(true)
      if (sin._tag === "Failure" || con._tag === "Failure") throw new Error("Falta resultado de compatibilidad")
      expect(sin.success.deduccionesTerritoriales2025).toEqual(con.success.deduccionesTerritoriales2025)
    })
    it(`${api.nombre}: cuota cero conserva el saldo nacido2025 hasta2028`, () => {
      const r = api.resolver([recargaSinHistorial()], 1000000)
      expect(r._tag === "Success").toBe(true)
      if (r._tag === "Failure") throw new Error("Cuota cero no es historia ausente")
      const libro = r.success.deduccionesTerritoriales2025
      expect(libro?.total).toEqual(racional("0"))
      if (libro === undefined || !("aplicaciones" in libro)) throw new Error("Falta libro territorial")
      expect(libro.aplicaciones[0]).toMatchObject({
        generado: racional("1000"), aplicado: racional("0"), pendiente: racional("1000"),
        arrastre: { primerEjercicio: 2026, ultimoEjercicio: 2028, saldo: racional("1000") },
      })
    })
    it(`${api.nombre}: agua60, vehículo300 y recarga1000 consumen una vez en ambos órdenes`, () => {
      const ss = [recargaSinHistorial(), vehiculo(), agua()]
      const a = api.resolver(ss), b = api.resolver([...ss].reverse())
      expect(a._tag === "Success" && b._tag === "Success").toBe(true)
      if (a._tag === "Failure" || b._tag === "Failure") throw new Error("Composición ordinaria incompleta")
      expect(a.success.deduccionesTerritoriales2025?.total).toEqual(racional("1360"))
      expect(b.success.deduccionesTerritoriales2025?.total).toEqual(racional("1360"))
      for (const libro of [a.success.deduccionesTerritoriales2025, b.success.deduccionesTerritoriales2025]) {
        expect(libro).toMatchObject({ ordenAplicado: [agua().codigo, vehiculo().codigo, recarga().codigo], completoEnRamasSolicitadas: true })
      }
    })
    it.each([2022, 2023, 2024] as const)(`${api.nombre}: saldo de recarga de origen%s rechaza antes de liquidar`, origen => {
      const s = recarga()
      const r = api.resolver([{ ...s, historialRecarga: {
        periodos: [2022, 2023, 2024], contribuyente: "s-1", referencia: "historia",
        infraestructuras: [{ objetoId: "antigua", ejercicioOrigen: origen, referencia: "fuera-vigencia" }],
      } }])
      expect(r._tag === "Failure").toBe(true)
      if (r._tag === "Success") throw new Error("No debe publicar cuota con un saldo anterior imposible")
      expect(r.failure).toMatchObject({ _tag: "ResultadoNoSoportado", deduccionesTerritoriales2025: {
        aplicaciones: expect.arrayContaining([expect.objectContaining({ resultado: expect.objectContaining({ siguienteHecho: "historialRecarga.sin_vigencia_anterior_2025" }) })]),
      } })
    })
    it(`${api.nombre}: saldo previo de vehículo tampoco se convierte en deducción cero`, () => {
      const r = api.resolver([{ ...vehiculo(), historialSaldosIncentivoMurcia: {
        codigo: "murcia_vehiculos_electricos", periodos: [2022, 2023, 2024], contribuyente: "s-1", referencia: "historia",
        operaciones: [{ objetoId: "anterior", ejercicioOrigen: 2024, referencia: "sin-vigencia" }],
      } }])
      expect(r._tag === "Failure").toBe(true)
      if (r._tag === "Success") throw new Error("Un saldo previo de vehículo no puede liquidarse")
      expect(r.failure).toMatchObject({ _tag: "ResultadoNoSoportado", deduccionesTerritoriales2025: {
        aplicaciones: expect.arrayContaining([expect.objectContaining({ resultado: expect.objectContaining({ siguienteHecho: "historialSaldosIncentivoMurcia.sin_vigencia_anterior_2025" }) })]),
      } })
    })
    it(`${api.nombre}: no se extiende la omisión de historia a renovables`, () => {
      const r = api.resolver([{ lote: "F-ampliado", codigo: "murcia_instalaciones_recursos_energeticos_renovables", hechos: {} }])
      expect(r._tag === "Failure").toBe(true)
    })
  }
})
