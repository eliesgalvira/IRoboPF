import { expect, test } from "vitest"
import { composeSS, validateSS } from "../scripts/procedencia/flujo-ss-r36.mjs"
import { createSSEvaluator } from "../scripts/procedencia/flujo-ss-r36-consumidor.mjs"
import { verifyCausalSS } from "../scripts/procedencia/causal-ss-r54.ts"
import type {
  ExecutionEvidence,
  Event,
} from "../scripts/procedencia/evidencia-ejecucion-r54.ts"
import Decimal from "decimal.js"
import { calcularDesgloseCotizacionesSocialesLegacy } from "../lib/dominio/laboral/cotizaciones-sociales"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../lib/dominio/laboral/cotizaciones-perfil-uniforme"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"
const g = composeSS(),
  evaluate = createSSEvaluator(g)
function run(
  caso: ReturnType<typeof make>,
  context: { modo: string },
  mode: boolean | "causal" = false,
) {
  const result = evaluate(caso, context, mode)
  if (mode === "causal" && !("evidence" in result)) throw Error("Sin evidencia")
  return {
    ...result,
    evidence: "evidence" in result ? result.evidence : undefined,
  }
}
const make = (anio: AnioFiscal, cents: number[]) => ({
  anio,
  rendimientos: {
    trabajo: cents.map((importeIntegroCentimos) => ({
      importeIntegroCentimos,
    })),
  },
})
const fields = [
  "baseOrdinaria",
  "excesoBase",
  "cotizacionEmpresarialOrdinaria",
  "cotizacionTrabajadorOrdinaria",
  "meiEmpresarial",
  "meiTrabajador",
  "solidaridadEmpresarial",
  "solidaridadTrabajador",
  "cotizacionEmpresarial",
  "cotizacionTrabajador",
] as const
const sample = make(2025, [1234567, 7654321]),
  context = { modo: "canonico" }
const evidence = () => {
  const e = run(sample, context, "causal").evidence
  if (e === undefined) throw Error("Sin evidencia")
  return e
}
const event = (e: ExecutionEvidence, p: (e: Event) => boolean) => {
  const v = e.events.find(p)
  if (v === undefined) throw Error("Mutación sin objetivo")
  return v
}
const check = (e: ExecutionEvidence) =>
  verifyCausalSS(g, e, sample, context, e.execution)

for (const anio of [2018, 2022, 2023, 2025, 2026] as const)
  for (const modo of ["canonico", "compatible-legacy"])
    test(`equivalencia real por propiedad ${anio}/${modo}`, () => {
      const max = anio === 2025 ? 58914 : anio === 2026 ? 61214.4 : 45014.4
      for (const cents of [
        [],
        [0],
        [1234567, 7654321],
        [1234567, 1234567],
        [Math.round(max * 110) - 1],
        [Math.round(max * 110)],
        [Math.round(max * 110) + 1],
        [Math.round(max * 150) - 1],
        [Math.round(max * 150) + 1],
      ]) {
        const caso = make(anio, cents),
          ctx = { modo },
          result = run(caso, ctx, "causal")
        const e = result.evidence!
        expect(verifyCausalSS(g, e, caso, ctx, e.execution)).toBe(true)
        const bruto = new Decimal(
          cents.reduce((a, b) => a + BigInt(b), 0n).toString(),
        ).div(100)
        const real = (
          modo === "canonico"
            ? calcularDesgloseCotizacionesPerfilUniforme
            : calcularDesgloseCotizacionesSocialesLegacy
        )({ anio, salarioBrutoAnual: bruto })
        fields.forEach((key, i) =>
          expect(
            new Decimal(e.outputs[i].decimal)
              .minus(real[key])
              .abs()
              .lt("1e-12"),
          ).toBe(true),
        )
        expect(
          new Decimal(e.outputs[10].decimal).eq(
            bruto.plus(real.cotizacionEmpresarial),
          ),
        ).toBe(true)
        expect(result.lines).toEqual(run(caso, ctx).lines)
      }
    })

// Expectativa racional propia: céntimos/100; base 58914; ratios 314/1000,
// 635/10000,67/10000,13/10000; bandas 5891.4 y 23565.6, resto 517.88.
// Las últimas bandas se calculan en el control siguiente con enteros BigInt.
function fraction(n: bigint, d: bigint): Decimal {
  return new Decimal(n.toString()).div(d.toString())
}
test("once expectativas propias racionales y visual separado", () => {
  const e = evidence(),
    s = fraction(8888888n, 100n),
    base = new Decimal(58914),
    excess = s.minus(base)
  const first = base.div(10),
    second = base.mul(4).div(10),
    third = excess.minus(base.div(2))
  const solidarityE = first
    .mul(fraction(77n, 10000n))
    .plus(second.mul(fraction(83n, 10000n)))
    .plus(third.mul(fraction(98n, 10000n)))
  const solidarityT = first
    .mul(fraction(15n, 10000n))
    .plus(second.mul(fraction(17n, 10000n)))
    .plus(third.mul(fraction(19n, 10000n)))
  const ordinaryE = base.mul(fraction(314n, 1000n)),
    ordinaryT = base.mul(fraction(635n, 10000n)),
    meiE = base.mul(fraction(67n, 10000n)),
    meiT = base.mul(fraction(13n, 10000n))
  const totalE = ordinaryE.plus(meiE).plus(solidarityE),
    totalT = ordinaryT.plus(meiT).plus(solidarityT)
  const values = [
    base,
    excess,
    ordinaryE,
    ordinaryT,
    meiE,
    meiT,
    solidarityE,
    solidarityT,
    totalE,
    totalT,
    s.plus(totalE),
  ]
  values.forEach((value, i) => {
    expect(e.outputs[i].decimal).toBe(value.toFixed())
    expect(e.outputs[i].display).toBe(value.toFixed(2) + " euros")
  })
  expect(e.outputs[4].decimal).not.toBe(
    new Decimal(e.outputs[4].decimal).toFixed(2),
  )
})
test("2018 saturación propia siete/cinco meses y ambas ramas", () => {
  const caso = make(2018, [2000000, 2524000])
  expect(
    run(caso, { modo: "canonico" }, "causal").evidence!.outputs[0].decimal,
  ).toBe("45108.4")
  expect(
    run(caso, { modo: "compatible-legacy" }, "causal").evidence!.outputs[0]
      .decimal,
  ).toBe("45014.4")
})
test("vertical base desde dos salarios sin MEI; bindings, selecciones, conversión individual", () => {
  const caso = make(2025, [1000000, 2000000]),
    e = run(caso, context, "causal").evidence!
  const ids = new Set(e.outputs[0].slice),
    slice = e.events.filter((x) => ids.has(x.id))
  expect(e.outputs[0].decimal).toBe("30000")
  expect(
    slice
      .filter(
        (x) =>
          x.operation === "input" &&
          x.property.endsWith("importeIntegroCentimos"),
      )
      .map((x) => x.value),
  ).toEqual([1000000, 2000000])
  expect(
    slice.some(
      (x) =>
        x.operation === "annual-binding" &&
        x.property === "rendimientoIntegroTrabajo",
    ),
  ).toBe(true)
  expect(
    slice.some(
      (x) =>
        x.operation === "annual-binding" &&
        x.property === "cotizacionesSociales/baseOrdinaria",
    ),
  ).toBe(true)
  const meiNodes = new Set(
    g.cells.filter((x) => x.path.includes("obtenerTiposMei")).map((x) => x.id),
  )
  expect(slice.some((x) => meiNodes.has(x.node))).toBe(false)
})
test("repetidos, llamadas independientes y copia pública sin efecto sobre siguiente evaluación", () => {
  const caso = make(2025, [100, 100]),
    first = run(caso, context, "causal").evidence!,
    second = run(caso, context, "causal").evidence!
  expect(first.execution).not.toBe(second.execution)
  const params = first.events.filter(
    (x) =>
      x.operation === "parameter:1" &&
      x.property.endsWith("/importeIntegroCentimos"),
  )
  expect(new Set(params.map((x) => x.frame)).size).toBeGreaterThanOrEqual(2)
  first.outputs[0].decimal = "false"
  expect(run(caso, context, "causal").evidence!.outputs[0].decimal).toBe("2")
})
const mutations: [string, (e: ExecutionEvidence) => void][] = [
  [
    "binding sin dependencia",
    (e) => {
      event(
        e,
        (x) =>
          x.operation === "annual-binding" &&
          x.property === "cotizacionesSociales/baseOrdinaria",
      ).edges = []
    },
  ],
  [
    "lado con cero igual",
    (e) => {
      event(
        e,
        (x) => x.operation === "property" && x.property === "trabajador",
      ).property = "empresarial"
    },
  ],
  [
    "selector modo",
    (e) => {
      event(
        e,
        (x) => x.operation === "input" && x.property === "contexto/modo",
      ).value = "compatible-legacy"
    },
  ],
  [
    "selector año",
    (e) => {
      event(
        e,
        (x) => x.operation === "input" && x.property === "caso/anio",
      ).value = 2026
    },
  ],
  [
    "unidad céntimos",
    (e) => {
      event(e, (x) => x.unit === "centimos").unit = "EUR"
    },
  ],
  [
    "ratio como importe",
    (e) => {
      event(e, (x) => x.unit === "ratio").unit = "EUR"
    },
  ],
  [
    "índice celda",
    (e) => {
      event(
        e,
        (x) => x.operation === "property" && x.property === "0",
      ).property = "1"
    },
  ],
  [
    "frames fusionados",
    (e) => {
      const f = e.frames[2]
      e.events
        .filter((x) => x.frame === f.id)
        .forEach((x) => {
          x.frame = e.frames[1].id
        })
    },
  ],
  [
    "semilla",
    (e) => {
      event(e, (x) => x.operation === "collection-selection").edges = event(
        e,
        (x) => x.operation === "collection-selection",
      ).edges.filter((x) => x.role !== "seed")
    },
  ],
  [
    "captura",
    (e) => {
      event(e, (x) => x.operation === "capture").edges = []
    },
  ],
  [
    "orden",
    (e) => {
      event(e, (x) => x.operation === "index" && x.value === 1).value = 0
    },
  ],
  [
    "transporte",
    (e) => {
      event(e, (x) => x.operation === "transport").edges = []
    },
  ],
  [
    "argumento sin edge",
    (e) => {
      event(e, (x) => x.operation === "binary").edges.pop()
    },
  ],
  [
    "fuente",
    (e) => {
      e.sources[0].sha256 = "0".repeat(64)
    },
  ],
  [
    "slice fingido",
    (e) => {
      e.outputs[0].slice = []
    },
  ],
]
for (const [name, mutate] of mutations)
  test("rechazo causal: " + name, () => {
    const e = evidence()
    mutate(e)
    expect(() => check(e)).toThrow()
  })
test("recibo de otra entrada o ejecución rechazado", () => {
  const e = evidence()
  expect(() =>
    verifyCausalSS(g, e, make(2025, [1]), context, e.execution),
  ).toThrow()
  expect(() =>
    verifyCausalSS(g, e, sample, context, "otra-ejecucion"),
  ).toThrow()
})
test("programa sin validación y función externa no son terminales resueltos", () => {
  const copy = structuredClone(g)
  copy.program[0].op = "opaque"
  expect(() => validateSS(copy)).toThrow()
  expect(() => createSSEvaluator(copy)).toThrow()
  const external = { ...sample, extra: () => 0 }
  expect(() => run(external, context, "causal")).toThrow()
})

for (const binding of g.outputBindings)
  test(
    "obligación individual de transporte y binding: " + binding.siteId,
    () => {
      const e = evidence(),
        output = e.outputs.find((x) => x.siteId === binding.siteId)
      if (output === undefined) throw Error("Sin salida")
      const root = event(e, (x) => x.id === output.root)
      root.edges = []
      expect(() => check(e)).toThrow()
    },
  )
test("intercambiar lados MEI con importe cero igual no identifica procedencia", () => {
  const caso = make(2022, [1000000]),
    e = run(caso, context, "causal").evidence!
  expect(e.outputs[4].decimal).toBe("0")
  expect(e.outputs[5].decimal).toBe("0")
  const original = e.outputs[4].root
  e.outputs[4].root = e.outputs[5].root
  e.outputs[5].root = original
  expect(() => verifyCausalSS(g, e, caso, context, e.execution)).toThrow()
})

test("colecciones efectivas: semilla, callback, orden y multiplicidad, también vacío", () => {
  for (const amounts of [[], [100, 100], [100, 200]]) {
    const e = run(make(2025, amounts), context, "causal").evidence!
    const events = new Map(e.events.map((x) => [x.id, x]))
    for (const selection of e.events.filter(
      (x) => x.operation === "collection-selection",
    )) {
      const callback = selection.edges.find((x) => x.role === "callback")
      const seed = selection.edges.find((x) => x.role === "seed")
      expect(seed).toBeDefined()
      if (callback === undefined) throw Error("Sin callback")
      const callbackNode = events.get(callback.to)?.node
      const calls = e.frames.filter(
        (f) =>
          f.parent === selection.frame &&
          f.call === selection.node &&
          f.function === callbackNode,
      )
      expect(calls).toHaveLength(Number(selection.value))
      const indexes = e.events.filter(
        (x) =>
          x.operation === "index" &&
          x.edges.some((edge) => edge.to === selection.id),
      )
      expect(indexes.map((x) => x.value)).toEqual(
        Array.from({ length: Number(selection.value) }, (_, i) => i),
      )
    }
  }
})
