const measurementId = 'G-50WTYZKKJR';
const metaPixelId = '879378588530915';
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

function initializeMeta() {
  if (window.fbq) return;
  const pixel = function (...args) {
    if (pixel.callMethod) pixel.callMethod(...args);
    else pixel.queue.push(args);
  };
  pixel.push = pixel;
  pixel.loaded = true;
  pixel.version = '2.0';
  pixel.queue = [];
  window.fbq = pixel;
  window._fbq = pixel;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  pixel('init', metaPixelId);
}

export function trackPage(path, title) {
  if (!initialize() || lastPath === path) return;
  lastPath = path;
  let referrer = '';
  try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch { /* Direct visit. */ }
  const page = { page_title: title, page_location: window.location.origin + path, page_referrer: referrer };
  window.gtag('config', measurementId, { ...page, send_page_view: false });
  window.gtag('event', 'page_view', page);
  initializeMeta();
  window.fbq('track', 'PageView');
  if (path.replace(/\/$/, '') === '/new-request') window.gtag('event', 'request_form_view');
}

export function trackContact(event) {
  if (initialize()) window.gtag('event', event);
}
