import { test } from 'node:test';
import assert from 'node:assert/strict';

test('counts distinct public page views and contact clicks without URL queries', async () => {
  const appended = [];
  globalThis.window = { location: { hostname: 'williamssolutions.pro', origin: 'https://williamssolutions.pro' } };
  globalThis.document = { referrer: 'https://example.com/page?email=private@example.test', createElement: () => ({}), head: { appendChild: node => appended.push(node) } };
  const { trackPage, trackContact } = await import('../src/analytics.js');
  trackPage('/plumbing', 'Plumbing');
  trackPage('/plumbing', 'Plumbing');
  trackPage('/new-request', 'Request service');
  trackContact('phone_click');
  const events = window.dataLayer.map(args => Array.from(args));
  assert.equal(appended.length, 2);
  assert.deepEqual(window.fbq.queue.map(e => Array.from(e)).filter(e => e[1] === 'PageView'), [['track', 'PageView'], ['track', 'PageView']]);
  assert.equal(events.filter(e => e[1] === 'page_view').length, 2);
  assert.equal(events.filter(e => e[1] === 'request_form_view').length, 1);
  assert.equal(events.filter(e => e[1] === 'phone_click').length, 1);
  assert.ok(!JSON.stringify(events).includes('private@example.test'));
  assert.equal(events.some(e => e[1] === 'generate_lead'), false);
});

test('uses the same event ID for the browser and server page view', async () => {
  const previousFetch = globalThis.fetch;
  const sent = [];
  globalThis.window = { location: { hostname: 'williamssolutions.pro', origin: 'https://williamssolutions.pro' }, crypto: { randomUUID: () => '12345678-1234-1234-1234-123456789012' } };
  globalThis.document = { cookie: '_fbp=fb.1.1234.5678', referrer: '', createElement: () => ({}), head: { appendChild() {} } };
  globalThis.fetch = async (url, options) => { sent.push(JSON.parse(options.body)); return { ok: true }; };
  try {
    const { trackPage } = await import('../src/analytics.js?dedup-test');
    trackPage('/plumbing', 'Plumbing');
    const pixel = window.fbq.queue.map(args => Array.from(args)).find(args => args[1] === 'PageView');
    assert.equal(pixel[3].eventID, sent[0].eventId);
    assert.equal(sent[0].path, '/plumbing');
  } finally { globalThis.fetch = previousFetch; }
});
