"""Congela referencia al informe y produce transporte sin tocar registros reales."""
import gzip
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from urllib.parse import unquote

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/bindings-autonomicos-r19-sol'
BASE = '7668bdad60a79a8b3ad8e1e1b911f3d6c223692a'
THREAD = 'thread:delegated-task:command%3Amcp%3A99a9fe10-4fb8-419d-8198-e5c0210805ae%3Adelegate-task%3Airobopf-r19-sol-revision-bindings-autonomicos'
TASK = unquote(THREAD.removeprefix('thread:delegated-task:'))
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
import corpus  # noqa: E402


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


report = OUT / 'INFORME.md'
report_hash = sha(report.read_bytes())
decisions = json.loads((OUT / 'decisiones.json').read_bytes())
assert len(decisions) == 186 and len({d['payload']['sha256'] for d in decisions}) == 186
attestations = OUT / 'atestaciones-candidatas'
attestations.mkdir(exist_ok=True)
approvals = []
for d in decisions:
    if d['status'] != 'accepted-limited':
        continue
    a = {'schemaVersion': 1, 'payloadSha256': d['payload']['sha256'], 'inventory': d['inventory'],
         'scope': d['scope'], 'decision': 'accepted-limited', 'reviewTaskId': TASK,
         'report': {'path': str(report.relative_to(ROOT)), 'sha256': report_hash}}
    corpus.validate_schema(a, 'binding-attestation')
    path = attestations / (d['payload']['sha256'] + '.json')
    write(path, a)
    approvals.append({'payloadSha256': d['payload']['sha256'],
                      'attestation': {'path': str(path.relative_to(ROOT)), 'sha256': sha(path.read_bytes())}})
write(OUT / 'aprobaciones-propuestas.json', {'candidate': True, 'taskId': TASK, 'derivedFromThreadId': THREAD,
                                           'report': {'path': str(report.relative_to(ROOT)), 'sha256': report_hash},
                                           'approvals': approvals, 'trusted': False})
paths = sorted(p for p in OUT.rglob('*') if p.is_file() and p.name not in {'manifiesto.json', 'entrega.patch.gz', 'transporte.json'} and 'binarios' not in p.parts)
patch = []
manifest = []
binaries = []
for path in paths:
    raw = path.read_bytes()
    relative = str(path.relative_to(ROOT))
    previous = subprocess.run(['git', 'cat-file', '-e', BASE + ':' + relative], capture_output=True)
    assert previous.returncode != 0, 'Entrega debe ser solo altas'
    manifest.append({'path': relative, 'sha256': sha(raw), 'size': len(raw), 'baseSha256': None})
    try:
        text = raw.decode('utf-8')
    except UnicodeDecodeError:
        binaries.append({'path': relative, 'sha256': sha(raw), 'size': len(raw)})
        dest = OUT / 'binarios/sha256' / sha(raw)
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(raw)
        manifest.append({'path': str(dest.relative_to(ROOT)), 'sha256': sha(raw), 'size': len(raw), 'baseSha256': None})
        continue
    lines = text.splitlines(keepends=True)
    patch.extend([f'diff --git a/{relative} b/{relative}\n', 'new file mode 100644\n', '--- /dev/null\n', f'+++ b/{relative}\n', f'@@ -0,0 +1,{len(lines)} @@\n'])
    patch.extend('+' + line for line in lines)
(OUT / 'entrega.patch.gz').write_bytes(gzip.compress(''.join(patch).encode(), mtime=0))
write(OUT / 'manifiesto.json', {'base': BASE, 'deletions': [], 'files': manifest})
write(OUT / 'transporte.json', {'base': BASE, 'reportSha256': report_hash,
                               'patchSha256': sha((OUT / 'entrega.patch.gz').read_bytes()),
                               'manifestSha256': sha((OUT / 'manifiesto.json').read_bytes()), 'binaries': binaries})
assert sha(report.read_bytes()) == report_hash
print('Atestaciones candidatas:', len(approvals), '; archivos:', len(manifest), '; informe congelado:', report_hash)
