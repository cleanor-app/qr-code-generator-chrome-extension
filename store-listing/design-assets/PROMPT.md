# Prompt for Claude Design — Chrome Web Store screenshots (Cleanor QR)

Paste the block below into Claude Design and attach the assets in this folder.

---

Design **5 Chrome Web Store screenshots** for a browser extension called **Cleanor QR Code Generator**.

**Output:** 5 images, **1280 × 800 px** each, 24-bit PNG, **no alpha**. They must read as **one cohesive, premium set** and stay legible as small thumbnails.

**Brand system (use exactly — see BRAND.md):**
- Primary blue `#4576FD`; hero background = radial gradient `#5A83FF` (center) → `#4576FD` (edge).
- Ink `#1C2434`, muted `#5B6B86`; light surfaces `#FFFFFF / #F6F8FC / #EEF3FF`; light-blue-on-blue `#D7E2FF`.
- One slide uses a **deep navy** background (`#0F1524 → #1B2740`) with light text.
- Headline font: an **elegant serif** (Newsreader / Apple "New York"), weight 600–700.
- Body font: clean **sans** (SF Pro / Helvetica Neue), weight 500.
- Large soft shadows, generous whitespace, rounded cards (~24px), calm and premium.

**Layout template (keep consistent across all 5):**
- A bold benefit **HEADLINE** (serif) + a one-line **SUBHEAD** (sans) on one side; the **product UI** as a floating rounded card with a soft shadow on the other side.
- **Alternate** the text side (left / right) across slides for rhythm.
- 80px safe margins. Text must **never overlap** the UI. Nothing critical near the edges.
- **Use the provided popup PNGs as the UI — do not redraw the interface.** Show them large as the hero. You may add a subtle frame/shadow, or place them in a minimal browser/device frame, but keep the real UI dominant and unobstructed.
- Optional accents: `qr-hero.png` (a styled QR in a white card), `icon-128.png`, or `qr-vector.svg` (recolorable). Use sparingly.

**The 5 screenshots — use this exact copy (do not add keywords, claims, or metrics):**

1. **`popup-page.png`** — Headline: *Turn any page into a QR code* · Subhead: *One click from your toolbar — scan it to open the page on your phone.*
2. **`popup-wifi.png`** — Headline: *Share Wi-Fi in a scan* · Subhead: *Guests join your network without typing a password.*
3. **`popup-contact.png`** — Headline: *Contacts, events, locations & more* · Subhead: *Nine content types, each formatted so the scan does the right thing.*
4. **`popup-style.png`** — Headline: *Make it yours — and still scannable* · Subhead: *Colors, gradients, and a logo, with a live scan-safety check.*
5. **`popup-dark.png`** — (use the **deep navy** background) Headline: *Private by design* · Subhead: *Everything runs on your device. Nothing is uploaded.*

**Rules:**
- One visual system across all five: same type scale, same background family, same shadow language.
- Legible at ~320px-wide thumbnails: headline ≈ 44–56px, high contrast.
- No fake testimonials, no invented numbers, no "best / #1" language.
- Deliver 1280×800 PNG, 24-bit, no alpha (Chrome Web Store requirement).

---

## Assets in this folder
- `popup-page.png`, `popup-wifi.png`, `popup-contact.png`, `popup-style.png`, `popup-dark.png` — **real UI**, high-res, transparent rounded corners (drop-in cards).
- `qr-hero.png` — styled Cleanor-gradient QR on a white card (optional hero accent).
- `qr-vector.svg` — recolorable QR (dark on white) if you want to tint it to brand blue.
- `icon-128.png` — the app icon.
- `BRAND.md` — the exact color + type tokens.
