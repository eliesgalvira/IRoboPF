"""Revisión independiente acotada; solo genera controles en el ámbito propio."""

import difflib
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
from typing import Any

ROOT = Path.cwd()
OUT = ROOT / "docs/procedencia/revisiones/clasificacion-censo-r30-sol"
CACHE = ROOT / ".cache/revision-clasificacion-r30"
SOURCE = ROOT / "docs/procedencia/preservacion-v5-sol"
OLD = json.loads(
    (
        ROOT
        / "docs/procedencia/correcciones/recepcion-r27-r28-r30/archivos-precommit.json"
    ).read_bytes()
)["base"]
sys.path.insert(0, str(SOURCE))


def sha(data):
    return hashlib.sha256(data).hexdigest()


def save(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


changes = []
for name in [
    "docs/procedencia/preservacion-v5-sol/recolector.py",
    "tests/test_censo_clasificacion.py",
]:
    proc = subprocess.run(
        ["git", "cat-file", "blob", f"{OLD}:{name}"], capture_output=True, check=False
    )
    before = proc.stdout if proc.returncode == 0 else None
    after = (ROOT / name).read_bytes()
    changes.append(
        {
            "path": name,
            "baseSha256": sha(before) if before else None,
            "sha256": sha(after),
            "baseAbsent": before is None,
        }
    )
    (OUT / (Path(name).name + ".diff")).write_text(
        "".join(
            difflib.unified_diff(
                (before or b"").decode().splitlines(True),
                after.decode().splitlines(True),
                fromfile="anterior/" + name,
                tofile="actual/" + name,
            )
        )
    )
    if before:
        (CACHE / "recolector-anterior.py").write_bytes(before)
save("diff-revisado.json", {"base": OLD, "files": changes})
old = load(CACHE / "recolector-anterior.py", "historico")
new = load(SOURCE / "recolector.py", "actual")
url = "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764"
archive = "https://web.archive.org/web/20150101000000id_/http://www.agenciatributaria.es/static_files/AEAT/algoritmo.pdf"
cases: list[dict[str, Any]] = []


def case(
    ident,
    key,
    expected,
    *,
    pointer="/citations/0",
    row=None,
    name="datos.json",
    reason="contrato tipado",
):
    row = {"url": url} if row is None else row
    previous = old.classify(name, pointer, row, key)[0]
    current = new.classify(name, pointer, row, key)[0]
    cases.append(
        {
            "id": ident,
            "key": key,
            "pointer": pointer,
            "row": row,
            "name": name,
            "expected": expected,
            "previous": previous,
            "actual": current,
            "pass": current in expected,
            "reason": reason,
        }
    )


case("seleccion-url", "selectionSha256", ["seleccion-cita"])
case("cita-url", "citationHash", ["seleccion-cita"])
case("selector-sin-url", "selectorSha256", ["seleccion-cita"], row={})
case("seleccion-normalizada", "SELECTION_SHA256", ["seleccion-cita"])
case("texto-url", "quoteSha256", ["texto-extraido"])
case("texto-extraido", "extractedTextHash", ["texto-extraido"])
case("software-url", "softwareHash", ["fuente-software"])
case(
    "codigo-real",
    "sourceSha256",
    ["fuente-software"],
    row={"path": "lib/rentas.ts"},
    pointer="/sources/0",
    reason="La ruta identifica código; source por sí solo no basta",
)
case("documento-url", "documentSha256", ["original-oficial"])
case("adquisicion", "sha256", ["original-oficial"], pointer="/acquisitions/0")
case(
    "captura-secundaria",
    "sha256",
    ["captura-secundaria-URL-oficial"],
    row={"url": archive},
)
case("facsímil", "cropSha256", ["facsimil-receta"])
case("fixture", "documentSha256", ["fixture-sintetico"], name="fixtures/datos.json")
case("desconocido-url", "unknownSha256", ["desconocido"])
case("documento-sin-url", "documentSha256", ["desconocido-documental"], row={})
case(
    "seleccion-en-original",
    "selectionSha256",
    ["seleccion-cita"],
    pointer="/original/0",
)
case("texto-en-receta", "textSha256", ["texto-extraido"], pointer="/recetas/0")
case(
    "documento-en-facsimil",
    "documentSha256",
    ["original-oficial", "desconocido-documental", "desconocido"],
    pointer="/facsimiles/0",
    reason="Campo explícito refiere documento del recorte; ancestro no debe reasignar sus bytes al PNG",
)
case(
    "origen-documental",
    "sourceSha256",
    [
        "desconocido-documental",
        "original-oficial",
        "desconocido",
        "metadatos-adquisicion",
    ],
    row={"url": url, "mimeType": "application/pdf", "path": "fuentes/original.pdf"},
    reason="Origen documental explícito; no fuente de código",
)
case(
    "origen-indeterminado",
    "sourceSha256",
    ["desconocido", "desconocido-documental", "metadatos-adquisicion"],
    row={},
    reason="Sin tipo/path no hay evidencia para afirmar software",
)
case(
    "texto-en-fixture", "textSha256", ["fixture-sintetico"], name="fixtures/texto.json"
)
case("seleccion-en-receta", "selectionHash", ["seleccion-cita"], pointer="/recetas/0")
real_name = "docs/procedencia/editorial/flujo-rentas-r21-sol/entradas-editoriales.json"
real = json.loads((ROOT / real_name).read_bytes())
real_rows = []
for module in [old, new]:
    found = {r["pointer"]: r for r in module.observations(real, real_name)}
    real_rows.append(
        {
            k: found[k]
            for k in ["/citations/0/selectionSha256", "/citations/0/documentSha256"]
        }
    )
save(
    "caso-real.json",
    {
        "previous": real_rows[0],
        "actual": real_rows[1],
        "historicalRedReproduced": real_rows[0]["/citations/0/selectionSha256"]["kind"]
        == "original-oficial",
        "currentSelectionCorrect": real_rows[1]["/citations/0/selectionSha256"]["kind"]
        == "seleccion-cita",
    },
)
save(
    "casos.json",
    {
        "cases": cases,
        "failures": [c["id"] for c in cases if not c["pass"]],
        "acceptanceFiscal": False,
    },
)
# Caso de corpus: sourceSha256 de un derivado de evidencia es el origen, no código.
name = "docs/procedencia/editorial/flujo-escalas-r21-sol/verificacion.json"
corpus = json.loads((ROOT / name).read_bytes())
save(
    "semantica-source.json",
    {
        "path": name,
        "value": corpus,
        "producer": "docs/procedencia/editorial/flujo-escalas-r21-sol/verificar.py",
        "collectorProducer": "docs/procedencia/preservacion-v5-sol/recolector.py:dep",
        "observation": "sourceSha256 en dep se calcula sobre path arbitrario antes del saneamiento; la clase de los bytes depende de path y contrato, no de source",
    },
)
# Ejecutar prueba del padre con recolector anterior, sin alterar sus bytes/imports.
for label, module in [("antes", old), ("actual", new)]:
    test = load(ROOT / "tests/test_censo_clasificacion.py", "test_" + label)
    test.COLLECTOR = module
    import unittest

    with (OUT / ("pruebas-padre-" + label + ".log")).open("w") as stream:
        result = unittest.TextTestRunner(stream=stream, verbosity=2).run(
            unittest.defaultTestLoader.loadTestsFromModule(test)
        )
    save(
        "pruebas-padre-" + label + ".json",
        {
            "tests": result.testsRun,
            "failures": len(result.failures),
            "errors": len(result.errors),
            "exit": 0 if result.wasSuccessful() else 1,
            "adaptation": "solo inyección de COLLECTOR importado desde bytes exactos; esperados intactos",
        },
    )
print(
    json.dumps(
        {"cases": len(cases), "failures": [c["id"] for c in cases if not c["pass"]]}
    )
)
raise SystemExit(1 if any(not c["pass"] for c in cases) else 0)
