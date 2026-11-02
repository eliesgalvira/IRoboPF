"""Reextrae lote F y las citas complementarias; solo lee CAS explícitos.

Uso: uv run --no-project --with beautifulsoup4 --with pymupdf python verificar.py CAS...
"""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from bs4 import BeautifulSoup

here = Path(__file__).resolve().parent
lote = here.parents[1] / "lotes" / "f"
subprocess.run([sys.executable, str(lote / "verificar_citas.py"), *sys.argv[1:]], check=True)
roots = [Path(p) for p in sys.argv[1:]]
citas = json.loads((here / "evidencia.json").read_text())["citasComplementarias"]
for cita in citas:
    digest = cita["sha256"]
    file = next(p for root in roots for p in (root / digest, root / "sha256" / digest) if p.is_file())
    data = file.read_bytes()
    assert hashlib.sha256(data).hexdigest() == digest
    loc = cita["localizador"]
    text = BeautifulSoup(data, "html.parser").select_one(loc["selector"]).get_text(" ", strip=True)
    assert text[loc["inicio"]:loc["fin"]] == cita["textoLiteral"], cita["id"]
rows = json.loads((here / "decisiones.json").read_text())["deducciones"]
assert len(rows) == len({x["codigo"] for x in rows}) == 51
assert sum(x["decisionFicha"] == "reserva_normativa" for x in rows) == 3
print("51 decisiones; 3 citas complementarias verificadas; 3 reservas delimitadas")
