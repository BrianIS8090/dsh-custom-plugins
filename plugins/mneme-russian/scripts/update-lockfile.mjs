#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'mneme-lock-'));
const npmExec = process.env.npm_execpath;
let command;
let args;
if (typeof npmExec === 'string' && path.basename(npmExec).toLowerCase() === 'npm-cli.js' && fs.existsSync(npmExec)) {
  command = process.execPath;
  args = [npmExec, 'install', '--package-lock-only', '--ignore-scripts'];
} else if (process.platform === 'win32') {
  const npmCmd = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean).map(dir => path.join(dir, 'npm.cmd')).find(file => fs.existsSync(file));
  if (!npmCmd) throw new Error('npm.cmd was not found in PATH');
  const siblingCli = path.join(path.dirname(npmCmd), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  if (fs.existsSync(siblingCli)) {
    command = process.execPath;
    args = [siblingCli, 'install', '--package-lock-only', '--ignore-scripts'];
  } else {
    command = process.env.ComSpec ?? 'cmd.exe';
    args = ['/d', '/s', '/c', `""${npmCmd}" install --package-lock-only --ignore-scripts"`];
  }
} else {
  command = 'npm';
  args = ['install', '--package-lock-only', '--ignore-scripts'];
}
function run(cmd, argv, cwd) {
  const result = spawnSync(cmd, argv, { cwd, stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Command failed with exit code ${result.status}`);
}
try {
  fs.copyFileSync(path.join(root, 'package.json'), path.join(temporary, 'package.json'));
  run(command, args, temporary);
  fs.copyFileSync(path.join(temporary, 'package-lock.json'), path.join(root, 'package-lock.json'));
  run(process.execPath, ['scripts/build-runtime-manifest.mjs'], root);
} finally {
  const resolved = path.resolve(temporary);
  if (path.dirname(resolved) !== path.resolve(os.tmpdir()) || !path.basename(resolved).startsWith('mneme-lock-')) {
    throw new Error(`Refusing to remove unexpected temporary path: ${resolved}`);
  }
  fs.rmSync(resolved, { recursive: true, force: true });
}
