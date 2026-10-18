import type { Metadata } from 'next';
import { exec, query, type RowDataPacket } from './db';
import { defFor, mergeWithDefaults, normalizePhone, type Values } from '@/lib/content-schema';
import { site as siteDefaults } from '@/lib/site';

/** Public reads never throw: if the DB is unreachable the site falls back to source defaults. */
export async function readStored(key: string): Promise<unknown | null> {
  try {
    const rows = await query<RowDataPacket & { value_json: string }>('SELECT value_json FROM content_entries WHERE content_key = ? LIMIT 1', [key]);
    return rows[0] ? JSON.parse(rows[0].value_json) : null;
  } catch { return null; }
}
export async function saveContent(key: string, values: Values, adminId: number): Promise<void> {
  if (!defFor(key)) throw new Error('Unknown content key.');
  await exec(
    `INSERT INTO content_entries (content_key, value_json, updated_by) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_by = VALUES(updated_by)`, [key, JSON.stringify(values), adminId]);
}
export async function resetContent(key: string): Promise<void> { await exec('DELETE FROM content_entries WHERE content_key = ?', [key]); }
// pageContent: merge DB overrides over source defaults
export async function pageContent<T extends Record<string, unknown>>(key: string, defaults: T): Promise<T> {
  const def = defFor(key);
  return def ? mergeWithDefaults(def, defaults, await readStored(key)) : defaults;
}

export type PublicSite = {
  name: string; tagline: string; url: string; location: string; publicEmail: string;
  phones: { label: string; tel: string; whatsapp: string }[]; social: { name: string; url: string }[];
};
export async function publicSite(): Promise<PublicSite> {
  const defaults = {
    phones: siteDefaults.phones.map((p) => p.label), location: siteDefaults.location, publicEmail: '', contactRecipient: '', siteUrl: siteDefaults.url,
    facebook: '', instagram: '', linkedin: '', youtube: '', x: '',
  } as Record<string, unknown>;
  const s = mergeWithDefaults(defFor('site')!, defaults, await readStored('site')) as Record<string, string | string[]>;
  const phones = (s.phones as string[]).map(normalizePhone).filter((p): p is NonNullable<typeof p> => p !== null);
  const social = (['facebook', 'instagram', 'linkedin', 'youtube', 'x'] as const)
    .map((k) => ({ name: k === 'x' ? 'X' : k[0].toUpperCase() + k.slice(1), url: String(s[k] || '') })).filter((x) => x.url);
  return {
    name: siteDefaults.name, tagline: siteDefaults.tagline, url: String(s.siteUrl).replace(/\/+$/, ''), location: String(s.location),
    publicEmail: String(s.publicEmail || ''), phones: phones.length ? phones : [...siteDefaults.phones], social,
  };
}
/** Private recipient for notification emails: admin setting first, then CONTACT_EMAIL env. Never exposed publicly. */
export async function contactRecipient(): Promise<string> {
  const s = (await readStored('site')) as Record<string, unknown> | null;
  const fromDb = typeof s?.contactRecipient === 'string' ? s.contactRecipient.trim() : '';
  return fromDb || (process.env.CONTACT_EMAIL || '').trim();
}
export async function pageMetadata(route: string, defaults: { title?: string; description?: string }): Promise<Metadata> {
  const def = defFor(`seo:${route}`)!;
  const s = mergeWithDefaults(def, { title: defaults.title || '', description: defaults.description || '', canonical: '', ogTitle: '', ogDescription: '', ogImage: '' }, await readStored(`seo:${route}`));
  const base = (await publicSite()).url;
  const canonical = s.canonical || (route === '/' ? '/' : route);
  const md: Metadata = { alternates: { canonical } };
  if (s.title) md.title = route === '/' ? { absolute: s.title } : s.title;
  if (s.description) md.description = s.description;
  md.openGraph = {
    title: s.ogTitle || s.title || undefined, description: s.ogDescription || s.description || undefined,
    url: canonical.startsWith('http') ? canonical : `${base}${canonical === '/' ? '' : canonical}`, siteName: 'Roopo Visa', type: 'website',
    images: [{ url: s.ogImage || '/og-image.png', width: 1200, height: 630, alt: 'Roopo Visa — visa application support' }],
  };
  return md;
}

export type FaqItem = { id: number; question: string; answer: string; sortOrder: number; published: boolean };
export async function listFaqs(includeHidden = false): Promise<FaqItem[]> {
  const rows = await query<RowDataPacket & { id: number; question: string; answer: string; sort_order: number; published: number }>(
    `SELECT id, question, answer, sort_order, published FROM faq_items ${includeHidden ? '' : 'WHERE published = 1'} ORDER BY sort_order, id`);
  return rows.map((r) => ({ id: Number(r.id), question: r.question, answer: r.answer, sortOrder: Number(r.sort_order), published: Boolean(r.published) }));
}
/** Public FAQ: DB items if any exist (admin has taken over), otherwise the source defaults. */
export async function publicFaqs(defaults: readonly (readonly [string, string])[]): Promise<[string, string][]> {
  try {
    const total = await query<RowDataPacket & { c: number }>('SELECT COUNT(*) AS c FROM faq_items');
    if (Number(total[0]?.c ?? 0) === 0) return defaults.map(([q, a]) => [q, a]);
    return (await listFaqs(false)).map((f) => [f.question, f.answer] as [string, string]);
  } catch { return defaults.map(([q, a]) => [q, a]); }
}
export async function importFaqDefaults(defaults: readonly (readonly [string, string])[]): Promise<number> {
  const existing = Number((await query<RowDataPacket & { c: number }>('SELECT COUNT(*) AS c FROM faq_items'))[0]?.c ?? 0);
  if (existing > 0) return 0;
  let i = 0;
  for (const [q, a] of defaults) await exec('INSERT INTO faq_items (question, answer, sort_order, published) VALUES (?, ?, ?, 1)', [q, a, (i += 10)]);
  return defaults.length;
}

import { HOME_DEFAULTS, SERVICE_DEFAULTS, SEO_DEFAULTS } from '@/lib/content-defaults';
/** Built-in defaults for any editable key (used by the admin editor to pre-fill and to reset). */
export function defaultsFor(key: string): Record<string, unknown> | null {
  if (key === 'home') return { ...HOME_DEFAULTS };
  if (key === 'site') return { phones: siteDefaults.phones.map((p) => p.label), location: siteDefaults.location, publicEmail: '', contactRecipient: '', siteUrl: siteDefaults.url, facebook: '', instagram: '', linkedin: '', youtube: '', x: '' };
  if (key.startsWith('service:')) { const d = SERVICE_DEFAULTS[key.slice(8)]; return d ? { ...d, process: d.process ?? [], note: d.note ?? '' } : null; }
  if (key.startsWith('seo:')) { const d = SEO_DEFAULTS[key.slice(4)]; return d ? { ...d, canonical: '', ogTitle: '', ogDescription: '', ogImage: '' } : null; }
  return null;
}
export async function effectiveContent(key: string): Promise<{ values: Record<string, unknown>; customised: boolean } | null> {
  const def = defFor(key), d = defaultsFor(key);
  if (!def || !d) return null;
  const stored = await readStored(key);
  return { values: mergeWithDefaults(def, d, stored), customised: stored !== null };
}
