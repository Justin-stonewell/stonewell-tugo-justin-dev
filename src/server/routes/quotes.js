const express = require('express');
const router = express.Router();
const { validateQuoteInput, getQuote } = require('../handlers/tugoQuoteCore');

// Simple in-memory rate limit: 30 req/min/IP
const RL_WINDOW_MS = 60 * 1000;
const RL_LIMIT = 30;
const rlStore = new Map(); // ip -> { count, windowStart }

function rateLimit(req, res, next) {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
    const now = Date.now();
    const rec = rlStore.get(ip) || { count: 0, windowStart: now };
    if (now - rec.windowStart > RL_WINDOW_MS) {
      rec.count = 0;
      rec.windowStart = now;
    }
    rec.count += 1;
    rlStore.set(ip, rec);
    if (rec.count > RL_LIMIT) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  } catch (e) {
    next();
  }
}

// Minimal validation; ideally use zod/yup here
const validateForm = validateQuoteInput;

router.post('/api/quotes/tugo', rateLimit, async (req, res) => {
  try {
    const err = validateForm(req.body);
    if (err) return res.status(400).json({ error: 'Invalid input', details: err });
    const result = await getQuote(req.body);
    res.json(result);
  } catch (e) {
    console.error('tugo quote error', e);
    res.status(502).json({ error: 'Quote service unavailable' });
  }
});

module.exports = router;
