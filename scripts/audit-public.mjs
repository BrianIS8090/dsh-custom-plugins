#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(scriptDir, '..');
const args = process.argv.slice(2);
const root = path.resolve(args[0] || defaultRoot);
const jsonIndex = args.indexOf('--json');
const jsonPath = jsonIndex >= 0 ? path.resolve(args[jsonIndex + 1]) : null;
const findings = [];
const scanned = { files: 0, textFiles: 0, bytes: 0 };
const skippedDirectories = new Set(['.git', 'node_modules']);
const skippedFiles = new Set(['security-audit-local.json']);
const textExtensions = new Set([
  '.cjs', '.css', '.csv', '.d.ts', '.html', '.js', '.json', '.jsx', '.md', '.mjs',
  '.mts', '.ps1', '.py', '.sh', '.svg', '.ts', '.tsx', '.txt', '.yaml', '.yml', '.xml',
]);
const forbiddenNames = [
  /^\.env(?:\..+)?$/i,
  /^\.credentials\.ya?ml$/i,
  /^credentials(?:\.local)?\.json$/i,
  /^(?:migration-(?:source|vectors|report)|translation-(?:input|output)-\d+)\.json$/i,
  /^(?:id_rsa|id_ed25519)(?:\.|$)/i,
];
const forbiddenExtensions = new Set(['.pem', '.key', '.p12', '.pfx', '.keystore', '.sqlite', '.sqlite3', '.db', '.tgz', '.zip', '.7z', '.bak']);
const placeholder = /(?:^|[-_])(?:test|testing|dummy|example|sample|fake|invalid|never|placeholder|your|replace|changeme|redacted|masked|user|username|alice|bob|demo|runner|x)(?:[-_]|$)|<[^>]+>|\$\{[^}]+\}|xxxx|\.\.\./i;
const testPath = /(?:^|\/)(?:test|tests|testing|fixtures)(?:\/|$)/i;
const currentUser = os.userInfo().username;

function add(severity, rule, relativePath, line = null, detail = '') {
  findings.push({ severity, rule, path: relativePath.split(path.sep).join('/'), line, detail });
}

function isTestPath(relativePath) {
  return testPath.test(relativePath.split(path.sep).join('/'));
}

function secretSeverity(relativePath) {
  return isTestPath(relativePath) ? 'warning' : 'error';
}

function isText(file) {
  const lower = file.toLowerCase();
  if (lower.endsWith('.d.ts')) return true;
  const ext = path.extname(lower);
  return textExtensions.has(ext) || ['license', 'notice', 'agents.md', 'readme'].includes(path.basename(lower));
}

function inspectFile(absolute) {
  const relative = path.relative(root, absolute);
  const base = path.basename(absolute);
  const ext = path.extname(base);
  const stat = fs.statSync(absolute);
  scanned.files += 1;
  scanned.bytes += stat.size;
  if ((forbiddenNames.some(rule => rule.test(base)) && base !== '.env.example') || forbiddenExtensions.has(ext.toLowerCase())) {
    add('error', 'forbidden-file', relative, null, 'Локальные данные, архивы, ключи и резервные копии не публикуются.');
  }
  if (stat.size > 10 * 1024 * 1024) add('warning', 'large-file', relative, null, `${stat.size} bytes; требуется ручная проверка назначения.`);
  if (!isText(base) || stat.size > 10 * 1024 * 1024) return;
  let text;
  try { text = fs.readFileSync(absolute, 'utf8'); } catch { return; }
  if (text.includes('\0')) return;
  scanned.textFiles += 1;
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const at = index + 1;
    const checks = [
      ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/],
      ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/],
      ['openai-style-key', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}\b/],
      ['aws-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
      ['slack-token', /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
      ['jwt', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/],
      ['private-key-file', /(?:^|[\\/])[^\s'"]+\.(?:pem|key|p12|pfx)(?:\s|$)/i],
    ];
    for (const [rule, regex] of checks) {
      const match = line.match(regex);
      if (match && !placeholder.test(match[0])) add(secretSeverity(relative), rule, relative, at);
    }
    const assignment = line.match(/(?:api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|password|passwd|previewToken)\s*[:=]\s*['"]([^'"]+)['"]/i);
    if (assignment && assignment[1].length >= 8 && !placeholder.test(assignment[1]) && !/^(?:process\.env|undefined|null|never)$/i.test(assignment[1])) {
      add(secretSeverity(relative), 'hardcoded-credential', relative, at);
    }
    const windowsUser = line.match(/(?<![A-Za-z0-9])[A-Za-z]:[\\/](?:Users|home)[\\/]([^\\/\s'"]+)/i);
    if (windowsUser && !placeholder.test(windowsUser[1])) {
      const severity = windowsUser[1].toLowerCase() === currentUser.toLowerCase() ? 'error' : 'warning';
      add(severity, 'personal-absolute-path', relative, at, 'Проверить путь локального пользователя.');
    } else if (!isTestPath(relative) && /(?<![A-Za-z0-9])[A-Za-z]:[\\/][^\s'"]+/.test(line)) add('warning', 'machine-absolute-path', relative, at);
    if (/(?:^|[^A-Za-z0-9])(?:\d{1,3}\.){3}\d{1,3}(?:[^0-9]|$)/.test(line) && !/127\.0\.0\.1|0\.0\.0\.0|255\.255\.255\.255/.test(line)) {
      add('warning', 'ip-address-review', relative, at);
    }
    if (/group7lamp\.ru/i.test(line)) add('warning', 'private-domain-review', relative, at, 'Подтвердить, что публичное раскрытие endpoint допустимо.');
    if (/(?:BEGIN|END) (?:RSA |EC |OPENSSH )?PRIVATE KEY/.test(line)) add(secretSeverity(relative), 'private-key-material', relative, at);
  });
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) {
      add('error', 'forbidden-directory', path.relative(root, path.join(directory, entry.name)), null, 'Каталог не должен входить в публичный репозиторий.');
      continue;
    }
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.isFile() && !skippedFiles.has(entry.name)) inspectFile(absolute);
    else if (entry.isSymbolicLink()) add('error', 'symbolic-link', path.relative(root, absolute), null, 'Symlink может вести к локальным данным вне репозитория.');
  }
}

if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`Audit root is not a directory: ${root}`);
  process.exit(2);
}
walk(root);
const errors = findings.filter(item => item.severity === 'error').length;
const warnings = findings.filter(item => item.severity === 'warning').length;
const report = {
  schema: 1,
  root: '.',
  scanned,
  summary: { errors, warnings, passed: errors === 0 },
  findings: findings.sort((a, b) => a.path.localeCompare(b.path) || (a.line || 0) - (b.line || 0) || a.rule.localeCompare(b.rule)),
};
const rendered = JSON.stringify(report, null, 2) + '\n';
if (jsonPath) {
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, rendered);
}
console.log(`Scanned ${scanned.files} files (${scanned.textFiles} text), ${scanned.bytes} bytes.`);
console.log(`Result: ${errors} errors, ${warnings} warnings.`);
for (const item of report.findings) {
  console.log(`${item.severity.toUpperCase()} ${item.rule} ${item.path}${item.line ? `:${item.line}` : ''}${item.detail ? ` — ${item.detail}` : ''}`);
}
if (!jsonPath) console.log('Pass --json <path> to save a machine-readable report without matched values.');
process.exit(errors === 0 ? 0 : 1);
