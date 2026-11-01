"""Contraste acotado URL/fecha. REVIEW_TMP externo existente; jsonschema4.26.0.
Conserva módulos anteriores y resultados en privado; no cambia código del contrato.
Salida1 si admite URLs con credenciales en reservas o norma nula en schema.
"""
import copy
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
sys.dont_write_bytecode = True
root = Path.cwd()
privado = Path(os.environ['REVIEW_TMP']).resolve(strict=True)
assert not privado.is_relative_to(root)
anterior = privado / 'contrato-2aa38fec'
anterior.mkdir(exist_ok=True)
for nombre in ['verificar.py', 'contrato.schema.json']:
    (anterior / nombre).write_bytes(subprocess.check_output(['git','show','2aa38fec:scripts/procedencia/deducciones-2025/'+nombre]))
def cargar(p, nombre):
    spec = importlib.util.spec_from_file_location(nombre, p)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m
viejo = cargar(anterior/'verificar.py','antes')
actual = cargar(root/'scripts/procedencia/deducciones-2025/verificar.py','actual')
p = root/'docs/procedencia/deducciones-2025'
censo = json.loads((p/'censo.json').read_text())
base = dict(dictamenes=json.loads((p/'lotes/a/dictamenes.json').read_text()), fuentes=json.loads((p/'lotes/a/fuentes.json').read_text()))
def acepta(m, caso):
    try:
        m.verificar_paquetes(censo,[caso],'parcial')
        return True
    except Exception:
        return False
# Caso real: URL oficial /home/ está en el DOGC original del paquete.
url = copy.deepcopy(base)
manual = url['fuentes']['documentos'][0]
manual['fechaPublicacion']='2026-10-21' # SOLO fixture para aislar URL, no metadato fiscal aceptado.
manual.pop('fechaEditorial',None)
manual.pop('reservaFechaPublicacion',None)
assert not acepta(viejo,url) and acepta(actual,url)
assert not acepta(viejo,base) and acepta(actual,base)
print('VERDE: ambos rechazos de2aa38fec reproducidos; positivos actuales reales')
for u in ['/home/fixture/documento','file:///tmp/fixture','https:///home/fixture','https://user:pass@example.invalid/home/doc','https://example.invalid/home/doc?%54OKEN=x','https://example.invalid/home/doc?session']:
    q=copy.deepcopy(base);q['fuentes']['documentos'][0]['urlOficial']=u
    assert not acepta(actual,q)
for clave,valor in [('tipo','original'),('reservaFechaPublicacion',''),('fechaEditorial','2025-02-30')]:
    q=copy.deepcopy(base);q['fuentes']['documentos'][0][clave]=valor
    assert not acepta(actual,q)
q=copy.deepcopy(base);q['fuentes']['documentos'][1]['fechaPublicacion']=None
assert not acepta(actual,q)
print('VERDE: rutas locales, URL sin host, credenciales y fechas inválidas rechazadas en fuentes')
rojos=0
for valor in ['https://user:pass@example.invalid/home/doc','https://example.invalid/home/doc?token=MARCADOR']:
    q=copy.deepcopy(url);q['dictamenes']['deducciones'][0]['vigencia']['reservaURL']=valor
    assert not acepta(viejo,q)
    fallo=acepta(actual,q);rojos+=fallo
    print('ROJO' if fallo else 'VERDE','credenciales en reserva: esperado rechazar; observado', 'acepta' if fallo else 'rechaza')
# El runtime rechaza, pero el schema aislado admite una norma con publicación nula.
q=copy.deepcopy(base['fuentes']);q['documentos'][1]['fechaPublicacion']=None
try:
    actual.validar_schema(q,actual.SCHEMA['$defs']['fuentes']);fallo=True
except Exception:
    fallo=False
rojos+=fallo
print('ROJO' if fallo else 'VERDE','schema aislado: norma con fecha nula; runtime sí rechaza')
raise SystemExit(bool(rojos))
