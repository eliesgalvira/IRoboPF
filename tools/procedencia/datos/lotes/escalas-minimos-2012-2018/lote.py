"""Execute independently registered tables with the reviewed numeric extractor.

No downloads, implicit CAS, Git access or financial calculations. The registry and
mapping are separate inputs. A table that fails extraction contributes no partial
comparison; its complete obligation count remains in the error queue.
"""
from __future__ import annotations

import argparse
from collections import Counter
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import flujo  # noqa: E402


def execute(tables, obligations, items, store, semantics, repo):
    flujo.validate_obligations(tables, obligations)
    if len({t['code'] for t in tables}) != len(tables):
        raise ValueError('Duplicate table code')
    extraction, comparisons, errors = [], [], []
    for table, obligation in zip(tables, obligations, strict=True):
        try:
            cells = flujo.pdf_table(store, table)
            results = flujo.compare([table], cells, items, obligations=[obligation],
                                    store=store, semantics=semantics, repo=repo)
        except ValueError as error:
            errors.append({'code': table['code'], 'year': table['year'],
                           'territory': table['territory'], 'page': table['page'],
                           'document': table['document'], 'obligations': len(table['cells']),
                           'status': 'table-error', 'error': str(error)})
            continue
        extraction.extend(cells)
        comparisons.extend(results)
    counts = Counter(c['status'] for c in comparisons)
    return {'extraction': extraction, 'comparison': comparisons, 'errors': errors,
            'counts': dict(counts), 'obligations': sum(len(t['cells']) for t in obligations),
            'tableErrors': len(errors), 'tables': len(tables)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--registry', type=Path, required=True)
    parser.add_argument('--mapping', type=Path, required=True)
    parser.add_argument('--census', type=Path, required=True)
    parser.add_argument('--semantics', type=Path, required=True)
    parser.add_argument('--read-root', type=Path, action='append', required=True)
    parser.add_argument('--cas', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--verify', type=Path)
    args = parser.parse_args()
    if args.cas.resolve().is_relative_to(args.repo.resolve()):
        raise ValueError('External CAS required')
    args.cas.mkdir(parents=True, exist_ok=True)
    census = json.loads(args.census.read_bytes())
    items = [{**leaf, 'source': {'file': leaf['file']}, 'path': json.dumps(leaf['path'])}
             for leaf in census['leaves']]
    result = execute(json.loads(args.mapping.read_bytes()), json.loads(args.registry.read_bytes()),
                     items, flujo.Store(args.read_root), json.loads(args.semantics.read_bytes()), args.repo)
    artifacts = {key: flujo.put(args.cas, flujo.encode(value)) for key, value in result.items()
                 if key in ('extraction', 'comparison', 'errors')}
    manifest = {key: value for key, value in result.items() if key not in artifacts}
    manifest['artifacts'] = artifacts
    manifest['inputs'] = {key: {'sha256': flujo.digest(path.read_bytes()), 'size': path.stat().st_size}
                          for key, path in [('registry', args.registry), ('mapping', args.mapping),
                                            ('census', args.census), ('semantics', args.semantics)]}
    manifest['code'] = {str(p.relative_to(args.repo)): flujo.digest(p.read_bytes()) for p in
                        [Path(__file__).resolve(), Path(__file__).with_name('censo_cuotas.py').resolve(), args.repo / 'tools/procedencia/datos/flujo.py',
                         args.repo / 'tools/procedencia/corpus.py']}
    manifest['softwareInputs'] = flujo.software_inputs(args.repo)
    manifest['runtime'] = flujo.runtime_inputs()
    raw = flujo.encode(manifest)
    if args.verify and raw != args.verify.read_bytes():
        raise ValueError('Reconstruction differs')
    args.output.write_bytes(raw)
    print(json.dumps({k: v for k, v in manifest.items() if k in ('counts', 'obligations', 'tables', 'tableErrors')}))


if __name__ == '__main__':
    main()
