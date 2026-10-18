import { clean, safeUrl, validEmail } from '@/lib/security/validation';

export type FieldKind = 'text' | 'textarea' | 'lines' | 'select' | 'url' | 'email';
export type Field = { name: string; label: string; kind: FieldKind; max: number; options?: readonly string[]; help?: string; optional?: boolean };
export type ContentDef = { key: string; label: string; group: 'Home' | 'Service pages' | 'SEO' | 'Site'; route?: string; fields: Field[] };
export type Values = Record<string, string | string[]>;

export const MAX_LINES = 20;
export const ROUTES: { route: string; label: string }[] = [
  { route: '/', label: 'Home' }, { route: '/about', label: 'About' },
  { route: '/vfs-global-appointment-services', label: 'VFS Global Appointment Services' },
  { route: '/gvcw-appointment-support', label: 'GVCW Appointment Support' },
  { route: '/ivac-appointment-services', label: 'IVAC Appointment Services — All Missions' },
  { route: '/korean-visa-processing', label: 'Korean Visa Processing' },
  { route: '/visa-processing-services', label: 'Visa Processing Services' }, { route: '/blog', label: 'Blog & Visa Guidance' },
  { route: '/faq', label: 'FAQ' }, { route: '/contact', label: 'Contact' },
  { route: '/privacy-policy', label: 'Privacy Policy (draft)' }, { route: '/terms-of-use', label: 'Terms of Use (draft)' },
];
export const SERVICE_SLUGS = [
  { slug: 'vfs-global-appointment-services', label: 'VFS Global Appointment Services' },
  { slug: 'gvcw-appointment-support', label: 'GVCW Appointment Support' },
  { slug: 'ivac-appointment-services', label: 'IVAC Appointment Services' },
  { slug: 'korean-visa-processing', label: 'Korean Visa Processing' },
  { slug: 'visa-processing-services', label: 'Visa Processing Services' },
] as const;

const serviceFields: Field[] = [
  { name: 'eyebrow', label: 'Small heading above title', kind: 'text', max: 120 },
  { name: 'title', label: 'Page title (H1)', kind: 'text', max: 160 },
  { name: 'intro', label: 'Introduction', kind: 'textarea', max: 800 },
  { name: 'accent', label: 'Colour accent', kind: 'select', max: 10, options: ['copper', 'navy', 'teal'] },
  { name: 'highlights', label: 'What we support (one per line)', kind: 'lines', max: 300 },
  { name: 'scopeTitle', label: 'Service scope heading', kind: 'text', max: 160 },
  { name: 'scope', label: 'Service scope items (one per line)', kind: 'lines', max: 500 },
  { name: 'process', label: 'Process steps (one per line)', kind: 'lines', max: 300, optional: true },
  { name: 'note', label: 'Notice text', kind: 'textarea', max: 600, optional: true },
];
const seoFields: Field[] = [
  { name: 'title', label: 'SEO title', kind: 'text', max: 70, optional: true, help: 'Aim for under 60 characters.' },
  { name: 'description', label: 'SEO description', kind: 'textarea', max: 200, optional: true, help: 'Aim for 120–160 characters.' },
  { name: 'canonical', label: 'Canonical URL (blank = this page)', kind: 'url', max: 300, optional: true },
  { name: 'ogTitle', label: 'Open Graph title', kind: 'text', max: 90, optional: true },
  { name: 'ogDescription', label: 'Open Graph description', kind: 'textarea', max: 200, optional: true },
  { name: 'ogImage', label: 'Open Graph image URL (blank = default)', kind: 'url', max: 300, optional: true },
];
export const DEFS: ContentDef[] = [
  { key: 'home', label: 'Homepage hero & sections', group: 'Home', route: '/', fields: [
    { name: 'heroEyebrow', label: 'Hero small heading', kind: 'text', max: 80 },
    { name: 'heroLine1', label: 'Hero headline (first part)', kind: 'text', max: 60 },
    { name: 'heroLine2Prefix', label: 'Hero headline (second line, before highlighted word)', kind: 'text', max: 60 },
    { name: 'heroEm', label: 'Hero highlighted word', kind: 'text', max: 40 },
    { name: 'heroIntro', label: 'Hero introduction', kind: 'textarea', max: 400 },
    { name: 'ctaPrimary', label: 'Primary button label', kind: 'text', max: 40 },
    { name: 'ctaSecondary', label: 'Secondary link label', kind: 'text', max: 40 },
    { name: 'priorityIntro', label: 'Priority services intro', kind: 'textarea', max: 400 },
    { name: 'processCopy', label: 'Process section text', kind: 'textarea', max: 500 },
    { name: 'faqHighlightQ', label: 'Homepage FAQ highlight — question', kind: 'text', max: 200 },
    { name: 'faqHighlightA', label: 'Homepage FAQ highlight — answer', kind: 'textarea', max: 400 },
    { name: 'ctaBandTitle', label: 'Bottom call-to-action title', kind: 'text', max: 120 },
    { name: 'ctaBandText', label: 'Bottom call-to-action text', kind: 'textarea', max: 300 },
  ] },
  ...SERVICE_SLUGS.map((s): ContentDef => ({ key: `service:${s.slug}`, label: s.label, group: 'Service pages', route: `/${s.slug}`, fields: serviceFields })),
  ...ROUTES.map((r): ContentDef => ({ key: `seo:${r.route}`, label: `SEO — ${r.label}`, group: 'SEO', route: r.route, fields: seoFields })),
  { key: 'site', label: 'Contact information, social links & site settings', group: 'Site', fields: [
    { name: 'phones', label: 'Public phone / WhatsApp numbers (one per line)', kind: 'lines', max: 40, help: 'Bangladesh numbers like 01708-399992 are converted to +880… for tel: and WhatsApp links.' },
    { name: 'location', label: 'Office address', kind: 'text', max: 200 },
    { name: 'publicEmail', label: 'Public contact email (shown on site; leave blank to hide)', kind: 'email', max: 254, optional: true },
    { name: 'contactRecipient', label: 'Enquiry notification recipient (private, never shown publicly)', kind: 'email', max: 254, optional: true, help: 'Overrides CONTACT_EMAIL. Owner must confirm.' },
    { name: 'siteUrl', label: 'Site base URL (used for canonical, sitemap, Open Graph)', kind: 'url', max: 200 },
    { name: 'facebook', label: 'Facebook URL', kind: 'url', max: 300, optional: true },
    { name: 'instagram', label: 'Instagram URL', kind: 'url', max: 300, optional: true },
    { name: 'linkedin', label: 'LinkedIn URL', kind: 'url', max: 300, optional: true },
    { name: 'youtube', label: 'YouTube URL', kind: 'url', max: 300, optional: true },
    { name: 'x', label: 'X / Twitter URL', kind: 'url', max: 300, optional: true },
  ] },
];
export function defFor(key: string): ContentDef | undefined { return DEFS.find((d) => d.key === key); }

export type ParseResult = { ok: true; values: Values } | { ok: false; errors: Record<string, string> };
/** Turns submitted form data into a validated values object. Unknown fields are ignored; every field is length-limited. */
export function parseContentForm(def: ContentDef, get: (name: string) => unknown): ParseResult {
  const values: Values = {}; const errors: Record<string, string> = {};
  for (const f of def.fields) {
    const raw = get(f.name);
    if (f.kind === 'lines') {
      const items = (typeof raw === 'string' ? raw.split('\n') : []).map((l) => clean(l, f.max)).filter(Boolean);
      if (items.length > MAX_LINES) errors[f.name] = `At most ${MAX_LINES} lines.`;
      else if (!items.length && !f.optional && f.name !== 'phones') errors[f.name] = 'This field is required.';
      values[f.name] = items;
      continue;
    }
    const v = clean(raw, f.max, f.kind === 'textarea');
    if (!v) { if (!f.optional) errors[f.name] = 'This field is required.'; values[f.name] = ''; continue; }
    if (f.kind === 'select' && !(f.options || []).includes(v)) { errors[f.name] = 'Invalid choice.'; continue; }
    if (f.kind === 'email' && !validEmail(v.toLowerCase())) { errors[f.name] = 'Enter a valid email address.'; continue; }
    if (f.kind === 'url') {
      const u = safeUrl(v, false);
      if (u === null || u === '') { errors[f.name] = 'Enter a full http(s) URL.'; continue; }
      values[f.name] = u; continue;
    }
    values[f.name] = f.kind === 'email' ? v.toLowerCase() : v;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, values };
}
/** Overlay stored values on defaults, accepting only fields that exist in the schema and have the right type. */
export function mergeWithDefaults<T extends Record<string, unknown>>(def: ContentDef, defaults: T, stored: unknown): T {
  if (!stored || typeof stored !== 'object') return defaults;
  const out: Record<string, unknown> = { ...defaults };
  for (const f of def.fields) {
    const s = (stored as Record<string, unknown>)[f.name];
    if (f.kind === 'lines' && Array.isArray(s) && s.every((x) => typeof x === 'string')) { if (s.length || f.optional) out[f.name] = s; }
    else if (f.kind !== 'lines' && typeof s === 'string') { if (s || f.optional) out[f.name] = s; }
  }
  return out as T;
}
/** BD number → tel/WhatsApp forms. Returns null if it does not look like a phone number. */
export function normalizePhone(label: string): { label: string; tel: string; whatsapp: string } | null {
  const digits = label.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return null;
  const intl = digits.startsWith('880') ? digits : digits.startsWith('0') ? `880${digits.slice(1)}` : digits;
  return { label: label.trim(), tel: `+${intl}`, whatsapp: intl };
}
