"""Revisión: XML original con coordenadas; AST original, sin expected TypeScript."""
import ast
import hashlib
import json
import platform
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path
from types import SimpleNamespace
import numpy as np

root, out = map(Path, sys.argv[1:])
book = Path('/home/elies/Repos/IRoboPF/Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx')
ns = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
sheets = {}
with zipfile.ZipFile(book) as z:
    rels = {r.attrib['Id']: r.attrib['Target'] for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
    for s in ET.fromstring(z.read('xl/workbook.xml')).iter(ns+'sheet'):
        name = s.attrib['name']
        if name not in ['COMPARATIVA_INFLACION', 'CONTROL_GENERAL', 'CONTROL_TRAMOS_IRPF']:
            continue
        target = rels[s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']]
        tree = ET.fromstring(z.read(target.lstrip('/') if target.startswith('/') else 'xl/'+target))
        rows = []
        for i, row in enumerate(tree.iter(ns+'row'), 1):
            assert int(row.attrib['r']) == i
            cells = []
            for j, c in enumerate(row.findall(ns+'c')):
                assert c.attrib['r'] == chr(65+j)+str(i)
                assert c.find(ns+'f') is None
                cells.append(''.join(c.find(ns+'is').itertext()) if c.get('t') == 'inlineStr' else float(c.findtext(ns+'v')))
            rows.append(cells)
        sheets[name] = rows
source = (root/'Calculo_Salario_IRPF.py').read_bytes()
names = {'obtener_inflacion_acumulada','obtener_parametros','calcular_nomina_agregada','generar_comparativa_inflacion','generar_hojas_control'}
body = [n for n in ast.parse(source).body if isinstance(n, ast.FunctionDef) and n.name in names or isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in {'IPC_ANUAL_DIC','INFLACION_A_2026'} for t in n.targets)]
env = {'np':np, 'pd':SimpleNamespace(DataFrame=lambda x:x)}
exec(compile(ast.Module(body=body,type_ignores=[]), 'original', 'exec'), env)
rows = [list(r.values()) for r in env['generar_comparativa_inflacion']()]
prior = json.loads((root/'docs/procedencia/implementaciones/comparativa-inflacion/python.json').read_text())
assert rows == prior['filas']
salaries = [r[1] for r in prior['fronteras'][:22]]
extra = [-100000, -1.005, 0.005, 16.055, 22700.16, 99999.99, 1000000, 1e9]
env['np'] = SimpleNamespace(arange=lambda *args: np.array(salaries+extra,dtype=np.float64))
boundaries = [list(r.values()) for r in env['generar_comparativa_inflacion']()]
rounds = []
for v in [0.005,0.015,1.015,2.675,16.055,56294995342131.5,1e9+0.005]:
    for sign in [1,-1]:
        for digits in range(5):
            x = sign*v
            rounds.append({'x':x,'digits':digits,'python':round(x,digits),'numpy':float(np.round(x,digits))})
result = {'book':{'size':book.stat().st_size},'sourceSha256':hashlib.sha256(source).hexdigest(),'python':platform.python_version(),'numpy':np.__version__,'sheets':sheets,'rows':rows,'boundaries':boundaries,'rounds':rounds,'factors':env['INFLACION_A_2026'],'sequence':{'dtype':str(np.arange(15000,100001,1000).dtype),'values':np.arange(15000,100001,1000).tolist()},'prior330Equal': [r for r in boundaries if r[1] in salaries] == prior['fronteras']}
for algo in ['sha256','sha512']:
    with book.open('rb') as f:
        result['book'][algo] = hashlib.file_digest(f,algo).hexdigest()
(out/'oracle.json').write_text(json.dumps(result,ensure_ascii=False,indent=2,default=lambda x:x.item())+'\n')
