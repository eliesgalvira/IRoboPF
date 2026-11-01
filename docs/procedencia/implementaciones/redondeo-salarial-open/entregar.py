"""Transporte completo de archivos cambiados; no muta VCS ni elimina originales."""
import base64
import gzip
import hashlib
import json
import os
from pathlib import Path
import stat
import subprocess
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
BASE = 'b99c6842e615e5df2ad9820ef24ad4eed17e59b6'
CONTROLES = {str(HERE.relative_to(ROOT) / n) for n in ('entrega.json', 'manifiesto.json', 'restauracion.json')}


def datos(path):
    s = path.lstat()
    symlink = stat.S_ISLNK(s.st_mode)
    raw = os.readlink(path).encode() if symlink else path.read_bytes()
    mode = '120000' if symlink else ('100755' if s.st_mode & 0o111 else '100644')
    return raw, mode


def restaurar(destino):
    records = json.loads((HERE / 'entrega.json').read_text())['archivos']
    for r in records:
        p = destino / r['path']
        assert not p.exists() and not p.is_symlink(), p
        p.parent.mkdir(parents=True, exist_ok=True)
        raw = gzip.decompress(base64.b64decode(r['gzipBase64']))
        assert len(raw) == r['size'] and hashlib.sha256(raw).hexdigest() == r['sha256']
        if r['mode'] == '120000':
            p.symlink_to(raw.decode())
        else:
            p.write_bytes(raw)
            p.chmod(0o755 if r['mode'] == '100755' else 0o644)
        assert datos(p) == (raw, r['mode'])
    return len(records)


def crear():
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT).decode().strip() == BASE
    baseline = json.loads((ROOT / '.cache/redondeo/base.json').read_text())
    cambios = []
    for r in baseline:
        p = ROOT / r['path']
        assert p.exists() or p.is_symlink(), ('borrado', r['path'])
        raw, mode = datos(p)
        if hashlib.sha256(raw).hexdigest() != r['sha256'] or mode != r['mode']:
            cambios.append((r['path'], r))
    nuevas = subprocess.check_output(['git', 'ls-files', '--others', '--exclude-standard', '-z'], cwd=ROOT).decode().split('\0')
    cambios.extend((p, None) for p in nuevas if p and not p.startswith('.cache/') and p not in CONTROLES)
    records = []
    for path, base in sorted(cambios):
        assert path not in CONTROLES
        assert path in {
            'lib/dominio/irpf/trabajo-anual/conexion.ts',
            'lib/procedencia/rastro-generado.json',
            'tests/anual-salarial-completo.test.ts', 'tests/conexion-anual.test.ts',
            'tests/redondeo-salarial-open.test.ts', 'docs/procedencia/inventario.json',
            'docs/procedencia/inventario-datos.json.gz',
            'docs/procedencia/implementaciones/contenidos/datos/snapshots.json',
        } or path.startswith('docs/procedencia/implementaciones/redondeo-salarial-open/') or (base is None and path.startswith('docs/procedencia/implementaciones/contenidos/datos/objetos/')), path
        raw, mode = datos(ROOT / path)
        records.append(dict(path=path, sha256=hashlib.sha256(raw).hexdigest(), size=len(raw), mode=mode, base=base, gzipBase64=base64.b64encode(gzip.compress(raw, mtime=0)).decode()))
    entrega = dict(base=BASE, archivos=records)
    (HERE / 'entrega.json').write_text(json.dumps(entrega, separators=(',', ':')) + '\n')
    manifiesto = dict(base=BASE, archivos=[{k: v for k, v in r.items() if k != 'gzipBase64'} for r in records], fisicosBase=len(baseline), borrados=0, fueraDeAmbitoModificados=0, controlesExcluidos=sorted(CONTROLES))
    (HERE / 'manifiesto.json').write_text(json.dumps(manifiesto, indent=2) + '\n')
    scratch = ROOT / '.cache/redondeo/restauracion'
    scratch.mkdir(exist_ok=False)
    cantidad = restaurar(scratch)
    (HERE / 'restauracion.json').write_text(json.dumps(dict(archivos=cantidad, exactos=True, vacios=sum(r['size'] == 0 for r in records), transporteSha256=hashlib.sha256((HERE / 'entrega.json').read_bytes()).hexdigest()), indent=2) + '\n')
    print(cantidad)


if __name__ == '__main__':
    if sys.argv[1] == 'crear':
        crear()
    elif sys.argv[1] == 'restaurar':
        print(restaurar(Path(sys.argv[2]).resolve()))
    else:
        raise SystemExit('Usa crear o restaurar <destino nuevo>')
