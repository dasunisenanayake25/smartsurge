import test from 'node:test';
import assert from 'node:assert/strict';

test('Appliance Entity Business Logic & Validation Tests', async (t) => {
  function validateAppliance(data) {
    const errors = [];
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Appliance name is required');
    }
    if (typeof data.ratedWattage !== 'number' || data.ratedWattage <= 0) {
      errors.push('Rated wattage must be a positive number');
    }
    if (!data.category) {
      errors.push('Category is required');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  await t.test('Valid appliance payload passes validation', () => {
    const appliance = {
      name: 'Refrigerator',
      category: 'Kitchen',
      ratedWattage: 180,
      isOn: true
    };
    const result = validateAppliance(appliance);
    assert.equal(result.isValid, true);
    assert.equal(result.errors.length, 0);
  });

  await t.test('Appliance with missing name fails validation', () => {
    const invalidAppliance = {
      name: '',
      category: 'HVAC',
      ratedWattage: 1200
    };
    const result = validateAppliance(invalidAppliance);
    assert.equal(result.isValid, false);
    assert.ok(result.errors.includes('Appliance name is required'));
  });

  await t.test('Appliance with invalid wattage fails validation', () => {
    const invalidAppliance = {
      name: 'Air Conditioner',
      category: 'HVAC',
      ratedWattage: -500
    };
    const result = validateAppliance(invalidAppliance);
    assert.equal(result.isValid, false);
    assert.ok(result.errors.includes('Rated wattage must be a positive number'));
  });
});
