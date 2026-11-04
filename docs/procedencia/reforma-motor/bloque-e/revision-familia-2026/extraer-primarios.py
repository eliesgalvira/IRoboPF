import json,re,html,hashlib
from pathlib import Path
p=Path(__file__).parent
sources=json.loads(Path("/home/elies/Backups/IRoboPF/producto-b2026-investigacion-20261104/FUENTES.json").read_text())
scales=json.loads(Path("/home/elies/Backups/IRoboPF/producto-b2026-investigacion-20261104/ESCALAS-2026.json").read_text())
out={}
for k,v in scales["comunidades"].items():
 f=sources["estatal" if k in ["ceuta","melilla"] else k]
 data=Path(f["cas"]).read_bytes(); assert hashlib.sha256(data).hexdigest()==f["sha256"]
 s=data.decode(); anchor="a65" if k in ["ceuta","melilla"] else v["evidencia"]["url"].split("#")[-1]
 part=s[s.index("id=\""+anchor+"\""):].split("<hr class=\"bloque\"")[0]
 table=re.search(r"<table\b.*?</table>",part,re.S).group(); rows=[]
 for tr in re.findall(r"<tr\b.*?</tr>",table,re.S):
  cells=[html.unescape(re.sub("<[^>]+>","",c)).strip().replace("\xa0","").replace(" ","").replace("%","").replace("»","") for c in re.findall(r"<td\b[^>]*>(.*?)</td>",tr,re.S)]
  if not cells: continue
  if k=="canarias": cells=cells[1:]
  assert len(cells)==4,(k,cells)
  n=lambda x: "0" if x in ["–", "—", "-"] else x.replace(".","").replace(",",".")
  rows.append({"base":n(cells[0]),"cuota":n(cells[1]),"tipoPorcentaje":n(cells[3])})
 assert rows,(k,anchor)
 out[k]={"cas":f["cas"],"sha256":f["sha256"],"anchor":anchor,"rows":rows}
(p/"oraculo-escalas-cas.json").write_text(json.dumps(out,ensure_ascii=False,indent=2))
print("CAS tables",len(out),"rows",sum(len(x["rows"]) for x in out.values()))
ex={}
for k,anchors in {"estatal":["a57","a58","a60","a61","a63","a66","a76"],"illes-balears":["a2"],"asturias":["a2-2","a2-3","a2-5"],"canarias":["a1-11"],"la-rioja":["a3-12"],"comunitat-valenciana":["a2"],"extremadura":["a1"]}.items():
 s=Path(sources[k]["cas"]).read_text()
 for a in anchors:
  part=s[s.index("id=\""+a+"\""):].split("<hr class=\"bloque\"")[0]
  ex[k+"/"+a]={"sha256":sources[k]["sha256"],"texto":" ".join(html.unescape(re.sub("<[^>]+>"," ",part)).split())}
(p/"extractos-primarios.json").write_text(json.dumps(ex,ensure_ascii=False,indent=2))
