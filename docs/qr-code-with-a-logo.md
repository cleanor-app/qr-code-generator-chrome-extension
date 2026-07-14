# How do I put a logo in the middle of a QR code?

Open the Cleanor QR Code Generator Chrome extension, expand **Customize**, and click **Add image…** next to *Logo*. Pick any image file and it is drawn in the centre of the code, on a clean knockout panel, and the error-correction level is raised to High automatically so the code still scans.

The logo never leaves your machine. It is read locally with a `FileReader` and drawn onto the canvas in the popup, so an unreleased brand mark stays where you put it.

## Steps

1. Click the toolbar icon, or press `Alt+Shift+Q`.
2. Enter what the code should point at: a link, or any of the other content types (Wi-Fi, contact, event, and so on).
3. Open the **Customize** panel.
4. On the **Logo** row, click **Add image…** and choose a file. Any format your browser can display works: PNG, JPEG, SVG, WebP, GIF.
5. The preview redraws immediately with the logo in the middle. The hint under the code now reads `logo (ECC High)`.
6. **Download PNG**, **SVG**, **Copy** or **Print**.

To take it off again, click **Remove** on the same row. Error correction goes back to whatever you had selected.

## What happens under the hood

- **The logo occupies 26% of the code's width**, centred, with the image scaled to fit inside that box while preserving its aspect ratio. A tall logo and a wide logo both fit; neither gets squashed.
- **A knockout panel is painted behind it** in the background colour, with rounded corners and a small internal pad. This is what stops the logo from touching the surrounding modules and confusing a scanner.
- **Error correction jumps to High (30%)** for as long as a logo is set. The Reed-Solomon redundancy in a QR code is exactly what lets a scanner reconstruct the modules the logo is covering. This is not optional and the extension does not let you forget it.
- **The logo is embedded in the export.** The PNG is a flat raster with the logo composited in. The SVG carries the logo inline as a data URI, so the file is self-contained: no broken image when you move it into a design tool or upload it somewhere else.

## Keep it scannable

A logo is a hole punched in the data. High error correction covers the hole, but nothing covers carelessness, so:

- **Test the code before you print a thousand of them.** Scan it with a phone, in the light you expect people to scan it in, at the size you intend to print it.
- **Do not scale the logo up in an editor after export.** The 26% box is sized to stay inside what ECC High can repair. Enlarging it afterwards eats data modules the scanner needs.
- **Prefer a simple, high-contrast mark** over a detailed full-colour illustration. At 26% of a code printed on a business card, a wordmark is unreadable anyway.
- **Give the code a quiet zone.** The exports already include a four-module white margin. Do not crop it off in layout.

## Colours, modules and eyes

The same **Customize** panel controls everything else about how the code looks:

- **Fill**: a solid colour, or a two-colour gradient with an adjustable angle from 0 to 360 degrees.
- **Background**: any colour, with four presets (white, light grey, light blue, cream).
- **Modules**: Square, Rounded, or Dots.
- **Eyes**: the three finder patterns in the corners, square or rounded. They are drawn as whole units rather than as loose modules, which is what keeps them reliably detectable.
- **Templates**: eight one-click presets (Classic, Cleanor, Midnight, Ocean, Forest, Grape, Teal, Crimson), each already vetted to clear a 4:1 contrast ratio.

And a scan-safety check runs on every render: if the foreground-to-background contrast falls below 4:1, or the code comes out lighter than its background, the hint under the preview turns into a warning before you export something that will not scan. Your choices are remembered between sessions in local extension storage.

## Related

- [Make a QR code for a website](make-a-qr-code-for-a-website.md)
- [Create a Wi-Fi QR code](create-a-wifi-qr-code.md)
- [Make a vCard contact QR code](vcard-qr-code.md)
- The same generator on the web: [cleanor.app/tools/qr-code-generator](https://cleanor.app/tools/qr-code-generator)
- All Cleanor Chrome extensions: [cleanor.app/chrome](https://cleanor.app/chrome)
