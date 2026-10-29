"""Extracción XML independiente: valores originales, direcciones y dimensiones."""
import json
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
with zipfile.ZipFile(sys.argv[1]) as archive:
    workbook = ET.fromstring(archive.read('xl/workbook.xml'))
    rels = ET.fromstring(archive.read('xl/_rels/workbook.xml.rels'))
    targets = {r.attrib['Id']: r.attrib['Target'] for r in rels}
    for sheet in workbook.find(NS + 'sheets'):
        target = targets[sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']]
        path = target.lstrip('/') if target.startswith('/') else 'xl/' + target
        print(json.dumps({'sheet': sheet.attrib['name'], 'path': path}), flush=True)
        with archive.open(path) as source:
            root = None
            for event, elem in ET.iterparse(source, events=('start', 'end')):
                if root is None:
                    root = elem
                if event != 'end':
                    continue
                if elem.tag == NS + 'dimension':
                    print(json.dumps({'dimension': elem.attrib['ref']}))
                if elem.tag != NS + 'row':
                    continue
                cells = []
                for cell in elem:
                    assert cell.tag == NS + 'c'
                    assert cell.find(NS + 'f') is None, 'Formula inesperada'
                    kind = cell.get('t', 'n')
                    assert kind in ('n', 'inlineStr'), kind
                    value = ''.join(cell.find(NS + 'is').itertext()) if kind == 'inlineStr' else float(cell.findtext(NS + 'v'))
                    cells.append([cell.attrib['r'], value])
                print(json.dumps({'row': int(elem.attrib['r']), 'cells': cells}, ensure_ascii=False))
                elem.clear()
                root.clear()
        print(json.dumps({'end': sheet.attrib['name']}), flush=True)
