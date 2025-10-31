// netlify/functions/tugoQuote.js
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const API_BASE = process.env.TUGO_API_BASE_URL || process.env.TUGO_API_BASE || "https://api.tugo.com";
const ACCESS_URL = process.env.TUGO_TOKEN_URL || `${API_BASE}/v1/venture/accessToken`;
const QUOTE_URL   = `${API_BASE}/v1/venture/quotes/quotePrice`;

const CLIENT_ID     = process.env.TUGO_CLIENT_ID || process.env.TUGO_API_KEY;       // Venture API: Production key (client_id)
const CLIENT_SECRET = process.env.TUGO_CLIENT_SECRET || process.env.TUGO_API_SECRET;    // Venture API: Production secret (client_secret)
const USER_NAME     = process.env.TUGO_USER_NAME;     // SFS000
const PASSWORD      = process.env.TUGO_PASSWORD;      // Travelsfs000
const PARTNER_CODE  = process.env.TUGO_PARTNER_CODE || "SFS000";
const PRODUCT_LINE  = process.env.TUGO_PRODUCT_LINE_CODE || "PR-FDM-1";

let cachedToken = null;
let tokenExpTs  = 0;

async function getAccessToken(force = false) {
  const now = Math.floor(Date.now() / 1000);
  if (!force && cachedToken && tokenExpTs > now + 60) {
    return cachedToken;
  }
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "password",
    user_name: USER_NAME,
    password: PASSWORD,
  }).toString();

  const r = await fetch(ACCESS_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.accessToken) {
    throw new Error(`Token error ${r.status}: ${JSON.stringify(j).slice(0,500)}`);
  }
  cachedToken = j.accessToken;
  tokenExpTs  = Math.floor(Date.now()/1000) + (j.expiresIn || 3600);
  return cachedToken;
}

function deriveDestinationType(includesUSA, isDomesticCanada) {
  // If trip is within Canada only, TuGo expects DESTWWCAN; otherwise split by USA.
  if (isDomesticCanada) return "DESTWWCAN";
  return includesUSA ? "DESTWWUSA" : "DESTWW";
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    const input = JSON.parse(event.body || "{}");
    // Normalize + guard (finalize)
    const insuredType = input.insuredType || "CANADIAN";
    const includesUSA = !!input.includesUSA;
    const isDomesticCanada = !!input.isDomesticCanada;
    const destinationType = input.destinationType || deriveDestinationType(includesUSA, isDomesticCanada);
    const payload = {
      partnerCode: input.partnerCode || PARTNER_CODE,
      productLineCode: input.productLineCode || PRODUCT_LINE,
      insuredType,
      destinationType,
      coverageType: input.coverageType || "MED",
      trip: {
        ...(input.trip || {}),
        destination: (input.trip && input.trip.destination) || input.destCountry || input.destinationCountryCode || input.destCountryCode || undefined,
      },
      insuredPersons: Array.isArray(input.insuredPersons) ? input.insuredPersons.map(p => ({
        ...p,
        birthDate: p.birthDate || p.dob || '',
      })) : [],
    };

    // Try to get token and quote - if either fails, return safe fallback
    let token;
    try {
      token = await getAccessToken(false);
    } catch (tokenErr) {
      // eslint-disable-next-line no-console
      console.warn('[tugoQuote] Token retrieval failed:', tokenErr.message || String(tokenErr));
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          endpoint: "quotePrice",
          request: payload,
          response: {
            companyName: "TuGo",
            premium: 0,
            error: "TOKEN_OR_QUOTE_FAILED",
            errorMessage: tokenErr.message || "Token retrieval failed",
          },
        }),
      };
    }

    let resp;
    try {
      resp = await fetch(QUOTE_URL, {
        method: "POST",
        headers: {
          "X-Auth-API-Key": CLIENT_ID,
          "Authorization": `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // If unauthorized, refresh token once and retry
      if (resp.status === 401) {
        token = await getAccessToken(true);
        resp = await fetch(QUOTE_URL, {
          method: "POST",
          headers: {
            "X-Auth-API-Key": CLIENT_ID,
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }
    } catch (quoteErr) {
      // eslint-disable-next-line no-console
      console.warn('[tugoQuote] Quote request failed:', quoteErr.message || String(quoteErr));
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          endpoint: "quotePrice",
          request: payload,
          response: {
            companyName: "TuGo",
            premium: 0,
            error: "TOKEN_OR_QUOTE_FAILED",
            errorMessage: quoteErr.message || "Quote request failed",
          },
        }),
      };
    }

    const data = await resp.json().catch(() => ({}));
    
    // If quote returned error status or no valid plans, return safe fallback
    if (!resp.ok || (resp.status >= 400) || !Array.isArray(data?.availablePlanPrices)) {
      // eslint-disable-next-line no-console
      console.warn('[tugoQuote] Quote returned error or no plans:', { status: resp.status, hasPlans: Array.isArray(data?.availablePlanPrices) });
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          endpoint: "quotePrice",
          request: payload,
          response: {
            companyName: "TuGo",
            premium: 0,
            error: "TOKEN_OR_QUOTE_FAILED",
            errorMessage: data?.messages?.[0]?.text || `Quote returned status ${resp.status}`,
            rawResponse: data,
          },
        }),
      };
    }

    try {
      const reqSummary = {
        partnerCode: payload && payload.partnerCode,
        productLineCode: payload && payload.productLineCode,
        insuredType: payload && payload.insuredType,
        destinationType: payload && payload.destinationType,
        trip: payload && payload.trip,
      };
      // eslint-disable-next-line no-console
      console.log('[tugoQuote]', { reqSummary, status: resp.status, count: Array.isArray(data && data.availablePlanPrices) ? data.availablePlanPrices.length : 0 });
    } catch {}

    return {
      statusCode: resp.status,
      body: JSON.stringify({
        endpoint: "quotePrice",
        request: payload,
        response: data,
      }),
      headers: { "content-type": "application/json" },
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message || String(e) }),
      headers: { "content-type": "application/json" },
    };
  }
};
