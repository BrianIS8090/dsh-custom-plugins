import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const BLOCK = 512;
const text = (buffer, start, length) => buffer.subarray(start, start + length).toString('utf8').replace(/\0.*$/s, '').trim();
const octal = (buffer, start, length) => {
  const raw = text(buffer, start, length).trim();
  if (!raw) return 0;
  if (!/^[0-7]+$/.test(raw)) throw Error('Unsupported tar numeric field');
  return Number.parseInt(raw, 8);
};
const zeroBlock = header => header.every(byte => byte === 0);

function validEntryName(name) {
  if (!name || name.includes('\\') || name.includes('\0') || name.startsWith('/') || /^[A-Za-z]:/.test(name)) {
    throw Error('Unsafe archive path');
  }
  const parts = name.split('/');
  if (parts.some(part => !part || part === '.' || part === '..')) throw Error('Unsafe archive path');
  if (name !== 'package' && !name.startsWith('package/')) throw Error('Unexpected npm archive root');
  return name === 'package' ? '' : name.slice('package/'.length);
}

function paxValues(data) {
  const result = {};
  let offset = 0;
  while (offset < data.length) {
    const space = data.indexOf(0x20, offset);
    if (space < 0) throw Error('Invalid PAX record');
    const length = Number.parseInt(data.subarray(offset, space).toString('ascii'), 10);
    if (!Number.isSafeInteger(length) || length <= 0 || offset + length > data.length) throw Error('Invalid PAX record length');
    const record = data.subarray(space + 1, offset + length - 1).toString('utf8');
    const equals = record.indexOf('=');
    if (equals > 0) result[record.slice(0, equals)] = record.slice(equals + 1);
    offset += length;
  }
  return result;
}

export function readTarGz(bytes) {
  const tar = zlib.gunzipSync(bytes);
  const entries = [];
  const names = new Set();
  let offset = 0;
  let nextPax = {};
  let longName;
  while (offset + BLOCK <= tar.length) {
    const header = tar.subarray(offset, offset + BLOCK);
    if (zeroBlock(header)) break;
    const expected = octal(header, 148, 8);
    const actual = header.reduce((sum, byte, index) => sum + (index >= 148 && index < 156 ? 32 : byte), 0);
    if (expected !== actual) throw Error('Tar checksum mismatch');
    const baseSize = octal(header, 124, 12);
    const type = String.fromCharCode(header[156] || 48);
    const dataStart = offset + BLOCK;
    let size = baseSize;
    if (!['x', 'g', 'L', 'K'].includes(type) && nextPax.size !== undefined) {
      if (!/^\d+$/.test(nextPax.size)) throw Error('Invalid PAX file size');
      size = Number(nextPax.size);
    }
    if (!Number.isSafeInteger(size) || size < 0 || dataStart + size > tar.length) throw Error('Truncated tar entry');
    const data = tar.subarray(dataStart, dataStart + size);
    if (type === 'x' || type === 'g') {
      const values = paxValues(data);
      if (type === 'x') nextPax = values;
    } else if (type === 'L') {
      longName = data.toString('utf8').replace(/\0.*$/s, '').replace(/\n$/, '');
    } else if (type === 'K') {
      throw Error('Archive links are not allowed');
    } else {
      const prefix = text(header, 345, 155);
      const headerName = text(header, 0, 100);
      const name = nextPax.path ?? longName ?? (prefix ? `${prefix}/${headerName}` : headerName);
      const relative = validEntryName(name);
      if (relative) {
        if (names.has(relative)) throw Error('Duplicate archive entry');
        names.add(relative);
        if (type === '1' || type === '2') throw Error('Archive links are not allowed');
        if (type !== '0' && type !== '\0' && type !== '5') throw Error('Only regular files and directories are allowed');
        entries.push({ name, relative, directory: type === '5', mode: octal(header, 100, 8), data: Buffer.from(data) });
      }
      nextPax = {};
      longName = undefined;
    }
    offset = dataStart + Math.ceil(baseSize / BLOCK) * BLOCK;
  }
  if (!entries.some(entry => !entry.directory)) throw Error('Archive contains no files');
  return entries;
}

export function extractNpmTarGz(bytes, destination) {
  const root = path.resolve(destination);
  fs.mkdirSync(root, { recursive: true });
  for (const entry of readTarGz(bytes)) {
    const target = path.resolve(root, ...entry.relative.split('/'));
    if (target !== root && !target.startsWith(root + path.sep)) throw Error('Archive path escapes destination');
    if (entry.directory) {
      fs.mkdirSync(target, { recursive: true });
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, entry.data, { flag: 'wx', mode: entry.mode & 0o777 });
    }
  }
}
