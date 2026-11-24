# Внешние пакеты для DSH Desktop `0.2.2-rc.3`

В каталоге хранится только ссылка на пакет и инструкция. Внешние пакеты устанавливаются отдельно и не являются обязательными для запуска самописных плагинов.

| Пакет | Spec для установки | Статус и назначение |
|---|---|---|
| [Prompt Suggestions](https://www.npmjs.com/package/@indexyz/dsh-prompt-suggestions) | `@indexyz/dsh-prompt-suggestions@0.1.1` | По желанию: предлагает следующее сообщение, но не отправляет его. Добавляет отдельный запрос к выбранной модели. |
| [MCP Panel](https://www.npmjs.com/package/dsh-mcp-panel) | `dsh-mcp-panel@0.6.31` | Панель MCP, диагностика и проверка инструментов. Подключения, учётные данные, настройки транспорта и результаты диагностики не входят в этот каталог. |
| [Computer Use Win](https://www.npmjs.com/package/dsh-computer-use-win) | `dsh-computer-use-win@0.5.4` | Не входит в рекомендуемую установку: опциональный Windows-пакет, оставлен для справки. Перед включением проверяйте метаданные конкретной версии и совместимость с вашим DSH. Снимки и OCR могут содержать личные данные. |

В **Plugins → Add plugin → Install a third-party plugin** укажите точный spec из таблицы. Проверьте источник, совместимость, версию, предлагаемые build scripts и итоговое состояние; скачивание не означает активацию. CLI для зарегистрированной Desktop-команды работает так:

```powershell
dsh plugin --profile desktop add dsh-mcp-panel@0.6.31
dsh plugin --profile desktop add ./plugins/agent-team-monitor
```

Для другого профиля укажите его имя. У локальной директории менеджер использует существующие клиентские файлы — выполните сборку заранее там, где она нужна. GUI принимает абсолютный путь к папке или `.tgz`. Если нужен полный перезапуск, выйдите из Desktop через **Quit**, запустите его заново и обновите окно.

## Встроенные компоненты

Agent Teams входит в DSH `0.2.2-rc.3`. Остальные встроенные дополнения выбираются по задаче и не требуют отдельного `npm add`:

- **Auto review** (`@deepseek-ai/dsh-experimental-auto-review`) — дополнительные запросы модели при проверке прав на инструменты.
- **Git worktrees** (`@deepseek-ai/dsh-experimental-tool-worktree`) и **Forge** (`@deepseek-ai/dsh-experimental-forge-bundle`) — worktree и панель PR; не добавляйте дублирующую строку конфигурации вручную.
- **Terminal** (`@deepseek-ai/dsh-experimental-terminal-bundle`) — видимый терминал.
- **Session search** (`@deepseek-ai/dsh-experimental-session-search`) — поиск предыдущих сессий.
- **Reasoning translation** (`@deepseek-ai/dsh-experimental-cot-translation-bundle`) — выбранные фрагменты отправляются сервису перевода.
- **Inspector** (`@deepseek-ai/dsh-experimental-inspector-profile`) — отладка; её логи могут содержать чувствительные данные.
- **Custom plugin indexes** (`@deepseek-ai/dsh-experimental-plugin-market-bundle`) — вкладка Discover для добавленных пользователем индексов.

Точные требования для вашей установки сверяйте с манифестами поставляемой версии [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). Не используйте исключения совместимости, чтобы принудительно включать несовместимый пакет.
