import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { Script } from 'node:vm';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const pkg = JSON.parse(await read('package.json'));
const name = '@local/running-session-preview';
assert.equal(pkg.name, name);
assert.equal(pkg.version, '1.2.1');
assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml');
for (const operation of JSON.parse(await read('cordis.patch.yml'))) {
  assert.deepEqual(Object.keys(operation), ['insert']);
  for (const row of operation.insert) {
    assert.ok(row.id.startsWith(name + ':'));
    assert.ok(row.name === name || row.name.startsWith(name + '/'));
  }
}
for (const [key, path] of Object.entries(pkg.exports)) {
  assert.ok(path.startsWith('./') && !path.includes('..'));
  if (key.includes('*')) {
    for (const locale of ['en', 'ru']) await stat(new URL(path.replace('*', locale), root));
  } else assert.ok((await stat(new URL(path, root))).isFile());
}
const client = await read('dist/client.js');
new Script(client, { filename: 'dist/client.js' });
assert.ok(!/require\(['"]@deepseek-ai\//.test(client));
assert.ok(!/document\.|localStorage|fetch\(|setInterval|remote\./.test(client));
assert.ok(client.includes("ctx.slots.inject('sidebar.session.row.hover'"));
assert.ok(client.includes("ctx.slots.inject('sidebar.session.row.trailing'"));
assert.ok(!client.includes('/* PREVIEW_HELPERS */') && !client.includes('/* DICTIONARIES */') && !client.includes('/* MARKDOWN_HELPERS */'));
assert.ok(!client.includes('dangerouslySetInnerHTML'));
const loaded = await import(new URL('dist/index.js', root));
assert.equal(typeof loaded.apply, 'function');
const en = JSON.parse(await read('locale/en.json'));
const ru = JSON.parse(await read('locale/ru.json'));
assert.deepEqual(Object.keys(en).sort(), Object.keys(ru).sort());
assert.ok(en.meta.title && en.meta.description && ru.meta.title && ru.meta.description);
const svg = await read('icon.svg');
assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"') && svg.includes('viewBox='));
assert.ok(Buffer.byteLength(svg) < 262144);
async function noLinks(url) {
  for (const entry of await readdir(url, { withFileTypes: true })) {
    assert.ok(!entry.isSymbolicLink(), `Unexpected symlink: ${entry.name}`);
    if (entry.isDirectory()) await noLinks(new URL(entry.name + '/', url));
  }
}
await noLinks(root);
console.log('Manifest, patch, exports, syntax, isolation, locales and packaged resources passed.');
