"""Genera fixtures públicos y citas desde adquisiciones existentes, sin red."""
import json
from pathlib import Path
import shutil
from corpus import cite, signatures, verify, atomic_json, mupdf, public_document


def main():
    root = Path('.cache/procedencia')
    target = Path('docs/procedencia/corpus')
    fixture = target / 'fixtures'
    (fixture / 'sha256').mkdir(parents=True, exist_ok=True)
    choices = {'67c8af922fe823337e0130d589cf5d51b364720936fd0319009a4783a728b544': 'irpf-consolidado',
               'd246a21b9753380c1a2a7cdc0865afdd33da4460a597d69ab9b93be8f47df561': 'bocm-firmado',
               '2d0dd390471ad35e96377f925eed42ec8babc55943aa775a7da24c02fe9576eb': 'boe-firmado'}
    for index in (root / 'urls').glob('*.json'):
        record = json.loads(index.read_text())
        if record['sha256'] not in choices:
            continue
        name = choices[record['sha256']]
        record = public_document(record)
        record['authenticity'] = signatures(record, root)
        record['authenticity']['report'] = record['authenticity'].get('report', '').replace(str(root / 'sha256' / record['sha256']), record['sha256'])
        if name == 'boe-firmado':
            record['csv'] = {'status': 'not-validated', 'identifier': 'BOE-A-2025-1',
                             'verificationUrl': 'https://www.boe.es',
                             'evidence': {'page': 1, 'literal': 'cve: BOE-A-2025-1'},
                             'reason': 'Enlace impreso, sin consulta específica CSV'}
        atomic_json(target / (name + '.manifest.json'), record)
        # Un bloque real de portada; no afirma la validez de ninguna cifra fiscal.
        with mupdf().open(root / 'sha256' / record['sha256']) as doc:
            blocks = doc[0].get_text('blocks')
            block = next(b for b in blocks if b[4].strip())
            box = [block[0] - 1, block[1] - 1, block[2] + 1, block[3] + 1]
        citation = cite(record, root, 1, box)
        atomic_json(target / (name + '.citation.json'), citation)
        verify(record, citation, root)
        if name != 'boe-firmado':
            for sha in (record['sha256'], citation['facsimile']['sha256']):
                shutil.copyfile(root / 'sha256' / sha, fixture / 'sha256' / sha)
        if name == 'bocm-firmado':
            with mupdf().open(root / 'sha256' / record['sha256']) as doc:
                rect = doc[2].search_for('8,50 %')[0]
                cell_box = [rect.x0 - 1, rect.y0 - 1, rect.x1 + 1, rect.y1 + 1]
            cell = cite(record, root, 3, cell_box)
            literal = cell['quote']
            start = literal.index('8,50')
            unit = literal.index('%')
            binding = {'number': {'start': start, 'end': start + 4, 'literal': '8,50'},
                       'numberFormat': 'es-ES', 'value': '8.50',
                       'unit': {'start': unit, 'end': unit + 1, 'literal': '%'}, 'unitCode': 'percent'}
            cell = cite(record, root, 3, cell_box, binding,
                        {'row': 'Primera fila: base liquidable 0', 'column': 'Tipo aplicable'})
            atomic_json(target / 'bocm-celda.citation.json', cell)
            verify(record, cell, root)
            sha = cell['facsimile']['sha256']
            shutil.copyfile(root / 'sha256' / sha, fixture / 'sha256' / sha)
        print(name, record['authenticity']['status'])


if __name__ == '__main__':
    main()
