import * as type from '../types';

export function getGroupEnrolment(criteriaData) {
  return {
    type: type.GET_GROUP_ENROLMENT_REQUESTED,
    payload: criteriaData,
  };
}

export function postGroupEnrolment(formData) {
  return {
    type: type.POST_GROUP_ENROLMENT_REQUESTED,
    payload: formData,
  };
}