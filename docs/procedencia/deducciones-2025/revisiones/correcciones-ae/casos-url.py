"""Casos propios acotados. jsonschema==4.26.0; ejecutar desde la raíz.

Conserva dos rojos: parámetros sensibles sin valor en enlaces Markdown.
No descarga, escribe ni modifica los paquetes usados como fixture.
"""
import copy
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
root = Path(__file__).resolve().parents[5]
spec = importlib.util.spec_from_file_location(
    'contrato_ae', root / 'scripts/procedencia/deducciones-2025/verificar.py')
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)
p = root / 'docs/procedencia/deducciones-2025'
censo = json.loads((p / 'censo.json').read_text())
base = {k: json.loads((p / f'lotes/a/{k}.json').read_text())
        for k in ('dictamenes', 'fuentes')}
rojos = []
for query in ('%54OKEN', 'session'):
    for markdown in (False, True):
        paquete = copy.deepcopy(base)
        url = 'https://example.invalid/norma?' + query
        valor = 'Documento: ' + (f'[norma]({url})' if markdown else url)
        paquete['dictamenes']['deducciones'][0]['vigencia']['reservaURL'] = valor
        try:
            v.verificar_paquetes(censo, [paquete], 'parcial')
        except ValueError as error:
            assert 'credenciales' in str(error)
            assert 'example.invalid' not in str(error)
            assert query not in str(error)
            print('VERDE: URL sensible rechazada; diagnóstico sin valor recibido')
        else:
            rojos.append((query, markdown))
            print('ROJO: URL sensible admitida; enlace Markdown:', markdown)
assert rojos == [('%54OKEN', True), ('session', True)], rojos
raise SystemExit(bool(rojos))
