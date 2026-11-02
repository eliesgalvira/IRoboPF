"""Control ordinario de cobertura y reservas de la revisión, sin CAS ni Git."""
import json
from pathlib import Path


def verificar() -> dict[str, int]:
    folder = Path(__file__).resolve().parent
    source = folder.parents[1] / 'correcciones/d-extremadura-remisiones'
    reviewed = json.loads((folder / 'dictamenes.json').read_text())['dictamenes']
    matrix = json.loads((source / 'matriz.json').read_text())['deducciones']
    evidence = json.loads((source / 'evidencia.json').read_text())
    versions = {v['id']: v for v in evidence['versiones']}
    assert len(reviewed) == len({r['codigo'] for r in reviewed}) == 19
    assert {r['codigo'] for r in reviewed} == {r['codigo'] for r in matrix}
    for row in reviewed:
        assert len(set(row['camposContrastados'])) == 7
        assert set(row['versionesContrastadas']) <= versions.keys()
        assert row['condiciones'] and row['discriminanteIndependiente']
        assert row['manual']['paginasFisicas']
    reserves = [r for r in reviewed if r['dictamen'] == 'reserva_parcial']
    assert [r['codigo'] for r in reserves] == ['extremadura_vivienda_zonas_rurales']
    literal = '\n'.join(p['textoLiteral'] for p in versions['EXT-a1-12-1']['pasajes'])
    assert 'fecha de entrada en vigor' in literal
    assert '21-03-2022' in reserves[0]['discriminanteIndependiente']
    for version, required in [
        ('EXT-a9-10-2', 'artículo 9.ter'),
        ('EXT-a1-14-2', 'artículos 3, 5, 6, 7, 8, 9 y 10'),
        ('EXT-a1-15-1', 'base de deducción máxima de 1.000'),
    ]:
        assert required in '\n'.join(p['textoLiteral'] for p in versions[version]['pasajes'])
    citations = {c['id']: c['textoLiteral'] for c in evidence['citas']}
    assert 'sin prorrateo' in citations['extremadura_enfermos_ela_familiares-M15']
    assert 'no estén obligadas' in citations['extremadura_donaciones_entidades_culturales_deportistas-M14']
    return {'codigos': len(reviewed), 'reservasParciales': len(reserves)}


if __name__ == '__main__':
    print(json.dumps(verificar()))
