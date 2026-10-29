from pathlib import Path
import shutil,json
root=Path.cwd();out=root/'.cache/procedencia/revision-enlaces-v2/coordinator-fixture';out.mkdir(exist_ok=True)
manifest=json.loads((root/'docs/procedencia/inventario.json').read_text())
for item in manifest['generationInputs']:
 p=item['file'];dest=out/p;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(root/p,dest)
for p in ['schemas','scripts/procedencia','tools/procedencia','docs/procedencia/corpus','docs/procedencia/enlaces','docs/procedencia/revisiones/autonomicas-2017-2021']:
 shutil.copytree(root/p,out/p,dirs_exist_ok=True,ignore=shutil.ignore_patterns('.venv','__pycache__'))
for p in ['docs/procedencia/inventario.json','docs/procedencia/inventario-datos.json.gz','package.json','tsconfig.json']:
 shutil.copyfile(root/p,out/p)
(out/'node_modules').symlink_to(root/'node_modules',target_is_directory=True)
launcher=out/'tools/procedencia/run.sh'
launcher.write_text('#!/usr/bin/env bash\nset -euo pipefail\nbash '+str(root/'tools/procedencia/run.sh')+' "$@"\nprintf " " >> docs/procedencia/enlaces/madrid-2020-limite.json\n')
print(out)
