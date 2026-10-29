"""Transporta solo la carpeta asignada; excluye scratch y autorreferencias."""
import difflib
import gzip
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/registro-exacto-r25-sol'
BASE = '1f8067b8dd01d0d1377e639776c356c98cae4a05'


def main():
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip() == BASE
    rows = json.loads((OUT / 'decisiones-264.json').read_bytes())
    for row in rows:
        row['dictamen'] = 'proyección exacta y ámbito contrastados; promoción conjunta bloqueada por RX25-01; sin aceptación fiscal completa'
    (OUT / 'decisiones-264.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
    files = []
    binaries = []
    patch: list[str] = []
    for path in sorted(OUT.rglob('*')):
        if not path.is_file() or path.name in ('manifiesto.json', 'entrega.patch.gz', 'binarios.json') or 'binarios' in path.parts:
            continue
        relative = str(path.relative_to(ROOT))
        raw = path.read_bytes()
        h = hashlib.sha256(raw).hexdigest()
        files.append({'path': relative, 'sha256': h, 'size': len(raw), 'baseSha256': None})
        try:
            text = raw.decode('utf-8')
        except UnicodeDecodeError:
            dest = OUT / 'binarios' / h
            dest.parent.mkdir(exist_ok=True)
            dest.write_bytes(raw)
            binaries.append({'path': relative, 'sha256': h, 'size': len(raw), 'transport': str(dest.relative_to(ROOT))})
        else:
            patch.extend(difflib.unified_diff([], text.splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + relative))
    with gzip.open(OUT / 'entrega.patch.gz', 'wt') as stream:
        stream.write(''.join(patch))
    (OUT / 'binarios.json').write_text(json.dumps(binaries, indent=2) + '\n')
    (OUT / 'manifiesto.json').write_text(json.dumps({'base': BASE, 'head': BASE, 'entries': 15175, 'deletions': [], 'files': files, 'excluded': ['manifiesto.json', 'entrega.patch.gz', 'binarios.json', 'binarios/', '.cache/'], 'physicalFinal': 'final.json.gz'}, indent=2) + '\n')
    print('Entrega sin commit:', len(files), 'rutas; binarios', len(binaries))


if __name__ == '__main__':
    main()
