"""Shared helpers for the Code Carnival asset generators (numpy only, no external services)."""
import os
import numpy as np
from scipy import ndimage

ROOT = "/home/claude/CodeCarnival_3D_Assets"


def out(*parts):
    p = os.path.join(ROOT, *parts)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    return p


def tile_noise(h, w, cells_y, cells_x, rng):
    """Tileable smooth value noise in [0,1] with the given lattice resolution."""
    g = rng.random((cells_y, cells_x))
    z = ndimage.zoom(g, (h / cells_y, w / cells_x), order=3, mode="grid-wrap", grid_mode=True)
    return np.clip(z[:h, :w], 0, 1)


def fbm(h, w, base_y, base_x, rng, octaves=5, persistence=0.5, lacunarity=2.0):
    """Tileable fractal noise, normalised to [0,1]. base_y/base_x set the stretch (anisotropy)."""
    total = np.zeros((h, w))
    amp, norm = 1.0, 0.0
    cy, cx = float(base_y), float(base_x)
    for _ in range(octaves):
        total += amp * tile_noise(h, w, max(2, int(round(cy))), max(2, int(round(cx))), rng)
        norm += amp
        amp *= persistence
        cy *= lacunarity
        cx *= lacunarity
    total /= norm
    lo, hi = total.min(), total.max()
    return (total - lo) / (hi - lo + 1e-9)


def ridged(n):
    return 1.0 - np.abs(2.0 * n - 1.0)


def normal_from_height(hmap, strength=3.0):
    """Tangent-space normal map (OpenGL / glTF convention: +Y up) from a tileable height map."""
    dx = (np.roll(hmap, -1, axis=1) - np.roll(hmap, 1, axis=1)) * 0.5
    dy = (np.roll(hmap, -1, axis=0) - np.roll(hmap, 1, axis=0)) * 0.5
    nx = -dx * strength
    ny = dy * strength          # image rows grow downward, so +dy == -V
    nz = np.ones_like(nx)
    ln = np.sqrt(nx * nx + ny * ny + nz * nz)
    n = np.stack([nx / ln, ny / ln, nz / ln], axis=-1)
    return n * 0.5 + 0.5


def to_u8(a):
    return (np.clip(a, 0, 1) * 255.0 + 0.5).astype(np.uint8)


def ramp(t, stops):
    """Piecewise-linear colour ramp. stops: [(pos, (r,g,b)), ...] sorted by pos. t any shape."""
    t = np.clip(t, 0, 1)
    pos = np.array([s[0] for s in stops])
    cols = np.array([s[1] for s in stops], dtype=float)
    res = np.zeros(t.shape + (cols.shape[1],))
    for c in range(cols.shape[1]):
        res[..., c] = np.interp(t, pos, cols[:, c])
    return res


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a + 1e-12), 0, 1)
    return t * t * (3 - 2 * t)
