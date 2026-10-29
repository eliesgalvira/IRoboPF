"""Contrato reviewed-nominal-v1: autoridad editorial fijada, nunca selección civil.

El pin lo autoriza el encargo R29, no el sobre que presenta el consumidor.
Una nueva decisión requiere otra revisión del contrato y de sus bytes.
"""

import hashlib
import json
from pathlib import Path

PIN = {
    "path": "docs/procedencia/correcciones/madrid-nominal-r29/decision-nominal.json",
    "sha256": "49deb823a7f462bcf12817b1d59f7e83a0a7ac16d9af8e5557ee6733bc5eb6f5",
}
SCHEMAS = Path(__file__).resolve().parents[2] / "schemas/procedencia"


def contract_data(name):
    return json.loads((SCHEMAS / ("nominal-" + name + ".schema.json")).read_bytes())[
        "const"
    ]


def verify_nominal(reader, payload, item, resolver=None):
    """Verifica proposición y cierre tipado; no aprueba un binding nuevo."""
    if payload["schemaVersion"] != 3 or payload["legalReview"]["decisions"] != PIN:
        raise ValueError("Ancla nominal no autorizada")
    decisions = reader.read_ref(PIN)
    if (
        len(decisions) != 1
        or decisions[0]["id"] != payload["legalReview"]["decisionId"]
    ):
        raise ValueError("Decisión nominal ambigua")
    decision = decisions[0]
    if payload["authorTaskId"] in (
        decision["independentReviewerTaskId"],
        decision["projectionAuthorTaskId"],
    ):
        raise ValueError("Autoría nominal no independiente")
    scope = reader.read_ref(payload["executableScope"])
    projection = {k: v for k, v in scope.items() if k != "decision"}
    if (
        projection != contract_data("projection")
        or scope["decision"] != payload["legalReview"]
    ):
        raise ValueError("Proposición nominal alterada")
    if (
        payload["source"] != scope["source"]
        or payload["inventory"] != scope["inventory"]
        or payload["itemId"] != scope["itemId"]
        or item["id"] != scope["itemId"]
        or item["value"] != scope["value"]
        or payload["conversion"] != "identity"
        or payload["scope"]
        != {k: decision[k] for k in ("year", "territory", "unit")}
        | {
            "claim": decision["meaning"],
            "conditions": decision["conditions"],
            "completeRule": False,
        }
    ):
        raise ValueError("Identidad nominal o reservas alteradas")
    dependencies = contract_data("dependencies")
    by_kind = {
        d["kind"]: d
        for d in dependencies["documents"]
        if d["kind"] in ("citation", "document-manifest")
    }
    for key, kind in [("citation", "citation"), ("document", "document-manifest")]:
        expected = {k: by_kind[kind][k] for k in ("path", "sha256")}
        if payload[key] != expected:
            raise ValueError("Referencia nominal cruzada")
    for dependency in dependencies["documents"]:
        raw = reader.read_bytes(dependency["path"])
        if hashlib.sha256(raw).hexdigest() != dependency["sha256"]:
            raise ValueError("Dependencia nominal alterada: " + dependency["kind"])
    if resolver is not None:
        for blob in dependencies["blobs"]:
            path = resolver.resolve(blob["sha256"])
            with path.open("rb") as stream:
                actual = hashlib.file_digest(stream, "sha512").hexdigest()
            if path.stat().st_size != blob["size"] or actual != blob["sha512"]:
                raise ValueError("Original contextual alterado")
    return scope
