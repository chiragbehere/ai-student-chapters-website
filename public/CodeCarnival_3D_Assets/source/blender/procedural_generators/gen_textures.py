"""Generate PBR, portal, fog and particle textures (all original, fully procedural)."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from scipy.spatial import cKDTree
from cc_common import *


def save(arr, *path, webp=False, mode=None):
    img = Image.fromarray(to_u8(arr) if arr.dtype != np.uint8 else arr, mode)
    p = out(*path)
    img.save(p, optimize=True)
    if webp:
        img.save(p.rsplit(".", 1)[0] + ".webp", quality=88, method=6)
    print("wrote", os.path.relpath(p, ROOT), img.size, img.mode)


# ------------------------------------------------------------------ BARK
def bark():
    N = 1024
    rng = np.random.default_rng(11)
    fis = ridged(fbm(N, N, 3, 40, rng, 5, 0.55))          # long vertical fissures
    fis2 = ridged(fbm(N, N, 6, 90, rng, 4, 0.5))
    blot = fbm(N, N, 5, 5, rng, 5, 0.55)
    fine = fbm(N, N, 64, 64, rng, 3, 0.5)
    h = 0.50 * fis ** 1.6 + 0.2 * fis2 + 0.2 * blot + 0.1 * fine
    h = (h - h.min()) / (h.max() - h.min())
    ao = smoothstep(0.15, 0.7, h)
    col = ramp(h, [(0, (0.025, 0.02, 0.022)), (0.45, (0.10, 0.08, 0.075)),
                   (0.8, (0.22, 0.18, 0.16)), (1, (0.30, 0.25, 0.22))])
    tint = fbm(N, N, 4, 4, rng, 3)[..., None]
    col *= 0.85 + 0.3 * tint
    col[..., 0] *= 1.0 + 0.10 * (1 - ao)           # faint red cast deep in the fissures
    col *= (0.55 + 0.45 * ao)[..., None]
    save(col, "textures", "pbr", "bark_basecolor.png", webp=True)
    save(normal_from_height(h, 5.0), "textures", "pbr", "bark_normal.png", webp=False)
    rough = np.clip(0.93 - 0.18 * h + 0.06 * fine, 0, 1)
    save(rough, "textures", "pbr", "bark_roughness.png", mode="L")
    return h


# ------------------------------------------------------------------ GROUND
def voronoi_edges(N, ncell, rng, warp=0.0):
    """Tileable Voronoi: returns (F2-F1, F1) in unit-cell distances."""
    pts = rng.random((ncell, 2))
    ext = np.concatenate([pts + [dx, dy] for dx in (-1, 0, 1) for dy in (-1, 0, 1)])
    tree = cKDTree(ext)
    ys, xs = np.mgrid[0:N, 0:N] / N
    if warp:
        wr = np.random.default_rng(5)
        xs = xs + warp * (fbm(N, N, 8, 8, wr, 3) - 0.5)
        ys = ys + warp * (fbm(N, N, 8, 8, wr, 3) - 0.5)
    d, _ = tree.query(np.stack([xs.ravel(), ys.ravel()], 1), k=2)
    f1 = d[:, 0].reshape(N, N)
    f2 = d[:, 1].reshape(N, N)
    return f2 - f1, f1


def ground():
    N = 1024
    rng = np.random.default_rng(23)
    base = fbm(N, N, 6, 6, rng, 6, 0.55)
    veins = ridged(fbm(N, N, 8, 8, rng, 4, 0.5)) ** 3          # root-like ridges
    pebbles = ndimage.gaussian_filter(rng.random((N, N)), 1.6, mode="wrap")
    pebbles = (pebbles - pebbles.min()) / (pebbles.max() - pebbles.min())
    pebbles = smoothstep(0.62, 0.9, pebbles)
    leaves = fbm(N, N, 24, 24, rng, 3)
    h = 0.5 * base + 0.25 * veins + 0.15 * pebbles + 0.1 * leaves
    h = (h - h.min()) / (h.max() - h.min())
    col = ramp(h, [(0, (0.018, 0.016, 0.018)), (0.4, (0.055, 0.045, 0.045)),
                   (0.7, (0.12, 0.095, 0.085)), (1, (0.2, 0.17, 0.16))])
    ash = fbm(N, N, 12, 12, rng, 4)
    col = col * (0.8 + 0.4 * ash[..., None])
    col += (veins[..., None] * np.array([0.05, 0.004, 0.004]))     # faint red in the root veins
    col *= (0.6 + 0.4 * smoothstep(0.1, 0.6, h))[..., None]
    save(col, "textures", "pbr", "ground_basecolor.png", webp=True)
    save(normal_from_height(h, 4.0), "textures", "pbr", "ground_normal.png")
    rough = np.clip(0.96 - 0.25 * pebbles - 0.1 * h, 0, 1)
    save(rough, "textures", "pbr", "ground_roughness.png", mode="L")


def cracked_ground():
    N = 1024
    rng = np.random.default_rng(31)
    edge, f1 = voronoi_edges(N, 38, rng, warp=0.05)
    detail = fbm(N, N, 24, 24, rng, 4)
    crack_w = 0.010 + 0.006 * detail
    core = 1.0 - smoothstep(0.0, crack_w, edge)               # 1 inside the crack
    halo = 1.0 - smoothstep(0.0, crack_w * 5.0, edge)
    # break the network into islands so it reads as damaged rather than a regular mesh
    gate = smoothstep(0.38, 0.62, fbm(N, N, 4, 4, rng, 3))
    core *= gate
    halo *= gate
    h = 0.55 * smoothstep(0.0, 0.08, edge) + 0.45 * fbm(N, N, 20, 20, rng, 4)
    base = ramp(h, [(0, (0.015, 0.012, 0.012)), (0.5, (0.06, 0.05, 0.05)), (1, (0.15, 0.12, 0.11))])
    glow = ramp(core, [(0, (0.55, 0.03, 0.01)), (0.5, (1.0, 0.2, 0.05)), (1, (1.0, 0.75, 0.4))])
    col = base + halo[..., None] * np.array([0.30, 0.02, 0.01]) + core[..., None] * glow
    save(col, "textures", "pbr", "cracked_ground.png", webp=True)


# ------------------------------------------------------------------ VINES (alpha atlas)
def vines():
    S = 2048  # draw 2x, downsample for clean edges
    img = Image.new("RGBA", (S, S), (14, 22, 14, 0))
    d = ImageDraw.Draw(img)
    rng = np.random.default_rng(41)
    for col in range(2):
        x0 = col * (S // 2) + S // 4
        pts = []
        for i in range(0, 129):
            t = i / 128
            x = x0 + 70 * np.sin(t * 9 + col * 2) + 30 * np.sin(t * 23 + col)
            pts.append((x, t * S))
        for w, c in ((22, (28, 24, 20, 255)), (12, (44, 38, 30, 255))):
            d.line(pts, fill=c, width=w, joint="curve")
        for i in range(6, 124, 2):
            for side in (-1, 1):
                if rng.random() < 0.35:
                    continue
                px, py = pts[i]
                ang = np.radians(rng.uniform(25, 70)) * side + rng.normal(0, 0.1)
                ln = rng.uniform(70, 150) * (1.15 - 0.35 * abs(np.sin(i / 20)))
                dx, dy = np.sin(ang), np.cos(ang) * 0.6 + 0.4
                tipx, tipy = px + dx * ln, py + dy * ln
                nx, ny = -dy, dx
                wd = ln * 0.28
                midx, midy = (px + tipx) / 2, (py + tipy) / 2
                leaf = [(px, py), (midx + nx * wd, midy + ny * wd), (tipx, tipy),
                        (midx - nx * wd, midy - ny * wd)]
                shade = int(rng.uniform(0.7, 1.15) * 30)
                d.polygon(leaf, fill=(shade, int(shade * 1.55), shade - 6, 255))
                d.line([(px, py), (tipx, tipy)], fill=(shade + 18, shade + 30, shade, 255), width=3)
                if rng.random() < 0.12:  # sickly red-lit leaf
                    d.polygon(leaf, fill=(90, 14, 12, 255))
    img = img.resize((1024, 1024), Image.LANCZOS)
    p = out("textures", "pbr", "vines_basecolor.png")
    img.save(p, optimize=True)
    img.save(p.replace(".png", ".webp"), quality=90, method=6, lossless=False)
    print("wrote textures/pbr/vines_basecolor.png (1024 RGBA)")


# ------------------------------------------------------------------ PORTAL / NOISE
def portal_emission():
    N = 2048
    rng = np.random.default_rng(53)
    ys, xs = np.mgrid[0:N, 0:N]
    x = (xs + 0.5) / N * 2 - 1
    y = -((ys + 0.5) / N * 2 - 1)
    r = np.sqrt(x * x + y * y)
    th = np.arctan2(y, x)
    swirl = th + 2.4 / (r + 0.35) + 0.7 * r
    # warp via a tileable noise lookup in swirl space
    n1 = fbm(N, N, 6, 6, rng, 5, 0.55)
    u = (np.cos(swirl) * r * 0.5 + 0.5)
    v = (np.sin(swirl) * r * 0.5 + 0.5)
    wn = ndimage.map_coordinates(n1, [v * (N - 1), u * (N - 1)], order=1, mode="wrap")
    arms = 0.5 + 0.5 * np.sin(swirl * 5 + wn * 9 + r * 6)
    fil = ridged(wn) ** 4
    inten = (0.55 * arms ** 3 + 0.9 * fil) * smoothstep(0.05, 0.55, r)
    rim = np.exp(-((r - 0.93) / 0.045) ** 2) * (0.7 + 0.3 * wn)
    inner_rim = np.exp(-((r - 0.8) / 0.09) ** 2) * 0.35 * arms
    core = np.exp(-(r / 0.22) ** 2) * 0.25
    I = (inten * (0.25 + 0.9 * r ** 1.6) + rim * 1.5 + inner_rim + core)
    I *= 1.0 - smoothstep(0.985, 1.03, r)                  # nothing outside the rift
    I = np.clip(I, 0, 1.6)
    col = ramp(np.clip(I / 1.6, 0, 1) ** 0.85,
               [(0, (0, 0, 0)), (0.18, (0.28, 0.0, 0.02)), (0.45, (0.85, 0.05, 0.04)),
                (0.72, (1.0, 0.3, 0.07)), (1.0, (1.0, 0.85, 0.6))])
    save(col, "textures", "portal", "portal_emission.png", webp=True)


def gray_noise(name, *path, seeds=(1,), base=(4, 4), octs=6, pers=0.55, contrast=1.0, webp=False):
    rng = np.random.default_rng(seeds[0])
    n = fbm(1024, 1024, base[0], base[1], rng, octs, pers)
    n = np.clip((n - 0.5) * contrast + 0.5, 0, 1)
    save(n, *path, mode="L", webp=webp)
    return n


def noises():
    gray_noise("portal_noise", "textures", "portal", "portal_noise.png", seeds=(61,), base=(5, 5), octs=6, contrast=1.3)
    gray_noise("fog_noise", "textures", "particles", "fog_noise.png", seeds=(67,), base=(3, 3), octs=6, pers=0.6, contrast=1.15)
    rng = np.random.default_rng(71)
    # flow / distortion map: R,G = two decorrelated tileable fields, B = constant (centre = no offset)
    a = fbm(1024, 1024, 4, 4, rng, 5, 0.55)
    b = fbm(1024, 1024, 4, 4, rng, 5, 0.55)
    ed = np.stack([a, b, np.full_like(a, 0.5)], -1)
    save(ed, "textures", "portal", "energy_distortion.png")
    # concentric ripple normal map for the transition / refraction effect
    N = 1024
    ys, xs = np.mgrid[0:N, 0:N]
    x = (xs / N) * 2 - 1
    y = (ys / N) * 2 - 1
    r = np.sqrt(x * x + y * y)
    hgt = np.sin(r * 38) * np.exp(-r * 1.6) + 0.15 * (fbm(N, N, 6, 6, np.random.default_rng(73), 4) - 0.5)
    save(normal_from_height(hgt, 6.0), "textures", "portal", "portal_distortion.png")


# ------------------------------------------------------------------ PARTICLE SPRITES
def disc(N, fn):
    ys, xs = np.mgrid[0:N, 0:N]
    x = (xs + 0.5) / N * 2 - 1
    y = (ys + 0.5) / N * 2 - 1
    return fn(x, y, np.sqrt(x * x + y * y), np.arctan2(y, x))


def rgba(rgb, a):
    return np.dstack([rgb, a[..., None] if a.ndim == 2 else a])


def sprites():
    N = 256
    rng = np.random.default_rng(81)
    # red floating particle: hot core + wide soft halo
    a = disc(N, lambda x, y, r, t: np.clip(np.exp(-(r / 0.22) ** 2) * 1.0 + np.exp(-(r / 0.55) ** 2) * 0.45, 0, 1) * (1 - smoothstep(0.85, 1, r)))
    rgb = np.dstack([np.ones((N, N)), 0.18 + 0.6 * np.exp(-(disc(N, lambda x, y, r, t: r) / 0.18) ** 2), 0.1 + 0.4 * np.exp(-(disc(N, lambda x, y, r, t: r) / 0.1) ** 2)])
    save(rgba(rgb, a), "textures", "particles", "red_particle.png")

    # ash: irregular flake silhouette with grey shading
    def flake(x, y, r, t):
        k = np.random.default_rng(3)
        wob = 0.62 + 0.18 * np.sin(3 * t + 1) + 0.12 * np.sin(5 * t + 2) + 0.08 * np.sin(9 * t)
        return 1.0 - smoothstep(wob - 0.06, wob, r * (1.0 + 0.35 * np.abs(y)))
    f = disc(N, flake)
    sh = fbm(N, N, 6, 6, rng, 4)
    g = 0.18 + 0.32 * sh
    save(rgba(np.dstack([g * 1.0, g * 0.95, g * 0.92]), f), "textures", "particles", "ash_particle.png")

    # dust: very soft grey-blue puff
    a = disc(N, lambda x, y, r, t: np.exp(-(r / 0.5) ** 2) * (1 - smoothstep(0.8, 1, r)) * (0.6 + 0.4 * fbm(N, N, 4, 4, np.random.default_rng(9), 3)))
    save(rgba(np.dstack([np.full((N, N), 0.62), np.full((N, N), 0.6), np.full((N, N), 0.64)]), a * 0.8), "textures", "particles", "dust_particle.png")

    # ember: white-hot core -> orange -> red, slightly elongated spark
    def ember(x, y, r, t):
        rr = np.sqrt((x / 0.75) ** 2 + (y / 1.0) ** 2)
        return rr
    rr = disc(N, ember)
    a = np.clip(np.exp(-(rr / 0.16) ** 2) + 0.55 * np.exp(-(rr / 0.4) ** 2) + 0.2 * np.exp(-(rr / 0.8) ** 2), 0, 1) * (1 - smoothstep(0.9, 1, rr))
    col = ramp(np.exp(-(rr / 0.3) ** 2), [(0, (0.9, 0.12, 0.03)), (0.5, (1.0, 0.5, 0.1)), (1, (1.0, 0.95, 0.75))])
    save(rgba(col, a), "textures", "particles", "ember_particle.png")

    # spore: soft pale glow with a faint ring and tiny cross-flare
    def spore(x, y, r, t):
        g = np.exp(-(r / 0.2) ** 2) + 0.35 * np.exp(-(r / 0.5) ** 2) + 0.25 * np.exp(-((r - 0.55) / 0.06) ** 2)
        flare = 0.5 * (np.exp(-(np.abs(x) / 0.012)) + np.exp(-(np.abs(y) / 0.012))) * np.exp(-(r / 0.5) ** 2)
        return np.clip(g + flare, 0, 1) * (1 - smoothstep(0.9, 1, r))
    a = disc(N, spore)
    rgb = np.dstack([np.full((N, N), 1.0), 0.55 + 0.4 * a, 0.55 + 0.35 * a])
    save(rgba(rgb, a), "textures", "particles", "spore_particle.png")

    # 2x2 atlas of the four small sprites for single-draw-call Points/instancing
    names = ["red_particle", "ember_particle", "spore_particle", "ash_particle"]
    atlas = Image.new("RGBA", (N * 2, N * 2), (0, 0, 0, 0))
    for i, nm in enumerate(names):
        im = Image.open(out("textures", "particles", nm + ".png"))
        atlas.paste(im, ((i % 2) * N, (i // 2) * N))
    atlas.save(out("textures", "particles", "particle_atlas_2x2.png"), optimize=True)
    print("wrote particle_atlas_2x2.png (order: red, ember / spore, ash)")

    # fog sprites: big soft wisps with alpha
    for k in range(2):
        M = 512
        r2 = np.random.default_rng(90 + k)
        n = fbm(M, M, 3, 3, r2, 6, 0.6)
        d = disc(M, lambda x, y, r, t: 1 - smoothstep(0.25, 1.0, r))
        a = np.clip((n - 0.3) * 2.0, 0, 1) * d ** 1.5
        save(rgba(np.dstack([np.full((M, M), 0.7), np.full((M, M), 0.72), np.full((M, M), 0.78)]), a * 0.85),
             "textures", "particles", f"fog_sprite_0{k+1}.png")


# ------------------------------------------------------------------ LIGHTNING FLASH OVERLAYS
def lightning_overlays():
    W, H = 1280, 720
    for k in range(3):
        rng = np.random.default_rng(100 + k)
        layer = Image.new("L", (W, H), 0)
        d = ImageDraw.Draw(layer)

        def bolt(x, y, ang, length, width, depth):
            pts = [(x, y)]
            seg = 16
            step = length / seg
            for i in range(seg):
                ang += rng.normal(0, 0.28)
                x += np.sin(ang) * step
                y += np.cos(ang) * step
                pts.append((x, y))
                if depth > 0 and rng.random() < 0.18:
                    bolt(x, y, ang + rng.choice([-1, 1]) * rng.uniform(0.4, 0.9), length * 0.45, max(2, width - 2), depth - 1)
            d.line(pts, fill=255, width=width, joint="curve")

        bolt(rng.uniform(0.3, 0.7) * W, -20, rng.normal(0, 0.15), H * 1.05, 6, 2)
        core = np.asarray(layer, float) / 255
        glow = ndimage.gaussian_filter(core, 14) * 3.2 + ndimage.gaussian_filter(core, 40) * 5.5
        ys, xs = np.mgrid[0:H, 0:W]
        sky = np.exp(-(((xs - W * rng.uniform(.3, .7)) / (W * .6)) ** 2 + ((ys - H * 0.05) / (H * .8)) ** 2)) * 0.35
        a = np.clip(core * 1.0 + glow * 0.35 + sky, 0, 1)
        white = np.clip(core * 1.2 + glow * 0.2, 0, 1)
        rgb = np.dstack([np.clip(0.9 + 0.1 * white, 0, 1), 0.25 + 0.7 * white, 0.22 + 0.7 * white])
        save(rgba(rgb, a), "textures", "overlays", f"lightning_flash_0{k+1}.png")


if __name__ == "__main__":
    bark(); ground(); cracked_ground(); vines()
    portal_emission(); noises(); sprites(); lightning_overlays()
