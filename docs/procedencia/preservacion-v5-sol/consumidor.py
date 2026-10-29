"""Edición local v4; pin externo obligatorio, transporte exclusivo sin red."""

import argparse
from datetime import datetime
import gzip
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import shutil
import sys
from urllib.parse import parse_qsl, urlsplit

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
CACHE = ROOT / ".cache/preservacion-v5-sol"
PARENT = Path("/home/elies/Repos/IRoboPF")
OLD = PARENT / ".cache/orquestador-preservacion/paquete-v3"
BASE = "6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9"
sys.path.insert(0, str(ROOT / "tools/procedencia"))
p = importlib.import_module("preservacion")
spec = importlib.util.spec_from_file_location(
    "v3", ROOT / "docs/procedencia/preservacion-v3/recolector.py"
)
assert spec and spec.loader
v3 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v3)
HASH = re.compile(r"(?<![0-9a-f])[0-9a-f]{64}(?![0-9a-f])")
PRIVATE = {
    "headers",
    "redirects",
    "cookie",
    "cookies",
    "authorization",
    "set-cookie",
    "token",
    "password",
    "secret",
    "localPath",
}
EXCLUDED = (
    "necesidades-expertas",
    "correcciones-x",
    "revision-corpus",
    "revision-inventario",
    "/fixtures/",
    "inventario-pruebas",
    "/contenido/",
    "/contenidos/",
    "/preservacion-v5-sol/",
    "/scratch/",
    "/validacion/",
    "/tmp/",
    "/checkout-validacion/",
    "/node_modules/",
    "/.venv/",
    "/synthetic/",
    "/mocks/",
)
EXACT_URLS = frozenset(p.strict_json((HERE / "urls-exactas.json").read_bytes()))
# Compatibilidad exclusiva del paquete ya conservado; no permite excepciones
# para sobres nuevos que solo declaren la misma edición o base.
HISTORICAL_PIN = "938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2"
PRIVATE_QUERY_KEYS = {
    "token",
    "access_token",
    "authorization",
    "auth",
    "password",
    "passwd",
    "secret",
    "api_key",
    "apikey",
    "session",
    "sessionid",
    "sid",
    "x-amz-signature",
    "x-goog-signature",
}


def url(value):
    return value if isinstance(value, str) and value in EXACT_URLS else v3.url(value)


def save(path, value):
    data = p.encoded(value)
    if len(data) > 1_000_000:
        with gzip.open(str(path) + ".gz", "wb") as f:
            f.write(data)
    else:
        path.write_bytes(data)


def clean(value, *, policy=2):
    if isinstance(value, dict):
        return {
            k: clean(v, policy=policy)
            for k, v in value.items()
            if k.lower() not in {x.lower() for x in PRIVATE}
        }
    if isinstance(value, list):
        return [clean(v, policy=policy) for v in value]
    if isinstance(value, str):
        if value.startswith("/home/"):
            return "[localizador-local-omitido]"
        if policy == 2:
            if value.startswith(
                ("/tmp/", "/var/tmp/", "/run/user/", "/Users/", "file://")
            ):
                return "[localizador-local-omitido]"
            if value.lower().startswith(("https://", "http://")):
                try:
                    parsed = urlsplit(value)
                    sensitive = (
                        parsed.username is not None or parsed.password is not None
                    )
                    sensitive = sensitive or any(
                        k.casefold() in PRIVATE_QUERY_KEYS
                        for k, _ in parse_qsl(parsed.query)
                    )
                except ValueError:
                    return "[URL-malformada-omitida]"
                if sensitive:
                    return "[URL-con-parametros-privados-omitida]"
    return value


def put(source, destination):
    p.no_symlink_ancestors(source)
    p.no_symlink_ancestors(destination)
    with source.open("rb") as inp, destination.open("xb") as out:
        shutil.copyfileobj(inp, out, 1024 * 1024)
        out.flush()
        os.fchmod(out.fileno(), 0o444)
        os.fsync(out.fileno())


def load(pin, external):
    if not p.HASH.fullmatch(pin):
        raise ValueError("Pin externo requerido")
    p.no_symlink_ancestors(external)
    raw = external.read_bytes()
    if hashlib.sha256(raw).hexdigest() != pin:
        raise ValueError("Manifiesto distinto del pin externo")
    m = p.strict_json(raw)
    schema = p.strict_json((HERE / "schema.json").read_bytes())
    error = next(p.Draft202012Validator(schema).iter_errors(m), None)
    if error is not None:
        raise ValueError(f"Índice fuera del schema ({error.validator})")
    deps = {d["sha256"] for d in m["dependencies"]}
    for group, key in ((m["objects"], "sha256"), (m["dependencies"], "path")):
        if len({o[key] for o in group}) != len(group):
            raise ValueError("Identidad repetida")
    paths = {d["path"] for d in m["dependencies"]}
    for d in m["dependencies"]:
        if any(parent.as_posix() in paths for parent in Path(d["path"]).parents):
            raise ValueError("Rutas auxiliares incompatibles")
        if not d["sanitized"] and any(
            d[a] != d[b]
            for a, b in (
                ("sha256", "sourceSha256"),
                ("sha512", "sourceSha512"),
                ("size", "sourceSize"),
            )
        ):
            raise ValueError("Identidad auxiliar no transformada incoherente")
    v3.require_unique(
        [item["sha256"] for item in m["unresolvedReferences"]],
        "referencias no resueltas",
    )
    for item in m["unresolvedReferences"]:
        v3.require_unique(item["sources"], "fuentes de referencias no resueltas")
    for obj in m["objects"]:
        v3.require_unique(obj["references"], "referencias")
        if pin != HISTORICAL_PIN:
            v3.require_unique(obj["acquisitions"], "adquisiciones")
        if (
            not obj["inherited"]
            and obj["kind"] != "facsimil"
            and not obj["acquisitions"]
        ):
            raise ValueError("Falta adquisición")
        for e in obj["acquisitions"]:
            if (
                e["dependency"] not in deps
                or not url(e["canonicalUrl"])
                or (e["finalUrl"] is not None and not url(e["finalUrl"]))
            ):
                raise ValueError("Adquisición no publicable")
            if any(e[k] != obj[k] for k in ("sha256", "sha512", "size")):
                raise ValueError("Adquisición distinta")
            if (
                any(
                    isinstance(e[k], str) and "web.archive.org" in e[k]
                    for k in ("canonicalUrl", "finalUrl")
                )
                and obj["kind"] != "captura-secundaria-URL-oficial"
            ):
                raise ValueError("Captura secundaria mal clasificada")
            if not re.fullmatch(
                r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)",
                e["retrievedAt"],
            ):
                raise ValueError("Fecha sin zona o imposible")
            datetime.fromisoformat(e["retrievedAt"].replace("Z", "+00:00"))
    for name, row in m["software"].items():
        p.check(ROOT / name, row)
    return m


def verify(destination, pin, external):
    m = load(pin, external)
    if (
        p.safe_source(destination, "manifest.json").read_bytes()
        != external.read_bytes()
    ):
        raise ValueError("Marcador sustituido")
    if {path.name for path in destination.iterdir()} != {
        "manifest.json",
        "sha256",
        "dependencies",
    }:
        raise ValueError("Conjunto de archivos distinto del manifiesto")
    for folder, rows in (("sha256", m["objects"]), ("dependencies", m["dependencies"])):
        directory = destination / folder
        p.no_symlink_ancestors(directory)
        if not directory.is_dir() or {path.name for path in directory.iterdir()} != {
            row["sha256"] for row in rows
        }:
            raise ValueError("Conjunto CAS distinto del manifiesto")
        for row in rows:
            path = p.safe_source(destination, folder + "/" + row["sha256"])
            p.check(path, row)
            if (
                folder == "dependencies"
                and not row["historical"]
                and row["path"].endswith((".json", ".json.gz"))
            ):
                data = (
                    gzip.decompress(path.read_bytes())
                    if row["path"].endswith(".gz")
                    else path.read_bytes()
                )
                value = p.strict_json(data)
                if clean(value, policy=1 if pin == HISTORICAL_PIN else 2) != value:
                    raise ValueError("Metadatos nuevos sin sanear")
    observations = sum(len(o["acquisitions"]) for o in m["objects"])
    distinct = sum(len({p.encoded(a) for a in o["acquisitions"]}) for o in m["objects"])
    return {
        "manifest": pin,
        "objects": len(m["objects"]),
        "dependencies": len(m["dependencies"]),
        "bytes": sum(o["size"] for o in m["objects"]),
        "acquisitionObservations": observations,
        "distinctAcquisitionRecords": distinct,
        "metadataPolicy": "v5-valores-r26",
        "privacyCertification": False,
    }


def confirm(destination, pin, external):
    receipt = verify(destination, pin, external)
    try:
        for folder in ("sha256", "dependencies"):
            for path in (destination / folder).iterdir():
                with path.open("rb") as stream:
                    os.fsync(stream.fileno())
            p.sync_directory(destination / folder)
        with (destination / "manifest.json").open("rb") as stream:
            os.fsync(stream.fileno())
        p.sync_directory(destination)
        p.sync_directory(destination.parent)
    except OSError as error:
        raise p.PublicationDurabilityUnknown(
            "Marcador visible; conservar bytes y repetir confirmación"
        ) from error
    return {**receipt, "durability": "fsync-confirmed"}


def transfer(source, destination, pin, external):
    m = load(pin, external)
    p.no_symlink_ancestors(source)
    p.no_symlink_ancestors(destination)
    if destination.exists():
        raise FileExistsError(destination)
    verify(source, pin, external)
    required = sum(o["size"] for o in m["objects"]) + sum(
        d["size"] for d in m["dependencies"]
    )
    if shutil.disk_usage(destination.parent).free < required + 100_000_000:
        raise OSError("Espacio insuficiente")
    p.durable_mkdir(destination)
    for folder, rows in (("sha256", m["objects"]), ("dependencies", m["dependencies"])):
        p.durable_mkdir(destination / folder)
        for row in rows:
            target = destination / folder / row["sha256"]
            if not target.exists():
                put(p.safe_source(source, folder + "/" + row["sha256"]), target)
            p.check(target, row)
        p.sync_directory(destination / folder)
    p.publish(destination / "manifest.json", external.read_bytes())
    return confirm(destination, pin, external)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["transfer", "verify", "confirm"])
    parser.add_argument("--source", type=Path)
    parser.add_argument("--destination", type=Path)
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--pin")
    args = parser.parse_args()
    if not args.manifest or not args.pin or not args.destination:
        parser.error("Requiere manifest externo, pin y destino")
    if args.action == "transfer":
        if not args.source:
            parser.error("Requiere source")
        result = transfer(args.source, args.destination, args.pin, args.manifest)
    else:
        result = (confirm if args.action == "confirm" else verify)(
            args.destination, args.pin, args.manifest
        )
    print(json.dumps(result))


if __name__ == "__main__":
    main()
