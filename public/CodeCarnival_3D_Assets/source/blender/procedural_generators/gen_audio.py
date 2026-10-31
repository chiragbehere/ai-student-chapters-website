"""Original synthesised audio (numpy/scipy). 44.1 kHz, 16-bit mono WAV. Loops are crossfaded to be seamless."""
import wave
import numpy as np
from scipy import signal
from cc_common import out

SR = 44100
rng = np.random.default_rng(2026)


def noise(sec):
    return rng.normal(0, 1, int(sec * SR))


def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, "high", fs=SR, output="sos"), x)


def t_(sec):
    return np.arange(int(sec * SR)) / SR


def env_ar(n, a, r, curve=2.0):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = (np.arange(na) / max(na, 1)) ** curve
    e[n - nr:] = (1 - np.arange(nr) / max(nr, 1)) ** curve
    return e


def reverb(x, sec=2.5, wet=0.35):
    n = int(sec * SR)
    ir = rng.normal(0, 1, n) * np.exp(-np.arange(n) / (sec * SR / 5.0))
    ir = lp(ir, 5000)
    y = signal.fftconvolve(x, ir)[:len(x) + n]
    y = y / (np.abs(y).max() + 1e-9) * np.abs(x).max()
    out_ = np.zeros(len(y)); out_[:len(x)] += x * (1 - wet)
    return out_ + y * wet


def make_loop(x, xfade=1.5):
    """Make x seamless: overlap its tail onto its head with an equal-power crossfade, then drop the tail."""
    n = int(xfade * SR)
    head, tail = x[:n], x[-n:]
    fi = np.sin(np.linspace(0, np.pi / 2, n)); fo = np.cos(np.linspace(0, np.pi / 2, n))
    body = x[:-n].copy()
    body[:n] = head * fi + tail * fo
    return body


def norm(x, peak=0.89):
    x = x - np.mean(x)
    return x / (np.abs(x).max() + 1e-9) * peak


def save(name, x, fade=0.0):
    x = norm(x)
    if fade:
        n = int(fade * SR); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    p = out("audio", name)
    with wave.open(p, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f"wrote audio/{name}  {len(pcm)/SR:.1f}s  {len(pcm)*2/1024:.0f} KiB")


def ambient_forest():
    sec = 16 + 1.5
    base = bp(noise(sec), 120, 900) * 0.25
    t = t_(sec)
    swell = 0.5 + 0.5 * np.sin(2 * np.pi * t / 8.5 + 1.0)
    wind = lp(noise(sec), 500) * (0.25 + 0.5 * swell)
    x = base + wind
    # distant creaks / rustles
    for _ in range(9):
        s = int(rng.uniform(0.5, sec - 1.5) * SR); d = int(rng.uniform(0.15, 0.6) * SR)
        f0 = rng.uniform(300, 700)
        tt = np.arange(d) / SR
        creak = np.sin(2 * np.pi * (f0 + 80 * np.sin(2 * np.pi * 7 * tt)) * tt) * np.hanning(d) * 0.08
        x[s:s + d] += creak
    for _ in range(14):                                      # rustling leaves
        s = int(rng.uniform(0.2, sec - 0.7) * SR); d = int(rng.uniform(0.1, 0.4) * SR)
        x[s:s + d] += hp(rng.normal(0, 1, d), 3000) * np.hanning(d) * 0.06
    x += np.sin(2 * np.pi * 55 * t) * 0.03                   # faint sub bed
    save("ambient_forest.wav", make_loop(reverb(x, 2.0, 0.25)))


def dark_drone():
    sec = 14 + 2.0
    t = t_(sec)
    x = np.zeros_like(t)
    for f, a, det in [(41.2, 1.0, 0.0), (41.2, 0.7, 0.35), (82.4, 0.5, -0.2), (116.5, 0.3, 0.4), (123.5, 0.18, 0.0)]:
        ph = 2 * np.pi * (f + det) * t + 0.3 * np.sin(2 * np.pi * 0.13 * t)
        x += a * (np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph))
    x *= 0.6 + 0.4 * np.sin(2 * np.pi * t / 7.0 + 0.5) ** 2
    cutoff = 220 + 160 * np.sin(2 * np.pi * t / 14.0)
    y = np.zeros_like(x)
    for i in range(0, len(x), 2048):
        c = float(np.clip(cutoff[i], 80, 900))
        sos = signal.butter(2, c, "low", fs=SR, output="sos")
        y[i:i + 2048] = signal.sosfilt(sos, x[i:i + 2048])      # block-wise sweep (zi reset is masked by the drone's own level)
    y += bp(noise(sec), 60, 200) * 0.2
    save("dark_drone.wav", make_loop(reverb(y, 3.0, 0.4), 2.0))


def electric_crackle():
    sec = 3.2
    x = np.zeros(int(sec * SR))
    pos = 0.05
    while pos < sec - 0.3:
        burst = int(rng.uniform(0.004, 0.03) * SR)
        s = int(pos * SR)
        seg = hp(rng.normal(0, 1, burst), 2500) * np.exp(-np.arange(burst) / (burst / 4)) * rng.uniform(0.3, 1.0)
        x[s:s + burst] += seg[:len(x) - s]
        if rng.random() < 0.25:                                # bright snap
            sn = int(0.002 * SR); x[s:s + sn] += rng.choice([-1, 1]) * np.linspace(1, 0, sn)
        pos += rng.exponential(0.07) * (0.4 + 1.5 * (pos / sec))
    x += 0.12 * np.sin(2 * np.pi * 120 * t_(sec)) * np.hanning(len(x))   # mains hum
    save("electric_crackle.wav", reverb(x, 0.8, 0.2), fade=0.02)


def portal_open():
    sec = 6.0
    t = t_(sec)
    prog = (t / sec) ** 2.2
    f = 40 + 900 * prog
    ph = 2 * np.pi * np.cumsum(f) / SR
    sweep = (np.sin(ph) + 0.4 * np.sin(2 * ph)) * prog ** 0.8
    rumble = lp(noise(sec), 160, 3) * (0.3 + 1.6 * prog)
    shimmer = bp(noise(sec), 2500, 9000) * prog * 0.35 * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t))
    x = sweep * 0.5 + rumble + shimmer
    n = len(x); hit = int(4.2 * SR)                             # tearing burst at ~4.2 s
    tail = np.arange(n - hit)
    burst = hp(rng.normal(0, 1, n - hit), 400) * np.exp(-tail / (0.35 * SR)) * 1.4
    boom = np.sin(2 * np.pi * (70 * np.exp(-tail / (0.4 * SR)) + 30) * tail / SR) * np.exp(-tail / (0.6 * SR)) * 2.0
    x[hit:] += burst + boom
    x[:int(4.2 * SR)] *= np.linspace(0.3, 1, int(4.2 * SR))
    save("portal_open.wav", reverb(x, 2.5, 0.35), fade=0.05)


def portal_transition():
    sec = 3.4
    t = t_(sec)
    mid = sec * 0.45
    env = np.exp(-((t - mid) / (sec * 0.2)) ** 2)
    f = 150 + 1800 * np.exp(-((t - mid) / (sec * 0.25)) ** 2)
    n = noise(sec)
    y = np.zeros_like(n)
    for i in range(0, len(n), 1024):
        c = float(np.clip(f[i], 120, 9000))
        sos = signal.butter(2, [c * 0.6, c * 1.4], "band", fs=SR, output="sos")
        y[i:i + 1024] = signal.sosfilt(sos, n[i:i + 1024])
    sub = np.sin(2 * np.pi * (55 - 20 * t / sec) * t) * env * 0.8
    x = y * env * 1.3 + sub
    save("portal_transition.wav", reverb(x, 1.8, 0.3), fade=0.03)


def cinematic_impact():
    sec = 5.0
    t = t_(sec)
    boom = np.sin(2 * np.pi * (95 * np.exp(-t / 0.12) + 34) * t) * np.exp(-t / 0.9)
    sub2 = np.sin(2 * np.pi * 28 * t) * np.exp(-t / 1.6) * 0.6
    hit = bp(noise(sec), 80, 3000) * np.exp(-t / 0.12) * 1.6
    crack = hp(noise(sec), 1500) * np.exp(-t / 0.03) * 1.0
    x = boom * 1.4 + sub2 + hit + crack
    x[:int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    save("cinematic_impact.wav", reverb(x, 3.2, 0.45), fade=0.05)


def wind_ambience():
    sec = 18 + 2.0
    t = t_(sec)
    gust = (0.35 + 0.65 * (0.5 + 0.5 * np.sin(2 * np.pi * t / 9.0))) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 3.7 + 1.1))
    n = noise(sec)
    y = np.zeros_like(n)
    for i in range(0, len(n), 2048):
        c = 250 + 900 * float(gust[i])
        sos = signal.butter(2, [max(80, c * 0.4), c * 1.3], "band", fs=SR, output="sos")
        y[i:i + 2048] = signal.sosfilt(sos, n[i:i + 2048])
    y = y * gust + lp(noise(sec), 90) * 0.5 * gust
    whistle = bp(noise(sec), 900, 1100, 3) * 2.0 * np.clip(gust - 0.55, 0, 1) ** 2
    save("wind_ambience.wav", make_loop(y + whistle, 2.0))


if __name__ == "__main__":
    ambient_forest(); dark_drone(); electric_crackle(); portal_open(); portal_transition(); cinematic_impact(); wind_ambience()
