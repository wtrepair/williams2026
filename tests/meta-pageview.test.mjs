import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/meta-pageview.js';

function response() {
  return { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; }, end() { return this; } };
}

test('server sends only a validated page view with the browser event ID', async () => {
  const originalFetch = globalThis.fetch;
  const oldToken = process.env.WILLIAMS_META_CAPI_ACCESS_TOKEN;
  let sent;
  process.env.WILLIAMS_META_CAPI_ACCESS_TOKEN = 'test-token';
  globalThis.fetch = async (url, options) => { sent = { url, payload: JSON.parse(options.body) }; return { ok: true }; };
  try {
    const req = { method: 'POST', headers: { origin: 'https://williamssolutions.pro', 'user-agent': 'test', 'x-forwarded-for': '192.0.2.1' }, body: { eventId: '12345678-1234-1234-1234-123456789012', path: '/plumbing', fbp: 'fb.1.1234.5678' } };
    let res = response(); await handler(req, res);
    assert.equal(res.code, 204);
    assert.equal(sent.payload.data[0].event_id, req.body.eventId);
    assert.equal(sent.payload.data[0].event_source_url, 'https://williamssolutions.pro/plumbing');
    assert.equal(sent.payload.data[0].event_name, 'PageView');
    res = response(); await handler({ ...req, body: { ...req.body, path: '/?email=private' } }, res);
    assert.equal(res.code, 400);
    res = response(); await handler({ ...req, headers: { origin: 'https://other.example' } }, res);
    assert.equal(res.code, 403);
  } finally {
    globalThis.fetch = originalFetch;
    if (oldToken === undefined) delete process.env.WILLIAMS_META_CAPI_ACCESS_TOKEN;
    else process.env.WILLIAMS_META_CAPI_ACCESS_TOKEN = oldToken;
  }
});
