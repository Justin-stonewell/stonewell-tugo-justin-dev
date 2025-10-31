const axios = require('axios');
const crypto = require('crypto');
const { env } = require('../../config');
const { priceDbFallback } = require('./priceDbFallback');

let failureCount = 0;
let breakerUntil = 0;
const cache = new Map();

async function quoteWithFallback(form) {
  const key = hashForm(form);
  const now = Date.now();

  const cached = cache.get(key);
  if (cached && cached.expire > now) return cached.data;

  const useApi = env.USE_TUGO_API_PRICING === 'true';
  const breakerOpen = now < breakerUntil;

  if (!useApi || breakerOpen) {
    const data = await priceDbFallback(form);
    const wrapped = { source: 'db_fallback', ...data };
    setCache(key, wrapped);
    return wrapped;
  }

  try {
    const payload = buildTuGoPayload(form);
    const resp = await axios.post(
      `${env.TUGO_API_BASE_URL}/quotes`,
      payload,
      {
        timeout: Number(env.QUOTE_API_TIMEOUT_MS || 8000),
        headers: {
          'X-API-KEY': env.TUGO_API_KEY,
          'X-API-SECRET': env.TUGO_API_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );
    const normalized = parseTuGoResponse(resp.data, form);
    const wrapped = { source: 'tugo_api', ...normalized };
    setCache(key, wrapped);
    failureCount = 0;
    return wrapped;
  } catch (e) {
    failureCount++;
    if (failureCount >= 3) {
      breakerUntil = now + 10 * 60 * 1000;
    }
    const data = await priceDbFallback(form);
    const wrapped = { source: 'db_fallback', ...data };
    setCache(key, wrapped);
    return wrapped;
  }
}

function hashForm(form) {
  return crypto.createHash('sha256').update(JSON.stringify(form)).digest('hex');
}
function setCache(key, data) {
  const ttl = Number(process.env.QUOTE_API_CACHE_TTL_SEC || 300) * 1000;
  cache.set(key, { expire: Date.now() + ttl, data });
}

function buildTuGoPayload(form) {
  return {
    originCountry: form.residenceCountry,
    province: form.province || null,
    trip: { start: form.startDate, end: form.endDate },
    insured: (form.insuredPersons || []).map((p) => ({
      firstName: p.firstName,
      lastName: p.lastName,
      birthDate: p.birthDate,
    })),
    options: {
      familyPlan: !!form.isFamilyPlan,
      deductible: form.deductible || 0,
      tripCosts: form.tripCosts || [],
      preExisting: !!form.preExisting,
    },
  };
}

function parseTuGoResponse(apiResp, form) {
  const premium = Number((apiResp && apiResp.totalPremium) || 0);
  const taxes = Number((apiResp && apiResp.taxes) || 0);
  const deductible = form && form.deductible ? form.deductible : 0;

  return {
    currency: (apiResp && apiResp.currency) || 'CAD',
    premium,
    taxes,
    total: premium + taxes,
    deductible,
    productCode: (apiResp && apiResp.productCode) || 'TUGO_DEFAULT',
    coverages: {
      medicalLimit: apiResp && apiResp.coverages ? apiResp.coverages.emergencyMedical || 0 : 0,
      tripCancel: apiResp && apiResp.coverages ? apiResp.coverages.tripCancellation || 0 : 0,
      tripInterrupt: apiResp && apiResp.coverages ? apiResp.coverages.tripInterruption || 0 : 0,
    },
    ...(process.env.NODE_ENV === 'development' ? { raw: apiResp } : {}),
  };
}

module.exports = {
  quoteWithFallback,
  buildTuGoPayload,
  parseTuGoResponse,
  hashForm,
};
