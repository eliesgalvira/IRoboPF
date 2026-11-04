"""Selectores de tablas AEAT por cabeceras y líneas, sin parser numérico nuevo.

Alternativa explícita para cuadros fusionados por find_tables; no interpreta prosa.
"""

import re


def line_groups(words):
    groups = []
    for word in sorted(words, key=lambda w: (w[1], w[0])):
        if not groups or abs(groups[-1][0][1] - word[1]) > 2:
            groups.append([word])
        else:
            groups[-1].append(word)
    return groups


def box(words):
    return [
        min(w[0] for w in words) - 0.05,
        min(w[1] for w in words) - 0.05,
        max(w[2] for w in words) + 0.05,
        max(w[3] for w in words) + 0.05,
    ]


def sections(page):
    words = page.get_text("words", flags=0, sort=True)
    headers = []
    for word in words:
        if word[4].lower() != "cuota":
            continue
        nearby = [w for w in words if abs(w[1] - word[1]) < 18]
        resto = [w for w in nearby if w[4].lower() == "resto" and w[0] > word[0]]
        tipo = [w for w in nearby if w[4].lower() == "tipo" and w[0] > word[0]]
        base = [w for w in nearby if w[4].lower() == "base" and w[0] < word[0]]
        if not (resto and tipo and base):
            continue
        anchors = [
            min(w[0] for w in base),
            word[0],
            min(w[0] for w in resto),
            min(w[0] for w in tipo),
        ]
        if anchors != sorted(anchors):
            continue
        headers.append((word[1], anchors))
    headers.sort()
    result = []
    for h, (y, anchors) in enumerate(headers):
        end = headers[h + 1][0] if h + 1 < len(headers) else page.rect.height - 30
        bounds = [a - 3 for a in anchors] + [page.rect.width - 20]
        groups = line_groups(
            [w for w in words if y + 15 < w[1] < end - 2 and w[0] >= bounds[0]]
        )
        rows = []
        incomplete = []
        for group in groups:
            columns = [
                [w for w in group if bounds[j] <= w[0] < bounds[j + 1]]
                for j in range(4)
            ]
            # Geometric candidate rule independent of normalization and engine values.
            if not columns[0] or not re.match(r"^[+\-]?[0-9]", columns[0][0][4]):
                continue
            if not columns[1] or not re.match(r"^[+\-]?[0-9]", columns[1][0][4]):
                continue
            if not all(columns):
                incomplete.append(
                    {"bbox": box(group), "literal": " ".join(w[4] for w in group)}
                )
                continue
            rows.append([box(c) for c in columns])
        header_boxes = [
            [bounds[j], max(0, y - 2), bounds[j + 1], min(y + 30, end)]
            for j in range(4)
        ]
        result.append(
            {
                "y": y,
                "bounds": bounds,
                "headerBoxes": header_boxes,
                "rows": rows,
                "incomplete": incomplete,
            }
        )
    return result
