"""Fronteras de todos los patrones y de la representación JSON."""

import copy
import json
from pathlib import Path
import re
import subprocess
import sys
import types

out = Path(__file__).resolve().parent
sys.argv = [__file__, "actual"]
bootstrap = types.ModuleType("bootstrap")
bootstrap.__file__ = str(out / "revisar.py")
exec(
    compile(
        (out / "revisar.py").read_text().split("rows: list")[0],
        str(out / "revisar.py"),
        "exec",
    ),
    bootstrap.__dict__,
)
review = bootstrap.review
r = bootstrap.r
PRIOR = bootstrap.PRIOR
rows: list[dict[str, object]] = []
for version in ("anterior", "actual"):
    schema_path = "tools/procedencia/preservacion_ampliacion.schema.json"
    raw = (
        subprocess.check_output(["git", "show", PRIOR + ":" + schema_path])
        if version == "anterior"
        else Path(schema_path).read_bytes()
    )
    schema = json.loads(raw)

    def walk(value, path=()):
        if isinstance(value, dict):
            if "pattern" in value:
                pattern = value["pattern"]
                valid = (
                    "checkout:payload"
                    if "checkout:" in pattern
                    else "a" * 128
                    if "{128}" in pattern
                    else "a" * 64
                    if "{64}" in pattern
                    else "a" * 40
                    if "{40}" in pattern
                    else "dir/doc.json"
                )
                assert re.search(pattern, valid)
                rows.append(
                    dict(
                        version=version,
                        path=list(path),
                        newlineAccepted=re.search(pattern, valid + "\n") is not None,
                    )
                )
            for key, child in value.items():
                walk(child, (*path, key))
        elif isinstance(value, list):
            for index, child in enumerate(value):
                walk(child, (*path, index))

    walk(schema)
assert len(rows) == 28
assert all(row["newlineAccepted"] == (row["version"] == "anterior") for row in rows)
c = review.fixture()
try:
    original = copy.deepcopy(c.m)
    c.m["annex"][0]["sources"] *= 2
    c.store()
    path = c.work / "manifest.json"
    raw = path.read_text()
    raw = raw.replace("checkout:payload", "checkout:payl\\u006fad", 1)
    path.write_text(raw)
    try:
        r.load()
        escaped_rejected = False
    except ValueError:
        escaped_rejected = True
    assert escaped_rejected
    c.m = copy.deepcopy(original)
    event = copy.deepcopy(c.m["annex"][0]["acquisitions"][0])
    event["retrievedAt"] = "2026-10-29T11:00:00Z"
    c.m["annex"][0]["acquisitions"].append(event)
    for order in ("original", "reverse"):
        c.m["annex"][0]["acquisitions"].reverse()
        c.store()
        r.load()
finally:
    c.doCleanups()
(out / "fronteras.json").write_text(
    json.dumps(
        dict(
            patterns=rows,
            escapedDuplicateRejected=escaped_rejected,
            distinctEventsEitherOrder=True,
        ),
        indent=2,
    )
    + "\n"
)
