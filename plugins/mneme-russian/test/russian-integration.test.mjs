import test from 'node:test';
import assert from 'node:assert/strict';
import { renderMirrorText, parseHumanEdits } from '../src/mirror.js';
import { extractEntities } from '../src/entities/extractor.js';
import { createStore } from '../src/store.js';
import { createService } from '../src/service.js';
import { createInjector } from '../src/inject.js';
import { createSettings } from '../src/settings.js';
import { validateDecisions } from '../src/dream/decisions.js';

test('Russian merge rationales allow true duplicates but preserve negated protections',()=>{
 const snapshot=new Map(['p1','p2','h1','h2'].map(id=>[id,{id,type:id.startsWith('p')?'preference':'history',title:id,content:'Отдельные данные '+id,importance:3,archived:false,forgotten:false}]));
 for(const reason of ['дубликат того же факта','устаревшая запись','запись заменена новой','не дубликат, только похожая тема','не устарела, только похожая тема','не является дубликатом','нет дубликатов']){
  const negative=/^(не|нет)/.test(reason);
  const decisions=[{action:'merge',ids:['p1','p2'],keepSource:'p1',title:'Предпочтение',content:'Содержимое',importance:3,reason},{action:'merge',ids:['h1','h2'],keepSource:'h1',title:'История',content:'Содержимое',importance:3}];
  const {ok,skipped}=validateDecisions(decisions,snapshot,{skipInvalid:true,mergeGuard:true});
  assert.equal(ok,true,reason);
  assert.equal(skipped.length,negative?1:0,reason);
 }
});

test('Russian Markdown mirrors round-trip metadata, body and edit version token',()=>{
 const m={id:'ru-check',type:'preference',title:'Русский заголовок',content:'Сохранять решения по-русски. Путь C:/Tools/example.mjs не менять.',importance:4,tags:['memory'],updated_at:'2026-11-06T17:00:00.000Z'};
 const text=renderMirrorText('preference',[m],'ru');
 const edits=parseHumanEdits(text);
 assert.equal(edits.length,1);
 assert.equal(edits[0].id,m.id);
 assert.equal(edits[0].title,m.title);
 assert.equal(edits[0].content,m.content);
 assert.equal(edits[0].updated_at,m.updated_at);
});

test('Russian entity extraction retains JSON contract and technical identities',async()=>{
 let prompt;
 const result=await extractEntities({id:'ru-entry',content:'Проект Mneme хранит записи по-русски.'},{store:{findEntityByName(){return {id:'entity-1'}},updateEntity(){},saveAttr(x){return x}},config:{language:'ru'},logger:console,callLLM:async messages=>{prompt=messages[0].content[0].text;return JSON.stringify({entities:[{name:'Mneme',type:'project',attrs:[]}],relations:[]})}});
 assert.equal(result.ok,true);
 assert.match(prompt,/по-русски/);
 for(const field of ['entities','relations','confidence','depends_on'])assert(prompt.includes(field));
});

test('Russian injector renders localized content without affecting source data',()=>{
 const store=createStore(':memory:');
 try{
  const service=createService({store,mirror:null,config:{language:'ru'}});
  const settings=createSettings(store.db), contexts=[];
  createInjector({systemPrompt:{context(def){contexts.push(def)}}},service,settings,{language:'ru',maxInjectedItems:3,importanceThreshold:3});
  service.saveWithDedupe({type:'preference',title:'Язык памяти',content:'Новые записи памяти сохранять по-русски.',importance:5});
  const rendered=contexts.map(x=>x.text({})).join('\n');
  assert.match(rendered,/Язык памяти/);
  assert.match(rendered,/памят/i);
  assert(!rendered.includes('[Memory]'));
  assert(!rendered.includes('importance '));
 }finally{store.close()}
});
