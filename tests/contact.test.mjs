import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from '../server/contact.mjs';
import worker from '../server/worker.mjs';

const ORIGIN = 'https://www.leelaanalytics.com';
const KEY = '11111111-2222-4333-8444-555555555555';
const valid = { name: 'Asha Rao', email: 'asha@example.com', company: 'Example Labs', message: 'We would like to discuss an AI product.', website: '' };
const accepted = { ok: true, message: 'Thanks. Your enquiry has been sent.' };
const delivery = () => Response.json({ id: 'email-test-id' });
const noSend = async () => { assert.fail('This request must not send an email'); };
const env = (extra = {}) => ({
  ALLOWED_ORIGINS: ORIGIN,
  CONTACT_FROM: 'Leela enquiries <enquiries@example.com>',
  CONTACT_TO: 'team@example.com',
  RESEND_API_KEY: 'test-only-key',
  CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
  ...extra,
});
function request(body = valid, options = {}) {
  const headers = new Headers({ 'Content-Type': 'application/json', Origin: ORIGIN, 'Idempotency-Key': KEY, 'CF-Connecting-IP': '192.0.2.1' });
  for (const [key, value] of Object.entries(options.headers ?? {})) {
    if (value === null) headers.delete(key); else headers.set(key, value);
  }
  return new Request(ORIGIN + '/api/contact', {
    method: options.method ?? 'POST', headers,
    ...(!['GET', 'HEAD', 'OPTIONS'].includes(options.method) ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  });
}
async function error(response, status, code) {
  assert.equal(response.status, status);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.equal(body.error.code, code);
  return body;
}

test('sends plain text through Resend using only fixed server addresses', async () => {
  let sent;
  const response = await handleContact(request({ ...valid, to: 'attacker@example.com', from: 'attacker@example.com', html: '<script>attack</script>' }), env(), {
    fetch: async (url, init) => { sent = { url, init }; return delivery(); },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), accepted);
  assert.equal(sent.url, 'https://api.resend.com/emails');
  assert.equal(sent.init.method, 'POST');
  assert.equal(new Headers(sent.init.headers).get('Authorization'), 'Bearer test-only-key');
  assert.equal(new Headers(sent.init.headers).get('Idempotency-Key'), 'leela-contact/' + KEY);
  assert.deepEqual(JSON.parse(sent.init.body), {
    from: 'Leela enquiries <enquiries@example.com>', to: ['team@example.com'],
    subject: 'New Leela Analytics enquiry', reply_to: 'asha@example.com',
    text: 'Name: Asha Rao\nEmail: asha@example.com\nCompany: Example Labs\n\nMessage:\nWe would like to discuss an AI product.',
  });
  assert.ok(sent.init.signal instanceof AbortSignal);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), ORIGIN);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('normalizes whitespace and allows an omitted company', async () => {
  let payload;
  const response = await handleContact(request({ name: '  Asha Rao  ', email: ' asha@example.com ', message: ' Hello, can we talk? ' }), env(), { fetch: async (_, init) => { payload = JSON.parse(init.body); return delivery(); } });
  assert.equal(response.status, 200);
  assert.equal(payload.reply_to, 'asha@example.com');
  assert.match(payload.text, /^Name: Asha Rao\n/);
  assert.match(payload.text, /Company: Not provided\n\nMessage:\nHello, can we talk\?$/);
});

test('preserves the provider key and payload when retrying the same enquiry', async () => {
  const sent = [];
  const send = async (_, init) => { sent.push({ headers: new Headers(init.headers), body: init.body }); return delivery(); };
  assert.equal((await handleContact(request(), env(), { fetch: send })).status, 200);
  assert.equal((await handleContact(request(), env(), { fetch: send })).status, 200);
  assert.equal(sent[0].headers.get('Idempotency-Key'), sent[1].headers.get('Idempotency-Key'));
  assert.equal(sent[0].body, sent[1].body);
});

for (const origin of [null, 'null', 'https://evil.example', 'https://www.leelaanalytics.com.evil.example', ORIGIN + '/path']) {
  test(`rejects untrusted Origin ${origin}`, async () => {
    const response = await handleContact(request(valid, { headers: { Origin: origin } }), env(), { fetch: noSend });
    await error(response, 403, 'ORIGIN_NOT_ALLOWED');
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  });
}

test('matches exact origins in a comma-separated allowlist', async () => {
  const response = await handleContact(request(), env({ ALLOWED_ORIGINS: 'https://leelaanalytics.com, ' + ORIGIN }), { fetch: async () => delivery() });
  assert.equal(response.status, 200);
});

test('supports only the permitted CORS preflight', async () => {
  const response = await handleContact(request(null, { method: 'OPTIONS', headers: { 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type, idempotency-key' } }), env(), { fetch: noSend });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), ORIGIN);
  assert.match(response.headers.get('Access-Control-Allow-Headers'), /Idempotency-Key/i);
  await error(await handleContact(request(null, { method: 'OPTIONS', headers: { 'Access-Control-Request-Method': 'DELETE' } }), env(), { fetch: noSend }), 405, 'METHOD_NOT_ALLOWED');
});

test('rejects methods and media types without sending', async () => {
  const wrongMethod = await handleContact(request(null, { method: 'GET' }), env(), { fetch: noSend });
  await error(wrongMethod, 405, 'METHOD_NOT_ALLOWED');
  assert.match(wrongMethod.headers.get('Allow'), /POST/);
  for (const type of ['text/plain', 'application/x-www-form-urlencoded', null]) {
    await error(await handleContact(request(valid, { headers: { 'Content-Type': type } }), env(), { fetch: noSend }), 415, 'UNSUPPORTED_MEDIA_TYPE');
  }
});

test('rejects missing or malformed idempotency keys', async () => {
  for (const key of [null, 'undefined', '123', '00000000-0000-0000-0000-000000000000']) {
    await error(await handleContact(request(valid, { headers: { 'Idempotency-Key': key } }), env(), { fetch: noSend }), 400, 'INVALID_IDEMPOTENCY_KEY');
  }
});

test('rejects malformed JSON and non-object input', async () => {
  for (const body of ['{', 'null', '[]', '"hello"']) {
    await error(await handleContact(request(body), env(), { fetch: noSend }), 400, 'INVALID_REQUEST');
  }
});

test('rejects oversized content-length and bounds streamed bytes independently', async () => {
  await error(await handleContact(request(valid, { headers: { 'Content-Length': '24577' } }), env(), { fetch: noSend }), 413, 'REQUEST_TOO_LARGE');
  await error(await handleContact(request({ ...valid, padding: 'x'.repeat(24577) }, { headers: { 'Content-Length': '10' } }), env(), { fetch: noSend }), 413, 'REQUEST_TOO_LARGE');
  let cancelled = false;
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(24577)); }, cancel() { cancelled = true; } });
  const oversized = new Request(ORIGIN + '/api/contact', { method: 'POST', headers: request().headers, body: stream, duplex: 'half' });
  await error(await handleContact(oversized, env(), { fetch: noSend }), 413, 'REQUEST_TOO_LARGE');
  assert.equal(cancelled, true);
});

test('validates field bounds and rejects email/header injection', async () => {
  for (const [field, value] of [
    ['name', 'A'], ['name', 'x'.repeat(101)], ['name', 'Asha\r\nBcc: spam@example.com'],
    ['email', 'not-an-email'], ['email', 'asha@example.com\r\nBcc: spam@example.com'], ['email', 'x'.repeat(255)],
    ['company', 'x'.repeat(161)], ['company', 42], ['message', 'short'], ['message', 'x'.repeat(5001)], ['message', {}], ['message', 'Hello there\u0000oops'], ['website', 'x'.repeat(201)],
  ]) {
    const body = await error(await handleContact(request({ ...valid, [field]: value }), env(), { fetch: noSend }), 422, 'VALIDATION_ERROR');
    assert.ok(body.error.fields[field], field);
  }
});

test('accepts Unicode and multiline messages within the field boundaries', async () => {
  const response = await handleContact(request({ ...valid, name: '李明', message: '请协助我们设计新的数据平台。\n谢谢！' }), env(), { fetch: async () => delivery() });
  assert.equal(response.status, 200);
});

test('silently accepts the honeypot without contacting Resend', async () => {
  const response = await handleContact(request({ ...valid, website: 'https://spam.example' }), env(), { fetch: noSend });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), accepted);
});

test('blocks rate-limited senders with a retry hint', async () => {
  let actor;
  const response = await handleContact(request(), env({ CONTACT_RATE_LIMITER: { limit: async ({ key }) => { actor = key; return { success: false }; } } }), { fetch: noSend });
  await error(response, 429, 'RATE_LIMITED');
  assert.equal(response.headers.get('Retry-After'), '60');
  assert.ok(actor.includes('192.0.2.1'));
});

test('fails closed when the limiter, its response, or trusted client IP is missing', async () => {
  for (const limiter of [undefined, {}, { limit: async () => ({}) }, { limit: async () => { throw new Error('internal details'); } }]) {
    await error(await handleContact(request(), env({ CONTACT_RATE_LIMITER: limiter }), { fetch: noSend }), 503, 'SERVICE_UNAVAILABLE');
  }
  await error(await handleContact(request(valid, { headers: { 'CF-Connecting-IP': null } }), env(), { fetch: noSend }), 503, 'SERVICE_UNAVAILABLE');
});

test('fails closed on missing or unsafe server configuration', async () => {
  for (const change of [{ RESEND_API_KEY: '' }, { CONTACT_FROM: '' }, { CONTACT_TO: '' }, { ALLOWED_ORIGINS: '' }, { CONTACT_TO: 'a@example.com,b@example.com' }, { CONTACT_FROM: 'Sender\n<sender@example.com>' }]) {
    await error(await handleContact(request(), env(change), { fetch: noSend }), 503, 'SERVICE_UNAVAILABLE');
  }
});

test('hides provider errors and network failures from the browser', async () => {
  for (const send of [
    async () => Response.json({ message: 'secret provider details' }, { status: 401 }),
    async () => { throw new Error('secret provider details'); },
    async () => new Response('not json', { status: 200 }),
    async () => Response.json({}),
  ]) {
    const response = await handleContact(request(), env(), { fetch: send });
    const body = await error(response, 502, 'DELIVERY_FAILED');
    assert.equal(JSON.stringify(body).includes('secret provider details'), false);
  }
});

test('maps provider throttling to a retryable response', async () => {
  const response = await handleContact(request(), env(), { fetch: async () => Response.json({ name: 'rate_limit_exceeded' }, { status: 429 }) });
  await error(response, 429, 'RATE_LIMITED');
  assert.equal(response.headers.get('Retry-After'), '60');
});

test('maps an idempotency payload conflict without discarding the submitted enquiry', async () => {
  const response = await handleContact(request(), env(), { fetch: async () => Response.json({ name: 'invalid_idempotent_request' }, { status: 409 }) });
  await error(response, 409, 'IDEMPOTENCY_CONFLICT');
});

test('API paths never fall through to static HTML and static requests retain their response', async () => {
  let assetCalls = 0;
  const bindings = env({ ASSETS: { fetch: async () => { assetCalls += 1; return new Response('page', { status: 200 }); } } });
  for (const path of ['/api', '/api/missing', '/api/contact/']) {
    const response = await worker.fetch(new Request(ORIGIN + path), bindings);
    await error(response, 404, 'NOT_FOUND');
  }
  await error(await worker.fetch(new Request(ORIGIN + '/api/contact', { headers: { Origin: ORIGIN } }), bindings), 405, 'METHOD_NOT_ALLOWED');
  assert.equal(assetCalls, 0);
  assert.equal(await (await worker.fetch(new Request(ORIGIN + '/about/'), bindings)).text(), 'page');
  assert.equal(assetCalls, 1);
});
