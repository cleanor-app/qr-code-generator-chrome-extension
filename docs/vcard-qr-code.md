# How do I make a vCard contact QR code?

Open the Cleanor QR Code Generator Chrome extension, click the **Contact** tab, and fill in the name, phone, email, organization and website. The extension builds a vCard 3.0 payload, so scanning the code offers to add you to the phone's address book instead of just showing raw text.

The name is the only required field. Everything else is optional and simply left out of the card if you leave it blank.

## Steps

1. Click the toolbar icon, or press `Alt+Shift+Q`.
2. Click the **Contact** pill in the row of content types.
3. Fill in the fields:
   - **Full name** (required)
   - **Phone**
   - **Email**
   - **Organization**
   - **Website**
4. The preview redraws as you type, on a short debounce so a long card does not recompute the matrix on every keystroke.
5. **Download PNG**, **SVG**, **Copy**, or **Print**. The printed sheet uses the contact's name as the caption underneath the code.

## What the code actually contains

A vCard 3.0 record, exactly the format a phone's contacts app expects:

```
BEGIN:VCARD
VERSION:3.0
FN:Jane Doe
N:Doe;Jane;;;
ORG:Cleanor Labs
TEL;TYPE=CELL:+15551234567
EMAIL:jane@example.com
URL:https://example.com
END:VCARD
```

`FN` is the display name you typed. `N` is the structured form, and the extension splits it for you: the last word becomes the family name and everything before it becomes the given name(s). "Jane van der Berg" therefore yields `N:Berg;Jane van der;;;`. If that is not how your name works, type the display name you want in **Full name** and check the exported card before you print a hundred of them.

Backslashes, semicolons and commas in any field are escaped, so an organization called "Doe, Smith & Co." does not corrupt the record.

Note the phone is written as `TEL;TYPE=CELL`. The extension has one phone field and treats it as a mobile number.

## Fields it does not carry

The Contact type covers five fields. It does not encode a postal address, a job title, a photo, a second phone number, or a note. That is a deliberate size trade: every field you add makes the QR code denser, and a business-card-sized code that nobody can scan helps no one.

If you need the fuller set, the popup shows an **Open the full Contact QR tool on cleanor.app** link whenever the Contact type is selected.

## Keeping a contact code scannable

A vCard is a *lot* more data than a URL, so the code comes out visibly denser. The version and module count are shown under the preview (for example `Version 6 · 41×41`). Two levers:

- **Error correction.** In *Customize → Advanced*, Low (7%) keeps the code as sparse as possible; the default Medium (15%) is a reasonable middle. A denser code needs to be printed larger to scan reliably, so if the card is going on a badge, favour fewer fields and lower correction over cramming everything in.
- **Print from SVG.** The **SVG** download and the **Print** sheet are both vector, so a dense code stays crisp at 60 mm or at A4. A 512 px PNG blown up to poster size will not scan.

If you add a logo, error correction is forced to High and the code gets denser again. On a contact card with all five fields filled, test the scan before committing to print.

## Where these are useful

A name badge at a conference, the last slide of a talk, the back of a business card, an email signature, a shop counter. Anywhere a person would otherwise have to type your details in by hand and get one character wrong.

Everything is generated on your device by a bundled encoder. Your phone number and email address are not sent to a server to be turned into a picture.

## Related

- [Make a QR code for a website](make-a-qr-code-for-a-website.md)
- [Create a Wi-Fi QR code](create-a-wifi-qr-code.md)
- [Put a logo in the middle of a QR code](qr-code-with-a-logo.md)
- The same generator on the web: [cleanor.app/tools/qr-code-generator](https://cleanor.app/tools/qr-code-generator)
- All Cleanor Chrome extensions: [cleanor.app/chrome](https://cleanor.app/chrome)
