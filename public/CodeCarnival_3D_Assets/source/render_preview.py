"""
render_preview.py - software (numpy) renderer that loads the *finished GLB files* and renders the assembled scene.

It is a preview/QA tool, not a PBR renderer: per-vertex lighting (portal point light + moon + ambient), texture sampling with
mip selection, exponential fog, additive glow for unlit blended materials, additive point splats, bloom, vignette and grain.
No shadows, no normal maps, no real PBR. Use it to judge composition and asset sanity only.
"""
import json
import math
import os
import sys
import time

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib_glb import accessor_array, read_glb

OUT = "/home/claude/CodeCarnival_3D_Assets"
PORTAL = np.array([0.0, 4.8, -18.0])

# ------------------------------------------------------------------ scene description
FOG_COLOR = np.array([0.075, 0.018, 0.032])
FOG_DENSITY = 0.017
AMBIENT = np.array([0.030, 0.036, 0.062])
MOON_DIR = normalize = None


def nrm(v):
    v = np.asarray(v, dtype=np.float64)
    return v / (np.linalg.norm(v, axis=-1, keepdims=True) + 1e-12)


MOON_DIR = nrm([-0.35, 0.85, 0.40])
MOON_COL = np.array([0.060, 0.085, 0.170])
PL_POS = PORTAL + np.array([0, -0.5, 3.0])
PL_COL = np.array([1.0, 0.085, 0.040])
PL_K = 11.0


def quat_to_mat(q):
    x, y, z, w = q
    return np.array([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
                     [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
                     [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]])


def local_matrix(n):
    m = np.eye(4)
    R = quat_to_mat(n.get("rotation", [0, 0, 0, 1]))
    S = np.array(n.get("scale", [1, 1, 1]))
    m[:3, :3] = R * S[None, :]
    m[:3, 3] = n.get("translation", [0, 0, 0])
    return m


_tex_cache = {}


def load_tex(path):
    if path in _tex_cache:
        return _tex_cache[path]
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im).astype(np.float32) / 255.0
    a[..., :3] = a[..., :3] ** 2.2          # sRGB -> linear (approx.)
    mips = [a]
    cur = im
    while cur.size[0] > 16:
        cur = cur.resize((cur.size[0] // 2, cur.size[1] // 2), Image.BOX)
        b = np.asarray(cur).astype(np.float32) / 255.0
        b[..., :3] = b[..., :3] ** 2.2
        mips.append(b)
    _tex_cache[path] = mips
    return mips


# ------------------------------------------------------------------ GLB -> draw items
def collect(path, world=np.eye(4)):
    gltf, binb = read_glb(path)
    base = os.path.dirname(path)
    items = []
    nodes = gltf["nodes"]

    def tex_info(tref):
        if tref is None:
            return None, False
        t = gltf["textures"][tref["index"]]
        uri = gltf["images"][t["source"]]["uri"]
        clamp = gltf["samplers"][t["sampler"]]["wrapS"] == 33071
        return load_tex(os.path.normpath(os.path.join(base, uri))), clamp

    def walk(i, parent):
        n = nodes[i]
        W = parent @ local_matrix(n)
        if "mesh" in n:
            mesh = gltf["meshes"][n["mesh"]]
            for p in mesh["primitives"]:
                at = p["attributes"]
                pos = accessor_array(gltf, binb, at["POSITION"]).astype(np.float64)
                wp = pos @ W[:3, :3].T + W[:3, 3]
                mat = gltf["materials"][p["material"]]
                pbr = mat["pbrMetallicRoughness"]
                it = dict(name=n["name"], mname=mat["name"], pos=wp, mode=p.get("mode", 4),
                          extras=n.get("extras", {}), base=np.array(pbr["baseColorFactor"]),
                          unlit="KHR_materials_unlit" in mat.get("extensions", {}), alpha=mat.get("alphaMode", "OPAQUE"),
                          emis=np.array(mat.get("emissiveFactor", [0, 0, 0])))
                if "NORMAL" in at:
                    nn = accessor_array(gltf, binb, at["NORMAL"]).astype(np.float64)
                    # inverse transpose is overkill for uniform-ish scales; normalise after rotation
                    it["nrm"] = nrm(nn @ W[:3, :3].T)
                if "COLOR_0" in at:
                    c = accessor_array(gltf, binb, at["COLOR_0"]).astype(np.float64) / 255.0
                    it["col"] = c
                if "TEXCOORD_0" in at:
                    it["uv"] = accessor_array(gltf, binb, at["TEXCOORD_0"]).astype(np.float64)
                if "TEXCOORD_1" in at:
                    it["uv1"] = accessor_array(gltf, binb, at["TEXCOORD_1"]).astype(np.float64)
                if "indices" in p:
                    it["idx"] = accessor_array(gltf, binb, p["indices"]).reshape(-1, 3).astype(np.int64)
                it["tex"], it["tex_clamp"] = tex_info(pbr.get("baseColorTexture"))
                et = mat.get("emissiveTexture")
                it["etex"], it["etex_clamp"] = tex_info(et)
                it["etex_uv"] = et.get("texCoord", 0) if et else 0
                items.append(it)
        for c in n.get("children", []):
            walk(c, W)

    for r in gltf["scenes"][gltf["scene"]]["nodes"]:
        walk(r, world)
    return items


# ------------------------------------------------------------------ camera
class Camera:
    def __init__(self, eye, target, fov_deg, W, H):
        self.eye = np.array(eye, float)
        f = nrm(np.array(target, float) - self.eye)
        r = nrm(np.cross(f, [0, 1, 0]))
        u = np.cross(r, f)
        self.R = np.stack([r, u, f])          # world -> view rows
        self.W, self.H = W, H
        self.fy = (H / 2) / math.tan(math.radians(fov_deg) / 2)
        self.fx = self.fy
        self.f, self.r, self.u = f, r, u

    def view(self, p):
        return (p - self.eye) @ self.R.T      # x right, y up, z forward


# ------------------------------------------------------------------ rasteriser
class Raster:
    def __init__(self, cam):
        self.cam = cam
        self.color = np.zeros((cam.H, cam.W, 3), np.float32)
        self.depth = np.full((cam.H, cam.W), np.inf, np.float32)

    # clip + project triangles (attribute matrix V: [view xyz | extra...]) -------------------------
    def tris_from(self, V, idx, near=0.15):
        T = V[idx]                                    # (T,3,K)
        z = T[:, :, 2]
        ok = (z > near).all(1)
        part = (~ok) & (z > near).any(1)
        out = [T[ok]]
        for t in T[part]:
            inside = [k for k in range(3) if t[k, 2] > near]
            poly = []
            for k in range(3):
                a, b = t[k], t[(k + 1) % 3]
                ain, bin_ = a[2] > near, b[2] > near
                if ain:
                    poly.append(a)
                if ain != bin_:
                    s = (near - a[2]) / (b[2] - a[2])
                    poly.append(a + (b - a) * s)
            for k in range(1, len(poly) - 1):
                out.append(np.stack([poly[0], poly[k], poly[k + 1]])[None])
        return np.concatenate(out) if out else np.zeros((0, 3, V.shape[1]))

    def draw(self, T, it, mode, exposure_fog=True, depth_write=True, blend="opaque"):
        cam = self.cam
        W, H = cam.W, cam.H
        if len(T) == 0:
            return
        zc = T[:, :, 2]
        sx = T[:, :, 0] / zc * cam.fx + W / 2
        sy = -T[:, :, 1] / zc * cam.fy + H / 2
        area = (sx[:, 1] - sx[:, 0]) * (sy[:, 2] - sy[:, 0]) - (sx[:, 2] - sx[:, 0]) * (sy[:, 1] - sy[:, 0])
        minx = np.floor(sx.min(1)).clip(0, W - 1).astype(int)
        maxx = np.ceil(sx.max(1)).clip(0, W - 1).astype(int)
        miny = np.floor(sy.min(1)).clip(0, H - 1).astype(int)
        maxy = np.ceil(sy.max(1)).clip(0, H - 1).astype(int)
        valid = (np.abs(area) > 1e-6) & (sx.max(1) >= 0) & (sx.min(1) <= W) & (sy.max(1) >= 0) & (sy.min(1) <= H)
        tex, tclamp = it.get("tex"), it.get("tex_clamp")
        etex, eclamp, euv = it.get("etex"), it.get("etex_clamp"), it.get("etex_uv", 0)
        emis = it["emis"]
        density = FOG_DENSITY
        for t in np.nonzero(valid)[0]:
            x0, x1, x2 = sx[t]
            y0, y1, y2 = sy[t]
            ar = area[t]
            xs = np.arange(minx[t], maxx[t] + 1) + 0.5
            ys = np.arange(miny[t], maxy[t] + 1) + 0.5
            if len(xs) == 0 or len(ys) == 0:
                continue
            px, py = np.meshgrid(xs, ys)
            l0 = ((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)) / ar
            l1 = ((x2 - px) * (y0 - py) - (x0 - px) * (y2 - py)) / ar
            l2 = 1 - l0 - l1
            m = (l0 >= -1e-4) & (l1 >= -1e-4) & (l2 >= -1e-4)
            if not m.any():
                continue
            w0, w1, w2 = 1 / zc[t]
            winv = l0 * w0 + l1 * w1 + l2 * w2
            d = 1.0 / np.maximum(winv, 1e-9)
            sub = self.depth[miny[t]:maxy[t] + 1, minx[t]:maxx[t] + 1]
            m &= d < sub
            if not m.any():
                continue
            b0, b1, b2 = l0 * w0 / winv, l1 * w1 / winv, l2 * w2 / winv
            A = T[t]
            alb = (b0[..., None] * A[0, 3:6] + b1[..., None] * A[1, 3:6] + b2[..., None] * A[2, 3:6])
            lit = (b0[..., None] * A[0, 6:9] + b1[..., None] * A[1, 6:9] + b2[..., None] * A[2, 6:9])
            alpha_v = b0 * A[0, 13] + b1 * A[1, 13] + b2 * A[2, 13]
            if tex is not None:
                uv = (b0[..., None] * A[0, 9:11] + b1[..., None] * A[1, 9:11] + b2[..., None] * A[2, 9:11])
                dtu = abs((A[1, 9] - A[0, 9]) * (A[2, 10] - A[0, 10]) - (A[2, 9] - A[0, 9]) * (A[1, 10] - A[0, 10]))
                texels = dtu * tex[0].shape[0] ** 2
                lvl = int(np.clip(0.5 * math.log2(max(texels / abs(ar), 1e-6) + 1e-9), 0, len(tex) - 1))
                arr = tex[lvl]
                sz = arr.shape[0]
                if tclamp:
                    ix = np.clip((uv[..., 0] * sz).astype(int), 0, sz - 1)
                    iy = np.clip((uv[..., 1] * sz).astype(int), 0, sz - 1)
                else:
                    ix = (uv[..., 0] * sz).astype(int) % sz
                    iy = (uv[..., 1] * sz).astype(int) % sz
                ts = arr[iy, ix]
                alb = alb * ts[..., :3]
                alpha_tex = ts[..., 3]
            else:
                alpha_tex = 1.0
            col = alb * lit
            if etex is not None:
                c0 = 11 if euv == 1 else 9
                uv = (b0[..., None] * A[0, c0:c0 + 2] + b1[..., None] * A[1, c0:c0 + 2] + b2[..., None] * A[2, c0:c0 + 2])
                sz = etex[0].shape[0]
                if eclamp:
                    ix = np.clip((uv[..., 0] * sz).astype(int), 0, sz - 1)
                    iy = np.clip((uv[..., 1] * sz).astype(int), 0, sz - 1)
                else:
                    ix = (uv[..., 0] * sz).astype(int) % sz
                    iy = (uv[..., 1] * sz).astype(int) % sz
                col = col + etex[0][iy, ix][..., :3] * emis * 1.6
            else:
                col = col + emis * 0.55
            sel = self.color[miny[t]:maxy[t] + 1, minx[t]:maxx[t] + 1]
            if blend == "opaque":
                if exposure_fog:
                    f = (1 - np.exp(-d * density))[..., None]
                    col = col * (1 - f) + FOG_COLOR * f
                sel[m] = col[m]
                sub[m] = d[m]
            elif blend == "add":
                a = (alpha_v * alpha_tex)[..., None]
                sel[m] += (col * a)[m] * 1.0
            elif blend == "alpha":
                a = np.clip(alpha_v * alpha_tex, 0, 1)[..., None]
                if exposure_fog:
                    f = (1 - np.exp(-d * density))[..., None]
                    col = col * (1 - f) + FOG_COLOR * f
                sel[m] = (sel[m] * (1 - a[m]) + col[m] * a[m])

    def splat(self, P, C, size, soft_gain=1.0, falloff=2.0):
        cam = self.cam
        V = cam.view(P)
        ok = V[:, 2] > 0.3
        V, C = V[ok], C[ok]
        sx = V[:, 0] / V[:, 2] * cam.fx + cam.W / 2
        sy = -V[:, 1] / V[:, 2] * cam.fy + cam.H / 2
        rad = np.maximum(size * cam.fy / V[:, 2], 0.7)
        order = np.argsort(-V[:, 2])
        for k in order:
            r = rad[k]
            if r > 600:
                continue
            x0, x1 = int(max(sx[k] - r, 0)), int(min(sx[k] + r + 1, cam.W))
            y0, y1 = int(max(sy[k] - r, 0)), int(min(sy[k] + r + 1, cam.H))
            if x0 >= x1 or y0 >= y1:
                continue
            xs = np.arange(x0, x1) + 0.5 - sx[k]
            ys = np.arange(y0, y1) + 0.5 - sy[k]
            rr2 = (xs[None, :] ** 2 + ys[:, None] ** 2) / (r * r)
            g = np.exp(-rr2 * falloff * 1.6) * (rr2 < 1.0)
            vis = (V[k, 2] < self.depth[y0:y1, x0:x1])
            self.color[y0:y1, x0:x1] += (g * vis)[..., None] * (C[k, :3] * C[k, 3] * soft_gain)[None, None, :]


def sky(cam):
    W, H = cam.W, cam.H
    y, x = (np.mgrid[0:H, 0:W] + 0.5)
    dirv = (cam.f[None, None, :] + ((x - W / 2) / cam.fx)[..., None] * cam.r[None, None, :]
            - ((y - H / 2) / cam.fy)[..., None] * cam.u[None, None, :])
    dirv = dirv / np.linalg.norm(dirv, axis=-1, keepdims=True)
    up = dirv[..., 1]
    tgt = nrm(PORTAL - cam.eye)
    ang = np.arccos(np.clip(dirv @ tgt, -1, 1))
    t = np.clip((up + 0.05) / 0.9, 0, 1)
    top = np.array([0.006, 0.006, 0.020])
    hor = np.array([0.20, 0.028, 0.050])
    s = top[None, None, :] * t[..., None] + hor[None, None, :] * (1 - t[..., None]) ** 2.2
    glow = np.exp(-(ang / 0.55) ** 2)[..., None] * np.array([0.55, 0.06, 0.04]) + np.exp(-(ang / 0.16) ** 2)[..., None] * np.array([0.5, 0.15, 0.08])
    below = (up < 0)[..., None]
    s = s + glow * 0.9
    s = np.where(below, FOG_COLOR[None, None, :] * 1.2, s)
    return s.astype(np.float32)


def shade(it, cam=None):
    """Per-vertex lighting -> (albedo_v, light) arrays."""
    n = len(it["pos"])
    col = it.get("col")
    base = it["base"]
    alb = np.ones((n, 3)) * base[:3]
    if col is not None:
        alb = alb * col[:, :3]
    alpha = np.ones(n) * base[3]
    if col is not None:
        alpha = alpha * col[:, 3]
    if it["unlit"]:
        light = np.ones((n, 3))
    else:
        N = it.get("nrm")
        if N is None:
            N = np.tile([0, 1, 0.0], (n, 1))
        moon = np.clip(N @ MOON_DIR, 0, 1)[:, None] * MOON_COL
        to = PL_POS[None, :] - it["pos"]
        dist = np.linalg.norm(to, axis=1, keepdims=True)
        L = to / (dist + 1e-9)
        ndl = np.clip((np.sum(N * L, 1, keepdims=True) + 0.35) / 1.35, 0, 1)
        atten = PL_K / (1 + (dist / 5.5) ** 2)
        light = AMBIENT[None, :] + moon + ndl * atten * PL_COL[None, :]
    return alb, light, alpha


def render(draws, cam, extra_splats=True):
    R = Raster(cam)
    R.color[:] = sky(cam)
    opaque, trans, pts = [], [], []
    for it in draws:
        if it["mode"] == 0:
            pts.append(it)
            continue
        is_glow = it["alpha"] == "BLEND" and it["unlit"]
        if it["mname"] == "fog_sheet":
            trans.append((it, "alpha"))
        elif is_glow:
            trans.append((it, "add"))
        else:
            opaque.append(it)
    t0 = time.time()
    ntri = 0

    def prep(it):
        alb, light, alpha = shade(it)
        N = len(it["pos"])
        V = np.zeros((N, 14))
        V[:, 0:3] = cam.view(it["pos"])
        V[:, 3:6] = alb
        V[:, 6:9] = light
        if "uv" in it:
            V[:, 9:11] = it["uv"]
        if "uv1" in it:
            V[:, 11:13] = it["uv1"]
        V[:, 13] = alpha
        return V

    for it in opaque:
        V = prep(it)
        T = R.tris_from(V, it["idx"])
        ntri += len(T)
        R.draw(T, it, "opaque", exposure_fog=not (it["unlit"]), blend="opaque")
    # transparents far -> near
    def depth_of(it):
        return cam.view(it["pos"].mean(0, keepdims=True))[0, 2]

    for it, bl in sorted(trans, key=lambda a: -depth_of(a[0])):
        V = prep(it)
        T = R.tris_from(V, it["idx"])
        ntri += len(T)
        R.draw(T, it, bl, blend=bl, exposure_fog=(bl == "alpha"))
    for it in pts:
        col = it.get("col", np.ones((len(it["pos"]), 4)))
        size = it["extras"].get("size", 0.1)
        R.splat(it["pos"], col, size, soft_gain=0.55 if size < 1 else 0.10, falloff=2.2)
    print(f"  rasterised {ntri} triangles in {time.time()-t0:.1f}s")
    return R.color


def post(img, W, H, out_w, out_h, vignette_path, grain_path, exposure=1.35, seed=1):
    c = img.astype(np.float64)
    bright = np.clip(c - 0.55, 0, None)
    bloom = sum(gaussian_filter(bright, sigma=(s, s, 0)) * g for s, g in [(5, 0.7), (16, 0.7), (48, 0.9)])
    c = c + bloom
    c = 1 - np.exp(-c * exposure)
    c = np.clip(c, 0, 1) ** (1 / 2.2)
    im = Image.fromarray((c * 255 + 0.5).astype(np.uint8), "RGB").resize((out_w, out_h), Image.LANCZOS).convert("RGBA")
    vg = Image.open(vignette_path).convert("RGBA").resize((out_w, out_h), Image.BICUBIC)
    im = Image.alpha_composite(im, vg)
    gr = Image.open(grain_path).convert("RGBA")
    layer = Image.new("RGBA", (out_w, out_h))
    for yy in range(0, out_h, 512):
        for xx in range(0, out_w, 512):
            layer.paste(gr, (xx, yy))
    a = np.asarray(layer).copy()
    a[..., 3] = (a[..., 3] * 0.10).astype(np.uint8)
    im = Image.alpha_composite(im, Image.fromarray(a, "RGBA"))
    return im.convert("RGB")


def world_T(t, ry=0.0, s=1.0):
    m = np.eye(4)
    c, sn = math.cos(ry), math.sin(ry)
    m[:3, :3] = np.array([[c, 0, sn], [0, 1, 0], [-sn, 0, c]]) * s
    m[:3, 3] = t
    return m


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "env"
    layout = json.load(open(os.path.join(OUT, "animations", "scene_layout.json")))
    pl = layout["placement"]
    M = os.path.join(OUT, "models")
    t0 = time.time()
    if which == "env":
        files = ["environment/environment_ground.glb", "environment/environment_dark_forest.glb", "environment/environment_distant_forest.glb",
                 "environment/environment_vines.glb", "environment/environment_floating_debris.glb", "environment/environment_fog_particles.glb",
                 "portal/portal_main.glb", "portal/portal_ring.glb", "portal/portal_cracks.glb", "portal/portal_particles.glb",
                 "effects/energy_ribbons.glb", "effects/red_lightning_effect.glb", "props/abandoned_sign.glb", "props/broken_electric_pole.glb",
                 "props/old_lamp.glb", "props/mysterious_crystals.glb", "props/forest_roots.glb", "props/dead_branches.glb"]
        draws = []
        for f in files:
            p = pl[f]
            ry = p.get("rotationY", 0.0)
            T = world_T(p["position"], ry)
            its = collect(os.path.join(M, f), T)
            if f == "effects/red_lightning_effect.glb":
                its = [i for i in its if i["name"] in ("lightning_bolt_2",)]       # one bolt flashing
            if f == "props/dead_branches.glb":
                its = [i for i in its if i["name"] in ("dead_branch_1", "dead_branch_4")]
            if f == "props/mysterious_crystals.glb":
                its = [i for i in its if i["name"] in ("crystal_cluster_1",)]
            if f == "props/forest_roots.glb":
                its = [i for i in its if i["name"] in ("root_bundle_2",)]
            draws += its
        # floating rocks placed separately (3 of the 7)
        rocks = collect(os.path.join(M, "props/floating_rocks.glb"), world_T([-9, 6.0, -22]))
        draws += [r for r in rocks if r["name"] in ("floating_rock_1", "floating_rock_3", "floating_rock_5")]
        print("collected", len(draws), "draw items in", round(time.time() - t0, 1), "s")
        SS = 1.5
        W, H = int(1600 * SS), int(900 * SS)
        cam = Camera([0, 1.75, 9.0], [0, 4.1, -18], 52, W, H)
        img = render(draws, cam)
        out = post(img, W, H, 1600, 900, os.path.join(OUT, "graphics/vignette.png"), os.path.join(OUT, "graphics/film_grain.png"))
        out.save(os.path.join(OUT, "preview_environment.png"), optimize=True)
        print("saved preview_environment.png", round(time.time() - t0, 1), "s")
    else:
        # prop line-up for QA
        specs = [("props/abandoned_sign.glb", [-6.2, 0, 0], None), ("props/broken_electric_pole.glb", [-3.6, 0, 0], None),
                 ("props/old_lamp.glb", [-1.2, 0, 0], None), ("props/mysterious_crystals.glb", [1.8, 0, 0], None),
                 ("props/forest_roots.glb", [5.5, 0, 0], None), ("trees/environment_dead_trees.glb", [0, 0, -6], None)]
        draws = []
        for f, t, _ in specs:
            draws += collect(os.path.join(M, f), world_T(t))
        draws += [r for r in collect(os.path.join(M, "props/floating_rocks.glb"), world_T([0, 5.5, -3]))]
        draws += collect(os.path.join(M, "props/dead_branches.glb"), world_T([0, 0, 1.5]))
        draws += collect(os.path.join(M, "environment/environment_ground.glb"), world_T([0, 0, -30]))
        SS = 1.5
        W, H = int(1600 * SS), int(900 * SS)
        cam = Camera([0, 2.6, 12], [0, 2.4, -1], 48, W, H)
        PL_POS = np.array([0, 4.0, 8.0])   # module-level: key light for the prop line-up
        img = render(draws, cam)
        out = post(img, W, H, 1600, 900, os.path.join(OUT, "graphics/vignette.png"), os.path.join(OUT, "graphics/film_grain.png"), exposure=1.5)
        out.save("/tmp/preview_props.png")
        print("saved /tmp/preview_props.png")
