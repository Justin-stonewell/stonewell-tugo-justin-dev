// Placeholder fallback pricing service - reuse existing logic if available
async function priceDbFallback(form) {
  // TODO: integrate existing DB-based pricing logic; return normalized shape
  const premium = 100; // placeholder
  const taxes = 0;
  const deductible = (form && form.deductible) || 0;
  return {
    currency: 'CAD',
    premium,
    taxes,
    total: premium + taxes,
    deductible,
    productCode: 'DB_FALLBACK',
    coverages: { medicalLimit: 0 },
  };
}

module.exports = { priceDbFallback };
