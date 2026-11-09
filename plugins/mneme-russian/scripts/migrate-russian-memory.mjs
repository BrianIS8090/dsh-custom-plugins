// One-time, backed-up translation. No model API calls; every text is reviewed JSON.
// Keep private input snapshots and generated reports in an external directory
// selected with MNEME_MIGRATION_INPUT_DIR, never inside this public package.
// --apply also requires MNEME_MIGRATION_DB_PATH and MNEME_MIGRATION_BACKUP_DIR;
// MNEME_MIGRATION_MEMORY_DIR optionally overrides the mirror directory.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { createStore } from '../lib/store.js';
import { createMirror } from '../lib/mirror.js';
import { LocalEmbedder } from '../lib/local-embedder.js';
const privateDir=process.env.MNEME_MIGRATION_INPUT_DIR;
if(!privateDir) throw new Error('Set MNEME_MIGRATION_INPUT_DIR to a private directory outside this package');
const source = JSON.parse(fs.readFileSync(path.join(privateDir, 'migration-source.json'), 'utf8'));
const translated = [1,2].flatMap(i => JSON.parse(fs.readFileSync(path.join(privateDir, `translation-output-${i}.json`), 'utf8')));
assert.deepEqual(translated.map(x=>x.id), source.map(x=>x.id));
assert.equal(new Set(translated.map(x=>x.id)).size, source.length);
for (const row of translated) {
  assert.deepEqual(Object.keys(row).sort(), ['content','id','title']);
  assert.match(row.title, /[А-Яа-яЁё]/);
  assert.match(row.content, /[А-Яа-яЁё]/);
}
const vectorFile = path.join(privateDir,'migration-vectors.json');
const embedder = new LocalEmbedder({model:'Xenova/paraphrase-multilingual-MiniLM-L12-v2',dimension:384,pooling:'mean',remoteHost:'https://huggingface.co/',resilientModelDownload:true,logger:console});
if(process.argv.includes('--prepare')) {
  try {
    await embedder.init();
    const vectors=[];
    for(let i=0;i<translated.length;i+=8){
      const batch=translated.slice(i,i+8);
      const values=await embedder.embed(batch.map(x=>`${x.title}\n${x.content}`));
      vectors.push(...batch.map((row,j)=>({id:row.id,embedding:values[j]})));
      console.log(`Indexed ${vectors.length}/${translated.length}`);
    }
    assert(vectors.every(x=>x.embedding.length===384&&x.embedding.every(Number.isFinite)));
    fs.writeFileSync(vectorFile,JSON.stringify({modelHash:embedder.modelHash,rows:vectors}));
  } finally {embedder.dispose();}
} else if(process.argv.includes('--apply')) {
  // Caller must unload Mneme first to discard its in-process caches and writers.
  const dbPath=process.env.MNEME_MIGRATION_DB_PATH;
  if(!dbPath) throw new Error('Set MNEME_MIGRATION_DB_PATH to the target memory.db');
  const memoryDir=process.env.MNEME_MIGRATION_MEMORY_DIR ?? path.dirname(dbPath);
  const vectors=JSON.parse(fs.readFileSync(vectorFile,'utf8'));
  assert.deepEqual(vectors.rows.map(x=>x.id), source.map(x=>x.id));
  const db=new DatabaseSync(dbPath);
  const rows=db.prepare('SELECT * FROM memories ORDER BY id').all();
  assert.equal(rows.length, source.length, 'Snapshot count changed: refresh translations before applying');
  for(let i=0;i<rows.length;i++){
    assert.equal(rows[i].id,source[i].id);
    assert.equal(rows[i].title,source[i].title,'Concurrent title edit');
    assert.equal(rows[i].content,source[i].content,'Concurrent content edit');
  }
  const backupDir=process.env.MNEME_MIGRATION_BACKUP_DIR;
  if(!backupDir) throw new Error('Set MNEME_MIGRATION_BACKUP_DIR to a private backup directory');
  const backupPath=path.join(backupDir,`memory-before-apply-${Date.now()}.db`);
  db.exec(`VACUUM INTO '${backupPath.replaceAll("'","''")}'`);
  db.close();
  const store=createStore(dbPath);
  const ignored=new Set(['title','content','content_hash','content_history','embedding','embedding_model']);
  try {
    store.db.exec('BEGIN IMMEDIATE');
    const now=new Date().toISOString();
    for(let i=0;i<rows.length;i++){
      const old=rows[i], t=translated[i];
      const history=old.content_history?JSON.parse(old.content_history):[];
      store.update(t.id,{title:t.title,content:t.content,content_history:[{title:old.title,content:old.content,source:'russian_translation',updated_at:now},...history]});
      store.setEmbedding(t.id,vectors.rows[i].embedding,vectors.modelHash);
      // Translation is not a new event: preserve freshness/priority semantics.
      store.db.prepare('UPDATE memories SET updated_at=? WHERE id=?').run(old.updated_at,t.id);
    }
    for(const old of rows){
      const row=store.db.prepare('SELECT * FROM memories WHERE id=?').get(old.id);
      for(const key of Object.keys(old))if(!ignored.has(key))assert.deepEqual(row[key],old[key],`Metadata changed ${old.id}: ${key}`);
    }
    store.markMirrorDirty('Russian translation: regenerate mirrors');
    store.db.exec('COMMIT');
    const mirror=createMirror(memoryDir,'ru');
    const result=mirror.sync(store.all().filter(x=>!x.archived&&!x.forgotten));
    assert(Object.values(result).every(x=>x.ok),JSON.stringify(result));
    store.markMirrorClean();
    assert.equal(store.db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
    const report={translated:rows.length,active:rows.filter(x=>!x.archived&&!x.forgotten).length,archived:rows.filter(x=>x.archived).length,metadataPreserved:true,vectorsRebuilt:rows.length,backupPath,completedAt:now};
    fs.writeFileSync(path.join(privateDir,'migration-report.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } catch(error){try{store.db.exec('ROLLBACK')}catch{}throw error;} finally {store.close();}
} else throw new Error('Use --prepare or --apply');
