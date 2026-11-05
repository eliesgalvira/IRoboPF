import { Effect } from "effect"
import { expect, it } from "vitest"
import type { ViviendaC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { casoUniformeC36, casoExplicitoC36, viviendaConexionC36 } from "./c36-conexion-anual.fixtures"

function solicitud(edad = 29, importe = "1000") {
  const s = viviendaConexionC36("balears_arrendamiento_vivienda_habitual")
  const nacimiento = `${2025 - edad}-01-01`
  return { ...s, hechos: { ...s.hechos, nacimientoContribuyente: nacimiento,
    censoViviendaInversion: { persona: "s-1", desde: nacimiento, hasta: "2025-12-31",
      cobertura: "vivienda_titulos_operaciones_completo" as const, soporte: "CENSO-DOCUMENTAL",
      titulos: [{ id: "T-ALQUILER", catastro: "RC1", documento: "CONTRATO",
        derecho: "arrendatario" as const, desde: "2025-01-01", hasta: "2025-12-31" }],
      operaciones: [], altasRETA: [],
    },
    viviendas: s.hechos.viviendas.map(original => {
      const { certificadoAntes, certificadoDespues, certificadoNecesidadAccesibilidad, ...v } = original
      void certificadoAntes; void certificadoDespues; void certificadoNecesidadAccesibilidad
      return { ...v, localizacion: { territorio: "illes-balears" as const, isla: "Mallorca", catastro: v.catastro, documento: "CATASTRO" }, derecho: "arrendatario" as const,
      propietarios: [], adquisicion: "", finObras: "", ocupacion: "2025-01-01",
      habitualDesde: "2025-01-01", gastos: v.gastos.map(p => ({ ...p,
        perceptor: "s-8", fecha: "2025-06-01", concepto: "alquiler" as const, importe,
        naturaleza: "propio" as const, ayudasExentas: "0", reembolsos: "0",
      })),
      alquiler: { arrendatario: "s-1", arrendador: "s-8", desde: "2025-01-01",
        hasta: "2026-01-01", fianza: "FIANZA", programa: "ordinario" as const,
        parientesGrado: 0, islaDestino: "Mallorca" },
    } }),
  } }
}
for (const api of ["uniforme", "efectiva"] as const) {
  const ejecutar = (s: typeof ViviendaC36.Type, edad = 29, ingreso = "30000") => api === "uniforme"
    ? Effect.runSync(liquidarIrpfAnual({ ...casoUniformeC36(), comunidadAutonoma: "illes-balears",
      situacionFamiliar: { ...casoUniformeC36().situacionFamiliar, edad },
      rendimientos: { trabajo: [{ importeIntegroCentimos: Number(ingreso) * 100 }] },
      deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" }))
    : Effect.runSync(liquidarIrpfAnualExplicito({ ...casoExplicitoC36([s]),
      comunidadAutonoma: "illes-balears", edad,
      deduccionesTerritoriales2025: { solicitudes: [s] },
      trabajo: { ...casoExplicitoC36([s]).trabajo, rendimientos: casoExplicitoC36([s]).trabajo.rendimientos.map(r => ({ ...r, integro: ingreso })) } }))
  it(`P04 29/1000 ${api} Fraction`, () => {
    expect(ejecutar(solicitud(29, "1000"), 29).deduccionesTerritoriales2025?.total)
      .toEqual({"numeradorEuros": "200", "divisor": "1"})
  })
  it(`P04 29/3250 ${api} Fraction`, () => {
    expect(ejecutar(solicitud(29, "3250"), 29).deduccionesTerritoriales2025?.total)
      .toEqual({"numeradorEuros": "650", "divisor": "1"})
  })
  it(`P04 29/3250.01 ${api} Fraction`, () => {
    expect(ejecutar(solicitud(29, "3250.01"), 29).deduccionesTerritoriales2025?.total)
      .toEqual({"numeradorEuros": "650", "divisor": "1"})
  })
  it(`P04 30/1000 ${api} Fraction`, () => {
    expect(ejecutar(solicitud(30, "1000"), 30).deduccionesTerritoriales2025?.total)
      .toEqual({"numeradorEuros": "150", "divisor": "1"})
  })
  it(`P04 35/3533.33 ${api} Fraction`, () => {
    expect(ejecutar(solicitud(35, "3533.33"), 35).deduccionesTerritoriales2025?.total)
      .toEqual({"numeradorEuros": "1059999", "divisor": "2000"})
  })
  it(`P04 35/3533.34 ${api} Fraction`, () => {
    expect(ejecutar(solicitud(35, "3533.34"), 35).deduccionesTerritoriales2025?.total)
      .toEqual({"numeradorEuros": "530", "divisor": "1"})
  })
  it(`P04 29/0.01 ${api} Fraction`, () => {
    expect(ejecutar(solicitud(29, "0.01"), 29).deduccionesTerritoriales2025?.total)
      .toEqual({"numeradorEuros": "1", "divisor": "500"})
  })
  it(`P04 18 años ${api} Fraction`, () => {
    expect(ejecutar(solicitud(18), 18).deduccionesTerritoriales2025?.total)
      .toEqual({ numeradorEuros: "200", divisor: "1" })
  })
  it(`P04 ${api}: omisión del censo no prueba ausencia`, () => {
    const s = solicitud()
    const { censoViviendaInversion: omitido, ...hechos } = s.hechos
    expect(omitido.operaciones).toEqual([])
    expect(() => ejecutar({ ...s, hechos })).toThrow()
  })
  for (const clase of ["adquisicion", "adecuacion", "sostenibilidad", "energia", "financiacion"] as const) {
    it(`P04 ${api}: ${clase} aunque no exista elección aplicar`, () => {
      const s = solicitud()
      expect(() => ejecutar({ ...s, hechos: { ...s.hechos,
        censoViviendaInversion: { ...s.hechos.censoViviendaInversion,
          operaciones: [{ id: "OBRA", catastro: "RC1", documento: "FACTURA",
            fecha: "2012-01-01", clase }] },
      } })).toThrow()
    })
  }
  for (const derecho of ["propiedad", "usufructo", "uso"] as const) {
    it(`P04 ${api}: título real ${derecho} impide inferir ausencia`, () => {
      const s = solicitud()
      expect(() => ejecutar({ ...s, hechos: { ...s.hechos,
        censoViviendaInversion: { ...s.hechos.censoViviendaInversion,
          titulos: s.hechos.censoViviendaInversion.titulos.map(t => ({ ...t, derecho })) },
      } })).toThrow()
    })
  }
  it(`P04 ${api}: RETA no se sustituye por colectivo ordinario`, () => {
    const s = solicitud()
    expect(() => ejecutar({ ...s, hechos: { ...s.hechos,
      censoViviendaInversion: { ...s.hechos.censoViviendaInversion,
        altasRETA: [{ desde: "2025-01-01", hasta: "2025-12-31" }] },
    } })).toThrow()
  })
  it(`P04 ${api}: cobertura parcial`, () => {
    const s = solicitud()
    expect(() => ejecutar({ ...s, hechos: { ...s.hechos,
      censoViviendaInversion: { ...s.hechos.censoViviendaInversion, desde: "2025-01-01" },
    } })).toThrow()
  })
  it(`P04 ${api}: contrato omitido`, () => {
    const s = solicitud()
    expect(() => ejecutar({ ...s, hechos: { ...s.hechos,
      censoViviendaInversion: { ...s.hechos.censoViviendaInversion, titulos: [] },
    } })).toThrow()
  })
  for (const variante of ["obra", "propietario", "fondos", "ocupacion", "contrato", "pagador"] as const) {
    it(`P04 ${api}: contradicción ${variante}`, () => {
      const s = solicitud()
      const viviendas = s.hechos.viviendas.map(v => ({ ...v,
        finObras: variante === "obra" ? "2025-01-01" : "",
        propietarios: variante === "propietario" ? [{ persona: "s-1", porcentaje: "100", titulo: "T" }] : [],
        ocupacion: variante === "ocupacion" ? "2026-01-01" : v.ocupacion,
        alquiler: { ...v.alquiler, hasta: variante === "contrato" ? "2025-06-30" : v.alquiler.hasta },
        gastos: v.gastos.map(p => ({ ...p, naturaleza: variante === "fondos" ? "comun" as const : p.naturaleza,
          pagador: variante === "pagador" ? "s-9" : p.pagador })),
      }))
      expect(() => ejecutar({ ...s, hechos: { ...s.hechos, viviendas } })).toThrow()
    })
  }
  it(`P04 ${api}: no acepta booleano fiscal de ausencia de derecho`, () => {
    const s = solicitud()
    const alterada = { ...s, hechos: { ...s.hechos, sinDerechoInversion: true } }
    expect(() => ejecutar(alterada)).toThrow()
  })
  it(`P04 ${api}: cuota única no permite repetir solicitud`, () => {
    const s = solicitud()
    const doble = [s, s]
    const run = () => api === "uniforme"
      ? Effect.runSync(liquidarIrpfAnual({ ...casoUniformeC36(), comunidadAutonoma: "illes-balears",
        situacionFamiliar: { ...casoUniformeC36().situacionFamiliar, edad: 29 },
        deduccionesTerritoriales2025: { solicitudes: doble } }, { modo: "canonico" }))
      : Effect.runSync(liquidarIrpfAnualExplicito({ ...casoExplicitoC36(doble), comunidadAutonoma: "illes-balears", edad: 29 }))
    expect(run).toThrow()
  })
  it(`P04 ${api}: renta excesiva conserva rechazo`, () => {
    expect(() => ejecutar(solicitud(), 29, "100000")).toThrow()
  })
  it(`P04 ${api}: 36 años no joven`, () => {
    expect(() => ejecutar(solicitud(36), 36)).toThrow()
  })
}
