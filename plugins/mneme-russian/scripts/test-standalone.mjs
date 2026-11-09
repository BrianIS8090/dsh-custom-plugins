#!/usr/bin/env node
// Standalone package tests. Upstream monorepo-only checks are listed explicitly,
// never hidden behind a silent skip or reported as executed.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Map([
  ['pipeline.test.js', 'Requires the upstream repository pipeline definitions, which are not package runtime files.'],
  ['release-docs.test.js', 'Checks the upstream monorepo release documentation.'],
  ['release-workflow.test.js', 'Checks the upstream monorepo release workflow.'],
  ['security-doc.test.js', 'Checks the upstream monorepo security policy.'],
  ['test-count-sync.test.js', 'Checks badges in the upstream monorepo parent README.'],
  ['workflow-guards.test.js', 'Checks upstream monorepo CI/release workflows.'],
]);
const tests = fs.readdirSync(path.join(root, 'test'))
  .filter(name => /\.test\.(?:js|mjs)$/.test(name))
  .sort();
const selected = [];
for (const name of tests) {
  if (excluded.has(name)) console.log(`EXCLUDED ${name}: ${excluded.get(name)}`);
  else selected.push(path.join('test', name));
}
if (selected.length === 0) throw new Error('No standalone tests selected.');
console.log(`Standalone test files: ${selected.length}; excluded upstream-monorepo files: ${excluded.size}.`);
for (const [args, label] of [
  [['scripts/check-sync.js'], 'src/lib parity'],
  [['scripts/build-runtime-manifest.mjs', '--check'], 'runtime manifest'],
  [['--test', ...selected], 'standalone tests'],
]) {
  console.log(`\nRunning ${label}…`);
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
