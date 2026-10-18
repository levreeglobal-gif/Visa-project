import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, passwordPolicyError } from '../src/lib/security/password';
import { newToken, sha256Hex, validCsrf, safeEqual, keyedHash } from '../src/lib/security/tokens';
import { validateContact, escapeHtml, safeUrl, clean, safeHeaderText } from '../src/lib/security/validation';

test('password hash round-trips and rejects wrong/malformed', async () => {
  const h = await hashPassword('Correct-Horse-9!');
  assert.match(h, /^scrypt\$32768\$8\$1\$/);
  assert.equal(await verifyPassword('Correct-Horse-9!', h), true);
  assert.equal(await verifyPassword('correct-horse-9!', h), false);
  assert.equal(await verifyPassword('x', 'garbage'), false);
  assert.equal(await verifyPassword('x', 'scrypt$999999999$8$1$AA==$AA=='), false);
  assert.notEqual(h, await hashPassword('Correct-Horse-9!'), 'salted');
});
test('password policy', () => {
  assert.ok(passwordPolicyError('short1A!'));
  assert.ok(passwordPolicyError('aaaaaaaaaaaaaaaa'));
  assert.ok(passwordPolicyError('alllowercaseletters'));
  assert.ok(passwordPolicyError('Sup3rSecret!pass', 'sup3rsecret@x.com'));
  assert.equal(passwordPolicyError('Violet-Lantern-42'), null);
});
test('tokens/csrf', () => {
  const t = newToken(); assert.equal(t.length, 64);
  assert.equal(sha256Hex('a').length, 64);
  assert.equal(validCsrf(t, t), true);
  assert.equal(validCsrf(t, t.slice(1) + 'x'), false);
  assert.equal(validCsrf(undefined, t), false);
  assert.equal(validCsrf(t, undefined), false);
  assert.equal(safeEqual('a', 'ab'), false);
  assert.notEqual(keyedHash('1.2.3.4', 'k1'), keyedHash('1.2.3.4', 'k2'));
});
const good = { name: 'রহিম উদ্দিন', email: 'A@Example.com', phone: '+880 1708-399992', service: 'Korean tourist visa', message: 'I need help with a tourist visa.', website: '' };
test('contact validation accepts Bengali names and normalises email', () => {
  const r = validateContact(good); assert.ok(r.ok); if (r.ok) { assert.equal(r.value.email, 'a@example.com'); assert.equal(r.value.name, 'রহিম উদ্দিন'); }
});
test('contact validation rejects bad input', () => {
  for (const patch of [{ name: 'A' }, { name: '<script>' }, { email: 'nope' }, { email: 'a@b' }, { phone: 'abc' }, { service: 'Hack' }, { message: 'short' }]) {
    assert.equal(validateContact({ ...good, ...patch }).ok, false, JSON.stringify(patch));
  }
  assert.equal(validateContact(null).ok, false);
  assert.equal(validateContact('x').ok, false);
});
test('honeypot short-circuits', () => { const r = validateContact({ ...good, website: 'http://spam', name: '' }); assert.ok(r.ok && r.value.honeypot); });
test('length limits enforced by code points', () => {
  const r = validateContact({ ...good, message: 'ক'.repeat(5000) }); assert.ok(r.ok); if (r.ok) assert.equal(Array.from(r.value.message).length, 4000);
});
test('clean strips controls and bidi overrides', () => {
  assert.equal(clean('a\u0000b\u202Ec', 50), 'a b' + 'c'.slice(0));
  assert.equal(clean('l1\r\nl2\u0007', 50, true), 'l1\nl2');
  assert.equal(safeHeaderText('x\r\nBcc: evil@x.com'), 'x Bcc: evil@x.com');
});
test('escapeHtml/safeUrl', () => {
  assert.equal(escapeHtml(`<img src=x onerror="a('b')">&`), '&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;');
  assert.equal(safeUrl('javascript:alert(1)'), null);
  assert.equal(safeUrl('data:text/html,x'), null);
  assert.equal(safeUrl('//evil.com'), null);
  assert.equal(safeUrl('/contact'), '/contact');
  assert.equal(safeUrl('https://wa.me/8801708399992'), 'https://wa.me/8801708399992');
  assert.equal(safeUrl(''), '');
});
