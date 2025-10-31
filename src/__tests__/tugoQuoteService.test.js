const { buildTuGoPayload, parseTuGoResponse } = require('../../netlify/functions/_tugoQuoteService');

describe('tugoQuoteService', () => {
  test('buildTuGoPayload maps form correctly', () => {
    const form = {
      residenceCountry: 'CA',
      province: 'ON',
      startDate: '2025-01-01',
      endDate: '2025-01-10',
      insuredPersons: [
        { firstName: 'A', lastName: 'B', birthDate: '1990-01-01' },
      ],
      isFamilyPlan: true,
      deductible: 0,
      tripCosts: [1000],
      preExisting: false,
    };
    const payload = buildTuGoPayload(form);
    expect(payload.originCountry).toBe('CA');
    expect(payload.province).toBe('ON');
    expect(payload.trip).toEqual({ start: '2025-01-01', end: '2025-01-10' });
    expect(payload.insured).toHaveLength(1);
    expect(payload.options.familyPlan).toBe(true);
  });

  test('parseTuGoResponse normalizes response', () => {
    const apiResp = {
      currency: 'CAD',
      totalPremium: 123.45,
      taxes: 12.34,
      productCode: 'TUGO_X',
      coverages: { emergencyMedical: 1000000, tripCancellation: 2000, tripInterruption: 1500 },
    };
    const form = { deductible: 0 };
    const normalized = parseTuGoResponse(apiResp, form);
    expect(normalized.currency).toBe('CAD');
    expect(normalized.premium).toBe(123.45);
    expect(normalized.total).toBeCloseTo(135.79, 2);
    expect(normalized.coverages.medicalLimit).toBe(1000000);
  });
});
