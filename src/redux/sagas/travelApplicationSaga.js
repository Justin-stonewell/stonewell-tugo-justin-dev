import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

function getTravelApplication(value) {
  const parmsValues = Object.values(value.payload);
  // console.log('parmsValues', parmsValues)
  return axios.get(`${API_URL}api/v1/travel_applications/fr=${parmsValues[0]}&to=${parmsValues[1]}&vendor_id=${parmsValues[2]}`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel application saga: "+ error)
        return error
      })
}

function* fetchGetTravelApplication(value) {
  try {
    const applications = yield call(getTravelApplication, value);
    yield delay(500)
    yield put({ type: 'GET_APPLICAION_SUCCESS', applications: applications});
  } catch(e) {
    yield put({ type: 'GET_APPLICAION_FAILED', message: e.message });

  }
}


// get applicant's medical questionnaire
function getTravelApplicantMedAnswer(value) {
  const parmsValues = Object.values(value.payload);
  return axios.get(`${API_URL}api/v1/travel_applications/med-questionnaire/application_id=${parmsValues[0]}&insured_id=${parmsValues[1]}`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel application saga: "+ error)
        return error
      })
}

function* fetchGetTravelApplicantMedAnswer(value) {
  try {
    const answer = yield call(getTravelApplicantMedAnswer, value);
    yield delay(500)
    yield put({ type: 'GET_APPLICANT_MED_ANSWER_SUCCESS', answer: answer});
  } catch(e) {
    yield put({ type: 'GET_APPLICANT_MED_ANSWER_FAILED', message: e.message });

  }
}

// get travel application by client
function getTravelApplicationsByClient(value) {
  // return axios.get(`${API_URL}api/v1/travel_applications/list/user_id=${value.payload}`)
  return axios.get(`${API_URL}api/v1/travel_applications/list/email=${value.payload}`)
  .then(res => {
    // console.log('saga- result',res.data)
    return res.data
  }).catch((error)=>{
    // console.log(match.params)
    console.log("error in Travel application saga: "+ error)
    return error
  })
}

function* fetchGetTravelApplicationsByClient(value) {
  try {
    const applications = yield call(getTravelApplicationsByClient, value);

    yield delay(500)
    yield put({ type: 'GET_APPLICAION_BY_CLIENT_SUCCESS', applications: applications});
  } catch(e) {
    yield put({ type: 'GET_APPLICAION_BY_CLIENT_FAILED', message: e.message });

  }
}


//  Get Renewable Application
function getRenewableApplication(value) {
  return axios.get(`${API_URL}api/v1/travel_applications/renewable`)
  .then(res => {
    // console.log('saga- result',res.data)
    return res.data
  }).catch((error)=>{
    // console.log(match.params)
    console.log("error in Travel application saga: "+ error)
    return error
  })
}

function* fetchGetRenewableApplication(value) {
  try {
    const applications = yield call(getRenewableApplication, value);
    yield delay(500)
    yield put({ type: 'GET_RENEWABLE_APPLICAION_SUCCESS', applications: applications});
  } catch(e) {
    yield put({ type: 'GET_RENEWABLE_APPLICAION_FAILED', message: e.message });

  }
}


// post application
// Helpers to normalize payload to backend-safe shape
function formatDateOnly(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().substring(0, 10);
}

function toNumber(val) {
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
}

function sanitizeCoverage(c) {
  return {
    ...(c || {}),
    deduct: toNumber(c?.deduct),
    value: toNumber(c?.value),
    discount: toNumber(c?.discount),
  };
}

function sanitizePlan(sp) {
  const plan = { ...(sp || {}) };
  plan.selectedDeduct = toNumber(plan.selectedDeduct);
  plan.selectedCoverage = toNumber(plan.selectedCoverage);
  plan.insuranceAmount = toNumber(plan.insuranceAmount);
  plan.calculatedInsuranceAmount = toNumber(plan.calculatedInsuranceAmount);
  plan.medicalProductNoDeductValue = toNumber(plan.medicalProductNoDeductValue);
  plan.medicalProductDeductValue = toNumber(plan.medicalProductDeductValue);
  if (Array.isArray(plan.coverages)) {
    plan.coverages = plan.coverages.map(sanitizeCoverage);
  }
  return plan;
}

function normalizeTravelApplicationPayload(data) {
  let normalized = { ...(data || {}) };
  const persons = Array.isArray(normalized.insuredPersons) ? normalized.insuredPersons : [];

  // counts
  normalized.insuredNumber = Number(normalized.insuredNumber) || persons.length || 0;

  // dates
  normalized.tripStartDate = formatDateOnly(normalized.tripStartDate);
  normalized.tripEndDate = formatDateOnly(normalized.tripEndDate);
  normalized.tripArrivalDate = formatDateOnly(normalized.tripArrivalDate);

  // application type
  const appType = String(normalized.insuranceType || normalized.application?.applicationType || '').toLowerCase();
  if (appType) normalized.applicationType = appType;
  normalized.application = {
    ...(normalized.application || {}),
    applicationCompany: normalized.application?.applicationCompany || '',
    applicationType: appType,
  };

  // total premium
  if (normalized.familyGroup && normalized.familyGroup.totalPremium != null) {
    normalized.totalPremium = normalized.familyGroup.totalPremium;
  }

  // contact name
  if (!normalized.contactName && persons[0]) {
    normalized.contactName = [persons[0].firstName, persons[0].lastName].filter(Boolean).join(' ');
  }

  // mailing/billing fallback
  const mailAddr = {
    address: normalized.mailStreetName || normalized.billStreetName || '',
    city: normalized.mailCity || normalized.billCity || '',
    province: normalized.mailProvince || normalized.billProvince || '',
    country: normalized.mailCountry || normalized.billCountry || '',
    postalCode: normalized.mailPostalCode || normalized.billPostalCode || '',
  };

  normalized.insuredPersons = persons.map((p, idx) => {
    const person = { ...(p || {}) };
    person.relationship = person.relationship || (idx === 0 ? 'Primary' : 'Spouse/Child');
    person.birthDate = formatDateOnly(person.birthDate);
    person.tripStartDate = formatDateOnly(person.tripStartDate);
    person.tripEndDate = formatDateOnly(person.tripEndDate);
    person.arrivalDate = formatDateOnly(person.arrivalDate);
    person.graduatedDate = formatDateOnly(person.graduatedDate);
    person.yearDateAfterGraduated = formatDateOnly(person.yearDateAfterGraduated);
    person.tripDepartureDate = formatDateOnly(person.tripDepartureDate);
    person.tripArrivalDate = formatDateOnly(person.tripArrivalDate);
    person.sameDate = !!person.sameDate;
    person.selectedPlan = sanitizePlan(person.selectedPlan || {});
    person.insurancePlans = Array.isArray(person.insurancePlans) ? person.insurancePlans.map(sanitizePlan) : [];
    const care = person.optionalCarewellService || { packageName: 'Package', packageAmount: 0, isSelected: false };
    person.optionalCarewellService = { ...care, packageAmount: toNumber(care.packageAmount), isSelected: !!care.isSelected };
    person.optionalAddOnPlans = Array.isArray(person.optionalAddOnPlans)
      ? person.optionalAddOnPlans.map((op) => ({
          ...(op || {}),
          planTypes: Array.isArray(op?.planTypes)
            ? op.planTypes.map((pt) => ({
                ...(pt || {}),
                selectedCoverage: toNumber(pt?.selectedCoverage),
                calculatedAddOnAmount: toNumber(pt?.calculatedAddOnAmount),
                isSelected: !!pt?.isSelected,
                coverages: Array.isArray(pt?.coverages) ? pt.coverages.map(sanitizeCoverage) : [],
              }))
            : [],
        }))
      : [];
    person.address = person.address ?? mailAddr.address;
    person.city = person.city ?? mailAddr.city;
    person.province = person.province ?? mailAddr.province;
    person.country = person.country ?? mailAddr.country;
    person.postalCode = person.postalCode ?? mailAddr.postalCode;
    return person;
  });

  // Deep numeric coerce as final safety net
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
      for (const k of keys) {
        out[k] = deepCoerce(node[k], k);
      }
      return out;
    }
    if (typeof node === 'string' && numericKeys.has(parentKey)) {
      const m = node.match(/^[-+]?\d+(?:\.\d+)?$/);
      if (m) return parseFloat(node);
    }
    return node;
  }

  normalized = deepCoerce(normalized, undefined);
  return normalized;
}

function postTravelApplication(value) {
  const payload = normalizeTravelApplicationPayload(value.payload);
  return axios.post(`${API_URL}api/v1/travel_applications/add`, payload)
      .then(res => {
        return res.data
      }).catch((error)=>{
        return error
      })
}

function* fetchPostTravelApplication(value) {
  try {
    const result = yield call(postTravelApplication, value);
    yield delay(500)
    yield put({ type: 'POST_APPLICAION_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_APPLICAION_FAILED', message: e.message });

  }
}


// update (put) payment application
function updatePaymentTravelApplication(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/update/direct-payment/confirmation_no=${value.payload.confirmationNo}`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchUpdatePaymentTravelApplication(value) {
  try {
    const result = yield call(updatePaymentTravelApplication, value);
    yield delay(500)
    yield put({ type: 'PUT_APPLICAION_PAYMENT_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_APPLICAION_PAYMENT_FAILED', message: e.message });

  }
}
// update (put) status application
function updateStatusTravelApplication(value) {
  // return axios.put(`${API_URL}api/v1/travel_applications/update/application_id=${value.payload.application_id}&token=${value.payload.token}`, value.payload.data)
  return axios.put(`${API_URL}api/v1/travel_applications/update/process/application_id=${value.payload.application_id}`, value.payload.data)
  // return axios.put(`${API_URL}api/v1/travel_quotes/update/process/application_id=${value.payload.application_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchUpdateStatusTravelApplication(value) {
  try {
    const result = yield call(updateStatusTravelApplication, value);
    yield delay(500)
    yield put({ type: 'PUT_APPLICAION_STATUS_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_APPLICAION_STATUS_FAILED', message: e.message });

  }
}

// update (put) application
function updateTravelApplication(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/update/update_target=${value.payload.update_target}&application_id=${value.payload.application_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchUpdateTravelApplication(value) {
  try {
    const result = yield call(updateTravelApplication, value);
    yield delay(500)
    yield put({ type: 'PUT_APPLICAION_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_APPLICAION_FAILED', message: e.message });

  }
}


// merge ZCRM Sales to ZApplications
function mergeZCRMSalesApplication() {
  return axios.get(`${API_URL}api/v1/zcrm_applications/merge`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchMergeZCRMSalesApplication() {
  try {
    const result = yield call(mergeZCRMSalesApplication);
    yield delay(500)
    yield put({ type: 'GET_MERGE_ZAPPLICAION_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'GET_MERGE_ZAPPLICAION_FAILED', message: e.message });

  }
}

// send email after Gettting Renewable Application
// Application for renewal: 0 days, 14 days from the expiration date
function sendEmailRenewableApplication(value) {
  return axios.get(`${API_URL}api/v1/travel_applications/send_email/renewable`)
  .then(res => {
    // console.log('saga- result',res.data)
    return res.data
  }).catch((error)=>{
    // console.log(match.params)
    console.log("error in Travel application saga: "+ error)
    return error
  })
}

function* fetchSendEmailRenewableApplication(value) {
  try {
    const result = yield call(sendEmailRenewableApplication, value);
    yield delay(500)
    yield put({ type: 'SEND_EMAIL_RENEWABLE_APPLICAION_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'SEND_EMAIL_RENEWABLE_APPLICAION_FAILED', message: e.message });

  }
}


//  Put (sell Tugo Policies & update policy number) Travel Application 
function sellTugoPolicy(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/sell/policies/application_id=${value.payload.application_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchSellTugoPolicy(value) {
  try {
    const result = yield call(sellTugoPolicy, value);
    yield delay(500)
    yield put({ type: 'PUT_SELL_TUGO_POLICY_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_SELL_TUGO_POLICY_FAILED', message: e.message });

  }
}

//  Put Quote Allianz
function quoteAllianz(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/quote/allianz`, value.payload.data)
      .then(res => {
        // console.log('saga- result quoteAllianz:',res.data)
        return res.data
      }).catch((error)=>{
        console.log("error in Travel Insurance saga - quoteAllianz: "+ error)
        return error
      })
}

function* fetchquoteAllianz(value) {
  try {
    const result = yield call(quoteAllianz, value);
    yield delay(500)
    yield put({ type: 'PUT_QUOTE_ALLIANZ_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_QUOTE_ALLIANZ_FAILED', message: e.message });

  }
}

//  Put Quote Allianz Canadian over 65 Medical Q
function quoteAllianzMedCAN(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/quote/allianz/medCAN`, value.payload.data)
      .then(res => {
        // console.log('saga- result quoteAllianzMedCAN:',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga - quoteAllianzMedCAN: "+ error)
        return error
      })
}

function* fetchquoteAllianzMedCAN(value) {
  try {
    const result = yield call(quoteAllianzMedCAN, value);
    yield delay(500)
    yield put({ type: 'PUT_QUOTE_ALLIANZ_MED_CAN_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_QUOTE_ALLIANZ_MED_CAN_FAILED', message: e.message });

  }
}

//  Put (sell Allianz Policies & update policy number) Travel Application 
function sellAllianzPolicy(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/sell/allianzPolicies/application_id=${value.payload.application_id}`, value.payload.data)
      .then(res => {
        console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchSellAllianzPolicy(value) {
  try {
    const result = yield call(sellAllianzPolicy, value);
    yield delay(500)
    yield put({ type: 'PUT_SELL_ALLIANZ_POLICY_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_SELL_ALLIANZ_POLICY_FAILED', message: e.message });

  }
}

//  Put (sell Carewell) Travel Application 
function sellCarewell(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/sell/carewell/application_id=${value.payload.application_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchSellCarewell(value) {
  try {
    const result = yield call(sellCarewell, value);
    // console.log(result)
    yield delay(500)
    yield put({ type: 'PUT_SELL_CAREWELL_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_SELL_CAREWELL_FAILED', message: e.message });

  }
}

function* TravelApplicationSaga() {
  yield takeEvery('GET_APPLICAION_REQUESTED', fetchGetTravelApplication);
  yield takeEvery('GET_APPLICANT_MED_ANSWER_REQUESTED', fetchGetTravelApplicantMedAnswer);
  yield takeEvery('GET_APPLICAION_BY_CLIENT_REQUESTED', fetchGetTravelApplicationsByClient);
  yield takeEvery('GET_RENEWABLE_APPLICAION_REQUESTED', fetchGetRenewableApplication);
  yield takeEvery('POST_APPLICAION_REQUESTED', fetchPostTravelApplication);
  yield takeEvery('PUT_APPLICAION_PAYMENT_REQUESTED', fetchUpdatePaymentTravelApplication);
  yield takeEvery('PUT_APPLICAION_STATUS_REQUESTED', fetchUpdateStatusTravelApplication);
  yield takeEvery('PUT_APPLICAION_REQUESTED', fetchUpdateTravelApplication);
  yield takeEvery('GET_MERGE_ZAPPLICAION_REQUESTED', fetchMergeZCRMSalesApplication);
  yield takeEvery('SEND_EMAIL_RENEWABLE_APPLICAION_REQUESTED', fetchSendEmailRenewableApplication);
  yield takeEvery('PUT_QUOTE_ALLIANZ_REQUESTED', fetchquoteAllianz);
  yield takeEvery('PUT_QUOTE_ALLIANZ_MED_CAN_REQUESTED', fetchquoteAllianzMedCAN);
  yield takeEvery('PUT_SELL_ALLIANZ_POLICY_REQUESTED', fetchSellAllianzPolicy);
  yield takeEvery('PUT_SELL_TUGO_POLICY_REQUESTED', fetchSellTugoPolicy);
  yield takeEvery('PUT_SELL_CAREWELL_REQUESTED', fetchSellCarewell);
}

export default TravelApplicationSaga