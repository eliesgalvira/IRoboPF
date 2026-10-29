"""Lee solo controles y filas seleccionadas, sin cargar el libro."""
import hashlib
import json
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

book = Path(sys.argv[1])
ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
selected = {}
with zipfile.ZipFile(book) as z:
    for sheet, path, stop in [
        ("CONTROL_GENERAL", "xl/worksheets/sheet1.xml", 16),
        ("CONTROL_TRAMOS_IRPF", "xl/worksheets/sheet2.xml", 88),
        ("DAT_2012", "xl/worksheets/sheet4.xml", 20002),
    ]:
        rows = []
        with z.open(path) as f:
            for _, elem in ET.iterparse(f, events=("end",)):
                if elem.tag != ns + "row":
                    continue
                row = []
                for cell in elem.findall(ns + "c"):
                    if cell.get("t") == "inlineStr":
                        row.append("".join(cell.itertext()))
                    else:
                        row.append(float(cell.findtext(ns + "v")))
                n = int(elem.attrib["r"])
                if sheet != "DAT_2012" or n <= 102 or n == 20002:
                    rows.append(row)
                elem.clear()
                if n >= stop:
                    break
        selected[sheet] = rows
with book.open("rb") as f:
    digest = hashlib.file_digest(f, "sha256").hexdigest()
print(json.dumps({"sha256": digest, "hojas": selected}, ensure_ascii=False, indent=2))
