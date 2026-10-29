"""Dos destinos nuevos, pin escrito antes de verificar, fsync y lectura acotada."""

import json
import consumidor as c


def main():
    pin = json.loads((c.HERE / "PIN-final.json").read_bytes())["manifest"]["sha256"]
    external = c.CACHE / "manifest-final.json"
    c.put(c.HERE / "PIN-final.json", c.CACHE / "PIN-final.json")
    for source, destination, name in [
        (c.CACHE / "recepcion-v5-final", c.CACHE / "paquete-v5", "exportacion"),
        (c.CACHE / "paquete-v5", c.CACHE / "restauracion-v5", "restauracion"),
    ]:
        result = c.transfer(source, destination, pin, external)
        (c.HERE / (name + ".json")).write_bytes(c.p.encoded(result))
        print(name, result)


if __name__ == "__main__":
    main()
