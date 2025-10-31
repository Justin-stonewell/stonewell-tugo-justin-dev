import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// get one file
function getFileFromS3(value) {
  if (!value || !value.payload) {
    // console.error("value 또는 value.payload가 존재하지 않습니다.");
    return;
  }
  const parmsValues = Object.values(value.payload);
  console.log('parmsValues',parmsValues)
   return axios.get(`${API_URL}api/v1/s3_documents/type=${parmsValues[0]}&fileName=${parmsValues[1]}`)
     .then(res => {
       return res.data
     }).catch((error)=>{
       console.log("error in s3_documents saga: "+ error)
       return error
     })
}

function* fetchFileFromS3(value) {
  try {
    const file = yield call(getFileFromS3,value);
    // console.log('Returned file data:', file);
    // file 값이 undefined인 경우 처리
    if (typeof file === 'undefined') {
      // throw new Error("getFileFromS3 함수에서 undefined 반환");
      return;
    }

    yield delay(500)
    yield put({ type: 'GET_FILE_FROMS3_SUCCESS', file: file});
  } catch(e) {
    yield put({ type: 'GET_FILE_FROMS3_FAILED', message: e.message });

  }
}

// GET_FILE_FROMS3_SUCCESS 액션을 받은 후 다운로드를 시작하는 Saga
function* downloadFileSaga(value) {
  const file = yield call(getFileFromS3,value);

  // file 값이 undefined인 경우 처리
  if (typeof file === 'undefined') {
    // console.error("getFileFromS3 함수에서 undefined 반환");
    return; // 혹은 적절한 다른 처리를 수행
  }

  if (file && file.Body && file.Body.data) {
      const blob = new Blob([new Uint8Array(file.Body.data)], {type: 'application/pdf'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "filename.pdf"; 
      link.click();
      URL.revokeObjectURL(link.href);
  }
}

function* watchDownloadFile() {
  yield takeEvery('DOWNLOAD_FILE_REQUESTED', downloadFileSaga);
}


// get multi files
function getMultiFilesFromS3(value) {

  // console.log('value',value.payload)
  const parmsValues = value.payload;
  // console.log('buildParams(parmsValues)',buildParams(parmsValues))

 return axios.get(`${API_URL}api/v1/s3_documents/search?type=${parmsValues.type}&fileName=${parmsValues.fileName}`)
     .then(res => {
       return res.data
     }).catch((error)=>{
       // console.log("error in s3_documents saga: "+ error)
       return error
     })
}

// const buildParams = (search) => {
//   if (!search) return "";

//   const params = new URLSearchParams();

//   Object.entries(search).forEach(([key, value]) => {
//     if (Array.isArray(value)) params.append(key, value.join(","));
//     else params.append(key, value.toString());
//   });

//   return `${params}`;
// };


function* fetchMultiFilesFromS3(value) {
  try {
    const files = yield call(getMultiFilesFromS3,value);
    // console.log('files in saga',files)
    yield delay(500)
    yield put({ type: 'GET_MULTIFILES_FROMS3_SUCCESS', multiFiles: files});
  } catch(e) {
    yield put({ type: 'GET_MULTIFILES_FROMS3_FAILED', message: e.message });

  }
}

function* s3Sags() {
  yield takeEvery('GET_MULTIFILES_FROMS3_REQUESTED', fetchMultiFilesFromS3);
  yield takeEvery('GET_FILE_FROMS3_REQUESTED', fetchFileFromS3);
  yield takeEvery('DOWNLOAD_FILE_REQUESTED', watchDownloadFile);
}

export default s3Sags