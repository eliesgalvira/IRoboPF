import { expect, test } from "vitest";
import { Effect } from "effect";
import { composeRetencionesR34 } from "../scripts/procedencia/flujo-retenciones-r34.mjs";
import { consumeAnnual } from "../scripts/procedencia/flujo-retenciones-r34-consumidor.mjs";
import {
  executeCausalRetenciones,
  verifyCausalRetenciones,
} from "../scripts/procedencia/causal-retenciones-r57.ts";
import { calcularRetencionTrabajoAeat } from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat";
import type { CasoRetencionTrabajo } from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat";
import type {
  ExecutionEvidence,
  Event,
} from "../scripts/procedencia/evidencia-ejecucion-r54.ts";
const g = composeRetencionesR34();
const base: CasoRetencionTrabajo = {
  anio: 2020,
  retribucionAnualCentimos: 4020000,
  cotizacionesCentimos: 20000,
  situacionFamiliar: "situacion3",
  situacionLaboral: "activo",
  contrato: "general",
  descendientes: [],
  ascendientes: [],
  discapacidad: "sin-discapacidad",
};
const ctx = { modo: "canonico" } as const;
const annual = (sub: CasoRetencionTrabajo | undefined = base) => ({
  anio: sub?.anio ?? 2020,
  retencionTrabajoAeat: sub,
  retencionesSoportadasCentimos: 12345,
  pagosACuentaCentimos: 12345,
  rendimientos: { trabajo: [{ importeIntegroCentimos: 987654321 }] },
});
const run = (
  sub = base,
  context: { modo: "canonico" | "compatible-legacy" } = ctx,
) => executeCausalRetenciones(g, annual(sub), context, "r57-prueba");
const check = (e: ExecutionEvidence) =>
  verifyCausalRetenciones(g, e, annual(), ctx, e.execution);
const find = (e: ExecutionEvidence, p: (v: Event) => boolean) => {
  const v = e.events.find(p);
  if (v === undefined) throw Error("Objetivo adverso ausente");
  return v;
};
const cases: [
  string,
  Partial<CasoRetencionTrabajo>,
  "canonico" | "compatible-legacy",
][] = [
  ["normal", {}, "canonico"],
  ["legacy", {}, "compatible-legacy"],
  [
    "cero",
    { retribucionAnualCentimos: 0, cotizacionesCentimos: 0 },
    "canonico",
  ],
  ["alimentos", { anualidadesAlimentosHijosCentimos: 500000 }, "canonico"],
  [
    "alimentos iguales base",
    { anualidadesAlimentosHijosCentimos: 3800000 },
    "canonico",
  ],
  [
    "igual escala",
    { cotizacionesCentimos: 0, retribucionAnualCentimos: 8000000 },
    "canonico",
  ],
  ["julio anterior", { anio: 2018, fechaPago: "2018-07-04" }, "canonico"],
  ["julio inclusivo", { anio: 2018, fechaPago: "2018-07-05" }, "canonico"],
  ["cierre", { anio: 2025, perfilTemporal: "cierre" }, "canonico"],
  [
    "familia repetida excluida",
    {
      descendientes: [
        ...Array.from({ length: 2 }, () => ({
          edad: 2,
          computoPorEntero: false,
          discapacidad: "sin-discapacidad" as const,
          movilidadReducida: false,
          adopcionOAcogimientoMenosTresAnios: false,
        })),
        {
          edad: 30,
          computoPorEntero: true,
          discapacidad: "sin-discapacidad",
          movilidadReducida: false,
          adopcionOAcogimientoMenosTresAnios: false,
        },
      ],
      ascendientes: [
        {
          edad: 76,
          convivencia: 3,
          discapacidad: "de33a65",
          movilidadReducida: true,
        },
      ],
    },
    "canonico",
  ],
  [
    "territorio",
    { residenciaCeutaMelilla: true, rendimientosCeutaMelilla: true },
    "canonico",
  ],
  [
    "territorio medio",
    {
      anio: 2017,
      residenciaCeutaMelilla: true,
      rendimientosCeutaMelilla: true,
    },
    "canonico",
  ],
  // SAFETY: cada tupla enumera una cuantía entera, un patch de la interfaz y el modo literal canónico.
  ...[
    2199999, 2200000, 2200001, 3519999, 3520000, 3520001, 3300719, 3300720,
    3300721,
  ].map(
    (n) =>
      [
        "umbral " + n,
        { retribucionAnualCentimos: n, pagosViviendaHabitual: true },
        "canonico",
      ] as [string, Partial<CasoRetencionTrabajo>, "canonico"],
  ),
  // SAFETY: los dos contratos pertenecen a CasoRetencionTrabajo; la tupla fija modo y patch.
  ...["especial", "inferior-anio"].map(
    (contrato) =>
      [
        "contrato " + contrato,
        {
          contrato: contrato as CasoRetencionTrabajo["contrato"],
          retribucionAnualCentimos: 100000,
          cotizacionesCentimos: 0,
        },
        "canonico",
      ] as [string, Partial<CasoRetencionTrabajo>, "canonico"],
  ),
];
for (const [label, patch, modo] of cases)
  test("seis salidas/API real: " + label, () => {
    const sub = { ...base, ...patch },
      context = { modo },
      r = run(sub, context),
      real = Effect.runSync(calcularRetencionTrabajoAeat(sub, context));
    expect(
      verifyCausalRetenciones(
        g,
        r.evidence,
        annual(sub),
        context,
        r.evidence.execution,
      ),
    ).toBe(true);
    expect(r.lines).toEqual(
      consumeAnnual(g, annual(sub), context, false).lines,
    );
    const values = [
      String(real.baseRetencionCentimos / 100),
      String(real.cuotaRetencionCentimos / 100),
      real.tipoRetencionPorcentaje
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1"),
      String(real.importeRetencionAnualCentimos / 100),
      "123.45",
      String((12345 + real.importeRetencionAnualCentimos) / 100),
    ];
    expect(r.evidence.outputs.map((o) => o.decimal)).toEqual(values);
    expect(r.evidence.annualBindings.map((b) => b.name)).toEqual([
      "retencionTrabajoAeat",
      "retencionTrabajoAeatCentimos",
      "pagosACuentaAplicadosCentimos",
    ]);
  });
test("ausencia, éxito cero y rechazo no intercambiables", () => {
  const absent = executeCausalRetenciones(g, annual(undefined), ctx);
  // annual(undefined) usa el default JS; construir ausencia explícita.
  const a = executeCausalRetenciones(
    g,
    { ...annual(), retencionTrabajoAeat: undefined },
    ctx,
  );
  const missing = { ...base };
  delete missing.cotizacionesCentimos;
  expect(() => run(missing)).toThrow(/ResultadoNoSoportado/);
  expect(absent.lines).toHaveLength(6);
  expect(a.lines).toHaveLength(2);
  expect(a.evidence.outputs.map((o) => o.decimal)).toEqual([
    "123.45",
    "123.45",
  ]);
  expect(
    run({ ...base, retribucionAnualCentimos: 0, cotizacionesCentimos: 0 })
      .lines,
  ).toHaveLength(6);
  for (const patch of [
    { procedimiento: "regularizacion" as const },
    { anio: 2018 as const },
    { anio: 2026 as const, fechaPago: "2026-01-01" },
  ])
    expect(() => run({ ...base, ...patch })).toThrow(/ResultadoNoSoportado/);
});
for (const site of [
  "anual.retencion.base",
  "anual.retencion.cuota",
  "anual.retencion.tipo",
  "anual.retencion.anual",
  "anual.pagos.retenciones",
  "anual.pagos.cuenta",
])
  test("transporte individual " + site, () => {
    const e = run().evidence,
      o = e.outputs.find((o) => o.siteId === site);
    if (o === undefined) throw Error("Salida ausente");
    const slice = e.events.filter((v) => o.slice.includes(v.id));
    expect(
      slice.some(
        (v) =>
          v.operation === "input" &&
          v.property === "caso/rendimientos/trabajo/0/importeIntegroCentimos",
      ),
    ).toBe(false);
    if (site === "anual.pagos.retenciones")
      expect(
        slice.some(
          (v) =>
            v.operation === "input" &&
            v.property === "caso/pagosACuentaCentimos",
        ),
      ).toBe(false);
    expect(slice.some((v) => v.operation === "decimal.toFixed")).toBe(true);
    find(e, (v) => v.id === o.root).edges = [];
    expect(() => check(e)).toThrow(/Evidencia insuficiente/);
  });
const mutations: [string, (e: ExecutionEvidence) => void][] = [
  [
    "argumento",
    (e) => {
      find(e, (v) => v.operation === "invoke").edges = [];
    },
  ],
  [
    "binding",
    (e) => {
      find(e, (v) => v.operation === "annual-binding").edges = [];
    },
  ],
  [
    "frames",
    (e) => {
      e.events[100].frame = e.frames[0].id;
    },
  ],
  [
    "celda",
    (e) => {
      find(
        e,
        (v) => v.operation === "property" && v.property === "desde",
      ).property = "cuota";
    },
  ],
  [
    "índice",
    (e) => {
      find(e, (v) => v.operation === "index").value = 999;
    },
  ],
  [
    "captura",
    (e) => {
      find(e, (v) => v.operation === "capture").edges = [];
    },
  ],
  [
    "unidad",
    (e) => {
      find(e, (v) => v.unit === "centimos").unit = "percent";
    },
  ],
  [
    "selector",
    (e) => {
      find(
        e,
        (v) => v.operation === "input" && v.property === "contexto/modo",
      ).value = "compatible-legacy";
    },
  ],
  [
    "versión",
    (e) => {
      e.version = 1;
    },
  ],
  [
    "fuente",
    (e) => {
      e.sources[0].sha256 = "0".repeat(64);
    },
  ],
  [
    "estructura",
    (e) => {
      find(
        e,
        (v) => v.operation === "array-selection" && Number(v.value) > 0,
      ).edges.pop();
    },
  ],
  [
    "semilla",
    (e) => {
      const v = find(
        e,
        (v) => v.operation === "array-selection" && v.property === "reduce",
      );
      v.edges = v.edges.filter((x) => x.role !== "argument:1");
    },
  ],
  [
    "orden",
    (e) => {
      find(
        e,
        (v) => v.operation === "array-selection" && Number(v.value) > 0,
      ).edges.reverse();
    },
  ],
  [
    "slice",
    (e) => {
      e.outputs[0].slice = [];
    },
  ],
];
for (const [label, mutate] of mutations)
  test("adverso real " + label, () => {
    const e = run().evidence;
    mutate(e);
    expect(() => check(e)).toThrow(/Evidencia insuficiente/);
  });
test("obligaciones derivadas en ambas API", () => {
  for (const mutate of [
    (x: typeof g) => x.obligations.pop(),
    (x: typeof g) => {
      x.program[0].data = { value: 999 };
    },
    (x: typeof g) => {
      x.obligations[0].status = "pending";
    },
  ]) {
    const copy = structuredClone(g);
    mutate(copy);
    expect(() => executeCausalRetenciones(copy, annual(), ctx)).toThrow();
    expect(() =>
      verifyCausalRetenciones(
        copy,
        run().evidence,
        annual(),
        ctx,
        "r57-prueba",
      ),
    ).toThrow();
  }
});
test("expectativa racional nominal independiente del replay y del oracle", () => {
  // 40200-200-2000=38000. E(38000)=8725.5+2800*.37=9761.5;
  // E(5550)=1054.5, cuota=8707. trunc(8707/40200*100)=21.65;
  // HALF_UP2(40200*21.65/100)=8703.30.
  expect(run().evidence.outputs.map((o) => o.decimal)).toEqual([
    "38000",
    "8707",
    "21.65",
    "8703.3",
    "123.45",
    "8826.75",
  ]);
});
test("reutilización de otra ejecución/entrada y copia pública", () => {
  const e = run().evidence;
  expect(() => verifyCausalRetenciones(g, e, annual(), ctx, "otra")).toThrow();
  expect(() =>
    verifyCausalRetenciones(
      g,
      e,
      { ...annual(), pagosACuentaCentimos: 1 },
      ctx,
      e.execution,
    ),
  ).toThrow();
  e.outputs[0].decimal = "falso";
  expect(() => check(e)).toThrow();
  expect(run().evidence.outputs[0].decimal).toBe("38000");
});
test("productores iguales no intercambiables", () => {
  const e = run({
    ...base,
    retribucionAnualCentimos: 0,
    cotizacionesCentimos: 0,
  }).evidence;
  const a = e.outputs[4],
    b = e.outputs[5];
  expect(a.decimal).toBe(b.decimal);
  const first = find(e, (v) => v.id === a.root),
    second = find(e, (v) => v.id === b.root);
  first.edges = structuredClone(second.edges);
  expect(() =>
    verifyCausalRetenciones(
      g,
      e,
      annual({ ...base, retribucionAnualCentimos: 0, cotizacionesCentimos: 0 }),
      ctx,
      e.execution,
    ),
  ).toThrow();
});
test("familia: filtro antes de cardinalidad, repetidos con frames propios y sin contaminar base", () => {
  const patch = cases.find(
    ([name]) => name === "familia repetida excluida",
  )?.[1];
  if (patch === undefined) throw Error("Caso ausente");
  const sub = { ...base, ...patch },
    e = run(sub).evidence,
    original = structuredClone(sub);
  const filter = e.events.find(
    (v) =>
      v.operation === "array-selection" &&
      v.property === "filter" &&
      v.value === 3,
  );
  expect(filter).toBeDefined();
  const sorted = e.events.find(
    (v) =>
      v.operation === "array-selection" &&
      v.property === "sort" &&
      v.value === 2,
  );
  expect(sorted).toBeDefined();
  const baseOut = e.outputs[0],
    members = e.events.filter(
      (v) =>
        v.operation === "input" &&
        v.property.startsWith("caso/retencionTrabajoAeat/descendientes/") &&
        v.property.endsWith("/discapacidad"),
    );
  expect(members).toHaveLength(3);
  // La discapacidad del excluido decide cardinalidad y reducción laboral por hijos.
  expect(
    members.filter((v) => baseOut.slice.includes(v.id)).map((v) => v.property),
  ).toEqual(["caso/retencionTrabajoAeat/descendientes/2/discapacidad"]);
  expect(sub).toEqual(original);
  const same = e.events.filter(
    (v) =>
      v.operation === "parameter:0" &&
      v.property.endsWith("/edad") &&
      v.value === 2,
  );
  expect(new Set(same.map((v) => v.frame)).size).toBeGreaterThan(1);
  const m = structuredClone(e),
    first = members[0],
    second = members[1];
  find(
    m,
    (v) => v.operation !== "input" && v.edges.some((x) => x.to === first.id),
  ).edges.forEach((edge) => {
    if (edge.to === first.id) edge.to = second.id;
  });
  expect(() =>
    verifyCausalRetenciones(g, m, annual(sub), ctx, m.execution),
  ).toThrow();
});
test("escala: dos y tres llamadas concretas; filas consumidas distintas del catálogo", () => {
  for (const [sub, count] of [
    [base, 2],
    [{ ...base, anualidadesAlimentosHijosCentimos: 500000 }, 3],
  ] as const) {
    const e = run(sub).evidence;
    const calls = e.frames.filter(
      (f) =>
        g.scaleInstances.some((i) => i.node === f.call) &&
        g.globalBindings.some(
          (b) => b.name === "calcularCuotaEscala" && b.node === f.function,
        ),
    );
    expect(calls).toHaveLength(count);
    expect(new Set(calls.map((f) => f.id)).size).toBe(count);
  }
});
test("contexto incoherente y callbacks inyectados no se acreditan", () => {
  expect(() =>
    executeCausalRetenciones(g, { ...annual(), anio: 2025 }, ctx),
  ).toThrow(/incoherente/);
  expect(() =>
    executeCausalRetenciones(g, annual(), { modo: "inventado" }),
  ).toThrow();
  const copy = structuredClone(g),
    callback = copy.collectionBindings.find((b) => b.callback !== null);
  if (callback === undefined) throw Error("Callback ausente");
  copy.program.find((n) => n.id === callback.callback)!.op = "opaque";
  expect(() => executeCausalRetenciones(copy, annual(), ctx)).toThrow();
});
test("expectativas independientes de factores territoriales y mínimos contractuales", () => {
  expect(
    run({
      ...base,
      residenciaCeutaMelilla: true,
      rendimientosCeutaMelilla: true,
    })
      .evidence.outputs.map((o) => o.decimal)
      .slice(1, 4),
  ).toEqual(["8707", "8.66", "3481.32"]);
  expect(
    run({
      ...base,
      anio: 2017,
      residenciaCeutaMelilla: true,
      rendimientosCeutaMelilla: true,
    })
      .evidence.outputs.map((o) => o.decimal)
      .slice(1, 4),
  ).toEqual(["8707", "10.82", "4349.64"]);
  for (const [anio, contrato, tipo] of [
    [2017, "especial", "8"],
    [2020, "especial", "6"],
    [2017, "inferior-anio", "1"],
    [2020, "inferior-anio", "0.8"],
  ] as const)
    expect(
      run({
        ...base,
        anio,
        contrato,
        retribucionAnualCentimos: 100000,
        cotizacionesCentimos: 0,
        residenciaCeutaMelilla: true,
        rendimientosCeutaMelilla: true,
      }).evidence.outputs[2].decimal,
    ).toBe(tipo);
});
test("escala igual en llamadas distintas conserva los marcos", () => {
  // R=13100, S=0, I1=755000 => RNT=5550, reducción3700, gastos2000:
  // base0, exento; emplear base=11100 con R=13100 en legacy actual aún reducción.
  // El caso de alimentos se ajusta a base/2 del recorrido base independiente:19000.
  const e = run({
    ...base,
    anualidadesAlimentosHijosCentimos: 1900000,
  }).evidence;
  const results = e.events.filter(
    (v) =>
      v.operation === "function-return" &&
      e.frames.some(
        (f) =>
          f.id === v.frame && g.scaleInstances.some((i) => i.node === f.call),
      ),
  );
  const equal = results.filter(
    (v) => JSON.stringify(v.value) === JSON.stringify(results[0]?.value),
  );
  expect(equal.length).toBeGreaterThanOrEqual(2);
  expect(new Set(equal.map((v) => v.frame)).size).toBe(equal.length);
});
test("N01: pendiente representable nunca autoriza ninguna API directa", () => {
  const pending = structuredClone(g);
  pending.obligations[0].status = "pending";
  pending.obligations[0].reason = "contraste externo pendiente";
  for (const s of pending.sites)
    if (s.siteId !== "anual.pagos.retenciones") {
      s.valueClosed = false;
      s.selectionClosed = false;
    }
  expect(() => executeCausalRetenciones(pending, annual(), ctx)).toThrow(
    /obligaciones pendientes/,
  );
  expect(() =>
    verifyCausalRetenciones(
      pending,
      run().evidence,
      annual(),
      ctx,
      "r57-prueba",
    ),
  ).toThrow(/obligaciones pendientes/);
  const forged = structuredClone(pending);
  forged.program[0].op = "opaque";
  forged.obligations[0].status = "satisfied";
  for (const s of forged.sites) {
    s.valueClosed = true;
    s.selectionClosed = true;
  }
  expect(() => executeCausalRetenciones(forged, annual(), ctx)).toThrow();
  expect(() =>
    verifyCausalRetenciones(
      forged,
      run().evidence,
      annual(),
      ctx,
      "r57-prueba",
    ),
  ).toThrow();
});
test("familia: correspondencia estructural miembro→argumento en folds, vacío y repetidos", () => {
  for (const descendientes of [
    [],
    ...cases
      .filter(([name]) => name === "familia repetida excluida")
      .map(([, p]) => p.descendientes),
  ]) {
    if (descendientes === undefined) throw Error("Caso sin descendientes");
    const e = run({ ...base, descendientes }).evidence,
      byId = new Map(e.events.map((v) => [v.id, v]));
    for (const selection of e.events.filter(
      (v) => v.operation === "array-selection" && v.property === "reduce",
    )) {
      const callback = selection.edges.find((x) => x.role === "argument:0");
      if (callback === undefined) throw Error("Callback ausente");
      const frames = e.frames.filter(
        (f) =>
          f.parent === selection.frame &&
          f.function === byId.get(callback.to)?.node,
      );
      const members = selection.edges.filter((x) =>
        x.role.startsWith("identity:element:"),
      );
      expect(frames).toHaveLength(members.length);
      for (const [i, f] of frames.entries()) {
        const invocation = e.events.find(
          (v) => v.frame === f.id && v.operation === "invoke",
        );
        expect(invocation?.edges.find((x) => x.role === "argument:1")?.to).toBe(
          members[i].to,
        );
      }
    }
  }
});
test("schema cerrado también en la frontera directa, incluso extra undefined", () => {
  const e = run().evidence;
  Object.assign(e.events[0], { extra: undefined });
  expect(() => check(e)).toThrow(/schema cerrado/);
});
test("fuente, celda y referencias falsas no se ejecutan ni verifican", () => {
  for (const mode of ["celda", "fuente", "referencia"]) {
    const copy = structuredClone(g);
    if (mode === "fuente") copy.sources[0].sha256 = "0".repeat(64);
    else if (mode === "referencia")
      copy.annualBindings[0].node = "nodo-inventado";
    else {
      const node = copy.program.find(
        (n) => n.id === copy.scaleCells[0].valueNode,
      );
      if (node === undefined) throw Error("Celda ausente");
      node.data.value = 999;
    }
    expect(() => executeCausalRetenciones(copy, annual(), ctx)).toThrow();
    expect(() =>
      verifyCausalRetenciones(
        copy,
        run().evidence,
        annual(),
        ctx,
        "r57-prueba",
      ),
    ).toThrow();
  }
});
for (const [retribucionAnualCentimos, row, expected] of [
  [8000000, 4, ["77800", "24857", "31.07", "24856"]],
  [50000000, 5, ["497800", "217813", "43.56", "217800"]],
] as const)
  test("escala moderna: fila financiera " + row, () => {
    const sub = {
      ...base,
      anio: 2025 as const,
      perfilTemporal: "cierre" as const,
      retribucionAnualCentimos,
    };
    const e = run(sub).evidence,
      output = e.outputs[1],
      ids = new Set(output.slice),
      nodes = new Set(e.events.filter((v) => ids.has(v.id)).map((v) => v.node));
    // Expectativa propia: E(497800)=125901.5+197800*.47; mínimo5550*.19.
    expect(e.outputs.slice(0, 4).map((o) => o.decimal)).toEqual([...expected]);
    const reached = g.scaleCells.filter(
      (c) => ["cuota", "tipo"].includes(c.column) && nodes.has(c.id),
    );
    expect([...new Set(reached.map((c) => c.row))].sort()).toEqual([0, row]);
    const real = Effect.runSync(calcularRetencionTrabajoAeat(sub, ctx));
    expect(e.outputs[1].decimal).toBe(
      String(real.cuotaRetencionCentimos / 100),
    );
  });
test("guarda de continuación: el modo canónico selecciona cada propiedad de retención", () => {
  const e = run().evidence;
  for (const o of e.outputs.filter((o) =>
    o.siteId.startsWith("anual.retencion."),
  )) {
    expect(
      e.events.some(
        (v) =>
          o.slice.includes(v.id) &&
          v.operation === "input" &&
          v.property === "contexto/modo",
      ),
    ).toBe(true);
  }
});
test("presencia de versión no consume las propiedades hermanas de referencia documental", () => {
  const e = run().evidence,
    ids = new Set(e.outputs[0].slice),
    nodes = new Set(e.events.filter((v) => ids.has(v.id)).map((v) => v.node));
  const references = g.program.filter(
    (n) =>
      n.op === "literal" &&
      String(n.data.value).startsWith("https://sede.agenciatributaria.gob.es/"),
  );
  expect(references.length).toBeGreaterThan(0);
  expect(references.filter((n) => nodes.has(n.id))).toHaveLength(0);
});
test("unidades explícitas en bindings anuales, ausencia y porcentaje por propiedad", () => {
  for (const caso of [
    annual(),
    { ...annual(), retencionTrabajoAeat: undefined },
  ]) {
    const e = executeCausalRetenciones(g, caso, ctx).evidence,
      byId = new Map(e.events.map((v) => [v.id, v]));
    for (const b of e.annualBindings.filter((b) => b.name.endsWith("Centimos")))
      expect(byId.get(b.producer)?.unit).toBe("centimos");
    if (caso.retencionTrabajoAeat !== undefined)
      expect(
        e.events
          .filter(
            (v) =>
              v.operation === "property-definition" &&
              v.property === "tipoRetencionPorcentaje",
          )
          .every((v) => v.unit === "percent-decimal-string"),
      ).toBe(true);
  }
});
test("fallback de escala conserva identidad sin consumir resto no leído", () => {
  const e = run().evidence,
    ids = new Set(e.outputs[1].slice),
    nodes = new Set(e.events.filter((v) => ids.has(v.id)).map((v) => v.node));
  const unused = g.program.filter(
    (n) =>
      n.op === "property" &&
      n.data.key === "resto" &&
      n.source.file.endsWith("retencion-trabajo-aeat.ts"),
  );
  expect(unused).toHaveLength(6);
  expect(
    unused.filter((n) => nodes.has(n.id) || nodes.has(n.args[0])),
  ).toHaveLength(0);
});
