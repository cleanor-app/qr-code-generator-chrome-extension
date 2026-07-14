#!/usr/bin/env bash
# Build the upload artifacts:
#   - cleanor-qr-extension.zip                          (plain ZIP — use this for the FIRST publish)
#   - <signing-dir>/cleanor-qr-extension-<version>.crx  (signed, only once Verified CRX Uploads is on)
#
# A brand-new Web Store item is published from a plain ZIP. Verified CRX Uploads is an
# opt-in you enable later (see the image extension's SIGNING.md); after that, updates must
# be the signed .crx. Until a key exists, this script just builds the zip.
#
# Usage:  ./pack-crx.sh            # zip (+ signed crx if a key is configured)
#         ./pack-crx.sh --zip-only # just the zip
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# Files that make up the extension (keep in sync with the manifest).
FILES=(manifest.json background.js popup.html popup.css app.js icons vendor)

VERSION="$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")"
echo "Cleanor QR extension · v$VERSION"

# --- 1) plain ZIP ------------------------------------------------------------
rm -f cleanor-qr-extension.zip
zip -r -X cleanor-qr-extension.zip "${FILES[@]}" -x '*.DS_Store' >/dev/null
echo "✓ zip:  $ROOT/cleanor-qr-extension.zip"

[[ "${1:-}" == "--zip-only" ]] && exit 0

# --- 2) signed CRX (optional; only once a signing key exists) ----------------
KEY="${CLEANOR_QR_CRX_KEY:-$(cd "$(dirname "$0")/.." && pwd)/002-qr-code-generator-signed/cleanor-qr-ext.pem}"
CHROME="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

if [[ ! -f "$KEY" ]]; then
  echo "ℹ no signing key at: $KEY — that's expected for the first publish (upload the .zip)."
  echo "  Enable Verified CRX Uploads later, then set CLEANOR_QR_CRX_KEY to sign updates."
  exit 0
fi
if [[ ! -x "$CHROME" ]]; then
  echo "⚠ Chrome not found at: $CHROME (set CHROME_BIN). Skipping CRX."
  exit 0
fi

STAGE="$(mktemp -d)/cleanor-qr-extension"
mkdir -p "$STAGE"
cp -R "${FILES[@]}" "$STAGE/"
find "$STAGE" -name '.DS_Store' -delete

"$CHROME" --pack-extension="$STAGE" --pack-extension-key="$KEY" --no-message-box >/dev/null 2>&1 || true
SRC_CRX="$(dirname "$STAGE")/cleanor-qr-extension.crx"
if [[ -f "$SRC_CRX" ]]; then
  DEST="$(dirname "$KEY")/cleanor-qr-extension-$VERSION.crx"
  mv -f "$SRC_CRX" "$DEST"
  rm -rf "$(dirname "$STAGE")"
  echo "✓ crx:  $DEST  ($(head -c4 "$DEST"))"
else
  echo "✗ CRX not produced (Chrome pack failed). Check the key/Chrome path."
  rm -rf "$(dirname "$STAGE")"
  exit 1
fi
