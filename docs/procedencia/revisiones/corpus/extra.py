exec(open('/home/elies/Repos/IRoboPF/.cache/procedencia/revision-corpus/repro.py').read().split('manifest=json.loads')[0])
# Count actual auditor origins without printing any URLs or metadata.
from urllib.parse import urlsplit
hosts=set()
for f in Path('/home/elies/Repos/IRoboPF/.cache/procedencia/urls').glob('*.json'):
 try:hosts.add(urlsplit(json.loads(f.read_text())['canonicalUrl']).hostname)
 except Exception:pass
out['auditor_hosts_not_default']=sorted(hosts-d.DEFAULT_HOSTS)
F=S/'docs/procedencia/corpus';r=json.loads((F/'bocm-firmado.manifest.json').read_text());cit=json.loads((F/'bocm-celda.citation.json').read_text());rt=W/'atomic';(rt/'sha256').mkdir(parents=True,exist_ok=True)
(rt/'sha256'/r['sha256']).write_bytes((F/'fixtures/sha256'/r['sha256']).read_bytes())
real=Path.write_bytes
def interrupted(path,data):
 real(path,data[:10]);raise OSError('synthetic interrupted write')
with patch.object(Path,'write_bytes',interrupted):
 out['crop_interrupted_rejected']=rejected(lambda:c.cite(r,rt,cit['page'],cit['bbox']))
fp=rt/'sha256'/cit['facsimile']['sha256'];out['crop_corrupt_published']=fp.exists() and d.digest(fp)!=fp.name
out['crop_retry_fails']=rejected(lambda:c.cite(r,rt,cit['page'],cit['bbox']))
# Fixture schemas and content addressed assets, no metadata output.
out['fixtures']={f.name:hashlib.sha256(f.read_bytes()).hexdigest()==f.name for f in (F/'fixtures/sha256').iterdir()}
out['schemas']={f.name:not rejected(lambda:c.validate_schema(json.loads(f.read_text()),'document' if '.manifest.' in f.name else 'citation')) for f in F.glob('*.json')}
listing=json.loads((S/'.cache/procedencia-entrega.json').read_text()); parent=json.loads(Path('/home/elies/Repos/IRoboPF/docs/procedencia/entregas/corpus-manifiesto.json').read_text());out['listings_identical']=listing==parent
(W/'extra-results.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
