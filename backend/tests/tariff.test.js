import test from 'node:test';
import assert from 'node:assert/strict';

function calculateCebTariff(units) {
  let estimatedCost = 0;
  if (units <= 30) {
    estimatedCost = units * 8 + 150;
  } else if (units <= 60) {
    estimatedCost = 30 * 8 + (units - 30) * 10 + 300;
  } else if (units <= 90) {
    estimatedCost = 60 * 16 + (units - 60) * 16 + 400;
  } else if (units <= 180) {
    estimatedCost = 60 * 16 + 30 * 16 + (units - 90) * 50 + 1000;
  } else {
    estimatedCost = 60 * 16 + 30 * 16 + 90 * 50 + (units - 180) * 75 + 1500;
  }
  return estimatedCost;
}

test('CEB Domestic Tariff Slab Unit Tests', async (t) => {
  await t.test('Tier 1 (0 - 30 units): 20 units should cost Rs. 310', () => {
    const cost = calculateCebTariff(20);
    assert.equal(cost, 20 * 8 + 150);
  });

  await t.test('Tier 2 (31 - 60 units): 45 units should include fixed charge Rs. 300', () => {
    const cost = calculateCebTariff(45);
    const expected = 30 * 8 + 15 * 10 + 300;
    assert.equal(cost, expected);
  });

  await t.test('Tier 3 (61 - 90 units): 75 units should calculate correctly with Rs. 400 fixed fee', () => {
    const cost = calculateCebTariff(75);
    const expected = 60 * 16 + 15 * 16 + 400;
    assert.equal(cost, expected);
  });

  await t.test('Tier 4 (91 - 180 units): 100 units should calculate with Rs. 1000 fixed fee', () => {
    const cost = calculateCebTariff(100);
    const expected = 60 * 16 + 30 * 16 + 10 * 50 + 1000;
    assert.equal(cost, expected);
  });
});
