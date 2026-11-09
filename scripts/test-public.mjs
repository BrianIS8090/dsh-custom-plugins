#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function npmCommand() {
  if (process.env.DSH_PLUGINS_NPM) return { command: process.env.DSH_PLUGINS_NPM, args: [] };
  const npmExec = process.env.npm_execpath;
  if (typeof npmExec === 'string' && path.basename(npmExec).toLowerCase() === 'npm-cli.js' && fs.existsSync(npmExec)) {
    return { command: process.execPath, args: [npmExec] };
  }
  if (process.platform === 'win32') {
    const npmCmd = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean).map(dir => path.join(dir, 'npm.cmd')).find(file => fs.existsSync(file));
    if (!npmCmd) throw new Error('npm.cmd was not found in PATH');
    const siblingCli = path.join(path.dirname(npmCmd), 'node_modules', 'npm', 'bin', 'npm-cli.js');
    if (!fs.existsSync(siblingCli)) throw new Error(`npm-cli.js was not found beside ${npmCmd}`);
    return { command: process.execPath, args: [siblingCli] };
  }
  return { command: 'npm', args: [] };
}
const npm = npmCommand();
const packages = [
  ['agent-team-monitor', ['test']],
  ['agent-team-model-selection', ['test']],
  ['running-session-preview', ['build', 'test', 'check']],
  ['7lamp-harness', ['test', 'check']],
  ['dsh-cost-meter', ['test']],
  ['subscription-quota', ['test', 'check']],
  ['mnemon-russian', ['test']],
  ['mnemon-russian-guard', ['test']],
  ['mneme-russian', ['test']],
];
const args = process.argv.slice(2);
const onlyIndex = args.indexOf('--only');
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : null;
const results = [];

for (const [name, scripts] of packages) {
  if (only && name !== only) continue;
  const cwd = path.join(root, 'plugins', name);
  if (!fs.existsSync(path.join(cwd, 'package.json'))) {
    results.push({ name, script: 'preflight', code: 1, duration: 0 });
    console.error(`\n[missing] ${name}: package.json not found at ${cwd}`);
    continue;
  }
  for (const script of scripts) {
    const started = Date.now();
    console.log(`\n[run] ${name}: npm run ${script}`);
    const result = spawnSync(npm.command, [...npm.args, 'run', script], {
      cwd,
      env: { ...process.env, CI: '1' },
      stdio: 'inherit',
      shell: false,
    });
    const code = result.error ? 1 : (result.status ?? 1);
    const duration = Date.now() - started;
    results.push({ name, script, code, duration });
    if (result.error) console.error(`[error] ${name}: ${result.error.message}`);
    if (code !== 0 && only) break;
  }
}

console.log('\n=== Public plugin test summary ===');
for (const result of results) {
  console.log(`${result.code === 0 ? 'PASS' : 'FAIL'} ${result.name} / ${result.script} (${(result.duration / 1000).toFixed(1)}s)`);
}
const failed = results.filter(result => result.code !== 0);
if (results.length === 0) {
  console.error('No tests selected.');
  process.exit(2);
}
if (failed.length > 0) process.exit(1);
console.log(`All ${results.length} package steps passed.`);
