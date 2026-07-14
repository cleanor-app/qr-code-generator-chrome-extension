# QR Code Generator Chrome Extension: page, Wi-Fi, contact, link

**A QR code generator for Chrome. Turn the page you are on, a Wi-Fi network, a contact card or any link into a scannable code, made on your device.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/manifest-v3-34a853.svg)](manifest.json)
[![Chrome Web Store](https://img.shields.io/badge/chrome%20web%20store-install-4285f4.svg)](https://chromewebstore.google.com/detail/cleanor-qr-code-generator/bhcaomekbmdkdpiokfbhigjkadonglno)
[![Try on the web](https://img.shields.io/badge/or%20use%20it%20online-cleanor.app%2Ftools-0a7cff.svg)](https://cleanor.app/tools/qr-code-generator)

Nothing you type is uploaded. There is no account, no tracking and no server round-trip: the QR
matrix is computed in the popup by a bundled, dependency-free encoder. A Wi-Fi QR code carries your
password in plain text and a contact QR code carries your phone number, which is a good reason to
make both of them on your own machine.

## Install

**From the Chrome Web Store:** [Cleanor QR Code Generator](https://chromewebstore.google.com/detail/cleanor-qr-code-generator/bhcaomekbmdkdpiokfbhigjkadonglno)

**From source (unpacked):**

```bash
git clone https://github.com/cleanor-app/qr-code-generator-chrome-extension.git
```

Open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and select the cloned
folder. It is a plain Manifest V3 extension, so any Chromium browser will load it (Chrome, Edge,
Brave, Opera, Arc, Vivaldi).

## Quick start

1. Click the toolbar icon, or press `Alt+Shift+Q`.
2. The popup opens with a QR code of the tab you are on, already drawn. Scan it with your phone.
3. Or pick another content type (Wi-Fi, Contact, Event and so on), or paste anything into the text box.
4. **Download PNG**, **SVG**, **Copy**, or **Print**.

You can skip the popup entirely: right-click a link for **QR code for this link**, right-click a
selection for **QR code for "…"**, or right-click the page for **QR code for this page**. Each opens a
small window with the code ready to scan.

## QR code for the current page

The popup reads the active tab's URL when you open it and encodes it straight away, tagged "This
page". No copy, no paste, no retyping a long address into a phone. It is the fastest way to move a
page from a laptop to a phone, or to hand a link to the person sitting opposite you. The URL is read
through `activeTab`, only at the moment you open the popup, so the extension has no standing access to
the sites you browse.

Downloads are named after the site (`example.com-cleanor-qr.png`), not `download (3).png`.

→ [Make a QR code for a website](docs/make-a-qr-code-for-a-website.md)

## Wi-Fi QR code

Enter the network name (SSID), the password and the security type (`WPA/WPA2`, `WEP` or `None`) and
share a code that guests scan to join, with no password read out loud. The extension writes the
standard `WIFI:` payload and escapes the characters that would otherwise break it (`\ ; , : "`), so a
password full of punctuation still encodes correctly. Because the code is built locally, the password
never leaves your computer.

The **Print** sheet captions the code with `Wi-Fi: <your SSID>`, which is the difference between a
guest scanning it and ignoring a mystery square on the wall.

→ [Create a Wi-Fi QR code](docs/create-a-wifi-qr-code.md)

## Contact (vCard) QR code

Name, phone, email, organization and website become a vCard 3.0 record, so a scan offers to add you to
the phone's address book instead of showing raw text. The name is split into a display `FN` and a
structured `N` field automatically, and `\ ; ,` are escaped in every field.

→ [Make a vCard contact QR code](docs/vcard-qr-code.md)

## QR code with a logo, colours and shapes

Eight one-click templates (Classic, Cleanor, Midnight, Ocean, Forest, Grape, Teal, Crimson), each
vetted to clear a 4:1 contrast ratio. Under **Customize**: a solid or two-colour gradient foreground
with an adjustable angle, any background, Square / Rounded / Dots modules, square or rounded eyes, and
a centre logo.

Add a logo and the extension places it on a knockout panel sized to 26% of the code and **raises error
correction to High (30%)** automatically, because that redundancy is what lets a scanner rebuild the
modules the logo covers. A live scan-safety check warns you before you export something that will not
scan: it flags a foreground-to-background contrast below 4:1, and any code that is lighter than its
background.

→ [Put a logo in the middle of a QR code](docs/qr-code-with-a-logo.md)

## Every content type

Each one is written in the format the scanning phone expects, so the scan triggers the right action
instead of showing raw text:

| Type | Payload |
| --- | --- |
| Text / Link | the text as-is |
| Wi-Fi | `WIFI:T:WPA;S:…;P:…;;` |
| Email | `mailto:` with an optional subject and body |
| Phone | `tel:` |
| SMS | `SMSTO:number:message` |
| Contact | `BEGIN:VCARD` (vCard 3.0) |
| WhatsApp | `https://wa.me/…` with an optional pre-filled message |
| Location | `geo:lat,lon` |
| Event | `BEGIN:VEVENT` (iCalendar, all-day supported) |

Paste an email address or a phone number into the text box and the popup offers to switch you to the
matching type.

## Export

- **PNG** from 128 px to 1024 px (default 512 px), with integer module sizing so the pixels stay sharp.
- **SVG**, vector, with any logo embedded as a data URI so the file is self-contained.
- **Copy** the PNG to the clipboard.
- **Print** a centred, vector-crisp 60 mm code with a caption.
- Error correction **L / M / Q / H**, forced to H while a logo is set.

The on-screen preview is oversampled and downscaled rather than upscaled, which is why it never looks
blurry.

## Docs

| Doc | What it answers |
| --- | --- |
| [Make a QR code for a website](docs/make-a-qr-code-for-a-website.md) | How do I make a QR code for a website, or for the page I am on? |
| [Create a Wi-Fi QR code](docs/create-a-wifi-qr-code.md) | How do I create a Wi-Fi QR code guests can scan to join? |
| [Put a logo in the middle of a QR code](docs/qr-code-with-a-logo.md) | How do I put a logo in a QR code and keep it scannable? |
| [Make a vCard contact QR code](docs/vcard-qr-code.md) | How do I make a contact (vCard) QR code? |

## Capacity table

[`data/qr-capacity.csv`](data/qr-capacity.csv) is the **byte-mode** character capacity of the encoder
in this repo, which is the mode URLs, Wi-Fi strings and vCards actually use: 160 rows, every QR version
(1 to 40) against every error-correction level (L, M, Q, H).

| version | modules | ecc | byte_chars |
| --- | --- | --- | --- |
| 1 | 21 | L | 17 |
| 1 | 21 | H | 7 |
| 10 | 57 | M | 213 |
| 40 | 177 | L | 2953 |
| 40 | 177 | H | 1273 |

Every number was generated by running `vendor/qr/qr-core.js` against inputs of growing length and
reading the version off the result, not copied from a published table. Cross-checked against the
ISO/IEC 18004 byte-mode figures at 12 cells (versions 1, 2 and 40 at all four ECC levels): all 12 match.

This engine implements byte mode only. Digits are therefore encoded at 8 bits per character rather than
the 3.33 bits per character that the standard's numeric mode uses, so a digits-only payload needs a
larger QR version here than a numeric-mode encoder would need for the same input: 17 digits at version
1 level L, where the standard's numeric mode fits 41. That is why this table is shorter than a
published ISO capacity table, and it is the number to trust for codes this extension produces.

## How it works

The popup encodes your text into a QR matrix with a vendored, dependency-free encoder
(`vendor/qr/qr-core.js`), the same engine that powers
[cleanor.app/tools/qr-code-generator](https://cleanor.app/tools/qr-code-generator), and draws it to a
`<canvas>` for PNG and clipboard, or to an `<svg>` for vector download and print. No network request
is ever made to generate a code.

### Permissions

- `contextMenus`, the right-click entries on links, selections and pages.
- `activeTab`, reads the **current** tab's URL when you open the popup, so "QR this page" works. No standing access to any site.
- `clipboardWrite`, only when you click **Copy**, to put the QR image on the clipboard.
- `storage`, remembers your style, error-correction level and export size, and briefly hands a right-clicked link or selection to the popup. Local, nothing synced or sent.
- No host permissions, no browsing history, no analytics.

## FAQ

### Is this QR code generator free?

Yes, and it is MIT-licensed open source. There is no paid tier, no watermark on the codes, no sign-up
and no scan limit. The same generator also runs free in any browser at
[cleanor.app/tools/qr-code-generator](https://cleanor.app/tools/qr-code-generator).

### Do the QR codes expire?

No. Every code this extension makes is static: the URL, Wi-Fi password or contact card is encoded
directly into the pattern, so there is no redirect through anyone's server that could be switched off
and no subscription that could lapse. The flip side is that a printed code's destination cannot be
changed later. If you may need to repoint it, encode a URL on a domain you control and redirect it
server-side.

### Does the extension upload what I type?

No. The QR matrix is computed inside the popup by a vendored encoder (`vendor/qr/qr-core.js`) and drawn
to a canvas or an SVG. No network request is made to generate a code, so your Wi-Fi password, phone
number and contact details stay on your machine. The only outbound links are the cleanor.app links in
the footer, and only if you click them.

### Can I put my logo in the middle of the code?

Yes. Open **Customize**, click **Add image…** on the Logo row and pick any image file. The logo is drawn
on a knockout panel at 26% of the code's width, and error correction is raised to High (30%) for as long
as the logo is set, which is what keeps the code readable. Test the scan before you print in volume.

### Will a coloured QR code still scan?

It depends on contrast, and the extension checks it for you on every render. Scanners need dark modules
on a light background: if your colours fall below a 4:1 contrast ratio, or the code ends up lighter than
its background, a warning appears under the preview before you export. All eight built-in templates
already clear that bar.

### What file formats can I export?

PNG (128 px to 1024 px) and SVG. Use PNG for a screen, a slide or a chat, and SVG for anything that gets
printed, since vector stays sharp at any physical size. There is also a **Copy** button that puts the PNG
on the clipboard, and a **Print** button that prints a vector code at 60 mm with a caption.

### Does it work in Edge, Brave and Opera?

Yes. It is a standard Manifest V3 extension using only the extension platform APIs, so any Chromium
browser can run it. Install from the Chrome Web Store, or clone the repo and use **Load unpacked**.

## Build the store zip / signed CRX

```bash
./pack-crx.sh            # zip + signed crx (once a signing key exists)
./pack-crx.sh --zip-only # just the zip
```

## Regenerating the QR engine

`vendor/qr/qr-core.js` is transpiled from the site's TypeScript source so the extension and the web tool
stay in lock-step. To refresh it after the site's encoder changes:

```bash
cd ../cleanor-web
./node_modules/.bin/esbuild src/lib/browser-qr-tools.ts --format=esm --target=es2020 \
  --outfile=../Chrome/002-qr-code-generator/vendor/qr/qr-core.js
```

## Related projects

More from Cleanor Labs, same principle: the file, the password or the image stays on your device.

| Project | What it is |
| --- | --- |
| [image-compressor-chrome-extension](https://github.com/cleanor-app/image-compressor-chrome-extension) | Compress and convert images in Chrome (WebP, AVIF, HEIC), right-click to save, full-page screenshots |
| [gif-compressor-chrome-extension](https://github.com/cleanor-app/gif-compressor-chrome-extension) | Compress, crop and convert GIFs in the browser |
| [figma-image-compressor](https://github.com/cleanor-app/figma-image-compressor) | Figma plugin that compresses the images inside a file |
| [wordpress-image-optimizer](https://github.com/cleanor-app/wordpress-image-optimizer) | WordPress plugin: bulk optimize, convert to WebP/AVIF, clean up the media library |
| [browser-image-tools](https://github.com/cleanor-app/browser-image-tools) | The zero-dependency image library behind the tools |
| [cleanor-mcp](https://github.com/cleanor-app/cleanor-mcp) | MCP server giving AI agents image, QR and dev utilities |

## License

[MIT](LICENSE) © Cleanor Labs. More at [cleanor.app/chrome](https://cleanor.app/chrome) and
[cleanor.app/tools](https://cleanor.app/tools).
