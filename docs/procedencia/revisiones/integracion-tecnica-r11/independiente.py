"""Cotejo independiente de literales y de preservación, solo lectura del producto."""
import gzip
import hashlib
import json
from pathlib import Path
import re
from decimal import Decimal

HERE = Path(__file__).resolve().parent
ROOT = HERE / 'scratch'
PARENT = Path('/home/elies/Repos/IRoboPF')
source = (ROOT / 'lib/dominio/irpf/cuotas/escalas-publicadas.ts').read_text()
tables: dict[str, list[tuple[str, ...]]] = {}
for match in re.finditer(r'export const ([A-Z][A-Z_0-9]+)(?:\s*:\s*EscalaPublicada)?\s*=\s*', source):
    name = match[1]
    end = source.find('\nexport const ', match.end())
    body = source[match.end():end if end >= 0 else len(source)]
    rows = []
    for parent in re.findall(r'\.\.\.([A-Z][A-Z_0-9]+)', body):
        rows.extend(tables[parent])
    rows.extend(re.findall(r'\["([0-9.]+)", "([0-9.]+)", "([0-9.]+)"\]', body))
    if name == 'MURCIA_2022':
        match_last = re.search(r'baseInferior: new Decimal\((\d+)\),\s*cuota: new Decimal\("([0-9.]+)"\),\s*tipo: new Decimal\("([0-9.]+)"\)', body)
        assert match_last is not None
        rows.append(match_last.groups())
    tables[name] = rows
assert len(tables) == 15
archive = dict(json.loads(gzip.decompress((ROOT / 'docs/procedencia/inventario-datos.json.gz').read_bytes())))
items = [item for name, text in archive.items() if name.startswith('inventario-pagina-')
         for item in json.loads(text) if item['layer'] == 'effective'
         and item['source']['file'] == 'lib/dominio/irpf/cuotas/escalas-publicadas.ts']
assert len(items) == 228
results = []
for name, rows in tables.items():
    for index, row in enumerate(rows):
        for field, literal in zip(('baseInferior', 'cuota', 'tipo'), row, strict=True):
            found = [item for item in items if item['symbol'] == name and json.loads(item['path']) == [str(index), field]]
            assert len(found) == 1
            item = found[0]
            assert Decimal(item['value']) == Decimal(literal)
            assert item['source']['sha256'] == hashlib.sha256(source.encode()).hexdigest()
            assert item['status'] == item['evidence'] == item['independentReview'] == 'pending'
            results.append({'symbol': name, 'row': index, 'field': field, 'literal': literal, 'value': item['value'], 'id': item['id']})
assert len(results) == 228
(HERE / 'celdas.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
manifest_bytes = (ROOT / 'docs/procedencia/preservacion/manifest-v2.json').read_bytes()
manifest = json.loads(manifest_bytes)
verified = []
for folder in ('paquete-v2', 'restauracion-v2'):
    root = PARENT / '.cache/orquestador-preservacion' / folder
    assert (root / 'manifest.json').read_bytes() == manifest_bytes
    for blob in manifest['blobs']:
        path = root / 'sha256' / blob['sha256']
        assert not any(p.is_symlink() for p in [path, *path.parents])
        a, b, size = hashlib.sha256(), hashlib.sha512(), 0
        with path.open('rb') as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b''):
                a.update(chunk)
                b.update(chunk)
                size += len(chunk)
        assert (a.hexdigest(), b.hexdigest(), size) == (blob['sha256'], blob['sha512'], blob['size'])
        verified.append({'copy': folder, 'sha256': a.hexdigest(), 'sha512': b.hexdigest(), 'size': size})
(HERE / 'hashes-objetos.json').write_text(json.dumps(verified, indent=2) + '\n')
print(json.dumps({'cells': len(results), 'tables': len(tables), 'copies': 2, 'objectsPerCopy': len(manifest['blobs']), 'bytesPerCopy': manifest['bytes'], 'manifestSha256': hashlib.sha256(manifest_bytes).hexdigest()}))
