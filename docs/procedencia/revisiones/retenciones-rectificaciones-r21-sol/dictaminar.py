import hashlib
from html import unescape
import json
from pathlib import Path
import re

OUT = Path('docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol')
ROOT = Path('docs/procedencia')
R21 = ROOT / 'correcciones/retenciones-2015-2016-r21'

def main() -> None:
    adjustments = json.loads((R21 / 'ajustes.json').read_text())
    for source in adjustments['sources'] + [adjustments['independentReview']]:
        assert hashlib.sha256(Path(source['path']).read_bytes()).hexdigest() == source['sha256']
    decisions = []
    for correction in adjustments['corrections']:
        suffix = correction['id'].split(':')[1]
        old = json.loads((ROOT / 'revisiones/retenciones-2015-2016-sol' / correction['source']).read_text())
        assert sum(row['id'] == correction['id'] for row in old) == 1
        reason = {
            'minimos': ('confirmacion-acotada-C01', 'Los tres signos visibles son≤64 y los PNG reproducidos coinciden; retirar solo la lectura<64. Índices y sujetos no quedan validados.', 'La coincidencia binaria no decide el signo.', 'Inspección personal de los tres recortes a3x; trazo inferior visible.', 'Rojo histórico intacto; sin certificación del resto del bucle.'),
            'regularizacion': ('requiere-precision-R21-02', 'Guarda alimentaria independiente correcta; persiste salvo causasPDF antes de la guarda y falta precedencia expresa en adenda.', 'Hechos mixtos no conciliados ya se rechazan.', 'Ese rechazo limita soporte pero no define el resultado de combinaciones conciliadas ni la precedencia para un implementador.', 'Exigir tabla de decisión futura; no fabricar una cuota.'),
            '87.5-no-aumento': ('requiere-cambio-R21-01', 'Se elimina tipo pretende subir de la condición pero se conserva asignación al anterior; candidato6→anterior12 es lectura literal posible e indebida.', 'Puede entenderse implícito que solo se limita una subida.', 'La condición histórica era expresa y el reemplazo la sustituye; documentar techo o restaurar guarda en futura autoría.', 'Tres rojos de subcaso; no cambiar fórmulas del candidato aquí.'),
            '87.5-aumento': ('confirmacion-condicionada-R21-02', 'Añade comprobación de guarda de alimentos aun con delta positivo; suficiente como restricción, sin decidir mixtos o mínimos.', 'Aumento exclusivo y nueva obligación concurrente podrían ser incompatibles.', 'No derivar exclusividad de delta; calificar evento. Si no es exclusivo, no aplicar techo de importe por esa sola cifra.', 'No presenta el ejemplo como nómina; no habilita versión.')
        }[suffix]
        decisions.append({'id': correction['id'], 'source': correction['source'], 'reason': correction['reason'], 'dictamen': reason[0], 'rationale': reason[1], 'objecionExperta': reason[2], 'respuesta': reason[3], 'coste': reason[4], 'aceptacionFiscalCompleta': False, 'requiresSubsequentContrast': True})
    assert len(decisions) == 12
    (OUT / 'dictamen-12.json').write_text(json.dumps(decisions, ensure_ascii=False, indent=2))
    controls = []
    for citation in json.loads((R21 / 'citas-art87-5.json').read_text()):
        data = Path(citation['document']['path']).read_bytes().decode()
        start = data.index('<div class="bloque" id="a87">')
        end = data.index('<div class="bloque" id="a88">', start)
        fragment = data[start:end]
        paragraphs = re.findall(r'<p class="parrafo">(5\. El tipo de retención.*?)</p>', fragment, re.S)
        assert len(paragraphs) == 1
        normalized = ' '.join(unescape(re.sub('<[^>]+>', ' ', paragraphs[0])).split())
        assert normalized == citation['textNormalized']
        digest = hashlib.sha256(normalized.encode()).hexdigest()
        controls.append({'documentSha256': citation['document']['sha256'], 'selector': '#a87 p: texto comienza5.', 'normalizedSha256': digest, 'declaredSectionSha256': citation['sectionSha256'], 'matchesNormalized': True, 'matchesDeclaredHash': digest == citation['sectionSha256']})
    # El rótulo sectionSha256 se comprueba sin suponer qué representación fue hasheada.
    (OUT / 'selector-comprobado.json').write_text(json.dumps(controls, ensure_ascii=False, indent=2))
    rules = json.loads(Path('.oxlintrc.json').read_text())['rules']
    anti = {k: v for k, v in rules.items() if k.startswith('anti-slop')}
    assert len(anti) == 16 and all(v == 'error' for v in anti.values())
    (OUT / 'anti-slop.json').write_text(json.dumps(anti, indent=2))
    print('12 IDs únicos; hashes de fuentes correctos; dos selectores exactos;16 reglas aerror', controls)

if __name__ == '__main__':
    main()
