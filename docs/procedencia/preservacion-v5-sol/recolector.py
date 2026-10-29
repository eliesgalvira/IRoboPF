"""Corte R26 por archivo, censo de campos hash con contexto y transporte local."""

from collections import Counter
import gzip
import hashlib
import json
from pathlib import Path
import re
import subprocess
from typing import Any, TextIO
import consumidor as c

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
CACHE = ROOT / ".cache/preservacion-v5-sol"
BASE = "6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9"
OLD = Path(
    "/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v4-938f230888d2/paquete"
)
HASH = re.compile("[0-9a-f]{64}")
POLICY = {
    "version": "v5-r26-clasificacion-r31",
    "unit": "campo hash tipado y contexto estructural, no expresión regular global",
    "privacy": "clean v4 R26 policy2; originales intactos; no certificación universal",
    "unknown": "formas ambiguas no acreditan exhaustividad documental",
    "excluded": [
        "R25 no recibido",
        "entrega v5 y posterior",
        "contenido X salvo clasificación",
        "fixture sintético sin valor fiscal",
    ],
}


def write(path, value):
    path.write_bytes(c.p.encoded(value))


def origin_kind(row):
    """Contrato acotado de origen: la ruta de destino no sustituye a source."""
    explicit = [row[k] for k in ("source", "sourcePath", "sourceFile") if k in row]
    paths = explicit if explicit else [row.get("path")]
    if any(not isinstance(p, str) or not p for p in paths):
        return "desconocido"
    if len(set(paths)) != 1:
        return "desconocido"
    path = Path(paths[0])
    if path.is_absolute() or ".." in path.parts or "\\" in paths[0] or ":" in paths[0]:
        return "desconocido"
    suffix = path.suffix.casefold()
    mime = row.get("sourceMimeType", row.get("mimeType", ""))
    if not isinstance(mime, str):
        return "desconocido"
    mime = mime.partition(";")[0].strip().casefold()
    if suffix == ".pdf" and mime in ("", "application/pdf"):
        return "desconocido-documental"
    if suffix in {
        ".ts",
        ".tsx",
        ".js",
        ".mjs",
        ".cjs",
        ".py",
        ".rs",
        ".sh",
    } and mime in ("", "text/plain"):
        return "fuente-software"
    return "desconocido"


def documentary_kind(url, row):
    return (
        "captura-secundaria-URL-oficial"
        if "web.archive.org" in str(url)
        or "web.archive.org" in str(row.get("finalUrl"))
        else "original-oficial"
    )


def classify(name, pointer, row, key):
    """La evidencia de cada inferencia conserva campo, puntero y contexto saneado."""
    scope = (name + "/" + pointer).lower()
    url = row.get("canonicalUrl", row.get("url", row.get("finalUrl", "")))
    if any(
        x in scope
        for x in ("fixture", "/casos/", "synthetic", "inventario-pruebas", "/mocks/")
    ):
        return "fixture-sintetico", "ruta de fixture/caso; no norma"
    if any(
        x in scope for x in ("necesidades-expertas", "correcciones-x")
    ) and not c.url(url):
        return (
            "contenido-publico-X",
            "ámbito público X; se excluye payload, no se infiere oficialidad",
        )
    # El tipo del campo prevalece sobre la URL de otro objeto en la misma fila.
    field = key.replace("_", "").replace("-", "").casefold()
    if field in {
        "selectionsha256",
        "selectionhash",
        "selectorsha256",
        "selectorhash",
        "citationsha256",
        "citationhash",
    }:
        return "seleccion-cita", "huella de selección/cita; no bytes del original"
    if field in {
        "quotesha256",
        "quotehash",
        "textsha256",
        "texthash",
        "extractedtextsha256",
        "extractedtexthash",
    }:
        return "texto-extraido", "huella textual derivada; no bytes del original"
    if field in {"sourcesha256", "sourcehash"}:
        return origin_kind(
            row
        ), "origen según ruta/tipo declarados; sin contexto suficiente, desconocido"
    if any(
        x in field
        for x in (
            "software",
            "code",
            "schema",
            "base",
            "inventory",
            "artifact",
        )
    ) or field in {"filesha256", "filehash"}:
        return "fuente-software", "identidad técnica declarada por campo"
    # Un campo documental no pasa a identificar el recorte por su ancestro.
    if any(x in field for x in ("document", "original")):
        if c.url(url) and field in {
            "documentsha256",
            "documenthash",
            "originalsha256",
            "originalhash",
        }:
            return documentary_kind(
                url, row
            ), "campo documental y URL admitida; no autenticidad jurídica"
        return (
            "desconocido-documental",
            "referencia documental; requiere resolver su contrato",
        )
    if any(x in key.lower() for x in ("facsim", "crop")) or any(
        x in pointer.lower() for x in ("facsim", "receta")
    ):
        return "facsimil-receta", "campo/ancestro de facsímil o receta"
    if c.url(url) and field in {"sha256", "hash"}:
        return documentary_kind(
            url, row
        ), "campo de adquisición y URL admitida; no autenticidad jurídica"
    if any(
        x in pointer.lower().split("/") for x in ("original", "document", "documento")
    ):
        return (
            "desconocido-documental",
            "referencia documental sin URL contigua; requiere resolver cadena",
        )
    if any(x in scope for x in ("adquisicion", "acquisition", "fuentes.json")):
        return (
            "metadatos-adquisicion",
            "estructura de adquisición; no original por sí sola",
        )
    if any(
        x in scope
        for x in ("attest", "atest", "snapshot", "/revisiones/", "/correcciones/")
    ):
        return "atestacion-caso-tecnico", "estructura técnica; no aceptación"
    return "desconocido", "campo hash sin semántica documental suficiente"


def observations(value, name, pointer=""):
    if isinstance(value, dict):
        for key, item in value.items():
            ptr = pointer + "/" + key.replace("~", "~0").replace("/", "~1")
            if (
                isinstance(item, str)
                and HASH.fullmatch(item)
                and ("hash" in key.lower() or "sha256" in key.lower())
            ):
                kind, reason = classify(name, pointer, value, key)
                yield {
                    "path": name,
                    "pointer": ptr,
                    "sha256": item,
                    "kind": kind,
                    "reason": reason,
                    "context": c.clean(
                        {
                            k: v
                            for k, v in value.items()
                            if k
                            in (
                                "id",
                                "url",
                                "canonicalUrl",
                                "finalUrl",
                                "mimeType",
                                "sourceMimeType",
                                "source",
                                "sourcePath",
                                "sourceFile",
                                "page",
                                "pagina",
                                "path",
                            )
                        }
                    ),
                }
            yield from observations(item, name, ptr)
    elif isinstance(value, list):
        for i, item in enumerate(value):
            if (
                isinstance(item, str)
                and HASH.fullmatch(item)
                and any(
                    k in pointer.lower().rsplit("/", 1)[-1] for k in ("hash", "sha256")
                )
            ):
                kind, reason = classify(name, pointer, {}, pointer.rsplit("/", 1)[-1])
                yield {
                    "path": name,
                    "pointer": pointer + "/" + str(i),
                    "sha256": item,
                    "kind": kind,
                    "reason": reason,
                    "context": {},
                }
            yield from observations(item, name, pointer + "/" + str(i))


def collect():
    assert (
        subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip() == BASE
    )
    stage = CACHE / "recepcion-v5-final"
    stage.mkdir(exist_ok=False)
    for folder in ("sha256", "dependencies"):
        (stage / folder).mkdir()
    old = c.p.strict_json((OLD / "manifest.json").read_bytes())
    assert (
        hashlib.sha256((OLD / "manifest.json").read_bytes()).hexdigest()
        == c.HISTORICAL_PIN
    )
    dependencies = {}
    objects = {}
    locations = {}
    refs: dict[str, set[str]] = {}
    classes: Counter[str] = Counter()
    exclusions = []
    counts: Counter[str] = Counter()

    def dep(path, name):
        source = c.p.fingerprint(path)
        data = path.read_bytes()
        if name.endswith((".json", ".json.gz")):
            value = c.p.strict_json(
                gzip.decompress(data) if name.endswith(".gz") else data
            )
            sanitized = c.clean(value)
            if sanitized != value:
                data = c.p.encoded(sanitized)
                if name.endswith(".gz"):
                    data = gzip.compress(data, mtime=0)
        sha = hashlib.sha256(data).hexdigest()
        target = stage / "dependencies" / sha
        if not target.exists():
            c.p.publish(target, data)
        dependencies[name] = {
            "path": name,
            **c.p.fingerprint(target),
            "sourceSha256": source["sha256"],
            "sourceSha512": source["sha512"],
            "sourceSize": source["size"],
            "sanitized": source["sha256"] != sha,
            "historical": False,
        }

    # Los objetos documentales históricos se reutilizan, no se reexportan paquetes v1–v4.
    for row in old["objects"]:
        obj = dict(row)
        obj["acquisitions"] = list(
            {c.p.encoded(a): a for a in row["acquisitions"]}.values()
        )
        obj["references"] = list(dict.fromkeys(row["references"]))
        objects[row["sha256"]] = obj
        locations[row["sha256"]] = OLD / "sha256" / row["sha256"]
    # Conservar cierre histórico de recetas con derivación nueva identificada.
    for row in old["dependencies"]:
        dep(OLD / "dependencies" / row["sha256"], "herencia-v4/" + row["path"])
    # Reapuntar proyecciones a su nueva dependencia, conservar fuente original en manifiesto histórico saneado.
    remap = {
        row["sha256"]: dependencies["herencia-v4/" + row["path"]]["sha256"]
        for row in old["dependencies"]
    }
    for obj in objects.values():
        for a in obj["acquisitions"]:
            a["dependency"] = remap[a["dependency"]]
    dep(OLD / "manifest.json", "herencia-v4-indice/manifest.json")
    tracked = [
        n
        for n in subprocess.check_output(["git", "ls-tree", "-rz", "--name-only", BASE])
        .decode()
        .split("\0")
        if n
    ]
    census = CACHE / "referencias-final.jsonl.gz"
    with gzip.open(census, "wt") as out:
        for name in tracked:
            path = ROOT / name
            if path.is_symlink():
                continue
            isjson = name.endswith((".json", ".json.gz"))
            evidence = name.startswith(
                (
                    "docs/procedencia/",
                    "tools/procedencia/",
                    "schemas/procedencia/",
                    "lib/procedencia/",
                )
            )
            if isjson:
                counts["jsonFiles"] += 1
                try:
                    with (
                        gzip.open(path, "rt") if name.endswith(".gz") else path.open()
                    ) as stream:
                        value = c.p.strict_json(stream.read())
                    for obs in observations(value, name):
                        sha = obs["sha256"]
                        classes[obs["kind"]] += 1
                        refs.setdefault(sha, set()).add(name)
                        obs["resolvedInV4"] = sha in objects or sha in remap
                        out.write(json.dumps(obs, ensure_ascii=False) + "\n")
                    del value
                except (ValueError, UnicodeError) as err:
                    exclusions.append(
                        {
                            "path": name,
                            "sha256": c.p.fingerprint(path)["sha256"],
                            "reason": "JSON inválido; sin reparar: "
                            + type(err).__name__,
                        }
                    )
                    continue
            if any(x in name for x in ("necesidades-expertas", "correcciones-x")):
                exclusions.append(
                    {
                        "path": name,
                        "reason": "contenido X fuera de transporte; clasificación en censo",
                    }
                )
                continue
            if (
                evidence
                or isjson
                or name in ("package.json", "bun.lock", "tsconfig.json")
            ):
                if path.suffix in (".pdf", ".png") or HASH.fullmatch(path.name):
                    locations[c.p.fingerprint(path)["sha256"]] = path
                elif path.suffix in (
                    ".py",
                    ".ts",
                    ".json",
                    ".gz",
                    ".sh",
                    ".toml",
                    ".lock",
                    ".nix",
                ):
                    try:
                        dep(path, name)
                    except (ValueError, UnicodeError):
                        exclusions.append(
                            {
                                "path": name,
                                "reason": "metadato inválido; no transformado",
                            }
                        )
    missing = c.p.strict_json(
        (
            ROOT
            / "docs/procedencia/correcciones/preservacion-v4-r26/faltantes-localizados.json"
        ).read_bytes()
    )
    for row in missing:
        path = Path(row["localPath"])
        c.p.check(path, row)
        sha = row["sha256"]
        locations[sha] = path
        # El registro fuente se transporta íntegro salvo política de metadatos; no inventar fecha/HTTP.
        objects[sha] = {k: row[k] for k in ("sha256", "sha512", "size")}
        events = []
        for reference in row["acquisitionReferences"]:
            source = ROOT / reference["path"]
            value = c.p.strict_json(source.read_bytes())
            for acquisition in c.p.nodes(value):
                if acquisition.get("sha256") == sha and all(
                    k in acquisition
                    for k in (
                        "sha512",
                        "size",
                        "retrievedAt",
                        "httpStatus",
                        "canonicalUrl",
                    )
                ):
                    event = {
                        k: acquisition[k]
                        for k in (
                            "sha256",
                            "sha512",
                            "size",
                            "retrievedAt",
                            "httpStatus",
                            "canonicalUrl",
                        )
                    }
                    event.update(
                        finalUrl=acquisition.get("finalUrl"),
                        dependency=dependencies[reference["path"]]["sha256"],
                    )
                    events.append(event)
        assert events, "Adquisición original no localizada"
        objects[sha].update(
            kind="original-oficial-candidato",
            inherited=False,
            acquisitions=list({c.p.encoded(a): a for a in events}.values()),
            references=list(
                dict.fromkeys(a["path"] for a in row["acquisitionReferences"])
            ),
        )
    # CAS recibidos: búsquedas por identidad, jamás recorrido del HOME o hijos.
    areas = [
        "sha256",
        "recepcion-r20/retenciones-2012-2014/sha256",
        "recepcion-r19/retenciones/sha256",
        "retenciones-originales-2012-2016/sha256",
    ]
    for sha in refs:
        if sha not in locations:
            for area in areas:
                candidate = c.PARENT / ".cache/procedencia" / area / sha
                if (
                    candidate.is_file()
                    and not candidate.is_symlink()
                    and c.p.fingerprint(candidate)["sha256"] == sha
                ):
                    locations[sha] = candidate
                    break
    # Nuevos bytes sin clasificación oficial acreditada se conservan como auxiliares, nunca se promueven a PDF.
    for sha, path in locations.items():
        if sha in objects:
            c.p.check(path, objects[sha])
            c.put(path, stage / "sha256" / sha)
        elif sha in refs:
            dep(path, "residuos-por-identidad/" + sha)
    with gzip.open(census, "rt") as stream:
        part: TextIO | None = None
        for i, line in enumerate(stream):
            if i % 10000 == 0:
                if part:
                    part.close()
                part = gzip.open(
                    HERE / ("censo-parte-" + str(i // 10000).zfill(4) + ".jsonl.gz"),
                    "wt",
                )
            assert part is not None
            part.write(line)
        if part:
            part.close()
    resolvedKinds = {sha: row["kind"] for sha, row in objects.items()}
    auxiliarySources = {d["sourceSha256"]: d["path"] for d in dependencies.values()}
    with gzip.open(HERE / "resoluciones.jsonl.gz", "wt") as resolution:
        for sha, paths in sorted(refs.items()):
            status = (
                "objeto"
                if sha in objects
                else "auxiliar"
                if sha in auxiliarySources
                else "no-resuelto"
            )
            resolution.write(
                json.dumps(
                    {
                        "sha256": sha,
                        "status": status,
                        "kind": resolvedKinds.get(sha),
                        "auxiliarySource": auxiliarySources.get(sha),
                        "sources": sorted(paths),
                        "reason": "identidad verificada; semántica candidata"
                        if status != "no-resuelto"
                        else "no disponible en paquete/CAS expresamente entregados; no inferir PDF perdido",
                    }
                )
                + "\n"
            )
    write(HERE / "politica.json", POLICY)
    # Fragmentos del censo con tamaño individual acotado; original del ensayo conservado en caché.
    for path in sorted(HERE.iterdir()):
        if (
            path.suffix in (".py", ".json")
            or path.name.startswith("censo-parte-")
            or path.name == "resoluciones.jsonl.gz"
        ):
            dep(path, path.relative_to(ROOT).as_posix())
    software = {
        str(p.relative_to(ROOT)): c.p.fingerprint(p)
        for p in [
            *sorted(HERE.glob("*.py")),
            HERE / "schema.json",
            HERE / "politica.json",
            HERE / "urls-exactas.json",
            ROOT / "docs/procedencia/preservacion-v4-sol/edicion.py",
            ROOT / "docs/procedencia/preservacion-v3/recolector.py",
            ROOT / "tools/procedencia/preservacion.py",
            ROOT / "tools/procedencia/uv.lock",
            ROOT / "tools/procedencia/flake.lock",
        ]
    }
    resolved = (
        set(objects)
        | {d["sha256"] for d in dependencies.values()}
        | {d["sourceSha256"] for d in dependencies.values()}
    )
    m: dict[str, Any] = {
        "format": "irobopf-preservacion-local-v5",
        "edition": 5,
        "base": BASE,
        "acceptance": "ninguna",
        "cut": "R26; excluye entrega v5 y posteriores; R25 no recibido; aceptación ninguna",
        "software": software,
        "objects": sorted(objects.values(), key=lambda x: x["sha256"]),
        "dependencies": list(dependencies.values()),
        "unresolvedReferences": [
            {"sha256": sha, "sources": sorted(paths)}
            for sha, paths in sorted(refs.items())
            if sha not in resolved
        ],
        "exclusions": exclusions,
    }
    write(CACHE / "manifest-final.json", m)
    pin = c.p.fingerprint(CACHE / "manifest-final.json")
    write(
        HERE / "PIN-final.json",
        {
            "manifest": pin,
            "base": BASE,
            "software": software,
            "policy": c.p.fingerprint(HERE / "politica.json"),
        },
    )
    with gzip.open(HERE / "manifest-final.json.gz", "wb") as f:
        with (CACHE / "manifest-final.json").open("rb") as src:
            import shutil

            shutil.copyfileobj(src, f, 1024 * 1024)
    c.p.publish(stage / "manifest.json", (CACHE / "manifest-final.json").read_bytes())
    write(
        HERE / "censo-resumen.json",
        {
            "counts": dict(counts),
            "observationsByClass": dict(classes),
            "identities": len(refs),
            "unresolvedIdentities": len(m["unresolvedReferences"]),
            "objects": len(objects),
            "dependencies": len(dependencies),
            "exhaustiveDocumentaryClaim": False,
            "grammar": "campos sha256/hash escalares y arrays tipados; nombres de clave hash, referencias por IDs/URL sin hash y prosa: pendientes explícitos",
        },
    )
    print(json.dumps({"pin": pin, "stage": str(stage)}))


if __name__ == "__main__":
    collect()
