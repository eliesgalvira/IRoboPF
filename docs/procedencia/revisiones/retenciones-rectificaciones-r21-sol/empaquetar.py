import difflib
import gzip
import hashlib
import json
from pathlib import Path
import subprocess

BASE = '960773f909d4ecff290edfa3d7a7b2699a8445d3'
OUT = Path('docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol')


def main() -> None:
    files = []
    binary = []
    patches: list[str] = []
    excluded = {'manifiesto.json', 'binarios.json', 'entrega.patch.gz', 'entrega.json'}
    for path in sorted(OUT.iterdir()):
        if not path.is_file() or path.name in excluded:
            continue
        data = path.read_bytes()
        previous = subprocess.run(['git', 'cat-file', 'blob', f'{BASE}:{path}'], capture_output=True, check=False)
        old = previous.stdout if previous.returncode == 0 else b''
        row = {'path': str(path), 'sha256': hashlib.sha256(data).hexdigest(), 'size': len(data), 'baseSha256': hashlib.sha256(old).hexdigest() if previous.returncode == 0 else None}
        files.append(row)
        try:
            new_text, old_text = data.decode(), old.decode()
        except UnicodeDecodeError:
            binary.append(row)
            continue
        for line in difflib.unified_diff(old_text.splitlines(keepends=True), new_text.splitlines(keepends=True), fromfile='a/' + str(path) if old else '/dev/null', tofile='b/' + str(path)):
            patches.append(line if line.endswith('\n') else line + '\n\\ No newline at end of file\n')
    (OUT / 'manifiesto.json').write_text(json.dumps({'head': BASE, 'base': BASE, 'deletions': [], 'files': files}, ensure_ascii=False, indent=2))
    (OUT / 'binarios.json').write_text(json.dumps(binary, ensure_ascii=False, indent=2))
    (OUT / 'entrega.patch.gz').write_bytes(gzip.compress(''.join(patches).encode(), mtime=0))
    transport = []
    for name in ['manifiesto.json', 'binarios.json', 'entrega.patch.gz']:
        data = (OUT / name).read_bytes()
        transport.append({'path': str(OUT / name), 'sha256': hashlib.sha256(data).hexdigest(), 'size': len(data), 'baseSha256': None})
    (OUT / 'entrega.json').write_text(json.dumps({'head': BASE, 'transport': transport, 'selfExcluded': True}, indent=2))
    print(len(files), 'archivos de contenido;', len(binary), 'binarios;', 'sin borrados')

if __name__ == '__main__':
    main()
