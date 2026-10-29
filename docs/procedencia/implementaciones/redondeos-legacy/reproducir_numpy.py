import json
import platform
import numpy as np

cases = []
for salary in (10, 30):
    bruto = np.int64(salary)
    tipo = sum((0.047, 0.0155, 0.0, 0.001, 0.0)) + 0.0
    cot = bruto * tipo
    previo = bruto - cot
    cases.append(dict(salary=salary, tipo=repr(tipo), cot=repr(float(cot)),
                      previo=repr(float(previo)), numpyCot=float(round(cot, 2)),
                      numpyNeto=float(round(previo, 2)),
                      pythonCot=round(float(cot), 2), pythonNeto=round(float(previo), 2)))
print(json.dumps(dict(python=platform.python_version(), numpy=np.__version__,
                     cases=cases, Q2=round(5151 * 0.2475, 2)), indent=2))
