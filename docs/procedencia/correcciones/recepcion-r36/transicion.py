"""Procedimiento serial local: recuperar solo extremos conocidos por hash."""
import base64
import hashlib
import json
import os
import stat
import uuid
from pathlib import Path

ALLOWED = {
    "docs/procedencia/enlaces/registro.json",
    "docs/procedencia/enlaces/revisores.json",
}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def ordinary(root, relative):
    if not root.is_absolute() or root.resolve() != root:
        raise ValueError("Raíz no ordinaria")
    current = root
    for part in Path(relative).parts:
        if part in ("..", "."):
            raise ValueError("Ruta inválida")
        current /= part
        mode = current.lstat().st_mode
        if stat.S_ISLNK(mode):
            raise ValueError("Enlace no permitido")
    info = current.stat()
    if not stat.S_ISREG(info.st_mode) or info.st_nlink != 1:
        raise ValueError("Destino no ordinario o enlazado")
    return current


def durable_replace(path, data):
    temporary = path.parent / (path.name + ".r36-" + uuid.uuid4().hex + ".tmp")
    with temporary.open("xb") as stream:
        stream.write(data)
        stream.flush()
        os.fsync(stream.fileno())
    os.replace(temporary, path)
    descriptor = os.open(path.parent, os.O_RDONLY | os.O_DIRECTORY)
    try:
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


def transition(root, plan, target, journal, fail_after=None):
    """El llamante fija plan/hashes y serializa con flock. No hay atomicidad dual."""
    if target not in ("before", "after"):
        raise ValueError("Extremo desconocido")
    rows = plan["files"]
    if len(rows) != 2 or {row["path"] for row in rows} != ALLOWED:
        raise ValueError("Ámbito distinto del lote revisado")
    actions = []
    for row in rows:
        before = base64.b64decode(row["before"], validate=True)
        after = base64.b64decode(row["after"], validate=True)
        if digest(before) != row["baseSha256"] or digest(after) != row["sha256"]:
            raise ValueError("Bytes del plan distintos del pin")
        path = ordinary(root, row["path"])
        current = digest(path.read_bytes())
        if current not in (row["baseSha256"], row["sha256"]):
            raise ValueError("Estado desconocido; no sobrescribir")
        actions.append((path, before if target == "before" else after, current))
    # Un fallo posterior deja plan y extremos íntegros, antes de la primera escritura.
    journal.mkdir(parents=True, exist_ok=True)
    attempt = journal / (uuid.uuid4().hex + ".json")
    record = {"target": target, "root": str(root), "plan": plan,
              "prestates": [item[2] for item in actions], "complete": False}
    durable_replace(attempt, (json.dumps(record, indent=2) + "\n").encode())
    for index, (path, data, _) in enumerate(actions, 1):
        if digest(path.read_bytes()) not in {
            plan["files"][index - 1]["baseSha256"],
            plan["files"][index - 1]["sha256"],
        }:
            raise ValueError("Cambio concurrente; detener")
        ordinary(root, plan["files"][index - 1]["path"])
        durable_replace(path, data)
        if fail_after == index:
            raise OSError("Fallo inyectado después de escritura " + str(index))
    record["complete"] = True
    record["finalHashes"] = [digest(path.read_bytes()) for path, _, _ in actions]
    if record["finalHashes"] != [digest(data) for _, data, _ in actions]:
        raise ValueError("Comprobación posterior distinta")
    durable_replace(attempt, (json.dumps(record, indent=2) + "\n").encode())
    return {"attempt": str(attempt), "target": target,
            "finalHashes": record["finalHashes"], "complete": True}
