"""Augment the common census with published effective quota exports, without Git."""
import argparse
import hashlib
import json
from pathlib import Path


def augment(folder: Path) -> dict:
    census = json.loads((folder / 'censo-completo.json').read_bytes())
    summary = json.loads((folder / 'inventario.json').read_bytes())
    extra = []
    for page in summary['pages']:
        raw = (folder / page['file']).read_bytes()
        if hashlib.sha256(raw).hexdigest() != page['sha256']:
            raise ValueError('Inventory page hash differs')
        for item in json.loads(raw):
            if (item['layer'] == 'effective' and item['symbol'] and item.get('value') is not None
                    and item['source']['file'] == 'lib/dominio/irpf/cuotas/escalas-publicadas.ts'):
                extra.append({'file': item['source']['file'], 'sourceSha256': item['source']['sha256'],
                              'symbol': item['symbol'], 'path': json.loads(item['path']),
                              'type': 'Decimal', 'value': item['value'], 'classification': 'fiscal-candidate',
                              'layer': 'effective', 'years': item['years'], 'territories': item['territories'],
                              'unit': item['unit'], 'origin': 'common inventory; published quota exports',
                              'ambiguity': 'Numeric export; effective selection and legal applicability require review'})
    if not extra:
        raise ValueError('Published quota exports absent')
    census['leaves'].extend(extra)
    keys = [(v['file'], v['symbol'], tuple(v['path'])) for v in census['leaves']]
    if len(set(keys)) != len(keys):
        raise ValueError('Duplicate effective binding')
    return census


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inventory', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    args.output.write_text(json.dumps(augment(args.inventory), ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':'), allow_nan=False) + '\n')
