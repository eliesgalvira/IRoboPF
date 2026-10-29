import json
import hashlib
import re
from pathlib import Path
from html.parser import HTMLParser


class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, d):
        self.parts.append(d)


wanted = [
    "BOE-A-2009-14964",
    "BOE-A-2016-360",
    "BOE-A-1998-8202",
    "BOE-A-2017-1291",
    "BOE-A-2010-12798",
    "BOE-A-2020-5901",
    "BOE-A-2020-6424",
    "BOE-A-2020-15177",
    "BOE-A-2022-4851",
    "BOE-A-2022-6905",
]
rows = []
for group in "abc":
    data = json.loads(
        Path(
            f"docs/procedencia/auditorias/cadena-autonomica-{group}/documentos.json"
        ).read_text()
    )
    data = list(data.values()) if isinstance(data, dict) else data
    for d in data:
        if d.get("mimeType", "") != "text/html" or not any(
            x in d["canonicalUrl"] for x in wanted
        ):
            continue
        raw = Path(
            "/home/elies/Repos/IRoboPF/.cache/procedencia/sha256", d["sha256"]
        ).read_bytes()
        assert hashlib.sha256(raw).hexdigest() == d["sha256"]
        parser = Text()
        parser.feed(raw.decode())
        t = re.sub(r"\s+", " ", " ".join(parser.parts))
        snippets = []
        for m in re.finditer(
            r"15 quáter|Artículo 2\. Escala|Artículo segundo\. Escala|Artículo único\. Escala|Artículo 11\.|Artículo 87\.|Artículo 41\.|1 de enero de 2016|1 de enero de 2017",
            t,
        ):
            snippets.append(t[max(0, m.start() - 100) : m.start() + 2500])
        if "doc.php" in d["canonicalUrl"] and any(
            x in d["canonicalUrl"] for x in wanted[-5:]
        ):
            snippets = [t[t.find("TEXTO ORIGINAL") : t.find("Análisis ANÁLISIS")]]
        rows.append(
            {"url": d["canonicalUrl"], "sha256": d["sha256"], "snippets": snippets}
        )
p = Path(
    "/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v2/persistencia.json"
)
p.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(rows, ensure_ascii=False, indent=2))
