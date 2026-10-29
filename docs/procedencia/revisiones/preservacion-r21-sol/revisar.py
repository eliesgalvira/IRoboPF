"""Revisión sin fixes; fixtures propios y fallos fsync exhaustivos por llamada."""

import copy
import hashlib
import json
import os
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

ROOT = Path.cwd()
OUT = ROOT / "docs/procedencia/revisiones/preservacion-r21-sol"
SCRATCH = ROOT / ".cache/preservacion-r21-sol"
SCRATCH.mkdir(parents=True, exist_ok=True)


def history():
    sys.path.insert(0, str(ROOT / "docs/procedencia/revisiones/preservacion-v3-sol"))
    import auditar

    auditar.SCRATCH = SCRATCH
    import adversos_test

    sys.path.insert(0, str(ROOT / "docs/procedencia/correcciones/preservacion-r21"))
    import adversos

    return adversos_test, adversos


old, corrected = history()
r = old.r


def save(name, data):
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def fixture():
    case = old.Adversos("test_control_timestamp_and_parser")
    case.setUp()
    case.store()
    return case


def inherited():
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(corrected.ContratoCompleto)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    save(
        "diez-resultados.json",
        dict(
            tests=result.testsRun,
            failures=len(result.failures),
            errors=len(result.errors),
        ),
    )
    return result.wasSuccessful()


def mutations():
    c = fixture()
    original = copy.deepcopy(c.m)
    rows = []

    def probe(label, change, expect_reject=True):
        c.m = copy.deepcopy(original)
        change(c.m)
        c.store()
        try:
            r.load()
            rejected, error = False, None
        except (ValueError, TypeError, KeyError) as exc:
            rejected, error = True, type(exc).__name__ + ": " + str(exc)
        rows.append(
            dict(
                case=label, rejected=rejected, expectedReject=expect_reject, error=error
            )
        )

    nodes = [
        (),
        ("baseline",),
        ("transport",),
        ("annex", 0),
        ("annex", 0, "acquisitions", 0),
        ("dependencies", 0),
    ]

    def at(m, path):
        for key in path:
            m = m[key]
        return m

    for path in nodes:
        obj = at(original, path)
        for key in obj:
            probe(f"missing:{path}:{key}", lambda m, p=path, k=key: at(m, p).pop(k))
        probe(
            f"private:{path}",
            lambda m, p=path: at(m, p).update(headers={"Cookie": "PRIVATE_SENTINEL"}),
        )
    for path in [
        (),
        ("baseline",),
        ("transport",),
        ("annex", 0),
        ("annex", 0, "acquisitions", 0),
        ("dependencies", 0),
    ]:
        for key, value in at(original, path).items():
            if type(value) is int:
                for bad in [True, False, float(value), str(value), None, -1]:
                    probe(
                        f"type:{path}:{key}:{bad!r}",
                        lambda m, p=path, k=key, b=bad: at(m, p).__setitem__(k, b),
                    )
    for prefix in ["checkout:", "parent:"]:
        for rel in [
            "../escape",
            "./escape",
            "/escape",
            "a/../escape",
            "a/./escape",
            "a//b",
            "a/",
            "a\\b",
            "",
            "a\n",
        ]:
            probe(
                "source:" + repr(prefix + rel),
                lambda m, s=prefix + rel: m["annex"][0].update(sources=[s]),
            )
        probe(
            "valid:" + prefix,
            lambda m, s=prefix + "dir/file": m["annex"][0].update(sources=[s]),
            False,
        )
    for field in ["dependencies", "annex"]:
        probe(
            "duplicate:" + field, lambda m, f=field: m[f].append(copy.deepcopy(m[f][0]))
        )
    for field in ["sources", "references", "acquisitions"]:

        def dup(m, f=field):
            obj = m["annex"][0]
            if not obj[f]:
                obj[f] = ["adquisicion.json"]
            obj[f].append(copy.deepcopy(obj[f][0]))

        probe("duplicate:annex:" + field, dup)
    for field in ["unresolvedReferences", "exclusions"]:
        value = (
            {"sha256": "f" * 64, "sources": ["doc.json"]}
            if field == "unresolvedReferences"
            else {"path": "doc.json", "reason": "URL-no-admitida"}
        )
        probe(
            "duplicate:" + field,
            lambda m, f=field, v=value: m.update({f: [v, copy.deepcopy(v)]}),
        )
        probe(
            "private:" + field,
            lambda m, f=field, v=value: m.update(
                {f: [dict(v, headers={"Cookie": "PRIVATE_SENTINEL"})]}
            ),
        )
    for label, change in [
        ("missing-event-dependency", lambda m: m.update(dependencies=[])),
        (
            "wrong-event-dependency",
            lambda m: m["annex"][0]["acquisitions"][0].update(sourceSha256="f" * 64),
        ),
        (
            "secondary-primary",
            lambda m: m["annex"][0].update({"class": "documento-primario-candidato"}),
        ),
        ("secondary-facsimile", lambda m: m["annex"][0].update({"class": "facsimil"})),
        (
            "dependency-absolute",
            lambda m: m["dependencies"][0].update(path="/private/file"),
        ),
        ("reference-escape", lambda m: m["annex"][0].update(references=["../file"])),
    ]:
        probe(label, change)
    save("mutaciones.json", rows)
    c.doCleanups()


def fsync_matrix():
    rows = []
    actual = os.fsync
    c = fixture()
    calls = []

    def trace(fd):
        calls.append(os.readlink("/proc/self/fd/" + str(fd)))
        actual(fd)

    with patch.object(os, "fsync", trace):
        r.transfer(c.dest, c.source)
    c.doCleanups()
    for index in range(len(calls)):
        c = fixture()
        count = 0
        failed_at = None

        def fail(fd):
            nonlocal count, failed_at
            current = count
            count += 1
            if current == index:
                failed_at = os.readlink("/proc/self/fd/" + str(fd))
                raise OSError("fsync inducido")
            actual(fd)

        error = None
        try:
            with patch.object(os, "fsync", fail):
                r.transfer(c.dest, c.source)
        except OSError as exc:
            error = type(exc).__name__
        visible = (c.dest / "manifest.json").exists()
        recovery = None
        if visible:
            recovery = r.confirm(c.dest)["durability"]
        rows.append(
            dict(
                index=index,
                stage=calls[index].replace(str(SCRATCH), "<scratch>"),
                failedAt=failed_at,
                error=error,
                markerVisible=visible,
                recovery=recovery,
                correct=(
                    error == "PublicationDurabilityUnknown"
                    if visible
                    else error in ("OSError", "PublicationDurabilityUnknown")
                ),
            )
        )
        c.doCleanups()
    save("fsync.json", rows)
    assert all(row["correct"] for row in rows)


def routes():
    rows = []
    for prefix in ("checkout:", "parent:"):
        c = fixture()
        try:
            c.m["annex"][0]["sources"] = [prefix + "payload"]
            c.store()
            with patch.object(r, "ROOT", c.work), patch.object(r, "PARENT", c.work):
                receipt = r.transfer(c.dest)
            rows.append(dict(prefix=prefix, durability=receipt["durability"]))
        finally:
            c.doCleanups()
    assert len(r.TGSS_PUBLIC_URLS) == 35
    assert all(r.url(u) == u for u in r.TGSS_PUBLIC_URLS)
    for suffix in (
        "PRIVATE_SENTINEL",
        "123",
        "%2e%2e/private",
        "../private",
        "file?token=PRIVATE_SENTINEL",
    ):
        assert r.url("https://www.seg-social.es/descarga/es/" + suffix) is None
    c = fixture()
    try:
        c.m["annex"][0]["acquisitions"][0]["canonicalUrl"] = (
            "https://www.boe.es/buscar/doc.php?id=BOE-A-2006-20764"
        )
        c.store()
        r.load()
        c.m["annex"][0]["acquisitions"][0]["finalUrl"] = c.m["annex"][0][
            "acquisitions"
        ][0]["canonicalUrl"]
        c.m["annex"][0]["class"] = "documento-primario-candidato"
        c.store()
        r.load()
        rows.append(
            dict(
                classification="secondary with official canonical; primary with both official",
                passed=True,
            )
        )
    finally:
        c.doCleanups()
    save("rutas-urls.json", rows)


def real():
    m, t, objects = r.load()
    for name, expected in [
        (
            "manifest.json",
            "147e90bf15aa6a82e71b304bd6bd8983983007c2b07ed6e306f1ca244f3ae8be",
        ),
        (
            "transporte-v2.json",
            "b4e91adcdd69dbe62f221d97bc8910ad1243719b8bdcb63df095ce5679c8db9e",
        ),
    ]:
        assert hashlib.sha256((r.HERE / name).read_bytes()).hexdigest() == expected
    rows = []
    for folder in ["paquete-v3", "restauracion-v3"]:
        dest = (
            Path("/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion") / folder
        )
        independent = []
        for area, entries in [("sha256", objects), ("dependencies", m["dependencies"])]:
            for obj in entries:
                path = dest / area / obj["sha256"]
                assert not any(p.is_symlink() for p in (path, *path.parents))
                assert path.is_file()
                a, b, size = hashlib.sha256(), hashlib.sha512(), 0
                with path.open("rb") as stream:
                    for chunk in iter(lambda: stream.read(1048576), b""):
                        a.update(chunk)
                        b.update(chunk)
                        size += len(chunk)
                fp = dict(sha256=a.hexdigest(), sha512=b.hexdigest(), size=size)
                assert fp == {k: obj[k] for k in fp}
                independent.append(dict(area=area, **fp))
        save("bytes-" + folder + ".json", independent)
        receipt = r.verify(dest)
        rows.append(
            dict(copy=folder, objects=len(receipt["objects"]), bytes=receipt["bytes"])
        )
    save(
        "real.json",
        dict(copies=rows, dependencies=len(m["dependencies"]), objects=len(objects)),
    )


if __name__ == "__main__":
    if sys.argv[1] == "inherited":
        sys.exit(0 if inherited() else 1)
    elif sys.argv[1] == "mutations":
        mutations()
    elif sys.argv[1] == "fsync":
        fsync_matrix()
    elif sys.argv[1] == "real":
        real()
    elif sys.argv[1] == "routes":
        routes()
