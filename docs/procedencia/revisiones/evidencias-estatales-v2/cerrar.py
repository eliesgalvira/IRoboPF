"""Cierre editorial por hashes, sin aceptación de payload ni mutaciones VCS."""
import difflib
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
from corpus import validate_schema  # noqa: E402
from enlaces import select_decision  # noqa: E402


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def read(path):
    return json.loads(path.read_bytes())


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')


def main():
    prefix = 'docs/procedencia/revisiones/evidencias-estatales-v2/'
    acquisitions = sum([read(OUT/n) for n in ('adquisiciones.json', 'adquisiciones-ley2012.json', 'adquisiciones-erratas-2012.json')], [])
    chain = {
        'reviewer': 'Codex, agente /root, checkout T3 t3-803d665c',
        'ordinary': {'years': [2012, 2013, 2014], 'source': 'BOE-A-2010-19703 art. 62.Uno, p63', 'reason': 'Efectos 2011 y vigencia indefinida. El índice de modificaciones del art. 63 LIRPF no intercala sustitución en 2012–2014; siguiente modificación Ley 26/2014 art. 1.39 con efectos 2015. No es inferencia de igualdad entre alias.'},
        'complementary': {'years': [2012, 2013, 2014], 'sources': ['BOE-A-2011-20638 DF segunda.Primero, DA35.1.a, p53', 'BOE-A-2012-8745 art. 61, pp68–69', 'BOE-A-2013-13616 art. 64.Uno, pp75–76'], 'reason': 'RDL establece 2012–2013; Ley 2/2012 vuelve a añadir DA35 con efectos 2012 y las mismas siete filas; Ley 22/2013 incluye 2014 expresamente.'},
        'errata': [
            {'id': 'BOE-A-2012-352', 'result': 'Cuatro páginas leídas. DA12 cambia rendimiento cedido; DF segunda corrige título (Leyes/leyes), colocación de párrafos de ordinales segundo/tercero y comillas. No modifica las celdas de DA35.1.a. No afirmar que no toca DF segunda.'},
            {'id': 'BOE-A-2014-2109', 'result': 'Una página leída. Preámbulo, art.47, art.128, DA25/27, DF4/27 y créditos. No art.64 ni escala.'},
            {'id': 'BOE-A-2012-9005', 'result': 'Cuadro de bonificaciones portuarias del anexo IX; no art.61.'},
            {'id': 'BOE-A-2012-10341', 'result': 'DA39 y DF21: referencia y precisión de tasa aeroportuaria; no art.61.'},
            {'id': 'BOE-A-2012-11832', 'result': 'Referencia del anexo XII; no art.61.'}],
        'ordinaryErrataSearch': 'XML de análisis BOE-A-2010-19703 e índice del art.63 consultados; no se identifica corrección de sus celdas. Es cobertura de esas fuentes, no afirmación de búsqueda universal.',
        'discriminants': ['DA35.1.a base general frente a DA35.1.b ahorro.', 'DA35.2 retenciones repite cifras pero usa otra base, minoración y regularización.', '2014 requiere prórroga explícita, no herencia desde 2013.', 'Tipo porcentual exige /100; base y cuota mantienen EUR y conversión identidad.'],
        'objection': 'Un índice consolidado tiene valor informativo y puede contener enlaces erróneos: el enlace de DA35 al RDL remite a BOE-A-2011-11641, que no es su identificador. Se resuelve por título, fecha, ELI y PDF original BOE-A-2011-20638, sin seguir esa asociación errónea.',
        'cost': 'Reabrir originales y cinco erratas, conservar nuevas capturas y limitar aceptación a cuantías nominales por celda/año.',
        'acquisitions': acquisitions, 'completeRuleAcceptance': False}
    write('cadena-normativa.json', chain)
    chain_ref = {'path': prefix+'cadena-normativa.json', 'sha256': sha((OUT/'cadena-normativa.json').read_bytes())}
    new_citations_ref = {'path': prefix+'citas-propias-ampliacion.json', 'sha256': sha((OUT/'citas-propias-ampliacion.json').read_bytes())}
    decisions = read(OUT/'decisiones-canonicas.json')
    for d in decisions:
        d['chainEvidence'] = chain_ref
        d['additionalCitations'] = new_citations_ref
        d['reviewer'] = chain['reviewer']
        validate_schema({k: d[k] for k in ('id', 'status', 'engineLocations')}, 'legal-decision-scope')
        assert select_decision(decisions, d['id']) is d
    write('decisiones-canonicas.json', decisions)
    rows = read(ROOT/'docs/procedencia/evidencias/propuestas-r12/correspondencias.json')['rows']
    checked = []
    for row in rows:
        if row['domain'] != 'estatales':
            continue
        for field in ('original', 'proposal'):
            assert sha((ROOT / row[field]['path']).read_bytes()) == row[field]['sha256']
        old = read(ROOT / row['original']['path'])
        new = read(ROOT / row['proposal']['path'])
        assert old['itemId'] == row['previousItemId'] and new['itemId'] == row['currentItemId']
        assert all(new['source'][k] == row['identity'][k] for k in ('file', 'symbol', 'tablePath'))
        assert old['source']['file'] == new['source']['file'] and old['source']['tablePath'] == new['source']['tablePath'] and old['source']['symbol'] == new['source']['symbol']
        assert old['scope']['year'] == new['scope']['year']
        checked.append({'proposalId': new['id'], 'originalId': old['id'], 'identityVerified': True})
    assert len(checked) == 78
    write('remapeo-revisado-78.json', checked)
    manifest = []
    patch = []
    for path in sorted(OUT.rglob('*')):
        if not path.is_file() or path.name in ('manifiesto.json', 'entrega.patch'):
            continue
        raw = path.read_bytes()
        relative = prefix+str(path.relative_to(OUT))
        assert not (ROOT/relative).exists(), relative
        manifest.append({'path': relative, 'sha256': sha(raw), 'size': len(raw), 'baseSha256': None})
        if path.suffix in ('.md', '.json', '.py', '.log'):
            patch.extend(difflib.unified_diff([], raw.decode().splitlines(keepends=True), fromfile='/dev/null', tofile='b/'+relative))
    (OUT/'entrega.patch').write_text(''.join(patch))
    manifest.append({'path': prefix+'entrega.patch', 'sha256': sha((OUT/'entrega.patch').read_bytes()), 'size': (OUT/'entrega.patch').stat().st_size, 'baseSha256': None})
    write('manifiesto.json', {'base': '5799bb03826719a4dd3500a962e2d6bb5124fdca', 'files': manifest, 'deletions': [], 'completeRuleAcceptance': False})
    for entry in manifest:
        path = OUT/entry['path'].removeprefix(prefix)
        assert sha(path.read_bytes()) == entry['sha256'] and path.stat().st_size == entry['size']
    print(json.dumps({'files': len(manifest), 'remaps': len(checked), 'decisionsSelected': len(decisions), 'deletions': 0, 'manifestSha256': sha((OUT/'manifiesto.json').read_bytes())}))


if __name__ == '__main__':
    main()
