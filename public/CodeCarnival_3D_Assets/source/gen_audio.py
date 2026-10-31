"""gen_audio.py - original synthesised audio (numpy/scipy only). Nothing sampled or downloaded."""
import os, subprocess, sys, json
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

OUT = sys.argv[1] if len(sys.argv) > 1 else "/home/claude/CodeCarnival_3D_Assets"
A = os.path.join(OUT, "audio"); os.makedirs(A, exist_ok=True)
SR = 44100
rng = np.random.default_rng(2026)

def t_(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def lp(x, f, o=4): return sosfilt(butter(o, f, "lp", fs=SR, output="sos"), x)
def hp(x, f, o=4): return sosfilt(butter(o, f, "hp", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=3): return sosfilt(butter(o, [lo, hi], "bp", fs=SR, output="sos"), x)
def slow_rand(d, rate, seed):
    r = np.random.default_rng(seed); n = int(d * rate) + 3
    pts = r.random(n); x = np.interp(np.linspace(0, n - 1, int(d * SR)), np.arange(n), pts)
    return x
def loopify(x, L, X):
    """Make a seamless loop of length L from a signal of length L+X by cross-fading the tail into the head."""
    out = x[:L].copy(); f = np.linspace(0, 1, X)
    out[:X] = out[:X] * f + x[L:L + X] * (1 - f)
    return out
def env_ad(n, a, d_):
    e = np.ones(n); na = int(a * SR); nd = int(d_ * SR)
    e[:na] = np.linspace(0, 1, na); e[-nd:] = np.linspace(1, 0, nd); return e
def reverb(x, secs=2.5, wet=0.35):
    ir = noise(secs) * np.exp(-np.arange(int(secs * SR)) / SR * 3.0 / secs * 2.2)
    ir = lp(ir, 3500)
    w = fftconvolve(x, ir)[:len(x)]
    w = w / (np.abs(w).max() + 1e-9) * np.abs(x).max()
    return x * (1 - wet) + w * wet
def save(name, x, peak=0.85, loop=False, stereo=False):
    x = x / (np.abs(x).max() + 1e-9) * peak
    if not loop:
        n = int(0.004 * SR); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    p = os.path.join(A, name)
    wavfile.write(p, SR, (x * 32767).astype(np.int16))
    return p

stats = {}
# ---- ambient forest (24 s loop): low room tone + wind bed + insects + distant creaks
L = int(24 * SR); X = int(3 * SR); d = 27
t = t_(d)
bed = lp(noise(d), 140) * 0.9 * (0.6 + 0.4 * slow_rand(d, 0.15, 1))
wind = bp(noise(d), 250, 900) * (0.25 + 0.75 * slow_rand(d, 0.2, 2) ** 2) * 0.55
cri = np.zeros_like(t)
for k in range(3):
    f0 = 4300 + 380 * k; gate = (np.sin(2 * np.pi * (0.9 + 0.17 * k) * t + k) > 0.35).astype(float)
    gate = lp(gate, 30, 2)
    cri += np.sin(2 * np.pi * f0 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * (38 + 3 * k) * t)) * gate * 0.035
creak = np.zeros_like(t)
for _ in range(4):
    s = rng.uniform(1, d - 3); n = int(1.4 * SR); i0 = int(s * SR)
    tt = np.arange(n) / SR; f = 180 + 70 * np.sin(2 * np.pi * 0.7 * tt) - 60 * tt
    seg = np.sin(2 * np.pi * np.cumsum(f) / SR) * bp(rng.standard_normal(n), 400, 1400) * np.hanning(n)
    creak[i0:i0 + n] += seg * 0.06
amb = bed * 0.8 + wind + cri + creak
amb = reverb(amb, 2.0, 0.25)
saved = save("ambient_forest.wav", loopify(amb, L, X), 0.7, loop=True)

# ---- dark drone (20 s loop)
L = int(20 * SR); X = int(4 * SR); d = 24; t = t_(d)
drone = np.zeros_like(t)
for f, g, dt in [(36.7, 1.0, 0.0), (55.0, 0.7, 0.35), (73.4, 0.5, 0.6), (73.4 * 1.007, 0.45, 0.2), (110.0 * 1.414 / 1.414 * 1.0595 ** 6, 0.18, 0.1)]:
    lfo = 0.65 + 0.35 * np.sin(2 * np.pi * (0.05 + dt * 0.05) * t + dt * 6)
    drone += g * np.sin(2 * np.pi * f * t + 0.8 * np.sin(2 * np.pi * 0.11 * t + dt)) * lfo
drone = np.tanh(drone * 1.6)
drone += 0.25 * lp(noise(d), 300) * (0.5 + 0.5 * slow_rand(d, 0.1, 5))
drone = lp(drone, 700)
save("dark_drone.wav", loopify(drone, L, X), 0.8, loop=True)

# ---- electric crackle (4 s)
d = 4.0; n = int(d * SR); x = np.zeros(n)
dens = 6 + 40 * np.abs(np.sin(np.linspace(0, 3.2, 40)))
for i, dn in enumerate(dens):
    for _ in range(rng.poisson(dn * 0.1)):
        s = int((i / len(dens) + rng.uniform(0, 1 / len(dens))) * (n - 4000))
        m = int(rng.uniform(0.004, 0.03) * SR); b = hp(rng.standard_normal(m), 2500, 2) * np.exp(-np.arange(m) / (m * 0.2))
        x[s:s + m] += b * rng.uniform(0.2, 1.0)
t = t_(d); hum = np.sin(2 * np.pi * 100 * t) * 0.1 * (np.sin(2 * np.pi * 3 * t) > 0.4) + np.sin(2 * np.pi * 300 * t) * 0.03
x = x + hum
save("electric_crackle.wav", x, 0.85)

# ---- portal open (7 s): rising swell + sweeping noise + sub boom at 5.6 s
d = 7.0; t = t_(d); n = len(t)
fr = 40 * (520 / 40) ** (t / 5.6); fr[t > 5.6] = 520
ph = 2 * np.pi * np.cumsum(fr) / SR
tone = np.sin(ph + 2.5 * np.sin(ph * 0.5)) * np.clip(t / 5.6, 0, 1) ** 2
sweep = noise(d); cen = 200 * (6000 / 200) ** np.clip(t / 5.6, 0, 1)
w = np.zeros(n); blk = 2048
for i in range(0, n, blk):
    c = cen[min(i, n - 1)]; seg = sweep[i:i + blk]
    w[i:i + blk] = bp(np.pad(seg, (0, 0)), max(c * 0.7, 60), min(c * 1.4, 18000), 2)[:len(seg)] if False else seg
w = np.zeros(n)
for i in range(0, n, 8192):
    c = cen[min(i, n - 1)]; seg = rng.standard_normal(8192)
    w[i:i + 8192] = bp(seg, max(c * 0.75, 60), min(c * 1.35, 16000), 2)[:len(w[i:i + 8192])]
w *= np.clip(t / 5.6, 0, 1) ** 1.5
boom_t = np.clip(t - 5.6, 0, None); boom = np.sin(2 * np.pi * (28 + 70 * np.exp(-boom_t * 9)) * boom_t) * np.exp(-boom_t * 1.4) * (t > 5.6)
burst = lp(noise(d), 1800) * np.exp(-boom_t * 5) * (t > 5.6)
x = tone * 0.5 + w * 0.5 + boom * 1.1 + burst * 0.5
x = reverb(x, 2.5, 0.3)
save("portal_open.wav", x, 0.85)

# ---- portal transition (3.5 s): whoosh up/down + sub drop
d = 3.5; t = t_(d); n = len(t)
cen = 250 + 3800 * np.sin(np.pi * np.clip(t / 2.6, 0, 1)) ** 1.4
w = np.zeros(n)
for i in range(0, n, 4096):
    c = cen[min(i, n - 1)]; w[i:i + 4096] = bp(rng.standard_normal(4096), max(c * 0.6, 80), min(c * 1.6, 17000), 2)[:len(w[i:i + 4096])]
w *= np.sin(np.pi * np.clip(t / 2.8, 0, 1)) ** 1.2
sub = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-t * 1.2) + 30) / SR) * np.exp(-np.clip(t - 1.0, 0, None) * 1.6) * np.clip(t / 0.6, 0, 1)
x = reverb(w * 0.8 + sub * 0.9, 1.8, 0.25)
save("portal_transition.wav", x, 0.85)

# ---- cinematic impact (5 s)
d = 5.0; t = t_(d); n = len(t)
boom = np.sin(2 * np.pi * np.cumsum(30 + 90 * np.exp(-t * 14)) / SR) * np.exp(-t * 1.5)
hit = lp(noise(d), 4500) * np.exp(-t * 18) * 0.8
metal = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * r) * a for f, r, a in [(183, 3.5, 0.2), (421, 4.5, 0.12), (730, 6, 0.08), (1180, 8, 0.05)])
x = reverb(boom * 1.2 + hit + metal, 3.0, 0.35)
save("cinematic_impact.wav", x, 0.9)

# ---- wind ambience (24 s loop)
L = int(24 * SR); X = int(3 * SR); d = 27
w = np.zeros(int(d * SR))
for lo, hi, rate, sd, g in [(120, 400, 0.12, 11, 0.9), (400, 1400, 0.17, 12, 0.7), (1400, 4200, 0.23, 13, 0.25)]:
    w += bp(noise(d), lo, hi) * (0.08 + 0.92 * slow_rand(d, rate, sd) ** 2.2) * g
w += lp(noise(d), 90) * 0.5 * (0.5 + 0.5 * slow_rand(d, 0.1, 14))
save("wind_ambience.wav", loopify(w, L, X), 0.75, loop=True)

# ---- web-friendly Ogg Vorbis copies + measured stats
rep = {}
for f in sorted(os.listdir(A)):
    if f.endswith(".wav"):
        sr, a = wavfile.read(os.path.join(A, f)); a = a.astype(np.float64) / 32768
        ogg = f[:-4] + ".ogg"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(A, f), "-c:a", "libvorbis", "-q:a", "4", os.path.join(A, ogg)], check=True)
        rep[f] = dict(seconds=round(len(a) / sr, 2), sample_rate=sr, channels=1, bit_depth=16, peak_dbfs=round(20 * np.log10(np.abs(a).max()), 2),
                      rms_dbfs=round(20 * np.log10(np.sqrt((a ** 2).mean())), 2), loop_seam_jump=round(float(abs(a[0] - a[-1])), 4),
                      wav_kb=round(os.path.getsize(os.path.join(A, f)) / 1024), ogg_kb=round(os.path.getsize(os.path.join(A, ogg)) / 1024))
json.dump(rep, open(os.path.join(OUT, "source", "audio_stats.json"), "w"), indent=1)
for k, v in rep.items(): print(k, v)
