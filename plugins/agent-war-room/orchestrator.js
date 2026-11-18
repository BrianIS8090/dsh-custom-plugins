const ROLE_LABELS = {
  researcher: 'Researcher',
  architect: 'Architect',
  skeptic: 'Skeptic',
  verifier: 'Source verifier',
};
const ATTACK_ROUNDS = 2;
const PROMPT_TEXT_LIMIT = 42000;

const clip = text => String(text || '').trim().slice(0, PROMPT_TEXT_LIMIT);
const marker = (runId, role) => `[WAR_ROOM run=${runId} role=${role}]`;
const questionBlock = question => `\n\nВОПРОС ПОЛЬЗОВАТЕЛЯ:\n"""\n${clip(question)}\n"""\n`;

function researchPrompt(runId, question) {
  return `${marker(runId, 'researcher')}\nТы — Исследователь в War Room из четырёх ролей. Найди проверяемые факты, а не строй решение. Используй доступные инструменты поиска и чтения источников, когда они нужны. Отдавай предпочтение первоисточникам и свежим данным. Не показывай внутренние рассуждения.${questionBlock(question)}
Ответь только готовым Markdown-брифом на языке вопроса:
## Факты
- от 4 до 8 конкретных фактов; у каждого факта — активная ссылка на источник и, если уместно, дата данных;
## Ограничения данных
- чего не хватает, что противоречиво или требует проверки.
Не выдумывай ссылки и не сообщай как факт то, что не удалось подтвердить.`;
}

function architectPrompt(runId, question, research) {
  return `${marker(runId, 'architect')}\nТы — Архитектор решения в War Room. Собери первую версию единого артефакта на основе брифа Исследователя. Не показывай внутренние рассуждения.${questionBlock(question)}
ДОКАЗАТЕЛЬНАЯ БАЗА:
"""\n${clip(research)}\n"""\n
Верни только полный Markdown-документ без обращения к пользователю и без комментариев о своей работе. Структура:
# <краткое название решения>
## Решение
## Обоснование
## Риски и ограничения
## План действий
## Источники
Делай конкретный выбор, связывай важные утверждения с источниками из брифа, явно отделяй факты от допущений. Это черновик, который затем атакует Скептик.`;
}

function skepticPrompt(runId, question, draft, round) {
  return `${marker(runId, 'skeptic')}\nТы — Скептик в War Room. Раунд атаки ${round}. Пытайся сломать решение: ищи ложные допущения, пробелы в доказательствах, противоречия, неучтённые ресурсы и неудобные сценарии. Не переписывай документ и не будь вежливым за счёт точности. Не показывай внутренние рассуждения.${questionBlock(question)}
ПРОВЕРЯЕМЫЙ ДОКУМЕНТ:
"""\n${clip(draft)}\n"""\n
Верни только Markdown:
## Возражения
1. **Высокая|Средняя|Низкая серьёзность** — конкретное возражение к точному пункту документа и объяснение, при каком условии решение ломается.
Перечисли от 3 до 7 наиболее сильных возражений. Если какое-то возражение уже снято в новой версии, не повторяй его.`;
}

function verifierPrompt(runId, question, research, draft) {
  return `${marker(runId, 'verifier')}\nТы — независимый Верификатор источников в War Room. Не доверяй брифу Исследователя только потому, что в нём есть ссылки. Проверь наиболее важные утверждения по первоисточникам доступными инструментами. Не строй новое решение и не показывай внутренние рассуждения.${questionBlock(question)}
БРИФ:\n"""\n${clip(research)}\n"""\n\nЧЕРНОВИК:\n"""\n${clip(draft)}\n"""\n
Верни только Markdown:
## Проверка утверждений
- ✅ — подтверждено; дай короткое основание и ссылку.
- ⚠️ — частично подтверждено, устарело или требует оговорки; объясни какой.
- ❌ — опровергнуто или источник не подтверждает утверждение; объясни.
## Проверенные источники
- список фактически проверенных URL.
Проверь от 3 до 7 самых нагруженных утверждений. Не присваивай ✅ без реальной проверки.`;
}

function revisionPrompt(question, research, draft, objections, verification, round) {
  return `Раунд переработки ${round} War Room. Перепиши единый артефакт целиком. Сними сильные возражения, удали или явно пометь неподтверждённые утверждения, сохрани хорошие идеи. Не добавляй преамбулу и не описывай изменения — верни только новую полную Markdown-версию с прежними разделами: название, Решение, Обоснование, Риски и ограничения, План действий, Источники.\n\nВОПРОС:\n"""\n${clip(question)}\n"""\n\nФАКТЫ:\n"""\n${clip(research)}\n"""\n\nТЕКУЩИЙ ДОКУМЕНТ:\n"""\n${clip(draft)}\n"""\n\nВОЗРАЖЕНИЯ СКЕПТИКА:\n"""\n${clip(objections)}\n"""\n\nНЕЗАВИСИМАЯ ПРОВЕРКА ИСТОЧНИКОВ:\n"""\n${clip(verification)}\n"""`;
}

function secondAttackPrompt(question, draft, previous) {
  return `Второй и последний раунд атаки War Room. Проверь новую версию решения и не повторяй снятые возражения. Найди только оставшиеся или вновь появившиеся слабости. Верни 2–5 нумерованных возражений в прежнем формате; если критических проблем не осталось, честно укажи это и перечисли лишь остаточные риски.\n\nВОПРОС:\n"""\n${clip(question)}\n"""\n\nНОВАЯ ВЕРСИЯ:\n"""\n${clip(draft)}\n"""\n\nПРЕЖНИЕ ВОЗРАЖЕНИЯ:\n"""\n${clip(previous)}\n"""`;
}

export function outputText(output) {
  if (!Array.isArray(output)) return '';
  return output.map(block => block?.type === 'text' && typeof block.text === 'string' ? block.text : '').filter(Boolean).join('\n').trim();
}

export function latestAssistantText(session) {
  const events = session.snapshotEvents();
  for (let index = events.length - 1; index >= 0; index--) {
    const event = events[index];
    if (event.type !== 'assistant/message') continue;
    const text = outputText(event.data.message?.content);
    if (text) return text;
  }
  return '';
}

function assertResult(result, role) {
  const text = outputText(result?.output);
  if (!text) throw new Error(`${ROLE_LABELS[role]} returned no artifact (${result?.stopReason || 'unknown outcome'})`);
  if (result.stopReason === 'error' || result.stopReason === 'aborted') {
    throw new Error(`${ROLE_LABELS[role]} failed: ${result.diagnostic || result.stopReason}`);
  }
  return text;
}

export class WarRoomRunner {
  constructor(ctx) {
    this.ctx = ctx;
    this.activeByRoot = new Map();
    this.controllers = new Set();
    this.disposed = false;
  }

  start(agent, question, runId, externalSignal) {
    const clean = String(question || '').trim();
    if (!clean) throw new Error('A non-empty War Room question is required');
    if (this.disposed) throw new Error('War Room is unloading');
    if (this.ctx.subagents.rootOf(agent).id !== agent.id) throw new Error('Run War Room from the Team Lead session');
    const active = this.activeByRoot.get(agent.id);
    if (active) throw new Error(`War Room ${active} is already running in this session`);
    const controller = new AbortController();
    this.controllers.add(controller);
    const abort = () => controller.abort(externalSignal?.reason);
    if (externalSignal?.aborted) abort();
    else externalSignal?.addEventListener('abort', abort, { once: true });
    this.activeByRoot.set(agent.id, runId);
    const promise = this.execute(agent, clean, runId, controller.signal)
      .finally(() => {
        externalSignal?.removeEventListener('abort', abort);
        this.controllers.delete(controller);
        if (this.activeByRoot.get(agent.id) === runId) this.activeByRoot.delete(agent.id);
      });
    return { runId, promise };
  }

  async execute(agent, question, runId, signal) {
    const activations = [];
    const short = `r${runId.replace(/[^a-z0-9]/giu, '').toLowerCase().slice(-7) || Date.now().toString(36)}`.slice(0, 8);
    const spawn = async (role, prompt) => {
      const activation = await this.ctx.subagents.startActivation({
        provider: 'spawn',
        label: `War Room · ${ROLE_LABELS[role]}`,
        name: `wr-${role}-${short}`,
        parent: agent,
        prompt: [{ type: 'text', text: prompt }],
        delivery: 'caller',
        signal,
        maxDepth: 1,
      });
      activations.push(activation);
      return activation;
    };
    const continueAgent = async (childId, prompt, role) => {
      await this.ctx.subagents.sendMessage(agent, childId, [{ type: 'text', text: prompt }], { signal });
      const child = this.ctx.agents.get(childId);
      if (!child) throw new Error(`${ROLE_LABELS[role]} is no longer live`);
      await child.whenIdle();
      return latestAssistantText(child.session);
    };

    try {
      const researcher = await spawn('researcher', researchPrompt(runId, question));
      const research = assertResult(await researcher.result, 'researcher');

      const architect = await spawn('architect', architectPrompt(runId, question, research));
      let draft = assertResult(await architect.result, 'architect');
      const versions = [draft];

      let skeptic = null;
      let verifier = null;
      let objections = '';
      let verification = '';
      for (let round = 1; round <= ATTACK_ROUNDS; round++) {
        if (round === 1) {
          [skeptic, verifier] = await Promise.all([
            spawn('skeptic', skepticPrompt(runId, question, draft, round)),
            spawn('verifier', verifierPrompt(runId, question, research, draft)),
          ]);
          const [skepticResult, verifierResult] = await Promise.all([skeptic.result, verifier.result]);
          objections = assertResult(skepticResult, 'skeptic');
          verification = assertResult(verifierResult, 'verifier');
        } else {
          objections = await continueAgent(skeptic.childId, secondAttackPrompt(question, draft, objections), 'skeptic');
          if (!objections) throw new Error('Skeptic returned no second-round objections');
        }
        draft = await continueAgent(architect.childId, revisionPrompt(question, research, draft, objections, verification, round), 'architect');
        if (!draft) throw new Error(`Architect returned no revision ${round}`);
        versions.push(draft);
      }

      const allSources = [...new Set([research, ...versions, verification].flatMap(text => text.match(/https?:\/\/[^\s<>()\[\]{}"']+/giu) || []))];
      return {
        runId,
        status: 'completed',
        artifact: draft,
        versions: versions.length,
        sources: allSources.length,
        children: {
          researcher: researcher.childId,
          architect: architect.childId,
          skeptic: skeptic.childId,
          verifier: verifier.childId,
        },
      };
    } finally {
      await Promise.allSettled(activations.map(activation => activation.dispose()));
    }
  }

  async dispose() {
    this.disposed = true;
    for (const controller of this.controllers) controller.abort({ kind: 'disposed' });
    this.controllers.clear();
    this.activeByRoot.clear();
  }
}
