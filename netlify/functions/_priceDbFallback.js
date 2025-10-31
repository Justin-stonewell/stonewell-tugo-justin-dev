function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const ms = e.getTime() - s.getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

async function priceDbFallback(form) {
  const numDays = daysBetween(form.startDate, form.endDate);
  const baseRatePerDay = 4.5; // placeholder per-person per-day
  const deductible = form.deductible ?? 0;
  const familyDiscount = form.isFamilyPlan && form.insuredPersons.length >= 2 ? 0.1 : 0; // 10%
  const premiumBeforeDisc = baseRatePerDay * numDays * form.insuredPersons.length;
  const premium = round2(premiumBeforeDisc * (1 - familyDiscount));
  const taxes = round2(premium * 0.12);
  const total = round2(premium + taxes);

  return {
    currency: 'CAD',
    premium,
    deductible,
    taxes,
    total,
    productCode: 'DB_FALLBACK',
    coverages: { medicalLimit: 100000, tripCancel: Array.isArray(form.tripCosts) && form.tripCosts.length ? 3000 : 0 },
    ...(process.env.NODE_ENV === 'development' ? { raw: { numDays, familyDiscount } } : {}),
  };
}

module.exports = { priceDbFallback };