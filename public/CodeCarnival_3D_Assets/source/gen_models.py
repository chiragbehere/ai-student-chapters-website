"""
gen_models.py - builds every GLB in the Code Carnival pack, procedurally (numpy only).

World layout (also written to animations/scene_layout.json):
  * ground plane at y ~ 0, portal anchor at (0, 4.8, -18) facing +Z, camera starts near (0, 1.7, 9) looking -Z.
"""
import json
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib_glb import (GLB, Mesh, TexRef, box, compute_normals, cylinder, euler, faceted, fbm, grid, icosphere,
                     inspect_glb, merge, normalize, points, smoothstep, tube, vnoise)

OUT = sys.argv[1] if len(sys.argv) > 1 else "/home/claude/CodeCarnival_3D_Assets"
M = os.path.join(OUT, "models")
for d in ["environment", "portal", "trees", "props", "effects"]:
    os.makedirs(os.path.join(M, d), exist_ok=True)

PORTAL = np.array([0.0, 4.8, -18.0])
GROUND_CZ = -30.0           # ground mesh centre (z); mesh spans z in [-90, 30]
GROUND_SIZE = 120.0


def tex(sub, name, sampler="repeat"):
    return TexRef(os.path.join(OUT, "textures", sub, name + ".png"), sampler)


# ----------------------------------------------------------------------------- materials
MATS = {
    "bark": dict(base=(1, 1, 1, 1), base_tex=tex("pbr", "bark_basecolor"), nrm_tex=tex("pbr", "bark_normal"),
                 rough_tex=tex("pbr", "bark_roughness"), metallic=0.0, rough=1.0),
    "wood_old": dict(base=(0.78, 0.66, 0.6, 1), base_tex=tex("pbr", "bark_basecolor"), nrm_tex=tex("pbr", "bark_normal"),
                     rough_tex=tex("pbr", "bark_roughness"), metallic=0.0, rough=1.0),
    "ground": dict(base=(1, 1, 1, 1), base_tex=tex("pbr", "ground_basecolor"), nrm_tex=tex("pbr", "ground_normal"),
                   rough_tex=tex("pbr", "ground_roughness"), metallic=0.0, rough=1.0,
                   emi_tex=tex("pbr", "cracked_ground", "clamp"), emi_uv=1, emissive=(1.0, 1.0, 1.0)),
    "vines": dict(base=(1, 1, 1, 1), base_tex=tex("pbr", "vines_basecolor"), metallic=0.0, rough=0.7,
                  emi_tex=tex("pbr", "vines_basecolor"), emissive=(0.22, 0.22, 0.22), double=True),
    "portal_swirl": dict(base=(1, 1, 1, 1), base_tex=tex("portal", "portal_emission"), alpha="BLEND", double=True, unlit=True),
    "portal_glow": dict(base=(1, 1, 1, 1), alpha="BLEND", double=True, unlit=True),
    "portal_void": dict(base=(0.02, 0.0, 0.01, 1), alpha="OPAQUE", double=True, unlit=True),
    "portal_ring": dict(base=(1, 1, 1, 1), metallic=0.1, rough=0.55, emissive=(0.85, 0.09, 0.04)),
    "glow_ribbon": dict(base=(1, 1, 1, 1), alpha="BLEND", double=True, unlit=True),
    "particle": dict(base=(1, 1, 1, 1), alpha="BLEND", unlit=True),
    "fog_sheet": dict(base=(0.34, 0.12, 0.17, 0.5), base_tex=tex("particles", "fog_noise"), alpha="BLEND", double=True, unlit=True),
    "crystal": dict(base=(1, 1, 1, 0.88), alpha="BLEND", metallic=0.0, rough=0.12, emissive=(0.55, 0.03, 0.05), double=True),
    "metal_rust": dict(base=(1, 1, 1, 1), metallic=0.7, rough=0.62),
    "rock": dict(base=(1, 1, 1, 1), metallic=0.0, rough=0.95, emissive=(0.0, 0.0, 0.0)),
    "lamp_glass": dict(base=(1.0, 0.55, 0.35, 0.9), alpha="BLEND", emissive=(1.0, 0.32, 0.14), rough=0.2, double=True),
    "silhouette": dict(base=(1, 1, 1, 1), unlit=True, double=True),
    "debris": dict(base=(1, 1, 1, 1), metallic=0.0, rough=1.0, double=True),
    "wire": dict(base=(0.03, 0.03, 0.03, 1), metallic=0.3, rough=0.6),
}

RNG = np.random.default_rng


def new(name, folder):
    g = GLB(os.path.join(M, folder, name))
    g.use_materials(MATS)
    return g


def colorize(mesh, fn):
    """fn(pos) -> (N,4) vertex colour."""
    mesh.col = fn(mesh.pos.astype(np.float64)).astype(np.float32)
    return mesh


# ----------------------------------------------------------------------------- terrain
def ground_h(x, z):
    sh = np.shape(x)
    xf, zf = np.ravel(x), np.ravel(z)
    h = (fbm(np.stack([xf * 0.045, zf * 0.045], 1), 4, 3) - 0.5) * 2.2
    h += (fbm(np.stack([xf * 0.22, zf * 0.22], 1), 3, 9) - 0.5) * 0.55
    rd = 1 - np.abs(2 * fbm(np.stack([xf * 0.06, zf * 0.06], 1), 3, 21) - 1)
    h -= 0.9 * smoothstep(0.93, 0.99, rd)                                   # fissure trenches
    d = np.hypot(xf - PORTAL[0], zf - PORTAL[2])
    h -= 0.7 * np.exp(-(d / 6.0) ** 2)                                      # crater under the portal
    h *= 1 - 0.55 * np.exp(-((np.hypot(xf, zf - 9)) / 7.0) ** 2)            # calmer ground near the camera
    return h.reshape(sh)


# ----------------------------------------------------------------------------- trees
def limb(rng, p0, direction, length, K, droop=0.15, wig=0.12):
    t = np.linspace(0, 1, K)[:, None]
    d = normalize(direction)
    perp1 = normalize(np.cross(d, [0, 1, 0])) if abs(d[1]) < 0.95 else np.array([1.0, 0, 0])
    perp2 = np.cross(d, perp1)
    ph = rng.uniform(0, 6.28, 2)
    pts = p0 + d * length * t
    pts = pts + perp1 * wig * length * np.sin(t * 4 + ph[0]) * t + perp2 * wig * length * np.sin(t * 3.2 + ph[1]) * t
    pts[:, 1] -= droop * length * t[:, 0] ** 2
    return pts


def make_tree(seed, height=6.5, lean=0.12, twist=1.0, nb=9, r0=0.30, broken=False, split=False):
    rng = RNG(seed)
    K = 16
    t = np.linspace(0, 1, K)
    ph = rng.uniform(0, 6.28, 4)
    x = lean * height * t ** 1.5 * np.cos(ph[0]) + 0.32 * twist * np.sin(t * 5 + ph[1]) * t
    z = lean * height * t ** 1.5 * np.sin(ph[0]) + 0.32 * twist * np.cos(t * 4.3 + ph[2]) * t
    top = 0.82 if broken else 1.0
    y = height * top * t
    path = np.stack([x, y, z], 1)
    rad = r0 * (1 - t * 0.93) ** 0.85 * (1 + 1.1 * np.exp(-t * 16)) + 0.025
    if broken:
        rad = rad + 0.05 * t
    parts = [tube(path, rad, sides=8, v_per_m=0.85, material="bark")]

    def radius_at(tt):
        return float(np.interp(tt, t, rad))

    def pos_at(tt):
        return np.array([np.interp(tt, t, path[:, c]) for c in range(3)])

    for _ in range(nb):
        tb = rng.uniform(0.28, 0.94) * top
        p0 = pos_at(tb / top)
        az = rng.uniform(0, 2 * np.pi)
        el = rng.uniform(0.25, 1.0)
        dvec = np.array([np.cos(az) * np.cos(el), np.sin(el) * 0.9, np.sin(az) * np.cos(el)])
        L = (1 - tb / height) * height * 0.45 * rng.uniform(0.7, 1.3) + 0.7
        br = limb(rng, p0, dvec, L, 6, droop=rng.uniform(0.05, 0.4))
        r_start = radius_at(tb / top) * 0.55 + 0.012
        parts.append(tube(br, np.linspace(r_start, 0.012, 6), sides=5, v_per_m=1.1, material="bark"))
        for _ in range(rng.integers(1, 3)):
            s = rng.uniform(0.4, 0.8)
            q0 = np.array([np.interp(s, np.linspace(0, 1, 6), br[:, c]) for c in range(3)])
            d2 = normalize(dvec + rng.normal(0, 0.8, 3) + np.array([0, 0.3, 0]))
            sb = limb(rng, q0, d2, L * rng.uniform(0.35, 0.55), 4, droop=0.2)
            parts.append(tube(sb, np.linspace(r_start * 0.5 + 0.008, 0.008, 4), sides=4, v_per_m=1.4, material="bark"))
    if split:
        az = rng.uniform(0, 2 * np.pi)
        p0 = pos_at(0.12)
        sp = limb(rng, p0, np.array([np.cos(az) * 0.7, 1.0, np.sin(az) * 0.7]), height * 0.55, 9, droop=0.1, wig=0.1)
        parts.append(tube(sp, np.linspace(r0 * 0.6, 0.02, 9), sides=6, v_per_m=0.9, material="bark"))
    for k in range(4):  # surface roots
        az = (k / 4) * 2 * np.pi + rng.uniform(-0.4, 0.4)
        Lr = rng.uniform(0.9, 1.7)
        rt = np.array([[0, 0.25, 0], [np.cos(az) * Lr * 0.3, 0.10, np.sin(az) * Lr * 0.3],
                       [np.cos(az) * Lr * 0.6, 0.02, np.sin(az) * Lr * 0.6],
                       [np.cos(az) * Lr * 0.85, -0.04, np.sin(az) * Lr * 0.85],
                       [np.cos(az) * Lr, -0.10, np.sin(az) * Lr]])
        parts.append(tube(rt, np.linspace(0.17, 0.03, 5), sides=5, v_per_m=1.0, material="bark"))
    m = merge(parts, "bark")
    ymax = max(height, 1.0)
    cf = 0.45 + 0.55 * smoothstep(0.0, 0.35 * ymax, m.pos[:, 1].astype(np.float64))
    m.col = np.stack([cf, cf * 0.96, cf * 0.97, np.ones_like(cf)], 1).astype(np.float32)
    return m


TREE_PARAMS = {
    "A": dict(seed=101, height=7.2, lean=0.10, twist=1.0, nb=9, r0=0.30),
    "B": dict(seed=202, height=5.6, lean=0.22, twist=1.5, nb=8, r0=0.34),
    "C": dict(seed=303, height=6.4, lean=0.08, twist=0.8, nb=8, r0=0.30, split=True),
    "D": dict(seed=404, height=4.0, lean=0.12, twist=1.2, nb=5, r0=0.38, broken=True),
}
TREES = {k: make_tree(**v) for k, v in TREE_PARAMS.items()}


def fallen_log(seed=7):
    rng = RNG(seed)
    L = 4.6
    t = np.linspace(0, 1, 9)
    path = np.stack([t * L - L / 2, 0.32 + 0.05 * np.sin(t * 5), 0.15 * np.sin(t * 3 + 1)], 1)
    r = 0.30 + 0.05 * np.sin(t * 7 + 1) + 0.08 * (1 - t)
    m = tube(path, r, sides=8, v_per_m=0.8, material="bark", tip=False)
    # snapped stubs
    extra = []
    for _ in range(3):
        s = rng.uniform(0.2, 0.8)
        p0 = np.array([s * L - L / 2, 0.55, 0.0])
        extra.append(tube(limb(rng, p0, np.array([rng.normal(0, .3), 1.0, rng.choice([-1, 1]) * .6]), 0.9, 4),
                          np.linspace(0.08, 0.02, 4), sides=5, material="bark"))
    m = merge([m] + extra, "bark")
    m.col = np.tile(np.array([0.6, 0.58, 0.58, 1.0], np.float32), (len(m.pos), 1))
    return m


def stump(seed=9):
    rng = RNG(seed)
    a = np.linspace(0, 2 * np.pi, 11)
    s = cylinder(0.5, 0.36, 0.55, sides=10, cap_top=True, v_per_m=0.9, material="bark")
    p = s.pos.copy()
    p[:, 0] *= 1 + 0.18 * np.sin(np.arctan2(p[:, 2], p[:, 0]) * 3 + 1)
    p[p[:, 1] > 0.5, 1] += rng.uniform(-0.12, 0.12, int((p[:, 1] > 0.5).sum()))
    s.pos = p
    s.nrm = compute_normals(s.pos, s.idx)
    s.col = np.tile(np.array([0.55, 0.52, 0.52, 1.0], np.float32), (len(s.pos), 1))
    return s


def spiky_tree(seed, h, col):
    """Cheap silhouette tree for the distant layers."""
    rng = RNG(seed)
    t = np.linspace(0, 1, 5)
    path = np.stack([0.5 * np.sin(t * 3 + seed) * t, h * t, 0.4 * np.cos(t * 2.4) * t], 1)
    parts = [tube(path, np.linspace(h * 0.028, h * 0.004, 5), sides=4, material="silhouette")]
    for _ in range(rng.integers(6, 9)):
        tb = rng.uniform(0.3, 0.95)
        p0 = np.array([np.interp(tb, t, path[:, c]) for c in range(3)])
        az = rng.uniform(0, 6.28)
        d = np.array([np.cos(az), rng.uniform(0.4, 1.4), np.sin(az)])
        br = limb(rng, p0, d, h * rng.uniform(0.14, 0.3) * (1.1 - tb * 0.5), 3, droop=0.25)
        parts.append(tube(br, np.linspace(h * 0.011, h * 0.002, 3), sides=3, material="silhouette"))
    m = merge(parts, "silhouette")
    m.col = np.tile(np.array([*col, 1.0], np.float32), (len(m.pos), 1))
    return m


# ----------------------------------------------------------------------------- soft ribbons (glowing, soft-edged)
def soft_ribbon(path, widths, up, core, edge, alpha, material="glow_ribbon", u_scale=1.0):
    path = np.asarray(path, dtype=np.float64)
    K = len(path)
    T = np.zeros_like(path)
    T[1:-1] = path[2:] - path[:-2]
    T[0] = path[1] - path[0]
    T[-1] = path[-1] - path[-2]
    T = normalize(T)
    side = normalize(np.cross(T, np.asarray(up, dtype=np.float64)[None, :]))
    w = np.asarray(widths)[:, None]
    L, C, R = path - side * w / 2, path, path + side * w / 2
    pos = np.stack([L, C, R], 1).reshape(-1, 3)
    alpha = np.asarray(alpha, dtype=np.float64)
    core = np.asarray(core, dtype=np.float64)
    edge = np.asarray(edge, dtype=np.float64)
    if core.ndim == 1:
        core = np.tile(core, (K, 1))
    if edge.ndim == 1:
        edge = np.tile(edge, (K, 1))
    col = np.stack([np.hstack([edge, alpha[:, None] * 0.0]), np.hstack([core, alpha[:, None]]),
                    np.hstack([edge, alpha[:, None] * 0.0])], 1).reshape(-1, 4)
    u = np.linspace(0, 1, K) * u_scale
    uv = np.stack([np.stack([u, np.zeros(K)], 1), np.stack([u, np.full(K, 0.5)], 1), np.stack([u, np.ones(K)], 1)], 1).reshape(-1, 2)
    idx = []
    for i in range(K - 1):
        a, b, c = 3 * i, 3 * i + 1, 3 * i + 2
        d, e, f = a + 3, b + 3, c + 3
        idx += [[a, d, b], [b, d, e], [b, e, c], [c, e, f]]
    nrm = np.tile(np.asarray(up, dtype=np.float64), (len(pos), 1))
    return Mesh(pos, idx, nrm, uv, col, material=material)


def midpoint_bolt(rng, p0, p1, disp, depth):
    if depth == 0:
        return [np.asarray(p0), np.asarray(p1)]
    p0, p1 = np.asarray(p0, float), np.asarray(p1, float)
    m = (p0 + p1) / 2
    d = p1 - p0
    perp = np.array([-d[1], d[0], 0.0])
    perp = perp / (np.linalg.norm(perp) + 1e-9)
    m = m + perp * rng.uniform(-disp, disp)
    return midpoint_bolt(rng, p0, m, disp / 2, depth - 1)[:-1] + midpoint_bolt(rng, m, p1, disp / 2, depth - 1)


def smooth_path(pts, window=2):
    pts = np.asarray(pts)
    return pts


# ============================================================================= BUILD: ENVIRONMENT
stats_files = []


def finish(g):
    g.save()
    stats_files.append(g.out)


# ---- ground ----------------------------------------------------------------
n_cells = 100
cell = GROUND_SIZE / n_cells
g_mesh = grid(n_cells, n_cells, GROUND_SIZE, GROUND_SIZE, lambda X, Z: ground_h(X, Z + GROUND_CZ), uv_scale=1 / 6.0, material="ground")
wx, wz = g_mesh.pos[:, 0], g_mesh.pos[:, 2] + GROUND_CZ
g_mesh.uv1 = np.stack([(wx - PORTAL[0]) / 36.0 + 0.5, (wz - PORTAL[2]) / 36.0 + 0.5], 1).astype(np.float32)
ny = g_mesh.nrm[:, 1].astype(np.float64)
cf = 0.55 + 0.45 * smoothstep(0.72, 0.98, ny)
g_mesh.col = np.stack([cf, cf, cf, np.ones_like(cf)], 1).astype(np.float32)
g = new("environment_ground.glb", "environment")
g.add_object("ground", g_mesh, t=[0, 0, GROUND_CZ], extras={"role": "ground", "emissive_uv": "TEXCOORD_1 maps cracked_ground.png onto a 36 m square centred on the portal"})
finish(g)

# ---- dead trees (the four hero variants, laid out in a row) --------------------
g = new("environment_dead_trees.glb", "trees")
for i, (k, m) in enumerate(TREES.items()):
    g.add_object(f"dead_tree_{k}", m, t=[(i - 1.5) * 5.0, 0, 0],
                 extras={"anim": "sway", "pivot": "base", "variant": k, "amp": 0.012, "speed": 0.35})
finish(g)

# ---- dark forest: instanced layout --------------------------------------------
rng = RNG(2026)
g = new("environment_dark_forest.glb", "environment")
tree_mi = {k: g.add_mesh(f"dead_tree_{k}", m) for k, m in TREES.items()}
log_mi = g.add_mesh("fallen_log", fallen_log())
stump_mi = g.add_mesh("tree_stump", stump())
placed = []
tries = 0
while len(placed) < 56 and tries < 20000:
    tries += 1
    x = rng.uniform(-56, 56)
    z = rng.uniform(-86, 14)
    if np.hypot(x - PORTAL[0], z - PORTAL[2]) < 10.5:
        continue                       # keep the portal clearing open
    if abs(x) < 4.5 and z > -12:
        continue                       # keep the camera corridor open
    if any(np.hypot(x - px, z - pz) < 3.6 for px, pz in placed):
        continue
    if rng.random() < (0.2 + 0.8 * min(abs(x) / 30.0, 1.0)) or z < -45:
        placed.append((x, z))
for i, (x, z) in enumerate(placed):
    k = list(TREES.keys())[rng.integers(0, 4)]
    sc = rng.uniform(0.85, 1.5)
    yaw = rng.uniform(0, 2 * np.pi)
    y = float(ground_h(np.array([x]), np.array([z]))[0]) - 0.06
    g.add_node(f"tree_{i:02d}", mesh=tree_mi[k], t=[x, y, z], M=euler(rng.normal(0, 0.03), yaw, rng.normal(0, 0.03)), s=sc,
               extras={"variant": k, "anim": "sway", "amp": 0.01, "speed": float(rng.uniform(0.25, 0.5)), "phase": float(rng.uniform(0, 6.28))})
nlog = 0
while nlog < 8:
    x, z = rng.uniform(-45, 45), rng.uniform(-70, 5)
    if np.hypot(x - PORTAL[0], z - PORTAL[2]) < 9 or (abs(x) < 4 and z > -10):
        continue
    y = float(ground_h(np.array([x]), np.array([z]))[0])
    g.add_node(f"log_{nlog:02d}", mesh=log_mi, t=[x, y - 0.05, z], M=euler(0, rng.uniform(0, 3.14), 0), s=rng.uniform(0.8, 1.3))
    nlog += 1
ns = 0
while ns < 10:
    x, z = rng.uniform(-50, 50), rng.uniform(-80, 8)
    if np.hypot(x - PORTAL[0], z - PORTAL[2]) < 9 or (abs(x) < 4 and z > -10):
        continue
    y = float(ground_h(np.array([x]), np.array([z]))[0])
    g.add_node(f"stump_{ns:02d}", mesh=stump_mi, t=[x, y - 0.05, z], M=euler(0, rng.uniform(0, 6.28), 0), s=rng.uniform(0.7, 1.3))
    ns += 1
finish(g)

# ---- distant forest silhouettes -------------------------------------------------
g = new("environment_distant_forest.glb", "environment")
layers = [("near", 38, (40, 58), (0.040, 0.016, 0.030), (9, 15), 150),
          ("mid", 46, (66, 88), (0.085, 0.030, 0.050), (12, 20), 160),
          ("far", 52, (95, 125), (0.160, 0.050, 0.080), (16, 26), 170)]
for lname, count, (rmin, rmax), col, (hmin, hmax), arc in layers:
    variants = [g.add_mesh(f"{lname}_tree_{v}", spiky_tree(900 + v + hash(lname) % 50, 1.0 * (hmin + hmax) / 2, col)) for v in range(3)]
    grp = g.add_node(f"layer_{lname}", extras={"role": "silhouette layer", "parallax": {"near": 0.06, "mid": 0.03, "far": 0.015}[lname]})
    for i in range(count):
        ang = math.radians(rng.uniform(-arc / 2, arc / 2))
        r = rng.uniform(rmin, rmax)
        x, z = r * math.sin(ang), PORTAL[2] - r * math.cos(ang) + 20
        hs = rng.uniform(hmin, hmax) / ((hmin + hmax) / 2)
        g.add_node(f"{lname}_{i:02d}", mesh=variants[rng.integers(0, 3)], t=[x, -1.0, z], M=euler(0, rng.uniform(0, 6.28), 0), s=hs, parent=grp)
finish(g)

# ---- vines & hanging roots ---------------------------------------------------
g = new("environment_vines.glb", "environment")
grp = g.add_node("vines_group", extras={"note": "each child origin = anchor point; hangs down -Y; _SWAY vertex attribute (0 anchor .. 1 tip) drives shader sway"})
for i in range(28):
    L = rng.uniform(2.2, 6.0)
    K = 10
    t = np.linspace(0, 1, K)
    ph = rng.uniform(0, 6.28, 2)
    amp = rng.uniform(0.25, 0.55)
    path = np.stack([amp * np.sin(t * 5 + ph[0]) * t, -L * t, amp * np.cos(t * 4 + ph[1]) * t], 1)
    m = tube(path, np.linspace(0.05, 0.012, K), sides=5, v_per_m=1.0, material="vines")
    tt = (-m.pos[:, 1] / L).clip(0, 1.05)
    cfc = 0.7 + 0.3 * tt
    m.col = np.stack([cfc, cfc, cfc, np.ones_like(cfc)], 1).astype(np.float32)
    m.attrs["_SWAY"] = tt.astype(np.float32)
    x, z = rng.uniform(-30, 30), rng.uniform(-60, 6)
    g.add_object(f"vine_{i:02d}", m, t=[x, rng.uniform(6.0, 9.5), z], parent=grp,
                 extras={"anim": "vine_sway", "amp": float(rng.uniform(0.05, 0.12)), "speed": float(rng.uniform(0.4, 0.9)),
                         "phase": float(rng.uniform(0, 6.28)), "length": float(L)})
for i in range(10):
    L = rng.uniform(1.4, 3.0)
    K = 7
    t = np.linspace(0, 1, K)
    path = np.stack([0.15 * np.sin(t * 4 + i) * t, -L * t, 0.15 * np.cos(t * 3 + i) * t], 1)
    parts = [tube(path, 0.14 * (1 - t) ** 0.8 + 0.02, sides=6, v_per_m=0.9, material="bark")]
    for s in range(3):
        q = rng.uniform(0.25, 0.75)
        p0 = np.array([np.interp(q, t, path[:, c]) for c in range(3)])
        d = normalize(np.array([rng.normal(0, 1), -0.8, rng.normal(0, 1)]))
        parts.append(tube(limb(rng, p0, d, L * 0.45, 4, droop=-0.1), np.linspace(0.04, 0.008, 4), sides=4, material="bark"))
    m = merge(parts, "bark")
    tt = (-m.pos[:, 1] / L).clip(0, 1.1)
    m.col = np.stack([0.45 + 0.3 * tt] * 3 + [np.ones_like(tt)], 1).astype(np.float32)
    m.attrs["_SWAY"] = tt.astype(np.float32)
    x, z = rng.uniform(-30, 30), rng.uniform(-60, 4)
    g.add_object(f"hanging_root_{i:02d}", m, t=[x, rng.uniform(6.5, 9.0), z], parent=grp,
                 extras={"anim": "vine_sway", "amp": 0.04, "speed": float(rng.uniform(0.3, 0.6)), "phase": float(rng.uniform(0, 6.28))})
finish(g)

# ---- floating debris --------------------------------------------------------------
def rocky_chunk(seed, sub, scale):
    m = icosphere(sub, 1.0)
    p = m.pos.astype(np.float64)
    n = fbm(p * 1.7 + seed, 3, seed)
    p = p * (0.65 + 0.7 * n)[:, None] * np.array(scale)
    m = Mesh(p, m.idx, None, None, None, material="debris")
    m = faceted(m)
    h = m.pos[:, 1].astype(np.float64)
    glow = smoothstep(0.1, -0.7, h / max(np.abs(h).max(), 1e-6))
    m.col = np.stack([0.18 + 0.7 * glow, 0.15 + 0.1 * glow, 0.16 + 0.1 * glow, np.ones_like(glow)], 1).astype(np.float32)
    m.uv = np.stack([m.pos[:, 0], m.pos[:, 2]], 1).astype(np.float32)
    return m


def plank(seed):
    rng = RNG(seed)
    m = box(0.9, 0.05, 0.16, material="debris", centered=True)
    p = m.pos.copy()
    p[:, 0] += rng.normal(0, 0.03, len(p)) * (np.abs(p[:, 0]) > 0.3)
    p[:, 2] += rng.normal(0, 0.012, len(p))
    m.pos = p
    m.nrm = compute_normals(m.pos, m.idx)
    m.col = np.tile(np.array([0.32, 0.26, 0.24, 1.0], np.float32), (len(p), 1))
    return m


def leaf_card(seed):
    m = grid(2, 3, 0.35, 0.5, lambda X, Z: 0.04 * np.cos(X * 9) - 0.03 * Z ** 2, material="debris")
    m.col = np.tile(np.array([0.22, 0.10, 0.09, 1.0], np.float32), (len(m.pos), 1))
    return m


debris_variants = {
    "shard": rocky_chunk(1, 0, (0.30, 0.09, 0.2)),
    "chunk": rocky_chunk(2, 1, (0.28, 0.2, 0.25)),
    "plank": plank(3),
    "leaf": leaf_card(4),
}
g = new("environment_floating_debris.glb", "environment")
vi = {k: g.add_mesh(f"debris_{k}", m) for k, m in debris_variants.items()}
grp = g.add_node("debris_group", extras={"note": "extras on each child drive the procedural float / spin animation"})
kinds = list(debris_variants.keys())
for i in range(72):
    k = kinds[rng.integers(0, 4)]
    pos = [rng.uniform(-24, 24), rng.uniform(0.8, 9.5), rng.uniform(-45, 6)]
    g.add_node(f"debris_{i:02d}", mesh=vi[k], t=pos, M=euler(*rng.uniform(0, 6.28, 3)), s=rng.uniform(0.6, 1.9), parent=grp,
               extras={"anim": "float", "amp": float(rng.uniform(0.08, 0.35)), "speed": float(rng.uniform(0.25, 0.8)),
                       "phase": float(rng.uniform(0, 6.28)), "spin": [float(s) for s in rng.normal(0, 0.25, 3)]})
finish(g)

# ---- fog & atmospheric particles ----------------------------------------------------
g = new("environment_fog_particles.glb", "environment")
sheet = Mesh([[-28, 0, -28], [28, 0, -28], [28, 0, 28], [-28, 0, 28]], [[0, 2, 1], [0, 3, 2]], [[0, 1, 0]] * 4,
             [[0, 0], [3, 0], [3, 3], [0, 3]], material="fog_sheet")
sh_mi = g.add_mesh("fog_sheet", sheet)
fgrp = g.add_node("fog_sheets", extras={"note": "stacked alpha-blended planes scrolling fog_noise.png (animate uv offset)"})
for i, (yy, sc, sp) in enumerate([(0.35, 1.0, 0.012), (0.9, 0.85, -0.009), (1.6, 0.9, 0.007), (2.6, 0.7, -0.006), (4.0, 0.6, 0.004)]):
    g.add_node(f"fog_sheet_{i}", mesh=sh_mi, t=[rng.uniform(-3, 3), yy, -38 + rng.uniform(-3, 3)], M=euler(0, rng.uniform(0, 6.28), 0), s=sc,
               parent=fgrp, extras={"anim": "uv_scroll", "speed": sp, "opacity": float(0.55 - i * 0.07)})


def cloud(n, box_min, box_max, col_a, col_b, a_lo, a_hi, seed):
    r = RNG(seed)
    p = r.uniform(box_min, box_max, (n, 3))
    c = np.array(col_a)[None, :] + (np.array(col_b) - np.array(col_a))[None, :] * r.random((n, 1))
    a = r.uniform(a_lo, a_hi, n)
    return points(p, np.hstack([c, a[:, None]]), seed_attr=r.random(n))


g.add_object("fog_wisps", cloud(420, [-45, 0.2, -80], [45, 3.5, -8], (0.45, 0.16, 0.22), (0.6, 0.22, 0.28), 0.08, 0.22, 11),
             extras={"anim": "drift", "size": 6.0, "sprite": "textures/particles/fog_puff.png", "speed": 0.15})
g.add_object("dust_motes", cloud(900, [-30, 0.2, -60], [30, 9, 10], (0.85, 0.7, 0.65), (1.0, 0.8, 0.75), 0.25, 0.7, 12),
             extras={"anim": "drift", "size": 0.07, "sprite": "textures/particles/particle_dust.png", "speed": 0.25})
g.add_object("ash_flakes", cloud(320, [-30, 1, -60], [30, 14, 10], (0.35, 0.33, 0.33), (0.6, 0.55, 0.55), 0.5, 0.9, 13),
             extras={"anim": "fall", "size": 0.12, "sprite": "textures/particles/particle_ash.png", "speed": 0.22})
g.add_object("embers", cloud(260, [-28, 0.5, -50], [28, 10, 6], (1.0, 0.35, 0.05), (1.0, 0.8, 0.4), 0.6, 1.0, 14),
             extras={"anim": "rise", "size": 0.1, "sprite": "textures/particles/particle_ember.png", "speed": 0.5})
g.add_object("spores", cloud(240, [-26, 0.5, -50], [26, 8, 6], (1.0, 0.45, 0.4), (1.0, 0.8, 0.7), 0.4, 0.9, 15),
             extras={"anim": "float", "size": 0.16, "sprite": "textures/particles/particle_spore.png", "speed": 0.3})
finish(g)

# ============================================================================= BUILD: PORTAL
disc_main = disc = None
from lib_glb import disc as make_disc

pm = make_disc(4.5, 64, 10, material="portal_swirl")
g = new("portal_main.glb", "portal")
mi = g.add_mesh("portal_disc", pm)
pgrp = g.add_node("portal_group", extras={"anchor_world": PORTAL.tolist(), "faces": "+Z"})
g.add_node("portal_void", mesh=g.add_mesh("portal_void", make_disc(4.5, 48, 4, z=-0.35, material="portal_void")), parent=pgrp)
g.add_node("portal_swirl_back", mesh=mi, t=[0, 0, -0.20], M=euler(0, 0, 0.8), s=1.08, parent=pgrp,
           extras={"anim": "spin", "speed": 0.06})
g.add_node("portal_swirl_mid", mesh=mi, t=[0, 0, -0.10], M=euler(0, 0, 2.1), s=0.95, parent=pgrp,
           extras={"anim": "spin", "speed": -0.11})
g.add_node("portal_swirl_front", mesh=mi, t=[0, 0, 0.0], s=0.80, parent=pgrp, extras={"anim": "spin", "speed": 0.17})
cg = make_disc(2.2, 40, 8, z=0.05, material="portal_glow")
rr = np.hypot(cg.pos[:, 0], cg.pos[:, 1]) / 2.2
cg.col = np.stack([np.ones_like(rr), 0.55 - 0.4 * rr, 0.35 - 0.3 * rr, (1 - rr) ** 2 * 0.85], 1).astype(np.float32)
g.add_node("portal_core_glow", mesh=g.add_mesh("portal_core_glow", cg), parent=pgrp, extras={"anim": "pulse", "amp": 0.12, "speed": 1.4})
finish(g)


def ring_mesh(R, rminor, segs, sides, seed, rv=0.06, mv=0.3, arc=None, colors=True, material="portal_ring"):
    rng = RNG(seed)
    if arc is None:
        th = np.linspace(0, 2 * np.pi, segs + 1)
    else:
        th = np.linspace(arc[0], arc[1], segs + 1)
    ph = rng.uniform(0, 6.28, 3)
    Rv = R + rv * np.sin(th * 3 + ph[0]) + rv * 0.5 * np.sin(th * 7 + ph[1])
    rm = rminor * (1 + mv * np.sin(th * 5 + ph[2]) + 0.2 * np.sin(th * 13))
    if arc is not None:
        rm = rm * np.sin(np.linspace(0.08, np.pi - 0.08, segs + 1)) ** 0.5
    phi = np.linspace(0, 2 * np.pi, sides + 1)
    pos, nrm, uv = [], [], []
    for i, t in enumerate(th):
        radial = np.array([np.cos(t), np.sin(t), 0.0])
        for j, p in enumerate(phi):
            d = np.cos(p) * radial + np.sin(p) * np.array([0, 0, 1.0])
            pos.append(radial * Rv[i] + d * rm[i])
            nrm.append(d)
            uv.append([i / segs * 8, j / sides])
    idx = []
    Wd = sides + 1
    for i in range(segs):
        for j in range(sides):
            a, b, c, d = i * Wd + j, i * Wd + j + 1, (i + 1) * Wd + j, (i + 1) * Wd + j + 1
            idx += [[a, c, b], [b, c, d]]
    m = Mesh(pos, idx, nrm, uv, material=material)
    if colors:
        n = fbm(np.stack([np.array(pos)[:, 0] * 1.3, np.array(pos)[:, 1] * 1.3], 1), 3, seed)
        c = 0.25 + 0.75 * smoothstep(0.45, 0.8, n)
        m.col = np.stack([c, c * 0.8, c * 0.8, np.ones_like(c)], 1).astype(np.float32)
    return m


g = new("portal_ring.glb", "portal")
rg = g.add_node("ring_group", extras={"anchor_world": PORTAL.tolist()})
g.add_object("ring_outer", ring_mesh(4.8, 0.24, 96, 10, 5), parent=rg, extras={"anim": "spin", "speed": 0.02})
g.add_object("ring_inner", ring_mesh(4.15, 0.07, 64, 6, 6, rv=0.03, mv=0.1), parent=rg, extras={"anim": "spin", "speed": -0.18})
sh = []
for k in range(28):
    a = 2 * np.pi * k / 28 + rng.uniform(-0.05, 0.05)
    Ls = rng.uniform(0.5, 1.6)
    s = cylinder(0.13, 0.0, Ls, sides=5, cap_top=False, material="portal_ring")
    tilt = rng.uniform(-0.35, 0.35)
    Rm = euler(0, 0, a - np.pi / 2) @ euler(tilt, 0, 0) @ euler(0, 0, 0)
    s = s.xf(M=Rm, t=[np.cos(a) * 5.0, np.sin(a) * 5.0, rng.uniform(-0.1, 0.1)])
    sh.append(s)
shards = merge(sh, "portal_ring")
shards.col = np.tile(np.array([0.3, 0.22, 0.22, 1.0], np.float32), (len(shards.pos), 1))
g.add_object("ring_shards", shards, parent=rg)
for k in range(3):
    a0 = rng.uniform(0, 6.28)
    g.add_object(f"ring_arc_{k}", ring_mesh(5.5 + 0.35 * k, 0.09, 24, 6, 30 + k, rv=0.04, mv=0.2, arc=(a0, a0 + rng.uniform(0.7, 1.2))),
                 t=[0, 0, 0.05 * (k - 1)], parent=rg,
                 extras={"anim": "spin", "speed": float(0.25 * (1 if k % 2 == 0 else -1)), "note": "floating broken arc"})
finish(g)

# ---- cracks
rng = RNG(77)


def crack_set(n, step, length_rng, w0, seed, branch_p, thin=1.0):
    r = RNG(seed)
    paths = []
    widths = []
    stack = []
    for k in range(n):
        a = 2 * np.pi * (k + r.uniform(-0.3, 0.3)) / n
        stack.append((np.array([np.cos(a) * 4.9, np.sin(a) * 4.9]), np.array([np.cos(a), np.sin(a)]), r.uniform(*length_rng), w0, 0))
    while stack:
        p, d, L, w, depth = stack.pop()
        pts = [p.copy()]
        steps = max(3, int(L / step))
        cur, dv = p.copy(), d.copy()
        for s in range(steps):
            ang = r.normal(0, 0.45)
            c, sn = np.cos(ang), np.sin(ang)
            dv = normalize(np.array([c * dv[0] - sn * dv[1], sn * dv[0] + c * dv[1]]))
            cur = cur + dv * step * r.uniform(0.6, 1.3)
            pts.append(cur.copy())
            if depth < 2 and r.random() < branch_p and s > 1:
                ba = r.choice([-1, 1]) * r.uniform(0.5, 1.0)
                bd = normalize(np.array([np.cos(ba) * dv[0] - np.sin(ba) * dv[1], np.sin(ba) * dv[0] + np.cos(ba) * dv[1]]))
                stack.append((cur.copy(), bd, L * 0.45, w * 0.5, depth + 1))
        paths.append((np.array(pts), w))
    meshes = []
    for pts, w in paths:
        K = len(pts)
        path3 = np.hstack([pts, np.full((K, 1), -0.05)])
        t = np.linspace(0, 1, K)
        widths = w * (1 - t) ** 0.8 * thin + 0.015
        alpha = (1 - t ** 1.6) * 0.95 + 0.0
        core = np.stack([np.ones(K), 0.55 - 0.35 * t, 0.30 - 0.2 * t], 1)
        edge = np.array([0.9, 0.05, 0.02])
        meshes.append(soft_ribbon(path3, widths, (0, 0, 1), core, edge, alpha, material="glow_ribbon"))
    return merge(meshes, "glow_ribbon")


g = new("portal_cracks.glb", "portal")
cg_ = g.add_node("cracks_group", extras={"anchor_world": PORTAL.tolist(), "anim": "flicker"})
g.add_object("cracks_primary", crack_set(14, 0.38, (4.5, 9.0), 0.30, 301, 0.07), parent=cg_, extras={"anim": "flicker", "speed": 2.1})
g.add_object("cracks_secondary", crack_set(22, 0.30, (2.0, 5.0), 0.16, 302, 0.05), parent=cg_, extras={"anim": "flicker", "speed": 3.3})
g.add_object("cracks_fine", crack_set(36, 0.22, (0.8, 2.6), 0.08, 303, 0.03, thin=1.0), parent=cg_, extras={"anim": "flicker", "speed": 4.7})
finish(g)

# ---- particles
rng = RNG(55)
g = new("portal_particles.glb", "portal")
n = 2400
th = rng.uniform(0, 2 * np.pi, n)
r = 0.7 + 7.0 * rng.random(n) ** 0.8
zz = rng.normal(0, 0.35 + 0.08 * r, n)
pp = np.stack([r * np.cos(th), r * np.sin(th), zz], 1)
cmix = rng.random(n)
col = np.stack([np.ones(n), 0.08 + 0.55 * cmix ** 2, 0.04 + 0.5 * cmix ** 4, 0.35 + 0.65 * rng.random(n)], 1)
g.add_object("portal_particles", points(pp, col, rng.random(n)),
             extras={"anim": "orbit", "size": 0.09, "sprite": "textures/particles/particle_red.png", "speed": 0.2,
                     "note": "orbit around Z at rate ~ speed / radius; _SEED randomises phase"})
n2 = 420
th = rng.uniform(0, 2 * np.pi, n2)
r = 4.4 + 0.9 * rng.random(n2)
pp = np.stack([r * np.cos(th), r * np.sin(th), rng.normal(0, 0.25, n2)], 1)
col = np.stack([np.ones(n2), 0.65 + 0.3 * rng.random(n2), 0.35 + 0.4 * rng.random(n2), 0.7 + 0.3 * rng.random(n2)], 1)
g.add_object("portal_sparks", points(pp, col, rng.random(n2)),
             extras={"anim": "spark", "size": 0.06, "sprite": "textures/particles/particle_ember.png", "speed": 0.9})
finish(g)

# ---- lightning
rng = RNG(404)
g = new("red_lightning_effect.glb", "effects")
lg = g.add_node("lightning_group", extras={"note": "origin = ground strike point, bolts reach up to y=14. Flash one bolt at a time."})
for b in range(6):
    top = np.array([rng.uniform(-1.5, 1.5), 14.0, 0.0])
    bot = np.array([rng.uniform(-0.8, 0.8), 0.0, 0.0])
    pts = np.array(midpoint_bolt(rng, top, bot, 2.4, 6))
    K = len(pts)
    t = np.linspace(0, 1, K)
    wid = 0.34 * (1 - 0.7 * t) * rng.uniform(0.8, 1.2)
    alpha = np.full(K, 1.0)
    core = np.tile(np.array([1.0, 0.82, 0.80]), (K, 1))
    edge = np.array([1.0, 0.05, 0.08])
    parts = [soft_ribbon(pts, wid, (0, 0, 1), core, edge, alpha, material="glow_ribbon"),
             soft_ribbon(pts, wid, (1, 0, 0), core, edge, alpha, material="glow_ribbon")]
    for _ in range(3):
        k = rng.integers(K // 5, K - K // 5)
        d = np.array([rng.choice([-1, 1]) * rng.uniform(0.6, 1.4), -rng.uniform(0.4, 1.0), 0])
        end = pts[k] + d * rng.uniform(2.5, 5.0)
        bp = np.array(midpoint_bolt(rng, pts[k], end, 0.8, 4))
        Kb = len(bp)
        bw = 0.16 * np.linspace(1, 0.15, Kb)
        ba = np.linspace(0.9, 0.2, Kb)
        parts.append(soft_ribbon(bp, bw, (0, 0, 1), np.tile([1.0, 0.7, 0.68], (Kb, 1)), edge, ba, material="glow_ribbon"))
        parts.append(soft_ribbon(bp, bw, (1, 0, 0), np.tile([1.0, 0.7, 0.68], (Kb, 1)), edge, ba, material="glow_ribbon"))
    g.add_object(f"lightning_bolt_{b}", merge(parts, "glow_ribbon"), parent=lg,
                 extras={"anim": "flash", "duration": 0.18, "variant": b})
finish(g)

# ---- energy ribbons
rng = RNG(9)
g = new("energy_ribbons.glb", "effects")
eg = g.add_node("energy_ribbons_group", extras={"anchor_world": PORTAL.tolist()})
for i in range(6):
    K = 72
    s = np.linspace(0, 1, K)
    th0 = rng.uniform(0, 6.28)
    rad = 2.2 + 4.6 * s + 0.35 * np.sin(s * 9 + i)
    ang = th0 + s * 2 * np.pi * rng.uniform(0.9, 1.5) * (1 if i % 2 == 0 else -1)
    path = np.stack([rad * np.cos(ang), rad * np.sin(ang), 1.1 * np.sin(s * 5 + i * 1.3)], 1)
    wid = (np.sin(np.pi * s) ** 0.8) * rng.uniform(0.25, 0.45) + 0.01
    alpha = np.sin(np.pi * s) ** 0.7
    core = np.stack([np.ones(K), 0.35 + 0.4 * (1 - s), 0.2 + 0.3 * (1 - s)], 1)
    g.add_object(f"energy_ribbon_{i}", soft_ribbon(path, wid, (0, 0, 1), core, np.array([0.9, 0.05, 0.03]), alpha, u_scale=3.0),
                 parent=eg, extras={"anim": "ribbon_flow", "speed": float(rng.uniform(0.15, 0.35)) * (1 if i % 2 == 0 else -1),
                                    "uv_scroll_texture": "textures/portal/portal_noise.png"})
finish(g)

# ============================================================================= BUILD: PROPS
rng = RNG(31)


def paint(m, fn):
    m.col = fn(m.pos.astype(np.float64)).astype(np.float32)
    return m


# ---- abandoned sign
g = new("abandoned_sign.glb", "props")
root = g.add_node("abandoned_sign", extras={"origin": "base of post", "pivot_note": "sign_board origin = hinge nail, rotate Z to swing"})
post = cylinder(0.075, 0.055, 2.3, sides=7, cap_top=True, material="wood_old")
post.pos[:, 0] += 0.0
post = paint(post, lambda p: np.stack([0.55 + 0.2 * (p[:, 1] / 2.3)] * 3 + [np.ones(len(p))], 1))
g.add_object("sign_post", post, parent=root, M=euler(0, 0, 0.07))
board = box(1.05, 0.62, 0.05, uv_per_m=1.0, material="wood_old")
board.pos[:, 0] -= 0.0          # origin at the board's bottom-centre; shift so hinge (top-left) is the origin
board.pos[:, 1] -= 0.62
board.pos[:, 0] += 0.52
board = paint(board, lambda p: np.stack([0.5 + 0.25 * np.sin(p[:, 0] * 18) ** 2] * 3 + [np.ones(len(p))], 1))
g.add_object("sign_board", board, parent=root, t=[-0.45, 2.05, 0.09], M=euler(0, 0, -0.14), extras={"anim": "swing", "amp": 0.05, "speed": 0.7})
g.add_object("sign_plank_broken", paint(box(0.6, 0.12, 0.04, material="wood_old"), lambda p: np.tile([0.45, 0.4, 0.4, 1.0], (len(p), 1))),
             parent=root, t=[0.7, 0.04, 0.3], M=euler(0.0, 0.6, 0.05))
finish(g)

# ---- broken electric pole
g = new("broken_electric_pole.glb", "props")
root = g.add_node("broken_electric_pole", M=euler(0, 0, -0.085), extras={"origin": "base of pole", "lean": "~5 degrees"})
H = 7.0
pole = cylinder(0.17, 0.12, H, sides=10, cap_top=True, material="wood_old", v_per_m=0.5)
topmask = pole.pos[:, 1] > H - 0.01
nt = int(topmask.sum())
pp = pole.pos.copy()
pp[topmask, 1] += RNG(5).uniform(-0.35, 0.18, nt)
pole.pos = pp
pole.nrm = compute_normals(pole.pos, pole.idx)
spl = [cylinder(0.025, 0.0, rng.uniform(0.3, 0.7), sides=4, cap_top=False, material="wood_old").xf(
    M=euler(rng.normal(0, 0.3), 0, rng.normal(0, 0.3)), t=[np.cos(a) * 0.08, H - 0.05, np.sin(a) * 0.08]) for a in np.linspace(0, 6.28, 6, endpoint=False)]
pole = merge([pole] + spl, "wood_old")
pole = paint(pole, lambda p: np.stack([0.4 + 0.25 * (p[:, 1] / H)] * 3 + [np.ones(len(p))], 1))
g.add_object("pole_shaft", pole, parent=root)
arm = merge([box(1.9, 0.09, 0.1, material="wood_old", centered=True)] + [
    cylinder(0.03, 0.02, 0.14, sides=6, material="metal_rust").xf(t=[x, 0.04, 0]) for x in (-0.8, -0.35, 0.35, 0.8)], "metal_rust")
arm = paint(arm, lambda p: np.tile([0.5, 0.42, 0.4, 1.0], (len(p), 1)))
g.add_object("pole_crossarm", arm, parent=root, t=[0, 6.15, 0], M=euler(0, 0, 0.12))
for nm, sx in (("wire_a", -0.8), ("wire_b", 0.8)):
    t = np.linspace(0, 1, 14)
    path = np.stack([sx * 0.3 * t + 0.3 * np.sin(t * 3 + sx) * t, -5.8 * t + 0.0, 0.6 * t ** 1.5], 1)
    g.add_object(nm, tube(path, np.full(14, 0.014), sides=4, tip=True, material="wire"), parent=root, t=[sx, 6.2, 0.0],
                 extras={"anim": "vine_sway", "amp": 0.05, "speed": 0.5, "note": "cut cable, origin = attach point"})
finish(g)

# ---- old lamp
g = new("old_lamp.glb", "props")
root = g.add_node("old_lamp", extras={"origin": "base of post"})
parts = [cylinder(0.2, 0.1, 0.45, sides=8, material="metal_rust"), cylinder(0.075, 0.055, 3.4, sides=8, material="metal_rust").xf(t=[0, 0.4, 0])]
parts.append(tube(np.array([[0, 3.7, 0], [0.12, 3.95, 0], [0.38, 4.02, 0], [0.62, 3.88, 0]]), np.full(4, 0.035), sides=6, tip=False, material="metal_rust"))
body = merge(parts, "metal_rust")
body = paint(body, lambda p: np.stack([0.45 + 0.25 * fbm(p * 3, 3, 4)] * 3 + [np.ones(len(p))], 1))
g.add_object("lamp_post", body, parent=root)
hood = merge([cylinder(0.3, 0.06, 0.2, sides=8, cap_top=True, material="metal_rust").xf(t=[0, 0.2, 0]),
              cylinder(0.12, 0.2, 0.2, sides=8, cap_top=False, material="metal_rust")], "metal_rust")
hood = paint(hood, lambda p: np.tile([0.4, 0.33, 0.3, 1.0], (len(p), 1)))
g.add_object("lamp_housing", hood, parent=root, t=[0.62, 3.78, 0], M=euler(0.0, 0, 0.17))
glass = icosphere(1, 0.13)
glass.material = "lamp_glass"
g.add_object("lamp_glass", glass, parent=root, t=[0.62, 3.76, 0], extras={"anim": "flicker", "speed": 7.0, "light": {"color": "#ff5a2a", "intensity": 2.2, "distance": 9}})
finish(g)

# ---- floating rocks
g = new("floating_rocks.glb", "props")
grp = g.add_node("floating_rocks_group")
for i in range(7):
    s = [1.5, 1.0, 0.8, 0.55, 0.45, 0.35, 0.28][i]
    m = icosphere(2, 1.0)
    p = m.pos.astype(np.float64)
    nz = fbm(p * 1.4 + i * 3.1, 4, 50 + i)
    p = p * (0.7 + 0.6 * nz)[:, None] * np.array([1.2, 0.8, 1.0])
    # flatten the top slightly, taper the underside into a stalactite-like point
    under = np.clip(-p[:, 1], 0, None)
    p[:, 0] *= 1 - 0.35 * under
    p[:, 2] *= 1 - 0.35 * under
    p[:, 1] -= 0.25 * under
    m = faceted(Mesh(p * s, m.idx, None, None, None, material="rock"))
    yy = m.pos[:, 1].astype(np.float64) / (s * 1.0)
    glow = smoothstep(-0.1, -0.9, yy)
    m.col = np.stack([0.16 + 0.75 * glow, 0.13 + 0.06 * glow, 0.14 + 0.08 * glow, np.ones_like(glow)], 1).astype(np.float32)
    m.uv = np.stack([m.pos[:, 0], m.pos[:, 2]], 1).astype(np.float32)
    g.add_object(f"floating_rock_{i}", m, parent=grp, t=[(i - 3) * 2.6, 1.5 + 0.8 * np.sin(i * 1.7), rng.uniform(-1.2, 1.2)],
                 M=euler(*rng.normal(0, 0.25, 3)),
                 extras={"anim": "float", "amp": float(0.12 + 0.28 / (1 + s)), "speed": float(0.3 + 0.2 * rng.random()),
                         "phase": float(rng.uniform(0, 6.28)), "spin": [0.0, float(rng.normal(0, 0.1)), 0.0]})
finish(g)

# ---- dead branches
g = new("dead_branches.glb", "props")
grp = g.add_node("dead_branches_group")
for i in range(6):
    r_ = RNG(600 + i)
    Lm = r_.uniform(1.4, 2.8)
    main = limb(r_, np.zeros(3), np.array([1.0, 0.25, 0.1]), Lm, 8, droop=r_.uniform(0.05, 0.4))
    parts = [tube(main, np.linspace(0.07, 0.012, 8), sides=5, v_per_m=1.2, material="bark")]
    for _ in range(r_.integers(2, 5)):
        s = r_.uniform(0.2, 0.85)
        q0 = np.array([np.interp(s, np.linspace(0, 1, 8), main[:, c]) for c in range(3)])
        d = normalize(np.array([r_.uniform(0.2, 1.0), r_.uniform(-0.2, 1.2), r_.normal(0, 0.8)]))
        sb = limb(r_, q0, d, Lm * r_.uniform(0.25, 0.5), 5, droop=0.2)
        parts.append(tube(sb, np.linspace(0.035, 0.008, 5), sides=4, v_per_m=1.5, material="bark"))
    m = merge(parts, "bark")
    m.col = np.tile(np.array([0.7, 0.66, 0.66, 1.0], np.float32), (len(m.pos), 1))
    g.add_object(f"dead_branch_{i}", m, parent=grp, t=[(i - 2.5) * 3.0, 0.15, 0], M=euler(0, r_.uniform(-0.5, 0.5), 0),
                 extras={"anim": "sway", "amp": 0.02, "speed": 0.4, "phase": float(r_.uniform(0, 6.28))})
finish(g)

# ---- mysterious crystals
g = new("mysterious_crystals.glb", "props")
grp = g.add_node("crystals_group")
for c in range(3):
    r_ = RNG(700 + c)
    pieces = []
    for k in range(r_.integers(5, 8)):
        h = r_.uniform(0.5, 1.9) * (1.15 if k == 0 else 1.0)
        rd = r_.uniform(0.09, 0.22)
        body = cylinder(rd, rd * 0.85, h * 0.72, sides=6, cap_top=False, material="crystal")
        tip = cylinder(rd * 0.85, 0.0, h * 0.28, sides=6, cap_top=False, material="crystal").xf(t=[0, h * 0.72, 0])
        cry = merge([body, tip], "crystal")
        az = r_.uniform(0, 6.28)
        lean = 0 if k == 0 else r_.uniform(0.15, 0.55)
        cry = cry.xf(M=euler(0, az, 0) @ euler(0, 0, lean) @ euler(0, -az, 0), t=[r_.normal(0, 0.18) * (k > 0), -0.04, r_.normal(0, 0.18) * (k > 0)])
        pieces.append(faceted(cry))
    m = merge(pieces, "crystal")
    hh = m.pos[:, 1].astype(np.float64)
    tg = smoothstep(0.0, 1.8, hh)
    m.col = np.stack([0.45 + 0.55 * tg, 0.02 + 0.3 * tg ** 2, 0.04 + 0.28 * tg ** 2, 0.72 + 0.28 * tg], 1).astype(np.float32)
    g.add_object(f"crystal_cluster_{c}", m, parent=grp, t=[(c - 1) * 2.4, 0, 0], M=euler(0, c * 1.1, 0),
                 extras={"anim": "pulse", "amp": 0.15, "speed": float(0.8 + 0.2 * c), "light": {"color": "#ff2030", "intensity": 1.5, "distance": 6}})
finish(g)

# ---- forest roots
g = new("forest_roots.glb", "props")
grp = g.add_node("forest_roots_group")
for b in range(5):
    r_ = RNG(800 + b)
    parts = []
    for k in range(r_.integers(4, 7)):
        a = r_.uniform(0, 6.28)
        Lr = r_.uniform(1.4, 3.2)
        K = 9
        t = np.linspace(0, 1, K)
        arch = r_.random() < 0.4
        path = np.stack([np.cos(a) * Lr * t + 0.1 * np.sin(t * 6 + k) * t, (0.45 * np.sin(np.pi * t) * (1 if arch else 0.25) + 0.22 * (1 - t)) - 0.02 * t,
                         np.sin(a) * Lr * t + 0.1 * np.cos(t * 5 + k) * t], 1)
        parts.append(tube(path, 0.2 * (1 - t) ** 0.9 + 0.02, sides=6, v_per_m=0.9, material="bark"))
        if r_.random() < 0.7:
            q = r_.uniform(0.35, 0.7)
            q0 = np.array([np.interp(q, t, path[:, c]) for c in range(3)])
            sb = limb(r_, q0, np.array([np.cos(a + 0.9), -0.05, np.sin(a + 0.9)]), Lr * 0.4, 5, droop=-0.1, wig=0.2)
            parts.append(tube(sb, np.linspace(0.07, 0.012, 5), sides=4, material="bark"))
    m = merge(parts, "bark")
    m.col = np.tile(np.array([0.55, 0.5, 0.5, 1.0], np.float32), (len(m.pos), 1))
    g.add_object(f"root_bundle_{b}", m, parent=grp, t=[(b - 2) * 6.0, 0, 0], M=euler(0, r_.uniform(0, 6.28), 0))
finish(g)

# ============================================================================= layout manifest
layout = {
    "units": "metres, Y-up, -Z into the screen",
    "camera": {"start": [0, 1.7, 9.0], "look_at": PORTAL.tolist(), "fov": 50},
    "portal_anchor": PORTAL.tolist(),
    "fog": {"color": "#12040a", "density": 0.020},
    "placement": {
        "environment/environment_ground.glb": {"position": [0, 0, 0], "note": "the node already carries translation z=-30; do not offset again"},
        "environment/environment_dark_forest.glb": {"position": [0, 0, 0], "note": "trees are pre-placed in world coordinates"},
        "environment/environment_distant_forest.glb": {"position": [0, 0, 0], "note": "silhouette arcs centred behind the portal"},
        "environment/environment_vines.glb": {"position": [0, 0, 0], "note": "children pre-placed; origin at anchor points"},
        "environment/environment_floating_debris.glb": {"position": [0, 0, 0]},
        "environment/environment_fog_particles.glb": {"position": [0, 0, 0]},
        "trees/environment_dead_trees.glb": {"position": [-14, 0, -4], "note": "hero trees for close-ups"},
        "portal/portal_main.glb": {"position": PORTAL.tolist()},
        "portal/portal_ring.glb": {"position": PORTAL.tolist()},
        "portal/portal_cracks.glb": {"position": PORTAL.tolist()},
        "portal/portal_particles.glb": {"position": PORTAL.tolist()},
        "effects/energy_ribbons.glb": {"position": PORTAL.tolist()},
        "effects/red_lightning_effect.glb": {"position": [10, 0, -30], "note": "re-position per strike"},
        "props/abandoned_sign.glb": {"position": [3.2, 0.0, -2.0], "rotationY": -0.5},
        "props/broken_electric_pole.glb": {"position": [-6.5, 0.0, -9.0]},
        "props/old_lamp.glb": {"position": [4.6, 0.0, -9.5]},
        "props/floating_rocks.glb": {"position": [0, 3.2, -26], "note": "row of 7 rocks; split into separate placements as desired"},
        "props/dead_branches.glb": {"position": [0, 0, -4]},
        "props/mysterious_crystals.glb": {"position": [-5.5, 0, -14]},
        "props/forest_roots.glb": {"position": [0, 0, -12]},
    },
}
os.makedirs(os.path.join(OUT, "animations"), exist_ok=True)
with open(os.path.join(OUT, "animations", "scene_layout.json"), "w") as f:
    json.dump(layout, f, indent=2)

# ============================================================================= validation / stats
allstats = []
bad = 0
for p in stats_files:
    s = inspect_glb(p)
    allstats.append(s)
    flag = "OK " if not s["problems"] else "BAD"
    bad += bool(s["problems"])
    print(f"{flag} {os.path.relpath(p, M):48s} {s['bytes']/1024:8.1f} KB  uniqueTris={s['unique_tris']:6d}  instTris={s['instanced_tris']:7d}  pts={s['instanced_points']:5d}  {s['problems'][:2]}")
with open(os.path.join(OUT, "source", "model_stats.json"), "w") if os.path.isdir(os.path.join(OUT, "source")) else open("/tmp/model_stats.json", "w") as f:
    json.dump(allstats, f, indent=1)
print("files:", len(stats_files), "with problems:", bad)
