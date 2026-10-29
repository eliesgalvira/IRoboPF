"""Sondas independientes: solo salidas propias, sin recolección ni publicación."""

import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import unittest
from typing import Any

ROOT = Path.cwd()
OUT = ROOT / "docs/procedencia/revisiones/origen-documental-r31-sol"
CACHE = ROOT / ".cache/revision-origen-r31"
sys.path.insert(0, str(ROOT / "docs/procedencia/preservacion-v5-sol"))
sys.path.insert(0, str(ROOT / "tests"))


def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def save(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


old = load(CACHE / "recolector-antes.py", "antes")
new = load(ROOT / "docs/procedencia/preservacion-v5-sol/recolector.py", "actual")
received = json.loads(
    (
        ROOT / "docs/procedencia/revisiones/clasificacion-censo-r30-sol/casos.json"
    ).read_bytes()
)["cases"]
historical = []
for row in received:
    before = old.classify(row["name"], row["pointer"], row["row"], row["key"])
    after = new.classify(row["name"], row["pointer"], row["row"], row["key"])
    historical.append(
        {
            **row,
            "beforeExact": before,
            "afterExact": after,
            "beforePass": before[0] in row["expected"],
            "afterPass": after[0] in row["expected"],
        }
    )
save("historicos.json", historical)
url = "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764"
cases = []


def case(
    ident, row, expected, key="sourceSha256", pointer="/citations/0", name="datos.json"
):
    before = old.classify(name, pointer, row, key)
    after = new.classify(name, pointer, row, key)
    emitted = list(new.observations({**row, key: "a" * 64}, name, pointer))
    cases.append(
        {
            "id": ident,
            "row": row,
            "key": key,
            "pointer": pointer,
            "name": name,
            "expected": expected,
            "before": before,
            "after": after,
            "pass": after[0] == expected,
            "observations": emitted,
        }
    )


for alias in ["source", "sourcePath", "sourceFile"]:
    case(
        alias + "-documento-destino-ts",
        {alias: "fuentes/entrada.pdf", "path": "lib/salida.ts"},
        "desconocido-documental",
    )
    case(
        alias + "-software-destino-pdf",
        {alias: "lib/entrada.ts", "path": "salida.pdf"},
        "fuente-software",
    )
    invalid_values: list[Any] = [None, 0, [], {}, "", True]
    for value in invalid_values:
        case(
            alias + "-invalido-" + repr(value),
            {alias: value, "path": "lib/salida.ts"},
            "desconocido",
        )
case("ausencia", {}, "desconocido")
case("fallback-destino", {"path": "lib/salida.ts"}, "fuente-software")
case(
    "alias-iguales",
    {"source": "lib/a.ts", "sourcePath": "lib/a.ts", "sourceFile": "lib/a.ts"},
    "fuente-software",
)
case("alias-conflicto", {"source": "lib/a.ts", "sourcePath": "lib/b.ts"}, "desconocido")
for path in [
    "/tmp/a.ts",
    "../a.ts",
    "x/../a.ts",
    "C:\\a.ts",
    "https://host/a.ts",
    "file://a.ts",
    "x\\a.ts",
    "a.ts?download=1",
    "a.ts#x",
    "a.ts\n",
]:
    case("ruta-" + repr(path), {"source": path}, "desconocido")
for ext in ["ts", "tsx", "js", "mjs", "cjs", "py", "rs", "sh", "TS"]:
    case("extension-" + ext, {"source": "src/entrada." + ext}, "fuente-software")
for ext in ["json", "txt", "html", "png", "zip", "wasm", "jsx"]:
    case("extension-no-admitida-" + ext, {"source": "entrada." + ext}, "desconocido")
for mime, expected in [
    ("text/plain; charset=utf-8", "fuente-software"),
    ("APPLICATION/PDF", "desconocido"),
    ("application/javascript", "desconocido"),
    (None, "desconocido"),
]:
    case("mime-" + repr(mime), {"source": "src/a.ts", "sourceMimeType": mime}, expected)
case(
    "mime-origen-prevalece",
    {
        "source": "src/a.ts",
        "sourceMimeType": "text/plain",
        "mimeType": "application/pdf",
    },
    "fuente-software",
)
case(
    "pdf-origen-resultado-codigo",
    {
        "source": "entrada.pdf",
        "sourceMimeType": "application/pdf",
        "mimeType": "text/plain",
        "path": "resultado.ts",
    },
    "desconocido-documental",
)
case(
    "mime-resultado-sin-origen",
    {"source": "src/a.ts", "mimeType": "application/pdf"},
    "desconocido",
)
case(
    "pdf-tipo-incompatible",
    {"source": "entrada.pdf", "mimeType": "text/plain"},
    "desconocido",
)
case(
    "pdf-url-no-autentica",
    {"source": "entrada.pdf", "url": url},
    "desconocido-documental",
)
case("hash-origen-normalizado", {}, "desconocido", key="SOURCE_HASH")
case("resource-no-source", {"url": url}, "desconocido", key="resourceSha256")
case(
    "source-no-exacto", {"source": "src/a.ts"}, "desconocido", key="sourceContentSha256"
)
for key in ["documentSha256", "originalHash"]:
    case(
        "documental-recorte-" + key,
        {"url": url},
        "original-oficial",
        key=key,
        pointer="/facsimiles/0",
    )
    case(
        "documental-sin-url-" + key,
        {},
        "desconocido-documental",
        key=key,
        pointer="/facsimiles/0",
    )
case(
    "sourceDocument-recorte",
    {"url": url},
    "desconocido-documental",
    key="sourceDocumentSha256",
    pointer="/facsimiles/0",
)
case(
    "generico-recorte-url",
    {"url": url},
    "facsimil-receta",
    key="sha256",
    pointer="/facsimiles/0",
)
case(
    "generico-url-contrato-adquisicion", {"url": url}, "original-oficial", key="sha256"
)
for key, expected in [
    ("selectionSha256", "seleccion-cita"),
    ("quoteHash", "texto-extraido"),
    ("softwareHash", "fuente-software"),
]:
    case("regresion-" + key, {"url": url}, expected, key=key, pointer="/facsimiles/0")
case(
    "fixture-prevalece",
    {"source": "src/a.ts"},
    "fixture-sintetico",
    name="fixtures/entrada.json",
)
case(
    "contexto-limpio",
    {
        "source": "/home/sintetico/a.ts",
        "sourcePath": "/tmp/sintetico/a.ts",
        "sourceFile": "file:///tmp/a.ts",
        "sourceMimeType": "text/plain",
        "path": "lib/destino.ts",
        "url": "https://example.invalid/?token=sintetico",
    },
    "desconocido",
)
# Los residuales son sintéticos; no se incorporan localizadores personales.
case("residual-prosa", {"source": "nota /home/sintetico/a.ts"}, "fuente-software")
case("residual-FILE", {"source": "FILE:///tmp/a.ts"}, "desconocido")
save("casos-propios.json", cases)
editorial = json.loads(
    (
        ROOT / "docs/procedencia/editorial/flujo-escalas-r21-sol/verificacion.json"
    ).read_bytes()
)["editions"]
editorial_results = []
for row in editorial:
    raw = (ROOT / row["source"]).read_bytes()
    assert hashlib.sha256(raw).hexdigest() == row["sourceSha256"]
    json.loads(raw)
    editorial_results.append(
        {
            "reference": row,
            "sourceBytes": {
                "sha256": hashlib.sha256(raw).hexdigest(),
                "sha512": hashlib.sha512(raw).hexdigest(),
                "size": len(raw),
                "parsed": "JSON",
            },
            "before": old.classify("datos.json", "/editions/0", row, "sourceSha256"),
            "after": new.classify("datos.json", "/editions/0", row, "sourceSha256"),
        }
    )
save("editoriales.json", editorial_results)
for label, module in [("antes", old), ("despues", new)]:
    test = load(ROOT / "tests/test_censo_origen.py", "test_" + label)
    test.COLLECTOR = module
    with (OUT / ("padre-" + label + ".log")).open("w") as stream:
        result = unittest.TextTestRunner(stream=stream, verbosity=2).run(
            unittest.defaultTestLoader.loadTestsFromModule(test)
        )
    save(
        "padre-" + label + ".json",
        {
            "tests": result.testsRun,
            "failures": len(result.failures),
            "errors": len(result.errors),
            "exit": int(not result.wasSuccessful()),
            "adaptation": "solo COLLECTOR; aserciones originales intactas",
        },
    )
summary = {
    "historical": len(historical),
    "beforeRed": [r["id"] for r in historical if not r["beforePass"]],
    "afterRed": [r["id"] for r in historical if not r["afterPass"]],
    "ownCases": len(cases),
    "ownFailures": [r["id"] for r in cases if not r["pass"]],
    "editorial": len(editorial_results),
    "fiscalAcceptance": False,
    "parentContrastRequired": True,
}
save("resultados.json", summary)
print(json.dumps(summary))
assert not summary["afterRed"] and not summary["ownFailures"]
