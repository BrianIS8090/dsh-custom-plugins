import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw Error('Refusing to clean an unexpected path');
fs.rmSync(dist, { recursive: true, force: true });
console.log('Removed generated dist directory.');
