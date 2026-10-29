from pathlib import Path
import json,shutil
out=Path(__file__).parent;root=Path('/home/elies/.t3/worktrees/IRoboPF/t3-f9097ac4');target=out/'lint-input';target.mkdir(exist_ok=True)
config=json.loads((root/'.oxlintrc.json').read_text());config['jsPlugins']=[str(out/'checkout-validacion'/p) for p in config['jsPlugins']]
(target/'.oxlintrc.json').write_text(json.dumps(config,indent=2))
shutil.copy2(root/'eslint.config.mjs',target/'eslint.config.mjs')
for r in json.loads((root/'docs/procedencia/implementaciones/conexion-anual/manifiesto.json').read_text())['archivos'][:6]:
 p=target/r['path'];p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/r['path'],p)
for name in ['sondeos.mjs','precision.mjs','rojos.mjs']:shutil.copy2(out/name,target/name)
