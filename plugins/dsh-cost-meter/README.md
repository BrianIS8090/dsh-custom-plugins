# dsh-cost-meter

Плашка остатков лимитов **Kimi Code** для Web GUI DeepSeek Harness.

Пока выбрана модель Kimi (`kimi-coding`, `k3.1-pro`, `k3`, …), в полосе под
полем ввода рядом со штатными счётчиками появляется плашка:

```
Kimi  5ч 75% · мес 92%
```

Это **остаток**, а не израсходованная часть. Наведение курсора показывает
подробности: остаток по 5-часовому, 7-дневному и месячному окну, время сброса,
тариф (если API его отдаёт) и текст ошибки, когда данные недоступны. Клик —
принудительное обновление.

## Как это устроено

| Часть | Файл | Роль |
|---|---|---|
| Host | `lib/index.js` | берёт креденшл Kimi из credential store (OAuth-запись `llm-pi-ai/kimi-coding` или API-ключ из ссылки `KIMI_CODE_API_KEY` / `KIMI_CODING_API_KEY` / `KIMI_CODING_PRO_API_KEY` / `KIMI_API_KEY`), при истечении OAuth-токена обновляет его через `modifyRecord` (та же кросс-процессная блокировка, что у pi-ai), вызывает Kimi API и раздаёт снимок по Fetch-роуту `/api/cost-meter/usage` с TTL-кэшем 60 с |
| Host-хелперы | `lib/kimi.js` | разбор ответа Kimi (текущий и legacy формат), запрос usage, refresh-токен |
| Client | `lib/client.js` | плашка в слоте `conversation.composer.dock` (order 2, после `activity` и `usage`), показывается только для Kimi-модели, опрос раз в 60 с |

Внешние зависимости не нужны: Host использует только `ctx`-сервисы и глобальный
`fetch`, браузерная половина — только `react` из платформенной таблицы модулей.

Kimi API лимитов недокументирован; используется тот же endpoint, что и в Kimi
Code CLI 3.x:

```
GET https://api.kimi.com/coding/v1/usages
Authorization: Bearer <access_token>
```

Ответ (текущий формат): `usages.limit_5h / limit_7d / limit_month_total /
limit_month_code` с `used_ratio` (0..1) и `reset_time`. Legacy-формат
(`usage` + `limits[]`) тоже разбирается.

## Установка

Из корня этого репозитория выполните:

```powershell
dsh plugin --profile desktop add "./plugins/dsh-cost-meter"
```

Если используете другой профиль, замените `desktop` на его имя. Можно также выбрать локальный каталог плагина через **Плагины → Установить сторонний плагин** в Web GUI. После установки полностью перезапустите DSH. Не редактируйте `package.json` профиля и `cordis.patch.yml` вручную: менеджер сам добавит зависимость и бандл `dsh-cost-meter`.

## Требования

- В DSH подключён маршрут Kimi с id `kimi-coding` через `dsh-llm-pi-ai`.
- Сохранён один из креденшлов Kimi (Settings → Models):
  - **API-ключ** Kimi Code — DSH пишет его в credential ref с именем из
    `apiKeyEnv` маршрута (например, `KIMI_CODE_API_KEY` для `kimi-code` или
    `KIMI_CODING_API_KEY` для `kimi-coding`), плагин разрешает ссылку сам;
    переменные окружения с теми же именами тоже подходят;
  - либо **Sign in with Kimi Code** (OAuth) — запись `llm-pi-ai/kimi-coding`;
    плагин читает её и обновляет access-токен по refresh-токену, когда тот
    истёк.
- Сеть до `api.kimi.com` и (для OAuth-обновления) `auth.kimi.com`.

## Ограничения

- Endpoint лимитов неофициальный: при его смене плашка покажет `5ч — · мес —`
  и текст ошибки в подсказке, остальной интерфейс не страдает.
- Штатный счётчик токенов не скрывается: плашка добавляется рядом. В этой
  сборке DSH денежного счётчика в чате нет, только токены.
