import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { exec, query, type RowDataPacket } from './db';
import { newToken, sha256Hex, validCsrf, SESSION_COOKIE } from '@/lib/security/tokens';
import { verifyPassword } from '@/lib/security/password';
import { hashBucket, ipHash, userAgent } from './request';
import * as rate from './ratelimit';

const SESSION_HOURS = 8;
const DUMMY_HASH = 'scrypt$32768$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

export type Admin = { id: number; email: string; displayName: string; csrf: string; tokenHash: string };

function cookieOptions(maxAgeSeconds: number) {
  return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/', maxAge: maxAgeSeconds };
}
/** Returns the signed-in admin or null. Authoritative check — used by every admin page and action. */
export async function currentAdmin(): Promise<Admin | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const tokenHash = sha256Hex(token);
  const rows = await query<RowDataPacket & { id: number; email: string; display_name: string; csrf_token: string }>(
    `SELECT u.id, u.email, u.display_name, s.csrf_token FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP() LIMIT 1`, [tokenHash]);
  const r = rows[0];
  if (!r) return null;
  return { id: Number(r.id), email: r.email, displayName: r.display_name, csrf: r.csrf_token, tokenHash };
}
export async function requireAdmin(): Promise<Admin> {
  const a = await currentAdmin();
  if (!a) redirect('/admin/login');
  return a;
}
/** Use at the top of every server action: verifies session AND the CSRF token submitted with the form. */
export async function requireAdminAction(formData: FormData): Promise<Admin> {
  const a = await requireAdmin();
  if (!validCsrf(a.csrf, formData.get('csrf'))) throw new Error('Security check failed. Reload the page and try again.');
  return a;
}
export async function audit(adminId: number | null, action: string, detail = ''): Promise<void> {
  await exec('INSERT INTO audit_log (admin_id, action, detail, created_at) VALUES (?, ?, ?, UTC_TIMESTAMP())', [adminId, action.slice(0, 60), detail.slice(0, 255)]);
}
export type LoginResult = { ok: true } | { ok: false; error: string };
export async function login(email: string, password: string): Promise<LoginResult> {
  const generic = 'Incorrect email or password.';
  const emailKey = email.trim().toLowerCase().slice(0, 254);
  const ipBucket = hashBucket(`ip:${await ipHash()}`);
  const emailBucket = hashBucket(`email:${emailKey}`);
  if ((await rate.tooMany(ipBucket, 'login_fail', 10, 900)) || (await rate.tooMany(emailBucket, 'login_fail', 5, 900))) {
    return { ok: false, error: 'Too many failed attempts. Please wait 15 minutes and try again.' };
  }
  const rows = await query<RowDataPacket & { id: number; password_hash: string }>('SELECT id, password_hash FROM admin_users WHERE email = ? LIMIT 1', [emailKey]);
  const user = rows[0];
  const valid = await verifyPassword(password.slice(0, 200), user?.password_hash ?? DUMMY_HASH); // constant-ish work for unknown emails
  if (!user || !valid) {
    await rate.record(ipBucket, 'login_fail'); await rate.record(emailBucket, 'login_fail');
    await audit(null, 'login_failed');
    return { ok: false, error: generic };
  }
  await rate.clear(emailBucket, 'login_fail');
  const token = newToken(), csrf = newToken();
  await exec(
    `INSERT INTO admin_sessions (token_hash, user_id, csrf_token, created_at, expires_at, last_seen_at, ip_hash, user_agent)
     VALUES (?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP() + INTERVAL ${SESSION_HOURS} HOUR, UTC_TIMESTAMP(), ?, ?)`,
    [sha256Hex(token), user.id, csrf, await ipHash(), await userAgent()]);
  await exec('UPDATE admin_users SET last_login_at = UTC_TIMESTAMP() WHERE id = ?', [user.id]);
  await exec('DELETE FROM admin_sessions WHERE expires_at < UTC_TIMESTAMP()');
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(SESSION_HOURS * 3600));
  await audit(Number(user.id), 'login');
  return { ok: true };
}
export async function logout(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token && /^[0-9a-f]{64}$/.test(token)) await exec('DELETE FROM admin_sessions WHERE token_hash = ?', [sha256Hex(token)]);
  jar.set(SESSION_COOKIE, '', { ...cookieOptions(0), maxAge: 0 });
}
/** Revoke every session of a user except the current one (used after password change). */
export async function revokeOtherSessions(userId: number, keepTokenHash: string): Promise<void> {
  await exec('DELETE FROM admin_sessions WHERE user_id = ? AND token_hash <> ?', [userId, keepTokenHash]);
}
