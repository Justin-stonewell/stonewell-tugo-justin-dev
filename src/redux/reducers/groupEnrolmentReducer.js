import * as type from '../types';

const initialState = {
  result: [], //all result
  enrolment: [], //get data
  loading: false,
  error: null
}

export default function groupEnrolmentReducer(state = initialState, action) {
  switch(action.type) {

      case type.GET_GROUP_ENROLMENT_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_GROUP_ENROLMENT_SUCCESS: 
        return {
          ...state,
          loading: false,
          enrolment: action.enrolment.data
        }
      case type.GET_GROUP_ENROLMENT_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }

      case type.POST_GROUP_ENROLMENT_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.POST_GROUP_ENROLMENT_SUCCESS: 
        return {
          ...state,
          loading: false,
          result: action.result
        }
      case type.POST_GROUP_ENROLMENT_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }
      
      default:
        return state;
  }
}
