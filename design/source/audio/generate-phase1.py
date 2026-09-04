"""Generate the Phase 1 audio reference pack for Pomodoro D&D.

No third-party recordings or copyrighted music are used. The generator is
intentionally deterministic so the reference assets can be reproduced and
reviewed. Output masters are WAV; use ffmpeg/libopus for web OGG delivery.
"""
from pathlib import Path
import numpy as np
import wave

OUT = Path("public/assets/audio")
OUT.mkdir(parents=True, exist_ok=True)
SR = 44100
RNG = np.random.default_rng(42)


def normalize(x, peak=0.32):
    m = np.max(np.abs(x)) or 1
    return (x / m * peak).astype(np.float32)


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    pcm = (x * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        stereo = np.column_stack([pcm, pcm]).ravel()
        w.writeframes(stereo.tobytes())


def lowpass_noise(seconds, cutoff_hz=600, amp=0.1):
    n = int(seconds * SR)
    white = RNG.normal(0, 1, n)
    win = max(3, int(SR / cutoff_hz))
    kernel = np.ones(win) / win
    y = np.convolve(white, kernel, mode="same")
    return y / (np.max(np.abs(y)) or 1) * amp


def sine(t, freq, amp=1, phase=0):
    return amp * np.sin(2 * np.pi * freq * t + phase)


def fade(x, attack=0.5, release=0.5):
    n = len(x)
    env = np.ones(n)
    a = min(n, int(SR * attack))
    r = min(n, int(SR * release))
    if a:
        env[:a] = np.linspace(0, 1, a)
    if r:
        env[-r:] = np.linspace(1, 0, r)
    return x * env


def pad(seconds, freqs, amp=0.08):
    t = np.arange(int(seconds * SR)) / SR
    x = np.zeros_like(t)
    for i, f in enumerate(freqs):
        x += sine(t, f, amp / (i + 1), phase=i * 0.7)
    return x


def camp_forest():
    sec = 32
    t = np.arange(int(sec * SR)) / SR
    x = lowpass_noise(sec, 400, 0.06) + pad(sec, [110, 164.81, 220], 0.025)
    x *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.035 * t) ** 2
    crackle = np.zeros_like(t)
    for _ in range(170):
        pos = RNG.integers(0, len(t) - 300)
        ln = RNG.integers(60, 300)
        crackle[pos:pos+ln] += RNG.normal(0, 1, ln) * np.exp(-np.linspace(0, 6, ln)) * RNG.uniform(0.01, 0.04)
    write_wav(OUT / "audio-camp-forest-ambience-01.wav", normalize(x + crackle, 0.20))


def departure():
    sec = 3.2
    t = np.arange(int(sec * SR)) / SR
    x = np.zeros_like(t)
    for start, f, a in [(0.0, 196.0, 0.85), (0.55, 293.66, 0.75), (1.15, 329.63, 0.85), (1.85, 392.0, 0.72)]:
        idx = t >= start
        tt = t[idx] - start
        x[idx] += a * (np.sin(2*np.pi*f*tt) + 0.28*np.sin(2*np.pi*2*f*tt)) * np.exp(-tt*1.6)
    write_wav(OUT / "audio-departure-motif-01.wav", normalize(fade(x, 0.03, 0.35), 0.28))


def focus():
    sec = 48
    t = np.arange(int(sec * SR)) / SR
    x = lowpass_noise(sec, 300, 0.045) + pad(sec, [98, 146.83, 196], 0.018)
    x *= 0.82 + 0.18 * np.sin(2 * np.pi * 0.018 * t + 0.4)
    for start in [7.5, 18.0, 31.0, 42.0]:
        for f in [293.66, 392.0]:
            idx = (t >= start) & (t < start + 2.8)
            tt = t[idx] - start
            x[idx] += 0.012 * np.sin(2*np.pi*f*tt) * np.exp(-tt*1.3)
    write_wav(OUT / "audio-focus-light-undergrowth-01.wav", normalize(x, 0.16))


def completion():
    sec = 4.5
    t = np.arange(int(sec * SR)) / SR
    x = np.zeros_like(t)
    for start, f, a in [(0.0, 392.0, 0.55), (0.45, 329.63, 0.6), (0.95, 293.66, 0.62), (1.5, 196.0, 0.9)]:
        idx = t >= start
        tt = t[idx] - start
        x[idx] += a * (np.sin(2*np.pi*f*tt) + 0.22*np.sin(2*np.pi*2*f*tt)) * np.exp(-tt*1.05)
    write_wav(OUT / "audio-completion-resolve-01.wav", normalize(fade(x, 0.03, 0.7), 0.27))


def rest():
    sec = 32
    t = np.arange(int(sec * SR)) / SR
    x = lowpass_noise(sec, 280, 0.035)
    crackle = np.zeros_like(t)
    for _ in range(240):
        pos = RNG.integers(0, len(t) - 450)
        ln = RNG.integers(80, 450)
        crackle[pos:pos+ln] += RNG.normal(0, 1, ln) * np.exp(-np.linspace(0, 7, ln)) * RNG.uniform(0.008, 0.055)
    x += crackle + sine(t, 98, 0.008)
    write_wav(OUT / "audio-rest-campfire-ambience-01.wav", normalize(x, 0.18))


def chest_lantern():
    sec = 3.3
    t = np.arange(int(sec * SR)) / SR
    x = np.zeros_like(t)
    for start, f, a, decay in [(0.15, 95, 0.65, 7.0), (0.72, 180, 0.35, 10.0), (1.15, 125, 0.5, 7.5)]:
        idx = t >= start
        tt = t[idx] - start
        x[idx] += a * np.sin(2*np.pi*f*tt) * np.exp(-tt*decay)
    for start, f, a in [(0.55, 980, 0.22), (0.58, 1320, 0.12)]:
        idx = t >= start
        tt = t[idx] - start
        x[idx] += a * np.sin(2*np.pi*f*tt) * np.exp(-tt*11)
    for start, f, a in [(1.55, 261.63, 0.16), (1.58, 392.0, 0.10), (1.62, 523.25, 0.06)]:
        idx = t >= start
        tt = t[idx] - start
        x[idx] += a * np.sin(2*np.pi*f*tt) * np.exp(-tt*1.8)
    write_wav(OUT / "sfx-chest-lantern-material-01.wav", normalize(fade(x, 0.01, 0.4), 0.30))


if __name__ == "__main__":
    camp_forest()
    departure()
    focus()
    completion()
    rest()
    chest_lantern()
