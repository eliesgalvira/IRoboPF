"""Ejecuta el motor real y compara evidencia fijada; nunca abre red/navegador."""
import argparse
import copy
import json
import subprocess
from pathlib import Path
from binding import bind
from compare_engine import compare_engine
from contract import MAP, parse, monetary
from config import SOURCE, external_directory, executable
from evidence import validate_result, verify_pdf
from storage import canonical, digest, read_jsonl, read_ref


def select_input(data, references):
    # Reutilizar una entrada COMPLETA solo tras cotejar todos los importes,
    # edad, territorio y modalidad; nunca elegir por id/año.
    for reference in references:
        try:
            bind(data, reference['entrada'])
        except (ValueError, KeyError):
            continue
        return copy.deepcopy(reference['entrada'])
    fields = parse(data, 2025)['fields']
    entry = copy.deepcopy(references[3]['entrada'])
    r = entry['trabajo']['rendimientos'][0]
    for field in ('IDII', 'GSS', 'IDRE'):
        if fields.get(field) is None:
            raise ValueError('Entrada desconocida: ' + field)
    r['integro'] = fields['IDII']
    r['cotizaciones']['seguridadSocial'] = fields['GSS']
    entry['retenciones'][0]['importe'] = fields['IDRE']
    for field, key in [('GCS', 'sindicato'), ('GCC', 'colegio'), ('GDJ', 'defensa')]:
        if fields.get(field) is not None:
            r[key]['importe'] = fields[field]
    return entry


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--references', required=True, type=Path)
    parser.add_argument('--originals', type=Path)
    parser.add_argument('--receipts', action='append', default=[], type=Path)
    args = parser.parse_args()
    out = external_directory(args.output, '--output')
    out.mkdir(parents=True, exist_ok=True)
    refs = json.loads(args.references.read_text())
    entries = [r['entrada'] for r in refs]
    work = [('referencia', r, i) for i, r in enumerate(refs)]
    historic = []
    for path in args.receipts:
        for receipt in read_jsonl(path):
            row = receipt.get('result', receipt)
            checked = validate_result(row)
            if checked['metadata']['year'] != 2025:
                historic.append({'id': row['id'], 'year': checked['metadata']['year'], 'state': 'fuera-perfil-actual'})
                continue
            # Solo generar candidato desde hechos monetarios efectivamente observados.
            # Los demás hechos copiados de la referencia siguen declarados/pendientes.
            entry = select_input(read_ref(row['ses']), refs)
            # Si se vinculó una referencia de varios pagadores se conservan
            # íntegros su desglose y gastos efectivos.
            index = len(entries)
            entries.append(entry)
            work.append(('captura', row, index))
    input_path = out / 'inputs.json'
    input_path.write_bytes(canonical(entries))
    # Guardia externa: antes de arrancar Bun, y después de que termine.
    guard = {str(p.relative_to(SOURCE)): digest(p.read_bytes()) for p in SOURCE.rglob('*') if p.is_file() and '__pycache__' not in str(p)}
    process = subprocess.run([executable('C_BUN', 'bun'), str(SOURCE / 'engine.mjs'), str(input_path)], capture_output=True, timeout=240)
    (out / 'engine.json').write_bytes(process.stdout)
    (out / 'engine.stderr').write_bytes(process.stderr)
    if process.returncode != 0: raise ValueError('Operador real rechazado; consulte engine.json/stderr')
    if guard != {str(p.relative_to(SOURCE)): digest(p.read_bytes()) for p in SOURCE.rglob('*') if p.is_file() and '__pycache__' not in str(p)}:
        raise ValueError('Código cambiado durante operador')
    engine = json.loads(process.stdout)
    results, seen = [], set()
    for kind, official, index in work:
        motor = engine['results'][index]
        if motor['state'] != 'calculado': raise ValueError('Rechazo motor')
        if kind == 'referencia':
            fields = {MAP[box]: value for box, value in official['casillas'].items()}
            data = None
            if args.originals:
                # Buscar por hash, nunca casar solo por nombre.
                matches = [p for p in args.originals.glob('*.ses') if digest(p.read_bytes()) == official['sha256']['ses']]
                if len(matches) == 1:
                    data = matches[0].read_bytes()
                    parsed = parse(data, 2025)['fields']
                    pdfs = [p for p in args.originals.glob('*.pdf') if digest(p.read_bytes()) == official['sha256']['pdf']]
                    if len(pdfs) != 1: raise ValueError('PDF referencia no disponible por hash')
                    verify_pdf(pdfs[0].read_bytes(), parsed, 2025)
                    if any(value is not None and parsed.get(MAP[box]) != value and monetary(parsed.get(MAP[box])) != monetary(value) for box, value in official['casillas'].items()):
                        raise ValueError('Referencia transcrita distinta del SES')
        else:
            data = read_ref(official['ses'])
            fields = parse(data, 2025)['fields']
        boxes = compare_engine({'fields': fields}, motor)
        try:
            binding = bind(data, motor['entrada']) if data else {'state': 'incompleto', 'pending': ['original-no-disponible']}
        except (ValueError, KeyError) as error:
            binding = {'state': 'rechazado', 'reason': str(error)}
        identity = digest(canonical(motor['entrada']))
        # Distinguir misma entrada física, aunque procedencia/id difieran.
        entry = motor['entrada']
        rs = entry['trabajo']['rendimientos']
        physical = {k: str(sum(monetary(r[k]) for r in rs).normalize()) for k in ('integro',)}
        physical['cotizaciones'] = str(sum(monetary(r['cotizaciones'][k]) for r in rs for k in ('seguridadSocial', 'derechosPasivos', 'colegiosHuerfanos')).normalize())
        physical['retenciones'] = str(sum(monetary(r['importe']) for r in entry['retenciones']).normalize())
        for k in ('sindicato', 'colegio', 'defensa'):
            physical[k] = str(sum(monetary(r[k]['importe']) for r in rs).normalize())
        physical['hechos'] = {k: v for k, v in entry.items() if k not in ('trabajo', 'retenciones', 'conciliacion')}
        physical_key = digest(canonical(physical))
        duplicate = physical_key in seen
        seen.add(physical_key)
        results.append({'kind': kind, 'id': official['id'], 'inputSha256': identity, 'duplicateInput': duplicate,
                        'binding': binding, 'boxes': boxes,
                        'counts': {state: sum(b['status'] == state for b in boxes.values()) for state in ('coincide', 'difiere', 'oficial-ausente', 'motor-no-proyectado')}})
    report = {'state': 'incompleto', 'scope': 'cotejo monetario condicionado; no aceptación fiscal', 'historical': historic, 'results': results,
              'counts': {'rows': len(results), 'historical': len(historic), 'distinctInputs': len(seen), 'duplicateInputs': sum(r['duplicateInput'] for r in results),
                         **{k: sum(r['counts'][k] for r in results) for k in ('coincide', 'difiere', 'oficial-ausente', 'motor-no-proyectado')}}}
    (out / 'comparison.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(report['counts']))
    return 1 if report['counts']['difiere'] else 2


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (ValueError, KeyError, OSError, subprocess.SubprocessError) as error:
        print(json.dumps({'state': 'incompleto', 'reason': str(error)}))
        raise SystemExit(2)
