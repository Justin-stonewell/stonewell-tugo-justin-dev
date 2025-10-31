import * as type from '../types';

const initialState = {
  result: [], //all result
  claims: [], //get data
  loading: false,
  error: null,
  // sendEmailResult: [],
  // sendEmailLoading: false,
  // sendEmailError: null,  
  updatedClaim: [],
  UpdatedLoading: false,
  UpdatedError: null,
}

export default function claimReducer(state = initialState, action) {
  switch(action.type) {
        case type.POST_CLAIM_REQUEST_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.POST_CLAIM_REQUEST_SUCCESS: 
        return {
          ...state,
          loading: false,
          result: action.result
        }
      case type.POST_CLAIM_REQUEST_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }     
      
      case type.GET_CLAIM_REQUEST_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_CLAIM_REQUEST_SUCCESS: 
        return {
          ...state,
          loading: false,
          claims: action.claims.data
        }
      case type.GET_CLAIM_REQUEST_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }  

      // case type.SEND_EMAIL_PROVIDER_REQUESTED: 
      //   return {
      //     ...state,
      //     sendEmailLoading: true,
      //   }
      // case type.SEND_EMAIL_PROVIDER_SUCCESS: 
      //   return {
      //     ...state,
      //     sendEmailLoading: false,
      //     sendEmailResult: action.result
      //   }
      // case type.SEND_EMAIL_PROVIDER_FAILED:
      //   return {
      //     ...state,
      //     sendEmailLoading: false,
      //     sendEmailError: action.message
      //   } 

      // Put (update status) CLAIM
      case type.PUT_CLAIM_STATUS_REQUESTED: 
          return {
            ...state,
            UpdatedLoading: true,
          }
        case type.PUT_CLAIM_STATUS_SUCCESS: 
          return {
            ...state,
            UpdatedLoading: false,
            updatedClaim: action.result
          }
        case type.PUT_CLAIM_STATUS_FAILED:
          return {
            ...state,
            UpdatedLoading: false,
            UpdatedError: action.message
          }   

    default:
      return state;
  }
}
