"""Portal, lightning, ribbons, particles and environmental props."""
import numpy as np
from glb import *
from cc_common import out, smoothstep
from gen_models_env import (PORTAL_C, RIFT_A, RIFT_B, TEX, terrain, mat_bark, mat_stone, branch_path, interp_path,
                            rand_unit, sway_keys)


def rift_boundary(theta, rng_seed=5, jag=0.05):
    r = np.random.default_rng(rng_seed)
    k = np.arange(2, 16)
    amp = r.uniform(0.2, 1.0, len(k)) * jag / np.sqrt(k / 2)
    ph = r.uniform(0, 6.28, len(k))
    j = 1.0 + sum(a * np.sin(kk * theta + p) for a, kk, p in zip(amp, k, ph))
    spikes = np.clip(np.sin(theta * 17 + 0.5) * np.sin(theta * 5 + 1.0), 0, 1) ** 5 * 0.07
    return j + spikes


# --------------------------------------------------------------------------------------------- PORTAL
def portal_main():
    g = GLB("portal_main")
    em = g.material("portal_surface", base=(0, 0, 0, 1), rough=1.0, emissive=(1, 1, 1), emissive_strength=1.35,
                    emissive_tex="../../textures/portal/portal_emission.png", double=True)
    halo = g.material("portal_halo", base=(1, 0.12, 0.08, 1), rough=1.0, emissive=(1, 0.12, 0.06), emissive_strength=1.2,
                      alpha="BLEND", double=True, unlit=True)
    void = g.material("portal_void", base=(0.0, 0.0, 0.0, 1), rough=1.0, double=True, unlit=True)
    R, S = 18, 112
    th = np.linspace(0, 2 * np.pi, S + 1)
    jb = rift_boundary(th)
    pos, uv, idx = [], [], []
    for i in range(R + 1):
        s = i / R
        for j in range(S + 1):
            x = RIFT_A * jb[j] * s * np.cos(th[j]); y = RIFT_B * jb[j] * s * np.sin(th[j])
            z = -1.1 * (1 - s ** 2) ** 1.0           # concave: centre recedes away from the viewer (-Z)
            pos.append((x, y, z)); uv.append((0.5 + 0.5 * s * np.cos(th[j]), 0.5 - 0.5 * s * np.sin(th[j])))
    vid = np.arange((R + 1) * (S + 1)).reshape(R + 1, S + 1)
    for i in range(R):
        for j in range(S):
            a, b, c, d = vid[i, j], vid[i, j + 1], vid[i + 1, j + 1], vid[i + 1, j]
            idx += [(a, b, c), (a, c, d)] if i > 0 else [(a, c, d)]   # ring 0 is a single point: fan only
    surf = mk(np.array(pos), np.array(idx), uv=np.array(uv))
    # make sure front faces +Z
    if surf["nrm"][-1][2] < 0:
        surf["idx"] = surf["idx"][:, ::-1]; surf["nrm"] = -surf["nrm"]
    n_surf = g.add_node("portal_surface", g.add_mesh("portal_surface", surf, em))
    # soft halo disc (alpha fades outward) - pulse this with scale
    Rh, Sh = 8, 64
    pos, col, idx = [], [], []
    for i in range(Rh + 1):
        s = i / Rh
        for j in range(Sh + 1):
            t = j / Sh * 2 * np.pi
            pos.append((RIFT_A * 1.9 * s * np.cos(t), RIFT_B * 1.55 * s * np.sin(t), 0.05))
            a = (1 - s) ** 2.2 * 0.8 * smoothstep(0.0, 0.25, s + 0.2)
            col.append((1.0, 0.25 + 0.2 * (1 - s), 0.12, a))
    vid = np.arange((Rh + 1) * (Sh + 1)).reshape(Rh + 1, Sh + 1)
    for i in range(Rh):
        for j in range(Sh):
            a, b, c, d = vid[i, j], vid[i, j + 1], vid[i + 1, j + 1], vid[i + 1, j]
            idx += [(a, b, c), (a, c, d)] if i > 0 else [(a, c, d)]
    hm = mk(np.array(pos), np.array(idx), col=np.array(col))
    if hm["nrm"][-1][2] < 0:
        hm["idx"] = hm["idx"][:, ::-1]; hm["nrm"] = -hm["nrm"]
    n_halo = g.add_node("portal_halo", g.add_mesh("portal_halo", hm, halo))
    # black void plate behind the swirl so nothing shows through the concave centre
    vm = icosphere(1, 1.0)
    vp = vm["pos"] * [RIFT_A * 0.97, RIFT_B * 0.97, 0.05]
    vplate = mk(vp, vm["idx"])
    g.add_node("portal_void", g.add_mesh("portal_void", vplate, void), translation=[0, 0, -1.25])
    ts = np.linspace(0, 4.0, 9)
    sc = np.array([[1 + 0.07 * np.sin(2 * np.pi * t / 4.0)] * 2 + [1] for t in ts])
    g.add_animation("portal_pulse", [(n_halo, "scale", ts, sc)])
    return g.save(out("models", "portal", "portal_main.glb"))


def loop_path(a_x, a_y, n, seed=0, jag=0.0, z=0.0, phase=0.0):
    t = np.linspace(0, 2 * np.pi, n, endpoint=False)
    j = rift_boundary(t, seed + 3, jag) if jag else 1.0
    pts = np.stack([a_x * j * np.cos(t + phase), a_y * j * np.sin(t + phase), np.full_like(t, z)], 1)
    return np.vstack([pts, pts[:1]])


def portal_ring():
    g = GLB("portal_ring")
    ironred = g.material("ring_energy", base=(0.15, 0.02, 0.03, 1), metallic=0.5, rough=0.4, emissive=(1.0, 0.05, 0.03), emissive_strength=0.85)
    dark = g.material("ring_obsidian", base=(0.05, 0.04, 0.05, 1), metallic=0.7, rough=0.35, emissive=(0.5, 0.03, 0.02), emissive_strength=0.8)
    rng = np.random.default_rng(31)
    # (1) jagged outer rim that hugs the rift - static
    n = 150
    path = loop_path(RIFT_A * 1.1, RIFT_B * 1.06, n, seed=2, jag=0.045)
    rad = 0.17 + 0.07 * np.sin(np.linspace(0, 18 * np.pi, len(path))) + 0.04 * rng.random(len(path))
    rad[-1] = rad[0]
    rim = tube(path, rad, 8, ref_up=[0, 0, 1], uv_scale=(1, 1))
    spikes = []
    for k in range(30):
        t = k / 30 * 2 * np.pi + rng.normal(0, 0.04)
        p0 = np.array([RIFT_A * 1.1 * np.cos(t), RIFT_B * 1.06 * np.sin(t), 0])
        d = normalize(np.array([np.cos(t) / RIFT_A, np.sin(t) / RIFT_B, rng.normal(0, 0.15)]))
        L = rng.uniform(0.5, 1.5)
        spikes.append(tube(np.array([p0, p0 + d * L * 0.5, p0 + d * L]), [0.14, 0.07, 0.008], 5, cap_end=True))
    outer = g.add_node("ring_outer_group")
    g.add_node("ring_outer_rim", g.add_mesh("ring_outer_rim", rim, ironred), parent=outer)
    g.add_node("ring_outer_spikes", g.add_mesh("ring_outer_spikes", merge(spikes), dark), parent=outer)
    # (2) two counter-rotating broken circles (arc segments are separate objects)
    spin = []
    for gi, (Rr, narc, rad_, mat, name) in enumerate([(6.1, 9, 0.085, ironred, "ring_broken_a"), (6.9, 14, 0.05, dark, "ring_broken_b")]):
        grp = g.add_node(name + "_group")
        spin.append(grp)
        span = 2 * np.pi / narc
        for a in range(narc):
            t0 = a * span + rng.uniform(0, 0.1); t1 = t0 + span * rng.uniform(0.45, 0.8)
            t = np.linspace(t0, t1, 12)
            pth = np.stack([Rr * np.cos(t), Rr * np.sin(t), 0.25 * np.sin(t * 3 + gi)], 1)
            r = rad_ * (0.6 + 0.4 * np.sin(np.linspace(0, np.pi, 12)))
            m = tube(pth, r, 6, cap_end=True, cap_start=True)
            g.add_node(f"{name}_{a+1:02d}", g.add_mesh(f"{name}_{a+1:02d}", m, mat), parent=grp)
    # (3) gyroscope rings tilted in 3D
    gyros = []
    for k, (Rr, axis) in enumerate([(2.5, [1, 0.25, 0]), (3.4, [0, 1, 0.3]), (4.3, [0.35, 0, 1])]):
        c = loop_path(Rr, Rr, 72)
        m = tube(c, 0.032, 5, ref_up=[0, 0, 1])
        q0 = quat_axis(rand_unit(rng), 0.6 + k)
        gid = g.add_node(f"ring_gyro_{k+1}", g.add_mesh(f"ring_gyro_{k+1}", m, ironred), rotation=q0)
        gyros.append((gid, q0, axis))
    # animations: continuous loops (rotation about local Z for the broken circles, wobble for gyroscope rings)
    ts = np.linspace(0, 1, 9)
    ch = []
    for gi, grp in enumerate(spin):
        direction = 1 if gi == 0 else -1
        ang = direction * 2 * np.pi * ts
        ch.append((grp, "rotation", ts * (40 if gi == 0 else 60), np.array([quat_axis([0, 0, 1], a) for a in ang])))
    g.add_animation("ring_spin_slow", [ch[0]])
    g.add_animation("ring_spin_counter", [ch[1]])
    chs = []
    for k, (gid, q0, axis) in enumerate(gyros):
        T = 14 + k * 5
        t = np.linspace(0, T, 17)
        qs = np.array([quat_mul(quat_axis(axis, 2 * np.pi * x / T), q0) for x in t])
        for i in range(1, len(qs)):
            if np.dot(qs[i], qs[i - 1]) < 0:
                qs[i] = -qs[i]
        chs.append((gid, "rotation", t, qs))
        g.add_animation(f"ring_gyro_{k+1}_spin", [chs[-1]])
    return g.save(out("models", "portal", "portal_ring.glb"))


def crack_polylines(rng, starts, dirs, L, branch_p=0.3, depth=2, step=0.5):
    """2D polylines (in a local plane) with branching. Returns list of (pts[K,2], widths[K])."""
    res = []

    def walk(p, ang, length, w0, d):
        pts = [np.array(p)]; ws = [w0]
        n = max(3, int(length / step))
        for i in range(n):
            ang += rng.normal(0, 0.38)
            pts.append(pts[-1] + np.array([np.cos(ang), np.sin(ang)]) * step * rng.uniform(0.7, 1.2))
            ws.append(w0 * (1 - (i + 1) / (n + 1)) + 0.012)
            if d > 0 and rng.random() < branch_p and i > 0:
                walk(pts[-1], ang + rng.choice([-1, 1]) * rng.uniform(0.5, 1.1), length * rng.uniform(0.25, 0.5), w0 * 0.55, d - 1)
        res.append((np.array(pts), np.array(ws)))
    for p, a in zip(starts, dirs):
        walk(p, a, L * rng.uniform(0.6, 1.2), rng.uniform(0.16, 0.26), depth)
    return res


def portal_cracks():
    g = GLB("portal_cracks")
    mat = g.material("crack_glow", base=(1, 1, 1, 1), rough=1.0, emissive=(1.0, 0.16, 0.05), emissive_strength=2.0,
                     alpha="BLEND", double=True, unlit=False)
    rng = np.random.default_rng(77)
    # wall cracks: in the portal plane, radiating from the rift rim
    starts, dirs = [], []
    for k in range(22):
        t = k / 22 * 2 * np.pi + rng.normal(0, 0.1)
        starts.append((RIFT_A * 1.08 * np.cos(t), RIFT_B * 1.04 * np.sin(t)))
        dirs.append(np.arctan2(np.sin(t) / RIFT_B, np.cos(t) / RIFT_A) + rng.normal(0, 0.2))
    polys = crack_polylines(rng, starts, dirs, 6.5)
    parts = []
    for pts, ws in polys:
        p3 = np.stack([pts[:, 0], pts[:, 1], np.full(len(pts), 0.03)], 1)
        rb = ribbon(p3, ws, up_hint=[0, 0, 1], three_row=True, alpha=1.0)
        c = rb["col"]; core = c[:, 3] > 0.5
        c[core, :3] = [1.0, 0.62, 0.3]; c[~core, :3] = [1.0, 0.1, 0.04]
        parts.append(rb)
    g.add_node("cracks_wall", g.add_mesh("cracks_wall", merge(parts), mat))
    # ground cracks: fan across the ground in front of / around the portal base (local y = -PORTAL_C.y + 0.04)
    starts, dirs = [], []
    for k in range(18):
        x = rng.uniform(-RIFT_A * 1.2, RIFT_A * 1.2)
        starts.append((x, 0.0)); dirs.append(np.pi / 2 + rng.normal(0, 0.55) + (x / 6.0))   # +Z in XZ plane (v = z)
    polys = crack_polylines(rng, starts, dirs, 9.0, branch_p=0.35)
    parts = []
    y0 = -PORTAL_C[1] + 0.05
    for pts, ws in polys:
        p3 = np.stack([pts[:, 0], np.full(len(pts), y0), pts[:, 1] + 0.3], 1)
        rb = ribbon(p3, ws * 0.8, up_hint=[0, 1, 0], three_row=True, alpha=1.0)
        c = rb["col"]; core = c[:, 3] > 0.5
        c[core, :3] = [1.0, 0.6, 0.28]; c[~core, :3] = [1.0, 0.1, 0.04]
        parts.append(rb)
    g.add_node("cracks_ground", g.add_mesh("cracks_ground", merge(parts), mat))
    return g.save(out("models", "portal", "portal_cracks.glb"))


def portal_particles():
    g = GLB("portal_particles")
    mat = g.material("energy_points", base=(1, 1, 1, 1), alpha="BLEND", unlit=True, double=True)
    rng = np.random.default_rng(12)
    n = 700
    t = rng.uniform(0, 2 * np.pi, n)
    r = 0.4 + 7.5 * rng.random(n) ** 1.7
    x = r * np.cos(t) * (RIFT_A / RIFT_B * 1.4); y = r * np.sin(t)
    z = rng.normal(0, 1.2, n) + 0.6 * r * rng.random(n)
    pos = np.stack([x, y, z], 1)
    heat = np.exp(-r / 3.0)
    col = np.stack([np.ones(n), 0.08 + 0.55 * heat * rng.random(n), 0.04 + 0.2 * heat, 0.5 + 0.5 * rng.random(n)], 1)
    size = 0.06 + 0.18 * rng.random(n) ** 2
    mi = g.add_points("portal_energy_points", pos, col, size, rng.uniform(0, 6.283, n), mat)
    g.add_node("portal_particles", mi, extras={"sprite": "textures/particles/red_particle.png", "origin": "portal centre"})
    return g.save(out("models", "portal", "portal_particles.glb"))


# --------------------------------------------------------------------------------------------- EFFECTS
def bolt_path(rng, p0, p1, levels=6, disp=0.22):
    pts = [np.array(p0, float), np.array(p1, float)]
    d = disp * np.linalg.norm(pts[1] - pts[0])
    for _ in range(levels):
        new = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]):
            m = (a + b) / 2
            perp = rand_unit(rng)
            perp -= perp * np.dot(perp, normalize(b - a))
            new += [m + perp * d * rng.uniform(0.2, 1.0), b]
        pts = new
        d *= 0.5
    return np.array(pts)


def lightning():
    g = GLB("red_lightning")
    mat = g.material("lightning_core", base=(1.0, 0.8, 0.78, 1), rough=1.0, emissive=(1.0, 0.18, 0.14), emissive_strength=4.0, unlit=False)
    rng = np.random.default_rng(404)
    tops = [(-14, 30, -26), (-6, 31, -30), (3, 32, -34), (11, 30, -24), (17, 31, -30)]
    for k, top in enumerate(tops):
        top = np.array(top, float)
        target = top + np.array([rng.uniform(-6, 6), -top[1] - 0.3, rng.uniform(-5, 5)])
        main = bolt_path(rng, [0, 0, 0], target - top)
        parts = [tube(main, np.linspace(0.07, 0.035, len(main)), 3, color=(1.0, 0.85, 0.82, 1))]
        for _ in range(rng.integers(3, 6)):
            i = int(rng.integers(len(main) // 6, len(main) - len(main) // 6))
            st = main[i]
            end = st + np.array([rng.uniform(-9, 9), -rng.uniform(5, 12), rng.uniform(-6, 6)])
            bp = bolt_path(rng, st, end, 4, 0.25)
            parts.append(tube(bp, np.linspace(0.035, 0.012, len(bp)), 3, color=(1.0, 0.55, 0.5, 1)))
        m = merge(parts)
        g.add_node(f"lightning_bolt_{k+1:02d}", g.add_mesh(f"lightning_bolt_{k+1:02d}", m, mat), translation=top,
                   extras={"flash": True, "note": "origin = cloud end of the bolt; toggle visibility / scale for flashes"})
    return g.save(out("models", "effects", "red_lightning_effect.glb"))


def ribbons():
    g = GLB("energy_ribbons")
    mat = g.material("energy_ribbon", base=(1, 1, 1, 1), rough=1.0, emissive=(1.0, 0.2, 0.08), emissive_strength=1.5,
                     alpha="BLEND", double=True)
    rng = np.random.default_rng(21)
    holders = []
    for k in range(7):
        n = 72
        s = np.linspace(0, 1, n)
        ang = rng.uniform(0, 6.28) + s * rng.uniform(5, 9) * rng.choice([-1, 1])
        rad = 1.8 + 4.2 * s ** 0.8 + 0.5 * np.sin(s * 11 + k)
        path = np.stack([rad * np.cos(ang) * 0.9, rad * np.sin(ang) * 1.1, -2.5 + 12 * s], 1)
        w = 0.55 * np.sin(np.pi * s) ** 0.8 + 0.02
        alpha = np.sin(np.pi * s) ** 0.7 * 0.85
        rb = ribbon(path, w, up_hint=[0, 0, 1], alpha=alpha, color=(1.0, 0.18 + 0.4 * rng.random(), 0.08))
        holders.append(g.add_node(f"ribbon_spiral_{k+1:02d}", g.add_mesh(f"ribbon_spiral_{k+1:02d}", rb, mat)))
    for k in range(3):
        n = 60
        s = np.linspace(0, 1, n)
        path = np.stack([-9 + 18 * s, 2.5 + k * 2.2 + 0.9 * np.sin(s * 9 + k * 2), -6 + 2.0 * np.sin(s * 5 + k) + k * 2.0], 1)
        rb = ribbon(path, 0.4 * np.sin(np.pi * s) + 0.02, up_hint=[0, 1, 0], alpha=np.sin(np.pi * s) * 0.7, color=(1.0, 0.25, 0.12))
        holders.append(g.add_node(f"ribbon_drift_{k+1:02d}", g.add_mesh(f"ribbon_drift_{k+1:02d}", rb, mat)))
    ts = np.linspace(0, 1, 9)
    for k, nid in enumerate(holders[:7]):
        T = 30 + 6 * k
        g.add_animation(f"ribbon_spiral_{k+1:02d}_spin", [(nid, "rotation", ts * T, np.array([quat_axis([0, 0, 1], (1 if k % 2 else -1) * 2 * np.pi * x) for x in ts]))])
    return g.save(out("models", "effects", "energy_ribbons.glb"))


# --------------------------------------------------------------------------------------------- PROPS
def metal(g):
    return g.material("iron_rusted", base=(0.09, 0.075, 0.07, 1), metallic=0.75, rough=0.6)


def abandoned_sign():
    g = GLB("abandoned_sign")
    rng = np.random.default_rng(3)
    wood = mat_bark(g, (0.85, 0.82, 0.8, 1))
    iron = metal(g)
    face = g.material("sign_painted_vc", base=(1, 1, 1, 1), metallic=0.4, rough=0.7, double=True)
    post = tube(np.array([[0, -0.35, 0], [0.03, 1.0, 0.0], [0.08, 2.35, 0.02], [0.1, 2.75, 0.02]]), [0.075, 0.07, 0.06, 0.05], 6, uv_scale=(1, 1), cap_end=True)
    g.add_node("sign_post", g.add_mesh("sign_post", post, wood))
    # board: subdivided plate; stripes + grime written to vertex colours; bent lower corner
    nx, ny = 26, 16
    W, H = 1.15, 0.72

    def fn(X, Z):
        u, v = X / W + 0.5, Z / H + 0.5
        stripe = (np.sin((u + v) * 26) > 0.15).astype(float)
        grime = np.clip(rng.random(X.shape) * 0.0 + 0.5 + 0.5 * np.sin(u * 9 + v * 4) * np.sin(v * 7), 0, 1)
        border = (u < 0.07) | (u > 0.93) | (v < 0.1) | (v > 0.9)
        base = np.where(border[..., None], np.array([0.5, 0.06, 0.05])[None, None], np.where(stripe[..., None] > 0, np.array([0.34, 0.31, 0.25])[None, None], np.array([0.09, 0.075, 0.07])[None, None]))
        base = base * (0.45 + 0.55 * grime[..., None])
        bend = np.clip((u - 0.62) * (0.62 - v) * 6.0, 0, 1) ** 2 * 0.17        # bent corner
        return bend, np.concatenate([base, np.ones_like(grime)[..., None]], -1)
    bm = grid_mesh(nx, ny, fn, (W, H), uv_tiles=1.0)
    R = rot_x(np.pi / 2)
    bm = transform(bm, 1.0, R)
    bm = transform(bm, 1.0, rot_z(np.radians(14)), (0.55, 2.0, 0.08))
    g.add_node("sign_board", g.add_mesh("sign_board", bm, face))
    frame = merge([transform(box(1.22, 0.05, 0.05), 1.0, None, (0, 0.38, 0)), transform(box(1.22, 0.05, 0.05), 1.0, None, (0, -0.38, 0)),
                   transform(box(0.05, 0.8, 0.05), 1.0, None, (-0.6, 0, 0)), transform(box(0.05, 0.8, 0.05), 1.0, None, (0.6, 0, 0))])
    frame = transform(frame, 1.0, rot_z(np.radians(14)), (0.55, 2.0, 0.06))
    g.add_node("sign_frame", g.add_mesh("sign_frame", frame, iron))
    bracket = tube(np.array([[0.09, 2.5, 0.0], [0.09, 2.5, 0.06], [0.45, 2.45, 0.08]]), 0.02, 5, cap_end=True)
    g.add_node("sign_bracket", g.add_mesh("sign_bracket", bracket, iron))
    return g.save(out("models", "props", "abandoned_sign.glb"))


def broken_pole():
    g = GLB("broken_electric_pole")
    rng = np.random.default_rng(14)
    wood = mat_bark(g, (0.78, 0.74, 0.7, 1))
    iron = metal(g)
    wire = g.material("wire_rubber", base=(0.02, 0.02, 0.02, 1), rough=0.4)
    spark = g.material("wire_spark", base=(1, 0.5, 0.3, 1), emissive=(1.0, 0.3, 0.1), emissive_strength=4.0, rough=1.0)
    path = np.array([[0, -0.4, 0], [0.02, 1.4, 0.0], [0.07, 3.2, 0.02], [0.12, 5.2, 0.05]])
    lower = [tube(path, [0.2, 0.18, 0.16, 0.14], 8, uv_scale=(1, 0.5))]
    for i in range(7):
        a = i / 7 * 6.28 + rng.normal(0, 0.2)
        b = path[-1] + np.array([np.cos(a), 0, np.sin(a)]) * 0.09
        lower.append(tube(np.array([b, b + [np.cos(a) * 0.04, rng.uniform(0.25, 0.8), np.sin(a) * 0.04]]), [0.06, 0.008], 4, cap_end=False))
    g.add_node("pole_lower", g.add_mesh("pole_lower", merge(lower), wood))
    up = np.array([[0, 0, 0], [0.55, -0.4, 0.05], [1.2, -0.95, 0.12], [1.8, -1.55, 0.2]])
    upper = [tube(up, [0.15, 0.14, 0.13, 0.12], 8, uv_scale=(1, 0.5), cap_end=True)]
    for i in range(6):
        a = i / 6 * 6.28
        upper.append(tube(np.array([[0.02 * np.cos(a), 0.02, 0.1 * np.sin(a)], [0.1 * np.cos(a) - 0.25, 0.09 + 0.02, 0.1 * np.sin(a)]]), [0.05, 0.005], 4))
    uid = g.add_node("pole_upper", g.add_mesh("pole_upper", merge(upper), wood), translation=path[-1] + [0, 0.1, 0], rotation=quat_axis([0, 0, 1], 0.12))
    arm = merge([transform(box(1.7, 0.1, 0.1), 1.0, rot_z(np.radians(-40)), (1.4, -1.15, 0.16))])
    ins = merge([transform(tube(np.array([[0, 0, 0], [0, 0.22, 0]]), [0.05, 0.03], 6, cap_end=True), 1.0, None, (1.4 + k * 0.5 * np.cos(np.radians(-40)), -1.15 + k * 0.5 * np.sin(np.radians(-40)), 0.16)) for k in (-1, 0, 1)])
    g.add_node("pole_crossarm", g.add_mesh("pole_crossarm", merge([arm, ins]), iron), parent=uid)
    # wires hang from the three insulators on the swung-down cross-arm and dangle to the ground
    piv = path[-1] + np.array([0, 0.1, 0])
    Rp = rot_z(0.12)
    for k, kk in enumerate((-1, 0, 1)):
        loc = np.array([1.4 + kk * 0.5 * np.cos(np.radians(-40)), -1.15 + kk * 0.5 * np.sin(np.radians(-40)) + 0.22, 0.16])
        start = piv + Rp @ loc
        end = np.array([start[0] + 1.2 + 0.7 * k, 0.03, start[2] + 0.5 + 0.8 * k])
        s = np.linspace(0, 1, 18)
        rel = np.stack([(end[0] - start[0]) * s ** 1.5,
                        (end[1] - start[1]) * (1 - (1 - s) ** 2.2),
                        (end[2] - start[2]) * s + 0.1 * np.sin(s * 9 + k) * np.sin(np.pi * s)], 1)
        wm = tube(rel, 0.017, 4, cap_end=True)
        g.add_node(f"pole_wire_{k+1:02d}", g.add_mesh(f"pole_wire_{k+1:02d}", wm, wire), translation=start)
        g.add_node(f"wire_spark_{k+1:02d}", g.add_mesh(f"wire_spark_{k+1:02d}", icosphere(1, 0.07), spark),
                   translation=start + rel[-1], extras={"flicker": True})
    return g.save(out("models", "props", "broken_electric_pole.glb"))


def old_lamp():
    g = GLB("old_lamp")
    iron = metal(g)
    glass = g.material("lamp_glass", base=(1.0, 0.45, 0.25, 0.55), metallic=0.0, rough=0.2, emissive=(1.0, 0.28, 0.12), emissive_strength=1.7,
                       alpha="BLEND", double=True)
    bulb = g.material("lamp_bulb", base=(1, 0.8, 0.6, 1), emissive=(1.0, 0.55, 0.3), emissive_strength=8.0, rough=1.0)
    post = tube(np.array([[0, -0.2, 0], [0.01, 0.25, 0], [0.02, 0.6, 0], [0.03, 2.2, 0], [0.04, 3.6, 0]]), [0.25, 0.14, 0.075, 0.06, 0.05], 8, uv_scale=(1, 1))
    arm = tube(np.array([[0.04, 3.55, 0], [0.18, 3.95, 0], [0.55, 4.05, 0], [0.9, 3.9, 0]]), 0.035, 6, cap_end=True)
    lx, ly = 0.9, 3.55
    parts = [post, arm]
    for sx, sz in ((1, 1), (1, -1), (-1, 1), (-1, -1)):
        parts.append(transform(box(0.035, 0.46, 0.035), 1.0, None, (lx + sx * 0.15, ly + 0.2, sz * 0.15)))
    parts.append(transform(box(0.4, 0.04, 0.4), 1.0, None, (lx, ly - 0.03, 0)))
    cap = tube(np.array([[lx, ly + 0.43, 0], [lx, ly + 0.58, 0]]), [0.27, 0.03], 4, cap_end=True, twist=0)
    parts.append(transform(cap, 1.0, None, (0, 0, 0)))
    ring = tube(np.array([[lx, ly + 0.44, 0], [lx, ly + 0.46, 0]]), [0.24, 0.24], 4)
    parts.append(ring)
    g.add_node("lamp_body", g.add_mesh("lamp_body", merge(parts), iron), rotation=quat_axis([0, 0, 1], 0.05))
    gl = transform(box(0.27, 0.42, 0.27), 1.0, None, (lx, ly + 0.2, 0))
    g.add_node("lamp_glass", g.add_mesh("lamp_glass", gl, glass), rotation=quat_axis([0, 0, 1], 0.05))
    g.add_node("lamp_bulb", g.add_mesh("lamp_bulb", icosphere(1, 0.075), bulb), translation=[lx, ly + 0.2, 0], rotation=quat_axis([0, 0, 1], 0.05),
               extras={"flicker": True, "light": {"color": "#ff5a2a", "intensity": 6, "distance": 9}})
    return g.save(out("models", "props", "old_lamp.glb"))


def floating_rocks():
    g = GLB("floating_rocks")
    rock = mat_stone(g)
    rng = np.random.default_rng(45)
    for k in range(8):
        m = icosphere(1, 1.0)
        p = m["pos"].astype(float) * (1 + rng.normal(0, 0.2, (len(m["pos"]), 1)))
        p *= [rng.uniform(0.8, 1.2), rng.uniform(0.55, 0.9), rng.uniform(0.8, 1.2)]
        p[:, 1] = np.where(p[:, 1] < -0.3, p[:, 1] * 1.8 - 0.1, p[:, 1])      # pointed underside
        m = flat(mk(p, m["idx"], uv=m["uv"]))
        n = m["nrm"]
        under = np.clip(-n[:, 1] * 1.3, 0, 1)[:, None]
        top = np.clip(n[:, 1], 0, 1)[:, None]
        c = np.array([0.12, 0.11, 0.125])[None] * (1 - under) + np.array([0.26, 0.045, 0.045])[None] * under
        c = c + top * 0.04
        m["col"] = np.concatenate([c * rng.uniform(.85, 1.2), np.ones((len(c), 1))], 1).astype(np.float32)
        sc = rng.uniform(0.3, 1.0)
        m = transform(m, sc)
        a = k / 8 * 6.28 + rng.normal(0, .3)
        g.add_node(f"floating_rock_{k+1:02d}", g.add_mesh(f"floating_rock_{k+1:02d}", m, rock),
                   translation=[np.cos(a) * rng.uniform(2.5, 6), rng.uniform(0.8, 4.5), np.sin(a) * rng.uniform(2.5, 6)],
                   rotation=quat_axis(rand_unit(rng), rng.uniform(0, 0.6)),
                   extras={"floatAmp": round(float(rng.uniform(0.1, 0.3)), 3), "floatSpeed": round(float(rng.uniform(0.25, 0.5)), 3)})
    return g.save(out("models", "props", "floating_rocks.glb"))


def dead_branches():
    g = GLB("dead_branches")
    bark = mat_bark(g)
    rng = np.random.default_rng(58)
    ids = []
    for k in range(8):
        L = rng.uniform(1.8, 3.6)
        bp = branch_path(rng, [0, 0, 0], [1, rng.uniform(0.0, 0.4), rng.normal(0, 0.2)], L, 9, 0.02, 0.12)
        parts = [tube(bp, np.linspace(0.07, 0.01, len(bp)), 5, uv_scale=(1, 0.8), cap_end=True)]
        for s in range(rng.integers(3, 6)):
            sp = interp_path(bp, rng.uniform(0.2, 0.85))
            sb = branch_path(rng, sp, normalize(np.array([0.7, rng.choice([-1, 1]) * rng.uniform(0.4, 1.0), rng.normal(0, 0.8)])), L * rng.uniform(0.2, 0.4), 5, 0.05, 0.18)
            parts.append(tube(sb, np.linspace(0.035, 0.006, len(sb)), 4, uv_scale=(1, 0.8), cap_end=True))
        nid = g.add_node(f"dead_branch_{k+1:02d}", g.add_mesh(f"dead_branch_{k+1:02d}", merge(parts), bark), translation=[0, 0, k * 1.2])
        ids.append(nid)
    ch = []
    for i, nid in enumerate(ids):
        ts, qs = sway_keys(np.array([0, 0, 0, 1.0]), 1.5, 2.5, 7.0, i * 0.7)
        ch.append((nid, "rotation", ts, qs))
    g.add_animation("branch_sway", ch)
    return g.save(out("models", "props", "dead_branches.glb"))


def crystals():
    g = GLB("mysterious_crystals")
    mat = g.material("crystal_red", base=(1, 1, 1, 0.82), metallic=0.1, rough=0.12, emissive=(1.0, 0.05, 0.14), emissive_strength=1.7,
                     alpha="BLEND", double=True)
    rock = mat_stone(g)
    rng = np.random.default_rng(91)
    palette = [(0.9, 0.05, 0.12), (1.0, 0.18, 0.1), (0.6, 0.05, 0.5), (0.85, 0.08, 0.25)]
    for k in range(10):
        h = rng.uniform(0.6, 2.6) * (1.4 if k == 0 else 1)
        r = h * rng.uniform(0.09, 0.15)
        a = rng.uniform(0, 6.28); tilt = rng.uniform(0.05, 0.5) if k else 0.08
        path = np.array([[0, -0.05, 0], [0, h * 0.8, 0], [0, h, 0]])
        m = flat(tube(path, [r, r * 0.9, r * 0.04], 6))
        c = palette[int(rng.integers(0, len(palette)))]
        m = set_color(m, (c[0], c[1], c[2], 1.0))
        axis = np.array([-np.sin(a), 0, np.cos(a)])
        q = quat_axis(axis, tilt)
        d = rng.uniform(0.0, 0.7) if k else 0
        g.add_node(f"crystal_{k+1:02d}", g.add_mesh(f"crystal_{k+1:02d}", m, mat), translation=[np.cos(a) * d, 0, np.sin(a) * d], rotation=q,
                   extras={"pulse": True})
    rubble = []
    for k in range(9):
        m = icosphere(1, 1.0)
        p = m["pos"].astype(float) * (1 + rng.normal(0, 0.25, (len(m["pos"]), 1))) * [1, 0.6, 1] * rng.uniform(0.15, 0.4)
        m = transform(flat(mk(p, m["idx"], uv=m["uv"])), 1.0, None, (rng.normal(0, 0.7), 0.0, rng.normal(0, 0.7)))
        m = set_color(m, (0.14, 0.12, 0.13, 1))
        rubble.append(m)
    g.add_node("crystal_rubble_base", g.add_mesh("crystal_rubble_base", merge(rubble), rock))
    return g.save(out("models", "props", "mysterious_crystals.glb"))


def forest_roots():
    g = GLB("forest_roots")
    bark = mat_bark(g, (0.85, 0.82, 0.8, 1))
    rng = np.random.default_rng(72)
    N = 7
    for k in range(N):
        a = k / N * 6.28 + rng.normal(0, 0.18)
        L = rng.uniform(3.0, 5.5)
        s = np.linspace(0, 1, 14)
        arch = 0.75 * np.sin(np.pi * s ** 0.85) * (1 - 0.3 * s) - 0.7 * s ** 2
        wob = 0.25 * np.sin(s * 8 + k) * s
        d = np.array([np.cos(a), 0, np.sin(a)]); p = np.array([-np.sin(a), 0, np.cos(a)])
        path = np.stack([d[0] * L * s + p[0] * wob, 0.55 + arch, d[2] * L * s + p[2] * wob], 1)
        rad = 0.38 * (1 - s) ** 1.2 + 0.04
        parts = [tube(path, rad, 7, uv_scale=(1.2, 0.5), cap_end=True)]
        for _ in range(3):
            sp = interp_path(path, rng.uniform(0.2, 0.7))
            sb = branch_path(rng, sp, normalize(d * 1.0 + p * rng.choice([-1, 1]) * 0.9 + [0, -0.4, 0]), L * 0.3, 5, 0.05, 0.15)
            parts.append(tube(sb, np.linspace(0.07, 0.015, len(sb)), 5, uv_scale=(1, 0.6), cap_end=True))
        g.add_node(f"root_{k+1:02d}", g.add_mesh(f"root_{k+1:02d}", merge(parts), bark))
    return g.save(out("models", "props", "forest_roots.glb"))


def build_all():
    r = {}
    r["portal_main.glb"] = portal_main(); r["portal_ring.glb"] = portal_ring(); r["portal_cracks.glb"] = portal_cracks()
    r["portal_particles.glb"] = portal_particles(); r["red_lightning_effect.glb"] = lightning(); r["energy_ribbons.glb"] = ribbons()
    r["abandoned_sign.glb"] = abandoned_sign(); r["broken_electric_pole.glb"] = broken_pole(); r["old_lamp.glb"] = old_lamp()
    r["floating_rocks.glb"] = floating_rocks(); r["dead_branches.glb"] = dead_branches(); r["mysterious_crystals.glb"] = crystals()
    r["forest_roots.glb"] = forest_roots()
    return r


if __name__ == "__main__":
    for k, v in build_all().items():
        print(k, v)
