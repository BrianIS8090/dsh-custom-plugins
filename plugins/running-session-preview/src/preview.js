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
