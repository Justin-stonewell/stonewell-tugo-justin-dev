import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// post refund
function postTravelQuoteOver60(value) {
  return axios.post(`${API_URL}api/v1/travel_quotes_over60/add`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        console.log("error in TravelQuotesOver60 saga: "+ error)
        return error
      })
}

function* fetchPostTravelQuoteOver60(value) {
  try {;
    const result = yield call(postTravelQuoteOver60, value);
    yield delay(500)
    yield put({ type: 'POST_TRAVEL_QUOTE_OVER_60_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_TRAVEL_QUOTE_OVER_60_FAILED', message: e.message });

  }
}

// get refund_reqeusted
function getTravelQuoteOver60(value) {
  const parmsValues = Object.values(value.payload);
  
  return axios.get(`${API_URL}api/v1/travel_quotes_over60/fr=${parmsValues[0]}&to=${parmsValues[1]}&vendor_id=${parmsValues[2]}`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        console.log("error in TravelQuotesOver60 saga: "+ error)
        return error
      })
}


function* fetchGetTravelQuoteOver60(value) {
  try {
    const travelQuotes = yield call(getTravelQuoteOver60, value);
    yield delay(500)
    yield put({ type: 'GET_TRAVEL_QUOTE_OVER_60_SUCCESS', travelQuotes: travelQuotes});
    // console.log('saga- result travelQuotes',travelQuotes)
  } catch(e) {
    yield put({ type: 'GET_TRAVEL_QUOTE_OVER_60_FAILED', message: e.message });

  }
}


// post refund
function sendEmailProvider(value) {
  return axios.post(`${API_URL}api/v1/travel_quotes_over60/send_email_provider`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in TravelQuotesOver60 saga: "+ error)
        return error
      })
}

function* fetchSendEmailProvider(value) {
  try {;
    const result = yield call(sendEmailProvider, value);
    yield delay(500)
    yield put({ type: 'SEND_EMAIL_PROVIDER_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'SEND_EMAIL_PROVIDER_FAILED', message: e.message });

  }
}


// update (put) Travel Quote Canadian over 60
function updateTravelQuoteOver60(value) {
  console.log('updateStatusRefund-values', value)
  return axios.put(`${API_URL}api/v1/travel_quotes_over60/update/quotes/quote_id=${value.payload.quote_id}`, value.payload.data)
      .then(res => {
        console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        console.log("error in TravelQuotesOver60 saga: "+ error)
        return error
      })
}


function* fetchUpdateTravelQuoteOver60(value) {
  try {
    const result = yield call(updateTravelQuoteOver60, value);
    yield delay(500)
    yield put({ type: 'PUT_TRAVEL_QUOTE_OVER_60_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_TRAVEL_QUOTE_OVER_60_FAILED', message: e.message });

  }
}


function* travelQuotesOver60Saga() {
  yield takeEvery('POST_TRAVEL_QUOTE_OVER_60_REQUESTED', fetchPostTravelQuoteOver60);
  yield takeEvery('GET_TRAVEL_QUOTE_OVER_60_REQUESTED', fetchGetTravelQuoteOver60);
  yield takeEvery('SEND_EMAIL_PROVIDER_REQUESTED', fetchSendEmailProvider);
  yield takeEvery('PUT_TRAVEL_QUOTE_OVER_60_REQUESTED', fetchUpdateTravelQuoteOver60);
}

export default travelQuotesOver60Saga