import { expect, it } from "vitest"
import { Effect, Result } from "effect"
import type {
  DerechosMinimos2025,
  DescendienteDerechos,
  TitularDescendiente,
} from "/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/lib/dominio/irpf/minimos/derechos-contrato"
import { calcularDerechosMinimos } from "/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/lib/dominio/irpf/minimos/derechos"
import { MINIMOS_ESTATALES_2025 } from "/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/lib/dominio/normativa/datos/minimos-autonomicos-2025"
import {
  liquidarIrpfAnualConDerechos,
  liquidarIrpfAnual,
} from "/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {
  sinDiscapacidad,
  type CasoFiscalAnual,
} from "/home/elies/.t3/worktrees/IRoboPF/t3-c190fe20/lib/dominio/irpf/caso-fiscal-anual"

const titular = (
  titularId = "s-1",
  renta = 2605600,
  grado = 1
): TitularDescendiente => ({
  titularId,
  grado,
  rentasNoExentasCentimos: renta,
  residenteIrpf: true,
  vinculo: { clase: "consanguinidad" },
  relacion: "convivencia",
  custodia: "no-procede",
  alimentosJudiciales: false,
  aplicaEspecialidadAlimentos: false,
})
const hijo = (
  sujetoId = "s-3",
  fechaNacimiento = "2017-12-31",
  titulares = [titular(), titular("s-2")]
): DescendienteDerechos => ({
  sujetoId,
  fechaNacimiento,
  edadDevengo: 2025 - Number(fechaNacimiento.slice(0, 4)),
  vivoAlDevengo: true,
  rentasNoExentasCentimos: 0,
  declaracion: { modalidad: "no-presenta" },
  discapacidad: sinDiscapacidad,
  titulares,
  titularesCompletos: true,
})
const hechos = (
  descendientes = [hijo(), hijo("s-4", "2020-12-31")]
): DerechosMinimos2025 => ({
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
  conciliacionRentasContribuyente: { perfil: "caso-anual-parcial", otrasRentasOGastosNoRepresentados: "ninguno" },
  descendientes,
})
const anual = (
  derechosMinimos: DerechosMinimos2025,
  bruto = 3000000,
  ahorro = 0
): CasoFiscalAnual & { derechosMinimos: DerechosMinimos2025 } => ({
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
        importeGananciaCentimos: ahorro,
        tratamientoMayores65: { _tag: "SinExencionMayores65" },
      },
    ],
  },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})
const calcular = (h: DerechosMinimos2025) =>
  Effect.runSync(calcularDerechosMinimos(h, MINIMOS_ESTATALES_2025))
const liquidar = (h: DerechosMinimos2025, bruto = 3000000, ahorro = 0) =>
  Effect.runSync(liquidarIrpfAnualConDerechos(anual(h, bruto, ahorro)))
const rechaza = (h: DerechosMinimos2025) => {
  const r = Effect.runSync(
    Effect.result(liquidarIrpfAnualConDerechos(anual(h)))
  )
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure._tag).toBe("ResultadoNoSoportado")
}

it.each([1, 2, 3, 4])("reparto %s titulares en helper y API anual", (n) => {
  const ts = Array.from({ length: n }, (_, i) => titular("s-" + (i + 1)))
  const h = hechos([
    hijo("s-10", "2017-12-31", ts),
    hijo("s-11", "2020-12-31", ts),
  ])
  expect(calcular(h).descendientes.toNumber()).toBe(5100 / n)
  expect(liquidar(h).cuotaMinimoPersonalCentimos).toBe(
    Math.round(
      ((5550 + 5100 / n) * 0.095 + (5956.65 + 5473.68 / n) * 0.085) * 100
    )
  )
})
it.each([799999, 800000, 800001])(
  "rentas %s y orden del superviviente elegible",
  (renta) => {
    const h = hechos([
      { ...hijo(), rentasNoExentasCentimos: renta },
      hijo("s-4", "2020-12-31"),
    ])
    expect(calcular(h).descendientes.toNumber()).toBe(
      renta > 800000 ? 1200 : 2550
    )
    expect(liquidar(h).cuotaMinimoPersonalCentimos).toBe(
      renta > 800000 ? 125704 : 150845
    )
  }
)
it.each([179999, 180000, 180001])("declaración %s", (renta) => {
  const h = hechos([
    {
      ...hijo(),
      rentasNoExentasCentimos: renta,
      declaracion: { modalidad: "individual", rentasCentimos: renta },
    },
  ])
  expect(calcular(h).descendientes.toNumber()).toBe(renta > 180000 ? 0 : 1200)
  liquidar(h)
})
it.each(["2000-12-31", "2001-01-01"])("cumpleaños edad 25 en %s", (fecha) => {
  const h = hechos([hijo("s-3", fecha)])
  expect(calcular(h).descendientes.toNumber()).toBe(
    fecha.startsWith("2000") ? 0 : 1200
  )
  liquidar(h)
})
it("discapacidad de adulto y renta excluyente", () => {
  const d = {
    ...hijo("s-3", "1990-12-31"),
    discapacidad: { _tag: "Discapacidad65OMas" },
  } satisfies DescendienteDerechos
  expect(calcular(hechos([d])).discapacidadFamiliares.toNumber()).toBe(6000)
  expect(
    calcular(
      hechos([{ ...d, rentasNoExentasCentimos: 800001 }])
    ).total.toNumber()
  ).toBe(5550)
  liquidar(hechos([d]))
})
it.each([799999, 800000, 800001])(
  "prioridad por renta del próximo %s",
  (renta) => {
    const h = hechos([
      hijo("s-3", "2017-12-31", [
        titular("s-1", 2605600, 2),
        titular("s-2", renta),
      ]),
    ])
    expect(calcular(h).descendientes.toNumber()).toBe(renta > 800000 ? 0 : 2400)
    liquidar(h)
  }
)
it.each([2022, 2023, 2024, 2025])("primer evento en %s", (year) => {
  const t = {
    ...titular(),
    vinculo: {
      clase: "adopcion",
      fechaInicioIncremento: year + "-12-31",
      fechaConstitucionVinculo: year + "-12-31",
      fundamento: "inscripcion-registro-civil",
      historialCompleto: true,
    },
  } satisfies TitularDescendiente
  expect(
    calcular(hechos([hijo("s-3", "2017-12-31", [t])])).descendientes.toNumber()
  ).toBe(year < 2023 ? 2400 : 5200)
  liquidar(hechos([hijo("s-3", "2017-12-31", [t])]))
})
it("menor tres y adopción no duplican incremento", () => {
  const t = {
    ...titular(),
    vinculo: {
      clase: "adopcion",
      fechaInicioIncremento: "2025-01-01",
      fechaConstitucionVinculo: "2025-01-01",
      fundamento: "inscripcion-registro-civil",
      historialCompleto: true,
    },
  } satisfies TitularDescendiente
  expect(
    calcular(hechos([hijo("s-3", "2023-01-01", [t])])).descendientes.toNumber()
  ).toBe(5200)
})
it.each([
  "acogimiento-temporal",
  "acogimiento-urgencia",
  "guarda-judicial",
] as const)("vínculo %s sin incremento por fecha", (clase) => {
  const t = { ...titular(), vinculo: { clase } }
  expect(
    calcular(hechos([hijo("s-3", "2017-01-01", [t])])).descendientes.toNumber()
  ).toBe(2400)
  expect(
    calcular(hechos([hijo("s-3", "2023-12-31", [t])])).descendientes.toNumber()
  ).toBe(5200)
})
it("convivencia dependencia custodia y alimentos", () => {
  const t = {
    ...titular("s-2"),
    relacion: "dependencia-economica",
    custodia: "sin-custodia",
  } satisfies TitularDescendiente
  expect(
    calcular(
      hechos([hijo("s-3", "2017-01-01", [titular(), t])])
    ).descendientes.toNumber()
  ).toBe(1200)
  expect(
    calcular(
      hechos([
        hijo("s-3", "2017-01-01", [
          titular(),
          { ...t, alimentosJudiciales: true },
        ]),
      ])
    ).descendientes.toNumber()
  ).toBe(2400)
  expect(
    calcular(
      hechos([
        hijo("s-3", "2017-01-01", [{ ...titular(), relacion: "ninguna" }]),
      ])
    ).descendientes.toNumber()
  ).toBe(0)
  rechaza(
    hechos([
      hijo("s-3", "2017-01-01", [
        { ...titular(), aplicaEspecialidadAlimentos: true },
      ]),
    ])
  )
})
it("censos duplicados IDs fechas y ámbito: errores tipados", () => {
  rechaza(hechos([hijo(), hijo()]))
  rechaza(hechos([hijo("s-3", "2017-12-31", [titular(), titular()])]))
  rechaza({ ...hechos(), contribuyenteId: "nombre-personal" })
  rechaza(hechos([{ ...hijo(), fechaNacimiento: "2017-02-29" }]))
  // @ts-expect-error frontera incompleta deliberada
  rechaza({ ...hechos(), descendientesCompletos: false })
  // @ts-expect-error devengo fuera de alcance deliberado
  rechaza({ ...hechos(), devengo: "2025-12-30" })
})
it("grados mixtos y tres grados son capacidad pendiente tipada", () => {
  rechaza(
    hechos([
      hijo("s-8", "2017-01-01", [
        titular(),
        titular("s-2", 0),
        titular("s-9", 0, 2),
      ]),
    ])
  )
  rechaza(
    hechos([
      hijo("s-8", "2017-01-01", [
        titular(),
        titular("s-2", 0, 2),
        titular("s-9", 0, 3),
      ]),
    ])
  )
})
it("remanentes separados a ahorro y rastro público", () => {
  const h = hechos([
    hijo("s-3", "2017-12-31", [titular("s-1", 2000000), titular("s-2")]),
    hijo("s-4", "2020-12-31", [titular("s-1", 2000000), titular("s-2")]),
  ])
  const r = liquidar(h, 0, 2000000)
  expect(r.baseLiquidableGeneralCentimos).toBe(0)
  expect(r.baseLiquidableAhorroCentimos).toBe(2000000)
  // estatal: 570+2100*.105=790.50; Madrid: 570+2693.49*.105=852.81645
  expect(r.cuotaMinimoPersonalAhorroCentimos).toBe(164332)
  expect(r.cuotaIntegraAhorroCentimos).toBe(408000)
  expect(r.cuotaLiquidaCentimos).toBe(243668)
  expect(JSON.stringify(r.rastro)).toContain("divisor 2")
  expect(JSON.stringify(r.rastro)).toContain("8693.49")
  expect(JSON.stringify(r.rastro)).not.toContain('"s-3"')
})
it("legacy rechaza derechos y describe perfil parcial", () => {
  const r = Effect.runSync(
    Effect.result(
      liquidarIrpfAnual(anual(hechos()), { modo: "compatible-legacy" })
    )
  )
  expect(Result.isFailure(r)).toBe(true)
  const c = anual(hechos())
  const antiguo = { ...c, derechosMinimos: undefined }
  const l = Effect.runSync(
    // @ts-expect-error omisión runtime explícita
    liquidarIrpfAnual(antiguo, { modo: "compatible-legacy" })
  )
  expect(JSON.stringify(l.rastro)).toContain("sin acreditar derecho ni reparto")
})
