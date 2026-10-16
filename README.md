# Leela Analytics corporate website

Approved logo-led redesign: a fast static website, self-hosted fonts and a server-only Resend enquiry endpoint.

## Local preview

Use Node.js 22 or newer (Wrangler requires it).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4175. The preview is local-only and deliberately has no email credentials. A submission returns an unavailable state and preserves the message; no live email is sent.

```sh
npm run check
npx wrangler deploy --dry-run
```

Tests use mocked provider transport and never send email.

## Structure

- `src/site.mjs`: shared templates, homepage, about, insights and policies
- `src/styles.css`: approved responsive design
- `src/main.js`: accessible enquiry submission states
- `src/assets` / `src/fonts`: supplied logos, approved illustration, licensed fonts
- `scripts/build.mjs`: explicit static output
- `server`: Cloudflare Worker and contact validation/delivery
- `tests`: API boundaries and publication integrity

**Publish only `dist/` through the Worker configuration.** Root-level legacy HTML remains as historical source; it is not the rebuilt website and is not copied into the build. Public URLs are extensionless. Cloudflare redirects old `.html` URLs; the local preview mirrors this behavior.

The site's own code contains no analytics, advertising scripts, cookies or local-storage tracking. Email credentials stay server-side. Read [DEPLOYMENT.md](DEPLOYMENT.md) for configuration and launch instructions. The website has not been deployed and DNS is unchanged.

## Identity

Use the supplied full LEELA arrow mark on black and the compact circular mark in the light footer. The logos are original screenshot references; replace them with equivalent clean originals when available without redrawing the lettering. The illustration is generated conceptual artwork, not a photograph of an office or team.

Manrope is used for headings; Public Sans for reading and controls. Font licenses are included in `src/fonts/`. Actual tokens and component guidance are recorded in DESIGN.md.
