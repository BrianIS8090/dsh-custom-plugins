window.__ModuleLoader__.load({
  id: '@local/codex-image',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useMemo, useRef, useCallback, useSyncExternalStore } = React;

    const PKG = '@local/codex-image';
    const ENTRY = 'codex-image';
    const NS = 'codexImage';
    const TOOLS = ['gpt_image_generate', 'gpt_image_edit'];

    const DEFAULTS = {
      baseURL: '', apiKeyEnv: 'CODEX_IMAGE_API_KEY', model: 'gpt-image-2.5', editModel: '',
      size: 'auto', aspectHint: true, quality: 'auto', background: 'auto', outputFormat: 'png', outputCompression: 100,
      moderation: 'auto', count: 1, stylePrompt: '', timeoutSeconds: 240, saveToWorkspace: true, workspaceFolder: 'generated-images',
    };
    const FIELDS = Object.keys(DEFAULTS);
    const SIZES = ['auto', '1024x1024', '1536x1024', '1024x1536', '1536x864', '864x1536', '2048x2048'];

    const ru = {
      summary: 'Генерация и редактирование изображений моделью gpt-image (Codex) через CLIProxyAPI.',
      intro: 'Агент получает инструменты gpt_image_generate и gpt_image_edit. Здесь — подключение к ретранслятору и параметры генерации по умолчанию; агент может переопределить размер, качество, фон, формат и количество в отдельном вызове.',
      unavailable: 'Плагин не загружен на сервере Harness — настройки сейчас недоступны.',
      loading: 'Загрузка настроек…',
      readOnly: 'Настройки этого профиля доступны только для чтения.',
      sectionConnection: 'Подключение',
      sectionModel: 'Модель',
      sectionGeneration: 'Параметры генерации',
      sectionOutput: 'Сохранение и ожидание',
      sectionTest: 'Проверка',
      baseURL: 'Адрес API (base URL)',
      baseURLHint: 'Укажите адрес своего доверенного OpenAI-совместимого API вместе с /v1. Пока поле пустое, запросы к API не выполняются.',
      keyLabel: 'API-ключ',
      apiKeyHint: 'Хранится в хранилище учётных данных Harness, не в файле настроек. Оставьте пустым, чтобы сохранить текущий ключ.',
      apiKeySet: 'Ключ сохранён',
      apiKeyUnset: 'Ключ не задан — генерация не заработает',
      apiKeyEnv: 'Имя ссылки на ключ',
      apiKeyEnvHint: 'Имя ссылки в хранилище учётных данных. По умолчанию используется отдельная ссылка CODEX_IMAGE_API_KEY.',
      model: 'Модель генерации',
      modelHint: 'По умолчанию gpt-image-2.5. Список подтягивается кнопкой «Проверить подключение».',
      editModel: 'Модель редактирования',
      editModelHint: 'Пусто — та же, что для генерации.',
      size: 'Размер',
      sizeHint: 'Codex-ретранслятор воспринимает размер как пожелание; для надёжного формата включите подсказку в промпте.',
      sizeCustom: 'Свой размер…',
      sizeCustomPlaceholder: 'например 1792x1024',
      sizeLabels: { auto: 'Авто', '1024x1024': '1024×1024 · квадрат', '1536x1024': '1536×1024 · альбомная 3:2', '1024x1536': '1024×1536 · портретная 2:3', '1536x864': '1536×864 · широкая 16:9', '864x1536': '864×1536 · вертикальная 9:16', '2048x2048': '2048×2048 · большой квадрат' },
      aspectHint: 'Подсказывать формат в промпте',
      aspectHintHint: 'Добавляет к промпту фразу о соотношении сторон — так модель надёжнее соблюдает выбранный размер.',
      quality: 'Качество',
      qualityLabels: { auto: 'Авто', low: 'Низкое', medium: 'Среднее', high: 'Высокое' },
      background: 'Фон',
      backgroundLabels: { auto: 'Авто', opaque: 'Сплошной', transparent: 'Прозрачный' },
      outputFormat: 'Формат файла',
      outputFormatHint: 'Ретранслятор может вернуть PNG вместо запрошенного формата — плагин сохраняет то, что пришло.',
      outputCompression: 'Сжатие JPEG/WebP',
      moderation: 'Модерация',
      moderationLabels: { auto: 'Стандартная', low: 'Мягкая' },
      count: 'Вариантов за вызов',
      countHint: 'Каждый вариант — отдельный параллельный запрос (ретранслятор отдаёт одно изображение на запрос).',
      stylePrompt: 'Стиль по умолчанию',
      stylePromptHint: 'Текст, который добавляется к каждому промпту. Например: «минимализм, мягкий свет, пастельная палитра».',
      stylePromptPlaceholder: 'Пусто — без добавки',
      saveToWorkspace: 'Сохранять файлы в рабочую папку',
      saveToWorkspaceHint: 'Оригиналы кладутся в папку сессии; в чате изображение показывается в любом случае.',
      workspaceFolder: 'Папка',
      workspaceFolderHint: 'Путь относительно рабочей папки сессии.',
      timeoutSeconds: 'Таймаут запроса, секунд',
      timeoutSecondsHint: 'Генерация обычно занимает 10–60 секунд, высокое качество — дольше.',
      check: 'Проверить подключение',
      checking: 'Проверяю…',
      checkOk: 'Подключение работает · {ms} мс · моделей: {count}',
      checkModelOk: 'Модель {model} доступна.',
      checkModelMissing: 'Модели {model} нет в списке ретранслятора.',
      checkImageModels: 'Модели изображений: {list}',
      checkUsesSaved: 'Проверка использует сохранённый адрес, ключ и модель.',
      test: 'Сгенерировать пробное изображение',
      testing: 'Генерирую…',
      testPrompt: 'Промпт для проверки',
      testPromptPlaceholder: 'A small cozy lighthouse on a rocky shore at sunset, soft flat illustration',
      testHint: 'Тратит одну генерацию и использует сохранённые настройки.',
      testResult: '{model} · {width}×{height} · {kb} КБ · {seconds} с',
      save: 'Сохранить',
      saving: 'Сохраняю…',
      discard: 'Отменить',
      saved: 'Сохранено.',
      saveFailed: 'Harness не принял значения — проверьте поля и повторите.',
      keyFailed: 'Не удалось сохранить ключ: {message}',
      resetAll: 'Сбросить всё по умолчанию',
      resetAllConfirm: 'Вернуть все параметры к значениям по умолчанию? Ключ не удаляется.',
      reset: 'По умолчанию',
      overridden: 'изменено',
      invalidURL: 'Нужен абсолютный адрес http(s), без логина, пароля, запроса и фрагмента',
      invalidSize: 'Размер: «auto» или ШИРИНАxВЫСОТА, стороны 256–3840 и кратны 16, соотношение не больше 3:1',
      invalidRef: 'Имя ссылки — как переменная окружения: латиница, цифры, _',
      invalidFolder: 'Папка должна быть относительным путём внутри рабочей папки',
      cardGenerate: 'Генерация изображения',
      cardEdit: 'Редактирование изображения',
      cardRunning: 'рисую…',
      cardFailed: 'ошибка',
      cardOpen: 'Показать в полном размере',
      cardCollapse: 'Свернуть',
      cardFile: 'Открыть файл',
      cardPartial: 'Часть запросов не удалась: {list}',
      cardImages: '{count} изобр.',
    };
    const en = {
      summary: 'Generate and edit images with gpt-image (Codex) through CLIProxyAPI.',
      intro: 'The agent gets the gpt_image_generate and gpt_image_edit tools. Configure the relay connection and default generation parameters here; the agent may override size, quality, background, format and count per call.',
      unavailable: 'The plugin is not loaded on the Harness host, so settings are unavailable.',
      loading: 'Loading settings…',
      readOnly: 'This profile stores settings read-only.',
      sectionConnection: 'Connection',
      sectionModel: 'Model',
      sectionGeneration: 'Generation parameters',
      sectionOutput: 'Saving and waiting',
      sectionTest: 'Check',
      baseURL: 'API base URL',
      baseURLHint: 'Enter your own trusted OpenAI-compatible API address including /v1. No relay requests are made while this is blank.',
      keyLabel: 'API key',
      apiKeyHint: 'Stored in the Harness credential store, not in the settings file. Leave blank to keep the current key.',
      apiKeySet: 'A key is stored',
      apiKeyUnset: 'No key — generation will fail',
      apiKeyEnv: 'Key reference name',
      apiKeyEnvHint: 'Credential store reference. The default is a dedicated CODEX_IMAGE_API_KEY reference.',
      model: 'Generation model',
      modelHint: 'gpt-image-2.5 by default. “Check connection” loads the relay model list.',
      editModel: 'Editing model',
      editModelHint: 'Empty uses the generation model.',
      size: 'Size',
      sizeHint: 'The Codex relay treats size as a suggestion; enable the prompt hint for a reliable frame.',
      sizeCustom: 'Custom size…',
      sizeCustomPlaceholder: 'e.g. 1792x1024',
      sizeLabels: { auto: 'Auto', '1024x1024': '1024×1024 · square', '1536x1024': '1536×1024 · landscape 3:2', '1024x1536': '1024×1536 · portrait 2:3', '1536x864': '1536×864 · wide 16:9', '864x1536': '864×1536 · tall 9:16', '2048x2048': '2048×2048 · large square' },
      aspectHint: 'Describe the frame in the prompt',
      aspectHintHint: 'Appends the aspect ratio to the prompt so the model keeps the chosen size more reliably.',
      quality: 'Quality',
      qualityLabels: { auto: 'Auto', low: 'Low', medium: 'Medium', high: 'High' },
      background: 'Background',
      backgroundLabels: { auto: 'Auto', opaque: 'Opaque', transparent: 'Transparent' },
      outputFormat: 'File format',
      outputFormatHint: 'The relay may return PNG instead of the requested format; the plugin keeps what arrives.',
      outputCompression: 'JPEG/WebP compression',
      moderation: 'Moderation',
      moderationLabels: { auto: 'Standard', low: 'Low' },
      count: 'Variants per call',
      countHint: 'Each variant is a separate parallel request (the relay returns one image per request).',
      stylePrompt: 'Default style',
      stylePromptHint: 'Text appended to every prompt, e.g. “minimalism, soft light, pastel palette”.',
      stylePromptPlaceholder: 'Empty adds nothing',
      saveToWorkspace: 'Save files to the workspace',
      saveToWorkspaceHint: 'Originals go to the session folder; the chat shows the image either way.',
      workspaceFolder: 'Folder',
      workspaceFolderHint: 'Path relative to the session workspace.',
      timeoutSeconds: 'Request timeout, seconds',
      timeoutSecondsHint: 'Generation usually takes 10–60 seconds, high quality longer.',
      check: 'Check connection',
      checking: 'Checking…',
      checkOk: 'Connection works · {ms} ms · {count} models',
      checkModelOk: 'Model {model} is available.',
      checkModelMissing: 'Model {model} is not in the relay list.',
      checkImageModels: 'Image models: {list}',
      checkUsesSaved: 'The check uses the saved URL, key and model.',
      test: 'Generate a test image',
      testing: 'Generating…',
      testPrompt: 'Test prompt',
      testPromptPlaceholder: 'A small cozy lighthouse on a rocky shore at sunset, soft flat illustration',
      testHint: 'Spends one generation and uses the saved settings.',
      testResult: '{model} · {width}×{height} · {kb} KB · {seconds} s',
      save: 'Save',
      saving: 'Saving…',
      discard: 'Discard',
      saved: 'Saved.',
      saveFailed: 'Harness did not accept these values; check the fields and retry.',
      keyFailed: 'The key was not saved: {message}',
      resetAll: 'Reset everything to defaults',
      resetAllConfirm: 'Reset every parameter to its default? The key is kept.',
      reset: 'Default',
      overridden: 'changed',
      invalidURL: 'Enter an absolute http(s) URL without credentials, a query or a fragment',
      invalidSize: 'Size: “auto” or WIDTHxHEIGHT, edges 256–3840 in steps of 16, ratio up to 3:1',
      invalidRef: 'Reference names look like environment variables: letters, digits, _',
      invalidFolder: 'The folder must be a relative path inside the workspace',
      cardGenerate: 'Image generation',
      cardEdit: 'Image edit',
      cardRunning: 'drawing…',
      cardFailed: 'failed',
      cardOpen: 'Show full size',
      cardCollapse: 'Collapse',
      cardFile: 'Open file',
      cardPartial: 'Some requests failed: {list}',
      cardImages: '{count} image(s)',
    };
    const DICTS = { ru, en };

    const CSS = `
.cxi-page{display:flex;flex-direction:column;gap:18px;max-width:760px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}
.cxi-intro{margin:0;color:var(--dsw-alias-label-secondary)}
.cxi-section{display:flex;flex-direction:column;gap:12px;padding:14px 16px;border:.5px solid var(--dsw-alias-settings-card-stroke,var(--dsw-alias-border-l2));border-radius:var(--dsw-radius-lg,12px);background:var(--dsw-alias-settings-card-fill,transparent)}
.cxi-section h3{margin:0;font-size:14px;font-weight:600;line-height:22px}
.cxi-field{display:flex;flex-direction:column;gap:6px;min-width:0}
.cxi-label{display:flex;align-items:center;gap:8px;font-weight:500}
.cxi-badge{font-size:11px;font-weight:400;color:var(--dsw-alias-label-tertiary)}
.cxi-reset{margin-left:auto;padding:0 6px;border:0;background:transparent;color:var(--dsw-alias-label-tertiary);font:inherit;font-size:12px;cursor:pointer;border-radius:var(--dsw-radius-sm,6px)}
.cxi-reset:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.cxi-hint{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.cxi-error{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-state-error-primary)}
.cxi-ok{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-state-success-primary)}
.cxi-input,.cxi-select,.cxi-textarea{box-sizing:border-box;width:100%;min-width:0;padding:7px 10px;border:.5px solid var(--dsw-alias-border-l3,var(--dsw-alias-border-l2));border-radius:var(--dsw-radius-md,8px);background:transparent;color:inherit;font:inherit}
.cxi-textarea{min-height:64px;resize:vertical}
.cxi-input:focus-visible,.cxi-select:focus-visible,.cxi-textarea:focus-visible,.cxi-seg button:focus-visible,.cxi-btn:focus-visible,.cxi-switch:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:1px}
.cxi-input[aria-invalid=true]{border-color:var(--dsw-alias-state-error-primary)}
.cxi-select option{background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary)}
.cxi-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
.cxi-seg{display:inline-flex;flex-wrap:wrap;gap:2px;padding:2px;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-3,rgba(127,127,127,.12));width:fit-content}
.cxi-seg button{padding:4px 12px;border:0;border-radius:calc(var(--dsw-radius-md,8px) - 2px);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer}
.cxi-seg button[aria-pressed=true]{background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary);box-shadow:0 0 0 .5px var(--dsw-alias-border-l2)}
.cxi-seg button:disabled{cursor:default;opacity:.6}
.cxi-toggle{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.cxi-switch{position:relative;flex:none;width:36px;height:20px;margin-top:1px;border:0;border-radius:10px;background:var(--dsw-alias-border-l4,rgba(127,127,127,.4));cursor:pointer;transition:background .15s}
.cxi-switch[aria-checked=true]{background:var(--dsw-alias-state-business-primary,#3b82f6)}
.cxi-switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .15s;box-shadow:0 1px 2px rgba(0,0,0,.25)}
.cxi-switch[aria-checked=true]::after{transform:translateX(16px)}
.cxi-switch:disabled{cursor:default;opacity:.6}
.cxi-range{display:flex;align-items:center;gap:10px}.cxi-range input{flex:1}
.cxi-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.cxi-btn{padding:6px 14px;border:.5px solid var(--dsw-alias-border-l3,var(--dsw-alias-border-l2));border-radius:var(--dsw-radius-md,8px);background:transparent;color:inherit;font:inherit;cursor:pointer}
.cxi-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.cxi-btn:disabled{cursor:default;opacity:.55}
.cxi-btn[data-primary=true]{border-color:transparent;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-state-business-primary));color:var(--dsw-alias-label-primary-foreground,#fff)}
.cxi-btn[data-primary=true]:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover,var(--dsw-alias-button-primary-fill))}
.cxi-btn[data-danger=true]{color:var(--dsw-alias-state-error-primary)}
.cxi-footer{position:sticky;bottom:0;display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:10px 0;background:var(--dsw-alias-bg-base,transparent)}
.cxi-spacer{flex:1}
.cxi-preview{max-width:100%;max-height:420px;border-radius:var(--dsw-radius-md,8px);border:.5px solid var(--dsw-alias-border-l2);object-fit:contain;background:repeating-conic-gradient(rgba(127,127,127,.12) 0 25%,transparent 0 50%) 0 0/16px 16px}
.cxi-card{display:flex;flex-direction:column;gap:8px;padding:2px 0}
.cxi-card-head{display:flex;align-items:center;gap:8px;min-width:0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}
.cxi-card-title{flex:none;color:var(--dsw-alias-label-primary);font-weight:500}
.cxi-card-prompt{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary)}
.cxi-card-state{flex:none;font-size:12px;color:var(--dsw-alias-label-tertiary)}
.cxi-card-state[data-error=true]{color:var(--dsw-alias-state-error-primary)}
.cxi-dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--dsw-alias-state-business-primary,#3b82f6);animation:cxi-pulse 1.1s ease-in-out infinite}
@keyframes cxi-pulse{0%,100%{opacity:.35}50%{opacity:1}}
@media(prefers-reduced-motion:reduce){.cxi-dot{animation:none}}
.cxi-gallery{display:flex;flex-wrap:wrap;gap:8px}
.cxi-tile{position:relative;display:flex;flex-direction:column;gap:4px;max-width:min(100%,420px)}
.cxi-tile img{display:block;max-width:100%;max-height:420px;border-radius:var(--dsw-radius-md,8px);border:.5px solid var(--dsw-alias-border-l2);cursor:zoom-in;object-fit:contain;background:repeating-conic-gradient(rgba(127,127,127,.12) 0 25%,transparent 0 50%) 0 0/16px 16px}
.cxi-tile[data-expanded=true]{max-width:100%}
.cxi-tile[data-expanded=true] img{max-height:none;cursor:zoom-out}
.cxi-tile img:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}
.cxi-tile-skeleton{width:280px;height:186px;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-skeleton,rgba(127,127,127,.15))}
.cxi-tile-meta{display:flex;gap:10px;font-size:12px;color:var(--dsw-alias-label-tertiary)}
.cxi-link{padding:0;border:0;background:none;color:var(--dsw-alias-link,var(--dsw-alias-state-business-primary));font:inherit;font-size:12px;cursor:pointer}
.cxi-card-error{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-state-error-primary);white-space:pre-wrap;overflow-wrap:anywhere}
`;
    const Style = () => h('style', { 'data-plugin-css': PKG }, CSS);

    // ------------------------------------------------------------------ helpers
    function makeT(lang) {
      const dict = DICTS[lang] ?? en;
      return (key, params) => {
        let text = dict[key] ?? en[key] ?? key;
        if (typeof text === 'string' && params) text = text.replace(/\{(\w+)\}/g, (m, name) => (name in params ? String(params[name]) : m));
        return text;
      };
    }
    function useLang(locale) {
      const read = useCallback(() => {
        try { return locale?.getSnapshot?.()?.active ?? navigator.language ?? 'en'; } catch { return 'en'; }
      }, [locale]);
      const subscribe = useCallback((listener) => {
        try { return locale?.subscribe?.(listener) ?? (() => {}); } catch { return () => {}; }
      }, [locale]);
      const active = useSyncExternalStore(subscribe, read, read);
      return String(active).toLowerCase().startsWith('ru') ? 'ru' : 'en';
    }
    function validSize(value) {
      const text = String(value ?? '').trim().toLowerCase().replace(/[×*х]/g, 'x').replace(/\s+/g, '');
      if (text === '' || text === 'auto') return 'auto';
      const m = /^(\d{3,4})x(\d{3,4})$/.exec(text);
      if (!m) return undefined;
      const w = Number(m[1]); const hgt = Number(m[2]);
      if (w < 256 || hgt < 256 || w > 3840 || hgt > 3840 || w % 16 || hgt % 16) return undefined;
      if (Math.max(w, hgt) / Math.min(w, hgt) > 3) return undefined;
      return `${w}x${hgt}`;
    }
    function validURL(value) {
      const text = String(value ?? '').trim();
      if (!/^https?:\/\//i.test(text)) return false;
      try {
        const url = new URL(text);
        return !url.username && !url.password && !/[?#]/.test(url.href);
      } catch { return false; }
    }
    const validRef = (value) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(String(value ?? '').trim());
    function validFolder(value) {
      const folder = String(value ?? '').trim().replace(/\\/g, '/');
      if (folder === '') return true;
      return !/^[A-Za-z]:/.test(folder) && !folder.startsWith('/') && !folder.split('/').some((part) => part === '..');
    }
    async function post(path, body) {
      const response = await fetch(path, {
        method: 'POST', cache: 'no-store', credentials: 'same-origin',
        headers: { Accept: 'application/json', 'content-type': 'application/json', 'x-codex-image': '1' },
        body: JSON.stringify(body ?? {}),
      });
      let json;
      try { json = await response.json(); } catch { json = { ok: false, message: `HTTP ${response.status}` }; }
      return json ?? { ok: false };
    }
    const sameValue = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    // ------------------------------------------------------------- form state
    const unavailableForm = {
      getSnapshot: () => ({ status: 'unavailable', value: undefined, base: undefined, user: undefined, writable: false }),
      subscribe: () => () => {},
      mutate: async () => false,
    };

    function useForm(form) {
      const subscribe = useCallback((listener) => form.subscribe(listener), [form]);
      const read = useCallback(() => form.getSnapshot(), [form]);
      return useSyncExternalStore(subscribe, read, read);
    }

    function Field({ label, hint, error, overridden, onReset, t, children, id }) {
      return h('div', { className: 'cxi-field' },
        h('label', { className: 'cxi-label', htmlFor: id }, label,
          overridden ? h('span', { className: 'cxi-badge' }, t('overridden')) : null,
          overridden && onReset ? h('button', { type: 'button', className: 'cxi-reset', onClick: onReset }, t('reset')) : null),
        children,
        error ? h('p', { className: 'cxi-error', role: 'alert' }, error) : hint ? h('p', { className: 'cxi-hint' }, hint) : null);
    }
    function Segmented({ value, options, labels, onChange, disabled, label }) {
      return h('div', { className: 'cxi-seg', role: 'group', 'aria-label': label },
        options.map((option) => h('button', {
          key: option, type: 'button', 'aria-pressed': value === option, disabled,
          onClick: () => onChange(option),
        }, labels?.[option] ?? option)));
    }
    function Switch({ checked, onChange, disabled, label }) {
      return h('button', {
        type: 'button', role: 'switch', className: 'cxi-switch', 'aria-checked': checked === true, 'aria-label': label, disabled,
        onClick: () => onChange(!checked),
      });
    }
    function Toggle({ label, hint, checked, onChange, disabled }) {
      return h('div', { className: 'cxi-toggle' },
        h('div', { className: 'cxi-field' }, h('span', { className: 'cxi-label' }, label), hint ? h('p', { className: 'cxi-hint' }, hint) : null),
        h(Switch, { checked, onChange, disabled, label }));
    }

    function SettingsPage({ services, view }) {
      const lang = useLang(services.locale);
      const t = useMemo(() => makeT(lang), [lang]);
      const form = services.form();
      const snap = useForm(form);
      const [draft, setDraft] = useState({});
      const [keyDraft, setKeyDraft] = useState('');
      const [credential, setCredential] = useState({ configured: undefined, writable: true });
      const [saving, setSaving] = useState(false);
      const [message, setMessage] = useState(null);
      const [check, setCheck] = useState(null);
      const [checking, setChecking] = useState(false);
      const [models, setModels] = useState([]);
      const [test, setTest] = useState(null);
      const [testing, setTesting] = useState(false);
      const [testPrompt, setTestPrompt] = useState('');
      const [customSize, setCustomSize] = useState(false);
      const alive = useRef(true);
      useEffect(() => () => { alive.current = false; }, []);

      const stored = snap.value ?? {};
      const base = snap.base ?? {};
      const user = snap.user ?? {};
      const value = (field) => (field in draft ? draft[field] : stored[field] !== undefined ? stored[field] : DEFAULTS[field]);
      const inherited = (field) => (base[field] !== undefined ? base[field] : DEFAULTS[field]);
      const isOverridden = (field) => !sameValue(value(field), inherited(field));
      const edit = (field, next) => {
        setMessage(null);
        setDraft((previous) => {
          const copy = { ...previous };
          const saved = stored[field] !== undefined ? stored[field] : DEFAULTS[field];
          if (sameValue(next, saved)) delete copy[field]; else copy[field] = next;
          return copy;
        });
      };
      const resetField = (field) => edit(field, inherited(field));
      const keyRef = String(value('apiKeyEnv') || DEFAULTS.apiKeyEnv).trim();

      const readCredential = useCallback(async (ref) => {
        const credentials = services.credentials();
        if (!credentials || !validRef(ref)) { setCredential({ configured: undefined, writable: false }); return; }
        try {
          const response = await credentials.describe([ref]);
          if (!alive.current || !response?.ok) return;
          const info = response.value?.[ref];
          setCredential({ configured: info?.configured === true, writable: info?.writable !== false });
        } catch { if (alive.current) setCredential({ configured: undefined, writable: true }); }
      }, [services]);
      const savedRef = String(stored.apiKeyEnv || DEFAULTS.apiKeyEnv).trim();
      useEffect(() => { readCredential(savedRef); }, [readCredential, savedRef]);
      useEffect(() => services.onCredentialChange((ref) => { if (ref === savedRef) readCredential(savedRef); }), [services, readCredential, savedRef]);

      const relayURL = String(value('baseURL') ?? '').trim();
      const savedRelayConfigured = validURL(stored.baseURL);
      const errors = {
        baseURL: !relayURL || validURL(relayURL) ? null : t('invalidURL'),
        size: validSize(value('size')) ? null : t('invalidSize'),
        apiKeyEnv: validRef(value('apiKeyEnv')) ? null : t('invalidRef'),
        workspaceFolder: validFolder(value('workspaceFolder')) ? null : t('invalidFolder'),
      };
      const invalid = Object.values(errors).some(Boolean);
      const dirty = Object.keys(draft).length > 0 || keyDraft.trim().length > 0;
      const status = snap.status;
      const writable = snap.writable !== false && status === 'ready';
      const disabled = !writable || saving;

      if (view === 'summary') return t('summary');

      const save = async () => {
        if (invalid || saving) return;
        setSaving(true);
        setMessage(null);
        try {
          const ops = [];
          for (const [field, next] of Object.entries(draft)) {
            let normalized = next;
            if (field === 'size') normalized = validSize(next);
            if (typeof normalized === 'string' && field !== 'stylePrompt') normalized = normalized.trim();
            if (field === 'baseURL') normalized = normalized.replace(/\/+$/, '');
            // A value equal to the inherited default clears the override instead of pinning a copy.
            if (sameValue(normalized, inherited(field))) {
              if (field in user) ops.push({ op: 'unset', path: [field] });
            } else ops.push({ op: 'set', path: [field], value: normalized });
          }
          if (ops.length > 0) {
            const accepted = await form.mutate(ops, snap.revision);
            if (!accepted) { if (alive.current) setMessage({ error: true, text: t('saveFailed') }); return; }
          }
          if (alive.current) setDraft({});
          const key = keyDraft.trim();
          if (key) {
            const credentials = services.credentials();
            const ref = String((draft.apiKeyEnv ?? stored.apiKeyEnv ?? DEFAULTS.apiKeyEnv)).trim();
            try {
              const result = await credentials?.set(ref, key);
              if (result && result.ok === false) throw new Error(result.error?.message ?? 'credential store refused the key');
              if (alive.current) setKeyDraft('');
              await readCredential(ref);
            } catch (error) {
              if (alive.current) setMessage({ error: true, text: t('keyFailed', { message: error?.message ?? String(error) }) });
              return;
            }
          }
          if (alive.current) setMessage({ error: false, text: t('saved') });
        } finally {
          if (alive.current) setSaving(false);
        }
      };
      const discard = () => { setDraft({}); setKeyDraft(''); setMessage(null); };
      const resetAll = async () => {
        if (!window.confirm(t('resetAllConfirm'))) return;
        const ops = FIELDS.filter((field) => field in user).map((field) => ({ op: 'unset', path: [field] }));
        setDraft({});
        if (ops.length === 0) return;
        setSaving(true);
        try {
          const accepted = await form.mutate(ops, snap.revision);
          if (alive.current) setMessage(accepted ? { error: false, text: t('saved') } : { error: true, text: t('saveFailed') });
        } finally { if (alive.current) setSaving(false); }
      };
      const runCheck = async () => {
        if (!savedRelayConfigured || dirty || saving) return;
        setChecking(true); setCheck(null);
        try {
          const result = await post('api/codex-image/check');
          if (!alive.current) return;
          setCheck(result);
          if (result.ok && Array.isArray(result.models)) setModels(result.models);
        } catch (error) {
          if (alive.current) setCheck({ ok: false, message: error?.message ?? String(error) });
        } finally { if (alive.current) setChecking(false); }
      };
      const runTest = async () => {
        if (!savedRelayConfigured || dirty || saving) return;
        setTesting(true); setTest(null);
        try {
          const result = await post('api/codex-image/preview', { prompt: testPrompt });
          if (alive.current) setTest(result);
        } catch (error) {
          if (alive.current) setTest({ ok: false, message: error?.message ?? String(error) });
        } finally { if (alive.current) setTesting(false); }
      };

      if (status === 'loading') return h('div', { className: 'cxi-page' }, h(Style), h('p', { className: 'cxi-hint' }, t('loading')));
      if (status !== 'ready') return h('div', { className: 'cxi-page' }, h(Style), h('p', { className: 'cxi-hint' }, t('unavailable')));

      const text = (field, props = {}) => h('input', {
        id: `cxi-${field}`, className: 'cxi-input', type: 'text', value: String(value(field) ?? ''), disabled,
        spellCheck: false, autoComplete: 'off', 'aria-invalid': Boolean(errors[field]),
        onChange: (event) => edit(field, event.target.value), ...props,
      });
      const field = (name, control, extra = {}) => h(Field, {
        id: `cxi-${name}`, t, label: t(name), hint: extra.hint === undefined ? (DICTS[lang][`${name}Hint`] ?? en[`${name}Hint`]) : extra.hint,
        error: errors[name], overridden: isOverridden(name), onReset: disabled ? undefined : () => resetField(name),
      }, control);
      const sizeValue = String(value('size'));
      const sizeIsPreset = SIZES.includes(sizeValue) && !customSize;
      const listId = 'cxi-models';
      const imageModels = models.filter((id) => /image|dall-?e/i.test(id));
      const modelOptions = (imageModels.length > 0 ? imageModels : models).concat(models.includes('gpt-image-2.5') ? [] : ['gpt-image-2.5']);

      return h('div', { className: 'cxi-page' },
        h(Style),
        h('p', { className: 'cxi-intro' }, t('intro')),
        writable ? null : h('p', { className: 'cxi-error' }, t('readOnly')),

        h('section', { className: 'cxi-section' },
          h('h3', null, t('sectionConnection')),
          field('baseURL', text('baseURL', { inputMode: 'url' })),
          h(Field, {
            id: 'cxi-apiKey', t, label: t('keyLabel'), hint: t('apiKeyHint'),
          },
          h('input', {
            id: 'cxi-apiKey', className: 'cxi-input', type: 'password', value: keyDraft, autoComplete: 'new-password', spellCheck: false,
            disabled: saving || credential.writable === false,
            placeholder: credential.configured ? '••••••••  ' + t('apiKeySet') : t('apiKeyUnset'),
            onChange: (event) => { setKeyDraft(event.target.value); setMessage(null); },
          }),
          credential.configured === undefined ? null
            : h('p', { className: credential.configured ? 'cxi-ok' : 'cxi-error' }, (credential.configured ? t('apiKeySet') : t('apiKeyUnset')) + ` · ${savedRef}`)),
          field('apiKeyEnv', text('apiKeyEnv', { placeholder: DEFAULTS.apiKeyEnv })),
          h('div', { className: 'cxi-actions' },
            h('button', { type: 'button', className: 'cxi-btn', disabled: checking || !savedRelayConfigured || dirty || saving, onClick: runCheck }, checking ? t('checking') : t('check')),
            h('span', { className: 'cxi-hint' }, t('checkUsesSaved'))),
          check === null ? null : check.ok
            ? h('div', null,
              h('p', { className: 'cxi-ok' }, t('checkOk', { ms: check.ms, count: check.models?.length ?? 0 })),
              h('p', { className: check.hasModel ? 'cxi-ok' : 'cxi-error' }, t(check.hasModel ? 'checkModelOk' : 'checkModelMissing', { model: check.model })),
              check.imageModels?.length ? h('p', { className: 'cxi-hint' }, t('checkImageModels', { list: check.imageModels.join(', ') })) : null)
            : h('p', { className: 'cxi-error', role: 'alert' }, check.message ?? check.error ?? 'error')),

        h('section', { className: 'cxi-section' },
          h('h3', null, t('sectionModel')),
          h('datalist', { id: listId }, modelOptions.map((id) => h('option', { key: id, value: id }))),
          h('div', { className: 'cxi-row' },
            field('model', text('model', { list: listId, placeholder: DEFAULTS.model })),
            field('editModel', text('editModel', { list: listId, placeholder: String(value('model') || DEFAULTS.model) })))),

        h('section', { className: 'cxi-section' },
          h('h3', null, t('sectionGeneration')),
          field('size', h('div', { className: 'cxi-field' },
            h('select', {
              id: 'cxi-size', className: 'cxi-select', disabled,
              value: sizeIsPreset ? sizeValue : '__custom',
              onChange: (event) => {
                if (event.target.value === '__custom') { setCustomSize(true); return; }
                setCustomSize(false); edit('size', event.target.value);
              },
            }, SIZES.map((size) => h('option', { key: size, value: size }, t('sizeLabels')[size] ?? size)), h('option', { value: '__custom' }, t('sizeCustom'))),
            sizeIsPreset ? null : h('input', {
              className: 'cxi-input', type: 'text', value: sizeValue === 'auto' ? '' : sizeValue, placeholder: t('sizeCustomPlaceholder'), disabled,
              'aria-invalid': Boolean(errors.size), onChange: (event) => edit('size', event.target.value),
            }))),
          h(Toggle, { label: t('aspectHint'), hint: t('aspectHintHint'), checked: value('aspectHint') === true, disabled, onChange: (next) => edit('aspectHint', next) }),
          field('quality', h(Segmented, { label: t('quality'), value: value('quality'), options: ['auto', 'low', 'medium', 'high'], labels: t('qualityLabels'), disabled, onChange: (next) => edit('quality', next) }), { hint: null }),
          field('background', h(Segmented, { label: t('background'), value: value('background'), options: ['auto', 'opaque', 'transparent'], labels: t('backgroundLabels'), disabled, onChange: (next) => edit('background', next) }), { hint: null }),
          h('div', { className: 'cxi-row' },
            field('outputFormat', h(Segmented, { label: t('outputFormat'), value: value('outputFormat'), options: ['png', 'jpeg', 'webp'], labels: { png: 'PNG', jpeg: 'JPEG', webp: 'WebP' }, disabled, onChange: (next) => edit('outputFormat', next) })),
            field('outputCompression', h('div', { className: 'cxi-range' },
              h('input', {
                id: 'cxi-outputCompression', type: 'range', min: 0, max: 100, step: 5, value: Number(value('outputCompression')),
                disabled: disabled || value('outputFormat') === 'png', onChange: (event) => edit('outputCompression', Number(event.target.value)),
              }),
              h('span', null, `${Number(value('outputCompression'))}%`)), { hint: null })),
          h('div', { className: 'cxi-row' },
            field('moderation', h(Segmented, { label: t('moderation'), value: value('moderation'), options: ['auto', 'low'], labels: t('moderationLabels'), disabled, onChange: (next) => edit('moderation', next) }), { hint: null }),
            field('count', h(Segmented, { label: t('count'), value: String(value('count')), options: ['1', '2', '3', '4'], disabled, onChange: (next) => edit('count', Number(next)) }))),
          field('stylePrompt', h('textarea', {
            id: 'cxi-stylePrompt', className: 'cxi-textarea', value: String(value('stylePrompt') ?? ''), placeholder: t('stylePromptPlaceholder'), disabled,
            onChange: (event) => edit('stylePrompt', event.target.value),
          }))),

        h('section', { className: 'cxi-section' },
          h('h3', null, t('sectionOutput')),
          h(Toggle, { label: t('saveToWorkspace'), hint: t('saveToWorkspaceHint'), checked: value('saveToWorkspace') === true, disabled, onChange: (next) => edit('saveToWorkspace', next) }),
          h('div', { className: 'cxi-row' },
            field('workspaceFolder', text('workspaceFolder', { placeholder: DEFAULTS.workspaceFolder, disabled: disabled || value('saveToWorkspace') !== true })),
            field('timeoutSeconds', h('input', {
              id: 'cxi-timeoutSeconds', className: 'cxi-input', type: 'number', min: 10, max: 900, step: 10, value: Number(value('timeoutSeconds')), disabled,
              onChange: (event) => { const n = Math.round(Number(event.target.value)); if (Number.isFinite(n)) edit('timeoutSeconds', Math.min(900, Math.max(10, n))); },
            })))),

        h('section', { className: 'cxi-section' },
          h('h3', null, t('sectionTest')),
          h(Field, { id: 'cxi-testPrompt', t, label: t('testPrompt'), hint: t('testHint') },
            h('input', { id: 'cxi-testPrompt', className: 'cxi-input', type: 'text', value: testPrompt, placeholder: t('testPromptPlaceholder'), onChange: (event) => setTestPrompt(event.target.value) })),
          h('div', { className: 'cxi-actions' },
            h('button', { type: 'button', className: 'cxi-btn', disabled: testing || !savedRelayConfigured || dirty || saving, onClick: runTest }, testing ? t('testing') : t('test'))),
          test === null ? null : test.ok
            ? h('div', { className: 'cxi-field' },
              h('img', { className: 'cxi-preview', src: test.dataUrl, alt: testPrompt || t('testPromptPlaceholder') }),
              h('p', { className: 'cxi-hint' }, t('testResult', { model: test.model, width: test.width ?? '?', height: test.height ?? '?', kb: Math.round((test.bytes ?? 0) / 1024), seconds: ((test.ms ?? 0) / 1000).toFixed(1) })))
            : h('p', { className: 'cxi-error', role: 'alert' }, test.message ?? test.error ?? 'error')),

        h('div', { className: 'cxi-footer' },
          h('button', { type: 'button', className: 'cxi-btn', 'data-primary': true, disabled: !dirty || invalid || disabled, onClick: save }, saving ? t('saving') : t('save')),
          h('button', { type: 'button', className: 'cxi-btn', disabled: !dirty || saving, onClick: discard }, t('discard')),
          message ? h('span', { className: message.error ? 'cxi-error' : 'cxi-ok', role: 'status' }, message.text) : null,
          h('span', { className: 'cxi-spacer' }),
          h('button', { type: 'button', className: 'cxi-btn', 'data-danger': true, disabled, onClick: resetAll }, t('resetAll'))));
    }

    // ------------------------------------------------------------ tool card
    function parseArgs(block) {
      try {
        const call = block && ('kind' in block ? block.call : block);
        const raw = call?.argsRaw;
        if (typeof raw !== 'string') return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      } catch { return {}; }
    }
    function resultImages(block) {
      const content = Array.isArray(block?.content) ? block.content : Array.isArray(block?.resultView?.content) ? block.resultView.content : [];
      return content.filter((part) => part && part.type === 'image' && part.attachment && typeof part.attachment.attachmentId === 'string').map((part) => part.attachment);
    }
    function resultText(block) {
      const content = Array.isArray(block?.content) ? block.content : [];
      return content.filter((part) => part?.type === 'text' && typeof part.text === 'string').map((part) => part.text).join('\n');
    }
    function Tile({ attachment, loadImage, saved, t, openFile, cwd }) {
      const [url, setUrl] = useState(null);
      const [expanded, setExpanded] = useState(false);
      useEffect(() => {
        let live = true;
        try {
          const peek = loadImage?.peek?.(attachment);
          if (peek) setUrl(peek);
          Promise.resolve(loadImage?.(attachment)).then((next) => { if (live && next) setUrl(next); }, () => {});
        } catch {}
        return () => { live = false; };
      }, [attachment, loadImage]);
      const absolute = saved && cwd ? `${String(cwd).replace(/[\\/]+$/, '')}/${saved}` : saved;
      return h('div', { className: 'cxi-tile', 'data-expanded': expanded },
        url ? h('img', {
          src: url, alt: saved ?? 'gpt-image', title: t(expanded ? 'cardCollapse' : 'cardOpen'), width: attachment.width, height: attachment.height,
          role: 'button', tabIndex: 0, 'aria-pressed': expanded,
          onClick: () => setExpanded((value) => !value),
          onKeyDown: (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setExpanded((value) => !value); } },
        }) : h('div', { className: 'cxi-tile-skeleton', 'aria-hidden': true }),
        h('div', { className: 'cxi-tile-meta' },
          h('span', null, `${attachment.width}×${attachment.height}`),
          saved && typeof openFile === 'function' ? h('button', { type: 'button', className: 'cxi-link', onClick: () => { try { openFile(absolute); } catch {} } }, t('cardFile')) : null));
    }
    function ToolCard(props) {
      const lang = useLang(props.locale);
      const t = useMemo(() => makeT(lang), [lang]);
      const block = props.block;
      const args = parseArgs(block);
      const edit = props.toolName === 'gpt_image_edit';
      const settled = props.phase === 'result' || (block && 'kind' in block);
      const failed = settled && block?.isError === true;
      const images = settled && !failed ? resultImages(block) : [];
      const meta = block?.meta && typeof block.meta === 'object' ? block.meta : undefined;
      const savedById = new Map(Array.isArray(meta?.images) ? meta.images.map((image) => [image.attachmentId, image.savedTo]) : []);
      const failures = Array.isArray(meta?.failures) ? meta.failures : [];
      const prompt = typeof args.prompt === 'string' ? args.prompt : '';
      const stateText = !settled ? t('cardRunning') : failed ? t('cardFailed') : t('cardImages', { count: images.length });
      return h('div', { className: 'cxi-card' },
        h(Style),
        h('div', { className: 'cxi-card-head' },
          settled ? null : h('span', { className: 'cxi-dot', 'aria-hidden': true }),
          h('span', { className: 'cxi-card-title' }, edit ? t('cardEdit') : t('cardGenerate')),
          prompt ? h('span', { className: 'cxi-card-prompt', title: prompt }, prompt) : null,
          h('span', { className: 'cxi-card-state', 'data-error': failed }, stateText)),
        failed ? h('p', { className: 'cxi-card-error' }, resultText(block).replace(/^Error:\s*/, '')) : null,
        images.length > 0 ? h('div', { className: 'cxi-gallery' }, images.map((attachment, index) => h(Tile, {
          key: `${attachment.attachmentId}:${index}`, attachment, loadImage: props.loadImage, saved: savedById.get(attachment.attachmentId), t, openFile: props.openFile, cwd: props.cwd,
        }))) : null,
        failures.length > 0 ? h('p', { className: 'cxi-card-error' }, t('cardPartial', { list: failures.join(' | ') })) : null);
    }
    class CardBoundary extends React.Component {
      constructor(props) { super(props); this.state = { broken: false }; }
      static getDerivedStateFromError() { return { broken: true }; }
      componentDidCatch(error) { console.warn('codex-image: tool card failed', error); }
      render() { return this.state.broken ? h('span', { className: 'cxi-hint' }, this.props.toolName) : h(ToolCard, this.props); }
    }
    class PageBoundary extends React.Component {
      constructor(props) { super(props); this.state = { error: null }; }
      static getDerivedStateFromError(error) { return { error }; }
      componentDidCatch(error) { console.warn('codex-image: settings page failed', error); }
      render() { return this.state.error ? h('p', { className: 'cxi-error' }, String(this.state.error?.message ?? this.state.error)) : h(SettingsPage, this.props); }
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        const locale = ctx.get('locale');
        let form;
        let credentials;
        const credentialListeners = new Set();
        const services = {
          locale,
          form: () => form ?? unavailableForm,
          credentials: () => credentials,
          onCredentialChange(listener) { credentialListeners.add(listener); return () => credentialListeners.delete(listener); },
        };
        ctx.inject(['configForms'], (child) => {
          try { form = child.get('configForms').get(ENTRY); } catch (error) { console.warn('codex-image: settings form unavailable', error); }
          child.effect(() => () => { form = undefined; }, 'codex-image: settings form');
        });
        const attachCredentials = (value) => {
          if (value && typeof value.describe === 'function' && typeof value.set === 'function') credentials = value;
        };
        attachCredentials(ctx.get('remote.credentials'));
        ctx.inject(['remote.credentials'], (child) => {
          attachCredentials(child.get('remote.credentials'));
        });
        ctx.effect(() => {
          const remote = ctx.get('remote');
          if (typeof remote?.$on !== 'function') return () => {};
          return remote.$on('credentials/reference-updated', (ref) => {
            const name = typeof ref === 'string' ? ref : ref?.ref;
            for (const listener of credentialListeners) listener(name);
          });
        }, 'codex-image: credential events');

        ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
          name: 'plugins.bundle.config',
          key: PKG,
          inject: () => ({ services }),
        }, PageBoundary));

        for (const tool of TOOLS) {
          ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({
            name: 'tool.call.toolview',
            key: tool,
            inject: () => ({ locale }),
          }, CardBoundary));
        }
      },
    };
  },
});
