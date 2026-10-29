"""Transporte de adiciones de la revisión, sin mutar VCS."""
from __future__ import annotations
import difflib
import gzip
import hashlib
import json
from pathlib import Path
from typing import Any
import subprocess

BASE = '6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9'
OUT = Path(__file__).resolve().parent
ROOT = Path.cwd()


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def dump(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def main() -> None:
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip() == BASE
    for path in sorted(OUT.iterdir()):
        if path.is_file() and path.suffix != '.gz' and path.stat().st_size > 1000000:
            data = path.read_bytes()
            path.with_name(path.name + '.gz').write_bytes(gzip.compress(data, mtime=0))
            path.unlink()
    binary = []
    for path in sorted(OUT.iterdir()):
        if path.is_file() and path.suffix == '.gz' and path.name != 'entrega.patch.gz':
            data = path.read_bytes()
            binary.append({'path':str(path.relative_to(ROOT)), 'sha256':digest(data), 'size':len(data), 'baseSha256':None})
    dump(OUT/'binarios.json', binary)
    patch: list[str] = []
    for path in sorted(OUT.iterdir()):
        if not path.is_file() or path.suffix == '.gz' or path.name == 'manifiesto.json':
            continue
        rel = str(path.relative_to(ROOT))
        present = subprocess.run(['git','cat-file','-e',BASE+':'+rel], capture_output=True)
        assert present.returncode != 0, rel
        text = path.read_text()
        patch.extend(difflib.unified_diff([],text.splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+rel))
    (OUT/'entrega.patch.gz').write_bytes(gzip.compress(''.join(patch).encode(),mtime=0))
    files: list[dict[str, Any]] = []
    for path in sorted(OUT.iterdir()):
        if path.is_file() and path.name != 'manifiesto.json':
            data = path.read_bytes()
            files.append({'path':str(path.relative_to(ROOT)), 'sha256':digest(data), 'size':len(data), 'baseSha256':None})
    control = json.loads(gzip.decompress((OUT/'control-final.json.gz').read_bytes()))
    assert control['entries'] == 15456 and not control['differences'] and not control['missing']
    dump(OUT/'manifiesto.json', {'head':BASE,'physicalFinal':{'path':str((OUT/'control-final.json.gz').relative_to(ROOT)), 'sha256':digest((OUT/'control-final.json.gz').read_bytes()),'entries':15456,'differences':0},'files':files,'selfExcluded':True,'scope':'Solo adiciones en carpeta asignada; sin caché ni dependencias.'})
    for item in files:
        data = (ROOT/item['path']).read_bytes()
        assert digest(data) == item['sha256'] and len(data) == item['size']
    print(len(files),'archivos cotejados en transporte; manifiesto excluye su hash circular.')


if __name__ == '__main__':
    main()
