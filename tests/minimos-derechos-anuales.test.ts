import Decimal from "decimal.js"
import { Effect, Result } from "effect"
import { expect, it } from "vitest"
import {
  familiaAnual,
  casoFamiliaAnual,
  territoriosFamilia,
} from "../docs/procedencia/reforma-motor/bloque-e/ejemplos-familia"
import {
  calcularDerechosMinimos,
  validarDerechosMinimos,
} from "../lib/dominio/irpf/minimos/derechos"
import type { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"
import {
  efectivo,
  derechos,
} from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { liquidarIrpfAnualConDerechos } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { MINIMOS_ESTATALES_2026 } from "../lib/dominio/normativa/datos/minimos-estatales-2026"
import { MINIMOS_ESTATALES_2012 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2012"
import {
  MINIMOS_ESTATALES_2025,
  obtenerMinimosAutonomicosIrpf2025,
} from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import { obtenerParametrosComunidadAutonoma } from "../lib/dominio/irpf/comunidades/comunidad-autonoma"
const ejercicios = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  2025, 2026,
] as const
const calcular = (h: DerechosMinimosAnuales) =>
  Effect.runSync(
    calcularDerechosMinimos(
      h,
      h.ejercicio <= 2014
        ? MINIMOS_ESTATALES_2012
        : h.ejercicio === 2026
          ? MINIMOS_ESTATALES_2026
          : MINIMOS_ESTATALES_2025
    )
  )
for (const ejercicio of ejercicios) {
  it.each(territoriosFamilia)(
    `${ejercicio}/%s: API anual y suma de ambos titulares`,
    (territorio) => {
      const h = familiaAnual(ejercicio, territorio)
      const padre = calcular(h),
        madre = calcular({ ...h, contribuyenteId: "s-2" })
      expect(padre.descendientes.plus(madre.descendientes).toFixed()).toBe(
        ejercicio <= 2014 ? "3876" : "5100"
      )
      expect(padre.contribuyente.toFixed()).toBe(
        ejercicio <= 2014 ? "5151" : "5550"
      )
      const r = Effect.runSync(
        Effect.result(liquidarIrpfAnualConDerechos(casoFamiliaAnual(h)))
      )
      const resultadoMadre = Effect.runSync(
        Effect.result(
          liquidarIrpfAnualConDerechos(
            casoFamiliaAnual({ ...h, contribuyenteId: "s-2" })
          )
        )
      )
      expect(Result.isSuccess(resultadoMadre)).toBe(true)
      expect(Result.isSuccess(r)).toBe(true)
      if (Result.isSuccess(r))
        expect(r.success.cuotaMinimoPersonalAhorroCentimos).toBeGreaterThan(0)
    }
  )
  it(`${ejercicio}: dependencia, alimentos, discapacidad, adopción y fronteras`, () => {
    const h = familiaAnual(ejercicio)
    const hijo = h.descendientes[0]!
    const unico = {
      ...h,
      descendientes: [{ ...hijo, titulares: [hijo.titulares[0]!] }],
    }
    const primero = ejercicio <= 2014 ? 1836 : 2400
    const dependencia = {
      ...unico,
      descendientes: [
        {
          ...unico.descendientes[0]!,
          titulares: [
            {
              ...hijo.titulares[0]!,
              custodia: "sin-custodia" as const,
              relacion: "dependencia-economica" as const,
            },
          ],
        },
      ],
    }
    expect(calcular(dependencia).descendientes.toNumber()).toBe(
      ejercicio <= 2014 ? 0 : primero
    )
    for (const renta of [800000, 800001])
      expect(
        calcular({
          ...unico,
          descendientes: [
            { ...unico.descendientes[0]!, rentasNoExentasCentimos: renta },
          ],
        }).descendientes.toNumber()
      ).toBe(renta === 800000 ? primero : 0)
    for (const renta of [180000, 180001])
      expect(
        calcular({
          ...unico,
          descendientes: [
            {
              ...unico.descendientes[0]!,
              declaracion: { modalidad: "individual", rentasCentimos: renta },
            },
          ],
        }).descendientes.toNumber()
      ).toBe(renta === 180000 ? primero : 0)
    expect(
      calcular({
        ...unico,
        descendientes: [
          {
            ...unico.descendientes[0]!,
            discapacidad: { _tag: "Discapacidad65OMas" },
          },
        ],
      }).discapacidadFamiliares.toNumber()
    ).toBe(ejercicio <= 2014 ? 9354 : 12000)
    for (const distancia of [0, 1, 2, 3]) {
      const fecha = `${ejercicio - distancia}-01-01`
      const adoptado: DerechosMinimosAnuales = {
        ...unico,
        descendientes: [
          {
            ...hijo,
            titulares: [
              {
                ...hijo.titulares[0]!,
                vinculo: {
                  clase: "adopcion",
                  fechaInicioIncremento: fecha,
                  fechaConstitucionVinculo: fecha,
                  fundamento: "inscripcion-registro-civil",
                  historialCompleto: true,
                },
              },
            ],
          },
        ],
      }
      expect(calcular(adoptado).descendientes.toNumber()).toBe(
        primero + (distancia <= 2 ? (ejercicio <= 2014 ? 2244 : 2800) : 0)
      )
    }
    const custodio = {
      ...unico,
      descendientes: [
        {
          ...unico.descendientes[0]!,
          titulares: [
            { ...hijo.titulares[0]!, custodia: "exclusiva" as const },
            {
              ...hijo.titulares[1]!,
              custodia: "sin-custodia" as const,
              relacion: "dependencia-economica" as const,
              alimentosJudiciales: true,
            },
          ],
        },
      ],
    }
    expect(calcular(custodio).descendientes.toNumber()).toBe(primero)
  })
}
it.each(["navarra", "pais-vasco", "bizkaia", "desconocida"])(
  "rechazo runtime explícito: %s",
  (territorio) => {
    const h = { ...familiaAnual(2025), territorio }
    expect(
      Result.isFailure(
        Effect.runSync(
          Effect.result(
            // @ts-expect-error frontera JavaScript con territorio no común.
            validarDerechosMinimos(h)
          )
        )
      )
    ).toBe(true)
    const r = obtenerParametrosComunidadAutonoma({
      anio: 2025,
      // @ts-expect-error frontera JavaScript del selector.
      comunidadAutonoma: territorio,
    })
    expect(r._tag).toBe("ComunidadAutonomaNoSoportada")
  }
)
it("mínimos autonómicos distintos y reparto de tres conserva 80 cifras", () => {
  const h = familiaAnual(2025, "andalucia")
  const r = Effect.runSync(
    calcularDerechosMinimos(h, obtenerMinimosAutonomicosIrpf2025("andalucia"))
  )
  expect(r.descendientes.toFixed()).toBe("2665")
  const d = h.descendientes[0]!
  const tercios = calcular({
    ...h,
    descendientes: [
      {
        ...d,
        titulares: [...d.titulares, { ...d.titulares[0]!, titularId: "s-9" }],
      },
    ],
  })
  expect(tercios.descendientes.toFixed()).toBe("800")
  expect(Decimal.precision).toBe(20)
})
it("devengo de otro ejercicio falla antes de calcular", () => {
  expect(
    Result.isFailure(
      Effect.runSync(
        Effect.result(
          validarDerechosMinimos({
            ...familiaAnual(2012),
            devengo: "2025-12-31",
          })
        )
      )
    )
  ).toBe(true)
})

it.each(territoriosFamilia)(
  "entrada efectiva 2025 familiar %s usa la composición única",
  (territorio) => {
    const h = { ...derechos, territorio }
    const r = Effect.runSync(
      liquidarIrpfAnualExplicito({
        ...efectivo,
        comunidadAutonoma: territorio,
        familiaresConDerechoMinimo: "segun-derechos",
        derechosMinimos: h,
      })
    )
    expect(r.rastro.contexto?.territorio).toBe(territorio)
    expect(r.componentesCuota.gravamenMinimoEstatal).toBe("641.25")
    expect(
      new Decimal(r.componentesCuota.cuotaEstatal)
        .plus(r.componentesCuota.cuotaAutonomica)
        .eq(r.cuotaLiquidaLegal)
    ).toBe(true)
  }
)
it("entrada efectiva rechaza marcadores contradictorios y rentas que no concilian", () => {
  for (const caso of [
    { ...efectivo, familiaresConDerechoMinimo: "segun-derechos" as const },
    { ...efectivo, derechosMinimos: derechos },
    {
      ...efectivo,
      familiaresConDerechoMinimo: "segun-derechos" as const,
      derechosMinimos: familiaAnual(2025),
    },
  ])
    expect(
      Result.isFailure(
        Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(caso)))
      )
    ).toBe(true)
})

it.each([2012, 2014, 2015, 2025] as const)(
  "alimentos propios con custodia compartida: procedimiento histórico %s",
  (ejercicio) => {
    const h = familiaAnual(ejercicio)
    const alimentos = {
      ...h,
      descendientes: h.descendientes.map((d) => ({
        ...d,
        titulares: d.titulares.map((t) => ({
          ...t,
          alimentosJudiciales: t.titularId === h.contribuyenteId,
        })),
      })),
    }
    const r = Effect.runSync(
      Effect.result(liquidarIrpfAnualConDerechos(casoFamiliaAnual(alimentos)))
    )
    expect(Result.isFailure(r)).toBe(ejercicio <= 2014)
  }
)
it("tercer hijo Madrid 2012 conserva la cuantía autonómica histórica", () => {
  const h = familiaAnual(2012)
  const d = h.descendientes[0]!
  const tres = {
    ...h,
    descendientes: [
      ...h.descendientes,
      { ...d, sujetoId: "s-5", edadDevengo: 4, fechaNacimiento: "2008-01-01" },
    ],
  }
  const p = obtenerParametrosComunidadAutonoma({
    anio: 2012,
    comunidadAutonoma: "madrid",
  })
  expect(p._tag).toBe("ParametrosComunidadAutonoma")
  if (p._tag === "ParametrosComunidadAutonoma") {
    const autonomico = Effect.runSync(
      calcularDerechosMinimos(tres, p.minimosAutonomicos)
    )
    expect(autonomico.descendientes.toFixed()).toBe("3957.6")
    expect(calcular(tres).descendientes.toFixed()).toBe("3774")
  }
})
