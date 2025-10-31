// Runtime configuration and env validation for TuGo Quote API integration

const env = {
  TUGO_API_BASE_URL: process.env.TUGO_API_BASE_URL || 'https://api.tugo.example/v1',
  TUGO_API_KEY: process.env.TUGO_API_KEY || '',
  TUGO_API_SECRET: process.env.TUGO_API_SECRET || '',
  USE_TUGO_API_PRICING: process.env.USE_TUGO_API_PRICING || 'false',
  QUOTE_API_TIMEOUT_MS: process.env.QUOTE_API_TIMEOUT_MS || '8000',
  QUOTE_API_CACHE_TTL_SEC: process.env.QUOTE_API_CACHE_TTL_SEC || '300',
  NODE_ENV: process.env.NODE_ENV,
};

function assertNumberString(name, val) {
  if (!/^\d+$/.test(String(val))) {
    throw new Error(`Invalid numeric env ${name}: ${val}`);
  }
}

assertNumberString('QUOTE_API_TIMEOUT_MS', env.QUOTE_API_TIMEOUT_MS);
assertNumberString('QUOTE_API_CACHE_TTL_SEC', env.QUOTE_API_CACHE_TTL_SEC);

module.exports = { env };
