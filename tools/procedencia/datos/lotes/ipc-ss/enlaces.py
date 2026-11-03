"""Cotejo dimensional IPC/SS; parser numérico y geometría del verificador común.

El corpus completo es una suite local explícita. Las declaraciones semánticas
son candidatas para revisión; no conceden aceptación al contrato central.
"""

from __future__ import annotations

import argparse
from collections import Counter
from decimal import Decimal
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
from typing import TypeVar

T = TypeVar("T")

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import flujo  # noqa: E402
import contexto  # noqa: E402


def period(year: int, start: int = 1, end: int = 12) -> dict:
    return {"from": f"{year}-{start:02}", "through": f"{year}-{end:02}"}


def compare(value: str, engine: str, factor: int = 1) -> str:
    return "match" if Decimal(value) * factor == Decimal(engine) else "difference"


def choose_unique(matches: list[T]) -> T:
    if len(matches) != 1:
        raise ValueError(f"Selector no unívoco: {len(matches)}")
    return matches[0]


def semantic_rates(text: str) -> list[dict]:
    """Capturas ligadas a conceptos y cargos, nunca a cifras del motor.

    Se aplica dentro del artículo general correspondiente; no a capítulos de
    agrarios, hogar o formación. Devuelve posiciones de los literales.
    """
    n = r"([0-9]+(?:,[0-9]+)?)"
    pct = r"\s+por\s+(?:ciento|100)"
    worker = r"\s+(?:será\s+)?a\s+cargo\s+del\s+trabajador\b"
    pair = n + pct + r"[^.;]{0,400}?cargo de la empresa,?\s+y\s+el\s+" + n + pct + worker
    patterns = {
        "comunes": r"contingencias comunes,\s+el\s+"
        + n
        + pct
        + r",\s+del que el\s+"
        + pair,
        "desempleo": r"(?:Contratación indefinida|Contratación de duración indefinida).{0,2400}?"
        + n
        + pct
        + r",\s+del que el\s+"
        + pair,
        "fogasa": r"Fondo de Garantía Salarial:\s+el\s+"
        + n
        + pct
        + r",\s+a cargo de la empresa",
        "fp": r"Formación [Pp]rofesional:\s+el\s+"
        + n
        + pct
        + r",\s+del que el\s+"
        + pair,
        "mei": r"(?:mecanismo de equidad intergeneracional|cotización adicional correspondiente al mecanismo de equidad intergeneracional).{0,180}?"
        + n
        + pct
        + r".{0,180}?del que el\s+"
        + n
        + pct
        + r".{0,100}?cargo del (?:empleador|empresario)\s+y\s+el\s+"
        + n
        + pct + worker,
    }
    result = []
    for concept, pattern in patterns.items():
        for m in re.finditer(pattern, text, re.I):
            parties = (
                ["empresarial"]
                if concept == "fogasa"
                else ["total", "empresarial", "trabajador"]
            )
            for i, party in enumerate(parties, 1):
                result.append(
                    {
                        "concept": concept,
                        "party": party,
                        "literal": m.group(i),
                        "start": m.start(i),
                        "end": m.end(i),
                        "context": text[m.start() : m.end() + 100],
                    }
                )
    # Artículo 17: tres tramos, total y reparto explícito; no regla de tres.
    solid = (
        r"(?:[abc]\)\s*El\s+)"
        + n
        + pct
        + r".{0,700}?siendo el\s+"
        + n
        + pct
        + r".{0,100}?cargo de la empresa,?\s+y\s+el\s+"
        + n
        + pct + worker
    )
    for tranche, m in enumerate(re.finditer(solid, text, re.I), 1):
        for i, party in enumerate(["total", "empresarial", "trabajador"], 1):
            result.append(
                {
                    "concept": f"solidaridad-{tranche}",
                    "party": party,
                    "literal": m.group(i),
                    "start": m.start(i),
                    "end": m.end(i),
                    "context": text[m.start() : m.end() + 100],
                }
            )
    return result


def text_positions(page) -> tuple[str, list]:
    words = [w for w in page.get_text("words", flags=0, sort=True) if w[0] < 550]
    text = ""
    offsets = []
    for w in words:
        if text:
            text += " "
        offsets.append((len(text), len(text) + len(w[4]), w))
        text += w[4]
    return text, offsets


def extract_rates(store, ref: dict, year: int, period_proof=None) -> list[dict]:
    result = []
    seen = set()
    with flujo.pymupdf.open(stream=store.read(ref), filetype="pdf") as doc:
        if contexto.year(doc) != year:
            raise ValueError("Año solicitado distinto del año documental")
        valid_period = contexto.period(doc, period_proof, "Tipos de cotización")
        if valid_period is not None and int(valid_period["from"][:4]) != year:
            raise ValueError("Período de tipos de otro año")
        text = ""
        positions = []
        for i, page in enumerate(doc):
            part, local = text_positions(page)
            offset = len(text)
            positions.extend((a + offset, b + offset, w, i) for a, b, w in local)
            text += part + " "
        for found in semantic_rates(text):
            i = next(i for a, b, w, i in positions if a == found["start"])
            page = doc[i]
            key = found["concept"], found["party"]
            # Primera aparición general; se conserva el contexto para revisión.
            if key in seen:
                continue
            seen.add(key)
            words = [
                w
                for a, b, w, pg in positions
                if a >= found["start"] and b <= found["end"]
            ]
            if len(words) != 1:
                raise ValueError("Literal de tipo no corresponde a una palabra")
            w = words[0]
            box = [w[0] - 0.01, w[1] - 0.01, w[2] + 0.01, w[3] + 0.01]
            if period_proof is not None:
                contexto.local_period(doc, period_proof, i + 1, flujo.pymupdf.Rect(box),
                                      "Tipos de cotización")
            table = {
                "code": f"{year}-{found['concept']}-{found['party']}",
                "year": year,
                "territory": "ES",
                "document": ref,
                "page": i + 1,
                "cells": [
                    {
                        "row": found["party"],
                        "column": found["concept"],
                        "unit": "percent",
                        "bbox": box,
                    }
                ],
            }
            cell = flujo.pdf_table(store, table)[0]
            if cell["literal"] != found["literal"]:
                raise ValueError("Selector de cargo cambiado")
            result.append(
                {
                    **cell,
                    "concept": found["concept"],
                    "party": found["party"],
                    "context": found["context"],
                    "regime": "general",
                    "period": valid_period,
                    "periodEvidence": period_proof,
                    "scopeStatus": "context-evidenced" if valid_period else "period-unverified",
                    "contract": "indefinido"
                    if found["concept"] == "desempleo"
                    else "perfil-ordinario",
                    "groups": list(range(1, 12)),
                }
            )
    return result


def bases(store, config: dict) -> tuple[list, list]:
    cells, ambiguous = [], []
    for table in config["bases"] + config["rawTables"]:
        for spec in table["cells"]:
            single = {**table, "cells": [spec]}
            try:
                cell = flujo.pdf_table(store, single)[0]
            except ValueError as error:
                if table["year"] != 2013:
                    raise
                with flujo.pymupdf.open(
                    stream=store.read(table["document"]), filetype="pdf"
                ) as doc:
                    text = flujo.extract(doc[table["page"] - 1], spec["bbox"])
                    box = flujo.pymupdf.Rect(spec["bbox"])
                    literal = " ".join(
                        w[4]
                        for w in doc[table["page"] - 1].get_text(
                            "words", flags=0, sort=True
                        )
                        if box.contains(flujo.pymupdf.Rect(w[:4]))
                    )
                ambiguous.append(
                    {
                        **spec,
                        "year": 2013,
                        "document": table["document"],
                        "page": table["page"],
                        "literal": literal,
                        "quote": text,
                        "reason": str(error),
                        "status": "ambiguous-original-separator",
                    }
                )
                continue
            year = table["year"]
            with flujo.pymupdf.open(stream=store.read(table["document"]), filetype="pdf") as doc:
                scope = contexto.base_scope(doc, table, spec)
            cell.update(
                regime="general",
                concept="contingencias-comunes",
                group=int(spec["row"]),
                party=["empresarial", "trabajador"],
                candidateScope={"year": year, "column": spec["column"],
                                "periodUnit": spec["periodUnit"], "row": spec["row"]},
                year=None, column=None, periodUnit=None, period=None,
                scopeStatus="unverified",
                engineUse="minimum-not-consumed"
                if spec["column"] == "minimum"
                else "group-monthly-cap"
                if spec["periodUnit"] == "EUR/month"
                else "daily-not-consumed",
            )
            if scope is not None:
                cell.update(**scope, scopeStatus="context-evidenced")
            # Mantiene versiones sustituidas y correcciones separadas físicamente.
            cell["versionRole"] = "historical-source-version"
            cells.append(cell)
    return cells, ambiguous


def run(
    config_path: Path,
    census_path: Path,
    sources_path: Path,
    roots: list[Path],
    repo: Path,
) -> dict:
    config = json.loads(config_path.read_bytes())
    census = json.loads(census_path.read_bytes())
    sources = json.loads(sources_path.read_bytes())
    store = flujo.Store(roots)
    for m in census["modules"]:
        if flujo.digest((repo / m["file"]).read_bytes()) != m["sha256"]:
            raise ValueError("Censo obsoleto")
    cells, ambiguous = bases(store, config)
    rates = []
    refs = {
        y: next(t["document"] for t in config["bases"] if t["year"] == y)
        for y in sorted({t["year"] for t in config["bases"]})
    }
    for year in (2023, 2024):
        refs[year] = next(t["document"] for t in config["bases"] if t["year"] == year)
    refs[2013] = config["rawTables"][0]["document"]
    rate_gaps = []
    for year, ref in sorted(refs.items()):
        try:
            rates.extend(extract_rates(store, ref, year,
                                      config.get("ratePeriods", {}).get(str(year))))
        except ValueError as error:
            rate_gaps.append({"year": year, "document": ref,
                              "status": "not-verifiable", "reason": str(error)})
    physical_rates = rates
    # Los enlaces del motor son anuales: un período parcial se conserva como
    # extracción física, pero no acredita el parámetro de todo el ejercicio.
    rates = [r for r in physical_rates if r["scopeStatus"] == "context-evidenced"
             and r["period"] == period(r["year"])]
    # INE serie y política de revisión: documentos originales identificados por hash.
    metadata = next(s for s in sources if s["key"] == "ine-metadata")
    meta = store.read(metadata).decode()
    if "definitivos desde la primera vez" not in meta:
        raise ValueError("No se acredita estado definitivo")
    table_ref = next(s for s in sources if s["key"] == "ine-table")
    table_html = store.read(table_ref).decode()
    if "2021" not in table_html or "nacional" not in table_html.lower():
        raise ValueError("Identidad de serie INE no acreditada")
    import lote

    ipc = []
    raw = store.read(config["ipcDocument"])
    for o in config["ipc"]:
        cell = lote.select_ipc(raw, o)
        leaf = choose_unique(
            [
                x
                for x in census["leaves"]
                if x["symbol"] == o["binding"]["symbol"]
                and x["path"] == o["binding"]["path"]
            ]
        )
        cell.update(
            status=compare(cell["normalized"], str(Decimal(leaf["value"]) * 100)),
            publicationStatus="definitivo",
            publicationEvidence=metadata,
            seriesEvidence=table_ref,
            series="INE 50902 / Índice general / nacional / base 2021",
            frequency="monthly",
            base="2021=100",
            document=config["ipcDocument"],
            derivation="tasa oficial diciembre/diciembre / 100; no media anual ni cociente de índices redondeados",
            engine=leaf,
        )
        ipc.append(cell)
    legal = []
    for key, needle in [
        ("law2018", "3.803,70"),
        ("law2021", "4.070,10"),
        ("law2020", "se mantendrá la aplicación de la Orden TMS/83/2019"),
    ]:
        ref = next(r for r in sources if r["key"] == key)
        root = ET.fromstring(store.read(ref))
        found = []
        for i, node in enumerate(root.iter()):
            if node.tag == "p" and needle in "".join(node.itertext()):
                quote = "".join(node.itertext())
                found.append(
                    {
                        "document": ref,
                        "elementOrdinal": i,
                        "literal": needle,
                        "quote": quote,
                        "position": quote.index(needle),
                        "selector": "XML p / ordinal document order",
                    }
                )
        legal.append({"key": key, "positions": found})
    if not all(x["positions"] for x in legal):
        raise ValueError("Remisión legal ausente")
    for cell in list(rates):
        if cell["year"] == 2019:
            rates.append(
                {
                    **cell,
                    "year": 2020,
                    "period": period(2020),
                    "derivation": "prórroga expresa; DA segunda RDL18/2019",
                    "remission": next(x for x in legal if x["key"] == "law2020"),
                }
            )
    solidarity = []
    source_file = "lib/dominio/laboral/cotizaciones-perfil-uniforme.ts"
    source = (repo / source_file).read_text()
    for m in re.finditer(
        r"(2025|2026):\s*\{\s*empresa: \[(.*?)\],\s*trabajador: \[(.*?)\]", source, re.S
    ):
        year = int(m[1])
        for group, party in [(2, "empresarial"), (3, "trabajador")]:
            for tranche, number in enumerate(re.finditer(r'"([0-9.]+)"', m[group]), 1):
                value = number[1]
                selected = [
                    x
                    for x in rates
                    if x["year"] == year
                    and x["concept"] == f"solidaridad-{tranche}"
                    and x["party"] == party
                ]
                solidarity.append(
                    {
                        "year": year,
                        "party": party,
                        "tranche": tranche,
                        "unit": "proportion",
                        "period": period(year),
                        "engine": value,
                        "evidence": selected,
                        "engineSource": {
                            "file": source_file,
                            "sha256": flujo.digest(source.encode()),
                            "startUtf8": len(
                                source[: m.start(group) + number.start(1)].encode()
                            ),
                        },
                        "status": compare(
                            selected[0]["normalized"], str(Decimal(value) * 100)
                        )
                        if selected
                        else "not-verifiable",
                    }
                )
    links = []
    for leaf in census["leaves"]:
        symbol = leaf["symbol"]
        path = leaf["path"]
        year = int(path[0]) if path and path[0].isdigit() else None
        link = {"binding": leaf, "status": "not-verifiable", "evidence": []}
        if symbol == "IPC_ANUAL_DICIEMBRE":
            assert year is not None
            x = next(x for x in ipc if int(x["period"][:4]) == year)
            link.update(
                status=x["status"],
                evidence=[x["id"]],
                unit="proportion",
                period=period(year, 12),
                scope="national-general-index-december-over-december",
            )
        elif symbol == "ESCENARIO_IPC_2026_LEGACY":
            link.update(
                status="declared-scenario" if path == ["tasaDiciembre"] else "metadata",
                reason="No observación diciembre 2026 publicada al corte",
                unit="proportion" if path == ["tasaDiciembre"] else None,
            )
        elif symbol == "BASE_MAXIMA_COTIZACION_LEGACY":
            selected = [
                x
                for x in cells
                if x["year"] == year and x["row"] == "1" and x["column"] == "maximum"
                and x["scopeStatus"] == "context-evidenced"
                and x["periodUnit"] == "EUR/month" and x["period"] == period(year)
            ]
            if selected:
                # Fuentes coincidentes de máxima se agregan como posiciones, no magnitudes.
                vals = {x["normalized"] for x in selected}
                if len(vals) != 1:
                    raise ValueError("Versiones de máxima divergentes")
                v = next(iter(vals))
                link.update(
                    status=compare(v, leaf["value"], 12),
                    sourceValue=v,
                    unit="EUR/year",
                    sourceUnit="EUR/month",
                    operation="multiply(12)",
                    evidence=[
                        {
                            "document": x["document"],
                            "page": x["page"],
                            "bbox": x["bbox"],
                        }
                        for x in selected
                    ],
                    period=selected[0]["period"],
                    scope="perfil uniforme mensual; grupo 1; base común a ambos sujetos",
                )
            elif year == 2020:
                source = next(
                    (x
                    for x in cells
                    if x["year"] == 2019
                    and x["row"] == "1"
                    and x["column"] == "maximum"
                    and x["scopeStatus"] == "context-evidenced"
                    and x["periodUnit"] == "EUR/month" and x["period"] == period(2019)),
                    None,
                )
                if source is not None:
                    link.update(
                        status=compare(source["normalized"], leaf["value"], 12),
                        sourceValue=source["normalized"],
                        unit="EUR/year",
                        sourceUnit="EUR/month",
                        operation="multiply(12)",
                        period=period(2020),
                        evidence=[source, next(x for x in legal if x["key"] == "law2020")],
                        scope="máxima; prórroga expresa TMS/83/2019 DA segunda RDL18/2019; no extender a mínimos",
                    )
        elif symbol == "TIPOS_SEGURIDAD_SOCIAL_LEGACY":
            concept, party = path
            selected = [
                x for x in rates if x["concept"] == concept and x["party"] == party
            ]
            link.update(
                unit="proportion",
                scope="general; indefinido; sin especialidades",
                evidence=[
                    {
                        "year": x["year"],
                        "document": x["document"],
                        "page": x["page"],
                        "bbox": x["bbox"],
                        "period": x["period"],
                    }
                    for x in selected
                ],
            )
            if selected:
                link["status"] = (
                    "match"
                    if all(
                        compare(x["normalized"], str(Decimal(leaf["value"]) * 100))
                        == "match"
                        for x in selected
                    )
                    else "difference"
                )
            elif party == "trabajador" and concept in ("fogasa", "atep"):
                link.update(
                    status="not-verifiable",
                    reason="El cero requiere acreditar el cargo exclusivo y su vigencia; no se infiere de la ausencia de celdas",
                )
            elif concept == "atep":
                link.update(
                    status="declared-assumption",
                    reason="1,5% no es tarifa universal; elegibilidad no validada por el perfil",
                )
            else:
                link["reason"] = (
                    "No literal con concepto y sujeto localizado por selector"
                )
        links.append(link)
    mei = []
    for parameter in census.get("parameters", []):
        year = parameter["year"]
        for party, value in parameter["mei"].items():
            selected = [
                x
                for x in rates
                if x["year"] == year and x["concept"] == "mei" and x["party"] == party
            ]
            mei.append(
                {
                    "year": year,
                    "party": party,
                    "engine": value,
                    "evidence": selected,
                    "period": period(year),
                    "unit": "proportion",
                    "status": compare(
                        selected[0]["normalized"], str(Decimal(value) * 100)
                    )
                    if selected
                    else "not-applicable-before-2023"
                    if year < 2023
                    else "not-verifiable",
                }
            )
    occurrences = []
    scope_symbols = {
        "IPC_ANUAL_DICIEMBRE",
        "ESCENARIO_IPC_2026_LEGACY",
        "BASE_MAXIMA_COTIZACION_LEGACY",
        "TIPOS_SEGURIDAD_SOCIAL_LEGACY",
        "obtenerTiposMei",
        "obtenerPoliticaSolidaridad",
        "tiposSolidaridad",
        "cuotaSolidaridad",
        "calcularDesgloseCotizacionesPerfilUniforme",
        "calcularFactorIpcDiciembre",
        "factorIpcPerfilLegacy",
    }
    for module in census["modules"]:
        for item in module["ast"]["items"]:
            if item["symbol"] not in scope_symbols:
                continue
            expression = item.get("expression", "")
            occurrences.append(
                {
                    "id": item["id"],
                    "symbol": item["symbol"],
                    "source": item["source"],
                    "expression": expression,
                    "classification": "auxiliary-year-or-index"
                    if re.fullmatch(r"(?:20[12][0-9]|[0-9])", expression)
                    else "numeric-or-derived"
                    if item.get("value") is not None
                    else "container-or-rule",
                    "relation": "same-symbol-magnitude; not additional unique amount",
                    "evidenceDomain": "ipc"
                    if "Ipc" in item["symbol"] or "IPC" in item["symbol"]
                    else "ss",
                }
            )
    numeric_cases = []
    for case in census.get("cases", []):
        year = case["year"]
        salary = Decimal(case["salary"])
        parameter = next((x for x in links
                          if x["binding"]["symbol"] == "BASE_MAXIMA_COTIZACION_LEGACY"
                          and x["binding"]["path"] == [str(year)]), None)
        if parameter is None or "sourceValue" not in parameter or year == 2018:
            numeric_cases.append({"year": year, "salary": str(salary),
                                  "engineBase": case["result"]["baseOrdinaria"],
                                  "status": "not-verifiable",
                                  "reason": "Falta evidencia del parámetro para el período completo"})
            continue
        cap = Decimal(parameter["sourceValue"]) * 12
        expected = min(salary, cap)
        numeric_cases.append(
            {
                "year": year,
                "salary": str(salary),
                "expectedBase": str(expected),
                "engineBase": case["result"]["baseOrdinaria"],
                "status": compare(str(expected), case["result"]["baseOrdinaria"])
                if abs(expected - Decimal(case["result"]["baseOrdinaria"]))
                > Decimal("1e-12")
                or expected == Decimal(case["result"]["baseOrdinaria"])
                else "decimal-representation-below-1e-12-EUR",
                "scope": "algebraic replay after parameter comparison; no rounding or eligibility certification",
            }
        )
    missing_rates = []
    for year in range(2012, 2027):
        for concept in (
            ["comunes", "desempleo", "fogasa", "fp"]
            + (["mei"] if year >= 2023 else [])
            + (
                ["solidaridad-1", "solidaridad-2", "solidaridad-3"]
                if year >= 2025
                else []
            )
        ):
            if not any(x["year"] == year and x["concept"] == concept for x in rates):
                missing_rates.append(
                    {
                        "year": year,
                        "concept": concept,
                        "status": "not-verifiable",
                        "reason": "No bloque general extraído; 2020 requiere remisión expresa; no extrapolación numérica",
                    }
                )
    balance = []
    for year in range(2012, 2027):
        balance.append(
            {
                "year": year,
                "ipc": Counter(
                    x["status"] for x in ipc if x["period"].startswith(str(year))
                ),
                "ssBases": Counter(
                    x["status"]
                    for x in links
                    if x["binding"]["symbol"] == "BASE_MAXIMA_COTIZACION_LEGACY"
                    and x["binding"]["path"] == [str(year)]
                ),
                "ratesBySubject": Counter(
                    x["concept"] for x in rates if x["year"] == year
                ),
                "minimumPhysicalPositionsNotConsumed": sum(
                    x["year"] == year and x["column"] == "minimum" for x in cells
                ),
                "minimumUniqueDimensionsNotConsumed": len(
                    {
                        (x["row"], x["periodUnit"])
                        for x in cells
                        if x["year"] == year and x["column"] == "minimum"
                    }
                ),
                "ambiguousOriginalCells": sum(x["year"] == year for x in ambiguous),
            }
        )
    return {
        "version": 3,
        "configSha256": flujo.digest(config_path.read_bytes()),
        "censusSha256": flujo.digest(census_path.read_bytes()),
        "sourcesSha256": flujo.digest(sources_path.read_bytes()),
        "legal": legal,
        "mei": mei,
        "solidarity": solidarity,
        "occurrences": occurrences,
        "numericCases": numeric_cases,
        "missingRates": missing_rates,
        "ipc": ipc,
        "bases": cells,
        "ambiguous": ambiguous,
        "rates": rates,
        "physicalRates": physical_rates,
        "rateGaps": rate_gaps,
        "links": links,
        "balance": balance,
        "acceptance": "candidate-independent-review-required",
        "rounding": "CX-01/CX-03 no evaluados; bloque D separado",
    }


def main():
    p = argparse.ArgumentParser(description=__doc__)
    for arg in ("config", "census", "sources", "repo", "output"):
        p.add_argument("--" + arg, type=Path, required=True)
    p.add_argument("--read-root", type=Path, action="append", required=True)
    p.add_argument("--verify", type=Path)
    a = p.parse_args()
    r = run(a.config, a.census, a.sources, a.read_root, a.repo)
    raw = flujo.encode(r)
    if a.verify and a.verify.read_bytes() != raw:
        raise ValueError("Replay distinto")
    a.output.write_bytes(raw)
    print(
        json.dumps(
            {
                "bases": len(r["bases"]),
                "rates": len(r["rates"]),
                "links": len(r["links"]),
                "ambiguous": len(r["ambiguous"]),
            }
        )
    )


if __name__ == "__main__":
    main()
