import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  verificarNominalPublicado,
  seleccionarContextoNominal,
} from "../scripts/procedencia/nominal-contrato.mjs";

const root = new URL("../", import.meta.url);
const out = "docs/procedencia/implementaciones/contrato-nominal-r29-sol/";
const digest = (b) => createHash("sha256").update(b).digest("hex");
function fixture() {
  const dependencies = [];
  const objects = new Map();
  const add = (path) => {
    const raw = readFileSync(new URL(path, root));
    const ref = { path, sha256: digest(raw) };
    dependencies.push(ref);
    objects.set(ref.sha256, raw);
    return ref;
  };
  const payload = add(out + "payload.json");
  add(out + "ambito.json");
  add("docs/procedencia/correcciones/madrid-nominal-r29/decision-nominal.json");
  const closure = JSON.parse(
    readFileSync(
      new URL("schemas/procedencia/nominal-dependencies.schema.json", root),
    ),
  ).const;
  for (const ref of closure.documents) add(ref.path);
  for (const blob of closure.blobs)
    objects.set(
      blob.sha256,
      readFileSync(
        new URL(".cache/nominal-r29/cas/sha256/" + blob.sha256, root),
      ),
    );
  const p = JSON.parse(objects.get(payload.sha256));
  objects.set(p.source.sha256, readFileSync(new URL(p.source.file, root)));
  const registry = Buffer.from(
    JSON.stringify({
      schemaVersion: 1,
      entries: [{ payload, attestation: null }],
    }),
  );
  dependencies.push({
    path: "docs/procedencia/enlaces/registro.json",
    sha256: digest(registry),
  });
  objects.set(digest(registry), registry);
  const run = (read = (h) => objects.get(h)) =>
    verificarNominalPublicado(payload.sha256, p.itemId, dependencies, read);
  return { dependencies, objects, run, payload, p };
}

test("proposición exacta conserva pendiente y rechaza cualquier selección civil", () => {
  const f = fixture();
  const r = f.run();
  assert.equal(r.bindingReview, "pending");
  assert.equal(r.authenticity, "trust-indeterminate");
  assert.equal(r.completeRuleAcceptance, false);
  assert.deepEqual(r.scope.source.tablePath, ["madrid", "tramos", "3", "0"]);
  for (const death of [null, "2020-06-20"])
    assert.throws(() =>
      seleccionarContextoNominal(r.scope, { year: 2020, death }),
    );
});

test("cada dependencia mutable se relee; fuente, cita, manifiesto, contexto, PNG y original", () => {
  const f = fixture();
  const selected = [
    f.p.source.sha256,
    ...f.dependencies
      .filter((r) =>
        /citation|manifest|evidencias-temporales|\.png$/.test(r.path),
      )
      .map((r) => r.sha256),
    "2916a4ee52ec0cf6d5c68600fdc1de8604d2eda19db4a8aa3232e23ff34ef8ab",
  ];
  for (const target of selected) {
    let reads = 0;
    assert.throws(() =>
      f.run((h) =>
        h === target && ++reads > 1
          ? Buffer.from("alterado tras lectura")
          : f.objects.get(h),
      ),
    );
  }
});

test("referencias duplicadas y bytes falsos se rechazan", () => {
  const f = fixture();
  f.dependencies.push(f.dependencies[0]);
  assert.throws(() => f.run(), /duplicada/);
  f.dependencies.pop();
  assert.throws(
    () =>
      f.run((h) =>
        h === f.payload.sha256 ? Buffer.from("{}") : f.objects.get(h),
      ),
    /alterados/,
  );
});

// Mutación coherente del sobre: los hashes recalculados no amplían la decisión.
test("discriminantes y promociones se rechazan aun recalculando el sobre", () => {
  const mutations = [
    (p, a) => {
      a.source.tablePath = ["madrid", "tramos"];
      p.source = a.source;
    },
    (p, a) => {
      a.source.tablePath[3] = "1";
      p.source = a.source;
    },
    (p, a) => {
      a.year = 2022;
      p.scope.year = 2022;
    },
    (p, a) => {
      a.territory = "murcia";
      p.scope.territory = "murcia";
    },
    (p, a) => {
      a.component = "estatal";
    },
    (p, a) => {
      a.value = "53407.29";
    },
    (p, a) => {
      a.unit = "percent";
      p.scope.unit = "percent";
    },
    (p, a) => {
      a.editorialConditions = [];
      p.scope.conditions = [];
    },
    (p, a) => {
      a.exclusions = [];
    },
    (p, a) => {
      a.period = "ordinary-no-death";
    },
    (p, a) => {
      a.status = "accepted";
    },
    (p) => {
      p.status = "accepted";
    },
    (p) => {
      p.authorTaskId = "mcp:81fd9b2d-806e-4a35-8b7d-3f1d9d00e5db";
    },
    (p) => {
      p.document = p.citation;
    },
    (p) => {
      p.legalReview.decisions.sha256 = "a".repeat(64);
    },
  ];
  for (const mutate of mutations) {
    const f = fixture();
    const p = structuredClone(f.p);
    const a = JSON.parse(f.objects.get(p.executableScope.sha256));
    mutate(p, a);
    const replace = (path, v) => {
      const raw = Buffer.from(JSON.stringify(v));
      const hash = digest(raw);
      const dep = f.dependencies.find((r) => r.path === path);
      dep.sha256 = hash;
      f.objects.set(hash, raw);
      return { path, sha256: hash };
    };
    p.executableScope = replace(p.executableScope.path, a);
    const payload = replace(f.payload.path, p);
    replace("docs/procedencia/enlaces/registro.json", {
      schemaVersion: 1,
      entries: [{ payload, attestation: null }],
    });
    assert.throws(() =>
      verificarNominalPublicado(payload.sha256, p.itemId, f.dependencies, (h) =>
        f.objects.get(h),
      ),
    );
  }
  const f = fixture();
  const reg = f.dependencies.find(
    (r) => r.path === "docs/procedencia/enlaces/registro.json",
  );
  const raw = Buffer.from(
    JSON.stringify({
      entries: [
        {
          payload: f.payload,
          attestation: { path: "historica", sha256: "b".repeat(64) },
        },
      ],
    }),
  );
  reg.sha256 = digest(raw);
  f.objects.set(reg.sha256, raw);
  assert.throws(() => f.run(), /pendiente/);
});

test("JSON con claves duplicadas no permite ambigüedad entre consumidores", () => {
  const f = fixture();
  const raw = Buffer.from(
    f.objects
      .get(f.payload.sha256)
      .toString()
      .replace('"schemaVersion": 3', '"schemaVersion": 3, "schemaVersion": 3'),
  );
  const payload = { path: f.payload.path, sha256: digest(raw) };
  f.dependencies.find((r) => r.path === payload.path).sha256 = payload.sha256;
  f.objects.set(payload.sha256, raw);
  const reg = f.dependencies.find(
    (r) => r.path === "docs/procedencia/enlaces/registro.json",
  );
  const registry = Buffer.from(
    JSON.stringify({ entries: [{ payload, attestation: null }] }),
  );
  reg.sha256 = digest(registry);
  f.objects.set(reg.sha256, registry);
  assert.throws(
    () =>
      verificarNominalPublicado(
        payload.sha256,
        f.p.itemId,
        f.dependencies,
        (h) => f.objects.get(h),
      ),
    /duplicada/,
  );
});

test('cadenas JSON escapadas conservan sus claves estructurales', () => {
 const f=fixture()
 const p=structuredClone(f.p)
 p.id='identificador con "comillas", barra \\ y llaves {}'
 const raw=Buffer.from(JSON.stringify(p))
 const payload={path:f.payload.path,sha256:digest(raw)}
 f.dependencies.find((r)=>r.path===payload.path).sha256=payload.sha256
 f.objects.set(payload.sha256,raw)
 const reg=f.dependencies.find((r)=>r.path==='docs/procedencia/enlaces/registro.json')
 const registry=Buffer.from(JSON.stringify({entries:[{payload,attestation:null}]}))
 reg.sha256=digest(registry); f.objects.set(reg.sha256,registry)
 assert.equal(verificarNominalPublicado(payload.sha256,p.itemId,f.dependencies,(h)=>f.objects.get(h)).bindingReview,'pending')
})
