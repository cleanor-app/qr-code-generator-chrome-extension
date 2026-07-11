# Chrome Web Store — listing copy & submission checklist

New item (first publish). Upload the plain **`cleanor-qr-extension.zip`** (Verified CRX Uploads
is not enabled yet; enable it after the first release if desired — see the image extension's
SIGNING.md).

## Basics

- **Name (from manifest):** Cleanor QR Code Generator: Page, Link & Text to QR
- **Summary (≤132):** QR codes for a page, Wi-Fi, contact, event, location, WhatsApp & more. Colors, logo, print. On your device.
- **Category:** Productivity
- **Language:** English

## Detailed description

Cleanor QR turns anything in your browser into a QR code, right from the toolbar — and everything happens on your own device. No upload, no account, no tracking.

WHAT YOU CAN DO

QR the page you are on
Click the Cleanor QR icon (or press Alt+Shift+Q) and it instantly builds a QR code for the current tab. Scan it with your phone to open the same page on mobile — no typing a long URL, no sending yourself a link.

Right-click anything
Right-click a link to get a QR code for that link, select some text and right-click to encode it (a Wi-Fi password, an address, a note), or right-click the page itself. The QR opens in a small window, ready to scan or save.

Built-in formats, done right
Switch between Text/Link, Wi-Fi, Email, Phone, SMS, Contact, WhatsApp, Location and Event. Cleanor fills in the correct QR format for you: share your Wi-Fi so guests join without typing a password, make a scannable contact card (vCard), drop a map location, start a WhatsApp chat, or a code that adds an event to the calendar, opens a pre-filled email, dials a number, or sends a text. Paste an email or phone number into the text box and Cleanor even offers to switch to the right type for you.

Print in one click
Send a clean, centered QR straight to your printer — vector-crisp at any size, with the link or label printed underneath. Great for flyers, table tents, packaging and posters.

Beautiful, and still scannable
One-click style templates (Classic, Cleanor, Midnight, Ocean, Forest, Grape, Teal, Crimson) — each vetted to keep enough contrast to scan. Or customize your own: solid color or a two-color gradient, any background, module style (Square / Rounded / Dots), rounded or square scan "eyes", and a logo in the middle (error correction jumps to High automatically so it still reads). A live scan-safety check warns you the moment a color choice would be hard to scan.

Save it your way
Download a crisp PNG at up to 1024 px, export a scalable SVG for print, or copy the QR straight to your clipboard to paste into a document, slide, or chat. Choose the error-correction level (Low to High) for damaged-print resilience.

WHY CHOOSE CLEANOR QR

100% on device
Your text never leaves your browser. The QR is generated locally by a bundled encoder, so it works offline and is safe for private or client work.

Private by default
Cleanor QR asks for no access to your websites. It reads only the current tab's address when you open it, and only to encode that URL.

Fast and free
No sign in, no ads, no tracking. It remembers your preferred size and error-correction level between uses.

Prefer to work on the web, or need more tools? Visit cleanor.app/tools — the same privacy-first toolkit, right in your browser.

## Single-purpose statement (required)

Cleanor QR Code Generator has a single purpose: to generate a QR code locally in the browser from the current page's URL, a right-clicked link or selection, or content the user enters (text, Wi-Fi, email, phone, SMS, contact, WhatsApp, location or event), without uploading anything.

## Permissions justification

- **`contextMenus`** — adds the right-click entries: "QR code for this page/link/selection". Not a sensitive permission.
- **`activeTab`** — granted only when the user opens the popup (a user gesture). Lets the extension read the current tab's URL so "QR this page" can encode it. No standing access to any site; no host permissions.
- **`clipboardWrite`** — used only when the user clicks "Copy", to place the generated QR image on the clipboard.
- **`storage`** — stores the user's own UI preferences (error-correction level, export size) via `chrome.storage.local`, plus a brief hand-off of a right-clicked link/selection to the popup window. No personal data; nothing is synced or sent anywhere.
- No cookies, browsing history, host permissions, or analytics are accessed. All QR generation happens on-device.

## Data usage disclosures (Privacy tab)

- Does this item collect or use user data? **No.**
- All categories **unchecked / "not collected".**
- **Privacy policy URL:** https://cleanor.app/privacy
- Certify compliance with the Developer Program Policies: **yes.**

## Assets checklist

- [ ] **Icon 128×128** — ⚠️ currently the shared Cleanor-blue app icon is a placeholder copied from the image extension. **Make a QR-specific 128px icon before publishing** so the store listing is visually distinct.
- [ ] Screenshots 1280×800 (min 1, up to 5): popup "QR this page", right-click menu, typed text + SVG/PNG buttons, copied-to-clipboard state, dark mode.
- [ ] Small promo tile 440×280 (optional).

## Submission steps

1. Build the zip: `./pack-crx.sh --zip-only`
2. Dev Dashboard → **New item** → upload `cleanor-qr-extension.zip`.
3. **Store listing** tab → paste Summary + Detailed description; upload icon + screenshots.
4. **Privacy practices** tab → paste the Single-purpose statement and each permission justification; set Data usage to **No data collected**; add the privacy policy URL.
5. **Submit for review.** Permissions are minimal (`activeTab`, `contextMenus`, `clipboardWrite`, `storage`; no `<all_urls>`), so review should be quick.
