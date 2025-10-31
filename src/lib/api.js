import { QUOTE_ENDPOINT } from '../config/client';
const APPLICATIONS_ENDPOINT =
  (typeof process !== 'undefined' && process.env && process.env.APPLICATIONS_ENDPOINT) ||
  '/.netlify/functions/applications';

export async function postQuoteTugo(form) {
  const res = await fetch(QUOTE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  const data = await res.json().catch(() => ({}));
  // Always return data even if status is not ok - the function returns statusCode 200 with fallback
  // Check for error field in response to determine if it's a fallback
  if (!res.ok && !data?.response?.error) {
    const msg =
      data?.response?.messages?.[0]?.text ||
      data?.response?.errorMessage ||
      data?.message ||
      `TuGo quote error: ${res.status}`;
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
