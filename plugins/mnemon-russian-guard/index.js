import path from 'node:path';
import {createGuard} from './controller.mjs';
import {TARGETS} from './transform.mjs';
export const name='mnemon-russian-guard';
export const inject=['clientModules'];
export function apply(ctx){
 const profile=ctx.get('profileContext')?.dir??process.env.DSH_PROFILE_DIR;
 if(typeof profile!=='string'||!path.isAbsolute(profile)){
  ctx.logger.warn('Русификатор Mnemon не запущен: каталог профиля неизвестен.');
  return;
 }
 ctx.effect(()=>{
  const registry=ctx.clientModules;
  for(const method of ['clientPath','rebuilt','onGraphChanged','onRebuilt'])if(typeof registry[method]!=='function'){
   ctx.logger.warn('Русификатор Mnemon пропущен: API Harness изменился ('+method+').');return;
  }
  const guard=createGuard({registry,stateDir:path.join(profile,'.mnemon-russian-guard'),log:(level,message)=>ctx.logger[level](message)});
  let stopped=false,scheduled=false;
  const schedule=()=>{
   if(stopped||scheduled)return;
   scheduled=true;
   queueMicrotask(()=>{
    scheduled=false;if(stopped)return;
    try{guard.tick();}catch(error){ctx.logger.warn('Проверка русификации Mnemon пропущена: '+error.message);}
   });
  };
  const offGraph=registry.onGraphChanged(schedule);
  const offRebuilt=registry.onRebuilt(id=>{if(TARGETS.includes(id))schedule();});
  const timer=setInterval(schedule,2000);timer.unref?.();
  schedule();
  return ()=>{stopped=true;offGraph();offRebuilt();clearInterval(timer);guard.stop();};
 },'mnemon-russian-guard: автоматическое восстановление перевода');
}
