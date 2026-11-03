"""Selectores físicos de contexto; ausencia de prueba no acredita un ámbito."""

import calendar
import re

import flujo

MONTHS = (
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
)


def quote(document, proof):
    if not isinstance(proof["page"], int) or not 1 <= proof["page"] <= len(document):
        raise ValueError("Página de contexto inválida")
    page = document[proof["page"] - 1]
    box = flujo.pymupdf.Rect(proof["bbox"])
    if proof["page"] < 1 or box.is_empty or not page.rect.contains(box):
        raise ValueError("Selector de contexto fuera de página")
    words = [w for w in page.get_text("words", flags=0, sort=True)
             if box.contains(flujo.pymupdf.Rect(w[:4]))]
    text = " ".join(w[4] for w in words)
    if not words or text != proof["literal"]:
        raise ValueError("Contexto no reproducible")
    actual = flujo.pymupdf.Rect(min(w[0] for w in words), min(w[1] for w in words),
                               max(w[2] for w in words), max(w[3] for w in words))
    return text, actual


def local_period(document, proof, page_number, target, domain):
    """La declaración temporal debe preceder al bloque; no se trasplanta otra."""
    _, box = quote(document, proof)
    if proof["page"] != page_number or box.y1 > target.y0:
        raise ValueError("Período ajeno al bloque")
    markers = [r for r in document[page_number - 1].search_for(domain + ":")
               if r.y1 <= target.y0]
    if not markers or not box.contains(max(markers, key=lambda r: r.y1)):
        raise ValueError("El período no es la cabecera temporal inmediata")


def period(document, proof, domain):
    if proof is None:
        return None
    text, _ = quote(document, proof)
    # Subconjunto explícito: no inventar el final de una vigencia abierta.
    m = re.fullmatch(
        re.escape(domain) + r": del 1 de (\w+) de (20\d{2}) "
        r"al (\d{1,2}) de (\w+) de (20\d{2})\.?", text, re.I)
    if not m or m[1].lower() not in MONTHS or m[4].lower() not in MONTHS:
        raise ValueError("Período explícito no admitido")
    start, end = MONTHS.index(m[1].lower()) + 1, MONTHS.index(m[4].lower()) + 1
    if m[2] != m[5] or start > end or int(m[3]) != calendar.monthrange(int(m[5]), end)[1]:
        raise ValueError("El período debe delimitar meses completos del mismo año")
    return {"from": f"{m[2]}-{start:02}", "through": f"{m[5]}-{end:02}"}


def year(document):
    text = document[0].get_text("text", sort=True)
    # Año de destino expresado en el título; nunca el año de la URL o del mapping.
    # El preámbulo cita presupuestos anteriores: no buscar sus años como títulos.
    years = set(re.findall(
        r"\bOrden\s+[A-Z]+/\d+/\d{4},[^.]{0,1500}?\bnormas\s+legales\s+de\s+"
        r"cotización\b[^.]{0,1500}?\bpara\s+el\s+(?:ejercicio|año)\s+(20\d{2})\.",
        text, re.I))
    explicit = re.match(r"\s*Ejercicio\s+(20\d{2})\b", text, re.I)
    if explicit:
        years.add(explicit[1])
    if len(years) != 1:
        raise ValueError("Año documental ausente o ambiguo")
    return int(years.pop())


def base_scope(document, table, spec):
    proofs = (table.get("periodEvidence"), spec.get("columnEvidence"), spec.get("rowEvidence"))
    if any(p is None for p in proofs):
        return None
    valid_period = period(document, proofs[0], "Bases de cotización")
    if int(valid_period["from"][:4]) != table["year"]:
        raise ValueError("Año de base distinto del período acreditado")
    text, header = quote(document, proofs[1])
    row, row_box = quote(document, proofs[2])
    m = re.fullmatch(r"Bases? (mínimas?|máximas?) (euros/mes|euros/día)", text, re.I)
    if not m or row != spec["row"]:
        raise ValueError("Columna o grupo no acreditados")
    column = "minimum" if m[1].lower().startswith("mín") else "maximum"
    unit = "EUR/month" if m[2].lower() == "euros/mes" else "EUR/day"
    if (column, unit, spec["unit"]) != (spec["column"], spec["periodUnit"], "EUR"):
        raise ValueError("Columna/unidad distintas de la cabecera")
    cell = flujo.pymupdf.Rect(spec["bbox"])
    if (proofs[1]["page"] != table["page"] or proofs[2]["page"] != table["page"]
            or header.y1 > cell.y0 or min(header.x1, cell.x1) <= max(header.x0, cell.x0)
            or row_box.x1 > cell.x0 or min(row_box.y1, cell.y1) <= max(row_box.y0, cell.y0)):
        raise ValueError("Cabecera/grupo ajenos a la celda")
    local_period(document, proofs[0], table["page"], header, "Bases de cotización")
    return {"year": table["year"], "column": column, "periodUnit": unit,
            "period": valid_period, "scopeEvidence": {
                "period": proofs[0], "column": proofs[1], "row": proofs[2]}}
