"""Transporte de archivos nuevos, sin VCS mutante ni checkout adicional."""
import difflib
import gzip
import hashlib
import json
from pathlib import Path
import subprocess
from typing import TypedDict


class FileRecord(TypedDict):
    path: str
    sha256: str
    size: int
    baseSha256: None
    change: str


class BinaryRecord(FileRecord):
    transport: str

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/multiplicidad-r27-sol'
SCRATCH = ROOT / '.cache/multiplicidad-r27-sol/transporte-final'
BASE = '1ed8acfdf77dfee5330da0f0131f42956b45206a'


def main() -> None:
    SCRATCH.mkdir(parents=True, exist_ok=True)
    excluded = {'manifiesto.json', 'entrega.patch.gz', 'binarios.json', 'transporte.json'}
    files = [p for p in sorted(OUT.rglob('*')) if p.is_file()
             and p.name not in excluded and 'binarios' not in p.parts]
    manifest: list[FileRecord] = []
    binary: list[BinaryRecord] = []
    patch: list[str] = []
    for path in files:
        raw = path.read_bytes()
        name = str(path.relative_to(ROOT))
        digest = hashlib.sha256(raw).hexdigest()
        before = subprocess.run(['git', 'cat-file', '-e', BASE + ':' + name],
                                capture_output=True, check=False)
        assert before.returncode != 0, name
        row: FileRecord = {'path': name, 'sha256': digest, 'size': len(raw), 'baseSha256': None,
               'change': 'archivo nuevo de revisión; producto intacto'}
        manifest.append(row)
        try:
            text = raw.decode('utf-8')
            assert raw and '\0' not in text
        except (UnicodeDecodeError, AssertionError):
            folder = OUT / 'binarios'
            folder.mkdir(exist_ok=True)
            (folder / digest).write_bytes(raw)
            binary.append({**row, 'transport': str((folder / digest).relative_to(ROOT))})
            continue
        parts = text.split('\n')
        lines = [part + '\n' for part in parts[:-1]] + ([parts[-1]] if parts[-1] else [])
        for line in difflib.unified_diff([], lines,
                                         fromfile='/dev/null', tofile=name):
            patch.append(line if line.endswith('\n') else line + '\n\\ No newline at end of file\n')
    patch_raw = ''.join(patch).encode()
    (OUT / 'entrega.patch.gz').write_bytes(gzip.compress(patch_raw, mtime=0))
    (OUT / 'binarios.json').write_text(json.dumps(binary, indent=2) + '\n')
    result = subprocess.run(['patch', '-p0', '--batch', '-d', str(SCRATCH)],
                            input=patch_raw, capture_output=True, check=False)
    assert result.returncode == 0, result.stderr.decode()
    for binary_row in binary:
        dest = SCRATCH / binary_row['path']
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes((ROOT / binary_row['transport']).read_bytes())
    for file_row in manifest:
        raw = (SCRATCH / file_row['path']).read_bytes()
        assert len(raw) == file_row['size'] and hashlib.sha256(raw).hexdigest() == file_row['sha256']
    (OUT / 'manifiesto.json').write_text(json.dumps({'base': BASE, 'files': manifest,
        'envelopeExcluded': sorted(excluded), 'binaryPayloadDirectory': 'binarios'}, indent=2) + '\n')
    (OUT / 'transporte.json').write_text(json.dumps({'verifiedFiles': len(manifest),
        'patchSha256': hashlib.sha256((OUT / 'entrega.patch.gz').read_bytes()).hexdigest(),
        'binaryFiles': len(binary), 'byteExact': True, 'vcsMutation': False}, indent=2) + '\n')
    print('Transporte exacto:', len(manifest), 'archivos')


if __name__ == '__main__':
    main()
