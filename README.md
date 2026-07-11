# Cleanor QR Code Generator — Chrome extension

**Make a QR code for the current page, any link, or selected text — then scan it with your phone.** Everything runs locally in your browser: **nothing is uploaded, no account, no tracking.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/manifest-v3-34a853.svg)](manifest.json)
[![Try on the web](https://img.shields.io/badge/or%20use%20it%20online-cleanor.app%2Ftools-0a7cff.svg)](https://cleanor.app/tools/qr-code-generator)

> 🔒 A privacy-first companion to the free tools at **[cleanor.app/tools](https://cleanor.app/tools)**. Same QR engine, in your toolbar.

## Features

- **QR this page** — click the toolbar icon (or press `Alt+Shift+Q`) and the popup instantly makes a QR of the current tab. Scan it to open the page on your phone.
- **Right-click** a link → "QR code for this link"; select text → "QR code for this selection"; or right-click the page.
- **Content types** — Text/Link, **Wi-Fi**, **Email**, **Phone**, **SMS**, **Contact (vCard)**, **WhatsApp**, **Location** and **Event**, each formatted into the correct payload (`WIFI:`, `mailto:`, `tel:`, `SMSTO:`, `BEGIN:VCARD`, `wa.me`, `geo:`, `BEGIN:VEVENT`). Paste an email/phone into the text box and it offers to switch type.
- **Style templates** — 8 one-click presets (Classic, Cleanor, Midnight, Ocean, Forest, Grape, Teal, Crimson), each vetted to clear a 4:1 contrast ratio.
- **Custom styling** — solid or two-color gradient foreground, any background, module style (Square / Rounded / Dots), rounded or square eyes, and a center logo (auto-bumps error correction to High). A live scan-safety check (contrast ≥ 4:1, no inversion) warns before you export something that won't scan.
- **Crisp output** — the on-screen preview is oversampled and downscaled (never blurry), and exports use integer module sizing so PNG/SVG are pixel-sharp.
- **Download PNG or SVG**, copy to clipboard, or **print** a centered, vector-crisp QR with a caption.
- **Adjustable** error-correction level (L/M/Q/H) and export size (128–1024 px).
- **100% local** — the QR is generated on your device by a bundled encoder. Nothing is ever uploaded.

## How it works

The popup encodes your text into a QR matrix with a vendored, dependency-free encoder
(`vendor/qr/qr-core.js`) — the exact same engine that powers
[cleanor.app/tools/qr-code-generator](https://cleanor.app/tools/qr-code-generator) — and
draws it to a `<canvas>` for PNG/clipboard, or to an `<svg>` for vector download. No network
request is ever made to generate a code.

### Permissions

- `contextMenus` — the right-click entries on links, selections and pages.
- `activeTab` — read the **current** tab's URL when you open the popup, so "QR this page" works. No standing access to any site.
- `clipboardWrite` — only when you click "Copy", to place the QR image on the clipboard.
- `storage` — remembers your preferred error-correction level and export size, and briefly hands a right-clicked link/selection to the popup. No personal data; nothing synced or sent.
- No host permissions, no tabs history, no analytics.

## Build the store zip / signed CRX

```bash
./pack-crx.sh            # zip + signed crx (once a signing key exists — see the image extension's SIGNING.md)
./pack-crx.sh --zip-only # just the zip
```

## Regenerating the QR engine

`vendor/qr/qr-core.js` is transpiled from the site's TypeScript source so the two stay in
lock-step. To refresh it after the site's encoder changes:

```bash
cd ../cleanor-web
./node_modules/.bin/esbuild src/lib/browser-qr-tools.ts --format=esm --target=es2020 \
  --outfile=../cleanor-qr-extension/vendor/qr/qr-core.js
```

## License

[MIT](LICENSE) © Cleanor Labs. More at [cleanor.app/tools](https://cleanor.app/tools).
