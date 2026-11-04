"""Lote documental separado: descubrimiento físico antes de bindings y comparación.

No descarga implícita ni aceptación jurídica. Los originales y salidas son externos.
"""

from __future__ import annotations
import argparse
from collections import Counter
from copy import deepcopy
import json
from pathlib import Path
import re
import sys
import unicodedata

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import flujo  # noqa: E402


class ExecutionStore(flujo.Store):
    """Bytes comprobados en esta ejecución, sin cachés persistentes implícitas."""

    def __init__(self, roots):
        super().__init__(roots)
        self.verified = {}

    def read(self, ref):
        key = (ref["sha256"], ref["size"])
        if key not in self.verified:
            self.verified[key] = super().read(ref)
        return self.verified[key]


def fold(text):
    return "".join(
        c
        for c in unicodedata.normalize("NFD", text.lower())
        if unicodedata.category(c) != "Mn"
    )


TERRITORIES = {
    "andalucia": "andalucia",
    "aragon": "aragon",
    "asturias": "asturias",
    "balears": "illes-balears",
    "canarias": "canarias",
    "cantabria": "cantabria",
    "castilla-la mancha": "castilla-la-mancha",
    "castilla y leon": "castilla-y-leon",
    "cataluna": "catalunya",
    "catalunya": "catalunya",
    "extremadura": "extremadura",
    "galicia": "galicia",
    "madrid": "madrid",
    "murcia": "murcia",
    "rioja": "la-rioja",
    "valenciana": "comunitat-valenciana",
    "ceuta": "ceuta",
    "melilla": "melilla",
}


def words_in(page, box):
    rect = flujo.pymupdf.Rect(box)
    return [
        w
        for w in page.get_text("words", flags=0, sort=True)
        if rect.contains(flujo.pymupdf.Rect(w[:4]))
    ]


def literal(page, box):
    return " ".join(w[4] for w in words_in(page, box))


def rows_in(page, box):
    """Geometría de líneas, sin interpretar ni corregir números."""
    groups = []
    for word in sorted(words_in(page, box), key=lambda w: (w[1], w[0])):
        if not groups or abs(groups[-1][0][1] - word[1]) > 2:
            groups.append([word])
        else:
            groups[-1].append(word)
    return [
        [
            min(w[0] for w in g) - 0.05,
            min(w[1] for w in g) - 0.05,
            max(w[2] for w in g) + 0.05,
            max(w[3] for w in g) + 0.05,
        ]
        for g in groups
    ]


def scope_context(page, box):
    # Los manuales antiguos colocan la jurisdicción a la izquierda del cuadro.
    before = [
        b
        for b in page.get_text("blocks")
        if b[1] <= box[1] + 20 and (b[3] <= box[1] + 5 or b[2] < box[0])
    ]
    text = " ".join(b[4] for b in sorted(before, key=lambda b: b[1]))
    hits = [
        (m.start(), territory)
        for name, territory in TERRITORIES.items()
        for m in re.finditer(re.escape(name), fold(text))
    ]
    return (max(hits)[1] if hits else "pending"), text[-1600:]


def discover(repo, store, sources):
    """Registro estructural sin consultar importes, censo o bindings del motor."""
    registry = []
    pages = []
    for source in sources:
        year = source["exercise"]
        for ref in source["manuals"]:
            docref = {k: ref[k] for k in ("sha256", "size")}
            with flujo.pymupdf.open(
                stream=store.read(docref), filetype="pdf"
            ) as document:
                active = False
                finished = False
                for n, page in enumerate(document):
                    if finished:
                        break
                    text = page.get_text()
                    ftext = fold(text)
                    if (
                        n > 100
                        and "capitulo 14" in ftext
                        and (
                            "adecuacion del impuesto" in ftext
                            or "minimo personal" in ftext
                        )
                    ):
                        active = True
                    if active and "capitulo 16" in ftext:
                        active = False
                        finished = True
                    if not active:
                        continue
                    scale = (
                        "base liquidable" in ftext
                        and "cuota" in ftext
                        and ("tipo aplicable" in ftext or "porcentaje" in ftext)
                    )
                    minimum = (
                        "minimo personal y familiar" in ftext
                        or "adecuacion del impuesto" in ftext
                    )
                    if not (scale or minimum):
                        continue
                    found = page.find_tables().tables
                    pages.append(
                        {
                            "year": year,
                            "document": docref,
                            "page": n + 1,
                            "scaleCandidate": scale,
                            "minimumCandidate": minimum,
                            "tables": len(found),
                            "textSha256": flujo.digest(text.encode()),
                        }
                    )
                    for index, table in enumerate(found):
                        raw = table.extract()
                        header = " ".join(str(c or "") for c in raw[0])
                        is_scale = (
                            table.col_count == 4
                            and "cuota" in fold(header)
                            and ("base" in fold(header) or "b.l." in fold(header))
                        )
                        if not is_scale and not minimum:
                            continue
                        territory, context = scope_context(page, table.bbox)
                        code = f"{year}-p{n + 1}-t{index}"
                        entry = {
                            "code": code,
                            "year": year,
                            "territory": territory,
                            "document": docref,
                            "page": n + 1,
                            "kind": "scale" if is_scale else "minimum-candidate",
                            "bbox": list(table.bbox),
                            "shape": [table.row_count, table.col_count],
                            "structure": raw,
                            "context": context,
                            "cells": [],
                        }
                        if is_scale:
                            # PDF sans traits horizontaux: un rectangle contient plusieurs lignes.
                            # Chacune est recensée avant toute lecture numérique.
                            columns = []
                            for col in range(4):
                                boxes = []
                                for row in table.rows[1:]:
                                    if row.cells[col] is not None:
                                        boxes.extend(rows_in(page, row.cells[col]))
                                columns.append(boxes)
                            entry["columnRows"] = [len(c) for c in columns]
                            for col, boxes in enumerate(columns):
                                unit = "percent" if col == 3 else "EUR"
                                hbox = table.rows[0].cells[col]
                                proof = (
                                    {
                                        "bbox": list(hbox),
                                        "literal": literal(page, hbox),
                                        "unit": unit,
                                    }
                                    if hbox
                                    else None
                                )
                                for row, box in enumerate(boxes):
                                    entry["cells"].append(
                                        {
                                            "row": str(row),
                                            "column": str(col),
                                            "bbox": box,
                                            "unit": unit,
                                            "unitEvidence": proof,
                                        }
                                    )
                        else:
                            # Conservar cada celda completa: nunca recortar un número de prosa
                            # para simular que se ha extraído un importe con unidad acreditada.
                            entry["textCells"] = [
                                {
                                    "row": str(i),
                                    "column": str(j),
                                    "bbox": list(box),
                                    "literal": literal(page, box),
                                }
                                for i, row in enumerate(table.rows)
                                for j, box in enumerate(row.cells)
                                if box is not None
                            ]
                        registry.append(entry)
    return {
        "tables": registry,
        "pages": pages,
        "policy": "physical-structure-before-bindings; candidate-registry-requires-review",
    }


def discover_geometry(store, sources):
    from geometria import sections

    tables = []
    pages = []
    for source in sources:
        for ref in source["manuals"]:
            docref = {k: ref[k] for k in ("sha256", "size")}
            with flujo.pymupdf.open(
                stream=store.read(docref), filetype="pdf"
            ) as document:
                active = False
                finished = False
                previous = "pending"
                offset = 0
                for n, page in enumerate(document):
                    if finished:
                        break
                    text = fold(page.get_text())
                    if (
                        n > 100
                        and "capitulo 15" in text
                        and "calculo del impuesto" in text
                    ):
                        active = True
                    if active and "capitulo 16" in text:
                        active = False
                        finished = True
                    if not active:
                        continue
                    for index, section in enumerate(sections(page)):
                        territory, context = scope_context(
                            page, [0, section["y"], page.rect.width, section["y"] + 1]
                        )
                        if territory == "pending":
                            territory = previous
                        if "ahorro" in fold(context)[-700:]:
                            territory = "ahorro-pending-scope"
                        if section["rows"]:
                            first = literal(page, section["rows"][0][0])
                            if (
                                re.fullmatch(r"0(?:,0+)?", first)
                                or territory != previous
                            ):
                                offset = 0
                        entry = {
                            "code": f"{source['exercise']}-g-p{n + 1}-s{index}",
                            "year": source["exercise"],
                            "territory": territory,
                            "document": docref,
                            "page": n + 1,
                            "kind": "scale",
                            "context": context,
                            "rowOffset": offset,
                            "bindingScopeReviewed": False,
                            "columnRows": [len(section["rows"])] * 4,
                            "cells": [],
                            "incompleteRows": section["incomplete"],
                            "strategy": "header-anchors-and-lines-v1",
                        }
                        for row, boxes in enumerate(section["rows"]):
                            for col, box in enumerate(boxes):
                                unit = "percent" if col == 3 else "EUR"
                                hb = section["headerBoxes"][col]
                                entry["cells"].append(
                                    {
                                        "row": str(row),
                                        "column": str(col),
                                        "bbox": box,
                                        "unit": unit,
                                        "unitEvidence": {
                                            "bbox": hb,
                                            "literal": literal(page, hb),
                                            "unit": unit,
                                        },
                                    }
                                )
                        tables.append(entry)
                        previous = territory
                        offset += len(section["rows"])
                    pages.append(
                        {"year": source["exercise"], "page": n + 1, "document": docref}
                    )
    return {
        "tables": tables,
        "pages": pages,
        "policy": "header-anchors-before-normalization-and-engine",
    }


def discover_minimum(store, sources):
    tables = []
    for source in sources:
        for ref in source["manuals"]:
            docref = {k: ref[k] for k in ("sha256", "size")}
            with flujo.pymupdf.open(
                stream=store.read(docref), filetype="pdf"
            ) as document:
                # Use actual chapter headings, not the (occasionally shifted) bookmarks.
                active = False
                finished = False
                for n, page in enumerate(document):
                    if finished:
                        break
                    text = fold(page.get_text())
                    if (
                        "capitulo 14" in text
                        and (
                            "adecuacion del impuesto" in text
                            or "minimo personal" in text
                        )
                        and n > 100
                    ):
                        active = True
                    if (
                        active
                        and "capitulo 15" in text
                        and "calculo del impuesto" in text
                    ):
                        active = False
                        finished = True
                    if not active:
                        continue
                    words = page.get_text("words", flags=0, sort=True)
                    specs = []
                    for i, word in enumerate(words[:-1]):
                        nextword = words[i + 1]
                        if (
                            nextword[4].lower().rstrip(".,;") != "euros"
                            or abs(nextword[1] - word[1]) > 2
                        ):
                            continue
                        if not re.search(r"[0-9]", word[4]):
                            continue
                        box = list(word[:4])
                        if (
                            i
                            and words[i - 1][4] in ("+", "-")
                            and abs(words[i - 1][1] - word[1]) < 2
                            and word[0] - words[i - 1][2] < 12
                        ):
                            box[0] = words[i - 1][0]
                            box[1] = min(box[1], words[i - 1][1])
                            box[3] = max(box[3], words[i - 1][3])
                        box = [
                            box[0] - 0.05,
                            box[1] - 0.05,
                            box[2] + 0.05,
                            box[3] + 0.05,
                        ]
                        proofbox = [
                            nextword[0] - 0.05,
                            nextword[1] - 0.05,
                            nextword[2] + 0.05,
                            nextword[3] + 0.05,
                        ]
                        specs.append(
                            {
                                "row": str(len(specs)),
                                "column": "amount",
                                "bbox": box,
                                "unit": "EUR",
                                "unitEvidence": {
                                    "bbox": proofbox,
                                    "literal": nextword[4],
                                    "unit": "EUR",
                                },
                                "context": " ".join(
                                    w[4] for w in words[max(0, i - 12) : i + 20]
                                ),
                            }
                        )
                    if specs:
                        tables.append(
                            {
                                "code": f"{source['exercise']}-minimum-p{n + 1}",
                                "kind": "minimum-euro-candidates",
                                "year": source["exercise"],
                                "territory": "pending",
                                "document": docref,
                                "page": n + 1,
                                "cells": specs,
                            }
                        )
    return tables


def census_scope(census):
    result = []
    for leaf in census["leaves"]:
        name = Path(leaf["file"]).name
        relevant = (
            name == "irpf-estatal-2012-2026.ts"
            and ("TRAMOS" in leaf["symbol"] or "MINIMO_PERSONAL" in leaf["symbol"])
        ) or name.startswith(("irpf-autonomico-", "minimos-autonomicos-"))
        years = [y for y in leaf["years"] if 2019 <= y <= 2026]
        if relevant and (years or re.search(r"202[0-6]|2019", name)):
            result.append(leaf)
    return result


def bind_scale(entry, spec, items, repo, semantics):
    """Vínculos por identidad, ejercicio y columna; nunca por igualdad de importe."""
    year = entry["year"]
    territory = entry["territory"]
    # Ámbito documental pendiente: no inferir estatal de ausencia de nombre.
    if not entry.get("bindingScopeReviewed") or territory not in set(
        TERRITORIES.values()
    ):
        return None
    file = f"lib/dominio/normativa/datos/irpf-autonomico-{year}.ts"
    symbol = f"ESCALAS_AUTONOMICAS_IRPF_{year}"

    def bound(row, col):
        binding = {
            "file": file,
            "symbol": symbol,
            "path": [territory, "tramos", str(row), str(col)],
        }
        matches = [
            i
            for i in items
            if i["layer"] == "effective"
            and i["source"]["file"] == file
            and i["symbol"] == symbol
            and json.loads(i["path"]) == binding["path"]
        ]
        if len(matches) != 1:
            return None
        source = repo / file
        quote = (
            "const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)"
        )
        money = "const importe = crearImporteMonetario"
        if quote not in source.read_text() or money not in source.read_text():
            return None
        semantics[flujo.encode(binding).decode().strip()] = {
            "sourceSha256": flujo.digest(source.read_bytes()),
            "quote": quote if col else money,
            "unit": "proportion" if col else "EUR",
        }
        return {"binding": binding}

    row = int(spec["row"]) + entry.get("rowOffset", 0)
    col = int(spec["column"])
    current = bound(row, 0)
    if col == 3:
        rate = bound(row, 1)
        return {"op": "percent", "args": [rate]} if rate else None
    if col == 1 or current is None:
        return None  # No integrar tipos para inventar cuotas publicadas.
    previous = (
        bound(row - 1, 0) if row else {"op": "subtract", "args": [current, current]}
    )
    if previous is None:
        return None
    return previous if col == 0 else {"op": "subtract", "args": [current, previous]}


def compare_registry(registry, store, items, repo):
    tables = []
    obligations = []
    rejected = []
    results = []
    semantics = {}
    extractions = []
    unit_cache = {}
    engine_by_module = {}
    for item in items:
        if item["layer"] == "effective":
            engine_by_module.setdefault(item["source"]["file"], []).append(item)
    for index, entry in enumerate(registry["tables"]):
        if len(registry["tables"]) > 20 and index % 25 == 0:
            print(
                f"table {index}/{len(registry['tables'])} {entry['code']}",
                file=sys.stderr,
                flush=True,
            )
        if entry["kind"] not in ("scale", "minimum-euro-candidates"):
            rejected.append(
                {
                    "code": entry["code"],
                    "reason": "mixed-prose-table-needs-semantic-selectors",
                    "cells": len(entry["textCells"]),
                }
            )
            continue
        if entry.get("incompleteRows"):
            rejected.append(
                {
                    "code": entry["code"],
                    "reason": "incomplete-source-row",
                    "rows": entry["incompleteRows"],
                }
            )
            continue
        if entry["kind"] == "scale" and (
            len(set(entry["columnRows"])) != 1 or not entry["columnRows"][0]
        ):
            rejected.append(
                {
                    "code": entry["code"],
                    "reason": "unequal-column-row-geometry",
                    "rows": entry["columnRows"],
                }
            )
            continue
        table = {
            k: entry[k]
            for k in ("code", "year", "territory", "document", "page", "cells")
        }
        table = deepcopy(table)
        table_items = engine_by_module.get(
            f"lib/dominio/normativa/datos/irpf-autonomico-{entry['year']}.ts", []
        )
        for spec in table["cells"]:
            spec["expression"] = (
                bind_scale(entry, spec, table_items, repo, semantics)
                if entry["kind"] == "scale"
                else None
            )
        try:
            extracted = flujo.pdf_table(store, table)
            # Unidades no admitidas permanecen pendientes. No ampliar el allowlist común.
            obligation = deepcopy(table)
            for cell in obligation["cells"]:
                proof_key = flujo.encode(
                    [table["document"], table["page"], cell.get("unitEvidence")]
                )
                if (cell.get("unitEvidence") or {}).get("literal", "").lower().rstrip(
                    ".,;"
                ) == "euros":
                    # Esta palabra aislada no está entre las ocho cabeceras admitidas.
                    # Rechazo conservador; la propuesta de unidad adyacente sigue abierta.
                    cell.pop("unitEvidence", None)
                    continue
                if proof_key not in unit_cache:
                    try:
                        unit_cache[proof_key] = flujo.evidence_unit(store, table, cell)
                    except ValueError:
                        unit_cache[proof_key] = False
                if not unit_cache[proof_key]:
                    cell.pop("unitEvidence", None)
            compared = flujo.compare(
                [table],
                extracted,
                table_items,
                obligations=[obligation],
                store=store,
                repo=repo,
                semantics=semantics,
            )
        except ValueError as error:
            rejected.append(
                {
                    "code": entry["code"],
                    "reason": "table-rejected-without-partial-results",
                    "error": str(error),
                    "cells": len(entry["cells"]),
                }
            )
            continue
        tables.append(table)
        obligations.append(obligation)
        results.extend(compared)
        extractions.extend(extracted)
    return {
        "tables": tables,
        "obligations": obligations,
        "comparison": results,
        "rejected": rejected,
        "semantics": semantics,
        "extraction": extractions,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, required=True)
    parser.add_argument("--cas", type=Path, action="append", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--census", type=Path)
    parser.add_argument("--registry", type=Path)
    parser.add_argument("--minimum-only", action="store_true")
    parser.add_argument("--geometry-only", action="store_true")
    args = parser.parse_args()
    repo = args.repo.resolve()
    out = args.output.resolve()
    if out.is_relative_to(repo):
        raise ValueError("Salidas voluminosas solo externas")
    out.mkdir(parents=True, exist_ok=True)
    sources = [
        s
        for s in json.loads(
            (repo / "docs/procedencia/datos-2012-2026/manuales.json").read_bytes()
        )
        if 2019 <= s["exercise"] <= 2025
    ]
    store = ExecutionStore(args.cas)
    if args.registry is None:
        registry = (
            discover_geometry(store, sources)
            if args.geometry_only
            else {"tables": discover_minimum(store, sources), "pages": []}
            if args.minimum_only
            else discover(repo, store, sources)
        )
        (out / "registry.json").write_bytes(flujo.encode(registry))
        print(
            json.dumps(
                {"tables": len(registry["tables"]), "pages": len(registry["pages"])}
            )
        )
        return
    if args.census is None:
        raise ValueError("Censo previo requerido")
    registry = json.loads(args.registry.read_bytes())
    census = json.loads((args.census / "censo-completo.json").read_bytes())
    scoped = census_scope(census)
    (out / "census-scope.json").write_bytes(flujo.encode(scoped))
    summary = json.loads((args.census / "inventario.json").read_bytes())
    items = [
        i
        for p in summary["pages"]
        for i in json.loads((args.census / p["file"]).read_bytes())
    ]
    effective_scope = [
        i
        for i in items
        if i["layer"] == "effective"
        and any(2019 <= y <= 2026 for y in i.get("years", []))
        and (
            Path(i["source"]["file"]).name.startswith(
                ("irpf-autonomico-", "minimos-autonomicos-")
            )
            or (
                Path(i["source"]["file"]).name == "irpf-estatal-2012-2026.ts"
                and ("TRAMOS" in i["symbol"] or "MINIMO_PERSONAL" in i["symbol"])
            )
            or Path(i["source"]["file"]).name == "escalas-publicadas.ts"
        )
    ]
    (out / "effective-scope.json").write_bytes(flujo.encode(effective_scope))
    result = compare_registry(registry, store, items, repo)
    (out / "result.json").write_bytes(flujo.encode(result))
    counts = Counter(r["status"] for r in result["comparison"])
    manifest = {
        "status": "candidate-incomplete",
        "counts": counts,
        "sourceYears": list(range(2019, 2026)),
        "engineOccurrences": len(effective_scope),
        "engineLeafOccurrences": len(scoped),
        "openYear": 2026,
        "registry": flujo.put(args.cas[0], args.registry.read_bytes()),
        "result": flujo.put(args.cas[0], flujo.encode(result)),
        "census": flujo.put(args.cas[0], flujo.encode(scoped)),
        "rejectedTables": len(result["rejected"]),
        "codeSha256": flujo.digest(Path(__file__).read_bytes()),
        "inputs": {
            str(p.relative_to(repo)): flujo.digest(p.read_bytes())
            for p in [
                Path(__file__),
                Path(__file__).with_name("geometria.py"),
                repo / "tools/procedencia/datos/flujo.py",
                repo / "tools/procedencia/corpus.py",
                repo / "tools/procedencia/datos/censo.mjs",
                repo / "bun.lock",
                repo / "docs/procedencia/datos-2012-2026/manuales.json",
            ]
        },
        "censusInput": flujo.digest((args.census / "censo-completo.json").read_bytes()),
        "censusDependencies": flujo.digest(
            (args.census / "dependencias-runtime.json").read_bytes()
        ),
        "base": "066eae335c0278c4796fd48bd458f5c9a7ec545e",
        "limitation": "Candidate bindings by identity; pending documentary scope and independent review. Not fiscal acceptance.",
    }
    (out / "manifest.json").write_bytes(flujo.encode(manifest))
    print(json.dumps(manifest))


if __name__ == "__main__":
    main()
