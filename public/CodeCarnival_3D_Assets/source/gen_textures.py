"""
gen_textures.py - procedural textures, particle sprites, overlays and UI graphics.
Everything here is synthesised from noise / geometry; no third-party images are used.
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

OUT = sys.argv[1] if len(sys.argv) > 1 else "/home/claude/CodeCarnival_3D_Assets"
TEX = os.path.join(OUT, "textures")
GFX = os.path.join(OUT, "graphics")
for d in ["pbr", "particles", "portal", "overlays"]:
    os.makedirs(os.path.join(TEX, d), exist_ok=True)
os.makedirs(GFX, exist_ok=True)

N = 1024
FONT_BLACK = "/usr/share/fonts/opentype/inter/Inter-Black.otf"
FONT_SEMI = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
FONT_BOLD = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"


# ---------------------------------------------------------------- helpers
def save(arr, path, mode=None):
    a = np.clip(np.asarray(arr), 0, 1)
    a = (a * 255 + 0.5).astype(np.uint8)
    if a.ndim == 2:
        im = Image.fromarray(a, "L")
    elif a.shape[2] == 3:
        im = Image.fromarray(a, "RGB")
    else:
        im = Image.fromarray(a, "RGBA")
    im.save(path, optimize=True)
    return path


def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def norm01(x, lo=1, hi=99):
    l, h = np.percentile(x, lo), np.percentile(x, hi)
    return np.clip((x - l) / (h - l + 1e-9), 0, 1)


def tnoise(n, beta=2.0, seed=0, aniso=(1.0, 1.0)):
    """Tileable 1/f^beta noise (FFT), normalised 0..1. aniso=(ax,ay): >1 on an axis suppresses variation along the other."""
    rng = np.random.default_rng(seed)
    F = np.fft.fft2(rng.standard_normal((n, n)))
    fx = np.fft.fftfreq(n)[None, :] * n
    fy = np.fft.fftfreq(n)[:, None] * n
    f = np.sqrt((fx * aniso[0]) ** 2 + (fy * aniso[1]) ** 2)
    f[0, 0] = 1
    F *= f ** (-beta / 2)
    F[0, 0] = 0
    return norm01(np.fft.ifft2(F).real)


def voronoi(n, cells, seed):
    rng = np.random.default_rng(seed)
    pts = rng.random((cells, cells, 2))
    yy, xx = np.mgrid[0:n, 0:n] / n * cells
    cx, cy = np.floor(xx).astype(int), np.floor(yy).astype(int)
    f1 = np.full((n, n), 9.0)
    f2 = np.full((n, n), 9.0)
    cid = np.zeros((n, n))
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            gx, gy = (cx + dx) % cells, (cy + dy) % cells
            px = cx + dx + pts[gy, gx, 0]
            py = cy + dy + pts[gy, gx, 1]
            d = np.hypot(xx - px, yy - py)
            m = d < f1
            f2 = np.where(m, f1, np.minimum(f2, d))
            cid = np.where(m, gy * cells + gx, cid)
            f1 = np.where(m, d, f1)
    return f1, f2, cid


def hash_cell(cid, seed=0):
    x = np.sin(cid * 12.9898 + seed * 78.233) * 43758.5453
    return x - np.floor(x)


def normal_from_height(h, strength=4.0):
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5
    nx, ny, nz = -dx * strength, dy * strength, np.ones_like(h)
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    return np.stack([nx / l * 0.5 + 0.5, ny / l * 0.5 + 0.5, nz / l * 0.5 + 0.5], -1)


def ramp(v, stops):
    xs = [s[0] for s in stops]
    out = np.zeros(v.shape + (3,))
    for c in range(3):
        out[..., c] = np.interp(v, xs, [s[1][c] for s in stops])
    return out


def seamless_error(a):
    """Mean abs difference across the wrap seam vs. typical neighbour difference (should be ~1)."""
    a = a.astype(np.float64)
    seam = np.abs(a[:, 0] - a[:, -1]).mean() + np.abs(a[0] - a[-1]).mean()
    inner = np.abs(a[:, 1:] - a[:, :-1]).mean() + np.abs(a[1:] - a[:-1]).mean()
    return seam / (inner + 1e-9)


report = {}

# ---------------------------------------------------------------- BARK
streak = tnoise(N, 3.0, 11, aniso=(1.0, 7.0))      # long vertical fissures
mid = tnoise(N, 2.4, 12, aniso=(1.0, 3.0))
fine = tnoise(N, 1.6, 13)
ridge = 1 - np.abs(2 * streak - 1)
bark_h = 0.55 * ridge ** 1.5 + 0.25 * mid + 0.12 * fine + 0.08 * tnoise(N, 2.0, 14, aniso=(1, 14))
bark_h = norm01(bark_h, 0.5, 99.5)
crev = 1 - smooth(0.0, 0.5, bark_h)
base = ramp(bark_h, [(0.0, (0.030, 0.022, 0.022)), (0.35, (0.085, 0.066, 0.058)),
                     (0.7, (0.17, 0.14, 0.12)), (1.0, (0.30, 0.26, 0.23))])
base += crev[..., None] * np.array([0.10, 0.004, 0.006]) * (0.4 + 0.6 * tnoise(N, 2.5, 15))[..., None]  # faint crimson in crevices
base *= (0.85 + 0.3 * fine)[..., None]
save(base, f"{TEX}/pbr/bark_basecolor.png")
save(normal_from_height(bark_h, 7.0), f"{TEX}/pbr/bark_normal.png")
save(np.clip(0.78 + 0.22 * (1 - crev) * 0.6 + 0.12 * (fine - 0.5), 0, 1), f"{TEX}/pbr/bark_roughness.png")
report["bark_seam_ratio"] = seamless_error(base[..., 0])

# ---------------------------------------------------------------- GROUND
f1, f2, cid = voronoi(N, 7, 21)
edge = f2 - f1
crack = 1 - smooth(0.0, 0.11, edge)
plate = hash_cell(cid, 3)
soil = tnoise(N, 2.6, 22)
grit = tnoise(N, 1.2, 23)
g_h = 0.45 * soil + 0.2 * grit + 0.25 * smooth(0.0, 0.25, edge) + 0.1 * plate - 0.35 * crack
g_h = norm01(g_h, 0.5, 99.5)
g_base = ramp(norm01(0.6 * soil + 0.3 * grit + 0.25 * plate), [(0.0, (0.035, 0.03, 0.032)),
                (0.5, (0.085, 0.075, 0.075)), (1.0, (0.19, 0.17, 0.165))])
g_base *= (1 - 0.8 * crack)[..., None]
g_base += (crack ** 2)[..., None] * np.array([0.12, 0.006, 0.004])             # faint red seep in cracks
ash = smooth(0.62, 0.9, tnoise(N, 3.0, 24))
g_base = g_base * (1 - 0.35 * ash[..., None]) + 0.35 * ash[..., None] * np.array([0.22, 0.21, 0.21])
save(g_base, f"{TEX}/pbr/ground_basecolor.png")
save(normal_from_height(g_h, 5.0), f"{TEX}/pbr/ground_normal.png")
save(np.clip(0.88 + 0.1 * (grit - 0.5) - 0.15 * crack, 0, 1), f"{TEX}/pbr/ground_roughness.png")
report["ground_seam_ratio"] = seamless_error(g_base[..., 1])

# ---------------------------------------------------------------- VINES
vs = tnoise(N, 2.6, 31, aniso=(1.0, 5.0))
vf = tnoise(N, 1.8, 32)
vein = 1 - np.abs(2 * tnoise(N, 3.4, 33, aniso=(1.0, 2.0)) - 1)
vein_m = smooth(0.955, 0.995, vein)
v_base = ramp(norm01(0.7 * vs + 0.3 * vf), [(0.0, (0.020, 0.012, 0.018)), (0.5, (0.07, 0.034, 0.045)),
                                            (1.0, (0.16, 0.09, 0.10))])
v_base += vein_m[..., None] * np.array([0.75, 0.05, 0.03]) * (0.5 + 0.5 * vf)[..., None]
save(v_base, f"{TEX}/pbr/vines_basecolor.png")

# ---------------------------------------------------------------- CRACKED GROUND (decal / emissive, radial window)
yy, xx = (np.mgrid[0:N, 0:N] + 0.5) / N * 2 - 1
rr = np.hypot(xx, yy)
th = np.arctan2(yy, xx)
warp = tnoise(N, 2.6, 41)
c1, c2, _ = voronoi(N, 6, 42)
vor_crack = 1 - smooth(0.0, 0.075, (c2 - c1) + 0.06 * (warp - 0.5))
swarp = tnoise(N, 4.2, 43)
spokes = 1 - smooth(0.0, 0.13, np.abs(np.sin(th * 5.5 + 3.2 * (swarp - 0.5) + 2.0 * rr)))
spokes *= (1 - smooth(0.25, 0.95, rr))
crack_m = np.clip(np.maximum(vor_crack * (1 - smooth(0.12, 0.92, rr)), spokes), 0, 1)
glow = np.clip(crack_m + 0.55 * np.clip(
    np.array(Image.fromarray((crack_m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(7))) / 255.0 * 1.8, 0, 1), 0, 1)
window = 1 - smooth(0.80, 1.0, rr)
glow *= window
cg = ramp(np.clip(glow * 1.15, 0, 1), [(0.0, (0, 0, 0)), (0.25, (0.30, 0.01, 0.01)), (0.6, (1.0, 0.13, 0.04)),
                                      (1.0, (1.0, 0.72, 0.42))])
save(np.dstack([cg, np.clip(glow * 1.6, 0, 1)]), f"{TEX}/pbr/cracked_ground.png")

# ---------------------------------------------------------------- PORTAL EMISSION
n1 = tnoise(N, 2.6, 51)
n2 = tnoise(N, 1.8, 52)
arms = 0.5 + 0.5 * np.sin(5 * th + 9.0 * np.log(rr + 0.06) + 6.0 * (n1 - 0.5))
arms2 = 0.5 + 0.5 * np.sin(3 * th - 5.5 * np.log(rr + 0.06) + 5.0 * (n2 - 0.5))
env = 1 - smooth(0.90, 1.0, rr)
inten = env * (0.12 + 0.62 * arms ** 2.2 + 0.38 * arms2 ** 3) * (0.65 + 0.7 * n2)
inten += env * 0.95 * np.exp(-(rr / 0.20) ** 2)                                  # hot core
inten += 0.9 * smooth(0.70, 0.90, rr) * (1 - smooth(0.90, 0.985, rr)) * (0.6 + 0.4 * n1)  # bright rim
inten = np.clip(inten, 0, 1.2)
pe = ramp(np.clip(inten / 1.2, 0, 1), [(0.0, (0, 0, 0)), (0.18, (0.28, 0.0, 0.02)), (0.45, (0.90, 0.07, 0.05)),
                                      (0.75, (1.0, 0.38, 0.14)), (1.0, (1.0, 0.88, 0.7))])
alpha = np.clip(inten * 1.3, 0, 1) * (rr < 1.0)
save(np.dstack([pe * (rr < 1.0)[..., None], alpha]), f"{TEX}/portal/portal_emission.png")

# ---------------------------------------------------------------- PORTAL NOISE / FOG NOISE / ENERGY DISTORTION
pn = norm01(0.7 * tnoise(N, 2.2, 61) + 0.3 * tnoise(N, 1.2, 62))
save(pn, f"{TEX}/portal/portal_noise.png")
report["portal_noise_seam_ratio"] = seamless_error(pn)

fg = tnoise(N, 3.4, 71)
fg = smooth(0.25, 0.85, fg)
save(np.dstack([fg, fg, fg, fg ** 1.15]), f"{TEX}/particles/fog_noise.png")
report["fog_noise_seam_ratio"] = seamless_error(fg)

ed_h = 0.65 * tnoise(N, 2.8, 81) + 0.35 * tnoise(N, 1.8, 82)
save(normal_from_height(ed_h, 22.0), f"{TEX}/portal/energy_distortion.png")


# ---------------------------------------------------------------- PARTICLE SPRITES
def sprite_grid(n):
    y, x = (np.mgrid[0:n, 0:n] + 0.5) / n * 2 - 1
    return x, y, np.hypot(x, y)


def rgba(color, a):
    c = np.asarray(color, dtype=np.float64)
    return np.dstack([np.ones_like(a)[..., None] * c, a[..., None]]).reshape(a.shape + (4,))


def sprite(a, color_core, color_edge, hot=None):
    h = np.clip(hot if hot is not None else a, 0, 1)
    col = np.asarray(color_edge)[None, None, :] * (1 - h[..., None]) + np.asarray(color_core)[None, None, :] * h[..., None]
    return np.dstack([col, np.clip(a, 0, 1)])


x, y, r = sprite_grid(256)
a = np.exp(-(r * 2.8) ** 2) * 0.85 + np.exp(-(r * 8) ** 2) * 0.6
save(sprite(a * (r < 1), (1, 0.85, 0.7), (1, 0.06, 0.04), hot=np.exp(-(r * 6) ** 2)), f"{TEX}/particles/particle_red.png")

ex = np.exp(-((x / 0.13) ** 2 + ((y + 0.1 * np.sign(y) * 0) / 0.42) ** 2))
tail = np.exp(-((x / (0.05 + 0.1 * np.clip(y + 1, 0, 2) / 2)) ** 2)) * smooth(-1, 0.1, y) * (1 - smooth(0.1, 0.9, y)) * 0.0
a = np.clip(ex * 1.1, 0, 1) * (r < 1)
save(sprite(a, (1, 0.9, 0.55), (1, 0.28, 0.04), hot=np.exp(-((x / 0.07) ** 2 + (y / 0.2) ** 2))), f"{TEX}/particles/particle_ember.png")

fl = tnoise(256, 2.2, 91)
shape = (np.abs(x) / 0.78) ** 2 + (np.abs(y) / 0.55) ** 2
flake = smooth(0.42, 0.62, fl) * (1 - smooth(0.7, 1.0, shape + 0.25 * (fl - 0.5)))
flake = np.array(Image.fromarray((flake * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))) / 255.0
tone = 0.30 + 0.35 * fl
save(np.dstack([tone, tone * 0.96, tone * 0.95, flake * 0.9]), f"{TEX}/particles/particle_ash.png")

a = np.exp(-((r - 0.42) / 0.09) ** 2) * 0.55 + np.exp(-(r / 0.16) ** 2) * 0.95 + np.exp(-(r * 2.4) ** 2) * 0.25
save(sprite(a * (r < 1), (1, 0.8, 0.7), (1, 0.32, 0.30), hot=np.exp(-(r / 0.2) ** 2)), f"{TEX}/particles/particle_spore.png")

a = np.exp(-(r * 2.3) ** 2) * 0.5
save(np.dstack([np.ones_like(a) * 0.78, np.ones_like(a) * 0.66, np.ones_like(a) * 0.64, a * (r < 1)]), f"{TEX}/particles/particle_dust.png")

x5, y5, r5 = sprite_grid(512)
cl = tnoise(512, 3.0, 92)
a = np.clip((np.exp(-(r5 * 1.9) ** 2) * 1.2) * (0.35 + 1.1 * smooth(0.2, 0.8, cl)), 0, 1) * (1 - smooth(0.85, 1.0, r5))
save(np.dstack([np.ones_like(a) * 0.62, np.ones_like(a) * 0.52, np.ones_like(a) * 0.58, a * 0.8]), f"{TEX}/particles/fog_puff.png")


# ---------------------------------------------------------------- LIGHTNING FLASH OVERLAYS (1280x720)
def bolt_points(rng, p0, p1, disp, depth):
    if depth == 0:
        return [p0, p1]
    mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy) + 1e-6
    off = rng.uniform(-disp, disp)
    m = (mx - dy / L * off, my + dx / L * off)
    return bolt_points(rng, p0, m, disp / 2, depth - 1)[:-1] + bolt_points(rng, m, p1, disp / 2, depth - 1)


def lightning_overlay(seed, W=1280, H=720):
    rng = np.random.default_rng(seed)
    S = 2
    layer = Image.new("L", (W * S, H * S), 0)
    d = ImageDraw.Draw(layer)
    x0 = rng.uniform(0.25, 0.75) * W * S
    main = bolt_points(rng, (x0, -10), (x0 + rng.uniform(-0.2, 0.2) * W * S, H * S * rng.uniform(0.7, 0.95)), 150 * S, 7)
    d.line(main, fill=255, width=5 * S, joint="curve")
    for _ in range(rng.integers(4, 7)):
        k = rng.integers(len(main) // 5, len(main) - 4)
        sx, sy = main[k]
        ex = sx + rng.uniform(-0.28, 0.28) * W * S
        ey = sy + rng.uniform(0.1, 0.35) * H * S
        br = bolt_points(rng, (sx, sy), (ex, ey), 70 * S, 5)
        d.line(br, fill=190, width=3 * S, joint="curve")
    core = layer.resize((W, H), Image.LANCZOS)
    c = np.asarray(core) / 255.0
    g1 = np.asarray(core.filter(ImageFilter.GaussianBlur(5))) / 255.0
    g2 = np.asarray(core.filter(ImageFilter.GaussianBlur(26))) / 255.0
    g3 = np.asarray(core.filter(ImageFilter.GaussianBlur(90))) / 255.0
    wash = np.clip(g3 * 3.2, 0, 0.55)
    intensity = np.clip(c * 1.0 + g1 * 1.5 + g2 * 1.4, 0, 1)
    rgb = np.dstack([np.clip(0.55 + intensity * 0.45 + 0.0, 0, 1) * 0 + 1.0,
                     np.clip(0.12 + intensity * 0.85, 0, 1), np.clip(0.12 + intensity * 0.80, 0, 1)])
    rgb[..., 1] = np.where(intensity > 0.02, rgb[..., 1], 0.1)
    alpha = np.clip(np.maximum(intensity, wash * 0.9), 0, 1)
    # red-tinted wash outside the core, near-white in the core
    hot = np.clip(c * 1.2 + g1 * 0.8, 0, 1)[..., None]
    rgb = np.array([1.0, 0.16, 0.14]) * (1 - hot) + np.array([1.0, 0.92, 0.9]) * hot
    save(np.dstack([rgb, alpha]), f"{TEX}/overlays/lightning_flash_0{seed}.png")


for s in (1, 2, 3):
    lightning_overlay(s)

# fog overlay (screen-space drifting fog), 1280x720
fo = tnoise(1024, 3.2, 95)[:720, :1024]
fo = np.array(Image.fromarray((fo * 255).astype(np.uint8)).resize((1280, 720), Image.BICUBIC)) / 255.0
fo = smooth(0.3, 0.8, fo)
yy2 = np.linspace(0, 1, 720)[:, None]
fo = fo * (0.35 + 0.65 * yy2)                       # denser toward the bottom of the screen
save(np.dstack([np.ones_like(fo) * 0.72, np.ones_like(fo) * 0.62, np.ones_like(fo) * 0.66, fo * 0.55]),
     f"{TEX}/overlays/fog_overlay.png")

# ---------------------------------------------------------------- UI / GRAPHICS
# red glow 512
x, y, r = sprite_grid(512)
a = np.clip(np.exp(-(r * 2.1) ** 2) * 1.0, 0, 1) * (1 - smooth(0.9, 1.0, r))
col = np.array([1.0, 0.10, 0.08])[None, None, :] * np.ones((512, 512, 1))
col = col * (1 - 0.5 * np.exp(-(r * 4) ** 2)[..., None]) + np.array([1, 0.6, 0.45]) * 0.5 * np.exp(-(r * 4) ** 2)[..., None]
save(np.dstack([col, a]), f"{GFX}/red_glow.png")

# cursor particle 128
x, y, r = sprite_grid(128)
a = np.exp(-(r * 3.4) ** 2) * 0.8 + np.exp(-(r * 11) ** 2) * 0.9
save(sprite(a * (r < 1), (1, 0.95, 0.85), (1, 0.12, 0.08), hot=np.exp(-(r * 8) ** 2)), f"{GFX}/cursor_particle.png")

# film grain 512 (tileable; white / black specks with varying alpha on a transparent background)
rng = np.random.default_rng(101)
g = rng.standard_normal((512, 512))
gs = np.array(Image.fromarray(((np.clip(g, -3, 3) / 6 + 0.5) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))) / 255.0
gs = (gs - 0.5) * 2.0
gs = gs / np.abs(gs).max()
fg_rgb = np.where(gs[..., None] > 0, 1.0, 0.0) * np.ones((512, 512, 3))
save(np.dstack([fg_rgb, np.clip(np.abs(gs) * 1.15, 0, 1) ** 1.1]), f"{GFX}/film_grain.png")

# vignette 1600x900 (transparent centre, black corners)
W, H = 1600, 900
yy3, xx3 = (np.mgrid[0:H, 0:W] + 0.5)
nx, ny = (xx3 / W * 2 - 1), (yy3 / H * 2 - 1)
rv = np.sqrt((nx * 0.92) ** 2 + (ny * 1.0) ** 2)
va = smooth(0.38, 1.25, rv) ** 1.15 * 0.92
save(np.dstack([np.zeros((H, W, 3)) + np.array([0.02, 0.0, 0.005]), va]), f"{GFX}/vignette.png")

# transition portal 2048 (opaque dark red-black with a transparent, glowing portal hole)
T = 2048
yy4, xx4 = (np.mgrid[0:T, 0:T] + 0.5) / T * 2 - 1
rT = np.hypot(xx4, yy4)
thT = np.arctan2(yy4, xx4)
tn = tnoise(1024, 2.4, 111)
tn2 = tnoise(1024, 1.6, 112)
sx = (((thT / (2 * np.pi) + 0.5) * 1024) + 900.0 * np.log(rT + 0.1) * 1.0).astype(int) % 1024
sy = (np.clip(rT, 0, 1.5) * 700).astype(int) % 1024
sw = tn[sy, sx]
sw2 = tn2[(sy * 2) % 1024, (sx * 2) % 1024]
veins = 1 - np.abs(2 * sw - 1)
veins = smooth(0.78, 0.98, veins) * (1 - smooth(0.25, 1.35, rT))
rim = np.exp(-((rT - 0.135) / 0.035) ** 2)
halo = np.exp(-((rT - 0.135) / 0.13) ** 2) * 0.55
hole = smooth(0.105, 0.150, rT)                                    # 0 = transparent centre
base = np.array([0.018, 0.0, 0.006])
col = base[None, None, :] + (veins * (0.6 + 0.6 * sw2))[..., None] * np.array([0.85, 0.07, 0.04])
col += (rim + 0.4 * halo)[..., None] * np.array([1.0, 0.45, 0.25])
col = np.clip(col, 0, 1)
alpha = np.clip(np.maximum(hole, np.clip(rim * 1.1 + halo * 0.5, 0, 1) * smooth(0.04, 0.11, rT)), 0, 1)
save(np.dstack([col, alpha]), f"{GFX}/transition_portal.png")


# ---------------------------------------------------------------- LOGO & TITLE (original artwork)
def tracked_text(draw, xy, text, font, fill, tracking=0, anchor_center=True):
    widths = [font.getlength(ch) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x0 = xy[0] - total / 2 if anchor_center else xy[0]
    for ch, w in zip(text, widths):
        draw.text((x0, xy[1]), ch, font=font, fill=fill, anchor="ls")
        x0 += w + tracking
    return total


def text_mask(size, xy, text, font, tracking, stroke=0):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    widths = [font.getlength(ch) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x0 = xy[0] - total / 2
    for ch, w in zip(text, widths):
        d.text((x0, xy[1]), ch, font=font, fill=255, anchor="ls", stroke_width=stroke, stroke_fill=255)
        x0 += w + tracking
    return m


def vgrad(size, top, bottom, y0, y1):
    W, H = size
    t = np.clip((np.arange(H) - y0) / max(y1 - y0, 1), 0, 1)[:, None, None]
    c = np.array(top)[None, None, :] * (1 - t) + np.array(bottom)[None, None, :] * t
    return Image.fromarray((np.broadcast_to(c, (H, W, 3)) * 255).astype(np.uint8), "RGB")


def add_glow(base_rgba, emit_rgba, radii=(6, 18, 44), gains=(0.9, 0.7, 0.55)):
    out = base_rgba.copy()
    glow_total = None
    for r, g in zip(radii, gains):
        b = emit_rgba.filter(ImageFilter.GaussianBlur(r))
        arr = np.asarray(b).astype(np.float64)
        arr[..., 3] *= g
        glow_total = arr if glow_total is None else glow_total + arr * np.array([1, 1, 1, 1.0])
    glow_total = np.clip(glow_total, 0, 255).astype(np.uint8)
    glow_img = Image.fromarray(glow_total, "RGBA")
    return Image.alpha_composite(glow_img, base_rgba)


# ---- logo
LW, LH = 2048, 1024
cx, cy = LW // 2, 330
emit = Image.new("RGBA", (LW, LH), (0, 0, 0, 0))
solid = Image.new("RGBA", (LW, LH), (0, 0, 0, 0))
de, ds = ImageDraw.Draw(emit), ImageDraw.Draw(solid)
RED, DEEP, HOT = (255, 38, 52), (150, 0, 24), (255, 225, 210)

# portal ring (broken arcs)
R = 205
for start, end in [(-70, 40), (52, 130), (142, 250)]:
    for dr in range(-9, 10):
        ds.arc([cx - R + dr, cy - R + dr, cx + R - dr, cy + R - dr], start, end, fill=RED + (255,), width=3)
        de.arc([cx - R + dr, cy - R + dr, cx + R - dr, cy + R - dr], start, end, fill=RED + (255,), width=3)
for dr in range(-3, 4):
    ds.arc([cx - R + 34 + dr, cy - R + 34 + dr, cx + R - 34 - dr, cy + R - 34 - dr], 200, 330, fill=(255, 120, 110, 220), width=2)

# circus tent (stripes + scalloped hem + flag)
tent_top = (cx, cy - 125)
left, right, base_y, hem_y = cx - 130, cx + 130, cy + 70, cy + 95
roof_poly = [tent_top, (right, base_y), (left, base_y)]
stripe = Image.new("RGBA", (LW, LH), (0, 0, 0, 0))
sd = ImageDraw.Draw(stripe)
n_st = 8
for i in range(n_st):
    xa = left + (right - left) * i / n_st
    xb = left + (right - left) * (i + 1) / n_st
    sd.polygon([tent_top, (xa, base_y), (xb, base_y)], fill=(RED if i % 2 == 0 else DEEP) + (255,))
mask = Image.new("L", (LW, LH), 0)
ImageDraw.Draw(mask).polygon(roof_poly, fill=255)
solid = Image.alpha_composite(solid, Image.composite(stripe, Image.new("RGBA", (LW, LH), (0, 0, 0, 0)), mask))
ds = ImageDraw.Draw(solid)
for i in range(n_st):  # scalloped hem
    xa = left + (right - left) * i / n_st
    xb = left + (right - left) * (i + 1) / n_st
    ds.pieslice([xa, base_y - 24, xb, base_y + 24], 0, 180, fill=(RED if i % 2 == 0 else DEEP) + (255,))
ds.rectangle([left, base_y + 8, right, hem_y], fill=(20, 0, 6, 255))
ds.polygon([(cx - 36, hem_y), (cx + 36, hem_y), (cx, base_y + 12)], fill=(255, 190, 150, 255))  # doorway light
ds.line([tent_top, (cx, tent_top[1] - 58)], fill=HOT + (255,), width=6)
ds.polygon([(cx, tent_top[1] - 58), (cx + 52, tent_top[1] - 40), (cx, tent_top[1] - 22)], fill=RED + (255,))
# code brackets flanking the ring:  </>
bf = ImageFont.truetype(FONT_BLACK, 150)
ds.text((cx - 330, cy + 52), "<", font=bf, fill=HOT + (255,), anchor="ls")
ds.text((cx + 330, cy + 52), ">", font=bf, fill=HOT + (255,), anchor="rs")
de.text((cx - 330, cy + 52), "<", font=bf, fill=RED + (255,), anchor="ls")
de.text((cx + 330, cy + 52), ">", font=bf, fill=RED + (255,), anchor="rs")
# small lightning zig-zags escaping the ring
rng = np.random.default_rng(7)
for ang in (-35, 20, 160, 215):
    a0 = math.radians(ang)
    pts = []
    for k in range(6):
        rr_ = R + 8 + k * 14
        aa = a0 + rng.uniform(-0.07, 0.07)
        pts.append((cx + rr_ * math.cos(aa), cy + rr_ * math.sin(aa)))
    ds.line(pts, fill=HOT + (255,), width=4, joint="curve")
    de.line(pts, fill=RED + (255,), width=6, joint="curve")

# wordmark
f_big = ImageFont.truetype(FONT_BLACK, 168)
f_sub = ImageFont.truetype(FONT_SEMI, 52)
ty = 700
m_fill = text_mask((LW, LH), (cx, ty), "CODE CARNIVAL", f_big, 14)
m_out = text_mask((LW, LH), (cx, ty), "CODE CARNIVAL", f_big, 14, stroke=5)
grad = vgrad((LW, LH), (1.0, 0.42, 0.36), (0.72, 0.0, 0.10), ty - 125, ty)
word = Image.new("RGBA", (LW, LH), (0, 0, 0, 0))
word.paste(Image.new("RGBA", (LW, LH), (255, 235, 225, 255)), (0, 0), m_out)   # thin hot outline
word.paste(grad.convert("RGBA"), (0, 0), m_fill)
solid = Image.alpha_composite(solid, word)
emit_w = Image.new("RGBA", (LW, LH), (0, 0, 0, 0))
emit_w.paste(Image.new("RGBA", (LW, LH), RED + (255,)), (0, 0), m_out)
emit = Image.alpha_composite(emit, emit_w)
ds = ImageDraw.Draw(solid)
sub_y = 800
tracked_text(ds, (cx, sub_y), "AI STUDENT CHAPTER", f_sub, (255, 205, 200, 255), tracking=22)
for sgn in (-1, 1):
    ds.rectangle([cx + sgn * 520 - (0 if sgn > 0 else 260), sub_y - 24, cx + sgn * 520 + (260 if sgn > 0 else 0), sub_y - 20], fill=RED + (255,))
logo = add_glow(solid, emit)
logo.save(f"{GFX}/code_carnival_logo.png", optimize=True)

# ---- title texture (2048x512): neon outline wordmark, distinct from the logo
TW, TH = 2048, 512
f_t = ImageFont.truetype(FONT_BLACK, 250)
_w = sum(f_t.getlength(ch) for ch in "CODE CARNIVAL") + 6 * 12
f_t = ImageFont.truetype(FONT_BLACK, int(250 * (TW * 0.94) / _w))   # fit to 94% of the canvas width
tc = (TW // 2, 330)
m_f = text_mask((TW, TH), tc, "CODE CARNIVAL", f_t, 6)
m_o = text_mask((TW, TH), tc, "CODE CARNIVAL", f_t, 6, stroke=9)
outline = ImageChops.subtract(m_o, m_f)
emit_t = Image.new("RGBA", (TW, TH), (0, 0, 0, 0))
emit_t.paste(Image.new("RGBA", (TW, TH), (255, 30, 45, 255)), (0, 0), outline)
solid_t = Image.new("RGBA", (TW, TH), (0, 0, 0, 0))
inner = Image.new("RGBA", (TW, TH), (120, 0, 16, 120))
solid_t.paste(inner, (0, 0), m_f)                                             # faint red body
solid_t.paste(Image.new("RGBA", (TW, TH), (255, 205, 195, 255)), (0, 0), outline)  # hot white-pink neon tube
title = add_glow(solid_t, emit_t, radii=(5, 16, 40), gains=(1.0, 0.8, 0.6))
title.save(f"{GFX}/title_texture.png", optimize=True)

# ---------------------------------------------------------------- WebP variants for web delivery
import glob
for p in glob.glob(f"{TEX}/**/*.png", recursive=True):
    im = Image.open(p)
    lossless = "normal" in os.path.basename(p) or im.size[0] <= 256
    im.save(p[:-4] + ".webp", "WEBP", quality=88, lossless=lossless, method=6)

print("seam ratios (≈1 means seamless):", {k: round(v, 2) for k, v in report.items()})
