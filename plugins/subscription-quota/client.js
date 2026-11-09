window.__ModuleLoader__.load({
  id: '@local/subscription-quota',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { createPortal } = require('react-dom');
    const URL_PATH = 'api/subscription-quota';
    const PANEL_PATH = '/v0/resource/plugins/cpa-key-billing/ui#account/subscription';
    const errors = {
      'invalid-key': 'Введите корректный API-ключ без пробелов.',
      'invalid-endpoint': 'Введите HTTPS origin без пути, query и учётных данных в URL.',
      unauthorized: 'Ключ отклонён сервером. Проверьте API-ключ.',
      'rate-limited': 'Слишком много запросов. Повторите позже.',
      'upstream-unavailable': 'Сервис квот временно недоступен.',
      'invalid-response': 'Сервер вернул неизвестный формат квот.',
      timeout: 'Сервер не ответил за 15 секунд.',
      network: 'Нет соединения с сервером квот.',
      'credential-store': 'Не удалось прочитать или сохранить ключ в хранилище Harness.',
      forbidden: 'Harness отклонил запрос. Обновите страницу.',
    };
    const errorText = code => errors[code] || 'Не удалось обновить квоту. Повторите позже.';
    function number(value, metric, currency) {
      if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
      if (metric === 'amount' && currency) return new Intl.NumberFormat(undefined, {
        style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 2,
      }).format(value);
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, notation: value >= 100000 ? 'compact' : 'standard' }).format(value);
    }
    const balance = d => number(d.remaining, d.metric, d.currency) + ' / ' + number(d.limit, d.metric, d.currency);
    const metricName = metric => ({ amount: 'Сумма', requests: 'Запросы', tokens: 'Токены', total_tokens: 'Токены' })[metric] || metric;
    const when = value => value ? new Date(value).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
    function primary(quota) {
      return quota?.windows?.flatMap(w => w.dimensions).sort((a, b) =>
        Number(b.blocked) - Number(a.blocked) || (a.percent ?? Infinity) - (b.percent ?? Infinity))[0];
    }
    /** Twenty green strokes: bright = remaining quota, dim = spent. */
    function QuotaBars({ percent, unlimited = false }) {
      const known = unlimited || (typeof percent === 'number' && Number.isFinite(percent));
      const filled = unlimited ? 20 : known ? Math.round(Math.max(0, Math.min(100, percent)) / 5) : 0;
      return h('span', { className: 'sq-bars', 'aria-hidden': true, 'data-known': known },
        ...Array.from({ length: 20 }, (_, index) => h('span', {
          key: index, className: 'sq-bar', 'data-filled': index < filled,
        })));
    }
    async function call(method = 'GET', apiKey, force = false) {
      const response = await fetch(URL_PATH + (force ? '?refresh=1' : ''), {
        method, cache: 'no-store', credentials: 'same-origin',
        headers: { Accept: 'application/json', ...(method !== 'GET' ? { 'x-subscription-quota': '1', 'content-type': 'application/json' } : {}) },
        ...(apiKey !== undefined ? { body: JSON.stringify({ apiKey: apiKey.key, billingOrigin: apiKey.origin }) } : {}),
        signal: AbortSignal.timeout(20000),
      });
      const body = await response.json();
      if (!body || typeof body !== 'object') throw new Error('unavailable');
      return body;
    }
    const CSS = `
.sq-root{display:inline-flex;align-items:center;min-width:0;font:inherit;position:relative}
.sq-pill{display:inline-flex;align-items:center;gap:6px;max-width:300px;min-width:0;padding:5px 8px;border:0;border-radius:var(--dsw-radius-sm,8px);font:inherit;font-size:12px;color:var(--dsw-alias-label-secondary);background:transparent;cursor:pointer;white-space:nowrap}
.sq-pill:hover,.sq-action:hover{background:var(--dsw-alias-interactive-bg-hover)}
.sq-pill:focus-visible,.sq-action:focus-visible,.sq-key:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.sq-value{font-variant-numeric:tabular-nums}.sq-bars{display:inline-flex;align-items:center;gap:2px;flex:none;height:14px;margin-right:3px;color:var(--dsw-alias-state-success-primary,#27a577)}
.sq-bar{display:block;width:3px;height:12px;border-radius:1px;background:currentColor;opacity:.18}.sq-bar[data-filled=true]{opacity:1}
.sq-root[data-state=warn] .sq-bars{opacity:.6}.sq-root[data-state=error] .sq-value{color:var(--dsw-alias-state-error-primary,#d44)}
.sq-dialog{box-sizing:border-box;width:min(440px,calc(100vw - 32px));max-height:80vh;overflow:auto;border:1px solid var(--dsw-alias-border-l1);border-radius:16px;padding:22px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#111);box-shadow:0 12px 60px #0005;font:14px/1.5 var(--dsh-font-family-text-default,sans-serif)}
.sq-dialog::backdrop{background:#0006}.sq-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.sq-head h2{font-size:17px;margin:0}.sq-action{font:inherit;cursor:pointer;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:6px 10px;color:inherit;background:transparent}.sq-action:disabled{cursor:wait;opacity:.5}.sq-muted{font-size:12px;color:var(--dsw-alias-label-tertiary,#777)}
.sq-window{padding:12px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}.sq-line{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:5px 0}.sq-progress{width:100%;height:5px;accent-color:var(--dsw-alias-state-success-primary,#27a577)}
.sq-message{padding:9px 0;color:var(--dsw-alias-state-warn-primary,#9c6b00);font-size:13px}.sq-key{box-sizing:border-box;width:100%;margin:7px 0 10px;padding:9px 10px;border:1px solid var(--dsw-alias-border-l2,#999);border-radius:8px;color:inherit;background:var(--dsw-specific-input-major,transparent);font:inherit}.sq-form{margin-top:18px}.sq-actions{display:flex;gap:8px;flex-wrap:wrap}.sq-panel-link{color:var(--dsw-alias-link);text-decoration:none}.sq-foot{margin-top:14px}
@media(max-width:650px){.sq-pill{max-width:210px;font-size:11px;gap:4px}.sq-bars{gap:1px}.sq-bar{width:2px}.sq-value{min-width:0;overflow:hidden;text-overflow:ellipsis}}
`;
    function QuotaBadge() {
      const [body, setBody] = React.useState(null);
      const [busy, setBusy] = React.useState(false);
      const [open, setOpen] = React.useState(false);
      const [key, setKey] = React.useState('');
      const [origin, setOrigin] = React.useState('');
      const [message, setMessage] = React.useState('');
      const dialog = React.useRef(null);
      const serial = React.useRef(0);
      const alive = React.useRef(false);
      const mutating = React.useRef(false);
      const refresh = React.useCallback(async (force = false) => {
        if (mutating.current) return;
        const ticket = ++serial.current;
        try {
          const result = await call('GET', undefined, force);
          if (alive.current && ticket === serial.current) setBody(result);
        } catch {
          if (alive.current && ticket === serial.current) setBody(old => old?.quota
            ? { ...old, stale: true, error: 'network' }
            : { ok: false, error: 'network' });
        }
      }, []);
      React.useEffect(() => {
        alive.current = true;
        let timer;
        let stopped = false;
        async function tick() {
          if (document.visibilityState !== 'hidden') await refresh();
          if (!stopped) timer = setTimeout(tick, 60000);
        }
        const visible = () => { if (document.visibilityState === 'visible') void refresh(); };
        void tick();
        document.addEventListener('visibilitychange', visible);
        return () => { stopped = true; alive.current = false; serial.current++; clearTimeout(timer); document.removeEventListener('visibilitychange', visible); };
      }, [refresh]);
      React.useEffect(() => {
        if (open && dialog.current && !dialog.current.open) dialog.current.showModal();
      }, [open]);
      function close() { setOpen(false); setKey(''); setMessage(''); }
      function openSettings() { setOrigin(body?.billingOrigin ?? ''); setOpen(true); }
      async function change(method) {
        if (mutating.current) return;
        mutating.current = true; serial.current++; setBusy(true); setMessage('');
        try {
          const result = await call(method, method === 'POST' ? { key, origin } : undefined);
          if (!alive.current) return;
          if (!result.ok) { setMessage(errorText(result.error)); return; }
          setBody(result); setKey(''); setOrigin(result.billingOrigin ?? origin);
          setMessage(method === 'DELETE' ? 'Ключ удалён.' : 'Ключ сохранён. Квота обновлена.');
        } catch { if (alive.current) setMessage('Не удалось выполнить запрос к Harness.'); }
        finally { mutating.current = false; if (alive.current) setBusy(false); }
      }
      const quota = body?.quota;
      const d = primary(quota);
      const state = body?.stale || body?.error ? 'warn' : quota?.blocked || d?.blocked ? 'error' : 'ready';
      const value = !body ? '…' : !body.configured && body.ok ? 'Настроить' : !quota ? 'Недоступно' : quota.unlimited ? '∞' : d ? balance(d) : '—';
      const resetHints = (quota?.windows ?? []).map(window =>
        (quota.windows.length > 1 ? window.name + ' — ' : '') +
        (window.started ? 'Лимиты обновятся: ' + when(window.endAt) : 'Период ещё не начался'));
      const title = ['Subscription quota', quota?.name, d ? 'Осталось: ' + balance(d) : '', ...resetHints, body?.stale ? 'Данные устарели' : '', body?.error ? errorText(body.error) : '', 'Нажмите для подробностей и настройки API-ключа'].filter(Boolean).join('\n');
      return h('span', { className: 'sq-root', 'data-subscription-quota': true, 'data-state': state },
        h('button', { type: 'button', className: 'sq-pill', title, 'aria-label': title, 'aria-haspopup': 'dialog', onClick: openSettings },
          h(QuotaBars, { percent: d?.percent, unlimited: quota?.unlimited === true }),
          h('span', { className: 'sq-value' }, value)),
        open && createPortal(h('dialog', { ref: dialog, className: 'sq-dialog', 'aria-label': 'Subscription quota', onCancel: event => { event.preventDefault(); close(); }, onClose: close },
          h('div', { className: 'sq-head' }, h('h2', null, 'Subscription quota'), h('button', { type: 'button', className: 'sq-action', 'aria-label': 'Закрыть', onClick: close }, '×')),
          !body && h('p', null, 'Загрузка…'),
          body?.error && h('div', { className: 'sq-message', role: 'status' }, (body.stale ? 'Показаны последние данные. ' : '') + errorText(body.error)),
          quota && h('div', null,
            h('strong', null, quota.name || 'Подписка'),
            h('span', { className: 'sq-muted' }, quota.unlimited ? ' · Без лимита' : quota.blocked ? ' · Квота исчерпана' : ' · Активна'),
            quota.shared && h('div', { className: 'sq-muted' }, 'Общая квота подписки'),
            ...quota.windows.map((window, wi) => h('div', { className: 'sq-window', key: wi },
              h('strong', null, window.name),
              ...window.dimensions.map((dimension, di) => h('div', { key: di },
                h('div', { className: 'sq-line' }, h('span', null, metricName(dimension.metric)), h('b', { className: 'sq-value' }, balance(dimension))),
                dimension.percent !== null && h('progress', { className: 'sq-progress', max: 100, value: dimension.percent, 'aria-label': 'Остаток: ' + metricName(dimension.metric) }),
                h('div', { className: 'sq-muted' }, 'Использовано: ' + number(dimension.used, dimension.metric, dimension.currency)))),
              h('div', { className: 'sq-muted' }, window.started
                ? h(React.Fragment, null, 'Лимиты обновятся: ', h('strong', {
                    style: { color: 'var(--dsw-alias-label-primary)' },
                  }, h('time', { dateTime: window.endAt || undefined }, when(window.endAt))))
                : 'Период ещё не начался'))),
            h('div', { className: 'sq-line sq-muted' }, 'Параллельные запросы', (quota.concurrency.current ?? '—') + ' / ' + (quota.concurrency.limit > 0 ? quota.concurrency.limit : '∞')),
            h('div', { className: 'sq-muted' }, 'Проверено: ' + when(body.fetchedAt))),
          h('div', { className: 'sq-actions sq-foot' },
            h('button', { type: 'button', className: 'sq-action', disabled: busy, onClick: async () => { setBusy(true); await refresh(true); if (alive.current) setBusy(false); } }, 'Обновить'),
            body?.billingOrigin && h('a', { className: 'sq-panel-link', href: body.billingOrigin + PANEL_PATH, target: '_blank', rel: 'noopener noreferrer' }, 'Панель статистики ↗')),
          h('form', { className: 'sq-form', onSubmit: event => { event.preventDefault(); void change('POST'); } },
            h('label', null, 'Billing origin (HTTPS)',
              h('input', { className: 'sq-key', type: 'url', value: origin, onChange: event => setOrigin(event.target.value), placeholder: 'https://billing.example.com', autoComplete: 'url', spellCheck: false, maxLength: 2048, disabled: busy, required: true, 'aria-label': 'Billing origin (HTTPS)' })),
            h('label', null, body?.configured ? 'Заменить API-ключ' : 'API-ключ CLIProxyAPI',
              h('input', { className: 'sq-key', type: 'password', value: key, onChange: event => setKey(event.target.value), placeholder: 'sk-…', autoComplete: 'off', spellCheck: false, maxLength: 1024, disabled: busy, 'aria-label': 'API-ключ CLIProxyAPI' })),
            h('div', { className: 'sq-actions' },
              h('button', { className: 'sq-action', type: 'submit', disabled: busy || !key.trim() || !origin.trim() }, busy ? 'Подождите…' : 'Сохранить и проверить'),
              body?.configured && h('button', { className: 'sq-action', type: 'button', disabled: busy, onClick: () => { if (window.confirm('Удалить API-ключ из плагина Subscription quota?')) void change('DELETE'); } }, 'Удалить ключ')),
            h('p', { className: 'sq-muted' }, 'Ключ отправляется только на указанный вами HTTPS origin. Адрес сохраняется локально в Harness; значения по умолчанию нет. Ключ хранится в штатном хранилище учётных данных и не сохраняется в браузере.')),
          message && h('div', { className: 'sq-message', role: 'status' }, message)), document.body));
    }
    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement('style');
          style.dataset.plugin = 'subscription-quota'; style.textContent = CSS; document.head.append(style);
          return () => style.remove();
        });
        ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
          name: 'conversation.input.right', id: 'subscription-quota', order: 100,
        }, QuotaBadge));
      },
    };
  },
});
