window.__ModuleLoader__.load({
  id: '@local/running-session-preview',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    /* PREVIEW_HELPERS */
    const NS = '@local/running-session-preview';
    const dictionaries = /* DICTIONARIES */;
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
