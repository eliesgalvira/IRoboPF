"""Contraste independiente de localizadores y límites del validador R23; no escribe R23."""
from __future__ import annotations
import contextlib
import copy
import gzip
import hashlib
import importlib.util
import io
import json
from pathlib import Path
from typing import Any

BASE = '6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9'
AUTHOR = Path('docs/procedencia/editorial/flujo-escalas-r23-sol')
OUT = Path(__file__).resolve().parent


def read(name: str) -> Any:
    path = AUTHOR / name
    return json.loads(gzip.decompress(path.read_bytes()) if name.endswith('.gz') else path.read_bytes())


def write(name: str, value: Any) -> None:
    data = (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()
    (OUT / name).write_bytes(gzip.compress(data, mtime=0) if name.endswith('.gz') else data)


def evidence(value: Any, errors: list[str]) -> int:
    count = 0
    if isinstance(value, dict):
        if {'file', 'sha256', 'start', 'end', 'offsetEncoding'} <= value.keys():
            raw = Path(value['file']).read_bytes()
            text = raw.decode().encode('utf-16-le')
            ok = (hashlib.sha256(raw).hexdigest() == value['sha256'] and value['offsetEncoding'] == 'utf16' and 0 <= value['start'] < value['end'] <= len(text) // 2)
            fragment = text[value['start']*2:value['end']*2].decode('utf-16-le')
            if 'expression' in value:
                ok = ok and fragment == value['expression']
            if not ok:
                errors.append(str(value))
            count += 1
        if ('rangeKind' in value or 'siteId' in value) and 'source' in value and 'expression' in value and isinstance(value['source'], dict) and 'start' in value['source']:
            src = value['source']
            text = Path(src['file']).read_text().encode('utf-16-le')
            if text[src['start']*2:src['end']*2].decode('utf-16-le') != value['expression']:
                errors.append('expression:' + str(src))
        count += sum(evidence(v, errors) for v in value.values())
    elif isinstance(value, list):
        count += sum(evidence(v, errors) for v in value)
    return count


def reasons(e: dict[str, Any]) -> list[str]:
    symbol, prop = e['output']['symbol'], e['output']['property']
    result = []
    if symbol.startswith('resolverParametrosComunidadAutonoma') and prop == 'escalaAutonomicaIgualEstatal' and int(symbol[-4:]) <= 2015:
        result.append('R26-01: salida literal false; comunidadAutonoma no selecciona su valor en este ejercicio.')
    if 'Simulada usa conjunta legacy' in e['formula']:
        result.append('R26-02: condición debe ser flag, no territorio; simulada2012–2015 usa componentes.')
    vague = ['parámetros públicos del helper', 'caso campos de fórmula', 'literal/alias en fuente', 'rentaNoExenta si conciliación']
    if any(i in vague for i in e['inputs']):
        result.append('R26-03: puerto genérico o compartido sin propiedad/argumento exacto; no prueba cierre por propiedad.')
    if symbol == 'importesLiquidacion':
        result.append('R26-03: output.value es el objeto, pero inputs solo cubre cuotaLiquidaCentimos; acotar propiedad antes de componer.')
    return result


def main() -> None:
    graph = read('grafo.json.gz')
    errors: list[str] = []
    checked = {}
    for name in ['grafo.json.gz', 'fuentes.json.gz', 'celdas.json.gz', 'rutas-datos.json.gz', 'fronteras.json', 'madrid.json', 'ocurrencias.json.gz']:
        checked[name] = evidence(read(name), errors)
    write('localizadores.json', {'base': BASE, 'checked': checked, 'errors': errors, 'meaning': 'Identidad y rangos, no causalidad.'})
    assert not errors, errors[:3]
    decisions = []
    for e in graph['edges']:
        issues = reasons(e)
        decisions.append({'id': e['id'], 'output': e['output'], 'inputsExamined': e['inputs'], 'formulaExamined': e['formula'], 'conditionExamined': e['condition'], 'evidence': e['evidence'], 'decision': 'requiere-precision' if issues else 'compatible-con-expresion-no-cierre', 'objections': issues or ['El cuerpo/rango no demuestra que todos los puertos estén enlazados a una instancia y entrada pública.'], 'response': 'Se conserva la relación candidata y su evidencia; no se acepta como cierre causal ni regla fiscal.', 'cost': 'Composición por llamada y propiedad todavía necesaria; sin promoción.', 'legalAcceptance': False})
    write('relaciones-232.json.gz', decisions)
    byid = {e['id']: e for e in graph['edges']}
    sites = []
    for s in graph['sites']:
        missing = [i for i in s['edges'] if i not in byid]
        issues = [d['id'] for d in decisions if d['id'] in s['edges'] and d['decision'] == 'requiere-precision']
        issues += ['R26-04: enlaces de entrada son strings no resueltos; el listado directo no certifica cierre transitivo.']
        if s['siteId'] == 'anual.cuota.diferencial':
            issues += ['R26-04: falta raíz directa cuotaDiferencialCentimos/llamada y retencionesSoportadasCentimos en edges; la expresión sí los usa.']
        if s['siteId'] == 'anual.cuota.ahorro-tramo':
            issues += ['R26-04: se adjuntan también ramas publicadas del helper, aunque el productor pasa solo tramos integrados. No son todas alcanzables en este sitio.']
        sites.append({'siteId': s['siteId'], 'source': s['source'], 'roots': s['roots'], 'edgesExamined': s['edges'], 'missingIds': missing, 'decision': 'conservar-candidato-rechazar-cierre-composicion', 'issues': issues, 'objection': 'Una lista no vacía de aristas no acredita rutas completas ni alcanzabilidad.', 'response': 'No se borra la localización histórica y no se publica el cierre.', 'cost': 'Adaptador y contraste posterior por propiedad y condiciones.', 'legalAcceptance': False})
    write('sitios-28.json', sites)
    cells = []
    for c in read('celdas.json.gz'):
        payload = json.loads(Path(c['payload']['path']).read_text())
        cells.append({'id': c['id'], 'occurrenceId': c['occurrenceId'], 'symbol': c['symbol'], 'tablePath': c['tablePath'], 'value': c['value'], 'unit': c['unit'], 'payload': c['payload'], 'payloadKeys': list(payload), 'consumers': c['consumers'], 'downstreamSiteIds': c['downstreamSiteIds'], 'additionalConsumer': c['resolutionR23'].get('additionalConsumer'), 'decision': 'identidad-candidata-conservada-no-promover', 'objection': 'Tabla devuelta y celda nominal no prueban que la fila sea elegida para todo mínimo/base ni habilitan su año/territorio jurídico.', 'response': 'Selección potencial condicionada; se mantienen Q/L, exclusiones y multiplicidad 264/102.', 'cost': 'Revisión de cada caso admitido y corrección del registro conjunto fuera de este lote.', 'legalAcceptance': False})
    assert len(cells) == 264 and len({c['occurrenceId'] for c in cells}) == 102
    write('decisiones-264.json.gz', cells)
    spec = importlib.util.spec_from_file_location('r23_verifier', AUTHOR/'verificar.py')
    assert spec is not None and spec.loader is not None
    validator: Any = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(validator)
    original_read = validator.read
    trials = []
    for kind in ['original', 'quitar-arista', 'cambiar-input', 'cambiar-output-file', 'cambiar-formula', 'sitio-arista-inexistente']:
        mutant = copy.deepcopy(graph)
        if kind == 'quitar-arista':
            mutant['edges'].pop(0)
        elif kind == 'cambiar-input':
            mutant['edges'][0]['inputs'] = ['caso.entradaInexistente']
        elif kind == 'cambiar-output-file':
            mutant['edges'][0]['output']['file'] = 'lib/inexistente.ts'
        elif kind == 'cambiar-formula':
            mutant['edges'][0]['formula'] = 'baseImponibleGeneral * 999'
        elif kind == 'sitio-arista-inexistente':
            mutant['sites'][0]['edges'] = ['arista-inexistente']
        validator.read = lambda name, m=mutant: m if name == 'grafo.json.gz' else original_read(name)
        output = io.StringIO()
        try:
            with contextlib.redirect_stdout(output):
                validator.main()
            accepted = True
            detail = output.getvalue()
        except (AssertionError, ValueError) as error:
            accepted = False
            detail = str(error)
        trials.append({'id': kind, 'accepted': accepted, 'expectedForCompositionGate': kind == 'original', 'protectiveStatus': 'pass' if accepted == (kind == 'original') else 'red', 'observed': detail, 'limit': 'Validador de estructura y localizadores; no se le exige análisis de causalidad general.'})
    write('mutantes-validador.json', trials)
    print(json.dumps({'localizadores':checked,'mutantes':trials},ensure_ascii=False))


if __name__ == '__main__':
    main()
