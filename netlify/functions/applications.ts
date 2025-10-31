import type { Handler } from '@netlify/functions'
import { ApplicationCreateSchema } from './_types'
import { query } from './_db'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  try {
    const body = JSON.parse(event.body || '{}')
    const data = ApplicationCreateSchema.parse(body)

    const res = await query(
      `INSERT INTO applications
       (contact_email, start_date, end_date,
        quoted_premium, quoted_taxes, quoted_total, quoted_currency, quoted_product_code,
        quote_payload_hash, quote_source, quote_at, price_override_reason)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id`,
      [
        data.contactEmail,
        data.startDate,
        data.endDate,
        data.quotedPremium ?? null,
        data.quotedTaxes ?? null,
        data.quotedTotal ?? null,
        data.quotedCurrency ?? null,
        data.quotedProductCode ?? null,
        data.quotePayloadHash ?? null,
        data.quoteSource ?? null,
        data.quoteAt ?? null,
        data.priceOverrideReason ?? null,
      ]
    )
    const applicationId = res.rows[0].id
    const hasQuoteSnapshot = !!data.quotedTotal
    console.log(
      JSON.stringify({
        event: 'application_submit',
        appId: applicationId,
        hasQuoteSnapshot,
        quoteSource: data.quoteSource,
        quoteAt: data.quoteAt,
        quotePayloadHash: data.quotePayloadHash,
      })
    )
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId, hasQuoteSnapshot }),
    }
  } catch (e: any) {
    if (e?.issues) {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'VALIDATION_ERROR', details: e.issues }) }
    }
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'BAD_REQUEST', details: e?.message || String(e) }) }
  }
}
