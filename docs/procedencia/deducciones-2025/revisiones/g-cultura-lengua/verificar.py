"""Cotejo documental ordinario sin CAS, red ni historial Git; no evalúa impuestos."""
import hashlib
import json
from pathlib import Path

here = Path(__file__).resolve().parent
root = next(p for p in here.parents if (p / "lib/dominio").is_dir())
candidate = root / "docs/procedencia/deducciones-2025/correcciones/g-cultura-lengua"
review = json.loads((here / "decisiones.json").read_text())
for name, digest in review["archivosRevisados"].items():
    assert hashlib.sha256((candidate / name).read_bytes()).hexdigest() == digest, name
props = json.loads((candidate / "propuestas-por-codigo.json").read_text())["propuestas"]
matrix = json.loads((root / "docs/procedencia/deducciones-2025/correcciones/g/matriz-completada.json").read_text())["articulos"]
for proposal in props:
    pre = proposal["preimagen"]
    content = (root / pre["ruta"]).read_bytes()
    assert hashlib.sha256(content).hexdigest() == pre["archivoSha256"]
    assert pre["bloque"].encode() in content
    assert next(row for row in matrix if row["codigo"] == proposal["codigo"]) == pre["filaMatriz"]
assert {d["codigo"] for d in review["decisiones"]} == {p["codigo"] for p in props}
print("OK: siete candidatos exactos; seis preimágenes y filas actuales; seis decisiones. Sin validación financiera.")
