import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (name) => readFileSync(resolve(root, name), 'utf8');
const manifest = JSON.parse(read('package.json'));
const source = read('client.js');

test('manifest exports every runtime and display resource', () => {
  assert.equal(manifest.name, '@local/7lamp-harness');
  for (const target of Object.values(manifest.exports)) {
    if (!target.includes('*')) assert.ok(existsSync(resolve(root, target)), target);
  }
  assert.equal(manifest.dsh.client.platform, 'web');
  assert.equal(manifest.dsh.client.immediately, true);
  assert.equal(manifest.scripts.preinstall, undefined);
  assert.equal(manifest.scripts.postinstall, undefined);
  assert.equal(manifest.dependencies, undefined);
});

test('English, Russian and Chinese contain specific display metadata', () => {
  for (const language of ['en', 'ru', 'zh']) {
    const { meta } = JSON.parse(read(`locale/${language}.json`));
    assert.ok(meta.title.includes('7LAMP HARNESS'));
    assert.ok(meta.description.length > 40);
    assert.ok(!meta.title.includes('decoration'));
  }
});

test('local bundle patch inserts only its own plugin', () => {
  assert.match(read('cordis.patch.yml'), /id: sevenlamp-harness/);
  assert.match(read('cordis.patch.yml'), /name: '@local\/7lamp-harness'/);
  assert.doesNotMatch(read('cordis.patch.yml'), /override:|disabled:/);
});

test('theme provides mode pairs and core UI-kit palette', () => {
  const matches = [...source.matchAll(/'(--[\w-]+)': pair\(([^\n]+)\)/g)];
  assert.ok(matches.length >= 14);
  assert.ok(matches.some(([, name]) => name === '--dsw-specific-sidebar-fill'));
  for (const [, name, argumentsText] of matches) {
    assert.match(argumentsText, /^'[^']+'(?:, '[^']+')?$/u, name);
  }
  for (const color of ['#272446', '#c61938', '#f6f7f9', '#eef1f4', '#171622']) {
    assert.ok(source.includes(color), color);
  }
});

test('theme and branding use owned effects and inspected slots', () => {
  assert.match(source, /ctx\.effect\(\(\) => ctx\.theme\.overrideTokens/);
  assert.match(source, /ctx\.slots\.inject\(name, \(\) => ctx\.slots\.register/);
  for (const slot of ['sidebar.brand.mark', 'sidebar.brand.name', 'conversation.hero.brand.mark']) {
    assert.ok(source.includes(`'${slot}'`));
  }
  assert.match(source, /priority: -100/);
  assert.match(source, /locale: namespace/);
});

test('no DOM rewrites, timers, network fonts, private imports or preference writes', () => {
  assert.doesNotMatch(source, /document\.|MutationObserver|setInterval|setTimeout|fetch\(|https?:\/\//);
  assert.doesNotMatch(source, /setTheme\(|setFontSize\(|setFontFamily\(/);
  assert.deepEqual([...source.matchAll(/require\('([^']+)'\)/g)].map((match) => match[1]), ['react']);
  assert.ok(!source.includes('innerHTML'));
});

function palette() {
  const values = new Map();
  for (const match of source.matchAll(/'(--[\w-]+)': pair\('([^']+)'(?:, '([^']+)')?\)/g)) {
    assert.ok(!values.has(match[1]), `Duplicate token ${match[1]}`);
    values.set(match[1], { light: match[2], dark: match[3] ?? match[2] });
  }
  return values;
}
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}

test('solid actions have accessible foregrounds in both modes including hover', () => {
  const tokens = palette();
  for (const mode of ['light', 'dark']) {
    const foreground = tokens.get('--dsw-alias-label-primary-foreground')[mode];
    for (const name of ['button-primary-fill', 'button-primary-hover', 'button-info-fill', 'button-info-hover']) {
      const fill = tokens.get(`--dsw-alias-${name}`)[mode];
      assert.ok(contrast(foreground, fill) >= 4.5, `${name}/${mode}`);
    }
    const bubble = tokens.get('--dsw-specific-bubble')[mode];
    assert.ok(contrast(tokens.get('--dsw-alias-label-primary')[mode], bubble) >= 4.5);
  }
});

test('dark controls, bubble and off switch do not inherit neutral grey defaults', () => {
  const tokens = palette();
  for (const name of ['--dsw-alias-button-elevated-fill', '--dsw-specific-selector',
    '--dsw-specific-bubble', '--dsw-specific-bubble-highlight', '--dsw-alias-border-l3',
    '--dsw-alias-switch-thumb', '--dsw-alias-interactive-bg-hover-solid']) {
    assert.ok(tokens.has(name), name);
  }
  assert.equal(tokens.get('--dsw-alias-brand-primary').dark, '#c61938');
  assert.ok(contrast(tokens.get('--dsw-alias-switch-thumb').dark,
    tokens.get('--dsw-alias-border-l3').dark) >= 3);
});

test('guide hover and changed-file headers use solid indigo palette', () => {
  const tokens = palette();
  assert.equal(tokens.get('--dsw-alias-interactive-bg-hover').dark, '#322e54');
  assert.equal(tokens.get('--dsw-static-neutral-850').dark, '#211e38');
  assert.equal(tokens.get('--dsw-static-neutral-800').dark, '#322e54');
  assert.ok(contrast(tokens.get('--dsw-static-neutral-700').dark,
    tokens.get('--dsw-alias-bg-base').dark) >= 3, 'Guide compass contrast');
  assert.ok(contrast(tokens.get('--dsw-alias-label-primary').dark,
    tokens.get('--dsw-static-neutral-850').dark) >= 4.5, 'Changed file title contrast');
  assert.ok(!tokens.has('--dsw-static-green-500'), 'Do not recolor semantic green');
  assert.ok(!tokens.has('--dsw-static-red-600'), 'Do not recolor semantic red');
});

test('graphical brand mark stays hidden without restoring the whale fallback', () => {
  const mark = source.slice(source.indexOf('function BrandMark()'), source.indexOf('function BrandName('));
  assert.match(mark, /hidden: true/);
  assert.doesNotMatch(mark, /svg|path|rect|return null/);
});

test('palette icon is a small self-contained SVG', () => {
  const icon = read('icon.svg');
  assert.ok(Buffer.byteLength(icon) < 256 * 1024);
  assert.match(icon, /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(icon, /viewBox="0 0 64 64"/);
  assert.doesNotMatch(icon, /<script|<foreignObject|href=|<image/);
});
