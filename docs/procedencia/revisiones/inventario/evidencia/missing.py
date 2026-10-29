from pathlib import Path
p=Path(__file__).parent/'mutations.py'
exec(compile(p.read_text().split("run('baseline')")[0],str(p),'exec'))
m=read('inventario.json');name=m['pages'][0]['file'];(folder/name).unlink();changed.append(name);run('referenced_page_removed')
