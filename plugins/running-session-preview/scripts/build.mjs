import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const manifest = JSON.parse(await read('package.json'));
const dictionaries = {};
for (const language of ['en', 'ru']) {
  const { meta, ...copy } = JSON.parse(await read(`locale/${language}.json`));
  dictionaries[language] = copy;
}
const helpers = (await read('src/preview.js')).replace(/^export /gm, '');
const client = (await read('src/client.js'))
  .replace('/* PREVIEW_HELPERS */', helpers)
  .replace('/* DICTIONARIES */', JSON.stringify(dictionaries));
if (!client.includes(`id: '${manifest.name}'`)) throw new Error('Module ID mismatch');
await mkdir(new URL('dist/', root), { recursive: true });
await writeFile(new URL('dist/client.js', root), client);
await writeFile(new URL('dist/index.js', root), await read('src/index.js'));
console.log(`Built ${manifest.name}@${manifest.version} at ${fileURLToPath(new URL('dist/', root))}`);
