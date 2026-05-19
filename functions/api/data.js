// Cloudflare Pages Function - KV 数据读写
// GET  /api/data  → 读取全量 readings
// PUT  /api/data  → 写入全量 readings

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const kv = env.BOOKMARK_DATA;
  if (!kv) {
    return new Response(JSON.stringify({ error: 'KV not bound. Please bind BOOKMARK_DATA in Pages settings.' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } });
  }

  if (request.method === 'GET') {
    const data = await kv.get('readings');
    return new Response(data || '{"readings":{}}', {
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'PUT') {
    const body = await request.text();
    try { JSON.parse(body); } catch {
      return new Response('Invalid JSON', { status: 400, headers: CORS });
    }
    await kv.put('readings', body);
    return new Response('OK', { status: 200, headers: CORS });
  }

  return new Response('Method not allowed', { status: 405, headers: CORS });
}
