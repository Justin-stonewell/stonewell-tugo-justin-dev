import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// post claim
function postClaimRequest(value) {
  console.log('value postClaimRequest', value)
  return axios.post(`${API_URL}api/v1/insured_claims/add`, value.payload)
      .then(res => {
        console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        console.log("error in Claim Request saga: "+ error.message)
        return error
      })
}

function* fetchPostClaimRequest(value) {
  try {;
    const result = yield call(postClaimRequest, value);
    yield delay(500)
    yield put({ type: 'POST_CLAIM_REQUEST_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_CLAIM_REQUEST_FAILED', message: e.message });

  }
}

// get Claim_reqeusted
function getClaimRequest(value) {
  const parmsValues = Object.values(value.payload);
  return axios.get(`${API_URL}api/v1/insured_claims/fr=${parmsValues[0]}&to=${parmsValues[1]}&vendor_id=${parmsValues[2]}`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Claim Request saga: "+ error)
        return error
      })
}

function* fetchGetClaimRequest(value) {
  try {
    const claims = yield call(getClaimRequest, value);
    yield delay(500)
    yield put({ type: 'GET_CLAIM_REQUEST_SUCCESS', claims: claims});
  } catch(e) {
    yield put({ type: 'GET_CLAIM_REQUEST_FAILED', message: e.message });

  }
}


// post Claim
// function sendEmailProvider(value) {
//   return axios.post(`${API_URL}api/v1/insured_claims/send_email_provider`, value.payload)
//       .then(res => {
//         // console.log('saga- result',res.data)
//         return res.data
//       }).catch((error)=>{
//         // console.log("error in Claim Request saga: "+ error)
//         return error
//       })
// }

// function* fetchSendEmailProvider(value) {
//   try {;
//     const result = yield call(sendEmailProvider, value);
//     yield delay(500)
//     yield put({ type: 'SEND_EMAIL_PROVIDER_SUCCESS', result: result});
//   } catch(e) {
//     yield put({ type: 'SEND_EMAIL_PROVIDER_FAILED', message: e.message });

//   }
// }


// update (put) status Claim
function updateStatusClaim(value) {
  // console.log('updateStatusClaim-values', value)
  return axios.put(`${API_URL}api/v1/insured_claims/update/process/claim_id=${value.payload.claim_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Claim saga: "+ error)
        return error
      })
}

function* fetchUpdateStatusClaim(value) {
  try {
    const result = yield call(updateStatusClaim, value);
    yield delay(500)
    yield put({ type: 'PUT_CLAIM_STATUS_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_CLAIM_STATUS_FAILED', message: e.message });

  }
}


function* insuredClaimSaga() {
  yield takeEvery('POST_CLAIM_REQUEST_REQUESTED', fetchPostClaimRequest);
  yield takeEvery('GET_CLAIM_REQUEST_REQUESTED', fetchGetClaimRequest);
  // yield takeEvery('SEND_EMAIL_PROVIDER_REQUESTED', fetchSendEmailProvider);
  yield takeEvery('PUT_CLAIM_STATUS_REQUESTED', fetchUpdateStatusClaim);
}

export default insuredClaimSaga