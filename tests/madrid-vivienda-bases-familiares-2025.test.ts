import Decimal from "decimal.js"
import { Effect, Result } from "effect"
import { describe, expect, it } from "vitest"
import { producirBasesFamiliares2025, type CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { aplicarDeduccionesTerritoriales2025 as aplicar, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { casos } from "./p7-madrid-fixtures"
const D = Decimal.clone({ precision: 80 })
const hipoteca = "madrid_incremento_costes_financiacion_vivienda"
const nacimiento = "madrid_vivienda_nacimiento_adopcion_hijos"
function censo(): CensoBasesFamiliares2025 {
  return {
    referencia: "Madrid-P13-sintetico", ejercicio: 2025, devengo: "2025-12-31", contribuyente: "s-1",
    estadoCivil: "casado-no-separado", conyuge: "s-2", censoCompleto: true, hijosCompletos: true,
    hijos: [{ id: "s-3", nacimiento: "2023-01-01", progenitores: ["s-1", "s-2"], conviveCon: ["s-1", "s-2"], independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "filiacion" }],
    personas: ["s-1", "s-2", "s-3"].map(id => ({ id, soporte: "economia", residenteComunTodo2025: true, vivoTodo2025: true,
      economia: id === "s-1" ? { perfil: "declarante-en-composicion" } : id === "s-2" ? {
        perfil: "solo-trabajo", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", trabajo: efectivo.trabajo,
      } : { perfil: "sin-rentas", censoRentasCompleto: true } })),
  }
}
function familia(adopcion = false) {
  return { ...derechos, descendientes: derechos.descendientes.map(d => ({ ...d, fechaNacimiento: "2023-01-01", edadDevengo: 2, titulares: d.titulares.map(t => ({ ...t, vinculo: adopcion ? { clase: "adopcion" as const, fechaConstitucionVinculo: "2023-01-01", fechaInicioIncremento: "2023-01-01", fundamento: "inscripcion-registro-civil" as const, historialCompleto: true as const } : t.vinculo })) })) }
}
function solicitud(codigo: typeof hipoteca | typeof nacimiento): SolicitudAnualF2025 {
  if (codigo === hipoteca) {
    const s = casos[0]!.solicitud
    const { miembrosUnidad: _miembros, ...hechos } = s.hechos
    return { ...s, hechos }
  }
  return { lote: "F-ampliado", codigo, hechos: {
    viviendas: [{ id: "v", territorio: "madrid", adquisicion: "2025-01-01", precioEUR: "100000", gastosEUR: "2000", tributosEUR: "8000", ocupacionDesde: "2025-02-01", permanenciaHasta: "2025-12-31", titulares: ["s-1"], porcentajePropiedad: "100" }],
    personas: [{ id: "s-3", relacion: "hijo", nacimiento: "2023-01-01", certificadoParentesco: "filiacion", situacionDevengo: "vivo", alimentos64175: "no", rentasNoExentasEUR: "0", declaracionTipo: "no_presentada", discapacidadPorcentaje: "0", convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }], gradoMasCercanoConPrioridad: [], titularesMinimo: ["s-1", "s-2"] }],
  } }
}
function magnitudes(general = "20000", cuota = "10000", c = censo()): MagnitudesTerritorialesAnuales {
  const caso = { ...analitico, contribuyenteId: "s-1", derechosMinimos: familia() }
  return { caso, baseGeneral: new D(general), baseAhorro: new D(0), minimoPersonalFamiliar: new D(5550), cuotaAutonomica: new D(cuota), sujetosConMinimo: ["s-3"], atribucionesMinimo: [{ sujetoId: "s-3", titulares: ["s-1", "s-2"] }], libroBasesFamiliares2025: producirBasesFamiliares2025(c, caso, { general: new D(general), ahorro: new D(0) }) }
}
const evaluar = (s: SolicitudAnualF2025, m = magnitudes()) => aplicar({ solicitudes: [s] }, m)
for (const codigo of [hipoteca, nacimiento] as const) describe(codigo, () => {
  const importe = codigo === hipoteca ? "35.96" : "1100"
  it("libro con cónyuge laboral: art19=30000-1944-2000=26056, tres miembros", () => {
    const m = magnitudes(); expect(m.libroBasesFamiliares2025!.miembrosUnidad).toEqual(["s-1", "s-2", "s-3"])
    expect(m.libroBasesFamiliares2025!.bases.get("s-2")!.general.toFixed()).toBe("26056")
    expect(evaluar(solicitud(codigo), m).total).toEqual(racional(importe))
  })
  it.each([["66734", importe], ["66734.0000000000000000000000000000000001", "0"]])("frontera 92790 inclusiva BIG propia=%s", (g, esperado) => {
    expect(evaluar(solicitud(codigo), magnitudes(g)).total).toEqual(racional(esperado))
  })
  it.each(["0", "10.001"])("cuota propia insuficiente %s, consumo único exacto", cuota => {
    expect(evaluar(solicitud(codigo), magnitudes("20000", cuota)).total).toEqual(racional(cuota))
  })
  it("no permite omitir ni duplicar miembros", () => {
    for (const miembrosUnidad of [["s-1"], ["s-1", "s-2", "s-2"], ["s-1", "s-2", "s-99"]]) {
      const s = solicitud(codigo)
      expect(evaluar({ ...s, hechos: { ...s.hechos, miembrosUnidad } }).evaluacionesF[0]?.estado).toBe("no_soportado")
    }
  })
  it("sin libro no convierte la economía ajena en cero", () => {
    const s = solicitud(codigo), m = magnitudes()
    expect(evaluar({ ...s, hechos: { ...s.hechos, miembrosUnidad: ["s-1", "s-2", "s-3"] } }, { ...m, libroBasesFamiliares2025: undefined }).evaluacionesF[0]?.estado).toBe("no_soportado")
  })
  it("libro con identidad/ejercicio o base propia contradictorios", () => {
    const m = magnitudes(), l = m.libroBasesFamiliares2025!
    for (const libro of [{ ...l, contribuyente: "s-9" }, { ...l, bases: new Map(l.bases).set("s-1", { general: new D(1), ahorro: new D(0) }) }]) {
      expect(evaluar(solicitud(codigo), { ...m, libroBasesFamiliares2025: libro }).evaluacionesF[0]?.estado).toBe("no_soportado")
    }
  })
  for (const api of ["canonico", "explicito"] as const) {
    it.each(codigo === nacimiento ? [false, true] : [false])(api + ": ambas API conservan base propia y consumen una vez; adopción=%s", adopcion => {
      const d = familia(adopcion), c = censo(), s = solicitud(codigo)
      const hechos = { ...s.hechos }
      if (adopcion) hechos.personas = s.hechos.personas!.map(p => ({ ...p, adopcionFecha: "2023-01-01" }))
      const deduccionesTerritoriales2025 = { solicitudes: [{ ...s, hechos }] }
      if (api === "canonico") {
        const a = { ...analitico, contribuyenteId: "s-1", derechosMinimos: d, basesFamiliares2025: c }
        const antes = Effect.runSync(liquidarIrpfAnual(a, { modo: "canonico" }))
        const despues = Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025 }, { modo: "canonico" }))
        expect(despues.deduccionesTerritoriales2025?.total).toEqual(racional(importe))
        expect(antes.cuotaLiquidaCentimos - despues.cuotaLiquidaCentimos).toBe(new D(importe).times(100).toNumber())
      } else {
        const e = { ...efectivo, contribuyenteId: "s-1", derechosMinimos: d, familiaresConDerechoMinimo: "segun-derechos", basesFamiliares2025: c, deducciones: "territoriales-por-hechos-y-da61" } as const
        const antes = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "solo-da61-si-procede" }))
        const despues = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deduccionesTerritoriales2025 }))
        expect(despues.baseLiquidableGeneral).toBe(antes.baseLiquidableGeneral)
        expect(despues.deduccionesTerritoriales2025?.total).toEqual(racional(importe))
        expect(new D(antes.cuotaLiquidaLegal).minus(despues.cuotaLiquidaLegal).eq(importe)).toBe(true)
      }
    })
    it(api + ": economía ausente/año o identidad contradictoria y bases/cuotas externas se rechazan", () => {
      const c = censo()
      for (const corrupto of [
        { ...c, ejercicio: 2024 }, { ...c, contribuyente: "s-9" },
        { ...c, personas: c.personas.map(p => p.id === "s-2" ? { ...p, economia: undefined } : p) },
        { ...c, baseGeneralEUR: "0" }, { ...c, cuotaAutonomicaEUR: "10000" },
      ]) {
        // SAFETY: contrato deliberadamente inválido para comprobar rechazo; nunca alimenta un oráculo monetario.
        const basesFamiliares2025 = corrupto as never
        const rechazado = api === "canonico"
          ? Result.isFailure(Effect.runSync(Effect.result(liquidarIrpfAnual({ ...analitico, contribuyenteId: "s-1", derechosMinimos: familia(), basesFamiliares2025, deduccionesTerritoriales2025: { solicitudes: [solicitud(codigo)] } }, { modo: "canonico" }))))
          : Result.isFailure(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...efectivo, contribuyenteId: "s-1", derechosMinimos: familia(), familiaresConDerechoMinimo: "segun-derechos", basesFamiliares2025, deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: { solicitudes: [solicitud(codigo)] } }))))
        expect(rechazado).toBe(true)
      }
    })
  }
})
it("pareja sin vínculo no suma otro progenitor; hijo mayor e independiente tampoco", () => {
  const c = censo(), { conyuge: _conyuge, ...sin } = c
  const m = magnitudes("20000", "10000", { ...sin, estadoCivil: "sin-vinculo" })
  expect(m.libroBasesFamiliares2025!.miembrosUnidad).toEqual(["s-1", "s-3"])
  // La economía del adulto se mantiene en el censo, fuera de la selección art82.
  expect(m.libroBasesFamiliares2025!.bases.get("s-2")!.general.toFixed()).toBe("26056")
  for (const h of [{ ...c.hijos[0]!, nacimiento: "2007-12-31" }, { ...c.hijos[0]!, independienteConConsentimiento: true }]) {
    const caso = { anio: 2025, contribuyenteId: "s-1", comunidadAutonoma: "madrid" } as const
    expect(producirBasesFamiliares2025({ ...c, hijos: [h] }, caso, { general: new D(20000), ahorro: new D(0) }).miembrosUnidad).toEqual(["s-1", "s-2"])
  }
})
it("nacimiento: historia2024 no se sustituye por2025 y cotitularidad no se abre", () => {
  const s = solicitud(nacimiento), v = s.hechos.viviendas![0]!
  for (const vivienda of [{ ...v, adquisicion: "2024-01-01", ocupacionDesde: "2024-02-01" }, { ...v, titulares: ["s-1", "s-2"], porcentajePropiedad: "50" }]) {
    expect(evaluar({ ...s, hechos: { ...s.hechos, viviendas: [vivienda] } }).evaluacionesF[0]?.estado).toBe("no_soportado")
  }
})
it("hipoteca mantiene prestatario/propietario único aun con familia", () => {
  const s = solicitud(hipoteca), p = s.hechos.prestamos![0]!, h = p.contratoMadrid!
  expect(evaluar({ ...s, hechos: { ...s.hechos, prestamos: [{ ...p, contratoMadrid: { ...h, prestatarios: ["s-1", "s-2"] } }] } }).evaluacionesF[0]?.estado).toBe("no_soportado")
})

it("nacimiento: tope anual racional 3093/2 y contradicción del evento", () => {
  const s = solicitud(nacimiento), v = s.hechos.viviendas![0]!, p = s.hechos.personas![0]!
  expect(evaluar({ ...s, hechos: { ...s.hechos, viviendas: [{ ...v, precioEUR: "200000" }] } }).total).toEqual(racional("1546.50"))
  expect(evaluar({ ...s, hechos: { ...s.hechos, personas: [{ ...p, nacimiento: "2024-01-01" }] } }).evaluacionesF[0]?.estado).toBe("no_soportado")
})

for (const codigo of [hipoteca, nacimiento] as const) it(codigo + ": hechos anuales no admiten bases/cuotas consignadas", () => {
  const s = solicitud(codigo)
  for (const externo of [{ bases: [{ id: "s-2", generalEUR: "0", ahorroEUR: "0" }] }, { cuotaAutonomicaEUR: "1000" }]) {
    // SAFETY: sólo validación de una entrada prohibida; no se calcula con ella.
    expect(() => evaluar({ ...s, hechos: { ...s.hechos, ...externo } } as never)).toThrow()
  }
})

const despoblacion = "madrid_vivienda_municipios_despoblacion"
function solicitudesInversionMadrid(): readonly [SolicitudAnualF2025, SolicitudAnualF2025] {
  const s = solicitud(nacimiento)
  const v = { ...s.hechos.viviendas![0]!, municipio: "La Hiruela", poblacion: 100, fechaPoblacion: "2024-01-01", referenciaPoblacion: "INE" }
  return [
    { ...s, hechos: { ...s.hechos, viviendas: [v] } },
    { lote: "F-ampliado", codigo: despoblacion, hechos: { viviendas: [v], nacimientoContribuyente: "1993-01-01", miembrosUnidad: ["s-1"] } },
  ]
}
function evaluarInversionMadrid(api: "canonico" | "explicito", solicitudes: readonly SolicitudAnualF2025[]) {
  const derechosMinimos = { ...familia(), edadContribuyenteDevengo: 32 }
  const comunes = { contribuyenteId: "s-1", derechosMinimos, basesFamiliares2025: censo(), deduccionesTerritoriales2025: { solicitudes } }
  return api === "canonico"
    ? Effect.runSync(Effect.result(liquidarIrpfAnual({ ...analitico, ...comunes, situacionFamiliar: { ...analitico.situacionFamiliar, edad: 32 } }, { modo: "canonico" })))
    : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...efectivo, ...comunes, edad: 32, familiaresConDerechoMinimo: "segun-derechos", deducciones: "territoriales-por-hechos-y-da61" })))
}
for (const api of ["canonico", "explicito"] as const) describe(api + ": inversiones incompatibles de Madrid", () => {
  it.each([false, true])("rechaza dos solicitudes sobre la misma vivienda, orden inverso=%s", inverso => {
    const solicitudes = solicitudesInversionMadrid()
    const r = evaluarInversionMadrid(api, inverso ? [...solicitudes].reverse() : solicitudes)
    expect(r._tag).toBe("Failure")
    if (r._tag === "Failure") expect(r.failure._tag).toBe("ResultadoNoSoportado")
  })
  for (const indice of [0, 1] as const) {
    it("rechaza la elección opuesta sobre la misma inversión: " + indice, () => {
      const solicitudes = solicitudesInversionMadrid(), s = solicitudes[indice], opuesta = solicitudes[indice === 0 ? 1 : 0]
      const r = evaluarInversionMadrid(api, [{ ...s, hechos: { ...s.hechos, elecciones: [{ codigo: opuesta.codigo, objetoId: "v" }] } }])
      expect(r._tag).toBe("Failure")
      if (r._tag === "Failure") expect(r.failure._tag).toBe("ResultadoNoSoportado")
    })
    it("conserva la alternativa única de 1100 EUR: " + indice, () => {
      const r = evaluarInversionMadrid(api, [solicitudesInversionMadrid()[indice]])
      expect(r._tag).toBe("Success")
      if (r._tag === "Success") expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("1100"))
    })
    it("la incompatibilidad no alcanza otra inversión: " + indice, () => {
      const solicitudes = solicitudesInversionMadrid(), s = solicitudes[indice], opuesta = solicitudes[indice === 0 ? 1 : 0]
      const r = evaluarInversionMadrid(api, [{ ...s, hechos: { ...s.hechos, elecciones: [{ codigo: opuesta.codigo, objetoId: "otra-inversion" }] } }])
      expect(r._tag).toBe("Success")
      if (r._tag === "Success") expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("1100"))
    })
  }
  it("conserva la compatibilidad con cambio de residencia", () => {
    const s = solicitudesInversionMadrid()[0]
    const r = evaluarInversionMadrid(api, [{ ...s, hechos: { ...s.hechos, elecciones: [{ codigo: "madrid_cambio_residencia_municipio_despoblacion", objetoId: "v" }] } }])
    expect(r._tag).toBe("Success")
    if (r._tag === "Success") expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("1100"))
  })
})
