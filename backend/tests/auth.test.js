import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

test('Security & Authentication Unit Tests', async (t) => {
  const secret = 'test_jwt_secret_key_2026';
  const mockUserId = '6543210987abcdef65432109';

  await t.test('Bcrypt Password Hashing & Verification', async () => {
    const rawPassword = 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    assert.notEqual(rawPassword, hash);
    const isMatch = await bcrypt.compare(rawPassword, hash);
    assert.equal(isMatch, true);

    const isWrongMatch = await bcrypt.compare('WrongPassword', hash);
    assert.equal(isWrongMatch, false);
  });

  await t.test('JWT Token Generation & Verification', () => {
    const token = jwt.sign({ id: mockUserId }, secret, { expiresIn: '1h' });
    assert.ok(token);

    const decoded = jwt.verify(token, secret);
    assert.equal(decoded.id, mockUserId);
  });
});
