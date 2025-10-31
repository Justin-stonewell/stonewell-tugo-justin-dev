import { QUOTE_ENDPOINT } from '../config/client';
const APPLICATIONS_ENDPOINT =
  (typeof process !== 'undefined' && process.env && process.env.APPLICATIONS_ENDPOINT) ||
  '/.netlify/functions/applications';

export async function postQuoteTugo(form) {
  const url = QUOTE_ENDPOINT;
  const payload = JSON.stringify(form);
  
  // Log API call attempt
  console.log('[TuGo API] Attempting to call:', url);
  console.log('[TuGo API] Payload:', form);
  
  const startTime = Date.now();
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    const elapsed = Date.now() - startTime;
    console.log(`[TuGo API] Response received in ${elapsed}ms:`, {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      url: res.url || url,
    });
  } catch (fetchError) {
    const elapsed = Date.now() - startTime;
    console.error(`[TuGo API] Fetch failed after ${elapsed}ms:`, fetchError);
    throw new Error(`TuGo API fetch failed: ${fetchError.message}`);
  }
  
  let data;
  try {
    const text = await res.text();
    console.log('[TuGo API] Response body (raw):', text.substring(0, 500)); // Log first 500 chars
    data = JSON.parse(text);
  } catch (parseError) {
    console.error('[TuGo API] JSON parse error:', parseError);
    data = {};
  }
  
  console.log('[TuGo API] Parsed response:', {
    hasEndpoint: !!data?.endpoint,
    hasRequest: !!data?.request,
    hasResponse: !!data?.response,
    responseError: data?.response?.error,
    hasPlans: Array.isArray(data?.response?.availablePlanPrices),
    planCount: Array.isArray(data?.response?.availablePlanPrices) ? data.response.availablePlanPrices.length : 0,
  });
  
  // Always return data even if status is not ok - the function returns statusCode 200 with fallback
  // Check for error field in response to determine if it's a fallback
  if (!res.ok && !data?.response?.error) {
    const msg =
      data?.response?.messages?.[0]?.text ||
      data?.response?.errorMessage ||
      data?.message ||
      `TuGo quote error: ${res.status}`;
    console.error('[TuGo API] Error response:', msg);
    throw new Error(msg);
  }
  
  return data; // { endpoint, request, response }
}

export async function submitApplication(formWithQuote) {
  const res = await fetch(APPLICATIONS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formWithQuote),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Application submit failed: ${res.status} ${text}`);
  }
  return res.json();
}
