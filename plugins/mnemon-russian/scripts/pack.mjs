import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { satisfiesCaretRange } from './lib/semver.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const work = path.join(root, 'dist', 'work');
const pkg = path.join(work, 'package');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(pkg, 'package.json'), 'utf8'));
assert.equal(manifest.version, '0.5.42+ru.2');
assert.equal(manifest.private, true);
assert.equal(manifest.repository, undefined);
for (const id of manifest.bundledDependencies) {
  const source = path.join(work, 'sources', id);
  const sourceManifest = JSON.parse(fs.readFileSync(path.join(source, 'package.json'), 'utf8'));
  assert.ok(satisfiesCaretRange(manifest.version, sourceManifest.peerDependencies['dsh-mnemon']), `${id}: incompatible dsh-mnemon peer range`);
  fs.rmSync(path.join(pkg, 'node_modules', id), { recursive: true, force: true });
  fs.cpSync(source, path.join(pkg, 'node_modules', id), { recursive: true });
}
fs.mkdirSync(dist, { recursive: true });
const filename = `${manifest.name}-${manifest.version}.tgz`;
const archive = path.join(dist, filename);
fs.rmSync(archive, { force: true });
const checksumFile = path.join(dist, 'SHA256SUMS.txt');
fs.rmSync(checksumFile, { force: true });
const npmExec = process.env.npm_execpath;
const useNpmExec = typeof npmExec === 'string' && path.basename(npmExec).toLowerCase() === 'npm-cli.js' && fs.existsSync(npmExec);
let command;
let args;
if (useNpmExec) {
  command = process.execPath;
  args = [npmExec, 'pack', '--ignore-scripts', '--loglevel=error', '--pack-destination', dist];
} else if (process.platform === 'win32') {
  const npmCmd = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean).map(dir => path.join(dir, 'npm.cmd')).find(file => fs.existsSync(file));
  if (!npmCmd) throw Error('npm.cmd was not found in PATH');
  const siblingCli = path.join(path.dirname(npmCmd), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  if (fs.existsSync(siblingCli)) {
    command = process.execPath;
    args = [siblingCli, 'pack', '--ignore-scripts', '--loglevel=error', '--pack-destination', dist];
  } else {
    command = process.env.ComSpec ?? 'cmd.exe';
    args = ['/d', '/s', '/c', `""${npmCmd}" pack --ignore-scripts --loglevel=error --pack-destination "${dist}""`];
  }
} else {
  command = 'npm';
  args = ['pack', '--ignore-scripts', '--loglevel=error', '--pack-destination', dist];
}
const result = spawnSync(command, args, { cwd: pkg, stdio: 'inherit', shell: false });
if (result.error) throw result.error;
if (result.status !== 0) throw Error(`npm pack failed with exit code ${result.status}`);
if (!fs.existsSync(archive)) throw Error(`Expected tarball was not created: ${filename}`);
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
fs.writeFileSync(checksumFile, `${sha256}  ${filename}\n`);
console.log(JSON.stringify({ archive: path.relative(root, archive), sha256 }));
