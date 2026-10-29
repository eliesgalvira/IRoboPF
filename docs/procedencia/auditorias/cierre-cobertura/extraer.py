"""Índice conservador de evidencia integrada; no decide equivalencia ni aceptación."""

from __future__ import annotations

import gzip
import hashlib
import json
import os
import re
import stat
import subprocess
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Iterator

BASE = "65cff4fd8eb8c6269c2ce97b88e770aa711bff7f"
ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def save(name: str, data: Any) -> None:
    raw = (
        json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    ).encode()
    (OUT / name).write_bytes(
        gzip.compress(raw, mtime=0) if name.endswith(".gz") else raw
    )


def walk(value: Any, pointer: str = "") -> Iterator[tuple[str, dict[str, Any]]]:
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(
                child, pointer + "/" + key.replace("~", "~0").replace("/", "~1")
            )
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + "/" + str(index))


def main() -> None:
    head = (
        subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT).decode().strip()
    )
    assert head == BASE, head
    entries = subprocess.check_output(["git", "ls-tree", "-rz", BASE], cwd=ROOT).split(
        b"\0"
    )
    tracked: list[str] = []
    presence = []
    for entry in entries:
        if not entry:
            continue
        meta, name = entry.split(b"\t", 1)
        path = name.decode()
        tracked.append(path)
        mode, _, blob = meta.decode().split()
        local = ROOT / path
        info = local.lstat()
        data = (
            os.readlink(local).encode()
            if stat.S_ISLNK(info.st_mode)
            else local.read_bytes()
        )
        # Git blob identity checks all bytes against base without trusting the index.
        actual = hashlib.sha1(
            b"blob " + str(len(data)).encode() + b"\0" + data
        ).hexdigest()
        presence.append(
            {
                "path": path,
                "mode": mode,
                "symlink": os.readlink(local) if local.is_symlink() else None,
                "size": len(data),
                "sha256": digest(data),
                "baseBlob": blob,
                "matchesBase": actual == blob,
            }
        )
    save("base.json.gz", presence)
    assert all(p["matchesBase"] for p in presence)
    docs: dict[str, str] = {}
    sources = []
    records = []
    selected = ("cobertura", "matriz", "hallazgo", "decision", "revision", "aceptacion")
    for path in tracked:
        if not path.startswith("docs/procedencia/") or "/datos/objetos/" in path:
            continue
        file = ROOT / path
        if file.suffix.lower() not in (".json", ".md", ".log"):
            continue
        data = file.read_bytes()
        text = data.decode(errors="replace")
        docs[path] = text
        if file.suffix == ".json" and any(word in path.lower() for word in selected):
            parsed = json.loads(text)
            sources.append(
                {
                    "path": path,
                    "sha256": digest(data),
                    "size": len(data),
                    "kind": type(parsed).__name__,
                }
            )
            for pointer, obj in walk(parsed):
                identity = obj.get("id", obj.get("findingId", obj.get("hallazgoId")))
                if not isinstance(identity, str):
                    continue
                records.append(
                    {
                        "id": identity,
                        "source": path,
                        "pointer": pointer,
                        "declared": {
                            k: v for k, v in obj.items() if k not in ("headers",)
                        },
                        "bindingAceptado": "no-inferido",
                        "reglaCompleta": "no-inferida",
                    }
                )
    save("fuentes-matrices.json", sources)
    # Literal mentions are navigation, explicitly NOT a semantic join.
    ids = {r["id"] for r in records}
    mentions: dict[str, list[dict[str, Any]]] = defaultdict(list)
    pattern = re.compile(r"[A-Za-z][A-Za-z0-9_-]*[0-9][A-Za-z0-9_-]*")
    for path, text in docs.items():
        for line, content in enumerate(text.splitlines(), 1):
            for identity in set(pattern.findall(content)) & ids:
                mentions[identity].append({"path": path, "line": line})
    save("registros.json.gz", records)
    save("relaciones-literales.json.gz", dict(mentions))
    manifest_path = ROOT / "docs/procedencia/inventario.json"
    manifest = json.loads(manifest_path.read_text())
    artifact = (manifest_path.parent / manifest["artifact"]["file"]).read_bytes()
    assert digest(artifact) == manifest["artifact"]["sha256"]
    assert (
        digest(manifest_path.read_bytes())
        == "4f00b24bfa37baa3521d54af1448d99a2ef6d1eee3e08bcf8b4d16ec97af7314"
    )
    bundle = dict(json.loads(gzip.decompress(artifact)))
    groups: Counter[tuple[str, str, str, str]] = Counter()
    total = 0
    sample: list[dict[str, Any]] = []
    for name, text in bundle.items():
        if not re.fullmatch(r"inventario-pagina-\d+\.json", name):
            continue
        for item in json.loads(text):
            total += 1
            key = (
                str(item.get("domain", "sin-dominio")),
                json.dumps(item.get("years", [])),
                json.dumps(item.get("territories", [])),
                str(item.get("layer", item.get("kind"))),
            )
            groups[key] += 1
            if len(sample) < 3:
                sample.append(item)
    save(
        "matriz-inventario.json",
        [
            {
                "dominio": k[0],
                "ejerciciosCandidatos": json.loads(k[1]),
                "territoriosCandidatos": json.loads(k[2]),
                "clase": k[3],
                "ocurrencias": v,
                "contrato": "no-deducible-de-dimensiones-tecnicas",
                "inventariado": True,
                "candidato": True,
                "contrarrevisadoAcotado": None,
                "implementado": None,
                "bindingAceptado": None,
                "reglaCompleta": None,
            }
            for k, v in sorted(groups.items())
        ],
    )
    deductions = json.loads(bundle["inventario-deducciones.json"])
    save("deducciones-351.json", deductions)
    save("forales.json", json.loads(bundle["inventario-forales.json"]))
    storage = ROOT / "docs/procedencia/implementaciones/contenidos/datos/objetos"
    snapshot_id = "98c315e18130d88b18a4c85aa62ec2b1dd1d18a62d9f5cf61fd57711399e7e1a"
    snapshot_bytes = (storage / snapshot_id).read_bytes()
    assert digest(snapshot_bytes) == snapshot_id
    snapshot = json.loads(snapshot_bytes)
    section_states: dict[str, Counter[str]] = defaultdict(Counter)
    types: Counter[str] = Counter()
    identities: Counter[str] = Counter()
    count = complete = 0
    for ref in snapshot["paquetes"]:
        raw = (storage / ref["hash"]).read_bytes()
        assert digest(raw) == ref["hash"]
        package = json.loads(gzip.decompress(raw))
        for wrapper in package:
            entity = wrapper["entidad"]
            count += 1
            types[entity["tipo"]] += 1
            identities[entity.get("identidad", "sin-identidad")] += 1
            sections = entity.get("secciones", {})
            for key, value in sections.items():
                section_states[key][value["estado"]] += 1
            if all(
                sections.get(k, {}).get("estado") not in (None, "pendiente")
                for k in ("formula", "derivacion", "norma", "evidencia", "bordes")
            ):
                complete += 1
    save(
        "paginas.json",
        {
            "snapshot": snapshot_id,
            "entidades": count,
            "tipos": types,
            "identidades": identities,
            "secciones": section_states,
            "cincoSeccionesNoPendientes": complete,
            "criterio": "Completitud estructural, no calidad experta ni aceptación",
            "snapshotKeys": list(snapshot),
        },
    )
    save(
        "resumen.json",
        {
            "base": head,
            "entradasPresentes": len(presence),
            "symlinks": sum(p["symlink"] is not None for p in presence),
            "ausencias": 0,
            "diff": subprocess.check_output(
                ["git", "diff", "--stat", BASE], cwd=ROOT
            ).decode(),
            "matricesLeidas": len(sources),
            "registrosConId": len(records),
            "idsDistintos": len(ids),
            "ocurrencias": total,
            "deducciones": len(deductions),
            "muestraInventario": sample,
        },
    )
    print(
        json.dumps(
            {
                "matrices": len(sources),
                "registros": len(records),
                "ocurrencias": total,
                "paginas": count,
            }
        )
    )


if __name__ == "__main__":
    main()
