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
    const dictionaries = {"en":{"latestMessage":"Latest message"},"ru":{"latestMessage":"Последнее сообщение"}};
    const css = `
/* The always-visible row line is separate from the delayed hover-card message. */
.wnFoaW_sessionRow:has(.dsh-running-1e3fa7-row-message){position:relative;height:52px;padding-bottom:20px}
.wnFoaW_sessionRow>.wnFoaW_rowResting:has(.dsh-running-1e3fa7-row-message){display:inline-flex!important}
.wnFoaW_sessionRow:is(:hover,.wnFoaW_menuOpen)>.wnFoaW_rowResting:has(.dsh-running-1e3fa7-row-message)>:not([data-slot]),
html[data-input-modality=keyboard] .wnFoaW_sessionRow:focus-within>.wnFoaW_rowResting:has(.dsh-running-1e3fa7-row-message)>:not([data-slot]){display:none}
.dsh-running-1e3fa7-row-message{position:absolute;inset-inline-start:calc(var(--dsh-sidebar-row-padding) - var(--dsh-sidebar-paint-inset) + var(--dsh-workspace-indent,0px) + 16px + var(--dsh-sidebar-label-gap));inset-inline-end:8px;bottom:5px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:400;line-height:17px;pointer-events:none;text-align:start}
/* Only the hover card containing our running-session message is customized. */
._card_bgejw_9:has(.dsh-running-1e3fa7-message){width:min(488px,calc(100vw - 24px));max-width:calc(100vw - 24px);opacity:0;translate:-5px 0;transition:opacity 140ms ease 40ms,translate 140ms ease 40ms}
body:has(.wnFoaW_sessionRow:hover) ._card_bgejw_9:has(.dsh-running-1e3fa7-message),
._card_bgejw_9:has(.dsh-running-1e3fa7-message):is(:hover,:focus-within){opacity:1;translate:0 0;transition:opacity 180ms ease-out,translate 180ms cubic-bezier(.2,.8,.2,1)}
@starting-style{
body:has(.wnFoaW_sessionRow:hover) ._card_bgejw_9:has(.dsh-running-1e3fa7-message),
._card_bgejw_9:has(.dsh-running-1e3fa7-message):is(:hover,:focus-within){opacity:0;translate:-5px 0}
}
@media(prefers-reduced-motion:reduce){
._card_bgejw_9:has(.dsh-running-1e3fa7-message){opacity:1!important;translate:none!important;transition:none!important}
}
.wnFoaW_hoverContent:has(.dsh-running-1e3fa7-message){width:100%;max-width:none}
.wnFoaW_hoverContent:has(.dsh-running-1e3fa7-message)>.wnFoaW_hoverPath{display:none}
.dsh-running-1e3fa7-message{display:block;box-sizing:border-box;width:100%;max-height:min(240px,32vh);margin-top:8px;padding-top:8px;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font-size:13px;font-weight:400;line-height:20px;white-space:normal;overflow-wrap:anywhere;user-select:text;cursor:default;text-align:start}
`;

    function useSource(source) {
      const read = React.useMemo(() => ({
        subscribe: listener => source.subscribe(listener),
        getSnapshot: () => source.getSnapshot(),
      }), [source]);
      return React.useSyncExternalStore(read.subscribe, read.getSnapshot, read.getSnapshot);
    }

    function LatestMessage({ lease, sessionId, t, surface }) {
      const source = React.useMemo(() => createLatestMessageSource(lease.target), [lease]);
      const text = useSource(source);
      const session = useSource(lease.session);
      if (!text || session?.openState === 'error') return null;
      return h(React.Fragment, null,
        h('style', null, css),
        h('span', {
          className: surface === 'row' ? 'dsh-running-1e3fa7-row-message' : 'dsh-running-1e3fa7-message',
          'data-preview-surface': surface,
          'data-running-session-preview': sessionId,
          'aria-label': t('latestMessage') + ': ' + text,
          onClick: event => event.stopPropagation(),
          onDoubleClick: event => event.stopPropagation(),
        }, text));
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
        ? h(LatestMessage, { lease: state.lease, sessionId, t, surface }) : null;
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
