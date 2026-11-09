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
  script=script.slice(0,script.indexOf("fs.writeFileSync(path.join(pkg,'lib/client.js')"));
  script=script.replace("let source=fs.readFileSync(path.join(upstream,'lib/client.js'),'utf8');", "let source=fs.readFileSync(path.join(upstream,'lib/client.js'),'utf8');const plan=[];");
  script=script.replace('const replace=(before,after)=>{','const replace=(before,after)=>{plan.push({before,after});');
  script+='\nplans["dsh-mnemon"]={patches:plan};';
 }else{
  script=script.replace('const replace=(before,after)=>{','const plan=[];const replace=(before,after)=>{plan.push({before,after});');
  script=script.replace("fs.writeFileSync(path.join(target,'lib/client.js'),source);",'plans[id]={patches:plan};');
 }
 const readOnlyFs={...fs,writeFileSync(){},mkdirSync(){},copyFileSync(){},cpSync(){},rmSync(){}};
 vm.runInNewContext(script,{fs:readOnlyFs,path,vm,fileURLToPath,root:previous,plans,console:{log(){}}});
};
run('build.mjs');run('build-sources.mjs');
for(const [id,plan]of Object.entries(plans)){
 plan.english=id==='dsh-mnemon'?json(previous,'translation/en.json'):json(work,`upstream/${id}/presentation/locales.json`).en;
 plan.russian=id==='dsh-mnemon'?json(work,'translation/ru.json'):id.endsWith('-skills')?json(previous,'translation/skills.ru.json'):Object.fromEntries(Object.keys(plan.english).map(k=>[k,json(work,'translation/ru.json')[k]]));
 const localized=id==='dsh-mnemon'?'package/lib/client.js':`sources/${id}/lib/client.js`;
 plan.knownLocalizedHash=crypto.createHash('sha256').update(fs.readFileSync(path.join(work,localized))).digest('hex');
 const injected=plan.patches.find(p=>p.after.includes('const ru = '));
 const literal=JSON.stringify(plan.russian,null,2);
 if(!injected?.after.includes('const ru = '+literal+';'))throw Error('Cannot identify dictionary injection '+id);
 injected.after=injected.after.replace('const ru = '+literal+';','const ru = __MNEMON_GUARD_DICTIONARY__;');
}
fs.mkdirSync(path.join(root,'data'),{recursive:true});
fs.writeFileSync(path.join(root,'data/plans.json'),JSON.stringify(plans,null,2)+'\n');
console.log('Prepared guarded translation plans: '+Object.keys(plans).join(', '));
