"""Ejecuta cuerpos AST originales sin editar sus instrucciones."""
import ast
import hashlib
import json
import platform
from pathlib import Path
from types import SimpleNamespace
import numpy as np

source = Path('Calculo_Salario_IRPF.py').read_bytes()
names = {'obtener_inflacion_acumulada', 'obtener_parametros', 'calcular_nomina_agregada', 'generar_comparativa_inflacion', 'generar_hojas_control'}
body = [n for n in ast.parse(source).body if (isinstance(n, ast.FunctionDef) and n.name in names) or (isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in {'IPC_ANUAL_DIC', 'INFLACION_A_2026'} for t in n.targets))]
namespace = {'np': np, 'pd': SimpleNamespace(DataFrame=lambda rows: rows)}
exec(compile(ast.Module(body=body, type_ignores=[]), 'Calculo_Salario_IRPF.py', 'exec'), namespace)
rows = namespace['generar_comparativa_inflacion']()
# Fronteras adicionales: ejecutar el cuerpo original con otro iterable de entrada.
salaries = [-18, -0.18, 0, 0.059, 1.005, 10, 30, 15875.99, 15876, 15876.01, 16576, 17094, 18276, 19747.5, 22000, 58913.99, 58914, 58914.01, 61214.4, 67335.84, 91821.6, 100000]
namespace['np'] = SimpleNamespace(arange=lambda *args: np.array(salaries, dtype=np.float64))
boundaries = namespace['generar_comparativa_inflacion']()
controls = namespace['generar_hojas_control']()
print(json.dumps({'sourceSha256': hashlib.sha256(source).hexdigest(), 'python': platform.python_version(), 'numpy': np.__version__, 'filas': [list(r.values()) for r in rows], 'fronteras': [list(r.values()) for r in boundaries], 'controles': [[list(r.values()) for r in sheet] for sheet in controls], 'factores': namespace['INFLACION_A_2026']}, ensure_ascii=False, indent=2, default=lambda x: x.item()))
