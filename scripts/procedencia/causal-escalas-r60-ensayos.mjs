import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import fs from "node:fs";
import { gzipSync } from "node:zlib";
import { composeCausalEscalas } from "./causal-escalas-r60-contratos.mjs";
import {
  executeCausalEscalas,
  verifyCausalEscalas,
} from "./causal-escalas-r60.mjs";
import { composeEscalasR36 } from "./flujo-escalas-r36.mjs";
import { consumeEscalasR36 } from "./flujo-escalas-r36-consumidor.mjs";
import { composeRentasR36 } from "./flujo-rentas-r36.mjs";
import { executeRentasFinite } from "./flujo-rentas-r36-consumidor.mjs";
import { composeSS } from "./flujo-ss-r36.mjs";
import { executeFinite } from "./flujo-ss-r36-consumidor.mjs";
import { annual, explicit } from "./causal-escalas-r60-casos.mjs";
/** Oracle de IR anterior: callbacks solo de ensayo, nunca del productor nuevo. */
export function previous(c, ctx) {
  const e = composeEscalasR36(),
    r = composeRentasR36(),
    s = composeSS(),
    b = new Map(),
    rb = {};
  for (const n of [
    "calcularDesgloseCotizacionesPerfilUniforme",
    "calcularDesgloseCotizacionesSocialesLegacy",
  ])
    rb["boundary:" + n] = (...xs) => executeFinite(s, n, xs, false).result;
  for (const d of e.boundaryContracts) {
    const [file, symbol] = d.id.split("#");
    if (symbol.startsWith("validar")) b.set(d.id, (x) => x);
    else
      b.set(d.id, (...xs) =>
        file.startsWith("lib/dominio/laboral/")
          ? executeFinite(s, symbol, xs, false).result
          : executeRentasFinite(r, file + ":" + symbol, xs, false, null, [], rb)
              .result,
      );
  }
  if (ctx.route === "explicit")
    b.set("explicit.decode", (x) => ({ _tag: "Success", success: x }));
  return consumeEscalasR36(e, ctx.route ?? "annual", c, ctx, b);
}
export function runEscalasCases() {
  const g = composeCausalEscalas(),
    records = [],
    covered = new Set();
  function check(id, c, ctx) {
    const old = previous(c, ctx),
      out = executeCausalEscalas(g, c, ctx, id);
    assert.deepEqual(out.lines, old.lines);
    assert.ok(out.evidence.outputs.length);
    for (const o of out.evidence.outputs) {
      covered.add(o.siteId);
      assert.ok(o.slice.length > 1);
    }
    assert.equal(verifyCausalEscalas(g, out.evidence, c, ctx, id), true);
    const bytes = gzipSync(
      JSON.stringify({ caso: c, contexto: ctx, evidence: out.evidence }),
    );
    const hash = createHash("sha256").update(bytes).digest("hex");
    const folder = ".cache/causal-escalas-r60-sol/testigos";
    fs.mkdirSync(folder, { recursive: true });
    const file = folder + "/" + hash + ".json.gz";
    if (fs.existsSync(file)) assert.deepEqual(fs.readFileSync(file), bytes);
    else fs.writeFileSync(file, bytes);
    records.push({
      id,
      file,
      outputs: out.evidence.outputs.map((o) => ({
        siteId: o.siteId,
        decimal: o.decimal,
      })),
    });
    return out;
  }
  for (const anio of [2012, 2014, 2015, 2016, 2020, 2025, 2026])
    for (const modo of ["canonico", "compatible-legacy"])
      check(
        anio + "-" + modo,
        annual(anio, anio === 2026 ? "simulada-estatal" : "madrid"),
        { modo },
      );
  for (const amount of [0, 100, 2000000, 12345678])
    check("importe-" + amount, annual(2025, "madrid", amount), {
      modo: "canonico",
    });
  for (const bruto of ["0", "10000", "16576.01", "20000", "50000"])
    for (const clase of ["pension", "empleo-laboral"])
      check("exp-" + bruto + "-" + clase, explicit(bruto, clase), {
        modo: "canonico",
        route: "explicit",
      });
  for (const territory of [
    "simulada-estatal",
    "murcia",
    "galicia",
    "illes-balears",
    "comunitat-valenciana",
  ]) {
    const c = annual(2022, territory);
    check("territorio-" + territory, c, { modo: "canonico" });
  }
  for (const importe of [6000000, 6000001]) {
    const c = annual(2022, "murcia");
    c.rendimientos.trabajo = [];
    Object.assign(c.rendimientos, {
      capitalInmobiliario: [{ importeIntegroCentimos: importe }],
    });
    check("murcia-" + importe, c, { modo: "canonico" });
  }
  const cap = annual();
  Object.assign(cap, { deduccionAutonomicaAgregadaCentimos: 100000000 });
  check("techo-deduccion", cap, { modo: "canonico" });
  const fam = annual();
  Object.assign(fam.situacionFamiliar, {
    descendientes: [
      { edad: 10, discapacidad: { _tag: "SinDiscapacidad" } },
      { edad: 2, discapacidad: { _tag: "SinDiscapacidad" } },
    ],
  });
  check("familia-orden", fam, { modo: "canonico" });
  const perdida = annual();
  perdida.rendimientos.trabajo = [];
  Object.assign(perdida.rendimientos, {
    capitalInmobiliario: [{ importeIntegroCentimos: -100000 }],
  });
  check("perdida-inmobiliaria", perdida, { modo: "canonico" });
  for (const row of [
    { territory: "illes-balears", dates: ["2023-11-25", "2023-11-26"] },
    { territory: "extremadura", dates: ["2023-09-14", "2023-09-15"] },
  ])
    for (const date of row.dates) {
      const territory = row.territory;
      const c = annual(2023, territory);
      Object.assign(c, {
        fechaFallecimiento: new Date(date + "T00:00:00.000Z"),
      });
      check(territory + "-" + date, c, { modo: "canonico" });
    }
  const c = annual(),
    ctx = { modo: "canonico" },
    out = check("relacional", c, ctx);
  const mutants = [
    (e) => e.events.pop(),
    (e) => e.outputs[0].slice.pop(),
    (e) => (e.outputs[0].root = e.outputs[1].root),
    (e) => (e.frames[1].parent = e.frames[1].id),
    (e) => e.events.find((v) => v.operation === "property").edges.pop(),
    (e) => e.outputs.reverse(),
    (e) => (e.input.anio = 2014),
  ];
  for (const mutate of mutants) {
    const e = structuredClone(out.evidence);
    mutate(e);
    assert.notDeepEqual(e, out.evidence);
    assert.throws(() => verifyCausalEscalas(g, e, c, ctx, "relacional"));
  }
  const bad = structuredClone(g);
  bad.program[0].data.extra = 1;
  assert.throws(() => executeCausalEscalas(bad, c, ctx));
  const summary = Buffer.from(
    JSON.stringify(
      { records, covered: [...covered], adversos: mutants.length },
      null,
      2,
    ) + "\n",
  );
  const hash = createHash("sha256").update(summary).digest("hex");
  fs.writeFileSync(
    ".cache/causal-escalas-r60-sol/casos-" + hash + ".json",
    summary,
  );
  fs.writeFileSync(
    ".cache/causal-escalas-r60-sol/casos-actuales.json",
    JSON.stringify({
      path: ".cache/causal-escalas-r60-sol/casos-" + hash + ".json",
    }) + "\n",
  );
  return { records, covered: [...covered] };
}
