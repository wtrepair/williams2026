const measurementId = 'G-50WTYZKKJR';
let lastPath = '';

function initialize() {
  if (window.location.hostname !== 'williamssolutions.pro') return false;
  if (window.gtag) return true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(tag);
  return true;
}

export function trackPage(path, title) {
  if (!initialize() || lastPath === path) return;
  lastPath = path;
  let referrer = '';
  try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch { /* Direct visit. */ }
  const page = { page_title: title, page_location: window.location.origin + path, page_referrer: referrer };
  window.gtag('config', measurementId, { ...page, send_page_view: false });
  window.gtag('event', 'page_view', page);
  if (path.replace(/\/$/, '') === '/new-request') window.gtag('event', 'request_form_view');
}

export function trackContact(event) {
  if (initialize()) window.gtag('event', event);
}
