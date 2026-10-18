import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';

const N = 32768, R = 8, P = 1, KEYLEN = 64, MAXMEM = 96 * 1024 * 1024;
export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 200;

function derive(password: string, salt: Buffer, n: number, r: number, p: number, keylen: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scryptCb(password.normalize('NFKC'), salt, keylen, { N: n, r, p, maxmem: MAXMEM }, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P, KEYLEN);
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [n, r, p] = [Number(parts[1]), Number(parts[2]), Number(parts[3])];
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p) || n > 1 << 17) return false;
  const salt = Buffer.from(parts[4], 'base64');
  const expected = Buffer.from(parts[5], 'base64');
  if (!salt.length || !expected.length) return false;
  const actual = await derive(password, salt, n, r, p, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Returns an error message, or null if the password is acceptable. */
export function passwordPolicyError(password: string, email = ''): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (password.length > MAX_PASSWORD_LENGTH) return 'Password is too long.';
  if (/^(.)\1+$/.test(password)) return 'Password is too repetitive.';
  const lower = password.toLowerCase();
  if (email && lower.includes(email.split('@')[0].toLowerCase()) && email.split('@')[0].length >= 4) return 'Password must not contain your email name.';
  if (['password', '123456789012', 'qwertyuiop12', 'roopovisa'].some((w) => lower.includes(w))) return 'Password is too easy to guess.';
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length;
  if (classes < 3) return 'Use at least three of: lowercase, uppercase, digits, symbols.';
  return null;
}
