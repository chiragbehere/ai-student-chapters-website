"""Independent structural validator for the generated .glb files (no external glTF library available offline)."""
import os, sys, glob, struct
import numpy as np
from glb import read_glb
from cc_common import ROOT

CT = {5126: ("f4", 4), 5123: ("u2", 2), 5125: ("u4", 4), 5121: ("u1", 1)}
NC = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}


def accessor_data(js, binb, i):
    a = js["accessors"][i]; bv = js["bufferViews"][a["bufferView"]]
    dt, sz = CT[a["componentType"]]
    n = a["count"] * NC[a["type"]]
    off = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    assert off % sz == 0, f"accessor {i} misaligned"
    assert off + n * sz <= bv.get("byteOffset", 0) + bv["byteLength"], f"accessor {i} overruns its bufferView"
    arr = np.frombuffer(binb, dtype=dt, count=n, offset=off)
    return arr.reshape(a["count"], NC[a["type"]])


def validate(path):
    errs = []
    js, binb = read_glb(path)
    base = os.path.dirname(path)
    assert js["asset"]["version"] == "2.0"
    assert js["buffers"][0]["byteLength"] <= len(binb)
    for i, bv in enumerate(js["bufferViews"]):
        if bv["byteOffset"] + bv["byteLength"] > len(binb): errs.append(f"bufferView {i} out of range")
    for i, a in enumerate(js["accessors"]):
        d = accessor_data(js, binb, i)
        if not np.isfinite(d.astype(float)).all(): errs.append(f"accessor {i} has NaN/inf")
        if "min" in a:
            if not np.allclose(d.min(0), a["min"], atol=1e-4) or not np.allclose(d.max(0), a["max"], atol=1e-4):
                errs.append(f"accessor {i} min/max mismatch")
    tris = 0
    for m in js["meshes"]:
        for p in m["primitives"]:
            nv = js["accessors"][p["attributes"]["POSITION"]]["count"]
            for k, ai in p["attributes"].items():
                if js["accessors"][ai]["count"] != nv: errs.append(f"{m['name']}: attribute {k} count mismatch")
            if "indices" in p:
                idx = accessor_data(js, binb, p["indices"]).ravel()
                if idx.max() >= nv: errs.append(f"{m['name']}: index >= vertex count")
                if len(idx) % 3: errs.append(f"{m['name']}: index count not multiple of 3")
                # degenerate triangles
                pos = accessor_data(js, binb, p["attributes"]["POSITION"]).astype(float)
                t = idx.reshape(-1, 3)
                ar = np.linalg.norm(np.cross(pos[t[:, 1]] - pos[t[:, 0]], pos[t[:, 2]] - pos[t[:, 0]]), axis=1)
                tris += len(t)
                nz = (ar < 1e-12).sum()
                if nz > 0.02 * len(t) and nz > 4: errs.append(f"{m['name']}: {nz}/{len(t)} degenerate triangles")
            nrm = accessor_data(js, binb, p["attributes"]["NORMAL"]).astype(float) if "NORMAL" in p["attributes"] else None
            if nrm is not None:
                ln = np.linalg.norm(nrm, axis=1)
                if np.abs(ln - 1).max() > 1e-2: errs.append(f"{m['name']}: non-unit normals")
            if "material" in p and p["material"] >= len(js.get("materials", [])): errs.append(f"{m['name']}: bad material ref")
    for n in js["nodes"]:
        if "mesh" in n and n["mesh"] >= len(js["meshes"]): errs.append(f"node {n['name']}: bad mesh ref")
        for c in n.get("children", []):
            if c >= len(js["nodes"]): errs.append(f"node {n['name']}: bad child")
    for im in js.get("images", []):
        if "uri" in im and not os.path.isfile(os.path.normpath(os.path.join(base, im["uri"]))):
            errs.append(f"missing texture {im['uri']}")
    for an in js.get("animations", []):
        for s in an["samplers"]:
            ti = accessor_data(js, binb, s["input"]).ravel()
            if not (np.diff(ti) > 0).all(): errs.append(f"anim {an['name']}: times not strictly increasing")
            if js["accessors"][s["output"]]["count"] != len(ti): errs.append(f"anim {an['name']}: output/input count mismatch")
        for c in an["channels"]:
            if c["target"]["node"] >= len(js["nodes"]): errs.append(f"anim {an['name']}: bad node")
    # every extension used must be declared
    used = set()
    for m in js.get("materials", []): used |= set(m.get("extensions", {}).keys())
    if used - set(js.get("extensionsUsed", [])): errs.append("undeclared extensions")
    return errs, tris, len(js["nodes"])


if __name__ == "__main__":
    bad = 0
    files = sorted(glob.glob(os.path.join(ROOT, "models", "**", "*.glb"), recursive=True))
    for f in files:
        try:
            e, t, n = validate(f)
        except Exception as ex:
            e, t, n = [f"EXC {type(ex).__name__}: {ex}"], 0, 0
        print(("OK   " if not e else "FAIL ") + os.path.relpath(f, ROOT), f"tris={t} nodes={n}", *e)
        bad += bool(e)
    print(f"{len(files)} files, {bad} failing")
    sys.exit(1 if bad else 0)
