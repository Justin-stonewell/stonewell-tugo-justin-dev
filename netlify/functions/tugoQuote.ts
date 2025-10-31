import type { Handler } from '@netlify/functions'
import crypto from 'crypto'

// Simple in-memory rate limit: 30 req/min/IP
const RL_WINDOW_MS = 60 * 1000
const RL_LIMIT = 30
const rlStore: Map<string, { count: number; windowStart: number }> = new Map()

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const rec = rlStore.get(ip) || { count: 0, windowStart: now }
  if (now - rec.windowStart > RL_WINDOW_MS) {
    rec.count = 0
    rec.windowStart = now
  }
  rec.count += 1
  rlStore.set(ip, rec)
  return rec.count <= RL_LIMIT
}

// Core imports via require (CRA repo using JS services)
const { quoteWithFallback, hashForm } = require('../../src/server/services/tugoQuoteService')
const { validateQuoteInput } = require('../../src/server/handlers/tugoQuoteCore')

export const handler: Handler = async (event, context) => {
  const requestId = crypto.randomUUID()
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method Not Allowed' }) }
    }
    const ip = (event.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
    if (!rateLimit(ip)) {
      return { statusCode: 429, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Too many requests' }) }
    }

    const body = event.body ? JSON.parse(event.body) : null
    const err = validateQuoteInput(body)
    if (err) {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Invalid input', details: err }) }
    }

    const start = Date.now()
    const quote = await quoteWithFallback(body)
    const payloadHash = hashForm(body)
    const elapsed = Date.now() - start
    console.log(JSON.stringify({ level: 'info', requestId, payloadHash, source: quote.source, elapsedMs: elapsed }))

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...quote, payloadHash }),
    }
  } catch (e: any) {
    console.error(JSON.stringify({ level: 'error', requestId, msg: 'tugoQuote function error', err: e?.message }))
    return { statusCode: 502, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Quote service unavailable' }) }
  }
}
