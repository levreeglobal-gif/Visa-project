export type ContactInput = { name: string; email: string; phone: string; service: string; message: string; honeypot: string };
export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };

export const LIMITS = { name: 100, email: 254, phone: 40, service: 120, message: 4000 } as const;
export const ALLOWED_SERVICES = [
  '', 'IVAC appointment support', 'VFS Global appointment support', 'Korean tourist visa', 'Korean scholarship student visa',
  'Korean business visa', 'GVCW appointment support', 'Indian medical travel', 'Other visa support',
] as const;

/** Trim, NFC-normalise (Bengali-safe), strip control characters (keeping \n and \t when allowed), cap length. */
export function clean(value: unknown, max: number, multiline = false): string {
  if (typeof value !== 'string') return '';
  let v = value.normalize('NFC').replace(/\r\n?/g, '\n');
  v = multiline ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') : v.replace(/[\u0000-\u001F\u007F]/g, ' ');
  v = v.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, ''); // bidi override characters
  return Array.from(v.trim()).slice(0, max).join('');
}
export function validEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/.test(value);
}
export function validateContact(body: unknown): ValidationResult<ContactInput> {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' };
  const b = body as Record<string, unknown>;
  const v: ContactInput = {
    name: clean(b.name, LIMITS.name), email: clean(b.email, LIMITS.email).toLowerCase(), phone: clean(b.phone, LIMITS.phone),
    service: clean(b.service, LIMITS.service), message: clean(b.message, LIMITS.message, true), honeypot: clean(b.website, 300),
  };
  if (v.honeypot) return { ok: true, value: v };
  if (Array.from(v.name).length < 2 || !/\p{L}/u.test(v.name) || !/^[\p{L}\p{M}\p{N} .’'\-]+$/u.test(v.name)) return { ok: false, error: 'Please enter a valid name.' };
  if (!validEmail(v.email)) return { ok: false, error: 'Please enter a valid email address.' };
  if (v.phone && !/^[+()\-\s\d.]{5,40}$/.test(v.phone)) return { ok: false, error: 'Please check the phone number.' };
  if (!(ALLOWED_SERVICES as readonly string[]).includes(v.service)) return { ok: false, error: 'Please choose a service from the list.' };
  if (Array.from(v.message).length < 10) return { ok: false, error: 'Please add a little more detail to your message.' };
  return { ok: true, value: v };
}
export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
export function safeHeaderText(value: string, max = 80): string { return value.replace(/[\r\n]+/g, ' ').slice(0, max); }
/** Only same-site https/http URLs or relative paths; blocks javascript:/data: URLs from admin-entered fields. */
export function safeUrl(value: string, allowRelative = true): string | null {
  const v = value.trim();
  if (!v) return '';
  if (allowRelative && /^\/(?!\/)[^\s]*$/.test(v)) return v;
  try { const u = new URL(v); return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null; } catch { return null; }
}
