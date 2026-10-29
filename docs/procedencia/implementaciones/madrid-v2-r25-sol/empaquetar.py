"""Entrega por rutas físicas; el transporte excluye sus propios tres artefactos."""
import difflib
import gzip
import hashlib
import json
from pathlib import Path
import subprocess

BASE = '1f8067b8dd01d0d1377e639776c356c98cae4a05'
ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
EXCLUDE = {'manifiesto.json', 'entrega.patch.gz', 'binarios.json'}
head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT).decode().strip()
assert head == BASE
for name in ['inicial', 'final']:
    control = json.loads(gzip.decompress((OUT / f'{name}.json.gz').read_bytes()))
    assert control['head'] == BASE and control['entries'] == 15175
    assert not control['mismatches'] and not control['diff']
rows = []
binaries = []
patches = []
for file in sorted(OUT.rglob('*')):
    if not file.is_file() or file.name in EXCLUDE:
        continue
    assert not file.is_symlink()
    relative = file.relative_to(ROOT).as_posix()
    raw = file.read_bytes()
    base = subprocess.run(['git', 'show', BASE + ':' + relative], cwd=ROOT, capture_output=True)
    assert base.returncode != 0, 'Paquete asignado debe ser solo adiciones: ' + relative
    entry = {'path': relative, 'sha256': hashlib.sha256(raw).hexdigest(), 'sha512': hashlib.sha512(raw).hexdigest(),
             'size': len(raw), 'baseSha256': None}
    rows.append(entry)
    try:
        decoded = raw.decode('utf-8')
        if '\0' in decoded:
            raise UnicodeError('binario')
    except UnicodeError:
        binaries.append(entry)
    else:
        patches.append('diff --git a/' + relative + ' b/' + relative + '\nnew file mode 100644\n')
        patches.extend(difflib.unified_diff([], decoded.splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + relative))
(OUT / 'entrega.patch.gz').write_bytes(gzip.compress(''.join(patches).encode(), mtime=0))
(OUT / 'binarios.json').write_text(json.dumps({'files': binaries, 'transport': 'Bytes en las rutas indicadas, sin duplicarlos ni incluir originales PDF.'}, ensure_ascii=False, indent=2) + '\n')
(OUT / 'manifiesto.json').write_text(json.dumps({'base': BASE, 'head': head, 'files': rows,
    'deleted': [], 'baseEntriesPhysicallyCompared': 15175,
    'initialControl': 'inicial.json.gz', 'finalControl': 'final.json.gz',
    'excludedTransportArtifacts': sorted(EXCLUDE), 'operationalStatus': 'blocked',
    'payloadSha256': hashlib.sha256((OUT / 'payload-v2.json').read_bytes()).hexdigest(),
    'scopeSha256': hashlib.sha256((OUT / 'ambito.json').read_bytes()).hexdigest(),
    'completeRuleAcceptance': False}, ensure_ascii=False, indent=2) + '\n')
print('Manifiesto, patch textual gzip y binarios por ruta/hash generados. Sin cambios VCS.')
