import { expect, it } from "vitest"
import { Effect, Result } from "effect"
import { calcularDerechosMinimos } from "../lib/dominio/irpf/minimos/derechos"
import type {
  DerechosMinimos2025,
  DescendienteDerechos,
  TitularDescendiente,
} from "../lib/dominio/irpf/minimos/derechos-contrato"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualConDerechos,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {
  sinDiscapacidad,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/caso-fiscal-anual"

const titular = (titularId: string): TitularDescendiente => ({
  titularId,
  grado: 1,
  vinculo: { clase: "consanguinidad" },
  relacion: "convivencia",
  custodia: "compartida",
  alimentosJudiciales: false,
  aplicaEspecialidadAlimentos: false,
  residenteIrpf: true,
  rentasNoExentasCentimos: 3000000,
})
const hijo = (
  sujetoId: string,
  edad: number,
  titulares = [titular("s-1"), titular("s-2")]
): DescendienteDerechos => ({
  sujetoId,
  edadDevengo: edad,
  fechaNacimiento: 2025 - edad + "-01-01",
  vivoAlDevengo: true,
  rentasNoExentasCentimos: 0,
  declaracion: { modalidad: "no-presenta" },
  discapacidad: sinDiscapacidad,
  titulares,
  titularesCompletos: true,
})
const hechos = (
  descendientes = [hijo("s-3", 8), hijo("s-4", 5)]
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
  descendientes,
})
const calcular = (entrada: DerechosMinimos2025) =>
  Effect.runSync(calcularDerechosMinimos(entrada, MINIMOS_ESTATALES_2025))
const error = (entrada: DerechosMinimos2025) => {
  const r = Effect.runSync(
    Effect.result(calcularDerechosMinimos(entrada, MINIMOS_ESTATALES_2025))
  )
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r))
    expect(r.failure._tag).toBe("DerechosMinimosNoSoportados")
}
it("dos titulares 2550 cada uno; único titular 5100", () => {
  expect(calcular(hechos()).descendientes.toNumber()).toBe(2550)
  expect(
    calcular({ ...hechos(), contribuyenteId: "s-2" }).descendientes.toNumber()
  ).toBe(2550)
  expect(
    calcular(
      hechos([
        hijo("s-3", 8, [titular("s-1")]),
        hijo("s-4", 5, [titular("s-1")]),
      ])
    ).descendientes.toNumber()
  ).toBe(5100)
})
it.each([
  [799999, 1200],
  [800000, 1200],
  [800001, 0],
])("renta no exenta %s", (renta, esperado) => {
  expect(
    calcular(
      hechos([{ ...hijo("s-3", 8), rentasNoExentasCentimos: renta }])
    ).descendientes.toNumber()
  ).toBe(esperado)
})
it.each([
  [179999, 1200],
  [180000, 1200],
  [180001, 0],
])("declaración propia %s", (renta, esperado) => {
  expect(
    calcular(
      hechos([
        {
          ...hijo("s-3", 8),
          rentasNoExentasCentimos: renta,
          declaracion: { modalidad: "individual", rentasCentimos: renta },
        },
      ])
    ).descendientes.toNumber()
  ).toBe(esperado)
})
it.each([
  [24, 1200],
  [25, 0],
  [26, 0],
])("edad %s", (edad, esperado) => {
  expect(calcular(hechos([hijo("s-3", edad)])).descendientes.toNumber()).toBe(
    esperado
  )
})
it("ordena elegibles, no la entrada; excluye mayores sin discapacidad antes de ordenar", () => {
  const r = calcular(hechos([hijo("s-4", 5), hijo("s-3", 8), hijo("s-5", 30)]))
  expect(r.atribuciones.map((a) => [a.sujetoId, a.orden])).toEqual([
    ["s-3", 1],
    ["s-4", 2],
  ])
})
it("discapacidad exige derecho y comparte el divisor", () => {
  const d = {
    ...hijo("s-3", 30),
    discapacidad: { _tag: "Discapacidad65OMas" },
  } satisfies DescendienteDerechos
  expect(calcular(hechos([d])).discapacidadFamiliares.toNumber()).toBe(6000)
  expect(
    calcular(
      hechos([{ ...d, rentasNoExentasCentimos: 800001 }])
    ).discapacidadFamiliares.toNumber()
  ).toBe(0)
})
it.each([
  [2, 2600],
  [3, 1200],
])("menor de tres, edad %s", (edad, esperado) => {
  expect(calcular(hechos([hijo("s-3", edad)])).descendientes.toNumber()).toBe(
    esperado
  )
})
it.each([
  [2022, 2400],
  [2023, 5200],
  [2024, 5200],
  [2025, 5200],
])("adopción desde %s sin reiniciar acogimiento previo", (anio, esperado) => {
  const t: TitularDescendiente = {
    ...titular("s-1"),
    vinculo: {
      clase: "adopcion",
      fechaInicioIncremento: anio + "-05-10",
      fundamento: "inscripcion-registro-civil",
      historialCompleto: true,
    },
  }
  expect(calcular(hechos([hijo("s-3", 8, [t])])).descendientes.toNumber()).toBe(
    esperado
  )
})
it("prioridad de grado próximo con rentas superiores a 8000", () => {
  const abuelo = { ...titular("s-1"), grado: 2 }
  expect(
    calcular(
      hechos([hijo("s-3", 8, [abuelo, titular("s-2")])])
    ).descendientes.toNumber()
  ).toBe(0)
  expect(
    calcular(
      hechos([
        hijo("s-3", 8, [
          abuelo,
          { ...titular("s-2"), rentasNoExentasCentimos: 800000 },
        ]),
      ])
    ).descendientes.toNumber()
  ).toBe(2400)
})
it("dependencia sin alimentos da derecho; pagador sin custodia no comparte mínimo", () => {
  const t: TitularDescendiente = {
    ...titular("s-2"),
    custodia: "sin-custodia",
    relacion: "dependencia-economica",
  }
  expect(
    calcular(
      hechos([hijo("s-3", 8, [titular("s-1"), t])])
    ).descendientes.toNumber()
  ).toBe(1200)
  expect(
    calcular(
      hechos([
        hijo("s-3", 8, [titular("s-1"), { ...t, alimentosJudiciales: true }]),
      ])
    ).descendientes.toNumber()
  ).toBe(2400)
  error(
    hechos([
      hijo("s-3", 8, [
        { ...titular("s-1"), aplicaEspecialidadAlimentos: true },
      ]),
    ])
  )
})
it("rechazos recuperables: ausencias, duplicados, fechas, contadores fraccionarios, exceso manual", () => {
  // @ts-expect-error prueba de frontera JavaScript: faltan hechos.
  error({})
  error(hechos([hijo("s-3", 8), hijo("s-3", 5)]))
  error(hechos([hijo("s-3", 8, [titular("s-1"), titular("s-1")])]))
  error(hechos([hijo("s-3", 8.5)]))
  error(hechos([hijo("s-3", 8, [{ ...titular("s-1"), grado: 1.5 }])]))
  error(hechos([{ ...hijo("s-3", 8), fechaNacimiento: "2017-02-30" }]))
  // @ts-expect-error un porcentaje manual no prueba derecho.
  error({ ...hechos(), porcentaje: 50 })
  // @ts-expect-error no hay vigencia acreditada para 2026.
  error({ ...hechos(), ejercicio: 2026 })
  // @ts-expect-error fallecimiento fuera de alcance, nunca silencio.
  error({ ...hechos(), fallecimientosEnElEjercicio: "uno" })
})
const anual = (derechos: DerechosMinimos2025): CasoFiscalAnual => ({
  anio: 2025,
  comunidadAutonoma: "madrid",
  derechosMinimos: derechos,
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    discapacidad: sinDiscapacidad,
    descendientes: [],
    ascendientes: [],
  },
  rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})
it("conexión anual aplica mínimos estatal y madrileño atribuidos", () => {
  const r = Effect.runSync(
    liquidarIrpfAnual(anual(hechos()), { modo: "canonico" })
  )
  // Estado: (5550+2550)*9,5%; Madrid: (5956,65+2736,84)*8,5%.
  expect(r.cuotaMinimoPersonalCentimos).toBe(150845)
})
it("legacy rechaza usar hechos nuevos y entrada anual incoherente falla sin Die", () => {
  const r = Effect.runSync(
    Effect.result(
      liquidarIrpfAnual(anual(hechos()), { modo: "compatible-legacy" })
    )
  )
  expect(Result.isFailure(r)).toBe(true)
  const s = Effect.runSync(
    Effect.result(
      liquidarIrpfAnual(
        { ...anual(hechos()), anio: 2026 },
        { modo: "canonico" }
      )
    )
  )
  expect(Result.isFailure(s)).toBe(true)
})
it("tres titulares no equivalen a mitad y cuarto/siguientes conservan orden", () => {
  const ts = [titular("s-1"), titular("s-2"), titular("s-9")]
  expect(calcular(hechos([hijo("s-3", 8, ts)])).descendientes.toNumber()).toBe(
    800
  )
  const r = calcular(
    hechos([
      hijo("s-3", 14),
      hijo("s-4", 12),
      hijo("s-5", 10),
      hijo("s-6", 8),
      hijo("s-7", 6),
    ])
  )
  expect(r.descendientes.toNumber()).toBe(9050)
})
it("rechaza falta de hechos, incompatibilidad anual y fechas especiales", () => {
  // @ts-expect-error un dato parcial no completa los derechos.
  error({ ...hechos(), descendientesCompletos: undefined })
  error(
    hechos([
      hijo("s-3", 8, [
        { ...titular("s-1"), custodia: "exclusiva", relacion: "ninguna" },
      ]),
    ])
  )
  error(
    hechos([
      hijo("s-3", 8, [
        { ...titular("s-1"), custodia: "exclusiva" },
        titular("s-2"),
      ]),
    ])
  )
  error(
    hechos([
      hijo("s-3", 8, [
        {
          ...titular("s-1"),
          vinculo: {
            clase: "adopcion",
            fechaInicioIncremento: "2026-01-01",
            fundamento: "inscripcion-registro-civil",
            historialCompleto: true,
          },
        },
      ]),
    ])
  )
  const caso = anual(hechos())
  const r = Effect.runSync(
    Effect.result(
      liquidarIrpfAnual(
        {
          ...caso,
          situacionFamiliar: {
            ...caso.situacionFamiliar,
            descendientes: [{ edad: 8, discapacidad: sinDiscapacidad }],
          },
        },
        { modo: "canonico" }
      )
    )
  )
  expect(Result.isFailure(r)).toBe(true)
})

it("ruta explícita exige hechos aunque JavaScript omita la propiedad", () => {
  const caso = anual(hechos())
  const r = Effect.runSync(
    liquidarIrpfAnualConDerechos({ ...caso, derechosMinimos: hechos() })
  )
  expect(r.cuotaMinimoPersonalCentimos).toBe(150845)
  const fallo = liquidarIrpfAnualConDerechos({
    ...caso,
    // @ts-expect-error frontera JavaScript deliberadamente incompleta.
    derechosMinimos: undefined,
  })
  expect(Result.isFailure(Effect.runSync(Effect.result(fallo)))).toBe(true)
})
it("identidad anónima no admite rentas contradictorias ni residencia incompatible", () => {
  error(
    hechos([
      hijo("s-3", 8),
      hijo("s-4", 5, [{ ...titular("s-1"), rentasNoExentasCentimos: 0 }]),
    ])
  )
  error(hechos([hijo("s-3", 8, [{ ...titular("s-1"), residenteIrpf: false }])]))
})
it("artículo 61: siguiente grado cuando el próximo no supera 8000", () => {
  const d = hijo("s-3", 8, [
    { ...titular("s-1"), grado: 2 },
    { ...titular("s-2"), rentasNoExentasCentimos: 800000 },
  ])
  expect(calcular(hechos([d])).descendientes.toNumber()).toBe(2400)
})
