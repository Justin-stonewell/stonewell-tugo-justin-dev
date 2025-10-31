import React from 'react'

export default function QuoteSummary({ quote }) {
  if (!quote) return null
  const sourceLabel = quote.source === 'tugo_api' ? 'TuGo API' : 'DB Fallback'
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, margin: '16px 0', background: '#fafafa' }}>
      <h3 style={{ marginTop: 0 }}>견적 요약</h3>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>총액</div>
          <div style={{ fontWeight: 700 }}>{quote.currency || 'CAD'} {Number(quote.total || 0).toFixed(2)}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>보험료</div>
          <div>{quote.currency || 'CAD'} {Number(quote.premium || 0).toFixed(2)}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>세금</div>
          <div>{quote.currency || 'CAD'} {Number(quote.taxes || 0).toFixed(2)}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>공제액</div>
          <div>{quote.currency || 'CAD'} {Number(quote.deductible || 0).toFixed(2)}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>상품코드</div>
          <div>{quote.productCode || '-'}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>가격 소스</div>
          <div>
            {sourceLabel}
            {quote.source === 'db_fallback' && (
              <span style={{ marginLeft: 8, color: '#b06a00', fontSize: 12 }}>
                임시 가격(폴백) — 발행 전 재확인됨
              </span>
            )}
          </div>
        </div>
      </div>
      {quote.payloadHash && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#999', wordBreak: 'break-all' }}>
          payloadHash: {quote.payloadHash}
        </div>
      )}
    </div>
  )
}
