#!/usr/bin/env python3
"""Adquisición temporal de originales; no valida su autenticidad ni contenido."""

import argparse
from datetime import datetime, timezone
import fcntl
import hashlib
import json
import os
from pathlib import Path
import tempfile
import time
import urllib.error
import urllib.request


def download(url: str, root: Path) -> dict:
    root.mkdir(parents=True, exist_ok=True)
    index = root / "urls"
    blobs = root / "sha256"
    index.mkdir(exist_ok=True)
    blobs.mkdir(exist_ok=True)
    key = hashlib.sha256(url.encode()).hexdigest()
    record = index / (key + ".json")
    lock_path = Path(tempfile.gettempdir()) / ("irobopf-download-" + str(os.getuid()) + ".lock")
    with lock_path.open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if record.exists():
            cached = json.loads(record.read_text())
            path = Path(cached["localPath"])
            if path.exists() and hashlib.sha256(path.read_bytes()).hexdigest() == cached["sha256"]:
                return cached
        request = urllib.request.Request(url, headers={
            "User-Agent": "IRoboPF-auditoria/1.0 (+https://github.com/eliesgalvira/IRoboPF)",
            "Accept-Encoding": "identity",
        })
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                body = response.read()
                headers = dict(response.headers.items())
                status = response.status
                final_url = response.url
                mime = response.headers.get_content_type()
        finally:
            time.sleep(2)
        sha256 = hashlib.sha256(body).hexdigest()
        blob = blobs / sha256
        if not blob.exists():
            blob.write_bytes(body)
        metadata = {
            "canonicalUrl": url,
            "finalUrl": final_url,
            "retrievedAt": datetime.now(timezone.utc).isoformat(),
            "httpStatus": status,
            "headers": headers,
            "sha256": sha256,
            "sha512": hashlib.sha512(body).hexdigest(),
            "size": len(body),
            "mimeType": mime,
            "localPath": str(blob.resolve()),
            "authenticity": {"status": "not-validated"},
        }
        record.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n")
        return metadata


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[2] / ".cache/procedencia")
    args = parser.parse_args()
    if not args.url.startswith("https://"):
        parser.error("Se requiere una URL HTTPS oficial revisada por el auditor")
    print(json.dumps(download(args.url, args.root), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
