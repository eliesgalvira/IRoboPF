"""Comprueba transporte y estructura documental; no calcula deducciones."""
import hashlib
import json
from pathlib import Path

p = Path(__file__).resolve().parent
fuentes = {f['id']: f for f in json.loads((p / 'fuentes.json').read_text())['documentos']}
citas = json.loads((p / 'citas.json').read_text())['citas']
assert len({c['id'] for c in citas}) == len(citas)
for c in citas:
    assert c['sha256'] == fuentes[c['fuente']]['sha256']
    assert c['literal'] and c['localizador']
    if 'inicio' in c:
        assert c['fin'] - c['inicio'] == len(c['literal'])
props = json.loads((p / 'propuestas-por-codigo.json').read_text())['propuestas']
assert len(props) == 6
for x in props:
    b = x['preimagen']
    assert hashlib.sha256(b['bloque'].encode()).hexdigest() == b['bloqueSha256']
    assert hashlib.sha256(json.dumps(b['filaMatriz'], ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest() == b['filaMatrizSha256']
    assert set(x['citas']) <= {c['id'] for c in citas}
assert len(json.loads((p / 'categorias-intervenciones.json').read_text())['categorias']) == 10
print(f'Correcto: {len(props)} propuestas, {len(citas)} citas; sin aceptación jurídica o financiera.')
