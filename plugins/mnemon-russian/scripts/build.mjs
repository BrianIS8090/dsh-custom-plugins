import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const work=path.join(root,'dist','work');
const upstream=path.join(work,'upstream','dsh-mnemon');
const pkg=path.join(work,'package');
fs.rmSync(pkg,{recursive:true,force:true});
fs.cpSync(upstream,pkg,{recursive:true,filter:source=>!path.relative(upstream,source).split(path.sep).includes('node_modules')});
const en=JSON.parse(fs.readFileSync(path.join(root,'translation/en.json'),'utf8'));
const ru={};
for(let i=1;i<=4;i++){
 const part=JSON.parse(fs.readFileSync(path.join(root,`translation/part-${i}.ru.json`),'utf8'));
 for(const [key,value] of Object.entries(part)){
  if(Object.hasOwn(ru,key))throw new Error('Duplicate translation key: '+key);
  ru[key]=value;
 }
}
const placeholders=(s)=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort().join('|');
for(const [key,value]of Object.entries(en)){
 if(typeof ru[key]!=='string'||(value.trim()&&!ru[key].trim()))throw Error('Missing translation: '+key);
 if(placeholders(value)!==placeholders(ru[key]))throw Error('Placeholder mismatch: '+key);
}
if(Object.keys(ru).length!==Object.keys(en).length)throw Error('Unexpected translation key count');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'translation/metadata.ru.json'),'utf8'));
const metadataEn=JSON.parse(fs.readFileSync(path.join(root,'translation/metadata.en.json'),'utf8'));
for(const key of Object.keys(metadataEn)){
 if(typeof metadata[key]!=='string')throw Error('Missing component translation: '+key);
 if(placeholders(key)!==placeholders(metadata[key]))throw Error('Component placeholder mismatch: '+key);
}
Object.assign(metadata,JSON.parse(fs.readFileSync(path.join(root,'translation/management.ru.json'),'utf8')));
const literal=JSON.stringify(ru,null,2);
let source=fs.readFileSync(path.join(upstream,'lib/client.js'),'utf8');
const replace=(before,after)=>{
 const first=source.indexOf(before);
 if(first<0||source.indexOf(before,first+before.length)>=0)throw Error('Patch must match exactly once: '+before.slice(0,100));
 source=source.slice(0,first)+after+source.slice(first+before.length);
};
replace('\t\tfunction interpolate$1(dictionary, key, params) {',
 `\t\t// Local Russian UI dictionary; generated from the reviewed translation files.\n\t\tconst ru = ${literal};\n\t\tconst ruMetadata = ${JSON.stringify(metadata,null,2)};\n\t\tconst ruByEnglish = new Map(Object.entries(en).map(([key,value])=>[value,ru[key]]));\n\t\tfor (const [english,russian] of Object.entries(ruMetadata)) ruByEnglish.set(english,russian);\n\t\tfunction russianLanguage(language) { return String(language).toLowerCase().startsWith('ru'); }\n\t\tfunction localizeEnglish(value, language) { return russianLanguage(language) ? ruByEnglish.get(value) ?? value : value; }\n\t\tfunction localizedCopy(value, language) {\n\t\t if (value === undefined) return '';\n\t\t if (russianLanguage(language)) return value.ru ?? localizeEnglish(value.en,language);\n\t\t return language.toLowerCase().startsWith('zh') ? value['zh-CN'] : value.en;\n\t\t}\n\t\tfunction translateRu(key,params) { return interpolate$1(ru,key,params); }\n\t\tfunction interpolate$1(dictionary, key, params) {`);
replace('label: zh ? entry.label["zh-CN"] : entry.label.en,\n\t\t\t\thint: zh ? entry.description["zh-CN"] : entry.description.en',
 'label: localizedCopy(entry.label, language),\n\t\t\t\thint: localizedCopy(entry.description, language)');
replace('const text = (value) => value === void 0 ? "" : zh ? value["zh-CN"] : value.en;',
 'const text = (value) => localizedCopy(value, props.language);');
replace('const translate = props.locale.startsWith("en") ? translateEn : translateZh;',
 'const translate = russianLanguage(props.locale) ? translateRu : props.locale.startsWith("en") ? translateEn : translateZh;');
replace('const dictionary = locale.startsWith("en") ? en$1 : zh$1;',
 'const dictionary = russianLanguage(locale) ? ru : locale.startsWith("en") ? en$1 : zh$1;');
replace('const head = chain === void 0 ? language.startsWith("en") ? "en" : "zh" : chain.find((id) => id === "zh" || id === "en") ?? "en";',
 'const head = chain === void 0 ? russianLanguage(language) ? "ru" : language.startsWith("en") ? "en" : "zh" : chain.find((id) => id === "zh" || id === "en" || id === "ru") ?? "en";');
replace('const own = head === "en" ? en$1 : zh$1;',
 'const own = russianLanguage(head) ? ru : head === "en" ? en$1 : zh$1;');
replace('ctx.locale.register(namespace, {\n\t\t\t\tzh,\n\t\t\t\ten\n\t\t\t})',
 'ctx.locale.register(namespace, {\n\t\t\t\tzh,\n\t\t\t\ten,\n\t\t\t\tru\n\t\t\t})');
replace('exports.translateEn = translateEn;', 'exports.translateRu = translateRu;\n\t\texports.translateEn = translateEn;');
replace('function SourceManagementPage(props) {\n\t\t\tconst t = useT();', 'function SourceManagementPage(props) {\n\t\t\tconst language = useLocale();\n\t\t\tconst t = useT();');
replace('const fields = props.instance.management.fields ?? EMPTY_SOURCE_MANAGEMENT_FIELDS;', `const fields = (0, react.useMemo)(() => (props.instance.management.fields ?? EMPTY_SOURCE_MANAGEMENT_FIELDS).map(field => ({...field, label: localizeEnglish(field.label,language), description: localizeEnglish(field.description,language), options: field.options?.map(option => ({...option,label:localizeEnglish(option.label,language)}))})), [props.instance.management.fields, language]);`);
replace('title: props.instance.management.label,', 'title: localizeEnglish(props.instance.management.label, language),');
replace('description: props.instance.management.description,', 'description: localizeEnglish(props.instance.management.description, language),');
replace('children: props.instance.role', 'children: localizeEnglish(props.instance.role, language)');
replace('children: capability }, capability)', 'children: localizeEnglish(capability, language) }, capability)');
new vm.Script(source,{filename:'dsh-mnemon-ru-client.js'});
fs.writeFileSync(path.join(pkg,'lib/client.js'),source);
const manifest=JSON.parse(fs.readFileSync(path.join(upstream,'package.json'),'utf8'));
manifest.version='0.5.42+ru.2';
manifest.private=true;
manifest.bundledDependencies=['dsh-mnemon-source-runtime','dsh-mnemon-source-documents','dsh-mnemon-source-memory-spaces','dsh-mnemon-source-skills'];
manifest.description='Mnemon: русская локализация интерфейса; оперативная память, проектные документы и долговременные пространства памяти.';
delete manifest.repository;
delete manifest.homepage;
delete manifest.bugs;
delete manifest.publishConfig;
if(!manifest.files.includes('NOTICE.md'))manifest.files.push('NOTICE.md');
fs.writeFileSync(path.join(pkg,'package.json'),JSON.stringify(manifest,null,2)+'\n');
fs.copyFileSync(path.join(root,'NOTICE.md'),path.join(pkg,'NOTICE.md'));
fs.writeFileSync(path.join(pkg,'locale/ru.json'),JSON.stringify({meta:{}},null,2)+'\n');
fs.mkdirSync(path.join(work,'translation'),{recursive:true});
fs.writeFileSync(path.join(work,'translation/ru.json'),JSON.stringify(ru,null,2)+'\n');
console.log(JSON.stringify({version:manifest.version,translatedKeys:Object.keys(ru).length,componentStrings:Object.keys(metadata).length}));
