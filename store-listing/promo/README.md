# Promo video

- `cleanor-qr-promo.mp4` — 1920×1080, ~30s, H.264/AAC. Intro + 5 feature scenes + CTA outro,
  STATIC scenes with crossfades (no zoom → no text jitter), ElevenLabs ("George") voiceover.
- Built from the Claude Design project **"Cleanor QR Store Graphics"** — same design system
  (Newsreader serif headline, SF Pro body, blue radial gradient, floating popup cards).
- `voiceover.mp3` — narration, ElevenLabs voice `JBFqnCBsd6RMkjVDRZzb` ("George"),
  model `eleven_multilingual_v2`. `script.txt` — the text.

## Sources
- `scenes.html` — the 7 video scenes (1920×1080) in the design system, reusing the popup assets
  in `../design-assets/` (referenced as `qr/*.png` at render time).
- `render.mjs` — Playwright screenshots each scene → `scene-*.png` (run where playwright + sharp
  resolve, e.g. `cleanor-web`; Newsreader loads from Google Fonts).

## Rebuild
1. Voiceover: ElevenLabs TTS, George voice. Key from `~/Developer/Job/meta-ua-copilot/.env`.
2. Put the design assets in a `qr/` subfolder next to `scenes.html` (icon-128, popup-*, qr-hero),
   then render: `node render.mjs` → `scene-intro / scene-ss1..5 / scene-outro` (1920×1080).
3. `python3 build-video.py` → assembles static scenes + voiceover via ffmpeg (no zoompan = no jitter).
   Durations sum 33.65; after 6×0.6s crossfades → 30.05s ≈ voiceover.
