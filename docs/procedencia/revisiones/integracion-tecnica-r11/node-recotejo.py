"""Inyecta una sustitución persistente justo tras el auxiliar real en copia propia."""
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parent / 'scratch'
source = root / 'scripts/procedencia/verificar-enlaces.mjs'
target = source.with_name('revision-recotejo.mjs')
text = source.read_text().replace('readFileSync, lstatSync', 'readFileSync, lstatSync, writeFileSync')
text = text.replace('const result = JSON.parse(run.stdout)', '''const result = JSON.parse(run.stdout)
  writeFileSync(result.casDependencies[0].path, "alteracion sintetica persistente")''')
target.write_text(text)
cas = root / 'docs/procedencia/corpus/fixtures'
originals = {p: p.read_bytes() for p in (cas / 'sha256').iterdir() if p.is_file()}
try:
    result = subprocess.run(['bun', str(target), '--cas-root', str(cas)], cwd=root, text=True, capture_output=True, check=False)
    print(result.stdout)
    print(result.stderr)
    print('EXIT', result.returncode)
    assert result.returncode != 0
    assert 'Objeto CAS cambió durante la verificación' in result.stderr
finally:
    for path, data in originals.items():
        if path.read_bytes() != data:
            path.write_bytes(data)
