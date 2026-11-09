import { existsSync } from 'node:fs';
import path from 'node:path';

const REQUIRED_PACKAGES = [
  'dsh-experimental-agent-team',
  'dsh-experimental-tool-agent-team',
];
const PACKAGE_ROOT_PARTS = ['dsh', 'node_modules', '@deepseek-ai'];

function present(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Return the app.asar prefix when a path names the archive or one of its members. */
export function appAsarFromPath(value) {
  if (!present(value)) return undefined;
  const absolute = path.resolve(value);
  const match = /^(?:.*[\\/])?app\.asar(?=$|[\\/])/iu.exec(absolute);
  return match ? absolute.slice(0, match[0].length) : undefined;
}

function packageRoot(appAsar) {
  return path.join(appAsar, ...PACKAGE_ROOT_PARTS);
}

/** Candidate roots in host-authority order: Electron resources, executable, then app entry. */
export function candidateDshRoots(env = process) {
  const candidates = [];
  const seen = new Set();
  const add = appAsar => {
    const root = packageRoot(appAsar);
    // Keep case variants: Contents/Resources is distinct from resources on macOS.
    const key = root;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push(root);
  };

  if (present(env.resourcesPath)) {
    add(appAsarFromPath(env.resourcesPath) ?? path.join(path.resolve(env.resourcesPath), 'app.asar'));
  }

  if (present(env.execPath)) {
    const executable = path.resolve(env.execPath);
    const containingArchive = appAsarFromPath(executable);
    if (containingArchive) add(containingArchive);
    let directory = path.dirname(executable);
    // Covers <install>/resources on Windows/Linux and Contents/Resources on macOS.
    for (let depth = 0; depth < 6; depth++) {
      add(path.join(directory, 'resources', 'app.asar'));
      add(path.join(directory, 'Resources', 'app.asar'));
      const parent = path.dirname(directory);
      if (parent === directory) break;
      directory = parent;
    }
  }

  const entryArchive = appAsarFromPath(env.argv?.[1]);
  if (entryArchive) add(entryArchive);
  return candidates;
}

function hasHostPackages(root, fileExists) {
  return REQUIRED_PACKAGES.every(name => fileExists(path.join(root, name, 'package.json')));
}

/** Resolve shared classes only from the single installed DSH host, never a second npm copy. */
export function resolveInstalledDshRoot({ env = process, fileExists = existsSync } = {}) {
  const candidates = candidateDshRoots(env);
  const root = candidates.find(candidate => hasHostPackages(candidate, fileExists));
  if (root) return root;
  const checked = candidates.length > 0 ? `\nChecked:\n${candidates.map(candidate => `- ${candidate}`).join('\n')}` : '';
  throw new Error(
    'Unable to locate the Team packages in the installed DeepSeek Harness host. '
    + 'Run this bundle inside the packaged DSH Desktop installation. The resolver checked '
    + 'process.resourcesPath, process.execPath, and process.argv[1] for '
    + 'app.asar/dsh/node_modules/@deepseek-ai. Installing duplicate DSH/Cordis packages is not supported.'
    + checked,
  );
}
