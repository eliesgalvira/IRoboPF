"""Extracción íntegra de tres hojas pequeñas, sin cargar las hojas DAT."""
import hashlib
import json
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

book = Path(sys.argv[1])
ns = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
rels_ns = '{http://schemas.openxmlformats.org/package/2006/relationships}'
rid = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'
selected = {}
with zipfile.ZipFile(book) as z:
    relationships = {r.attrib['Id']: r.attrib['Target'] for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
    for sheet in ET.fromstring(z.read('xl/workbook.xml')).iter(ns + 'sheet'):
        name = sheet.attrib['name']
        if name not in ('CONTROL_GENERAL', 'CONTROL_TRAMOS_IRPF', 'COMPARATIVA_INFLACION'):
            continue
        target = relationships[sheet.attrib[rid]]
        path = target.lstrip('/') if target.startswith('/') else 'xl/' + target
        rows = []
        with z.open(path) as f:
            for _, elem in ET.iterparse(f, events=('end',)):
                if elem.tag != ns + 'row':
                    continue
                row = []
                for cell in elem.findall(ns + 'c'):
                    assert cell.find(ns + 'f') is None
                    if cell.get('t') == 'inlineStr':
                        row.append(''.join(cell.itertext()))
                    else:
                        assert cell.get('t') != 's', 'Shared strings require explicit decoding'
                        row.append(float(cell.findtext(ns + 'v')))
                rows.append(row)
                elem.clear()
        selected[name] = rows
with book.open('rb') as f:
    sha256 = hashlib.file_digest(f, 'sha256').hexdigest()
with book.open('rb') as f:
    sha512 = hashlib.file_digest(f, 'sha512').hexdigest()
print(json.dumps({'sha256': sha256, 'sha512': sha512, 'size': book.stat().st_size, 'hojas': selected}, ensure_ascii=False, indent=2))
