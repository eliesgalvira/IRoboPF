"""Valida la superposición candidata y ensayos aritméticos sin importar el motor."""
from __future__ import annotations

import gzip
import hashlib
import json
from decimal import Decimal as D, ROUND_HALF_UP
from pathlib import Path

import jsonschema
import pymupdf

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent


def digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def main() -> None:
    fichas = json.loads((OUT / 'fichas.json').read_bytes())
    schema = json.loads((OUT / 'overlay.schema.json').read_bytes())
    jsonschema.Draft202012Validator(schema).validate(fichas)
    for name in ('celdas', 'conceptos'):
        jsonschema.Draft202012Validator(
            json.loads((OUT / f'{name}.schema.json').read_bytes())
        ).validate(json.loads((OUT / f'{name}.json').read_bytes()))
    rastro = json.loads((ROOT / 'lib/procedencia/rastro-generado.json').read_bytes())
    esperado = {b['siteId']: b['sujeto'] for b in rastro['bindings']
                if b['siteId'].startswith(('anual.base.', 'anual.cuota.',
                                          'anual.minimo.', 'anual.deducciones.',
                                          'anual.explicito.cuota.'))
                or b['siteId'] in ('anual.explicito.big', 'anual.explicito.blg')}
    actual = {f['selector']['siteId']: f['selector']['sujeto'] for f in fichas}
    assert esperado == actual
    assert len(fichas) == len(actual)
    grupos = json.loads((OUT / 'derivaciones.json').read_bytes())
    for f in fichas:
        assert f['derivacionComun'] in grupos
        selector = f['selector']
        fuente = selector['fuente']
        raw = (ROOT / fuente['archivo']).read_bytes()
        assert digest(raw) == fuente['sha256']
        loc = json.loads(fuente['localizador'])
        utf = raw.decode().encode('utf-16-le')
        call = utf[loc['inicio'] * 2:loc['fin'] * 2].decode('utf-16-le')
        assert call == selector['codigoExacto']
        assert f'"{selector["siteId"]}"' in call
    citas = json.loads((OUT / 'fuentes-primarias.json').read_bytes())
    originals = {o['sha256']: o for o in json.loads((OUT / 'originales.json').read_bytes())}
    rutas = set()
    for c in citas:
        ref = c['referencia']
        assert digest(Path(ref['path']).read_bytes()) == ref['sha256']
        rutas.add(ref['path'])
        with pymupdf.open(originals[c['original']]['path']) as pdf:
            txt = pdf[c['pagina'] - 1].get_text(
                'text', clip=pymupdf.Rect(c['caja']), flags=0, sort=False)
            assert txt == c['texto']
        if c['facsimil'] and 'path' in c['facsimil']:
            assert digest(Path(c['facsimil']['path']).read_bytes()) == c['facsimil']['sha256']
    for o in originals.values():
        raw = Path(o['path']).read_bytes()
        assert digest(raw) == o['sha256']
        assert hashlib.sha512(raw).hexdigest() == o['sha512']
        assert len(raw) == o['size']
    for f in fichas:
        assert set(f['fuentesPrimarias']) <= rutas
    cells = json.loads((OUT / 'celdas.json').read_bytes())
    assert len(cells) == 264 and len({c['id'] for c in cells}) == 264
    data = json.loads(gzip.decompress((ROOT / 'docs/procedencia/inventario-datos.json.gz').read_bytes()))
    inventory = {i['id']: i for name, raw in data if name.startswith('inventario-pagina-')
                 for i in json.loads(raw)}
    for c in cells:
        assert c['estado'] == 'candidata' and c['aceptacionFiscalCompleta'] is False
        assert set(c['secciones']['evidencia']) <= rutas
        sel = c['selector']
        if sel['itemId'] is not None:
            i = inventory[sel['itemId']]
            assert (i['source']['file'], i['source']['sha256'], i['symbol'], json.loads(i['path'])) == (
                sel['archivo'], sel['sha256'], sel['simbolo'], sel['ruta'])
            assert D(i['value']) == D(c['valor']) and i['unit'] == c['unidad']
            assert sel['ejercicio'] in i['years'] and sel['territorio'] in i['territories']
        case = c['casoIndependiente']
        for name in ('propuestaAnterior', 'payloadOriginal', 'decisionPrevia'):
            ref = c[name]
            assert digest(Path(ref['path']).read_bytes()) == ref['sha256']
        citation = json.loads(Path(c['secciones']['evidencia'][0]).read_bytes())
        binding = citation['engineBinding']
        number = binding['number']
        literal = citation['quote'][number['start']:number['end']]
        assert literal == number['literal']
        assert D(literal.replace('.', '').replace(',', '.')) == D(c['valor'])
        assert binding['unitCode'] == c['unidad']
        values = {json.loads(h['path'])[-1]: D(h['value']) for h in case['hojas']}
        q = values['cuota'] + (D(case['entradaEUR']) - values['baseInferior']) * values['tipo']
        assert q == D(case['cuotaExactaEUR'])
        assert q.quantize(D('.01'), rounding=ROUND_HALF_UP) == D(case['cuotaPresentadaHalfUpEUR'])
    # Casos propios con constantes escritas desde la tabla oficial, no del motor.
    cases: dict[str, str] = {}

    def check(name: str, result: D, expected: str) -> None:
        assert result == D(expected), (name, result, expected)
        cases[name] = str(result)

    check('ordinaria-2012-exceso', D('2124.86') + D('.01') * D('.14'), '2124.8614')
    check('complementaria-2012-exceso', D('132.80') + D('.01') * D('.02'), '132.8002')
    check('estado-2012-publicada-total', D('2124.8614') + D('132.8002'), '2257.6616')
    check('estado-2012-integrada-distinta', D('17707.2') * D('.1275') + D('.01') * D('.16'), '2257.6696')
    for b, expected in [('59999.99', '8625.831378'), ('60000', '8625.8332'), ('60000.01', '8716.67227')]:
        base = D(b)
        q = D('8716.67') + (base - D('60000')) * D('.227') if base > D('60000') else D('4142.62') + (base - D('35394')) * D('.1822')
        check('murcia-' + b, q, expected)
    check('ahorro-2012-base-reducida', (D('10000') - D('5151')) * D('.21'), '1018.29')
    check('ahorro-2025-estatal', D('990') - D('5550') * D('.095'), '462.750')
    check('ahorro-2025-autonomico', D('990') - D('5956.65') * D('.095'), '424.11825')
    check('ahorro-2025-suma', D('462.75') + D('424.11825'), '886.86825')
    check('consignacion-exceso-preserva-estado', D('886.86825') - min(D('10000'), D('424.11825')), '462.75000')
    check('minimo-propio-75', D('5550') + D('1150') + D('1400'), '8100')
    check('dos-descendientes-dos-titulares', (D('2400') + D('2700')) / 2, '2550')
    check('discapacidad-familiar65-dos-titulares', (D('9000') + D('3000')) / 2, '6000')
    check('madrid2020-publicada', D('7395.81') + (D('53407.29') - D('53407.20')) * D('.21'), '7395.8289')
    check('perfil-BIG-con-signo', max(D('0'), D('1000') - D('1500')) - D('200') + D('50'), '-150')
    check('explicito-negativo-tarifa-cero', max(D('-1000'), D('0')), '0')
    (OUT / 'casos-resultados.json').write_text(json.dumps(cases, indent=2) + '\n')
    rules = json.loads((ROOT / '.oxlintrc.json').read_bytes())['rules']
    assert len(rules) == 16 and all(v == 'error' for v in rules.values())
    # El esquema debe rechazar promociones y pérdida de secciones.
    invalid = json.loads(json.dumps(fichas))
    invalid[0]['aceptacionFiscalCompleta'] = True
    assert list(jsonschema.Draft202012Validator(schema).iter_errors(invalid))
    invalid = json.loads(json.dumps(fichas))
    del invalid[0]['secciones']['derivacion']
    assert list(jsonschema.Draft202012Validator(schema).iter_errors(invalid))
    print(json.dumps({'exitCode': 0, 'sitios': len(fichas), 'celdas': len(cells),
                      'citas': len(citas), 'casosIndependientes': len(cases),
                      'antiSlopReglasError': len(rules), 'negativosSchema': 2}))


if __name__ == '__main__':
    main()
