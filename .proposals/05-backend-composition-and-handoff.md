# P05 — Backend, HTTP и передача контракта

**Результат:** соединённый проверенный backend и immutable-пакет для P06. **Владелец:** координатор. **Зависимости:** принятые точные SHA P02/P03/P04; интерфейсы P00 неизменны либо согласованно обновлены. Общие правила: [план](README.md).

## Scope и рабочее место

- Кандидат: `codex/contractor-selection-integration`, `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-integration`. Сначала exclusive shared reservation по AGENTS.md; записать владельца в OpenSpec.
- Последовательно интегрировать принятые module SHA. Разрешённые изменения: `back/recommend/` кроме замороженных ports, `back/http/`, `back/composition.ts`, тонкие route entrypoints в `src/app/`, общие HTTP-проверки и handoff-пакет. Дополнительные shared-правки только явным решением координатора.
- Backend test/preview на `127.0.0.1:3105`, локальные build/temp outputs. Исходный dataset не меняется; настоящие credentials не используются для отрицательных конфигурационных тестов.
- Ни `recommend`, ни HTTP не импортируют внутренний CSV decoder/provider parser. Use case зависит от чистого domain и внедрённых port-функций. Только composition создаёт конкретные adapters.

## Задачи

1. В `recommend` соединить selection и evidence, восстановить локальный порядок по IDs, сформировать фактическую фразу и при наличии проверенную цитату. Рендерить 1–2 предложения без выдуманных качеств. При пустом selection не вызывать AI.
2. Вычислять aggregate mode по фактическим карточкам: все quotes приняты, частично приняты, ни одной, нет карточек. Не определять mode по факту попытки вызова провайдера.
3. В composition выполнить одну загрузку по явному корневому пути и сохранить `ready`/`unavailable` по [политике P00](00-foundation-and-contracts.md#отказ-однократной-загрузки-каталога). Ожидаемый отказ CSV не должен сорвать импорт routes/startup до возможности ответить HTTP 503. Построить adapters через существующий secret loader; ожидаемые AI config failures обрабатывать в отдельной узкой границе. Никакого startup fallback на выдуманные записи, повторной загрузки на каждом запросе или сокрытия неожиданной ошибки.
4. В HTTP реализовать закреплённые validation/normalization и ошибки: unknown fields/options, отсутствующие/null optional values, budget/hours, настоящая дата и фиксированное окно. Handlers не содержат eligibility/ranking rules.
5. Сохранить requestId, safe errors, отмену ожидания/upstream без retry. Возвращать только публичные DTO, необходимые normalized/snapshot facts и диагностические busy IDs; без описаний, полных календарей, секретов или stack traces.
6. Проверить реальные module connections, затем выпустить frontend contract package. Если контракт изменён — сначала согласовать новую версию и остановить зависимые задачи; P06 пока не стартовал.

## Приёмка

- GET options и POST recommendations работают на реальном CSV; все [rehearsal cases](../architecture/implementation-and-verification.md#data-derived-rehearsal-cases) дают ожидаемые IDs/counts/outcomes. Повторные HTTP-запросы и restart сохраняют порядок.
- `matched`, `category_absent`, `no_match` — HTTP 200; validation — 400 (`INVALID_REQUEST`/`DATE_OUT_OF_RANGE`); каталог — 503 `CATALOG_UNAVAILABLE`; неожиданный сбой — безопасный 500 `INTERNAL_ERROR`.
- Запуск с отсутствующим/повреждённым CSV оставляет HTTP доступным: GET options и синтаксически корректный POST получают 503 со своими requestId, без AI и повторного чтения каталога. Исправленный файл подхватывается после restart; до restart сохраняется ожидаемый отказ. Синтетические/временные пути не затрагивают исходный dataset.
- Missing/blank key и `CONFIG_FILE_UNREADABLE`, даже при заполненной process variable, оставляют каталог и подбор рабочими, без provider request. Missing file + действующая process variable работают по loader contract. `CONFIG_INVALID_REQUEST`/неожиданные ошибки не скрываются как обычная AI недоступность. Проверять на synthetic/controlled configuration.
- Controlled whole-batch failures не меняют IDs и дают local fallback. Две accepted quotes + source mismatch дают `mixed`; все null — `catalog_fallback`; empty — `not_needed` без provider call.
- Busy venue, optional filters и валидационные границы имеют реальные наблюдаемые проверки. Повторять существующие проверки только при отсутствии/инвалидации свидетельств.

## Пакет frontend-контракта

Канонический корень один для всех checkout: `D:/Alem/hack-83108e9d-the-power-of-dreams/.shared/specs`.

1. После backend-проверок закрепить backend branch и точный SHA.
2. Под reservation выбрать предлагаемый feature root `contractor-selection/`, version directory `versions/v1/` только если он ещё свободен; подготовить snapshot в кандидатной worktree. Публикация в канонический корень — после коммита по шагу 4; существующую версию не перезаписывать. Root README и version README — на английском.
3. В пакет включить один формат DTO/схемы, success/material-error examples, нужные fixtures, операции, поля/nullable/форматы, ошибки/visible states, env names без значений, запуск и короткую проверку настоящего backend. Указать supported scenarios, contract version, точный backend SHA, текущий integration status, ссылки на OpenSpec/код по Git revision. Не включать внутренний parser, storage или algorithms.
4. При разрешённой публикации отдельно закоммитить snapshot пакета в `.shared/specs/contractor-selection/` **кандидатной worktree**, затем под той же reservation материализовать точный committed snapshot в каноническом абсолютном корне первичного checkout и проверить совпадение. **До записи файлов в канонический корень** сохранить в task card owner task ID, package commit, полный список создаваемых ранее отсутствовавших путей и их контрольные суммы; включить mutable index README, если он тоже создаётся. Не объявлять чужой существующий файл своим и не перезаписывать существующие tracked/изменённые файлы ради материализации: конфликт передать владельцу. Копия в кандидате нужна для Git-истории; потребители читают только канонический корень. Не пытаться коммитить внешний для worktree путь и не делать для этого побочный commit на грязном `main`. В task card P06 **после коммита** записать package commit, absolute version path, contract version и backend SHA. Собственный ещё неизвестный SHA внутрь пакета не записывать.
5. До каждого P06 resume сравнивать version directory с закреплённым package commit; mismatch/absence блокирует зависимую работу. Published package не доказывает наличие backend в `main`.

## Переход пакета под контроль Git

Материализованные в первичном checkout файлы могут оставаться untracked до P07. Совпадение байтов с входящим коммитом **не является гарантией** успешного fast-forward: Git может отказать с `would be overwritten by merge`. Следующую процедуру выполняет координатор в P07 под shared reservation, а P05 заранее передаёт ему перечень собственных материализованных файлов.

1. Остановить потребителей пакета и писателей, подтвердить остановку; владеть reservation на canonical package и продвижение `main`. Закрепить candidate SHA, содержащий package commit, и убедиться, что immutable version в кандидате всё ещё точно совпадает с опубликованной. Смена координатора требует штатной передачи reservation и явной передачи списка материализации.
2. Перед перемещением сверить **полный набор путей и содержимое** canonical version с package commit, Git-статус этих путей в основном checkout и ownership из task card. Проверить также материализованный index README против записанной версии. Отличающийся, лишний, чужой, staged или непредусмотренный файл — блокер, а не объект очистки. Уже tracked и неизменённые файлы не убирать.
3. Для **только перечисленных собственных неизменённых untracked-файлов** подготовить отдельный новый локальный backup-каталог вне путей входящего пакета. Записать абсолютный путь в task card; проверить границы исходных/целевых путей. Переместить эти точные файлы с сохранением структуры и сверить backup с package commit. Не удалять всю `.shared`, не использовать wildcard/`git clean`/stash и не затрагивать другие версии. Содержимое пакета не меняется; пока canonical paths отсутствуют, все потребители остаются остановленными.
4. Только после полного проверенного переноса выполнить разрешённый fast-forward `main` из checkout-владельца ветки. При частичном переносе fast-forward не запускать. Если перенос или продвижение не состоялись, сохранить backup и восстановить из него только свои всё ещё отсутствующие пути; ничего не перезаписывать. Проверить полный восстановленный snapshot до возобновления потребителей. При возникшем конфликте оставить их остановленными и сообщить блокер. Не называть такой результат интеграцией.
5. После успешного fast-forward проверить, что каждый путь incoming package теперь **tracked**, immutable version совпадает с package commit, а index README — с ожидаемым кандидатом. Повторить проверку pin перед возобновлением потребителей; сохранённый backup оставить до подтверждения восстановления и публикации. Удалённый push проверяется отдельно: локальный переход в tracked-состояние ещё не означает `integrated`.

Это план будущих операций; при подготовке этих proposals файлы пакета и Git-индекс не перемещаются и не изменяются.

## Handoff

P06 получает кандидат с backend/package commit, read-only immutable package, проверенные DTO examples и backend launch/check. Если commit/package недоступны из-за hold, отметить блокер frontend handoff; не заменять его передачей произвольных untracked-файлов или одних mock responses.
