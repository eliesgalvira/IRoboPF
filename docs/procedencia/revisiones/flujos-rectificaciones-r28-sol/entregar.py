"""Empaquetar solo las adiciones propias y ensayar patch y binarios en scratch."""
import difflib
import gzip
import hashlib
import json
import shutil
import subprocess
from pathlib import Path
from typing import TypedDict

ROOT = Path.cwd()
HERE = ROOT / 'docs/procedencia/revisiones/flujos-rectificaciones-r28-sol'
SCRATCH = ROOT / '.cache/flujos-review/ensayo-transporte-r2'
GENERATED = {'MANIFIESTO.json', 'ENTREGA.json', 'cambios.patch.gz', 'BINARIOS.json'}


class Entry(TypedDict):
    path: str
    sha256: str
    size: int
    baseSha256: None
    executable: bool


def main():
    assert not SCRATCH.exists(), 'No sobrescribir ensayos anteriores'
    SCRATCH.mkdir(parents=True)
    rows: list[Entry] = []
    binary: list[Entry] = []
    patches: list[str] = []
    for path in sorted(HERE.iterdir()):
        if path.name in GENERATED or not path.is_file():
            continue
        relative = str(path.relative_to(ROOT))
        raw = path.read_bytes()
        row: Entry = {'path': relative, 'sha256': hashlib.sha256(raw).hexdigest(), 'size': len(raw), 'baseSha256': None, 'executable': bool(path.stat().st_mode & 0o111)}
        rows.append(row)
        if not raw:
            binary.append(row)
            target = SCRATCH / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path, target)
            continue
        try:
            text = raw.decode('utf8')
        except UnicodeDecodeError:
            binary.append(row)
            target = SCRATCH / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path, target)
        else:
            patches.extend(difflib.unified_diff([], text.splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + relative))
    patch = ''.join(patches).encode()
    (HERE / 'cambios.patch.gz').write_bytes(gzip.compress(patch, mtime=0))
    applied = subprocess.run(['patch', '-p1', '--batch', '--forward', '-d', str(SCRATCH)], input=patch, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    assert applied.returncode == 0, applied.stdout.decode()
    for row in rows:
        raw = (SCRATCH / row['path']).read_bytes()
        assert len(raw) == row['size'] and hashlib.sha256(raw).hexdigest() == row['sha256']
    (HERE / 'BINARIOS.json').write_text(json.dumps(binary, indent=2) + '\n')
    (HERE / 'MANIFIESTO.json').write_text(json.dumps({'base': '5e69c68077ffd18be20457160595adb3f0ff52e4', 'baseEntries': 15914, 'files': rows, 'deleted': [], 'metadataExcludedFromPayload': sorted(GENERATED)}, indent=2) + '\n')
    controls = []
    for name in sorted(GENERATED - {'ENTREGA.json'}):
        raw = (HERE / name).read_bytes()
        controls.append({'path': str((HERE / name).relative_to(ROOT)), 'sha256': hashlib.sha256(raw).hexdigest(), 'size': len(raw), 'baseSha256': None})
    result = {'payloadFiles': len(rows), 'binaryFiles': len(binary), 'patchReturnCode': applied.returncode, 'transportVerifiedByBytes': True, 'controls': controls, 'selfExcluded': 'ENTREGA.json no puede contener su propio hash; el padre debe fijarlo al recibir', 'fiscalAcceptance': False}
    (HERE / 'ENTREGA.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result))


if __name__ == '__main__':
    main()
