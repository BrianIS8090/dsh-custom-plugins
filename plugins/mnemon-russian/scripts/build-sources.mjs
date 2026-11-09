import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const work=path.join(root,'dist','work');
const rootRu=JSON.parse(fs.readFileSync(path.join(work,'translation/ru.json'),'utf8'));
for(const name of ['runtime','documents','memory-spaces','skills']) {
 const id=`dsh-mnemon-source-${name}`;
 const upstream=path.join(work,'upstream',id);
 const target=path.join(work,'sources',id);
 fs.rmSync(target,{recursive:true,force:true});
 fs.cpSync(upstream,target,{recursive:true});
 const locales=JSON.parse(fs.readFileSync(path.join(upstream,'presentation/locales.json'),'utf8'));
 const skills=name==='skills'?JSON.parse(fs.readFileSync(path.join(root,'translation/skills.ru.json'),'utf8')):undefined;
 const ru=Object.fromEntries(Object.keys(locales.en).map(key=>{
  const value=(skills??rootRu)[key];
  if(typeof value!=='string') throw Error(`${id}: missing ${key}`);
  return [key,value];
 }));
 let source=fs.readFileSync(path.join(upstream,'lib/client.js'),'utf8');
 const replace=(before,after)=>{
  if(source.split(before).length!==2)throw Error(`${id}: expected one patch: ${before}`);
  source=source.replace(before,after);
 };
 replace('//#region src/client/presentation.ts',`//#region src/client/presentation.ts\n\t\tconst ru = ${JSON.stringify(ru,null,2)};\n\t\tconst russianLanguage = language => String(language).toLowerCase().startsWith('ru');`);
 replace('const dictionary = locale.startsWith("en") ? en : zh;', 'const dictionary = russianLanguage(locale) ? ru : locale.startsWith("en") ? en : zh;');
 if(name==='memory-spaces') {
  replace('function RememberPage(props) {\n\t\t\tconst t = useT();', 'function RememberPage(props) {\n\t\t\tconst locale = (0, dsh_mnemon_client.useLocale)();\n\t\t\tconst t = useT();');
  replace('const head = chain === void 0 ? language.startsWith("en") ? "en" : "zh" : chain.find((id) => id === "zh" || id === "en") ?? "en";', 'const head = chain === void 0 ? russianLanguage(language) ? "ru" : language.startsWith("en") ? "en" : "zh" : chain.find((id) => id === "ru" || id === "zh" || id === "en") ?? "en";');
  replace('const own = head === "en" ? en : zh;', 'const own = head === "ru" ? ru : head === "en" ? en : zh;');
  replace('placeholder: "architecture, local-first"','placeholder: russianLanguage(locale) ? "архитектура, локальное хранение" : "architecture, local-first"');
 }
 if(name==='documents') replace('usage.toFixed(1)', 'usage.toLocaleString(locale, {minimumFractionDigits: 1, maximumFractionDigits: 1})');
 if(name==='skills') {
  replace('language.startsWith("zh") ? "zh-CN" : "en"','russianLanguage(language) ? "ru-RU" : language.startsWith("zh") ? "zh-CN" : "en"');
  replace('return (key, params) => {\n\t\t\t\tconst text = dictionary[key]', 'const translate = (key, params) => {\n\t\t\t\tconst text = dictionary[key]');
  replace('\n\t\t}\n\t\tfunction useT() {', '\n\t\t\ttranslate.language = locale;\n\t\t\treturn translate;\n\t\t}\n\t\tfunction useT() {');
  replace('new Date(time).toLocaleDateString()', 'new Date(time).toLocaleDateString(t.language)');
  replace('function stamp(iso) {', 'function stamp(iso, t) {');
  replace('date.toLocaleString(void 0, {', 'date.toLocaleString(t?.language, {');
  for(const call of ['trajectory.createdAt','draft.updatedAt','version.createdAt','comparing.version.createdAt','entry.trashedAt']) replace(`stamp(${call})`, `stamp(${call}, t)`);
  replace('const inject = ["slots"];','const inject = ["slots", "locale"];');
  replace('const t = translate(locale);','const t = (key, params) => translate(ctx.locale?.getSnapshot().active ?? locale)(key, params);');
 }
 new vm.Script(source,{filename:id+'-ru.js'});
 fs.writeFileSync(path.join(target,'lib/client.js'),source);
 fs.writeFileSync(path.join(target,'presentation/locales.json'),JSON.stringify({...locales,ru},null,2)+'\n');
 const manifest=JSON.parse(fs.readFileSync(path.join(upstream,'package.json'),'utf8'));
 manifest.description+=' Русский интерфейс (локальная сборка).';
 fs.writeFileSync(path.join(target,'package.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({id,version:manifest.version,keys:Object.keys(ru).length}));
}
