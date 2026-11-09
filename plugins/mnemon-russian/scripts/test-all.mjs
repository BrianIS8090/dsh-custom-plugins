#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tests = directory => fs.readdirSync(path.join(root, directory))
  .filter(name => name.endsWith('.test.mjs'))
  .sort()
  .map(name => path.join(directory, name));
const steps = [
  ['clean', ['scripts/clean.mjs']],
  ['prepare', ['scripts/prepare.mjs']],
  ['build', ['scripts/build.mjs']],
  ['build sources', ['scripts/build-sources.mjs']],
  ['main tests', ['--test', '--test-isolation=none', ...tests('test')]],
  ['prepare guard', ['../mnemon-russian-guard/scripts/prepare.mjs']],
  ['guard tests', ['--test', '--test-isolation=none', ...tests('../mnemon-russian-guard/test')]],
  ['pack', ['scripts/pack.mjs']],
  ['audit tarball', ['scripts/audit-dist.mjs']],
];
for (const [label, args] of steps) {
  console.log(`\n[mnemon] ${label}`);
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('\nMnemon clean build, tests, pack and tarball audit passed.');
