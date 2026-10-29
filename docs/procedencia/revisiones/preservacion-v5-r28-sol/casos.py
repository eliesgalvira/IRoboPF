"""Ataques independientes: fixtures propios y consumidor restaurado, sin inicializadores ajenos."""

import copy
import hashlib
import importlib
import json
from pathlib import Path
import sys
from unittest.mock import patch

ROOT = Path.cwd()
CACHE = ROOT / ".cache/revision-v5-r28"
SOFT = CACHE / "software-restaurado"
sys.path.insert(0, str(SOFT / "docs/procedencia/preservacion-v5-sol"))
c = importlib.import_module("consumidor")
consumer_file = c.__file__
assert consumer_file is not None
CFILE = Path(consumer_file)
results = []


def fp(data):
    return {
        "sha256": hashlib.sha256(data).hexdigest(),
        "sha512": hashlib.sha512(data).hexdigest(),
        "size": len(data),
    }


def run_case(name, mutation=None, physical=None, expected="reject"):
    case = CACHE / "casos" / name
    case.mkdir(parents=True)
    store = case / "package"
    store.mkdir()
    (store / "sha256").mkdir()
    (store / "dependencies").mkdir()
    data = b'{"public":true}\n'
    facts = fp(data)
    dependency = dict(
        facts,
        path="evidence.json",
        sourceSha256=facts["sha256"],
        sourceSha512=facts["sha512"],
        sourceSize=facts["size"],
        sanitized=False,
        historical=False,
    )
    obj = dict(
        fp(b"original"),
        kind="facsimil",
        inherited=False,
        acquisitions=[],
        references=["citation.json"],
    )
    manifest = {
        "format": "irobopf-preservacion-local-v5",
        "edition": 5,
        "base": c.BASE,
        "acceptance": "ninguna",
        "cut": "R26; excluye entrega v5 y posteriores; R25 no recibido; aceptación ninguna",
        "software": {
            "docs/procedencia/preservacion-v5-sol/consumidor.py": c.p.fingerprint(CFILE)
        },
        "objects": [obj],
        "dependencies": [dependency],
        "unresolvedReferences": [],
        "exclusions": [],
    }
    (store / "sha256" / obj["sha256"]).write_bytes(b"original")
    (store / "dependencies" / facts["sha256"]).write_bytes(data)
    if mutation:
        mutation(manifest)
    raw = c.p.encoded(manifest)
    external = case / "external.json"
    external.write_bytes(raw)
    (store / "manifest.json").write_bytes(raw)
    pin = hashlib.sha256(raw).hexdigest()
    schema_ok = not list(
        c.p.Draft202012Validator(
            json.loads((c.HERE / "schema.json").read_bytes())
        ).iter_errors(manifest)
    )
    if physical:
        physical(store, manifest)
    try:
        c.verify(store, pin, external)
        outcome, error = "accept", None
    except (ValueError, OSError) as exc:
        outcome, error = "reject", type(exc).__name__
    results.append(
        {
            "id": name,
            "schemaAccepts": schema_ok,
            "expected": expected,
            "actual": outcome,
            "pass": outcome == expected,
            "errorType": error,
        }
    )


run_case("baseline", expected="accept")
run_case(
    "duplicate-object", lambda m: m["objects"].append(copy.deepcopy(m["objects"][0]))
)
run_case(
    "duplicate-dependency-path",
    lambda m: m["dependencies"].append(copy.deepcopy(m["dependencies"][0])),
)
run_case(
    "duplicate-reference",
    lambda m: m["objects"][0]["references"].append("citation.json"),
)
run_case(
    "duplicate-unresolved",
    lambda m: m["unresolvedReferences"].extend(
        [{"sha256": "a" * 64, "sources": ["a.json"]}] * 2
    ),
)
for name, value in [
    ("traversal", "../a"),
    ("absolute", "/tmp/a"),
    ("backslash", "a\\b"),
    ("newline", "a\n"),
    ("empty-component", "a//b"),
]:
    run_case("path-" + name, lambda m, v=value: m["dependencies"][0].update(path=v))
run_case(
    "prefix-conflict",
    lambda m: m["dependencies"].append(
        dict(m["dependencies"][0], path="evidence.json/child")
    ),
)
run_case("identity-incoherent", lambda m: m["dependencies"][0].update(sourceSize=123))
run_case("extra-root", physical=lambda s, m: (s / "extra").write_bytes(b"x"))
run_case(
    "extra-cas", physical=lambda s, m: (s / "sha256" / ("a" * 64)).write_bytes(b"x")
)
run_case(
    "missing-cas",
    physical=lambda s, m: (s / "sha256" / m["objects"][0]["sha256"]).unlink(),
)
run_case(
    "tampered-bytes",
    physical=lambda s, m: (s / "sha256" / m["objects"][0]["sha256"]).write_bytes(
        b"changed"
    ),
)


def symlink_blob(store, manifest):
    target = store / "sha256" / manifest["objects"][0]["sha256"]
    original = store.parent / "outside"
    original.write_bytes(target.read_bytes())
    target.unlink()
    target.symlink_to(original)


run_case("symlink-blob", physical=symlink_blob)
for name, value in [
    ("credential", "https://user:synthetic@www.boe.es/a.pdf"),
    ("private-query", "https://www.boe.es/a.pdf?token=synthetic"),
    ("lookalike", "https://www.boe.es.invalid/a.pdf"),
]:

    def acquisition(m, url=value):
        obj = m["objects"][0]
        obj.update(
            kind="original-oficial-candidato",
            acquisitions=[
                dict(
                    fp(b"original"),
                    canonicalUrl=url,
                    finalUrl=None,
                    retrievedAt="2026-10-29T10:00:00Z",
                    httpStatus=200,
                    dependency=m["dependencies"][0]["sha256"],
                )
            ],
        )

    run_case("url-" + name, acquisition)


def repeated_acquisition(m):
    obj = m["objects"][0]
    event = dict(
        fp(b"original"),
        canonicalUrl="https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764",
        finalUrl=None,
        retrievedAt="2026-10-29T10:00:00Z",
        httpStatus=200,
        dependency=m["dependencies"][0]["sha256"],
    )
    obj.update(
        kind="original-oficial-candidato", acquisitions=[event, copy.deepcopy(event)]
    )


run_case("duplicate-acquisition", repeated_acquisition)
run_case(
    "duplicate-unresolved-source",
    lambda m: m["unresolvedReferences"].append(
        {"sha256": "a" * 64, "sources": ["a.json", "a.json"]}
    ),
)
run_case(
    "marker-changed", physical=lambda s, m: (s / "manifest.json").write_bytes(b"{}")
)
run_case("unknown-schema-field", lambda m: m.update(extra=True))

# Public identifiers are positive controls, privacy probes use synthetic markers only.
for value in ["https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764"]:
    assert c.url(value)
for name, privacy_value, should_change in [
    ("private-key", {"TOKEN": "synthetic"}, True),
    ("encoded-query", "https://www.boe.es/a?%74oken=synthetic", True),
    ("embedded-path", "prosa /home/synthetic/value", True),
    ("upper-file", "FILE:///synthetic", True),
]:
    changed = c.clean(privacy_value) != privacy_value
    results.append(
        {
            "id": "privacy-" + name,
            "expectedChange": should_change,
            "actualChange": changed,
            "pass": changed == should_change,
            "classification": "residual-conocido"
            if changed != should_change
            else "control",
        }
    )
# Fault after marker publication must retain visible bytes and report indeterminate durability.
durable = CACHE / "casos/durable"
durable.mkdir()
marker = durable / "manifest.json"
with patch.object(c.p, "sync_directory", side_effect=OSError("synthetic")):
    try:
        # parent already exists; avoid fault in durable_mkdir before publication.
        real_mkdir = c.p.durable_mkdir
        with patch.object(c.p, "durable_mkdir", return_value=None):
            c.p.publish(marker, b"fixed")
        raise AssertionError("missing durability error")
    except c.p.PublicationDurabilityUnknown:
        assert marker.read_bytes() == b"fixed"
results.append(
    {"id": "durability-after-marker", "pass": True, "visibleMarkerPreserved": True}
)
try:
    c.p.publish(marker, b"replacement")
    raise AssertionError("overwrite")
except FileExistsError:
    assert marker.read_bytes() == b"fixed"
results.append({"id": "exclusive-publication", "pass": True})
# Fault specifically in transfer's final confirmation, after its marker is visible.
source_case = CACHE / "casos/baseline"
external = source_case / "external.json"
pin = hashlib.sha256(external.read_bytes()).hexdigest()
destination = CACHE / "casos/transfer-final-sync"
real_confirm = c.confirm


def fail_final_sync(*args):
    with patch.object(c.p, "sync_directory", side_effect=OSError("synthetic")):
        return real_confirm(*args)


with patch.object(c, "confirm", side_effect=fail_final_sync):
    try:
        c.transfer(source_case / "package", destination, pin, external)
        raise AssertionError("missing final sync failure")
    except c.p.PublicationDurabilityUnknown:
        assert (destination / "manifest.json").read_bytes() == external.read_bytes()
receipt = real_confirm(destination, pin, external)
assert receipt["durability"] == "fsync-confirmed"
results.append(
    {
        "id": "transfer-final-fsync-recovery",
        "pass": True,
        "markerPreserved": True,
        "confirm": receipt["durability"],
    }
)

# Consumer must originate from transported software, every project import stays under that root.
imports = {
    name: mod.__file__
    for name, mod in sys.modules.items()
    if name in ("consumidor", "preservacion", "preservacion_urls", "v3")
}
assert all(
    value is not None and Path(value).is_relative_to(SOFT) for value in imports.values()
)
(CACHE / "casos.json").write_text(
    json.dumps({"cases": results, "imports": imports}, indent=2)
)
print(
    json.dumps(
        {
            "cases": len(results),
            "unexpected": [r["id"] for r in results if not r["pass"]],
        }
    )
)
if any(not row["pass"] for row in results):
    raise SystemExit(1)
