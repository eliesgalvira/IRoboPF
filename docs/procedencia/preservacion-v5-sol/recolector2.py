"""Revisión determinista del cierre v5: entrada anterior fija y herramientas explícitas."""

import gzip
import hashlib
import json
import subprocess
import consumidor as c

INPUT_PIN = "7883e53fd88d11b8fef626669ce63d0676ea217799551e72195a510710378a41"
TOOLS = (
    "selector_ine.py",
    "recuperar2.py",
    "materializar2.py",
    "recolector2.py",
    "cierre_software.py",
)


def main():
    assert (
        subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip() == c.BASE
    )
    previous = c.CACHE / "manifest-final.json"
    m = c.load(INPUT_PIN, previous)
    source = c.CACHE / "restauracion-v5"
    cache = c.CACHE / "r2"
    cache.mkdir(exist_ok=False)
    out = c.HERE / "r2"
    out.mkdir(exist_ok=False)
    stage = cache / "recepcion-v5-final"
    stage.mkdir()
    for folder in ("sha256", "dependencies"):
        (stage / folder).mkdir()
        rows = m["objects"] if folder == "sha256" else m["dependencies"]
        for row in {row["sha256"]: row for row in rows}.values():
            origin = c.p.safe_source(source, folder + "/" + row["sha256"])
            c.p.check(origin, row)
            c.put(origin, stage / folder / row["sha256"])
    deps = {row["path"]: row for row in m["dependencies"]}
    for name in TOOLS:
        path = c.HERE / name
        fp = c.p.fingerprint(path)
        relative = path.relative_to(c.ROOT).as_posix()
        if name == "selector_ine.py":
            assert fp == m["software"][relative]
        target = stage / "dependencies" / fp["sha256"]
        if not target.exists():
            c.put(path, target)
        deps[relative] = {
            "path": relative,
            **fp,
            "sourceSha256": fp["sha256"],
            "sourceSha512": fp["sha512"],
            "sourceSize": fp["size"],
            "sanitized": False,
            "historical": False,
        }
        m["software"][relative] = fp
    # Contrato de revisión explícito y determinista; el censo R26 anterior no cambia.
    recipe = {
        "inputManifestSha256": INPUT_PIN,
        "base": c.BASE,
        "revision": "v5-r2",
        "operation": "union por ruta de cuatro herramientas explícitas; originales y censo intactos",
        "tools": list(TOOLS),
        "selfInputs": "ningún resultado de esta revisión",
        "gzip": "mtime=0; filename vacío",
    }
    raw = c.p.encoded(recipe)
    fp = {
        "sha256": hashlib.sha256(raw).hexdigest(),
        "sha512": hashlib.sha512(raw).hexdigest(),
        "size": len(raw),
    }
    c.p.publish(stage / "dependencies" / fp["sha256"], raw)
    deps["contrato-v5-r2.json"] = {
        "path": "contrato-v5-r2.json",
        **fp,
        "sourceSha256": fp["sha256"],
        "sourceSha512": fp["sha512"],
        "sourceSize": fp["size"],
        "sanitized": False,
        "historical": False,
    }
    m["dependencies"] = [deps[name] for name in sorted(deps)]
    external = cache / "manifest-final.json"
    c.p.publish(external, c.p.encoded(m))
    pin = c.p.fingerprint(external)
    c.p.publish(
        out / "PIN-final.json",
        c.p.encoded(
            {
                "manifest": pin,
                "inputManifestSha256": INPUT_PIN,
                "recipe": recipe,
                "software": m["software"],
            }
        ),
    )
    c.put(out / "PIN-final.json", cache / "PIN-final.json")
    with (out / "manifest-final.json.gz").open("xb") as sink:
        with gzip.GzipFile(filename="", mode="wb", fileobj=sink, mtime=0) as dest:
            with external.open("rb") as inp:
                import shutil

                shutil.copyfileobj(inp, dest, 1024 * 1024)
    c.p.publish(stage / "manifest.json", external.read_bytes())
    for origin, target, name in [
        (stage, cache / "paquete-v5", "exportacion"),
        (cache / "paquete-v5", cache / "restauracion-v5", "restauracion"),
    ]:
        receipt = c.transfer(origin, target, pin["sha256"], external)
        (out / (name + ".json")).write_bytes(c.p.encoded(receipt))
        print(name, receipt, flush=True)
    print(json.dumps(pin), flush=True)


if __name__ == "__main__":
    main()
