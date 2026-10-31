"""UI + overlay graphics: logo, title, glow, grain, vignette, portal transition, cursor particle."""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
from scipy import ndimage
from cc_common import *

FONT_B = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
FONT_M = "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"


def tracked(draw, xy, text, font, fill, tracking, anchor_center=True):
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x, y = xy
    if anchor_center:
        x -= total / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + tracking
    return total


def blur(mask, r):
    return mask.filter(ImageFilter.GaussianBlur(r))


def glow_layer(mask, color, radii=(6, 18, 46), gains=(0.9, 0.7, 0.55)):
    """Return an RGBA layer of coloured bloom built from a greyscale mask."""
    acc = np.zeros(mask.size[::-1])
    for r, g in zip(radii, gains):
        acc += np.asarray(blur(mask, r), float) / 255 * g
    acc = np.clip(acc, 0, 1)
    rgba = np.zeros(mask.size[::-1] + (4,))
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = color
    rgba[..., 3] = acc
    return Image.fromarray(to_u8(rgba), "RGBA")


def gradient_fill(mask, top, bottom, y0, y1):
    W, H = mask.size
    ys = np.clip((np.arange(H) - y0) / max(1, (y1 - y0)), 0, 1)[:, None]
    col = np.array(top)[None, None, :] * (1 - ys[..., None]) + np.array(bottom)[None, None, :] * ys[..., None]
    col = np.broadcast_to(col, (H, W, 3))
    rgba = np.dstack([col, np.asarray(mask, float) / 255])
    return Image.fromarray(to_u8(rgba), "RGBA")


def title_layers(W, H, y_text, size, text="CODE CARNIVAL", tracking=18):
    font = ImageFont.truetype(FONT_B, size)
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)
    w = tracked(d, (W / 2, y_text), text, font, 255, tracking)
    return m, w, font


def compose_text(W, H, y_text, size, text="CODE CARNIVAL", tracking=18):
    mask, w, font = title_layers(W, H, y_text, size, text, tracking)
    bbox_y0, bbox_y1 = y_text + size * 0.18, y_text + size * 1.12
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.alpha_composite(glow_layer(mask, (1.0, 0.07, 0.06), (5, 16, 40), (0.9, 0.8, 0.7)))
    # dark under-stroke gives the type weight against bright backgrounds
    stroke = mask.filter(ImageFilter.MaxFilter(9))
    under = Image.new("RGBA", (W, H), (20, 0, 2, 0))
    under.putalpha(stroke)
    canvas.alpha_composite(under)
    # neon outline (ring around glyphs)
    outline = ImageChops.subtract(mask.filter(ImageFilter.MaxFilter(7)), mask)
    ol = Image.new("RGBA", (W, H), (255, 70, 60, 0))
    ol.putalpha(outline)
    canvas.alpha_composite(ol)
    # glyph body: hot top -> deep red bottom
    canvas.alpha_composite(gradient_fill(mask, (1.0, 0.92, 0.85), (0.85, 0.06, 0.07), int(bbox_y0), int(bbox_y1)))
    # thin inner highlight line through the glyph centre
    mid = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mid).rectangle([0, int(y_text + size * 0.62), W, int(y_text + size * 0.645)], fill=70)
    mid = ImageChops.multiply(mid, mask)
    hl = Image.new("RGBA", (W, H), (255, 220, 200, 0))
    hl.putalpha(mid)
    canvas.alpha_composite(hl)
    return canvas, w, bbox_y0, bbox_y1


def emblem(canvas, cx, cy, R):
    """Original emblem: broken ferris-wheel / portal ring with a code-bracket core and a fracture of lightning."""
    W, H = canvas.size
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)
    rng = np.random.default_rng(7)
    # outer ring in broken arcs (gaps hint at a dimensional tear)
    arcs = [(-20, 52), (62, 118), (130, 205), (218, 290), (302, 340)]
    for a0, a1 in arcs:
        d.arc([cx - R, cy - R, cx + R, cy + R], a0, a1, fill=255, width=26)
    d.ellipse([cx - R * 0.72, cy - R * 0.72, cx + R * 0.72, cy + R * 0.72], outline=255, width=8)
    # spokes
    for i in range(16):
        a = np.radians(i * 22.5 + 11)
        d.line([(cx + np.cos(a) * R * 0.74, cy + np.sin(a) * R * 0.74), (cx + np.cos(a) * R * 0.96, cy + np.sin(a) * R * 0.96)], fill=255, width=6)
    # gondola dots on the rim
    for i in range(12):
        a = np.radians(i * 30 + 8)
        px, py = cx + np.cos(a) * (R + 38), cy + np.sin(a) * (R + 38)
        d.ellipse([px - 11, py - 11, px + 11, py + 11], fill=255)
    # lightning crack down through the centre
    pts = [(cx + 12, cy - R * 1.12)]
    y = cy - R * 1.12
    while y < cy + R * 1.12:
        y += R * 0.2
        pts.append((cx + rng.normal(0, R * 0.12), y))
    d.line(pts, fill=255, width=9, joint="curve")
    code = Image.new("L", (W, H), 0)
    cd = ImageDraw.Draw(code)
    f = ImageFont.truetype(FONT_B, int(R * 0.62))
    cd.text((cx, cy - R * 0.02), "</>", font=f, fill=255, anchor="mm")
    full = ImageChops.lighter(m, code)
    canvas.alpha_composite(glow_layer(full, (1.0, 0.05, 0.05), (4, 14, 38), (0.9, 0.8, 0.6)))
    stroke = full.filter(ImageFilter.MaxFilter(7))
    under = Image.new("RGBA", (W, H), (16, 0, 2, 0)); under.putalpha(stroke)
    canvas.alpha_composite(under)
    canvas.alpha_composite(gradient_fill(full, (1.0, 0.85, 0.75), (0.9, 0.05, 0.08), int(cy - R * 1.2), int(cy + R * 1.2)))


def logo():
    W, H = 2048, 1100
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    emblem(canvas, W // 2, 340, 245)
    tc, w, y0, y1 = compose_text(W, H, 640, 190, "CODE CARNIVAL", 16)
    canvas.alpha_composite(tc)
    # subtitle with flanking rules
    sub = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(sub)
    fs = ImageFont.truetype(FONT_M, 62)
    tw = tracked(sd, (W / 2, 905), "AI STUDENT CHAPTER", fs, 255, 30)
    for sgn in (-1, 1):
        x0 = W / 2 + sgn * (tw / 2 + 50)
        sd.line([(x0, 948), (x0 + sgn * 230, 948)], fill=255, width=5)
    canvas.alpha_composite(glow_layer(sub, (1, 0.1, 0.1), (4, 12), (0.8, 0.5)))
    canvas.alpha_composite(gradient_fill(sub, (1.0, 0.72, 0.68), (0.95, 0.3, 0.3), 900, 980))
    p = out("graphics", "code_carnival_logo.png")
    canvas.save(p, optimize=True)
    canvas.save(p.replace(".png", ".webp"), quality=90, method=6)
    print("wrote graphics/code_carnival_logo.png", canvas.size)

    # title-only treatment, tight canvas
    W2, H2 = 2048, 420
    t2, w2, _, _ = compose_text(W2, H2, 90, 190, "CODE CARNIVAL", 16)
    rules = Image.new("L", (W2, H2), 0)
    rd = ImageDraw.Draw(rules)
    x0, x1 = W2 / 2 - w2 / 2, W2 / 2 + w2 / 2
    rd.rectangle([x0, 52, x1, 58], fill=255)
    rd.rectangle([x0, 352, x1, 358], fill=255)
    t2.alpha_composite(glow_layer(rules, (1, 0.1, 0.1), (4, 12), (0.8, 0.5)))
    t2.alpha_composite(gradient_fill(rules, (1, 0.6, 0.55), (0.9, 0.12, 0.12), 40, 370))
    p = out("graphics", "title_texture.png")
    t2.save(p, optimize=True)
    t2.save(p.replace(".png", ".webp"), quality=90, method=6)
    print("wrote graphics/title_texture.png", t2.size)


def red_glow():
    N = 1024
    ys, xs = np.mgrid[0:N, 0:N]
    r = np.sqrt(((xs + .5) / N * 2 - 1) ** 2 + ((ys + .5) / N * 2 - 1) ** 2)
    a = np.clip(np.exp(-(r / 0.28) ** 2) * 0.9 + np.exp(-(r / 0.62) ** 2) * 0.5, 0, 1) * (1 - smoothstep(0.85, 1.0, r))
    rgb = np.dstack([np.ones((N, N)), 0.12 + 0.35 * np.exp(-(r / 0.18) ** 2), 0.08 + 0.2 * np.exp(-(r / 0.12) ** 2)])
    Image.fromarray(to_u8(np.dstack([rgb, a])), "RGBA").save(out("graphics", "red_glow.png"), optimize=True)
    print("wrote graphics/red_glow.png")


def film_grain():
    N = 512
    rng = np.random.default_rng(5)
    g = ndimage.gaussian_filter(rng.normal(0, 1, (N, N)), 0.7, mode="wrap")
    g = g / np.abs(g).max()
    lum = (g > 0).astype(float)              # white grains on dark, black grains on light
    a = np.clip(np.abs(g) * 1.5, 0, 1) * 0.55
    img = Image.fromarray(to_u8(np.dstack([lum, lum, lum, a])), "RGBA")
    p = out("graphics", "film_grain.png")
    img.save(p, optimize=True)
    img.save(p.replace(".png", ".webp"), quality=85, method=6)
    print("wrote graphics/film_grain.png (tileable 512)")


def vignette():
    W, H = 1920, 1080
    ys, xs = np.mgrid[0:H, 0:W]
    x = ((xs + .5) / W * 2 - 1) * 1.0
    y = ((ys + .5) / H * 2 - 1) * 1.0
    r = np.sqrt((x / 1.05) ** 2 + (y / 0.95) ** 2)
    a = smoothstep(0.38, 1.28, r) ** 1.35 * 0.96
    rgb = np.dstack([np.full((H, W), 0.012), np.zeros((H, W)), np.full((H, W), 0.015)])
    img = Image.fromarray(to_u8(np.dstack([rgb, a])), "RGBA")
    p = out("graphics", "vignette.png")
    img.save(p, optimize=True)
    img.save(p.replace(".png", ".webp"), quality=85, method=6)
    print("wrote graphics/vignette.png")


def transition_portal():
    """Iris overlay: opaque black-red outside, torn glowing rim, transparent hole. Scale up from the centre to reveal / cover."""
    W, H = 1920, 1080
    rng = np.random.default_rng(13)
    ys, xs = np.mgrid[0:H, 0:W]
    x = (xs + .5 - W / 2) / (H / 2)
    y = (ys + .5 - H / 2) / (H / 2)
    r = np.sqrt(x * x + y * y)
    th = np.arctan2(y, x)
    k = np.arange(1, 14)
    amps = rng.uniform(0.004, 0.03, len(k)) / np.sqrt(k)
    ph = rng.uniform(0, 6.28, len(k))
    R = 0.48 + sum(a * np.sin(kk * th + p) for a, kk, p in zip(amps, k, ph))
    spikes = np.clip(np.sin(th * 23 + 1.7) * np.sin(th * 7), 0, 1) ** 4 * 0.05
    R = R + spikes
    d = r - R
    veins = fbm(H, W, 6, 10, rng, 5)
    outside = smoothstep(-0.01, 0.01, d)                    # 1 outside the hole
    band = np.exp(-(d / 0.028) ** 2) + 0.4 * np.exp(-(np.clip(d, 0, None) / 0.2) ** 2) * (0.5 + 0.5 * veins)
    base = np.array([0.02, 0.0, 0.01])
    rim = ramp(np.clip(band, 0, 1), [(0, (0.0, 0, 0)), (0.3, (0.55, 0.02, 0.03)), (0.7, (1.0, 0.2, 0.08)), (1, (1.0, 0.85, 0.65))])
    col = base[None, None, :] * (1 - np.clip(band, 0, 1)[..., None]) + rim * np.clip(band, 0, 1)[..., None]
    inner_glow = np.exp(-(np.clip(-d, 0, None) / 0.04) ** 2) * (d < 0) * 0.7   # soft light just inside the hole
    a = np.maximum(outside, inner_glow * 0.9)
    col = col + inner_glow[..., None] * np.array([1.0, 0.18, 0.08])
    img = Image.fromarray(to_u8(np.dstack([col, a])), "RGBA")
    p = out("graphics", "transition_portal.png")
    img.save(p, optimize=True)
    print("wrote graphics/transition_portal.png (hole radius ~0.48 of half-height; scale to taste)")


def cursor_particle():
    N = 64
    ys, xs = np.mgrid[0:N, 0:N]
    r = np.sqrt(((xs + .5) / N * 2 - 1) ** 2 + ((ys + .5) / N * 2 - 1) ** 2)
    a = np.clip(np.exp(-(r / 0.16) ** 2) + 0.5 * np.exp(-(r / 0.45) ** 2), 0, 1) * (1 - smoothstep(0.85, 1, r))
    rgb = np.dstack([np.ones((N, N)), 0.25 + 0.65 * np.exp(-(r / 0.14) ** 2), 0.18 + 0.5 * np.exp(-(r / 0.1) ** 2)])
    Image.fromarray(to_u8(np.dstack([rgb, a])), "RGBA").save(out("graphics", "cursor_particle.png"), optimize=True)
    print("wrote graphics/cursor_particle.png")


if __name__ == "__main__":
    logo(); red_glow(); film_grain(); vignette(); transition_portal(); cursor_particle()
