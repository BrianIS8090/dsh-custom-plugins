window.__ModuleLoader__.load({
  id: '@local/agent-war-room',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'agent-war-room';
    const ROLES = ['researcher', 'architect', 'skeptic', 'verifier'];
    const EMPTY = [];

    const en = {
      locale: 'en-US', view: 'War Room', title: 'Decision War Room', subtitle: 'Four roles. One evolving artifact.',
      live: 'LIVE', complete: 'ARTIFACT READY', waiting: 'WAITING', failed: 'ERROR',
      emptyTitle: 'Put four agents around one document',
      emptyBody: 'The researcher brings facts, the architect drafts the answer, the skeptic attacks it twice, and the verifier checks the sources. You see decisions and document changes — not four chats.',
      emptyCommand: 'Start in the composer:', command: '/war-room Should we launch this project next quarter?',
      copyCommand: 'Copy the example command', copied: 'Copied', copy: 'Copy', download: 'Download Markdown', artifact: 'Artifact', sources: 'Sources',
      process: 'Decision feed', allActivity: 'All roles', noActivity: 'Agent moves will appear here as their sessions commit them.',
      roleResearcher: 'Researcher', roleArchitect: 'Architect', roleSkeptic: 'Skeptic', roleVerifier: 'Source verifier',
      purposeResearcher: 'Facts and evidence', purposeArchitect: 'A concrete solution', purposeSkeptic: 'Attacks weak assumptions', purposeVerifier: 'Independent source checks',
      statusWaiting: 'Waiting', statusRunning: 'Working', statusDone: 'Completed this pass', statusError: 'Failed',
      toolRunning: 'Running', toolDone: 'Completed', toolError: 'Failed', expand: 'Expand this move', collapse: 'Collapse this move',
      stageFacts: 'Facts', stageDraft: 'Draft', stageAttack: 'Attack', stageVerify: 'Verify', stageFinal: 'Final',
      noArtifactTitle: 'The artifact will be built here', noArtifactBody: 'The first evidence brief and every architect revision will replace this placeholder. Nothing is presented as final until the second attack and revision are complete.',
      draft: 'Draft', final: 'Final', version: 'Version', latest: 'Latest', changed: 'new or revised', reviewed: 'reviewed', cited: 'cited',
      facts: 'facts', objections: 'objections', sourcesCount: 'unique sources', versions: 'artifact versions', elapsed: 'elapsed',
      question: 'Question', filter: 'Filter the feed by role', clearFilter: 'Show every role', noSources: 'Cited and reviewed URLs will appear here.',
      sourceRoles: 'Roles that cited this source', openSource: 'Open source', renderError: 'War Room could not be rendered', retry: 'Retry',
      currentPass: 'current pass', round: 'round', finalHint: 'Two attacks and revisions are complete.',
      revision: 'Revision', openVersion: 'Open this version →', changesOn: 'Hide changes', changesOff: 'Show changes vs previous', sourcesReviewed: 'sources reviewed',
    };
    const ru = {
      locale: 'ru-RU', view: 'Штаб', title: 'Штаб решения', subtitle: 'Четыре роли. Один живой артефакт.',
      live: 'LIVE', complete: 'АРТЕФАКТ ГОТОВ', waiting: 'ОЖИДАНИЕ', failed: 'ОШИБКА',
      emptyTitle: 'Соберите четырёх агентов вокруг одного документа',
      emptyBody: 'Исследователь приносит факты, Архитектор строит решение, Скептик дважды его атакует, Верификатор проверяет источники. На экране — ходы и изменения документа, а не четыре чата.',
      emptyCommand: 'Запустите в поле ввода:', command: '/war-room Стоит ли запускать этот проект в следующем квартале?',
      copyCommand: 'Скопировать пример команды', copied: 'Скопировано', copy: 'Копировать', download: 'Скачать Markdown', artifact: 'Артефакт', sources: 'Источники',
      process: 'Лента решений', allActivity: 'Все роли', noActivity: 'Ходы агентов появятся здесь по мере записи их сессий.',
      roleResearcher: 'Исследователь', roleArchitect: 'Архитектор', roleSkeptic: 'Скептик', roleVerifier: 'Верификатор',
      purposeResearcher: 'Факты и доказательства', purposeArchitect: 'Конкретное решение', purposeSkeptic: 'Атакует слабые допущения', purposeVerifier: 'Независимо проверяет источники',
      statusWaiting: 'Ожидает', statusRunning: 'Работает', statusDone: 'Проход завершён', statusError: 'Ошибка',
      toolRunning: 'Выполняется', toolDone: 'Завершено', toolError: 'Ошибка', expand: 'Развернуть ход', collapse: 'Свернуть ход',
      stageFacts: 'Факты', stageDraft: 'Черновик', stageAttack: 'Атака', stageVerify: 'Проверка', stageFinal: 'Финал',
      noArtifactTitle: 'Здесь появится живой артефакт', noArtifactBody: 'Сначала — доказательная база, затем каждая версия Архитектора. Финальным документ считается только после второй атаки и переработки.',
      draft: 'Черновик', final: 'Финал', version: 'Версия', latest: 'Последняя', changed: 'новый или переработанный блок', reviewed: 'проверялся', cited: 'упоминался',
      facts: 'фактов', objections: 'возражений', sourcesCount: 'уникальных источников', versions: 'версий артефакта', elapsed: 'прошло',
      question: 'Вопрос', filter: 'Отфильтровать ленту по роли', clearFilter: 'Показать все роли', noSources: 'Здесь появятся цитируемые и проверенные URL.',
      sourceRoles: 'Роли, которые сослались на источник', openSource: 'Открыть источник', renderError: 'Не удалось отрисовать Штаб', retry: 'Повторить',
      currentPass: 'текущий проход', round: 'раунд', finalHint: 'Две атаки и две переработки завершены.',
      revision: 'Переработка', openVersion: 'Открыть эту версию →', changesOn: 'Скрыть изменения', changesOff: 'Показать изменения', sourcesReviewed: 'источников проверено',
    };

    const ICONS = {
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
      pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 9 6 6m0-6-6 6"/>',
      check: '<path d="M20 6 9 17l-5-5"/>',
      file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
      copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
      download: '<path d="M12 3v12m-4-4 4 4 4-4M4 21h16"/>',
      link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
      activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      chevron: '<path d="m9 18 6-6-6-6"/>',
      close: '<path d="M18 6 6 18M6 6l12 12"/>',
    };
    function icon(name) {
      return h('svg', { className: 'awr-icon', viewBox: '0 0 24 24', 'aria-hidden': true, dangerouslySetInnerHTML: { __html: ICONS[name] || ICONS.activity } });
    }

    const CSS = `
      .awr-app{height:100%;min-height:0;max-height:100%;overflow:hidden;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:13px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
      .awr-app *{box-sizing:border-box}.awr-app button{font:inherit;color:inherit}.awr-app button:focus-visible,.awr-app a:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
      .awr-icon{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
      .awr-header{display:flex;align-items:center;gap:20px;flex:0 0 auto;min-height:78px;padding:14px 20px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
      .awr-heading{min-width:220px;max-width:390px}.awr-title-line{display:flex;align-items:center;gap:9px}.awr-brand{width:32px;height:32px;display:grid;place-items:center;border-radius:10px;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-inverted)}
      .awr-title{font-size:16px;font-weight:760;letter-spacing:-.02em}.awr-question{margin-top:4px;color:var(--dsw-alias-label-secondary);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .awr-live{display:inline-flex;align-items:center;gap:6px;flex:none;padding:4px 8px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;color:var(--dsw-alias-state-success-primary);font-size:10px;font-weight:750;letter-spacing:.06em}.awr-live.error{color:var(--dsw-alias-state-error-primary)}.awr-live.idle{color:var(--dsw-alias-state-idle-primary)}
      .awr-live-dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:awrPulse 1.8s infinite}.awr-live.complete .awr-live-dot,.awr-live.idle .awr-live-dot{animation:none}
      .awr-steps{display:flex;align-items:center;justify-content:center;gap:4px;flex:1;min-width:0}.awr-step{position:relative;display:flex;align-items:center;gap:6px;min-width:0;color:var(--dsw-alias-label-dimmed);font-size:12px;white-space:nowrap}.awr-step:not(:last-child):after{content:"";width:18px;height:1px;margin:0 3px;background:var(--dsw-alias-border-l2)}
      .awr-step-index{width:21px;height:21px;display:grid;place-items:center;border:1px solid var(--dsw-alias-border-l1);border-radius:50%;font-size:9px;font-variant-numeric:tabular-nums}.awr-step.active{color:var(--dsw-alias-brand-primary)}.awr-step.active .awr-step-index{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 3px var(--dsw-alias-interactive-bg-active)}.awr-step.done{color:var(--dsw-alias-state-success-primary)}.awr-step.done .awr-step-index{border-color:var(--dsw-alias-state-success-primary)}
      .awr-body{display:grid;grid-template-columns:minmax(320px,390px) minmax(0,1fr);grid-template-rows:minmax(0,1fr);flex:1 1 0%;height:0;min-height:0;max-height:100%;overflow:hidden}.awr-process{display:grid;grid-template-rows:minmax(0,auto) minmax(0,1fr);min-height:0;max-height:100%;overflow:hidden;border-right:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
      .awr-roles{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px;border-bottom:1px solid var(--dsw-alias-border-l1)}
      .awr-role{position:relative;min-width:0;min-height:96px;padding:11px;text-align:left;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-2);cursor:pointer;transition:border-color .16s,background-color .16s}.awr-role:hover{border-color:var(--dsw-alias-border-l2)}.awr-role.selected{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-interactive-bg-active)}
      .awr-role-head{display:flex;align-items:center;gap:7px}.awr-role-icon{width:26px;height:26px;display:grid;place-items:center;border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-brand-primary)}.awr-role.skeptic .awr-role-icon{color:var(--dsw-alias-state-error-primary)}.awr-role.verifier .awr-role-icon{color:var(--dsw-alias-state-success-primary)}
      .awr-role-name{min-width:0;font-size:13px;font-weight:720;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.awr-status-dot{width:6px;height:6px;margin-left:auto;flex:none;border-radius:50%;background:var(--dsw-alias-state-idle-primary)}.awr-role.running .awr-status-dot{background:var(--dsw-alias-state-success-primary);animation:awrPulse 1.8s infinite}.awr-role.error .awr-status-dot{background:var(--dsw-alias-state-error-primary)}.awr-role.done .awr-status-dot{background:var(--dsw-alias-state-success-primary)}
      .awr-purpose{display:block;margin-top:7px;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.awr-role-state{display:block;margin-top:6px;color:var(--dsw-alias-label-caption);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.awr-role.running .awr-role-state{color:var(--dsw-alias-state-success-primary)}.awr-role.error .awr-role-state{color:var(--dsw-alias-state-error-primary)}
      .awr-feed{display:flex;flex-direction:column;min-height:0}.awr-feed-head{display:flex;align-items:center;gap:7px;padding:11px 14px;border-bottom:1px solid var(--dsw-alias-border-l1);font-size:11px;font-weight:720;letter-spacing:.06em;text-transform:uppercase}.awr-feed-filter{margin-left:auto;padding:3px 7px;border:0;border-radius:7px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:11px;cursor:pointer}
      .awr-feed-log{flex:1 1 0%;height:0;min-height:0;overflow:auto;overscroll-behavior:contain;padding:12px 12px calc(var(--dsh-composer-height,152px) + 20px);overflow-anchor:none}.awr-feed-empty{padding:28px 18px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:11px}.awr-move{position:relative;display:grid;grid-template-columns:22px minmax(0,1fr);gap:8px;padding-bottom:13px}.awr-move:not(:last-child):before{content:"";position:absolute;left:10px;top:23px;bottom:0;width:1px;background:var(--dsw-alias-border-l1)}
      .awr-move-marker{width:21px;height:21px;display:grid;place-items:center;border:1px solid var(--dsw-alias-border-l1);border-radius:50%;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-brand-primary)}.awr-move-marker .awr-icon{width:11px;height:11px}.awr-move.skeptic .awr-move-marker{color:var(--dsw-alias-state-error-primary)}.awr-move.verifier .awr-move-marker{color:var(--dsw-alias-state-success-primary)}
      .awr-move-card{min-width:0;padding:8px 9px;border:1px solid transparent;border-radius:9px;cursor:pointer}.awr-move-card:hover{background:var(--dsw-alias-bg-layer-2)}.awr-move-card.expanded{border-color:var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2)}
      .awr-move-meta{display:flex;align-items:center;gap:6px;color:var(--dsw-alias-label-secondary);font-size:11px}.awr-move-version{padding:1px 6px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;color:var(--dsw-alias-label-primary);font-size:10px;font-weight:650}.awr-move-role{font-weight:720;color:var(--dsw-alias-label-primary)}.awr-move-time{margin-left:auto;font-variant-numeric:tabular-nums}.awr-move-text{margin-top:4px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5;overflow-wrap:anywhere;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}.awr-move-card.expanded .awr-move-text{display:block;-webkit-line-clamp:unset}.awr-tool-text{font:11px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:nowrap;text-overflow:ellipsis}.awr-move-card.expanded .awr-tool-text{white-space:pre-wrap}
      .awr-artifact{display:flex;flex-direction:column;min-width:0;min-height:0;max-height:100%;overflow:hidden;background:var(--dsw-alias-bg-base)}.awr-artifact-head{display:flex;align-items:center;gap:10px;flex:0 0 auto;min-height:55px;padding:10px 16px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
      .awr-artifact-title{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:740}.awr-artifact-badge{padding:2px 6px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;color:var(--dsw-alias-label-secondary);font-size:10px;font-weight:650;text-transform:uppercase;letter-spacing:.06em}.awr-artifact-badge.final{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary)}
      .awr-artifact-actions{display:flex;align-items:center;gap:5px;margin-left:auto}.awr-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:30px;padding:6px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px}.awr-button:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary)}.awr-button:disabled{opacity:.4;cursor:not-allowed}.awr-button.active{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:650}.awr-button .awr-icon{width:13px;height:13px}
      .awr-tabs{display:flex;gap:4px;margin-left:7px}.awr-versions{display:flex;align-items:center;gap:4px;padding:7px 16px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);overflow-x:auto}.awr-version-label{margin-right:3px;color:var(--dsw-alias-label-secondary);font-size:11px;text-transform:uppercase;letter-spacing:.06em}.awr-version{min-width:31px;padding:4px 7px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:var(--dsw-alias-bg-layer-1);cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:12px}.awr-version:hover{color:var(--dsw-alias-label-primary)}.awr-version.active{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);font-weight:650}.awr-change-key{display:inline-flex;align-items:center;margin-left:auto;padding:4px 8px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;cursor:pointer}.awr-change-key:hover,.awr-change-key.on{color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2)}.awr-change-swatch{display:inline-block;width:8px;height:8px;margin-right:5px;border-left:2px solid var(--dsw-alias-brand-primary);background:transparent}
      .awr-document{flex:1 1 0%;height:0;min-height:0;overflow:auto;overscroll-behavior:contain;padding:26px clamp(22px,4vw,58px) calc(var(--dsh-composer-height,152px) + 32px)}.awr-document-inner{max-width:860px;margin:0 auto}.awr-placeholder{max-width:560px;margin:10vh auto;padding:30px;border:1px dashed var(--dsw-alias-border-l2);border-radius:16px;text-align:center;color:var(--dsw-alias-label-secondary)}.awr-placeholder .awr-brand{margin:0 auto 16px;width:42px;height:42px}.awr-placeholder strong{display:block;margin-bottom:9px;color:var(--dsw-alias-label-primary);font-size:16px}.awr-placeholder-question{margin-top:18px;padding-top:16px;border-top:1px solid var(--dsw-alias-border-l1);font-size:11px;overflow-wrap:anywhere}
      .awr-md{color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.68;overflow-wrap:anywhere}.awr-md>*{position:relative;border-radius:7px;transition:background-color .3s}.awr-md>.is-new{margin-left:-14px;padding-left:12px;border-left:2px solid var(--dsw-alias-brand-primary);border-radius:0;background:transparent}.awr-md h1,.awr-md h2,.awr-md h3{line-height:1.3;letter-spacing:-.02em}.awr-md h1{margin:0 0 24px;font-size:27px}.awr-md h2{margin:29px 0 11px;font-size:18px}.awr-md h3{margin:22px 0 9px;font-size:15px}.awr-md p{margin:10px 0}.awr-md ul,.awr-md ol{margin:10px 0;padding-left:25px}.awr-md li{margin:6px 0}.awr-md blockquote{margin:14px 0;padding:10px 14px;border-left:3px solid var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary)}.awr-md code{font:12px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;background:var(--dsw-alias-markdown-inline-code);padding:2px 4px;border-radius:4px}.awr-md pre{overflow:auto;padding:14px;background:var(--dsw-alias-markdown-code-block);border-radius:10px}.awr-md pre code{background:none;padding:0}.awr-md a{color:var(--dsw-alias-link);text-decoration:none}.awr-md a:hover{text-decoration:underline}
      .awr-source-list{display:grid;gap:9px}.awr-source{display:flex;align-items:flex-start;gap:11px;padding:13px;border:1px solid var(--dsw-alias-border-l1);border-radius:11px;background:var(--dsw-alias-bg-layer-1)}.awr-source-icon{width:29px;height:29px;display:grid;place-items:center;flex:none;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}.awr-source.reviewed .awr-source-icon{color:var(--dsw-alias-state-success-primary)}.awr-source-main{min-width:0;flex:1}.awr-source-url{display:block;color:var(--dsw-alias-link);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-decoration:none}.awr-source-url:hover{text-decoration:underline}.awr-source-meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}.awr-source-tag{padding:2px 5px;border-radius:5px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:10px}.awr-source-tag.reviewed{color:var(--dsw-alias-state-success-primary)}
      .awr-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));flex:0 0 auto;min-height:51px;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}.awr-stat{display:flex;align-items:center;justify-content:center;gap:7px;min-width:0;padding:9px 12px;border-right:1px solid var(--dsw-alias-border-l1)}.awr-stat:last-child{border-right:0}.awr-stat-value{font-size:15px;font-weight:750;font-variant-numeric:tabular-nums}.awr-stat-label{color:var(--dsw-alias-label-secondary);font-size:9px;line-height:1.25}
      .awr-empty{height:100%;overflow:auto;display:grid;place-items:center;padding:28px;background:var(--dsw-alias-bg-base)}.awr-empty-inner{width:min(920px,100%);padding:34px;border:1px solid var(--dsw-alias-border-l1);border-radius:20px;background:var(--dsw-alias-bg-layer-1)}.awr-empty-top{max-width:690px}.awr-empty h1{margin:18px 0 10px;font-size:25px;letter-spacing:-.03em}.awr-empty p{margin:0;color:var(--dsw-alias-label-secondary);line-height:1.65}.awr-empty-roles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:25px 0}.awr-empty-role{padding:15px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-2)}.awr-empty-role .awr-role-icon{margin-bottom:10px}.awr-empty-role strong{display:block;font-size:11px}.awr-empty-role span{display:block;margin-top:5px;color:var(--dsw-alias-label-secondary);font-size:9px}.awr-command-label{margin-bottom:7px;color:var(--dsw-alias-label-secondary);font-size:10px}.awr-command{display:flex;align-items:center;gap:9px;padding:12px 13px;border:1px solid var(--dsw-alias-border-l2);border-radius:11px;background:var(--dsw-alias-bg-base)}.awr-command code{min-width:0;flex:1;overflow-wrap:anywhere;color:var(--dsw-alias-brand-primary);font:12px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace}
      .awr-role-metric{display:flex;align-items:baseline;gap:5px;margin-top:8px}.awr-role-metric b{font-size:17px;font-weight:750;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary)}.awr-role-metric span{color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .awr-elapsed{color:var(--dsw-alias-label-secondary);font-size:11px;font-variant-numeric:tabular-nums;white-space:nowrap}
      .awr-move-open{margin-top:6px;padding:0;border:0;background:none;color:var(--dsw-alias-link);font-size:11px;cursor:pointer}.awr-move-open:hover{text-decoration:underline}
      @keyframes awrPulse{50%{opacity:.35}}@media(prefers-reduced-motion:reduce){.awr-app *{animation:none!important;transition:none!important}}
      @media(max-width:1120px){.awr-header{gap:12px;padding:12px 14px}.awr-heading{max-width:260px}.awr-step-label{display:none}.awr-step:not(:last-child):after{width:11px}.awr-body{grid-template-columns:320px minmax(0,1fr)}.awr-roles{grid-template-columns:1fr}.awr-role{min-height:76px}.awr-stats{grid-template-columns:repeat(5,minmax(0,1fr))}.awr-stat-label{display:none}}
      @media(max-width:760px){.awr-app{display:block;overflow:auto}.awr-header{align-items:flex-start;flex-wrap:wrap}.awr-heading{max-width:calc(100% - 90px)}.awr-steps{order:3;flex-basis:100%;justify-content:flex-start}.awr-body{display:block;overflow:visible}.awr-process{display:block;border-right:0;border-bottom:1px solid var(--dsw-alias-border-l1)}.awr-roles{grid-template-columns:1fr 1fr}.awr-feed-log{max-height:340px}.awr-artifact{min-height:620px}.awr-document{overflow:visible;height:auto;flex:none;padding:20px 17px 45px}.awr-stats{position:sticky;bottom:0;z-index:4}.awr-stat{padding:8px 4px}.awr-empty{padding:12px}.awr-empty-inner{padding:22px}.awr-empty-roles{grid-template-columns:1fr 1fr}.awr-command{align-items:flex-start;flex-wrap:wrap}.awr-artifact-head{flex-wrap:wrap}.awr-tabs{margin-left:0}.awr-change-key{display:none}}
    `;

    function roleName(role, t) { return t(`role${role[0].toUpperCase()}${role.slice(1)}`); }
    function rolePurpose(role, t) { return t(`purpose${role[0].toUpperCase()}${role.slice(1)}`); }
    function roleIcon(role) { return role === 'researcher' ? 'search' : role === 'architect' ? 'pen' : role === 'skeptic' ? 'shield' : 'check'; }
    function statusLabel(status, t) { return t(`status${status[0].toUpperCase()}${status.slice(1)}`); }
    function clock(value, locale) { return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(value || 0)); }
    function duration(ms) { const seconds = Math.max(0, Math.floor(ms / 1000)); const minutes = Math.floor(seconds / 60); return minutes ? `${minutes}m ${seconds % 60}s` : `${seconds}s`; }
    function listItems(text) { return String(text || '').split('\n').filter(line => /^\s*(?:[-*+]|\d+[.)])\s+/u.test(line)).length; }
    function preview(text) { return String(text || '').replace(/^#+\s+.*$/gmu, '').replace(/\[([^\]]+)\]\(([^)]+)\)/gu, '$1').replace(/[*_`>#|]/gu, '').replace(/\s+/gu, ' ').trim().slice(0, 330); }

    function parseInline(text) {
      const tokens = [], pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g;
      let last = 0, match;
      while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) tokens.push(text.slice(last, match.index));
        const raw = match[0];
        if (raw.startsWith('**')) tokens.push({ type: 'strong', children: parseInline(raw.slice(2, -2)) });
        else if (raw.startsWith('`')) tokens.push({ type: 'code', text: raw.slice(1, -1) });
        else { const link = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/.exec(raw); if (link) tokens.push({ type: 'link', href: link[2], children: parseInline(link[1]) }); }
        last = match.index + raw.length;
      }
      if (last < text.length) tokens.push(text.slice(last));
      return tokens;
    }
    function inline(tokens) {
      return tokens.map((token, index) => typeof token === 'string' ? token
        : token.type === 'strong' ? h('strong', { key: index }, inline(token.children))
          : token.type === 'code' ? h('code', { key: index }, token.text)
            : h('a', { key: index, href: token.href, target: '_blank', rel: 'noreferrer' }, inline(token.children)));
    }
    function markdownBlocks(text) {
      const lines = String(text || '').replace(/\r\n?/gu, '\n').split('\n'), blocks = [];
      let index = 0;
      while (index < lines.length) {
        const line = lines[index];
        if (!line.trim()) { index++; continue; }
        const fence = /^```\s*([^\s]*)\s*$/u.exec(line);
        if (fence) { const code = [line]; const body = []; index++; while (index < lines.length && !/^```\s*$/u.test(lines[index])) { code.push(lines[index]); body.push(lines[index++]); } if (index < lines.length) { code.push(lines[index]); index++; } blocks.push({ type: 'code', text: body.join('\n'), raw: code.join('\n') }); continue; }
        const heading = /^(#{1,3})\s+(.+)$/u.exec(line);
        if (heading) { blocks.push({ type: 'heading', level: heading[1].length, children: parseInline(heading[2]), raw: line }); index++; continue; }
        if (/^>\s?/u.test(line)) { const raw = []; while (index < lines.length && /^>\s?/u.test(lines[index])) raw.push(lines[index++]); blocks.push({ type: 'quote', children: parseInline(raw.map(item => item.replace(/^>\s?/u, '')).join('\n')), raw: raw.join('\n') }); continue; }
        if (/^\s*[-*+]\s+/u.test(line) || /^\s*\d+[.)]\s+/u.test(line)) {
          const ordered = /^\s*\d+[.)]\s+/u.test(line), items = [], raw = [];
          while (index < lines.length) { const item = ordered ? /^\s*\d+[.)]\s+(.+)$/u.exec(lines[index]) : /^\s*[-*+]\s+(.+)$/u.exec(lines[index]); if (!item) break; raw.push(lines[index++]); items.push(parseInline(item[1])); }
          blocks.push({ type: 'list', ordered, items, raw: raw.join('\n') }); continue;
        }
        const raw = [line]; index++;
        while (index < lines.length && lines[index].trim() && !/^```|^#{1,3}\s|^>\s?|^\s*[-*+]\s+|^\s*\d+[.)]\s+/u.test(lines[index])) raw.push(lines[index++]);
        blocks.push({ type: 'paragraph', children: parseInline(raw.join('\n')), raw: raw.join('\n') });
      }
      return blocks;
    }
    function Markdown({ text, previous = '', annotate = false }) {
      return h('div', { className: 'awr-md' }, markdownBlocks(text).map((block, index) => {
        const isNew = annotate && previous && !previous.includes(block.raw.trim());
        const props = { key: index, className: isNew ? 'is-new' : undefined, title: isNew ? undefined : undefined };
        if (block.type === 'code') return h('pre', props, h('code', null, block.text));
        if (block.type === 'heading') return h(`h${block.level}`, props, inline(block.children));
        if (block.type === 'quote') return h('blockquote', props, inline(block.children));
        if (block.type === 'list') return h(block.ordered ? 'ol' : 'ul', props, block.items.map((item, itemIndex) => h('li', { key: itemIndex }, inline(item))));
        return h('p', props, inline(block.children));
      }));
    }

    function EmptyState({ t }) {
      const [copied, setCopied] = React.useState(false);
      const copy = async () => { try { await navigator.clipboard.writeText(t('command')); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard permissions stay with the browser */ } };
      return h('div', { className: 'awr-empty', 'data-conversation-composer-overlay': true }, h('div', { className: 'awr-empty-inner' },
        h('div', { className: 'awr-empty-top' }, h('span', { className: 'awr-brand' }, icon('file')), h('h1', null, t('emptyTitle')), h('p', null, t('emptyBody'))),
        h('div', { className: 'awr-empty-roles' }, ROLES.map(role => h('div', { className: 'awr-empty-role', key: role }, h('span', { className: 'awr-role-icon' }, icon(roleIcon(role))), h('strong', null, roleName(role, t)), h('span', null, rolePurpose(role, t))))),
        h('div', { className: 'awr-command-label' }, t('emptyCommand')),
        h('div', { className: 'awr-command' }, h('code', null, t('command')), h('button', { className: 'awr-button', onClick: copy, title: t('copyCommand') }, icon('copy'), copied ? t('copied') : t('copy')))));
    }

    function StagePipeline({ members, versions, running, t }) {
      const byRole = Object.fromEntries(ROLES.map(role => [role, members.find(member => member.role === role)]));
      const final = versions.length >= 3 && !running;
      const steps = [
        { key: 'stageFacts', done: !!byRole.researcher?.lastText, active: byRole.researcher?.status === 'running' || !byRole.researcher },
        { key: 'stageDraft', done: versions.length > 0, active: versions.length === 0 && byRole.architect?.status === 'running' },
        { key: 'stageAttack', done: !!byRole.skeptic?.lastText, active: byRole.skeptic?.status === 'running' },
        { key: 'stageVerify', done: !!byRole.verifier?.lastText, active: byRole.verifier?.status === 'running' },
        { key: 'stageFinal', done: final, active: !final && versions.length > 0 && (byRole.architect?.status === 'running' || (!!byRole.skeptic?.lastText && versions.length < 3)) },
      ];
      return h('div', { className: 'awr-steps', 'aria-label': t('process') }, steps.map((step, index) => h('div', { key: step.key, className: `awr-step${step.done ? ' done' : step.active ? ' active' : ''}` }, h('span', { className: 'awr-step-index' }, step.done ? '✓' : index + 1), h('span', { className: 'awr-step-label' }, t(step.key)))));
    }

    function RoleCard({ role, member, metric, selected, onSelect, t }) {
      const status = member?.status || 'waiting';
      const detail = status === 'running' ? (member.activeTool || t('statusRunning')) : statusLabel(status, t);
      return h('button', {
        className: `awr-role ${role} ${status}${selected ? ' selected' : ''}`, onClick: onSelect,
        'aria-pressed': selected, title: `${t('filter')}: ${roleName(role, t)}`,
      },
        h('span', { className: 'awr-role-head' }, h('span', { className: 'awr-role-icon' }, icon(roleIcon(role))), h('span', { className: 'awr-role-name' }, roleName(role, t)), h('i', { className: 'awr-status-dot' })),
        h('span', { className: 'awr-role-metric' }, h('b', null, metric[0]), h('span', null, metric[1])),
        h('span', { className: 'awr-role-state' }, detail));
    }

    function Move({ entry, expanded, onToggle, version, onOpenVersion, t, locale }) {
      const isTool = entry.kind === 'tool';
      if (version) {
        return h('article', { className: `awr-move ${entry.role}` },
          h('span', { className: 'awr-move-marker' }, icon('pen')),
          h('div', { className: 'awr-move-card' },
            h('div', { className: 'awr-move-meta' }, h('span', { className: 'awr-move-role' }, roleName(entry.role, t)), h('span', { className: 'awr-move-version' }, `v${version.number}`), h('span', null, version.number === 1 ? t('draft') : t('revision')), h('time', { className: 'awr-move-time' }, clock(entry.time, locale))),
            h('button', { className: 'awr-move-open', onClick: () => onOpenVersion(version) }, t('openVersion'))));
      }
      const status = entry.status === 'running' ? t('toolRunning') : entry.status === 'error' ? t('toolError') : isTool ? t('toolDone') : '';
      const text = isTool ? entry.text : preview(entry.text);
      const activity = isTool && entry.status === 'done' ? '' : ` · ${status}`;
      return h('article', { className: `awr-move ${entry.role}` },
        h('span', { className: 'awr-move-marker' }, icon(isTool ? 'activity' : roleIcon(entry.role))),
        h('div', { className: `awr-move-card${expanded ? ' expanded' : ''}`, role: 'button', tabIndex: 0, 'aria-expanded': expanded, 'aria-label': expanded ? t('collapse') : t('expand'), onClick: onToggle, onKeyDown: event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onToggle(); } } },
          h('div', { className: 'awr-move-meta' }, h('span', { className: 'awr-move-role' }, roleName(entry.role, t)), h('span', null, isTool ? `${entry.toolName}${activity}` : t({ fact: 'stageFacts', draft: 'stageDraft', objection: 'stageAttack', verification: 'stageVerify' }[entry.kind] || 'process')), h('time', { className: 'awr-move-time' }, clock(entry.time, locale))),
          expanded && !isTool ? h('div', { style: { marginTop: 9 } }, h(Markdown, { text: entry.text })) : h('div', { className: `awr-move-text${isTool ? ' awr-tool-text' : ''}` }, text)));
    }

    function SourcesView({ sources, t }) {
      if (!sources.length) return h('div', { className: 'awr-placeholder' }, h('strong', null, t('sources')), t('noSources'));
      return h('div', { className: 'awr-source-list' }, sources.map(source => h('article', { className: `awr-source${source.reviewed ? ' reviewed' : ''}`, key: source.url },
        h('span', { className: 'awr-source-icon' }, icon(source.reviewed ? 'check' : 'link')),
        h('div', { className: 'awr-source-main' }, h('a', { className: 'awr-source-url', href: source.url, target: '_blank', rel: 'noreferrer', title: source.url }, source.url), h('div', { className: 'awr-source-meta' }, h('span', { className: `awr-source-tag${source.reviewed ? ' reviewed' : ''}` }, source.reviewed ? t('reviewed') : t('cited')), source.roles.map(role => h('span', { className: 'awr-source-tag', key: role }, roleName(role, t))))))));
    }

    function ArtifactPanel({ run, architect, allSources, selectedVersion, onVersion, tab, onTab, onCopy, copied, onDownload, showChanges, onToggleChanges, t }) {
      const versions = architect?.versions || EMPTY;
      const latest = versions[versions.length - 1];
      const selected = selectedVersion === 'latest' ? latest : versions.find(version => version.id === selectedVersion) || latest;
      const index = selected ? versions.findIndex(version => version.id === selected.id) : -1;
      const previous = index > 0 ? versions[index - 1].text : '';
      const final = versions.length >= 3 && selected?.id === latest?.id;
      return h('section', { className: 'awr-artifact', 'aria-label': t('artifact') },
        h('div', { className: 'awr-artifact-head' },
          h('div', { className: 'awr-artifact-title' }, icon('file'), t('artifact'), selected ? h('span', { className: `awr-artifact-badge${final ? ' final' : ''}` }, final ? t('final') : t('draft')) : null),
          h('div', { className: 'awr-artifact-actions' },
            h('div', { className: 'awr-tabs' }, h('button', { className: `awr-button${tab === 'artifact' ? ' active' : ''}`, onClick: () => onTab('artifact') }, t('artifact')), h('button', { className: `awr-button${tab === 'sources' ? ' active' : ''}`, onClick: () => onTab('sources') }, `${t('sources')} · ${allSources.length}`)),
            h('button', { className: 'awr-button', disabled: !selected || tab !== 'artifact', onClick: onCopy, title: t('copy') }, icon('copy'), copied ? t('copied') : t('copy')),
            h('button', { className: 'awr-button', disabled: !selected || tab !== 'artifact', onClick: () => onDownload(selected), title: t('download') }, icon('download')))),
        versions.length > 0 && tab === 'artifact' ? h('div', { className: 'awr-versions' }, h('span', { className: 'awr-version-label' }, t('version')), versions.map(version => h('button', { key: version.id, className: `awr-version${selected?.id === version.id ? ' active' : ''}`, onClick: () => onVersion(version.id === latest.id ? 'latest' : version.id) }, `v${version.number}`)), previous ? h('button', { className: `awr-change-key${showChanges ? ' on' : ''}`, 'aria-pressed': showChanges, onClick: onToggleChanges }, h('i', { className: 'awr-change-swatch' }), showChanges ? t('changesOn') : t('changesOff')) : null) : null,
        h('div', { className: 'awr-document' }, h('div', { className: 'awr-document-inner' },
          tab === 'sources' ? h(SourcesView, { sources: allSources, t })
            : selected ? h(Markdown, { text: selected.text, previous, annotate: !!previous && showChanges })
              : h('div', { className: 'awr-placeholder' }, h('span', { className: 'awr-brand' }, icon('file')), h('strong', null, t('noArtifactTitle')), t('noArtifactBody'), h('div', { className: 'awr-placeholder-question' }, h('b', null, `${t('question')}: `), run.question)))));
    }

    function mergeSources(members) {
      const map = new Map();
      for (const member of members) for (const source of member.sources || EMPTY) {
        const old = map.get(source.url);
        if (!old) map.set(source.url, { ...source, roles: [...source.roles] });
        else { old.reviewed = old.reviewed || source.reviewed; old.roles = [...new Set([...old.roles, ...source.roles])]; }
      }
      return [...map.values()].sort((a, b) => Number(b.reviewed) - Number(a.reviewed) || a.firstSeenAt - b.firstSeenAt);
    }

    function WarRoomContent({ sessionId, useSession, useSessions, useSessionStatus, sessions, t }) {
      const locale = t('locale');
      const leadId = useSession(snapshot => snapshot.subagent?.address.parentSessionId) ?? sessionId;
      const projectionsBySession = useSessions(state => state.projectionsBySession);
      const statuses = useSessionStatus(state => state);
      const rootView = projectionsBySession[leadId]?.values.agentWarRoom;
      const catalog = projectionsBySession[leadId]?.values.subagentCatalog;
      const [now, setNow] = React.useState(() => Date.now());
      const [filter, setFilter] = React.useState(null);
      const [expanded, setExpanded] = React.useState(null);
      const [selectedVersion, setSelectedVersion] = React.useState('latest');
      const [tab, setTab] = React.useState('artifact');
      const [copied, setCopied] = React.useState(false);
      const [showChanges, setShowChanges] = React.useState(false);
      const requestedRef = React.useRef({ leadId: null, ids: new Set() });
      const feedRef = React.useRef(null), followFeedRef = React.useRef(true);
      const runs = rootView?.runs || EMPTY;
      const run = runs[runs.length - 1];
      const members = React.useMemo(() => {
        if (!run || !Array.isArray(catalog)) return EMPTY;
        return catalog.map(entry => {
          const view = projectionsBySession[entry.id]?.values.agentWarRoom;
          return view?.runId === run.id && ROLES.includes(view.role) ? { ...view, id: entry.id, name: entry.name, catalogStatus: statuses.get(entry.id)?.running ? 'running' : view.status } : null;
        }).filter(Boolean);
      }, [run, catalog, projectionsBySession, statuses]);
      const runId = run?.id;

      React.useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
      React.useEffect(() => { setFilter(null); setExpanded(null); setSelectedVersion('latest'); setTab('artifact'); followFeedRef.current = true; }, [runId]);
      React.useEffect(() => { followFeedRef.current = true; }, [filter]);
      React.useEffect(() => {
        if (typeof sessions.refreshProjections !== 'function') return;
        let requested = requestedRef.current;
        if (requested.leadId !== leadId) { requested = { leadId, ids: new Set() }; requestedRef.current = requested; }
        const ids = [leadId, ...(Array.isArray(catalog) ? catalog.map(entry => entry.id) : [])].filter(id => !requested.ids.has(id) && !projectionsBySession[id]?.values.agentWarRoom);
        if (!ids.length) return;
        let cancelled = false;
        void (async () => { for (const id of ids) { if (cancelled) return; requested.ids.add(id); try { await sessions.refreshProjections(id); } catch (error) { console.error(`[agent-war-room] projection read failed for ${id}`, error); } } })();
        return () => { cancelled = true; };
      }, [leadId, catalog, projectionsBySession, sessions]);

      const architect = members.find(member => member.role === 'architect');
      const researcher = members.find(member => member.role === 'researcher');
      const skeptic = members.find(member => member.role === 'skeptic');
      const running = members.some(member => member.status === 'running' || member.catalogStatus === 'running');
      const failed = run?.status === 'error' || members.some(member => member.status === 'error');
      const final = (architect?.versions.length || 0) >= 3 && !running;
      const state = failed ? 'failed' : final ? 'complete' : running ? 'live' : 'waiting';
      const entries = members.flatMap(member => member.entries || EMPTY).sort((a, b) => a.time - b.time || a.id.localeCompare(b.id));
      const visible = filter ? entries.filter(entry => entry.role === filter) : entries;
      React.useLayoutEffect(() => {
        const feed = feedRef.current;
        if (feed && followFeedRef.current) feed.scrollTop = feed.scrollHeight;
      }, [visible.length, filter]);
      const sources = mergeSources(members);
      const currentArtifact = architect?.versions[architect.versions.length - 1];
      const finishedAt = final ? Math.max(run.startedAt, ...members.map(member => member.endedAt || 0)) : now;

      const copy = async () => { if (!currentArtifact) return; try { await navigator.clipboard.writeText(currentArtifact.text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* browser clipboard remains optional */ } };
      const download = version => {
        if (!version || typeof URL === 'undefined') return;
        const blob = new Blob([version.text], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = `war-room-${run.id.replace(/[^a-zA-Z0-9_-]/gu, '-')}-v${version.number}.md`;
        link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
      if (!run) return h(EmptyState, { t });
      const versionByEntry = new Map((architect?.versions || EMPTY).map(version => [version.id.replace(/^version-/u, 'message-'), version]));
      const reviewedCount = sources.filter(source => source.reviewed).length;
      const metrics = {
        researcher: [listItems(researcher?.lastText), t('facts')],
        architect: [architect?.versions.length || 0, t('versions')],
        skeptic: [listItems(skeptic?.lastText), t('objections')],
        verifier: [`${reviewedCount}/${sources.length}`, t('sourcesReviewed')],
      };
      const openVersion = version => { setTab('artifact'); setSelectedVersion(version.id === currentArtifact?.id ? 'latest' : version.id); };
      return h('div', { className: 'awr-app', 'data-conversation-composer-overlay': true },
        h('header', { className: 'awr-header' },
          h('div', { className: 'awr-heading' }, h('div', { className: 'awr-title-line' }, h('span', { className: 'awr-brand' }, icon('file')), h('span', { className: 'awr-title' }, t('title')), h('span', { className: `awr-live ${state === 'failed' ? 'error' : state === 'complete' ? 'complete' : state === 'waiting' ? 'idle' : ''}`, title: final ? t('finalHint') : t('subtitle') }, h('i', { className: 'awr-live-dot' }), t(state === 'failed' ? 'failed' : state === 'complete' ? 'complete' : state === 'live' ? 'live' : 'waiting'))), h('div', { className: 'awr-question', title: run.question }, run.question)),
          h(StagePipeline, { members, versions: architect?.versions || EMPTY, running, t }),
          h('span', { className: 'awr-elapsed', title: t('elapsed') }, duration(finishedAt - run.startedAt))),
        h('div', { className: 'awr-body' },
          h('section', { className: 'awr-process', 'aria-label': t('process') },
            h('div', { className: 'awr-roles' }, ROLES.map(role => h(RoleCard, { key: role, role, member: members.find(member => member.role === role), metric: metrics[role], selected: filter === role, onSelect: () => { setFilter(current => current === role ? null : role); setExpanded(null); }, t }))),
            h('div', { className: 'awr-feed' }, h('div', { className: 'awr-feed-head' }, icon('activity'), t('process'), filter ? h('button', { className: 'awr-feed-filter', onClick: () => setFilter(null), title: t('clearFilter') }, `${roleName(filter, t)} ×`) : null),
              h('div', { className: 'awr-feed-log', ref: feedRef, onScroll: event => { const node = event.currentTarget; followFeedRef.current = node.scrollHeight - node.scrollTop - node.clientHeight < 48; } }, visible.length ? visible.map(entry => h(Move, { key: `${entry.role}-${entry.id}`, entry, expanded: expanded === `${entry.role}-${entry.id}`, onToggle: () => setExpanded(current => current === `${entry.role}-${entry.id}` ? null : `${entry.role}-${entry.id}`), version: entry.role === 'architect' ? versionByEntry.get(entry.id) : undefined, onOpenVersion: openVersion, t, locale })) : h('div', { className: 'awr-feed-empty' }, t('noActivity'))))),
          h(ArtifactPanel, { run, architect, allSources: sources, selectedVersion, onVersion: setSelectedVersion, tab, onTab: setTab, onCopy: copy, copied, onDownload: download, showChanges, onToggleChanges: () => setShowChanges(value => !value), t })));
    }

    class ErrorBoundary extends React.Component {
      state = { error: null };
      static getDerivedStateFromError(error) { return { error }; }
      componentDidCatch(error, info) { console.error('[agent-war-room]', error, info.componentStack); }
      render() { return this.state.error ? h('div', { className: 'awr-empty', role: 'alert' }, h('div', { className: 'awr-empty-inner' }, h('h1', null, this.props.t('renderError')), h('p', null, String(this.state.error)), h('button', { className: 'awr-button', onClick: () => this.setState({ error: null }) }, this.props.t('retry')))) : this.props.children; }
    }
    function WarRoomView(props) { return h(ErrorBoundary, { t: props.t }, h(WarRoomContent, props)); }

    function apply(ctx) {
      if (typeof document !== 'undefined') {
        for (const stale of document.querySelectorAll('style[data-plugin="agent-war-room"],style[data-plugin-css^="agent-war-room/"]')) stale.remove();
        ctx.effect(() => () => {
          for (const stale of document.querySelectorAll('style[data-plugin="agent-war-room"],style[data-plugin-css^="agent-war-room/"]')) stale.remove();
        }, 'agent-war-room: stylesheet');
        const style = document.createElement('style'); style.dataset.plugin = 'agent-war-room'; style.dataset.pluginCss = 'agent-war-room/view.css'; style.textContent = CSS; document.head.appendChild(style);
      }
      ctx.effect(() => ctx.locale.register(NS, { en, ru }), 'agent-war-room: dictionaries');
      const t = ctx.locale.bind(NS);
      ctx.slots.inject('conversation.view', () => ctx.slots.register({
        name: 'conversation.view', id: 'agent-war-room', order: 15, locale: NS,
        label: () => t('view'), inject: () => ({ sessions: ctx.sessions }),
      }, WarRoomView));
    }
    return { apply, inject: ['slots', 'locale', 'sessions'] };
  },
});
