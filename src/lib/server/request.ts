import { headers } from 'next/headers';
import { keyedHash } from '@/lib/security/tokens';

function secret(): string {
  const s = process.env.APP_SECRET;
  if (!s || s.length < 32) throw new Error('APP_SECRET must be set to a random string of at least 32 characters.');
  return s;
}
/** Client IP. Only trusts proxy headers when TRUST_PROXY=true (set on cPanel/Passenger behind the web server). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  if (process.env.TRUST_PROXY === 'true') {
    const xr = h.get('x-real-ip')?.trim();
    const xf = h.get('x-forwarded-for')?.split(',')[0]?.trim();
    return (xr || xf || 'unknown').slice(0, 64);
  }
  return 'direct';
}
export async function ipHash(): Promise<string> { return keyedHash(await clientIp(), secret()); }
export async function userAgent(): Promise<string> { return ((await headers()).get('user-agent') || '').slice(0, 255); }
export function hashBucket(value: string): string { return keyedHash(value, secret()).slice(0, 64); }
/** Same-origin check for state-changing API requests (defence in depth beside CSRF tokens). */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  // The public contact endpoint is browser-facing JSON; missing Origin is rejected.
  // Do not trust X-Forwarded-Host here because it may be client-controlled unless every proxy is configured perfectly.
  if (!origin) return false;
  const host = request.headers.get('host');
  if (!host) return false;
  try { return new URL(origin).host.toLowerCase() === host.toLowerCase(); } catch { return false; }
}
