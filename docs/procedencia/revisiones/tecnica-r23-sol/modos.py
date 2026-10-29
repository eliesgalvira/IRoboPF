"""Contrastar también permisos ejecutables de no enlaces en los dos controles."""
import gzip
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
for name in ('inicial', 'final'):
    with gzip.open(OUT / (name + '.json.gz'), 'rt') as stream:
        control = json.load(stream)
    mismatches = [row['path'] for row in control['files']
                  if row['mode'] != '120000'
                  and bool(int(row['physicalMode'], 8) & 0o111) != (row['mode'] == '100755')]
    assert not mismatches, mismatches
    print(name, control['entries'], 'permisos ejecutables exactos; cero diferencias')
