const pixelId = '879378588530915';
const origin = 'https://williamssolutions.pro';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin !== origin) return res.status(403).json({ error: 'Origin not allowed' });
  const { eventId, path, fbp, fbc } = req.body || {};
  if (typeof eventId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(eventId) ||
      typeof path !== 'string' || !/^\/(?!\/)[^?#]{0,500}$/.test(path)) {
    return res.status(400).json({ error: 'Invalid event' });
  }
  const token = process.env.WILLIAMS_META_CAPI_ACCESS_TOKEN;
  if (!token) return res.status(503).json({ error: 'Tracking unavailable' });
  const userData = {
    client_ip_address: (req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
    client_user_agent: req.headers['user-agent'] || '',
  };
  if (typeof fbp === 'string' && /^fb\.1\.\d+\.\d+$/.test(fbp)) userData.fbp = fbp;
  if (typeof fbc === 'string' && /^fb\.1\.\d+\.[a-zA-Z0-9_-]+$/.test(fbc)) userData.fbc = fbc;
  try {
    const response = await fetch(`https://graph.facebook.com/v22.0/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data: [{ event_name: 'PageView', event_time: Math.floor(Date.now() / 1000), event_id: eventId, event_source_url: origin + path, action_source: 'website', user_data: userData }] }),
    });
    return res.status(response.ok ? 204 : 502).end();
  } catch {
    return res.status(502).json({ error: 'Tracking unavailable' });
  }
}
