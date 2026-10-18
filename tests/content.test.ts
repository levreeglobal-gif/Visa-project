import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFS, defFor, parseContentForm, mergeWithDefaults, normalizePhone, ROUTES } from '../src/lib/content-schema';

const korean = defFor('service:korean-visa-processing')!;
const form = (o: Record<string, string>) => (n: string) => o[n];
const base = { eyebrow: 'E', title: 'T', intro: 'I', accent: 'teal', highlights: 'a\n\n b ', scopeTitle: 'S', scope: 'x\ny', process: '', note: '' };

test('defs cover all 12 routes for SEO and 5 service pages', () => {
  assert.equal(DEFS.filter((d) => d.group === 'SEO').length, 12);
  assert.equal(ROUTES.length, 12);
  assert.equal(DEFS.filter((d) => d.group === 'Service pages').length, 5);
  assert.ok(defFor('home') && defFor('site'));
});
test('service form parses lines and trims blanks', () => {
  const r = parseContentForm(korean, form(base)); assert.ok(r.ok);
  if (r.ok) { assert.deepEqual(r.values.highlights, ['a', 'b']); assert.deepEqual(r.values.process, []); }
});
test('required, select and length violations are rejected', () => {
  let r = parseContentForm(korean, form({ ...base, title: '' })); assert.equal(r.ok, false);
  r = parseContentForm(korean, form({ ...base, accent: 'red' })); assert.equal(r.ok, false);
  r = parseContentForm(korean, form({ ...base, highlights: Array(25).fill('x').join('\n') })); assert.equal(r.ok, false);
  r = parseContentForm(korean, form({ ...base, title: 'x'.repeat(500) })); assert.ok(r.ok); if (r.ok) assert.equal((r.values.title as string).length, 160);
});
test('site form rejects javascript: URLs and bad emails; accepts blanks for optional', () => {
  const site = defFor('site')!;
  const ok = { phones: '01708-399992', location: 'Dhaka', siteUrl: 'https://visa.roopo.org', publicEmail: '', contactRecipient: '', facebook: '', instagram: '', linkedin: '', youtube: '', x: '' };
  assert.ok(parseContentForm(site, form(ok)).ok);
  assert.equal(parseContentForm(site, form({ ...ok, facebook: 'javascript:alert(1)' })).ok, false);
  assert.equal(parseContentForm(site, form({ ...ok, publicEmail: 'nope' })).ok, false);
  assert.equal(parseContentForm(site, form({ ...ok, siteUrl: '/relative' })).ok, false);
});
test('unknown fields are ignored; merge only accepts schema fields', () => {
  const merged = mergeWithDefaults(korean, { title: 'Default', intro: 'D', evil: 'keep' } as Record<string, unknown>, { title: 'Stored', __proto__: { x: 1 }, injected: '<script>', intro: 5 });
  assert.equal(merged.title, 'Stored'); assert.equal(merged.intro, 'D'); assert.equal((merged as Record<string, unknown>).injected, undefined);
  assert.deepEqual(mergeWithDefaults(korean, { title: 'D' }, null), { title: 'D' });
});
test('phone normalisation matches existing source numbers', () => {
  assert.deepEqual(normalizePhone('01708-399992'), { label: '01708-399992', tel: '+8801708399992', whatsapp: '8801708399992' });
  assert.equal(normalizePhone('01681398877')?.tel, '+8801681398877');
  assert.equal(normalizePhone('abc'), null);
});
