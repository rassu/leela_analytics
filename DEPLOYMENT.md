# Leela Analytics deployment

The prepared target is Cloudflare Workers with static assets and one server-side Resend endpoint. Deployment, DNS changes and live email delivery have not been performed. The static asset directory is **`dist/` only**; never deploy the repository root, which includes server code, configuration, tests and internal material.

## Current blockers

- Confirm the Cloudflare account and the final hostname/DNS cutover. `workers_dev` and preview URLs are disabled, and no custom-domain route is committed.
- Configure a Resend-verified sender (`CONTACT_FROM`), which remains deliberately blank in `wrangler.jsonc`. The approved recipient is `CONTACT_TO=hello@leelaanalytics.com`. The form fails closed until the sender and API key are configured.
- Add `RESEND_API_KEY` as a Cloudflare Worker secret. Do not put it in source, `vars`, public assets, browser JavaScript or a build-time frontend variable.
- Confirm that rate-limit namespace `2026101601` is unused in the selected Cloudflare account. The `CONTACT_RATE_LIMITER` binding must remain configured; there is no production or development bypass.
- Verify the built site's legal copy, image/logo source quality, final domain and response inbox before launch. A controlled delivery test to the approved inbox is still needed after deployment, with explicit authorization to send that email.

No paid database, Durable Object, queue, container, VM or other paid resource is required by this configuration. Workers Free and Resend Free can cover a modest enquiry site. Existing account-wide usage also counts against provider quotas. Cloudflare's rate limiter is an abuse reduction measure, not a precise global quota or a guaranteed daily email cap.

## Build and review

Use Node.js 22 or later. The installed Wrangler release requires Node 22 even though the standalone API tests also run on Node 20. From the repository root:

```sh
npm install
npm run build
node --test tests/contact.test.mjs
```

Review `dist/` before upload. It must contain only intended public website files. Run the project's full verification command as well. For a local Worker preview use Wrangler **4.36.0 or later**, which supports the rate-limit binding:

```sh
cp .dev.vars.example .dev.vars
npx wrangler dev
```

The example includes the approved recipient alias but leaves the API key and sender empty. With it unchanged, valid-looking submissions return `503 SERVICE_UNAVAILABLE`; they do not send mail. The ordinary frontend preview (`npm run dev`, `http://127.0.0.1:4175`) also exposes `/api/contact` and deliberately returns `503 SERVICE_UNAVAILABLE` for a valid enquiry because it does not load sending credentials. Use the Worker preview to verify the Cloudflare routing and bindings. The Worker expects Cloudflare's `CF-Connecting-IP` header for throttling; when a local emulator does not supply it, use a controlled local request with that header or the injected unit tests. Never add a public fallback to `X-Forwarded-For` or disable rate limiting to make previews pass.

Tests use an injected `fetch` and fake bindings, so they do not contact Resend. Do not enter live credentials merely to test the interface. `.dev.vars` must be ignored by Git and omitted from `dist/`.

## Approved deployment steps

These are instructions for the later launch, not a record of actions already performed.

1. Authenticate Wrangler to the selected Cloudflare account. Check the selected account before changing secrets or routes.
2. Keep `CONTACT_TO` set to the approved recipient, `hello@leelaanalytics.com`. Set `CONTACT_FROM` to the approved sender address, optionally formatted `Leela Analytics <enquiries@verified-domain>`. Verify the sending domain and its required DNS records in Resend. No alias or recipient-routing change is needed.
3. Set `ALLOWED_ORIGINS` to the exact comma-separated production origins, with schemes, no paths and no trailing slash. Keep localhost origins confined to `.dev.vars`.
4. Confirm the rate-limit namespace and binding. The configured policy allows five attempts per 60 seconds per client IP at a Cloudflare location. Requests sharing a corporate NAT can share this allowance; distributed traffic can exceed it across locations.
5. Upload the secret interactively so it is not placed in shell history:

   ```sh
   npx wrangler secret put RESEND_API_KEY
   ```

6. Build and validate the Worker bundle without publishing:

   ```sh
   npm run build
   npx wrangler deploy --dry-run
   ```

7. After the final deployment and hostname change are authorized, configure the approved Cloudflare custom domain/route, then deploy:

   ```sh
   npx wrangler deploy
   ```

   A custom domain requires the domain to be an active Cloudflare zone. Keep the existing GitHub Pages deployment until the new endpoint, TLS and DNS behavior have been verified. Do not enable an unlisted `workers.dev` or preview origin as a shortcut.

8. With authorization for one live test, submit to the approved recipient and verify arrival and reply-to behavior. Verify rejected origins, the rate limit, validation errors and unknown `/api` routes. An API success indicates Resend accepted the send, not that the recipient mailbox delivered it.

## Contact API contract

`POST /api/contact` expects `Content-Type: application/json` and an `Idempotency-Key` header containing a UUID. It requires an exact allowed `Origin`. `OPTIONS` supports an allowed-origin preflight for `POST`, `Content-Type` and `Idempotency-Key` only.

```json
{
  "name": "Asha Rao",
  "email": "asha@example.com",
  "company": "Example Labs",
  "message": "We would like to discuss an AI product.",
  "website": ""
}
```

| Field | Rules |
|---|---|
| `name` | Required string, 2–100 characters, single line |
| `email` | Required valid email string, maximum 254 characters, single line |
| `company` | Optional string, maximum 160 characters, single line |
| `message` | Required string, 10–5,000 characters; line breaks allowed |
| `website` | Optional honeypot string, maximum 200 characters; leave empty |

The request body is capped at 24 KiB, including streamed bodies without a truthful `Content-Length`. Field limits use JavaScript string length (UTF-16 code units). Outer whitespace is trimmed; control characters are rejected except normal message tabs/line breaks. Client-supplied sender, recipient, subject and HTML fields are ignored. Messages contain plain text only and use the visitor's email as `reply_to`.

Success is HTTP `200`:

```json
{"ok":true,"message":"Thanks. Your enquiry has been sent."}
```

A filled honeypot returns the same success without sending. Errors use:

```json
{"ok":false,"error":{"code":"VALIDATION_ERROR","message":"Please check the highlighted fields.","fields":{"email":"Please enter a valid email address."}}}
```

`error.fields` appears only for validation errors. Preserve entered values on failures. Error codes/statuses:

| Status | Code | Client behavior |
|---|---|---|
| 400 | `INVALID_REQUEST`, `INVALID_IDEMPOTENCY_KEY` | Correct the request/reload the form while preserving the enquiry |
| 403 | `ORIGIN_NOT_ALLOWED`, `PREFLIGHT_NOT_ALLOWED` | Display an error; do not retry automatically |
| 404 | `NOT_FOUND` | Unknown `/api` path; never returns website HTML |
| 405 | `METHOD_NOT_ALLOWED` | Only POST and permitted OPTIONS are supported |
| 409 | `IDEMPOTENCY_CONFLICT` | Keep the enquiry and generate a fresh key for a deliberate resubmission |
| 413 | `REQUEST_TOO_LARGE` | Shorten the submitted content |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Send JSON |
| 422 | `VALIDATION_ERROR` | Show field errors without clearing entered values |
| 429 | `RATE_LIMITED` | Wait at least `Retry-After: 60` seconds |
| 502 | `DELIVERY_FAILED` | Delivery was not confirmed; allow retry with the same key and unchanged payload |
| 503 | `SERVICE_UNAVAILABLE` | Missing configuration/limiter or limiter unavailable; use the displayed business contact or retry later |

Generate one `crypto.randomUUID()` per distinct enquiry payload. Retain that UUID for retries after a network failure, timeout, `429` or `502`; generate a new one after editing the payload, confirmed success or a `409` conflict. The server forwards the canonical lowercase UUID to Resend as `leela-contact/<uuid>`. Resend retains idempotency keys for **24 hours**. After that window, retrying may send a second email. There is no automatic retry and no custom persistent deduplication store.

The handler aborts its Resend request after 10 seconds. It never returns raw provider errors or logs enquiry content, credentials or IP addresses. Rate limiting uses Cloudflare's trusted connecting IP; browser `Origin` and a honeypot are not authentication and cannot prevent all automated spam. Cloudflare and Resend still process technical/contact information under their own service policies.

## Official references

- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/): Free request/CPU limits and paid upgrade pricing.
- [Static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/): free static requests and Worker invocation behavior.
- [Worker routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/): `run_worker_first` keeps `/api` requests in the Worker.
- [Rate Limiting API](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/): binding schema, minimum Wrangler version and eventual/per-location consistency.
- [Resend Send Email API](https://resend.com/docs/api-reference/emails/send-email): fixed sender/recipient, plain-text body and response.
- [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys): 24-hour lifetime and conflict responses.
- [Resend pricing](https://resend.com/pricing): Free includes 3,000 emails/month with a 100/day cap at the time of this implementation.
