"""Comprueba evidencia y reproduce el defecto de cadena sin modificar producto."""
import argparse
import hashlib
import json
from pathlib import Path

from bs4 import BeautifulSoup


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--indice', required=True, type=Path,
                        help='JSON privado SHA256 -> ruta de original')
    parser.add_argument('--exigir-cadena-completa', action='store_true',
                        help='Rojo esperado en la base: exige las fuentes posteriores en lote E')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    base = root.parents[1]
    indice = json.loads(args.indice.read_text())
    fuentes = json.loads((base / 'lotes/e/fuentes.json').read_text())['documentos']
    fichas = json.loads((base / 'lotes/e/dictamenes.json').read_text())['deducciones']
    decisiones = json.loads((root / 'decisiones.json').read_text())['decisiones']
    assert len(decisiones) == 49
    assert {x['id'] for x in decisiones} == {x['codigo'] for x in fichas}
    originales = {c['id']: c for f in fichas for c in f['citas']}
    for decision in decisiones:
        for ref in decision['evidencia']:
            cita = originales[ref['cita']]
            assert ref['posicion'] == cita['localizador']
            assert ref['fuente'] == cita['documentoId']
            assert ref['sha256'] == next(f['sha256'] for f in fuentes
                                        if f['id'] == ref['fuente'])
    nuevos = json.loads((root / 'fuentes-complementarias.json').read_text())['documentos']
    documentos = {}
    for fuente in nuevos:
        contenido = Path(indice[fuente['sha256']]).read_bytes()
        assert len(contenido) == fuente['bytes']
        for algoritmo in ('sha256', 'sha512'):
            assert hashlib.new(algoritmo, contenido).hexdigest() == fuente[algoritmo]
        documentos[fuente['id']] = BeautifulSoup(contenido, 'html.parser')
    for cita in json.loads((root / 'citas-complementarias.json').read_text()):
        texto = documentos[cita['fuente']].select('p')[cita['posicion']['indice']].get_text(' ', strip=True)
        assert hashlib.sha256(texto.encode()).hexdigest() == cita['sha256Texto']
    # Discriminantes numéricos contra literales originales, sin simular motor.
    for codigo, fragmento in [
        ('rioja_enfermos_ela', '50'),
        ('rioja_segunda_vivienda_medio_rural', '8%'),
        ('galicia_inversion_proyectos_especial_interes', '10.000'),
        ('galicia_adecuacion_inmueble_vacio_arrendamiento', '3.000'),
    ]:
        ficha = next(f for f in fichas if f['codigo'] == codigo)
        assert any(fragmento in c['textoLiteral'] for c in ficha['citas']
                   if '-original-' in c['id'] or '-regla-' in c['id'])
    casos = json.loads((root / 'casos.json').read_text())['casos']
    assert len({c['id'] for c in casos}) == 15
    if args.exigir_cadena_completa:
        assert {f['sha256'] for f in nuevos} <= {f['sha256'] for f in fuentes}, (
            'Cadena incompleta: faltan RDL 10/2026 y convalidación en lote E')
    print('49 decisiones; complementos íntegros; discriminantes documentales correctos; 15 escenarios catalogados')


if __name__ == '__main__':
    main()
