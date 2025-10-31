import React, { useEffect } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { postTravelApplication } from '../../../redux/actions/travelApplicationAction';
//core component
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../components/common/Submission';
import ErrorPage from '../../../components/common/ErrorPage'

// helpers moved to file scope
// Helper functions moved outside the component to satisfy hooks lint and stabilize references
const formatDateOnly = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().substring(0, 10);
};

const toNumber = (val) => {
  if (Array.isArray(val)) return toNumber(val.length > 0 ? val[0] : 0);
  if (val && typeof val === 'object') {
    const keys = Object.keys(val);
    if ('value' in val) return toNumber(val.value);
    if ('0' in val) return toNumber(val['0']);
    return keys.length ? toNumber(val[keys[0]]) : 0;
  }
  if (val == null || val === '') return 0;
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
};

const sanitizePlan = (sp) => {
  const plan = { ...(sp || {}) };
  plan.selectedDeduct = toNumber(plan.selectedDeduct);
  plan.selectedCoverage = toNumber(plan.selectedCoverage);
  plan.insuranceAmount = toNumber(plan.insuranceAmount);
  plan.calculatedInsuranceAmount = toNumber(plan.calculatedInsuranceAmount);
  plan.medicalProductNoDeductValue = toNumber(plan.medicalProductNoDeductValue);
  plan.medicalProductDeductValue = toNumber(plan.medicalProductDeductValue);
  if (Array.isArray(plan.coverages)) {
    plan.coverages = plan.coverages.map((c) => ({
      ...c,
      deduct: toNumber(c?.deduct),
      value: toNumber(c?.value),
      discount: toNumber(c?.discount),
      price_code: c?.price_code,
    }));
  }
  return plan;
};

const normalizeTravelApplication = (data) => {
  let normalized = { ...(data || {}) };
  const persons = Array.isArray(normalized.insuredPersons) ? normalized.insuredPersons : [];
  normalized.insuredNumber = Number(normalized.insuredNumber) || persons.length || 0;

  // Dates
  normalized.tripStartDate = formatDateOnly(normalized.tripStartDate);
  normalized.tripEndDate = formatDateOnly(normalized.tripEndDate);
  normalized.tripArrivalDate = formatDateOnly(normalized.tripArrivalDate);

  // applicationType lower case at root & nested application
  const appType = String(normalized.insuranceType || normalized.application?.applicationType || '').toLowerCase();
  if (appType) normalized.applicationType = appType;
  normalized.application = {
    ...(normalized.application || {}),
    applicationCompany: normalized.application?.applicationCompany || '',
    applicationType: appType,
  };

  // Promote familyGroup.totalPremium
  if (normalized.familyGroup && normalized.familyGroup.totalPremium != null) {
    normalized.totalPremium = normalized.familyGroup.totalPremium;
  }

  // contactName fallback
  if (!normalized.contactName && persons[0]) {
    normalized.contactName = [persons[0].firstName, persons[0].lastName].filter(Boolean).join(' ');
  }

  // mailing/billing address fallback
  const mailAddr = {
    address: normalized.mailStreetName || normalized.billStreetName || '',
    city: normalized.mailCity || normalized.billCity || '',
    province: normalized.mailProvince || normalized.billProvince || '',
    country: normalized.mailCountry || normalized.billCountry || '',
    postalCode: normalized.mailPostalCode || normalized.billPostalCode || '',
  };

  normalized.insuredPersons = persons.map((p, index) => ({
    ...p,
    relationship: p.relationship || (index === 0 ? 'Primary' : 'Spouse/Child'),
    birthDate: formatDateOnly(p.birthDate),
    tripStartDate: formatDateOnly(p.tripStartDate),
    tripEndDate: formatDateOnly(p.tripEndDate),
    arrivalDate: formatDateOnly(p.arrivalDate),
    graduatedDate: formatDateOnly(p.graduatedDate),
    yearDateAfterGraduated: formatDateOnly(p.yearDateAfterGraduated),
    tripDepartureDate: formatDateOnly(p.tripDepartureDate),
    tripArrivalDate: formatDateOnly(p.tripArrivalDate),
    sameDate: !!p.sameDate,
    selectedPlan: sanitizePlan(p.selectedPlan || {}),
    insurancePlans: Array.isArray(p.insurancePlans) ? p.insurancePlans.map(sanitizePlan) : [],
    optionalCarewellService: (() => {
      const care = p.optionalCarewellService || { packageName: 'Package', packageAmount: 0, isSelected: false };
      return { ...care, packageAmount: toNumber(care.packageAmount), isSelected: !!care.isSelected };
    })(),
    optionalAddOnPlans: Array.isArray(p.optionalAddOnPlans)
      ? p.optionalAddOnPlans.map((op) => ({
          ...op,
          planTypes: Array.isArray(op.planTypes)
            ? op.planTypes.map((pt) => ({
                ...pt,
                selectedCoverage: toNumber(pt?.selectedCoverage),
                calculatedAddOnAmount: toNumber(pt?.calculatedAddOnAmount),
                isSelected: !!pt?.isSelected,
                coverages: Array.isArray(pt?.coverages)
                  ? pt.coverages.map((c) => ({
                      ...c,
                      value: toNumber(c?.value),
                      deduct: toNumber(c?.deduct),
                      discount: toNumber(c?.discount),
                    }))
                  : [],
              }))
            : [],
        }))
      : [],
    address: p.address ?? mailAddr.address,
    city: p.city ?? mailAddr.city,
    province: p.province ?? mailAddr.province,
    country: p.country ?? mailAddr.country,
    postalCode: p.postalCode ?? mailAddr.postalCode,
  }));

  // Final deep numeric coerce
  const numericKeys = new Set([
    'selectedCoverage', 'selectedDeduct', 'insuranceAmount', 'calculatedInsuranceAmount',
    'medicalProductNoDeductValue', 'medicalProductDeductValue', 'deduct', 'value', 'discount',
    'calculatedAddOnAmount'
  ]);
  function deepCoerce(node, parentKey) {
    if (Array.isArray(node)) {
      if (node.length === 1 && numericKeys.has(parentKey)) {
        return deepCoerce(node[0], parentKey);
      }
      return node.map((v) => deepCoerce(v, parentKey));
    }
    if (node && typeof node === 'object') {
      const keys = Object.keys(node);
      if (keys.length === 1 && keys[0] === '0' && numericKeys.has(parentKey)) {
        return deepCoerce(node['0'], parentKey);
      }
      const out = {};
      for (const k of keys) out[k] = deepCoerce(node[k], k);
      return out;
    }
    if (node == null && numericKeys.has(parentKey)) return 0;
    if (typeof node === 'string' && numericKeys.has(parentKey)) {
      const m = node.match(/^[-+]?\d+(?:\.\d+)?$/);
      if (m) return parseFloat(node);
    }
    return node;
  }
  normalized = deepCoerce(normalized, undefined);
  return normalized;
};


const SubmitResult = (props) => {
  const { formData } = props;

  const dispatch = useDispatch();
  const result = useSelector(state => state.travelApplicationReducer.result)
  const error = useSelector(state => state.travelApplicationReducer.error)
  const loading = useSelector(state => state.travelApplicationReducer.loading)



  // helpers moved to file scope

  useEffect(() => {
    const payload = normalizeTravelApplication(formData);
    dispatch(postTravelApplication(payload));
  }, [dispatch, formData]);

  if(loading) return (
    <div>
      <CircularProgress />
    </div>
    )
  if(error && !loading) return(<ErrorPage/>)

  return(
    <>
      { result && 
        result.status === 'success'
        ? (
          <Submission
            confirmationNo={result.data}
            submissionType={'application'}
          />
        ):(
          <ErrorPage/>
        ) 
      } 
    </>
  );

};

export default SubmitResult;