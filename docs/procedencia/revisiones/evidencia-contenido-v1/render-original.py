from pathlib import Path
import pymupdf
p=Path('docs/procedencia/corpus/fixtures/sha256/8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660')
with pymupdf.open(p) as doc:
 page=doc[3]
 page.get_pixmap(dpi=96,annots=False).save('../original-pagina4.png')
 Path('../original-pagina4.txt').write_text(page.get_text())
 print('PDF páginas',len(doc),'página 4',page.rect,'rotación',page.rotation)
