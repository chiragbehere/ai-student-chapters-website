"""
lib_glb.py - dependency-light glTF 2.0 (GLB) writer + procedural geometry toolkit.
Only needs numpy. Used to build every model in the Code Carnival asset pack.

Conventions: right-handed, Y-up, metres, -Z is "into the screen" (glTF / Three.js).
"""
import json
import math
import os
import struct

import numpy as np

# ----------------------------------------------------------------------------
# Noise
# ----------------------------------------------------------------------------
_MASK = 0xFFFFFFFF


def _hash(ix, iy, iz, seed):
    n = (ix.astype(np.int64) * 374761393 + iy.astype(np.int64) * 668265263
         + iz.astype(np.int64) * 2147483629 + int(seed) * 1442695041) & _MASK
    n = ((n ^ (n >> 13)) * 1274126177) & _MASK
    n = n ^ (n >> 16)
    return (n & _MASK) / 4294967296.0


def vnoise(p, seed=0):
    """3D value noise in [0,1]. p: (N,2) or (N,3)."""
    p = np.atleast_2d(p).astype(np.float64)
    if p.shape[1] == 2:
        p = np.hstack([p, np.zeros((len(p), 1))])
    i = np.floor(p)
    f = p - i
    u = f * f * f * (f * (f * 6 - 15) + 10)
    ix, iy, iz = i[:, 0], i[:, 1], i[:, 2]

    def c(dx, dy, dz):
        return _hash(ix + dx, iy + dy, iz + dz, seed)

    x00 = c(0, 0, 0) * (1 - u[:, 0]) + c(1, 0, 0) * u[:, 0]
    x10 = c(0, 1, 0) * (1 - u[:, 0]) + c(1, 1, 0) * u[:, 0]
    x01 = c(0, 0, 1) * (1 - u[:, 0]) + c(1, 0, 1) * u[:, 0]
    x11 = c(0, 1, 1) * (1 - u[:, 0]) + c(1, 1, 1) * u[:, 0]
    y0 = x00 * (1 - u[:, 1]) + x10 * u[:, 1]
    y1 = x01 * (1 - u[:, 1]) + x11 * u[:, 1]
    return y0 * (1 - u[:, 2]) + y1 * u[:, 2]


def fbm(p, octaves=5, seed=0, lac=2.0, gain=0.5):
    p = np.atleast_2d(p).astype(np.float64)
    amp, tot, out, fr = 1.0, 0.0, np.zeros(len(p)), 1.0
    for o in range(octaves):
        out += amp * vnoise(p * fr, seed + o * 17)
        tot += amp
        amp *= gain
        fr *= lac
    return out / tot


def smoothstep(a, b, x):
    t = np.clip((np.asarray(x, dtype=np.float64) - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# ----------------------------------------------------------------------------
# Rotation helpers
# ----------------------------------------------------------------------------
def rot_x(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])


def rot_y(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])


def rot_z(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])


def euler(rx=0.0, ry=0.0, rz=0.0):
    return rot_z(rz) @ rot_y(ry) @ rot_x(rx)


def mat_to_quat(m):
    t = m[0, 0] + m[1, 1] + m[2, 2]
    if t > 0:
        s = math.sqrt(t + 1.0) * 2
        q = [(m[2, 1] - m[1, 2]) / s, (m[0, 2] - m[2, 0]) / s, (m[1, 0] - m[0, 1]) / s, 0.25 * s]
    elif m[0, 0] > m[1, 1] and m[0, 0] > m[2, 2]:
        s = math.sqrt(1.0 + m[0, 0] - m[1, 1] - m[2, 2]) * 2
        q = [0.25 * s, (m[0, 1] + m[1, 0]) / s, (m[0, 2] + m[2, 0]) / s, (m[2, 1] - m[1, 2]) / s]
    elif m[1, 1] > m[2, 2]:
        s = math.sqrt(1.0 + m[1, 1] - m[0, 0] - m[2, 2]) * 2
        q = [(m[0, 1] + m[1, 0]) / s, 0.25 * s, (m[1, 2] + m[2, 1]) / s, (m[0, 2] - m[2, 0]) / s]
    else:
        s = math.sqrt(1.0 + m[2, 2] - m[0, 0] - m[1, 1]) * 2
        q = [(m[0, 2] + m[2, 0]) / s, (m[1, 2] + m[2, 1]) / s, 0.25 * s, (m[1, 0] - m[0, 1]) / s]
    q = np.array(q, dtype=np.float64)
    return tuple((q / np.linalg.norm(q)).tolist())


def normalize(v, eps=1e-9):
    v = np.asarray(v, dtype=np.float64)
    n = np.linalg.norm(v, axis=-1, keepdims=True)
    return v / np.maximum(n, eps)


# ----------------------------------------------------------------------------
# Mesh container
# ----------------------------------------------------------------------------
def compute_normals(pos, idx):
    pos = np.asarray(pos, dtype=np.float64)
    idx = np.asarray(idx, dtype=np.int64)
    a, b, c = pos[idx[:, 0]], pos[idx[:, 1]], pos[idx[:, 2]]
    fn = np.cross(b - a, c - a)
    n = np.zeros_like(pos)
    for k in range(3):
        np.add.at(n, idx[:, k], fn)
    return normalize(n).astype(np.float32)


class Mesh:
    def __init__(self, pos, idx=None, nrm=None, uv=None, col=None, uv1=None,
                 mode=4, material="default", attrs=None):
        self.pos = np.asarray(pos, dtype=np.float32).reshape(-1, 3)
        self.idx = None if idx is None else np.asarray(idx, dtype=np.uint32).reshape(-1, 3)
        self.nrm = None if nrm is None else np.asarray(nrm, dtype=np.float32).reshape(-1, 3)
        self.uv = None if uv is None else np.asarray(uv, dtype=np.float32).reshape(-1, 2)
        self.uv1 = None if uv1 is None else np.asarray(uv1, dtype=np.float32).reshape(-1, 2)
        self.col = None if col is None else np.asarray(col, dtype=np.float32).reshape(-1, 4)
        self.mode = mode
        self.material = material
        self.attrs = attrs or {}  # custom per-vertex scalar attributes, keys start with '_'

    @property
    def tris(self):
        return 0 if self.idx is None else len(self.idx)

    def smooth(self):
        if self.idx is not None and self.nrm is None:
            self.nrm = compute_normals(self.pos, self.idx)
        return self

    def xf(self, M=None, t=None, s=None):
        """Return a transformed copy: scale, then rotate, then translate."""
        pos = self.pos.astype(np.float64)
        nrm = None if self.nrm is None else self.nrm.astype(np.float64)
        if s is not None:
            s = np.asarray(s, dtype=np.float64)
            pos = pos * s
            if nrm is not None and s.ndim > 0:
                nrm = normalize(nrm / s)
        if M is not None:
            pos = pos @ np.asarray(M).T
            if nrm is not None:
                nrm = nrm @ np.asarray(M).T
        if t is not None:
            pos = pos + np.asarray(t, dtype=np.float64)
        m = Mesh(pos, self.idx, nrm, self.uv, self.col, self.uv1, self.mode, self.material,
                 {k: v.copy() for k, v in self.attrs.items()})
        return m

    def tinted(self, rgb, a=1.0):
        c = np.tile(np.array([*rgb, a], dtype=np.float32), (len(self.pos), 1))
        return Mesh(self.pos, self.idx, self.nrm, self.uv, c, self.uv1, self.mode, self.material, self.attrs)


def merge(meshes, material=None):
    meshes = [m for m in meshes if m is not None]
    pos, idx, nrm, uv, col, uv1 = [], [], [], [], [], []
    attrs = {}
    off = 0
    any_col = any(m.col is not None for m in meshes)
    for m in meshes:
        n = len(m.pos)
        pos.append(m.pos)
        idx.append(m.idx + off)
        nrm.append(m.nrm if m.nrm is not None else compute_normals(m.pos, m.idx))
        uv.append(m.uv if m.uv is not None else np.zeros((n, 2), np.float32))
        uv1.append(m.uv1 if m.uv1 is not None else np.zeros((n, 2), np.float32))
        if any_col:
            col.append(m.col if m.col is not None else np.ones((n, 4), np.float32))
        for k, v in m.attrs.items():
            attrs.setdefault(k, []).append(v)
        off += n
    return Mesh(np.vstack(pos), np.vstack(idx), np.vstack(nrm), np.vstack(uv),
                np.vstack(col) if any_col else None, None,
                4, material or meshes[0].material,
                {k: np.concatenate(v) for k, v in attrs.items()})


def faceted(m):
    """Un-weld vertices so every triangle gets a flat normal (rocks, crystals)."""
    i = m.idx.reshape(-1)
    pos = m.pos[i]
    idx = np.arange(len(pos), dtype=np.uint32).reshape(-1, 3)
    nrm = compute_normals(pos, idx)
    # compute_normals accumulates per-vertex; since vertices are unique per tri it is flat
    return Mesh(pos, idx, nrm, None if m.uv is None else m.uv[i], None if m.col is None else m.col[i],
                None, m.mode, m.material, {k: v[i] for k, v in m.attrs.items()})


# ----------------------------------------------------------------------------
# Primitives
# ----------------------------------------------------------------------------
def _frames(path):
    path = np.asarray(path, dtype=np.float64)
    T = np.zeros_like(path)
    T[1:-1] = path[2:] - path[:-2]
    T[0] = path[1] - path[0]
    T[-1] = path[-1] - path[-2]
    T = normalize(T)
    ref = np.array([0.0, 0.0, 1.0]) if abs(T[0][2]) < 0.9 else np.array([1.0, 0.0, 0.0])
    N0 = normalize(np.cross(T[0], ref))
    Ns = [N0]
    for i in range(1, len(path)):
        n = Ns[-1] - T[i] * np.dot(Ns[-1], T[i])
        if np.linalg.norm(n) < 1e-6:
            n = np.cross(T[i], ref)
        Ns.append(normalize(n))
    Ns = np.array(Ns)
    Bs = np.cross(T, Ns)
    return T, Ns, Bs


def tube(path, radii, sides=8, u_scale=1.0, v_per_m=0.8, tip=True, color_fn=None, material="default"):
    """Swept tube along a polyline with parallel-transport frames. Open at the start, pointed at the end."""
    path = np.asarray(path, dtype=np.float64)
    radii = np.asarray(radii, dtype=np.float64)
    K = len(path)
    T, N, B = _frames(path)
    seg = np.linalg.norm(np.diff(path, axis=0), axis=1)
    cum = np.concatenate([[0], np.cumsum(seg)])
    a = np.linspace(0, 2 * np.pi, sides + 1)
    ca, sa = np.cos(a), np.sin(a)
    radial = N[:, None, :] * ca[None, :, None] + B[:, None, :] * sa[None, :, None]
    pos = path[:, None, :] + radial * radii[:, None, None]
    nrm = radial.copy()
    uv = np.stack([np.tile(a / (2 * np.pi) * u_scale, (K, 1)),
                   np.tile((cum * v_per_m)[:, None], (1, sides + 1))], axis=-1)
    pos = pos.reshape(-1, 3)
    nrm = nrm.reshape(-1, 3)
    uv = uv.reshape(-1, 2)
    idx = []
    W = sides + 1
    for i in range(K - 1):
        for j in range(sides):
            p0 = i * W + j
            p1 = p0 + 1
            p2 = p0 + W
            p3 = p2 + 1
            idx += [[p0, p1, p2], [p1, p3, p2]]
    idx = np.array(idx, dtype=np.uint32)
    col = None
    if color_fn is not None:
        col = color_fn(pos)
    if tip:
        tp = path[-1] + T[-1] * max(radii[-1], 0.01) * 1.5
        ti = len(pos)
        pos = np.vstack([pos, tp])
        nrm = np.vstack([nrm, T[-1][None, :]])
        uv = np.vstack([uv, [[0.5 * u_scale, cum[-1] * v_per_m + 0.05]]])
        if col is not None:
            col = np.vstack([col, col[-1:]])
        last = (K - 1) * W
        extra = [[last + j, last + j + 1, ti] for j in range(sides)]
        idx = np.vstack([idx, np.array(extra, dtype=np.uint32)])
    return Mesh(pos, idx, nrm, uv, col, material=material)


def grid(nx, nz, sx, sz, height_fn=None, uv_scale=1.0, material="default"):
    """Heightfield in XZ plane (Y up), centred on the origin. nx, nz = number of cells."""
    xs = np.linspace(-sx / 2, sx / 2, nx + 1)
    zs = np.linspace(-sz / 2, sz / 2, nz + 1)
    X, Z = np.meshgrid(xs, zs)
    Y = height_fn(X, Z) if height_fn else np.zeros_like(X)
    pos = np.stack([X, Y, Z], -1).reshape(-1, 3)
    uv = np.stack([X, Z], -1).reshape(-1, 2) * uv_scale
    W = nx + 1
    ii, jj = np.meshgrid(np.arange(nx), np.arange(nz))
    p0 = (jj * W + ii).reshape(-1)
    p1, p2, p3 = p0 + 1, p0 + W, p0 + W + 1
    idx = np.concatenate([np.stack([p0, p2, p1], -1), np.stack([p1, p2, p3], -1)])
    return Mesh(pos, idx, None, uv, material=material).smooth()


def disc(radius, segs=48, rings=8, z=0.0, material="default"):
    """Flat disc in the XY plane facing +Z; UVs are planar (0..1 across the diameter)."""
    pos = [[0, 0, z]]
    for r in range(1, rings + 1):
        rr = radius * r / rings
        for s in range(segs):
            a = 2 * np.pi * s / segs
            pos.append([rr * np.cos(a), rr * np.sin(a), z])
    pos = np.array(pos)
    idx = []
    for s in range(segs):
        idx.append([0, 1 + s, 1 + (s + 1) % segs])
    for r in range(1, rings):
        b0 = 1 + (r - 1) * segs
        b1 = 1 + r * segs
        for s in range(segs):
            s1 = (s + 1) % segs
            idx += [[b0 + s, b1 + s, b1 + s1], [b0 + s, b1 + s1, b0 + s1]]
    uv = np.stack([pos[:, 0] / (2 * radius) + 0.5, pos[:, 1] / (2 * radius) + 0.5], -1)
    nrm = np.tile([0, 0, 1.0], (len(pos), 1))
    return Mesh(pos, idx, nrm, uv, material=material)


def box(sx, sy, sz, uv_per_m=1.0, material="default", centered=False):
    """Box with flat normals. Origin at bottom-centre unless centered."""
    hx, hz = sx / 2, sz / 2
    y0, y1 = (-sy / 2, sy / 2) if centered else (0, sy)
    faces = [
        ([-hx, y0, hz], [hx, y0, hz], [hx, y1, hz], [-hx, y1, hz], [0, 0, 1], sx, sy),
        ([hx, y0, -hz], [-hx, y0, -hz], [-hx, y1, -hz], [hx, y1, -hz], [0, 0, -1], sx, sy),
        ([hx, y0, hz], [hx, y0, -hz], [hx, y1, -hz], [hx, y1, hz], [1, 0, 0], sz, sy),
        ([-hx, y0, -hz], [-hx, y0, hz], [-hx, y1, hz], [-hx, y1, -hz], [-1, 0, 0], sz, sy),
        ([-hx, y1, hz], [hx, y1, hz], [hx, y1, -hz], [-hx, y1, -hz], [0, 1, 0], sx, sz),
        ([-hx, y0, -hz], [hx, y0, -hz], [hx, y0, hz], [-hx, y0, hz], [0, -1, 0], sx, sz),
    ]
    pos, nrm, uv, idx = [], [], [], []
    for f in faces:
        b = len(pos)
        pos += f[:4]
        nrm += [f[4]] * 4
        uw, vh = f[5] * uv_per_m, f[6] * uv_per_m
        uv += [[0, 0], [uw, 0], [uw, vh], [0, vh]]
        idx += [[b, b + 1, b + 2], [b, b + 2, b + 3]]
    return Mesh(pos, idx, nrm, uv, material=material)


def cylinder(r0, r1, h, sides=10, cap_top=True, cap_bottom=False, v_per_m=0.8, material="default"):
    """Cylinder/cone frustum along +Y, base at origin."""
    a = np.linspace(0, 2 * np.pi, sides + 1)
    ca, sa = np.cos(a), np.sin(a)
    bot = np.stack([r0 * ca, np.zeros_like(a), r0 * sa], -1)
    top = np.stack([r1 * ca, np.full_like(a, h), r1 * sa], -1)
    slope = (r0 - r1) / max(h, 1e-6)
    n = normalize(np.stack([ca, np.full_like(a, slope), sa], -1))
    pos = np.vstack([bot, top])
    nrm = np.vstack([n, n])
    uv = np.vstack([np.stack([a / (2 * np.pi), np.zeros_like(a)], -1),
                    np.stack([a / (2 * np.pi), np.full_like(a, h * v_per_m)], -1)])
    W = sides + 1
    idx = []
    for j in range(sides):
        # CCW seen from outside; skip the zero-area triangle when a ring collapses to a point
        if r0 > 1e-6:
            idx.append([j, W + j, j + 1])
        if r1 > 1e-6:
            idx.append([j + 1, W + j, W + j + 1])
        elif r0 <= 1e-6:
            continue
    pos, nrm, uv, idx = list(pos), list(nrm), list(uv), list(idx)
    if cap_top and r1 > 1e-6:
        c = len(pos)
        pos.append([0, h, 0]); nrm.append([0, 1, 0]); uv.append([0.5, 0.5])
        for j in range(sides):
            idx.append([W + j + 1, W + j, c])
    if cap_bottom and r0 > 1e-6:
        c = len(pos)
        pos.append([0, 0, 0]); nrm.append([0, -1, 0]); uv.append([0.5, 0.5])
        for j in range(sides):
            idx.append([j, j + 1, c])
    return Mesh(np.array(pos), np.array(idx), np.array(nrm), np.array(uv), material=material)


def icosphere(subdiv=1, radius=1.0):
    t = (1 + 5 ** 0.5) / 2
    v = np.array([[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t],
                  [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]], dtype=np.float64)
    f = np.array([[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4],
                  [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8],
                  [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]])
    v = normalize(v)
    for _ in range(subdiv):
        cache = {}
        verts = list(v)
        newf = []

        def mid(a, b):
            k = (min(a, b), max(a, b))
            if k not in cache:
                verts.append(normalize((verts[a] + verts[b]) / 2))
                cache[k] = len(verts) - 1
            return cache[k]

        for a, b, c in f:
            ab, bc, ca_ = mid(a, b), mid(b, c), mid(c, a)
            newf += [[a, ab, ca_], [b, bc, ab], [c, ca_, bc], [ab, bc, ca_]]
        v = np.array(verts)
        f = np.array(newf)
    return Mesh(v * radius, f, v).smooth()


def ribbon(path, widths, up=(0, 0, 1.0), colors=None, material="default", u_scale=1.0):
    """Flat strip along a path. Strip width direction = cross(tangent, up). uv.u along length, uv.v across."""
    path = np.asarray(path, dtype=np.float64)
    widths = np.asarray(widths, dtype=np.float64)
    K = len(path)
    T = np.zeros_like(path)
    T[1:-1] = path[2:] - path[:-2]
    T[0] = path[1] - path[0]
    T[-1] = path[-1] - path[-2]
    T = normalize(T)
    side = normalize(np.cross(T, np.asarray(up, dtype=np.float64)[None, :]))
    pos = np.empty((K * 2, 3))
    pos[0::2] = path - side * widths[:, None] / 2
    pos[1::2] = path + side * widths[:, None] / 2
    u = np.linspace(0, 1, K) * u_scale
    uv = np.empty((K * 2, 2))
    uv[0::2] = np.stack([u, np.zeros(K)], -1)
    uv[1::2] = np.stack([u, np.ones(K)], -1)
    idx = []
    for i in range(K - 1):
        a, b, c, d = 2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 3
        idx += [[a, c, b], [b, c, d]]
    nrm = np.tile(np.asarray(up, dtype=np.float64), (K * 2, 1))
    col = None
    if colors is not None:
        colors = np.asarray(colors, dtype=np.float32)
        col = np.repeat(colors, 2, axis=0)
    return Mesh(pos, idx, nrm, uv, col, material=material)


def points(pos, col=None, seed_attr=None, material="particle", extra=None):
    attrs = {}
    if seed_attr is not None:
        attrs["_SEED"] = np.asarray(seed_attr, dtype=np.float32)
    if extra:
        attrs.update({k: np.asarray(v, dtype=np.float32) for k, v in extra.items()})
    return Mesh(pos, None, None, None, col, None, 0, material, attrs)


# ----------------------------------------------------------------------------
# GLB writer
# ----------------------------------------------------------------------------
F32, U8, U16, U32 = 5126, 5121, 5123, 5125


class TexRef:
    def __init__(self, path, sampler="repeat"):
        self.path = path
        self.sampler = sampler


class GLB:
    def __init__(self, out_path, generator="CodeCarnival procedural generator"):
        self.out = out_path
        self.generator = generator
        self.meshes = []      # list of (name, Mesh)
        self.nodes = []       # dicts
        self.roots = []
        self.materials = {}   # name -> spec dict

    # materials -------------------------------------------------------------
    def use_materials(self, lib):
        self.materials = lib

    # structure -------------------------------------------------------------
    def add_mesh(self, name, mesh):
        self.meshes.append((name, mesh))
        return len(self.meshes) - 1

    def add_node(self, name, mesh=None, t=None, M=None, q=None, s=None, extras=None, parent=None):
        n = {"name": name}
        if mesh is not None:
            n["mesh"] = mesh
        if t is not None and np.any(np.abs(t) > 1e-9):
            n["translation"] = [float(x) for x in t]
        if M is not None:
            q = mat_to_quat(M)
        if q is not None and not np.allclose(q, (0, 0, 0, 1)):
            n["rotation"] = [float(x) for x in q]
        if s is not None:
            s = [float(s)] * 3 if np.isscalar(s) else [float(x) for x in s]
            if not np.allclose(s, 1):
                n["scale"] = s
        if extras:
            n["extras"] = extras
        self.nodes.append(n)
        i = len(self.nodes) - 1
        if parent is None:
            self.roots.append(i)
        else:
            self.nodes[parent].setdefault("children", []).append(i)
        return i

    def add_object(self, name, mesh, **kw):
        """Convenience: register a mesh and a node using it."""
        mi = self.add_mesh(name, mesh)
        return self.add_node(name, mesh=mi, **kw)

    # serialisation ---------------------------------------------------------
    def save(self):
        out_dir = os.path.dirname(os.path.abspath(self.out))
        os.makedirs(out_dir, exist_ok=True)
        binbuf = bytearray()
        views, accessors = [], []

        def add_view(data, target=None):
            while len(binbuf) % 4:
                binbuf.append(0)
            off = len(binbuf)
            binbuf.extend(data)
            v = {"buffer": 0, "byteOffset": off, "byteLength": len(data)}
            if target:
                v["target"] = target
            views.append(v)
            return len(views) - 1

        def add_acc(arr, ctype, atype, target, minmax=False, normalized=False):
            data = np.ascontiguousarray(arr)
            vi = add_view(data.tobytes(), target)
            a = {"bufferView": vi, "componentType": ctype, "count": int(len(data)), "type": atype}
            if normalized:
                a["normalized"] = True
            if minmax:
                a["min"] = [float(x) for x in data.reshape(len(data), -1).min(0)]
                a["max"] = [float(x) for x in data.reshape(len(data), -1).max(0)]
            accessors.append(a)
            return len(accessors) - 1

        # materials / textures ------------------------------------------------
        used = []
        for _, m in self.meshes:
            if m.material not in used:
                used.append(m.material)
        images, textures, samplers = [], [], [
            {"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497},
            {"magFilter": 9729, "minFilter": 9729, "wrapS": 33071, "wrapT": 33071},
        ]
        tex_cache = {}

        def tex(ref):
            key = (ref.path, ref.sampler)
            if key not in tex_cache:
                rel = os.path.relpath(ref.path, out_dir).replace(os.sep, "/")
                if not os.path.exists(ref.path):
                    raise FileNotFoundError(ref.path)
                images.append({"uri": rel, "mimeType": "image/png", "name": os.path.basename(ref.path)})
                textures.append({"sampler": 0 if ref.sampler == "repeat" else 1, "source": len(images) - 1})
                tex_cache[key] = len(textures) - 1
            return tex_cache[key]

        gl_mats, mat_idx = [], {}
        ext_used = set()
        for name in used:
            spec = self.materials[name]
            pbr = {"baseColorFactor": list(spec.get("base", (1, 1, 1, 1))),
                   "metallicFactor": float(spec.get("metallic", 0.0)),
                   "roughnessFactor": float(spec.get("rough", 0.9))}
            if spec.get("base_tex"):
                pbr["baseColorTexture"] = {"index": tex(spec["base_tex"])}
            if spec.get("rough_tex"):
                pbr["metallicRoughnessTexture"] = {"index": tex(spec["rough_tex"])}
            gm = {"name": name, "pbrMetallicRoughness": pbr,
                  "alphaMode": spec.get("alpha", "OPAQUE"), "doubleSided": bool(spec.get("double", False))}
            if spec.get("nrm_tex"):
                gm["normalTexture"] = {"index": tex(spec["nrm_tex"])}
            if spec.get("emissive") is not None:
                gm["emissiveFactor"] = list(spec["emissive"])
            if spec.get("emi_tex"):
                gm["emissiveTexture"] = {"index": tex(spec["emi_tex"]), "texCoord": spec.get("emi_uv", 0)}
                if "emissive" not in spec:
                    gm["emissiveFactor"] = [1, 1, 1]
            if spec.get("unlit"):
                gm["extensions"] = {"KHR_materials_unlit": {}}
                ext_used.add("KHR_materials_unlit")
            if spec.get("alpha") == "MASK":
                gm["alphaCutoff"] = spec.get("cutoff", 0.5)
            mat_idx[name] = len(gl_mats)
            gl_mats.append(gm)

        # meshes ----------------------------------------------------------------
        gl_meshes = []
        for name, m in self.meshes:
            attrs = {}
            attrs["POSITION"] = add_acc(m.pos.astype(np.float32), F32, "VEC3", 34962, minmax=True)
            if m.nrm is not None and m.mode == 4:
                attrs["NORMAL"] = add_acc(m.nrm.astype(np.float32), F32, "VEC3", 34962)
            if m.uv is not None and m.mode == 4:
                attrs["TEXCOORD_0"] = add_acc(m.uv.astype(np.float32), F32, "VEC2", 34962)
            if m.uv1 is not None and m.mode == 4:
                attrs["TEXCOORD_1"] = add_acc(m.uv1.astype(np.float32), F32, "VEC2", 34962)
            if m.col is not None:
                c8 = np.clip(np.round(m.col * 255.0), 0, 255).astype(np.uint8)
                attrs["COLOR_0"] = add_acc(c8, U8, "VEC4", 34962, normalized=True)
            for k, v in m.attrs.items():
                attrs[k] = add_acc(v.astype(np.float32), F32, "SCALAR", 34962)
            prim = {"attributes": attrs, "mode": m.mode, "material": mat_idx[m.material]}
            if m.idx is not None:
                flat = m.idx.reshape(-1)
                if len(m.pos) < 65536:
                    prim["indices"] = add_acc(flat.astype(np.uint16), U16, "SCALAR", 34963)
                else:
                    prim["indices"] = add_acc(flat.astype(np.uint32), U32, "SCALAR", 34963)
            gl_meshes.append({"name": name, "primitives": [prim]})

        gltf = {
            "asset": {"version": "2.0", "generator": self.generator},
            "scene": 0,
            "scenes": [{"name": "Scene", "nodes": self.roots}],
            "nodes": self.nodes,
            "meshes": gl_meshes,
            "materials": gl_mats,
            "accessors": accessors,
            "bufferViews": views,
            "buffers": [{"byteLength": len(binbuf)}],
        }
        if images:
            gltf["images"], gltf["textures"], gltf["samplers"] = images, textures, samplers
        if ext_used:
            gltf["extensionsUsed"] = sorted(ext_used)
        js = json.dumps(gltf, separators=(",", ":")).encode()
        js += b" " * ((4 - len(js) % 4) % 4)
        binbuf += b"\0" * ((4 - len(binbuf) % 4) % 4)
        total = 12 + 8 + len(js) + 8 + len(binbuf)
        with open(self.out, "wb") as f:
            f.write(struct.pack("<III", 0x46546C67, 2, total))
            f.write(struct.pack("<II", len(js), 0x4E4F534A))
            f.write(js)
            f.write(struct.pack("<II", len(binbuf), 0x004E4942))
            f.write(binbuf)
        return total


# ----------------------------------------------------------------------------
# Independent reader / validator (parses the written file, not the in-memory data)
# ----------------------------------------------------------------------------
_COMP = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
_NCOMP = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}


def read_glb(path):
    with open(path, "rb") as f:
        data = f.read()
    magic, ver, length = struct.unpack("<III", data[:12])
    assert magic == 0x46546C67 and ver == 2 and length == len(data), "bad GLB header"
    jl, jt = struct.unpack("<II", data[12:20])
    assert jt == 0x4E4F534A
    gltf = json.loads(data[20:20 + jl])
    o = 20 + jl
    bl, bt = struct.unpack("<II", data[o:o + 8])
    assert bt == 0x004E4942
    binb = data[o + 8:o + 8 + bl]
    return gltf, binb


def accessor_array(gltf, binb, ai):
    a = gltf["accessors"][ai]
    v = gltf["bufferViews"][a["bufferView"]]
    dt = _COMP[a["componentType"]]
    n = _NCOMP[a["type"]]
    off = v.get("byteOffset", 0) + a.get("byteOffset", 0)
    arr = np.frombuffer(binb, dtype=dt, count=a["count"] * n, offset=off)
    return arr.reshape(a["count"], n) if n > 1 else arr


def inspect_glb(path):
    """Validate structure and return measured statistics."""
    gltf, binb = read_glb(path)
    problems = []
    mesh_stats = []
    for mi, m in enumerate(gltf["meshes"]):
        tris = verts = pts = 0
        for p in m["primitives"]:
            pos = accessor_array(gltf, binb, p["attributes"]["POSITION"])
            a = gltf["accessors"][p["attributes"]["POSITION"]]
            if not (np.allclose(pos.min(0), a["min"], atol=1e-4) and np.allclose(pos.max(0), a["max"], atol=1e-4)):
                problems.append(f"{m['name']}: POSITION min/max mismatch")
            if not np.isfinite(pos).all():
                problems.append(f"{m['name']}: non-finite positions")
            verts += len(pos)
            for k, ai in p["attributes"].items():
                if gltf["accessors"][ai]["count"] != len(pos):
                    problems.append(f"{m['name']}: attribute {k} count mismatch")
            if "NORMAL" in p["attributes"]:
                nn = accessor_array(gltf, binb, p["attributes"]["NORMAL"])
                ln = np.linalg.norm(nn, axis=1)
                if not (np.abs(ln - 1) < 1e-2).all():
                    problems.append(f"{m['name']}: non-unit normals")
            if p.get("mode", 4) == 4:
                idx = accessor_array(gltf, binb, p["indices"])
                if idx.max() >= len(pos):
                    problems.append(f"{m['name']}: index out of range")
                if len(idx) % 3:
                    problems.append(f"{m['name']}: index count not multiple of 3")
                tris += len(idx) // 3
            else:
                pts += len(pos)
        mesh_stats.append({"name": m["name"], "tris": tris, "verts": verts, "points": pts})
    # instanced total (walk the scene)
    inst_tris = 0
    inst_pts = 0
    nodes = gltf["nodes"]

    def walk(i):
        nonlocal inst_tris, inst_pts
        n = nodes[i]
        if "mesh" in n:
            inst_tris += mesh_stats[n["mesh"]]["tris"]
            inst_pts += mesh_stats[n["mesh"]]["points"]
        for c in n.get("children", []):
            walk(c)

    for r in gltf["scenes"][gltf["scene"]]["nodes"]:
        walk(r)
    # external image check
    base = os.path.dirname(os.path.abspath(path))
    for im in gltf.get("images", []):
        if "uri" in im and not os.path.exists(os.path.join(base, im["uri"])):
            problems.append(f"missing texture {im['uri']}")
    return {
        "file": os.path.basename(path),
        "bytes": os.path.getsize(path),
        "nodes": len(nodes),
        "meshes": len(gltf["meshes"]),
        "unique_tris": sum(s["tris"] for s in mesh_stats),
        "unique_verts": sum(s["verts"] for s in mesh_stats),
        "instanced_tris": inst_tris,
        "instanced_points": inst_pts,
        "materials": [m["name"] for m in gltf["materials"]],
        "images": [i.get("uri") for i in gltf.get("images", [])],
        "mesh_stats": mesh_stats,
        "problems": problems,
    }
