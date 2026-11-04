"""Comparación escalar acotada; incompleto tiene salida distinta de aceptación."""
import argparse
import json
import re
from pathlib import Path
from contract import MAP, monetary
from evidence import validate_result

SCALARS = {'0023': 'reduccionArt20', '0025': 'rendimientoNetoReducido',
           '0500': 'baseImponibleGeneral', '0505': 'baseLiquidableGeneral',
           '0414': 'deduccionTrabajo', '0595': 'cuotaPosterior',
           '0610': 'cuotaDiferencial', '0670': 'cuotaDiferencialPresentada',
           '0528': 'gravamenEstatal', '0529': 'gravamenAutonomico',
           '0530': 'gravamenMinimoEstatal', '0531': 'gravamenMinimoAutonomico',
           '0532': 'cuotaEstatal', '0533': 'cuotaAutonomica'}
REQUIRED = set(SCALARS) - {'0023', '0414'}
PROFILE = 'open-2025-madrid-empleo-escalares-v2'


def compare_engine(official, engine):
    if not isinstance(official, dict) or not isinstance(engine, dict):
        raise ValueError('Entradas de comparación no son objetos')
    fields, money = official.get('fields', {}), engine.get('monetario', {})
    if not isinstance(fields, dict) or not isinstance(money, dict):
        raise ValueError('Campos monetarios no son objetos')
    for key in MAP.values():
        monetary(fields.get(key))
    for value in money.values():
        if value is None:
            raise ValueError('El motor debe omitir un dato ausente, no enviarlo como null')
        monetary(value)
    rows = {}
    for box, key in MAP.items():
        expected, name = fields.get(key), SCALARS.get(box)
        actual = money.get(name)
        status = ('motor-no-proyectado' if name is None or name not in money
                  else 'oficial-ausente' if expected is None
                  else 'coincide' if monetary(expected) == monetary(actual) else 'difiere')
        rows[box] = {'official': expected, 'engine': actual, 'status': status}
    return rows


def assess(official, engine):
    rows = compare_engine(official, engine)
    reasons = ["Contrato escalar sin acreditación de vínculo fiscal ni ejecución verificable; use offline.py"]
    try:
        verified = validate_result(official)
    except (KeyError, ValueError, OSError) as error:
        verified = None
        reasons.append('Evidencia oficial no válida: ' + str(error))
    motor = engine.get('motor', {})
    if not isinstance(motor, dict):
        raise ValueError('Identidad del motor no es objeto')
    if (verified is None or verified['metadata']['year'] != 2025
            or engine.get('ejercicio') != 2025 or engine.get('perfil') != PROFILE
            or not official.get('id') or engine.get('id') != official.get('id')
            or not re.fullmatch('[0-9a-f]{40}', str(motor.get('commit', '')))
            or not re.fullmatch('[0-9a-f]{64}', str(motor.get('sourcesSha256', '')))):
        reasons.append('Identidad, ejercicio o perfil de comparación incompleto')
    required = REQUIRED | {box for box in ('0023', '0414') if rows[box]['official'] is not None}
    missing = sorted(box for box in required if rows[box]['status'] not in ('coincide', 'difiere'))
    if missing:
        reasons.append('Casillas obligatorias sin comparación: ' + ', '.join(missing))
    different = sum(row['status'] == 'difiere' for row in rows.values())
    equal = sum(row['status'] == 'coincide' for row in rows.values())
    state = 'discrepante' if different else 'incompleto' if reasons else 'completo-escalar'
    return {'profile': PROFILE, 'state': state, 'counts': {'equal': equal, 'different': different,
            'required': len(required), 'missingRequired': len(missing)}, 'reasons': reasons, 'boxes': rows,
            'unprojectedComponents': sorted(set(MAP) - set(SCALARS))}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('official')
    parser.add_argument('engine')
    args = parser.parse_args()
    try:
        result = assess(json.loads(Path(args.official).read_text()), json.loads(Path(args.engine).read_text()))
    except (ValueError, KeyError, OSError) as error:
        result = {'state': 'incompleto', 'reasons': [str(error)]}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit({'completo-escalar': 0, 'discrepante': 1, 'incompleto': 2}[result['state']])
