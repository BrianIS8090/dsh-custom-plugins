# Внешние пакеты и установка для DeepSeek Harness 0.2.2-rc.1

Документ описывает публичную эталонную конфигурацию: имена и версии пакетов, поддерживаемые способы установки, системные требования и сетевые особенности. Здесь нет локальных путей, приватных endpoints, учётных данных или идентификаторов сессий.

## 1. Сторонние пакеты из npm

В активной конфигурации используются три сторонних bundle с точными версиями:

| Пакет | Версия | Назначение | Публичные источники |
|---|---:|---|---|
| `@indexyz/dsh-prompt-suggestions` | `0.1.1` | Показывает после успешного ответа приглушённую подсказку следующего сообщения; не отправляет её автоматически | [npm](https://www.npmjs.com/package/@indexyz/dsh-prompt-suggestions) · [GitHub](https://github.com/5aaee9/pi-agent-extensions/tree/main/dsh-prompt-suggestions) |
| `dsh-codex-subscription` | `3.2.6` | ChatGPT/Codex OAuth, модели по подписке, квота, поиск, изображения и дополнительные функции | [npm](https://www.npmjs.com/package/dsh-codex-subscription) · [GitHub](https://github.com/WSL043/dsh-codex-subscription) |
| `dsh-computer-use-win` | `0.5.4` | Windows UI Automation, screenshots/OCR, мышь и клавиатура, browser lane через MCP | [npm](https://www.npmjs.com/package/dsh-computer-use-win) · [GitHub](https://github.com/Yu-tao-Li/dsh-computer-use-win) |

Это сторонние пакеты, а не компоненты, гарантированные DeepSeek или OpenAI. Перед установкой проверяйте источник, объявленные зависимости и запрашиваемые build scripts.

## 2. Подготовка

### Desktop — основной вариант

Используйте официальное Desktop-приложение и страницу **Plugins**. Desktop уже содержит Node.js и pnpm, поэтому устанавливать их отдельно для управления плагинами не требуется.

После Host-изменений следуйте инструкции `restart-required`, а browser-половину обновите перезагрузкой страницы. Если Desktop просит полный перезапуск, выберите **Quit** в системном tray и запустите приложение снова: закрытие только окна может оставить Host работающим.

### CLI/Web

- DSH `0.2.2-rc.1` требует Node.js `>=24.9.0`.
- Менеджеру пакетов нужен pnpm на `PATH` либо явно настроенный `pnpmCommand`; Desktop предоставляет собственный package manager.
- Для управления профилем `desktop` команда `dsh` должна быть зарегистрирована самой Desktop-установкой (**Manage dsh Command…**). Обычный npm CLI не управляет зарезервированным Desktop-профилем.
- Для CLI/Web указывайте профиль, который действительно используется, например `web`, а не копируйте `desktop` без проверки.
- Для скачивания пакетов и зависимостей нужен HTTPS-доступ к выбранному npm registry.

Если подходящей команды `dsh` нет, используйте GUI; не меняйте системный `PATH` принудительно ради установки плагина.

## 3. Установка из npm registry через GUI

1. Откройте **Plugins → Add plugin → Install a third-party plugin**.
2. По очереди вставьте в **Package name or address** точные specs:

   ```text
   @indexyz/dsh-prompt-suggestions@0.1.1
   dsh-codex-subscription@3.2.6
   dsh-computer-use-win@0.5.4
   ```

3. При необходимости выберите **Registry**. UI умеет использовать настроенный registry, публичный npm, mirror или введённый HTTPS registry.
4. Нажмите **Install**, дождитесь результата и выберите **Enable now**, если это действие предложено.
5. Проверьте версию и состояние bundle на его карточке. Успешное скачивание само по себе не доказывает успешную активацию.

Менеджер поддерживает fallback registries. Mirror помогает registry-пакетам и их зависимостям, но не заменяет хост, с которого скачиваются Git repository или tarball.

## 4. Те же установки через CLI

Для Desktop-registered команды:

```powershell
dsh plugin --profile desktop add @indexyz/dsh-prompt-suggestions@0.1.1
dsh plugin --profile desktop add dsh-codex-subscription@3.2.6
dsh plugin --profile desktop add dsh-computer-use-win@0.5.4
```

Для CLI/Web замените `desktop` на имя своего профиля. Например, синтаксис явного выбора registry:

```powershell
dsh plugin --profile desktop add dsh-codex-subscription@3.2.6 --registry=https://registry.npmjs.org/
```

Не повторяйте установку вслепую поверх действующей конфигурации: сначала проверьте установленную версию и доступные действия в **Plugins**. Для registry-пакетов используйте штатный **Versions/Update**, когда он предлагается.

## 5. Локальная директория или tarball

Поддерживаются директория пакета, `.tgz` и `.tar.gz`.

### Через GUI

В том же поле **Package name or address** укажите абсолютный путь в одной из форм:

```text
<абсолютный-путь-к-директории-пакета>
<абсолютный-путь-к-файлу.tgz>
```

UI также принимает tarball URL. Относительная директория в GUI не используется: Host не должен угадывать, относительно какого рабочего каталога её разрешать.

### Через CLI

CLI дополнительно принимает `./`, `../`, `.\` и `..\`. Относительный путь разрешается от каталога вызова `dsh`, а не от каталога профиля:

```powershell
dsh plugin --profile desktop add ./my-dsh-bundle
dsh plugin --profile desktop add ./dist/my-dsh-bundle.tgz
```

Требования и последствия:

- Пакет должен содержать `package.json` и декларацию `dsh.bundle.patch`; обычная зависимость без bundle patch не становится profile layer.
- Перед установкой директории через `link:` соберите Host/client artifacts. Такая директория читается прямо с диска, DSH не выполняет её сборку автоматически.
- Для registry и локальной директории совместимость проверяется до запуска pnpm. Для Git/tarball окончательная проверка возможна только после fetch/install; при отказе менеджер восстанавливает manifest и lockfile, а уже разрешённые side effects build scripts могут остаться.
- Не используйте version exemptions для обхода несовместимости.

## 6. Official bundles, уже поставляемые с DSH

Следующие десять bundles включены в эталонной конфигурации и уже поставляются с установкой `0.2.2-rc.1`:

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

Для них **не нужен отдельный `npm add` или `dsh plugin add`**: включение меняет выбранный profile layer. `availability=installation` означает, что код принадлежит поставке; `installed:false` у такого bundle означает лишь отсутствие отдельной зависимости в manifest профиля.

Особенности отображения:

- `dsh-experimental-terminal-bundle` и standalone `dsh-experimental-tool-worktree` скрыты из карточек Plugins, но их выбранные слои продолжают действовать. Проверяйте их через Plugin Manager и `dsh.profile.bundles`, а не по наличию карточки.
- `dsh-experimental-terminal-bundle` входит в shipped optional bundles, но не входит в отдельный badge-set `EXPERIMENTAL_BUNDLES`. Остальные девять имеют Experimental marker.

### Отдельный on-demand Codex subagent

`@deepseek-ai/dsh-subagent-codex@0.2.1-rc.5` в список выше **не входит**. Это Official on-demand компонент, а не installation-owned optional bundle. В эталонном состоянии он остаётся установленным, но **disabled**: его DSH peer dependencies закреплены на `0.2.1-rc.5` и несовместимы с `0.2.2-rc.1`.

- Не активируйте эту версию и не выдавайте compatibility exemption.
- Не считайте её необходимой для обычного чата через `dsh-codex-subscription`.
- Если независимые Codex-подзадачи действительно нужны, проверьте совместимый target, предлагаемый текущим Host, и выполняйте обновление как отдельное осознанное изменение, а не как часть эталонной установки.

## 7. Сеть, OAuth, Windows и дополнительные запросы

### Prompt suggestions

- Использует текущие provider/model беседы и наименьший доступный reasoning effort.
- После каждого подходящего live completed reply выполняется один дополнительный model request: это дополнительные tokens и latency.
- В auxiliary request передаются только ограниченные последние видимые user/assistant exchanges; reasoning, tool results, system prompts и environment state не отправляются.
- Подсказка существует временно, не сохраняется как черновик и не отправляется автоматически.
- После установки перезапустите Host и обновите страницу.

### Codex subscription и OAuth

- Нужен ChatGPT account, которому в данный момент доступен Codex. Версия `3.2.6` заявляет проверку с DSH `0.2.2-rc.1`.
- Войдите через **Settings → Codex**, затем выберите Codex-модель в беседе.
- Для обычного чата OpenAI API key и Codex CLI **не нужны**. Отдельный Codex subagent относится только к необязательным независимым подзадачам.
- Нужен outbound HTTPS к публичным сервисам `auth.openai.com` и `chatgpt.com`. Плагин учитывает `HTTPS_PROXY`, `ALL_PROXY`, `NO_PROXY`, а затем системный Windows proxy.
- Если browser callback не завершился, доступен device-code sign-in.
- Sign-in URL, authorization/device codes, полный redirect/callback URL, access/refresh tokens и другие учётные данные нельзя помещать в документацию, журналы или issues. Support diagnostics следует использовать только в обезличенном виде.

### Computer Use для Windows

- Пакет работает только на `win32` и использует встроенный Windows PowerShell 5.1; отдельная установка PowerShell не требуется.
- Для полноценного browser lane обычно нужен Chrome или Edge. UAC и окна с повышенными правами защищены Windows и не управляются плагином; нужна обычная доступная desktop session.
- Screenshots, OCR и accessibility tree могут содержать пароли, личную переписку и другие чувствительные данные. Перед публикацией diagnostics их необходимо удалить.
- `Esc` останавливает текущий desktop control. После установки или обновления полностью перезапустите Desktop через tray.

### Требования shipped experimental bundles

- **Auto review, session titles и prompt suggestions** создают дополнительные model requests. Auto review использует текущие provider/model и может разрешить выполнение с Full access; включайте его только с учётом этого риска.
- **Reasoning translation** отправляет развёрнутое reasoning выбранному сервису. Google/Bing не требуют отдельного login/API key, но зависят от сети, rate limits и доступности anonymous endpoints. Исходное reasoning остаётся в Session.
- **Forge/tool-worktree** требует Git и Node в одном execution world и Git с поддержкой `GIT_NO_LAZY_FETCH`: Git 2.45+ или maintenance releases, перечисленные в README пакета. Локальный worktree не требует GitHub authentication; GitHub PR/status использует signed-in `gh` CLI.
- **Plugin Market** читает настроенные пользователем indexes; наличие bundle само по себе не создаёт официальный каталог.
- **Inspector** включает local debugging и unredacted Host fetch capture. Не публикуйте такие captures без отдельной проверки содержимого.

## 8. Публичная документация реализации

- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
- [Plugin Manager](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/boot/plugin-manager)
- [Plugins page](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/client/ui-plugin-manager)

Публичный `master` может измениться раньше установленного релиза. При расхождении для конкретной установки приоритет имеют manifest и README поставленной версии `0.2.2-rc.1`.
