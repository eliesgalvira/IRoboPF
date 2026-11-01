"""Prepara copias de validación, no checkouts; no instala dependencias."""
from pathlib import Path
import shutil,json,os
r=Path.cwd();s=r/'.cache/anual-salarial-revision';stage=s/'stage';stage.mkdir(parents=True,exist_ok=True)
deps=Path(os.environ.get('REVISION_DEPS','/home/local/Repos/IRoboPF/node_modules'))
shutil.copytree(r/'lib',stage/'lib',dirs_exist_ok=True)
shutil.copytree(r/'tools/oxlint',stage/'tools/oxlint',dirs_exist_ok=True)
if not (stage/'node_modules').exists(): (stage/'node_modules').symlink_to(deps,target_is_directory=True)
text=(r/'docs/procedencia/revisiones/anual-salarial-completo/ejecutar.mjs').read_text()
(stage/'run.mjs').write_text(text.replace('../../../../lib/','./lib/'))
(s/'tmp').mkdir(exist_ok=True)
(s/'vitest.config.mjs').write_text('export default '+json.dumps({'cacheDir':str(s/'vite'),'resolve':{'alias':{'effect':str(deps/'effect/dist/index.js'),'decimal.js':str(deps/'decimal.js/decimal.mjs')}},'test':{'include':['tests/anual-salarial-completo.test.ts'],'maxWorkers':1}}))
c={'extends':str(r/'tsconfig.json'),'compilerOptions':{'incremental':False,'paths':{'*':[str(deps/'*')],'effect':[str(deps/'effect/dist/index.d.ts')]},'typeRoots':[str(deps/'@types')]},'include':[str(r/'tests/anual-salarial-completo.test.ts'),str(r/'docs/procedencia/implementaciones/anual-salarial-completo/ejecutar.ts')]}
(s/'tipos-originales-final.json').write_text(json.dumps(c))
c=json.loads((r/'.oxlintrc.json').read_text());c['ignorePatterns']=[];c['jsPlugins']=[str(stage/p) for p in c['jsPlugins']];(s/'oxlint-final.json').write_text(json.dumps(c))
