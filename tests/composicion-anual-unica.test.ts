import { expect, it, vi } from "vitest"
import { Effect } from "effect"
import Decimal from "decimal.js"
import * as composicion from "../lib/dominio/irpf/liquidacion/composicion-anual"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
  liquidarIrpfAnualConDerechos,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {
  analitico,
  efectivo,
  conDerechos,
} from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"

it("ejemplos ejecutables: ambas entradas normalizan la misma base; no convierten hechos efectivos en estimados", () => {
  const spy = vi.spyOn(composicion, "componerLiquidacionAnual")
  try {
    const a = Effect.runSync(liquidarIrpfAnual(analitico, { modo: "canonico" }))
    const e = Effect.runSync(liquidarIrpfAnualExplicito(efectivo))
    expect(spy).toHaveBeenCalledTimes(2)
    const [na, ne] = spy.mock.calls.map(([entrada]) => entrada)
    expect(na.baseGeneral.toFixed()).toBe(ne.baseGeneral.toFixed())
    expect(na.cotizaciones.naturaleza).toBe("estimadas-perfil-uniforme")
    expect(ne.cotizaciones.naturaleza).toBe("efectivas")
    expect(ne.cotizaciones.trabajador.toFixed()).toBe("1944")
    expect(e.cuotaLiquidaLegal).toBe((a.cuotaLiquidaCentimos / 100).toString())
    if (efectivo.perfil !== "solo-trabajo") throw Error("fixture")
    const cambiado = Effect.runSync(
      liquidarIrpfAnualExplicito({
        ...efectivo,
        trabajo: {
          ...efectivo.trabajo,
          rendimientos: efectivo.trabajo.rendimientos.map((r) => ({
            ...r,
            cotizaciones: { ...r.cotizaciones, seguridadSocial: "1000.01" },
          })),
        },
      })
    )
    expect(cambiado.baseLiquidableGeneral).toBe("26999.99")
    expect(cambiado.cuotaLiquidaLegal).not.toBe(e.cuotaLiquidaLegal)
  } finally {
    spy.mockRestore()
  }
})
it("la composición equivalente conserva cuota sin depender de la etiqueta de cotización", () => {
  const entrada: composicion.EntradaComposicionAnual = {
    ambito: analitico,
    cotizaciones: {
      naturaleza: "efectivas",
      trabajador: new Decimal("1944.001"),
    },
    politica: "decimal-hasta-salida",
    precision: 80,
    baseGeneral: new Decimal("26055.999"),
    baseAhorro: new Decimal(0),
    rentasAntesReducciones: new Decimal("26055.999"),
    minimosEstatales: MINIMOS_ESTATALES_2025,
    deduccionesAutonomicasCentimos: 0,
  }
  const a = Effect.runSync(composicion.componerLiquidacionAnual(entrada))
  const b = Effect.runSync(
    composicion.componerLiquidacionAnual({
      ...entrada,
      cotizaciones: {
        ...entrada.cotizaciones,
        naturaleza: "estimadas-perfil-uniforme",
      },
    })
  )
  expect(a.cuotaLiquida.toFixed()).toBe(b.cuotaLiquida.toFixed())
  expect(a.cotizaciones.trabajador.toFixed()).toBe("1944.001")
  const open = Effect.runSync(
    composicion.componerLiquidacionAnual({
      ...entrada,
      politica: "open-empleo-madrid-2025",
    })
  )
  expect(open.cuotaLiquida.toFixed()).not.toBe(a.cuotaLiquida.toFixed())
  expect(
    Effect.runSync(
      Effect.exit(
        composicion.componerLiquidacionAnual({
          ...entrada,
          politica: "open-empleo-madrid-2025",
          cotizaciones: {
            ...entrada.cotizaciones,
            naturaleza: "estimadas-perfil-uniforme",
          },
        })
      )
    )._tag
  ).toBe("Failure")
})
it("el adaptador presenta la cuota y DA61 del motor una sola vez", () => {
  const original = composicion.componerLiquidacionAnual
  const spy = vi
    .spyOn(composicion, "componerLiquidacionAnual")
    .mockImplementation((entrada) =>
      original(entrada).pipe(
        Effect.map((resultado) => ({
          ...resultado,
          cuotaLiquida: new Decimal("123.45"),
          deduccionTrabajo: new Decimal("1.23"),
          cuotaPosterior: new Decimal("122.22"),
        }))
      )
    )
  try {
    const r = Effect.runSync(liquidarIrpfAnualExplicito(efectivo))
    expect(spy).toHaveBeenCalledTimes(1)
    expect(r.cuotaLiquidaLegal).toBe("123.45")
    expect(r.deduccionTrabajo).toBe("1.23")
    expect(r.cuotaDiferencial).toBe("122.22")
  } finally {
    spy.mockRestore()
  }
})
it("los derechos llegan a la composición y conservan reparto y rechazo de ámbitos", () => {
  const a = Effect.runSync(liquidarIrpfAnualConDerechos(conDerechos))
  const b = Effect.runSync(liquidarIrpfAnual(conDerechos, { modo: "canonico" }))
  expect(a.cuotaLiquidaCentimos).toBe(b.cuotaLiquidaCentimos)
  const linea = a.rastro.pasos
    .flatMap((p) => p.lineasCalculo ?? [])
    .find((l) => l.origen?.siteId === "anual.minimo.descendientes")
  expect(linea?.origen?.decimal).toBe("1200")
  expect(
    Effect.runSync(
      Effect.exit(
        liquidarIrpfAnual(
          { ...conDerechos, comunidadAutonoma: "canarias" },
          { modo: "canonico" }
        )
      )
    )._tag
  ).toBe("Failure")
})
