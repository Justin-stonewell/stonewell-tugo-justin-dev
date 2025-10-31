import * as type from '../types';

export function postTravelQuoteOver60(formData) {
  // console.log('postRefundRequest- action', formData)
  return {
    type: type.POST_TRAVEL_QUOTE_OVER_60_REQUESTED,
    payload: formData,
  }
}


export function getTravelQuoteOver60(criteriaData) {
  return {
    type: type.GET_TRAVEL_QUOTE_OVER_60_REQUESTED,
    payload: criteriaData,
  }
}

export function sendEmailToProvider(formData) {
  // console.log('sendEmailToProvider- action', formData)
  return {
    type: type.SEND_EMAIL_PROVIDER_REQUESTED,
    payload: formData,
  }
}

export function updateTravelQuoteOver60(updateData) {
  // console.log('updateStatusRefund- action', updateData)
  return {
    type: type.PUT_TRAVEL_QUOTE_OVER_60_REQUESTED,
    payload: updateData,
  }
}