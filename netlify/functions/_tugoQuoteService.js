const axios = require('axios');
const crypto = require('crypto');
const { env } = require('../../src/config');
const { priceDbFallback } = require('./_priceDbFallback');

// In-memory primitives (single-instance only)
let failureTimes = [];
let breakerUntil = 0;
const cache = new Map(); // key -> { expire: number, data: NormalizedQuote }

const FAILURE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const BREAKER_DURATION_MS = 10 * 60 * 1000; // 10 minutes

function buildTuGoPayload(form) {
  return {
    originCountry: form.residenceCountry,
    province: form.province ?? null,
    trip: { start: form.startDate, end: form.endDate },
    insured: form.insuredPersons.map((p) => ({
      firstName: p.firstName,
      lastName: p.lastName,
      birthDate: p.birthDate,
      gender: p.gender ?? null,
    })),
    options: {
      familyPlan: !!form.isFamilyPlan,
      deductible: form.deductible ?? 0,
      tripCosts: form.tripCosts ?? [],
      preExisting: !!form.preExisting,
    },
  };
}

function parseTuGoResponse(apiResp, form) {
  const premium = Number(apiResp?.totalPremium ?? 0);
  const taxes = Number(apiResp?.taxes ?? 0);
  const deductible = form.deductible ?? 0;

  return {
    currency: apiResp?.currency ?? 'CAD',
    premium,
    taxes,
    total: premium + taxes,
    deductible,
    productCode: apiResp?.productCode ?? 'TUGO_DEFAULT',
    coverages: {
      medicalLimit: apiResp?.coverages?.emergencyMedical ?? 0,
      tripCancel: apiResp?.coverages?.tripCancellation ?? 0,
      tripInterrupt: apiResp?.coverages?.tripInterruption ?? 0,
    },
    ...(process.env.NODE_ENV === 'development' ? { raw: apiResp } : {}),
  };
}

async function quoteWithFallback(form) {
  const signature = hashForm(form);
  const now = Date.now();

  // Cache
  const cached = cache.get(signature);
  if (cached && cached.expire > now) return cached.data;

  const useApi = env.USE_TUGO_API_PRICING === 'true';
  const breakerOpen = now < breakerUntil;

  if (!useApi || breakerOpen) {
    const data = await priceDbFallback(form);
    const wrapped = { source: 'db_fallback', ...data };
    setCache(signature, wrapped);
    return wrapped;
  }

  try {
    const payload = buildTuGoPayload(form);

    const instance = axios.create({
      baseURL: env.TUGO_API_BASE_URL,
      timeout: env.QUOTE_API_TIMEOUT_MS,
      headers: {
        'X-API-KEY': env.TUGO_API_KEY,
        'X-API-SECRET': env.TUGO_API_SECRET,
        'Content-Type': 'application/json',
      },
    });

    const requestOnce = async () => instance.post('/quotes', payload);

    let resp;
    try {
      resp = await requestOnce();
    } catch (err) {
      const retriable = isRetriable(err);
      if (retriable) {
        resp = await requestOnce();
      } else {
        throw err;
      }
    }

    const normalized = parseTuGoResponse(resp.data, form);
    const wrapped = { source: 'tugo_api', ...normalized };
    setCache(signature, wrapped);
    recordSuccess();
    return wrapped;
  } catch (err) {
    recordFailure();
    const data = await priceDbFallback(form);
    const wrapped = { source: 'db_fallback', ...data };
    setCache(signature, wrapped);
    return wrapped;
  }
}

function isRetriable(error) {
  const code = String(error?.code || '').toUpperCase();
  return code === 'ECONNRESET' || code === 'ETIMEDOUT' || code === 'ECONNABORTED';
}

function recordFailure() {
  const now = Date.now();
  failureTimes.push(now);
  failureTimes = failureTimes.filter((t) => now - t <= FAILURE_WINDOW_MS);
  if (failureTimes.length >= 3) {
    breakerUntil = now + BREAKER_DURATION_MS;
  }
}

function recordSuccess() {
  failureTimes = [];
  breakerUntil = 0;
}

function setCache(key, data) {
  const ttl = Number(env.QUOTE_API_CACHE_TTL_SEC || 300) * 1000;
  cache.set(key, { expire: Date.now() + ttl, data });
}

function hashForm(form) {
  const copy = { ...form, insuredPersons: form.insuredPersons.map((p) => ({ ...p, firstName: '', lastName: '' })) };
  return crypto.createHash('sha256').update(JSON.stringify(copy)).digest('hex');
}

module.exports = {
  buildTuGoPayload,
  parseTuGoResponse,
  quoteWithFallback,
};