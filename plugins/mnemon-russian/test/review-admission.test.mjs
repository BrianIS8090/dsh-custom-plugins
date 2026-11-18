import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {randomUUID} from 'node:crypto';
const source=fs.readFileSync(new URL('../dist/work/package/lib/index.js',import.meta.url),'utf8');
function region(name){const start=source.indexOf(`//#region src/host/${name}.ts`);assert.ok(start>=0,name);return source.slice(start,source.indexOf('//#endregion',start));}
const start=source.indexOf('function openAgentTurn(');
const end=source.indexOf('/**\n* One Agent owns',start);
const openFunctions=source.slice(start,end);
const policyStart=source.indexOf('function idleReviewBlockReason(');
const policyEnd=source.indexOf('/** The two writes',policyStart);
const policies=source.slice(policyStart,policyEnd);
const lifecycleStart=source.indexOf('var MnemonAgentLifecycle = class');
const lifecycleEnd=source.indexOf('//#endregion',lifecycleStart);
const fixture=vm.runInNewContext(openFunctions+policies+region('tool-execution')+region('review-admission')+source.slice(lifecycleStart,lifecycleEnd)+'\n({AutomaticReviewAdmission,MnemonAgentLifecycle,idleReviewBlockReason});',{
 randomUUID,AbortController,AbortSignal,setTimeout,clearTimeout,console,
 TurnActivityProjection:class{},memoryToolCalls:()=>0,completedToolActivity:()=>({count:0,names:new Set()}),eventTurn:e=>e.data?.turn
});
function agentFixture(){const events=[{type:'turn/start',data:{turn:1}},{type:'step/start',data:{turn:1,step:1}}];const hooks=new Map();let calls=0;let gate='allow';let preset='workspace-write';const admission=new fixture.AutomaticReviewAdmission();const agent={id:'fixture',status:'idle',session:{snapshotEvents:()=>events},ctx:{get:n=>n==='permissionPresets'?{current:()=>preset}:undefined,on(name,fn){const list=hooks.get(name)??[];list.push(fn);hooks.set(name,list);return()=>{list.splice(list.indexOf(fn),1);};}}};
 agent.ctx.tools={get:n=>n==='run_code'?undefined:{},async execute(input){calls++;const exec={...input,rootCallId:input.callId};let decision={kind:gate};for(const hook of hooks.get('tools/pre-execute')??[])decision=await hook(exec,async()=>decision);if(decision.kind!=='allow')return{isError:true};if(input.name!=='mnemon_subagent_result'||!admission.acknowledge(input.arguments,exec))return{isError:true};const result={isError:false};for(const hook of hooks.get('tools/result')??[])hook(exec,result);return result;}};
 return{agent,events,hooks,admission,get calls(){return calls;},set gate(v){gate=v;},set preset(v){preset=v;}};
}
function lifecycleFixture(){const f=agentFixture();let checks=0;const config={idleReview:{persistWatermark:false,agentTeams:'scoped',maxPerSession:3}};const lc=new fixture.MnemonAgentLifecycle(f.agent,{async checkReviewAccess(agent,signal){checks++;return f.admission.check(agent,signal);}},config,{},{},undefined,()=>undefined);lc.restoreWatermark=()=>true;lc.reviewPolicy=()=> 'fixed-policy';lc.recordComposedTurn=()=>{};lc.idleReviewAllowed=()=>fixture.idleReviewBlockReason(f.agent,'scoped')===undefined;lc.reviewActivity=()=>({eligible:true});lc.reviewAdmitted=()=>true;lc.ensureTurnActivity=()=>({});lc.cancelIdleReview=()=>{};lc.scheduleIdleReview=()=>{lc.scheduled=true;};return{...f,f,lc,get checks(){return checks;}};}
test('completion challenge works inside a real open step and retains deny/ask policy',async()=>{const f=agentFixture();try{assert.equal(await f.admission.check(f.agent,new AbortController().signal),true);f.gate='deny';assert.equal(await f.admission.check(f.agent,new AbortController().signal),false);f.gate='ask';assert.equal(await f.admission.check(f.agent,new AbortController().signal),false);}finally{f.admission.dispose();}});
test('never probes after step/end while turn remains open',async()=>{const f=agentFixture();f.events.push({type:'step/end',data:{turn:1,step:1}});try{assert.equal(await f.admission.check(f.agent,new AbortController().signal),false);assert.equal(f.calls,0);}finally{f.admission.dispose();}});
test('Auto is identified before rootless background probe without changing permissions',()=>{const f=agentFixture();f.preset='auto';assert.equal(fixture.idleReviewBlockReason(f.agent,'scoped'),'auto-review');f.preset='workspace-write';assert.equal(fixture.idleReviewBlockReason(f.agent,'scoped'),undefined);});
test('turn stopping only consumes admission and never invokes completion tool',async()=>{const f=lifecycleFixture();f.events.push({type:'step/end',data:{turn:1,step:1}});await f.lc.finishTurn({turn:1,signal:new AbortController().signal});assert.equal(f.checks,0);assert.notEqual(f.lc.scheduled,true);});
test('request hook awaits admission once per turn before closing step',async()=>{const f=lifecycleFixture();const stop=f.lc.start();try{const hook=f.hooks.get('agent/request')?.[0];assert.equal(typeof hook,'function');await hook({turn:1,signal:new AbortController().signal},async()=>({}));await hook({turn:1,signal:new AbortController().signal},async()=>({}));assert.equal(f.checks,1);f.events.push({type:'step/end',data:{turn:1,step:1}});await f.lc.finishTurn({turn:1,signal:new AbortController().signal});assert.equal(f.checks,1);assert.equal(f.lc.scheduled,true);}finally{stop();}});
test('Auto never starts admission challenge and snapshot reports explanatory pause',async()=>{const f=lifecycleFixture();f.f.preset='auto';const stop=f.lc.start();try{const hook=f.hooks.get('agent/request')?.[0];assert.equal(typeof hook,'function');await hook({turn:1,signal:new AbortController().signal},async()=>({}));await f.lc.finishTurn({turn:1,signal:new AbortController().signal});assert.equal(f.checks,0);assert.equal(f.lc.snapshot().idleReviewBlocked,'auto-review');}finally{stop();}});
