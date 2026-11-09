window.__ModuleLoader__.load({
  id: '@local/agent-team-monitor',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    var module = { exports: {} };
    var exports = module.exports;

    const NS = 'agent-team-monitor';
    const STYLE_ID = 'agent-team-monitor/canvas.css';
    const EMPTY_LIST = [];
    const RECENT_MESSAGE_MS = 14000;
    const CHAT_ENTRY_LIMIT = 100;
    const CHAT_FOLLOW_PX = 48;
    const CARD_GAP = 30;
    const ROUTE_CELL = 36;
    const ROUTE_MARGIN = 24;
    const routeCache = new Map();

    // Lucide icons are ISC-licensed. Copyright (c) Lucide Contributors, lucide.dev.
    const ICON_PATHS = {
      crown: '<path d="M11.56 3.27a.5.5 0 0 1 .88 0L15 6l4-1-2 13H7L5 5l4 1z"/><path d="M5 21h14"/>',
      bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4M8 12h.01M16 12h.01M8 16h8M2 12h2M20 12h2"/>',
      users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
      message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
      activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16 14h1v4"/>',
      minus: '<path d="M5 12h14"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      maximize: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
      x: '<path d="M18 6 6 18M6 6l12 12"/>',
      clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4"/>',
      send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
      cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    };

    const en = {
      locale: 'en-US', view: 'Team', title: 'Agent Teams', live: 'LIVE', idle: 'IDLE',
      canvasHint: 'drag to pan · scroll to zoom · click agent for details',
      zoomIn: 'Zoom in', zoomOut: 'Zoom out', fit: 'Fit the whole Team',
      unavailableTitle: 'Team data is unavailable', unavailableBody: 'Open a Team Lead or teammate conversation to see its live canvas.',
      noAgentsTitle: 'No agents in this Team yet', noAgentsBody: 'Members will appear here as soon as the Team projection reports them.',
      activeAgents: 'active agents', teamTokens: 'Team tokens', agentTime: 'agent time', teamMessages: 'Team messages',
      roleLead: 'Orchestrator', roleResearch: 'Research', roleReview: 'Review', roleCode: 'Development', roleTest: 'Testing',
      roleArchitecture: 'Architecture', roleAnalysis: 'Analysis', roleWriting: 'Writing', roleInfra: 'Infrastructure', roleDesign: 'Design', roleGeneric: 'Teammate',
      orbit: 'ORBIT {ring}',
      statusRunning: 'Running now', statusInactive: 'Inactive', statusProvisioning: 'Provisioning', statusFailed: 'Failed',
      noTask: 'No active task', noMessage: 'No messages yet', noActivity: 'No activity yet',
      overview: 'Overview', chat: 'Agent chat', close: 'Close', openMain: 'Open in main chat',
      purpose: 'Purpose', currentTask: 'Current task', lastAction: 'Last action', lastMessage: 'Last message',
      tokensAndTime: 'Tokens and time', input: 'input', output: 'output', total: 'total tokens', cacheRead: 'cache read', cacheWrite: 'cache write', reasoning: 'reasoning',
      activeTime: 'active time', llmTime: 'LLM', toolTime: 'tools', turnsSteps: 'turns / steps', sentReceived: 'sent / received', messageCount: 'messages',
      runtimeName: 'Runtime name', sessionId: 'Session', model: 'Model', provider: 'Provider', context: 'Context',
      tokenIncomplete: 'Only provider-reported totalTokens is included. {count} usage records have no reported total, so the total is incomplete.',
      durationHours: '{hours}h {minutes}m', durationMinutes: '{minutes}m {seconds}s', durationSeconds: '{seconds}s',
      secondsAgo: '{seconds}s ago', minutesAgo: '{minutes}m ago',
      user: 'USER', tool: 'Tool', toolResult: 'Tool result', modelUnknown: 'model not set', reasoningLevel: 'reasoning',
      chatLoading: 'Loading agent history…', chatError: 'Could not load agent history', chatEmpty: 'No durable messages in this history yet', renderError: 'Team view could not be rendered', retry: 'Retry',
      mainChatTitle: 'Main chat', mainChatHint: 'Live duplicate of the current conversation', assistant: 'Assistant', mainChatEmpty: 'No messages in the main chat yet', mainChatLoading: 'Loading the main chat…', subagentNotice: 'SUBAGENT', systemNotice: 'SYSTEM',
      loadOlder: 'Load earlier history', loadingOlder: 'Loading earlier history…', noPreview: 'No preview available',
      incoming: 'incoming', outgoing: 'outgoing', call: 'CALL', result: 'RESULT',
    };

    const ru = {
      locale: 'ru-RU', view: 'Команда', title: 'Agent Teams', live: 'LIVE', idle: 'IDLE',
      canvasHint: 'тяните холст · колесо — масштаб · клик по агенту — детали',
      zoomIn: 'Увеличить', zoomOut: 'Уменьшить', fit: 'Вместить всю команду',
      unavailableTitle: 'Данные команды недоступны', unavailableBody: 'Откройте разговор лидера или участника команды, чтобы увидеть живой холст.',
      noAgentsTitle: 'В команде пока нет агентов', noAgentsBody: 'Участники появятся здесь, когда projection команды сообщит о них.',
      activeAgents: 'агентов работает', teamTokens: 'токенов команды', agentTime: 'общее agent-time', teamMessages: 'сообщений в команде',
      roleLead: 'Оркестратор', roleResearch: 'Исследование', roleReview: 'Ревью', roleCode: 'Разработка', roleTest: 'Тестирование',
      roleArchitecture: 'Архитектура', roleAnalysis: 'Аналитика', roleWriting: 'Документация', roleInfra: 'Инфраструктура', roleDesign: 'Дизайн', roleGeneric: 'Участник',
      orbit: 'ОРБИТА {ring}',
      statusRunning: 'Работает сейчас', statusInactive: 'Неактивен', statusProvisioning: 'Запускается', statusFailed: 'Ошибка',
      noTask: 'Нет активной задачи', noMessage: 'Сообщений пока нет', noActivity: 'Активности пока нет',
      overview: 'Обзор', chat: 'Чат агента', close: 'Закрыть', openMain: 'Открыть в основном чате',
      purpose: 'Назначение', currentTask: 'Текущая задача', lastAction: 'Последнее действие', lastMessage: 'Последнее сообщение',
      tokensAndTime: 'Токены и время', input: 'входные', output: 'выходные', total: 'всего токенов', cacheRead: 'чтение кэша', cacheWrite: 'запись кэша', reasoning: 'рассуждения',
      activeTime: 'активное время', llmTime: 'LLM', toolTime: 'инструменты', turnsSteps: 'ходы / шаги', sentReceived: 'отправлено / получено', messageCount: 'сообщения',
      runtimeName: 'Runtime name', sessionId: 'Session', model: 'Модель', provider: 'Провайдер', context: 'Контекст',
      tokenIncomplete: 'Учтён только provider-reported totalTokens. В {count} записях usage нет reported total, поэтому итог неполный.',
      durationHours: '{hours}ч {minutes}м', durationMinutes: '{minutes}м {seconds}с', durationSeconds: '{seconds}с',
      secondsAgo: '{seconds}с назад', minutesAgo: '{minutes}м назад',
      user: 'USER', tool: 'Инструмент', toolResult: 'Результат инструмента', modelUnknown: 'модель не задана', reasoningLevel: 'уровень',
      chatLoading: 'Загружаем историю агента…', chatError: 'Не удалось загрузить историю агента', chatEmpty: 'В этой истории пока нет сохранённых сообщений', renderError: 'Не удалось отрисовать вкладку команды', retry: 'Повторить',
      mainChatTitle: 'Основной чат', mainChatHint: 'Живая копия текущего разговора', assistant: 'Ассистент', mainChatEmpty: 'В основном чате пока нет сообщений', mainChatLoading: 'Загружаем основной чат…', subagentNotice: 'СУБАГЕНТ', systemNotice: 'СИСТЕМА',
      loadOlder: 'Загрузить более раннюю историю', loadingOlder: 'Загружаем более раннюю историю…', noPreview: 'Нет предпросмотра',
      incoming: 'входящее', outgoing: 'исходящее', call: 'ВЫЗОВ', result: 'РЕЗУЛЬТАТ',
    };

    const CSS = `
      .atm-app{--atm-stats-height:82px;position:relative;height:100%;min-height:0;display:grid;grid-template-rows:minmax(0,1fr) auto;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:13px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
      .atm-app *{box-sizing:border-box}.atm-app button{font:inherit;color:inherit}.atm-app button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:3px}
      .atm-stage{position:relative;min-height:0;overflow:hidden}.atm-viewport{position:absolute;inset:0;overflow:hidden;touch-action:none;cursor:grab;background-color:var(--dsw-alias-bg-base);background-image:radial-gradient(var(--dsw-alias-border-l1) 1px,transparent 1px);background-size:28px 28px}.atm-viewport.dragging{cursor:grabbing}
      .atm-viewport:after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 44%,transparent 25%,var(--dsw-alias-bg-base) 130%)}
      .atm-world{position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0;will-change:transform}.atm-edges{position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none}.atm-nodes{position:absolute;left:0;top:0}.atm-node-position{position:absolute;transform:translate(-50%,-50%)}
      .atm-topbar{position:absolute;z-index:20;left:24px;top:22px;display:flex;align-items:center;gap:12px;pointer-events:none}.atm-brand{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:720;letter-spacing:-.01em}.atm-brand-mark{width:32px;height:32px;display:grid;place-items:center;border:1px solid var(--dsw-alias-brand-primary);border-radius:10px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}
      .atm-live-tag{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;background:var(--dsw-alias-bg-layer-1);padding:5px 9px;color:var(--dsw-alias-state-success-primary);font-size:10px}.atm-live-tag.idle{color:var(--dsw-alias-state-idle-primary)}
      .atm-live-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-success-primary);animation:atmLivePulse 2s infinite}.idle .atm-live-dot{background:var(--dsw-alias-state-idle-primary);animation:none}
      .atm-hint{position:absolute;top:46px;left:0;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:10px}
      .atm-controls{position:absolute;z-index:30;right:22px;top:20px;display:flex;align-items:center;gap:6px;padding:6px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 10px 30px var(--dsw-alias-border-l1)}
      .atm-icon-button{width:32px;height:32px;display:grid;place-items:center;border:0;border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background-color .18s,color .18s}.atm-icon-button:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}.atm-zoom-value{min-width:48px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:11px;font-variant-numeric:tabular-nums}.atm-separator{width:1px;height:18px;background:var(--dsw-alias-border-l1);margin:0 2px}
      .atm-icon{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
      .atm-card{position:relative;width:246px;min-height:156px;padding:15px;border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 14px 38px var(--dsw-alias-border-l1);cursor:pointer;text-align:left;transform:scale(1);transform-origin:center;transition:transform .22s ease,opacity .22s ease,filter .22s ease,border-color .22s ease,box-shadow .22s ease;will-change:transform}
      .atm-card:hover{transform:scale(1.045);border-color:var(--dsw-alias-brand-primary);box-shadow:0 20px 50px var(--dsw-alias-border-l2);z-index:4}.atm-card.selected{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 2px var(--dsw-alias-border-l2),0 20px 50px var(--dsw-alias-border-l1)}
      .atm-card.inactive{opacity:.43;filter:saturate(.45)}.atm-card.inactive:hover{opacity:.92;filter:saturate(.9)}.atm-card.lead{width:264px;background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-brand-primary);box-shadow:0 18px 54px var(--dsw-alias-border-l1)}
      .atm-card-head{display:flex;align-items:center;gap:11px}.atm-avatar{width:38px;height:38px;flex:none;display:grid;place-items:center;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}
      .atm-agent-name{display:block;font-size:14px;font-weight:750;letter-spacing:-.01em;overflow-wrap:anywhere}.atm-agent-role{display:block;margin-top:2px;color:var(--dsw-alias-label-secondary);font-size:10px;letter-spacing:.08em;text-transform:uppercase}
      .atm-status-dot{width:8px;height:8px;flex:none;margin-left:auto;border-radius:50%;background:var(--dsw-alias-state-idle-primary)}.atm-status-dot.active{background:var(--dsw-alias-state-success-primary);box-shadow:0 0 12px var(--dsw-alias-state-success-primary);animation:atmLivePulse 2.2s infinite}.atm-status-dot.failed{background:var(--dsw-alias-state-error-primary)}.atm-status-dot.provisioning{background:var(--dsw-alias-state-warn-primary)}
      .atm-purpose{display:block;margin-top:12px;color:var(--dsw-alias-label-primary);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.atm-card-model{display:flex;align-items:center;gap:5px;min-width:0;margin-top:6px;color:var(--dsw-alias-label-secondary);font-size:9px}.atm-card-model .atm-icon{width:11px;height:11px;color:var(--dsw-alias-brand-primary)}.atm-card-model-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.atm-card-reasoning{flex:none;margin-left:auto;padding:1px 5px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;color:var(--dsw-alias-brand-primary);font-size:8px;line-height:1.3;text-transform:uppercase}.atm-task{display:flex;align-items:center;gap:7px;margin-top:7px;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;overflow:hidden}.atm-task>span{overflow:hidden;text-overflow:ellipsis}.atm-task .atm-icon,.atm-last .atm-icon{width:14px;height:14px}
      .atm-last{display:flex;align-items:flex-start;gap:7px;margin-top:12px;padding-top:10px;border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:10px}.atm-last-text{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;overflow-wrap:anywhere}.atm-last-time{margin-left:auto;white-space:nowrap;font-variant-numeric:tabular-nums}
      .atm-edge-structural{fill:none;stroke:var(--dsw-alias-border-l2);stroke-width:1.2;stroke-dasharray:4 7;opacity:.35}.atm-edge-base{fill:none;stroke:var(--dsw-alias-border-l2);stroke-width:1.6;opacity:.65}.atm-edge-flow{fill:none;stroke:var(--dsw-alias-brand-primary);stroke-width:2;stroke-linecap:round;stroke-dasharray:2 9;opacity:.85;animation:atmEdgeFlow 1.1s linear infinite}.atm-edge-count{fill:var(--dsw-alias-label-primary);stroke:var(--dsw-alias-bg-layer-1);stroke-width:5px;paint-order:stroke;font-size:11px;font-weight:750;text-anchor:middle}.atm-pulse{fill:var(--dsw-alias-brand-primary);filter:drop-shadow(0 0 6px var(--dsw-alias-brand-primary))}.atm-pulse-core{fill:var(--dsw-alias-label-primary)}.atm-orbit{fill:none;stroke:var(--dsw-alias-border-l1);stroke-width:1;stroke-dasharray:3 10}
      .atm-main-chat{position:absolute;z-index:25;left:16px;top:96px;bottom:calc(var(--atm-stats-height,82px) + 16px);width:360px;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--dsw-alias-border-l1);border-radius:16px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 16px 44px var(--dsw-alias-border-l1);backdrop-filter:blur(14px)}.atm-main-chat-head{flex:none;display:flex;align-items:center;gap:9px;padding:14px 15px;border-bottom:1px solid var(--dsw-alias-border-l1)}.atm-main-chat-title{font-size:13px;font-weight:750}.atm-main-chat-subtitle{margin-top:2px;color:var(--dsw-alias-label-secondary);font-size:10px}.atm-main-chat-live{margin-left:auto;color:var(--dsw-alias-state-success-primary);font-size:9px;letter-spacing:.06em}.atm-main-chat-history{width:26px;height:26px;flex:none;margin-left:auto;display:grid;place-items:center;padding:0;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);cursor:pointer;transition:border-color .16s,color .16s,opacity .16s}.atm-main-chat-history+.atm-main-chat-live{margin-left:0}.atm-main-chat-history:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary)}.atm-main-chat-history:disabled{opacity:.5;cursor:wait}.atm-main-chat-history .atm-icon{width:13px;height:13px}.atm-main-chat-log{display:flex;flex:1;min-height:0;height:100%;flex-direction:column;gap:10px;padding:13px;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;scrollbar-gutter:stable}.atm-main-chat-body{display:flex;flex:1;min-height:0;flex-direction:column;overflow:hidden}.atm-main-msg{max-width:92%;align-self:flex-start}.atm-main-msg.is-user{align-self:flex-end}.atm-main-msg-meta{display:flex;gap:7px;margin:0 3px 4px;color:var(--dsw-alias-label-secondary);font-size:9px}.atm-main-msg.is-user .atm-main-msg-meta{justify-content:flex-end}.atm-main-msg-author{font-weight:700;color:var(--dsw-alias-label-primary)}.atm-main-msg-body{padding:9px 11px;border:1px solid var(--dsw-alias-border-l1);border-radius:4px 11px 11px 11px;background:var(--dsw-alias-bg-layer-2);font-size:11px;line-height:1.55;overflow-wrap:anywhere}.atm-main-msg.is-user .atm-main-msg-body{border-color:var(--dsw-alias-brand-primary);border-radius:11px 4px 11px 11px}.atm-main-msg.is-system{max-width:100%}.atm-main-msg.is-system .atm-main-msg-body{border-style:dashed;color:var(--dsw-alias-label-secondary);font-size:10px}.atm-main-msg.is-system .atm-main-msg-author{color:var(--dsw-alias-state-warn-primary)}.atm-main-chat-state{display:grid;place-items:center;flex:1;min-height:140px;padding:20px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:11px}.atm-main-chat .atm-open-main{width:calc(100% - 24px);margin:10px 12px;flex:none}.atm-markdown{font-size:11px;line-height:1.55;overflow-wrap:anywhere}.atm-chat-bubble .atm-markdown,.atm-main-msg-body .atm-markdown{font-size:inherit;line-height:inherit}.atm-markdown p{margin:0 0 7px;white-space:pre-wrap}.atm-markdown p:last-child,.atm-markdown ul:last-child,.atm-markdown ol:last-child,.atm-markdown blockquote:last-child,.atm-markdown pre:last-child,.atm-markdown .atm-md-table-wrap:last-child{margin-bottom:0}.atm-markdown h3,.atm-markdown h4{margin:8px 0 6px;font-size:12px;line-height:1.35}.atm-markdown h3:first-child,.atm-markdown h4:first-child{margin-top:0}.atm-markdown ul,.atm-markdown ol{margin:0 0 7px;padding-left:19px}.atm-markdown li{margin:2px 0}.atm-markdown blockquote{margin:0 0 7px;padding:4px 0 4px 10px;border-left:2px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);white-space:pre-wrap}.atm-markdown code{padding:1px 4px;border-radius:4px;background:var(--dsw-alias-bg-base);font:10px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace}.atm-markdown .atm-md-pre{margin:0 0 7px;padding:9px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-base);overflow:auto;white-space:pre}.atm-markdown .atm-md-pre code{padding:0;background:transparent;font-size:10px}.atm-markdown a{color:var(--dsw-alias-brand-primary);text-decoration:underline;text-underline-offset:2px}.atm-md-table-wrap{margin:0 0 7px;overflow:auto}.atm-markdown table{width:100%;border-collapse:collapse;font-size:10px}.atm-markdown th,.atm-markdown td{padding:4px 6px;border:1px solid var(--dsw-alias-border-l1);text-align:left;vertical-align:top}.atm-markdown th{background:var(--dsw-alias-bg-base);font-weight:700}.atm-details{position:absolute;z-index:40;top:16px;right:16px;bottom:calc(var(--atm-stats-height,82px) + 16px);width:390px;max-width:calc(100% - 32px);display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--dsw-alias-border-l2);border-radius:18px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 26px 70px var(--dsw-alias-border-l2);transform:translateX(calc(100% + 30px));opacity:0;pointer-events:none;transition:transform .28s cubic-bezier(.2,.8,.2,1),opacity .22s}.atm-details.open{transform:translateX(0);opacity:1;pointer-events:auto}.atm-details.chat{width:480px}
      .atm-detail-head{position:sticky;top:0;z-index:2;display:flex;align-items:flex-start;gap:12px;padding:20px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}.atm-detail-head .atm-avatar{width:44px;height:44px}.atm-detail-close{margin-left:0}.atm-detail-actions{display:flex;align-items:center;gap:4px;margin-left:auto}.atm-icon-button:disabled{opacity:.35;cursor:not-allowed}.atm-detail-status{display:inline-flex;align-items:center;gap:6px;margin-top:6px;color:var(--dsw-alias-state-success-primary);font-size:11px}.atm-detail-status.inactive{color:var(--dsw-alias-state-idle-primary)}
      .atm-detail-tabs{display:flex;gap:5px;padding:10px 14px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}.atm-detail-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:8px 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);cursor:pointer}.atm-detail-tab.active{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
      .atm-detail-body{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:18px 20px 22px}.atm-detail-section{padding:15px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}.atm-detail-section:first-child{padding-top:0}.atm-detail-section:last-child{border:0}.atm-detail-label{margin-bottom:7px;color:var(--dsw-alias-label-secondary);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.atm-detail-text{color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}.atm-detail-message{padding:12px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);white-space:pre-wrap;overflow-wrap:anywhere}
      .atm-metrics{display:grid;grid-template-columns:1fr 1fr;gap:9px}.atm-metric{padding:12px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-2);min-width:0}.atm-metric-value{font-size:16px;font-weight:720;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.atm-metric-label{margin-top:3px;color:var(--dsw-alias-label-secondary);font-size:10px}.atm-session-id{font:11px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;overflow-wrap:anywhere;color:var(--dsw-alias-label-secondary)}
      .atm-open-main{width:calc(100% - 28px);margin:12px 14px 16px;display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 12px;border:1px solid var(--dsw-alias-brand-primary);border-radius:10px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);cursor:pointer;flex:none}.atm-detail-head,.atm-detail-tabs{flex:none}
      .atm-chat-panel{display:flex;flex:1;min-height:0;flex-direction:column;overflow:hidden}.atm-chat-log{display:flex;flex:1;min-height:0;flex-direction:column;gap:12px;padding:16px;overflow-x:hidden;overflow-y:auto;overflow-anchor:none;overscroll-behavior:contain;scrollbar-gutter:stable}.atm-chat-entry{display:flex;align-items:flex-start;gap:9px}.atm-chat-avatar{width:28px;height:28px;display:grid;place-items:center;flex:none;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}.atm-chat-avatar .atm-icon{width:14px;height:14px}.atm-chat-content{min-width:0;flex:1}.atm-chat-meta{display:flex;align-items:baseline;gap:5px;flex-wrap:wrap;color:var(--dsw-alias-label-secondary);font-size:9px}.atm-chat-author{color:var(--dsw-alias-label-primary);font-weight:650}.atm-chat-time{margin-left:auto;font-variant-numeric:tabular-nums}.atm-chat-bubble{margin-top:5px;padding:10px 11px;border:1px solid var(--dsw-alias-border-l1);border-radius:4px 12px 12px 12px;background:var(--dsw-alias-bg-layer-2);font-size:11px;line-height:1.55;overflow-wrap:anywhere}.atm-chat-entry.outgoing .atm-chat-bubble{border-radius:12px 4px 12px 12px;border-color:var(--dsw-alias-brand-primary)}
      .atm-chat-tool{margin-top:5px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-2)}.atm-chat-tool summary{display:flex;align-items:center;gap:6px;padding:9px;cursor:pointer;color:var(--dsw-alias-label-secondary)}.atm-chat-tool pre{max-height:340px;overflow:auto;margin:0;padding:10px;border-top:1px solid var(--dsw-alias-border-l1);white-space:pre-wrap;overflow-wrap:anywhere;font:10px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--dsw-alias-label-secondary)}
      .atm-state{display:grid;place-items:center;min-height:180px;padding:24px;text-align:center;color:var(--dsw-alias-label-secondary)}.atm-state strong{display:block;margin-bottom:6px;color:var(--dsw-alias-label-primary)}.atm-empty-canvas{position:absolute;z-index:15;inset:0;display:grid;place-items:center;pointer-events:none}.atm-empty-canvas>div{max-width:460px;padding:28px;border:1px solid var(--dsw-alias-border-l1);border-radius:18px;background:var(--dsw-alias-bg-layer-1);text-align:center;box-shadow:0 20px 60px var(--dsw-alias-border-l1)}
      .atm-stats{position:relative;z-index:60;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;min-height:82px;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}.atm-stat{display:flex;align-items:center;justify-content:center;gap:12px;padding:16px 22px;border-right:1px solid var(--dsw-alias-border-l1);min-width:0}.atm-stat:last-child{border:0}.atm-stat-icon{width:34px;height:34px;flex:none;display:grid;place-items:center;border-radius:10px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}.atm-stat-value{font-size:18px;font-weight:760;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.atm-stat-label{color:var(--dsw-alias-label-secondary);font-size:10px;letter-spacing:.06em;text-transform:uppercase}
      @keyframes atmLivePulse{50%{opacity:.42}}@keyframes atmEdgeFlow{to{stroke-dashoffset:-11}}
      @media(max-width:1180px){.atm-main-chat{display:none}}
      @media(max-width:760px){.atm-app{--atm-stats-height:70px}.atm-topbar{left:14px;top:14px}.atm-hint{display:none}.atm-controls{right:12px;top:12px}.atm-details{top:10px;right:10px;bottom:calc(var(--atm-stats-height,70px) + 10px);width:min(92vw,410px);max-width:92vw;border-radius:18px 0 0 18px}.atm-stats{min-height:70px}.atm-stat{gap:7px;padding:12px 8px}.atm-stat-icon{display:none}.atm-stat-value{font-size:15px}.atm-stat-label{font-size:9px}.atm-brand{font-size:13px}.atm-live-tag{display:none}}
      @media(prefers-reduced-motion:reduce){.atm-app *,.atm-app *:before,.atm-app *:after{animation:none!important;transition:none!important}.atm-card:hover{transform:none}.atm-pulse,.atm-pulse-core{display:none}}
    `;

    function installStyles() {
      if (typeof document === 'undefined') return;
      for (const stale of document.querySelectorAll('style[data-plugin-css]')) {
        if (stale.dataset.plugin === 'agent-team-monitor' || stale.dataset.pluginCss?.startsWith('agent-team-monitor/')) stale.remove();
      }
      const tag = document.createElement('style');
      tag.dataset.plugin = 'agent-team-monitor';
      tag.dataset.pluginCss = STYLE_ID;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }

    function icon(name, className = '') {
      return h('svg', {
        className: `atm-icon${className ? ` ${className}` : ''}`,
        viewBox: '0 0 24 24',
        'aria-hidden': true,
        dangerouslySetInnerHTML: { __html: ICON_PATHS[name] || ICON_PATHS.bot },
      });
    }

    function number(value) { return typeof value === 'number' && Number.isFinite(value) ? value : 0; }
    function validDate(value) {
      if (typeof value !== 'number' || !Number.isFinite(value)) return null;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    function formatNumber(value, locale) { return new Intl.NumberFormat(locale).format(number(value)); }
    function formatCompact(value, locale) { return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(number(value)); }
    function formatClock(value, locale) {
      const date = validDate(value);
      return date ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date) : '—';
    }
    function formatDuration(milliseconds, t) {
      const seconds = Math.max(0, Math.floor(number(milliseconds) / 1000));
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainder = seconds % 60;
      if (hours > 0) return t('durationHours', { hours, minutes });
      if (minutes > 0) return t('durationMinutes', { minutes, seconds: remainder });
      return t('durationSeconds', { seconds: remainder });
    }
    function formatAgo(value, now, t) {
      const seconds = Math.max(0, Math.floor((now - number(value)) / 1000));
      return seconds < 60 ? t('secondsAgo', { seconds }) : t('minutesAgo', { minutes: Math.floor(seconds / 60) });
    }
    function tokensOf(monitor) {
      const tokens = monitor?.tokens ?? {};
      return {
        input: number(tokens.input), output: number(tokens.output), total: number(tokens.total),
        unreportedTotal: number(tokens.unreportedTotal), cacheRead: number(tokens.cacheRead),
        cacheWrite: number(tokens.cacheWrite), reasoning: number(tokens.reasoning),
      };
    }
    function totalTokenDisplay(tokens, locale) {
      if (tokens.total === 0 && tokens.unreportedTotal > 0) return { kind: 'unknown', value: '—' };
      return { kind: tokens.unreportedTotal > 0 ? 'incomplete' : 'exact', value: `${formatCompact(tokens.total, locale)}${tokens.unreportedTotal > 0 ? ' +' : ''}` };
    }
    function activeMilliseconds(monitor, running, now) {
      const open = monitor?.openTurnStartedAt;
      const extra = running && typeof open === 'number' && Number.isFinite(open) ? Math.max(0, now - open) : 0;
      return number(monitor?.activeMs) + extra;
    }
    function statusOf(member, running) {
      if (member.phase === 'failed') return 'failed';
      if (member.phase === 'provisioning') return 'provisioning';
      return running ? 'running' : 'inactive';
    }
    function statusLabel(status, t) {
      if (status === 'running') return t('statusRunning');
      if (status === 'failed') return t('statusFailed');
      if (status === 'provisioning') return t('statusProvisioning');
      return t('statusInactive');
    }

    const MODEL_NAME_COLORS = { deepseek: '#4D9FFF', kimi: '#FF9F43', gpt: '#45C97A' };
    function modelBrand(provider, model) {
      const value = `${provider || ''} ${model || ''}`.toLowerCase();
      if (value.includes('kimi') || value.includes('moonshot') || /(^|[\s.-])k3(?:[.\s-]|$)/u.test(value)) return 'kimi';
      if (value.includes('gpt') || value.includes('openai') || /(^|[\s.-])o[1-9](?:[.\s-]|$)/u.test(value)) return 'gpt';
      if (value.includes('deepseek')) return 'deepseek';
      return null;
    }
    function modelNameColor(provider, model) {
      const brand = modelBrand(provider, model);
      return brand ? MODEL_NAME_COLORS[brand] : undefined;
    }

    const ROLE_NAME_CATALOG = {
      research: ['Atlas', 'Scout'], review: ['Sentinel', 'Audit'], code: ['Forge', 'Craft'], test: ['Probe', 'Verify'],
      architecture: ['Nova', 'Framework'], analysis: ['Sigma', 'Metric'], writing: ['Scribe', 'Manual'], infra: ['Relay', 'Deploy'], design: ['Pixel', 'Canvas'],
    };
    const ROLE_LABELS = {
      research: 'roleResearch', review: 'roleReview', code: 'roleCode', test: 'roleTest', architecture: 'roleArchitecture',
      analysis: 'roleAnalysis', writing: 'roleWriting', infra: 'roleInfra', design: 'roleDesign', generic: 'roleGeneric',
    };
    const ROLE_KEYWORDS = [
      ['architecture', ['architect', 'architecture', 'архитект']],
      ['research', ['research', 'researcher', 'scout', 'исслед', 'источник']],
      ['review', ['review', 'reviewer', 'audit', 'ревью', 'проверка решени']],
      ['code', ['coder', 'coding', 'developer', 'develop', 'разработ', 'программ', 'код']],
      ['test', ['test', 'tester', 'qa', 'тест', 'проверка сценар']],
      ['analysis', ['analys', 'analyst', 'metric', 'аналит', 'анализ', 'метрик']],
      ['writing', ['writer', 'writing', 'document', 'scribe', 'документ', 'текст', 'описани']],
      ['infra', ['infra', 'devops', 'deploy', 'relay', 'инфраструкт', 'развёрт', 'сборк']],
      ['design', ['design', 'designer', 'ux', 'ui', 'pixel', 'дизайн', 'визуал', 'интерфейс']],
    ];
    function roleKeyFor(member, description) {
      const text = `${member.name} ${description || ''}`.toLowerCase();
      const match = ROLE_KEYWORDS.find(([, keywords]) => keywords.some(keyword => text.includes(keyword)));
      return match?.[0] || 'generic';
    }
    function roleLabel(roleKey, t) { return t(ROLE_LABELS[roleKey] || ROLE_LABELS.generic); }
    function displayAliases(members, metadataById) {
      const used = new Set(['LEAD']);
      const aliases = new Map();
      for (const member of members) {
        if (member.role === 'lead') { aliases.set(member.id, 'LEAD'); continue; }
        const roleKey = roleKeyFor(member, metadataById.get(member.id)?.description);
        const candidates = ROLE_NAME_CATALOG[roleKey] || [];
        let base = candidates.find(name => !used.has(name)) || member.name;
        let display = base;
        let suffix = 2;
        while (used.has(display)) display = `${base}-${suffix++}`;
        used.add(display);
        aliases.set(member.id, display);
      }
      return aliases;
    }

    function mergeMembers(team, leadMonitor) {
      const roster = team?.members ?? EMPTY_LIST;
      const metadata = leadMonitor?.teamMembers ?? EMPTY_LIST;
      const metadataById = new Map(metadata.map(item => [item.id, item]));
      const order = new Map(metadata.map((item, index) => [item.id, index]));
      const members = roster.map((member, rosterIndex) => ({
        ...member,
        metadata: metadataById.get(member.id),
        sortCreated: metadataById.get(member.id)?.createdAt,
        rosterIndex,
        metadataIndex: order.get(member.id) ?? Number.MAX_SAFE_INTEGER,
      })).sort((a, b) => {
        const ac = a.sortCreated, bc = b.sortCreated;
        if (ac !== undefined && bc !== undefined && ac !== bc) return ac - bc;
        if (ac !== undefined && bc === undefined) return -1;
        if (ac === undefined && bc !== undefined) return 1;
        if (a.metadataIndex !== b.metadataIndex) return a.metadataIndex - b.metadataIndex;
        return a.rosterIndex - b.rosterIndex;
      });
      return { members, metadataById };
    }

    function collectMessages(members, projectionsBySession) {
      const messages = new Map();
      for (const member of members) {
        const monitor = projectionsBySession[member.id]?.values.agentTeamMonitor;
        for (const message of monitor?.messages ?? EMPTY_LIST) {
          const key = String(message.id);
          const previous = messages.get(key);
          if (!previous) messages.set(key, { ...message });
          else messages.set(key, { ...previous, senderName: previous.senderName || message.senderName, preview: previous.preview || message.preview });
        }
      }
      return [...messages.values()].sort((a, b) => number(a.time) - number(b.time) || String(a.id).localeCompare(String(b.id)));
    }
    function latestFor(memberId, messages) {
      for (let index = messages.length - 1; index >= 0; index--) {
        if (messages[index].senderId === memberId || messages[index].targetId === memberId) return messages[index];
      }
      return null;
    }

    function defaultCardSize(member) { return { width: member.role === 'lead' ? 264 : 246, height: 190 }; }
    function rectAt(position, size) {
      return { left: position.x - size.width / 2, right: position.x + size.width / 2, top: position.y - size.height / 2, bottom: position.y + size.height / 2 };
    }
    function cardsOverlap(a, b) {
      return a.left < b.right + CARD_GAP && a.right + CARD_GAP > b.left && a.top < b.bottom + CARD_GAP && a.bottom + CARD_GAP > b.top;
    }
    function collisionFree(rects) {
      for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) if (cardsOverlap(rects[i], rects[j])) return false;
      return true;
    }
    function ringAttempt(items, count, radius, offset, existing, sizes) {
      const positions = items.slice(0, count).map((member, index) => {
        const angle = offset + index * Math.PI * 2 / count;
        return { member, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
      });
      const rects = positions.map(item => rectAt(item, sizes.get(item.member.id) || defaultCardSize(item.member)));
      return collisionFree([...existing, ...rects]) ? { positions, rects } : null;
    }
    function bestRing(items, radius, existing, ringIndex, sizes) {
      for (let count = items.length; count > 0; count--) {
        const offsets = Array.from({ length: 24 }, (_, index) => -Math.PI / 2 + ringIndex * .13 + index * (Math.PI * 2 / count) / 24);
        for (const offset of offsets) {
          const attempt = ringAttempt(items, count, radius, offset, existing, sizes);
          if (attempt) return { ...attempt, count, radius };
        }
      }
      return null;
    }
    function planetaryLayout(members, sizes) {
      const lead = members.find(member => member.role === 'lead') || members[0];
      const positions = {};
      const rects = {};
      const rings = [];
      if (!lead) return { positions, rects, rings, signature: 'empty' };
      positions[lead.id] = { x: 0, y: 0, ring: 0 };
      rects[lead.id] = rectAt(positions[lead.id], sizes.get(lead.id) || defaultCardSize(lead));
      const existing = [rects[lead.id]];
      const ordered = members.filter(member => member.id !== lead.id);
      let cursor = 0, radius = 390, ringIndex = 0;
      while (cursor < ordered.length) {
        const ring = bestRing(ordered.slice(cursor), radius, existing, ringIndex, sizes);
        if (!ring) { radius += 40; continue; }
        for (const item of ring.positions) {
          positions[item.member.id] = { x: item.x, y: item.y, ring: ringIndex + 1 };
          rects[item.member.id] = rectAt(item, sizes.get(item.member.id) || defaultCardSize(item.member));
        }
        existing.push(...ring.rects);
        rings.push({ radius: ring.radius, count: ring.count });
        cursor += ring.count;
        radius = ring.radius + 280;
        ringIndex++;
      }
      const signature = members.map(member => {
        const p = positions[member.id], r = rects[member.id];
        return `${member.id}:${p.x.toFixed(1)},${p.y.toFixed(1)},${(r.right - r.left).toFixed(1)}x${(r.bottom - r.top).toFixed(1)}`;
      }).join('|') + `#${rings.map(ring => `${ring.radius}:${ring.count}`).join(',')}`;
      return { positions, rects, rings, signature };
    }

    function expandedRect(rect, margin = ROUTE_MARGIN) { return { left: rect.left - margin, right: rect.right + margin, top: rect.top - margin, bottom: rect.bottom + margin }; }
    function pointBlocked(point, obstacles) { return obstacles.some(rect => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom); }
    function segmentHitsRect(a, b, rect) {
      let min = 0, max = 1;
      for (const axis of ['x', 'y']) {
        const low = axis === 'x' ? rect.left : rect.top, high = axis === 'x' ? rect.right : rect.bottom, delta = b[axis] - a[axis];
        if (Math.abs(delta) < 1e-9) { if (a[axis] < low || a[axis] > high) return false; continue; }
        let first = (low - a[axis]) / delta, second = (high - a[axis]) / delta;
        if (first > second) [first, second] = [second, first];
        min = Math.max(min, first); max = Math.min(max, second);
        if (min > max) return false;
      }
      return true;
    }
    function segmentClear(a, b, obstacles) { return obstacles.every(rect => !segmentHitsRect(a, b, rect)); }
    function routingObstacles(layout, excluded) {
      return Object.keys(layout.rects).filter(id => !excluded.includes(id)).map(id => expandedRect(layout.rects[id]));
    }
    function connectionPoint(layout, from, to, reverse, obstacles) {
      const p = layout.positions[from], q = layout.positions[to], rect = layout.rects[from];
      const dx = q.x - p.x, dy = q.y - p.y;
      const hw = (rect.right - rect.left) / 2 + 12, hh = (rect.bottom - rect.top) / 2 + 12;
      const scale = Math.min(hw / Math.max(1, Math.abs(dx)), hh / Math.max(1, Math.abs(dy)));
      const length = Math.max(1, Math.hypot(dx, dy));
      for (const offset of reverse ? [18, 0, -18] : [0]) {
        const point = { x: p.x + dx * scale - dy / length * offset, y: p.y + dy * scale + dx / length * offset };
        if (!pointBlocked(point, obstacles)) return point;
      }
      return { x: p.x + dx * scale, y: p.y + dy * scale };
    }
    function nearestRoutable(anchor, obstacles, bounds) {
      const gx = Math.round(anchor.x / ROUTE_CELL), gy = Math.round(anchor.y / ROUTE_CELL), candidates = [];
      for (let radius = 0; radius <= 6; radius++) for (let dx = -radius; dx <= radius; dx++) for (let dy = -radius; dy <= radius; dy++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
        const cell = { x: gx + dx, y: gy + dy }, point = { x: cell.x * ROUTE_CELL, y: cell.y * ROUTE_CELL };
        if (cell.x < bounds.minX || cell.x > bounds.maxX || cell.y < bounds.minY || cell.y > bounds.maxY || pointBlocked(point, obstacles) || !segmentClear(anchor, point, obstacles)) continue;
        candidates.push({ cell, point, score: Math.hypot(point.x - anchor.x, point.y - anchor.y) });
      }
      candidates.sort((a, b) => a.score - b.score);
      return candidates[0] || null;
    }
    function gridPath(start, goal, obstacles, bounds) {
      const key = cell => `${cell.x},${cell.y}`;
      const open = [start.cell], openKeys = new Set([key(start.cell)]), came = new Map(), cost = new Map([[key(start.cell), 0]]), score = new Map([[key(start.cell), Math.abs(start.cell.x - goal.cell.x) + Math.abs(start.cell.y - goal.cell.y)]]), closed = new Set();
      let iterations = 0;
      while (open.length && iterations++ < 12000) {
        let best = 0;
        for (let i = 1; i < open.length; i++) if ((score.get(key(open[i])) ?? Infinity) < (score.get(key(open[best])) ?? Infinity)) best = i;
        const current = open.splice(best, 1)[0], currentKey = key(current);
        openKeys.delete(currentKey);
        if (current.x === goal.cell.x && current.y === goal.cell.y) {
          const cells = [current];
          let walker = currentKey;
          while (came.has(walker)) { const previous = came.get(walker); cells.push(previous); walker = key(previous); }
          cells.reverse();
          return [start.point, ...cells.slice(1).map(cell => ({ x: cell.x * ROUTE_CELL, y: cell.y * ROUTE_CELL })), goal.point];
        }
        closed.add(currentKey);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const next = { x: current.x + dx, y: current.y + dy }, nextKey = key(next), point = { x: next.x * ROUTE_CELL, y: next.y * ROUTE_CELL };
          if (next.x < bounds.minX || next.x > bounds.maxX || next.y < bounds.minY || next.y > bounds.maxY || closed.has(nextKey) || pointBlocked(point, obstacles)) continue;
          const nextCost = (cost.get(currentKey) ?? Infinity) + 1;
          if (nextCost >= (cost.get(nextKey) ?? Infinity)) continue;
          came.set(nextKey, current); cost.set(nextKey, nextCost); score.set(nextKey, nextCost + Math.abs(next.x - goal.cell.x) + Math.abs(next.y - goal.cell.y));
          if (!openKeys.has(nextKey)) { open.push(next); openKeys.add(nextKey); }
        }
      }
      return null;
    }
    function simplifyRoute(points) {
      const result = [];
      for (const point of points) {
        const previous = result[result.length - 1];
        if (!previous || Math.hypot(point.x - previous.x, point.y - previous.y) > 1) result.push(point);
      }
      if (result.length < 3) return result;
      const simplified = [result[0]];
      for (let i = 1; i < result.length - 1; i++) {
        const a = simplified[simplified.length - 1], b = result[i], c = result[i + 1];
        const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
        if (Math.abs(cross) > 1e-6) simplified.push(b);
      }
      simplified.push(result[result.length - 1]);
      return simplified;
    }
    function routeAroundCards(layout, start, end, obstacles) {
      if (segmentClear(start, end, obstacles)) return [start, end];
      const allRects = Object.values(layout.rects);
      for (let padding = 240; padding <= 720; padding += 160) {
        const bounds = {
          minX: Math.floor((Math.min(...allRects.map(r => r.left)) - padding) / ROUTE_CELL),
          maxX: Math.ceil((Math.max(...allRects.map(r => r.right)) + padding) / ROUTE_CELL),
          minY: Math.floor((Math.min(...allRects.map(r => r.top)) - padding) / ROUTE_CELL),
          maxY: Math.ceil((Math.max(...allRects.map(r => r.bottom)) + padding) / ROUTE_CELL),
        };
        const first = nearestRoutable(start, obstacles, bounds), last = nearestRoutable(end, obstacles, bounds);
        if (!first || !last) continue;
        const route = gridPath(first, last, obstacles, bounds);
        if (route) {
          const points = simplifyRoute([start, ...route, end]);
          if (points.every((point, index) => index === 0 || segmentClear(points[index - 1], point, obstacles))) return points;
        }
      }
      return null;
    }
    function roundedRoute(points) {
      if (points.length < 3) return `M${points[0].x},${points[0].y} L${points[points.length - 1].x},${points[points.length - 1].y}`;
      let d = `M${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length - 1; i++) {
        const previous = points[i - 1], current = points[i], next = points[i + 1];
        const beforeLength = Math.hypot(current.x - previous.x, current.y - previous.y), afterLength = Math.hypot(next.x - current.x, next.y - current.y);
        const radius = Math.min(16, beforeLength / 3, afterLength / 3);
        const before = { x: current.x + (previous.x - current.x) / beforeLength * radius, y: current.y + (previous.y - current.y) / beforeLength * radius };
        const after = { x: current.x + (next.x - current.x) / afterLength * radius, y: current.y + (next.y - current.y) / afterLength * radius };
        d += ` L${before.x},${before.y} Q${current.x},${current.y} ${after.x},${after.y}`;
      }
      return d + ` L${points[points.length - 1].x},${points[points.length - 1].y}`;
    }
    function routeLabel(points) {
      let total = 0;
      for (let i = 1; i < points.length; i++) total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
      let remaining = total / 2;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i], length = Math.hypot(b.x - a.x, b.y - a.y);
        if (remaining <= length) {
          const ratio = length ? remaining / length : 0;
          return { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio };
        }
        remaining -= length;
      }
      return points[points.length - 1];
    }
    function geometry(layout, from, to, reverse) {
      const cacheKey = `${layout.signature}:${from}:${to}:${reverse}`;
      if (routeCache.has(cacheKey)) return routeCache.get(cacheKey);
      const obstacles = routingObstacles(layout, [from, to]);
      const start = connectionPoint(layout, from, to, reverse, obstacles);
      const end = connectionPoint(layout, to, from, reverse, obstacles);
      let points = routeAroundCards(layout, start, end, obstacles);
      if (!points) points = [start, end];
      const label = routeLabel(points);
      const route = { d: roundedRoute(points), x: label.x, y: label.y, points };
      routeCache.set(cacheKey, route);
      if (routeCache.size > 1200) routeCache.delete(routeCache.keys().next().value);
      return route;
    }

    function useReducedMotion() {
      const [reduced, setReduced] = React.useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
      React.useEffect(() => {
        if (typeof matchMedia === 'undefined') return;
        const media = matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(media.matches);
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
      }, []);
      return reduced;
    }

    const CanvasEdges = React.memo(function CanvasEdges({ members, leadId, layout, messages, now, reducedMotion, locale }) {
      const pairs = React.useMemo(() => {
        const result = new Map();
        for (const message of messages) {
          if (!layout.positions[message.senderId] || !layout.positions[message.targetId]) continue;
          const key = `${message.senderId}>${message.targetId}`;
          if (!result.has(key)) result.set(key, []);
          result.get(key).push(message);
        }
        return [...result.entries()].map(([key, list]) => {
          const [from, to] = key.split('>');
          return { from, to, list, reverse: result.has(`${to}>${from}`), latest: list[list.length - 1] };
        });
      }, [messages, layout.signature]);
      const structural = members.filter(member => member.id !== leadId && layout.positions[member.id]);
      return h('svg', { className: 'atm-edges', 'aria-hidden': true },
        h('defs', null,
          h('marker', { id: 'atm-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' },
            h('path', { d: 'M0 0 10 5 0 10Z', fill: 'var(--dsw-alias-brand-primary)' }))),
        layout.rings.map((ring, index) => h('circle', { key: `orbit-${index}`, className: 'atm-orbit', cx: 0, cy: 0, r: ring.radius, fill: 'none' })),
        structural.map(member => {
          const route = geometry(layout, leadId, member.id, false);
          return h('path', { key: `structural-${member.id}`, className: 'atm-edge-structural', d: route.d, fill: 'none' });
        }),
        pairs.map(pair => {
          const route = geometry(layout, pair.from, pair.to, pair.reverse);
          const active = now - number(pair.latest.time) >= 0 && now - number(pair.latest.time) <= RECENT_MESSAGE_MS;
          return h('g', { key: `${pair.from}-${pair.to}` },
            h('path', { className: 'atm-edge-base', d: route.d, markerEnd: 'url(#atm-arrow)', fill: 'none' }),
            h('title', null, pair.latest.preview || `${pair.from} → ${pair.to}`),
            active ? h('path', { className: 'atm-edge-flow', d: route.d, fill: 'none' }) : null,
            active && !reducedMotion ? h(React.Fragment, null,
              h('circle', { className: 'atm-pulse', r: 5 }, h('animateMotion', { dur: '2.2s', repeatCount: 'indefinite', path: route.d })),
              h('circle', { className: 'atm-pulse-core', r: 2 }, h('animateMotion', { dur: '2.2s', repeatCount: 'indefinite', path: route.d }))) : null,
            h('text', { className: 'atm-edge-count', x: route.x, y: route.y - 10 }, formatCompact(pair.list.length, locale)));
        }));
    });

    function AgentCard({ member, position, alias, roleKey, purpose, task, last, status, selected, onSelect, now, model, reasoning, nameColor, t }) {
      const active = status === 'running';
      return h('div', { className: 'atm-node-position', style: { left: position.x, top: position.y }, 'data-node-id': member.id },
        h('button', {
          className: `atm-card${member.role === 'lead' ? ' lead' : ''}${active ? '' : ' inactive'}${selected ? ' selected' : ''}`,
          'data-card-id': member.id,
          'aria-pressed': selected,
          'aria-label': `${alias} · ${statusLabel(status, t)}`,
          onClick: onSelect,
        },
          h('span', { className: 'atm-card-head' },
            h('span', { className: 'atm-avatar' }, icon(member.role === 'lead' ? 'crown' : 'bot')),
            h('span', null,
              h('span', { className: 'atm-agent-name', style: nameColor ? { color: nameColor } : undefined }, alias),
              h('span', { className: 'atm-agent-role' }, `${member.role === 'lead' ? t('roleLead') : roleLabel(roleKey, t)}${position.ring ? ` · ${t('orbit', { ring: position.ring })}` : ''}`)),
            h('i', { className: `atm-status-dot ${status === 'running' ? 'active' : status}` })),
          h('span', { className: 'atm-purpose', title: purpose }, purpose),
          h('span', { className: 'atm-card-model', title: `${model || t('modelUnknown')}${reasoning ? ` · ${t('reasoningLevel')}: ${reasoning}` : ''}` },
            icon('cpu'),
            h('span', { className: 'atm-card-model-name' }, model || t('modelUnknown')),
            reasoning ? h('span', { className: 'atm-card-reasoning' }, reasoning) : null),
          h('span', { className: 'atm-task', title: task?.subject || t('noTask') }, icon('clipboard'), h('span', null, task?.subject || t('noTask'))),
          h('span', { className: 'atm-last' }, icon('message'),
            h('span', { className: 'atm-last-text' }, last?.preview || t('noMessage')),
            last ? h('small', { className: 'atm-last-time' }, formatAgo(last.time, now, t)) : null)));
    }

    function TeamCanvas({ members, leadId, aliases, roles, tasks, messages, projectionsBySession, runningById, selectedId, onSelect, now, sessionId, sessions, nameColors, t, locale }) {
      const viewportRef = React.useRef(null), worldRef = React.useRef(null), zoomTextRef = React.useRef(null);
      const cardRefs = React.useRef(new Map());
      const [sizes, setSizes] = React.useState(() => new Map());
      const viewRef = React.useRef({ x: 0, y: 0, k: 1 });
      const userMovedRef = React.useRef(false);
      const reducedMotion = useReducedMotion();

      const applyView = React.useCallback(() => {
        const view = viewRef.current;
        if (worldRef.current) worldRef.current.style.transform = `translate(${view.x}px,${view.y}px) scale(${view.k})`;
        if (viewportRef.current) {
          viewportRef.current.style.backgroundSize = `${28 * view.k}px ${28 * view.k}px`;
          viewportRef.current.style.backgroundPosition = `${view.x}px ${view.y}px`;
        }
        if (zoomTextRef.current) zoomTextRef.current.textContent = `${Math.round(view.k * 100)}%`;
      }, []);

      const fit = React.useCallback(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const rect = viewport.getBoundingClientRect();
        const points = members.map(member => {
          const p = layout.positions[member.id], size = sizes.get(member.id) || defaultCardSize(member);
          return p ? { x: Math.abs(p.x) + size.width / 2 + 38, y: Math.abs(p.y) + size.height / 2 + 38 } : null;
        }).filter(Boolean);
        const extentX = Math.max(300, ...points.map(point => point.x));
        const extentY = Math.max(230, ...points.map(point => point.y));
        const panelSpace = rect.width >= 1180 ? 376 : 0;
        const availableWidth = Math.max(320, rect.width - panelSpace);
        const k = Math.max(.25, Math.min(1.08, (availableWidth / 2 - 36) / extentX, (rect.height / 2 - 36) / extentY));
        viewRef.current = { x: panelSpace + availableWidth / 2, y: rect.height / 2, k };
        applyView();
      }, [members, sizes, applyView]);

      const layout = React.useMemo(() => planetaryLayout(members, sizes), [members, sizes]);

      React.useLayoutEffect(() => {
        const valid = new Set(members.map(member => member.id));
        for (const id of cardRefs.current.keys()) if (!valid.has(id)) cardRefs.current.delete(id);
        cardRefs.current.clear();
        for (const member of members) {
          const element = [...(viewportRef.current?.querySelectorAll('[data-card-id]') || [])].find(candidate => candidate.dataset.cardId === member.id);
          if (element) cardRefs.current.set(member.id, element);
        }
        const measure = () => {
          setSizes(previous => {
            let changed = false;
            const next = new Map(previous);
            for (const member of members) {
              const element = cardRefs.current.get(member.id);
              if (!element) continue;
              const width = element.offsetWidth, height = element.offsetHeight;
              const old = next.get(member.id);
              if (width && height && (!old || Math.abs(old.width - width) > 1 || Math.abs(old.height - height) > 1)) {
                next.set(member.id, { width, height });
                changed = true;
              }
            }
            return changed ? next : previous;
          });
        };
        measure();
        if (typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(measure);
        for (const element of cardRefs.current.values()) observer.observe(element);
        return () => observer.disconnect();
      }, [members]);

      React.useLayoutEffect(() => {
        if (!userMovedRef.current) fit();
        else applyView();
      }, [layout.signature, fit, applyView]);

      React.useEffect(() => {
        const resize = () => { if (!userMovedRef.current) fit(); };
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
      }, [fit]);

      const zoomAt = React.useCallback((px, py, factor) => {
        const old = viewRef.current;
        const k = Math.max(.35, Math.min(2.4, old.k * factor));
        const wx = (px - old.x) / old.k, wy = (py - old.y) / old.k;
        viewRef.current = { x: px - wx * k, y: py - wy * k, k };
        userMovedRef.current = true;
        applyView();
      }, [applyView]);

      React.useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const wheel = event => {
          if (event.target.closest('.atm-main-chat,.atm-details,.atm-controls,.atm-topbar')) return;
          event.preventDefault();
          const rect = viewport.getBoundingClientRect();
          zoomAt(event.clientX - rect.left, event.clientY - rect.top, Math.exp(-event.deltaY * .001));
        };
        viewport.addEventListener('wheel', wheel, { passive: false });
        return () => viewport.removeEventListener('wheel', wheel);
      }, [zoomAt]);

      React.useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        let drag = null;
        const down = event => {
          if (event.button !== 0 || event.target.closest('button,.atm-details,.atm-controls,.atm-topbar')) return;
          drag = { x: event.clientX, y: event.clientY, vx: viewRef.current.x, vy: viewRef.current.y };
          viewport.setPointerCapture(event.pointerId);
          viewport.classList.add('dragging');
        };
        const move = event => {
          if (!drag) return;
          viewRef.current.x = drag.vx + event.clientX - drag.x;
          viewRef.current.y = drag.vy + event.clientY - drag.y;
          userMovedRef.current = true;
          applyView();
        };
        const up = () => { drag = null; viewport.classList.remove('dragging'); };
        viewport.addEventListener('pointerdown', down);
        viewport.addEventListener('pointermove', move);
        viewport.addEventListener('pointerup', up);
        viewport.addEventListener('pointercancel', up);
        return () => {
          viewport.removeEventListener('pointerdown', down);
          viewport.removeEventListener('pointermove', move);
          viewport.removeEventListener('pointerup', up);
          viewport.removeEventListener('pointercancel', up);
        };
      }, [applyView]);

      const centerZoom = factor => {
        const rect = viewportRef.current.getBoundingClientRect();
        zoomAt(rect.width / 2, rect.height / 2, factor);
      };

      return h('div', { className: 'atm-stage' },
        h('div', { className: 'atm-viewport', ref: viewportRef, 'aria-label': t('canvasHint') },
          h('div', { className: 'atm-world', ref: worldRef },
            h(CanvasEdges, { members, leadId, layout, messages, now, reducedMotion, locale }),
            h('div', { className: 'atm-nodes' }, members.map(member => {
              const monitor = projectionsBySession[member.id]?.values.agentTeamMonitor;
              const metadata = member.metadata;
              const task = tasks.find(candidate => candidate.status === 'in_progress' && candidate.ownerName === member.name);
              const selection = projectionsBySession[member.id]?.values.modelSelection?.next;
              const request = monitor?.requestConfig;
              return h(AgentCard, {
                key: member.id,
                member,
                position: layout.positions[member.id],
                alias: aliases.get(member.id) || member.name,
                roleKey: roles.get(member.id) || 'generic',
                purpose: metadata?.description || task?.description || t('noActivity'),
                task,
                last: latestFor(member.id, messages),
                status: statusOf(member, runningById[member.id] === true),
                selected: selectedId === member.id,
                onSelect: () => onSelect(member.id),
                now,
                model: request?.model || selection?.model,
                reasoning: request?.reasoningEffort || selection?.reasoningEffort,
                nameColor: nameColors.get(member.id),
                t,
              });
            }))),
          h('div', { className: 'atm-topbar' },
            h('div', { className: 'atm-brand' }, h('span', { className: 'atm-brand-mark' }, icon('users')), t('title')),
            h('span', { className: `atm-live-tag${Object.values(runningById).some(Boolean) ? '' : ' idle'}` },
              h('i', { className: 'atm-live-dot' }), Object.values(runningById).some(Boolean) ? t('live') : t('idle')),
            h('span', { className: 'atm-hint' }, t('canvasHint'))),
          h('div', { className: 'atm-controls', 'aria-label': t('fit') },
            h('button', { className: 'atm-icon-button', title: t('zoomOut'), 'aria-label': t('zoomOut'), onClick: () => centerZoom(1 / 1.2) }, icon('minus')),
            h('span', { className: 'atm-zoom-value', ref: zoomTextRef }, '100%'),
            h('button', { className: 'atm-icon-button', title: t('zoomIn'), 'aria-label': t('zoomIn'), onClick: () => centerZoom(1.2) }, icon('plus')),
            h('span', { className: 'atm-separator' }),
            h('button', { className: 'atm-icon-button', title: t('fit'), 'aria-label': t('fit'), onClick: () => { userMovedRef.current = false; fit(); } }, icon('maximize'))),
          h(MainChatPanel, { sessionId, sessions, aliases, nameColors, t, locale }),
          h('div', { className: 'atm-details-host' })));
    }

    function Metric({ value, label }) {
      return h('div', { className: 'atm-metric' }, h('div', { className: 'atm-metric-value' }, value), h('div', { className: 'atm-metric-label' }, label));
    }
    function DetailSection({ label, children }) {
      return h('section', { className: 'atm-detail-section' }, h('div', { className: 'atm-detail-label' }, label), children);
    }

    function textFromContent(content) {
      if (typeof content === 'string') return content;
      if (!Array.isArray(content)) return '';
      return content.map(block => {
        if (typeof block === 'string') return block;
        if (block?.type === 'text') return block.text || '';
        if (block?.type === 'image') return '[image]';
        if (block?.type === 'file') return `[file: ${block.name || 'attachment'}]`;
        return '';
      }).filter(Boolean).join('\n');
    }
    function peerText(content) {
      return textFromContent(content).replace(/^Team message from .+?:\s*/u, '').trim();
    }
    function parseChatEntries(entries, agentId, aliases, t) {
      const result = [];
      let lastPeerSender = null;
      for (const entry of entries) {
        if (entry.type !== 'event') continue;
        const event = entry.event;
        if (!event) continue;
        const data = event.data || {};
        const time = number(event.time);
        if (event.type === 'turn/start') {
          lastPeerSender = null;
          continue;
        }
        if (event.type === 'user/message') {
          const source = data.source || {};
          if (source.kind !== 'agent-message' || typeof source.senderSessionId !== 'string') {
            lastPeerSender = null;
            continue;
          }
          lastPeerSender = source.senderSessionId;
          const text = peerText(data.content);
          if (text) result.push({
            id: `event-${event.seq}`, kind: 'message', senderId: source.senderSessionId, recipientId: agentId,
            direction: 'incoming', time, text,
          });
          continue;
        }
        if (event.type === 'assistant/message') {
          if (!lastPeerSender) continue;
          const text = textFromContent(data.message?.content).trim();
          if (!text) continue;
          result.push({
            id: `event-${event.seq}`, kind: 'message', senderId: agentId, recipientId: lastPeerSender,
            direction: 'outgoing', time, text,
          });
        }
      }
      return result.map(item => ({
        ...item,
        sender: item.senderId === agentId ? aliases.get(agentId) || agentId : aliases.get(item.senderId) || item.senderId,
        recipient: item.recipientId === agentId ? aliases.get(agentId) || agentId : aliases.get(item.recipientId) || item.recipientId,
      }));
    }

    function parseInlineMarkdown(text) {
      const tokens = [], pattern = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|\[[^\]]+\]\((https?:\/\/[^)\s]+)\))/g;
      let last = 0, match;
      while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) tokens.push(text.slice(last, match.index));
        const raw = match[0];
        if (raw.startsWith('**') || raw.startsWith('__')) tokens.push({ type: 'strong', children: parseInlineMarkdown(raw.slice(2, -2)) });
        else if (raw.startsWith('`')) tokens.push({ type: 'code', text: raw.slice(1, -1) });
        else if (raw.startsWith('[')) {
          const link = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/.exec(raw);
          if (link) tokens.push({ type: 'link', href: link[2], children: parseInlineMarkdown(link[1]) });
          else tokens.push(raw);
        } else tokens.push({ type: 'em', children: parseInlineMarkdown(raw.slice(1, -1)) });
        last = match.index + raw.length;
      }
      if (last < text.length) tokens.push(text.slice(last));
      return tokens;
    }
    function splitTableRow(line) {
      return line.trim().replace(/^\|/u, '').replace(/\|$/u, '').split('|').map(cell => cell.trim());
    }
    function parseMarkdown(text) {
      const lines = String(text || '').replace(/\r\n?/gu, '\n').split('\n'), blocks = [];
      let index = 0;
      while (index < lines.length) {
        const line = lines[index];
        if (!line.trim()) { index++; continue; }
        const fence = /^```\s*([^\s]*)\s*$/u.exec(line);
        if (fence) {
          const code = []; index++;
          while (index < lines.length && !/^```\s*$/u.test(lines[index])) code.push(lines[index++]);
          if (index < lines.length) index++;
          blocks.push({ type: 'code', lang: fence[1], text: code.join('\n') });
          continue;
        }
        const heading = /^(#{1,3})\s+(.+)$/u.exec(line);
        if (heading) { blocks.push({ type: 'heading', level: heading[1].length, children: parseInlineMarkdown(heading[2]) }); index++; continue; }
        if (/^>\s?/u.test(line)) {
          const quote = [];
          while (index < lines.length && /^>\s?/u.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/u, ''));
          blocks.push({ type: 'quote', children: parseInlineMarkdown(quote.join('\n')) });
          continue;
        }
        if (/^\s*[-*+]\s+/u.test(line) || /^\s*\d+[.)]\s+/u.test(line)) {
          const ordered = /^\s*\d+[.)]\s+/u.test(line), items = [];
          while (index < lines.length) {
            const item = ordered ? /^\s*\d+[.)]\s+(.+)$/u.exec(lines[index]) : /^\s*[-*+]\s+(.+)$/u.exec(lines[index]);
            if (!item) break;
            items.push(parseInlineMarkdown(item[1])); index++;
          }
          blocks.push({ type: 'list', ordered, items });
          continue;
        }
        if (line.includes('|') && index + 1 < lines.length && splitTableRow(lines[index + 1]).every(cell => /^:?-{3,}:?$/u.test(cell))) {
          const header = splitTableRow(line).map(parseInlineMarkdown), rows = [];
          index += 2;
          while (index < lines.length && lines[index].includes('|') && lines[index].trim()) rows.push(splitTableRow(lines[index++]).map(parseInlineMarkdown));
          blocks.push({ type: 'table', header, rows });
          continue;
        }
        const paragraph = [line]; index++;
        while (index < lines.length && lines[index].trim() && !/^```|^#{1,3}\s|^>\s?|^\s*[-*+]\s+|^\s*\d+[.)]\s+/u.test(lines[index])) paragraph.push(lines[index++]);
        blocks.push({ type: 'paragraph', children: parseInlineMarkdown(paragraph.join('\n')) });
      }
      return blocks;
    }
    function renderInlineMarkdown(tokens) {
      return tokens.map((token, index) => {
        if (typeof token === 'string') return token;
        if (token.type === 'strong') return h('strong', { key: index }, renderInlineMarkdown(token.children));
        if (token.type === 'em') return h('em', { key: index }, renderInlineMarkdown(token.children));
        if (token.type === 'code') return h('code', { key: index }, token.text);
        if (token.type === 'link') return h('a', { key: index, href: token.href, target: '_blank', rel: 'noreferrer' }, renderInlineMarkdown(token.children));
        return null;
      });
    }
    function renderMarkdown(text) {
      return parseMarkdown(text).map((block, index) => {
        if (block.type === 'code') return h('pre', { key: index, className: 'atm-md-pre' }, h('code', null, block.text));
        if (block.type === 'heading') return h(`h${Math.min(4, block.level + 2)}`, { key: index }, renderInlineMarkdown(block.children));
        if (block.type === 'quote') return h('blockquote', { key: index }, renderInlineMarkdown(block.children));
        if (block.type === 'list') return h(block.ordered ? 'ol' : 'ul', { key: index }, block.items.map((item, itemIndex) => h('li', { key: itemIndex }, renderInlineMarkdown(item))));
        if (block.type === 'table') return h('div', { key: index, className: 'atm-md-table-wrap' },
          h('table', null,
            h('thead', null, h('tr', null, block.header.map((cell, cellIndex) => h('th', { key: cellIndex }, renderInlineMarkdown(cell))))),
            h('tbody', null, block.rows.map((row, rowIndex) => h('tr', { key: rowIndex }, row.map((cell, cellIndex) => h('td', { key: cellIndex }, renderInlineMarkdown(cell))))))));
        return h('p', { key: index }, renderInlineMarkdown(block.children));
      });
    }

    function parseMainChat(entries, aliases, t) {
      const result = [];
      for (const entry of entries) {
        if (entry.type !== 'event') continue;
        const event = entry.event;
        if (!event) continue;
        const data = event.data || {};
        if (event.type === 'user/message') {
          const source = data.source || {};
          const peer = source.kind === 'agent-message' && typeof source.senderSessionId === 'string';
          const system = !peer && source.kind !== 'user';
          const text = peer ? peerText(data.content) : textFromContent(data.content).trim();
          if (!text) continue;
          result.push({
            id: `main-user-${event.seq}`,
            sender: peer ? aliases.get(source.senderSessionId) || source.senderName || source.senderSessionId : system ? t(source.kind === 'subagent-settled' ? 'subagentNotice' : 'systemNotice') : t('user'),
            senderId: peer ? source.senderSessionId : undefined,
            isUser: !peer && !system, isSystem: system, time: number(event.time), text,
          });
          continue;
        }
        if (event.type === 'assistant/message') {
          const text = textFromContent(data.message?.content).trim();
          if (!text) continue;
          result.push({ id: `main-assistant-${event.seq}`, sender: t('assistant'), isUser: false, time: number(event.time), text });
        }
      }
      return result;
    }

    function MainChatPanel({ sessionId, sessions, aliases, nameColors, t, locale }) {
      const [state, setState] = React.useState({ status: 'loading', entries: [], hasMore: false, error: null });
      const [older, setOlder] = React.useState(false);
      const [limit, setLimit] = React.useState(120);
      const bindingRef = React.useRef(null), logRef = React.useRef(null), atBottomRef = React.useRef(true), panelRef = React.useRef(null);
      React.useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const stopWheel = event => event.stopPropagation();
        panel.addEventListener('wheel', stopWheel, { passive: true });
        return () => panel.removeEventListener('wheel', stopWheel);
      }, []);

      React.useEffect(() => {
        let cancelled = false, ref, unsubscribe;
        setState({ status: 'loading', entries: [], hasMore: false, error: null });
        setOlder(false);
        setLimit(120);
        atBottomRef.current = true;
        const open = async () => {
          try {
            ref = sessions.retain(sessionId, { source: 'gateway' });
            const binding = await ref.ready;
            if (cancelled) return;
            bindingRef.current = binding;
            const update = () => {
              if (cancelled) return;
              const snapshot = binding.eventSource.getSnapshot();
              setState({ status: 'ready', entries: snapshot.entries || [], hasMore: !!snapshot.hasMore, error: null });
            };
            unsubscribe = binding.eventSource.subscribe(update);
            update();
            const sessionSnapshot = binding.session.getSnapshot();
            if (sessionSnapshot.openState === 'error') setState({ status: 'error', entries: [], hasMore: false, error: sessionSnapshot.openError || t('chatError') });
          } catch (error) {
            if (!cancelled) setState({ status: 'error', entries: [], hasMore: false, error: String(error) });
          }
        };
        open();
        return () => {
          cancelled = true;
          if (unsubscribe) unsubscribe();
          if (ref) ref.release();
          bindingRef.current = null;
        };
      }, [sessionId, sessions]);

      React.useEffect(() => {
        const log = logRef.current;
        if (log && atBottomRef.current) log.scrollTop = log.scrollHeight;
      }, [state.entries]);

      const loadOlder = async () => {
        const binding = bindingRef.current;
        if (!binding || older) return;
        setOlder(true);
        try {
          const log = logRef.current;
          const previousHeight = log?.scrollHeight || 0;
          await binding.session.loadOlder();
          setLimit(value => value + 120);
          requestAnimationFrame(() => { if (log) log.scrollTop += log.scrollHeight - previousHeight; });
        } catch (error) {
          setState(previous => ({ ...previous, error: String(error) }));
        } finally {
          setOlder(false);
        }
      };

      let body;
      if (state.status === 'loading') body = h('div', { className: 'atm-main-chat-state' }, t('mainChatLoading'));
      else if (state.status === 'error') body = h('div', { className: 'atm-main-chat-state', role: 'alert' }, state.error);
      else {
        const items = parseMainChat(state.entries, aliases, t).slice(-limit);
        body = items.length === 0
          ? h('div', { className: 'atm-main-chat-state' }, t('mainChatEmpty'))
          : h('div', {
              className: 'atm-main-chat-log', ref: logRef,
              onScroll: event => { const node = event.currentTarget; atBottomRef.current = node.scrollHeight - node.scrollTop - node.clientHeight < 60; },
            }, items.map(item => h('article', { key: item.id, className: `atm-main-msg${item.isUser ? ' is-user' : ''}${item.isSystem ? ' is-system' : ''}` },
              h('div', { className: 'atm-main-msg-meta' },
                h('span', { className: 'atm-main-msg-author', style: item.senderId && nameColors.get(item.senderId) ? { color: nameColors.get(item.senderId) } : undefined }, item.sender),
                h('time', null, formatClock(item.time, locale))),
              h('div', { className: 'atm-main-msg-body' }, h('div', { className: 'atm-markdown' }, renderMarkdown(item.text))))));
      }
      return h('aside', { className: 'atm-main-chat', ref: panelRef, 'aria-label': t('mainChatTitle') },
        h('div', { className: 'atm-main-chat-head' },
          h('span', { className: 'atm-brand-mark' }, icon('message')),
          h('div', null, h('div', { className: 'atm-main-chat-title' }, t('mainChatTitle')), h('div', { className: 'atm-main-chat-subtitle' }, t('mainChatHint'))),
          state.hasMore && state.status === 'ready'
            ? h('button', {
                className: 'atm-main-chat-history', disabled: older,
                title: older ? t('loadingOlder') : t('loadOlder'),
                'aria-label': older ? t('loadingOlder') : t('loadOlder'),
                onClick: loadOlder,
              }, icon('clock'))
            : null,
          h('span', { className: 'atm-main-chat-live' }, t('live'))),
        h('div', { className: 'atm-main-chat-body' }, body));
    }

    const AgentChat = React.forwardRef(function AgentChat({ agentId, leadId, aliases, sessions, nameColors, t, locale, onHasMoreChange }, ref) {
      const [state, setState] = React.useState({ status: 'loading', entries: [], hasMore: false, error: null });
      const [older, setOlder] = React.useState(false);
      const [limit, setLimit] = React.useState(CHAT_ENTRY_LIMIT);
      const bindingRef = React.useRef(null), logRef = React.useRef(null);
      const stickRef = React.useRef(true), restoreRef = React.useRef(null), visibleRef = React.useRef({ count: 0, firstId: null });

      React.useEffect(() => {
        let cancelled = false, ref, unsubscribe;
        setState({ status: 'loading', entries: [], hasMore: false, error: null });
        setOlder(false);
        setLimit(CHAT_ENTRY_LIMIT);
        bindingRef.current = null;
        stickRef.current = true;
        restoreRef.current = null;
        const target = agentId === leadId ? leadId : { parentSessionId: leadId, childSessionId: agentId, mode: 'continuable' };
        const open = async () => {
          try {
            ref = sessions.retain(target, { source: 'gateway' });
            const binding = await ref.ready;
            if (cancelled) return;
            bindingRef.current = binding;
            const update = () => {
              if (cancelled) return;
              const snapshot = binding.eventSource.getSnapshot();
              setState({ status: 'ready', entries: snapshot.entries || [], hasMore: !!snapshot.hasMore, error: null });
            };
            unsubscribe = binding.eventSource.subscribe(update);
            update();
            const sessionSnapshot = binding.session.getSnapshot();
            if (sessionSnapshot.openState === 'error') {
              setState({ status: 'error', entries: [], hasMore: false, error: sessionSnapshot.openError || t('chatError') });
            }
          } catch (error) {
            if (!cancelled) setState({ status: 'error', entries: [], hasMore: false, error: String(error) });
          }
        };
        open();
        return () => {
          cancelled = true;
          if (unsubscribe) unsubscribe();
          if (ref) ref.release();
          bindingRef.current = null;
        };
      }, [agentId, leadId, sessions]);

      const loadOlder = async () => {
        const binding = bindingRef.current;
        if (!binding || older) return;
        setOlder(true);
        try {
          const log = logRef.current;
          if (log) {
            restoreRef.current = { height: log.scrollHeight, top: log.scrollTop, ...visibleRef.current };
            stickRef.current = false;
          }
          await binding.session.loadOlder();
          setLimit(value => value + CHAT_ENTRY_LIMIT);
        }
        catch (error) { setState(previous => ({ ...previous, error: String(error) })); }
        finally { setOlder(false); }
      };

      React.useLayoutEffect(() => {
        const log = logRef.current;
        if (!log) return;
        const restore = restoreRef.current;
        if (restore) {
          const visible = visibleRef.current;
          if (visible.count > restore.count && visible.firstId !== restore.firstId) {
            restoreRef.current = null;
            log.scrollTop = restore.top + (log.scrollHeight - restore.height);
            return;
          }
          if (visible.count > restore.count) {
            restore.height = log.scrollHeight;
            restore.count = visible.count;
          }
          return;
        }
        if (stickRef.current) log.scrollTop = log.scrollHeight;
      }, [state.entries, state.status, limit]);

      React.useEffect(() => { onHasMoreChange?.(state.status === 'ready' && state.hasMore); }, [state.status, state.hasMore, onHasMoreChange]);
      React.useImperativeHandle(ref, () => ({ loadOlder }));

      if (state.status === 'loading') return h('div', { className: 'atm-state', role: 'status' }, t('chatLoading'));
      if (state.status === 'error') return h('div', { className: 'atm-state', role: 'alert' }, h('strong', null, t('chatError')), state.error);
      const parsed = parseChatEntries(state.entries, agentId, aliases, t).slice(-limit);
      visibleRef.current = { count: parsed.length, firstId: parsed.length > 0 ? parsed[0].id : null };
      return h('div', { className: 'atm-chat-panel' },
        state.error ? h('div', { className: 'atm-state', role: 'alert' }, state.error) : null,
        parsed.length === 0
          ? h('div', { className: 'atm-state', role: 'status' }, t('chatEmpty'))
          : h('div', {
              className: 'atm-chat-log', ref: logRef,
              onScroll: event => {
                const node = event.currentTarget;
                stickRef.current = node.scrollHeight - node.scrollTop - node.clientHeight <= CHAT_FOLLOW_PX;
              },
            },
              parsed.map(item => h('article', { key: item.id, className: `atm-chat-entry ${item.direction}` },
                h('span', { className: 'atm-chat-avatar' }, icon(item.senderId === leadId ? 'crown' : 'bot')),
                h('div', { className: 'atm-chat-content' },
                  h('div', { className: 'atm-chat-meta' },
                    h('span', { className: 'atm-chat-author', style: nameColors.get(item.senderId) ? { color: nameColors.get(item.senderId) } : undefined }, item.sender),
                    h('span', null, '→'),
                    h('span', { style: nameColors.get(item.recipientId) ? { color: nameColors.get(item.recipientId) } : undefined }, item.recipient),
                    h('time', { className: 'atm-chat-time' }, formatClock(item.time, locale))),
                  h('div', { className: 'atm-chat-bubble' },
                    h('div', { className: 'atm-markdown' }, renderMarkdown(item.text))))))
            )
      );
    });

    function AgentDetails({ member, leadId, aliases, roles, tasks, messages, monitor, running, model, reasoning, nameColor, nameColors, now, tab, onTab, onClose, sessions, uiWorkspace, t, locale }) {
      const panelRef = React.useRef(null), chatRef = React.useRef(null);
      const [chatHasMore, setChatHasMore] = React.useState(false);
      React.useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const stopWheel = event => event.stopPropagation();
        panel.addEventListener('wheel', stopWheel, { passive: true });
        return () => panel.removeEventListener('wheel', stopWheel);
      }, []);
      React.useEffect(() => { setChatHasMore(false); }, [member?.id, tab]);
      if (!member) return null;
      const id = member.id, alias = aliases.get(id) || member.name;
      const status = statusOf(member, running);
      const metadata = member.metadata;
      const task = tasks.find(candidate => candidate.status === 'in_progress' && candidate.ownerName === member.name);
      const last = latestFor(id, messages);
      const sent = messages.filter(message => message.senderId === id).length;
      const received = messages.filter(message => message.targetId === id).length;
      const tokens = tokensOf(monitor);
      const tokenDisplay = totalTokenDisplay(tokens, locale);
      const activity = monitor?.activity || monitor?.lastAction;
      const openMain = () => {
        if (id === leadId) uiWorkspace.openSession(leadId);
        else uiWorkspace.openSession({ parentSessionId: leadId, childSessionId: id, mode: 'continuable' });
      };
      return h('aside', { className: `atm-details open${tab === 'chat' ? ' chat' : ''}`, ref: panelRef, 'aria-label': alias },
        h('div', { className: 'atm-detail-head' },
          h('span', { className: 'atm-avatar' }, icon(member.role === 'lead' ? 'crown' : 'bot')),
          h('div', null,
            h('div', { className: 'atm-agent-name', style: nameColor ? { color: nameColor } : undefined }, alias),
            h('div', { className: 'atm-agent-role' }, member.role === 'lead' ? t('roleLead') : roleLabel(roles.get(id), t)),
            h('span', { className: `atm-detail-status${status === 'running' ? '' : ' inactive'}` },
              h('i', { className: `atm-status-dot ${status === 'running' ? 'active' : status}` }), statusLabel(status, t))),
          h('div', { className: 'atm-detail-actions' },
            tab === 'chat' ? h('button', {
              className: 'atm-icon-button', title: t('loadOlder'), 'aria-label': t('loadOlder'),
              disabled: !chatHasMore, onClick: () => chatRef.current?.loadOlder(),
            }, icon('clock')) : null,
            h('button', { className: 'atm-icon-button', title: t('openMain'), 'aria-label': t('openMain'), onClick: openMain }, icon('send')),
            h('button', { className: 'atm-icon-button atm-detail-close', title: t('close'), 'aria-label': t('close'), onClick: onClose }, icon('x')))),
        h('div', { className: 'atm-detail-tabs' },
          h('button', { className: `atm-detail-tab${tab === 'overview' ? ' active' : ''}`, onClick: () => onTab('overview') }, icon('activity'), t('overview')),
          h('button', { className: `atm-detail-tab${tab === 'chat' ? ' active' : ''}`, onClick: () => onTab('chat') }, icon('message'), t('chat'))),
        tab === 'chat'
          ? h(AgentChat, { ref: chatRef, agentId: id, leadId, aliases, sessions, nameColors, t, locale, onHasMoreChange: setChatHasMore })
          : h('div', { className: 'atm-detail-body' },
              h(DetailSection, { label: t('purpose') }, h('div', { className: 'atm-detail-text' }, metadata?.description || task?.description || t('noActivity'))),
              h(DetailSection, { label: t('currentTask') }, h('div', { className: 'atm-detail-text' }, task?.subject || t('noTask'))),
              h(DetailSection, { label: t('lastAction') }, h('div', { className: 'atm-detail-message' }, activity?.preview || t('noActivity'))),
              h(DetailSection, { label: t('lastMessage') }, h('div', { className: 'atm-detail-message' }, last?.preview || t('noMessage'))),
              h(DetailSection, { label: t('tokensAndTime') },
                h('div', { className: 'atm-metrics' },
                  h(Metric, { value: tokenDisplay.value, label: t('total') }),
                  h(Metric, { value: formatDuration(activeMilliseconds(monitor, running, now), t), label: t('activeTime') }),
                  h(Metric, { value: formatCompact(tokens.input, locale), label: t('input') }),
                  h(Metric, { value: formatCompact(tokens.output, locale), label: t('output') }),
                  h(Metric, { value: formatCompact(tokens.cacheRead, locale), label: t('cacheRead') }),
                  h(Metric, { value: formatCompact(tokens.cacheWrite, locale), label: t('cacheWrite') }),
                  h(Metric, { value: formatCompact(tokens.reasoning, locale), label: t('reasoning') }),
                  h(Metric, { value: formatDuration(monitor?.llmMs, t), label: t('llmTime') }),
                  h(Metric, { value: formatDuration(monitor?.toolMs, t), label: t('toolTime') })),
                tokens.unreportedTotal > 0 ? h('p', { className: 'atm-panel-note' }, t('tokenIncomplete', { count: formatNumber(tokens.unreportedTotal, locale) })) : null),
              h(DetailSection, { label: t('activity') },
                h('div', { className: 'atm-metrics' },
                  h(Metric, { value: `${sent} / ${received}`, label: t('sentReceived') }),
                  h(Metric, { value: `${number(monitor?.turns)} / ${number(monitor?.steps)}`, label: t('turnsSteps') }),
                  h(Metric, { value: formatNumber(monitor?.messageCount, locale), label: t('messageCount') }),
                  h(Metric, { value: model || '—', label: t('model') }),
                  h(Metric, { value: reasoning || '—', label: t('reasoningLevel') }),
                  h(Metric, { value: metadata?.provider || '—', label: t('provider') }),
                  h(Metric, { value: metadata?.context || '—', label: t('context') }))),
              h(DetailSection, { label: t('runtimeName') },
                h('div', { className: 'atm-session-id' }, member.name),
                h('div', { className: 'atm-detail-label', style: { marginTop: 12 } }, t('sessionId')),
                h('div', { className: 'atm-session-id' }, id)),
              member.error ? h(DetailSection, { label: t('statusFailed') }, h('div', { className: 'atm-detail-message' }, member.error)) : null));
    }

    function TeamStats({ members, messages, projectionsBySession, runningById, now, t, locale }) {
      const totals = members.reduce((sum, member) => {
        const monitor = projectionsBySession[member.id]?.values.agentTeamMonitor;
        const tokens = tokensOf(monitor);
        for (const key of Object.keys(sum.tokens)) sum.tokens[key] += tokens[key];
        sum.activeMs += activeMilliseconds(monitor, runningById[member.id] === true, now);
        sum.messages += monitor?.messageCount === undefined ? (monitor?.messages?.length || 0) : number(monitor.messageCount);
        return sum;
      }, { tokens: { input: 0, output: 0, total: 0, unreportedTotal: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0 }, activeMs: 0, messages: 0 });
      const active = Object.values(runningById).filter(Boolean).length;
      const tokenDisplay = totalTokenDisplay(totals.tokens, locale);
      const stats = [
        ['users', `${active} / ${members.length}`, t('activeAgents')],
        ['coins', tokenDisplay.value, t('teamTokens')],
        ['clock', formatDuration(totals.activeMs, t), t('agentTime')],
        ['activity', formatCompact(totals.messages, locale), t('teamMessages')],
      ];
      return h('footer', { className: 'atm-stats' }, stats.map(([ic, value, label]) =>
        h('div', { className: 'atm-stat', key: label },
          h('span', { className: 'atm-stat-icon' }, icon(ic)),
          h('span', null, h('div', { className: 'atm-stat-value' }, value), h('div', { className: 'atm-stat-label' }, label)))));
    }

    function TeamMonitorViewContent({ sessionId, useSession, useSessions, useSessionStatus, sessions, uiWorkspace, t }) {
      const locale = t('locale');
      const [now, setNow] = React.useState(() => Date.now());
      const [selectedId, setSelectedId] = React.useState(null);
      const [detailTab, setDetailTab] = React.useState('chat');
      const leadId = useSession(snapshot => snapshot.subagent?.address.parentSessionId) ?? sessionId;
      const team = useSessions(state => state.projectionsBySession[leadId]?.values.agentTeam);
      const projectionsBySession = useSessions(state => state.projectionsBySession);
      const byId = useSessions(state => state.byId);
      const statuses = useSessionStatus(state => state);
      const leadMonitor = projectionsBySession[leadId]?.values.agentTeamMonitor;
      const { members } = React.useMemo(() => mergeMembers(team, leadMonitor), [team, leadMonitor]);
      const tasks = team?.tasks ?? EMPTY_LIST;
      const metadataById = React.useMemo(() => new Map(members.map(member => [member.id, member.metadata])), [members]);
      const aliases = React.useMemo(() => displayAliases(members, metadataById), [members, metadataById]);
      const roles = React.useMemo(() => new Map(members.map(member => [member.id, member.role === 'lead' ? 'lead' : roleKeyFor(member, member.metadata?.description)])), [members]);
      const runningById = Object.fromEntries(members.map(member => [member.id, (statuses.get(member.id)?.running ?? byId[member.id]?.running) === true]));
      const messages = React.useMemo(() => collectMessages(members, projectionsBySession), [members, projectionsBySession]);
      const nameColors = React.useMemo(() => new Map(members.map(member => {
        const monitor = projectionsBySession[member.id]?.values.agentTeamMonitor;
        const selection = projectionsBySession[member.id]?.values.modelSelection?.next;
        return [member.id, modelNameColor(monitor?.requestConfig?.provider || selection?.provider, monitor?.requestConfig?.model || selection?.model)];
      })), [members, projectionsBySession]);
      const selected = members.find(member => member.id === selectedId) || null;

      React.useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
      }, []);
      React.useEffect(() => { setSelectedId(null); setDetailTab('chat'); }, [leadId]);
      React.useEffect(() => {
        if (selectedId && !members.some(member => member.id === selectedId)) setSelectedId(null);
      }, [selectedId, members]);
      React.useEffect(() => {
        const escape = event => { if (event.key === 'Escape') setSelectedId(null); };
        document.addEventListener('keydown', escape);
        return () => document.removeEventListener('keydown', escape);
      }, []);

      const selectMember = id => {
        setSelectedId(current => current === id ? null : id);
        setDetailTab('chat');
      };

      if (!team) return h('div', { className: 'atm-app' }, h('div', { className: 'atm-empty-canvas' }, h('div', null, h('strong', null, t('unavailableTitle')), h('p', null, t('unavailableBody')))));
      if (members.length === 0) return h('div', { className: 'atm-app' }, h('div', { className: 'atm-empty-canvas' }, h('div', null, h('strong', null, t('noAgentsTitle')), h('p', null, t('noAgentsBody')))));

      return h('div', { className: 'atm-app' },
        h(TeamCanvas, {
          members, leadId, aliases, roles, tasks, messages, projectionsBySession, runningById,
          selectedId, onSelect: selectMember, now, sessionId, sessions, nameColors, t, locale,
        }),
        selected ? h(AgentDetails, {
          member: selected, leadId, aliases, roles, tasks, messages,
          monitor: projectionsBySession[selected.id]?.values.agentTeamMonitor,
          running: runningById[selected.id] === true,
          model: projectionsBySession[selected.id]?.values.agentTeamMonitor?.requestConfig?.model || projectionsBySession[selected.id]?.values.modelSelection?.next?.model,
          reasoning: projectionsBySession[selected.id]?.values.agentTeamMonitor?.requestConfig?.reasoningEffort || projectionsBySession[selected.id]?.values.modelSelection?.next?.reasoningEffort,
          nameColor: nameColors.get(selected.id), nameColors,
          now, tab: detailTab, onTab: setDetailTab, onClose: () => setSelectedId(null),
          sessions, uiWorkspace, t, locale,
        }) : null,
        h(TeamStats, { members, messages, projectionsBySession, runningById, now, t, locale }));
    }

    class MonitorErrorBoundary extends React.Component {
      state = { error: null };
      static getDerivedStateFromError(error) { return { error }; }
      componentDidCatch(error, info) { console.error(`[agent-team-monitor] ${error.message}`, info.componentStack); }
      render() {
        if (!this.state.error) return this.props.children;
        return h('div', { className: 'atm-empty-canvas', role: 'alert' }, h('div', null,
          h('strong', null, this.props.t('renderError')),
          h('pre', { className: 'atm-session-id' }, String(this.state.error)),
          h('button', { className: 'atm-open-main', onClick: () => this.setState({ error: null }) }, this.props.t('retry'))));
      }
    }
    function TeamMonitorView(props) {
      return h(MonitorErrorBoundary, { t: props.t }, h(TeamMonitorViewContent, props));
    }

    function apply(ctx) {
      installStyles();
      ctx.effect(() => ctx.locale.register(NS, { en, ru }), 'agent-team-monitor: dictionaries');
      const t = ctx.locale.bind(NS);
      ctx.slots.inject('conversation.view', () => ctx.slots.register({
        name: 'conversation.view', id: 'team-monitor', order: 20, locale: NS,
        label: () => t('view'),
        inject: () => ({ sessions: ctx.sessions, uiWorkspace: ctx.uiWorkspace }),
      }, TeamMonitorView));
    }

    const inject = ['slots', 'locale', 'sessions', 'uiWorkspace'];
    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
