"""Control independiente de los cuatro destinos con markdown-it-py==4.0.0."""
from urllib.parse import parse_qsl, urlsplit

from markdown_it import MarkdownIt

for i, query in enumerate(('session', '%54OKEN=')):
    for kind, text in (
        ('angular', f'[norma](<https://example.invalid/articulo)?{query}>)'),
        ('escapado', f'[norma](https://example.invalid/articulo\\)?{query})'),
    ):
        tokens = MarkdownIt('commonmark').parseInline(text)[0].children
        links = [t.attrGet('href') for t in tokens if t.type == 'link_open']
        assert len(links) == 1, f'limite-{i}-{kind}: enlace no reconocido'
        keys = {k.casefold() for k, _ in parse_qsl(
            urlsplit(links[0]).query, keep_blank_values=True)}
        assert keys & {'token', 'session'}, f'limite-{i}-{kind}: destino distinto'
        print(f'limite-{i}-{kind}: destino sensible confirmado por CommonMark')
