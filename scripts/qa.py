"""QA gate: probe the MP4, measure the audio, and pull one frame per scene.

Writes out/qa/qa.json and out/qa/<scene>.jpg so the frames can be inspected.
"""
import json
import os
import re
import subprocess


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def main():
    with open("src/manifest.json", "r", encoding="utf-8") as handle:
        manifest = json.load(handle)
    fps = manifest["fps"]

    os.makedirs("out/qa", exist_ok=True)

    start = 0.0
    midpoints = []
    for scene in manifest["scenes"]:
        length = scene["frames"] / float(fps)
        midpoints.append((scene["id"], start + length / 2.0))
        start += length

    for scene_id, at in midpoints:
        run(
            [
                "ffmpeg",
                "-loglevel",
                "error",
                "-ss",
                "%.3f" % at,
                "-i",
                "out/video.mp4",
                "-frames:v",
                "1",
                "-q:v",
                "2",
                "-y",
                os.path.join("out/qa", scene_id + ".jpg"),
            ]
        )

    probe = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "stream=codec_type,codec_name,width,height,r_frame_rate",
            "-show_entries",
            "format=duration,size",
            "-of",
            "json",
            "out/video.mp4",
        ]
    )
    info = json.loads(probe.stdout or "{}")

    vol = run(["ffmpeg", "-hide_banner", "-i", "out/video.mp4", "-af", "volumedetect", "-f", "null", "-"])
    text = vol.stderr or ""
    mean = re.search(r"mean_volume:\s*(-?[\d.]+) dB", text)
    peak = re.search(r"max_volume:\s*(-?[\d.]+) dB", text)

    duration = float(info.get("format", {}).get("duration", 0.0))
    expected = manifest["totalFrames"] / float(fps)
    report = {
        "streams": info.get("streams", []),
        "size_bytes": int(info.get("format", {}).get("size", 0)),
        "duration_seconds": round(duration, 3),
        "expected_seconds": round(expected, 3),
        "drift_seconds": round(duration - expected, 3),
        "mean_volume_db": float(mean.group(1)) if mean else None,
        "max_volume_db": float(peak.group(1)) if peak else None,
        "scenes": len(manifest["scenes"]),
        "frames": {scene_id: round(at, 2) for scene_id, at in midpoints},
    }

    with open("out/qa/qa.json", "w", encoding="utf-8") as handle:
        json.dump(report, handle, indent=2)
        handle.write("\n")

    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
