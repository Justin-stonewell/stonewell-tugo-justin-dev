// src/lib/planSelection.js
// Utilities to map TuGo quote response to UI and build a policy draft

export function mapPlansForUI(response = {}) {
  const plans = Array.isArray(response.availablePlanPrices)
    ? response.availablePlanPrices
    : [];
  return plans.map((p) => {
    const premium = typeof p.premium === 'number' ? p.premium : 0;
    const tax = typeof p.tax === 'number' ? p.tax : 0;
    const planCost = typeof p.planCost === 'number' ? p.planCost : premium + tax;
    return {
      code: p.planCode,
      name: p.planName,
      premium,
      tax,
      total: planCost,
    };
  });
}

function diffDaysCeil(start, end) {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const ms = e.getTime() - s.getTime();
    if (!isFinite(ms)) return 0;
    return Math.max(0, Math.ceil(ms / 86400000));
  } catch {
    return 0;
  }
}

export function buildSelectedPlansForPolicy(selectedPlanCode, request = {}) {
  const trip = request.trip || {};
  const insuredPersons = Array.isArray(request.insuredPersons)
    ? request.insuredPersons
    : [];
  const tripDays = diffDaysCeil(trip.startDate, trip.endDate);

  return insuredPersons.map((p) => {
    const params = [{ code: 'TRIP', value: tripDays }];
    if (p && typeof p.age === 'number') {
      params.push({ code: 'AGE', value: Number(p.age) });
    }
    return {
      planCode: selectedPlanCode,
      effectiveDate: trip.startDate,
      expiryDate: trip.endDate,
      priceInputParameters: params,
    };
  });
}

export function buildPolicyDraft(quotePacket = {}, selectedPlanCode) {
  const request = quotePacket.request || {};
  const response = quotePacket.response || {};
  const insuredPersons = Array.isArray(request.insuredPersons)
    ? request.insuredPersons
    : [];

  return {
    policyInfo: {
      sourceSystemCode: 'STONEWELL_PORTAL',
      productLineCode: request.productLineCode || 'PR-FDM-1',
      partnerCode: request.partnerCode || 'SFS000',
      applicationDate: request.trip && request.trip.startDate,
      effectiveDate: request.trip && request.trip.startDate,
      language: 'en',
      emailFulfillment: true,
    },
    trip: request.trip,
    insuredPersons: insuredPersons.map((p) => ({
      firstName: p.firstName,
      lastName: p.lastName,
      birthDate: p.birthDate,
      insuredType: request.insuredType || 'CANADIAN',
      insuredGroupType: p.insuredGroupType || 'INDIVIDUAL',
      homeProvince: p.homeProvince || (request.trip && request.trip.departureProvince),
      selectedPlans: [],
    })),
    _selectedPlanCode: selectedPlanCode,
    _pricing: Array.isArray(response.availablePlanPrices)
      ? response.availablePlanPrices
      : [],
  };
}

export function attachSelectedPlans(policyDraft) {
  if (!policyDraft) return policyDraft;
  const requestShape = {
    trip: policyDraft.trip,
    insuredPersons: policyDraft.insuredPersons,
  };
  const selectedPlans = buildSelectedPlansForPolicy(
    policyDraft._selectedPlanCode,
    requestShape
  );
  const updated = { ...policyDraft };
  updated.insuredPersons = (policyDraft.insuredPersons || []).map((p, idx) => ({
    ...p,
    selectedPlans: [selectedPlans[idx]],
  }));
  return updated;
}
