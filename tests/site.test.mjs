import test, {before} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile, readdir, stat} from 'node:fs/promises';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const origin = 'https://www.leelaanalytics.com';
// This public-route contract is independent of the renderer and build manifest.
const pageRoutes = {
  'index.html': '/',
  'about-us.html': '/about-us',
  'blog.html': '/blog',
  'privacy-policy.html': '/privacy-policy',
  'terms-of-service.html': '/terms-of-service',
  'cookie-policy.html': '/cookie-policy',
  '404.html': '/404',
  'evaluating-ai.html': '/evaluating-ai',
  'designing-ai-workflows.html': '/designing-ai-workflows',
  'practical-ai-infrastructure.html': '/practical-ai-infrastructure',
};
const publicPages = new Set(Object.keys(pageRoutes));
const routeTargets = new Map(Object.entries(pageRoutes).map(([file, route]) => [route, file]));
const rootAssets = new Set(['styles.css', 'main.js', '_headers', 'robots.txt', 'sitemap.xml']);
let files;
let htmlPages;

async function inventory(directory) {
  const result = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Publication must not follow a symlink: ${path}`);
    if (entry.isDirectory()) result.push(...await inventory(path));
    else result.push(relative(output, path).split(sep).join('/'));
  }
  return result.sort();
}

function decode(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    result[match[1].toLowerCase()] = decode(match[2] ?? match[3]);
  }
  return result;
}

function elements(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))]
    .map(match => attributes(match[0]));
}

function ids(html) {
  return [...html.matchAll(/\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/g)]
    .map(match => match[1] ?? match[2]);
}

before(async () => {
  // Exercise the real publishing boundary once; no renderer helpers supply expectations.
  execFileSync(process.execPath, [join(root, 'scripts/build.mjs')], {cwd: root, stdio: 'pipe'});
  files = await inventory(output);
  htmlPages = new Map(await Promise.all(files.filter(file => file.endsWith('.html'))
    .map(async file => [file, await readFile(join(output, file), 'utf8')])));
});

test('publication contains only public routes and deployable assets', async () => {
  assert.deepEqual(new Set(htmlPages.keys()), publicPages, 'Public routes changed or disappeared');
  for (const file of files) {
    const allowed = publicPages.has(file) || rootAssets.has(file)
      || /^assets\/[\w.-]+\.(?:png|jpe?g|webp|avif|svg|ico)$/i.test(file)
      || /^fonts\/[\w.-]+\.(?:woff2?|ttf|otf)$/i.test(file)
      || /^fonts\/[\w.-]*(?:OFL|LICENSE)[\w.-]*\.txt$/i.test(file);
    assert.ok(allowed, `Unexpected published file: ${file}`);
    assert.ok((await stat(join(output, file))).size > 0, `Empty published file: ${file}`);
  }
  for (const required of rootAssets) assert.ok(files.includes(required), `Missing ${required}`);
});

test('all local HTML links, images, scripts and fragment targets resolve', async () => {
  for (const [page, html] of htmlPages) {
    const pageIds = ids(html);
    assert.equal(new Set(pageIds).size, pageIds.length, `${page}: duplicate IDs make anchors ambiguous`);
    for (const match of html.matchAll(/<[a-z][^>]*>/gi)) {
      const attrs = attributes(match[0]);
      for (const kind of ['href', 'src']) {
        if (!(kind in attrs)) continue;
        const reference = attrs[kind];
        assert.ok(reference.trim(), `${page}: empty ${kind}`);
        const url = new URL(reference, `${origin}${pageRoutes[page]}`);
        if (url.origin !== origin) continue;
        const pathname = decodeURIComponent(url.pathname);
        // Only the declared public routes map to HTML files. Assets must match exactly.
        const target = routeTargets.get(pathname) ?? pathname.slice(1);
        assert.ok(files.includes(target), `${page}: broken ${kind} ${reference}`);
        if (publicPages.has(target)) {
          assert.equal(pathname, pageRoutes[target], `${page}: use the canonical route for ${reference}`);
        }
        if (url.hash && htmlPages.has(target)) {
          const anchor = decodeURIComponent(url.hash.slice(1));
          assert.ok(ids(htmlPages.get(target)).includes(anchor), `${page}: missing anchor ${reference}`);
        }
      }
    }
  }
});

test('every public HTML page has its own canonical, title and descriptive metadata', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [page, html] of htmlPages) {
    const canonical = elements(html, 'link').filter(link => link.rel?.split(/\s+/).includes('canonical'));
    assert.equal(canonical.length, 1, `${page}: expected one canonical`);
    assert.equal(canonical[0].href, `${origin}${pageRoutes[page]}`);
    const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    assert.ok(title && title.length >= 12 && /leela/i.test(title), `${page}: missing useful branded title`);
    assert.ok(!titles.has(title), `${page}: duplicate title`);
    titles.add(title);
    const description = elements(html, 'meta').find(meta => meta.name === 'description')?.content?.trim();
    assert.ok(description && description.split(/\s+/).length >= 6, `${page}: missing descriptive summary`);
    assert.ok(!/\b(?:todo|lorem ipsum|undefined)\b/i.test(description), `${page}: placeholder metadata`);
    assert.ok(!descriptions.has(description), `${page}: duplicated description`);
    descriptions.add(description);
    assert.equal(elements(html, 'h1').length, 1, `${page}: expected a clear main heading`);
  }
});

test('sitemap lists every indexable canonical route without legacy redirects', async () => {
  const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
  const expected = Object.entries(pageRoutes).filter(([file]) => file !== '404.html')
    .map(([, route]) => `${origin}${route}`);
  assert.equal(urls.length, new Set(urls).size, 'Sitemap must not duplicate canonical URLs');
  assert.deepEqual(new Set(urls), new Set(expected), 'Sitemap must include exactly the indexable canonical routes');
  for (const address of urls) {
    const url = new URL(address);
    assert.equal(url.origin, origin, `Unexpected sitemap host: ${address}`);
    assert.equal(url.search + url.hash, '', `Sitemap route has a query or fragment: ${address}`);
    const target = routeTargets.get(url.pathname);
    assert.ok(target && htmlPages.has(target), `Sitemap URL has no published page: ${address}`);
    const canonical = elements(htmlPages.get(target), 'link').find(link => link.rel === 'canonical');
    assert.equal(canonical?.href, address, `Sitemap and page canonical disagree: ${address}`);
  }
});

test('published text keeps internal planning material out', async () => {
  for (const file of files.filter(file => /\.(?:html|css|js|xml|svg|txt)$/.test(file) && !file.startsWith('fonts/'))) {
    const content = await readFile(join(output, file), 'utf8');
    assert.doesNotMatch(content, /(?:\.impeccable\/|\.codex\/|\.env\b|PRODUCT\.md|DESIGN\.md|\.prompt\.txt|\/Users\/)/i,
      `${file}: internal planning or environment reference leaked`);
  }
});

test('fonts remain local and pages do not load Google Analytics', async () => {
  for (const file of files.filter(file => /\.(?:html|css|js)$/.test(file))) {
    const content = await readFile(join(output, file), 'utf8');
    assert.doesNotMatch(content, /fonts\.(?:googleapis|gstatic)\.com|use\.typekit\.net|google-analytics\.com|googletagmanager\.com|\bgtag\s*\(|\bGoogleAnalyticsObject\b/i,
      `${file}: unapproved remote font or analytics integration`);
    if (!file.endsWith('.css')) continue;
    for (const match of content.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi)) {
      const url = new URL(match[1], `${origin}/${file}`);
      if (/\.(?:woff2?|ttf|otf)$/i.test(url.pathname)) {
        assert.equal(url.origin, origin, `${file}: remote font ${match[1]}`);
        assert.ok(files.includes(decodeURIComponent(url.pathname.slice(1))), `${file}: missing font ${match[1]}`);
      }
    }
  }
});

test('contact controls have explicit labels and an accessible submission status', () => {
  let contactForms = 0;
  for (const [page, html] of htmlPages) {
    for (const match of html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/gi)) {
      const form = match[0];
      const controls = [...elements(form, 'input'), ...elements(form, 'select'), ...elements(form, 'textarea')];
      if (!controls.some(control => control.type === 'email')) continue;
      contactForms += 1;
      const labels = elements(form, 'label');
      for (const control of controls) {
        if (['hidden', 'submit', 'button', 'reset'].includes(control.type)) continue;
        assert.ok(control.id, `${page}: ${control.name || 'form control'} has no label target`);
        assert.equal(labels.filter(label => label.for === control.id).length, 1,
          `${page}: ${control.id} needs one explicit label`);
      }
      for (const label of labels.filter(label => label.for)) {
        assert.ok(controls.some(control => control.id === label.for), `${page}: orphan label ${label.for}`);
      }
      const statuses = [...form.matchAll(/<[a-z][^>]*>/gi)].map(tag => attributes(tag[0]))
        .filter(attrs => attrs.role === 'status');
      assert.equal(statuses.length, 1, `${page}: contact form needs a submission status region`);
    }
  }
  assert.ok(contactForms > 0, 'The published site must provide an accessible contact form');
});
