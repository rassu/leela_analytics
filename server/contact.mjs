const MAX_BODY_BYTES = 24 * 1024;
const EMAIL = /^[^\s@<>,;:"\\]+@[^\s@<>,;:"\\]+\.[^\s@<>,;:"\\]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CONTROL = /[\u0000-\u001f\u007f]/;
const MESSAGE_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const SUCCESS = { ok: true, message: 'Thanks. Your enquiry has been sent.' };

function json(body, status, origin, extra = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    Vary: 'Origin',
    ...extra,
  };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(status === 204 ? null : JSON.stringify(body), { status, headers });
}

function failure(status, code, message, origin, extra, fields) {
  return json({ ok: false, error: { code, message, ...(fields ? { fields } : {}) } }, status, origin, extra);
}

function unavailable(origin) {
  return failure(503, 'SERVICE_UNAVAILABLE', 'The enquiry form is temporarily unavailable. Please try again later.', origin);
}

function allowedOrigins(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const origins = value.split(',').map((origin) => origin.trim());
  try {
    for (const origin of origins) {
      const url = new URL(origin);
      const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
      if (url.origin !== origin || (url.protocol !== 'https:' && !(local && url.protocol === 'http:'))) return null;
    }
  } catch {
    return null;
  }
  return origins;
}

function validEmail(value) {
  return typeof value === 'string' && value.length <= 254 && EMAIL.test(value);
}

function configured(env) {
  if (typeof env.RESEND_API_KEY !== 'string' || !env.RESEND_API_KEY.trim() || CONTROL.test(env.RESEND_API_KEY)) return false;
  if (!validEmail(env.CONTACT_TO)) return false;
  if (typeof env.CONTACT_FROM !== 'string' || env.CONTACT_FROM.length > 320 || CONTROL.test(env.CONTACT_FROM)) return false;
  const fromAddress = env.CONTACT_FROM.match(/^[^<>]+ <([^<>]+)>$/)?.[1] ?? env.CONTACT_FROM;
  return validEmail(fromAddress);
}

async function readJson(request) {
  const declared = request.headers.get('Content-Length');
  if (declared && /^\d+$/.test(declared) && Number(declared) > MAX_BODY_BYTES) return { tooLarge: true };
  if (!request.body) return { invalid: true };
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { tooLarge: true };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!data || typeof data !== 'object' || Array.isArray(data)) return { invalid: true };
    return { data };
  } catch {
    return { invalid: true };
  } finally {
    reader.releaseLock();
  }
}

function validate(data) {
  const fields = {};
  const values = {};
  const rules = { name: [2, 100], email: [3, 254], company: [0, 160], message: [10, 5000], website: [0, 200] };
  for (const [field, [min, max]] of Object.entries(rules)) {
    const raw = data[field] ?? (min === 0 ? '' : null);
    if (typeof raw !== 'string') {
      fields[field] = 'Please enter a valid value.';
      continue;
    }
    const value = raw.trim();
    const invalidControl = (field === 'message' ? MESSAGE_CONTROL : CONTROL).test(raw);
    if (value.length < min || value.length > max || raw.length > max || invalidControl) {
      fields[field] = min ? `Use between ${min} and ${max} characters.` : `Use no more than ${max} characters.`;
    } else if (field === 'email' && !validEmail(value)) {
      fields[field] = 'Please enter a valid email address.';
    }
    values[field] = value;
  }
  return { fields, values };
}

/** The only external call is injectable, so tests never send live email. */
export async function handleContact(request, env = {}, { fetch: send = globalThis.fetch } = {}) {
  const origins = allowedOrigins(env.ALLOWED_ORIGINS);
  if (!origins) return unavailable();
  const origin = request.headers.get('Origin');
  if (!origin || !origins.includes(origin)) {
    return failure(403, 'ORIGIN_NOT_ALLOWED', 'Please submit the form from the Leela Analytics website.');
  }

  if (request.method === 'OPTIONS') {
    if (request.headers.get('Access-Control-Request-Method') !== 'POST') {
      return failure(405, 'METHOD_NOT_ALLOWED', 'Use POST to send an enquiry.', origin, { Allow: 'POST, OPTIONS' });
    }
    const requested = (request.headers.get('Access-Control-Request-Headers') ?? '').split(',').map((header) => header.trim().toLowerCase()).filter(Boolean);
    if (requested.some((header) => !['content-type', 'idempotency-key'].includes(header))) {
      return failure(403, 'PREFLIGHT_NOT_ALLOWED', 'This request is not permitted.', origin);
    }
    return json(null, 204, origin, {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Idempotency-Key',
      'Access-Control-Max-Age': '600',
    });
  }
  if (request.method !== 'POST') {
    return failure(405, 'METHOD_NOT_ALLOWED', 'Use POST to send an enquiry.', origin, { Allow: 'POST, OPTIONS' });
  }
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return failure(415, 'UNSUPPORTED_MEDIA_TYPE', 'Submit the form as JSON.', origin);
  }
  const key = request.headers.get('Idempotency-Key');
  if (!key || !UUID.test(key)) {
    return failure(400, 'INVALID_IDEMPOTENCY_KEY', 'Please reload the page before sending your enquiry.', origin);
  }
  if (!configured(env) || typeof env.CONTACT_RATE_LIMITER?.limit !== 'function') return unavailable(origin);

  // Cloudflare sets this header on incoming requests. Never trust X-Forwarded-For.
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip || ip.length > 64) return unavailable(origin);
  try {
    const result = await env.CONTACT_RATE_LIMITER.limit({ key: `leela-contact:${ip}` });
    if (typeof result?.success !== 'boolean') return unavailable(origin);
    if (!result.success) {
      return failure(429, 'RATE_LIMITED', 'Please wait a minute before trying again.', origin, { 'Retry-After': '60' });
    }
  } catch {
    return unavailable(origin);
  }

  const parsed = await readJson(request);
  if (parsed.tooLarge) return failure(413, 'REQUEST_TOO_LARGE', 'Your enquiry is too long. Please shorten it and try again.', origin);
  if (parsed.invalid) return failure(400, 'INVALID_REQUEST', 'The enquiry could not be read. Please try again.', origin);
  const { fields, values } = validate(parsed.data);
  if (Object.keys(fields).length) return failure(422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', origin, undefined, fields);
  if (values.website) return json(SUCCESS, 200, origin);

  const payload = {
    from: env.CONTACT_FROM,
    to: [env.CONTACT_TO],
    subject: 'New Leela Analytics enquiry',
    reply_to: values.email,
    text: `Name: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company || 'Not provided'}\n\nMessage:\n${values.message}`,
  };
  try {
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `leela-contact/${key.toLowerCase()}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 429) {
      return failure(429, 'RATE_LIMITED', 'Please wait a minute before trying again.', origin, { 'Retry-After': '60' });
    }
    const result = await response.json();
    if (response.status === 409 && result?.name === 'invalid_idempotent_request') {
      return failure(409, 'IDEMPOTENCY_CONFLICT', 'This enquiry changed after a previous attempt. Please submit it again.', origin);
    }
    if (response.ok && typeof result?.id === 'string' && result.id.length > 0) return json(SUCCESS, 200, origin);
  } catch {
    // Do not log enquiry bodies, credentials, IP addresses, or provider responses.
  }
  return failure(502, 'DELIVERY_FAILED', 'We could not confirm delivery. Please try again with the same enquiry.', origin);
}
