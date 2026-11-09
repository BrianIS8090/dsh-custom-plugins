import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {TARGETS,transformClient,sha256,guardReceipt} from './transform.mjs';
const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8'));
function atomicWrite(file,bytes,mode=0o600){
 const temp=file+'.mnemon-ru-'+crypto.randomUUID()+'.tmp';
 let fd;
 try{fd=fs.openSync(temp,'wx',mode);fs.writeFileSync(fd,bytes);fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;fs.renameSync(temp,file);}
 finally{if(fd!==undefined)fs.closeSync(fd);if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
function identity(client,id){
 const real=fs.realpathSync(client);
 let dir=path.dirname(real);
 for(let i=0;i<8;i++){
  const manifest=path.join(dir,'package.json');
  if(fs.existsSync(manifest)){
   const pkg=readJson(manifest);
   if(pkg.name!==id)throw Error('Путь не принадлежит ожидаемому пакету');
   const exported=pkg.exports?.['./client'];
   const relative=typeof exported==='string'?exported:exported?.default;
   if(typeof relative!=='string'||fs.realpathSync(path.resolve(dir,relative))!==real)throw Error('Путь не является штатным клиентским модулем');
   return {real,version:pkg.version,manifest,manifestHash:sha256(fs.readFileSync(manifest))};
  }
  const parent=path.dirname(dir);if(parent===dir)break;dir=parent;
 }
 throw Error('Манифест клиентского модуля не найден');
}
export function createGuard({registry,stateDir,log=()=>{},now=Date.now,settleMs=500,beforeCommit=()=>{}}){
 fs.mkdirSync(path.join(stateDir,'originals'),{recursive:true});
 const journalPath=path.join(stateDir,'journal.json');
 let journal=fs.existsSync(journalPath)?readJson(journalPath):{version:1,entries:[]};
 if(journal.version!==1||!Array.isArray(journal.entries))throw Error('Неизвестный журнал русификатора');
 let closed=false,running=false,lastStatus;
 const observed=new Map(),reports=new Map();
 const writeStatus=enabled=>{
  const value={enabled,packages:Object.fromEntries(reports)};
  const serialized=JSON.stringify(value);
  if(serialized===lastStatus)return;
  atomicWrite(path.join(stateDir,'status.json'),JSON.stringify({updatedAt:new Date().toISOString(),...value},null,2)+'\n');
  lastStatus=serialized;
 };
 const save=()=>atomicWrite(journalPath,JSON.stringify(journal,null,2)+'\n');
 const report=(id,result)=>{
  if(JSON.stringify(reports.get(id))===JSON.stringify(result))return;
  reports.set(id,result);
  if(result.status==='incompatible'||result.status==='error')log('warn',id+': '+result.reason);
  else if(result.status==='patched')log('info','Русский перевод восстановлен: '+id+(result.missingTranslations?.length?' (новые строки: '+result.missingTranslations.length+')':''));
 };
 const samePath=(id,client)=>registry.clientPath(id)===client;
 function tick(){
  if(closed||running)return;
  running=true;
  try{
   for(const id of TARGETS){
    if(closed)break;
    const client=registry.clientPath(id);
    if(!client){observed.delete(id);report(id,{status:'absent'});continue;}
    try{
     const owner=identity(client,id);
     const source=fs.readFileSync(owner.real,'utf8');
     const hash=sha256(source);
     const signature=owner.real+'|'+owner.manifestHash+'|'+hash;
     const previous=observed.get(id);
     if(!previous||previous.signature!==signature){observed.set(id,{signature,since:now()});continue;}
     if(now()-previous.since<settleMs)continue;
     const result=transformClient(id,source);
     if(result.status==='incompatible'){report(id,{status:result.status,version:owner.version,reason:result.reason});continue;}
     if(result.status==='already-localized'){
      // Also reconcile a registry which captured earlier bytes before a prior guard committed.
      registry.rebuilt(id);
      const receipt=journal.entries.findLast(entry=>entry.file===owner.real&&entry.patchedHash===hash);
      report(id,{status:'localized',version:owner.version,...receipt?.missingTranslations?.length?{missingTranslations:receipt.missingTranslations}:{}});continue;
     }
     const outputHash=sha256(result.code);
     const backup=path.join(stateDir,'originals',hash+'.js');
     if(!fs.existsSync(backup))atomicWrite(backup,source);
     if(sha256(fs.readFileSync(backup))!==hash)throw Error('Контрольная сумма резервной копии не совпала');
     const entry={id,file:owner.real,version:owner.version,manifestHash:owner.manifestHash,originalHash:hash,patchedHash:outputHash,missingTranslations:result.missingTranslations};
     if(!journal.entries.some(e=>e.file===entry.file&&e.patchedHash===entry.patchedHash)){journal.entries.push(entry);save();}
     beforeCommit(entry);
     if(closed||!samePath(id,client))continue;
     const current=identity(client,id);
     if(current.real!==owner.real||current.manifestHash!==owner.manifestHash||sha256(fs.readFileSync(owner.real))!==hash)continue;
     // Same-directory rename replaces the inode, so pnpm's shared hardlinks are never edited in place.
     atomicWrite(owner.real,result.code,fs.statSync(owner.real).mode);
     if(samePath(id,client)&&sha256(fs.readFileSync(owner.real))===outputHash)registry.rebuilt(id);
     observed.set(id,{signature:owner.real+'|'+owner.manifestHash+'|'+outputHash,since:now()});
     report(id,{status:'patched',version:owner.version,missingTranslations:result.missingTranslations});
    }catch(error){report(id,{status:'error',reason:error.message});}
   }
   writeStatus(!closed);
  }finally{running=false;}
 }
 function stop(){
  if(closed)return;closed=true;
  // Restore only our exact bytes; never overwrite a package subsequently changed by an update.
  for(const entry of [...journal.entries].reverse()){
   try{
    if(!fs.existsSync(entry.file)||sha256(fs.readFileSync(entry.file))!==entry.patchedHash)continue;
    const owner=identity(entry.file,entry.id);
    if(owner.real!==entry.file||owner.manifestHash!==entry.manifestHash)continue;
    const backup=path.join(stateDir,'originals',entry.originalHash+'.js');
    const original=fs.readFileSync(backup);
    if(sha256(original)!==entry.originalHash)throw Error('Повреждена резервная копия');
    const receipt=guardReceipt(fs.readFileSync(entry.file,'utf8'));
    if(receipt?.originalHash!==entry.originalHash)continue;
    atomicWrite(entry.file,original,fs.statSync(entry.file).mode);
    if(registry.clientPath(entry.id)&&fs.realpathSync(registry.clientPath(entry.id))===entry.file)registry.rebuilt(entry.id);
   }catch(error){log('warn','Не удалось снять перевод '+entry.id+': '+error.message);}
  }
  writeStatus(false);
 }
 return {tick,stop,status:()=>Object.fromEntries(reports)};
}
