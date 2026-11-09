import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createGuard} from '../controller.mjs';

const ID='dsh-mnemon-source-runtime';
const upstream=fs.readFileSync(new URL('../../mnemon-russian/dist/work/upstream/dsh-mnemon-source-runtime/lib/client.js',import.meta.url),'utf8');

function fixture(t,{beforeCommit}={}){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'mnemon-ru-controller-'));
 // The entire verified, uniquely-created temporary directory belongs to this test.
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const stateDir=path.join(root,'state');
 const paths=new Map(),published=new Map(),rebuilds=[];
 let clock=0;
 const registry={
  clientPath:id=>paths.get(id),
  rebuilt(id){
   const file=paths.get(id);
   if(!file)return undefined;
   const bytes=fs.readFileSync(file,'utf8');
   published.set(id,bytes);
   rebuilds.push({id,file,bytes});
   return String(rebuilds.length);
  },
 };
 function pkg(name='first',source=upstream,version='0.5.18'){
  const dir=path.join(root,name),client=path.join(dir,'lib','client.js');
  fs.mkdirSync(path.dirname(client),{recursive:true});
  fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:ID,version,exports:{'./client':{default:'./lib/client.js'}}}));
  fs.writeFileSync(client,source);
  return client;
 }
 function select(file){paths.set(ID,file);published.set(ID,fs.readFileSync(file,'utf8'));}
 function controller(options={}){return createGuard({registry,stateDir,now:()=>clock,settleMs:100,beforeCommit,...options});}
 function settle(guard){guard.tick();clock+=101;guard.tick();}
 return {root,stateDir,registry,paths,published,rebuilds,pkg,select,controller,settle,advance:ms=>{clock+=ms;}};
}

function assertPatched(source){
 assert.match(source,/mnemon-russian-guard:v1 original=[a-f0-9]{64} body=[a-f0-9]{64}/);
 assert.match(source,/"runtime\.title":\s*"[^"\n]*[А-Яа-яЁё]/u);
 assert.notEqual(source,upstream);
}

test('two stable observations patch the real bundle and publish fresh registry bytes',t=>{
 const f=fixture(t),file=f.pkg();f.select(file);
 const guard=f.controller();
 guard.tick();
 assert.equal(fs.readFileSync(file,'utf8'),upstream);
 assert.equal(f.rebuilds.length,0);
 f.advance(99);guard.tick();
 assert.equal(fs.readFileSync(file,'utf8'),upstream);
 f.advance(1);guard.tick();
 const patched=fs.readFileSync(file,'utf8');assertPatched(patched);
 assert.equal(f.published.get(ID),patched);
 assert.equal(f.rebuilds.length,1);
 assert.equal(guard.status()[ID].status,'patched');
});

test('the same module id at a new package path is localized again',t=>{
 const f=fixture(t),first=f.pkg();f.select(first);
 const guard=f.controller();f.settle(guard);
 const second=f.pkg('replacement',upstream+'\n// next package generation\n','0.5.19');f.select(second);
 guard.tick();assert.equal(f.rebuilds.length,1);
 f.advance(101);guard.tick();
 assertPatched(fs.readFileSync(second,'utf8'));
 assert.equal(f.rebuilds.at(-1).file,second);
 assert.equal(f.published.get(ID),fs.readFileSync(second,'utf8'));
 assert.equal(f.rebuilds.length,2);
});

test('unknown client architecture remains byte-for-byte unchanged',t=>{
 const f=fixture(t),unknown='window.example = "unrecognized client architecture";\n',file=f.pkg('unknown',unknown);f.select(file);
 const guard=f.controller();f.settle(guard);
 assert.equal(fs.readFileSync(file,'utf8'),unknown);
 assert.equal(f.published.get(ID),unknown);
 assert.equal(f.rebuilds.length,0);
 assert.equal(guard.status()[ID].status,'incompatible');
 guard.stop();assert.equal(fs.readFileSync(file,'utf8'),unknown);
});

test('an installer changing source before commit is never overwritten',t=>{
 let file;
 const replacement=upstream+'\n// installer won the race\n';
 const f=fixture(t,{beforeCommit(){fs.writeFileSync(file,replacement);}});file=f.pkg();f.select(file);
 const guard=f.controller();f.settle(guard);
 assert.equal(fs.readFileSync(file,'utf8'),replacement);
 assert.equal(f.rebuilds.length,0);
 guard.stop();
 assert.equal(fs.readFileSync(file,'utf8'),replacement);
});

test('stop restores its exact original and publishes the restored client once',t=>{
 const f=fixture(t),file=f.pkg();f.select(file);
 const guard=f.controller();f.settle(guard);
 assertPatched(fs.readFileSync(file,'utf8'));
 guard.stop();
 assert.equal(fs.readFileSync(file,'utf8'),upstream);
 assert.equal(f.published.get(ID),upstream);
 assert.equal(f.rebuilds.length,2);
 guard.stop();f.advance(200);guard.tick();
 assert.equal(f.rebuilds.length,2);
 assert.equal(fs.readFileSync(file,'utf8'),upstream);
});

test('stop preserves an upgraded client rather than restoring an old backup',t=>{
 const f=fixture(t),file=f.pkg();f.select(file);
 const guard=f.controller();f.settle(guard);
 const upgraded=upstream+'\n// externally upgraded after localization\n';
 fs.writeFileSync(file,upgraded);
 guard.stop();
 assert.equal(fs.readFileSync(file,'utf8'),upgraded);
 assert.equal(f.rebuilds.length,1);
});

test('a restarted controller recovers the persisted journal and can restore original bytes',t=>{
 const f=fixture(t),file=f.pkg();f.select(file);
 const first=f.controller();f.settle(first);
 const patched=fs.readFileSync(file,'utf8');assertPatched(patched);
 // Do not stop the first instance: this models process termination, not disable.
 const restarted=f.controller();f.settle(restarted);
 assert.equal(fs.readFileSync(file,'utf8'),patched);
 assert.equal(f.published.get(ID),patched);
 assert.equal(restarted.status()[ID].status,'localized');
 restarted.stop();
 assert.equal(fs.readFileSync(file,'utf8'),upstream);
 assert.equal(f.published.get(ID),upstream);
});

test('localization replaces a hardlinked bundle without mutating the shared original',t=>{
 const f=fixture(t),file=f.pkg(),shared=path.join(f.root,'shared-original.js');
 fs.linkSync(file,shared);f.select(file);
 const guard=f.controller();f.settle(guard);
 assertPatched(fs.readFileSync(file,'utf8'));
 assert.equal(fs.readFileSync(shared,'utf8'),upstream);
 guard.stop();
 assert.equal(fs.readFileSync(file,'utf8'),upstream);
 assert.equal(fs.readFileSync(shared,'utf8'),upstream);
});
