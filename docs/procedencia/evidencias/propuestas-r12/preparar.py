"""Remapea identidades técnicas, sin ampliar ni aceptar decisiones jurídicas."""
from __future__ import annotations

import gzip
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
BASE = "eaed990c620b5fc4d3ff2e74dc68e0c8481c43db"


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def git_bytes(path: str) -> bytes:
    return subprocess.run(
        ["git", "show", f"{BASE}:{path}"], cwd=ROOT, check=True, capture_output=True
    ).stdout


def entries(data: bytes) -> list[dict]:
    return [
        item
        for name, text in json.loads(gzip.decompress(data))
        if name.startswith("inventario-pagina-")
        for item in json.loads(text)
        if item["layer"] == "effective"
    ]


def key(item: dict) -> tuple:
    return item["source"]["file"], item["symbol"], tuple(json.loads(item["path"]))


def write(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main() -> None:
    manifest_path = "docs/procedencia/inventario.json"
    old_bytes = git_bytes(manifest_path)
    old_manifest = json.loads(old_bytes)
    old_artifact = git_bytes("docs/procedencia/" + old_manifest["artifact"]["file"])
    old = {x["id"]: x for x in entries(old_artifact)}
    current_bytes = (ROOT / manifest_path).read_bytes()
    manifest = json.loads(current_bytes)
    artifact = (ROOT / "docs/procedencia" / manifest["artifact"]["file"]).read_bytes()
    current = entries(artifact)
    indexed = {key(x): x for x in current}
    if len(indexed) != len(current):
        raise ValueError("Identidad efectiva duplicada")
    rows = []
    for domain, count in [("estatales", 78), ("autonomicas", 186)]:
        paths = sorted((OUT.parent / f"{domain}-v2" / "payloads").glob("*.json"))
        if len(paths) != count:
            raise ValueError("Cantidad de candidatos inesperada")
        for path in paths:
            original_bytes = path.read_bytes()
            payload = json.loads(original_bytes)
            if payload["inventory"] != {
                "manifestSha256": sha(old_bytes),
                "artifactSha256": sha(old_artifact),
            }:
                raise ValueError("Inventario histórico distinto")
            previous = old[payload["itemId"]]
            identity = (
                payload["source"]["file"],
                payload["source"]["symbol"],
                tuple(payload["source"]["tablePath"]),
            )
            if key(previous) != identity or previous["source"]["sha256"] != payload["source"]["sha256"]:
                raise ValueError("Sujeto histórico distinto")
            now = indexed[identity]
            if previous["value"] != now["value"] or previous["unit"] != now["unit"]:
                raise ValueError("Valor o unidad cambiados: exige nueva investigación")
            scope = payload["scope"]
            if scope["year"] not in now["years"] or scope["territory"] not in now["territories"]:
                raise ValueError("Ámbito técnico ausente")
            if sha((ROOT / now["source"]["file"]).read_bytes()) != now["source"]["sha256"]:
                raise ValueError("Código actual distinto")
            for name in ("citation", "document"):
                ref = payload[name]
                if sha((ROOT / ref["path"]).read_bytes()) != ref["sha256"]:
                    raise ValueError("Dependencia documental distinta")
            payload["id"] = "r12-" + payload["id"]
            payload["authorTaskId"] = "orquestador-propuestas-r12"
            payload["inventory"] = {"manifestSha256": sha(current_bytes), "artifactSha256": sha(artifact)}
            payload["itemId"] = now["id"]
            payload["source"]["sha256"] = now["source"]["sha256"]
            scope["conditions"] = [
                x for x in scope["conditions"]
                if x != "Ámbito territorial técnico vacío: candidato bloqueado."
            ] + ["Ámbito técnico explícito; vigencia y enlace canónico pendientes de revisión independiente nueva."]
            destination = OUT / domain / (payload["id"] + ".json")
            write(destination, payload)
            rows.append({
                "domain": domain,
                "original": {"path": str(path.relative_to(ROOT)), "sha256": sha(original_bytes)},
                "proposal": {"path": str(destination.relative_to(ROOT)), "sha256": sha(destination.read_bytes())},
                "previousItemId": previous["id"], "currentItemId": now["id"],
                "identity": {"file": identity[0], "symbol": identity[1], "tablePath": identity[2]},
                "valueUnchanged": now["value"], "unitUnchanged": now["unit"],
                "technicalYears": now["years"], "technicalTerritories": now["territories"],
                "status": "needs-independent-legal-review",
                "completeRuleAcceptance": False,
                "blockers": ["Decisión anterior conserva su alcance y schema; no acredita el helper actual.", "Falta revisión independiente del payload exacto."]
            })
    write(OUT / "correspondencias.json", {
        "version": 1, "previousBase": BASE, "currentManifestSha256": sha(current_bytes),
        "currentArtifactSha256": sha(artifact), "count": len(rows), "rows": rows,
        "registryModified": False, "completeRuleAcceptance": False,
    })
    print(json.dumps({"candidates": len(rows), "manifestSha256": sha(current_bytes), "accepted": 0}))


if __name__ == "__main__":
    main()
