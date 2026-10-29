"""Cierra entrega nueva sin promover confianza ni modificar el informe congelado."""
import difflib
import gzip
import json
from pathlib import Path

from revisar import BASE, OUT, ROOT, checked, load, physical, save, sha
from corpus import validate_schema
from enlaces import DocumentaryReadSet, verify_attestation


def main():
    inputs = [Path('/home/elies/irobopf-contexto/BRIEF.md'), ROOT / 'AGENTS.md']
    inputs += [ROOT / ('docs/procedencia/' + n + '.md') for n in ['CONTRATO-AUDITORIA', 'COORDINACION', 'ESTADO', 'DECISIONES']]
    inputs += [ROOT / ('docs/procedencia/correcciones/integracion-r19/' + n + '.json') for n in ['recepcion', 'recepcion-alimentos', 'recepcion-editoriales', 'cas-retenciones', 'verificacion-cierre']]
    inputs += [ROOT / 'docs/procedencia/correcciones/cambio-modelo-sol/recepcion.json']
    readings = []
    for path in inputs:
        raw = path.read_bytes()
        entry = {'path': str(path), 'sha256': sha(raw), 'size': len(raw)}
        if path.suffix == '.json':
            value = json.loads(raw)
            entry['structure'] = list(value) if isinstance(value, dict) else len(value)
        readings.append(entry)
    save('lecturas-y-recibos.json', readings)
    for page in load(OUT / 'pasajes-primarios.json'):
        if page['citationsReextracted'] == 0:
            data = Path(page['scratch']).read_bytes()
            assert sha(data) == page['facsimileSha256']
            cas = OUT / 'cas/sha256'
            cas.mkdir(parents=True, exist_ok=True)
            (cas / sha(data)).write_bytes(data)
    registry_path = Path('/home/elies/Repos/IRoboPF/docs/procedencia/delegaciones-ronda19.json')
    registry_raw = registry_path.read_bytes()
    registry = json.loads(registry_raw)
    matching = [d for d in registry['delegates'] if d['key'] == 'revision-bindings-estatales']
    assert len(matching) == 1
    delegation = matching[0]
    assert registry['base'] == BASE and delegation['model'] == 'gpt-6.1-sol'
    task_id = delegation['taskId']
    assert task_id == 'node:delegated-task:command%3Amcp%3A99a9fe10-4fb8-419d-8198-e5c0210805ae%3Adelegate-task%3Airobopf-r19-sol-revision-bindings-estatales'
    save('identidad-real.json', {'source': str(registry_path), 'sha256': sha(registry_raw), 'taskId': task_id, 'key': delegation['key'], 'role': delegation['role'], 'model': delegation['model'], 'options': delegation['options'], 'note': 'Extracto del registro real del padre, no alta en revisores ni concesión de confianza.'})
    report_path = OUT / 'INFORME.md'
    report_raw = report_path.read_bytes()
    report = {'path': str(report_path.relative_to(ROOT)), 'sha256': sha(report_raw)}
    decisions = load(OUT / 'decisiones-78.json')
    assert len(decisions) == 78 and len({d['payload']['sha256'] for d in decisions}) == 78
    approvals = []
    pending = []
    directory = OUT / 'atestaciones-candidatas'
    directory.mkdir(exist_ok=True)
    for d in decisions:
        assert d['decision'] == 'accepted-limited' and d['completeRule'] is False
        p = checked(d['payload'])
        a = {'schemaVersion': 1, 'payloadSha256': d['payload']['sha256'], 'inventory': p['inventory'], 'scope': p['scope'], 'decision': 'accepted-limited', 'reviewTaskId': task_id, 'report': report}
        validate_schema(a, 'binding-attestation')
        path = directory / (a['payloadSha256'] + '.json')
        path.write_text(json.dumps(a, ensure_ascii=False, indent=2) + '\n')
        reference = {'path': str(path.relative_to(ROOT)), 'sha256': sha(path.read_bytes())}
        approvals.append({'payloadSha256': a['payloadSha256'], 'attestation': reference})
        try:
            verify_attestation(DocumentaryReadSet(ROOT), reference, p, a['payloadSha256'])
        except ValueError as error:
            pending.append({'payloadSha256': a['payloadSha256'], 'result': str(error)})
        else:
            raise AssertionError('La aprobación real no estaba autorizada')
    save('aprobaciones-propuestas-NO-APLICADAS.json', {'reviewTaskId': task_id, 'approvals': approvals, 'trusted': False, 'warning': 'Candidato por objeto exacto. El padre debe contrastar y registrar aprobación v2 por payload+atestación; no usar como registro real.'})
    save('puerta-real-pendiente.json', pending)
    physical()
    assert report_path.read_bytes() == report_raw
    save('informe-congelado.json', {'report': report, 'attestations': len(approvals), 'realGateRejected': len(pending)})
    # El parche no se incluye a sí mismo ni al manifiesto, evitando circularidad.
    patch: list[str] = []
    binary = []
    for path in sorted(OUT.rglob('*')):
        if not path.is_file() or path.name in ('manifiesto.json', 'entrega.patch.gz', 'binarios.json', 'cierre.log'):
            continue
        raw = path.read_bytes()
        if path.suffix == '.gz' or raw.startswith(b'\x89PNG'):
            binary.append({'path': str(path.relative_to(ROOT)), 'sha256': sha(raw), 'size': len(raw)})
            continue
        text = raw.decode('utf-8')
        relative = str(path.relative_to(ROOT))
        patch.extend(difflib.unified_diff([], text.splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + relative))
    (OUT / 'entrega.patch.gz').write_bytes(gzip.compress(''.join(patch).encode(), mtime=0))
    save('binarios.json', binary)
    manifest = []
    for path in sorted(OUT.rglob('*')):
        if not path.is_file() or path.name in ('manifiesto.json', 'cierre.log'):
            continue
        raw = path.read_bytes()
        manifest.append({'path': str(path.relative_to(ROOT)), 'sha256': sha(raw), 'size': len(raw), 'baseSha256': None})
    save('manifiesto.json', {'base': BASE, 'deleted': [], 'files': manifest, 'excluded': ['manifiesto.json', 'cierre.log (log de ejecución, fuera del manifiesto estable)']})
    for entry in manifest:
        assert sha((ROOT / entry['path']).read_bytes()) == entry['sha256']
    print('CIERRE', len(manifest), 'archivos; 78 atestaciones CANDIDATAS; 78 rechazos reales; cero borrados; informe', report['sha256'])


if __name__ == '__main__':
    main()
