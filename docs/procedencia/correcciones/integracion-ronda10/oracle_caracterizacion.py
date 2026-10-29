"""Contraste nuevo del Python original: no modifica el fixture anterior."""
import ast
import hashlib
import json
from pathlib import Path
from types import SimpleNamespace
import numpy as np

source = Path('Calculo_Salario_IRPF.py').read_bytes()
fixture = Path('tests/fixtures/caracterizacion-legacy.json').read_bytes()
names = {'obtener_parametros', 'calcular_cuotas_por_tramo', 'procesar_ano'}
definitions = ast.Module(body=[n for n in ast.parse(source).body if isinstance(n, ast.FunctionDef) and n.name in names], type_ignores=[])
namespace = {'pd': SimpleNamespace(DataFrame=lambda rows: rows)}
exec(compile(definitions, 'Calculo_Salario_IRPF.py', 'exec'), namespace)
results = []
for case in json.loads(fixture)['casos']:
    salary = case['salarioBrutoAnualCentimos'] / 100
    namespace['np'] = SimpleNamespace(arange=lambda *args, s=salary: np.array([s], dtype=np.float64))
    row = namespace['procesar_ano'](case['anio'])[0]
    results.append({'anio': case['anio'], 'salarioBrutoAnualCentimos': case['salarioBrutoAnualCentimos'], 'fila': list(row.values())})
print(json.dumps({'sourceSha256': hashlib.sha256(source).hexdigest(), 'fixtureSha256': hashlib.sha256(fixture).hexdigest(), 'numpy': np.__version__, 'casos': results}, default=lambda x: x.item(), ensure_ascii=False, indent=2))
