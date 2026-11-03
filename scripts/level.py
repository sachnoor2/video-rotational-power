"""Level the finished mix to the QA window, measured on the render itself.

The rendered AAC track sits a few dB below the source WAVs, so the gain is
computed from what ffmpeg actually measures on out/video.mp4 rather than assumed.
Video is stream-copied; only the audio is re-encoded, so nothing drifts.
"""
import os
import re
import subprocess
import sys

TARGET_MEAN_DB = -18.0
CEILING_DB = -1.2


def measure(path):
    result = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path, "-af", "volumedetect", "-f", "null", "-"],
        capture_output=True,
        text=True,
    )
    text = result.stderr or ""
    mean = re.search(r"mean_volume:\s*(-?[\d.]+) dB", text)
    peak = re.search(r"max_volume:\s*(-?[\d.]+) dB", text)
    return (
        float(mean.group(1)) if mean else None,
        float(peak.group(1)) if peak else None,
    )


def main():
    src = "out/video.mp4"
    mean, peak = measure(src)
    if mean is None or peak is None:
        sys.exit("could not measure the audio track")

    gain = TARGET_MEAN_DB - mean
    gain = min(gain, CEILING_DB - peak)
    gain = round(gain, 2)
    print("measured mean %.1f dB, peak %.1f dB, applying %.2f dB" % (mean, peak, gain))

    if abs(gain) < 0.1:
        print("already inside the window, nothing to do")
        return

    tmp = "out/video_level.mp4"
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-i", src,
            "-c:v", "copy",
            "-af", "volume=%.2fdB" % gain,
            "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
            tmp,
        ],
        check=True,
    )
    os.replace(tmp, src)

    mean2, peak2 = measure(src)
    print("after: mean %.1f dB, peak %.1f dB" % (mean2 or 0, peak2 or 0))


if __name__ == "__main__":
    main()
