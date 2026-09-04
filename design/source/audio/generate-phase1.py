#!/usr/bin/env python3
"""Generate the six original Phase-1 audio assets.

No third-party samples or music are used. WAV masters are created with the Python
standard library; when ffmpeg is available, 48 kbit/s Opus delivery files are
created alongside them.
"""
from __future__ import annotations
import math, random, shutil, struct, subprocess, wave
from pathlib import Path

SR = 48000
OUT = Path(__file__).resolve().parents[3] / "public" / "assets" / "audio"
random.seed(41)


def clamp(x: float) -> float:
    return max(-1.0, min(1.0, x))


def lp_noise(n: int, alpha: float = 0.996) -> list[float]:
    y = 0.0
    out = []
    for _ in range(n):
        y = alpha * y + (1 - alpha) * random.uniform(-1, 1)
        out.append(y)
    peak = max(max(abs(v) for v in out), 1e-9)
    return [v / peak for v in out]


def env(t: float, dur: float, a: float = .3, r: float = .8) -> float:
    return min(1.0, t / max(a, 1e-6), (dur - t) / max(r, 1e-6)) if 0 <= t <= dur else 0.0


def sine(freq: float, t: float) -> float:
    return math.sin(2 * math.pi * freq * t)


def note(midi: int) -> float:
    return 440.0 * (2 ** ((midi - 69) / 12))


def write_wav(name: str, samples: list[float]) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    p = OUT / f"{name}.wav"
    with wave.open(str(p), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        frames = bytearray()
        for v in samples:
            s = int(clamp(v) * 32767)
            frames += struct.pack("<hh", s, s)
        w.writeframes(frames)
    return p


def encode_ogg(wav_path: Path) -> None:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        return
    subprocess.run([ffmpeg, "-y", "-loglevel", "error", "-i", str(wav_path), "-c:a", "libopus", "-b:a", "48k", str(wav_path.with_suffix('.ogg'))], check=True)


def ambience(name: str, dur: float, pad_notes: tuple[int, ...], fire: float = 0.0, wind: float = .12) -> None:
    n = int(SR * dur)
    noise = lp_noise(n)
    crack = lp_noise(n, .90)
    samples = []
    for i in range(n):
        t = i / SR
        v = wind * noise[i]
        for j, m in enumerate(pad_notes):
            v += .055 * sine(note(m), t + j * .07) + .02 * sine(note(m) / 2, t)
        if fire:
            gate = max(0.0, crack[i] - .58)
            v += fire * gate * (0.5 + 0.5 * sine(87 + 8 * sine(.13, t), t))
        v *= .84 + .16 * sine(.035, t)
        samples.append(v)
    encode_ogg(write_wav(name, samples))


def motif(name: str, midi_notes: tuple[int, ...], lengths: tuple[float, ...], tail: float = .55) -> None:
    dur = sum(lengths) + tail
    samples = [0.0] * int(SR * dur)
    cursor = 0.0
    for idx, (m, ln) in enumerate(zip(midi_notes, lengths)):
        for i in range(int(SR * (ln + tail))):
            t = i / SR
            pos = int((cursor + t) * SR)
            if pos >= len(samples): break
            e = env(t, ln + tail, .03, tail)
            f = note(m)
            samples[pos] += e * (.16 * sine(f, t) + .055 * sine(f * 2, t) + .025 * sine(f / 2, t))
        cursor += ln
    encode_ogg(write_wav(name, samples))


def chest_sfx() -> None:
    dur = 3.3; n = int(SR * dur); noise = lp_noise(n, .80); samples = [0.0] * n
    events = [(0.16, 110, .12, .20), (0.72, 165, .18, .16), (1.35, 83, .35, .14), (2.05, 220, .22, .11)]
    for start, f, length, amp in events:
        for i in range(int(SR * length)):
            pos = int((start + i / SR) * SR)
            if pos >= n: break
            e = math.exp(-6 * i / max(1, SR * length))
            samples[pos] += amp * e * (sine(f, i / SR) + .35 * noise[pos])
    for i in range(n):
        t = i / SR
        if t > 2.3:
            samples[i] += .035 * sine(880, t) * env(t - 2.3, .7, .08, .5)
    encode_ogg(write_wav("sfx-chest-lantern-material-01", samples))


if __name__ == "__main__":
    ambience("audio-camp-forest-ambience-01", 32, (48, 55, 60), fire=.09, wind=.10)
    motif("audio-departure-motif-01", (55, 60, 62, 67), (.55, .55, .55, .75))
    ambience("audio-focus-light-undergrowth-01", 48, (45, 52, 57), fire=.018, wind=.085)
    motif("audio-completion-resolve-01", (55, 60, 62, 67, 72), (.45, .45, .45, .60, .95), .8)
    ambience("audio-rest-campfire-ambience-01", 32, (48, 55), fire=.13, wind=.055)
    chest_sfx()
    print(f"Generated Phase-1 audio in {OUT}")
