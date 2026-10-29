"""Extrae solo herramientas fijadas desde restauración a raíz nueva para ejecutar allí."""

import json
import consumidor as c


def main():
    pin = json.loads((c.HERE / "PIN-final.json").read_bytes())["manifest"]["sha256"]
    m = c.load(pin, c.CACHE / "manifest-final.json")
    source = c.CACHE / "restauracion-v5"
    root = c.CACHE / "software-restaurado"
    root.mkdir(exist_ok=False)
    wanted = set(m["software"])
    wanted.update(
        d["path"]
        for d in m["dependencies"]
        if d["path"].startswith("tools/procedencia/")
    )
    wanted.add("docs/procedencia/preservacion-v5-sol/recuperar.py")
    for row in m["dependencies"]:
        if row["path"] not in wanted:
            continue
        target = root / row["path"]
        target.parent.mkdir(parents=True, exist_ok=True)
        c.put(source / "dependencies" / row["sha256"], target)
        c.p.check(target, row)
    for name, row in m["software"].items():
        c.p.check(root / name, row)
    print(root / "docs/procedencia/preservacion-v5-sol/recuperar.py")


if __name__ == "__main__":
    main()
