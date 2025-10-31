import * as type from '../types';

export function postClaimRequest(formData) {
  console.log('postClaimRequest- action', formData)
  return {
    type: type.POST_CLAIM_REQUEST_REQUESTED,
    payload: formData,
  }
}


export function getClaimRequest(criteriaData) {
  return {
    type: type.GET_CLAIM_REQUEST_REQUESTED,
    payload: criteriaData,
  }
}

// export function sendEmailToProvider(formData) {
//   // console.log('sendEmailToProvider- action', formData)
//   return {
//     type: type.SEND_EMAIL_PROVIDER_REQUESTED,
//     payload: formData,
//   }
// }

export function updateStatusClaim(updateData) {
  // console.log('updateStatusClaim- action', updateData)
  return {
    type: type.PUT_CLAIM_STATUS_REQUESTED,
    payload: updateData,
  }
}