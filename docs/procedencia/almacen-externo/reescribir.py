"""Remove only the authorized paths, preserving raw commit metadata and topology."""
import sys, subprocess, json
from pathlib import Path
from functools import cache
repo, output = map(Path, sys.argv[1:])
output.mkdir(parents=True, exist_ok=True)
def git(*args, data=None):
    return subprocess.check_output(["git", "-C", str(repo), *args], input=data)
assert git("rev-parse", "--is-bare-repository").strip() == b"true"
ref = "refs/heads/procedencia-documental"
tip = git("rev-parse", ref).decode().strip()
paths = ["docs/procedencia/implementaciones/contenidos/datos/objetos", "docs/procedencia/corpus/fixtures/sha256/e7b629a20bde61bcb42c54b2caf3af06f2b44613fc6f89718ff5ff9763d4a4f4"]
refs_before = git("show-ref")
@cache
def tree(oid, prefix=""):
    result = []
    for entry in git("ls-tree", "-z", oid).split(b"\0"):
        if not entry: continue
        meta, name = entry.split(b"\t", 1)
        mode, kind, child = meta.split()
        path = prefix + name.decode()
        if path in paths: continue
        if kind == b"tree" and any(p.startswith(path + "/") for p in paths):
            child = tree(child.decode(), path + "/").encode()
            if not git("ls-tree", child.decode()): continue
        result.append(mode + b" " + kind + b" " + child + b"\t" + name + b"\0")
    return git("mktree", "-z", data=b"".join(result)).decode().strip()
commits = git("rev-list", "--reverse", "--topo-order", tip).decode().split()
mapping = {}; proofs = []; signatures = []
for old in commits:
    raw = git("cat-file", "commit", old)
    headers, message = raw.split(b"\n\n", 1)
    fields = []
    for field in headers.split(b"\n"):
        if field.startswith(b"tree "):
            oldtree = field[5:].decode(); newtree = tree(oldtree)
            field = b"tree " + newtree.encode()
        elif field.startswith(b"parent "):
            field = b"parent " + mapping[field[7:].decode()].encode()
        fields.append(field)
    newraw = b"\n".join(fields) + b"\n\n" + message
    new = git("hash-object", "-t", "commit", "-w", "--stdin", data=newraw).decode().strip()
    mapping[old] = new
    # Every other file, mode and object ID must be identical, for EVERY commit.
    before = git("ls-tree", "-rz", oldtree).split(b"\0")
    expected = []
    for entry in before:
        if not entry: continue
        path = entry.split(b"\t", 1)[1].decode()
        if not any(path == p or path.startswith(p + "/") for p in paths): expected.append(entry)
    actual = [e for e in git("ls-tree", "-rz", newtree).split(b"\0") if e]
    assert expected == actual, old
    assert git("cat-file", "commit", new) == newraw
    if old != new and b"\ngpgsig " in headers: signatures.append(old)
    proofs.append({"old":old, "new":new, "otherFiles":len(actual), "metadataAndMessagePreserved":True})
assert len(commits) == len(git("rev-list", mapping[tip]).decode().split())
# A changed signed commit requires an explicit decision; never silently invalidate.
assert not signatures, signatures
git("update-ref", ref, mapping[tip], tip)
refs_after = git("show-ref")
assert [x for x in refs_before.splitlines() if not x.endswith(b" " + ref.encode())] == [x for x in refs_after.splitlines() if not x.endswith(b" " + ref.encode())]
(output/"mapa-commits.tsv").write_text("old\tnew\n" + "".join(a+"\t"+b+"\n" for a,b in mapping.items()))
(output/"verificacion-historia.json").write_text(json.dumps({"oldTip":tip,"newTip":mapping[tip],"commits":len(commits),"changed":sum(a!=b for a,b in mapping.items()),"removedPaths":paths,"changedSignedCommits":signatures,"commitsVerified":proofs},indent=2)+"\n")
print(json.dumps({"oldTip":tip,"newTip":mapping[tip],"commits":len(commits),"changed":sum(a!=b for a,b in mapping.items())}))
