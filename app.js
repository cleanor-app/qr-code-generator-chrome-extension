'use strict';

// Cleanor QR — all QR generation is local (vendored encoder), nothing is uploaded.
import { encodeQr } from './vendor/qr/qr-core.js';

const $ = (id) => document.getElementById(id);
const els = {
  typePills: $('typePills'),
  fillSeg: $('fillSeg'),
  styleSeg: $('styleSeg'),
  eyeSeg: $('eyeSeg'),
  solidRow: $('solidRow'),
  gradRow: $('gradRow'),
  canvas: $('canvas'),
  hint: $('hint'),
  ecc: $('ecc'),
  size: $('size'),
  sizeVal: $('sizeVal'),
  fgColor: $('fgColor'),
  bgColor: $('bgColor'),
  gradFrom: $('gradFrom'),
  gradTo: $('gradTo'),
  gradAngle: $('gradAngle'),
  fgSwatches: $('fgSwatches'),
  bgSwatches: $('bgSwatches'),
  templates: $('templates'),
  logoAdd: $('logoAdd'),
  logoFile: $('logoFile'),
  logoName: $('logoName'),
  logoRemove: $('logoRemove'),
  typeSuggest: $('typeSuggest'),
  download: $('download'),
  downloadSvg: $('downloadSvg'),
  copy: $('copy'),
  print: $('print'),
  srcTag: $('srcTag'),
  siteLink: $('siteLink'),
  toolLink: $('toolLink'),
  toast: $('toast'),
  fText: $('f-text'),
  fSsid: $('f-ssid'),
  fPass: $('f-pass'),
  fEnc: $('f-enc'),
  fEmailTo: $('f-email-to'),
  fEmailSubject: $('f-email-subject'),
  fEmailBody: $('f-email-body'),
  fPhone: $('f-phone'),
  fSmsNumber: $('f-sms-number'),
  fSmsMessage: $('f-sms-message'),
  fCName: $('f-c-name'),
  fCPhone: $('f-c-phone'),
  fCEmail: $('f-c-email'),
  fCOrg: $('f-c-org'),
  fCUrl: $('f-c-url'),
  fWaNumber: $('f-wa-number'),
  fWaMessage: $('f-wa-message'),
  fGeoLat: $('f-geo-lat'),
  fGeoLon: $('f-geo-lon'),
  fEvTitle: $('f-ev-title'),
  fEvAllday: $('f-ev-allday'),
  fEvStart: $('f-ev-start'),
  fEvEnd: $('f-ev-end'),
  fEvLocation: $('f-ev-location'),
  fEvDesc: $('f-ev-desc'),
};

const SITE = 'https://cleanor.app';
const PREFS_KEY = 'cleanor.qr.prefs';
const PAYLOAD_KEY = 'cleanor.qr.payload';
const MAX_PREVIEW_PX = 300; // matches the CSS clamp() ceiling for the preview canvas
const MARGIN = 4; // quiet zone, in modules
const params = new URLSearchParams(location.search);

const state = {
  type: 'text',
  fillMode: 'solid', // solid | gradient
  fg: '#000000',
  gradFrom: '#4576fd',
  gradTo: '#2f55d4',
  gradAngle: 45,
  bg: '#ffffff',
  style: 'square', // square | rounded | dots
  eye: 'square', // square | rounded
};
let logoImg = null; // preloaded HTMLImageElement or null
let logoName = '';
let current = null; // last QrResult

// Style templates — all vetted to clear a 4:1 contrast ratio (dark foreground on light
// background; gradients go dark→dark) so every preset stays reliably scannable.
const TEMPLATES = [
  { id: 'classic', label: 'Classic', fill: 'solid', fg: '#000000', bg: '#ffffff', style: 'square', eye: 'square' },
  { id: 'cleanor', label: 'Cleanor', fill: 'gradient', from: '#3f6ae0', to: '#2f55d4', angle: 45, bg: '#ffffff', style: 'rounded', eye: 'rounded' },
  { id: 'midnight', label: 'Midnight', fill: 'solid', fg: '#0a1f44', bg: '#f4f7ff', style: 'rounded', eye: 'rounded' },
  { id: 'ocean', label: 'Ocean', fill: 'gradient', from: '#1e40af', to: '#0a1f44', angle: 45, bg: '#f0f9ff', style: 'dots', eye: 'rounded' },
  { id: 'forest', label: 'Forest', fill: 'solid', fg: '#14532d', bg: '#f5f5f0', style: 'dots', eye: 'rounded' },
  { id: 'grape', label: 'Grape', fill: 'solid', fg: '#3b0764', bg: '#faf5ff', style: 'rounded', eye: 'rounded' },
  { id: 'teal', label: 'Teal', fill: 'solid', fg: '#0f4c4c', bg: '#fff8f0', style: 'rounded', eye: 'rounded' },
  { id: 'crimson', label: 'Crimson', fill: 'solid', fg: '#7f1d1d', bg: '#ffffff', style: 'rounded', eye: 'square' },
];

function siteUrl(path, medium, extra) {
  const u = new URL(path, SITE);
  if (extra) for (const [k, val] of Object.entries(extra)) u.searchParams.set(k, val);
  u.searchParams.set('utm_source', 'chrome_extension');
  u.searchParams.set('utm_medium', medium);
  u.searchParams.set('utm_campaign', 'cleanor_qr_generator');
  const v = chrome.runtime?.getManifest ? chrome.runtime.getManifest().version : '';
  if (v) u.searchParams.set('utm_content', v);
  return u.href;
}

// Human labels for the contextual "open on the site" link. Basic Text/Link is fully covered
// locally, so it is intentionally absent (no link shown for it).
const TYPE_LABELS = {
  wifi: 'Wi-Fi',
  email: 'Email',
  phone: 'Phone',
  sms: 'SMS',
  contact: 'Contact',
  whatsapp: 'WhatsApp',
  geo: 'Location',
  event: 'Event',
};

// Deep-link the current advanced type to the matching tool on cleanor.app. The `type` param
// lets the site preselect that generator (a small site-side change, see notes).
function updateToolLink(type) {
  const label = TYPE_LABELS[type];
  if (!label) {
    els.toolLink.hidden = true;
    return;
  }
  els.toolLink.textContent = `Open the full ${label} QR tool on cleanor.app →`;
  els.toolLink.href = siteUrl('/tools/qr-code-generator', 'type_link', { type });
  els.toolLink.hidden = false;
}

// ---- payload builders -------------------------------------------------------
const escWifi = (s) => String(s).replace(/([\\;,:"])/g, '\\$1');
const escVcard = (s) => String(s).replace(/([\\;,])/g, '\\$1');
// iCalendar text escaping: backslash, comma, semicolon, and newline → literal \n.
const escICal = (s) => String(s).replace(/([\\;,])/g, '\\$1').replace(/\r?\n/g, '\\n');
// A datetime-local value ("2026-07-11T09:00") → iCal local time "20260711T090000".
function icalDate(v) {
  const m = String(v).match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  return m ? `${m[1]}${m[2]}${m[3]}T${m[4]}${m[5]}00` : '';
}
// Date portion only ("20260711"), from either a date or datetime-local value.
function icalDateOnly(v) {
  const m = String(v).match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}${m[2]}${m[3]}` : '';
}
const pad2 = (n) => String(n).padStart(2, '0');
// The day after an "YYYYMMDD" string — an all-day VEVENT's DTEND is exclusive.
function nextDay(ymd) {
  const d = new Date(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8));
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
}
// A sensible default end (start + 1h) when the user leaves "Ends" blank.
function plusOneHour(dtLocal) {
  const m = String(dtLocal).match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return '';
  const d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  d.setHours(d.getHours() + 1);
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
}

function buildPayload() {
  switch (state.type) {
    case 'text':
      return els.fText.value.trim();
    case 'wifi': {
      const ssid = els.fSsid.value.trim();
      if (!ssid) return '';
      const enc = els.fEnc.value;
      if (enc === 'nopass') return `WIFI:T:nopass;S:${escWifi(ssid)};;`;
      return `WIFI:T:${enc};S:${escWifi(ssid)};P:${escWifi(els.fPass.value)};;`;
    }
    case 'email': {
      const to = els.fEmailTo.value.trim();
      if (!to) return '';
      const q = new URLSearchParams();
      if (els.fEmailSubject.value.trim()) q.set('subject', els.fEmailSubject.value.trim());
      if (els.fEmailBody.value.trim()) q.set('body', els.fEmailBody.value.trim());
      const qs = q.toString();
      return `mailto:${to}${qs ? '?' + qs : ''}`;
    }
    case 'phone': {
      const n = els.fPhone.value.trim();
      return n ? `tel:${n.replace(/\s+/g, '')}` : '';
    }
    case 'sms': {
      const n = els.fSmsNumber.value.trim();
      if (!n) return '';
      return `SMSTO:${n.replace(/\s+/g, '')}:${els.fSmsMessage.value.trim()}`;
    }
    case 'contact': {
      const name = els.fCName.value.trim();
      if (!name) return '';
      const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${escVcard(name)}`];
      const parts = name.split(/\s+/);
      const last = parts.length > 1 ? parts.pop() : '';
      lines.push(`N:${escVcard(last)};${escVcard(parts.join(' '))};;;`);
      if (els.fCOrg.value.trim()) lines.push(`ORG:${escVcard(els.fCOrg.value.trim())}`);
      if (els.fCPhone.value.trim()) lines.push(`TEL;TYPE=CELL:${els.fCPhone.value.trim()}`);
      if (els.fCEmail.value.trim()) lines.push(`EMAIL:${els.fCEmail.value.trim()}`);
      if (els.fCUrl.value.trim()) lines.push(`URL:${els.fCUrl.value.trim()}`);
      lines.push('END:VCARD');
      return lines.join('\n');
    }
    case 'whatsapp': {
      const digits = els.fWaNumber.value.replace(/\D/g, '');
      if (!digits) return '';
      const msg = els.fWaMessage.value.trim();
      return `https://wa.me/${digits}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
    }
    case 'geo': {
      const lat = els.fGeoLat.value.trim();
      const lon = els.fGeoLon.value.trim();
      if (!lat || !lon || isNaN(Number(lat)) || isNaN(Number(lon))) return '';
      return `geo:${lat},${lon}`;
    }
    case 'event': {
      const title = els.fEvTitle.value.trim();
      const allDay = els.fEvAllday.checked;
      const hasStart = allDay ? icalDateOnly(els.fEvStart.value) : icalDate(els.fEvStart.value);
      if (!title && !hasStart) return '';
      const lines = ['BEGIN:VEVENT'];
      if (title) lines.push(`SUMMARY:${escICal(title)}`);
      if (allDay) {
        const ds = icalDateOnly(els.fEvStart.value);
        if (ds) {
          lines.push(`DTSTART;VALUE=DATE:${ds}`);
          lines.push(`DTEND;VALUE=DATE:${icalDateOnly(els.fEvEnd.value) || nextDay(ds)}`);
        }
      } else {
        const ds = icalDate(els.fEvStart.value);
        if (ds) {
          lines.push(`DTSTART:${ds}`);
          const de = icalDate(els.fEvEnd.value) || plusOneHour(els.fEvStart.value);
          if (de) lines.push(`DTEND:${de}`);
        }
      }
      if (els.fEvLocation.value.trim()) lines.push(`LOCATION:${escICal(els.fEvLocation.value.trim())}`);
      if (els.fEvDesc.value.trim()) lines.push(`DESCRIPTION:${escICal(els.fEvDesc.value.trim())}`);
      lines.push('END:VEVENT');
      return lines.join('\n');
    }
    default:
      return '';
  }
}

// ---- scan-safety ------------------------------------------------------------
function luminance(hex) {
  const c = hex.replace('#', '');
  const ch = (i) => {
    const v = parseInt(c.substr(i, 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(0) + 0.7152 * ch(2) + 0.0722 * ch(4);
}
function fgLuminance() {
  // Worst case for contrast is the lighter gradient stop.
  return state.fillMode === 'gradient'
    ? Math.max(luminance(state.gradFrom), luminance(state.gradTo))
    : luminance(state.fg);
}
function scanWarning() {
  const lf = fgLuminance();
  const lb = luminance(state.bg);
  if (lf >= lb) return 'Code is lighter than its background — most scanners need dark on light.';
  // ISO/IEC 18004 wants ≥4:1 foreground-to-background contrast.
  if ((lb + 0.05) / (lf + 0.05) < 4) return 'Low contrast — this may not scan reliably.';
  return '';
}

// ---- rendering (opts-driven so templates can reuse it) ----------------------
const isFinder = (x, y, size) =>
  (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);

function currentOpts() {
  const fg =
    state.fillMode === 'gradient'
      ? { grad: [state.gradFrom, state.gradTo], angle: state.gradAngle }
      : state.fg;
  return { fg, bg: state.bg, style: state.style, eye: state.eye, logo: logoImg };
}

function fgFill(ctx, px, fg) {
  if (typeof fg === 'string') return fg;
  const a = (fg.angle * Math.PI) / 180;
  const cx = px / 2;
  const cy = px / 2;
  const dx = (Math.cos(a) * px) / 2;
  const dy = (Math.sin(a) * px) / 2;
  const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  g.addColorStop(0, fg.grad[0]);
  g.addColorStop(1, fg.grad[1]);
  return g;
}

function drawEye(ctx, oxMod, oyMod, scale, fill, bg, eyeStyle) {
  const x = (oxMod + MARGIN) * scale;
  const y = (oyMod + MARGIN) * scale;
  const rO = eyeStyle === 'rounded' ? scale * 2 : 0;
  const rI = eyeStyle === 'rounded' ? scale * 1 : 0;
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.roundRect(x, y, 7 * scale, 7 * scale, rO); ctx.fill();
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.roundRect(x + scale, y + scale, 5 * scale, 5 * scale, Math.max(0, rO - scale)); ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.roundRect(x + 2 * scale, y + 2 * scale, 3 * scale, 3 * scale, rI); ctx.fill();
}

function drawStyled(canvas, result, targetPx, opts, round = 'floor') {
  const dim = result.size + MARGIN * 2;
  // Integer module size keeps modules pixel-aligned (no fractional edges). For the on-screen
  // preview we round UP so the bitmap is larger than its CSS box and only ever downscales —
  // upscaling a smaller canvas is what makes a QR look blurry.
  const raw = targetPx / dim;
  const scale = Math.max(1, round === 'ceil' ? Math.ceil(raw) : Math.floor(raw));
  const px = dim * scale;
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = opts.bg;
  ctx.fillRect(0, 0, px, px);

  const fill = fgFill(ctx, px, opts.fg);
  ctx.fillStyle = fill;
  for (let y = 0; y < result.size; y++) {
    for (let x = 0; x < result.size; x++) {
      if (!result.modules[y][x] || isFinder(x, y, result.size)) continue;
      const cx = (x + MARGIN) * scale;
      const cy = (y + MARGIN) * scale;
      if (opts.style === 'square') {
        ctx.fillRect(cx, cy, scale, scale);
      } else if (opts.style === 'dots') {
        ctx.beginPath();
        ctx.arc(cx + scale / 2, cy + scale / 2, scale * 0.46, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.roundRect(cx, cy, scale, scale, scale * 0.3);
        ctx.fill();
      }
    }
  }
  // Eyes (finder patterns) rendered as a unit so they stay reliable.
  drawEye(ctx, 0, 0, scale, fill, opts.bg, opts.eye);
  drawEye(ctx, result.size - 7, 0, scale, fill, opts.bg, opts.eye);
  drawEye(ctx, 0, result.size - 7, scale, fill, opts.bg, opts.eye);

  // Center logo with a quiet knockout box (ECC is forced to H when a logo is set).
  if (opts.logo) {
    const box = Math.round(px * 0.26);
    const bx = Math.round((px - box) / 2);
    const pad = Math.round(box * 0.12);
    ctx.fillStyle = opts.bg;
    ctx.beginPath();
    ctx.roundRect(bx, bx, box, box, box * 0.18);
    ctx.fill();
    const inner = box - pad * 2;
    const ratio = Math.min(inner / opts.logo.width, inner / opts.logo.height);
    const w = opts.logo.width * ratio;
    const h = opts.logo.height * ratio;
    ctx.drawImage(opts.logo, (px - w) / 2, (px - h) / 2, w, h);
  }
}

function buildSvg(result, sizePx, opts) {
  const dim = result.size + MARGIN * 2;
  const gradId = 'qrfg';
  let fgRef = typeof opts.fg === 'string' ? opts.fg : `url(#${gradId})`;
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sizePx}" height="${sizePx}" viewBox="0 0 ${dim} ${dim}" shape-rendering="geometricPrecision">`,
  ];
  if (typeof opts.fg !== 'string') {
    const a = (opts.fg.angle * Math.PI) / 180;
    const x1 = 0.5 - Math.cos(a) / 2, y1 = 0.5 - Math.sin(a) / 2;
    const x2 = 0.5 + Math.cos(a) / 2, y2 = 0.5 + Math.sin(a) / 2;
    parts.push(
      `<defs><linearGradient id="${gradId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">` +
        `<stop offset="0" stop-color="${opts.fg.grad[0]}"/><stop offset="1" stop-color="${opts.fg.grad[1]}"/></linearGradient></defs>`,
    );
  }
  parts.push(`<rect width="${dim}" height="${dim}" fill="${opts.bg}"/>`);

  const square = [];
  const shaped = [];
  for (let y = 0; y < result.size; y++) {
    for (let x = 0; x < result.size; x++) {
      if (!result.modules[y][x] || isFinder(x, y, result.size)) continue;
      const mx = x + MARGIN, my = y + MARGIN;
      if (opts.style === 'square') square.push(`M${mx},${my}h1v1h-1z`);
      else if (opts.style === 'dots') shaped.push(`<circle cx="${mx + 0.5}" cy="${my + 0.5}" r="0.46"/>`);
      else shaped.push(`<rect x="${mx}" y="${my}" width="1" height="1" rx="0.3"/>`);
    }
  }
  if (square.length) parts.push(`<path d="${square.join('')}" fill="${fgRef}"/>`);
  if (shaped.length) parts.push(`<g fill="${fgRef}">${shaped.join('')}</g>`);

  // Eyes
  const rO = opts.eye === 'rounded' ? 2 : 0;
  const rI = opts.eye === 'rounded' ? 1 : 0;
  for (const [ox, oy] of [[0, 0], [result.size - 7, 0], [0, result.size - 7]]) {
    const x = ox + MARGIN, y = oy + MARGIN;
    parts.push(`<rect x="${x}" y="${y}" width="7" height="7" rx="${rO}" fill="${fgRef}"/>`);
    parts.push(`<rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="${Math.max(0, rO - 1)}" fill="${opts.bg}"/>`);
    parts.push(`<rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="${rI}" fill="${fgRef}"/>`);
  }

  if (opts.logo && opts.logo.src) {
    const box = dim * 0.26, bx = (dim - box) / 2, pad = box * 0.12, inner = box - pad * 2;
    parts.push(`<rect x="${bx}" y="${bx}" width="${box}" height="${box}" rx="${box * 0.18}" fill="${opts.bg}"/>`);
    parts.push(`<image href="${opts.logo.src}" x="${bx + pad}" y="${bx + pad}" width="${inner}" height="${inner}" preserveAspectRatio="xMidYMid meet"/>`);
  }
  parts.push('</svg>');
  return parts.join('');
}

function effectiveEcc() {
  return logoImg ? 'H' : els.ecc.value;
}

function render() {
  const payload = buildPayload();
  const hasText = payload.length > 0;
  els.download.disabled = els.downloadSvg.disabled = els.copy.disabled = els.print.disabled = !hasText;

  if (!hasText) {
    current = null;
    els.canvas.getContext('2d').clearRect(0, 0, els.canvas.width, els.canvas.height);
    els.hint.textContent = '';
    els.hint.classList.remove('warn');
    return;
  }
  try {
    current = encodeQr(payload, effectiveEcc());
    // Oversample to ≥ the largest on-screen size (the CSS clamp caps at 300px) × device pixel
    // ratio, then let CSS downscale — the canvas never upscales, so the QR stays razor-sharp.
    // No inline width/height here: the fluid CSS rule (clamp + aspect-ratio) owns the display size.
    const dpr = window.devicePixelRatio || 1;
    drawStyled(els.canvas, current, Math.round(MAX_PREVIEW_PX * Math.max(2, dpr)), currentOpts(), 'ceil');
    const warn = scanWarning();
    let info = `Version ${current.version} · ${current.size}×${current.size}`;
    if (logoImg) info += ' · logo (ECC High)';
    els.hint.textContent = warn || info;
    els.hint.classList.toggle('warn', !!warn);
  } catch (e) {
    current = null;
    els.download.disabled = els.downloadSvg.disabled = els.copy.disabled = els.print.disabled = true;
    els.hint.textContent = e && e.message ? e.message : 'Could not make a QR code.';
    els.hint.classList.add('warn');
  }
}

// ---- export -----------------------------------------------------------------
function baseName() {
  const t = state.type === 'text' ? els.fText.value.trim() : '';
  try {
    const host = new URL(t).hostname.replace(/^www\./, '');
    if (host) return host;
  } catch {}
  return `qr-${state.type}`;
}
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function exportCanvas() {
  const out = document.createElement('canvas');
  drawStyled(out, current, Number(els.size.value), currentOpts());
  return out;
}
function downloadPng() {
  if (!current) return;
  exportCanvas().toBlob((b) => { if (b) { triggerDownload(b, `${baseName()}-cleanor-qr.png`); toast('PNG saved'); } }, 'image/png');
}
function downloadSvgFile() {
  if (!current) return;
  triggerDownload(new Blob([buildSvg(current, Number(els.size.value), currentOpts())], { type: 'image/svg+xml' }), `${baseName()}-cleanor-qr.svg`);
  toast('SVG saved');
}
function copyImage() {
  if (!current) return;
  exportCanvas().toBlob(async (b) => {
    if (!b) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]);
      toast('Copied to clipboard');
    } catch { toast('Copy failed — clipboard blocked'); }
  }, 'image/png');
}

const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// A short human caption for the printed sheet (the URL/text, or a typed label).
function printCaption() {
  if (state.type === 'text') return els.fText.value.trim();
  if (state.type === 'wifi') return els.fSsid.value.trim() ? `Wi-Fi: ${els.fSsid.value.trim()}` : '';
  if (state.type === 'contact') return els.fCName.value.trim();
  if (state.type === 'event') return els.fEvTitle.value.trim();
  if (state.type === 'geo') return `${els.fGeoLat.value.trim()}, ${els.fGeoLon.value.trim()}`;
  return '';
}

function printQr() {
  if (!current) return;
  // Print from vector SVG so the code is crisp at any physical size.
  const svg = buildSvg(current, 1024, currentOpts());
  const cap = printCaption();
  const doc = `<!doctype html><html><head><meta charset="utf-8" /><title>Cleanor QR</title><style>
    @page { margin: 16mm; }
    html, body { height: 100%; }
    body { margin: 0; font-family: -apple-system, Segoe UI, Roboto, sans-serif;
      display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .qr { width: 60mm; height: 60mm; }
    .qr svg { width: 100%; height: 100%; display: block; }
    .cap { margin-top: 6mm; font-size: 11pt; color: #111; max-width: 90mm;
      text-align: center; word-break: break-word; }
    .tag { margin-top: 3mm; font-size: 8pt; color: #888; }
  </style></head><body>
    <div class="qr">${svg}</div>
    ${cap ? `<div class="cap">${escHtml(cap)}</div>` : ''}
    <div class="tag">Made with cleanor.app</div>
    <script>window.onload=function(){setTimeout(function(){window.print()},200)}<\/script>
  </body></html>`;
  const w = window.open('', '_blank', 'width=480,height=640');
  if (!w) { toast('Allow pop-ups to print'); return; }
  w.document.open();
  w.document.write(doc);
  w.document.close();
}

let toastTimer = 0;
function toast(msg) {
  els.toast.textContent = msg;
  els.toast.hidden = false;
  requestAnimationFrame(() => els.toast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.classList.remove('show');
    setTimeout(() => (els.toast.hidden = true), 200);
  }, 1400);
}

// ---- preferences ------------------------------------------------------------
async function loadPrefs() {
  try {
    const o = await chrome.storage.local.get(PREFS_KEY);
    const p = o[PREFS_KEY];
    if (p) {
      if (p.ecc) els.ecc.value = p.ecc;
      if (p.size) els.size.value = String(p.size);
      Object.assign(state, {
        fillMode: p.fillMode ?? state.fillMode,
        fg: p.fg ?? state.fg,
        gradFrom: p.gradFrom ?? state.gradFrom,
        gradTo: p.gradTo ?? state.gradTo,
        gradAngle: p.gradAngle ?? state.gradAngle,
        bg: p.bg ?? state.bg,
        style: p.style ?? state.style,
        eye: p.eye ?? state.eye,
      });
    }
  } catch {}
  els.sizeVal.textContent = els.size.value;
  els.fgColor.value = state.fg;
  els.bgColor.value = state.bg;
  els.gradFrom.value = state.gradFrom;
  els.gradTo.value = state.gradTo;
  els.gradAngle.value = String(state.gradAngle);
}
function persistPrefs() {
  chrome.storage.local
    .set({
      [PREFS_KEY]: {
        ecc: els.ecc.value,
        size: Number(els.size.value),
        fillMode: state.fillMode,
        fg: state.fg,
        gradFrom: state.gradFrom,
        gradTo: state.gradTo,
        gradAngle: state.gradAngle,
        bg: state.bg,
        style: state.style,
        eye: state.eye,
      },
    })
    .catch(() => {});
}

// ---- UI sync ----------------------------------------------------------------
function segSync(container, attr, value) {
  for (const b of container.querySelectorAll('.seg-btn')) b.classList.toggle('is-active', b.dataset[attr] === value);
}
function selectType(type) {
  state.type = type;
  for (const btn of els.typePills.querySelectorAll('.pill')) btn.classList.toggle('is-active', btn.dataset.type === type);
  for (const sec of document.querySelectorAll('.fields')) sec.hidden = sec.dataset.group !== type;
  updateToolLink(type);
  const f = document.querySelector(`.fields[data-group="${type}"] textarea, .fields[data-group="${type}"] input`);
  if (f) f.focus();
}
function markSwatches() {
  for (const b of els.fgSwatches.querySelectorAll('.sw')) b.classList.toggle('is-active', state.fillMode === 'solid' && b.dataset.c.toLowerCase() === state.fg.toLowerCase());
  for (const b of els.bgSwatches.querySelectorAll('.sw')) b.classList.toggle('is-active', b.dataset.c.toLowerCase() === state.bg.toLowerCase());
}
function syncFillUI() {
  segSync(els.fillSeg, 'fill', state.fillMode);
  els.solidRow.hidden = state.fillMode !== 'solid';
  els.gradRow.hidden = state.fillMode !== 'gradient';
}
function syncAppearanceUI() {
  syncFillUI();
  segSync(els.styleSeg, 'style', state.style);
  segSync(els.eyeSeg, 'eye', state.eye);
  markSwatches();
}

// ---- templates --------------------------------------------------------------
function buildTemplates() {
  const sample = encodeQr('https://cleanor.app', 'M');
  for (const t of TEMPLATES) {
    const btn = document.createElement('button');
    btn.className = 'tpl';
    btn.type = 'button';
    btn.dataset.id = t.id;
    const c = document.createElement('canvas');
    const opts = {
      fg: t.fill === 'gradient' ? { grad: [t.from, t.to], angle: t.angle } : t.fg,
      bg: t.bg,
      style: t.style,
      eye: t.eye,
      logo: null,
    };
    drawStyled(c, sample, 46, opts);
    const label = document.createElement('span');
    label.textContent = t.label;
    btn.append(c, label);
    btn.addEventListener('click', () => applyTemplate(t));
    els.templates.appendChild(btn);
  }
}
function applyTemplate(t) {
  state.fillMode = t.fill;
  if (t.fill === 'gradient') {
    state.gradFrom = t.from;
    state.gradTo = t.to;
    state.gradAngle = t.angle;
    els.gradFrom.value = t.from;
    els.gradTo.value = t.to;
    els.gradAngle.value = String(t.angle);
  } else {
    state.fg = t.fg;
    els.fgColor.value = t.fg;
  }
  state.bg = t.bg;
  state.style = t.style;
  state.eye = t.eye;
  els.bgColor.value = t.bg;
  for (const b of els.templates.querySelectorAll('.tpl')) b.classList.toggle('is-active', b.dataset.id === t.id);
  syncAppearanceUI();
  persistPrefs();
  render();
}

// ---- smart type suggestion --------------------------------------------------
function updateSuggest() {
  els.typeSuggest.hidden = true;
  if (state.type !== 'text') return;
  const v = els.fText.value.trim();
  if (!v) return;
  let s = null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) s = { type: 'email', label: 'Make an Email QR', field: () => (els.fEmailTo.value = v) };
  else if (/^\+?[\d\s()-]{7,}$/.test(v)) s = { type: 'phone', label: 'Make a Phone QR', field: () => (els.fPhone.value = v.replace(/\s+/g, '')) };
  if (s) {
    els.typeSuggest.textContent = s.label;
    els.typeSuggest.hidden = false;
    els.typeSuggest.onclick = () => {
      selectType(s.type);
      s.field();
      els.typeSuggest.hidden = true;
      render();
    };
  }
}

// ---- logo -------------------------------------------------------------------
els.logoAdd.addEventListener('click', () => els.logoFile.click());
els.logoFile.addEventListener('change', () => {
  const file = els.logoFile.files && els.logoFile.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      logoImg = img;
      logoName = file.name;
      els.logoName.textContent = file.name;
      els.logoName.hidden = false;
      els.logoRemove.hidden = false;
      els.logoAdd.hidden = true;
      render();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});
els.logoRemove.addEventListener('click', () => {
  logoImg = null;
  logoName = '';
  els.logoFile.value = '';
  els.logoName.hidden = true;
  els.logoRemove.hidden = true;
  els.logoAdd.hidden = false;
  render();
});

// ---- source seeding ---------------------------------------------------------
async function seedText() {
  if (params.get('src') === 'menu') {
    try {
      const o = await chrome.storage.local.get(PAYLOAD_KEY);
      const p = o[PAYLOAD_KEY];
      await chrome.storage.local.remove(PAYLOAD_KEY);
      if (p && p.text) {
        selectType('text');
        els.fText.value = p.text;
        if (p.label) { els.srcTag.textContent = p.label; els.srcTag.hidden = false; }
        updateSuggest();
        return;
      }
    } catch {}
  }
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && /^https?:/.test(tab.url)) {
      selectType('text');
      els.fText.value = tab.url;
      els.srcTag.textContent = 'This page';
      els.srcTag.hidden = false;
    }
  } catch {}
}

// ---- wire up ----------------------------------------------------------------
els.typePills.addEventListener('click', (e) => {
  const btn = e.target.closest('.pill');
  if (!btn) return;
  selectType(btn.dataset.type);
  updateSuggest();
  render();
});
els.fillSeg.addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  state.fillMode = btn.dataset.fill;
  syncFillUI();
  markSwatches();
  persistPrefs();
  render();
});
els.styleSeg.addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  state.style = btn.dataset.style;
  segSync(els.styleSeg, 'style', state.style);
  persistPrefs();
  render();
});
els.eyeSeg.addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  state.eye = btn.dataset.eye;
  segSync(els.eyeSeg, 'eye', state.eye);
  persistPrefs();
  render();
});
els.fgSwatches.addEventListener('click', (e) => {
  const sw = e.target.closest('.sw');
  if (!sw) return;
  state.fg = sw.dataset.c;
  els.fgColor.value = state.fg;
  markSwatches();
  persistPrefs();
  render();
});
els.bgSwatches.addEventListener('click', (e) => {
  const sw = e.target.closest('.sw');
  if (!sw) return;
  state.bg = sw.dataset.c;
  els.bgColor.value = state.bg;
  markSwatches();
  persistPrefs();
  render();
});
els.fgColor.addEventListener('input', () => { state.fg = els.fgColor.value; markSwatches(); persistPrefs(); render(); });
els.bgColor.addEventListener('input', () => { state.bg = els.bgColor.value; markSwatches(); persistPrefs(); render(); });
els.gradFrom.addEventListener('input', () => { state.gradFrom = els.gradFrom.value; persistPrefs(); render(); });
els.gradTo.addEventListener('input', () => { state.gradTo = els.gradTo.value; persistPrefs(); render(); });
els.gradAngle.addEventListener('input', () => { state.gradAngle = Number(els.gradAngle.value); persistPrefs(); render(); });

// Typing re-renders on a short debounce so long payloads (vCard, big text) don't recompute
// the QR matrix on every keystroke; the type suggestion updates immediately.
let renderTimer = 0;
const debouncedRender = () => {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(render, 140);
};
for (const el of document.querySelectorAll('.fields input, .fields textarea, .fields select')) {
  el.addEventListener('input', () => { updateSuggest(); debouncedRender(); });
}
// All-day toggle swaps the date pickers between date and datetime-local, preserving the date.
els.fEvAllday.addEventListener('change', () => {
  const allDay = els.fEvAllday.checked;
  for (const el of [els.fEvStart, els.fEvEnd]) {
    const datePart = (el.value.match(/\d{4}-\d{2}-\d{2}/) || [''])[0];
    el.type = allDay ? 'date' : 'datetime-local';
    if (datePart) el.value = allDay ? datePart : `${datePart}T09:00`;
  }
  render();
});
els.ecc.addEventListener('change', () => { persistPrefs(); render(); });
els.size.addEventListener('input', () => { els.sizeVal.textContent = els.size.value; persistPrefs(); });

els.download.addEventListener('click', downloadPng);
els.downloadSvg.addEventListener('click', downloadSvgFile);
els.copy.addEventListener('click', copyImage);
els.print.addEventListener('click', printQr);

els.siteLink.href = siteUrl('/tools/qr-code-generator', 'popup_footer');

(async () => {
  await loadPrefs();
  buildTemplates();
  syncAppearanceUI();
  await seedText();
  render();
})();
