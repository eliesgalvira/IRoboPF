import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { expect, it } from "vitest"
import fixture from "./fixtures/aragon-conexion-anual-20261105.json"
import { aplicarDeduccionesTerritoriales2025, SolicitudDeduccionesTerritoriales2025, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"

// Esperados propios: base estatal100000*1/2; exceso110000-100000, regional*1/5.
function entrada(emision: string, positiva = true) {
  const s = structuredClone(fixture.inversion)
  for (const i of s.hechos.inversiones) i.certificadoEntidad.fechaEmision = emision
  if (!positiva) return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [s] })
  s.hechos.inversiones[0].asignacion = { estatalCentimos: 5000000, aragonCentimos: 0, sinDeduccionCentimos: 0 }
  s.hechos.inversiones[1].asignacion = { estatalCentimos: 5000000, aragonCentimos: 1000000, sinDeduccionCentimos: 0 }
  return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [{ ...s, hechos: { ...s.hechos, estatal681: {
    exhaustividad: "cuentas-y-censo-sin-otros-bienes-ni-deudas", censo: "revision-censo", contribuyente: "t",
    fechaInicio: "2025-01-01", fechaFin: "2025-12-31", origenFondos: "renta2025-sin-cuentas-ahorro-empresa", referenciaOrigenFondos: "revision-renta",
    cuentasInicio: [{ id: "banco", titular: "t", saldoCentimos: 100000, referencia: "inicio" }],
    cuentasFin: [{ id: "banco", titular: "t", saldoCentimos: 100000, referencia: "fin" }],
    titularidades: s.hechos.inversiones.map(i => ({ inversion: i.id, contribuyente: "t", entidad: i.entidad, escritura: i.escritura, fechaAdquisicion: i.fechaSuscripcion, certificado: i.certificadoEntidad.referencia, referencia: "revision-titulo-" + i.id }))
  } } }] }, { onExcessProperty: "error" })
}
function magnitudes(estatal = "60000", autonomica = "60000"): MagnitudesTerritorialesAnuales {
  return { caso: { anio: 2025, comunidadAutonoma: "aragon", contribuyenteId: "t", situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } }, baseGeneral: new Decimal(1000000), baseAhorro: new Decimal(0), minimoPersonalFamiliar: new Decimal(5550), cuotaAutonomica: new Decimal(autonomica), cuotaEstatal681: new Decimal(estatal), sujetosConMinimo: [] }
}
for (const emision of ["2025-12-31", "2026-01-15", "2027-04-23"]) {
  it("REV681 certificado relativo2025 expedido " + emision, () => {
    const r = aplicarDeduccionesTerritoriales2025(entrada(emision), magnitudes())
    expect(r.estatal681?.generacion.baseEuros).toBe("100000")
    expect(r.estatal681?.consumo.total).toEqual({ numeradorEuros: "50000", divisor: "1" })
    expect(r.total).toEqual({ numeradorEuros: "2000", divisor: "1" })
  })
}
it("REV681 cuotas disjuntas y pendiente sin convertirlo en arrastre", () => {
  const r = aplicarDeduccionesTerritoriales2025(entrada("2025-12-31"), magnitudes("7", "11"))
  expect(r.estatal681?.consumo.aplicaciones[0]).toEqual({ generado: { numeradorEuros: "50000", divisor: "1" }, aplicado: { numeradorEuros: "7", divisor: "1" }, pendiente: { numeradorEuros: "49993", divisor: "1" } })
  expect(r.total).toEqual({ numeradorEuros: "11", divisor: "1" })
})
it("REV681 estatal0 publicado admite certificado posterior sin nuevo patrimonio", () => {
  const r = aplicarDeduccionesTerritoriales2025(entrada("2026-01-15", false), magnitudes())
  expect(r.estatal681).toBeUndefined()
  expect(r.total).toEqual({ numeradorEuros: "2000", divisor: "1" })
})
const vacia = Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [] })
function tecnica(s: typeof vacia) {
  return liquidarIrpfAnual({ anio: 2025, comunidadAutonoma: "aragon", contribuyenteId: "t", situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] }, rendimientos: { trabajo: [{ importeIntegroCentimos: 100000000 }] }, reducciones: [], deducciones: [], deduccionesTerritoriales2025: s, retencionesSoportadasCentimos: 10000, pagosACuentaCentimos: 20000 }, { modo: "canonico" })
}
function explicita(s: typeof vacia) {
  const caso: CasoFiscalAnualExplicito = { ejercicio: 2025, comunidadAutonoma: "aragon", contribuyenteId: "t", edad: 40, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo", conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificado"] }, trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "empleo", clase: "empleo-laboral", integro: "1000000", cotizaciones: { clase: "efectivas", seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] }, retenciones: [{ ejercicio: 2025, operacionId: "retencion", procedencia: "certificado", importe: "100", efectiva: true }] }
  return liquidarIrpfAnualExplicito(caso)
}
it("REV681 técnica certificado2026 conserva consumo único y pagos", () => {
  const b = Effect.runSync(tecnica(vacia)), r = Effect.runSync(tecnica(entrada("2026-01-15")))
  expect(b.cuotaLiquidaCentimos - r.cuotaLiquidaCentimos).toBe(5200000)
  expect(b.cuotaDiferencialCentimos - r.cuotaDiferencialCentimos).toBe(5200000)
  expect(r.retencionesYPagosACuentaCentimos).toBe(30000)
})
it("REV681 explícita certificado2026 conserva consumo único", () => {
  const b = Effect.runSync(explicita(vacia)), r = Effect.runSync(explicita(entrada("2026-01-15")))
  expect(new Decimal(b.cuotaLiquidaLegal).minus(r.cuotaLiquidaLegal).toFixed()).toBe("52000")
  expect(new Decimal(b.cuotaDiferencial).minus(r.cuotaDiferencial).toFixed()).toBe("52000")
})
