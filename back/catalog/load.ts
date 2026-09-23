import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse, CsvError } from 'csv-parse/sync';
import type { LoadCatalog, Profile } from '../domain/types.ts';
import { isCalendarDate } from '../domain/date.ts';

const headers = ['id', 'anon_name', 'categories', 'city', 'city_imputed', 'synthetic', 'price_from_kzt', 'price_imputed', 'event_formats', 'languages', 'max_hours', 'busy_dates', 'description'];
class InvalidCatalog extends Error {}
function requireValue(condition: boolean): asserts condition { if (!condition) throw new InvalidCatalog(); }
function list(value: string, allowEmpty = false): readonly string[] {
  if (allowEmpty && !value) return Object.freeze([]);
  const values = value.split('|').map(v => v.trim());
  requireValue(values.every(Boolean) && new Set(values).size === values.length);
  return Object.freeze(values);
}
function flag(value: string): boolean {
  requireValue(value === 'TRUE' || value === 'FALSE');
  return value === 'TRUE';
}
const sorted = (values: readonly string[]) => Object.freeze([...new Set(values)].sort());

export const loadCatalog: LoadCatalog = async path => {
  let bytes: Buffer;
  try { bytes = await readFile(path); }
  catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return { status: 'unavailable', error: { kind: 'missing' } };
    if (['EACCES', 'EPERM', 'EISDIR', 'ENOTDIR'].includes(code ?? '')) return { status: 'unavailable', error: { kind: 'unreadable' } };
    throw error;
  }
  try {
    let source: string;
    try { source = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch { throw new InvalidCatalog(); }
    const records: Record<string, string>[] = parse(source, { bom: true, skip_empty_lines: true, columns: (columns: string[]) => {
      requireValue(columns.length === headers.length && new Set(columns).size === headers.length && headers.every(h => columns.includes(h)));
      return columns;
    } });
    requireValue(records.length > 0);
    const ids = new Set<string>();
    const profiles: Profile[] = records.map(row => {
      requireValue(headers.every(h => typeof row[h] === 'string'));
      requireValue(/^HK-\d+$/.test(row.id) && !ids.has(row.id)); ids.add(row.id);
      requireValue([row.anon_name, row.city, row.description].every(v => v.trim().length > 0));
      const price = Number(row.price_from_kzt);
      requireValue(/^\d+$/.test(row.price_from_kzt) && Number.isSafeInteger(price) && price > 0);
      const maxHours = row.max_hours === '' ? null : Number(row.max_hours);
      requireValue(maxHours === null || (row.max_hours.trim() !== '' && Number.isFinite(maxHours) && maxHours > 0));
      const busyDates = list(row.busy_dates, true);
      requireValue(busyDates.every(d => isCalendarDate(d) && d >= '2026-09-23' && d <= '2026-12-31'));
      return Object.freeze({ id: row.id, name: row.anon_name.trim(), city: row.city.trim(), description: row.description,
        categories: list(row.categories), eventFormats: list(row.event_formats), languages: list(row.languages),
        priceFromKzt: price, maxHours, busyDates,
        qualityFlags: Object.freeze({ synthetic: flag(row.synthetic), cityImputed: flag(row.city_imputed), priceImputed: flag(row.price_imputed) }) });
    });
    return { status: 'ready', snapshot: Object.freeze({ profiles: Object.freeze(profiles),
      catalogVersion: `sha256:${createHash('sha256').update(bytes).digest('hex')}`,
      options: Object.freeze({ cities: sorted(profiles.map(p => p.city)), categories: sorted(profiles.flatMap(p => p.categories)),
        eventFormats: sorted(profiles.flatMap(p => p.eventFormats)), languages: sorted(profiles.flatMap(p => p.languages)),
        dateWindow: Object.freeze({ min: '2026-09-23', max: '2026-12-31' }) }) }) };
  } catch (error) {
    if (error instanceof InvalidCatalog || error instanceof CsvError) return { status: 'unavailable', error: { kind: 'invalid' } };
    throw error;
  }
};
