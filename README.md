# video-rotational-power

A 2 to 3 minute narrated explainer deriving **P = τ ω** from absolute basics.

- Remotion + TypeScript, 1920x1080, 30 fps.
- Narration: Kokoro-82M, voice `am_michael`, written in `narration.json`.
- `scripts/tts_kokoro.py` speaks each scene and writes `src/manifest.json` from the measured
  audio, so every scene's length comes from the voice rather than a hand-typed number.
- `scripts/qa.py` probes the render, measures audio level, and pulls one frame per scene.
- Render happens on GitHub Actions (`.github/workflows/render.yml`); the artifact is `video`.

Local:

```bash
npm ci
python3 scripts/tts_kokoro.py --model kokoro-v1.0.onnx --voices voices-v1.0.bin
npx remotion render src/index.ts Video out/video.mp4
```
