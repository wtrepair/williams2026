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
  assert.deepEqual(window.fbq.queue.filter(e => e[1] === 'PageView'), [['track', 'PageView'], ['track', 'PageView']]);
  assert.equal(events.filter(e => e[1] === 'page_view').length, 2);
  assert.equal(events.filter(e => e[1] === 'request_form_view').length, 1);
  assert.equal(events.filter(e => e[1] === 'phone_click').length, 1);
  assert.ok(!JSON.stringify(events).includes('private@example.test'));
  assert.equal(events.some(e => e[1] === 'generate_lead'), false);
});
