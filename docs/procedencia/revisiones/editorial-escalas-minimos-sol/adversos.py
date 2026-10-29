"""Casos nuevos: expectativas externas al motor y rojos editoriales preservados."""
from __future__ import annotations

import json
import sys
from decimal import Decimal as D
from pathlib import Path

OUT = Path(__file__).resolve().parent
AUTHOR = Path('docs/procedencia/editorial/escalas-minimos')


def main() -> None:
    cases = []

    def check(name: str, actual: object, expected: object) -> None:
        cases.append(dict(id=name, actual=str(actual), esperado=str(expected), coincide=actual == expected))

    # Mutante >= en la frontera: el ejemplo L+1 no lo distingue.
    def murcia(base: D, inclusive: bool = False) -> D:
        if base > D(60000) or (inclusive and base == D(60000)):
            return D('8716.67') + (base - D(60000)) * D('.227')
        return D('4142.62') + (base - D(35394)) * D('.1822')

    check('MUR-limite-menos-milésima', murcia(D('59999.999')), D('8625.8330178'))
    check('MUR-limite-más-milésima', murcia(D('60000.001')), D('8716.670227'))
    check('MUR-mutante-sobrevive-L-mas-1', murcia(D(60001)), murcia(D(60001), True))
    check('MUR-mutante-discriminado-en-L', murcia(D(60000)) != murcia(D(60000), True), True)
    # Remanentes invertidos y menor que la primera frontera; nunca mezclar mínimos.
    estatal = (D(6000) - D(2500)) * D('.095')
    autonomica = (D(6000) - D(1000)) * D('.095')
    check('AH-2015-remanentes-distintos-E', estatal, D('332.500'))
    check('AH-2015-remanentes-distintos-A', (D(6000) - D(1000)) * D('.10'), D('500'))
    check('AH-2015-mitad-es-mutante', estatal != (estatal + D(500)) / 2, True)
    check('AH-intercambiar-minimos-cambia-componente', estatal != autonomica, True)
    # B cruza frontera: F(B-r) difiere de F(B)-F(r), fuera de los ejemplos del autor.
    old = D(6000) * D('.21') + D(2000) * D('.25')
    wrong = D(6000) * D('.21') + D(3000) * D('.25') - D(1000) * D('.21')
    check('AH-2014-base9000-remanente1000', old, D('1760'))
    check('AH-2014-orden-incorrecto-discriminado', wrong - old, D(40))
    check('CONS-cap-con-dos-bases', min(D(900), D(70) + D(30)), D(100))
    check('CONS-preserva-estado', D(250) + D(100) - min(D(900), D(100)), D(250))
    check('BIG-negativa-no-se-pierde', max(D(500)-D(700), D(0)) + D(-750) + D(20), D(-730))
    check('DA61-una-sola-vez', D('800.123') - D(240) - D(17) - D(23), D('520.123'))
    # Artículo 61: rentas de titulares de grado próximo, distintas de las del menor.
    check('FAM-padre-renta8000-beneficiario-abuelo', 'abuelo' if D(8000) <= D(8000) else 'padre', 'abuelo')
    check('FAM-padre-renta8000_01-beneficiario-padre', 'abuelo' if D('8000.01') <= D(8000) else 'padre', 'padre')
    check('FAM-tres-hijos-reparto-2-sin-dividir-propio', D(5550) + (D(2400)+D(2700)+D(4000))/2, D(10100))
    # El patrón de código confirma la excepción; no se ejecuta para fabricar esperados.
    code = Path('lib/dominio/irpf/minimos/derechos.ts').read_text()
    check('FAM-codigo-contempla-renta-titular', 'cercanos.every((t) => t.rentasNoExentasCentimos <= 800000)' in code, True)
    (OUT / 'adversos-resultados.json').write_text(json.dumps(cases, ensure_ascii=False, indent=2) + '\n')
    assert all(c['coincide'] for c in cases)
    fichas = json.loads((AUTHOR / 'fichas.json').read_bytes())
    by_site = {f['selector']['siteId']: f for f in fichas}
    red = []
    for site, literal in [('anual.explicito.cuota.autonomica', '5.956,65'), ('anual.minimo.contribuyente', '5.151')]:
        f = by_site[site]
        quotes = [json.loads(Path(p).read_bytes())['quote'] for p in f['fuentesPrimarias']]
        red.append(dict(id='SEM-EVID-' + site, criterio='La cuantía enseñada debe tener pasaje primario enlazado; buscar literal es diagnóstico de ausencia, no aceptación por coincidencia.',
                        literal=literal, esperado=True, actual=any(literal in q for q in quotes)))
    (OUT / 'rojos-resultados.json').write_text(json.dumps(red, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(casos=len(cases), correctos=sum(c['coincide'] for c in cases), rojos=red), ensure_ascii=False))
    if not all(r['actual'] for r in red):
        sys.exit(1)


if __name__ == '__main__':
    main()
