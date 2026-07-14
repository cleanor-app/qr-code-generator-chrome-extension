// Service worker.
// Toolbar click opens the popup, which makes a QR of the current page (see app.js).
// Right-click a link / selected text / the page → we stash the payload and open the
// popup in a small window showing its QR. Everything is generated on-device; the only
// network use is the funnel links to cleanor.app, and only when the user clicks them.

const SITE = 'https://cleanor.app';

// One place for the campaign tags: without them the store-referred visits land in GA as
// "direct" and the extension looks like it sends no traffic at all.
function siteUrl(path, medium) {
  const u = new URL(path, SITE);
  u.searchParams.set('utm_source', 'chrome_extension');
  u.searchParams.set('utm_medium', medium);
  u.searchParams.set('utm_campaign', 'cleanor_qr_generator');
  u.searchParams.set('utm_content', chrome.runtime.getManifest().version);
  return u.href;
}

const MENU_LINK = 'cleanor-qr-link';
const MENU_SELECTION = 'cleanor-qr-selection';
const MENU_PAGE = 'cleanor-qr-page';
const PAYLOAD_KEY = 'cleanor.qr.payload';

function buildMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: MENU_PAGE, title: 'QR code for this page', contexts: ['page'] });
    chrome.contextMenus.create({ id: MENU_LINK, title: 'QR code for this link', contexts: ['link'] });
    chrome.contextMenus.create({
      id: MENU_SELECTION,
      title: 'QR code for “%s”',
      contexts: ['selection'],
    });
  });
}

chrome.runtime.onInstalled.addListener((details) => {
  buildMenu();
  // Only on a fresh install — re-opening this on every auto-update would be spam.
  if (details.reason === 'install') chrome.tabs.create({ url: siteUrl('/tools/qr-code-generator', 'onboarding') });
});
chrome.runtime.onStartup.addListener(buildMenu);

// Re-registered on every service-worker wake; the call is idempotent.
// Where an uninstall goes: a one-question survey, not the support page. `ext` is how we know
// which extension was removed (one survey serves the whole portfolio) and `v` is the version
// they had, which is the difference between "it is broken" and "it was broken, in 1.0.0".
chrome.runtime.setUninstallURL(
  siteUrl(
    `/uninstall?ext=qr-code-generator&v=${chrome.runtime.getManifest().version}`,
    'uninstall',
  ),
);

async function openWithPayload(text, label) {
  await chrome.storage.local.set({ [PAYLOAD_KEY]: { text, label, ts: Date.now() } });
  // A dedicated popup window is the reliable way to surface a QR from a context-menu
  // gesture — chrome.action.openPopup cannot carry data and is flaky across contexts.
  await chrome.windows.create({
    url: chrome.runtime.getURL('popup.html?src=menu'),
    type: 'popup',
    width: 404, // body is 380 + window chrome / scrollbar
    height: 640,
  });
}

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === MENU_LINK && info.linkUrl) {
    openWithPayload(info.linkUrl, 'Link');
  } else if (info.menuItemId === MENU_SELECTION && info.selectionText) {
    openWithPayload(info.selectionText.trim(), 'Selected text');
  } else if (info.menuItemId === MENU_PAGE && info.pageUrl) {
    openWithPayload(info.pageUrl, 'This page');
  }
});
