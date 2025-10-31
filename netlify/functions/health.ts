import type { Handler } from '@netlify/functions'
import { query } from './_db'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const res = await query('SELECT 1')
    const ok = res?.rows?.length > 0
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, db: ok }) }
  } catch (e: any) {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, db: false, error: e.message }) }
  }
}
