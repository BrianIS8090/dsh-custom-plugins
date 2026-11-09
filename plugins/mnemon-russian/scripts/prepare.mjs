import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { extractNpmTarGz } from './lib/tar.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const work = path.join(root, 'dist', 'work');
const lock = JSON.parse(fs.readFileSync(path.join(root, 'upstream.lock.json'), 'utf8'));
if (lock.schemaVersion !== 1 || !Array.isArray(lock.packages) || lock.packages.length !== 5) throw Error('Unexpected upstream lock');
fs.rmSync(work, { recursive: true, force: true });
const downloads = path.join(work, 'downloads');
const upstream = path.join(work, 'upstream');
fs.mkdirSync(downloads, { recursive: true });
fs.mkdirSync(upstream, { recursive: true });

const receipt = [];
for (const entry of lock.packages) {
  const url = new URL(entry.tarball);
  assert.equal(url.protocol, 'https:');
  assert.equal(url.hostname, 'registry.npmjs.org');
  assert.match(entry.integrity, /^sha512-[A-Za-z0-9+/]{86}==$/);
  const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw Error(`${entry.name}: npm download failed with HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 25 * 1024 * 1024) throw Error(`${entry.name}: unexpectedly large tarball`);
  const integrity = 'sha512-' + crypto.createHash('sha512').update(bytes).digest('base64');
  assert.equal(integrity, entry.integrity, `${entry.name}: upstream integrity mismatch`);
  const destination = path.join(upstream, entry.name);
  extractNpmTarGz(bytes, destination);
  const manifest = JSON.parse(fs.readFileSync(path.join(destination, 'package.json'), 'utf8'));
  assert.equal(manifest.name, entry.name);
  assert.equal(manifest.version, entry.version);
  assert.equal(manifest.license, 'MIT');
  assert.ok(fs.existsSync(path.join(destination, 'LICENSE')), `${entry.name}: missing MIT LICENSE`);
  const filename = `${entry.name}-${entry.version}.tgz`;
  fs.writeFileSync(path.join(downloads, filename), bytes, { flag: 'wx' });
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  receipt.push({ name: entry.name, version: entry.version, tarball: entry.tarball, integrity, sha256 });
  console.log(`Verified ${entry.name}@${entry.version} (${bytes.length} bytes)`);
}
fs.writeFileSync(path.join(work, 'prepare-receipt.json'), JSON.stringify({ schemaVersion: 1, packages: receipt }, null, 2) + '\n');
console.log('Prepared five verified upstream packages in dist/work/upstream.');
