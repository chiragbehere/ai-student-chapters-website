"""Software preview renderer. Loads the shipped .glb files (+ scene_layout.json) back from disk and renders them
with a small numpy rasteriser: perspective-correct textures, fog, red portal light, alpha pass, bloom.
This is a preview only - the real target renderer is Three.js."""
import json, os, sys, time
import numpy as np
from PIL import Image
from scipy import ndimage
from glb import read_glb, normalize
from cc_common import ROOT

W, H = 2560, 1440
OUT_W, OUT_H = 1920, 1080
CT = {5126: "f4", 5123: "u2", 5125: "u4", 5121: "u1"}
NC = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}
_tex_cache = {}


def acc(js, binb, i):
    a = js["accessors"][i]; bv = js["bufferViews"][a["bufferView"]]
    n = a["count"] * NC[a["type"]]
    return np.frombuffer(binb, dtype=CT[a["componentType"]], count=n, offset=bv.get("byteOffset", 0) + a.get("byteOffset", 0)).reshape(a["count"], NC[a["type"]])


def load_tex(path, size=512):
    if path not in _tex_cache:
        im = Image.open(path).convert("RGBA")
        if max(im.size) > size:
            im = im.resize((size, size), Image.BOX)
        a = np.asarray(im, np.float32) / 255.0
        a[..., :3] = a[..., :3] ** 2.2          # sRGB -> linear
        _tex_cache[path] = a
    return _tex_cache[path]


def trs(n):
    T = np.eye(4)
    if "matrix" in n:
        return np.array(n["matrix"]).reshape(4, 4).T
    S = np.diag(list(n.get("scale", [1, 1, 1])) + [1])
    x, y, z, w = n.get("rotation", [0, 0, 0, 1])
    R = np.array([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), 0],
                  [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 0],
                  [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y), 0], [0, 0, 0, 1]])
    T[:3, 3] = n.get("translation", [0, 0, 0])
    return T @ R @ S


class Scene:
    def __init__(self):
        self.mats = []          # material dicts
        self.tris = {"pos": [], "nrm": [], "uv": [], "col": [], "mat": []}
        self.idx = []
        self.base = 0
        self.points = []

    def add_material(self, js, base_dir, mi):
        if mi is None:
            m = {"base": np.array([0.7, 0.7, 0.7, 1.0]), "rough": 1, "tex": None, "emis": np.zeros(3), "etex": None, "alpha": "OPAQUE",
                 "double": False, "unlit": False, "cutoff": 0.5}
        else:
            j = js["materials"][mi]; p = j["pbrMetallicRoughness"]
            m = {"base": np.array(p.get("baseColorFactor", [1, 1, 1, 1]), float), "tex": None, "etex": None,
                 "alpha": j.get("alphaMode", "OPAQUE"), "double": j.get("doubleSided", False), "cutoff": j.get("alphaCutoff", 0.5),
                 "unlit": "KHR_materials_unlit" in j.get("extensions", {}), "metal": p.get("metallicFactor", 0)}
            if "baseColorTexture" in p:
                uri = js["images"][js["textures"][p["baseColorTexture"]["index"]]["source"]]["uri"]
                m["tex"] = load_tex(os.path.normpath(os.path.join(base_dir, uri)))
            e = np.array(j.get("emissiveFactor", [0, 0, 0]), float)
            st = j.get("extensions", {}).get("KHR_materials_emissive_strength", {}).get("emissiveStrength", 1.0)
            m["emis"] = e * st
            if "emissiveTexture" in j:
                uri = js["images"][js["textures"][j["emissiveTexture"]["index"]]["source"]]["uri"]
                m["etex"] = load_tex(os.path.normpath(os.path.join(base_dir, uri)), 1024)
        self.mats.append(m)
        return len(self.mats) - 1

    def add_glb(self, path, M0, hide=()):
        js, binb = read_glb(path)
        bdir = os.path.dirname(path)
        matmap = {}
        # instances
        def walk(ni, M):
            n = js["nodes"][ni]
            Mn = M @ trs(n)
            if n.get("name") in hide:
                return
            if "mesh" in n:
                for prim in js["meshes"][n["mesh"]]["primitives"]:
                    pos = acc(js, binb, prim["attributes"]["POSITION"]).astype(float)
                    wp = (np.c_[pos, np.ones(len(pos))] @ Mn.T)[:, :3]
                    mi = prim.get("material")
                    if mi not in matmap:
                        matmap[mi] = self.add_material(js, bdir, mi)
                    col = acc(js, binb, prim["attributes"]["COLOR_0"]).astype(float) if "COLOR_0" in prim["attributes"] else None
                    if prim.get("mode", 4) == 0:
                        sz = acc(js, binb, prim["attributes"]["_SIZE"]).ravel()
                        sc = np.cbrt(abs(np.linalg.det(Mn[:3, :3])))
                        self.points.append((wp, col if col is not None else np.ones((len(wp), 4)), sz * sc, matmap[mi], n.get("name", "")))
                        continue
                    nrm = acc(js, binb, prim["attributes"]["NORMAL"]).astype(float)
                    wn = nrm @ np.linalg.inv(Mn[:3, :3]).T
                    wn = wn / (np.linalg.norm(wn, axis=1, keepdims=True) + 1e-12)
                    uv = acc(js, binb, prim["attributes"]["TEXCOORD_0"]).astype(float) if "TEXCOORD_0" in prim["attributes"] else np.zeros((len(pos), 2))
                    if col is None:
                        col = np.ones((len(pos), 4))
                    idx = acc(js, binb, prim["indices"]).ravel().astype(np.int64).reshape(-1, 3)
                    self.tris["pos"].append(wp); self.tris["nrm"].append(wn); self.tris["uv"].append(uv); self.tris["col"].append(col)
                    self.tris["mat"].append(np.full(len(pos), matmap[mi]))
                    self.idx.append(idx + self.base)
                    self.base += len(pos)
            for c in n.get("children", []):
                walk(c, Mn)
        for r in js["scenes"][0]["nodes"]:
            walk(r, M0)


def look_at(eye, target, up=(0, 1, 0)):
    f = normalize(np.array(target, float) - eye)
    r = normalize(np.cross(f, up)); u = np.cross(r, f)
    V = np.eye(4); V[0, :3] = r; V[1, :3] = u; V[2, :3] = -f
    V[:3, 3] = -V[:3, :3] @ eye
    return V


def yaw_matrix(yaw, pos, scale=1.0):
    c, s = np.cos(yaw), np.sin(yaw)
    M = np.array([[c, 0, s, pos[0]], [0, 1, 0, pos[1]], [-s, 0, c, pos[2]], [0, 0, 0, 1]], float)
    M[:3, :3] *= scale
    return M


def render(layout_path, out_path):
    t0 = time.time()
    doc = json.load(open(layout_path))
    S = Scene()
    for pl in doc["placements"]:
        S.add_glb(os.path.join(ROOT, pl["file"]), yaw_matrix(pl["yaw_radians"], pl["position"], pl["scale"]), pl.get("preview_hide_nodes", ()))
    pos = np.concatenate(S.tris["pos"]); nrm = np.concatenate(S.tris["nrm"]); uv = np.concatenate(S.tris["uv"])
    col = np.concatenate(S.tris["col"]); vmat = np.concatenate(S.tris["mat"]); idx = np.concatenate(S.idx)
    print(f"scene: {len(idx)} triangles, {sum(len(p[0]) for p in S.points)} points, {len(S.mats)} materials ({time.time()-t0:.1f}s)")

    cam = doc["camera"]; eye = np.array(cam["position"], float)
    V = look_at(eye, cam["target"])
    f = 1.0 / np.tan(np.radians(cam["fov_y_degrees"]) / 2); aspect = W / H
    vp = (np.c_[pos, np.ones(len(pos))] @ V.T)[:, :3]
    w = -vp[:, 2]
    sx = (vp[:, 0] * f / aspect / np.maximum(w, 1e-4) * 0.5 + 0.5) * W
    sy = (0.5 - vp[:, 1] * f / np.maximum(w, 1e-4) * 0.5) * H

    # ------------------------------------------------------------ lighting
    portal = np.array(doc["portal_centre"]) + [0, 0, 2.0]
    moon_dir = normalize(np.array([-0.35, 0.8, 0.45]))
    moon_col = np.array([0.09, 0.125, 0.28])
    amb = np.array([0.045, 0.038, 0.062])
    fog_col = np.array([0.050, 0.014, 0.030])
    lamp_pos = np.array([-7.2 + 0.9 * np.cos(-5.0), 3.7, -5.5]); lamp_col = np.array([1.0, 0.32, 0.12])

    def shade(P, N, albedo, emis, unlit, sidefix=None):
        d = np.linalg.norm(P - eye, axis=-1)
        if unlit:
            c = albedo.copy()
        else:
            Lp = portal - P
            dist2 = (Lp ** 2).sum(-1) + 1.0
            Lp = Lp / np.sqrt(dist2)[:, None]
            nl = np.clip((N * Lp).sum(-1), 0, 1)
            lit = amb[None] + moon_col[None] * np.clip((N * moon_dir).sum(-1), 0, 1)[:, None]
            lit = lit + np.array([0.075, 0.032, 0.05])[None] * (0.35 + 0.65 * np.clip(N[:, 1], 0, 1))[:, None]   # red-lit hemisphere bounce
            lit = lit + np.array([1.0, 0.16, 0.08])[None] * (95.0 / dist2 * (0.25 + 0.75 * nl))[:, None] * 0.55
            Ll = lamp_pos - P; dl2 = (Ll ** 2).sum(-1) + 0.5; Ll = Ll / np.sqrt(dl2)[:, None]
            lit = lit + lamp_col[None] * (7.0 / dl2 * np.clip((N * Ll).sum(-1), 0, 1))[:, None]
            c = albedo * lit
        c = c + emis
        fogf = (1 - np.exp(-(d * 0.019) ** 1.25))[:, None]
        yfog = np.exp(-np.clip(P[:, 1], 0, None) * 0.045)[:, None]
        fogf = np.clip(fogf * (0.55 + 0.45 * yfog), 0, 0.93)
        return c * (1 - fogf) + fog_col[None] * fogf

    # ------------------------------------------------------------ buffers
    img = np.zeros((H, W, 3)); zbuf = np.full((H, W), 1e9); glow = np.zeros((H, W, 3))
    # sky
    ys, xs = np.mgrid[0:H, 0:W]
    ndcx = ((xs + 0.5) / W * 2 - 1) * aspect / f; ndcy = (1 - (ys + 0.5) / H * 2) / f
    fwd = normalize(np.array(cam["target"], float) - eye); rgt = normalize(np.cross(fwd, [0, 1, 0])); upv = np.cross(rgt, fwd)
    rd = fwd[None, None] + rgt[None, None] * ndcx[..., None] + upv[None, None] * ndcy[..., None]
    rd = rd / np.linalg.norm(rd, axis=-1, keepdims=True)
    el = np.arcsin(np.clip(rd[..., 1], -1, 1)); az = np.arctan2(rd[..., 0], -rd[..., 2])
    tn = np.asarray(Image.open(os.path.join(ROOT, "textures/particles/fog_noise.png")).convert("L").resize((512, 512)), float) / 255
    cl = ndimage.map_coordinates(tn, [(el * 3.2 * 512 / (2 * np.pi) * 2.0) % 512, (az * 512 / (2 * np.pi) * 3.0) % 512], order=1, mode="wrap")
    t = np.clip(el / 0.75, 0, 1)
    sky = np.array([0.11, 0.032, 0.058])[None, None] * (1 - t)[..., None] + np.array([0.008, 0.004, 0.016])[None, None] * t[..., None]
    sky = sky * (0.45 + 1.1 * cl[..., None])
    pc = (np.array(doc["portal_centre"]) - eye); pdir = normalize(pc)
    ang = np.arccos(np.clip((rd * pdir).sum(-1), -1, 1))
    sky += np.array([1.0, 0.12, 0.06])[None, None] * (0.40 * np.exp(-(ang / 0.22) ** 2) + 0.11 * np.exp(-(ang / 0.7) ** 2))[..., None] * (0.5 + 0.8 * cl[..., None])
    img[:] = sky

    # ------------------------------------------------------------ triangle setup
    A, B, C = idx[:, 0], idx[:, 1], idx[:, 2]
    wA, wB, wC = w[A], w[B], w[C]
    ok = (wA > 0.25) & (wB > 0.25) & (wC > 0.25)
    minx = np.minimum(np.minimum(sx[A], sx[B]), sx[C]); maxx = np.maximum(np.maximum(sx[A], sx[B]), sx[C])
    miny = np.minimum(np.minimum(sy[A], sy[B]), sy[C]); maxy = np.maximum(np.maximum(sy[A], sy[B]), sy[C])
    ok &= (maxx > 0) & (minx < W) & (maxy > 0) & (miny < H)
    area2 = (sx[B] - sx[A]) * (sy[C] - sy[A]) - (sx[C] - sx[A]) * (sy[B] - sy[A])
    ok &= np.abs(area2) > 0.05
    mats = S.mats
    mode_opaque = np.array([m["alpha"] in ("OPAQUE", "MASK") for m in mats])
    tri_mat = vmat[A]
    opaque_ids = np.where(ok & mode_opaque[tri_mat])[0]
    blend_ids = np.where(ok & ~mode_opaque[tri_mat])[0]
    print(f"rasterising {len(opaque_ids)} opaque + {len(blend_ids)} blended triangles")

    def draw_tri(ti, blend):
        a, b, c = A[ti], B[ti], C[ti]
        m = mats[tri_mat[ti]]
        x0, x1 = max(int(np.floor(minx[ti])), 0), min(int(np.ceil(maxx[ti])), W)
        y0, y1 = max(int(np.floor(miny[ti])), 0), min(int(np.ceil(maxy[ti])), H)
        if x1 <= x0 or y1 <= y0:
            return
        px = np.arange(x0, x1) + 0.5; py = (np.arange(y0, y1) + 0.5)[:, None]
        ar = area2[ti]
        l0 = ((sx[b] - px) * (sy[c] - py) - (sx[c] - px) * (sy[b] - py)) / ar
        l1 = ((sx[c] - px) * (sy[a] - py) - (sx[a] - px) * (sy[c] - py)) / ar
        l2 = 1 - l0 - l1
        inside = (l0 >= -1e-6) & (l1 >= -1e-6) & (l2 >= -1e-6)
        if not inside.any():
            return
        if not m["double"] and not blend and ar > 0:       # back-face cull (screen-space y is flipped => ar>0 is back)
            return
        q0, q1, q2 = l0 / wA[ti], l1 / wB[ti], l2 / wC[ti]
        qs = q0 + q1 + q2
        depth = 1.0 / qs
        zb = zbuf[y0:y1, x0:x1]
        mask = inside & (depth < zb)
        if not mask.any():
            return
        p0, p1, p2 = q0 / qs, q1 / qs, q2 / qs
        P3 = p0[..., None] * pos[a] + p1[..., None] * pos[b] + p2[..., None] * pos[c]
        N3 = p0[..., None] * nrm[a] + p1[..., None] * nrm[b] + p2[..., None] * nrm[c]
        N3 = N3 / (np.linalg.norm(N3, axis=-1, keepdims=True) + 1e-9)
        if m["double"]:
            vdir = eye - P3
            flip = ((N3 * vdir).sum(-1) < 0)[..., None]
            N3 = np.where(flip, -N3, N3)
        uvp = p0[..., None] * uv[a] + p1[..., None] * uv[b] + p2[..., None] * uv[c]
        vc = p0[..., None] * col[a] + p1[..., None] * col[b] + p2[..., None] * col[c]
        base = m["base"][None, None] * vc
        alpha = base[..., 3]
        if m["tex"] is not None:
            t = m["tex"]; th, tw = t.shape[:2]
            tx = (uvp[..., 0] % 1.0 * tw).astype(int) % tw; ty = (uvp[..., 1] % 1.0 * th).astype(int) % th
            tex = t[ty, tx]
            base = base * tex; alpha = alpha * tex[..., 3] if t.shape[2] == 4 else alpha
        if m["alpha"] == "MASK":
            mask = mask & (alpha >= m["cutoff"])
            if not mask.any():
                return
        emis = np.broadcast_to(m["emis"][None, None], base[..., :3].shape).copy()
        if m["etex"] is not None:
            t = m["etex"]; th, tw = t.shape[:2]
            tx = np.clip((uvp[..., 0] * tw).astype(int), 0, tw - 1); ty = np.clip((uvp[..., 1] * th).astype(int), 0, th - 1)
            emis = emis * t[ty, tx][..., :3]
        shp = base.shape[:2]
        flatP = P3.reshape(-1, 3); flatN = N3.reshape(-1, 3)
        colr = shade(flatP, flatN, base[..., :3].reshape(-1, 3), emis.reshape(-1, 3), m["unlit"]).reshape(shp + (3,))
        sl = (slice(y0, y1), slice(x0, x1))
        if blend:
            a_ = np.clip(alpha, 0, 1)[..., None] * mask[..., None]
            img[sl] = img[sl] * (1 - a_) + colr * a_
            glow[sl] += emis * a_ * 0.6
        else:
            img[sl] = np.where(mask[..., None], colr, img[sl])
            zbuf[sl] = np.where(mask, depth, zb)
            glow[sl] += np.where(mask[..., None], emis, 0)

    t1 = time.time()
    for k, ti in enumerate(opaque_ids):
        draw_tri(ti, False)
        if k % 40000 == 0 and k:
            print(f"  opaque {k}/{len(opaque_ids)} ({time.time()-t1:.0f}s)")
    # blended triangles back-to-front
    cdepth = (wA + wB + wC)[blend_ids] / 3
    for ti in blend_ids[np.argsort(-cdepth)]:
        zsave = None
        draw_blend = draw_tri
        # blended pass: test against opaque depth but do not write: emulate by temporary depth compare
        draw_tri(ti, True)
    print(f"triangles done ({time.time()-t1:.0f}s)")

    # ------------------------------------------------------------ points (fog, energy motes)
    for ppos, pcol, psize, mi, name in S.points:
        vpp = (np.c_[ppos, np.ones(len(ppos))] @ V.T)[:, :3]
        wp = -vpp[:, 2]
        spx = (vpp[:, 0] * f / aspect / np.maximum(wp, 1e-4) * 0.5 + 0.5) * W
        spy = (0.5 - vpp[:, 1] * f / np.maximum(wp, 1e-4) * 0.5) * H
        order = np.argsort(-wp)
        is_fog = "fog" in name
        for i in order:
            if wp[i] < 0.5:
                continue
            rpx = psize[i] * 0.5 * f / wp[i] * 0.5 * H
            if rpx < 0.8:
                rpx = 0.8
            if is_fog:
                rpx = min(rpx, 260)
            x0, x1 = int(spx[i] - rpx), int(spx[i] + rpx) + 1; y0, y1 = int(spy[i] - rpx), int(spy[i] + rpx) + 1
            if x1 <= 0 or x0 >= W or y1 <= 0 or y0 >= H:
                continue
            x0, y0 = max(x0, 0), max(y0, 0); x1, y1 = min(x1, W), min(y1, H)
            gx = (np.arange(x0, x1) + 0.5 - spx[i]) / rpx; gy = (np.arange(y0, y1)[:, None] + 0.5 - spy[i]) / rpx
            r2 = gx ** 2 + gy ** 2
            fall = np.exp(-r2 * 3.0) * (r2 < 1)
            vis = (zbuf[y0:y1, x0:x1] > wp[i]) if True else 1
            a_ = fall * pcol[i, 3] * vis
            sl = (slice(y0, y1), slice(x0, x1))
            if is_fog:
                a_ = a_ * 0.5
                img[sl] = img[sl] * (1 - a_[..., None]) + (pcol[i, :3] * np.array([0.30, 0.19, 0.25]))[None, None] * a_[..., None]
            else:
                c = pcol[i, :3] * 2.2
                img[sl] += c[None, None] * a_[..., None]
                glow[sl] += c[None, None] * a_[..., None] * 0.9

    # ------------------------------------------------------------ post: bloom, tonemap, overlays
    bl = sum(ndimage.gaussian_filter(glow, (s, s, 0)) * g for s, g in ((5, 0.22), (16, 0.26), (44, 0.26), (110, 0.22)))
    hdr = (img + bl * 0.7) * 0.95
    ldr = np.clip((hdr * (2.51 * hdr + 0.03)) / (hdr * (2.43 * hdr + 0.59) + 0.14), 0, 1)   # ACES fit
    ldr = ldr ** (1 / 2.2)
    im = Image.fromarray((ldr * 255 + 0.5).astype(np.uint8)).resize((OUT_W, OUT_H), Image.LANCZOS).convert("RGBA")
    vg = Image.open(os.path.join(ROOT, "graphics/vignette.png")).convert("RGBA").resize((OUT_W, OUT_H))
    im.alpha_composite(vg)
    gr = Image.open(os.path.join(ROOT, "graphics/film_grain.png")).convert("RGBA")
    tile = Image.new("RGBA", (OUT_W, OUT_H))
    for yy in range(0, OUT_H, gr.height):
        for xx in range(0, OUT_W, gr.width):
            tile.paste(gr, (xx, yy))
    ta = np.asarray(tile, float); ta[..., 3] *= 0.10
    im.alpha_composite(Image.fromarray(ta.astype(np.uint8), "RGBA"))
    im.convert("RGB").save(out_path, optimize=True)
    print("preview written", out_path, f"({time.time()-t0:.0f}s total)")


if __name__ == "__main__":
    render(os.path.join(ROOT, "models/scene_layout.json"), sys.argv[1] if len(sys.argv) > 1 else "/home/claude/build/preview.png")
