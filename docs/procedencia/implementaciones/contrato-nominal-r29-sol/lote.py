import gzip
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path.cwd() / "tools/procedencia"))
import enlaces

R = Path.cwd()
manifest = (R / "docs/procedencia/inventario.json").read_bytes()
archive = (R / "docs/procedencia/inventario-datos.json.gz").read_bytes()
assert (
    hashlib.sha256(manifest).hexdigest()
    == "30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7"
)
assert (
    hashlib.sha256(archive).hexdigest()
    == "59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7"
)
items = {
    i["id"]: i
    for name, raw in json.loads(gzip.decompress(archive))
    if name.startswith("inventario-pagina-")
    for i in json.loads(raw)
}
rows = json.loads(
    (
        R / "docs/procedencia/implementaciones/ambitos-juridicos/correspondencias.json"
    ).read_bytes()
)["rows"]
reader = enlaces.DocumentaryReadSet(R)
results = []
for row in rows:
    p = reader.read_ref(row["candidate"])
    i = items[p["itemId"]]
    a = enlaces.verify_executable_scope(reader, p, i)
    assert p["schemaVersion"] == 2 and a["schemaVersion"] == 1
    assert (
        p["source"]["file"] == i["source"]["file"]
        and p["source"]["sha256"] == i["source"]["sha256"]
        and p["source"]["symbol"] == i["symbol"]
        and p["source"]["tablePath"] == json.loads(i["path"])
    )
    results.append(
        {
            "payload": row["candidate"],
            "itemId": i["id"],
            "scopeVersion": a["schemaVersion"],
            "period": a["period"],
            "predicate": a["predicate"],
        }
    )
reader.finish()
assert len(results) == 264
(
    R / "docs/procedencia/implementaciones/contrato-nominal-r29-sol/lote-264.json"
).write_text(
    json.dumps(
        {
            "inventorySha256": hashlib.sha256(manifest).hexdigest(),
            "results": results,
            "limit": "Contrato y valor/identidad contra inventario actual; no publicación, revisión nueva ni selección fiscal.",
        },
        ensure_ascii=False,
        indent=2,
    )
    + "\n"
)
print(
    "264 pares exactos: contrato v1 y valor/identidad del inventario actual; sin aceptación fiscal"
)
