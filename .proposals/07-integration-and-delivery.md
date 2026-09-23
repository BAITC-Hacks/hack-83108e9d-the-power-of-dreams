# P07 — Общая приёмка и воспроизводимая доставка

**Результат:** один проверенный кандидат, понятный запуск и точный статус интеграции. **Владелец:** координатор. **Зависимости:** документация после P05; финальная приёмка после P06. Общие правила: [план](README.md).

## Scope и рабочее место

- Продолжить `codex/contractor-selection-integration` в `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-integration` под своей shared reservation. P05 и P07 не имеют двух одновременных писателей кандидата.
- Интеграционные тесты на `127.0.0.1:3107`; финальная документированная демонстрация на `127.0.0.1:3000` после проверки свободного порта и остановки своих предыдущих процессов. Отдельные build/temp/storage outputs.
- Разрешённая ответственность: последовательное включение feature SHA, общие integration/E2E-проверки, README, `.env.example`, `THIRD_PARTY.md`, run/demo-документация, evidence в OpenSpec. Исправление модулей — только после передачи ownership от исполнителя.
- Для run/env/provenance/demo использовать [project-delivery](../.agents/skills/project-delivery/SKILL.md). Ни docs preparation, ни accepted module branch сами по себе не доказывают целостный MVP.

## Задачи

1. Пока P06 пишет `front/`, подготовить документацию по уже проверенному P05: зависимости, env names без секретов, install/build/start, схема работы, demo inputs и ограничения. Не менять исполняемый backend или immutable package под работающим P06 без остановки и нового pin.
2. Последовательно включить точный accepted frontend SHA. Сверить договорённости, реальный diff и актуальный `main`; заморозить кандидат на время приёмки. Использовать доказательства модульных проверок, повторяя только затронутые/неподтверждённые случаи.
3. Проверить установленными командами build/type checks и production launch. Через настоящий HTTP/UI пройти dense, rare и оба пустых исхода; повтор запроса после restart, busy venue, optional filters и обе пары дат. Проверить frontend against real backend, а не mock-only.
4. Закрыть итоговую [live-проверку P00](00-foundation-and-contracts.md#минимальная-live-проверка-ai): dense-тройка и rare-карточка, по каждой — `pass`/`fail`/`not_run` и конкретное основание для источника, релевантности, фактов/длины, а для dense также различимости при скрытых именах. Измерить три uncached запроса до видимого результата, включая первый после старта; сопоставить с ориентиром <10 секунд. Эти же live-ответы можно использовать для оценки качества без дублирующей серии. Не объявлять controlled fallback доказательством live latency/качества.
5. Отдельно пройти controlled AI failure/mixed/local/config cases, отсутствие API call при empty или unavailable configuration, cancel/stale response, корректность ошибок. Не редактировать настоящие credentials ради отрицательных тестов.
6. Следуя финальному README, в чистом checkout принятого source revision выполнить install → private config → build → start → primary scenario. Записать фактический SHA, команды, внешние prerequisites, платный API/network, наблюдения и пропуски. Копия текущих файлов полезна, но не называется clean committed checkout.
7. В README сохранить прозрачные ограничения: starting price и календарь не подтверждают бронь, fixture-mode (если есть) явно обозначен, fallback — не live AI proof. Зафиксировать происхождение данных/материалов; не вводить GPU/DB/Docker/cloud-account как несуществующие требования.

## Интеграция и публикация

- Применяются разрешения task card; существующий no-commit/no-push/no-merge не исчезает после успешной проверки. При hold сохранить максимальную доказанную стадию и точный следующий шаг без публикации.
- До продвижения выполнить [процедуру перехода пакета из P05](05-backend-composition-and-handoff.md#переход-пакета-под-контроль-git): остановить потребителей, сверить ownership/пути/хеши, сохранить и временно убрать только собственную совпадающую untracked-копию, после fast-forward проверить восстановленные tracked-файлы. Чужие или отличающиеся файлы остаются блокером; при неудаче продвижения сохранить backup и безопасно восстановить свои отсутствующие пути до возобновления потребителей.
- При разрешённой публикации: accepted candidate → `ready-to-merge`; сравнить local/remote `main`; выполнить fast-forward из checkout-владельца ветки без потери чужих правок; после проверки tracked-пакета обычным explicit push подтвердить remote history. Не force-push, не обходить branch protection/required checks.
- Если `main` ушёл вперёд, включить новый base и повторить затронутую приёмку. Непроходимый локальный promotion/remote push записать правдиво, не обозначать как `integrated`.
- Только координатор обновляет стадии/checkboxes по правилам AGENTS.md. Report-only изменения evidence отделить от product changes; неизвестный будущий SHA не записывать как факт.
- Сохранить branches/worktree до подтверждённой публикации, сохранения отчёта и отсутствия необходимых незакоммиченных файлов. Reservation освобождает только её владелец после завершения shared-записей/процессов.

## Выходной отчёт

`Feature | Criteria met | Checks | Branch / SHA | main status | Blocker / next step`.

Различать `MERGED AND PUBLISHED`, `BRANCH PUBLISHED, INTEGRATION INCOMPLETE`, `READY TO MERGE, BLOCKER: ...`, `MERGED LOCALLY, PUSH FAILED`, `NOT READY: ...`. Указать skips/live limitations и source revision. Цель — проверенный общий результат, а не сумма успешно запущенных отдельных модулей.

Git-публикация и сдача организатору — отдельные события. `MERGED AND PUBLISHED` подтверждает remote `main`, но не отправку заявки/ссылки/демо организатору. В отчёте отдельно указать готовность материалов и фактический статус сдачи; внешнюю отправку выполнять только при явном поручении пользователя и по известным требованиям организатора.
