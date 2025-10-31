import React, { useState } from 'react'
import { sellTugo } from '../../lib/api'

export default function SellTest() {
  if (process.env.NODE_ENV === 'production') return null
  const [applicationId, setApplicationId] = useState('')
  const [priceOverrideReason, setPriceOverrideReason] = useState('')
  const [resJson, setResJson] = useState('')
  const [health, setHealth] = useState('')
  const [qhealth, setQHealth] = useState('')

  async function runSell() {
    try {
      const res = await sellTugo(applicationId, priceOverrideReason || undefined)
      setResJson(JSON.stringify(res, null, 2))
    } catch (e) {
      setResJson(String(e))
    }
  }

  async function runHealth() {
    const r = await fetch('/.netlify/functions/health')
    setHealth(await r.text())
  }

  async function runQHealth() {
    const r = await fetch('/.netlify/functions/quoteHealth')
    setQHealth(await r.text())
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>Dev: Sell Test</h3>
      <div>
        <label>applicationId</label>
        <input value={applicationId} onChange={(e) => setApplicationId(e.target.value)} />
      </div>
      <div>
        <label>priceOverrideReason (optional)</label>
        <input value={priceOverrideReason} onChange={(e) => setPriceOverrideReason(e.target.value)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={runSell}>Pre-Sell (sellTugo)</button>
        <button onClick={runHealth} style={{ marginLeft: 8 }}>Health</button>
        <button onClick={runQHealth} style={{ marginLeft: 8 }}>QuoteHealth</button>
      </div>
      <pre style={{ background: '#111', color: '#0f0', padding: 8, marginTop: 12 }}>{resJson}</pre>
      <pre style={{ background: '#222', color: '#fff', padding: 8, marginTop: 12 }}>health: {health}</pre>
      <pre style={{ background: '#333', color: '#fff', padding: 8, marginTop: 12 }}>quoteHealth: {qhealth}</pre>
    </div>
  )
}
