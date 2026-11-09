import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const work=path.join(root,'dist','work');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const rootRu=read('dist/work/translation/ru.json');
const interpolate=(text,params)=>params?text.replace(/\{(\w+)\}/g,(m,k)=>k in params?String(params[k]):m):text;
function load(name,language){
 const contexts=[];
 const react={Component:class{},createContext(value){const c={value,Provider:'Provider'};contexts.push(c);return c;},useContext:c=>c.value,useMemo:fn=>fn(),useCallback:fn=>fn,memo:fn=>fn,forwardRef:fn=>fn,useRef:value=>({current:value}),useState:value=>[typeof value==='function'?value():value,()=>{}],useEffect(){},useLayoutEffect(){},useId:()=> 'test',useSyncExternalStore:(_s,get)=>get(),createElement:(type,props,...children)=>({type,props:{...props,children}}),Fragment:'Fragment'};
 const primitive=new Proxy(function(){},{get:(_t,k)=>k===Symbol.toPrimitive?()=> '':primitive,apply:()=>primitive});
 const core=new Proxy({useLocale:()=>language,useT:()=>((key,p)=>interpolate(rootRu[key]??key,p)),memoryPageStyles:{},memorySidebarStyles:{}},{get:(target,k)=>k in target?target[k]:primitive});
 let exports;
 let source=fs.readFileSync(path.join(work,`sources/dsh-mnemon-source-${name}/lib/client.js`),'utf8');
 source=source.replace('return module.exports;',`exports.__test={${name==='skills'?'translate,compactCount,stamp,relative':'useT'}};return module.exports;`);
 const jsx=(type,props)=>({type,props});
 vm.runInNewContext(source,{window:{__ModuleLoader__:{load({factory}){exports=factory(id=>id==='react'?react:id==='react/jsx-runtime'?{jsx,jsxs:jsx,Fragment:'Fragment'}:id==='react-dom'?{createPortal:jsx}:id==='dsh-mnemon/client'?core:primitive);}}},console,URL,URLSearchParams,setTimeout,clearTimeout,setInterval,clearInterval,Intl,TextEncoder,TextDecoder,AbortController},{timeout:5000});
 return exports.__test;
}
test('skills: Russian count and date formats follow selected language',()=>{
 const fixture=load('skills','ru');
 const t=fixture.translate('ru');
 assert.equal(t.language,'ru');
 assert.equal(fixture.compactCount(12500,'ru'),new Intl.NumberFormat('ru-RU',{notation:'compact',maximumSignificantDigits:3}).format(12500));
 const iso='2025-01-02T12:34:00Z';
 assert.equal(fixture.stamp(iso,t),new Date(iso).toLocaleString('ru',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}));
 assert.equal(fixture.relative(t,iso,Date.parse('2026-01-01T00:00:00Z')),new Date(iso).toLocaleDateString('ru'));
 for(const [key,value] of Object.entries(read('translation/skills.ru.json'))) for(const count of [0,1,2,5,11,21,101]) assert.doesNotMatch(t(key,{count,name:'test'}),/\{count[:}]/,key);
});
for(const name of ['runtime','documents','memory-spaces','skills']){
 const locales=read(`dist/work/sources/dsh-mnemon-source-${name}/presentation/locales.json`);
 const key={runtime:'runtime.title',documents:'documents.title','memory-spaces':'overview.title',skills:'page.title'}[name];
 test(`${name}: real source translator selects Russian, not Chinese`,()=>{
  for(const language of ['ru','ru-RU']){
   const fixture=load(name,language);
   const translate=name==='skills'?fixture.translate(language):(fixture.useT??fixture.useT$1)();
   assert.match(translate(key),/[А-Яа-яЁё]/u);
   for(const k of Object.keys(locales.en)) {
    assert.notEqual(translate(k),k,k);
    assert.doesNotMatch(translate(k),/\p{Script=Han}/u,k);
   }
  }
 });
 test(`${name}: English and Chinese translators remain available`,()=>{
  for(const language of ['en','zh']) {
   const fixture=load(name,language);
   const translate=name==='skills'?fixture.translate(language):fixture.useT();
   assert.equal(translate(key),locales[language][key]);
  }
 });
 test(`${name}: Russian catalog is complete and preserves parameters`,()=>{
  assert.deepEqual(Object.keys(locales.ru??{}).sort(),Object.keys(locales.en).sort());
  const params=s=>[...s.matchAll(/\{(\w+)(?::[^{}]*)?\}/g)].map(m=>m[1]).sort();
  for(const [k,en] of Object.entries(locales.en)) assert.deepEqual(params(locales.ru[k]),params(en),k);
 });
 test(`${name}: non-client runtime files remain byte-identical to verified upstream`,()=>{
  const upstream=path.join(work,'upstream',`dsh-mnemon-source-${name}`,'lib');
  const localized=path.join(work,'sources',`dsh-mnemon-source-${name}`,'lib');
  const files=fs.readdirSync(upstream).filter(file=>file.endsWith('.js')&&file!=='client.js');
  assert.ok(files.length>0);
  for(const file of files)assert.ok(fs.readFileSync(path.join(localized,file)).equals(fs.readFileSync(path.join(upstream,file))),file);
 });
}
