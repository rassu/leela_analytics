/**
 * Full-name Leela Analytics identity. Run: node scripts/generate-brand-assets.mjs
 * Uses the checked-in Manrope font, installed HarfBuzz (`hb-view`) and existing sharp.
 * No font installation, network access, browser, or image generation is required.
 * Every letter is exported as a real glyph outline, so SVGs need no external fonts.
 * Both words always share one Manrope instance, point size and weight (650).
 */
import {execFileSync} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'src/assets');
const font = join(root, 'src/fonts/manrope.ttf');
const color = {ink: '#202a24', forest: '#263c31', mineral: '#e1ebec', light: '#f4f6ed'};
const cache = new Map();

function xml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
}

function glyphs(text, weight = 650) {
  const key = `${weight}:${text}`;
  if (cache.has(key)) return cache.get(key);
  const raw = execFileSync('hb-view', [font, text, `--variations=wght=${weight}`,
    '--font-size=96', '--font-extents=75,23,0', '--margin=0',
    '--background=00000000', '--foreground=ffffff', '--output-format=svg'], {encoding: 'utf8'});
  const definitions = new Map([...raw.matchAll(/<g id="([^"]+)">([\s\S]*?)<\/g>/g)]
    .map(([, id, shape]) => [id, shape.trim()]));
  const uses = [...raw.matchAll(/<use xlink:href="#([^"]+)" x="([^"]+)" y="([^"]+)"\/>/g)];
  if (!uses.length) throw new Error('HarfBuzz did not produce outlined glyphs.');
  // Strip Cairo's glyph definitions/IDs by expanding paths at their shaped positions.
  const paths = uses.map(([, id, x, y]) => `<g transform="translate(${x} ${Number(y) - 75})">${definitions.get(id) || ''}</g>`).join('');
  const value = {paths, width: Number(raw.match(/<svg[^>]* width="([\d.]+)"/)[1])};
  cache.set(key, value);
  return value;
}

function text(text, x, baseline, size, fill, weight = 650) {
  return `<g aria-label="${xml(text)}" fill="${fill}" transform="translate(${x} ${baseline}) scale(${size / 96})">${glyphs(text, weight).paths}</g>`;
}

function arrow(x, y, length, size, stroke, fill) {
  return `<path d="M${x} ${y}H${x + length}M${x + length - size} ${y - size}L${x + length} ${y}L${x + length - size} ${y + size}" fill="none" stroke="${fill}" stroke-width="${stroke}" stroke-linecap="square" stroke-linejoin="miter"/>`;
}

function svg(width, height, content, title, description = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="brand-title brand-description"><title id="brand-title">${xml(title)}</title><desc id="brand-description">${xml(description || 'Leela Analytics. Both words appear in the same Manrope weight and size, with a forward arrow.')}</desc>${content}</svg>\n`;
}

function wordmark(fill) {
  return svg(832, 128, arrow(18, 62, 64, 15, 5.5, fill) + text('Leela Analytics', 110, 87, 96, fill), 'Leela Analytics');
}

const icon = svg(512, 512,
  `<rect width="512" height="512" fill="${color.forest}"/>`
  + arrow(49, 119, 91, 15, 6, color.mineral)
  + text('Leela', 39, 225, 96, color.light)
  + text('Analytics', 39, 332, 96, color.light),
  'Leela Analytics', 'Full Leela Analytics name stacked at an equal type size with a forward arrow on forest green.');

const social = svg(1200, 630,
  `<rect width="1200" height="630" fill="${color.mineral}"/>`
  + arrow(81, 117, 109, 20, 7, color.forest)
  + text('Leela Analytics', 72, 286, 132, color.ink)
  + text('AI, grounded in your world.', 79, 381, 43, color.forest, 500)
  + `<rect y="548" width="1200" height="82" fill="${color.forest}"/>`
  + text('leelaanalytics.com', 81, 600, 25, color.light, 500)
  + arrow(1054, 589, 62, 12, 3.5, color.light),
  'Leela Analytics — AI, grounded in your world.');

const banner = svg(4200, 700,
  `<rect width="4200" height="700" fill="${color.mineral}"/>`
  + arrow(1280, 299, 208, 43, 15, color.forest)
  + text('Leela Analytics', 1570, 355, 218, color.ink)
  + text('AI, grounded in your world.', 1587, 480, 60, color.forest, 500)
  + `<rect y="630" width="4200" height="70" fill="${color.forest}"/>`,
  'Leela Analytics', 'LinkedIn company cover with the full name and arrow positioned clear of the lower-left profile image.');

await mkdir(assets, {recursive: true});
const masters = {
  'leela-analytics-wordmark-light.svg': wordmark(color.light),
  'leela-analytics-wordmark-dark.svg': wordmark(color.ink),
  'leela-analytics-icon.svg': icon,
  'leela-analytics-social.svg': social,
  'leela-analytics-linkedin-banner.svg': banner,
};
for (const [name, contents] of Object.entries(masters)) await writeFile(join(assets, name), contents);

async function png(source, name, width, height) {
  await sharp(Buffer.from(source), {density: 192}).resize(width, height)
    .png({compressionLevel: 9, palette: false}).toFile(join(assets, name));
}
await Promise.all([
  png(masters['leela-analytics-wordmark-light.svg'], 'leela-analytics-wordmark-light.png', 1664, 256),
  png(masters['leela-analytics-wordmark-dark.svg'], 'leela-analytics-wordmark-dark.png', 1664, 256),
  png(icon, 'leela-analytics-profile.png', 512, 512),
  png(icon, 'leela-analytics-favicon.png', 64, 64),
  png(icon, 'leela-analytics-apple-touch-icon.png', 180, 180),
  png(social, 'leela-analytics-social.png', 1200, 630),
  png(banner, 'leela-analytics-linkedin-banner.png', 4200, 700),
]);

// Standard ICO directory with PNG payloads at 16, 32 and 64px; no extra converter.
const sizes = [16, 32, 64];
const frames = await Promise.all(sizes.map(size => sharp(Buffer.from(icon)).resize(size, size).png().toBuffer()));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
frames.forEach((frame, i) => {
  const entry = 6 + i * 16;
  directory[entry] = sizes[i]; directory[entry + 1] = sizes[i];
  directory.writeUInt16LE(1, entry + 4); directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frame.length, entry + 8); directory.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile(join(assets, 'leela-analytics-favicon.ico'), Buffer.concat([directory, ...frames]));
console.log(`Generated ${Object.keys(masters).length} outlined SVG masters, 7 PNGs and a 3-size favicon in src/assets/.`);
