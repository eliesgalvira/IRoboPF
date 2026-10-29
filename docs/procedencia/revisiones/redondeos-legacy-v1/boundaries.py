"""Oracle acotado: tipos originales, fronteras y redondeos; no genera Excel."""
import ast
import hashlib
import json
import math
from pathlib import Path
from types import SimpleNamespace
import numpy as np

root = Path('/home/elies/.t3/worktrees/IRoboPF/t3-dc46a039')
source = (root / 'Calculo_Salario_IRPF.py').read_bytes()
names = {'obtener_parametros', 'calcular_cuotas_por_tramo', 'procesar_ano'}
module = ast.Module(body=[n for n in ast.parse(source).body if isinstance(n, ast.FunctionDef) and n.name in names], type_ignores=[])
ns = {'pd': SimpleNamespace(DataFrame=lambda rows: rows)}
exec(compile(module, 'Calculo_Salario_IRPF.py', 'exec'), ns)
cases = []
equivalences = []
for year in range(2012, 2027):
    params = ns['obtener_parametros'](year)
    maximum = params['base_max']
    rate = sum(x[1] for x in params['ss_tipos'].values()) + params['mei'][1]
    points = {0., 10., 30., 2.675, -2.675, 5e-324, -5e-324, 100000.}
    for limit in [maximum, maximum * 1.1, maximum * 1.5, 16576., 18276., 17094.] + [v[0] + params['gastos_fijos'] + maximum * rate for v in params['tramos_irpf'] if math.isfinite(v[0])]:
        points.update([math.nextafter(limit, -math.inf), limit, math.nextafter(limit, math.inf)])
    for salary in sorted(points):
        ns['np'] = SimpleNamespace(arange=lambda *args, s=salary: np.array([s], dtype=np.float64))
        row = list(ns['procesar_ano'](year)[0].values())
        cases.append({'year': year, 'salary': salary, 'row': row})
        if salary.is_integer() and abs(salary) <= 2**53:
            ns['np'] = SimpleNamespace(arange=lambda *args, s=salary: np.array([int(s)], dtype=np.int64))
            introw = list(ns['procesar_ano'](year)[0].values())
            equivalences.append({'year': year, 'salary': salary, 'equal': row == introw})
    for bound, _ in params['tramos_irpf']:
        if math.isfinite(bound):
            for value in (math.nextafter(bound, -math.inf), bound, math.nextafter(bound, math.inf)):
                quotas, total = ns['calcular_cuotas_por_tramo'](np.float64(value), params['tramos_irpf'])
                equivalences.append({'year': year, 'base': value, 'types': [type(v).__name__ for v in quotas.values()], 'totalType': type(total).__name__})
roundings=[]
for value in [2.675, -2.675, 0., -0., 5e-324, -5e-324, 1e-300, -1e-300, 999999.99, 100000., 1.005, -1.005, 56294995342131.5]:
    for digits in range(5):
        roundings.append({'value': value, 'digits': digits, 'python': round(value, digits), 'numpy': float(round(np.float64(value), digits))})
fixture=json.loads((root/'tests/fixtures/caracterizacion-legacy.json').read_bytes())
characterization=[]
for case in fixture['casos']:
    salary=case['salarioBrutoAnualCentimos']/100
    rows=[]
    for dtype in ([np.float64,np.int64] if salary.is_integer() else [np.float64]):
        ns['np']=SimpleNamespace(arange=lambda *args,s=salary,t=dtype: np.array([s],dtype=t))
        rows.append(list(ns['procesar_ano'](case['anio'])[0].values()))
    characterization.append({'anio':case['anio'],'salarioBrutoAnualCentimos':case['salarioBrutoAnualCentimos'],'fila':rows[0], 'intFloatEqual': rows[0]==rows[-1] if len(rows)==2 else None})
print(json.dumps({'sourceSha256': hashlib.sha256(source).hexdigest(), 'numpy':np.__version__, 'cases': cases, 'types': equivalences, 'roundings':roundings, 'characterization':characterization},default=lambda v:v.item(),ensure_ascii=False,indent=2))
