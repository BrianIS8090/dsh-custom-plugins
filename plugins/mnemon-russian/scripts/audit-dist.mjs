import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { readTarGz } from './lib/tar.mjs';
import { satisfiesCaretRange } from './lib/semver.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const work = path.join(root, 'dist', 'work');
const manifest = JSON.parse(fs.readFileSync(path.join(work, 'package', 'package.json'), 'utf8'));
const filename = `${manifest.name}-${manifest.version}.tgz`;
const archive = path.join(root, 'dist', filename);
const bytes = fs.readFileSync(archive);
const entries = readTarGz(bytes);
const files = new Map(entries.filter(entry => !entry.directory).map(entry => [entry.relative, entry.data]));
const findings = [];
const scanPatterns = [
  ['private-key', /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/],
  ['known-token-pattern', /\b(?:sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35})\b/],
  ['jwt-like-token', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/],
  ['credential-in-url', /\b[a-z][a-z0-9+.-]*:\/\/[^\s/:@]+:[^\s/@]+@/i],
  ['absolute-user-path', /[A-Za-z]:[\\/](?:Users|Documents and Settings)[\\/]/i],
  ['local-profile-path', /\.dsh[\\/]profiles[\\/]/i],
];
for (const [relative, data] of files) {
  const lower = relative.toLowerCase();
  if (/(?:^|\/)(?:config|backups|inspection|originals|\.git|\.mnemon-russian-guard)(?:\/|$)/.test(lower)) findings.push(`${relative}:1: forbidden-file-or-directory`);
  if (/(?:^|\/)(?:memory\.md|user\.md|memories\.json|status\.json|journal\.json|\.env(?:\..*)?)$/.test(lower) || /\.(?:db|sqlite3?|duckdb|jsonl|tgz|zip|7z)$/.test(lower)) findings.push(`${relative}:1: forbidden-data-artifact`);
  if (data.includes(0)) continue;
  const lines = data.toString('utf8').split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    for (const [type, pattern] of scanPatterns) if (pattern.test(lines[index])) findings.push(`${relative}:${index + 1}: ${type}`);
  }
}
for (const relative of ['LICENSE', 'NOTICE.md', ...manifest.bundledDependencies.map(id => `node_modules/${id}/LICENSE`)]) {
  if (!files.has(relative)) findings.push(`${relative}:1: missing-required-license-or-notice`);
}
for (const [relative, data] of files) {
  const staged = path.join(work, 'package', ...relative.split('/'));
  if (!fs.existsSync(staged) || !fs.readFileSync(staged).equals(data)) findings.push(`${relative}:1: archive-staging-content-mismatch`);
}
assert.equal(manifest.version, '0.5.42+ru.2');
assert.equal(manifest.private, true);
assert.equal(manifest.repository, undefined);
for (const id of manifest.bundledDependencies) {
  const nested = JSON.parse(files.get(`node_modules/${id}/package.json`).toString('utf8'));
  assert.equal(nested.name, id);
  assert.ok(satisfiesCaretRange(manifest.version, nested.peerDependencies['dsh-mnemon']));
}
const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
const expectedSums = `${sha256}  ${filename}\n`;
assert.equal(fs.readFileSync(path.join(root, 'dist', 'SHA256SUMS.txt'), 'utf8'), expectedSums);
if (findings.length) throw Error('Tarball audit failed:\n' + [...new Set(findings)].join('\n'));
console.log(JSON.stringify({ result: 'PASS', archive: filename, members: entries.length, files: files.size, bytes: bytes.length, sha256, dangerousPaths: 0, secretFindings: 0, forbiddenArtifacts: 0 }));
