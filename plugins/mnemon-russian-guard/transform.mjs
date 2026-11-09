import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const plans=JSON.parse(fs.readFileSync(new URL('./data/plans.json',import.meta.url),'utf8'));
export const TARGETS=Object.freeze(Object.keys(plans));
export const sha256=source=>crypto.createHash('sha256').update(source).digest('hex');
const marker=/\n\/\* mnemon-russian-guard:v1 original=([a-f0-9]{64}) body=([a-f0-9]{64}) \*\/\n$/;
export function guardReceipt(source){
 const match=source.match(marker);
 if(!match)return undefined;
 const body=source.slice(0,match.index);
 return sha256(body)===match[2]?{originalHash:match[1],bodyHash:match[2]}:undefined;
}
// Parse literal dictionaries only. Never execute code supplied by an updated package on the Host.
function englishCatalog(source){
 const dictionaries=Object.create(null);
 for(const match of source.matchAll(/(?:var|const) (en(?:\$\d+)?) = \{\r?\n([\s\S]*?)^\t\t\};/gm)){
  const dictionary=Object.create(null);
  for(const raw of match[2].split(/\r?\n/)){
   const line=raw.trim();
   if(!line)continue;
   const spread=line.match(/^\.\.\.(en(?:\$\d+)?),?$/);
   if(spread){if(!dictionaries[spread[1]])throw Error('Unknown dictionary spread');Object.assign(dictionary,dictionaries[spread[1]]);continue;}
   const entry=line.match(/^("(?:\\.|[^"\\])*"):\s*("(?:\\.|[^"\\])*"),?$/);
   if(!entry)throw Error('Unsupported non-literal English dictionary');
   const key=JSON.parse(entry[1]);
   if(Object.hasOwn(dictionary,key))throw Error('Duplicate English dictionary key');
   dictionary[key]=JSON.parse(entry[2]);
  }
  dictionaries[match[1]]=dictionary;
 }
 if(!dictionaries.en||!Object.keys(dictionaries.en).length)throw Error('English dictionary not found');
 return dictionaries.en;
}
const params=text=>[...text.matchAll(/\{(\w+)(?::[^{}]*)?\}/g)].map(m=>m[1]).sort().join('|');
export function transformClient(packageName,source){
 const fail=reason=>({code:source,status:'incompatible',reason,missingTranslations:[]});
 const plan=plans[packageName];
 if(!plan)return fail('Пакет не входит в список Mnemon.');
 if(typeof source!=='string')throw TypeError('Expected client source text');
 if(guardReceipt(source)||sha256(source)===plan.knownLocalizedHash)return {code:source,status:'already-localized',missingTranslations:[]};
 if(source.includes('mnemon-russian-guard:v1'))return fail('Контрольная сумма прежнего русификатора не совпала.');
 if(!new RegExp('id:\\s*'+JSON.stringify(packageName).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*,').test(source))return fail('Идентификатор клиентского модуля изменился.');
 try{
  const english=englishCatalog(source);
  const missingTranslations=[];
  const russian=Object.fromEntries(Object.entries(english).map(([key,value])=>{
   const known=Object.hasOwn(plan.russian,key)&&value===plan.english[key]&&params(value)===params(plan.russian[key]);
   if(!known)missingTranslations.push(key);
   return [key,known?plan.russian[key]:value];
  }));
  let code=source;
  for(const patch of plan.patches){
   if(code.split(patch.before).length!==2)return fail('Структура интерфейса изменилась: безопасная точка перевода не найдена.');
   code=code.replace(patch.before,()=>patch.after.replace('__MNEMON_GUARD_DICTIONARY__',()=>JSON.stringify(russian,null,2)));
  }
  new vm.Script(code,{filename:packageName+'-russian.js'});
  const footer=`\n/* mnemon-russian-guard:v1 original=${sha256(source)} body=${sha256(code)} */\n`;
  return {code:code+footer,status:'patched',missingTranslations};
 }catch(error){return fail('Русификатор пропустил несовместимую сборку: '+error.message);}
}
