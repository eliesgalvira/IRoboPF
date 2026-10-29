import gzip
import hashlib
import json
from pathlib import Path

OUT = Path('docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol')

def main() -> None:
    manifest = json.loads((OUT / 'manifiesto.json').read_text())
    transport = json.loads((OUT / 'entrega.json').read_text())
    names = []
    for row in manifest['files'] + transport['transport']:
        path = Path(row['path'])
        assert path.parent == OUT and path.name not in names
        names.append(path.name)
        data = path.read_bytes()
        assert len(data) == row['size'] and hashlib.sha256(data).hexdigest() == row['sha256']
        assert row['baseSha256'] is None
    assert manifest['deletions'] == []
    assert set(p.name for p in OUT.iterdir() if p.is_file()) == set(names) | {'entrega.json'}
    for phase in ['inicial', 'final']:
        with gzip.open(OUT / f'control-{phase}.json.gz', 'rt') as stream:
            control = json.load(stream)
        assert control['head'] == manifest['head'] and control['count'] == 14537
        assert not control['failures'] and control['diff'] == ''
    print('Entrega coherente:', len(names), 'archivos indexados más índice exterior;14537entradas intactas en ambos controles')

if __name__ == '__main__':
    main()
