"""Proyección fija de dos delegaciones y 264 pares; sin alta de confianza."""

import base64
import hashlib
import json
from pathlib import Path
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "tools/procedencia"))
from enlaces import DocumentaryReadSet, delegation_entries, verify_attestation  # noqa: E402
from corpus import validate_schema  # noqa: E402

DERIVED = "docs/procedencia/revisiones/tecnica-r23-sol/registro-derivado-candidato.json"
LIVE = "docs/procedencia/enlaces/revisores.json"
SCRATCH = ROOT / ".cache/orquestador-recepcion/r25/registro-ensayo"


def checked(ref: dict) -> bytes:
    path = Path(ref["path"])
    assert not path.is_absolute() and ".." not in path.parts
    file = ROOT / path
    assert file.is_file() and not file.is_symlink()
    raw = file.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == ref["sha256"], path
    if "sha512" in ref:
        assert hashlib.sha512(raw).hexdigest() == ref["sha512"], path
    if "size" in ref:
        assert len(raw) == ref["size"], path
    return raw


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main() -> None:
    live_raw = (ROOT / LIVE).read_bytes()
    assert json.loads(live_raw) == {"schemaVersion": 1, "reviewers": []}
    derived_raw = (ROOT / DERIVED).read_bytes()
    derived_hash = hashlib.sha256(derived_raw).hexdigest()
    derived = json.loads(derived_raw)
    assert derived["operationalApproval"] is False and derived["trustMutation"] is False
    original_raw = checked(derived["sourceRegistry"])
    assert base64.b64decode(derived["sourceRegistryOriginalBytesBase64"], validate=True) == original_raw
    original = json.loads(original_raw)
    identity_map = json.loads(checked(derived["identityMap"]))
    identities = {entry["key"]: entry for entry in identity_map["identities"]}
    delegates = delegation_entries(derived)
    assert len(delegates) == 2 and len(derived["bindings"]) == 264
    reviewers: list[dict] = []
    coverage = []
    payloads: dict[str, dict] = {}
    transported = {DERIVED: derived_raw}
    seen: set[str] = set()
    for delegate in delegates:
        source = original["delegates"][delegate["sourceDelegateIndex"]]
        assert source == delegate["sourceDelegate"]
        assert source["role"] == "review" and source["model"] == "gpt-6.1-sol"
        assert delegate["key"] == source["key"]
        canonical = source["taskId"]
        command = unquote(canonical.removeprefix("node:delegated-task:"))
        assert canonical == source["childNodeId"] == delegate["canonicalTaskId"]
        assert command == delegate["commandKey"]
        identity = identities[delegate["key"]]
        assert identity["canonicalTaskId"] == canonical and identity["commandKey"] == command
        expected_id = canonical if delegate["key"] == "revision-bindings-estatales" else command
        assert delegate["taskId"] == expected_id
        exact_attestations = {(a["path"], a["sha256"]) for a in identity["attestations"]}
        approvals = []
        report_directories: set[str] = set()
        for binding in derived["bindings"]:
            if binding["reviewTaskId"] != expected_id:
                continue
            assert binding["canonicalTaskId"] == canonical
            assert binding["operationalApproval"] is False
            for key in ("payload", "attestation", "report"):
                ref = binding[key]
                transported[ref["path"]] = checked(ref)
            payload = json.loads(transported[binding["payload"]["path"]])
            attestation = json.loads(transported[binding["attestation"]["path"]])
            payload_hash = binding["payload"]["sha256"]
            assert payload_hash not in seen
            seen.add(payload_hash)
            assert payload["schemaVersion"] == 2
            assert payload["authorTaskId"] not in (canonical, command)
            assert attestation["reviewTaskId"] == expected_id
            assert attestation["payloadSha256"] == payload_hash
            assert attestation["inventory"] == payload["inventory"] == binding["inventory"]
            assert attestation["scope"] == payload["scope"] == binding["scope"]
            assert attestation["scope"]["completeRule"] is False
            assert attestation["decision"] == "accepted-limited"
            assert attestation["report"] == binding["report"]
            assert transported[binding["report"]["path"]].strip()
            att_ref = {k: binding["attestation"][k] for k in ("path", "sha256")}
            assert (att_ref["path"], att_ref["sha256"]) in exact_attestations
            report_directories.add(str(Path(binding["report"]["path"]).parent))
            payloads[payload_hash] = payload
            approvals.append({"payloadSha256": payload_hash, "attestation": att_ref})
        expected_count = 78 if delegate["key"] == "revision-bindings-estatales" else 186
        assert len(approvals) == len(exact_attestations) == expected_count
        assert len(report_directories) == 1
        reviewers.append({"taskId": expected_id,
                          "delegationRegistry": {"path": DERIVED, "sha256": derived_hash},
                          "reportDirectory": report_directories.pop(),
                          "approvals": sorted(approvals, key=lambda row: row["payloadSha256"])})
        coverage.append({"key": delegate["key"], "canonicalTaskId": canonical,
                         "exactTaskId": expected_id, "pairs": expected_count})
    assert len(seen) == 264
    candidate = {"schemaVersion": 2, "reviewers": reviewers}
    validate_schema(candidate, "binding-reviewers")
    write_json(OUT / "revisores-candidatos.json", candidate)

    # Ensayo físico del auxiliar real. No sustituye al coordinador completo.
    for relative, raw in transported.items():
        target = SCRATCH / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        assert not target.is_symlink()
        target.write_bytes(raw)
    target = SCRATCH / LIVE
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(live_raw)
    pending_reader = DocumentaryReadSet(SCRATCH)
    refused = 0
    for reviewer in reviewers:
        for approval in reviewer["approvals"]:
            h = approval["payloadSha256"]
            try:
                verify_attestation(pending_reader, approval["attestation"], payloads[h], h)
            except ValueError as error:
                assert str(error) == "Revisor no registrado inequívocamente por el orquestador"
                refused += 1
            else:
                raise AssertionError("Registro vacío aceptó atestación")
    pending_reader.finish()
    write_json(target, candidate)
    reader = DocumentaryReadSet(SCRATCH)
    accepted = 0
    for reviewer in reviewers:
        for approval in reviewer["approvals"]:
            h = approval["payloadSha256"]
            assert verify_attestation(reader, approval["attestation"], payloads[h], h) == "accepted-limited"
            accepted += 1
    dependencies = reader.finish()
    assert accepted == refused == 264
    assert (ROOT / LIVE).read_bytes() == live_raw
    write_json(OUT / "comprobaciones.json", {
        "derivedRegistry": {"path": DERIVED, "sha256": derived_hash},
        "sourceRegistry": derived["sourceRegistry"], "identityMap": derived["identityMap"],
        "identities": coverage, "uniquePairs": len(seen),
        "helperRejectedWithLiveEmptyRegistry": refused,
        "helperAcceptedInPhysicalScratch": accepted,
        "scratchDependencies": dependencies,
        "liveRegistrySha256Unchanged": hashlib.sha256(live_raw).hexdigest(),
        "operationalApproval": False, "completeRuleAcceptance": False,
        "limits": "Ensayo del auxiliar de atestaciones; no coordinador completo, ámbito temporal, CAS, publicación ni aceptación fiscal. Revisión nueva pendiente."})
    print("264 pares exactos; dos identidades; 264 rechazos iniciales y 264 pases limitados en scratch; registro activo intacto")


if __name__ == "__main__":
    main()
