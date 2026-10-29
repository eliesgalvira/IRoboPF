"""Validar cierre y transporte propios después de todos los controles."""
import gzip
import hashlib
import json
from pathlib import Path

import empaquetar

OUT = Path(__file__).resolve().parent
ROOT = Path.cwd()


def main() -> None:
    codes = dict(line.split() for line in (OUT / 'codigos.log').read_text().splitlines())
    for name in ('historia', 'rutas', 'identidades', 'derivacion', 'contenido',
                 'oxlint', 'eslint', 'tipos', 'ruff-final', 'mypy-final', 'modos'):
        assert codes[name] == '0', (name, codes.get(name))
    assert codes['anterior'] == codes['actuales'] == '1'
    controls = []
    for name in ('inicial', 'final', 'cierre'):
        with gzip.open(OUT / (name + '.json.gz'), 'rt') as stream:
            c = json.load(stream)
        assert c['entries'] == 14957 and not c['mismatches'] and not c['diff']
        for row in c['files']:
            if row['mode'] != '120000':
                assert bool(int(row['physicalMode'], 8) & 0o111) == (row['mode'] == '100755')
        controls.append({'control': name, 'entries': c['entries'], 'mismatches': [], 'diff': '', 'executableModesExact': True})
    assert len(json.loads((OUT / 'historicos-control.json').read_bytes())['resultados']) == 36
    result = {'base': '07c07e6376a72f229be735a904ecf36517a1b571',
              'physical': controls, 'codes': codes,
              'newProductFindingsDemonstrated': [], 'operationalApproval': False,
              'limits': 'anterior: dos rojos CR21; actuales: una hipótesis de rechazo opcional descartada como bypass; ningún esperado alterado'}
    (OUT / 'cierre-control.json').write_text(json.dumps(result, indent=2) + '\n')
    empaquetar.main()
    manifest = json.loads((OUT / 'manifiesto.json').read_bytes())
    for row in manifest['files']:
        raw = (ROOT / row['path']).read_bytes()
        assert len(raw) == row['size']
        assert hashlib.sha256(raw).hexdigest() == row['sha256']
        assert row['baseSha256'] is None
    gzip.decompress((OUT / 'entrega.patch.gz').read_bytes()).decode()
    print('Manifiesto, patch y binarios reabiertos; hashes y tamaños exactos; cero borrados')


if __name__ == '__main__':
    main()
