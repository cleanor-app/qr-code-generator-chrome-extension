# How do I make a QR code for a website?

To make a QR code for a website, open the Cleanor QR Code Generator Chrome extension while you are on the page: it reads the current tab's URL and shows the QR code immediately, with no typing at all. Point your phone camera at the screen and the page opens on the phone.

If you want a code for a *different* link than the one you are on, paste the URL into the **Text** box, or right-click the link on the page and choose **QR code for this link**.

## Three ways to get there

**1. The page you are on.** Click the toolbar icon or press `Alt+Shift+Q`. The popup opens with the current tab's URL already filled in and a small "This page" tag next to the title. The URL is only read when you open the popup: the extension holds `activeTab`, not standing access to every site you visit.

**2. Right-click.** The extension adds three context-menu entries:

| Where you right-click | Menu entry | What gets encoded |
| --- | --- | --- |
| A link | QR code for this link | The link's target URL |
| Selected text | QR code for "…" | Exactly the text you selected |
| Anywhere on the page | QR code for this page | The page's URL |

Any of them opens a small window with the code ready to scan, download or print.

**3. Type or paste.** Open the popup, clear the box, and paste any URL or plain text. The preview redraws as you type.

## Then export it

- **Download PNG** produces a raster image at the size set in *Customize → Advanced* (128 px to 1024 px, default 512 px). The file is named after the site, so a code for `https://example.com/pricing` saves as `example.com-cleanor-qr.png`, not `download (3).png`.
- **SVG** is vector, so it stays sharp at any size. This is the one to use for anything that will be printed: a poster, a flyer, a menu, a slide.
- **Copy** puts the PNG straight on your clipboard, ready to paste into a doc, a deck, or a chat.
- **Print** opens a print sheet with a 60 mm vector QR code and the URL as a caption underneath it.

## Make it fit your brand

Eight one-click templates sit under the preview (Classic, Cleanor, Midnight, Ocean, Forest, Grape, Teal, Crimson). Open **Customize** for full control: a solid or two-colour gradient foreground, any background colour, square, rounded or dot modules, and square or rounded eyes. See [Put a logo in the middle of a QR code](qr-code-with-a-logo.md) for the logo.

Whatever you pick, the extension checks that the code will still scan. If the foreground-to-background contrast drops below 4:1, or the code ends up lighter than its background, a warning replaces the version info under the preview. Scanners need dark on light, and a beautiful QR code that nothing can read is not a QR code.

## Things to know about URL QR codes

**These are static codes.** The URL is baked into the pattern itself. There is no redirect through a shortener, no tracking pixel, and nobody counts the scans, which also means the destination cannot be changed after the code is printed. If a campaign might need a new destination later, encode a URL on a domain you control and redirect it server-side.

**Long URLs make denser codes.** Every extra character adds modules. Tracking parameters (`?utm_source=...&fbclid=...`) can easily double the length of a link, and a denser code needs a bigger print or a steadier hand to scan. Trim the URL before you encode it.

**Error correction is a trade-off.** Low (7%) keeps the code sparse and easy to scan; High (30%) survives scuffs, folds, and a logo covering the middle, at the cost of more modules. Medium (15%) is the default and is right for most links. Set it in *Customize → Advanced*.

## Related

- [Create a Wi-Fi QR code](create-a-wifi-qr-code.md)
- [Put a logo in the middle of a QR code](qr-code-with-a-logo.md)
- [Make a vCard contact QR code](vcard-qr-code.md)
- The same generator on the web: [cleanor.app/tools/qr-code-generator](https://cleanor.app/tools/qr-code-generator)
- All Cleanor Chrome extensions: [cleanor.app/chrome](https://cleanor.app/chrome)
