# Leela Analytics corporate website

A fast static website with self-hosted fonts. The current launch target is the existing GitHub Pages site, using a direct email contact panel for `hello@leelaanalytics.com`. A Cloudflare Worker with a server-only Resend enquiry endpoint is prepared for a later launch and remains unconfigured.

## Local preview

Use Node.js 22 or newer (Wrangler requires it).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4175. The default preview uses the Worker-form version, is local-only and has no email credentials. A submission returns an unavailable state and preserves the message; no live email is sent.

## Build targets

```sh
npm run build:pages
```

Builds the GitHub Pages version into `dist/`. Its contact panel opens the visitor's email application to write to `hello@leelaanalytics.com`; there is no contact form or server-side email endpoint on Pages. Privacy wording reflects direct email contact rather than Resend form delivery.

```sh
npm run check
npm run build
npx wrangler deploy --dry-run
```

The default `build` retains the enquiry form for the prepared Worker deployment. `check` builds that version and runs the tests; provider transport is mocked and tests never send email. A Worker dry run does not publish. Each build replaces `dist/`, so run `build:pages` last before publishing to Pages.

## Publication

The intended production workflow is GitHub Actions on a push to `master` or a manual `workflow_dispatch` run. It builds the Pages version and uploads **only `dist/`** as the Pages artifact. The repository root, server code and tests are not website assets. Deployment results are recorded in the repository’s Actions runs and `github-pages` environment. Verify the live site after each release.

Root-level legacy HTML remains as historical source and is not copied into the build. The Cloudflare-specific `_headers` file and Worker routing are not a mechanism for configuring GitHub Pages. Do not assume those Worker behaviors or headers apply to Pages.

The site's own code contains no analytics, advertising scripts, cookies or local-storage tracking. Read [DEPLOYMENT.md](DEPLOYMENT.md) for the Pages publication steps and the separate later Worker setup.

## Structure

- `src/site.mjs`: shared templates, homepage, about, insights and policies
- `src/styles.css`: responsive design
- `src/main.js`: accessible enquiry submission states for the Worker-form version
- `src/assets` / `src/fonts`: supplied logos, illustration and licensed fonts
- `scripts/build.mjs`: target-specific static output
- `server`: prepared Cloudflare Worker and contact validation/delivery
- `tests`: API boundaries and publication integrity

## Identity

Use the supplied full LEELA arrow mark on black and the compact circular mark in the light footer. The logos are original screenshot references; replace them with equivalent clean originals when available without redrawing the lettering. The illustration is generated conceptual artwork, not a photograph of an office or team.

Manrope is used for headings; Public Sans for reading and controls. Font licenses are included in `src/fonts/`. Actual tokens and component guidance are recorded in DESIGN.md.
