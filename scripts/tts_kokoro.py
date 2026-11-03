"""Narrate narration.json with Kokoro-82M, then build src/manifest.json from the real audio.

Scene length is derived from the measured WAV, never typed by hand:
    frames = round((max(seconds, minSeconds) + pad) * fps)
"""
import argparse
import json
import os
import wave

import numpy as np
from kokoro_onnx import Kokoro


def write_wav(path, samples, sample_rate):
    pcm = np.clip(np.asarray(samples, dtype=np.float32), -1.0, 1.0)
    data = (pcm * 32767.0).astype(np.int16)
    with wave.open(path, "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(int(sample_rate))
        handle.writeframes(data.tobytes())
    return len(data) / float(sample_rate)


def pad_wav(path, sample_rate, target_seconds):
    with wave.open(path, "rb") as handle:
        frames = handle.readframes(handle.getnframes())
    current = len(frames) / 2.0 / float(sample_rate)
    if current >= target_seconds:
        return current
    silence = np.zeros(int(round((target_seconds - current) * sample_rate)), dtype=np.int16)
    with wave.open(path, "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(int(sample_rate))
        handle.writeframes(frames + silence.tobytes())
    return target_seconds


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="kokoro-v1.0.onnx")
    ap.add_argument("--voices", default="voices-v1.0.bin")
    ap.add_argument("--script", default="narration.json")
    ap.add_argument("--outdir", default="public/audio")
    ap.add_argument("--manifest", default="src/manifest.json")
    args = ap.parse_args()

    with open(args.script, "r", encoding="utf-8") as handle:
        spec = json.load(handle)

    fps = int(spec.get("fps", 30))
    pad = float(spec.get("pad", 0.7))
    min_seconds = float(spec.get("minSeconds", 4.0))
    default_voice = spec.get("voice", "am_michael")
    default_lang = spec.get("lang", "en-us")
    default_speed = float(spec.get("speed", 1.0))

    os.makedirs(args.outdir, exist_ok=True)
    kokoro = Kokoro(args.model, args.voices)

    scenes = []
    total_frames = 0
    list_lines = []

    for scene in spec["scenes"]:
        scene_id = scene["id"]
        text = (scene.get("text") or "").strip()
        out_path = os.path.join(args.outdir, scene_id + ".wav")
        voice = scene.get("voice", default_voice)
        lang = scene.get("lang", default_lang)
        speed = float(scene.get("speed", default_speed))

        if text:
            samples, sample_rate = kokoro.create(text, voice=voice, speed=speed, lang=lang)
            seconds = write_wav(out_path, samples, sample_rate)
        else:
            sample_rate = 24000
            write_wav(out_path, np.zeros(int(sample_rate * min_seconds), dtype=np.float32), sample_rate)
            seconds = min_seconds

        seconds = pad_wav(out_path, sample_rate, min_seconds)
        frames = int(round((seconds + pad) * fps))
        total_frames += frames
        scenes.append({"id": scene_id, "seconds": round(seconds, 3), "frames": frames})
        list_lines.append("file '%s'" % os.path.abspath(out_path))
        print("%-18s %6.2fs  %5d frames" % (scene_id, seconds, frames), flush=True)

    manifest = {"fps": fps, "totalFrames": total_frames, "scenes": scenes}
    os.makedirs(os.path.dirname(args.manifest), exist_ok=True)
    with open(args.manifest, "w", encoding="utf-8") as handle:
        json.dump(manifest, handle, indent=2)
        handle.write("\n")

    with open(os.path.join(args.outdir, "list.txt"), "w", encoding="utf-8") as handle:
        handle.write("\n".join(list_lines) + "\n")

    print("total %d frames = %.2fs at %d fps" % (total_frames, total_frames / fps, fps))


if __name__ == "__main__":
    main()
