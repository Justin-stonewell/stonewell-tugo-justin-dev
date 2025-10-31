// src/lib/tugoNormalize.js
// Normalize frontend payload to TuGo quotePrice spec
// - destinationType: DESTWW / DESTWWUSA / DESTWWCAN
// - insuredPersons[].dob -> birthDate
// - trip.destination (ISO-2) if available

export function normalizeForTugoQuote(input = {}) {
  // 1) destinationType 계산
  let destinationType = input.destinationType;
  if (!destinationType) {
    if (input.isDomesticCanada) destinationType = 'DESTWWCAN';
    else if (input.includesUSA)  destinationType = 'DESTWWUSA';
    else                         destinationType = 'DESTWW';
  }

  // 2) insuredPersons 보정 (dob -> birthDate)
  const srcPersons = Array.isArray(input.insuredPersons) ? input.insuredPersons : [];
  const insuredPersons = srcPersons.map(p => ({
    ...p,
    birthDate: p.birthDate || p.dob || '',
    homeProvince: p.homeProvince || (input.trip && input.trip.departureProvince) || input.originProvince || 'ON',
  }));

  // 3) trip.destination 보정
  const trip = {
    ...(input.trip || {}),
    destination:
      (input.trip && input.trip.destination) ||
      input.destCountry ||
      input.destinationCountryCode ||
      input.destCountryCode ||
      undefined,
  };

  return {
    partnerCode: input.partnerCode,
    productLineCode: input.productLineCode,
    insuredType: input.insuredType || 'CANADIAN',
    coverageType: input.coverageType || 'MED',
    destinationType,
    trip,
    insuredPersons,
  };
}
