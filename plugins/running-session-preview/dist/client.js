window.__ModuleLoader__.load({
  id: '@local/running-session-preview',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    /** Read-only adapters over the assembled Chat and root Session status. */
const MESSAGE_LIMIT = 8;
const PREVIEW_LIMIT = 240;

function isRunningSession(summary, status, archived = false) {
  return !archived && (status?.running ?? summary?.running) === true;
}

/** Watch text-bearing message candidates, not tool results or hidden context. */
function recentMessageKeys(chat, limit = MESSAGE_LIMIT) {
  if (!chat) return [];
  const keys = [];
  for (let i = chat.order.length - 1; i >= 0 && keys.length < limit; i--) {
    const key = chat.order[i];
    const node = chat.nodes.get(key);
    if (node?.visibility === 'visible' &&
      (node.kind === 'user' || node.kind === 'steering' || node.kind === 'assistant-step')) keys.push(key);
  }
  return keys.reverse();
}

function compactText(parts) {
  let text = '';
  for (const part of parts) {
    if (typeof part !== 'string') continue;
    // Bound each allocation even when a model/tool has emitted a huge block.
    text += part.slice(0, 2048).replace(/\s+/gu, ' ');
    if (text.trim().length > PREVIEW_LIMIT) break;
  }
  text = text.trim();
  return text.length > PREVIEW_LIMIT ? text.slice(0, PREVIEW_LIMIT - 1).trimEnd() + '…' : text;
}

function latestMessageText(chat) {
  const keys = recentMessageKeys(chat);
  for (let i = keys.length - 1; i >= 0; i--) {
    const node = chat.nodes.get(keys[i]);
    const content = node?.data?.content;
    const parts = node?.kind === 'assistant-step'
      ? (node.data.blocks ?? []).filter(block => block.kind === 'text').map(block => block.text)
      : typeof content === 'string' ? [content]
      : Array.isArray(content) ? content.filter(block => block.type === 'text').map(block => block.text) : [];
    const text = compactText(parts);
    if (text) return text;
  }
  return '';
}

/** Chat topology and individual nodes publish independently during token streaming. */
function createLatestMessageSource(target) {
  return {
    getSnapshot: () => latestMessageText(target.getSnapshot()),
    subscribe(listener) {
      let closed = false;
      let store;
      let keys = [];
      let drops = [];
      function changed() {
        if (closed) return;
        const chat = target.getSnapshot();
        const next = recentMessageKeys(chat);
        if (store !== chat?.nodes || next.length !== keys.length || next.some((key, i) => key !== keys[i])) {
          for (const drop of drops) drop();
          store = chat?.nodes;
          keys = next;
          drops = keys.map(key => store.source(key).subscribe(changed));
        }
        listener();
      }
      const stopTarget = target.subscribe(changed);
      changed();
      return () => {
        closed = true;
        stopTarget();
        for (const drop of drops) drop();
      };
    },
  };
}

const ACTIVITY_LIMIT = 12;
const ACTIVITY_NODE_LIMIT = 24;
const ACTIVITY_SCAN_LIMIT = 256;
const ACTIVITY_KINDS = new Set(['user', 'steering', 'assistant-step', 'tool-call', 'command',
  'manual-compaction', 'model-retry', 'turn-error', 'turn-max-tokens', 'compaction']);

function visibleActivity(node) {
  if (node?.visibility !== 'visible' || !ACTIVITY_KINDS.has(node.kind)) return false;
  // Те же исключения, что в штатном isVisibleChatNode: служебные команды не раскрываем.
  const data = node.data;
  return node.kind !== 'command' || (data?.name !== 'permission' &&
    !(data?.name === 'team' && /^(on|off)$/.test(data.args?.trim()) && data.outcome?.kind !== 'error'));
}

function recentActivityKeys(chat) {
  if (!chat?.order || !chat.nodes) return [];
  const keys = [];
  for (let i = chat.order.length - 1, scanned = 0;
    i >= 0 && scanned < ACTIVITY_SCAN_LIMIT && keys.length < ACTIVITY_NODE_LIMIT; i--, scanned++) {
    const key = chat.order[i];
    if (visibleActivity(chat.nodes.get(key))) keys.push(key);
  }
  return keys.reverse();
}

/** Только сводки видимых действий, не скрытый контекст, аргументы или вывод инструментов. */
function activityEntries(chat, t = key => key) {
  const entries = [];
  let nodePosition = 0, toolRank = 0;
  const add = (id, kind, text, label, status, time) => {
    text = compactText([text]);
    if (!text) return;
    const entry = { id, kind, text, label, status,
      time: Number.isFinite(time) ? time : 0, position: nodePosition, order: entries.length };
    entries.push(entry);
    return entry;
  };
  let toolBudget = 96;
  function addTool(root, nodeKey, depth = 0, seen = new Set()) {
    if (!root || depth > 8 || (depth > 0 && toolBudget-- <= 0) || seen.has(root)) return;
    seen.add(root);
    const status = root.kind === 'tool-result'
      ? (root.error?.code === 'interrupted' ? 'interrupted' : root.isError ? 'error' : 'completed')
      : root.phase === 'preparing' ? 'preparing' : 'running';
    const label = t({ interrupted: 'toolInterrupted', error: 'toolError', completed: 'toolCompleted', preparing: 'toolPreparing', running: 'toolRunning' }[status]);
    // PartialArguments изменяется на месте: textPrefix нужно читать при каждой сборке.
    const args = root.args;
    const detail = typeof args?.textPrefix === 'function'
      ? args.textPrefix('description', 160) || args.textPrefix('file_path', 160) || args.textPrefix('path', 160) : '';
    const name = compactText([root.name || root.call?.name || t('tool')]);
    const entry = add(nodeKey + ':tool:' + (root.callId ?? depth), 'tool', name + (detail ? ' — ' + detail : ''), label, status, root.time);
    if (entry) entry.order = depth === 0 ? -1000 : -toolRank++;
    // Обходим новые dispatch первыми, не мутируя исходное дерево.
    const children = root.subCalls ?? [];
    for (let i = children.length - 1; i >= 0 && toolBudget > 0; i--) addTool(children[i], nodeKey, depth + 1, seen);
  }
  const keys = recentActivityKeys(chat);
  for (let i = keys.length - 1; i >= 0; i--) {
    nodePosition = i;
    toolRank = 0;
    const key = keys[i], node = chat.nodes.get(key), data = node.data ?? {};
    const time = data.finalNode?.time ?? data.current?.time ?? data.time;
    if (node.kind === 'tool-call') {
      addTool(data.root, key);
    } else if (node.kind === 'assistant-step') {
      const blocks = data.blocks ?? [];
      const status = data.status === 'running' ? 'running' : data.status === 'interrupted' ? 'interrupted' : 'completed';
      // Не копируем текст reasoning: показывается только факт этого действия.
      if (blocks.some(block => block.kind === 'reasoning')) add(key + ':reasoning', 'reasoning', t('reasoning'), t('reasoning'), status, time);
      const text = compactText(blocks.filter(block => block.kind === 'text').map(block => block.text));
      if (text) add(key + ':text', 'message', text, t('assistantMessage'), status, time);
      if (blocks.some(block => block.kind === 'image')) add(key + ':image', 'attachment', t('image'), t('attachment'), status, time);
    } else if (node.kind === 'user' || node.kind === 'steering') {
      const content = data.content;
      const blocks = Array.isArray(content) ? content : [];
      const text = compactText(typeof content === 'string' ? [content] : blocks.filter(block => block.type === 'text').map(block => block.text));
      if (text) add(key, 'message', text, t(node.kind === 'user' ? 'userMessage' : 'steeringMessage'), 'completed', time);
      if (blocks.some(block => block.type === 'image' || block.type === 'file')) add(key + ':attachment', 'attachment', t('attachment'), t('userMessage'), 'completed', time);
    } else if (node.kind === 'command' || node.kind === 'manual-compaction') {
      const command = node.kind === 'command' ? data : data.command;
      const status = command?.outcome?.kind === 'error' ? 'error' : command?.outcome ? 'completed' : 'running';
      const text = node.kind === 'manual-compaction' ? t('compaction') : '/' + (command?.name || t('command'));
      add(key, 'command', text, t(status === 'error' ? 'commandError' : status === 'completed' ? 'commandCompleted' : 'commandRunning'), status, command?.time);
    } else if (node.kind === 'model-retry') {
      const status = data.current?.retryState ?? 'scheduled';
      add(key, 'retry', t(status === 'cancelled' ? 'retryCancelled' : status === 'started' ? 'retryStarted' : 'retryScheduled'), t('retry'), status, time);
    } else {
      const kind = node.kind;
      const label = t({ 'turn-error': data.code === 'INTERRUPTED' ? 'interrupted' : 'sessionError', 'turn-max-tokens': 'tokenLimit', compaction: 'compaction' }[kind]);
      add(key, kind, label, label, kind === 'turn-error' ? 'error' : 'completed', time);
    }
  }
  // Chat order привязан к началу вызова; завершившийся tool имеет более новое root.time.
  return entries.sort((a, b) => b.time - a.time || b.position - a.position || b.order - a.order).slice(0, ACTIVITY_LIMIT);
}

/** Стабильный React snapshot с подпиской и на topology, и на отдельные mutable tool nodes. */
function createActivitySource(target, t) {
  let cached = [], signature = '';
  return {
    getSnapshot() {
      const entries = activityEntries(target.getSnapshot(), t);
      const next = JSON.stringify(entries);
      if (next !== signature) { signature = next; cached = entries; }
      return cached;
    },
    subscribe(listener) {
      let closed = false, store, keys = [], drops = [];
      function changed() {
        if (closed) return;
        const chat = target.getSnapshot(), next = recentActivityKeys(chat);
        if (store !== chat?.nodes || next.length !== keys.length || next.some((key, i) => key !== keys[i])) {
          for (const drop of drops) drop();
          store = chat?.nodes;
          keys = next;
          drops = keys.map(key => store.source(key).subscribe(changed));
        }
        listener();
      }
      const stopTarget = target.subscribe(changed);
      changed();
      return () => {
        closed = true;
        stopTarget();
        for (const drop of drops) drop();
      };
    },
  };
}

/** Acquire only for a mounted running row; never navigate or acknowledge completion. */
function createPreviewRuntime(sessions, uiConversation) {
  const leases = new Set();
  let disposed = false;
  return {
    open(sessionId) {
      if (disposed) throw new Error('Preview runtime is disposed');
      const reference = sessions.retain(sessionId, {
        source: '@local/running-session-preview:running-row',
      });
      try {
        const binding = reference.binding;
        const target = uiConversation.binding(binding).target('chat');
        let closed = false;
        const lease = {
          sessionId,
          session: binding.session,
          target,
          ready: reference.ready,
          close() {
            if (closed) return;
            closed = true;
            leases.delete(lease);
            reference.release();
          },
        };
        leases.add(lease);
        return lease;
      } catch (error) {
        reference.release();
        throw error;
      }
    },
    dispose() {
      disposed = true;
      for (const lease of [...leases]) lease.close();
    },
  };
}

    const NS = '@local/running-session-preview';
    const dictionaries = {"en":{"latestMessage":"Latest message","latestActivity":"Latest action","recentActivity":"Recent actions · newest first","assistantMessage":"Assistant message","userMessage":"User message","steeringMessage":"User steering","reasoning":"Reasoning","attachment":"Attachment","image":"Image","tool":"Tool","toolPreparing":"Preparing call","toolRunning":"Running","toolCompleted":"Completed","toolError":"Tool failed","toolInterrupted":"Call interrupted","command":"Command","commandRunning":"Running command","commandCompleted":"Command completed","commandError":"Command failed","retry":"Request retry","retryScheduled":"Waiting to retry request","retryStarted":"Request retry started","retryCancelled":"Request retry cancelled","interrupted":"Generation stopped","sessionError":"Session error","tokenLimit":"Response limit reached","compaction":"Context compaction"},"ru":{"latestMessage":"Последнее сообщение","latestActivity":"Последнее действие","recentActivity":"Последние действия · новое сверху","assistantMessage":"Сообщение ассистента","userMessage":"Сообщение пользователя","steeringMessage":"Уточнение пользователя","reasoning":"Рассуждение","attachment":"Вложение","image":"Изображение","tool":"Инструмент","toolPreparing":"Подготовка вызова","toolRunning":"Выполняется","toolCompleted":"Выполнено","toolError":"Ошибка инструмента","toolInterrupted":"Вызов прерван","command":"Команда","commandRunning":"Выполняется команда","commandCompleted":"Команда выполнена","commandError":"Ошибка команды","retry":"Повтор запроса","retryScheduled":"Ожидание повторного запроса","retryStarted":"Повторный запрос начат","retryCancelled":"Повторный запрос отменён","interrupted":"Генерация остановлена","sessionError":"Ошибка сессии","tokenLimit":"Достигнут лимит ответа","compaction":"Сжатие контекста"}};
    const css = `
/* The always-visible row line is separate from the delayed hover-card message. */
.wnFoaW_sessionRow:has(.dsh-running-1e3fa7-row-message){position:relative;height:52px;padding-bottom:20px}
.wnFoaW_sessionRow>.wnFoaW_rowResting:has(.dsh-running-1e3fa7-row-message){display:inline-flex!important}
.wnFoaW_sessionRow:is(:hover,.wnFoaW_menuOpen)>.wnFoaW_rowResting:has(.dsh-running-1e3fa7-row-message)>:not([data-slot]),
html[data-input-modality=keyboard] .wnFoaW_sessionRow:focus-within>.wnFoaW_rowResting:has(.dsh-running-1e3fa7-row-message)>:not([data-slot]){display:none}
.dsh-running-1e3fa7-row-message{position:absolute;inset-inline-start:calc(var(--dsh-sidebar-row-padding) - var(--dsh-sidebar-paint-inset) + var(--dsh-workspace-indent,0px) + 16px + var(--dsh-sidebar-label-gap));inset-inline-end:8px;bottom:5px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:400;line-height:17px;pointer-events:none;text-align:start}
/* Только наша карточка; hash класса HoverCard меняется между релизами DSH. */
div:has(>.wnFoaW_hoverContent .dsh-running-1e3fa7-message){width:min(488px,calc(100vw - 24px));max-width:calc(100vw - 24px);animation:dsh-running-1e3fa7-enter 180ms ease-out}
@keyframes dsh-running-1e3fa7-enter{from{opacity:0;translate:-5px 0}to{opacity:1;translate:0 0}}
@media(prefers-reduced-motion:reduce){
div:has(>.wnFoaW_hoverContent .dsh-running-1e3fa7-message){animation:none}
}
.wnFoaW_hoverContent:has(.dsh-running-1e3fa7-message){width:100%;max-width:none}
.wnFoaW_hoverContent:has(.dsh-running-1e3fa7-message)>.wnFoaW_hoverPath{display:none}
.dsh-running-1e3fa7-message{display:block;box-sizing:border-box;width:100%;max-height:min(240px,32vh);margin-top:8px;padding-top:8px;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;border-top:1px solid color-mix(in srgb,currentColor 18%,transparent);color:var(--dsw-alias-hovercard-label-primary);font-size:13px;font-weight:400;line-height:20px;white-space:normal;overflow-wrap:anywhere;user-select:text;cursor:default;text-align:start}
`;

    const activityCss = `
.dsh-running-1e3fa7-heading{font-size:12px;font-weight:600;color:inherit;margin-bottom:4px}
.dsh-running-1e3fa7-activity-list{list-style:none;margin:0;padding:0;color:inherit}
.dsh-running-1e3fa7-activity{display:block;margin:0;padding:6px 0;color:inherit}
.dsh-running-1e3fa7-activity+.dsh-running-1e3fa7-activity{border-top:1px solid color-mix(in srgb,currentColor 18%,transparent)}
.dsh-running-1e3fa7-activity-label{display:block;font-size:12px;line-height:16px;opacity:.8;color:inherit}
.dsh-running-1e3fa7-activity-text{display:block;color:inherit;overflow-wrap:anywhere}
.dsh-running-1e3fa7-message:focus-visible{outline:2px solid currentColor;outline-offset:2px}
`;

    function useSource(source) {
      const read = React.useMemo(() => ({
        subscribe: listener => source.subscribe(listener),
        getSnapshot: () => source.getSnapshot(),
      }), [source]);
      return React.useSyncExternalStore(read.subscribe, read.getSnapshot, read.getSnapshot);
    }

    function LatestActivity({ lease, sessionId, t, surface }) {
      const source = React.useMemo(() => createActivitySource(lease.target, t), [lease, t]);
      const entries = useSource(source);
      const session = useSource(lease.session);
      if (!entries.length || session?.openState === 'error') return null;
      const latest = entries[0];
      const text = latest.kind === 'tool' || latest.kind === 'command'
        ? latest.label + ': ' + latest.text : latest.text;
      const common = {
        'data-preview-surface': surface,
        'data-running-session-preview': sessionId,
        onClick: event => event.stopPropagation(),
        onDoubleClick: event => event.stopPropagation(),
      };
      return h(React.Fragment, null,
        h('style', null, css + activityCss),
        surface === 'row'
          ? h('span', { ...common, className: 'dsh-running-1e3fa7-row-message',
            'aria-label': t('latestActivity') + ': ' + text }, text)
          : h('div', { className: 'dsh-running-1e3fa7-message', tabIndex: 0, role: 'region',
            'aria-label': t('recentActivity'), onClick: event => event.stopPropagation(),
            onDoubleClick: event => event.stopPropagation(),
            onKeyDown: event => { if (event.key === 'Enter' || event.key === ' ') event.stopPropagation(); } },
            h('div', { className: 'dsh-running-1e3fa7-heading' }, t('recentActivity')),
            h('ol', { className: 'dsh-running-1e3fa7-activity-list' }, entries.map(entry =>
              h('li', { key: entry.id, className: 'dsh-running-1e3fa7-activity', 'data-activity-status': entry.status },
                h('span', { className: 'dsh-running-1e3fa7-activity-label' },
                  h('span', { 'aria-hidden': true }, entry.status === 'error' ? '! ' : entry.status === 'running' || entry.status === 'preparing' ? '… ' : '· '), entry.label),
                h('span', { ...common, className: 'dsh-running-1e3fa7-activity-text',
                  'aria-label': entry.label + ': ' + entry.text }, entry.text))))));
    }

    function RunningMessage({ sessionId, runtime, t, surface }) {
      const [state, setState] = React.useState(null);
      React.useEffect(() => {
        let active = true;
        let lease;
        try {
          lease = runtime.open(sessionId);
          setState({ sessionId, lease });
          lease.ready.catch(() => {
            lease.close();
            if (active) setState(null);
          });
        } catch (_error) {
          lease?.close();
          setState(null);
        }
        return () => { active = false; lease?.close(); };
      }, [sessionId, runtime]);
      return state?.sessionId === sessionId && state.lease
        ? h(LatestActivity, { lease: state.lease, sessionId, t, surface }) : null;
    }

    function Preview({ sessionId, runtime, surface = 'hover', useSessions, useSessionStatus, useWorkspaces, t }) {
      const summaryRunning = useSessions(snapshot => snapshot.byId[sessionId]?.running);
      const statusRunning = useSessionStatus(snapshot => snapshot.get(sessionId)?.running);
      const archived = useWorkspaces(snapshot => snapshot.archivedSessionIds.includes(sessionId));
      const running = isRunningSession({ running: summaryRunning }, { running: statusRunning }, archived);
      // Both surfaces follow own-Agent activity; the hover surface mounts only after host dwell.
      return running ? h(RunningMessage, { key: sessionId, sessionId, runtime, t, surface }) : null;
    }

    return {
      inject: ['slots', 'locale', 'sessions', 'uiConversation'],
      apply(ctx) {
        const runtime = createPreviewRuntime(ctx.sessions, ctx.uiConversation);
        ctx.effect(() => () => runtime.dispose());
        ctx.effect(() => ctx.locale.register(NS, dictionaries));
        ctx.slots.inject('sidebar.session.row.hover', () => ctx.slots.register({
          name: 'sidebar.session.row.hover',
          id: NS + ':preview',
          order: 30,
          locale: NS,
          inject: () => ({ runtime, surface: 'hover' }),
        }, Preview));
        ctx.slots.inject('sidebar.session.row.trailing', () => ctx.slots.register({
          name: 'sidebar.session.row.trailing',
          id: NS + ':row-preview',
          order: 30,
          locale: NS,
          inject: () => ({ runtime, surface: 'row' }),
        }, Preview));
      },
    };
  },
});
