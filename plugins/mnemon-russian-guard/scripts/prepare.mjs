import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const previous=path.join(root,'../mnemon-russian');
const work=path.join(previous,'dist','work');
const json=(base,p)=>JSON.parse(fs.readFileSync(path.join(base,p),'utf8'));
const plans={};
const run=(filename)=>{
 let script=fs.readFileSync(path.join(previous,'scripts',filename),'utf8');
 script=script.replace(/^import .*;\r?\n/gm,'').replace(/const root=.*;\r?\n/,'');
 if(filename==='build.mjs') {
  const boundary=script.indexOf('// Local Host backport UI:');
  if(boundary<0)throw Error('Cannot identify Guard client patch boundary');
  script=script.slice(0,boundary);
  script=script.replace("let source=fs.readFileSync(path.join(upstream,'lib/client.js'),'utf8');", "let source=fs.readFileSync(path.join(upstream,'lib/client.js'),'utf8');const plan=[];");
  script=script.replace('const replace=(before,after)=>{','const replace=(before,after)=>{plan.push({before,after});');
  script+='\nplans["dsh-mnemon"]={patches:plan};';
 }else{
  const boundary=script.indexOf('const manifest=');
  if(boundary<0)throw Error('Cannot identify Source client patch boundary');
  script=script.slice(0,boundary);
  script=script.replace('const replace=(before,after)=>{','const plan=[];const replace=(before,after)=>{plan.push({before,after});');
  script+='\nplans[id]={patches:plan};\n}';
 }
 const readOnlyFs={...fs,writeFileSync(){},mkdirSync(){},copyFileSync(){},cpSync(){},rmSync(){}};
 vm.runInNewContext(script,{fs:readOnlyFs,path,vm,fileURLToPath,root:previous,plans,console:{log(){}}});
};
run('build.mjs');run('build-sources.mjs');
const rootRu=json(work,'translation/ru.json');
for(const [id,plan]of Object.entries(plans)){
 const isStarter=id==='dsh-mnemon';
 plan.english=isStarter?json(previous,'translation/en.json'):json(work,`upstream/${id}/presentation/locales.json`).en;
 plan.russian=isStarter?{...rootRu}:id.endsWith('-skills')?json(previous,'translation/skills.ru.json'):Object.fromEntries(Object.keys(plan.english).map(k=>[k,rootRu[k]]));
 const localized=isStarter?'package/lib/client.js':`sources/${id}/lib/client.js`;
 plan.knownLocalizedHash=crypto.createHash('sha256').update(fs.readFileSync(path.join(work,localized))).digest('hex');
 const injected=plan.patches.find(p=>p.after.includes('const ru = '));
 const literal=JSON.stringify(plan.russian,null,2);
 if(!injected?.after.includes('const ru = '+literal+';'))throw Error('Cannot identify dictionary injection '+id);
 injected.after=injected.after.replace('const ru = '+literal+';','const ru = __MNEMON_GUARD_DICTIONARY__;');
 if(isStarter){
  // This status belongs to the paired local Host patch, not to Guard's upstream locale plan.
  delete plan.english['status.reviewAutoPaused'];
  delete plan.russian['status.reviewAutoPaused'];
 }
}
fs.mkdirSync(path.join(root,'data'),{recursive:true});
fs.writeFileSync(path.join(root,'data/plans.json'),JSON.stringify(plans,null,2)+'\n');
console.log('Prepared guarded translation plans: '+Object.keys(plans).join(', '));
