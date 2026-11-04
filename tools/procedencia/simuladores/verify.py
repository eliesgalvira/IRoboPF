"""Verifica evidencia histórica y recibos v2 sin modificar sus índices."""
import argparse
import json
from pathlib import Path
from evidence import validate_result
from storage import read_jsonl, read_ref, latest_states, canonical, digest


def verify(path, journal=False):
    records = read_jsonl(path)
    if journal:
        records = list(latest_states(records).values())
        if any(row['status'] != 'done' for row in records):
            raise ValueError('Journal con entradas no terminadas')
    rows = []
    for record in records:
        if record.get('status') == 'recovered-tail':
            read_ref(record['artifact'])
            continue
        if 'result' in record:
            identity = record['identity']
            if digest(canonical(identity)) != record['key'] or identity['job'] != record['job']:
                raise ValueError('Identidad del recibo inválida')
            validation = validate_result(record['result'], record['job'], identity['officialPinned'])
            if validation != record['validation']:
                raise ValueError('Dictamen distinto del guardado')
            row = record['result']
        else:
            row = record
            validation = validate_result(row)
        rows.append({'id': row['id'], 'validation': validation})
    if not rows:
        raise ValueError('No hay evidencia que verificar')
    return {'executions': len(rows), 'rows': rows}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('input', type=Path)
    parser.add_argument('--journal', action='store_true')
    args = parser.parse_args()
    print(json.dumps(verify(args.input, args.journal), ensure_ascii=False, indent=2))
