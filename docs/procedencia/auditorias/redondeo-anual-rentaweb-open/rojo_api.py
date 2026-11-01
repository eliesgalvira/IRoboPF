"""Ejecuta el runner recibido intacto; exige el céntimo observado en Open."""

import json
import os
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
SCRATCH = ROOT / '.cache/redondeo-anual-rentaweb-open'
STAGE = SCRATCH / 'stage'
RUNNER = Path('docs/procedencia/implementaciones/anual-salarial-completo/ejecutar.ts')
DEPS = Path(os.environ.get('REVISION_DEPS', '/home/local/Repos/IRoboPF/node_modules'))


def main():
    STAGE.mkdir(parents=True, exist_ok=True)
    shutil.copytree(ROOT / 'lib', STAGE / 'lib', dirs_exist_ok=True)
    for source in (ROOT / 'lib').rglob('*'):
        if source.is_file():
            assert source.read_bytes() == (STAGE / source.relative_to(ROOT)).read_bytes()
    (STAGE / RUNNER).parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / RUNNER, STAGE / RUNNER)
    shutil.copyfile(ROOT / 'tsconfig.json', STAGE / 'tsconfig.json')
    assert (ROOT / RUNNER).read_bytes() == (STAGE / RUNNER).read_bytes()
    if not (STAGE / 'node_modules').exists():
        (STAGE / 'node_modules').symlink_to(DEPS, target_is_directory=True)
    cases = json.loads((HERE / 'casos.json').read_text())
    records = []
    for offset in range(0, len(cases), 2):
        pair = cases[offset:offset + 2]
        (STAGE / RUNNER.parent / 'casos.json').write_text(json.dumps([
            {'nombre': case['id'], 'entrada': case['entrada']} for case in pair
        ]))
        result = subprocess.run([
            'flock', '/tmp/irobopf-validacion-pesada.lock', 'bun', '--no-install',
            str(STAGE / RUNNER),
        ], cwd=ROOT, check=True, capture_output=True, text=True)
        records.extend(json.loads(result.stdout))
    (HERE / 'api-actual.json').write_text(json.dumps(records, indent=2) + '\n')
    actual = next(r['resultado']['cuotaDiferencialPresentada']
                  for r in records if r['nombre'] == 'componentes')
    print(f'componentes: API={actual}; Renta WEB Open 1.19 observado=2575.26', flush=True)
    assert actual == '2575.26', 'Rojo fiscal observado: ver componentes.pdf y componentes.ses'


if __name__ == '__main__':
    main()
