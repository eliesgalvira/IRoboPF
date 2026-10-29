"""Controles de identidades y selectores, independientes de expectativas fiscales."""

from __future__ import annotations
import copy
import gzip
import hashlib
import json
from pathlib import Path
from typing import Any
import jsonschema

OUT = Path(__file__).resolve().parent


def read(p: str | Path) -> Any:
    path = Path(p)
    if not path.exists():
        with gzip.open(str(path) + ".gz", "rt") as stream:
            return json.load(stream)
    return json.loads(path.read_text())


def check_source(source: dict[str, Any], expected: str | None = None) -> None:
    data = Path(source["file"]).read_bytes()
    assert hashlib.sha256(data).hexdigest() == source["sha256"]
    selected = (
        data.decode()
        .encode("utf-16-le")[2 * source["start"] : 2 * source["end"]]
        .decode("utf-16-le")
    )
    if expected is not None:
        assert selected == expected


def main() -> None:
    flow = read(OUT / "flujo.json")
    schema = read(OUT / "flujo.schema.json")
    nodes = read(OUT / "nodos.json")
    jsonschema.Draft202012Validator.check_schema(schema)
    jsonschema.validate(flow, schema)
    seen = set()
    for site in flow["sites"]:
        assert site["siteId"] not in seen
        seen.add(site["siteId"])
        check_source(site["source"], site["expression"])
        for group in [
            site["valueDependencies"]["direct"],
            site["valueDependencies"]["transitive"],
            site["controlDependencies"],
        ]:
            for edge in group:
                for key in edge["chain"]:
                    node = nodes[key]
                    check_source(node["source"], node["expression"])
    for node in nodes.values():
        check_source(node["source"], node["expression"])
    cells = read(OUT / "celdas-flujo.json")
    assert len(cells) == 264 and len({c["id"] for c in cells}) == 264
    for cell in cells:
        check_source(cell["source"])
        assert (
            hashlib.sha256(Path(cell["payload"]["path"]).read_bytes()).hexdigest()
            == cell["payload"]["sha256"]
        )
        assert len(cell["consumers"]) == 2
        assert cell["case"] is not None
    negatives = []
    for name, mutate in [
        ("version", lambda x: x.update(version=2)),
        ("campo-extra", lambda x: x.update(accepted=True)),
        ("sin-inventario", lambda x: x.pop("inventory")),
        (
            "aceptacion",
            lambda x: x["sites"][0]["completeness"].update(legalAcceptance=True),
        ),
    ]:
        altered = copy.deepcopy(flow)
        mutate(altered)
        rejected = not jsonschema.Draft202012Validator(schema).is_valid(altered)
        assert rejected
        negatives.append({"id": name, "rejected": rejected})
    editions = []
    for entry in read("docs/procedencia/correcciones/editorial-r21/ediciones.json")[
        "files"
    ]:
        if "/escalas-" not in entry["path"]:
            continue
        assert (
            hashlib.sha256(Path(entry["path"]).read_bytes()).hexdigest()
            == entry["sha256"]
        )
        assert (
            hashlib.sha256(Path(entry["source"]).read_bytes()).hexdigest()
            == entry["sourceSha256"]
        )
        editions.append({**entry, "changed": entry["sha256"] != entry["sourceSha256"]})
    result = {
        "sites": len(seen),
        "cells": len(cells),
        "sourceNodes": len(nodes),
        "schemaNegatives": negatives,
        "editions": editions,
        "wiringAllowed": False,
        "legalAcceptance": False,
    }
    (OUT / "verificacion.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    )
    print(
        json.dumps(
            {k: v for k, v in result.items() if k not in ["editions"]},
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
