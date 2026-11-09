# DeepSeek Harness: воспроизведение plugin-конфигурации

Этот документ — последовательность установки для агента или пользователя. Цель: получить plugin-слой исходной конфигурации **DeepSeek Harness Desktop 0.2.2-rc.1**, не перенося секреты, память, сессии или приватные настройки.

## 0. Границы и критерий готовности

- Выполняйте установку в отдельном или заранее сохранённом профиле. Изменения Plugin Manager применяются ко всем Sessions выбранного профиля.
- Не применяйте compatibility exemptions и не редактируйте `package.json` профиля или `cordis.patch.yml` вручную.
- Не устанавливайте `mneme-russian` одновременно с `mnemon-russian`: это альтернативные системы памяти.
- Пакеты с `@local/...` ставятся из директорий этого репозитория после clone, а не из npm. Не заменяйте их именами из registry.
- `agent-team-model-selection` рассчитан именно на packaged Desktop 0.2.2-rc.1 и не является универсальным CLI/Web-портом.
- API keys и OAuth выполняются пользователем после установки. Не записывайте их в файлы репозитория, tickets, logs или screenshots.

Готово, когда все нужные bundles включены без ошибок, Host перезапущен, browser-страница обновлена, а пользовательские credentials настроены через GUI по [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

## 1. Подготовка

1. Установите официальный **DeepSeek Harness Desktop 0.2.2-rc.1**. Для полного набора требуется Windows: `dsh-computer-use-win` работает только на `win32`.
2. Склонируйте этот репозиторий и откройте терминал в его корне. Не используйте `dsh plugin add github:...` для всего monorepo: наши пакеты находятся в отдельных подкаталогах `plugins/`.
3. Для Desktop используйте **Plugins → Add plugin → Install a third-party plugin**. Это основной способ: Node.js и pnpm уже встроены.
4. CLI-примеры ниже применимы, когда `dsh` зарегистрирована Desktop-установкой через **Manage dsh Command…**. Для CLI/Web замените `desktop` на фактическое имя профиля и проверьте совместимость каждого пакета.
5. Сохраните работу. После `restart-required` полностью перезапустите Host; Desktop при необходимости закройте через tray **Quit**, а не только закрытием окна.

Подробности форм установки, registry и совместимости: [docs/EXTERNAL.md](docs/EXTERNAL.md).

## 2. Включите поставляемые official bundles

Эти пакеты уже находятся в установке DSH. **Скачивать их отдельно через npm не нужно.** Включите следующие layers через Plugins/Plugin Manager:

```text
@deepseek-ai/dsh-experimental-agent-team-profile
@deepseek-ai/dsh-experimental-auto-review
@deepseek-ai/dsh-experimental-tool-worktree
@deepseek-ai/dsh-experimental-terminal-bundle
@deepseek-ai/dsh-experimental-session-search
@deepseek-ai/dsh-experimental-session-titles-bundle
@deepseek-ai/dsh-experimental-cot-translation-bundle
@deepseek-ai/dsh-experimental-inspector-profile
@deepseek-ai/dsh-experimental-plugin-market-bundle
@deepseek-ai/dsh-experimental-forge-bundle
```

`terminal-bundle` и standalone `tool-worktree` могут не иметь карточки; проверяйте их в `dsh.profile.bundles`/Plugin Manager.

`@deepseek-ai/dsh-subagent-codex@0.2.1-rc.5` несовместим с этой версией DSH и в эталонном состоянии остаётся **disabled**. Он не нужен обычному Codex chat. Не активируйте его и не выдавайте exemption.

Проверка: все десять layers выбраны, Agent Teams доступен, несовместимый Codex subagent не активирован.

## 3. Установите сторонние пакеты из интернета

Установите точные версии из npm, по очереди через GUI или команды:

| Пакет | Версия | Назначение |
|---|---:|---|
| [`@indexyz/dsh-prompt-suggestions`](https://www.npmjs.com/package/@indexyz/dsh-prompt-suggestions) | `0.1.1` | Подсказка следующего сообщения |
| [`dsh-codex-subscription`](https://www.npmjs.com/package/dsh-codex-subscription) | `3.2.6` | ChatGPT/Codex OAuth и модели по подписке |
| [`dsh-computer-use-win`](https://www.npmjs.com/package/dsh-computer-use-win) | `0.5.4` | Windows Computer Use через MCP |

```powershell
dsh plugin --profile desktop add @indexyz/dsh-prompt-suggestions@0.1.1
dsh plugin --profile desktop add dsh-codex-subscription@3.2.6
dsh plugin --profile desktop add dsh-computer-use-win@0.5.4
```

Для GUI вставляйте те же specs в **Package name or address** и после установки выбирайте **Enable now**, если предложено.

Учтите заранее: prompt suggestions, auto review и session titles создают дополнительные model requests; Codex требует отдельный ChatGPT OAuth; Computer Use получает доступ к содержимому экрана. Сетевые и privacy-требования описаны в [docs/EXTERNAL.md](docs/EXTERNAL.md).

Проверка: карточки показывают именно версии `0.1.1`, `3.2.6`, `0.5.4` и активное состояние без ошибок.

## 4. Установите наши активные плагины

| Каталог | Пакет | Назначение / условие |
|---|---|---|
| `plugins/agent-team-monitor` | `@local/agent-team-monitor@1.1.14` | Панель Agent Teams; требуется official Agent Teams |
| `plugins/agent-team-model-selection` | `@local/team-model-selection@1.0.2` | Выбор модели teammates/subagents; packaged Desktop 0.2.2-rc.1 |
| `plugins/running-session-preview` | `@local/running-session-preview@1.2.1` | Последнее видимое текстовое сообщение работающей сессии |
| `plugins/dsh-cost-meter` | `dsh-cost-meter@0.1.0` | Kimi limits; требуется Kimi credential в Models |
| `plugins/subscription-quota` | `@local/subscription-quota@1.0.0` | Квота отдельного CPA Key Billing |
| `plugins/mnemon-russian` | `dsh-mnemon@0.5.42+ru.2` | Русская сборка Mnemon; собирается перед установкой |
| `plugins/mnemon-russian-guard` | `@local/mnemon-russian-guard@1.0.0` | Восстановление русской локализации Mnemon |
| `plugins/7lamp-harness` | `@local/7lamp-harness@1.0.4` | Фирменная тема 7LAMP; source-available, `UNLICENSED` |

### 4.1. Локальные директории

Для GUI укажите **абсолютный путь** каждой директории. Для зарегистрированной Desktop CLI выполняйте из корня репозитория:

```powershell
dsh plugin --profile desktop add "./plugins/agent-team-monitor"
dsh plugin --profile desktop add "./plugins/agent-team-model-selection"
dsh plugin --profile desktop add "./plugins/running-session-preview"
dsh plugin --profile desktop add "./plugins/dsh-cost-meter"
dsh plugin --profile desktop add "./plugins/subscription-quota"
```

`running-session-preview/dist` уже содержит собранный client. Если изменяли его `src`, перед установкой повторите `npm run build` в этом каталоге.

Проверка: пять bundles установлены, model-selection заменяет штатные `agent-team`/`tool-agent-team` rows без дублирования Cordis/DSH.

### 4.2. Русская сборка Mnemon

Перейдите к разделу сборки в [plugins/mnemon-russian/README.md](plugins/mnemon-russian/README.md) и выполните его полностью: verified prepare, localization/tests и pack. Должен быть создан новый `.tgz` версии `0.5.42+ru.2`; используйте выведенный сборкой SHA-256 для контроля.

Установите **новый tarball**, а не старую локальную копию и не upstream `dsh-mnemon` из npm. Через GUI выберите его абсолютный путь. После успешной установки Mnemon добавьте guard:

```powershell
dsh plugin --profile desktop add "./plugins/mnemon-russian-guard"
```

Проверка: активны русская сборка и guard, bundled Source присутствуют, нет двух одновременно активных версий `dsh-mnemon`. Полностью перезапустите Host.

### 4.3. Фирменная тема

Устанавливайте последней:

```powershell
dsh plugin --profile desktop add "./plugins/7lamp-harness"
```

Проверка: токены темы и брендинг применяются; extracted CSS, inspection dumps и локальные diagnostic tools не требуются и в репозиторий не входят.

## 5. Дополнительный проект: русская адаптация Mneme

`plugins/mneme-russian` содержит `@modusensus/dsh-mneme@0.10.1-ru.1` с MIT license и upstream attribution. В исходной активной конфигурации используется **Mnemon**, поэтому по умолчанию этот шаг пропускается.

Если нужна именно Mneme:

1. Сохраните отдельную согласованную резервную копию памяти при остановленных writers.
2. Отключите `dsh-mnemon` и `mnemon-russian-guard`; не запускайте две memory systems одновременно.
3. Установите локальную директорию:

   ```powershell
   dsh plugin --profile desktop add "./plugins/mneme-russian"
   ```

4. Задайте `language: ru` через настройки плагина. Не переносите в репозиторий migration snapshots, translation input/output, vectors, БД или отчёты миграции.
5. Проверьте создание и чтение нечувствительной тестовой записи и отсутствие фоновых задач прежней memory system.

Возврат к Mnemon выполняется в обратном порядке после отключения Mneme. Не удаляйте пользовательские базы при смене пакета.

## 6. Настройте пользовательские данные и предпочтения

Выполните [docs/CONFIGURATION.md](docs/CONFIGURATION.md):

- ChatGPT OAuth и `quickQuotaMode=percent`;
- Kimi credential для cost meter;
- собственный Billing origin и отдельный CPA Key Billing для subscription quota;
- DeepSeek Account / `deepseek-flash` для фоновых операций памяти;
- Dark theme, reasoning translation Google → Russian;
- `maxActiveSubagents=10` и публичный plugin-market index.

Не экспортируйте и не восстанавливайте из этого репозитория приватные model routes, base URLs, proxies, память, skills, sessions, account identifiers или diagnostics.

## 7. Проверьте репозиторий и результат

После Host restart и browser refresh проверьте:

1. Agent Teams открывается; monitor и выбор модели работают без duplicate service errors.
2. В running Session отображается только последнее видимое текстовое сообщение, не reasoning/tools.
3. Kimi badge появляется только для Kimi route; subscription quota использует отдельный ключ.
4. Русская память работает без параллельной второй memory system.
5. Светлая/тёмная темы и фирменный branding не ломают интерфейс.
6. В Plugins нет активного несовместимого Codex subagent или ошибок версии.

Для проверки исходников используйте Node.js и npm:

```powershell
npm test
npm run audit
```

`mneme-russian` требует сначала `npm install --ignore-scripts` в своём каталоге; его standalone runner явно перечисляет исключённые upstream-monorepo-only тесты. Mnemon тестируется через инструкции в собственном README.

`npm run audit` выводит только путь, строку и категорию находки, не само значение. Warnings требуют ручной классификации; errors блокируют публикацию. Дополнительно перед каждым push запускайте независимый secret scanner по staged tree и всей Git history.

## 8. Обновление и откат

- Обновляйте каждый bundle через Plugin Manager с проверкой `engines.dsh`, upstream changes, build scripts и тестов. Не перезаписывайте русские адаптации upstream-пакетом без повторного портирования.
- Отключение сохраняет зависимость; Remove удаляет её из профиля. Сначала удалите пользовательский credential через интерфейс плагина, если он больше не нужен.
- Не удаляйте рабочую директорию, установленную через `link:`. Для переноса сначала переустановите пакет по новому пути.
- Не выполняйте `npm publish`: репозиторий предназначен для установки из исходников и локально собранных tarball.
