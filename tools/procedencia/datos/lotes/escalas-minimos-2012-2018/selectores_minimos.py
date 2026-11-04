"""Selectores de artículos 57–60: sujeto y ordinal, sin igualdad de importes."""
import re


def manual_contribuyente(page):
    """Mínimo general anual por frase normativa; nunca por igualdad de importe.

    Conserva todas las palabras y cajas de la frase para distinguirla de los
    ejemplos, umbrales de rentas y reglas autonómicas de la misma página.
    """
    words = page.get_text('words', flags=0, sort=True)
    text = ''
    spans = []
    for word in words:
        start = len(text)
        text += word[4] + ' '
        spans.append((start, len(text) - 1, word))
    pattern = (r'El mínimo del contribuyente es, con carácter general, de '
               r'(?P<amount>[0-9][0-9.,]*) (?P<unit>euros) anuales')
    hits = list(re.finditer(pattern, text))
    if len(hits) != 1:
        raise ValueError('Cuantía general anual ausente o ambigua')
    hit = hits[0]
    selected = {}
    for field in ('amount', 'unit'):
        a, b = hit.span(field)
        tokens = [w for start, end, w in spans if start >= a and end <= b]
        if len(tokens) != 1:
            raise ValueError('Token monetario/unidad dividido')
        selected[field] = tokens[0]
    phrase = [list(w[:5]) for start, end, w in spans if start < hit.end() and end > hit.start()]
    def box(word):
        return [word[0] - .02, word[1] - .02, word[2] + .02, word[3] + .02]
    return {'path': ['contribuyente', 'general'], 'bbox': box(selected['amount']),
            'unit': 'EUR', 'subject': 'contribuyente; cuantía general',
            'period': 'anual', 'literal': ' '.join(w[4] for w in phrase), 'words': phrase,
            'unitEvidence': {'bbox': box(selected['unit']), 'literal': 'euros',
                             'unit': 'EUR', 'relation': 'adjacent'}}


def statutory(document, pages):
    words = []
    for pn in pages:
        words.extend((pn, w) for w in document[pn-1].get_text('words', sort=True))
    text = ''; spans = []
    for pn, w in words:
        start = len(text); text += w[4]+' '; spans.append((start,len(text)-1,pn,w))
    starts = []
    headings={57:'Mínimo del contribuyente',58:'Mínimo por descendientes',59:'Mínimo por ascendientes',60:'Mínimo por discapacidad'}
    for article in (57,58,59,60):
        hits = list(re.finditer(r'Artículo '+str(article)+r'\.\s+'+re.escape(headings[article])+r'\.',text))
        if len(hits) != 1:
            raise ValueError('Article heading absent or ambiguous: '+str(article))
        starts.append(hits[0].start())
    fields = [
        [('contribuyente','general'),('contribuyente','adicionalMayor65'),('contribuyente','adicionalMayor75')],
        [('descendientes','primero'),('descendientes','segundo'),('descendientes','tercero'),('descendientes','cuartoYSiguientes'),('descendientes','adicionalMenorTres')],
        [('ascendientes','mayor65OConDiscapacidad'),('ascendientes','adicionalMayor75')],
    ]
    selected = []
    for i,start in enumerate(starts):
        end = starts[i+1] if i<3 else len(text)
        segment = text[start:end]
        # La selección reconoce el token monetario y su unidad. La interpretación
        # decimal y los signos quedan exclusivamente en flujo.pdf_table.
        amounts=list(re.finditer(r'(?P<amount>[0-9][0-9.,]*)\s+euros',segment))
        if i==0:
            if len(amounts)!=3:raise ValueError('Article 57 structure differs')
            chosen=list(zip(fields[0],amounts,strict=True))
        elif i==1:
            if len(amounts)!=6 or 'rentas anuales' not in segment:raise ValueError('Article 58 structure differs')
            chosen=list(zip(fields[1],amounts[1:],strict=True))
            for ordinal,m in zip(('primero','segundo','tercero','cuarto'),amounts[1:5],strict=True):
                if ordinal not in segment[m.end():m.end()+65]:raise ValueError('Descendant ordinal differs')
        elif i==2:
            if len(amounts)!=3 or 'rentas anuales' not in segment:raise ValueError('Article 59 structure differs')
            chosen=list(zip(fields[2],[amounts[0],amounts[2]],strict=True))
        else:
            # Detener antes del siguiente artículo o de las normas comunes.
            cut=re.search(r'(?:Cinco\.|Treinta y siete\.|Artículo 61\.)',segment)
            if cut:segment=segment[:cut.start()]
            amounts=list(re.finditer(r'(?P<amount>[0-9][0-9.,]*)\s+euros',segment))
            if len(amounts)!=6 or 'gastos de asistencia' not in segment:raise ValueError('Article 60 structure differs')
            conditions=('grado33Hasta65','grado65OMas','gastosAsistencia')
            chosen=[(('discapacidad','contribuyente',field),m) for field,m in zip(conditions,amounts[:3],strict=True)]
            chosen += [(('discapacidad',subject,field),m) for subject in ('ascendiente','descendiente') for field,m in zip(conditions,amounts[3:],strict=True)]
        for path,match in chosen:
            a,b=match.span('amount');a+=start;b+=start
            tokens=[(pn,w) for s,e,pn,w in spans if s>=a and e<=b]
            if len(tokens)!=1:raise ValueError('Monetary token split across geometry')
            pn,w=tokens[0]
            ustart=start+match.end()-len('euros');unit=[v for s,e,p,v in spans if p==pn and s==ustart]
            if len(unit)!=1:raise ValueError('Unit is not adjacent')
            def box(v):return [v[0]-.02,v[1]-.02,v[2]+.02,v[3]+.02]
            selected.append({'path':list(path),'page':pn,'bbox':box(w),'unit':'EUR',
                             'unitEvidence':{'bbox':box(unit[0]),'literal':'euros','unit':'EUR'},
                             'article':57+i,'role':'minimum-amount; excludes income eligibility thresholds'})
    return selected


def inherits_default(source, territory, year):
    """Una entrada base no acredita una herencia si el objeto final la sobrescribe."""
    name=re.escape(territory)
    pattern=r'(?m)^\s*(?:"'+name+r'"|'+name+r'):\s*(MINIMOS_[A-Z0-9_]+),'
    targets=re.findall(pattern,source)
    return bool(targets) and set(targets)=={f'MINIMOS_ESTATALES_{year}'}
