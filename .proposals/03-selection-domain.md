# P03 — Отбор, порядок и причины отказа

**Результат:** чистые детерминированные правила и диагностические данные для UI. **Владелец:** один domain-исполнитель. **Зависимости:** принятый P01. **Параллельно:** P02/P04. Общие правила: [план](README.md).

## Scope и контракт

- Ветка `codex/cs-03-domain`; worktree `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-03`; base — общий SHA P01.
- Изменения только `back/domain/`, **кроме замороженного `types.ts`**, включая проверки. Нет сервера/сети/общего тестового хранилища.
- `select(profiles, normalizedRequest)` получает plain immutable data, возвращает согласованный selection result; точный shape в OpenSpec/P00.
- Разрешены только публичные доменные/JSON-типы. В production-коде запрещены filesystem, CSV parser, HTTP, Next.js, React, AI, secret loader, конкретный catalog adapter.
- Тесты используют закреплённые примеры. Реальные CSV→domain связи проверяет P05; при необходимости читать только публичный loader из базы P01, не незакоммиченный P02.

## Задачи

1. Дополнить P01 до политики, перенесённой из [selection](../architecture/selection-and-explanations.md#proposed-policy-decisions) в OpenSpec; не выбирать альтернативное ранжирование.
2. City/category образуют candidates; проверить busy, budget, format, optional language, optional duration в фиксированном порядке. Каждое исключение учитывается один раз по первой причине.
3. Сортировать eligible по starting price, затем fixed string ID; максимум три. Не использовать locale-dependent/random/provider scoring.
4. Отдельно вернуть `category_absent` и `no_match`, candidate/eligible counts, exclusive reason buckets, все busy IDs в city/category. Не ограничивать busy set только отображаемыми карточками.
5. Structured fields имеют приоритет над prose; бюджет и длительность сравниваются с правильными единицами. Никакой генерации текста UI, мутации входа или вызова провайдера.

## Критерии и проверки

- Результаты October 10/11 и October 1/6 соответствуют [data-derived rehearsal cases](../architecture/implementation-and-verification.md#data-derived-rehearsal-cases); все IDs/порядок проверяются после соединения с настоящим CSV в P05.
- Равный бюджет/равные часы проходят; превышенная длительность и отсутствующий запрошенный язык исключают. `max_hours: null` не исключает по длительности. Цена не умножается на часы.
- Занятая площадка исключается так же, как человек; выбранный реальный ID/date координатор фиксирует для интеграционного сценария.
- Exclusive rejection counts + eligible count = candidate count. Busy IDs полные и относятся к выбранному city/category, даже если нарушены и другие ограничения.
- При равной цене устойчивое сравнение IDs; повтор вызова с теми же данными даёт тот же порядок и не меняет входные массивы.
- Для пустой категории и существующей непроходящей категории — разные нормальные исходы. Глобальная input validation остаётся в HTTP, а не дублируется разными правилами в domain/UI.

## Handoff

Вернуть фактические критерии/проверки, примеры результата, revision/contract revision, пропуски. Исполнитель не меняет contracts/types, общие task checkboxes или `main`. Если shape не позволяет вернуть необходимые факты — остановить затронутую часть и обратиться к координатору; не обходить границу доступом к каталогу/HTTP.
