import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'

// Static fallback data - only used as LAST RESORT if API call fails
const FALLBACK_COUNTRIES = {
  data: {
    rows: [
      { code: 'CA', name: 'Canada' },
      { code: 'US', name: 'United States' },
    ],
  },
};

const FALLBACK_PROVINCES = {
  data: {
    rows: [
      { code: 'ON', name: 'Ontario' },
      { code: 'BC', name: 'British Columbia' },
      { code: 'AB', name: 'Alberta' },
      { code: 'QC', name: 'Quebec' },
      { code: 'MB', name: 'Manitoba' },
      { code: 'SK', name: 'Saskatchewan' },
      { code: 'NS', name: 'Nova Scotia' },
      { code: 'NB', name: 'New Brunswick' },
      { code: 'NL', name: 'Newfoundland and Labrador' },
      { code: 'PE', name: 'Prince Edward Island' },
      { code: 'YT', name: 'Yukon' },
      { code: 'NT', name: 'Northwest Territories' },
      { code: 'NU', name: 'Nunavut' },
    ],
  },
};

// get all country
function getCountry() {
  // Always call the real API - no Preview mode short-circuit
  const fullUrl = `${API_URL}api/v1/countries/country`;
  console.log('[countrySaga] API called', fullUrl);
  
  return axios
    .get(fullUrl)
    .then((res) => {
      console.log('[countrySaga] Country API success, response:', res.data);
      return res.data
    })
    .catch((error) => {
      console.error('[countrySaga] Country API error:', error.message, error.response?.status, fullUrl);
      // Only return error - let the saga handle fallback if needed
      throw error;
    })
}

function* fetchCountry() {
  try {
    const countries = yield call(getCountry)
    yield delay(500)
    console.log('[countrySaga] Dispatching GET_COUNTRY_SUCCESS with data:', countries);
    yield put({ type: 'GET_COUNTRY_SUCCESS', countries: countries })
  } catch (e) {
    // LAST RESORT: If API call fails completely, use fallback data
    // This prevents complete failure but should rarely be needed
    console.warn('[countrySaga] Country API call failed, using fallback data:', e.message);
    yield put({ type: 'GET_COUNTRY_SUCCESS', countries: FALLBACK_COUNTRIES })
  }
}

// get all province
function getProvince() {
  // Always call the real API - no Preview mode short-circuit
  const fullUrl = `${API_URL}api/v1/countries/province`;
  console.log('[countrySaga] API called', fullUrl);
  
  return axios
    .get(fullUrl)
    .then((res) => {
      console.log('[countrySaga] Province API success, response:', res.data);
      return res.data
    })
    .catch((error) => {
      console.error('[countrySaga] Province API error:', error.message, error.response?.status, fullUrl);
      // Only return error - let the saga handle fallback if needed
      throw error;
    })
}

function* fetchProvince() {
  try {
    const provinces = yield call(getProvince)
    yield delay(500)
    console.log('[countrySaga] Dispatching GET_PROVINCE_SUCCESS with data:', provinces);
    yield put({ type: 'GET_PROVINCE_SUCCESS', provinces: provinces })
  } catch (e) {
    // LAST RESORT: If API call fails completely, use fallback data
    // This prevents complete failure but should rarely be needed
    console.warn('[countrySaga] Province API call failed, using fallback data:', e.message);
    yield put({ type: 'GET_PROVINCE_SUCCESS', provinces: FALLBACK_PROVINCES })
  }
}

function* CountrySaga() {
  yield takeEvery('GET_COUNTRY_REQUESTED', fetchCountry)
  yield takeEvery('GET_PROVINCE_REQUESTED', fetchProvince)
}

export default CountrySaga
