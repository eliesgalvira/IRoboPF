"""Contraste documental fijo, sin admisión fiscal ni escrituras fuera de esta carpeta."""

import copy
import hashlib
import importlib.util
import json
import subprocess
import sys
from decimal import Decimal
from pathlib import Path

import fitz

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
AUTHOR = ROOT / "docs/procedencia/revisiones/retenciones-2012-2014-sol"
PRIOR = ROOT / "docs/procedencia/revisiones/retenciones-2012-2014-contraste-sol"
EDITION = ROOT / "docs/procedencia/correcciones/retenciones-2012-2014-r23"


def read(path):
    return json.loads(path.read_text())


def write(name, data):
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    edits = read(EDITION / "ajustes.json")
    for source in edits["sources"] + [edits["independentReview"]]:
        assert digest((ROOT / source["path"]).read_bytes()) == source["sha256"]
    corrections = {x["id"]: x for x in edits["corrections"]}
    assert len(corrections) == 12
    decisions = []
    composition = {}
    residues = []
    for name, count in [("matriz-80.json", 80), ("ramas-44.json", 44)]:
        rows = read(AUTHOR / name)
        assert len(rows) == len({x["id"] for x in rows}) == count
        actual = []
        for before in rows:
            key = before["id"]
            edit = corrections.get(key)
            after = copy.deepcopy(before) if edit is None else edit["replacement"]
            if edit:
                assert edit["source"] == name and after["id"] == key
                decisions.append(
                    {
                        "id": key,
                        "reason": edit["reason"],
                        "dictamen": "rectificación visual parcial corroborada"
                        if edit["reason"] == "C01"
                        else "techo y precedencia corroborados solo en dominio excluyente",
                        "objecion": "El recorte no valida otros auxiliares."
                        if edit["reason"] == "C01"
                        else "La guarda aislada no prueba admisión, vigencia ni composición íntegra.",
                        "respuesta": "Signos vistos personalmente; índices y prefijos conservados."
                        if edit["reason"] == "C01"
                        else "Primaria de 2010; mínimo compatible, evento único y exclusiones prevalentes.",
                        "coste": "SOL-03 restante abierto."
                        if edit["reason"] == "C01"
                        else "Sin nómina utilizable ni concurrencias; calificación externa necesaria.",
                        "completeRuleAcceptance": False,
                    }
                )
            assert after["aceptacion"] is False
            actual.append(after)
            if any(
                x in json.dumps(after, ensure_ascii=False)
                for x in [
                    "excluye87.5",
                    "Excluye87.5",
                    "revisar87.5",
                    "reaplicar mínimos",
                    "regularizacion-resultados",
                ]
            ):
                residues.append(
                    {
                        "id": key,
                        "row": after,
                        "dictamen": "Leer con adenda prevalente; ni filtro jurídico por causaPDF ni expectativa integral actualizada.",
                    }
                )
        composition[name] = actual
    write(
        "superposicion.json",
        {
            "effective": composition,
            "changes": [
                {
                    "id": x["id"],
                    "before": next(
                        r for r in read(AUTHOR / x["source"]) if r["id"] == x["id"]
                    ),
                    "after": x["replacement"],
                }
                for x in edits["corrections"]
            ],
            "completeRuleAcceptance": False,
        },
    )
    write("dictamen-12.json", decisions)
    write("residuos.json", residues)
    (OUT / "contrato-compuesto.txt").write_text(
        "DERIVADO DE LECTURA. ADENDA R23 PREVALECE; ORIGINAL HISTÓRICO CONSERVADO.\n\n"
        + (EDITION / "CONTRATO.md").read_text()
        + "\n\n--- CONTRATO HISTÓRICO SUBORDINADO ---\n"
        + (AUTHOR / "CONTRATO-CANDIDATO.md").read_text()
    )
    evidence = read(EDITION / "evidencia.json")
    checked = []
    for item in evidence["algorithmCrops"] + evidence["primary"]:
        source = item.get("document", item.get("source"))
        raw = Path(source["path"]).read_bytes()
        assert digest(raw) == source["sha256"]
        assert (
            hashlib.sha512(raw).hexdigest() == source["sha512"]
            and len(raw) == source["size"]
        )
        with fitz.open(stream=raw, filetype="pdf") as doc:
            citation = item.get("citation")
            number = item["page"] if citation is None else citation["page"]
            page = doc[number - 1]
            if citation is None:
                text = page.get_textbox(fitz.Rect(*item["bbox"]))
                assert text == item["quote"]
                png = page.get_pixmap(
                    matrix=fitz.Matrix(2, 2), clip=fitz.Rect(*item["bbox"]), alpha=False
                ).tobytes("png")
            else:
                text = page.get_text()
                assert text == citation["text"]
                png = page.get_pixmap(dpi=110, alpha=False).tobytes("png")
            assert png == (ROOT / item["facsimile"]["path"]).read_bytes()
            assert digest(png) == item["facsimile"]["sha256"]
            checked.append(
                {
                    "source": source,
                    "page": number,
                    "quote": text,
                    "facsimile": item["facsimile"],
                    "reproduced": True,
                    "visualInspectionPersonal": True,
                    "visualReading": ("≥25" if number == 10 else "≤64")
                    if citation is None
                    else "87.5 y comunicación histórica; lectura de página completa",
                }
            )
    write("evidencia-propia.json", checked)
    sources = read(PRIOR / "fuentes.json")
    history = []
    for source in sources:
        if not source["sha256"].startswith(("0f6003cfa63f", "0abb5d0eda31")):
            continue
        raw = Path(source["path"]).read_bytes()
        assert digest(raw) == source["sha256"]
        assert (
            hashlib.sha512(raw).hexdigest() == source["sha512"]
            and len(raw) == source["size"]
        )
        with fitz.open(stream=raw, filetype="pdf") as doc:
            numbers = (
                [39, 40, 41, 42]
                if source["sha256"].startswith("0f6003cfa63f")
                else [3, 4, 5]
            )
            for n in numbers:
                history.append(
                    {"source": source, "page": n, "text": doc[n - 1].get_text()}
                )
    write("contexto-85-88.json", history)
    spec = importlib.util.spec_from_file_location(
        "reader_r22",
        ROOT / "docs/procedencia/correcciones/retenciones-2015-2016-r22/contraste.py",
    )
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    numeric = []
    for key, edit in corrections.items():
        if not key.endswith(":CAUSA4"):
            continue
        formula = edit["replacement"]["subpasoDocumental"]["formula"]
        for m, a, t, expected in [
            ("0", "12", "0", "0"),
            ("2", "12", "6", "6"),
            ("2", "12", "11.999", "11.999"),
            ("2", "12", "12", "12"),
            ("2", "12", "12.001", "12"),
            ("2", "12", "18", "12"),
            ("0", "0", "6", "0"),
            ("15", "15", "20", "15"),
            ("8", "8", "8", "8"),
            ("1", "1", "2", "1"),
        ]:
            result = module.literal_substep(formula, Decimal(t), Decimal(a))
            assert result == Decimal(expected) and Decimal(m) <= result <= Decimal(a)
            numeric.append(
                {
                    "id": key,
                    "minimum": m,
                    "previous": a,
                    "candidate": t,
                    "expected": expected,
                    "actual": str(result),
                    "admissionEvaluated": False,
                }
            )
    write("casos-numericos.json", numeric)
    executions = []
    for name, expected_exit in [("rojo.py", 1), ("contraste.py", 0)]:
        command = [sys.executable, str(EDITION / name)]
        run = subprocess.run(command, capture_output=True, text=True, check=False)
        (OUT / ("repro-" + name + ".log")).write_text(run.stdout + run.stderr)
        assert run.returncode == expected_exit
        executions.append(
            {"command": command, "expectedExit": expected_exit, "exit": run.returncode}
        )
    write("ejecuciones.json", executions)
    write(
        "identidades.json",
        {
            "inputs": [
                {"path": str(p.relative_to(ROOT)), "sha256": digest(p.read_bytes())}
                for p in [
                    EDITION / "CONTRATO.md",
                    EDITION / "ajustes.json",
                    EDITION / "evidencia.json",
                    EDITION / "rojo.py",
                    EDITION / "contraste.py",
                    EDITION / "rectificar.py",
                ]
            ],
            "completeRuleAcceptance": False,
            "enableVersions": [],
        },
    )
    print(
        "Composición 80/44 y 12 IDs exactos; reproducción de 8 recortes y 2 páginas; rojo 1 y contraste 0; techo condicional cotejado. Ninguna admisión ni nómina ejecutada."
    )


if __name__ == "__main__":
    main()
