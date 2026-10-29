import importlib.util, json, sys
from pathlib import Path
root=Path('/home/elies/Repos/IRoboPF')
sys.path.insert(0,str(root/'docs/procedencia/preservacion-v5-sol'))
spec=importlib.util.spec_from_file_location('clasificacion_real',root/'docs/procedencia/preservacion-v5-sol/recolector.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
path='docs/procedencia/editorial/flujo-rentas-r21-sol/entradas-editoriales.json'
row=json.loads((root/path).read_bytes())['citations'][0]
selection=m.classify(path,'/citations/0',row,'selectionSha256')
document=m.classify(path,'/citations/0',row,'documentSha256')
assert selection[0]=='seleccion-cita' and document[0]=='original-oficial'
assert row['selectionSha256']=='5eadc5d542abbf881ba245b97c8d4104d05f0d8cfc944194dc3db9c29d183b4e'
print(json.dumps({'path':path,'pointer':'/citations/0','selection':{'sha256':row['selectionSha256'],'classification':selection},'document':{'sha256':row['documentSha256'],'classification':document},'newPolicy':m.POLICY,'frozenPackageChanged':False},ensure_ascii=False,indent=2))
