'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { audit, currentAdmin, login, logout, requireAdminAction, revokeOtherSessions } from '@/lib/server/auth';
import { exec, query, type RowDataPacket } from '@/lib/server/db';
import { addNote, deleteEnquiry, updateStatus } from '@/lib/server/enquiries';
import { importFaqDefaults, resetContent, saveContent } from '@/lib/server/cms';
import { sendEnquiryEmail } from '@/lib/server/mailer';
import * as rate from '@/lib/server/ratelimit';
import { hashBucket } from '@/lib/server/request';
import { hashPassword, passwordPolicyError, verifyPassword } from '@/lib/security/password';
import { clean, validEmail } from '@/lib/security/validation';
import { validCsrf } from '@/lib/security/tokens';
import { defFor, parseContentForm } from '@/lib/content-schema';
import { FAQ_DEFAULTS } from '@/lib/content-defaults';
import { saveBlogPost, deleteBlogPost } from '@/lib/server/blog';

const go = (path: string, kind: 'ok' | 'err', code: string, extra = ''): never => redirect(`${path}${path.includes('?') ? '&' : '?'}${kind}=${code}${extra}`);
const str = (fd: FormData, k: string) => (typeof fd.get(k) === 'string' ? (fd.get(k) as string) : '');
const publish = () => { revalidatePath('/', 'layout'); };

export async function loginAction(formData: FormData) {
  let code = 'unavailable';
  try {
    const r = await login(clean(str(formData, 'email'), 254), str(formData, 'password'));
    code = r.ok ? 'ok' : r.error.startsWith('Too many') ? 'limited' : 'bad';
  } catch { code = 'unavailable'; }
  if (code === 'ok') redirect('/admin');
  return go('/admin/login', 'err', code);
}
export async function logoutAction(formData: FormData) {
  const a = await currentAdmin();
  if (a && !validCsrf(a.csrf, formData.get('csrf'))) throw new Error('Security check failed.');
  await logout();
  redirect('/admin/login');
}

export async function updateStatusAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const id = Number(str(formData, 'id'));
  const ok = await updateStatus(id, str(formData, 'status'));
  if (ok) await audit(a.id, 'enquiry_status', `#${id} → ${str(formData, 'status')}`);
  return go(`/admin/enquiries/${id}`, ok ? 'ok' : 'err', ok ? 'status' : 'invalid');
}
export async function addNoteAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const id = Number(str(formData, 'id'));
  const note = clean(str(formData, 'note'), 2000, true);
  if (!Number.isSafeInteger(id) || id < 1 || note.length < 1) return go(`/admin/enquiries/${id > 0 ? id : ''}`, 'err', 'invalid');
  await addNote(id, a.id, note);
  return go(`/admin/enquiries/${id}`, 'ok', 'note');
}
export async function deleteEnquiryAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const id = Number(str(formData, 'id'));
  if (str(formData, 'confirm') !== 'yes') return go(`/admin/enquiries/${id}`, 'err', 'confirm');
  await deleteEnquiry(id);
  await audit(a.id, 'enquiry_deleted', `#${id}`);
  return go('/admin/enquiries', 'ok', 'deleted');
}

export async function saveContentAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const key = str(formData, 'key');
  const def = defFor(key);
  if (!def) return go('/admin/content', 'err', 'invalid');
  const parsed = parseContentForm(def, (n) => formData.get(n));
  const back = `/admin/content?key=${encodeURIComponent(key)}`;
  if (!parsed.ok) return go(back, 'err', 'invalid', `&fields=${encodeURIComponent(Object.keys(parsed.errors).join(','))}`);
  await saveContent(key, parsed.values, a.id);
  await audit(a.id, 'content_saved', key);
  publish();
  return go(back, 'ok', 'saved');
}
export async function resetContentAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const key = str(formData, 'key');
  if (!defFor(key)) return go('/admin/content', 'err', 'invalid');
  await resetContent(key);
  await audit(a.id, 'content_reset', key);
  publish();
  return go(`/admin/content?key=${encodeURIComponent(key)}`, 'ok', 'reset');
}

export async function createFaqAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const q = clean(str(formData, 'question'), 300), ans = clean(str(formData, 'answer'), 2000, true);
  if (q.length < 5 || ans.length < 5) return go('/admin/faq', 'err', 'invalid');
  const max = Number((await query<RowDataPacket & { m: number | null }>('SELECT MAX(sort_order) AS m FROM faq_items'))[0]?.m ?? 0);
  await exec('INSERT INTO faq_items (question, answer, sort_order, published) VALUES (?, ?, ?, 1)', [q, ans, max + 10]);
  await audit(a.id, 'faq_created'); publish();
  return go('/admin/faq', 'ok', 'saved');
}
export async function saveFaqAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const id = Number(str(formData, 'id'));
  const q = clean(str(formData, 'question'), 300), ans = clean(str(formData, 'answer'), 2000, true);
  const order = Math.max(-100000, Math.min(100000, Math.trunc(Number(str(formData, 'sort_order')) || 0)));
  if (!Number.isSafeInteger(id) || q.length < 5 || ans.length < 5) return go('/admin/faq', 'err', 'invalid');
  await exec('UPDATE faq_items SET question = ?, answer = ?, sort_order = ?, published = ? WHERE id = ?', [q, ans, order, str(formData, 'published') === 'on' ? 1 : 0, id]);
  await audit(a.id, 'faq_saved', `#${id}`); publish();
  return go('/admin/faq', 'ok', 'saved');
}
export async function deleteFaqAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const id = Number(str(formData, 'id'));
  if (!Number.isSafeInteger(id)) return go('/admin/faq', 'err', 'invalid');
  await exec('DELETE FROM faq_items WHERE id = ?', [id]);
  await audit(a.id, 'faq_deleted', `#${id}`); publish();
  return go('/admin/faq', 'ok', 'deleted');
}
export async function importFaqAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const n = await importFaqDefaults(FAQ_DEFAULTS);
  await audit(a.id, 'faq_imported', String(n)); publish();
  return go('/admin/faq', n ? 'ok' : 'err', n ? 'imported' : 'notempty');
}


function blogSlug(raw: string, title: string): string {
  const value = (raw.trim() || title).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 180).replace(/-+$/g, '');
  return value;
}
export async function saveBlogPostAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const rawId = str(formData, 'id'); const id = rawId ? Number(rawId) : undefined;
  const title = clean(str(formData, 'title'), 180); const slug = blogSlug(str(formData, 'slug'), title);
  const excerpt = clean(str(formData, 'excerpt'), 500, true); const body = clean(str(formData, 'body'), 100000, true);
  const category = clean(str(formData, 'category'), 100) || 'Visa guidance';
  const tags = clean(str(formData, 'tags'), 500).split(',').map((x) => clean(x, 40)).filter(Boolean).slice(0, 12);
  const authorName = clean(str(formData, 'author_name'), 100) || 'Roopo Visa Editorial Team';
  const seoTitle = clean(str(formData, 'seo_title'), 70); const seoDescription = clean(str(formData, 'seo_description'), 200, true);
  const ogImage = clean(str(formData, 'og_image'), 500);
  if (id !== undefined && (!Number.isSafeInteger(id) || id < 1) || title.length < 5 || slug.length < 2 || body.length < 30 || excerpt.length < 10) return go('/admin/blog', 'err', 'invalid');
  if (ogImage && !/^https:\/\//i.test(ogImage) && !ogImage.startsWith('/')) return go('/admin/blog', 'err', 'invalid');
  try {
    const postId = await saveBlogPost({ id, slug, title, excerpt, body, category, tags, authorName, seoTitle, seoDescription, ogImage, published: str(formData, 'published') === 'on' });
    await audit(a.id, id ? 'blog_updated' : 'blog_created', `#${postId} ${slug}`); publish(); revalidatePath('/blog'); revalidatePath(`/blog/${slug}`);
    return go('/admin/blog', 'ok', 'saved');
  } catch (e) { const code = (e as { code?: string })?.code; return go('/admin/blog', 'err', code === 'ER_DUP_ENTRY' ? 'slugtaken' : 'savefailed'); }
}
export async function deleteBlogPostAction(formData: FormData) {
  const a = await requireAdminAction(formData); const id = Number(str(formData, 'id'));
  if (!Number.isSafeInteger(id) || id < 1 || str(formData, 'confirm') !== 'yes') return go('/admin/blog', 'err', 'invalid');
  await deleteBlogPost(id); await audit(a.id, 'blog_deleted', `#${id}`); publish(); revalidatePath('/blog'); return go('/admin/blog', 'ok', 'deleted');
}

export async function changePasswordAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const current = str(formData, 'current'), next = str(formData, 'next'), again = str(formData, 'again');
  const bucket = hashBucket(`pw:${a.id}`);
  if (await rate.tooMany(bucket, 'pw_fail', 5, 900)) return go('/admin/settings', 'err', 'limited');
  const row = (await query<RowDataPacket & { password_hash: string }>('SELECT password_hash FROM admin_users WHERE id = ?', [a.id]))[0];
  if (!row || !(await verifyPassword(current.slice(0, 200), row.password_hash))) { await rate.record(bucket, 'pw_fail'); return go('/admin/settings', 'err', 'badcurrent'); }
  if (next !== again) return go('/admin/settings', 'err', 'mismatch');
  if (passwordPolicyError(next, a.email)) return go('/admin/settings', 'err', 'weak');
  await exec('UPDATE admin_users SET password_hash = ? WHERE id = ?', [await hashPassword(next), a.id]);
  await revokeOtherSessions(a.id, a.tokenHash);
  await audit(a.id, 'password_changed');
  return go('/admin/settings', 'ok', 'password');
}
export async function updateProfileAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const name = clean(str(formData, 'display_name'), 100), email = clean(str(formData, 'email'), 254).toLowerCase();
  if (name.length < 2 || !validEmail(email)) return go('/admin/settings', 'err', 'invalid');
  if (email !== a.email) {
    const row = (await query<RowDataPacket & { password_hash: string }>('SELECT password_hash FROM admin_users WHERE id = ?', [a.id]))[0];
    if (!row || !(await verifyPassword(str(formData, 'current').slice(0, 200), row.password_hash))) return go('/admin/settings', 'err', 'badcurrent');
  }
  try { await exec('UPDATE admin_users SET display_name = ?, email = ? WHERE id = ?', [name, email, a.id]); }
  catch { return go('/admin/settings', 'err', 'taken'); }
  await audit(a.id, 'profile_updated');
  return go('/admin/settings', 'ok', 'profile');
}
export async function sendTestEmailAction(formData: FormData) {
  const a = await requireAdminAction(formData);
  const bucket = hashBucket(`testmail:${a.id}`);
  if (await rate.tooMany(bucket, 'testmail', 3, 600)) return go('/admin/settings', 'err', 'limited');
  await rate.record(bucket, 'testmail');
  const { contactRecipient } = await import('@/lib/server/cms');
  const r = await sendEnquiryEmail({ id: 0, name: 'SMTP test', email: a.email, phone: '', service: 'Admin test', message: 'This is a test message sent from the Roopo Visa admin panel.' }, await contactRecipient());
  await audit(a.id, 'smtp_test', r.status);
  return go('/admin/settings', r.status === 'sent' ? 'ok' : 'err', r.status === 'sent' ? 'testsent' : r.status === 'failed' ? 'testfail' : 'testnc');
}
