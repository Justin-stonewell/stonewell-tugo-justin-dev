import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'

// Check if we should use Preview mode static data
const USE_NETLIFY_FUNCTIONS = String(
  process.env.REACT_APP_USE_NETLIFY_FUNCTIONS || 'false'
).toLowerCase() === 'true';

// Preview mode: when using Netlify Functions AND no production API URL is set
// API_URL is undefined, null, or empty string in Preview
const IS_PREVIEW_MODE = USE_NETLIFY_FUNCTIONS && (!API_URL || API_URL === '' || API_URL === 'undefined');

// Static mock data for Preview mode
const PREVIEW_COUNTRIES = {
  data: {
    rows: [
      { code: 'CA', name: 'Canada' },
      { code: 'US', name: 'United States' },
    ],
  },
};

const PREVIEW_PROVINCES = {
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
  // In Preview mode (using Netlify Functions), always use static data
  // This ensures countries work in Preview regardless of API availability
  if (USE_NETLIFY_FUNCTIONS) {
    console.log('[countrySaga] Preview/Netlify Functions mode: using static countries data');
    return Promise.resolve(PREVIEW_COUNTRIES);
  }

  // Production: call the real API
  const endpoint = `${API_URL}api/v1/countries/country`;

  return axios
    .get(endpoint)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((error) => {
      // console.log('error in country saga: ' + error)
      // In production, propagate the error
      throw error;
    })
}

function* fetchCountry() {
  try {
    const countries = yield call(getCountry)
    yield delay(500)
    // Ensure we have valid data structure
    if (!countries || !countries.data || !countries.data.rows) {
      console.warn('[countrySaga] Invalid countries response, using Preview fallback');
      if (IS_PREVIEW_MODE || USE_NETLIFY_FUNCTIONS) {
        yield put({ type: 'GET_COUNTRY_SUCCESS', countries: PREVIEW_COUNTRIES })
      } else {
        yield put({ type: 'GET_COUNTRY_FAILED', message: 'Invalid response structure' })
      }
      return;
    }
    yield put({ type: 'GET_COUNTRY_SUCCESS', countries: countries })
  } catch (e) {
    // If error and in Preview mode, use static data
    console.warn('[countrySaga] Country fetch error, using fallback:', e.message);
    if (IS_PREVIEW_MODE || USE_NETLIFY_FUNCTIONS) {
      yield put({ type: 'GET_COUNTRY_SUCCESS', countries: PREVIEW_COUNTRIES })
    } else {
      yield put({ type: 'GET_COUNTRY_FAILED', message: e.message })
    }
  }
}

// get all province
function getProvince() {
  // In Preview mode (using Netlify Functions), always use static data
  // This ensures provinces work in Preview regardless of API availability
  if (USE_NETLIFY_FUNCTIONS) {
    console.log('[countrySaga] Preview/Netlify Functions mode: using static provinces data');
    return Promise.resolve(PREVIEW_PROVINCES);
  }

  // Production: call the real API
  const endpoint = `${API_URL}api/v1/countries/province`;

  return axios
    .get(endpoint)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((error) => {
      // console.log("error in province saga: "+ error)
      // In production, propagate the error
      throw error;
    })
}

function* fetchProvince() {
  try {
    const provinces = yield call(getProvince)
    yield delay(500)
    // Ensure we have valid data structure
    if (!provinces || !provinces.data || !provinces.data.rows) {
      console.warn('[countrySaga] Invalid provinces response, using Preview fallback');
      if (IS_PREVIEW_MODE || USE_NETLIFY_FUNCTIONS) {
        yield put({ type: 'GET_PROVINCE_SUCCESS', provinces: PREVIEW_PROVINCES })
      } else {
        yield put({ type: 'GET_PROVINCE_FAILED', message: 'Invalid response structure' })
      }
      return;
    }
    yield put({ type: 'GET_PROVINCE_SUCCESS', provinces: provinces })
  } catch (e) {
    // If error and in Preview mode, use static data
    console.warn('[countrySaga] Province fetch error, using fallback:', e.message);
    if (IS_PREVIEW_MODE || USE_NETLIFY_FUNCTIONS) {
      yield put({ type: 'GET_PROVINCE_SUCCESS', provinces: PREVIEW_PROVINCES })
    } else {
      yield put({ type: 'GET_PROVINCE_FAILED', message: e.message })
    }
  }
}

function* CountrySaga() {
  yield takeEvery('GET_COUNTRY_REQUESTED', fetchCountry)
  yield takeEvery('GET_PROVINCE_REQUESTED', fetchProvince)
}

export default CountrySaga
