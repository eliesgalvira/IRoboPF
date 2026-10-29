"""Ejecuta cuerpos originales intactos, sustituyendo solo rango y DataFrame."""
import ast
import hashlib
import json
from pathlib import Path
from types import SimpleNamespace
import numpy as np

source = Path("Calculo_Salario_IRPF.py").read_bytes()
tree = ast.parse(source)
names = {"obtener_parametros", "calcular_cuotas_por_tramo", "procesar_ano"}
definitions = ast.Module(body=[n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name in names], type_ignores=[])
salarios = list(range(101)) + [9180, 11250, 13260, 14450, 14852, 15876, 16576, 17094, 17673, 17707, 18276, 19747, 20000, 22000, 33007, 39150, 45014, 48841, 53407, 58914, 61214, 67335, 91821, 100000]
namespace = {
    "np": SimpleNamespace(arange=lambda *args: np.array(salarios, dtype=np.int64)),
    "pd": SimpleNamespace(DataFrame=lambda rows: rows),
}
exec(compile(definitions, "Calculo_Salario_IRPF.py", "exec"), namespace)
rows = {str(y): namespace["procesar_ano"](y) for y in range(2012, 2027)}
print(json.dumps({"sourceSha256": hashlib.sha256(source).hexdigest(), "numpy": np.__version__,
                  "salarios": salarios, "filas": rows}, default=lambda x: x.item(), ensure_ascii=False))
