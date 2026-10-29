"""Reproducción aislada; no escribe en entregas recibidas ni en paquetes."""

import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import types
import unittest
from typing import TypedDict

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
SCRATCH = ROOT / ".cache/preservacion-r23-sol"
SCRATCH.mkdir(parents=True, exist_ok=True)
PRIOR = "960773f909d4ecff290edfa3d7a7b2699a8445d3"
version = sys.argv[1]
source = ROOT / "docs/procedencia/revisiones/preservacion-r21-sol/revisar.py"
text = (
    source.read_text()
    .replace(
        'OUT = ROOT / "docs/procedencia/revisiones/preservacion-r21-sol"',
        "OUT = Path(" + repr(str(OUT)) + ")",
    )
    .replace(
        'SCRATCH = ROOT / ".cache/preservacion-r21-sol"',
        "SCRATCH = Path(" + repr(str(SCRATCH)) + ")",
    )
)
review = types.ModuleType("revisar")
review.__file__ = str(source)
sys.modules["revisar"] = review
exec(compile(text, str(source), "exec"), review.__dict__)
r = review.r
if version == "anterior":
    old_code = subprocess.check_output(
        ["git", "show", PRIOR + ":docs/procedencia/preservacion-v3/recolector.py"]
    )
    previous = types.ModuleType("recolector_anterior")
    previous.__file__ = str(ROOT / "docs/procedencia/preservacion-v3/recolector.py")
    exec(compile(old_code, previous.__file__, "exec"), previous.__dict__)
    r = previous
    historical = SCRATCH / "schema-anterior"
    historical.mkdir(exist_ok=True)
    for name in ("preservacion_ampliacion.schema.json", "preservacion.schema.json"):
        (historical / name).write_bytes(
            subprocess.check_output(
                ["git", "show", PRIOR + ":tools/procedencia/" + name]
            )
        )
    r.p.__file__ = str(historical / "preservacion.py")
    setattr(review, "r", r)
    setattr(review.old, "r", r)


class Unresolved(TypedDict):
    sha256: str
    sources: list[str]


rows: list[dict[str, object]] = []


def record(label, change, expected=True):
    c = review.fixture()
    try:
        change(c.m)
        c.store()
        schema = r.p.strict_json(
            Path(r.p.__file__)
            .with_name("preservacion_ampliacion.schema.json")
            .read_bytes()
        )
        schema_ok = r.p.Draft202012Validator(
            schema, format_checker=r.p.FormatChecker()
        ).is_valid(c.m)
        try:
            r.load()
            rejected, error = False, None
        except (ValueError, TypeError, KeyError) as exc:
            rejected, error = True, str(exc)
        rows.append(
            dict(
                case=label,
                expectedReject=expected,
                rejected=rejected,
                schemaAccepts=schema_ok,
                error=error,
            )
        )
    finally:
        c.doCleanups()


# Expectativas históricas intactas, contra ambas versiones.
spec = importlib.util.spec_from_file_location(
    "rojos_r23", source.with_name("rojos_test.py")
)
assert spec is not None and spec.loader is not None
rojos = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rojos)
result = unittest.TextTestRunner(verbosity=2).run(
    unittest.defaultTestLoader.loadTestsFromTestCase(rojos.Nuevos)
)
summary = dict(
    tests=result.testsRun, failures=len(result.failures), errors=len(result.errors)
)
for field in ("sources", "references", "acquisitions"):

    def duplicate(m, f=field):
        obj = m["annex"][0]
        if f == "references":
            obj[f] = ["doc.json"]
        item = copy.deepcopy(obj[f][0])
        if isinstance(item, dict):
            item = dict(reversed(list(item.items())))
        obj[f].append(item)

    record("duplicate-reordered:" + field, duplicate)
for field in ("sources", "references"):
    for suffix in ("\n", "\r\n", "\r", "\x00", "\u2028", "\u2029"):
        record(
            "absolute-end:" + field + ":" + repr(suffix),
            lambda m, f=field, s=suffix: m["annex"][0].update(
                {f: [("checkout:payload" if f == "sources" else "doc.json") + s]}
            ),
        )
for kind in (
    "row",
    "reverse-sources",
    "same-hash-different-sources",
    "duplicate-source",
):

    def unresolved(m, k=kind):
        row: Unresolved = dict(sha256="f" * 64, sources=["a.json", "b.json"])
        other = copy.deepcopy(row)
        if k == "reverse-sources":
            other["sources"].reverse()
        if k == "same-hash-different-sources":
            other["sources"] = ["c.json"]
        if k == "duplicate-source":
            row["sources"].append("a.json")
        m["unresolvedReferences"] = [row] if k == "duplicate-source" else [row, other]

    record("unresolved:" + kind, unresolved)
record(
    "exclusion-observations",
    lambda m: m.update(
        exclusions=[dict(path="doc.json", reason="URL-no-admitida")] * 2
    ),
    False,
)
for value in (
    "https://www.seg-social.es:PRIVATE_SENTINEL/descarga/es/123",
    "https://[PRIVATE_SENTINEL/descarga/es/123",
    "https://www.boe.es:999999/buscar/doc.php?id=BOE-A-2006-20764",
    "https://www.boe.es:PRIVATE_SENTINEL/buscar/doc.php?id=BOE-A-2006-20764",
):
    for field in ("canonicalUrl", "finalUrl"):
        record(
            "malformed-url:" + field + ":" + str(len(rows)),
            lambda m, u=value, f=field: m["annex"][0]["acquisitions"][0].update({f: u}),
        )
# Diagnóstico con controles y claves privadas en niveles cerrados.
record(
    "sensitive-extra-key",
    lambda m: m["annex"][0]["acquisitions"][0].update(PRIVATE_SENTINEL="synthetic"),
)


# Mismo contenido de fuentes con distinto orden en adquisiciones repetidas.
def permuted_acquisition(m):
    event = m["annex"][0]["acquisitions"][0]
    m["annex"][0]["acquisitions"].append(dict(reversed(list(event.items()))))


record("acquisition-json-key-order", permuted_acquisition)
(OUT / (version + "-casos.json")).write_text(
    json.dumps(dict(historical=summary, cases=rows), indent=2) + "\n"
)
if version == "actual":
    assert result.wasSuccessful()
    assert all(row["rejected"] == row["expectedReject"] for row in rows)
    assert all("PRIVATE_SENTINEL" not in str(row["error"] or "") for row in rows)
    assert review.inherited()
    review.fsync_matrix()
    review.routes()
    # Scripts R23 recibidos, mismas expectativas, directorio de salida/scratch propios.
    for filename in ("preservacion-controles.py", "preservacion-politica.py"):
        path = ROOT / "docs/procedencia/correcciones/tecnica-r23" / filename
        script = (
            path.read_text()
            .replace(
                "OUT = Path(__file__).resolve().parent",
                "OUT = Path(" + repr(str(OUT)) + ")",
            )
            .replace(
                "ROOT / '.cache/orquestador-recepcion/r23/fixtures-preservacion'",
                "Path(" + repr(str(SCRATCH)) + ")",
            )
        )
        try:
            exec(
                compile(script, str(path), "exec"),
                {"__file__": str(path), "__name__": "r23_received"},
            )
        except SystemExit as exc:
            assert exc.code == 0
    review.real()
print(version, summary, len(rows), "casos registrados")
