import { producirBasesHistoriaNacimientoMadrid } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/madrid-historia"
import oraculos from "./madrid-historia-oraculos.json"
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import { fixture } from "./madrid-historia-fixtures"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
import { aplicarDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
const D = Decimal.clone({ precision: 80 })
for (const y of [2023,2024] as const) for (const dos of [false,true]) for (const multiple of [false,true]) for (const adopcion of [false,true]) {
  const importe = multiple ? (dos ? "721.70" : "1443.40") : (dos ? "360.85" : "721.70")
  for (const api of ["canonico","explicito"] as const) it(`MADRID_HISTORIA_LIBRO_UNICO ${y}/${dos}/${multiple}/${adopcion}/${api}`, () => {
    const {s,m} = fixture(y,dos,multiple,adopcion)
    const d = { ...m.caso.derechosMinimos!, descendientes: m.caso.derechosMinimos!.descendientes.map(h => ({ ...h,
      titulares: h.titulares.map(t => ({ ...t, rentasNoExentasCentimos: t.titularId === "s-1" ? (api === "canonico" ? 2979680 : 3000000) : t.rentasNoExentasCentimos })),
    })) }
    const comunes = { comunidadAutonoma: "madrid" as const, derechosMinimos: d, deduccionesTerritoriales2025: { solicitudes: [s] } }
    // Cuota suficiente para múltiples: hechos nuevos, nunca se elevan bases históricas ni límites.
    const efectivo = casoExplicitoC36([])
    const trabajo = { ...efectivo.trabajo, rendimientos: efectivo.trabajo.rendimientos.map(r => ({ ...r, integro: "32000" })) }
    const r = api === "canonico"
      ? Effect.runSync(liquidarIrpfAnual({ ...casoUniformeC36(), ...comunes, rendimientos: { trabajo: [{ importeIntegroCentimos: 3400000 }] } }, { modo: "canonico" }))
      : Effect.runSync(liquidarIrpfAnualExplicito({ ...efectivo, trabajo, ...comunes, familiaresConDerechoMinimo: "segun-derechos" }))
    if ("componentesCuota" in r) expect(new D(r.componentesCuota.cuotaAutonomica).gte(importe), "Fixture positiva con cuota suficiente").toBe(true)
    expect(r.deduccionesTerritoriales2025?.total).toEqual(racional(importe))
  })
}
for (const origen of [2023,2024] as const) for (const ejercicio of (origen === 2023 ? [2023,2024] : [2024])) {
  for (const bruto of ["32929.99","32930","32930.01"]) it(`base histórica ${origen}/${ejercicio}/${bruto}`, () => {
    const {s,m,trabajo} = fixture(origen)
    const h = s.historiaNacimientoMadrid!
    const hechos = { ...s, historiaNacimientoMadrid: { ...h, periodos: h.periodos.map(p => p.ejercicio !== ejercicio ? p : { ...p,
      personas: p.personas.map(x => x.id !== "s-1" ? x : { ...x, economia: { perfil: "solo-trabajo" as const,
        censoRentasCompleto: true as const, otrasRentas: "ninguna" as const, reduccionesBase: "ninguna" as const,
        saldosAnteriores: "ninguno" as const, trabajo: { ...trabajo, ejercicio, rendimientos: trabajo.rendimientos.map(r => ({ ...r,
          integro: bruto, cotizaciones: { clase: "efectivas" as const, seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" },
          sindicato: { importe: "0", satisfecho: "no" as const }, colegio: { ...r.colegio, importe: "0" }, defensa: { ...r.defensa, importe: "0" },
        })) },
      } }),
    }) } }
    const r = evaluarAnualF2025(hechos,m)
    expect(r.estado).toBe(bruto !== "32930.01" ? "calculo_parcial" : ejercicio === origen ? "excluida" : "no_soportado")
    if (bruto === "32930.01") expect(r.siguienteHecho).toBe(`historia:${ejercicio}:` + (ejercicio === origen ? "bases_origen" : "criterio_anualidad_intermedia"))
  })
}
it("historia ausente, incompleta, identidad, fechas, filiación y economía contradictorias", () => {
  const {s,m} = fixture(2023), h = s.historiaNacimientoMadrid!, p = h.periodos[0]!
  const { historiaNacimientoMadrid: _historia, ...sinHistoria } = s
  expect(evaluarAnualF2025(sinHistoria,m).estado).toBe("no_soportado")
  for (const historiaNacimientoMadrid of [ { ...h, periodos: [p] }, { ...h, contribuyente: "s-9" },
    { ...h, periodos: [p,p] }, { ...h, periodos: h.periodos.map(x => ({ ...x, hijos: x.hijos.map(i => ({ ...i, nacimiento: "2024-02-01" })) })) },
    { ...h, periodos: h.periodos.map(x => ({ ...x, hijos: x.hijos.map(i => ({ ...i, progenitores: ["s-9"] })) })) },
  ]) expect(evaluarAnualF2025({ ...s, historiaNacimientoMadrid },m).estado).toBe("no_soportado")
  for (const campo of ["baseGeneralEUR","cuota","elegibilidad","saldo"]) {
    expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudAnualF2025)({ ...s, historiaNacimientoMadrid: { ...h, [campo]: "0" } }, { onExcessProperty: "error" }))).toBe(true)
  }
})
it("ventana 2022/2026, IDs y evento repetidos", () => {
  const {s,m} = fixture(2023), a = s.auxiliares!, e = a.eventos[0]!
  expect(evaluarAnualF2025({ ...s, auxiliares: { ...a, eventos: [{ ...e, fecha: "2022-02-01" }] } },m).estado).toBe("excluida")
  const { historiaNacimientoMadrid: _historia, ...sinHistoria } = s
  expect(evaluarAnualF2025({ ...sinHistoria, auxiliares: { ...a, eventos: [{ ...e, fecha: "2026-02-01" }] } },m).estado).toBe("no_soportado")
  for (const eventos of [[e,e], [{ ...e, hijos: ["s-99"] }], [{ ...e, fecha: "2023-02-02" }]])
    expect(evaluarAnualF2025({ ...s, auxiliares: { ...a, eventos } },m).estado).toBe("no_soportado")
})
it("cuota agotada consume cero una sola vez; precisión80 en límite2025", () => {
  const {s,m} = fixture(2023)
  const r = aplicarDeduccionesTerritoriales2025({ solicitudes: [s] },{ ...m, cuotaAutonomica: new D(0) })
  expect(r.total).toEqual(racional("0"))
  expect(evaluarAnualF2025(s,{ ...m, baseGeneral: new D("30930.0000000000000000000000000000000000000001") }).estado).toBe("excluida")
})

for (const origen of [2023,2024] as const) for (const ejercicio of (origen === 2023 ? [2023,2024] : [2024])) {
  for (const bruto of ["43859.99","43860","43860.01"]) it(`unidad familiar histórica ${origen}/${ejercicio}/${bruto}`, () => {
    const {s,m,trabajo} = fixture(origen,true)
    const aux = s.auxiliares!, hist = s.historiaNacimientoMadrid!
    const economia = (integro: string, anio: number) => ({ perfil: "solo-trabajo" as const,
      censoRentasCompleto: true as const, otrasRentas: "ninguna" as const, reduccionesBase: "ninguna" as const,
      saldosAnteriores: "ninguno" as const, trabajo: { ...trabajo, ejercicio: anio,
        rendimientos: trabajo.rendimientos.map(r => ({ ...r, integro,
          cotizaciones: { clase: "efectivas" as const, seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" },
          sindicato: { importe: "0", satisfecho: "no" as const }, colegio: { ...r.colegio, importe: "0" }, defensa: { ...r.defensa, importe: "0" },
        })),
      },
    })
    const hechos = { ...s, auxiliares: { ...aux, estadoCivil: "casado" as const, miembrosUnidad: ["s-1","s-3","s-2"] },
      historiaNacimientoMadrid: { ...hist, periodos: hist.periodos.map(p => ({ ...p, estadoCivil: "casado" as const, conyuge: "s-3",
        personas: p.personas.map(x => ({ ...x, economia: x.id === "s-1" ? economia("22000",p.ejercicio) : x.id === "s-3" ? economia(p.ejercicio === ejercicio ? bruto : "22000",p.ejercicio) : x.economia })),
      })) },
    }
    const libro = { referencia: "libro-interno-prueba", ejercicio: 2025 as const, contribuyente: "s-1", estadoCivil: "casado-no-separado" as const,
      conyuge: "s-3", miembrosUnidad: ["s-1","s-3","s-2"],
      bases: new Map([ ["s-1",{ general: new D(20000), ahorro: new D(0) }], ["s-3",{ general: new D(20000), ahorro: new D(0) }], ["s-2",{ general: new D(0), ahorro: new D(0) }] ]),
    }
    const r = evaluarAnualF2025(hechos,{ ...m, libroBasesFamiliares2025: libro })
    expect(r.estado).toBe(bruto !== "43860.01" ? "calculo_parcial" : ejercicio === origen ? "excluida" : "no_soportado")
  })
}
it("trabajo histórico usa art20 de su año y permite pensión ordinaria", () => {
  for (const y of [2023,2024] as const) {
    const {s,m,trabajo} = fixture(y)
    for (const clase of ["empleo-laboral","pension"] as const) {
      const h = s.historiaNacimientoMadrid!
      const hechos = { ...s, historiaNacimientoMadrid: { ...h, periodos: h.periodos.map(p => ({ ...p,
        personas: p.personas.map(x => x.id !== "s-1" ? x : { ...x, economia: { perfil: "solo-trabajo" as const,
          censoRentasCompleto: true as const, otrasRentas: "ninguna" as const, reduccionesBase: "ninguna" as const,
          saldosAnteriores: "ninguno" as const, trabajo: { ...trabajo, ejercicio: p.ejercicio,
            rendimientos: trabajo.rendimientos.map(r => ({ ...r, clase, integro: "17000" })),
          },
        } }),
      })) } }
      expect(evaluarAnualF2025(hechos,m).importeExactoRacional).toEqual(racional("721.70"))
    }
  }
})

for (const o of oraculos.bases) it(`Fraction base art19/20 ${o.ejercicio}/${o.bruto}`, () => {
  const {s,trabajo} = fixture(o.ejercicio === 2023 ? 2023 : 2024)
  const p = s.historiaNacimientoMadrid!.periodos[0]!
  const periodo = { ...p, personas: p.personas.map(x => x.id !== "s-1" ? x : { ...x,
    economia: { perfil: "solo-trabajo" as const, censoRentasCompleto: true as const,
      otrasRentas: "ninguna" as const, reduccionesBase: "ninguna" as const, saldosAnteriores: "ninguno" as const,
      trabajo: { ...trabajo, ejercicio: p.ejercicio, rendimientos: trabajo.rendimientos.map(r => ({ ...r,
        integro: o.bruto, cotizaciones: { clase: "efectivas" as const, seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" },
        sindicato: { importe: "0", satisfecho: "no" as const }, colegio: { ...r.colegio, importe: "0" }, defensa: { ...r.defensa, importe: "0" },
      })) },
    },
  }) }
  const b = producirBasesHistoriaNacimientoMadrid(periodo,"s-1").get("s-1")!
  expect(b.times(o.divisor).toFixed()).toBe(o.numerador)
})
