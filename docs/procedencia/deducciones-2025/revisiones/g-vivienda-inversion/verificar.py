"""Cotejo documental reproducible sin CAS, Git ni dependencias externas."""
import hashlib
import json
from pathlib import Path


def main():
    root = Path(__file__).resolve().parent
    repo = root.parents[4]
    evidence = json.loads((root / 'evidencias.json').read_text())
    for item in evidence['archivosRevisados']:
        raw = (repo / item['ruta']).read_bytes()
        assert len(raw) == item['bytes']
        assert hashlib.sha256(raw).hexdigest() == item['sha256']
    codes = set()
    for group in ['g-vivienda', 'g-inversion-dana']:
        folder = repo / 'docs/procedencia/deducciones-2025/correcciones' / group
        proposals = json.loads((folder / 'propuestas.json').read_text())
        for proposal in proposals:
            codes.add(proposal['codigo'])
            if group == 'g-vivienda':
                raw = (repo / proposal['path']).read_bytes()
                assert hashlib.sha256(raw).hexdigest() == proposal['fileSha256']
                assert raw.count(proposal['preimagen'].encode()) == 1
            else:
                raw = (repo / proposal['destino']).read_bytes()
                assert hashlib.sha256(raw).hexdigest() == proposal['sha256Archivo']
                rows = json.loads(raw)['articulos']
                assert [r for r in rows if r['codigo'] == proposal['codigo']] == [proposal['preimagen']]
    decisions = json.loads((root / 'decisiones.json').read_text())
    assert len(decisions) == len(codes) == 6
    assert {d['codigo'] for d in decisions} == codes
    citations = json.loads((repo / 'docs/procedencia/deducciones-2025/correcciones/g-vivienda/citas.json').read_text())['citas']
    cited = next(c for c in citations if c['id'] == 'gv-31')
    assert cited['pagina'] == 3
    assert 'Artículo 61.' in cited['literal']
    assert 'ocupación máxima' not in cited['literal']
    actual = next(c for c in evidence['pasajesIndependientes'] if c['id'] == 'R1')
    assert actual['sha256'] == cited['sha256']
    assert actual['inicio'] != cited['inicio']
    assert 'ocupación máxima' in actual['literal']
    assert '20 %' in actual['literal']
    print('OK: 18 archivos exactos, seis preimágenes actuales; RV01 reproducido: cita de índice, no artículo60. Sin evaluación financiera.')


if __name__ == '__main__':
    main()
