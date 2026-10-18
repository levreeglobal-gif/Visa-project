import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'rv_admin_session';
export function newToken(bytes = 32): string { return randomBytes(bytes).toString('hex'); }
export function sha256Hex(value: string): string { return createHash('sha256').update(value).digest('hex'); }
export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
/** Keyed hash for IP/bucket identifiers so raw IPs are not stored. */
export function keyedHash(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}
export function validCsrf(sessionToken: string | null | undefined, submitted: unknown): boolean {
  return typeof sessionToken === 'string' && sessionToken.length === 64 && typeof submitted === 'string' && safeEqual(sessionToken, submitted);
}
