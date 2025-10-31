import type { Handler } from '@netlify/functions'
import { query } from './_db'
import { SellRequestSchema } from './_types'

const REPRICE = (process.env.REPRICE_BEFORE_SELL || 'false') === 'true'
const THRESH = Number(process.env.REPRICE_DIFF_THRESHOLD || 0.01)

async function sellWithTuGo(application: any, price: { premium: number|null, taxes: number|null, total: number|null }) {
  // TODO: integrate with existing TuGo sell flow
  return { success: true, policyNumber: 'TUGO-XXXXXX' }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const parsed = SellRequestSchema.parse(JSON.parse(event.body || '{}'))
    const { applicationId, priceOverrideReason } = parsed

    const { rows } = await query(`SELECT * FROM applications WHERE id=$1`, [applicationId])
    if (!rows.length) return { statusCode: 404, body: 'application not found' }
    const app = rows[0]

    let usingSnapshotPrice = false
    let price = {
      premium: app.quoted_premium as number | null,
      taxes: app.quoted_taxes as number | null,
      total: app.quoted_total as number | null,
    }

    if (price.total != null) {
      usingSnapshotPrice = true
      // Try aligning final fields if they exist; ignore error if columns missing
      try {
        await query(
          `UPDATE applications SET final_premium=$1, final_taxes=$2, final_total=$3 WHERE id=$4`,
          [price.premium, price.taxes, price.total, applicationId]
        )
      } catch (e) {
        // Ignore if final_* columns not present; optional alignment only
      }
    }

    if (REPRICE && price.total != null) {
      // TODO: server-to-server reprice using stored app data
      const diff = 0 // placeholder
      if (diff > THRESH && !priceOverrideReason) {
        return {
          statusCode: 409,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Quote drift exceeds threshold', require: 'priceOverrideReason' }),
        }
      }
      if (diff > THRESH && priceOverrideReason) {
        await query(`UPDATE applications SET price_override_reason=$1 WHERE id=$2`, [priceOverrideReason, applicationId])
        console.log(JSON.stringify({ event: 'price_override', appId: applicationId, reason: priceOverrideReason }))
      }
    }

    console.log(JSON.stringify({ event: 'sell_start', appId: applicationId, usingSnapshotPrice, repriceCheck: REPRICE ? 'enabled' : 'disabled' }))

    const sellRes = await sellWithTuGo(app, price)
    if (!sellRes.success) return { statusCode: 502, body: 'sell failed' }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId, usingSnapshotPrice, sold: true, policyNumber: sellRes.policyNumber }),
    }
  } catch (e: any) {
    if (e?.issues) {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'VALIDATION_ERROR', details: e.issues }) }
    }
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'BAD_REQUEST', details: e?.message || String(e) }) }
  }
}
