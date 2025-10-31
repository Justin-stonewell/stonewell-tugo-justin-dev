// Core handler shared by Express route and Netlify function
const { quoteWithFallback, hashForm } = require('../services/tugoQuoteService')

function validateQuoteInput(body) {
  if (!body) return 'Empty body'
  if (!body.residenceCountry) return 'residenceCountry is required'
  if (!body.startDate || !body.endDate) return 'startDate/endDate are required'
  const sd = new Date(body.startDate)
  const ed = new Date(body.endDate)
  if (isNaN(sd.getTime()) || isNaN(ed.getTime())) return 'dates must be YYYY-MM-DD'
  if (sd > ed) return 'startDate must be <= endDate'
  if (!Array.isArray(body.insuredPersons) || body.insuredPersons.length < 1) return 'insuredPersons required'
  for (const p of body.insuredPersons) {
    if (!p.birthDate || isNaN(new Date(p.birthDate).getTime())) return 'insuredPersons.birthDate must be YYYY-MM-DD'
  }
  if (body.deductible != null && (typeof body.deductible !== 'number' || body.deductible < 0)) return 'invalid deductible'
  if (Array.isArray(body.tripCosts)) {
    if (body.tripCosts.some((n) => typeof n !== 'number' || n < 0)) return 'tripCosts must be non-negative numbers'
  }
  if (body.isFamilyPlan && body.insuredPersons.length < 2) return 'family plan requires at least 2 persons'
  return null
}

async function getQuote(form) {
  const quote = await quoteWithFallback(form)
  const payloadHash = hashForm(form)
  return { ...quote, payloadHash }
}

module.exports = { validateQuoteInput, getQuote }
