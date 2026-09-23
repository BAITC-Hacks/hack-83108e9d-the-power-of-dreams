export const money = (value: number) => new Intl.NumberFormat('ru-RU').format(value);

export function displayDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(date);
}

export function optionalConditions(language?: string, duration?: string | number): string {
  return [language, duration !== undefined && String(duration).trim() ? `${String(duration).replace('.', ',')} ч` : ''].filter(Boolean).join(', ');
}
