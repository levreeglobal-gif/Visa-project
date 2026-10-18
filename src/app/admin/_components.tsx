import type { ReactNode } from 'react';

export function Csrf({ token }: { token: string }) { return <input type="hidden" name="csrf" value={token} />; }
const MESSAGES: Record<string, string> = {
  saved: 'Saved. Changes are live on the public site.', reset: 'Reset to the built-in defaults.', status: 'Status updated.', note: 'Note added.', deleted: 'Deleted.',
  imported: 'Default FAQ items imported.', password: 'Password changed. Other sessions were signed out.', profile: 'Profile updated.',
  testsent: 'Test email was accepted by the SMTP server.', testfail: 'Test email failed — check the SMTP settings on the server.', testnc: 'Email is not configured (SMTP settings or recipient missing).',
  invalid: 'Please check the highlighted fields and try again.', confirm: 'Tick the confirmation box to delete.', notempty: 'FAQ list is not empty, so nothing was imported.',
  badcurrent: 'Current password is incorrect.', mismatch: 'New passwords do not match.', weak: 'Password is too weak: use 12+ characters with at least three character types.',
  limited: 'Too many attempts. Please wait and try again.', taken: 'That email is already in use.', bad: 'Incorrect email or password.', unavailable: 'The service is temporarily unavailable. Check the database configuration.',
};
export function Flash({ ok, err }: { ok?: string; err?: string }) {
  const code = err || ok; if (!code || !MESSAGES[code]) return null;
  return <p className={`admin-flash ${err ? 'admin-flash-err' : 'admin-flash-ok'}`} role={err ? 'alert' : 'status'}>{MESSAGES[code]}</p>;
}
export function Card({ title, children }: { title?: string; children: ReactNode }) { return <section className="admin-card">{title && <h2>{title}</h2>}{children}</section>; }
export const fmt = (d: Date | string) => new Date(d).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' });
export const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
