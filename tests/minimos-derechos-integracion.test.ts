import { expect, it } from "vitest"
import { Effect, Result } from "effect"
import type {
  DerechosMinimos2025,
  DescendienteDerechos,
  TitularDescendiente,
} from "../lib/dominio/irpf/minimos/derechos-contrato"
import { sinDiscapacidad } from "../lib/dominio/irpf/caso-fiscal-anual"
import { liquidarIrpfAnualConDerechos } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

const titular = (
  titularId = "s-1",
  rentasNoExentasCentimos = 2605600,
  grado = 1
): TitularDescendiente => ({
  titularId,
  grado,
  rentasNoExentasCentimos,
  vinculo: { clase: "consanguinidad" },
  relacion: "convivencia",
  custodia: "no-procede",
  alimentosJudiciales: false,
  aplicaEspecialidadAlimentos: false,
  residenteIrpf: true,
})
const hijo = (
  titulares = [titular()],
  fechaNacimiento = "2017-12-31"
): DescendienteDerechos => ({
  sujetoId: "s-3",
  fechaNacimiento,
  edadDevengo: 2025 - Number(fechaNacimiento.slice(0, 4)),
  vivoAlDevengo: true,
  rentasNoExentasCentimos: 0,
  declaracion: { modalidad: "no-presenta" },
  discapacidad: sinDiscapacidad,
  titulares,
  titularesCompletos: true,
})
const hechos = (descendiente: DescendienteDerechos): DerechosMinimos2025 => ({
  ejercicio: 2025,
  territorio: "madrid",
  regimen: "comun",
  modalidad: "individual",
  devengo: "2025-12-31",
  contribuyenteId: "s-1",
  edadContribuyenteDevengo: 40,
  discapacidadContribuyente: sinDiscapacidad,
  ascendientes: "ninguno",
  fallecimientosEnElEjercicio: "ninguno",
  descendientesCompletos: true,
  conciliacionRentasContribuyente: {
    perfil: "caso-anual-parcial",
    otrasRentasOGastosNoRepresentados: "ninguno",
  },
  descendientes: [descendiente],
})
const anual = (
  derechosMinimos: DerechosMinimos2025,
  bruto = 3000000,
  ganancia = 0
) =>
  liquidarIrpfAnualConDerechos({
    anio: 2025,
    comunidadAutonoma: "madrid",
    derechosMinimos,
    situacionFamiliar: {
      tipo: "individual",
      edad: 40,
      discapacidad: sinDiscapacidad,
      descendientes: [],
      ascendientes: [],
    },
    rendimientos: {
      trabajo: [{ importeIntegroCentimos: bruto }],
      gananciasPatrimoniales: [
        {
          importeGananciaCentimos: ganancia,
          tratamientoMayores65: { _tag: "SinExencionMayores65" },
        },
      ],
    },
    reducciones: [],
    deducciones: [],
    retencionesSoportadasCentimos: 0,
    pagosACuentaCentimos: 0,
  })

it("MDV1-02: no deduce edad al adoptar de la fecha de inscripción o de un acogimiento previo", () => {
  const t: TitularDescendiente = {
    ...titular(),
    vinculo: {
      clase: "adopcion",
      fechaInicioIncremento: "2025-01-02",
      fundamento: "inscripcion-registro-civil",
      historialCompleto: true,
    },
  }
  const r = Effect.runSync(
    Effect.result(anual(hechos(hijo([t], "2007-12-31"))))
  )
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain("constitución")
})

it("MDV1-01: rechaza renta cero incompatible con el rendimiento del caso anual", () => {
  const h = hechos(hijo([titular("s-1", 0), titular("s-2", 3000000, 2)]))
  const resultado = Effect.runSync(Effect.result(anual(h)))
  expect(Result.isFailure(resultado)).toBe(true)
  if (Result.isFailure(resultado))
    expect(resultado.failure.motivo).toContain("renta")
})

it("MDV1-02: adopción a los 17 años antes del cumpleaños conserva el incremento", () => {
  const adoptante: TitularDescendiente = {
    ...titular(),
    vinculo: {
      clase: "adopcion",
      fechaInicioIncremento: "2025-01-02",
      fechaConstitucionVinculo: "2025-01-02",
      fundamento: "inscripcion-registro-civil",
      historialCompleto: true,
    },
  }
  const resultado = Effect.runSync(
    anual(hechos(hijo([adoptante], "2007-12-31")))
  )
  // Estado 10750 × 0,095; Madrid 11537,66 × 0,085, sin dividir el mínimo propio.
  expect(resultado.cuotaMinimoPersonalCentimos).toBe(200195)
})

it("MDV1-03: rechaza alimentos propios sin custodia aunque el flag de especialidad sea falso", () => {
  const pagador: TitularDescendiente = {
    ...titular(),
    relacion: "dependencia-economica",
    custodia: "sin-custodia",
    alimentosJudiciales: true,
  }
  const custodio: TitularDescendiente = {
    ...titular("s-2"),
    custodia: "exclusiva",
  }
  const resultado = Effect.runSync(
    Effect.result(anual(hechos(hijo([pagador, custodio]))))
  )
  expect(Result.isFailure(resultado)).toBe(true)
  if (Result.isFailure(resultado))
    expect(resultado.failure.motivo).toContain("alimentos")
})

it("constitución menor e inscripción tras el cumpleaños son fechas distintas", () => {
  const t: TitularDescendiente = {
    ...titular(),
    vinculo: {
      clase: "adopcion",
      fechaConstitucionVinculo: "2025-06-14",
      fechaInicioIncremento: "2025-06-16",
      fundamento: "inscripcion-registro-civil",
      historialCompleto: true,
    },
  }
  expect(
    Effect.runSync(anual(hechos(hijo([t], "2007-06-15"))))
      .cuotaMinimoPersonalCentimos
  ).toBe(200195)
})

it("un incremento iniciado con acogimiento no convierte una adopción adulta en menor", () => {
  const t: TitularDescendiente = {
    ...titular(),
    vinculo: {
      clase: "adopcion",
      fechaConstitucionVinculo: "2025-06-16",
      fechaInicioIncremento: "2024-06-01",
      fundamento: "inscripcion-registro-civil",
      historialCompleto: true,
    },
  }
  const r = Effect.runSync(
    Effect.result(anual(hechos(hijo([t], "2007-06-15"))))
  )
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain("mayoría de edad")
})

it.each(["2025-01-02", "2025-12-30"])(
  "adopción antes del cumpleaños: %s",
  (fecha) => {
    const t: TitularDescendiente = {
      ...titular(),
      vinculo: {
        clase: "adopcion",
        fechaInicioIncremento: fecha,
        fechaConstitucionVinculo: fecha,
        fundamento: "inscripcion-registro-civil",
        historialCompleto: true,
      },
    }
    expect(
      Effect.runSync(anual(hechos(hijo([t], "2007-12-31"))))
        .cuotaMinimoPersonalCentimos
    ).toBe(200195)
  }
)

it.each(["2025-06-15", "2025-06-16"])(
  "adopción adulta fuera del alcance: %s",
  (fecha) => {
    const t: TitularDescendiente = {
      ...titular(),
      vinculo: {
        clase: "adopcion",
        fechaInicioIncremento: fecha,
        fechaConstitucionVinculo: fecha,
        fundamento: "inscripcion-registro-civil",
        historialCompleto: true,
      },
    }
    const r = Effect.runSync(
      Effect.result(anual(hechos(hijo([t], "2007-06-15"))))
    )
    expect(Result.isFailure(r)).toBe(true)
    if (Result.isFailure(r))
      expect(r.failure.motivo).toContain("mayoría de edad")
  }
)

it("el aniversario bisiesto incierto se rechaza explícitamente", () => {
  const t: TitularDescendiente = {
    ...titular(),
    vinculo: {
      clase: "adopcion",
      fechaInicioIncremento: "2022-02-28",
      fechaConstitucionVinculo: "2022-02-28",
      fundamento: "inscripcion-registro-civil",
      historialCompleto: true,
    },
  }
  const r = Effect.runSync(
    Effect.result(anual(hechos(hijo([t], "2004-02-29"))))
  )
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain("bisiesto")
})

it.each([false, true])(
  "alimentos de otro titular no bloquean al custodio: flag %s",
  (aplica) => {
    const pagador: TitularDescendiente = {
      ...titular("s-2"),
      relacion: "dependencia-economica",
      custodia: "sin-custodia",
      alimentosJudiciales: true,
      aplicaEspecialidadAlimentos: aplica,
    }
    const custodio: TitularDescendiente = {
      ...titular(),
      custodia: "exclusiva",
    }
    const r = Effect.runSync(anual(hechos(hijo([custodio, pagador]))))
    // (5550 + 2400) × 0,095 + (5956,65 + 2575,85) × 0,085 = 1480,5125.
    expect(r.cuotaMinimoPersonalCentimos).toBe(148051)
  }
)

it("renta laboral se concilia antes del art.20 y no con el bruto o la base", () => {
  // 10000 - 648 - 2000 = 7352, antes de la reducción del trabajo.
  const h = hechos(hijo([titular("s-1", 735200), titular("s-2", 3000000, 2)]))
  const r = Effect.runSync(anual(h, 1000000))
  expect(r.rendimientoNetoTrabajoCentimos).toBe(735200)
  expect(JSON.stringify(r.rastro)).toContain(
    "renta propia conciliada internamente"
  )
  expect(r.baseLiquidableGeneralCentimos).toBeLessThan(735200)
  for (const renta of [1000000, r.baseLiquidableGeneralCentimos]) {
    const incorrecto = hechos(hijo([titular("s-1", renta)]))
    expect(
      Result.isFailure(
        Effect.runSync(Effect.result(anual(incorrecto, 1000000)))
      )
    ).toBe(true)
  }
})

it("suma pérdidas sin el truncamiento de la base del ahorro", () => {
  // Renta 26056 - 20000 = 6056; la base del ahorro no puede borrar la pérdida.
  const h = hechos(hijo([titular("s-1", 605600), titular("s-2", 3000000, 2)]))
  const r = Effect.runSync(anual(h, 3000000, -2000000))
  expect(r.baseLiquidableAhorroCentimos).toBe(0)
  expect(r.cuotaMinimoPersonalCentimos).toBe(103357)
  const incorrecto = hechos(hijo([titular("s-1", 2605600)]))
  expect(
    Result.isFailure(
      Effect.runSync(Effect.result(anual(incorrecto, 3000000, -2000000)))
    )
  ).toBe(true)
})

it("renta exclusiva del ahorro conserva mínimos separados", () => {
  const h = hechos(hijo([titular("s-1", 2000000)]))
  const r = Effect.runSync(anual(h, 0, 2000000))
  expect(r.baseLiquidableGeneralCentimos).toBe(0)
  expect(r.baseLiquidableAhorroCentimos).toBe(2000000)
  expect(r.cuotaMinimoPersonalAhorroCentimos).toBeGreaterThan(0)
})

it("la representación en céntimos no puede cambiar de lado el límite de renta", () => {
  // 10692,90 × (1 - 0,0648) - 2000 = 8000,00008, estrictamente superior.
  const h = hechos(hijo([titular("s-1", 800000), titular("s-2", 3000000, 2)]))
  const r = Effect.runSync(Effect.result(anual(h, 1069290)))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain("renta")
})

it("el perfil parcial exige declarar que no quedan rentas o gastos fuera de su representación", () => {
  const { conciliacionRentasContribuyente, ...sinConciliar } = hechos(hijo())
  expect(conciliacionRentasContribuyente?.perfil).toBe("caso-anual-parcial")
  const r = Effect.runSync(Effect.result(anual(sinConciliar)))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure.motivo).toContain("conciliación")
})
