export function buildQuoteForm(state) {
  const {
    residenceCountry,
    province,
    startDate,
    endDate,
    insuredPersons,
    isFamilyPlan,
    deductible,
    tripCosts,
    preExisting,
  } = state || {}
  return {
    residenceCountry,
    province: province || null,
    startDate,
    endDate,
    insuredPersons: Array.isArray(insuredPersons) ? insuredPersons : [],
    isFamilyPlan: !!isFamilyPlan,
    deductible: Number.isFinite(deductible) ? Number(deductible) : 0,
    tripCosts: Array.isArray(tripCosts) ? tripCosts.map((x) => Number(x || 0)) : [],
    preExisting: !!preExisting,
  }
}
