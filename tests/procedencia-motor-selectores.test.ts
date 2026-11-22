// La proyección del motor ha de leer escalas y mínimos de 2025 por el mismo
// camino que la liquidación. Se altera ese camino (los selectores y la capa de
// parámetros) sin tocar las constantes que exportan los datos: si la
// proyección leyera las constantes, seguiría dando la tarifa vieja.
import { describe, expect, it, vi } from "vitest"
import Decimal from "decimal.js"
import { Effect } from "effect"

import {
  obtenerParametrosComunidadAutonoma,
  ParametrosNormativosIrpf,
} from "../lib/dominio/irpf/comunidades/comunidad-autonoma"
import { calcularCuotaPorEscala } from "../lib/dominio/irpf/cuotas/escalas-gravamen"
import { calcularCuotaPorEscalaAhorro } from "../lib/dominio/irpf/cuotas/cuota-integra-ahorro"
import {
  obtenerTramosIrpfAhorro,
  TRAMOS_IRPF_AHORRO_2025,
} from "../lib/dominio/normativa/datos/irpf-estatal-2012-2026"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import {
  proyectarEscala,
  proyectarMotor2025,
} from "../lib/procedencia/motor-2025"
import type { ValorMotor } from "../lib/procedencia/resultado"
import {
  TERRITORIOS_AUTONOMICOS,
  textoClave,
} from "../lib/procedencia/vocabulario"

const estado = vi.hoisted(() => ({
  // null: la escala estatal cambia en todos los territorios; un territorio:
  // sólo en ese.
  estatalSoloEn: null as string | null,
  // Parte el último tramo: un corte nuevo un millón por encima del último y un
  // punto más de tipo por encima de él. Es la mutación que deja la constante
  // intacta y cambia lo que ejecuta la liquidación.
  partir: (
    tramos: ReadonlyArray<readonly [Decimal, Decimal]>
  ): ReadonlyArray<readonly [Decimal, Decimal]> => {
    const cerrados = tramos.slice(0, -1)
    const [abierto, tipo] = tramos.at(-1) as readonly [Decimal, Decimal]
    const inicio = cerrados.at(-1)?.[0] ?? tipo.minus(tipo)
    return [
      ...cerrados,
      [inicio.plus(1_000_000), tipo],
      [abierto, tipo.plus("0.01")],
    ]
  },
}))

vi.mock(
  import("../lib/dominio/normativa/datos/irpf-estatal-2012-2026"),
  async (importOriginal) => {
    const original = await importOriginal()
    return {
      ...original,
      obtenerTramosIrpfAhorro: (anio) =>
        anio === 2025
          ? (estado.partir(original.TRAMOS_IRPF_AHORRO_2025) as never)
          : original.obtenerTramosIrpfAhorro(anio),
    }
  }
)

vi.mock(
  import("../lib/dominio/irpf/comunidades/comunidad-autonoma"),
  async (importOriginal) => {
    const original = await importOriginal()
    const { Effect, Layer } = await import("effect")
    const servicio = Effect.runSync(
      original.ParametrosNormativosIrpf.asEffect().pipe(
        Effect.provide(original.ParametrosNormativosIrpf.layer)
      )
    )
    const general = servicio.minimosEstatales2025.contribuyente.general
    class ParametrosMutados extends original.ParametrosNormativosIrpf {
      static override readonly layer = Layer.succeed(
        original.ParametrosNormativosIrpf,
        {
          ...servicio,
          minimosEstatales2025: {
            ...servicio.minimosEstatales2025,
            contribuyente: {
              ...servicio.minimosEstatales2025.contribuyente,
              general: general.plus(1),
            },
          },
        }
      )
    }
    return {
      ...original,
      ParametrosNormativosIrpf: ParametrosMutados,
      obtenerParametrosComunidadAutonoma: (entrada) => {
        const parametros = original.obtenerParametrosComunidadAutonoma(entrada)
        if (
          entrada.anio !== 2025 ||
          parametros._tag !== "ParametrosComunidadAutonoma"
        ) {
          return parametros
        }
        const minimos = parametros.minimosAutonomicos
        return {
          ...parametros,
          escalaEstatalGeneral:
            estado.estatalSoloEn === null ||
            estado.estatalSoloEn === entrada.comunidadAutonoma
              ? (estado.partir(parametros.escalaEstatalGeneral) as never)
              : parametros.escalaEstatalGeneral,
          escalaAutonomica: {
            ...parametros.escalaAutonomica,
            tramos: estado.partir(parametros.escalaAutonomica.tramos) as never,
          },
          minimosAutonomicos: {
            ...minimos,
            contribuyente: {
              ...minimos.contribuyente,
              general: minimos.contribuyente.general.plus(1),
            },
          },
        }
      },
    }
  }
)

const proyectado = () =>
  Effect.runSync(
    Effect.gen(function* () {
      return yield* proyectarMotor2025()
    })
  )

const deMagnitud = (
  valores: ReadonlyArray<ValorMotor>,
  territorio: string,
  magnitud: string
) =>
  valores.filter(
    (v) => v.clave.territorio === territorio && v.clave.magnitud === magnitud
  )

const escalaEsperada = (
  territorio: Parameters<typeof proyectarEscala>[0],
  magnitud: Parameters<typeof proyectarEscala>[1],
  tramos: Parameters<typeof proyectarEscala>[2]
) => {
  const r = proyectarEscala(territorio, magnitud, tramos)
  if (r._tag !== "Success") throw new Error("escala inválida")
  return r.success
}

const parametros2025 = (
  territorio: (typeof TERRITORIOS_AUTONOMICOS)[number]
) => {
  const p = obtenerParametrosComunidadAutonoma({
    anio: 2025,
    comunidadAutonoma: territorio,
  })
  if (p._tag !== "ParametrosComunidadAutonoma") throw new Error(p.motivo)
  return p
}

describe("la proyección lee por el camino de la liquidación de 2025", () => {
  it("la mutación alcanza a la liquidación sin tocar la constante", () => {
    const base = new Decimal(2_000_000)
    expect(
      calcularCuotaPorEscalaAhorro({ anio: 2025, base }).eq(
        calcularCuotaPorEscala({ base, tramos: TRAMOS_IRPF_AHORRO_2025 })
      )
    ).toBe(false)
  })

  it("escalas generales, escala del ahorro y mínimos son, valor a valor, los del selector", () => {
    estado.estatalSoloEn = null
    const valores = proyectado()
    const minimosEstatales = Effect.runSync(
      ParametrosNormativosIrpf.asEffect().pipe(
        Effect.provide(ParametrosNormativosIrpf.layer)
      )
    ).minimosEstatales2025
    expect(
      minimosEstatales.contribuyente.general.eq(
        MINIMOS_ESTATALES_2025.contribuyente.general
      )
    ).toBe(false)

    expect(deMagnitud(valores, "estatal", "escala-ahorro-agregada")).toEqual(
      escalaEsperada(
        "estatal",
        "escala-ahorro-agregada",
        obtenerTramosIrpfAhorro(2025)
      )
    )
    expect(deMagnitud(valores, "estatal", "escala-general-estatal")).toEqual(
      escalaEsperada(
        "estatal",
        "escala-general-estatal",
        parametros2025("madrid").escalaEstatalGeneral
      )
    )
    for (const territorio of TERRITORIOS_AUTONOMICOS) {
      const p = parametros2025(territorio)
      expect(
        deMagnitud(valores, territorio, "escala-general-autonomica")
      ).toEqual(
        escalaEsperada(
          territorio,
          "escala-general-autonomica",
          p.escalaAutonomica.tramos
        )
      )
      expect(
        valores.find(
          (v) =>
            textoClave(v.clave) ===
            `${territorio}|minimos-personales-familiares|contribuyente|general`
        )?.valor
      ).toEqual({
        _tag: "Numero",
        decimal: p.minimosAutonomicos.contribuyente.general.toFixed(),
      })
    }
    expect(
      valores.find(
        (v) =>
          textoClave(v.clave) ===
          "estatal|minimos-personales-familiares|contribuyente|general"
      )?.valor
    ).toEqual({
      _tag: "Numero",
      decimal: minimosEstatales.contribuyente.general.toFixed(),
    })
  })

  it("una escala estatal distinta en un solo territorio es un error tipado", () => {
    estado.estatalSoloEn = "la-rioja"
    const salida = Effect.runSync(
      Effect.gen(function* () {
        return yield* proyectarMotor2025()
      }).pipe(Effect.flip)
    )
    estado.estatalSoloEn = null
    expect(salida).toMatchObject({
      _tag: "DatoDelMotorInvalido",
      territorio: "la-rioja",
      magnitud: "escala-general-estatal",
    })
  })
})
