import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {readTarGz} from '../scripts/lib/tar.mjs';
import {satisfiesCaretRange} from '../scripts/lib/semver.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const work=path.join(root,'dist','work');
const lock=JSON.parse(fs.readFileSync(path.join(root,'upstream.lock.json'),'utf8'));

function archiveWithEntry(name,type=0){
 const header=Buffer.alloc(512);
 header.write(name,0,100,'utf8');
 header.write('0000644\0',100);
 header.write('0000000\0',108);
 header.write('0000000\0',116);
 header.write('00000000000\0',124);
 header.write('00000000000\0',136);
 header.write('        ',148);
 header[156]=type;
 header.write('ustar\0',257);
 header.write('00',263);
 const checksum=header.reduce((sum,byte)=>sum+byte,0);
 header.write(checksum.toString(8).padStart(6,'0')+'\0 ',148);
 return zlib.gzipSync(Buffer.concat([header,Buffer.alloc(1024)]));
}

test('upstream lock pins five official HTTPS tarballs with SHA512 integrity',()=>{
 assert.equal(lock.packages.length,5);
 for(const entry of lock.packages){
  const url=new URL(entry.tarball);
  assert.equal(url.protocol,'https:');
  assert.equal(url.hostname,'registry.npmjs.org');
  assert.match(entry.integrity,/^sha512-[A-Za-z0-9+/]{86}==$/);
  const bytes=fs.readFileSync(path.join(work,'downloads',`${entry.name}-${entry.version}.tgz`));
  assert.equal('sha512-'+crypto.createHash('sha512').update(bytes).digest('base64'),entry.integrity);
  assert.equal(JSON.parse(fs.readFileSync(path.join(work,'upstream',entry.name,'package.json'),'utf8')).license,'MIT');
  assert.ok(fs.existsSync(path.join(work,'upstream',entry.name,'LICENSE')));
 }
});

test('build metadata satisfies Source peers while prerelease does not',()=>{
 for(const range of ['^0.5.19','^0.5.37','^0.5.40'])assert.ok(satisfiesCaretRange('0.5.42+ru.2',range));
 assert.equal(satisfiesCaretRange('0.5.42-ru.2','^0.5.19'),false);
 assert.equal(satisfiesCaretRange('0.6.0','^0.5.19'),false);
});

test('tar reader rejects traversal and links before extraction',()=>{
 assert.throws(()=>readTarGz(archiveWithEntry('package/../outside')),/Unsafe archive path/);
 assert.throws(()=>readTarGz(archiveWithEntry('package/link',50)),/not allowed/);
 assert.throws(()=>readTarGz(archiveWithEntry('outside/file')),/Unexpected npm archive root/);
});
