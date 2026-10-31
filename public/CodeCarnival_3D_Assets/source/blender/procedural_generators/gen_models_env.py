"""Environment models: ground, forest, dead trees, vines, distant forest, fog, floating debris."""
import json
import numpy as np
from glb import *
from cc_common import ROOT, out, smoothstep

PORTAL_C = np.array([0.0, 4.9, -10.0])     # portal centre in scene space (portal base sits on y~0.2)
RIFT_A, RIFT_B = 2.7, 4.7                  # half-width / half-height of the rift ellipse
TEX = "../../textures/pbr/"

# ---------------------------------------------------------------- terrain (analytic, used for placement too)
_r = np.random.default_rng(1234)
_WAVES = [(a, f, t, p) for a, f, t, p in zip([0.55, 0.34, 0.22, 0.12, 0.07], [0.11, 0.21, 0.39, 0.83, 1.7],
                                              _r.uniform(0, 6.28, 5), _r.uniform(0, 6.28, 5))]


def terrain(x, z):
    x = np.asarray(x, float); z = np.asarray(z, float)
    h = np.zeros_like(x)
    for a, f, t, p in _WAVES:
        h = h + a * np.sin(f * (x * np.cos(t) + z * np.sin(t)) + p)
    d = np.sqrt(x ** 2 + (z - PORTAL_C[2] + 2) ** 2)
    clear = smoothstep(6.0, 17.0, d)                      # flatter scorched clearing around the portal
    rim = 0.0035 * np.clip(np.sqrt(x ** 2 + z ** 2) - 24, 0, None) ** 2
    return h * (0.12 + 0.88 * clear) + rim


def mat_bark(g, tint=(1, 1, 1, 1)):
    return g.material("bark_dead", base=tint, rough=0.95, base_tex=TEX + "bark_basecolor.png", normal_tex=TEX + "bark_normal.png", normal_scale=1.2)


def mat_ground(g):
    return g.material("ground_forest", rough=0.97, base_tex=TEX + "ground_basecolor.png", normal_tex=TEX + "ground_normal.png")


def mat_stone(g):
    return g.material("rock_dark", base=(1, 1, 1, 1), rough=0.92)


def interp_path(path, t):
    path = np.asarray(path)
    s = np.linspace(0, 1, len(path))
    return np.array([np.interp(t, s, path[:, k]) for k in range(3)])


def rand_unit(rng):
    v = rng.normal(size=3)
    return v / np.linalg.norm(v)


# ---------------------------------------------------------------- dead tree generator
def branch_path(rng, start, direction, length, steps, droop, wobble):
    pts = [np.array(start, float)]
    d = normalize(np.asarray(direction, float))
    step = length / steps
    for _ in range(steps):
        d = normalize(d + rng.normal(0, wobble, 3) + np.array([0, -droop, 0]))
        pts.append(pts[-1] + d * step)
    return np.array(pts)


def make_tree(seed, height=10.0, trunk_r=0.33, n_branch=11, lean=0.5, break_at=None, fork=False, droop=0.10,
              skeletal=False, sides=8, lod=False):
    rng = np.random.default_rng(seed)
    parts = []
    lod2 = (lod == 2)
    if lod:
        sides = 5 if lod2 else 6
    S_ROOT, S_BR, S_SUB = ((4, 3, 3) if lod2 else (5, 4, 3)) if lod else (6, 5, 4)
    K = 9 if lod2 else (13 if lod else 15)
    t = np.linspace(0, 1, K)
    if break_at:
        t = t * break_at
    ph = rng.uniform(0, 6.28, 4)
    ax, az = lean * rng.uniform(0.6, 1.2), lean * rng.uniform(0.4, 1.0)
    sgn = rng.choice([-1, 1], 2)
    tt = np.linspace(0, 1, K)
    px = sgn[0] * ax * tt ** 1.4 * height * 0.2 + 0.45 * np.sin(5.5 * tt + ph[0]) * tt
    pz = sgn[1] * az * tt ** 1.3 * height * 0.2 + 0.45 * np.sin(4.1 * tt + ph[1]) * tt
    py = height * t - 0.55
    path = np.stack([px, py, pz], 1)
    rad = trunk_r * np.clip((1 - 0.88 * (t / max(t[-1], 1e-6)) ** 0.9) * (1 + 1.1 * np.exp(-t * 6.0 / (height / 10))), 0.05, None)
    if break_at:
        rad[-1] = max(rad[-1], 0.08)
    parts.append(tube(path, rad, sides, uv_scale=(1.6, 0.45), cap_end=not break_at))
    if break_at:                                             # splintered break: jagged fangs
        top = path[-1]
        for i in range(6):
            a = i / 6 * 6.28 + rng.normal(0, 0.2)
            base = top + np.array([np.cos(a), 0, np.sin(a)]) * rad[-1] * 0.55
            ln = rng.uniform(0.3, 1.3)
            sp = np.array([base, base + np.array([np.cos(a) * 0.1, ln, np.sin(a) * 0.1])])
            parts.append(tube(sp, [rad[-1] * 0.45, 0.01], 4, uv_scale=(1, 1), cap_end=False))
    # buttress roots
    for i in range(3 if lod2 else (4 if lod else 6)):
        a = i / (3 if lod2 else (4 if lod else 6)) * 6.28 + rng.normal(0, 0.3)
        d0 = np.array([np.cos(a), 0, np.sin(a)])
        rp = np.array([path[0] + d0 * 0.15 + [0, 0.9, 0],
                       path[0] + d0 * 0.8 + [0, 0.55, 0],
                       path[0] + d0 * 1.5 + [0, 0.1, 0],
                       path[0] + d0 * 2.2 + [0, -0.35, 0]])
        parts.append(tube(rp, [trunk_r * 0.55, trunk_r * 0.4, trunk_r * 0.2, 0.05], S_ROOT, uv_scale=(1, 0.5)))
    tmax = path[-1, 1] + 0.55
    nb = n_branch if not break_at else max(2, n_branch // 3)
    if lod2:
        nb = min(nb, 6)
    for b in range(nb):
        t0 = rng.uniform(0.32, 0.97) * (1 if not break_at else 0.9)
        st = interp_path(path, t0)
        az_ = rng.uniform(0, 6.28)
        el = rng.uniform(0.15, 1.0) if not skeletal else rng.uniform(0.4, 1.2)
        d = np.array([np.cos(az_) * np.cos(el), np.sin(el), np.sin(az_) * np.cos(el)])
        L = height * rng.uniform(0.16, 0.36) * (1.15 - t0 * 0.55)
        bp = branch_path(rng, st, d, L, 4 if lod2 else (5 if lod else 7), droop, 0.16)
        r0 = trunk_r * (1 - 0.88 * t0) * 0.55
        parts.append(tube(bp, np.linspace(r0, 0.02, len(bp)), S_BR, uv_scale=(1, 0.6), cap_end=True))
        for s in range(0 if lod2 else (rng.integers(1, 3) if lod else rng.integers(1, 4))):
            ts = rng.uniform(0.35, 0.8)
            sp0 = interp_path(bp, ts)
            sd = normalize(d + rand_unit(rng) * 0.9 + [0, 0.1, 0])
            sbp = branch_path(rng, sp0, sd, L * rng.uniform(0.3, 0.55), 3 if lod else 5, droop * 1.2, 0.2)
            parts.append(tube(sbp, np.linspace(r0 * 0.5, 0.012, len(sbp)), S_SUB, uv_scale=(1, 0.6), cap_end=True))
    if fork:
        t0 = 0.28
        st = interp_path(path, t0)
        fp = branch_path(rng, st, [0.6 * rng.choice([-1, 1]), 1.0, 0.3], height * 0.45, 9, 0.02, 0.12)
        parts.append(tube(fp, np.linspace(trunk_r * 0.55, 0.03, len(fp)), 7, uv_scale=(1.4, 0.5), cap_end=True))
        for s in range(5):
            sp0 = interp_path(fp, rng.uniform(0.3, 0.9))
            sbp = branch_path(rng, sp0, normalize(rand_unit(rng) + [0, 0.7, 0]), height * 0.12, 5, droop, 0.2)
            parts.append(tube(sbp, np.linspace(0.07, 0.012, len(sbp)), 4, uv_scale=(1, 0.6), cap_end=True))
    return merge(parts)


def ground_model():
    g = GLB("ground")
    N = 97

    def fn(X, Z):
        Y = terrain(X, Z)
        r = np.sqrt(X ** 2 + Z ** 2)
        d = np.sqrt(X ** 2 + (Z - PORTAL_C[2] + 2) ** 2)
        red = np.exp(-(d / 11.0) ** 2)                    # scorched, red-lit clearing
        edge = 1 - 0.75 * smoothstep(28, 46, r)
        C = np.stack([(1.0 - 0.18 * (1 - red)) * edge + 0.0 * red, (1 - 0.55 * red) * edge, (1 - 0.6 * red) * edge, np.ones_like(red)], -1)
        C[..., :3] *= 0.85
        return Y, C
    m = grid_mesh(N, N, fn, (92, 92), uv_tiles=14.0)
    mi = g.add_mesh("ground_mesh", m, mat_ground(g))
    g.add_node("ground", mi)
    info = g.save(out("models", "environment", "environment_ground.glb"))
    return info


def forest_model():
    g = GLB("dark_forest")
    bark = mat_bark(g, (0.92, 0.9, 0.92, 1))
    variants = [make_tree(101, 11.5, 0.36, 11, 0.5, lod=True), make_tree(202, 9.0, 0.30, 9, 0.7, fork=True, lod=True),
                make_tree(303, 13.5, 0.40, 12, 0.35, droop=0.14, lod=True), make_tree(404, 6.5, 0.34, 7, 0.4, break_at=0.8, lod=True),
                make_tree(505, 12.0, 0.36, 10, 0.5, lod=2), make_tree(606, 10.0, 0.32, 8, 0.6, fork=True, lod=2),
                make_tree(707, 14.0, 0.40, 10, 0.4, droop=0.14, lod=2)]
    vm = [g.add_mesh(f"tree_{'near' if i < 4 else 'far'}_variant_{i+1:02d}", v, bark) for i, v in enumerate(variants)]
    # brush: radiating dead twig clump for the forest floor
    rng = np.random.default_rng(7)
    twigs = []
    for i in range(12):
        a = rng.uniform(0, 6.28)
        bp = branch_path(rng, [0, 0.0, 0], [np.cos(a), rng.uniform(.3, 1.1), np.sin(a)], rng.uniform(.8, 1.8), 5, 0.12, 0.2)
        twigs.append(tube(bp, np.linspace(0.04, 0.008, len(bp)), 4, uv_scale=(1, 1), cap_end=True))
    brush = g.add_mesh("brush_clump", merge(twigs), bark)
    placed = []
    tries = 0
    while len(placed) < 92 and tries < 8000:
        tries += 1
        r = rng.uniform(7, 50); a = rng.uniform(0, 6.28)
        x, z = r * np.cos(a), r * np.sin(a) - 6
        if abs(x) < 5.0 and z > -14:                          # keep the hero corridor open
            continue
        if np.hypot(x, z - PORTAL_C[2]) < 8.5:
            continue
        near = np.hypot(x, z - 8) < 27                         # distance from the camera area decides the LOD
        if sum(1 for p in placed if np.hypot(x - p[0], z - p[1]) < (3.4 if near else 3.0)) or (near and sum(p[2] for p in placed) >= 44):
            continue
        placed.append((x, z, near))
    for n, (x, z, near) in enumerate(placed):
        v = int(rng.integers(0, 4)) if near else int(rng.integers(4, 7))
        s = rng.uniform(0.8, 1.35)
        q = quat_mul(quat_axis([0, 1, 0], rng.uniform(0, 6.28)), quat_axis(rand_unit(rng) * [1, 0, 1], rng.normal(0, 0.05)))
        g.add_node(f"tree_v{v+1}_{n+1:02d}", vm[v], translation=[x, float(terrain(x, z)) - 0.1, z], rotation=q, scale=s,
                   extras={"variant": v + 1, "lod": 1 if near else 2})
    for n in range(26):
        r = rng.uniform(3, 34); a = rng.uniform(0, 6.28)
        x, z = r * np.cos(a), r * np.sin(a) - 6
        if np.hypot(x, z - PORTAL_C[2]) < 6:
            continue
        g.add_node(f"brush_{n+1:02d}", brush, translation=[x, float(terrain(x, z)) - 0.02, z],
                   rotation=quat_axis([0, 1, 0], rng.uniform(0, 6.28)), scale=rng.uniform(0.7, 1.5))
    info = g.save(out("models", "environment", "environment_dark_forest.glb"))
    info["unique_tris"] = int(sum(g._mesh_tris))
    return info, placed


def dead_trees_model():
    g = GLB("dead_trees")
    bark = mat_bark(g)
    specs = [("twisted_tall", dict(seed=11, height=13, trunk_r=0.38, n_branch=14, lean=0.9)),
             ("forked", dict(seed=22, height=10, trunk_r=0.42, n_branch=10, lean=0.6, fork=True)),
             ("broken_stump", dict(seed=33, height=9, trunk_r=0.55, n_branch=9, lean=0.4, break_at=0.62)),
             ("drooping", dict(seed=44, height=11, trunk_r=0.34, n_branch=15, lean=0.7, droop=0.2)),
             ("skeletal", dict(seed=55, height=14, trunk_r=0.28, n_branch=18, lean=1.0, skeletal=True, droop=0.05)),
             ("gnarled_thick", dict(seed=66, height=7.5, trunk_r=0.65, n_branch=9, lean=0.5, fork=True))]
    for i, (nm, kw) in enumerate(specs):
        m = make_tree(**kw)
        mi = g.add_mesh(f"deadtree_{nm}", m, bark)
        g.add_node(f"deadtree_{i+1:02d}_{nm}", mi, translation=[(i - 2.5) * 7.0, 0, 0])
    return g.save(out("models", "trees", "environment_dead_trees.glb"))


def sway_keys(base_q, amp_x, amp_z, period, phase, n=9):
    ts = np.linspace(0, period, n)
    qs = []
    for t in ts:
        a = 2 * np.pi * t / period + phase
        dq = quat_mul(quat_axis([1, 0, 0], np.radians(amp_x) * np.sin(a)), quat_axis([0, 0, 1], np.radians(amp_z) * np.sin(a + 1.1)))
        q = quat_mul(base_q, dq)
        qs.append(q / np.linalg.norm(q))
    qs = np.array(qs)
    for i in range(1, n):                                    # keep quaternion hemisphere continuous
        if np.dot(qs[i], qs[i - 1]) < 0:
            qs[i] = -qs[i]
    qs[-1] = qs[0]
    return ts, qs


def vines_model():
    g = GLB("vines")
    bark = mat_bark(g, (0.8, 0.85, 0.8, 1))
    leafmat = g.material("vine_leaf_card", rough=0.9, base_tex=TEX + "vines_basecolor.png", alpha="MASK", cutoff=0.4, double=True)
    stem = g.material("vine_stem", base=(1, 1, 1, 1), rough=0.9, double=False)
    rng = np.random.default_rng(88)
    # overhead twisted canopy branches the vines hang from
    anchors = []
    for i, (x0, z0, ang) in enumerate([(-9, -4, 0.2), (8, -7, 2.9), (-4, -16, 1.3), (6, 2, 4.4)]):
        L = rng.uniform(10, 14)
        d = [np.cos(ang), 0.05, np.sin(ang)]
        bp = branch_path(rng, [x0, 10 + rng.uniform(-0.8, 0.8), z0], d, L, 12, 0.0, 0.14)
        bm = tube(bp, np.linspace(0.34, 0.09, len(bp)), 7, uv_scale=(1.2, 0.5), cap_end=True)
        mi = g.add_mesh(f"canopy_branch_{i+1:02d}", bm, bark)
        g.add_node(f"canopy_branch_{i+1:02d}", mi)
        for _ in range(5):
            anchors.append(interp_path(bp, rng.uniform(0.15, 0.95)) - [0, 0.1, 0])
    nvine = 0
    sways = []
    for k, a in enumerate(anchors):
        L = rng.uniform(3.0, 7.0)
        s = np.linspace(0, 1, 14)
        ph = rng.uniform(0, 6.28)
        sway_x = 0.35 * np.sin(s * 6 + ph) * s
        sway_z = 0.30 * np.sin(s * 5 + ph * 1.3) * s
        y = -L * s
        curl = s > 0.82
        cx = np.where(curl, 0.28 * (s - 0.82) / 0.18 * np.cos((s - 0.82) * 28), 0)
        path = np.stack([sway_x + cx, y, sway_z], 1)
        if k % 2 == 0:       # thick woody vine / hanging root with fine tendrils
            stem_m = tube(path, np.linspace(0.07, 0.012, len(path)), 5, uv_scale=(1, 1), cap_end=True,
                          color=(0.55 + 0.1 * rng.random(), 0.52, 0.5, 1))
            tend = []
            for _ in range(3):
                t0 = rng.uniform(0.15, 0.7)
                sp = interp_path(path, t0)
                tp = branch_path(rng, sp, normalize(rand_unit(rng) * [1, 0.2, 1] + [0, -1, 0]), rng.uniform(0.6, 1.4), 5, -0.02, 0.15)
                tend.append(tube(tp, np.linspace(0.02, 0.005, len(tp)), 3, cap_end=True, color=(0.5, 0.5, 0.5, 1)))
            mi = g.add_mesh(f"vine_stem_{k+1:02d}", merge([stem_m] + tend), bark)
        else:                # leaf card vine: two crossed strips using the alpha atlas
            col = k % 2
            cards = []
            for ang in (0.0, np.pi / 2):
                rb = ribbon(path @ rot_y(ang).T, 0.62, up_hint=rot_y(ang) @ np.array([0, 0, 1.0]))
                rb["uv"] = np.stack([rb["uv"][:, 1] * 0.5 + 0.5 * (k % 3 > 0), rb["uv"][:, 0]], 1).astype(np.float32)
                rb["col"] = None
                cards.append(rb)
            m = merge(cards)
            mi = g.add_mesh(f"vine_leaves_{k+1:02d}", m, leafmat)
        nid = g.add_node(f"vine_{k+1:02d}", mi, translation=a, extras={"anchor": True, "sway": True})
        sways.append(nid)
    # clips need a shared timeline per clip, so vines are split into 3 clips by sway period
    for grp in range(3):
        ch = []
        period = 6.0 + grp * 1.5
        for i, nid in enumerate(sways):
            if i % 3 != grp:
                continue
            ts, qs = sway_keys(np.array([0, 0, 0, 1.0]), 4.0 + grp, 5.0 + grp, period, i * 0.9)
            ch.append((nid, "rotation", ts, qs))
        g.add_animation(f"vine_sway_{grp+1}", ch)
    return g.save(out("models", "environment", "environment_vines.glb"))


def distant_forest_model():
    g = GLB("distant_forest")
    mat = g.material("silhouette_unlit", base=(1, 1, 1, 1), unlit=True, double=True)
    rng = np.random.default_rng(99)
    layers = [(60, (0.020, 0.012, 0.028), (0.075, 0.02, 0.04), 0.0, 70),
              (78, (0.04, 0.018, 0.045), (0.12, 0.03, 0.06), 0.0, 62),
              (98, (0.07, 0.025, 0.06), (0.17, 0.045, 0.085), 0.0, 55)]
    for li, (R, top, bot, y0, half_deg) in enumerate(layers):
        parts = []
        a = -np.radians(half_deg)
        while a < np.radians(half_deg):
            w = rng.uniform(3.5, 7.0)
            Hh = rng.uniform(11, 24)
            dead = rng.random() < 0.3
            a += w / R
            cx, cz = R * np.sin(a), PORTAL_C[2] - R * np.cos(a)
            tx, tz = np.cos(a), np.sin(a)          # tangent direction of the card

            def P(u, y):
                return np.array([cx + tx * u, y + y0 - 1.0, cz + tz * u])
            verts, tris = [], []

            def tri_(p0, p1, p2):
                b = len(verts); verts.extend([p0, p1, p2]); tris.append((b, b + 1, b + 2))

            def quad_(p0, p1, p2, p3):
                b = len(verts); verts.extend([p0, p1, p2, p3]); tris.extend([(b, b + 1, b + 2), (b, b + 2, b + 3)])
            if not dead:
                for j in range(4):
                    wj = w * (1 - j * 0.2) * 0.5
                    yb = j * Hh / 5.0
                    yt = (j + 1.5) * Hh / 5.0
                    tri_(P(-wj, yb), P(wj, yb), P(0, yt))
            else:
                tw = 0.35
                quad_(P(-tw, 0), P(tw, 0), P(tw * 0.5, Hh), P(-tw * 0.5, Hh))
                for j in range(4):
                    yb = Hh * rng.uniform(0.3, 0.8)
                    sgn = rng.choice([-1, 1])
                    ln = rng.uniform(1.5, 4)
                    quad_(P(0, yb), P(sgn * ln, yb + ln * rng.uniform(.4, .9)), P(sgn * ln, yb + ln * rng.uniform(.4, .9) + 0.2), P(0, yb + 0.25))
            pos = np.array(verts)
            ty = (pos[:, 1] - (y0 - 1.0)) / 26.0
            c = np.array(bot)[None] * (1 - np.clip(ty, 0, 1))[:, None] + np.array(top)[None] * np.clip(ty, 0, 1)[:, None]
            col = np.concatenate([c, np.ones((len(c), 1))], 1)
            nrm = np.tile(normalize(np.array([-np.sin(a) * 0 + (PORTAL_C[0] - cx), 0, PORTAL_C[2] - cz])), (len(pos), 1))
            parts.append({"pos": pos, "nrm": nrm, "uv": None, "col": col, "idx": np.array(tris)})
            a += w / R * 0.35
        mm = merge(parts)
        mi = g.add_mesh(f"distant_layer_{li+1}", mm, mat)
        g.add_node(f"distant_forest_layer_{li+1}", mi, extras={"radius": R})
    return g.save(out("models", "environment", "environment_distant_forest.glb"))


def fog_particles_model():
    g = GLB("fog_particles")
    mat = g.material("fog_points", base=(1, 1, 1, 1), alpha="BLEND", unlit=True, double=True)
    rng = np.random.default_rng(55)
    n = 1100
    x = rng.uniform(-42, 42, n); z = rng.uniform(-48, 26, n)
    y = np.clip(rng.exponential(2.0, n) + 0.2, 0.2, 14)
    pos = np.stack([x, y, z], 1)
    d = np.linalg.norm(pos - PORTAL_C, axis=1)
    red = np.exp(-(d / 14) ** 2)
    col = np.stack([0.38 + 0.55 * red, 0.42 - 0.3 * red, 0.5 - 0.38 * red, rng.uniform(0.12, 0.38, n)], 1)
    size = rng.uniform(2.5, 7.0, n)
    mi = g.add_points("fog_points", pos, col, size, rng.uniform(0, 6.283, n), mat)
    g.add_node("fog_particles", mi, extras={"sprite": "textures/particles/fog_sprite_01.png", "note": "_SIZE = sprite diameter in metres; _PHASE = drift phase"})
    return g.save(out("models", "environment", "environment_fog_particles.glb"))


def debris_model():
    g = GLB("floating_debris")
    rock = mat_stone(g)
    bark = mat_bark(g, (0.9, 0.9, 0.9, 1))
    rng = np.random.default_rng(66)
    shards = []
    for v in range(3):
        m = icosphere(1, 1.0)
        p = m["pos"].astype(float) * (1 + rng.normal(0, 0.28, (len(m["pos"]), 1)))
        p *= [1.0, rng.uniform(0.45, 0.8), rng.uniform(0.6, 1.1)]
        m = flat(mk(p, m["idx"], uv=m["uv"]))
        n = m["nrm"]
        under = np.clip(-n[:, 1], 0, 1)[:, None]
        c = np.array([0.15, 0.135, 0.15])[None] * (1 - under) + np.array([0.24, 0.05, 0.05])[None] * under
        c = c * rng.uniform(0.8, 1.15)
        m["col"] = np.concatenate([c, np.ones((len(c), 1))], 1).astype(np.float32)
        shards.append(g.add_mesh(f"debris_rock_{v+1}", m, rock))
    planks = []
    for v in range(2):
        pth = np.array([[-0.6, 0, 0], [-0.2, 0.05, 0.03], [0.25, -0.03, -0.02], [0.65, 0.04, 0.0]])
        m = tube(pth, [0.05, 0.1, 0.09, 0.03], 5, uv_scale=(1, 1), cap_end=True, cap_start=True)
        m = transform(m, [1, rng.uniform(1.5, 2.5), rng.uniform(1.0, 2.0)])
        planks.append(g.add_mesh(f"debris_wood_{v+1}", m, bark))
    meshes = shards + planks
    for i in range(60):
        a = rng.uniform(0, 6.283); r = rng.uniform(2.5, 17)
        x, z = r * np.cos(a), PORTAL_C[2] + 3 + r * np.sin(a) * 0.9
        y = rng.uniform(0.8, 11)
        if abs(x) < 6.5 and z > -16 and y < 10:        # keep the sight-line to the portal clear
            continue
        if r < 4 and abs(x) < 3 and abs(z - PORTAL_C[2]) < 3:
            continue
        q = quat_mul(quat_axis(rand_unit(rng), rng.uniform(0, 6.28)), quat_axis([0, 1, 0], rng.uniform(0, 6.28)))
        sc = rng.uniform(0.18, 0.8) if i % 4 else rng.uniform(0.9, 1.7)
        g.add_node(f"debris_{i+1:02d}", meshes[int(rng.integers(0, len(meshes)))], translation=[x, y, z], rotation=q, scale=sc,
                   extras={"floatAmp": round(float(rng.uniform(0.08, 0.35)), 3), "floatSpeed": round(float(rng.uniform(0.2, 0.6)), 3),
                           "spin": [round(float(v), 3) for v in rng.normal(0, 0.12, 3)]})
    return g.save(out("models", "environment", "environment_floating_debris.glb"))


def build_all():
    res = {}
    res["environment_ground.glb"] = ground_model()
    res["environment_dark_forest.glb"], placed = forest_model()
    res["environment_dead_trees.glb"] = dead_trees_model()
    res["environment_vines.glb"] = vines_model()
    res["environment_distant_forest.glb"] = distant_forest_model()
    res["environment_fog_particles.glb"] = fog_particles_model()
    res["environment_floating_debris.glb"] = debris_model()
    return res, placed


if __name__ == "__main__":
    r, _ = build_all()
    for k, v in r.items():
        print(k, v)
