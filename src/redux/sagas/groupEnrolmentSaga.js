import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// get group enrolment info
function getGroupEnrolment(value) {
  const parmsValues = Object.values(value.payload);
  // console.log(parmsValues)
  return axios.get(`${API_URL}api/v1/group_enrolment/fr=${parmsValues[0]}&to=${parmsValues[1]}&vendor_id=${parmsValues[2]}`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in group enrolment saga: "+ error)
        return error
      })
}

function* fetchGetGroupEnrolment(value) {
  try {
    const enrolment = yield call(getGroupEnrolment, value);
    yield delay(500)
    yield put({ type: 'GET_GROUP_ENROLMENT_SUCCESS', enrolment: enrolment});
  } catch(e) {
    yield put({ type: 'GET_GROUP_ENROLMENT_FAILED', message: e.message });

  }
}
// post group enrolment info
function postGroupEnrolment(value) {
  return axios.post(`${API_URL}api/v1/group_enrolment/add`, value.payload)
      .then(res => {
        console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        console.log("error in group enrolment saga: "+ error)
        return error
      })
}

function* fetchPostGroupEnrolment(value) {
  try {;
    const result = yield call(postGroupEnrolment, value);
    yield delay(500)
    yield put({ type: 'POST_GROUP_ENROLMENT_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_GROUP_ENROLMENT_FAILED', message: e.message });

  }
}

// update (put) status application
// function updateStatusCreditCard(value) {
//   return axios.put(`${API_URL}api/v1/credit_card/update/process/creditcard_id=${value.payload.creditcard_id}`, value.payload.data)
//       .then(res => {
//         // console.log('saga- result',res.data)
//         return res.data
//       }).catch((error)=>{
//         // console.log("error in Credit Card saga: "+ error)
//         return error
//       })
// }


// function* fetchUpdateStatusCreditCard(value) {
//   try {
//     const result = yield call(updateStatusCreditCard, value);
//     yield delay(500)
//     yield put({ type: 'PUT_CREDIT_CARD_STATUS_SUCCESS', result: result});
//   } catch(e) {
//     yield put({ type: 'PUT_CREDIT_CARD_STATUS_FAILED', message: e.message });

//   }
// }

function* groupEnrolmentSaga() {
  yield takeEvery('POST_GROUP_ENROLMENT_REQUESTED', fetchPostGroupEnrolment);
  yield takeEvery('GET_GROUP_ENROLMENT_REQUESTED', fetchGetGroupEnrolment);
//   yield takeEvery('PUT_CREDIT_CARD_STATUS_REQUESTED', fetchUpdateStatusCreditCard);
  // yield takeEvery('SEND_EMAIL_PROVIDER_REQUESTED', fetchSendEmailProvider);
}

export default groupEnrolmentSaga