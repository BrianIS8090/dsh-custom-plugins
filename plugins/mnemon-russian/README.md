# Неофициальная русская локализация Mnemon

Проект собирает `dsh-mnemon@0.5.42+ru.2` из официального `dsh-mnemon@0.5.42` и четырёх Source-пакетов. Это неофициальная локализация, а не выпуск авторов Mnemon. Изменяются клиентские словари и необходимые точки выбора языка; серверная реализация памяти остаётся побайтово сравнимой с проверенным upstream.

Версии и SHA-512 `dist.integrity` зафиксированы в `upstream.lock.json`. Copyright, MIT-уведомление и список upstream-пакетов находятся в `LICENSE` и `NOTICE.md`.

## Требования

- Node.js `>=20` и npm в `PATH` (npm нужен только для `npm pack`; зависимости сборщика устанавливать не требуется).
- Совместимый DSH: `>=0.2.0-rc.2 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0`.
- Для перегенерации и тестирования guard — sibling-каталог `../mnemon-russian-guard`.

Сборка не читает профиль DSH, установленные плагины или машинные пути. При `prepare` пять официальных npm tarball скачиваются по точным HTTPS URL, проверяются по SHA-512 и безопасно распаковываются в generated `dist/work`. Ссылки, traversal, нестандартные записи tar и несовпадение манифестов отклоняются.

## Чистая сборка и проверки

Из каталога `plugins/mnemon-russian`:

```powershell
node scripts/clean.mjs
node scripts/prepare.mjs
node scripts/build.mjs
node scripts/build-sources.mjs
node --test --test-isolation=none test/*.test.mjs
node ../mnemon-russian-guard/scripts/prepare.mjs
node --test --test-isolation=none ../mnemon-russian-guard/test/*.test.mjs
node scripts/pack.mjs
node scripts/audit-dist.mjs
```

Та же полная последовательность, включая очистку `dist`, запускается одной командой `npm test`. Build-only `package.json` в корне проекта не является манифестом устанавливаемого пакета: рабочий manifest создаётся в `dist/work/package` и проверяется отдельно.

Результат:

- `dist/dsh-mnemon-0.5.42+ru.2.tgz` — локально собранный Starter с четырьмя bundled Source;
- `dist/SHA256SUMS.txt` — SHA-256 архива;
- `dist/work/prepare-receipt.json` — проверенные SHA-512/SHA-256 upstream tarball;
- `dist/work/` — generated upstream, staging и локализованные пакеты; не предназначен для коммита.

`pack.mjs` использует `npm_execpath`, только если он указывает на `npm-cli.js`, иначе `npm`/`npm.cmd` из `PATH`. Скрипты жизненного цикла npm отключены. `audit-dist.mjs` проверяет манифесты, bundled LICENSE/NOTICE, semver peers, соответствие архива staging, опасные пути, признаки секретов и нежелательные файлы данных.

Для воспроизводимости выполните всю последовательность дважды из чистого `dist` в одинаковых версиях Node.js/npm и сравните SHA-256 обоих `.tgz`.

## Установка

1. В менеджере плагинов DSH выберите установку локального пакета и укажите заново собранный `dist/dsh-mnemon-0.5.42+ru.2.tgz`.
2. Полностью перезапустите Harness: bundled Source должны быть разрешены из вложенного `node_modules` нового пакета, а не из прежней hoisted-копии.
3. Дополнительно установите sibling-каталог `plugins/mnemon-russian-guard` как локальный плагин и включите **Mnemon — авторусификатор**. Устанавливать npm-зависимости guard не требуется.
4. После совместимого обновления клиентских пакетов guard может потребовать обновления страницы. Требование полного перезапуска от менеджера обновлений сохраняется.

Пакет помечен `private` и не предназначен для публикации в npm.

## Проверки и ограничения

Тесты используют только сгенерированные файлы из verified upstream: словари и placeholders, ru/en/zh, реальные клиентские bundles в VM, неизменность host JavaScript, semver peers, SHA-512 lock и отказ на опасных tar-записях. Guard дополнительно проверяет идемпотентность, неизвестные строки, anchors, обновление путей, rollback, restart и hardlinks; controller-тесты пишут только в собственный временный каталог ОС.

Локализация рассчитана на зафиксированную компоновку upstream. Новые строки guard оставляет на английском; несовместимые структуры пропускает. Автоматические тесты не заменяют визуальную проверку всех экранов. Сторонние ошибки, квитанции провайдеров и пользовательское содержимое памяти могут оставаться на исходном языке.
