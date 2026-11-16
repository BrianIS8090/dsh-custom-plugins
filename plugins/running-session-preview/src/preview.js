/** Read-only adapters over the assembled Chat and root Session status. */
export const MESSAGE_LIMIT = 8;
export const PREVIEW_LIMIT = 240;

export function isRunningSession(summary, status, archived = false) {
  return !archived && (status?.running ?? summary?.running) === true;
}

/** Watch text-bearing message candidates, not tool results or hidden context. */
export function recentMessageKeys(chat, limit = MESSAGE_LIMIT) {
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

export function latestMessageText(chat) {
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
export function createLatestMessageSource(target) {
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

export const ACTIVITY_LIMIT = 12;
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

export function recentActivityKeys(chat) {
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
export function activityEntries(chat, t = key => key) {
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
export function createActivitySource(target, t) {
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
export function createPreviewRuntime(sessions, uiConversation) {
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
