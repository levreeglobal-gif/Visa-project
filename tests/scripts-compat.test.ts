import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword as hashMjs, policyError } from '../scripts/lib/password.mjs';
import { verifyPassword, passwordPolicyError } from '../src/lib/security/password';

test('hash created by CLI bootstrap verifies in app code', async () => {
  assert.equal(await verifyPassword('Violet-Lantern-42', await hashMjs('Violet-Lantern-42')), true);
  assert.equal(await verifyPassword('wrong-Violet-42', await hashMjs('Violet-Lantern-42')), false);
});
test('CLI and app policies agree on representative inputs', () => {
  for (const p of ['short1A!', 'alllowercaseletters', 'Violet-Lantern-42', 'ONLYUPPERCASELETTERS']) {
    assert.equal(Boolean(policyError(p, 'owner@x.com')), Boolean(passwordPolicyError(p, 'owner@x.com')), p);
  }
});
