import hashlib
import json
from pathlib import Path

import pymupdf

source = Path("docs/procedencia/auditorias/retenciones-2020-2026")
out = Path("docs/procedencia/revisiones/retenciones-2020-2026")
ids = set()
for name in ["tablas-anuales.json", "escalas-anuales.json"]:
    ids.update(row["citationId"] for row in json.loads((source / name).read_text()))
results = []
current = None
for citation in json.loads((source / "citas-candidatas.json").read_text()):
    if citation["id"] not in ids:
        continue
    key = citation["documentHash"], citation["page"]
    if current != key:
        content = Path(citation["localPath"]).read_bytes()
        assert hashlib.sha256(content).hexdigest() == citation["documentHash"]
        doc = pymupdf.open(stream=content, filetype="pdf")
        page = doc[citation["page"] - 1]
        textpage = page.get_textpage()
        current = key
    text = "\n".join(
        textpage.extractTextbox(pymupdf.Rect(box))
        for box in citation["extractionBoxes"]
    )
    results.append(
        {"id": citation["id"], "equal": text == citation["quote"], "quote": text}
    )
(out / "tablas-extraccion-exacta.json").write_text(
    json.dumps(results, ensure_ascii=False, indent=2)
)
print(len(results), "citas de tablas, iguales", sum(row["equal"] for row in results))
