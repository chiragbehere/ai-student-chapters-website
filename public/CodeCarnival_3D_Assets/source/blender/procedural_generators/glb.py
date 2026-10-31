"""Minimal glTF 2.0 binary (.glb) writer + procedural mesh toolkit (numpy only).

Mesh dict convention:  {"pos": (N,3) f32, "nrm": (N,3) f32 | None, "uv": (N,2) f32 | None,
                        "col": (N,4) f32 | None, "idx": (M,3) int}
"""
import json
import struct
import numpy as np

FLOAT, U16, U32 = 5126, 5123, 5125


# =============================================================================== mesh toolkit
def normalize(v, eps=1e-9):
    return v / (np.linalg.norm(v, axis=-1, keepdims=True) + eps)


def mk(pos, idx, nrm=None, uv=None, col=None):
    pos = np.asarray(pos, np.float32)
    idx = np.asarray(idx, np.int64).reshape(-1, 3)
    m = {"pos": pos, "idx": idx, "nrm": None if nrm is None else np.asarray(nrm, np.float32),
         "uv": None if uv is None else np.asarray(uv, np.float32),
         "col": None if col is None else np.asarray(col, np.float32)}
    if m["nrm"] is None:
        m["nrm"] = smooth_normals(pos, idx)
    return m


def smooth_normals(pos, idx):
    n = np.zeros_like(pos, dtype=np.float64)
    a, b, c = pos[idx[:, 0]], pos[idx[:, 1]], pos[idx[:, 2]]
    fn = np.cross(b - a, c - a)
    for k in range(3):
        np.add.at(n, idx[:, k], fn)
    return normalize(n).astype(np.float32)


def merge(meshes):
    meshes = [m for m in meshes if m is not None and len(m["pos"])]
    off = 0
    P, N, U, C, I = [], [], [], [], []
    has_uv = any(m["uv"] is not None for m in meshes)
    has_col = any(m["col"] is not None for m in meshes)
    for m in meshes:
        n = len(m["pos"])
        P.append(m["pos"]); N.append(m["nrm"])
        U.append(m["uv"] if m["uv"] is not None else np.zeros((n, 2), np.float32))
        C.append(m["col"] if m["col"] is not None else np.ones((n, 4), np.float32))
        I.append(m["idx"] + off)
        off += n
    return {"pos": np.concatenate(P), "nrm": np.concatenate(N),
            "uv": np.concatenate(U) if has_uv else None,
            "col": np.concatenate(C) if has_col else None, "idx": np.concatenate(I)}


def transform(m, scale=1.0, rot=None, trans=(0, 0, 0)):
    """Return a transformed copy. scale: scalar or (3,), rot: 3x3 matrix."""
    p = m["pos"].astype(np.float64) * np.asarray(scale, np.float64)
    n = m["nrm"].astype(np.float64)
    if rot is not None:
        p = p @ rot.T
        n = n @ rot.T
    p = p + np.asarray(trans, np.float64)
    r = dict(m)
    r["pos"] = p.astype(np.float32)
    r["nrm"] = normalize(n).astype(np.float32)
    return r


def flat(m):
    """Un-weld to per-face normals (faceted / low-poly look)."""
    idx = m["idx"].reshape(-1)
    pos = m["pos"][idx]
    uv = None if m["uv"] is None else m["uv"][idx]
    col = None if m["col"] is None else m["col"][idx]
    tri = np.arange(len(idx)).reshape(-1, 3)
    a, b, c = pos[tri[:, 0]], pos[tri[:, 1]], pos[tri[:, 2]]
    fn = normalize(np.cross(b - a, c - a))
    nrm = np.repeat(fn, 3, axis=0)
    return {"pos": pos, "nrm": nrm.astype(np.float32), "uv": uv, "col": col, "idx": tri}


def set_color(m, rgba):
    m = dict(m)
    c = np.asarray(rgba, np.float32)
    m["col"] = np.tile(c, (len(m["pos"]), 1)) if c.ndim == 1 else c
    return m


def rot_x(a):
    c, s = np.cos(a), np.sin(a); return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])


def rot_y(a):
    c, s = np.cos(a), np.sin(a); return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])


def rot_z(a):
    c, s = np.cos(a), np.sin(a); return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])


def quat_axis(axis, ang):
    axis = np.asarray(axis, float); axis = axis / np.linalg.norm(axis)
    return np.concatenate([axis * np.sin(ang / 2), [np.cos(ang / 2)]])


def quat_mul(a, b):
    x1, y1, z1, w1 = a; x2, y2, z2, w2 = b
    return np.array([w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2, w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
                     w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2, w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2])


def quat_from_matrix(R):
    t = np.trace(R)
    if t > 0:
        s = np.sqrt(t + 1) * 2
        return np.array([(R[2, 1] - R[1, 2]) / s, (R[0, 2] - R[2, 0]) / s, (R[1, 0] - R[0, 1]) / s, 0.25 * s])
    i = np.argmax(np.diag(R))
    j, k = (i + 1) % 3, (i + 2) % 3
    s = np.sqrt(R[i, i] - R[j, j] - R[k, k] + 1) * 2
    q = np.zeros(4)
    q[i] = 0.25 * s
    q[j] = (R[j, i] + R[i, j]) / s
    q[k] = (R[k, i] + R[i, k]) / s
    q[3] = (R[k, j] - R[j, k]) / s
    return q


def recenter(m):
    """Move mesh so its bounding-box centre is the origin; return (mesh, centre)."""
    c = (m["pos"].min(0) + m["pos"].max(0)) / 2
    r = dict(m); r["pos"] = (m["pos"] - c).astype(np.float32)
    return r, c


def tube(path, radii, sides=6, closed=False, ref_up=None, uv_scale=(1.0, 1.0), cap_end=False,
         cap_start=False, color=None, twist=0.0, flatten=None):
    """Sweep a circle (or ellipse via `flatten`=(sx,sy) in frame space) along a polyline.
    Uses rotation-minimising frames unless `ref_up` is supplied (use for planar closed loops)."""
    path = np.asarray(path, np.float64)
    K = len(path)
    radii = np.broadcast_to(np.asarray(radii, np.float64), (K,)).copy()
    T = np.zeros_like(path)
    T[1:-1] = path[2:] - path[:-2]
    T[0] = path[1] - path[0]
    T[-1] = path[-1] - path[-2]
    if closed:
        T[0] = T[-1] = path[1] - path[-2]
    T = normalize(T)
    Nn = np.zeros_like(path); Bn = np.zeros_like(path)
    if ref_up is not None:
        up = np.asarray(ref_up, float)
        for i in range(K):
            n = np.cross(up, T[i])
            if np.linalg.norm(n) < 1e-6:
                n = np.cross([1, 0, 0], T[i])
            Nn[i] = n / np.linalg.norm(n)
            Bn[i] = np.cross(T[i], Nn[i])
    else:
        t0 = T[0]
        a = np.array([0, 1, 0]) if abs(t0[1]) < 0.9 else np.array([1, 0, 0])
        n = np.cross(a, t0); n /= np.linalg.norm(n)
        for i in range(K):
            n = n - np.dot(n, T[i]) * T[i]
            n /= (np.linalg.norm(n) + 1e-12)
            Nn[i] = n
            Bn[i] = np.cross(T[i], n)
    ang = np.linspace(0, 2 * np.pi, sides + 1)
    ca, sa = np.cos(ang), np.sin(ang)
    sx, sy = (1.0, 1.0) if flatten is None else flatten
    P = np.zeros((K, sides + 1, 3)); NRM = np.zeros_like(P)
    for i in range(K):
        a2 = ang + twist * i
        c, s = np.cos(a2), np.sin(a2)
        off = (Nn[i][None] * (c * sx)[:, None] + Bn[i][None] * (s * sy)[:, None])
        P[i] = path[i][None] + off * radii[i]
        NRM[i] = Nn[i][None] * c[:, None] / sx + Bn[i][None] * s[:, None] / sy
    seg = np.r_[0, np.cumsum(np.linalg.norm(np.diff(path, axis=0), axis=1))]
    U = np.broadcast_to((ang / (2 * np.pi) * uv_scale[0])[None], (K, sides + 1))
    V = np.broadcast_to((seg * uv_scale[1])[:, None], (K, sides + 1))
    vid = np.arange(K * (sides + 1)).reshape(K, sides + 1)
    quads = []
    for i in range(K - 1):
        for j in range(sides):
            a, b, c, d = vid[i, j], vid[i, j + 1], vid[i + 1, j + 1], vid[i + 1, j]
            quads.append((a, d, c)); quads.append((a, c, b))
    pos = P.reshape(-1, 3); nrm = normalize(NRM.reshape(-1, 3)); uv = np.stack([U.ravel(), V.ravel()], 1)
    idx = np.array(quads)
    # make winding outward: test with first quad
    tri = pos[idx[0]]
    fn = np.cross(tri[1] - tri[0], tri[2] - tri[0])
    if np.dot(fn, nrm[idx[0][0]]) < 0:
        idx = idx[:, ::-1]
    parts = [{"pos": pos, "nrm": nrm, "uv": uv, "idx": idx, "col": None}]
    for do, i, sgn in ((cap_end, K - 1, 1), (cap_start, 0, -1)):
        if do:
            apex = path[i] + T[i] * radii[i] * 0.6 * sgn
            ap = len(pos)
            ring = vid[i, :-1]
            cap_idx = [(ring[j], ring[(j + 1) % sides], 0) for j in range(sides)]
            cap_pos = np.vstack([pos[ring], apex[None]])
            cp_idx = np.array([(j, (j + 1) % sides, sides) for j in range(sides)])
            cn = normalize(cap_pos - path[i][None]) * 0.5 + (T[i] * sgn)[None] * 0.8
            tri = cap_pos[cp_idx[0]]
            fn = np.cross(tri[1] - tri[0], tri[2] - tri[0])
            if np.dot(fn, T[i] * sgn) < 0:
                cp_idx = cp_idx[:, ::-1]
            parts.append({"pos": cap_pos, "nrm": normalize(cn), "uv": np.zeros((sides + 1, 2)), "idx": cp_idx, "col": None})
    m = merge(parts)
    if color is not None:
        m = set_color(m, color)
    return m


def grid_mesh(nx, nz, fn, size, uv_tiles=1.0, flip=False):
    """Heightfield on XZ. fn(x,z)->(y, rgba or None). size=(sx,sz) centred at origin."""
    xs = np.linspace(-size[0] / 2, size[0] / 2, nx)
    zs = np.linspace(-size[1] / 2, size[1] / 2, nz)
    X, Z = np.meshgrid(xs, zs)
    Y, C = fn(X, Z)
    pos = np.stack([X, Y, Z], -1).reshape(-1, 3)
    uv = np.stack([(X / size[0] + 0.5) * uv_tiles, (Z / size[1] + 0.5) * uv_tiles], -1).reshape(-1, 2)
    vid = np.arange(nx * nz).reshape(nz, nx)
    a, b, c, d = vid[:-1, :-1], vid[:-1, 1:], vid[1:, 1:], vid[1:, :-1]
    idx = np.concatenate([np.stack([a, c, b], -1).reshape(-1, 3), np.stack([a, d, c], -1).reshape(-1, 3)])
    m = mk(pos, idx, uv=uv, col=None if C is None else C.reshape(-1, 4))
    return m


def icosphere(level=1, radius=1.0):
    t = (1 + 5 ** 0.5) / 2
    v = [(-1, t, 0), (1, t, 0), (-1, -t, 0), (1, -t, 0), (0, -1, t), (0, 1, t), (0, -1, -t), (0, 1, -t),
         (t, 0, -1), (t, 0, 1), (-t, 0, -1), (-t, 0, 1)]
    f = [(0, 11, 5), (0, 5, 1), (0, 1, 7), (0, 7, 10), (0, 10, 11), (1, 5, 9), (5, 11, 4), (11, 10, 2), (10, 7, 6),
         (7, 1, 8), (3, 9, 4), (3, 4, 2), (3, 2, 6), (3, 6, 8), (3, 8, 9), (4, 9, 5), (2, 4, 11), (6, 2, 10),
         (8, 6, 7), (9, 8, 1)]
    verts = [np.array(x, float) / np.linalg.norm(x) for x in v]
    faces = [tuple(x) for x in f]
    for _ in range(level):
        cache = {}
        nf = []

        def mid(a, b):
            k = (min(a, b), max(a, b))
            if k not in cache:
                m = (verts[a] + verts[b]) / 2
                verts.append(m / np.linalg.norm(m))
                cache[k] = len(verts) - 1
            return cache[k]
        for a, b, c in faces:
            ab, bc, ca = mid(a, b), mid(b, c), mid(c, a)
            nf += [(a, ab, ca), (b, bc, ab), (c, ca, bc), (ab, bc, ca)]
        faces = nf
    pos = np.array(verts) * radius
    uv = np.stack([np.arctan2(pos[:, 2], pos[:, 0]) / (2 * np.pi) + .5, np.arcsin(np.clip(pos[:, 1] / radius, -1, 1)) / np.pi + .5], 1)
    return mk(pos, np.array(faces), nrm=normalize(pos), uv=uv)


def box(sx, sy, sz, uv_scale=1.0):
    hx, hy, hz = sx / 2, sy / 2, sz / 2
    faces = [((1, 0, 0), [(hx, -hy, -hz), (hx, hy, -hz), (hx, hy, hz), (hx, -hy, hz)]),
             ((-1, 0, 0), [(-hx, -hy, hz), (-hx, hy, hz), (-hx, hy, -hz), (-hx, -hy, -hz)]),
             ((0, 1, 0), [(-hx, hy, -hz), (-hx, hy, hz), (hx, hy, hz), (hx, hy, -hz)]),
             ((0, -1, 0), [(-hx, -hy, hz), (-hx, -hy, -hz), (hx, -hy, -hz), (hx, -hy, hz)]),
             ((0, 0, 1), [(-hx, -hy, hz), (hx, -hy, hz), (hx, hy, hz), (-hx, hy, hz)]),
             ((0, 0, -1), [(hx, -hy, -hz), (-hx, -hy, -hz), (-hx, hy, -hz), (hx, hy, -hz)])]
    P, N, U, I = [], [], [], []
    for k, (n, vs) in enumerate(faces):
        P += vs; N += [n] * 4
        U += [(0, 0), (uv_scale, 0), (uv_scale, uv_scale), (0, uv_scale)]
        b = k * 4
        I += [(b, b + 1, b + 2), (b, b + 2, b + 3)]
    return mk(P, I, nrm=N, uv=U)


def ribbon(path, widths, up_hint=(0, 1, 0), alpha=None, color=None, three_row=False, uv_len=1.0):
    """Flat strip following a path. 2 rows (edges) or 3 rows (edge, centre, edge) when three_row."""
    path = np.asarray(path, float)
    K = len(path)
    widths = np.broadcast_to(np.asarray(widths, float), (K,))
    T = np.zeros_like(path)
    T[1:-1] = path[2:] - path[:-2]; T[0] = path[1] - path[0]; T[-1] = path[-1] - path[-2]
    T = normalize(T)
    side = np.cross(T, np.asarray(up_hint, float))
    bad = np.linalg.norm(side, axis=1) < 1e-5
    side[bad] = np.cross(T[bad], [1, 0, 0])
    side = normalize(side)
    rows = [-1.0, 0.0, 1.0] if three_row else [-1.0, 1.0]
    R = len(rows)
    P = np.zeros((K, R, 3)); U = np.zeros((K, R, 2)); C = np.ones((K, R, 4))
    seg = np.r_[0, np.cumsum(np.linalg.norm(np.diff(path, axis=0), axis=1))]
    seg = seg / seg[-1]
    for j, r in enumerate(rows):
        P[:, j] = path + side * (widths[:, None] * 0.5 * r)
        U[:, j, 0] = seg * uv_len
        U[:, j, 1] = (r + 1) / 2
        if color is not None:
            C[:, j, :3] = np.asarray(color)[:3]
        if alpha is not None:
            a = np.broadcast_to(np.asarray(alpha, float), (K,)) if np.ndim(alpha) else np.full(K, alpha)
            C[:, j, 3] = a * (1.0 if (not three_row) else (1.0 if r == 0 else 0.0))
    vid = np.arange(K * R).reshape(K, R)
    idx = []
    for i in range(K - 1):
        for j in range(R - 1):
            a, b, c, d = vid[i, j], vid[i, j + 1], vid[i + 1, j + 1], vid[i + 1, j]
            idx += [(a, b, c), (a, c, d)]
    nrm = np.cross(T, side)
    nrm = np.repeat(normalize(nrm)[:, None, :], R, 1)
    return {"pos": P.reshape(-1, 3).astype(np.float32), "nrm": nrm.reshape(-1, 3).astype(np.float32),
            "uv": U.reshape(-1, 2).astype(np.float32), "col": C.reshape(-1, 4).astype(np.float32),
            "idx": np.array(idx)}


def compact(m):
    """Drop vertices no triangle references and remap indices (keeps buffers tight, avoids zero normals)."""
    used = np.unique(m["idx"])
    if len(used) == len(m["pos"]):
        return m
    remap = -np.ones(len(m["pos"]), np.int64)
    remap[used] = np.arange(len(used))
    r = dict(m)
    for k in ("pos", "nrm", "uv", "col"):
        if m[k] is not None:
            r[k] = m[k][used]
    r["idx"] = remap[m["idx"]]
    return r


def tri_count(m):
    return int(len(m["idx"]))


# =============================================================================== GLB writer
class GLB:
    def __init__(self, name="scene"):
        self.name = name
        self.nodes, self.meshes, self.materials = [], [], []
        self.images, self.textures, self.samplers = [], [], []
        self.accessors, self.bufferViews = [], []
        self.bin = bytearray()
        self.roots = []
        self.animations = []
        self.ext_used = set()
        self._tex_cache = {}
        self._mat_cache = {}
        self.stats = {"tris": 0, "points": 0, "meshes": 0}
        self._mesh_tris = []

    # ---- buffers
    def _view(self, data, target=None):
        pad = (-len(self.bin)) % 4
        self.bin += b"\0" * pad
        off = len(self.bin)
        self.bin += data
        bv = {"buffer": 0, "byteOffset": off, "byteLength": len(data)}
        if target:
            bv["target"] = target
        self.bufferViews.append(bv)
        return len(self.bufferViews) - 1

    def _acc(self, arr, ctype, atype, target=None, minmax=False):
        arr = np.ascontiguousarray(arr)
        bv = self._view(arr.tobytes(), target)
        a = {"bufferView": bv, "componentType": ctype, "count": int(len(arr)), "type": atype}
        if minmax:
            a["min"] = [float(x) for x in np.atleast_1d(arr.min(0))]
            a["max"] = [float(x) for x in np.atleast_1d(arr.max(0))]
        self.accessors.append(a)
        return len(self.accessors) - 1

    # ---- materials
    def texture(self, uri, srgb=True):
        if uri not in self._tex_cache:
            if not self.samplers:
                self.samplers.append({"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497})
            self.images.append({"uri": uri})
            self.textures.append({"sampler": 0, "source": len(self.images) - 1})
            self._tex_cache[uri] = len(self.textures) - 1
        return self._tex_cache[uri]

    def material(self, name, base=(1, 1, 1, 1), metallic=0.0, rough=0.9, base_tex=None, normal_tex=None,
                 emissive=None, emissive_strength=None, emissive_tex=None, alpha="OPAQUE", cutoff=0.5,
                 double=False, unlit=False, normal_scale=1.0):
        key = name
        if key in self._mat_cache:
            return self._mat_cache[key]
        pbr = {"baseColorFactor": [float(x) for x in base], "metallicFactor": float(metallic), "roughnessFactor": float(rough)}
        if base_tex:
            pbr["baseColorTexture"] = {"index": self.texture(base_tex)}
        m = {"name": name, "pbrMetallicRoughness": pbr}
        if normal_tex:
            m["normalTexture"] = {"index": self.texture(normal_tex), "scale": float(normal_scale)}
        ext = {}
        if emissive is not None:
            m["emissiveFactor"] = [float(x) for x in emissive]
            if emissive_strength:
                ext["KHR_materials_emissive_strength"] = {"emissiveStrength": float(emissive_strength)}
        if emissive_tex:
            m["emissiveTexture"] = {"index": self.texture(emissive_tex)}
            if "emissiveFactor" not in m:
                m["emissiveFactor"] = [1.0, 1.0, 1.0]
        if unlit:
            ext["KHR_materials_unlit"] = {}
        if ext:
            m["extensions"] = ext
            self.ext_used.update(ext.keys())
        if alpha != "OPAQUE":
            m["alphaMode"] = alpha
            if alpha == "MASK":
                m["alphaCutoff"] = cutoff
        if double:
            m["doubleSided"] = True
        self.materials.append(m)
        self._mat_cache[key] = len(self.materials) - 1
        return self._mat_cache[key]

    # ---- meshes
    def add_mesh(self, name, mesh, material):
        mesh = compact(mesh)
        pos = mesh["pos"].astype(np.float32)
        prim_attr = {"POSITION": self._acc(pos, FLOAT, "VEC3", 34962, minmax=True),
                     "NORMAL": self._acc(mesh["nrm"].astype(np.float32), FLOAT, "VEC3", 34962)}
        if mesh["uv"] is not None:
            prim_attr["TEXCOORD_0"] = self._acc(mesh["uv"].astype(np.float32), FLOAT, "VEC2", 34962)
        if mesh["col"] is not None:
            prim_attr["COLOR_0"] = self._acc(mesh["col"].astype(np.float32), FLOAT, "VEC4", 34962)
        idx = mesh["idx"].reshape(-1)
        if idx.max() >= len(pos) or idx.min() < 0:
            raise ValueError(f"{name}: index out of range")
        if len(pos) < 65535:
            ia = self._acc(idx.astype(np.uint16), U16, "SCALAR", 34963)
        else:
            ia = self._acc(idx.astype(np.uint32), U32, "SCALAR", 34963)
        self.meshes.append({"name": name, "primitives": [{"attributes": prim_attr, "indices": ia, "material": material, "mode": 4}]})
        self._mesh_tris.append(len(mesh["idx"]))
        return len(self.meshes) - 1

    def add_points(self, name, pos, col, size, phase, material):
        pos = np.asarray(pos, np.float32)
        attr = {"POSITION": self._acc(pos, FLOAT, "VEC3", 34962, minmax=True),
                "COLOR_0": self._acc(np.asarray(col, np.float32), FLOAT, "VEC4", 34962),
                "_SIZE": self._acc(np.asarray(size, np.float32), FLOAT, "SCALAR", 34962),
                "_PHASE": self._acc(np.asarray(phase, np.float32), FLOAT, "SCALAR", 34962)}
        self.meshes.append({"name": name, "primitives": [{"attributes": attr, "material": material, "mode": 0}]})
        self._mesh_tris.append(0)
        self.stats["points"] += len(pos)
        return len(self.meshes) - 1

    # ---- nodes
    def add_node(self, name, mesh=None, translation=None, rotation=None, scale=None, parent=None, extras=None):
        n = {"name": name}
        if mesh is not None:
            n["mesh"] = mesh
        if translation is not None and np.any(np.abs(translation) > 1e-9):
            n["translation"] = [float(x) for x in translation]
        if rotation is not None:
            n["rotation"] = [float(x) for x in rotation]
        if scale is not None:
            n["scale"] = [float(x) for x in (np.broadcast_to(scale, (3,)))]
        if extras:
            n["extras"] = extras
        self.nodes.append(n)
        i = len(self.nodes) - 1
        if parent is None:
            self.roots.append(i)
        else:
            self.nodes[parent].setdefault("children", []).append(i)
        if mesh is not None:
            self.stats["tris"] += self._mesh_tris[mesh]
        return i

    # ---- animation
    def add_animation(self, name, channels):
        """channels: list of (node, path 'rotation'|'translation'|'scale', times[K], values[K,3|4])"""
        samplers, chs = [], []
        for node, path, times, vals in channels:
            times = np.asarray(times, np.float32)
            vals = np.asarray(vals, np.float32)
            ia = self._acc(times, FLOAT, "SCALAR", minmax=True)
            oa = self._acc(vals, FLOAT, "VEC4" if path == "rotation" else "VEC3")
            samplers.append({"input": ia, "output": oa, "interpolation": "LINEAR"})
            chs.append({"sampler": len(samplers) - 1, "target": {"node": node, "path": path}})
        self.animations.append({"name": name, "samplers": samplers, "channels": chs})

    # ---- output
    def save(self, path, extras=None):
        gltf = {"asset": {"version": "2.0", "generator": "CodeCarnival procedural generator (numpy GLB writer)"},
                "scene": 0, "scenes": [{"name": self.name, "nodes": self.roots}],
                "nodes": self.nodes, "meshes": self.meshes, "accessors": self.accessors,
                "bufferViews": self.bufferViews, "buffers": [{"byteLength": len(self.bin)}]}
        if self.materials:
            gltf["materials"] = self.materials
        if self.images:
            gltf["images"] = self.images; gltf["textures"] = self.textures; gltf["samplers"] = self.samplers
        if self.animations:
            gltf["animations"] = self.animations
        if self.ext_used:
            gltf["extensionsUsed"] = sorted(self.ext_used)
        if extras:
            gltf["scenes"][0]["extras"] = extras
        js = json.dumps(gltf, separators=(",", ":")).encode()
        js += b" " * ((-len(js)) % 4)
        binb = bytes(self.bin) + b"\0" * ((-len(self.bin)) % 4)
        total = 12 + 8 + len(js) + 8 + len(binb)
        with open(path, "wb") as f:
            f.write(struct.pack("<III", 0x46546C67, 2, total))
            f.write(struct.pack("<II", len(js), 0x4E4F534A)); f.write(js)
            f.write(struct.pack("<II", len(binb), 0x004E4942)); f.write(binb)
        return {"bytes": total, "tris": self.stats["tris"], "points": self.stats["points"],
                "nodes": len(self.nodes), "meshes": len(self.meshes), "materials": len(self.materials),
                "animations": [a["name"] for a in self.animations],
                "unique_tris": int(sum(self._mesh_tris))}


def read_glb(path):
    """Parse a .glb back into (gltf_json, bin_bytes). Raises on malformed files."""
    with open(path, "rb") as f:
        data = f.read()
    magic, ver, length = struct.unpack_from("<III", data, 0)
    assert magic == 0x46546C67 and ver == 2 and length == len(data), "bad GLB header"
    off = 12
    js = binb = None
    while off < len(data):
        clen, ctype = struct.unpack_from("<II", data, off)
        body = data[off + 8: off + 8 + clen]
        if ctype == 0x4E4F534A:
            js = json.loads(body.decode())
        elif ctype == 0x004E4942:
            binb = body
        off += 8 + clen
    return js, binb
