// src/lib/flags.js
export const useTuGoApiPricing = (
  (typeof process !== 'undefined' && process && process.env && (process.env.VITE_USE_TUGO_API_PRICING || process.env.USE_TUGO_API_PRICING))
  || '1'
) === '1';
