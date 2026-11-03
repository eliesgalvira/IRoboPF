"""Adaptador de extracción IPC/SS. No modifica ni relaja flujo RP01–RP09.

Las obligaciones se revisan/versionan antes del ensayo. El CSV usa exclusivamente
flujo.number para cifras; PDF usa flujo.pdf_table. Los selectores no admitidos
por la CLI se conservan como propuestas, nunca como bindings efectivos.
"""

from __future__ import annotations
import argparse
import csv
import json
from pathlib import Path
import sys
from decimal import Decimal

REPO = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(REPO / "tools/procedencia/datos"))
import flujo  # noqa: E402


def select_ipc(raw: bytes, obligation: dict) -> dict:
    rows = list(csv.DictReader(raw.decode("utf-8-sig").splitlines(), delimiter=";"))
    selected = [
        (i, r)
        for i, r in enumerate(rows, 2)
        if r["Grupos ECOICOP"] == obligation["group"]
        and r["Tipo de dato"] == obligation["measure"]
        and r["Periodo"] == obligation["period"]
    ]
    if (
        obligation["measure"] != "Variación anual"
        or obligation["unit"] != "percent"
        or obligation["scale"] != 100
    ):
        raise ValueError("Medida/unidad/escala IPC incompatible")
    if not obligation["period"].endswith("M12"):
        raise ValueError("Se requiere diciembre/diciembre")
    if len(selected) != 1:
        raise ValueError("Observación ausente o duplicada")
    line, row = selected[0]
    return {
        **obligation,
        "line": line,
        "literal": row["Total"],
        "normalized": flujo.number(row["Total"], "percent"),
    }


def exact_coverage(obligations: list[dict], cells: list[dict]) -> None:
    expected = [x["id"] for x in obligations]
    actual = [x["id"] for x in cells]
    if (
        len(set(expected)) != len(expected)
        or len(set(actual)) != len(actual)
        or expected != actual
    ):
        raise ValueError("Cobertura omitida/sobrante/duplicada")


def bind_ipc(items: list[dict], obligation: dict) -> Decimal:
    binding = obligation["binding"]
    if (
        binding["file"] != "lib/dominio/normativa/datos/ipc-2012-2026.ts"
        or binding["symbol"] != "IPC_ANUAL_DICIEMBRE"
        or binding["path"] != [obligation["period"][:4]]
    ):
        raise ValueError("Binding IPC incorrecto")
    return flujo.evaluate(items, {"op": "percent", "args": [{"binding": binding}]})


def validate_party(cell: dict, expected: dict) -> None:
    for key in ("party", "unit", "scale", "period", "concept"):
        if cell.get(key) != expected.get(key):
            raise ValueError("Ámbito de cotización alterado: " + key)


def run(config: Path, roots: list[Path], census: Path, output: Path) -> dict:
    registry = json.loads(config.read_bytes())
    store = flujo.Store(roots)
    inventory = json.loads(census.read_bytes())
    for module in inventory["modules"]:
        if flujo.digest((REPO / module["file"]).read_bytes()) != module["sha256"]:
            raise ValueError("Censo de otra versión del motor")
    if [x["period"] for x in registry["ipc"]] != [
        str(y) + "M12" for y in range(2013, 2026)
    ]:
        raise ValueError("Obligaciones temporales IPC alteradas")
    # Solo hojas efectivas independientes; no construye valores esperados.
    items = [
        {
            **x,
            "layer": "effective",
            "source": {"file": x["file"]},
            "path": json.dumps(x["path"]),
        }
        for x in inventory["leaves"]
    ]
    cells = []
    ipc_raw = store.read(registry["ipcDocument"])
    for obligation in registry["ipc"]:
        cell = select_ipc(ipc_raw, obligation)
        observed = bind_ipc(items, obligation)
        cell["enginePercent"] = str(observed)
        cell["numericStatus"] = (
            "match" if observed == Decimal(cell["normalized"]) else "difference"
        )
        cell["status"] = "not-verifiable"
        cell["reason"] = (
            "CSV selector and publication status require shared-contract extension/review"
        )
        cells.append(cell)
    exact_coverage(registry["ipc"], cells)
    bases = []
    for table in registry["bases"]:
        bases.extend(flujo.pdf_table(store, table))
    # Conservar todos los bloques oficiales seleccionados, sin interpretar prosa
    # como cifra ni aplicar anualizaciones no admitidas por el contrato compartido.
    rates = [
        cell for table in registry["rates"] for cell in flujo.pdf_table(store, table)
    ]
    rate_contexts = []
    for table in registry["rates"]:
        with flujo.pymupdf.open(
            stream=store.read(table["document"]), filetype="pdf"
        ) as doc:
            rate_contexts.append(
                {
                    "code": table["code"],
                    "quote": flujo.extract(
                        doc[table["page"] - 1], table["contextBbox"]
                    ),
                }
            )
    raw_tables = []
    for table in registry["rawTables"]:
        with flujo.pymupdf.open(
            stream=store.read(table["document"]), filetype="pdf"
        ) as doc:
            page = doc[table["page"] - 1]
            raw_tables.append(
                {
                    **table,
                    "quotes": [
                        flujo.extract(page, cell["bbox"]) for cell in table["cells"]
                    ],
                }
            )
    contexts = []
    for spec in json.loads(store.read(registry["contextsRef"])):
        raw = store.read(spec["document"])
        with flujo.pymupdf.open(stream=raw, filetype="pdf") as doc:
            page = doc[spec["page"] - 1]
            contexts.append(
                {
                    **spec,
                    "quote": flujo.extract(page, spec["bbox"]),
                    "selectors": flujo.selectors(
                        spec["page"], spec["bbox"], flujo.extract(page, spec["bbox"])
                    ),
                }
            )
    result = {
        "version": 1,
        "configSha256": flujo.digest(config.read_bytes()),
        "censusSha256": flujo.digest(census.read_bytes()),
        "ipc": cells,
        "bases": bases,
        "rates": rates,
        "rateContexts": rate_contexts,
        "rawTables": raw_tables,
        "contexts": contexts,
        "acceptance": "pending",
        "sharedCliCompatible": False,
    }
    output.write_bytes(flujo.encode(result))
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, required=True)
    parser.add_argument("--read-root", type=Path, action="append", required=True)
    parser.add_argument("--census", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--verify", type=Path)
    args = parser.parse_args()
    result = run(args.config, args.read_root, args.census, args.output)
    if args.verify and args.verify.read_bytes() != flujo.encode(result):
        raise ValueError("Reconstrucción distinta")
    print(
        json.dumps(
            {
                "ipc": len(result["ipc"]),
                "bases": len(result["bases"]),
                "rates": len(result["rates"]),
                "contexts": len(result["contexts"]),
            }
        )
    )


if __name__ == "__main__":
    main()
