import type { Handler } from '@netlify/functions'

const VERSION = '1.0.0'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' }
  const useApi = (process.env.USE_TUGO_API_PRICING || 'false') === 'true'
  let tugoEnvReady = true
  if (useApi) {
    const required = ['TUGO_API_KEY', 'TUGO_API_SECRET', 'TUGO_USER_NAME', 'TUGO_PASSWORD']
    tugoEnvReady = required.every((k) => (process.env as any)[k])
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, version: VERSION, hasQuote: true, tugoEnvReady }),
  }
}
