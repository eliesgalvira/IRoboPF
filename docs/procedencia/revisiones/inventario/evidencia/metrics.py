import pathlib,json,hashlib,gzip
r=pathlib.Path('/home/elies/.t3/worktrees/IRoboPF/t3-bddec546');p=r/'docs/procedencia';m=json.loads((p/'inventario.json').read_text())
paths={str(f.relative_to(r)) for f in (r/'lib').rglob('*') if f.suffix in ('.ts','.tsx') and '/procedencia/' not in str(f)}
assert paths=={s['file'] for s in m['syntaxCoverage']}
assert all(hashlib.sha256((r/s['file']).read_bytes()).hexdigest()==s['sha256'] for s in m['syntaxCoverage'])
ix=[i for f in json.loads((p/'inventario-indice.json').read_text()) for i in json.loads((p/f['file']).read_text())]
minimal=[{'id':i['id'],'page':i['page']} for i in ix]
items=[i for pg in m['pages'] for i in json.loads((p/pg['file']).read_text())]
print(json.dumps({'filesVerified':len(paths),'indexOriginalBytes':sum((p/f['file']).stat().st_size for f in json.loads((p/'inventario-indice.json').read_text())),'minimalIndexCompactBytes':len(json.dumps(minimal,separators=(',',':')).encode()),'itemsCompactBytes':len(json.dumps(items,ensure_ascii=False,separators=(',',':')).encode()),'itemsCompactGzipBytes':len(gzip.compress(json.dumps(items,ensure_ascii=False,separators=(',',':')).encode(),mtime=0)),'scenarioLeavesChecked':sum(x['checked'] for x in json.loads((pathlib.Path(__file__).parent/'runtime.json').read_text()))},indent=2))
