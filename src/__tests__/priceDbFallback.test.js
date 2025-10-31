const { priceDbFallback } = require('../../netlify/functions/_priceDbFallback');

describe('priceDbFallback', () => {
  test('computes premium deterministically', async () => {
    const form = {
      startDate: '2025-01-01',
      endDate: '2025-01-11',
      insuredPersons: [{ firstName: 'A', lastName: 'B', birthDate: '1990-01-01' }],
      isFamilyPlan: false,
      deductible: 0,
    };
    const result = await priceDbFallback(form);
    expect(result.currency).toBe('CAD');
    expect(result.premium).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(result.premium);
  });
});
