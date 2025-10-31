import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'

// Check if we should use Preview mode static data
const USE_NETLIFY_FUNCTIONS = String(
  process.env.REACT_APP_USE_NETLIFY_FUNCTIONS || 'false'
).toLowerCase() === 'true';

const IS_PREVIEW_MODE = USE_NETLIFY_FUNCTIONS && !API_URL;

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
  // In Preview mode (Netlify Functions + no API URL), return static data
  if (IS_PREVIEW_MODE) {
    console.log('[countrySaga] Using Preview mode static countries data');
    return Promise.resolve(PREVIEW_COUNTRIES);
  }

  // Try Netlify Functions if REACT_APP_USE_NETLIFY_FUNCTIONS is true
  const endpoint = USE_NETLIFY_FUNCTIONS
    ? '/.netlify/functions/api/v1/countries/country'
    : `${API_URL}api/v1/countries/country`;

  return axios
    .get(endpoint)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((error) => {
      // console.log('error in country saga: ' + error)
      // If error in Preview mode, fall back to static data
      if (IS_PREVIEW_MODE || USE_NETLIFY_FUNCTIONS) {
        console.warn('[countrySaga] API call failed, using Preview static data:', error.message);
        return PREVIEW_COUNTRIES;
      }
      return error
    })
}

function* fetchCountry() {
  try {
    const countries = yield call(getCountry)
    yield delay(500)
    yield put({ type: 'GET_COUNTRY_SUCCESS', countries: countries })
  } catch (e) {
    // If error and in Preview mode, use static data
    if (IS_PREVIEW_MODE) {
      yield put({ type: 'GET_COUNTRY_SUCCESS', countries: PREVIEW_COUNTRIES })
    } else {
      yield put({ type: 'GET_COUNTRY_FAILED', message: e.message })
    }
  }
}

// get all province
function getProvince() {
  // In Preview mode (Netlify Functions + no API URL), return static data
  if (IS_PREVIEW_MODE) {
    console.log('[countrySaga] Using Preview mode static provinces data');
    return Promise.resolve(PREVIEW_PROVINCES);
  }

  // Try Netlify Functions if REACT_APP_USE_NETLIFY_FUNCTIONS is true
  const endpoint = USE_NETLIFY_FUNCTIONS
    ? '/.netlify/functions/api/v1/countries/province'
    : `${API_URL}api/v1/countries/province`;

  return axios
    .get(endpoint)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((error) => {
      // console.log("error in province saga: "+ error)
      // If error in Preview mode, fall back to static data
      if (IS_PREVIEW_MODE || USE_NETLIFY_FUNCTIONS) {
        console.warn('[countrySaga] API call failed, using Preview static data:', error.message);
        return PREVIEW_PROVINCES;
      }
      return error
    })
}

function* fetchProvince() {
  try {
    const provinces = yield call(getProvince)
    yield delay(500)
    yield put({ type: 'GET_PROVINCE_SUCCESS', provinces: provinces })
  } catch (e) {
    // If error and in Preview mode, use static data
    if (IS_PREVIEW_MODE) {
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
