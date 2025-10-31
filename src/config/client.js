// Netlify Function endpoints
export const QUOTE_ENDPOINT = "/.netlify/functions/tugoQuote";
export const APPLICATIONS_ENDPOINT = "/.netlify/functions/applications";

// ---- Build-time pricing flag (build-safe; no optional chaining/import.meta) ----
// Works with: Vite (VITE_*), CRA (REACT_APP_*), or plain env (USE_TUGO_API_PRICING)
let rawFlag = "false";

try {
  if (typeof process !== "undefined" && process && process.env) {
    rawFlag = String(
      process.env.VITE_USE_TUGO_API_PRICING ||
        process.env.REACT_APP_USE_TUGO_API_PRICING ||
        process.env.USE_TUGO_API_PRICING ||
        "false"
    );
  }
} catch (e) {
  // no-op
}

export const USE_TUGO_API_PRICING = (rawFlag + "").toLowerCase() === "true";
