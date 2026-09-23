# P90 — Необязательный эксперимент NVIDIA

**Результат:** измеренное решение «оставить baseline / предложить изменение». **Приоритет:** после обязательного MVP и доставки. **Зависимости:** обязательная приёмка P07 пройдена, время на запуск/демо защищено. Это не недостающая часть MVP. Общие правила: [план](README.md).

## Scope

- Только при отдельно активированном эксперименте. Предлагаемые ветка/worktree: `codex/cs-90-nvidia`, `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-90`; base — принятый MVP SHA.
- Отдельное будущее OpenSpec-изменение после явной фиксации состояния MVP; не переключать активный change молча. Эксперимент не меняет файлы продукта в общей integration-worktree.
- Один владелец. Изолированные experiment artifacts и checks; точные allowed paths определить в его task card перед стартом. Интерактивного UI/нового сервиса не требуется.
- Hosted NVIDIA API при реально доступных account/model/key; no local GPU, Brev, NIM container, embeddings/vector DB или дополнительный пользовательский ввод. Ключ — через existing secrets boundary, никаких значений в artifacts.

## Задачи и предел

1. Следовать [optional checkpoint](../architecture/implementation-and-verification.md#optional-nvidia-checkpoint), первоначальный timebox **15 минут**, без зарезервированного времени из обязательного бюджета.
2. На одинаковых уже eligible наборах сравнить price/ID baseline с semantic reranking по существующим полям запроса и описаниям. Hard filters неизменны.
3. Проверить наблюдаемый смысл выбора, rare/empty, повторяемость после restart, provider unavailability, общую задержку и реальную доступность модели. Версию/форматы API подтвердить актуальной документацией при выполнении, не считать старую ссылку proof доступа.
4. При неубедительном результате или исчерпании времени сохранить MVP; записать deferred/rejected и evidence. Не сливать эксперимент «потому что реализован».
5. Принятие иного ранжирования требует сначала обновить policy/contracts/ожидания в OpenSpec, затем пройти затронутые проверки. Score/fallback не должен молча менять порядок одного запроса. Нельзя внедрить эксперимент простым merge поверх замороженного baseline.

## Отдельная ситуация: OpenAI недоступен

Замена explanation provider — другой сценарий, не автоматический запуск этого reranking proposal. Координатор оформляет решение и границы в активном OpenSpec: один выбранный provider, проверенные формат/качество/deadline, актуальные mode labels. NVIDIA-ответ нельзя обозначать `openai_evidence`; автоматический fallback между облачными провайдерами не входит в MVP.

## Handoff

Вернуть фактическое сравнение и решение, cost/latency/quality limitations, tested revision и применимость. P90 не является условием `integrated` для P00–P07 и не оправдывает пропуск README, live-quality или clean-checkout проверки.
