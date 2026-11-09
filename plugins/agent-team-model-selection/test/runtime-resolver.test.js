import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { appAsarFromPath, candidateDshRoots, resolveInstalledDshRoot } from '../runtime-resolver.js';

const packageNames = ['dsh-experimental-agent-team', 'dsh-experimental-tool-agent-team'];
const rootAt = appAsar => path.join(appAsar, 'dsh', 'node_modules', '@deepseek-ai');
const manifestsAt = root => new Set(packageNames.map(name => path.join(root, name, 'package.json')));
const resolverAt = (root, env) => resolveInstalledDshRoot({
  env,
  fileExists: candidate => manifestsAt(root).has(candidate),
});

test('resourcesPath resolves the packaged Electron installation first', () => {
  const resourcesPath = path.resolve('fixtures', 'standard', 'resources');
  const expected = rootAt(path.join(resourcesPath, 'app.asar'));
  const env = {
    resourcesPath,
    execPath: path.resolve('fixtures', 'unused', 'dsh.exe'),
    argv: ['dsh'],
  };
  assert.equal(resolverAt(expected, env), expected);
  assert.equal(candidateDshRoots(env)[0], expected);
});

test('execPath finds the Windows/Linux resources directory without resourcesPath', () => {
  const execPath = path.resolve('fixtures', 'desktop', 'DeepSeek Harness.exe');
  const expected = rootAt(path.join(path.dirname(execPath), 'resources', 'app.asar'));
  assert.equal(resolverAt(expected, { execPath, argv: [execPath] }), expected);
});

test('execPath finds Contents/Resources in a macOS app bundle', () => {
  const execPath = path.resolve('fixtures', 'DeepSeek Harness.app', 'Contents', 'MacOS', 'DeepSeek Harness');
  const expected = rootAt(path.join(path.dirname(path.dirname(execPath)), 'Resources', 'app.asar'));
  assert.equal(resolverAt(expected, { execPath, argv: [execPath] }), expected);
});

test('argv[1] recovers the app.asar prefix for an entry inside the archive', () => {
  const appAsar = path.resolve('fixtures', 'entry', 'resources', 'app.asar');
  const expected = rootAt(appAsar);
  const env = {
    resourcesPath: path.resolve('fixtures', 'missing-resources'),
    execPath: path.resolve('fixtures', 'missing-bin', 'node'),
    argv: ['node', path.join(appAsar, 'dsh', 'entry.js')],
  };
  assert.equal(appAsarFromPath(env.argv[1]), appAsar);
  assert.equal(resolverAt(expected, env), expected);
});

test('a candidate is accepted only when both host Team package manifests exist', () => {
  const resourcesPath = path.resolve('fixtures', 'partial', 'resources');
  const root = rootAt(path.join(resourcesPath, 'app.asar'));
  const onlyAgent = path.join(root, 'dsh-experimental-agent-team', 'package.json');
  assert.throws(
    () => resolveInstalledDshRoot({ env: { resourcesPath, argv: [] }, fileExists: candidate => candidate === onlyAgent }),
    /Unable to locate the Team packages/,
  );
});

test('failure explains all portable fallbacks and rejects duplicate host packages', () => {
  assert.throws(
    () => resolveInstalledDshRoot({ env: { argv: [] }, fileExists: () => false }),
    error => {
      assert.match(error.message, /process\.resourcesPath, process\.execPath, and process\.argv\[1\]/);
      assert.match(error.message, /duplicate DSH\/Cordis packages is not supported/);
      assert.match(error.message, /packaged DSH Desktop installation/);
      return true;
    },
  );
});
