"""Candidate section identity across page breaks; never selects by amount."""
import re
import unicodedata


def scope_before(pages, page_number, top, names):
    pieces=[]
    for number, words in sorted(pages.items()):
        if number>page_number:continue
        pieces.append(' '.join(w[4] for w in words if number<page_number or w[3]<top))
    text=' '.join(pieces).lower().replace('\xad','')
    text=''.join(c for c in unicodedata.normalize('NFD',text) if unicodedata.category(c)!='Mn')
    text=re.sub(r'(\w)-\s+(\w)',r'\1\2',text)
    hits=[(m.start(),territory) for name,territory in names.items() for m in re.finditer(re.escape(name),text)]
    return (max(hits)[1] if hits else 'estatal-comun'),text
