"""Manifiesto contra la base leída; no muta VCS ni elimina archivos."""
from pathlib import Path
import subprocess
import hashlib
import difflib
import json

BASE = "eaed990c620b5fc4d3ff2e74dc68e0c8481c43db"
ROOT = Path.cwd()
OUT = ROOT / "docs/procedencia/implementaciones/publicacion-evidencia"
FILES = [
    "lib/procedencia/modelo.ts", "lib/procedencia/almacen.ts",
    "lib/procedencia/ficha.tsx", "lib/procedencia/http.ts", "lib/procedencia/io.mjs",
    "scripts/procedencia/contenido-publicar.mjs", "scripts/procedencia/contenido-verificar.mjs",
    "scripts/procedencia/evidencia-contenido.mjs", "scripts/procedencia/explicacion-version.mjs",
    "app/procedencia/[snapshot]/[id]/[revision]/route.ts",
    "app/procedencia/[snapshot]/objetos/[hash]/route.ts",
    "tests/publicacion-evidencia.test.ts", "schemas/procedencia/contenido/snapshot.schema.json",
]
files = FILES + [str(p.relative_to(ROOT)) for p in OUT.iterdir()
                 if p.is_file() and p.name not in ("MANIFIESTO.json", "entrega.patch")]
entries = []
patch = []
for path in sorted(files):
    current = (ROOT / path).read_bytes()
    previous = subprocess.run(["git", "show", f"{BASE}:{path}"], capture_output=True, check=False)
    old = previous.stdout if previous.returncode == 0 else b""
    entries.append({"path": path, "sha256": hashlib.sha256(current).hexdigest(),
                    "size": len(current), "baseSha256": hashlib.sha256(old).hexdigest()
                    if previous.returncode == 0 else None})
    patch.extend(difflib.unified_diff(old.decode().splitlines(True), current.decode().splitlines(True),
                 fromfile=f"a/{path}" if previous.returncode == 0 else "/dev/null", tofile=f"b/{path}"))
base_paths = subprocess.check_output(["git", "ls-tree", "-rz", "--name-only", BASE]).decode().split("\0")
missing = [p for p in base_paths if p and not (ROOT / p).exists()]
if missing:
    raise RuntimeError(f"Ausencias de base: {missing}")
(OUT / "entrega.patch").write_text("".join(patch))
(OUT / "MANIFIESTO.json").write_text(json.dumps({"base": BASE, "archivosBase": len([p for p in base_paths if p]),
    "borrados": missing, "archivos": entries}, ensure_ascii=False, indent=2) + "\n")
