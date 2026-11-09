import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {satisfiesCaretRange} from '../scripts/lib/semver.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const work=path.join(root,'dist','work');
const readJson=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const en=readJson('translation/en.json');
const ru=readJson('dist/work/translation/ru.json');
const metadata=readJson('translation/metadata.ru.json');
let source=fs.readFileSync(path.join(work,'package/lib/client.js'),'utf8');
const contexts=[];
const react={
 Component:class {},
 createContext(value){const ctx={value,Provider:'ContextProvider'};contexts.push(ctx);return ctx;},
 useContext(ctx){return ctx.value;},
 useMemo(fn){return fn();},useCallback(fn){return fn;},
 memo(fn){return fn;},forwardRef(fn){return fn;},
 useRef(value){return {current:value};},
 useState(value){return [typeof value==='function'?value():value,()=>{}];},
 useEffect(){},useLayoutEffect(){},useId(){return 'fixture-id';},
 useSyncExternalStore(_subscribe,get){return get();},
 createElement(type,props,...children){return {type,props:{...props,children}};},
 Fragment:'Fragment'
};
const primitive=new Proxy(function(){},{get(_target,key){if(key===Symbol.toPrimitive)return ()=>'';return primitive;},apply(){return primitive;}});
const jsx=(type,props)=>({type,props});
let exports;
source=source.replace('return module.exports;','exports.__ruTest={ru,componentCopy,localizedCopy,localizeEnglish,settingsTranslate,MemorySourcePageFrame,useT$1,I18nContext,LocaleContext,TranslationOverride}; return module.exports;');
const window={__ModuleLoader__:{load({factory}){exports=factory((id)=>{
 if(id==='react')return react;
 if(id==='react/jsx-runtime')return {jsx,jsxs:jsx,Fragment:'Fragment'};
 if(id==='react-dom')return {createPortal:jsx};
 if(id==='@deepseek-ai/dsh-client-ui-primitives')return primitive;
 throw Error('Unexpected import '+id);
});}}};
vm.runInNewContext(source,{window,console,URL,URLSearchParams,setTimeout,clearTimeout,setInterval,clearInterval,Intl,TextEncoder,TextDecoder,AbortController},{timeout:5000});
const fixture=exports.__ruTest;
const tokens=(s)=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();

test('all 1420 English keys have Russian values and no extras',()=>{
 assert.equal(Object.keys(ru).length,1420);
 assert.deepEqual(Object.keys(ru).sort(),Object.keys(en).sort());
 const missing=Object.keys(en).filter(k=>typeof ru[k]!=='string'||(en[k].trim()&&!ru[k].trim()));
 assert.deepEqual(missing,[]);
});
test('every interpolation placeholder is preserved including multiplicity',()=>{
 const invalid=Object.keys(en).filter(k=>JSON.stringify(tokens(en[k]))!==JSON.stringify(tokens(ru[k])));
 assert.deepEqual(invalid,[]);
});
test('all supplemental component labels have translations',()=>{
 const original=readJson('translation/metadata.en.json');
 assert.deepEqual(Object.keys(metadata).sort(),Object.keys(original).sort());
 assert.deepEqual(Object.keys(original).filter(k=>k&&!metadata[k].trim()),[]);
});
test('Russian dictionary is embedded in complete executable client bundle',()=>{
 assert.equal(exports.translateRu('tab.label'),ru['tab.label']);
 assert.match(exports.translateRu('tab.label'),/[А-Яа-яЁё]/u);
 assert.equal(exports.translateRu('common.showing',{visible:2,total:5}),ru['common.showing'].replace('{visible}','2').replace('{total}','5'));
});
test('all compiled Russian keys match reviewed JSON',()=>{
 assert.equal(Object.keys(fixture.ru).length,1420);
 for(const key of Object.keys(ru))assert.equal(exports.translateRu(key),ru[key],key);
});
test('English and Chinese remain available',()=>{
 assert.equal(exports.translateEn('tab.label'),'Memory System');
 assert.equal(exports.translateZh('tab.label'),'记忆系统');
});
test('component labels use Russian for ru and regional variants',()=>{
 const e={label:{en:'Runtime memory','zh-CN':'运行时'},description:{en:'Bounded, deterministic hot memory injected directly into every eligible turn.','zh-CN':'中文'}};
 assert.equal(fixture.componentCopy(e,'ru').label,'Оперативная память');
 assert.equal(fixture.componentCopy(e,'ru-RU').label,'Оперативная память');
 assert.equal(fixture.componentCopy(e,'en').label,'Runtime memory');
 assert.equal(fixture.componentCopy(e,'zh-CN').label,'运行时');
});
test('unknown provider and model names are not translated or modified',()=>{
 assert.equal(fixture.localizeEnglish('Mnemon Native','ru'),'Mnemon Native');
 assert.equal(fixture.localizeEnglish('deepseek-account/deepseek-flash','ru'),'deepseek-account/deepseek-flash');
 assert.equal(fixture.localizeEnglish('https://example.com/path','ru'),'https://example.com/path');
});
test('source frame chooses Russian instead of Chinese',()=>{
 const frame=fixture.MemorySourcePageFrame({locale:'ru-RU',children:null});
 assert.equal(frame.props.value('tab.label'),ru['tab.label']);
});
test('memory spaces hooks choose Russian for ru locale',()=>{
 fixture.I18nContext.value=exports.translateRu;
 fixture.LocaleContext.value='ru-RU';
 fixture.TranslationOverride.value=undefined;
 const translate=fixture.useT$1();
 assert.equal(translate('overview.title'),ru['overview.title']);
});
test('provider settings respect Russian locale chain and language-pack overrides',()=>{
 const service={bind(){return (key,params)=>exports.translateRu(key,params)??key;}};
 const translate=fixture.settingsTranslate(service,['ru','en'],'ru');
 assert.equal(translate('config.saving'),ru['config.saving']);
 const pack={bind(){return (key)=>key==='config.saving'?'Перевод расширения':key;}};
 assert.equal(fixture.settingsTranslate(pack,['ru-custom','ru','en'],'ru-custom')('config.saving'),'Перевод расширения');
});
test('declarative component fields use Russian and preserve unknown extensions',()=>{
 assert.equal(fixture.localizedCopy({en:'Recording targets','zh-CN':'目标'},'ru'),'Места сохранения');
 assert.equal(fixture.localizedCopy({en:'custom domain field'},'ru'),'custom domain field');
 assert.equal(fixture.localizedCopy({en:'label',ru:'Своя подпись'},'ru'),'Своя подпись');
});
test('management metadata is localized without translating user content',()=>{
 const management=readJson('translation/management.ru.json');
 for(const [english,russian] of Object.entries(management))assert.equal(fixture.localizeEnglish(english,'ru'),russian);
 assert.equal(fixture.localizeEnglish('Мой проект architecture, local-first','ru'),'Мой проект architecture, local-first');
});
test('local package keeps upstream dependency graph and compatible build metadata',()=>{
 const original=readJson('dist/work/upstream/dsh-mnemon/package.json');
 const localized=readJson('dist/work/package/package.json');
 assert.equal(localized.name,original.name);
 assert.equal(localized.version,'0.5.42+ru.2');
 assert.equal(localized.private,true);
 assert.equal(localized.repository,undefined);
 assert.deepEqual(localized.bundledDependencies,['dsh-mnemon-source-runtime','dsh-mnemon-source-documents','dsh-mnemon-source-memory-spaces','dsh-mnemon-source-skills']);
 for(const key of ['dependencies','peerDependencies','engines','dsh','exports'])assert.deepEqual(localized[key],original[key]);
 for(const id of localized.bundledDependencies){
  const source=readJson(`dist/work/sources/${id}/package.json`);
  assert.ok(satisfiesCaretRange(localized.version,source.peerDependencies['dsh-mnemon']),id);
 }
 assert.equal(satisfiesCaretRange('0.5.42-ru.2','^0.5.19'),false,'prerelease must not silently satisfy peer ranges');
});
test('all non-client host JavaScript is byte-identical to verified upstream',()=>{
 const original=path.join(work,'upstream','dsh-mnemon','lib');
 const localized=path.join(work,'package','lib');
 const files=fs.readdirSync(original).filter(file=>file.endsWith('.js')&&file!=='client.js');
 assert.ok(files.length>0);
 for(const file of files)assert.ok(fs.readFileSync(path.join(localized,file)).equals(fs.readFileSync(path.join(original,file))),file);
});
