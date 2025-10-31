import React, { useState } from 'react'
import QuoteSummary from '../../../../../components/QuoteSummary'
import { postQuoteTugo, submitApplicationToMyPortal, attachQuoteSnapshot } from '../../../../../lib/api'
import { buildQuoteForm } from '../../../../../lib/buildQuoteForm'

export default function TugoFamilyApplicationPage() {
  const [formState, setFormState] = useState({ insuredPersons: [], isFamilyPlan: true, deductible: 0 })
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function updateField(name, value) {
    setFormState((s) => ({ ...s, [name]: value }))
  }

  async function handleGetQuote(e) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      if (!formState.residenceCountry || !formState.startDate || !formState.endDate || (formState.insuredPersons || []).length < 2) {
        throw new Error('입력값이 부족합니다(가족 최소 2명)')
      }
      const sd = new Date(formState.startDate)
      const ed = new Date(formState.endDate)
      if (sd > ed) throw new Error('시작일이 종료일보다 늦습니다')

      const form = buildQuoteForm(formState)
      const q = await postQuoteTugo(form)
      setQuote(q)
    } catch (err) {
      setError('견적 요청 실패. 입력값 확인 후 다시 시도하세요.')
    } finally {
      setLoading(false)
    }
  }

  async function handleApply(e) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      const applicationPayload = { /* 기존 신청 페이로드 조합 */ }
      const merged = attachQuoteSnapshot(applicationPayload, quote)
      await submitApplicationToMyPortal(merged)
      alert('신청 완료: 견적 금액이 스냅샷되어 동일 금액으로 처리됩니다.')
    } catch (err) {
      setError('신청 실패. 잠시 후 다시 시도하세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>TuGo 가족 플랜 신청</h2>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      <form onSubmit={handleGetQuote}>
        <div>
          <label>거주 국가</label>
          <input value={formState.residenceCountry || ''} onChange={(e) => updateField('residenceCountry', e.target.value)} />
        </div>
        <div>
          <label>시작일</label>
          <input type="date" value={formState.startDate || ''} onChange={(e) => updateField('startDate', e.target.value)} />
        </div>
        <div>
          <label>종료일</label>
          <input type="date" value={formState.endDate || ''} onChange={(e) => updateField('endDate', e.target.value)} />
        </div>
        <div>
          <label>디덕터블</label>
          <input type="number" value={formState.deductible || 0} onChange={(e) => updateField('deductible', Number(e.target.value))} />
        </div>
        <button disabled={loading} type="submit">견적</button>
      </form>

      <QuoteSummary quote={quote} />

      <div style={{ marginTop: 12 }}>
        <button disabled={loading || !quote} onClick={handleApply}>신청하기</button>
      </div>
    </div>
  )
}
