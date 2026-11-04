"""CAS íntegro y journal recuperable; la ejecución se serializa con flock."""
import hashlib
import json
import os
import re
import tempfile
from pathlib import Path


def digest(data):
    return hashlib.sha256(data).hexdigest()


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()


def read_ref(ref):
    if not isinstance(ref, dict) or not re.fullmatch('[0-9a-f]{64}', ref.get('sha256', '')):
        raise ValueError('Referencia CAS sin hash válido')
    if type(ref.get('bytes')) is not int or not 0 <= ref['bytes'] <= 128 * 1024 * 1024:
        raise ValueError('Tamaño CAS inválido')
    path = Path(ref['path'])
    if path.is_symlink() or not path.is_file() or path.stat().st_size != ref['bytes']:
        raise ValueError('Objeto CAS ausente, enlazado o con tamaño distinto')
    data = path.read_bytes()
    if digest(data) != ref['sha256']:
        raise ValueError('Objeto CAS corrupto')
    return data


def put_blob(store, data):
    store = Path(store)
    store.mkdir(parents=True, exist_ok=True)
    target = store / digest(data)
    ref = {'path': str(target), 'sha256': target.name, 'bytes': len(data)}
    if not target.exists():
        # link publica el archivo completo sin reemplazar un objeto concurrente.
        with tempfile.NamedTemporaryFile(dir=store, prefix='.pending-') as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
            try:
                os.link(stream.name, target)
            except FileExistsError:
                pass
            directory = os.open(store, os.O_RDONLY | os.O_DIRECTORY)
            try:
                os.fsync(directory)
            finally:
                os.close(directory)
    read_ref(ref)
    return ref


def append_jsonl(path, record):
    data = canonical(record) + b'\n'
    with Path(path).open('ab') as stream:
        stream.write(data)
        stream.flush()
        os.fsync(stream.fileno())
    directory = os.open(Path(path).parent, os.O_RDONLY | os.O_DIRECTORY)
    try:
        os.fsync(directory)
    finally:
        os.close(directory)


def read_jsonl(path, repair_tail=False, closed_snapshot=False):
    if repair_tail and closed_snapshot:
        raise ValueError('Un corte de lectura no puede reparar el journal')
    path = Path(path)
    if not path.exists():
        return []
    if closed_snapshot:
        # Longitud fijada al abrir: no incluye escrituras posteriores ni el
        # último registro sin salto de línea, aunque ya sea JSON válido.
        with path.open('rb') as stream:
            raw = stream.read(os.fstat(stream.fileno()).st_size)
        raw = raw[:raw.rfind(b'\n') + 1]
    else:
        raw = path.read_bytes()
    records, offset = [], 0
    for index, line in enumerate(raw.splitlines(keepends=True)):
        try:
            record = json.loads(line)
        except (ValueError, UnicodeDecodeError):
            last_unterminated = offset + len(line) == len(raw) and not line.endswith(b'\n')
            if not repair_tail or not last_unterminated:
                raise ValueError('Corrupción del journal en línea ' + str(index + 1))
            suffix = put_blob(path.parent / 'interrupted-records', line)
            with path.open('r+b') as stream:
                stream.truncate(offset)
                stream.flush()
                os.fsync(stream.fileno())
            event = {'status': 'recovered-tail', 'artifact': suffix, 'offset': offset}
            append_jsonl(path, event)
            records.append(event)
            return records
        if not isinstance(record, dict):
            raise ValueError('Registro JSONL no es objeto')
        records.append(record)
        offset += len(line)
    if raw and not raw.endswith(b'\n') and repair_tail:
        with path.open('ab') as stream:
            stream.write(b'\n')
            stream.flush()
            os.fsync(stream.fileno())
    return records


def latest_states(records):
    latest = {}
    for record in records:
        if record.get('status') == 'recovered-tail':
            read_ref(record['artifact'])
            continue
        if record.get('status') not in ('started', 'done', 'error') or not re.fullmatch('[0-9a-f]{64}', record.get('key', '')):
            raise ValueError('Estado o identidad del journal inválidos')
        latest[record['key']] = record
    return latest
