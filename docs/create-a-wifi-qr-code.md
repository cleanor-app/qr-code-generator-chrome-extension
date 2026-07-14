# How do I create a Wi-Fi QR code?

To create a Wi-Fi QR code, open the Cleanor QR Code Generator Chrome extension, click the **Wi-Fi** tab, type your network name (SSID) and password, pick the security type, and download or print the code. Guests scan it with a phone camera and join the network without anyone reading the password out loud.

Everything is encoded on your own device by a bundled QR encoder. Your Wi-Fi password is never sent to a server, which matters more here than for any other QR type: a Wi-Fi code contains the password in plain text, so a website that generates one for you has seen it.

## Steps

1. Install the extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/cleanor-qr-code-generator/bhcaomekbmdkdpiokfbhigjkadonglno).
2. Click the toolbar icon, or press `Alt+Shift+Q`.
3. Click the **Wi-Fi** pill in the row of content types.
4. Fill in **Network name (SSID)** and **Password**.
5. Choose the **Security** type: `WPA/WPA2` (the default, and what almost every home and office router uses), `WEP` (legacy), or `None` for an open network. Picking **None** drops the password from the code entirely.
6. The preview updates as you type. Then **Download PNG**, **SVG**, **Copy**, or **Print**.

## What the code actually contains

The extension writes the standard `WIFI:` payload that phone cameras and QR scanners recognise as a "join this network" request:

```
WIFI:T:WPA;S:MyNetwork;P:hunter2;;
```

An open network omits the password:

```
WIFI:T:nopass;S:MyNetwork;;
```

Characters that have a meaning inside that format (`\`, `;`, `,`, `:` and `"`) are escaped with a backslash, so a password full of punctuation still encodes correctly. Nothing is trimmed or "simplified" behind your back.

Note that a Wi-Fi QR code is not encrypted. Anyone who can scan or photograph the printed code can read the password out of it. Put it where you want guests to have the network, not on the street-facing window.

## Printing it for guests

The **Print** button opens a print sheet rendered from vector SVG, so the code is crisp at any physical size instead of a stretched bitmap. The sheet prints a 60 mm QR code centred on the page with the caption `Wi-Fi: <your SSID>` underneath, which is the difference between a guest knowing what the code is for and ignoring a mystery square on the wall.

If you would rather design the card yourself, download the **SVG** and place it in whatever layout tool you use. Vector means it stays sharp on an A4 poster and on a business-card-sized tent card alike.

## Tips for a code that always scans

- Leave **Error correction** at **Medium (15%)** for a screen or a clean printed card. Raise it to **Quartile** or **High** in *Customize → Advanced* if the code will be laminated, put behind glass, or printed small on a card that will get handled.
- Keep the code dark on light. If you recolour it, the extension checks the contrast for you and shows a warning under the preview when the foreground-to-background ratio drops below 4:1, or when the code is lighter than its background. Most scanners need dark modules on a light background.
- Export size runs from 128 px to 1024 px (default 512 px). For print, prefer the SVG, which has no fixed resolution at all.
- A long password makes a denser code. That is normal, and the printed size is what determines whether it scans, not the module count.

## Limits worth knowing

- Hidden networks: the extension writes the SSID, password and security type. It does not set the optional `H:true` hidden-network flag, so a hidden SSID may still need to be added manually on the phone.
- Enterprise networks (WPA2-Enterprise with a username, an EAP method, and a certificate) are not covered by this payload format. This is for the ordinary pre-shared-key networks in homes, cafes, offices and rentals.

## Related

- [Make a QR code for a website](make-a-qr-code-for-a-website.md)
- [Put a logo in the middle of a QR code](qr-code-with-a-logo.md)
- [Make a vCard contact QR code](vcard-qr-code.md)
- The same generator on the web: [cleanor.app/tools/qr-code-generator](https://cleanor.app/tools/qr-code-generator)
- All Cleanor Chrome extensions: [cleanor.app/chrome](https://cleanor.app/chrome)
