"""Cotejo secuencial del transporte final; no modifica la entrega."""
import hashlib
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent


def main() -> None:
    manifest = json.loads((OUT / "manifiesto.json").read_text())
    assert manifest["deleted"] == []
    expected = set()
    for entry in manifest["files"]:
        path = Path(entry["path"])
        assert path.resolve().parent == OUT
        data = path.read_bytes()
        assert hashlib.sha256(data).hexdigest() == entry["sha256"], str(path)
        assert len(data) == entry["size"], str(path)
        assert entry["baseSha256"] is None
        expected.add(path.name)
    assert expected == {
        path.name
        for path in OUT.iterdir()
        if path.is_file() and path.name != "manifiesto.json"
    }
    print(len(expected), "archivos del manifiesto cotejados; cero borrados")


if __name__ == "__main__":
    main()
