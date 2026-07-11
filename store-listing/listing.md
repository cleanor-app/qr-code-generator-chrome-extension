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

Cleanor QR is a fast, private QR code generator that lives in your browser toolbar. It turns a web page, a link, your Wi-Fi, a contact card, an event, a location, or a short message into a scannable QR code — and it does all of it on your own device. Nothing you type is uploaded, there is no account to create, and there is no tracking.

THE FASTEST WAY: QR THE PAGE YOU ARE ON

Open the extension (click its icon, or press Alt+Shift+Q) and it immediately builds a QR code for the tab you are looking at. Point your phone at your screen and you have the same page open on mobile — no retyping a long address, no emailing yourself a link. It is the quickest way to move a page from your computer to your phone, hand a link to the person sitting across from you, or drop a URL onto a printed page.

RIGHT-CLICK ANYTHING

You do not have to open the popup to make a code. Right-click a link to get a QR for that link. Select some text — an address, a Wi-Fi password, a reference number — and right-click to encode exactly that. Or right-click anywhere on a page to encode the page itself. The result opens in a small window, ready to scan, download, or print.

EVERY KIND OF QR, FORMATTED CORRECTLY

A QR code is only useful if the phone that scans it knows what to do with it. Cleanor writes the right format for each type, so the scan actually triggers the right action instead of just showing raw text:

Wi-Fi. Enter your network name and password and share a code that guests scan to join, with no password read aloud or typed by hand. Useful for a café, an office guest network, a holiday rental, or a party.

Contact (vCard). Put your name, phone, email, company, and website into a code that adds you straight to someone's contacts. At home on a name badge, a business card, or the last slide of a talk.

Event. A title, start and end time, location, and notes become a code that adds the event to a calendar in one scan — good for invitations, posters, and tickets. All-day events are supported, and if you leave the end time blank a sensible one hour is assumed.

Location. A latitude and longitude become a code that opens the spot in a maps app. Put it on a venue flyer, a delivery note, or a "find us here" sign.

Email, Phone, and SMS. A code that opens a pre-filled email, dials a number, or starts a text message with your wording already in place — convenient for support signage, order forms, and printed contact details.

WhatsApp. Start a chat, optionally with a ready-made message, straight from a scan. Small businesses often place this on packaging and shopfronts.

Text or Link. Anything else — a plain note, a coupon code, a long URL.

If you paste an email address or a phone number into the text box, Cleanor notices and offers to switch to the matching type for you, so you never have to remember the underlying formats.

MAKE IT LOOK RIGHT, WITHOUT BREAKING THE SCAN

Start from a one-click style template, or set your own look. You can choose a solid color or a two-color gradient for the code, any background, square, rounded, or dotted modules, and rounded or square corner markers. You can place a logo in the middle; when you do, the error-correction level is raised automatically so the code still reads with part of it covered.

Design is where most QR codes quietly stop working — too little contrast, a code that ends up lighter than its background, colors a camera cannot tell apart. Cleanor watches for this and shows a plain warning the moment a choice would make the code hard to scan, so you can fix it before you print a hundred copies. Every built-in template is set up to keep enough contrast to scan reliably.

PRINT AND EXPORT

Download a sharp PNG at up to 1024 pixels, or export an SVG that stays crisp at any size — the right choice for print, signage, and packaging. A one-click Print button lays the code out centered on the page at a sensible physical size, with the link or a short label printed underneath. You can also copy the code straight to your clipboard and paste it into a document, a slide, or a chat. For difficult printing conditions, raise the error-correction level so the code survives smudges and scuffs.

PRIVATE BY DESIGN

Everything is generated on your device by a QR encoder bundled inside the extension, so it works offline and never sends what you type to a server. The extension asks for no access to the websites you visit. It reads the current tab's address only when you open it, and only to turn that one URL into a code. There is no account, no sign-in, no ads, and no analytics. Your preferences — size, colors, error-correction level — are stored locally so the tool opens the way you left it.

HOW IT WORKS

The extension encodes your content into a QR matrix locally, then draws it to a canvas for PNG and clipboard, or to a vector for SVG and print. Reading the current tab uses Chrome's activeTab permission, which is granted only when you open the extension and gives no standing access to any website. The right-click entries add the page, link, and selection actions. That is the full extent of what it touches.

WHO IT IS FOR

Anyone who needs to move something from a screen to a phone: sharing Wi-Fi with guests, handing over contact details, putting an event on a poster, adding a "scan to open" code to a document, printing a code for a product or a shop window, or simply getting a page open on a phone without typing.

COMMON QUESTIONS

Is anything uploaded? No. Every code is built on your own device, and it works offline.

Do I need an account? No. There is no sign-in and no subscription.

Will a colored code, or one with a logo, still scan? It will, as long as the contrast is good. The built-in check warns you when a choice is risky, and adding a logo raises the error correction automatically.

Can I use the codes commercially? Yes. The codes are static — the data lives inside the code itself — so they keep working with no account and nothing that can expire.

Prefer to work on the web, or need the same generator on another device? The same tool is available at cleanor.app/tools/qr-code-generator.

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

- [x] **Icon 128×128** (`icons/icon-128.png`) — the detailed Cleanor QR icon (blue tile, white QR + card). Toolbar sizes (16/32/48) use a simplified, legible QR-mark of the same brand.
- [x] **Screenshots 1280×800** (5) in `store-listing/png/screenshot-1..5.png` — (1) QR of the current page, (2) Wi-Fi, (3) Contact/vCard, (4) styled QR + Customize, (5) dark mode. 24-bit PNG, no alpha (CWS-ready).
- [ ] Small promo tile 440×280 (optional — not required to publish).

## Security review

Audited before submission: minimal permissions (`activeTab`, `contextMenus`, `clipboardWrite`, `storage`; no host permissions, no `<all_urls>`), zero remote code, zero network transmission of user data (all QR generation is on-device), strict CSP (`script-src 'self'`, no `unsafe-*`), the one HTML sink (print) escapes its caption, and no secrets are tracked in git (the signing key lives outside the repo, `*.pem`/`*.crx`/`*.zip` are gitignored). The "100% on device / nothing uploaded" claims match the code. No critical or warning-level issues.

## Submission steps

1. Build the zip: `./pack-crx.sh --zip-only`
2. Dev Dashboard → **New item** → upload `cleanor-qr-extension.zip`.
3. **Store listing** tab → paste Summary + Detailed description; upload icon + screenshots.
4. **Privacy practices** tab → paste the Single-purpose statement and each permission justification; set Data usage to **No data collected**; add the privacy policy URL.
5. **Submit for review.** Permissions are minimal (`activeTab`, `contextMenus`, `clipboardWrite`, `storage`; no `<all_urls>`), so review should be quick.
